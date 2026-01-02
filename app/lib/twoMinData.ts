// 2 Minute Chemistry data types and CSV fetcher

export interface ShortVideo {
    id: number;
    title: string;
    youtubeUrl: string;
    duration: string;
    durationSeconds: number;
    views: number;
    thumbnailUrl: string;
    category: string;
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vThgZGMFWP_8HqLKAbC1sMW_hXGcTpU8WRI1duq2RXfjuGawsMh8w4P3RpgD9tfe9iJg1l0xfMnV1PS/pub?output=csv';

// Categories based on content keywords
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    'Organic Chemistry': ['organic', 'aldol', 'cannizzaro', 'benzoin', 'birch', 'sn1', 'sn2', 'sni', 'carbocation', 'electrophile', 'aromatic', 'tautomerism', 'polymer', 'amine', 'acetanilide', 'carbohydrate', 'enol', 'keto'],
    'Inorganic Chemistry': ['periodic', 'metallurgy', 'ore', 'alloy', 'thermal decomposition', 'd block', 'f block', 'copper', 'kmno4', 'sulphide'],
    'Physical Chemistry': ['entropy', 'clausius', 'wave function', 'pka', 'vant hoff', 'srp'],
    'Name Reactions': ['arndt', 'baeyer', 'beckmann', 'benzilic', 'rearrangement', 'oxidation', 'reduction', 'synthesis', 'condensation'],
    'Lab & Practical': ['lab', 'ncert', 'purification', 'litmus', 'hardness', 'dye', 'claisen'],
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
    // Handle youtube.com/watch?v=ID
    let match = url.match(/youtube\.com\/watch\?v=([-\w]+)/);
    if (match) return match[1];

    // Handle youtu.be/ID
    match = url.match(/youtu\.be\/([-\w]+)/);
    if (match) return match[1];

    // Handle youtube.com/shorts/ID
    match = url.match(/youtube\.com\/shorts\/([-\w]+)/);
    if (match) return match[1];

    return null;
}

// Parse duration string (mm:ss or h:mm:ss) to seconds
function parseDuration(duration: string): number {
    if (!duration) return 0;
    const parts = duration.split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
}

// Format seconds to readable duration
function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Fetch and parse 2 Minute Chemistry data
export async function fetch2MinData(): Promise<ShortVideo[]> {
    try {
        const response = await fetch(CSV_URL, { next: { revalidate: 3600 } });
        const csvText = await response.text();
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length < 2) return [];

        const videos: ShortVideo[] = [];

        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            const [title, url, duration, views] = values;

            if (!title || !url) continue;

            const videoId = getYoutubeId(url);
            const durationSeconds = parseDuration(duration);

            videos.push({
                id: i,
                title: title.replace(/\s*#\s*$/, '').trim(), // Remove trailing # symbols
                youtubeUrl: url,
                duration: formatDuration(durationSeconds),
                durationSeconds,
                views: parseInt(views?.replace(/[^\d]/g, '') || '0', 10),
                thumbnailUrl: videoId
                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                    : '/placeholder-video.jpg',
                category: categorizeVideo(title),
            });
        }

        return videos;
    } catch (error) {
        console.error('Error fetching 2 Minute Chemistry data:', error);
        return [];
    }
}

// Get stats
export async function get2MinStats() {
    const videos = await fetch2MinData();
    const categories = [...new Set(videos.map(v => v.category))];
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    const avgDuration = videos.length > 0
        ? Math.round(videos.reduce((sum, v) => sum + v.durationSeconds, 0) / videos.length)
        : 0;

    return {
        totalVideos: videos.length,
        totalCategories: categories.length,
        totalViews: Math.round(totalViews / 1000), // in K
        avgDuration,
    };
}
