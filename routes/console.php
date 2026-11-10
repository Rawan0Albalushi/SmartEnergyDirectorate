<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('news:fetch')
    ->hourly()
    ->withoutOverlapping(30);
