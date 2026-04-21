import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';
import connectToDatabase from '@/lib/mongodb';
import { CareerPath } from '@/lib/models/CareerPath';
import CareerEditorClient from './CareerEditorClient';

export const dynamic = 'force-dynamic';

export default async function AdminCareerEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  const { slug } = await params;
  await connectToDatabase();
  const career = await CareerPath.findById(slug).lean<{ _id: string; name?: string; family?: string } & Record<string, unknown> | null>();
  if (!career) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer/careers" className="text-sm text-white/60 hover:text-white/90">← All careers</Link>
        <h1 className="mt-2 text-3xl font-semibold">{career.name}</h1>
        <div className="mt-1 text-white/60">{career.family}</div>
        <CareerEditorClient initial={career} />
      </div>
    </main>
  );
}
