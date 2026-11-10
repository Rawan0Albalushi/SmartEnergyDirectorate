import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { AreaField, RecordForm, TextField } from '@/components/admin/fields';
import { useI18n } from '@/lib/i18n';

type SectorFormData = {
    name_ar: string;
    name_en: string;
    summary_ar: string;
    summary_en: string;
    body_ar: string | null;
    body_en: string | null;
    sort_order: number;
};

export default function SectorForm({ sector, submitUrl }: { sector: SectorFormData; submitUrl: string }) {
    const { t, locale } = useI18n();
    const form = useForm({
        name_ar: sector.name_ar,
        name_en: sector.name_en,
        summary_ar: sector.summary_ar,
        summary_en: sector.summary_en,
        body_ar: sector.body_ar ?? '',
        body_en: sector.body_en ?? '',
        sort_order: String(sector.sort_order),
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.put(submitUrl);
    }

    return (
        <>
            <Head title={t('sectors')} />
            <RecordForm title={t('edit')} errors={form.errors} processing={form.processing} onSubmit={submit} cancelHref={`/${locale}/admin/sectors`}>
                <TextField id="name_ar" label={t('nameAr')} value={form.data.name_ar} error={form.errors.name_ar} onChange={(value) => form.setData('name_ar', value)} required />
                <TextField id="name_en" label={t('nameEn')} value={form.data.name_en} error={form.errors.name_en} onChange={(value) => form.setData('name_en', value)} required />
                <TextField id="summary_ar" label={t('summaryAr')} value={form.data.summary_ar} error={form.errors.summary_ar} onChange={(value) => form.setData('summary_ar', value)} required />
                <TextField id="summary_en" label={t('summaryEn')} value={form.data.summary_en} error={form.errors.summary_en} onChange={(value) => form.setData('summary_en', value)} required />
                <AreaField id="body_ar" label={t('bodyAr')} value={form.data.body_ar} error={form.errors.body_ar} onChange={(value) => form.setData('body_ar', value)} />
                <AreaField id="body_en" label={t('bodyEn')} value={form.data.body_en} error={form.errors.body_en} onChange={(value) => form.setData('body_en', value)} />
                <TextField id="sort_order" label={t('sortOrder')} type="number" value={form.data.sort_order} error={form.errors.sort_order} onChange={(value) => form.setData('sort_order', value)} />
            </RecordForm>
        </>
    );
}
