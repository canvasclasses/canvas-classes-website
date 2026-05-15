import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CHEMISTRY_QUIZ_SLUGS, getChemistryQuiz } from '@/features/public-content/data/quizzes';
import type { QuizData } from '@/features/public-content/data/quizzes/types';
import QuizClient from './QuizClient';

const BASE_URL = 'https://www.canvasclasses.in';

interface Props {
    params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
    return CHEMISTRY_QUIZ_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const quiz = getChemistryQuiz(slug);
    if (!quiz) return { title: 'Quiz Not Found' };

    const url = `${BASE_URL}/quiz/chemistry/${quiz.slug}`;
    const title = `${quiz.title} (${quiz.questions.length} Questions)`;

    return {
        title,
        description: quiz.description,
        keywords: quiz.keywords,
        alternates: { canonical: url },
        openGraph: {
            type: 'article',
            url,
            title,
            description: quiz.description,
            siteName: 'Canvas Classes',
            images: [
                {
                    url: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/Black%20notes%20by%20Paaras%20Sir.webp',
                    width: 1200,
                    height: 630,
                    alt: quiz.title,
                },
            ],
            publishedTime: quiz.datePublished,
            modifiedTime: quiz.dateModified,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: quiz.description,
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

// ─── JSON-LD builders ─────────────────────────────────────────────────────────

const PAARAS_PERSON = {
    '@type': 'Person',
    '@id': `${BASE_URL}/#paaras-thakur`,
    name: 'Paaras Thakur',
    alternateName: 'Paaras Sir',
    jobTitle: 'Chemistry Educator',
    description: '15+ years experienced Chemistry educator for JEE & NEET. Founder of Canvas Classes.',
    url: BASE_URL,
    sameAs: [
        'https://www.youtube.com/@canvasclasses',
        'https://www.instagram.com/canvasclasses',
    ],
} as const;

const CANVAS_ORG = {
    '@type': 'EducationalOrganization',
    '@id': `${BASE_URL}/#organization`,
    name: 'Canvas Classes',
    url: BASE_URL,
} as const;

function stripLatex(s: string): string {
    // Strip $...$ math delimiters and common LaTeX commands so the JSON-LD
    // text is clean prose for AI engines / Google. Keeps subscripts/
    // superscripts as plain text (e.g. "Li2CO3 -> Li2O + CO2").
    return s
        .replace(/\$([^$]*)\$/g, (_, m) => m)
        .replace(/\\rightarrow/g, '→')
        .replace(/\\rightleftharpoons/g, '⇌')
        .replace(/\\to\b/g, '→')
        .replace(/\\Delta/g, 'Δ')
        .replace(/\\alpha/g, 'α')
        .replace(/\\beta/g, 'β')
        .replace(/\\pi/g, 'π')
        .replace(/\\theta/g, 'θ')
        .replace(/\\mu/g, 'μ')
        .replace(/\\approx/g, '≈')
        .replace(/\\gg/g, '≫')
        .replace(/\\ll/g, '≪')
        .replace(/\\cdot/g, '·')
        .replace(/\\circ/g, '°')
        .replace(/\\,/g, ' ')
        .replace(/\\\\/g, ' ')
        .replace(/[{}]/g, '')
        .replace(/_(\w)/g, '$1')
        .replace(/\^(\w+\+?)/g, '$1')
        .replace(/\s+/g, ' ')
        .trim();
}

function buildBreadcrumbSchema(quiz: QuizData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Chemistry Quiz', item: `${BASE_URL}/quiz/chemistry` },
            { '@type': 'ListItem', position: 3, name: quiz.shortLabel, item: `${BASE_URL}/quiz/chemistry/${quiz.slug}` },
        ],
    };
}

function buildQuizSchema(quiz: QuizData) {
    const url = `${BASE_URL}/quiz/chemistry/${quiz.slug}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        '@id': `${url}#quiz`,
        name: quiz.title,
        description: quiz.description,
        url,
        inLanguage: 'en',
        isAccessibleForFree: true,
        learningResourceType: 'Quiz',
        educationalLevel: quiz.educationalLevel,
        educationalUse: 'self-assessment, exam revision',
        assesses: quiz.learningOutcomes,
        teaches: quiz.learningOutcomes,
        about: [
            'Inorganic chemistry exceptions',
            'Periodic trends and anomalies',
            'Inert pair effect',
            'Lanthanoid contraction',
            'Back bonding',
        ],
        keywords: quiz.keywords.join(', '),
        numberOfQuestions: quiz.questions.length,
        typicalAgeRange: '16-19',
        audience: {
            '@type': 'EducationalAudience',
            educationalRole: 'student',
            audienceType: quiz.targetExams.map((e) => `${e} aspirant`).join(', '),
        },
        author: PAARAS_PERSON,
        creator: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        provider: CANVAS_ORG,
        datePublished: quiz.datePublished,
        dateModified: quiz.dateModified,
        hasPart: quiz.questions.map((q) => ({
            '@type': 'Question',
            '@id': `${url}#q${q.id}`,
            position: q.id,
            name: stripLatex(q.stem),
            text: stripLatex(q.stem),
            educationalAlignment: {
                '@type': 'AlignmentObject',
                alignmentType: 'educationalSubject',
                targetName: q.topic,
            },
            suggestedAnswer: q.options.map((opt) => ({
                '@type': 'Answer',
                position: opt.id.charCodeAt(0) - 96,
                text: stripLatex(opt.text),
                ...(opt.id === q.answerId ? {} : {}),
            })),
            acceptedAnswer: {
                '@type': 'Answer',
                text: `${stripLatex(q.options.find((o) => o.id === q.answerId)!.text)}. ${stripLatex(q.explanation)}`,
            },
        })),
    };
}

function buildFaqSchema(quiz: QuizData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: quiz.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: f.answer,
            },
        })),
    };
}

function buildWebPageSchema(quiz: QuizData) {
    const url = `${BASE_URL}/quiz/chemistry/${quiz.slug}`;
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: quiz.title,
        description: quiz.description,
        inLanguage: 'en',
        datePublished: quiz.datePublished,
        dateModified: quiz.dateModified,
        author: PAARAS_PERSON,
        creator: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: 'Canvas Classes',
        },
        mainEntity: { '@id': `${url}#quiz` },
    };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ChemistryQuizPage({ params }: Props) {
    const { slug } = await params;
    const quiz = getChemistryQuiz(slug);
    if (!quiz) notFound();

    const url = `${BASE_URL}/quiz/chemistry/${quiz.slug}`;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema(quiz)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebPageSchema(quiz)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildQuizSchema(quiz)) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(quiz)) }}
            />

            <main className="min-h-screen bg-[#0d1117] text-white">
                {/* Hero */}
                <section className="relative pt-20 pb-8 md:pt-24 md:pb-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

                    <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Breadcrumb */}
                        <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/quiz/chemistry" className="hover:text-gray-300">Chemistry Quiz</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-300">{quiz.shortLabel}</span>
                        </nav>

                        {/* Badge */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
                            <span className="text-xs font-medium text-orange-400 tracking-wide uppercase">
                                {quiz.questions.length}-Question Revision Quiz · Free
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.15] tracking-tight">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-amber-300 bg-clip-text text-transparent">
                                {quiz.title}
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                            {quiz.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                                Level: {quiz.educationalLevel}
                            </span>
                            {quiz.targetExams.map((e) => (
                                <span key={e} className="px-2 py-1 rounded bg-white/5 border border-white/10">
                                    {e}
                                </span>
                            ))}
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                                By Paaras Sir
                            </span>
                        </div>
                    </div>
                </section>

                {/* Learning outcomes */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                    <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-5 md:p-6">
                        <h2 className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-3">
                            What you'll revise
                        </h2>
                        <ul className="space-y-2 text-sm md:text-base text-gray-300">
                            {quiz.learningOutcomes.map((o, i) => (
                                <li key={i} className="flex gap-2">
                                    <span className="text-orange-500 flex-shrink-0">▸</span>
                                    <span>{o}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Questions */}
                <QuizClient quiz={quiz} />

                {/* FAQ — always-in-DOM, AI-friendly */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {quiz.faqs.map((f, i) => (
                            <details
                                key={i}
                                className="group rounded-xl border border-gray-700/50 bg-gray-900/40 px-5 py-4 hover:border-orange-500/30 transition-colors"
                            >
                                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                                    <h3 className="text-base md:text-lg font-semibold text-white">
                                        {f.question}
                                    </h3>
                                    <span className="text-orange-400 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">
                                    {f.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Related study tools */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Related Study Tools
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {quiz.relatedLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block rounded-xl border border-gray-700/50 bg-gray-900/40 p-5 hover:border-orange-500/40 hover:bg-gray-900/60 transition-all"
                            >
                                <div className="font-semibold text-white mb-1">
                                    {link.label} <span className="text-orange-400">→</span>
                                </div>
                                <div className="text-sm text-gray-400 leading-relaxed">
                                    {link.description}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Footer note */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <div className="text-center text-xs text-gray-600">
                        Quiz last updated {quiz.dateModified}.{' '}
                        <Link href={url} className="hover:text-gray-400 underline underline-offset-4">
                            Permanent link
                        </Link>
                        .
                    </div>
                </section>
            </main>
        </>
    );
}
