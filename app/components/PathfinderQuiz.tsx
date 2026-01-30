'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    GraduationCap, Stethoscope, BookOpen, Sparkles,
    Rocket, Brain, Zap, PlayCircle, FileText,
    ArrowRight, RotateCcw, CheckCircle2,
    Compass
} from 'lucide-react';

// Quiz questions and options
const QUESTIONS = [
    {
        id: 'exam',
        question: "What's your target exam?",
        subtitle: "We'll tailor the content for your goal",
        options: [
            { id: 'jee', label: 'JEE Main & Adv', desc: 'Engineering', icon: GraduationCap, color: 'blue' },
            { id: 'neet', label: 'NEET UG', desc: 'Medical', icon: Stethoscope, color: 'emerald' },
            { id: 'cbse', label: 'CBSE Class 12', desc: 'Board Exams', icon: BookOpen, color: 'purple' },
        ]
    },
    {
        id: 'stage',
        question: "Current preparation level?",
        subtitle: "Be honest, we'll help you catch up!",
        options: [
            { id: 'beginner', label: 'Just Starting', desc: 'Need fundamentals', icon: Sparkles, color: 'amber' },
            { id: 'intermediate', label: 'Covered Basics', desc: 'Need practice', icon: Brain, color: 'cyan' },
            { id: 'advanced', label: 'Final Revision', desc: 'Exam ready', icon: Zap, color: 'rose' },
        ]
    },
    {
        id: 'style',
        question: "Preferred learning style?",
        subtitle: "How do you grasp concepts best?",
        options: [
            { id: 'video', label: 'Video Lectures', desc: 'Deep understanding', icon: PlayCircle, color: 'violet' },
            { id: 'quick', label: 'Quick Recap', desc: 'One-shots & shorts', icon: Rocket, color: 'orange' },
            { id: 'notes', label: 'Self Study', desc: 'Notes & flashcards', icon: FileText, color: 'teal' },
        ]
    }
];

// Recommendation logic based on answers
const getRecommendations = (answers: Record<string, string>) => {
    const { exam, stage, style } = answers;

    const recommendations: { title: string; href: string; desc: string; primary?: boolean }[] = [];

    // Primary recommendations based on exam + stage
    if (exam === 'jee') {
        if (stage === 'beginner') {
            recommendations.push({ title: 'Detailed Lectures', href: '/detailed-lectures', desc: 'Complete theory from scratch', primary: true });
        } else if (stage === 'intermediate') {
            recommendations.push({ title: 'Top 50 Concepts', href: '/top-50-concepts', desc: 'Master key concepts', primary: true });
        } else {
            recommendations.push({ title: 'One-Shot Lectures', href: '/one-shot-lectures', desc: 'Quick chapter revision', primary: true });
        }
    } else if (exam === 'neet') {
        recommendations.push({ title: 'NEET Crash Course', href: '/neet-crash-course', desc: 'Complete NEET Chemistry prep', primary: true });
        if (stage === 'beginner') {
            recommendations.push({ title: 'Detailed Lectures', href: '/detailed-lectures', desc: 'Build strong foundations' });
        }
    } else { // CBSE
        recommendations.push({ title: 'NCERT Revision', href: '/cbse-12-ncert-revision', desc: 'Chapter-wise summaries', primary: true });
    }

    // Secondary recommendations
    if (style === 'notes') {
        recommendations.push({ title: 'Flashcards', href: '/chemistry-flashcards', desc: 'Active recall practice' });
        recommendations.push({ title: 'Handwritten Notes', href: '/handwritten-notes', desc: 'Premium notes by Paaras Sir' });
    } else if (style === 'quick') {
        recommendations.push({ title: '2 Minute Chemistry', href: '/2-minute-chemistry', desc: 'Bite-sized concept videos' });
        recommendations.push({ title: 'One-Shot Lectures', href: '/one-shot-lectures', desc: 'Full chapter in 1 video' });
    } else {
        recommendations.push({ title: 'Detailed Lectures', href: '/detailed-lectures', desc: 'In-depth explanations' });
    }

    // Organic reactions for advanced/intermediate
    if (stage === 'advanced' || stage === 'intermediate') {
        recommendations.push({ title: 'Organic Reactions', href: '/organic-name-reactions', desc: 'Master named reactions' });
    }

    // Remove duplicates and limit
    const unique = recommendations.filter((rec, idx, self) =>
        idx === self.findIndex(r => r.href === rec.href)
    ).slice(0, 3);

    return unique;
};

// Refined Color mapping
const colorClasses: Record<string, { bg: string; border: string; text: string; shadow: string; gradient: string }> = {
    blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', shadow: 'shadow-blue-500/10', gradient: 'from-blue-500 to-indigo-600' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', shadow: 'shadow-emerald-500/10', gradient: 'from-emerald-500 to-teal-600' },
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', shadow: 'shadow-purple-500/10', gradient: 'from-purple-500 to-violet-600' },
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', shadow: 'shadow-amber-500/10', gradient: 'from-amber-500 to-orange-600' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', shadow: 'shadow-cyan-500/10', gradient: 'from-cyan-500 to-sky-600' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', shadow: 'shadow-rose-500/10', gradient: 'from-rose-500 to-pink-600' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', shadow: 'shadow-violet-500/10', gradient: 'from-violet-500 to-fuchsia-600' },
    orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', shadow: 'shadow-orange-500/10', gradient: 'from-orange-500 to-red-600' },
    teal: { bg: 'bg-teal-500/10', border: 'border-teal-500/30', text: 'text-teal-400', shadow: 'shadow-teal-500/10', gradient: 'from-teal-500 to-emerald-600' },
};

export default function PathfinderQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));

        if (currentStep < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentStep(prev => prev + 1), 300);
        } else {
            setTimeout(() => setShowResult(true), 300);
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setShowResult(false);
    };

    const recommendations = showResult ? getRecommendations(answers) : [];
    const progress = ((currentStep + (showResult ? 1 : 0)) / QUESTIONS.length) * 100;

    return (
        <section id="approach" className="py-24 bg-black relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-slate-900 via-black to-black opacity-80" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-6 backdrop-blur-sm"
                    >
                        <Compass className="w-4 h-4 text-cyan-400" />
                        <span>Not sure where to start?</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Perfect Approach</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg max-w-xl mx-auto"
                    >
                        Answer 3 quick questions to get a personalized study roadmap tailored to your exam and goals.
                    </motion.p>
                </div>

                {/* Quiz Card */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="relative bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-slate-800 p-8 md:p-12 shadow-2xl overflow-hidden">
                        {/* Progress Bar inside card */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {!showResult ? (
                                <motion.div
                                    key={`question-${currentStep}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                                        {QUESTIONS[currentStep].question}
                                    </h3>
                                    <p className="text-slate-400 text-center mb-10">
                                        {QUESTIONS[currentStep].subtitle}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {QUESTIONS[currentStep].options.map((option, idx) => {
                                            const colors = colorClasses[option.color];
                                            const isSelected = answers[QUESTIONS[currentStep].id] === option.id;

                                            return (
                                                <motion.button
                                                    key={option.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    onClick={() => handleAnswer(QUESTIONS[currentStep].id, option.id)}
                                                    className={`cursor-pointer group relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 ${isSelected
                                                        ? `bg-slate-800 border-${option.color}-500 ring-2 ring-${option.color}-500/20`
                                                        : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300 ${colors.bg} group-hover:scale-110`}>
                                                        <option.icon className={colors.text} size={28} />
                                                    </div>
                                                    <div className="text-lg font-semibold text-white mb-1">{option.label}</div>
                                                    <div className="text-slate-500 text-sm">{option.desc}</div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring' }}
                                        className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20"
                                    >
                                        <Sparkles className="text-white w-10 h-10" />
                                    </motion.div>

                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        Your Personalized Roadmap
                                    </h3>
                                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                                        Based on your goals, here are the best resources to maximize your score.
                                    </p>

                                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                                        {recommendations.map((rec, idx) => (
                                            <motion.div
                                                key={rec.href}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                            >
                                                <Link href={rec.href} className="block h-full">
                                                    <div className={`h-full p-6 rounded-2xl border text-left transition-all hover:-translate-y-1 ${rec.primary
                                                        ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10'
                                                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                                                        }`}>
                                                        {rec.primary && (
                                                            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20 uppercase tracking-wider">
                                                                Highly Recommended
                                                            </div>
                                                        )}
                                                        <div className="font-bold text-white text-lg mb-2">{rec.title}</div>
                                                        <p className="text-slate-400 text-sm mb-4">{rec.desc}</p>
                                                        <div className="flex items-center text-cyan-400 text-sm font-medium gap-1 group">
                                                            Start Now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={resetQuiz}
                                        className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2 mx-auto"
                                    >
                                        <RotateCcw size={14} /> Start Over
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
