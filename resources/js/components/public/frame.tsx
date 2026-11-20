import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export function PageBody({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-6 lg:py-10">
            {children}
        </div>
    );
}

export function SectionTitle({
    id,
    children,
    className = '',
}: {
    id?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <h2
            id={id}
            className={`flex items-center gap-2 text-2xl font-medium text-deep ${className}`}
        >
            <span
                className="h-6 w-1 shrink-0 rounded-full bg-deep"
                aria-hidden="true"
            />
            {children}
        </h2>
    );
}

export function Sheet({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-line bg-white ${className}`}
        >
            {children}
        </div>
    );
}

export function FilterPill({
    href,
    current,
    children,
}: {
    href: string;
    current: boolean;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={
                current
                    ? 'inline-flex min-h-11 items-center gap-1.5 rounded-full bg-deep px-3 text-sm text-white'
                    : 'inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-3 text-sm text-ink hover:bg-[#f4f7f5]'
            }
        >
            {children}
        </Link>
    );
}

export function ForwardLink({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-deep ps-4 pe-1.5 text-sm text-white"
        >
            {children}
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15">
                <ArrowLeft
                    className="size-4 ltr:scale-x-[-1]"
                    aria-hidden="true"
                />
            </span>
        </Link>
    );
}
