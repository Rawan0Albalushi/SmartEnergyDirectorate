import { Link, usePage } from '@inertiajs/react';
import { Mark } from '@/components/public/mark';
import { useI18n, type TranslationKey } from '@/lib/i18n';

const links: { key: TranslationKey; path: string }[] = [
    { key: 'home', path: '' },
    { key: 'sectors', path: '/sectors' },
    { key: 'projects', path: '/projects' },
    { key: 'achievements', path: '/achievements' },
    { key: 'news', path: '/news' },
    { key: 'departments', path: '/departments' },
];

export function SiteFooter() {
    const { t, locale } = useI18n();
    const { url } = usePage();
    const path = url.split('?')[0] ?? url;
    const year = new Date().getFullYear();

    return (
        <footer className="mt-10 bg-deep text-[#F4F7F5] lg:mt-14">
            <div className="h-[3px] bg-measure" />
            <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-12">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                    <Link
                        href={`/${locale}`}
                        className="inline-flex min-h-11 max-w-sm items-center gap-3 focus-visible:outline-[#F6E2B8]"
                    >
                        <Mark className="size-9 shrink-0 ring-1 ring-[#F6E2B8]/55" />
                        <span className="text-base leading-6 font-medium">
                            {t('siteName')}
                        </span>
                    </Link>
                    <nav
                        aria-label={t('footerNav')}
                        className="grid w-max max-w-full grid-cols-[max-content_max-content] gap-x-8 self-start sm:grid-cols-[max-content_max-content_max-content] lg:flex lg:w-auto lg:max-w-xl lg:flex-wrap lg:justify-end lg:gap-x-0 lg:self-auto"
                    >
                        {links.map((link) => {
                            const current = isCurrent(path, locale, link.path);

                            return (
                                <Link
                                    key={link.key}
                                    href={`/${locale}${link.path}`}
                                    aria-current={current ? 'page' : undefined}
                                    className="group inline-flex min-h-11 items-center text-sm focus-visible:outline-[#F6E2B8] lg:px-2.5"
                                >
                                    <span
                                        className={
                                            current
                                                ? 'border-b-2 border-measure text-[#F4F7F5]'
                                                : 'text-[#D5E6E1] group-hover:text-[#F4F7F5]'
                                        }
                                    >
                                        {t(link.key)}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-8 border-t border-white/15 pt-5 text-sm text-[#D5E6E1]">
                    <p className="flex min-h-11 items-center tabular-nums">
                        {year}
                    </p>
                </div>
            </div>
        </footer>
    );
}

function isCurrent(path: string, locale: string, suffix: string): boolean {
    const href = `/${locale}${suffix}`;

    if (suffix === '') {
        return path === href || path === `${href}/`;
    }

    return path === href || path.startsWith(`${href}/`);
}
