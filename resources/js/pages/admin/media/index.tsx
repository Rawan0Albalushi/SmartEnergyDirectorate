import { Head, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { RecordForm } from '@/components/admin/fields';
import { ImageField } from '@/components/admin/image-field';
import { useI18n } from '@/lib/i18n';

export default function SiteMedia({
    heroUrl,
    submitUrl,
}: {
    heroUrl: string | null;
    submitUrl: string;
}) {
    const { t, locale } = useI18n();
    const form = useForm({
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
        form.put(submitUrl, { forceFormData: true });
    }

    return (
        <>
            <Head title={t('siteImages')} />
            <RecordForm
                title={t('siteImages')}
                errors={form.errors}
                processing={form.processing}
                onSubmit={submit}
                cancelHref={`/${locale}/admin`}
            >
                <p className="text-sm leading-6 text-[#3e534c]">
                    {t('siteImagesHint')}
                </p>
                <ImageField
                    label={t('heroImage')}
                    hint={t('heroImageHint')}
                    currentUrl={heroUrl}
                    remove={form.data.remove_image}
                    error={form.errors.image}
                    onFile={(file) =>
                        form.setData({
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
