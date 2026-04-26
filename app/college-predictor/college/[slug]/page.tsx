import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadCollegeDeepDive, loadAllCollegeSlugs } from '@/lib/collegePredictor/deepDive';
import CutoffTrendChart from './CutoffTrendChart';

// Canonical host — matches the sibling /[slug]/page.tsx + /college-predictor/page.tsx
// convention. The broader site uses canvasclasses.in in robots + sitemap, but
// the existing college-predictor pages canonicalise to .com; we stay consistent
// within the feature to avoid two hostnames in the same sitemap section.
const SITE_ORIGIN = 'https://canvasclasses.com';

// ISR — cutoffs change at most once a year. 24h cache is plenty.
export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await loadAllCollegeSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await loadCollegeDeepDive(slug);
  if (!data) return { title: 'College not found · Canvas Classes' };

  const { college, latest_year, branches } = data;
  const yearTag = latest_year ? ` ${latest_year}` : '';
  const topBranch = branches[0];
  const topRank = topBranch?.latest_closing_rank;

  const title = `${college.short_name} Cutoff${yearTag} — Branch-wise Closing Ranks | Canvas Classes`;
  const description = topBranch && topRank
    ? `${college.short_name} JoSAA cutoffs${yearTag}: ${topBranch.branch_short_name} closed at rank ${topRank.toLocaleString('en-IN')}. See 5-year trends, round-by-round progression, and branch comparison for all branches at ${college.name}.`
    : `${college.short_name} JoSAA cutoffs, 5-year rank trends, and branch comparison. Get data-backed closing ranks for every branch at ${college.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_ORIGIN}/college-predictor/college/${slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_ORIGIN}/college-predictor/college/${slug}`,
      type: 'website',
      siteName: 'Canvas Classes',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    keywords: [
      `${college.short_name} cutoff`,
      `${college.short_name} closing rank`,
      `${college.short_name} JoSAA`,
      `${college.short_name} JEE Main cutoff`,
      `${college.name} cutoff`,
      `${college.short_name} ${latest_year ?? 'latest'} cutoff`,
      `${college.short_name} branch cutoffs`,
      ...(topBranch ? [`${college.short_name} ${topBranch.branch_short_name} cutoff`] : []),
    ].join(', '),
  };
}

export default async function CollegeDeepDivePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadCollegeDeepDive(slug);
  if (!data) notFound();

  const {
    college,
    years_covered,
    latest_year,
    branches,
    architecture_branches,
    round_progression,
    quota_compare,
    filter,
  } = data;

  // ── Structured data ────────────────────────────────────────────────────
  // CollegeOrUniversity is Google's most accepted schema for higher-ed pages
  // and gives us eligibility for Knowledge Graph entities. We also emit a
  // BreadcrumbList so the trail shows up under the title in SERPs.
  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: college.name,
    alternateName: college.short_name,
    url: college.website ?? `${SITE_ORIGIN}/college-predictor/college/${slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: college.city,
      addressRegion: college.state,
      addressCountry: 'IN',
    },
    ...(college.established ? { foundingDate: String(college.established) } : {}),
    ...(college.description ? { description: college.description } : {}),
  };

  // Keep the JSON-LD breadcrumb trail byte-identical to the one rendered on
  // the page — Google downgrades rich results when they disagree.
  const breadcrumbItems: { name: string; item: string }[] = [
    { name: 'Canvas Classes', item: SITE_ORIGIN },
    { name: 'College Predictor', item: `${SITE_ORIGIN}/college-predictor` },
  ];
  if (college.type === 'NIT' || college.type === 'IIIT') {
    breadcrumbItems.push({
      name: `All ${college.type}s`,
      item: `${SITE_ORIGIN}/college-predictor/all-${college.type.toLowerCase()}s`,
    });
  }
  breadcrumbItems.push({
    name: college.short_name,
    item: `${SITE_ORIGIN}/college-predictor/college/${slug}`,
  });
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.item,
    })),
  };

  // FAQ schema — populated from the deterministic Q&A below so the JSON-LD
  // matches what's on the page (Google explicitly requires this).
  const faqs = buildFaqs(data);
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-16 sm:pb-20">

        {/* Breadcrumb — only include the "All NITs/IIITs" mid-level when we
            actually have that landing page (GFTI doesn't have one yet). */}
        <nav className="mb-5 text-xs text-zinc-500" aria-label="Breadcrumb">
          <Link href="/college-predictor" className="hover:text-orange-400 transition-colors">College Predictor</Link>
          <span className="mx-2">/</span>
          {(college.type === 'NIT' || college.type === 'IIIT') ? (
            <>
              <Link
                href={`/college-predictor/all-${college.type.toLowerCase()}s`}
                className="hover:text-orange-400 transition-colors"
              >
                All {college.type}s
              </Link>
              <span className="mx-2">/</span>
            </>
          ) : null}
          <span className="text-zinc-400">{college.short_name}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
              {college.type}
            </span>
            {college.nirf_rank_engineering && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                NIRF #{college.nirf_rank_engineering}
              </span>
            )}
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
              {college.region}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            {college.short_name} Cutoff{latest_year ? ` ${latest_year}` : ''}
          </h1>
          <p className="mt-3 text-sm md:text-base text-zinc-400 max-w-3xl leading-relaxed">
            {college.name} · {college.city}, {college.state}
            {college.established && <> · Established {college.established}</>}
            {college.website && (
              <>
                {' · '}
                <a href={college.website} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition-colors">
                  Official site ↗
                </a>
              </>
            )}
          </p>

          {/* At-a-glance strip */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2">
            <Stat label="Branches tracked" value={branches.length.toString()} />
            <Stat
              label="Years of data"
              value={years_covered.length ? `${years_covered[0]}–${years_covered[years_covered.length - 1]}` : '—'}
            />
            <Stat
              label={`Top branch ${latest_year ?? ''}`}
              value={branches[0]?.branch_short_name ?? '—'}
            />
            <Stat
              label={`Closing rank ${latest_year ?? ''}`}
              value={branches[0]?.latest_closing_rank?.toLocaleString('en-IN') ?? '—'}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-500">
            <span>Category: <span className="text-zinc-300">{filter.category}</span></span>
            <span>·</span>
            <span>Gender: <span className="text-zinc-300">{filter.gender === 'Gender-Neutral' ? 'Gender-Neutral' : 'Female-only'}</span></span>
            {branches[0] && (
              <>
                <span>·</span>
                <span>Quota: <span className="text-zinc-300">{branches[0].quota}</span></span>
              </>
            )}
          </div>
        </header>

        {branches.length === 0 ? (
          <section className="p-6 rounded-xl bg-[#0B0F15] border border-white/5 text-zinc-400 text-sm">
            We don&apos;t have cutoff data for {college.short_name} for this category/gender combination yet. Try the
            {' '}<Link href="/college-predictor" className="text-orange-400 hover:text-orange-300">predictor</Link>{' '}
            with a different filter, or check back once the next JoSAA round data is seeded.
          </section>
        ) : (
          <>
            {/* Trend chart */}
            <section className="mb-10">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">Closing rank — 5-year trend</h2>
              <p className="text-sm text-zinc-400 max-w-2xl mb-5">
                JoSAA final-round closing ranks for {filter.category} · {filter.gender === 'Gender-Neutral' ? 'Gender-Neutral' : 'Female-only'}.
                Toggle branches to compare. Rising cutoffs are normal for newer branches; a sharp fall usually signals
                growing demand (e.g. CSE everywhere post-2020).
              </p>
              <CutoffTrendChart branches={branches} years={years_covered} />
            </section>

            {/* Branch comparison table */}
            <section className="mb-10">
              <h2 className="text-lg md:text-xl font-semibold text-white mb-2">All branches at {college.short_name}</h2>
              <p className="text-sm text-zinc-400 max-w-2xl mb-4">
                Every branch with JoSAA final-round data, sorted by how competitive it is. YoY change compares the latest
                year to the previous year — negative means cutoff dropped (tougher).
              </p>
              <div className="rounded-xl bg-[#0B0F15] border border-white/5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                      <th className="text-left px-4 py-3 font-medium">Branch</th>
                      <th className="text-left px-4 py-3 font-medium">Quota</th>
                      <th className="text-right px-4 py-3 font-medium">Opening {latest_year ?? ''}</th>
                      <th className="text-right px-4 py-3 font-medium">Closing {latest_year ?? ''}</th>
                      <th className="text-right px-4 py-3 font-medium">YoY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.map((b) => (
                      <tr key={`${b.branch_short_name}-${b.quota}`} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                        <td className="px-4 py-3">
                          <div className="font-medium text-white">{b.branch_short_name}</div>
                          <div className="text-[11px] text-zinc-500 truncate max-w-xs" title={b.branch_name}>
                            {b.branch_name}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                            {b.quota}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums text-zinc-400">
                          {b.latest_opening_rank?.toLocaleString('en-IN') ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums font-semibold text-white">
                          {b.latest_closing_rank?.toLocaleString('en-IN') ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {b.yoy_delta_pct == null ? (
                            <span className="text-zinc-600">—</span>
                          ) : (
                            <span className={b.yoy_delta_pct < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                              {b.yoy_delta_pct > 0 ? '+' : ''}{b.yoy_delta_pct}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[11px] text-zinc-600">
                Colour on YoY column: green = cutoff rose (easier), rose = cutoff fell (tougher).
              </p>
            </section>

            {/* Architecture / Planning — Paper-2 branches shown separately.
                These admissions use JEE Main Paper 2 ranks (B.Arch/B.Plan),
                which is a different rank list from Paper 1 (B.E./B.Tech).
                A "closing rank 289" here does not mean "more competitive
                than CSE at rank 4,500" — it's rank 289 inside the ~40k-
                candidate Paper-2 pool. We render it in its own section with
                an explicit note so the comparison is apples-to-apples. */}
            {architecture_branches.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                  Architecture & Planning at {college.short_name}
                </h2>
                <div className="p-4 mb-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-semibold text-amber-300">Different rank pool.</span>{' '}
                  B.Arch and B.Plan admissions use <span className="font-medium">JEE Main Paper 2</span> ranks, which
                  come from a separate exam and a much smaller candidate pool (~40k) than Paper 1 (~14 lakh).
                  Do <span className="italic">not</span> compare these closing ranks to the B.E./B.Tech numbers above —
                  a B.Arch closing rank of 289 is within the Paper 2 list only.
                </div>
                <div className="rounded-xl bg-[#0B0F15] border border-white/5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                        <th className="text-left px-4 py-3 font-medium">Branch</th>
                        <th className="text-left px-4 py-3 font-medium">Quota</th>
                        <th className="text-right px-4 py-3 font-medium">Opening {latest_year ?? ''}</th>
                        <th className="text-right px-4 py-3 font-medium">Closing {latest_year ?? ''}</th>
                        <th className="text-right px-4 py-3 font-medium">YoY</th>
                      </tr>
                    </thead>
                    <tbody>
                      {architecture_branches.map((b) => (
                        <tr key={`${b.branch_short_name}-${b.quota}`} className="border-b border-white/5 last:border-0 hover:bg-white/3">
                          <td className="px-4 py-3">
                            <div className="font-medium text-white">{b.branch_short_name}</div>
                            <div className="text-[11px] text-zinc-500 truncate max-w-xs" title={b.branch_name}>
                              {b.branch_name} · JEE Main Paper 2
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                              {b.quota}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums text-zinc-400">
                            {b.latest_opening_rank?.toLocaleString('en-IN') ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums font-semibold text-white">
                            {b.latest_closing_rank?.toLocaleString('en-IN') ?? '—'}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums">
                            {b.yoy_delta_pct == null ? (
                              <span className="text-zinc-600">—</span>
                            ) : (
                              <span className={b.yoy_delta_pct < 0 ? 'text-rose-400' : 'text-emerald-400'}>
                                {b.yoy_delta_pct > 0 ? '+' : ''}{b.yoy_delta_pct}%
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Round progression */}
            {round_progression && round_progression.rounds.length > 1 && (
              <section className="mb-10">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                  Round-by-round: {round_progression.branch_short_name} in {round_progression.year}
                </h2>
                <p className="text-sm text-zinc-400 max-w-2xl mb-5">
                  JoSAA runs up to 6 rounds of counselling. The closing rank climbs each round as students upgrade or
                  withdraw. If you&apos;re banking on R1 data, you&apos;re under-estimating your chances.
                </p>
                <div className="rounded-xl bg-[#0B0F15] border border-white/5 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-wider text-zinc-500 border-b border-white/5">
                        <th className="text-left px-4 py-3 font-medium">Round</th>
                        <th className="text-right px-4 py-3 font-medium">Opening rank</th>
                        <th className="text-right px-4 py-3 font-medium">Closing rank</th>
                        <th className="text-right px-4 py-3 font-medium">Δ vs R1</th>
                      </tr>
                    </thead>
                    <tbody>
                      {round_progression.rounds.map((r, i) => {
                        const base = round_progression.rounds[0].closing_rank;
                        const delta = i === 0 ? null : r.closing_rank - base;
                        return (
                          <tr key={r.round} className="border-b border-white/5 last:border-0">
                            <td className="px-4 py-3 font-medium text-white">R{r.round}</td>
                            <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                              {r.opening_rank.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums text-zinc-300">
                              {r.closing_rank.toLocaleString('en-IN')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums">
                              {delta == null ? (
                                <span className="text-zinc-600">baseline</span>
                              ) : (
                                <span className="text-amber-400">
                                  +{delta.toLocaleString('en-IN')} ranks
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Quota compare (NIT only) */}
            {quota_compare && (quota_compare.hs || quota_compare.os) && (
              <section className="mb-10">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-2">
                  Home-state advantage: {quota_compare.branch_short_name}
                </h2>
                <p className="text-sm text-zinc-400 max-w-2xl mb-5">
                  NITs reserve 50% of their seats for Home State (HS) candidates. Here&apos;s how the {quota_compare.year}
                  {' '}final-round closing ranks compare. If you&apos;re from {college.state}, the HS number is what matters for you.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <QuotaCard
                    label={`Home State (${college.state})`}
                    data={quota_compare.hs}
                    accent="emerald"
                  />
                  <QuotaCard
                    label="Other State"
                    data={quota_compare.os}
                    accent="orange"
                  />
                </div>
              </section>
            )}

            {/* FAQ */}
            {faqs.length > 0 && (
              <section className="mb-10">
                <h2 className="text-lg md:text-xl font-semibold text-white mb-4">
                  {college.short_name} — frequently asked questions
                </h2>
                <div className="space-y-2.5">
                  {faqs.map((f) => (
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
          </>
        )}

        {/* CTA back to predictor */}
        <aside className="mt-10 p-5 md:p-7 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20">
          <div className="text-sm font-semibold text-orange-400 mb-2">Predict your chances</div>
          <h3 className="text-lg md:text-2xl font-bold text-white mb-2">
            Will you get into {college.short_name}?
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed mb-4 max-w-2xl">
            Enter your JEE Main rank or percentile — we&apos;ll show you which branches at {college.short_name} are
            Safe, Target, Reach, or Unlikely based on the last {years_covered.length || 5} years of JoSAA cutoffs.
          </p>
          <Link
            href={`/college-predictor?dc=${encodeURIComponent(college.short_name)}`}
            prefetch={false}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm"
          >
            Open the predictor →
          </Link>
        </aside>
      </div>
    </main>
  );
}

// ── Components ───────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#0B0F15] border border-white/5">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500 truncate">{label}</div>
      <div className="text-base md:text-lg font-semibold text-white tabular-nums mt-0.5 truncate">{value}</div>
    </div>
  );
}

function QuotaCard({
  label,
  data,
  accent,
}: {
  label: string;
  data: { opening_rank: number; closing_rank: number } | null;
  accent: 'emerald' | 'orange';
}) {
  const badgeClass = accent === 'emerald'
    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    : 'bg-orange-500/10 border-orange-500/20 text-orange-400';
  return (
    <div className="p-5 rounded-xl bg-[#0B0F15] border border-white/5">
      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${badgeClass}`}>
        {label}
      </span>
      {data ? (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Opening rank</div>
            <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
              {data.opening_rank.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">Closing rank</div>
            <div className="text-2xl font-bold text-white tabular-nums mt-0.5">
              {data.closing_rank.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-sm text-zinc-500">Data not available for this quota.</div>
      )}
    </div>
  );
}

// ── FAQ builder ──────────────────────────────────────────────────────────
// Deterministically generates questions from the loaded data. Staying
// deterministic (no LLM, no hand-written variants) means the text always
// matches the DB so the FAQ JSON-LD is honest (Google requires page FAQ = LD
// FAQ to match exactly, or the rich result is withheld).

function buildFaqs(data: NonNullable<Awaited<ReturnType<typeof loadCollegeDeepDive>>>): { q: string; a: string }[] {
  const { college, latest_year, branches, round_progression, quota_compare } = data;
  const out: { q: string; a: string }[] = [];

  if (branches.length > 0 && latest_year) {
    const top = branches[0];
    const rank = top.latest_closing_rank?.toLocaleString('en-IN');
    if (rank) {
      out.push({
        q: `What was the closing rank for ${top.branch_short_name} at ${college.short_name} in ${latest_year}?`,
        a: `The JoSAA final-round closing rank for ${top.branch_name} at ${college.short_name} in ${latest_year} was ${rank} for the OPEN Gender-Neutral ${top.quota} quota. This is the cutoff the predictor uses by default.`,
      });
    }
  }

  if (branches.length > 1 && latest_year) {
    const top3 = branches.slice(0, Math.min(3, branches.length));
    const list = top3
      .map((b) => `${b.branch_short_name} (${b.latest_closing_rank?.toLocaleString('en-IN') ?? '—'})`)
      .join(', ');
    out.push({
      q: `Which are the toughest branches to get into at ${college.short_name}?`,
      a: `Based on ${latest_year} JoSAA final-round closing ranks (OPEN, Gender-Neutral), the most competitive branches at ${college.short_name} are: ${list}. The number in brackets is the last rank that got in.`,
    });
  }

  if (round_progression && round_progression.rounds.length > 1) {
    const first = round_progression.rounds[0];
    const last = round_progression.rounds[round_progression.rounds.length - 1];
    out.push({
      q: `How much does the closing rank drift between rounds at ${college.short_name}?`,
      a: `For ${round_progression.branch_short_name} in ${round_progression.year}, Round 1 closed at rank ${first.closing_rank.toLocaleString('en-IN')} while the final round (R${last.round}) closed at ${last.closing_rank.toLocaleString('en-IN')}. Students further from the cutoff still get in if they hold out through later rounds, so R1 data alone underestimates the real admit line.`,
    });
  }

  if (quota_compare && quota_compare.hs && quota_compare.os) {
    out.push({
      q: `How much is the Home State advantage at ${college.short_name}?`,
      a: `For ${quota_compare.branch_short_name} in ${quota_compare.year}, the Home State (${college.state}) closing rank was ${quota_compare.hs.closing_rank.toLocaleString('en-IN')} versus ${quota_compare.os.closing_rank.toLocaleString('en-IN')} for Other State candidates. NITs reserve 50% of their seats for HS, so if you're from ${college.state}, your effective cutoff is the HS number.`,
    });
  }

  if (college.type === 'NIT' || college.type === 'IIIT') {
    out.push({
      q: `Is ${college.short_name} admission based on JEE Main or JEE Advanced?`,
      a: `${college.short_name} admits through JoSAA counselling using JEE Main scores. JEE Advanced is only used for IITs. You need to register on the JoSAA portal after JEE Main results, fill a choice list, and the allocation runs across multiple rounds.`,
    });
  }

  out.push({
    q: `Where does this cutoff data come from?`,
    a: `Closing ranks shown here are from the official JoSAA Opening-Closing Rank (OR-CR) reports, consolidated across all rounds from 2022 through ${latest_year ?? 'the latest available year'}. ${college.short_name} has ${data.years_covered.length} year${data.years_covered.length === 1 ? '' : 's'} of data in our database. The predictor uses the final round of each year to avoid over-optimistic Round 1 projections.`,
  });

  return out;
}
