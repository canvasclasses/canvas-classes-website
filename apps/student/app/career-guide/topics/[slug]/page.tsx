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

// ISR — topic pages curate from the same career-spec data; 1-hour revalidate
// is plenty fresh given quarterly editorial cadence, and removes the per-
// request MongoDB hit on the 4 head-query SEO landings.
export const revalidate = 3600;

const SITE_ORIGIN = 'https://canvasclasses.in';

const ARCHETYPE_LABEL: Record<string, string> = {
  emerging: 'Emerging',
  transforming: 'Transforming',
  traditional: 'Traditional',
};

type FeaturedRow = {
  _id: string;
  slug: string;
  display_name: string;
  category: 'engineering' | 'medical' | 'crossover';
  archetype: 'transforming' | 'emerging' | 'traditional';
  one_line: string;
  last_full_review?: string;
};

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
    .select('slug display_name category archetype one_line last_full_review')
    .lean<FeaturedRow[]>();

  // Preserve the order declared in topics.ts (not Mongo's natural order).
  const order = new Map(topic.featuredSlugs.map((s, i) => [s, i]));
  specs.sort((a, b) => (order.get(a.slug) ?? 999) - (order.get(b.slug) ?? 999));

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

        {/* Featured careers */}
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
