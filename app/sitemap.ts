import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://canvas-classes-website.vercel.app';

    // Static pages
    const staticPages = [
        { path: '/', priority: 1.0, changeFrequency: 'weekly' as const },
        { path: '/detailed-lectures', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/quick-recap', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/top-50-concepts', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/2-minute-chemistry', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/ncert-solutions', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/cbse-12-ncert-revision', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/handwritten-notes', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/organic-name-reactions', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/assertion-reason', priority: 0.8, changeFrequency: 'monthly' as const },
        { path: '/sample-papers', priority: 0.7, changeFrequency: 'monthly' as const },
    ];

    return staticPages.map((page) => ({
        url: `${baseUrl}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));
}
