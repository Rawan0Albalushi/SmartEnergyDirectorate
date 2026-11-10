export type PageMeta = {
    current: number;
    last: number;
    previous: string | null;
    next: string | null;
};

export type SectorLink = {
    slug: string;
    name: string;
};

export type SectorSummary = SectorLink & {
    summary: string;
};

export type SectorDetail = SectorSummary & {
    body: string;
};

export type IndicatorReading = {
    id: number;
    name: string;
    value: number;
    unit: string;
    period: string;
    recordedOn: string;
    notes: string;
    sector: SectorLink | null;
};

export type SectorHome = SectorSummary & {
    headline: IndicatorReading | null;
};

export type ProjectSummary = {
    slug: string;
    title: string;
    summary: string;
    status: string;
    year: number;
    location: string;
    sector: SectorLink | null;
};

export type ProjectDetail = ProjectSummary & {
    body: string;
};

export type AchievementItem = {
    id: number;
    title: string;
    summary: string;
    year: number;
    sector: SectorLink | null;
};

export type NewsSummary = {
    slug: string;
    title: string;
    summary: string;
    scope: string;
    publishedAt: string | null;
    sourceName: string | null;
    sector: SectorLink | null;
};

export type NewsDetail = NewsSummary & {
    body: string;
    originalUrl: string | null;
};

export type DepartmentSummary = {
    slug: string;
    name: string;
    summary: string;
    email: string | null;
    phone: string | null;
};

export type DepartmentDetail = DepartmentSummary & {
    mandate: string;
};

export type StaffPublic = {
    id: number;
    name: string;
    title: string;
    email: string | null;
};

export type Option = {
    id: number;
    name: string;
};
