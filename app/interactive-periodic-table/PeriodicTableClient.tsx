'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Atom,
    Zap,
    AlertTriangle,
    Info,
    ChevronDown,
    X,
    Sparkles,
    TrendingUp,
    BarChart3,
    BookOpen,
} from 'lucide-react';
import {
    ELEMENTS,
    CATEGORY_COLORS,
    PROPERTY_INFO,
    getPropertyValue,
    getPropertyRange,
    getColorForValue,
    type Element,
    type CategoryType,
} from '../lib/elementsData';
import PeriodicTableQuiz from './PeriodicTableQuiz';

type ViewMode = 'category' | 'property' | 'exceptions';

const PROPERTIES = Object.keys(PROPERTY_INFO);

export default function PeriodicTableClient() {
    const [viewMode, setViewMode] = useState<ViewMode>('category');
    const [selectedProperty, setSelectedProperty] = useState('electronegativity');
    const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [compareElements, setCompareElements] = useState<Element[]>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);

    const comparisonRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to comparison when elements are added
    useEffect(() => {
        if (compareElements.length > 0) {
            setTimeout(() => {
                comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [compareElements.length]);

    // Get property range for heatmap coloring
    const propertyRange = useMemo(() => {
        return getPropertyRange(selectedProperty);
    }, [selectedProperty]);

    // Get elements with exceptions
    const exceptionElements = useMemo(() => {
        return ELEMENTS.filter(e => e.isException);
    }, []);

    // Get element background color based on view mode
    const getElementColor = (element: Element): string => {
        if (viewMode === 'category') {
            return CATEGORY_COLORS[element.category as CategoryType] || '#6b7280';
        } else if (viewMode === 'property') {
            const value = getPropertyValue(element, selectedProperty);
            if (value === undefined) return '#374151';
            return getColorForValue(value, propertyRange.min, propertyRange.max);
        } else if (viewMode === 'exceptions') {
            if (element.isException) {
                return '#ef4444'; // Red for exceptions
            }
            return '#374151'; // Gray for non-exceptions
        }
        return '#6b7280';
    };

    // Toggle element in comparison
    const toggleCompare = (element: Element) => {
        if (compareElements.find(e => e.atomicNumber === element.atomicNumber)) {
            setCompareElements(compareElements.filter(e => e.atomicNumber !== element.atomicNumber));
        } else if (compareElements.length < 4) {
            setCompareElements([...compareElements, element]);
        }
    };

    // Check if a color is light (needs dark text)
    const isLightColor = (color: string): boolean => {
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5;
        }
        if (color.startsWith('hsl')) {
            const match = color.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
            if (match) {
                const h = parseFloat(match[1]) / 360;
                const s = parseFloat(match[2]) / 100;
                const l = parseFloat(match[3]) / 100;
                let r, g, b;
                if (s === 0) {
                    r = g = b = l;
                } else {
                    const hue2rgb = (p: number, q: number, t: number) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };
                    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    const p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                return luminance > 0.5;
            }
        }
        return false;
    };

    // Render a single element cell
    const ElementCell = ({ element }: { element: Element }) => {
        // const isHovered = hoveredElement?.atomicNumber === element.atomicNumber; // Unused
        const isSelected = selectedElement?.atomicNumber === element.atomicNumber;
        const isComparing = compareElements.some(e => e.atomicNumber === element.atomicNumber);
        const bgColor = getElementColor(element);
        const isDark = !isLightColor(bgColor);

        // Get property value for display in trend mode
        const propertyValue = viewMode === 'property' ? getPropertyValue(element, selectedProperty) : undefined;
        const propertyInfo = PROPERTY_INFO[selectedProperty];

        return (
            <motion.div
                className={`
          relative cursor-pointer rounded-md p-1 sm:p-1.5 
          transition-all duration-200 select-none
          opacity-100 
          ${isComparing ? 'ring-2 ring-cyan-400' : ''}
        `}
                style={{
                    backgroundColor: bgColor,
                    gridColumn: element.col,
                    gridRow: element.row,
                }}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                onMouseEnter={() => {
                    if (!selectedElement) setHoveredElement(element);
                }}
                onMouseLeave={() => {
                    if (!selectedElement) setHoveredElement(null);
                }}
                onClick={() => setSelectedElement(element)}
            >
                {/* Exception indicator */}
                {element.isException && viewMode !== 'exceptions' && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse border border-gray-900" />
                )}

                {/* Atomic number */}
                <div
                    className={`text-[8px] sm:text-[10px] font-medium leading-none ${isDark ? 'text-white/90' : 'text-gray-800/90'}`}
                    style={{ textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}
                >
                    {element.atomicNumber}
                </div>

                {/* Symbol */}
                <div
                    className={`text-sm sm:text-lg font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}
                    style={{ textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}
                >
                    {element.symbol}
                </div>

                {/* Property Value (shown in trend mode) OR Name (shown in category mode) */}
                {viewMode === 'property' && propertyValue !== undefined ? (
                    <div
                        className={`text-[8px] sm:text-[9px] font-bold leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}
                        style={{ textShadow: isDark ? '0 1px 2px rgba(0,0,0,0.5)' : 'none' }}
                        title={`${propertyInfo?.name}: ${propertyValue} ${propertyInfo?.unit || ''}`}
                    >
                        {propertyValue}
                    </div>
                ) : (
                    <div
                        className={`hidden sm:block text-[7px] truncate leading-none ${isDark ? 'text-white/80' : 'text-gray-800/80'}`}
                    >
                        {element.name}
                    </div>
                )}
            </motion.div>
        );
    };





    // Comparison panel
    const ComparisonPanel = () => {
        if (compareElements.length < 1) return null; // Changed to 1 to show even single element in list

        return (
            <motion.div
                ref={comparisonRef}
                id="comparison-section" // ID for specific scrolling targeting
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700 mt-8 scroll-mt-32"
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 size={20} />
                        Comparing Elements
                    </h3>
                    <button
                        onClick={() => setCompareElements([])}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        Clear All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left text-gray-400 py-4 px-4 bg-gray-900/50 sticky left-0 z-10 w-40">Property</th>
                                {compareElements.map(el => (
                                    <th key={el.atomicNumber} className="text-center text-white py-4 px-4 min-w-[120px]">
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
                                                style={{ backgroundColor: getElementColor(el), color: isLightColor(getElementColor(el)) ? 'black' : 'white' }}
                                            >
                                                {el.symbol}
                                            </div>
                                            <span className="text-sm font-normal text-gray-400">{el.name}</span>
                                            <button
                                                onClick={() => toggleCompare(el)}
                                                className="text-gray-600 hover:text-red-400 p-1"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PROPERTIES.map(prop => (
                                <tr key={prop} className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors">
                                    <td className="text-gray-300 py-3 px-4 bg-gray-900/50 sticky left-0 font-medium">
                                        {PROPERTY_INFO[prop].name}
                                        <div className="text-[10px] text-gray-500 font-normal">{PROPERTY_INFO[prop].unit}</div>
                                    </td>
                                    {compareElements.map(el => {
                                        const val = getPropertyValue(el, prop);
                                        return (
                                            <td key={el.atomicNumber} className="text-center text-white py-3 px-4">
                                                {val !== undefined ? val : <span className="text-gray-600">-</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        );
    };

    const CategoryLegend = () => (
        <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                <div key={category} className="flex items-center gap-1.5 text-xs">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                    <span className="text-gray-400">{category}</span>
                </div>
            ))}
        </div>
    );

    const PropertyLegend = () => {
        const info = PROPERTY_INFO[selectedProperty];
        return (
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-sm text-gray-400">Low</span>
                    <div
                        className="h-4 w-32 rounded"
                        style={{
                            background: 'linear-gradient(to right, hsl(210, 80%, 50%), hsl(60, 80%, 60%), hsl(0, 80%, 50%))'
                        }}
                    />
                    <span className="text-sm text-gray-400">High</span>
                </div>
                <p className="text-xs text-gray-500">{info?.trendDescription}</p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-cyan-500/30">
            {/* Expanded Element Modal */}
            <AnimatePresence>
                {selectedElement && (
                    <ElementModalContent
                        key={`modal-${selectedElement.atomicNumber}`}
                        element={selectedElement}
                        bgColor={getElementColor(selectedElement)}
                        isDark={!isLightColor(getElementColor(selectedElement))}
                        compareElements={compareElements}
                        toggleCompare={toggleCompare}
                        onClose={() => setSelectedElement(null)}
                    />
                )}
            </AnimatePresence>

            {/* Hero Header */}
            <section className="relative pt-32 pb-6 md:pt-40 md:pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-gray-950" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-4 backdrop-blur-sm">
                        <Sparkles size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-blue-400">NCERT Data Visualizations</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Interactive Periodic Table
                        </span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
                        Explore trends, compare properties, and discover exceptions. <span className="text-blue-400 font-medium">Trained on NCERT data for JEE, NEET & CBSE.</span>
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-20 relative z-10">
                {/* Mode selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-2">
                    <button
                        onClick={() => setViewMode('category')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'category'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <Atom size={18} />
                        Categories
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => {
                                setViewMode('property');
                                setShowPropertyDropdown(!showPropertyDropdown);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'property'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <TrendingUp size={18} />
                            Trends
                            <ChevronDown size={16} />
                        </button>

                        <AnimatePresence>
                            {showPropertyDropdown && viewMode === 'property' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50 min-w-[200px]"
                                >
                                    {PROPERTIES.map(prop => (
                                        <button
                                            key={prop}
                                            onClick={() => {
                                                setSelectedProperty(prop);
                                                setShowPropertyDropdown(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${selectedProperty === prop ? 'bg-blue-500/20 text-blue-400' : 'text-gray-300'
                                                }`}
                                        >
                                            {PROPERTY_INFO[prop].name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <button
                        onClick={() => setViewMode('exceptions')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'exceptions'
                            ? 'bg-yellow-500 text-gray-900'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        <AlertTriangle size={18} />
                        Exceptions ({exceptionElements.length})
                    </button>
                </div>

                {/* Selected property info */}
                {viewMode === 'property' && (
                    <div className="text-center mb-2">
                        <span className="text-lg font-semibold text-blue-400">
                            {PROPERTY_INFO[selectedProperty]?.name}
                        </span>
                        <span className="text-gray-500 ml-2">
                            ({PROPERTY_INFO[selectedProperty]?.unit})
                        </span>
                    </div>
                )}

                {/* Main grid layout */}
                <div className="flex flex-col gap-2">
                    {/* Table */}
                    <div className="overflow-x-auto pb-4">


                        <div
                            className="grid gap-0.5 sm:gap-1 min-w-[700px] mx-auto max-w-7xl"
                            style={{
                                gridTemplateColumns: 'repeat(18, minmax(32px, 1fr))',
                                gridTemplateRows: 'repeat(10, minmax(40px, auto))',
                            }}
                        >
                            {/* Group numbers */}
                            {Array.from({ length: 18 }, (_, i) => (
                                <div
                                    key={`group-${i + 1}`}
                                    className="text-center text-xs text-gray-500 font-medium"
                                    style={{ gridColumn: i + 1, gridRow: 0 }}
                                >
                                    {i + 1}
                                </div>
                            ))}

                            {/* Lanthanide/Actinide placeholders in main table */}
                            <div className="text-[10px] text-gray-500 flex items-center justify-center" style={{ gridColumn: 3, gridRow: 6 }}>57-71</div>
                            <div className="text-[10px] text-gray-500 flex items-center justify-center" style={{ gridColumn: 3, gridRow: 7 }}>89-103</div>

                            {/* Render all elements */}
                            {ELEMENTS.map(element => (
                                <ElementCell key={element.atomicNumber} element={element} />
                            ))}

                            {/* Lanthanide label */}
                            <div className="text-xs text-pink-400 flex items-center" style={{ gridColumn: 1, gridRow: 8 }}>Lanthanides</div>
                            <div className="text-xs text-purple-400 flex items-center" style={{ gridColumn: 1, gridRow: 9 }}>Actinides</div>
                        </div>

                        {/* Legend */}
                        <div className="mt-4">
                            {viewMode === 'category' && <CategoryLegend />}
                            {viewMode === 'property' && <PropertyLegend />}
                            {viewMode === 'exceptions' && (
                                <p className="text-center text-sm text-gray-400">
                                    Red elements show exceptions. Click to learn why.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Comparison panel */}
                <ComparisonPanel />

                {/* Link to NCERT Trends Page */}
                <div id="trends-section" className="mt-8 px-2 sm:px-0">
                    <a href="/periodic-trends" className="block bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 rounded-xl border border-violet-500/30 p-4 sm:p-5 hover:border-violet-500/60 transition-all group">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 sm:p-2.5 rounded-lg bg-violet-500/20 border border-violet-500/30">
                                    <TrendingUp size={20} className="text-violet-400" />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-violet-300 transition-colors">Periodic Trends & Exceptions</h3>
                                    <p className="text-gray-400 text-xs">Master all NCERT data with interactive graphs</p>
                                </div>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-violet-400 group-hover:translate-x-1 transition-transform">
                                <span className="text-sm font-medium">Explore</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </div>
                        </div>
                    </a>
                </div>

                {/* Memory Practice Quiz Section */}
                <div className="mt-8">
                    <PeriodicTableQuiz />
                </div>


            </div>
        </div >
    );
}

// --- Extracted Components ---

const DetailItem = ({ label, value }: { label: string, value: string | number | undefined }) => (
    <div className="bg-gray-800/50 p-2.5 sm:p-3 rounded-lg border border-gray-700/50 flex flex-col justify-center">
        <div className="text-[10px] sm:text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wider">{label}</div>
        <div className="text-white text-sm sm:text-base font-semibold truncate" title={String(value)}>{value ?? '-'}</div>
    </div>
);

const SpecialChemistry = ({ element }: { element: Element }) => {
    const getNatureColor = (nature: string | undefined) => {
        if (!nature) return 'bg-gray-700 text-gray-200';
        const n = nature.toLowerCase();
        if (n.includes('acidic')) return 'bg-red-900/40 text-red-200 border-red-700/50';
        if (n.includes('basic')) return 'bg-blue-900/40 text-blue-200 border-blue-700/50';
        if (n.includes('amphoteric')) return 'bg-purple-900/40 text-purple-200 border-purple-700/50';
        return 'bg-gray-700 text-gray-200';
    };

    const hasData = element.flameColor || element.gasColor || element.block === 'd' || element.oxides || element.redoxNature || element.compoundsInfo;

    if (!hasData) return null;

    return (
        <div className="space-y-6 text-base">
            {/* Transition Metal Chemistry (Specific Layout) */}
            {element.block === 'd' && (
                <div className="bg-cyan-950/30 rounded-xl p-5 border border-cyan-500/30">
                    <h3 className="text-xl font-bold text-cyan-400 mb-5 flex items-center gap-2">
                        <span className="text-2xl">🧪</span> Transition Metal Chemistry
                    </h3>

                    <div className="space-y-6">
                        {/* 1. Aquated Ion Colors */}
                        {element.ionColors && element.ionColors.length > 0 && (
                            <div>
                                <h4 className="text-cyan-200/80 font-medium mb-3">Aquated Ion Colors:</h4>
                                <div className="space-y-3 pl-2">
                                    {element.ionColors.map((ion, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div
                                                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                                                style={{ backgroundColor: ion.hexColor === 'transparent' ? '#1f2937' : ion.hexColor }}
                                            />
                                            <div className="flex items-baseline gap-2 text-gray-200">
                                                <span className="font-bold text-lg">{formatFormula(ion.ion)}</span>
                                                {ion.config && <span className="text-gray-500 font-mono text-sm">({ion.config})</span>}
                                                <span className="text-gray-500">→</span>
                                                <span className={`${ion.hexColor !== 'transparent' ? 'text-white' : 'text-gray-400'}`}>
                                                    {ion.color}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Oxides Formed */}
                        {(element.oxides || element.oxideNature) && (
                            <div>
                                {element.oxides && (
                                    <>
                                        <h4 className="text-cyan-200/80 font-medium mb-3">Oxides Formed:</h4>
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {element.oxides.map(oxide => (
                                                <span key={oxide} className="bg-orange-900/30 text-orange-200 border border-orange-700/30 px-3 py-1.5 rounded-lg text-base font-mono">
                                                    {formatFormula(oxide)}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {element.oxideNature && (
                                    <div className="mt-2">
                                        <span className={`px-3 py-1 rounded-md text-sm font-semibold border ${getNatureColor(element.oxideNature)}`}>
                                            {element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1)} Oxide
                                        </span>
                                        {element.oxideNatureDetails && (
                                            <p className="mt-2 text-cyan-100/70 text-sm leading-relaxed">
                                                {formatFormula(element.oxideNatureDetails)}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3. Halides Formed (New Section) */}
                        {element.halides && element.halides.length > 0 && (
                            <div>
                                <h4 className="text-cyan-200/80 font-medium mb-3">Halides Formed:</h4>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {element.halides.map(halide => (
                                        <span key={halide} className="bg-green-900/30 text-green-200 border border-green-700/30 px-3 py-1.5 rounded-lg text-base font-mono">
                                            {formatFormula(halide)}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-sm italic">X = F, Cl, Br, I (unless specified)</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Other Chemistry (Redox, etc) - for non-d-block or additional info */}
            {(element.block as string) !== 'd' && (
                <>
                    {/* Redox & Oxidation Behavior */}
                    {(element.redoxNature || element.stableOxidationState !== undefined) && (
                        <div className="bg-orange-900/10 rounded-xl p-5 border border-orange-500/20">
                            <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                                <Zap size={20} /> Oxidation & Reactivity
                            </h3>
                            <div className="space-y-3">
                                {element.stableOxidationState !== undefined && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400 w-32">Stable State:</span>
                                        <span className="text-white font-mono text-lg">+{element.stableOxidationState}</span>
                                    </div>
                                )}
                                {element.oxidationStates && (
                                    <div className="flex items-start gap-2">
                                        <span className="text-gray-400 w-32">Common States:</span>
                                        <span className="text-gray-300 font-mono text-lg">{element.oxidationStates.map(s => (s > 0 ? `+${s}` : s)).join(', ')}</span>
                                    </div>
                                )}
                                {element.redoxNature && (
                                    <div className="flex items-start gap-2 mt-2">
                                        <span className="text-gray-400 w-32">Nature:</span>
                                        <div>
                                            <span className={`font-semibold uppercase text-sm tracking-wider px-2 py-0.5 rounded ${element.redoxNature === 'oxidizing' ? 'bg-red-500/20 text-red-300' :
                                                element.redoxNature === 'reducing' ? 'bg-green-500/20 text-green-300' : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                {element.redoxNature} Agent
                                            </span>
                                            {element.redoxExplanation && (
                                                <p className="text-gray-400 mt-2 leading-relaxed">
                                                    {element.redoxExplanation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Oxides for non-d-block */}
                    {(element.oxides || element.oxideNature) && (element.block as string) !== 'd' && (
                        <div className="bg-indigo-900/10 rounded-xl p-5 border border-indigo-500/20">
                            <h3 className="text-lg font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                                <Atom size={20} /> Oxide Chemistry
                            </h3>
                            {element.oxides && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {element.oxides.map(oxide => (
                                        <span key={oxide} className="bg-indigo-500/10 text-indigo-200 px-3 py-1 rounded-lg font-mono border border-indigo-500/20">
                                            {formatFormula(oxide)}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {element.oxideNatureDetails && (
                                <div className="text-gray-300 leading-relaxed pl-3 border-l-2 border-indigo-500/30">
                                    <span className={`font-semibold mr-2 ${getNatureColor(element.oxideNature) === 'bg-gray-700 text-gray-200' ? 'text-indigo-300' : 'px-2 py-0.5 rounded text-xs ' + getNatureColor(element.oxideNature)}`}>
                                        {element.oxideNature ? element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1) : ''} Nature
                                    </span>
                                    <span className="block mt-1">{formatFormula(element.oxideNatureDetails)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Flame/Gas Colors (General) */}
            {(element.flameColor || element.gasColor) && (
                <div className="bg-gray-800/30 rounded-xl p-5 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="text-yellow-400" size={20} /> Physical Appearance
                    </h3>
                    <div className="space-y-4">
                        {element.flameColor && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 w-32">Flame Color:</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20 shadow-[0_0_10px_currentColor]"
                                        style={{ color: element.flameColor.hexColor, backgroundColor: element.flameColor.hexColor }}
                                    />
                                    <span className="text-white text-lg">{element.flameColor.color}</span>
                                </div>
                            </div>
                        )}
                        {element.gasColor && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 w-32">Gas Color:</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border border-white/20"
                                        style={{ backgroundColor: element.gasColor.hexColor }}
                                    />
                                    <span className="text-white text-lg">{element.gasColor.color} ({formatFormula(element.gasColor.formula)})</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Common Compounds (General) */}
            {element.compoundsInfo && element.compoundsInfo.length > 0 && (
                <div className="bg-emerald-900/10 rounded-xl p-5 border border-emerald-500/20">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-4">Important Compounds</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {element.compoundsInfo.map((comp, i) => (
                            <div key={i} className="bg-gray-800/40 p-3 rounded-lg flex flex-col gap-1 border border-gray-700/50">
                                <div className="flex justify-between items-start">
                                    <span className="text-white font-mono font-bold text-lg">{formatFormula(comp.formula)}</span>
                                    {comp.nature && (
                                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${comp.nature.includes('acidic') ? 'bg-red-900/40 text-red-300' :
                                            comp.nature.includes('basic') ? 'bg-blue-900/40 text-blue-300' :
                                                'bg-gray-700 text-gray-300'
                                            }`}>
                                            {comp.nature}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    {comp.hexColor && (
                                        <div
                                            className="w-3 h-3 rounded-full border border-gray-600 shrink-0"
                                            style={{ backgroundColor: comp.hexColor }}
                                        />
                                    )}
                                    <span className="text-gray-400 text-sm">{comp.color}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper to format chemical formulas (subscript numbers)
const formatFormula = (formula: string) => {
    return formula.split(/(\d+)/).map((part, index) =>
        /^\d+$/.test(part) ? <sub key={index} className="text-[0.7em]">{part}</sub> : part
    );
};

const ElementModalContent = ({
    element,
    bgColor,
    isDark,
    compareElements,
    toggleCompare,
    onClose
}: {
    element: Element,
    bgColor: string,
    isDark: boolean,
    compareElements: Element[],
    toggleCompare: (el: Element) => void,
    onClose: () => void
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                onClick={onClose}
            />

            {/* Card Wrapper */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-2xl max-h-[90vh] pointer-events-auto flex flex-col"
            >
                {/* Static Close Button - Outside */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 sm:-right-8 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors z-50 flex items-center justify-center border-2 border-white/20"
                    title="Close"
                >
                    <X size={20} strokeWidth={2.5} />
                </button>

                {/* Scrollable Content Container */}
                <div
                    className="w-full h-full overflow-y-auto bg-gray-900 rounded-2xl shadow-2xl border border-gray-700"
                    style={{ backgroundColor: '#111827' }}
                >
                    {/* Header Colored Strip */}
                    <div
                        className="p-5 md:p-6 relative"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className={`text-4xl md:text-5xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {element.symbol}
                                </div>
                                <div className={`text-lg md:text-xl font-medium ${isDark ? 'text-white/90' : 'text-gray-900/90'}`}>
                                    {element.name}
                                </div>
                                <div className={`text-xs md:text-sm font-medium opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {element.category}
                                </div>
                            </div>
                            <div className={`text-right mt-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <div className="text-2xl md:text-3xl font-bold opacity-50 leading-none">{element.atomicNumber}</div>
                                <div className="text-sm md:text-base font-medium opacity-80 mt-1">{element.atomicMass} u</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 md:p-6 bg-gray-900 text-white">
                        {/* Comparison Action */}
                        <div className="flex gap-3 mb-6">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCompare(element);
                                }}
                                className={`flex-1 py-2 sm:py-2.5 px-4 rounded-lg font-bold text-center transition-all flex items-center justify-center gap-2 text-sm
                                ${compareElements.some(e => e.atomicNumber === element.atomicNumber)
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                                    }`}
                            >
                                {compareElements.some(e => e.atomicNumber === element.atomicNumber)
                                    ? <><X size={18} /> Remove from Compare</>
                                    : <><BarChart3 size={18} /> Compare Element</>
                                }
                            </button>
                        </div>

                        {/* Exception Alert */}
                        {element.isException && (
                            <div className="bg-yellow-500/10 border border-yellow-500/40 rounded-xl p-5 mb-8">
                                <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg mb-2">
                                    <AlertTriangle size={20} />
                                    Exception: {element.exceptionType}
                                </div>
                                <p className="text-yellow-100/80 leading-relaxed">{element.exceptionExplanation}</p>
                            </div>
                        )}

                        {/* Properties Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                            <DetailItem label="Electron Config" value={element.electronConfig} />
                            <DetailItem label="Atomic Radius" value={element.atomicRadius ? `${element.atomicRadius} pm` : '-'} />
                            <DetailItem label="Ionization Energy" value={element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : '-'} />
                            <DetailItem label="Electronegativity" value={element.electronegativity} />
                            <DetailItem label="Electron Affinity" value={element.electronAffinity !== undefined ? `${element.electronAffinity} kJ/mol` : '-'} />
                            <DetailItem label="Density" value={element.density ? `${element.density} g/cm³` : '-'} />
                            <DetailItem label="Melting Point" value={element.meltingPoint ? `${element.meltingPoint} K` : '-'} />
                            <DetailItem label="Boiling Point" value={element.boilingPoint ? `${element.boilingPoint} K` : '-'} />
                            <DetailItem label="Standard Potential" value={element.standardReductionPotential ? `${element.standardReductionPotential} V` : '-'} />
                        </div>

                        {/* Special Chemistry Sections */}
                        <SpecialChemistry element={element} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

