import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.canvasclasses.in';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/detailed-lectures', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/cbse-12-ncert-revision', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/cbse-class-10', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/cbse-class-11', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/cbse-class-12', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/ncert-solutions', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/neet-crash-course', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/download-ncert-books', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/handwritten-notes', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/quick-recap', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/2-minute-chemistry', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/organic-name-reactions', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/assertion-reason', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/top-50-concepts', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/flashcards', priority: 0.8, changeFrequency: 'weekly' as const },
    ];

    return staticPages.map((page) => ({
        url: `${BASE_URL}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
