// layout.tsx kept as a passthrough — its metadata block was removed 2026-05-25
// because page.tsx defines a complete (and accurate) Metadata object. Next.js
// precedence rules give the page-level metadata priority, so the old layout-
// level block was dead code that drifted from the page (different title, "2
// minute" vs "under 5 minute" inconsistency, missing OG fields, no schema).
// Single source of truth now lives in page.tsx.
export default function TwoMinChemistryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
