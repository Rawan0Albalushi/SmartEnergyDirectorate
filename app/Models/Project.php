<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Models\Concerns\HasLocalizedText;
use App\Models\Concerns\HasStoredImage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $sector_id
 * @property string $slug
 * @property string $title_ar
 * @property string $title_en
 * @property string $summary_ar
 * @property string $summary_en
 * @property string|null $body_ar
 * @property string|null $body_en
 * @property ProjectStatus $status
 * @property string|null $location_ar
 * @property string|null $location_en
 * @property int $year
 * @property bool $is_published
 * @property string|null $image_path
 * @property Sector|null $sector
 */
#[Fillable([
    'sector_id',
    'slug',
    'title_ar',
    'title_en',
    'summary_ar',
    'summary_en',
    'body_ar',
    'body_en',
    'status',
    'location_ar',
    'location_en',
    'year',
    'is_published',
])]
class Project extends Model
{
    use HasLocalizedText;
    use HasStoredImage;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ProjectStatus::class,
            'is_published' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return BelongsTo<Sector, $this>
     */
    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    /**
     * @param  Builder<Project>  $query
     * @return Builder<Project>
     */
    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where($query->getModel()->getTable().'.is_published', true);
    }

    /**
     * @return array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     status: string,
     *     year: int,
     *     location: string,
     *     sector: array{slug: string, name: string}|null,
     *     imageUrl: ?string
     * }
     */
    public function toSummaryArray(): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->localized('title'),
            'summary' => $this->localized('summary'),
            'status' => $this->status->value,
            'year' => $this->year,
            'location' => $this->localized('location'),
            'imageUrl' => $this->storedImageUrl(),
            'sector' => $this->relationLoaded('sector') && $this->sector !== null
                ? [
                    'slug' => $this->sector->slug,
                    'name' => $this->sector->localized('name'),
                ]
                : null,
        ];
    }

    /**
     * @return array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     status: string,
     *     year: int,
     *     location: string,
     *     sector: array{slug: string, name: string}|null,
     *     imageUrl: ?string,
     *     body: string
     * }
     */
    public function toDetailArray(): array
    {
        return [
            ...$this->toSummaryArray(),
            'body' => $this->localized('body'),
        ];
    }
}
