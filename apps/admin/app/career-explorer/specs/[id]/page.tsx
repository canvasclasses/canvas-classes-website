import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/adminAuth';
import connectToDatabase from '@canvas/data/db/mongodb';
import { CareerSpec } from '@canvas/data/models/CareerSpec';
import CareerSpecEditor from './CareerSpecEditor';

export const dynamic = 'force-dynamic';

// Edit page for one CareerSpec. Routes by UUID `_id` (not slug) so admin URLs
// survive renames. Loads the full doc server-side, hands to a client editor.

export default async function AdminCareerSpecEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect('/');
  const { id } = await params;
  await connectToDatabase();

  type SpecDoc = {
    _id: string;
    slug?: string;
    display_name?: string;
    category?: string;
    archetype?: string;
    status?: string;
    version?: number;
    last_full_review?: string;
    next_review_due?: string;
  } & Record<string, unknown>;

  const spec = await CareerSpec.findOne({ _id: id, deleted_at: null }).lean<SpecDoc | null>();
  if (!spec) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/career-explorer/specs" className="text-sm text-white/60 hover:text-white/90">
          ← All specs
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold">{spec.display_name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[12px]">{spec.slug}</code>
              <span>·</span>
              <span className="capitalize">{spec.category}</span>
              <span>·</span>
              <span className="capitalize">{spec.archetype}</span>
              <span>·</span>
              <span>v{spec.version ?? 1}</span>
              <span>·</span>
              <span>Last review: {spec.last_full_review ?? '—'}</span>
              <span>·</span>
              <span>Next due: {spec.next_review_due ?? '—'}</span>
            </div>
          </div>
        </div>
        <CareerSpecEditor initial={spec} />
      </div>
    </main>
  );
}
