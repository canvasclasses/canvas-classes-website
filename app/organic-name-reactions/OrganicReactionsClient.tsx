'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { OrganicReaction, getReactionStats, getUniqueReactionTypes } from '../lib/organicReactionsData';
import { Search, FlaskConical, ChevronDown, ChevronUp, Info, Sparkles, BookOpen, Layers, Zap, X } from 'lucide-react';
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
    const [typeFilter, setTypeFilter] = useState<string>('all');
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
        const matchesType = typeFilter === 'all' || reaction.reactionType === typeFilter;
        const matchesDifficulty = difficultyFilter === 'all' || reaction.difficulty === difficultyFilter;
        return matchesSearch && matchesClass && matchesType && matchesDifficulty;
    });

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy': return 'bg-emerald-100 text-emerald-700';
            case 'Moderate': return 'bg-amber-100 text-amber-700';
            case 'Hard': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

            {/* Hero Section - Green Theme */}
            <section className="pt-32 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)' }}>
                <div className="max-w-6xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Sparkles size={16} />
                        NCERT Organic Chemistry
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
                        All Organic Name Reactions
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        Master every named reaction from Class 11 & 12 NCERT with detailed mechanisms and handwritten notes
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                            <div className="text-white/80 text-sm font-medium">Total Reactions</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                            <div className="text-3xl font-bold text-white">{stats.class11}</div>
                            <div className="text-white/80 text-sm font-medium">Class 11</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                            <div className="text-3xl font-bold text-white">{stats.class12}</div>
                            <div className="text-white/80 text-sm font-medium">Class 12</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
                            <div className="text-3xl font-bold text-white">{stats.uniqueTypes}</div>
                            <div className="text-white/80 text-sm font-medium">Reaction Types</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <section className="px-4 -mt-8 relative z-10">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search reactions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-3 flex-wrap">
                            <select
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value as 'all' | '11' | '12')}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                                <option value="all">All Classes</option>
                                <option value="11">Class 11</option>
                                <option value="12">Class 12</option>
                            </select>

                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                                <option value="all">All Types</option>
                                {reactionTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>

                            <select
                                value={difficultyFilter}
                                onChange={(e) => setDifficultyFilter(e.target.value as 'all' | 'Easy' | 'Moderate' | 'Hard')}
                                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                            >
                                <option value="all">All Difficulties</option>
                                <option value="Easy">Easy</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reactions List */}
            <section className="px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {filteredReactions.length > 0 ? (
                        <div className="space-y-4">
                            {filteredReactions.map((reaction, index) => (
                                <motion.div
                                    key={reaction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Collapsed Header */}
                                    <button
                                        onClick={() => toggleExpand(reaction.id)}
                                        className="w-full p-5 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
                                            <FlaskConical size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 text-lg truncate">
                                                {reaction.reactionName}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                    {reaction.reactionType}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(reaction.difficulty)}`}>
                                                    {reaction.difficulty}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                                    Class {reaction.classNum}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 text-gray-400">
                                            {expandedId === reaction.id ? (
                                                <ChevronUp size={24} />
                                            ) : (
                                                <ChevronDown size={24} />
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
                                                className="overflow-hidden"
                                            >
                                                <div className="px-5 pb-6 pt-2 border-t border-gray-100">
                                                    {/* Quick Summary */}
                                                    <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#eff6ff' }}>
                                                        <div className="flex items-start gap-3">
                                                            <Info className="text-blue-500 mt-0.5 flex-shrink-0" size={20} />
                                                            <div className="text-gray-700 text-sm leading-relaxed">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkMath]}
                                                                    rehypePlugins={[rehypeKatex]}
                                                                >
                                                                    {reaction.summary}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Mechanism Details */}
                                                    {reaction.mechanismDetails && (
                                                        <div className="mb-6">
                                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                                <Zap size={18} className="text-amber-500" />
                                                                Mechanism & Key Points
                                                            </h4>
                                                            <div className="text-gray-600 text-sm leading-relaxed pl-6">
                                                                <ReactMarkdown
                                                                    remarkPlugins={[remarkMath]}
                                                                    rehypePlugins={[rehypeKatex]}
                                                                >
                                                                    {reaction.mechanismDetails}
                                                                </ReactMarkdown>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Reaction Image */}
                                                    {reaction.imageUrl && (
                                                        <div
                                                            className="rounded-xl overflow-hidden border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                                                            onClick={() => setLightboxImage(reaction.imageUrl)}
                                                        >
                                                            <img
                                                                src={reaction.imageUrl}
                                                                alt={`${reaction.reactionName} mechanism`}
                                                                className="w-full h-auto"
                                                            />
                                                            <p className="text-center text-sm text-gray-500 py-2 bg-gray-50">
                                                                Click to expand • {reaction.reactionName}
                                                            </p>
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
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                            <FlaskConical size={48} className="mx-auto mb-4 text-gray-300" />
                            <p className="text-gray-500 text-lg">No reactions found matching your criteria.</p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setClassFilter('all');
                                    setTypeFilter('all');
                                    setDifficultyFilter('all');
                                }}
                                className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium"
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
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setLightboxImage(null)}
                    >
                        <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2">
                            <X size={32} />
                        </button>
                        <motion.img
                            src={lightboxImage}
                            alt="Full screen preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all z-40"
            >
                <ChevronUp size={24} />
            </button>
        </div>
    );
}
