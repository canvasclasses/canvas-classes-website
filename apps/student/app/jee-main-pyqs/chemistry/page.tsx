import { Metadata } from 'next';
import Link from 'next/link';
import { getActiveChapters, getManifest } from '@/features/public-content/data/jee-main-pyqs/data';
import type { JmpChapterMeta } from '@/features/public-content/data/jee-main-pyqs/types';

const BASE_URL = 'https://www.canvasclasses.in';
const HUB_URL = `${BASE_URL}/jee-main-pyqs/chemistry`;

export const revalidate = 86400;

export const metadata: Metadata = {
    title: 'JEE Main Chemistry PYQs — Chapter-wise (Class 11 + 12)',
    description:
        'Browse JEE Main chemistry previous year questions chapter-wise. Class 11 and Class 12 chemistry across all 25 NCERT chapters — physical, organic, inorganic, practical. Free with detailed solutions by Paaras Sir.',
    keywords: [
        'JEE Main chemistry PYQ',
        'JEE Main chemistry chapter wise PYQ',
        'JEE Main chemistry chapter wise questions',
        'JEE Main physical chemistry PYQ',
        'JEE Main organic chemistry PYQ',
        'JEE Main inorganic chemistry PYQ',
        'JEE Main chemistry class 11 PYQ',
        'JEE Main chemistry class 12 PYQ',
        'JEE Main NCERT chemistry questions',
    ],
    alternates: { canonical: HUB_URL },
    openGraph: {
        type: 'website',
        url: HUB_URL,
        title: 'JEE Main Chemistry PYQs — Chapter-wise',
        description:
            'Browse JEE Main chemistry previous year questions across all 25 NCERT chapters. Free, with detailed solutions.',
        siteName: 'Canvas Classes',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'JEE Main Chemistry PYQs — Chapter-wise',
        description:
            'JEE Main chemistry PYQs across all 25 NCERT chapters with detailed solutions.',
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
            { '@type': 'ListItem', position: 2, name: 'JEE Main PYQs', item: `${BASE_URL}/jee-main-pyqs` },
            { '@type': 'ListItem', position: 3, name: 'Chemistry', item: HUB_URL },
        ],
    };
}

function buildCollectionPageSchema(chapters: JmpChapterMeta[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': `${HUB_URL}#collection`,
        url: HUB_URL,
        name: 'JEE Main Chemistry PYQs — Chapter-wise',
        description: 'JEE Main chemistry previous year questions organised by NCERT chapter.',
        inLanguage: 'en',
        author: PAARAS_PERSON,
        publisher: CANVAS_ORG,
        about: 'JEE Main chemistry previous year questions',
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: chapters.length,
            itemListElement: chapters.map((ch, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: `${BASE_URL}/jee-main-pyqs/chemistry/${ch.slug}`,
                name: `JEE Main PYQs — ${ch.name}`,
                description: `${ch.questionCount} JEE Main previous year questions on ${ch.name} (Class ${ch.classLevel}).`,
            })),
        },
    };
}

const TYPE_STYLES: Record<JmpChapterMeta['chapterType'], string> = {
    physical: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
    organic: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    inorganic: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    practical: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
};

const TYPE_LABELS: Record<JmpChapterMeta['chapterType'], string> = {
    physical: 'Physical',
    organic: 'Organic',
    inorganic: 'Inorganic',
    practical: 'Practical',
};

function ChapterCard({ chapter }: { chapter: JmpChapterMeta }) {
    return (
        <Link
            href={`/jee-main-pyqs/chemistry/${chapter.slug}`}
            className="group relative rounded-xl border border-gray-700/50 bg-gray-900/40 p-5 hover:border-orange-500/40 hover:bg-gray-900/70 transition-all"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${TYPE_STYLES[chapter.chapterType]}`}
                >
                    {TYPE_LABELS[chapter.chapterType]}
                </span>
                <span className="text-xs text-gray-500 font-mono whitespace-nowrap">
                    {chapter.questionCount} PYQ{chapter.questionCount === 1 ? '' : 's'}
                </span>
            </div>
            <h3 className="text-base md:text-lg font-semibold text-white mb-1 leading-snug group-hover:text-orange-100 transition-colors">
                {chapter.name}
            </h3>
            <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">Class {chapter.classLevel}</span>
                <span className="text-orange-400 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">
                    View →
                </span>
            </div>
        </Link>
    );
}

export default function JeeMainChemistryHubPage() {
    const manifest = getManifest();
    const chapters = getActiveChapters();
    const class11 = chapters.filter((c) => c.classLevel === 11);
    const class12 = chapters.filter((c) => c.classLevel === 12);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbSchema()) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(buildCollectionPageSchema(chapters)) }}
            />

            <main className="min-h-screen bg-[#0d1117] text-white">
                {/* Hero */}
                <section className="relative pt-20 pb-10 md:pt-24 md:pb-14 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-transparent" />
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

                    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
                            <Link href="/" className="hover:text-gray-300">Home</Link>
                            <span className="mx-2">/</span>
                            <Link href="/jee-main-pyqs" className="hover:text-gray-300">JEE Main PYQs</Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-300">Chemistry</span>
                        </nav>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
                            <span className="text-xs font-medium text-orange-400 tracking-wide uppercase">
                                {manifest.totalQuestions.toLocaleString()} PYQs · {chapters.length} Chapters
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-[1.15] tracking-tight">
                            <span className="bg-gradient-to-r from-white via-orange-100 to-amber-300 bg-clip-text text-transparent">
                                JEE Main Chemistry PYQs
                            </span>
                        </h1>

                        <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                            Every JEE Main chemistry previous year question, organised by NCERT chapter.
                            Each question tagged with year and shift. Detailed solutions by Paaras Sir.
                        </p>
                    </div>
                </section>

                {/* Class 11 */}
                {class11.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                        <div className="flex items-center gap-3 mb-5">
                            <h2 className="text-xl md:text-2xl font-bold text-white">Class 11</h2>
                            <span className="text-xs text-gray-500 font-mono">
                                {class11.length} chapters · {class11.reduce((s, c) => s + c.questionCount, 0)} PYQs
                            </span>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {class11.map((c) => (
                                <ChapterCard key={c.id} chapter={c} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Class 12 */}
                {class12.length > 0 && (
                    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="flex items-center gap-3 mb-5">
                            <h2 className="text-xl md:text-2xl font-bold text-white">Class 12</h2>
                            <span className="text-xs text-gray-500 font-mono">
                                {class12.length} chapters · {class12.reduce((s, c) => s + c.questionCount, 0)} PYQs
                            </span>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {class12.map((c) => (
                                <ChapterCard key={c.id} chapter={c} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Stats / context block */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                    <div className="bg-gray-900/40 rounded-2xl border border-gray-700/50 p-6 md:p-8">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                            How to use this archive
                        </h2>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-3">
                            Pick a chapter you've finished revising, scan the list of PYQs from that chapter,
                            and try to solve each one before reading the explanation. Note which years a
                            concept gets repeated — JEE Main reuses around 30-40% of patterns each year, and
                            the repeating ones are usually obvious in chapter-wise view.
                        </p>
                        <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                            For tracked practice with adaptive difficulty and personalised recommendations,
                            move to <Link href="/the-crucible" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">The Crucible</Link>.
                            This archive is the free chapter-wise browse layer; The Crucible is where you do
                            timed, tracked practice.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}
