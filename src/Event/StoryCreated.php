<?php

namespace Wyatts97\UserStories\Event;

class StoryCreated
{
    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }
}
