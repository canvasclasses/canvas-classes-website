// 24-hour caching for chapter question counts to avoid repeated DB queries

const CACHE_KEY = 'chapter_counts_v1';
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export interface ChapterCountsCache {
  version: number;
  lastUpdated: number;
  chapters: {
    [chapterId: string]: {
      total: number;
      main: number;
      adv: number;
      nonPyq: number;
      starCount: number;
      timestamp: number;
    };
  };
}

export function getCachedChapterCounts(): ChapterCountsCache | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const data: ChapterCountsCache = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is expired (>24 hours old)
    if (now - data.lastUpdated > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error reading chapter counts cache:', error);
    return null;
  }
}

export function setCachedChapterCounts(data: ChapterCountsCache): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving chapter counts cache:', error);
  }
}

export function clearChapterCountsCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error clearing chapter counts cache:', error);
  }
}

export function isCacheValid(chapterId: string): boolean {
  const cache = getCachedChapterCounts();
  if (!cache) return false;
  
  const chapterData = cache.chapters[chapterId];
  if (!chapterData) return false;
  
  const now = Date.now();
  return now - chapterData.timestamp < CACHE_DURATION_MS;
}
