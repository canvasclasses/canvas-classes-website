import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';
import connectToDatabase from '@/lib/mongodb';
import { CareerQuestion } from '@/lib/models/CareerQuestion';

export const dynamic = 'force-dynamic';

export default async function AdminQuestions() {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  await connectToDatabase();
  type QRow = {
    _id: string;
    dimension: string;
    sub_facet?: string;
    order: number;
    format: string;
    prompt: string;
    options: Array<{ id: string; label: string }>;
  };
  const questions = await CareerQuestion.find({}).sort({ order: 1 }).limit(200).lean<QRow[]>();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer" className="text-sm text-white/60 hover:text-white/90">← Career Explorer admin</Link>
        <h1 className="mt-2 text-3xl font-semibold">Questions</h1>
        <p className="mt-1 text-white/60">Review the explorer flow. Edit via the seed script or directly in Mongo until a full editor lands.</p>

        <div className="mt-8 space-y-3">
          {questions.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-6 text-white/50">No questions seeded yet.</div>
          ) : questions.map((q) => (
            <div key={q._id} className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">{q.dimension}{q.sub_facet ? ` · ${q.sub_facet}` : ''}</div>
                  <div className="mt-1 font-semibold">{q.prompt}</div>
                </div>
                <div className="text-xs text-white/40">#{q.order} · {q.format}</div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-white/70">
                {q.options.map((o) => (
                  <li key={o.id}>· {o.label}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
