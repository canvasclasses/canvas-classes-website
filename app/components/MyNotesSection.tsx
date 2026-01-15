'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Notebook } from 'lucide-react';

export default function MyNotesSection() {
    return (
        <div className="relative bg-slate-800">
            {/* No top gradient needed - seamless connection */}

            <div className="relative container mx-auto px-4 pt-2 md:pt-3 pb-8 md:pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <Link href="/handwritten-notes" className="block group">
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all">
                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

                            {/* Decorative circles */}
                            <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl" />

                            {/* Main content - Compact horizontal layout */}
                            <div className="relative flex flex-col sm:flex-row items-center gap-4 p-4 md:p-5">
                                {/* Notes Preview Image - Smaller */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                    className="relative flex-shrink-0"
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl scale-110" />
                                    <div className="relative w-20 h-24 md:w-24 md:h-28 rounded-lg overflow-hidden shadow-xl border-2 border-white/20">
                                        <Image
                                            src="/My_Notes.webp"
                                            alt="Handwritten Notes Preview"
                                            fill
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    {/* Badge */}
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-purple-700 px-2.5 py-0.5 rounded-full shadow-lg whitespace-nowrap">
                                        <span className="text-white font-bold text-[10px] flex items-center gap-1">
                                            <Notebook className="w-2.5 h-2.5" /> Free
                                        </span>
                                    </div>
                                </motion.div>

                                {/* Content */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                                        Handwritten Notes by{' '}
                                        <span className="text-pink-200">Paaras Sir</span>
                                    </h3>
                                    <p className="text-white/70 text-sm mb-0 hidden sm:block">
                                        Beautiful, exam-ready notes covering all important concepts
                                    </p>
                                </div>

                                {/* CTA Button */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-gray-900 font-bold px-4 py-2 rounded-full shadow-xl text-sm group-hover:shadow-2xl transition-shadow"
                                >
                                    View Notes
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </motion.div>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            </div>

            {/* Bottom gradient to connect with next section */}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>
    );
}
