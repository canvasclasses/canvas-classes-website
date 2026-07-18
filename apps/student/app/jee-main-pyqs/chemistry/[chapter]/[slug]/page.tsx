import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    getChapterBySlug,
    getQuestion,
    getRelatedQuestions,
} from '@/features/public-content/data/jee-main-pyqs/data';
import type { JmpChapterMeta, JmpQuestion } from '@/features/public-content/data/jee-main-pyqs/types';
import QuestionMarkdown from '@/features/public-content/components/QuestionMarkdown';

const BASE_URL = 'https://www.canvasclasses.in';

interface Props {
    params: Promise<{ chapter: string; slug: string }>;
}

// 28-day ISR — PYQ solutions are effectively static. Crawlers sweep this
// high-cardinality surface ~weekly, so a 7d window meant nearly every visit
// landed just past expiry and triggered a stale-while-revalidate rebuild
// (2026-07 diagnosis). 28d lets ~3 of 4 sweeps hit fresh. Freshness on edit
// comes from on-demand revalidation via /api/revalidate (cache redesign
// Phase 1 — _agents/plans/CRUCIBLE_CACHE_SEO_REDESIGN.md).
export const revalidate = 2419200;

// No pages pre-built at deploy time — generated on first request and cached via
// ISR, matching the-crucible/q/[slug] and chemistry-questions/[chapter]/[slug].
// Pre-rendering the entire PYQ bank on every build wrote thousands of ISR
// entries per deploy (and inflated Build CPU) for pages crawlers fetch rarely.
export async function generateStaticParams() {
    return [];
}

/** Strip LaTeX, image markdown, and special chars for plaintext use (titles, descriptions, schema). */
function stripForText(text: string, maxChars = 200): string {
    if (typeof text !== 'string') return '';
    const cleaned = text
        .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
        .replace(/\$([^$]*)\$/g, (_, m) => m.replace(/\\[a-zA-Z]+/g, '').replace(/[{}_^]/g, ''))
        .replace(/\\[a-zA-Z]+/g, '')
        .replace(/[#*`>]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (cleaned.length <= maxChars) return cleaned;
    return cleaned.slice(0, maxChars).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { chapter: chapterSlug, slug: questionSlug } = await params;
    const chapter = getChapterBySlug(chapterSlug);
    if (!chapter) return { title: 'Question Not Found' };
    const question = getQuestion(chapter.id, questionSlug);
    if (!question) return { title: 'Question Not Found' };

    const url = `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}/${question.slug}`;
    const stemPreview = stripForText(question.stem, 100);
    const yearTag = question.examYear ? ` (JEE Main ${question.examYear})` : '';
    // Verbatim stem first, "— Solved" as a compact suffix promise (founder
    // decision 2026-07-18, option B; SEO_PLAYBOOK Part G).
    const title = `${stemPreview} — Solved${yearTag}`;

    const correctText = stripForText(
        question.options.find((o) => o.id === question.answerId)?.text || '',
        50
    );
    const description = `JEE Main ${chapter.name} PYQ${yearTag}: ${stripForText(question.stem, 100)} Correct answer: ${correctText}. Detailed solution by Paaras Sir.`.slice(0, 160);

    return {
        title,
        description,
        keywords: [
            `JEE Main ${chapter.name}`,
            `${chapter.name} PYQ`,
            'JEE Main PYQ chemistry',
            'JEE Main MCQ',
            ...(question.examYear ? [`JEE Main ${question.examYear} chemistry`] : []),
        ],
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            url,
            title,
            description,
            siteName: 'Canvas Classes',
            ...(question.examYear ? { publishedTime: `${question.examYear}-01-01` } : {}),
        },
        twitter: { card: 'summary_large_image', title, description },
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
    jobTitle: 'Chemistry Educator',
    url: BASE_URL,
} as const;

const CANVAS_ORG = {
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Canvas Classes',
    url: BASE_URL,
} as const;

function buildBreadcrumbSchema(chapter: JmpChapterMeta, question: JmpQuestion) {
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
            {
                '@type': 'ListItem',
                position: 5,
                name: stripForText(question.stem, 60),
                item: `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}/${question.slug}`,
            },
        ],
    };
}

function buildQAPageSchema(chapter: JmpChapterMeta, question: JmpQuestion) {
    const url = `${BASE_URL}/jee-main-pyqs/chemistry/${chapter.slug}/${question.slug}`;
    const correctOption = question.options.find((o) => o.id === question.answerId)!;
    const correctText = stripForText(correctOption.text, 200);
    const explanationText = stripForText(question.explanation, 1500);
    const acceptedAnswerText = `${correctText}. ${explanationText}`;

    return {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        '@id': `${url}#qapage`,
        url,
        inLanguage: 'en',
        author: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        mainEntity: {
            '@type': 'Question',
            '@id': `${url}#question`,
            name: stripForText(question.stem, 200),
            text: stripForText(question.stem, 1000),
            ...(question.examYear ? { dateCreated: `${question.examYear}-01-01` } : {}),
            answerCount: 1,
            educationalAlignment: {
                '@type': 'AlignmentObject',
                alignmentType: 'educationalSubject',
                targetName: chapter.name,
                educationalFramework: 'NCERT',
            },
            educationalLevel: `Class ${chapter.classLevel}`,
            // Single expert acceptedAnswer, capped at 500 chars — the
            // education-exception shape (2026-07-18, QUESTION_LIBRARY_SPEC
            // Phase A.4): Google's QAPage education carve-out is for pages
            // with "a single answer provided or selected by in-house
            // experts". The former suggestedAnswer array (all 4 MCQ options
            // as Answers) read as MULTIPLE answers — schema mismatch — and
            // the former 1500-char cap shipped the near-full solution as
            // machine-readable text. 500 chars = consistent teaser across
            // all question surfaces; the full solution lives in the SSR
            // page body where it earns dwell time.
            acceptedAnswer: {
                '@type': 'Answer',
                text: acceptedAnswerText.slice(0, 500),
                author: PAARAS_PERSON,
                ...(question.examYear ? { dateCreated: `${question.examYear}-01-01` } : {}),
            },
        },
    };
}

const DIFFICULTY_STYLES: Record<JmpQuestion['difficulty'], string> = {
    easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    hard: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
};

export default async function PyqQuestionPage({ params }: Props) {
    const { chapter: chapterSlug, slug: questionSlug } = await params;
    const chapter = getChapterBySlug(chapterSlug);
    if (!chapter) notFound();
    const question = getQuestion(chapter.id, questionSlug);
    if (!question) notFound();

    const correctOption = question.options.find((o) => o.id === question.answerId)!;
    const related = getRelatedQuestions(chapter.id, question.slug, question.primaryTag, 5);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(chapter, question)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQAPageSchema(chapter, question)) }}
            />

            <main className="min-h-screen bg-[#0d1117] text-white">
                {/* Hero / breadcrumb */}
                <section className="pt-20 md:pt-24 pb-6">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/jee-main-pyqs" className="hover:text-gray-300">JEE Main PYQs</Link>
                            <span className="mx-2">/</span>
                            <Link href="/jee-main-pyqs/chemistry" className="hover:text-gray-300">Chemistry</Link>
                            <span className="mx-2">/</span>
                            <Link
                                href={`/jee-main-pyqs/chemistry/${chapter.slug}`}
                                className="hover:text-gray-300"
                            >
                                {chapter.name}
                            </Link>
                        </nav>

                        {/* Status row — exam, year, difficulty, displayId */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/30 text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                                JEE Main{question.examYear ? ` · ${question.examYear}` : ''}
                                {question.examShift ? ` · ${question.examShift}` : ''}
                            </span>
                            <span
                                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[question.difficulty]}`}
                            >
                                {question.difficulty}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500">
                                {question.displayId}
                            </span>
                        </div>

                        <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-snug tracking-tight mb-2">
                            {stripForText(question.stem, 120)}
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500">
                            {chapter.name} · Class {chapter.classLevel} · JEE Main Previous Year Question
                        </p>
                    </div>
                </section>

                {/* Question stem (full markdown render with images/LaTeX) */}
                <section className="pb-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-5 md:p-6">
                            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                                Question
                            </div>
                            <div className="text-base md:text-lg text-white">
                                <QuestionMarkdown>{question.stem}</QuestionMarkdown>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Options */}
                <section className="pb-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                            Options
                        </div>
                        <ol className="space-y-2 list-none">
                            {question.options.map((opt) => {
                                const isCorrect = opt.id === question.answerId;
                                return (
                                    <li
                                        key={opt.id}
                                        className={`rounded-lg border p-3 md:p-4 flex gap-3 items-start ${
                                            isCorrect
                                                ? 'bg-emerald-500/10 border-emerald-500/50'
                                                : 'bg-gray-900/30 border-gray-700/40'
                                        }`}
                                    >
                                        <span
                                            className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold mt-0.5 border ${
                                                isCorrect
                                                    ? 'bg-emerald-500/30 border-emerald-500/60 text-emerald-200'
                                                    : 'bg-white/5 border-white/10 text-gray-400'
                                            }`}
                                        >
                                            {opt.id}
                                        </span>
                                        <div className="flex-1 text-sm md:text-base text-gray-200 min-w-0">
                                            <QuestionMarkdown>{opt.text}</QuestionMarkdown>
                                        </div>
                                        {isCorrect && (
                                            <span className="flex-shrink-0 text-emerald-400 text-lg font-bold leading-none mt-0.5">
                                                ✓
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ol>
                    </div>
                </section>

                {/* Correct answer */}
                <section className="pb-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-transparent p-5 md:p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                                    Correct Answer
                                </span>
                                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                                    {correctOption.id}
                                </span>
                            </div>
                            <div className="text-base md:text-lg text-emerald-100/90 font-medium">
                                <QuestionMarkdown>{correctOption.text}</QuestionMarkdown>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Explanation */}
                {question.explanation && (
                    <section className="pb-10">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-5 md:p-6">
                                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                                    Detailed Solution
                                </div>
                                <div className="text-sm md:text-base text-gray-300">
                                    <QuestionMarkdown>{question.explanation}</QuestionMarkdown>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Practice CTA */}
                <section className="pb-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent p-5 md:p-6">
                            <h2 className="text-base md:text-lg font-bold text-white mb-2">
                                Practice this question with progress tracking
                            </h2>
                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                Want timed practice with adaptive difficulty? Solve this question (and
                                hundreds more from {chapter.name}) inside The Crucible, our adaptive
                                practice platform.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href={`/the-crucible/q/${question.crucibleId}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-black text-sm font-bold hover:scale-[1.02] transition-transform"
                                >
                                    Practice in The Crucible →
                                </Link>
                                <Link
                                    href={`/the-crucible/${chapter.id}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 transition-colors"
                                >
                                    Browse {chapter.name} chapter →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Related questions */}
                {related.length > 0 && (
                    <section className="pb-12">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-lg md:text-xl font-bold text-white mb-4">
                                More JEE Main {chapter.name} PYQs
                            </h2>
                            <div className="space-y-2">
                                {related.map((q) => (
                                    <Link
                                        key={q.slug}
                                        href={`/jee-main-pyqs/chemistry/${chapter.slug}/${q.slug}`}
                                        className="block rounded-lg border border-gray-700/40 bg-gray-900/30 p-4 hover:border-orange-500/40 hover:bg-gray-900/60 transition-all"
                                    >
                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                            {q.examYear && (
                                                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border bg-violet-500/10 text-violet-300 border-violet-500/30">
                                                    {q.examYear}
                                                </span>
                                            )}
                                            <span
                                                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${DIFFICULTY_STYLES[q.difficulty]}`}
                                            >
                                                {q.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm md:text-base text-gray-200 leading-snug line-clamp-2">
                                            {stripForText(q.stem, 200)}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link
                                    href={`/jee-main-pyqs/chemistry/${chapter.slug}`}
                                    className="text-orange-400 text-sm font-semibold hover:text-orange-300"
                                >
                                    View all {chapter.questionCount} {chapter.name} PYQs →
                                </Link>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}
