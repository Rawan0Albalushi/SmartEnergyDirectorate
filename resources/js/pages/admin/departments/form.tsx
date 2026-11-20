import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import {
    AreaField,
    FieldPair,
    RecordForm,
    TextField,
} from '@/components/admin/fields';
import { ImageField } from '@/components/admin/image-field';
import { useI18n } from '@/lib/i18n';

type DepartmentFormData = {
    name_ar: string;
    name_en: string;
    summary_ar: string;
    summary_en: string;
    mandate_ar: string | null;
    mandate_en: string | null;
    email: string | null;
    phone: string | null;
    sort_order: number;
    image_url?: string | null;
};

export default function DepartmentForm({
    department,
    submitUrl,
    method,
    deleteUrl,
}: {
    department: DepartmentFormData | null;
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        name_ar: department?.name_ar ?? '',
        name_en: department?.name_en ?? '',
        summary_ar: department?.summary_ar ?? '',
        summary_en: department?.summary_en ?? '',
        mandate_ar: department?.mandate_ar ?? '',
        mandate_en: department?.mandate_en ?? '',
        email: department?.email ?? '',
        phone: department?.phone ?? '',
        sort_order: String(department?.sort_order ?? 0),
        image: null as File | null,
        remove_image: false,
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            image: data.image ?? '',
            remove_image: data.remove_image ? '1' : '0',
        }));
        const options = { forceFormData: true };

        if (method === 'post') {
            form.post(submitUrl, options);
        } else {
            form.put(submitUrl, options);
        }
    }

    return (
        <>
            <Head title={t('departments')} />
            <RecordForm
                title={department ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/departments`}
                deleteUrl={deleteUrl}
            >
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
                <FieldPair>
                    <TextField
                        id="summary_ar"
                        label={t('summaryAr')}
                        value={form.data.summary_ar}
                        error={form.errors.summary_ar}
                        onChange={(value) => form.setData('summary_ar', value)}
                        required
                    />
                    <TextField
                        id="summary_en"
                        label={t('summaryEn')}
                        value={form.data.summary_en}
                        error={form.errors.summary_en}
                        onChange={(value) => form.setData('summary_en', value)}
                        required
                    />
                </FieldPair>
                <FieldPair>
                    <AreaField
                        id="mandate_ar"
                        label={t('mandateAr')}
                        value={form.data.mandate_ar}
                        error={form.errors.mandate_ar}
                        onChange={(value) => form.setData('mandate_ar', value)}
                    />
                    <AreaField
                        id="mandate_en"
                        label={t('mandateEn')}
                        value={form.data.mandate_en}
                        error={form.errors.mandate_en}
                        onChange={(value) => form.setData('mandate_en', value)}
                    />
                </FieldPair>
                <FieldPair>
                    <TextField
                        id="email"
                        label={t('email')}
                        type="email"
                        value={form.data.email}
                        error={form.errors.email}
                        onChange={(value) => form.setData('email', value)}
                    />
                    <TextField
                        id="phone"
                        label={t('phone')}
                        value={form.data.phone}
                        error={form.errors.phone}
                        onChange={(value) => form.setData('phone', value)}
                    />
                </FieldPair>
                <ImageField
                    label={t('photo')}
                    hint={t('imageHint')}
                    currentUrl={department?.image_url}
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
                <TextField
                    id="sort_order"
                    label={t('sortOrder')}
                    type="number"
                    value={form.data.sort_order}
                    error={form.errors.sort_order}
                    onChange={(value) => form.setData('sort_order', value)}
                />
            </RecordForm>
        </>
    );
}
