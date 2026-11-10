<?php

namespace Tests\Feature;

use App\Enums\ContentOrigin;
use App\Enums\NewsScope;
use App\Enums\NewsStatus;
use App\Models\NewsArticle;
use App\Models\NewsSource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DirectorateTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_pages_follow_the_requested_language_direction(): void
    {
        $this->get('/ar')->assertOk()->assertSee('dir="rtl"', false);
        $this->get('/en')->assertOk()->assertSee('dir="ltr"', false);
        $this->get('/fr')->assertNotFound();
    }

    public function test_visitors_can_read_published_news_without_an_account(): void
    {
        NewsArticle::query()->create([
            'slug' => 'pending-item',
            'title_en' => 'Hidden pending headline',
            'scope' => NewsScope::International,
            'origin' => ContentOrigin::Fetched,
            'status' => NewsStatus::Pending,
        ]);

        NewsArticle::query()->create([
            'slug' => 'public-item',
            'title_en' => 'Visible public headline',
            'title_ar' => 'عنوان ظاهر',
            'scope' => NewsScope::Local,
            'origin' => ContentOrigin::Manual,
            'status' => NewsStatus::Published,
            'published_at' => now(),
        ]);

        $this->get('/en/news')
            ->assertOk()
            ->assertSee('Visible public headline')
            ->assertDontSee('Hidden pending headline');

        $this->get('/en/news/pending-item')->assertNotFound();
        $this->get('/ar/admin')->assertRedirect(route('login'));
    }

    public function test_an_editor_can_publish_a_pending_article(): void
    {
        $editor = User::factory()->create();
        $article = NewsArticle::query()->create([
            'slug' => 'waiting-headline',
            'title_en' => 'Waiting headline',
            'scope' => NewsScope::Local,
            'origin' => ContentOrigin::Manual,
            'status' => NewsStatus::Pending,
        ]);

        $this->actingAs($editor)
            ->post(route('admin.news.publication.store', [
                'locale' => 'en',
                'newsArticle' => $article,
            ]))
            ->assertRedirect();

        $article->refresh();
        $this->assertSame(NewsStatus::Published, $article->status);

        $this->get('/en/news')->assertSee('Waiting headline');
    }

    public function test_fetching_a_feed_keeps_new_items_unpublished_and_skips_duplicates(): void
    {
        Http::fake([
            'https://feeds.example.test/*' => Http::response(<<<'XML'
                <?xml version="1.0" encoding="UTF-8" ?>
                <rss version="2.0">
                  <channel>
                    <title>Energy</title>
                    <item>
                      <title>Grid storage pilot expands</title>
                      <link>https://example.com/storage</link>
                      <guid>https://example.com/storage</guid>
                      <pubDate>Mon, 01 Jun 2026 12:00:00 GMT</pubDate>
                      <description>A short summary of the pilot.</description>
                    </item>
                  </channel>
                </rss>
                XML, 200),
        ]);

        NewsSource::query()->create([
            'name_ar' => 'مصدر تجريبي',
            'name_en' => 'Example feed',
            'feed_url' => 'https://feeds.example.test/energy.xml',
            'locale' => 'en',
            'scope' => NewsScope::International,
            'is_active' => true,
        ]);

        $this->artisan('news:fetch')->assertSuccessful();
        $this->artisan('news:fetch')->assertSuccessful();

        $this->assertSame(1, NewsArticle::query()->count());
        $this->assertSame(NewsStatus::Pending, NewsArticle::query()->firstOrFail()->status);
        $this->get('/en')->assertDontSee('Grid storage pilot expands');
    }
}
