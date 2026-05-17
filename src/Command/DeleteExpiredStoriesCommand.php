<?php

namespace Wyatts97\UserStories\Command;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Console\Command;
use Wyatts97\UserStories\Model\Story;

class DeleteExpiredStoriesCommand extends Command
{
    protected $signature = 'stories:delete-expired';
    protected $description = 'Delete expired stories from the database';

    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        parent::__construct();
        $this->settings = $settings;
    }

    public function handle(): int
    {
        $deleted = Story::query()
            ->where('expires_at', '<', now())
            ->delete();

        $this->info("Deleted {$deleted} expired stories.");

        return 0;
    }
}