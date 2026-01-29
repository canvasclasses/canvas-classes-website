'use client';

import { useState, useMemo } from 'react';
import { Salt, formatKsp, calculateSolubility, formatSolubility, getDissociationEquation, solubilityFormulas } from '@/app/lib/kspData';

interface ComparisonToolProps {
    salts: Salt[];
}

export default function ComparisonTool({ salts }: ComparisonToolProps) {
    const [salt1Formula, setSalt1Formula] = useState<string>('');
    const [salt2Formula, setSalt2Formula] = useState<string>('');

    const salt1 = salts.find(s => s.formula === salt1Formula);
    const salt2 = salts.find(s => s.formula === salt2Formula);

    const comparison = useMemo(() => {
        if (!salt1 || !salt2) return null;

        const sol1 = calculateSolubility(salt1);
        const sol2 = calculateSolubility(salt2);

        const moresoluble = sol1 > sol2 ? salt1 : salt2;
        const lesssoluble = sol1 > sol2 ? salt2 : salt1;
        const ratio = Math.max(sol1, sol2) / Math.min(sol1, sol2);

        const sameType = salt1.type === salt2.type;

        return {
            sol1,
            sol2,
            moresoluble,
            lesssoluble,
            ratio,
            sameType,
        };
    }, [salt1, salt2]);

    return (
        <div className="space-y-6">
            {/* Salt Selectors */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-2xl border border-blue-500/30 p-4">
                    <label className="text-blue-300 text-sm font-medium mb-2 block">Salt 1</label>
                    <select
                        value={salt1Formula}
                        onChange={(e) => setSalt1Formula(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                        <option value="">Choose first salt...</option>
                        {salts.map(salt => (
                            <option key={salt.formula} value={salt.formula} disabled={salt.formula === salt2Formula}>
                                {salt.name} ({salt.formula})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-slate-800/30 rounded-2xl border border-green-500/30 p-4">
                    <label className="text-green-300 text-sm font-medium mb-2 block">Salt 2</label>
                    <select
                        value={salt2Formula}
                        onChange={(e) => setSalt2Formula(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-green-500"
                    >
                        <option value="">Choose second salt...</option>
                        {salts.map(salt => (
                            <option key={salt.formula} value={salt.formula} disabled={salt.formula === salt1Formula}>
                                {salt.name} ({salt.formula})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Comparison Cards */}
            {salt1 && salt2 && comparison && (
                <>
                    {/* Warning for different types */}
                    {!comparison.sameType && (
                        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <h4 className="text-yellow-400 font-semibold">JEE Trap Warning!</h4>
                                    <p className="text-yellow-300/80 text-sm mt-1">
                                        These salts have different types ({salt1.type} vs {salt2.type}).
                                        You <strong>cannot compare Ksp values directly</strong>!
                                        We must calculate molar solubility first.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Side by Side Comparison */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Salt 1 Card */}
                        <div className={`bg-slate-800/30 rounded-2xl border p-4 space-y-3 ${comparison.moresoluble === salt1 ? 'border-green-500/50' : 'border-red-500/50'
                            }`}>
                            <h4 className="text-xl font-bold text-white">{salt1.name}</h4>
                            <p className="text-purple-300 font-mono text-lg">{salt1.formula}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type:</span>
                                    <span className="text-white">{salt1.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ksp:</span>
                                    <span className="text-cyan-300 font-mono">{formatKsp(salt1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Solubility:</span>
                                    <span className="text-green-300 font-mono">{formatSolubility(comparison.sol1)}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-700">
                                <div className="text-xs text-gray-500 mb-1">Dissociation:</div>
                                <div className="text-purple-300 font-mono text-sm">{getDissociationEquation(salt1)}</div>
                            </div>

                            <div className="pt-2">
                                <div className="text-xs text-gray-500 mb-1">Formula used:</div>
                                <div className="text-cyan-300 font-mono text-sm">{solubilityFormulas[salt1.type].formula}</div>
                            </div>

                            {comparison.moresoluble === salt1 ? (
                                <div className="bg-green-500/20 text-green-300 text-center py-2 rounded-lg font-semibold">
                                    ✓ More Soluble
                                </div>
                            ) : (
                                <div className="bg-red-500/20 text-red-300 text-center py-2 rounded-lg font-semibold">
                                    Less Soluble
                                </div>
                            )}
                        </div>

                        {/* Salt 2 Card */}
                        <div className={`bg-slate-800/30 rounded-2xl border p-4 space-y-3 ${comparison.moresoluble === salt2 ? 'border-green-500/50' : 'border-red-500/50'
                            }`}>
                            <h4 className="text-xl font-bold text-white">{salt2.name}</h4>
                            <p className="text-purple-300 font-mono text-lg">{salt2.formula}</p>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Type:</span>
                                    <span className="text-white">{salt2.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ksp:</span>
                                    <span className="text-cyan-300 font-mono">{formatKsp(salt2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Solubility:</span>
                                    <span className="text-green-300 font-mono">{formatSolubility(comparison.sol2)}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-700">
                                <div className="text-xs text-gray-500 mb-1">Dissociation:</div>
                                <div className="text-purple-300 font-mono text-sm">{getDissociationEquation(salt2)}</div>
                            </div>

                            <div className="pt-2">
                                <div className="text-xs text-gray-500 mb-1">Formula used:</div>
                                <div className="text-cyan-300 font-mono text-sm">{solubilityFormulas[salt2.type].formula}</div>
                            </div>

                            {comparison.moresoluble === salt2 ? (
                                <div className="bg-green-500/20 text-green-300 text-center py-2 rounded-lg font-semibold">
                                    ✓ More Soluble
                                </div>
                            ) : (
                                <div className="bg-red-500/20 text-red-300 text-center py-2 rounded-lg font-semibold">
                                    Less Soluble
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result Summary */}
                    <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
                        <h3 className="text-2xl font-bold text-white mb-2">
                            {comparison.moresoluble.name} is more soluble
                        </h3>
                        <p className="text-gray-300">
                            It is <span className="text-green-400 font-bold">{comparison.ratio.toFixed(1)}×</span> more soluble than {comparison.lesssoluble.name}
                        </p>

                        <div className="mt-4 text-sm text-gray-400">
                            {comparison.moresoluble.formula}: {formatSolubility(comparison.moresoluble === salt1 ? comparison.sol1 : comparison.sol2)} M
                            <span className="mx-3">vs</span>
                            {comparison.lesssoluble.formula}: {formatSolubility(comparison.lesssoluble === salt1 ? comparison.sol1 : comparison.sol2)} M
                        </div>
                    </div>
                </>
            )}

            {(!salt1 || !salt2) && (
                <div className="text-center py-12 text-gray-500">
                    Select two salts to compare their solubilities.
                </div>
            )}
        </div>
    );
}
