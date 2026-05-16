import Modal, { IInternalModalAttrs } from 'flarum/common/components/Modal';
import Mithril from 'mithril';
import app from 'flarum/forum/app';
import Stream from 'flarum/common/utils/Stream';

export interface CreateStoryModalAttrs extends IInternalModalAttrs {
  userId: string | number;
  username: string;
  onCreated?: () => void;
}

export default class CreateStoryModal extends Modal<CreateStoryModalAttrs> {
  mediaUrl = Stream('');
  caption = Stream('');
  storyTitle = Stream('');
  contentLink = Stream('');
  contentCta = Stream('');
  loading: boolean = false;

  className(): string {
    return 'CreateStoryModal Modal--small';
  }

  title(): Mithril.Children {
    return app.translator.trans('justoverclock-profile-stories.forum.createStory');
  }

  content(): Mithril.Children {
    const previewUrl = this.mediaUrl();

    return (
      <div className="CreateStoryModal-content">
        {/* Media preview */}
        <div className="CreateStoryModal-preview">
          {previewUrl ? (
            <img src={previewUrl} alt="Story preview" className="CreateStoryModal-previewImg" />
          ) : (
            <div className="CreateStoryModal-placeholder">
              <i className="fas fa-image" />
              <span>{app.translator.trans('justoverclock-profile-stories.forum.previewPlaceholder')}</span>
            </div>
          )}
        </div>

        {/* Inputs */}
        <div className="CreateStoryModal-form">
          <input
            value={this.mediaUrl()}
            oninput={(e: { target: { value: string } }) => this.mediaUrl(e.target.value)}
            placeholder={app.translator.trans('justoverclock-profile-stories.forum.mediaUrlPlaceholder')}
            className="FormControl"
            type="url"
          />
          <input
            value={this.storyTitle()}
            oninput={(e: { target: { value: string } }) => this.storyTitle(e.target.value)}
            placeholder={app.translator.trans('justoverclock-profile-stories.forum.storyTitle')}
            className="FormControl"
            type="text"
          />
          <textarea
            rows={3}
            value={this.caption()}
            oninput={(e: { target: { value: string } }) => this.caption(e.target.value)}
            placeholder={app.translator.trans('justoverclock-profile-stories.forum.captionPlaceholder')}
            className="FormControl"
          />
          <div className="CreateStoryModal-advanced">
            <input
              value={this.contentLink()}
              oninput={(e: { target: { value: string } }) => this.contentLink(e.target.value)}
              placeholder={app.translator.trans('justoverclock-profile-stories.forum.linkPlaceholder')}
              className="FormControl"
              type="url"
            />
            <input
              value={this.contentCta()}
              oninput={(e: { target: { value: string } }) => this.contentCta(e.target.value)}
              placeholder={app.translator.trans('justoverclock-profile-stories.forum.linkCtaPlaceholder')}
              className="FormControl"
              type="text"
            />
          </div>
        </div>

        <div className="CreateStoryModal-actions">
          <button className="Button" onclick={() => this.hide()}>
            {app.translator.trans('justoverclock-profile-stories.forum.cancelBtn')}
          </button>
          <button
            className="Button Button--primary"
            disabled={!this.mediaUrl() || this.loading}
            onclick={this.submit.bind(this)}
          >
            {this.loading ? (
              <i className="fas fa-spinner fa-spin" />
            ) : (
              app.translator.trans('justoverclock-profile-stories.forum.shareStoryBtn')
            )}
          </button>
        </div>
      </div>
    );
  }

  submit() {
    if (!this.mediaUrl()) return;

    this.loading = true;

    app
      .request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/stories`,
        body: {
          data: {
            attributes: {
              title: this.storyTitle() || 'Story',
              media_url: this.mediaUrl(),
              img_url: this.mediaUrl(),
              caption: this.caption(),
              media_type: 'image',
              content_link: this.contentLink(),
              content_cta: this.contentCta(),
            },
          },
        },
      })
      .then(() => {
        this.loading = false;
        this.hide();
        app.alerts.show({ type: 'success' }, app.translator.trans('justoverclock-profile-stories.forum.storyCreatedSuccess'));
        if (this.attrs.onCreated) {
          this.attrs.onCreated();
        }
      })
      .catch(() => {
        this.loading = false;
        app.alerts.show({ type: 'error' }, app.translator.trans('justoverclock-profile-stories.forum.storyCreatedError'));
        m.redraw();
      });
  }
}
