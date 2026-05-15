import type { Metadata } from 'next';
import Link from 'next/link';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';
import type { ICareerPath } from '@/lib/models/CareerPath';
import BrowseClient from './BrowseClient';
import type { BrowseCareer } from './types';

export const metadata: Metadata = {
  title: 'Browse All Careers — Career Explorer | Canvas Classes',
  description:
    'Browse careers by family, by the school subjects you enjoy, or by the evergreen human needs they serve. No quiz required.',
  alternates: { canonical: 'https://canvasclasses.com/career-explorer/browse' },
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

  return (
    <main className="min-h-screen bg-[#050505] text-white">
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
