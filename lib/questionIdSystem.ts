/**
 * ID System for Non-PYQ (Custom) Questions
 * 
 * For questions that are NOT from previous years (PYQ), we use a different prefix:
 * - PYQ questions: {prefix}_{number} (e.g., atom_001, mole_042)
 * - Custom questions: {prefix}C_{number} (e.g., atomC_001, moleC_042)
 * 
 * The 'C' suffix indicates "Custom" or "Created" question.
 * This allows us to distinguish between:
 * - PYQ questions (official JEE/NEET questions)
 * - Custom questions (created by teachers, from books, etc.)
 * 
 * Example ID assignments:
 * PYQ Questions:
 *   - atom_001, atom_002, ... atom_139 (139 PYQs from Atomic Structure)
 * 
 * Custom Questions:
 *   - atomC_001, atomC_002, ... (Custom questions for Atomic Structure)
 *   - moleC_001, moleC_002, ... (Custom questions for Mole Concept)
 */

import { getChapterById, CHAPTERS } from './chaptersConfig';

/**
 * Generate ID for a non-PYQ (custom) question
 */
export function generateCustomQuestionId(
    chapterId: string,
    existingIds: string[]
): string {
    const chapter = getChapterById(chapterId);
    const prefix = chapter?.prefix || chapterId.replace('chapter_', '').substring(0, 8);
    
    // Use 'C' suffix to indicate custom question
    const customPrefix = `${prefix}C`;
    
    // Find existing numbers for this custom prefix
    const existingNumbers = existingIds
        .filter(id => id.startsWith(`${customPrefix}_`))
        .map(id => {
            const match = id.match(/_(\d+)$/);
            return match ? parseInt(match[1]) : 0;
        });
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    
    return `${customPrefix}_${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Check if a question ID is for a custom (non-PYQ) question
 */
export function isCustomQuestion(id: string): boolean {
    return /C_\d{3}$/.test(id) || /C\d{3}$/.test(id);
}

/**
 * Check if a question ID is for a PYQ
 */
export function isPYQQuestion(id: string): boolean {
    return !isCustomQuestion(id);
}

/**
 * Parse any question ID (PYQ or Custom)
 */
export function parseQuestionId(id: string): {
    prefix: string;
    number: number;
    isCustom: boolean;
    chapterId?: string;
    chapterName?: string;
} | null {
    // Match pattern: prefix_001 or prefixC_001
    const match = id.match(/^([a-z][a-z0-9]{1,9})(C?)_(\d{3,4})$/);
    if (!match) return null;
    
    const basePrefix = match[1];
    const isCustom = match[2] === 'C';
    const number = parseInt(match[3]);
    
    // Find chapter
    const chapter = CHAPTERS.find(c => c.prefix === basePrefix);
    
    return {
        prefix: basePrefix,
        number,
        isCustom,
        chapterId: chapter?.id,
        chapterName: chapter?.name
    };
}

/**
 * Generate public display code for any question
 * PYQ: PYQ-ATOM-2024-001
 * Custom: ATOM-C001 (simpler, no year)
 */
export function generatePublicCode(
    questionId: string,
    year?: number,
    isPYQ: boolean = false
): string {
    const parsed = parseQuestionId(questionId);
    if (!parsed) return questionId.toUpperCase();
    
    if (parsed.isCustom || !isPYQ) {
        // Custom questions: CHAPTER-C###
        return `${parsed.prefix.toUpperCase()}-C${String(parsed.number).padStart(3, '0')}`;
    }
    
    // PYQ questions: PYQ-CHAPTER-YEAR-###
    const yearStr = year ? `-${year}` : '';
    return `PYQ-${parsed.prefix.toUpperCase()}${yearStr}-${String(parsed.number).padStart(3, '0')}`;
}

/**
 * Get the base prefix without C suffix
 */
export function getBasePrefix(id: string): string {
    const parsed = parseQuestionId(id);
    return parsed?.prefix || id.split('_')[0];
}

/**
 * Validate a custom question ID format
 */
export function isValidCustomQuestionId(id: string): boolean {
    // Format: prefixC_001 (prefix can be 2-10 chars, must end with C_###)
    const pattern = /^[a-z][a-z0-9]{1,9}C_\d{3,4}$/;
    return pattern.test(id);
}

/**
 * Migrate old question ID to new format
 * old: q_1234567890, atomic_structure_q1, etc.
 * new: atom_001, atomC_001, etc.
 */
export function migrateQuestionId(
    oldId: string,
    chapterId: string,
    index: number,
    isCustom: boolean = false
): string {
    const chapter = getChapterById(chapterId);
    const prefix = chapter?.prefix || chapterId.replace('chapter_', '').substring(0, 8);
    
    if (isCustom) {
        return `${prefix}C_${String(index).padStart(3, '0')}`;
    }
    
    return `${prefix}_${String(index).padStart(3, '0')}`;
}
