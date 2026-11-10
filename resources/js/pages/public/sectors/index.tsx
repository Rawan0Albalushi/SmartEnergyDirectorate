import { Head, Link } from '@inertiajs/react';
import { FieldPhoto } from '@/components/public/field-photo';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { useI18n } from '@/lib/i18n';
import type { SectorDetail } from '@/types/content';

export default function SectorsIndex({ sectors }: { sectors: SectorDetail[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('sectors')} />
            <PageIntro title={t('sectors')} lede={t('sectorsIntro')} />
            <PageBody>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {sectors.map((sector) => (
                        <li key={sector.slug} className="h-full">
                            <Link
                                href={`/${locale}/sectors/${sector.slug}`}
                                className="group flex h-full min-h-72 flex-col overflow-hidden rounded-2xl bg-[#0a2422] text-[#F4F7F5] shadow-[0_16px_40px_-28px_rgba(12,46,42,0.7)] ring-1 ring-black/10 focus-visible:outline-white"
                            >
                                <span className="field-thumb">
                                    <FieldPhoto slug={sector.slug} alt="" className="h-36 w-full object-cover sm:h-40" />
                                </span>
                                <span className="flex flex-1 flex-col p-4 sm:p-5">
                                    <span className="text-lg font-medium">{sector.name}</span>
                                    <span className="mt-2 line-clamp-4 text-sm leading-6 text-[#D5E6E1]">
                                        {sector.body || sector.summary}
                                    </span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </PageBody>
        </>
    );
}
