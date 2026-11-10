<?php

namespace App\Actions\News;

use App\Enums\ContentOrigin;
use App\Enums\NewsStatus;
use App\Models\NewsArticle;
use App\Models\NewsSource;
use App\Support\SlugGenerator;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use SimpleXMLElement;
use Throwable;

class FetchNewsFeed
{
    public function __construct(private SlugGenerator $slugs) {}

    public function handle(NewsSource $source): FetchResult
    {
        try {
            $response = Http::connectTimeout(3)
                ->timeout(8)
                ->retry(2, 200, throw: false)
                ->withUserAgent(config('app.name').' news reader')
                ->accept('application/rss+xml, application/atom+xml, application/xml, text/xml')
                ->get($source->feed_url);
        } catch (ConnectionException $exception) {
            return $this->fail($source, $exception->getMessage());
        }

        if ($response->failed()) {
            return $this->fail($source, 'HTTP '.$response->status());
        }

        $items = $this->items($response->body());

        if ($items === null) {
            return $this->fail($source, 'The feed could not be read.');
        }

        $created = 0;

        foreach (array_slice($items, 0, 15) as $item) {
            if ($this->store($source, $item)) {
                $created++;
            }
        }

        $source->forceFill([
            'last_fetched_at' => now(),
            'last_error' => null,
        ])->save();

        return new FetchResult($created);
    }

    private function fail(NewsSource $source, string $error): FetchResult
    {
        $source->forceFill([
            'last_fetched_at' => now(),
            'last_error' => Str::limit($error, 500),
        ])->save();

        return new FetchResult(0, $error);
    }

    /**
     * @return list<array{guid: string, title: string, summary: string, url: ?string, published_at: CarbonImmutable}>|null
     */
    private function items(string $body): ?array
    {
        $previous = libxml_use_internal_errors(true);
        $xml = simplexml_load_string($body);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        if (! $xml instanceof SimpleXMLElement) {
            return null;
        }

        $items = [];

        if (isset($xml->channel->item)) {
            foreach ($xml->channel->item as $item) {
                $parsed = $this->rssItem($item);

                if ($parsed !== null) {
                    $items[] = $parsed;
                }
            }

            return $items;
        }

        foreach ($xml->entry as $entry) {
            $parsed = $this->atomEntry($entry);

            if ($parsed !== null) {
                $items[] = $parsed;
            }
        }

        return $items;
    }

    /**
     * @return array{guid: string, title: string, summary: string, url: ?string, published_at: CarbonImmutable}|null
     */
    private function rssItem(SimpleXMLElement $item): ?array
    {
        $url = $this->httpUrl($this->text($item->link));
        $guid = $this->plain($this->text($item->guid)) ?: $url;
        $title = $this->plain($this->text($item->title));

        if ($guid === null || $guid === '' || $title === '') {
            return null;
        }

        return [
            'guid' => Str::limit($guid, 512, ''),
            'title' => Str::limit($title, 255, ''),
            'summary' => Str::limit($this->plain($this->text($item->description)), 600, ''),
            'url' => $url,
            'published_at' => $this->date($this->text($item->pubDate)),
        ];
    }

    /**
     * @return array{guid: string, title: string, summary: string, url: ?string, published_at: CarbonImmutable}|null
     */
    private function atomEntry(SimpleXMLElement $entry): ?array
    {
        $url = null;

        foreach ($entry->link as $link) {
            $rel = (string) ($link['rel'] ?? 'alternate');

            if ($rel === 'alternate' || $rel === '') {
                $url = $this->httpUrl((string) $link['href']);
                break;
            }
        }

        $guid = $this->plain($this->text($entry->id)) ?: $url;
        $title = $this->plain($this->text($entry->title));

        if ($guid === null || $guid === '' || $title === '') {
            return null;
        }

        $summary = $this->plain($this->text($entry->summary));

        if ($summary === '') {
            $summary = $this->plain($this->text($entry->content));
        }

        return [
            'guid' => Str::limit($guid, 512, ''),
            'title' => Str::limit($title, 255, ''),
            'summary' => Str::limit($summary, 600, ''),
            'url' => $url,
            'published_at' => $this->date($this->text($entry->updated) ?: $this->text($entry->published)),
        ];
    }

    /**
     * @param  array{guid: string, title: string, summary: string, url: ?string, published_at: CarbonImmutable}  $item
     */
    private function store(NewsSource $source, array $item): bool
    {
        $locale = $source->locale === 'en' ? 'en' : 'ar';

        try {
            $article = NewsArticle::query()->firstOrCreate(
                ['external_guid' => $item['guid']],
                [
                    'news_source_id' => $source->id,
                    'sector_id' => $source->sector_id,
                    'slug' => $this->slugs->make($item['title'].' '.substr(sha1($item['guid']), 0, 6), NewsArticle::class),
                    'title_'.$locale => $item['title'],
                    'summary_'.$locale => $item['summary'],
                    'scope' => $source->scope,
                    'origin' => ContentOrigin::Fetched,
                    'status' => NewsStatus::Pending,
                    'source_name' => $source->localized('name'),
                    'original_url' => $item['url'],
                    'published_at' => $item['published_at'],
                ],
            );
        } catch (QueryException $exception) {
            if (($exception->errorInfo[0] ?? null) === '23000') {
                return false;
            }

            throw $exception;
        }

        return $article->wasRecentlyCreated;
    }

    private function text(mixed $value): string
    {
        if ($value instanceof SimpleXMLElement) {
            return trim((string) $value);
        }

        return is_scalar($value) ? trim((string) $value) : '';
    }

    private function plain(string $value): string
    {
        $text = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $collapsed = preg_replace('/\s+/u', ' ', $text);

        return trim(is_string($collapsed) ? $collapsed : $text);
    }

    private function httpUrl(string $value): ?string
    {
        $value = trim($value);

        if ($value === '' || filter_var($value, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        $scheme = parse_url($value, PHP_URL_SCHEME);

        if (! in_array($scheme, ['http', 'https'], true)) {
            return null;
        }

        return $value;
    }

    private function date(string $value): CarbonImmutable
    {
        if ($value === '') {
            return now();
        }

        try {
            return CarbonImmutable::parse($value);
        } catch (Throwable) {
            return now();
        }
    }
}
