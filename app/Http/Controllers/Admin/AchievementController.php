<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveAchievementRequest;
use App\Models\Achievement;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use App\Support\RecordDetails;
use App\Support\StoredImage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function index(string $locale): Response
    {
        $achievements = Achievement::query()
            ->with('sector')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(15);

        return Inertia::render('admin/achievements/index', [
            'achievements' => $achievements->getCollection()->map(fn (Achievement $achievement): array => [
                'id' => $achievement->id,
                'title' => $achievement->localized('title'),
                'imageUrl' => StoredImage::url($achievement->image_path),
                'sectorSlug' => $achievement->sector?->slug,
                'year' => $achievement->year,
                'isPublished' => $achievement->is_published,
                'sector' => $achievement->sector?->localized('name') ?? '',
                'showUrl' => route('admin.achievements.show', [
                    'locale' => app()->getLocale(),
                    'achievement' => $achievement,
                ]),
                'editUrl' => route('admin.achievements.edit', [
                    'locale' => app()->getLocale(),
                    'achievement' => $achievement,
                ]),
            ])->values(),
            'page' => PageMeta::from($achievements),
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/achievements/form', [
            'achievement' => null,
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.achievements.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveAchievementRequest $request): RedirectResponse
    {
        $achievement = new Achievement;
        $this->fill($request, $achievement);
        $achievement->save();

        return redirect()
            ->route('admin.achievements.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function show(string $locale, Achievement $achievement): Response
    {
        $achievement->load('sector');

        return Inertia::render('admin/details', RecordDetails::make(
            $achievement->localized('title'),
            route('admin.achievements.index', ['locale' => app()->getLocale()]),
            route('admin.achievements.edit', ['locale' => app()->getLocale(), 'achievement' => $achievement]),
            [
                RecordDetails::text('sector', $achievement->sector?->localized('name')),
                RecordDetails::text('titleAr', $achievement->title_ar),
                RecordDetails::text('titleEn', $achievement->title_en),
                RecordDetails::text('summaryAr', $achievement->summary_ar),
                RecordDetails::text('summaryEn', $achievement->summary_en),
                RecordDetails::text('year', $achievement->year),
                RecordDetails::image('photo', StoredImage::url($achievement->image_path)),
                RecordDetails::flag('visibility', $achievement->is_published, 'visibility'),
            ],
        ));
    }

    public function edit(string $locale, Achievement $achievement, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/achievements/form', [
            'achievement' => [
                'sector_id' => $achievement->sector_id,
                'title_ar' => $achievement->title_ar,
                'title_en' => $achievement->title_en,
                'summary_ar' => $achievement->summary_ar,
                'summary_en' => $achievement->summary_en,
                'year' => $achievement->year,
                'is_published' => $achievement->is_published,
                'image_url' => StoredImage::url($achievement->image_path),
            ],
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.achievements.update', [
                'locale' => app()->getLocale(),
                'achievement' => $achievement,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.achievements.destroy', [
                'locale' => app()->getLocale(),
                'achievement' => $achievement,
            ]),
        ]);
    }

    public function update(string $locale, SaveAchievementRequest $request, Achievement $achievement): RedirectResponse
    {
        $this->fill($request, $achievement);
        $achievement->save();

        return redirect()
            ->route('admin.achievements.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, Achievement $achievement): RedirectResponse
    {
        $achievement->delete();

        return redirect()
            ->route('admin.achievements.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveAchievementRequest $request, Achievement $achievement): void
    {
        $achievement->fill($request->safe()->only([
            'sector_id',
            'title_ar',
            'title_en',
            'summary_ar',
            'summary_en',
            'year',
            'is_published',
        ]));
        $achievement->image_path = StoredImage::replace(
            $achievement->image_path,
            $request->file('image'),
            $request->boolean('remove_image'),
            'achievements',
        );
    }
}
