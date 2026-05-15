import { Metadata } from 'next';
import Link from 'next/link';
import { getManifest } from '@/features/public-content/data/jee-main-pyqs/data';

const BASE_URL = 'https://www.canvasclasses.in';
const HUB_URL = `${BASE_URL}/jee-main-pyqs`;

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'JEE Main Previous Year Questions (PYQs) — Free Solutions & Explanations',
    description:
        'Browse JEE Main previous year questions (PYQs) chapter-wise with detailed solutions and explanations by Paaras Sir. Free, no login. Chemistry questions across all 25 NCERT chapters with year, shift, and difficulty tagged.',
    keywords: [
        'JEE Main PYQ',
        'JEE Main previous year questions',
        'JEE Main chemistry PYQ',
        'JEE Main chapter wise PYQ',
        'JEE Main solutions',
        'JEE Main MCQ with answers',
        'JEE Main PYQ chemistry chapter wise',
        'JEE Main practice questions',
        'JEE Main questions with solutions',
    ],
    alternates: { canonical: HUB_URL },
    openGraph: {
        type: 'website',
        url: HUB_URL,
        title: 'JEE Main Previous Year Questions — Chapter-wise with Solutions',
        description:
            'Free JEE Main PYQs with detailed solutions, by chapter. Chemistry questions across all NCERT chapters with year and shift tagged.',
        siteName: 'Canvas Classes',
        images: [
            {
                url: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/Black%20notes%20by%20Paaras%20Sir.webp',
                width: 1200,
                height: 630,
                alt: 'Canvas Classes JEE Main PYQs',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JEE Main PYQs — Chapter-wise',
        description:
            'Free JEE Main PYQs with detailed chapter-wise solutions.',
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
            { '@type': 'ListItem', position: 2, name: 'JEE Main PYQs', item: HUB_URL },
        ],
    };
}

function buildWebPageSchema(totalQuestions: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${HUB_URL}#webpage`,
        url: HUB_URL,
        name: 'JEE Main Previous Year Questions',
        description:
            'Chapter-wise JEE Main PYQs with detailed solutions and explanations. Chemistry questions across all NCERT chapters with year, shift, and difficulty tagged.',
        inLanguage: 'en',
        author: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        about: 'JEE Main Previous Year Questions',
        mainContentOfPage: {
            '@type': 'WebPageElement',
            description: `${totalQuestions} JEE Main chemistry PYQs across 25 NCERT chapters.`,
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
                name: 'Are these JEE Main PYQs free?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes — every PYQ on this hub is free, no login required. Each question page shows the full question, all four options, the correct answer, and a detailed step-by-step explanation by Paaras Sir.',
                },
            },
            {
                '@type': 'Question',
                name: 'How are the questions organised?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Questions are organised by NCERT chapter and tagged with the year and shift in which they appeared in the JEE Main exam. You can browse all chemistry chapters and pick a chapter to see every JEE Main PYQ from that chapter, with the year tagged on each question.',
                },
            },
            {
                '@type': 'Question',
                name: 'Where do these questions come from?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Every question is sourced from official JEE Main papers — Main exams from 2015 onwards across all shifts. The questions and solutions live inside The Crucible (canvasclasses.in/the-crucible), which is our adaptive practice platform. This public archive mirrors the chemistry PYQs for free chapter-wise revision.',
                },
            },
            {
                '@type': 'Question',
                name: 'Will solving these PYQs help my JEE Main preparation?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes — JEE Main has historically reused around 30–40% of question patterns from previous years, especially in chemistry. Chapter-wise PYQ revision is the highest-yield use of study time in the final 60 days before the exam. Each question here also reveals which chapter, year, and shift it appeared in, so you can spot patterns.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I get more practice with adaptive recommendations?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: "Yes — use The Crucible (canvasclasses.in/the-crucible) for adaptive practice that picks questions based on your strengths and weaknesses, tracks your progress, and recommends the next-best chapter to focus on. The PYQ archive here is the SEO-friendly browse layer; The Crucible is where you do timed, tracked practice.",
                },
            },
        ],
    };
}

export default function JeeMainPyqsHubPage() {
    const manifest = getManifest();
    const total = manifest.totalQuestions;
    const activeChapterCount = manifest.chapters.filter((c) => c.questionCount > 0).length;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildWebPageSchema(total)) }}
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
                            <span className="text-gray-300">JEE Main PYQs</span>
                        </nav>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
                            <span className="text-xs font-medium text-orange-400 tracking-wide uppercase">
                                {total.toLocaleString()} Questions · {activeChapterCount} Chapters · Free
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.15] tracking-tight">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-amber-300 bg-clip-text text-transparent">
                                JEE Main Previous Year Questions
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                            Chapter-wise JEE Main PYQs with detailed solutions and explanations by Paaras Sir.
                            Every question tagged with year and shift. Free, no login.
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">JEE Main</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Class 11 + 12</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">NCERT-aligned</span>
                            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">By Paaras Sir</span>
                        </div>
                    </div>
                </section>

                {/* Subject cards */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Browse by subject</h2>
                    <div className="grid md:grid-cols-2 gap-5">
                        <Link
                            href="/jee-main-pyqs/chemistry"
                            className="group relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-900/60 to-gray-900/30 p-6 md:p-7 hover:border-orange-500/40 hover:from-gray-900/80 transition-all"
                        >
                            <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/5 rounded-full blur-2xl group-hover:bg-orange-500/15 transition-colors pointer-events-none" />
                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-300 text-[10px] font-bold uppercase tracking-wider">
                                        Available now
                                    </span>
                                    <span className="text-xs text-gray-500">{total.toLocaleString()} questions</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-orange-100 transition-colors">
                                    Chemistry
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                                    All 25 NCERT chapters across Class 11 and Class 12 — physical, organic,
                                    inorganic, and practical chemistry. Questions from JEE Main 2015 to present.
                                </p>
                                <span className="text-orange-400 text-sm font-semibold group-hover:translate-x-0.5 transition-transform inline-block">
                                    Browse chapters →
                                </span>
                            </div>
                        </Link>

                        <div className="rounded-2xl border border-gray-700/30 bg-gray-900/20 p-6 md:p-7 opacity-60 cursor-default">
                            <div className="flex items-center justify-between mb-4">
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-700/30 border border-gray-600/30 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                                    Coming soon
                                </span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-2 leading-tight">
                                Physics &amp; Maths
                            </h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Physics and Maths PYQ archives in development. Subscribe to our newsletter or
                                follow Paaras Sir on YouTube for the launch announcement.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Why PYQs matter */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-5">
                            Why JEE Main PYQ revision is the highest-yield use of your time
                        </h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">1. Patterns repeat</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Around 30-40% of JEE Main chemistry questions follow patterns from previous
                                    years — same concept, slightly different numbers or compound. Memorising the
                                    *pattern* beats memorising the *answer*.
                                </p>
                            </div>
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">2. Chapter-wise visibility</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Each chapter has its own page showing every JEE Main PYQ that has appeared
                                    from that chapter — so you can see at a glance which sub-topics get tested
                                    most heavily and which get neglected.
                                </p>
                            </div>
                            <div>
                                <div className="text-orange-400 text-sm font-bold uppercase tracking-wider mb-2">3. Year tagging</div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Every question is tagged with year and shift. You can spot when a topic
                                    suddenly gets hot (e.g. coordination compounds in 2023-24) and prioritise
                                    accordingly.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {[
                            {
                                q: 'Are these JEE Main PYQs free?',
                                a: 'Yes — every PYQ on this hub is free, no login required. Each question page shows the full question, all four options, the correct answer, and a detailed step-by-step explanation by Paaras Sir.',
                            },
                            {
                                q: 'How are the questions organised?',
                                a: 'Questions are organised by NCERT chapter and tagged with the year and shift in which they appeared in the JEE Main exam.',
                            },
                            {
                                q: 'Where do these questions come from?',
                                a: 'Every question is sourced from official JEE Main papers — Main exams from 2015 onwards across all shifts. The same questions live inside The Crucible (canvasclasses.in/the-crucible), our adaptive practice platform.',
                            },
                            {
                                q: 'Will solving these PYQs help my JEE Main preparation?',
                                a: 'Yes — JEE Main has historically reused around 30–40% of question patterns. Chapter-wise PYQ revision is the highest-yield use of study time in the final 60 days before the exam.',
                            },
                            {
                                q: 'Can I get adaptive practice with progress tracking?',
                                a: 'Yes — use The Crucible for timed, tracked practice with adaptive recommendations. The PYQ archive here is the SEO-friendly browse layer; The Crucible is where you do tracked practice.',
                            },
                        ].map((f, i) => (
                            <details
                                key={i}
                                className="group rounded-xl border border-gray-700/50 bg-gray-900/40 px-5 py-4 hover:border-orange-500/30 transition-colors"
                            >
                                <summary className="cursor-pointer list-none flex items-start justify-between gap-4">
                                    <h3 className="text-base md:text-lg font-semibold text-white">{f.q}</h3>
                                    <span className="text-orange-400 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                                </summary>
                                <p className="mt-3 text-sm md:text-base text-gray-400 leading-relaxed">{f.a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Related */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-5">More chemistry resources</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                            { label: 'The Crucible — Adaptive Practice', href: '/the-crucible', desc: 'Timed practice with progress tracking' },
                            { label: 'Chemistry Quizzes', href: '/quiz/chemistry', desc: '30-question topic quizzes' },
                            { label: 'Periodic Trends', href: '/periodic-trends', desc: '60+ exception cards' },
                            { label: 'Handwritten Notes', href: '/handwritten-notes', desc: 'Free chapter notes' },
                            { label: 'Chemistry Flashcards', href: '/chemistry-flashcards', desc: 'Spaced repetition' },
                            { label: 'NCERT Solutions', href: '/ncert-solutions', desc: 'Class 11 + 12' },
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
