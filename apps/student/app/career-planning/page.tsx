import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/*
 * /career-planning — hub page that sits between two existing tools:
 *
 *   1. /college-predictor — quantitative: "given my rank, what colleges and
 *      branches are realistic?"
 *   2. /career-guide      — qualitative:  "given a career, what does it
 *      actually look like in 2026?"
 *
 * Most students bounce between the two without a clear mental model. This
 * page exists to give them that model, then route them in.
 *
 * Static server component. No DB calls. Pure SEO + navigation surface.
 */

const SITE_ORIGIN = 'https://canvasclasses.in';

export const metadata: Metadata = {
  title: 'Career planning for JEE / NEET aspirants — Canvas Classes',
  description:
    'How to think about your career around JEE / NEET. Combine rank-to-college predictions with honest career briefs to make decisions you can defend in five years.',
  alternates: { canonical: `${SITE_ORIGIN}/career-planning` },
  openGraph: {
    title: 'Career planning for JEE / NEET aspirants — Canvas Classes',
    description:
      'A planning loop, not a one-shot decision. Predict the colleges your rank can reach, then read what each career actually looks like in 2026.',
    url: `${SITE_ORIGIN}/career-planning`,
    type: 'website',
    siteName: 'Canvas Classes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Career planning for JEE / NEET aspirants — Canvas Classes',
    description:
      'Predict colleges from your rank, then read honest career briefs. Loop until you have a plan you can defend.',
  },
};

const FAQS: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: 'Should I drop a year if my JEE rank is below my target?',
    a: (
      <>
        It depends on what you&apos;d be giving up. A drop year costs you twelve months of
        compounding — income, experience, friendships — and the upside is usually a
        better college, not a better career. Before you decide, run your current rank
        through the{' '}
        <Link href="/college-predictor" className="cp-inline-link">
          College Predictor
        </Link>{' '}
        and read the career briefs for what those colleges actually feed into. If the
        gap between your reachable colleges and your target career is small, drop
        years rarely pay off. If the gap is large — say, you want core research and
        your current rank only reaches private engineering — the year might earn it.
      </>
    ),
  },
  {
    q: 'My JEE rank is around 50,000 — what careers are still open to me?',
    a: (
      <>
        Most. Rank determines the college; the college shapes the network and the
        first-job market, not the career ceiling. Software, product, data, and design
        roles are largely college-agnostic past the first job — by year three, your
        portfolio is what people read. The{' '}
        <Link href="/career-guide/software-engineer-product" className="cp-inline-link">
          Software Engineer (Product)
        </Link>{' '}
        and{' '}
        <Link href="/career-guide/product-designer" className="cp-inline-link">
          Product Designer
        </Link>{' '}
        briefs are the most honest mid-rank paths. For deep-tech or research tracks
        the college matters more — read the briefs before you commit.
      </>
    ),
  },
  {
    q: 'Which careers are most AI-proof in 2026?',
    a: (
      <>
        None are AI-proof. The right question is which careers are AI-leveraged —
        where adding AI to your workflow makes you 5–10× more valuable, not
        replaceable. Clinical medicine, semiconductor and energy-materials
        engineering, and hands-on robotics sit on the resistant end because the work
        is physical, regulated, or both. Software and design get amplified rather
        than erased, but you have to adopt the tools. Each brief in the{' '}
        <Link href="/career-guide" className="cp-inline-link">
          Career Guide
        </Link>{' '}
        carries an explicit 5-year and 10-year AI exposure assessment with our
        confidence level.
      </>
    ),
  },
  {
    q: 'Should I pick the college or the branch?',
    a: (
      <>
        Pick the branch if the career is branch-locked (semiconductors needs
        electronics, biotech needs biology). Pick the college if the career is
        college-agnostic (most software, product, design, generic engineering). The{' '}
        <Link href="/college-predictor" className="cp-inline-link">
          College Predictor
        </Link>{' '}
        lets you filter by branch and see where each combination lands you. Then
        cross-check the career&apos;s &quot;primary degrees&quot; list in the brief —
        if your branch is on it, you&apos;re fine.
      </>
    ),
  },
];

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Career planning for JEE / NEET aspirants',
  url: `${SITE_ORIGIN}/career-planning`,
  description:
    'A planning loop combining rank-to-college predictions with honest career briefs.',
  isPartOf: { '@type': 'WebSite', name: 'Canvas Classes', url: SITE_ORIGIN },
  about: [
    { '@type': 'Thing', name: 'JEE career planning' },
    { '@type': 'Thing', name: 'NEET career planning' },
    { '@type': 'Thing', name: 'Engineering careers in India' },
  ],
  hasPart: [
    {
      '@type': 'WebApplication',
      name: 'College Predictor',
      url: `${SITE_ORIGIN}/college-predictor`,
      applicationCategory: 'EducationalApplication',
    },
    {
      '@type': 'CollectionPage',
      name: 'Career Guide 2026',
      url: `${SITE_ORIGIN}/career-guide`,
    },
  ],
};

export default function CareerPlanningHub() {
  return (
    <main className="min-h-screen bg-[#060606] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <style>{`
        .cp-inline-link {
          color: #fb923c;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .cp-inline-link:hover { color: #fdba74; }
      `}</style>

      <div className="mx-auto max-w-[1100px] px-6 md:px-12 pt-24 pb-24">
        {/* Hero / framing */}
        <header className="pt-2 pb-12">
          <div className="mb-6 flex items-center gap-3 font-mono text-[12px] uppercase tracking-[0.08em] text-white/60">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            <span>Plan your career</span>
            <span className="opacity-40">·</span>
            <span>JEE &amp; NEET aspirants</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] mb-6">
            Most career decisions get made <span className="text-orange-400">backwards</span>.
          </h1>

          <div className="max-w-[760px] space-y-4 text-[17px] md:text-[18px] text-white/75 leading-relaxed">
            <p>
              The usual order is: pick a stream in class 11, sit JEE or NEET, take
              whatever combination of college and branch your rank gives you, and
              then try to make a career out of it. That works in the sense that
              everyone gets somewhere. It just rarely produces a career you&apos;d
              have picked if you&apos;d started from the other end.
            </p>
            <p>
              The other end is: figure out what careers are actually worth chasing
              in 2026, work backwards to the branches that lead there, then check
              which colleges your rank can reach in those branches. It&apos;s a
              loop. You won&apos;t get the answer on the first pass.
            </p>
            <p>
              Canvas Classes has two tools that, used together, run that loop.
            </p>
          </div>
        </header>

        {/* The two tools */}
        <section aria-labelledby="tools" className="grid gap-5 md:grid-cols-2 mb-20">
          <h2 id="tools" className="sr-only">
            The two tools
          </h2>

          <Link
            href="/college-predictor"
            className="group relative flex flex-col gap-4 p-7 rounded-2xl border border-orange-500/25 bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent hover:border-orange-500/50 transition-colors"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-orange-300/80">
              Step 1 · Quantitative
            </div>
            <div className="text-2xl font-semibold text-white">College Predictor</div>
            <p className="text-[15px] text-white/70 leading-relaxed flex-1">
              Given your JEE Main, JEE Advanced, or NEET rank, which colleges and
              branches are actually within reach? Filter by state, category,
              gender, and round. Backed by official cutoff data from JoSAA, CSAB,
              and state counselling boards.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-orange-300 group-hover:text-orange-200 mt-2">
              Run a prediction
              <ArrowRight size={14} />
            </div>
          </Link>

          <Link
            href="/career-guide"
            className="group relative flex flex-col gap-4 p-7 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05] transition-colors"
          >
            <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/55">
              Step 2 · Qualitative
            </div>
            <div className="text-2xl font-semibold text-white">Career Guide 2026</div>
            <p className="text-[15px] text-white/70 leading-relaxed flex-1">
              Editorial briefs on twelve careers — software, ML, semiconductors,
              robotics, clinical medicine, biotech, quant, healthcare AI, and
              more. Income distributions, AI exposure, the path in, and the cons
              nobody else lists. Refreshed quarterly.
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-white/85 group-hover:text-white mt-2">
              Read the briefs
              <ArrowRight size={14} />
            </div>
          </Link>
        </section>

        {/* Common questions */}
        <section aria-labelledby="questions">
          <h2
            id="questions"
            className="text-3xl md:text-4xl font-semibold tracking-tight mb-3"
          >
            Common questions
          </h2>
          <p className="text-white/60 text-[15px] mb-10 max-w-[680px]">
            Four questions students ask us most often. None of these have a clean
            answer — but framing them well is half the work.
          </p>

          <div className="space-y-8">
            {FAQS.map((item) => (
              <article
                key={item.q}
                className="p-7 rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <h3 className="text-xl md:text-[1.35rem] font-semibold text-white mb-3 leading-snug">
                  {item.q}
                </h3>
                <div className="text-[15.5px] text-white/75 leading-relaxed">
                  {item.a}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-20 p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[11px] font-mono uppercase tracking-[0.08em] text-white/55 mb-3">
            Where to start
          </div>
          <p className="text-[17px] text-white/80 leading-relaxed max-w-[720px] mb-6">
            If you know your rank, start with the predictor — it gives you a
            concrete shortlist to react to. If you don&apos;t, start with the
            career briefs and work backwards.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/college-predictor"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold text-sm hover:brightness-110 transition"
            >
              Predict my colleges
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/career-guide"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/15 text-white font-medium text-sm hover:bg-white/[0.10] transition"
            >
              Browse career briefs
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
