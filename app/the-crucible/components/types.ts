// Types for the new Crucible system

export interface Chapter {
  id: string;
  name: string;
  class_level: number;
  display_order?: number;
  category?: 'Physical' | 'Inorganic' | 'Organic' | 'Practical';
  question_count?: number;
}

export interface Question {
  id: string;
  display_id: string;
  question_text: {
    markdown: string;
  };
  type: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC';
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
  };
  metadata: {
    difficulty: 'Easy' | 'Medium' | 'Hard';
    chapter_id: string;
    tags: Array<{ tag_id: string; weight: number }>;
    is_pyq: boolean;
    is_top_pyq: boolean;
  };
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
