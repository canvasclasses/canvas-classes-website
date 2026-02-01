import { X, BookOpen, FlaskConical, Beaker } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CATION_GROUPS, ANION_GROUPS, ANIONS } from '../lib/saltAnalysisData';

export default function SaltAnalysisGuide() {
    const [activeTab, setActiveTab] = useState<'anions' | 'cations'>('anions');

    return (
        <div className="w-full max-w-6xl mx-auto mt-16 mb-8">
            <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 bg-gray-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-500/20 p-2 rounded-lg">
                            <BookOpen className="text-purple-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Revision Guide</h2>
                            <p className="text-sm text-gray-400">Quick recap for Anion & Cation Analysis</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800">
                    <button
                        onClick={() => setActiveTab('anions')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === 'anions' ? 'text-cyan-400' : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <FlaskConical size={18} />
                            Anion Analysis
                        </span>
                        {activeTab === 'anions' && (
                            <motion.div layoutId="guideTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('cations')}
                        className={`flex-1 py-4 text-sm font-semibold transition-colors relative cursor-pointer ${activeTab === 'cations' ? 'text-purple-400' : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Beaker size={18} />
                            Cation Analysis
                        </span>
                        {activeTab === 'cations' && (
                            <motion.div layoutId="guideTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-400" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence>
                    {activeTab && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900/50 overflow-hidden"
                        >
                            <div className="p-6">
                                {activeTab === 'anions' ? (
                                    <div className="space-y-8">
                                        {/* Group A */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30">
                                                    <span className="text-cyan-400 font-bold">A</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">Dilute H₂SO₄ Group</h3>
                                                    <p className="text-sm text-gray-400">Reagent: Dilute Sulphuric Acid</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {ANIONS.filter(a => a.group === 'A').map(anion => (
                                                    <div key={anion.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-cyan-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xl font-bold text-white">{anion.symbol}</span>
                                                            <span className="text-sm font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded">{anion.name}</span>
                                                        </div>
                                                        <p className="text-base text-gray-300 leading-relaxed">{anion.preliminaryTest.observation}</p>
                                                        {anion.preliminaryTest.gasEvolved && (
                                                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                                                <span className="text-sm text-cyan-400 font-medium">Gas: {anion.preliminaryTest.gasEvolved}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Group B */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center border border-purple-500/30">
                                                    <span className="text-purple-400 font-bold">B</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">Concentrated H₂SO₄ Group</h3>
                                                    <p className="text-sm text-gray-400">Reagent: Conc. Sulphuric Acid</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {ANIONS.filter(a => a.group === 'B').map(anion => (
                                                    <div key={anion.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xl font-bold text-white">{anion.symbol}</span>
                                                            <span className="text-sm font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded">{anion.name}</span>
                                                        </div>
                                                        <p className="text-base text-gray-300 leading-relaxed">{anion.preliminaryTest.observation}</p>
                                                        {anion.preliminaryTest.gasEvolved && (
                                                            <div className="mt-3 pt-3 border-t border-gray-700/50">
                                                                <span className="text-sm text-purple-400 font-medium">Gas: {anion.preliminaryTest.gasEvolved}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Independent */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center border border-orange-500/30">
                                                    <span className="text-orange-400 font-bold">I</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">Independent Group</h3>
                                                    <p className="text-sm text-gray-400">No specific group reagent</p>
                                                </div>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {ANIONS.filter(a => a.group === 'independent').map(anion => (
                                                    <div key={anion.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-orange-500/30 transition-colors">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xl font-bold text-white">{anion.symbol}</span>
                                                            <span className="text-sm font-medium text-gray-500 bg-gray-900 px-2 py-1 rounded">{anion.name}</span>
                                                        </div>
                                                        <p className="text-base text-gray-300 leading-relaxed"> Tested directly using specific confirmatory tests (BaCl₂ for Sulphate, Ammonium Molybdate for Phosphate).</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="overflow-hidden rounded-xl border border-gray-700/50">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse min-w-[600px]">
                                                    <thead>
                                                        <tr className="bg-gray-800 border-b border-gray-700">
                                                            <th className="p-4 font-semibold text-gray-300 text-lg">Group</th>
                                                            <th className="p-4 font-semibold text-gray-300 text-lg">Group Reagent</th>
                                                            <th className="p-4 font-semibold text-gray-300 text-lg">Cations</th>
                                                            <th className="p-4 font-semibold text-gray-300 text-lg">Precipitate</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-800 bg-gray-900/30">
                                                        {CATION_GROUPS.map((group) => (
                                                            <tr key={group.group} className="hover:bg-gray-800/30 transition-colors">
                                                                <td className="p-4 font-medium text-purple-400 w-24 whitespace-nowrap text-lg">{group.name}</td>
                                                                <td className="p-4 text-cyan-300 font-mono text-base">{group.reagent}</td>
                                                                <td className="p-4">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {group.cations.map(c => (
                                                                            <span key={c} className={`px-2 py-1 md:px-4 md:py-2 rounded-lg border text-sm md:text-base font-bold transition-all duration-300 hover:scale-105 cursor-default ${{
                                                                                0: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30 shadow-[0_0_15px_-3px_rgba(217,70,239,0.3)] hover:bg-fuchsia-500/30',
                                                                                1: 'bg-gray-200/10 text-gray-200 border-gray-200/30 shadow-[0_0_15px_-3px_rgba(229,231,235,0.2)] hover:bg-gray-200/20',
                                                                                2: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.3)] hover:bg-yellow-500/30',
                                                                                3: 'bg-red-500/20 text-red-300 border-red-500/30 shadow-[0_0_15px_-3px_rgba(239,68,68,0.3)] hover:bg-red-500/30',
                                                                                4: 'bg-pink-500/20 text-pink-300 border-pink-500/30 shadow-[0_0_15px_-3px_rgba(236,72,153,0.3)] hover:bg-pink-500/30',
                                                                                5: 'bg-blue-500/20 text-blue-300 border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] hover:bg-blue-500/30',
                                                                                6: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)] hover:bg-emerald-500/30',
                                                                            }[group.group]
                                                                                }`}>
                                                                                {c}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-4 text-gray-400 text-base">{group.precipitate}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-800/30 rounded-xl p-5 border border-purple-500/20">
                                                <h4 className="text-purple-400 font-bold mb-2 text-lg">🔥 Flame Test Colors</h4>
                                                <ul className="space-y-2 text-base text-gray-300">
                                                    <li className="flex justify-between"><span>Calcium (Ca²⁺)</span> <span className="font-semibold text-red-400">Brick Red</span></li>
                                                    <li className="flex justify-between"><span>Strontium (Sr²⁺)</span> <span className="font-semibold text-red-500">Crimson Red</span></li>
                                                    <li className="flex justify-between"><span>Barium (Ba²⁺)</span> <span className="font-semibold text-green-400">Apple Green</span></li>
                                                    <li className="flex justify-between"><span>Copper (Cu²⁺)</span> <span className="font-semibold text-blue-400">Blue-Green</span></li>
                                                </ul>
                                            </div>
                                            <div className="bg-gray-800/30 rounded-xl p-5 border border-cyan-500/20">
                                                <h4 className="text-cyan-400 font-bold mb-2 text-lg">🧪 Important Note</h4>
                                                <p className="text-base text-gray-300 leading-relaxed">
                                                    Systematic analysis must be done in order (Group 0 → I → II...). Do not jump groups.
                                                    If a group is absent, proceed to the next group using the same solution (except Group 0).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
