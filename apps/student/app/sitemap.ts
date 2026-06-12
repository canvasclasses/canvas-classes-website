import { MetadataRoute } from 'next';
import { getFlashcardChapters } from '@/features/public-content/data/revisionData';

const BASE_URL = 'https://www.canvasclasses.in';

// Stable `lastModified` for sitemap entries that have NO real per-item content
// timestamp. Using `new Date()` for these was a costly bug: the sitemap itself
// revalidates every 24h (below), so a `new Date()` stamp made *every* such URL
// look "modified today" on every regeneration. That told crawlers to re-fetch
// the entire surface daily, driving millions of needless ISR Writes (the
// 2026-06 Vercel bill). A fixed date removes that false-freshness signal.
// Bump it only on a major site-wide content refresh — genuinely-dynamic blocks
// below (books, careers, crucible questions, blog) already carry their own
// real `updated_at`/`generatedAt` and are unaffected by this constant.
const STABLE_LASTMOD = new Date('2026-06-12');

// Cache sitemap for 24 hours — question/chapter data changes infrequently
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages = [
        { path: '', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/blog', priority: 0.9, changeFrequency: 'daily' as const },
        { path: '/detailed-lectures', priority: 0.9, changeFrequency: 'weekly' as const },
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
        { path: '/chemistry-flashcards', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/interactive-periodic-table', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/periodic-trends', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/salt-analysis', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/solubility-product-ksp-calculator', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/the-crucible', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/study-planner', priority: 0.95, changeFrequency: 'weekly' as const },
        // /bitsat-chemistry-revision removed from sitemap 2026-05-25 — BITSAT
        // 2026 exam window ended; page is noindex'd until refreshed for 2027.
        { path: '/college-predictor', priority: 1.0, changeFrequency: 'daily' as const },
        { path: '/college-predictor/branch-finder', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/college-predictor/compare', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/career-guide', priority: 0.95, changeFrequency: 'weekly' as const },
        { path: '/career-planning', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/career-explorer', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/career-explorer/browse', priority: 0.8, changeFrequency: 'weekly' as const },
        // /jee-pyqs removed from sitemap 2026-05-25 — route deleted, the
        // question bank lives in /the-crucible. 301 redirect in next.config.ts.
        // Subject hubs
        { path: '/organic-chemistry-hub', priority: 0.85, changeFrequency: 'weekly' as const },
        { path: '/inorganic-chemistry-hub', priority: 0.85, changeFrequency: 'weekly' as const },
        { path: '/physical-chemistry-hub', priority: 0.85, changeFrequency: 'weekly' as const },
        { path: '/inorganic-chemistry-hub/vsepr', priority: 0.7, changeFrequency: 'monthly' as const },
        { path: '/inorganic-chemistry-hub/bond-angles', priority: 0.7, changeFrequency: 'monthly' as const },
        // Mechanics Hub — vectors is the flagship simulator
        { path: '/mechanics-hub', priority: 0.85, changeFrequency: 'weekly' as const },
        { path: '/mechanics-hub/vectors', priority: 0.85, changeFrequency: 'weekly' as const },
        { path: '/chemihex', priority: 0.75, changeFrequency: 'monthly' as const },
        // Live Books landing pages (grade hubs)
        { path: '/class-9', priority: 1.0, changeFrequency: 'daily' as const },
        // /class-11 has no grade-hub page; chemistry book lives at /class-11/chemistry.
        { path: '/class-12', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/class-12/chemistry', priority: 0.9, changeFrequency: 'weekly' as const },
        { path: '/class-11/chemistry', priority: 0.9, changeFrequency: 'weekly' as const },
    ];

    // College Predictor programmatic landing pages (regional + type)
    const { LANDING_CONFIGS } = await import('@/features/college-predictor/data/landingConfig');
    const collegePredictorLandingEntries = LANDING_CONFIGS.map((cfg) => ({
        url: `${BASE_URL}/college-predictor/${cfg.slug}`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }));

    // College Predictor deep-dive pages — one per seeded college
    // (`/college-predictor/college/[slug]`). These are our SEO target for
    // "<college> cutoff <year>" queries. Priority set slightly below the
    // predictor root + regional landings because they are leaf pages.
    let collegeDeepDiveEntries: MetadataRoute.Sitemap = [];
    try {
        const { loadAllCollegeSlugs } = await import('@/features/college-predictor/lib/deepDive');
        const slugs = await loadAllCollegeSlugs();
        collegeDeepDiveEntries = slugs.map((slug) => ({
            url: `${BASE_URL}/college-predictor/college/${slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'monthly' as const,
            priority: 0.75,
        }));
    } catch (error) {
        console.error('Error fetching college slugs for sitemap:', error);
    }

    const staticEntries = staticPages.map((page) => ({
        url: `${BASE_URL}${page.path}`,
        lastModified: STABLE_LASTMOD,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
    }));

    // Dynamic flashcard chapter pages
    let flashcardChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const chapters = await getFlashcardChapters();
        flashcardChapterEntries = chapters.map((chapter) => ({
            url: `${BASE_URL}/chemistry-flashcards/${chapter.slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error('Error fetching flashcard chapters for sitemap:', error);
    }

    // Programmatic SEO: Question Pages
    let questionEntries: MetadataRoute.Sitemap = [];
    try {
        const { getAllSEOQuestions } = await import('@/features/landing/lib/seoData');
        const questions = await getAllSEOQuestions();

        // Add Directory Page
        questionEntries.push({
            url: `${BASE_URL}/chemistry-questions`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'daily' as const,
            priority: 0.9,
        });

        // Add Chapter Index Pages
        const distinctChapters = Array.from(new Set(questions.map(q => q.chapterSlug)));
        distinctChapters.forEach(slug => {
            questionEntries.push({
                url: `${BASE_URL}/chemistry-questions/${slug}`,
                lastModified: STABLE_LASTMOD,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            });
        });

        // Add Individual Question Pages
        const specializedEntries = questions.map((q) => ({
            url: `${BASE_URL}/chemistry-questions/${q.chapterSlug}/${q.slug}`,
            lastModified: STABLE_LASTMOD,
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
        // Chemistry: every chapter (getTaxonomy is Chemistry-scoped, always populated).
        // Physics/Maths are now public too, but only list chapters that actually have
        // questions — don't advertise empty/thin chapter pages to crawlers.
        const { getTaxonomy } = await import('@/features/crucible/server-actions/the-crucible');
        const { buildChaptersWithCounts } = await import('@/features/crucible/lib/chapterCounts');
        const chemChapterIds = (await getTaxonomy()).map(ch => ch.id);
        const physMathChapterIds = (await buildChaptersWithCounts({ subjects: ['Physics', 'Maths'] }))
            .filter(c => (c.question_count ?? 0) > 0 || (c.neet_question_count ?? 0) > 0)
            .map(c => c.id);
        crucibleChapterEntries = [...chemChapterIds, ...physMathChapterIds].map(id => ({
            url: `${BASE_URL}/the-crucible/${id}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'weekly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error('Error fetching crucible chapters for sitemap:', error);
    }

    // Crucible individual question pages (UUID-based canonical URLs)
    let crucibleQuestionEntries: MetadataRoute.Sitemap = [];
    try {
        const { getAllPublishedPYQSlugs } = await import('@/features/crucible/server-actions/the-crucible');
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
        const connectToDatabase = (await import('@canvas/data/db/mongodb')).default;
        const BookModel = (await import('@canvas/data/models/Book')).default;
        const BookPageModel = (await import('@canvas/data/models/BookPage')).default;
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

        // URL builders per grade. Class 11 chemistry uses a hardcoded
        // `/class-11/chemistry/[pageSlug]` route (no [bookSlug] segment),
        // so we drop the book slug for grade 11. Class 9 uses the dynamic
        // `/class-9/[bookSlug]/[pageSlug]` pattern. Anything else falls
        // back to the generic `/books/[bookSlug]/[pageSlug]` route.
        const buildPageUrl = (grade: number, bookSlug: string, pageSlug: string): string => {
            if (grade === 11) return `/class-11/chemistry/${pageSlug}`;
            if (grade === 9) return `/class-9/${bookSlug}/${pageSlug}`;
            return `/books/${bookSlug}/${pageSlug}`;
        };

        // Add per-book chapter-hub landings only for the generic /books/[bookSlug]
        // pattern. /class-9/[bookSlug] redirects to /class-9 — skip. /class-11
        // doesn't expose a per-book hub at all (chemistry book is rendered via
        // its showcase at /class-11/chemistry, already in staticPages).
        for (const [, meta] of bookMeta) {
            if (meta.grade !== 9 && meta.grade !== 11) {
                bookPageEntries.push({
                    url: `${BASE_URL}/books/${meta.slug}`,
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
            const lastMod = p.updated_at instanceof Date ? p.updated_at : new Date(p.updated_at);
            bookPageEntries.push({
                url: `${BASE_URL}${buildPageUrl(meta.grade, meta.slug, p.slug)}`,
                lastModified: lastMod,
                // Class 9 NCERT pages are the hot target right now — bias priority up.
                changeFrequency: meta.grade === 9 ? 'weekly' as const : 'monthly' as const,
                priority: meta.grade === 9 ? 0.9 : 0.7,
            });
        }
    } catch (error) {
        console.error('Error fetching book pages for sitemap:', error);
    }

    // ── Detailed lectures: every chapter video page ──────────────────────────
    // Reads from the published Google Sheet that powers /detailed-lectures.
    let detailedLectureEntries: MetadataRoute.Sitemap = [];
    try {
        const { fetchLecturesData } = await import('@/features/public-content/data/lecturesData');
        const chapters = await fetchLecturesData();
        detailedLectureEntries = chapters
            .filter((ch) => Boolean(ch.slug))
            .map((ch) => ({
                url: `${BASE_URL}/detailed-lectures/${ch.slug}`,
                lastModified: STABLE_LASTMOD,
                changeFrequency: 'weekly' as const,
                priority: 0.85,
            }));
    } catch (error) {
        console.error('Error fetching lecture chapters for sitemap:', error);
    }

    // JEE PYQs section removed 2026-05-25 — /jee-pyqs route was deleted in
    // favour of the /the-crucible question bank. Per-chapter PYQs are now
    // available as filter views inside Crucible.

    // ── Blog posts ───────────────────────────────────────────────────────────
    let blogEntries: MetadataRoute.Sitemap = [];
    try {
        const { getPublishedSlugs } = await import('@/features/blog/lib/blogDb');
        const slugs = await getPublishedSlugs();
        blogEntries = slugs.map((slug) => ({
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching blog slugs for sitemap:', error);
    }

    // ── JEE Main PYQ pages — /jee-main-pyqs/... ──────────────────────────────
    // Public SEO route mirroring the Crucible JEE Main chemistry PYQs. Static
    // pages, no auth, slug-based URLs. The export script regenerates the
    // underlying JSON; this block emits the URLs for whatever's in that data.
    let jeeMainPyqEntries: MetadataRoute.Sitemap = [];
    try {
        const { getManifest } = await import('@/features/public-content/data/jee-main-pyqs/data');
        const manifest = getManifest();
        // Hub
        jeeMainPyqEntries.push({
            url: `${BASE_URL}/jee-main-pyqs`,
            lastModified: new Date(manifest.generatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        });
        // Subject hub
        jeeMainPyqEntries.push({
            url: `${BASE_URL}/jee-main-pyqs/chemistry`,
            lastModified: new Date(manifest.generatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        });
        for (const ch of manifest.chapters) {
            if (ch.questionCount === 0) continue;
            // Chapter index
            jeeMainPyqEntries.push({
                url: `${BASE_URL}/jee-main-pyqs/chemistry/${ch.slug}`,
                lastModified: new Date(manifest.generatedAt),
                changeFrequency: 'weekly' as const,
                priority: 0.85,
            });
            // Individual questions
            for (const slug of ch.questionSlugs) {
                jeeMainPyqEntries.push({
                    url: `${BASE_URL}/jee-main-pyqs/chemistry/${ch.slug}/${slug}`,
                    lastModified: new Date(manifest.generatedAt),
                    changeFrequency: 'monthly' as const,
                    priority: 0.7,
                });
            }
        }
    } catch (error) {
        console.error('Error loading JEE Main PYQ manifest for sitemap:', error);
    }

    // ── Chemistry Quiz pages — /quiz/chemistry/[slug] ─────────────────────────
    // Phase 2 GEO target: AI-engine prompts like "create a quiz on inorganic
    // exceptions". Each slug is a static curated quiz module under
    // app/lib/quizzes/. Adding a new quiz means dropping a new entry into
    // CHEMISTRY_QUIZZES — the sitemap picks it up automatically.
    let chemistryQuizEntries: MetadataRoute.Sitemap = [];
    try {
        const { CHEMISTRY_QUIZZES_ORDERED } = await import('@/features/public-content/data/quizzes');
        // Hub page first, then individual quizzes.
        chemistryQuizEntries.push({
            url: `${BASE_URL}/quiz/chemistry`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        });
        for (const q of CHEMISTRY_QUIZZES_ORDERED) {
            chemistryQuizEntries.push({
                url: `${BASE_URL}/quiz/chemistry/${q.slug}`,
                lastModified: new Date(q.dateModified),
                changeFrequency: 'monthly' as const,
                priority: 0.85,
            });
        }
    } catch (error) {
        console.error('Error loading chemistry quizzes for sitemap:', error);
    }

    // ── NCERT Solutions: per-chapter pages (Class 11 & 12 Chemistry) ─────────
    // High-intent SEO target — "NCERT solutions class 12 chemistry chapter X".
    let ncertChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const { getChapterGroups } = await import('@/features/books/data/ncertData');
        const chapterGroups = await getChapterGroups();
        ncertChapterEntries = chapterGroups.map((g) => {
            const slug = g.chapter
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            return {
                url: `${BASE_URL}/ncert-solutions/class-${g.classNum}/${slug}`,
                lastModified: STABLE_LASTMOD,
                changeFrequency: 'weekly' as const,
                priority: 0.9,
            };
        });
    } catch (error) {
        console.error('Error fetching NCERT chapter groups for sitemap:', error);
    }

    // ── NCERT PDF download per-chapter pages (Class 11 & 12 Chemistry) ───────
    // High-intent SEO target — "class 11 chemistry ncert pdf chapter X".
    let ncertPdfChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const { getAllChapterGroups } = await import('@/features/books/data/ncertBooksData');
        const groups = await getAllChapterGroups();
        ncertPdfChapterEntries = groups.map((g) => ({
            url: `${BASE_URL}/download-ncert-books/class-${g.classNum}/${g.slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }));
    } catch (error) {
        console.error('Error fetching NCERT PDF chapter groups for sitemap:', error);
    }

    // ── Handwritten Notes per-chapter pages ──────────────────────────────────
    // Only include chapters that actually have notes available, so we never
    // submit empty pages to Google.
    let handwrittenChapterEntries: MetadataRoute.Sitemap = [];
    try {
        const { fetchHandwrittenNotes } = await import('@/features/notes/data/handwrittenNotesData');
        const { CHAPTER_META_LIST } = await import('@/features/notes/data/chapterMetadata');
        const notes = await fetchHandwrittenNotes();
        const chaptersWithNotes = new Set(notes.map((n) => n.chapter));
        handwrittenChapterEntries = CHAPTER_META_LIST
            .filter((c) => chaptersWithNotes.has(c.chapterName))
            .map((c) => ({
                url: `${BASE_URL}/handwritten-notes/${c.slug}`,
                lastModified: STABLE_LASTMOD,
                changeFrequency: 'weekly' as const,
                priority: 0.85,
            }));
    } catch (error) {
        console.error('Error fetching handwritten-notes chapters for sitemap:', error);
    }

    // ── Career Guide: programmatic SEO topic landing pages ───────────────────
    // Curated entry points for head queries (best-after-jee-main, etc.). Lives
    // at /career-guide/topics/[slug] — does not collide with /career-guide/[slug].
    let careerTopicEntries: MetadataRoute.Sitemap = [];
    try {
        const { TOPICS } = await import('@/features/career-guide/data/topics');
        careerTopicEntries = TOPICS.map((t) => ({
            url: `${BASE_URL}/career-guide/topics/${t.slug}`,
            lastModified: STABLE_LASTMOD,
            changeFrequency: 'monthly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error('Error loading career-guide topics for sitemap:', error);
    }

    // ── Career Guide: per-spec detail pages ──────────────────────────────────
    // Reads published CareerSpec slugs from MongoDB so newly-published specs
    // auto-appear in the sitemap on the next 24-hour revalidate. No code change
    // needed when the editorial team ships a new career.
    let careerSpecEntries: MetadataRoute.Sitemap = [];
    try {
        const connectToDatabase = (await import('@canvas/data/db/mongodb')).default;
        const { CareerSpec } = await import('@canvas/data/models/CareerSpec');
        await connectToDatabase();
        const specs = await CareerSpec
            .find({ status: 'published', deleted_at: null })
            .select('slug updated_at')
            .limit(100)
            .lean<Array<{ slug: string; updated_at?: Date }>>();
        careerSpecEntries = specs.map((s) => ({
            url: `${BASE_URL}/career-guide/${s.slug}`,
            lastModified: s.updated_at instanceof Date ? s.updated_at : new Date(),
            // Quarterly refresh cadence — leaf pages, lower change frequency
            // than the index. Still useful priority since these are deep
            // editorial pages with unique content per career.
            changeFrequency: 'monthly' as const,
            priority: 0.85,
        }));
    } catch (error) {
        console.error('Error fetching career spec slugs for sitemap:', error);
    }

    // ── Career Explorer: per-career deep-dive pages ──────────────────────────
    // /career-explorer/careers/[id] — one indexable page per active CareerPath.
    // These are data-rich pages ("<career> salary, training, day in the life")
    // that were previously absent from the sitemap, so Google never discovered
    // them. ID-based URLs (Mongo _id), matching the route's findById lookup.
    let careerExplorerEntries: MetadataRoute.Sitemap = [];
    try {
        const connectToDatabase = (await import('@canvas/data/db/mongodb')).default;
        const { CareerPath } = await import('@canvas/data/models/CareerPath');
        await connectToDatabase();
        const careers = await CareerPath
            .find({ is_active: true })
            .select('_id updated_at')
            .limit(1000)
            .lean<Array<{ _id: unknown; updated_at?: Date }>>();
        careerExplorerEntries = careers.map((c) => ({
            url: `${BASE_URL}/career-explorer/careers/${String(c._id)}`,
            lastModified: c.updated_at instanceof Date ? c.updated_at : new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Error fetching career-explorer careers for sitemap:', error);
    }

    return [
        ...staticEntries,
        ...collegePredictorLandingEntries,
        ...collegeDeepDiveEntries,
        ...flashcardChapterEntries,
        ...crucibleChapterEntries,
        ...questionEntries,
        ...crucibleQuestionEntries,
        ...bookPageEntries,
        ...detailedLectureEntries,
        ...blogEntries,
        ...ncertChapterEntries,
        ...ncertPdfChapterEntries,
        ...handwrittenChapterEntries,
        ...chemistryQuizEntries,
        ...jeeMainPyqEntries,
        ...careerTopicEntries,
        ...careerSpecEntries,
        ...careerExplorerEntries,
    ];
}

