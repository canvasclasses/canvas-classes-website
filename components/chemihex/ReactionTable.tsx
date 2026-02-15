import React, { useState } from 'react';
import tableData from '../../data/reaction_table_data.json';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FlaskConical, ArrowRight } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const Latex = ({ children, className }: { children: string, className?: string }) => {
    const html = katex.renderToString(children, {
        throwOnError: false,
        displayMode: false,
    });
    return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};

interface CellData {
    reagent: string;
    group: string;
    result: string;
    mechanism: string;
    groupLabel: string;
}

export const ReactionTable = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCell, setSelectedCell] = useState<CellData | null>(null);

    const filteredRows = tableData.rows.filter(row =>
        row.reagent.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getCellContent = (value: string) => {
        if (value === '+') return <span className="text-emerald-400 drop-shadow-sm"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></span>; // Larer, bolder check
        if (value === '-') return <span className="text-slate-600 text-2xl">·</span>; // Larger dot
        if (!value) return <span className="text-slate-800 text-sm"></span>;
        if (value === 'CH') return <span className="text-xs font-bold text-blue-300 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30 tracking-wider shadow-sm">CH</span>; // Larger badge
        if (value === 'OH') return <span className="text-xs font-bold text-teal-300 bg-teal-500/20 px-2 py-1 rounded border border-teal-500/30 tracking-wider shadow-sm">OH</span>; // Larger badge
        return <span className="text-xs font-bold text-purple-300 bg-purple-500/20 px-2 py-1 rounded border border-purple-500/30 tracking-wider whitespace-nowrap shadow-sm">{value}</span>;
    };

    const getCellClass = (value: string) => {
        // Vibrant, distinct hover effects
        // Using !important via '!' or just high specificity classes to ensure they apply
        if (value === '+') return "bg-slate-900 border-slate-800 hover:bg-emerald-900/50 hover:border-emerald-500/50 hover:shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]";
        if (value === '-') return "bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-600";
        if (value === 'CH') return "bg-slate-900 border-slate-800 hover:bg-blue-900/50 hover:border-blue-500/50 hover:shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]";
        if (value === 'OH') return "bg-slate-900 border-slate-800 hover:bg-teal-900/50 hover:border-teal-500/50 hover:shadow-[inset_0_0_15px_rgba(20,184,166,0.2)]";
        if (value && value !== '.') return "bg-slate-900 border-slate-800 hover:bg-purple-900/50 hover:border-purple-500/50 hover:shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]";
        return "bg-slate-900 border-slate-800";
    };

    return (
        <section className="w-full bg-[#020617] py-16 px-6 border-t border-slate-900 relative">
            {/* Background Grid Pattern for Technical Feel */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-100 mb-3 tracking-tight">
                            Reactive <span className="text-teal-500">Compatibility</span>
                        </h2>
                        <p className="text-slate-400 text-base max-w-2xl font-light tracking-wide leading-relaxed">
                            Interactive Analysis Matrix. Select any cell for mechanism details.
                        </p>
                    </div>

                    {/* Compact Search */}
                    <div className="relative group w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-teal-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Reagents..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-base text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all font-medium shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto border border-slate-800 rounded-lg bg-slate-950 shadow-2xl relative custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="sticky left-0 z-30 bg-slate-950 p-3 border-b border-r border-slate-800 min-w-[200px] shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Reagent</div>
                                </th>
                                {tableData.columns.map(col => (
                                    // COMPACT HEADER HEIGHT
                                    <th key={col.id} className="p-2 border-b border-slate-800 min-w-[90px] h-auto align-bottom bg-slate-950">
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center leading-tight hover:text-teal-400 transition-colors cursor-default">
                                            {col.label.replace(' ', '\n')}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row, idx) => (
                                <motion.tr
                                    key={row.reagent}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.005 }}
                                    className="group"
                                >
                                    {/* Reagent Name Column */}
                                    <td className="sticky left-0 z-30 bg-slate-950 group-hover:bg-[#0f172a] transition-colors px-4 py-2 border-b border-r border-slate-800 shadow-[4px_0_10px_rgba(0,0,0,0.2)]">
                                        <div className="font-serif text-sm font-medium text-slate-200 tracking-wide">
                                            <Latex>{row.reagent}</Latex>
                                        </div>
                                    </td>

                                    {/* Data Cells */}
                                    {tableData.columns.map(col => {
                                        // @ts-ignore
                                        const val = row.data[col.id];
                                        const isActive = val && val !== '';
                                        const cellStyle = getCellClass(val);

                                        return (
                                            <td
                                                key={col.id}
                                                // COMPACT HEIGHT h-10 (40px)
                                                className="p-[1px] border-b border-r border-slate-800/50 relative h-10 bg-slate-950"
                                            >
                                                <div
                                                    onClick={() => isActive && setSelectedCell({
                                                        // @ts-ignore
                                                        reagent: row.reagent,
                                                        // @ts-ignore
                                                        mechanism: (row.briefs && row.briefs[col.id]) ? row.briefs[col.id] : row.mechanism,
                                                        group: col.id,
                                                        groupLabel: col.label,
                                                        result: val
                                                    })}
                                                    className={`
                                                        w-full h-full flex items-center justify-center
                                                        transition-all duration-200 border
                                                        ${cellStyle}
                                                        ${isActive ? 'cursor-pointer' : ''}
                                                    `}
                                                >
                                                    {getCellContent(val)}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Legend - Minimalist */}
                <div className="mt-6 flex flex-wrap gap-6 text-xs text-slate-500 font-medium border-t border-slate-900 pt-4 justify-end">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-emerald-500" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        <span>Reduction Success</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-base text-slate-600">·</span>
                        <span>No Reaction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-300 bg-blue-500/10 px-1 py-0.5 rounded border border-blue-500/20">CH</span>
                        <span>Hydrocarbon</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-1 py-0.5 rounded border border-teal-500/20">OH</span>
                        <span>Alcohol</span>
                    </div>
                </div>

                {/* Expanded Card Modal */}
                <AnimatePresence>
                    {selectedCell && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedCell(null)}
                                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                            />

                            <motion.div
                                layoutId={`cell-${selectedCell.reagent}-${selectedCell.group}`}
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="
                                    bg-[#0F172A] border border-slate-700 w-full max-w-2xl rounded-xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]
                                "
                            >
                                {/* Modal Header */}
                                <div className="p-6 border-b border-slate-800 relative z-10 bg-[#0F172A] flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shadow-inner">
                                            <FlaskConical className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reagent</div>
                                            <h3 className="text-2xl font-bold text-slate-100 tracking-tight font-serif leading-none">
                                                <Latex>{selectedCell.reagent}</Latex>
                                            </h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCell(null)}
                                        className="text-slate-500 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-700 p-2 rounded-full"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Modal Body - Scrollable */}
                                <div className="p-8 relative z-10 bg-[#0B1120] overflow-y-auto custom-scrollbar flex-1">

                                    {/* Central Reaction Visualization - Integrated */}
                                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-800/50">
                                        {/* Input */}
                                        <div className="flex-1 flex flex-col items-center justify-center relative">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Substrate</div>
                                            <div className="text-slate-200 font-bold text-xl text-center leading-tight">
                                                {selectedCell.groupLabel}
                                            </div>
                                        </div>

                                        {/* Arrow Section */}
                                        <div className="px-4 flex flex-col items-center justify-center">
                                            {/* Custom Reaction Arrow SVG */}
                                            <svg width="80" height="24" viewBox="0 0 80 24" fill="none" className="text-slate-600 mb-1">
                                                <line x1="0" y1="12" x2="78" y2="12" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M70 4L78 12L70 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {/* Catalyst/Condition text */}
                                            <div className="text-[10px] font-bold text-teal-500 uppercase tracking-wider">
                                                {selectedCell.reagent.includes('Heat') || selectedCell.reagent.includes('Delta') ? 'Heat' : ''}
                                            </div>
                                        </div>

                                        {/* Result */}
                                        <div className="flex-1 flex flex-col items-center justify-center relative">
                                            <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Product</div>

                                            <div className={`
                                                font-bold text-base px-6 py-2.5 rounded-lg border inline-block select-select-none shadow-lg text-center
                                                transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-default
                                                ${selectedCell.result === '+' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-600 hover:text-white hover:border-emerald-500' :
                                                    selectedCell.result === 'OH' ? 'text-teal-300 bg-teal-500/10 border-teal-500/20 hover:bg-teal-600 hover:text-white hover:border-teal-500' :
                                                        selectedCell.result === '-' ? 'text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:text-slate-200 hover:border-slate-600' :
                                                            'text-blue-300 bg-blue-500/10 border-blue-500/20 hover:bg-blue-600 hover:text-white hover:border-blue-500'}
                                             `}>
                                                {selectedCell.result === '+' ? 'Reduced Product' : selectedCell.result === 'OH' ? 'Alcohol' : selectedCell.result === '-' ? 'No Reaction' : selectedCell.result}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analysis Content - Clean Flow */}
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <h4 className="text-xs text-slate-400 uppercase font-bold tracking-widest">
                                                    Reaction Analysis
                                                </h4>
                                                <div className="h-px bg-slate-800 flex-1" />

                                                {/* Inferred Metadata in Header */}
                                                <div className="flex gap-3">
                                                    <span className="text-[10px] uppercase font-bold text-slate-500">
                                                        {selectedCell.result === '+' ? 'Redox' : selectedCell.result === 'OH' ? 'Substitution' : 'Inert'}
                                                    </span>
                                                    {(selectedCell.reagent.includes('Heat') || selectedCell.reagent.includes('Delta')) && (
                                                        <span className="text-[10px] uppercase font-bold text-orange-500/80">Requires Heat</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Smart Tags - Inline */}
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {selectedCell.mechanism.toLowerCase().includes('syn') && (
                                                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/5 border border-indigo-500/20 px-2 py-0.5 rounded">Syn-Addition</span>
                                                )}
                                                {selectedCell.mechanism.toLowerCase().includes('anti') && (
                                                    <span className="text-[10px] font-bold text-orange-300 bg-orange-500/5 border border-orange-500/20 px-2 py-0.5 rounded">Anti-Addition</span>
                                                )}
                                                {selectedCell.mechanism.toLowerCase().includes('racemic') && (
                                                    <span className="text-[10px] font-bold text-pink-300 bg-pink-500/5 border border-pink-500/20 px-2 py-0.5 rounded">Racemic</span>
                                                )}
                                                {selectedCell.mechanism.toLowerCase().includes('inversion') && (
                                                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/5 border border-cyan-500/20 px-2 py-0.5 rounded">Inversion</span>
                                                )}
                                                {selectedCell.mechanism.toLowerCase().includes('markovnikov') && (
                                                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/5 border border-purple-500/20 px-2 py-0.5 rounded">Markovnikov</span>
                                                )}
                                            </div>

                                            <div
                                                className="text-slate-300 text-sm leading-7 font-normal tracking-wide text-left [&>strong]:text-teal-400 [&>strong]:font-bold"
                                                dangerouslySetInnerHTML={{ __html: selectedCell.mechanism }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};
