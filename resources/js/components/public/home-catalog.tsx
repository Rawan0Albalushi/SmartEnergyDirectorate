import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BatteryCharging,
    Building2,
    ChartColumn,
    Database,
    Layers,
    LayoutGrid,
    Leaf,
    SunMedium,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { SectorGlyph } from '@/components/public/entry';
import { FieldPhoto } from '@/components/public/field-photo';
import { SectionHeading } from '@/components/public/section-heading';
import { formatNumber } from '@/lib/format';
import { useI18n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { IndicatorReading, SectorHome } from '@/types/content';

const cardTones = [
    { plate: 'bg-[#e7f3fb]', ink: 'text-[#2b6f9a]' },
    { plate: 'bg-[#e7f6ec]', ink: 'text-[#217a45]' },
    { plate: 'bg-[#fff1e8]', ink: 'text-[#d26522]' },
    { plate: 'bg-[#e7f7f5]', ink: 'text-[#1d8f86]' },
    { plate: 'bg-[#f3eefb]', ink: 'text-[#6d56c8]' },
];

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
    const rows = featured
        ? indicators.filter((item) => item.sector?.slug === featured.slug)
        : indicators;

    return (
        <section
            className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-14"
            aria-labelledby="home-indicators"
        >
            <SectionHeading
                id="home-indicators"
                title={t('indicatorsEyebrow')}
                lede={t('indicatorsHomeLede')}
            />

            {sectors.length > 0 ? (
                <div
                    className="mt-8 flex flex-wrap gap-2"
                    role="tablist"
                    aria-label={t('sectors')}
                >
                    <FilterPill
                        current={active === null}
                        onSelect={() => setActive(null)}
                        id="home-sector-tab-all"
                    >
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
                            <SectorGlyph
                                slug={sector.slug}
                                className="size-3.5"
                            />
                            {sector.name}
                        </FilterPill>
                    ))}
                </div>
            ) : null}

            <div
                id="home-indicators-panel"
                role="tabpanel"
                aria-labelledby={
                    featured
                        ? `home-sector-tab-${featured.slug}`
                        : 'home-sector-tab-all'
                }
                className="mt-6"
            >
                {rows.length === 0 ? (
                    <p className="text-sm text-[#3E534C]">
                        {t('emptyIndicators')}
                    </p>
                ) : (
                    <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                        <ul className="grid h-full grid-cols-2 gap-4 lg:grid-cols-4">
                            {rows.map((indicator, index) => (
                                <ReadingCard
                                    key={indicator.id}
                                    indicator={indicator}
                                    index={index}
                                    locale={locale}
                                />
                            ))}
                        </ul>
                        <StageCard
                            featured={featured}
                            title={
                                featured
                                    ? featured.name
                                    : t('indicatorsStageTitle')
                            }
                            lede={
                                featured
                                    ? featured.summary
                                    : t('indicatorsStageLede')
                            }
                            href={
                                featured
                                    ? `/${locale}/sectors#${featured.slug}`
                                    : `/${locale}/sectors`
                            }
                            action={
                                featured ? t('sectorDetails') : t('allSectors')
                            }
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

function ReadingCard({
    indicator,
    index,
    locale,
}: {
    indicator: IndicatorReading;
    index: number;
    locale: Locale;
}) {
    const tone = cardTones[index % cardTones.length];
    const Icon = readingIcon(indicator.unit, indicator.sector?.slug ?? '');

    return (
        <li className="flex h-full min-h-40 flex-col items-center justify-center rounded-[1.35rem] bg-white px-3 py-5 text-center shadow-[0_10px_28px_rgba(18,36,51,0.05)]">
            <span
                className={cn(
                    'grid size-12 place-items-center rounded-2xl',
                    tone.plate,
                    tone.ink,
                )}
            >
                <Icon className="size-5" aria-hidden="true" />
            </span>
            <p
                className={cn(
                    'mt-3 text-3xl font-semibold tracking-tight tabular-nums',
                    tone.ink,
                )}
            >
                {formatNumber(indicator.value, locale)}
                <span className="ms-1 text-sm font-medium">
                    {indicator.unit}
                </span>
            </p>
            <p className="mt-1.5 text-sm leading-6 text-[#5c6f68]">
                {indicator.name}
            </p>
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
            <span
                className="absolute inset-0 bg-gradient-to-b from-deep/72 via-deep/5 to-deep/55"
                aria-hidden="true"
            />
            <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                <span className="grid size-11 place-items-center rounded-full bg-white/15 text-measure">
                    {featured ? (
                        <SectorGlyph slug={featured.slug} className="size-5" />
                    ) : (
                        <Leaf className="size-5" aria-hidden="true" />
                    )}
                </span>
                <h3 className="mt-4 max-w-xs text-2xl leading-8 font-medium">
                    {title}
                </h3>
                {lede ? (
                    <p className="mt-2 max-w-xs text-sm leading-7 text-[#F4F7F5]">
                        {lede}
                    </p>
                ) : null}
                <Link
                    href={href}
                    className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white ps-1.5 pe-4 text-sm text-deep lg:mt-auto"
                >
                    <span className="grid size-8 place-items-center rounded-full bg-[#e7f1ee]">
                        <ArrowLeft
                            className="size-4 ltr:scale-x-[-1]"
                            aria-hidden="true"
                        />
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

    if (
        normalized.includes('واط') ||
        normalized === 'mw' ||
        normalized === 'gw'
    ) {
        return sector === 'electricity' ? Zap : SunMedium;
    }

    return SunMedium;
}
