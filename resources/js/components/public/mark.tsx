export function Mark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <rect width="32" height="32" fill="#0C2E2A" />
            <circle cx="16" cy="12" r="4.5" fill="#F6E2B8" />
            <path d="M5 24.5h22" stroke="#F6E2B8" strokeWidth="1.4" />
            <path d="M9 24.5V21M16 24.5V17.5M23 24.5V21" stroke="#F6E2B8" strokeWidth="1.4" />
        </svg>
    );
}
