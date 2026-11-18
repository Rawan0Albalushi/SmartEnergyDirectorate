<?php

namespace App\Http\Requests;

use App\Enums\StaffRoster;
use Illuminate\Validation\Rule;

class SaveStaffMemberRequest extends DirectorateFormRequest
{
    protected function prepareForValidation(): void
    {
        parent::prepareForValidation();

        if ($this->exists('remove_photo')) {
            $this->merge([
                'remove_photo' => $this->boolean('remove_photo'),
            ]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'department_id' => ['required', 'integer', 'exists:departments,id'],
            'roster' => ['required', Rule::enum(StaffRoster::class)],
            'name_ar' => ['required', 'string', 'max:255'],
            'name_en' => ['required', 'string', 'max:255'],
            'title_ar' => ['required', 'string', 'max:255'],
            'title_en' => ['required', 'string', 'max:255'],
            'bio_ar' => ['nullable', 'string', 'max:5000'],
            'bio_en' => ['nullable', 'string', 'max:5000'],
            'email' => ['nullable', 'email', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_photo' => ['sometimes', 'boolean'],
            'is_published' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:9999'],
        ];
    }
}
