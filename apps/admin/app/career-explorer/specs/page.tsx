import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';

// Admin listing for the editorial Career Live Specs (V1 of the career guide).
// Distinct from `/career-explorer/careers` — that page edits the older
// 9-layer CareerPath taxonomy used by the quiz matcher. This page edits the
// new prose-heavy editorial briefs (one per career, refreshed quarterly).

export const dynamic = 'force-dynamic';

type Row = {
  _id: string;
  slug: string;
  display_name: string;
  category: 'engineering' | 'medical' | 'crossover';
  archetype: 'transforming' | 'emerging' | 'traditional';
  status: 'draft' | 'published' | 'archived';
  last_full_review?: string;
  next_review_due?: string;
  authors?: string[];
  updated_at?: Date;
  version?: number;
};

const CATEGORY_BADGE: Record<Row['category'], { label: string; color: string }> = {
  engineering: { label: 'Engineering', color: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  medical:     { label: 'Medical',     color: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  crossover:   { label: 'Crossover',   color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
};

const ARCHETYPE_BADGE: Record<Row['archetype'], { label: string; color: string }> = {
  transforming: { label: 'Transforming', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  emerging:     { label: 'Emerging',     color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  traditional:  { label: 'Traditional',  color: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30' },
};

const STATUS_BADGE: Record<Row['status'], { label: string; color: string }> = {
  draft:     { label: 'Draft',     color: 'bg-white/5 text-white/60 border-white/10' },
  published: { label: 'Published', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  archived:  { label: 'Archived',  color: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30' },
};

// Visually flag specs whose next_review_due is in the past or within the next month.
// Cadence is a data property — making it visible on the listing page is the whole
// point. If a spec hasn't been refreshed in 3+ months, the team should see it here
// before a student does.
function reviewState(nextReviewDue?: string): 'overdue' | 'due_soon' | 'fresh' {
  if (!nextReviewDue) return 'overdue';
  const [y, m] = nextReviewDue.split('-').map(Number);
  if (!y || !m) return 'overdue';
  const due = new Date(y, m - 1, 1);
  const now = new Date();
  const monthsAhead = (due.getFullYear() - now.getFullYear()) * 12 + (due.getMonth() - now.getMonth());
  if (monthsAhead < 0) return 'overdue';
  if (monthsAhead < 1) return 'due_soon';
  return 'fresh';
}

const REVIEW_BADGE: Record<ReturnType<typeof reviewState>, { label: string; color: string }> = {
  overdue:  { label: 'Overdue',  color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  due_soon: { label: 'Due soon', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  fresh:    { label: 'Fresh',    color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
};

export default async function AdminCareerSpecsList() {
  const admin = await requireAdmin();
  if (!admin) redirect('/');
  await connectToDatabase();

  const specs = await CareerSpec.find({ deleted_at: null })
    .select('slug display_name category archetype status last_full_review next_review_due authors updated_at version')
    .sort({ updated_at: -1 })
    .limit(200)
    .lean<Row[]>();

  const counts = {
    total: specs.length,
    published: specs.filter((s) => s.status === 'published').length,
    draft: specs.filter((s) => s.status === 'draft').length,
    overdue: specs.filter((s) => reviewState(s.next_review_due) === 'overdue').length,
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Link href="/career-explorer" className="text-sm text-white/60 hover:text-white/90">
          ← Career Explorer admin
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">Career Live Specs</h1>
            <p className="mt-1 max-w-2xl text-white/60">
              Editorial career briefs (V1). One document per career — honest framing about what each career actually is in 2026,
              income distributions, AI-exposure assessment, and the path in. Refresh quarterly.
            </p>
          </div>
          <Link
            href="/career-explorer/specs/new"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-bold text-black hover:opacity-90"
          >
            + New spec
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <Stat label="Total specs" value={counts.total} />
          <Stat label="Published" value={counts.published} accent="emerald" />
          <Stat label="Drafts" value={counts.draft} />
          <Stat label="Overdue for review" value={counts.overdue} accent={counts.overdue > 0 ? 'red' : 'zinc'} />
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0B0F15]">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-left text-xs uppercase tracking-widest text-white/50">
              <tr>
                <th className="px-4 py-3">Career</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Archetype</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last review</th>
                <th className="px-4 py-3">Next review</th>
                <th className="px-4 py-3">Refresh</th>
                <th className="px-4 py-3">v.</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {specs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-white/40">
                    No specs yet. Run the seed script or click <span className="text-orange-300">New spec</span> to add one.
                  </td>
                </tr>
              ) : (
                specs.map((s) => {
                  const cat = CATEGORY_BADGE[s.category];
                  const arch = ARCHETYPE_BADGE[s.archetype];
                  const status = STATUS_BADGE[s.status];
                  const rev = reviewState(s.next_review_due);
                  const review = REVIEW_BADGE[rev];
                  return (
                    <tr key={s._id} className="border-t border-white/5 transition hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-white">{s.display_name}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-white/40">{s.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge cls={cat.color}>{cat.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge cls={arch.color}>{arch.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge cls={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-4 py-3 text-white/70 tabular-nums">{s.last_full_review ?? '—'}</td>
                      <td className="px-4 py-3 text-white/70 tabular-nums">{s.next_review_due ?? '—'}</td>
                      <td className="px-4 py-3">
                        <Badge cls={review.color}>{review.label}</Badge>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-white/50">{s.version ?? 1}</td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/career-explorer/specs/${s._id}`}
                          className="text-orange-300 hover:text-orange-200"
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Stat({ label, value, accent = 'zinc' }: { label: string; value: number; accent?: 'zinc' | 'emerald' | 'red' }) {
  const color = accent === 'emerald' ? 'text-emerald-300' : accent === 'red' ? 'text-red-300' : 'text-white';
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-4">
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className={`mt-1 text-2xl font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function Badge({ children, cls }: { children: React.ReactNode; cls: string }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cls}`}>
      {children}
    </span>
  );
}
