import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { FieldPhoto } from '@/components/public/field-photo';
import { HomeAchievements } from '@/components/public/home-achievements';
import { HomeDepartments, HomeIndicators } from '@/components/public/home-catalog';
import { HomeDigest } from '@/components/public/home-digest';
import { formatNumber } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { AchievementItem, DepartmentSummary, IndicatorReading, NewsSummary, ProjectSummary, SectorHome } from '@/types/content';

export default function Home({
    sectors,
    indicators,
    news,
    projects,
    achievements,
    departments,
}: {
    sectors: SectorHome[];
    indicators: IndicatorReading[];
    news: NewsSummary[];
    projects: ProjectSummary[];
    achievements: AchievementItem[];
    departments: DepartmentSummary[];
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('home')}>
                <meta name="description" content={t('heroLead')} />
            </Head>
            <section className="field-stage bg-deep text-[#F4F7F5]">
                <div className="field-photo">
                    <FieldPhoto horizon priority alt={t('fieldHorizon')} />
                    <span className="field-sun" aria-hidden="true" />
                    <div className="field-scrim">
                        <p className="w-full max-w-3xl text-balance text-center text-xl leading-relaxed sm:text-2xl">
                            {t('heroLead')}
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-[90rem] px-4 pt-8 pb-8 sm:px-6 lg:px-6">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 id="home-sectors" className="flex items-center gap-2 text-2xl font-medium text-[#F4F7F5]">
                                <span className="h-6 w-1 shrink-0 rounded-full bg-measure" aria-hidden="true" />
                                {t('sectors')}
                            </h2>
                            <p className="mt-2 max-w-xl text-sm leading-6 text-[#D5E6E1]">{t('sectorsIntro')}</p>
                        </div>
                        <Link
                            href={`/${locale}/sectors`}
                            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white/10 ps-4 pe-1.5 text-sm text-white ring-1 ring-white/30"
                        >
                            {t('allSectors')}
                            <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15">
                                <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                            </span>
                        </Link>
                    </div>
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {sectors.map((sector) => (
                            <li key={sector.slug} className="overflow-hidden rounded-2xl bg-[#0a2422] ring-1 ring-white/15">
                                <Link
                                    href={`/${locale}/sectors/${sector.slug}`}
                                    className="group flex h-full min-h-44 flex-col"
                                >
                                    <span className="field-thumb">
                                        <FieldPhoto
                                            slug={sector.slug}
                                            alt=""
                                            className="h-32 w-full object-cover sm:h-40"
                                        />
                                    </span>
                                    <span className="flex flex-1 flex-col p-4 sm:p-5">
                                        <span className="text-sm text-[#D5E6E1]">{sector.name}</span>
                                        <span className="mt-3 text-4xl font-medium tracking-tight text-measure tabular-nums">
                                            {sector.headline ? formatNumber(sector.headline.value, locale) : '—'}
                                        </span>
                                        <span className="mt-1 text-sm text-[#D5E6E1]">
                                            {sector.headline ? sector.headline.unit : t('noReading')}
                                        </span>
                                        <span className="mt-auto flex items-end gap-3 border-b border-white/25 pt-5 pb-2 text-xs text-[#D5E6E1]">
                                            <span className="h-3 w-px bg-measure" />
                                            {sector.headline
                                                ? `${t('latestReading')} · ${sector.headline.period}`
                                                : t('latestReading')}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <HomeIndicators sectors={sectors} indicators={indicators} />

            <HomeDigest news={news} projects={projects} />

            <HomeAchievements achievements={achievements} />

            <HomeDepartments departments={departments} />
        </>
    );
}
