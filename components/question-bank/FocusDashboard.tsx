'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Play, Filter, BookOpen, CheckCircle2, X, Sparkles, Target, Zap, Atom, Brain, HelpCircle, Calculator, List, Info, Clock, Bookmark, FileText, LayoutGrid, Sun, Quote, Lightbulb, ChevronDown, Diamond, Layers, Rocket, Settings, Orbit, Crosshair, Hexagon, ShieldAlert, Cpu } from 'lucide-react';
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
    // RENDER HELPER
    // -------------------------------------------------------------------------
    const renderConfigPanel = () => (
        <div className="space-y-6 md:space-y-8 text-gray-300">
            <div className="space-y-2 md:space-y-3">
                <label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2 cursor-help"><Target size={14} className="text-indigo-400" /> Target Scope</label>
                {selectedItems.length > 0 ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-4 md:p-5 relative group overflow-hidden backdrop-blur-md shadow-lg shadow-indigo-900/20">
                        <div className="absolute inset-0 bg-indigo-500/5 group-hover:bg-indigo-500/10 transition-colors" />
                        <div className="flex justify-between items-start mb-3 relative z-10"><div><span className="text-4xl font-black text-white block leading-none tracking-tight drop-shadow-md">{selectedItems.length}</span><span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider mt-1 block opacity-90">Active Modules</span></div><div className="h-9 w-9 rounded-full bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.3)]"><BookOpen size={16} /></div></div>
                        <div className="flex flex-wrap gap-1.5 relative z-10">
                            {selectedItems.slice(0, 3).map(i => (<span key={i} className="text-[10px] bg-black/50 text-indigo-100 px-2.5 py-1 rounded border border-indigo-500/30 truncate max-w-[120px] font-medium shadow-sm">{i}</span>))}
                            {selectedItems.length > 3 && <span className="text-[10px] text-indigo-400 px-1 self-center font-bold">+ {selectedItems.length - 3}</span>}
                        </div>
                    </motion.div>
                ) : (
                    <div className="border border-dashed border-gray-700 bg-gray-900/20 rounded-xl p-5 md:p-6 text-center group hover:border-gray-500 transition-colors backdrop-blur-sm cursor-pointer"><p className="text-xs text-gray-500 font-bold group-hover:text-gray-400 tracking-wide">Select chapters to initialize system.</p></div>
                )}
            </div>

            <div className="space-y-2 md:space-y-3">
                <label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2"><Diamond size={14} className="text-purple-400" /> Curation Priority</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-black/20 rounded-xl border border-white/5">
                    {[
                        { id: 'standard', label: 'Standard', tooltip: 'All Questions', icon: Layers },
                        { id: 'high-yield', label: 'Top 50 PYQ', tooltip: 'Top 50 PYQs per chapter', icon: Sparkles }
                    ].map(opt => {
                        const Icon = opt.icon;
                        const isActive = selectionTier === opt.id;
                        return (
                            <motion.button
                                key={opt.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectionTier(opt.id as any)}
                                title={opt.tooltip}
                                className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isActive ? 'bg-purple-900/40 border-purple-500/50 text-white shadow-lg' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'}`}
                            >
                                <div className={`p-1.5 rounded-md ${isActive ? 'bg-purple-500 text-white' : 'bg-gray-800'}`}>
                                    <Icon size={14} />
                                </div>
                                <div className="text-left">
                                    <span className="block text-xs font-black uppercase tracking-wider">{opt.label}</span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2 md:space-y-3">
                <label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2"><Zap size={14} className="text-amber-400" /> Intensity</label>
                <div className="grid grid-cols-4 gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
                    {[{ id: 'Mix', label: 'Mix', active: 'bg-indigo-700 border-indigo-500' }, { id: 'Easy', label: 'Easy', active: 'bg-emerald-700 border-emerald-500' }, { id: 'Medium', label: 'Medium', active: 'bg-amber-700 border-amber-500' }, { id: 'Hard', label: 'Hard', active: 'bg-red-700 border-red-500' }].map(opt => (
                        <motion.button key={opt.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setDifficulty(opt.id as any)} className={`py-2 md:py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-transparent ${difficulty === opt.id ? `${opt.active} text-white shadow-lg` : 'text-gray-500 hover:text-gray-200 hover:bg-white/10'}`}>{opt.label}</motion.button>
                    ))}
                </div>
            </div>
            <div className="space-y-2 md:space-y-2.5">
                <label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2"><HelpCircle size={14} className="text-emerald-400" /> Question Type</label>
                <div className="grid grid-cols-3 gap-1.5 p-1">
                    {[{ id: 'Mix', label: 'Mix', icon: Sparkles }, { id: 'MCQ', label: 'MCQ', icon: CheckCircle2 }, { id: 'Numerical', label: 'Integer', icon: Calculator }, { id: 'Statement', label: 'Stmt', icon: List }, { id: 'Assertion', label: 'A/R', icon: Brain }].map(type => {
                        const Icon = type.icon;
                        const isActive = questionType === type.id;
                        return (
                            <motion.button key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setQuestionType(type.id as any)} className={`relative h-8 md:h-9 rounded-md text-xs font-black uppercase tracking-wider transition-all cursor-pointer border flex items-center justify-center gap-1.5 ${isActive ? 'bg-emerald-700 border-emerald-600 text-white shadow-md z-10' : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10 hover:text-gray-300'} ${type.id === 'Assertion' ? 'col-span-1' : ''}`}>
                                <Icon size={14} strokeWidth={2.5} className={isActive ? 'drop-shadow-sm' : 'opacity-70'} /><span>{type.label}</span>
                            </motion.button>
                        )
                    })}
                </div>
            </div>
            <div className="space-y-2 md:space-y-3">
                <div className="flex items-center justify-between"><label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2"><Atom size={14} className="text-cyan-400" /> Quantity</label><div className={`px-2.5 py-0.5 rounded border text-sm font-black tracking-wider transition-colors duration-300 ${questionCount > 50 ? 'bg-cyan-500 text-black border-cyan-400 animate-pulse' : 'bg-cyan-900/30 border-cyan-500/30 text-cyan-300'}`}>{questionCount > 50 ? 'MAX' : questionCount}</div></div>
                <div className="relative pt-6 pb-2 px-1 group h-20">
                    <input type="range" min="5" max="55" step="5" value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all focus:outline-none relative z-20" style={{ background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((questionCount - 5) / 50) * 100}%, #374151 ${((questionCount - 5) / 50) * 100}%, #374151 100%)` }} />
                    <div className="absolute top-12 left-0 w-full h-4 z-10 text-xs font-bold text-gray-400 group-hover:text-gray-300 select-none uppercase tracking-wider transition-colors pointer-events-none">
                        <span className="absolute left-0 -translate-x-0">5</span>
                        <span className="absolute left-1/2 -translate-x-1/2">30</span>
                        {/* FIX: Moved 50 to left-[85%] to prevent overlap with Max */}
                        <span className="absolute left-[85%] -translate-x-1/2">50</span>
                        <span className={`absolute right-0 translate-x-0 ${questionCount > 50 ? 'text-cyan-400' : ''}`}>Max</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2 md:space-y-3">
                <label className="text-xs font-black text-gray-300 uppercase tracking-[0.15em] flex items-center gap-2"><Brain size={14} className="text-pink-400" /> Simulation Mode</label>
                <div className="grid grid-cols-2 gap-3">{['practice', 'exam'].map(mode => (<motion.button key={mode} whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }} onClick={() => setTimerMode(mode as any)} className={`group py-3 px-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md shadow-lg flex items-center justify-center gap-3 ${timerMode === mode ? (mode === 'practice' ? 'bg-indigo-700 border-indigo-600 text-white' : 'bg-violet-700 border-violet-600 text-white') : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>{mode === 'practice' ? <BookOpen size={18} /> : <Clock size={18} />}<span className="text-xs font-black uppercase tracking-wider relative z-10">{mode === 'practice' ? 'Practice' : 'Exam Mode'}</span></motion.button>))}</div>
            </div>
            <div className="pt-4 md:pt-6">
                <motion.button whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.4)" }} whileTap={{ scale: 0.98 }} onClick={handleStart} disabled={selectedItems.length === 0} className="w-full py-4 bg-gradient-to-r from-indigo-700 via-violet-700 to-purple-700 hover:from-indigo-600 hover:via-violet-600 hover:to-purple-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.25em] shadow-xl shadow-indigo-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-white/20 cursor-pointer group relative overflow-hidden backdrop-blur-xl">
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" /><Play size={18} fill="currentColor" className="group-hover:scale-110 transition-transform relative z-10 drop-shadow-md" /><span className="relative z-10 drop-shadow-md">Initialize</span>
                </motion.button>
                <div className="flex items-center justify-center gap-2 mt-3 md:mt-4 opacity-60"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /><p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">System Ready</p></div>
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
                    <div className="px-6 py-4 md:px-10 md:py-6 z-20 border-b border-gray-900/50 bg-[#080C10]/95 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 shrink-0">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-2 shrink-0 w-full md:w-auto items-center md:items-start text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 uppercase tracking-tighter leading-none select-none drop-shadow-sm filter contrast-125">Crucible</h1>
                            <div className="flex items-center gap-3"><div className="h-1 w-12 md:w-16 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.6)] animate-pulse"></div><h2 className="text-[10px] md:text-xs font-mono font-bold tracking-[0.4em] text-amber-500 uppercase drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Forge Your Rank</h2></div>
                        </motion.div>
                    </div>

                    <div className="hidden lg:flex px-6 md:px-10 pt-4 md:pt-6 pb-2 border-b border-gray-800/50 items-center justify-center md:justify-start gap-4 md:gap-6 overflow-x-auto custom-scrollbar cursor-pointer">
                        {[{ id: 'chapter', label: 'Chapters', icon: LayoutGrid }, { id: 'pyq', label: 'Previous Papers', icon: FileText }, { id: 'saved', label: 'Saved', icon: Bookmark }].map(tab => {
                            const Icon = tab.icon;
                            const isActive = selectedTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => { setSelectedTab(tab.id as any); setSelectedItems([]); }} className={`relative pb-3 px-1 text-xs md:text-sm font-black uppercase tracking-widest transition-colors flex items-center gap-2 group shrink-0 cursor-pointer ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                                    <Icon size={14} strokeWidth={2.5} className={isActive ? 'text-indigo-400' : 'opacity-60 group-hover:opacity-100'} />{tab.label}{isActive && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />}
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
                                        <div className="bg-gray-800/20 px-6 py-2 border-b border-gray-800 text-[10px] uppercase font-bold text-gray-500 tracking-widest hidden xl:block">Class 11</div>
                                        {/* Class 11 Vertical Split Container */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800/30 h-full divide-y md:divide-y-0 md:divide-x border-gray-800/50">
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
                                        <div className="bg-gray-800/20 px-6 py-2 border-b border-gray-800 text-[10px] uppercase font-bold text-gray-500 tracking-widest hidden xl:block">Class 12</div>
                                        {/* Class 12 Vertical Split Container */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800/30 h-full divide-y md:divide-y-0 md:divide-x border-gray-800/50">
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
                                <div className="mb-0 space-y-2 p-4">
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
                                                <div key={year} className="rounded-xl border border-gray-800/50 overflow-hidden bg-[#080C10]">
                                                    <button
                                                        onClick={() => setExpandedPYQYears(prev =>
                                                            prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]
                                                        )}
                                                        className="w-full flex items-center justify-between px-5 py-4 bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                                                                <ChevronDown size={18} className="text-indigo-400" />
                                                            </motion.div>
                                                            <span className="text-sm font-black text-white">JEE Main {year}</span>
                                                            <span className="text-[10px] text-gray-500 font-bold bg-gray-800 px-2 py-0.5 rounded-full">{shifts.length} shifts</span>
                                                            <span className="text-[10px] text-indigo-400 font-bold">{questionCount} Qs</span>
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
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-800/30">
                                                                    {shifts.map(shift => {
                                                                        const shiftQCount = initialQuestions.filter(q => q.examSource === shift).length;
                                                                        const isSelected = selectedItems.includes(shift);
                                                                        // Extract shift name (e.g., "Jan 21 Morning Shift" from "JEE Main 2026 - Jan 21 Morning Shift")
                                                                        const shiftName = shift.replace(/JEE Main \d{4}\s*-?\s*/, '').trim() || shift;
                                                                        return (
                                                                            <div
                                                                                key={shift}
                                                                                onClick={() => setSelectedItems([shift])}
                                                                                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border-b border-gray-800/30 ${isSelected ? 'bg-indigo-900/30 border-l-2 border-l-indigo-500' : 'bg-[#0A0E14] hover:bg-white/[0.02]'}`}
                                                                            >
                                                                                <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>{shiftName}</span>
                                                                                <span className="text-[10px] text-gray-500 font-mono">{shiftQCount} Qs</span>
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
                                            <img src="/arjuna_focus_v2.png" alt="Target" className="w-full h-full object-cover scale-110 opacity-90" />
                                        </div>

                                        {/* Content (Right - Balanced) */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-3">
                                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                                                <Target size={14} className="text-amber-500" />
                                                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Daily Strategy</span>
                                            </div>

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
                    <div className="h-28 border-b border-gray-800 flex items-center px-10 shrink-0 relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent"><div className="absolute top-0 right-0 p-24 bg-purple-600/5 blur-3xl rounded-full animate-pulse" /><div className="relative z-10"><h2 className="text-sm font-black text-gray-300 uppercase tracking-[0.25em] flex items-center gap-3 drop-shadow-md"><Filter size={16} className="text-indigo-400" />System Config</h2><p className="text-[11px] text-gray-500 font-bold mt-1.5 tracking-wide">Set mission parameters.</p></div></div>
                    <div className="flex-1 px-8 py-8 lg:p-10 overflow-y-auto custom-scrollbar">{renderConfigPanel()}</div>
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
                <AnimatePresence>
                    {showOnboarding && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#05070a]/80 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="relative w-full max-w-2xl bg-[#0B0F15] border border-indigo-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)]"
                            >
                                {/* Header */}
                                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-transparent">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-500 rounded-lg text-white shadow-lg shadow-indigo-500/20">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-black text-white uppercase tracking-tighter">Crucible Guide</h4>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">System Onboarding</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map(i => (
                                            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${onboardingSlide === i ? 'w-6 bg-indigo-500' : 'w-2 bg-gray-800'}`} />
                                        ))}
                                    </div>
                                </div>

                                {/* Slide Content */}
                                <div className="px-8 py-10 min-h-[380px] flex flex-col justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={onboardingSlide}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 1.02 }}
                                            className="space-y-8"
                                        >
                                            {onboardingSlide === 0 && (
                                                <div className="space-y-6 text-center">
                                                    <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                                                        <Orbit size={40} className="text-indigo-400 animate-[spin_10s_linear_infinite]" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">The Gold Standard of Practice</h2>
                                                        <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-lg mx-auto italic">"Crucible is an extreme-focus environment built to take your rank beyond the top 1% limit."</p>
                                                    </div>
                                                    <div className="inline-block p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-indigo-300 text-[10px] font-black uppercase tracking-widest">
                                                        Initialize your mission in 3 phases
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 1 && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 text-amber-500">
                                                        <Crosshair size={24} />
                                                        <h2 className="text-xl font-bold uppercase tracking-tight">1. Target & Priority</h2>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* UI Mirror: Priority */}
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Curation Tier</span>
                                                            <div className="flex gap-2">
                                                                <div className="flex-1 flex items-center gap-2 p-2 bg-purple-900/40 border border-purple-500/50 rounded-lg">
                                                                    <div className="p-1 bg-purple-500 rounded text-white"><Layers size={10} /></div>
                                                                    <span className="text-[9px] font-black text-white uppercase">Standard</span>
                                                                </div>
                                                                <div className="flex-1 flex items-center gap-2 p-2 bg-white/5 border border-transparent rounded-lg opacity-50">
                                                                    <div className="p-1 bg-gray-800 rounded text-gray-400"><Hexagon size={10} /></div>
                                                                    <span className="text-[9px] font-black text-gray-400 uppercase">Top 30</span>
                                                                </div>
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 leading-relaxed pt-1">Use **Top 30** for high-yield problems or **Standard** for full subject mastery.</p>
                                                        </div>

                                                        {/* UI Mirror: Scope */}
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Scope</span>
                                                            <div className="flex items-center gap-3 p-3 bg-indigo-900/20 border border-indigo-500/40 rounded-xl">
                                                                <div className="p-1.5 bg-indigo-500 rounded-lg text-white"><LayoutGrid size={14} /></div>
                                                                <span className="text-xs font-bold text-white uppercase tracking-tight">Chapters Selected</span>
                                                                <ChevronDown size={14} className="ml-auto text-indigo-400" />
                                                            </div>
                                                            <p className="text-[11px] text-gray-400 leading-relaxed">Switch between **Chapters**, **PYQs**, and **Saved** from the scope dropdown.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 2 && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 text-emerald-500">
                                                        <Cpu size={24} />
                                                        <h2 className="text-xl font-bold uppercase tracking-tight">2. Fine-Tune Parameters</h2>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {/* Intensity Mirror */}
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Intensity</span>
                                                                <span className="text-[9px] font-bold text-amber-500 uppercase">Mix Mode</span>
                                                            </div>
                                                            <div className="flex gap-1.5">
                                                                {['Mix', 'Easy', 'Med', 'Hard'].map((l, i) => (
                                                                    <div key={l} className={`flex-1 py-1.5 rounded-md text-center text-[8px] font-black uppercase border ${i === 0 ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-transparent text-gray-600'}`}>{l}</div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Quantity Mirror */}
                                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mission Depth</span>
                                                                <span className="text-xs font-black text-cyan-400">20</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-gray-800 rounded-full relative overflow-hidden">
                                                                <div className="absolute top-0 left-0 h-full w-[40%] bg-cyan-500" />
                                                            </div>
                                                            <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase">
                                                                <span>5</span>
                                                                <span>30</span>
                                                                <span>Max</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {onboardingSlide === 3 && (
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-3 text-indigo-500">
                                                        <Rocket size={24} />
                                                        <h2 className="text-xl font-bold uppercase tracking-tight">3. Strategic Deployment</h2>
                                                    </div>

                                                    <div className="bg-gradient-to-b from-indigo-500/10 to-transparent p-6 rounded-3xl border border-indigo-500/20 space-y-6">
                                                        <div className="flex gap-3">
                                                            <div className="flex-1 p-3 rounded-xl border border-indigo-500/40 bg-indigo-700 text-center space-y-1">
                                                                <span className="block text-[10px] font-black text-white uppercase">Practice</span>
                                                                <span className="block text-[8px] text-indigo-200 uppercase font-medium">Safe Mode</span>
                                                            </div>
                                                            <div className="flex-1 p-3 rounded-xl border border-white/5 bg-black/40 text-center opacity-50 space-y-1">
                                                                <span className="block text-[10px] font-black text-gray-400 uppercase">Exam</span>
                                                                <span className="block text-[8px] text-gray-600 uppercase font-medium">Pressure</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-400 leading-relaxed text-center px-4">
                                                            Use **Practice** for infinite learning with instant results, or **Exam Mode** for a high-stakes timed simulation.
                                                        </p>
                                                        <div className="pt-2">
                                                            <div className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl text-center text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-500/20">
                                                                Initialize Mission
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* Footer */}
                                <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between bg-black/40">
                                    <button
                                        onClick={() => setNeverShowOnboarding(!neverShowOnboarding)}
                                        className="flex items-center gap-2 group transition-colors"
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${neverShowOnboarding ? 'bg-indigo-500 border-indigo-500' : 'border-gray-700 group-hover:border-gray-500'}`}>
                                            {neverShowOnboarding && <div className="w-1.5 h-1.5 bg-white rounded-sm" />}
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-400">Don't show again</span>
                                    </button>

                                    <div className="flex gap-3">
                                        {onboardingSlide > 0 && (
                                            <button
                                                onClick={() => setOnboardingSlide(prev => prev - 1)}
                                                className="px-6 py-2.5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-white/5 active:scale-95 transition-all"
                                            > Back </button>
                                        )}
                                        <button
                                            onClick={() => onboardingSlide < 3 ? setOnboardingSlide(prev => prev + 1) : dismissOnboarding()}
                                            className="px-8 py-2.5 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 active:scale-95 transition-all"
                                        >
                                            {onboardingSlide < 3 ? 'Next' : 'Launch Crucible'}
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
