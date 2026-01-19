'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    BookOpen,
    Image as ImageIcon,
    Download,
    FlaskConical,
    HelpCircle,
    ArrowRight,
    Zap, // For Flashcards
    Layers
} from 'lucide-react';

interface NCERTResource {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    href: string;
    gradient: string;
    iconColor: string;
    features: string[];
}

const ncertResources: NCERTResource[] = [
    {
        id: 'ncert-solutions',
        icon: BookOpen,
        title: 'NCERT Solutions',
        subtitle: 'Video Solutions',
        description: 'Step-by-step video explanations for every NCERT in-text and exercise question. Perfect for building strong fundamentals.',
        href: '/ncert-solutions',
        gradient: 'from-blue-500 to-indigo-600',
        iconColor: 'blue',
        features: ['Class 11 & 12 Chemistry', 'All exercises covered', 'Exam-oriented approach'],
    },
    {
        id: 'cbse-revision',
        icon: ImageIcon,
        title: 'CBSE 12 Revision',
        subtitle: 'Visual Infographics',
        description: 'Complete Class 12 Chemistry revision through beautiful visual infographics. Quick recap before exams!',
        href: '/cbse-12-ncert-revision',
        gradient: 'from-purple-500 to-fuchsia-600',
        iconColor: 'purple',
        features: ['Chapter-wise visuals', 'Key concepts highlighted', 'Print-ready format'],
    },
    {
        id: 'ncert-download',
        icon: Download,
        title: 'Download Books',
        subtitle: 'Free PDF Downloads',
        description: 'Get official NCERT Chemistry textbooks in PDF format. Access anytime, anywhere - even offline!',
        href: '/download-ncert-books',
        gradient: 'from-emerald-500 to-teal-600',
        iconColor: 'emerald',
        features: ['Class 11 & 12 books', 'Official NCERT PDFs', 'Instant download'],
    },
    {
        id: 'name-reactions',
        icon: FlaskConical,
        title: 'Name Reactions',
        subtitle: 'Complete Collection',
        description: 'Master all important named reactions in Organic Chemistry. Essential for JEE, NEET, and board exams.',
        href: '/organic-name-reactions',
        gradient: 'from-orange-500 to-red-500',
        iconColor: 'orange',
        features: ['40+ reactions', 'Mechanism explained', 'Practice problems'],
    },
    {
        id: 'assertion-reason',
        icon: HelpCircle,
        title: 'Assertion & Reason',
        subtitle: 'Practice Questions',
        description: 'Practice assertion-reason type questions that frequently appear in competitive exams. Sharpen your reasoning skills!',
        href: '/assertion-reason',
        gradient: 'from-cyan-500 to-blue-600',
        iconColor: 'cyan',
        features: ['Chapter-wise practice', 'Detailed explanations', 'Exam pattern based'],
    },
    {
        id: 'flashcards',
        icon: Layers,
        title: 'Flashcards',
        subtitle: 'Active Recall',
        description: 'Boost your retention with spaced repetition flashcards. The smartest way to memorize formulas and facts.',
        href: '/flashcards',
        gradient: 'from-rose-500 to-pink-600',
        iconColor: 'rose',
        features: ['Spaced Repetition', 'Smart Algorithms', 'Track Progress'],
    },
];

// Color variations helper
const getColorStyles = (color: string) => {
    const colors: Record<string, any> = {
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', glow: 'group-hover:shadow-blue-500/20' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'group-hover:shadow-purple-500/20' },
        emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'group-hover:shadow-emerald-500/20' },
        orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', glow: 'group-hover:shadow-orange-500/20' },
        cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'group-hover:shadow-cyan-500/20' },
        rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', glow: 'group-hover:shadow-rose-500/20' },
    };
    return colors[color] || colors.blue;
};


function ResourceCard({ resource, index }: { resource: NCERTResource; index: number }) {
    const Icon = resource.icon;
    const styles = getColorStyles(resource.iconColor);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
        >
            <Link href={resource.href} className="block group h-full">
                <div className={`relative h-full bg-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 md:p-8 transition-all duration-300 hover:border-slate-700 hover:-translate-y-1 hover:bg-slate-800/60 ${styles.glow} hover:shadow-xl`}>

                    {/* Header */}
                    <div className="flex items-start gap-5 mb-6">
                        <div className={`w-14 h-14 rounded-2xl ${styles.bg} ${styles.border} border flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            <Icon className={`w-7 h-7 ${styles.text}`} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all">
                                {resource.title}
                            </h3>
                            <p className={`text-sm font-medium ${styles.text} opacity-90`}>
                                {resource.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {resource.description}
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mt-auto mb-6">
                        {resource.features.map((feature, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-1 bg-slate-800/50 text-slate-400 text-xs font-medium rounded-lg border border-slate-700/50"
                            >
                                {feature}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className={`flex items-center gap-2 text-sm font-semibold transition-all ${styles.text} opacity-80 group-hover:opacity-100 group-hover:gap-3`}>
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function NCERTBoardsSection() {
    return (
        <section className="relative py-24 bg-black overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[128px]" />

            <div className="relative container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full mb-6 border border-slate-800 backdrop-blur-sm">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-semibold text-sm">NCERT & Boards</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                        Master Your{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                            NCERT & Boards
                        </span>
                    </h2>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Comprehensive resources designed to build strong fundamentals.
                        Directly aligned with JEE, NEET, and CBSE curriculum.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {ncertResources.map((resource, index) => (
                        <ResourceCard key={resource.id} resource={resource} index={index} />
                    ))}
                </div>

                {/* Bottom note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-500 text-sm">
                        Over <span className="text-blue-400 font-bold">60%</span> of JEE/NEET questions come directly from NCERT concepts!
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
