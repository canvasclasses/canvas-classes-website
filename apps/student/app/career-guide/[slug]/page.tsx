import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec, type ICareerSpec } from '@canvas/data/models/CareerSpec';
import CareerBriefShareButton from '@/features/career-guide/components/CareerBriefShareButton';
import HeroBandVisual from '@/features/career-guide/components/detail/HeroBandVisual';
import {
  Section,
  StatStrip,
  OldNewSplit,
  IncomeChart,
  SubPaths,
  AIProjection,
  PathIn,
  Skills,
  Risks,
  IndiaStrip,
  Pivots,
  People,
  Sources,
} from '@/features/career-guide/components/detail/sections';
import { CARD_META } from '@/features/career-guide/components/cardMeta';
import { buildFaqs } from '@/features/career-guide/lib/buildFaqs';
import './career-detail.css';

/*
 * Career-spec detail page — V3 design (magazine-style, data-rich).
 *
 * One template covers all 12 published careers. Every section is driven by
 * CareerSpec fields; the only career-specific view-layer data is the
 * per-career visual (mapped via CARD_META from features/career-guide/
 * components/cardMeta.ts).
 *
 * Section order matches the editorial flow we want a parent + student to
 * read together:
 *   Hero (incl. 4-stat snapshot)
 *   → The shift (parents' picture vs 2026 reality)
 *   → Income (ribbon chart with p25/median/p75)
 *   → Sub-paths (it's not one career — it's several)
 *   → AI exposure (1y / 5y / 10y bars + what AI can't replace)
 *   → Path in (Class 12 → first role timeline + college tiers + min-viable path)
 *   → Skills to build (4 moat skills with "How to build it" callouts)
 *   → Honest cons (rose-tinted risks grid)
 *   → India context (4-cell stat + cities row)
 *   → Pivots (adjacent careers)
 *   → Real people (3 anonymised example paths)
 *   → Sources + editorial footer
 *   → CTA strip back to /career-guide
 *
 * Why this section order: parents read the 4 stats first (anchoring on a
 * concrete number), then the "shift" section (which resolves whether their
 * mental model is current), then income (the question they actually care
 * about), then the path in (the practical "how do we get there?"). The
 * harder stuff — risks, India context — comes after they're already engaged.
 */

// ISR — see comment on /career-guide index. Detail pages are quarterly-fresh
// content; 1-hour revalidate eliminates the per-request MongoDB hit (× 12
// detail pages × every visit) that was saturating the Atlas connection pool.
export const revalidate = 3600;

type SpecLean = Omit<ICareerSpec, 'deleted_at' | 'deleted_by' | 'created_by' | 'updated_by'>;

const SITE_ORIGIN = 'https://canvasclasses.in';

const CATEGORY_LABEL: Record<SpecLean['category'], string> = {
  engineering: 'Engineering track',
  medical: 'Medical track',
  crossover: 'Crossover',
};

const ARCHETYPE_LABEL: Record<SpecLean['archetype'], string> = {
  emerging: 'Emerging',
  transforming: 'Transforming',
  traditional: 'Traditional',
};

const ARCHETYPE_COLOR: Record<SpecLean['archetype'], string> = {
  emerging: 'var(--cd-emerging)',
  transforming: 'var(--cd-transforming)',
  traditional: 'var(--cd-traditional)',
};

// ── Metadata + JSON-LD ─────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await connectToDatabase();
  const spec = await CareerSpec.findOne({ slug, status: 'published', deleted_at: null })
    .select('display_name one_line')
    .lean<{ display_name?: string; one_line?: string } | null>();

  if (!spec) return { title: 'Career not found · Canvas Classes' };

  const title = `${spec.display_name} — Career brief 2026 | Canvas Classes`;
  const description = spec.one_line ?? '';
  const canonical = `${SITE_ORIGIN}/career-guide/${slug}`;
  const ogImage = `${SITE_ORIGIN}/api/v2/career-guide/${slug}/brief`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'article',
      siteName: 'Canvas Classes',
      images: [{ url: ogImage, width: 1080, height: 1920, alt: `${spec.display_name} — career brief` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────

export default async function CareerSpecDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectToDatabase();
  const spec = await CareerSpec.findOne({ slug, status: 'published', deleted_at: null }).lean<SpecLean | null>();
  if (!spec) notFound();

  const meta = CARD_META[spec.slug];
  const canonical = `${SITE_ORIGIN}/career-guide/${spec.slug}`;
  const ogImage = `${SITE_ORIGIN}/api/v2/career-guide/${spec.slug}/brief`;

  // JSON-LD: Article + BreadcrumbList — preserved from V2.
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: spec.display_name,
    description: spec.one_line,
    image: ogImage,
    datePublished: spec.published_at
      ? new Date(spec.published_at).toISOString()
      : new Date(spec.last_full_review + '-01').toISOString(),
    dateModified: new Date(spec.last_full_review + '-01').toISOString(),
    // Named author byline — Google rewards specific, identifiable authorship
    // for editorial content. The Organization stays in `publisher`.
    author: [
      { '@type': 'Person', name: 'Canvas Classes editorial team', url: `${SITE_ORIGIN}/about` },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Canvas Classes',
      url: SITE_ORIGIN,
      logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/icon.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: [
      spec.display_name,
      `${spec.display_name} salary India`,
      `${spec.display_name} career path`,
      `${spec.display_name} AI exposure`,
      'JEE career guide',
      'NEET career guide',
    ].join(', '),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Canvas Classes', item: SITE_ORIGIN },
      { '@type': 'ListItem', position: 2, name: 'Career Guide', item: `${SITE_ORIGIN}/career-guide` },
      { '@type': 'ListItem', position: 3, name: spec.display_name, item: canonical },
    ],
  };

  // FAQPage schema — must match the visible "Common questions" section
  // below exactly. Google drops the rich-result if the page diverges from
  // the schema, so both consume the same buildFaqs() output.
  const faqs = buildFaqs(spec);
  const faqSchema = faqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <main className="cd-page min-h-screen bg-[#060606] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="cd-container">
        <Link href="/career-guide" className="cd-back">
          ← All careers
        </Link>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <header className="cd-hero">
          {/* Animated band visual — reuses the per-career index visual at a
              wide aspect ratio with fading top/bottom edges. */}
          {meta && <HeroBandVisual visualKey={meta.visualKey} />}

          <div className="cd-eyebrow">
            <span>Career brief</span>
            <span className="sep">·</span>
            <span>{CATEGORY_LABEL[spec.category]}</span>
            <span className="sep">·</span>
            <span style={{ color: ARCHETYPE_COLOR[spec.archetype] }}>{ARCHETYPE_LABEL[spec.archetype]}</span>
          </div>

          <h1 className="cd-title">{spec.display_name}</h1>
          <p className="cd-sub">{spec.one_line}</p>

          <div className="cd-actions">
            {spec.last_full_review && (
              <span className="cd-pill">
                <span className="dot" />
                Last reviewed {spec.last_full_review}
                {spec.next_review_due && <> · next review {spec.next_review_due}</>}
              </span>
            )}
            <CareerBriefShareButton slug={spec.slug} displayName={spec.display_name} />
          </div>

          {/* Named author byline — sits just under the actions strip. */}
          <p className="mt-3 text-[12.5px] text-white/45 leading-relaxed">
            Edited by the{' '}
            <Link href="/about" className="text-white/70 hover:text-white underline-offset-2 hover:underline">
              Canvas Classes editorial team
            </Link>
            {spec.last_full_review && <> · last reviewed {spec.last_full_review}</>}
          </p>

          <StatStrip spec={spec} />
        </header>

        {/* ── THE SHIFT ─────────────────────────────────────────────── */}
        <Section title="The shift" meta="OLD PICTURE → NEW PICTURE">
          <OldNewSplit spec={spec} />
        </Section>

        {/* ── INCOME ─────────────────────────────────────────────────── */}
        <Section title="Income — what people actually earn" meta="P25 · MEDIAN · P75">
          <IncomeChart spec={spec} />
        </Section>

        {/* ── SUB-PATHS ──────────────────────────────────────────────── */}
        {spec.sub_paths && spec.sub_paths.length > 0 && (
          <Section title="It's not one career — it's several" meta={`${spec.sub_paths.length} SUB-PATHS`}>
            <SubPaths spec={spec} />
          </Section>
        )}

        {/* ── AI PROJECTION ──────────────────────────────────────────── */}
        <Section title="How much AI reshapes this career" meta="1Y · 5Y · 10Y">
          <AIProjection spec={spec} />
        </Section>

        {/* ── PATH IN ───────────────────────────────────────────────── */}
        <Section title="The path in" meta="CLASS 12 → FIRST ROLE">
          <PathIn spec={spec} />
        </Section>

        {/* ── SKILLS ─────────────────────────────────────────────────── */}
        <Section title="What to build during college" meta="AI-RESISTANT SKILLS">
          <Skills spec={spec} />
        </Section>

        {/* ── RISKS ──────────────────────────────────────────────────── */}
        <Section title="What nobody tells you" meta="HONEST DOWNSIDES">
          <Risks spec={spec} />
        </Section>

        {/* ── INDIA STRIP ─────────────────────────────────────────────── */}
        <Section title="The India-specific picture" meta="GEOGRAPHY · ACCESS">
          <IndiaStrip spec={spec} />
        </Section>

        {/* ── PIVOTS ─────────────────────────────────────────────────── */}
        {spec.adjacent_careers && spec.adjacent_careers.length > 0 && (
          <Section title="If this doesn't work out" meta="NATURAL PIVOTS">
            <Pivots spec={spec} />
          </Section>
        )}

        {/* ── REAL PEOPLE ────────────────────────────────────────────── */}
        {spec.example_paths && spec.example_paths.length > 0 && (
          <Section title="Real people who took this path" meta={`${spec.example_paths.length} ANONYMISED EXAMPLES`}>
            <People spec={spec} />
          </Section>
        )}

        {/* ── COMMON QUESTIONS ───────────────────────────────────────── */}
        {/* Renders the same Q&A consumed by the FAQPage JSON-LD above.
            Schema/page parity is required for Google rich results. */}
        {faqs.length > 0 && (
          <Section title="Common questions about this career" meta={`${faqs.length} QUESTIONS`}>
            <div className="space-y-4">
              {faqs.map((item, i) => (
                <article
                  key={i}
                  className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02]"
                >
                  <h3 className="text-[16.5px] font-semibold text-white mb-2 leading-snug">
                    {item.q}
                  </h3>
                  <p className="text-[14.5px] text-white/70 leading-relaxed whitespace-pre-line">
                    {item.a}
                  </p>
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* ── SOURCES FOOTER ─────────────────────────────────────────── */}
        <Sources spec={spec} />

        {/* ── BOTTOM CTA ─────────────────────────────────────────────── */}
        <div className="cd-cta-strip">
          <div>
            <h3 className="cd-cta-strip-t">Decided this might be the one?</h3>
            <p className="cd-cta-strip-d">Share with parents · or browse the other 11 careers in this guide.</p>
          </div>
          <Link className="cd-cta-strip-btn" href="/career-guide">
            Browse all careers →
          </Link>
        </div>
      </div>
    </main>
  );
}
