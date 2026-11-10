import { Head, Link, useForm } from '@inertiajs/react';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';

type Pending = {
    id: number;
    title: string;
    sourceName: string | null;
    editUrl: string;
    publishUrl: string;
    rejectUrl: string;
};

type SourceRow = {
    id: number;
    name: string;
    isActive: boolean;
    lastError: string | null;
    lastFetchedAt: string | null;
};

export default function Dashboard({
    counts,
    pending,
    sources,
}: {
    counts: { indicators: number; projects: number; pendingNews: number; departments: number };
    pending: Pending[];
    sources: SourceRow[];
}) {
    const { t, locale } = useI18n();
    const fetchForm = useForm({});

    return (
        <>
            <Head title={t('dashboard')} />
            <h1 className="text-2xl font-medium">{t('adminHome')}</h1>
            <dl className="mt-6 grid grid-cols-2 border-y border-line lg:grid-cols-4">
                <Count label={t('indicators')} value={counts.indicators} />
                <Count label={t('projects')} value={counts.projects} />
                <Count label={t('pendingNews')} value={counts.pendingNews} />
                <Count label={t('departments')} value={counts.departments} />
            </dl>
            <form
                className="mt-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    fetchForm.post(`/${locale}/admin/news-fetches`, { preserveScroll: true });
                }}
            >
                <button type="submit" disabled={fetchForm.processing} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white disabled:opacity-60">
                    {fetchForm.processing ? t('fetching') : t('fetchNews')}
                </button>
            </form>
            <h2 className="mt-10 text-xl font-medium">{t('reviewQueue')}</h2>
            {pending.length === 0 ? <p className="mt-3 text-sm text-[#3E534C]">{t('noPending')}</p> : null}
            <ul className="mt-3 divide-y divide-line border-y border-line">
                {pending.map((item) => (
                    <li key={item.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            <Link href={item.editUrl} className="text-lg underline">{item.title}</Link>
                            {item.sourceName ? <span className="mt-1 block text-sm text-[#3E534C]">{item.sourceName}</span> : null}
                        </span>
                        <span className="flex gap-2">
                            <Action href={item.publishUrl} method="post">{t('publish')}</Action>
                            <Action href={item.rejectUrl} method="delete">{t('reject')}</Action>
                        </span>
                    </li>
                ))}
            </ul>
            <h2 className="mt-10 text-xl font-medium">{t('sources')}</h2>
            <ul className="mt-3 divide-y divide-line border-y border-line">
                {sources.map((source) => (
                    <li key={source.id} className="py-3 text-sm">
                        <span className="font-medium">{source.name}</span>
                        <span className="mx-2 text-[#3E534C]">{source.isActive ? t('active') : t('inactive')}</span>
                        {source.lastFetchedAt ? <span className="text-[#3E534C]">{formatDate(source.lastFetchedAt, locale)}</span> : null}
                        {source.lastError ? <span className="mt-1 block text-[#B42318]">{source.lastError}</span> : null}
                    </li>
                ))}
            </ul>
        </>
    );
}

function Count({ label, value }: { label: string; value: number }) {
    return (
        <div className="border-b border-line px-1 py-4 lg:border-b-0 lg:border-s lg:px-4 first:border-s-0">
            <dt className="text-sm text-[#3E534C]">{label}</dt>
            <dd className="mt-1 text-3xl font-medium tabular-nums">{value}</dd>
        </div>
    );
}

function Action({ href, method, children }: { href: string; method: 'post' | 'delete'; children: string }) {
    const form = useForm({});

    return (
        <button
            type="button"
            className="inline-flex min-h-11 items-center border border-line px-3 text-sm"
            onClick={() => {
                if (method === 'post') {
                    form.post(href, { preserveScroll: true });
                } else {
                    form.delete(href, { preserveScroll: true });
                }
            }}
        >
            {children}
        </button>
    );
}
