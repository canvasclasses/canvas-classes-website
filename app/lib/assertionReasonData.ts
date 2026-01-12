export interface AssertionReasonQuestion {
    id: string;
    chapter: string;
    assertion: string;
    reason: string;
    aTruth: boolean;      // Is Assertion True?
    rTruth: boolean;      // Is Reason True?
    isExplanation: boolean; // Does R correctly explain A?
    explanation: string;  // Concept explanation for wrong answers
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtx7-9Pe9s9lo3ZMfSRma3h-Rzredg0tbMUxVXxGTPta0NQBa-iggrhbO6hwiQUukgAj7Ca4E0GAPh/pub?output=csv';

// Robust CSV Parser for multiline support
function parseCSVRobust(text: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                current += '"';
                i++; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
            row.push(current);
            result.push(row);
            row = [];
            current = '';
        } else {
            current += char;
        }
    }
    if (current || row.length > 0) {
        row.push(current);
        result.push(row);
    }
    return result;
}

export async function fetchAssertionReasonQuestions(): Promise<AssertionReasonQuestion[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 3600 } });
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: ID, Chapter Name, Assertion (A), Reason (R), [aTruth], [rTruth], [isExplanation], [explanation]
        // Index:   0       1              2            3          4          5           6               7

        // Skip header row
        const dataRows = rows.slice(1);

        return dataRows.map(row => {
            const id = row[0] || '';
            const chapter = row[1] || '';
            const assertion = row[2] || '';
            const reason = row[3] || '';

            // Check if additional columns exist, otherwise default to standard NCERT format
            // (Both true, R explains A)
            const aTruth = row[4] ? row[4].toLowerCase() === 'true' || row[4].toLowerCase() === 'yes' : true;
            const rTruth = row[5] ? row[5].toLowerCase() === 'true' || row[5].toLowerCase() === 'yes' : true;
            const isExplanation = row[6] ? row[6].toLowerCase() === 'true' || row[6].toLowerCase() === 'yes' : true;
            const explanation = row[7] || `The Assertion is ${aTruth ? 'True' : 'False'} and the Reason is ${rTruth ? 'True' : 'False'}. ${isExplanation ? 'The Reason correctly explains the Assertion.' : 'The Reason is a true statement but does not directly explain the Assertion.'}`;

            return {
                id,
                chapter,
                assertion,
                reason,
                aTruth,
                rTruth,
                isExplanation,
                explanation
            };
        }).filter(q => q.assertion && q.reason); // Only include complete questions
    } catch (error) {
        console.error('Error fetching assertion-reason questions:', error);
        return [];
    }
}

// Get unique chapters for filtering
export function getUniqueChapters(questions: AssertionReasonQuestion[]): string[] {
    return Array.from(new Set(questions.map(q => q.chapter).filter(Boolean))).sort();
}

// Get questions by chapter
export function getQuestionsByChapter(questions: AssertionReasonQuestion[], chapter: string): AssertionReasonQuestion[] {
    if (chapter === 'all') return questions;
    return questions.filter(q => q.chapter === chapter);
}

// Shuffle array (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Chapter grouping for UI display
export interface ChapterGroup {
    chapterName: string;
    questions: AssertionReasonQuestion[];
}

// Group questions by chapter for grid display
export function groupByChapter(questions: AssertionReasonQuestion[]): ChapterGroup[] {
    const groups: { [key: string]: ChapterGroup } = {};

    questions.forEach(q => {
        if (!groups[q.chapter]) {
            groups[q.chapter] = {
                chapterName: q.chapter,
                questions: []
            };
        }
        groups[q.chapter].questions.push(q);
    });

    return Object.values(groups);
}
