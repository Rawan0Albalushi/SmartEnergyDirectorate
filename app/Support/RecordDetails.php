<?php

namespace App\Support;

class RecordDetails
{
    /**
     * @param  list<array{label: string, value: string, format: string}>  $fields
     * @return array{title: string, backUrl: string, editUrl: string, fields: list<array{label: string, value: string, format: string}>}
     */
    public static function make(string $title, string $backUrl, string $editUrl, array $fields): array
    {
        return [
            'title' => $title,
            'backUrl' => $backUrl,
            'editUrl' => $editUrl,
            'fields' => $fields,
        ];
    }

    /**
     * @return array{label: string, value: string, format: string}
     */
    public static function text(string $label, mixed $value): array
    {
        return [
            'label' => $label,
            'value' => $value === null ? '' : (string) $value,
            'format' => 'text',
        ];
    }

    /**
     * @return array{label: string, value: string, format: string}
     */
    public static function code(string $label, string $value): array
    {
        return [
            'label' => $label,
            'value' => $value,
            'format' => 'code',
        ];
    }

    /**
     * @return array{label: string, value: string, format: string}
     */
    public static function date(string $label, mixed $value): array
    {
        return [
            'label' => $label,
            'value' => $value === null ? '' : (string) $value,
            'format' => 'date',
        ];
    }

    /**
     * @return array{label: string, value: string, format: string}
     */
    public static function image(string $label, ?string $url): array
    {
        return [
            'label' => $label,
            'value' => $url ?? '',
            'format' => 'image',
        ];
    }

    /**
     * @return array{label: string, value: string, format: string}
     */
    public static function flag(string $label, bool $on, string $format): array
    {
        return [
            'label' => $label,
            'value' => $on ? '1' : '0',
            'format' => $format,
        ];
    }
}
