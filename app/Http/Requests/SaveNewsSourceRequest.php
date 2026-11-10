<?php

namespace App\Http\Requests;

use App\Enums\NewsScope;
use Illuminate\Validation\Rule;

class SaveNewsSourceRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'sector_id' => ['nullable', 'integer', 'exists:sectors,id'],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'feed_url' => ['required', 'url', 'max:2048'],
            'locale' => ['required', Rule::in(['ar', 'en'])],
            'scope' => ['required', Rule::enum(NewsScope::class)],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
