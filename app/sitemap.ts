import { MetadataRoute } from 'next';
import { getFlashcardChapters } from './lib/revisionData';

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
        { path: '/chemistry-flashcards', priority: 0.8, changeFrequency: 'weekly' as const },
        { path: '/interactive-periodic-table', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/periodic-trends', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/salt-analysis', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/solubility-product-ksp-calculator', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/the-crucible', priority: 1.0, changeFrequency: 'daily' as const },
    ];

    const staticEntries = staticPages.map((page) => ({
        url: `${BASE_URL}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));

    // Dynamic flashcard chapter pages
    let flashcardChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const chapters = await getFlashcardChapters();
        flashcardChapterEntries = chapters.map((chapter) => ({
            url: `${BASE_URL}/chemistry-flashcards/${chapter.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching flashcard chapters for sitemap:', error);
    }

    // Programmatic SEO: Question Pages
    let questionEntries: MetadataRoute.Sitemap = [];
    try {
        const { getAllSEOQuestions } = await import('./lib/seoData');
        const questions = await getAllSEOQuestions();

        // Add Directory Page
        questionEntries.push({
            url: `${BASE_URL}/chemistry-questions`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        });

        // Add Chapter Index Pages
        const distinctChapters = Array.from(new Set(questions.map(q => q.chapterSlug)));
        distinctChapters.forEach(slug => {
            questionEntries.push({
                url: `${BASE_URL}/chemistry-questions/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            });
        });

        // Add Individual Question Pages
        const specializedEntries = questions.map((q) => ({
            url: `${BASE_URL}/chemistry-questions/${q.chapterSlug}/${q.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));

        questionEntries = [...questionEntries, ...specializedEntries];

    } catch (error) {
        console.error('Error fetching SEO questions for sitemap:', error);
    }

    // Per-chapter Crucible pages — individual URLs for each of the 28 chapters
    let crucibleChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const { getTaxonomy } = await import('./the-crucible/actions');
        const chapters = await getTaxonomy();
        crucibleChapterEntries = chapters.map(ch => ({
            url: `${BASE_URL}/the-crucible/${ch.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error('Error fetching crucible chapters for sitemap:', error);
    }

    return [...staticEntries, ...flashcardChapterEntries, ...crucibleChapterEntries, ...questionEntries];
}

