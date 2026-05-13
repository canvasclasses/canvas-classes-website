import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ChevronRight, FlaskConical } from 'lucide-react';
import {
    fetchHandwrittenNotes,
    type HandwrittenNote,
} from '../../lib/handwrittenNotesData';
import {
    CHAPTER_META_LIST,
    getChapterMetaBySlug,
    type ChapterMeta,
} from '../chapterMetadata';
import ChapterNotesGrid from './ChapterNotesGrid';
import ChapterToolCard from './ChapterToolCard';
import { getToolCardForSlug } from './toolCardConfig';
import ChapterHero from './ChapterHero';
import CrucibleHeroRail from './CrucibleHeroRail';
import ChapterTopicTOC from './ChapterTopicTOC';
import TeacherCard from './TeacherCard';
import NextChapterCard from './NextChapterCard';
import { getChapterCrucibleStats, getTopicQuestionCounts } from './chapterStats.server';

const BASE_URL = 'https://www.canvasclasses.in';

// Same OG image as the index page — branded social-share preview. Per-chapter
// images would be ideal but a single default is 80% of the value with 5% of
// the work; revisit if/when chapter-specific covers exist.
const OG_IMAGE_URL =
    'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/handwritten-notes/Black%20notes%20by%20Paaras%20Sir.webp';

// Author Person entity, referenced from each LearningResource via @id.
const PAARAS_PERSON = {
    '@type': 'Person' as const,
    '@id': `${BASE_URL}#paaras-sir`,
    name: 'Paaras Sir',
    description:
        'Chemistry educator at Canvas Classes. Founder and lead author of the handwritten Chemistry notes used by JEE, NEET and CBSE students.',
    jobTitle: 'Chemistry Educator',
    worksFor: {
        '@type': 'Organization',
        '@id': `${BASE_URL}#org`,
        name: 'Canvas Classes',
        url: BASE_URL,
    },
};

const DATE_PUBLISHED = '2025-09-01T00:00:00+05:30';

interface RouteParams {
    chapter: string;
}

// Build static pages only for chapters that actually have notes available.
export async function generateStaticParams(): Promise<RouteParams[]> {
    const notes = await fetchHandwrittenNotes();
    const chaptersWithNotes = new Set(notes.map((n) => n.chapter));
    return CHAPTER_META_LIST
        .filter((c) => chaptersWithNotes.has(c.chapterName))
        .map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<RouteParams>;
}): Promise<Metadata> {
    const { chapter } = await params;
    const meta = getChapterMetaBySlug(chapter);
    if (!meta) return {};

    const url = `${BASE_URL}/handwritten-notes/${meta.slug}`;
    return {
        title: meta.seoTitle,
        description: meta.metaDescription,
        alternates: { canonical: url },
        authors: [{ name: 'Paaras Sir', url: BASE_URL }],
        creator: 'Paaras Sir',
        publisher: 'Canvas Classes',
        openGraph: {
            title: meta.seoTitle,
            description: meta.metaDescription,
            type: 'article',
            url,
            locale: 'en_IN',
            siteName: 'Canvas Classes',
            images: [
                {
                    url: OG_IMAGE_URL,
                    width: 1200,
                    height: 630,
                    alt: `${meta.chapterName} — Handwritten Chemistry Notes by Paaras Sir`,
                    type: 'image/webp',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.seoTitle,
            description: meta.metaDescription,
            images: [OG_IMAGE_URL],
            creator: '@canvasclasses',
        },
    };
}

function buildStructuredData(meta: ChapterMeta, notes: HandwrittenNote[]) {
    const url = `${BASE_URL}/handwritten-notes/${meta.slug}`;
    const dateModified = new Date().toISOString();
    return {
        '@context': 'https://schema.org',
        '@graph': [
            // Author entity — referenced by every LearningResource via @id.
            PAARAS_PERSON,
            {
                '@type': 'WebPage',
                '@id': url,
                url,
                name: meta.seoTitle,
                description: meta.metaDescription,
                inLanguage: 'en-IN',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': `${BASE_URL}#website`,
                    name: 'Canvas Classes',
                    url: BASE_URL,
                },
                breadcrumb: { '@id': `${url}#breadcrumb` },
                primaryImageOfPage: {
                    '@type': 'ImageObject',
                    url: OG_IMAGE_URL,
                    width: 1200,
                    height: 630,
                },
                creator: { '@id': `${BASE_URL}#paaras-sir` },
                datePublished: DATE_PUBLISHED,
                dateModified,
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${url}#breadcrumb`,
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Handwritten Chemistry Notes',
                        item: `${BASE_URL}/handwritten-notes`,
                    },
                    {
                        '@type': 'ListItem',
                        position: 3,
                        name: meta.chapterName,
                        item: url,
                    },
                ],
            },
            ...notes.map((note) => ({
                '@type': 'LearningResource',
                '@id': `${url}#note-${note.id}`,
                name: note.title,
                url: note.notesUrl,
                inLanguage: 'en-IN',
                educationalLevel: `CBSE Class ${meta.classLevel}`,
                educationalAlignment: {
                    '@type': 'AlignmentObject',
                    alignmentType: 'educationalSubject',
                    educationalFramework: 'NCERT',
                    targetName: `Class ${meta.classLevel} Chemistry — ${meta.chapterName}`,
                },
                learningResourceType: 'Handwritten Notes',
                isAccessibleForFree: true,
                about: { '@type': 'Thing', name: meta.chapterName },
                author: { '@id': `${BASE_URL}#paaras-sir` },
                creator: { '@id': `${BASE_URL}#paaras-sir` },
                datePublished: DATE_PUBLISHED,
                dateModified,
            })),
            {
                '@type': 'FAQPage',
                '@id': `${url}#faq`,
                mainEntity: meta.faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.q,
                    acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
            },
        ],
    };
}

// NoteCard rendering moved into ChapterNotesGrid (client component) so that
// clicks open the inline PDF viewer instead of navigating away.

export default async function ChapterNotesPage({
    params,
}: {
    params: Promise<RouteParams>;
}) {
    const { chapter } = await params;
    const meta = getChapterMetaBySlug(chapter);
    if (!meta) notFound();

    const allNotes = await fetchHandwrittenNotes();
    const chapterNotes = allNotes.filter((n) => n.chapter === meta.chapterName);

    if (chapterNotes.length === 0) notFound();

    const structuredData = buildStructuredData(meta, chapterNotes);

    const related = meta.relatedSlugs
        .map((slug) => getChapterMetaBySlug(slug))
        .filter((c): c is ChapterMeta => Boolean(c));

    // Fetch real Crucible stats (server-side, build-time) so the hero rail,
    // stats strip, and topic TOC all render with live numbers. Both helpers
    // tolerate Mongo being unreachable and fall back to empty results — the
    // hero degrades to the chapter intro alone in that case.
    const [crucibleStats, topicCounts] = await Promise.all([
        getChapterCrucibleStats(meta.crucibleChapterId || ''),
        getTopicQuestionCounts(meta.crucibleChapterId || ''),
    ]);

    return (
        <>
            <Script
                id={`notes-chapter-${meta.slug}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <main className="min-h-screen bg-gray-950 text-white">
                <div className="mx-auto max-w-[1400px] px-4 pt-28 pb-10 md:pt-32 md:pb-16">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-zinc-400">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <ChevronRight size={14} className="text-zinc-600" />
                        <Link href="/handwritten-notes" className="hover:text-white">
                            Handwritten Notes
                        </Link>
                        <ChevronRight size={14} className="text-zinc-600" />
                        <span className="text-white">{meta.chapterName}</span>
                    </nav>

                    {/* Hero + notes grid — page-level 2-col layout so the notes
                        section flows directly under the chapter intro on the left
                        and shares the column height with the sticky Crucible rail
                        on the right. Eliminates the empty space that appeared
                        between the trust strip and the next section when the rail
                        was taller than the intro alone. */}
                    <div className="mb-12 grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                        <div className="min-w-0">
                            <header className="mb-10">
                                <ChapterHero
                                    meta={meta}
                                    notes={chapterNotes}
                                    crucibleStats={crucibleStats}
                                />
                            </header>

                            {/* Notes available */}
                            <section>
                                <div className="mb-4 flex items-baseline justify-between">
                                    <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">
                                        Notes available for this chapter
                                    </h2>
                                    <span className="hidden sm:inline text-[11px] text-zinc-600">
                                        Tap any note to read inline →
                                    </span>
                                </div>
                                <ChapterNotesGrid
                                    notes={chapterNotes}
                                    crucibleChapterId={meta.crucibleChapterId}
                                    chapterName={meta.chapterName}
                                />
                            </section>
                        </div>

                        {/* Sticky Crucible rail — desktop only. Lives at the page
                            level so it can sit alongside both the hero intro AND
                            the notes section without leaving empty space. */}
                        {meta.crucibleChapterId && (
                            <div className="hidden lg:block">
                                <CrucibleHeroRail
                                    chapterId={meta.crucibleChapterId}
                                    chapterName={meta.chapterName}
                                    stats={crucibleStats}
                                />
                            </div>
                        )}
                    </div>

                    {/* Companion tool card (Flashcards / Periodic Explorer / Salt Sim / …).
                        Crucible practice moved into the hero rail above; this section is
                        now just the optional chapter-specific tool. Skipped entirely for
                        chapters without a companion tool. */}
                    {(() => {
                        const toolConfig = getToolCardForSlug(meta.slug);
                        if (!toolConfig) return null;
                        return (
                            <section className="mb-12">
                                <ChapterToolCard />
                            </section>
                        );
                    })()}

                    {/* What's inside · N topics — TOC sourced from the canonical
                        taxonomy with live PYQ counts per topic. */}
                    {meta.crucibleChapterId && (
                        <section className="mb-12">
                            <h2 className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                                What&apos;s inside
                            </h2>
                            <ChapterTopicTOC
                                crucibleChapterId={meta.crucibleChapterId}
                                topicCounts={topicCounts}
                            />
                        </section>
                    )}

                    {/* Written by — single author for now (Paaras Sir). */}
                    <section className="mb-12">
                        <h2 className="mb-4 font-mono text-[13px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                            Written by
                        </h2>
                        <TeacherCard />
                    </section>

                    {/* Read alongside NCERT — chapter-specific deep links into
                        the textbook PDF and the solutions hub. Only renders when
                        the corresponding NCERT page actually exists for this
                        chapter (slugs verified in chapterMetadata.ts), so we
                        never link to 404s. Builds internal-link equity between
                        /handwritten-notes/, /download-ncert-books/, and
                        /ncert-solutions/. */}
                    {(meta.ncertBooksSlug || meta.ncertSolutionsSlug) && (
                        <section className="mb-12">
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                                Read alongside NCERT
                            </h2>
                            <div className="grid gap-3 md:grid-cols-2">
                                {meta.ncertBooksSlug && (
                                    <Link
                                        href={`/download-ncert-books/class-${meta.classLevel}/${meta.ncertBooksSlug}`}
                                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-indigo-500/40 hover:bg-indigo-500/[0.04]"
                                    >
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-indigo-300">
                                            NCERT Textbook
                                        </p>
                                        <p className="mb-1 text-base font-semibold text-white group-hover:text-indigo-200">
                                            {meta.chapterName} — Class {meta.classLevel} PDF
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            Open the official NCERT textbook chapter — read
                                            online or download free.
                                        </p>
                                        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-300">
                                            Open textbook <ChevronRight size={11} />
                                        </p>
                                    </Link>
                                )}
                                {meta.ncertSolutionsSlug && (
                                    <Link
                                        href={`/ncert-solutions/class-${meta.classLevel}/${meta.ncertSolutionsSlug}`}
                                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-emerald-500/40 hover:bg-emerald-500/[0.04]"
                                    >
                                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                                            NCERT Solutions
                                        </p>
                                        <p className="mb-1 text-base font-semibold text-white group-hover:text-emerald-200">
                                            {meta.chapterName} — Step-by-step Solutions
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            Worked answers for every NCERT exercise question
                                            in this chapter.
                                        </p>
                                        <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                                            Open solutions <ChevronRight size={11} />
                                        </p>
                                    </Link>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Related chapters */}
                    {related.length > 0 && (
                        <section className="mb-12">
                            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
                                Related chapters
                            </h2>
                            <div className="grid gap-3 md:grid-cols-3">
                                {related.map((r) => (
                                    <Link
                                        key={r.slug}
                                        href={`/handwritten-notes/${r.slug}`}
                                        className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-amber-500/30 hover:bg-amber-500/[0.04]"
                                    >
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                            Class {r.classLevel} · {r.subject}
                                        </p>
                                        <p className="mb-2 text-sm font-semibold text-white group-hover:text-amber-300 md:text-base">
                                            {r.chapterName}
                                        </p>
                                        <p className="inline-flex items-center gap-1 text-xs text-zinc-500 group-hover:text-zinc-400">
                                            View notes <ChevronRight size={11} />
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* FAQ */}
                    <section className="mb-12">
                        <h2 className="mb-4 text-xl font-bold text-white md:text-2xl">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-2">
                            {meta.faqs.map((faq, i) => (
                                <details
                                    key={i}
                                    className="group rounded-xl border border-white/[0.07] bg-white/[0.02] open:bg-white/[0.04]"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-zinc-300 marker:hidden md:text-base">
                                        {faq.q}
                                        <span className="shrink-0 text-lg leading-none text-zinc-500 transition-transform group-open:rotate-45">
                                            +
                                        </span>
                                    </summary>
                                    <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-400 md:text-base">
                                        {faq.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </section>

                    {/* Up next · Chapter N — sequential reading flow. Hidden when
                        no next chapter exists for the class level. */}
                    <section className="mb-10">
                        <NextChapterCard current={meta} />
                    </section>

                    {/* Back link */}
                    <div className="border-t border-white/[0.07] pt-6">
                        <Link
                            href="/handwritten-notes"
                            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
                        >
                            <ChevronRight size={14} className="rotate-180" />
                            Back to all handwritten notes
                        </Link>
                    </div>

                    {/* Disclaimer */}
                    <p className="mt-8 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-zinc-500">
                        <FlaskConical size={12} className="mr-1.5 inline" />
                        These handwritten notes are written by Paaras Sir at Canvas Classes and follow the
                        NCERT Class {meta.classLevel} Chemistry syllabus prescribed by CBSE for the 2025-26
                        session. Free to read online or download as PDF — no login required.
                    </p>
                </div>
            </main>
        </>
    );
}
