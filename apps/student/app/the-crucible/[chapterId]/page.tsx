import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTaxonomy } from '@/features/crucible/server-actions/the-crucible';
import { buildChaptersWithCounts, type ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';
import CrucibleChapterClient from './CrucibleChapterClient';

// ISR — 1-hour edge cache. The underlying chapter counts come from
// unstable_cache (1h TTL, invalidated by the 'questions' tag), so the
// page payload and the data layer agree on freshness.
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
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
    const { chapterId } = await params;
    const chapters = await getTaxonomy();
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
        chaptersWithCounts = await buildChaptersWithCounts();
    } catch (error) {
        console.error(`Failed to build chapters for /the-crucible/${chapterId}:`, error);
        const chapters = await getTaxonomy();
        chaptersWithCounts = chapters.map(ch => ({
            id: ch.id,
            name: ch.name,
            class_level: ch.class_level ?? 11,
            display_order: ch.display_order ?? 0,
            category: 'Physical' as const,
            question_count: 0,
            star_question_count: 0,
            neet_question_count: 0,
            neet_star_question_count: 0,
        }));
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
