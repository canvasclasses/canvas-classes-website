'use client';

import { useState, useMemo } from 'react';
import { ALL_COMPOUNDS, type PhysProperty } from './phys-data';
import {
    ChevronDown, ArrowDownUp, Info, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PropertyType = 'bp' | 'mp' | 'solubility';
type SortOption = 'desc' | 'asc' | 'mw';

function CompoundRow({
    comp,
    value,
    max,
    min,
    unit,
    property,
    isExpanded,
    onToggle
}: {
    comp: PhysProperty;
    value: number;
    max: number;
    min: number;
    unit: string;
    property: PropertyType;
    isExpanded: boolean;
    onToggle: () => void
}) {
    // Normalize width for progress bar
    const range = max - min;
    const normalizedValue = property === 'solubility' ? value : ((value - min) / (range || 1)) * 100;
    const w = Math.max(2, Math.min(100, normalizedValue));

    return (
        <div className="border-b border-white/[0.03] last:border-none group">
            <div
                onClick={onToggle}
                className={`flex items-center gap-4 px-4 py-2 cursor-pointer transition-colors ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.01]'
                    }`}
            >
                {/* Left: Functional Group Box (Soothing Dark Style) */}
                <div className="w-36 md:w-48 shrink-0">
                    <div className="bg-[#161b22] border border-white/10 rounded-md px-3 py-1.5 flex items-center justify-center">
                        <span className="text-[9px] md:text-[10px] font-bold text-white/50 uppercase tracking-widest whitespace-nowrap">
                            {comp.type}
                        </span>
                    </div>
                </div>

                {/* Middle: Name and Info */}
                <div className="w-28 md:w-36 shrink-0 overflow-hidden">
                    <div className="text-[12px] font-bold text-white/90 truncate">{comp.name}</div>
                    <div className="text-[9px] text-white/30 font-mono uppercase tracking-tighter">{comp.mw}u</div>
                </div>

                {/* Right: Dynamic Progress Bar */}
                <div className="flex-1 flex items-center gap-3">
                    <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            layoutId={`bar-${comp.id}`}
                            initial={false}
                            animate={{ width: `${w}%` }}
                            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${comp.color}20, ${comp.color})`,
                                boxShadow: `0 0 10px ${comp.color}20`
                            }}
                        />
                    </div>
                    <div className="w-12 text-right">
                        <motion.span
                            key={property}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[12px] font-bold font-mono text-white/80"
                        >
                            {property === 'solubility' ? comp.solubility : value}
                        </motion.span>
                        <span className="text-[9px] text-white/30 font-mono ml-0.5">{unit}</span>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        className="text-white/20"
                    >
                        <ChevronDown size={14} />
                    </motion.div>
                </div>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 pt-2 flex flex-col gap-2 ml-40 md:ml-52">
                            <p className="text-[12px] text-white/50 leading-relaxed italic max-w-2xl border-l border-white/10 pl-4 py-1">
                                {comp.explanation}
                            </p>
                            <div className="flex flex-wrap gap-x-6 gap-y-1 text-[11px] pl-4">
                                <div className="text-white/40"><span className="text-white/70 font-bold mr-2 uppercase">Forces:</span>{comp.forces}</div>
                                <div className="text-white/40"><span className="text-white/70 font-bold mr-2 uppercase">Water:</span>{comp.waterInt} — {comp.solubilityValue}</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function PhysicalPropertiesLab() {
    const [activeProperty, setActiveProperty] = useState<PropertyType>('bp');
    const [sortOption, setSortOption] = useState<SortOption>('desc');
    const [search, setSearch] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Property calculation
    const getVal = (c: PhysProperty) => {
        if (activeProperty === 'bp') return c.bp;
        if (activeProperty === 'mp') return c.mp;
        return c.solubilityScore;
    };

    const unit = activeProperty === 'solubility' ? '%' : '°C';

    // Stats for Bar normalization
    const stats = useMemo(() => {
        const vals = ALL_COMPOUNDS.map(getVal);
        return {
            max: Math.max(...vals),
            min: Math.min(...vals)
        };
    }, [activeProperty]);

    // Filter & Sort
    const filtered = ALL_COMPOUNDS.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.type.toLowerCase().includes(search.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        const valA = getVal(a);
        const valB = getVal(b);
        if (sortOption === 'mw') return a.mw - b.mw;
        return sortOption === 'desc' ? valB - valA : valA - valB;
    });

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out max-w-6xl mx-auto px-4">

            {/* Header & Search */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        Physical <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Properties Lab</span>
                    </h2>
                    <p className="text-white/40 text-[12px] mt-1">
                        Compare trends across all major functional groups.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
                        <input
                            type="text"
                            placeholder="Search compounds..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-2 text-[12px] text-white focus:outline-none focus:border-emerald-500/30 transition-all w-40 md:w-64"
                        />
                    </div>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setSortOption(sortOption === 'desc' ? 'asc' : 'desc')}
                            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-white/40"
                            title="Toggle Sort Order"
                        >
                            <ArrowDownUp size={14} />
                        </button>
                        <button
                            onClick={() => setSortOption('mw')}
                            className={`text-[10px] font-bold px-2 py-1.5 rounded-lg transition-colors ${sortOption === 'mw' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'
                                }`}
                        >
                            MW
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Lab Interface */}
            <div className="bg-[#0b0e14] border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl">

                {/* Horizontal Tabs Component */}
                <div className="flex border-b border-white/[0.05] bg-white/[0.02]">
                    {(['bp', 'mp', 'solubility'] as PropertyType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveProperty(tab)}
                            className={`flex-1 py-4 text-[13px] font-bold tracking-widest uppercase transition-all relative ${activeProperty === tab ? 'text-emerald-400 bg-white/[0.02]' : 'text-white/30 hover:text-white/50'
                                }`}
                        >
                            {tab === 'bp' ? 'Boiling Point' : tab === 'mp' ? 'Melting Point' : 'Solubility'}
                            {activeProperty === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* The List Container */}
                <div className="flex flex-col min-h-[400px]">
                    {sorted.length > 0 ? (
                        sorted.map((comp) => (
                            <CompoundRow
                                key={comp.id}
                                comp={comp}
                                value={getVal(comp)}
                                max={stats.max}
                                min={stats.min}
                                unit={unit}
                                property={activeProperty}
                                isExpanded={expandedId === comp.id}
                                onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
                            />
                        ))
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-20">
                            <Search size={40} />
                            <p className="mt-4 text-sm font-medium">No compounds match "{search}"</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lab Tips */}
            <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-start">
                <Info size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-[12px] text-indigo-200/60 leading-relaxed">
                    <strong className="text-indigo-300">Analysis Tip:</strong> Select a property above to visualize trends. Notice how branching (e.g. 3° Alcohols) reduces surface area and lowers both Boiling and Melting points compared to linear isomers of similar weight.
                </div>
            </div>

        </div>
    );
}
