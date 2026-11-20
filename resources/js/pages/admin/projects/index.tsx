import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
    Visibility,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    title: string;
    year: number;
    status: string;
    isPublished: boolean;
    sector: string;
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
            <RecordList count={projects.length} empty={t('emptyRecords')}>
                {projects.map((project) => (
                    <RecordRow key={project.editUrl}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {project.title}
                            </span>
                            <Meta
                                parts={[
                                    project.sector,
                                    String(project.year),
                                    label(locale, project.status),
                                ]}
                            />
                        </span>
                        <span className="flex items-center gap-4">
                            <Visibility
                                published={project.isPublished}
                                visible={t('visible')}
                                hidden={t('hidden')}
                            />
                            <EditLink href={project.editUrl}>
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
