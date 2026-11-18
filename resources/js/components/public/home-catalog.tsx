import { Link } from '@inertiajs/react';
import { ArrowLeft, BarChart3, Building2, ClipboardList, Leaf, Plus, Share2, Zap, type LucideIcon } from 'lucide-react';
import { Fragment, useState } from 'react';
import { FieldPhoto } from '@/components/public/field-photo';
import { departmentPlates } from '@/lib/department-plates';
import { horizon } from '@/lib/fields';
import { formatNumber } from '@/lib/format';
import { useI18n, type Locale } from '@/lib/i18n';
import type { DepartmentSummary, IndicatorReading, SectorHome } from '@/types/content';

const sectorIcons: Record<string, LucideIcon> = {
    renewable: Leaf,
    electricity: Zap,
    efficiency: BarChart3,
};

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
    const [active, setActive] = useState(sectors[0]?.slug ?? '');
    const sector = sectors.find((item) => item.slug === active) ?? sectors[0];
    const rows = sector ? indicators.filter((item) => item.sector?.slug === sector.slug) : [];
    const headline = sector?.headline ?? rows[0] ?? null;
    const updated = headline ? readingStamp(headline.recordedOn, locale) : null;

    return (
        <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-14" aria-labelledby="home-indicators">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-xl">
                    <p className="text-sm font-medium text-[#6b5424]">{t('indicatorsEyebrow')}</p>
                    <h2 id="home-indicators" className="mt-2 text-3xl font-medium text-deep sm:text-4xl">
                        {sector ? (locale === 'ar' ? `قطاع ${sector.name}` : `${sector.name} sector`) : t('indicators')}
                    </h2>
                    <p className="mt-2 text-sm leading-7 text-[#3E534C]">{sector ? sector.summary : t('indicatorsHomeLede')}</p>
                </div>
                <Link
                    href={`/${locale}/indicators`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white ps-3 pe-1.5 text-sm text-ink"
                >
                    {t('allIndicators')}
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#e7f1ee] text-deep">
                        <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                    </span>
                </Link>
            </div>

            {sectors.length > 0 ? (
                <div className="mt-8 flex flex-wrap items-center" role="tablist" aria-label={t('sectors')}>
                    {sectors.map((item, index) => {
                        const selected = item.slug === sector?.slug;
                        const previousSelected = index > 0 && sectors[index - 1]?.slug === sector?.slug;

                        return (
                            <Fragment key={item.slug}>
                                {index > 0 ? (
                                    <span
                                        className={selected || previousSelected ? 'mx-1 w-2' : 'mx-1 h-4 w-px bg-line'}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <button
                                    type="button"
                                    role="tab"
                                    id={`home-sector-tab-${item.slug}`}
                                    aria-selected={selected}
                                    aria-controls="home-indicators-panel"
                                    onClick={() => setActive(item.slug)}
                                    className={
                                        selected
                                            ? 'inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-4 text-sm text-white'
                                            : 'inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-[#244038] hover:bg-white'
                                    }
                                >
                                    <SectorGlyph slug={item.slug} />
                                    {item.name}
                                </button>
                            </Fragment>
                        );
                    })}
                </div>
            ) : null}

            <div
                id="home-indicators-panel"
                role="tabpanel"
                aria-labelledby={sector ? `home-sector-tab-${sector.slug}` : 'home-indicators'}
                className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.45fr)]"
            >
                <article className="relative min-h-[26rem] overflow-hidden rounded-[1.75rem] bg-deep">
                    {sector ? <FieldPhoto slug={sector.slug} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent rtl:bg-gradient-to-l" />
                    <div className="relative flex min-h-[26rem] flex-col justify-end p-5 sm:p-7">
                        {sector ? (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs text-deep ring-1 ring-black/5">
                                <SectorGlyph slug={sector.slug} />
                                {sector.name}
                            </span>
                        ) : null}
                        {headline ? (
                            <>
                                <p className="mt-5 text-6xl font-medium tracking-tight text-deep tabular-nums sm:text-7xl">
                                    {formatNumber(headline.value, locale)}
                                </p>
                                <p className="mt-1 text-base text-[#244038]">{headline.unit}</p>
                                <p className="mt-4 text-lg font-medium text-deep">{headline.name}</p>
                            </>
                        ) : (
                            <p className="mt-5 text-sm text-[#244038]">{t('noReading')}</p>
                        )}
                        {updated ? (
                            <p className="mt-3 text-xs text-[#3E534C]">
                                {t('updatedThrough')} {updated.label}
                            </p>
                        ) : null}
                        {sector ? (
                            <Link
                                href={`/${locale}/sectors#${sector.slug}`}
                                className="mt-5 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-deep ps-1.5 pe-4 text-sm text-white"
                            >
                                <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15">
                                    <Plus className="size-4" aria-hidden="true" />
                                </span>
                                {t('sectorDetails')}
                            </Link>
                        ) : null}
                    </div>
                </article>

                <div>
                    {rows.length === 0 ? <p className="text-sm text-[#3E534C]">{t('emptyIndicators')}</p> : null}
                    {rows.length > 0 ? (
                        <div className="hidden shrink-0 border-b border-line px-2 pb-3 text-xs text-[#5c6f68] sm:grid sm:grid-cols-[minmax(0,1.5fr)_8.5rem_6.5rem_1.5rem] sm:gap-4">
                            <span>{t('indicatorName')}</span>
                            <span>{t('currentValue')}</span>
                            <span>{t('lastUpdate')}</span>
                            <span className="sr-only">{t('readMore')}</span>
                        </div>
                    ) : null}
                    <ul>
                        {rows.map((indicator) => {
                            const stamp = readingStamp(indicator.recordedOn, locale);

                            return (
                                <li key={indicator.id} className="border-b border-line">
                                    <Link
                                        href={sector ? `/${locale}/indicators?sector=${sector.slug}` : `/${locale}/indicators`}
                                        className="grid w-full gap-2 py-4 hover:bg-white sm:grid-cols-[minmax(0,1.5fr)_8.5rem_6.5rem_1.5rem] sm:items-center sm:gap-4 sm:px-2"
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-sea">
                                                <SectorGlyph slug={indicator.sector?.slug ?? sector?.slug ?? ''} />
                                            </span>
                                            <span className="text-sm font-medium leading-6 text-ink">{indicator.name}</span>
                                        </span>
                                        <span>
                                            <span className="block text-2xl font-medium tracking-tight text-deep tabular-nums">
                                                {formatNumber(indicator.value, locale)}
                                            </span>
                                            <span className="text-xs text-[#3E534C]">{indicator.unit}</span>
                                        </span>
                                        <span>
                                            <span className="block text-sm text-ink">{stamp.year}</span>
                                            <span className="text-xs text-[#3E534C]">{stamp.month}</span>
                                        </span>
                                        <ArrowLeft className="size-4 text-sea ltr:scale-x-[-1]" aria-hidden="true" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </section>
    );
}

function SectorGlyph({ slug }: { slug: string }) {
    if (slug === 'hydrogen') {
        return (
            <span className="text-sm leading-none font-medium" aria-hidden="true">
                H₂
            </span>
        );
    }

    const Icon = sectorIcons[slug] ?? Leaf;

    return <Icon className="size-4" aria-hidden="true" />;
}

function readingStamp(value: string, locale: Locale): { year: string; month: string; label: string } {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    const date = match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return { year: value, month: '', label: value };
    }

    const tag = locale === 'ar' ? 'ar' : 'en';

    return {
        year: new Intl.DateTimeFormat(tag, { year: 'numeric' }).format(date),
        month: new Intl.DateTimeFormat(tag, { month: 'long' }).format(date),
        label: new Intl.DateTimeFormat(tag, { month: 'long', year: 'numeric' }).format(date),
    };
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
