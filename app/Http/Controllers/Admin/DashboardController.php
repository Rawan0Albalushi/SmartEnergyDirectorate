<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NewsStatus;
use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\Indicator;
use App\Models\NewsArticle;
use App\Models\NewsSource;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(string $locale): Response
    {
        return Inertia::render('admin/dashboard', [
            'counts' => [
                'indicators' => Indicator::query()->count(),
                'projects' => Project::query()->count(),
                'pendingNews' => NewsArticle::query()->where('status', NewsStatus::Pending)->count(),
                'departments' => Department::query()->count(),
            ],
            'pending' => NewsArticle::query()
                ->where('status', NewsStatus::Pending)
                ->orderByDesc('id')
                ->limit(8)
                ->get()
                ->map(fn (NewsArticle $article): array => [
                    'id' => $article->id,
                    'title' => $article->localized('title'),
                    'sourceName' => $article->source_name,
                    'editUrl' => route('admin.news.edit', [
                        'locale' => app()->getLocale(),
                        'newsArticle' => $article,
                    ]),
                    'publishUrl' => route('admin.news.publication.store', [
                        'locale' => app()->getLocale(),
                        'newsArticle' => $article,
                    ]),
                    'rejectUrl' => route('admin.news.publication.destroy', [
                        'locale' => app()->getLocale(),
                        'newsArticle' => $article,
                    ]),
                ])
                ->values(),
            'sources' => NewsSource::query()
                ->orderBy('id')
                ->get()
                ->map(fn (NewsSource $source): array => [
                    'id' => $source->id,
                    'name' => $source->localized('name'),
                    'isActive' => $source->is_active,
                    'lastError' => $source->last_error,
                    'lastFetchedAt' => $source->last_fetched_at?->toIso8601String(),
                ])
                ->values(),
        ]);
    }
}
