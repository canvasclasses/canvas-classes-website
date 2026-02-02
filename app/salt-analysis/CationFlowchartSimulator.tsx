'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Beaker, ArrowRight, CheckCircle2, AlertCircle, RefreshCcw, ChevronRight } from 'lucide-react';

// --- DATA STRUCTURES ---

type GroupStage = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'Finished';

interface CationData {
    symbol: string;
    name: string;
    group: GroupStage;
    precipitateColor: string;
    precipitateName: string;
    description: string;
}

const CATIONS: CationData[] = [
    // Group I
    { symbol: 'Pb²⁺', name: 'Lead', group: 'I', precipitateColor: 'bg-white', precipitateName: 'White ppt (PbCl₂)', description: 'Lead chloride is insoluble in cold water.' },
    // Group II
    { symbol: 'Pb²⁺', name: 'Lead', group: 'II', precipitateColor: 'bg-black', precipitateName: 'Black ppt (PbS)', description: 'Lead ions not precipitated in Group I (due to solubility) precipitate here.' },
    { symbol: 'Cu²⁺', name: 'Copper', group: 'II', precipitateColor: 'bg-black', precipitateName: 'Black ppt (CuS)', description: 'Copper sulfide precipitates in acidic medium.' },
    { symbol: 'Hg²⁺', name: 'Mercury(II)', group: 'II', precipitateColor: 'bg-black', precipitateName: 'Black ppt (HgS)', description: 'Mercury(II) sulfide is black.' },
    { symbol: 'Bi³⁺', name: 'Bismuth', group: 'II', precipitateColor: 'bg-yellow-900', precipitateName: 'Brown/Black ppt (Bi₂S₃)', description: 'Bismuth sulfide is dark brown/black.' },
    { symbol: 'Cd²⁺', name: 'Cadmium', group: 'II', precipitateColor: 'bg-yellow-400', precipitateName: 'Yellow ppt (CdS)', description: 'Cadmium sulfide is distinctively yellow.' },
    { symbol: 'As³⁺', name: 'Arsenic', group: 'II', precipitateColor: 'bg-yellow-300', precipitateName: 'Yellow ppt (As₂S₃)', description: 'Arsenic sulfide is yellow.' },
    { symbol: 'Sb³⁺', name: 'Antimony', group: 'II', precipitateColor: 'bg-orange-500', precipitateName: 'Orange ppt (Sb₂S₃)', description: 'Antimony sulfide is orange.' },
    { symbol: 'Sn²⁺', name: 'Tin(II)', group: 'II', precipitateColor: 'bg-yellow-900', precipitateName: 'Brown ppt (SnS)', description: 'Tin(II) sulfide is brown.' },
    // Group III
    { symbol: 'Fe³⁺', name: 'Iron', group: 'III', precipitateColor: 'bg-red-800', precipitateName: 'Reddish Brown ppt', description: 'Ferric hydroxide forms a gelatinous reddish-brown precipitate.' },
    { symbol: 'Al³⁺', name: 'Aluminium', group: 'III', precipitateColor: 'bg-white/80', precipitateName: 'Gelatinous White ppt', description: 'Aluminium hydroxide forms a white gelatinous precipitate.' },
    // Group IV
    { symbol: 'Co²⁺', name: 'Cobalt', group: 'IV', precipitateColor: 'bg-black', precipitateName: 'Black ppt (CoS)', description: 'Cobalt sulfide precipitates in basic medium.' },
    { symbol: 'Ni²⁺', name: 'Nickel', group: 'IV', precipitateColor: 'bg-black', precipitateName: 'Black ppt (NiS)', description: 'Nickel sulfide is black.' },
    { symbol: 'Mn²⁺', name: 'Manganese', group: 'IV', precipitateColor: 'bg-orange-200', precipitateName: 'Buff/Flesh ppt (MnS)', description: 'Manganese sulfide is a light pinkish-buff color.' },
    { symbol: 'Zn²⁺', name: 'Zinc', group: 'IV', precipitateColor: 'bg-gray-200', precipitateName: 'Dirty White ppt (ZnS)', description: 'Zinc sulfide is white.' },
    // Group V
    { symbol: 'Ba²⁺', name: 'Barium', group: 'V', precipitateColor: 'bg-white', precipitateName: 'White ppt (BaCO₃)', description: 'Barium carbonate is a white precipitate.' },
    { symbol: 'Sr²⁺', name: 'Strontium', group: 'V', precipitateColor: 'bg-white', precipitateName: 'White ppt (SrCO₃)', description: 'Strontium carbonate is white.' },
    { symbol: 'Ca²⁺', name: 'Calcium', group: 'V', precipitateColor: 'bg-white', precipitateName: 'White ppt (CaCO₃)', description: 'Calcium carbonate is white.' },
    // Group VI
    { symbol: 'Mg²⁺', name: 'Magnesium', group: 'VI', precipitateColor: 'text-white', precipitateName: 'No precipitate in Groups I-V', description: 'Magnesium is detected in the final filtrate.' },
];

const STAGES: { id: GroupStage; title: string; reagent: string; condition: string }[] = [
    { id: 'I', title: 'Group I', reagent: 'Dilute HCl', condition: 'Original Solution' },
    { id: 'II', title: 'Group II', reagent: 'H₂S Gas', condition: 'Dil. HCl present' },
    { id: 'III', title: 'Group III', reagent: 'NH₄OH (Excess)', condition: 'Conc. HNO₃ boiled + Solid NH₄Cl' },
    { id: 'IV', title: 'Group IV', reagent: 'H₂S Gas', condition: 'Ammoniacal Medium' },
    { id: 'V', title: 'Group V', reagent: '(NH₄)₂CO₃', condition: 'NH₄OH + NH₄Cl present' },
    { id: 'VI', title: 'Group VI', reagent: 'Disodium Hydrogen Phosphate', condition: 'Original Solution (Test for Mg²⁺)' }, // Simplified for flow
];


export default function CationFlowchartSimulator() {
    const [selectedCation, setSelectedCation] = useState<CationData | null>(null);
    const [currentStageIndex, setCurrentStageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [pptFormed, setPptFormed] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [resultCation, setResultCation] = useState<CationData | null>(null);

    const currentStage = STAGES[currentStageIndex];

    const reset = () => {
        setSelectedCation(null);
        setResultCation(null);
        setCurrentStageIndex(0);
        setPptFormed(false);
        setHistory([]);
        setIsAnimating(false);
    };

    const handleSelectCation = (cation: CationData) => {
        reset();
        // Small timeout to allow reset to process if needed
        setTimeout(() => setSelectedCation(cation), 50);
    };

    const performTest = () => {
        if (!selectedCation || isAnimating) return;

        setIsAnimating(true);

        // Find if the selected cation (by symbol) has a reaction in the current group
        // This handles cases like Pb²⁺ which appears in both Group I and Group II
        const matchingCation = CATIONS.find(c => c.symbol === selectedCation.symbol && c.group === currentStage.id);
        const shouldFormPpt = !!matchingCation;

        // Sequence: Add Reagent -> Wait -> Result
        setTimeout(() => {
            if (shouldFormPpt && matchingCation) {
                setPptFormed(true);
                setResultCation(matchingCation);
                setHistory(prev => [...prev, `Group ${currentStage.id}: Precipitate Formed`]);
            } else {
                setHistory(prev => [...prev, `Group ${currentStage.id}: No Precipitate`]);
            }
            setIsAnimating(false);
        }, 1500);
    };

    const nextStage = () => {
        setPptFormed(false);
        setResultCation(null);
        if (currentStageIndex < STAGES.length - 1) {
            setCurrentStageIndex(prev => prev + 1);
        } else {
            // Finished
        }
    };

    const showNextStepControl = !pptFormed && !isAnimating && history.length > 0 && history[history.length - 1].includes('No Precipitate');

    return (
        <div className="w-full max-w-7xl mx-auto my-8 md:my-12 px-2 md:px-4">
            <div className="bg-gray-900 border border-gray-800 rounded-xl md:rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row min-h-[600px] md:min-h-[800px]">

                {/* SIDEBAR: SELECTION & TRACKER */}
                <div className="lg:w-1/3 bg-gray-950 border-r border-gray-800 p-4 md:p-6 flex flex-col">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                        <FlaskConical className="text-purple-500 w-6 h-6" />
                        Cation Analysis
                    </h2>

                    {/* Cation Selection Grid - Compact on mobile */}
                    <div className="mb-4 md:mb-8">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 md:mb-3 block">Select Cation to Trace</label>
                        <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
                            {CATIONS.filter((v, i, a) => a.findIndex(t => (t.symbol === v.symbol)) === i).map((cation) => (
                                <button
                                    key={cation.symbol}
                                    onClick={() => handleSelectCation(cation)}
                                    className={`p-1.5 md:p-2 rounded-lg text-xs md:text-sm font-bold transition-all ${selectedCation?.symbol === cation.symbol
                                        ? 'bg-purple-600 text-white shadow-lg scale-105'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                        }`}
                                >
                                    {cation.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Flowchart Mini-Map - Scrollable and reduced height on mobile */}
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[150px] md:max-h-none">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 md:mb-4 block">Analysis Scheme</label>
                        <div className="space-y-3 md:space-y-4 relative">
                            {/* Vertical Line Connector */}
                            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-800 -z-10" />

                            {STAGES.map((stage, index) => {
                                const isActive = index === currentStageIndex;
                                const isPassed = index < currentStageIndex;
                                const result = history.find(h => h.startsWith(`Group ${stage.id}`));

                                return (
                                    <div key={stage.id} className={`relative flex items-start gap-4 transition-opacity duration-300 ${isActive ? 'opacity-100' : isPassed ? 'opacity-50' : 'opacity-30'
                                        }`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border-2 transition-all ${isActive
                                            ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                            : isPassed
                                                ? result?.includes('Precipitate Formed') ? 'bg-green-900 border-green-700 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-500'
                                                : 'bg-gray-900 border-gray-800 text-gray-600'
                                            }`}>
                                            {isPassed && result?.includes('Precipitate Formed') ? <CheckCircle2 size={16} /> : stage.id}
                                        </div>
                                        <div className={`flex-1 p-2 md:p-3 rounded-xl border ${isActive
                                            ? 'bg-purple-900/20 border-purple-500/30'
                                            : 'bg-gray-900/50 border-gray-800'
                                            }`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className={`font-bold text-sm md:text-base ${isActive ? 'text-purple-300' : 'text-gray-400'}`}>
                                                    {stage.title}
                                                </span>
                                                {isPassed && (
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${result?.includes('Precipitate Formed') ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
                                                        }`}>
                                                        {result?.includes('Precipitate Formed') ? 'Found' : 'Next'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500 mb-1">Reagent: <span className="text-gray-300">{stage.reagent}</span></div>
                                            {isActive && !pptFormed && (
                                                <div className="mt-2 text-[10px] text-purple-200 bg-purple-900/40 p-1 md:p-2 rounded animate-pulse">
                                                    Current Step
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* VISUALIZER AREA */}
                <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-900 to-black relative p-4 md:p-8 flex flex-col items-center justify-between overflow-hidden min-h-[400px] md:min-h-[600px]">

                    {!selectedCation ? (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                            <FlaskConical size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-base md:text-lg">Select a cation from the sidebar to start the simulation.</p>
                        </div>
                    ) : (
                        <>
                            {/* Main Stage Title */}
                            <div className="w-full text-center z-10 mt-2 md:mt-4 mb-4 md:mb-8">
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{currentStage.title} Analysis</h3>
                                <p className="text-gray-400 text-sm md:text-base">Add <span className="text-purple-400 font-bold">{currentStage.reagent}</span> to {currentStage.condition}</p>
                            </div>

                            {/* REACTION ZONE */}
                            <div className="relative w-full flex-1 flex items-center justify-center min-h-[200px] md:min-h-[300px]">

                                {/* Test Tube */}
                                <div className="relative w-20 md:w-24 h-56 md:h-64 bg-slate-800/10 border-2 border-slate-600/30 border-t-0 rounded-b-full backdrop-blur-md overflow-hidden shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.05)]">

                                    {/* Liquid Solution */}
                                    <motion.div
                                        initial={{ height: "40%" }}
                                        animate={{ height: isAnimating ? "60%" : "40%" }}
                                        className="absolute bottom-0 w-full bg-cyan-200/5 transition-all duration-1000"
                                    >
                                        {/* Precipitate Layer */}
                                        <AnimatePresence>
                                            {pptFormed && resultCation && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className={`absolute bottom-0 w-full h-1/2 ${resultCation.precipitateColor} blur-[1px] opacity-90`}
                                                >
                                                    {/* Particles for realism */}
                                                    <div className="w-full h-full opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Glass Highlights */}
                                    <div className="absolute top-0 right-2 w-2 h-full bg-gradient-to-b from-white/20 to-transparent rounded-full blur-[1px]" />
                                </div>

                                {/* Reagent Dropper (Animated) */}
                                <AnimatePresence>
                                    {isAnimating && !pptFormed && (
                                        <motion.div
                                            initial={{ y: -200, opacity: 0 }}
                                            animate={{ y: -100, opacity: 1 }}
                                            exit={{ y: -200, opacity: 0 }}
                                            className="absolute top-0 left-1/2 -translate-x-1/2 z-20"
                                        >
                                            <div className="w-3 md:w-4 h-20 md:h-24 bg-gray-300 rounded-b-full relative border border-gray-400 shadow-xl">
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: [0, 1.2, 0], y: [20, 150] }}
                                                    transition={{ repeat: 3, duration: 0.5 }}
                                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/50 rounded-full"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>

                            {/* Controls & Feedback */}
                            <div className="w-full max-w-xl px-2 md:px-4 mt-4 md:mt-8 pb-4 z-20 min-h-[140px] flex items-end justify-center">
                                <AnimatePresence mode="wait">
                                    {!showNextStepControl && !pptFormed && !isAnimating ? (
                                        <motion.button
                                            key="add"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -20, opacity: 0 }}
                                            onClick={performTest}
                                            className="w-full py-3 md:py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/50 flex items-center justify-center gap-2 text-base md:text-lg transform transition active:scale-95"
                                        >
                                            <Beaker /> Add {currentStage.reagent}
                                        </motion.button>
                                    ) : pptFormed && resultCation ? (
                                        <motion.div
                                            key="result"
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="bg-gray-800 border border-green-500/50 p-4 md:p-6 rounded-xl md:rounded-2xl shadow-2xl backdrop-blur-xl w-full"
                                        >
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="p-2 md:p-3 bg-green-500/20 rounded-full text-green-400 shrink-0">
                                                    <CheckCircle2 size={24} className="md:w-8 md:h-8" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-lg md:text-xl font-bold text-white mb-1">Precipitate Formed!</h4>
                                                    <p className="text-gray-300 mb-2 md:mb-3 text-xs md:text-sm">
                                                        <strong className="text-green-400">{selectedCation.symbol}</strong> found in <strong className="text-purple-300">Group {resultCation.group}</strong>.
                                                    </p>

                                                    {/* Enhanced Observation Text */}
                                                    <div className="mb-3 md:mb-4 bg-gray-900/50 p-2 md:p-3 rounded-lg border border-gray-700">
                                                        <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase block mb-1">Observation</span>
                                                        <p className="text-sm md:text-lg font-bold text-white tracking-wide">
                                                            {resultCation.precipitateName}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={reset}
                                                        className="mt-2 px-4 md:px-6 py-2 md:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold text-xs md:text-sm w-full transition flex items-center justify-center gap-2"
                                                    >
                                                        <RefreshCcw size={16} /> Restart Analysis
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>

                                    ) : (
                                        isAnimating && (
                                            <div className="text-center text-gray-500 animate-pulse text-sm md:text-base">
                                                Adding reagent and observing reaction...
                                            </div>
                                        )
                                    )}

                                    {/* Optimized Next Step Interaction */}
                                    {showNextStepControl && (
                                        <motion.div
                                            key="next-controls"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="w-full grid grid-cols-2 gap-3"
                                        >
                                            <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-xl flex flex-col justify-center items-center text-center">
                                                <p className="text-red-200 font-bold text-sm mb-0.5">No Precipitate</p>
                                                <p className="text-[10px] text-red-300/70 leading-tight">Not in Group {currentStage.id}</p>
                                            </div>
                                            <button
                                                onClick={nextStage}
                                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl flex flex-col justify-center items-center p-2 hover:scale-[1.02] transition-transform shadow-lg"
                                            >
                                                <span className="flex items-center gap-1 text-sm">Proceed to <ArrowRight size={14} /></span>
                                                <span className="text-xs opacity-80">Group {STAGES[currentStageIndex + 1]?.id || 'Next'}</span>
                                            </button>
                                        </motion.div>
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
