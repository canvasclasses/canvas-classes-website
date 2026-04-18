export interface HandwrittenNote {
    id: string;
    title: string;
    notesUrl: string;
    category: string;
    chapter: string;
    thumbnailUrl: string | null;
    addedOrder: number;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQYSeDWjc95SGbSeyU-Ap2fvga7DpQdxDPTXnyGKtvLrtDOB-34WsatAwiORiHojy1trdIkKreA6Cyc/pub?output=csv';

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
            row.push(current.trim());
            current = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
            row.push(current.trim());
            if (row.some(cell => cell.length > 0)) {
                result.push(row);
            }
            row = [];
            current = '';
        } else {
            current += char;
        }
    }
    if (current || row.length > 0) {
        row.push(current.trim());
        if (row.some(cell => cell.length > 0)) {
            result.push(row);
        }
    }
    return result;
}

// Extract Google Drive file ID from various URL formats
function extractDriveFileId(url: string): string | null {
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /[?&]id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/,
    ];
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }
    return null;
}

// Build Google Drive thumbnail URL — real PDF cover, no fabricated data
function getDriveThumbnail(url: string): string | null {
    const id = extractDriveFileId(url);
    if (!id) return null;
    return `https://drive.google.com/thumbnail?id=${id}&sz=w480`;
}

// Chapter classification — keyword matching against note title
// Order matters: more specific patterns first.
const CHAPTER_RULES: Array<{ keywords: RegExp; chapter: string }> = [
    { keywords: /solid state|crystal|energetics of crystal/i, chapter: 'Solid State' },
    { keywords: /coordination/i, chapter: 'Coordination Compounds' },
    { keywords: /chemical bonding|bonding/i, chapter: 'Chemical Bonding' },
    { keywords: /salt analysis|qualitative/i, chapter: 'Salt Analysis' },
    { keywords: /\bp[\s-]?block\b|structures of p/i, chapter: 'p-Block' },
    { keywords: /\bs[\s-]?block\b/i, chapter: 's-Block' },
    { keywords: /d and f block|d & f block|d-block|f-block/i, chapter: 'd & f Block' },
    { keywords: /periodic propert|periodic table/i, chapter: 'Periodic Properties' },
    { keywords: /atomic structure/i, chapter: 'Atomic Structure' },
    { keywords: /mole concept/i, chapter: 'Mole Concept' },
    { keywords: /hydrogen(?!\s*bond)/i, chapter: 'Hydrogen' },
    { keywords: /amino acid|biomolecule|polymer|carbohydrate|protein/i, chapter: 'Biomolecules & Polymers' },
    { keywords: /name reaction/i, chapter: 'Name Reactions' },
    { keywords: /tautomer/i, chapter: 'GOC & Mechanisms' },
    { keywords: /general organic|\bGOC\b|before goc/i, chapter: 'GOC & Mechanisms' },
    { keywords: /practical|chromatography|preparation of organic/i, chapter: 'Practical Chemistry' },
    { keywords: /free radical|haloalkane|alkyl halide|hydrocarbon/i, chapter: 'Hydrocarbons & Halides' },
    { keywords: /surface chemistry/i, chapter: 'Surface Chemistry' },
    { keywords: /solubility|ionic equilib|equilibrium/i, chapter: 'Ionic Equilibrium' },
    { keywords: /11th physical|12th physical|physical chemistry revision/i, chapter: 'Physical Chemistry Revision' },
    { keywords: /colour|color/i, chapter: 'Inorganic Trivia' },
    { keywords: /problem|advanced chemistry|pyq/i, chapter: 'Problem Sets & PYQs' },
    { keywords: /important topic|50 most|index/i, chapter: 'Strategy & Index' },
    { keywords: /multiple source|collection of notes on organic/i, chapter: 'Mixed Organic' },
];

function classifyChapter(title: string): string {
    for (const rule of CHAPTER_RULES) {
        if (rule.keywords.test(title)) return rule.chapter;
    }
    return 'Other';
}

export async function fetchHandwrittenNotes(): Promise<HandwrittenNote[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: Title, Notes URL, Category

        // Skip header row
        const dataRows = rows.slice(1);
        const total = dataRows.length;

        return dataRows.map((row, index) => {
            const title = row[0] || '';
            const notesUrl = row[1] || '';
            const category = row[2] || 'General chemistry';

            return {
                id: `note-${index + 1}`,
                title,
                notesUrl,
                category,
                chapter: classifyChapter(title),
                thumbnailUrl: getDriveThumbnail(notesUrl),
                // Higher addedOrder = more recently added (last spreadsheet row first).
                addedOrder: total - index,
            };
        }).filter(note => note.title && note.notesUrl); // Filter out empty entries
    } catch (error) {
        console.error('Error fetching handwritten notes:', error);
        return [];
    }
}

// Get unique categories for filtering
export function getUniqueCategories(notes: HandwrittenNote[]): string[] {
    return Array.from(new Set(notes.map(n => n.category).filter(Boolean))).sort();
}

// Exact-match counts — fixes the bug where "organic".includes() also matched "inorganic".
export function getNotesStats(notes: HandwrittenNote[]) {
    const total = notes.length;
    const organic = notes.filter(n => n.category === 'Organic Chemistry').length;
    const inorganic = notes.filter(n => n.category === 'Inorganic Chemistry').length;
    const physical = notes.filter(n => n.category === 'Physical Chemistry').length;
    const general = notes.filter(n => n.category === 'General chemistry').length;

    return { total, organic, inorganic, physical, general };
}
