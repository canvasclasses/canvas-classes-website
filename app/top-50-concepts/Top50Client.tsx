'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    Play,
    Layers,
    Eye,
    ExternalLink,
    X,
    ChevronRight,
    PlayCircle,
    Lightbulb,
    FileText,
    Trophy,
} from 'lucide-react';

interface Concept {
    id: number;
    videoNumber: number;
    title: string;
    youtubeUrl: string;
    views: string;
    thumbnailUrl: string;
    category: string;
}

// Animated Counter Component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current || value === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1500;
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        setDisplayValue(Math.floor(easeOut * value));

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setDisplayValue(value);
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref}>{displayValue}{suffix}</span>;
}

// Category colors for dark theme
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Organic Chemistry': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Inorganic Chemistry': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    'Physical Chemistry': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    'Environmental': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'General Chemistry': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

// Helper to get category colors safetly (fallback for new Sheet categories)
const getCategoryStyle = (category: string) => {
    return categoryColors[category] || {
        bg: 'bg-slate-700/50',
        text: 'text-slate-300',
        border: 'border-slate-600/50'
    };
};

interface Top50ClientProps {
    initialConcepts: Concept[];
}

// Data is now fetched on the server and passed as props for SEO
export default function Top50Client({ initialConcepts }: Top50ClientProps) {
    const [concepts] = useState<Concept[]>(initialConcepts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [activeVideo, setActiveVideo] = useState<Concept | null>(null);
    const [activeTab, setActiveTab] = useState<'videos' | 'notes'>('videos');

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ['All Categories', ...new Set(concepts.map(c => c.category))];
        return cats;
    }, [concepts]);

    // Filter concepts
    const filteredConcepts = useMemo(() => {
        return concepts.filter(concept => {
            const matchesSearch = !searchQuery ||
                concept.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All Categories' ||
                concept.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [concepts, searchQuery, selectedCategory]);

    // Stats
    const stats = useMemo(() => {
        const totalViews = concepts.reduce((sum, c) => {
            const viewNum = parseInt(c.views.replace(/[^\d]/g, ''), 10) || 0;
            return sum + viewNum;
        }, 0);
        return {
            totalConcepts: concepts.length,
            totalCategories: new Set(concepts.map(c => c.category)).size,
            totalViews: Math.round(totalViews / 1000), // in K
        };
    }, [concepts]);

    const getCategoryStyle = (category: string) => {
        return categoryColors[category] || categoryColors['General Chemistry'];
    };

    // Extract video ID for embed
    const getYoutubeId = (url: string): string | null => {
        let match = url.match(/youtube\.com\/watch\?v=([-\w]+)/);
        if (match) return match[1];
        match = url.match(/youtu\.be\/([-\w]+)/);
        if (match) return match[1];
        return null;
    };

    // PDF Notes URL
    const notesUrl = 'https://drive.google.com/file/d/1CzU5NXWasAnx1g3Xv0YaUU0U43gqx6CF/preview';

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 md:pt-40 pb-8 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6 flex flex-col items-center text-center">

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        <span className="text-white">Top 50 </span>
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            Must-Know Concepts
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="hidden md:block text-gray-400 text-lg max-w-2xl mx-auto mb-10"
                    >
                        Master the most important chemistry concepts for JEE & NEET. These handpicked
                        topics are frequently asked in exams and essential for your preparation.
                    </motion.p>

                    {/* Tab Toggle */}
                    {/* Redesigned Tab Toggle */}
                    <div className="relative inline-flex bg-gray-900/40 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-800 mb-8">
                        {/* Sliding Background */}
                        <motion.div
                            className="absolute inset-y-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-lg"
                            initial={false}
                            animate={{
                                x: activeTab === 'videos' ? 0 : '100%',
                                width: '50%' // Assuming 2 tabs of equal width
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{ left: 6, right: 'auto' }} // Adjust based on padding
                        />

                        <button
                            onClick={() => setActiveTab('videos')}
                            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${activeTab === 'videos' ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <PlayCircle className={`w-5 h-5 ${activeTab === 'videos' ? 'text-white' : 'text-gray-500'}`} />
                            Lectures
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-300 ${activeTab === 'notes' ? 'text-white' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText className={`w-5 h-5 ${activeTab === 'notes' ? 'text-white' : 'text-gray-500'}`} />
                            PDF Notes
                        </button>
                    </div>

                    {/* Mobile Category Grid Removed - Unified with Desktop Filter Grid */}
                </div>
            </section>

            {activeTab === 'videos' ? (
                <>
                    {/* Filter Buttons - Replaces Stats Cards on Desktop & Mobile Grid */}
                    <section className="relative py-4 md:py-8">
                        <div className="container mx-auto max-w-5xl px-6">
                            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center justify-center gap-3 md:gap-4">
                                {[
                                    { label: 'All Lectures', value: 'All Categories', color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
                                    { label: 'Physical', value: 'Physical Chemistry', color: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-500/20' },
                                    { label: 'Organic', value: 'Organic Chemistry', color: 'from-amber-500 to-orange-600', shadow: 'shadow-orange-500/20' },
                                    { label: 'Inorganic', value: 'Inorganic Chemistry', color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' }
                                ].map((btn) => (
                                    <button
                                        key={btn.label}
                                        onClick={() => setSelectedCategory(btn.value)}
                                        className={`px-4 md:px-8 py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all duration-300 w-full md:w-auto h-full ${selectedCategory === btn.value
                                            ? `bg-gradient-to-r ${btn.color} text-white shadow-lg ${btn.shadow} scale-[1.02] md:scale-105 border border-transparent`
                                            : 'bg-gray-800/40 text-gray-400 border border-gray-700/50 hover:bg-gray-800/80 hover:text-white hover:border-gray-600'
                                            }`}
                                    >
                                        {btn.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Search & Filter Bar */}
                    <section className="py-8">
                        <div className="container mx-auto px-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                                <div className="relative w-full max-w-lg">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search concepts..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </div>

                                <div className="w-full md:w-auto">
                                    {/* Desktop: Dropdown */}
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="hidden md:block bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 px-4 text-gray-300 focus:outline-none focus:border-amber-500/50 min-w-[180px]"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <p className="text-gray-400 mt-6">
                                Showing <span className="font-bold text-white">{filteredConcepts.length}</span> concepts
                            </p>
                        </div>
                    </section>

                    {/* Inline Video Player */}
                    <AnimatePresence>
                        {activeVideo && (
                            <motion.section
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-950 border-y border-gray-800"
                            >
                                <div className="container mx-auto px-6 py-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                                            <h3 className="text-white font-semibold text-lg line-clamp-1">
                                                #{activeVideo.videoNumber} - {activeVideo.title}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={() => setActiveVideo(null)}
                                            className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="aspect-video max-w-4xl mx-auto rounded-xl overflow-hidden border border-gray-700">
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtubeUrl)}?autoplay=1&rel=0`}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={activeVideo.title}
                                        />
                                    </div>
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Concepts Grid */}
                    <section className="py-8 pb-24">
                        <div className="container mx-auto px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredConcepts.map((concept, index) => {
                                    const catStyle = getCategoryStyle(concept.category);
                                    const isActive = activeVideo?.id === concept.id;

                                    return (
                                        <motion.div
                                            key={concept.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            onClick={() => setActiveVideo(concept)}
                                            className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 cursor-pointer hover:border-amber-500/50 hover:shadow-2xl transition-all duration-300 flex flex-col"
                                        >
                                            {/* Thumbnail Container */}
                                            <div className="relative aspect-video overflow-hidden">
                                                <Image
                                                    src={concept.thumbnailUrl}
                                                    alt={concept.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 border border-white/10">
                                                    <Eye className="w-3 h-3 text-amber-400" />
                                                    {concept.views}
                                                </div>

                                                {/* Play Button Overlay */}
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-12 h-12 bg-amber-500/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                                                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex gap-2 mb-3">
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                                                        {concept.category}
                                                    </span>
                                                </div>
                                                <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors">
                                                    {concept.title}
                                                </h3>
                                                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500 border-t border-gray-700/50">
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                                        Concept #{concept.videoNumber}
                                                    </span>
                                                    <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400 font-medium">
                                                        Watch Now <ChevronRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                /* PDF Notes Tab */
                <section className="py-8 pb-24">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
                        >
                            {/* PDF Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold">Top 50 Concepts - Complete Notes</h3>
                                        <p className="text-gray-400 text-sm">Handwritten notes for quick revision</p>
                                    </div>
                                </div>
                                <a
                                    href="https://drive.google.com/file/d/1CzU5NXWasAnx1g3Xv0YaUU0U43gqx6CF/view?usp=sharing"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500 hover:text-white hover:border-transparent transition-all text-sm font-medium"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Open in Drive
                                </a>
                            </div>

                            {/* PDF Viewer */}
                            <div className="relative h-[700px] bg-gray-900">
                                <iframe
                                    src={notesUrl}
                                    className="w-full h-full"
                                    title="Top 50 Concepts Notes"
                                    allow="autoplay"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>
            )
            }

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 text-center overflow-hidden border border-gray-700/50">
                        {/* Subtle glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Master All Chemistry Concepts
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                These top concepts are just the beginning. Explore our complete lectures
                                and quick recap videos for comprehensive preparation.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/detailed-lectures"
                                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
                                >
                                    <PlayCircle className="w-5 h-5" />
                                    Detailed Lectures
                                </Link>
                                <Link
                                    href="/one-shot-lectures"
                                    className="flex items-center gap-2 bg-gray-700/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                                >
                                    <Lightbulb className="w-5 h-5" />
                                    Quick Recap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
}
