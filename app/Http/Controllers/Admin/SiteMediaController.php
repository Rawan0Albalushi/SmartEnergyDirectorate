<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteMediaRequest;
use App\Models\SiteSetting;
use App\Support\StoredImage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SiteMediaController extends Controller
{
    public function edit(string $locale): Response
    {
        return Inertia::render('admin/media/index', [
            'heroUrl' => StoredImage::url(SiteSetting::value(SiteSetting::HERO)),
            'submitUrl' => route('admin.media.update', ['locale' => app()->getLocale()]),
        ]);
    }

    public function update(string $locale, UpdateSiteMediaRequest $request): RedirectResponse
    {
        SiteSetting::put(SiteSetting::HERO, StoredImage::replace(
            SiteSetting::value(SiteSetting::HERO),
            $request->file('image'),
            $request->boolean('remove_image'),
            'site',
        ));

        return redirect()
            ->route('admin.media.edit', ['locale' => app()->getLocale()])
            ->with('status', __('Saved.'));
    }
}
