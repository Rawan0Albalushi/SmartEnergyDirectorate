<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveStaffMemberRequest;
use App\Models\StaffMember;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class StaffMemberController extends Controller
{
    public function index(string $locale): Response
    {
        $staff = StaffMember::query()
            ->with('department')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->paginate(20);

        return Inertia::render('admin/staff/index', [
            'staff' => $staff->getCollection()->map(fn (StaffMember $member): array => [
                'name' => $member->localized('name'),
                'title' => $member->localized('title'),
                'department' => $member->department?->localized('name') ?? '',
                'roster' => $member->roster->value,
                'isPublished' => $member->is_published,
                'editUrl' => route('admin.staff.edit', [
                    'locale' => app()->getLocale(),
                    'staffMember' => $member,
                ]),
            ])->values(),
            'page' => PageMeta::from($staff),
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/staff/form', [
            'member' => null,
            'departments' => $catalog->departments(),
            'submitUrl' => route('admin.staff.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveStaffMemberRequest $request): RedirectResponse
    {
        $member = new StaffMember;
        $this->fill($request, $member);
        $member->save();

        return redirect()
            ->route('admin.staff.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function edit(string $locale, StaffMember $staffMember, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/staff/form', [
            'member' => [
                'department_id' => $staffMember->department_id,
                'name_ar' => $staffMember->name_ar,
                'name_en' => $staffMember->name_en,
                'title_ar' => $staffMember->title_ar,
                'title_en' => $staffMember->title_en,
                'bio_ar' => $staffMember->bio_ar ?? '',
                'bio_en' => $staffMember->bio_en ?? '',
                'email' => $staffMember->email,
                'roster' => $staffMember->roster->value,
                'photo_url' => is_string($staffMember->photo_path) && $staffMember->photo_path !== ''
                    ? Storage::disk('public')->url($staffMember->photo_path)
                    : null,
                'is_published' => $staffMember->is_published,
                'sort_order' => $staffMember->sort_order,
            ],
            'departments' => $catalog->departments(),
            'submitUrl' => route('admin.staff.update', [
                'locale' => app()->getLocale(),
                'staffMember' => $staffMember,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.staff.destroy', [
                'locale' => app()->getLocale(),
                'staffMember' => $staffMember,
            ]),
        ]);
    }

    public function update(string $locale, SaveStaffMemberRequest $request, StaffMember $staffMember): RedirectResponse
    {
        $this->fill($request, $staffMember);
        $staffMember->save();

        return redirect()
            ->route('admin.staff.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, StaffMember $staffMember): RedirectResponse
    {
        $staffMember->delete();

        return redirect()
            ->route('admin.staff.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveStaffMemberRequest $request, StaffMember $member): void
    {
        $member->fill($request->safe()->only([
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
        ]));
        $member->sort_order = $request->integer('sort_order');
        $this->storePhoto($request, $member);
    }

    private function storePhoto(SaveStaffMemberRequest $request, StaffMember $member): void
    {
        if (! $request->hasFile('photo') && ! $request->boolean('remove_photo')) {
            return;
        }

        $previous = $member->photo_path;

        if ($request->hasFile('photo')) {
            $stored = $request->file('photo')?->store('staff', 'public');
            $member->photo_path = is_string($stored) ? $stored : $previous;
        } else {
            $member->photo_path = null;
        }

        if (is_string($previous) && $previous !== '' && $previous !== $member->photo_path) {
            Storage::disk('public')->delete($previous);
        }
    }
}
