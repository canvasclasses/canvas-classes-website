'use client';

import { Bookmark, FlaskConical } from 'lucide-react';

// Helper to format chemical formulas with subscripts
const formatFormula = (formula: string) => {
    const parts = formula.split(/(\d+|\[|\]|\+|-)/);
    return parts.map((part, index) => {
        // Handle superscripts (charge notation)
        if (/^[+-]$/.test(part) || /^\d+[+-]$/.test(part)) {
            return <sup key={index} className="text-[0.75em]">{part}</sup>;
        }
        // Handle subscripts (numbers)
        if (/^\d+$/.test(part) && index > 0 && /[A-Za-z)\]]$/.test(parts[index - 1])) {
            return <sub key={index} className="text-[0.85em] align-baseline">{part}</sub>;
        }
        return <span key={index}>{part}</span>;
    });
};

// Card hover styles
const cardHoverStyles = "hover:translate-y-[-4px] hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.4),0_8px_10px_-6px_rgba(0,0,0,0.4)] transition-all duration-200";

export default function ColorsOfCompoundsSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-12">
            {/* Header Section */}
            <div className="text-center mb-10 bg-gradient-to-br from-[#1A233A] to-[#111827] p-6 rounded-2xl shadow-lg border border-[#283550]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <Bookmark className="w-4 h-4 text-indigo-400" />
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs">Canvas Classes Study Material</span>
                </div>
                <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl tracking-tight mb-4">
                    Colours of Inorganic <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Ions & Compounds</span>
                </h1>
                <p className="mt-3 text-lg text-slate-400 max-w-3xl mx-auto font-medium">
                    Visual memorization guide for 3d series aquated ions, precipitates, and distinct chemical compounds.
                </p>
            </div>

            {/* Section 1: Aquated Ions of 3d Series */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-7 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    <h3 className="text-xl font-extrabold text-white">1. Aquated Ions of 3d Series</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Colourless / White */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-slate-500 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 to-slate-500" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full border-2 border-slate-600 bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                            <div>
                                <h4 className="font-bold text-sm text-slate-100">Colourless / White</h4>
                                <p className="text-xs text-slate-400 font-medium">d<sup>0</sup> or d<sup>10</sup> config</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-slate-200 font-mono font-semibold text-sm">
                            {['Sc³⁺', 'Ti⁴⁺', 'Zn²⁺', 'Cu⁺', 'La³⁺', 'Lu³⁺'].map((ion) => (
                                <span key={ion} className="bg-black/30 px-2 py-1 rounded border border-slate-700">
                                    {formatFormula(ion)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Violet */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-violet-500/50 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 shadow-[0_0_10px_rgba(167,139,250,0.4)]" />
                            <h4 className="font-bold text-sm text-violet-300">Violet</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-violet-200 font-mono font-semibold text-sm">
                            {['V²⁺', 'Cr³⁺', 'Mn³⁺'].map((ion) => (
                                <span key={ion} className="bg-violet-950/40 px-2 py-1 rounded border border-violet-800/50">
                                    {formatFormula(ion)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Blue */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-blue-500/50 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 shadow-[0_0_10px_rgba(96,165,250,0.4)]" />
                            <h4 className="font-bold text-sm text-blue-300">Blue</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-blue-200 font-mono font-semibold text-sm">
                            {['V⁴⁺', 'Cr²⁺', 'Cu²⁺'].map((ion) => (
                                <span key={ion} className="bg-blue-950/40 px-2 py-1 rounded border border-blue-800/50">
                                    {formatFormula(ion)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Green */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-emerald-500/50 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                            <h4 className="font-bold text-sm text-emerald-300">Green</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-emerald-200 font-mono font-semibold text-sm">
                            {['Ni²⁺', 'Fe²⁺', 'V³⁺'].map((ion) => (
                                <span key={ion} className="bg-emerald-950/40 px-2 py-1 rounded border border-emerald-800/50">
                                    {formatFormula(ion)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Pink / Blue Pink */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-pink-500/50 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-400" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 shadow-[0_0_10px_rgba(244,114,182,0.4)]" />
                            <h4 className="font-bold text-sm text-pink-300">Pink / Blue-Pink</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-pink-200 font-mono font-semibold text-sm items-center">
                            <span className="bg-pink-950/40 px-2 py-1 rounded border border-pink-800/50 flex flex-col items-center justify-center">
                                <span>{formatFormula('Mn²⁺')}</span>
                                <span className="text-[0.5rem] uppercase tracking-wider text-pink-400 font-sans font-bold mt-0.5">Pink</span>
                            </span>
                            {['Co³⁺', 'Co²⁺'].map((ion) => (
                                <span key={ion} className="bg-pink-950/40 px-2 py-1 rounded border border-pink-800/50">
                                    {formatFormula(ion)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Yellow */}
                    <div className={`rounded-xl shadow-sm p-4 relative overflow-hidden border border-slate-700 bg-[#151D2F] hover:border-amber-400/50 ${cardHoverStyles}`}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-yellow-400" />
                        <div className="flex items-center gap-2 mb-3 mt-1">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]" />
                            <h4 className="font-bold text-sm text-amber-300">Yellow</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 text-amber-200 font-mono font-semibold text-sm">
                            <span className="bg-amber-950/40 px-2 py-1 rounded border border-amber-800/50">
                                {formatFormula('Fe³⁺')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Yellow Compounds */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-7 w-1.5 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    <h3 className="text-xl font-extrabold text-white">2. The &quot;Yellow&quot; Family</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Standard Yellow - Takes 2 columns */}
                    <div className={`lg:col-span-2 rounded-xl p-5 shadow-sm border border-slate-700 bg-[#151D2F] hover:border-amber-400/50 ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-[0_0_10px_rgba(251,191,36,0.4)] rotate-3" />
                            <h4 className="font-bold text-lg text-amber-300">Yellow Ppt. & Compounds</h4>
                        </div>
                        <div className="flex flex-wrap gap-2 text-amber-100 font-mono font-semibold text-sm">
                            {['PbCrO₄', 'BaCrO₄', 'As₂S₃', 'PbI₂', 'AgI', 'SnS₂', 'CdS', 'K₂CrO₄', 'Na₂CrO₄', '(NH₄)₂S₂', 'K₃[Co(NO₂)₆]', 'K₄[Fe(CN)₆]'].map((compound) => (
                                <span key={compound} className="bg-[#1D1912] border border-amber-900/50 px-2.5 py-1 rounded shadow-sm">
                                    {formatFormula(compound)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Stacked */}
                    <div className="space-y-3 flex flex-col">
                        {/* Canary Yellow */}
                        <div className={`rounded-xl p-4 shadow-sm flex-1 border border-slate-700 hover:border-yellow-400/50 bg-[#171A15] ${cardHoverStyles}`}>
                            <h4 className="font-extrabold text-yellow-400 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.6)] inline-block" />
                                Canary Yellow
                            </h4>
                            <div className="flex flex-col gap-1.5 text-yellow-100 font-mono font-semibold text-sm">
                                <div className="bg-black/40 border border-yellow-900/50 px-2.5 py-1 rounded">
                                    {formatFormula('(NH₄)₃[As(Mo₃O₁₀)₄]')}
                                    <span className="block text-[0.65rem] font-sans font-medium text-yellow-500/80">Amm. arsinomolybdate</span>
                                </div>
                                <div className="bg-black/40 border border-yellow-900/50 px-2.5 py-1 rounded">
                                    {formatFormula('(NH₄)₃[P(Mo₃O₁₀)₄]')}
                                    <span className="block text-[0.65rem] font-sans font-medium text-yellow-500/80">Amm. phosphomolybdate</span>
                                </div>
                            </div>
                        </div>

                        {/* Greenish Yellow + Special Cases side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className={`rounded-xl p-3 shadow-sm border border-slate-700 hover:border-[#d4e09b]/50 bg-[#151D2F] ${cardHoverStyles}`}>
                                <h4 className="font-extrabold text-[#d4e09b] text-[0.65rem] uppercase tracking-wider mb-1.5">Greenish Yellow</h4>
                                <span className="text-[#e4ebb7] font-mono font-semibold text-lg bg-[#232912] border border-[#3e4822] px-2 py-0.5 rounded inline-block">
                                    {formatFormula('Cl₂')}
                                </span>
                            </div>

                            <div className={`rounded-xl p-3 shadow-sm bg-slate-800/30 border border-slate-700 hover:border-slate-500 ${cardHoverStyles}`}>
                                <h4 className="font-extrabold text-slate-400 text-[0.65rem] uppercase tracking-wider mb-1.5">Special Cases</h4>
                                <ul className="text-xs text-slate-300 space-y-1 font-medium">
                                    <li className="flex flex-col gap-0.5">
                                        <span className="font-mono font-semibold bg-black/50 border border-slate-700 px-1.5 py-0.5 rounded shadow-sm text-yellow-200 w-max">{formatFormula('ZnO')}</span>
                                        <span className="text-[0.65rem]">yellow when hot</span>
                                    </li>
                                    <li className="flex flex-col gap-0.5">
                                        <span className="font-mono font-semibold bg-black/50 border border-slate-700 px-1.5 py-0.5 rounded shadow-sm text-orange-200 w-max">{formatFormula('Br₂(vap)')}</span>
                                        <span className="text-[0.65rem]">turns starch yellow</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Other Precipitates and Compounds */}
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="h-7 w-1.5 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.3)]" />
                    <h3 className="text-xl font-extrabold text-white">3. Distinct Colored Compounds</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* Black */}
                    <div className={`text-white rounded-xl p-4 shadow-lg bg-[#0F141E] border border-slate-700 hover:border-slate-500 ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-black border border-slate-700 shadow-[0_0_8px_rgba(0,0,0,0.8)]" />
                            <h4 className="font-bold text-sm">Black</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono font-semibold text-xs text-slate-300">
                            {['FeS', 'CoS', 'NiS', 'CuS', 'Ag₂S'].map((compound) => (
                                <span key={compound} className="bg-black/60 px-2 py-0.5 rounded border border-slate-800">
                                    {formatFormula(compound)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* White - Takes 2 columns */}
                    <div className={`lg:col-span-2 rounded-xl p-4 shadow-sm border border-slate-700 bg-[#151D2F] hover:border-slate-500 ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-5 h-5 rounded-full bg-white border border-slate-300 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                            <h4 className="font-bold text-sm text-slate-100">White</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5 font-mono font-semibold text-xs text-slate-300">
                            {['ZnS', 'CuSO₄(anh)', 'salts of Cu⁺', 'BaSO₃', 'BaSO₄', 'NH₄Cl', 'AgCl', 'CaC₂O₄', 'SrSO₄', 'PbSO₄', 'Mn(OH)₂', 'Mg(NH₄)PO₄'].map((compound) => (
                                <span key={compound} className="bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                                    {formatFormula(compound)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Dark Purple */}
                    <div className={`rounded-xl p-4 shadow-md flex flex-col justify-between border border-slate-700 hover:border-purple-500/50 bg-[#151D2F] ${cardHoverStyles}`}>
                        <h4 className="font-bold text-xs text-purple-300 mb-2">Dark Purple</h4>
                        <span className="font-mono font-semibold text-sm bg-purple-950/60 border border-purple-800/50 text-purple-200 px-2 py-1 rounded">
                            {formatFormula('KMnO₄')}
                        </span>
                    </div>

                    {/* Reddish Brown */}
                    <div className={`rounded-xl p-4 shadow-md flex flex-col justify-between border border-slate-700 hover:border-orange-500/50 bg-[#151D2F] ${cardHoverStyles}`}>
                        <h4 className="font-bold text-xs text-orange-400 mb-2">Reddish Brown</h4>
                        <span className="font-mono font-semibold text-sm bg-[#2A1610] border border-orange-900/50 text-orange-200 px-2 py-1 rounded">
                            {formatFormula('Fe(OH)₃')}
                        </span>
                    </div>

                    {/* Green */}
                    <div className={`text-emerald-300 rounded-xl p-4 shadow-sm border border-slate-700 hover:border-emerald-500/50 bg-[#151D2F] ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                            <span className="font-bold text-xs text-emerald-400">Green</span>
                        </div>
                        <div className="flex flex-wrap gap-1 font-mono font-semibold text-xs text-emerald-100">
                            {['Cr(OH)₃', 'Fe(OH)₂', 'Ni(OH)₂', 'Cr(OH)₄⁻', 'Cr₂(SO₄)₃', 'MnO₄²⁻'].map((compound) => (
                                <span key={compound} className="bg-emerald-950/40 border border-emerald-900/50 px-1.5 py-0.5 rounded">
                                    {formatFormula(compound)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Orange */}
                    <div className={`text-orange-300 rounded-xl p-4 shadow-sm flex flex-col justify-center border border-slate-700 hover:border-orange-500/50 bg-[#151D2F] ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]" />
                            <span className="font-bold text-xs text-orange-400">Orange</span>
                        </div>
                        <span className="font-mono font-semibold text-base bg-[#2A1610] border border-orange-900/50 text-orange-200 px-2 py-1 rounded inline-block w-max">
                            {formatFormula('Cr₂O₇²⁻')}
                        </span>
                    </div>

                    {/* Peach */}
                    <div className={`text-orange-200 rounded-xl p-4 shadow-sm flex flex-col justify-center border border-slate-700 hover:border-[#ff936a]/50 bg-[#151D2F] ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff936a] shadow-[0_0_6px_rgba(255,147,106,0.5)] shrink-0" />
                            <span className="font-bold text-xs text-[#ff936a]">Peach</span>
                        </div>
                        <span className="font-mono font-semibold text-sm bg-[#271814] border border-[#3e241d] px-2 py-1 rounded text-[#ffd3c0] w-max">
                            {formatFormula('MnS')}
                        </span>
                    </div>

                    {/* Brown Black */}
                    <div className={`text-slate-300 rounded-xl p-4 shadow-md flex flex-col justify-center border border-slate-700 hover:border-[#4a3b32] bg-[#151D2F] ${cardHoverStyles}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 rounded-full bg-[#3a2d25] border border-[#4a3b32] shrink-0" />
                            <span className="font-bold text-xs text-[#8b7355]">Brown Black</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {['PbS', 'MnO₂'].map((compound) => (
                                <span key={compound} className="font-mono font-semibold text-sm bg-black/50 border border-[#3a2d25] px-2 py-0.5 rounded">
                                    {formatFormula(compound)}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
