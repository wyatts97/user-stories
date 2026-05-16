<?php

namespace Justoverclock\ProfileStories\Model;

use Flarum\Database\AbstractModel;
use Flarum\User\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Story extends AbstractModel
{
    protected $table = 'stories';
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'title',
        'media_url',
        'img_url',
        'cta',
        'content_icon',
        'content_text',
        'content_cta',
        'content_link',
        'media_type',
        'caption',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopeActive($query)
    {
        return $query->where('expires_at', '>', now());
    }

    public function scopeForUsers($query, array $userIds)
    {
        return $query->whereIn('user_id', $userIds);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($story) {
            if (!$story->expires_at) {
                $story->expires_at = now()->addHours(24);
            }
        });
    }
}
