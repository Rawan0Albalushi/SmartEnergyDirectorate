<?php

namespace App\Http\Controllers\Site;

use App\Enums\StaffRoster;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\StaffMember;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(string $locale, Request $request): Response
    {
        $roster = StaffRoster::tryFrom($request->string('roster')->toString());

        $people = $roster === null
            ? collect()
            : StaffMember::query()
                ->published()
                ->where('roster', $roster)
                ->with('department')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (StaffMember $member): array => $member->toPublicArray());

        return Inertia::render('public/departments/index', [
            'departments' => Department::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Department $department): array => $department->toSummaryArray())
                ->values(),
            'roster' => $roster?->value,
            'people' => $people->values(),
        ]);
    }

    public function show(string $locale, Department $department): Response
    {
        $staff = $department->staffMembers()
            ->published()
            ->where('roster', StaffRoster::Staff)
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
