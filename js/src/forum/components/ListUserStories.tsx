import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import CreateStoryModal from './modals/CreateStoryModal';
import PermissionDenied from './PermissionDenied';
import { ApiStoryResponse, Story, UserStoryGroup } from '../types';
import StoryViewerModal from './modals/StoryViewerModal';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import User from 'flarum/common/models/User';
import EditStoryModal from "./modals/EditStoryModal";

export type CreateStoryAttrs = {
  user: User;
  userId: number | string;
};

export default class ListUserStories extends Component<CreateStoryAttrs> {
  public userStories: ApiStoryResponse | null = null;
  public currentPage: number = 1;
  public totalPages: number = 1;
  public loading: boolean = false;

  oninit(vnode: Mithril.Vnode<ComponentAttrs, this>) {
    super.oninit(vnode);
    this.loading = false;
    this.currentPage = 1;
    this.totalPages = 1;
    this.getAllUserStory();
  }

  showCreateStoryModal() {
    app.modal.show(CreateStoryModal, {
      onCreated: this.getAllUserStory.bind(this),
      username: this.attrs.user.data?.attributes?.username,
      userId: this.attrs.user.id(),
    });
  }

  getAllUserStory(url = `${app.forum.attribute('apiUrl')}/stories?userId=${this.attrs.userId}`) {
    this.loading = true;

    app
      .request({
        method: 'GET',
        url,
      })
      .then((res) => {
        this.userStories = res as ApiStoryResponse;
        m.redraw();
      })
      .catch((error) => {
        console.error('Failed to load stories:', error);
        app.alerts.show({ type: 'error' }, app.translator.trans('wyatts97-User-Stories.forum.errorLoadingStories'));
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  deleteStory(storyId: string) {
    app
      .request({
        method: 'DELETE',
        url: `${app.forum.attribute('apiUrl')}/stories/${storyId}`,
      })
      .then(() => {
        this.getAllUserStory();
        app.alerts.show({ type: 'success' }, app.translator.trans('wyatts97-User-Stories.forum.successDelete'));
      })
      .catch((error) => {
        console.error('Failed to delete story:', error);
        app.alerts.show({ type: 'error' }, app.translator.trans('wyatts97-User-Stories.forum.storyCreatedError'));
      });
  }

  view(vnode: Mithril.Vnode<ComponentAttrs, this>): Mithril.Children {
    const user = this.attrs.user;
    const canCreateStory = user?.data.attributes?.canCreateStory || false;
    const canDeleteStory = user?.data.attributes?.canDeleteStory || false;
    const canEditStory = user?.data.attributes?.canEditStory || false;

    return (
      <div className="PostsUserPage">
        {this.loading && <LoadingIndicator />}
        {!this.loading && (
          <div className="stories-content">
            {!canCreateStory && <PermissionDenied />}
            {canCreateStory && (
              <button onclick={this.showCreateStoryModal.bind(this)} className="Button Button--primary stories-btn">
                {app.translator.trans('wyatts97-User-Stories.forum.createStory')}
              </button>
            )}
            <div className="stories-all">
              {this.userStories &&
                this.userStories.data.map((story) => (
                  <div
                    className="story-item"
                    style={{
                      backgroundImage: `url(${story.attributes.imgUrl})`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className="story-text-wrapper">
                      <h3>
                        <i style={{ marginRight: '5px' }} class={`${story.attributes.contentIcon}`}></i>
                      </h3>
                      <p>{story.attributes.title}</p>
                    </div>
                    <div className="story-actions-btn">
                      <button
                        onclick={() => {
                          const group: UserStoryGroup = { user: this.attrs.user, stories: this.userStories!.data };
                          const startIndex = this.userStories!.data.findIndex((s) => s.id === story.id);
                          app.modal.show(StoryViewerModal, { storyGroups: [group], startIndex: Math.max(0, startIndex) });
                        }}
                        className="Button"
                        aria-label={story.attributes.title || app.translator.trans('wyatts97-User-Stories.forum.viewLink')}
                      >
                        {story.attributes.cta || app.translator.trans('wyatts97-User-Stories.forum.viewLink')}
                      </button>
                      {canEditStory && (
                        <button
                          onclick={() => app.modal.show(EditStoryModal, { story, user  })}
                          className="Button"
                          aria-label={app.translator.trans('wyatts97-User-Stories.forum.editStoryModal')}
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                      )}
                      {canDeleteStory && (
                        <button onclick={() => this.deleteStory(story.id)} className="Button Button--danger" aria-label={app.translator.trans('wyatts97-User-Stories.forum.successDelete')}>
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {this.userStories && (this.userStories.links.prev || this.userStories.links.first || this.userStories.links.next) && (
          <div className="user-story-pagination">
            <button
              disabled={!this.userStories?.links.prev && !this.userStories?.links.first}
              class="Button"
              onclick={() => {
                const link = this.userStories?.links.prev ?? this.userStories?.links.first;
                this.getAllUserStory(link);
              }}
              aria-label={app.translator.trans('wyatts97-User-Stories.forum.prevPage')}
            >
              {app.translator.trans('wyatts97-User-Stories.forum.prevPage')}
            </button>
            <button
              disabled={!this.userStories?.links.next}
              class="Button"
              onclick={() => this.getAllUserStory(this.userStories?.links.next)}
              aria-label={app.translator.trans('wyatts97-User-Stories.forum.nextPage')}
            >
              {app.translator.trans('wyatts97-User-Stories.forum.nextPage')}
            </button>
          </div>
        )}
      </div>
    );
  }
}
