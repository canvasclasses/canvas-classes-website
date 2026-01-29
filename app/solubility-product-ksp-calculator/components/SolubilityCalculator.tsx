'use client';

import { useState } from 'react';
import { Salt, formatKsp, calculateSolubility, formatSolubility, solubilityFormulas, getDissociationEquation } from '@/app/lib/kspData';
import CommonIonSimulation from './CommonIonSimulation';

interface SolubilityCalculatorProps {
    salts: Salt[];
}

export default function SolubilityCalculator({ salts }: SolubilityCalculatorProps) {
    const [selectedSalt, setSelectedSalt] = useState<Salt | null>(null);
    const [commonIon, setCommonIon] = useState<string>('');
    const [commonIonConc, setCommonIonConc] = useState<string>('');
    const [showCommonIon, setShowCommonIon] = useState(false);

    const handleSaltChange = (formula: string) => {
        const salt = salts.find(s => s.formula === formula);
        setSelectedSalt(salt || null);
        setShowCommonIon(false);
        setCommonIonConc('');
    };

    const solubility = selectedSalt ? calculateSolubility(selectedSalt) : 0;
    const formula = selectedSalt ? solubilityFormulas[selectedSalt.type] : null;

    // Helper to render scientific notation
    const formatNumber = (num: number) => {
        if (num === 0) return '0';
        const exp = Math.floor(Math.log10(num));
        const coef = (num / Math.pow(10, exp)).toFixed(2);
        return (
            <span className="whitespace-nowrap">
                {coef} × 10<sup className="text-[0.65em]">{exp}</sup>
            </span>
        );
    };

    // Calculate solubility with common ion effect
    const calculateWithCommonIon = (): { solubility: number; explanation: React.ReactNode[] } | null => {
        if (!selectedSalt || !commonIonConc) return null;

        const conc = parseFloat(commonIonConc);
        if (isNaN(conc) || conc <= 0) return null;

        const { ksp, type } = selectedSalt;
        const steps: React.ReactNode[] = [];
        let newSolubility: number;

        if (type === 'AB') {
            newSolubility = ksp / conc;
            steps.push(
                <span key="1">
                    For AB type: Ksp = s × [common ion]
                </span>
            );
            steps.push(
                <span key="2">
                    s = Ksp / [common ion] = {formatNumber(newSolubility)} M
                </span>
            );
        } else if (type === 'AB2' || type === 'A2B') {
            if (type === 'AB2') {
                newSolubility = ksp / (conc * conc);
                steps.push(
                    <span key="1">
                        For AB₂ type: Ksp = s × [common ion]²
                    </span>
                );
                steps.push(
                    <span key="2">
                        s = Ksp / [common ion]² = {formatNumber(newSolubility)} M
                    </span>
                );
            } else {
                newSolubility = Math.sqrt(ksp / (4 * conc));
                steps.push(
                    <span key="1">
                        For A₂B type: Ksp = [common ion]² × s
                    </span>
                );
                steps.push(
                    <span key="2">
                        Since 2 cations come from salt: Ksp ≈ [common ion]² × s
                    </span>
                );
                steps.push(
                    <span key="3">
                        s = {formatNumber(newSolubility)} M
                    </span>
                );
            }
        } else {
            newSolubility = ksp / (conc * conc * conc);
            steps.push(
                <span key="1">
                    Simplified calculation: s ≈ {formatNumber(newSolubility)} M
                </span>
            );
        }

        return { solubility: newSolubility, explanation: steps };
    };

    const commonIonResult = calculateWithCommonIon();

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Controls & Info */}
            <div className="lg:col-span-4 space-y-6">
                {/* Salt Selector */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5">
                    <label className="block text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Select Salt</label>
                    <select
                        value={selectedSalt?.formula || ''}
                        onChange={(e) => handleSaltChange(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-purple-500 transition-colors"
                    >
                        <option value="">Choose a salt...</option>
                        {salts.map(salt => (
                            <option key={salt.formula} value={salt.formula}>
                                {salt.name} ({salt.formula})
                            </option>
                        ))}
                    </select>

                    {selectedSalt && (
                        <div className="mt-4 pt-4 border-t border-gray-700/50 grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-gray-500 text-xs block">Type</span>
                                <span className="text-white font-medium">{selectedSalt.type}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xs block">Ksp Value</span>
                                <span className="text-purple-300 font-mono text-sm">{formatKsp(selectedSalt)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Common Ion Info Card */}
                <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-2xl border border-indigo-500/20 p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                            <span className="text-lg">📉</span>
                        </div>
                        <h4 className="text-white font-semibold">Common Ion Effect</h4>
                    </div>
                    <p className="text-indigo-200 text-sm leading-relaxed mb-3">
                        Adding a salt containing a common ion (like adding NaCl to AgCl solution) suppresses the dissociation of the weak salt.
                    </p>
                    <div className="bg-gray-900/40 rounded-lg p-3 border border-indigo-500/10">
                        <p className="text-xs text-gray-400 mb-2">
                            <strong className="text-indigo-300">Result:</strong> Solubility decreases significantly because the equilibrium shifts backward (Le Chatelier's Principle).
                        </p>
                        <a
                            href="#common-ion-simulation"
                            className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 flex items-center gap-1"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('common-ion-simulation')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <span>🎥 Watch Simulation</span>
                            <span>→</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Column: Calculation */}
            <div className="lg:col-span-8">
                {selectedSalt && formula ? (
                    <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 overflow-hidden flex flex-col h-full">
                        {/* Compact Header */}
                        <div className="bg-gray-800/40 px-6 py-4 border-b border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                {selectedSalt.name}
                                <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono">{selectedSalt.formula}</span>
                            </h3>
                            <div className="text-xs text-gray-500">
                                Standard Temperature (25°C)
                            </div>
                        </div>

                        <div className="p-0">
                            {/* Main Calculation - Compact Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-700/50">
                                {/* Steps Column */}
                                <div className="p-5 border-b md:border-b-0 md:border-r border-gray-700/50 space-y-5">
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Dissociation</div>
                                        <div className="text-white font-medium text-lg">{getDissociationEquation(selectedSalt)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Ksp Expression</div>
                                        <div className="text-purple-300 font-medium">{formula.expression}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1 uppercase tracking-wider">Formula</div>
                                        <div className="text-emerald-400 font-medium">{formula.formula}</div>
                                    </div>
                                </div>

                                {/* Result Column */}
                                <div className="bg-gradient-to-br from-emerald-900/10 to-gray-900/50 p-5 flex flex-col justify-center items-center text-center">
                                    <div className="text-gray-400 text-sm mb-2">Molar Solubility (s)</div>
                                    <div className="text-4xl font-bold text-emerald-400 filter drop-shadow-lg mb-1">
                                        {formatSolubility(solubility)}
                                    </div>
                                    <div className="text-gray-500 text-sm">mol/L</div>
                                </div>
                            </div>

                            {/* Common Ion Section - Compact */}
                            <div className="bg-gray-800/20">
                                <button
                                    onClick={() => setShowCommonIon(!showCommonIon)}
                                    className="w-full px-6 py-3 flex items-center justify-between text-gray-300 hover:text-white hover:bg-gray-700/30 transition-colors text-sm font-medium"
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-amber-400">⚡</span> Calculate with Common Ion
                                    </span>
                                    <span className="text-gray-500">{showCommonIon ? 'Hide' : 'Expand'}</span>
                                </button>

                                {showCommonIon && (
                                    <div className="px-6 pb-6 pt-2 animation-fade-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                                            <div className="sm:col-span-4">
                                                <label className="block text-gray-500 text-xs mb-1">Common Ion</label>
                                                <select
                                                    value={commonIon}
                                                    onChange={(e) => setCommonIon(e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                >
                                                    <option value="">Select ion</option>
                                                    <option value="cation">{selectedSalt.cation}</option>
                                                    <option value="anion">{selectedSalt.anion}</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-4">
                                                <label className="block text-gray-500 text-xs mb-1">Concentration (M)</label>
                                                <input
                                                    type="number"
                                                    placeholder="0.1"
                                                    value={commonIonConc}
                                                    onChange={(e) => setCommonIonConc(e.target.value)}
                                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm"
                                                    step="0.001"
                                                    min="0"
                                                />
                                            </div>
                                            <div className="sm:col-span-4">
                                                {commonIonResult ? (
                                                    <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2 text-right">
                                                        <div className="text-amber-400 font-bold text-lg leading-none">
                                                            {formatNumber(commonIonResult.solubility)} M
                                                        </div>
                                                        <div className="text-[10px] text-amber-500/70 mt-1">
                                                            Reduced by {((1 - commonIonResult.solubility / solubility) * 100).toFixed(0)}%
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-10 flex items-center text-gray-600 text-xs italic">
                                                        Enter conc. to calculate
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {commonIonResult && (
                                            <div className="mt-3 pt-3 border-t border-gray-700/30 text-xs text-gray-400 font-mono">
                                                {commonIonResult.explanation.map((step, i) => (
                                                    <div key={i} className="mb-0.5">{step}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-12 text-center h-full flex flex-col items-center justify-center text-gray-500">
                        <span className="text-4xl mb-3 opacity-50">⚗️</span>
                        <p>Select a salt from the left to view solubility details.</p>
                    </div>
                )}
            </div>

            {/* Full Width Simulation Section */}
            <div id="common-ion-simulation" className="lg:col-span-12">
                <CommonIonSimulation />
            </div>
        </div>
    );
}
