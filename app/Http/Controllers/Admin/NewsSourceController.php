<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveNewsSourceRequest;
use App\Models\NewsSource;
use App\Support\CatalogOptions;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NewsSourceController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('admin/sources/index', [
            'sources' => NewsSource::query()
                ->orderBy('id')
                ->get()
                ->map(fn (NewsSource $source): array => [
                    'id' => $source->id,
                    'name' => $source->localized('name'),
                    'feedUrl' => $source->feed_url,
                    'locale' => $source->locale,
                    'scope' => $source->scope->value,
                    'isActive' => $source->is_active,
                    'lastError' => $source->last_error,
                    'editUrl' => route('admin.sources.edit', [
                        'locale' => app()->getLocale(),
                        'newsSource' => $source,
                    ]),
                ])
                ->values(),
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/sources/form', [
            'source' => null,
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.sources.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveNewsSourceRequest $request): RedirectResponse
    {
        $source = new NewsSource;
        $this->fill($request, $source);
        $source->save();

        return redirect()
            ->route('admin.sources.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function edit(string $locale, NewsSource $newsSource, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/sources/form', [
            'source' => [
                'sector_id' => $newsSource->sector_id,
                'name_ar' => $newsSource->name_ar,
                'name_en' => $newsSource->name_en,
                'feed_url' => $newsSource->feed_url,
                'locale' => $newsSource->locale,
                'scope' => $newsSource->scope->value,
                'is_active' => $newsSource->is_active,
            ],
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.sources.update', [
                'locale' => app()->getLocale(),
                'newsSource' => $newsSource,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.sources.destroy', [
                'locale' => app()->getLocale(),
                'newsSource' => $newsSource,
            ]),
        ]);
    }

    public function update(string $locale, SaveNewsSourceRequest $request, NewsSource $newsSource): RedirectResponse
    {
        $this->fill($request, $newsSource);
        $newsSource->save();

        return redirect()
            ->route('admin.sources.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, NewsSource $newsSource): RedirectResponse
    {
        $newsSource->delete();

        return redirect()
            ->route('admin.sources.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveNewsSourceRequest $request, NewsSource $source): void
    {
        $source->fill($request->safe()->only([
            'sector_id',
            'name_ar',
            'name_en',
            'feed_url',
            'locale',
            'scope',
            'is_active',
        ]));
    }
}
