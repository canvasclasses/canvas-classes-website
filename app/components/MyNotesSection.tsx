'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Notebook } from 'lucide-react';

export default function MyNotesSection() {
    return (
        <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 -mt-8 md:-mt-12">
            <div className="relative container mx-auto px-4 pb-8 md:pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <Link href="/handwritten-notes" className="block group">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 shadow-2xl">
                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                            {/* Decorative circles */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl" />

                            {/* Main content container */}
                            <div className="relative flex flex-col md:flex-row items-center gap-4 md:gap-8 p-5 md:p-8">
                                {/* Notes Preview Image */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="relative flex-shrink-0"
                                >
                                    {/* Glow effect behind image */}
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl scale-110" />

                                    {/* Image container */}
                                    <div className="relative w-28 h-36 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-2xl border-4 border-white/20">
                                        <Image
                                            src="/My_Notes.webp"
                                            alt="Handwritten Notes Preview"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-purple-700 px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                                        <span className="text-white font-bold text-xs flex items-center gap-1">
                                            <Notebook className="w-3 h-3" /> Free
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Quote and CTA */}
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                                        Handwritten Notes by{' '}
                                        <span className="text-pink-200">Paaras Sir</span>
                                    </h3>

                                    <p className="text-white/70 text-sm md:text-base mb-4 max-w-lg">
                                        Beautiful, exam-ready notes covering all important concepts. Perfect for last-minute revision!
                                    </p>

                                    {/* CTA Button */}
                                    <motion.div
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-5 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-shadow text-sm"
                                    >
                                        View Notes
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
