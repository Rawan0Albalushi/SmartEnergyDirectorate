import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BatteryCharging,
    Building2,
    ChartColumn,
    ClipboardList,
    Database,
    Layers,
    LayoutGrid,
    Leaf,
    Share2,
    SunMedium,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { SectorGlyph } from '@/components/public/entry';
import { FieldPhoto } from '@/components/public/field-photo';
import { departmentPlates } from '@/lib/department-plates';
import { horizon } from '@/lib/fields';
import { formatNumber } from '@/lib/format';
import { useI18n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { DepartmentSummary, IndicatorReading, SectorHome } from '@/types/content';

const cardTones = [
    { plate: 'bg-[#e7f3fb]', ink: 'text-[#2b6f9a]' },
    { plate: 'bg-[#e7f6ec]', ink: 'text-[#217a45]' },
    { plate: 'bg-[#fff1e8]', ink: 'text-[#d26522]' },
    { plate: 'bg-[#e7f7f5]', ink: 'text-[#1d8f86]' },
    { plate: 'bg-[#f3eefb]', ink: 'text-[#6d56c8]' },
];

const departmentIcons: Record<string, LucideIcon> = {
    planning: ClipboardList,
    renewables: Leaf,
    power: Zap,
    efficiency: Building2,
    communications: Share2,
};

export function HomeIndicators({
    sectors,
    indicators,
}: {
    sectors: SectorHome[];
    indicators: IndicatorReading[];
}) {
    const { t, locale } = useI18n();
    const [active, setActive] = useState<string | null>(null);
    const featured = sectors.find((sector) => sector.slug === active) ?? null;
    const rows = featured ? indicators.filter((item) => item.sector?.slug === featured.slug) : indicators;

    return (
        <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-14" aria-labelledby="home-indicators">
            <div className="max-w-xl">
                <h2 id="home-indicators" className="text-3xl font-medium text-deep sm:text-4xl">
                    {t('indicatorsEyebrow')}
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#3E534C]">{t('indicatorsHomeLede')}</p>
            </div>

            {sectors.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={t('sectors')}>
                    <FilterPill current={active === null} onSelect={() => setActive(null)} id="home-sector-tab-all">
                        <LayoutGrid className="size-3.5" aria-hidden="true" />
                        {t('all')}
                    </FilterPill>
                    {sectors.map((sector) => (
                        <FilterPill
                            key={sector.slug}
                            current={active === sector.slug}
                            onSelect={() => setActive(sector.slug)}
                            id={`home-sector-tab-${sector.slug}`}
                        >
                            <SectorGlyph slug={sector.slug} className="size-3.5" />
                            {sector.name}
                        </FilterPill>
                    ))}
                </div>
            ) : null}

            <div
                id="home-indicators-panel"
                role="tabpanel"
                aria-labelledby={featured ? `home-sector-tab-${featured.slug}` : 'home-sector-tab-all'}
                className="mt-6"
            >
                {rows.length === 0 ? (
                    <p className="text-sm text-[#3E534C]">{t('emptyIndicators')}</p>
                ) : (
                    <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <ul className="grid h-full grid-cols-2 gap-4 lg:grid-cols-4">
                            {rows.map((indicator, index) => (
                                <ReadingCard key={indicator.id} indicator={indicator} index={index} locale={locale} />
                            ))}
                        </ul>
                        <StageCard
                            featured={featured}
                            title={featured ? featured.name : t('indicatorsStageTitle')}
                            lede={featured ? featured.summary : t('indicatorsStageLede')}
                            href={featured ? `/${locale}/sectors#${featured.slug}` : `/${locale}/sectors`}
                            action={featured ? t('sectorDetails') : t('allSectors')}
                        />
                    </div>
                )}
            </div>
        </section>
    );
}

function FilterPill({
    current,
    onSelect,
    id,
    children,
}: {
    current: boolean;
    onSelect: () => void;
    id: string;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            role="tab"
            id={id}
            aria-selected={current}
            aria-controls="home-indicators-panel"
            onClick={onSelect}
            className={
                current
                    ? 'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-deep px-4 text-sm text-white shadow-[0_8px_18px_rgba(12,46,42,0.18)]'
                    : 'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#e7eeea] bg-white px-4 text-sm text-ink shadow-[0_6px_16px_rgba(18,36,51,0.05)] hover:bg-[#f7faf8]'
            }
        >
            {children}
        </button>
    );
}

function ReadingCard({ indicator, index, locale }: { indicator: IndicatorReading; index: number; locale: Locale }) {
    const tone = cardTones[index % cardTones.length];
    const Icon = readingIcon(indicator.unit, indicator.sector?.slug ?? '');

    return (
        <li className="flex h-full min-h-40 flex-col items-center justify-center rounded-[1.35rem] bg-white px-3 py-5 text-center shadow-[0_10px_28px_rgba(18,36,51,0.05)]">
            <span className={cn('grid size-12 place-items-center rounded-2xl', tone.plate, tone.ink)}>
                <Icon className="size-5" aria-hidden="true" />
            </span>
            <p className={cn('mt-3 text-3xl font-semibold tracking-tight tabular-nums', tone.ink)}>
                {formatNumber(indicator.value, locale)}
                <span className="ms-1 text-sm font-medium">{indicator.unit}</span>
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[#5c6f68]">{indicator.name}</p>
        </li>
    );
}

function StageCard({
    featured,
    title,
    lede,
    href,
    action,
}: {
    featured: SectorHome | null;
    title: string;
    lede: string;
    href: string;
    action: string;
}) {
    return (
        <article className="relative flex h-full min-h-72 flex-col overflow-hidden rounded-[1.6rem] bg-deep text-white max-lg:order-first">
            <FieldPhoto
                slug={featured?.slug ?? 'renewable'}
                horizon={featured === null}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_68%]"
            />
            <span className="absolute inset-0 bg-gradient-to-b from-deep/72 via-deep/5 to-deep/55" aria-hidden="true" />
            <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                <span className="grid size-11 place-items-center rounded-full bg-white/15 text-measure">
                    {featured ? <SectorGlyph slug={featured.slug} className="size-5" /> : <Leaf className="size-5" aria-hidden="true" />}
                </span>
                <h3 className="mt-4 max-w-xs text-2xl font-medium leading-8">{title}</h3>
                {lede ? <p className="mt-2 max-w-xs text-sm leading-7 text-[#F4F7F5]">{lede}</p> : null}
                <Link
                    href={href}
                    className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white ps-1.5 pe-4 text-sm text-deep lg:mt-auto"
                >
                    <span className="grid size-8 place-items-center rounded-full bg-[#e7f1ee]">
                        <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                    </span>
                    {action}
                </Link>
            </div>
        </article>
    );
}

function readingIcon(unit: string, sector: string): LucideIcon {
    const normalized = unit.replace(/\s/g, '').replace('٪', '%').toLowerCase();

    if (normalized === '%') {
        return ChartColumn;
    }

    if (normalized.includes('tonne') || normalized.includes('طن')) {
        return Database;
    }

    if (normalized.includes('project') || normalized.includes('مشروع')) {
        return Layers;
    }

    if (normalized.includes('building') || normalized.includes('مبن')) {
        return Building2;
    }

    if (normalized.includes('wh') || normalized.includes('ساعة')) {
        return BatteryCharging;
    }

    if (normalized.includes('واط') || normalized === 'mw' || normalized === 'gw') {
        return sector === 'electricity' ? Zap : SunMedium;
    }

    return SunMedium;
}

export function HomeDepartments({ departments }: { departments: DepartmentSummary[] }) {
    const { t, locale } = useI18n();

    return (
        <section className="relative mx-4 my-6 overflow-hidden rounded-3xl sm:mx-6 lg:mx-auto lg:mb-16 lg:max-w-[90rem]" aria-labelledby="home-departments">
            <img src={horizon.src} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_42%]" />
            <div className="absolute inset-0 bg-[#f4f7f5]/80" />
            <div className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 max-w-xl">
                        <p className="flex items-center gap-2 text-sm font-medium text-[#6b5424]">
                            <span className="h-px w-8 bg-[#c6a15b]" aria-hidden="true" />
                            {t('departments')}
                        </p>
                        <h2 id="home-departments" className="mt-2 text-3xl font-medium text-deep sm:text-4xl">
                            {t('departmentsHeading')}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[#3E534C]">{t('departmentsHomeLede')}</p>
                    </div>
                    <Link
                        href={`/${locale}/departments`}
                        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white ps-3 pe-1.5 text-sm text-ink"
                    >
                        {t('allDepartments')}
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#e7f1ee] text-deep">
                            <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                        </span>
                    </Link>
                </div>

                {departments.length === 0 ? <p className="mt-8 text-sm text-[#3E534C]">{t('emptyDepartments')}</p> : null}
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {departments.map((department) => {
                        const plate = departmentPlates[department.slug] ?? { src: horizon.src, position: 'object-center' };
                        const Icon = departmentIcons[department.slug];

                        return (
                            <li key={department.slug}>
                                <Link
                                    href={`/${locale}/departments/${department.slug}`}
                                    className="flex h-full min-h-44 flex-col-reverse gap-3 rounded-2xl bg-white p-3 shadow-[0_16px_40px_-28px_rgba(12,46,42,0.7)] ring-1 ring-white sm:flex-row sm:items-stretch"
                                >
                                    <span className="flex min-w-0 flex-1 flex-col py-1 sm:py-2 sm:ps-1">
                                        <span className="flex items-center gap-2 text-lg font-medium text-deep">
                                            {department.name}
                                            {department.slug === 'hydrogen' ? (
                                                <span className="text-base leading-none text-sea" aria-hidden="true">
                                                    H₂
                                                </span>
                                            ) : Icon ? (
                                                <Icon className="size-5 shrink-0 text-sea" aria-hidden="true" />
                                            ) : null}
                                        </span>
                                        <span className="mt-2 line-clamp-3 text-sm leading-6 text-[#3E534C]">{department.summary}</span>
                                        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm text-sea">
                                            {t('readMore')}
                                            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#e7f1ee]">
                                                <ArrowLeft className="size-3.5 ltr:scale-x-[-1]" aria-hidden="true" />
                                            </span>
                                        </span>
                                    </span>
                                    <span className="relative block h-44 overflow-hidden rounded-xl sm:h-auto sm:w-40 sm:self-stretch">
                                        <img
                                            src={plate.src}
                                            alt=""
                                            className={`h-full w-full object-cover sm:absolute sm:inset-0 ${plate.position}`}
                                        />
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
