// ==========================================
// THE CRUCIBLE - TYPE DEFINITIONS
// JEE-Optimized Question Bank with Smart Failure Analysis
// ==========================================

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type SolutionType = 'Video' | 'AudioImage' | 'Text';

// JEE-Specific Question Types
export type JEEQuestionType =
    | 'SCQ'      // Single Correct Option (Most common MCQ)
    | 'MCQ'      // Multiple Correct Options (JEE Advanced style)
    | 'NVT'      // Numerical Value Type (Integer Answer)
    | 'AR'       // Assertion-Reason
    | 'MST'      // Multi-Statement (Statement I, II, etc.)
    | 'MTC';     // Match The Column / Matrix Match

// Weighted Concept Tag for Smart Failure Analysis
export interface WeightedTag {
    tagId: string;    // e.g., 'TAG_MOLE_LIMITING_REAGENT'
    weight: number;   // 0.0 - 1.0, must sum to 1.0 across all tags for a question
}

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
    imageScale?: number; // Valid: 10-100 (percentage)
    isCorrect: boolean;
}

export interface TrapInfo {
    likelyWrongChoiceId: string; // If they picked Option B...
    message: string; // ...show this: "You forgot to convert units!"
    conceptGapTag?: string; // The remedial tag to recommend
}

// Source Reference for tracking question origins
export type SourceType = 'NCERT' | 'PYQ' | 'COACHING' | 'OTHER';

export interface SourceReference {
    type: SourceType;

    // For NCERT references
    ncertBook?: string;       // e.g., "Class 12 Chemistry Part 1"
    ncertChapter?: string;    // e.g., "Chapter 2: Solutions"
    ncertPage?: string;       // e.g., "Page 42-43" or "Example 2.5"
    ncertTopic?: string;      // e.g., "Raoult's Law"

    // For PYQ references
    pyqExam?: string;         // e.g., "JEE Main 2023", "JEE Advanced 2019"
    pyqShift?: string;        // e.g., "Jan 25 Morning Shift"
    pyqYear?: number;         // e.g., 2023
    pyqQuestionNo?: string;   // e.g., "Q.54"

    // For coaching/other references
    sourceName?: string;      // e.g., "Allen Module", "Resonance DPP"

    // Common fields
    description?: string;     // Brief note about the connection
    similarity?: 'exact' | 'similar' | 'concept';  // How similar to the source
}

export interface Question {
    id: string;
    textMarkdown: string; // The question stem (Analysis supports Latex)
    images?: string[]; // Legacy support or gallery
    imageScale?: number; // Valid: 10-100 (percentage)
    options: QuestionOption[];

    // --- Core Metadata ---
    difficulty: Difficulty;
    chapterId?: string; // The chapter slug or name
    examSource?: string; // e.g., "JEE Mains 2024", "JEE Advanced 2019"
    isTopPYQ?: boolean;  // Flag for top questions
    isPYQ?: boolean;     // General flag for any PYQ

    // --- NEW: JEE Question Type ---
    // Allows filtering by question format (SCQ, NVT, MCQ, etc.)
    questionType: JEEQuestionType;

    // --- NEW: Weighted Concept Tags ---
    // Enables "Smart Failure Analysis" - blame the right concept
    // Total weights MUST sum to 1.0
    conceptTags: WeightedTag[];

    // --- Legacy single tag (for backwards compatibility) ---
    // DEPRECATED: Use conceptTags instead. This will be auto-populated from primary tag.
    tagId: string;

    // --- Answer Data ---
    // For NVT (Numerical Value Type) questions
    integerAnswer?: string; // The correct numerical answer (e.g., "5", "4.2")
    // For MCQ (Multiple Correct), multiple options can have isCorrect: true

    // --- The Hybrid Engine Payload ---
    solution: SolutionAsset;

    // --- The "Feedback Card" Logic ---
    trap?: TrapInfo;
    solutionImageScale?: number; // Valid: 10-100 (percentage)
    traps?: TrapInfo[];

    // --- Admin/Review Flags ---
    needsReview?: boolean;     // Flag for admin to review tags
    reviewNotes?: string;      // Admin notes about the question

    // --- Source References ---
    // Track where this question concept originated from (NCERT or earlier PYQs)
    sourceReferences?: SourceReference[];
}

// Concept Taxonomy Node
export interface ConceptNode {
    id: string;
    label: string;
    children?: ConceptNode[];
}

// Tag Definition for the Master Taxonomy
export interface TagDefinition {
    id: string;           // e.g., "TAG_MOLE_STOICHIOMETRY"
    name: string;          // e.g., "Stoichiometry"
    parent_id: string | null;
    type: 'chapter' | 'topic' | 'unit';
}

// Analytics Helper Types
export interface TaxonomyNode {
    id: string;
    _id?: string; // Optional MongoDB ID
    name: string;
    parent_id: string | null;
    type: 'branch' | 'chapter' | 'topic' | 'unit';
    sequence_order?: number;
    class_level?: '11' | '12';
    remedial_video_url?: string;
    remedial_notes_url?: string;
}

export interface ConceptScore {
    tagId: string;
    tagName: string;
    score: number;      // 0-100
    totalPoints: number;
    earnedPoints: number;
    questionCount: number;
}

