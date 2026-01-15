'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    GraduationCap, Stethoscope, BookOpen, Sparkles,
    Rocket, Brain, Zap, PlayCircle, FileText,
    ArrowRight, RotateCcw, CheckCircle2
} from 'lucide-react';

// Quiz questions and options
const QUESTIONS = [
    {
        id: 'exam',
        question: "What's your exam?",
        subtitle: "Select your target",
        options: [
            { id: 'jee', label: 'JEE', desc: 'Main + Advanced', icon: GraduationCap, color: 'blue' },
            { id: 'neet', label: 'NEET', desc: 'UG Medical', icon: Stethoscope, color: 'emerald' },
            { id: 'cbse', label: 'CBSE 12', desc: 'Board Exams', icon: BookOpen, color: 'purple' },
        ]
    },
    {
        id: 'stage',
        question: "Where are you in prep?",
        subtitle: "Be honest, we'll help you!",
        options: [
            { id: 'beginner', label: 'Just Starting', desc: 'Need basics', icon: Sparkles, color: 'amber' },
            { id: 'intermediate', label: 'Covered Basics', desc: 'Need practice', icon: Brain, color: 'cyan' },
            { id: 'advanced', label: 'Final Revision', desc: 'Exam is near!', icon: Zap, color: 'rose' },
        ]
    },
    {
        id: 'style',
        question: "How do you learn best?",
        subtitle: "Pick your superpower",
        options: [
            { id: 'video', label: 'Watch Videos', desc: 'Detailed lectures', icon: PlayCircle, color: 'violet' },
            { id: 'quick', label: 'Quick Content', desc: 'One-shots & shorts', icon: Rocket, color: 'orange' },
            { id: 'notes', label: 'Read & Practice', desc: 'Notes & flashcards', icon: FileText, color: 'teal' },
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
        if (stage === 'advanced') {
            recommendations.push({ title: 'NEET Crash Course', href: '/neet-crash-course', desc: 'Complete last-minute prep', primary: true });
        } else {
            recommendations.push({ title: 'Detailed Lectures', href: '/detailed-lectures', desc: 'Thorough understanding', primary: true });
        }
    } else { // CBSE
        recommendations.push({ title: 'NCERT Revision', href: '/cbse-12-ncert-revision', desc: 'Chapter-wise summaries', primary: true });
    }

    // Secondary recommendations based on learning style
    if (style === 'notes') {
        recommendations.push({ title: 'Flashcards', href: '/flashcards', desc: 'Quick recall practice' });
        recommendations.push({ title: 'Handwritten Notes', href: '/handwritten-notes', desc: 'By Paaras Sir' });
    } else if (style === 'quick') {
        recommendations.push({ title: '2 Minute Chemistry', href: '/2-minute-chemistry', desc: 'Quick concept videos' });
        recommendations.push({ title: 'One-Shot Lectures', href: '/one-shot-lectures', desc: 'Full chapter in 1 video' });
    } else {
        recommendations.push({ title: 'Detailed Lectures', href: '/detailed-lectures', desc: 'In-depth explanations' });
    }

    // Always recommend organic reactions for advanced students
    if (stage === 'advanced' || stage === 'intermediate') {
        recommendations.push({ title: 'Organic Reactions', href: '/organic-name-reactions', desc: 'Named reactions' });
    }

    // Remove duplicates and limit to 3
    const unique = recommendations.filter((rec, idx, self) =>
        idx === self.findIndex(r => r.href === rec.href)
    ).slice(0, 3);

    return unique;
};

// Color mapping for options
const colorClasses: Record<string, { bg: string; border: string; text: string; glow: string }> = {
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/50 hover:border-blue-400', text: 'text-blue-400', glow: 'hover:shadow-blue-500/20' },
    emerald: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50 hover:border-emerald-400', text: 'text-emerald-400', glow: 'hover:shadow-emerald-500/20' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/50 hover:border-purple-400', text: 'text-purple-400', glow: 'hover:shadow-purple-500/20' },
    amber: { bg: 'bg-amber-500/20', border: 'border-amber-500/50 hover:border-amber-400', text: 'text-amber-400', glow: 'hover:shadow-amber-500/20' },
    cyan: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/50 hover:border-cyan-400', text: 'text-cyan-400', glow: 'hover:shadow-cyan-500/20' },
    rose: { bg: 'bg-rose-500/20', border: 'border-rose-500/50 hover:border-rose-400', text: 'text-rose-400', glow: 'hover:shadow-rose-500/20' },
    violet: { bg: 'bg-violet-500/20', border: 'border-violet-500/50 hover:border-violet-400', text: 'text-violet-400', glow: 'hover:shadow-violet-500/20' },
    orange: { bg: 'bg-orange-500/20', border: 'border-orange-500/50 hover:border-orange-400', text: 'text-orange-400', glow: 'hover:shadow-orange-500/20' },
    teal: { bg: 'bg-teal-500/20', border: 'border-teal-500/50 hover:border-teal-400', text: 'text-teal-400', glow: 'hover:shadow-teal-500/20' },
};

export default function PathfinderQuiz() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (questionId: string, answerId: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answerId }));

        // Move to next question or show result
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
        <section className="py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-800 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-6"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        Find Your{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            Perfect Path
                        </span>
                    </h2>
                    <p className="text-slate-400 text-sm">Answer 3 quick questions</p>
                </motion.div>

                {/* Quiz Container */}
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Question {Math.min(currentStep + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>

                    {/* Question/Result Area */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-5 md:p-6 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {!showResult ? (
                                // Question View
                                <motion.div
                                    key={`question-${currentStep}`}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-5">
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                                            {QUESTIONS[currentStep].question}
                                        </h3>
                                        <p className="text-slate-400 text-sm">
                                            {QUESTIONS[currentStep].subtitle}
                                        </p>
                                    </div>

                                    {/* Options */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {QUESTIONS[currentStep].options.map((option) => {
                                            const colors = colorClasses[option.color];
                                            const isSelected = answers[QUESTIONS[currentStep].id] === option.id;

                                            return (
                                                <motion.button
                                                    key={option.id}
                                                    onClick={() => handleAnswer(QUESTIONS[currentStep].id, option.id)}
                                                    className={`relative p-4 rounded-xl border-2 transition-all ${colors.border} ${colors.glow} hover:shadow-lg ${isSelected ? colors.bg : 'bg-slate-800/50'}`}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                                                        <option.icon className={colors.text} size={22} />
                                                    </div>
                                                    <div className="font-bold text-white text-sm">{option.label}</div>
                                                    <div className="text-slate-400 text-xs">{option.desc}</div>

                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2">
                                                            <CheckCircle2 className="text-green-400" size={16} />
                                                        </div>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            ) : (
                                // Result View
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                    className="text-center"
                                >
                                    {/* Celebration */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                                        className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30"
                                    >
                                        <Sparkles className="text-white" size={32} />
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-white mb-1">
                                        Perfect! Here's your path 🎯
                                    </h3>
                                    <p className="text-slate-400 text-sm mb-5">
                                        Based on your answers, we recommend:
                                    </p>

                                    {/* Recommendations */}
                                    <div className="space-y-2 mb-5">
                                        {recommendations.map((rec, idx) => (
                                            <motion.div
                                                key={rec.href}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 + idx * 0.1 }}
                                            >
                                                <Link href={rec.href}>
                                                    <div className={`flex items-center justify-between p-3 rounded-xl border transition-all group ${rec.primary
                                                            ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/50 hover:border-cyan-400'
                                                            : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                                        }`}>
                                                        <div className="text-left">
                                                            <div className="font-semibold text-white text-sm flex items-center gap-2">
                                                                {rec.primary && <span className="text-xs bg-cyan-500 text-white px-1.5 py-0.5 rounded">TOP PICK</span>}
                                                                {rec.title}
                                                            </div>
                                                            <div className="text-slate-400 text-xs">{rec.desc}</div>
                                                        </div>
                                                        <ArrowRight className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" size={18} />
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Retake Button */}
                                    <button
                                        onClick={resetQuiz}
                                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
                                    >
                                        <RotateCcw size={14} />
                                        Take quiz again
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
