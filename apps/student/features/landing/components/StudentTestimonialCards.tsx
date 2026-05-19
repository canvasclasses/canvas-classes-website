'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import QuickRevisionCard from './QuickRevisionCard';

interface StudentCard {
    id: string;
    studentImage: string;
    studentName: string;
    examType: 'JEE' | 'NEET';
    quote: string;
    buttonText: string;
    href: string;
    gradient: string;
    accentColor: string;
    imagePosition: 'left' | 'right';
}

const studentCards: StudentCard[] = [
    {
        id: 'jee',
        studentImage: '/jee_student.png',
        studentName: 'JEE Aspirant',
        examType: 'JEE',
        quote: "I want to learn concepts from scratch with detailed theory and examples for my JEE Main + Advanced preparation",
        buttonText: 'Start Learning',
        href: '/detailed-lectures',
        gradient: 'from-blue-600 via-indigo-600 to-purple-700',
        accentColor: 'bg-blue-500',
        imagePosition: 'left',
    },
    {
        id: 'neet',
        studentImage: '/neet_student.png',
        studentName: 'NEET Aspirant',
        examType: 'NEET',
        quote: "I want a NEET crash course to revise my chemistry concepts quickly and effectively",
        buttonText: 'Start Course',
        href: '/neet-crash-course',
        gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
        accentColor: 'bg-emerald-500',
        imagePosition: 'right',
    },
];

function TestimonialCard({ card, index }: { card: StudentCard; index: number }) {
    const isLeftAligned = card.imagePosition === 'left';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, margin: '-100px' }}
            className="w-full"
        >
            <div
                className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} shadow-2xl`}
            >
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                {/* Decorative circles */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

                {/* Main content container */}
                <div
                    className={`relative flex flex-col ${isLeftAligned ? 'md:flex-row' : 'md:flex-row-reverse'
                        } items-center gap-4 md:gap-8 p-5 md:p-8 lg:p-10`}
                >
                    {/* Student Image */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="relative flex-shrink-0"
                    >
                        {/* Glow effect behind image */}
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl scale-110" />

                        {/* Image container */}
                        <div className="relative w-36 h-44 md:w-48 md:h-56 lg:w-56 lg:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                            <Image
                                src={card.studentImage}
                                alt={card.studentName}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Badge */}
                        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 ${card.accentColor} px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap`}>
                            <span className="text-white font-bold text-sm">{card.examType} Prep</span>
                        </div>
                    </motion.div>

                    {/* Quote and CTA */}
                    <div className={`flex-1 text-center ${isLeftAligned ? 'md:text-left' : 'md:text-right'}`}>
                        {/* Quote marks */}
                        <span className="text-6xl md:text-7xl text-white/20 font-serif leading-none block mb-2">
                            &ldquo;
                        </span>

                        {/* Quote text */}
                        <p className="text-white text-lg md:text-xl lg:text-2xl font-medium leading-relaxed mb-6 -mt-8 md:-mt-10">
                            {card.quote}
                        </p>

                        {/* Student name */}
                        <p className="text-white/60 text-sm mb-6">
                            — {card.studentName}
                        </p>

                        {/* CTA Button */}
                        <Link href={card.href}>
                            <motion.button
                                whileHover={{ scale: 1.05, x: isLeftAligned ? 5 : -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-6 py-3 rounded-full shadow-xl hover:shadow-2xl transition-shadow text-sm md:text-base group`}
                            >
                                {card.buttonText}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function StudentTestimonialCards() {
    return (
        <section className="relative py-16 md:py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />

            <div className="relative container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                        What&apos;s your{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            goal?
                        </span>
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                        Choose the learning path that matches your preparation needs
                    </p>
                </motion.div>

                {/* Cards container */}
                <div className="max-w-5xl mx-auto space-y-8 md:space-y-12">
                    {studentCards.map((card, index) => (
                        <TestimonialCard key={card.id} card={card} index={index} />
                    ))}

                    {/* Quick Revision Card */}
                    <QuickRevisionCard />
                </div>
            </div>
        </section>
    );
}
