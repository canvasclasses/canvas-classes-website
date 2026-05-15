export interface OrganicReaction {
    id: string;
    classNum: number;
    reactionName: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard';
    reactionType: string;
    mechanismDetails: string;
    summary: string;
    isActive: boolean;
    imageUrl: string;
    imageUrl2: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQt0C9TmgzGjxeHEgSt7BKKmGO32NObfCE0M8fwLDkPUT4whaq8zZvhU58MA-cYSDMUY4jiN0rpmgWI/pub?output=csv';

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

export async function fetchOrganicReactions(): Promise<OrganicReaction[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const text = await response.text();

        const rows = parseCSVRobust(text);
        // Header: File Name, Github url, ID, Class, Reaction Name, Difficulty, Reaction Type, Mechanism & Key Details, Summary, Is_active, Image Url, Image Url 2
        // Index:    0          1         2     3           4           5            6                    7                  8         9          10          11

        // Skip header row
        const dataRows = rows.slice(1);

        return dataRows
            .map(row => {
                const id = row[2] || '';
                const classNum = parseInt(row[3] || '12');
                const reactionName = row[4] || '';
                const difficulty = (row[5] || 'Easy') as 'Easy' | 'Moderate' | 'Hard';
                const reactionType = row[6] || '';
                const mechanismDetails = row[7] || '';
                const summary = row[8] || '';
                const isActive = (row[9] || '').toLowerCase() === 'yes';
                const imageUrl = row[10] || '';
                const imageUrl2 = row[11] || '';

                return {
                    id,
                    classNum,
                    reactionName,
                    difficulty,
                    reactionType,
                    mechanismDetails,
                    summary,
                    isActive,
                    imageUrl,
                    imageUrl2
                };
            })
            .filter(item => item.reactionName && item.isActive); // Only active reactions with names
    } catch (error) {
        console.error('Error fetching organic reactions:', error);
        return [];
    }
}

// Get unique reaction types for filtering
export function getUniqueReactionTypes(reactions: OrganicReaction[]): string[] {
    return Array.from(new Set(reactions.map(r => r.reactionType).filter(Boolean))).sort();
}

// Get statistics
export function getReactionStats(reactions: OrganicReaction[]) {
    const total = reactions.length;
    const class11 = reactions.filter(r => r.classNum === 11).length;
    const class12 = reactions.filter(r => r.classNum === 12).length;
    const uniqueTypes = new Set(reactions.map(r => r.reactionType).filter(Boolean)).size;

    return { total, class11, class12, uniqueTypes };
}
