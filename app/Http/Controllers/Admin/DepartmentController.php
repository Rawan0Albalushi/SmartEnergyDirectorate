<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveDepartmentRequest;
use App\Models\Department;
use App\Support\SlugGenerator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('admin/departments/index', [
            'departments' => Department::query()
                ->withCount('staffMembers')
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Department $department): array => [
                    'name' => $department->localized('name'),
                    'staffCount' => $department->staff_members_count,
                    'editUrl' => route('admin.departments.edit', [
                        'locale' => app()->getLocale(),
                        'department' => $department,
                    ]),
                ])
                ->values(),
        ]);
    }

    public function create(string $locale): Response
    {
        return Inertia::render('admin/departments/form', [
            'department' => null,
            'submitUrl' => route('admin.departments.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveDepartmentRequest $request, SlugGenerator $slugs): RedirectResponse
    {
        $department = new Department;
        $this->fill($request, $department);
        $department->slug = $slugs->make($request->string('name_en')->toString(), Department::class);
        $department->save();

        return redirect()
            ->route('admin.departments.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function edit(string $locale, Department $department): Response
    {
        return Inertia::render('admin/departments/form', [
            'department' => [
                'name_ar' => $department->name_ar,
                'name_en' => $department->name_en,
                'summary_ar' => $department->summary_ar,
                'summary_en' => $department->summary_en,
                'mandate_ar' => $department->mandate_ar,
                'mandate_en' => $department->mandate_en,
                'email' => $department->email,
                'phone' => $department->phone,
                'sort_order' => $department->sort_order,
            ],
            'submitUrl' => route('admin.departments.update', [
                'locale' => app()->getLocale(),
                'department' => $department,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.departments.destroy', [
                'locale' => app()->getLocale(),
                'department' => $department,
            ]),
        ]);
    }

    public function update(string $locale, SaveDepartmentRequest $request, Department $department): RedirectResponse
    {
        $this->fill($request, $department);
        $department->save();

        return redirect()
            ->route('admin.departments.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, Department $department): RedirectResponse
    {
        $department->delete();

        return redirect()
            ->route('admin.departments.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveDepartmentRequest $request, Department $department): void
    {
        $department->fill($request->safe()->only([
            'name_ar',
            'name_en',
            'summary_ar',
            'summary_en',
            'mandate_ar',
            'mandate_en',
            'email',
            'phone',
        ]));
        $department->sort_order = $request->integer('sort_order');
    }
}
