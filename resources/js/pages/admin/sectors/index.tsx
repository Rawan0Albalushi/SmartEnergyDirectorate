import { Head } from '@inertiajs/react';
import {
    ActionCell,
    DataCell,
    PhotoCell,
    DataRow,
    DataTable,
    PageIntro,
    RowAction,
} from '@/components/admin/chrome';
import { useI18n } from '@/lib/i18n';
import { listedPhoto, useHeroSrc } from '@/lib/media';

type Row = {
    slug: string;
    imageUrl: string | null;
    name: string;
    summary: string;
    showUrl: string;
    editUrl: string;
};

export default function SectorIndex({ sectors }: { sectors: Row[] }) {
    const { t } = useI18n();
    const hero = useHeroSrc();

    return (
        <>
            <Head title={t('sectors')} />
            <PageIntro title={t('sectors')} />
            <DataTable
                label={t('sectors')}
                count={sectors.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'name', label: t('name') },
                    { key: 'summary', label: t('summary') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {sectors.map((sector) => (
                    <DataRow key={sector.slug}>
                        <PhotoCell
                            src={listedPhoto(
                                sector.imageUrl,
                                sector.slug,
                                hero,
                            )}
                        />
                        <DataCell primary>{sector.name}</DataCell>
                        <DataCell wrap>{sector.summary || '—'}</DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={sector.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="edit"
                                href={sector.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
        </>
    );
}
