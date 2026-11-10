import { Head, Link } from '@inertiajs/react';
import { useI18n } from '@/lib/i18n';

type Row = { slug: string; name: string; summary: string; editUrl: string };

export default function SectorIndex({ sectors }: { sectors: Row[] }) {
    const { t } = useI18n();

    return (
        <>
            <Head title={t('sectors')} />
            <h1 className="text-2xl font-medium">{t('sectors')}</h1>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {sectors.map((sector) => (
                    <li key={sector.slug} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            <span className="block text-lg">{sector.name}</span>
                            <span className="text-sm text-[#3E534C]">{sector.summary}</span>
                        </span>
                        <Link href={sector.editUrl} className="inline-flex min-h-11 items-center underline">{t('edit')}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
