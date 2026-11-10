import { Head } from '@inertiajs/react';
import { Globe, LayoutGrid, MapPin } from 'lucide-react';
import { EntryLink, ScopeBadge, Thumb } from '@/components/public/entry';
import { FilterPill, PageBody, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { formatDate } from '@/lib/format';
import { label, useI18n } from '@/lib/i18n';
import type { NewsSummary, PageMeta } from '@/types/content';

export default function NewsIndex({
    articles,
    page,
    activeScope,
}: {
    articles: NewsSummary[];
    page: PageMeta;
    activeScope: string | null;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('news')} />
            <PageIntro title={t('news')} lede={t('newsIntro')} />
            <PageBody>
                <nav className="flex flex-wrap gap-2" aria-label={t('filters')}>
                    <FilterPill href={`/${locale}/news`} current={activeScope === null}>
                        <LayoutGrid className="size-3.5" aria-hidden="true" />
                        {t('all')}
                    </FilterPill>
                    <FilterPill href={`/${locale}/news?scope=local`} current={activeScope === 'local'}>
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {t('local')}
                    </FilterPill>
                    <FilterPill href={`/${locale}/news?scope=international`} current={activeScope === 'international'}>
                        <Globe className="size-3.5" aria-hidden="true" />
                        {t('international')}
                    </FilterPill>
                </nav>
                <Sheet className="mt-4">
                    {articles.length === 0 ? <p className="px-4 py-6 text-sm text-[#3E534C] sm:px-5">{t('emptyNews')}</p> : null}
                    <ul>
                        {articles.map((article) => (
                            <li key={article.slug} className="border-b border-line last:border-b-0">
                                <EntryLink href={`/${locale}/news/${article.slug}`}>
                                    <Thumb slug={article.sector?.slug} />
                                    <span className="min-w-0 flex-1">
                                        <span className="flex flex-wrap items-center gap-2">
                                            <time className="text-xs text-[#3E534C]" dateTime={article.publishedAt ?? undefined}>
                                                {formatDate(article.publishedAt, locale)}
                                            </time>
                                            <ScopeBadge>{label(locale, article.scope)}</ScopeBadge>
                                        </span>
                                        <span className="mt-1 block text-base font-medium leading-6 text-ink">{article.title}</span>
                                        <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">{article.summary}</span>
                                    </span>
                                </EntryLink>
                            </li>
                        ))}
                    </ul>
                </Sheet>
                <Pager page={page} />
            </PageBody>
        </>
    );
}
