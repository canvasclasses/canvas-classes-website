import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';
import { CareerMatch } from '@/lib/models/CareerMatch';
import { CareerPath } from '@/lib/models/CareerPath';
import ProfileDetailClient from './ProfileDetailClient';

export const dynamic = 'force-dynamic';

export default async function AdminProfileDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  const { id } = await params;
  await connectToDatabase();

  type ProfileDoc = Record<string, unknown> & { _id: string };
  type MatchDoc = {
    _id: string;
    career_id: string;
    computed_score: number;
    computed_bucket: string;
    admin_override?: { bucket?: string } | null;
  };
  type CareerDoc = { _id: string; name?: string; family?: string };

  const profile = await CareerProfile.findById(id).lean<ProfileDoc | null>();
  if (!profile) notFound();
  const matches = await CareerMatch.find({ profile_id: id }).sort({ computed_score: -1 }).lean<MatchDoc[]>();
  const careers = await CareerPath.find({ _id: { $in: matches.map((m) => m.career_id) } }).lean<CareerDoc[]>();
  const careerById = new Map<string, CareerDoc>(careers.map((c) => [c._id, c]));

  const hydrated = matches.map((m) => ({
    ...m,
    career: careerById.get(m.career_id) ?? null,
    effective_bucket: m.admin_override?.bucket ?? m.computed_bucket,
  }));

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer/profiles" className="text-sm text-white/60 hover:text-white/90">← All profiles</Link>
        <h1 className="mt-2 text-3xl font-semibold">Profile <span className="font-mono text-xl text-white/60">{id.slice(0, 8)}</span></h1>
        <ProfileDetailClient profile={profile} matches={hydrated} />
      </div>
    </main>
  );
}
