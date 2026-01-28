// Top 50 Concepts data types and CSV fetcher

export interface Concept {
    id: number;
    videoNumber: number;
    title: string;
    youtubeUrl: string;
    views: string;
    thumbnailUrl: string;
    category: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vROr0CSkT819WUG7aHXg6d4b3Z3ssffDfY2dIaz6XvTze7AnNLTH8KW_l8Zboh3dDFH1FVd1gG8QjV9/pub?output=csv';

// Categories based on content keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Organic Chemistry': ['organic', 'amines', 'polymers', 'phenol', 'glucose', 'amino acids', 'alkyl halides', 'sn1', 'sn2', 'chromatography', 'biomolecules', 'enzymes'],
    'Inorganic Chemistry': ['p block', 'metallurgy', 'ores', 'extraction', 'ellingham', 'disproportionation', 'thermal decomposition', 'hydrogen', 'oxides', 'complexes', 'carbonyls'],
    'Physical Chemistry': ['electrochemistry', 'nernst', 'faraday', 'conductance', 'thermodynamics', 'adsorption', 'kinetics', 'solutions', 'colligative', 'vapour pressure', 'concentration', 'photoelectric', 'bohr'],
    'Environmental': ['environmental', 'drugs', 'vitamins', 'hardness of water'],
    'General Chemistry': ['crystal', 'bonding', 'hybridisation', 'paramagnetic', 'lassaigne', 'nodes', 'h-bonding'],
};

function categorizeVideo(title: string): string {
    const lowerTitle = title.toLowerCase();

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some(keyword => lowerTitle.includes(keyword))) {
            return category;
        }
    }
    return 'General Chemistry';
}

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

// Extract YouTube video ID from URL
function getYoutubeId(url: string): string | null {
    let match = url.match(/youtube\.com\/watch\?v=([-\w]+)/);
    if (match) return match[1];

    match = url.match(/youtu\.be\/([-\w]+)/);
    if (match) return match[1];

    match = url.match(/youtube\.com\/live\/([-\w]+)/);
    if (match) return match[1];

    return null;
}

// Fetch and parse Top 50 Concepts data
export async function fetchTop50Data(): Promise<Concept[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length < 2) return [];

        const concepts: Concept[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const [videoNumber, title, url, views] = values;

            if (!title || !url) continue;

            const videoId = getYoutubeId(url);

            concepts.push({
                id: i,
                videoNumber: parseInt(videoNumber, 10) || i,
                title: title,
                youtubeUrl: url,
                views: views || '0',
                thumbnailUrl: videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : '/placeholder-video.jpg',
                category: categorizeVideo(title),
            });
        }

        return concepts;
    } catch (error) {
        console.error('Error fetching Top 50 Concepts data:', error);
        return [];
    }
}

// Get stats
export async function getTop50Stats() {
    const concepts = await fetchTop50Data();
    const categories = [...new Set(concepts.map(c => c.category))];
    const totalViews = concepts.reduce((sum, c) => {
        const viewNum = parseInt(c.views.replace(/[^\d]/g, ''), 10) || 0;
        return sum + viewNum;
    }, 0);

    return {
        totalConcepts: concepts.length,
        totalCategories: categories.length,
        totalViews: totalViews,
    };
}
