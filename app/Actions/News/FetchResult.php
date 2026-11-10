<?php

namespace App\Actions\News;

class FetchResult
{
    public function __construct(
        public int $created,
        public ?string $error = null,
    ) {}
}
