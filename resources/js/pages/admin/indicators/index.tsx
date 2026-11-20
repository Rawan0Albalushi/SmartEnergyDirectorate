import { Head, Link } from '@inertiajs/react';
import { PageIntro, PrimaryLink } from '@/components/admin/chrome';
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

export default function IndicatorIndex({
    indicators,
    page,
}: {
    indicators: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('indicators')} />
            <PageIntro
                title={t('indicators')}
                action={
                    <PrimaryLink href={`/${locale}/admin/indicators/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            {indicators.length === 0 ? (
                <p className="mt-6 rounded-[8px] border border-line bg-white px-5 py-10 text-sm text-[#3e534c]">
                    {t('emptyRecords')}
                </p>
            ) : (
                <div className="mt-6 overflow-x-auto rounded-[8px] border border-line bg-white">
                    <table className="w-full min-w-[40rem] text-start text-sm">
                        <thead className="border-b border-line bg-[#f6faf8] text-[#3e534c]">
                            <tr>
                                <th className="px-4 py-3 font-medium">
                                    {t('sector')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('indicators')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('value')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('visibility')}
                                </th>
                                <th className="px-4 py-3 font-medium">
                                    {t('edit')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {indicators.map((row) => (
                                <tr
                                    key={row.id}
                                    className="border-b border-line last:border-b-0 hover:bg-[#f6faf8]"
                                >
                                    <td className="px-4 py-3.5">
                                        {row.sector}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="block font-medium text-ink">
                                            {row.name}
                                        </span>
                                        <span className="mt-1 block text-[#3e534c]">
                                            {row.period}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 tabular-nums">
                                        {formatNumber(row.value, locale)}{' '}
                                        {row.unit}
                                    </td>
                                    <td
                                        className={
                                            row.isPublished
                                                ? 'px-4 py-3.5 text-sea'
                                                : 'px-4 py-3.5 text-[#3e534c]'
                                        }
                                    >
                                        {row.isPublished
                                            ? t('visible')
                                            : t('hidden')}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <Link
                                            href={row.editUrl}
                                            className="inline-flex min-h-11 items-center font-medium text-sea underline-offset-4 hover:underline"
                                        >
                                            {t('edit')}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <Pager page={page} />
        </>
    );
}
