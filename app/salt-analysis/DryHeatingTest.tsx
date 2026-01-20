'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TestTube, RotateCcw, Thermometer, Info } from 'lucide-react';

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
        <div className="w-full max-w-6xl mx-auto my-12 px-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-yellow-500/20 rounded-xl">
                        <Thermometer className="text-yellow-400" size={32} />
                    </div>
                    Dry Heating Test
                    <span className="text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700 hidden sm:inline-block">
                        Virtual Experiment
                    </span>
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Simulator Area */}
                    <div className="relative h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 flex flex-col items-center justify-end p-8 group overflow-hidden">

                        {/* Test Tube Holder/Clamp */}
                        <div className="absolute top-10 right-1/2 translate-x-1/2 w-4 h-32 bg-gray-600 rounded-full z-10" />
                        <div className="absolute top-40 right-1/2 translate-x-1/2 w-12 h-4 bg-gray-500 rounded-md z-20 shadow-lg" />

                        {/* Test Tube */}
                        <motion.div
                            className="absolute top-40 z-10 origin-top"
                            animate={{ rotate: isHeating ? -45 : 0 }}
                            transition={{ type: "spring", stiffness: 100 }}
                        >
                            <div className="w-12 h-48 border-4 border-gray-400/50 bg-white/5 rounded-b-3xl backdrop-blur-sm relative overflow-hidden">
                                {/* Salt Content */}
                                <AnimatePresence mode="wait">
                                    {currentData && (
                                        <motion.div
                                            key={currentData.id}
                                            initial={{ height: 0 }}
                                            animate={{ height: 40 }}
                                            className="absolute bottom-0 w-full"
                                        >
                                            <motion.div
                                                className={`w-full h-full ${isHot ? currentData.hotClass : currentData.coldClass} transition-colors duration-2000`}
                                            />
                                            {/* Texture overlay */}
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-30 mix-blend-overlay" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Steam/Gas Effects */}
                                {isHeating && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 0 }}
                                        animate={{ opacity: [0, 1, 0], y: -60 }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute bottom-10 left-0 w-full flex justify-center"
                                    >
                                        <div className="w-6 h-12 bg-white/20 blur-md rounded-full" />
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Bunsen Flame (Only appears when heating) */}
                        <AnimatePresence>
                            {isHeating && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    className="absolute bottom-20 right-1/2 translate-x-[40px] z-0" // Positioned to hit the tilted tube
                                >
                                    <div className="relative flex justify-center items-end filter blur-sm">
                                        <div className="w-8 h-24 bg-blue-500/80 rounded-full animate-pulse" />
                                        <div className="absolute bottom-0 w-4 h-16 bg-white/60 rounded-full" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Status Label */}
                        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg">
                            <div className="flex items-center gap-2 mb-1">
                                <Thermometer size={14} className={isHot ? "text-red-400" : "text-blue-400"} />
                                <span className="text-gray-400 text-xs uppercase tracking-wider">State</span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                {isHot ? "HOT Residue" : "COLD Residue"}
                            </span>
                        </div>

                        {/* Result Overlay */}
                        <AnimatePresence>
                            {showResult && currentData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-xl p-4 rounded-xl border border-yellow-500/30 shadow-xl z-30"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-gray-400 text-xs mb-1">Observation</p>
                                            <p className="text-white font-semibold">
                                                {currentData.coldColor} (Cold) → <span className="text-yellow-400">{currentData.hotColor} (Hot)</span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs mb-1">Inference</p>
                                            <p className="text-green-400 font-bold">{currentData.inference}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Select Salt Sample:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {HEATING_DATA.map((salt) => (
                                    <button
                                        key={salt.id}
                                        onClick={() => handleSelect(salt.id)}
                                        className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${selectedSalt === salt.id
                                            ? 'bg-gray-800 border-yellow-500/50 shadow-lg shadow-yellow-500/10'
                                            : 'bg-gray-800/40 border-gray-700 hover:bg-gray-700/60'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div>
                                                <span className="font-semibold text-white block">{salt.name}</span>
                                                <span className="text-xs text-gray-500">{salt.formula}</span>
                                            </div>
                                            {selectedSalt === salt.id && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_#FACC15]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700">
                            <h4 className="flex items-center gap-2 text-yellow-400 font-bold mb-2">
                                <Info size={18} /> Procedure
                            </h4>
                            <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
                                <li>Take about 0.1g of dry salt in a clean, dry test tube.</li>
                                <li>Heat the test tube for about one minute.</li>
                                <li>Observe the colour of the residue when hot and when cold.</li>
                            </ul>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={toggleHeat}
                                disabled={!selectedSalt}
                                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 
                                ${!selectedSalt
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : isHeating
                                            ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30'
                                            : 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                                    }`}
                            >
                                {isHeating ? (
                                    <>Stop Heating <Flame size={20} className="animate-pulse" /></>
                                ) : (
                                    <>Start Heating <Flame size={20} /></>
                                )}
                            </button>

                            <button
                                onClick={reset}
                                className="px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
