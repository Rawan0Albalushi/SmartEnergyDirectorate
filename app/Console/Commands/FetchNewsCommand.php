<?php

namespace App\Console\Commands;

use App\Actions\News\FetchNewsFeed;
use App\Models\NewsSource;
use Illuminate\Console\Command;

class FetchNewsCommand extends Command
{
    protected $signature = 'news:fetch {source? : Source id}';

    protected $description = 'Fetch approved news feeds into the review queue';

    public function handle(FetchNewsFeed $fetch): int
    {
        $sourceId = $this->argument('source');

        $sources = NewsSource::query()
            ->when(is_numeric($sourceId), fn ($query) => $query->whereKey((int) $sourceId))
            ->where('is_active', true)
            ->orderBy('id')
            ->get();

        if ($sources->isEmpty()) {
            $this->info('No active sources.');

            return self::SUCCESS;
        }

        foreach ($sources as $source) {
            $result = $fetch->handle($source);
            $name = $source->name_en;
            $this->line($result->error === null
                ? "{$name}: {$result->created} new"
                : "{$name}: {$result->error}");
        }

        return self::SUCCESS;
    }
}
