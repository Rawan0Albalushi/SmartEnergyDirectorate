import { Head } from '@inertiajs/react';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { PortraitCard } from '@/components/public/portrait-card';
import { departmentPlates } from '@/lib/department-plates';
import { horizon } from '@/lib/fields';
import { useI18n } from '@/lib/i18n';
import type { DepartmentSummary } from '@/types/content';

export default function DepartmentsIndex({ departments }: { departments: DepartmentSummary[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('departments')} />
            <PageIntro title={t('departments')} lede={t('departmentsIntro')} />
            <PageBody>
                {departments.length === 0 ? <p className="text-sm text-[#3E534C]">{t('emptyDepartments')}</p> : null}
                <ol className="grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
                    {departments.map((department, index) => {
                        const plate = departmentPlates[department.slug] ?? { src: horizon.src, position: 'object-center' };

                        return (
                            <li key={department.slug} className="min-w-0">
                                <PortraitCard
                                    href={`/${locale}/departments/${department.slug}`}
                                    src={plate.src}
                                    position={plate.position}
                                    index={index}
                                    title={department.name}
                                    text={department.summary}
                                />
                            </li>
                        );
                    })}
                </ol>
            </PageBody>
        </>
    );
}
