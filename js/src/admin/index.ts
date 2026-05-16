import app from 'flarum/admin/app';
import StoriesSettingsPage from './components/StoriesSettingsPage';

app.initializers.add('wyatts97/User-Stories', () => {
  app.extensionData
    .for('wyatts97-User-Stories')
    .registerPage(StoriesSettingsPage)
    .registerPermission(
      {
        icon: 'fas fa-book-open',
        label: app.translator.trans('wyatts97-User-Stories.admin.permission.createStory'),
        permission: 'createStory',
        allowGuest: false,
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-book-open',
        label: app.translator.trans('wyatts97-User-Stories.admin.permission.viewStory'),
        permission: 'viewStory',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-book-open',
        label: app.translator.trans('wyatts97-User-Stories.admin.permission.editStory'),
        permission: 'editStory',
        allowGuest: false,
      },
      'moderate'
    )
    .registerPermission(
      {
        icon: 'fas fa-book-open',
        label: app.translator.trans('wyatts97-User-Stories.admin.permission.deleteStory'),
        permission: 'deleteStory',
        allowGuest: false,
      },
      'moderate'
    );
});
