<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Sector;
use App\Support\PageMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(string $locale, Request $request): Response
    {
        $requested = $request->string('sector')->toString();
        $sectors = Sector::query()
            ->whereHas('projects', fn ($query) => $query->published())
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
        $active = $sectors->firstWhere('slug', $requested);

        $projects = Project::query()
            ->published()
            ->with('sector')
            ->when($active !== null, fn ($query) => $query->where('sector_id', $active->id))
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('public/projects/index', [
            'projects' => $projects->getCollection()
                ->map(fn (Project $project): array => $project->toSummaryArray())
                ->values(),
            'page' => PageMeta::from($projects),
            'sectors' => $sectors
                ->map(fn (Sector $sector): array => [
                    'slug' => $sector->slug,
                    'name' => $sector->localized('name'),
                ])
                ->values(),
            'activeSector' => $active?->slug,
        ]);
    }

    public function show(string $locale, Project $project): Response
    {
        abort_unless($project->is_published, 404);
        $project->load('sector');

        return Inertia::render('public/projects/show', [
            'project' => $project->toDetailArray(),
        ]);
    }
}
