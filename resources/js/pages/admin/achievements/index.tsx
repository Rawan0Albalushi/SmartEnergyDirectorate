import { Head } from '@inertiajs/react';
import {
    EditLink,
    Meta,
    PageIntro,
    PrimaryLink,
    RecordList,
    RecordRow,
    Visibility,
} from '@/components/admin/chrome';
import { Pager } from '@/components/public/pager';
import { useI18n } from '@/lib/i18n';
import type { PageMeta } from '@/types/content';

type Row = {
    id: number;
    title: string;
    year: number;
    isPublished: boolean;
    sector: string;
    editUrl: string;
};

export default function AchievementIndex({
    achievements,
    page,
}: {
    achievements: Row[];
    page: PageMeta;
}) {
    const { t, locale } = useI18n();

    return (
        <>
            <Head title={t('achievements')} />
            <PageIntro
                title={t('achievements')}
                action={
                    <PrimaryLink href={`/${locale}/admin/achievements/create`}>
                        {t('create')}
                    </PrimaryLink>
                }
            />
            <RecordList count={achievements.length} empty={t('emptyRecords')}>
                {achievements.map((item) => (
                    <RecordRow key={item.id}>
                        <span className="min-w-0">
                            <span className="block text-base font-medium">
                                {item.title}
                            </span>
                            <Meta
                                parts={[String(item.year), item.sector || null]}
                            />
                        </span>
                        <span className="flex items-center gap-4">
                            <Visibility
                                published={item.isPublished}
                                visible={t('visible')}
                                hidden={t('hidden')}
                            />
                            <EditLink href={item.editUrl}>{t('edit')}</EditLink>
                        </span>
                    </RecordRow>
                ))}
            </RecordList>
            <Pager page={page} />
        </>
    );
}
