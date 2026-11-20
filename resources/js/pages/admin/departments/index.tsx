import { Head } from '@inertiajs/react';
import {
    ActionCell,
    DataCell,
    PhotoCell,
    DataRow,
    DataTable,
    PageIntro,
    PrimaryLink,
    RowAction,
} from '@/components/admin/chrome';
import { useI18n } from '@/lib/i18n';
import { listedPhoto, useHeroSrc } from '@/lib/media';

type Row = {
    name: string;
    slug: string;
    imageUrl: string | null;
    staffCount: number;
    showUrl: string;
    editUrl: string;
};

export default function DepartmentIndex({
    departments,
}: {
    departments: Row[];
}) {
    const { t, locale } = useI18n();
    const hero = useHeroSrc();

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
            <DataTable
                label={t('departments')}
                count={departments.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'name', label: t('name') },
                    { key: 'staff', label: t('staff') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {departments.map((department) => (
                    <DataRow key={department.editUrl}>
                        <PhotoCell
                            src={listedPhoto(
                                department.imageUrl,
                                department.slug,
                                hero,
                                'department',
                            )}
                        />
                        <DataCell primary>{department.name}</DataCell>
                        <DataCell numeric>{department.staffCount}</DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={department.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="edit"
                                href={department.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
        </>
    );
}
