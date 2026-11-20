<?php

namespace App\Models;

use App\Enums\ContentOrigin;
use App\Enums\NewsScope;
use App\Enums\NewsStatus;
use App\Models\Concerns\HasLocalizedText;
use App\Models\Concerns\HasStoredImage;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $sector_id
 * @property int|null $news_source_id
 * @property int|null $reviewed_by
 * @property string $slug
 * @property string|null $title_ar
 * @property string|null $title_en
 * @property string|null $summary_ar
 * @property string|null $summary_en
 * @property string|null $body_ar
 * @property string|null $body_en
 * @property NewsScope $scope
 * @property ContentOrigin $origin
 * @property NewsStatus $status
 * @property string|null $source_name
 * @property string|null $original_url
 * @property string|null $external_guid
 * @property CarbonImmutable|null $published_at
 * @property CarbonImmutable|null $reviewed_at
 * @property string|null $image_path
 * @property Sector|null $sector
 */
#[Fillable([
    'sector_id',
    'news_source_id',
    'slug',
    'title_ar',
    'title_en',
    'summary_ar',
    'summary_en',
    'body_ar',
    'body_en',
    'scope',
    'origin',
    'status',
    'source_name',
    'original_url',
    'external_guid',
    'published_at',
])]
class NewsArticle extends Model
{
    use HasLocalizedText;
    use HasStoredImage;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => NewsScope::class,
            'origin' => ContentOrigin::class,
            'status' => NewsStatus::class,
            'published_at' => 'datetime',
            'reviewed_at' => 'datetime',
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
     * @return BelongsTo<NewsSource, $this>
     */
    public function newsSource(): BelongsTo
    {
        return $this->belongsTo(NewsSource::class);
    }

    /**
     * @param  Builder<NewsArticle>  $query
     * @return Builder<NewsArticle>
     */
    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where(
            $query->getModel()->getTable().'.status',
            NewsStatus::Published->value,
        );
    }

    /**
     * @return array{
     *     slug: string,
     *     title: string,
     *     summary: string,
     *     scope: string,
     *     publishedAt: ?string,
     *     sourceName: ?string,
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
            'scope' => $this->scope->value,
            'publishedAt' => $this->published_at?->toIso8601String(),
            'sourceName' => $this->source_name,
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
     *     scope: string,
     *     publishedAt: ?string,
     *     sourceName: ?string,
     *     sector: array{slug: string, name: string}|null,
     *     imageUrl: ?string,
     *     body: string,
     *     originalUrl: ?string
     * }
     */
    public function toDetailArray(): array
    {
        return [
            ...$this->toSummaryArray(),
            'body' => $this->localized('body'),
            'originalUrl' => $this->original_url,
        ];
    }
}
