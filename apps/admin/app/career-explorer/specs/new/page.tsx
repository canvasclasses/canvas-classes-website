import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/adminAuth';
import NewSpecClient from './NewSpecClient';

// New career spec — starts with a minimal valid skeleton, the admin fills it
// in and saves. The skeleton matches the V1 schema so the create POST won't
// fail validation on required fields.

export const dynamic = 'force-dynamic';

export default async function NewCareerSpecPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/');

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/career-explorer/specs" className="text-sm text-white/60 hover:text-white/90">
          ← All specs
        </Link>
        <h1 className="mt-2 text-3xl font-semibold">New career spec</h1>
        <p className="mt-1 max-w-2xl text-white/60">
          Start with the skeleton below — slug, display name, category, archetype, plus a minimal valid shape for the required sections.
          Save creates the spec as a <span className="font-semibold">draft</span>; you can flip it to published once the editorial pass is done.
        </p>
        <NewSpecClient />
      </div>
    </main>
  );
}
