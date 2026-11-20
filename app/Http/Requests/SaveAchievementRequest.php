<?php

namespace App\Http\Requests;

class SaveAchievementRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'sector_id' => ['nullable', 'integer', 'exists:sectors,id'],
            'title_ar' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'summary_ar' => ['required', 'string', 'max:2000'],
            'summary_en' => ['required', 'string', 'max:2000'],
            'year' => ['required', 'integer', 'min:1990', 'max:2100'],
            'is_published' => ['required', 'boolean'],
            ...$this->imageRules(),
        ];
    }
}
