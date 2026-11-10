import { Head, Link } from '@inertiajs/react';
import { label, useI18n } from '@/lib/i18n';

type Row = {
    id: number;
    name: string;
    feedUrl: string;
    locale: string;
    scope: string;
    isActive: boolean;
    lastError: string | null;
    editUrl: string;
};

export default function SourceIndex({ sources }: { sources: Row[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('sources')} />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-medium">{t('sources')}</h1>
                <Link href={`/${locale}/admin/sources/create`} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{t('create')}</Link>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-[#3E534C]">{t('sourcesIntro')}</p>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {sources.map((source) => (
                    <li key={source.id} className="py-4">
                        <Link href={source.editUrl} className="text-lg underline">{source.name}</Link>
                        <p className="mt-1 break-all text-sm text-[#3E534C]">{source.feedUrl}</p>
                        <p className="mt-1 text-sm text-[#3E534C]">{source.locale} · {label(locale, source.scope)} · {source.isActive ? t('active') : t('inactive')}</p>
                        {source.lastError ? <p className="mt-1 text-sm text-[#B42318]">{source.lastError}</p> : null}
                    </li>
                ))}
            </ul>
        </>
    );
}
