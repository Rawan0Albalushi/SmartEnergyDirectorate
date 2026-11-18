<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Department;
use App\Models\Indicator;
use App\Models\NewsArticle;
use App\Models\Project;
use App\Models\Sector;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(string $locale): Response
    {
        $headlines = Indicator::latestPublishedPerSector()->keyBy('sector_id');

        $sectors = Sector::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Sector $sector): array => [
                ...$sector->toSummaryArray(),
                'headline' => $headlines->get($sector->id)?->toPublicArray(),
            ])
            ->values();

        return Inertia::render('public/home', [
            'sectors' => $sectors,
            'news' => NewsArticle::query()
                ->published()
                ->with('sector')
                ->orderByDesc('published_at')
                ->orderByDesc('id')
                ->limit(9)
                ->get()
                ->map(fn (NewsArticle $article): array => $article->toSummaryArray())
                ->values(),
            'projects' => Project::query()
                ->published()
                ->with('sector')
                ->orderByDesc('year')
                ->orderByDesc('id')
                ->limit(8)
                ->get()
                ->map(fn (Project $project): array => $project->toSummaryArray())
                ->values(),
            'projectTotal' => Project::query()->published()->count(),
            'achievements' => Achievement::query()
                ->published()
                ->with('sector')
                ->orderByDesc('year')
                ->orderByDesc('id')
                ->limit(4)
                ->get()
                ->map(fn (Achievement $achievement): array => $achievement->toPublicArray())
                ->values(),
            'departments' => Department::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
                ->map(fn (Department $department): array => $department->toSummaryArray())
                ->values(),
            'indicators' => Indicator::query()
                ->published()
                ->with('sector')
                ->join('sectors', 'sectors.id', '=', 'indicators.sector_id')
                ->orderBy('sectors.sort_order')
                ->orderBy('indicators.sort_order')
                ->orderByDesc('indicators.recorded_on')
                ->orderByDesc('indicators.id')
                ->select('indicators.*')
                ->get()
                ->map(fn (Indicator $indicator): array => $indicator->toPublicArray())
                ->values(),
        ]);
    }
}
