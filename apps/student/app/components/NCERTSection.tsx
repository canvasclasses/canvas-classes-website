'use client';

import { motion } from 'framer-motion';
import { BookOpen, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

const ncertCards = [
    {
        icon: BookOpen,
        title: 'NCERT Solutions',
        subtitle: 'Complete video solutions for every problem',
        features: [
            'Step-by-step video explanations for all NCERT exercises',
            'Visual demonstrations and diagrams for clarity',
            'Perfect for both board exam preparation and JEE/NEET foundation',
        ],
        cta: 'Watch Solutions',
        badge: 'Class 11 & 12',
        gradient: 'from-blue-600 via-blue-500 to-cyan-500',
        iconBg: 'bg-blue-500/50',
        ctaColor: 'text-blue-600',
    },
    {
        icon: Zap,
        title: 'CBSE 12 NCERT Revision',
        subtitle: 'Infographic-powered quick revision',
        features: [
            'Visually stunning infographics for rapid revision',
            'Complete Class 12 NCERT coverage in engaging format',
            'Perfect for last-minute exam preparation and quick recalls',
        ],
        cta: 'Start Revising',
        badge: 'Class 12 Only',
        gradient: 'from-purple-700 via-fuchsia-600 to-pink-500',
        iconBg: 'bg-purple-500/50',
        ctaColor: 'text-purple-600',
    },
];

export default function NCERTSection() {
    return (
        <section className="relative py-24 bg-[#ecf2fe] overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl opacity-50" />

            <div className="relative container mx-auto px-6 sm:px-12 lg:px-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-5 py-2 mb-6 border border-blue-200">
                        <BookOpen className="w-4 h-4" />
                        <span className="font-semibold text-sm">Foundation for Excellence</span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
                        Master NCERT for <br />
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Boards & Competitive Exams
                        </span>
                    </h2>

                    {/* Description */}
                    <p className="text-gray-700 max-w-3xl mx-auto text-lg mb-4">
                        NCERT is not just for board exams — it's the foundation for{' '}
                        <span className="font-bold text-blue-600">JEE, NEET, BITSAT, and even UPSC</span>.
                        <br />
                        Over 60% of JEE/NEET questions come directly from NCERT concepts!
                    </p>

                    <p className="text-gray-500 max-w-3xl mx-auto text-base">
                        Our <span className="text-yellow-600 font-semibold">engaging video solutions</span> and{' '}
                        <span className="text-purple-600 font-semibold">infographic-powered revision notes</span>{' '}
                        transform traditional NCERT into an interactive learning experience that makes chemistry easy to understand and remember.
                    </p>
                </motion.div>

                {/* NCERT Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {ncertCards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.03, y: -5 }}
                            className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
                        >
                            {/* Gradient Top Section */}
                            <div className={`bg-gradient-to-r ${card.gradient} p-8 pb-10`}>
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className={`w-14 h-14 ${card.iconBg} rounded-2xl flex items-center justify-center`}>
                                        <card.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Title & Subtitle */}
                                <h3 className="text-3xl font-black text-white mb-2">{card.title}</h3>
                                <p className="text-white/95 font-semibold">{card.subtitle}</p>
                            </div>

                            {/* White Bottom Section */}
                            <div className="p-8 pt-6 bg-white">
                                {/* Features List */}
                                <ul className="space-y-4 mb-8">
                                    {card.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-800">
                                            <CheckCircle2 className={`w-5 h-5 ${card.ctaColor} flex-shrink-0 mt-0.5`} />
                                            <span className="text-base font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <a
                                        href="#"
                                        className={`inline-flex items-center gap-2 ${card.ctaColor} font-bold hover:gap-3 transition-all duration-300`}
                                    >
                                        {card.cta}
                                        <ArrowRight className="w-4 h-4" />
                                    </a>
                                    <span className="text-gray-500 text-sm font-semibold">{card.badge}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
