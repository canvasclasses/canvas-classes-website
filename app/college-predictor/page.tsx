import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import PredictorClient from './PredictorClient';
import TopColleges from './TopColleges';
import { TOP_COLLEGES } from './topCollegesData';

export const metadata: Metadata = {
  title: 'JEE Main College Predictor 2025 — NIT, IIIT, GFTI Rank Predictor | Canvas Classes',
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
        <header className="text-center mb-8">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium uppercase tracking-wider">
              Free · JEE Main 2025
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Beta
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            JEE Main College Predictor
          </h1>
          <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Enter your rank or percentile. Get a probability-ranked list of NITs,
            IIITs and GFTIs — built on five years of official JoSAA cutoffs.
          </p>
        </header>

        <div className="mb-10 mx-auto max-w-2xl rounded-xl bg-amber-500/[0.06] border border-amber-500/20 px-4 py-3 flex gap-3 items-start">
          <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M8.485 2.495c.67-1.16 2.36-1.16 3.03 0l6.28 10.875c.67 1.16-.168 2.61-1.515 2.61H3.72c-1.347 0-2.185-1.45-1.515-2.61L8.485 2.495zM10 6a1 1 0 011 1v3a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <div className="text-sm text-amber-100/90 leading-relaxed">
            <span className="font-semibold text-amber-200">This tool is in public beta.</span>{' '}
            Projections are built on five years of JoSAA cutoffs but can still be off in
            edge cases. Use it as a reference alongside official JoSAA data — and if you
            spot something wrong, please let us know.
          </div>
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
