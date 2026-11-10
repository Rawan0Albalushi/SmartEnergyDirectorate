<?php

namespace App\Support;

use Illuminate\Http\Request;

class LocaleUrl
{
    public static function for(Request $request, string $locale): string
    {
        $segments = $request->segments();

        if (isset($segments[0]) && in_array($segments[0], ['ar', 'en'], true)) {
            $segments[0] = $locale;
            $path = implode('/', $segments);
        } else {
            $path = $locale;
        }

        $query = $request->getQueryString();

        return url($path).($query !== null && $query !== '' ? '?'.$query : '');
    }
}
