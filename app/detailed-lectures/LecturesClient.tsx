'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpen,
    Clock,
    PlayCircle,
    Search,
    ChevronRight,
    ChevronDown,
    FileText,
    Layers,
    Download,
    HelpCircle,
    Sparkles,
    Map,
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
    hasMindmap: boolean;
    classification?: 'Physical' | 'Organic' | 'Inorganic';
}

interface Stats {
    chapterCount: number;
    videoCount: number;
    totalHours: number;
}

// Classification colors
const classificationColors = {
    'Physical': { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
    'Organic': { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
    'Inorganic': { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' }
};

// Difficulty badge colors
const difficultyColors: Record<string, { bg: string; text: string; border: string }> = {
    'Easy': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    'Moderate': { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    'Tough': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    'Easy to Moderate': { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30' },
};

interface LecturesClientProps {
    initialChapters: Chapter[];
    initialStats: Stats;
}

// Data is now fetched on the server and passed as props for SEO
export default function LecturesClient({ initialChapters, initialStats }: LecturesClientProps) {
    const [activeClass, setActiveClass] = useState<'11' | '12'>('11');
    const [searchQuery, setSearchQuery] = useState('');
    const [chapters] = useState<Chapter[]>(initialChapters);
    const [stats] = useState<Stats>(initialStats);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    // FAQ Data
    const faqItems = [
        {
            question: "Are these lectures enough for JEE and NEET preparation?",
            answer: "Yes! Our lectures cover the complete NCERT syllabus plus additional JEE/NEET level concepts. Combined with our notes and practice materials, you'll have comprehensive preparation for both exams."
        },
        {
            question: "What is the best way to start preparing for JEE Chemistry?",
            answer: "Start with Class 11 Physical Chemistry basics like Mole Concept and Atomic Structure. Build strong fundamentals before moving to advanced topics. Watch lectures in order and practice problems from each chapter."
        },
        {
            question: "Is NCERT enough for JEE Chemistry?",
            answer: "NCERT is essential and forms the foundation, especially for Inorganic Chemistry. However, for JEE Advanced, you'll need additional practice and conceptual depth which our lectures provide."
        },
        {
            question: "Which topics in Chemistry are most important for JEE/NEET?",
            answer: "For JEE: Organic Chemistry reactions, Electrochemistry, Chemical Kinetics, and Coordination Compounds. For NEET: Biomolecules, Polymers, Chemistry in Everyday Life, and basic Organic Chemistry."
        },
        {
            question: "How should I balance all three subjects for JEE?",
            answer: "Dedicate 2-3 hours daily to Chemistry. Focus on understanding concepts rather than rote learning. Use our chapter-wise lectures to maintain steady progress alongside Physics and Maths preparation."
        },
    ];

    // Image mapping overrides
    const imageMapping: Record<string, string> = {
        'haloalkanes-alcohols-ethers': 'haloalkanes-haloarenes.webp',
        'aldehydes-ketones': 'carbonyl-compounds.webp',
        'carboxylic-acids-derivatives': 'carboxylic-acids.webp',
        'p-block-group-13-14': 'p-block.webp',
        'p-block-12th': 'p-block.webp',
        'salt-analysis': 'salt.webp'
    };

    const getChapterImage = (slug: string) => {
        if (imageMapping[slug]) {
            return `/chapter-card-images/${imageMapping[slug]}`;
        }
        return `/chapter-card-images/${slug}.webp`;
    };

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
    // Stats for ALL content (Class 11 + 12 Combined)
    const classStats = useMemo(() => {
        // Use all chapters instead of filtering by activeClass
        const allChapters = chapters;
        return {
            chapterCount: allChapters.length,
            videoCount: allChapters.reduce((sum, ch) => sum + ch.videoCount, 0),
            totalHours: Math.round(
                allChapters.reduce((sum, ch) => {
                    return sum + ch.lectures.reduce((s, l) => {
                        const match = l.duration?.match(/(\d+)m?/);
                        return s + (match ? parseInt(match[1], 10) : 0);
                    }, 0);
                }, 0) / 60
            ),
        };
    }, [chapters]);

    const getDifficultyStyle = (difficulty: string) => {
        return difficultyColors[difficulty] || difficultyColors['Moderate'];
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
            {/* Hero Header - Reduced padding on mobile */}
            <section className="relative pt-24 pb-8 md:pt-32 md:pb-6 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl hidden md:block" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl hidden md:block" />

                <div className="relative container mx-auto px-4 md:px-6 text-center flex flex-col items-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 mb-6 md:mb-8 backdrop-blur-sm"
                    >
                        <Sparkles size={14} className="text-teal-400" />
                        <span className="text-xs md:text-sm font-medium text-teal-300 tracking-wide uppercase">Premium Video Content</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 tracking-tight"
                    >
                        <span className="text-white block md:inline">Complete </span>
                        <span className="bg-gradient-to-r from-teal-200 via-cyan-400 to-teal-500 bg-clip-text text-transparent filter drop-shadow-[0_0_25px_rgba(45,212,191,0.2)]">
                            Chemistry Lectures
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-300 text-sm md:text-lg max-w-2xl mx-auto mb-6 md:mb-10 leading-relaxed hidden md:block"
                    >
                        These lectures are specially designed for in-depth understanding of concepts for <span className="text-teal-400 font-semibold">JEE Main & JEE Advanced</span>. They represent some of the best content available in Chemistry, ensuring you master every topic with confidence.
                    </motion.p>

                    {/* Mobile short desc */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-sm mb-6 block md:hidden max-w-xl mx-auto"
                    >
                        If you want highest quality lectures for in-depth clarity, problem solving skills and especially relevant for JEE Advanced preparation. This is Premium Content made by Paaras Sir.
                    </motion.p>

                    {/* Stats Cards - Moved here */}
                    <div className="w-full max-w-3xl mb-8 md:mb-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-left">
                            {[
                                { icon: Layers, label: 'Chapters', value: stats.chapterCount, suffix: '', color: 'from-teal-500 to-cyan-500', hoverBg: 'hover:border-teal-500/50 hover:shadow-teal-500/20' },
                                { icon: PlayCircle, label: 'Lectures', value: stats.videoCount, suffix: '', color: 'from-violet-500 to-purple-500', hoverBg: 'hover:border-violet-500/50 hover:shadow-violet-500/20' },
                                { icon: Clock, label: 'Content', value: stats.totalHours, suffix: 'h', color: 'from-amber-500 to-orange-500', hoverBg: 'hover:border-amber-500/50 hover:shadow-amber-500/20' },
                                { icon: FileText, label: 'Notes', value: stats.chapterCount, suffix: '', color: 'from-rose-500 to-pink-500', hoverBg: 'hover:border-rose-500/50 hover:shadow-rose-500/20' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * i }}
                                    className={`group bg-gray-800/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-5 border border-gray-700/50 cursor-pointer transition-all duration-300 hover:bg-gray-800/60 hover:shadow-2xl ${stat.hoverBg} flex items-center gap-3`}
                                >
                                    <div
                                        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xl md:text-2xl font-bold text-white leading-none">
                                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <div className="text-gray-400 text-xs md:text-sm font-medium leading-tight group-hover:text-gray-300 transition-colors mt-0.5">{stat.label}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Class Toggle - Compact on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center bg-gray-800/50 rounded-xl p-1 border border-gray-700/50 mb-2 md:mb-4 w-full md:w-auto"
                    >
                        {(['11', '12'] as const).map((classNum) => (
                            <button
                                key={classNum}
                                onClick={() => setActiveClass(classNum)}
                                className={`flex-1 md:flex-none py-2 md:py-3 px-4 md:px-8 rounded-lg font-semibold text-sm md:text-base transition-all duration-300 ${activeClass === classNum
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



            {/* Search & Filter - Reduced vertical space */}
            <section className="py-2 md:py-8">
                <div className="container mx-auto px-4 md:px-6 max-w-2xl">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search chapters..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-2.5 md:py-3 pl-10 md:pl-12 pr-4 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* Chapter Cards Grid */}
            < section className="py-2 pb-20 md:py-8 md:pb-24" >
                <div className="container mx-auto px-4 md:px-6">
                    {filteredChapters.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No chapters found</h3>
                            <p className="text-gray-500">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                            {filteredChapters.map((chapter, index) => {
                                const diffStyle = getDifficultyStyle(chapter.difficulty);
                                // Use real classification or fallback
                                const classification = chapter.classification || 'Physical';
                                const classColor = classificationColors[classification] || classificationColors['Physical'];

                                return (
                                    <motion.div
                                        key={chapter.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <div className="group h-full bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/40 hover:border-gray-700 transition-all duration-300 flex flex-col relative shadow-lg shadow-black/20">

                                            {/* Top Image Section */}
                                            <div className="relative h-48 w-full shrink-0 overflow-hidden bg-gray-900">
                                                <Image
                                                    src={getChapterImage(chapter.slug)}
                                                    alt={chapter.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />

                                                {/* Title Overlay */}
                                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                                    <h3 className={`text-xl md:text-2xl font-bold text-gray-100 leading-tight drop-shadow-lg ${classification === 'Organic' ? 'group-hover:text-emerald-300' :
                                                        classification === 'Inorganic' ? 'group-hover:text-orange-300' :
                                                            'group-hover:text-blue-300'
                                                        } transition-colors duration-300`}>
                                                        {chapter.name}
                                                    </h3>
                                                </div>

                                                {/* Top Badge Container */}
                                                <div className="absolute top-3 right-3 flex flex-col items-end gap-2 z-10">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border shadow-sm backdrop-blur-md ${classification === 'Organic' ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30' :
                                                        classification === 'Inorganic' ? 'bg-orange-950/40 text-orange-400 border-orange-500/30' :
                                                            'bg-blue-950/40 text-blue-400 border-blue-500/30'
                                                        }`}>
                                                        {chapter.difficulty}
                                                    </span>

                                                    {chapter.hasMindmap && (
                                                        <motion.div
                                                            animate={{
                                                                scale: [1, 1.05, 1],
                                                                opacity: [0.9, 1, 0.9]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <span className="px-2 py-1 bg-teal-950/60 text-teal-300 text-[10px] font-bold rounded-md border border-teal-500/30 flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                                                                <Sparkles className="w-3 h-3 text-teal-400 animate-pulse" />
                                                                MINDMAP
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bottom Content Section */}
                                            <div className="p-5 flex flex-col flex-grow">

                                                {/* Metadata Row */}
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-4 border-b border-gray-800 pb-3">
                                                    <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5 text-teal-500" /> {chapter.videoCount} Lectures</span>
                                                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> {chapter.totalDuration}</span>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1.5 mb-6 flex-grow content-start min-h-[1.5rem]">
                                                    {chapter.keyTopics.slice(0, 3).map((topic, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-800/50 text-gray-400 text-[10px] rounded border border-gray-700/50 group-hover:border-gray-600 transition-colors">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                    {chapter.keyTopics.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-800/50 text-gray-500 text-[10px] rounded border border-gray-700/50">
                                                            +{chapter.keyTopics.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Buttons */}
                                                <div className="flex gap-3 mt-auto pt-2">
                                                    <Link href={`/detailed-lectures/${chapter.slug}`} className="flex-[1.5]">
                                                        <button className={`w-full py-2.5 rounded-xl font-bold text-xs md:text-sm text-white transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg active:scale-95 cursor-pointer shadow-md ${classification === 'Organic' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-emerald-500/20' :
                                                            classification === 'Inorganic' ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-orange-500/20' :
                                                                'bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-blue-500/20'
                                                            }`}>
                                                            Start Learning <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                                        </button>
                                                    </Link>
                                                    {chapter.notesLink && (
                                                        <a
                                                            href={chapter.notesLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 font-medium text-xs md:text-sm"
                                                            title="Download Notes"
                                                        >
                                                            <Download className="w-4 h-4" /> Notes
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section >

            {/* FAQ Section */}
            < section className="py-16 px-6" >
                <div className="container mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium border border-teal-500/20 mb-4">
                            <HelpCircle size={16} /> FAQ
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-400">
                            Get answers to common questions about JEE/NEET chemistry preparation
                        </p>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-4">
                        {faqItems.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
                                >
                                    <span className="text-white font-medium pr-4">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                {openFaq === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="px-6 pb-5"
                                    >
                                        <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section >
        </div >
    );
}
