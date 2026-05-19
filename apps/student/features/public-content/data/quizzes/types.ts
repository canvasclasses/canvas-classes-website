// Shared types for /quiz/chemistry/[slug] pages.
//
// Each quiz is a static module exporting a `QuizData` object. The page route
// looks up the quiz by slug, renders the questions inside <details> for
// always-in-DOM AI-friendly Q+A, and emits Quiz + QAPage JSON-LD using the
// fields below.

export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizOption {
    id: 'a' | 'b' | 'c' | 'd';
    text: string;
}

export interface QuizQuestion {
    id: number;
    /** Topic label used for grouping in UI (e.g., "S-Block", "Group 13"). */
    topic: string;
    difficulty: QuizDifficulty;
    /** Question text. May contain inline LaTeX between $...$ delimiters. */
    stem: string;
    options: [QuizOption, QuizOption, QuizOption, QuizOption];
    /** Correct option id. */
    answerId: 'a' | 'b' | 'c' | 'd';
    /** Explanation shown after reveal. May contain inline LaTeX. */
    explanation: string;
    /**
     * Source trend block ids in app/lib/inorganicTrendsData.ts (for traceability
     * and future automated audit scripts). Empty array means hand-authored or
     * sourced from Crucible (see sourceCrucibleDisplayId).
     */
    sourceTrendIds: number[];
    /**
     * Crucible question display_id (e.g., "GOC-042") when the question is
     * exported from the questions_v2 collection. Used by audit scripts to
     * verify the question still exists upstream.
     */
    sourceCrucibleDisplayId?: string;
    /**
     * PYQ provenance metadata. Optional; populated for star-marked PYQ
     * exports. Renders as a small badge on the question card.
     */
    sourcePYQ?: {
        exam?: string;
        year?: number;
        shift?: string;
    };
}

export interface QuizFAQ {
    question: string;
    answer: string;
}

export interface QuizData {
    /** URL slug — the [slug] segment under /quiz/chemistry/. */
    slug: string;
    /** H1 / `<title>` shown to users and used as Quiz.name in JSON-LD. */
    title: string;
    /** Sentence-shaped description that mirrors how students prompt AI engines. */
    description: string;
    /** Short label shown on cards / breadcrumbs (e.g. "Inorganic Exceptions"). */
    shortLabel: string;
    /** ISO date the quiz was first published. */
    datePublished: string;
    /** ISO date the quiz was last updated. */
    dateModified: string;
    /** Educational level — multi-value supported (e.g. "Class 11 / Class 12"). */
    educationalLevel: string;
    /** Target exams — used for keywords + audience description. */
    targetExams: string[];
    /** Free-form keywords used in <meta name="keywords"> + audience tags. */
    keywords: string[];
    /** What the student will learn — bullet points shown above the questions. */
    learningOutcomes: string[];
    /** The actual questions. */
    questions: QuizQuestion[];
    /** FAQ entries (rendered as <details> + emitted as FAQPage JSON-LD). */
    faqs: QuizFAQ[];
    /** Internal links to surface alongside the quiz (related study tools). */
    relatedLinks: { label: string; href: string; description: string }[];
}
