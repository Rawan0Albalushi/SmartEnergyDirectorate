import type { ReactNode } from 'react';

export function PageIntro({ title, lede, children }: { title: string; lede?: string; children?: ReactNode }) {
    return (
        <header className="page-hero overflow-hidden rounded-b-[2.75rem] text-[#F4F7F5] sm:rounded-b-[3.5rem]">
            <div className="mx-auto max-w-[90rem] px-4 pt-32 pb-10 sm:px-6 sm:pt-36 sm:pb-14 lg:px-6">
                <h1 className="flex max-w-4xl items-start gap-3 text-3xl font-medium text-balance sm:text-4xl">
                    <span className="mt-1.5 h-7 w-1 shrink-0 rounded-full bg-measure" aria-hidden="true" />
                    <span>{title}</span>
                </h1>
                {lede ? (
                    <p className="ms-4 mt-3 max-w-2xl text-sm leading-7 text-[#D5E6E1] sm:text-base sm:leading-8">{lede}</p>
                ) : null}
                {children ? <div className="ms-4 mt-5 flex flex-wrap items-center gap-2">{children}</div> : null}
            </div>
        </header>
    );
}

export function BandChip({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-xs text-[#F4F7F5] ring-1 ring-white/30">
            {children}
        </span>
    );
}
