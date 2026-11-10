import { Head } from '@inertiajs/react';
import { EntryLink, StatusBadge, Thumb, YearMark } from '@/components/public/entry';
import { PageBody, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta, ProjectSummary } from '@/types/content';

export default function ProjectsIndex({ projects, page }: { projects: ProjectSummary[]; page: PageMeta }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('projects')} />
            <PageIntro title={t('projects')} lede={t('projectsIntro')} />
            <PageBody>
                <Sheet>
                    {projects.length === 0 ? <p className="px-4 py-6 text-sm text-[#3E534C] sm:px-5">{t('emptyProjects')}</p> : null}
                    <ul>
                        {projects.map((project) => (
                            <li key={project.slug} className="border-b border-line last:border-b-0">
                                <EntryLink href={`/${locale}/projects/${project.slug}`}>
                                    <Thumb slug={project.sector?.slug} />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <YearMark>{project.year}</YearMark>
                                            <StatusBadge status={project.status}>{label(locale, project.status)}</StatusBadge>
                                            {project.sector ? (
                                                <span className="text-xs text-[#3E534C]">{project.sector.name}</span>
                                            ) : null}
                                        </span>
                                        <span className="mt-1.5 block text-base font-medium leading-6 text-ink">{project.title}</span>
                                        <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">{project.summary}</span>
                                    </span>
                                </EntryLink>
                            </li>
                        ))}
                    </ul>
                </Sheet>
                <Pager page={page} />
            </PageBody>
        </>
    );
}
