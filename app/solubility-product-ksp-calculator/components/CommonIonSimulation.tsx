'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


// Types for our ions
type IonType = 'Ag' | 'Cl' | 'Na';
interface Ion {
    id: string;
    type: IonType;
    x: number;
    y: number;
    isPrecipitation?: boolean;
    delay?: number; // Added for staggered entry animation
}

export default function CommonIonSimulation() {
    const [hasAddedCommonIon, setHasAddedCommonIon] = useState(false);
    const [ions, setIons] = useState<Ion[]>([]);
    const [simulationStage, setSimulationStage] = useState<'equilibrium' | 'adding' | 'dissociating' | 'precipitating'>('equilibrium');

    // Initial setup: Saturated AgCl solution
    // Ag+ and Cl- are in dynamic equilibrium
    useEffect(() => {
        resetSimulation();
    }, []);

    const resetSimulation = () => {
        const initialIons: Ion[] = [];
        // Equilibrium: Ag+ and Cl- floating around
        for (let i = 0; i < 8; i++) {
            initialIons.push({
                id: `Ag-init-${i}`,
                type: 'Ag',
                x: Math.random() * 80 + 10,
                y: Math.random() * 50 + 20
            });
            initialIons.push({
                id: `Cl-init-${i}`,
                type: 'Cl',
                x: Math.random() * 80 + 10,
                y: Math.random() * 50 + 20
            });
        }
        setIons(initialIons);
        setSimulationStage('equilibrium');
        setHasAddedCommonIon(false);
    };

    const handleAddCommonIon = () => {
        if (hasAddedCommonIon) return;
        setHasAddedCommonIon(true);
        setSimulationStage('adding');

        // 1. Pour in NaCl (Paired initially)
        const newIons: Ion[] = [];
        const count = 10;

        for (let i = 0; i < count; i++) {
            // Pouring from the bottle mouth (approx center-top)
            const startX = 50 + (Math.random() * 10 - 5);
            const delay = 0.5 + (i * 0.15); // Spec up: Faster pouring (was 0.3)

            // Add Na+ (initially Clumped)
            newIons.push({
                id: `Na-new-${i}`,
                type: 'Na',
                x: startX,
                y: 10, // Start slightly inside the liquid
                delay: delay
            });
            // Add Cl- (initially Clumped)
            newIons.push({
                id: `Cl-new-${i}`,
                type: 'Cl',
                x: startX + 2,
                y: 10,
                delay: delay
            });
        }

        // Add them to state
        setIons(prev => [...prev, ...newIons]);

        // 2. Animate Dissociation (Move them apart after entry)
        // Wait for pouring to mostly finish before creating chaos
        setTimeout(() => {
            setSimulationStage('dissociating');
            setIons(prev => prev.map(ion => {
                if (ion.id.includes('new')) {
                    // Spread them out to random positions in solution
                    return {
                        ...ion,
                        x: Math.random() * 80 + 10,
                        y: Math.random() * 50 + 10,
                        delay: 0 // Remove entry delay for next move
                    };
                }
                return ion;
            }));
        }, 2500);

        // 3. React: Excess Cl- pushes Ag+ to precipitate
        // STRICTLY after dissociation is visible
        setTimeout(() => {
            setSimulationStage('precipitating');
            setIons(prev => {
                const agIons = prev.filter(ion => ion.type === 'Ag');
                const otherIons = prev.filter(ion => ion.type !== 'Ag');

                // Select 6 Ag+ to precipitate
                const migratingAg = agIons.slice(0, 6);
                const remainingAg = agIons.slice(6);

                return [...remainingAg, ...otherIons];
            });
        }, 5000); // 7s total: 4s pouring + 3s mixing
    };

    return (
        <div id="common-ion-simulation" className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-6 md:p-8 mt-12 scroll-mt-24">
            {/* 1. Header & Explanation (Top) */}
            {/* 1. Header & Explanation (Top) */}
            <div className="max-w-5xl mx-auto mb-12 space-y-8">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl">📚</span>
                        <h3 className="text-3xl font-bold text-white">Understanding Common Ion Effect</h3>
                    </div>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Why does adding salt make things precipitate? Let's look at it simply.
                    </p>
                </div>

                {/* Simplified Explanation Card */}
                <div className="bg-gray-800/40 rounded-2xl p-8 border border-gray-700/50 shadow-xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <h4 className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase text-sm tracking-widest">
                                    <span className="text-xl">🎉</span> The "Party Hall" Analogy
                                </h4>
                                <p className="text-base text-gray-200 leading-relaxed">
                                    Imagine a <strong>Party Hall</strong> (the solution) that has a strict limit on the number of chairs. This limit is called <strong>Ksp</strong>.
                                </p>
                            </div>

                            <ul className="space-y-4 text-base text-gray-300">
                                <li className="bg-gray-900/40 p-3 rounded-lg border-l-4 border-blue-500">
                                    <strong className="text-lg text-blue-400">1. Strict Limit (Equilibrium):</strong>
                                    <p className="mt-1 text-gray-300 text-base">
                                        The solution has a <strong>strict limit</strong> on how many ions it can hold (Ksp). It's completely full and cannot accept any more.
                                    </p>
                                </li>
                                <li className="bg-gray-900/40 p-3 rounded-lg border-l-4 border-yellow-500">
                                    <strong className="text-lg text-yellow-400">2. The Limit is Breached:</strong>
                                    <p className="mt-1 text-gray-300 text-base">
                                        When you pour in <strong>Cl⁻ ions</strong> (Common Ion), you instantly exceed this limit. The system is now unstable (Overcrowded).
                                    </p>
                                </li>
                                <li className="bg-gray-900/40 p-3 rounded-lg border-l-4 border-red-500">
                                    <strong className="text-lg text-red-400">3. Restoring Balance:</strong>
                                    <p className="mt-1 text-gray-300 text-base">
                                        To fix this breach, the extra ions <strong>must combine</strong> and leave the solution. They form solid precipitate until the count drops back to the allowed limit.
                                    </p>
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl p-6 border border-indigo-500/20">
                                <h4 className="text-indigo-300 font-bold mb-4 uppercase text-sm tracking-wider">⚗️ Real Chemistry Uses</h4>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-white font-semibold text-lg mb-2">1. Purifying Salt</p>
                                        <p className="text-base text-gray-300 leading-relaxed">
                                            We take impure salt water and pump <strong>Cl⁻ gas</strong> into it. Because of the overcrowding (Common Ion Effect), the pure NaCl is forced to precipitate out, leaving impurities behind in the water!
                                        </p>
                                    </div>
                                    <div className="w-full h-px bg-indigo-500/20"></div>
                                    <div>
                                        <p className="text-white font-semibold text-lg mb-2">2. Soap Making (Salting Out)</p>
                                        <p className="text-base text-gray-300 leading-relaxed">
                                            To separate soap from the reaction mixture, we add—you guessed it—<strong>Salt (NaCl)</strong>. The common Na⁺ ions overcrowd the solution, forcing the soap (RCOONa) to precipitate out as a solid bar.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transition to Simulation */}
                <div className="text-center pt-4">
                    <p className="text-gray-400 mb-3 text-sm font-medium uppercase tracking-widest">👇 See the "Overcrowding" in action 👇</p>
                    {/* Simplified Legend (Inline) */}
                    <div className="flex flex-wrap justify-center gap-8 text-base text-gray-400">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-400"></div>
                            <span>Ag⁺ <span className="text-xs">(Guest A)</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500 border border-green-600"></div>
                            <span>Cl⁻ <span className="text-xs">(Guest B)</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500 border border-purple-600"></div>
                            <span>Na⁺ <span className="text-xs">(Spectator)</span></span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Visual Beaker (Center) */}
            <div className="relative mx-auto max-w-lg h-80 bg-gradient-to-b from-blue-900/10 to-blue-900/30 rounded-xl border-x-2 border-b-4 border-gray-600/50 overflow-hidden shadow-inner mb-8">
                {/* Salt Bottle Animation */}
                <AnimatePresence>
                    {simulationStage === 'adding' && (
                        <motion.div
                            initial={{ y: -100, x: 150, rotate: 0, opacity: 0 }}
                            animate={{
                                y: 20,
                                x: 0, // Centered
                                opacity: 1,
                                rotate: -135, // Tilt to pour (upside down)
                                transition: { duration: 0.5, ease: "backOut" }
                            }}
                            exit={{ y: -100, opacity: 0, transition: { duration: 0.5 } }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
                        >
                            <div className="relative">
                                {/* Bottle Body */}
                                <div className="w-16 h-24 bg-white/90 rounded-xl border-2 border-gray-300 shadow-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-xs font-bold text-gray-800">NaCl</div>
                                        <div className="text-[8px] text-gray-500">Salt</div>
                                    </div>
                                </div>
                                {/* Bottle Neck */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-gray-200 border-2 border-gray-300 rounded-sm" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Water Level */}
                <div className="absolute top-8 left-0 right-0 h-1 bg-blue-400/20 w-full animate-pulse z-10" />
                <div className="absolute top-8 bottom-0 w-full bg-blue-500/5 z-0" />

                {/* Ions */}
                <AnimatePresence>
                    {ions.map((ion) => (
                        <motion.div
                            key={ion.id}
                            initial={simulationStage === 'adding' && ion.id.includes('new') ? {
                                opacity: 0,
                                left: '50%', // Start from bottle center
                                top: '15%'   // Start from bottle mouth height
                            } : false}
                            animate={{
                                opacity: 1,
                                left: `${ion.x}%`,
                                top: `${ion.y}%`,
                                y: [0, -4, 0, 4, 0],
                                x: [0, 2, 0, -2, 0],
                            }}
                            exit={{
                                opacity: 0,
                                top: "95%",
                                scale: 0.5,
                                transition: { duration: 1.5, ease: "easeInOut" }
                            }}
                            transition={{
                                left: { duration: 2.5, ease: "easeInOut", delay: ion.delay },
                                top: { duration: 2.5, ease: "easeInOut", delay: ion.delay },
                                y: { duration: 3 + Math.random(), repeat: Infinity, ease: "easeInOut" },
                                x: { duration: 4 + Math.random(), repeat: Infinity, ease: "easeInOut" },
                            }}
                            className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md z-20 transition-colors duration-500
                                ${ion.type === 'Ag' ? 'bg-gray-200 text-gray-800 border border-gray-400' :
                                    ion.type === 'Cl' ? 'bg-green-500 text-white border border-green-600' :
                                        'bg-purple-500 text-white border border-purple-600'}`}
                        >
                            {ion.type === 'Ag' ? 'Ag⁺' : ion.type === 'Cl' ? 'Cl⁻' : 'Na⁺'}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Precipitate Pile */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end px-12 pb-1 z-10">
                    <div className="relative w-full h-8">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div
                                key={`base-${i}`}
                                className="absolute w-3 h-3 rounded-full bg-gray-300 border border-gray-400 opacity-80"
                                style={{
                                    bottom: Math.random() * 10,
                                    left: `${Math.random() * 100}%`,
                                    transform: `scale(${0.7 + Math.random() * 0.5})`
                                }}
                            />
                        ))}
                        <AnimatePresence>
                            {simulationStage === 'precipitating' && Array.from({ length: 30 }).map((_, i) => (
                                <motion.div
                                    key={`precip-${i}`}
                                    initial={{ opacity: 0, y: -200, x: (Math.random() - 0.5) * 100 }}
                                    animate={{ opacity: 1, y: 0, x: 0 }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        type: "spring",
                                        bounce: 0.2
                                    }}
                                    className="absolute w-3 h-3 rounded-full bg-gray-200 border border-gray-400"
                                    style={{
                                        bottom: Math.random() * 25 + 5,
                                        left: `${Math.random() * 100}%`,
                                        zIndex: 20
                                    }}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                    <div className="absolute bottom-[-20px] text-[10px] text-gray-500 font-mono w-full text-center">AgCl(s)</div>
                </div>
            </div>

            {/* 3. Controls & Status (Bottom) */}
            <div className="max-w-lg mx-auto">
                {!hasAddedCommonIon ? (
                    <div className="flex gap-4 items-center">
                        <div className="flex-1 bg-gray-800/40 rounded-lg px-4 py-3 border border-gray-700/50 text-center">
                            <span className="text-emerald-400 font-medium block text-sm">Current State: Equilibrium</span>
                            <span className="text-xs text-gray-300">Rate(dissolution) = Rate(precipitation)</span>
                        </div>
                        <button
                            onClick={handleAddCommonIon}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/40 transition-all transform hover:scale-[1.02]"
                        >
                            + Pour NaCl
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center space-y-1 py-2">
                            <h4 className="text-xl font-bold text-amber-400">
                                {simulationStage === 'adding' ? 'Step 1: Adding Common Ion (Cl⁻)' :
                                    simulationStage === 'dissociating' ? 'Step 2: Dissociation increases [Cl⁻]' :
                                        'Step 3: Shift to Left (Precipitation)'}
                            </h4>
                            <p className="text-sm text-gray-400">
                                {simulationStage === 'adding' ? 'NaCl is entered into the system.' :
                                    simulationStage === 'dissociating' ? 'The system now has excess Cl⁻ ions.' :
                                        'System consumes excess Cl⁻ and Ag⁺ to form more solid AgCl.'}
                            </p>
                        </div>
                        <button
                            onClick={resetSimulation}
                            disabled={simulationStage === 'adding'}
                            className={`w-full py-3 rounded-xl font-medium transition-colors ${simulationStage === 'adding'
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                                }`}
                        >
                            ↺ Reset Simulation
                        </button>
                    </div>
                )}
            </div>


        </div>
    );
}
