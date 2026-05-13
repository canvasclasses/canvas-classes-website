export interface FlashcardItem {
    id: string;
    classNum: string;
    category: string;
    chapterName: string;
    question: string;
    answer: string;
    topicName: string;
}

const FLASHCARDS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToP-1ka1fN88OCt814c56-7Etbpg9lAjMdknGamiCFwqIRrwtxB6qMcKVz22kWgRJtbeAZvhXF_0E5/pub?output=csv';

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
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(current);
            current = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++;
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

export async function fetchFlashcards(): Promise<FlashcardItem[]> {
    try {
        const response = await fetch(FLASHCARDS_CSV_URL, { next: { revalidate: 86400 } });
        const text = await response.text();
        const rows = parseCSVRobust(text);

        const dataRows = rows.slice(1);

        return dataRows.map((row: string[]) => ({
            id: row[0] || '',
            classNum: row[1] || '',
            category: row[2] || 'Physical Chemistry',
            chapterName: row[3] || '',
            question: row[4] || '',
            answer: row[5] || '',
            topicName: row[6] || '',
        }));
    } catch (error) {
        console.error('Error fetching flashcards:', error);
        return [];
    }
}

function generateChapterSlug(chapterName: string): string {
    return chapterName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function getFlashcardChapters(): Promise<{ name: string; slug: string; cardCount: number; category: string }[]> {
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
            category: data.category
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}
