import type { TranslationKey } from '@/lib/i18n';

const plates: Record<string, { src: string; alt: TranslationKey }> = {
    renewable: { src: '/images/field-renewable.jpg', alt: 'fieldRenewable' },
    hydrogen: { src: '/images/field-hydrogen.jpg', alt: 'fieldHydrogen' },
    electricity: {
        src: '/images/field-electricity.jpg',
        alt: 'fieldElectricity',
    },
    efficiency: { src: '/images/field-efficiency.jpg', alt: 'fieldEfficiency' },
};

export const horizon = {
    src: '/images/field-horizon.jpg',
    alt: 'fieldHorizon' as const,
};

export function fieldPlate(slug: string | null | undefined) {
    if (!slug) {
        return null;
    }

    return plates[slug] ?? null;
}
