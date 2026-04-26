import { getTaxonomy } from './actions';
import CrucibleWizard from './components/CrucibleWizard';
import { Metadata } from 'next';
import { createClient } from '../utils/supabase/server';
import { isLocalhostDev } from '@/lib/bookAuth';
import { unstable_cache } from 'next/cache';

export const revalidate = 3600; // Revalidate every hour — question counts don't change per-request

// Cache the 4 expensive aggregations (JEE/NEET × all/star) for 1 hour.
// Invalidate via tag 'questions' when questions are added/edited.
const getExamBoardChapterCounts = unstable_cache(
    async () => {
        const connectDB = (await import('@/lib/mongodb')).default;
        const { QuestionV2 } = await import('@/lib/models/Question.v2');
        await connectDB();

        const [jeeStarCounts, jeeAllCounts, neetStarCounts, neetAllCounts] = await Promise.all([
            QuestionV2.aggregate([
                { $match: { 'metadata.applicableExams': 'JEE', 'metadata.is_top_pyq': true, deleted_at: null } },
                { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
            ]),
            QuestionV2.aggregate([
                { $match: { 'metadata.applicableExams': 'JEE', deleted_at: null } },
                { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
            ]),
            QuestionV2.aggregate([
                { $match: { 'metadata.applicableExams': 'NEET', 'metadata.is_top_pyq': true, deleted_at: null } },
                { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
            ]),
            QuestionV2.aggregate([
                { $match: { 'metadata.applicableExams': 'NEET', deleted_at: null } },
                { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
            ]),
        ]);

        return { jeeStarCounts, jeeAllCounts, neetStarCounts, neetAllCounts };
    },
    ['the-crucible-applicable-exams-chapter-counts-v2'],
    { revalidate: 3600, tags: ['questions'] }
);

export const metadata: Metadata = {
    title: 'The Crucible | Forge Your Rank - Master Chemistry',
    description: 'Master Chemistry one question at a time. Personalized practice sessions and mock tests designed by Paaras Sir for JEE Main, JEE Advanced, and NEET.',
    keywords: [
        'JEE Question Bank',
        'Paaras Sir Chemistry',
        'IIT JEE Practice',
        'JEE Main 2026',
        'JEE Advanced Mock Test',
        'NEET Chemistry',
        'Canvas Classes Crucible'
    ],
    alternates: {
        canonical: 'https://www.canvasclasses.in/the-crucible',
    },
};

export default async function Page() {
    const supabase = await createClient();
    const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

    // Localhost dev bypass — never trips on Vercel previews (where NODE_ENV is also 'development').
    const isLoggedIn = (await isLocalhostDev()) || !!user;

    // Fetch chapters with star counts directly from database
    let chaptersWithCounts = [];
    try {
        const { TAXONOMY_FROM_CSV } = await import('@/app/crucible/admin/taxonomy/taxonomyData_from_csv');

        // Get base chapters from taxonomy - only chemistry chapters (ch11_* and ch12_*)
        const baseChapters = TAXONOMY_FROM_CSV.filter(
            (node) => node.type === 'chapter' &&
            node.id !== 'ch_unsorted' &&
            (node.id.startsWith('ch11_') || node.id.startsWith('ch12_'))
        );

        const { jeeStarCounts, jeeAllCounts, neetStarCounts, neetAllCounts } = await getExamBoardChapterCounts();

        const jeeStarMap  = new Map(jeeStarCounts.map( (item: { _id: string; count: number }) => [item._id, item.count]));
        const jeeCountMap = new Map(jeeAllCounts.map(  (item: { _id: string; count: number }) => [item._id, item.count]));
        const neetStarMap  = new Map(neetStarCounts.map((item: { _id: string; count: number }) => [item._id, item.count]));
        const neetCountMap = new Map(neetAllCounts.map( (item: { _id: string; count: number }) => [item._id, item.count]));

        // Helper to capitalize category
        const capitalizeCategory = (cat?: string): 'Physical' | 'Inorganic' | 'Organic' | 'Practical' => {
            if (!cat) return 'Physical';
            const lower = cat.toLowerCase();
            if (lower === 'physical') return 'Physical';
            if (lower === 'inorganic') return 'Inorganic';
            if (lower === 'organic') return 'Organic';
            if (lower === 'practical') return 'Practical';
            return 'Physical';
        };

        // Build two parallel chapter lists — same taxonomy, different counts
        chaptersWithCounts = baseChapters.map((node) => ({
            id: node.id,
            name: node.name,
            class_level: node.class_level ?? 11,
            display_order: node.sequence_order ?? 0,
            category: capitalizeCategory(node.chapterType),
            // JEE counts
            question_count: jeeCountMap.get(node.id) ?? 0,
            star_question_count: jeeStarMap.get(node.id) ?? 0,
            // NEET counts (same chapters, separate tallies)
            neet_question_count: neetCountMap.get(node.id) ?? 0,
            neet_star_question_count: neetStarMap.get(node.id) ?? 0,
        }));
    } catch (error) {
        console.error('Failed to fetch chapters:', error);
        // Fallback to getTaxonomy
        const chapters = await getTaxonomy();
        chaptersWithCounts = chapters.map(ch => ({
            ...ch,
            question_count: 0,
            star_question_count: 0,
        }));
    }

    return (
        <CrucibleWizard chapters={chaptersWithCounts} isLoggedIn={isLoggedIn} />
    );
}
