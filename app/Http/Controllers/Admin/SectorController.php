<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSectorRequest;
use App\Models\Sector;
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
                    'name' => $sector->localized('name'),
                    'summary' => $sector->localized('summary'),
                    'editUrl' => route('admin.sectors.edit', [
                        'locale' => app()->getLocale(),
                        'sector' => $sector,
                    ]),
                ])
                ->values(),
        ]);
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
        $sector->save();

        return redirect()
            ->route('admin.sectors.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }
}
