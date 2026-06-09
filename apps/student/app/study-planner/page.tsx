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
        type: 'website',
    },
    alternates: { canonical: '/study-planner' },
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
            {/* Suspense boundary lets the page stay statically prerenderable even
                though PlannerClient reads `useSearchParams()` for ?m=... mode sync. */}
            <Suspense fallback={null}>
                <PlannerClient fullCatalog={fullCatalog} />
            </Suspense>
        </div>
    );
}
