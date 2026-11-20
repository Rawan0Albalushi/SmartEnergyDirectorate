<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSectorRequest;
use App\Models\Sector;
use App\Support\RecordDetails;
use App\Support\StoredImage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SectorController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('admin/sectors/index', [
            'sectors' => Sector::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Sector $sector): array => [
                    'slug' => $sector->slug,
                    'imageUrl' => StoredImage::url($sector->image_path),
                    'name' => $sector->localized('name'),
                    'summary' => $sector->localized('summary'),
                    'showUrl' => route('admin.sectors.show', [
                        'locale' => app()->getLocale(),
                        'sector' => $sector,
                    ]),
                    'editUrl' => route('admin.sectors.edit', [
                        'locale' => app()->getLocale(),
                        'sector' => $sector,
                    ]),
                ])
                ->values(),
        ]);
    }

    public function show(string $locale, Sector $sector): Response
    {
        return Inertia::render('admin/details', RecordDetails::make(
            $sector->localized('name'),
            route('admin.sectors.index', ['locale' => app()->getLocale()]),
            route('admin.sectors.edit', ['locale' => app()->getLocale(), 'sector' => $sector]),
            [
                RecordDetails::text('nameAr', $sector->name_ar),
                RecordDetails::text('nameEn', $sector->name_en),
                RecordDetails::text('summaryAr', $sector->summary_ar),
                RecordDetails::text('summaryEn', $sector->summary_en),
                RecordDetails::text('bodyAr', $sector->body_ar),
                RecordDetails::text('bodyEn', $sector->body_en),
                RecordDetails::image('photo', StoredImage::url($sector->image_path)),
                RecordDetails::text('sortOrder', $sector->sort_order),
            ],
        ));
    }

    public function edit(string $locale, Sector $sector): Response
    {
        return Inertia::render('admin/sectors/form', [
            'sector' => [
                'name_ar' => $sector->name_ar,
                'name_en' => $sector->name_en,
                'summary_ar' => $sector->summary_ar,
                'summary_en' => $sector->summary_en,
                'body_ar' => $sector->body_ar,
                'body_en' => $sector->body_en,
                'sort_order' => $sector->sort_order,
                'image_url' => StoredImage::url($sector->image_path),
            ],
            'submitUrl' => route('admin.sectors.update', [
                'locale' => app()->getLocale(),
                'sector' => $sector,
            ]),
        ]);
    }

    public function update(string $locale, UpdateSectorRequest $request, Sector $sector): RedirectResponse
    {
        $sector->fill($request->safe()->only([
            'name_ar',
            'name_en',
            'summary_ar',
            'summary_en',
            'body_ar',
            'body_en',
        ]));
        $sector->sort_order = $request->integer('sort_order');
        $sector->image_path = StoredImage::replace(
            $sector->image_path,
            $request->file('image'),
            $request->boolean('remove_image'),
            'sectors',
        );
        $sector->save();

        return redirect()
            ->route('admin.sectors.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }
}
