<?php

namespace Justoverclock\ProfileStories\Notification;

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\User\User;
use Justoverclock\ProfileStories\Model\Story;

class NewStoryNotificationBlueprint implements BlueprintInterface
{
    public Story $story;

    public function __construct(Story $story)
    {
        $this->story = $story;
    }

    public function getSubject()
    {
        return $this->story;
    }

    public function getFromUser()
    {
        return User::query()->where('username', $this->story->username)->first();
    }

    public function getData(): array
    {
        return [
            'message' => 'You have a new story!',
        ];
    }

    public static function getType()
    {
        return 'newStory';
    }

    public static function getSubjectModel()
    {
        return User::class;
    }
}
