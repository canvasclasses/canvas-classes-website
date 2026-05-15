import { fetchFlashcards, FlashcardItem } from './revisionData';

export interface SEOQuestion extends FlashcardItem {
    slug: string;
    chapterSlug: string;
}

// Generate URL-friendly slug
export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
        .replace(/\-\-+/g, '-')      // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

// Fetch and process all questions with SEO metadata
export async function getAllSEOQuestions(): Promise<SEOQuestion[]> {
    const cards = await fetchFlashcards();
    return cards.map(card => ({
        ...card,
        slug: slugify(card.question.slice(0, 100)), // Limit slug length to avoid crazy URLs
        chapterSlug: slugify(card.chapterName)
    }));
}

// Get all unique chapter slugs
export async function getAllChapterSlugs(): Promise<string[]> {
    const questions = await getAllSEOQuestions();
    return Array.from(new Set(questions.map(q => q.chapterSlug)));
}

// Get questions by chapter slug
export async function getQuestionsByChapterSlug(chapterSlug: string): Promise<{ chapterName: string; questions: SEOQuestion[] } | null> {
    const questions = await getAllSEOQuestions();
    const chapterQuestions = questions.filter(q => q.chapterSlug === chapterSlug);

    if (chapterQuestions.length === 0) return null;

    return {
        chapterName: chapterQuestions[0].chapterName,
        questions: chapterQuestions
    };
}

// Get specific question by slugs
export async function getQuestionBySlugs(chapterSlug: string, questionSlug: string): Promise<SEOQuestion | null> {
    const questions = await getAllSEOQuestions();
    return questions.find(q => q.chapterSlug === chapterSlug && q.slug === questionSlug) || null;
}

// Get related questions (simple logic: same chapter)
export async function getRelatedQuestions(currentQuestion: SEOQuestion, limit = 5): Promise<SEOQuestion[]> {
    const questions = await getAllSEOQuestions();
    return questions
        .filter(q => q.chapterSlug === currentQuestion.chapterSlug && q.id !== currentQuestion.id)
        .slice(0, limit);
}
