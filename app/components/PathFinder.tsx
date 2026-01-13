'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    BookOpen,
    Zap,
    FileText,
    PenTool,
    FolderOpen,
    Play,
    Rocket,
    Clock,
    Timer,
    Layers,
    Trophy,
    FlaskConical,
    HelpCircle,
    BookOpenCheck,
    Image as ImageIcon,
    Download,
    ArrowLeft,
    ChevronRight,
} from 'lucide-react';

// Type definitions
interface PathOption {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
    iconBg: string;
    href?: string;
    children?: PathOption[];
}

// Decision tree data structure
const pathTree: PathOption[] = [
    {
        id: 'learn',
        icon: BookOpen,
        title: 'Learn New Concepts',
        description: 'Comprehensive video lectures',
        gradient: 'from-rose-500 to-pink-600',
        iconBg: 'bg-rose-400/40',
        children: [
            {
                id: 'detailed-lectures',
                icon: Play,
                title: 'Complete JEE/NEET Lectures',
                description: 'In-depth Class 11 & 12 Chemistry with extensive problem practice and PYQs',
                gradient: 'from-rose-500 to-red-600',
                iconBg: 'bg-rose-400/50',
                href: '/detailed-lectures',
            },
            {
                id: 'neet-crash',
                icon: Rocket,
                title: 'NEET Crash Course',
                description: 'Complete NEET prep with Daily Practice Problems (DPP)',
                gradient: 'from-orange-500 to-red-500',
                iconBg: 'bg-orange-400/50',
                href: '/neet-crash-course',
            },
        ],
    },
    {
        id: 'revise',
        icon: Zap,
        title: 'Quick Revision',
        description: 'Fast-track your revision',
        gradient: 'from-amber-400 to-orange-500',
        iconBg: 'bg-amber-400/40',
        children: [
            {
                id: 'quick-recap',
                icon: Clock,
                title: 'Quick Recap Videos',
                description: 'Effective revision sessions for JEE/NEET Chemistry',
                gradient: 'from-amber-500 to-orange-500',
                iconBg: 'bg-amber-400/50',
                href: '/quick-recap',
            },
            {
                id: '2-min-chemistry',
                icon: Timer,
                title: '2 Min Chemistry',
                description: 'Ultra-short videos to revise one concept at a time',
                gradient: 'from-cyan-500 to-blue-500',
                iconBg: 'bg-cyan-400/50',
                href: '/2-minute-chemistry',
            },
            {
                id: 'flashcards',
                icon: Layers,
                title: 'Flashcards',
                description: 'Revise formulas, definitions, and key facts instantly',
                gradient: 'from-violet-500 to-purple-600',
                iconBg: 'bg-violet-400/50',
                href: '/flashcards',
            },
            {
                id: 'top-50',
                icon: Trophy,
                title: 'Top 50 Concepts',
                description: 'Master the most important topics for JEE/NEET success',
                gradient: 'from-orange-500 to-amber-500',
                iconBg: 'bg-orange-400/50',
                href: '/top-50-concepts',
            },
        ],
    },
    {
        id: 'practice',
        icon: PenTool,
        title: 'Practice & Test Prep',
        description: 'Sharpen your skills',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-400/40',
        children: [
            {
                id: 'name-reactions',
                icon: FlaskConical,
                title: 'Organic Name Reactions',
                description: 'Master all important named reactions for organic chemistry',
                gradient: 'from-emerald-500 to-green-600',
                iconBg: 'bg-emerald-400/50',
                href: '/organic-name-reactions',
            },
            {
                id: 'assertion-reason',
                icon: HelpCircle,
                title: 'Assertion Reason',
                description: 'Practice assertion-reason questions for competitive exams',
                gradient: 'from-teal-500 to-cyan-600',
                iconBg: 'bg-teal-400/50',
                href: '/assertion-reason',
            },
        ],
    },
    {
        id: 'ncert',
        icon: BookOpenCheck,
        title: 'NCERT Resources',
        description: 'Everything NCERT',
        gradient: 'from-blue-500 to-indigo-600',
        iconBg: 'bg-blue-400/40',
        children: [
            {
                id: 'ncert-solutions',
                icon: BookOpen,
                title: 'NCERT Solutions',
                description: 'Step-by-step video solutions for all NCERT exercises',
                gradient: 'from-blue-500 to-blue-700',
                iconBg: 'bg-blue-400/50',
                href: '/ncert-solutions',
            },
            {
                id: 'ncert-revision',
                icon: ImageIcon,
                title: 'NCERT Revision',
                description: 'Visual infographics for quick NCERT chapter recap',
                gradient: 'from-purple-500 to-fuchsia-600',
                iconBg: 'bg-purple-400/50',
                href: '/cbse-12-ncert-revision',
            },
            {
                id: 'ncert-download',
                icon: Download,
                title: 'Download NCERT Books',
                description: 'Download official NCERT textbooks in PDF format',
                gradient: 'from-indigo-500 to-purple-600',
                iconBg: 'bg-indigo-400/50',
                href: '/download-ncert-books',
            },
        ],
    },
    {
        id: 'materials',
        icon: FolderOpen,
        title: 'Study Materials',
        description: 'Notes & PDFs',
        gradient: 'from-pink-500 to-rose-600',
        iconBg: 'bg-pink-400/40',
        children: [
            {
                id: 'handwritten-notes',
                icon: FileText,
                title: 'Handwritten Notes',
                description: 'Premium quality handwritten notes by Paaras Sir',
                gradient: 'from-pink-500 to-rose-600',
                iconBg: 'bg-pink-400/50',
                href: '/handwritten-notes',
            },
        ],
    },
];

// Compact Card Component
function CompactCard({
    option,
    index,
    onClick,
    position,
}: {
    option: PathOption;
    index: number;
    onClick: () => void;
    position: 'left' | 'right';
}) {
    const Icon = option.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: position === 'left' ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -4 }}
            onClick={onClick}
            className="cursor-pointer group"
        >
            <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${option.gradient} p-4 shadow-lg hover:shadow-2xl transition-all duration-300`}>
                {/* Subtle glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-50 blur-xl -z-10 transition-opacity`} />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-center gap-3">
                    <div className={`w-10 h-10 ${option.iconBg} backdrop-blur-sm rounded-lg flex items-center justify-center shadow-inner`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-sm leading-tight">{option.title}</h3>
                        <p className="text-white/70 text-xs mt-0.5 line-clamp-1">{option.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                </div>
            </div>
        </motion.div>
    );
}

// Sub-option card
function SubOptionCard({ option, index }: { option: PathOption; index: number }) {
    const Icon = option.icon;

    const content = (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className={`group relative overflow-hidden rounded-xl p-5 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${option.gradient}`}
        >
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-start gap-4">
                <div className={`w-11 h-11 ${option.iconBg} rounded-lg flex items-center justify-center shadow-lg shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-white mb-1">{option.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed">{option.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform shrink-0 mt-1" />
            </div>
        </motion.div>
    );

    return option.href ? <Link href={option.href}>{content}</Link> : content;
}

export default function PathFinder() {
    const [currentPath, setCurrentPath] = useState<PathOption[] | null>(null);
    const [breadcrumb, setBreadcrumb] = useState<string>('');

    const handleCategoryClick = (option: PathOption) => {
        if (option.children) {
            setCurrentPath(option.children);
            setBreadcrumb(option.title);
        }
    };

    const handleBack = () => {
        setCurrentPath(null);
        setBreadcrumb('');
    };

    const isSubLevel = currentPath !== null;
    const leftCards = pathTree.slice(0, 2);  // Learn, Quick Revision
    const rightCards = pathTree.slice(2);     // Practice, NCERT, Materials

    return (
        <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-radial from-amber-500/5 to-transparent rounded-full" />

            <div className="relative container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-2">
                        What brings you here{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            today?
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg">
                        Choose your learning goal and we&apos;ll guide you to the perfect resource
                    </p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {!isSubLevel ? (
                        /* MAIN VIEW - Character with cards on sides */
                        <motion.div
                            key="main"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative max-w-5xl mx-auto"
                        >
                            <div className="flex items-center justify-center gap-4 md:gap-8">
                                {/* Left Cards Column */}
                                <div className="flex-1 max-w-[220px] space-y-3">
                                    {leftCards.map((option, index) => (
                                        <CompactCard
                                            key={option.id}
                                            option={option}
                                            index={index}
                                            onClick={() => handleCategoryClick(option)}
                                            position="left"
                                        />
                                    ))}
                                </div>

                                {/* Center - Student Character */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="flex-shrink-0 relative"
                                >
                                    {/* Glow behind character */}
                                    <div className="absolute inset-0 -m-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />

                                    {/* Character Image - No circle crop */}
                                    <div className="relative w-52 h-64 md:w-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
                                        <Image
                                            src="/student_avatar.webp"
                                            alt="Student"
                                            fill
                                            className="object-cover"
                                            priority
                                        />
                                    </div>

                                    {/* Label below character */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="absolute -bottom-5 left-1/2 -translate-x-1/2"
                                    >
                                        <span className="text-sm font-semibold text-amber-400 bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-400/30 whitespace-nowrap shadow-lg">
                                            Choose your path ✨
                                        </span>
                                    </motion.div>
                                </motion.div>

                                {/* Right Cards Column */}
                                <div className="flex-1 max-w-[220px] space-y-3">
                                    {rightCards.map((option, index) => (
                                        <CompactCard
                                            key={option.id}
                                            option={option}
                                            index={index + 2}
                                            onClick={() => handleCategoryClick(option)}
                                            position="right"
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* SUB-OPTIONS VIEW */
                        <motion.div
                            key="suboptions"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={handleBack}
                                className="flex items-center gap-2 text-white/80 hover:text-white font-medium mb-5 group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Back to all options</span>
                            </motion.button>

                            <div className="mb-5">
                                <span className="text-slate-500 text-sm">You selected: </span>
                                <span className="text-amber-400 font-bold">{breadcrumb}</span>
                            </div>

                            <div className="grid gap-3">
                                {currentPath.map((option, index) => (
                                    <SubOptionCard key={option.id} option={option} index={index} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Explore All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-500 text-sm">
                        Not sure where to start?{' '}
                        <a href="#all-resources" className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2">
                            Explore all resources →
                        </a>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
