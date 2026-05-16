<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->string('media_type')->default('image')->after('img_url');
            $table->text('caption')->nullable()->after('media_type');
        });
    },
    'down' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->dropColumn('media_type');
            $table->dropColumn('caption');
        });
    }
];
