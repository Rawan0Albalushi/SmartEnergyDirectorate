import { ArrowUpRight, X } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useI18n } from '@/lib/i18n';
import type { StaffPublic } from '@/types/content';

export function PersonGallery({ people }: { people: StaffPublic[] }) {
    const { t } = useI18n();
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const selected = people.find((person) => person.id === selectedId) ?? null;

    return (
        <>
            <ul className="grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
                {people.map((person) => (
                    <li key={person.id} className="min-w-0">
                        <button
                            type="button"
                            className="person-card"
                            onClick={() => {
                                setSelectedId(person.id);
                                setOpen(true);
                            }}
                        >
                            <PersonPhoto person={person} />
                            <span className="person-card__band">
                                <span className="min-w-0 flex-1">
                                    <span className="block text-lg font-medium leading-7 text-ink">{person.name}</span>
                                    <span className="mt-0.5 block text-sm leading-6 text-[#3E534C]">{person.title}</span>
                                </span>
                                <span className="person-card__more" aria-hidden="true">
                                    <ArrowUpRight className="size-5 rtl:-scale-x-100" />
                                </span>
                            </span>
                            <span className="sr-only">{t('openProfile')}</span>
                        </button>
                    </li>
                ))}
            </ul>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[min(92dvh,46rem)] gap-0 overflow-hidden border-line bg-white p-0 sm:max-w-4xl [&>button.absolute]:hidden">
                    {selected ? <PersonProfile person={selected} closeLabel={t('close')} /> : null}
                </DialogContent>
            </Dialog>
        </>
    );
}

function PersonPhoto({ person }: { person: StaffPublic }) {
    if (person.photoUrl) {
        return <img src={person.photoUrl} alt="" className="person-card__photo" />;
    }

    return (
        <span className="person-card__photo person-card__mark" aria-hidden="true">
            {initials(person.name)}
        </span>
    );
}

function PersonProfile({ person, closeLabel }: { person: StaffPublic; closeLabel: string }) {
    const paragraphs = person.bio
        .split(/\n+/)
        .map((paragraph) => paragraph.trim())
        .filter((paragraph) => paragraph !== '');

    return (
        <div className="grid md:max-h-[min(92dvh,46rem)] md:min-h-[28rem] md:grid-cols-[minmax(15rem,0.8fr)_minmax(0,1.2fr)]">
            <div className="relative order-1 min-h-56 bg-[#e7eeea] md:min-h-full">
                <DialogClose className="absolute end-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white text-deep ring-1 ring-deep/15">
                    <X className="size-5" />
                    <span className="sr-only">{closeLabel}</span>
                </DialogClose>
                {person.photoUrl ? (
                    <img src={person.photoUrl} alt={person.name} className="h-64 w-full object-cover object-top md:absolute md:inset-0 md:h-full" />
                ) : (
                    <span className="flex h-64 items-center justify-center bg-deep text-6xl font-medium text-measure md:h-full" aria-hidden="true">
                        {initials(person.name)}
                    </span>
                )}
            </div>
            <div className="order-2 px-6 py-8 sm:px-10 md:overflow-y-auto">
                <DialogTitle className="flex items-start gap-3 text-3xl font-medium text-balance text-sea sm:text-4xl">
                    <span className="mt-1.5 h-8 w-1 shrink-0 rounded-full bg-measure" aria-hidden="true" />
                    <span>{person.name}</span>
                </DialogTitle>
                <DialogDescription className="ms-4 mt-3 text-lg leading-7 text-ink">{person.title}</DialogDescription>
                {person.department ? <p className="ms-4 mt-1 text-sm text-[#3E534C]">{person.department}</p> : null}
                {paragraphs.length > 0 ? (
                    <div className="ms-4 mt-6 max-w-2xl space-y-4 text-base leading-8 text-[#243830]">
                        {paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>
                ) : null}
                {person.email ? (
                    <a className="ms-4 mt-6 inline-flex min-h-11 items-center text-sea" href={`mailto:${person.email}`}>
                        {person.email}
                    </a>
                ) : null}
            </div>
        </div>
    );
}

function initials(name: string): string {
    const parts = name
        .trim()
        .split(/\s+/)
        .map((part) => part.replace(/^ال/, ''))
        .filter((part) => part !== '');

    if (parts.length === 0) {
        return '';
    }

    const first = parts[0].slice(0, 1);
    const last = parts.length === 1 ? '' : parts[parts.length - 1].slice(0, 1);

    return `${first}${last}`;
}
