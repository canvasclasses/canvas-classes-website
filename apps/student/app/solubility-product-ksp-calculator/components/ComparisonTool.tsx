'use client';

import { useState, useMemo } from 'react';
import { Salt, formatKsp, calculateSolubility, formatSolubility, getDissociationEquation, solubilityFormulas, formatKspParts, formatSolubilityParts } from '@/app/lib/kspData';

interface ComparisonToolProps {
    salts: Salt[];
}

// Component to render Ksp/solubility with proper subscripts
function FormulaValue({ coefficient, exponent, color = 'text-cyan-300' }: { coefficient: number; exponent: number; color?: string }) {
    return (
        <span className={`${color} text-lg font-semibold`}>
            {coefficient} × 10<sup className="text-sm align-super">{exponent}</sup>
        </span>
    );
}

// Component to render solubility formula with proper formatting
function SolubilityFormula({ type }: { type: string }) {
    const formulas: Record<string, React.ReactNode> = {
        'AB': <span>s = √K<sub>sp</sub></span>,
        'AB2': <span>s = <sup>3</sup>√(K<sub>sp</sub>/4)</span>,
        'A2B': <span>s = <sup>3</sup>√(K<sub>sp</sub>/4)</span>,
        'AB3': <span>s = <sup>4</sup>√(K<sub>sp</sub>/27)</span>,
        'A3B': <span>s = <sup>4</sup>√(K<sub>sp</sub>/27)</span>,
        'A2B3': <span>s = <sup>5</sup>√(K<sub>sp</sub>/108)</span>,
    };

    return <span className="text-cyan-300 text-base">{formulas[type] || type}</span>;
}

// Generate specific conceptual explanation based on salt categories
function getConceptualExplanation(moreSoluble: Salt, lessSoluble: Salt): React.ReactNode {
    const cat1 = moreSoluble.category;
    const cat2 = lessSoluble.category;

    // Check if comparing silver halides
    if (moreSoluble.cation.includes('Ag') && lessSoluble.cation.includes('Ag') &&
        ['Chloride', 'Bromide', 'Iodide', 'Fluoride'].includes(cat1) &&
        ['Chloride', 'Bromide', 'Iodide', 'Fluoride'].includes(cat2)) {
        const halideOrder = ['Fluoride', 'Chloride', 'Bromide', 'Iodide'];
        const idx1 = halideOrder.indexOf(cat1);
        const idx2 = halideOrder.indexOf(cat2);

        if (idx1 < idx2) {
            return (
                <>
                    The <span className="text-cyan-400">{cat1.toLowerCase()} ion</span> is smaller than the {cat2.toLowerCase()} ion, giving it a <span className="text-cyan-400">higher charge density</span> and stronger attraction to water molecules. This results in a much higher hydration energy that easily overcomes the lattice energy. Additionally, larger halides like {cat2.toLowerCase()} have <span className="text-purple-400">increased covalent character</span> (Fajan&apos;s rules), making their lattice harder to break.
                </>
            );
        }
    }

    // Check if comparing hydroxides
    if (cat1 === 'Hydroxide' && cat2 === 'Hydroxide') {
        return (
            <>
                For hydroxides (small OH⁻ anion), <span className="text-cyan-400">lattice energy decreases faster</span> than hydration energy as cation size increases. {moreSoluble.formula} has a larger cation, so its lattice is easier to break apart while still releasing substantial hydration energy — making it more soluble.
            </>
        );
    }

    // Check if comparing sulfates
    if (cat1 === 'Sulphate' && cat2 === 'Sulphate') {
        return (
            <>
                For sulfates (large SO₄²⁻ anion), <span className="text-cyan-400">hydration energy decreases faster</span> than lattice energy as cation size increases. {moreSoluble.formula} has a smaller cation with higher charge density, attracting water molecules more effectively — the extra hydration energy overcomes the lattice.
            </>
        );
    }

    // Check if comparing carbonates
    if (cat1 === 'Carbonate' && cat2 === 'Carbonate') {
        return (
            <>
                Carbonates follow a pattern where the <span className="text-cyan-400">balance of lattice and hydration energies</span> depends on cation size. {moreSoluble.formula}&apos;s ions achieve a more favorable ratio — either through better hydration of smaller ions or weaker lattice forces with larger ions.
            </>
        );
    }

    // Default explanation for different categories
    return (
        <>
            {moreSoluble.formula} achieves a more favorable balance between lattice energy (energy to break the crystal) and hydration energy (energy released when ions dissolve). Its ions are either <span className="text-cyan-400">more effectively hydrated</span> by water due to higher charge density, or its crystal structure is <span className="text-purple-400">less tightly bound</span> due to larger ionic radii — resulting in more ions dissolving at equilibrium.
        </>
    );
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
        <div className="space-y-8">
            {/* Salt Selectors */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-6">
                    <label className="text-gray-400 text-sm font-medium mb-3 block uppercase tracking-wider">Salt 1</label>
                    <select
                        value={salt1Formula}
                        onChange={(e) => setSalt1Formula(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        <option value="">Choose first salt...</option>
                        {salts.map(salt => (
                            <option key={salt.formula} value={salt.formula} disabled={salt.formula === salt2Formula}>
                                {salt.name} ({salt.formula})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-6">
                    <label className="text-gray-400 text-sm font-medium mb-3 block uppercase tracking-wider">Salt 2</label>
                    <select
                        value={salt2Formula}
                        onChange={(e) => setSalt2Formula(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 rounded-xl px-5 py-4 text-white text-lg focus:outline-none focus:border-green-500 transition-colors"
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
                        <div className="bg-amber-500/10 border border-amber-500/40 rounded-2xl p-5">
                            <div className="flex items-start gap-4">
                                <span className="text-3xl">⚠️</span>
                                <div>
                                    <h4 className="text-amber-400 font-bold text-lg">JEE Trap Warning!</h4>
                                    <p className="text-amber-300/80 text-base mt-1 leading-relaxed">
                                        These salts have different types ({salt1.type} vs {salt2.type}).
                                        You <strong>cannot compare Ksp values directly</strong>!
                                        We must calculate molar solubility first.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Side by Side Comparison */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Salt 1 Card */}
                        <div className={`bg-gray-900/60 rounded-2xl border-2 p-6 space-y-5 ${comparison.moresoluble === salt1 ? 'border-emerald-500/60' : 'border-gray-700/50'}`}>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{salt1.name}</h4>
                                <p className="text-cyan-400 text-xl font-medium">{salt1.formula}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">Type</span>
                                    <span className="text-white text-lg font-medium">{salt1.type}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">K<sub>sp</sub></span>
                                    <FormulaValue coefficient={salt1.kspCoefficient} exponent={salt1.kspExponent} />
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">Solubility</span>
                                    <FormulaValue {...formatSolubilityParts(comparison.sol1)} color="text-emerald-300" />
                                </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Dissociation</div>
                                <div className="text-purple-300 text-base">{getDissociationEquation(salt1)}</div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Formula used</div>
                                <SolubilityFormula type={salt1.type} />
                            </div>

                            {comparison.moresoluble === salt1 ? (
                                <div className="bg-emerald-500/20 text-emerald-300 text-center py-3 rounded-xl font-bold text-lg border border-emerald-500/30">
                                    ✓ More Soluble
                                </div>
                            ) : (
                                <div className="bg-gray-800/50 text-gray-400 text-center py-3 rounded-xl font-semibold text-lg">
                                    Less Soluble
                                </div>
                            )}
                        </div>

                        {/* Salt 2 Card */}
                        <div className={`bg-gray-900/60 rounded-2xl border-2 p-6 space-y-5 ${comparison.moresoluble === salt2 ? 'border-emerald-500/60' : 'border-gray-700/50'}`}>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{salt2.name}</h4>
                                <p className="text-cyan-400 text-xl font-medium">{salt2.formula}</p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">Type</span>
                                    <span className="text-white text-lg font-medium">{salt2.type}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">K<sub>sp</sub></span>
                                    <FormulaValue coefficient={salt2.kspCoefficient} exponent={salt2.kspExponent} />
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400 text-base">Solubility</span>
                                    <FormulaValue {...formatSolubilityParts(comparison.sol2)} color="text-emerald-300" />
                                </div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Dissociation</div>
                                <div className="text-purple-300 text-base">{getDissociationEquation(salt2)}</div>
                            </div>

                            <div className="bg-gray-800/50 rounded-xl p-4">
                                <div className="text-gray-500 text-sm mb-2 uppercase tracking-wider">Formula used</div>
                                <SolubilityFormula type={salt2.type} />
                            </div>

                            {comparison.moresoluble === salt2 ? (
                                <div className="bg-emerald-500/20 text-emerald-300 text-center py-3 rounded-xl font-bold text-lg border border-emerald-500/30">
                                    ✓ More Soluble
                                </div>
                            ) : (
                                <div className="bg-gray-800/50 text-gray-400 text-center py-3 rounded-xl font-semibold text-lg">
                                    Less Soluble
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Result Summary */}
                    <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-8 text-center">
                        <div className="text-emerald-400 text-sm font-medium uppercase tracking-wider mb-2">Result</div>
                        <h3 className="text-3xl font-bold text-white mb-3">
                            {comparison.moresoluble.name} is more soluble
                        </h3>
                        <p className="text-gray-300 text-lg">
                            It is <span className="text-emerald-400 font-bold text-xl">{comparison.ratio.toFixed(1)}×</span> more soluble than {comparison.lesssoluble.name}
                        </p>

                        <div className="mt-6 pt-6 border-t border-gray-800 flex justify-center gap-8 text-base text-gray-400">
                            <div>
                                <span className="text-white font-medium">{comparison.moresoluble.formula}</span>: {formatSolubility(comparison.moresoluble === salt1 ? comparison.sol1 : comparison.sol2)} M
                            </div>
                            <span className="text-gray-600">vs</span>
                            <div>
                                <span className="text-white font-medium">{comparison.lesssoluble.formula}</span>: {formatSolubility(comparison.lesssoluble === salt1 ? comparison.sol1 : comparison.sol2)} M
                            </div>
                        </div>
                    </div>

                </>
            )}

            {(!salt1 || !salt2) && (
                <div className="text-center py-16 text-gray-500 text-lg">
                    Select two salts above to compare their solubilities.
                </div>
            )}
        </div>
    );
}
