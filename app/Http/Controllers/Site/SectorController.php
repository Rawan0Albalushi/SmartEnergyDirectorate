<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Indicator;
use App\Models\Project;
use App\Models\Sector;
use Inertia\Inertia;
use Inertia\Response;

class SectorController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('public/sectors/index', [
            'sectors' => Sector::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Sector $sector): array => $sector->toDetailArray())
                ->values(),
        ]);
    }

    public function show(string $locale, Sector $sector): Response
    {
        return Inertia::render('public/sectors/show', [
            'sector' => $sector->toDetailArray(),
            'indicators' => Indicator::query()
                ->published()
                ->where('sector_id', $sector->id)
                ->orderBy('sort_order')
                ->orderByDesc('recorded_on')
                ->orderByDesc('id')
                ->get()
                ->map(fn (Indicator $indicator): array => $indicator->toPublicArray())
                ->values(),
            'projects' => Project::query()
                ->published()
                ->where('sector_id', $sector->id)
                ->with('sector')
                ->orderByDesc('year')
                ->orderByDesc('id')
                ->get()
                ->map(fn (Project $project): array => $project->toSummaryArray())
                ->values(),
        ]);
    }
}
