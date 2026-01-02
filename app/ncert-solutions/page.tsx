'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Search,
    BookOpen,
    Layers,
    ChevronRight,
    GraduationCap,
    CheckCircle,
    HelpCircle,
    Sparkles,
} from 'lucide-react';

interface ChapterGroup {
    chapter: string;
    classNum: number;
    questions: { id: number; difficulty: string }[];
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

// Category colors
const categoryColors: Record<string, { bg: string; text: string; gradient: string }> = {
    'Physical Chemistry': { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
    'Organic Chemistry': { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
    'Inorganic Chemistry': { bg: 'bg-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-amber-500' },
    'General Chemistry': { bg: 'bg-teal-500/20', text: 'text-teal-400', gradient: 'from-teal-500 to-emerald-500' },
};

// Chapter background images (gradient placeholders)
const chapterImages: Record<string, string> = {
    'Some Basic Concepts of Chemistry': '/images/chapters/basic-concepts.jpg',
    'Structure of Atom': '/images/chapters/atom.jpg',
    'Classification of Elements and Periodicity in Properties': '/images/chapters/periodic.jpg',
    'Chemical Bonding and Molecular Structure': '/images/chapters/bonding.jpg',
    'Thermodynamics': '/images/chapters/thermo.jpg',
    'Equilibrium': '/images/chapters/equilibrium.jpg',
};

// Map chapters to categories
function getChapterCategory(chapter: string): string {
    const lowerChapter = chapter.toLowerCase();

    if (lowerChapter.includes('organic') || lowerChapter.includes('hydrocarbon') ||
        lowerChapter.includes('aldehyde') || lowerChapter.includes('amine') ||
        lowerChapter.includes('alcohol') || lowerChapter.includes('haloalkane') ||
        lowerChapter.includes('polymer') || lowerChapter.includes('biomolecule')) {
        return 'Organic Chemistry';
    }
    if (lowerChapter.includes('p-block') || lowerChapter.includes('d-block') ||
        lowerChapter.includes('coordination') || lowerChapter.includes('metallurgy') ||
        lowerChapter.includes('hydrogen') || lowerChapter.includes('s-block')) {
        return 'Inorganic Chemistry';
    }
    if (lowerChapter.includes('thermo') || lowerChapter.includes('equilibrium') ||
        lowerChapter.includes('kinetic') || lowerChapter.includes('electro') ||
        lowerChapter.includes('solution') || lowerChapter.includes('surface')) {
        return 'Physical Chemistry';
    }
    return 'General Chemistry';
}

export default function NCERTSolutionsPage() {
    const [chapters, setChapters] = useState<ChapterGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<11 | 12>(11);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [stats, setStats] = useState({ totalQuestions: 0, totalChapters: 0, class11Questions: 0, class12Questions: 0 });

    // Fetch data
    useEffect(() => {
        async function loadData() {
            try {
                const response = await fetch('/api/ncert-solutions');
                const data = await response.json();
                // Add category to chapters
                const chaptersWithCategory = data.chapters.map((ch: ChapterGroup) => ({
                    ...ch,
                    category: getChapterCategory(ch.chapter),
                }));
                setChapters(chaptersWithCategory);
                setStats(data.stats);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Filter chapters
    const filteredChapters = useMemo(() => {
        return chapters.filter(chapter => {
            const matchesClass = chapter.classNum === selectedClass;
            const matchesCategory = selectedCategory === 'All' || chapter.category === selectedCategory;
            const matchesSearch = !searchQuery ||
                chapter.chapter.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesClass && matchesCategory && matchesSearch;
        });
    }, [chapters, searchQuery, selectedClass, selectedCategory]);

    // Get unique categories for filter
    const categories = useMemo(() => {
        return ['All', ...new Set(chapters.map(ch => ch.category))];
    }, [chapters]);

    const getCategoryStyle = (category: string) => {
        return categoryColors[category] || categoryColors['General Chemistry'];
    };

    // Generate slug for chapter
    const getChapterSlug = (chapter: string, classNum: number) => {
        const slug = chapter.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        return `/ncert-solutions/class-${classNum}/${slug}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative container mx-auto px-6 text-center">
                    {/* Breadcrumb */}
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-8">
                        <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-gray-500">NCERT & Boards</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-blue-400">NCERT Solutions</span>
                    </div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                    >
                        <span className="text-white">Complete NCERT Chemistry </span>
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Solutions
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto mb-12"
                    >
                        Step-by-step solutions for all NCERT Chemistry questions. Master every concept
                        with detailed explanations and learn the right approach to solve problems.
                    </motion.p>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
                    >
                        {[
                            { icon: Layers, label: 'Chemistry Chapters', value: stats.totalChapters, suffix: '', color: 'from-blue-500 to-cyan-500', hoverBg: 'hover:border-blue-500/50 hover:shadow-blue-500/20' },
                            { icon: HelpCircle, label: 'NCERT Questions', value: stats.totalQuestions, suffix: '', color: 'from-purple-500 to-pink-500', hoverBg: 'hover:border-purple-500/50 hover:shadow-purple-500/20' },
                            { icon: CheckCircle, label: 'NCERT Coverage', value: 100, suffix: '%', color: 'from-emerald-500 to-teal-500', hoverBg: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20' },
                            { icon: Sparkles, label: 'All Solutions', value: 0, suffix: 'FREE', color: 'from-amber-500 to-orange-500', isText: true, hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                className={`group bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 cursor-pointer transition-all duration-300 hover:bg-gray-800/80 hover:shadow-2xl ${stat.hoverBg}`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 transition-transform duration-300 group-hover:scale-110`}
                                >
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-white mb-1">
                                    {loading ? (
                                        <span className="inline-block w-12 h-8 bg-gray-700 rounded animate-pulse" />
                                    ) : stat.isText ? (
                                        stat.suffix
                                    ) : (
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    )}
                                </div>
                                <div className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Class Toggle + Filters */}
            <section className="py-8">
                <div className="container mx-auto px-6">
                    {/* Class Toggle Pills */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex bg-gray-800/50 rounded-full p-1.5 border border-gray-700/50">
                            {[11, 12].map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => setSelectedClass(cls as 11 | 12)}
                                    className={`px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 ${selectedClass === cls
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                                        : 'text-gray-400 hover:text-white'
                                        }`}
                                >
                                    Class {cls}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search + Category Filter */}
                    <div className="flex flex-col md:flex-row gap-4 items-center max-w-3xl mx-auto">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-xl py-3.5 px-4 text-gray-300 focus:outline-none focus:border-blue-500/50 min-w-[180px]"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <p className="text-gray-400 text-center mt-6">
                        Showing <span className="font-bold text-white">{filteredChapters.length}</span> chapters for Class {selectedClass}
                    </p>
                </div>
            </section>

            {/* Chapter Grid */}
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-gray-800/40 rounded-2xl overflow-hidden animate-pulse">
                                    <div className="h-40 bg-gray-700" />
                                    <div className="p-5">
                                        <div className="h-5 bg-gray-700 rounded w-3/4 mb-3" />
                                        <div className="h-4 bg-gray-700 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChapters.map((chapter, idx) => {
                                const catStyle = getCategoryStyle(chapter.category);
                                const chapterSlug = getChapterSlug(chapter.chapter, chapter.classNum);

                                return (
                                    <motion.div
                                        key={`${chapter.classNum}-${chapter.chapter}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * Math.min(idx, 8) }}
                                    >
                                        <Link
                                            href={chapterSlug}
                                            className="group block bg-gray-800/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                                        >
                                            {/* Chapter Image/Gradient */}
                                            <div className={`relative h-40 bg-gradient-to-br ${catStyle.gradient} overflow-hidden`}>
                                                <div className="absolute inset-0 bg-black/30" />
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

                                                {/* Category Badge */}
                                                <div className="absolute top-4 left-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-black/40 backdrop-blur-sm text-white border border-white/20`}>
                                                        {chapter.category}
                                                    </span>
                                                </div>

                                                {/* Decorative Icon */}
                                                <div className="absolute bottom-4 right-4 opacity-20">
                                                    <BookOpen className="w-24 h-24 text-white" />
                                                </div>
                                            </div>

                                            {/* Chapter Info */}
                                            <div className="p-5">
                                                <h3 className="font-semibold text-white text-lg mb-3 line-clamp-2 min-h-[56px] group-hover:text-blue-400 transition-colors">
                                                    {chapter.chapter}
                                                </h3>

                                                {/* Stats Row */}
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                                        <HelpCircle className="w-4 h-4" />
                                                        <span>{chapter.questions.length} Questions</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-emerald-400 text-sm">
                                                        <CheckCircle className="w-4 h-4" />
                                                        <span>100% Solved</span>
                                                    </div>
                                                </div>

                                                {/* View Solutions Button */}
                                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-medium text-sm hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-transparent transition-all group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white group-hover:border-transparent">
                                                    <BookOpen className="w-4 h-4" />
                                                    View Solutions
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {filteredChapters.length === 0 && !loading && (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No chapters found matching your search.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-6">
                    <div className="relative bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 text-center overflow-hidden border border-gray-700/50">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />

                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Need Video Explanations?
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                                Watch detailed video lectures for deeper understanding of concepts
                                beyond textbook solutions.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href="/lectures"
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    Video Lectures
                                </Link>
                                <Link
                                    href="/quick-recap"
                                    className="flex items-center gap-2 bg-gray-700/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-gray-700 transition-colors border border-gray-600"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Quick Recap
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
