import type { Metadata } from 'next';

// SEO metadata — rewritten 2026-05-25 based on the morning briefing flag.
// Old title was 81 chars (truncated on mobile SERP; "JEE NEET" got cut off);
// old description was 250 chars (also truncated). Page had 280k impressions
// on 0.75% CTR over the prior 28 days — the dashboard estimated a top-3
// benchmark CTR (~6%) would yield ~12k extra clicks/month.
// New copy: 47-char title leading with "Every Exception" (completeness signal
// for the exception-trap topics that dominate JEE/NEET questions), and a
// 151-char description that names specific concepts (Lanthanide contraction,
// inert pair effect, anomalous IE) to signal depth rather than just listing
// generic keywords.
export const metadata: Metadata = {
    title: 'Periodic Trends + Every Exception — JEE & NEET',
    description: 'Every periodic trend with all exceptions — Lanthanide contraction, inert pair effect, anomalous IE. Interactive graphs. JEE Main, Advanced & NEET. Free.',
    keywords: [
        'periodic trends',
        'periodic table trends',
        'ionization energy trend',
        'atomic radius trend',
        'electronegativity trend',
        'NCERT chemistry',
        'JEE chemistry',
        'NEET chemistry',
        's block elements',
        'p block elements',
        'd block elements',
        'f block elements',
        'lanthanide contraction',
        'periodic exceptions',
        'inert pair effect'
    ],
    openGraph: {
        title: 'Periodic Trends + Every Exception — JEE & NEET',
        description: 'Every periodic trend with all exceptions — Lanthanide contraction, inert pair effect, anomalous IE. Interactive graphs. JEE Main, Advanced & NEET. Free.',
        type: 'website',
    },
};

export default function PeriodicTrendsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
