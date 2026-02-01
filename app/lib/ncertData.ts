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
    classification: string;
}

export interface ChapterGroup {
    chapter: string;
    classNum: number;
    classification: string;
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
            const [classNum, classification, chapter, questionNumber, questionText, difficulty, solutionContent, solutionType, youtubeUrl, altText] = values;

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
                classification: classification || '',
            });
        }

        return questions;
    } catch (error) {
        console.error('Error fetching NCERT Solutions data:', error);
        return [];
    }
}

// Custom order for NCERT Chapters (Official NCERT Sequence)
const CHAPTER_ORDER: Record<string, number> = {
    // Class 11
    'Some Basic Concepts of Chemistry': 1,
    'Structure of Atom': 2,
    'Classification of Elements and Periodicity in Properties': 3,
    'Chemical Bonding and Molecular Structure': 4,
    'Thermodynamics': 5,
    'Equilibrium': 6,
    'Redox Reactions': 7,
    'Organic Chemistry – Some Basic Principles and Techniques': 8,
    'Hydrocarbons': 9,

    // Class 12
    'Solutions': 1,
    'Electrochemistry': 2,
    'Chemical Kinetics': 3,
    'The d-and f-Block Elements': 4,
    'The d- and f- Block Elements': 4, // Alternative spelling check
    'Coordination Compounds': 5,
    'Haloalkanes and Haloarenes': 6,
    'Alcohols, Phenols and Ethers': 7,
    'Aldehydes, Ketones and Carboxylic Acids': 8,
    'Amines': 9,
    'Biomolecules': 10
};

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
                classification: q.classification,
                questions: [],
            });
        }
        chapterMap.get(key)!.questions.push(q);
    }

    return Array.from(chapterMap.values()).sort((a, b) => {
        if (a.classNum !== b.classNum) return a.classNum - b.classNum;

        const getOrder = (chapter: string, classNum: number) => {
            if (CHAPTER_ORDER[chapter]) return CHAPTER_ORDER[chapter];

            const lower = chapter.toLowerCase();
            if (classNum === 11) {
                if (lower.includes('basic concept')) return 1;
                if (lower.includes('structure of atom')) return 2;
                if (lower.includes('periodicity')) return 3;
                if (lower.includes('bonding')) return 4;
                if (lower.includes('thermo')) return 5;
                if (lower.includes('equilibrium')) return 6;
                if (lower.includes('redox')) return 7;
                if (lower.includes('organic chemistry')) return 8;
                if (lower.includes('hydrocarbon')) return 9;
            } else {
                if (lower.includes('solution')) return 1;
                if (lower.includes('electro')) return 2;
                if (lower.includes('kinetic')) return 3;
                if (lower.includes('block')) return 4;
                if (lower.includes('coordination')) return 5;
                if (lower.includes('halo')) return 6;
                if (lower.includes('alcohol')) return 7;
                if (lower.includes('aldehyde')) return 8;
                if (lower.includes('amine')) return 9;
                if (lower.includes('bio')) return 10;
            }
            return 999;
        };

        const orderA = getOrder(a.chapter, a.classNum);
        const orderB = getOrder(b.chapter, b.classNum);

        if (orderA !== orderB) return orderA - orderB;
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
