import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LANDING_CONFIGS, findLanding } from './landingConfig';
import connectDB from '@/lib/mongodb';
import { College } from '@/lib/models/College';

export async function generateStaticParams() {
  return LANDING_CONFIGS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cfg = findLanding(slug);
  if (!cfg) return { title: 'Not found' };

  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: `https://canvasclasses.com/college-predictor/${cfg.slug}` },
    openGraph: {
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      url: `https://canvasclasses.com/college-predictor/${cfg.slug}`,
      type: 'website',
    },
  };
}

// ISR — regenerate at most once a day. Cutoff/college data changes rarely.
export const revalidate = 86400;

interface CollegeRow {
  _id: string;
  name: string;
  short_name: string;
  type: string;
  state: string;
  city: string;
  region: string;
  established?: number;
  nirf_rank_engineering?: number;
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cfg = findLanding(slug);
  if (!cfg) notFound();

  await connectDB();
  const query: Record<string, unknown> = { is_active: true };
  if (cfg.filter.region) query.region = cfg.filter.region;
  if (cfg.filter.type) query.type = cfg.filter.type;

  const colleges = await College.find(query)
    .select('_id name short_name type state city region established nirf_rank_engineering')
    .sort({ nirf_rank_engineering: 1, short_name: 1 })
    .limit(100)
    .lean<CollegeRow[]>();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <nav className="mb-6 text-xs text-zinc-500">
          <Link href="/college-predictor" className="hover:text-orange-400 transition-colors">College Predictor</Link>
          <span className="mx-2">/</span>
          <span className="text-zinc-400">{cfg.slug}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            {cfg.h1}
          </h1>
          <p className="mt-4 text-base md:text-lg text-zinc-400 max-w-3xl leading-relaxed">
            {cfg.intro}
          </p>
        </header>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {colleges.length} {colleges.length === 1 ? 'institute' : 'institutes'}
            </h2>
            <Link
              href="/college-predictor"
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/15 transition-colors"
            >
              Predict my colleges →
            </Link>
          </div>

          {colleges.length === 0 ? (
            <div className="p-6 rounded-xl bg-[#151E32] border border-white/5 text-zinc-400 text-sm">
              No institutes have been seeded yet for this filter. Run the seed script to populate.
            </div>
          ) : (
            <div className="grid gap-3">
              {colleges.map((c) => (
                <Link
                  key={c._id}
                  href={`/college-predictor/college/${c._id}`}
                  prefetch={false}
                  className="p-4 md:p-5 rounded-xl bg-[#0B0F15] border border-white/5 hover:border-orange-500/30 hover:bg-[#0f1420] transition-colors flex flex-wrap items-center gap-4 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-base font-semibold text-white truncate group-hover:text-orange-300 transition-colors">{c.short_name}</div>
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                        {c.type}
                      </span>
                      {c.nirf_rank_engineering && (
                        <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          NIRF #{c.nirf_rank_engineering}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-zinc-500 mt-1 truncate">{c.name}</div>
                    <div className="text-xs text-zinc-500 mt-1">
                      {c.city}, {c.state}
                      {c.established && <> · Established {c.established}</>}
                    </div>
                  </div>
                  <div className="text-xs text-orange-400/80 group-hover:text-orange-300 transition-colors shrink-0">
                    View cutoffs →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {cfg.faqs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">
              Frequently asked questions
            </h2>
            <div className="space-y-3">
              {cfg.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group p-4 md:p-5 rounded-xl bg-[#0B0F15] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                    <span className="text-sm md:text-base font-medium text-white">{f.q}</span>
                    <span className="text-zinc-500 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <div className="mt-3 text-sm text-zinc-400 leading-relaxed">{f.a}</div>
                </details>
              ))}
            </div>
          </section>
        )}

        <aside className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20">
          <div className="text-sm font-semibold text-orange-400 mb-2">Predict your colleges</div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4">
            Enter your JEE Main rank or percentile to see which of these institutes you can
            realistically get into, with Safe / Target / Reach probabilities.
          </p>
          <Link
            href="/college-predictor"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm"
          >
            Open the predictor →
          </Link>
        </aside>
      </div>
    </main>
  );
}
