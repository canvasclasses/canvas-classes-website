// LEGACY camelCase shape — kept for back-compat with older student-side code.
// The canonical V2 shape (matching `lib/models/Question.v2.ts` / `@canvas/data`)
// lives at `./components/types.ts`. New code should import from there.
// TODO: migrate remaining consumers off this file, then delete.

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    imageScale?: number;
}

export interface WeightedTag {
    tagId: string;
    weight: number;
}

export interface Solution {
    textSolutionLatex: string;
    videoUrl?: string;
    videoTimestampStart?: string;
    audioExplanationUrl?: string;
    handwrittenSolutionImageUrl?: string;
}

export interface SourceReference {
    type: 'NCERT' | 'PYQ' | 'COACHING' | 'OTHER';
    description?: string;
    ncertBook?: string;
    ncertChapter?: string;
    ncertPage?: string;
    pyqExam?: string;
    pyqYear?: number;
    pyqShift?: string;
    similarity?: 'exact' | 'concept' | 'method';
}

export interface Question {
    id: string;
    questionCode?: string;
    textMarkdown: string;
    questionType: 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ';
    options: Option[];
    integerAnswer?: string;
    solution: Solution;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    chapterId?: string;
    tagId?: string;
    conceptTags: WeightedTag[];
    isPYQ: boolean;
    isTopPYQ: boolean;
    examSource?: string;
    imageScale?: number;
    solutionImageScale?: number;
    needsReview?: boolean;
    reviewNotes?: string;
    sourceReferences?: SourceReference[];
}

export type JEEQuestionType = 'SCQ' | 'MCQ' | 'NVT' | 'AR' | 'MST' | 'MTC' | 'SUBJ';

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

export interface TrapInfo {
    optionId: string;
    explanation: string;
}
