'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Search,
    BookOpen,
    Layers,
    ImageIcon,
    ArrowRight,
    Zap,
    Filter
} from 'lucide-react';
import { RevisionChapter } from '@/app/lib/revisionData';

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        const duration = 1500;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value]);

    return <span>{displayValue}{suffix}</span>;
}

export default function CBSERevisionPage() {
    const [chapters, setChapters] = useState<RevisionChapter[]>([]);
    const [stats, setStats] = useState({ totalChapters: 0, totalInfographics: 0, totalFlashcards: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | 'Physical' | 'Organic' | 'Inorganic'>('All');

    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/cbse-revision');
                const data = await response.json();
                setChapters(data.chapters);
                setStats(data.stats);
            } catch (error) {
                console.error('Failed to load revision data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredChapters = useMemo(() => {
        return chapters.filter(chapter => {
            const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === 'All' || chapter.branch === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [chapters, searchQuery, activeFilter]);

    const getBranchGradient = (branch: string) => {
        switch (branch) {
            case 'Physical': return 'from-blue-600 to-cyan-500';
            case 'Organic': return 'from-violet-600 to-purple-500';
            case 'Inorganic': return 'from-rose-600 to-pink-500';
            default: return 'from-teal-600 to-emerald-500';
        }
    };

    const getBranchColor = (branch: string) => {
        switch (branch) {
            case 'Physical': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
            case 'Organic': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
            case 'Inorganic': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-teal-400 bg-teal-400/10 border-teal-400/20';
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-teal-500/30">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

                <div className="relative container mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6"
                    >
                        <Zap className="w-4 h-4" />
                        <span>Visual Learning System</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        CBSE Class 12 <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            NCERT Revision
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto mb-12"
                    >
                        Master complex chemistry concepts through high-quality infographics and rapid-fire flashcards.
                        Designed for last-minute revision and memory retention.
                    </motion.p>

                    {/* Global Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {[
                            { label: 'Chapters', value: stats.totalChapters, icon: BookOpen, color: 'text-blue-400' },
                            { label: 'Infographics', value: stats.totalInfographics, icon: ImageIcon, color: 'text-purple-400' },
                            { label: 'Flashcards', value: stats.totalFlashcards, icon: Layers, color: 'text-pink-400' },
                            { label: 'Topics', value: 106, icon: Filter, color: 'text-teal-400' }, // Manual value for now
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1 }}
                                className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-gray-800/80 hover:shadow-lg hover:border-gray-700 group ${stat.color.includes('blue') ? 'hover:shadow-blue-500/20 hover:border-blue-500/30' :
                                        stat.color.includes('purple') ? 'hover:shadow-purple-500/20 hover:border-purple-500/30' :
                                            stat.color.includes('pink') ? 'hover:shadow-pink-500/20 hover:border-pink-500/30' :
                                                'hover:shadow-teal-500/20 hover:border-teal-500/30'
                                    }`}
                            >
                                <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color} transition-transform duration-300 group-hover:scale-110`} />
                                <div className="text-2xl font-bold mb-1 group-hover:text-white transition-colors">
                                    <AnimatedCounter value={stat.value} />
                                </div>
                                <div className="text-gray-500 text-sm font-medium uppercase tracking-wider group-hover:text-gray-400 transition-colors">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-12 bg-gray-950">
                <div className="container mx-auto px-6">
                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                            {['All', 'Physical', 'Organic', 'Inorganic'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter as any)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeFilter === filter
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                        : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-gray-900/50 h-64 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredChapters.length === 0 ? (
                        <div className="text-center py-24 text-gray-500">
                            No chapters found matching your criteria.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChapters.map((chapter, index) => {
                                const gradient = getBranchGradient(chapter.branch);
                                const badgeStyle = getBranchColor(chapter.branch);

                                return (
                                    <motion.div
                                        key={chapter.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="group relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 hover:-translate-y-1">
                                            {/* Gradient Header */}
                                            <div className={`h-24 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
                                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                {/* Badge */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
                                                        {chapter.branch}
                                                    </span>
                                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700 font-bold text-sm">
                                                        {chapter.id}
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-bold text-white mb-6 line-clamp-1 group-hover:text-blue-400 transition-colors">
                                                    {chapter.title}
                                                </h3>

                                                {/* Stats Row */}
                                                <div className="grid grid-cols-2 gap-3 mb-6">
                                                    <div className="bg-gray-950/50 rounded-xl p-3 border border-gray-800/50">
                                                        <div className="flex items-center gap-2 text-purple-400 mb-1">
                                                            <ImageIcon className="w-4 h-4" />
                                                            <span className="text-sm font-semibold">{chapter.infographicsCount}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">Infographics</div>
                                                    </div>
                                                    <div className="bg-gray-950/50 rounded-xl p-3 border border-gray-800/50">
                                                        <div className="flex items-center gap-2 text-pink-400 mb-1">
                                                            <Layers className="w-4 h-4" />
                                                            <span className="text-sm font-semibold text-gray-400">{chapter.flashcardsCount > 0 ? chapter.flashcardsCount : '-'}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">Flashcards</div>
                                                    </div>
                                                </div>

                                                <button className="w-full py-3 bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                                                    Start Revising <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
