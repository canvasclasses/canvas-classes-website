'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, TestTube, RotateCcw, Glasses } from 'lucide-react';
import AtomicProcessVisualizer from './AtomicProcessVisualizer';

const FLAME_DATA = [
    {
        id: 'Ca',
        name: 'Calcium (Ca²⁺)',
        color: 'Brick Red',
        cssColor: 'from-orange-500 via-red-500 to-orange-600',
        code: '#EF4444',
        blueGlassColor: 'Light Green',
        blueGlassCssColor: 'from-green-300 via-green-400 to-emerald-400'
    },
    {
        id: 'Sr',
        name: 'Strontium (Sr²⁺)',
        color: 'Crimson',
        cssColor: 'from-red-600 via-pink-600 to-red-500',
        code: '#DC2626',
        blueGlassColor: 'Purple',
        blueGlassCssColor: 'from-purple-500 via-fuchsia-600 to-purple-600'
    },
    {
        id: 'Ba',
        name: 'Barium (Ba²⁺)',
        color: 'Apple Green',
        cssColor: 'from-green-400 via-green-500 to-green-600',
        code: '#22C55E',
        blueGlassColor: 'Bluish Green',
        blueGlassCssColor: 'from-teal-400 via-cyan-500 to-teal-500'
    },
    {
        id: 'Cu',
        name: 'Copper (Cu²⁺)',
        color: 'Blue Green',
        cssColor: 'from-blue-500 via-cyan-400 to-green-400',
        code: '#3B82F6',
        blueGlassColor: 'Blue Green', // Same color
        blueGlassCssColor: 'from-blue-500 via-cyan-400 to-green-400'
    },
    {
        id: 'Na',
        name: 'Sodium (Na⁺)',
        color: 'Golden Yellow',
        cssColor: 'from-yellow-300 via-yellow-500 to-orange-400',
        code: '#EAB308',
        blueGlassColor: 'Pale / Invisible', // Na invisible through blue glass
        blueGlassCssColor: 'from-blue-900/10 via-blue-800/10 to-transparent'
    },
    {
        id: 'K',
        name: 'Potassium (K⁺)',
        color: 'Lilac',
        cssColor: 'from-purple-400 via-purple-500 to-violet-400',
        code: '#A855F7',
        blueGlassColor: 'Crimson / Purple',
        blueGlassCssColor: 'from-fuchsia-500 via-purple-600 to-pink-600'
    },
    {
        id: 'Li',
        name: 'Lithium (Li⁺)',
        color: 'Crimson Red',
        cssColor: 'from-red-500 via-rose-500 to-red-600',
        code: '#E11D48',
        blueGlassColor: 'Purple',
        blueGlassCssColor: 'from-purple-500 via-fuchsia-600 to-purple-600'
    },
    {
        id: 'Rb',
        name: 'Rubidium (Rb⁺)',
        color: 'Red Violet',
        cssColor: 'from-fuchsia-600 via-purple-600 to-fuchsia-700',
        code: '#9333EA',
        blueGlassColor: 'Violet',
        blueGlassCssColor: 'from-violet-600 via-indigo-600 to-purple-700'
    },
    {
        id: 'Cs',
        name: 'Cesium (Cs⁺)',
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
        <div className="w-full max-w-6xl mx-auto my-16 px-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                    <div className="p-3 bg-orange-500/20 rounded-xl">
                        <Flame className="text-orange-400" size={32} />
                    </div>
                    Virtual Flame Test
                    <span className="text-sm font-normal text-gray-400 bg-gray-800 px-3 py-1 rounded-full border border-gray-700 hidden sm:inline-block">
                        Interactive Simulator
                    </span>
                </h2>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Visualizer Area */}
                    <div className="relative h-[400px] bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 flex flex-col items-center justify-end p-8 group overflow-hidden">

                        {/* Blue Glass Filter Overlay */}
                        <AnimatePresence>
                            {viewMode === 'blue-glass' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-40 bg-blue-900/40 backdrop-sepia-[.5] pointer-events-none border-[10px] border-gray-800 rounded-2xl flex items-start justify-end p-4"
                                >
                                    <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-400/30 text-xs font-bold text-blue-200 uppercase tracking-widest backdrop-blur-md">
                                        Blue Glass Filter Active
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bunsen Burner Base */}
                        <div className="w-24 h-6 bg-gray-600 rounded-b-lg shadow-lg relative z-20 mb-2" />
                        <div className="w-4 h-24 bg-gray-500 relative z-10 gradient-metal" />
                        <div className="w-32 h-2 bg-gray-800 rounded-full absolute bottom-8 opacity-50 blur-md" />

                        {/* The Flame */}
                        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-20 h-64 flex justify-center items-end filter blur-md opacity-90 transition-all duration-500 mix-blend-screen z-10">
                            {/* Core Blue Flame (Always present) */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    height: [100, 110, 100],
                                }}
                                transition={{ repeat: Infinity, duration: 0.15 }}
                                className="absolute bottom-0 w-8 h-24 bg-blue-600/80 rounded-full"
                            />

                            {/* Outer Coloured Flame */}
                            <AnimatePresence mode="wait">
                                {isBurning && currentData ? (
                                    <motion.div
                                        key={`colored-flame-${viewMode}`}
                                        initial={{ opacity: 0, height: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, height: 260, scale: 1.4 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`absolute bottom-0 w-16 bg-gradient-to-t rounded-full origin-bottom ${viewMode === 'blue-glass' ? currentData.blueGlassCssColor : currentData.cssColor}`}
                                        style={{
                                            clipPath: 'polygon(50% 0%, 100% 70%, 80% 100%, 20% 100%, 0% 70%)'
                                        }}
                                    >
                                        {/* Flickering effect particles */}
                                        <motion.div
                                            animate={{ opacity: [0.6, 1, 0.6] }}
                                            transition={{ repeat: Infinity, duration: 0.1 }}
                                            className="w-full h-full bg-white/20 blur-xl block"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="blue-flame"
                                        animate={{ height: [150, 160, 150] }}
                                        transition={{ repeat: Infinity, duration: 0.2 }}
                                        className="absolute bottom-0 w-12 bg-blue-500/40 rounded-full blur-lg"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Label Overlay */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-50">
                            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 shadow-lg">
                                <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Observation ({viewMode === 'blue-glass' ? 'Blue Glass' : 'Naked Eye'})</span>
                                <span className="text-xl font-bold text-white">
                                    {isBurning && currentData
                                        ? (viewMode === 'blue-glass' ? currentData.blueGlassColor : currentData.color)
                                        : "Non-Luminous Flame"}
                                </span>
                            </div>

                            {isBurning && currentData && (
                                <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-right shadow-lg">
                                    <span className="text-gray-400 text-xs uppercase tracking-wider block mb-1">Inference</span>
                                    <span className={`text-xl font-bold`} style={{ color: currentData.code }}>
                                        {currentData.name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* View Mode Toggle (Now inside the visualizer for context) */}
                        <div className="absolute bottom-6 right-6 z-50">
                            <button
                                onClick={() => setViewMode(prev => prev === 'naked' ? 'blue-glass' : 'naked')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md transition-all shadow-lg ${viewMode === 'blue-glass'
                                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-500/50'
                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                <Glasses size={18} />
                                <span className="font-semibold text-sm">
                                    {viewMode === 'blue-glass' ? 'Remove Blue Glass' : 'Blue Glass Filter'}
                                </span>
                            </button>
                        </div>

                        {/* Wire Tool Animation */}
                        <AnimatePresence>
                            {isBurning && (
                                <motion.div
                                    initial={{ x: 200, y: -100, rotate: 45 }}
                                    animate={{ x: 60, y: 0, rotate: 10 }}
                                    exit={{ x: 200, y: -100 }}
                                    transition={{ duration: 0.5, type: 'spring' }}
                                    className="absolute right-0 bottom-40 w-48 h-2 bg-gray-400 origin-right shadow-xl z-30 pointer-events-none"
                                >
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white animate-pulse shadow-[0_0_15px_white]" />
                                    <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-32 h-6 bg-amber-900 rounded-full" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Select a Salt for Test:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {FLAME_DATA.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleTest(item.id)}
                                        className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden group ${selectedIon === item.id
                                            ? 'bg-gray-800 border-white/50 shadow-lg shadow-white/5 scale-[1.02]'
                                            : 'bg-gray-800/40 border-gray-700 hover:bg-gray-700/60 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${selectedIon === item.id ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundColor: item.code }} />
                                        <div className="flex items-center justify-between z-10 relative">
                                            <span className="font-semibold text-white">{item.name}</span>
                                            {selectedIon === item.id && <Flame size={16} className="text-orange-400 animate-pulse" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 bg-blue-900/20 border border-blue-500/20 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-16 bg-blue-500/5 rounded-full blur-2xl" />
                            <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2 relative z-10">
                                <TestTube size={18} />
                                Procedure
                            </h4>
                            <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                                1. Clean a platinum wire with concentrated HCl.<br />
                                2. Dip the wire in the salt sample.<br />
                                3. Place it in the non-luminous part of the Bunsen flame.<br />
                                4. Observe color with naked eye and through blue glass.
                            </p>
                        </div>

                        <button
                            onClick={reset}
                            className="w-full py-3 bg-gray-800/80 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-gray-700"
                        >
                            <RotateCcw size={18} />
                            Reset Burner
                        </button>
                    </div>
                </div>

                {/* Science Explanation */}
                <div className="mt-12 pt-8 border-t border-gray-700/50">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="text-2xl">💡</span> Why do elements show characteristic colors?
                    </h3>


                    <div className="flex flex-col gap-12">
                        {/* Text Explanation */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-3 font-bold text-cyan-400 mb-3 text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-400/20 text-sm">1</span>
                                    Electron Excitation
                                </h4>
                                <p className="text-base text-gray-300">
                                    When a salt is heated in a flame, the thermal energy is absorbed by the metal ion. This energy causes valence electrons to jump from their stable ground state to a higher, unstable energy level (excited state).
                                </p>
                            </div>

                            <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-3 font-bold text-purple-400 mb-3 text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-400/20 text-sm">2</span>
                                    Photon Emission
                                </h4>
                                <p className="text-base text-gray-300">
                                    The excited state is unstable. As the electron instantly falls back to the ground state, it releases the absorbed energy as a photon of light. The energy of this photon determines the color we see.
                                </p>
                            </div>

                            <div className="bg-gray-800/40 p-5 rounded-xl border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                                <h4 className="flex items-center gap-3 font-bold text-orange-400 mb-3 text-lg">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-400/20 text-sm">3</span>
                                    Unique Fingerprint
                                </h4>
                                <p className="text-base text-gray-300">
                                    Each element has a unique set of energy levels, meaning the "jump" distance is unique. This creates a specific wavelength (color) for each element, acting like an optical fingerprint.
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
