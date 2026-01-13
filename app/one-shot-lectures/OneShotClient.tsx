'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    Play,
    Clock,
    Layers,
    Gift,
    ExternalLink,
    X,
    ChevronRight,
    PlayCircle,
    Youtube,
    BookOpen,
    Beaker,
    Atom,
    FlaskConical,
} from 'lucide-react';

interface OneShotVideo {
    id: number;
    title: string;
    youtubeUrl: string;
    duration: string;
    durationMinutes: number;
    category: string;
    thumbnailUrl: string;
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

// Category tab configurations - match sheet category names
const categoryTabs = [
    { id: 'All', label: 'All Chapters', icon: Layers, color: 'from-gray-500 to-slate-500' },
    { id: 'Organic Chemistry', label: 'Organic', icon: Beaker, color: 'from-purple-500 to-pink-500' },
    { id: 'Inorganic Chemistry', label: 'Inorganic', icon: Atom, color: 'from-orange-500 to-amber-500' },
    { id: 'Physical Chemistry', label: 'Physical', icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
];

// Category colors for dark theme
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Organic Chemistry': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Inorganic Chemistry': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    'Physical Chemistry': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
};

interface OneShotClientProps {
    initialVideos: OneShotVideo[];
}

export default function OneShotClient({ initialVideos }: OneShotClientProps) {
    const [videos] = useState<OneShotVideo[]>(initialVideos);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [activeVideo, setActiveVideo] = useState<OneShotVideo | null>(null);

    // Filter videos
    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            const matchesSearch = !searchQuery ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' ||
                video.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [videos, searchQuery, selectedCategory]);

    // Stats per category
    const categoryStats = useMemo(() => {
        const stats: Record<string, number> = { All: videos.length };
        videos.forEach(v => {
            stats[v.category] = (stats[v.category] || 0) + 1;
        });
        return stats;
    }, [videos]);

    // Stats - use full category names from sheet
    const stats = useMemo(() => ({
        totalVideos: videos.length,
        organicCount: videos.filter(v => v.category === 'Organic Chemistry').length,
        inorganicCount: videos.filter(v => v.category === 'Inorganic Chemistry').length,
        physicalCount: videos.filter(v => v.category === 'Physical Chemistry').length,
        totalMinutes: videos.reduce((sum, v) => sum + v.durationMinutes, 0),
    }), [videos]);

    const getCategoryStyle = (category: string) => {
        // Fallback to a default style if category not found
        return categoryColors[category] || { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' };
    };

    // Extract video ID for embed
    const getYoutubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\s?]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header - Impactful Design */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                {/* Animated Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/30 via-transparent to-transparent" />
                <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
                <div className="absolute top-40 left-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                        <Link href="/" className="hover:text-violet-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-violet-400">One Shot Lectures</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            {/* Attention-grabbing Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/40 rounded-full mb-6"
                            >
                                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-red-400 font-semibold text-sm tracking-wide">STOP WASTING 6-8 HOURS!</span>
                            </motion.div>

                            {/* Main Title - Larger and Bolder */}
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                            >
                                <span className="text-white">One Shots</span>
                                <br />
                                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    That Work
                                </span>
                            </motion.h1>

                            {/* Subtitle with Impact */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
                            >
                                Learn complete chapters in{' '}
                                <span className="text-violet-400 font-bold">30-120 minutes</span>
                                {' '}— not 8 hours.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="flex flex-wrap gap-4 mb-8"
                            >
                                <button
                                    onClick={() => document.getElementById('video-grid')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 transition-all duration-300"
                                >
                                    <Play className="w-5 h-5" fill="currentColor" />
                                    Start Learning
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <a
                                    href="https://www.youtube.com/@CanvasClassesOfficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-6 py-4 bg-gray-800/60 text-white font-semibold rounded-2xl border border-gray-700/50 hover:border-gray-600 hover:bg-gray-800 transition-all"
                                >
                                    <Youtube className="w-5 h-5 text-red-500" />
                                    YouTube Channel
                                </a>
                            </motion.div>

                            {/* Trust Indicators */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex items-center gap-6 text-gray-400 text-sm"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 border-2 border-gray-900 flex items-center justify-center text-white text-xs font-bold">
                                                {['P', 'S', 'R', 'A'][i - 1]}
                                            </div>
                                        ))}
                                    </div>
                                    <span>1000+ Students</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-400">★★★★★</span>
                                    <span>Loved by JEE/NEET Toppers</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Side - Visual Comparison */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
                            className="relative"
                        >
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-orange-500/30">
                                VS
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Others Card - Bad */}
                                <div className="bg-gradient-to-br from-red-950/50 to-gray-900/50 rounded-2xl p-6 border border-red-500/30 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-full blur-xl" />
                                    <div className="relative">
                                        <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-3">Others</div>
                                        <div className="text-4xl font-black text-red-400 mb-2">6-8 hrs</div>
                                        <div className="text-gray-400 text-sm mb-4">per chapter</div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2 text-gray-400">
                                                <X className="w-4 h-4 text-red-500" />
                                                <span>Exhausting marathon</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-400">
                                                <X className="w-4 h-4 text-red-500" />
                                                <span>Poor retention</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-400">
                                                <X className="w-4 h-4 text-red-500" />
                                                <span>Marketing gimmick</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Canvas Classes Card - Good */}
                                <div className="bg-gradient-to-br from-emerald-950/50 to-gray-900/50 rounded-2xl p-6 border border-emerald-500/30 relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
                                    <div className="absolute -top-1 -right-1 px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-bold rounded-bl-xl rounded-tr-xl">
                                        ✓ BETTER
                                    </div>
                                    <div className="relative">
                                        <div className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">Canvas Classes</div>
                                        <div className="text-4xl font-black text-emerald-400 mb-2">30-120m</div>
                                        <div className="text-gray-400 text-sm mb-4">per chapter</div>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <span>Crisp & focused</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <span>High-yield topics</span>
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <span>Paaras Sir's voice</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Tagline */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 text-center"
                            >
                                <p className="text-gray-400 text-sm">
                                    🎯 <span className="text-white font-semibold">Same content, better format</span> — Conceptual clarity in less time
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="relative py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: PlayCircle, label: 'One Shot Videos', value: stats.totalVideos, suffix: '', color: 'from-violet-500 to-purple-500', hoverBg: 'hover:border-violet-500/50 hover:shadow-violet-500/20' },
                            { icon: Beaker, label: 'Organic Chemistry', value: stats.organicCount, suffix: '', color: 'from-purple-500 to-pink-500', hoverBg: 'hover:border-purple-500/50 hover:shadow-purple-500/20' },
                            { icon: Atom, label: 'Inorganic Chemistry', value: stats.inorganicCount, suffix: '', color: 'from-orange-500 to-amber-500', hoverBg: 'hover:border-orange-500/50 hover:shadow-orange-500/20' },
                            { icon: FlaskConical, label: 'Physical Chemistry', value: stats.physicalCount, suffix: '', color: 'from-green-500 to-emerald-500', hoverBg: 'hover:border-green-500/50 hover:shadow-green-500/20' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className={`group bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 cursor-pointer transition-all duration-300 hover:bg-gray-800/60 hover:shadow-2xl ${stat.hoverBg}`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <stat.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-2xl font-bold text-white">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>
                                <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Category Tabs */}
            <section className="py-6">
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {categoryTabs.map((tab) => {
                            const isActive = selectedCategory === tab.id;
                            const count = categoryStats[tab.id] || 0;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setSelectedCategory(tab.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all duration-300 ${isActive
                                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-600 hover:text-white'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-700/50'
                                        }`}>
                                        {count}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search one shot lectures..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                        />
                    </div>

                    {/* Video Count */}
                    <p className="text-gray-400 mt-6">
                        Showing <span className="font-bold text-white">{filteredVideos.length}</span> one shot lectures
                    </p>
                </div>
            </section>

            {/* Modal Video Player */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
                        onClick={() => setActiveVideo(null)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            className="relative w-full max-w-5xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse" />
                                    <h3 className="text-white font-semibold text-lg line-clamp-1">
                                        {activeVideo.title}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="p-2.5 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Video Player */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-violet-500/10">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYoutubeId(activeVideo.youtubeUrl)}?autoplay=1&rel=0`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title={activeVideo.title}
                                />
                            </div>

                            {/* Footer Info */}
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${getCategoryStyle(activeVideo.category).bg} ${getCategoryStyle(activeVideo.category).text} ${getCategoryStyle(activeVideo.category).border}`}>
                                        {activeVideo.category}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                                        <Clock className="w-4 h-4" />
                                        {activeVideo.duration}
                                    </span>
                                </div>
                                <a
                                    href={activeVideo.youtubeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-transparent transition-all text-sm font-medium"
                                >
                                    <Youtube className="w-4 h-4" />
                                    Open in YouTube
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Grid */}
            <section id="video-grid" className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video, index) => {
                            const catStyle = getCategoryStyle(video.category);
                            const isActive = activeVideo?.id === video.id;

                            return (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.03 * Math.min(index, 10) }}
                                    className={`group bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border transition-all duration-300 ${isActive
                                        ? 'border-violet-500 ring-2 ring-violet-500/20'
                                        : 'border-gray-700/50 hover:border-violet-500/50 hover:bg-gray-800/60'
                                        }`}
                                >
                                    {/* Thumbnail */}
                                    <div
                                        className="relative aspect-video cursor-pointer group/thumb overflow-hidden"
                                        onClick={() => setActiveVideo(isActive ? null : video)}
                                    >
                                        <Image
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                                        />
                                        {/* One Shot Badge */}
                                        <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold shadow-lg">
                                            ONE SHOT
                                        </div>
                                        {/* Duration Badge */}
                                        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 text-white text-xs font-medium rounded-lg backdrop-blur-sm">
                                            {video.duration}
                                        </div>
                                        {/* Play Overlay */}
                                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/thumb:opacity-100'}`}>
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-xl shadow-violet-500/25">
                                                <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                        {/* Now Playing Indicator */}
                                        {isActive && (
                                            <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-violet-500 text-white text-xs font-medium rounded-full">
                                                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                Now Playing
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-5">
                                        <h3 className="font-semibold text-white mb-3 line-clamp-2 min-h-[48px] group-hover:text-violet-400 transition-colors">
                                            {video.title}
                                        </h3>

                                        {/* Category Tag */}
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium mb-4 border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                                            {video.category}
                                        </span>

                                        {/* Badges */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                                                <span>🎯</span> Complete Chapter
                                            </span>
                                            <span className="flex items-center gap-1.5 text-rose-400 text-sm font-medium">
                                                <span>🔥</span> Exam Ready
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setActiveVideo(isActive ? null : video)}
                                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive
                                                    ? 'bg-violet-500 text-white'
                                                    : 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 hover:from-violet-500 hover:to-purple-500 hover:text-white hover:border-transparent'
                                                    }`}
                                            >
                                                <Play className="w-4 h-4" />
                                                {isActive ? 'Playing' : 'Watch Now'}
                                            </button>
                                            <a
                                                href={video.youtubeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500 hover:text-white hover:border-transparent transition-all"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="relative bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-12 text-center overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Need More In-Depth Coverage?
                            </h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                Complement your one shot revision with our detailed chapter-wise lectures
                                and comprehensive study materials.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="https://www.youtube.com/@CanvasClassesOfficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white text-violet-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    <Youtube className="w-5 h-5" />
                                    Visit YouTube Channel
                                </a>
                                <Link
                                    href="/detailed-lectures"
                                    className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Detailed Lectures
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
