'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HandwrittenNote, getUniqueCategories, getNotesStats, toInlineViewerUrl } from '../data/handwrittenNotesData';
import { getChapterMetaByName } from '../data/chapterMetadata';
import {
    Search, Download, FileText, BookOpen, FlaskConical, Atom, Sparkles,
    X, ChevronRight, Zap, Target, TrendingUp, Wand2, Layers,
    ArrowRight, Bookmark, BookmarkCheck, Flame,
    SortAsc, Clock, ExternalLink,
} from 'lucide-react';

// =============================================================================
// CATEGORY STYLES
// =============================================================================

type CategoryKey = 'Organic Chemistry' | 'Inorganic Chemistry' | 'Physical Chemistry' | 'General chemistry';

const categoryStyles: Record<string, {
    icon: React.ElementType;
    text: string;
    border: string;        // hover border for full card
    leftBorder: string;    // colored left edge — instant scan signal
    bg: string;            // subtle bg for icon chips
    pill: string;          // category pill
    activeTab: string;
    accent: string;        // hex/rgb for shadow / glow
}> = {
    'Organic Chemistry': {
        icon: FlaskConical,
        text: 'text-pink-400',
        border: 'hover:border-pink-500/40',
        leftBorder: 'before:bg-pink-500',
        bg: 'bg-pink-500/10',
        pill: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
        activeTab: 'bg-pink-500/15 text-pink-300 border-pink-500/40',
        accent: 'rgba(236,72,153,0.18)',
    },
    'Inorganic Chemistry': {
        icon: Atom,
        text: 'text-purple-400',
        border: 'hover:border-purple-500/40',
        leftBorder: 'before:bg-purple-500',
        bg: 'bg-purple-500/10',
        pill: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        activeTab: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
        accent: 'rgba(168,85,247,0.18)',
    },
    'Physical Chemistry': {
        icon: Sparkles,
        text: 'text-cyan-400',
        border: 'hover:border-cyan-500/40',
        leftBorder: 'before:bg-cyan-500',
        bg: 'bg-cyan-500/10',
        pill: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
        activeTab: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40',
        accent: 'rgba(6,182,212,0.18)',
    },
    'General chemistry': {
        icon: BookOpen,
        text: 'text-amber-400',
        border: 'hover:border-amber-500/40',
        leftBorder: 'before:bg-amber-500',
        bg: 'bg-amber-500/10',
        pill: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        activeTab: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        accent: 'rgba(245,158,11,0.18)',
    },
};

const getCategoryStyle = (cat: string) =>
    categoryStyles[cat] ?? categoryStyles['General chemistry'];

// =============================================================================
// CROSS-PROMO TOOL CATALOG (used context-aware below)
// =============================================================================

type Tool = {
    name: string;
    hook: string;
    href: string;
    icon: React.ElementType;
    badge: string;
    iconBg: string;
    iconColor: string;
    border: string;
    badgeBg: string;
    relevantTo: Array<CategoryKey | string>; // categories OR chapter names
};

const TOOLS: Tool[] = [
    {
        name: 'BITSAT 2026 Master Plan',
        hook: '30-day Chemistry plan from real Session 1 data.',
        href: '/bitsat-chemistry-revision',
        icon: Flame,
        badge: 'New',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        border: 'border-orange-500/30 hover:border-orange-500/60',
        badgeBg: 'bg-orange-500/20 text-orange-300',
        relevantTo: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'General chemistry'],
    },
    {
        name: 'The Crucible',
        hook: 'Adaptive practice engine for JEE & NEET.',
        href: '/the-crucible',
        icon: Target,
        badge: '4,000+ Questions',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        border: 'border-orange-500/20 hover:border-orange-500/50',
        badgeBg: 'bg-orange-500/20 text-orange-300',
        relevantTo: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'General chemistry'],
    },
    {
        name: 'Interactive Periodic Table',
        hook: 'Every trend, exception & property — one page.',
        href: '/interactive-periodic-table',
        icon: Layers,
        badge: 'Interactive',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-400',
        border: 'border-blue-500/20 hover:border-blue-500/50',
        badgeBg: 'bg-blue-500/20 text-blue-300',
        relevantTo: ['Inorganic Chemistry', 'p-Block', 's-Block', 'd & f Block', 'Periodic Properties', 'Inorganic Trivia'],
    },
    {
        name: 'Chemistry Flashcards',
        hook: 'Flash through key formulas in 5 minutes.',
        href: '/chemistry-flashcards',
        icon: Zap,
        badge: 'Quick Revision',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-400',
        border: 'border-emerald-500/20 hover:border-emerald-500/50',
        badgeBg: 'bg-emerald-500/20 text-emerald-300',
        relevantTo: ['Organic Chemistry', 'Inorganic Chemistry', 'Physical Chemistry', 'General chemistry'],
    },
    {
        name: 'Periodic Trends',
        hook: 'The trends examiners love to test.',
        href: '/periodic-trends',
        icon: TrendingUp,
        badge: 'P, D & F Block',
        iconBg: 'bg-purple-500/10',
        iconColor: 'text-purple-400',
        border: 'border-purple-500/20 hover:border-purple-500/50',
        badgeBg: 'bg-purple-500/20 text-purple-300',
        relevantTo: ['Inorganic Chemistry', 'p-Block', 's-Block', 'd & f Block', 'Periodic Properties', 'Inorganic Trivia'],
    },
    {
        name: 'Organic Wizard',
        hook: 'Name reactions & mechanisms, instant lookup.',
        href: '/organic-wizard',
        icon: Wand2,
        badge: 'Name Reactions',
        iconBg: 'bg-pink-500/10',
        iconColor: 'text-pink-400',
        border: 'border-pink-500/20 hover:border-pink-500/50',
        badgeBg: 'bg-pink-500/20 text-pink-300',
        relevantTo: ['Organic Chemistry', 'Name Reactions', 'GOC & Mechanisms', 'Hydrocarbons & Halides'],
    },
    {
        name: 'Salt Analysis Simulator',
        hook: 'Identify cations & anions step-by-step.',
        href: '/salt-analysis',
        icon: FlaskConical,
        badge: 'Lab Sim',
        iconBg: 'bg-orange-500/10',
        iconColor: 'text-orange-400',
        border: 'border-orange-500/20 hover:border-orange-500/50',
        badgeBg: 'bg-orange-500/20 text-orange-300',
        relevantTo: ['Inorganic Chemistry', 'Salt Analysis', 'Practical Chemistry'],
    },
    {
        name: 'Ksp Calculator',
        hook: 'Solve solubility-product problems live.',
        href: '/solubility-product-ksp-calculator',
        icon: Sparkles,
        badge: 'Calculator',
        iconBg: 'bg-cyan-500/10',
        iconColor: 'text-cyan-400',
        border: 'border-cyan-500/20 hover:border-cyan-500/50',
        badgeBg: 'bg-cyan-500/20 text-cyan-300',
        relevantTo: ['Physical Chemistry', 'Ionic Equilibrium'],
    },
];

// Pick 5 tools most relevant to current filter context
function getRelevantTools(activeCategory: string | null): Tool[] {
    if (!activeCategory || activeCategory === 'all') {
        // Default mix — BITSAT plan first as flagship
        return [TOOLS[0], TOOLS[1], TOOLS[2], TOOLS[3], TOOLS[4]];
    }
    const matched = TOOLS.filter(t => t.relevantTo.includes(activeCategory));
    // Always include BITSAT plan + Crucible + Flashcards as a safety net
    const evergreen = [TOOLS[0], TOOLS[1], TOOLS[3]];
    const seen = new Set<string>();
    const out: Tool[] = [];
    for (const t of [...matched, ...evergreen]) {
        if (seen.has(t.name)) continue;
        seen.add(t.name);
        out.push(t);
        if (out.length >= 5) break;
    }
    return out;
}

// Per-chapter contextual recommendation (1 link per chapter group)
function getChapterRecommendation(chapter: string): Tool | null {
    const map: Record<string, string> = {
        'Solid State': 'BITSAT 2026 Master Plan',
        'p-Block': 'Periodic Trends',
        's-Block': 'Periodic Trends',
        'd & f Block': 'Periodic Trends',
        'Periodic Properties': 'Interactive Periodic Table',
        'Inorganic Trivia': 'Interactive Periodic Table',
        'Coordination Compounds': 'Periodic Trends',
        'Salt Analysis': 'Salt Analysis Simulator',
        'Practical Chemistry': 'Salt Analysis Simulator',
        'Name Reactions': 'Organic Wizard',
        'GOC & Mechanisms': 'Organic Wizard',
        'Hydrocarbons & Halides': 'Organic Wizard',
        'Ionic Equilibrium': 'Ksp Calculator',
        'Mole Concept': 'Chemistry Flashcards',
        'Atomic Structure': 'Chemistry Flashcards',
        'Chemical Bonding': 'Chemistry Flashcards',
        'Physical Chemistry Revision': 'Chemistry Flashcards',
        'Biomolecules & Polymers': 'BITSAT 2026 Master Plan',
        'Hydrogen': 'Periodic Trends',
        'Surface Chemistry': 'The Crucible',
        'Problem Sets & PYQs': 'The Crucible',
        'Strategy & Index': 'BITSAT 2026 Master Plan',
        'Mixed Organic': 'Organic Wizard',
        'Other': 'The Crucible',
    };
    const name = map[chapter];
    return TOOLS.find(t => t.name === name) ?? null;
}

// =============================================================================
// THUMBNAIL with graceful fallback (Drive throttles → fall back to icon card)
// =============================================================================

function NoteThumbnail({ note, compact = false }: { note: HandwrittenNote; compact?: boolean }) {
    const [errored, setErrored] = useState(false);
    const style = getCategoryStyle(note.category);
    const Icon = style.icon;

    if (errored || !note.thumbnailUrl) {
        return (
            <div
                className={`relative shrink-0 ${compact ? 'w-14 h-16' : 'w-full aspect-[4/3]'} rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 flex items-center justify-center`}
            >
                <Icon size={compact ? 22 : 36} className={`${style.text} opacity-60`} />
            </div>
        );
    }

    return (
        <div
            className={`relative shrink-0 ${compact ? 'w-14 h-16' : 'w-full aspect-[4/3]'} rounded-lg overflow-hidden bg-slate-900 border border-white/5`}
        >
            {/* Use unoptimized + referrerPolicy because Drive blocks Next.js image optimizer */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={note.thumbnailUrl}
                alt={`${note.title} preview`}
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setErrored(true)}
                className="absolute inset-0 w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}

// =============================================================================
// SEARCH BOX with rotating placeholder
// =============================================================================

const SEARCH_HINTS = ['Solid State', 'Aldol', 'p-Block', 'Coordination', 'Tautomerism', 'Biomolecules', 'GOC'];

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [hintIdx, setHintIdx] = useState(0);
    useEffect(() => {
        if (value) return;
        const t = setInterval(() => setHintIdx(i => (i + 1) % SEARCH_HINTS.length), 2200);
        return () => clearInterval(t);
    }, [value]);

    return (
        <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
            <input
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={`Search 39 notes — try "${SEARCH_HINTS[hintIdx]}"`}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3.5 pl-11 pr-11 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/15 transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded text-slate-500 hover:text-slate-300 transition-colors"
                    aria-label="Clear search"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}

// =============================================================================
// CHAPTER CARD — links to the dedicated /handwritten-notes/[chapter] hub page
// =============================================================================

const SUBJECT_PILL: Record<string, string> = {
    Physical: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    Organic: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    Inorganic: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    Practical: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
};

// Renders the chapter card thumbnail with a graceful fallback. The image is
// served via next/image so it's proxied through the same-origin optimizer
// (canvasclasses.in/_next/image?url=…), which sidesteps the cross-origin
// blocking that broke direct Drive thumbnail loads in privacy-strict browsers
// and ad-blocker setups. If the optimizer still fails (e.g. Drive returns 4xx),
// onError swaps to a styled placeholder.
function ChapterThumbnail({ src, alt }: { src: string | null; alt: string }) {
    const [errored, setErrored] = useState(false);
    if (!src || errored) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent text-amber-400/60">
                <FileText size={22} />
            </div>
        );
    }
    return (
        <Image
            src={src}
            alt={alt}
            width={96}
            height={128}
            sizes="96px"
            className="h-full w-full object-cover"
            onError={() => setErrored(true)}
        />
    );
}

function ChapterCard({
    chapter,
    notes,
}: {
    chapter: string;
    notes: HandwrittenNote[];
}) {
    const meta = getChapterMetaByName(chapter);
    if (!meta) return null;

    const pillClass = SUBJECT_PILL[meta.subject] ?? SUBJECT_PILL['Physical'];
    const isMainNcertChapter = Number.isInteger(meta.ncertChapterNumber);
    const thumbUrl = notes.find((n) => n.thumbnailUrl)?.thumbnailUrl ?? null;

    return (
        <Link
            href={`/handwritten-notes/${meta.slug}`}
            className="group relative flex gap-4 rounded-2xl border border-white/[0.07] bg-slate-900/40 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-500/40 hover:bg-slate-900/60 hover:shadow-lg hover:shadow-amber-500/5"
        >
            {/* Cover thumbnail — left column, fixed aspect */}
            <div className="aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black md:w-24">
                <ChapterThumbnail src={thumbUrl} alt={`${meta.chapterName} cover`} />
            </div>

            {/* Content — right column */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Top row: subject + chapter number + count */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        <span className={`shrink-0 inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-widest ${pillClass}`}>
                            {meta.subject}
                        </span>
                        {isMainNcertChapter ? (
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                                Ch {meta.ncertChapterNumber}
                            </span>
                        ) : (
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                                Bonus
                            </span>
                        )}
                    </div>
                    <span className="shrink-0 text-[11px] text-slate-500 tabular-nums">
                        {notes.length} {notes.length === 1 ? 'note' : 'notes'}
                    </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors leading-snug mb-1.5 line-clamp-2">
                    {meta.chapterName}
                </h3>

                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                    {meta.overview[0]}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors">
                        View notes
                        <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {meta.crucibleChapterId && (
                        <span className="text-[9px] text-slate-600 group-hover:text-slate-500">
                            + Practice
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

// =============================================================================
// CHAPTER GRID — NCERT-ordered (Class 11 then Class 12)
// =============================================================================

type SortKeyType = 'chapter' | 'newest' | 'title';

function ChapterGridByClass({
    chapterGroups,
    setSortKey,
}: {
    chapterGroups: Array<[string, HandwrittenNote[]]>;
    setSortKey: (k: SortKeyType) => void;
}) {
    // Split into Class 11 and Class 12 buckets, plus a fallback for chapters
    // not yet in chapterMetadata (catch-alls like "Other" / "Strategy & Index").
    const class11: Array<[string, HandwrittenNote[]]> = [];
    const class12: Array<[string, HandwrittenNote[]]> = [];
    const orphan: Array<[string, HandwrittenNote[]]> = [];

    for (const entry of chapterGroups) {
        const [chapter] = entry;
        const meta = getChapterMetaByName(chapter);
        if (!meta) {
            orphan.push(entry);
            continue;
        }
        if (meta.classLevel === 11) class11.push(entry);
        else class12.push(entry);
    }

    // Sort within each class by NCERT chapter number (ascending).
    const ncertSort = (a: [string, HandwrittenNote[]], b: [string, HandwrittenNote[]]) => {
        const am = getChapterMetaByName(a[0])?.ncertChapterNumber ?? 999;
        const bm = getChapterMetaByName(b[0])?.ncertChapterNumber ?? 999;
        return am - bm;
    };
    class11.sort(ncertSort);
    class12.sort(ncertSort);

    return (
        <div className="space-y-12">
            <ChapterClassSection
                classNumber="11"
                title="Class 11 Chemistry"
                tagline="NCERT chapters 1–14 — JEE & NEET foundation"
                badgeAccent="from-sky-500/25 to-cyan-500/10 border-sky-500/50 text-sky-300"
                barAccent="from-sky-500/60 via-sky-500/15 to-transparent"
                groups={class11}
            />
            <ChapterClassSection
                classNumber="12"
                title="Class 12 Chemistry"
                tagline="NCERT chapters 15–30 — JEE & NEET final-year syllabus"
                badgeAccent="from-violet-500/25 to-fuchsia-500/10 border-violet-500/50 text-violet-300"
                barAccent="from-violet-500/60 via-violet-500/15 to-transparent"
                groups={class12}
            />
            {/* Footnote — explain where notes from generic / catch-all chapters went */}
            {orphan.length > 0 && (
                <p className="text-center text-[11px] text-slate-600">
                    {orphan.reduce((acc, [, n]) => acc + n.length, 0)} additional notes
                    aren&apos;t mapped to a chapter yet. Use the search bar above or switch sort to{' '}
                    <button
                        onClick={() => setSortKey('newest')}
                        className="text-amber-500 hover:text-amber-400 font-medium underline-offset-2 hover:underline"
                    >
                        Newest
                    </button>{' '}
                    /{' '}
                    <button
                        onClick={() => setSortKey('title')}
                        className="text-amber-500 hover:text-amber-400 font-medium underline-offset-2 hover:underline"
                    >
                        A–Z
                    </button>{' '}
                    to see every note in a flat list.
                </p>
            )}
        </div>
    );
}

function ChapterClassSection({
    classNumber,
    title,
    tagline,
    badgeAccent,
    barAccent,
    groups,
}: {
    classNumber: string;
    title: string;
    tagline: string;
    badgeAccent: string;
    barAccent: string;
    groups: Array<[string, HandwrittenNote[]]>;
}) {
    const totalNotes = groups.reduce((acc, [, n]) => acc + n.length, 0);
    if (groups.length === 0) return null;

    return (
        <section>
            <div className="mb-6">
                <div className="flex items-center gap-4">
                    {/* Big class-number badge — instant visual anchor */}
                    <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border bg-gradient-to-br text-2xl font-black md:h-16 md:w-16 md:text-3xl ${badgeAccent}`}
                    >
                        {classNumber}
                    </div>

                    {/* Title + meta + tagline */}
                    <div className="min-w-0 flex-1">
                        <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">
                            {title}
                        </h2>
                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm">
                            <span className="text-slate-400">{tagline}</span>
                            <span className="text-slate-600">·</span>
                            <span className="text-slate-500 tabular-nums">
                                {groups.length}{' '}
                                {groups.length === 1 ? 'chapter' : 'chapters'} ·{' '}
                                {totalNotes} {totalNotes === 1 ? 'note' : 'notes'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Accent gradient bar — visual section anchor below the header */}
                <div className={`mt-5 h-px bg-gradient-to-r ${barAccent}`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {groups.map(([chapter, notes]) => (
                    <ChapterCard key={chapter} chapter={chapter} notes={notes} />
                ))}
            </div>
        </section>
    );
}

// =============================================================================
// NOTE CARD
// =============================================================================

function NoteCard({
    note,
    onOpen,
    bookmarked,
    onToggleBookmark,
}: {
    note: HandwrittenNote;
    onOpen: () => void;
    bookmarked: boolean;
    onToggleBookmark: () => void;
}) {
    const style = getCategoryStyle(note.category);

    return (
        <div
            onClick={onOpen}
            className={`group relative flex items-center gap-3 p-3 pl-4 rounded-xl bg-slate-900/40 border border-white/5 ${style.border} hover:bg-slate-900/70 cursor-pointer transition-all duration-150 overflow-hidden before:content-[''] before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-r ${style.leftBorder}`}
        >
            <NoteThumbnail note={note} compact />
            <div className="flex-1 min-w-0">
                <h3 className="text-slate-100 font-semibold text-[15px] group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                    {note.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${style.pill}`}>
                        {note.category.replace(' Chemistry', '')}
                    </span>
                    <span className="text-[11px] text-slate-500">{note.chapter}</span>
                </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark();
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                        bookmarked
                            ? 'text-amber-400 bg-amber-500/10'
                            : 'text-slate-600 hover:text-amber-400 hover:bg-white/5'
                    }`}
                    aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this note'}
                >
                    {bookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                </button>
                <span className="hidden md:flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-amber-400 transition-colors px-2">
                    Open <ChevronRight size={13} />
                </span>
            </div>
        </div>
    );
}

// =============================================================================
// MAIN
// =============================================================================

interface Props {
    initialNotes: HandwrittenNote[];
}

const STORAGE_BOOKMARKS = 'hw-notes-bookmarks-v1';
const STORAGE_OPENED = 'hw-notes-opened-v1';

type SortKey = 'chapter' | 'newest' | 'title';

export default function HandwrittenNotesClient({ initialNotes }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
    const [sortKey, setSortKey] = useState<SortKey>('chapter');
    const [viewingNote, setViewingNote] = useState<HandwrittenNote | null>(null);
    const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
    const [opened, setOpened] = useState<Set<string>>(new Set());
    const [hydrated, setHydrated] = useState(false);

    // Load persisted state
    useEffect(() => {
        try {
            const b = localStorage.getItem(STORAGE_BOOKMARKS);
            if (b) setBookmarks(new Set(JSON.parse(b)));
            const o = localStorage.getItem(STORAGE_OPENED);
            if (o) setOpened(new Set(JSON.parse(o)));
        } catch {}
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        try { localStorage.setItem(STORAGE_BOOKMARKS, JSON.stringify(Array.from(bookmarks))); } catch {}
    }, [bookmarks, hydrated]);

    useEffect(() => {
        if (!hydrated) return;
        try { localStorage.setItem(STORAGE_OPENED, JSON.stringify(Array.from(opened))); } catch {}
    }, [opened, hydrated]);

    const toggleBookmark = (id: string) => {
        setBookmarks(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleOpenNote = (note: HandwrittenNote) => {
        setViewingNote(note);
        setOpened(prev => {
            const next = new Set(prev);
            next.add(note.id);
            return next;
        });
    };

    const stats = useMemo(() => getNotesStats(initialNotes), [initialNotes]);
    const categories = useMemo(() => getUniqueCategories(initialNotes), [initialNotes]);

    // Tab counts (bug-free, exact match)
    const tabCounts = useMemo<Record<string, number>>(() => {
        const counts: Record<string, number> = { all: initialNotes.length };
        categories.forEach(c => {
            counts[c] = initialNotes.filter(n => n.category === c).length;
        });
        return counts;
    }, [initialNotes, categories]);

    // Filter pipeline
    const filteredNotes = useMemo(() => {
        let pool = initialNotes;
        if (activeTab !== 'all') pool = pool.filter(n => n.category === activeTab);
        if (showBookmarkedOnly) pool = pool.filter(n => bookmarks.has(n.id));
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            pool = pool.filter(n =>
                n.title.toLowerCase().includes(q) ||
                n.chapter.toLowerCase().includes(q) ||
                n.category.toLowerCase().includes(q)
            );
        }
        return pool;
    }, [initialNotes, activeTab, showBookmarkedOnly, searchQuery, bookmarks]);

    // Group by chapter (when sortKey === 'chapter')
    const chapterGroups = useMemo(() => {
        const groups = new Map<string, HandwrittenNote[]>();
        filteredNotes.forEach(n => {
            const arr = groups.get(n.chapter) ?? [];
            arr.push(n);
            groups.set(n.chapter, arr);
        });
        // Sort: chapters with most notes first, "Other" last
        return Array.from(groups.entries()).sort((a, b) => {
            if (a[0] === 'Other') return 1;
            if (b[0] === 'Other') return -1;
            return b[1].length - a[1].length;
        });
    }, [filteredNotes]);

    // Flat sorted list (when sortKey !== 'chapter')
    const flatSorted = useMemo(() => {
        const arr = [...filteredNotes];
        if (sortKey === 'newest') arr.sort((a, b) => b.addedOrder - a.addedOrder);
        else if (sortKey === 'title') arr.sort((a, b) => a.title.localeCompare(b.title));
        return arr;
    }, [filteredNotes, sortKey]);

    // Categories ordered by count desc (so the largest bucket comes first)
    const orderedCategories = useMemo(
        () => [...categories].sort((a, b) => (tabCounts[b] ?? 0) - (tabCounts[a] ?? 0)),
        [categories, tabCounts]
    );

    const relevantTools = useMemo(
        () => getRelevantTools(activeTab === 'all' ? null : activeTab),
        [activeTab]
    );

    const totalBookmarked = bookmarks.size;
    const totalOpened = opened.size;

    return (
        <div className="min-h-screen bg-[#050505] font-sans relative overflow-hidden">
            {/* ── GLOBAL AMBIENT BACKDROP — colored glows + faint grid ── */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {/* warm hero orbs */}
                <div className="absolute -top-32 left-[8%] w-[620px] h-[620px] bg-amber-500/12 rounded-full blur-[130px]" />
                <div className="absolute top-[12%] -right-24 w-[520px] h-[520px] bg-orange-500/12 rounded-full blur-[130px]" />
                {/* mid-page cool accents */}
                <div className="absolute top-[45%] -left-28 w-[540px] h-[540px] bg-purple-500/10 rounded-full blur-[130px]" />
                <div className="absolute top-[60%] right-[5%] w-[480px] h-[480px] bg-emerald-500/8 rounded-full blur-[130px]" />
                {/* lower glow */}
                <div className="absolute top-[90%] left-[25%] w-[600px] h-[600px] bg-pink-500/8 rounded-full blur-[140px]" />
                <div className="absolute top-[115%] right-[10%] w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[130px]" />
                {/* faint grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    }}
                />
                {/* subtle top vignette for hero legibility */}
                <div className="absolute inset-x-0 top-0 h-[50vh] bg-gradient-to-b from-[#050505]/60 via-transparent to-transparent" />
            </div>

            {/* content sits above backdrop */}
            <div className="relative z-10">
            {/* ── PDF Viewer Modal ──────────────────────────────────── */}
            <AnimatePresence>
                {viewingNote && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col"
                    >
                        <div className="h-14 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between px-4 shrink-0">
                            <div className="flex items-center gap-3 overflow-hidden flex-1">
                                <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400 shrink-0">
                                    <FileText size={18} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-100 text-sm truncate">{viewingNote.title}</h3>
                                    <p className="text-xs text-slate-500">{viewingNote.chapter} · {viewingNote.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => toggleBookmark(viewingNote.id)}
                                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                        bookmarks.has(viewingNote.id)
                                            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                    }`}
                                >
                                    {bookmarks.has(viewingNote.id) ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
                                    {bookmarks.has(viewingNote.id) ? 'Saved' : 'Save'}
                                </button>
                                {(() => {
                                    const rec = getChapterRecommendation(viewingNote.chapter);
                                    return rec ? (
                                        <Link
                                            href={rec.href}
                                            target="_blank"
                                            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-400 text-xs font-semibold transition-all"
                                        >
                                            <ExternalLink size={12} /> Pair with {rec.name}
                                        </Link>
                                    ) : null;
                                })()}
                                <a
                                    href={viewingNote.notesUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all"
                                >
                                    <Download size={14} /><span className="hidden md:inline">Download</span>
                                </a>
                                <button
                                    onClick={() => setViewingNote(null)}
                                    className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-500 transition-colors"
                                    aria-label="Close preview"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-slate-900">
                            <iframe
                                src={toInlineViewerUrl(viewingNote.notesUrl) + '#view=FitH&toolbar=1'}
                                className="w-full h-full border-0"
                                title={viewingNote.title}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── HERO ───────────────────────────────────────────────── */}
            <section className="pt-32 pb-10 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 uppercase tracking-wider">
                        <FileText size={13} /> Free · Updated regularly
                    </div>
                    <h1
                        className="text-4xl md:text-6xl font-bold text-white mb-4 leading-[1.1]"
                        style={{ fontFamily: 'var(--font-kalam)' }}
                    >
                        Handwritten Chemistry Notes
                    </h1>
                    <p className="text-slate-400 text-base md:text-lg mb-3 max-w-xl mx-auto leading-relaxed">
                        Personal notes, highlighted NCERTs and revision sheets for{' '}
                        <span className="font-semibold text-white">JEE, NEET &amp; CBSE</span> Chemistry
                    </p>

                    {/* Bug-free stats */}
                    <p className="text-slate-500 text-sm mb-8">
                        <span className="text-amber-400 font-bold">{stats.total}</span> notes &nbsp;·&nbsp;
                        <span className="text-pink-400">{stats.organic} Organic</span> &nbsp;·&nbsp;
                        <span className="text-purple-400">{stats.inorganic} Inorganic</span> &nbsp;·&nbsp;
                        <span className="text-cyan-400">{stats.physical} Physical</span> &nbsp;·&nbsp;
                        <span className="text-amber-400">{stats.general} General</span>
                    </p>

                    {/* Study path — 3 steps with REAL progress */}
                    <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
                        {[
                            {
                                n: '01', label: 'Read the notes',
                                sub: hydrated && totalOpened > 0 ? `${totalOpened} of ${stats.total} opened` : 'Open & download',
                                color: 'text-amber-400', border: 'border-amber-500/25', bg: 'bg-amber-500/8',
                            },
                            {
                                n: '02', label: 'Save your favourites',
                                sub: hydrated && totalBookmarked > 0 ? `${totalBookmarked} bookmarked` : 'Bookmark for later',
                                color: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/8',
                            },
                            {
                                n: '03', label: 'Test on The Crucible',
                                sub: '4,000+ practice questions',
                                color: 'text-orange-400', border: 'border-orange-500/25', bg: 'bg-orange-500/8',
                            },
                        ].map((s, i) => (
                            <React.Fragment key={s.n}>
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.border} ${s.bg} text-left min-w-[200px]`}>
                                    <span className={`text-xl font-black ${s.color} opacity-60 tabular-nums`}>{s.n}</span>
                                    <div>
                                        <p className="text-white text-[15px] font-semibold leading-tight">{s.label}</p>
                                        <p className="text-slate-500 text-[13px] mt-0.5">{s.sub}</p>
                                    </div>
                                </div>
                                {i < 2 && (
                                    <ChevronRight size={15} className="text-slate-700 shrink-0 hidden md:block" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── SEARCH + CATEGORY + SORT + BOOKMARK FILTER ────────── */}
            <section className="px-4 pb-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-4">
                        <SearchBox value={searchQuery} onChange={setSearchQuery} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {/* Category tabs (ordered by size desc) */}
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                activeTab === 'all'
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                    : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                            }`}
                        >
                            All <span className="ml-1 opacity-60 text-xs tabular-nums">{tabCounts.all}</span>
                        </button>
                        {orderedCategories.map(cat => {
                            const style = getCategoryStyle(cat);
                            const isActive = activeTab === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveTab(cat)}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                        isActive
                                            ? style.activeTab
                                            : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                                    }`}
                                >
                                    {cat.replace(' Chemistry', '')}{' '}
                                    <span className="ml-1 opacity-60 text-xs tabular-nums">{tabCounts[cat] ?? 0}</span>
                                </button>
                            );
                        })}

                        {/* Bookmark filter */}
                        {hydrated && totalBookmarked > 0 && (
                            <button
                                onClick={() => setShowBookmarkedOnly(v => !v)}
                                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                                    showBookmarkedOnly
                                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                                        : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700'
                                }`}
                            >
                                <BookmarkCheck size={13} />
                                Saved <span className="opacity-60 text-xs tabular-nums">{totalBookmarked}</span>
                            </button>
                        )}

                        {/* Spacer + sort dropdown */}
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-[11px] text-slate-600 uppercase tracking-wider hidden sm:inline">Sort</span>
                            <div className="inline-flex rounded-lg border border-slate-800 overflow-hidden">
                                {([
                                    { k: 'chapter', label: 'Chapter', icon: Layers },
                                    { k: 'newest', label: 'Newest', icon: Clock },
                                    { k: 'title', label: 'A–Z', icon: SortAsc },
                                ] as const).map(opt => {
                                    const Icon = opt.icon;
                                    const active = sortKey === opt.k;
                                    return (
                                        <button
                                            key={opt.k}
                                            onClick={() => setSortKey(opt.k)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-colors ${
                                                active
                                                    ? 'bg-slate-800 text-slate-100'
                                                    : 'text-slate-500 hover:text-slate-300'
                                            }`}
                                        >
                                            <Icon size={12} />
                                            <span className="hidden sm:inline">{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAIN CONTENT ──────────────────────────────────────── */}
            <div className="max-w-6xl mx-auto px-4 pb-16">
                {filteredNotes.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-white/5">
                        <FileText size={44} className="mx-auto mb-4 text-slate-700" />
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">No notes found</h3>
                        <p className="text-slate-600 mb-5 text-sm">Try adjusting your search or filter</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setActiveTab('all');
                                setShowBookmarkedOnly(false);
                            }}
                            className="text-amber-500 hover:text-amber-400 font-medium text-sm transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : sortKey === 'chapter' && !searchQuery && !showBookmarkedOnly ? (
                    <ChapterGridByClass chapterGroups={chapterGroups} setSortKey={setSortKey} />
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                                {showBookmarkedOnly ? 'Your Saved Notes' : 'All Notes'}
                                <span className="ml-2 text-slate-600 normal-case tabular-nums">
                                    {flatSorted.length} of {stats.total}
                                </span>
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {flatSorted.map(n => (
                                <NoteCard
                                    key={n.id}
                                    note={n}
                                    onOpen={() => handleOpenNote(n)}
                                    bookmarked={bookmarks.has(n.id)}
                                    onToggleBookmark={() => toggleBookmark(n.id)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── PAIR THESE NOTES WITH (context-aware, BELOW notes) ── */}
            <section className="px-4 pb-16">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-baseline justify-between mb-4">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
                                {activeTab === 'all'
                                    ? 'Pair these notes with'
                                    : `Best tools for ${activeTab.replace(' Chemistry', '')}`}
                            </p>
                            <h2 className="text-xl md:text-2xl font-bold text-white">
                                {activeTab === 'all'
                                    ? 'Turn revision into recall'
                                    : 'Sharpened for what you just opened'}
                            </h2>
                        </div>
                    </div>
                    <div
                        className="flex gap-3 overflow-x-auto pb-2"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {relevantTools.map(tool => {
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.name}
                                    href={tool.href}
                                    className={`flex-shrink-0 w-56 p-4 rounded-xl bg-slate-900/80 border ${tool.border} transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 group`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${tool.iconBg}`}>
                                            <Icon size={17} className={tool.iconColor} />
                                        </div>
                                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tool.badgeBg}`}>
                                            {tool.badge}
                                        </span>
                                    </div>
                                    <p className="text-white font-semibold text-sm mb-1 group-hover:text-amber-400 transition-colors leading-tight">
                                        {tool.name}
                                    </p>
                                    <p className="text-slate-500 text-xs leading-snug">{tool.hook}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── FAQ (GEO / search crawlability — always in DOM) ── */}
            <NotesVivaFAQ />

            </div>
        </div>
    );
}

const NOTES_FAQS = [
    {
        q: 'Are these handwritten chemistry notes free to download?',
        a: 'Yes. All notes by Paaras Sir on Canvas Classes are completely free — no login or payment required. Open any chapter to read online or tap "Open PDF" to download.',
    },
    {
        q: 'Which chapters are covered in these handwritten chemistry notes?',
        a: 'All major Class 11 & 12 chapters: Organic Chemistry (Amines, Aldehydes & Ketones, Aromatic Compounds, Organic Name Reactions), Physical Chemistry (Thermodynamics, Chemical Kinetics, Electrochemistry, Solutions, States of Matter, Surface Chemistry), and Inorganic Chemistry (Chemical Bonding, Coordination Compounds, Metallurgy, Environmental Chemistry).',
    },
    {
        q: 'Are these chemistry notes useful for JEE Main and JEE Advanced?',
        a: 'Yes — the notes are written with JEE patterns in mind. High-yield concepts, mechanisms, and shortcuts are highlighted throughout. Pair them with the Crucible question bank for active recall practice.',
    },
    {
        q: 'Are these notes good for NEET Chemistry preparation?',
        a: 'Absolutely. NEET tests Organic, Inorganic, and Physical Chemistry — all three are covered. The notes follow NCERT closely and highlight topics that appear frequently in NEET previous-year questions.',
    },
    {
        q: 'Are these notes aligned with the NCERT Class 11 & 12 syllabus?',
        a: 'Yes. Every note follows the CBSE-prescribed NCERT syllabus for Class 11 and Class 12 Chemistry, making them equally useful for board exams and entrance tests.',
    },
    {
        q: 'Who created these handwritten chemistry notes?',
        a: 'Paaras Sir, a chemistry educator at Canvas Classes. The notes reflect his classroom teaching style — concise, visual, and exam-focused for JEE and NEET aspirants.',
    },
];

function NotesVivaFAQ() {
    return (
        <section className="px-4 pb-20 pt-2">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-base font-bold text-white mb-3">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-1.5">
                    {NOTES_FAQS.map((faq, i) => (
                        <details
                            key={i}
                            className="group rounded-xl border border-white/[0.07] bg-white/[0.02] open:bg-white/[0.04] transition-colors"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-zinc-300 marker:hidden">
                                {faq.q}
                                <span className="shrink-0 text-lg leading-none text-zinc-500 transition-transform group-open:rotate-45">
                                    +
                                </span>
                            </summary>
                            <p className="px-4 pb-4 text-sm leading-relaxed text-zinc-400">
                                {faq.a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
