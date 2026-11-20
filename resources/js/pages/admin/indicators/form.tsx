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

type IndicatorFormData = {
    sector_id: number;
    name_ar: string;
    name_en: string;
    value: number;
    unit_ar: string;
    unit_en: string;
    period_label: string;
    recorded_on: string;
    notes_ar: string | null;
    notes_en: string | null;
    is_published: boolean;
    sort_order: number;
};

export default function IndicatorForm({
    indicator,
    sectors,
    submitUrl,
    method,
    deleteUrl,
}: {
    indicator: IndicatorFormData | null;
    sectors: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        sector_id: String(indicator?.sector_id ?? sectors[0]?.id ?? ''),
        name_ar: indicator?.name_ar ?? '',
        name_en: indicator?.name_en ?? '',
        value: indicator ? String(indicator.value) : '',
        unit_ar: indicator?.unit_ar ?? '',
        unit_en: indicator?.unit_en ?? '',
        period_label: indicator?.period_label ?? '',
        recorded_on: indicator?.recorded_on ?? '',
        notes_ar: indicator?.notes_ar ?? '',
        notes_en: indicator?.notes_en ?? '',
        is_published: indicator ? (indicator.is_published ? '1' : '0') : '1',
        sort_order: String(indicator?.sort_order ?? 0),
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
            <Head title={t('indicators')} />
            <RecordForm
                title={indicator ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/indicators`}
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
                        id="name_ar"
                        label={t('nameAr')}
                        value={form.data.name_ar}
                        error={form.errors.name_ar}
                        onChange={(value) => form.setData('name_ar', value)}
                        required
                    />
                    <TextField
                        id="name_en"
                        label={t('nameEn')}
                        value={form.data.name_en}
                        error={form.errors.name_en}
                        onChange={(value) => form.setData('name_en', value)}
                        required
                    />
                </FieldPair>
                <TextField
                    id="value"
                    label={t('value')}
                    type="number"
                    value={form.data.value}
                    error={form.errors.value}
                    onChange={(value) => form.setData('value', value)}
                    required
                />
                <FieldPair>
                    <TextField
                        id="unit_ar"
                        label={t('unitAr')}
                        value={form.data.unit_ar}
                        error={form.errors.unit_ar}
                        onChange={(value) => form.setData('unit_ar', value)}
                        required
                    />
                    <TextField
                        id="unit_en"
                        label={t('unitEn')}
                        value={form.data.unit_en}
                        error={form.errors.unit_en}
                        onChange={(value) => form.setData('unit_en', value)}
                        required
                    />
                </FieldPair>
                <FieldPair>
                    <TextField
                        id="period_label"
                        label={t('periodLabel')}
                        value={form.data.period_label}
                        error={form.errors.period_label}
                        onChange={(value) =>
                            form.setData('period_label', value)
                        }
                        required
                    />
                    <TextField
                        id="recorded_on"
                        label={t('readingDate')}
                        type="date"
                        value={form.data.recorded_on}
                        error={form.errors.recorded_on}
                        onChange={(value) => form.setData('recorded_on', value)}
                        required
                    />
                </FieldPair>
                <FieldPair>
                    <AreaField
                        id="notes_ar"
                        label={t('notesAr')}
                        value={form.data.notes_ar}
                        error={form.errors.notes_ar}
                        onChange={(value) => form.setData('notes_ar', value)}
                    />
                    <AreaField
                        id="notes_en"
                        label={t('notesEn')}
                        value={form.data.notes_en}
                        error={form.errors.notes_en}
                        onChange={(value) => form.setData('notes_en', value)}
                    />
                </FieldPair>
                <FieldPair>
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
                    <TextField
                        id="sort_order"
                        label={t('sortOrder')}
                        type="number"
                        value={form.data.sort_order}
                        error={form.errors.sort_order}
                        onChange={(value) => form.setData('sort_order', value)}
                    />
                </FieldPair>
            </RecordForm>
        </>
    );
}
