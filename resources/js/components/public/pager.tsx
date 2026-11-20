import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

export function Pager({ page }: { page: PageMeta }) {
    const { t } = useI18n();

    if (page.last <= 1) {
        return null;
    }

    return (
        <nav
            className="mt-6 flex items-center justify-between gap-4"
            aria-label={t('pagination')}
        >
            <PageStep href={page.previous} direction="previous">
                {t('previous')}
            </PageStep>
            <span className="text-sm text-[#3E534C] tabular-nums">
                {page.current} / {page.last}
            </span>
            <PageStep href={page.next} direction="next">
                {t('next')}
            </PageStep>
        </nav>
    );
}

function PageStep({
    href,
    direction,
    children,
}: {
    href: string | null;
    direction: 'previous' | 'next';
    children: string;
}) {
    const className = href
        ? 'inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm text-ink hover:bg-[#f4f7f5]'
        : 'inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm text-[#3E534C] opacity-40';
    const icon = (
        <ArrowLeft
            className={
                direction === 'next'
                    ? 'size-4 ltr:scale-x-[-1]'
                    : 'size-4 rtl:scale-x-[-1]'
            }
            aria-hidden="true"
        />
    );

    if (!href) {
        return (
            <span
                className={`${className} pointer-events-none`}
                aria-disabled="true"
            >
                {direction === 'previous' ? icon : null}
                {children}
                {direction === 'next' ? icon : null}
            </span>
        );
    }

    return (
        <Link href={href} className={className}>
            {direction === 'previous' ? icon : null}
            {children}
            {direction === 'next' ? icon : null}
        </Link>
    );
}
