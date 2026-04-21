import { redirect } from 'next/navigation';
import Link from 'next/link';
import { requireAdmin } from '@/lib/bookAuth';

export const dynamic = 'force-dynamic';

export default async function AdminSeedPage() {
  const admin = await requireAdmin();
  if (!admin) redirect('/crucible/admin');
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/crucible/admin/career-explorer" className="text-sm text-white/60 hover:text-white/90">← Career Explorer admin</Link>
        <h1 className="mt-2 text-3xl font-semibold">Seed / reset</h1>
        <p className="mt-2 text-white/70">Seed scripts are run from the CLI to keep seeding under version control.</p>

        <div className="mt-6 space-y-4">
          <Box title="Seed default questions">
            <Code>npx tsx scripts/career-explorer/seed_questions.ts</Code>
            <p className="mt-2 text-sm text-white/60">Upserts all 50 default questions. Safe to re-run.</p>
          </Box>
          <Box title="Seed default careers">
            <Code>npx tsx scripts/career-explorer/seed_careers.ts</Code>
            <p className="mt-2 text-sm text-white/60">Upserts the 30 starter careers with their 9-layer taxonomy.</p>
          </Box>
        </div>
      </div>
    </main>
  );
}

function Box({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B0F15] p-5">
      <div className="text-lg font-semibold">{title}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
function Code({ children }: { children: React.ReactNode }) {
  return <pre className="overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-white/80">{children}</pre>;
}
