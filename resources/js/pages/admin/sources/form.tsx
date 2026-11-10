import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { DeleteControl, RecordForm, SelectField, TextField } from '@/components/admin/fields';
import { useI18n } from '@/lib/i18n';
import type { Option } from '@/types/content';

type SourceFormData = {
    sector_id: number | null;
    name_ar: string;
    name_en: string;
    feed_url: string;
    locale: string;
    scope: string;
    is_active: boolean;
};

export default function SourceForm({
    source,
    sectors,
    submitUrl,
    method,
    deleteUrl,
}: {
    source: SourceFormData | null;
    sectors: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        sector_id: source?.sector_id ? String(source.sector_id) : '',
        name_ar: source?.name_ar ?? '',
        name_en: source?.name_en ?? '',
        feed_url: source?.feed_url ?? '',
        locale: source?.locale ?? 'ar',
        scope: source?.scope ?? 'local',
        is_active: source ? (source.is_active ? '1' : '0') : '1',
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
            <Head title={t('sources')} />
            <RecordForm title={source ? t('edit') : t('create')} errors={form.errors} processing={form.processing} onSubmit={submit} cancelHref={`/${locale}/admin/sources`}>
                <TextField id="name_ar" label={t('nameAr')} value={form.data.name_ar} error={form.errors.name_ar} onChange={(value) => form.setData('name_ar', value)} required />
                <TextField id="name_en" label={t('nameEn')} value={form.data.name_en} error={form.errors.name_en} onChange={(value) => form.setData('name_en', value)} required />
                <TextField id="feed_url" label={t('feedUrl')} type="url" value={form.data.feed_url} error={form.errors.feed_url} onChange={(value) => form.setData('feed_url', value)} required />
                <SelectField id="locale" label={t('feedLanguage')} value={form.data.locale} error={form.errors.locale} onChange={(value) => form.setData('locale', value)} options={[{ value: 'ar', label: t('arabic') }, { value: 'en', label: t('english') }]} />
                <SelectField id="scope" label={t('scope')} value={form.data.scope} error={form.errors.scope} onChange={(value) => form.setData('scope', value)} options={[{ value: 'local', label: t('local') }, { value: 'international', label: t('international') }]} />
                <SelectField id="sector_id" label={t('sector')} value={form.data.sector_id} error={form.errors.sector_id} onChange={(value) => form.setData('sector_id', value)} options={[{ value: '', label: t('none') }, ...sectors.map((sector) => ({ value: String(sector.id), label: sector.name }))]} />
                <SelectField id="is_active" label={t('active')} value={form.data.is_active} error={form.errors.is_active} onChange={(value) => form.setData('is_active', value)} options={[{ value: '1', label: t('active') }, { value: '0', label: t('inactive') }]} />
            </RecordForm>
            {deleteUrl ? <div className="mt-6"><DeleteControl url={deleteUrl} /></div> : null}
        </>
    );
}
