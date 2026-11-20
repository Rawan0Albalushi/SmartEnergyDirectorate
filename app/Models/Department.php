<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedText;
use App\Models\Concerns\HasStoredImage;
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
 * @property string|null $mandate_ar
 * @property string|null $mandate_en
 * @property string|null $email
 * @property string|null $phone
 * @property int $sort_order
 * @property int $staff_members_count
 * @property string|null $image_path
 */
#[Fillable([
    'slug',
    'name_ar',
    'name_en',
    'summary_ar',
    'summary_en',
    'mandate_ar',
    'mandate_en',
    'email',
    'phone',
    'sort_order',
])]
class Department extends Model
{
    use HasLocalizedText;
    use HasStoredImage;

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return HasMany<StaffMember, $this>
     */
    public function staffMembers(): HasMany
    {
        return $this->hasMany(StaffMember::class);
    }

    /**
     * @return array{slug: string, name: string, summary: string, email: ?string, phone: ?string, imageUrl: ?string}
     */
    public function toSummaryArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->localized('name'),
            'summary' => $this->localized('summary'),
            'email' => $this->email,
            'phone' => $this->phone,
            'imageUrl' => $this->storedImageUrl(),
        ];
    }

    /**
     * @return array{slug: string, name: string, summary: string, email: ?string, phone: ?string, imageUrl: ?string, mandate: string}
     */
    public function toDetailArray(): array
    {
        return [
            ...$this->toSummaryArray(),
            'mandate' => $this->localized('mandate'),
        ];
    }
}
