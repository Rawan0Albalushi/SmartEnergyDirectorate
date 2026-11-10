<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PageMeta
{
    /**
     * @param  LengthAwarePaginator<int, mixed>  $paginator
     * @return array{current: int, last: int, previous: ?string, next: ?string}
     */
    public static function from(LengthAwarePaginator $paginator): array
    {
        return [
            'current' => $paginator->currentPage(),
            'last' => $paginator->lastPage(),
            'previous' => $paginator->previousPageUrl(),
            'next' => $paginator->nextPageUrl(),
        ];
    }
}
