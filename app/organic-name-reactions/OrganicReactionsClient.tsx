'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { OrganicReaction, getReactionStats, getUniqueReactionTypes } from '../lib/organicReactionsData';
import { Search, FlaskConical, ChevronDown, ChevronUp, Info, Sparkles, BookOpen, Layers, Zap, X, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface OrganicReactionsClientProps {
    initialReactions: OrganicReaction[];
}

// Data is now fetched on the server and passed as props for SEO
export default function OrganicReactionsClient({ initialReactions }: OrganicReactionsClientProps) {
    const [reactions] = useState<OrganicReaction[]>(initialReactions);
    const [searchQuery, setSearchQuery] = useState('');
    const [classFilter, setClassFilter] = useState<'all' | '11' | '12'>('all');
    // const [typeFilter, setTypeFilter] = useState<string>('all'); // Removed filter
    const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'Easy' | 'Moderate' | 'Hard'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const stats = getReactionStats(reactions);
    const reactionTypes = getUniqueReactionTypes(reactions);

    // Filter reactions
    const filteredReactions = reactions.filter(reaction => {
        const matchesSearch = reaction.reactionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reaction.reactionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reaction.summary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = classFilter === 'all' || reaction.classNum.toString() === classFilter;
        // const matchesType = typeFilter === 'all' || reaction.reactionType === typeFilter;
        const matchesDifficulty = difficultyFilter === 'all' || reaction.difficulty === difficultyFilter;
        return matchesSearch && matchesClass && matchesDifficulty;
    });

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            case 'Moderate': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'Hard': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-700/50 text-gray-300 border-gray-600';
        }
    };

    const getDifficultyBorderColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'border-l-emerald-500';
            case 'Moderate': return 'border-l-amber-500';
            case 'Hard': return 'border-l-red-500';
            default: return 'border-l-gray-500';
        }
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white font-sans selection:bg-emerald-500/30">

            {/* Hero Section - Dark Emerald Theme */}
            <section className="relative pt-32 pb-16 px-4 md:pt-40 md:pb-20 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto text-center z-10">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6"
                    >
                        <Sparkles size={16} />
                        NCERT Organic Chemistry
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight"
                    >
                        Organic <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Name Reactions</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        Master every named reaction from Class 11 & 12 NCERT with handwritten reaction mechanisms and key-points that make your revision highly effective.
                    </motion.p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
                        {[
                            { label: 'Total Reactions', value: stats.total, icon: Layers, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                            { label: 'Class 11', value: stats.class11, icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                            { label: 'Class 12', value: stats.class12, icon: FlaskConical, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
                            { label: 'Reaction Types', value: stats.uniqueTypes, icon: Filter, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className={`group rounded-xl md:rounded-2xl p-3 md:p-5 border ${stat.bg} ${stat.border} backdrop-blur-sm transition-all duration-300 hover:bg-opacity-20 hover:border-emerald-500/30 flex items-center gap-3`}
                            >
                                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} border ${stat.border} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={20} className={stat.color} />
                                </div>
                                <div className="text-left">
                                    <div className={`text-xl md:text-2xl font-bold ${stat.color} leading-none`}>{stat.value}</div>
                                    <div className="text-gray-400 text-[10px] md:text-xs font-medium uppercase tracking-wider mt-0.5">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="px-4 -mt-8 relative z-20">
                <div className="max-w-4xl mx-auto bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50 p-3 md:p-5 border border-gray-700/50">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search reactions (e.g., 'Aldol', 'Cannizzaro')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all text-sm md:text-base"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1 md:flex-none">
                                <select
                                    value={classFilter}
                                    onChange={(e) => setClassFilter(e.target.value as 'all' | '11' | '12')}
                                    className="appearance-none w-full md:w-auto pl-10 pr-9 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer hover:bg-gray-700/40 transition-colors"
                                >
                                    <option value="all">All Classes</option>
                                    <option value="11">Class 11</option>
                                    <option value="12">Class 12</option>
                                </select>
                                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 pointer-events-none" />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 pointer-events-none" />
                            </div>

                            <div className="relative flex-1 md:flex-none">
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value as 'all' | 'Easy' | 'Moderate' | 'Hard')}
                                    className="appearance-none w-full md:w-auto pl-10 pr-9 py-2.5 bg-gray-800/40 border border-gray-700/50 rounded-xl text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer hover:bg-gray-700/40 transition-colors"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="Easy">Easy</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Hard">Hard</option>
                                </select>
                                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 pointer-events-none" />
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-3.5 h-3.5 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reactions List */}
            <section className="px-4 py-12 pb-32">
                <div className="max-w-4xl mx-auto">
                    {filteredReactions.length > 0 ? (
                        <div className="space-y-4">
                            {filteredReactions.map((reaction, index) => (
                                <motion.div
                                    key={reaction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className={`bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-700/50 border-l-[6px] ${getDifficultyBorderColor(reaction.difficulty)} shadow-lg hover:shadow-emerald-900/10 hover:border-gray-600 transition-all overflow-hidden group`}
                                >
                                    {/* Collapsed Header */}
                                    <button
                                        onClick={() => toggleExpand(reaction.id)}
                                        className="cursor-pointer w-full p-4 md:p-6 flex items-center gap-4 text-left hover:bg-gray-800/30 transition-colors focus:outline-none focus:bg-gray-800/30"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5 md:mb-2">
                                                <h3 className="font-bold text-white text-lg md:text-xl truncate group-hover:text-emerald-400 transition-colors">
                                                    {reaction.reactionName}
                                                </h3>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
                                                <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-gray-400 text-[10px] md:text-xs font-medium">
                                                    {reaction.reactionType}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium border ${getDifficultyColor(reaction.difficulty)}`}>
                                                    {reaction.difficulty}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-gray-400 text-[10px] md:text-xs font-medium">
                                                    Class {reaction.classNum}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-gray-500 group-hover:text-emerald-400 transition-colors bg-gray-800/30 p-1.5 md:p-2 rounded-full">
                                            {expandedId === reaction.id ? (
                                                <ChevronUp size={18} className="md:w-5 md:h-5" />
                                            ) : (
                                                <ChevronDown size={18} className="md:w-5 md:h-5" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Content */}
                                    <AnimatePresence>
                                        {expandedId === reaction.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden bg-gray-900/30"
                                            >
                                                <div className="px-6 pb-8 pt-4 border-t border-gray-800">
                                                    {/* Mechanism Details */}
                                                    {reaction.mechanismDetails && (
                                                        <div className="mb-6">
                                                            <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                                                                <Zap size={16} />
                                                                Mechanism & Key Points
                                                            </h4>
                                                            <div className="text-gray-300 text-base leading-relaxed pl-6 border-l-2 border-emerald-500/20">
                                                                <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-white prose-em:text-gray-200">
                                                                    <ReactMarkdown
                                                                        remarkPlugins={[remarkMath]}
                                                                        rehypePlugins={[rehypeKatex]}
                                                                    >
                                                                        {reaction.mechanismDetails}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reaction Image */}
                                                    {reaction.imageUrl && (
                                                        <div className="mt-6">
                                                            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-400">
                                                                <FlaskConical size={16} className="text-cyan-400" />
                                                                Reaction Scheme
                                                            </div>
                                                            <div
                                                                className="cursor-pointer rounded-xl overflow-hidden border border-gray-700 bg-black/40 hover:border-gray-600 transition-all group/image relative"
                                                                onClick={() => setLightboxImage(reaction.imageUrl)}
                                                            >
                                                                <img
                                                                    src={reaction.imageUrl}
                                                                    alt={`${reaction.reactionName} mechanism`}
                                                                    className="w-full h-auto opacity-90 group-hover/image:opacity-100 transition-opacity"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
                                                                    <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-md border border-white/10">
                                                                        <Sparkles size={14} /> Click to Expand
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-900/40 backdrop-blur-sm rounded-2xl border border-gray-800">
                            <FlaskConical size={64} className="mx-auto mb-6 text-gray-700" />
                            <h3 className="text-xl font-bold text-white mb-2">No reactions found</h3>
                            <p className="text-gray-500 mb-6">Try adjusting your filters or search query.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setClassFilter('all');
                                    // setTypeFilter('all');
                                    setDifficultyFilter('all');
                                }}
                                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors cursor-pointer"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="cursor-pointer absolute top-6 right-6 text-gray-400 hover:text-white transition-colors bg-gray-800/50 p-2 rounded-full hover:bg-gray-800">
                            <X size={24} />
                        </button>
                        <motion.img
                            src={lightboxImage}
                            alt="Full screen preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border border-gray-800"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            Click anywhere to close
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/20 transition-all z-40 cursor-pointer border border-emerald-400/20"
            >
                <ChevronUp size={24} />
            </motion.button>
        </div>
    );
}
