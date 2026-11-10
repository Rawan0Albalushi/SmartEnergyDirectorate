<?php

namespace App\Models;

use App\Models\Concerns\HasLocalizedText;
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
 * @property string|null $email
 * @property bool $is_published
 * @property int $sort_order
 * @property Department|null $department
 */
#[Fillable([
    'department_id',
    'name_ar',
    'name_en',
    'title_ar',
    'title_en',
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
        ];
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
     * @return array{id: int, name: string, title: string, email: ?string}
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->localized('name'),
            'title' => $this->localized('title'),
            'email' => $this->email,
        ];
    }
}
