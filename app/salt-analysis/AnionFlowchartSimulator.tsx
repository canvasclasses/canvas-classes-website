'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, FlaskConical, Wind, CheckCircle2, RefreshCcw, ArrowRight, Flame, Droplets } from 'lucide-react';

// --- ANION DATA FOR SIMULATOR ---

type AnionGroup = 'A' | 'B' | 'independent';

interface AnionData {
    id: string;
    symbol: string;
    name: string;
    group: AnionGroup;
    reagent: string;
    gasEvolved?: string;
    gasColor: string;
    observation: string;
    confirmatoryHint: string;
}

const ANIONS_DATA: AnionData[] = [
    // Group A - Dilute H₂SO₄
    {
        id: 'carbonate',
        symbol: 'CO₃²⁻',
        name: 'Carbonate',
        group: 'A',
        reagent: 'Dilute H₂SO₄',
        gasEvolved: 'CO₂',
        gasColor: 'bg-gray-300/30',
        observation: 'Colourless, odourless gas with brisk effervescence. Turns lime water milky.',
        confirmatoryHint: 'Pass gas through lime water → milky solution that clears on prolonged passing.'
    },
    {
        id: 'sulphide',
        symbol: 'S²⁻',
        name: 'Sulphide',
        group: 'A',
        reagent: 'Dilute H₂SO₄',
        gasEvolved: 'H₂S',
        gasColor: 'bg-yellow-200/40',
        observation: 'Colourless gas with rotten egg smell. Turns lead acetate paper black.',
        confirmatoryHint: 'Sodium Nitroprusside Test → Purple/Violet colour.'
    },
    {
        id: 'sulphite',
        symbol: 'SO₃²⁻',
        name: 'Sulphite',
        group: 'A',
        reagent: 'Dilute H₂SO₄',
        gasEvolved: 'SO₂',
        gasColor: 'bg-gray-400/30',
        observation: 'Colourless gas with pungent smell (like burning sulphur). Turns acidified K₂Cr₂O₇ green.',
        confirmatoryHint: 'BaCl₂ Test → White ppt soluble in dil. HCl, SO₂ evolved.'
    },
    {
        id: 'nitrite',
        symbol: 'NO₂⁻',
        name: 'Nitrite',
        group: 'A',
        reagent: 'Dilute H₂SO₄',
        gasEvolved: 'NO₂',
        gasColor: 'bg-amber-600/50',
        observation: 'Brown fumes evolved. Turns acidified KI + Starch blue.',
        confirmatoryHint: 'KI + Starch Test (acidified with acetic acid) → Blue colour.'
    },
    {
        id: 'acetate',
        symbol: 'CH₃COO⁻',
        name: 'Acetate',
        group: 'A',
        reagent: 'Dilute H₂SO₄',
        gasEvolved: 'CH₃COOH vapours',
        gasColor: 'bg-white/20',
        observation: 'Colourless vapours with vinegar smell. Turns blue litmus red.',
        confirmatoryHint: 'Ester Test (heat with ethanol + conc. H₂SO₄) → Fruity odour.'
    },

    // Group B - Concentrated H₂SO₄
    {
        id: 'chloride',
        symbol: 'Cl⁻',
        name: 'Chloride',
        group: 'B',
        reagent: 'Conc. H₂SO₄',
        gasEvolved: 'HCl',
        gasColor: 'bg-white/40',
        observation: 'Colourless, pungent gas. Dense white fumes with NH₃.',
        confirmatoryHint: 'AgNO₃ Test → Curdy white ppt, soluble in NH₄OH.'
    },
    {
        id: 'bromide',
        symbol: 'Br⁻',
        name: 'Bromide',
        group: 'B',
        reagent: 'Conc. H₂SO₄',
        gasEvolved: 'Br₂ vapours',
        gasColor: 'bg-orange-700/60',
        observation: 'Reddish-brown gas with pungent odour. Intensifies with MnO₂.',
        confirmatoryHint: 'Layer Test (CCl₄ + Cl₂ water) → Brown organic layer.'
    },
    {
        id: 'iodide',
        symbol: 'I⁻',
        name: 'Iodide',
        group: 'B',
        reagent: 'Conc. H₂SO₄',
        gasEvolved: 'I₂ vapours',
        gasColor: 'bg-violet-600/60',
        observation: 'Violet vapours evolve. Turns starch paper blue. Violet sublimate on sides.',
        confirmatoryHint: 'Layer Test (CCl₄ + Cl₂ water) → Violet organic layer.'
    },
    {
        id: 'nitrate',
        symbol: 'NO₃⁻',
        name: 'Nitrate',
        group: 'B',
        reagent: 'Conc. H₂SO₄',
        gasEvolved: 'NO₂',
        gasColor: 'bg-amber-700/50',
        observation: 'Brown fumes (on heating with Cu turnings). Solution turns blue.',
        confirmatoryHint: 'Brown Ring Test → Dark brown ring at junction.'
    },
    {
        id: 'oxalate',
        symbol: 'C₂O₄²⁻',
        name: 'Oxalate',
        group: 'B',
        reagent: 'Conc. H₂SO₄',
        gasEvolved: 'CO + CO₂',
        gasColor: 'bg-gray-300/20',
        observation: 'Colourless gas. Turns lime water milky + burns with blue flame.',
        confirmatoryHint: 'CaCl₂ Test → White ppt insoluble in (NH₄)₂C₂O₄.'
    },

    // Independent Anions
    {
        id: 'sulphate',
        symbol: 'SO₄²⁻',
        name: 'Sulphate',
        group: 'independent',
        reagent: 'None (Direct Test)',
        gasColor: 'bg-transparent',
        observation: 'No gas evolved with dilute or concentrated H₂SO₄.',
        confirmatoryHint: 'BaCl₂ Test (acidified with HCl) → White ppt insoluble in conc. HNO₃.'
    },
    {
        id: 'phosphate',
        symbol: 'PO₄³⁻',
        name: 'Phosphate',
        group: 'independent',
        reagent: 'None (Direct Test)',
        gasColor: 'bg-transparent',
        observation: 'No gas evolved with dilute or concentrated H₂SO₄.',
        confirmatoryHint: 'Ammonium Molybdate Test (with conc. HNO₃) → Canary yellow ppt.'
    },
];

const STAGES = [
    { id: 'A', title: 'Group A Test', reagent: 'Dilute H₂SO₄', description: 'Test for anions that react with dilute acid.' },
    { id: 'B', title: 'Group B Test', reagent: 'Conc. H₂SO₄ (Heat may be required)', description: 'Test for anions that require concentrated acid.' },
    { id: 'independent', title: 'Independent Tests', reagent: 'Specific Reagents', description: 'Test for SO₄²⁻ and PO₄³⁻ directly.' },
];

export default function AnionFlowchartSimulator() {
    const [selectedAnion, setSelectedAnion] = useState<AnionData | null>(null);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [gasEvolved, setGasEvolved] = useState(false);
    const [history, setHistory] = useState<string[]>([]);

    const currentStage = STAGES[currentStageIndex];

    const reset = () => {
        setSelectedAnion(null);
        setCurrentStageIndex(0);
        setGasEvolved(false);
        setHistory([]);
        setIsAnimating(false);
    };

    const handleSelectAnion = (anion: AnionData) => {
        reset();
        setTimeout(() => setSelectedAnion(anion), 50);
    };

    const performTest = () => {
        if (!selectedAnion || isAnimating) return;
        setIsAnimating(true);

        const shouldEvolveGas = selectedAnion.group === currentStage.id;

        setTimeout(() => {
            if (shouldEvolveGas) {
                setGasEvolved(true);
                setHistory(prev => [...prev, `${currentStage.title}: Gas Evolved / Positive`]);
            } else {
                setHistory(prev => [...prev, `${currentStage.title}: No Reaction`]);
            }
            setIsAnimating(false);
        }, 1800);
    };

    const nextStage = () => {
        setGasEvolved(false);
        if (currentStageIndex < STAGES.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
        }
    };

    const getColorForGroup = (group: AnionGroup) => {
        if (group === 'A') return 'text-cyan-400';
        if (group === 'B') return 'text-orange-400';
        return 'text-purple-400';
    };

    return (
        <div className="w-full max-w-7xl mx-auto my-12 px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[750px]">

                {/* SIDEBAR */}
                <div className="lg:w-1/3 bg-gray-950 border-r border-gray-800 p-6 flex flex-col">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Droplets className="text-cyan-500" />
                        Anion Analysis
                    </h2>
                    <p className="text-gray-500 text-sm mb-6">Select an anion to simulate its identification.</p>

                    {/* Anion Selection */}
                    <div className="mb-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Select Anion</label>
                        <div className="grid grid-cols-3 gap-2">
                            {ANIONS_DATA.map((anion) => (
                                <button
                                    key={anion.id}
                                    onClick={() => handleSelectAnion(anion)}
                                    className={`p-2 rounded-lg text-sm font-bold transition-all border ${selectedAnion?.id === anion.id
                                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg scale-105'
                                        : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:border-gray-600'
                                        }`}
                                >
                                    {anion.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scheme Mini-Map */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Analysis Scheme</label>
                        <div className="space-y-4 relative">
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-800 -z-10" />

                            {STAGES.map((stage, index) => {
                                const isActive = index === currentStageIndex;
                                const isPassed = index < currentStageIndex;
                                const result = history.find(h => h.startsWith(stage.title));

                                return (
                                    <div key={stage.id} className={`relative flex items-start gap-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : isPassed ? 'opacity-50' : 'opacity-30'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 border-2 transition-all ${isActive
                                            ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                            : isPassed
                                                ? result?.includes('Positive') ? 'bg-green-900 border-green-700 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-500'
                                                : 'bg-gray-900 border-gray-800 text-gray-600'
                                            }`}>
                                            {isPassed && result?.includes('Positive') ? <CheckCircle2 size={14} /> : stage.id}
                                        </div>
                                        <div className={`flex-1 p-3 rounded-xl border ${isActive ? 'bg-cyan-900/20 border-cyan-500/30' : 'bg-gray-900/50 border-gray-800'}`}>
                                            <span className={`font-bold text-sm ${isActive ? 'text-cyan-300' : 'text-gray-400'}`}>{stage.title}</span>
                                            <div className="text-xs text-gray-500 mt-1">Reagent: <span className="text-gray-300">{stage.reagent}</span></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VISUALIZER */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-900 to-black relative p-8 flex flex-col items-center justify-between overflow-hidden min-h-[500px]">

                    {!selectedAnion ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <FlaskConical size={64} className="mx-auto mb-4 opacity-20" />
                            <p className="text-lg">Select an anion from the sidebar to start the simulation.</p>
                        </div>
                    ) : (
                        <>
                            {/* Title */}
                            <div className="w-full text-center z-10 mt-4 mb-8">
                                <h3 className="text-3xl font-bold text-white mb-2">{currentStage.title}</h3>
                                <p className="text-gray-400">Add <span className="text-cyan-400 font-bold">{currentStage.reagent}</span> to the salt.</p>
                            </div>

                            {/* Animated Test Tube */}
                            <div className="relative w-full flex-1 flex items-center justify-center min-h-[250px]">
                                <div className="relative w-24 h-64">
                                    {/* SVG Test Tube Shape */}
                                    <svg
                                        viewBox="0 0 80 220"
                                        className="w-full h-full drop-shadow-2xl"
                                        style={{ filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.15))' }}
                                    >
                                        {/* Glass body with rounded bottom */}
                                        <defs>
                                            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="rgba(148,163,184,0.3)" />
                                                <stop offset="30%" stopColor="rgba(148,163,184,0.1)" />
                                                <stop offset="70%" stopColor="rgba(148,163,184,0.05)" />
                                                <stop offset="100%" stopColor="rgba(148,163,184,0.2)" />
                                            </linearGradient>
                                            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="rgba(34,211,238,0.3)" />
                                                <stop offset="100%" stopColor="rgba(6,182,212,0.15)" />
                                            </linearGradient>
                                            <clipPath id="tubeClip">
                                                <path d="M15 10 L15 170 Q15 210 40 210 Q65 210 65 170 L65 10 Z" />
                                            </clipPath>
                                        </defs>

                                        {/* Tube background (inside) */}
                                        <path
                                            d="M15 10 L15 170 Q15 210 40 210 Q65 210 65 170 L65 10 Z"
                                            fill="rgba(15,23,42,0.6)"
                                            stroke="url(#glassGradient)"
                                            strokeWidth="3"
                                        />

                                        {/* Liquid inside the tube */}
                                        <motion.rect
                                            x="17"
                                            width="46"
                                            rx="2"
                                            fill="url(#liquidGradient)"
                                            clipPath="url(#tubeClip)"
                                            initial={{ y: 130, height: 80 }}
                                            animate={{
                                                y: isAnimating ? 110 : 130,
                                                height: isAnimating ? 100 : 80
                                            }}
                                            transition={{ duration: 1 }}
                                        />

                                        {/* Liquid in rounded bottom */}
                                        <ellipse
                                            cx="40"
                                            cy="185"
                                            rx="23"
                                            ry="20"
                                            fill="rgba(6,182,212,0.2)"
                                        />

                                        {/* Glass highlight (left) */}
                                        <path
                                            d="M20 20 L20 165 Q20 195 30 200"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.15)"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />

                                        {/* Glass highlight (right) */}
                                        <path
                                            d="M58 20 L58 60"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.25)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />

                                        {/* Top rim */}
                                        <path
                                            d="M12 10 L12 5 Q12 2 15 2 L65 2 Q68 2 68 5 L68 10"
                                            fill="none"
                                            stroke="rgba(148,163,184,0.4)"
                                            strokeWidth="2"
                                        />
                                        <ellipse
                                            cx="40"
                                            cy="10"
                                            rx="28"
                                            ry="5"
                                            fill="rgba(148,163,184,0.15)"
                                            stroke="rgba(148,163,184,0.3)"
                                            strokeWidth="1"
                                        />
                                    </svg>

                                    {/* Gas Evolution Animation - positioned over the tube */}
                                    <AnimatePresence>
                                        {(isAnimating || gasEvolved) && selectedAnion.gasEvolved && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: -60 }}
                                                exit={{ opacity: 0, y: -120 }}
                                                transition={{ duration: 2, repeat: gasEvolved ? 0 : Infinity, repeatType: 'loop' }}
                                                className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                                            >
                                                {[...Array(5)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1 + i * 0.2, opacity: 0.7 - i * 0.1 }}
                                                        transition={{ delay: i * 0.15, duration: 0.5 }}
                                                        className={`w-4 h-4 rounded-full ${selectedAnion.gasColor}`}
                                                        style={{ filter: 'blur(2px)' }}
                                                    />
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Reagent Drop Animation */}
                                <AnimatePresence>
                                    {isAnimating && !gasEvolved && (
                                        <motion.div
                                            initial={{ y: -180, opacity: 0 }}
                                            animate={{ y: -80, opacity: 1 }}
                                            exit={{ y: -180, opacity: 0 }}
                                            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                                        >
                                            <div className="w-4 h-20 bg-amber-100 rounded-b-full relative border border-amber-200 shadow-xl">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [0, 1.5, 0], y: [15, 120] }}
                                                    transition={{ repeat: 2, duration: 0.6 }}
                                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-300/70 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Controls & Feedback */}
                            <div className="w-full max-w-xl px-4 mt-8 pb-4 z-20 min-h-[150px] flex items-end justify-center">
                                <AnimatePresence mode="wait">
                                    {!gasEvolved && !isAnimating && history.length === 0 || (!gasEvolved && !isAnimating && !history[history.length - 1]?.includes('Positive')) ? (
                                        // Show Add Reagent only if we haven't found gas OR need to proceed
                                        !history.find(h => h === `${currentStage.title}: No Reaction`) ? (
                                            <motion.button
                                                key="add"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -20, opacity: 0 }}
                                                onClick={performTest}
                                                className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/50 flex items-center justify-center gap-2 text-lg transform transition active:scale-95"
                                            >
                                                <Beaker /> Add {currentStage.reagent}
                                            </motion.button>
                                        ) : (
                                            <motion.div key="no-reaction" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-full flex flex-col gap-3">
                                                <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl text-center">
                                                    <p className="text-gray-300 font-bold mb-1">No Gas / No Characteristic Reaction</p>
                                                    <p className="text-xs text-gray-500">The anion is not in {currentStage.title}. Proceed to the next test.</p>
                                                </div>
                                                {currentStageIndex < STAGES.length - 1 && (
                                                    <button
                                                        onClick={nextStage}
                                                        className="w-full py-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                                    >
                                                        Proceed to {STAGES[currentStageIndex + 1]?.title} <ArrowRight size={16} />
                                                    </button>
                                                )}
                                            </motion.div>
                                        )
                                    ) : gasEvolved ? (
                                        <motion.div
                                            key="result"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-gray-800 border border-green-500/50 p-6 rounded-2xl shadow-2xl backdrop-blur-xl w-full"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-500/20 rounded-full text-green-400 shrink-0">
                                                    <CheckCircle2 size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-bold text-white mb-1">Positive Test!</h4>
                                                    <p className="text-gray-300 mb-3 text-sm">
                                                        This indicates <strong className={getColorForGroup(selectedAnion.group)}>{selectedAnion.symbol}</strong> ({selectedAnion.name}) is present.
                                                    </p>

                                                    <div className="mb-4 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                                                        <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Observation</span>
                                                        <p className="text-base font-semibold text-white leading-relaxed">{selectedAnion.observation}</p>
                                                    </div>

                                                    {selectedAnion.gasEvolved && (
                                                        <div className="flex items-center gap-2 mb-4 text-sm">
                                                            <Wind className="text-cyan-400" size={18} />
                                                            <span className="text-gray-400">Gas Evolved: <strong className="text-white">{selectedAnion.gasEvolved}</strong></span>
                                                        </div>
                                                    )}

                                                    <div className="p-3 bg-black/40 rounded-lg text-sm text-gray-400 border border-gray-700/50">
                                                        <strong className="text-yellow-400">Confirmatory:</strong> {selectedAnion.confirmatoryHint}
                                                    </div>

                                                    <button
                                                        onClick={reset}
                                                        className="mt-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-sm w-full transition flex items-center justify-center gap-2"
                                                    >
                                                        <RefreshCcw size={16} /> Test Another Anion
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="text-center text-gray-500 animate-pulse">
                                            Adding reagent and observing reaction...
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
