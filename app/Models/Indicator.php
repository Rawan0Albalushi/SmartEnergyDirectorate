<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $sector_id
 * @property string $name_ar
 * @property string $name_en
 * @property string $value
 * @property string $unit_ar
 * @property string $unit_en
 * @property string $period_label
 * @property Carbon $recorded_on
 * @property string|null $notes_ar
 * @property string|null $notes_en
 * @property bool $is_published
 * @property int $sort_order
 * @property Sector|null $sector
 */
#[Fillable([
    'sector_id',
    'name_ar',
    'name_en',
    'value',
    'unit_ar',
    'unit_en',
    'period_label',
    'recorded_on',
    'notes_ar',
    'notes_en',
    'is_published',
    'sort_order',
])]
class Indicator extends Model
{
    use HasLocalizedText;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'value' => 'decimal:3',
            'recorded_on' => 'date',
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
     * @param  Builder<Indicator>  $query
     * @return Builder<Indicator>
     */
    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where($query->getModel()->getTable().'.is_published', true);
    }

    /**
     * @return Collection<int, static>
     */
    public static function latestPublishedPerSector(): Collection
    {
        $latestDates = static::query()
            ->published()
            ->selectRaw('sector_id, MAX(recorded_on) as recorded_on')
            ->groupBy('sector_id');

        return static::query()
            ->published()
            ->joinSub($latestDates, 'latest_indicators', function ($join): void {
                $join->on('indicators.sector_id', '=', 'latest_indicators.sector_id')
                    ->on('indicators.recorded_on', '=', 'latest_indicators.recorded_on');
            })
            ->select('indicators.*')
            ->orderBy('indicators.sort_order')
            ->orderByDesc('indicators.id')
            ->get()
            ->unique('sector_id')
            ->values();
    }

    /**
     * @return array{
     *     id: int,
     *     name: string,
     *     value: float,
     *     unit: string,
     *     period: string,
     *     recordedOn: string,
     *     notes: string,
     *     sector: array{slug: string, name: string}|null
     * }
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->localized('name'),
            'value' => (float) $this->value,
            'unit' => $this->localized('unit'),
            'period' => $this->period_label,
            'recordedOn' => $this->recorded_on->toDateString(),
            'notes' => $this->localized('notes'),
            'sector' => $this->relationLoaded('sector') && $this->sector !== null
                ? [
                    'slug' => $this->sector->slug,
                    'name' => $this->sector->localized('name'),
                ]
                : null,
        ];
    }
}
