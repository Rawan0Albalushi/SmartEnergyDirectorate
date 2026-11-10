<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class SlugGenerator
{
    /**
     * @param  class-string<Model>  $modelClass
     */
    public function make(string $title, string $modelClass, ?int $ignoreId = null): string
    {
        $base = Str::slug(Str::limit($title, 80, ''));

        if ($base === '') {
            $base = 'item-'.Str::lower(Str::random(8));
        }

        $base = Str::limit($base, 180, '');
        $slug = $base;
        $suffix = 2;

        while ($this->exists($modelClass, $slug, $ignoreId)) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }

    /**
     * @param  class-string<Model>  $modelClass
     */
    private function exists(string $modelClass, string $slug, ?int $ignoreId): bool
    {
        return $modelClass::query()
            ->where('slug', $slug)
            ->when($ignoreId !== null, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists();
    }
}
