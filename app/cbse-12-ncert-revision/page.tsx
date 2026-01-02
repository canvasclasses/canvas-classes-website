'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { Search, BookOpen, ChevronRight, Book } from 'lucide-react';
import Link from 'next/link';

interface RevisionChapter {
    id: string;
    classNum: number;
    chapterNum: number;
    chapterName: string;
    summary: string;
    slug: string;
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
            <Navbar />

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
                            NCERT Revision Notes
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
                                        className="h-full bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 hover:bg-gray-900/80 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 relative overflow-hidden"
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

                                        <h2 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-white transition-colors">
                                            {chapterData.chapterName}
                                        </h2>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            Click to view full chapter summary and infographics.
                                        </p>
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
