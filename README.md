# Profile Stories — Instagram-Style Fork

![License](https://img.shields.io/badge/license-MIT-blue.svg)

A modern, Instagram-style stories extension for [Flarum](https://flarum.org). This is a fork of [justoverclock/profile-stories](https://github.com/justoverclockl/profile-stories) rebuilt for **Flarum 2.x** with a completely redesigned user experience.

## What's New

This fork transforms the original simple profile stories into a polished, Instagram-like stories system:

- **24-hour expiring stories** — Stories automatically expire after 24 hours and are hidden from the feed
- **Follow-based stories bar** — Logged-in users see a horizontal scrollable bar of circle avatars from users they follow, displayed on the home/index page
- **Instagram-style gradient rings** — Unseen stories get a colorful conic-gradient ring around the avatar (just like Instagram)
- **Full-screen story viewer** — Tap left/right to navigate, segmented progress bars at the top, auto-advance timer, caption overlay
- **Polished create modal** — Single-step story composer with live image preview, caption input, and optional link CTA
- **Removed global stories page** — Stories are now follow-based instead of a global listing
- **Flarum 2.x compatible** — Built on the new `ApiResource` architecture

## Requirements

- **Flarum `^2.0`**
- **[ianm/follow-users](https://github.com/imorland/follow-users)** — Required dependency for the follow system

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

## Features

- Create stories with images, captions, and optional link CTAs
- Stories appear in a horizontal bar on the **index page** for logged-in users
- Only shows stories from **followed users** (via `ianm/follow-users`)
- Stories **expire after 24 hours** and are automatically filtered out
- Profile stories page (`/u/:username/stories`) is still available
- Notifications when someone creates a new story
- Permission-based story creation, editing, and deletion

## Credits

- Original extension by [Marco Colia (justoverclock)](https://github.com/justoverclockl/profile-stories)
- Fork rebuilt for Flarum 2.x with Instagram-style UX

## Links

- [Original Repository](https://github.com/justoverclockl/profile-stories)
