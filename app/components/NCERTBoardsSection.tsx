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
} from 'lucide-react';

interface NCERTResource {
    id: string;
    icon: React.ElementType;
    title: string;
    subtitle: string;
    description: string;
    href: string;
    gradient: string;
    iconBg: string;
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
        iconBg: 'bg-blue-400/30',
        features: ['Class 11 & 12 Chemistry', 'All exercises covered', 'Exam-oriented approach'],
    },
    {
        id: 'cbse-revision',
        icon: ImageIcon,
        title: 'CBSE 12 NCERT Revision',
        subtitle: 'Visual Infographics',
        description: 'Complete Class 12 Chemistry revision through beautiful visual infographics. Quick recap before exams!',
        href: '/cbse-12-ncert-revision',
        gradient: 'from-purple-500 to-fuchsia-600',
        iconBg: 'bg-purple-400/30',
        features: ['Chapter-wise visuals', 'Key concepts highlighted', 'Print-ready format'],
    },
    {
        id: 'ncert-download',
        icon: Download,
        title: 'Download NCERT Books',
        subtitle: 'Free PDF Downloads',
        description: 'Get official NCERT Chemistry textbooks in PDF format. Access anytime, anywhere - even offline!',
        href: '/download-ncert-books',
        gradient: 'from-emerald-500 to-teal-600',
        iconBg: 'bg-emerald-400/30',
        features: ['Class 11 & 12 books', 'Official NCERT PDFs', 'Instant download'],
    },
    {
        id: 'name-reactions',
        icon: FlaskConical,
        title: 'Organic Name Reactions',
        subtitle: 'Complete Collection',
        description: 'Master all important named reactions in Organic Chemistry. Essential for JEE, NEET, and board exams.',
        href: '/organic-name-reactions',
        gradient: 'from-orange-500 to-red-500',
        iconBg: 'bg-orange-400/30',
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
        iconBg: 'bg-cyan-400/30',
        features: ['Chapter-wise practice', 'Detailed explanations', 'Exam pattern based'],
    },
];

function ResourceCard({ resource, index }: { resource: NCERTResource; index: number }) {
    const Icon = resource.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true, margin: '-50px' }}
        >
            <Link href={resource.href} className="block group">
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${resource.gradient} p-1 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}>
                    {/* Inner card with glassmorphism */}
                    <div className="relative bg-slate-900/90 backdrop-blur-sm rounded-xl p-5 h-full">
                        {/* Glow effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${resource.gradient} opacity-20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />

                        {/* Header */}
                        <div className="relative flex items-start gap-4 mb-4">
                            <div className={`w-12 h-12 ${resource.iconBg} backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/80 group-hover:bg-clip-text transition-all">
                                    {resource.title}
                                </h3>
                                <p className={`text-sm font-medium bg-gradient-to-r ${resource.gradient} bg-clip-text text-transparent`}>
                                    {resource.subtitle}
                                </p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            {resource.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {resource.features.map((feature, i) => (
                                <span
                                    key={i}
                                    className="px-2.5 py-1 bg-white/5 text-gray-300 text-xs font-medium rounded-full border border-white/10"
                                >
                                    {feature}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-white/70 group-hover:text-white transition-colors">
                            <span className="text-sm font-semibold">Explore</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function NCERTBoardsSection() {
    return (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="relative container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full mb-4 border border-blue-500/20">
                        <BookOpen className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 font-semibold text-sm">NCERT & Boards</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
                        Master Your{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            NCERT
                        </span>{' '}
                        & Boards
                    </h2>

                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        NCERT is the foundation for JEE, NEET, and board exams. Choose a resource to strengthen your chemistry fundamentals.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
