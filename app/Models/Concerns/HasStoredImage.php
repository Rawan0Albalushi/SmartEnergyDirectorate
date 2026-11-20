<?php

namespace App\Models\Concerns;

use App\Models\Sector;
use App\Support\StoredImage;
use Illuminate\Database\Eloquent\Model;

trait HasStoredImage
{
    protected static function bootHasStoredImage(): void
    {
        static::deleting(function (Model $model): void {
            StoredImage::delete($model->getAttribute('image_path'));
        });
    }

    public function storedImageUrl(): ?string
    {
        $own = StoredImage::url($this->getAttribute('image_path'));

        if ($own !== null) {
            return $own;
        }

        if (! $this->relationLoaded('sector')) {
            return null;
        }

        $sector = $this->getRelation('sector');

        if (! $sector instanceof Sector) {
            return null;
        }

        return StoredImage::url($sector->getAttribute('image_path'));
    }
}
