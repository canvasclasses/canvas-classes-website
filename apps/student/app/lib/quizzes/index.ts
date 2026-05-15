import type { QuizData } from './types';
import { inorganicExceptionsQuiz } from './inorganic-exceptions.data';
import { pBlockAnomaliesQuiz } from './p-block-anomalies.data';
import { gocJeeMainPyqsQuiz } from './general-organic-chemistry-mcq.data';

// Registry of every published chemistry quiz under /quiz/chemistry/[slug].
// Add a new entry here once you create a new <slug>.data.ts module — the
// dynamic route, sitemap, hub page and metadata pick it up automatically.
//
// Order matters — this is the order the hub page lists quizzes in. Put the
// flagship / highest-search-volume slug first.

export const CHEMISTRY_QUIZZES_ORDERED: QuizData[] = [
    inorganicExceptionsQuiz,
    pBlockAnomaliesQuiz,
    gocJeeMainPyqsQuiz,
];

export const CHEMISTRY_QUIZZES: Record<string, QuizData> = Object.fromEntries(
    CHEMISTRY_QUIZZES_ORDERED.map((q) => [q.slug, q])
);

export const CHEMISTRY_QUIZ_SLUGS: string[] = CHEMISTRY_QUIZZES_ORDERED.map((q) => q.slug);

export function getChemistryQuiz(slug: string): QuizData | null {
    return CHEMISTRY_QUIZZES[slug] ?? null;
}
