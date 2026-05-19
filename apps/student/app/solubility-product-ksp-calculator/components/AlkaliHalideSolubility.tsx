'use client';

import React, { useState } from 'react';
import { Atom, TrendingUp, Info } from 'lucide-react';

// Ionic radii data (in pm)
const CATIONS = [
    { symbol: 'Li⁺', name: 'Lithium', radius: 73 },
    { symbol: 'Na⁺', name: 'Sodium', radius: 116 },
    { symbol: 'K⁺', name: 'Potassium', radius: 152 },
    { symbol: 'Rb⁺', name: 'Rubidium', radius: 166 },
    { symbol: 'Cs⁺', name: 'Cesium', radius: 181 },
];

const ANIONS = [
    { symbol: 'F⁻', name: 'Fluoride', radius: 119, color: 'rose' },
    { symbol: 'I⁻', name: 'Iodide', radius: 206, color: 'purple' },
];

// Relative solubility data (adjusted to match reference curve shapes)
// Iodide: starts very high, drops steeply, then levels off
// Fluoride: starts low, gradual rise, then steepens
const SOLUBILITY_DATA = {
    'Li⁺-F⁻': 8,   // LiF - very low (similar sizes, strong lattice)
    'Na⁺-F⁻': 15,  // NaF - low
    'K⁺-F⁻': 35,   // KF - moderate (curve starts rising)
    'Rb⁺-F⁻': 65,  // RbF - high (steepening)
    'Cs⁺-F⁻': 92,  // CsF - very high (big mismatch)
    'Li⁺-I⁻': 92,  // LiI - very high (big mismatch)
    'Na⁺-I⁻': 60,  // NaI - drops significantly
    'K⁺-I⁻': 38,   // KI - crossing point area
    'Rb⁺-I⁻': 22,  // RbI - leveling off
    'Cs⁺-I⁻': 12,  // CsI - low (similar sizes)
};

export default function AlkaliHalideSolubility() {
    const [selectedCation, setSelectedCation] = useState(CATIONS[0]);
    const [selectedAnion, setSelectedAnion] = useState(ANIONS[1]);
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

    // Calculate size mismatch
    const sizeMismatch = Math.abs(selectedCation.radius - selectedAnion.radius);
    const mismatchPercent = (sizeMismatch / 150) * 100; // Normalize to percentage
    const solubilityKey = `${selectedCation.symbol}-${selectedAnion.symbol}`;
    const solubility = SOLUBILITY_DATA[solubilityKey as keyof typeof SOLUBILITY_DATA] || 50;

    // SVG Graph dimensions
    const graphWidth = 320;
    const graphHeight = 280;
    const padding = 40;

    // Generate curve points for F- (increasing) and I- (decreasing)
    const fluoridePath = CATIONS.map((c, i) => {
        const x = padding + (i / (CATIONS.length - 1)) * (graphWidth - 2 * padding);
        const sol = SOLUBILITY_DATA[`${c.symbol}-F⁻` as keyof typeof SOLUBILITY_DATA] || 50;
        const y = graphHeight - padding - (sol / 100) * (graphHeight - 2 * padding);
        return { x, y, cation: c, solubility: sol };
    });

    const iodidePath = CATIONS.map((c, i) => {
        const x = padding + (i / (CATIONS.length - 1)) * (graphWidth - 2 * padding);
        const sol = SOLUBILITY_DATA[`${c.symbol}-I⁻` as keyof typeof SOLUBILITY_DATA] || 50;
        const y = graphHeight - padding - (sol / 100) * (graphHeight - 2 * padding);
        return { x, y, cation: c, solubility: sol };
    });

    // Create smooth Catmull-Rom spline path (natural curve through all points)
    const createSmoothCurve = (points: typeof fluoridePath) => {
        if (points.length < 2) return '';

        // For Catmull-Rom, we need to add virtual points at start and end
        const pts = [
            { x: points[0].x - (points[1].x - points[0].x), y: points[0].y - (points[1].y - points[0].y) },
            ...points,
            {
                x: points[points.length - 1].x + (points[points.length - 1].x - points[points.length - 2].x),
                y: points[points.length - 1].y + (points[points.length - 1].y - points[points.length - 2].y)
            }
        ];

        let path = `M ${points[0].x} ${points[0].y}`;

        // Catmull-Rom to Bezier conversion
        for (let i = 1; i < pts.length - 2; i++) {
            const p0 = pts[i - 1];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2];

            // Convert Catmull-Rom to cubic Bezier control points
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }

        return path;
    };

    return (
        <div className="mt-16 mb-12">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span className="bg-indigo-500/10 text-indigo-400 p-2 rounded-xl"><Atom className="w-5 h-5" /></span>
                Alkali Halide Solubility: The Size Mismatch Rule
            </h3>
            <p className="text-gray-400 text-base mb-8 leading-relaxed max-w-3xl">
                A significant mismatch in ionic sizes leads to <span className="text-white font-medium">lower lattice energy</span> and
                thus <span className="text-emerald-400 font-medium">higher solubility</span>. See how fluorides and iodides show opposite trends!
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Interactive Graph */}
                <div>
                    <h4 className="text-base font-medium text-gray-300 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                        Solubility vs Cation Radius
                    </h4>

                    <div className="relative">
                        <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full max-w-md">
                            {/* Grid lines */}
                            {[0, 25, 50, 75, 100].map((val) => {
                                const y = graphHeight - padding - (val / 100) * (graphHeight - 2 * padding);
                                return (
                                    <g key={val}>
                                        <line
                                            x1={padding}
                                            y1={y}
                                            x2={graphWidth - padding}
                                            y2={y}
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeDasharray="4"
                                        />
                                        <text x={padding - 8} y={y + 4} className="fill-gray-600 text-[10px]" textAnchor="end">
                                            {val === 0 ? 'Low' : val === 100 ? 'High' : ''}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Fluoride curve (rose) */}
                            <path
                                d={createSmoothCurve(fluoridePath)}
                                fill="none"
                                stroke="url(#fluorideGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Iodide curve (purple) */}
                            <path
                                d={createSmoothCurve(iodidePath)}
                                fill="none"
                                stroke="url(#iodideGradient)"
                                strokeWidth="3"
                                strokeLinecap="round"
                            />

                            {/* Gradients */}
                            <defs>
                                <linearGradient id="fluorideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#f43f5e" />
                                    <stop offset="100%" stopColor="#fb7185" />
                                </linearGradient>
                                <linearGradient id="iodideGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#a855f7" />
                                    <stop offset="100%" stopColor="#c084fc" />
                                </linearGradient>
                            </defs>

                            {/* Data points - Fluoride */}
                            {fluoridePath.map((p, i) => (
                                <g key={`f-${i}`}>
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={hoveredPoint === `F-${i}` ? 8 : 5}
                                        className="fill-rose-500 cursor-pointer transition-all"
                                        onMouseEnter={() => setHoveredPoint(`F-${i}`)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                        onClick={() => {
                                            setSelectedCation(p.cation);
                                            setSelectedAnion(ANIONS[0]);
                                        }}
                                    />
                                    {hoveredPoint === `F-${i}` && (
                                        <g>
                                            <rect
                                                x={p.x - 35}
                                                y={p.y - 35}
                                                width="70"
                                                height="28"
                                                rx="4"
                                                className="fill-gray-800"
                                            />
                                            <text x={p.x} y={p.y - 18} className="fill-white text-[11px] font-medium" textAnchor="middle">
                                                {p.cation.symbol.replace('⁺', '')}F
                                            </text>
                                        </g>
                                    )}
                                </g>
                            ))}

                            {/* Data points - Iodide */}
                            {iodidePath.map((p, i) => (
                                <g key={`i-${i}`}>
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={hoveredPoint === `I-${i}` ? 8 : 5}
                                        className="fill-purple-500 cursor-pointer transition-all"
                                        onMouseEnter={() => setHoveredPoint(`I-${i}`)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                        onClick={() => {
                                            setSelectedCation(p.cation);
                                            setSelectedAnion(ANIONS[1]);
                                        }}
                                    />
                                    {hoveredPoint === `I-${i}` && (
                                        <g>
                                            <rect
                                                x={p.x - 35}
                                                y={p.y - 35}
                                                width="70"
                                                height="28"
                                                rx="4"
                                                className="fill-gray-800"
                                            />
                                            <text x={p.x} y={p.y - 18} className="fill-white text-[11px] font-medium" textAnchor="middle">
                                                {p.cation.symbol.replace('⁺', '')}I
                                            </text>
                                        </g>
                                    )}
                                </g>
                            ))}

                            {/* X-axis labels */}
                            {CATIONS.map((c, i) => {
                                const x = padding + (i / (CATIONS.length - 1)) * (graphWidth - 2 * padding);
                                return (
                                    <text
                                        key={c.symbol}
                                        x={x}
                                        y={graphHeight - 12}
                                        className="fill-gray-400 text-[11px]"
                                        textAnchor="middle"
                                    >
                                        {c.symbol}
                                    </text>
                                );
                            })}

                            {/* Axis labels */}
                            <text x={graphWidth / 2} y={graphHeight - 0} className="fill-gray-500 text-[10px]" textAnchor="middle">
                                Cation Radius →
                            </text>
                            <text
                                x={12}
                                y={graphHeight / 2}
                                className="fill-gray-500 text-[10px]"
                                textAnchor="middle"
                                transform={`rotate(-90, 12, ${graphHeight / 2})`}
                            >
                                Solubility →
                            </text>
                        </svg>

                        {/* Legend */}
                        <div className="flex gap-6 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                <span className="text-gray-400">Fluorides (F⁻)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-gray-400">Iodides (I⁻)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ion Size Visualizer */}
                <div>
                    <h4 className="text-base font-medium text-gray-300 mb-4 flex items-center gap-2">
                        <Atom className="w-4 h-4 text-emerald-400" />
                        Ion Size Comparator
                    </h4>

                    {/* Cation Selection */}
                    <div className="mb-4">
                        <p className="text-gray-500 text-xs mb-2">Select Cation</p>
                        <div className="flex gap-2 flex-wrap">
                            {CATIONS.map((c) => (
                                <button
                                    key={c.symbol}
                                    onClick={() => setSelectedCation(c)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedCation.symbol === c.symbol
                                        ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/50'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                        }`}
                                >
                                    {c.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Anion Selection */}
                    <div className="mb-6">
                        <p className="text-gray-500 text-xs mb-2">Select Anion</p>
                        <div className="flex gap-2">
                            {ANIONS.map((a) => (
                                <button
                                    key={a.symbol}
                                    onClick={() => setSelectedAnion(a)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedAnion.symbol === a.symbol
                                        ? a.color === 'rose'
                                            ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-500/50'
                                            : 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                                        }`}
                                >
                                    {a.symbol}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visual Size Comparison */}
                    <div className="flex items-center justify-center gap-3 py-6">
                        {/* Cation */}
                        <div className="flex flex-col items-center">
                            <div
                                className="bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                                style={{
                                    width: `${Math.max(30, selectedCation.radius / 2.5)}px`,
                                    height: `${Math.max(30, selectedCation.radius / 2.5)}px`,
                                    fontSize: `${Math.max(10, selectedCation.radius / 8)}px`
                                }}
                            >
                                +
                            </div>
                            <p className="text-cyan-300 text-sm font-medium mt-2">{selectedCation.symbol}</p>
                            <p className="text-gray-500 text-xs">{selectedCation.radius} pm</p>
                        </div>

                        <div className="text-gray-600 text-2xl">+</div>

                        {/* Anion */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`rounded-full flex items-center justify-center text-white font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all duration-300 ${selectedAnion.color === 'rose'
                                    ? 'bg-gradient-to-br from-rose-400 to-rose-600'
                                    : 'bg-gradient-to-br from-purple-400 to-purple-600'
                                    }`}
                                style={{
                                    width: `${Math.max(40, selectedAnion.radius / 2.5)}px`,
                                    height: `${Math.max(40, selectedAnion.radius / 2.5)}px`,
                                    fontSize: `${Math.max(12, selectedAnion.radius / 8)}px`
                                }}
                            >
                                −
                            </div>
                            <p className={`text-sm font-medium mt-2 ${selectedAnion.color === 'rose' ? 'text-rose-300' : 'text-purple-300'}`}>
                                {selectedAnion.symbol}
                            </p>
                            <p className="text-gray-500 text-xs">{selectedAnion.radius} pm</p>
                        </div>

                        <div className="text-gray-600 text-2xl">=</div>

                        {/* Result */}
                        <div className="flex flex-col items-center">
                            <div className="text-2xl font-bold text-white">
                                {selectedCation.symbol.replace('⁺', '')}{selectedAnion.symbol.replace('⁻', '')}
                            </div>
                        </div>
                    </div>

                    {/* Mismatch & Solubility Indicator */}
                    <div className="mt-4 space-y-3">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Size Mismatch</span>
                                <span className="text-white font-medium">{sizeMismatch} pm</span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                                    style={{ width: `${Math.min(100, mismatchPercent)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-gray-600 mt-1">
                                <span>Similar sizes</span>
                                <span>Large mismatch</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-400">Predicted Solubility</span>
                                <span className={`font-medium ${solubility > 60 ? 'text-emerald-400' : solubility > 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {solubility > 60 ? 'High' : solubility > 30 ? 'Moderate' : 'Low'}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${solubility > 60 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                                        solubility > 30 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' :
                                            'bg-gradient-to-r from-rose-500 to-red-400'
                                        }`}
                                    style={{ width: `${solubility}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Insight Box */}
                    <div className="mt-6 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/20">
                        <div className="flex gap-2">
                            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-indigo-300 text-sm leading-relaxed">
                                {sizeMismatch > 100 ? (
                                    <>
                                        <span className="font-semibold">Large mismatch!</span> The {selectedCation.name} ion ({selectedCation.radius} pm) and {selectedAnion.name} ion ({selectedAnion.radius} pm) have very different sizes, resulting in a weaker lattice and <span className="text-emerald-300">higher solubility</span>.
                                    </>
                                ) : sizeMismatch > 50 ? (
                                    <>
                                        <span className="font-semibold">Moderate mismatch.</span> The size difference of {sizeMismatch} pm leads to moderate lattice stability and <span className="text-amber-300">moderate solubility</span>.
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold">Similar sizes!</span> {selectedCation.name} ({selectedCation.radius} pm) and {selectedAnion.name} ({selectedAnion.radius} pm) pack efficiently, creating a strong lattice and <span className="text-rose-300">lower solubility</span>.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Observations - Matching Periodic Trends Style */}
            <div className="mt-8 p-6 bg-gray-900/60 rounded-2xl border border-gray-700/50">
                <h4 className="text-amber-400 font-semibold mb-5 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Key Observations
                </h4>
                <div className="space-y-4">
                    <div className="pl-4 border-l-2 border-amber-500/50">
                        <p className="text-gray-300 leading-relaxed">
                            <span className="text-white font-medium">LiI and CsF</span> are highly soluble due to large size mismatch (133pm and 62pm respectively).
                        </p>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-500/50">
                        <p className="text-gray-300 leading-relaxed">
                            <span className="text-white font-medium">LiF and CsI</span> are less soluble because ions have similar sizes (46pm and 25pm difference).
                        </p>
                    </div>
                    <div className="pl-4 border-l-2 border-amber-500/50">
                        <p className="text-gray-300 leading-relaxed">
                            This explains why the <span className="text-white font-medium">fluoride and iodide solubility curves cross</span> — opposite trends based on size matching!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
