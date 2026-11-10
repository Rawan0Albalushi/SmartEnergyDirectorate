<?php

namespace App\Http\Controllers\Site;

use App\Enums\NewsScope;
use App\Enums\NewsStatus;
use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use App\Support\PageMeta;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(string $locale, Request $request): Response
    {
        $scope = $request->string('scope')->toString();

        if (! in_array($scope, [NewsScope::Local->value, NewsScope::International->value], true)) {
            $scope = null;
        }

        $articles = NewsArticle::query()
            ->published()
            ->with('sector')
            ->when($scope !== null, fn ($query) => $query->where('scope', $scope))
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('public/news/index', [
            'articles' => $articles->getCollection()
                ->map(fn (NewsArticle $article): array => $article->toSummaryArray())
                ->values(),
            'page' => PageMeta::from($articles),
            'activeScope' => $scope,
        ]);
    }

    public function show(string $locale, NewsArticle $newsArticle): Response
    {
        abort_unless($newsArticle->status === NewsStatus::Published, 404);
        $newsArticle->load('sector');

        return Inertia::render('public/news/show', [
            'article' => $newsArticle->toDetailArray(),
        ]);
    }
}
