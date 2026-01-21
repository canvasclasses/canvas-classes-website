'use client';

import { motion } from 'framer-motion';
import { ChevronDown, GraduationCap, Target, Video } from 'lucide-react';

export default function SaltAnalysisHero() {
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

                    <button
                        onClick={scrollToModes}
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-1"
                    >
                        Start Practicing
                        <ChevronDown className="group-hover:translate-y-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
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
