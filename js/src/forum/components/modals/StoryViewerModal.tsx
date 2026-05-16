import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Avatar from 'flarum/common/components/Avatar';
import type User from 'flarum/common/models/User';
import humanTime from 'flarum/common/utils/humanTime';
import { UserStoryGroup } from '../../types';

interface StoryViewerModalAttrs extends IInternalModalAttrs {
  storyGroups: UserStoryGroup[];
  startIndex: number;
  onClose?: () => void;
}

export default class StoryViewerModal extends Modal<StoryViewerModalAttrs> {
  public currentGroupIndex: number = 0;
  public currentStoryIndex: number = 0;
  public progress: number = 0;
  public timer: ReturnType<typeof setInterval> | null = null;
  public isPaused: boolean = false;
  private readonly duration: number = 5000;
  private readonly tick: number = 50;

  className(): string {
    return 'StoryViewerModal Modal--full';
  }

  oninit(vnode: Mithril.Vnode<IInternalModalAttrs, this>) {
    super.oninit(vnode);
    this.currentGroupIndex = this.attrs.startIndex || 0;
    this.currentStoryIndex = 0;
    this.progress = 0;
    this.startTimer();
  }

  onremove() {
    this.stopTimer();
    if (this.attrs.onClose) {
      this.attrs.onClose();
    }
  }

  startTimer() {
    this.stopTimer();
    this.progress = 0;
    this.isPaused = false;

    this.timer = setInterval(() => {
      if (this.isPaused) return;

      this.progress += this.tick;

      if (this.progress >= this.duration) {
        this.nextStory();
      }

      m.redraw();
    }, this.tick);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getCurrentGroup(): UserStoryGroup | null {
    return this.attrs.storyGroups[this.currentGroupIndex] || null;
  }

  getCurrentStory() {
    const group = this.getCurrentGroup();
    if (!group) return null;
    return group.stories[this.currentStoryIndex] || null;
  }

  nextStory() {
    const group = this.getCurrentGroup();
    if (!group) return;

    if (this.currentStoryIndex < group.stories.length - 1) {
      this.currentStoryIndex++;
      this.startTimer();
    } else if (this.currentGroupIndex < this.attrs.storyGroups.length - 1) {
      this.currentGroupIndex++;
      this.currentStoryIndex = 0;
      this.startTimer();
    } else {
      this.hide();
    }
  }

  prevStory() {
    if (this.currentStoryIndex > 0) {
      this.currentStoryIndex--;
      this.startTimer();
    } else if (this.currentGroupIndex > 0) {
      this.currentGroupIndex--;
      const prevGroup = this.attrs.storyGroups[this.currentGroupIndex];
      this.currentStoryIndex = prevGroup.stories.length - 1;
      this.startTimer();
    }
  }

  handleTap(e: MouseEvent | TouchEvent) {
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3) {
      this.prevStory();
    } else if (x > width * 0.7) {
      this.nextStory();
    } else {
      this.isPaused = !this.isPaused;
      m.redraw();
    }
  }

  view(vnode: Mithril.Vnode<IInternalModalAttrs, this>): Mithril.Children {
    const group = this.getCurrentGroup();
    const story = this.getCurrentStory();

    if (!group || !story) {
      return (
        <div className="Modal-body">
          <div className="StoryViewerModal-container">
            <p>{app.translator.trans('wyatts97-User-Stories.forum.noStories')}</p>
          </div>
        </div>
      );
    }

    const storyAttrs = story.attributes;
    const user = group.user as User;
    const totalStories = group.stories.length;
    const mediaUrl = storyAttrs.mediaUrl || storyAttrs.imgUrl;

    return (
      <div className="Modal-body">
        <div className="StoryViewerModal-container">
          {/* Progress bars */}
          <div className="StoryViewerModal-progress">
            {group.stories.map((_, idx) => (
              <div className="StoryViewerModal-progressTrack">
                <div
                  className="StoryViewerModal-progressFill"
                  style={{
                    width:
                      idx < this.currentStoryIndex
                        ? '100%'
                        : idx === this.currentStoryIndex
                        ? `${(this.progress / this.duration) * 100}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="StoryViewerModal-header">
            <div className="StoryViewerModal-user">
              <Avatar user={user} className="StoryViewerModal-avatar" />
              <span className="StoryViewerModal-username">
                {user?.attributes?.displayName || user?.attributes?.username || ''}
              </span>
              <span className="StoryViewerModal-time">{humanTime(new Date(storyAttrs.createdAt))}</span>
            </div>
            <button className="Button Button--icon StoryViewerModal-close" onclick={() => this.hide()}>
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Media */}
          <div
            className="StoryViewerModal-media"
            onclick={this.handleTap.bind(this)}
            ontouchstart={this.handleTap.bind(this)}
          >
            {mediaUrl ? (
              <img src={mediaUrl} alt={storyAttrs.title} className="StoryViewerModal-image" />
            ) : (
              <div className="StoryViewerModal-noMedia">
                <i className="fas fa-image" />
                <span>{app.translator.trans('wyatts97-User-Stories.forum.noImage')}</span>
              </div>
            )}

            {/* Tap zones for prev/next */}
            <div className="StoryViewerModal-tapZone StoryViewerModal-tapZone--left" />
            <div className="StoryViewerModal-tapZone StoryViewerModal-tapZone--right" />
          </div>

          {/* Caption / info */}
          <div className="StoryViewerModal-footer">
            {storyAttrs.caption && <p className="StoryViewerModal-caption">{storyAttrs.caption}</p>}
            {storyAttrs.contentLink && (
              <a
                href={storyAttrs.contentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="Button StoryViewerModal-link"
              >
                {storyAttrs.contentCta || app.translator.trans('wyatts97-User-Stories.forum.viewLink')}
              </a>
            )}
          </div>

          {/* Story counter */}
          <div className="StoryViewerModal-counter">
            <span>
              {this.currentStoryIndex + 1} / {totalStories}
            </span>
          </div>
        </div>
      </div>
    );
  }
}
