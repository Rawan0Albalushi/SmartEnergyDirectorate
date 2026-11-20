<?php

use App\Http\Controllers\Admin\AchievementController as AdminAchievementController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DepartmentController as AdminDepartmentController;
use App\Http\Controllers\Admin\IndicatorController as AdminIndicatorController;
use App\Http\Controllers\Admin\NewsArticleController;
use App\Http\Controllers\Admin\NewsFetchController;
use App\Http\Controllers\Admin\NewsSourceController;
use App\Http\Controllers\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Admin\PublishedNewsController;
use App\Http\Controllers\Admin\SectorController as AdminSectorController;
use App\Http\Controllers\Admin\SiteMediaController;
use App\Http\Controllers\Admin\StaffMemberController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\Site\AchievementController;
use App\Http\Controllers\Site\DepartmentController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\NewsController;
use App\Http\Controllers\Site\ProjectController;
use App\Http\Controllers\Site\SectorController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $locale = session('locale', config('app.locale', 'ar'));

    if (! in_array($locale, ['ar', 'en'], true)) {
        $locale = 'ar';
    }

    return redirect('/'.$locale);
})->name('home');

Route::get('/locale/{locale}', [LocaleController::class, 'update'])
    ->whereIn('locale', ['ar', 'en'])
    ->name('locale.update');

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $locale = session('locale', config('app.locale', 'ar'));

    if (! in_array($locale, ['ar', 'en'], true)) {
        $locale = 'ar';
    }

    return redirect()->route('admin.dashboard', ['locale' => $locale]);
})->name('dashboard');

Route::prefix('{locale}')
    ->whereIn('locale', ['ar', 'en'])
    ->group(function () {
        Route::get('/', HomeController::class)->name('site.home');
        Route::get('sectors', [SectorController::class, 'index'])->name('site.sectors.index');
        Route::get('sectors/{sector}', [SectorController::class, 'show'])->name('site.sectors.show');
        Route::get('projects', [ProjectController::class, 'index'])->name('site.projects.index');
        Route::get('projects/{project}', [ProjectController::class, 'show'])->name('site.projects.show');
        Route::get('achievements', [AchievementController::class, 'index'])->name('site.achievements.index');
        Route::get('news', [NewsController::class, 'index'])->name('site.news.index');
        Route::get('news/{newsArticle}', [NewsController::class, 'show'])->name('site.news.show');
        Route::get('departments', [DepartmentController::class, 'index'])->name('site.departments.index');
        Route::get('departments/{department}', [DepartmentController::class, 'show'])->name('site.departments.show');

        Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
            Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
            Route::get('media', [SiteMediaController::class, 'edit'])->name('media.edit');
            Route::put('media', [SiteMediaController::class, 'update'])->name('media.update');

            Route::get('sectors', [AdminSectorController::class, 'index'])->name('sectors.index');
            Route::get('sectors/{sector}', [AdminSectorController::class, 'show'])->name('sectors.show');
            Route::get('sectors/{sector}/edit', [AdminSectorController::class, 'edit'])->name('sectors.edit');
            Route::put('sectors/{sector}', [AdminSectorController::class, 'update'])->name('sectors.update');

            Route::resource('indicators', AdminIndicatorController::class);
            Route::resource('projects', AdminProjectController::class);
            Route::resource('achievements', AdminAchievementController::class);
            Route::resource('news', NewsArticleController::class)
                ->parameters(['news' => 'newsArticle']);
            Route::post('news/{newsArticle}/publication', [PublishedNewsController::class, 'store'])
                ->name('news.publication.store');
            Route::delete('news/{newsArticle}/publication', [PublishedNewsController::class, 'destroy'])
                ->name('news.publication.destroy');
            Route::post('news-fetches', [NewsFetchController::class, 'store'])->name('news-fetches.store');
            Route::resource('sources', NewsSourceController::class)
                ->parameters(['sources' => 'newsSource']);
            Route::resource('departments', AdminDepartmentController::class);
            Route::resource('staff', StaffMemberController::class)
                ->parameters(['staff' => 'staffMember']);
        });
    });

require __DIR__.'/settings.php';
