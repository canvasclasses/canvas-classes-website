// layout.tsx kept as a passthrough — its metadata block was removed 2026-05-25
// because page.tsx defines a complete (and more accurate) Metadata object.
// Next.js precedence rules give the page-level metadata priority, so the old
// layout-level block was dead code that drifted from the page over time
// (different title, missing OG fields, missing year signals). Single source of
// truth now lives in page.tsx alongside the schema.
export default function Top50Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
