import { MetadataRoute } from 'next';
import { getFlashcardChapters } from './lib/revisionData';

const BASE_URL = 'https://www.canvasclasses.in';

// Cache sitemap for 24 hours — question/chapter data changes infrequently
export const revalidate = 86400;

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
        { path: '/bitsat-chemistry-revision', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/college-predictor', priority: 1.0, changeFrequency: 'daily' as const },
        // Live Books landing pages (grade hubs)
        { path: '/class-9', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/class-11', priority: 0.9, changeFrequency: 'weekly' as const },
    ];

    // College Predictor programmatic landing pages (regional + type)
    const { LANDING_CONFIGS } = await import('./college-predictor/[slug]/landingConfig');
    const collegePredictorLandingEntries = LANDING_CONFIGS.map((cfg) => ({
        url: `${BASE_URL}/college-predictor/${cfg.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

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

    // Crucible individual question pages (UUID-based canonical URLs)
    let crucibleQuestionEntries: MetadataRoute.Sitemap = [];
    try {
        const { getAllPublishedPYQSlugs } = await import('./the-crucible/actions');
        const pyqSlugs = await getAllPublishedPYQSlugs();
        crucibleQuestionEntries = pyqSlugs.map(q => ({
            url: `${BASE_URL}/the-crucible/q/${q.id}`,
            lastModified: new Date(q.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.75,
        }));
    } catch (error) {
        console.error('Error fetching crucible question slugs for sitemap:', error);
    }

    // ── Live Books: every published page for every published chapter ──
    //
    // This is the SEO lifeline for Class 9 — the NCERT new-syllabus pages
    // are searched heavily right now, and they won't be indexed at all
    // until they appear in the sitemap.
    //
    // We canonicalise Class 9 URLs under /class-9/... to match the 301
    // redirect in middleware.ts — never emit both /books/class9-* and
    // /class-9/* for the same page.
    let bookPageEntries: MetadataRoute.Sitemap = [];
    try {
        const connectToDatabase = (await import('@/lib/mongodb')).default;
        const BookModel = (await import('@/lib/models/Book')).default;
        const BookPageModel = (await import('@/lib/models/BookPage')).default;
        await connectToDatabase();

        const books = await BookModel
            .find({ is_published: true })
            .select('_id slug grade chapters updated_at')
            .lean();

        // Map book_id → { bookSlug, grade, publishedChapterNums, updatedAt }
        const bookMeta = new Map<string, { slug: string; grade: number; chapters: Set<number>; updatedAt: Date }>();
        for (const b of books) {
            bookMeta.set(String(b._id), {
                slug: String(b.slug),
                grade: Number(b.grade),
                chapters: new Set(b.chapters.filter(c => c.is_published).map(c => c.number)),
                updatedAt: b.updated_at instanceof Date ? b.updated_at : new Date(b.updated_at),
            });
        }

        // Per-book landing (grade-hub route) — only for grades we actively route
        const gradeBases = new Map<number, string>([[9, '/class-9'], [11, '/class-11']]);

        // Add per-book chapter-hub landings (one per published book)
        for (const [, meta] of bookMeta) {
            const base = gradeBases.get(meta.grade) ?? '/books';
            // /class-9/[bookSlug] redirects to /class-9 — skip to avoid duplicate.
            // /books/[bookSlug] renders a book ToC — include it.
            if (base === '/books') {
                bookPageEntries.push({
                    url: `${BASE_URL}${base}/${meta.slug}`,
                    lastModified: meta.updatedAt,
                    changeFrequency: 'weekly' as const,
                    priority: 0.8,
                });
            }
        }

        // Pages — only from published chapters of published books
        const bookIds = Array.from(bookMeta.keys());
        const pages = bookIds.length === 0
            ? []
            : await BookPageModel
                .find({ book_id: { $in: bookIds }, published: true })
                .select('book_id slug chapter_number updated_at')
                .limit(5000)
                .lean();

        for (const p of pages) {
            const meta = bookMeta.get(String(p.book_id));
            if (!meta) continue;
            if (!meta.chapters.has(p.chapter_number)) continue; // chapter not published
            const base = gradeBases.get(meta.grade) ?? '/books';
            const lastMod = p.updated_at instanceof Date ? p.updated_at : new Date(p.updated_at);
            bookPageEntries.push({
                url: `${BASE_URL}${base}/${meta.slug}/${p.slug}`,
                lastModified: lastMod,
                // Class 9 NCERT pages are the hot target right now — bias priority up.
                changeFrequency: meta.grade === 9 ? 'weekly' as const : 'monthly' as const,
                priority: meta.grade === 9 ? 0.9 : 0.7,
            });
        }
    } catch (error) {
        console.error('Error fetching book pages for sitemap:', error);
    }

    return [
        ...staticEntries,
        ...collegePredictorLandingEntries,
        ...flashcardChapterEntries,
        ...crucibleChapterEntries,
        ...questionEntries,
        ...crucibleQuestionEntries,
        ...bookPageEntries,
    ];
}

