<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $slug
 * @property string $name_ar
 * @property string $name_en
 * @property string $summary_ar
 * @property string $summary_en
 * @property string|null $body_ar
 * @property string|null $body_en
 * @property int $sort_order
 */
#[Fillable([
    'slug',
    'name_ar',
    'name_en',
    'summary_ar',
    'summary_en',
    'body_ar',
    'body_en',
    'sort_order',
])]
class Sector extends Model
{
    use HasLocalizedText;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return HasMany<Indicator, $this>
     */
    public function indicators(): HasMany
    {
        return $this->hasMany(Indicator::class);
    }

    /**
     * @return HasMany<Project, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /**
     * @return array{slug: string, name: string, summary: string}
     */
    public function toSummaryArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->localized('name'),
            'summary' => $this->localized('summary'),
        ];
    }

    /**
     * @return array{slug: string, name: string, summary: string, body: string}
     */
    public function toDetailArray(): array
    {
        return [
            ...$this->toSummaryArray(),
            'body' => $this->localized('body'),
        ];
    }
}
