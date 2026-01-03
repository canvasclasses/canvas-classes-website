'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { fetchHandwrittenNotes, HandwrittenNote, getUniqueCategories, getNotesStats } from '../lib/handwrittenNotesData';
import { Search, Download, FileText, BookOpen, FlaskConical, Atom, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Category icons and colors
const categoryStyles: Record<string, { icon: React.ElementType; gradient: string; bg: string; border: string }> = {
    'Organic Chemistry': {
        icon: FlaskConical,
        gradient: 'from-pink-500 to-rose-500',
        bg: 'bg-pink-50',
        border: 'border-pink-200 hover:border-pink-400'
    },
    'Inorganic Chemistry': {
        icon: Atom,
        gradient: 'from-purple-500 to-indigo-500',
        bg: 'bg-purple-50',
        border: 'border-purple-200 hover:border-purple-400'
    },
    'Physical Chemistry': {
        icon: Sparkles,
        gradient: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-50',
        border: 'border-blue-200 hover:border-blue-400'
    },
    'General chemistry': {
        icon: BookOpen,
        gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200 hover:border-amber-400'
    }
};

export default function HandwrittenNotesClient() {
    const [notes, setNotes] = useState<HandwrittenNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchHandwrittenNotes();
            setNotes(data);
            setLoading(false);
        };
        loadData();
    }, []);

    const categories = getUniqueCategories(notes);
    const stats = getNotesStats(notes);

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const getCategoryStyle = (category: string) => {
        return categoryStyles[category] || categoryStyles['General chemistry'];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex justify-center items-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4" style={{ background: 'linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)' }}>
                <div className="max-w-6xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <FileText size={16} />
                            Free Resources
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Handwritten Notes
                        </h1>
                        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                            Download my personal handwritten notes, highlighted NCERTs, and revision sheets
                            for <span className="font-semibold">JEE, NEET & CBSE</span> Chemistry
                        </p>
                    </motion.div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-8">
                        {[
                            { label: 'Total Notes', value: stats.total, icon: FileText, color: 'bg-white/20 hover:bg-white/30' },
                            { label: 'Organic', value: stats.organic, icon: FlaskConical, color: 'bg-pink-500/30 hover:bg-pink-500/50' },
                            { label: 'Inorganic', value: stats.inorganic, icon: Atom, color: 'bg-purple-500/30 hover:bg-purple-500/50' },
                            { label: 'Physical', value: stats.physical, icon: Sparkles, color: 'bg-blue-500/30 hover:bg-blue-500/50' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${stat.color} backdrop-blur-sm rounded-xl p-4 text-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-black/20`}
                            >
                                <stat.icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="text-sm opacity-80">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <section className="px-4 py-8 -mt-6 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search notes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-10 text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer min-w-[200px]"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Notes Grid */}
            <section className="px-4 pb-20">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        {filteredNotes.length > 0 ? (
                            <motion.div
                                key="notes-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredNotes.map((note, index) => {
                                    const style = getCategoryStyle(note.category);
                                    const IconComponent = style.icon;

                                    return (
                                        <motion.a
                                            key={note.id}
                                            href={note.notesUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className={`group block bg-white rounded-2xl p-6 border-2 ${style.border} shadow-sm hover:shadow-xl transition-all duration-300`}
                                        >
                                            {/* Category Badge */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${style.bg} text-gray-700`}>
                                                    <IconComponent size={14} />
                                                    {note.category}
                                                </span>
                                                <ExternalLink size={18} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">
                                                {note.title}
                                            </h3>

                                            {/* Download Button */}
                                            <div className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${style.gradient} text-white font-medium text-sm group-hover:shadow-lg transition-all`}>
                                                <Download size={18} />
                                                Download Notes
                                            </div>
                                        </motion.a>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="no-results"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-16 bg-white rounded-2xl border border-gray-200"
                            >
                                <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search or filter</p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCategoryFilter('all');
                                    }}
                                    className="text-amber-600 hover:text-amber-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </div>
    );
}
