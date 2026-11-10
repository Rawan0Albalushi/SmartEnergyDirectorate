import { Head, Link } from '@inertiajs/react';
import { Pager } from '@/components/public/pager';
import { useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = { name: string; title: string; department: string; isPublished: boolean; editUrl: string };

export default function StaffIndex({ staff, page }: { staff: Row[]; page: PageMeta }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('staff')} />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-medium">{t('staff')}</h1>
                <Link href={`/${locale}/admin/staff/create`} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{t('create')}</Link>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {staff.map((member) => (
                    <li key={member.editUrl} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            <span className="block text-lg">{member.name}</span>
                            <span className="text-sm text-[#3E534C]">{member.title} · {member.department} · {member.isPublished ? t('visible') : t('hidden')}</span>
                        </span>
                        <Link href={member.editUrl} className="inline-flex min-h-11 items-center underline">{t('edit')}</Link>
                    </li>
                ))}
            </ul>
            <Pager page={page} />
        </>
    );
}
