import { Link, usePage } from '@inertiajs/react';
import { LocaleDocument } from '@/components/locale-document';
import { Mark } from '@/components/public/mark';
import { useI18n } from '@/lib/i18n';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const page = usePage();
    const { t, locale } = useI18n();
    const heading = page.component === 'auth/login' ? t('loginTitle') : title;
    const lede =
        page.component === 'auth/login' ? t('loginDescription') : description;

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-paper p-6 text-ink md:p-10">
            <LocaleDocument locale={locale} />
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={`/${locale}`}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <Mark className="size-10" />
                            <span className="sr-only">{t('siteName')}</span>
                        </Link>
                        <div className="flex gap-3 text-sm">
                            <Link
                                href="/locale/ar"
                                lang="ar"
                                className="inline-flex min-h-11 items-center"
                            >
                                العربية
                            </Link>
                            <Link
                                href="/locale/en"
                                lang="en"
                                className="inline-flex min-h-11 items-center"
                            >
                                English
                            </Link>
                        </div>
                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{heading}</h1>
                            <p className="text-center text-sm text-[#3E534C]">
                                {lede}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
