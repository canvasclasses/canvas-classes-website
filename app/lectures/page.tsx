'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    Clock,
    PlayCircle,
    Search,
    ChevronRight,
    FileText,
    Layers,
    Download,
} from 'lucide-react';

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
                    const duration = 1500; // 1.5 seconds
                    const startTime = performance.now();

                    const animate = (currentTime: number) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth deceleration
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

interface Lecture {
    lectureNumber: number;
    title: string;
    description: string;
    youtubeUrl: string;
    duration: string;
}

interface Chapter {
    name: string;
    slug: string;
    class: '11' | '12';
    difficulty: string;
    notesLink: string;
    keyTopics: string[];
    lectures: Lecture[];
    totalDuration: string;
    videoCount: number;
}

interface Stats {
    chapterCount: number;
    videoCount: number;
    totalHours: number;
}

// Difficulty badge colors
const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
    'Easy': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Tough': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    'Easy to Moderate': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
};

export default function LecturesPage() {
    const [activeClass, setActiveClass] = useState<'11' | '12'>('11');
    const [searchQuery, setSearchQuery] = useState('');
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [stats, setStats] = useState<Stats>({ chapterCount: 0, videoCount: 0, totalHours: 0 });
    const [loading, setLoading] = useState(true);

    // Fetch data on mount
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/lectures');
                const data = await response.json();
                setChapters(data.chapters);
                setStats(data.stats);
            } catch (error) {
                console.error('Failed to load lectures:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filter chapters by class and search
    const filteredChapters = useMemo(() => {
        return chapters
            .filter(ch => ch.class === activeClass)
            .filter(ch => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    ch.name.toLowerCase().includes(query) ||
                    ch.keyTopics.some(topic => topic.toLowerCase().includes(query))
                );
            });
    }, [chapters, activeClass, searchQuery]);

    // Stats for current class
    const classStats = useMemo(() => {
        const classChapters = chapters.filter(ch => ch.class === activeClass);
        return {
            chapterCount: classChapters.length,
            videoCount: classChapters.reduce((sum, ch) => sum + ch.videoCount, 0),
            totalHours: Math.round(
                classChapters.reduce((sum, ch) => {
                    return sum + ch.lectures.reduce((s, l) => {
                        const match = l.duration?.match(/(\d+)m?/);
                        return s + (match ? parseInt(match[1], 10) : 0);
                    }, 0);
                }, 0) / 60
            ),
        };
    }, [chapters, activeClass]);

    const getDifficultyStyle = (difficulty: string) => {
        return difficultyColors[difficulty] || difficultyColors['Moderate'];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                        <Link href="/" className="hover:text-teal-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-teal-400">Detailed Lectures</span>
                    </div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        <span className="text-white">Complete </span>
                        <span className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                            Chemistry Lectures
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mb-10"
                    >
                        In-depth video lectures covering complete CBSE, JEE & NEET Chemistry syllabus.
                        Learn concepts from basics to advanced problem-solving.
                    </motion.p>

                    {/* Class Toggle */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center bg-gray-800/50 rounded-2xl p-1.5 border border-gray-700/50 mb-10"
                    >
                        {(['11', '12'] as const).map((classNum) => (
                            <button
                                key={classNum}
                                onClick={() => setActiveClass(classNum)}
                                className={`px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${activeClass === classNum
                                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Class {classNum}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Stats Cards */}
            <section className="relative py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Layers, label: 'Chapters', value: classStats.chapterCount, suffix: '', color: 'from-teal-500 to-cyan-500', hoverBg: 'hover:border-teal-500/50 hover:shadow-teal-500/20' },
                            { icon: PlayCircle, label: 'Video Lectures', value: classStats.videoCount, suffix: '', color: 'from-violet-500 to-purple-500', hoverBg: 'hover:border-violet-500/50 hover:shadow-violet-500/20' },
                            { icon: Clock, label: 'Hours of Content', value: classStats.totalHours, suffix: 'h', color: 'from-amber-500 to-orange-500', hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
                            { icon: FileText, label: 'Handwritten Notes', value: classStats.chapterCount, suffix: '', color: 'from-rose-500 to-pink-500', hoverBg: 'hover:border-rose-500/50 hover:shadow-rose-500/20' },
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

            {/* Search & Filter */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chapters or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Chapter Cards Grid */}
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    {loading ? (
                        // Loading skeleton
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-gray-800/40 rounded-2xl p-6 animate-pulse">
                                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
                                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-700 rounded w-20" />
                                        <div className="h-6 bg-gray-700 rounded w-24" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredChapters.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No chapters found</h3>
                            <p className="text-gray-500">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredChapters.map((chapter, index) => {
                                const diffStyle = getDifficultyStyle(chapter.difficulty);
                                return (
                                    <motion.div
                                        key={chapter.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <Link href={`/lectures/${chapter.slug}`}>
                                            <div className="group bg-gray-800/40 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-teal-500/50 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer h-full">
                                                {/* Header */}
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors mb-2">
                                                            {chapter.name}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {/* Difficulty Badge */}
                                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                                                                {chapter.difficulty}
                                                            </span>
                                                            {/* Stats */}
                                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                                <PlayCircle className="w-4 h-4" />
                                                                {chapter.videoCount} videos
                                                            </span>
                                                            <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                                <Clock className="w-4 h-4" />
                                                                {chapter.totalDuration}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-teal-500 group-hover:to-cyan-500 transition-all">
                                                        <ChevronRight className="w-5 h-5 text-teal-400 group-hover:text-white transition-colors" />
                                                    </div>
                                                </div>

                                                {/* Topic Pills */}
                                                {chapter.keyTopics.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {chapter.keyTopics.slice(0, 3).map((topic, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full border border-gray-600/50"
                                                            >
                                                                {topic.length > 20 ? topic.substring(0, 20) + '...' : topic}
                                                            </span>
                                                        ))}
                                                        {chapter.keyTopics.length > 3 && (
                                                            <span className="px-3 py-1 bg-teal-500/20 text-teal-400 text-xs rounded-full border border-teal-500/30">
                                                                +{chapter.keyTopics.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Download Notes Button */}
                                                {chapter.notesLink && (
                                                    <a
                                                        href={chapter.notesLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 rounded-lg text-sm font-medium border border-rose-500/30 hover:from-rose-500 hover:to-pink-500 hover:text-white transition-all"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                        Download Notes
                                                    </a>
                                                )}
                                            </div>
                                        </Link>
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
