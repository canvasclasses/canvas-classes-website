'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Video, FileText, PlayCircle, Brain, Layers } from 'lucide-react';

// Quick revision pill links for 3-click access
const quickRevisionLinks = [
    { label: 'NCERT Summary', href: '/cbse-12-ncert-revision', icon: FileText, desc: 'Chapter-wise notes' },
    { label: 'Flashcards', href: '/chemistry-flashcards', icon: Brain, desc: 'Quick recall practice' },
    { label: 'One-Shots', href: '/one-shot-lectures', icon: PlayCircle, desc: 'Full chapter in 1 video' },
    { label: 'Organic Reactions', href: '/organic-name-reactions', icon: Layers, desc: 'Named reactions' },
];

export default function GoalSelector() {
    return (
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-8"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        What's your{' '}
                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                            goal?
                        </span>
                    </h2>
                    <p className="text-slate-400">Choose your preparation path</p>
                </motion.div>

                {/* Split Decision Cards - Matching the mockup exactly */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="max-w-5xl mx-auto mb-5"
                >
                    <div className="relative grid md:grid-cols-2 gap-0">
                        {/* JEE Section - Blue */}
                        <Link href="/detailed-lectures" className="group">
                            <div className="relative h-full bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 md:rounded-l-3xl rounded-t-3xl md:rounded-tr-none p-6 md:p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all overflow-hidden min-h-[280px] md:min-h-[320px]">
                                {/* Circuit pattern overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('/circuit-pattern.svg')] bg-repeat" />

                                {/* Silhouette Figure - Inside card on left */}
                                <div className="absolute left-0 top-0 bottom-0 w-1/2 md:w-2/5 overflow-hidden">
                                    <Image
                                        src="/jee_silhouette.png"
                                        alt="JEE Student"
                                        fill
                                        className="object-contain object-left-bottom opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>

                                {/* Content - Right side */}
                                <div className="relative ml-auto w-3/5 md:w-1/2 text-right flex flex-col h-full justify-center">
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                        Start from<br />scratch
                                    </h3>

                                    {/* CTA Button */}
                                    <div className="mb-6">
                                        <span className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 transition-all text-sm uppercase tracking-wide">
                                            Start Now
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <div className="flex justify-end gap-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <Video className="text-blue-400" size={18} />
                                            <span className="text-xs text-blue-300/70">Live Classes</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <FileText className="text-blue-400" size={18} />
                                            <span className="text-xs text-blue-300/70">Practice Tests</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Central OR Divider - Glowing line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-20">
                            {/* Glowing vertical line */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 via-cyan-400 to-emerald-400 -translate-x-1/2 shadow-lg shadow-cyan-500/50" />

                            {/* OR Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <div className="w-12 h-12 bg-slate-800 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/30">
                                    <span className="text-white font-bold text-sm">OR</span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile OR Divider */}
                        <div className="flex md:hidden items-center justify-center relative z-10 -my-3">
                            <div className="w-10 h-10 bg-slate-800 border-2 border-cyan-400 rounded-full flex items-center justify-center shadow-xl">
                                <span className="text-white font-bold text-xs">OR</span>
                            </div>
                        </div>

                        {/* NEET Section - Green */}
                        <Link href="/neet-crash-course" className="group">
                            <div className="relative h-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 md:rounded-r-3xl rounded-b-3xl md:rounded-bl-none p-6 md:p-8 border border-emerald-500/30 hover:border-emerald-400/50 transition-all overflow-hidden min-h-[280px] md:min-h-[320px]">
                                {/* Circuit pattern overlay */}
                                <div className="absolute inset-0 opacity-20 bg-[url('/circuit-pattern.svg')] bg-repeat" />

                                {/* Silhouette Figure - Inside card on right */}
                                <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-2/5 overflow-hidden">
                                    <Image
                                        src="/neet_silhouette.png"
                                        alt="NEET Student"
                                        fill
                                        className="object-contain object-right-bottom opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                    />
                                </div>

                                {/* Content - Left side */}
                                <div className="relative mr-auto w-3/5 md:w-1/2 text-left flex flex-col h-full justify-center">
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                                        Crash course<br />revision
                                    </h3>

                                    {/* CTA Button */}
                                    <div className="mb-6">
                                        <span className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-6 py-2.5 rounded-lg shadow-lg shadow-emerald-500/30 transition-all text-sm uppercase tracking-wide border border-emerald-400/50">
                                            Join Course
                                        </span>
                                    </div>

                                    {/* Features */}
                                    <div className="flex justify-start gap-6">
                                        <div className="flex flex-col items-center gap-1">
                                            <Video className="text-emerald-400" size={18} />
                                            <span className="text-xs text-emerald-300/70">Live Classes</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <FileText className="text-emerald-400" size={18} />
                                            <span className="text-xs text-emerald-300/70">Practice Tests</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </motion.div>

                {/* Quick Revision Section with Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border border-orange-500/30 rounded-2xl p-4 md:p-5">
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/25">
                                    <BookOpen className="text-white" size={18} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                                        Quick Revision Mode
                                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full">
                                            CBSE 12
                                        </span>
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Clickable Pills Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {quickRevisionLinks.map((link, idx) => (
                                <Link key={link.href} href={link.href}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + idx * 0.05 }}
                                        className="group bg-slate-800/60 hover:bg-orange-500/20 border border-slate-700 hover:border-orange-500/50 rounded-xl p-2.5 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <link.icon className="text-orange-400 group-hover:text-orange-300" size={14} />
                                            <span className="text-white text-sm font-medium">{link.label}</span>
                                        </div>
                                        <p className="text-slate-500 text-xs group-hover:text-slate-400">{link.desc}</p>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
