'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BookOpen, ChevronRight, Zap, PlayCircle, FileText } from 'lucide-react';
import { NeetChapter } from '@/app/lib/neetCrashCourseData';

interface NeetCrashCourseClientProps {
    initialChapters: NeetChapter[];
}

// Data is now fetched on the server and passed as props for SEO
export default function NeetCrashCourseClient({ initialChapters }: NeetCrashCourseClientProps) {
    const [chapters] = useState<NeetChapter[]>(initialChapters);

    const class11Chapters = chapters.filter(c => c.classNum === '11');
    const class12Chapters = chapters.filter(c => c.classNum === '12');

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 font-sans text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-semibold text-sm mb-6">
                        🚀 Ultimate NEET Prep
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                        NEET <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Crash Course</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Complete Chemistry revision for NEET. High-yield lectures, Daily Practice Problems (DPP), and Video Solutions designed to boost your rank.
                    </p>
                </div>
            </section>

            {/* Class 11 Section */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <BookOpen size={24} />
                        </div>
                        <h2 className="text-3xl font-bold">Class 11 Syllabus</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {class11Chapters.map((chapter, index) => (
                            <ChapterCard key={chapter.id} chapter={chapter} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Class 12 Section */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                            <Zap size={24} />
                        </div>
                        <h2 className="text-3xl font-bold">Class 12 Syllabus</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {class12Chapters.map((chapter, index) => (
                            <ChapterCard key={chapter.id} chapter={chapter} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function ChapterCard({ chapter, index }: { chapter: any, index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <Link href={`/neet-crash-course/${chapter.slug}`} className="block h-full">
                <div className="group h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-indigo-400 rounded-3xl p-6 transition-all duration-300 hover:from-slate-700 hover:to-slate-800 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.5)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-indigo-500/10 rounded-full p-2 text-indigo-400">
                            <ChevronRight size={16} />
                        </div>
                    </div>

                    <div className="mt-8"> {/* Added margin top to compensate for removed badge */}
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-cyan-300 transition-all">
                            {chapter.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed font-medium group-hover:text-gray-300 transition-colors">
                            {chapter.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-5 text-xs font-semibold text-gray-400 group-hover:text-gray-300 transition-colors mt-auto border-t border-slate-700/50 pt-4">
                        <span className="flex items-center gap-2">
                            <PlayCircle size={16} className="text-purple-400" /> Lectures
                        </span>
                        <span className="flex items-center gap-2">
                            <FileText size={16} className="text-cyan-400" /> DPP
                        </span>

                        <span className="ml-auto text-indigo-500/0 group-hover:text-indigo-400 text-xs font-bold transition-all transform translate-x-2 group-hover:translate-x-0 flex items-center gap-1">
                            Start <ChevronRight size={12} />
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
