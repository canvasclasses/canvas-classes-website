'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TestTube, RotateCcw, Glasses, ChevronDown } from 'lucide-react';
import AtomicProcessVisualizer from './AtomicProcessVisualizer';

const FLAME_DATA = [
    {
        id: 'Ca',
        name: 'Calcium',
        symbol: 'Ca²⁺',
        color: 'Brick Red',
        cssColor: 'from-orange-500 via-red-500 to-orange-600',
        code: '#EF4444',
        blueGlassColor: 'Light Green',
        blueGlassCssColor: 'from-green-300 via-green-400 to-emerald-400'
    },
    {
        id: 'Sr',
        name: 'Strontium',
        symbol: 'Sr²⁺',
        color: 'Crimson',
        cssColor: 'from-red-600 via-pink-600 to-red-500',
        code: '#DC2626',
        blueGlassColor: 'Purple',
        blueGlassCssColor: 'from-purple-500 via-fuchsia-600 to-purple-600'
    },
    {
        id: 'Ba',
        name: 'Barium',
        symbol: 'Ba²⁺',
        color: 'Apple Green',
        cssColor: 'from-green-400 via-green-500 to-green-600',
        code: '#22C55E',
        blueGlassColor: 'Bluish Green',
        blueGlassCssColor: 'from-teal-400 via-cyan-500 to-teal-500'
    },
    {
        id: 'Cu',
        name: 'Copper',
        symbol: 'Cu²⁺',
        color: 'Blue Green',
        cssColor: 'from-blue-500 via-cyan-400 to-green-400',
        code: '#3B82F6',
        blueGlassColor: 'Blue Green',
        blueGlassCssColor: 'from-blue-500 via-cyan-400 to-green-400'
    },
    {
        id: 'Na',
        name: 'Sodium',
        symbol: 'Na⁺',
        color: 'Golden Yellow',
        cssColor: 'from-yellow-300 via-yellow-500 to-orange-400',
        code: '#EAB308',
        blueGlassColor: 'Pale / Invisible',
        blueGlassCssColor: 'from-blue-900/10 via-blue-800/10 to-transparent'
    },
    {
        id: 'K',
        name: 'Potassium',
        symbol: 'K⁺',
        color: 'Lilac',
        cssColor: 'from-purple-400 via-purple-500 to-violet-400',
        code: '#A855F7',
        blueGlassColor: 'Crimson / Purple',
        blueGlassCssColor: 'from-fuchsia-500 via-purple-600 to-pink-600'
    },
    {
        id: 'Li',
        name: 'Lithium',
        symbol: 'Li⁺',
        color: 'Crimson Red',
        cssColor: 'from-red-500 via-rose-500 to-red-600',
        code: '#E11D48',
        blueGlassColor: 'Purple',
        blueGlassCssColor: 'from-purple-500 via-fuchsia-600 to-purple-600'
    },
    {
        id: 'Rb',
        name: 'Rubidium',
        symbol: 'Rb⁺',
        color: 'Red Violet',
        cssColor: 'from-fuchsia-600 via-purple-600 to-fuchsia-700',
        code: '#9333EA',
        blueGlassColor: 'Violet',
        blueGlassCssColor: 'from-violet-600 via-indigo-600 to-purple-700'
    },
    {
        id: 'Cs',
        name: 'Cesium',
        symbol: 'Cs⁺',
        color: 'Blue',
        cssColor: 'from-blue-600 via-indigo-600 to-blue-700',
        code: '#2563EB',
        blueGlassColor: 'Blue',
        blueGlassCssColor: 'from-blue-600 via-indigo-600 to-blue-700'
    },
];

export default function FlameTestSimulator() {
    const [selectedIon, setSelectedIon] = useState<string | null>(null);
    const [isBurning, setIsBurning] = useState(false);
    const [viewMode, setViewMode] = useState<'naked' | 'blue-glass'>('naked');
    const [showProcedure, setShowProcedure] = useState(false);

    const handleTest = (id: string) => {
        setIsBurning(false);
        setSelectedIon(id);
        setTimeout(() => setIsBurning(true), 300);
    };

    const reset = () => {
        setSelectedIon(null);
        setIsBurning(false);
    };

    const currentData = FLAME_DATA.find(d => d.id === selectedIon);

    return (
        <div className="w-full max-w-6xl mx-auto my-8 md:my-16 px-2 md:px-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl md:rounded-3xl p-3 md:p-8 overflow-hidden relative shadow-2xl">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header - Smaller on mobile */}
                <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-8 flex items-center gap-2 md:gap-3 relative z-10">
                    <div className="p-2 md:p-3 bg-orange-500/20 rounded-lg md:rounded-xl">
                        <Flame className="text-orange-400" size={24} />
                    </div>
                    <span className="md:hidden">Flame Test</span>
                    <span className="hidden md:inline">Virtual Flame Test</span>
                    <span className="text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700 hidden sm:inline-block">
                        Interactive Simulator
                    </span>
                </h2>

                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 md:gap-12">

                    {/* Controls - First on mobile */}
                    <div className="order-1 lg:order-2 space-y-4 md:space-y-6">
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">Select a Salt for Test:</h3>
                            {/* Mobile: 3-column grid with just symbols, Desktop: 2-column with full names */}
                            <div className="grid grid-cols-3 md:grid-cols-2 gap-2 md:gap-3">
                                {FLAME_DATA.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTest(item.id)}
                                        className={`p-2 md:p-4 rounded-lg md:rounded-xl border text-center md:text-left transition-all relative overflow-hidden group ${selectedIon === item.id
                                            ? 'bg-gray-800 border-white/50 shadow-lg shadow-white/5 scale-[1.02]'
                                            : 'bg-gray-800/40 border-gray-700 hover:bg-gray-700/60 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${selectedIon === item.id ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: item.code }} />
                                        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between z-10 relative gap-1">
                                            {/* Mobile: Symbol only, Desktop: Full name */}
                                            <span className="md:hidden font-bold text-white text-sm">{item.symbol}</span>
                                            <span className="hidden md:inline font-semibold text-white">{item.name} ({item.symbol})</span>
                                            {/* Mobile: Show name smaller below symbol */}
                                            <span className="md:hidden text-[10px] text-gray-400">{item.name}</span>
                                            {selectedIon === item.id && <Flame size={14} className="text-orange-400 animate-pulse hidden md:block" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Procedure - Collapsible on mobile */}
                        <div className="bg-blue-900/20 border border-blue-500/20 rounded-lg md:rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-2xl" />
                            <button
                                className="w-full p-3 md:p-5 flex items-center justify-between md:cursor-default relative z-10"
                                onClick={() => setShowProcedure(!showProcedure)}
                            >
                                <h4 className="flex items-center gap-2 text-blue-400 font-bold text-sm md:text-base">
                                    <TestTube size={16} /> Procedure
                                </h4>
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-400 md:hidden transition-transform ${showProcedure ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <div className={`px-3 pb-3 md:px-5 md:pb-5 relative z-10 ${showProcedure ? 'block' : 'hidden md:block'}`}>
                                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                                    1. Clean platinum wire with conc. HCl.<br />
                                    2. Dip wire in salt sample.<br />
                                    3. Place in non-luminous flame.<br />
                                    4. Observe with naked eye & blue glass.
                                </p>
                            </div>
                        </div>

                        {/* Reset Button - Smaller on mobile */}
                        <button
                            onClick={reset}
                            className="w-full py-2.5 md:py-3 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-lg md:rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-gray-700 text-sm md:text-base"
                        >
                            <RotateCcw size={16} />
                            Reset Burner
                        </button>
                    </div>

                    {/* Visualizer Area - Smaller on mobile */}
                    <div className="order-2 lg:order-1 relative h-[280px] md:h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl md:rounded-2xl border border-gray-700 flex flex-col items-center justify-end p-4 md:p-8 group overflow-hidden">

                        {/* Blue Glass Filter Overlay */}
                        <AnimatePresence>
                            {viewMode === 'blue-glass' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-40 bg-blue-900/40 backdrop-sepia-[.5] pointer-events-none border-4 md:border-[10px] border-gray-800 rounded-xl md:rounded-2xl flex items-start justify-end p-2 md:p-4"
                                >
                                    <div className="bg-blue-600/20 px-2 md:px-3 py-1 rounded-full border border-blue-400/30 text-[10px] md:text-xs font-bold text-blue-200 uppercase tracking-widest backdrop-blur-md">
                                        Blue Glass
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bunsen Burner Base - Smaller on mobile */}
                        <div className="w-16 md:w-24 h-4 md:h-6 bg-gray-600 rounded-b-lg shadow-lg relative z-20 mb-1 md:mb-2" />
                        <div className="w-3 md:w-4 h-16 md:h-24 bg-gray-500 relative z-10 gradient-metal" />
                        <div className="w-24 md:w-32 h-2 bg-gray-800 rounded-full absolute bottom-6 md:bottom-8 opacity-50 blur-md" />

                        {/* The Flame - Smaller on mobile */}
                        <div className="absolute bottom-20 md:bottom-32 left-1/2 -translate-x-1/2 w-16 md:w-20 h-48 md:h-64 flex justify-center items-end filter blur-md opacity-90 transition-all duration-500 mix-blend-screen z-10">
                            {/* Core Blue Flame */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    height: [60, 70, 60],
                                }}
                                transition={{ repeat: Infinity, duration: 0.15 }}
                                className="absolute bottom-0 w-6 md:w-8 h-16 md:h-24 bg-blue-600/80 rounded-full"
                            />

                            {/* Outer Coloured Flame */}
                            <AnimatePresence mode="wait">
                                {isBurning && currentData ? (
                                    <motion.div
                                        key={`colored-flame-${viewMode}`}
                                        initial={{ opacity: 0, height: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, height: 180, scale: 1.2 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`absolute bottom-0 w-12 md:w-16 bg-gradient-to-t rounded-full origin-bottom ${viewMode === 'blue-glass' ? currentData.blueGlassCssColor : currentData.cssColor}`}
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 70%, 80% 100%, 20% 100%, 0% 70%)'
                                        }}
                                    >
                                        <motion.div
                                            animate={{ opacity: [0.6, 1, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 0.1 }}
                                            className="w-full h-full bg-white/20 blur-xl block"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="blue-flame"
                                        animate={{ height: [100, 110, 100] }}
                                        transition={{ repeat: Infinity, duration: 0.2 }}
                                        className="absolute bottom-0 w-8 md:w-12 bg-blue-500/40 rounded-full blur-lg"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Label Overlay - Compact on mobile */}
                        <div className="absolute top-3 md:top-6 left-3 md:left-6 right-3 md:right-6 flex justify-between items-start z-50">
                            <div className="bg-black/60 backdrop-blur-md px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/10 shadow-lg">
                                <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider block mb-0.5">
                                    {viewMode === 'blue-glass' ? 'Blue Glass' : 'Naked Eye'}
                                </span>
                                <span className="text-sm md:text-xl font-bold text-white">
                                    {isBurning && currentData
                                        ? (viewMode === 'blue-glass' ? currentData.blueGlassColor : currentData.color)
                                        : "No Salt"}
                                </span>
                            </div>

                            {isBurning && currentData && (
                                <div className="bg-black/60 backdrop-blur-md px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-white/10 text-right shadow-lg">
                                    <span className="text-gray-400 text-[10px] md:text-xs uppercase tracking-wider block mb-0.5">Ion</span>
                                    <span className={`text-sm md:text-xl font-bold`} style={{ color: currentData.code }}>
                                        {currentData.symbol}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* View Mode Toggle - Compact on mobile */}
                        <div className="absolute bottom-3 md:bottom-6 right-3 md:right-6 z-50">
                            <button
                                onClick={() => setViewMode(prev => prev === 'naked' ? 'blue-glass' : 'naked')}
                                className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl border backdrop-blur-md transition-all shadow-lg text-xs md:text-sm ${viewMode === 'blue-glass'
                                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50'
                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                <Glasses size={14} />
                                <span className="font-semibold hidden md:inline">
                                    {viewMode === 'blue-glass' ? 'Remove Blue Glass' : 'Blue Glass Filter'}
                                </span>
                                <span className="font-semibold md:hidden">
                                    {viewMode === 'blue-glass' ? 'Remove' : 'Blue Glass'}
                                </span>
                            </button>
                        </div>

                        {/* Wire Tool Animation - Smaller on mobile */}
                        <AnimatePresence>
                            {isBurning && (
                                <motion.div
                                    initial={{ x: 150, y: -80, rotate: 45 }}
                                    animate={{ x: 40, y: 0, rotate: 10 }}
                                    exit={{ x: 150, y: -80 }}
                                    transition={{ duration: 0.5, type: 'spring' }}
                                    className="absolute right-0 bottom-28 md:bottom-40 w-32 md:w-48 h-1.5 md:h-2 bg-gray-400 origin-right shadow-xl z-30 pointer-events-none"
                                >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 rounded-full bg-white animate-pulse shadow-[0_0_15px_white]" />
                                    <div className="absolute right-[-16px] md:right-[-20px] top-1/2 -translate-y-1/2 w-24 md:w-32 h-4 md:h-6 bg-amber-900 rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Science Explanation - Collapsible on mobile */}
                <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-700/50">
                    <h3 className="text-base md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2">
                        <span className="text-xl md:text-2xl">💡</span> Why do elements show characteristic colors?
                    </h3>

                    <div className="flex flex-col gap-6 md:gap-12">
                        {/* Text Explanation - Smaller cards on mobile */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                            <div className="bg-gray-800/40 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-2 md:gap-3 font-bold text-cyan-400 mb-2 md:mb-3 text-sm md:text-lg">
                                    <span className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-cyan-400/20 text-xs md:text-sm">1</span>
                                    Electron Excitation
                                </h4>
                                <p className="text-xs md:text-base text-gray-300">
                                    Heat energy causes valence electrons to jump to higher energy levels.
                                </p>
                            </div>

                            <div className="bg-gray-800/40 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-2 md:gap-3 font-bold text-purple-400 mb-2 md:mb-3 text-sm md:text-lg">
                                    <span className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-purple-400/20 text-xs md:text-sm">2</span>
                                    Photon Emission
                                </h4>
                                <p className="text-xs md:text-base text-gray-300">
                                    Electrons fall back and release energy as light photons.
                                </p>
                            </div>

                            <div className="bg-gray-800/40 p-3 md:p-5 rounded-lg md:rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-2 md:gap-3 font-bold text-orange-400 mb-2 md:mb-3 text-sm md:text-lg">
                                    <span className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-orange-400/20 text-xs md:text-sm">3</span>
                                    Unique Fingerprint
                                </h4>
                                <p className="text-xs md:text-base text-gray-300">
                                    Each element has unique energy gaps = unique flame color.
                                </p>
                            </div>
                        </div>

                        {/* Visual Animation */}
                        <div className="w-full">
                            <AtomicProcessVisualizer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
