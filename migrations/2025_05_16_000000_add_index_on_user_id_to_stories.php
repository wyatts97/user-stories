<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->index('user_id');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });
    }
];