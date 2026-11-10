import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { DeleteControl, RecordForm, SelectField, TextField } from '@/components/admin/fields';
import { useI18n } from '@/lib/i18n';
import type { Option } from '@/types/content';

type StaffFormData = {
    department_id: number;
    name_ar: string;
    name_en: string;
    title_ar: string;
    title_en: string;
    email: string | null;
    is_published: boolean;
    sort_order: number;
};

export default function StaffForm({
    member,
    departments,
    submitUrl,
    method,
    deleteUrl,
}: {
    member: StaffFormData | null;
    departments: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        department_id: String(member?.department_id ?? departments[0]?.id ?? ''),
        name_ar: member?.name_ar ?? '',
        name_en: member?.name_en ?? '',
        title_ar: member?.title_ar ?? '',
        title_en: member?.title_en ?? '',
        email: member?.email ?? '',
        is_published: member ? (member.is_published ? '1' : '0') : '1',
        sort_order: String(member?.sort_order ?? 0),
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
            <Head title={t('staff')} />
            <RecordForm title={member ? t('edit') : t('create')} errors={form.errors} processing={form.processing} onSubmit={submit} cancelHref={`/${locale}/admin/staff`}>
                <SelectField id="department_id" label={t('department')} value={form.data.department_id} error={form.errors.department_id} onChange={(value) => form.setData('department_id', value)} options={departments.map((department) => ({ value: String(department.id), label: department.name }))} />
                <TextField id="name_ar" label={t('nameAr')} value={form.data.name_ar} error={form.errors.name_ar} onChange={(value) => form.setData('name_ar', value)} required />
                <TextField id="name_en" label={t('nameEn')} value={form.data.name_en} error={form.errors.name_en} onChange={(value) => form.setData('name_en', value)} required />
                <TextField id="title_ar" label={t('jobTitleAr')} value={form.data.title_ar} error={form.errors.title_ar} onChange={(value) => form.setData('title_ar', value)} required />
                <TextField id="title_en" label={t('jobTitleEn')} value={form.data.title_en} error={form.errors.title_en} onChange={(value) => form.setData('title_en', value)} required />
                <TextField id="email" label={t('email')} type="email" value={form.data.email} error={form.errors.email} onChange={(value) => form.setData('email', value)} />
                <SelectField id="is_published" label={t('visibility')} value={form.data.is_published} error={form.errors.is_published} onChange={(value) => form.setData('is_published', value)} options={[{ value: '1', label: t('visible') }, { value: '0', label: t('hidden') }]} />
                <TextField id="sort_order" label={t('sortOrder')} type="number" value={form.data.sort_order} error={form.errors.sort_order} onChange={(value) => form.setData('sort_order', value)} />
            </RecordForm>
            {deleteUrl ? <div className="mt-6"><DeleteControl url={deleteUrl} /></div> : null}
        </>
    );
}
