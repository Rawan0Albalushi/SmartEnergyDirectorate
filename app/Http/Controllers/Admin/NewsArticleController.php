<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ContentOrigin;
use App\Enums\NewsStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\SaveNewsArticleRequest;
use App\Models\NewsArticle;
use App\Support\CatalogOptions;
use App\Support\PageMeta;
use App\Support\RecordDetails;
use App\Support\SlugGenerator;
use App\Support\StoredImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsArticleController extends Controller
{
    public function index(string $locale, Request $request): Response
    {
        $status = $request->string('status')->toString();

        if (! in_array($status, array_column(NewsStatus::cases(), 'value'), true)) {
            $status = null;
        }

        $articles = NewsArticle::query()
            ->with('sector')
            ->when($status !== null, fn ($query) => $query->where('status', $status))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/news/index', [
            'articles' => $articles->getCollection()->map(fn (NewsArticle $article): array => [
                'title' => $article->localized('title'),
                'imageUrl' => StoredImage::url($article->image_path),
                'sectorSlug' => $article->sector?->slug,
                'scope' => $article->scope->value,
                'status' => $article->status->value,
                'origin' => $article->origin->value,
                'sourceName' => $article->source_name,
                'showUrl' => route('admin.news.show', [
                    'locale' => app()->getLocale(),
                    'newsArticle' => $article,
                ]),
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
            ])->values(),
            'page' => PageMeta::from($articles),
            'activeStatus' => $status,
        ]);
    }

    public function create(string $locale, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/news/form', [
            'article' => null,
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.news.store', ['locale' => app()->getLocale()]),
            'method' => 'post',
        ]);
    }

    public function store(string $locale, SaveNewsArticleRequest $request, SlugGenerator $slugs): RedirectResponse
    {
        $article = new NewsArticle;
        $this->fill($request, $article);
        $article->origin = ContentOrigin::Manual;
        $title = $request->string('title_en')->toString() ?: $request->string('title_ar')->toString();
        $article->slug = $slugs->make($title, NewsArticle::class);
        $article->save();

        return redirect()
            ->route('admin.news.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function show(string $locale, NewsArticle $newsArticle): Response
    {
        $newsArticle->load('sector');

        return Inertia::render('admin/details', RecordDetails::make(
            $newsArticle->localized('title'),
            route('admin.news.index', ['locale' => app()->getLocale()]),
            route('admin.news.edit', ['locale' => app()->getLocale(), 'newsArticle' => $newsArticle]),
            [
                RecordDetails::text('sector', $newsArticle->sector?->localized('name')),
                RecordDetails::text('titleAr', $newsArticle->title_ar),
                RecordDetails::text('titleEn', $newsArticle->title_en),
                RecordDetails::text('summaryAr', $newsArticle->summary_ar),
                RecordDetails::text('summaryEn', $newsArticle->summary_en),
                RecordDetails::text('bodyAr', $newsArticle->body_ar),
                RecordDetails::text('bodyEn', $newsArticle->body_en),
                RecordDetails::code('scope', $newsArticle->scope->value),
                RecordDetails::code('status', $newsArticle->status->value),
                RecordDetails::code('origin', $newsArticle->origin->value),
                RecordDetails::text('sourceName', $newsArticle->source_name),
                RecordDetails::text('originalUrl', $newsArticle->original_url),
                RecordDetails::image('photo', StoredImage::url($newsArticle->image_path)),
                RecordDetails::date('publishedAt', $newsArticle->published_at?->toIso8601String()),
            ],
        ));
    }

    public function edit(string $locale, NewsArticle $newsArticle, CatalogOptions $catalog): Response
    {
        return Inertia::render('admin/news/form', [
            'article' => [
                'sector_id' => $newsArticle->sector_id,
                'title_ar' => $newsArticle->title_ar,
                'title_en' => $newsArticle->title_en,
                'summary_ar' => $newsArticle->summary_ar,
                'summary_en' => $newsArticle->summary_en,
                'body_ar' => $newsArticle->body_ar,
                'body_en' => $newsArticle->body_en,
                'scope' => $newsArticle->scope->value,
                'status' => $newsArticle->status->value,
                'source_name' => $newsArticle->source_name,
                'original_url' => $newsArticle->original_url,
                'published_at' => $newsArticle->published_at?->format('Y-m-d\TH:i'),
                'origin' => $newsArticle->origin->value,
                'image_url' => StoredImage::url($newsArticle->image_path),
            ],
            'sectors' => $catalog->sectors(),
            'submitUrl' => route('admin.news.update', [
                'locale' => app()->getLocale(),
                'newsArticle' => $newsArticle,
            ]),
            'method' => 'put',
            'deleteUrl' => route('admin.news.destroy', [
                'locale' => app()->getLocale(),
                'newsArticle' => $newsArticle,
            ]),
        ]);
    }

    public function update(string $locale, SaveNewsArticleRequest $request, NewsArticle $newsArticle): RedirectResponse
    {
        $this->fill($request, $newsArticle);
        $newsArticle->save();

        return redirect()
            ->route('admin.news.index', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }

    public function destroy(string $locale, NewsArticle $newsArticle): RedirectResponse
    {
        $newsArticle->delete();

        return redirect()
            ->route('admin.news.index', ['locale' => app()->getLocale()])
            ->with('status', __('Deleted.'));
    }

    private function fill(SaveNewsArticleRequest $request, NewsArticle $article): void
    {
        $article->fill($request->safe()->only([
            'sector_id',
            'title_ar',
            'title_en',
            'summary_ar',
            'summary_en',
            'body_ar',
            'body_en',
            'scope',
            'status',
            'source_name',
            'original_url',
            'published_at',
        ]));
        $article->image_path = StoredImage::replace(
            $article->image_path,
            $request->file('image'),
            $request->boolean('remove_image'),
            'news',
        );

        if (in_array($article->status, [NewsStatus::Published, NewsStatus::Rejected], true)) {
            $article->reviewed_at = now();
            $article->reviewed_by = $request->user()?->id;
        }

        if ($article->status === NewsStatus::Published && $article->published_at === null) {
            $article->published_at = now();
        }
    }
}
