export interface NeetLecture {
    id: string;
    title: string;
    description?: string;
    concepts?: string; // New field for concepts
    youtubeId: string;
    duration?: string;
}

export interface NeetChapter {
    id: string;
    slug: string;
    title: string;
    classNum: '11' | '12';
    description: string;
    lectures: NeetLecture[];
    dppPdfUrl: string;
    dppSolutions: NeetLecture[];
    chapterNotesUrl?: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKCXCEOs_rdnejOzJPmKOBREqK8Rp-S2Nu26e27XZBAsPDh47mEDKXRXasA3h7Z3TlTokYsK-MAloH/pub?output=csv';

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getYoutubeId(url: string): string {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : '';
}

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

export async function fetchNeetCrashCourseData(): Promise<NeetChapter[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 60 } });
        const text = await response.text();
        const rows = parseCSVRobust(text);

        const dataRows = rows.slice(1);
        const chaptersMap = new Map<string, NeetChapter>();

        let lastClass = '11';
        let lastChapterName = '';

        dataRows.forEach(row => {
            // Updated CSV Columns:
            // 0: ID
            // 1: Class
            // 2: Chapter_Name
            // 3: Lecture_Number
            // 4: Lecture_Title
            // 5: Lecture_URL
            // 6: Lecture_Duration
            // 7: Concepts_covered (New)
            // 8: Chapter_DPP_URL
            // 9: DPP_Solution_Title
            // 10: DPP_Solutions (URL)
            // 11: DPP_video_Duration
            // 12: Chapter_Notes

            const currentClass = row[1]?.trim() || lastClass;
            const currentChapterName = row[2]?.trim() || lastChapterName;

            if (row[1]?.trim()) lastClass = currentClass;
            if (row[2]?.trim()) lastChapterName = currentChapterName;

            if (!currentChapterName) return;

            const slug = generateSlug(currentChapterName);

            if (!chaptersMap.has(slug)) {
                chaptersMap.set(slug, {
                    id: slug,
                    slug,
                    title: currentChapterName,
                    classNum: currentClass as '11' | '12',
                    description: `Complete revision for ${currentChapterName}`,
                    lectures: [],
                    dppPdfUrl: '',
                    dppSolutions: []
                });
            }

            const chapter = chaptersMap.get(slug)!;

            // 1. Parse Lecture
            const lecTitle = row[4]?.trim();
            const lecUrl = row[5]?.trim();
            if (lecTitle && lecUrl) {
                const youtubeId = getYoutubeId(lecUrl);
                const exists = chapter.lectures.some(l => l.youtubeId === youtubeId);
                if (!exists) {
                    chapter.lectures.push({
                        id: row[3]?.trim() || `${chapter.lectures.length + 1}`, // Use Number as ID for display
                        title: lecTitle,
                        youtubeId: youtubeId,
                        duration: row[6]?.trim() || '',
                        concepts: row[7]?.trim() || '' // Parse concepts
                    });
                }
            }

            // 2. Parse DPP PDF
            const dppUrl = row[8]?.trim(); // Index 8
            if (dppUrl && !chapter.dppPdfUrl) {
                let finalUrl = dppUrl;
                if (dppUrl.includes('drive.google.com') && dppUrl.includes('/view')) {
                    finalUrl = dppUrl.replace('/view', '/preview');
                }
                chapter.dppPdfUrl = finalUrl;
            }

            // 3. Parse DPP Solution
            const dppSolTitle = row[9]?.trim(); // Index 9
            const dppSolUrl = row[10]?.trim(); // Index 10
            const dppSolDuration = row[11]?.trim(); // Index 11

            if (dppSolUrl) {
                const solId = getYoutubeId(dppSolUrl);
                if (solId && !chapter.dppSolutions.some(s => s.youtubeId === solId)) {
                    chapter.dppSolutions.push({
                        id: `sol-${chapter.dppSolutions.length + 1}`,
                        title: dppSolTitle || `${currentChapterName} - DPP Solution`,
                        youtubeId: solId,
                        duration: dppSolDuration || ''
                    });
                }
            }

            // 4. Parse Chapter Notes
            const notesUrl = row[12]?.trim(); // Index 12
            if (notesUrl && !chapter.chapterNotesUrl) {
                let finalUrl = notesUrl;
                if (notesUrl.includes('drive.google.com') && notesUrl.includes('/view')) {
                    finalUrl = notesUrl.replace('/view', '/preview');
                }
                chapter.chapterNotesUrl = finalUrl;
            }
        });

        return Array.from(chaptersMap.values());

    } catch (error) {
        console.error('Error fetching NEET data:', error);
        return [];
    }
}

export const neetCrashCourseData: NeetChapter[] = [];

export async function getNeetChapter(slug: string): Promise<NeetChapter | undefined> {
    const chapters = await fetchNeetCrashCourseData();
    return chapters.find(c => c.slug === slug);
}
