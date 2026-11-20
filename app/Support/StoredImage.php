<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class StoredImage
{
    public static function url(mixed $path): ?string
    {
        if (! is_string($path) || $path === '') {
            return null;
        }

        return Storage::disk('public')->url($path);
    }

    public static function replace(mixed $current, mixed $file, bool $remove, string $directory): ?string
    {
        $previous = is_string($current) && $current !== '' ? $current : null;

        if (! $file instanceof UploadedFile && ! $remove) {
            return $previous;
        }

        $next = $previous;

        if ($file instanceof UploadedFile) {
            $stored = $file->store($directory, 'public');
            $next = is_string($stored) ? $stored : $previous;
        } else {
            $next = null;
        }

        if ($previous !== null && $previous !== $next) {
            Storage::disk('public')->delete($previous);
        }

        return $next;
    }

    public static function delete(mixed $path): void
    {
        if (is_string($path) && $path !== '') {
            Storage::disk('public')->delete($path);
        }
    }
}
