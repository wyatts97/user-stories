<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->dateTime('expires_at')->nullable()->after('content_link');
            $table->index('expires_at');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->dropIndex(['expires_at']);
            $table->dropColumn('expires_at');
        });
    }
];
