import { unstable_cache } from 'next/cache';

// Single source of truth for the JEE/NEET chapter count aggregations used by
// both /the-crucible/page.tsx (chapter list) and /the-crucible/[chapterId]/page.tsx
// (direct chapter URLs). Both routes must show identical counts so that a user
// navigating from the chapter list into a chapter detail sees consistent numbers.
//
// Cache for 1 hour with `tags: ['questions']` — invalidated whenever questions
// are added/edited/deleted via the admin API.
export const getExamBoardChapterCounts = unstable_cache(
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

// Capitalize a category string from the taxonomy data into the canonical UI
// type. Matches the helper that previously lived inline in /the-crucible/page.tsx.
export function capitalizeCategory(cat?: string): 'Physical' | 'Inorganic' | 'Organic' | 'Practical' {
    if (!cat) return 'Physical';
    const lower = cat.toLowerCase();
    if (lower === 'physical') return 'Physical';
    if (lower === 'inorganic') return 'Inorganic';
    if (lower === 'organic') return 'Organic';
    if (lower === 'practical') return 'Practical';
    return 'Physical';
}

// Shared shape returned to CrucibleWizard. Both routes must produce identical
// objects so the wizard sees the same counts no matter how the user arrived.
export interface ChapterWithCounts {
    id: string;
    name: string;
    class_level: number;
    display_order: number;
    category: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
    question_count: number;          // JEE all
    star_question_count: number;     // JEE star
    neet_question_count: number;     // NEET all
    neet_star_question_count: number;// NEET star
}

// Build the chapters-with-counts array used by both /the-crucible/page.tsx and
// /the-crucible/[chapterId]/page.tsx. Centralised so the two pages can never
// drift out of agreement.
export async function buildChaptersWithCounts(): Promise<ChapterWithCounts[]> {
    const { TAXONOMY_FROM_CSV } = await import('@/app/crucible/admin/taxonomy/taxonomyData_from_csv');

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

    return baseChapters.map((node) => ({
        id: node.id,
        name: node.name,
        class_level: node.class_level ?? 11,
        display_order: node.sequence_order ?? 0,
        category: capitalizeCategory(node.chapterType),
        question_count: jeeCountMap.get(node.id) ?? 0,
        star_question_count: jeeStarMap.get(node.id) ?? 0,
        neet_question_count: neetCountMap.get(node.id) ?? 0,
        neet_star_question_count: neetStarMap.get(node.id) ?? 0,
    }));
}
