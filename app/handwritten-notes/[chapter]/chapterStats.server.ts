// Server-only helper for the chapter page redesign. Pulls a handful of
// counts and a sample demo question out of questions_v2 so the hero,
// Crucible rail, and topic TOC can be server-rendered with real data.
//
// Every function defends against MongoDB being unreachable at build time —
// the chapter page must always render, so any DB failure falls back to a
// zero-state result.
import 'server-only';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import { QuestionV2 } from '@/lib/models/Question.v2';

// What the chapter hero + rail need server-side.
export interface ChapterCrucibleStats {
    totalPublished: number;   // total chapter questions (drives "247 questions" headline)
    pyqCount: number;         // questions where sourceType === 'PYQ'
    demoCount: number;        // questions flagged is_demo_question (≤ 25)
    sampleDemos: SampleDemoQuestion[];  // top-N curated demos for the rail carousel
}

export interface SampleDemoQuestion {
    display_id: string;
    type: string;
    questionMarkdown: string;
    options: Array<{ id: string; text: string; is_correct: boolean }>;
    examLabel: string | null;   // e.g. "JEE Main 2024"
    primaryTagName: string | null;
}

// Per-topic counts for the "What's inside · N topics" TOC. Keyed by tag_id.
export type TopicQuestionCounts = Record<string, { total: number; pyq: number }>;

// Empty fallback — used if there's no crucibleChapterId or Mongo is down.
const EMPTY_STATS: ChapterCrucibleStats = {
    totalPublished: 0,
    pyqCount: 0,
    demoCount: 0,
    sampleDemos: [],
};

// How many demo questions to fetch for the rail carousel. Mirrors the count
// of hardcoded SAMPLE_QUESTIONS on the Crucible landing's QuestionCard.
const CAROUSEL_SIZE = 4;
// Wider candidate pool. We over-fetch then pick CAROUSEL_SIZE questions that
// have similar approximate rendered heights — keeps the cycling card visually
// uniform, so shorter questions don't leave empty space at the bottom of the
// fixed-height container.
const CAROUSEL_CANDIDATE_POOL = 12;

// Returns the headline counts plus one sample demo question. Picks the
// highest-scored demo question for the sample (Top PYQ first, then most
// recent PYQ year, then anything).
export async function getChapterCrucibleStats(chapterId: string): Promise<ChapterCrucibleStats> {
    if (!chapterId) return EMPTY_STATS;
    try {
        await connectToDatabase();
        const Q = QuestionV2 as unknown as mongoose.Model<unknown>;

        const baseFilter = {
            'metadata.chapter_id': chapterId,
            status: 'published',
            deleted_at: null,
        };

        const [totalPublished, pyqCount, demoCount, sampleDocs] = await Promise.all([
            Q.countDocuments(baseFilter).lean().exec(),
            Q.countDocuments({ ...baseFilter, 'metadata.sourceType': 'PYQ' }).lean().exec(),
            Q.countDocuments({ ...baseFilter, 'metadata.is_demo_question': true }).lean().exec(),
            // Top CAROUSEL_CANDIDATE_POOL demo questions, sorted by:
            //   is_top_pyq desc, examDetails.year desc, display_id asc.
            // We over-fetch and then pick CAROUSEL_SIZE with similar heights
            // below (see pickSimilarHeights). Field projection limits payload.
            Q.find(
                { ...baseFilter, 'metadata.is_demo_question': true },
                {
                    display_id: 1,
                    type: 1,
                    options: 1,
                    'question_text.markdown': 1,
                    'metadata.is_top_pyq': 1,
                    'metadata.sourceType': 1,
                    'metadata.examDetails': 1,
                    'metadata.exam_source': 1,
                }
            )
                .sort({
                    'metadata.is_top_pyq': -1,
                    'metadata.examDetails.year': -1,
                    display_id: 1,
                })
                .limit(CAROUSEL_CANDIDATE_POOL)
                .lean()
                .exec() as unknown as Array<Record<string, unknown>>,
        ]);

        // Narrow the over-fetched pool to CAROUSEL_SIZE questions with the most
        // similar approximate rendered heights — keeps the cycling card visually
        // uniform so the eye doesn't track an empty-space-at-the-bottom gap as
        // questions cycle.
        const winners = pickSimilarHeights(sampleDocs ?? [], CAROUSEL_SIZE);

        const sampleDemos: SampleDemoQuestion[] = winners.map((doc) => {
            const meta = (doc.metadata ?? {}) as {
                examDetails?: { exam?: string; year?: number };
                exam_source?: { exam?: string; year?: number };
            };
            const exam = meta.examDetails?.exam ?? meta.exam_source?.exam ?? null;
            const year = meta.examDetails?.year ?? meta.exam_source?.year ?? null;
            const examLabel = exam && year ? formatExam(exam, year) : null;

            return {
                display_id: String(doc.display_id),
                type: String(doc.type),
                questionMarkdown: String(
                    (doc.question_text as { markdown?: string })?.markdown ?? ''
                ),
                options: Array.isArray(doc.options)
                    ? (doc.options as Array<Record<string, unknown>>).map((o) => ({
                          id: String(o.id ?? ''),
                          text: String(o.text ?? ''),
                          is_correct: o.is_correct === true,
                      }))
                    : [],
                examLabel,
                primaryTagName: null,
            };
        });

        return { totalPublished, pyqCount, demoCount, sampleDemos };
    } catch (err) {
        console.warn(`[chapterStats] falling back to empty stats for ${chapterId}:`, err);
        return EMPTY_STATS;
    }
}

// Aggregates question counts per primary tag for the TOC. Returns a map
// keyed by tag_id (e.g. 'tag_mole_3') with { total, pyq } counts.
export async function getTopicQuestionCounts(chapterId: string): Promise<TopicQuestionCounts> {
    if (!chapterId) return {};
    try {
        await connectToDatabase();
        const Q = QuestionV2 as unknown as mongoose.Model<unknown>;

        // Aggregate by primary tag (tags[0]). Two counts per tag: total + PYQ.
        const pipeline = [
            {
                $match: {
                    'metadata.chapter_id': chapterId,
                    status: 'published',
                    deleted_at: null,
                    'metadata.tags.0.tag_id': { $exists: true },
                },
            },
            { $project: { primary: { $arrayElemAt: ['$metadata.tags.tag_id', 0] }, sourceType: '$metadata.sourceType' } },
            {
                $group: {
                    _id: '$primary',
                    total: { $sum: 1 },
                    pyq: {
                        $sum: { $cond: [{ $eq: ['$sourceType', 'PYQ'] }, 1, 0] },
                    },
                },
            },
        ];

        const rows = await Q.aggregate(pipeline).exec() as unknown as Array<{ _id: string; total: number; pyq: number }>;
        const out: TopicQuestionCounts = {};
        for (const r of rows) out[r._id] = { total: r.total, pyq: r.pyq };
        return out;
    } catch (err) {
        console.warn(`[chapterStats] topic counts failed for ${chapterId}:`, err);
        return {};
    }
}

// Approximate rendered height (in arbitrary "units") for a question doc, so
// we can compare relative sizes. Captures the three main height contributors:
//   1. Question body length (after the carousel's 220-char truncation cap)
//   2. Number of options (each renders ~40px tall)
//   3. Total length of option text (multi-line wraps add 16-18px each)
// Calibration is rough but consistent — only relative comparison matters.
function approxHeight(doc: Record<string, unknown>): number {
    const body = ((doc.question_text as { markdown?: string })?.markdown ?? '');
    const truncatedBodyLen = Math.min(body.length, 220);
    const options = Array.isArray(doc.options) ? doc.options : [];
    const optChars = options.reduce(
        (s, o) => s + String((o as { text?: string })?.text ?? '').length,
        0
    );
    // Coefficients: body ≈ 1 unit per 6 chars, opt ≈ 1 unit per 4 chars,
    // each option ≈ 12 units base.
    return Math.round(truncatedBodyLen / 6 + optChars / 4 + options.length * 12);
}

// From the over-fetched candidate pool, pick `size` questions whose heights
// cluster most tightly together. Strategy:
//   1. Annotate each candidate with its approxHeight and its original quality
//      rank (position in the input array, which was already sorted by Mongo).
//   2. Sort by height, look for the contiguous window of `size` candidates
//      with the smallest height variance (= most uniform-looking carousel).
//   3. Return those `size` candidates re-sorted by their original quality
//      rank so the cycling sequence still leads with the best questions.
//
// If `size` >= pool.length we just return the pool as-is.
function pickSimilarHeights<T extends Record<string, unknown>>(
    pool: T[],
    size: number
): T[] {
    if (pool.length <= size) return pool;

    const annotated = pool.map((doc, rank) => ({ doc, rank, h: approxHeight(doc) }));
    const byHeight = [...annotated].sort((a, b) => a.h - b.h);

    let bestStart = 0;
    let bestSpread = Infinity;
    for (let i = 0; i + size <= byHeight.length; i++) {
        const spread = byHeight[i + size - 1].h - byHeight[i].h;
        if (spread < bestSpread) {
            bestSpread = spread;
            bestStart = i;
        }
    }

    const window = byHeight.slice(bestStart, bestStart + size);
    // Restore the original quality-sort order within the picked window.
    window.sort((a, b) => a.rank - b.rank);
    return window.map((w) => w.doc);
}

// Mirrors the canonical formatter in app/the-crucible/components/examLabel.ts,
// trimmed to the shape we actually need for the sample-question badge.
function formatExam(exam: string, year: number): string {
    const normalised = exam
        .replace(/^JEE[_\s]*Main$/i, 'JEE Main')
        .replace(/^JEE[_\s]*Adv(?:anced)?$/i, 'JEE Adv')
        .replace(/^NEET[_\s]*UG$/i, 'NEET')
        .replace(/^NEET[_\s]*PG$/i, 'NEET PG')
        .replace(/_/g, ' ');
    return `${normalised} ${year}`;
}
