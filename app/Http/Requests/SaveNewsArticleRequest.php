<?php

namespace App\Http\Requests;

use App\Enums\NewsScope;
use App\Enums\NewsStatus;
use Illuminate\Validation\Rule;

class SaveNewsArticleRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'sector_id' => ['nullable', 'integer', 'exists:sectors,id'],
            'title_ar' => ['nullable', 'string', 'max:255', 'required_without:title_en'],
            'title_en' => ['nullable', 'string', 'max:255', 'required_without:title_ar'],
            'summary_ar' => ['nullable', 'string', 'max:2000'],
            'summary_en' => ['nullable', 'string', 'max:2000'],
            'body_ar' => ['nullable', 'string', 'max:10000'],
            'body_en' => ['nullable', 'string', 'max:10000'],
            'scope' => ['required', Rule::enum(NewsScope::class)],
            'status' => ['required', Rule::enum(NewsStatus::class)],
            'source_name' => ['nullable', 'string', 'max:255'],
            'original_url' => ['nullable', 'url', 'max:2048'],
            'published_at' => ['nullable', 'date'],
            ...$this->imageRules(),
        ];
    }
}
