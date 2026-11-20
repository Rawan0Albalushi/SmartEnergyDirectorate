<?php

namespace App\Models;

use App\Enums\StaffRoster;
use App\Models\Concerns\HasLocalizedText;
use App\Support\StoredImage;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $department_id
 * @property string $name_ar
 * @property string $name_en
 * @property string $title_ar
 * @property string $title_en
 * @property string|null $bio_ar
 * @property string|null $bio_en
 * @property string|null $email
 * @property string|null $photo_path
 * @property StaffRoster $roster
 * @property bool $is_published
 * @property int $sort_order
 * @property Department|null $department
 */
#[Fillable([
    'department_id',
    'roster',
    'name_ar',
    'name_en',
    'title_ar',
    'title_en',
    'bio_ar',
    'bio_en',
    'email',
    'is_published',
    'sort_order',
])]
class StaffMember extends Model
{
    use HasLocalizedText;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'roster' => StaffRoster::class,
        ];
    }

    protected static function booted(): void
    {
        static::deleting(function (StaffMember $member): void {
            StoredImage::delete($member->photo_path);
        });
    }

    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * @param  Builder<StaffMember>  $query
     * @return Builder<StaffMember>
     */
    #[Scope]
    protected function published(Builder $query): Builder
    {
        return $query->where($query->getModel()->getTable().'.is_published', true);
    }

    /**
     * @return array{id: int, name: string, title: string, email: ?string, bio: string, photoUrl: ?string, department: ?string}
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->localized('name'),
            'title' => $this->localized('title'),
            'email' => $this->email,
            'bio' => $this->localized('bio'),
            'photoUrl' => StoredImage::url($this->photo_path),
            'department' => $this->relationLoaded('department')
                ? $this->department?->localized('name')
                : null,
        ];
    }
}
