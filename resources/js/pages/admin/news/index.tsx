import { Head } from '@inertiajs/react';
import {
    ActionCell,
    DataCell,
    PhotoCell,
    DataRow,
    DataTable,
    FilterLink,
    PageIntro,
    PrimaryLink,
    RowAction,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import { listedPhoto, useHeroSrc } from '@/lib/media';
import type { PageMeta } from '@/types/content';

type Row = {
    title: string;
    imageUrl: string | null;
    sectorSlug: string | null;
    scope: string;
    status: string;
    origin: string;
    sourceName: string | null;
    showUrl: string;
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
    const hero = useHeroSrc();
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
            <DataTable
                label={t('news')}
                count={articles.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'title', label: t('title') },
                    { key: 'scope', label: t('scope') },
                    { key: 'status', label: t('status') },
                    { key: 'origin', label: t('origin') },
                    { key: 'source', label: t('source') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {articles.map((article) => (
                    <DataRow key={article.editUrl}>
                        <PhotoCell
                            src={listedPhoto(
                                article.imageUrl,
                                article.sectorSlug,
                                hero,
                            )}
                        />
                        <DataCell primary>{article.title}</DataCell>
                        <DataCell>{label(locale, article.scope)}</DataCell>
                        <DataCell>{label(locale, article.status)}</DataCell>
                        <DataCell>{label(locale, article.origin)}</DataCell>
                        <DataCell>{article.sourceName || '—'}</DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={article.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="publish"
                                href={article.publishUrl}
                                method="post"
                                label={t('publish')}
                            />
                            <RowAction
                                kind="reject"
                                href={article.rejectUrl}
                                method="delete"
                                label={t('reject')}
                            />
                            <RowAction
                                kind="edit"
                                href={article.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
            <Pager page={page} />
        </>
    );
}
