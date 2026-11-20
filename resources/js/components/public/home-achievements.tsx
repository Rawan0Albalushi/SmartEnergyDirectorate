import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Building2,
    Calendar,
    Droplets,
    Sun,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { FieldPhoto } from '@/components/public/field-photo';
import { SectionHeading } from '@/components/public/section-heading';
import { useI18n } from '@/lib/i18n';
import { useHeroSrc } from '@/lib/media';
import type { AchievementItem, SectorLink } from '@/types/content';

const sectorIcons: Record<string, LucideIcon> = {
    renewable: Sun,
    hydrogen: Droplets,
    electricity: Zap,
    efficiency: Building2,
};

export function HomeAchievements({
    achievements,
}: {
    achievements: AchievementItem[];
}) {
    const { t, locale } = useI18n();
    const hero = useHeroSrc();

    return (
        <section
            className="relative mx-4 my-10 overflow-hidden rounded-3xl sm:mx-6 lg:mx-auto lg:my-14 lg:max-w-[90rem]"
            aria-labelledby="home-achievements"
        >
            <img
                src={hero}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_36%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/45 to-white/20 rtl:bg-gradient-to-l" />
            <div className="relative grid items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1.5fr)] lg:gap-8 lg:px-8 lg:py-10">
                <div className="flex flex-col items-start">
                    <SectionHeading
                        id="home-achievements"
                        title={t('achievementsHeading')}
                        lede={t('achievementsHomeLede')}
                    />
                    <Link
                        href={`/${locale}/achievements`}
                        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-deep px-4 text-sm text-white"
                    >
                        {t('allAchievements')}
                        <ArrowLeft
                            className="size-4 ltr:scale-x-[-1]"
                            aria-hidden="true"
                        />
                    </Link>
                </div>

                <ul className="grid content-start gap-3">
                    {achievements.length === 0 ? (
                        <li className="rounded-2xl bg-white/90 px-4 py-4 text-sm text-[#3E534C]">
                            {t('emptyAchievements')}
                        </li>
                    ) : null}
                    {achievements.map((item) => (
                        <li
                            key={item.id}
                            className="flex flex-col gap-3 rounded-2xl border border-white/80 bg-white p-3 shadow-[0_16px_40px_-24px_rgba(12,46,42,0.65)] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                        >
                            <span className="block h-36 w-full shrink-0 overflow-hidden rounded-xl bg-[#e7eeea] sm:h-28 sm:w-40">
                                <FieldPhoto
                                    src={item.imageUrl}
                                    slug={item.sector?.slug}
                                    horizon={!item.imageUrl && !item.sector}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="inline-flex items-center gap-1.5 text-sm text-[#3E534C]">
                                    <Calendar
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    {item.year}
                                </span>
                                <span className="mt-1 block text-lg leading-7 font-medium text-ink">
                                    {item.title}
                                </span>
                                <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">
                                    {item.summary}
                                </span>
                                <Link
                                    href={`/${locale}/achievements`}
                                    aria-label={`${t('readMore')}: ${item.title}`}
                                    className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm text-sea"
                                >
                                    {t('readMore')}
                                    <ArrowLeft
                                        className="size-4 ltr:scale-x-[-1]"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </span>
                            {item.sector ? (
                                <SectorMark sector={item.sector} />
                            ) : null}
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
