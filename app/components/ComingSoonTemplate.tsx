'use client';

import { motion } from 'framer-motion';
import { Clock, Bell, Sparkles, BookOpen, FlaskConical, Atom } from 'lucide-react';
import Link from 'next/link';

interface ComingSoonPageProps {
    classNumber: string;
    title: string;
    description: string;
    features: string[];
    accentColor: string;
    gradientFrom: string;
    gradientTo: string;
}

export default function ComingSoonTemplate({
    classNumber,
    title,
    description,
    features,
    accentColor,
    gradientFrom,
    gradientTo
}: ComingSoonPageProps) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Elements */}
                <div className={`absolute top-20 left-1/4 w-96 h-96 ${gradientFrom}/10 rounded-full blur-3xl`} />
                <div className={`absolute bottom-0 right-1/4 w-80 h-80 ${gradientTo}/10 rounded-full blur-3xl`} />

                {/* Floating Icons */}
                <motion.div
                    className="absolute top-32 left-[15%] text-purple-400/20"
                    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                >
                    <Atom size={80} />
                </motion.div>
                <motion.div
                    className="absolute top-40 right-[15%] text-blue-400/20"
                    animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                >
                    <FlaskConical size={60} />
                </motion.div>

                <div className="relative container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Badge */}
                        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-${accentColor}-500/10 rounded-full border border-${accentColor}-500/20 mb-6`}>
                            <Clock className={`w-4 h-4 text-${accentColor}-400`} />
                            <span className={`text-${accentColor}-400 font-semibold text-sm`}>Coming Soon</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                            CBSE Class {classNumber}{' '}
                            <span className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent`}>
                                Chemistry
                            </span>
                        </h1>

                        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                            {description}
                        </p>

                        {/* Countdown/Status Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="max-w-lg mx-auto bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-12"
                        >
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-xl font-bold text-white">We're Working On It!</h2>
                                    <p className="text-slate-400 text-sm">Quality content takes time</p>
                                </div>
                            </div>

                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                                <motion.div
                                    className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: '35%' }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                />
                            </div>
                            <p className="text-slate-500 text-sm">Content Development in Progress</p>
                        </motion.div>
                    </motion.div>

                    {/* Features Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="max-w-3xl mx-auto"
                    >
                        <h3 className="text-white font-semibold mb-6">What's Coming:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                    className="bg-slate-800/30 border border-white/5 rounded-xl p-4 text-center"
                                >
                                    <BookOpen className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                    <span className="text-slate-300 text-sm">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-12"
                    >
                        <p className="text-slate-500 mb-4">Meanwhile, explore our Class 12 resources:</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/cbse-12-ncert-revision"
                                className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white font-semibold rounded-xl hover:opacity-90 transition-opacity`}
                            >
                                <BookOpen className="w-5 h-5" />
                                Class 12 Revision
                            </Link>
                            <Link
                                href="/flashcards"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <Sparkles className="w-5 h-5" />
                                Flashcards
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
