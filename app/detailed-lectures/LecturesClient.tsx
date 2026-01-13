'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
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
                    {filteredChapters.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No chapters found</h3>
                            <p className="text-gray-500">Try adjusting your search query</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredChapters.map((chapter, index) => {
                                const diffStyle = getDifficultyStyle(chapter.difficulty);
                                // Determine category for the top badge
                                const isOrganic = chapter.name.toLowerCase().includes('organic') || ['haloalkanes', 'alcohol', 'phenol', 'ether', 'aldehyde', 'ketone', 'amine', 'biomolecules'].some(k => chapter.name.toLowerCase().includes(k));
                                const isInorganic = ['block', 'coordination', 'periodicity', 'bonding'].some(k => chapter.name.toLowerCase().includes(k));
                                const category = isOrganic ? 'Organic' : isInorganic ? 'Inorganic' : 'Physical';
                                const categoryColor = isOrganic ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : isInorganic ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

                                return (
                                    <motion.div
                                        key={chapter.slug}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * index }}
                                    >
                                        <div className="group h-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-teal-500/40 hover:border-teal-400/60 hover:ring-1 hover:ring-teal-500/30 transition-all duration-300 flex flex-col relative z-0">
                                            {/* Top Image Section */}
                                            <div className="relative h-32 bg-gray-800 overflow-hidden">
                                                {/* Dynamic gradient background based on index to give variety */}
                                                <div className={`absolute inset-0 bg-gradient-to-br ${index % 3 === 0 ? 'from-blue-900 to-slate-900' : index % 3 === 1 ? 'from-emerald-900 to-slate-900' : 'from-indigo-900 to-slate-900'}`}></div>

                                                {/* Decorative background patterns */}
                                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                                    <Layers className="w-24 h-24 transform rotate-12" />
                                                </div>

                                                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                                                    <div className="flex justify-end">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md ${categoryColor}`}>
                                                            {category}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-teal-400 transition-colors line-clamp-1 drop-shadow-md">
                                                        {chapter.name}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-5 flex flex-col flex-grow">
                                                {/* Metadata Row */}
                                                <div className="flex flex-wrap items-center justify-between gap-y-2 mb-4">
                                                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}>
                                                        {chapter.difficulty}
                                                    </span>
                                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                                                        <span className="flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" /> {chapter.videoCount}</span>
                                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {chapter.totalDuration}</span>
                                                        <span className="flex items-center gap-1 text-yellow-500"><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg> 4.8</span>
                                                    </div>
                                                </div>

                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-2 mb-6 flex-grow content-start">
                                                    {chapter.keyTopics.slice(0, 3).map((topic, i) => (
                                                        <span key={i} className="px-2.5 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg border border-gray-700">
                                                            {topic}
                                                        </span>
                                                    ))}
                                                    {chapter.keyTopics.length > 3 && (
                                                        <span className="px-2.5 py-1 bg-gray-800 text-gray-400 text-xs rounded-lg border border-gray-700">
                                                            +{chapter.keyTopics.length - 3}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Buttons */}
                                                <div className="grid grid-cols-1 gap-3 mt-auto">
                                                    <Link href={`/detailed-lectures/${chapter.slug}`} className="w-full">
                                                        <button className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 group-hover:shadow-teal-500/20">
                                                            <PlayCircle className="w-4 h-4" /> Start Learning
                                                        </button>
                                                    </Link>

                                                    {chapter.notesLink && (
                                                        <a
                                                            href={chapter.notesLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group/btn w-full py-2.5 bg-gray-800 hover:bg-gray-750 text-gray-200 hover:text-white rounded-xl font-semibold text-sm transition-all duration-300 border border-gray-700 hover:border-teal-500/50 hover:shadow-lg hover:shadow-teal-500/10 flex items-center justify-center gap-2"
                                                        >
                                                            <Download className="w-4 h-4 text-teal-500 group-hover/btn:text-teal-400 transition-colors" /> Notes
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
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-6">
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
            </section>
        </div>
    );
}
