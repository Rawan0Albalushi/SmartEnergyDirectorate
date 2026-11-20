<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['key', 'value'])]
class SiteSetting extends Model
{
    public const HERO = 'hero_image';

    public static function value(string $key): ?string
    {
        $value = static::query()->where('key', $key)->value('value');

        return is_string($value) && $value !== '' ? $value : null;
    }

    public static function put(string $key, ?string $value): void
    {
        static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value],
        );
    }
}
