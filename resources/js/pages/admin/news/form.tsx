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
import type { Option } from '@/types/content';

type ArticleFormData = {
    sector_id: number | null;
    title_ar: string | null;
    title_en: string | null;
    summary_ar: string | null;
    summary_en: string | null;
    body_ar: string | null;
    body_en: string | null;
    scope: string;
    status: string;
    source_name: string | null;
    original_url: string | null;
    published_at: string | null;
    origin?: string;
    image_url?: string | null;
};

export default function NewsForm({
    article,
    sectors,
    submitUrl,
    method,
    deleteUrl,
}: {
    article: ArticleFormData | null;
    sectors: Option[];
    submitUrl: string;
    method: 'post' | 'put';
    deleteUrl?: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
        sector_id: article?.sector_id ? String(article.sector_id) : '',
        title_ar: article?.title_ar ?? '',
        title_en: article?.title_en ?? '',
        summary_ar: article?.summary_ar ?? '',
        summary_en: article?.summary_en ?? '',
        body_ar: article?.body_ar ?? '',
        body_en: article?.body_en ?? '',
        scope: article?.scope ?? 'local',
        status: article?.status ?? 'pending',
        source_name: article?.source_name ?? '',
        original_url: article?.original_url ?? '',
        published_at: article?.published_at ?? '',
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
            <Head title={t('news')} />
            <RecordForm
                title={article ? t('edit') : t('create')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin/news`}
                deleteUrl={deleteUrl}
            >
                <p className="text-sm leading-6 text-[#3e534c]">
                    {t('newsHint')}
                </p>
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
                    />
                    <TextField
                        id="title_en"
                        label={t('titleEn')}
                        value={form.data.title_en}
                        error={form.errors.title_en}
                        onChange={(value) => form.setData('title_en', value)}
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
                <FieldPair>
                    <SelectField
                        id="scope"
                        label={t('scope')}
                        value={form.data.scope}
                        error={form.errors.scope}
                        onChange={(value) => form.setData('scope', value)}
                        options={[
                            { value: 'local', label: t('local') },
                            {
                                value: 'international',
                                label: t('international'),
                            },
                        ]}
                    />
                    <SelectField
                        id="status"
                        label={t('status')}
                        value={form.data.status}
                        error={form.errors.status}
                        onChange={(value) => form.setData('status', value)}
                        options={[
                            { value: 'pending', label: t('pending') },
                            { value: 'published', label: t('published') },
                            { value: 'rejected', label: t('rejected') },
                        ]}
                    />
                </FieldPair>
                <TextField
                    id="source_name"
                    label={t('sourceName')}
                    value={form.data.source_name}
                    error={form.errors.source_name}
                    onChange={(value) => form.setData('source_name', value)}
                />
                <FieldPair>
                    <TextField
                        id="original_url"
                        label={t('originalUrl')}
                        type="url"
                        value={form.data.original_url}
                        error={form.errors.original_url}
                        onChange={(value) =>
                            form.setData('original_url', value)
                        }
                    />
                    <TextField
                        id="published_at"
                        label={t('publishedAt')}
                        type="datetime-local"
                        value={form.data.published_at}
                        error={form.errors.published_at}
                        onChange={(value) =>
                            form.setData('published_at', value)
                        }
                    />
                </FieldPair>
                <ImageField
                    label={t('photo')}
                    hint={t('imageHint')}
                    currentUrl={article?.image_url}
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
