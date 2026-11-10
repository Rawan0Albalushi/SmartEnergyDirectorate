import { Link } from '@inertiajs/react';
import { useI18n } from '@/lib/i18n';

export function SiteFooter() {
    const { t } = useI18n();

    return (
        <footer className="mt-16 border-t border-line">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-[#3E534C] sm:flex-row sm:items-end sm:justify-between sm:px-6 lg:px-8">
                <div>
                    <p className="font-medium text-ink">{t('siteName')}</p>
                    <p className="mt-1 max-w-md leading-6">{t('aboutLead')}</p>
                </div>
                <Link href="/login" className="inline-flex min-h-11 items-center underline">
                    {t('staffLogin')}
                </Link>
            </div>
        </footer>
    );
}
