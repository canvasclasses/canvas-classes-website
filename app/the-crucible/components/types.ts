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
    difficulty: 'Easy' | 'Medium' | 'Hard';
    chapter_id: string;
    tags: Array<{ tag_id: string; weight: number }>;
    // Multi-dimensional tagging (Step 1 upgrade)
    microConcept?: string;
    cognitiveType?: 'recall' | 'conceptual' | 'application' | 'procedural' | 'multi-step' | 'analytical';
    calcLoad?: 'calc-none' | 'calc-light' | 'calc-moderate' | 'calc-heavy' | 'calc-trap';
    entryPoint?: 'clear-entry' | 'strategy-first' | 'novel-framing';
    isMultiConcept?: boolean;
    is_pyq: boolean;
    is_top_pyq: boolean;
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
  difficulty: 'all' | 'Easy' | 'Medium' | 'Hard';
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
