'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RefreshCcw, ArrowRight, HelpCircle, Check, X, FlaskConical, Volume2, Play, Pause } from 'lucide-react';
import MoleculeViewer from './MoleculeViewer';
import ReagentCard from './ReagentCard';
import LevelSidebar from './LevelSidebar';
import gameData from '../../data/conversion_game_data.json';

// Types from JSON
export interface Level {
    id: string;
    chapter: string; // Added: Required for categorization
    title: string;
    description: string;
    start_smiles: string;
    target_smiles: string;
    start_svg?: string; // New: Hand-drawn SVG support
    target_svg?: string; // New: Hand-drawn SVG support
    audio_url?: string;  // New: Audio note support
    difficulty: string;
    explanation?: string;
    explanation_svg?: string; // New: Hand-drawn explanation
    steps: {
        step_order: number;
        reagent_id: string;
        reagent_display: string;
        molecule_interim_smiles?: string;
        molecule_interim_svg?: string; // New: Interim SVG support
        mechanism_hint: string;
    }[];
}

const OrganicWizardGame = () => {
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [placedReagents, setPlacedReagents] = useState<(string | null)[]>([]);
    const [availableReagents, setAvailableReagents] = useState<any[]>([]);
    const [showHint, setShowHint] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [draggedReagent, setDraggedReagent] = useState<any>(null);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);

    // Audio Player State
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentLevel: Level = gameData[currentLevelIndex] as Level;
    const totalSteps = currentLevel.steps.length;

    // Load Level
    useEffect(() => {
        // Reset state
        setPlacedReagents(new Array(totalSteps).fill(null));
        setIsCorrect(null);
        setShowHint(false);
        setShowExplanation(false);

        // Generate Reagent Deck (Correct + Distractors)
        const correctReagents = currentLevel.steps.map(s => ({
            id: s.reagent_id,
            display: s.reagent_display,
            isCorrect: true
        }));

        // Pick random distractors from other levels
        const allOtherReagents = gameData
            .flatMap(l => l.steps)
            .filter(s => !correctReagents.some(c => c.id === s.reagent_id))
            .map(s => ({ id: s.reagent_id, display: s.reagent_display, isCorrect: false }));

        const shuffledDistractors = allOtherReagents
            .sort(() => 0.5 - Math.random())
            .slice(0, 5); // Increased distractors for challenge

        const deck = [...correctReagents, ...shuffledDistractors]
            .sort(() => 0.5 - Math.random())
            .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

        setAvailableReagents(deck);
    }, [currentLevelIndex, totalSteps]);

    const handleDrop = (stepIndex: number, reagent: any) => {
        const newPlaced = [...placedReagents];
        newPlaced[stepIndex] = reagent.id;
        setPlacedReagents(newPlaced);
        setIsCorrect(null);
        setShowExplanation(false);
    };

    const checkAnswer = () => {
        let allCorrect = true;
        for (let i = 0; i < totalSteps; i++) {
            if (placedReagents[i] !== currentLevel.steps[i].reagent_id) {
                allCorrect = false;
                break;
            }
        }

        setIsCorrect(allCorrect);

        if (allCorrect) {
            setShowExplanation(true); // Show explanation on success
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ffffff', '#a8e6cf', '#ff8b94']
            });
            if (!completedLevels.includes(currentLevelIndex)) {
                setCompletedLevels(prev => [...prev, currentLevelIndex]);
            }
        }
    };

    const showSolution = () => {
        const correctIds = currentLevel.steps.map(s => s.reagent_id);
        setPlacedReagents(correctIds);
        setIsCorrect(true);
        setShowExplanation(true);
    };

    const nextLevel = () => {
        if (currentLevelIndex < gameData.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
        }
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row h-screen w-screen overflow-hidden bg-[#121212]">
            {/* Sidebar Navigation - Bottom on Mobile/Tablet, Left on Desktop */}
            <div className="w-full lg:w-80 h-[35%] lg:h-full flex-shrink-0 relative z-20 shadow-2xl border-t lg:border-t-0 lg:border-r border-[#333]">
                <LevelSidebar
                    levels={gameData as Level[]}
                    currentLevelIndex={currentLevelIndex}
                    completedLevels={completedLevels}
                    onSelectLevel={(idx) => setCurrentLevelIndex(idx)}
                />
            </div>

            {/* Main Game Area - Top on Mobile/Tablet, Right on Desktop */}
            <div className="flex-1 relative flex flex-col h-[65%] lg:h-full lg:min-w-0">
                {/* Background Texture & Grid */}
                <div
                    className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] -z-10" />

                {/* Header */}
                <header className="relative z-10 px-8 py-4 flex items-center justify-between border-b border-[#333] bg-[#1e1e1e] shadow-md">
                    <div className="flex items-center gap-6">
                        <a href="/" className="bg-[#2a2a2a] p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#333] transition-colors border-b-4 border-[#1a1a1a] active:border-b-0 active:translate-y-1" aria-label="Back to Home">
                            <ArrowRight className="rotate-180" size={20} />
                        </a>
                        <div>
                            <p className="text-teal-500 text-xs font-outfit font-bold tracking-widest uppercase mb-1">
                                {currentLevel.title}
                            </p>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-3 font-outfit">
                                {currentLevel.description}
                                <span className="px-2 py-1 rounded bg-[#2a2a2a] border border-[#333] text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                    {currentLevel.difficulty}
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="bg-amber-600 border-b-4 border-amber-800 text-white hover:bg-amber-500 active:border-b-0 active:translate-y-1 transition-all rounded-lg font-bold px-4 py-2 flex items-center gap-2 text-sm font-outfit"
                        >
                            <HelpCircle size={18} /> Hint
                        </button>
                        <button
                            onClick={showSolution}
                            className="bg-purple-600 border-b-4 border-purple-800 text-white hover:bg-purple-500 active:border-b-0 active:translate-y-1 transition-all rounded-lg font-bold px-4 py-2 flex items-center gap-2 text-sm font-outfit"
                        >
                            <FlaskConical size={18} /> Show Solution
                        </button>
                        {isCorrect && (
                            <button
                                onClick={nextLevel}
                                className="bg-blue-600 border-b-4 border-blue-800 text-white hover:bg-blue-500 active:border-b-0 active:translate-y-1 transition-all rounded-lg font-bold px-5 py-2 flex items-center gap-2 text-sm font-outfit shadow-lg shadow-blue-900/20"
                            >
                                Next Level <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </header>

                {/* Game Workspace */}
                <main className="flex-1 relative flex flex-col p-4 overflow-y-auto">

                    {/* Hint Overlay */}
                    <AnimatePresence>
                        {showHint && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#2a2a2a] border border-yellow-500/30 p-4 rounded-lg shadow-2xl max-w-lg text-center"
                            >
                                <div className="text-yellow-100/90 font-handwriting text-lg leading-relaxed">
                                    "{currentLevel.description}"
                                </div>
                                <div className="mt-2 text-xs text-slate-500 font-mono">
                                    Analyze the functional group transformation.
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Reaction Path Visualization - Horizontal Scroll on Small Screens */}
                    <div className="flex items-center justify-start gap-8 md:gap-12 overflow-x-auto pb-8 w-full px-8 custom-scrollbar flex-nowrap min-h-[280px]">

                        {/* Start Molecule Card */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-3 group">
                            <div className="flex items-center justify-center relative overflow-hidden transition-colors">
                                {/* Increased scale by 50% from original 200 */}
                                <MoleculeViewer smiles={currentLevel.start_smiles} svg={currentLevel.start_svg} width={300} height={240} />
                            </div>
                        </div>

                        {/* Step Slots */}
                        {Array.from({ length: totalSteps }).map((_, idx) => (
                            <React.Fragment key={idx}>
                                {/* Long Arrow */}
                                <div className="flex-shrink-0 text-white/40 relative flex items-center px-2">
                                    <div className="absolute inset-0 blur-sm bg-white/5 rounded-full" />
                                    <svg width="80" height="32" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-20 md:w-24">
                                        <path d="M4 12H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M48 4L56 12L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>

                                {/* Drop Zone */}
                                <div
                                    className={`
                                        flex-shrink-0 w-36 h-28 rounded-xl border-2 transition-all duration-300 relative
                                        flex flex-col items-center justify-center
                                        ${placedReagents[idx]
                                            ? isCorrect === true ? 'border-emerald-400/60 bg-emerald-500/10'
                                                : isCorrect === false ? 'border-red-400/60 bg-red-500/10'
                                                    : 'border-blue-400/60 bg-blue-500/10'
                                            : 'border-white/20 bg-white/[0.05] border-dashed hover:border-white/40 hover:bg-white/10'
                                        }
                                    `}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => draggedReagent && handleDrop(idx, draggedReagent)}
                                >
                                    {placedReagents[idx] ? (
                                        <div className="w-full h-full p-2 flex items-center justify-center text-center relative group/slot">
                                            {/* Tape effect */}
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/20 rotate-1 backdrop-blur-sm shadow-sm" />

                                            <div
                                                className="font-handwriting text-[#e0e0e0] text-lg font-bold leading-tight"
                                                dangerouslySetInnerHTML={{
                                                    __html: availableReagents.find(r => r.id === placedReagents[idx])?.display || '?'
                                                }}
                                            />
                                            {/* Only show delete if NOT correct (locked) */}
                                            {isCorrect !== true && (
                                                <button
                                                    onClick={() => {
                                                        const newPlaced = [...placedReagents];
                                                        newPlaced[idx] = null;
                                                        setPlacedReagents(newPlaced);
                                                        setIsCorrect(null);
                                                        setShowExplanation(false);
                                                    }}
                                                    className="absolute -top-2 -right-2 bg-[#2a2a2a] text-slate-400 hover:text-red-400 rounded-full p-1 opacity-0 group-hover/slot:opacity-100 transition-opacity shadow-lg border border-white/10"
                                                >
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center opacity-40 group-hover:opacity-60 transition-opacity">
                                            <span className="font-handwriting text-2xl block mb-1">Step {idx + 1}</span>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        ))}

                        {/* Long Arrow */}
                        <div className="flex-shrink-0 text-white/40 relative flex items-center px-1">
                            <div className="absolute inset-0 blur-sm bg-white/5 rounded-full" />
                            <svg width="80" height="32" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-20 md:w-24">
                                <path d="M4 12H56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M48 4L56 12L48 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Target Molecule Card */}
                        <div className="flex-shrink-0 flex flex-col items-center gap-3">
                            <div className="flex items-center justify-center relative overflow-hidden">
                                <MoleculeViewer smiles={currentLevel.target_smiles} svg={currentLevel.target_svg} width={300} height={240} />
                            </div>
                        </div>
                    </div>

                    {/* Audio Explanation Player */}
                    {currentLevel.audio_url && (
                        <div className="flex justify-center -mt-4 mb-4 relative z-30">
                            <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-amber-500/20 px-6 py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
                                <audio
                                    ref={audioRef}
                                    src={currentLevel.audio_url}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                />
                                <button
                                    onClick={() => {
                                        if (audioRef.current) {
                                            if (isPlaying) audioRef.current.pause();
                                            else audioRef.current.play();
                                        }
                                    }}
                                    className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-black hover:bg-amber-400 transition-colors shadow-lg"
                                >
                                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                </button>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest leading-none mb-1">Narrated Insight</span>
                                    <span className="text-xs text-slate-300 font-medium leading-none">Listen to the chemical transformation...</span>
                                </div>
                                <Volume2 size={16} className="text-amber-500/50 ml-2" />
                            </div>
                        </div>
                    )}

                    {/* Bottom Action Bar: Validation & Reagents */}
                    <div className="w-full max-w-7xl mt-auto mx-auto relative z-20 pb-8 px-6">

                        {/* Validation Status & Explanation Area */}
                        <div className="min-h-[80px] flex flex-col items-center justify-center mb-10 gap-4">
                            <AnimatePresence mode='wait'>
                                {isCorrect === true ? (
                                    <motion.div
                                        key="success"
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                                        className="flex flex-col items-center gap-3 w-full max-w-2xl"
                                    >
                                        <div className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-3 font-outfit border-b-4 border-emerald-800 shadow-lg">
                                            <div className="bg-white text-emerald-600 rounded-full p-0.5"><Check size={16} strokeWidth={3} /></div>
                                            <span>Synthesis Complete!</span>
                                        </div>

                                        {/* Explanation Card */}
                                        {showExplanation && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-[#2a2a2a] border-l-4 border-amber-500 p-6 rounded-r-xl shadow-xl w-full text-left"
                                            >
                                                <h3 className="text-amber-500 font-outfit text-xs uppercase tracking-widest font-bold mb-2">Mechanism Insight</h3>
                                                <p className="font-outfit text-lg text-slate-200 leading-relaxed font-medium">
                                                    {currentLevel.explanation || "Well done! You've correctly identified the reaction pathway."}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ) : isCorrect === false ? (
                                    <motion.div
                                        key="error"
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                                        className="bg-red-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-3 font-outfit border-b-4 border-red-800 shadow-lg"
                                    >
                                        <div className="bg-white text-red-600 rounded-full p-0.5"><X size={16} strokeWidth={3} /></div>
                                        <span>Incorrect Pathway. Check your reagents.</span>
                                    </motion.div>
                                ) : placedReagents.every(r => r !== null) ? (
                                    <motion.button
                                        key="run"
                                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                        onClick={checkAnswer}
                                        className="bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 text-white px-8 py-3 rounded-xl font-bold text-lg active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 group font-outfit shadow-lg shadow-emerald-900/40"
                                    >
                                        <FlaskConical className="text-white group-hover:rotate-12 transition-transform" size={24} />
                                        <span>Run Reaction</span>
                                    </motion.button>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="text-slate-500 font-mono text-xs opacity-50"
                                    >
                                        Drag reagents to complete the synthesis path...
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Reagent Deck */}
                        <div className="bg-[#1a1a1a] border border-[#333] border-b-0 p-6 md:p-10 rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] relative">
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                            {/* Reagent cards container - ensuring they spread out */}
                            <div className="flex flex-wrap justify-center gap-6 md:gap-8 w-full">
                                {availableReagents.map((reagent) => {
                                    const isUsed = placedReagents.includes(reagent.id);
                                    return (
                                        <div
                                            key={reagent.id}
                                            className={`transition-all duration-300 ${isUsed ? 'opacity-20 grayscale pointer-events-none scale-90' : 'hover:-translate-y-2'}`}
                                            onDragStart={() => setDraggedReagent(reagent)}
                                            draggable={!isUsed}
                                        >
                                            <div className="transform scale-100 origin-center">
                                                <ReagentCard
                                                    reagent={reagent}
                                                    isDraggable={!isUsed}
                                                    onClick={() => {
                                                        const firstEmpty = placedReagents.findIndex(r => r === null);
                                                        if (firstEmpty !== -1 && !isUsed) {
                                                            handleDrop(firstEmpty, reagent);
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default OrganicWizardGame;
