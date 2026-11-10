import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Building2, ClipboardList, Leaf, Share2, Zap, type LucideIcon } from 'lucide-react';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { departmentPlates } from '@/lib/department-plates';
import { horizon } from '@/lib/fields';
import { useI18n } from '@/lib/i18n';
import type { DepartmentSummary } from '@/types/content';

const departmentIcons: Record<string, LucideIcon> = {
    planning: ClipboardList,
    renewables: Leaf,
    power: Zap,
    efficiency: Building2,
    communications: Share2,
};

export default function DepartmentsIndex({ departments }: { departments: DepartmentSummary[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('departments')} />
            <PageIntro title={t('departments')} lede={t('departmentsIntro')} />
            <PageBody>
                {departments.length === 0 ? <p className="text-sm text-[#3E534C]">{t('emptyDepartments')}</p> : null}
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {departments.map((department) => {
                        const plate = departmentPlates[department.slug] ?? { src: horizon.src, position: 'object-center' };
                        const Icon = departmentIcons[department.slug];

                        return (
                            <li key={department.slug} className="h-full">
                                <Link
                                    href={`/${locale}/departments/${department.slug}`}
                                    className="flex h-full min-h-44 flex-col-reverse gap-3 rounded-2xl border border-line bg-white p-3 shadow-[0_16px_40px_-28px_rgba(12,46,42,0.7)] sm:flex-row sm:items-stretch"
                                >
                                    <span className="flex min-w-0 flex-1 flex-col py-1 sm:py-2 sm:ps-1">
                                        <span className="flex items-center gap-2 text-lg font-medium text-deep">
                                            {department.name}
                                            {department.slug === 'hydrogen' ? (
                                                <span className="text-base leading-none text-sea" aria-hidden="true">
                                                    H₂
                                                </span>
                                            ) : Icon ? (
                                                <Icon className="size-5 shrink-0 text-sea" aria-hidden="true" />
                                            ) : null}
                                        </span>
                                        <span className="mt-2 line-clamp-3 text-sm leading-6 text-[#3E534C]">{department.summary}</span>
                                        <span className="mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-sm text-sea">
                                            {t('readMore')}
                                            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[#e7f1ee]">
                                                <ArrowLeft className="size-3.5 ltr:scale-x-[-1]" aria-hidden="true" />
                                            </span>
                                        </span>
                                    </span>
                                    <span className="relative block h-44 overflow-hidden rounded-xl sm:h-auto sm:w-40 sm:self-stretch">
                                        <img
                                            src={plate.src}
                                            alt=""
                                            className={`h-full w-full object-cover sm:absolute sm:inset-0 ${plate.position}`}
                                        />
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </PageBody>
        </>
    );
}
