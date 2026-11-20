import { usePage } from '@inertiajs/react';
import { departmentPlates } from '@/lib/department-plates';
import { fieldPlate, horizon } from '@/lib/fields';

export function useHeroSrc(): string {
    const hero = (usePage().props as { media?: { hero?: string | null } }).media
        ?.hero;

    return typeof hero === 'string' && hero !== '' ? hero : horizon.src;
}

export function listedPhoto(
    imageUrl: string | null,
    slug: string | null | undefined,
    hero: string,
    kind: 'field' | 'department' = 'field',
): string {
    if (imageUrl) {
        return imageUrl;
    }

    const plate =
        kind === 'department'
            ? departmentPlates[slug ?? '']?.src
            : fieldPlate(slug)?.src;

    return plate || hero;
}
