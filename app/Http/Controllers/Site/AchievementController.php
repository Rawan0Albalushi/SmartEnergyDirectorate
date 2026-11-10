<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Support\PageMeta;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    public function index(string $locale): Response
    {
        $achievements = Achievement::query()
            ->published()
            ->with('sector')
            ->orderByDesc('year')
            ->orderByDesc('id')
            ->paginate(12);

        return Inertia::render('public/achievements/index', [
            'achievements' => $achievements->getCollection()
                ->map(fn (Achievement $achievement): array => $achievement->toPublicArray())
                ->values(),
            'page' => PageMeta::from($achievements),
        ]);
    }
}
