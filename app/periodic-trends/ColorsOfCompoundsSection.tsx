'use client';

import { useState } from 'react';
import { Beaker, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

// Increase subscript/superscript sizes for better readability
const formatFormula = (formula: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < formula.length) {
        const char = formula[i];
        
        // Handle subscript numbers (immediately after a letter or closing bracket)
        if (/\d/.test(char)) {
            const prevChar = formula[i - 1];
            if (prevChar && (/[A-Za-z\)\]]/.test(prevChar) || /\d/.test(prevChar))) {
                let num = char;
                i++;
                while (i < formula.length && /\d/.test(formula[i])) {
                    num += formula[i];
                    i++;
                }
                result.push(<sub key={key++} className="text-[0.75em] leading-none">{num}</sub>);
                continue;
            }
        }
        
        // Handle superscript charges
        if (char === '+' || char === '-') {
            result.push(<sup key={key++} className="text-[0.8em] leading-none">{char}</sup>);
            i++;
            continue;
        }
        
        // Handle dot for hydrates
        if (char === '·') {
            result.push(<span key={key++}>{char}</span>);
            i++;
            continue;
        }
        
        // Regular character
        result.push(<span key={key++}>{char}</span>);
        i++;
    }
    
    return result;
};

// Color data with header strip colors
const colorData = {
    aquatedIons: [
        { color: 'Colourless', strip: 'bg-slate-400', swatch: '#94a3b8', ions: ['Sc³⁺', 'Ti⁴⁺', 'Zn²⁺', 'Cu⁺', 'La³⁺', 'Lu³⁺'], note: 'd⁰ or d¹⁰' },
        { color: 'Violet', strip: 'bg-violet-600', swatch: '#8b5cf6', ions: ['V²⁺', 'Cr³⁺', 'Mn³⁺'], note: 'd³ config' },
        { color: 'Blue', strip: 'bg-blue-600', swatch: '#3b82f6', ions: ['V⁴⁺', 'Cr²⁺', 'Cu²⁺'], note: 'd¹, d⁴' },
        { color: 'Green', strip: 'bg-emerald-600', swatch: '#10b981', ions: ['Ni²⁺', 'Fe²⁺', 'V³⁺'], note: 'd², d⁶, d⁸' },
        { color: 'Pink', strip: 'bg-pink-600', swatch: '#ec4899', ions: ['Mn²⁺', 'Co³⁺', 'Co²⁺'], note: 'd⁵, d⁷' },
        { color: 'Yellow', strip: 'bg-amber-600', swatch: '#f59e0b', ions: ['Fe³⁺'], note: 'd⁵ high spin' },
    ],
    compounds: [
        { color: 'Black', strip: 'bg-slate-800', swatch: '#475569', compounds: ['FeS', 'CoS', 'NiS', 'CuS', 'Ag₂S', 'PbS'] },
        { color: 'White', strip: 'bg-slate-300', swatch: '#e2e8f0', compounds: ['ZnS', 'AgCl', 'BaSO₄', 'CaC₂O₄', 'PbSO₄', 'Mn(OH)₂'] },
        { color: 'Purple', strip: 'bg-purple-600', swatch: '#a855f7', compounds: ['KMnO₄', 'K₂Cr₂O₇(dil)', 'Ti³⁺'] },
        { color: 'Brown', strip: 'bg-orange-700', swatch: '#c2410c', compounds: ['Fe(OH)₃', 'Fe₂O₃', 'CdO'] },
        { color: 'Green', strip: 'bg-emerald-600', swatch: '#22c55e', compounds: ['Cr(OH)₃', 'Fe(OH)₂', 'Ni(OH)₂', 'Cr₂O₃'] },
        { color: 'Orange', strip: 'bg-orange-500', swatch: '#f97316', compounds: ['Cr₂O₇²⁻', 'CrO₃', 'K₂Cr₂O₇(conc)'] },
        { color: 'Peach', strip: 'bg-[#c98a6e]', swatch: '#e8a88a', compounds: ['MnS', 'FeS(ppt)'] },
        { color: 'Blue', strip: 'bg-blue-600', swatch: '#60a5fa', compounds: ['CuSO₄·5H₂O', '[Cu(NH₃)₄]²⁺'] },
    ],
    yellowFamily: {
        precipitates: ['PbCrO₄', 'BaCrO₄', 'As₂S₃', 'PbI₂', 'AgI', 'SnS₂', 'CdS', 'K₂CrO₄'],
        special: [
            { formula: '(NH₄)₃[As(Mo₃O₁₀)₄]', name: 'Amm. arsinomolybdate' },
            { formula: 'ZnO', name: 'hot = yellow' },
            { formula: 'Br₂(vap)', name: 'turns starch yellow' },
        ]
    }
};

export default function ColorsOfCompoundsSection() {
    const [expanded, setExpanded] = useState(false);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Compact Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">
                            Colors of Inorganic <span className="text-indigo-400">Ions & Compounds</span>
                        </h2>
                        <p className="text-xs text-slate-400">NCERT visual reference for JEE & NEET</p>
                    </div>
                </div>
                <button 
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300 hover:bg-slate-700/60 transition-colors"
                >
                    {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {expanded ? 'Collapse' : 'Expand'}
                </button>
            </div>

            {/* Quick Reference Grid - Always Visible */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {colorData.aquatedIons.map((item) => (
                    <div 
                        key={item.color}
                        className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-500 transition-all cursor-pointer"
                    >
                        {/* Colored header strip */}
                        <div className={`${item.strip} h-2`} />
                        <div className="p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.swatch }} />
                                <span className="text-sm font-medium text-slate-200">{item.color}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {item.ions.slice(0, expanded ? undefined : 3).map((ion) => (
                                    <span key={ion} className="text-sm font-medium text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded">
                                        {formatFormula(ion)}
                                    </span>
                                ))}
                                {!expanded && item.ions.length > 3 && (
                                    <span className="text-xs text-slate-500 self-center">+{item.ions.length - 3}</span>
                                )}
                            </div>
                            {expanded && (
                                <p className="text-xs mt-2 italic text-slate-500">{item.note}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Expanded Content */}
            {expanded && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Yellow Family */}
                    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                        <div className="bg-amber-600 h-2" />
                        <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm" />
                                <h3 className="text-sm font-medium text-amber-400">Yellow Family Compounds</h3>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {colorData.yellowFamily.precipitates.map((compound) => (
                                    <span key={compound} className="text-sm font-medium text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded">
                                        {formatFormula(compound)}
                                    </span>
                                ))}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {colorData.yellowFamily.special.map((item) => (
                                    <div key={item.formula} className="bg-slate-900/60 rounded px-2 py-1.5">
                                        <span className="text-sm font-medium text-slate-300 block">
                                            {formatFormula(item.formula)}
                                        </span>
                                        <span className="text-xs text-slate-500">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Colored Compounds Grid */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            Distinct Colored Compounds
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {colorData.compounds.map((item) => (
                                <div 
                                    key={`${item.color}-${item.compounds[0]}`}
                                    className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-500 transition-all cursor-pointer"
                                >
                                    <div className={`${item.strip} h-2`} />
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.swatch }} />
                                            <span className="text-sm font-medium text-slate-200">{item.color}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.compounds.map((compound) => (
                                                <span key={compound} className="text-sm font-medium text-slate-300 bg-slate-900/60 px-2 py-0.5 rounded">
                                                    {formatFormula(compound)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
