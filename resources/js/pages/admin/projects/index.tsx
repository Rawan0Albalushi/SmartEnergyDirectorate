import { Head, Link } from '@inertiajs/react';
import { Pager } from '@/components/public/pager';
import { label, useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = { title: string; year: number; status: string; isPublished: boolean; sector: string; editUrl: string };

export default function ProjectIndex({ projects, page }: { projects: Row[]; page: PageMeta }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('projects')} />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-medium">{t('projects')}</h1>
                <Link href={`/${locale}/admin/projects/create`} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white">{t('create')}</Link>
            </div>
            <ul className="mt-6 divide-y divide-line border-y border-line">
                {projects.map((project) => (
                    <li key={project.editUrl} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <span>
                            <span className="block text-lg">{project.title}</span>
                            <span className="text-sm text-[#3E534C]">{project.sector} · {project.year} · {label(locale, project.status)} · {project.isPublished ? t('visible') : t('hidden')}</span>
                        </span>
                        <Link href={project.editUrl} className="inline-flex min-h-11 items-center underline">{t('edit')}</Link>
                    </li>
                ))}
            </ul>
            <Pager page={page} />
        </>
    );
}
