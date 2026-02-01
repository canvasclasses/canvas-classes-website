'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ChevronRight, Zap, PlayCircle, FileText, Clock, Book } from 'lucide-react';
import { NeetChapter } from '@/app/lib/neetCrashCourseData';
import Image from 'next/image';

interface NeetCrashCourseClientProps {
    initialChapters: NeetChapter[];
}

// Image mapping overrides (same as detailed lectures)
const imageMapping: Record<string, string> = {
    'equilibrium': 'chemical-equilibrium.webp',
    'haloalkanes': 'haloalkanes-haloarenes.webp',
    'alcohols-ethers': 'alcohols-phenols-ethers.webp',
    'haloalkanes-alcohols-ethers': 'haloalkanes-haloarenes.webp',
    'aldehydes-ketones': 'carbonyl-compounds.webp',
    'carboxylic-acids-derivatives': 'carboxylic-acids.webp',
    'p-block-group-13-14': 'p-block.webp',
    'p-block-12th': 'p-block.webp',
    'salt-analysis': 'salt.webp'
};

const getChapterImage = (slug: string) => {
    if (imageMapping[slug]) {
        return `/chapter-card-images/${imageMapping[slug]}`;
    }
    return `/chapter-card-images/${slug}.webp`;
};

// Data is now fetched on the server and passed as props for SEO
export default function NeetCrashCourseClient({ initialChapters }: NeetCrashCourseClientProps) {
    const [chapters] = useState<NeetChapter[]>(initialChapters);

    const class11Chapters = chapters.filter(c => c.classNum === '11');
    const class12Chapters = chapters.filter(c => c.classNum === '12');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-sans text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-10 md:pb-20 overflow-hidden">
                {/* Medical themed background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 left-10 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl" />

                <div className="relative container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-bold text-xs uppercase tracking-widest mb-6"
                    >
                        <Zap size={14} className="animate-pulse" />
                        Ultimate NEET Prep
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        NEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400">Crash Course</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Precision-engineered Chemistry revision for NEET. High-yield lectures, Daily Practice Problems (DPP), and Video Solutions.
                    </p>
                </div>
            </section>

            {/* Class 11 Section */}
            <section className="py-8 md:py-12">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Class 11 Syllabus</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {class11Chapters.map((chapter, index) => (
                            <ChapterCard key={chapter.id} chapter={chapter} index={index} accentColor="cyan" />
                        ))}
                    </div>
                </div>
            </section>

            {/* Class 12 Section */}
            <section className="py-8 md:py-12 pb-16 md:pb-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-400 border border-teal-500/20">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Class 12 Syllabus</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                        {class12Chapters.map((chapter, index) => (
                            <ChapterCard key={chapter.id} chapter={chapter} index={index} accentColor="teal" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ChapterCard({ chapter, index, accentColor }: { chapter: any, index: number, accentColor: 'cyan' | 'teal' }) {
    const colorMap = {
        cyan: {
            border: 'hover:border-cyan-400/50',
            glow: 'rgba(34, 211, 238, 0.3)',
            badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
            text: 'group-hover:from-cyan-300 group-hover:to-blue-300'
        },
        teal: {
            border: 'hover:border-teal-400/50',
            glow: 'rgba(45, 212, 191, 0.3)',
            badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
            text: 'group-hover:from-teal-300 group-hover:to-cyan-300'
        }
    };

    const style = colorMap[accentColor];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="group"
        >
            <Link href={`/neet-crash-course/${chapter.slug}`} className="block h-full">
                <div className={`h-full bg-gray-900/40 backdrop-blur-sm border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden transition-all duration-500 hover:bg-gray-800/60 ${style.border} hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_${style.glow}] relative group shadow-xl`}>

                    {/* Top Image Section - Compact for mobile */}
                    <div className="relative h-24 sm:h-32 md:h-48 w-full overflow-hidden bg-gray-900">
                        <Image
                            src={getChapterImage(chapter.slug)}
                            alt={chapter.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                        {/* High Yield Badge - Positioned on image for mobile space saving */}
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded border text-[8px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md z-10 ${style.badge}`}>
                            High Yield
                        </div>
                    </div>

                    <div className="p-3 md:p-7 relative z-10 flex flex-col h-[calc(100%-6rem)] sm:h-[calc(100%-8rem)] md:h-[calc(100%-12rem)]">
                        {/* Subtle Internal Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-${accentColor}-500/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        <h3 className={`text-sm sm:text-lg md:text-2xl font-black text-white mb-1.5 md:mb-3 transition-all duration-300 group-hover:bg-clip-text group-hover:text-transparent bg-gradient-to-r ${style.text} line-clamp-2`}>
                            {chapter.title}
                        </h3>

                        <p className="text-gray-400 text-[10px] md:text-sm mb-4 md:mb-8 line-clamp-2 leading-relaxed font-medium group-hover:text-gray-300 transition-colors hidden sm:block">
                            {chapter.description}
                        </p>

                        <div className="mt-auto flex flex-wrap items-center gap-y-3 gap-x-4 sm:gap-x-6 border-t border-white/10 pt-4 md:pt-6 relative z-10">
                            <div className="flex items-center gap-2.5 text-[12px] md:text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                <PlayCircle size={16} className={`text-${accentColor}-400 md:w-5 md:h-5`} />
                                <span className="whitespace-nowrap">{chapter.lectures.length} Lectures</span>
                            </div>

                            <div className="hidden sm:block w-px h-6 md:h-8 bg-white/10" />

                            <div className="flex items-center gap-2.5 text-[12px] md:text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                <FileText size={16} className="text-blue-400 md:w-5 md:h-5" />
                                <span>DPP</span>
                            </div>

                            <div className="hidden sm:block w-px h-6 md:h-8 bg-white/10" />

                            <div className="flex items-center gap-2.5 text-[12px] md:text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                                <Book size={16} className="text-purple-400 md:w-5 md:h-5" />
                                <span>Lecture Notes</span>
                            </div>

                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
