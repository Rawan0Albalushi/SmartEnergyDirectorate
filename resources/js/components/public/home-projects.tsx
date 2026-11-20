import { LayoutGrid } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { SectorGlyph } from '@/components/public/entry';
import { ProjectCard, ProjectMoreTile } from '@/components/public/project-card';
import { SectionHeading } from '@/components/public/section-heading';
import { formatProjectCount } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { ProjectSummary, SectorLink } from '@/types/content';

export function HomeProjects({
    projects,
    sectors,
    total,
}: {
    projects: ProjectSummary[];
    sectors: SectorLink[];
    total: number;
}) {
    const { t, locale } = useI18n();
    const [active, setActive] = useState<string | null>(null);
    const available = sectors.filter((sector) =>
        projects.some((project) => project.sector?.slug === sector.slug),
    );
    const visible =
        active === null
            ? projects
            : projects.filter((project) => project.sector?.slug === active);

    return (
        <section
            className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-14"
            aria-labelledby="home-projects"
        >
            <SectionHeading
                id="home-projects"
                title={t('projectsHeading')}
                lede={t('projectsHomeLede')}
            />

            {available.length > 0 ? (
                <div
                    className="mt-8 flex flex-wrap gap-2"
                    role="group"
                    aria-label={t('sectors')}
                >
                    <FilterButton
                        current={active === null}
                        onSelect={() => setActive(null)}
                    >
                        <LayoutGrid className="size-3.5" aria-hidden="true" />
                        {t('all')}
                    </FilterButton>
                    {available.map((sector) => (
                        <FilterButton
                            key={sector.slug}
                            current={active === sector.slug}
                            onSelect={() => setActive(sector.slug)}
                        >
                            <SectorGlyph
                                slug={sector.slug}
                                className="size-3.5"
                            />
                            {sector.name}
                        </FilterButton>
                    ))}
                </div>
            ) : null}

            {visible.length === 0 ? (
                <p className="mt-6 text-sm text-[#3E534C]">
                    {t('emptyProjects')}
                </p>
            ) : null}

            {total > 0 ? (
                <ul className="mt-6 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
                    {visible.map((project, index) => (
                        <li key={project.slug} className="min-w-0">
                            <ProjectCard
                                project={project}
                                href={`/${locale}/projects/${project.slug}`}
                                index={index}
                            />
                        </li>
                    ))}
                    <li className="min-w-0">
                        <ProjectMoreTile
                            href={`/${locale}/projects`}
                            countLabel={formatProjectCount(total, locale)}
                            action={t('allProjects')}
                        />
                    </li>
                </ul>
            ) : null}
        </section>
    );
}

function FilterButton({
    current,
    onSelect,
    children,
}: {
    current: boolean;
    onSelect: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-pressed={current}
            onClick={onSelect}
            className={
                current
                    ? 'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-deep px-4 text-sm text-white'
                    : 'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 text-sm text-ink hover:bg-[#f7faf8]'
            }
        >
            {children}
        </button>
    );
}
