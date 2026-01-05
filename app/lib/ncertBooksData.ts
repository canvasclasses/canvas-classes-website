// NCERT Books Data - Fetches from Google Sheet CSV

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSHZEaRQS05LJ1DUkUOgaUSRdcMJG8ocpVxkwH1C883xmENL_axHGtCGRMR6nS9pOVmN5XwrI-YGurX/pub?output=csv';

// Helper to convert Google Drive view URLs to preview URLs for iframe embedding
function convertDriveUrl(url: string): string {
    if (!url) return '';
    // Convert /view?... to /preview for iframe embedding
    return url.replace('/view?usp=drive_link', '/preview').replace('/view', '/preview');
}

export interface NcertChapter {
    id: string;
    title: string;
    pdfUrl: string;
    classNum: '11' | '12';
    category: 'textbook' | 'exemplar' | 'lab-manual';
}

export interface NcertBooksData {
    textbooks11: NcertChapter[];
    textbooks12: NcertChapter[];
    exemplars11: NcertChapter[];
    exemplars12: NcertChapter[];
    labManuals11: NcertChapter[];
    labManuals12: NcertChapter[];
}

// Helper function to parse CSV robustly (handling quoted fields)
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
            if (row.some(cell => cell.length > 0)) { // Only add non-empty rows
                result.push(row);
            }
            row = [];
            current = '';
        } else {
            current += char;
        }
    }
    // Handle last row if file doesn't end with newline
    if (current || row.length > 0) {
        row.push(current.trim());
        if (row.some(cell => cell.length > 0)) {
            result.push(row);
        }
    }
    return result;
}

export async function fetchNcertBooksData(): Promise<NcertBooksData> {
    const data: NcertBooksData = {
        textbooks11: [],
        textbooks12: [],
        exemplars11: [],
        exemplars12: [],
        labManuals11: [],
        labManuals12: [],
    };

    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 3600 } }); // Cache for 1 hour
        const csvText = await response.text();
        const rows = parseCSVRobust(csvText);

        // Skip header row
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 7) continue;

            // Columns: Id(0), Class(1), Title(2), Textbook_url(3), Exemplar_url(4), Lab_Manual_Title(5), Lab_Manual_url(6)
            const id = row[0];
            const classNum = row[1];
            const title = row[2];
            const textbookUrl = row[3];
            const exemplarUrl = row[4];
            const labManualTitle = row[5];
            const labManualUrl = row[6];

            const classKey = classNum === '11' ? '11' : '12';

            // Create Textbook entry if URL exists
            if (textbookUrl && textbookUrl.length > 0) {
                const chapter: NcertChapter = {
                    id: `tb-${id}`,
                    title: title.replace(/^Class \d+ NCERT - /, ''), // Clean up title
                    pdfUrl: convertDriveUrl(textbookUrl),
                    classNum: classKey as '11' | '12',
                    category: 'textbook',
                };
                if (classKey === '11') {
                    data.textbooks11.push(chapter);
                } else {
                    data.textbooks12.push(chapter);
                }
            }

            // Create Exemplar entry if URL exists
            if (exemplarUrl && exemplarUrl.length > 0) {
                const chapter: NcertChapter = {
                    id: `ex-${id}`,
                    title: title.replace(/^Class \d+ NCERT - /, ''),
                    pdfUrl: convertDriveUrl(exemplarUrl),
                    classNum: classKey as '11' | '12',
                    category: 'exemplar',
                };
                if (classKey === '11') {
                    data.exemplars11.push(chapter);
                } else {
                    data.exemplars12.push(chapter);
                }
            }

            // Create Lab Manual entry if URL exists
            if (labManualUrl && labManualUrl.length > 0) {
                // Clean up title: remove "Unit X -" prefix
                const cleanTitle = labManualTitle
                    ? labManualTitle.replace(/^Unit \d+ -\s*/, '').trim()
                    : title.replace(/^Class \d+ NCERT - /, '');

                const chapter: NcertChapter = {
                    id: `lab-${id}`,
                    title: cleanTitle,
                    pdfUrl: convertDriveUrl(labManualUrl),
                    classNum: classKey as '11' | '12',
                    category: 'lab-manual',
                };
                if (classKey === '11') {
                    data.labManuals11.push(chapter);
                } else {
                    data.labManuals12.push(chapter);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching NCERT books data:', error);
    }

    return data;
}

// Helper to get chapters filtered by class and category
export function getChapters(
    data: NcertBooksData,
    classNum: '11' | '12',
    category: 'textbook' | 'exemplar' | 'lab-manual'
): NcertChapter[] {
    const key = `${category === 'textbook' ? 'textbooks' : category === 'exemplar' ? 'exemplars' : 'labManuals'}${classNum}` as keyof NcertBooksData;
    return data[key];
}
