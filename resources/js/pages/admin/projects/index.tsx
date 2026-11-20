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
import { label, useI18n } from '@/lib/i18n';
import { listedPhoto, useHeroSrc } from '@/lib/media';
import type { PageMeta } from '@/types/content';

type Row = {
    title: string;
    imageUrl: string | null;
    sectorSlug: string | null;
    year: number;
    status: string;
    isPublished: boolean;
    sector: string;
    showUrl: string;
    editUrl: string;
};

export default function ProjectIndex({
    projects,
    page,
}: {
    projects: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();
    const hero = useHeroSrc();

    return (
        <>
            <Head title={t('projects')} />
            <PageIntro
                title={t('projects')}
                action={
                    <PrimaryLink href={`/${locale}/admin/projects/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <DataTable
                label={t('projects')}
                count={projects.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'title', label: t('title') },
                    { key: 'sector', label: t('sector') },
                    { key: 'year', label: t('year') },
                    { key: 'status', label: t('status') },
                    { key: 'visibility', label: t('visibility') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {projects.map((project) => (
                    <DataRow key={project.editUrl}>
                        <PhotoCell
                            src={listedPhoto(
                                project.imageUrl,
                                project.sectorSlug,
                                hero,
                            )}
                        />
                        <DataCell primary>{project.title}</DataCell>
                        <DataCell>{project.sector}</DataCell>
                        <DataCell numeric>{project.year}</DataCell>
                        <DataCell>{label(locale, project.status)}</DataCell>
                        <DataCell>
                            <StatusText
                                on={project.isPublished}
                                onLabel={t('visible')}
                                offLabel={t('hidden')}
                            />
                        </DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={project.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="edit"
                                href={project.editUrl}
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
