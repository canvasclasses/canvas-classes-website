// Quick Recap data types and CSV fetcher

export interface QuickRecapVideo {
    id: number;
    title: string;
    youtubeUrl: string;
    duration: string;
    durationMinutes: number;
    category: string;
    thumbnailUrl: string;
    priority: number;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOzbYnvX5cXE3VK9CDn7V4X0HAGW8SjoFLPY8d1crPiyjBMg5s0WETprPPQobkJXHypMuSnbn-P_dv/pub?output=csv';

// Categories based on content keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Organic Chemistry': ['organic', 'amines', 'polymers', 'biomolecules', 'haloalkanes', 'grignard', 'aromatic', 'goc', 'electrophiles', 'nucleophiles', 'elimination'],
    'Inorganic Chemistry': ['coordination', 's block', 'p block', 'metallurgy', 'noble gases', 'diborane', 'hydrogen', 'aluminium', 'thermal decomposition'],
    'Physical Chemistry': ['thermodynamics', 'thermochemistry', 'equilibrium', 'solutions', 'kinetics', 'electrochemistry', 'mole concept', 'atomic structure', 'formulas'],
    'Environmental': ['environmental', 'everyday life'],
    'General Chemistry': ['periodic', 'chemical bonding', 'structures'],
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

// Extract YouTube video ID from URL - handles various formats including live streams
function getYoutubeId(url: string): string | null {
    // Handle youtube.com/watch?v=ID
    let match = url.match(/youtube\.com\/watch\?v=([-\w]+)/);
    if (match) return match[1];

    // Handle youtu.be/ID
    match = url.match(/youtu\.be\/([-\w]+)/);
    if (match) return match[1];

    // Handle youtube.com/live/ID
    match = url.match(/youtube\.com\/live\/([-\w]+)/);
    if (match) return match[1];

    return null;
}

// Parse duration string to minutes
function parseDuration(duration: string): number {
    const match = duration.match(/(\d+)m?/);
    return match ? parseInt(match[1], 10) : 0;
}

// Fetch and parse Quick Recap data
export async function fetchQuickRecapData(): Promise<QuickRecapVideo[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 86400 } }); // 24 hours
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length < 2) return [];

        // Skip header row
        const videos: QuickRecapVideo[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            // Sheet columns: ID, Title, Priority, Category, URL, Duration
            const [idStr, title, priorityStr, category, url, duration] = values;

            if (!title || !url) continue;

            const videoId = getYoutubeId(url);
            const priority = parseInt(priorityStr, 10) || 999;
            // Use category from sheet, fallback to auto-categorization
            const videoCategory = category?.trim() || categorizeVideo(title);

            videos.push({
                id: parseInt(idStr, 10) || i,
                title: title.trim(),
                youtubeUrl: url.trim(),
                duration: duration?.trim() || '',
                durationMinutes: parseDuration(duration || '0'),
                category: videoCategory,
                thumbnailUrl: videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : '/placeholder-video.jpg',
                priority: priority,
            });
        }

        // Sort by priority (1 = highest, shown first)
        videos.sort((a, b) => a.priority - b.priority);

        return videos;
    } catch (error) {
        console.error('Error fetching Quick Recap data:', error);
        return [];
    }
}

// Get unique categories
export async function getCategories(): Promise<string[]> {
    const videos = await fetchQuickRecapData();
    const categories = [...new Set(videos.map(v => v.category))];
    return categories.sort();
}

// Get stats
export async function getQuickRecapStats() {
    const videos = await fetchQuickRecapData();
    const categories = [...new Set(videos.map(v => v.category))];

    return {
        totalVideos: videos.length,
        totalCategories: categories.length,
        totalMinutes: videos.reduce((sum, v) => sum + v.durationMinutes, 0),
    };
}
