import { Head } from '@inertiajs/react';
import { LayoutGrid } from 'lucide-react';
import { SectorGlyph } from '@/components/public/entry';
import { FilterPill, PageBody, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { formatDate, formatNumber } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { IndicatorReading, PageMeta, SectorSummary } from '@/types/content';

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

    return (
        <>
            <Head title={t('indicators')} />
            <PageIntro title={t('indicators')} lede={t('indicatorsIntro')} />
            <PageBody>
                <nav className="flex flex-wrap gap-2" aria-label={t('filters')}>
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
                            <SectorGlyph slug={sector.slug} />
                            {sector.name}
                        </FilterPill>
                    ))}
                </nav>
                <Sheet className="mt-4">
                    {indicators.length === 0 ? (
                        <p className="px-4 py-6 text-sm text-[#3E534C] sm:px-5">{t('emptyIndicators')}</p>
                    ) : null}
                    <ul>
                        {indicators.map((indicator) => (
                            <li
                                key={indicator.id}
                                className="grid gap-3 border-b border-line px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(0,1.5fr)_9rem_8.5rem] sm:items-center sm:px-5"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-sea">
                                        <SectorGlyph slug={indicator.sector?.slug ?? ''} />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block text-sm font-medium leading-6 text-ink">{indicator.name}</span>
                                        {indicator.sector ? (
                                            <span className="block text-xs text-[#3E534C]">{indicator.sector.name}</span>
                                        ) : null}
                                    </span>
                                </span>
                                <span>
                                    <span className="block text-2xl font-medium tracking-tight text-deep tabular-nums">
                                        {formatNumber(indicator.value, locale)}
                                    </span>
                                    <span className="text-xs text-[#3E534C]">{indicator.unit}</span>
                                </span>
                                <span>
                                    <span className="block text-sm text-ink">{indicator.period}</span>
                                    <span className="text-xs text-[#3E534C]">{formatDate(indicator.recordedOn, locale)}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </Sheet>
                <Pager page={page} />
            </PageBody>
        </>
    );
}
