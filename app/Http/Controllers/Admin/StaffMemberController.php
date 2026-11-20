<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveStaffMemberRequest;
use App\Models\StaffMember;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use App\Support\RecordDetails;
use App\Support\StoredImage;
use Illuminate\Http\RedirectResponse;
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
                'imageUrl' => StoredImage::url($member->photo_path),
                'title' => $member->localized('title'),
                'department' => $member->department?->localized('name') ?? '',
                'roster' => $member->roster->value,
                'isPublished' => $member->is_published,
                'showUrl' => route('admin.staff.show', [
                    'locale' => app()->getLocale(),
                    'staffMember' => $member,
                ]),
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

    public function show(string $locale, StaffMember $staffMember): Response
    {
        $staffMember->load('department');

        return Inertia::render('admin/details', RecordDetails::make(
            $staffMember->localized('name'),
            route('admin.staff.index', ['locale' => app()->getLocale()]),
            route('admin.staff.edit', ['locale' => app()->getLocale(), 'staffMember' => $staffMember]),
            [
                RecordDetails::text('department', $staffMember->department?->localized('name')),
                RecordDetails::text('nameAr', $staffMember->name_ar),
                RecordDetails::text('nameEn', $staffMember->name_en),
                RecordDetails::text('jobTitleAr', $staffMember->title_ar),
                RecordDetails::text('jobTitleEn', $staffMember->title_en),
                RecordDetails::text('bioAr', $staffMember->bio_ar),
                RecordDetails::text('bioEn', $staffMember->bio_en),
                RecordDetails::text('email', $staffMember->email),
                RecordDetails::code('roster', $staffMember->roster->value),
                RecordDetails::flag('visibility', $staffMember->is_published, 'visibility'),
                RecordDetails::text('sortOrder', $staffMember->sort_order),
            ],
        ));
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
                'photo_url' => StoredImage::url($staffMember->photo_path),
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
        $member->photo_path = StoredImage::replace(
            $member->photo_path,
            $request->file('photo'),
            $request->boolean('remove_photo'),
            'staff',
        );
    }
}
