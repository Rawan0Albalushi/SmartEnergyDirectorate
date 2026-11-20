import { Link } from '@inertiajs/react';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from 'react';
import { NewsCover } from '@/components/public/news-cover';
import { SectionHeading } from '@/components/public/section-heading';
import { useI18n } from '@/lib/i18n';
import type { NewsSummary } from '@/types/content';

const cardWidth = 22;
const gap = 1.25;

export function HomeDigest({ news }: { news: NewsSummary[] }) {
    const { t, locale, dir } = useI18n();

    return (
        <section
            className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-6 lg:py-14"
            aria-labelledby="home-news"
        >
            <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                    id="home-news"
                    title={t('newsHeading')}
                    lede={t('newsHomeLede')}
                />
                <Link
                    href={`/${locale}/news`}
                    className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-line bg-white ps-4 pe-1.5 text-sm text-ink"
                >
                    {t('allNews')}
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#e7f1ee] text-deep">
                        <ArrowLeft
                            className="size-4 ltr:scale-x-[-1]"
                            aria-hidden="true"
                        />
                    </span>
                </Link>
            </div>
            {news.length === 0 ? (
                <p className="mt-8 text-sm text-[#3E534C]">{t('emptyNews')}</p>
            ) : (
                <NewsStrip
                    news={news}
                    dir={dir}
                    label={t('newsHeading')}
                    previousLabel={t('previous')}
                    nextLabel={t('next')}
                />
            )}
        </section>
    );
}

function NewsStrip({
    news,
    dir,
    label,
    previousLabel,
    nextLabel,
}: {
    news: NewsSummary[];
    dir: 'rtl' | 'ltr';
    label: string;
    previousLabel: string;
    nextLabel: string;
}) {
    const frame = useRef<HTMLDivElement>(null);
    const dragged = useRef(false);
    const startX = useRef<number | null>(null);
    const pointerOver = useRef(false);
    const focusInside = useRef(false);
    const [width, setWidth] = useState(0);
    const [page, setPage] = useState(0);
    const [held, setHeld] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const node = frame.current;

        if (!node) {
            return;
        }

        const measure = () => setWidth(node.clientWidth);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(node);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const sync = () => setHidden(document.hidden);
        document.addEventListener('visibilitychange', sync);

        return () => document.removeEventListener('visibilitychange', sync);
    }, []);

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        const sync = () => setReduceMotion(media.matches);
        sync();
        media.addEventListener('change', sync);

        return () => media.removeEventListener('change', sync);
    }, []);

    function syncHold() {
        setHeld(pointerOver.current || focusInside.current);
    }

    const gapPx = gap * 16;
    const columns =
        width > 0 && width < 640 ? 1 : width > 0 && width < 1024 ? 2 : 3;
    const fitted =
        width === 0
            ? cardWidth * 16
            : (width - gapPx * (columns - 1)) / columns;
    const visible = columns;
    const pages = Math.max(1, Math.ceil(news.length / visible));
    const current = Math.min(page, pages - 1);
    const stride = visible * (fitted + gapPx);
    const maxShift = Math.max(
        0,
        news.length * fitted + (news.length - 1) * gapPx - width,
    );
    const shift = Math.min(current * stride, maxShift);
    const sign = dir === 'rtl' ? 1 : -1;
    const PreviousIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
    const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

    const loopPx = news.length * (fitted + gapPx);
    const marquee =
        news.length > 3 && width > 0 && loopPx > width && !reduceMotion;

    function go(next: number) {
        setPage(Math.min(Math.max(next, 0), pages - 1));
    }

    return (
        <div
            className="mt-8"
            onPointerEnter={() => {
                pointerOver.current = true;
                syncHold();
            }}
            onPointerLeave={(event) => {
                pointerOver.current = false;

                if (!event.currentTarget.contains(document.activeElement)) {
                    focusInside.current = false;
                }

                syncHold();
            }}
            onFocusCapture={() => {
                focusInside.current = true;
                syncHold();
            }}
            onBlurCapture={(event) => {
                const next = event.relatedTarget;

                if (
                    !(next instanceof Node) ||
                    !event.currentTarget.contains(next)
                ) {
                    focusInside.current = false;
                    syncHold();
                }
            }}
        >
            <div
                ref={frame}
                className="overflow-hidden"
                style={{ touchAction: 'pan-y' }}
                onPointerDown={(event) => {
                    if (marquee) {
                        return;
                    }

                    startX.current = event.clientX;
                }}
                onPointerUp={(event) => {
                    if (marquee || startX.current === null) {
                        return;
                    }

                    const delta = event.clientX - startX.current;
                    startX.current = null;

                    if (Math.abs(delta) < 48) {
                        return;
                    }

                    dragged.current = true;
                    const towardEnd = dir === 'rtl' ? delta > 0 : delta < 0;
                    go(current + (towardEnd ? 1 : -1));
                }}
                onClickCapture={(event) => {
                    if (!dragged.current) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();
                    dragged.current = false;
                }}
            >
                <ul
                    className={`flex ${marquee ? 'news-marquee' : 'transition-transform duration-700 ease-out motion-reduce:transition-none'}`}
                    style={
                        {
                            gap: `${gap}rem`,
                            '--news-loop': `${loopPx}px`,
                            animationDuration: marquee
                                ? `${loopPx / 64}s`
                                : undefined,
                            animationPlayState:
                                held || hidden ? 'paused' : 'running',
                            transform:
                                marquee || width === 0
                                    ? undefined
                                    : `translateX(${sign * shift}px)`,
                        } as CSSProperties
                    }
                >
                    {news.map((article) => (
                        <li
                            key={article.slug}
                            className="shrink-0"
                            style={{
                                width:
                                    width === 0
                                        ? `${cardWidth}rem`
                                        : `${fitted}px`,
                            }}
                        >
                            <NewsCover
                                article={article}
                                className="h-[21rem]"
                            />
                        </li>
                    ))}
                    {marquee
                        ? news.map((article) => (
                              <li
                                  key={`${article.slug}-loop`}
                                  className="shrink-0"
                                  aria-hidden="true"
                                  style={{ width: `${fitted}px` }}
                              >
                                  <NewsCover
                                      article={article}
                                      className="h-[21rem]"
                                      tabIndex={-1}
                                  />
                              </li>
                          ))
                        : null}
                </ul>
            </div>
            {!marquee && pages > 1 ? (
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                    <StripButton
                        label={previousLabel}
                        disabled={current === 0}
                        onClick={() => go(current - 1)}
                    >
                        <PreviousIcon className="size-4" aria-hidden="true" />
                    </StripButton>
                    <div
                        className="flex items-center gap-2"
                        role="group"
                        aria-label={label}
                    >
                        {Array.from({ length: pages }, (_, index) => (
                            <button
                                key={index}
                                type="button"
                                aria-current={
                                    index === current ? 'true' : undefined
                                }
                                aria-label={`${label} ${index + 1}`}
                                onClick={() => go(index)}
                                className="inline-flex size-11 items-center justify-center"
                            >
                                <span
                                    className={
                                        index === current
                                            ? 'size-3 rounded-full bg-deep'
                                            : 'size-3 rounded-full bg-[#c5d5cf]'
                                    }
                                />
                            </button>
                        ))}
                    </div>
                    <StripButton
                        label={nextLabel}
                        disabled={current === pages - 1}
                        onClick={() => go(current + 1)}
                    >
                        <NextIcon className="size-4" aria-hidden="true" />
                    </StripButton>
                </div>
            ) : null}
        </div>
    );
}

function StripButton({
    label,
    disabled,
    onClick,
    children,
}: {
    label: string;
    disabled: boolean;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
            className="inline-flex size-11 items-center justify-center rounded-full border-2 border-deep text-deep enabled:hover:bg-deep enabled:hover:text-white disabled:opacity-35"
        >
            {children}
        </button>
    );
}
