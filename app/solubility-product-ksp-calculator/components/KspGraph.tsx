'use client';

import React, { useState, useMemo } from 'react';
import { Salt, categories as allCategories } from '@/app/lib/kspData';

interface KspGraphProps {
    salts: Salt[];
}

// Pastel color palette - soothing and elegant (for dark theme)
const ANION_COLORS: { [key: string]: { bar: string; accent: string; bg: string } } = {
    'Bromide': { bar: 'bg-rose-400/60', accent: 'text-rose-300', bg: 'bg-rose-500/10' },
    'Carbonate': { bar: 'bg-sky-400/60', accent: 'text-sky-300', bg: 'bg-sky-500/10' },
    'Chloride': { bar: 'bg-emerald-400/60', accent: 'text-emerald-300', bg: 'bg-emerald-500/10' },
    'Chromate': { bar: 'bg-amber-400/60', accent: 'text-amber-300', bg: 'bg-amber-500/10' },
    'Fluoride': { bar: 'bg-cyan-400/60', accent: 'text-cyan-300', bg: 'bg-cyan-500/10' },
    'Hydroxide': { bar: 'bg-violet-400/60', accent: 'text-violet-300', bg: 'bg-violet-500/10' },
    'Iodide': { bar: 'bg-pink-400/60', accent: 'text-pink-300', bg: 'bg-pink-500/10' },
    'Oxalate': { bar: 'bg-fuchsia-400/60', accent: 'text-fuchsia-300', bg: 'bg-fuchsia-500/10' },
    'Sulphate': { bar: 'bg-indigo-400/60', accent: 'text-indigo-300', bg: 'bg-indigo-500/10' },
    'Sulphide': { bar: 'bg-orange-400/60', accent: 'text-orange-300', bg: 'bg-orange-500/10' },
};

const DEFAULT_COLOR = { bar: 'bg-gray-400/60', accent: 'text-gray-300', bg: 'bg-gray-500/10' };

// Format Ksp with superscript
function formatKspDisplay(kspCoefficient: number, kspExponent: number): React.ReactNode {
    return (
        <span>
            {kspCoefficient} × 10<sup className="text-[0.7em]">{kspExponent}</sup>
        </span>
    );
}

export default function KspGraph({ salts }: KspGraphProps) {
    const [selectedAnion, setSelectedAnion] = useState<string>('Hydroxide');
    const [sortBy, setSortBy] = useState<'ksp' | 'name'>('ksp');

    // Group salts by anion category
    const saltsByAnion = useMemo(() => {
        const groups: { [key: string]: Salt[] } = {};
        salts.forEach(salt => {
            if (!groups[salt.category]) {
                groups[salt.category] = [];
            }
            groups[salt.category].push(salt);
        });

        // Sort each group
        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => {
                if (sortBy === 'ksp') {
                    return b.ksp - a.ksp; // Higher Ksp first (more soluble)
                }
                return a.name.localeCompare(b.name);
            });
        });

        return groups;
    }, [salts, sortBy]);

    // Calculate bar width using log scale
    const getBarWidth = (ksp: number): number => {
        const logKsp = Math.log10(ksp);
        const minLog = -60;
        const maxLog = 0;
        const percentage = ((logKsp - minLog) / (maxLog - minLog)) * 100;
        return Math.max(8, Math.min(100, percentage));
    };

    const saltsInCategory = saltsByAnion[selectedAnion] || [];
    const color = ANION_COLORS[selectedAnion] || DEFAULT_COLOR;

    return (
        <div className="space-y-6">
            {/* Anion Selection - Clean Tabs Style */}
            <div className="flex overflow-x-auto border-b border-gray-800 mb-6 bg-gray-900/30">
                {allCategories.map(cat => {
                    const isSelected = selectedAnion === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedAnion(cat)}
                            className={`px-6 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 hover:bg-white/5
                                ${isSelected
                                    ? `text-white ${ANION_COLORS[cat]?.accent.replace('text-', 'border-') || 'border-gray-500'}`
                                    : 'text-gray-500 border-transparent hover:text-gray-300'
                                }`}
                        >
                            {cat}s
                        </button>
                    );
                })}
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Bar Graph */}
                <div className="lg:col-span-2 bg-gray-900/60 rounded-2xl border border-gray-700/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-semibold ${color.accent}`}>
                            {selectedAnion}s
                            <span className="text-gray-500 font-normal text-sm ml-2">
                                ({saltsInCategory.length} salts)
                            </span>
                        </h3>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'ksp' | 'name')}
                            className="text-sm border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 bg-gray-800"
                        >
                            <option value="ksp">Sort by Ksp (High → Low)</option>
                            <option value="name">Sort by Name</option>
                        </select>
                    </div>

                    <div className="space-y-3">
                        {saltsInCategory.map((salt) => {
                            const barWidth = getBarWidth(salt.ksp);

                            return (
                                <div key={salt.formula} className="flex items-center gap-3">
                                    {/* Formula */}
                                    <div className="w-20 text-right flex-shrink-0">
                                        <span className="text-sm font-medium text-gray-200">
                                            {salt.formula}
                                        </span>
                                    </div>

                                    {/* Bar */}
                                    <div className="flex-1 max-w-xs">
                                        <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${color.bar} rounded-full transition-all duration-300`}
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Ksp Value */}
                                    <div className="w-24 flex-shrink-0">
                                        <span className="text-xs text-gray-400">
                                            {formatKspDisplay(salt.kspCoefficient, salt.kspExponent)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-500">
                        <span>← Less Soluble</span>
                        <span>More Soluble →</span>
                    </div>
                </div >

                {/* Right: Observations Panel */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-6">
                    <h4 className="text-amber-400 font-semibold mb-5 flex items-center gap-2">
                        <span className="text-xl">📝</span> Observations
                    </h4>

                    <div className="space-y-6">
                        {/* Quick Facts */}
                        <div>
                            <h5 className="text-base font-semibold text-orange-300 mb-3 flex items-center gap-2">
                                <span>📌</span> Quick Facts
                            </h5>
                            <div className="space-y-2">
                                <div className="pl-4 border-l-2 border-amber-500/50">
                                    <p className="text-gray-300 leading-relaxed">{saltsInCategory.length} {selectedAnion.toLowerCase()} salts in NCERT</p>
                                </div>
                                {saltsInCategory.length > 0 && (
                                    <>
                                        <div className="pl-4 border-l-2 border-amber-500/50">
                                            <p className="text-gray-300 leading-relaxed">Most soluble: <span className="text-white font-medium">{saltsInCategory[0]?.formula}</span></p>
                                        </div>
                                        <div className="pl-4 border-l-2 border-amber-500/50">
                                            <p className="text-gray-300 leading-relaxed">Least soluble: <span className="text-white font-medium">{saltsInCategory[saltsInCategory.length - 1]?.formula}</span></p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Color & Properties */}
                        <div className="pt-4 border-t border-gray-800/50">
                            <h5 className="text-base font-semibold text-orange-300 mb-3 flex items-center gap-2">
                                <span>🎨</span> Common Colors
                            </h5>
                            <div className="pl-4 border-l-2 border-amber-500/50">
                                <div className="text-gray-300 leading-relaxed">
                                    {selectedAnion === 'Hydroxide' && (
                                        <p>Most hydroxides are <span className="text-white font-medium">white</span>. Fe(OH)₃ is <span className="text-orange-400 font-medium">reddish-brown</span>, Cu(OH)₂ is <span className="text-blue-400 font-medium">blue</span>.</p>
                                    )}
                                    {selectedAnion === 'Chloride' && (
                                        <p>AgCl is <span className="text-white font-medium">white</span> (turns grey), PbCl₂ is <span className="text-white font-medium">white</span> (hot soluble).</p>
                                    )}
                                    {selectedAnion === 'Sulphide' && (
                                        <p>Most are <span className="text-white font-medium">colored</span>. CuS/PbS are <span className="text-center font-medium">black</span>, CdS is <span className="text-yellow-400 font-medium">yellow</span>.</p>
                                    )}
                                    {selectedAnion === 'Carbonate' && (
                                        <p>Most are <span className="text-white font-medium">white</span>. CuCO₃ is <span className="text-green-400 font-medium">green</span>.</p>
                                    )}
                                    {selectedAnion === 'Chromate' && (
                                        <p>Typically <span className="text-yellow-400 font-medium">yellow</span> (e.g. BaCrO₄, PbCrO₄).</p>
                                    )}
                                    {selectedAnion === 'Iodide' && (
                                        <p>AgI is <span className="text-yellow-300 font-medium">pale yellow</span>, PbI₂ is <span className="text-yellow-300 font-medium">golden</span>.</p>
                                    )}
                                    {selectedAnion === 'Bromide' && (
                                        <p>AgBr is <span className="text-yellow-200 font-medium">pale yellow</span>. PbBr₂ is <span className="text-white font-medium">white</span>.</p>
                                    )}
                                    {selectedAnion === 'Fluoride' && (
                                        <p>Most fluorides are <span className="text-white font-medium">white</span>.</p>
                                    )}
                                    {selectedAnion === 'Sulphate' && (
                                        <p>Most are <span className="text-white font-medium">white</span>. CuSO₄ is <span className="text-blue-400 font-medium">blue</span>.</p>
                                    )}
                                    {selectedAnion === 'Oxalate' && (
                                        <p>Generally <span className="text-white font-medium">white</span> crystalline solids.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* JEE Tip */}
                        <div className="pt-4 border-t border-gray-800/50">
                            <h5 className="text-base font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                <span>💡</span> JEE Tip
                            </h5>
                            <div className="pl-4 border-l-2 border-yellow-500/50">
                                <p className="text-gray-300 leading-relaxed">
                                    Remember: You cannot directly compare Ksp values of salts with different formulas (AB vs AB₂). Always calculate <span className="text-white font-medium">molar solubility</span> first!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    );
}
