'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
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

export default function QuickRecapPage() {
    const [videos, setVideos] = useState<QuickRecapVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [activeVideo, setActiveVideo] = useState<QuickRecapVideo | null>(null);

    // Fetch data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/quick-recap');
                const data = await response.json();
                setVideos(data.videos);
            } catch (error) {
                console.error('Failed to load videos:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

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
                                    {loading ? (
                                        <span className="inline-block w-12 h-7 bg-gray-700 rounded animate-pulse" />
                                    ) : stat.isText ? (
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
                                    <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse" />
                                    <h3 className="text-white font-semibold text-lg line-clamp-1">Now Playing: {activeVideo.title}</h3>
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

            {/* Video Grid */}
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-gray-800/40 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="aspect-video bg-gray-700" />
                                    <div className="p-4">
                                        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3" />
                                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
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
                                                ? 'border-teal-500 ring-2 ring-teal-500/20'
                                                : 'border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800/60'
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
                                            {/* Number Badge */}
                                            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-gray-900 font-bold text-sm flex items-center justify-center shadow-lg">
                                                {index + 1}
                                            </div>
                                            {/* Duration Badge */}
                                            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/80 text-white text-xs font-medium rounded-lg backdrop-blur-sm">
                                                {video.duration}
                                            </div>
                                            {/* Play Overlay */}
                                            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover/thumb:opacity-100'}`}>
                                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-xl shadow-teal-500/25">
                                                    <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                                                </div>
                                            </div>
                                            {/* Now Playing Indicator */}
                                            {isActive && (
                                                <div className="absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-teal-500 text-white text-xs font-medium rounded-full">
                                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                    Now Playing
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="p-5">
                                            <h3 className="font-semibold text-white mb-3 line-clamp-2 min-h-[48px] group-hover:text-teal-400 transition-colors">
                                                {video.title}
                                            </h3>

                                            {/* Category Tag */}
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium mb-4 border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                                                {video.category}
                                            </span>

                                            {/* Badges */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
                                                    <span>👑</span> High Yield
                                                </span>
                                                <span className="flex items-center gap-1.5 text-rose-400 text-sm font-medium">
                                                    <span>🎯</span> Exam Key
                                                </span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setActiveVideo(isActive ? null : video)}
                                                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive
                                                            ? 'bg-teal-500 text-white'
                                                            : 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30 hover:from-teal-500 hover:to-cyan-500 hover:text-white hover:border-transparent'
                                                        }`}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    {isActive ? 'Playing' : 'Watch'}
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
                    )}
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
                                    href="/lectures"
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
