<?php

namespace App\Http\Requests;

class SaveIndicatorRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'sector_id' => ['required', 'integer', 'exists:sectors,id'],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'value' => ['required', 'numeric', 'between:-999999999,999999999'],
            'unit_ar' => ['required', 'string', 'max:50'],
            'unit_en' => ['required', 'string', 'max:50'],
            'period_label' => ['required', 'string', 'max:50'],
            'recorded_on' => ['required', 'date'],
            'notes_ar' => ['nullable', 'string', 'max:2000'],
            'notes_en' => ['nullable', 'string', 'max:2000'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
