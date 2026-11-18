import { Head, Link } from '@inertiajs/react';
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
import type { ReactNode } from 'react';
import { SectorGlyph } from '@/components/public/entry';
import { FieldPhoto } from '@/components/public/field-photo';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { formatNumber } from '@/lib/format';
import { useI18n, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import type { IndicatorReading, PageMeta, SectorSummary } from '@/types/content';

const cardTones = [
    { plate: 'bg-[#e7f3fb]', ink: 'text-[#2b6f9a]' },
    { plate: 'bg-[#e7f6ec]', ink: 'text-[#217a45]' },
    { plate: 'bg-[#fff1e8]', ink: 'text-[#d26522]' },
    { plate: 'bg-[#e7f7f5]', ink: 'text-[#1d8f86]' },
    { plate: 'bg-[#f3eefb]', ink: 'text-[#6d56c8]' },
];

export default function IndicatorsIndex({
    indicators,
    page,
    sectors,
    activeSector,
}: {
    indicators: IndicatorReading[];
    page: PageMeta;
    sectors: SectorSummary[];
    activeSector: string | null;
}) {
    const { t, locale } = useI18n();
    const featured = sectors.find((sector) => sector.slug === activeSector) ?? null;

    return (
        <>
            <Head title={t('indicators')} />
            <div className="relative">
                <PageIntro title={t('indicators')} lede={t('indicatorsIntro')} />
                <HeroWaves />
            </div>
            <PageBody>
                <div className="-mt-6">
                    <nav className="flex flex-wrap justify-center gap-2" aria-label={t('filters')}>
                        <FilterPill href={`/${locale}/indicators`} current={activeSector === null}>
                            <LayoutGrid className="size-3.5" aria-hidden="true" />
                            {t('all')}
                        </FilterPill>
                        {sectors.map((sector) => (
                            <FilterPill
                                key={sector.slug}
                                href={`/${locale}/indicators?sector=${sector.slug}`}
                                current={activeSector === sector.slug}
                            >
                                <SectorGlyph slug={sector.slug} className="size-3.5" />
                                {sector.name}
                            </FilterPill>
                        ))}
                    </nav>

                    {indicators.length === 0 ? (
                        <p className="py-10 text-center text-sm text-[#3E534C]">{t('emptyIndicators')}</p>
                    ) : (
                        <div className="mt-4 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                            <ul className="grid h-full grid-cols-2 gap-4 lg:grid-cols-4">
                                {indicators.map((indicator, index) => (
                                    <ReadingCard key={indicator.id} indicator={indicator} index={index} locale={locale} />
                                ))}
                            </ul>
                            <StageCard
                                featured={featured}
                                title={featured ? featured.name : t('indicatorsStageTitle')}
                                lede={featured ? featured.summary : t('indicatorsStageLede')}
                                href={featured ? `/${locale}/sectors#${featured.slug}` : `/${locale}/indicators`}
                                action={featured ? t('sectorDetails') : t('allIndicators')}
                            />
                        </div>
                    )}
                </div>
                <Pager page={page} />
            </PageBody>
        </>
    );
}

function FilterPill({ href, current, children }: { href: string; current: boolean; children: ReactNode }) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={
                current
                    ? 'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-deep px-4 text-sm text-white shadow-[0_8px_18px_rgba(12,46,42,0.18)]'
                    : 'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#e7eeea] bg-white px-4 text-sm text-ink shadow-[0_6px_16px_rgba(18,36,51,0.05)] hover:bg-[#f7faf8]'
            }
        >
            {children}
        </Link>
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
    featured: SectorSummary | null;
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
                <h2 className="mt-4 max-w-xs text-2xl font-medium leading-8">{title}</h2>
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

function HeroWaves() {
    return (
        <svg
            className="pointer-events-none absolute inset-0 h-full w-full rounded-b-[2.75rem] sm:rounded-b-[3.5rem]"
            viewBox="0 0 1440 420"
            preserveAspectRatio="xMinYMid slice"
            aria-hidden="true"
        >
            <path d="M-40 150 C 180 90, 360 210, 620 150 S 1040 60, 1480 150" fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="1.4" />
            <path d="M-40 190 C 220 120, 420 250, 700 180 S 1100 90, 1480 180" fill="none" stroke="white" strokeOpacity="0.11" strokeWidth="1.4" />
            <path d="M-40 230 C 260 160, 480 290, 760 210 S 1160 130, 1480 220" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="1.4" />
        </svg>
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
