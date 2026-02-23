/**
 * Question ID Generator Utility
 * Generates clean, simple IDs for questions based on chapter prefix
 */

import { CHAPTERS, getChapterById } from './chaptersConfig';

export interface IDGeneratorConfig {
  chapterId: string;
  existingIds: string[];
  preferredNumber?: number; // For specific numbering like atom_001
}

/**
 * Generate the next available ID for a chapter
 * Format: {prefix}_{3-digit-number}
 * Examples: atom_001, mole_042, thermo_128
 */
export function generateNextQuestionId(config: IDGeneratorConfig): string {
  const { chapterId, existingIds, preferredNumber } = config;
  
  const chapter = getChapterById(chapterId);
  if (!chapter) {
    throw new Error(`Unknown chapter: ${chapterId}`);
  }
  
  const prefix = chapter.prefix;
  
  // If preferred number is provided and available, use it
  if (preferredNumber !== undefined) {
    const preferredId = `${prefix}_${String(preferredNumber).padStart(3, '0')}`;
    if (!existingIds.includes(preferredId)) {
      return preferredId;
    }
  }
  
  // Find the highest existing number for this prefix
  const existingNumbers = existingIds
    .filter(id => id.startsWith(`${prefix}_`))
    .map(id => {
      const match = id.match(/_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    });
  
  const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  const nextNumber = maxNumber + 1;
  
  return `${prefix}_${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Generate a batch of IDs for bulk import
 */
export function generateQuestionIdBatch(
  chapterId: string, 
  existingIds: string[], 
  count: number,
  startFrom?: number
): string[] {
  const ids: string[] = [];
  const chapter = getChapterById(chapterId);
  
  if (!chapter) {
    throw new Error(`Unknown chapter: ${chapterId}`);
  }
  
  const prefix = chapter.prefix;
  
  // Find starting number
  let startNum = startFrom || 1;
  if (startFrom === undefined) {
    const existingNumbers = existingIds
      .filter(id => id.startsWith(`${prefix}_`))
      .map(id => {
        const match = id.match(/_(\d+)$/);
        return match ? parseInt(match[1]) : 0;
      });
    startNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  }
  
  // Generate IDs
  for (let i = 0; i < count; i++) {
    let id = `${prefix}_${String(startNum + i).padStart(3, '0')}`;
    // Ensure no duplicates
    while (existingIds.includes(id) || ids.includes(id)) {
      startNum++;
      id = `${prefix}_${String(startNum + i).padStart(3, '0')}`;
    }
    ids.push(id);
  }
  
  return ids;
}

/**
 * Validate a question ID format
 */
export function isValidQuestionId(id: string): boolean {
  // Format: prefix_001 (prefix can be 2-10 chars)
  const pattern = /^[a-z][a-z0-9]{1,9}_\d{3,4}$/;
  return pattern.test(id);
}

/**
 * Parse a question ID to get chapter info
 */
export function parseQuestionId(id: string): { 
  prefix: string; 
  number: number; 
  chapterId?: string;
  chapterName?: string;
} | null {
  const match = id.match(/^([a-z][a-z0-9]{1,9})_(\d{3,4})$/);
  if (!match) return null;
  
  const prefix = match[1];
  const number = parseInt(match[2]);
  
  const chapter = CHAPTERS.find(c => c.prefix === prefix);
  
  return {
    prefix,
    number,
    chapterId: chapter?.id,
    chapterName: chapter?.name
  };
}

/**
 * Get all IDs for a specific chapter from a list
 */
export function getIdsByChapter(ids: string[], chapterId: string): string[] {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];
  
  return ids.filter(id => id.startsWith(`${chapter.prefix}_`));
}

/**
 * Reorder IDs when a question is deleted (optional - for keeping sequential)
 * Note: This is generally NOT recommended as it changes existing IDs
 */
export function getIdGaps(existingIds: string[], chapterId: string): number[] {
  const chapter = getChapterById(chapterId);
  if (!chapter) return [];
  
  const prefix = chapter.prefix;
  const numbers = existingIds
    .filter(id => id.startsWith(`${prefix}_`))
    .map(id => {
      const match = id.match(/_(\d+)$/);
      return match ? parseInt(match[1]) : 0;
    })
    .sort((a, b) => a - b);
  
  const gaps: number[] = [];
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i] - numbers[i - 1] > 1) {
      // Found a gap
      for (let j = numbers[i - 1] + 1; j < numbers[i]; j++) {
        gaps.push(j);
      }
    }
  }
  
  return gaps;
}

/**
 * Generate a public display code for a question
 * Format: CH-prefix-year-number
 * Example: CH-ATOM-2024-001
 */
export function generatePublicCode(
  questionId: string, 
  year?: number,
  isPYQ: boolean = false
): string {
  const parsed = parseQuestionId(questionId);
  if (!parsed) return questionId.toUpperCase();
  
  const yearStr = year ? `-${year}` : '';
  const typePrefix = isPYQ ? 'PYQ' : 'CH';
  
  return `${typePrefix}-${parsed.prefix.toUpperCase()}${yearStr}-${String(parsed.number).padStart(3, '0')}`;
}
