import { fieldPlate } from '@/lib/fields';
import { useHeroSrc } from '@/lib/media';

type Props = {
    src?: string | null;
    slug?: string | null;
    horizon?: boolean;
    alt: string;
    className?: string;
    priority?: boolean;
};

export function FieldPhoto({
    src,
    slug,
    horizon: wide,
    alt,
    className,
    priority = false,
}: Props) {
    const hero = useHeroSrc();
    const custom = typeof src === 'string' && src !== '' ? src : null;
    const plate = custom
        ? { src: custom }
        : wide
          ? { src: hero }
          : fieldPlate(slug);

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
