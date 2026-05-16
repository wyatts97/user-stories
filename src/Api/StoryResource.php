<?php

namespace Justoverclock\ProfileStories\Api;

use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Flarum\Filter\FilterState;
use Flarum\Http\RequestUtil;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;
use Justoverclock\ProfileStories\Model\Story;
use Tobscure\JsonApi\Document;

/**
 * @extends Resource\AbstractDatabaseResource<Story>
 */
class StoryResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'stories';
    }

    public function model(): string
    {
        return Story::class;
    }

    public function scope(Builder $query, Context $context): void
    {
        $query->with('user');
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->visibleTo(fn ($actor) => $actor->can('viewStory'))
                ->filter(fn (FilterState $filter, Context $context) => $this->applyFilters($filter, $context)),

            Endpoint\Show::make()
                ->visibleTo(fn ($actor) => $actor->can('viewStory')),

            Endpoint\Create::make()
                ->mutateBy(fn ($actor) => $actor->can('createStory'))
                ->data(fn (Context $context) => $this->prepareCreateData($context)),

            Endpoint\Update::make()
                ->mutateBy(fn ($actor, Story $story) => $actor->can('editStory')),

            Endpoint\Delete::make()
                ->mutateBy(fn ($actor, Story $story) => $actor->can('deleteStory')),

            Endpoint\Custom::make('following-stories')
                ->route('GET', '/following-stories')
                ->visibleTo(fn ($actor) => !$actor->isGuest())
                ->data(fn (Context $context) => $this->followingStories($context)),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('title'),
            Schema\Str::make('mediaUrl')->get(fn (Story $story) => $story->media_url ?? $story->img_url),
            Schema\Str::make('imgUrl')->get(fn (Story $story) => $story->img_url),
            Schema\Str::make('caption'),
            Schema\Str::make('mediaType'),
            Schema\Str::make('cta'),
            Schema\Str::make('contentIcon'),
            Schema\Str::make('contentText'),
            Schema\Str::make('contentCta'),
            Schema\Str::make('contentLink'),
            Schema\Str::make('username'),
            Schema\DateTime::make('expiresAt'),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),

            Schema\Relationship\ToOne::make('user')
                ->includable()
                ->inverse('stories')
                ->type('users'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('createdAt'),
        ];
    }

    protected function applyFilters(FilterState $filter, Context $context): void
    {
        $query = $filter->getQuery();

        if ($userId = $filter->getQueryParam('userId')) {
            $query->where('user_id', $userId);
        }
    }

    protected function prepareCreateData(Context $context): array
    {
        $data = $context->body()['data']['attributes'] ?? [];
        $data['expires_at'] = now()->addHours(24);
        return $data;
    }

    protected function followingStories(Context $context): mixed
    {
        $actor = RequestUtil::getActor($context->request);

        $followedUserIds = $actor->followedUsers()
            ->pluck('followed_user_id')
            ->toArray();

        if (empty($followedUserIds)) {
            return [];
        }

        return Story::query()
            ->active()
            ->forUsers($followedUserIds)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
