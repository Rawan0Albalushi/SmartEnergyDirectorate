import { Head, Link, useForm } from '@inertiajs/react';
import { Building2, FolderKanban, Gauge, Newspaper } from 'lucide-react';
import {
    CommandButton,
    Meta,
    PageIntro,
    RecordList,
    RecordRow,
    StatCards,
    primaryButtonClass,
} from '@/components/admin/chrome';
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
            <RecordList
                count={pending.length === 0 ? 0 : pending.length}
                empty={t('noPending')}
            >
                {pending.map((item) => (
                    <RecordRow key={item.id}>
                        <span className="min-w-0">
                            <Link
                                href={item.editUrl}
                                className="text-base font-medium underline-offset-4 hover:underline"
                            >
                                {item.title}
                            </Link>
                            {item.sourceName ? (
                                <Meta parts={[item.sourceName]} />
                            ) : null}
                        </span>
                        <span className="flex flex-wrap gap-2">
                            <CommandButton href={item.publishUrl} method="post">
                                {t('publish')}
                            </CommandButton>
                            <CommandButton
                                href={item.rejectUrl}
                                method="delete"
                                tone="danger"
                            >
                                {t('reject')}
                            </CommandButton>
                        </span>
                    </RecordRow>
                ))}
            </RecordList>
            <h2 className="mt-12 text-xl font-medium">{t('sources')}</h2>
            <RecordList count={sources.length} empty={t('emptyRecords')}>
                {sources.map((source) => (
                    <RecordRow key={source.id}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {source.name}
                            </span>
                            <Meta
                                parts={[
                                    source.isActive
                                        ? t('active')
                                        : t('inactive'),
                                    source.lastFetchedAt
                                        ? formatDate(
                                              source.lastFetchedAt,
                                              locale,
                                          )
                                        : null,
                                ]}
                            />
                            {source.lastError ? (
                                <p className="mt-1 text-sm text-[#9f2c22]">
                                    {source.lastError}
                                </p>
                            ) : null}
                        </span>
                    </RecordRow>
                ))}
            </RecordList>
        </>
    );
}
