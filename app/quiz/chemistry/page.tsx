import { Metadata } from 'next';
import Link from 'next/link';
import { CHEMISTRY_QUIZZES_ORDERED } from '@/app/lib/quizzes';

const BASE_URL = 'https://www.canvasclasses.in';
const HUB_URL = `${BASE_URL}/quiz/chemistry`;

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'Chemistry Quiz Hub — JEE Main, NEET & BITSAT MCQ Practice',
    description:
        'Free chemistry quiz collection for JEE Main, JEE Advanced, NEET and BITSAT aspirants. Each topic-wise quiz has 30 multiple-choice questions with detailed explanations, built from NCERT-aligned content. Practice exception-based MCQs, periodic trends, p-block anomalies, and more.',
    keywords: [
        'chemistry quiz',
        'chemistry MCQ',
        'JEE chemistry quiz',
        'NEET chemistry quiz',
        'BITSAT chemistry quiz',
        'chemistry practice questions',
        'inorganic chemistry quiz',
        'periodic trends quiz',
        'p-block quiz',
        'chemistry MCQ with answers',
        'chemistry revision quiz',
        'free chemistry quiz online',
    ],
    alternates: { canonical: HUB_URL },
    openGraph: {
        type: 'website',
        url: HUB_URL,
        title: 'Chemistry Quiz Hub — JEE Main, NEET & BITSAT MCQ Practice',
        description:
            'Topic-wise chemistry quizzes with 30 MCQs and full explanations each. Free, no login. Built for JEE/NEET aspirants by Paaras Sir.',
        siteName: 'Canvas Classes',
        images: [
            {
                url: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/Black%20notes%20by%20Paaras%20Sir.webp',
                width: 1200,
                height: 630,
                alt: 'Canvas Classes Chemistry Quiz Hub',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Chemistry Quiz Hub — JEE/NEET MCQ Practice',
        description:
            'Free topic-wise chemistry quizzes with 30 MCQs each, built for JEE Main, NEET and BITSAT.',
    },
    robots: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
    },
};

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

function buildBreadcrumbSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
            { '@type': 'ListItem', position: 2, name: 'Chemistry Quiz', item: HUB_URL },
        ],
    };
}

function buildCollectionPageSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${HUB_URL}#collection`,
        url: HUB_URL,
        name: 'Chemistry Quiz Hub',
        description:
            'Topic-wise chemistry MCQ quizzes for JEE Main, JEE Advanced, NEET and BITSAT aspirants.',
        inLanguage: 'en',
        isPartOf: {
            '@type': 'WebSite',
            '@id': `${BASE_URL}/#website`,
            url: BASE_URL,
            name: 'Canvas Classes',
        },
        author: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: CHEMISTRY_QUIZZES_ORDERED.length,
            itemListElement: CHEMISTRY_QUIZZES_ORDERED.map((q, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${BASE_URL}/quiz/chemistry/${q.slug}`,
                name: q.title,
                description: q.description,
            })),
        },
    };
}

function buildFaqSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'Are these chemistry quizzes free?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                        'Yes — every quiz is completely free, no login required. Click any of the four options on a question — correct picks turn green, incorrect picks turn red, and the detailed explanation is revealed automatically. You can reset and retry any question as many times as you like.',
                },
            },
            {
                '@type': 'Question',
                name: 'Which exams are these quizzes designed for?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                        'The quizzes are calibrated for JEE Main, JEE Advanced, NEET and BITSAT — the four major Indian undergraduate entrance exams that test chemistry. Difficulty and phrasing match what these examiners typically ask. Class 11 and Class 12 CBSE board students will also find the explanations useful.',
                },
            },
            {
                '@type': 'Question',
                name: 'How are questions sourced?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                        'Each question is built from a specific data source on Canvas Classes — the Periodic Trends study tool, the inorganic chemistry hub, or the Crucible question bank. Every question stem and explanation traces back to NCERT-aligned content. We do not use AI-generated chemistry content.',
                },
            },
            {
                '@type': 'Question',
                name: 'Should I do these quizzes before or after reading the chapter?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                        'Both modes work. Practice-first surfaces the gaps in your understanding quickly; the explanations then act as targeted revision. Read-first checks how solid your concepts are. Each quiz page links back to the relevant study tool — use it as a feedback loop rather than a one-shot test.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I get more chemistry questions for practice?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text:
                        'Yes — for full chapter-wise practice with previous-year questions and adaptive recommendations, use The Crucible (canvasclasses.in/the-crucible). It contains hundreds of additional MCQs across all 28 chapters of NCERT Chemistry, with personalised difficulty progression.',
                },
            },
        ],
    };
}

export default function ChemistryQuizHubPage() {
    const totalQuestions = CHEMISTRY_QUIZZES_ORDERED.reduce((sum, q) => sum + q.questions.length, 0);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCollectionPageSchema()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema()) }}
            />

            <main className="min-h-screen bg-[#0d1117] text-white">
                {/* Hero */}
                <section className="relative pt-20 pb-10 md:pt-24 md:pb-14 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-40 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />

                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-300">Chemistry Quiz</span>
                        </nav>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
                            <span className="text-xs font-medium text-orange-400 tracking-wide uppercase">
                                {CHEMISTRY_QUIZZES_ORDERED.length} Topic Quizzes · {totalQuestions} MCQs · Free
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.15] tracking-tight">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-amber-300 bg-clip-text text-transparent">
                                Chemistry Quiz Hub
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                            Topic-wise chemistry quizzes for JEE Main, JEE Advanced, NEET and BITSAT.
                            Each quiz has 30 multiple-choice questions with the correct answer and a
                            detailed examiner-style explanation. Sourced from NCERT-aligned content.
                            Free, no login.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">JEE Main</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">JEE Advanced</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">NEET</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">BITSAT</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Class 11 + 12</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">By Paaras Sir</span>
                        </div>
                    </div>
                </section>

                {/* Quiz cards */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="grid md:grid-cols-2 gap-5">
                        {CHEMISTRY_QUIZZES_ORDERED.map((q, i) => (
                            <Link
                                key={q.slug}
                                href={`/quiz/chemistry/${q.slug}`}
                                className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-6 md:p-7 hover:border-orange-500/40 hover:from-gray-900/80 transition-all"
                            >
                                <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-colors pointer-events-none" />

                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-[10px] font-bold uppercase tracking-wider">
                                            Quiz #{i + 1}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {q.questions.length} questions · ~{Math.round((q.questions.length * 30) / 60)} min
                                        </span>
                                    </div>

                                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-orange-100 transition-colors">
                                        {q.shortLabel}
                                    </h2>
                                    <h3 className="text-sm text-gray-500 font-normal mb-3 leading-snug">
                                        {q.title}
                                    </h3>

                                    <p className="text-sm text-gray-400 leading-relaxed mb-5 line-clamp-3">
                                        {q.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-1.5">
                                            {q.targetExams.slice(0, 3).map((e) => (
                                                <span
                                                    key={e}
                                                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 border border-white/10 text-gray-400"
                                                >
                                                    {e}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-orange-400 text-sm font-semibold whitespace-nowrap group-hover:translate-x-0.5 transition-transform">
                                            Start →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
                            How these quizzes are built
                        </h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">1. Sourced from data</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Each question traces back to a specific trend block, NCERT line,
                                    or Crucible question. Nothing is generated from scratch — every
                                    fact is verifiable.
                                </p>
                            </div>
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">2. Examiner-style explanations</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Every answer comes with the *why* — the exception logic, the
                                    underlying concept, and a worked comparison so you can pattern-match
                                    similar PYQs in the exam.
                                </p>
                            </div>
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">3. Always-in-DOM</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Every question, option, answer and explanation lives in the
                                    initial HTML — readable by AI engines like ChatGPT and Perplexity.
                                    The interactive layer (click an option to check it) layers on top
                                    once JavaScript loads.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ — always-in-DOM */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {[
                            {
                                q: 'Are these chemistry quizzes free?',
                                a: 'Yes — every quiz is completely free, no login required. Click any of the four options on a question — correct picks turn green, incorrect picks turn red, and the detailed explanation is revealed automatically. You can reset and retry any question as many times as you like.',
                            },
                            {
                                q: 'Which exams are these quizzes designed for?',
                                a: 'The quizzes are calibrated for JEE Main, JEE Advanced, NEET and BITSAT — the four major Indian undergraduate entrance exams that test chemistry. Difficulty and phrasing match what these examiners typically ask. Class 11 and Class 12 CBSE board students will also find the explanations useful.',
                            },
                            {
                                q: 'How are questions sourced?',
                                a: 'Each question is built from a specific data source on Canvas Classes — the Periodic Trends study tool, the inorganic chemistry hub, or the Crucible question bank. Every question stem and explanation traces back to NCERT-aligned content. We do not use AI-generated chemistry content.',
                            },
                            {
                                q: 'Should I do these quizzes before or after reading the chapter?',
                                a: 'Both modes work. Practice-first surfaces the gaps in your understanding quickly; the explanations then act as targeted revision. Read-first checks how solid your concepts are. Each quiz page links back to the relevant study tool — use it as a feedback loop rather than a one-shot test.',
                            },
                            {
                                q: 'Can I get more chemistry questions for practice?',
                                a: 'Yes — for full chapter-wise practice with previous-year questions and adaptive recommendations, use The Crucible. It contains hundreds of additional MCQs across all 28 chapters of NCERT Chemistry, with personalised difficulty progression.',
                            },
                        ].map((f, i) => (
                            <details
                                key={i}
                                className="group rounded-xl border border-gray-700/50 bg-gray-900/40 px-5 py-4 hover:border-orange-500/30 transition-colors"
                            >
                                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                                    <h3 className="text-base md:text-lg font-semibold text-white">
                                        {f.q}
                                    </h3>
                                    <span className="text-orange-400 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">
                                    {f.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Related */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
                        More chemistry study tools
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { label: 'The Crucible', href: '/the-crucible', desc: 'Adaptive practice with PYQs' },
                            { label: 'Periodic Trends', href: '/periodic-trends', desc: '60+ inorganic exception cards' },
                            { label: 'Handwritten Notes', href: '/handwritten-notes', desc: 'Free notes by Paaras Sir' },
                            { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', desc: 'Click any element' },
                            { label: 'Chemistry Flashcards', href: '/chemistry-flashcards', desc: 'Spaced repetition' },
                            { label: 'Inorganic Chemistry Hub', href: '/inorganic-chemistry-hub', desc: 'VSEPR, bond angles' },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block rounded-xl border border-gray-700/50 bg-gray-900/30 p-4 hover:border-orange-500/40 hover:bg-gray-900/60 transition-all"
                            >
                                <div className="text-sm font-semibold text-white mb-0.5">
                                    {link.label} <span className="text-orange-400 text-xs">→</span>
                                </div>
                                <div className="text-xs text-gray-500">{link.desc}</div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </>
    );
}
