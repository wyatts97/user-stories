<?php

/*
 * This file is part of wyatts97/User-Stories.
 *
 * Copyright (c) 2024 Marco Colia.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Wyatts97\UserStories;

use Flarum\Api\Resource\UserResource;
use Flarum\Extend;
use Flarum\User\User;
use Wyatts97\UserStories\Api\StoryResource;
use Wyatts97\UserStories\Command\DeleteExpiredStoriesCommand;
use Wyatts97\UserStories\Controller\BannerUploadController;
use Wyatts97\UserStories\Event\StoryCreated;
use Wyatts97\UserStories\Listener\SendNotificationOnNewStory;
use Wyatts97\UserStories\Model\Story;
use Wyatts97\UserStories\Notification\NewStoryNotificationBlueprint;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),
    (new Extend\Locales(__DIR__.'/locale')),

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

    (new Extend\Console())
        ->command(DeleteExpiredStoriesCommand::class),

    (new Extend\Settings)
        ->serializeToForum('wyatts97-User-Stories.imagePreview', 'wyatts97-User-Stories.imagePreview'),
    (new Extend\Cors)
        ->allowOrigin('*')
        ->allowMethods(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'])
        ->allowHeaders(['Content-Type', 'Authorization']),
];
