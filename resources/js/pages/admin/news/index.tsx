import { Head, Link, useForm } from '@inertiajs/react';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    title: string;
    scope: string;
    status: string;
    origin: string;
    sourceName: string | null;
    editUrl: string;
    publishUrl: string;
    rejectUrl: string;
};

export default function NewsIndex({
    articles,
    page,
    activeStatus,
}: {
    articles: Row[];
    page: PageMeta;
    activeStatus: string | null;
}) {
    const { t, locale } = useI18n();
    const filters = [
        { value: '', label: t('all') },
        { value: 'pending', label: t('pending') },
        { value: 'published', label: t('published') },
        { value: 'rejected', label: t('rejected') },
    ];

    return (
        <>
            <Head title={t('news')} />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-medium">{t('news')}</h1>
                <Link href={`/${locale}/admin/news/create`} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{t('create')}</Link>
            </div>
            <p className="mt-2 max-w-2xl text-sm text-[#3E534C]">{t('newsHint')}</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {filters.map((filter) => (
                    <Link
                        key={filter.value || 'all'}
                        href={filter.value ? `/${locale}/admin/news?status=${filter.value}` : `/${locale}/admin/news`}
                        aria-current={activeStatus === (filter.value || null) ? 'page' : undefined}
                        className={(activeStatus ?? '') === filter.value ? 'inline-flex min-h-11 items-center bg-deep px-3 text-sm text-white' : 'inline-flex min-h-11 items-center border border-line px-3 text-sm'}
                    >
                        {filter.label}
                    </Link>
                ))}
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {articles.map((article) => (
                    <li key={article.editUrl} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <span>
                            <Link href={article.editUrl} className="text-lg underline">{article.title}</Link>
                            <span className="mt-1 block text-sm text-[#3E534C]">
                                {label(locale, article.scope)} · {label(locale, article.status)} · {label(locale, article.origin)}
                                {article.sourceName ? ` · ${article.sourceName}` : ''}
                            </span>
                        </span>
                        <span className="flex gap-2">
                            <Quick href={article.publishUrl} method="post">{t('publish')}</Quick>
                            <Quick href={article.rejectUrl} method="delete">{t('reject')}</Quick>
                        </span>
                    </li>
                ))}
            </ul>
            <Pager page={page} />
        </>
    );
}

function Quick({ href, method, children }: { href: string; method: 'post' | 'delete'; children: string }) {
    const form = useForm({});

    return (
        <button
            type="button"
            className="inline-flex min-h-11 items-center border border-line px-3 text-sm"
            onClick={() => (method === 'post' ? form.post(href, { preserveScroll: true }) : form.delete(href, { preserveScroll: true }))}
        >
            {children}
        </button>
    );
}
