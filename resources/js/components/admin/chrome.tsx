import { Link, useForm } from '@inertiajs/react';
import { Check, Eye, Pencil, X } from 'lucide-react';
import type { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export const primaryButtonClass =
    'inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[6px] bg-deep px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#164840] disabled:cursor-not-allowed disabled:opacity-60';

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
                                ? 'flex h-full flex-col rounded-[8px] border border-s-[3px] border-line border-s-filament bg-white px-4 py-4 transition-colors duration-150 hover:bg-[#fdf8f4]'
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

export function DataTable({
    label,
    columns,
    count,
    empty,
    children,
}: {
    label: string;
    columns: Array<{ key: string; label: string; align?: 'start' | 'end' }>;
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
        <div className="mt-6 overflow-x-auto rounded-[8px] border border-line bg-white">
            <table className="w-full min-w-[48rem] border-collapse text-sm">
                <caption className="sr-only">{label}</caption>
                <thead>
                    <tr className="border-b border-line bg-[#f6faf8] text-[#3e534c]">
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                scope="col"
                                className={
                                    column.align === 'end'
                                        ? 'px-3 py-3 text-end text-sm font-medium whitespace-nowrap'
                                        : 'px-4 py-3 text-start text-sm font-medium whitespace-nowrap'
                                }
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

export function DataRow({ children }: { children: ReactNode }) {
    return (
        <tr className="group border-b border-line transition-colors duration-150 last:border-b-0 hover:bg-[#f6faf8]">
            {children}
        </tr>
    );
}

export function PhotoCell({ src }: { src: string | null }) {
    return (
        <td className="w-20 px-4 py-2 align-middle">
            {src ? (
                <img
                    src={src}
                    alt=""
                    className="h-12 w-16 rounded-[6px] object-cover"
                />
            ) : (
                <span
                    className="block h-12 w-16 rounded-[6px] bg-[#f6faf8]"
                    aria-hidden="true"
                />
            )}
        </td>
    );
}

export function DataCell({
    children,
    primary = false,
    numeric = false,
    wrap = false,
}: {
    children: ReactNode;
    primary?: boolean;
    numeric?: boolean;
    wrap?: boolean;
}) {
    const wrapping = primary || wrap;

    return (
        <td
            className={
                primary
                    ? 'px-4 py-3.5 text-start align-middle text-sm font-medium break-words text-ink'
                    : numeric
                      ? 'px-4 py-3.5 text-start align-middle text-sm whitespace-nowrap text-ink tabular-nums'
                      : wrapping
                        ? 'px-4 py-3.5 text-start align-middle text-sm break-words text-ink'
                        : 'px-4 py-3.5 text-start align-middle text-sm whitespace-nowrap text-ink'
            }
        >
            {children}
        </td>
    );
}

export function ActionCell({ children }: { children: ReactNode }) {
    return (
        <td className="px-2 py-1.5 text-end align-middle whitespace-nowrap">
            <div className="flex items-center justify-end">{children}</div>
        </td>
    );
}

export function StatusText({
    on,
    onLabel,
    offLabel,
}: {
    on: boolean;
    onLabel: string;
    offLabel: string;
}) {
    return (
        <span
            className={
                on
                    ? 'inline-flex items-center gap-2 whitespace-nowrap text-sea'
                    : 'inline-flex items-center gap-2 whitespace-nowrap text-[#3e534c]'
            }
        >
            <span
                className={
                    on
                        ? 'size-1.5 shrink-0 rounded-full bg-sea'
                        : 'size-1.5 shrink-0 rounded-full bg-[#9aaba4]'
                }
                aria-hidden="true"
            />
            {on ? onLabel : offLabel}
        </span>
    );
}

const rowIcons = {
    view: Eye,
    edit: Pencil,
    publish: Check,
    reject: X,
} as const;

const defaultActionClass =
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-sea transition-colors duration-150 hover:bg-[#e7f1ee] disabled:cursor-not-allowed disabled:opacity-60';

const dangerActionClass =
    'inline-flex size-11 cursor-pointer items-center justify-center rounded-[6px] text-[#9f2c22] transition-colors duration-150 hover:bg-[#fdf6f5] disabled:cursor-not-allowed disabled:opacity-60';

export function RowAction({
    kind,
    label,
    href,
    method = 'post',
}: {
    kind: 'view' | 'edit' | 'publish' | 'reject';
    label: string;
    href: string;
    method?: 'post' | 'delete';
}) {
    if (kind === 'view' || kind === 'edit') {
        return (
            <ActionTip label={label}>
                <Link
                    href={href}
                    aria-label={label}
                    className={defaultActionClass}
                >
                    <ActionIcon kind={kind} />
                </Link>
            </ActionTip>
        );
    }

    return (
        <CommandAction href={href} method={method} label={label} kind={kind} />
    );
}

function CommandAction({
    href,
    method,
    label,
    kind,
}: {
    href: string;
    method: 'post' | 'delete';
    label: string;
    kind: 'publish' | 'reject';
}) {
    const form = useForm({});

    return (
        <ActionTip label={label}>
            <button
                type="button"
                aria-label={label}
                disabled={form.processing}
                className={
                    kind === 'reject' ? dangerActionClass : defaultActionClass
                }
                onClick={() =>
                    method === 'post'
                        ? form.post(href, { preserveScroll: true })
                        : form.delete(href, { preserveScroll: true })
                }
            >
                <ActionIcon kind={kind} />
            </button>
        </ActionTip>
    );
}

function ActionTip({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent className="text-sm">{label}</TooltipContent>
        </Tooltip>
    );
}

function ActionIcon({
    kind,
}: {
    kind: 'view' | 'edit' | 'publish' | 'reject';
}) {
    const Icon = rowIcons[kind];

    return (
        <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
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
