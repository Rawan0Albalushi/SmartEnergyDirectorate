import { Head, Link } from '@inertiajs/react';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { PersonGallery } from '@/components/public/person-gallery';
import { PortraitCard } from '@/components/public/portrait-card';
import { departmentPlates } from '@/lib/department-plates';
import { horizon } from '@/lib/fields';
import { useI18n, type TranslationKey } from '@/lib/i18n';
import type { DepartmentSummary, StaffPublic } from '@/types/content';

type Roster = 'staff' | 'board' | null;

const views: Record<'sections' | 'staff' | 'board', { title: TranslationKey; lede: TranslationKey }> = {
    sections: { title: 'departments', lede: 'departmentsIntro' },
    staff: { title: 'staff', lede: 'staffIntro' },
    board: { title: 'board', lede: 'boardIntro' },
};

export default function DepartmentsIndex({
    departments,
    roster,
    people,
}: {
    departments: DepartmentSummary[];
    roster: Roster;
    people: StaffPublic[];
}) {
    const { t, locale } = useI18n();
    const view = roster === 'staff' || roster === 'board' ? roster : 'sections';
    const copy = views[view];

    return (
        <>
            <Head title={t(copy.title)} />
            <PageIntro title={t(copy.title)} lede={t(copy.lede)} />
            <PageBody>
                <nav
                    className="grid overflow-hidden rounded-[1.25rem] border border-line bg-white sm:grid-cols-3 [&>*+*]:border-t sm:[&>*+*]:border-s sm:[&>*+*]:border-t-0"
                    aria-label={t('peopleNav')}
                >
                    <RosterTab href={`/${locale}/departments`} current={view === 'sections'}>
                        {t('departments')}
                    </RosterTab>
                    <RosterTab href={`/${locale}/departments?roster=board`} current={view === 'board'}>
                        {t('board')}
                    </RosterTab>
                    <RosterTab href={`/${locale}/departments?roster=staff`} current={view === 'staff'}>
                        {t('staff')}
                    </RosterTab>
                </nav>

                {view === 'sections' ? (
                    departments.length === 0 ? (
                        <p className="mt-6 text-sm text-[#3E534C]">{t('emptyDepartments')}</p>
                    ) : (
                        <ol className="mt-6 grid list-none gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3">
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
                    )
                ) : people.length === 0 ? (
                    <p className="mt-6 text-sm text-[#3E534C]">{view === 'board' ? t('emptyBoard') : t('emptyPeople')}</p>
                ) : (
                    <div className="mt-6">
                        <PersonGallery people={people} />
                    </div>
                )}
            </PageBody>
        </>
    );
}

function RosterTab({ href, current, children }: { href: string; current: boolean; children: string }) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={
                current
                    ? 'inline-flex min-h-12 items-center justify-center bg-deep px-4 text-center text-sm text-[#F4F7F5]'
                    : 'inline-flex min-h-12 items-center justify-center border-line px-4 text-center text-sm text-ink hover:bg-paper'
            }
        >
            {children}
        </Link>
    );
}
