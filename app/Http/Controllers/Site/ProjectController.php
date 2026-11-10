<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Support\PageMeta;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(string $locale): Response
    {
        $projects = Project::query()
            ->published()
            ->with('sector')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(12);

        return Inertia::render('public/projects/index', [
            'projects' => $projects->getCollection()
                ->map(fn (Project $project): array => $project->toSummaryArray())
                ->values(),
            'page' => PageMeta::from($projects),
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
