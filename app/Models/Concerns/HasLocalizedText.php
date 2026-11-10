<?php

namespace App\Models\Concerns;

trait HasLocalizedText
{
    public function localized(string $field): string
    {
        $locale = app()->getLocale() === 'en' ? 'en' : 'ar';
        $primary = $this->getAttribute($field.'_'.$locale);

        if (is_string($primary) && $primary !== '') {
            return $primary;
        }

        $fallback = $locale === 'ar' ? 'en' : 'ar';
        $secondary = $this->getAttribute($field.'_'.$fallback);

        return is_string($secondary) ? $secondary : '';
    }
}
