import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import UserStories from './pages/UserStories';
import UserPage from 'flarum/forum/components/UserPage';
import Mithril from 'mithril';
import ItemList from 'flarum/common/utils/ItemList';
import UserCard from 'flarum/forum/components/UserCard';
import LinkButton from 'flarum/common/components/LinkButton';
import icon from 'flarum/common/helpers/icon';
import type User from 'flarum/common/models/User';
import IndexPage from 'flarum/forum/components/IndexPage';
import StoriesBar from './components/StoriesBar';
import NewStoryNotification from './components/notifications/NewStoryNotification';
import NotificationGrid from 'flarum/forum/components/NotificationGrid';
import { REP_NOTIFICATIONS } from './notifications';

app.initializers.add('wyatts97/User-Stories', () => {
  app.notificationComponents.newStory = NewStoryNotification;

  app.routes['user.stories'] = {
    path: '/u/:username/stories',
    component: UserStories,
  };

  extend(NotificationGrid.prototype, 'notificationTypes', function (items) {
    REP_NOTIFICATIONS.forEach((notification) => {
      items.add(notification.name, {
        name: notification.name,
        icon: notification.icon,
        label: notification.label,
      });
    });
  });

  // Inject StoriesBar below the header on the index page
  override(IndexPage.prototype, 'view', function (original, ...args) {
    const vnode = original.apply(this, args);

    if (vnode && vnode.children && Array.isArray(vnode.children)) {
      vnode.children.unshift(<StoriesBar />);
    }

    return vnode;
  });

  extend(UserCard.prototype, 'infoItems', function (items) {
    const user = this.attrs.user as User;
    const storyCount = user.data?.attributes?.storyCount;
    if (user && app.session.user) {
      items.add(
        'storiesCount',
        <span className="UserCard-storiesCount">
          {icon('fas fa-book-open')}
          {app.translator.trans('wyatts97-User-Stories.forum.stories-count', { count: storyCount })}
        </span>
      );
    }
  });

  extend(UserPage.prototype, 'navItems', function (items: ItemList<Mithril.Children>) {
    const user = this.user;

    if (user) {
      items.add(
        'profilestories',
        <LinkButton href={app.route('user.stories', { username: user?.slug() })} name="stories" icon="fas fa-book-open">
          {app.translator.trans('wyatts97-User-Stories.forum.stories')}
        </LinkButton>
      );
    }
  });
});
