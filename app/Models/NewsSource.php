<?php

namespace App\Models;

use App\Enums\NewsScope;
use App\Models\Concerns\HasLocalizedText;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $sector_id
 * @property string $name_ar
 * @property string $name_en
 * @property string $feed_url
 * @property string $locale
 * @property NewsScope $scope
 * @property bool $is_active
 * @property Carbon|null $last_fetched_at
 * @property string|null $last_error
 */
#[Fillable([
    'sector_id',
    'name_ar',
    'name_en',
    'feed_url',
    'locale',
    'scope',
    'is_active',
    'last_fetched_at',
    'last_error',
])]
class NewsSource extends Model
{
    use HasLocalizedText;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'scope' => NewsScope::class,
            'is_active' => 'boolean',
            'last_fetched_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Sector, $this>
     */
    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }
}
