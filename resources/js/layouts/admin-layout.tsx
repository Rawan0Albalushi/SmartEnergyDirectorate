import { Link, router, usePage } from '@inertiajs/react';
import { LocaleDocument } from '@/components/locale-document';
import { useI18n, type TranslationKey } from '@/lib/i18n';

const links: { key: TranslationKey; path: string }[] = [
    { key: 'dashboard', path: '' },
    { key: 'sectors', path: '/sectors' },
    { key: 'indicators', path: '/indicators' },
    { key: 'projects', path: '/projects' },
    { key: 'achievements', path: '/achievements' },
    { key: 'news', path: '/news' },
    { key: 'sources', path: '/sources' },
    { key: 'departments', path: '/departments' },
    { key: 'staff', path: '/staff' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { t, locale, alternates } = useI18n();
    const page = usePage();
    const path = (page.url.split('?')[0] ?? page.url);
    const status = (page.props.flash as { status?: string } | undefined)?.status;
    const base = `/${locale}/admin`;

    return (
        <div className="min-h-dvh bg-paper text-ink lg:grid lg:grid-cols-[16rem_1fr]">
            <LocaleDocument locale={locale} />
            <aside className="border-b border-line lg:border-e lg:border-b-0">
                <div className="px-4 py-4">
                    <Link href={base} className="text-sm font-medium">
                        {t('adminHome')}
                    </Link>
                </div>
                <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-6" aria-label={t('adminNav')}>
                    {links.map((link) => {
                        const href = `${base}${link.path}`;
                        const current = link.path === '' ? path === base : path === href || path.startsWith(`${href}/`);

                        return (
                            <Link
                                key={link.key}
                                href={href}
                                aria-current={current ? 'page' : undefined}
                                className={
                                    current
                                        ? 'inline-flex min-h-11 shrink-0 items-center bg-deep px-3 text-sm text-measure'
                                        : 'inline-flex min-h-11 shrink-0 items-center px-3 text-sm'
                                }
                            >
                                {t(link.key)}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <div>
                <header className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 sm:px-6">
                    <Link href={`/${locale}`} className="inline-flex min-h-11 items-center text-sm underline">
                        {t('viewSite')}
                    </Link>
                    <Link href={alternates.ar} className="inline-flex min-h-11 items-center text-sm" lang="ar">
                        العربية
                    </Link>
                    <Link href={alternates.en} className="inline-flex min-h-11 items-center text-sm" lang="en">
                        English
                    </Link>
                    <Link href="/settings/profile" className="inline-flex min-h-11 items-center text-sm underline">
                        {t('settings')}
                    </Link>
                    <button
                        type="button"
                        className="inline-flex min-h-11 items-center text-sm underline"
                        onClick={() => router.post('/logout')}
                    >
                        {t('logout')}
                    </button>
                </header>
                {status ? (
                    <p role="status" className="border-b border-line bg-[#E7F1EE] px-4 py-3 text-sm sm:px-6">
                        {status}
                    </p>
                ) : null}
                <div className="px-4 py-6 sm:px-6">{children}</div>
            </div>
        </div>
    );
}
