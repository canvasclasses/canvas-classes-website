import React from 'react';
import { Scale, Zap, Waves, GripHorizontal } from 'lucide-react';
import GroupTrendsSimulation from './GroupTrendsSimulation';
import AlkaliHalideSolubility from './AlkaliHalideSolubility';

export default function SolubilityExplanation() {
    return (
        <div className="w-full mb-24 max-w-7xl mx-auto">

            {/* Header Section */}
            <div className="mb-12 border-b border-gray-800 pb-8">
                <h3 className="text-3xl font-bold text-white mb-2">The &quot;<span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">Why</span>&quot; Behind Solubility</h3>
                <p className="text-gray-400 text-lg">Why does salt (NaCl) dissolve despite strong ionic bonds?</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

                {/* LEFT COLUMN: Narrative Flow (Span 7) */}
                <div className="lg:col-span-7 space-y-12">

                    {/* The Conflict */}
                    <div>
                        <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                            <span className="p-2 bg-rose-500/10 rounded-lg"><GripHorizontal className="w-5 h-5 text-rose-300" /></span>
                            The Challenge: Strong Ionic Bonds
                        </h4>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            In a solid crystal like NaCl, Na⁺ and Cl⁻ ions are locked together by powerful electric forces.
                            Breaking this requires huge energy (<span className="text-rose-300 font-medium">Lattice Energy</span>).
                            Yet, water breaks it easily. How?
                        </p>
                    </div>

                    {/* The Solution: Energy Battle */}
                    <div className="space-y-8">
                        {/* Factor 1 */}
                        <div className="pl-6 border-l-2 border-blue-500/30">
                            <h4 className="text-lg font-semibold text-blue-200 mb-2 flex items-center gap-2">
                                1. The Energy Payback
                            </h4>
                            <p className="text-gray-400 text-base leading-relaxed mb-2">
                                Water surrounds the ions, releasing <span className="text-blue-300 font-medium">Hydration Energy</span>.
                                If this energy is comparable to the lattice energy, the crystal weakens.
                            </p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/5 rounded-full border border-blue-500/20 text-blue-300 text-sm">
                                <span>Condition:</span>
                                <span className="font-semibold">Hydration ≈ Lattice</span>
                            </div>
                        </div>

                        {/* Factor 2 */}
                        <div className="pl-6 border-l-2 border-violet-500/30">
                            <h4 className="text-lg font-semibold text-violet-200 mb-2 flex items-center gap-2">
                                2. The Freedom 'Bonus' (Entropy)
                            </h4>
                            <p className="text-gray-400 text-base leading-relaxed mb-2">
                                Nature blindly favors disorder. Free ions swimming in water have much higher <span className="text-violet-300 font-medium">Entropy</span> than a rigid crystal.
                            </p>
                            <p className="text-gray-500 italic text-base">
                                This drive for freedom pushes the process forward, even if energy is tight.
                            </p>
                        </div>
                    </div>

                    {/* Minimal Summary */}
                    <div className="pt-6 border-t border-gray-800/50">
                        <p className="text-lg text-gray-300 leading-relaxed">
                            <span className="text-teal-400 font-semibold">TL;DR: </span>
                            Dissolution is a trade-off. We pay energy to break the bond, but we get paid back in <strong>Hydration Energy</strong> and <strong>Freedom (Entropy)</strong>.
                        </p>
                    </div>
                </div>

                {/* RIGHT COLUMN: Minimal Math Proof (Span 5) */}
                <div className="lg:col-span-5">
                    <div className="sticky top-8">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 border-b border-gray-800 pb-2">
                            Energetics Proof (NaCl)
                        </h4>

                        <div className="space-y-8 font-mono text-sm">
                            {/* Step 1 */}
                            <div className="group hover:bg-white/5 p-4 -mx-4 rounded-xl transition-colors">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-blue-300 font-sans font-medium">1. Enthalpy (Heat)</span>
                                    <span className="text-blue-400 bg-blue-500/10 px-2 py-1 rounded">ΔH = +4 kJ</span>
                                </div>
                                <div className="space-y-1 text-gray-500">
                                    <div className="flex justify-between"><span>Input (Break Lattice)</span> <span className="text-rose-400">+788</span></div>
                                    <div className="flex justify-between"><span>Output (Hydration)</span> <span className="text-teal-400">-784</span></div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="group hover:bg-white/5 p-4 -mx-4 rounded-xl transition-colors">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-violet-300 font-sans font-medium">2. Entropy (Disorder)</span>
                                    <span className="text-violet-400 bg-violet-500/10 px-2 py-1 rounded">TΔS = +13 kJ</span>
                                </div>
                                <div className="text-gray-500">
                                    The "Freedom Bonus" at room temp.
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="p-6 bg-teal-500/5 border border-teal-500/20 rounded-2xl">
                                <div className="text-center mb-2">
                                    <span className="text-teal-300 font-sans font-medium text-lg">Net Result (Gibbs Free Energy)</span>
                                </div>
                                <div className="flex justify-center items-center gap-3 text-lg text-gray-300 mb-3">
                                    <span className="text-blue-300">(+4)</span>
                                    <span>-</span>
                                    <span className="text-violet-300">(+13)</span>
                                    <span>=</span>
                                    <span className="text-teal-400 font-bold text-2xl">-9 kJ</span>
                                </div>
                                <p className="text-center text-teal-200/60 text-sm">
                                    Negative ΔG means <strong>Spontaneous Dissolving</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* NEW SECTION: Hydration Mechanics (Infographic) */}
            <div className="mt-24 mb-24">
                <div className="mb-10 flex items-end justify-between border-b border-gray-800 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">Deep Dive: The Hydration Shell</h3>
                        <p className="text-gray-400">How water molecules attack and stabilize ions</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Visual 1: Ion-Dipole Orientation (Realistic Solvation Shell) */}
                    <div className="bg-gray-900/40 rounded-3xl p-8 border border-gray-800/50">
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="bg-blue-500/10 text-blue-400 p-1.5 rounded-lg"><Zap className="w-4 h-4" /></span>
                            Ion-Dipole Interactions (Solvation)
                        </h4>

                        <div className="flex flex-col gap-8 py-4">
                            {/* Cation Solvation Shell - Horizontal Layout */}
                            <div className="flex items-center gap-6">
                                <div className="relative w-52 h-52 shrink-0">
                                    {/* Central Cation */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_30px_rgba(34,211,238,0.4)] z-20">
                                        +
                                    </div>

                                    {/* Water Molecules (O facing cation) - 8 molecules */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                        const rad = (angle * Math.PI) / 180;
                                        const dist = 38;
                                        const x = 50 + dist * Math.cos(rad);
                                        const y = 50 + dist * Math.sin(rad);
                                        const rotation = angle + 90;

                                        return (
                                            <div
                                                key={i}
                                                className="absolute z-10"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                                                }}
                                            >
                                                <div className="relative">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-md">
                                                        <span className="text-[8px] text-white font-bold">δ-</span>
                                                    </div>
                                                    <div className="absolute -top-2 -left-3 w-3.5 h-3.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-[6px] text-gray-700 font-bold">δ+</span>
                                                    </div>
                                                    <div className="absolute -top-2 -right-3 w-3.5 h-3.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-[6px] text-gray-700 font-bold">δ+</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <p className="text-cyan-300 font-semibold text-base mb-1">Cation (+)</p>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                                        <span className="text-rose-400 font-medium">Oxygen (δ-)</span> end of water points <span className="text-white">inward</span> towards the positive ion due to electrostatic attraction.
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-gray-800/50"></div>

                            {/* Anion Solvation Shell - Horizontal Layout */}
                            <div className="flex items-center gap-6">
                                <div className="relative w-52 h-52 shrink-0">
                                    {/* Central Anion */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-[0_0_30px_rgba(147,197,253,0.4)] z-20">
                                        −
                                    </div>

                                    {/* Water Molecules (H facing anion) - 8 molecules */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                        const rad = (angle * Math.PI) / 180;
                                        const dist = 40;
                                        const x = 50 + dist * Math.cos(rad);
                                        const y = 50 + dist * Math.sin(rad);
                                        const rotation = angle + 90;

                                        return (
                                            <div
                                                key={i}
                                                className="absolute z-10"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`
                                                }}
                                            >
                                                <div className="relative">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-md">
                                                        <span className="text-[8px] text-white font-bold">δ-</span>
                                                    </div>
                                                    <div className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-[6px] text-gray-700 font-bold">δ+</span>
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full flex items-center justify-center shadow-sm">
                                                        <span className="text-[6px] text-gray-700 font-bold">δ+</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <p className="text-blue-300 font-semibold text-base mb-1">Anion (−)</p>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-[220px]">
                                        <span className="text-gray-200 font-medium">Hydrogen (δ+)</span> ends of water point <span className="text-white">inward</span> towards the negative ion.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-4 border-t border-gray-800/50 flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full"></div>
                                <span>Oxygen (δ-)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full"></div>
                                <span>Hydrogen (δ+)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full"></div>
                                <span>Cation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full"></div>
                                <span>Anion</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual 2: Size Effect */}
                    <div className="bg-gray-900/40 rounded-3xl p-8 border border-gray-800/50">
                        <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            <span className="bg-orange-500/10 text-orange-400 p-1.5 rounded-lg"><Scale className="w-4 h-4" /></span>
                            2. The Size Effect (Charge Density)
                        </h4>

                        <div className="space-y-6">
                            {/* Small Ion */}
                            <div className="flex items-center gap-6 group hover:bg-white/5 p-3 rounded-xl transition-colors">
                                <div className="relative shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all">Li⁺</div>
                                </div>
                                <div className="grow">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-white font-medium text-sm">Small Ion (High Density)</span>
                                        <span className="text-blue-400 font-bold text-sm">High Hydration Energy 🔥</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 w-[95%]"></div>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1.5">
                                        Like a concentrated magnet. Pulls water strongly.
                                    </p>
                                </div>
                            </div>

                            {/* Large Ion */}
                            <div className="flex items-center gap-6 group hover:bg-white/5 p-3 rounded-xl transition-colors">
                                <div className="relative shrink-0">
                                    <div className="w-14 h-14 bg-indigo-900 rounded-full flex items-center justify-center text-sm font-bold text-indigo-300 border-2 border-indigo-500/30">Cs⁺</div>
                                </div>
                                <div className="grow">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-300 font-medium text-sm">Large Ion (Dilute Charge)</span>
                                        <span className="text-indigo-400 font-bold text-sm">Low Energy ❄️</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-800 w-[30%]"></div>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1.5">
                                        Charge is spread out. Holds water weakly.
                                    </p>
                                </div>
                            </div>

                            {/* Real-World Examples */}
                            <div className="mt-6 pt-6 border-t border-gray-800/50">
                                <h5 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                                    <span className="text-orange-400">💧</span> Why Small Ions Form Hydrated Salts
                                </h5>
                                <p className="text-gray-500 text-sm mb-4 leading-relaxed">
                                    Small ions have <span className="text-blue-400 font-medium">very high hydration enthalpies</span> due to their concentrated charge.
                                    This strong attraction for water means they retain water molecules even in their solid crystal form.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {/* Li+ */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">Li⁺</div>
                                            <span className="text-white text-base font-medium">Lithium</span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            <span className="text-blue-300">LiCl·H₂O</span> — Lithium chloride is so hygroscopic it&apos;s used as a desiccant!
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">ΔH<sub>hyd</sub> = −520 kJ/mol</p>
                                    </div>

                                    {/* Be2+ */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">Be²⁺</div>
                                            <span className="text-white text-base font-medium">Beryllium</span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            <span className="text-emerald-300">BeSO₄·4H₂O</span> — Extremely high charge density = tightly bound water.
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">ΔH<sub>hyd</sub> = −2494 kJ/mol 🔥</p>
                                    </div>

                                    {/* Mg2+ */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">Mg²⁺</div>
                                            <span className="text-white text-base font-medium">Magnesium</span>
                                        </div>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            <span className="text-purple-300">MgCl₂·6H₂O</span>, <span className="text-purple-300">MgSO₄·7H₂O</span> (Epsom Salt) — Forms multiple hydrates.
                                        </p>
                                        <p className="text-gray-500 text-xs mt-1">ΔH<sub>hyd</sub> = −1920 kJ/mol</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3">
                                    <p className="text-blue-300 text-sm leading-relaxed">
                                        <span className="font-semibold">💡 JEE/NEET Tip:</span> Down a group, hydration enthalpy <span className="text-white">decreases</span> (Li⁺ &gt; Na⁺ &gt; K⁺ &gt; Rb⁺ &gt; Cs⁺).
                                        That&apos;s why LiCl is deliquescent but NaCl is not!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW SECTION: Group Trends Simulation */}
            <div className="mt-24 mb-24">
                <GroupTrendsSimulation />
            </div>

            {/* NEW SECTION: Alkali Halide Solubility */}
            <AlkaliHalideSolubility />

            {/* NEW SECTION: NCERT Context (Clean Layout) */}
            <div className="mt-20 mb-24 max-w-4xl">
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <span className="text-purple-400">📚</span> Textbook Application
                    </h3>
                    <p className="text-gray-500">Standard examples from NCERT (Class 11, S-Block Elements)</p>
                </div>

                <div className="space-y-12">
                    {/* Problem 10.4 */}
                    <div className="pl-4 border-l-2 border-rose-500/30">
                        <h4 className="text-white font-medium text-lg mb-3">Problem 10.4</h4>
                        <p className="text-gray-300 italic mb-4 text-lg">
                            "Why does the solubility of alkaline earth metal hydroxides in water increase down the group?"
                        </p>
                        <div className="space-y-2">
                            <h5 className="text-rose-400 text-sm font-bold uppercase tracking-wider">Solution</h5>
                            <p className="text-gray-400 leading-relaxed">
                                Among alkaline earth metal hydroxides, the anion being common the cationic radius will influence the lattice enthalpy. Since <span className="text-white font-medium">lattice enthalpy decreases much more than the hydration enthalpy</span> with increasing ionic size, the solubility increases as we go down the group.
                            </p>
                        </div>
                    </div>

                    {/* Problem 10.5 */}
                    <div className="pl-4 border-l-2 border-teal-500/30">
                        <h4 className="text-white font-medium text-lg mb-3">Problem 10.5</h4>
                        <p className="text-gray-300 italic mb-4 text-lg">
                            "Why does the solubility of alkaline earth metal carbonates and sulphates in water decrease down the group?"
                        </p>
                        <div className="space-y-2">
                            <h5 className="text-teal-400 text-sm font-bold uppercase tracking-wider">Solution</h5>
                            <p className="text-gray-400 leading-relaxed">
                                The size of anions being much larger compared to cations, the <span className="text-white font-medium">lattice enthalpy will remain almost constant</span> within a particular group. Since the <span className="text-white font-medium">hydration enthalpies decrease down the group</span>, solubility will decrease as found for alkaline earth metal carbonates and sulphates.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW SECTION: Solubility Rules */}
            <div className="mt-32">
                <div className="mb-10 flex items-end justify-between border-b border-gray-800 pb-4">
                    <div>
                        <h3 className="text-2xl font-bold mb-1 flex items-center gap-3">
                            <span className="text-3xl">📋</span>
                            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">Solubility Rules</span>
                        </h3>
                        <p className="text-gray-400">Common patterns in water at 25°C</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Soluble Box - Pastel Blue */}
                    <div className="bg-slate-800/30 border border-slate-600/30 rounded-2xl p-6">
                        <h4 className="text-sky-300 font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-sky-400"></span> Always Soluble
                        </h4>
                        <div className="space-y-4">
                            {/* Alkali */}
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <p className="text-white text-lg font-medium mb-1">Alkali Metals &amp; Ammonium</p>
                                <p className="text-gray-500">Li⁺, Na⁺, K⁺, Rb⁺, Cs⁺, NH₄⁺</p>
                            </div>

                            {/* Nitrates */}
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <p className="text-white text-lg font-medium mb-1">Nitrates &amp; Acetates</p>
                                <p className="text-gray-500">NO₃⁻, CH₃COO⁻, ClO₃⁻</p>
                            </div>

                            {/* Halides */}
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-white text-lg font-medium mb-1">Halides (Cl, Br, I)</p>
                                        <p className="text-gray-500">Most are soluble</p>
                                    </div>
                                    <span className="text-xs font-medium text-amber-200 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 whitespace-nowrap">
                                        Except: Ag⁺, Pb²⁺, Hg₂²⁺
                                    </span>
                                </div>
                            </div>

                            {/* Sulfates */}
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-white text-lg font-medium mb-1">Sulfates (SO₄²⁻)</p>
                                        <p className="text-gray-500">Most are soluble</p>
                                    </div>
                                    <span className="text-xs font-medium text-amber-200 px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 whitespace-nowrap">
                                        Except: Ca²⁺, Sr²⁺, Ba²⁺, Pb²⁺
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Insoluble Box - Pastel Warm */}
                    <div className="bg-stone-800/30 border border-stone-600/30 rounded-2xl p-6">
                        <h4 className="text-amber-300 font-semibold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-400"></span> Generally Insoluble
                        </h4>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-white text-lg font-medium mb-1">Hydroxides (OH⁻)</p>
                                        <p className="text-gray-500">Insoluble except Rule #1</p>
                                    </div>
                                    <span className="text-xs font-medium text-sky-200 px-2 py-1 rounded-lg bg-sky-500/15 border border-sky-500/25 whitespace-nowrap">
                                        Ca, Sr, Ba slightly soluble
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <div className="flex justify-between items-start gap-4">
                                    <div>
                                        <p className="text-white text-lg font-medium mb-1">Carbonates &amp; Phosphates</p>
                                        <p className="text-gray-500">CO₃²⁻, PO₄³⁻, S²⁻, CrO₄²⁻</p>
                                    </div>
                                    <span className="text-xs font-medium text-sky-200 px-2 py-1 rounded-lg bg-sky-500/15 border border-sky-500/25 whitespace-nowrap">
                                        Except Alkali Metals
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-900/50 rounded-xl">
                                <p className="text-white text-lg font-medium mb-1">Sulfides (S²⁻)</p>
                                <p className="text-gray-500">Most transition metal sulfides</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
