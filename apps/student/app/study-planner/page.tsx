import { Suspense, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import { buildChaptersWithCounts } from '@/features/crucible/lib/chapterCounts';
import { CHAPTER_META_LIST } from '@/features/notes/data/chapterMetadata';
import { buildSubjectCatalog } from './planner-data';
import { buildPhysicsChapters, buildMathChapters } from './catalog.server';
import { buildDetailedLecturesMap } from './lectures.server';
import { buildFlashcardSlugMap } from './flashcards.server';
import { PlannerClient } from './PlannerClient';
import './planner.css';

// chapter id → Handwritten Notes slug, derived from the notes page's own chapter
// metadata (the single source of truth). Imported only here, in this Server
// Component, so the large metadata file never ships in the client bundle — the
// catalog passed to the client carries only the resolved href strings. First
// match wins (a chapter id can appear on two notes slugs, e.g. ch11_hydrocarbon).
const NOTES_SLUG_BY_CHAPTER: Record<string, string> = (() => {
    const map: Record<string, string> = {};
    for (const c of CHAPTER_META_LIST) {
        if (c.crucibleChapterId && !(c.crucibleChapterId in map)) map[c.crucibleChapterId] = c.slug;
    }
    // The single p-Block notes page covers Class 11 too (its metadata is tagged
    // to ch12_pblock), so point the Class 11 p-Block chapter at it as well.
    if (!('ch11_pblock' in map)) map.ch11_pblock = 'p-block';
    return map;
})();

// Cacheable Server Component (CLAUDE.md §10). NEVER add `force-dynamic` or
// `revalidate = 0`. The interactive planner is a client island that reads only
// public catalog data passed as props; all per-user state lives in the island
// and syncs via /api/drop-planner.
export const revalidate = 3600;

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--dyp-ff-display-google',
    display: 'swap',
});
const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--dyp-ff-google',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Free Study Planner — JEE & NEET Chapter-wise Tracker (Class 11, 12 & Droppers)',
    description:
        'A free chapter-wise study planner for JEE & NEET — Class 11, Class 12, and Droppers. Set your target date, follow the Learn → Apply → Practice → Revise loop, and track progress and spaced revision across Physics, Chemistry and Maths in one place.',
    keywords: [
        'study planner',
        'free study planner',
        'online study planner',
        'JEE study planner',
        'NEET study planner',
        'class 11 study planner',
        'class 12 study planner',
        'dropper study planner',
        'JEE NEET chapter wise plan',
        'Canvas Classes study planner',
    ],
    openGraph: {
        title: 'Free Study Planner — JEE & NEET, Class 11 / 12 / Dropper',
        description:
            'Chapter-by-chapter study planner for JEE & NEET aspirants. Lectures, notes, practice, target-date planning, and spaced revision — all in one window.',
        // url + images must be set explicitly: Next replaces (not deep-merges)
        // the parent layout's openGraph object, so without these the social /
        // AI-citation card would render with no image.
        url: 'https://www.canvasclasses.in/study-planner',
        siteName: 'Canvas Classes',
        locale: 'en_IN',
        type: 'website',
        images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Canvas Classes Study Planner — JEE & NEET' }],
    },
    alternates: { canonical: 'https://www.canvasclasses.in/study-planner' },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Study Planner — JEE & NEET',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    url: 'https://www.canvasclasses.in/study-planner',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
    description:
        'Free chapter-wise study planner for JEE & NEET aspirants (Class 11, Class 12 and Droppers), with target-date planning, the Learn → Apply → Practice → Revise loop, 5-stage spaced revision, and per-chapter resource aggregation across Physics, Chemistry and Maths.',
    publisher: { '@type': 'Organization', name: 'Canvas Classes', url: 'https://www.canvasclasses.in' },
};

// FAQ copy — single source of truth for BOTH the visible section below and the
// FAQPage JSON-LD. AI answer engines (ChatGPT / Perplexity / Claude) quote these
// almost verbatim, so keep answers self-contained, factual, and in plain warm
// English. If you edit a question/answer, you edit it once here.
const faqs: { q: string; a: string }[] = [
    {
        q: 'Is sign in required?',
        a: 'Yes — sign in so your progress actually saves. Without an account your plan lives only in this browser, and clearing your history or moving to a new phone wipes it out. Sign in once and your chapters, streak and revision schedule are saved for good and follow you on every device.',
    },
    {
        q: 'Who is this study planner for?',
        a: 'Class 11, Class 12, and droppers preparing for JEE (Main and Advanced) and NEET. You pick your mode, and the plan shapes itself around where you are right now.',
    },
    {
        q: 'How does the study planner work?',
        a: 'Set your target date. The planner breaks the full syllabus into chapters, and for each chapter you follow one simple loop — Learn the concept, Apply it on worked DPPs, Practice on Crucible, then Revise with flashcards and a mock test. It schedules spaced revision so the chapters you finish do not slip out of your memory.',
    },
    {
        q: 'Does it cover Physics, Chemistry and Maths?',
        a: 'Yes. Every chapter across Physics, Chemistry and Maths for Class 11 and 12 is built in, with lectures, notes and practice linked right next to each chapter.',
    },
    {
        q: 'Will it help me with revision?',
        a: 'That is its biggest strength. It uses a 5-stage spaced-revision system that tells you exactly which chapter to revise and when — so old topics stay sharp while you learn new ones.',
    },
    {
        q: 'When is the best time to start?',
        a: 'Right now. A simple plan you start today beats a perfect plan you keep putting off. One chapter at a time is how every topper got there.',
    },
];

const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
};

// The Learn -> Apply -> Practice -> Revise loop, rendered server-side as crawlable copy.
// Icons are inline SVG (no lucide import) so this stays a clean Server Component.
const LOOP_STEPS: { n: string; title: string; body: string; icon: ReactNode }[] = [
    {
        n: '01', title: 'Learn', body: 'Watch the lecture, read the notes. Get the concept crystal clear before anything else.',
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></svg>),
    },
    {
        n: '02', title: 'Apply', body: 'Learn how to solve — work through DPPs where the method is shown step by step.',
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.4 2.6a2 2 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>),
    },
    {
        n: '03', title: 'Practice', body: 'Now solve on your own in Crucible — chapter questions and real PYQs.',
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" /></svg>),
    },
    {
        n: '04', title: 'Revise', body: 'Come back later — flashcards and a mock test to prove the chapter is still yours.',
        icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>),
    },
];

const WHO_FOR: { tag: string; line: string }[] = [
    { tag: 'Class 11', line: 'Build a rock-solid base, chapter by chapter, without the panic.' },
    { tag: 'Class 12', line: 'Balance boards and entrance — and keep your Class 11 alive.' },
    { tag: 'Droppers', line: 'One focused year, one clear plan, zero guesswork.' },
];

export default async function StudyPlannerPage() {
    // fullCatalog contains every chapter across all three subjects (chemistry
    // Class 11+12, physics Class 11+12, math). The client filters it per
    // (mode, subject) for sidebar/roadmap display, but always uses the full set
    // when opening a chapter — so a Class 12 student can dive into a Class 11
    // prereq without leaving Class 12 mode. getExamBoardChapterCounts is shared
    // and cached, so the three builders don't triple the DB work.
    const [chemChapters, physicsChapters, mathChapters, detailedMap, flashcardSlugMap] = await Promise.all([
        // buildChaptersWithCounts() defaults to Chemistry-only; the planner sources
        // physics/math separately via buildPhysics/MathChapters, so this is exactly
        // the chemistry set we want (no over-fetch, no narrowing to remember).
        buildChaptersWithCounts(),
        buildPhysicsChapters(),
        buildMathChapters(),
        buildDetailedLecturesMap(),
        buildFlashcardSlugMap(),
    ]);
    const fullCatalog = [
        ...buildSubjectCatalog(chemChapters, 'chemistry', NOTES_SLUG_BY_CHAPTER, detailedMap, flashcardSlugMap),
        ...buildSubjectCatalog(physicsChapters, 'physics'),
        ...buildSubjectCatalog(mathChapters, 'math'),
    ];
    return (
        <div className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
            {/* Suspense boundary lets the page stay statically prerenderable even
                though PlannerClient reads `useSearchParams()` for ?m=... mode sync.
                A real skeleton (not null) so the first paint isn't a blank screen. */}
            <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
                <PlannerClient fullCatalog={fullCatalog} />
            </Suspense>

            {/* ─────────────────────────────────────────────────────────────────
                Server-rendered SEO / GEO content. Lives in the Server Component so
                it ships in the initial HTML — readable by Google AND by AI answer
                engines (ChatGPT / Perplexity / Claude) that don't execute JS. The
                interactive planner above is a client island with no crawlable text,
                so this section is what ranks the page and gets it cited. Voice:
                warm + punchy, a teacher talking to a tier-2/3 JEE/NEET student.
                See CLAUDE.md §10 + _agents/SEO_PLAYBOOK.md.
                ───────────────────────────────────────────────────────────────── */}
            <section className="bg-[#050505] text-white border-t border-white/5">
                {/* .dyp-wrap is the planner's OWN content container (max-width 1180,
                    centred, matching gutters), so this SEO block lines up exactly
                    with the dashboard above it — no flaky arbitrary max-width class. */}
                <div className="dyp-wrap">
                    {/* ── Intro ──────────────────────────────────────────────── */}
                    <span className="inline-flex items-center rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-300">
                        Free · JEE &amp; NEET
                    </span>
                    <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight text-white/90 sm:text-4xl">
                        A Free Study Planner for JEE &amp; NEET — Class 11, 12 &amp; Droppers
                    </h1>
                    <p className="mt-4 text-lg font-semibold text-amber-400 sm:text-xl">
                        You don&apos;t need to study harder. You need to study with a plan.
                    </p>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
                        Most students don&apos;t fall behind because they&apos;re weak. They fall behind
                        because they study without a map — random chapters one day, nothing the next,
                        and old topics quietly forgotten. This free planner fixes that. Pick your
                        target date, and your entire Physics, Chemistry and Maths syllabus turns into
                        a clear, chapter-by-chapter roadmap you can actually follow.
                    </p>

                    {/* ── The loop: one connected flow ───────────────────────── */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white/90">One loop. Every chapter.</h2>
                        <p className="mt-2 text-white/55">Four moves that turn a chapter from new to nailed — then it resets for the next.</p>

                        <div className="relative mt-10">
                            {/* connector rail (desktop) — fades at both ends, nodes sit on top */}
                            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent md:block" />
                            <ol className="grid gap-8 md:grid-cols-4 md:gap-5">
                                {LOOP_STEPS.map((s) => (
                                    <li key={s.n} className="relative flex items-start gap-4 md:flex-col md:items-center md:text-center">
                                        <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-[#0B0F15] text-amber-300">
                                            {s.icon}
                                        </div>
                                        <div className="md:mt-5">
                                            <div className="flex items-center gap-2 md:justify-center">
                                                <span className="font-mono text-[11px] font-bold text-amber-400/70">{s.n}</span>
                                                <h3 className="text-base font-bold text-white/90">{s.title}</h3>
                                            </div>
                                            <p className="mt-1.5 text-sm leading-relaxed text-white/55">{s.body}</p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                            {/* the loop closes — repeat motif */}
                            <div className="mt-10 flex items-center justify-center gap-2.5 text-sm text-white/45">
                                <svg className="h-4 w-4 text-amber-400/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg>
                                <span>Chapter done — the loop resets for the next one. That&apos;s the whole engine.</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Who it's for ───────────────────────────────────────── */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white/90">Built for where you are right now</h2>
                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {WHO_FOR.map((w) => (
                                <div key={w.tag} className="rounded-2xl border border-white/10 bg-[#0B0F15] p-6">
                                    <span className="inline-flex rounded-full bg-amber-500/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">{w.tag}</span>
                                    <p className="mt-3 text-sm leading-relaxed text-white/60">{w.line}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Revision (callout) ─────────────────────────────────── */}
                    <div className="mt-16 rounded-2xl border border-amber-500/20 bg-[#0B0F15] p-7 sm:p-9">
                        <h2 className="text-2xl font-bold text-white/90">Revision that won&apos;t let you forget</h2>
                        <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg">
                            Learning a chapter is the easy part. Remembering it three months later — that&apos;s
                            the real exam. The planner runs a 5-stage spaced-revision system: it tells you
                            which chapter to revisit and exactly when, so nothing you worked hard for slips
                            away. New topics move forward, old topics stay sharp.
                        </p>
                        <p className="mt-5 text-lg font-semibold text-amber-400">
                            Start today. Not Monday, not next month — today. One chapter is all it takes to begin.
                        </p>
                    </div>

                    {/* ── FAQ ────────────────────────────────────────────────── */}
                    {/* Collapsed <details> accordion. Native <details> keeps every
                        answer in the HTML (just visually hidden), so Google + AI
                        answer engines still read it; the FAQPage JSON-LD carries the
                        same Q&A. */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-white/90">Quick questions, honest answers</h2>
                        <div className="mt-6 space-y-2.5">
                            {faqs.map((f) => (
                                <details
                                    key={f.q}
                                    className="group rounded-2xl border border-white/10 bg-[#0B0F15] px-5 [&_summary::-webkit-details-marker]:hidden"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-base font-semibold text-white/75 sm:text-lg">
                                        {f.q}
                                        <svg className="h-4 w-4 shrink-0 text-amber-400/60 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                                    </summary>
                                    <p className="-mt-1 pb-4 text-sm leading-relaxed text-white/55 sm:text-base">{f.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
