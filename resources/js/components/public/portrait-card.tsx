import { Link } from '@inertiajs/react';

export function PortraitCard({
    href,
    src,
    position = 'object-center',
    index,
    title,
    text,
}: {
    href: string;
    src: string;
    position?: string;
    index: number;
    title: string;
    text: string;
}) {
    return (
        <Link href={href} className="portrait-card">
            <span className="portrait-card__media">
                <img src={src} alt="" className={`portrait-card__img ${position}`} />
            </span>
            <span className="portrait-card__scrim" aria-hidden="true" />
            <span className="portrait-card__glass" aria-hidden="true" />
            <span className="portrait-card__head">
                <span className="portrait-card__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <span className="portrait-card__title">{title}</span>
            </span>
            <span className="portrait-card__text">{text}</span>
        </Link>
    );
}
