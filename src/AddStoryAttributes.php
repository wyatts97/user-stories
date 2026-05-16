<?php

namespace Justoverclock\ProfileStories;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddStoryAttributes
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        if (!$actor->isGuest()) {
            $attributes['storyCount'] = $user->stories()->count();
        }

        $attributes['canCreateStory'] = $actor->can('createStory', $user);
        $attributes['canViewGlobalStories'] = $actor->can('viewStory', $user);
        $attributes['canDeleteStory'] = $actor->can('deleteStory', $user);
        $attributes['canEditStory'] = $actor->can('editStory', $user);

        return $attributes;
    }
}
