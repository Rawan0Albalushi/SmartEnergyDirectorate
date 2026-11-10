import { fieldPlate, horizon } from '@/lib/fields';

type Props = {
    slug?: string | null;
    horizon?: boolean;
    alt: string;
    className?: string;
    priority?: boolean;
};

export function FieldPhoto({ slug, horizon: wide, alt, className, priority = false }: Props) {
    const plate = wide ? horizon : fieldPlate(slug);

    if (!plate) {
        return null;
    }

    return (
        <img
            src={plate.src}
            alt={alt}
            width={wide ? 1600 : 1200}
            height={wide ? 900 : 900}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            className={className}
        />
    );
}
