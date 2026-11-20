<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedText;
use App\Models\Concerns\HasStoredImage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $sector_id
 * @property string $title_ar
 * @property string $title_en
 * @property string $summary_ar
 * @property string $summary_en
 * @property int $year
 * @property bool $is_published
 * @property string|null $image_path
 * @property Sector|null $sector
 */
#[Fillable([
    'sector_id',
    'title_ar',
    'title_en',
    'summary_ar',
    'summary_en',
    'year',
    'is_published',
])]
class Achievement extends Model
{
    use HasLocalizedText;
    use HasStoredImage;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Sector, $this>
     */
    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    /**
     * @param  Builder<Achievement>  $query
     * @return Builder<Achievement>
     */
    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where($query->getModel()->getTable().'.is_published', true);
    }

    /**
     * @return array{
     *     id: int,
     *     title: string,
     *     summary: string,
     *     year: int,
     *     sector: array{slug: string, name: string}|null,
     *     imageUrl: ?string
     * }
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->localized('title'),
            'summary' => $this->localized('summary'),
            'year' => $this->year,
            'imageUrl' => $this->storedImageUrl(),
            'sector' => $this->relationLoaded('sector') && $this->sector !== null
                ? [
                    'slug' => $this->sector->slug,
                    'name' => $this->sector->localized('name'),
                ]
                : null,
        ];
    }
}
