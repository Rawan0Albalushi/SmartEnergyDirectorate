<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $routeLocale = $request->route('locale');
        $sessionLocale = $request->session()->get('locale', config('app.locale', 'ar'));
        $locale = is_string($routeLocale) && $this->supported($routeLocale)
            ? $routeLocale
            : (is_string($sessionLocale) ? $sessionLocale : 'ar');

        if (! $this->supported($locale)) {
            $locale = 'ar';
        }

        App::setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }

    private function supported(string $locale): bool
    {
        return in_array($locale, ['ar', 'en'], true);
    }
}
