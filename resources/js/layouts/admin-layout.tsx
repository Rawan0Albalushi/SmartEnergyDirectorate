import { Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    Building2,
    ClipboardList,
    FolderKanban,
    Gauge,
    Layers,
    Menu,
    Newspaper,
    Rss,
    Users,
    X,
    type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { LocaleDocument } from '@/components/locale-document';
import { Mark } from '@/components/public/mark';
import { useI18n, type TranslationKey } from '@/lib/i18n';

const links: { key: TranslationKey; path: string; icon: LucideIcon }[] = [
    { key: 'dashboard', path: '', icon: ClipboardList },
    { key: 'sectors', path: '/sectors', icon: Layers },
    { key: 'indicators', path: '/indicators', icon: Gauge },
    { key: 'projects', path: '/projects', icon: FolderKanban },
    { key: 'achievements', path: '/achievements', icon: Award },
    { key: 'news', path: '/news', icon: Newspaper },
    { key: 'sources', path: '/sources', icon: Rss },
    { key: 'departments', path: '/departments', icon: Building2 },
    { key: 'staff', path: '/staff', icon: Users },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { t, locale, alternates } = useI18n();
    const page = usePage();
    const path = page.url.split('?')[0] ?? page.url;
    const status = (page.props.flash as { status?: string } | undefined)
        ?.status;
    const base = `/${locale}/admin`;
    const [open, setOpen] = useState(false);
    const current = links.find((link) =>
        link.path === ''
            ? path === base
            : path === `${base}${link.path}` ||
              path.startsWith(`${base}${link.path}/`),
    );

    useEffect(() => {
        setOpen(false);
    }, [path]);

    return (
        <div className="min-h-dvh bg-paper text-ink lg:grid lg:h-dvh lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:overflow-hidden">
            <LocaleDocument locale={locale} />
            <header className="admin-night sticky top-0 z-30 flex items-center gap-3 bg-deep px-4 text-white lg:hidden">
                <Link
                    href={base}
                    className="inline-flex min-h-14 min-w-0 flex-1 items-center gap-3"
                >
                    <Mark className="size-8 shrink-0" />
                    <span className="truncate text-sm font-medium">
                        {current ? t(current.key) : t('adminHome')}
                    </span>
                </Link>
                <button
                    type="button"
                    className="inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-white"
                    aria-expanded={open}
                    aria-controls="admin-nav"
                    onClick={() => setOpen((value) => !value)}
                >
                    {open ? (
                        <X className="size-5" aria-hidden="true" />
                    ) : (
                        <Menu className="size-5" aria-hidden="true" />
                    )}
                    <span className="sr-only">
                        {open ? t('closeMenu') : t('menu')}
                    </span>
                </button>
            </header>
            <aside
                className={`admin-night ${open ? 'block' : 'hidden'} border-b border-[#164038] bg-deep text-white lg:block lg:overflow-y-auto lg:border-b-0`}
            >
                <div className="flex h-full flex-col">
                    <Link
                        href={base}
                        className="hidden items-center gap-3 px-4 py-5 lg:flex"
                    >
                        <Mark className="size-9 shrink-0" />
                        <span className="text-sm leading-5 font-medium text-white">
                            {t('siteName')}
                        </span>
                    </Link>
                    <nav
                        id="admin-nav"
                        className="flex flex-col gap-0.5 px-3 py-3 lg:flex-1 lg:py-2"
                        aria-label={t('adminNav')}
                    >
                        {links.map((link) => {
                            const href = `${base}${link.path}`;
                            const active =
                                link.path === ''
                                    ? path === base
                                    : path === href ||
                                      path.startsWith(`${href}/`);
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link.key}
                                    href={href}
                                    aria-current={active ? 'page' : undefined}
                                    className={
                                        active
                                            ? 'inline-flex min-h-11 items-center gap-3 rounded-[6px] bg-[#143f38] px-3 text-sm font-medium text-[#f6e2b8]'
                                            : 'inline-flex min-h-11 items-center gap-3 rounded-[6px] px-3 text-sm text-[#d7ebe4] transition-colors duration-150 hover:bg-white/10 hover:text-white'
                                    }
                                >
                                    <Icon
                                        className="size-[18px] shrink-0"
                                        strokeWidth={1.75}
                                        aria-hidden="true"
                                    />
                                    {t(link.key)}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="grid gap-1 border-t border-white/10 px-3 py-3">
                        <Utility href={`/${locale}`}>{t('viewSite')}</Utility>
                        <div
                            className="flex min-h-11 items-center gap-4 px-3 text-sm"
                            aria-label={t('languageSwitch')}
                        >
                            <Link
                                href={alternates.ar}
                                lang="ar"
                                aria-current={
                                    locale === 'ar' ? 'true' : undefined
                                }
                                className={
                                    locale === 'ar'
                                        ? 'font-medium text-[#f6e2b8]'
                                        : 'text-[#d7ebe4] hover:text-white'
                                }
                            >
                                العربية
                            </Link>
                            <Link
                                href={alternates.en}
                                lang="en"
                                aria-current={
                                    locale === 'en' ? 'true' : undefined
                                }
                                className={
                                    locale === 'en'
                                        ? 'font-medium text-[#f6e2b8]'
                                        : 'text-[#d7ebe4] hover:text-white'
                                }
                            >
                                English
                            </Link>
                        </div>
                        <Utility href="/settings/profile">
                            {t('settings')}
                        </Utility>
                        <button
                            type="button"
                            className="inline-flex min-h-11 cursor-pointer items-center rounded-[6px] px-3 text-start text-sm text-[#d7ebe4] transition-colors duration-150 hover:bg-white/10 hover:text-white"
                            onClick={() => router.post('/logout')}
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </aside>
            <div className="lg:overflow-y-auto">
                {status ? (
                    <p
                        role="status"
                        className="border-b border-[#b7d4cc] bg-[#e7f1ee] px-5 py-3 text-sm text-deep sm:px-8"
                    >
                        {status}
                    </p>
                ) : null}
                <main className="w-full px-4 py-7 sm:px-8 sm:py-9">
                    {children}
                </main>
            </div>
        </div>
    );
}

function Utility({ href, children }: { href: string; children: string }) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-11 items-center rounded-[6px] px-3 text-sm text-[#d7ebe4] transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
            {children}
        </Link>
    );
}
