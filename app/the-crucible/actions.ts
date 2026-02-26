'use server';

import { Question as QuestionPageType, TaxonomyNode, Chapter } from './components/types';
import connectToDatabase from '@/lib/mongodb';
import { Chapter as ChapterModel } from '@/lib/models/Chapter';

// Helper to safely convert ObjectId to string
const toString = (val: any) => (val && val.toString ? val.toString() : val);

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
    // Class 11 — 12 chapters
    { id: 'ch11_mole',        name: 'Some Basic Concepts of Chemistry (Mole Concept)', class_level: 11, display_order: 1,  category: 'Physical'  },
    { id: 'ch11_atom',        name: 'Structure of Atom',                               class_level: 11, display_order: 2,  category: 'Physical'  },
    { id: 'ch11_periodic',    name: 'Classification of Elements and Periodicity',      class_level: 11, display_order: 3,  category: 'Physical'  },
    { id: 'ch11_bonding',     name: 'Chemical Bonding',                                class_level: 11, display_order: 4,  category: 'Physical'  },
    { id: 'ch11_thermo',      name: 'Thermodynamics',                                  class_level: 11, display_order: 5,  category: 'Physical'  },
    { id: 'ch11_chem_eq',     name: 'Chemical Equilibrium',                            class_level: 11, display_order: 6,  category: 'Physical'  },
    { id: 'ch11_ionic_eq',    name: 'Ionic Equilibrium',                               class_level: 11, display_order: 7,  category: 'Physical'  },
    { id: 'ch11_redox',       name: 'Redox Reactions',                                 class_level: 11, display_order: 8,  category: 'Inorganic' },
    { id: 'ch11_pblock',      name: 'P Block (Class 11)',                              class_level: 11, display_order: 9,  category: 'Inorganic' },
    { id: 'ch11_goc',         name: 'GOC',                                             class_level: 11, display_order: 10, category: 'Organic'   },
    { id: 'ch11_hydrocarbon', name: 'Hydrocarbons',                                    class_level: 11, display_order: 11, category: 'Organic'   },
    { id: 'ch11_prac_org',    name: 'Practical Organic Chemistry',                     class_level: 11, display_order: 12, category: 'Practical' },
    // Class 12 — 13 chapters (ch12_aromatic removed, ch12_aldehydes + ch12_carboxylic merged into ch12_carbonyl)
    { id: 'ch12_solutions',   name: 'Solutions',                                       class_level: 12, display_order: 14, category: 'Physical'  },
    { id: 'ch12_electrochem', name: 'Electrochemistry',                                class_level: 12, display_order: 15, category: 'Physical'  },
    { id: 'ch12_kinetics',    name: 'Chemical Kinetics',                               class_level: 12, display_order: 16, category: 'Physical'  },
    { id: 'ch12_pblock',      name: 'P Block (12th)',                                  class_level: 12, display_order: 17, category: 'Inorganic' },
    { id: 'ch12_dblock',      name: 'D & F Block',                                    class_level: 12, display_order: 18, category: 'Inorganic' },
    { id: 'ch12_coord',       name: 'Coordination Compounds',                          class_level: 12, display_order: 19, category: 'Inorganic' },
    { id: 'ch12_haloalkanes', name: 'Haloalkanes & Haloarenes',                        class_level: 12, display_order: 20, category: 'Organic'   },
    { id: 'ch12_alcohols',    name: 'Alcohols, Phenols & Ethers',                      class_level: 12, display_order: 21, category: 'Organic'   },
    { id: 'ch12_carbonyl',    name: 'Aldehydes, Ketones and Carboxylic Acids',         class_level: 12, display_order: 22, category: 'Organic'   },
    { id: 'ch12_amines',      name: 'Amines',                                          class_level: 12, display_order: 23, category: 'Organic'   },
    { id: 'ch12_biomolecules',name: 'Biomolecules',                                    class_level: 12, display_order: 24, category: 'Organic'   },
    { id: 'ch12_salt',        name: 'Salt Analysis',                                   class_level: 12, display_order: 25, category: 'Practical' },
    { id: 'ch12_prac_phys',   name: 'Practical Physical Chemistry',                    class_level: 12, display_order: 26, category: 'Practical' },
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

export async function syncSupabaseToMongo(): Promise<{ success: boolean; message: string; count?: number }> {
    // V2: No sync needed - fresh database
    return { success: true, message: 'V2 System: No sync required', count: 0 };
}

// Fetch all published questions for a single chapter (used by per-chapter pages)
export async function getChapterQuestions(chapterId: string): Promise<QuestionPageType[]> {
    try {
        await connectToDatabase();
        const { QuestionV2 } = await import('@/lib/models/Question.v2');
        const docs = await QuestionV2.find({
            'metadata.chapter_id': chapterId,
            deleted_at: null,
        })
            .sort({ created_at: 1 })
            .lean();

        return docs.map((q: any) => ({
            id: toString(q._id),
            display_id: q.display_id || toString(q._id)?.slice(0, 8)?.toUpperCase() || 'Q',
            question_text: { markdown: q.question_text?.markdown || '' },
            type: q.type,
            options: q.options || [],
            answer: q.answer || {},
            solution: { text_markdown: q.solution?.markdown || q.solution?.text_markdown || '' },
            metadata: {
                difficulty: q.metadata?.difficulty || 'Medium',
                chapter_id: q.metadata?.chapter_id || '',
                tags: q.metadata?.tags || [],
                is_pyq: q.metadata?.is_pyq || false,
                is_top_pyq: q.metadata?.is_top_pyq || false,
                exam_source: q.metadata?.exam_source,
            },
            svg_scales: q.svg_scales || {},
        }));
    } catch (error) {
        console.error('Failed to get chapter questions:', error);
        return [];
    }
}
