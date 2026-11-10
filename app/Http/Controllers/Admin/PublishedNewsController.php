<?php

namespace App\Http\Controllers\Admin;

use App\Enums\NewsStatus;
use App\Http\Controllers\Controller;
use App\Models\NewsArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class PublishedNewsController extends Controller
{
    public function store(string $locale, Request $request, NewsArticle $newsArticle): RedirectResponse
    {
        $newsArticle->forceFill([
            'status' => NewsStatus::Published,
            'published_at' => $newsArticle->published_at ?? now(),
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()?->id,
        ])->save();

        return back()->with('status', __('Published.'));
    }

    public function destroy(string $locale, Request $request, NewsArticle $newsArticle): RedirectResponse
    {
        $newsArticle->forceFill([
            'status' => NewsStatus::Rejected,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()?->id,
        ])->save();

        return back()->with('status', __('Rejected.'));
    }
}
