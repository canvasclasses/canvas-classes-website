import React, { useState } from 'react';
import { FlaskConical, ArrowDown, Scale, TrendingUp, TrendingDown } from 'lucide-react';

type AnionType = 'hydroxide' | 'sulfate';

const elements = [
    { name: 'Beryllium', symbol: 'Be', radius: 30, color: 'bg-gray-500' },
    { name: 'Magnesium', symbol: 'Mg', radius: 45, color: 'bg-gray-400' },
    { name: 'Calcium', symbol: 'Ca', radius: 60, color: 'bg-gray-300' },
    { name: 'Strontium', symbol: 'Sr', radius: 75, color: 'bg-gray-200' },
    { name: 'Barium', symbol: 'Ba', radius: 90, color: 'bg-white' },
];

export default function GroupTrendsSimulation() {
    const [period, setPeriod] = useState(0); // 0 = Be, 4 = Ba
    const [anion, setAnion] = useState<AnionType>('sulfate');

    // Simulation Math
    const calculateEnergy = (periodIndex: number, type: AnionType) => {
        // Base values (arbitrary units for visualization)
        // Down the group (index 0 to 4):
        // Cation size increases -> Lattice Energy DECREASES
        // Cation size increases -> Hydration Energy DECREASES (hydration depends on charge density)

        // The Key Difference: Which drops FASTER?

        if (type === 'hydroxide') {
            // SMALL ANION (OH-)
            // Lattice energy depends heavily on the small distance between M+ and OH-.
            // As M+ gets bigger, the % increase in distance is LARGE.
            // -> Lattice Energy crashes FAST.
            // Hydration Energy drops too, but slower.
            // Result: Hydration wins down the group -> Solubility INCREASES.

            const lattice = 100 - (periodIndex * 18); // Drops fast (100 -> 28)
            const hydration = 90 - (periodIndex * 12); // Drops slower (90 -> 42)
            return { lattice, hydration, label: 'Small Anion (OH⁻)' };
        } else {
            // LARGE ANION (SO4--)
            // Lattice is dominated by the huge size of Sulfate.
            // The cation getting bigger doesn't change `r+ + r-` that much proportionally.
            // -> Lattice Energy drops SLOWLY.
            // Hydration strictly follows cation size (1/r+).
            // -> Hydration Energy drops significantly (standard rate).
            // Result: Lattice wins down the group -> Solubility DECREASES.

            const lattice = 80 - (periodIndex * 5);  // Drops very slowly (80 -> 60)
            const hydration = 85 - (periodIndex * 15); // Drops normally (85 -> 25)
            return { lattice, hydration, label: 'Large Anion (SO₄²⁻)' };
        }
    };

    const { lattice, hydration, label } = calculateEnergy(period, anion);
    const netEnergy = hydration - lattice;
    // If Hydration > Lattice (positive net), it dissolves. 
    // If Lattice > Hydration (negative net), it precipitates.

    const isSoluble = netEnergy > -5; // Threshold with slight bias
    const precipitateOpacity = Math.max(0, Math.min(1, (lattice - hydration) / 40));

    return (
        <div className="w-full bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-8 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FlaskConical className="text-purple-400" />
                        Group 2 Solubility Lab
                    </h3>
                    <p className="text-gray-400 mt-1">Explore why solubility trends flip for different salts.</p>
                </div>

                {/* Anion Selector */}
                <div className="flex bg-gray-800/80 p-1.5 rounded-xl border border-gray-700">
                    <button
                        onClick={() => setAnion('sulfate')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${anion === 'sulfate'
                            ? 'bg-purple-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Large Anion (SO₄²⁻)
                    </button>
                    <button
                        onClick={() => setAnion('hydroxide')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${anion === 'hydroxide'
                            ? 'bg-rose-500 text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        Small Anion (OH⁻)
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 min-h-[500px]">

                {/* LEFT: Controls (The Group Slider) */}
                <div className="lg:col-span-4 p-8 border-r border-gray-800 bg-gray-900/30 flex flex-col">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                        <ArrowDown className="w-4 h-4" /> Group 2 Elements
                    </h4>

                    <div className="flex-1 flex gap-8 pl-4">
                        {/* Vertical Slider Track */}
                        <div className="relative w-2 h-full bg-gray-800 rounded-full">
                            <div
                                className="absolute w-6 h-6 bg-white rounded-full -left-2 shadow-[0_0_15px_rgba(255,255,255,0.5)] border-4 border-gray-900 cursor-grab active:cursor-grabbing transition-all duration-300"
                                style={{ top: `${(period / 4) * 95}%` }}
                            />
                            {/* Tick Marks */}
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="absolute left-6 text-sm font-mono font-medium flex items-center gap-3 cursor-pointer group"
                                    style={{ top: `${(i / 4) * 95}%`, transform: 'translateY(-50%)' }}
                                    onClick={() => setPeriod(i)}
                                >
                                    <span className={`w-3 h-3 rounded-full transition-colors ${period === i ? 'bg-purple-400' : 'bg-gray-700 group-hover:bg-gray-600'}`}></span>
                                    <span className={`${period === i ? 'text-white text-lg' : 'text-gray-500'} transition-all`}>
                                        {elements[i].symbol}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs uppercase">Current Ion</span>
                            <span className="text-white font-bold">{elements[period].name}</span>
                        </div>
                        <div className="h-24 flex items-center justify-center">
                            <div
                                className={`${elements[period].color} rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                                style={{
                                    width: elements[period].radius * 1.5,
                                    height: elements[period].radius * 1.5
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Visualization (The Beaker & Graph) */}
                <div className="lg:col-span-8 p-8 relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-blue-900/5 to-transparent pointer-events-none" />

                    <div className="grid md:grid-cols-2 gap-12 h-full">

                        {/* 1. Energy Bars Graph */}
                        <div className="flex flex-col justify-end space-y-8 pr-4">
                            {/* Lattice Bar */}
                            <div className="relative pt-6">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-rose-400 font-bold flex items-center gap-2"><ArrowDown className="w-4 h-4" /> Lattice Energy</span>
                                    <span className="text-rose-300/60 font-mono">{Math.round(lattice)}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-600 to-rose-400 transition-all duration-500 ease-out"
                                        style={{ width: `${lattice}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {anion === 'sulfate'
                                        ? 'decreases SLIGHTLY (Value is dominated by the huge size of anion)'
                                        : 'decreases RAPIDLY (Distance M-OH grows significantly as % change)'}
                                </p>
                            </div>

                            {/* Hydration Bar */}
                            <div className="relative pb-12 border-b border-gray-800">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-blue-400 font-bold flex items-center gap-2"><Scale className="w-4 h-4" /> Hydration Energy</span>
                                    <span className="text-blue-300/60 font-mono">{Math.round(hydration)}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500 ease-out"
                                        style={{ width: `${hydration}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {anion === 'sulfate'
                                        ? 'drops SIGNIFICANTLY (Hydration is highly sensitive to cation size growth)'
                                        : 'drops RAPIDLY (Similar to Lattice, but slightly slower)'}
                                </p>
                            </div>

                            {/* Result Text */}
                            <div className={`p-4 rounded-xl border transition-all duration-500 ${isSoluble ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                                <h5 className={`font-bold text-lg mb-1 flex items-center gap-2 ${isSoluble ? 'text-green-400' : 'text-red-400'}`}>
                                    {isSoluble ? 'Result: Soluble! 💧' : 'Result: Insoluble 🧱'}
                                </h5>
                                <p className="text-sm text-gray-400">
                                    {anion === 'sulfate' && !isSoluble &&
                                        "Hydration dropped faster than Lattice! Now Hydration < Lattice, so it precipitates."
                                    }
                                    {anion === 'hydroxide' && isSoluble &&
                                        "Lattice dropped faster than Hydration! Now Hydration > Lattice, so it dissolves."
                                    }
                                    {/* Fallback for start states */}
                                    {anion === 'sulfate' && isSoluble &&
                                        "Hydration is currently stronger than Lattice Energy."
                                    }
                                    {anion === 'hydroxide' && !isSoluble &&
                                        "Lattice Energy is currently dominating."
                                    }
                                </p>
                            </div>
                        </div>

                        {/* 2. Beaker Visual */}
                        <div className="relative flex items-center justify-center">
                            {/* Beaker Container */}
                            <div className="relative w-48 h-64 border-b-4 border-l-4 border-r-4 border-white/20 rounded-b-3xl mx-auto overflow-hidden bg-gradient-to-b from-transparent to-white/5 backdrop-blur-sm">
                                {/* Water Level */}
                                <div className="absolute bottom-0 w-full h-[80%] bg-blue-500/10 transition-all duration-1000">
                                    {/* Precipitate Cloud */}
                                    <div
                                        className="absolute bottom-0 w-full h-full bg-white transition-opacity duration-700 ease-in-out"
                                        style={{
                                            opacity: precipitateOpacity,
                                            filter: 'blur(20px)',
                                            transform: 'translateY(20px) scale(0.9)'
                                        }}
                                    />

                                    {/* Particles */}
                                    <div
                                        className="absolute w-full h-full flex items-center justify-center transition-opacity duration-500"
                                        style={{ opacity: isSoluble ? 1 : 0 }}
                                    >
                                        <div className="animate-pulse text-blue-300 font-bold text-xl tracking-widest">
                                            {elements[period].symbol}²⁺ (aq)
                                        </div>
                                    </div>

                                    <div
                                        className="absolute bottom-4 left-0 w-full text-center transition-opacity duration-500"
                                        style={{ opacity: !isSoluble ? 1 : 0 }}
                                    >
                                        <div className="text-white font-bold text-shadow-lg">
                                            {elements[period].symbol}{anion === 'sulfate' ? 'SO₄' : '(OH)₂'} Solid
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trend Indicator */}
                            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                                <span className="text-[10px] text-gray-500 uppercase rotate-90 w-24 text-center">Solubility Trend</span>
                                {anion === 'sulfate' ? (
                                    <TrendingDown className="text-red-400 w-8 h-8" />
                                ) : (
                                    <TrendingUp className="text-green-400 w-8 h-8" />
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
