import { Head, Link } from '@inertiajs/react';
import { PageIntro, PrimaryLink, StatusText } from '@/components/admin/chrome';
import { formatDate } from '@/lib/format';
import { label, useI18n, type TranslationKey } from '@/lib/i18n';

type Field = {
    label: TranslationKey;
    value: string;
    format: 'text' | 'code' | 'visibility' | 'active' | 'date' | 'image';
};

export default function Details({
    title,
    backUrl,
    editUrl,
    fields,
}: {
    title: string;
    backUrl: string;
    editUrl: string;
    fields: Field[];
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={title} />
            <PageIntro
                title={title}
                action={<PrimaryLink href={editUrl}>{t('edit')}</PrimaryLink>}
            />
            <Link
                href={backUrl}
                className="mt-3 inline-flex min-h-11 items-center text-sm text-[#3e534c] underline-offset-4 hover:text-ink hover:underline"
            >
                {t('cancel')}
            </Link>
            <dl className="mt-4 overflow-hidden rounded-[8px] border border-line bg-white">
                {fields.map((field) => (
                    <div
                        key={field.label}
                        className="grid gap-1 border-b border-line px-5 py-4 last:border-b-0 sm:grid-cols-[14rem_minmax(0,1fr)] sm:items-start sm:gap-8"
                    >
                        <dt className="text-sm leading-6 text-[#3e534c]">
                            {t(field.label)}
                        </dt>
                        <dd className="text-sm leading-6 break-words whitespace-pre-wrap text-ink">
                            <FieldValue field={field} locale={locale} />
                        </dd>
                    </div>
                ))}
            </dl>
        </>
    );
}

function FieldValue({ field, locale }: { field: Field; locale: 'ar' | 'en' }) {
    const { t } = useI18n();

    if (field.format === 'visibility') {
        return (
            <StatusText
                on={field.value === '1'}
                onLabel={t('visible')}
                offLabel={t('hidden')}
            />
        );
    }

    if (field.format === 'active') {
        return (
            <StatusText
                on={field.value === '1'}
                onLabel={t('active')}
                offLabel={t('inactive')}
            />
        );
    }

    if (field.value === '') {
        return '—';
    }

    if (field.format === 'image') {
        return (
            <img
                src={field.value}
                alt=""
                className="h-40 w-full max-w-sm rounded-[6px] object-cover"
            />
        );
    }

    if (field.format === 'code') {
        return label(locale, field.value);
    }

    if (field.format === 'date') {
        return formatDate(field.value, locale);
    }

    return field.value;
}
