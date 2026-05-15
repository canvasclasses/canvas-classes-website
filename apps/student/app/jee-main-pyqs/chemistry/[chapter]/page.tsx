import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getActiveChapters,
    getChapterBySlug,
    getChapterQuestions,
} from '@/features/public-content/data/jee-main-pyqs/data';
import type { JmpChapterMeta, JmpQuestion } from '@/features/public-content/data/jee-main-pyqs/types';

const BASE_URL = 'https://www.canvasclasses.in';

interface Props {
    params: Promise<{ chapter: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
    return getActiveChapters().map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { chapter: chapterSlug } = await params;
    const chapter = getChapterBySlug(chapterSlug);
    if (!chapter) return { title: 'Chapter Not Found' };

    const url = `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}`;
    const title = `JEE Main ${chapter.name} PYQs — ${chapter.questionCount} Questions with Solutions`;
    const description = `${chapter.questionCount} JEE Main previous year questions on ${chapter.name} (Class ${chapter.classLevel} chemistry), each with detailed solutions and the year/shift tagged. Free, no login.`;

    return {
        title,
        description,
        keywords: [
            `JEE Main ${chapter.name} PYQ`,
            `JEE Main ${chapter.name} questions`,
            `JEE Main ${chapter.name} previous year questions`,
            `${chapter.name} JEE Main`,
            `${chapter.name} class ${chapter.classLevel} JEE PYQ`,
            `${chapter.name} MCQ JEE`,
            'JEE Main chemistry chapter wise',
        ],
        alternates: { canonical: url },
        openGraph: {
            type: 'website',
            url,
            title,
            description,
            siteName: 'Canvas Classes',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1,
        },
    };
}

const PAARAS_PERSON = {
    '@type': 'Person',
    '@id': `${BASE_URL}/#paaras-thakur`,
    name: 'Paaras Thakur',
    alternateName: 'Paaras Sir',
} as const;

const CANVAS_ORG = {
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Canvas Classes',
    url: BASE_URL,
} as const;

function buildBreadcrumbSchema(chapter: JmpChapterMeta) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'JEE Main PYQs', item: `${BASE_URL}/jee-main-pyqs` },
            { '@type': 'ListItem', position: 3, name: 'Chemistry', item: `${BASE_URL}/jee-main-pyqs/chemistry` },
            {
                '@type': 'ListItem',
                position: 4,
                name: chapter.name,
                item: `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}`,
            },
        ],
    };
}

function buildCollectionPageSchema(chapter: JmpChapterMeta, questions: JmpQuestion[]) {
    const url = `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${url}#collection`,
        url,
        name: `JEE Main ${chapter.name} PYQs`,
        description: `${questions.length} JEE Main previous year questions on ${chapter.name} with detailed solutions.`,
        inLanguage: 'en',
        author: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        about: `JEE Main ${chapter.name} previous year questions`,
        educationalLevel: `Class ${chapter.classLevel}`,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: questions.length,
            itemListElement: questions.slice(0, 50).map((q, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${url}/${q.slug}`,
                name: stripForDisplay(q.stem, 80),
            })),
        },
    };
}

/**
 * Strip LaTeX, image markdown and special chars to produce a clean
 * display string for question previews in lists. Truncates to maxChars.
 */
function stripForDisplay(text: string, maxChars = 120): string {
    if (typeof text !== 'string') return '';
    const cleaned = text
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\[a-zA-Z]+/g, '').replace(/[{}_^]/g, ''))
        .replace(/\\[a-zA-Z]+/g, '')
        .replace(/[#*`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (cleaned.length <= maxChars) return cleaned;
    return cleaned.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

const DIFFICULTY_STYLES: Record<JmpQuestion['difficulty'], string> = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default async function ChapterIndexPage({ params }: Props) {
    const { chapter: chapterSlug } = await params;
    const chapter = getChapterBySlug(chapterSlug);
    if (!chapter) notFound();

    const questions = getChapterQuestions(chapter.id);

    // Group by year for navigability
    const byYear: Map<number, JmpQuestion[]> = new Map();
    const noYear: JmpQuestion[] = [];
    for (const q of questions) {
        if (q.examYear) {
            if (!byYear.has(q.examYear)) byYear.set(q.examYear, []);
            byYear.get(q.examYear)!.push(q);
        } else {
            noYear.push(q);
        }
    }
    const sortedYears = Array.from(byYear.keys()).sort((a, b) => b - a);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(chapter)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCollectionPageSchema(chapter, questions)) }}
            />

            <main className="min-h-screen bg-[#0d1117] text-white">
                {/* Hero */}
                <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/jee-main-pyqs" className="hover:text-gray-300">JEE Main PYQs</Link>
                            <span className="mx-2">/</span>
                            <Link href="/jee-main-pyqs/chemistry" className="hover:text-gray-300">Chemistry</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-300">{chapter.name}</span>
                        </nav>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
                            <span className="text-xs font-medium text-orange-400 tracking-wide uppercase">
                                {questions.length} JEE Main PYQs · Class {chapter.classLevel}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight tracking-tight">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-amber-300 bg-clip-text text-transparent">
                                JEE Main PYQs — {chapter.name}
                            </span>
                        </h1>

                        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-4">
                            {questions.length} previous year questions from JEE Main on {chapter.name}.
                            Each question shows the year, shift, full options, correct answer, and a
                            detailed solution by Paaras Sir.
                        </p>
                    </div>
                </section>

                {/* Year quick-jump */}
                {sortedYears.length > 1 && (
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                        <div className="flex flex-wrap gap-2">
                            {sortedYears.map((year) => (
                                <a
                                    key={year}
                                    href={`#year-${year}`}
                                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:border-orange-500/40 hover:text-white transition-colors"
                                >
                                    {year} <span className="text-gray-500">({byYear.get(year)!.length})</span>
                                </a>
                            ))}
                            {noYear.length > 0 && (
                                <a
                                    href="#untagged"
                                    className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-gray-300 hover:border-orange-500/40 hover:text-white transition-colors"
                                >
                                    Other <span className="text-gray-500">({noYear.length})</span>
                                </a>
                            )}
                        </div>
                    </section>
                )}

                {/* Questions grouped by year, latest first */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    {sortedYears.map((year) => (
                        <div key={year} id={`year-${year}`} className="scroll-mt-24 mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white">{year}</h2>
                                <span className="text-xs text-gray-500 font-mono">
                                    {byYear.get(year)!.length} questions
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
                            </div>
                            <div className="space-y-2">
                                {byYear.get(year)!.map((q) => (
                                    <Link
                                        key={q.slug}
                                        href={`/jee-main-pyqs/chemistry/${chapter.slug}/${q.slug}`}
                                        className="block rounded-lg border border-gray-700/40 bg-gray-900/30 p-4 hover:border-orange-500/40 hover:bg-gray-900/60 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                    <span
                                                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[q.difficulty]}`}
                                                    >
                                                        {q.difficulty}
                                                    </span>
                                                    {q.examShift && (
                                                        <span className="text-[10px] font-mono text-gray-500">
                                                            {q.examShift}
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] font-mono text-gray-600">
                                                        {q.displayId}
                                                    </span>
                                                </div>
                                                <p className="text-sm md:text-base text-gray-200 leading-snug line-clamp-2">
                                                    {stripForDisplay(q.stem, 200)}
                                                </p>
                                            </div>
                                            <span className="text-orange-400 text-sm font-semibold whitespace-nowrap mt-0.5">
                                                Solve →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    {noYear.length > 0 && (
                        <div id="untagged" className="scroll-mt-24 mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-xl md:text-2xl font-bold text-white">Other</h2>
                                <span className="text-xs text-gray-500 font-mono">
                                    {noYear.length} questions
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-orange-500/30 to-transparent" />
                            </div>
                            <div className="space-y-2">
                                {noYear.map((q) => (
                                    <Link
                                        key={q.slug}
                                        href={`/jee-main-pyqs/chemistry/${chapter.slug}/${q.slug}`}
                                        className="block rounded-lg border border-gray-700/40 bg-gray-900/30 p-4 hover:border-orange-500/40 hover:bg-gray-900/60 transition-all"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                    <span
                                                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[q.difficulty]}`}
                                                    >
                                                        {q.difficulty}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-gray-600">
                                                        {q.displayId}
                                                    </span>
                                                </div>
                                                <p className="text-sm md:text-base text-gray-200 leading-snug line-clamp-2">
                                                    {stripForDisplay(q.stem, 200)}
                                                </p>
                                            </div>
                                            <span className="text-orange-400 text-sm font-semibold whitespace-nowrap mt-0.5">
                                                Solve →
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* CTA strip */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent p-6 md:p-8">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                            Want timed practice with progress tracking?
                        </h2>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-4">
                            Move to <Link href="/the-crucible" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">The Crucible</Link>{' '}
                            for adaptive practice that picks the next question based on your strengths
                            and weaknesses, with timed sessions and personalised recommendations.
                        </p>
                        <Link
                            href={`/the-crucible/${chapter.id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black text-sm font-bold hover:scale-[1.02] transition-transform"
                        >
                            Practice {chapter.name} in The Crucible →
                        </Link>
                    </div>
                </section>
            </main>
        </>
    );
}
