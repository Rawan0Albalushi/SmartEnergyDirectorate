import { Link, usePage } from '@inertiajs/react';
import { Languages } from 'lucide-react';
import { useEffect, useState } from 'react';
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

export function SiteHeader() {
    const { t, locale, alternates } = useI18n();
    const { url } = usePage();
    const path = url.split('?')[0] ?? url;
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [url]);

    useEffect(() => {
        if (!open) {
            return;
        }

        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        }

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    return (
        <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 lg:px-6">
            <div className="mx-auto max-w-6xl rounded-[1.25rem] border border-white/70 bg-paper/95 shadow-[0_12px_32px_-20px_rgba(12,46,42,0.65)] backdrop-blur-md supports-[backdrop-filter]:bg-paper/80">
                <div className="flex items-center gap-2 px-3 py-2 sm:px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
                    <Link
                        href={`/${locale}`}
                        className="flex min-h-11 min-w-0 items-center gap-3 overflow-hidden"
                    >
                        <Mark className="size-9 shrink-0" />
                        <span className="min-w-0 text-sm leading-5 font-medium text-ink sm:truncate sm:text-base">
                            {t('siteName')}
                        </span>
                    </Link>
                    <nav
                        className="hidden items-center justify-center gap-0.5 lg:flex"
                        aria-label={t('mainNav')}
                    >
                        {links.map((link) => (
                            <NavLink
                                key={link.key}
                                href={`/${locale}${link.path}`}
                                current={isCurrent(path, locale, link.path)}
                            >
                                {t(link.key)}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="ms-auto flex shrink-0 items-center lg:ms-0 lg:justify-self-end">
                        <LanguageSwitch
                            alternates={alternates}
                            locale={locale}
                            label={t('languageSwitch')}
                        />
                        <button
                            type="button"
                            className="inline-flex size-11 items-center justify-center rounded-lg text-ink lg:hidden"
                            aria-expanded={open}
                            aria-controls="site-menu"
                            onClick={() => setOpen((value) => !value)}
                        >
                            <span className="sr-only">
                                {open ? t('closeMenu') : t('menu')}
                            </span>
                            <span
                                aria-hidden="true"
                                className="flex w-4 flex-col gap-1"
                            >
                                <span className="h-px bg-ink" />
                                <span className="h-px bg-ink" />
                                <span className="h-px bg-ink" />
                            </span>
                        </button>
                    </div>
                </div>
                {open ? (
                    <nav
                        id="site-menu"
                        className="border-t border-line/80 px-3 py-1 sm:px-4 lg:hidden"
                        aria-label={t('mainNav')}
                    >
                        {links.map((link) => (
                            <Link
                                key={link.key}
                                href={`/${locale}${link.path}`}
                                aria-current={
                                    isCurrent(path, locale, link.path)
                                        ? 'page'
                                        : undefined
                                }
                                className="flex min-h-11 items-center border-b border-line/80 text-base last:border-b-0"
                            >
                                {t(link.key)}
                            </Link>
                        ))}
                    </nav>
                ) : null}
            </div>
        </header>
    );
}

function NavLink({
    href,
    current,
    children,
}: {
    href: string;
    current: boolean;
    children: string;
}) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={
                current
                    ? 'inline-flex min-h-11 items-center border-b-2 border-filament px-2 text-sm text-ink'
                    : 'inline-flex min-h-11 items-center border-b-2 border-transparent px-2 text-sm text-[#3E534C]'
            }
        >
            {children}
        </Link>
    );
}

function LanguageSwitch({
    alternates,
    locale,
    label,
}: {
    alternates: { ar: string; en: string };
    locale: 'ar' | 'en';
    label: string;
}) {
    const next = locale === 'ar' ? 'en' : 'ar';
    const name = next === 'ar' ? 'العربية' : 'English';

    return (
        <Link
            href={alternates[next]}
            hrefLang={next}
            lang={next}
            aria-label={`${label}: ${name}`}
            title={name}
            className="inline-flex size-11 items-center justify-center rounded-lg text-ink hover:bg-white/70"
        >
            <Languages className="size-5" aria-hidden="true" />
        </Link>
    );
}

function isCurrent(path: string, locale: string, suffix: string): boolean {
    const href = `/${locale}${suffix}`;

    if (suffix === '') {
        return path === href || path === `${href}/`;
    }

    return path === href || path.startsWith(`${href}/`);
}
