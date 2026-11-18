import { Head, Link } from '@inertiajs/react';
import { Globe, LayoutGrid, MapPin } from 'lucide-react';
import { ScopeBadge } from '@/components/public/entry';
import { FilterPill, PageBody, SectionTitle } from '@/components/public/frame';
import { NewsCover, NewsPhoto } from '@/components/public/news-cover';
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
    const featured = page.current === 1 ? articles.slice(0, 3) : [];
    const [lead, ...sides] = featured;

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

                {articles.length === 0 ? <p className="mt-8 text-sm text-[#3E534C]">{t('emptyNews')}</p> : null}

                {lead ? (
                    <div className={`mt-8 grid gap-4 ${sides.length > 0 ? 'lg:grid-cols-3' : ''}`}>
                        <NewsCover
                            article={lead}
                            titleClassName="text-2xl sm:text-[1.7rem]"
                            className={sides.length > 0 ? 'min-h-[22rem] lg:col-span-2 lg:min-h-[32rem]' : 'min-h-[22rem] lg:min-h-[28rem]'}
                        />
                        {sides.length > 0 ? (
                            <div
                                className={`grid h-full gap-4 ${sides.length > 1 ? 'sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2' : ''}`}
                            >
                                {sides.map((article) => (
                                    <NewsCover key={article.slug} article={article} className="h-full min-h-56" />
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                {articles.length > 0 ? (
                    <section className="mt-14" aria-labelledby="latest-news">
                        <SectionTitle id="latest-news">{t('latestNews')}</SectionTitle>
                        <ul className="mt-6 grid gap-8">
                            {articles.map((article) => (
                                <li key={article.slug}>
                                    <Link
                                        href={`/${locale}/news/${article.slug}`}
                                        className="group grid gap-4 sm:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)] sm:items-center sm:gap-6"
                                    >
                                        <span className="relative block h-52 overflow-hidden rounded-2xl bg-[#e7eeea] sm:h-44">
                                            <NewsPhoto article={article} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="flex flex-wrap items-center gap-2">
                                                <time className="text-sm text-[#3E534C]" dateTime={article.publishedAt ?? undefined}>
                                                    {formatDate(article.publishedAt, locale)}
                                                </time>
                                                <ScopeBadge>{label(locale, article.scope)}</ScopeBadge>
                                            </span>
                                            <span className="mt-2 block text-xl font-medium leading-8 text-ink group-hover:text-sea">
                                                {article.title}
                                            </span>
                                            <span className="mt-2 line-clamp-2 text-sm leading-7 text-[#3E534C]">{article.summary}</span>
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                <Pager page={page} />
            </PageBody>
        </>
    );
}
