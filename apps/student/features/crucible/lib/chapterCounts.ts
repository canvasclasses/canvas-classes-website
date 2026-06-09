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
        const connectDB = (await import('@canvas/data/db/mongodb')).default;
        const { QuestionV2 } = await import('@canvas/data/models/Question.v2');
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

// Subject/group helpers now live in the client-safe `./subjects` module so
// client components (BrowseView, CrucibleWizard) can share them without pulling
// in this file's server-only `next/cache` dependency. Imported for internal use
// here AND re-exported so existing importers of these symbols from chapterCounts
// keep working.
import { capitalizeCategory, subjectForChapterId, groupForChapter, SUBJECT_PREFIXES, CRUCIBLE_ALL_SUBJECTS, type CrucibleSubject } from './subjects';
export { capitalizeCategory, subjectForChapterId, groupForChapter, CRUCIBLE_ALL_SUBJECTS, type CrucibleSubject };

// Shared shape returned to CrucibleWizard. Both routes must produce identical
// objects so the wizard sees the same counts no matter how the user arrived.
export interface ChapterWithCounts {
    id: string;
    name: string;
    class_level: number;
    display_order: number;
    category: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
    // Optional: buildChaptersWithCounts() always populates these; the planner's
    // catalog.server.ts produces ChapterWithCounts-shaped rows without them (it
    // computes its own subject/group), and the Crucible wizard reads them
    // defensively (`?? 'Chemistry'`).
    subject?: CrucibleSubject;       // Chemistry | Physics | Maths (id-derived)
    group?: string;                  // display bucket the Crucible list groups under
    question_count: number;          // JEE all
    star_question_count: number;     // JEE star
    neet_question_count: number;     // NEET all
    neet_star_question_count: number;// NEET star
}

// Build the chapters-with-counts array used by both /the-crucible/page.tsx and
// /the-crucible/[chapterId]/page.tsx. Centralised so the two pages can never
// drift out of agreement.
//
// `subjects` defaults to Chemistry-only — the historical, safe behaviour. The
// Crucible passes CRUCIBLE_ALL_SUBJECTS to opt into Physics/Maths; every other
// caller (e.g. the study planner) gets Chemistry without having to remember to
// filter, so a forgotten filter can never flood chemistry surfaces.
export async function buildChaptersWithCounts(
    opts?: { subjects?: CrucibleSubject[] }
): Promise<ChapterWithCounts[]> {
    const subjects = opts?.subjects ?? ['Chemistry'];
    const base = await chaptersBaseFromTaxonomy(subjects);

    const { jeeStarCounts, jeeAllCounts, neetStarCounts, neetAllCounts } = await getExamBoardChapterCounts();

    const jeeStarMap  = new Map(jeeStarCounts.map( (item: { _id: string; count: number }) => [item._id, item.count]));
    const jeeCountMap = new Map(jeeAllCounts.map(  (item: { _id: string; count: number }) => [item._id, item.count]));
    const neetStarMap  = new Map(neetStarCounts.map((item: { _id: string; count: number }) => [item._id, item.count]));
    const neetCountMap = new Map(neetAllCounts.map( (item: { _id: string; count: number }) => [item._id, item.count]));

    return base.map((ch) => ({
        ...ch,
        question_count: jeeCountMap.get(ch.id) ?? 0,
        star_question_count: jeeStarMap.get(ch.id) ?? 0,
        neet_question_count: neetCountMap.get(ch.id) ?? 0,
        neet_star_question_count: neetStarMap.get(ch.id) ?? 0,
    }));
}

// Chapters straight from the static taxonomy with ZERO counts — no DB. Used by
// buildChaptersWithCounts (which overlays counts) AND by the route pages' DB-down
// fallback, so a Mongo blip degrades to "real chapter, no counts" instead of a
// 404. `subjects` defaults to Chemistry-only to match buildChaptersWithCounts.
export async function chaptersBaseFromTaxonomy(
    subjects: CrucibleSubject[] = ['Chemistry']
): Promise<ChapterWithCounts[]> {
    const allowedPrefixes = subjects.flatMap((s) => SUBJECT_PREFIXES[s]);
    const { TAXONOMY_FROM_CSV } = await import('@canvas/data/taxonomy/taxonomyData_from_csv');
    return TAXONOMY_FROM_CSV
        .filter((node) => node.type === 'chapter' && node.id !== 'ch_unsorted' &&
            allowedPrefixes.some((p) => node.id.startsWith(p)))
        .map((node) => {
            const class_level = node.class_level ?? 11;
            return {
                id: node.id,
                name: node.name,
                class_level,
                display_order: node.sequence_order ?? 0,
                category: capitalizeCategory(node.chapterType),
                subject: subjectForChapterId(node.id),
                group: groupForChapter(node.id, node.chapterType, class_level),
                question_count: 0,
                star_question_count: 0,
                neet_question_count: 0,
                neet_star_question_count: 0,
            };
        });
}
