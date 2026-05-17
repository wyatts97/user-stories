<?php

namespace Wyatts97\UserStories\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;

class BannerUploadSerializer extends AbstractSerializer
{
    protected function getDefaultAttributes(object|array $model): array
    {
        return [
            'path' => $model->path ?? $model['path'] ?? null,
            'url' => $model->url ?? $model['url'] ?? null,
        ];
    }
}
