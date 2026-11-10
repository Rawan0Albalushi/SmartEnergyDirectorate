import type { Locale } from '@/lib/i18n';

export function formatNumber(value: number, locale: Locale): string {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en', {
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatDate(value: string | null, locale: Locale): string {
    if (!value) {
        return '';
    }

    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    const date = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar' : 'en', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date);
}
