<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveIndicatorRequest;
use App\Models\Indicator;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use App\Support\RecordDetails;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class IndicatorController extends Controller
{
    public function index(string $locale): Response
    {
        $indicators = Indicator::query()
            ->with('sector')
            ->orderByDesc('recorded_on')
            ->orderByDesc('id')
            ->paginate(15);

        return Inertia::render('admin/indicators/index', [
            'indicators' => $indicators->getCollection()->map(fn (Indicator $indicator): array => [
                'id' => $indicator->id,
                'name' => $indicator->localized('name'),
                'value' => (float) $indicator->value,
                'unit' => $indicator->localized('unit'),
                'period' => $indicator->period_label,
                'isPublished' => $indicator->is_published,
                'sector' => $indicator->sector?->localized('name') ?? '',
                'showUrl' => route('admin.indicators.show', [
                    'locale' => app()->getLocale(),
                    'indicator' => $indicator,
                ]),
                'editUrl' => route('admin.indicators.edit', [
                    'locale' => app()->getLocale(),
                    'indicator' => $indicator,
                ]),
            ])->values(),
            'page' => PageMeta::from($indicators),
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/indicators/form', [
            'indicator' => null,
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.indicators.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveIndicatorRequest $request): RedirectResponse
    {
        $indicator = new Indicator;
        $this->fill($request, $indicator);
        $indicator->save();

        return redirect()
            ->route('admin.indicators.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function show(string $locale, Indicator $indicator): Response
    {
        $indicator->load('sector');

        return Inertia::render('admin/details', RecordDetails::make(
            $indicator->localized('name'),
            route('admin.indicators.index', ['locale' => app()->getLocale()]),
            route('admin.indicators.edit', ['locale' => app()->getLocale(), 'indicator' => $indicator]),
            [
                RecordDetails::text('sector', $indicator->sector?->localized('name')),
                RecordDetails::text('nameAr', $indicator->name_ar),
                RecordDetails::text('nameEn', $indicator->name_en),
                RecordDetails::text('value', $indicator->value),
                RecordDetails::text('unitAr', $indicator->unit_ar),
                RecordDetails::text('unitEn', $indicator->unit_en),
                RecordDetails::text('periodLabel', $indicator->period_label),
                RecordDetails::date('recordedOn', $indicator->recorded_on->toDateString()),
                RecordDetails::text('notesAr', $indicator->notes_ar),
                RecordDetails::text('notesEn', $indicator->notes_en),
                RecordDetails::flag('visibility', $indicator->is_published, 'visibility'),
                RecordDetails::text('sortOrder', $indicator->sort_order),
            ],
        ));
    }

    public function edit(string $locale, Indicator $indicator, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/indicators/form', [
            'indicator' => [
                'sector_id' => $indicator->sector_id,
                'name_ar' => $indicator->name_ar,
                'name_en' => $indicator->name_en,
                'value' => (float) $indicator->value,
                'unit_ar' => $indicator->unit_ar,
                'unit_en' => $indicator->unit_en,
                'period_label' => $indicator->period_label,
                'recorded_on' => $indicator->recorded_on->toDateString(),
                'notes_ar' => $indicator->notes_ar,
                'notes_en' => $indicator->notes_en,
                'is_published' => $indicator->is_published,
                'sort_order' => $indicator->sort_order,
            ],
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.indicators.update', [
                'locale' => app()->getLocale(),
                'indicator' => $indicator,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.indicators.destroy', [
                'locale' => app()->getLocale(),
                'indicator' => $indicator,
            ]),
        ]);
    }

    public function update(string $locale, SaveIndicatorRequest $request, Indicator $indicator): RedirectResponse
    {
        $this->fill($request, $indicator);
        $indicator->save();

        return redirect()
            ->route('admin.indicators.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, Indicator $indicator): RedirectResponse
    {
        $indicator->delete();

        return redirect()
            ->route('admin.indicators.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveIndicatorRequest $request, Indicator $indicator): void
    {
        $indicator->fill($request->safe()->only([
            'sector_id',
            'name_ar',
            'name_en',
            'value',
            'unit_ar',
            'unit_en',
            'period_label',
            'recorded_on',
            'notes_ar',
            'notes_en',
            'is_published',
        ]));
        $indicator->sort_order = $request->integer('sort_order');
    }
}
