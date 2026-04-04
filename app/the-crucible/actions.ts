'use server';

import { Question as QuestionPageType, TaxonomyNode, Chapter } from './components/types';
import connectToDatabase from '@/lib/mongodb';
import { Chapter as ChapterModel } from '@/lib/models/Chapter';

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
    is_pyq?: boolean;
    is_top_pyq?: boolean;
    exam_source?: Record<string, unknown>;
    examBoard?: string;
    sourceType?: string;
    examDetails?: Record<string, unknown>;
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
    const { QuestionV2 } = await import('@/lib/models/Question.v2');

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
      id: toString(doc._id),
      display_id: doc.display_id || toString(doc._id)?.slice(0, 8)?.toUpperCase() || 'Q',
      question_text: { markdown: doc.question_text?.markdown || '' },
      type: doc.type,
      options: doc.options || [],
      answer: doc.answer || {},
      solution: {
        text_markdown: doc.solution?.text_markdown || '',
        video_url: doc.solution?.video_url || undefined,
        asset_ids: doc.solution?.asset_ids || undefined,
        latex_validated: doc.solution?.latex_validated || false,
      },
      metadata: {
        difficultyLevel: doc.metadata?.difficultyLevel || 3,
        chapter_id: doc.metadata?.chapter_id || '',
        subject: doc.metadata?.subject || 'chemistry',
        tags: doc.metadata?.tags || [],
        is_pyq: doc.metadata?.is_pyq || false,
        is_top_pyq: doc.metadata?.is_top_pyq || false,
        exam_source: doc.metadata?.exam_source,
      },
      svg_scales: doc.svg_scales || {},
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
    const { QuestionV2 } = await import('@/lib/models/Question.v2');

    const allInChapter = await QuestionV2.find(
      { 'metadata.chapter_id': chapterId, deleted_at: null, status: 'published' },
      { _id: 1, display_id: 1 }
    )
      .sort({ display_id: 1 })
      .lean();

    const idx = allInChapter.findIndex((q: AdjacentQuestionRef) => q.display_id === currentDisplayId);
    if (idx === -1) return { prev: null, next: null };

    const prevDoc = allInChapter[idx - 1] as AdjacentQuestionRef | undefined;
    const nextDoc = allInChapter[idx + 1] as AdjacentQuestionRef | undefined;

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
    const { QuestionV2 } = await import('@/lib/models/Question.v2');

    const docs = await QuestionV2.find(
      { 'metadata.chapter_id': chapterId, deleted_at: null, status: 'published', _id: { $ne: excludeId } },
      { _id: 1, display_id: 1, 'question_text.markdown': 1, 'metadata.difficultyLevel': 1, 'metadata.exam_source': 1 }
    )
      .sort({ 'metadata.is_top_pyq': -1, display_id: 1 })
      .limit(limit)
      .lean();

    return docs.map((d: MongoQuestionDoc): RelatedQuestion => ({
      id: toString(d._id),
      display_id: d.display_id,
      question_text: d.question_text?.markdown || '',
      metadata: {
        difficultyLevel: d.metadata?.difficultyLevel || 3,
        exam_source: d.metadata?.exam_source,
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
    const { QuestionV2 } = await import('@/lib/models/Question.v2');

    const docs = await QuestionV2.find(
      { deleted_at: null, status: 'published', 'metadata.is_pyq': true },
      { _id: 1, display_id: 1, updated_at: 1 }
    )
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

// Category mapping by chapter name keywords (derived from taxonomyData_from_csv.ts)
// Maps lowercase name fragments → category
const CATEGORY_MAP: Array<{ keywords: string[]; category: Chapter['category'] }> = [
    { keywords: ['mole', 'basic concept', 'structure of atom', 'classification', 'periodicity', 'chemical bonding', 'thermodynamic', 'equilibrium', 'ionic equilibrium', 'electrochemistry', 'kinetics', 'solutions', 'solid state', 'surface chemistry', 'states of matter', 'hydrogen', 's-block', 'gaseous'], category: 'Physical' },
    { keywords: ['redox', 'p-block', 'p block', 'd-block', 'd block', 'f-block', 'f block', 'coordination', 'metallurgy', 'isolation', 'qualitative analysis', 'salt analysis', 'inorganic'], category: 'Inorganic' },
    { keywords: ['organic chemistry', 'goc', 'hydrocarbons', 'haloalkane', 'haloarene', 'alcohol', 'phenol', 'ether', 'aldehyde', 'ketone', 'carboxylic', 'amine', 'biomolecule', 'polymer', 'everyday life', 'aromatic', 'stereochem', 'environmental'], category: 'Organic' },
    { keywords: ['practical', 'qualitative', 'salt analysis'], category: 'Practical' },
];

function deriveCategory(name: string): Chapter['category'] {
    const lower = name.toLowerCase();
    for (const entry of CATEGORY_MAP) {
        if (entry.keywords.some(kw => lower.includes(kw))) {
            return entry.category;
        }
    }
    return 'Physical';
}

// V2 System: Return empty questions array since we're starting fresh
export async function getQuestions(): Promise<QuestionPageType[]> {
    // questions_v2 collection is empty - fresh start, no old data migrated
    return [];
}

export async function saveQuestion(updatedQuestion: QuestionPageType): Promise<{ success: boolean; message: string }> {
    // V2 System: Use /crucible/admin with V2 API
    return { success: false, message: 'Please use the new admin panel at /crucible/admin' };
}

export async function deleteQuestion(questionId: string): Promise<{ success: boolean; message: string }> {
    // V2 System: Use /crucible/admin
    return { success: false, message: 'Please use the new admin panel at /crucible/admin' };
}

// --- Taxonomy Actions (V2) ---

export async function getTaxonomy(): Promise<Chapter[]> {
    // Always use MOCK_CHAPTERS as the canonical chapter list.
    // These IDs (ch11_atom, ch11_mole, etc.) match the metadata.chapter_id
    // values stored in every QuestionV2 document, so question counts work correctly.
    return MOCK_CHAPTERS;
}

// Mock chapters for fallback when MongoDB is not connected
// Following the real taxonomy from taxonomyData_from_csv.ts
// SINGLE SOURCE OF TRUTH: IDs here MUST exactly match taxonomyData_from_csv.ts chapter IDs
// and metadata.chapter_id values stored in MongoDB questions_v2 collection.
// DO NOT add chapters here that are not in taxonomyData_from_csv.ts.
const MOCK_CHAPTERS: Chapter[] = [
    // Unsorted
    { id: 'ch_unsorted', name: 'Unsorted Questions', class_level: 11, display_order: 0, category: 'Physical' },
    // Class 11 — 12 chapters
    { id: 'ch11_mole', name: 'Some Basic Concepts of Chemistry (Mole Concept)', class_level: 11, display_order: 1, category: 'Physical' },
    { id: 'ch11_atom', name: 'Structure of Atom', class_level: 11, display_order: 2, category: 'Physical' },
    { id: 'ch11_periodic', name: 'Classification of Elements and Periodicity', class_level: 11, display_order: 3, category: 'Physical' },
    { id: 'ch11_bonding', name: 'Chemical Bonding', class_level: 11, display_order: 4, category: 'Physical' },
    { id: 'ch11_thermo', name: 'Thermodynamics', class_level: 11, display_order: 5, category: 'Physical' },
    { id: 'ch11_chem_eq', name: 'Chemical Equilibrium', class_level: 11, display_order: 6, category: 'Physical' },
    { id: 'ch11_ionic_eq', name: 'Ionic Equilibrium', class_level: 11, display_order: 7, category: 'Physical' },
    { id: 'ch11_redox', name: 'Redox Reactions', class_level: 11, display_order: 8, category: 'Inorganic' },
    { id: 'ch11_pblock', name: 'P Block (Class 11)', class_level: 11, display_order: 9, category: 'Inorganic' },
    { id: 'ch11_goc', name: 'GOC', class_level: 11, display_order: 10, category: 'Organic' },
    { id: 'ch11_hydrocarbon', name: 'Hydrocarbons', class_level: 11, display_order: 11, category: 'Organic' },
    { id: 'ch11_prac_org', name: 'Practical Organic Chemistry', class_level: 11, display_order: 12, category: 'Practical' },
    // Class 12 — 13 chapters (ch12_aromatic removed, ch12_aldehydes + ch12_carboxylic merged into ch12_carbonyl)
    { id: 'ch12_solutions', name: 'Solutions', class_level: 12, display_order: 14, category: 'Physical' },
    { id: 'ch12_electrochem', name: 'Electrochemistry', class_level: 12, display_order: 15, category: 'Physical' },
    { id: 'ch12_kinetics', name: 'Chemical Kinetics', class_level: 12, display_order: 16, category: 'Physical' },
    { id: 'ch12_pblock', name: 'P Block (12th)', class_level: 12, display_order: 17, category: 'Inorganic' },
    { id: 'ch12_dblock', name: 'D & F Block', class_level: 12, display_order: 18, category: 'Inorganic' },
    { id: 'ch12_coord', name: 'Coordination Compounds', class_level: 12, display_order: 19, category: 'Inorganic' },
    { id: 'ch12_haloalkanes', name: 'Haloalkanes & Haloarenes', class_level: 12, display_order: 20, category: 'Organic' },
    { id: 'ch12_alcohols', name: 'Alcohols, Phenols & Ethers', class_level: 12, display_order: 21, category: 'Organic' },
    { id: 'ch12_carbonyl', name: 'Aldehydes, Ketones and Carboxylic Acids', class_level: 12, display_order: 22, category: 'Organic' },
    { id: 'ch12_amines', name: 'Amines', class_level: 12, display_order: 23, category: 'Organic' },
    { id: 'ch12_biomolecules', name: 'Biomolecules', class_level: 12, display_order: 24, category: 'Organic' },
    { id: 'ch12_salt', name: 'Salt Analysis', class_level: 12, display_order: 25, category: 'Practical' },
    { id: 'ch12_prac_phys', name: 'Practical Physical Chemistry', class_level: 12, display_order: 26, category: 'Practical' },
];

export async function saveTaxonomyNode(node: TaxonomyNode): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'Use admin panel for chapter management' };
}

export async function deleteTaxonomyNode(nodeId: string): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'Use admin panel for chapter management' };
}

export async function getChapterQuestionCounts(): Promise<Record<string, number>> {
    try {
        await connectToDatabase();
        const { QuestionV2 } = await import('@/lib/models/Question.v2');
        const agg = await QuestionV2.aggregate([
            { $match: { deleted_at: null } },
            { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
        ]);
        const result: Record<string, number> = {};
        for (const row of agg) {
            if (row._id) result[row._id] = row.count;
        }
        return result;
    } catch (error) {
        console.error('Failed to get chapter question counts:', error);
        return {};
    }
}

export async function getChapterStarCounts(): Promise<Record<string, number>> {
    try {
        await connectToDatabase();
        const { QuestionV2 } = await import('@/lib/models/Question.v2');
        const agg = await QuestionV2.aggregate([
            { $match: { 'metadata.is_top_pyq': true, deleted_at: null } },
            { $group: { _id: '$metadata.chapter_id', count: { $sum: 1 } } },
        ]);
        const result: Record<string, number> = {};
        for (const row of agg) {
            if (row._id) result[row._id] = row.count;
        }
        return result;
    } catch (error) {
        console.error('Failed to get chapter star counts:', error);
        return {};
    }
}

export async function syncSupabaseToMongo(): Promise<{ success: boolean; message: string; count?: number }> {
    // V2: No sync needed - fresh database
    return { success: true, message: 'V2 System: No sync required', count: 0 };
}

// Fetch all published questions for a single chapter (used by per-chapter pages)
// Pass examBoard to scope results to JEE or NEET only. Omit for unfiltered (legacy).
export async function getChapterQuestions(chapterId: string, examBoard?: 'JEE' | 'NEET'): Promise<QuestionPageType[]> {
    try {
        await connectToDatabase();
        const { QuestionV2 } = await import('@/lib/models/Question.v2');
        const filter: Record<string, unknown> = {
            'metadata.chapter_id': chapterId,
            deleted_at: null,
        };
        if (examBoard) filter['metadata.examBoard'] = examBoard;
        const docs = await QuestionV2.find(filter)
            .sort({ display_id: 1 })
            .lean();

        return docs.map((q: MongoQuestionDoc): QuestionPageType => ({
            id: toString(q._id),
            display_id: q.display_id || toString(q._id)?.slice(0, 8)?.toUpperCase() || 'Q',
            question_text: { markdown: q.question_text?.markdown || '' },
            type: q.type as QuestionPageType['type'],
            options: q.options || [],
            answer: q.answer,
            solution: {
                text_markdown: q.solution?.markdown || q.solution?.text_markdown || '',
                video_url: q.solution?.video_url || undefined,
                asset_ids: q.solution?.asset_ids as Record<string, string[]> | undefined,
                latex_validated: q.solution?.latex_validated || false,
            },
            metadata: {
                difficultyLevel: (q.metadata?.difficultyLevel || 3) as 1 | 2 | 3 | 4 | 5,
                chapter_id: q.metadata?.chapter_id || '',
                subject: (q.metadata?.subject || 'chemistry') as 'chemistry' | 'physics' | 'maths' | 'biology',
                tags: q.metadata?.tags || [],
                is_pyq: q.metadata?.is_pyq || false,
                is_top_pyq: q.metadata?.is_top_pyq || false,
                exam_source: q.metadata?.exam_source as Record<string, unknown> | undefined,
                // New exam taxonomy fields — needed for correct filtering in BrowseView
                examBoard: q.metadata?.examBoard as 'JEE' | 'NEET' | undefined,
                sourceType: q.metadata?.sourceType as 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock' | undefined,
                examDetails: q.metadata?.examDetails as Record<string, unknown> | undefined,
            },
            svg_scales: q.svg_scales || {},
        }));
    } catch (error) {
        console.error('Failed to get chapter questions:', error);
        return [];
    }
}
