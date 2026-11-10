import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';

export const fieldClass =
    'min-h-11 w-full border border-line bg-white px-3 text-base text-ink outline-none';

export function TextField({
    id,
    label,
    value,
    error,
    onChange,
    type = 'text',
    required = false,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(event.target.value)}
                className={fieldClass}
            />
            {error ? (
                <p id={`${id}-error`} className="text-sm text-[#B42318]">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function AreaField({
    id,
    label,
    value,
    error,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <textarea
                id={id}
                name={id}
                value={value}
                rows={5}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(event.target.value)}
                className="w-full border border-line bg-white px-3 py-2 text-base text-ink outline-none"
            />
            {error ? (
                <p id={`${id}-error`} className="text-sm text-[#B42318]">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function SelectField({
    id,
    label,
    value,
    error,
    onChange,
    options,
}: {
    id: string;
    label: string;
    value: string;
    error?: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="grid gap-2">
            <label htmlFor={id} className="text-sm font-medium">
                {label}
            </label>
            <select
                id={id}
                name={id}
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(event.target.value)}
                className={fieldClass}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error ? (
                <p id={`${id}-error`} className="text-sm text-[#B42318]">
                    {error}
                </p>
            ) : null}
        </div>
    );
}

export function RecordForm({
    title,
    errors,
    processing,
    onSubmit,
    cancelHref,
    children,
}: {
    title: string;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    cancelHref: string;
    children: ReactNode;
}) {
    const { t } = useI18n();
    const summary = useRef<HTMLDivElement>(null);
    const errorKey = Object.keys(errors).join('|');

    useEffect(() => {
        if (errorKey) {
            summary.current?.focus();
        }
    }, [errorKey]);

    const messages = Object.entries(errors).filter((entry): entry is [string, string] => Boolean(entry[1]));

    return (
        <form onSubmit={onSubmit} className="grid max-w-3xl gap-5">
            <h1 className="text-2xl font-medium">{title}</h1>
            {messages.length > 0 ? (
                <div ref={summary} tabIndex={-1} role="alert" className="border border-[#B42318] bg-white p-4">
                    <h2 className="font-medium">{t('problem')}</h2>
                    <ul className="mt-2 list-disc ps-5 text-sm">
                        {messages.map(([field, message]) => (
                            <li key={field}>
                                <a href={`#${field}`} className="underline">
                                    {message}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}
            {children}
            <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={processing} className="inline-flex min-h-11 items-center bg-deep px-4 text-sm text-white disabled:opacity-60">
                    {processing ? t('saving') : t('save')}
                </button>
                <Link href={cancelHref} className="inline-flex min-h-11 items-center px-3 text-sm underline">
                    {t('cancel')}
                </Link>
            </div>
        </form>
    );
}

export function DeleteControl({ url }: { url: string }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);

    if (!open) {
        return (
            <button type="button" className="text-sm text-[#B42318] underline" onClick={() => setOpen(true)}>
                {t('delete')}
            </button>
        );
    }

    return (
        <button
            type="button"
            className="inline-flex min-h-11 items-center border border-[#B42318] px-3 text-sm text-[#B42318]"
            onClick={() => router.delete(url)}
        >
            {t('confirmDelete')}
        </button>
    );
}
