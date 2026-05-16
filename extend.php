<?php

/*
 * This file is part of justoverclock/profile-stories.
 *
 * Copyright (c) 2024 Marco Colia.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Justoverclock\ProfileStories;

use Flarum\Api\Resource\UserResource;
use Flarum\Extend;
use Flarum\User\User;
use Justoverclock\ProfileStories\Api\StoryResource;
use Justoverclock\ProfileStories\Controller\BannerUploadController;
use Justoverclock\ProfileStories\Event\StoryCreated;
use Justoverclock\ProfileStories\Listener\SendNotificationOnNewStory;
use Justoverclock\ProfileStories\Model\Story;
use Justoverclock\ProfileStories\Notification\NewStoryNotificationBlueprint;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Model(User::class))
        ->hasMany('stories', Story::class),

    (new Extend\Model(Story::class))
        ->belongsTo('user', User::class, 'user_id'),

    (new Extend\Notification())
        ->type(NewStoryNotificationBlueprint::class, UserResource::class, ['alert']),

    (new Extend\ApiResource(StoryResource::class)),

    (new Extend\Routes('api'))
        ->post('/banner/upload', 'banner.upload', BannerUploadController::class),

    (new Extend\ApiResource(UserResource::class))
        ->fields(AddStoryAttributes::class),

    (new Extend\Event())
        ->listen(StoryCreated::class, SendNotificationOnNewStory::class, 'handle'),

    (new Extend\Settings)
        ->serializeToForum('justoverclock-profile-stories.imagePreview', 'justoverclock-profile-stories.imagePreview'),
];
