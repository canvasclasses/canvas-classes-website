import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PredictorExperience from '@/features/college-predictor/predictor-design/PredictorExperience';
import TopColleges from '@/features/college-predictor/components/TopColleges';
import HeroDemo, { HeroBackdrop } from '@/features/college-predictor/components/HeroDemo';
import HeroPreviewMobile from '@/features/college-predictor/components/HeroPreviewMobile';
import TrustStrip from '@/features/college-predictor/components/TrustStrip';
import { TOP_COLLEGES } from '@/features/college-predictor/data/topCollegesData';

export const metadata: Metadata = {
  title: 'JEE Main & BITSAT College Predictor 2026 — NIT, IIIT, GFTI, BITS Rank Predictor | Canvas Classes',
  description:
    'Free JEE Main + BITSAT college predictor. Enter your JEE Main rank/percentile for Safe / Target / Reach NITs, IIITs and GFTIs, or your BITSAT score for BITS Pilani / Goa / Hyderabad. Built on 5 years of JoSAA cutoff data and 9 years of official BITSAT closing scores.',
  keywords: [
    'JEE Main college predictor',
    'JEE Main rank predictor',
    'BITSAT college predictor',
    'BITSAT score predictor',
    'BITS Pilani cutoff',
    'BITS Goa cutoff',
    'BITS Hyderabad cutoff',
    'NIT college predictor',
    'IIIT college predictor',
    'JoSAA college predictor',
    'JEE Main cutoff',
    'JEE percentile to rank',
    'best NIT for CSE',
    'best IIIT for CSE',
    'top IITs in India',
    'top NITs in India',
    'BITS Pilani admission',
    'BITSAT cutoff 2025',
    'IIIT Hyderabad admission',
    'best engineering colleges India',
    'JoSAA choice list',
    'NIT Trichy cutoff',
    'NIT Warangal cutoff',
    'NIT Surathkal cutoff',
  ],
  alternates: {
    canonical: 'https://canvasclasses.com/college-predictor',
  },
  openGraph: {
    title: 'JEE Main + BITSAT College Predictor — Free, Accurate, Ad-Free',
    description:
      'See which NITs, IIITs, GFTIs or BITS campuses you can get with your JEE Main rank or BITSAT score. Built on official JoSAA + BITS admission data.',
    url: 'https://canvasclasses.com/college-predictor',
    type: 'website',
  },
};

// JSON-LD structured data — helps Google understand the page as a free tool
// and surfaces FAQs in rich results. Keep answers short and factual.
const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Canvas Classes', item: 'https://canvasclasses.com' },
    { '@type': 'ListItem', position: 2, name: 'College Predictor', item: 'https://canvasclasses.com/college-predictor' },
  ],
};

const collegeListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Top engineering colleges in India',
  itemListElement: TOP_COLLEGES.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'CollegeOrUniversity',
      name: c.fullName,
      address: {
        '@type': 'PostalAddress',
        addressLocality: c.city,
        addressRegion: c.state,
        addressCountry: 'IN',
      },
      foundingDate: String(c.established),
    },
  })),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does the JEE Main college predictor work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Enter your CRL rank or percentile along with your category, gender, and home state. ' +
          'The predictor pulls five years of JoSAA final-round closing ranks for each NIT, IIIT, and GFTI branch, ' +
          'projects this year\'s closing rank using a weighted mean plus linear trend, ' +
          'and classifies each college-branch pair as Safe, Target, or Reach based on your distance from the projection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Canvas Classes college predictor free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The college predictor is completely free. There are no ads and we do not sell your data to counseling agencies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which colleges are covered by the JEE Main predictor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'All 31 NITs, 26 IIITs, and 38 GFTIs that admit through JoSAA counseling using JEE Main ranks. ' +
          'IITs (which require JEE Advanced) will be added in a separate predictor.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate are the predictions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Every prediction shows a confidence tag: high, medium, or low. High-confidence predictions draw on three or more years of stable cutoffs. ' +
          'Low-confidence predictions are flagged when there are fewer years of data or when cutoffs have been volatile.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the BITSAT college predictor work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Switch to the BITSAT tab and enter your total BITSAT score. The predictor compares it to four years of final closing scores ' +
          '(post all iterations) at BITS Pilani, K K Birla Goa and Hyderabad campuses for every B.E., M.Sc. and B.Pharm. programme, ' +
          'and classifies each one as Safe, Target or Reach. BITS has no category quotas, so the same cutoff applies to every candidate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which years of BITSAT data does the predictor cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'The default modern regime covers BITSAT 2022 through 2025 — the four years of the current 390-mark paper. ' +
          'A legacy mode is also available for BITSAT 2017 through 2021 (when the paper was out of 450), useful for research. ' +
          'Scores are not directly comparable across the 2022 boundary, so the predictor scopes a single regime per query.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share the prediction with my parents?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. Every result page has a Parent view toggle that swaps the technical jargon (z-scores, projected closing ranks) ' +
          'for plain-English verdicts like "Very strong chance" or "Worth trying", and a "Share with parents" button that ' +
          'generates a clean square image of the top 5 colleges optimized for WhatsApp.',
      },
    },
  ],
};

export default function CollegePredictorPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#070710' }}>
      {/* Page-local fonts for the Claude-Design hero (Space Grotesk for the h1
          + KPIs, JetBrains Mono for eyebrow + slider readouts). Loaded via
          a stylesheet link so we don't perturb the root layout's font setup. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeListJsonLd) }}
      />

      {/* Hero zone — relative container so the animated backdrop (aurora +
          ribbons + grid) spans the entire hero, including the headline.
          Without this wrapper the backdrop was scoped to inside the predictor
          card only, leaving the title on a flat dark grid. */}
      <div className="relative isolate overflow-hidden">
        <HeroBackdrop />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-20">
          {/* Header — eyebrow + BETA chips + 2-line gradient h1 + sub. Layout
              from the Claude Design handoff; gradient text uses the same
              background-clip pattern as Hero.html so the amber line never
              renders as a solid bar. */}
          <header className="text-center mb-6 sm:mb-9">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                border: `1px solid ${'#f59e0b'}55`,
                background: `${'#f59e0b'}10`,
                color: '#f59e0b',
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              JEE Main · BITSAT · 2026 cycle
            </span>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                border: '1px solid rgba(250,204,21,0.4)',
                background: 'rgba(250,204,21,0.06)',
                color: '#facc15',
                fontSize: 10.5,
                fontWeight: 800,
                letterSpacing: '0.16em',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#facc15', boxShadow: '0 0 8px #facc15' }} />
              BETA
            </span>
          </div>
          <h1
            className="mx-auto"
            style={{
              fontFamily: "'Space Grotesk', 'Geist', system-ui, sans-serif",
              // Smaller floor on mobile — the 40px floor was leaving the two
              // gradient lines stacked on phones in a way that pushed the
              // demo / form way down. 32px keeps the headline punchy without
              // dominating the first screen.
              fontSize: 'clamp(32px, 6vw, 80px)',
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: '-0.035em',
              maxWidth: 980,
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
              Your rank deserves
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
              more than a guess.
            </span>
          </h1>
          <p
            className="mx-auto mt-6"
            style={{
              maxWidth: 720,
              fontSize: 'clamp(15px, 1.1vw, 18px)',
              color: '#9a9aa6',
              lineHeight: 1.55,
            }}
          >
            Built on five years of JoSAA &amp; BITSAT counseling data — so you choose a college, not a coin flip.
          </p>
        </header>

        {/* Live predictor demo — desktop only.
            On mobile the rAF-driven slider + cursor + 30-chip reshuffle was
            stuttering on Safari/Chrome and the cursor visibly desynced from
            the slider thumb. Mobile gets a static preview card instead that
            mirrors the same "this is what the tool produces" story without
            the animation cost. See HeroPreviewMobile.tsx. */}
        <div className="hidden md:block">
          <HeroDemo />
        </div>
        <div className="md:hidden">
          <HeroPreviewMobile />
        </div>

        {/* Trust strip — 4 honest KPIs */}
        <TrustStrip />

          {/* Signature line — the Claude Design floor signature, kept lean */}
          <div
            className="text-center mt-7"
            style={{
              color: '#5e5e6a',
              fontSize: 13,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: '0.02em',
            }}
          >
            your branch compounds for decades
            <span style={{ color: '#3a3a44', margin: '0 10px' }}>·</span>
            <span style={{ color: '#9a9aa6' }}>built so you choose with data, not guesses.</span>
          </div>
        </div>
      </div>

      {/* Everything below the hero — the new PredictorExperience implements
          STEP 02 (input form with feature cards + tabs + form panel) and
          STEP 03 (results + sensitivity chart + share row) from the Claude
          Design handoff. The component owns its own container width; we just
          give it room to breathe. */}
      <div id="predictor" />
      <Suspense fallback={<div className="h-96 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse mx-auto max-w-7xl" />}>
        <PredictorExperience />
      </Suspense>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20">

        <section className="mt-16">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Browse colleges
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {[
              { slug: 'all-nits',         label: 'All 31 NITs' },
              { slug: 'all-iiits',        label: 'IIITs in JoSAA' },
              { slug: 'north-india',      label: 'North India' },
              { slug: 'south-india',      label: 'South India' },
              { slug: 'east-india',       label: 'East India' },
              { slug: 'west-india',       label: 'West India' },
              { slug: 'central-india',    label: 'Central India' },
              { slug: 'northeast-india',  label: 'Northeast India' },
            ].map((l) => (
              <Link
                key={l.slug}
                href={`/college-predictor/${l.slug}`}
                className="px-3 py-2.5 rounded-lg bg-[#0B0F15] border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 text-sm text-zinc-300 hover:text-white transition-colors text-center"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>

        <TopColleges />

        <section className="mt-16 grid md:grid-cols-3 gap-4">
          {[
            {
              title: 'How the math works',
              body:
                'Weighted mean of recent years (Round 6 closing ranks for JoSAA, final closing scores for BITSAT) projected forward using a linear trend. ' +
                'Each result is bucketed by z-score against the projection\'s standard deviation.',
            },
            {
              title: 'No ads, no spam',
              body:
                'We do not sell your rank or score to counseling agencies. The predictor is a free tool built to help you choose — nothing else.',
            },
            {
              title: 'Launch scope',
              body:
                'NITs, IIITs and GFTIs (JEE Main) plus BITS Pilani, Goa and Hyderabad (BITSAT). IITs (JEE Advanced) come in a separate predictor.',
            },
          ].map((card) => (
            <div key={card.title} className="p-5 rounded-xl bg-[#0B0F15] border border-white/5">
              <div className="text-sm font-semibold text-orange-400 mb-2">{card.title}</div>
              <div className="text-sm text-zinc-400 leading-relaxed">{card.body}</div>
            </div>
          ))}
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/the-crucible"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors"
          >
            Still preparing? Practice JEE questions on The Crucible →
          </Link>
        </div>
      </div>
    </main>
  );
}
