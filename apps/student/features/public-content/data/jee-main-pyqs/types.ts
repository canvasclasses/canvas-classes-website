// Shared types for the JEE Main PYQ public SEO route.
// Mirrors the JSON shape produced by scripts/export_jee_main_pyqs.js.

export type JmpDifficulty = 'easy' | 'medium' | 'hard';
export type JmpOptionId = 'a' | 'b' | 'c' | 'd';
export type JmpChapterType = 'physical' | 'organic' | 'inorganic' | 'practical';

export interface JmpOption {
    id: JmpOptionId;
    text: string;
}

export interface JmpQuestion {
    crucibleId: string;
    displayId: string;
    slug: string;
    chapterId: string;
    primaryTag: string | null;
    difficulty: JmpDifficulty;
    difficultyLevel: number;
    qualityScore: number;
    stem: string;
    options: JmpOption[];
    answerId: JmpOptionId;
    explanation: string;
    exam: string | null;
    examYear: number | null;
    examShift: string | null;
}

export interface JmpChapterMeta {
    id: string;
    name: string;
    slug: string;
    classLevel: 11 | 12;
    chapterType: JmpChapterType;
    questionCount: number;
    /** Earliest exam year among the chapter's questions (null if none tagged). */
    yearMin?: number | null;
    /** Latest exam year among the chapter's questions (null if none tagged). */
    yearMax?: number | null;
    /** Question slugs — used for generateStaticParams. */
    questionSlugs: string[];
}

export interface JmpManifest {
    generatedAt: string;
    exam: 'JEE_Main';
    subject: 'chemistry';
    totalQuestions: number;
    chapters: JmpChapterMeta[];
}

export interface JmpChapterData {
    chapterId: string;
    questions: JmpQuestion[];
}
