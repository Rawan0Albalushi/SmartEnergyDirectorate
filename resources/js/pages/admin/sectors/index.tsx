import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    RecordList,
    RecordRow,
} from '@/components/admin/chrome';
import { useI18n } from '@/lib/i18n';

type Row = { slug: string; name: string; summary: string; editUrl: string };

export default function SectorIndex({ sectors }: { sectors: Row[] }) {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('sectors')} />
            <PageIntro title={t('sectors')} />
            <RecordList count={sectors.length} empty={t('emptyRecords')}>
                {sectors.map((sector) => (
                    <RecordRow key={sector.slug}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {sector.name}
                            </span>
                            <Meta parts={[sector.summary]} />
                        </span>
                        <EditLink href={sector.editUrl}>{t('edit')}</EditLink>
                    </RecordRow>
                ))}
            </RecordList>
        </>
    );
}
