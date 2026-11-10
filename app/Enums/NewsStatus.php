<?php

namespace App\Enums;

enum NewsStatus: string
{
    case Pending = 'pending';
    case Published = 'published';
    case Rejected = 'rejected';
}
