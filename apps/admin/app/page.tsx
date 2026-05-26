import Link from 'next/link';
import {
  FlaskConical,
  Layers,
  BookOpen,
  Newspaper,
  Network,
  Compass,
  BarChart3,
  Eye,
  Beaker,
  ExternalLink,
  Users,
} from 'lucide-react';
import { createClient } from '@/app/utils/supabase/server';
import { SignoutButton } from '@/features/admin/components/SignoutButton';
import { isSuperAdmin } from '@canvas/data/rbac';

export const metadata = {
  title: 'Admin Home | Canvas',
  description: 'Operator console for Canvas Classes.',
};

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  let email: string | null = null;
  try {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase.auth.getUser();
      email = data.user?.email ?? null;
    }
  } catch {
    // Middleware already gates this page — if Supabase is misconfigured the
    // request never reaches here in production. Localhost dev shows null.
  }

  // Staff (non-super-admin) only ever get question-bank access via grants in
  // the user_access collection, so the only panel they should see here is
  // Crucible. All other operator surfaces are super-admin-only.
  const superAdmin = isSuperAdmin(email);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="flex items-baseline justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-orange-400/80">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
              Canvas Classes — Operator Console
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Admin home</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              All editorial and operational panels for the platform live here.
              Pick the surface you need; each panel deep-links into its own
              workflow.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {email && (
              <div className="hidden text-right text-xs text-white/40 sm:block">
                <div className="uppercase tracking-widest">Signed in</div>
                <div className="mt-1 font-mono text-white/70">{email}</div>
              </div>
            )}
            <SignoutButton />
          </div>
        </header>

        {superAdmin ? (
          <>
            <Section title="Content panels" hint="Live production writes — actions here affect what students see.">
              <PanelCard
                href="/crucible"
                icon={<FlaskConical />}
                title="Crucible"
                hint="The chemistry question bank — add, edit, tag, and curate questions_v2 + flags + mock tests + analytics."
                accent="primary"
              />
              <PanelCard
                href="/flashcards"
                icon={<Layers />}
                title="Flashcards"
                hint="Author and curate flashcards. Bulk import + image scaling + markdown."
              />
              <PanelCard
                href="/books"
                icon={<BookOpen />}
                title="Books"
                hint="Author Live Books — chapters, pages, blocks, and per-page publish. Split-pane preview reuses the student renderer."
              />
              <PanelCard
                href="/blog"
                icon={<Newspaper />}
                title="Blog"
                hint="Draft, review, and publish blog posts. Image upload + sources + AI idea queue."
              />
              <PanelCard
                href="/taxonomy"
                icon={<Network />}
                title="Taxonomy"
                hint="Edit the chapter ↔ topic-tag taxonomy. Auto-syncs to taxonomyData_from_csv.ts."
              />
              <PanelCard
                href="/career-explorer"
                icon={<Compass />}
                title="Career Explorer"
                hint="Manage the 9-layer career taxonomy + the 50-question explorer + student profile overrides."
              />
            </Section>

            <Section title="Operator tools" hint="Read-only views and operator-facing surfaces.">
              <PanelCard
                href="/dashboard"
                icon={<BarChart3 />}
                title="Dashboard"
                hint="Per-user progress and engagement view. Useful for support + cohort analysis."
              />
              <PanelCard
                href="/seo"
                icon={<BarChart3 />}
                title="SEO Dashboard"
                hint="Search Console clicks/queries/pages + Chrome UX Report Core Web Vitals. Daily cron at 02:00 UTC."
              />
              <PanelCard
                href="/preview"
                icon={<Eye />}
                title="Preview"
                hint="Render a single question or flashcard as a student would see it."
              />
              <PanelCard
                href="/staff"
                icon={<Users />}
                title="Staff Access"
                hint="Grant or revoke per-subject and per-chapter access for staff. Super admins are managed via env."
              />
            </Section>

            <Section
              title="Developer tools"
              hint="Local-only or external utilities. Production writes are disabled in these surfaces."
            >
              <PanelCard
                href="https://canvasclasses.in/organic-chemistry-hub/admin"
                external
                icon={<Beaker />}
                title="Organic Chem Hub — reactions editor"
                hint="Edit the named-reactions dataset that powers the Organic Chemistry Hub. Lives on the student site; production writes return 403."
              />
            </Section>
          </>
        ) : (
          <Section title="Your panels" hint="Access is scoped to the chapters granted to you in Staff Access.">
            <PanelCard
              href="/crucible"
              icon={<FlaskConical />}
              title="Crucible"
              hint="The question bank — edit, tag, and curate questions for the chapters you have access to."
              accent="primary"
            />
          </Section>
        )}

        <footer className="mt-16 border-t border-white/5 pt-6 text-xs text-white/40">
          Production: <code className="text-orange-300/80">admin.canvasclasses.in</code>
          <span className="mx-2">·</span>
          See <code className="text-orange-300/80">_agents/adr/</code> for the architecture rationale behind this split.
        </footer>
      </div>
    </main>
  );
}

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-white/40">{hint}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

function PanelCard({
  href,
  icon,
  title,
  hint,
  accent,
  external,
  disabled,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
  accent?: 'primary';
  external?: boolean;
  disabled?: boolean;
}) {
  const base =
    'group relative rounded-xl border p-5 transition';
  const styles = disabled
    ? 'border-white/5 bg-[#0B0F15]/40 text-white/40 cursor-not-allowed'
    : accent === 'primary'
      ? 'border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 hover:border-orange-400/60 hover:from-orange-500/15'
      : 'border-white/10 bg-[#0B0F15] hover:border-white/25 hover:bg-white/5';

  const iconColor = disabled
    ? 'text-white/30'
    : accent === 'primary'
      ? 'text-orange-300'
      : 'text-orange-300/80 group-hover:text-orange-300';

  const content = (
    <>
      <div className="flex items-start justify-between">
        <div className={iconColor}>{icon}</div>
        {external && <ExternalLink className="h-4 w-4 text-white/30" />}
        {disabled && (
          <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/40">
            soon
          </span>
        )}
      </div>
      <div className="mt-3 text-lg font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/60 leading-relaxed">{hint}</div>
    </>
  );

  if (disabled) {
    return <div className={`${base} ${styles}`}>{content}</div>;
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${base} ${styles}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {content}
    </Link>
  );
}
