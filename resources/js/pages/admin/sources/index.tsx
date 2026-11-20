import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
} from '@/components/admin/chrome';
import { label, useI18n } from '@/lib/i18n';

type Row = {
    id: number;
    name: string;
    feedUrl: string;
    locale: string;
    scope: string;
    isActive: boolean;
    lastError: string | null;
    editUrl: string;
};

export default function SourceIndex({ sources }: { sources: Row[] }) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('sources')} />
            <PageIntro
                title={t('sources')}
                hint={t('sourcesIntro')}
                action={
                    <PrimaryLink href={`/${locale}/admin/sources/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <RecordList count={sources.length} empty={t('emptyRecords')}>
                {sources.map((source) => (
                    <RecordRow key={source.id}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {source.name}
                            </span>
                            <p className="mt-1 text-sm break-all text-[#3e534c]">
                                {source.feedUrl}
                            </p>
                            <Meta
                                parts={[
                                    source.locale,
                                    label(locale, source.scope),
                                    source.isActive
                                        ? t('active')
                                        : t('inactive'),
                                ]}
                            />
                            {source.lastError ? (
                                <p className="mt-1 text-sm text-[#9f2c22]">
                                    {source.lastError}
                                </p>
                            ) : null}
                        </span>
                        <EditLink href={source.editUrl}>{t('edit')}</EditLink>
                    </RecordRow>
                ))}
            </RecordList>
        </>
    );
}
