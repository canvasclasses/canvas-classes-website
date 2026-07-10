import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import BitsatPageClient from '@/features/bitsat/components/BitsatPageClient';
import { getIterationsNewestFirst } from '@/features/bitsat/data/iterationCutoffs';

// Page-local display + label fonts (Space Grotesk + JetBrains Mono), matching
// the college-predictor surface. Loaded via next/font and exposed as CSS vars
// so components reference them by `var(--font-*)` (see features/bitsat/ui.tsx)
// — no extra network round-trip and no root-layout font changes.
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

// Cacheable, public, auth-free shell (CLAUDE.md §10). No cookies()/headers()/
// searchParams read at the server level — the static cutoffs come from a repo
// data file and everything auth/URL-aware lives in the client island.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'BITSAT 2026 — Iteration Cutoffs, Score Analytics & College Predictor',
  description:
    'BITSAT 2026 hub: iteration-wise closing cutoffs for BITS Pilani, Goa and Hyderabad, live analytics on candidate scores, and a free BITSAT college predictor.',
  // noindex for now — flip to index when the page is launched publicly and
  // added to sitemap.ts (project decision 2026-06-22).
  robots: { index: false, follow: true },
};

export default function BitsatPage() {
  const iterations = getIterationsNewestFirst();

  return (
    <main
      className={`min-h-screen text-white ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      style={{ background: '#070710' }}
    >
      <BitsatPageClient iterations={iterations} />
    </main>
  );
}
