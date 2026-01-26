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

        // Helper to parse scientific notation (e.g., "1.8×10⁻¹⁶")
        const parseValue = (str: string) => {
            // Superscript map
            const superscripts: Record<string, string> = {
                '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
                '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
                '⁻': '-', '⁺': '+'
            };

            // Clean up string
            let cleanStr = str.replace(/\s/g, '');

            // Handle scientific notation with unicode superscripts
            if (cleanStr.includes('10') && (cleanStr.includes('×') || cleanStr.includes('x'))) {
                // Replace superscripts with normal chars
                cleanStr = cleanStr.split('').map(char => superscripts[char] || char).join('');
                // Convert 1.8×10-16 to 1.8e-16
                cleanStr = cleanStr.replace(/×10|x10/, 'e');
            }

            // Extract the number
            const match = cleanStr.match(/-?[\d.]+(e-?[\d]+)?/);
            return match ? parseFloat(match[0]) : null;
        };

        return activePropertyRow.values.map((val, idx) => {
            let numVal: number | null = null;
            if (typeof val === 'number') numVal = val;
            else if (typeof val === 'string') {
                numVal = parseValue(val);
            }
            return { label: xAxisLabels[idx], value: numVal, displayValue: val.toString() };
        });
    }, [activePropertyRow, xAxisLabels]);

    const validPoints = plotData.filter(d => d.value !== null) as { label: string, value: number, displayValue: string }[];

    // Log scale logic
    const rawMin = Math.min(...validPoints.map(d => d.value));
    const rawMax = Math.max(...validPoints.map(d => d.value));
    const isLogScale = validPoints.every(d => d.value > 0) && (rawMax / (rawMin || 1) > 100);

    const minVal = isLogScale ? Math.log10(rawMin) : rawMin;
    const maxVal = isLogScale ? Math.log10(rawMax) : rawMax;

    const range = maxVal - minVal || 1;
    const padding = range * 0.15;

    const normalize = (val: number) => {
        const v = isLogScale ? Math.log10(val) : val;
        return 100 - ((v - (minVal - padding)) / (range + 2 * padding)) * 100;
    };

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
                    {currentTable?.isTextOnly || plotableRows.length === 0 ? (
                        <div className="lg:col-span-8 overflow-hidden rounded-xl border border-gray-700/40 bg-gray-900/40">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-800/50 border-b border-gray-700">
                                            {currentTable?.headers.map((header, idx) => (
                                                <th key={idx} className="p-4 text-sm font-semibold text-gray-300 whitespace-nowrap">
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/30">
                                        {currentTable?.rows.map((row, rowIdx) => (
                                            <tr key={rowIdx} className="hover:bg-white/5 transition-colors group">
                                                {row.map((cell, cellIdx) => (
                                                    <td key={cellIdx} className={`p-4 text-sm text-gray-300 ${cellIdx === 0 ? 'font-medium text-white' : ''}`}>
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Property Selector */}
                            <div className="lg:col-span-2">
                                {/* Mobile Dropdown */}
                                <div className="block lg:hidden mb-4">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Select Property</label>
                                    <div className="relative">
                                        <select
                                            value={selectedPropertyIndex}
                                            onChange={(e) => setSelectedPropertyIndex(Number(e.target.value))}
                                            className="w-full appearance-none bg-gray-800/50 text-white border border-gray-700 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                        >
                                            {plotableRows.map((row, idx) => (
                                                <option key={idx} value={idx}>
                                                    {row.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <TrendingUp size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop List */}
                                <div className="hidden lg:flex flex-col gap-2">
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
                            </div>

                            {/* Graph */}
                            <div className="lg:col-span-6">
                                {activePropertyRow && validPoints.length > 1 ? (
                                    <>
                                        {/* Mobile View (Tall Graph) */}
                                        <div className="block md:hidden relative h-[500px] bg-gray-900/40 rounded-xl border border-gray-700/40 p-2">
                                            <div className="absolute top-3 left-4 text-base text-gray-200 font-bold">{activePropertyRow.name}</div>
                                            <svg viewBox="0 0 300 450" className="w-full h-full overflow-visible">
                                                {/* Grid */}
                                                {[40, 225, 410].map(y => <line key={y} x1="5%" y1={y} x2="95%" y2={y} stroke="#374151" strokeDasharray="2" strokeWidth="0.5" />)}

                                                <defs>
                                                    <linearGradient id="lineGradientMobile" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#f472b6" />
                                                        <stop offset="50%" stopColor="#fb923c" />
                                                        <stop offset="100%" stopColor="#a3e635" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Line */}
                                                <motion.path
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 1 }}
                                                    d={`M ${validPoints.map((p) => {
                                                        const originalIndex = plotData.findIndex(d => d.label === p.label);
                                                        const x = 25 + (originalIndex / Math.max(plotData.length - 1, 1)) * 250;
                                                        const y = 40 + (normalize(p.value) / 100) * 370; // 370px active range
                                                        return `${x},${y}`;
                                                    }).join(' L ')}`}
                                                    fill="none"
                                                    stroke="url(#lineGradientMobile)"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                />

                                                {/* Points & Labels */}
                                                {plotData.map((point, i) => {
                                                    const x = 25 + (i / Math.max(plotData.length - 1, 1)) * 250;
                                                    const hasValue = point.value !== null;
                                                    const y = hasValue ? 40 + (normalize(point.value!) / 100) * 370 : 225;
                                                    const isH = hoveredPoint === i;

                                                    // Alternate label heights for mobile density
                                                    const xAxisLabelY = 430 + (i % 2 === 0 ? 0 : 10);

                                                    // Smart Label Positioning
                                                    let isValley = false;
                                                    if (hasValue) {
                                                        // Find nearest valid neighbors
                                                        const getVal = (dir: 1 | -1) => {
                                                            let p = i + dir;
                                                            while (p >= 0 && p < plotData.length) {
                                                                if (plotData[p].value !== null) return plotData[p].value;
                                                                p += dir;
                                                            }
                                                            return null;
                                                        };
                                                        const prev = getVal(-1);
                                                        const next = getVal(1);
                                                        // If strictly lower than both neighbors, it's a valley -> Place label below
                                                        if (prev !== null && next !== null && point.value! < prev && point.value! < next) {
                                                            isValley = true;
                                                        }
                                                    }
                                                    const valLabelY = y + (isValley ? 25 : -15);

                                                    return (
                                                        <g key={i}>
                                                            {hasValue && (
                                                                <>
                                                                    <circle cx={x} cy={y} r={isH ? 6 : 4} className="fill-white stroke-pink-400 stroke-[1.5] cursor-pointer transition-all"
                                                                        onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
                                                                    <text
                                                                        x={x}
                                                                        y={valLabelY}
                                                                        textAnchor="middle"
                                                                        fill="white"
                                                                        fontSize="13"
                                                                        fontWeight="600"
                                                                        className="drop-shadow-md relative z-10"
                                                                        stroke="#111827"
                                                                        strokeWidth="4"
                                                                        strokeLinejoin="round"
                                                                        style={{ paintOrder: 'stroke' }}
                                                                    >
                                                                        {point.displayValue}
                                                                    </text>
                                                                </>
                                                            )}
                                                            {!hasValue && <text x={x} y={225} textAnchor="middle" fill="#6b7280" fontSize="12">–</text>}
                                                            <text x={x} y={xAxisLabelY} textAnchor="middle" fill="#9ca3af" fontSize="13">
                                                                {point.label}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>

                                        {/* Desktop View (Wide Graph) */}
                                        <div className="hidden md:block relative h-[500px] bg-gray-900/40 rounded-xl border border-gray-700/40 p-5">
                                            <div className="absolute top-3 left-6 text-base text-gray-200 font-bold">{activePropertyRow.name}</div>
                                            <svg viewBox="0 0 600 375" className="w-full h-full overflow-visible">
                                                {/* Grid */}
                                                {[40, 188, 335].map(y => <line key={y} x1="3%" y1={y} x2="97%" y2={y} stroke="#374151" strokeDasharray="2" strokeWidth="0.5" />)}

                                                <defs>
                                                    <linearGradient id="lineGradientDesktop" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#f472b6" />
                                                        <stop offset="50%" stopColor="#fb923c" />
                                                        <stop offset="100%" stopColor="#a3e635" />
                                                    </linearGradient>
                                                </defs>

                                                {/* Line */}
                                                <motion.path
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 1 }}
                                                    d={`M ${validPoints.map((p) => {
                                                        const originalIndex = plotData.findIndex(d => d.label === p.label);
                                                        const x = 30 + (originalIndex / Math.max(plotData.length - 1, 1)) * 540;
                                                        const y = 40 + (normalize(p.value) / 100) * 295;
                                                        return `${x},${y}`;
                                                    }).join(' L ')}`}
                                                    fill="none"
                                                    stroke="url(#lineGradientDesktop)"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                />

                                                {/* Points & Labels */}
                                                {plotData.map((point, i) => {
                                                    const x = 30 + (i / Math.max(plotData.length - 1, 1)) * 540;
                                                    const hasValue = point.value !== null;
                                                    const y = hasValue ? 40 + (normalize(point.value!) / 100) * 295 : 188;
                                                    const isH = hoveredPoint === i;

                                                    // Smart Label Positioning (Desktop)
                                                    let isValley = false;
                                                    if (hasValue) {
                                                        const getVal = (dir: 1 | -1) => {
                                                            let p = i + dir;
                                                            while (p >= 0 && p < plotData.length) {
                                                                if (plotData[p].value !== null) return plotData[p].value;
                                                                p += dir;
                                                            }
                                                            return null;
                                                        };
                                                        const prev = getVal(-1);
                                                        const next = getVal(1);
                                                        if (prev !== null && next !== null && point.value! < prev && point.value! < next) {
                                                            isValley = true;
                                                        }
                                                    }
                                                    const valLabelY = y + (isValley ? 20 : -15);

                                                    return (
                                                        <g key={i}>
                                                            {hasValue && (
                                                                <>
                                                                    <circle cx={x} cy={y} r={isH ? 5 : 3.5} className="fill-white stroke-pink-400 stroke-[1.5] cursor-pointer transition-all"
                                                                        onMouseEnter={() => setHoveredPoint(i)} onMouseLeave={() => setHoveredPoint(null)} />
                                                                    {(isH || plotData.length <= 10) && (
                                                                        <text
                                                                            x={x}
                                                                            y={valLabelY}
                                                                            textAnchor="middle"
                                                                            fill="white"
                                                                            fontSize="18"
                                                                            fontWeight="500"
                                                                            stroke="#111827"
                                                                            strokeWidth="3"
                                                                            strokeLinejoin="round"
                                                                            style={{ paintOrder: 'stroke' }}
                                                                        >
                                                                            {point.displayValue}
                                                                        </text>
                                                                    )}
                                                                </>
                                                            )}
                                                            {!hasValue && <text x={x} y={188} textAnchor="middle" fill="#6b7280" fontSize="18">–</text>}
                                                            <text x={x} y={360} textAnchor="middle" fill="#9ca3af" fontSize="18">
                                                                {point.label}
                                                            </text>
                                                        </g>
                                                    );
                                                })}
                                            </svg>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-[400px] flex items-center justify-center text-gray-500 bg-gray-800/20 rounded-xl">Select a property with numeric data</div>
                                )}
                            </div>

                        </>
                    )}

                    {/* Notes - Right side on desktop, below on mobile */}
                    <div className="lg:col-span-4">
                        {currentTable?.notes && currentTable.notes.length > 0 && (
                            <div className="bg-gray-800/30 rounded-xl border border-gray-700/40 p-5 h-full">
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
