export interface RevisionChapter {
    id: string;
    classNum: number;
    chapterNum: number;
    chapterName: string;
    summary: string;
    slug: string;
}

export interface RevisionTopic {
    id: string;
    classNum: string;
    chapterNum: string;
    chapterName: string;
    topicName: string;
    topicOrder: number;
    infographicUrl: string;
    hasFlashcards: boolean;
}

export interface FlashcardItem {
    id: string;
    classNum: string;
    category: string;
    chapterName: string;
    question: string;
    answer: string;
    topicName: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRPlWVZDTRtknmy6zXFuwzrm4oiGYXfVVmBmj08LMU_vueoqB-uzH-TfyABixli2PoKohIfJBMPiMAN/pub?output=csv';
const TOPICS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQhGKJhEUs03TOoURdENzh7j7pmQzHeJYL3JGHL9HeRk37a26S0-1YD55CODtkhZwcZEfCPqrvtFhFu/pub?output=csv';
const FLASHCARDS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToP-1ka1fN88OCt814c56-7Etbpg9lAjMdknGamiCFwqIRrwtxB6qMcKVz22kWgRJtbeAZvhXF_0E5/pub?output=csv';

// Helper to generate slug from chapter name
function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

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


export async function fetchRevisionData(): Promise<RevisionChapter[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: id, class, chapter_number, chapter_name, summary_text

        // Skip header row
        const dataRows = rows.slice(1);

        return dataRows.map(row => {
            // Ensure we have enough columns, some descriptive CSVs might have trailing empty cols
            const id = row[0] || '';
            const classNum = parseInt(row[1] || '12');
            const chapterNum = parseInt(row[2] || '0');
            const chapterName = row[3] || 'Untitled';
            const summary = row[4] || ''; // This contains the markdown

            return {
                id,
                classNum,
                chapterNum,
                chapterName,
                summary,
                slug: generateSlug(chapterName)
            };
        }).filter(item => item.chapterName !== 'Untitled'); // Basic filter

    } catch (error) {
        console.error('Error fetching revision data:', error);
        return [];
    }
}

export async function fetchRevisionTopics(): Promise<RevisionTopic[]> {
    try {
        // Fetch with ISR - revalidate every 24 hours
        const response = await fetch(TOPICS_CSV_URL, { next: { revalidate: 86400 } });
        const text = await response.text();
        const rows = parseCSVRobust(text);

        // Skip header
        const dataRows = rows.slice(1);

        return dataRows.map((row: any) => ({
            id: row[0] || '',
            classNum: row[1] || '',
            chapterNum: row[2] || '',
            chapterName: row[3] || '',
            topicName: row[5] || '', // Topic Name is index 5
            topicOrder: parseInt(row[6]) || 0, // Topic Order is index 6
            infographicUrl: row[8] || '', // Infographic URL is index 8
            hasFlashcards: (row[11] || '').toString().toLowerCase() === 'yes' || (row[11] || '').toString().toLowerCase() === 'true', // Has Flashcards is index 11
        }));
    } catch (error) {
        console.error('Error fetching revision topics:', error);
        return [];
    }
}

export async function fetchFlashcards(): Promise<FlashcardItem[]> {
    try {
        const response = await fetch(FLASHCARDS_CSV_URL, { next: { revalidate: 3600 } });
        const text = await response.text();
        const rows = parseCSVRobust(text);

        // Header: ID,Class,Category,Chapter,Question,Answer,Topic Name
        const dataRows = rows.slice(1);

        return dataRows.map((row: any) => ({
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

export async function getTopicsByChapter(chapterNum: number): Promise<RevisionTopic[]> {
    const allTopics = await fetchRevisionTopics();
    const chapterNumStr = chapterNum.toString();
    return allTopics
        .filter(topic => topic.chapterNum === chapterNumStr)
        .sort((a, b) => a.topicOrder - b.topicOrder);
}

export async function getFlashcardsByChapter(chapterName: string): Promise<FlashcardItem[]> {
    const allFlashcards = await fetchFlashcards();
    // Normalize chapter name for comparison if needed
    // Assuming CSV chapter names match "Solutions", "Biomolecules" etc.
    return allFlashcards.filter(card => card.chapterName.toLowerCase() === chapterName.toLowerCase());
}

// Generate URL-friendly slug from chapter name
export function generateChapterSlug(chapterName: string): string {
    return chapterName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Get chapter name from slug
export function getChapterFromSlug(slug: string, chapters: string[]): string | null {
    return chapters.find(chapter => generateChapterSlug(chapter) === slug) || null;
}

// Get all unique chapter names with their slugs and categories
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

// Get chapters grouped by category
export async function getFlashcardChaptersByCategory(): Promise<Record<string, { name: string; slug: string; cardCount: number }[]>> {
    const chapters = await getFlashcardChapters();
    const grouped: Record<string, { name: string; slug: string; cardCount: number }[]> = {
        'Physical Chemistry': [],
        'Organic Chemistry': [],
        'Inorganic Chemistry': [],
    };

    chapters.forEach(chapter => {
        const category = chapter.category || 'Physical Chemistry';
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push({
            name: chapter.name,
            slug: chapter.slug,
            cardCount: chapter.cardCount
        });
    });

    return grouped;
}

