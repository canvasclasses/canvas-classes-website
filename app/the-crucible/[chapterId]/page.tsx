import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getTaxonomy } from '../actions';
import CrucibleWizard from '../components/CrucibleWizard';
import { createClient } from '@/app/utils/supabase/server';
import { isLocalhostDev } from '@/lib/bookAuth';
import { buildChaptersWithCounts, type ChapterWithCounts } from '../lib/chapterCounts';

// Dynamic rendering — the page reads cookies() for auth state, which forces it
// out of SSG anyway. Pre-rendering all 26 chapters at deploy time was wasteful
// (3 min added to build) and incorrect (every static copy was generated with
// `isLoggedIn=false` because there are no cookies at build time).
//
// With dynamic rendering, each request gets fresh auth state and the underlying
// MongoDB count aggregations are still served from `unstable_cache` (1 hour TTL,
// invalidated by 'questions' tag), so the per-request cost is negligible.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ chapterId: string }> }): Promise<Metadata> {
    const { chapterId } = await params;
    const chapters = await getTaxonomy();
    const chapter = chapters.find(ch => ch.id === chapterId);
    if (!chapter) return { title: 'Not Found' };

    return {
        title: `${chapter.name} PYQ Practice | The Crucible — Canvas Classes`,
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

export default async function Page({
    params,
    searchParams,
}: {
    params: Promise<{ chapterId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { chapterId } = await params;
    const resolvedSearch = await searchParams;

    // Read examBoard from URL (?examBoard=NEET or ?examBoard=JEE)
    const rawBoard = resolvedSearch['examBoard'];
    const examBoard = rawBoard === 'NEET' ? 'NEET' : rawBoard === 'JEE' ? 'JEE' : undefined;

    // Auth check — wrapped so a Supabase outage / build-time invocation never 500s.
    let isLoggedIn = await isLocalhostDev();
    try {
        const supabase = await createClient();
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            isLoggedIn = isLoggedIn || !!user;
        }
    } catch (err) {
        console.error(`Supabase auth check failed on /the-crucible/${chapterId}:`, err);
        // Fall through — page can still render for non-logged-in users.
    }

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
        <CrucibleWizard
            chapters={chaptersWithCounts}
            isLoggedIn={isLoggedIn}
            initialChapterId={chapterId}
            initialMode="browse"
            initialExam={examBoard}
        />
    );
}
