<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request, string $locale): RedirectResponse
    {
        abort_unless(in_array($locale, ['ar', 'en'], true), 404);

        $request->session()->put('locale', $locale);

        $previous = url()->previous();

        if (str_contains($previous, '/locale/')) {
            return redirect('/');
        }

        return redirect()->back();
    }
}
