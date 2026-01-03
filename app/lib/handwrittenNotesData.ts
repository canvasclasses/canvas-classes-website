export interface HandwrittenNote {
    id: string;
    title: string;
    notesUrl: string;
    category: string;
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

export async function fetchHandwrittenNotes(): Promise<HandwrittenNote[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 3600 } });
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: Title, Notes URL, Category

        // Skip header row
        const dataRows = rows.slice(1);

        return dataRows.map((row, index) => {
            const title = row[0] || '';
            const notesUrl = row[1] || '';
            const category = row[2] || 'General chemistry';

            return {
                id: `note-${index + 1}`,
                title,
                notesUrl,
                category
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

// Get stats
export function getNotesStats(notes: HandwrittenNote[]) {
    const total = notes.length;
    const organic = notes.filter(n => n.category.toLowerCase().includes('organic')).length;
    const inorganic = notes.filter(n => n.category.toLowerCase().includes('inorganic')).length;
    const physical = notes.filter(n => n.category.toLowerCase().includes('physical')).length;

    return { total, organic, inorganic, physical };
}
