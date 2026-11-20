import { Head } from '@inertiajs/react';
import { MapPin } from 'lucide-react';
import { ForwardLink, PageBody } from '@/components/public/frame';
import { BandChip, PageIntro } from '@/components/public/page-intro';
import { label, useI18n } from '@/lib/i18n';
import type { ProjectDetail } from '@/types/content';

export default function ProjectShow({ project }: { project: ProjectDetail }) {
    const { locale } = useI18n();

    return (
        <>
            <Head title={project.title} />
            <PageIntro title={project.title} lede={project.summary}>
                <BandChip>{project.year}</BandChip>
                <BandChip>{label(locale, project.status)}</BandChip>
                {project.location ? (
                    <BandChip>
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {project.location}
                    </BandChip>
                ) : null}
            </PageIntro>
            <PageBody>
                {project.body ? (
                    <p className="max-w-3xl text-base leading-8">
                        {project.body}
                    </p>
                ) : null}
                {project.sector ? (
                    <p className={project.body ? 'mt-8' : ''}>
                        <ForwardLink
                            href={`/${locale}/sectors#${project.sector.slug}`}
                        >
                            {project.sector.name}
                        </ForwardLink>
                    </p>
                ) : null}
            </PageBody>
        </>
    );
}
