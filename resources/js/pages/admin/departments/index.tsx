import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
} from '@/components/admin/chrome';
import { useI18n } from '@/lib/i18n';

type Row = { name: string; staffCount: number; editUrl: string };

export default function DepartmentIndex({
    departments,
}: {
    departments: Row[];
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('departments')} />
            <PageIntro
                title={t('departments')}
                action={
                    <PrimaryLink href={`/${locale}/admin/departments/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <RecordList count={departments.length} empty={t('emptyRecords')}>
                {departments.map((department) => (
                    <RecordRow key={department.editUrl}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {department.name}
                            </span>
                            <Meta
                                parts={[
                                    `${t('staff')}: ${department.staffCount}`,
                                ]}
                            />
                        </span>
                        <EditLink href={department.editUrl}>
                            {t('edit')}
                        </EditLink>
                    </RecordRow>
                ))}
            </RecordList>
        </>
    );
}
