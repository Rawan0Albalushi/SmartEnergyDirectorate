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
import { Pager } from '@/components/public/pager';
import { formatNumber } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    id: number;
    name: string;
    value: number;
    unit: string;
    period: string;
    isPublished: boolean;
    sector: string;
    showUrl: string;
    editUrl: string;
};

export default function IndicatorIndex({
    indicators,
    page,
}: {
    indicators: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('indicators')} />
            <PageIntro
                title={t('indicators')}
                action={
                    <PrimaryLink href={`/${locale}/admin/indicators/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <DataTable
                label={t('indicators')}
                count={indicators.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'sector', label: t('sector') },
                    { key: 'name', label: t('name') },
                    { key: 'period', label: t('period') },
                    { key: 'value', label: t('value') },
                    { key: 'visibility', label: t('visibility') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {indicators.map((row) => (
                    <DataRow key={row.id}>
                        <DataCell>{row.sector}</DataCell>
                        <DataCell primary>{row.name}</DataCell>
                        <DataCell>{row.period || '—'}</DataCell>
                        <DataCell numeric>
                            {formatNumber(row.value, locale)} {row.unit}
                        </DataCell>
                        <DataCell>
                            <StatusText
                                on={row.isPublished}
                                onLabel={t('visible')}
                                offLabel={t('hidden')}
                            />
                        </DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={row.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="edit"
                                href={row.editUrl}
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
