import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import BranchFinderShell from '@/features/college-predictor/branch-finder/BranchFinderShell';

// Public, same-content-for-everyone discovery page. Static shell + client
// island per CLAUDE.md §10 — no force-dynamic, no per-request reads.
export const revalidate = 86400; // content is effectively static (24h)

export const metadata: Metadata = {
  title: 'Which Engineering Branch Should I Choose? — Branch Finder',
  description:
    'Confused between CSE, Mechanical, ECE, Civil and the rest? Tell us what your child enjoys and dreams of, and our free Branch Finder clears the clutter to a focused shortlist of engineering branches that actually fit — then shows which colleges you can get.',
  keywords: [
    'which engineering branch to choose',
    'best engineering branch',
    'engineering branch selector',
    'CSE vs Mechanical vs ECE',
    'engineering branch for physics',
    'engineering branch finder',
    'how to choose engineering branch after JEE',
    'engineering branches list',
  ],
  alternates: {
    canonical: 'https://canvasclasses.com/college-predictor/branch-finder',
  },
  openGraph: {
    title: 'Branch Finder — Find the Engineering Branch That Fits',
    description:
      'A grid of every engineering branch that clears itself down to your best matches as you tell us what your child enjoys and dreams of. Free, no sign-up.',
    url: 'https://canvasclasses.com/college-predictor/branch-finder',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I choose the right engineering branch?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Start from interest, not just rank. The Branch Finder asks what subjects your child enjoys, what they like doing (building things, coding, lab work, fieldwork), and their career dream (high-paying job, government/PSU, research, a specific industry like automotive or aerospace). It then highlights the engineering branches that fit best and explains why each matched.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the Branch Finder free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It is completely free, needs no sign-up, and does not sell your data.',
      },
    },
    {
      '@type': 'Question',
      name: 'My child is good at physics — which branch is best?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Physics alone points to several branches — Mechanical, Electrical, Aerospace, Engineering Physics and more. The Branch Finder narrows it down once you add what they like doing and their future goal, so a physics-strong child who loves machines and cars lands on Mechanical/Automobile, while one who loves abstract problems and research lands on Engineering Physics.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which engineering branches are future-proof in the age of AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'AI is redefining, not deleting, most fields. The Branch Finder marks every program with an AI-era outlook — Booming (AI/ML, data science, semiconductors/VLSI, robotics, cybersecurity, bioinformatics, quantum, climate), Resilient (electrical/power, civil, chemical, aerospace), Evolving (CSE, mechanical, ECE — strong if you add AI/data skills), and Re-skill needed (traditional IT services, mining, petroleum). Rather than hide at-risk paths, it shows the honest "how to stay relevant" note so families decide with eyes open.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the Branch Finder cover science programs, not just engineering?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Yes. These institutes (IITs, NITs, IISERs, BITS) offer far more than B.Tech. The tool also covers B.S./Integrated M.Sc. Physics, Chemistry, Mathematics & Statistics and Life Sciences, plus emerging interdisciplinary tracks like Data Science, VLSI, Robotics, Bioinformatics, Quantum Technology, Economics & Financial Engineering, and Engineering Design/UX.',
      },
    },
  ],
};

export default function BranchFinderPage() {
  return (
    <main className="min-h-screen text-white" style={{ background: '#070710' }}>
      {/* Page-local fonts to match the college-predictor design system. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative isolate overflow-hidden">
        {/* Soft gradient glow behind the hero title — amber core with a cool
            violet edge, fading into the dark page. Purely decorative. */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 left-1/2 -translate-x-1/2 -top-20"
          style={{
            width: 'min(1200px, 130%)',
            height: 620,
            background:
              'radial-gradient(58% 56% at 50% 32%, rgba(245,158,11,0.22) 0%, rgba(245,158,11,0.10) 34%, rgba(99,102,241,0.07) 58%, transparent 74%)',
            filter: 'blur(28px)',
          }}
        />
        {/* Faint top hairline of light to seat the glow against the page top. */}
        <div
          aria-hidden
          className="pointer-events-none absolute z-0 inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 pt-20 sm:pt-24 pb-10 sm:pb-14">
          <header className="text-center mb-9 sm:mb-12">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  border: '1px solid #f59e0b55',
                  background: '#f59e0b10',
                  color: '#f59e0b',
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Branch Finder · before you pick a college
              </span>
            </div>
            <h1
              className="mx-auto"
              style={{
                fontFamily: "'Space Grotesk', 'Geist', system-ui, sans-serif",
                fontSize: 'clamp(32px, 6vw, 72px)',
                fontWeight: 700,
                lineHeight: 0.99,
                letterSpacing: '-0.035em',
                maxWidth: 900,
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, #c8c8d0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block',
                }}
              >
                Too many branches.
              </span>
              <span
                style={{
                  background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 60%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block',
                  marginTop: 4,
                }}
              >
                Let&apos;s clear the fog.
              </span>
            </h1>
            <p
              className="mx-auto mt-6"
              style={{
                maxWidth: 680,
                fontSize: 'clamp(15px, 1.1vw, 18px)',
                color: '#9a9aa6',
                lineHeight: 1.55,
              }}
            >
              Tell us what the student loves and dreams of. A cloud of every engineering and science
              program thins down to the few that actually fit — each marked with how it&apos;s likely
              to fare in the AI era, so you choose with the next 15 years in view.
            </p>
          </header>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="h-96 rounded-2xl bg-[#0B0F15] border border-white/5 animate-pulse mx-auto max-w-6xl" />
        }
      >
        <BranchFinderShell />
      </Suspense>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 pt-14 pb-20">
        <section className="mt-4">
          <Link
            href="/college-predictor#predictor"
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl border transition-colors"
            style={{ background: '#f59e0b10', borderColor: '#f59e0b40' }}
          >
            <div>
              <div className="text-base md:text-lg font-semibold text-white">
                Already know the branch? See which colleges you can get →
              </div>
              <div className="text-sm text-zinc-400 mt-1">
                Enter your JEE Main rank or BITSAT score for Safe / Target / Reach NITs, IIITs, GFTIs and BITS campuses.
              </div>
            </div>
            <span
              className="self-start sm:self-auto whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold"
              style={{ background: 'linear-gradient(to right, #f97316, #f59e0b)', color: '#000' }}
            >
              Open College Predictor
            </span>
          </Link>
        </section>

        <div className="mt-10 text-center">
          <Link
            href="/the-crucible"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-colors"
          >
            Still preparing? Practice JEE questions on The Crucible →
          </Link>
        </div>
      </div>
    </main>
  );
}
