import { Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Globe, LayoutGrid, MapPin } from 'lucide-react';
import { useState } from 'react';
import { FieldPhoto } from '@/components/public/field-photo';
import { formatDate } from '@/lib/format';
import { label, useI18n } from '@/lib/i18n';
import type { NewsSummary, ProjectSummary } from '@/types/content';

const scopes = [
    { value: 'all', icon: LayoutGrid },
    { value: 'local', icon: MapPin },
    { value: 'international', icon: Globe },
] as const;

export function HomeDigest({ news, projects }: { news: NewsSummary[]; projects: ProjectSummary[] }) {
    return (
        <div className="mx-auto grid max-w-[90rem] gap-4 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-6 lg:py-14">
            <NewsPanel news={news} />
            <ProjectsPanel projects={projects} />
        </div>
    );
}

function NewsPanel({ news }: { news: NewsSummary[] }) {
    const { t, locale } = useI18n();
    const [scope, setScope] = useState<(typeof scopes)[number]['value']>('all');
    const visible = news.filter((item) => scope === 'all' || item.scope === scope).slice(0, 3);

    return (
        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5" aria-labelledby="home-news">
            <PanelHead
                id="home-news"
                title={t('newsHeading')}
                lede={t('newsHomeLede')}
                href={`/${locale}/news`}
                action={t('allNews')}
            />
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t('newsHeading')}>
                {scopes.map((item) => {
                    const selected = scope === item.value;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => setScope(item.value)}
                            className={
                                selected
                                    ? 'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-deep px-3 text-sm text-white'
                                    : 'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm text-ink'
                            }
                        >
                            <Icon className="size-3.5" aria-hidden="true" />
                            {t(item.value)}
                        </button>
                    );
                })}
            </div>
            <ul className="mt-4 grid gap-3">
                {visible.length === 0 ? <li className="py-4 text-sm text-[#3E534C]">{t('emptyNews')}</li> : null}
                {visible.map((item) => (
                    <li key={item.slug}>
                        <Link href={`/${locale}/news/${item.slug}`} className="flex items-center gap-3 rounded-xl p-1 hover:bg-paper">
                            <Thumb slug={item.sector?.slug} />
                            <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                    <time className="text-xs text-[#3E534C]" dateTime={item.publishedAt ?? undefined}>
                                        {formatDate(item.publishedAt, locale)}
                                    </time>
                                    <ScopeBadge>{label(locale, item.scope)}</ScopeBadge>
                                </span>
                                <span className="mt-1 block text-base font-medium leading-6 text-ink">{item.title}</span>
                                <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">{item.summary}</span>
                            </span>
                            <RowArrow />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function ProjectsPanel({ projects }: { projects: ProjectSummary[] }) {
    const { t, locale } = useI18n();

    return (
        <section className="rounded-2xl border border-line bg-white p-4 sm:p-5" aria-labelledby="home-projects">
            <PanelHead
                id="home-projects"
                title={t('projectsHeading')}
                lede={t('projectsHomeLede')}
                href={`/${locale}/projects`}
                action={t('allProjects')}
            />
            <ul className="mt-4 grid gap-3">
                {projects.length === 0 ? <li className="py-4 text-sm text-[#3E534C]">{t('emptyProjects')}</li> : null}
                {projects.map((project) => (
                    <li key={project.slug}>
                        <Link href={`/${locale}/projects/${project.slug}`} className="flex items-center gap-3 rounded-xl p-1 hover:bg-paper">
                            <Thumb slug={project.sector?.slug} />
                            <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-[#eef3f1] px-2.5 py-1 text-xs text-[#3E534C]">
                                        <Calendar className="size-3.5" aria-hidden="true" />
                                        {project.year}
                                    </span>
                                    <StatusBadge status={project.status}>{label(locale, project.status)}</StatusBadge>
                                </span>
                                <span className="mt-1.5 block text-base font-medium leading-6 text-ink">{project.title}</span>
                                <span className="mt-1 line-clamp-2 text-sm leading-6 text-[#3E534C]">{project.summary}</span>
                            </span>
                            <RowArrow />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function PanelHead({
    id,
    title,
    lede,
    href,
    action,
}: {
    id: string;
    title: string;
    lede: string;
    href: string;
    action: string;
}) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
                <h2 id={id} className="flex items-center gap-2 text-xl font-medium text-ink">
                    <span className="h-6 w-1 shrink-0 rounded-full bg-deep" aria-hidden="true" />
                    {title}
                </h2>
                <p className="mt-1 max-w-md text-sm leading-6 text-[#3E534C]">{lede}</p>
            </div>
            <Link
                href={href}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-[#f7faf8] ps-3 pe-1.5 text-sm text-ink"
            >
                {action}
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#e7f1ee] text-deep">
                    <ArrowLeft className="size-4 ltr:scale-x-[-1]" aria-hidden="true" />
                </span>
            </Link>
        </div>
    );
}

function Thumb({ slug }: { slug?: string | null }) {
    return (
        <span className="block h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#e7eeea] sm:h-24 sm:w-36">
            <FieldPhoto slug={slug} alt="" className="h-full w-full object-cover" />
        </span>
    );
}

function RowArrow() {
    return (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee] text-deep" aria-hidden="true">
            <ArrowLeft className="size-4 ltr:scale-x-[-1]" />
        </span>
    );
}

function ScopeBadge({ children }: { children: string }) {
    return <span className="inline-flex items-center rounded-full bg-[#e7f6ee] px-2.5 py-1 text-xs text-[#0e6b62]">{children}</span>;
}

function StatusBadge({ status, children }: { status: string; children: string }) {
    const tone =
        status === 'completed'
            ? 'bg-[#e5f3ea] text-[#146c43]'
            : status === 'ongoing'
              ? 'bg-[#e7f6ee] text-[#0e6b62]'
              : 'bg-[#e6f2f6] text-[#0e5f73]';

    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${tone}`}>
            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
            {children}
        </span>
    );
}
