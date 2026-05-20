/**
 * Admin-side types for the Crucible question bank.
 *
 * AdminQuestion is the full shape of a questions_v2 document as seen by the
 * admin UI. It is a superset of the student-facing QuestionPageType — the
 * admin needs fields (flags, version, quality_score, latex_validated per-field)
 * that the student view never uses.
 *
 * Other admin components (QuestionCardRenderer, ExportDashboard, …) should
 * import AdminQuestion from here instead of redefining a local slice.
 */

// ── Core document type ────────────────────────────────────────────────────────

export interface AdminQuestion {
  _id: string;
  display_id: string;
  question_text: {
    markdown: string;
    latex_validated: boolean;
  };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX';
  options: Array<{
    id: string;
    text: string;
    is_correct: boolean;
    asset_ids?: string[];
  }>;
  answer?: {
    integer_value?: number;
    decimal_value?: number;
    unit?: string;
  };
  solution: {
    text_markdown: string;
    latex_validated: boolean;
    video_url?: string;
    asset_ids?: {
      images?: string[];
      svg?: string[];
      audio?: string[];
    };
  };
  metadata: {
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    chapter_id: string;
    tags: Array<{ tag_id: string; weight: number }>;
    exam_source?: {
      exam: string;
      year?: number;
      month?: string;
      day?: number;
      shift?: string;
    };
    /** LEGACY — Phase 2 stopped writing this; bridge in actions.ts derives it from sourceType */
    is_pyq?: boolean;
    /** KEEP — drives Top Questions feature */
    is_top_pyq?: boolean;
    /** KEEP — drives the side-by-side practice panel on /handwritten-notes/[chapter] */
    is_demo_question?: boolean;
    source_id?: string;
    microConcept?: string;
    isMultiConcept?: boolean;
    questionNature?: 'Recall' | 'Rule_Application' | 'Numerical' | 'Comparative' | 'Graphical' | 'Conceptual' | 'Mechanistic' | 'Synthesis';
    applicableExams?: Array<'JEE' | 'NEET' | 'CBSE' | 'State_Board' | 'BITSAT' | 'OLYMPIAD'>;
    examBoard?: 'JEE' | 'NEET' | 'CBSE' | 'State_Board' | 'BITSAT' | 'OLYMPIAD';
    sourceType?: 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock';
    examDetails?: {
      exam?: 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG';
      year?: number;
      month?: string;
      phase?: string;
      shift?: string;
      paper?: string;
    };
  };
  status: 'draft' | 'review' | 'published' | 'archived';
  quality_score: number;
  version: number;
  created_at: string;
  updated_at: string;
  svg_scales?: Record<string, number>;
  flags?: Array<{
    type: 'latex_error' | 'table_error' | 'mismatch' | 'solution_incorrect' | 'other';
    note: string;
    flagged_at: string;
    resolved: boolean;
  }>;
}

// ── Supporting types ──────────────────────────────────────────────────────────

/** MongoDB Chapter document (admin stats view — not the same as the student Chapter type) */
export interface AdminChapter {
  _id: string;
  name: string;
  display_order: number;
  stats: {
    total_questions: number;
  };
}

// ── UI constants ──────────────────────────────────────────────────────────────

/** Display metadata for each question type — used in filter dropdowns, type badges, new-question forms. */
export const QUESTION_TYPES = [
  { id: 'SCQ',  name: 'Single Correct',        color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'MCQ',  name: 'Multi Correct',          color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'NVT',  name: 'Numerical',              color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'AR',   name: 'Assertion-Reason',       color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'MST',  name: 'Multi-Statement',        color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
  { id: 'MTC',  name: 'Match Column',           color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'SUBJ', name: 'Subjective / Example',   color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'WKEX', name: 'Worked Example',         color: 'bg-teal-500/20 text-teal-400 border-teal-500/30' },
] as const;

export type QuestionTypeId = (typeof QUESTION_TYPES)[number]['id'];
