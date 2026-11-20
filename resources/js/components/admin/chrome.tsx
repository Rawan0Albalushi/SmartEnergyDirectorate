import { Link, useForm } from '@inertiajs/react';
import type { ReactNode } from 'react';

export const primaryButtonClass =
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] bg-deep px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#164840] disabled:cursor-not-allowed disabled:opacity-60';

export const quietButtonClass =
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] border border-line bg-white px-3 text-sm text-ink transition-colors duration-150 hover:bg-[#f4f7f5] disabled:cursor-not-allowed disabled:opacity-60';

export function StatCards({
    items,
}: {
    items: Array<{
        key: string;
        href: string;
        label: string;
        value: number;
        icon: ReactNode;
        attention?: boolean;
    }>;
}) {
    return (
        <ul className="mt-6 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
            {items.map((item) => (
                <li key={item.key} className="min-w-0">
                    <Link
                        href={item.href}
                        className={
                            item.attention
                                ? 'flex h-full flex-col rounded-[8px] border border-line border-s-[3px] border-s-filament bg-white px-4 py-4 transition-colors duration-150 hover:bg-[#fdf8f4]'
                                : 'flex h-full flex-col rounded-[8px] border border-line bg-white px-4 py-4 transition-colors duration-150 hover:border-[#b7d4cc] hover:bg-[#f6faf8]'
                        }
                    >
                        <span className="flex items-center justify-between gap-3">
                            <span className="text-sm leading-5 text-[#3e534c]">
                                {item.label}
                            </span>
                            <span
                                className={
                                    item.attention
                                        ? 'grid size-9 shrink-0 place-items-center rounded-[6px] bg-[#f8efe6] text-filament'
                                        : 'grid size-9 shrink-0 place-items-center rounded-[6px] bg-[#e7f1ee] text-sea'
                                }
                            >
                                {item.icon}
                            </span>
                        </span>
                        <span
                            className={
                                item.attention
                                    ? 'mt-5 text-[1.75rem] leading-none font-medium tracking-[-0.03em] text-filament tabular-nums'
                                    : 'mt-5 text-[1.75rem] leading-none font-medium tracking-[-0.03em] text-ink tabular-nums'
                            }
                        >
                            {item.value}
                        </span>
                    </Link>
                </li>
            ))}
        </ul>
    );
}

export function PageIntro({
    title,
    hint,
    action,
}: {
    title: string;
    hint?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl min-w-0">
                <h1 className="text-[1.75rem] leading-tight font-medium tracking-[-0.02em] text-ink">
                    {title}
                </h1>
                {hint ? (
                    <p className="mt-2 max-w-[65ch] text-sm leading-6 text-[#3e534c]">
                        {hint}
                    </p>
                ) : null}
            </div>
            {action}
        </div>
    );
}

export function PrimaryLink({
    href,
    children,
}: {
    href: string;
    children: string;
}) {
    return (
        <Link href={href} className={primaryButtonClass}>
            {children}
        </Link>
    );
}

export function RecordList({
    count,
    empty,
    children,
}: {
    count: number;
    empty: string;
    children: ReactNode;
}) {
    if (count === 0) {
        return (
            <p className="mt-6 rounded-[8px] border border-line bg-white px-5 py-10 text-sm text-[#3e534c]">
                {empty}
            </p>
        );
    }

    return (
        <ul className="mt-6 overflow-hidden rounded-[8px] border border-line bg-white">
            {children}
        </ul>
    );
}

export function RecordRow({ children }: { children: ReactNode }) {
    return (
        <li className="flex flex-col gap-3 border-b border-line px-4 py-4 transition-colors duration-150 last:border-b-0 hover:bg-[#f6faf8] sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {children}
        </li>
    );
}

export function Meta({
    parts,
}: {
    parts: Array<string | null | undefined | false>;
}) {
    const items = parts.filter((part): part is string => Boolean(part));

    return (
        <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm leading-6 text-[#3e534c]">
            {items.map((item, index) => (
                <span key={`${item}-${index}`}>{item}</span>
            ))}
        </p>
    );
}

export function EditLink({
    href,
    children,
}: {
    href: string;
    children: string;
}) {
    return (
        <Link
            href={href}
            className="inline-flex min-h-11 shrink-0 items-center text-sm font-medium text-sea underline-offset-4 hover:underline"
        >
            {children}
        </Link>
    );
}

export function Visibility({
    published,
    visible,
    hidden,
}: {
    published: boolean;
    visible: string;
    hidden: string;
}) {
    return (
        <span
            className={
                published ? 'text-sm text-sea' : 'text-sm text-[#3e534c]'
            }
        >
            {published ? visible : hidden}
        </span>
    );
}

export function FilterLink({
    href,
    current,
    children,
}: {
    href: string;
    current: boolean;
    children: string;
}) {
    return (
        <Link
            href={href}
            aria-current={current ? 'page' : undefined}
            className={
                current
                    ? 'inline-flex min-h-11 items-center rounded-[6px] bg-deep px-3 text-sm text-white'
                    : 'inline-flex min-h-11 items-center rounded-[6px] px-3 text-sm text-ink transition-colors duration-150 hover:bg-[#e7eeea]'
            }
        >
            {children}
        </Link>
    );
}

export function CommandButton({
    href,
    method,
    tone = 'quiet',
    children,
}: {
    href: string;
    method: 'post' | 'delete';
    tone?: 'quiet' | 'danger';
    children: string;
}) {
    const form = useForm({});
    const className =
        tone === 'danger'
            ? 'inline-flex min-h-11 cursor-pointer items-center rounded-[6px] border border-[#e7c6c2] bg-white px-3 text-sm text-[#9f2c22] transition-colors duration-150 hover:bg-[#fdf6f5] disabled:cursor-not-allowed disabled:opacity-60'
            : quietButtonClass;

    return (
        <button
            type="button"
            disabled={form.processing}
            className={className}
            onClick={() =>
                method === 'post'
                    ? form.post(href, { preserveScroll: true })
                    : form.delete(href, { preserveScroll: true })
            }
        >
            {children}
        </button>
    );
}
