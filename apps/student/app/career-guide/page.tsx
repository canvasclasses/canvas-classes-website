import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { Visuals } from '@/features/career-guide/components/visuals';
import { CARD_META } from '@/features/career-guide/components/cardMeta';
import YearStrip from '@/features/career-guide/components/YearStrip';
import HeroLead from '@/features/career-guide/components/HeroLead';
import './career-guide.css';

/*
 * Student-facing Career Guide index — V2 design, ported from the Claude
 * Design hand-off (career-guide/project/). Server component reads from
 * Mongo directly. Sections are grouped by category (engineering / medical
 * / crossover). Each card features a unique animated SVG visual at the
 * top of the card.
 *
 * The hero leads with a directional headline ("careers worth chasing in
 * 2026 aren't the ones your parents picked in 2011") and a YearStrip
 * visual showing the jobs-list shifting across 2011 → 2026.
 */

// Career briefs refresh on a quarterly editorial cadence (per the doc in
// sitemap.ts). 24-hour ISR is more than fast enough; admin can fire an
// explicit revalidatePath('/career-guide') after publishing a new spec
// if a faster turnaround is ever needed.
export const revalidate = 86400;

const SITE_ORIGIN = 'https://canvasclasses.in';

export const metadata: Metadata = {
  title: 'Career Guide 2026 — Honest career briefs for JEE / NEET aspirants | Canvas Classes',
  description:
    'Editorial career briefs for JEE / NEET students. What each career actually is in 2026 — income distributions, AI exposure, the path in, and the cons nobody else mentions. Refreshed quarterly.',
  alternates: { canonical: `${SITE_ORIGIN}/career-guide` },
  openGraph: {
    title: 'Career Guide 2026 — Canvas Classes',
    description:
      'Honest career briefs for JEE / NEET aspirants. Income distributions, AI exposure assessments, the path in, and the cons nobody else mentions.',
    url: `${SITE_ORIGIN}/career-guide`,
    type: 'website',
    siteName: 'Canvas Classes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career Guide 2026 — Canvas Classes',
    description: 'Honest career briefs for JEE / NEET aspirants.',
  },
};

type IndexRow = {
  _id: string;
  slug: string;
  display_name: string;
  category: 'engineering' | 'medical' | 'crossover';
  archetype: 'transforming' | 'emerging' | 'traditional';
  one_line: string;
  last_full_review?: string;
};

const CATEGORY_LABEL: Record<IndexRow['category'], string> = {
  engineering: 'Engineering track',
  medical: 'Medical track',
  crossover: 'Crossover / non-traditional',
};

const ARCHETYPE_LABEL: Record<IndexRow['archetype'], string> = {
  emerging: 'Emerging',
  transforming: 'Transforming',
  traditional: 'Traditional',
};

const EDITORIAL_RULES: Array<[string, string]> = [
  ['Refresh quarterly.', 'Career landscapes shift fast in 2026. Every spec carries a "last reviewed" date.'],
  ['Cons are required.', "Every spec must name downsides. We don't publish without them."],
  ['Income as distributions.', 'Not "average salary" — 25th / median / 75th percentile, because the middle of a distribution tells you almost nothing.'],
  ['AI exposure with explicit confidence.', "When we're uncertain, we say so."],
  ['No coaching-institute sources.', "They're conflicted. We cite NTA bulletins, published salary data, and primary interviews."],
  ['Every career has an exit ramp.', "If this doesn't work out, here's where you go next."],
];

export default async function CareerGuideIndex() {
  await connectToDatabase();
  const specs = await CareerSpec.find({ status: 'published', deleted_at: null })
    .select('slug display_name category archetype one_line last_full_review')
    .sort({ display_name: 1 })
    .limit(100)
    .lean<IndexRow[]>();

  // Group by category. Engineering first → Medical → Crossover. Matches the
  // funnel: JEE-track students are the largest audience, then NEET, then
  // students considering non-traditional crossover roles.
  const grouped: Record<IndexRow['category'], IndexRow[]> = {
    engineering: [],
    medical: [],
    crossover: [],
  };
  for (const s of specs) grouped[s.category]?.push(s);

  // JSON-LD: CollectionPage + ItemList — unchanged from V1.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Career Guide 2026 — Canvas Classes',
    description: 'Editorial career briefs for JEE / NEET students.',
    url: `${SITE_ORIGIN}/career-guide`,
    isPartOf: { '@type': 'WebSite', name: 'Canvas Classes', url: SITE_ORIGIN },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: specs.length,
      itemListElement: specs.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_ORIGIN}/career-guide/${s.slug}`,
        name: s.display_name,
      })),
    },
  };

  return (
    <main className="cg-page min-h-screen bg-[#060606] text-white" style={{ position: 'relative' }}>
      <div className="cg-vignette" aria-hidden />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      {/* Top padding clears the fixed nav (~80-90px). max-w 1280 + horizontal
          padding matches the source design. */}
      <div className="relative z-[1] mx-auto pt-24 pb-24 px-6 md:px-12" style={{ maxWidth: 1280 }}>
        {/* ─── HERO ─────────────────────────────────────────────────────── */}
        <header className="pt-2 pb-16">
          <div className="mb-7 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.06em] text-white/65">
            <span className="cg-hero-dot" />
            <span>A career guide written in 2026 — not 2011</span>
            <span className="opacity-40">·</span>
            <span>For JEE &amp; NEET aspirants</span>
          </div>

          <h1 className="cg-hero-title mb-7">
            The careers worth chasing in <em>2026</em>
            <br />
            aren&apos;t the ones your parents <span className="cg-strike">picked in 2011</span>.
          </h1>

          <HeroLead />

          <YearStrip />

          {/* Content-promise chips — what's inside each brief */}
          <div className="mb-7 flex flex-wrap gap-[10px]">
            {[
              'Real income distributions',
              'AI exposure over 10 years',
              'The path in',
              'Cons nobody mentions',
              'Two real example paths',
              'An exit ramp if it fails',
            ].map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-4 py-[9px] rounded-full border border-white/[0.08] bg-white/[0.02] text-[13.5px] text-white/65"
              >
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--cg-accent)] opacity-70" />
                {label}
              </span>
            ))}
          </div>

          {/* Count + skip-link */}
          <div className="mt-2 flex flex-wrap items-center gap-[22px]">
            <span className="inline-flex items-center gap-[10px] px-4 py-[9px] rounded-full border border-white/[0.08] bg-white/[0.02] text-[13.5px] text-white/65">
              <span className="cg-hero-dot" />
              <span>
                <b className="text-white font-medium">{specs.length}</b> careers published
              </span>
              <span className="opacity-40">·</span>
              <span>refreshed quarterly</span>
            </span>
            <a
              href="#engineering"
              className="text-[14px] text-[var(--cg-accent)] hover:text-orange-200 underline-offset-2 hover:underline"
            >
              Browse the {specs.length} careers ↓
            </a>
          </div>
        </header>

        {/* ─── EMPTY STATE ─────────────────────────────────────────────── */}
        {specs.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="text-lg font-semibold text-white">First careers are being prepared.</div>
            <p className="mt-2 text-sm text-white/60">
              Check back shortly — we&apos;re publishing the first batch of careers across engineering, medical, and
              crossover tracks.
            </p>
          </div>
        ) : (
          (['engineering', 'medical', 'crossover'] as const).map((cat) =>
            grouped[cat].length === 0 ? null : (
              <CareerSection key={cat} id={cat} title={CATEGORY_LABEL[cat]} careers={grouped[cat]} />
            ),
          )
        )}

        {/* ─── EDITORIAL FOOTER ──────────────────────────────────────────── */}
        <section className="mt-[88px] px-10 py-9 rounded-2xl border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.015), rgba(255,255,255,0.003))' }}>
          <div className="mb-[10px] font-mono text-[11px] uppercase tracking-[0.16em] text-white/[0.22]">
            How these are written
          </div>
          <h2 className="text-[24px] font-semibold tracking-[-0.01em] m-0 mb-7 text-white">
            Six rules our editorial team follows.
          </h2>
          <div className="grid gap-x-12 gap-y-[22px] md:grid-cols-2">
            {EDITORIAL_RULES.map(([title, body], i) => (
              <div key={i} className="text-[14.5px] leading-[1.55] text-white/65">
                <b className="text-white font-semibold">{title}</b> {body}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ── CareerSection ─────────────────────────────────────────────────── */

function CareerSection({ id, title, careers }: { id: string; title: string; careers: IndexRow[] }) {
  return (
    <section id={id} className="mt-[72px] scroll-mt-24">
      <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-7">
        <h2 className="text-[26px] font-semibold tracking-[-0.01em] m-0 text-white">{title}</h2>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/[0.22]">
          {careers.length} {careers.length === 1 ? 'Career' : 'Careers'}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
        {careers.map((c) => (
          <CareerCard key={c._id} spec={c} />
        ))}
      </div>
    </section>
  );
}

/* ── CareerCard ─────────────────────────────────────────────────────── */

function CareerCard({ spec }: { spec: IndexRow }) {
  const meta = CARD_META[spec.slug];
  const Visual = meta ? Visuals[meta.visualKey] : null;
  const note = meta?.note ?? '';

  return (
    <Link href={`/career-guide/${spec.slug}`} className="cg-card group">
      {Visual ? <Visual /> : <div className="cg-visual" />}
      <div className="flex flex-col flex-1 px-5 pt-[18px] pb-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="text-[18px] font-semibold tracking-[-0.01em] leading-[1.25] m-0 max-w-[80%] text-white group-hover:text-orange-200 transition-colors">
            {spec.display_name}
          </h3>
          <span className={`cg-badge ${spec.archetype}`}>{ARCHETYPE_LABEL[spec.archetype]}</span>
        </div>
        <p className="text-[14px] leading-[1.5] text-white/65 m-0 mb-auto pb-4">{spec.one_line}</p>
        <div className="flex justify-between items-end gap-3 pt-[14px] border-t border-white/[0.08] font-mono text-[11px] tracking-[0.02em] text-white/[0.22]">
          <span className="max-w-[60%] leading-[1.45]">{note}</span>
          <span className="whitespace-nowrap">Refreshed&nbsp;&nbsp;{spec.last_full_review ?? '—'}</span>
        </div>
      </div>
    </Link>
  );
}
