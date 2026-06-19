'use server';

import { unstable_cache } from 'next/cache';
import { Question as QuestionPageType, Chapter } from '../components/types';
import connectToDatabase from '@canvas/data/db/mongodb';
import { TAXONOMY_FROM_CSV } from '@canvas/data/taxonomy/taxonomyData_from_csv';

// MongoDB document types (lean queries return plain objects)
interface MongoQuestionDoc {
  _id: string;
  display_id: string;
  question_text?: { markdown?: string };
  type: string;
  options?: Array<{ id: string; text: string; is_correct: boolean }>;
  answer?: Record<string, unknown>;
  solution?: {
    markdown?: string;
    text_markdown?: string;
    video_url?: string;
    asset_ids?: unknown;
    latex_validated?: boolean;
  };
  metadata?: {
    difficultyLevel?: number;
    chapter_id?: string;
    subject?: string;
    tags?: Array<{ tag_id: string; weight: number }>;
    is_pyq?: boolean;            // LEGACY — bridged via sourceType==='PYQ'
    is_top_pyq?: boolean;        // KEEP — drives "Top Questions" feature
    exam_source?: Record<string, unknown>;  // LEGACY — bridged via examDetails
    examBoard?: string;          // LEGACY — bridged via applicableExams[0]
    sourceType?: string;
    examDetails?: Record<string, unknown>;
    applicableExams?: string[];  // canonical replacement for examBoard
  };
  svg_scales?: Record<string, number>;
  updated_at?: Date;
  created_at?: Date;
  status?: string;
}

interface AdjacentQuestionRef {
  _id: string;
  display_id: string;
}

// Full question shape returned by question detail page (superset of QuestionPageType)
export interface QuestionDetail extends QuestionPageType {
  updated_at: string;
  created_at: string;
  status: string;
}

// Lookup a question by either its UUID (_id) or display_id.
// Returns { question, redirectTo } where redirectTo is set when slug is a display_id
// so the caller can issue a permanent redirect to the canonical UUID URL.
export async function getQuestionBySlug(
  slug: string
): Promise<{ question: QuestionDetail; redirectTo: string | null } | null> {
  try {
    await connectToDatabase();
    const { QuestionV2 } = await import('@canvas/data/models/Question.v2');

    // UUID pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

    let doc: MongoQuestionDoc | null = null;
    let redirectTo: string | null = null;

    if (isUUID) {
      doc = await QuestionV2.findOne({ _id: slug, deleted_at: null }).lean();
    } else {
      // Treat as display_id — find and redirect to canonical UUID URL
      doc = await QuestionV2.findOne({
        display_id: { $regex: new RegExp(`^${slug}$`, 'i') },
        deleted_at: null,
      }).lean();
      if (doc) {
        redirectTo = `/the-crucible/q/${toString(doc._id)}`;
      }
    }

    if (!doc) return null;

    const question: QuestionDetail = {
      ...mapDocToQuestion(doc),
      updated_at: doc.updated_at?.toISOString?.() || new Date().toISOString(),
      created_at: doc.created_at?.toISOString?.() || new Date().toISOString(),
      status: doc.status || 'published',
    };

    return { question, redirectTo };
  } catch (error) {
    console.error('getQuestionBySlug failed:', error);
    return null;
  }
}

// Fetch prev / next question within the same chapter (sorted by display_id).
export async function getAdjacentQuestions(
  chapterId: string,
  currentDisplayId: string
): Promise<{ prev: { id: string; display_id: string } | null; next: { id: string; display_id: string } | null }> {
  try {
    await connectToDatabase();
    const { QuestionV2 } = await import('@canvas/data/models/Question.v2');

    // Two indexed range queries — O(log n) each — instead of loading the whole chapter.
    const base = { 'metadata.chapter_id': chapterId, deleted_at: null, status: 'published' };
    const [prevDoc, nextDoc] = await Promise.all([
      QuestionV2.findOne({ ...base, display_id: { $lt: currentDisplayId } }, { _id: 1, display_id: 1 })
        .sort({ display_id: -1 })
        .lean<AdjacentQuestionRef>(),
      QuestionV2.findOne({ ...base, display_id: { $gt: currentDisplayId } }, { _id: 1, display_id: 1 })
        .sort({ display_id: 1 })
        .lean<AdjacentQuestionRef>(),
    ]);

    return {
      prev: prevDoc ? { id: toString(prevDoc._id), display_id: prevDoc.display_id } : null,
      next: nextDoc ? { id: toString(nextDoc._id), display_id: nextDoc.display_id } : null,
    };
  } catch {
    return { prev: null, next: null };
  }
}

// Fetch a small set of related questions (same chapter, excluding current).
interface RelatedQuestion {
  id: string;
  display_id: string;
  question_text: string;
  metadata: {
    difficultyLevel: number;
    exam_source?: Record<string, unknown>;
  };
}

export async function getRelatedCrucibleQuestions(
  chapterId: string,
  excludeId: string,
  limit = 5
): Promise<RelatedQuestion[]> {
  try {
    await connectToDatabase();
    const { QuestionV2 } = await import('@canvas/data/models/Question.v2');

    const docs = await QuestionV2.find(
      { 'metadata.chapter_id': chapterId, deleted_at: null, status: 'published', _id: { $ne: excludeId } },
      // Project both modern (examDetails) and legacy (exam_source) so the
      // bridge below works during the transition. Once legacy field is dropped,
      // exam_source from the projection can be removed.
      { _id: 1, display_id: 1, 'question_text.markdown': 1, 'metadata.difficultyLevel': 1, 'metadata.examDetails': 1, 'metadata.exam_source': 1 }
    )
      // KEEP is_top_pyq sort — drives "Top Questions" feature ordering.
      .sort({ 'metadata.is_top_pyq': -1, display_id: 1 })
      .limit(limit)
      .lean();

    return docs.map((d: MongoQuestionDoc): RelatedQuestion => ({
      id: toString(d._id),
      display_id: d.display_id,
      question_text: d.question_text?.markdown || '',
      metadata: {
        difficultyLevel: d.metadata?.difficultyLevel || 3,
        // Bridge: modern examDetails first, fall back to legacy exam_source.
        exam_source: d.metadata?.examDetails || d.metadata?.exam_source,
      },
    }));
  } catch {
    return [];
  }
}

// Fetch all published PYQ IDs+display_ids for generateStaticParams (UUID only).
export async function getAllPublishedPYQSlugs(): Promise<Array<{ id: string; display_id: string; updated_at: string }>> {
  try {
    await connectToDatabase();
    const { QuestionV2 } = await import('@canvas/data/models/Question.v2');

    // PYQ filter migrated from legacy `is_pyq: true` to canonical `sourceType: 'PYQ'`.
    // The two fields are kept in sync today (only ~2 known drift cases out of 4,750+).
    const docs = await QuestionV2.find(
      { deleted_at: null, status: 'published', 'metadata.sourceType': 'PYQ' },
      { _id: 1, display_id: 1, updated_at: 1 }
    )
      .limit(50000) // bound the load so sitemap regen can't blow up Fluid CPU/Mem as the bank grows (vercel-cost #20a)
      .lean();

    return docs.map((d: MongoQuestionDoc) => ({
      id: toString(d._id),
      display_id: d.display_id || '',
      updated_at: d.updated_at?.toISOString?.() || new Date().toISOString(),
    }));
  } catch {
    return [];
  }
}

// Helper to safely convert ObjectId to string
const toString = (val: unknown): string => {
  if (val && typeof val === 'object' && 'toString' in val && typeof val.toString === 'function') {
    return val.toString();
  }
  return String(val);
};

// Maps a raw MongoDB document to the QuestionPageType the UI expects.
// Centralises legacy-field bridges (exam_source→examDetails, is_pyq→sourceType,
// examBoard→applicableExams[0]) so Phase 4 cleanup is a one-line change here,
// not a hunt across multiple query functions.
function mapDocToQuestion(doc: MongoQuestionDoc): QuestionPageType {
  return {
    id: toString(doc._id),
    display_id: doc.display_id || toString(doc._id)?.slice(0, 8)?.toUpperCase() || 'Q',
    question_text: { markdown: doc.question_text?.markdown || '' },
    type: (doc.type as QuestionPageType['type']) || 'SCQ',
    options: doc.options || [],
    answer: doc.answer || {},
    solution: {
      // .markdown is a legacy field name; .text_markdown is canonical.
      text_markdown: doc.solution?.markdown || doc.solution?.text_markdown || '',
      video_url: doc.solution?.video_url || undefined,
      asset_ids: doc.solution?.asset_ids as Record<string, string[]> | undefined,
      latex_validated: doc.solution?.latex_validated || false,
    },
    metadata: {
      difficultyLevel: (doc.metadata?.difficultyLevel || 3) as 1 | 2 | 3 | 4 | 5,
      chapter_id: doc.metadata?.chapter_id || '',
      subject: (doc.metadata?.subject || 'chemistry') as 'chemistry' | 'physics' | 'maths' | 'biology',
      tags: doc.metadata?.tags || [],
      // Modern field is the source of truth; legacy fallbacks dropped in Phase 4.
      is_pyq: doc.metadata?.sourceType === 'PYQ' || doc.metadata?.is_pyq || false,
      is_top_pyq: doc.metadata?.is_top_pyq || false,
      exam_source: (doc.metadata?.examDetails || doc.metadata?.exam_source) as Record<string, unknown> | undefined,
      examBoard: (doc.metadata?.applicableExams?.[0] || doc.metadata?.examBoard) as 'JEE' | 'NEET' | undefined,
      sourceType: doc.metadata?.sourceType as 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock' | undefined,
      examDetails: doc.metadata?.examDetails as Record<string, unknown> | undefined,
    },
    svg_scales: doc.svg_scales || {},
  };
}

// --- Taxonomy Actions (V2) ---

// Chemistry chapterTypes in the taxonomy. Physics, math, and biology chapters
// are excluded — the Crucible student UI shows chemistry only.
const CHEM_CHAPTER_TYPES = new Set(['physical', 'inorganic', 'organic', 'practical']);

const CHAPTER_TYPE_TO_CATEGORY: Record<string, Chapter['category']> = {
    physical: 'Physical',
    inorganic: 'Inorganic',
    organic: 'Organic',
    practical: 'Practical',
};

// Derive the chapter list from the taxonomy single source of truth instead of
// maintaining a parallel hardcoded array. Adding a chemistry chapter to
// taxonomyData_from_csv.ts automatically surfaces it here.
export async function getTaxonomy(): Promise<Chapter[]> {
    return TAXONOMY_FROM_CSV
        .filter(n => n.type === 'chapter' && (n.class_level ?? 0) >= 11 && CHEM_CHAPTER_TYPES.has(n.chapterType ?? ''))
        .map(n => ({
            id: n.id,
            name: n.name,
            class_level: n.class_level!,
            display_order: n.sequence_order ?? 0,
            category: CHAPTER_TYPE_TO_CATEGORY[n.chapterType ?? ''] ?? 'Physical',
        }));
}

// Aggregations over questions_v2 are expensive and the result only changes when
// questions are added/edited/deleted. Cache for 1 hour — staleness is acceptable
// because chapter totals are informational, not transactional.
const _getChapterQuestionCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        await connectToDatabase();
        const { QuestionV2 } = await import('@canvas/data/models/Question.v2');
        const agg = await QuestionV2.aggregate([
            { $match: { deleted_at: null } },
            { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
        ]);
        const result: Record<string, number> = {};
        for (const row of agg) if (row._id) result[row._id] = row.count;
        return result;
    },
    ['chapter-question-counts'],
    { revalidate: 3600, tags: ['questions'] }
);

const _getChapterStarCounts = unstable_cache(
    async (): Promise<Record<string, number>> => {
        await connectToDatabase();
        const { QuestionV2 } = await import('@canvas/data/models/Question.v2');
        const agg = await QuestionV2.aggregate([
            { $match: { 'metadata.is_top_pyq': true, deleted_at: null } },
            { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
        ]);
        const result: Record<string, number> = {};
        for (const row of agg) if (row._id) result[row._id] = row.count;
        return result;
    },
    ['chapter-star-counts'],
    { revalidate: 3600, tags: ['questions'] }
);

export async function getChapterQuestionCounts(): Promise<Record<string, number>> {
    try {
        return await _getChapterQuestionCounts();
    } catch (error) {
        console.error('Failed to get chapter question counts:', error);
        return {};
    }
}

export async function getChapterStarCounts(): Promise<Record<string, number>> {
    try {
        return await _getChapterStarCounts();
    } catch (error) {
        console.error('Failed to get chapter star counts:', error);
        return {};
    }
}

// Fetch all published questions for a single chapter (used by per-chapter pages)
// Pass examBoard to scope results to JEE or NEET only. Omit for unfiltered (legacy).
export async function getChapterQuestions(chapterId: string, examBoard?: 'JEE' | 'NEET'): Promise<QuestionPageType[]> {
    try {
        await connectToDatabase();
        const { QuestionV2 } = await import('@canvas/data/models/Question.v2');
        const filter: Record<string, unknown> = {
            'metadata.chapter_id': chapterId,
            deleted_at: null,
        };
        // Match against the multi-valued applicableExams array, not the single-valued
        // legacy examBoard field. A question tagged for both JEE and NEET should appear
        // when filtering by either exam — examBoard only stores the first one.
        if (examBoard) filter['metadata.applicableExams'] = examBoard;
        const docs = await QuestionV2.find(filter)
            .sort({ display_id: 1 })
            .lean();

        return docs.map((q: MongoQuestionDoc) => mapDocToQuestion(q));
    } catch (error) {
        console.error('Failed to get chapter questions:', error);
        return [];
    }
}
