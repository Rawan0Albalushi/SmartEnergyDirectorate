<?php

namespace App\Support;

use App\Models\Department;
use App\Models\Sector;

class CatalogOptions
{
    /**
     * @return list<array{id: int, name: string}>
     */
    public function sectors(): array
    {
        return array_values(Sector::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Sector $sector): array => [
                'id' => $sector->id,
                'name' => $sector->localized('name'),
            ])
            ->all());
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    public function departments(): array
    {
        return array_values(Department::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Department $department): array => [
                'id' => $department->id,
                'name' => $department->localized('name'),
            ])
            ->all());
    }
}
