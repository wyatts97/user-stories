# Profile Stories (free)

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/justoverclock/profile-stories.svg)](https://packagist.org/packages/justoverclock/profile-stories) [![Total Downloads](https://img.shields.io/packagist/dt/justoverclock/profile-stories.svg)](https://packagist.org/packages/justoverclock/profile-stories)

A [Flarum](https://flarum.org) extension. Profile Stories for Flarum

## Custom stories for Flarum Users
This extension is sponsored by [Capybara](https://discuss.flarum.org/u/Capybara), and add
a custom stories system for users. Groups or users with permissions "canCreateStory" can
create a story on a user profile that is displayed in:

- User profile card (as a count)
- User profile page (as a list of cards)
- Custom page that shows all users stories together
- Notifications for new stories

![all](https://res.cloudinary.com/dt74zb1rv/image/upload/v1736261982/qiy1jkmrmtxxb4nhdqw4.png)
![all](https://res.cloudinary.com/dt74zb1rv/image/upload/v1736262126/dw4guylolu8msttdyxp9.png)
![all](https://res.cloudinary.com/dt74zb1rv/image/upload/v1736262195/qtonbxllp6efmakcmkon.png)
![all](https://res.cloudinary.com/dt74zb1rv/image/upload/v1736262261/ormqtravzyelv5aza6dl.png)
![all](https://res.cloudinary.com/dt74zb1rv/image/upload/v1736262318/uygeyulanzzr2ezbwspo.png)



## Installation

Install with composer:

```sh
composer require justoverclock/profile-stories:"*"
```

## Updating

```sh
composer update justoverclock/profile-stories:"*"
php flarum migrate
php flarum cache:clear
```

## Links

- [Packagist](https://packagist.org/packages/justoverclock/profile-stories)
- [GitHub](https://github.com/justoverclock/profile-stories)
- [Discuss](https://discuss.flarum.org/d/PUT_DISCUSS_SLUG_HERE)
