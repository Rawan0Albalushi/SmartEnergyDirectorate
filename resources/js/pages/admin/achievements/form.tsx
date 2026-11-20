import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    AreaField,
    FieldPair,
    RecordForm,
    SelectField,
    TextField,
} from '@/components/admin/fields';
import { useI18n } from '@/lib/i18n';
import type { Option } from '@/types/content';

type AchievementFormData = {
    sector_id: number | null;
    title_ar: string;
    title_en: string;
    summary_ar: string;
    summary_en: string;
    year: number;
    is_published: boolean;
};

export default function AchievementForm({
    achievement,
    sectors,
    submitUrl,
    method,
    deleteUrl,
}: {
    achievement: AchievementFormData | null;
    sectors: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        sector_id: achievement?.sector_id ? String(achievement.sector_id) : '',
        title_ar: achievement?.title_ar ?? '',
        title_en: achievement?.title_en ?? '',
        summary_ar: achievement?.summary_ar ?? '',
        summary_en: achievement?.summary_en ?? '',
        year: String(achievement?.year ?? new Date().getFullYear()),
        is_published: achievement
            ? achievement.is_published
                ? '1'
                : '0'
            : '1',
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (method === 'post') {
            form.post(submitUrl);
        } else {
            form.put(submitUrl);
        }
    }

    return (
        <>
            <Head title={t('achievements')} />
            <RecordForm
                title={achievement ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/achievements`}
                deleteUrl={deleteUrl}
            >
                <SelectField
                    id="sector_id"
                    label={t('sector')}
                    value={form.data.sector_id}
                    error={form.errors.sector_id}
                    onChange={(value) => form.setData('sector_id', value)}
                    options={[
                        { value: '', label: t('none') },
                        ...sectors.map((sector) => ({
                            value: String(sector.id),
                            label: sector.name,
                        })),
                    ]}
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
            </RecordForm>
        </>
    );
}
