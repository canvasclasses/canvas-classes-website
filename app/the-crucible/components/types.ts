// Types for the new Crucible system

export interface Chapter {
  id: string;
  name: string;
  class_level: number;
  display_order?: number;
  category?: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
  question_count?: number;
  star_question_count?: number;
}

export interface Question {
  id: string;
  display_id: string;
  question_text: {
    markdown: string;
  };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ' | 'WKEX';
  options?: Array<{
    id: string;
    text: string;
    is_correct: boolean;
  }>;
  answer?: {
    integer_value?: number;
    correct_option?: string;
  };
  solution: {
    text_markdown: string;
    video_url?: string;
    asset_ids?: {
      audio?: string[];
    };
    latex_validated?: boolean;
  };
  metadata: {
    difficultyLevel: 1 | 2 | 3 | 4 | 5;
    chapter_id: string;
    tags: Array<{ tag_id: string; weight: number }>;
    // Multi-dimensional tagging
    microConcept?: string;
    isMultiConcept?: boolean;
    questionNature?: 'Recall' | 'Rule_Application' | 'Mechanistic' | 'Synthesis';
    // NEW: 3-Tier Exam Taxonomy
    examBoard?: 'JEE' | 'NEET' | 'CBSE' | 'State_Board' | 'BITSAT' | 'OLYMPIAD';
    sourceType?: 'PYQ' | 'NCERT_Textbook' | 'NCERT_Exemplar' | 'Practice' | 'Mock';
    examDetails?: {
      exam?: 'JEE_Main' | 'JEE_Advanced' | 'NEET_UG' | 'NEET_PG';
      year?: number;
      month?: string;
      phase?: string;
      shift?: string;
      paper?: string;
      question_number?: string;
    };
    // DEPRECATED (kept for backward compatibility)
    is_pyq?: boolean;
    is_top_pyq?: boolean;
    exam_source?: {
      exam?: string;
      year?: number;
      month?: string;
      shift?: string;
    };
  };
  svg_scales?: Record<string, number>;
}

export interface PracticeFilters {
  conceptTag: string | null;
  topPYQ: boolean;
  difficultyLevel: 'all' | 1 | 2 | 3 | 4 | 5;
}

export interface ExamConfig {
  chapterId: string | null;
  difficultyLevel: 'neet' | 'main' | 'advanced';
  questionCount: number;
  durationMinutes: number;
}

export interface TaxonomyNode {
  id: string;
  name: string;
  parent_id?: string | null;
  type?: 'chapter' | 'topic';
  sequence_order?: number;
  class_level?: number;
  remedial_video_url?: string;
  remedial_notes_url?: string;
}

export type ViewMode = 'list' | 'split' | 'full';
