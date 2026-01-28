// NCERT Solutions data types and CSV fetcher

export interface NCERTQuestion {
    id: number;
    classNum: number;
    chapter: string;
    questionNumber: string;
    questionText: string;
    difficulty: string;
    solutionContent: string;
    solutionType: string;
    youtubeUrl: string;
    altText: string;
}

export interface ChapterGroup {
    chapter: string;
    classNum: number;
    questions: NCERTQuestion[];
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRl8pdCGxOr6dNnDXnuNo4eDdtoXqY9MTX-ZfUPrikB3-YWbrLzNWVB64INcyZSFamJ7zsNcSqKGKHC/pub?output=csv';

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Fetch and parse NCERT Solutions data
export async function fetchNCERTData(): Promise<NCERTQuestion[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length < 2) return [];

        const questions: NCERTQuestion[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const [classNum, chapter, questionNumber, questionText, difficulty, solutionContent, solutionType, youtubeUrl, altText] = values;

            if (!chapter || !questionText) continue;

            questions.push({
                id: i,
                classNum: parseInt(classNum, 10) || 11,
                chapter: chapter,
                questionNumber: questionNumber || '',
                questionText: questionText,
                difficulty: difficulty || 'Easy',
                solutionContent: solutionContent || '',
                solutionType: solutionType || 'Text',
                youtubeUrl: youtubeUrl || '',
                altText: altText || '',
            });
        }

        return questions;
    } catch (error) {
        console.error('Error fetching NCERT Solutions data:', error);
        return [];
    }
}

// Group questions by chapter
export async function getChapterGroups(): Promise<ChapterGroup[]> {
    const questions = await fetchNCERTData();
    const chapterMap = new Map<string, ChapterGroup>();

    for (const q of questions) {
        const key = `${q.classNum}-${q.chapter}`;
        if (!chapterMap.has(key)) {
            chapterMap.set(key, {
                chapter: q.chapter,
                classNum: q.classNum,
                questions: [],
            });
        }
        chapterMap.get(key)!.questions.push(q);
    }

    return Array.from(chapterMap.values()).sort((a, b) => {
        if (a.classNum !== b.classNum) return a.classNum - b.classNum;
        return a.chapter.localeCompare(b.chapter);
    });
}

// Get stats
export async function getNCERTStats() {
    const questions = await fetchNCERTData();
    const chapters = new Set(questions.map(q => `${q.classNum}-${q.chapter}`));
    const class11 = questions.filter(q => q.classNum === 11).length;
    const class12 = questions.filter(q => q.classNum === 12).length;

    return {
        totalQuestions: questions.length,
        totalChapters: chapters.size,
        class11Questions: class11,
        class12Questions: class12,
    };
}
