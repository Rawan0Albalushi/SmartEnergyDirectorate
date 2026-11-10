<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Indicator;
use App\Models\Sector;
use App\Support\PageMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndicatorController extends Controller
{
    public function index(string $locale, Request $request): Response
    {
        $sectorSlug = $request->string('sector')->toString();
        $sector = $sectorSlug === ''
            ? null
            : Sector::query()->where('slug', $sectorSlug)->first();

        $indicators = Indicator::query()
            ->published()
            ->with('sector')
            ->when($sector !== null, fn ($query) => $query->where('sector_id', $sector->id))
            ->orderByDesc('recorded_on')
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/indicators/index', [
            'indicators' => $indicators->getCollection()
                ->map(fn (Indicator $indicator): array => $indicator->toPublicArray())
                ->values(),
            'page' => PageMeta::from($indicators),
            'sectors' => Sector::query()->orderBy('sort_order')->orderBy('id')->get()
                ->map(fn (Sector $item): array => $item->toSummaryArray())
                ->values(),
            'activeSector' => $sector?->slug,
        ]);
    }
}
