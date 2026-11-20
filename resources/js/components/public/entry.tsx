import { Link } from '@inertiajs/react';
import {
    ArrowLeft,
    BarChart3,
    Calendar,
    Leaf,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { FieldPhoto } from '@/components/public/field-photo';

const sectorIcons: Record<string, LucideIcon> = {
    renewable: Leaf,
    electricity: Zap,
    efficiency: BarChart3,
};

export function SectorGlyph({
    slug,
    className = 'size-4',
}: {
    slug: string;
    className?: string;
}) {
    if (slug === 'hydrogen') {
        return (
            <span
                className="text-sm leading-none font-medium"
                aria-hidden="true"
            >
                H₂
            </span>
        );
    }

    const Icon = sectorIcons[slug] ?? Leaf;

    return <Icon className={className} aria-hidden="true" />;
}

export function Thumb({ slug }: { slug?: string | null }) {
    return (
        <span className="block h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[#e7eeea] sm:h-24 sm:w-36">
            <FieldPhoto
                slug={slug}
                alt=""
                className="h-full w-full object-cover"
            />
        </span>
    );
}

export function EntryLink({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-3 py-3 hover:bg-paper sm:px-4"
        >
            {children}
            <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7f1ee] text-deep"
                aria-hidden="true"
            >
                <ArrowLeft className="size-4 ltr:scale-x-[-1]" />
            </span>
        </Link>
    );
}

export function YearMark({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#eef3f1] px-2.5 py-1 text-xs text-[#3E534C]">
            <Calendar className="size-3.5" aria-hidden="true" />
            {children}
        </span>
    );
}

export function ScopeBadge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full bg-[#e7f6ee] px-2.5 py-1 text-xs text-[#0e6b62]">
            {children}
        </span>
    );
}

export function StatusBadge({
    status,
    children,
}: {
    status: string;
    children: ReactNode;
}) {
    const tone =
        status === 'completed'
            ? 'bg-[#e5f3ea] text-[#146c43]'
            : status === 'ongoing'
              ? 'bg-[#e7f6ee] text-[#0e6b62]'
              : 'bg-[#e6f2f6] text-[#0e5f73]';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs ${tone}`}
        >
            <span
                className="size-1.5 rounded-full bg-current"
                aria-hidden="true"
            />
            {children}
        </span>
    );
}
