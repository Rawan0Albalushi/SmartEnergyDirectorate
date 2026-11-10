import { Head, Link } from '@inertiajs/react';
import { useI18n } from '@/lib/i18n';

type Row = { name: string; staffCount: number; editUrl: string };

export default function DepartmentIndex({ departments }: { departments: Row[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('departments')} />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-medium">{t('departments')}</h1>
                <Link href={`/${locale}/admin/departments/create`} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{t('create')}</Link>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {departments.map((department) => (
                    <li key={department.editUrl} className="flex items-center justify-between gap-3 py-4">
                        <span>
                            <span className="block text-lg">{department.name}</span>
                            <span className="text-sm text-[#3E534C]">{t('staff')}: {department.staffCount}</span>
                        </span>
                        <Link href={department.editUrl} className="inline-flex min-h-11 items-center underline">{t('edit')}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
}
