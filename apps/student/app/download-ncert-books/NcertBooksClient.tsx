'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    ChevronDown,
    ExternalLink,
    Download,
    Sparkles,
    ArrowRight,
    Zap,
    NotebookPen,
    Target,
    Video,
    FlaskConical,
    GraduationCap,
    Layers,
    HelpCircle,
} from 'lucide-react';
import { type NcertBook, type NcertClassNum, type NcertBookChapter } from '@/app/lib/ncertBooksData';

interface NcertBooksClientProps {
    books: NcertBook[];
}

const ALL_CLASSES: NcertClassNum[] = ['8', '9', '10', '11', '12'];

// Subject colour palette
const SUBJECT_STYLES: Record<string, { chip: string; icon: string; border: string }> = {
    Science:        { chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: 'from-emerald-600 to-teal-600',    border: 'border-emerald-500/20' },
    Mathematics:    { chip: 'bg-violet-500/15 text-violet-300 border-violet-500/30',    icon: 'from-violet-600 to-indigo-600',    border: 'border-violet-500/20' },
    English:        { chip: 'bg-sky-500/15 text-sky-300 border-sky-500/30',             icon: 'from-sky-600 to-blue-600',         border: 'border-sky-500/20' },
    Chemistry:      { chip: 'bg-teal-500/15 text-teal-300 border-teal-500/30',          icon: 'from-teal-600 to-cyan-600',        border: 'border-teal-500/20' },
    Physics:        { chip: 'bg-orange-500/15 text-orange-300 border-orange-500/30',    icon: 'from-orange-600 to-amber-600',     border: 'border-orange-500/20' },
    Biology:        { chip: 'bg-lime-500/15 text-lime-300 border-lime-500/30',          icon: 'from-lime-600 to-green-600',       border: 'border-lime-500/20' },
    'Social Science': { chip: 'bg-rose-500/15 text-rose-300 border-rose-500/30',        icon: 'from-rose-600 to-pink-600',        border: 'border-rose-500/20' },
};

function subjectStyle(subject: string) {
    return SUBJECT_STYLES[subject] ?? { chip: 'bg-gray-700/40 text-gray-300 border-gray-600/30', icon: 'from-gray-600 to-gray-700', border: 'border-gray-700/30' };
}

export default function NcertBooksClient({ books }: NcertBooksClientProps) {
    const [activeClass, setActiveClass] = useState<'all' | NcertClassNum>('all');
    const [activeSubject, setActiveSubject] = useState<'all' | string>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredBooks = useMemo(() => {
        let result = books;
        if (activeClass !== 'all') result = result.filter(b => b.classNum === activeClass);
        if (activeSubject !== 'all') result = result.filter(b => b.subject === activeSubject);
        return result;
    }, [books, activeClass, activeSubject]);

    const availableSubjects = useMemo(() => {
        const base = activeClass === 'all'
            ? books
            : books.filter(b => b.classNum === activeClass);
        return [...new Set(base.map(b => b.subject))].sort();
    }, [books, activeClass]);

    const grouped = useMemo(() => {
        if (activeClass !== 'all') return [{ cls: activeClass, books: filteredBooks }];
        return ALL_CLASSES
            .map(cls => ({ cls, books: filteredBooks.filter(b => b.classNum === cls) }))
            .filter(g => g.books.length > 0);
    }, [filteredBooks, activeClass]);

    function changeClass(cls: 'all' | NcertClassNum) {
        setActiveClass(cls);
        setActiveSubject('all');
    }

    function toggleExpand(id: string) {
        setExpandedId(prev => (prev === id ? null : id));
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-orange-500/30">

            {/* ── Hero ─────────────────────────────────────────────────── */}
            <Hero />

            {/* ── Why download from Canvas ─────────────────────────────── */}
            <WhyStrip />

            {/* ── Library / book grid ──────────────────────────────────── */}
            <main id="library" className="scroll-mt-24 pb-16 px-4 md:px-6 max-w-5xl mx-auto">

                {/* Section header */}
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-500 to-amber-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300/80">
                            The Library
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Browse all {books.length} textbooks
                    </h2>
                    <p className="mt-1.5 text-sm md:text-base text-gray-400">
                        Filter by class or subject. Tap any book to expand its chapter list and open the PDF.
                    </p>
                </div>

                {/* ── Filter bar ───────────────────────────────────────── */}
                <div className="sticky top-20 z-30 -mx-4 md:-mx-6 px-4 md:px-6 py-3 bg-gray-950/90 backdrop-blur-xl border-y border-white/[0.06] mb-8">

                    {/* Class pills */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 shrink-0">
                            Class
                        </span>
                        {(['all', ...ALL_CLASSES] as const).map((cls) => (
                            <button
                                key={cls}
                                onClick={() => changeClass(cls)}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                                    activeClass === cls
                                        ? 'bg-white text-gray-950'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                {cls === 'all' ? 'All' : cls}
                            </button>
                        ))}
                    </div>

                    {/* Subject pills */}
                    {availableSubjects.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap mt-2.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 shrink-0">
                                Subject
                            </span>
                            {(['all', ...availableSubjects] as const).map((subj) => {
                                const style = subjectStyle(subj as string);
                                return (
                                    <button
                                        key={subj}
                                        onClick={() => setActiveSubject(subj)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                                            activeSubject === subj
                                                ? 'bg-white/10 border-white/30 text-white'
                                                : `${style.chip} hover:opacity-80`
                                        }`}
                                    >
                                        {subj === 'all' ? 'All subjects' : subj}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ── Book grid ────────────────────────────────────────── */}
                <div className="space-y-10">
                    {grouped.map(({ cls, books: clsBooks }) => (
                        <section key={cls}>
                            {activeClass === 'all' && (
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-orange-500 to-amber-500" />
                                    <h3 className="text-lg font-bold text-white">Class {cls}</h3>
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs font-medium">
                                        {clsBooks.length} book{clsBooks.length !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            )}
                            <div className="space-y-3">
                                {clsBooks.map((book, i) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        index={i}
                                        expanded={expandedId === book.id}
                                        onToggle={() => toggleExpand(book.id)}
                                    />
                                ))}
                            </div>
                        </section>
                    ))}

                    {filteredBooks.length === 0 && (
                        <div className="text-center py-20 rounded-3xl border border-gray-800 border-dashed">
                            <BookOpen size={40} className="mx-auto mb-4 text-gray-700" />
                            <p className="text-gray-400 font-semibold">No books match your filters.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* ── Cross-link / Take it further ─────────────────────────── */}
            <TakeItFurther />

            {/* ── FAQ ──────────────────────────────────────────────────── */}
            <FAQSection />

            {/* ── Final CTA ────────────────────────────────────────────── */}
            <BottomCTA />
        </div>
    );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 md:pt-24 pb-8 md:pb-10 px-4 md:px-6">
            {/* Background gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-orange-500/10 rounded-full blur-[140px]" />
                <div className="absolute top-10 right-10 w-[260px] h-[220px] bg-rose-500/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 text-[11px] text-orange-300 font-semibold tracking-wide mb-4"
                >
                    <Sparkles size={11} />
                    Free Digital Library · CBSE 2025-26
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05 }}
                    className="font-bold tracking-tight leading-[1.1]"
                >
                    <span className="block text-3xl md:text-4xl lg:text-5xl">
                        Every{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-300">
                            NCERT textbook
                        </span>
                    </span>
                    <span className="block mt-1.5 text-xl md:text-2xl lg:text-3xl text-gray-300 font-semibold">
                        Class 8 to 12 — free.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="mt-3 md:mt-4 text-sm md:text-base text-gray-400 max-w-xl mx-auto"
                >
                    Latest 2025-26 editions including the new NEP 2020 books. Read any chapter online or download the
                    PDF instantly.
                </motion.p>
            </div>
        </section>
    );
}

// ── Why download from Canvas strip ────────────────────────────────────────────

function WhyStrip() {
    const items = [
        {
            icon: Zap,
            title: 'Instant access',
            body: 'PDFs hosted on a fast CDN. Tap a chapter, the file opens — no login, no ads, no redirects.',
            color: 'from-orange-500 to-amber-500',
        },
        {
            icon: GraduationCap,
            title: '2025-26 latest editions',
            body: 'Includes the new NEP 2020 textbooks for Class 9 (Kaveri, Science, Mathematics) plus all rationalised editions.',
            color: 'from-emerald-500 to-teal-500',
        },
        {
            icon: Layers,
            title: 'Class 8 → 12, all subjects',
            body: 'Physics, Chemistry, Biology, Maths, Science, English & Social Science — every chapter, in one place.',
            color: 'from-violet-500 to-indigo-500',
        },
        {
            icon: Download,
            title: 'Read online or download',
            body: 'Open chapters straight in your browser, save them for offline study, or print. No watermarks.',
            color: 'from-sky-500 to-blue-500',
        },
    ];

    return (
        <section className="px-4 md:px-6 pb-12 md:pb-16">
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {items.map((item, idx) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                        className="rounded-2xl border border-white/[0.06] bg-gray-900/40 backdrop-blur-sm p-5 hover:bg-gray-900/60 hover:border-white/[0.1] transition-colors"
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3.5 shadow-lg`}>
                            <item.icon size={18} className="text-white" />
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

// ── Cross-link / Take it further ──────────────────────────────────────────────

function TakeItFurther() {
    const cards = [
        {
            href: '/ncert-solutions',
            icon: NotebookPen,
            badge: 'Step-by-step',
            title: 'NCERT Solutions',
            body: 'Detailed answers to every back-exercise question — Class 11 & 12 Chemistry, with working shown.',
            color: 'from-orange-500 to-amber-500',
            border: 'hover:border-orange-500/30',
        },
        {
            href: '/the-crucible',
            icon: Target,
            badge: 'Adaptive practice',
            title: 'The Crucible',
            body: '10,000+ JEE & NEET-level chemistry questions with adaptive review and personalised weakness tracking.',
            color: 'from-rose-500 to-red-500',
            border: 'hover:border-rose-500/30',
        },
        {
            href: '/handwritten-notes',
            icon: FlaskConical,
            badge: 'Exam-focused',
            title: 'Handwritten Notes',
            body: 'Free chapter-wise PDF notes by Paaras Sir — Organic, Inorganic & Physical Chemistry.',
            color: 'from-emerald-500 to-teal-500',
            border: 'hover:border-emerald-500/30',
        },
        {
            href: '/one-shot-lectures',
            icon: Video,
            badge: 'Full chapter',
            title: 'One-Shot Lectures',
            body: 'Watch full-chapter video lectures by Paaras Sir — perfect for fast revision before exams.',
            color: 'from-violet-500 to-indigo-500',
            border: 'hover:border-violet-500/30',
        },
    ];

    return (
        <section className="px-4 md:px-6 py-16 md:py-20 border-t border-white/[0.05]">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-4">
                        <Sparkles size={11} className="text-orange-400" />
                        Beyond the textbook
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        Got the books? Now <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">crack the exam.</span>
                    </h2>
                    <p className="mt-3 text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                        NCERT is the foundation — but JEE, NEET and CBSE boards reward depth. Pair the textbook with the
                        right practice and notes.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    {cards.map((card, idx) => (
                        <motion.div
                            key={card.href}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                        >
                            <Link
                                href={card.href}
                                className={`group block rounded-2xl border border-white/[0.06] bg-gray-900/40 hover:bg-gray-900/70 backdrop-blur-sm p-5 md:p-6 transition-all ${card.border}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                                        <card.icon size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                            {card.badge}
                                        </span>
                                        <h3 className="mt-0.5 text-base md:text-lg font-bold text-white group-hover:text-orange-200 transition-colors flex items-center gap-1.5">
                                            {card.title}
                                            <ArrowRight size={14} className="text-gray-600 group-hover:text-orange-300 group-hover:translate-x-0.5 transition-all" />
                                        </h3>
                                        <p className="mt-1.5 text-xs md:text-sm text-gray-400 leading-relaxed">
                                            {card.body}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Secondary links */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-xs">
                    <span className="text-gray-500 font-medium">Also explore:</span>
                    {[
                        { href: '/chemistry-flashcards', label: 'Flashcards' },
                        { href: '/jee-pyqs', label: 'JEE PYQs' },
                        { href: '/salt-analysis', label: 'Salt Analysis Lab' },
                        { href: '/quick-recap', label: 'Quick Recap' },
                        { href: '/cbse-12-ncert-revision', label: 'Class 12 Revision' },
                        { href: '/bitsat-chemistry-revision', label: 'BITSAT Revision' },
                    ].map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-gray-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

const FAQS: { q: string; a: string }[] = [
    {
        q: 'Are these the latest 2025-26 NCERT textbooks?',
        a: 'Yes. The library mirrors the current 2025-26 CBSE NCERT editions, including all rationalised chapters and the new NEP 2020 textbooks for Class 9 (Kaveri English, the new Science book and the new Mathematics book).',
    },
    {
        q: 'Are these PDFs really free? Is there any login?',
        a: 'Completely free. No login, no email, no payment. Tap any chapter and the official PDF opens in your browser. You can read it online or save it for offline study.',
    },
    {
        q: 'Which classes and subjects are covered?',
        a: 'Class 8, 9, 10, 11 and 12 — across Physics, Chemistry, Biology, Mathematics, Science, English (Honeydew, Beehive, Kaveri, Hornbill, Flamingo, etc.) and Social Science (History, Civics, Geography, Economics).',
    },
    {
        q: 'Why should I study from NCERT books for JEE and NEET?',
        a: 'NCERT is the official syllabus reference for both JEE Main and NEET. CBSE board paper-setters and NTA (NEET) directly lift concepts, definitions and even questions from NCERT — especially in Class 11 & 12 Physics, Chemistry and Biology. Mastering NCERT first is the highest-leverage way to score.',
    },
    {
        q: 'Is NCERT alone enough for JEE Advanced or NEET top ranks?',
        a: 'NCERT is necessary but not sufficient for JEE Advanced or NEET top ranks. Once you have full NCERT command, layer in question practice (try The Crucible for chemistry), previous-year papers and concise revision notes.',
    },
    {
        q: 'Can I download the PDFs to read offline?',
        a: 'Yes. Each chapter opens as a regular PDF in your browser — use your browser\'s "Download" or "Save" option to keep a copy. You can also print specific chapters for annotation.',
    },
];

function FAQSection() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="px-4 md:px-6 py-16 md:py-20 border-t border-white/[0.05]">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-wider text-gray-300 mb-4">
                        <HelpCircle size={11} className="text-orange-400" />
                        FAQs
                    </span>
                    <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                        Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">questions</span>
                    </h2>
                </div>

                <div className="space-y-2">
                    {FAQS.map((faq, idx) => {
                        const open = openIdx === idx;
                        return (
                            <div
                                key={faq.q}
                                className={`rounded-xl border bg-gray-900/40 backdrop-blur-sm overflow-hidden transition-colors ${open ? 'border-orange-500/30' : 'border-white/[0.06] hover:border-white/[0.12]'}`}
                            >
                                <button
                                    onClick={() => setOpenIdx(open ? null : idx)}
                                    className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className={`text-sm md:text-base font-semibold ${open ? 'text-white' : 'text-gray-200'}`}>
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`shrink-0 mt-0.5 text-gray-500 transition-transform ${open ? 'rotate-180 text-orange-300' : ''}`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-4 pt-0 text-sm text-gray-400 leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

// ── Bottom CTA ────────────────────────────────────────────────────────────────

function BottomCTA() {
    return (
        <section className="relative px-4 md:px-6 py-20 md:py-24 overflow-hidden border-t border-white/[0.05]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/15 rounded-full blur-[140px]" />
                <div className="absolute bottom-10 left-1/3 w-[260px] h-[200px] bg-amber-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-10 right-1/3 w-[260px] h-[200px] bg-rose-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 text-xs text-orange-300 font-semibold tracking-wide mb-6"
                >
                    <Sparkles size={12} />
                    100% free, forever
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
                >
                    Stop hunting for{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                        broken NCERT links.
                    </span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base md:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-9"
                >
                    Every textbook from Class 8 to 12, every chapter, one click away. Bookmark this page and never lose
                    a PDF again.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                    <a
                        href="#library"
                        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-base hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/25"
                    >
                        <Download size={16} />
                        Browse all books
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <Link
                        href="/the-crucible"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-gray-200 font-semibold text-base hover:bg-white/[0.06] hover:border-white/[0.15] transition-all"
                    >
                        Try The Crucible
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

// ── Book Card ─────────────────────────────────────────────────────────────────

function BookCard({
    book,
    index,
    expanded,
    onToggle,
}: {
    book: NcertBook;
    index: number;
    expanded: boolean;
    onToggle: () => void;
}) {
    const style = subjectStyle(book.subject);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.04, 0.3) }}
            className={`rounded-2xl border bg-gray-900/50 overflow-hidden transition-colors ${
                expanded ? 'border-gray-700' : 'border-gray-800/60 hover:border-gray-700'
            }`}
        >
            {/* Card header — always visible */}
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-4 px-4 py-4 text-left group"
            >
                {/* Subject icon */}
                <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${style.icon} opacity-80 flex items-center justify-center group-hover:opacity-100 transition-opacity`}>
                    <SubjectIcon subject={book.subject} />
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold ${style.chip}`}>
                            {book.subject}
                        </span>
                        <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide">
                            Class {book.classNum}
                        </span>
                    </div>
                    <h3 className="mt-0.5 text-sm md:text-base font-bold text-gray-100 group-hover:text-white transition-colors truncate">
                        {book.bookTitle}
                    </h3>
                </div>

                {/* Chapter count + expand chevron */}
                <div className="shrink-0 flex items-center gap-3 ml-2">
                    <span className="text-xs text-gray-500 font-medium hidden sm:block">
                        {book.chapters.length} ch
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Chapter list — revealed on expand */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className={`border-t border-gray-800 px-4 pb-4 pt-3`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {book.chapters.map((ch) => (
                                    <ChapterItem
                                        key={ch.num}
                                        chapter={ch}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ── Chapter Item ──────────────────────────────────────────────────────────────

function ChapterItem({ chapter }: { chapter: NcertBookChapter }) {
    return (
        <a
            href={chapter.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg bg-gray-800/50 border border-gray-700/40 px-3 py-2 group hover:bg-gray-800 hover:border-gray-600 transition-all"
            title={`Chapter ${chapter.num}: ${chapter.title}`}
        >
            <span className="shrink-0 text-[10px] font-bold text-gray-500 group-hover:text-gray-400 w-5 text-right">
                {chapter.num}
            </span>
            <span className="flex-1 text-xs font-medium text-gray-300 group-hover:text-white transition-colors truncate min-w-0">
                {chapter.title}
            </span>
            <ExternalLink size={10} className="shrink-0 text-gray-600 group-hover:text-white transition-colors" />
        </a>
    );
}

// ── Subject Icon ──────────────────────────────────────────────────────────────

function SubjectIcon({ subject }: { subject: string }) {
    const cls = 'text-white';
    switch (subject) {
        case 'Mathematics':    return <span className={`${cls} text-sm font-black`}>∑</span>;
        case 'Science':        return <span className={`${cls} text-sm font-black`}>⚗</span>;
        case 'Chemistry':      return <span className={`${cls} text-sm font-black`}>⚗</span>;
        case 'Physics':        return <span className={`${cls} text-sm font-black`}>⚡</span>;
        case 'Biology':        return <span className={`${cls} text-sm font-black`}>🧬</span>;
        case 'English':        return <span className={`${cls} text-sm font-black`}>Aa</span>;
        case 'Social Science': return <span className={`${cls} text-sm font-black`}>🌏</span>;
        default:               return <BookOpen size={16} className={cls} />;
    }
}
