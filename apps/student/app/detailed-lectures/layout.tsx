// Metadata for /detailed-lectures lives entirely in page.tsx — single source
// of truth (page-level metadata overrides layout-level, so dual definitions
// silently mask bugs). This layout exists only to wrap children; if you ever
// need per-segment providers (theme, analytics, etc.) they go here.
export default function LecturesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
