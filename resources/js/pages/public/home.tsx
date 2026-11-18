import { Head } from '@inertiajs/react';
import { FieldPhoto } from '@/components/public/field-photo';
import { HomeAchievements } from '@/components/public/home-achievements';
import { HomeDepartments, HomeIndicators } from '@/components/public/home-catalog';
import { HomeDigest } from '@/components/public/home-digest';
import { PortraitCard } from '@/components/public/portrait-card';
import { fieldPlate, horizon } from '@/lib/fields';
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
            <section className="bg-deep text-[#F4F7F5]" aria-labelledby="home-sectors">
                <div className="field-photo">
                    <FieldPhoto horizon priority alt={t('fieldHorizon')} />
                    <span className="field-sun" aria-hidden="true" />
                    <div className="field-scrim">
                        <p className="w-full max-w-3xl text-balance text-center text-xl leading-relaxed sm:text-2xl">
                            {t('heroLead')}
                        </p>
                    </div>
                </div>
                <div className="mx-auto max-w-[90rem] px-4 pt-8 pb-12 sm:px-6 sm:pb-16 lg:px-6 lg:pb-20">
                    <h2 id="home-sectors" className="max-w-3xl text-2xl font-medium sm:text-3xl">
                        {t('sectors')}
                    </h2>
                    <ol className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 sm:pt-4 lg:grid-cols-4">
                        {sectors.map((sector, index) => (
                            <li key={sector.slug} className={index % 2 === 0 ? 'min-w-0 sm:-translate-y-4' : 'min-w-0 sm:translate-y-4'}>
                                <PortraitCard
                                    href={`/${locale}/sectors#${sector.slug}`}
                                    src={fieldPlate(sector.slug)?.src ?? horizon.src}
                                    index={index}
                                    title={sector.name}
                                    text={sector.summary}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <HomeIndicators sectors={sectors} indicators={indicators} />

            <HomeDigest news={news} projects={projects} />

            <HomeAchievements achievements={achievements} />

            <HomeDepartments departments={departments} />
        </>
    );
}
