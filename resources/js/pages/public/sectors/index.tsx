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
            {sectors.length === 0 ? (
                <PageBody>
                    <p className="text-sm text-[#3E534C]">{t('emptySectors')}</p>
                </PageBody>
            ) : (
                sectors.map((sector, index) => {
                    const flipped = index % 2 === 1;

                    return (
                        <section
                            key={sector.slug}
                            id={sector.slug}
                            aria-labelledby={`sector-${sector.slug}`}
                            className={`scroll-mt-28 ${index % 2 === 0 ? 'bg-[#f4f7f5]' : 'bg-white'}`}
                        >
                            <div
                                className={`mx-auto grid max-w-[90rem] items-center gap-10 px-4 py-16 sm:px-6 lg:gap-16 lg:px-6 lg:py-24 ${flipped ? 'lg:grid-cols-[6fr_5fr]' : 'lg:grid-cols-[5fr_6fr]'}`}
                            >
                                <div className={flipped ? 'lg:order-2' : undefined}>
                                    <FieldPhoto
                                        slug={sector.slug}
                                        alt=""
                                        className="aspect-video w-full rounded-2xl object-cover lg:aspect-[5/4]"
                                    />
                                </div>
                                <div className={flipped ? 'lg:order-1' : undefined}>
                                    <p className="text-[0.9375rem] font-semibold text-sea">
                                        {String(index + 1).padStart(2, '0')}
                                    </p>
                                    <h2 id={`sector-${sector.slug}`} className="mt-3 max-w-xl text-3xl font-medium text-balance text-deep sm:text-4xl">
                                        {sector.name}
                                    </h2>
                                    <p className="mt-6 max-w-prose text-base leading-7 text-[#3E534C]">
                                        {sector.body || sector.summary}
                                    </p>
                                    <Link
                                        href={`/${locale}/sectors/${sector.slug}`}
                                        className="mt-8 inline-flex min-h-11 items-center text-sm font-medium text-sea underline-offset-4 hover:underline"
                                    >
                                        {t('sectorDetails')}
                                    </Link>
                                </div>
                            </div>
                        </section>
                    );
                })
            )}
        </>
    );
}
