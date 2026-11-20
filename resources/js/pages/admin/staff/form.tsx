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
import { submitWithFiles } from '@/lib/submit-files';
import type { Option } from '@/types/content';

type StaffFormData = {
    department_id: number;
    roster: string;
    name_ar: string;
    name_en: string;
    title_ar: string;
    title_en: string;
    bio_ar: string;
    bio_en: string;
    email: string | null;
    photo_url: string | null;
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
        department_id: String(
            member?.department_id ?? departments[0]?.id ?? '',
        ),
        roster: member?.roster ?? 'staff',
        name_ar: member?.name_ar ?? '',
        name_en: member?.name_en ?? '',
        title_ar: member?.title_ar ?? '',
        title_en: member?.title_en ?? '',
        bio_ar: member?.bio_ar ?? '',
        bio_en: member?.bio_en ?? '',
        email: member?.email ?? '',
        photo: null as File | null,
        remove_photo: false,
        is_published: member ? (member.is_published ? '1' : '0') : '1',
        sort_order: String(member?.sort_order ?? 0),
    });

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitWithFiles(form, submitUrl, method, (data) => ({
            ...data,
            photo: data.photo ?? '',
            remove_photo: data.remove_photo ? '1' : '0',
        }));
    }

    return (
        <>
            <Head title={t('staff')} />
            <RecordForm
                title={member ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/staff`}
                deleteUrl={deleteUrl}
            >
                <FieldPair>
                    <SelectField
                        id="department_id"
                        label={t('department')}
                        value={form.data.department_id}
                        error={form.errors.department_id}
                        onChange={(value) =>
                            form.setData('department_id', value)
                        }
                        options={departments.map((department) => ({
                            value: String(department.id),
                            label: department.name,
                        }))}
                    />
                    <SelectField
                        id="roster"
                        label={t('roster')}
                        value={form.data.roster}
                        error={form.errors.roster}
                        onChange={(value) => form.setData('roster', value)}
                        options={[
                            { value: 'staff', label: t('staff') },
                            { value: 'board', label: t('board') },
                        ]}
                    />
                </FieldPair>
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
                        id="title_ar"
                        label={t('jobTitleAr')}
                        value={form.data.title_ar}
                        error={form.errors.title_ar}
                        onChange={(value) => form.setData('title_ar', value)}
                        required
                    />
                    <TextField
                        id="title_en"
                        label={t('jobTitleEn')}
                        value={form.data.title_en}
                        error={form.errors.title_en}
                        onChange={(value) => form.setData('title_en', value)}
                        required
                    />
                </FieldPair>
                <FieldPair>
                    <AreaField
                        id="bio_ar"
                        label={t('bioAr')}
                        value={form.data.bio_ar}
                        error={form.errors.bio_ar}
                        onChange={(value) => form.setData('bio_ar', value)}
                    />
                    <AreaField
                        id="bio_en"
                        label={t('bioEn')}
                        value={form.data.bio_en}
                        error={form.errors.bio_en}
                        onChange={(value) => form.setData('bio_en', value)}
                    />
                </FieldPair>
                <TextField
                    id="email"
                    label={t('email')}
                    type="email"
                    value={form.data.email}
                    error={form.errors.email}
                    onChange={(value) => form.setData('email', value)}
                />
                <div className="grid gap-2">
                    <label htmlFor="photo" className="text-sm font-medium">
                        {t('photo')}
                    </label>
                    {member?.photo_url && !form.data.remove_photo ? (
                        <img
                            src={member.photo_url}
                            alt=""
                            className="h-32 w-24 rounded-[6px] object-cover object-top"
                        />
                    ) : null}
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        aria-invalid={form.errors.photo ? true : undefined}
                        aria-describedby={
                            form.errors.photo ? 'photo-error' : undefined
                        }
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            form.setData({
                                ...form.data,
                                photo: file,
                                remove_photo: file
                                    ? false
                                    : form.data.remove_photo,
                            });
                        }}
                        className="block w-full text-sm file:me-3 file:inline-flex file:min-h-11 file:cursor-pointer file:items-center file:rounded-[6px] file:border-0 file:bg-[#e7f1ee] file:px-4 file:text-sm file:font-medium file:text-deep"
                    />
                    {form.errors.photo ? (
                        <p id="photo-error" className="text-sm text-[#9f2c22]">
                            {form.errors.photo}
                        </p>
                    ) : null}
                    {member?.photo_url ? (
                        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                className="size-4"
                                checked={form.data.remove_photo}
                                onChange={(event) =>
                                    form.setData(
                                        'remove_photo',
                                        event.target.checked,
                                    )
                                }
                            />
                            {t('removePhoto')}
                        </label>
                    ) : null}
                </div>
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
