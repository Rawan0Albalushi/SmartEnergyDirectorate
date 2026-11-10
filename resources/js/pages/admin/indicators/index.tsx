import { Head, Link } from '@inertiajs/react';
import { Pager } from '@/components/public/pager';
import { formatNumber } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    id: number;
    name: string;
    value: number;
    unit: string;
    period: string;
    isPublished: boolean;
    sector: string;
    editUrl: string;
};

export default function IndicatorIndex({ indicators, page }: { indicators: Row[]; page: PageMeta }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('indicators')} />
            <Header title={t('indicators')} href={`/${locale}/admin/indicators/create`} label={t('create')} />
            <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[40rem] text-start text-sm">
                    <thead className="border-b border-line text-[#3E534C]">
                        <tr>
                            <th className="py-2 pe-3 font-medium">{t('sector')}</th>
                            <th className="py-2 pe-3 font-medium">{t('indicators')}</th>
                            <th className="py-2 pe-3 font-medium">{t('value')}</th>
                            <th className="py-2 pe-3 font-medium">{t('visibility')}</th>
                            <th className="py-2 font-medium">{t('edit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {indicators.map((row) => (
                            <tr key={row.id} className="border-b border-line">
                                <td className="py-3 pe-3">{row.sector}</td>
                                <td className="py-3 pe-3">{row.name}<span className="mt-1 block text-[#3E534C]">{row.period}</span></td>
                                <td className="py-3 pe-3 tabular-nums">{formatNumber(row.value, locale)} {row.unit}</td>
                                <td className="py-3 pe-3">{row.isPublished ? t('visible') : t('hidden')}</td>
                                <td className="py-3"><Link href={row.editUrl} className="underline">{t('edit')}</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pager page={page} />
        </>
    );
}

function Header({ title, href, label }: { title: string; href: string; label: string }) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-medium">{title}</h1>
            <Link href={href} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{label}</Link>
        </div>
    );
}
