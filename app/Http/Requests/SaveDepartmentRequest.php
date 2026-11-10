<?php

namespace App\Http\Requests;

class SaveDepartmentRequest extends DirectorateFormRequest
{
    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'summary_ar' => ['required', 'string', 'max:255'],
            'summary_en' => ['required', 'string', 'max:255'],
            'mandate_ar' => ['nullable', 'string', 'max:5000'],
            'mandate_en' => ['nullable', 'string', 'max:5000'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:40'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
