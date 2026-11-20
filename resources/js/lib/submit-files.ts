type FileForm<TData> = {
    transform: (callback: (data: TData) => object) => void;
    post: (url: string, options: { forceFormData: true }) => void;
};

/**
 * PHP leaves a multipart PUT or PATCH body empty.
 * Updates are posted with `_method=put` so the fields and the file both arrive.
 */
export function submitWithFiles<TData>(
    form: FileForm<TData>,
    url: string,
    method: 'post' | 'put',
    fields: (data: TData) => object,
): void {
    form.transform((data) =>
        method === 'put' ? { ...fields(data), _method: 'put' } : fields(data),
    );
    form.post(url, { forceFormData: true });
}
