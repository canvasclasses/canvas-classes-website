'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, Book, Image as ImageIcon, Layers, CheckCircle, Brain, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface RevisionChapter {
    id: string;
    classNum: number;
    chapterNum: number;
    chapterName: string;
    summary: string;
    slug: string;
    infographicsCount?: number;
    flashcardsCount?: number;
    hasSummary?: boolean;
}

export default function RevisionPage() {
    const [chapters, setChapters] = useState<RevisionChapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/cbse-12-ncert-revision');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setChapters(data);
                }
            } catch (error) {
                console.error('Failed to load revision data', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredChapters = chapters.filter(chapter => {
        return chapter.chapterName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-purple-500/30">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-gray-950 to-gray-950 pointer-events-none" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-teal-300 mb-6 drop-shadow-lg p-2">
                            Perfect Revision for NCERT Chemistry
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                            Find all important <span className="text-purple-300 font-medium">Formulas, Graphs, Tricks</span> and common <span className="text-teal-300 font-medium">Silly Mistakes</span> to ensure an effective and quick revision of your NCERT Chemistry.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Search Bar */}
            <section className="px-4 pb-12 relative z-10 sticky top-20">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 p-2 rounded-2xl shadow-xl">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search Chapter Name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Visual Learning Works */}
            <section className="px-4 pb-12 max-w-5xl mx-auto">
                <div className="rounded-3xl p-8 md:p-10 bg-gray-900/60 border border-gray-800">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
                        Why Visual Learning Works
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Better Retention - Pink/Rose */}
                        <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/10 rounded-2xl p-6 border border-pink-500/30 hover:border-pink-400/50 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/30 flex items-center justify-center mb-4">
                                <Brain className="w-6 h-6 text-pink-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Better Retention</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Visual content is processed 60,000 times faster than text, improving memory retention significantly.
                            </p>
                        </div>

                        {/* Quick Revision - Indigo/Blue */}
                        <div className="bg-gradient-to-br from-indigo-500/20 to-blue-600/10 rounded-2xl p-6 border border-indigo-500/30 hover:border-indigo-400/50 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center mb-4">
                                <TrendingUp className="w-6 h-6 text-indigo-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Quick Revision</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Infographics condense complex topics into digestible visuals for efficient last-minute revision.
                            </p>
                        </div>

                        {/* Active Recall - Teal/Emerald */}
                        <div className="bg-gradient-to-br from-teal-500/20 to-emerald-600/10 rounded-2xl p-6 border border-teal-500/30 hover:border-teal-400/50 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-teal-500/30 flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6 text-teal-300" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Active Recall</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Flashcards use spaced repetition and active recall for long-term knowledge retention.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content List */}
            <section className="px-4 pb-20 max-w-5xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredChapters.length === 0 ? (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="text-xl">No chapters found.</p>
                            </div>
                        ) : (
                            filteredChapters.map((chapterData, idx) => (
                                <Link
                                    href={`/cbse-12-ncert-revision/${chapterData.slug}`}
                                    key={chapterData.id}
                                    className="block group"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="h-full bg-gray-800/70 border border-gray-700 rounded-2xl p-6 hover:bg-gray-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 font-bold">
                                                    {chapterData.chapterNum}
                                                </div>
                                            </div>
                                            <div className="p-2 rounded-full bg-gray-800 text-gray-400 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                                                <ChevronRight size={20} />
                                            </div>
                                        </div>

                                        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-3">
                                            {chapterData.chapterName}
                                        </h2>

                                        {/* Stats Badges */}
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {chapterData.hasSummary && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-400 text-xs font-medium">
                                                    <CheckCircle size={12} />
                                                    Summary
                                                </span>
                                            )}
                                            {(chapterData.infographicsCount ?? 0) > 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 text-xs font-medium">
                                                    <ImageIcon size={12} />
                                                    {chapterData.infographicsCount} Infographics
                                                </span>
                                            )}
                                            {(chapterData.flashcardsCount ?? 0) > 0 && (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-medium">
                                                    <Layers size={12} />
                                                    {chapterData.flashcardsCount} Flashcards
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
