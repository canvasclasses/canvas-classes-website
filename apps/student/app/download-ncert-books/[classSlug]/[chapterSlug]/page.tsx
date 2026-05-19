import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowRight, BookOpen, FileText, FlaskConical, ChevronRight } from 'lucide-react';
import {
    fetchNcertBooksData,
    getChapterGroupBySlug,
    getChapterGroupsForClass,
    CHEMISTRY_CLASS_NUMS,
    type ChapterGroup,
} from '@/features/books/data/ncertBooksData';

const BASE_URL = 'https://www.canvasclasses.in';

type LegacyClassNum = '9' | '10' | '11' | '12';

function parseClassSlug(classSlug: string): LegacyClassNum | null {
    const match = classSlug.match(/^class-(\d+)$/);
    if (!match) return null;
    const num = match[1];
    return (['9', '10', '11', '12'] as LegacyClassNum[]).includes(num as LegacyClassNum)
        ? (num as LegacyClassNum)
        : null;
}

interface RouteParams {
    classSlug: string;
    chapterSlug: string;
}

export async function generateStaticParams(): Promise<RouteParams[]> {
    const data = await fetchNcertBooksData();
    const params: RouteParams[] = [];
    for (const classNum of CHEMISTRY_CLASS_NUMS) {
        const groups = getChapterGroupsForClass(data, classNum);
        for (const g of groups) {
            params.push({ classSlug: `class-${classNum}`, chapterSlug: g.slug });
        }
    }
    return params;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<RouteParams>;
}): Promise<Metadata> {
    const { classSlug, chapterSlug } = await params;
    const classNum = parseClassSlug(classSlug);
    if (!classNum) return {};
    const group = await getChapterGroupBySlug(classNum, chapterSlug);
    if (!group) return {};

    const title = `${group.title} — NCERT Class ${classNum} ${group.subject} PDF Download (2025-26)`;
    const description = `Download the NCERT Class ${classNum} ${group.subject} chapter on ${group.title} as PDF — official textbook${group.exemplar ? ', exemplar problems' : ''}${group.labManual ? ', and lab manual practical' : ''}. CBSE 2025-26 syllabus. Read online or download free.`;
    const url = `${BASE_URL}/download-ncert-books/${classSlug}/${chapterSlug}`;

    return {
        title,
        description,
        alternates: { canonical: url },
        openGraph: {
            title,
            description,
            type: 'article',
            url,
            locale: 'en_IN',
            siteName: 'Canvas Classes',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
    };
}

function buildStructuredData(group: ChapterGroup) {
    const url = `${BASE_URL}/download-ncert-books/class-${group.classNum}/${group.slug}`;
    const resources: Array<Record<string, unknown>> = [];
    if (group.textbook) {
        resources.push({
            '@type': 'LearningResource',
            name: `${group.title} — NCERT Class ${group.classNum} ${group.subject} Textbook`,
            url,
            inLanguage: 'en-IN',
            educationalLevel: `CBSE Class ${group.classNum}`,
            educationalAlignment: {
                '@type': 'AlignmentObject',
                alignmentType: 'educationalSubject',
                educationalFramework: 'NCERT',
                targetName: `Class ${group.classNum} ${group.subject}`,
            },
            learningResourceType: 'Textbook',
            isAccessibleForFree: true,
        });
    }
    if (group.exemplar) {
        resources.push({
            '@type': 'LearningResource',
            name: `${group.title} — NCERT Exemplar Problems Class ${group.classNum} ${group.subject}`,
            url,
            inLanguage: 'en-IN',
            educationalLevel: `CBSE Class ${group.classNum}`,
            learningResourceType: 'Exemplar',
            isAccessibleForFree: true,
        });
    }
    if (group.labManual) {
        resources.push({
            '@type': 'LearningResource',
            name: `${group.labManual.title} — NCERT Lab Manual Class ${group.classNum} ${group.subject}`,
            url,
            inLanguage: 'en-IN',
            educationalLevel: `CBSE Class ${group.classNum}`,
            learningResourceType: 'Lab Manual',
            isAccessibleForFree: true,
        });
    }

    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebPage',
                '@id': url,
                url,
                name: `${group.title} — NCERT Class ${group.classNum} ${group.subject} PDF Download`,
                inLanguage: 'en-IN',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${BASE_URL}#website`,
                    name: 'Canvas Classes',
                    url: BASE_URL,
                },
                breadcrumb: { '@id': `${url}#breadcrumb` },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'NCERT Chemistry PDFs',
                        item: `${BASE_URL}/download-ncert-books`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: `Class ${group.classNum}`,
                        item: `${BASE_URL}/download-ncert-books/class-${group.classNum}`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 4,
                        name: group.title,
                        item: url,
                    },
                ],
            },
            ...resources,
        ],
    };
}

interface ResourceCardProps {
    label: string;
    title: string;
    pdfUrl: string;
    accent: 'indigo' | 'amber' | 'emerald';
    icon: 'textbook' | 'exemplar' | 'lab';
}

const ACCENTS = {
    indigo: {
        ring: 'border-indigo-500/30 bg-indigo-500/5',
        chip: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        button:
            'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500',
    },
    amber: {
        ring: 'border-amber-500/30 bg-amber-500/5',
        chip: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        button:
            'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500',
    },
    emerald: {
        ring: 'border-emerald-500/30 bg-emerald-500/5',
        chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        button:
            'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500',
    },
};

const ICONS = {
    textbook: BookOpen,
    exemplar: FileText,
    lab: FlaskConical,
};

function ResourceCard({ label, title, pdfUrl, accent, icon }: ResourceCardProps) {
    const Icon = ICONS[icon];
    const a = ACCENTS[accent];
    return (
        <div className={`rounded-2xl border ${a.ring} p-5 md:p-6`}>
            <div className="mb-4 flex items-center justify-between">
                <span
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${a.chip}`}
                >
                    <Icon size={14} />
                    {label}
                </span>
                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition ${a.button}`}
                >
                    Open PDF <ArrowRight size={14} />
                </a>
            </div>
            <h3 className="mb-3 text-lg font-bold text-white md:text-xl">{title}</h3>
            <div className="aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/10 bg-black md:aspect-[4/3]">
                <iframe
                    src={pdfUrl}
                    title={title}
                    loading="lazy"
                    className="h-full w-full"
                    allow="autoplay"
                />
            </div>
        </div>
    );
}

export default async function NcertChapterPage({
    params,
}: {
    params: Promise<RouteParams>;
}) {
    const { classSlug, chapterSlug } = await params;
    const classNum = parseClassSlug(classSlug);
    if (!classNum) notFound();

    const group = await getChapterGroupBySlug(classNum, chapterSlug);
    if (!group) notFound();

    const structuredData = buildStructuredData(group);

    return (
        <>
            <Script
                id={`ncert-chapter-${classNum}-${group.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <main className="min-h-screen bg-gray-950 text-white">
                <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-zinc-400">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <ChevronRight size={14} className="text-zinc-600" />
                        <Link href="/download-ncert-books" className="hover:text-white">
                            NCERT Chemistry PDFs
                        </Link>
                        <ChevronRight size={14} className="text-zinc-600" />
                        <span className="text-zinc-300">Class {classNum}</span>
                        <ChevronRight size={14} className="text-zinc-600" />
                        <span className="text-white">{group.title}</span>
                    </nav>

                    {/* Header */}
                    <header className="mb-10">
                        <span className="mb-3 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
                            Class {classNum} {group.subject} · NCERT 2025-26
                        </span>
                        <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                            {group.title}
                        </h1>
                        <p className="text-base leading-relaxed text-zinc-300 md:text-lg">
                            Download the official NCERT Class {classNum} {group.subject} resources for{' '}
                            <strong className="text-white">{group.title}</strong>, aligned to the
                            CBSE 2025-26 syllabus. Preview each PDF instantly in your browser or
                            open it in a new tab to download.
                        </p>
                    </header>

                    {/* What's available */}
                    <section className="mb-10 rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
                        <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-zinc-400">
                            Resources for this chapter
                        </h2>
                        <ul className="space-y-2 text-sm text-zinc-300 md:text-base">
                            <li className="flex items-center gap-2">
                                <span
                                    className={`h-2 w-2 rounded-full ${group.textbook ? 'bg-indigo-400' : 'bg-zinc-700'}`}
                                />
                                NCERT Textbook chapter PDF{' '}
                                {group.textbook ? '— available' : '— not available'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={`h-2 w-2 rounded-full ${group.exemplar ? 'bg-amber-400' : 'bg-zinc-700'}`}
                                />
                                NCERT Exemplar problems{' '}
                                {group.exemplar ? '— available' : '— not available'}
                            </li>
                            <li className="flex items-center gap-2">
                                <span
                                    className={`h-2 w-2 rounded-full ${group.labManual ? 'bg-emerald-400' : 'bg-zinc-700'}`}
                                />
                                Lab Manual practical{' '}
                                {group.labManual ? '— available' : '— not available'}
                            </li>
                        </ul>
                    </section>

                    {/* Resource cards */}
                    <div className="space-y-6">
                        {group.textbook && (
                            <ResourceCard
                                label="Textbook"
                                title={`${group.title} — NCERT Class ${classNum} ${group.subject} Textbook`}
                                pdfUrl={group.textbook.pdfUrl}
                                accent="indigo"
                                icon="textbook"
                            />
                        )}
                        {group.exemplar && (
                            <ResourceCard
                                label="Exemplar"
                                title={`${group.title} — NCERT Exemplar Problems`}
                                pdfUrl={group.exemplar.pdfUrl}
                                accent="amber"
                                icon="exemplar"
                            />
                        )}
                        {group.labManual && (
                            <ResourceCard
                                label="Lab Manual"
                                title={`${group.labManual.title} — NCERT Lab Manual Class ${classNum} ${group.subject}`}
                                pdfUrl={group.labManual.pdfUrl}
                                accent="emerald"
                                icon="lab"
                            />
                        )}
                    </div>

                    {/* About this chapter */}
                    <section className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6">
                        <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">
                            About {group.title}
                        </h2>
                        <p className="text-sm leading-relaxed text-zinc-300 md:text-base">
                            <strong className="text-white">{group.title}</strong> is a chapter in
                            the NCERT Class {classNum} {group.subject} syllabus prescribed by CBSE
                            for the 2025-26 academic session. The official NCERT resources on this
                            page are reproduced from the publicly available NCERT release and are
                            useful for CBSE board preparation and competitive entrance exams.
                        </p>
                    </section>

                    {/* Cross-link strip */}
                    <section className="mt-10 grid gap-4 md:grid-cols-3">
                        <Link
                            href={`/ncert-solutions/class-${classNum}`}
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-indigo-500/40 hover:bg-indigo-500/5"
                        >
                            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-indigo-300">
                                Solutions
                            </p>
                            <p className="text-sm text-white md:text-base">
                                NCERT Class {classNum} Solutions →
                            </p>
                            <p className="mt-2 text-xs text-zinc-400">
                                Step-by-step answers for every textbook question.
                            </p>
                        </Link>
                        <Link
                            href="/chemistry-questions"
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-amber-500/40 hover:bg-amber-500/5"
                        >
                            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-300">
                                Practice
                            </p>
                            <p className="text-sm text-white md:text-base">
                                Practice Questions →
                            </p>
                            <p className="mt-2 text-xs text-zinc-400">
                                MCQs and previous-year questions for board &amp; competitive exams.
                            </p>
                        </Link>
                        <Link
                            href="/handwritten-notes"
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/5"
                        >
                            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-emerald-300">
                                Notes
                            </p>
                            <p className="text-sm text-white md:text-base">
                                Handwritten Notes by Paaras Sir →
                            </p>
                            <p className="mt-2 text-xs text-zinc-400">
                                Concise, exam-focused notes for every chapter.
                            </p>
                        </Link>
                    </section>

                    {/* Disclaimer */}
                    <p className="mt-12 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs text-zinc-500">
                        NCERT books and exemplar problems are published by the National Council of
                        Educational Research and Training (NCERT), Government of India, and are
                        publicly available. Canvas Classes hosts these PDFs for ease of access by
                        students. All copyrights are owned by NCERT.
                    </p>
                </div>
            </main>
        </>
    );
}
