<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

abstract class DirectorateFormRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        foreach (['is_published', 'is_active'] as $field) {
            if ($this->exists($field)) {
                $merge[$field] = $this->boolean($field);
            }
        }

        if ($this->exists('remove_image')) {
            $merge['remove_image'] = $this->boolean('remove_image');
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    /**
     * @return array<string, array<int, string>>
     */
    protected function imageRules(): array
    {
        return [
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:4096'],
            'remove_image' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        $ar = app()->getLocale() === 'ar';

        return [
            'name_ar' => $ar ? 'الاسم بالعربية' : 'Name in Arabic',
            'name_en' => $ar ? 'الاسم بالإنجليزية' : 'Name in English',
            'title_ar' => $ar ? 'العنوان بالعربية' : 'Title in Arabic',
            'title_en' => $ar ? 'العنوان بالإنجليزية' : 'Title in English',
            'summary_ar' => $ar ? 'الملخص بالعربية' : 'Summary in Arabic',
            'summary_en' => $ar ? 'الملخص بالإنجليزية' : 'Summary in English',
            'body_ar' => $ar ? 'النص بالعربية' : 'Body in Arabic',
            'body_en' => $ar ? 'النص بالإنجليزية' : 'Body in English',
            'mandate_ar' => $ar ? 'الاختصاص بالعربية' : 'Mandate in Arabic',
            'mandate_en' => $ar ? 'الاختصاص بالإنجليزية' : 'Mandate in English',
            'unit_ar' => $ar ? 'الوحدة بالعربية' : 'Unit in Arabic',
            'unit_en' => $ar ? 'الوحدة بالإنجليزية' : 'Unit in English',
            'notes_ar' => $ar ? 'الملاحظات بالعربية' : 'Notes in Arabic',
            'notes_en' => $ar ? 'الملاحظات بالإنجليزية' : 'Notes in English',
            'location_ar' => $ar ? 'الموقع بالعربية' : 'Location in Arabic',
            'location_en' => $ar ? 'الموقع بالإنجليزية' : 'Location in English',
            'title_job_ar' => $ar ? 'المسمى بالعربية' : 'Job title in Arabic',
            'sector_id' => $ar ? 'القطاع' : 'Sector',
            'department_id' => $ar ? 'القسم' : 'Department',
            'value' => $ar ? 'القيمة' : 'Value',
            'period_label' => $ar ? 'الفترة' : 'Period',
            'recorded_on' => $ar ? 'تاريخ القراءة' : 'Reading date',
            'year' => $ar ? 'السنة' : 'Year',
            'status' => $ar ? 'الحالة' : 'Status',
            'scope' => $ar ? 'النطاق' : 'Scope',
            'feed_url' => $ar ? 'رابط المصدر' : 'Feed URL',
            'locale' => $ar ? 'لغة المصدر' : 'Feed language',
            'bio_ar' => $ar ? 'السيرة بالعربية' : 'Biography in Arabic',
            'bio_en' => $ar ? 'السيرة بالإنجليزية' : 'Biography in English',
            'photo' => $ar ? 'الصورة' : 'Photo',
            'image' => $ar ? 'الصورة' : 'Photo',
            'roster' => $ar ? 'التصنيف' : 'Group',
            'email' => $ar ? 'البريد الإلكتروني' : 'Email',
            'phone' => $ar ? 'الهاتف' : 'Phone',
            'original_url' => $ar ? 'الرابط الأصلي' : 'Original URL',
            'source_name' => $ar ? 'اسم المصدر' : 'Source name',
            'published_at' => $ar ? 'تاريخ النشر' : 'Publication date',
            'sort_order' => $ar ? 'الترتيب' : 'Sort order',
            'is_published' => $ar ? 'الظهور' : 'Visibility',
            'is_active' => $ar ? 'التفعيل' : 'Active',
        ];
    }
}
