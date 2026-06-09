import { getTaxonomy } from '@/features/crucible/server-actions/the-crucible';
import CrucibleWizard from '@/features/crucible/components/CrucibleWizard';
import { Metadata } from 'next';
import { createClient } from '../utils/supabase/server';
import { isLocalhostDev } from '@/lib/bookAuth';
import { buildChaptersWithCounts, subjectForChapterId, groupForChapter, type ChapterWithCounts } from '@/features/crucible/lib/chapterCounts';

export const revalidate = 3600; // Revalidate every hour — question counts don't change per-request

// SEO note 2026-05-25: page is OVER-performing benchmark (6.86% CTR at avg
// position 8.5 vs ~3% expected — the unique brand title "Forge Your Rank"
// stands out). Title + description left untouched intentionally. Only
// refreshed the keywords array: removed stale "JEE Main 2026" mention,
// added 2027 + 2028 cohort signals. Brand-query traffic to this page is
// the primary acquisition channel for the question bank itself.
export const metadata: Metadata = {
    title: 'The Crucible | Forge Your Rank - Master Chemistry',
    description: 'Master Chemistry one question at a time. Personalized practice sessions and mock tests designed by Paaras Sir for JEE Main, JEE Advanced, and NEET.',
    keywords: [
        'JEE Question Bank',
        'Paaras Sir Chemistry',
        'IIT JEE Practice',
        'JEE Main 2027',
        'JEE Main 2028',
        'JEE Advanced 2027',
        'JEE Advanced 2028',
        'JEE Advanced Mock Test',
        'NEET 2027 Chemistry',
        'NEET 2028 Chemistry',
        'NEET Chemistry',
        'Canvas Classes Crucible',
    ],
    alternates: {
        canonical: 'https://www.canvasclasses.in/the-crucible',
    },
};

export default async function Page() {
    // Auth check — wrapped so a Supabase outage never 500s the landing page.
    let isLoggedIn = await isLocalhostDev();
    try {
        const supabase = await createClient();
        if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            isLoggedIn = isLoggedIn || !!user;
        }
    } catch (err) {
        console.error('Supabase auth check failed on /the-crucible:', err);
        // Fall through with isLoggedIn = isLocalhostDev() result
    }

    let chaptersWithCounts: ChapterWithCounts[] = [];
    try {
        chaptersWithCounts = await buildChaptersWithCounts();
    } catch (error) {
        console.error('Failed to fetch chapters:', error);
        // Fallback: serve a minimal taxonomy with zero counts rather than 500ing.
        const chapters = await getTaxonomy();
        chaptersWithCounts = chapters.map(ch => ({
            id: ch.id,
            name: ch.name,
            class_level: ch.class_level ?? 11,
            display_order: ch.display_order ?? 0,
            category: 'Physical' as const,
            subject: subjectForChapterId(ch.id),
            group: groupForChapter(ch.id, undefined, ch.class_level ?? 11),
            question_count: 0,
            star_question_count: 0,
            neet_question_count: 0,
            neet_star_question_count: 0,
        }));
    }

    return (
        <CrucibleWizard chapters={chaptersWithCounts} isLoggedIn={isLoggedIn} />
    );
}
