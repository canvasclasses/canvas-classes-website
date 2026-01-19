'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BLOCK_DATA } from '../lib/blockData';
import { Info, TrendingUp } from 'lucide-react';

// Vibrant color palette
const BLOCK_COLORS: Record<string, { gradient: string, accent: string, bg: string, label: string }> = {
    s: { gradient: 'from-orange-600 to-red-600', accent: 'text-orange-300', bg: 'bg-orange-500/10', label: 'S Block' },
    p: { gradient: 'from-teal-600 to-cyan-600', accent: 'text-teal-300', bg: 'bg-teal-500/10', label: 'P Block' },
    d: { gradient: 'from-purple-600 to-fuchsia-600', accent: 'text-purple-300', bg: 'bg-purple-500/10', label: 'D Block' },
    f: { gradient: 'from-pink-600 to-rose-600', accent: 'text-pink-300', bg: 'bg-pink-500/10', label: 'F Block' },
};

export default function TrendsComponent() {
    const [selectedBlock, setSelectedBlock] = useState('s');
    const [selectedTableIndex, setSelectedTableIndex] = useState(0);
    const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);
    const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

    const colors = BLOCK_COLORS[selectedBlock] || BLOCK_COLORS.s;
    const currentBlock = BLOCK_DATA[selectedBlock];
    const currentTable = currentBlock?.tables[selectedTableIndex];

    const xAxisLabels = currentTable ? currentTable.headers.slice(1) : [];

    const plotableRows = useMemo(() => {
        if (!currentTable) return [];
        return currentTable.rows.map((row) => {
            const name = row[0] as string;
            const values = row.slice(1);
            const hasNumbers = values.some(v => typeof v === 'number' || (typeof v === 'string' && /\d/.test(v)));
            return hasNumbers ? { name, values } : null;
        }).filter(Boolean) as { name: string, values: (string | number)[] }[];
    }, [currentTable]);

    const activePropertyRow = plotableRows[selectedPropertyIndex] || plotableRows[0];

    const plotData = useMemo(() => {
        if (!activePropertyRow) return [];
        return activePropertyRow.values.map((val, idx) => {
            let numVal: number | null = null;
            if (typeof val === 'number') numVal = val;
            else if (typeof val === 'string') {
                const match = val.match(/-?[\d.]+/);
                if (match) numVal = parseFloat(match[0]);
            }
            return { label: xAxisLabels[idx], value: numVal, displayValue: val.toString() };
        });
    }, [activePropertyRow, xAxisLabels]);

    const validPoints = plotData.filter(d => d.value !== null) as { label: string, value: number, displayValue: string }[];
    const minVal = Math.min(...validPoints.map(d => d.value));
    const maxVal = Math.max(...validPoints.map(d => d.value));
    const range = maxVal - minVal || 1;
    const padding = range * 0.15;

    const normalize = (val: number) => 100 - ((val - (minVal - padding)) / (range + 2 * padding)) * 100;

    return (
        <section id="trends-section" className="scroll-mt-28">

            <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5 backdrop-blur-sm">
                {/* Header with Block Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${colors.bg}`}>
                            <TrendingUp size={22} className={colors.accent} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{currentBlock?.name || 'Select a Block'}</h3>
                            <p className="text-sm text-gray-400">{currentBlock?.description || 'Choose a block to explore'}</p>
                        </div>
                    </div>

                    {/* Block Tabs */}
                    <div className="flex gap-2 bg-gray-800/60 rounded-xl p-1.5">
                        {(['s', 'p', 'd', 'f'] as const).map(block => (
                            <button
                                key={block}
                                onClick={() => { setSelectedBlock(block); setSelectedTableIndex(0); setSelectedPropertyIndex(0); }}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedBlock === block
                                    ? `bg-gradient-to-r ${BLOCK_COLORS[block].gradient} text-white shadow-lg`
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                {BLOCK_COLORS[block].label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Selector (Pills) */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {currentBlock?.tables.map((table, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setSelectedTableIndex(idx); setSelectedPropertyIndex(0); }}
                            className={`px-4 py-2 rounded-full text-sm transition-all border ${selectedTableIndex === idx
                                ? `${colors.bg} ${colors.accent} border-current font-medium`
                                : 'text-gray-400 border-gray-700 hover:border-gray-500'
                                }`}
                        >
                            {table.title.replace('Atomic and Physical Properties of ', '').replace('Properties of ', '')}
                        </button>
                    ))}
                </div>

                {/* Main Grid: Property List | Graph | Notes */}
                <div className="grid lg:grid-cols-12 gap-5">
                    {/* Property List */}
                    <div className="lg:col-span-2 flex flex-col gap-2">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Select Property</h3>
                        {plotableRows.map((row, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedPropertyIndex(idx)}
                                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${activePropertyRow === row
                                    ? `bg-gradient-to-r ${colors.gradient} text-white shadow-md font-semibold`
                                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                            >
                                {row.name.length > 20 ? row.name.slice(0, 18) + '...' : row.name}
                            </button>
                        ))}
                    </div>

                    {/* Graph */}
                    <div className="lg:col-span-6">
                        {activePropertyRow && validPoints.length > 1 ? (
                            <div className="relative h-[380px] bg-gray-800/30 rounded-xl border border-gray-700/40 p-4">
                                <div className="absolute top-3 left-4 text-sm text-gray-400 font-medium">{activePropertyRow.name}</div>
                                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible" preserveAspectRatio="xMidYMid meet">
                                    {/* Grid */}
                                    {[10, 50, 90].map(y => <line key={y} x1="5%" y1={y} x2="95%" y2={y} stroke="#374151" strokeDasharray="2" strokeWidth="0.3" />)}

                                    {/* Gradient Def */}
                                    <defs>
                                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#f472b6" />
                                            <stop offset="50%" stopColor="#fb923c" />
                                            <stop offset="100%" stopColor="#a3e635" />
                                        </linearGradient>
                                    </defs>

                                    {/* Line - only connect valid points */}
                                    <motion.path
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1 }}
                                        d={`M ${validPoints.map((p) => {
                                            const originalIndex = plotData.findIndex(d => d.label === p.label);
                                            const x = 20 + (originalIndex / Math.max(plotData.length - 1, 1)) * 260;
                                            const y = 12 + (normalize(p.value) / 100) * 76;
                                            return `${x},${y}`;
                                        }).join(' L ')}`}
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                    />

                                    {/* All X-axis labels + Points only for valid data */}
                                    {plotData.map((point, i) => {
                                        const x = 20 + (i / Math.max(plotData.length - 1, 1)) * 260;
                                        const hasValue = point.value !== null;
                                        const y = hasValue ? 12 + (normalize(point.value!) / 100) * 76 : 50;
                                        const isH = hoveredPoint === i;
                                        return (
                                            <g key={i}>
                                                {/* Only show point if has valid value */}
                                                {hasValue && (
                                                    <>
                                                        <circle cx={x} cy={y} r={isH ? 4 : 3} className="fill-white stroke-pink-400 stroke-[0.5] cursor-pointer transition-all"
                                                            onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
                                                        {(isH || plotData.filter(d => d.value !== null).length <= 10) && (
                                                            <text x={x} y={y - 8} textAnchor="middle" fill="white" fontSize="9" fontWeight="500">
                                                                {point.displayValue}
                                                            </text>
                                                        )}
                                                    </>
                                                )}
                                                {/* Show "-" for missing values */}
                                                {!hasValue && (
                                                    <text x={x} y={50} textAnchor="middle" fill="#6b7280" fontSize="8">
                                                        –
                                                    </text>
                                                )}
                                                {/* Always show x-axis label */}
                                                <text x={x} y={98} textAnchor="middle" fill="#9ca3af" fontSize="9">
                                                    {point.label}
                                                </text>
                                            </g>
                                        );
                                    })}
                                </svg>
                            </div>
                        ) : (
                            <div className="h-[380px] flex items-center justify-center text-gray-500 bg-gray-800/20 rounded-xl">Select a property with numeric data</div>
                        )}
                    </div>

                    {/* Notes - Right side on desktop, below on mobile */}
                    <div className="lg:col-span-4">
                        {currentTable?.notes && currentTable.notes.length > 0 && (
                            <div className="bg-gray-800/30 rounded-xl border border-gray-700/40 p-4 h-full">
                                <h4 className="text-base font-semibold text-yellow-400 flex items-center gap-2 mb-4">
                                    <Info size={18} />
                                    Key Observations
                                </h4>
                                <ul className="space-y-3">
                                    {currentTable.notes.map((note, idx) => (
                                        <li key={idx} className="text-base text-gray-300 leading-relaxed pl-4 border-l-2 border-yellow-500/40">
                                            {note}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
