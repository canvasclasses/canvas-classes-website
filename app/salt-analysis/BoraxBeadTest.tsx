'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, RotateCcw } from 'lucide-react';

// Advanced Glassy Bead Styles
// We use a base color and overlay gradients/shadows to create the 3D glass effect
const BEAD_STYLES = {
    // Copper
    Cu_Ox_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(134, 239, 172, 0.9) 0%, rgba(22, 163, 74, 0.8) 50%, rgba(20, 83, 45, 0.9) 100%)', shadow: '0 0 20px rgba(34, 197, 94, 0.6)' },
    Cu_Ox_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(96, 165, 250, 0.9) 0%, rgba(37, 99, 235, 0.8) 50%, rgba(30, 58, 138, 0.9) 100%)', shadow: '0 0 20px rgba(59, 130, 246, 0.6)' },
    Cu_Red_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 100%)', shadow: 'inset 0 0 10px rgba(255,255,255,0.5)' },
    Cu_Red_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(252, 165, 165, 1) 0%, rgba(185, 28, 28, 1) 50%, rgba(69, 10, 10, 1) 100%)', shadow: '0 0 15px rgba(127, 29, 29, 0.8)' }, // Opaque Red

    // Nickel
    Ni_Ox_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(196, 181, 253, 0.9) 0%, rgba(139, 92, 246, 0.8) 50%, rgba(76, 29, 149, 0.9) 100%)', shadow: '0 0 20px rgba(139, 92, 246, 0.6)' },
    Ni_Ox_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(217, 119, 6, 0.9) 0%, rgba(146, 64, 14, 0.85) 50%, rgba(69, 26, 3, 0.95) 100%)', shadow: '0 0 20px rgba(180, 83, 9, 0.6)' }, // Reddish Brown
    Ni_Red_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(209, 213, 219, 0.9) 0%, rgba(107, 114, 128, 0.8) 50%, rgba(31, 41, 55, 0.9) 100%)', shadow: '0 0 15px rgba(107, 114, 128, 0.6)' },
    Ni_Red_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(209, 213, 219, 0.9) 0%, rgba(107, 114, 128, 0.8) 50%, rgba(31, 41, 55, 0.9) 100%)', shadow: '0 0 15px rgba(107, 114, 128, 0.6)' },

    // Manganese
    Mn_Ox_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(233, 213, 255, 0.9) 0%, rgba(192, 132, 252, 0.8) 50%, rgba(88, 28, 135, 0.9) 100%)', shadow: '0 0 20px rgba(192, 132, 252, 0.6)' },
    Mn_Ox_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(233, 213, 255, 0.9) 0%, rgba(192, 132, 252, 0.8) 50%, rgba(88, 28, 135, 0.9) 100%)', shadow: '0 0 20px rgba(192, 132, 252, 0.6)' },
    Mn_Red_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 100%)', shadow: 'inset 0 0 10px rgba(255,255,255,0.5)' },
    Mn_Red_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0.1) 100%)', shadow: 'inset 0 0 10px rgba(255,255,255,0.5)' },

    // Iron
    Fe_Ox_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(253, 224, 71, 0.9) 0%, rgba(161, 98, 7, 0.8) 50%, rgba(66, 32, 6, 0.9) 100%)', shadow: '0 0 20px rgba(161, 98, 7, 0.6)' },
    Fe_Ox_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(254, 240, 138, 0.9) 0%, rgba(234, 179, 8, 0.8) 50%, rgba(113, 63, 18, 0.9) 100%)', shadow: '0 0 20px rgba(234, 179, 8, 0.6)' },
    Fe_Red_Hot: { background: 'radial-gradient(circle at 35% 35%, rgba(134, 239, 172, 0.9) 0%, rgba(22, 163, 74, 0.8) 50%, rgba(20, 83, 45, 0.9) 100%)', shadow: '0 0 20px rgba(22, 163, 74, 0.6)' },
    Fe_Red_Cold: { background: 'radial-gradient(circle at 35% 35%, rgba(134, 239, 172, 0.9) 0%, rgba(22, 163, 74, 0.8) 50%, rgba(20, 83, 45, 0.9) 100%)', shadow: '0 0 20px rgba(22, 163, 74, 0.6)' },
};

const SIMPLIFIED_DATA = [
    {
        id: 'Cu',
        name: 'Copper (Cu²⁺)',
        oxidizing: { hot: 'Green', cold: 'Blue', styleHot: BEAD_STYLES.Cu_Ox_Hot, styleCold: BEAD_STYLES.Cu_Ox_Cold },
        reducing: { hot: 'Colourless', cold: 'Red Opaque', styleHot: BEAD_STYLES.Cu_Red_Hot, styleCold: BEAD_STYLES.Cu_Red_Cold }
    },
    {
        id: 'Ni',
        name: 'Nickel (Ni²⁺)',
        oxidizing: { hot: 'Violet', cold: 'Reddish Brown', styleHot: BEAD_STYLES.Ni_Ox_Hot, styleCold: BEAD_STYLES.Ni_Ox_Cold },
        reducing: { hot: 'Grey', cold: 'Grey', styleHot: BEAD_STYLES.Ni_Red_Hot, styleCold: BEAD_STYLES.Ni_Red_Cold }
    },
    {
        id: 'Mn',
        name: 'Manganese (Mn²⁺)',
        oxidizing: { hot: 'Light Violet', cold: 'Light Violet', styleHot: BEAD_STYLES.Mn_Ox_Hot, styleCold: BEAD_STYLES.Mn_Ox_Cold },
        reducing: { hot: 'Colourless', cold: 'Colourless', styleHot: BEAD_STYLES.Mn_Red_Hot, styleCold: BEAD_STYLES.Mn_Red_Cold }
    },
    {
        id: 'Fe',
        name: 'Iron (Fe³⁺)',
        oxidizing: { hot: 'Yellowish Brown', cold: 'Yellow', styleHot: BEAD_STYLES.Fe_Ox_Hot, styleCold: BEAD_STYLES.Fe_Ox_Cold },
        reducing: { hot: 'Green', cold: 'Green', styleHot: BEAD_STYLES.Fe_Red_Hot, styleCold: BEAD_STYLES.Fe_Red_Cold }
    }
];

export default function BoraxBeadTest() {
    const [selectedSalt, setSelectedSalt] = useState<string>('Cu');
    const [flameType, setFlameType] = useState<'oxidizing' | 'reducing'>('oxidizing');
    const [viewState, setViewState] = useState<'hot' | 'cold'>('cold'); // Default to cold to show final result immediately

    const currentSaltData = SIMPLIFIED_DATA.find(s => s.id === selectedSalt);
    const flameData = currentSaltData ? currentSaltData[flameType] : null;

    // Determine current visual style
    const currentStyle = viewState === 'hot' ? flameData?.styleHot : flameData?.styleCold;

    return (
        <div className="w-full max-w-6xl mx-auto my-8 md:my-16 px-2 md:px-4">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl md:rounded-3xl overflow-hidden shadow-2xl">

                {/* Header */}
                <div className="p-3 md:p-8 pb-0 grid lg:grid-cols-2 gap-6 md:gap-12">
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                            <div className="p-2 md:p-3 bg-teal-500/20 rounded-xl">
                                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-teal-400 shadow-[0_0_15px_#2dd4bf]" />
                            </div>
                            Borax Bead Test
                        </h2>
                        <div className="space-y-4 text-gray-200 text-base md:text-sm">
                            <p className="leading-relaxed">
                                The Borax Bead Test is used to identify metal ions. A transparent glassy bead of borax (Sodium Metaborate) reacts with metal salts to form characteristic coloured beads.
                            </p>
                            <p className="text-gray-400 text-sm">
                                Select a metal salt and flame type below to observe the bead colour.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-800/30 rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-700/50">
                        <h3 className="font-bold text-white mb-2 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                            <Info size={18} className="text-teal-400" />
                            Reaction Example (Copper)
                        </h3>
                        <div className="space-y-3 md:space-y-4 font-mono text-xs md:text-base w-full overflow-x-auto">
                            <div className="min-w-0">
                                <p className="text-gray-400 text-xs mb-1">Oxidizing Flame</p>
                                <p className="text-green-300 whitespace-nowrap md:whitespace-normal">CuSO₄ + B₂O₃ → Cu(BO₂)₂ + SO₃</p>
                                <p className="text-green-500 italic mt-1">Cupric metaborate (Blue-Green)</p>
                            </div>
                            <div className="pt-2 border-t border-gray-700">
                                <p className="text-gray-400 text-xs mb-1">Reducing Flame</p>
                                <div className="space-y-1">
                                    <p className="text-red-300 whitespace-nowrap md:whitespace-normal">2Cu(BO₂)₂ + 2NaBO₂ + C → ...</p>
                                    <p className="text-gray-400 leading-relaxed">
                                        Reduces to colourless <strong className="text-gray-200">Cuprous metaborate</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Simulator Area */}
                <div className="p-3 md:p-8 border-t border-gray-700/50 mt-6 md:mt-8 bg-black/20">
                    <div className="grid lg:grid-cols-12 gap-6 md:gap-8">

                        {/* Controls */}
                        <div className="lg:col-span-4 space-y-4 md:space-y-8">
                            {/* Salt Selection - Compact Grid */}
                            <div>
                                <label className="block text-xs md:text-sm font-bold text-teal-400 uppercase tracking-wider mb-2 md:mb-4">1. Select Metal Salt</label>
                                <div className="grid grid-cols-4 md:grid-cols-2 gap-2 md:gap-3">
                                    {SIMPLIFIED_DATA.map((salt) => (
                                        <button
                                            key={salt.id}
                                            onClick={() => setSelectedSalt(salt.id)}
                                            className={`p-2 md:p-4 rounded-lg md:rounded-xl text-center md:text-left transition-all duration-300 relative overflow-hidden group cursor-pointer ${selectedSalt === salt.id
                                                ? 'bg-teal-900/40 border border-teal-500/60 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                                                : 'bg-gray-800/40 border border-gray-700 hover:bg-gray-800 hover:border-gray-500'
                                                }`}
                                        >
                                            <span className={`font-bold text-xs md:text-base block ${selectedSalt === salt.id ? 'text-white' : 'text-gray-300'}`}>
                                                {salt.id} <span className="hidden md:inline">({salt.name.split(' ')[0]})</span>
                                            </span>
                                            {selectedSalt === salt.id && (
                                                <div className="absolute top-1 right-1 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-teal-400 shadow-[0_0_5px_#2dd4bf]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 lg:block lg:space-y-8">
                                {/* Flame Type */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-teal-400 uppercase tracking-wider mb-2 md:mb-4">2. Flame Type</label>
                                    <div className="flex lg:flex-row flex-col gap-2 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700">
                                        <button
                                            onClick={() => setFlameType('oxidizing')}
                                            className={`flex-1 py-1 md:py-3 px-1 md:px-4 rounded-lg text-[10px] md:text-sm font-bold transition-all cursor-pointer ${flameType === 'oxidizing'
                                                ? 'bg-blue-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:bg-white/5'
                                                }`}
                                        >
                                            Oxidizing
                                        </button>
                                        <button
                                            onClick={() => setFlameType('reducing')}
                                            className={`flex-1 py-1 md:py-3 px-1 md:px-4 rounded-lg text-[10px] md:text-sm font-bold transition-all cursor-pointer ${flameType === 'reducing'
                                                ? 'bg-yellow-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:bg-white/5'
                                                }`}
                                        >
                                            Reducing
                                        </button>
                                    </div>
                                </div>

                                {/* State Toggle */}
                                <div>
                                    <label className="block text-xs md:text-sm font-bold text-teal-400 uppercase tracking-wider mb-2 md:mb-4">3. Observe</label>
                                    <div className="flex lg:flex-row flex-col gap-2 bg-gray-900/50 p-1.5 rounded-xl border border-gray-700">
                                        <button
                                            onClick={() => setViewState('hot')}
                                            className={`flex-1 py-1 md:py-2 px-1 md:px-4 rounded-lg text-[10px] md:text-sm font-medium transition-all cursor-pointer ${viewState === 'hot'
                                                ? 'bg-red-600/80 text-white shadow'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            Hot
                                        </button>
                                        <button
                                            onClick={() => setViewState('cold')}
                                            className={`flex-1 py-1 md:py-2 px-1 md:px-4 rounded-lg text-[10px] md:text-sm font-medium transition-all cursor-pointer ${viewState === 'cold'
                                                ? 'bg-blue-500/40 text-white shadow border border-blue-400/30'
                                                : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            Cold
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* VISUALIZER - Side View */}
                        <div className="lg:col-span-8 relative min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-gray-900 to-black rounded-xl md:rounded-2xl border border-gray-800 flex flex-col items-center justify-center overflow-hidden">

                            {/* Realistic Flame (Static but pulsing) */}
                            <div className="absolute bottom-0 md:bottom-[-20px] w-64 h-[300px] md:h-[400px] flex justify-center items-end opacity-80 pointer-events-none">
                                <div className={`w-24 h-full blur-2xl rounded-t-[50%] mix-blend-screen opacity-60 animate-pulse-slow ${flameType === 'oxidizing' ? 'bg-blue-600' : 'bg-yellow-600'
                                    }`} />
                                <div className={`absolute bottom-0 w-12 h-[80%] blur-xl rounded-t-[50%] mix-blend-screen opacity-80 ${flameType === 'oxidizing' ? 'bg-cyan-400' : 'bg-orange-500'
                                    }`} />
                            </div>

                            {/* Wire Loop System */}
                            <div className="relative z-30 w-full max-w-[400px] h-[200px] flex items-center justify-center group cursor-pointer" onClick={() => setViewState(v => v === 'hot' ? 'cold' : 'hot')}>
                                {/* SVG Wire Shape */}
                                <svg width="100%" height="150" viewBox="0 0 400 150" className="drop-shadow-2xl">
                                    <defs>
                                        <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#9ca3af" />
                                            <stop offset="50%" stopColor="#e5e7eb" />
                                            <stop offset="100%" stopColor="#9ca3af" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M -50 75 L 180 75"
                                        stroke="url(#wireGradient)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 180 75 C 190 75, 200 75, 205 75 C 205 75, 205 50, 230 50 C 255 50, 255 100, 230 100 C 205 100, 205 75, 205 75 L 190 75"
                                        fill="none"
                                        stroke="url(#wireGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="drop-shadow-lg"
                                    />
                                </svg>

                                {/* THE BEAD */}
                                <div className="absolute left-[calc(50%+30px)] top-[calc(50%-2px)] -translate-x-1/2 -translate-y-1/2 w-[54px] h-[54px] flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`${selectedSalt}-${flameType}-${viewState}`}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-full h-full rounded-full relative z-40 transition-all duration-500"
                                            style={{
                                                background: currentStyle?.background,
                                                boxShadow: currentStyle?.shadow,
                                                backdropFilter: 'blur(2px)'
                                            }}
                                        >
                                            {/* Advanced Glass Lighting Effects */}
                                            {/* 1. Main Specular Highlight (Top Left - Soft) */}
                                            <div className="absolute top-[10%] left-[15%] w-[45%] h-[25%] rounded-[50%] bg-gradient-to-br from-white/90 to-transparent blur-[2px]" />

                                            {/* 2. Secondary Highlight (Top Right - Sharp) */}
                                            <div className="absolute top-[15%] right-[20%] w-[15%] h-[10%] rounded-full bg-white/70 blur-[1px]" />

                                            {/* 3. Bottom Reflection (Caustic bounce) */}
                                            <div className="absolute bottom-[10%] left-[20%] w-[60%] h-[20%] rounded-[50%] bg-gradient-to-t from-white/30 to-transparent blur-[3px]" />

                                            {/* 4. Edge Highlight (Rim Light) */}
                                            <div className="absolute inset-0 rounded-full border border-white/20" />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Result Label - Full width on mobile */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${selectedSalt}-${flameType}-${viewState}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-4 left-4 right-4 md:top-8 md:auto md:left-auto md:right-8 bg-black/90 text-white p-4 md:p-5 rounded-xl border border-gray-700 shadow-2xl min-w-[200px]"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">Observation</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${viewState === 'hot' ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'
                                            }`}>
                                            {viewState}
                                        </span>
                                    </div>
                                    <div className="text-xl md:text-2xl font-bold leading-tight text-white mb-1">
                                        {viewState === 'hot' ? flameData?.hot : flameData?.cold}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-400 mt-2 pt-2 border-t border-gray-800 flex justify-between">
                                        <span>{currentSaltData?.name}</span>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}
