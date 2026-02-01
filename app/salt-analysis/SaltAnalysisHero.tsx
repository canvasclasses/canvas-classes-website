'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronDown,
    GraduationCap,
    Target,
    Video,
    X,
    Play,
    MousePointer2,
    BookOpen,
    FlaskConical,
    Timer,
    Flame,
    Layers,
    CheckCircle2,
    HelpCircle
} from 'lucide-react';
import Image from 'next/image';

// --- Custom Visual Components ---

const ModeSelectionVisual = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Mode Cards */}
            <div className="flex gap-3 md:gap-6">
                {[
                    { icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' },
                    { icon: FlaskConical, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' },
                    { icon: Timer, color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' }
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: [1, 1.1, 1, 1, 1],
                            borderColor: [
                                'rgba(255,255,255,0.1)',
                                item.border.replace('border-', '').replace('/30', ''),
                                'rgba(255,255,255,0.1)',
                                'rgba(255,255,255,0.1)',
                                'rgba(255,255,255,0.1)'
                            ].map(c => c.replace('border-', '')) // rough fix for color map, using opacity instead below
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            delay: i * 1.3,
                            times: [0, 0.2, 0.4, 1]
                        }}
                        className={`w-16 h-20 md:w-24 md:h-32 rounded-xl border border-white/10 bg-gray-900/80 flex flex-col items-center justify-center gap-2 relative overflow-hidden`}
                    >
                        <div className={`absolute inset-0 opacity-0 ${item.bg}`}
                            style={{ animation: `pulse-bg-${i} 4s infinite ${i * 1.3}s` }}
                        />
                        <item.icon size={24} className={`${item.color} z-10 md:w-8 md:h-8`} />
                        <div className="w-8 h-1.5 md:w-12 md:h-2 rounded-full bg-gray-700/50 z-10" />
                    </motion.div>
                ))}
            </div>

            {/* Cursor Animation */}
            <motion.div
                animate={{
                    x: [-60, 0, 60, -60],
                    y: [10, 10, 10, 10],
                    scale: [1, 0.9, 1, 0.9, 1, 0.9, 1], // Click effect
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    times: [0, 0.33, 0.66, 1]
                }}
                className="absolute z-20 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ filter: "drop-shadow(0px 0px 8px rgba(34,211,238,0.5))" }}
            >
                <MousePointer2 size={32} className="fill-current" />
            </motion.div>
        </div>
    );
};

const SimulatorsVisual = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Bunsen Burner Base */}
            <div className="absolute bottom-8 md:bottom-12 flex flex-col items-center">
                <div className="w-4 h-12 md:w-6 md:h-16 bg-gray-600 rounded-sm bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700" />
                <div className="w-12 h-2 md:w-16 md:h-3 bg-gray-700 rounded-full mt-[-1px]" />
            </div>

            {/* Flame Animation */}
            <motion.div
                className="absolute bottom-20 md:bottom-28"
                animate={{
                    scale: [1, 1.1, 1, 1.05, 1],
                    filter: [
                        'drop-shadow(0 0 10px rgba(250, 204, 21, 0.4))', // Yellowish
                        'drop-shadow(0 0 20px rgba(239, 68, 68, 0.6))', // Reddish (Strontium)
                        'drop-shadow(0 0 20px rgba(34, 197, 94, 0.6))', // Greenish (Barium)
                        'drop-shadow(0 0 10px rgba(250, 204, 21, 0.4))'
                    ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div className="relative w-12 h-24 md:w-16 md:h-32 transform origin-bottom">
                    {/* Inner Flame Core */}
                    <motion.div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full rounded-t-[100%] rounded-b-[40%] blur-sm"
                        animate={{
                            background: [
                                'linear-gradient(to top, #f59e0b, #facc1500)', // Default Orange
                                'linear-gradient(to top, #ef4444, #f8717100)', // Red
                                'linear-gradient(to top, #22c55e, #4ade8000)', // Green
                                'linear-gradient(to top, #f59e0b, #facc1500)'
                            ]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    {/* Blue Base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/3 bg-blue-500/80 rounded-full blur-md" />
                </div>
            </motion.div>

            {/* Wire Loop Animation - Corrected Path */}
            <motion.div
                className="absolute right-0 top-1/3 origin-right"
                initial={{ rotate: -10, x: 100 }}
                animate={{
                    x: [100, -60, -60, 100], // Move LEFT to center (negative x)
                    y: [0, 40, 40, 0], // Dip vertical
                    rotate: [-10, -2, -2, -10] // Level out
                }}
                transition={{ duration: 4, repeat: Infinity, times: [0, 0.3, 0.7, 1] }}
            >
                <div className="w-32 md:w-40 h-1 bg-gray-300 rounded-full relative shadow-lg bg-gradient-to-l from-gray-400 to-gray-200">
                    {/* Loop Handle */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-2 bg-gray-500 rounded-full cursor-grab" />
                    {/* Platinum Loop Tip */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[3px] border-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.8)] bg-white" />
                </div>
            </motion.div>
        </div>
    );
};

const PracticeVisual = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Stacked Cards */}
            <div className="relative w-40 h-52 md:w-48 md:h-64 perspective-1000">
                {/* Back Card */}
                <div className="absolute inset-0 bg-gray-800 rounded-2xl border border-gray-700 transform md:scale-95 translate-y-4 md:translate-y-6 opacity-60 shadow-xl flex flex-col items-center justify-center p-4">
                    <div className="w-12 h-12 rounded-full bg-gray-700/50 mb-4" />
                    <div className="w-20 h-2 bg-gray-700/50 rounded mb-2" />
                    <div className="w-16 h-2 bg-gray-700/50 rounded" />
                </div>

                {/* Middle Card */}
                <div className="absolute inset-0 bg-gray-800 rounded-2xl border border-gray-700 transform md:scale-95 translate-y-2 md:translate-y-3 opacity-80 shadow-xl flex flex-col items-center justify-center p-4">
                    <HelpCircle size={32} className="text-gray-600 mb-4" />
                    <div className="w-24 h-2 bg-gray-700 rounded mb-2" />
                    <div className="w-20 h-2 bg-gray-700 rounded" />
                </div>

                {/* Top Card - Animating */}
                <motion.div
                    animate={{
                        x: [0, 200, 200, 0], // Slide out right further
                        opacity: [1, 0, 0, 1], // Fade
                        rotate: [0, 20, 0, 0],
                        scale: [1, 0.9, 0.8, 1] // Reset behind
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.35, 0.65, 1]
                    }}
                    className="absolute inset-0 bg-gray-900 rounded-2xl border border-amber-500/30 shadow-2xl flex flex-col items-center justify-center p-6"
                >
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="text-center w-full">
                        <div className="h-2 w-3/4 bg-gray-700 rounded mb-2 mx-auto" />
                        <div className="h-2 w-1/2 bg-gray-700 rounded mb-6 mx-auto" />

                        <div className="grid grid-cols-2 gap-3 w-full px-2">
                            <div className="h-8 rounded-lg bg-gray-800 border border-gray-700" />
                            <div className="h-8 rounded-lg bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ delay: 0.5, duration: 0.3 }}
                                    className="w-2 h-2 rounded-full bg-green-400"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Success Floater */}
            <motion.div
                animate={{
                    y: [10, -60],
                    x: [0, 20],
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.1, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: 0.3, // Sync with card swipe
                    times: [0, 0.4, 1]
                }}
                className="absolute top-1/4 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-emerald-400/50 flex items-center gap-1"
            >
                <span>+10 XP</span>
            </motion.div>
        </div>
    );
};


export default function SaltAnalysisHero() {
    const [showVideo, setShowVideo] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            title: "Choose Your Mode",
            description: "Go to 'Choose Your Path' to start. Learning Mode has hints to help you. Practice Mode has no hints. Exam Mode has a timer.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20",
            Visual: ModeSelectionVisual
        },
        {
            title: "Revise with Simulators",
            description: "Scroll down to use the simulators. You will find them in this order: Anion Analysis, Dry & Flame Tests, and finally Cation Analysis.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            Visual: SimulatorsVisual
        },
        {
            title: "Question Practice",
            description: "Ready to test yourself? Try the Question Practice section to answer viva-style questions and check your knowledge.",
            color: "text-orange-400",
            bg: "bg-orange-500/10",
            border: "border-orange-500/20",
            Visual: PracticeVisual
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const scrollToModes = () => {
        document.getElementById('mode-selection')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden flex flex-col">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/salt-analysis-hero.webp"
                    alt="Salt Analysis Hero Background"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                {/* Molecular Overlay pattern */}
                <div className="absolute inset-0 z-0 opacity-30 mix-blend-soft-light">
                    <Image
                        src="/molecular_bg.webp"
                        alt="Molecular Pattern"
                        fill
                        className="object-cover animate-pulse-slow"
                    />
                </div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

            {/* Content - Using relative to permit auto-growth with content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center pt-20 pb-16 md:pt-28 md:pb-24 h-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-6 backdrop-blur-md">
                        <GraduationCap size={20} className="text-cyan-400" />
                        <span className="text-cyan-300 font-medium">Revise for CBSE/JEE/NEET</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Salt Analysis</span> Like a Pro
                    </h1>

                    <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl mx-auto">
                        Your 24/7 Virtual Lab with colourful simulators, revision guides, and NCERT-aligned procedures. Practice systematic analysis of Cations and Anions with instant feedback and viva questions.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <FeatureBadge icon={Target} text="Step-by-Step Guide" />
                        <FeatureBadge icon={Video} text="Real Lab Simulation" />
                        <FeatureBadge icon={GraduationCap} text="Viva Preparation" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={scrollToModes}
                            className="group flex items-center justify-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <span className="text-base md:text-lg">Start Practicing</span>
                            <ChevronDown className="group-hover:translate-y-1 transition-transform stroke-[2.5px]" size={18} />
                        </button>

                        <button
                            onClick={() => setShowVideo(true)}
                            className="group flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 backdrop-blur-md transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            <Play size={18} className="fill-current text-gray-300 group-hover:text-white transition-colors" />
                            <span className="text-base md:text-lg">How it Works</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Feature Slideshow Modal - Redesigned */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setShowVideo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-5xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col md:flex-row max-h-[90vh] md:max-h-[600px] md:h-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setShowVideo(false)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-md border border-white/10"
                            >
                                <X size={20} />
                            </button>

                            {/* Image/Visual Side (Top on mobile, Left on desktop) */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto bg-gray-800 relative overflow-hidden group shrink-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />

                                {/* Animated Background Glow */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-64 md:h-64 rounded-full blur-[80px] opacity-60 transition-colors duration-500 ${slides[currentSlide].color.replace('text-', 'bg-')}/30`} />

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute inset-0 flex items-center justify-center z-10 p-6"
                                    >
                                        {/* Render Custom Visual */}
                                        {(() => {
                                            const VisualComponent = slides[currentSlide].Visual;
                                            return <VisualComponent />;
                                        })()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Content Side (Bottom on mobile, Right on desktop) */}
                            <div className="w-full md:w-7/12 p-6 md:p-12 flex flex-col justify-center bg-gray-900/50 relative overflow-y-auto">
                                <div className="mb-2">
                                    <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-gray-800 border border-gray-700 ${slides[currentSlide].color}`}>
                                        Step {currentSlide + 1} of {slides.length}
                                    </span>
                                </div>

                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                                            {slides[currentSlide].title}
                                        </h3>
                                        <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 md:mb-12">
                                            {slides[currentSlide].description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Controls */}
                                <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-800">
                                    <div className="flex gap-2">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentSlide(index)}
                                                className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'w-6 md:w-8 bg-cyan-500' : 'w-1.5 md:w-2 bg-gray-700 hover:bg-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex-1" />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={prevSlide}
                                            className="p-3 md:p-4 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-white transition-all active:scale-95 border border-gray-800 hover:border-gray-700"
                                        >
                                            <ChevronDown className="rotate-90" size={20} />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="p-3 md:p-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                                        >
                                            <ChevronDown className="-rotate-90" size={20} />
                                        </button>
                                    </div>
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
