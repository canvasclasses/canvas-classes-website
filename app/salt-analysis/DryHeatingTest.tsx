'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, RotateCcw, Thermometer, Info, ChevronDown } from 'lucide-react';

const HEATING_DATA = [
    {
        id: 'Cu',
        name: 'Copper (II) Sulfate',
        formula: 'CuSO₄·5H₂O',
        coldColor: 'Blue',
        coldClass: 'bg-blue-500',
        hotColor: 'White',
        hotClass: 'bg-white',
        inference: 'Cu²⁺ present'
    },
    {
        id: 'Fe',
        name: 'Ferrous Sulfate',
        formula: 'FeSO₄·7H₂O',
        coldColor: 'Light Green',
        coldClass: 'bg-green-400',
        hotColor: 'Dirty White / Yellow',
        hotClass: 'bg-yellow-200',
        inference: 'Fe²⁺ present'
    },
    {
        id: 'Zn',
        name: 'Zinc Oxide',
        formula: 'ZnO',
        coldColor: 'White',
        coldClass: 'bg-gray-100',
        hotColor: 'Canary Yellow',
        hotClass: 'bg-yellow-400',
        inference: 'Zn²⁺ present'
    },
    {
        id: 'Co',
        name: 'Cobalt Nitrate',
        formula: 'Co(NO₃)₂',
        coldColor: 'Pink',
        coldClass: 'bg-pink-400',
        hotColor: 'Blue',
        hotClass: 'bg-blue-600',
        inference: 'Co²⁺ present'
    }
];

export default function DryHeatingTest() {
    const [selectedSalt, setSelectedSalt] = useState<string | null>(null);
    const [isHeating, setIsHeating] = useState(false);
    const [isHot, setIsHot] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [showProcedure, setShowProcedure] = useState(false);

    const handleSelect = (id: string) => {
        setSelectedSalt(id);
        setIsHeating(false);
        setIsHot(false);
        setShowResult(false);
    };

    const toggleHeat = () => {
        if (!selectedSalt) return;

        if (!isHeating && !isHot) {
            // Start heating
            setIsHeating(true);
            setTimeout(() => {
                setIsHot(true);
                setShowResult(true);
            }, 2000);
        } else if (isHot) {
            // Cool down
            setIsHeating(false);
            setIsHot(false);
        }
    };

    const reset = () => {
        setSelectedSalt(null);
        setIsHeating(false);
        setIsHot(false);
        setShowResult(false);
    };

    const currentData = HEATING_DATA.find(d => d.id === selectedSalt);

    return (
        <div className="w-full max-w-6xl mx-auto my-8 md:my-12 px-2 md:px-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl md:rounded-3xl p-3 md:p-8 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                {/* Header - Smaller on mobile */}
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8 flex items-center gap-2 md:gap-3 relative z-10">
                    <div className="p-2 md:p-3 bg-yellow-500/20 rounded-lg md:rounded-xl">
                        <Thermometer className="text-yellow-400" size={24} />
                    </div>
                    <span className="md:hidden">Dry Heating</span>
                    <span className="hidden md:inline">Dry Heating Test</span>
                    <span className="text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700 hidden sm:inline-block">
                        Virtual Experiment
                    </span>
                </h2>

                {/* Mobile: Vertical layout, Desktop: Grid */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-12">

                    {/* Salt Selection - Shows first on mobile */}
                    <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Select Salt Sample:</h3>
                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                                {HEATING_DATA.map((salt) => (
                                    <button
                                        key={salt.id}
                                        onClick={() => handleSelect(salt.id)}
                                        className={`p-2.5 md:p-4 rounded-lg md:rounded-xl border text-left transition-all group relative overflow-hidden ${selectedSalt === salt.id
                                            ? 'bg-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                                            : 'bg-gray-800/40 border-gray-700 hover:bg-gray-700/60'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div>
                                                <span className="font-semibold text-white block text-sm md:text-base">{salt.name}</span>
                                                <span className="text-xs text-gray-500">{salt.formula}</span>
                                            </div>
                                            {selectedSalt === salt.id && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#FACC15]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Procedure - Collapsible on mobile */}
                        <div className="bg-gray-800/30 rounded-lg md:rounded-xl border border-gray-700 overflow-hidden">
                            <button
                                className="w-full p-3 md:p-5 flex items-center justify-between md:cursor-default"
                                onClick={() => setShowProcedure(!showProcedure)}
                            >
                                <h4 className="flex items-center gap-2 text-yellow-400 font-bold text-sm md:text-base">
                                    <Info size={16} /> Procedure
                                </h4>
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 md:hidden transition-transform ${showProcedure ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div className={`px-3 pb-3 md:px-5 md:pb-5 ${showProcedure ? 'block' : 'hidden md:block'}`}>
                                <ul className="text-xs md:text-sm text-gray-300 space-y-1.5 md:space-y-2 list-disc list-inside">
                                    <li>Take 0.1g of dry salt in a test tube.</li>
                                    <li>Heat for about one minute.</li>
                                    <li>Observe colour when hot and cold.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Buttons - Smaller on mobile */}
                        <div className="flex gap-2 md:gap-4">
                            <button
                                onClick={toggleHeat}
                                disabled={!selectedSalt}
                                className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-bold text-sm md:text-lg transition-all flex items-center justify-center gap-2 
                                ${!selectedSalt
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : isHeating
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                            : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                                    }`}
                            >
                                {isHeating ? (
                                    <>Stop <Flame size={18} className="animate-pulse" /></>
                                ) : (
                                    <>Start Heating <Flame size={18} /></>
                                )}
                            </button>

                            <button
                                onClick={reset}
                                className="px-4 md:px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg md:rounded-xl transition-colors"
                            >
                                <RotateCcw size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Simulator Area - Smaller on mobile */}
                    <div className="order-2 lg:order-1 relative h-[280px] md:h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl md:rounded-2xl border border-gray-700 flex flex-col items-center justify-end p-4 md:p-8 group overflow-hidden">

                        {/* Test Tube Holder/Clamp - Smaller on mobile */}
                        <div className="absolute top-6 md:top-10 right-1/2 translate-x-1/2 w-3 md:w-4 h-20 md:h-32 bg-gray-600 rounded-full z-10" />
                        <div className="absolute top-24 md:top-40 right-1/2 translate-x-1/2 w-8 md:w-12 h-3 md:h-4 bg-gray-500 rounded-md z-20 shadow-lg" />

                        {/* Test Tube - Smaller on mobile */}
                        <motion.div
                            className="absolute top-24 md:top-40 z-10 origin-top"
                            animate={{ rotate: isHeating ? -45 : 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <div className="w-8 md:w-12 h-32 md:h-48 border-2 md:border-4 border-gray-400/50 bg-white/5 rounded-b-2xl md:rounded-b-3xl backdrop-blur-sm relative overflow-hidden">
                                {/* Salt Content */}
                                <AnimatePresence mode="wait">
                                    {currentData && (
                                        <motion.div
                                            key={currentData.id}
                                            initial={{ height: 0 }}
                                            animate={{ height: 30 }}
                                            className="absolute bottom-0 w-full"
                                        >
                                            <motion.div
                                                className={`w-full h-full ${isHot ? currentData.hotClass : currentData.coldClass} transition-colors duration-2000`}
                                            />
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-30 mix-blend-overlay" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Steam/Gas Effects */}
                                {isHeating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: [0, 1, 0], y: -40 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute bottom-8 left-0 w-full flex justify-center"
                                    >
                                        <div className="w-4 md:w-6 h-8 md:h-12 bg-white/20 blur-md rounded-full" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Bunsen Flame */}
                        <AnimatePresence>
                            {isHeating && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute bottom-12 md:bottom-20 right-1/2 translate-x-[30px] md:translate-x-[40px] z-0"
                                >
                                    <div className="relative flex justify-center items-end filter blur-sm">
                                        <div className="w-6 md:w-8 h-16 md:h-24 bg-blue-500/80 rounded-full animate-pulse" />
                                        <div className="absolute bottom-0 w-3 md:w-4 h-12 md:h-16 bg-white/60 rounded-full" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Label - Smaller on mobile */}
                        <div className="absolute top-3 md:top-6 left-3 md:left-6 bg-black/60 backdrop-blur-md px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/10 shadow-lg">
                            <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                                <Thermometer size={12} className={isHot ? "text-red-400" : "text-blue-400"} />
                                <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">State</span>
                            </div>
                            <span className="text-sm md:text-lg font-bold text-white">
                                {isHot ? "HOT" : "COLD"}
                            </span>
                        </div>

                        {/* Result Overlay - Compact on mobile */}
                        <AnimatePresence>
                            {showResult && currentData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6 bg-gray-900/90 backdrop-blur-xl p-3 md:p-4 rounded-lg md:rounded-xl border border-yellow-500/30 shadow-xl z-30"
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <p className="text-gray-400 text-[10px] md:text-xs mb-0.5">Observation</p>
                                            <p className="text-white font-semibold text-xs md:text-base">
                                                {currentData.coldColor} → <span className="text-yellow-400">{currentData.hotColor}</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-[10px] md:text-xs mb-0.5">Inference</p>
                                            <p className="text-green-400 font-bold text-xs md:text-base">{currentData.inference}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>
            </div>
        </div>
    );
}
