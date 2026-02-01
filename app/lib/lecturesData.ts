// Lecture data types and CSV fetcher for Google Sheets integration

export interface Lecture {
    lectureNumber: number;
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
    views?: string;
}

export interface Chapter {
    name: string;
    slug: string;
    class: '11' | '12';
    difficulty: string;
    classification: 'Physical' | 'Organic' | 'Inorganic';
    notesLink: string;
    keyTopics: string[];
    lectures: Lecture[];
    totalDuration: string;
    videoCount: number;
    hasMindmap: boolean;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3puUwydA1VIxVHZeryvOBQerMiwjdzG40FcgvVz1u2aDfdHQiRhAVwycdMYjEIlOFQkO6PIavbBjj/pub?output=csv';

// Parse CSV text to array of objects
function parseCSV(csvText: string): Record<string, string>[] {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Parse rows
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
            // Store original header and a normalized version (no spaces, lowercase)
            const key = header.trim();
            const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
            row[key] = values[i]?.trim() || '';
            row[`__norm_${normalizedKey}`] = values[i]?.trim() || '';
        });
        return row;
    });
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

// Convert chapter name to URL-friendly slug
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Parse duration string (e.g., "45m") to minutes
function parseDuration(duration: string): number {
    if (!duration) return 0;
    const match = duration.match(/(\d+)m?/);
    return match ? parseInt(match[1], 10) : 0;
}

// Format minutes to "Xh Ym" format
function formatDuration(minutes: number): string {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Fetch and parse all lecture data
export async function fetchLecturesData(): Promise<Chapter[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 60 } }); // Reduced cache to 60 seconds for testing/updates
        const csvText = await response.text();
        const rows = parseCSV(csvText);

        if (rows.length > 0) {
            console.log('✅ CSV Headers detected:', Object.keys(rows[0]));
            console.log('Sample row __norm_mindmap:', rows[0]['__norm_mindmap']);
        }

        // Group by chapter
        const chaptersMap = new Map<string, Chapter>();
        let currentChapter: string | null = null;
        let currentClass: '11' | '12' = '11';
        let currentDifficulty = '';
        let currentNotesLink = '';
        let currentKeyTopics: string[] = [];

        for (const row of rows) {
            // Update current chapter context if row has chapter info
            if (row['Class']) {
                currentClass = row['Class'] as '11' | '12';
            }
            if (row['Chapter Name']) {
                currentChapter = row['Chapter Name'];
            }
            if (row['Difficulty Level']) {
                currentDifficulty = row['Difficulty Level'];
            }
            if (row['Notes link']) {
                currentNotesLink = row['Notes link'];
            }
            if (row['Key Topics']) {
                currentKeyTopics = row['Key Topics'].split(',').map(t => t.trim()).filter(Boolean);
            }

            const chapterKey = `${currentClass}-${currentChapter}`;

            if (!chaptersMap.has(chapterKey) && currentChapter) {
                let classification: 'Physical' | 'Organic' | 'Inorganic' = 'Physical';
                if (row['Classification']) {
                    const rawClass = row['Classification'].trim();
                    if (rawClass.includes('Organic') && !rawClass.includes('Inorganic')) classification = 'Organic';
                    else if (rawClass.includes('Inorganic')) classification = 'Inorganic';
                }

                const hasMindmap = row['__norm_mindmaps']?.toLowerCase() === 'yes' || row['__norm_mindmap']?.toLowerCase() === 'yes' || slugify(currentChapter) === 'biomolecules' || slugify(currentChapter) === 'salt-analysis';

                console.log(`Creating chapter: ${currentChapter}, hasMindmap: ${hasMindmap}, slug: ${slugify(currentChapter)}`);

                chaptersMap.set(chapterKey, {
                    name: currentChapter,
                    slug: slugify(currentChapter),
                    class: currentClass,
                    difficulty: currentDifficulty || 'Moderate',
                    classification,
                    notesLink: currentNotesLink,
                    keyTopics: currentKeyTopics,
                    lectures: [],
                    totalDuration: '0m',
                    videoCount: 0,
                    // Robust check: Mind Maps, Mindmaps, Mind Map, etc.
                    hasMindmap: hasMindmap,
                });
            }

            const chapter = chaptersMap.get(chapterKey)!;

            // Add lecture if data exists
            if (row['Lecture'] && row['Title'] && row['URL']) {
                chapter.lectures.push({
                    lectureNumber: parseInt(row['Lecture'], 10) || chapter.lectures.length + 1,
                    title: row['Title'],
                    description: row['Description'] || '',
                    youtubeUrl: row['URL'],
                    duration: row['Lecture Duration'] || '',
                    views: row['Views'] || undefined,
                });
            }

            // Update notes link if this row has one
            if (row['Notes link'] && !chapter.notesLink) {
                chapter.notesLink = row['Notes link'];
            }

            // Update hasMindmap if this row has "Yes"
            if (row['__norm_mindmaps']?.toLowerCase() === 'yes' || row['__norm_mindmap']?.toLowerCase() === 'yes') {
                chapter.hasMindmap = true;
            }
        }

        // Calculate totals for each chapter
        for (const chapter of chaptersMap.values()) {
            chapter.videoCount = chapter.lectures.length;
            const totalMinutes = chapter.lectures.reduce(
                (sum, lec) => sum + parseDuration(lec.duration),
                0
            );
            chapter.totalDuration = formatDuration(totalMinutes);
        }

        return Array.from(chaptersMap.values());
    } catch (error) {
        console.error('Error fetching lectures data:', error);
        return [];
    }
}

// Get chapters filtered by class
export async function getChaptersByClass(classNum: '11' | '12'): Promise<Chapter[]> {
    const allChapters = await fetchLecturesData();
    return allChapters.filter(ch => ch.class === classNum);
}

// Get a single chapter by slug
export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
    const allChapters = await fetchLecturesData();
    return allChapters.find(ch => ch.slug === slug) || null;
}

// Get all chapter slugs for static generation
export async function getAllChapterSlugs(): Promise<string[]> {
    const allChapters = await fetchLecturesData();
    return allChapters.map(ch => ch.slug);
}

// Get statistics
export async function getLecturesStats(classNum?: '11' | '12') {
    const allChapters = await fetchLecturesData();
    const chapters = classNum ? allChapters.filter(ch => ch.class === classNum) : allChapters;

    const totalVideos = chapters.reduce((sum, ch) => sum + ch.videoCount, 0);
    const totalMinutes = chapters.reduce((sum, ch) => {
        return sum + ch.lectures.reduce((s, l) => s + parseDuration(l.duration), 0);
    }, 0);

    return {
        chapterCount: chapters.length,
        videoCount: totalVideos,
        totalHours: Math.round(totalMinutes / 60),
        totalDuration: formatDuration(totalMinutes),
    };
}
