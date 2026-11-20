import { Head } from '@inertiajs/react';
import {
    ActionCell,
    DataCell,
    PhotoCell,
    DataRow,
    DataTable,
    PageIntro,
    PrimaryLink,
    RowAction,
    StatusText,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { useI18n } from '@/lib/i18n';
import { listedPhoto, useHeroSrc } from '@/lib/media';
import type { PageMeta } from '@/types/content';

type Row = {
    id: number;
    title: string;
    imageUrl: string | null;
    sectorSlug: string | null;
    year: number;
    isPublished: boolean;
    sector: string;
    showUrl: string;
    editUrl: string;
};

export default function AchievementIndex({
    achievements,
    page,
}: {
    achievements: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();
    const hero = useHeroSrc();

    return (
        <>
            <Head title={t('achievements')} />
            <PageIntro
                title={t('achievements')}
                action={
                    <PrimaryLink href={`/${locale}/admin/achievements/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <DataTable
                label={t('achievements')}
                count={achievements.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'title', label: t('title') },
                    { key: 'sector', label: t('sector') },
                    { key: 'year', label: t('year') },
                    { key: 'visibility', label: t('visibility') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {achievements.map((item) => (
                    <DataRow key={item.id}>
                        <PhotoCell
                            src={listedPhoto(
                                item.imageUrl,
                                item.sectorSlug,
                                hero,
                            )}
                        />
                        <DataCell primary>{item.title}</DataCell>
                        <DataCell>{item.sector || '—'}</DataCell>
                        <DataCell numeric>{item.year}</DataCell>
                        <DataCell>
                            <StatusText
                                on={item.isPublished}
                                onLabel={t('visible')}
                                offLabel={t('hidden')}
                            />
                        </DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={item.showUrl}
                                label={t('view')}
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
            <Pager page={page} />
        </>
    );
}
