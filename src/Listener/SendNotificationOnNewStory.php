<?php

namespace Wyatts97\UserStories\Listener;

use Flarum\Notification\NotificationSyncer;
use Flarum\Settings\SettingsRepositoryInterface;
use Wyatts97\UserStories\Event\StoryCreated;
use Wyatts97\UserStories\Notification\NewStoryNotificationBlueprint;
use Symfony\Contracts\Translation\TranslatorInterface;

class SendNotificationOnNewStory
{
    protected NotificationSyncer $notifications;
    protected TranslatorInterface $translator;
    protected SettingsRepositoryInterface $settings;

    public function __construct(NotificationSyncer $notifications, TranslatorInterface $translator, SettingsRepositoryInterface $settings)
    {
        $this->notifications = $notifications;
        $this->translator = $translator;
        $this->settings = $settings;
    }

    public function handle(StoryCreated $event)
    {
        $story = $event->data;
        $creator = $story->user;

        if (!$creator) {
            return;
        }

        // Notify followers of the story creator
        if (method_exists($creator, 'followers')) {
            $recipients = $creator->followers()
                ->where('users.id', '!=', $creator->id)
                ->get();
        } else {
            // Fallback: notify the creator if follow extension not installed
            $recipients = [$creator];
        }

        if ($recipients->isEmpty() && !is_array($recipients)) {
            return;
        }

        $this->notifications->sync(
            new NewStoryNotificationBlueprint($story),
            $recipients instanceof \Illuminate\Support\Collection ? $recipients->all() : $recipients
        );
    }
}
