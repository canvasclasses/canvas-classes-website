/**
 * Flashcards Data Layer - MongoDB Integration
 * 
 * This replaces the Google Sheets CSV fetching while maintaining
 * the same interface for backward compatibility with existing UI components.
 */

import connectToDatabase from '@/lib/mongodb';
import Flashcard, { IFlashcard } from '@/lib/models/Flashcard';

export interface FlashcardItem {
  id: string;
  classNum: string;
  category: string;
  chapterName: string;
  question: string;
  answer: string;
  topicName: string;
}

// Cache for ISR (Incremental Static Regeneration)
let flashcardsCache: FlashcardItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes (reduced for active development — restore to 24h for production)

/**
 * Fetch all flashcards from MongoDB
 * Maintains same interface as the old CSV fetching for backward compatibility
 */
export async function fetchFlashcards(): Promise<FlashcardItem[]> {
  // Check cache first
  const now = Date.now();
  if (flashcardsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return flashcardsCache;
  }

  try {
    await connectToDatabase();

    const flashcards = await Flashcard.find({ deleted_at: null })
      .sort({ 'metadata.created_at': -1 })
      .lean<IFlashcard[]>();

    // Transform MongoDB documents to FlashcardItem interface
    const transformed: FlashcardItem[] = flashcards.map((card) => ({
      id: card.flashcard_id,
      classNum: String(card.metadata.class_num || 12),
      category: card.chapter.category,
      chapterName: card.chapter.name,
      question: card.question,
      answer: card.answer,
      topicName: card.topic.name,
    }));

    // Update cache
    flashcardsCache = transformed;
    cacheTimestamp = now;

    return transformed;
  } catch (error) {
    console.error('Error fetching flashcards from MongoDB:', error);
    
    // Fallback to empty array (or you could fallback to CSV here)
    return [];
  }
}

/**
 * Get flashcards by chapter name
 */
export async function getFlashcardsByChapter(chapterName: string): Promise<FlashcardItem[]> {
  const allFlashcards = await fetchFlashcards();
  return allFlashcards.filter(
    card => card.chapterName.toLowerCase() === chapterName.toLowerCase()
  );
}

/**
 * Generate URL-friendly slug from chapter name
 */
export function generateChapterSlug(chapterName: string): string {
  return chapterName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Get chapter name from slug
 */
export function getChapterFromSlug(slug: string, chapters: string[]): string | null {
  return chapters.find(chapter => generateChapterSlug(chapter) === slug) || null;
}

/**
 * Get all unique chapter names with their slugs and categories
 */
export async function getFlashcardChapters(): Promise<{
  name: string;
  slug: string;
  cardCount: number;
  category: string;
}[]> {
  const allFlashcards = await fetchFlashcards();
  const chapterMap = new Map<string, { count: number; category: string }>();

  allFlashcards.forEach(card => {
    if (card.chapterName) {
      const existing = chapterMap.get(card.chapterName);
      if (existing) {
        existing.count++;
      } else {
        chapterMap.set(card.chapterName, { count: 1, category: card.category });
      }
    }
  });

  return Array.from(chapterMap.entries())
    .map(([name, data]) => ({
      name,
      slug: generateChapterSlug(name),
      cardCount: data.count,
      category: data.category,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get chapters grouped by category
 */
export async function getFlashcardChaptersByCategory(): Promise<
  Record<string, { name: string; slug: string; cardCount: number }[]>
> {
  const chapters = await getFlashcardChapters();
  const grouped: Record<string, { name: string; slug: string; cardCount: number }[]> = {
    'Physical Chemistry': [],
    'Organic Chemistry': [],
    'Inorganic Chemistry': [],
    'JEE PYQ': [],
  };

  chapters.forEach(chapter => {
    const category = chapter.category || 'Physical Chemistry';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push({
      name: chapter.name,
      slug: chapter.slug,
      cardCount: chapter.cardCount,
    });
  });

  return grouped;
}

/**
 * Get a single flashcard by ID
 * Used for individual flashcard pages (SEO URLs)
 */
export async function getFlashcardById(id: string): Promise<FlashcardItem | null> {
  try {
    await connectToDatabase();

    const flashcard = await Flashcard.findOne({
      flashcard_id: id,
      deleted_at: null,
    }).lean<IFlashcard>();

    if (!flashcard) {
      return null;
    }

    return {
      id: flashcard.flashcard_id,
      classNum: String(flashcard.metadata.class_num || 12),
      category: flashcard.chapter.category,
      chapterName: flashcard.chapter.name,
      question: flashcard.question,
      answer: flashcard.answer,
      topicName: flashcard.topic.name,
    };
  } catch (error) {
    console.error('Error fetching flashcard by ID:', error);
    return null;
  }
}

/**
 * Clear cache (useful for admin operations)
 */
export function clearFlashcardsCache() {
  flashcardsCache = null;
  cacheTimestamp = 0;
}
