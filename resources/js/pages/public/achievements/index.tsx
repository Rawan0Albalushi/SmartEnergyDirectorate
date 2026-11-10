import { Head } from '@inertiajs/react';
import { Award, Building2, Calendar, Droplets, Sun, Zap, type LucideIcon } from 'lucide-react';
import { FieldPhoto } from '@/components/public/field-photo';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { horizon } from '@/lib/fields';
import { useI18n } from '@/lib/i18n';
import type { AchievementItem, PageMeta, SectorLink } from '@/types/content';

const sectorIcons: Record<string, LucideIcon> = {
    renewable: Sun,
    hydrogen: Droplets,
    electricity: Zap,
    efficiency: Building2,
};

export default function AchievementsIndex({
    achievements,
    page,
}: {
    achievements: AchievementItem[];
    page: PageMeta;
}) {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('achievements')} />
            <PageIntro title={t('achievements')} lede={t('achievementsIntro')} />
            <PageBody>
                {achievements.length === 0 ? <p className="text-sm text-[#3E534C]">{t('emptyAchievements')}</p> : null}
                <ul className="grid gap-3">
                    {achievements.map((item) => (
                        <li
                            key={item.id}
                            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-3 shadow-[0_16px_40px_-24px_rgba(12,46,42,0.45)] sm:flex-row sm:items-center sm:gap-4 sm:p-4"
                        >
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
                                <span className="mt-1 text-sm leading-6 text-[#3E534C]">{item.summary}</span>
                            </span>
                            {item.sector ? <SectorMark sector={item.sector} /> : null}
                        </li>
                    ))}
                </ul>
                <Pager page={page} />
            </PageBody>
        </>
    );
}

function SectorMark({ sector }: { sector: SectorLink }) {
    const Icon = sectorIcons[sector.slug] ?? Award;

    return (
        <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#e7f1ee] px-3 py-2 text-xs leading-5 text-deep sm:max-w-36 sm:flex-col sm:rounded-2xl sm:px-3 sm:py-3 sm:text-center">
            <Icon className="size-4" aria-hidden="true" />
            {sector.name}
        </span>
    );
}
