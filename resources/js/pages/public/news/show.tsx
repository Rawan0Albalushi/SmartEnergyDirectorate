import { Head } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { ForwardLink, PageBody } from '@/components/public/frame';
import { BandChip, PageIntro } from '@/components/public/page-intro';
import { formatDate } from '@/lib/format';
import { label, useI18n } from '@/lib/i18n';
import type { NewsDetail } from '@/types/content';

export default function NewsShow({ article }: { article: NewsDetail }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={article.title} />
            <PageIntro title={article.title} lede={article.summary}>
                <BandChip>
                    <time dateTime={article.publishedAt ?? undefined}>
                        {formatDate(article.publishedAt, locale)}
                    </time>
                </BandChip>
                <BandChip>{label(locale, article.scope)}</BandChip>
            </PageIntro>
            <PageBody>
                {article.body ? (
                    <p className="max-w-3xl text-base leading-8">
                        {article.body}
                    </p>
                ) : null}
                {article.sector ? (
                    <p className={article.body ? 'mt-8' : ''}>
                        <ForwardLink
                            href={`/${locale}/sectors#${article.sector.slug}`}
                        >
                            {article.sector.name}
                        </ForwardLink>
                    </p>
                ) : null}
                {article.sourceName || article.originalUrl ? (
                    <div
                        className={`${article.body || article.sector ? 'mt-10' : ''} flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6`}
                    >
                        {article.sourceName ? (
                            <p className="text-sm text-[#3E534C]">
                                <span className="text-ink">{t('source')}</span>
                                <span className="ms-2">
                                    {article.sourceName}
                                </span>
                            </p>
                        ) : null}
                        {article.originalUrl ? (
                            <a
                                href={article.originalUrl}
                                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm text-ink hover:bg-[#f4f7f5]"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {t('originalSource')}
                                <ExternalLink
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                            </a>
                        ) : null}
                    </div>
                ) : null}
            </PageBody>
        </>
    );
}
