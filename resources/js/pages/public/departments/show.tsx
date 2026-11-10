import { Head } from '@inertiajs/react';
import { PageBody, SectionTitle, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { useI18n } from '@/lib/i18n';
import type { DepartmentDetail, StaffPublic } from '@/types/content';

export default function DepartmentShow({
    department,
    staff,
}: {
    department: DepartmentDetail;
    staff: StaffPublic[];
}) {
    const { t } = useI18n();

    return (
        <>
            <Head title={department.name} />
            <PageIntro title={department.name} lede={department.summary} />
            <PageBody>
                {department.mandate ? <p className="max-w-3xl text-base leading-8">{department.mandate}</p> : null}
                {department.email || department.phone ? (
                    <dl className={`${department.mandate ? 'mt-8' : ''} flex flex-wrap gap-x-10 gap-y-4`}>
                        {department.email ? (
                            <div>
                                <dt className="text-sm text-[#3E534C]">{t('email')}</dt>
                                <dd>
                                    <a className="inline-flex min-h-11 items-center text-sea" href={`mailto:${department.email}`}>
                                        {department.email}
                                    </a>
                                </dd>
                            </div>
                        ) : null}
                        {department.phone ? (
                            <div>
                                <dt className="text-sm text-[#3E534C]">{t('phone')}</dt>
                                <dd>
                                    <a className="inline-flex min-h-11 items-center text-sea" href={`tel:${department.phone}`}>
                                        {department.phone}
                                    </a>
                                </dd>
                            </div>
                        ) : null}
                    </dl>
                ) : null}

                <SectionTitle className={department.mandate || department.email || department.phone ? 'mt-12' : ''}>
                    {t('staff')}
                </SectionTitle>
                {staff.length === 0 ? (
                    <p className="mt-4 text-sm text-[#3E534C]">{t('emptyStaff')}</p>
                ) : (
                    <Sheet className="mt-4">
                        <ul>
                            {staff.map((member) => (
                                <li key={member.id} className="border-b border-line px-4 py-4 last:border-b-0 sm:px-5">
                                    <p className="text-lg font-medium text-ink">{member.name}</p>
                                    <p className="mt-1 text-sm text-[#3E534C]">{member.title}</p>
                                    {member.email ? (
                                        <a
                                            className="mt-1 inline-flex min-h-11 items-center text-sm text-sea"
                                            href={`mailto:${member.email}`}
                                        >
                                            {member.email}
                                        </a>
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    </Sheet>
                )}
            </PageBody>
        </>
    );
}
