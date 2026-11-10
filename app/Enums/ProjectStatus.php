<?php

namespace App\Enums;

enum ProjectStatus: string
{
    case Planned = 'planned';
    case Ongoing = 'ongoing';
    case Completed = 'completed';
}
