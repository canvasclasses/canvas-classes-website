'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Filter, BookOpen, CheckCircle2, X, Sparkles, Target, Zap, Atom, Brain, HelpCircle, Calculator, List, Info, Clock, Bookmark, FileText, LayoutGrid, Sun, Quote, Lightbulb, ChevronDown, Diamond, Layers, Rocket, Settings, Orbit, Crosshair, Hexagon, ShieldAlert, Cpu, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Question } from '@/app/the-crucible/types';
import { DAILY_QUOTES } from './quotes';

// STRICT USER-DEFINED LISTS (Display Names)
const CLASS_11_CHAPTERS = [
    "Basic Concepts of Chemistry (Mole Concept)",
    "Atomic Structure",
    "Periodic Properties",
    "Chemical Bonding",
    "Thermodynamics",
    "Chemical equilibrium",
    "Ionic Equilibrium",
    "Redox Reactions",
    "P Block (Group 13 & 14)",
    "General Organic Chemistry (GOC)",
    "Stereochemistry",
    "Hydrocarbons"
];

const CLASS_12_CHAPTERS = [
    "Solid State",
    "Solutions",
    "Electrochemistry",
    "Chemical Kinetics",
    "P Block - 12th",
    "D & F Block",
    "Coordination Compounds",
    "Haloalkanes and Haloarenes",
    "Alcohols, Phenols and Ethers",
    "Aldehydes & Ketones",
    "Carboxylic Acids & Derivatives",
    "Amines",
    "Biomolecules",
    "Salt Analysis"
];

// Mapping Table for Robust Fuzzy Search
const CHAPTER_MAPPINGS: Record<string, string[]> = {
    // Class 11
    "Basic Concepts of Chemistry (Mole Concept)": ["Basic Concepts", "Mole Concept"],
    "Atomic Structure": ["Atomic Structure"],
    "Periodic Properties": ["Periodic Properties", "Periodicity"],
    "Chemical Bonding": ["Chemical Bonding"],
    "Thermodynamics": ["Thermodynamics"],
    "Chemical equilibrium": ["Chemical Equilibrium", "Equilibrium"],
    "Ionic Equilibrium": ["Ionic Equilibrium"],
    "Redox Reactions": ["Redox"],
    "P Block (Group 13 & 14)": ["p-Block (Group 13-14)", "Group 13", "Group 14"],
    "General Organic Chemistry (GOC)": ["General Organic Chemistry", "GOC"],
    "Stereochemistry": ["Stereochemistry"],
    "Hydrocarbons": ["Hydrocarbons", "Alkanes", "Alkenes", "Alkynes", "Aromatic Compounds"],

    // Class 12
    "Solid State": ["Solid State"],
    "Solutions": ["Solutions"],
    "Electrochemistry": ["Electrochemistry"],
    "Chemical Kinetics": ["Chemical Kinetics", "Kinetics"],
    "P Block - 12th": ["p-Block (Group 15", "Group 15", "Group 16", "Group 17", "Group 18"], // Catch-all for remaining P-Block
    "D & F Block": ["d and f Block", "D & F Block"],
    "Coordination Compounds": ["Coordination Compounds"],
    "Haloalkanes and Haloarenes": ["Haloalkanes", "Haloarenes"],
    "Alcohols, Phenols and Ethers": ["Alcohols", "Phenols", "Ethers"],
    "Aldehydes & Ketones": ["Aldehydes", "Ketones"],
    "Carboxylic Acids & Derivatives": ["Carboxylic Acids"],
    "Amines": ["Amines"],
    "Biomolecules": ["Biomolecules"],
    "Salt Analysis": ["Salt Analysis"]
};


interface FocusDashboardProps {
    initialQuestions: Question[];
    onStart: (config: any) => void;
}

export default function FocusDashboard({ initialQuestions, onStart }: FocusDashboardProps) {
    // -------------------------------------------------------------------------
    // STATE
    // -------------------------------------------------------------------------
    const [selectedTab, setSelectedTab] = useState<'chapter' | 'pyq' | 'saved'>('chapter');
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // Set of Display Names

    // Config
    const [questionCount, setQuestionCount] = useState<number>(20);
    const [difficulty, setDifficulty] = useState<'Mix' | 'Easy' | 'Medium' | 'Hard'>('Mix');
    const [selectionTier, setSelectionTier] = useState<'standard' | 'high-yield'>('standard');
    const [timerMode, setTimerMode] = useState<'practice' | 'exam'>('practice');
    const [questionType, setQuestionType] = useState<'Mix' | 'MCQ' | 'Numerical' | 'Statement' | 'Assertion'>('Mix');
    const [showMobileConfig, setShowMobileConfig] = useState(false);
    const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false);
    const [expandedPYQYears, setExpandedPYQYears] = useState<string[]>(['2026']); // 2026 expanded by default
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [onboardingSlide, setOnboardingSlide] = useState(0);
    const [neverShowOnboarding, setNeverShowOnboarding] = useState(false);
    const [todaysQuote, setTodaysQuote] = useState(DAILY_QUOTES[0]);

    useEffect(() => {
        const isDismissed = localStorage.getItem('crucible_onboarding_dismissed');
        if (!isDismissed) {
            setShowOnboarding(true);
        }
    }, []);

    const dismissOnboarding = () => {
        if (neverShowOnboarding) {
            localStorage.setItem('crucible_onboarding_dismissed', 'true');
        }
        setShowOnboarding(false);
    };
    useEffect(() => {
        const dayIndex = (new Date().getDate() - 1) % 30;
        const safeIndex = dayIndex % DAILY_QUOTES.length;
        setTodaysQuote(DAILY_QUOTES[safeIndex]);
    }, []);

    // -------------------------------------------------------------------------
    // DATA MAPPING LOGIC
    // -------------------------------------------------------------------------
    // Returns: { "Display Name": [matching DB Chapter IDs] }
    const mappedChapterIds = useMemo(() => {
        const mapping: Record<string, Set<string>> = {};
        const availableChapters = Array.from(new Set(initialQuestions.map(q => q.chapterId).filter(Boolean) as string[]));

        // Helper to find matching DB chapters for a Display Name
        const findMatches = (displayName: string) => {
            const searchTerms = CHAPTER_MAPPINGS[displayName] || [displayName];
            const matches = new Set<string>();

            searchTerms.forEach(term => {
                availableChapters.forEach(dbChapter => {
                    if (dbChapter.toLowerCase().includes(term.toLowerCase())) {
                        matches.add(dbChapter);
                    }
                });
            });
            return matches;
        };

        [...CLASS_11_CHAPTERS, ...CLASS_12_CHAPTERS].forEach(displayName => {
            mapping[displayName] = findMatches(displayName);
        });

        return mapping;
    }, [initialQuestions]);

    // Check if a display chapter has any questions
    const getQuestionCountForChapter = (displayName: string) => {
        const ids = mappedChapterIds[displayName];
        if (!ids || ids.size === 0) return 0;
        return initialQuestions.filter(q => q.chapterId && ids.has(q.chapterId)).length;
    };

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------
    const toggleItem = (displayName: string) => {
        // Only toggle if it has questions (or allow selection even if 0? better disable if 0)
        // Actually user wants to see list. Selection requires questions to act.
        if (getQuestionCountForChapter(displayName) === 0) return;

        setSelectedItems(prev => prev.includes(displayName) ? prev.filter(i => i !== displayName) : [...prev, displayName]);
    };

    const handleStart = () => {
        if (selectedItems.length === 0) return;

        // Resolve selected Display Names back to actual DB Chapter IDs
        const resolvedChapterIds = new Set<string>();
        selectedItems.forEach(displayName => {
            const ids = mappedChapterIds[displayName];
            ids?.forEach(id => resolvedChapterIds.add(id));
        });

        onStart({
            mode: timerMode,
            questionCount: questionCount > 50 ? 'Max' : questionCount,
            difficulty,
            selectedScope: Array.from(resolvedChapterIds), // Pass actual IDs
            filterType: selectedTab,
            questionType,
            selectionTier,
        });
    };

    // -------------------------------------------------------------------------
    // RENDER HELPER: CONFIG PANEL (Professional Redesign)
    // -------------------------------------------------------------------------
    const renderConfigPanel = () => (
        <div className="space-y-5 text-gray-300">
            {/* Target Scope */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Target size={16} className="text-indigo-500" />
                    Target Scope
                </label>
                {selectedItems.length > 0 ? (
                    <div className="bg-gray-900 border border-indigo-500/30 rounded-xl p-5 relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-3 relative z-10">
                            <div>
                                <span className="text-3xl font-bold text-white block leading-none">{selectedItems.length}</span>
                                <span className="text-sm text-indigo-400 font-medium px-0.5">Active Modules</span>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                <BookOpen size={20} />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 relative z-10">
                            {selectedItems.slice(0, 3).map(i => (
                                <span key={i} className="text-xs font-medium bg-black/40 text-gray-300 px-2 py-1 rounded border border-gray-700 truncate max-w-[120px]">
                                    {i}
                                </span>
                            ))}
                            {selectedItems.length > 3 && (
                                <span className="text-xs text-gray-500 font-medium self-center pl-1">
                                    + {selectedItems.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="border border-dashed border-gray-800 bg-gray-900/50 rounded-xl p-6 text-center text-gray-500 hover:border-gray-600 transition-colors cursor-pointer">
                        <p className="text-sm font-medium">Select chapters to begin.</p>
                    </div>
                )}
            </div>

            {/* Curation Priority */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Diamond size={16} className="text-purple-500" />
                    Curation Priority
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'standard', label: 'Standard', desc: 'Full Mastery', icon: Layers },
                        { id: 'high-yield', label: 'Top 50 PYQ', desc: 'Rapid Review', icon: Sparkles }
                    ].map(opt => {
                        const Icon = opt.icon;
                        const isActive = selectionTier === opt.id;
                        return (
                            <button
                                key={opt.id}
                                onClick={() => setSelectionTier(opt.id as any)}
                                className={`flex flex-col gap-1 p-3 rounded-lg border text-left transition-all ${isActive ? 'bg-purple-900/20 border-purple-500/50' : 'bg-gray-900 border-gray-800 hover:border-gray-600'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <Icon size={16} className={isActive ? 'text-purple-400' : 'text-gray-500'} />
                                    {isActive && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                                </div>
                                <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{opt.label}</span>
                                <span className="text-xs text-gray-500">{opt.desc}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Intensity */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    Intensity
                </label>
                <div className="grid grid-cols-4 gap-2 p-1 bg-gray-900 rounded-lg border border-gray-800">
                    {[{ id: 'Mix', label: 'Mix' }, { id: 'Easy', label: 'Easy' }, { id: 'Medium', label: 'Med' }, { id: 'Hard', label: 'Hard' }].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setDifficulty(opt.id as any)}
                            className={`py-2 rounded-md text-xs font-semibold transition-all ${difficulty === opt.id ? 'bg-gray-800 text-white shadow-sm border border-gray-700' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <HelpCircle size={16} className="text-emerald-500" />
                    Question Type
                </label>
                <div className="flex flex-wrap gap-2">
                    {[{ id: 'Mix', label: 'Mix' }, { id: 'MCQ', label: 'MCQ' }, { id: 'Numerical', label: 'Numeric' }, { id: 'Statement', label: 'Statement' }, { id: 'Assertion', label: 'A/R' }].map(type => {
                        const isActive = questionType === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setQuestionType(type.id as any)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${isActive ? 'bg-emerald-900/20 border-emerald-500/50 text-emerald-100' : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'}`}
                            >
                                {type.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Atom size={16} className="text-cyan-500" />
                        Quantity
                    </label>
                    <span className="text-lg font-bold text-white font-mono">
                        {questionCount > 50 ? 'MAX' : questionCount}
                    </span>
                </div>
                <input
                    type="range"
                    min="5"
                    max="55"
                    step="5"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                />
                <div className="flex justify-between text-xs text-gray-600 font-medium px-1">
                    <span>5</span>
                    <span>30</span>
                    <span>Max</span>
                </div>
            </div>

            {/* Mode */}
            <div className="space-y-2 pb-3 border-b border-gray-800">
                <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <Brain size={16} className="text-pink-500" />
                    Simulation Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {['practice', 'exam'].map(mode => (
                        <button
                            key={mode}
                            onClick={() => setTimerMode(mode as any)}
                            className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-center gap-2 ${timerMode === mode ? (mode === 'practice' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-red-600 border-red-500 text-white') : 'bg-gray-900 border-gray-800 text-gray-500 hover:bg-gray-800'}`}
                        >
                            {mode === 'practice' ? <BookOpen size={16} /> : <Clock size={16} />}
                            <span className="text-sm font-bold capitalize">{mode}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
                <button
                    onClick={handleStart}
                    disabled={selectedItems.length === 0}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black rounded-xl font-black text-sm uppercase tracking-wide shadow-xl shadow-orange-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-700 disabled:to-gray-600 disabled:shadow-none flex items-center justify-center gap-2"
                >
                    <Play size={18} fill="currentColor" />
                    {selectedItems.length === 0 ? 'Select Chapters to Begin' : 'Begin Session'}
                </button>
            </div>
        </div>
    );

    // Grid Item Renderer
    const renderGridItem = (displayName: string) => {
        const isSelected = selectedItems.includes(displayName);
        const count = getQuestionCountForChapter(displayName);
        const isDisabled = count === 0;

        return (
            <div key={displayName} onClick={() => !isDisabled && toggleItem(displayName)} className={`group relative flex items-center gap-4 px-6 py-2.5 md:py-4 transition-colors duration-150 select-none border-b border-r border-gray-800/50 bg-[#080C10] ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${isSelected ? 'bg-indigo-900/10' : (!isDisabled && 'hover:bg-white/[0.02]')}`}>
                <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all duration-200 ${isSelected ? 'bg-indigo-500 border-indigo-500 shadow-sm' : 'border-gray-600 bg-transparent group-hover:border-gray-400'}`}>{isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}</div>
                <div className="flex-1 min-w-0">
                    <span className={`text-sm font-bold leading-tight block truncate transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>{displayName}</span>
                    {isDisabled && <span className="text-[9px] text-red-500 font-bold uppercase tracking-wide mt-0.5 block">No Questions Found</span>}
                </div>
                <div className={`absolute right-0 top-0 bottom-0 w-1 bg-indigo-500 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
            </div>
        );
    };


    return (
        <div className="min-h-screen md:h-screen bg-[#050505] text-gray-300 font-sans selection:bg-indigo-500/30 flex justify-center overflow-x-hidden relative">
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0"><div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] mix-blend-screen" /><div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen" /></div>

            <div className="w-full max-w-[1700px] flex flex-col md:flex-row h-auto md:h-screen overflow-visible md:overflow-hidden bg-[#080C10]/80 backdrop-blur-2xl shadow-2xl shadow-black border-x border-gray-900 relative z-10">
                <main className="flex-1 flex flex-col min-w-0 border-r border-gray-800 relative bg-transparent h-full md:h-auto overflow-visible md:overflow-hidden">
                    <div className="px-6 py-6 md:px-10 md:py-8 z-20 border-b border-gray-900/50 bg-[#0B0F15]/95 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10 shrink-0 relative overflow-visible">
                        {/* Glow Effect */}
                        <div className="absolute top-1/2 left-20 -translate-y-1/2 w-72 h-40 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />

                        <div className="flex flex-col gap-4 w-full md:w-auto z-10 relative">
                            {/* Home Navigation */}
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group w-fit"
                            >
                                <div className="p-1.5 rounded-lg bg-gray-800/50 group-hover:bg-gray-700/50 transition-colors">
                                    <ArrowLeft size={14} />
                                </div>
                                <span className="text-[10px] font-medium uppercase tracking-wide">Canvas Home</span>
                            </Link>
                            <div className="flex flex-col items-center md:items-start pl-1">
                                {/* CRUCIBLE Logo with Animated U */}
                                <h1 className="text-4xl md:text-[3rem] font-black tracking-tighter leading-none select-none filter contrast-125 flex items-baseline">
                                    <span style={{ background: 'linear-gradient(to top, #f97316 0%, #fb923c 30%, #fef3c7 60%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} className="drop-shadow-[0_2px_25px_rgba(251,146,60,0.4)]">
                                        CR
                                    </span>
                                    {/* Animated U - Crucible with rising light */}
                                    <span className="relative inline-block mx-[-2px]">
                                        <span style={{ background: 'linear-gradient(to top, #f97316 0%, #fb923c 30%, #fef3c7 60%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} className="relative z-10 drop-shadow-[0_2px_25px_rgba(251,146,60,0.4)]">
                                            U
                                        </span>
                                        {/* Inner glow - Lightning Blue rising animation */}
                                        <span
                                            className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
                                            style={{ clipPath: 'inset(25% 20% 20% 20% round 0 0 40% 40%)' }}
                                        >
                                            <span className="w-[50%] h-[60%] bg-gradient-to-t from-cyan-500 via-sky-400 to-white rounded-t-full opacity-80 blur-[3px] animate-crucible-glow" />
                                        </span>
                                        {/* Electric sparkles - cyan/blue */}
                                        <span className="absolute top-[30%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-sparkle shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                                        <span className="absolute top-[35%] left-[30%] w-1 h-1 bg-sky-300 rounded-full animate-sparkle-delay-1 shadow-[0_0_4px_rgba(125,211,252,0.8)]" />
                                        <span className="absolute top-[32%] left-[70%] w-1 h-1 bg-white rounded-full animate-sparkle-delay-2 shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                                    </span>
                                    <span style={{ background: 'linear-gradient(to top, #f97316 0%, #fb923c 30%, #fef3c7 60%, #ffffff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} className="drop-shadow-[0_2px_25px_rgba(251,146,60,0.4)]">
                                        CIBLE
                                    </span>
                                </h1>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
                                    <p className="text-[9px] font-bold text-orange-400/90 uppercase tracking-[0.35em]">
                                        Forge Your Rank
                                    </p>
                                    <div className="w-8 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />
                                </div>
                            </div>


                        </div>

                        <div className="flex items-center gap-3">
                            {/* Guide - Redesigned as inline info card */}
                            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 rounded-lg border border-indigo-500/30 backdrop-blur-sm">
                                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                    <HelpCircle size={12} className="text-indigo-400" />
                                </div>
                                <span className="text-[10px] text-gray-300">
                                    Select chapters → Configure session → <span className="text-indigo-400 font-semibold">Begin</span>
                                </span>
                            </div>

                            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-900/80 rounded-full border border-gray-800/50 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden lg:flex px-6 md:px-10 border-b border-gray-800 bg-[#0B0F15] items-center gap-8 overflow-x-auto custom-scrollbar">
                        {[{ id: 'chapter', label: 'Chapters', icon: LayoutGrid }, { id: 'pyq', label: 'Previous Papers', icon: FileText }, { id: 'saved', label: 'Saved', icon: Bookmark }].map(tab => {
                            const Icon = tab.icon;
                            const isActive = selectedTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setSelectedTab(tab.id as any); setSelectedItems([]); }}
                                    className={`relative py-4 text-sm font-medium flex items-center gap-2 transition-colors ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <Icon size={16} strokeWidth={2} className={isActive ? 'text-indigo-400' : 'opacity-60'} />
                                    {tab.label}
                                    {isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="lg:hidden px-6 py-4 border-b border-gray-800/30 relative">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsScopeDropdownOpen(!isScopeDropdownOpen)}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${isScopeDropdownOpen ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-gray-800/20 border-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${isScopeDropdownOpen ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                                    {selectedTab === 'chapter' ? <LayoutGrid size={18} /> :
                                        selectedTab === 'pyq' ? <FileText size={18} /> :
                                            <Bookmark size={18} />}
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] font-black uppercase tracking-widest text-gray-500">Active Mode</span>
                                    <span className={`text-sm font-bold ${isScopeDropdownOpen ? 'text-white' : 'text-gray-400'}`}>
                                        {selectedTab === 'chapter' ? 'Chapters' :
                                            selectedTab === 'pyq' ? 'Previous Papers' : 'Saved Questions'}
                                        {selectedItems.length > 0 && ` (${selectedItems.length})`}
                                    </span>
                                </div>
                            </div>
                            <motion.div animate={{ rotate: isScopeDropdownOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                <ChevronDown size={20} className={isScopeDropdownOpen ? 'text-indigo-400' : 'text-gray-500'} />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {isScopeDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-6 right-6 mt-2 bg-[#0B0F15] border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden"
                                >
                                    {[{ id: 'chapter', label: 'Chapters', icon: LayoutGrid, desc: 'Browse by subject' },
                                    { id: 'pyq', label: 'Previous Papers', icon: FileText, desc: 'JEE Main PYQs' },
                                    { id: 'saved', label: 'Saved', icon: Bookmark, desc: 'Your collection' }].map(tab => {
                                        const Icon = tab.icon;
                                        const isActive = selectedTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    setSelectedTab(tab.id as any);
                                                    setSelectedItems([]);
                                                    setIsScopeDropdownOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-4 px-5 py-4 transition-colors border-b last:border-0 border-gray-800/50 ${isActive ? 'bg-indigo-900/20' : 'hover:bg-white/[0.02]'}`}
                                            >
                                                <div className={`p-2 rounded-lg ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="text-left">
                                                    <span className={`block text-xs font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-gray-300'}`}>{tab.label}</span>
                                                    <span className="block text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{tab.desc}</span>
                                                </div>
                                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                                            </button>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 overflow-visible md:overflow-y-auto p-0 scroll-smooth custom-scrollbar bg-transparent pb-32 md:pb-0">
                        <div className="max-w-7xl mx-auto">
                            {/* STRICT LAYOUT: 4 Columns (2 for C11, 2 for C12) */}
                            {selectedTab === 'chapter' ? (
                                <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x border-gray-800 h-full">
                                    {/* Column Left (Class 11) */}
                                    <div className="bg-transparent flex flex-col h-full">
                                        <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:block">Class 11</div>
                                        {/* Class 11 Vertical Split Container */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-900/20 h-full divide-y md:divide-y-0 md:divide-x border-gray-800/50">
                                            {/* Left Sub-Column (1-6) */}
                                            <div className="flex flex-col">
                                                {CLASS_11_CHAPTERS.slice(0, 6).map(item => renderGridItem(item))}
                                            </div>
                                            {/* Right Sub-Column (7-12) */}
                                            <div className="flex flex-col border-l border-gray-800/50">
                                                {CLASS_11_CHAPTERS.slice(6, 12).map(item => renderGridItem(item))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column Right (Class 12) */}
                                    <div className="bg-transparent flex flex-col h-full">
                                        <div className="bg-gray-900/50 px-6 py-3 border-b border-gray-800 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:block">Class 12</div>
                                        {/* Class 12 Vertical Split Container */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-900/20 h-full divide-y md:divide-y-0 md:divide-x border-gray-800/50">
                                            <div className="flex flex-col">
                                                {CLASS_12_CHAPTERS.slice(0, 7).map(item => renderGridItem(item))}
                                            </div>
                                            <div className="flex flex-col border-l border-gray-800/50">
                                                {CLASS_12_CHAPTERS.slice(7, 14).map(item => renderGridItem(item))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedTab === 'pyq' ? (
                                <div className="mb-0 space-y-2 p-6 max-w-5xl mx-auto">
                                    {(() => {
                                        // Group exam sources by year
                                        const allSources = Array.from(new Set(initialQuestions.map(q => q.examSource).filter(Boolean) as string[]));
                                        const yearGroups: Record<string, string[]> = {};
                                        allSources.forEach(src => {
                                            const yearMatch = src.match(/(\d{4})/);
                                            const year = yearMatch ? yearMatch[1] : 'Other';
                                            if (!yearGroups[year]) yearGroups[year] = [];
                                            yearGroups[year].push(src);
                                        });
                                        // Sort years descending
                                        const sortedYears = Object.keys(yearGroups).sort((a, b) => b.localeCompare(a));

                                        return sortedYears.map(year => {
                                            const shifts = yearGroups[year].sort().reverse();
                                            const isExpanded = expandedPYQYears.includes(year);
                                            const questionCount = shifts.reduce((acc, src) => acc + initialQuestions.filter(q => q.examSource === src).length, 0);

                                            return (
                                                <div key={year} className="rounded-xl border border-gray-800 overflow-hidden bg-[#0F0F12]">
                                                    <button
                                                        onClick={() => setExpandedPYQYears(prev =>
                                                            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
                                                        )}
                                                        className="w-full flex items-center justify-between px-6 py-4 bg-gray-900/30 hover:bg-gray-800/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className={`p-1.5 rounded-lg ${isExpanded ? 'bg-indigo-900/30 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
                                                                <ChevronDown size={18} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                                            </div>
                                                            <span className="text-base font-bold text-white">JEE Main {year}</span>
                                                            <div className="flex gap-2">
                                                                <span className="text-xs text-gray-400 font-medium bg-gray-800 px-2.5 py-1 rounded-full">{shifts.length} shifts</span>
                                                                <span className="text-xs text-indigo-300 font-medium bg-indigo-900/20 px-2.5 py-1 rounded-full border border-indigo-500/20">{questionCount} Qs</span>
                                                            </div>
                                                        </div>
                                                    </button>
                                                    <AnimatePresence>
                                                        {isExpanded && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800/50">
                                                                    {shifts.map(shift => {
                                                                        const shiftQCount = initialQuestions.filter(q => q.examSource === shift).length;
                                                                        const isSelected = selectedItems.includes(shift);
                                                                        // Extract shift name
                                                                        const shiftName = shift.replace(/JEE Main \d{4}\s*-?\s*/, '').trim() || shift;
                                                                        return (
                                                                            <div
                                                                                key={shift}
                                                                                onClick={() => setSelectedItems([shift])}
                                                                                className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors border-b border-gray-800/30 ${isSelected ? 'bg-indigo-900/20 border-l-2 border-l-indigo-500' : 'bg-[#0F0F12] hover:bg-white/[0.02]'}`}
                                                                            >
                                                                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>{shiftName}</span>
                                                                                <span className="text-xs text-gray-600 font-mono group-hover:text-gray-500">{shiftQCount} Qs</span>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500">
                                    <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm font-bold">Saved questions will appear here</p>
                                </div>
                            )}
                        </div>

                        <div className="hidden md:flex px-6 py-6 md:px-10 md:py-8 border-t border-gray-800/50 mb-20 md:mb-0 justify-center">
                            <div className="w-full max-w-4xl">
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-[#0B0F15]/60 backdrop-blur-sm group hover:border-indigo-500/40 transition-colors">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative z-10 p-5 md:p-8 lg:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start text-center lg:text-left">
                                        {/* Graphic (Left - Compact) */}
                                        <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 lg:w-28 lg:h-28 relative rounded-full overflow-hidden border border-amber-500/20 shadow-lg shadow-amber-900/20 group-hover:scale-105 transition-transform duration-500">
                                            <div className="absolute inset-0 bg-amber-500/10 z-10 mix-blend-overlay" />
                                            <img src="/arjuna_focus_v2.png" alt="Target" className="w-full h-full object-cover scale-90 opacity-90" />
                                        </div>

                                        {/* Content (Right - Balanced) */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-3">
                                            {/* Sanskrit */}
                                            <h3 className="text-lg md:text-xl font-serif text-amber-50/95 leading-relaxed font-medium drop-shadow-md">
                                                {todaysQuote?.sanskrit || "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"}
                                            </h3>

                                            {/* Translation */}
                                            <p className="text-sm text-gray-400 italic font-serif leading-relaxed px-4 lg:px-0">
                                                "{todaysQuote?.translation || "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."}"
                                            </p>

                                            {/* Core Insight (Takeaway - Sentence Case, Compact) */}
                                            <div className="mt-2 pt-3 border-t border-white/5 flex items-start gap-2 justify-center lg:justify-start">
                                                <Sparkles size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                                                <p className="text-sm font-bold text-indigo-100 leading-tight">
                                                    {todaysQuote?.takeaway || "Focus on the study session today, not the Rank you want next year."}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="hidden md:flex w-[380px] lg:w-[440px] bg-[#0B0F15]/70 backdrop-blur-3xl border-l border-white/5 flex-col shrink-0 z-30 relative shadow-2xl">
                    <div className="h-16 border-b border-gray-800 flex items-center px-8 shrink-0 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"><div className="relative z-10 flex items-center gap-3"><div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"><Filter size={14} className="text-indigo-400" /></div><div><h2 className="text-xs font-black text-gray-300 uppercase tracking-[0.2em]">Session Config</h2><p className="text-[9px] text-gray-500 font-medium mt-0.5">Configure your practice session</p></div></div></div>
                    <div className="flex-1 px-6 py-5 lg:px-8 lg:py-6 overflow-y-auto custom-scrollbar">{renderConfigPanel()}</div>
                </aside>

                <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#080C10]/95 backdrop-blur-xl border-t border-gray-800 z-50 safe-area-bottom"><motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowMobileConfig(true)} className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-xl flex items-center justify-center gap-2"><Filter size={14} strokeWidth={3} />Configure Mission {selectedItems.length > 0 && `(${selectedItems.length})`}</motion.button></div>
                <AnimatePresence>
                    {showMobileConfig && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-end">
                            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-[#0B0F15] w-full max-h-[90vh] overflow-y-auto rounded-t-3xl border-t border-gray-700 shadow-2xl">
                                <div className="sticky top-0 bg-[#0B0F15]/90 backdrop-blur-sm p-6 border-b border-gray-800 flex items-center justify-between z-10"><div><h2 className="text-sm font-black uppercase tracking-widest text-white">Mission Config</h2><p className="text-[10px] text-gray-500 font-medium mt-0.5">Adjust parameters</p></div><button onClick={() => setShowMobileConfig(false)} className="p-2.5 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"><X size={18} /></button></div>
                                <div className="p-6 pb-32">{renderConfigPanel()}</div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- ONBOARDING MODAL (V9.27) --- */}
                {/* --- ONBOARDING MODAL (Professional Redesign) --- */}
                <AnimatePresence>
                    {showOnboarding && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="w-full max-w-3xl bg-[#0F0F12] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                            >
                                {/* Header */}
                                <div className="px-8 py-5 border-b border-gray-800 bg-[#0F0F12] flex items-center justify-between shrink-0">
                                    <h4 className="text-base font-semibold text-white tracking-wide">Crucible Guide</h4>
                                    <div className="flex gap-2">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingSlide === i ? 'w-8 bg-indigo-500' : 'w-2 bg-gray-800'}`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 md:p-12 overflow-y-auto">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={onboardingSlide}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                            className="h-full flex flex-col justify-center min-h-[300px]"
                                        >
                                            {onboardingSlide === 0 && (
                                                <div className="text-center space-y-6 max-w-lg mx-auto">
                                                    <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 text-indigo-400">
                                                        <Sparkles size={32} />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Crucible</h2>
                                                        <p className="text-gray-400 text-lg leading-relaxed">
                                                            A high-performance practice environment designed to optimize your rank through focused problem solving.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 1 && (
                                                <div className="space-y-8">
                                                    <div className="space-y-2">
                                                        <h2 className="text-2xl font-bold text-white">Target & Scope</h2>
                                                        <p className="text-gray-400">Define exactly what you want to practice.</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                                                            <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center text-indigo-400 mb-2">
                                                                <Target size={20} />
                                                            </div>
                                                            <h3 className="text-white font-medium">Select Scope</h3>
                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                Choose specific chapters, browse previous year papers, or review your saved questions.
                                                            </p>
                                                        </div>
                                                        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                                                            <div className="w-10 h-10 rounded-lg bg-pink-900/30 flex items-center justify-center text-pink-400 mb-2">
                                                                <Layers size={20} />
                                                            </div>
                                                            <h3 className="text-white font-medium">Curation Tier</h3>
                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                Use <strong>Standard</strong> for comprehensive coverage or <strong>Top 30</strong> for rapid high-yield revision.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 2 && (
                                                <div className="space-y-8">
                                                    <div className="space-y-2">
                                                        <h2 className="text-2xl font-bold text-white">Parameters</h2>
                                                        <p className="text-gray-400">Fine-tune the difficulty and depth of your session.</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                                                            <div className="w-10 h-10 rounded-lg bg-amber-900/30 flex items-center justify-center text-amber-400 mb-2">
                                                                <Zap size={20} />
                                                            </div>
                                                            <h3 className="text-white font-medium">Intensity</h3>
                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                <strong>Mix Mode</strong> is recommended for exposing widespread weaknesses. Use specific difficulties as needed.
                                                            </p>
                                                        </div>
                                                        <div className="p-6 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                                                            <div className="w-10 h-10 rounded-lg bg-cyan-900/30 flex items-center justify-center text-cyan-400 mb-2">
                                                                <Atom size={20} />
                                                            </div>
                                                            <h3 className="text-white font-medium">Quantity</h3>
                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                Short sprints (10-20 Qs) are often more effective than long marathons. Consistency is key.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 3 && (
                                                <div className="space-y-8">
                                                    <div className="space-y-2">
                                                        <h2 className="text-2xl font-bold text-white">Choose Mode</h2>
                                                        <p className="text-gray-400">Select your simulation environment.</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                        <button className="group text-left p-6 rounded-xl bg-indigo-900/10 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-indigo-900/20 transition-all">
                                                            <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-500/20">
                                                                <BookOpen size={20} />
                                                            </div>
                                                            <h3 className="text-white font-bold text-lg mb-2">Practice Mode</h3>
                                                            <p className="text-sm text-indigo-200/70 leading-relaxed">
                                                                Immediate feedback, infinite retries, and explanations. Best for learning concepts.
                                                            </p>
                                                        </button>
                                                        <button className="group text-left p-6 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-violet-500/30 hover:bg-violet-900/10 transition-all opacity-75 hover:opacity-100">
                                                            <div className="w-10 h-10 rounded-lg bg-violet-900/30 flex items-center justify-center text-violet-400 mb-4">
                                                                <Clock size={20} />
                                                            </div>
                                                            <h3 className="text-white font-bold text-lg mb-2">Exam Mode</h3>
                                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                                Timed environment with no hints. Simulates actual exam pressure.
                                                            </p>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="px-8 py-6 bg-gray-900/50 border-t border-gray-800 flex items-center justify-between shrink-0">
                                    <button
                                        onClick={() => setNeverShowOnboarding(!neverShowOnboarding)}
                                        className="flex items-center gap-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${neverShowOnboarding ? 'bg-indigo-500 border-indigo-500' : 'border-gray-600 bg-transparent'}`}>
                                            {neverShowOnboarding && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <span>Don't show again</span>
                                    </button>

                                    <div className="flex gap-4">
                                        {onboardingSlide > 0 && (
                                            <button
                                                onClick={() => setOnboardingSlide(prev => prev - 1)}
                                                className="px-6 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                Back
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onboardingSlide < 3 ? setOnboardingSlide(prev => prev + 1) : dismissOnboarding()}
                                            className="px-8 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
                                        >
                                            {onboardingSlide < 3 ? 'Next' : 'Get Started'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
