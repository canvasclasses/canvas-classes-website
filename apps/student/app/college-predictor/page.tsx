import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PredictorClient from './PredictorClient';
import TopColleges from './TopColleges';
import { TOP_COLLEGES } from './topCollegesData';

export const metadata: Metadata = {
  title: 'JEE Main College Predictor 2026 — NIT, IIIT, GFTI Rank Predictor | Canvas Classes',
  description:
    'Free JEE Main college predictor with 5 years of JoSAA cutoff data. Enter your rank or percentile to see Safe / Target / Reach NITs, IIITs and GFTIs, plus detailed guides to the top IITs, NITs, IIITs, BITS and private engineering colleges in India — connectivity, climate and what makes each unique.',
  keywords: [
    'JEE Main college predictor',
    'JEE Main rank predictor',
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
    title: 'JEE Main College Predictor — Free, Accurate, Ad-Free',
    description:
      'See which NITs, IIITs and GFTIs you can get with your JEE Main rank. Built on 5 years of official JoSAA cutoffs.',
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
  ],
};

// Milestone label overlaid on the hero journey image. One per panel in the
// underlying illustration (student → graduate → professional → leader). Keeps
// overlays lightweight so the image does the visual work; each label just
// carries the age, a one-word title, and a compact stat tied to JoSAA data.
function ImageMilestone({
  title,
  stat,
  sub,
  tone,
  active,
}: {
  title: string;
  stat: string;
  sub: string;
  tone: 'zinc' | 'amber' | 'orange';
  active?: boolean;
}) {
  const statColor = {
    zinc: 'text-zinc-100',
    amber: 'text-amber-300',
    orange: 'text-orange-400',
  }[tone];
  return (
    <div
      className={`text-center ${
        active ? 'drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]' : ''
      }`}
    >
      <div className="text-xs md:text-sm font-semibold text-white">{title}</div>
      <div className={`mt-0.5 text-base md:text-xl font-bold tabular-nums ${statColor}`}>
        {stat}
      </div>
      <div className="text-[9px] md:text-[11px] text-zinc-400 leading-tight">{sub}</div>
    </div>
  );
}

export default function CollegePredictorPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
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

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <header className="text-center mb-7">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium uppercase tracking-wider">
              Free · JEE Main 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Beta
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            JEE Main College Predictor
          </h1>
          <p className="mt-6 text-xl md:text-3xl text-zinc-100 max-w-2xl mx-auto leading-tight font-light">
            Four years of study.{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent font-semibold">
              Forty years of career.
            </span>
          </p>
          <p className="mt-3 text-sm md:text-base text-zinc-500 max-w-xl mx-auto">
            One choice — shaped by data, not guesses.
          </p>
        </header>

        {/* Image hero: photographic journey from desk to boardroom. The image
            is the spectacle; overlaid milestone labels tie each panel to the
            underlying JoSAA admission data. Source lives in Cloudflare R2
            (shared bucket) — swap the URL below to update. Keep the four-panel
            composition so the bottom-row milestone labels align with each scene. */}
        {/* Hero block: image + data strip treated as one connected card.
            Image has rounded-t only; data strip has rounded-b only, so they
            share a seamless border with no gap. All text lives below the
            image — zero chance of overlap with the artwork. */}
        <div className="mb-8 mx-auto max-w-4xl">

          {/* ── Image — borderless, floats on the dark page background ──── */}
          <div className="relative aspect-[16/7] rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            <Image
              src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/image/School%20to%20career%20journey.webp"
              alt="From first lecture to last boardroom — the arc of a forty-year career shaped by one branch decision."
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover object-center"
            />

            {/* Bottom vignette — keeps caption legible over any image tone */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/80 to-transparent"
            />

          </div>

          {/* ── Data strip (below image, no border or card bg) ─────────── */}
          <div className="px-2 pt-4 pb-6 md:px-4 md:pt-5 md:pb-7">

            {/* Milestone stats — one column per life stage */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              <ImageMilestone title="You choose" stat="14 L+" sub="aspirants" tone="zinc" />
              <ImageMilestone title="Graduate"   stat="~60 K"  sub="top seats"   tone="amber"  />
              <ImageMilestone title="Career"     stat="~15 K"  sub="in CSE / IT" tone="orange" />
              <ImageMilestone title="Lead"       stat="40 yr"  sub="of impact"   tone="orange" active />
            </div>

            {/* Timeline arrow — gradient line + dots + arrowhead */}
            <div className="relative mt-4 md:mt-5 h-3 md:h-4">
              {/* Gradient line */}
              <div
                aria-hidden
                className="absolute left-1 right-3 top-1/2 -translate-y-1/2 h-[3px] rounded-full bg-gradient-to-r from-zinc-500 via-amber-400 to-orange-500"
              />
              {/* Arrowhead */}
              <div
                aria-hidden
                className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[5px] border-y-transparent border-l-[9px] border-l-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.6)]"
              />
              {/* Milestone dots — grid-cols-4 mirrors the stat grid above */}
              <div className="relative grid grid-cols-4 h-full">
                {[
                  'bg-zinc-300',
                  'bg-amber-300',
                  'bg-orange-400',
                  'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.85)] animate-pulse',
                ].map((cls, i) => (
                  <div key={i} className="flex items-center justify-center">
                    <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ring-[3px] ring-[#050505] ${cls}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Age axis labels */}
            <div className="grid grid-cols-4 gap-2 md:gap-4 mt-2 md:mt-2.5">
              {['17', '22', '30', '45+'].map((age) => (
                <div
                  key={age}
                  className="text-center text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-[0.15em]"
                >
                  Age {age}
                </div>
              ))}
            </div>
          </div>

          {/* Narrative pull-quote */}
          <p className="mt-6 text-center text-sm md:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            <span className="font-semibold text-white">Your branch compounds for decades.</span>{' '}
            AI is rewriting careers faster than any generation before you —
            the advice that worked 15 years ago no longer holds.
          </p>
          <p className="mt-1.5 text-center text-[11px] md:text-xs text-zinc-500 max-w-xl mx-auto">
            Stats · JEE Main 2024 (NTA + JoSAA)
          </p>
        </div>

        <div className="mb-8 mx-auto max-w-2xl flex items-center justify-center gap-2 text-xs text-amber-200/70">
          <svg className="w-3.5 h-3.5 text-amber-400/80 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.485 2.495c.67-1.16 2.36-1.16 3.03 0l6.28 10.875c.67 1.16-.168 2.61-1.515 2.61H3.72c-1.347 0-2.185-1.45-1.515-2.61L8.485 2.495zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span>
            <span className="font-semibold text-amber-300">Public beta</span>
            {' — '}predictions are based on 5 years of JoSAA data but may have edge-case errors. Cross-check with official JoSAA before finalising your choice list.
          </span>
        </div>

        <Suspense fallback={<div className="h-96 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse" />}>
          <PredictorClient />
        </Suspense>

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
                'Weighted mean of the last 5 years of Round 6 closing ranks, projected forward using a linear trend. ' +
                'Each result is bucketed by z-score against the projection\'s standard deviation.',
            },
            {
              title: 'No ads, no spam',
              body:
                'We do not sell your rank to counseling agencies. The predictor is a free tool built to help you choose — nothing else.',
            },
            {
              title: 'Launch scope',
              body:
                'NITs, IIITs and GFTIs (JEE Main). IITs (JEE Advanced) come in a separate predictor. State-level counseling follows.',
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
