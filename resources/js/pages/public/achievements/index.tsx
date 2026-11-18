import { Head } from '@inertiajs/react';
import { useLayoutEffect, useRef } from 'react';
import { SectorGlyph } from '@/components/public/entry';
import { PageBody } from '@/components/public/frame';
import { PageIntro } from '@/components/public/page-intro';
import { Pager } from '@/components/public/pager';
import { fieldPlate, horizon } from '@/lib/fields';
import { useI18n } from '@/lib/i18n';
import type { AchievementItem, PageMeta } from '@/types/content';

export default function AchievementsIndex({
    achievements,
    page,
}: {
    achievements: AchievementItem[];
    page: PageMeta;
}) {
    const { t } = useI18n();
    const years = groupByYear(achievements);
    const chronicleRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const root = chronicleRef.current;

        if (!root) {
            return;
        }

        const rail = root.querySelector<HTMLElement>('.chronicle-rail');

        const fit = () => {
            if (!rail) {
                return;
            }

            const nodes = root.querySelectorAll<HTMLElement>('.chronicle-node');
            const first = nodes[0];
            const last = nodes[nodes.length - 1];

            if (!first || !last) {
                return;
            }

            const rootBox = root.getBoundingClientRect();
            const firstBox = first.getBoundingClientRect();
            const lastBox = last.getBoundingClientRect();
            const start = firstBox.top + firstBox.height / 2 - rootBox.top;
            const end = lastBox.top + lastBox.height / 2 - rootBox.top;

            rail.style.top = `${start}px`;
            rail.style.height = `${Math.max(end - start, 0)}px`;
            rail.style.bottom = 'auto';
        };

        fit();

        const draw = rail.querySelector<HTMLElement>('.chronicle-rail__draw');

        if (draw) {
            draw.style.animation = 'none';
            void draw.offsetWidth;
            draw.style.animation = '';
        }

        const observer = new ResizeObserver(fit);
        observer.observe(root);
        window.addEventListener('resize', fit);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', fit);
        };
    }, [achievements]);

    return (
        <>
            <Head title={t('achievements')} />
            <PageIntro title={t('achievements')} lede={t('achievementsIntro')} />
            <PageBody>
                {achievements.length === 0 ? <p className="text-sm text-[#3E534C]">{t('emptyAchievements')}</p> : null}

                {years.length > 0 ? (
                    <div className="chronicle" ref={chronicleRef}>
                        <div className="chronicle-rail" aria-hidden="true">
                            <span className="chronicle-rail__draw" />
                        </div>
                        {years.map((group) => (
                            <section key={group.year} className="chronicle-year" aria-labelledby={`achievements-${group.year}`}>
                                <ol className="chronicle-list">
                                    {group.items.map((item, index) => (
                                        <li key={item.id}>
                                            <article className="chronicle-entry">
                                                <div className="chronicle-side">
                                                    {index === 0 ? (
                                                        <h2 id={`achievements-${group.year}`} className="chronicle-year__label">
                                                            <time dateTime={String(group.year)}>{group.year}</time>
                                                        </h2>
                                                    ) : null}
                                                    <span className="chronicle-photo">
                                                        <AchievementPhoto item={item} />
                                                    </span>
                                                </div>
                                                <div className="chronicle-copy">
                                                    <span className="chronicle-node" aria-hidden="true" />
                                                    <h3 className="chronicle-title">{item.title}</h3>
                                                    <p className="chronicle-summary">{item.summary}</p>
                                                    {item.sector ? (
                                                        <p className="chronicle-sector">
                                                            <SectorGlyph slug={item.sector.slug} className="size-4" />
                                                            {item.sector.name}
                                                        </p>
                                                    ) : null}
                                                </div>
                                            </article>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        ))}
                    </div>
                ) : null}

                <Pager page={page} />
            </PageBody>
        </>
    );
}

function groupByYear(achievements: AchievementItem[]) {
    const groups: { year: number; items: AchievementItem[] }[] = [];

    for (const item of achievements) {
        const current = groups[groups.length - 1];

        if (current?.year === item.year) {
            current.items.push(item);
        } else {
            groups.push({ year: item.year, items: [item] });
        }
    }

    return groups;
}

function AchievementPhoto({ item }: { item: AchievementItem }) {
    const plate = fieldPlate(item.sector?.slug);

    return (
        <img
            src={plate?.src ?? horizon.src}
            alt=""
            width={1200}
            height={900}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
        />
    );
}
