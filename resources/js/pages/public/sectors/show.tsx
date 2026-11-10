import { Head } from '@inertiajs/react';
import { EntryLink, StatusBadge, Thumb, YearMark } from '@/components/public/entry';
import { PageBody, SectionTitle, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { formatNumber } from '@/lib/format';
import { label, useI18n } from '@/lib/i18n';
import type { IndicatorReading, ProjectSummary, SectorDetail } from '@/types/content';

export default function SectorShow({
    sector,
    indicators,
    projects,
}: {
    sector: SectorDetail;
    indicators: IndicatorReading[];
    projects: ProjectSummary[];
}) {
    const { t, locale } = useI18n();
    const groups = groupByUnit(indicators);

    return (
        <>
            <Head title={sector.name} />
            <PageIntro title={sector.name} lede={sector.summary} />
            <PageBody>
                {sector.body ? <p className="max-w-3xl text-base leading-8">{sector.body}</p> : null}

                <SectionTitle className={sector.body ? 'mt-12' : ''}>{t('indicators')}</SectionTitle>
                {indicators.length === 0 ? (
                    <p className="mt-4 text-sm text-[#3E534C]">{t('emptyIndicators')}</p>
                ) : (
                    <Sheet className="mt-4">
                        {groups.map(([unit, rows]) => (
                            <div key={unit}>
                                <p className="px-4 pt-4 text-sm text-[#3E534C] sm:px-5">{unit}</p>
                                <ul>
                                    {rows.map((row) => (
                                        <li
                                            key={row.id}
                                            className="grid gap-2 border-b border-line px-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:px-5"
                                        >
                                            <div>
                                                <p className="text-base font-medium text-ink">{row.name}</p>
                                                <p className="mt-1 text-sm text-[#3E534C]">{row.period}</p>
                                            </div>
                                            <p className="text-2xl font-medium tracking-tight text-deep tabular-nums">
                                                {formatNumber(row.value, locale)}
                                                <span className="ms-2 text-sm font-normal text-[#3E534C]">{row.unit}</span>
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </Sheet>
                )}

                <SectionTitle className="mt-12">{t('relatedProjects')}</SectionTitle>
                {projects.length === 0 ? (
                    <p className="mt-4 text-sm text-[#3E534C]">{t('emptyProjects')}</p>
                ) : (
                    <div className="mt-4">
                        <Sheet>
                            <ul>
                                {projects.map((project) => (
                                    <li key={project.slug} className="border-b border-line last:border-b-0">
                                        <EntryLink href={`/${locale}/projects/${project.slug}`}>
                                            <Thumb slug={project.sector?.slug ?? sector.slug} />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-2">
                                                    <YearMark>{project.year}</YearMark>
                                                    <StatusBadge status={project.status}>
                                                        {label(locale, project.status)}
                                                    </StatusBadge>
                                                </span>
                                                <span className="mt-1.5 block text-base font-medium leading-6 text-ink">
                                                    {project.title}
                                                </span>
                                                <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">
                                                    {project.summary}
                                                </span>
                                            </span>
                                        </EntryLink>
                                    </li>
                                ))}
                            </ul>
                        </Sheet>
                    </div>
                )}
            </PageBody>
        </>
    );
}

function groupByUnit(indicators: IndicatorReading[]): [string, IndicatorReading[]][] {
    const groups = new Map<string, IndicatorReading[]>();

    for (const indicator of indicators) {
        const rows = groups.get(indicator.unit) ?? [];
        rows.push(indicator);
        groups.set(indicator.unit, rows);
    }

    return [...groups.entries()];
}
