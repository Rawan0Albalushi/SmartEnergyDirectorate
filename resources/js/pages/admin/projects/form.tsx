import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    AreaField,
    FieldPair,
    RecordForm,
    SelectField,
    TextField,
} from '@/components/admin/fields';
import { ImageField } from '@/components/admin/image-field';
import { useI18n } from '@/lib/i18n';
import { submitWithFiles } from '@/lib/submit-files';
import type { Option } from '@/types/content';

type ProjectFormData = {
    sector_id: number;
    title_ar: string;
    title_en: string;
    summary_ar: string;
    summary_en: string;
    body_ar: string | null;
    body_en: string | null;
    status: string;
    location_ar: string | null;
    location_en: string | null;
    year: number;
    is_published: boolean;
    image_url?: string | null;
};

export default function ProjectForm({
    project,
    sectors,
    submitUrl,
    method,
    deleteUrl,
}: {
    project: ProjectFormData | null;
    sectors: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        sector_id: String(project?.sector_id ?? sectors[0]?.id ?? ''),
        title_ar: project?.title_ar ?? '',
        title_en: project?.title_en ?? '',
        summary_ar: project?.summary_ar ?? '',
        summary_en: project?.summary_en ?? '',
        body_ar: project?.body_ar ?? '',
        body_en: project?.body_en ?? '',
        status: project?.status ?? 'planned',
        location_ar: project?.location_ar ?? '',
        location_en: project?.location_en ?? '',
        year: String(project?.year ?? new Date().getFullYear()),
        is_published: project ? (project.is_published ? '1' : '0') : '1',
        image: null as File | null,
        remove_image: false,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitWithFiles(form, submitUrl, method, (data) => ({
            ...data,
            image: data.image ?? '',
            remove_image: data.remove_image ? '1' : '0',
        }));
    }

    return (
        <>
            <Head title={t('projects')} />
            <RecordForm
                title={project ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/projects`}
                deleteUrl={deleteUrl}
            >
                <SelectField
                    id="sector_id"
                    label={t('sector')}
                    value={form.data.sector_id}
                    error={form.errors.sector_id}
                    onChange={(value) => form.setData('sector_id', value)}
                    options={sectors.map((sector) => ({
                        value: String(sector.id),
                        label: sector.name,
                    }))}
                />
                <FieldPair>
                    <TextField
                        id="title_ar"
                        label={t('titleAr')}
                        value={form.data.title_ar}
                        error={form.errors.title_ar}
                        onChange={(value) => form.setData('title_ar', value)}
                        required
                    />
                    <TextField
                        id="title_en"
                        label={t('titleEn')}
                        value={form.data.title_en}
                        error={form.errors.title_en}
                        onChange={(value) => form.setData('title_en', value)}
                        required
                    />
                </FieldPair>
                <FieldPair>
                    <AreaField
                        id="summary_ar"
                        label={t('summaryAr')}
                        value={form.data.summary_ar}
                        error={form.errors.summary_ar}
                        onChange={(value) => form.setData('summary_ar', value)}
                    />
                    <AreaField
                        id="summary_en"
                        label={t('summaryEn')}
                        value={form.data.summary_en}
                        error={form.errors.summary_en}
                        onChange={(value) => form.setData('summary_en', value)}
                    />
                </FieldPair>
                <FieldPair>
                    <AreaField
                        id="body_ar"
                        label={t('bodyAr')}
                        value={form.data.body_ar}
                        error={form.errors.body_ar}
                        onChange={(value) => form.setData('body_ar', value)}
                    />
                    <AreaField
                        id="body_en"
                        label={t('bodyEn')}
                        value={form.data.body_en}
                        error={form.errors.body_en}
                        onChange={(value) => form.setData('body_en', value)}
                    />
                </FieldPair>
                <SelectField
                    id="status"
                    label={t('status')}
                    value={form.data.status}
                    error={form.errors.status}
                    onChange={(value) => form.setData('status', value)}
                    options={[
                        { value: 'planned', label: t('planned') },
                        { value: 'ongoing', label: t('ongoing') },
                        { value: 'completed', label: t('completed') },
                    ]}
                />
                <FieldPair>
                    <TextField
                        id="location_ar"
                        label={t('locationAr')}
                        value={form.data.location_ar}
                        error={form.errors.location_ar}
                        onChange={(value) => form.setData('location_ar', value)}
                    />
                    <TextField
                        id="location_en"
                        label={t('locationEn')}
                        value={form.data.location_en}
                        error={form.errors.location_en}
                        onChange={(value) => form.setData('location_en', value)}
                    />
                </FieldPair>
                <FieldPair>
                    <TextField
                        id="year"
                        label={t('year')}
                        type="number"
                        value={form.data.year}
                        error={form.errors.year}
                        onChange={(value) => form.setData('year', value)}
                        required
                    />
                    <SelectField
                        id="is_published"
                        label={t('visibility')}
                        value={form.data.is_published}
                        error={form.errors.is_published}
                        onChange={(value) =>
                            form.setData('is_published', value)
                        }
                        options={[
                            { value: '1', label: t('visible') },
                            { value: '0', label: t('hidden') },
                        ]}
                    />
                </FieldPair>
                <ImageField
                    label={t('photo')}
                    hint={t('imageHint')}
                    currentUrl={project?.image_url}
                    remove={form.data.remove_image}
                    error={form.errors.image}
                    onFile={(file) =>
                        form.setData({
                            ...form.data,
                            image: file,
                            remove_image: file ? false : form.data.remove_image,
                        })
                    }
                    onRemove={(remove) => form.setData('remove_image', remove)}
                />
            </RecordForm>
        </>
    );
}
