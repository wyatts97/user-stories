<?php

use Illuminate\Database\Schema\Blueprint;

use Illuminate\Database\Schema\Builder;


return [
    'up' => function (Builder $schema) {
        $schema->table('stories', function (Blueprint $table) {
            $table->text('username');
        });
    },
    'down' => function (Builder $schema) {
        // down migration
    }
];
