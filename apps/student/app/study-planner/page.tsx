import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Space_Grotesk, Plus_Jakarta_Sans } from 'next/font/google';
import { buildChaptersWithCounts } from '@/features/crucible/lib/chapterCounts';
import { CHAPTER_META_LIST } from '@/features/notes/data/chapterMetadata';
import { buildSubjectCatalog } from './planner-data';
import { buildPhysicsChapters, buildMathChapters } from './catalog.server';
import { buildDetailedLecturesMap } from './lectures.server';
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
        'A free chapter-wise study planner for JEE & NEET — Class 11, Class 12, and Droppers. Set your target date, follow the Learn → Solve → PYQ → Re-test loop, and track progress and spaced revision across Physics, Chemistry and Maths in one place.',
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
        'Free chapter-wise study planner for JEE & NEET aspirants (Class 11, Class 12 and Droppers), with target-date planning, the Learn → Solve → PYQ → Re-test loop, 5-stage spaced revision, and per-chapter resource aggregation across Physics, Chemistry and Maths.',
    publisher: { '@type': 'Organization', name: 'Canvas Classes', url: 'https://www.canvasclasses.in' },
};

// FAQ copy — single source of truth for BOTH the visible section below and the
// FAQPage JSON-LD. AI answer engines (ChatGPT / Perplexity / Claude) quote these
// almost verbatim, so keep answers self-contained, factual, and in plain warm
// English. If you edit a question/answer, you edit it once here.
const faqs: { q: string; a: string }[] = [
    {
        q: 'Is the Canvas Classes study planner free?',
        a: 'Yes — completely free. No sign-up wall, no payment, no trial that runs out. Open it and start planning your JEE or NEET preparation today.',
    },
    {
        q: 'Who is this study planner for?',
        a: 'Class 11, Class 12, and droppers preparing for JEE (Main and Advanced) and NEET. You pick your mode, and the plan shapes itself around where you are right now.',
    },
    {
        q: 'How does the study planner work?',
        a: 'Set your target exam date. The planner breaks the full syllabus into chapters, and for each chapter you follow one simple loop — Learn, Solve, PYQ, Re-test. It then schedules spaced revision so the chapters you finish do not slip out of your memory.',
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
        q: 'Do I need to create an account?',
        a: 'No account is needed to start — your progress saves on your device. Log in only when you want to sync your plan across your phone and laptop.',
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

// The Learn -> Solve -> PYQ -> Re-test loop, rendered server-side as crawlable copy.
const LOOP_STEPS: { n: string; title: string; body: string }[] = [
    { n: '01', title: 'Learn', body: 'Watch the lecture, read the notes. Get the concept crystal clear before anything else.' },
    { n: '02', title: 'Solve', body: 'Practice questions until the steps live in your hand, not just your head.' },
    { n: '03', title: 'PYQ', body: 'Hit the real past-year questions. This is what the exam actually asks you.' },
    { n: '04', title: 'Re-test', body: 'Come back later and test yourself. Prove the chapter is still yours.' },
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
    const [chemChapters, physicsChapters, mathChapters, detailedMap] = await Promise.all([
        buildChaptersWithCounts(),
        buildPhysicsChapters(),
        buildMathChapters(),
        buildDetailedLecturesMap(),
    ]);
    const fullCatalog = [
        ...buildSubjectCatalog(chemChapters, 'chemistry', NOTES_SLUG_BY_CHAPTER, detailedMap),
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
            <section className="bg-[#050505] text-white border-t border-white/5 px-5 sm:px-6 py-16 sm:py-20">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight">
                        A Free Study Planner for JEE &amp; NEET — Class 11, 12 &amp; Droppers
                    </h1>
                    <p className="mt-4 text-lg sm:text-xl font-semibold text-amber-400">
                        You don&apos;t need to study harder. You need to study with a plan.
                    </p>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-white/70">
                        Most students don&apos;t fall behind because they&apos;re weak. They fall behind
                        because they study without a map — random chapters one day, nothing the next,
                        and old topics quietly forgotten. This free planner fixes that. Pick your
                        target date, and your entire Physics, Chemistry and Maths syllabus turns into
                        a clear, chapter-by-chapter roadmap you can actually follow.
                    </p>

                    {/* How it works — the loop */}
                    <h2 className="mt-12 text-2xl font-bold">One simple loop for every chapter</h2>
                    <p className="mt-2 text-white/60">Master one chapter the right way, then repeat. That&apos;s the whole game.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {LOOP_STEPS.map((s) => (
                            <div key={s.n} className="rounded-xl border border-white/5 bg-[#0B0F15] p-5">
                                <div className="font-mono text-sm font-bold text-amber-400">{s.n}</div>
                                <div className="mt-1 text-lg font-bold">{s.title}</div>
                                <p className="mt-1 text-sm leading-relaxed text-white/60">{s.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Who it's for */}
                    <h2 className="mt-12 text-2xl font-bold">Built for where you are right now</h2>
                    <div className="mt-6 space-y-3">
                        {WHO_FOR.map((w) => (
                            <div key={w.tag} className="flex flex-col gap-1 rounded-xl border border-white/5 bg-[#0B0F15] p-5 sm:flex-row sm:items-center sm:gap-4">
                                <span className="shrink-0 rounded-full bg-amber-500/15 px-3 py-1 text-sm font-bold text-amber-300 sm:w-28 sm:text-center">{w.tag}</span>
                                <span className="text-white/70">{w.line}</span>
                            </div>
                        ))}
                    </div>

                    {/* Revision */}
                    <h2 className="mt-12 text-2xl font-bold">Revision that won&apos;t let you forget</h2>
                    <p className="mt-2 text-base sm:text-lg leading-relaxed text-white/70">
                        Learning a chapter is the easy part. Remembering it three months later — that&apos;s
                        the real exam. The planner runs a 5-stage spaced-revision system: it tells you
                        which chapter to revisit and exactly when, so nothing you worked hard for slips
                        away. New topics move forward, old topics stay sharp.
                    </p>
                    <p className="mt-6 text-lg font-semibold text-amber-400">
                        Start today. Not Monday, not next month — today. One chapter is all it takes to begin.
                    </p>

                    {/* FAQ — visible copy mirrors faqJsonLd above */}
                    <h2 className="mt-14 text-2xl font-bold">Quick questions, honest answers</h2>
                    <div className="mt-6 space-y-4">
                        {faqs.map((f) => (
                            <div key={f.q} className="rounded-xl border border-white/5 bg-[#0B0F15] p-5">
                                <h3 className="text-base font-bold sm:text-lg">{f.q}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/60 sm:text-base">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
