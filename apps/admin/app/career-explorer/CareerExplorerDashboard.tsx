import Link from 'next/link';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerPath } from '@canvas/data/models/CareerPath';
import { CareerQuestion } from '@canvas/data/models/CareerQuestion';
import { CareerProfile } from '@canvas/data/models/CareerProfile';
import { CareerMatch } from '@canvas/data/models/CareerMatch';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import { BookOpen, ListChecks, Users2, Settings2, FileText } from 'lucide-react';

// Server-rendered dashboard body for /career-explorer. Extracted from the
// route page so the <AdminPanel> auth gate runs (and can redirect) BEFORE any
// of these DB queries execute — JSX children are created lazily, so an
// unauthorised visitor never reaches connectToDatabase().
export default async function CareerExplorerDashboard() {
  await connectToDatabase();

  const [careers, questions, profiles, matches, specsPublished] = await Promise.all([
    CareerPath.countDocuments({ is_active: true }),
    CareerQuestion.countDocuments({ is_active: true }),
    CareerProfile.countDocuments({}),
    CareerMatch.countDocuments({}),
    CareerSpec.countDocuments({ status: 'published', deleted_at: null }),
  ]);

  type ProfileRow = {
    _id: string;
    meta?: { email?: string; class_level?: string };
    status?: string;
    progress_pct?: number;
    updated_at?: Date;
  };
  const recentProfiles = await CareerProfile.find({})
    .sort({ updated_at: -1 })
    .limit(20)
    .lean<ProfileRow[]>();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-300">Admin</div>
            <h1 className="mt-1 text-3xl font-semibold">Career Explorer</h1>
          </div>
          <Link href="/" className="text-sm text-white/60 hover:text-white/90">← Back to admin home</Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-5">
          <Stat label="Active careers" value={careers} />
          <Stat label="Active questions" value={questions} />
          <Stat label="Profiles started" value={profiles} />
          <Stat label="Matches stored" value={matches} />
          <Stat label="Live specs (published)" value={specsPublished} />
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Tile href="/career-explorer/specs" icon={<FileText />} title="Live Specs (V1)" hint="Editorial career briefs — honest 2026 framing, income distributions, AI exposure. Refresh quarterly." />
          <Tile href="/career-explorer/careers" icon={<BookOpen />} title="Careers (taxonomy)" hint="The 9-layer taxonomy that powers the quiz matcher." />
          <Tile href="/career-explorer/questions" icon={<ListChecks />} title="Questions" hint="Review and tweak the 50-question explorer." />
          <Tile href="/career-explorer/profiles" icon={<Users2 />} title="Student profiles" hint="See completed profiles and override matches." />
          <Tile href="/career-explorer/seed" icon={<Settings2 />} title="Seed / reset" hint="Load the default questions and careers into Mongo." />
        </div>

        <h2 className="mt-12 text-xl font-semibold">Recent profiles</h2>
        <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/50">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Progress</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {recentProfiles.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-white/40">No profiles yet.</td></tr>
              ) : recentProfiles.map((p) => (
                <tr key={p._id} className="border-t border-white/5">
                  <td className="px-4 py-2 font-mono text-xs text-white/60">{p._id.slice(0, 8)}</td>
                  <td className="px-4 py-2">{p.meta?.email ?? '—'}</td>
                  <td className="px-4 py-2">{p.meta?.class_level ?? '—'}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.progress_pct ?? 0}%</td>
                  <td className="px-4 py-2">{p.updated_at ? new Date(p.updated_at).toLocaleString('en-IN') : '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/career-explorer/profiles/${p._id}`} className="text-orange-300 hover:text-orange-200">Open →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
function Tile({ href, icon, title, hint }: { href: string; icon: React.ReactNode; title: string; hint: string }) {
  return (
    <Link href={href} className="group rounded-xl border border-white/10 bg-[#0B0F15] p-5 transition hover:border-white/25 hover:bg-white/5">
      <div className="text-orange-300">{icon}</div>
      <div className="mt-2 text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/60">{hint}</div>
    </Link>
  );
}
