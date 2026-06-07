import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerPath } from '@canvas/data/models/CareerPath';
import type { ICareerPath } from '@canvas/data/models/CareerPath';
import BrowseClient from '@/features/career-explorer/components/BrowseClient';
import type { BrowseCareer } from '@/features/career-explorer/types';

const SITE_ORIGIN = 'https://www.canvasclasses.in';

// ISR — the career library changes rarely. Cache 24h instead of querying
// Mongo on every visit (per CLAUDE.md §10 caching rules).
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Browse All Careers — Career Explorer',
  description:
    'Browse careers by family, by the school subjects you enjoy, or by the evergreen human needs they serve. No quiz required.',
  keywords: [
    'list of careers India',
    'careers after 12th',
    'careers by subject',
    'career options list',
    'browse careers',
  ],
  alternates: { canonical: `${SITE_ORIGIN}/career-explorer/browse` },
  openGraph: {
    title: 'Browse Every Career in Our Library — Career Explorer',
    description:
      'Browse careers by family, by the school subjects you enjoy, or by the evergreen human needs they serve. No quiz required.',
    url: `${SITE_ORIGIN}/career-explorer/browse`,
    siteName: 'Canvas Classes',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Browse Every Career in Our Library',
    description: 'Browse careers by family, by subject, or by the human need they serve. No quiz required.',
  },
};

type Lean = Pick<
  ICareerPath,
  | '_id'
  | 'name'
  | 'family'
  | 'one_liner'
  | 'hidden_gem'
  | 'school_subjects'
  | 'evergreen_sector'
  | 'demand_trajectory'
  | 'is_active'
>;

export default async function BrowsePage() {
  await connectToDatabase();
  const rows = await CareerPath.find({ is_active: true })
    .select('_id name family one_liner hidden_gem school_subjects evergreen_sector demand_trajectory')
    .limit(500)
    .lean<Lean[]>();

  const careers: BrowseCareer[] = rows.map((r) => ({
    _id: r._id,
    name: r.name,
    family: r.family,
    one_liner: r.one_liner,
    hidden_gem: Boolean(r.hidden_gem),
    school_subjects: r.school_subjects ?? [],
    evergreen_sector: r.evergreen_sector,
    demand_trajectory: r.demand_trajectory,
  }));

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Browse Every Career in Our Library',
    description:
      'Browse careers by family, by the school subjects you enjoy, or by the evergreen human needs they serve.',
    url: `${SITE_ORIGIN}/career-explorer/browse`,
    isPartOf: { '@type': 'WebSite', name: 'Canvas Classes', url: SITE_ORIGIN },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: careers.length,
      itemListElement: careers.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_ORIGIN}/career-explorer/careers/${String(c._id)}`,
        name: c.name,
      })),
    },
  };
  const itemListJson = JSON.stringify(itemListJsonLd)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/'/g, '\\u0027');

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJson }} />
      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/career-explorer" className="text-xs text-white/50 hover:text-white/80">
          ← Career Explorer
        </Link>
        <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Browse <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">every career</span> in our library
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          Not ready for the full questionnaire? Browse by what you&apos;re already curious about.
          Filter by the school subjects you actually enjoy, by industry family, or by the
          human need a career quietly serves.
        </p>

        <BrowseClient careers={careers} />
      </section>
    </main>
  );
}
