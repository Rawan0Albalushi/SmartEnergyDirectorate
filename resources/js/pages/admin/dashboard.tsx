import { Head, useForm } from '@inertiajs/react';
import { Building2, FolderKanban, Gauge, Newspaper } from 'lucide-react';
import {
    ActionCell,
    DataCell,
    DataRow,
    DataTable,
    PageIntro,
    RowAction,
    StatCards,
    StatusText,
    primaryButtonClass,
} from '@/components/admin/chrome';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';

type Pending = {
    id: number;
    title: string;
    sourceName: string | null;
    showUrl: string;
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
    showUrl: string;
};

export default function Dashboard({
    counts,
    pending,
    sources,
}: {
    counts: {
        indicators: number;
        projects: number;
        pendingNews: number;
        departments: number;
    };
    pending: Pending[];
    sources: SourceRow[];
}) {
    const { t, locale } = useI18n();
    const fetchForm = useForm({});
    const iconProps = {
        className: 'size-[18px]',
        strokeWidth: 1.75,
        'aria-hidden': true as const,
    };
    const figures = [
        {
            key: 'indicators',
            href: `/${locale}/admin/indicators`,
            label: t('indicators'),
            value: counts.indicators,
            icon: <Gauge {...iconProps} />,
        },
        {
            key: 'projects',
            href: `/${locale}/admin/projects`,
            label: t('projects'),
            value: counts.projects,
            icon: <FolderKanban {...iconProps} />,
        },
        {
            key: 'pending',
            href: `/${locale}/admin/news?status=pending`,
            label: t('pendingNews'),
            value: counts.pendingNews,
            icon: <Newspaper {...iconProps} />,
            attention: counts.pendingNews > 0,
        },
        {
            key: 'departments',
            href: `/${locale}/admin/departments`,
            label: t('departments'),
            value: counts.departments,
            icon: <Building2 {...iconProps} />,
        },
    ];

    return (
        <>
            <Head title={t('dashboard')} />
            <PageIntro
                title={t('adminHome')}
                action={
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            fetchForm.post(`/${locale}/admin/news-fetches`, {
                                preserveScroll: true,
                            });
                        }}
                    >
                        <button
                            type="submit"
                            disabled={fetchForm.processing}
                            className={primaryButtonClass}
                        >
                            {fetchForm.processing
                                ? t('fetching')
                                : t('fetchNews')}
                        </button>
                    </form>
                }
            />
            <StatCards items={figures} />
            <h2 className="mt-12 text-xl font-medium">{t('reviewQueue')}</h2>
            <DataTable
                label={t('reviewQueue')}
                count={pending.length}
                empty={t('noPending')}
                columns={[
                    { key: 'title', label: t('title') },
                    { key: 'source', label: t('source') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {pending.map((item) => (
                    <DataRow key={item.id}>
                        <DataCell primary>{item.title}</DataCell>
                        <DataCell>{item.sourceName || '—'}</DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={item.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="publish"
                                href={item.publishUrl}
                                method="post"
                                label={t('publish')}
                            />
                            <RowAction
                                kind="reject"
                                href={item.rejectUrl}
                                method="delete"
                                label={t('reject')}
                            />
                            <RowAction
                                kind="edit"
                                href={item.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
            <h2 className="mt-12 text-xl font-medium">{t('sources')}</h2>
            <DataTable
                label={t('sources')}
                count={sources.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'name', label: t('name') },
                    { key: 'status', label: t('status') },
                    { key: 'fetched', label: t('fetchedAt') },
                    { key: 'error', label: t('lastError') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {sources.map((source) => (
                    <DataRow key={source.id}>
                        <DataCell primary>{source.name}</DataCell>
                        <DataCell>
                            <StatusText
                                on={source.isActive}
                                onLabel={t('active')}
                                offLabel={t('inactive')}
                            />
                        </DataCell>
                        <DataCell>
                            {source.lastFetchedAt
                                ? formatDate(source.lastFetchedAt, locale)
                                : '—'}
                        </DataCell>
                        <DataCell wrap>
                            {source.lastError ? (
                                <span className="text-[#9f2c22]">
                                    {source.lastError}
                                </span>
                            ) : (
                                '—'
                            )}
                        </DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={source.showUrl}
                                label={t('view')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
        </>
    );
}
