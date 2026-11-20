import { useI18n } from '@/lib/i18n';

export function ImageField({
    label,
    hint,
    currentUrl,
    remove,
    error,
    onFile,
    onRemove,
}: {
    label: string;
    hint?: string;
    currentUrl?: string | null;
    remove: boolean;
    error?: string;
    onFile: (file: File | null) => void;
    onRemove: (remove: boolean) => void;
}) {
    const { t } = useI18n();
    const describedBy = [
        hint ? 'image-hint' : null,
        error ? 'image-error' : null,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="grid gap-2">
            <label htmlFor="image" className="text-sm font-medium">
                {label}
            </label>
            {hint ? (
                <p id="image-hint" className="text-sm leading-6 text-[#3e534c]">
                    {hint}
                </p>
            ) : null}
            {currentUrl && !remove ? (
                <img
                    src={currentUrl}
                    alt=""
                    className="h-40 w-full max-w-sm rounded-[6px] object-cover"
                />
            ) : null}
            <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy || undefined}
                onChange={(event) => onFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm file:me-3 file:inline-flex file:min-h-11 file:cursor-pointer file:items-center file:rounded-[6px] file:border-0 file:bg-[#e7f1ee] file:px-4 file:text-sm file:font-medium file:text-deep"
            />
            {error ? (
                <p id="image-error" className="text-sm text-[#9f2c22]">
                    {error}
                </p>
            ) : null}
            {currentUrl ? (
                <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        className="size-4"
                        checked={remove}
                        onChange={(event) => onRemove(event.target.checked)}
                    />
                    {t('removePhoto')}
                </label>
            ) : null}
        </div>
    );
}
