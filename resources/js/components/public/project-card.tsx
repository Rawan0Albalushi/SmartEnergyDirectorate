import { Link } from '@inertiajs/react';
import { FieldPhoto } from '@/components/public/field-photo';
import { fieldPlate } from '@/lib/fields';
import { label, useI18n } from '@/lib/i18n';
import type { ProjectSummary } from '@/types/content';

const crops = ['object-[center_28%]', 'object-[center_48%]', 'object-[center_68%]', 'object-center'] as const;

export function ProjectCard({
    project,
    href,
    index = 0,
    detailed = false,
}: {
    project: ProjectSummary;
    href: string;
    index?: number;
    detailed?: boolean;
}) {
    const { locale } = useI18n();
    const known = fieldPlate(project.sector?.slug) !== null;
    const meta = [label(locale, project.status), project.location, String(project.year)].filter(Boolean).join(' · ');

    return (
        <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white">
            <span className="block aspect-[8/5] overflow-hidden bg-[#e7eeea]">
                <FieldPhoto
                    slug={known ? project.sector?.slug : undefined}
                    horizon={!known}
                    alt=""
                    className={`h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${crops[index % crops.length]}`}
                />
            </span>
            <span className="flex flex-1 flex-col px-6 py-6">
                {project.sector ? <span className="text-xs font-semibold text-sea">{project.sector.name}</span> : null}
                <span className="mt-2 line-clamp-2 text-xl font-medium leading-7 text-ink">{project.title}</span>
                <span className="mt-2 text-sm font-medium text-sea">{meta}</span>
                {detailed ? <span className="mt-2 line-clamp-2 text-sm leading-6 text-[#3E534C]">{project.summary}</span> : null}
            </span>
        </Link>
    );
}

export function ProjectMoreTile({ href, countLabel, action }: { href: string; countLabel: string; action: string }) {
    return (
        <Link
            href={href}
            className="group relative flex h-full min-h-72 flex-col items-center justify-center overflow-hidden rounded-xl text-center text-white"
        >
            <FieldPhoto
                horizon
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
            <span className="absolute inset-0 bg-[#0c2e2a]/88" aria-hidden="true" />
            <span className="relative px-6">
                <span className="block text-5xl font-medium leading-none text-measure" aria-hidden="true">
                    +
                </span>
                <span className="mt-3 block text-xl font-medium">{countLabel}</span>
                <span className="mt-1 block text-sm text-[#F4F7F5]">{action}</span>
            </span>
        </Link>
    );
}
