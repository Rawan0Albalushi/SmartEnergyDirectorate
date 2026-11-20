<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use Illuminate\Validation\Rule;

class SaveProjectRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'sector_id' => ['required', 'integer', 'exists:sectors,id'],
            'title_ar' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'summary_ar' => ['required', 'string', 'max:2000'],
            'summary_en' => ['required', 'string', 'max:2000'],
            'body_ar' => ['nullable', 'string', 'max:10000'],
            'body_en' => ['nullable', 'string', 'max:10000'],
            'status' => ['required', Rule::enum(ProjectStatus::class)],
            'location_ar' => ['nullable', 'string', 'max:255'],
            'location_en' => ['nullable', 'string', 'max:255'],
            'year' => ['required', 'integer', 'min:1990', 'max:2100'],
            'is_published' => ['required', 'boolean'],
            ...$this->imageRules(),
        ];
    }
}
