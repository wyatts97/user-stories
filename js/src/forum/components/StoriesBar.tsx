import Component from 'flarum/common/Component';
import type { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Avatar from 'flarum/common/components/Avatar';
import type User from 'flarum/common/models/User';
import StoryViewerModal from './modals/StoryViewerModal';
import CreateStoryModal from './modals/CreateStoryModal';
import { FollowingStoriesResponse, UserStoryGroup } from '../types';

export default class StoriesBar extends Component<ComponentAttrs> {
  public loading: boolean = false;
  public storyGroups: UserStoryGroup[] = [];

  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
    this.loadStories();
  }

  loadStories() {
    if (!app.session.user) return;

    this.loading = true;

    app
      .request({
        method: 'GET',
        url: `${app.forum.attribute('apiUrl')}/following-stories`,
      })
      .then((res: unknown) => {
        const response = res as FollowingStoriesResponse;
        const stories = response.data || [];
        const included = response.included || [];

        // Group stories by user
        const grouped = new Map<string, { user: any; stories: any[] }>();

        stories.forEach((story) => {
          const userId = story.relationships?.user?.data?.id;
          if (!userId) return;

          if (!grouped.has(userId)) {
            const user = included.find((u) => u.type === 'users' && String(u.id) === String(userId));
            grouped.set(userId, { user, stories: [] });
          }

          grouped.get(userId)!.stories.push(story);
        });

        this.storyGroups = Array.from(grouped.values()) as UserStoryGroup[];
        m.redraw();
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    if (!app.session.user) return null;

    const currentUser = app.session.user as User;

    return (
      <div className="StoriesBar">
        <div className="StoriesBar-scroll">
          {/* Your Story */}
          <div
            className="StoriesBar-item StoriesBar-item--yours"
            onclick={() =>
              app.modal.show(CreateStoryModal, {
                userId: currentUser.id(),
                username: currentUser.username(),
                onCreated: () => this.loadStories(),
              })
            }
          >
            <div className="StoriesBar-ring StoriesBar-ring--yours">
              <Avatar user={currentUser} className="StoriesBar-avatar" />
            </div>
            <span className="StoriesBar-label">{app.translator.trans('wyatts97-User-Stories.forum.yourStory')}</span>
          </div>

          {/* Followed users' stories */}
          {this.storyGroups.map((group, index) => (
            <div
              className="StoriesBar-item"
              onclick={() =>
                app.modal.show(StoryViewerModal, {
                  storyGroups: this.storyGroups,
                  startIndex: index,
                  onClose: () => this.loadStories(),
                })
              }
            >
              <div className="StoriesBar-ring">
                <Avatar user={group.user} className="StoriesBar-avatar" />
              </div>
              <span className="StoriesBar-label">{group.user?.attributes?.displayName || group.user?.attributes?.username || ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
