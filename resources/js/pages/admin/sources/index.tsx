import { Head } from '@inertiajs/react';
import {
    ActionCell,
    DataCell,
    DataRow,
    DataTable,
    PageIntro,
    PrimaryLink,
    RowAction,
    StatusText,
} from '@/components/admin/chrome';
import { label, useI18n } from '@/lib/i18n';

type Row = {
    id: number;
    name: string;
    feedUrl: string;
    locale: string;
    scope: string;
    isActive: boolean;
    lastError: string | null;
    showUrl: string;
    editUrl: string;
};

export default function SourceIndex({ sources }: { sources: Row[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('sources')} />
            <PageIntro
                title={t('sources')}
                hint={t('sourcesIntro')}
                action={
                    <PrimaryLink href={`/${locale}/admin/sources/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <DataTable
                label={t('sources')}
                count={sources.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'name', label: t('name') },
                    { key: 'feed', label: t('feedUrl') },
                    { key: 'language', label: t('feedLanguage') },
                    { key: 'scope', label: t('scope') },
                    { key: 'status', label: t('status') },
                    { key: 'error', label: t('lastError') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {sources.map((source) => (
                    <DataRow key={source.id}>
                        <DataCell primary>{source.name}</DataCell>
                        <DataCell wrap>
                            <span className="block max-w-md break-all text-[#3e534c]">
                                {source.feedUrl}
                            </span>
                        </DataCell>
                        <DataCell>{source.locale}</DataCell>
                        <DataCell>{label(locale, source.scope)}</DataCell>
                        <DataCell>
                            <StatusText
                                on={source.isActive}
                                onLabel={t('active')}
                                offLabel={t('inactive')}
                            />
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
                            <RowAction
                                kind="edit"
                                href={source.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
        </>
    );
}
