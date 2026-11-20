import { cn } from '@/lib/utils';

/** Shared heading for the home page sections, mirroring the accent bar used by `PageIntro`. */
export function SectionHeading({
    id,
    title,
    lede,
    tone = 'light',
}: {
    id: string;
    title: string;
    lede?: string;
    tone?: 'light' | 'dark';
}) {
    const dark = tone === 'dark';

    return (
        <div className="max-w-2xl">
            <h2
                id={id}
                className={cn(
                    'flex items-start gap-3 text-3xl font-medium text-balance sm:text-4xl',
                    dark ? 'text-[#F4F7F5]' : 'text-deep',
                )}
            >
                <span
                    className={cn(
                        'mt-1.5 h-7 w-1 shrink-0 rounded-full',
                        dark ? 'bg-measure' : 'bg-deep',
                    )}
                    aria-hidden="true"
                />
                <span>{title}</span>
            </h2>
            {lede ? (
                <p
                    className={cn(
                        'ms-4 mt-3 max-w-xl text-base leading-7',
                        dark ? 'text-[#D5E6E1]' : 'text-[#3E534C]',
                    )}
                >
                    {lede}
                </p>
            ) : null}
        </div>
    );
}
