<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveProjectRequest;
use App\Models\Project;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use App\Support\SlugGenerator;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(string $locale): Response
    {
        $projects = Project::query()
            ->with('sector')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(15);

        return Inertia::render('admin/projects/index', [
            'projects' => $projects->getCollection()->map(fn (Project $project): array => [
                'title' => $project->localized('title'),
                'year' => $project->year,
                'status' => $project->status->value,
                'isPublished' => $project->is_published,
                'sector' => $project->sector?->localized('name') ?? '',
                'editUrl' => route('admin.projects.edit', [
                    'locale' => app()->getLocale(),
                    'project' => $project,
                ]),
            ])->values(),
            'page' => PageMeta::from($projects),
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/projects/form', [
            'project' => null,
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.projects.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveProjectRequest $request, SlugGenerator $slugs): RedirectResponse
    {
        $project = new Project;
        $this->fill($request, $project);
        $project->slug = $slugs->make($request->string('title_en')->toString(), Project::class);
        $project->save();

        return redirect()
            ->route('admin.projects.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function edit(string $locale, Project $project, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/projects/form', [
            'project' => [
                'sector_id' => $project->sector_id,
                'title_ar' => $project->title_ar,
                'title_en' => $project->title_en,
                'summary_ar' => $project->summary_ar,
                'summary_en' => $project->summary_en,
                'body_ar' => $project->body_ar,
                'body_en' => $project->body_en,
                'status' => $project->status->value,
                'location_ar' => $project->location_ar,
                'location_en' => $project->location_en,
                'year' => $project->year,
                'is_published' => $project->is_published,
            ],
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.projects.update', [
                'locale' => app()->getLocale(),
                'project' => $project,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.projects.destroy', [
                'locale' => app()->getLocale(),
                'project' => $project,
            ]),
        ]);
    }

    public function update(string $locale, SaveProjectRequest $request, Project $project): RedirectResponse
    {
        $this->fill($request, $project);
        $project->save();

        return redirect()
            ->route('admin.projects.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, Project $project): RedirectResponse
    {
        $project->delete();

        return redirect()
            ->route('admin.projects.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveProjectRequest $request, Project $project): void
    {
        $project->fill($request->safe()->only([
            'sector_id',
            'title_ar',
            'title_en',
            'summary_ar',
            'summary_en',
            'body_ar',
            'body_en',
            'status',
            'location_ar',
            'location_en',
            'year',
            'is_published',
        ]));
    }
}
