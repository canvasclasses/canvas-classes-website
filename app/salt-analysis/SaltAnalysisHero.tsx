'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GraduationCap, Target, Video, X, Play } from 'lucide-react';

export default function SaltAnalysisHero() {
    const [showVideo, setShowVideo] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Choose Your Mode",
            description: "Go to 'Choose Your Path' to start. Learning Mode has hints to help you. Practice Mode has no hints. Exam Mode has a timer.",
            icon: Target,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20"
        },
        {
            title: "Revise with Simulators",
            description: "Scroll down to use the simulators. You will find them in this order: Anion Analysis, Dry & Flame Tests, and finally Cation Analysis.",
            icon: Video,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            title: "Question Practice",
            description: "Ready to test yourself? Try the Question Practice section to answer viva-style questions and check your knowledge.",
            icon: GraduationCap,
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20"
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const scrollToModes = () => {
        document.getElementById('mode-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative w-full h-[800px] overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="/salt_analysis_hero.png"
                    alt="Chemistry Laboratory"
                    className="w-full h-full object-cover"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 z-10 container mx-auto px-4 flex flex-col pt-32 md:pt-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-md">
                        <GraduationCap size={20} className="text-cyan-400" />
                        <span className="text-cyan-300 font-medium">Revise for CBSE/JEE/NEET</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Salt Analysis</span> Like a Pro
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Your 24/7 Virtual Lab. Practice systematic analysis of Cations and Anions with instant feedback, viva questions, and NCERT-aligned procedures.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-12">
                        <FeatureBadge icon={Target} text="Step-by-Step Guide" />
                        <FeatureBadge icon={Video} text="Real Lab Simulation" />
                        <FeatureBadge icon={GraduationCap} text="Viva Preparation" />
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={scrollToModes}
                            className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1"
                        >
                            Start Practicing
                            <ChevronDown className="group-hover:translate-y-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => setShowVideo(true)}
                            className="group flex items-center gap-3 px-8 py-4 bg-gray-800/50 hover:bg-gray-700/50 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md transition-all transform hover:-translate-y-1"
                        >
                            <Play size={20} className="fill-current" />
                            How it Works
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Feature Slideshow Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-4xl aspect-[16/9] md:aspect-[21/9] h-[400px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-700 flex flex-col md:flex-row"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowVideo(false)}
                                className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>

                            {/* Image/Visual Side (Left) */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full bg-gray-800 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black z-0" />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.2 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 flex items-center justify-center z-10"
                                    >
                                        {(() => {
                                            const Icon = slides[currentSlide].icon;
                                            return (
                                                <div className={`p-8 rounded-3xl ${slides[currentSlide].bg} ${slides[currentSlide].border} border-2`}>
                                                    <Icon size={80} className={slides[currentSlide].color} />
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Background Decorative Elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
                            </div>

                            {/* Content Side (Right) */}
                            <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center bg-gray-900 relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-3xl font-bold text-white mb-4">{slides[currentSlide].title}</h3>
                                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                            {slides[currentSlide].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Controls */}
                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="flex gap-2">
                                        {slides.map((_, index) => (
                                            <div
                                                key={index}
                                                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-8 bg-cyan-500' : 'w-2 bg-gray-700'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1" />
                                    <button
                                        onClick={prevSlide}
                                        className="p-3 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors border border-transparent hover:border-gray-700"
                                    >
                                        <ChevronDown className="rotate-90" size={24} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-3 rounded-full hover:bg-cyan-500/20 text-white transition-colors border border-gray-700 hover:border-cyan-500/50"
                                    >
                                        <ChevronDown className="-rotate-90" size={24} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function FeatureBadge({ icon: Icon, text }: { icon: any, text: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm">
            <Icon size={14} className="text-cyan-400 md:hidden" />
            <Icon size={16} className="text-cyan-400 hidden md:block" />
            <span className="text-xs md:text-base text-gray-200 font-medium">{text}</span>
        </div>
    );
}
