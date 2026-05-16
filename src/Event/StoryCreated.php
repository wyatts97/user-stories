<?php

namespace Justoverclock\ProfileStories\Event;

class StoryCreated
{
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }
}
