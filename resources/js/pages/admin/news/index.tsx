import { Head } from '@inertiajs/react';
import {
    CommandButton,
    EditLink,
    FilterLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
} from '@/components/admin/chrome';
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
            <PageIntro
                title={t('news')}
                hint={t('newsHint')}
                action={
                    <PrimaryLink href={`/${locale}/admin/news/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <div
                className="mt-5 flex flex-wrap gap-1"
                aria-label={t('filters')}
            >
                {filters.map((filter) => (
                    <FilterLink
                        key={filter.value || 'all'}
                        href={
                            filter.value
                                ? `/${locale}/admin/news?status=${filter.value}`
                                : `/${locale}/admin/news`
                        }
                        current={(activeStatus ?? '') === filter.value}
                    >
                        {filter.label}
                    </FilterLink>
                ))}
            </div>
            <RecordList count={articles.length} empty={t('emptyRecords')}>
                {articles.map((article) => (
                    <RecordRow key={article.editUrl}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {article.title}
                            </span>
                            <Meta
                                parts={[
                                    label(locale, article.scope),
                                    label(locale, article.status),
                                    label(locale, article.origin),
                                    article.sourceName,
                                ]}
                            />
                        </span>
                        <span className="flex flex-wrap items-center gap-2">
                            <CommandButton
                                href={article.publishUrl}
                                method="post"
                            >
                                {t('publish')}
                            </CommandButton>
                            <CommandButton
                                href={article.rejectUrl}
                                method="delete"
                                tone="danger"
                            >
                                {t('reject')}
                            </CommandButton>
                            <EditLink href={article.editUrl}>
                                {t('edit')}
                            </EditLink>
                        </span>
                    </RecordRow>
                ))}
            </RecordList>
            <Pager page={page} />
        </>
    );
}
