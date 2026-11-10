import { Link } from '@inertiajs/react';
import { ArrowLeft, Award, Building2, Calendar, Droplets, Sun, Zap, type LucideIcon } from 'lucide-react';
import { FieldPhoto } from '@/components/public/field-photo';
import { horizon } from '@/lib/fields';
import { useI18n } from '@/lib/i18n';
import type { AchievementItem, SectorLink } from '@/types/content';

const sectorIcons: Record<string, LucideIcon> = {
    renewable: Sun,
    hydrogen: Droplets,
    electricity: Zap,
    efficiency: Building2,
};

export function HomeAchievements({ achievements }: { achievements: AchievementItem[] }) {
    const { t, locale } = useI18n();

    return (
        <section className="relative mx-4 my-10 overflow-hidden rounded-3xl sm:mx-6 lg:mx-auto lg:my-14 lg:max-w-[90rem]" aria-labelledby="home-achievements">
            <img src={horizon.src} alt="" className="absolute inset-0 h-full w-full object-cover object-[center_36%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-white/20 rtl:bg-gradient-to-l" />
            <div className="relative grid items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.5fr)] lg:gap-8 lg:px-8 lg:py-10">
                <div className="flex flex-col items-start">
                    <p className="flex items-center gap-2 text-sm text-[#3E534C]">
                        <span className="h-px w-8 bg-[#c6a15b]" aria-hidden="true" />
                        {t('achievementsEyebrow')}
                    </p>
                    <h2 id="home-achievements" className="mt-3 text-3xl font-medium text-deep sm:text-4xl">
                        {t('achievementsHeading')}
                    </h2>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-[#244038]">{t('achievementsHomeLede')}</p>
                    <Link
                        href={`/${locale}/achievements`}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-4 text-sm text-white"
                    >
                        {t('allAchievements')}
                        <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                    </Link>
                </div>

            <ul className="grid content-start gap-3">
                {achievements.length === 0 ? <li className="rounded-2xl bg-white/90 px-4 py-4 text-sm text-[#3E534C]">{t('emptyAchievements')}</li> : null}
                {achievements.map((item) => (
                    <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white p-3 shadow-[0_16px_40px_-24px_rgba(12,46,42,0.65)] sm:flex-row sm:items-center sm:gap-4 sm:p-4">
                        <span className="block h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#e7eeea] sm:h-28 sm:w-40">
                            {item.sector ? (
                                <FieldPhoto slug={item.sector.slug} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <img src={horizon.src} alt="" className="h-full w-full object-cover" />
                            )}
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="inline-flex items-center gap-1.5 text-sm text-[#3E534C]">
                                <Calendar className="size-4" aria-hidden="true" />
                                {item.year}
                            </span>
                            <span className="mt-1 block text-lg font-medium leading-7 text-ink">{item.title}</span>
                            <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">{item.summary}</span>
                            <Link
                                href={`/${locale}/achievements`}
                                aria-label={`${t('readMore')}: ${item.title}`}
                                className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-sea"
                            >
                                {t('readMore')}
                                <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                            </Link>
                        </span>
                        {item.sector ? <SectorMark sector={item.sector} /> : null}
                    </li>
                ))}
            </ul>
            </div>
        </section>
    );
}

function SectorMark({ sector }: { sector: SectorLink }) {
    const Icon = sectorIcons[sector.slug] ?? Award;

    return (
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#e7f1ee] px-3 py-2 text-xs leading-5 text-deep sm:max-w-32 sm:flex-col sm:rounded-2xl sm:px-3 sm:py-3 sm:text-center">
            <Icon className="size-4" aria-hidden="true" />
            {sector.name}
        </span>
    );
}
