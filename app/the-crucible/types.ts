export type QuestionType = 'MCQ' | 'Integer' | 'Matrix';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type SolutionType = 'Video' | 'AudioImage' | 'Text';

export interface SolutionAsset {
    // Priority 1: The Gold Standard
    videoUrl?: string; // YouTube/Vimeo ID or URL
    videoTimestampStart?: number; // Optional: Deep link into a long lecture

    // Priority 2: The Personal Touch (Guru Mode)
    audioExplanationUrl?: string; // URL to .mp3/.wav
    handwrittenSolutionImageUrl?: string; // URL to .jpg/.png of your iPad notes

    // Priority 3: The Baseline
    textSolutionLatex: string; // The fallback Latex string. REQUIRED.
}

export interface QuestionOption {
    id: string;
    text: string; // Supports Latex/Images
    isCorrect: boolean;
}

export interface TrapInfo {
    likelyWrongChoiceId: string; // If they picked Option B...
    message: string; // ...show this: "You forgot to convert units!"
    conceptGapTag?: string; // The remedial tag to recommend
}

export interface Question {
    id: string;
    textMarkdown: string; // The question stem (Analysis supports Latex)
    options: QuestionOption[];

    // Metadata
    tagId: string; // Maps to the Taxonomy (e.g., 'OC_NameRxn_Aldol')
    difficulty: Difficulty;
    examSource?: string; // e.g., "JEE Mains 2024"
    chapterId?: string; // The chapter slug or name
    isTopPYQ?: boolean; // Flag for top questions
    isPYQ?: boolean; // General flag for any PYQ

    // New Type Support
    type?: 'MCQ' | 'INTEGER';
    integerAnswer?: string; // The correct numerical answer (e.g., "5", "4.2")

    // The Hybrid Engine Payload
    solution: SolutionAsset;

    // The "Feedback Card" Logic
    trap?: TrapInfo;
}

export interface ConceptNode {
    id: string;
    label: string;
    children?: ConceptNode[];
}
