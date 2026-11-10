<?php

namespace App\Enums;

enum ContentOrigin: string
{
    case Manual = 'manual';
    case Fetched = 'fetched';
}
