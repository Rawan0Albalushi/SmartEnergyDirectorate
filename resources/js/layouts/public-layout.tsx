import { LocaleDocument } from '@/components/locale-document';
import { SiteFooter } from '@/components/public/site-footer';
import { SiteHeader } from '@/components/public/site-header';
import { useI18n } from '@/lib/i18n';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    const { locale, t } = useI18n();

    return (
        <div className="min-h-dvh bg-paper text-ink">
            <LocaleDocument locale={locale} />
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-lg focus:bg-white focus:px-3 focus:py-2"
            >
                {t('skip')}
            </a>
            <SiteHeader />
            <main id="main">{children}</main>
            <SiteFooter />
        </div>
    );
}
