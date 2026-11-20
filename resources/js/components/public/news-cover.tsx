import { Link } from '@inertiajs/react';
import { fieldPlate } from '@/lib/fields';
import { useHeroSrc } from '@/lib/media';
import { formatDate } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { NewsSummary } from '@/types/content';

export function NewsCover({
    article,
    className = '',
    titleClassName = 'text-xl sm:text-2xl',
    tabIndex,
}: {
    article: NewsSummary;
    className?: string;
    titleClassName?: string;
    tabIndex?: number;
}) {
    const { locale } = useI18n();

    return (
        <Link
            href={`/${locale}/news/${article.slug}`}
            tabIndex={tabIndex}
            className={`group relative block overflow-hidden rounded-2xl bg-deep ${className}`}
        >
            <NewsPhoto article={article} />
            <span
                className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#061612] via-[#061612]/70 to-transparent transition-[height] duration-300 group-hover:h-[58%]"
                aria-hidden="true"
            />
            <span className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-4 text-white sm:p-5">
                <time
                    className="text-sm"
                    dateTime={article.publishedAt ?? undefined}
                >
                    {formatDate(article.publishedAt, locale)}
                </time>
                <span
                    className={`line-clamp-2 leading-snug font-medium ${titleClassName}`}
                >
                    {article.title}
                </span>
            </span>
        </Link>
    );
}

export function NewsPhoto({ article }: { article: NewsSummary }) {
    const hero = useHeroSrc();
    const plate = fieldPlate(article.sector?.slug);

    return (
        <img
            src={article.imageUrl || plate?.src || hero}
            alt=""
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
        />
    );
}
