import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { Visuals } from '@/features/career-guide/components/visuals';
import { CARD_META } from '@/features/career-guide/components/cardMeta';
import { TOPICS, getTopicBySlug } from '@/features/career-guide/data/topics';
import '../../career-guide.css';

/*
 * /career-guide/topics/[slug] — programmatic SEO landing pages.
 *
 * Curated entry points keyed to head search queries. Content lives in
 * features/career-guide/data/topics.ts; this route renders one page per
 * entry, pulling live career-spec data from MongoDB for the featured cards.
 *
 * JSON-LD: Article + BreadcrumbList (Canvas → Career Guide → [topic]).
 */

// 24-hour ISR — programmatic SEO landings curated in features/career-guide/
// data/topics.ts plus a Mongo lookup. Quarterly editorial cadence, and the
// generateStaticParams above pre-renders all topics at build time. Removes
// the per-request Mongo hit that was contributing to Atlas pool pressure.
// Per CLAUDE.md §10.5 ("Effectively static → 86400").
export const revalidate = 86400;

const SITE_ORIGIN = 'https://www.canvasclasses.in';

const ARCHETYPE_LABEL: Record<string, string> = {
  emerging: 'Emerging',
  transforming: 'Transforming',
  traditional: 'Traditional',
};

type ExposureLevel = 'low' | 'moderate' | 'high' | 'very_high';
type FeaturedRow = {
  _id: string;
  slug: string;
  display_name: string;
  category: 'engineering' | 'medical' | 'crossover';
  archetype: 'transforming' | 'emerging' | 'traditional';
  one_line: string;
  last_full_review?: string;
  // Ranked-listicle extras (read live so the page never hardcodes numbers).
  income?: { year_5?: { p25: number; median: number; p75: number } };
  ai_exposure?: {
    horizon_5y?: { level: ExposureLevel };
    horizon_10y?: { level: ExposureLevel };
  };
};

const AI_RISK: Record<ExposureLevel, { label: string; cls: string }> = {
  low: { label: 'Low', cls: 'text-emerald-300 border-emerald-400/30 bg-emerald-400/10' },
  moderate: { label: 'Moderate', cls: 'text-amber-300 border-amber-400/30 bg-amber-400/10' },
  high: { label: 'High', cls: 'text-red-300 border-red-400/30 bg-red-400/10' },
  very_high: { label: 'Very high', cls: 'text-red-300 border-red-400/30 bg-red-400/10' },
};

const fmtPay = (b?: { p25: number; median: number; p75: number }) =>
  b ? `₹${b.median}L` : '—';
const fmtRange = (b?: { p25: number; median: number; p75: number }) =>
  b ? `₹${b.p25}–${b.p75}L range` : '';

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return { title: 'Topic not found' };

  const canonical = `${SITE_ORIGIN}/career-guide/topics/${topic.slug}`;
  return {
    title: topic.title,
    description: topic.metaDescription,
    alternates: { canonical },
    openGraph: {
      title: topic.title,
      description: topic.metaDescription,
      url: canonical,
      type: 'article',
      siteName: 'Canvas Classes',
    },
    twitter: {
      card: 'summary_large_image',
      title: topic.title,
      description: topic.metaDescription,
    },
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  await connectToDatabase();
  const specs = await CareerSpec.find({
    slug: { $in: topic.featuredSlugs },
    status: 'published',
    deleted_at: null,
  })
    .select('slug display_name category archetype one_line last_full_review income.year_5 ai_exposure.horizon_5y ai_exposure.horizon_10y')
    .lean<FeaturedRow[]>();

  // Preserve the order declared in topics.ts (not Mongo's natural order).
  const order = new Map(topic.featuredSlugs.map((s, i) => [s, i]));
  specs.sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));

  // Ranked listicle support: a slug→spec lookup + the per-rank editorial reasons.
  const specBySlug = new Map(specs.map((s) => [s.slug, s]));
  const rankedRows = topic.ranked
    ? topic.ranked.items
        .map((it) => ({ ...it, spec: specBySlug.get(it.slug) }))
        .filter((r): r is typeof r & { spec: FeaturedRow } => Boolean(r.spec))
    : [];
  // Sibling ranked guides for cross-linking (crawl + authority + UX).
  const relatedRanked = topic.ranked
    ? TOPICS.filter((t) => t.ranked && t.slug !== topic.slug)
    : [];

  const canonical = `${SITE_ORIGIN}/career-guide/topics/${topic.slug}`;

  // JSON-LD: Article + BreadcrumbList. Mirrors the per-spec detail page
  // pattern so Google can read these as editorial topic articles, not
  // collection listings.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: topic.intro.headline,
    description: topic.metaDescription,
    datePublished: new Date('2026-05-01').toISOString(),
    dateModified: new Date().toISOString(),
    author: { '@type': 'Organization', name: 'Canvas Classes editorial', url: SITE_ORIGIN },
    publisher: {
      '@type': 'Organization',
      name: 'Canvas Classes',
      url: SITE_ORIGIN,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: topic.title,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Canvas Classes', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Career Guide', item: `${SITE_ORIGIN}/career-guide` },
      { '@type': 'ListItem', position: 3, name: topic.intro.eyebrow, item: canonical },
    ],
  };

  // Ranked pages emit an ORDERED ItemList of Occupations with salary markup —
  // the schema Google's AI Overviews use to understand "top/best/highest-paying"
  // rankings. Each item carries the year-5 median as estimatedSalary (INR/year).
  const itemListSchema = topic.ranked
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: topic.title,
        numberOfItems: rankedRows.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: rankedRows.map((r, i) => {
          const band = r.spec.income?.year_5;
          return {
            '@type': 'ListItem',
            position: i + 1,
            name: r.spec.display_name,
            url: `${SITE_ORIGIN}/career-guide/${r.spec.slug}`,
            item: {
              '@type': 'Occupation',
              name: r.spec.display_name,
              occupationalCategory: 'Engineering',
              ...(band
                ? {
                    estimatedSalary: {
                      '@type': 'MonetaryAmountDistribution',
                      name: 'Year-five total compensation',
                      currency: 'INR',
                      duration: 'P1Y',
                      median: band.median * 100000,
                      percentile25: band.p25 * 100000,
                      percentile75: band.p75 * 100000,
                    },
                  }
                : {}),
            },
          };
        }),
      }
    : null;

  // FAQPage schema for any topic that carries an FAQ (ranked or curated) — wins
  // the question drop-downs in search and feeds AI-engine answers.
  const faqSchema =
    topic.faq && topic.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: topic.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  return (
    <main className="cg-page min-h-screen bg-[#060606] text-white" style={{ position: 'relative' }}>
      <div className="cg-vignette" aria-hidden />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="relative z-[1] mx-auto pt-24 pb-24 px-6 md:px-12" style={{ maxWidth: 1180 }}>
        <Link
          href="/career-guide"
          className="inline-flex items-center gap-1.5 text-[13px] text-white/55 hover:text-white/85 transition-colors mb-8"
        >
          ← All careers
        </Link>

        {/* Hero */}
        <header className="pt-2 pb-12">
          <div className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>{topic.intro.eyebrow}</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-semibold tracking-tight leading-[1.08] mb-7 max-w-[920px]">
            {topic.intro.headline}
          </h1>
          <div className="max-w-[760px] space-y-4 text-[17px] md:text-[17.5px] text-white/75 leading-relaxed">
            {topic.intro.lead.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </header>

        {topic.ranked ? (
          /* ── RANKED listicle layout ─────────────────────────────────── */
          <>
            {/* Quotable direct answer — the sentence AI engines lift. */}
            <section aria-label="Quick answer" className="mt-10">
              <div className="rounded-2xl border border-orange-400/20 bg-gradient-to-br from-orange-500/[0.07] to-transparent p-6 md:p-7">
                <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-white/55">
                  <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1">
                    Ranked on {topic.ranked.criterion}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1">
                    As of {topic.ranked.asOf}
                  </span>
                </div>
                <p className="text-[16px] md:text-[16.5px] leading-relaxed text-white/85 m-0">
                  {topic.ranked.answerSummary}
                </p>
              </div>
            </section>

            {/* Comparison table — AI engines extract and quote tables. */}
            <section aria-labelledby="comparison" className="mt-12">
              <h2 id="comparison" className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-5">
                At a glance
              </h2>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full border-collapse text-left text-[14px]">
                  <thead>
                    <tr className="bg-white/[0.03] text-white/55 font-mono text-[11px] uppercase tracking-[0.06em]">
                      <th className="px-4 py-3 font-medium">#</th>
                      <th className="px-4 py-3 font-medium">Career</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">Year-5 median pay</th>
                      <th className="px-4 py-3 font-medium whitespace-nowrap">AI risk (5y → 10y)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rankedRows.map((r, i) => {
                      const ai5 = r.spec.ai_exposure?.horizon_5y?.level;
                      const ai10 = r.spec.ai_exposure?.horizon_10y?.level;
                      return (
                        <tr key={r.slug} className="border-t border-white/[0.06]">
                          <td className="px-4 py-3 font-mono text-white/40">{i + 1}</td>
                          <td className="px-4 py-3">
                            <Link href={`/career-guide/${r.slug}`} className="text-white hover:text-orange-200 transition-colors font-medium">
                              {r.spec.display_name}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-white/85 whitespace-nowrap" title={fmtRange(r.spec.income?.year_5)}>
                            {fmtPay(r.spec.income?.year_5)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="text-white/70">
                              {ai5 ? AI_RISK[ai5].label : '—'} → {ai10 ? AI_RISK[ai10].label : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* The ranked ordered list — real <ol> with a reason per rank. */}
            <section aria-labelledby="ranking" className="mt-14">
              <h2 id="ranking" className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-7">
                The ranking
              </h2>
              <ol className="space-y-5 list-none p-0 m-0">
                {rankedRows.map((r, i) => {
                  const ai5 = r.spec.ai_exposure?.horizon_5y?.level;
                  return (
                    <li key={r.slug} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-black font-bold text-[15px]">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                            <h3 className="text-[18px] font-semibold text-white m-0">
                              <Link href={`/career-guide/${r.slug}`} className="hover:text-orange-200 transition-colors">
                                {r.spec.display_name}
                              </Link>
                            </h3>
                            <span className="font-mono text-[12px] text-white/55">
                              {fmtPay(r.spec.income?.year_5)} median · year 5
                            </span>
                            {ai5 && (
                              <span className={`rounded-full border px-2 py-0.5 text-[11px] ${AI_RISK[ai5].cls}`}>
                                AI risk: {AI_RISK[ai5].label}
                              </span>
                            )}
                          </div>
                          <p className="text-[14.5px] text-white/70 leading-relaxed m-0">{r.reason}</p>
                          {r.suitsYouIf && (
                            <p className="mt-2 text-[13.5px] text-white/55 m-0">
                              <span className="text-white/70 font-medium">Pick this if</span> {r.suitsYouIf}
                            </p>
                          )}
                          <Link
                            href={`/career-guide/${r.slug}`}
                            className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-orange-300 hover:text-orange-200 transition-colors"
                          >
                            Read the full brief <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* How we ranked this — credibility + GEO trust signal. */}
            <section aria-labelledby="methodology" className="mt-14">
              <h2 id="methodology" className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-5">
                How we ranked this
              </h2>
              <div className="max-w-[820px] space-y-4 text-[15px] text-white/70 leading-relaxed">
                {topic.ranked.methodology.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          </>
        ) : (
          /* ── Curated grid layout (original) ─────────────────────────── */
          <section aria-labelledby="featured" className="mt-12">
            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4 mb-7">
              <h2 id="featured" className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white">
                The careers we&apos;d feature for this question
              </h2>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/[0.22]">
                {specs.length} of 12
              </span>
            </div>

            {specs.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
                <div className="text-lg font-semibold text-white">
                  Careers in this topic are being prepared.
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {specs.map((spec) => (
                  <TopicCareerCard key={spec._id} spec={spec} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* "What to think about" framings */}
        <section aria-labelledby="framings" className="mt-20">
          <h2
            id="framings"
            className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-7"
          >
            What to think about
          </h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {topic.framings.map((f, i) => (
              <article
                key={i}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
              >
                <h3 className="text-[16px] font-semibold text-white mb-3 leading-snug">
                  {f.title}
                </h3>
                <p className="text-[14.5px] text-white/65 leading-relaxed">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Optional FAQ */}
        {topic.faq && topic.faq.length > 0 && (
          <section aria-labelledby="topic-faq" className="mt-20">
            <h2
              id="topic-faq"
              className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-7"
            >
              Common questions
            </h2>
            <div className="space-y-5 max-w-[860px]">
              {topic.faq.map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
                >
                  <h3 className="text-[16.5px] font-semibold text-white mb-2 leading-snug">
                    {item.q}
                  </h3>
                  <p className="text-[14.5px] text-white/70 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related ranked guides (cross-link for crawl + authority + UX) */}
        {relatedRanked.length > 0 && (
          <section aria-labelledby="related" className="mt-20">
            <h2 id="related" className="text-[24px] font-semibold tracking-[-0.01em] m-0 text-white mb-7">
              Other ranked guides
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedRanked.map((t) => (
                <Link
                  key={t.slug}
                  href={`/career-guide/topics/${t.slug}`}
                  className="group p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-orange-400/30 transition-colors"
                >
                  <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/45 mb-2">
                    {t.intro.eyebrow}
                  </div>
                  <div className="text-[15.5px] font-semibold text-white leading-snug group-hover:text-orange-200 transition-colors">
                    {t.intro.headline}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Closing — read all 12 */}
        <section className="mt-20 p-7 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/55 mb-3">
            More to read
          </div>
          <p className="text-[16px] text-white/80 leading-relaxed max-w-[680px] mb-5">
            These are the ones we&apos;d feature for this question. The full guide
            covers twelve careers across engineering, medicine, and crossover paths
            — read them all and pick on the work, not the title.
          </p>
          <Link
            href="/career-guide"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold text-sm hover:brightness-110 transition"
          >
            Read all 12 career briefs
            <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </main>
  );
}

/* ── Featured card (same visual as the index page; trimmed) ───────────── */

function TopicCareerCard({ spec }: { spec: FeaturedRow }) {
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
          <span className={`cg-badge ${spec.archetype}`}>
            {ARCHETYPE_LABEL[spec.archetype]}
          </span>
        </div>
        <p className="text-[14px] leading-[1.5] text-white/65 m-0 mb-auto pb-4">
          {spec.one_line}
        </p>
        <div className="flex justify-between items-end gap-3 pt-[14px] border-t border-white/[0.08] font-mono text-[11px] tracking-[0.02em] text-white/[0.22]">
          <span className="max-w-[60%] leading-[1.45]">{note}</span>
          <span className="whitespace-nowrap">
            Refreshed&nbsp;&nbsp;{spec.last_full_review ?? '—'}
          </span>
        </div>
      </div>
    </Link>
  );
}
