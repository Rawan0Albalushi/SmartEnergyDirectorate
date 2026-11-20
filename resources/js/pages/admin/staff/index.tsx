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
    StatusText,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    name: string;
    imageUrl: string | null;
    title: string;
    department: string;
    roster: string;
    isPublished: boolean;
    showUrl: string;
    editUrl: string;
};

export default function StaffIndex({
    staff,
    page,
}: {
    staff: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('staff')} />
            <PageIntro
                title={t('staff')}
                action={
                    <PrimaryLink href={`/${locale}/admin/staff/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <DataTable
                label={t('staff')}
                count={staff.length}
                empty={t('emptyRecords')}
                columns={[
                    { key: 'photo', label: t('photo') },
                    { key: 'name', label: t('name') },
                    { key: 'title', label: t('jobTitle') },
                    { key: 'department', label: t('department') },
                    { key: 'roster', label: t('roster') },
                    { key: 'visibility', label: t('visibility') },
                    { key: 'actions', label: t('actions'), align: 'end' },
                ]}
            >
                {staff.map((member) => (
                    <DataRow key={member.editUrl}>
                        <PhotoCell src={member.imageUrl} />
                        <DataCell primary>{member.name}</DataCell>
                        <DataCell>{member.title || '—'}</DataCell>
                        <DataCell>{member.department || '—'}</DataCell>
                        <DataCell>{label(locale, member.roster)}</DataCell>
                        <DataCell>
                            <StatusText
                                on={member.isPublished}
                                onLabel={t('visible')}
                                offLabel={t('hidden')}
                            />
                        </DataCell>
                        <ActionCell>
                            <RowAction
                                kind="view"
                                href={member.showUrl}
                                label={t('view')}
                            />
                            <RowAction
                                kind="edit"
                                href={member.editUrl}
                                label={t('edit')}
                            />
                        </ActionCell>
                    </DataRow>
                ))}
            </DataTable>
            <Pager page={page} />
        </>
    );
}
