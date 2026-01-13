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
} from 'lucide-react';

interface QuickRecapVideo {
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

// Category colors for dark theme
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Organic Chemistry': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    'Inorganic Chemistry': { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
    'Physical Chemistry': { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    'Environmental': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'General Chemistry': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

interface QuickRecapClientProps {
    initialVideos: QuickRecapVideo[];
}

// Data is now fetched on the server and passed as props for SEO
export default function QuickRecapClient({ initialVideos }: QuickRecapClientProps) {
    const [videos] = useState<QuickRecapVideo[]>(initialVideos);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [activeVideo, setActiveVideo] = useState<QuickRecapVideo | null>(null);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ['All Categories', ...new Set(videos.map(v => v.category))];
        return cats;
    }, [videos]);

    // Filter videos
    const filteredVideos = useMemo(() => {
        return videos.filter(video => {
            const matchesSearch = !searchQuery ||
                video.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All Categories' ||
                video.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [videos, searchQuery, selectedCategory]);

    // Stats
    const stats = useMemo(() => ({
        totalVideos: videos.length,
        totalCategories: new Set(videos.map(v => v.category)).size,
        totalMinutes: videos.reduce((sum, v) => sum + v.durationMinutes, 0),
    }), [videos]);

    const getCategoryStyle = (category: string) => {
        return categoryColors[category] || categoryColors['General Chemistry'];
    };

    // Extract video ID for embed
    const getYoutubeId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\s?]+)/);
        return match ? match[1] : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                        <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-teal-400">Quick Recap</span>
                    </div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        <span className="text-white">Quick & Effective </span>
                        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Chemistry Revision
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mb-10"
                    >
                        Master complex chemistry topics in minutes with focused, exam-oriented content
                        designed for rapid learning and last-minute revision.
                    </motion.p>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="relative py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: PlayCircle, label: 'Revision Videos', value: stats.totalVideos, suffix: '', color: 'from-teal-500 to-cyan-500', hoverBg: 'hover:border-teal-500/50 hover:shadow-teal-500/20' },
                            { icon: Layers, label: 'Chemistry Branches', value: stats.totalCategories, suffix: '', color: 'from-violet-500 to-purple-500', hoverBg: 'hover:border-violet-500/50 hover:shadow-violet-500/20' },
                            { icon: Clock, label: 'Total Minutes', value: stats.totalMinutes, suffix: 'm', color: 'from-amber-500 to-orange-500', hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
                            { icon: Gift, label: 'Complete Access', value: 0, suffix: 'FREE', color: 'from-rose-500 to-pink-500', hoverBg: 'hover:border-rose-500/50 hover:shadow-rose-500/20', isText: true },
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
                                    {stat.isText ? (
                                        stat.suffix
                                    ) : (
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    )}
                                </div>
                                <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Search & Filter Bar */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search videos by topic or title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 px-4 text-gray-300 focus:outline-none focus:border-teal-500/50 min-w-[180px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Video Count */}
                    <p className="text-gray-400 mt-6">
                        Showing <span className="font-bold text-white">{filteredVideos.length}</span> videos
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
                                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
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
                            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-teal-500/10">
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
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredVideos.map((video, index) => {
                            const catStyle = getCategoryStyle(video.category);
                            const isActive = activeVideo?.id === video.id;

                            return (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.02 * Math.min(index, 12) }}
                                    className={`group bg-gray-800/50 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${isActive
                                        ? 'border-teal-500 ring-1 ring-teal-500/30'
                                        : 'border-gray-700/30 hover:border-teal-500/40 hover:bg-gray-800/70'
                                        }`}
                                    onClick={() => setActiveVideo(isActive ? null : video)}
                                >
                                    {/* Thumbnail */}
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={video.thumbnailUrl}
                                            alt={video.title}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {/* Number Badge */}
                                        <div className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-gray-900 font-bold text-xs flex items-center justify-center">
                                            {index + 1}
                                        </div>
                                        {/* Duration Badge */}
                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                                            {video.duration}
                                        </div>
                                        {/* Play Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <div className="w-12 h-12 rounded-full bg-teal-500/90 flex items-center justify-center">
                                                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-teal-500 text-white text-xs font-medium rounded">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                Playing
                                            </div>
                                        )}
                                    </div>

                                    {/* Info - Compact */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-teal-400 transition-colors">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${catStyle.bg} ${catStyle.text}`}>
                                                {video.category.replace(' Chemistry', '')}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {video.durationMinutes} min
                                            </span>
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
                    <div className="relative bg-gradient-to-r from-teal-600 to-cyan-600 rounded-3xl p-12 text-center overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Ready for More Chemistry Content?
                            </h2>
                            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                                Explore our complete detailed chemistry lectures and comprehensive study materials for
                                deeper understanding and fast revision.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href="https://www.youtube.com/@CanvasClassesOfficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-white text-teal-600 font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                                >
                                    <Youtube className="w-5 h-5" />
                                    Visit YouTube Channel
                                </a>
                                <Link
                                    href="/detailed-lectures"
                                    className="flex items-center gap-2 bg-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Explore Detailed Lectures
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
