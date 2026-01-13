'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
    Clock,
    Trophy,
    Timer,
    FlaskConical,
    Layers,
    HelpCircle,
} from 'lucide-react';

interface RevisionResource {
    icon: React.ElementType;
    title: string;
    href: string;
    color: string;
}

const revisionResources: RevisionResource[] = [
    {
        icon: Clock,
        title: 'Quick Recap',
        href: '/one-shot-lectures',
        color: 'from-amber-500 to-orange-500',
    },
    {
        icon: Trophy,
        title: 'Top 50 Concepts',
        href: '/top-50-concepts',
        color: 'from-yellow-500 to-amber-500',
    },
    {
        icon: Timer,
        title: '2 Min Chemistry',
        href: '/2-minute-chemistry',
        color: 'from-cyan-500 to-blue-500',
    },
    {
        icon: FlaskConical,
        title: 'Name Reactions',
        href: '/organic-name-reactions',
        color: 'from-rose-500 to-pink-500',
    },
    {
        icon: Layers,
        title: 'Flashcards',
        href: '/flashcards',
        color: 'from-violet-500 to-purple-600',
    },
    {
        icon: HelpCircle,
        title: 'Assertion Reason',
        href: '/assertion-reason',
        color: 'from-teal-500 to-emerald-500',
    },
];

export default function QuickRevisionCard() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, margin: '-100px' }}
            className="w-full max-w-5xl mx-auto"
        >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-2xl">
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

                {/* Main content container */}
                <div className="relative flex flex-col md:flex-row items-center gap-6 md:gap-10 p-6 md:p-10 lg:p-12">
                    {/* Student Image */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative flex-shrink-0"
                    >
                        {/* Glow effect behind image */}
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl scale-110" />

                        {/* Image container */}
                        <div className="relative w-44 h-52 md:w-56 md:h-64 lg:w-64 lg:h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                            <Image
                                src="/revision_student_new.png"
                                alt="Revision Student"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-600 px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                            <span className="text-white font-bold text-sm">⚡ Revision Mode</span>
                        </div>
                    </motion.div>

                    {/* Quote and Buttons */}
                    <div className="flex-1 text-center md:text-left">
                        {/* Quote marks */}
                        <span className="text-6xl md:text-7xl text-white/20 font-serif leading-none block mb-2">
                            &ldquo;
                        </span>

                        {/* Quote text */}
                        <p className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mb-6 -mt-8 md:-mt-10">
                            I want to quickly revise chapters, high-value concepts, and organic name reactions before my exams
                        </p>

                        {/* Student name */}
                        <p className="text-white/60 text-sm mb-6">
                            — Smart Reviser
                        </p>

                        {/* 6 Resource Buttons - 3x2 Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {revisionResources.map((resource, index) => {
                                const Icon = resource.icon;
                                return (
                                    <Link key={resource.href} href={resource.href}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.1 }}
                                            viewport={{ once: true }}
                                            whileHover={{ scale: 1.05, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 bg-gradient-to-br ${resource.color} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                                    <Icon className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-gray-800 font-semibold text-sm group-hover:text-orange-600 transition-colors">
                                                    {resource.title}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
