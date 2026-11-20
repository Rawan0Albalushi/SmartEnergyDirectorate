import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
    Visibility,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    name: string;
    title: string;
    department: string;
    roster: string;
    isPublished: boolean;
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
            <RecordList count={staff.length} empty={t('emptyRecords')}>
                {staff.map((member) => (
                    <RecordRow key={member.editUrl}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {member.name}
                            </span>
                            <Meta
                                parts={[
                                    member.title,
                                    member.department,
                                    label(locale, member.roster),
                                ]}
                            />
                        </span>
                        <span className="flex items-center gap-4">
                            <Visibility
                                published={member.isPublished}
                                visible={t('visible')}
                                hidden={t('hidden')}
                            />
                            <EditLink href={member.editUrl}>
                                {t('edit')}
                            </EditLink>
                        </span>
                    </RecordRow>
                ))}
            </RecordList>
            <Pager page={page} />
        </>
    );
}
