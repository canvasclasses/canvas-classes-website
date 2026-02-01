'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
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
    Atom,
    FlaskConical,
    Microscope,
    Zap,
} from 'lucide-react';

interface ChapterGroup {
    chapter: string;
    classNum: number;
    classification?: string;
    questions: { id: number; difficulty: string }[];
    category?: string;
}

interface NCERTStats {
    totalQuestions: number;
    totalChapters: number;
    class11Questions: number;
    class12Questions: number;
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

// Premium Gradients Palette (Lighter/Softer)
const CHAPTER_GRADIENTS = [
    'from-blue-600 to-indigo-900',
    'from-emerald-600 to-teal-900',
    'from-orange-600 to-red-900',
    'from-purple-600 to-fuchsia-900',
    'from-pink-600 to-rose-900',
    'from-cyan-600 to-blue-900',
    'from-violet-600 to-purple-900',
    'from-amber-600 to-orange-900',
    'from-teal-600 to-emerald-900',
    'from-indigo-600 to-violet-900',
    'from-rose-600 to-pink-900',
    'from-sky-600 to-blue-900',
];

// Helper to deterministically get a gradient based on string
function getChapterGradient(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % CHAPTER_GRADIENTS.length;
    return CHAPTER_GRADIENTS[index];
}

// Helper to getting category icon
function getCategoryIcon(category: string) {
    switch (category) {
        case 'Physical Chemistry': return Zap;
        case 'Organic Chemistry': return FlaskConical;
        case 'Inorganic Chemistry': return Atom;
        default: return Microscope;
    }
}

// Helper to generate description
function getChapterDescription(chapter: string, category: string): string {
    const lower = chapter.toLowerCase();
    if (lower.includes('atom')) return "Explore atomic models, quantum numbers, and electronic configurations structure.";
    if (lower.includes('bonding')) return "Understand molecular orbitals, hybridization, and chemical bond theories.";
    if (lower.includes('thermo')) return "Master laws of thermodynamics, entropy, and energy changes in reactions.";
    if (lower.includes('equilibrium')) return "Learn about chemical and ionic equilibrium, Le Chatelier's principle.";
    if (lower.includes('solutions')) return "Study concentration terms, colligative properties, and Raoult's law.";
    if (lower.includes('electro')) return "Dive into redox reactions, conductance, and electrochemical cells.";
    if (lower.includes('kinetics')) return "Analyze reaction rates, order of reaction, and Arrhenius equation.";
    if (lower.includes('block')) return "Detailed study of elements, their properties, and periodic trends.";
    if (lower.includes('coordination')) return "Understand complex compounds, IUPAC naming, and bonding theories.";
    if (lower.includes('halo')) return "Reactions, mechanisms, and properties of alkyl and aryl halides.";
    if (lower.includes('alcohol')) return "Preparation and properties of alcohols, phenols, and ethers.";
    if (lower.includes('aldehyde')) return "Chemistry of carbonyl compounds, carboxylic acids, and derivatives.";
    if (lower.includes('amine')) return "Study structure, basicity, and reactions of nitrogen compounds.";
    if (lower.includes('bio')) return "Chemistry of life: carbohydrates, proteins, nucleic acids, and vitamins.";

    if (category === 'Physical Chemistry') return "Master formulations, numericals, and core physical concepts.";
    if (category === 'Organic Chemistry') return "Understand mechanisms, synthesis, and functional group reactions.";
    if (category === 'Inorganic Chemistry') return "Learn periodic trends, elemental properties, and reactions.";

    return "Comprehensive step-by-step solutions and concept explanations.";
}

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
        lowerChapter.includes('solution') || lowerChapter.includes('surface') ||
        lowerChapter.includes('solid') || lowerChapter.includes('state')) {
        return 'Physical Chemistry';
    }
    return 'General Chemistry';
}

interface NCERTSolutionsClientProps {
    initialChapters: ChapterGroup[];
    initialStats: NCERTStats;
}

// Data is now fetched on the server and passed as props for SEO
export default function NCERTSolutionsClient({ initialChapters, initialStats }: NCERTSolutionsClientProps) {
    // Add categories to chapters
    const chapters = useMemo(() => {
        return initialChapters.map(ch => ({
            ...ch,
            category: ch.classification || getChapterCategory(ch.chapter),
        }));
    }, [initialChapters]);

    const stats = initialStats;
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedClass, setSelectedClass] = useState<11 | 12>(11);
    const [selectedCategory, setSelectedCategory] = useState('All');

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
                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-black mb-6"
                    >
                        <span className="text-white">Complete NCERT </span>
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Solutions
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto mb-8 md:mb-12 font-medium"
                    >
                        Step-by-step solutions for all NCERT Chemistry questions. Master every concept
                        with detailed explanations and learn the right approach to solve problems.
                    </motion.p>

                    {/* Stats Section - Compact like other pages */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap items-center justify-center gap-2 md:gap-4 max-w-4xl mx-auto"
                    >
                        {[
                            { icon: Layers, label: 'Chapters', value: stats.totalChapters, suffix: '', color: 'from-blue-500 to-cyan-500', hoverBg: 'hover:border-blue-500/50 hover:shadow-blue-500/20' },
                            { icon: HelpCircle, label: 'Questions', value: stats.totalQuestions, suffix: '', color: 'from-purple-500 to-pink-500', hoverBg: 'hover:border-purple-500/50 hover:shadow-purple-500/20' },
                            { icon: CheckCircle, label: 'Coverage', value: 100, suffix: '%', color: 'from-emerald-500 to-teal-500', hoverBg: 'hover:border-emerald-500/50 hover:shadow-emerald-500/20' },
                            { icon: Sparkles, label: 'Solutions', value: 0, suffix: 'FREE', color: 'from-amber-500 to-orange-500', isText: true, hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
                        ].map((stat, i) => (
                            <div
                                key={stat.label}
                                className={`group bg-gray-800/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-white/5 cursor-pointer transition-all duration-300 hover:bg-gray-800/60 flex items-center gap-3 md:gap-4 min-w-[140px] md:min-w-0 ${stat.hoverBg}`}
                            >
                                <div
                                    className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shrink-0`}
                                >
                                    <stat.icon size={16} className="md:w-6 md:h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <div className="text-lg md:text-3xl font-black text-white leading-none">
                                        {stat.isText ? (
                                            stat.suffix
                                        ) : (
                                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                        )}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tight group-hover:text-gray-300 transition-colors">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Class Toggle + Filters */}
            <section className="pt-2 pb-8">
                <div className="container mx-auto px-6">
                    {/* Class Toggle Pills */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex bg-gray-800/50 rounded-full p-1 border border-white/10 shadow-inner">
                            {[11, 12].map((cls) => (
                                <button
                                    key={cls}
                                    onClick={() => setSelectedClass(cls as 11 | 12)}
                                    className={`px-6 py-2 rounded-full font-black text-sm transition-all duration-500 ${selectedClass === cls
                                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40 scale-105'
                                        : 'text-gray-500 hover:text-gray-300'
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

            {/* Chapter Grid - REDESIGNED */}
            <section className="py-8 pb-24">
                <div className="container mx-auto px-6">
                    {(
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {filteredChapters.map((chapter, idx) => {
                                const chapterSlug = getChapterSlug(chapter.chapter, chapter.classNum);
                                const gradient = getChapterGradient(chapter.chapter);
                                const description = getChapterDescription(chapter.chapter, chapter.category!);
                                const CategoryIcon = getCategoryIcon(chapter.category!);

                                return (
                                    <motion.div
                                        key={`${chapter.classNum}-${chapter.chapter}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * Math.min(idx, 8) }}
                                        className="h-full"
                                    >
                                        <Link
                                            href={chapterSlug}
                                            className="group flex flex-row md:flex-col h-full bg-gray-900/60 backdrop-blur-sm rounded-xl md:rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                                        >
                                            {/* Chapter Color Accent: Strip on Mobile, Header on Desktop */}
                                            <div className={`relative w-1.5 md:w-full h-auto md:h-44 bg-gradient-to-b md:bg-gradient-to-br ${gradient} shrink-0 overflow-hidden`}>
                                                {/* Desktop Decorative Elements */}
                                                <div className="hidden md:block absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                                                <div className="hidden md:block absolute -right-6 -bottom-6 opacity-10 transform rotate-12 group-hover:scale-110 transition-transform duration-500">
                                                    <CategoryIcon className="w-32 h-32 text-white" />
                                                </div>

                                                {/* Category Badge - Desktop Only */}
                                                <div className="hidden md:flex relative z-10 p-6 justify-between items-start">
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm uppercase tracking-wider">
                                                        {chapter.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Chapter Content */}
                                            <div className="flex-1 p-4 md:p-6 flex flex-col justify-center">
                                                {/* Title - Full visibility on mobile */}
                                                <h3 className="text-sm md:text-2xl font-black text-white leading-tight md:mb-3 group-hover:text-blue-400 transition-colors">
                                                    {chapter.chapter}
                                                </h3>

                                                {/* Category Badge - Mobile Only (Inline/Small) */}
                                                <div className="md:hidden flex items-center gap-2 mt-1 mb-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chapter.category}</span>
                                                </div>

                                                {/* Description - Desktop Only */}
                                                <p className="hidden md:block text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">
                                                    {description}
                                                </p>

                                                <div className="mt-2 md:mt-auto">
                                                    {/* Stats Container */}
                                                    <div className="flex items-center justify-between border-t border-white/5 pt-3 md:pt-4">
                                                        <div className="flex items-center gap-2 text-gray-300 text-[10px] md:text-sm font-bold">
                                                            <HelpCircle size={14} className="text-gray-500 md:w-4 md:h-4" />
                                                            <span>{chapter.questions.length} Questions</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 md:gap-2 text-emerald-400 text-[10px] md:text-xs font-black bg-emerald-500/10 px-2 py-0.5 md:py-1 rounded-md uppercase tracking-wider">
                                                            <CheckCircle size={12} className="md:w-3.5 md:h-3.5" />
                                                            <span>Solved</span>
                                                        </div>
                                                    </div>

                                                    {/* Desktop Action Button */}
                                                    <div className="hidden md:flex w-full mt-4 items-center justify-center gap-2 px-4 py-3 bg-gray-700/50 text-white border border-gray-600/50 rounded-xl font-black text-xs uppercase tracking-widest transition-all group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white shadow-sm">
                                                        <span>View Solutions</span>
                                                        <ChevronRight size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {filteredChapters.length === 0 && (
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
                                    href="/detailed-lectures"
                                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <GraduationCap className="w-5 h-5" />
                                    Video Lectures
                                </Link>
                                <Link
                                    href="/one-shot-lectures"
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
