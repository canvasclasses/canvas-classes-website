'use client';

import { useState } from 'react';
import { Beaker, FlaskConical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Data for NaOH reactions
const NAOH_DATA = {
    white: {
        soluble: [
            { formula: 'Pb(OH)₂', complex: '[Pb(OH)₄]²⁻' },
            { formula: 'Sn(OH)₂', complex: '[Sn(OH)₄]²⁻' },
            { formula: 'Sn(OH)₄', complex: '[Sn(OH)₆]²⁻' },
            { formula: 'Sb₂O₃', complex: '[SbO₂]⁻' },
            { formula: 'Al(OH)₃', complex: '[Al(OH)₄]⁻' },
            { formula: 'Zn(OH)₂', complex: '[Zn(OH)₄]²⁻' },
        ],
        insoluble: ['Cd(OH)₂', 'Bi(OH)₃', 'Fe(OH)₂*', 'Mn(OH)₂**', 'Mg(OH)₂'],
        notes: ['*Fe(OH)₂: Greenish white or dirty green ppt.', '**Mn(OH)₂: Pinkish white ppt.']
    },
    brownishBlack: [
        { formula: 'Ag₂O', behavior: 'Insoluble' },
        { formula: 'Hg₂O', behavior: 'Insoluble' },
    ],
    yellow: [{ formula: 'HgO', behavior: 'Insoluble' }],
    reddishBrown: [{ formula: 'Fe(OH)₃', behavior: 'Insoluble' }],
};

const NH4OH_DATA = {
    white: {
        soluble: [
            { formula: 'Zn(OH)₂', complex: '[Zn(NH₃)₄]²⁺' },
            { formula: 'Cd(OH)₂', complex: '[Cd(NH₃)₄]²⁺' },
            { formula: 'Al(OH)₃', note: 'Partially soluble' },
        ],
        insoluble: ['Pb(OH)₂', 'Sn(OH)₂', 'Sn(OH)₄', 'Sb₂O₃', 'Bi(OH)₃', 'Fe(OH)₂*', 'Mn(OH)₂**', 'Mg(OH)₂', 'HgO·Hg(NH₂)X'],
        notes: ['*Fe(OH)₂: Greenish white or dirty green ppt.', '**Mn(OH)₂: Pinkish white ppt.']
    },
    reddishBrown: [{ formula: 'Fe(OH)₃', behavior: 'Insoluble' }],
};

// Color badge component
const ColorBadge = ({ color, label }: { color: string; label: string }) => {
    const colorMap: Record<string, string> = {
        white: 'bg-gray-100 text-gray-800 border-gray-300',
        brownishBlack: 'bg-amber-900 text-amber-100 border-amber-700',
        yellow: 'bg-yellow-400 text-yellow-900 border-yellow-500',
        blue: 'bg-blue-500 text-blue-100 border-blue-400',
        green: 'bg-green-600 text-green-100 border-green-500',
        reddishBrown: 'bg-orange-800 text-orange-100 border-orange-600',
    };

    return (
        <span className={`px-3 py-1 text-sm font-bold rounded border ${colorMap[color] || 'bg-gray-500 text-white'}`}>
            {label}
        </span>
    );
};

export default function ReagentReactionTables() {
    const [expandedTable, setExpandedTable] = useState<'naoh' | 'nh4oh' | null>(null);

    const toggleTable = (table: 'naoh' | 'nh4oh') => {
        setExpandedTable(expandedTable === table ? null : table);
    };

    return (
        <div className="w-full max-w-6xl mx-auto my-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Quick Reference: Reagent Reactions</h3>
                <p className="text-gray-400">Precipitate colors with NaOH and NH₄OH</p>
            </div>

            {/* Tab Buttons - Full Width */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => toggleTable('naoh')}
                    className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${expandedTable === 'naoh'
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50'
                        }`}
                >
                    <Beaker size={24} />
                    <div className="text-left">
                        <h4 className="font-bold text-base">NaOH Reactions</h4>
                        <p className="text-sm opacity-80">Excess NaOH behavior</p>
                    </div>
                </button>
                <button
                    onClick={() => toggleTable('nh4oh')}
                    className={`flex-1 p-4 rounded-xl flex items-center justify-center gap-3 transition-all ${expandedTable === 'nh4oh'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50'
                        }`}
                >
                    <FlaskConical size={24} />
                    <div className="text-left">
                        <h4 className="font-bold text-base">NH₄OH Reactions</h4>
                        <p className="text-sm opacity-80">Excess NH₄OH behavior</p>
                    </div>
                </button>
            </div>

            {/* Content Panel - Full Width, One at a time */}
            <AnimatePresence mode="wait">
                {expandedTable === 'naoh' && (
                    <motion.div
                        key="naoh"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-6"
                    >
                        <div className="space-y-6">
                            {/* White precipitates */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <ColorBadge color="white" label="White" />
                                    <span className="text-gray-300 text-base">Precipitates</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                                        <p className="text-green-400 font-bold mb-2 text-base">Soluble in excess NaOH</p>
                                        {NAOH_DATA.white.soluble.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">
                                                {item.formula} → {item.complex}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                                        <p className="text-red-400 font-bold mb-2 text-base">Insoluble in excess NaOH</p>
                                        {NAOH_DATA.white.insoluble.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">{item}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 italic">
                                    {NAOH_DATA.white.notes.map((n, i) => <p key={i}>{n}</p>)}
                                </div>
                            </div>

                            {/* Colored precipitates */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="brownishBlack" label="Brownish-Black" />
                                    <div className="mt-3 space-y-1">
                                        {NAOH_DATA.brownishBlack.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">{item.formula} → {item.behavior}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="yellow" label="Yellow" />
                                    <div className="mt-3 space-y-1">
                                        {NAOH_DATA.yellow.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">{item.formula} → {item.behavior}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="blue" label="Blue" />
                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-200 text-base">Cu(OH)₂ → Insoluble</p>
                                        <p className="text-gray-200 text-base">Cu(OH)X → Co(OH)₂ pink</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="green" label="Green" />
                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-200 text-base">Cr(OH)₃ → [Cr(OH)₄]⁻</p>
                                        <p className="text-gray-200 text-base">Ni(OH)₂ → Insoluble</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-4 inline-block">
                                <ColorBadge color="reddishBrown" label="Reddish-Brown" />
                                <p className="text-gray-200 text-base mt-3">Fe(OH)₃ → Insoluble</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {expandedTable === 'nh4oh' && (
                    <motion.div
                        key="nh4oh"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6"
                    >
                        <div className="space-y-6">
                            {/* White precipitates */}
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <ColorBadge color="white" label="White" />
                                    <span className="text-gray-300 text-base">Precipitates</span>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4">
                                        <p className="text-green-400 font-bold mb-2 text-base">Soluble in excess NH₄OH</p>
                                        {NH4OH_DATA.white.soluble.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">
                                                {item.formula} → {item.complex || item.note}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4">
                                        <p className="text-red-400 font-bold mb-2 text-base">Insoluble in excess NH₄OH</p>
                                        {NH4OH_DATA.white.insoluble.map((item, i) => (
                                            <p key={i} className="text-gray-200 text-base">{item}</p>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 italic">
                                    {NH4OH_DATA.white.notes.map((n, i) => <p key={i}>{n}</p>)}
                                </div>
                            </div>

                            {/* Colored precipitates */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="brownishBlack" label="Brownish-Black" />
                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-200 text-base">Ag₂O → [Ag(NH₃)₂]⁺</p>
                                        <p className="text-gray-200 text-base">Hg compounds → Insol.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="yellow" label="Yellow" />
                                    <div className="mt-3">
                                        <p className="text-gray-400 italic text-base">No ppt. obtained</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="blue" label="Blue" />
                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-200 text-base">Cu(OH)₂ → [Cu(NH₃)₄]²⁺</p>
                                        <p className="text-gray-200 text-base">Co(OH)X → pink soln.</p>
                                    </div>
                                </div>
                                <div className="bg-gray-900/50 rounded-lg p-4">
                                    <ColorBadge color="green" label="Green" />
                                    <div className="mt-3 space-y-1">
                                        <p className="text-gray-200 text-base">Cr(OH)₃ → Partial sol.</p>
                                        <p className="text-gray-200 text-base">Ni(OH)₂ → [Ni(NH₃)₆]²⁺</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900/50 rounded-lg p-4 inline-block">
                                <ColorBadge color="reddishBrown" label="Reddish-Brown" />
                                <p className="text-gray-200 text-base mt-3">Fe(OH)₃ → Insoluble</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick comparison tip */}
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-yellow-400 text-base text-center">
                    <strong>💡 Key Difference:</strong> Cu²⁺ and Ni²⁺ form <strong>soluble ammonia complexes</strong> with NH₄OH but are <strong>insoluble</strong> in NaOH.
                </p>
            </div>
        </div>
    );
}
