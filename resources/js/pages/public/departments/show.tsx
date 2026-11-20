import { Head } from '@inertiajs/react';
import { Mail, Phone, type LucideIcon } from 'lucide-react';
import { PageBody, SectionTitle, Sheet } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { PersonGallery } from '@/components/public/person-gallery';
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
    const hasBrief = Boolean(
        department.mandate || department.email || department.phone,
    );

    return (
        <>
            <Head title={department.name} />
            <PageIntro title={department.name} lede={department.summary} />
            <PageBody>
                <DepartmentBrief department={department} />

                <SectionTitle className={hasBrief ? 'mt-12' : ''}>
                    {t('staff')}
                </SectionTitle>
                {staff.length === 0 ? (
                    <p className="mt-4 text-sm text-[#3E534C]">
                        {t('emptyStaff')}
                    </p>
                ) : (
                    <div className="mt-6">
                        <PersonGallery people={staff} />
                    </div>
                )}
            </PageBody>
        </>
    );
}

function DepartmentBrief({ department }: { department: DepartmentDetail }) {
    const { t } = useI18n();
    const contacts = [
        department.email
            ? {
                  key: 'email',
                  label: t('email'),
                  value: department.email,
                  href: `mailto:${department.email}`,
                  icon: Mail,
              }
            : null,
        department.phone
            ? {
                  key: 'phone',
                  label: t('phone'),
                  value: department.phone,
                  href: `tel:${department.phone.replace(/[^\d+]/g, '')}`,
                  icon: Phone,
              }
            : null,
    ].filter((contact) => contact !== null);

    if (!department.mandate && contacts.length === 0) {
        return null;
    }

    return (
        <Sheet>
            <span className="block h-0.5 bg-measure" aria-hidden="true" />
            <div className="px-6 py-7 sm:px-8 sm:py-8">
                {department.mandate ? (
                    <>
                        <SectionTitle id="department-mandate">
                            {t('mandate')}
                        </SectionTitle>
                        <p className="mt-4 max-w-[65ch] text-lg leading-9 text-ink">
                            {department.mandate}
                        </p>
                    </>
                ) : null}
                {contacts.length > 0 ? (
                    <div
                        className={`${department.mandate ? 'mt-6 border-t border-line pt-5' : ''} grid max-w-3xl gap-2 ${contacts.length > 1 ? 'sm:grid-cols-2' : ''}`}
                    >
                        {contacts.map(({ key, ...contact }) => (
                            <ContactLink key={key} {...contact} />
                        ))}
                    </div>
                ) : null}
            </div>
        </Sheet>
    );
}

function ContactLink({
    label,
    value,
    href,
    icon: Icon,
}: {
    label: string;
    value: string;
    href: string;
    icon: LucideIcon;
}) {
    return (
        <a
            href={href}
            className="group flex min-h-16 items-center gap-3 rounded-xl px-2 py-2 text-start hover:bg-paper"
        >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee] text-sea">
                <Icon
                    className="size-4"
                    strokeWidth={1.75}
                    aria-hidden="true"
                />
            </span>
            <span className="min-w-0">
                <span className="block text-xs leading-5 text-[#3E534C]">
                    {label}
                </span>
                <span
                    dir="ltr"
                    className="mt-0.5 block text-sm font-medium text-deep group-hover:underline"
                >
                    {value}
                </span>
            </span>
        </a>
    );
}
