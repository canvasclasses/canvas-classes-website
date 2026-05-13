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
    sampleDemo: SampleDemoQuestion | null;
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
    sampleDemo: null,
};

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

        const [totalPublished, pyqCount, demoCount, sampleDoc] = await Promise.all([
            Q.countDocuments(baseFilter).lean().exec(),
            Q.countDocuments({ ...baseFilter, 'metadata.sourceType': 'PYQ' }).lean().exec(),
            Q.countDocuments({ ...baseFilter, 'metadata.is_demo_question': true }).lean().exec(),
            // Sample: prefer demo + PYQ + recent year. Sort by:
            //   is_top_pyq desc, examDetails.year desc, display_id asc.
            // Limit fields — we only need question text, options, exam.
            Q.findOne(
                { ...baseFilter, 'metadata.is_demo_question': true },
                {
                    display_id: 1,
                    type: 1,
                    options: 1,
                    'question_text.markdown': 1,
                    'metadata.tags': 1,
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
                .lean()
                .exec() as unknown as Record<string, unknown> | null,
        ]);

        let sampleDemo: SampleDemoQuestion | null = null;
        if (sampleDoc) {
            const meta = (sampleDoc.metadata ?? {}) as {
                tags?: Array<{ tag_id?: string; weight?: number }>;
                examDetails?: { exam?: string; year?: number; month?: string; shift?: string };
                exam_source?: { exam?: string; year?: number };
            };
            const exam = meta.examDetails?.exam ?? meta.exam_source?.exam ?? null;
            const year = meta.examDetails?.year ?? meta.exam_source?.year ?? null;
            const examLabel = exam && year ? formatExam(exam, year) : null;

            sampleDemo = {
                display_id: String(sampleDoc.display_id),
                type: String(sampleDoc.type),
                questionMarkdown: String((sampleDoc.question_text as { markdown?: string })?.markdown ?? ''),
                options: Array.isArray(sampleDoc.options)
                    ? (sampleDoc.options as Array<Record<string, unknown>>).map((o) => ({
                          id: String(o.id ?? ''),
                          text: String(o.text ?? ''),
                          is_correct: o.is_correct === true,
                      }))
                    : [],
                examLabel,
                primaryTagName: null, // filled by caller if it has the taxonomy lookup
            };
        }

        return { totalPublished, pyqCount, demoCount, sampleDemo };
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
