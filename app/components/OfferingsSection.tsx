'use client';

import { motion } from 'framer-motion';
import {
    Play,
    BookOpen,
    Image,
    Clock,
    FileText,
    Layers,
    Zap,
    Trophy
} from 'lucide-react';

const offerings = [
    {
        icon: Play,
        title: 'Complete Chemistry Lectures',
        description: 'Covers complete class 11 and 12 chemistry upto JEE Main + Advanced. In depth concepts and extensive problem practice including top PYQs.',
        iconColor: '#f43f5e', // rose-500
        pastelBg: '#fff1f2', // rose-50
        cta: 'Start Watching',
        href: '/detailed-lectures',
        span: 'lg:col-span-2 lg:row-span-2'
    },
    {
        icon: Clock,
        title: 'Quick Recap Videos',
        description: 'For Quick and effective revision of JEE/NEET Chemistry.',
        iconColor: '#f59e0b', // amber-500
        pastelBg: '#fffbeb', // amber-50
        cta: 'Start Revising',
        href: '/quick-recap',
        span: 'lg:col-span-1'
    },
    {
        icon: Layers,
        title: 'Revise with Flashcards',
        description: 'Revise concepts, definitions, facts and formulas.',
        iconColor: '#8b5cf6', // violet-500
        pastelBg: '#f5f3ff', // violet-50
        cta: 'Start Practicing',
        href: '/flashcards',
        span: 'lg:col-span-1'
    },
    {
        icon: Zap,
        title: '2 Min Chemistry',
        description: "Ultra short and crisp videos to revise one concept at a time. Study smart and effectively.",
        iconColor: '#06b6d4', // cyan-500
        pastelBg: '#ecfeff', // cyan-50
        cta: 'Watch Now',
        href: '/short-videos',
        span: 'lg:col-span-2'
    },
    {
        icon: BookOpen,
        title: 'NCERT Solutions',
        description: 'Step-by-step solved exercises for every chapter.',
        iconColor: '#3b82f6', // blue-500
        pastelBg: '#eff6ff', // blue-50
        cta: 'View Solutions',
        href: '/ncert-solutions',
        span: 'lg:col-span-1'
    },
    {
        icon: Image,
        title: 'NCERT Revision',
        description: 'Visual infographics for quick chapter recap.',
        iconColor: '#10b981', // emerald-500
        pastelBg: '#ecfdf5', // emerald-50
        cta: 'Start Revising',
        href: '/ncert-revision',
        span: 'lg:col-span-1'
    },
    {
        icon: FileText,
        title: 'Handwritten Notes',
        description: 'Premium quality study notes by Paaras Sir.',
        iconColor: '#ec4899', // pink-500
        pastelBg: '#fdf2f8', // pink-50
        cta: 'Download Notes',
        href: '/notes',
        span: 'lg:col-span-1'
    },
    {
        icon: Trophy,
        title: 'Top 50 Concepts',
        description: 'Most important topics for JEE/NEET success.',
        iconColor: '#f97316', // orange-500
        pastelBg: '#fff7ed', // orange-50
        cta: 'Explore Now',
        href: '/top-concepts',
        span: 'lg:col-span-1'
    },
];

export default function OfferingsSection() {
    return (
        <section className="relative py-24 bg-[#fdfefe] overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute top-20 right-10 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl opacity-60" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl opacity-50" />

            <div className="relative container mx-auto px-6 sm:px-12 lg:px-20">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    {/* Pill Badge - Like old design */}
                    <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 rounded-full px-5 py-2 mb-6 border border-green-200">
                        <span className="text-green-500">💚</span>
                        <span className="font-semibold text-sm">15 Years of Free Education</span>
                    </div>

                    {/* Main Heading */}
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                        Knowledge Should Be <br />
                        <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">Free for Everyone</span>
                    </h2>

                    {/* Mission Statement */}
                    <p className="text-gray-700 max-w-3xl mx-auto text-lg mb-4 font-medium">
                        For 15 years, I've been committed to making quality chemistry education accessible to all. No subscriptions, no paywalls, no hidden costs — just pure learning.
                    </p>

                    {/* Trust Line */}
                    <p className="text-gray-500 max-w-3xl mx-auto text-base mb-12">
                        Trusted by hundreds of teachers and over 1 million students worldwide for exam preparation and classroom teaching.
                    </p>

                    {/* Sub-heading for Pathway */}
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                        Your Complete Learning <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Pathway</span>
                    </h3>
                    <p className="text-gray-500 max-w-2xl mx-auto text-base">
                        Follow our proven 4-step system to master chemistry — from concept building to exam success
                    </p>
                </motion.div>

                {/* Bento Grid - Asymmetric Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    {offerings.map((offering, index) => (
                        <motion.a
                            key={offering.title}
                            href={offering.href}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.06 }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -6,
                                transition: { duration: 0.25 }
                            }}
                            className={`group ${offering.span}`}
                        >
                            <div
                                className="relative h-full rounded-2xl p-6 border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300"
                                style={{ borderLeftWidth: '4px', borderLeftColor: offering.iconColor, backgroundColor: offering.pastelBg }}
                            >
                                {/* Icon */}
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                                    style={{ backgroundColor: offering.iconColor }}
                                >
                                    <offering.icon className="w-6 h-6 text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {offering.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                    {offering.description}
                                </p>

                                {/* CTA Link */}
                                <span
                                    className="inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                                    style={{ color: offering.iconColor }}
                                >
                                    {offering.cta}
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            </div>
                        </motion.a>
                    ))}
                </div>

                {/* Learning Pathway Indicator - Improved Visibility */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-16"
                >
                    <div className="inline-flex items-center gap-4 bg-gray-900 rounded-full px-8 py-4 shadow-2xl">
                        <span className="text-xl">💡</span>
                        <span className="font-bold text-rose-400 text-lg">Learn</span>
                        <span className="text-gray-500 text-lg">→</span>
                        <span className="font-bold text-violet-400 text-lg">Revise</span>
                        <span className="text-gray-500 text-lg">→</span>
                        <span className="font-bold text-cyan-400 text-lg">Practice</span>
                        <span className="text-gray-500 text-lg">→</span>
                        <span className="font-bold text-emerald-400 text-lg">Master</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
