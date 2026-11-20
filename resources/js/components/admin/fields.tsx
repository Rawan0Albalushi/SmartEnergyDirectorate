import { Link, router } from '@inertiajs/react';
import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type ReactNode,
} from 'react';
import { primaryButtonClass } from '@/components/admin/chrome';
import { useI18n } from '@/lib/i18n';

export const fieldClass =
    'min-h-11 w-full rounded-[6px] border border-line bg-white px-3 text-base text-ink transition-colors duration-150 focus-visible:border-sea';

export function FieldPair({ children }: { children: ReactNode }) {
    return <div className="grid gap-5 md:grid-cols-2">{children}</div>;
}

function FieldError({ id, error }: { id: string; error?: string }) {
    if (!error) {
        return null;
    }

    return (
        <p id={`${id}-error`} className="text-sm text-[#9f2c22]">
            {error}
        </p>
    );
}

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
            <label htmlFor={id} className="text-sm font-medium text-ink">
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
            <FieldError id={id} error={error} />
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
            <label htmlFor={id} className="text-sm font-medium text-ink">
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
                className="w-full rounded-[6px] border border-line bg-white px-3 py-2 text-base leading-6 text-ink transition-colors duration-150 focus-visible:border-sea"
            />
            <FieldError id={id} error={error} />
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
            <label htmlFor={id} className="text-sm font-medium text-ink">
                {label}
            </label>
            <select
                id={id}
                name={id}
                value={value}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => onChange(event.target.value)}
                className={`${fieldClass} cursor-pointer`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <FieldError id={id} error={error} />
        </div>
    );
}

export function RecordForm({
    title,
    errors,
    processing,
    onSubmit,
    cancelHref,
    deleteUrl,
    children,
}: {
    title: string;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    cancelHref: string;
    deleteUrl?: string;
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

    const messages = Object.entries(errors).filter(
        (entry): entry is [string, string] => Boolean(entry[1]),
    );

    return (
        <form
            onSubmit={onSubmit}
            className="w-full overflow-hidden rounded-[8px] border border-line bg-white"
        >
            <div className="border-b border-line px-5 py-5 sm:px-7">
                <h1 className="text-[1.75rem] leading-tight font-medium tracking-[-0.02em]">
                    {title}
                </h1>
            </div>
            <div className="grid gap-5 px-5 py-6 sm:px-7">
                {messages.length > 0 ? (
                    <div
                        ref={summary}
                        tabIndex={-1}
                        role="alert"
                        className="rounded-[6px] border border-[#e7c6c2] bg-[#fdf6f5] p-4"
                    >
                        <h2 className="font-medium text-[#9f2c22]">
                            {t('problem')}
                        </h2>
                        <ul className="mt-2 list-disc ps-5 text-sm">
                            {messages.map(([field, message]) => (
                                <li key={field}>
                                    <a
                                        href={`#${field}`}
                                        className="underline underline-offset-4"
                                    >
                                        {message}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
                {children}
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-line px-5 py-4 sm:px-7">
                <button
                    type="submit"
                    disabled={processing}
                    className={primaryButtonClass}
                >
                    {processing ? t('saving') : t('save')}
                </button>
                <Link
                    href={cancelHref}
                    className="inline-flex min-h-11 items-center px-3 text-sm text-[#3e534c] underline-offset-4 hover:text-ink hover:underline"
                >
                    {t('cancel')}
                </Link>
                {deleteUrl ? <DeleteControl url={deleteUrl} /> : null}
            </div>
        </form>
    );
}

export function DeleteControl({ url }: { url: string }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);

    if (!open) {
        return (
            <button
                type="button"
                className="ms-auto inline-flex min-h-11 cursor-pointer items-center text-sm text-[#9f2c22] underline-offset-4 hover:underline"
                onClick={() => setOpen(true)}
            >
                {t('delete')}
            </button>
        );
    }

    return (
        <button
            type="button"
            className="ms-auto inline-flex min-h-11 cursor-pointer items-center rounded-[6px] border border-[#e7c6c2] bg-[#fdf6f5] px-3 text-sm text-[#9f2c22]"
            onClick={() => router.delete(url)}
        >
            {t('confirmDelete')}
        </button>
    );
}
