<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\StaffMember;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('public/departments/index', [
            'departments' => Department::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Department $department): array => $department->toSummaryArray())
                ->values(),
        ]);
    }

    public function show(string $locale, Department $department): Response
    {
        $staff = $department->staffMembers()
            ->published()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (StaffMember $member): array => $member->toPublicArray())
            ->values();

        return Inertia::render('public/departments/show', [
            'department' => $department->toDetailArray(),
            'staff' => $staff,
        ]);
    }
}
