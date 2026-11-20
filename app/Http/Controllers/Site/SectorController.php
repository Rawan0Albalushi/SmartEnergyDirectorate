<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Indicator;
use App\Models\Project;
use App\Models\Sector;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SectorController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('public/sectors/index', [
            'sectors' => Sector::query()
                ->with([
                    'indicators' => fn ($query) => $query
                        ->published()
                        ->orderBy('sort_order')
                        ->orderByDesc('recorded_on')
                        ->orderByDesc('id'),
                    'projects' => fn ($query) => $query
                        ->published()
                        ->orderByDesc('year')
                        ->orderByDesc('id'),
                ])
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Sector $sector): array => [
                    ...$sector->toDetailArray(),
                    'indicators' => $sector->indicators
                        ->map(fn (Indicator $indicator): array => $indicator->toPublicArray())
                        ->values(),
                    'projects' => $sector->projects
                        ->each(function (Project $project) use ($sector): void {
                            $project->setRelation('sector', $sector);
                        })
                        ->map(fn (Project $project): array => $project->toSummaryArray())
                        ->values(),
                ])
                ->values(),
        ]);
    }

    public function show(string $locale, Sector $sector): RedirectResponse
    {
        return redirect("/{$locale}/sectors#{$sector->slug}");
    }
}
