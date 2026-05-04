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
    { keywords: /electrochemistry|electrolysis|faraday|nernst|galvanic|kohlrausch/i, chapter: 'Electrochemistry' },
    { keywords: /\bsolutions\b|colligative|raoult|osmotic|van.?t hoff/i, chapter: 'Solutions' },
    { keywords: /chemical kinetics|kinetics|rate law|half.?life|arrhenius/i, chapter: 'Chemical Kinetics' },
    { keywords: /metallurgy|ores?|smelting|refining|ellingham/i, chapter: 'Metallurgy' },
    { keywords: /environmental chemistry|pollution|smog|ozone depletion/i, chapter: 'Environmental Chemistry' },
    { keywords: /states? of matter|kinetic theory|gas law|ideal gas|van der waals/i, chapter: 'States of Matter' },
    { keywords: /aromatic|benzene|electrophilic substitution|\bEAS\b/i, chapter: 'Aromatic Compounds' },
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

// ── Static notes — added directly in code, not via the Google Sheet ──────────
// Use addedOrder 99999 so they sort to the top under "Newest".
const STATIC_NOTES: HandwrittenNote[] = [
    {
        id: 'static-surface-chemistry-short',
        title: 'Surface Chemistry — Short Revision Notes',
        notesUrl: 'https://drive.google.com/file/d/1mHT8skp9opz-idhha6eboLkgNa4o_8W6/view',
        category: 'Physical Chemistry',
        chapter: 'Surface Chemistry',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1mHT8skp9opz-idhha6eboLkgNa4o_8W6&sz=w480',
        addedOrder: 99999,
    },
    {
        id: 'static-everyday-life-notes',
        title: 'Chemistry in Everyday Life Notes',
        notesUrl: 'https://drive.google.com/file/d/1mCmQeRceffKaLWELnSmlT2bpg2qQzaKd/view',
        category: 'Organic Chemistry',
        chapter: 'Biomolecules & Polymers',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1mCmQeRceffKaLWELnSmlT2bpg2qQzaKd&sz=w480',
        addedOrder: 99998,
    },
    {
        id: 'static-electrochemistry-notes',
        title: 'Electrochemistry Notes',
        notesUrl: 'https://drive.google.com/file/d/1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj/view',
        category: 'Physical Chemistry',
        chapter: 'Electrochemistry',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj&sz=w480',
        addedOrder: 99997,
    },
    {
        id: 'static-solutions-notes',
        title: 'Solutions Notes',
        notesUrl: 'https://drive.google.com/file/d/1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7/view',
        category: 'Physical Chemistry',
        chapter: 'Solutions',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7&sz=w480',
        addedOrder: 99996,
    },
    {
        id: 'static-kinetics-notes',
        title: 'Chemical Kinetics Notes',
        notesUrl: 'https://drive.google.com/file/d/10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z/view',
        category: 'Physical Chemistry',
        chapter: 'Chemical Kinetics',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z&sz=w480',
        addedOrder: 99995,
    },
    {
        id: 'static-metallurgy-notes',
        title: 'Metallurgy Notes',
        notesUrl: 'https://drive.google.com/file/d/18QSAqxCor5xibarUu1askEeVfThudu3e/view',
        category: 'Inorganic Chemistry',
        chapter: 'Metallurgy',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=18QSAqxCor5xibarUu1askEeVfThudu3e&sz=w480',
        addedOrder: 99994,
    },
    {
        id: 'static-environmental-chemistry-notes',
        title: 'Environmental Chemistry Notes',
        notesUrl: 'https://drive.google.com/file/d/1QqRBpk9oZY0mrcC36gQ6N2ChYZWTPof1/view',
        category: 'Inorganic Chemistry',
        chapter: 'Environmental Chemistry',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1QqRBpk9oZY0mrcC36gQ6N2ChYZWTPof1&sz=w480',
        addedOrder: 99993,
    },
    {
        id: 'static-amines-quick-notes',
        title: 'Amines Quick Notes',
        notesUrl: 'https://drive.google.com/file/d/1FjamUxwaq9S3or2Twh6_kKUgm9Gr0OhS/view',
        category: 'Organic Chemistry',
        chapter: 'Amines',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1FjamUxwaq9S3or2Twh6_kKUgm9Gr0OhS&sz=w480',
        addedOrder: 99990,
    },
    {
        id: 'static-aromatic-compounds-notes',
        title: 'Aromatic Compounds Notes',
        notesUrl: 'https://drive.google.com/file/d/1D3vi4xDTEbHmTR1cq16mYM4Ropu1n7AR/view',
        category: 'Organic Chemistry',
        chapter: 'Aromatic Compounds',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1D3vi4xDTEbHmTR1cq16mYM4Ropu1n7AR&sz=w480',
        addedOrder: 99991,
    },
    {
        id: 'static-states-of-matter-notes',
        title: 'States of Matter Notes',
        notesUrl: 'https://drive.google.com/file/d/1izBYnungBmwEZndprnLpYMdyY2YTclUO/view',
        category: 'Physical Chemistry',
        chapter: 'States of Matter',
        thumbnailUrl: 'https://drive.google.com/thumbnail?id=1izBYnungBmwEZndprnLpYMdyY2YTclUO&sz=w480',
        addedOrder: 99992,
    },
];

export async function fetchHandwrittenNotes(): Promise<HandwrittenNote[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: Title, Notes URL, Category

        // Skip header row
        const dataRows = rows.slice(1);
        const total = dataRows.length;

        const sheetNotes = dataRows.map((row, index) => {
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

        // Merge static notes first so they appear at the top under "Newest"
        return [...STATIC_NOTES, ...sheetNotes];
    } catch (error) {
        console.error('Error fetching handwritten notes:', error);
        // Return static notes as fallback if the sheet is unreachable
        return STATIC_NOTES;
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
