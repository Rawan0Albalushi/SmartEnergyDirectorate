import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    BatteryCharging,
    Building2,
    Gauge,
    Layers,
    PieChart,
    Weight,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { StatusBadge } from '@/components/public/entry';
import { FieldPhoto } from '@/components/public/field-photo';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { formatNumber } from '@/lib/format';
import { label, useI18n } from '@/lib/i18n';
import type { IndicatorReading, SectorRecord } from '@/types/content';

export default function SectorsIndex({ sectors }: { sectors: SectorRecord[] }) {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('sectors')} />
            <PageIntro title={t('sectors')} lede={t('sectorsIntro')} />
            {sectors.length === 0 ? (
                <PageBody>
                    <p className="text-sm text-[#3E534C]">
                        {t('emptySectors')}
                    </p>
                </PageBody>
            ) : (
                sectors.map((sector, index) => {
                    const flipped = index % 2 === 1;

                    return (
                        <section
                            key={sector.slug}
                            id={sector.slug}
                            aria-labelledby={`sector-${sector.slug}`}
                            className={`scroll-mt-28 ${index % 2 === 0 ? 'bg-[#f4f7f5]' : 'bg-white'}`}
                        >
                            <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-6 lg:py-24">
                                <div
                                    className={`grid items-center gap-10 lg:gap-16 ${flipped ? 'lg:grid-cols-[6fr_5fr]' : 'lg:grid-cols-[5fr_6fr]'}`}
                                >
                                    <div
                                        className={
                                            flipped ? 'lg:order-2' : undefined
                                        }
                                    >
                                        <FieldPhoto
                                            src={sector.imageUrl}
                                            slug={sector.slug}
                                            alt=""
                                            className="aspect-video w-full rounded-2xl object-cover lg:aspect-[5/4]"
                                        />
                                    </div>
                                    <div
                                        className={
                                            flipped ? 'lg:order-1' : undefined
                                        }
                                    >
                                        <p className="text-[0.9375rem] font-semibold text-sea">
                                            {String(index + 1).padStart(2, '0')}
                                        </p>
                                        <h2
                                            id={`sector-${sector.slug}`}
                                            className="mt-3 max-w-xl text-3xl font-medium text-balance text-deep sm:text-4xl"
                                        >
                                            {sector.name}
                                        </h2>
                                        <p className="mt-6 max-w-prose text-base leading-7 text-[#3E534C]">
                                            {sector.body || sector.summary}
                                        </p>
                                        {sector.indicators.length > 0 ? (
                                            <ul className="mt-6 flex flex-wrap gap-2">
                                                {sector.indicators.map(
                                                    (indicator) => (
                                                        <ReadingMark
                                                            key={indicator.id}
                                                            indicator={
                                                                indicator
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </ul>
                                        ) : null}
                                    </div>
                                </div>
                                <SectorFacts sector={sector} />
                            </div>
                        </section>
                    );
                })
            )}
        </>
    );
}

function ReadingMark({ indicator }: { indicator: IndicatorReading }) {
    const { locale } = useI18n();
    const Icon = readingIcon(indicator.unit);

    return (
        <li className="flex min-h-16 min-w-40 flex-1 items-center gap-2 rounded-xl bg-white px-3 py-2 ring-1 ring-line sm:max-w-56">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee] text-sea">
                <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
                <span className="block text-lg leading-none font-medium text-deep tabular-nums">
                    {formatNumber(indicator.value, locale)}
                    <span className="ms-1 text-xs font-normal text-[#3E534C]">
                        {indicator.unit}
                    </span>
                </span>
                <span className="mt-1 line-clamp-2 text-xs leading-4 text-[#3E534C]">
                    {indicator.name}
                </span>
            </span>
        </li>
    );
}

function readingIcon(unit: string): LucideIcon {
    const key = unit.trim().toLowerCase();

    if (key.includes('%') || key.includes('٪')) {
        return PieChart;
    }

    if (key.includes('gwh') || key.includes('ساعة')) {
        return BatteryCharging;
    }

    if (key.includes('gw') || key.includes('غيغا')) {
        return Activity;
    }

    if (key.includes('mw') || key.includes('ميغا')) {
        return Zap;
    }

    if (key.includes('ton') || key.includes('طن')) {
        return Weight;
    }

    if (key.includes('project') || key.includes('مشروع')) {
        return Layers;
    }

    if (key.includes('build') || key.includes('مبن')) {
        return Building2;
    }

    return Gauge;
}

function SectorFacts({ sector }: { sector: SectorRecord }) {
    const { t, locale } = useI18n();

    if (sector.projects.length === 0) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-sm font-medium text-deep">
                {t('relatedProjects')}
            </h3>
            <ul
                className={`mt-3 grid gap-3 ${sector.projects.length > 1 ? 'md:grid-cols-2' : ''}`}
            >
                {sector.projects.map((project, index) => (
                    <li key={project.slug}>
                        <Link
                            href={`/${locale}/projects/${project.slug}`}
                            className="flex h-full overflow-hidden rounded-2xl bg-white ring-1 ring-line"
                        >
                            <span className="relative w-28 shrink-0 self-stretch sm:w-40">
                                <FieldPhoto
                                    src={project.imageUrl || sector.imageUrl}
                                    slug={sector.slug}
                                    alt=""
                                    className={`absolute inset-0 h-full w-full object-cover ${cropPositions[index % cropPositions.length]}`}
                                />
                            </span>
                            <span className="min-w-0 flex-1 p-3 sm:p-4">
                                <span className="flex flex-wrap items-center gap-2">
                                    <span className="text-sm text-[#3E534C] tabular-nums">
                                        {project.year}
                                    </span>
                                    <StatusBadge status={project.status}>
                                        {label(locale, project.status)}
                                    </StatusBadge>
                                </span>
                                <span className="mt-1.5 block text-base leading-6 font-medium text-ink">
                                    {project.title}
                                </span>
                                <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">
                                    {project.summary}
                                </span>
                                {project.location ? (
                                    <span className="mt-1 block truncate text-sm text-[#3E534C]">
                                        {project.location}
                                    </span>
                                ) : null}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const cropPositions = [
    'object-center',
    'object-[28%_center]',
    'object-[72%_40%]',
];
