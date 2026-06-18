import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { buildChaptersWithCounts, chaptersBaseFromTaxonomy, CRUCIBLE_ALL_SUBJECTS, type ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';
import CrucibleChapterClient from './CrucibleChapterClient';

// ISR — 24h edge cache (was 1h; high-cardinality, bot-crawled listing pages
// drove excess ISR writes in 2026-06). Chapter counts are informational, so a
// 24h lag is fine; counts come from unstable_cache (invalidated by the
// 'questions' tag) and refresh on the next page regeneration.
//
// All auth-aware UI lives inside CrucibleChapterClient (a client island
// that reads Supabase on mount). The page itself reads only public Mongo
// data + the route params, so it's safe to serve from the edge cache to
// anonymous visitors, bots, and logged-in students alike.
//
// Prior to 2026-06 this page set `export const dynamic = 'force-dynamic'`
// to read cookies server-side; that pattern was the primary driver of
// Fast Origin Transfer + Function Invocation cost on canvasclasses.in.
// The fix is documented in the bill diagnostic from that month.
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
    const { chapterId } = await params;
    // Use the same all-subjects source as the page body so Physics/Maths chapters
    // get a real title, not "Not Found". On a DB blip, fall back to the static
    // taxonomy (all subjects, zero counts) — still resolves the chapter name.
    let chapters: { id: string; name: string }[];
    try {
        chapters = await buildChaptersWithCounts({ subjects: CRUCIBLE_ALL_SUBJECTS });
    } catch {
        chapters = await chaptersBaseFromTaxonomy(CRUCIBLE_ALL_SUBJECTS);
    }
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return { title: 'Not Found' };

    return {
        title: `${chapter.name} PYQ Practice | The Crucible`,
        description: `Practice ${chapter.name} questions from JEE Main, JEE Advanced and NEET. Curated PYQs with full solutions by Paaras Sir.`,
        keywords: [
            `${chapter.name} JEE questions`,
            `${chapter.name} NEET questions`,
            `${chapter.name} PYQ`,
            `${chapter.name} practice`,
            'Canvas Classes Crucible',
            'Paaras Sir Chemistry',
        ],
        alternates: {
            canonical: `https://www.canvasclasses.in/the-crucible/${chapterId}`,
        },
        openGraph: {
            title: `${chapter.name} — Practice Questions | Canvas Classes`,
            description: `Master ${chapter.name} with curated JEE/NEET PYQs and detailed solutions.`,
            url: `https://www.canvasclasses.in/the-crucible/${chapterId}`,
        },
    };
}

export default async function Page({ params }: { params: Promise<{ chapterId: string }> }) {
    const { chapterId } = await params;

    // Build chapters list using the shared utility — keeps JEE/NEET counts
    // identical to /the-crucible/page.tsx so the user sees consistent numbers
    // whether they navigated from the landing or hit the chapter URL directly.
    let chaptersWithCounts: ChapterWithCounts[] = [];
    try {
        chaptersWithCounts = await buildChaptersWithCounts({ subjects: CRUCIBLE_ALL_SUBJECTS });
    } catch (error) {
        console.error(`Failed to build chapters for /the-crucible/${chapterId}:`, error);
        // DB-down fallback: real chapters (all subjects) with zero counts.
        chaptersWithCounts = await chaptersBaseFromTaxonomy(CRUCIBLE_ALL_SUBJECTS);
    }

    const chapter = chaptersWithCounts.find(ch => ch.id === chapterId);
    if (!chapter) notFound();

    return (
        <CrucibleChapterClient
            chapters={chaptersWithCounts}
            initialChapterId={chapterId}
        />
    );
}
