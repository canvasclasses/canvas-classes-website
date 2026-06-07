import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import CompareToolClient from '@/features/college-predictor/compare/CompareToolClient';

// Effectively static shell — the actual comparison is selected client-side and
// fetched from /api/v2/college-predictor/compare, so the page itself caches at
// the edge (per the §10 caching rules: no force-dynamic, no server-side
// searchParams read). 24h revalidate since the curated content rarely changes.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Compare Colleges Side-by-Side — NIT vs NIT, IIIT, GFTI & BITS',
  description:
    'Confused between two or three colleges? Compare NITs, IIITs, GFTIs and BITS campuses side-by-side on what actually matters: branch heritage, research vs entrepreneurship vs core-industry fit, NIRF, fees, cutoff trend and home-state advantage. Pick the lens for YOUR goals.',
  keywords: [
    'compare colleges',
    'NIT vs NIT comparison',
    'compare NIT IIIT',
    'BITS vs NIT',
    'best college for CSE',
    'best college for mechanical',
    'best college for metallurgy',
    'college vs branch decision',
    'how to choose engineering college',
    'NIT Trichy vs NIT Warangal',
    'college comparison tool JEE',
  ],
  alternates: {
    canonical: 'https://www.canvasclasses.in/college-predictor/compare',
  },
  openGraph: {
    title: 'Compare Colleges Side-by-Side — choose with data, not a coin flip',
    description:
      'Compare NITs, IIITs, GFTIs and BITS on branch heritage, fit (research / startups / core industry / govt-PSU / abroad), NIRF, fees and cutoff trend.',
    url: 'https://www.canvasclasses.in/college-predictor/compare',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Should I pick a better branch or a better college?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'As a rule of thumb: the college brand matters more at the very top (the IIT / top-NIT tag clears the floor everywhere), '
          + 'but the branch matters more as you move down the list. A core branch like Computer Science at a slightly lower-ranked '
          + 'institute often beats a non-core branch at a higher-ranked one. The compare tool lets you weigh both.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does this tool not compare colleges on placement packages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'A handful of students getting very high packages does not raise your own chances, and average-package figures are easy to '
          + 'manipulate and hard to generalize. Instead the tool compares on durable factors that actually shape outcomes: how long an '
          + 'institute has run a branch (its alumni and recruiter depth in that field), whether it leans towards research, '
          + 'entrepreneurship, core industry, the government/PSU track or going abroad, alongside NIRF, fees, cutoff trend and location.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does branch heritage really matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. An institute that has run a branch such as metallurgy or mining for decades has a far deeper alumni and recruiter '
          + 'network in that field than one that added it recently. The tool flags an institute\'s long-standing legacy strengths so you '
          + 'can match a branch to a place that is genuinely strong in it.',
      },
    },
  ],
};

export default function CompareCollegesPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#070710' }}>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-20 sm:pt-24 pb-6">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
          style={{
            border: '1px solid #f59e0b55',
            background: '#f59e0b10',
            color: '#f59e0b',
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Decision tool · NIT · IIIT · GFTI · BITS
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
            fontSize: 'clamp(30px, 5vw, 60px)',
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: '-0.035em',
            maxWidth: 920,
          }}
        >
          <span
            style={{
              background: 'linear-gradient(180deg, #ffffff 0%, #c8c8d0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
            }}
          >
            Stuck between two colleges?
          </span>
          <span
            style={{
              background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'block',
              marginTop: 4,
            }}
          >
            Compare them on what matters.
          </span>
        </h1>
        <p className="mt-5" style={{ maxWidth: 720, fontSize: 'clamp(15px, 1.1vw, 18px)', color: '#9a9aa6', lineHeight: 1.55 }}>
          Not packages — those don&apos;t generalize. Compare on branch heritage, the kind of student a place suits
          (research, startups, core industry, govt/PSU, abroad), NIRF, fees, cutoff trend and home-state advantage.
        </p>
        <div className="mt-4">
          <Link
            href="/college-predictor"
            className="inline-flex items-center gap-2 text-sm transition-colors"
            style={{ color: '#9a9aa6' }}
          >
            ← Don&apos;t know your shortlist yet? Run the college predictor first
          </Link>
        </div>
      </div>

      <Suspense
        fallback={<div className="h-96 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse mx-auto max-w-7xl mt-6" />}
      >
        <CompareToolClient />
      </Suspense>
    </main>
  );
}
