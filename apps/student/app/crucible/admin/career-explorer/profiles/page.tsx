import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';
import connectToDatabase from '@/lib/mongodb';
import { CareerProfile } from '@/lib/models/CareerProfile';

export const dynamic = 'force-dynamic';

export default async function AdminProfilesList() {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  await connectToDatabase();
  type ProfileRow = {
    _id: string;
    meta?: { email?: string; class_level?: string };
    status?: string;
    progress_pct?: number;
    updated_at?: Date;
  };
  const profiles = await CareerProfile.find({}).sort({ updated_at: -1 }).limit(200).lean<ProfileRow[]>();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer" className="text-sm text-white/60 hover:text-white/90">← Career Explorer admin</Link>
        <h1 className="mt-2 text-3xl font-semibold">Student profiles</h1>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/50">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">%</th>
                <th className="px-4 py-2">Updated</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-white/40">No profiles yet.</td></tr>
              ) : profiles.map((p) => (
                <tr key={p._id} className="border-t border-white/5">
                  <td className="px-4 py-2 font-mono text-xs text-white/60">{p._id.slice(0, 8)}</td>
                  <td className="px-4 py-2">{p.meta?.email ?? '—'}</td>
                  <td className="px-4 py-2">{p.meta?.class_level ?? '—'}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.progress_pct ?? 0}%</td>
                  <td className="px-4 py-2">{p.updated_at ? new Date(p.updated_at).toLocaleString('en-IN') : '—'}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/crucible/admin/career-explorer/profiles/${p._id}`} className="text-orange-300 hover:text-orange-200">Open →</Link>
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
