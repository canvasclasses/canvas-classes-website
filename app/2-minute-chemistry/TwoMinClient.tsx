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
    Zap,
    Clock,
    TrendingUp,
    Timer,
} from 'lucide-react';

interface ShortVideo {
    id: number;
    title: string;
    youtubeUrl: string;
    duration: string;
    durationSeconds: number;
    views: number;
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
    'Name Reactions': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    'Lab & Practical': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    'General Chemistry': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
};

interface TwoMinClientProps {
    initialVideos: ShortVideo[];
}

// Data is now fetched on the server and passed as props for SEO
export default function TwoMinClient({ initialVideos }: TwoMinClientProps) {
    const [videos] = useState<ShortVideo[]>(initialVideos);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [activeVideo, setActiveVideo] = useState<ShortVideo | null>(null);

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
    const stats = useMemo(() => {
        const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
        const avgDuration = videos.length > 0
            ? Math.round(videos.reduce((sum, v) => sum + v.durationSeconds, 0) / videos.length / 60 * 10) / 10
            : 0;
        return {
            totalVideos: videos.length,
            totalCategories: new Set(videos.map(v => v.category)).size,
            totalViews: Math.round(totalViews / 1000),
            avgDuration,
        };
    }, [videos]);

    const getCategoryStyle = (category: string) => {
        return categoryColors[category] || categoryColors['General Chemistry'];
    };

    // Extract video ID for embed
    const getYoutubeId = (url: string): string | null => {
        let match = url.match(/youtube\.com\/watch\?v=([-\w]+)/);
        if (match) return match[1];
        match = url.match(/youtu\.be\/([-\w]+)/);
        if (match) return match[1];
        match = url.match(/youtube\.com\/shorts\/([-\w]+)/);
        if (match) return match[1];
        return null;
    };

    // Format views
    const formatViews = (views: number): string => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
        if (views >= 1000) return `${Math.round(views / 1000)}K`;
        return views.toString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                        <Link href="/" className="hover:text-rose-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-rose-400">2 Minute Chemistry</span>
                    </div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <span className="text-white">2 Minute </span>
                            <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                                Chemistry
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mb-10"
                    >
                        Quick, bite-sized chemistry lessons perfect for revision on the go.
                        Master complex concepts in under 5 minutes with focused, visual explanations.
                    </motion.p>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="relative py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Zap, label: 'Quick Videos', value: stats.totalVideos, suffix: '', color: 'from-rose-500 to-pink-500', hoverBg: 'hover:border-rose-500/50 hover:shadow-rose-500/20' },
                            { icon: Layers, label: 'Categories', value: stats.totalCategories, suffix: '', color: 'from-violet-500 to-purple-500', hoverBg: 'hover:border-violet-500/50 hover:shadow-violet-500/20' },
                            { icon: TrendingUp, label: 'Total Views', value: stats.totalViews, suffix: 'K+', color: 'from-teal-500 to-cyan-500', hoverBg: 'hover:border-teal-500/50 hover:shadow-teal-500/20' },
                            { icon: Timer, label: 'Avg Duration', value: stats.avgDuration, suffix: ' min', color: 'from-amber-500 to-orange-500', hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
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

            {/* Search & Filter Bar */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search quick videos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 px-4 text-gray-300 focus:outline-none focus:border-rose-500/50 min-w-[180px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
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
                                    <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
                                    <h3 className="text-white font-semibold text-lg line-clamp-1">
                                        Now Playing: {activeVideo.title}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-xs rounded-full font-medium">
                                        {activeVideo.duration}
                                    </span>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredVideos.map((video, index) => {
                            const catStyle = getCategoryStyle(video.category);
                            const isActive = activeVideo?.id === video.id;

                            return (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.02 * Math.min(index, 15) }}
                                    className={`group bg-gray-800/50 rounded-xl overflow-hidden border transition-all duration-200 cursor-pointer ${isActive
                                        ? 'border-rose-500 ring-1 ring-rose-500/30'
                                        : 'border-gray-700/30 hover:border-rose-500/40 hover:bg-gray-800/70'
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
                                        {/* Duration Badge */}
                                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-medium rounded">
                                            {video.duration}
                                        </div>
                                        {/* Play Overlay */}
                                        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <div className="w-12 h-12 rounded-full bg-rose-500/90 flex items-center justify-center">
                                                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                                            </div>
                                        </div>
                                        {isActive && (
                                            <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                                Playing
                                            </div>
                                        )}
                                    </div>

                                    {/* Info - Compact */}
                                    <div className="p-3">
                                        <h3 className="font-bold text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-rose-400 transition-colors">
                                            {video.title}
                                        </h3>

                                        {/* Category + Duration Row */}
                                        <div className="flex items-center justify-between">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${catStyle.bg} ${catStyle.text}`}>
                                                {video.category.replace(' Chemistry', '')}
                                            </span>
                                            <div className="flex items-center gap-1 text-gray-500 text-xs text-right">
                                                <Eye className="w-3 h-3" />
                                                {formatViews(video.views)}
                                            </div>
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
                    <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 text-center overflow-hidden border border-gray-700/50">
                        {/* Subtle glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-500/10 via-transparent to-transparent" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Want Deeper Understanding?
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                These quick videos are perfect for revision. For comprehensive learning,
                                explore our detailed lectures and complete course materials.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/detailed-lectures"
                                    className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg shadow-rose-500/20"
                                >
                                    <Play className="w-5 h-5" />
                                    Detailed Lectures
                                </Link>
                                <Link
                                    href="/top-50-concepts"
                                    className="flex items-center gap-2 bg-gray-700/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                                >
                                    <Zap className="w-5 h-5" />
                                    Top 50 Concepts
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
