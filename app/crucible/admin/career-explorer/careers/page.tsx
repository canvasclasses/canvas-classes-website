import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';

export const dynamic = 'force-dynamic';

export default async function AdminCareersList() {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  await connectToDatabase();
  type CareerRow = {
    _id: string;
    name: string;
    family: string;
    riasec_primary?: string;
    riasec_secondary?: string[];
    required_stream?: string[];
    hidden_gem?: boolean;
    is_active?: boolean;
  };
  const careers = await CareerPath.find({}).sort({ name: 1 }).limit(200).lean<CareerRow[]>();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer" className="text-sm text-white/60 hover:text-white/90">← Career Explorer admin</Link>
        <h1 className="mt-2 text-3xl font-semibold">Careers</h1>
        <p className="mt-1 text-white/60">The 9-layer taxonomy powering matching. Edit each career below.</p>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/50">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Family</th>
                <th className="px-4 py-2">RIASEC</th>
                <th className="px-4 py-2">Streams</th>
                <th className="px-4 py-2">Hidden gem?</th>
                <th className="px-4 py-2">Active</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {careers.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-6 text-center text-white/40">No careers yet. Run the seed script first.</td></tr>
              ) : careers.map((c) => (
                <tr key={c._id} className="border-t border-white/5">
                  <td className="px-4 py-2 font-medium">{c.name}</td>
                  <td className="px-4 py-2 text-white/60">{c.family}</td>
                  <td className="px-4 py-2">{c.riasec_primary}{c.riasec_secondary?.length ? ' · ' + c.riasec_secondary.join('') : ''}</td>
                  <td className="px-4 py-2 text-white/70">{(c.required_stream ?? []).join('/')}</td>
                  <td className="px-4 py-2">{c.hidden_gem ? 'Yes' : '—'}</td>
                  <td className="px-4 py-2">{c.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-right">
                    <Link href={`/crucible/admin/career-explorer/careers/${c._id}`} className="text-orange-300 hover:text-orange-200">Edit →</Link>
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
