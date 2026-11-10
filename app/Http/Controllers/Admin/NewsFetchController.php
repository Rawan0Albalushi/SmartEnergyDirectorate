<?php

namespace App\Http\Controllers\Admin;

use App\Actions\News\FetchNewsFeed;
use App\Http\Controllers\Controller;
use App\Models\NewsSource;
use Illuminate\Http\RedirectResponse;

class NewsFetchController extends Controller
{
    public function store(string $locale, FetchNewsFeed $fetch): RedirectResponse
    {
        $created = 0;
        $errors = 0;

        $sources = NewsSource::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        foreach ($sources as $source) {
            $result = $fetch->handle($source);
            $created += $result->created;

            if ($result->error !== null) {
                $errors++;
            }
        }

        $message = __('Fetched :count new items.', ['count' => $created]);

        if ($errors > 0) {
            $message .= ' '.__('Some sources could not be reached.');
        }

        return back()->with('status', $message);
    }
}
