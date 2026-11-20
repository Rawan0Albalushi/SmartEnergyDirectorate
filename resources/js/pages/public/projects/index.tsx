import { Head } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { SectorGlyph } from '@/components/public/entry';
import { FilterPill, PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { ProjectCard } from '@/components/public/project-card';
import { useI18n } from '@/lib/i18n';
import type { PageMeta, ProjectSummary, SectorLink } from '@/types/content';

export default function ProjectsIndex({
    projects,
    page,
    sectors,
    activeSector,
}: {
    projects: ProjectSummary[];
    page: PageMeta;
    sectors: SectorLink[];
    activeSector: string | null;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('projects')} />
            <PageIntro title={t('projects')} lede={t('projectsIntro')} />
            <PageBody>
                <nav className="flex flex-wrap gap-2" aria-label={t('sectors')}>
                    <FilterPill
                        href={`/${locale}/projects`}
                        current={activeSector === null}
                    >
                        <LayoutGrid className="size-3.5" aria-hidden="true" />
                        {t('all')}
                    </FilterPill>
                    {sectors.map((sector) => (
                        <FilterPill
                            key={sector.slug}
                            href={`/${locale}/projects?sector=${sector.slug}`}
                            current={activeSector === sector.slug}
                        >
                            <SectorGlyph
                                slug={sector.slug}
                                className="size-3.5"
                            />
                            {sector.name}
                        </FilterPill>
                    ))}
                </nav>

                {projects.length === 0 ? (
                    <p className="mt-6 text-sm text-[#3E534C]">
                        {t('emptyProjects')}
                    </p>
                ) : null}

                <ul className="mt-6 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <li key={project.slug} className="min-w-0">
                            <ProjectCard
                                project={project}
                                href={`/${locale}/projects/${project.slug}`}
                                index={index}
                                detailed
                            />
                        </li>
                    ))}
                </ul>
                <Pager page={page} />
            </PageBody>
        </>
    );
}
