'use client';

import { useState, useMemo } from 'react';
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
    HelpCircle,
    BarChart3,
    BookOpen,
} from 'lucide-react';
import {
    ELEMENTS,
    CATEGORY_COLORS,
    PROPERTY_INFO,
    EXCEPTION_TYPES,
    getPropertyValue,
    getPropertyRange,
    getColorForValue,
    type Element,
    type CategoryType,
} from '../lib/elementsData';
import { BLOCK_DATA, type BlockInfo } from '../lib/blockData';
import PeriodicTableQuiz from './PeriodicTableQuiz';

type ViewMode = 'category' | 'property' | 'exceptions';

const PROPERTIES = Object.keys(PROPERTY_INFO);

export default function PeriodicTableClient() {
    const [viewMode, setViewMode] = useState<ViewMode>('category');
    const [selectedProperty, setSelectedProperty] = useState('electronegativity');
    const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [showExceptionsOnly, setShowExceptionsOnly] = useState(false);
    const [compareElements, setCompareElements] = useState<Element[]>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

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
        // Handle hex colors
        if (color.startsWith('#')) {
            const hex = color.slice(1);
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            // Calculate relative luminance
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5;
        }
        // Handle hsl colors - convert to RGB for accurate brightness check
        if (color.startsWith('hsl')) {
            // Match various HSL formats: hsl(h, s%, l%) or hsl(h,s%,l%)
            const match = color.match(/hsl\((\d+(?:\.\d+)?),\s*(\d+(?:\.\d+)?)%,\s*(\d+(?:\.\d+)?)%\)/);
            if (match) {
                const h = parseFloat(match[1]) / 360;
                const s = parseFloat(match[2]) / 100;
                const l = parseFloat(match[3]) / 100;

                // Convert HSL to RGB
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

                // Calculate perceived brightness (same formula as hex)
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                return luminance > 0.5;
            }
        }
        return false;
    };

    // Get text color based on background
    const getTextColor = (bgColor: string): string => {
        return isLightColor(bgColor) ? 'text-gray-900' : 'text-white';
    };

    const getTextOpacity = (bgColor: string, opacity: string): string => {
        return isLightColor(bgColor) ? opacity.replace('white', 'gray-900') : opacity;
    };

    // Render a single element cell
    const ElementCell = ({ element }: { element: Element }) => {
        const isHovered = hoveredElement?.atomicNumber === element.atomicNumber;
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
          ${isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
          ${isComparing ? 'ring-2 ring-cyan-400' : ''}
        `}
                style={{
                    backgroundColor: bgColor,
                    gridColumn: element.col,
                    gridRow: element.row,
                }}
                whileHover={{ scale: 1.15, zIndex: 10 }}
                onMouseEnter={() => {
                    // Don't update hover state if an element is already selected (prevents re-renders)
                    if (!selectedElement) setHoveredElement(element);
                }}
                onMouseLeave={() => {
                    // Don't update hover state if an element is already selected
                    if (!selectedElement) setHoveredElement(null);
                }}
                onClick={() => setSelectedElement(element)}
                onDoubleClick={() => toggleCompare(element)}
                layout
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

                {/* Unit label (only in property mode on larger screens) */}
                {viewMode === 'property' && propertyValue !== undefined ? (
                    <div
                        className={`hidden sm:block text-[6px] leading-none ${isDark ? 'text-white/60' : 'text-gray-700/70'}`}
                    >
                        {propertyInfo?.unit || ''}
                    </div>
                ) : (
                    /* Atomic mass (shown in category/exceptions mode) */
                    <div
                        className={`text-[7px] sm:text-[8px] leading-none ${isDark ? 'text-white/70' : 'text-gray-700/80'}`}
                    >
                        {element.atomicMass.toFixed(element.atomicMass < 10 ? 3 : 2)}
                    </div>
                )}
            </motion.div>
        );
    };

    // Block Info Modal - Shows NCERT tables for each block
    const BlockInfoModal = () => {
        if (!selectedBlock || !BLOCK_DATA[selectedBlock]) return null;
        const blockInfo = BLOCK_DATA[selectedBlock];

        const blockColors: Record<string, string> = {
            's': 'from-red-500/20 to-orange-500/20 border-red-500/40',
            'p': 'from-green-500/20 to-teal-500/20 border-green-500/40',
            'd': 'from-blue-500/20 to-cyan-500/20 border-blue-500/40',
            'f': 'from-purple-500/20 to-pink-500/20 border-purple-500/40'
        };

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedBlock(null)}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`bg-gradient-to-br ${blockColors[selectedBlock] || 'from-gray-500/20 to-gray-600/20 border-gray-500/40'} bg-gray-900 border rounded-2xl max-w-4xl max-h-[85vh] overflow-y-auto`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm p-4 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-cyan-400" size={24} />
                            <div>
                                <h2 className="text-xl font-bold text-white">{blockInfo.name}</h2>
                                <p className="text-sm text-gray-400">{blockInfo.description}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedBlock(null)}
                            className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Key Points */}
                    {blockInfo.keyPoints && blockInfo.keyPoints.length > 0 && (
                        <div className="p-4 bg-gray-800/50">
                            <h3 className="text-sm font-semibold text-cyan-300 mb-2">Key Points:</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                {blockInfo.keyPoints.map((point, idx) => (
                                    <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                                        <span className="text-cyan-400">•</span> {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Tables */}
                    <div className="p-4 space-y-6">
                        {blockInfo.tables.map((table, tableIdx) => (
                            <div key={tableIdx} className="bg-gray-800/60 rounded-xl overflow-hidden">
                                {/* Table Title */}
                                <div className="bg-gray-700/50 px-4 py-3 flex items-center justify-between">
                                    <h3 className="font-semibold text-white">{table.title}</h3>
                                    <span className="text-xs text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded">{table.source}</span>
                                </div>

                                {/* Table Content */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-700/30">
                                                {table.headers.map((header, idx) => (
                                                    <th key={idx} className="px-3 py-2 text-left text-cyan-200 font-medium whitespace-nowrap">
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {table.rows.map((row, rowIdx) => (
                                                <tr key={rowIdx} className="border-t border-gray-700/50 hover:bg-gray-700/20">
                                                    {row.map((cell, cellIdx) => (
                                                        <td key={cellIdx} className={`px-3 py-2 ${cellIdx === 0 ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Notes */}
                                {table.notes && table.notes.length > 0 && (
                                    <div className="px-4 py-3 bg-gray-700/20 border-t border-gray-700/50">
                                        <div className="text-xs text-yellow-300/80 font-medium mb-1">📝 Important Notes:</div>
                                        <ul className="space-y-0.5">
                                            {table.notes.map((note, idx) => (
                                                <li key={idx} className="text-xs text-gray-400">• {note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    // Element detail panel - only shows clicked/selected element, ignores hover
    const ElementDetailPanel = () => {
        // Only show detail panel for clicked elements, not hovered
        const element = selectedElement;
        if (!element) return null;

        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700"
            >
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <div className="flex items-center gap-2">
                            <span
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: CATEGORY_COLORS[element.category as CategoryType] }}
                            />
                            <span className="text-xs text-gray-400">{element.category}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                            {element.symbol} <span className="text-lg font-normal text-gray-400">({element.atomicNumber})</span>
                        </h2>
                        <p className="text-gray-300">{element.name}</p>
                    </div>
                    {selectedElement && (
                        <button
                            onClick={() => setSelectedElement(null)}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Exception badge */}
                {element.isException && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 text-yellow-400 font-medium mb-1">
                            <AlertTriangle size={16} />
                            Exception: {element.exceptionType}
                        </div>
                        <p className="text-sm text-yellow-200/80">{element.exceptionExplanation}</p>
                    </div>
                )}

                {/* Properties grid */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-700/50 rounded-lg p-2">
                        <div className="text-gray-400 text-xs">Atomic Mass</div>
                        <div className="text-white font-medium">{element.atomicMass} u</div>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-2">
                        <div className="text-gray-400 text-xs">Electron Config</div>
                        <div className="text-white font-medium text-xs">{element.electronConfig}</div>
                    </div>
                    {element.atomicRadius && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Atomic Radius</div>
                            <div className="text-white font-medium">{element.atomicRadius} pm</div>
                        </div>
                    )}
                    {element.ionizationEnergy && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Ionization Energy</div>
                            <div className="text-white font-medium">{element.ionizationEnergy} kJ/mol</div>
                        </div>
                    )}
                    {element.electronegativity && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Electronegativity</div>
                            <div className="text-white font-medium">{element.electronegativity}</div>
                        </div>
                    )}
                    {element.electronAffinity !== undefined && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Electron Affinity</div>
                            <div className="text-white font-medium">{element.electronAffinity} kJ/mol</div>
                        </div>
                    )}
                    {element.density && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Density</div>
                            <div className="text-white font-medium">{element.density} g/cm³</div>
                        </div>
                    )}
                    {element.meltingPoint && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Melting Point</div>
                            <div className="text-white font-medium">{element.meltingPoint} K</div>
                        </div>
                    )}
                    {element.boilingPoint && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">Boiling Point</div>
                            <div className="text-white font-medium">{element.boilingPoint} K</div>
                        </div>
                    )}
                    {element.standardReductionPotential !== undefined && (
                        <div className="bg-gray-700/50 rounded-lg p-2">
                            <div className="text-gray-400 text-xs">SRP (E°)</div>
                            <div className="text-white font-medium">{element.standardReductionPotential} V</div>
                        </div>
                    )}
                </div>

                {/* Flame Color, Gas Color, Compounds Info - Special Properties */}
                {(element.flameColor || element.gasColor || element.compoundsInfo) && (
                    <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <h3 className="text-yellow-300 font-semibold text-base mb-3 flex items-center gap-2">
                            🔥 Colors & Compounds
                        </h3>

                        {/* Flame Color */}
                        {element.flameColor && (
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-sm text-yellow-200/80">Flame Color:</span>
                                <span
                                    className="w-5 h-5 rounded-full border-2 border-white/40"
                                    style={{
                                        backgroundColor: element.flameColor.hexColor,
                                        boxShadow: `0 0 10px ${element.flameColor.hexColor}`
                                    }}
                                />
                                <span className="text-yellow-100 text-base font-medium">{element.flameColor.color}</span>
                            </div>
                        )}

                        {/* Gas Color */}
                        {element.gasColor && (
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-sm text-yellow-200/80">Gas ({element.gasColor.formula}):</span>
                                <span
                                    className="w-5 h-5 rounded-full border-2 border-white/40"
                                    style={{
                                        backgroundColor: element.gasColor.hexColor === 'transparent' ? 'rgba(255,255,255,0.15)' : element.gasColor.hexColor,
                                        boxShadow: element.gasColor.hexColor !== 'transparent' ? `0 0 8px ${element.gasColor.hexColor}` : 'none'
                                    }}
                                />
                                <span className="text-yellow-100 text-base">{element.gasColor.color}</span>
                            </div>
                        )}

                        {/* Compounds Info - Simple list, no nested boxes */}
                        {element.compoundsInfo && element.compoundsInfo.length > 0 && (
                            <div className="mt-3">
                                <div className="text-sm text-yellow-200/80 mb-2">Compounds:</div>
                                <div className="space-y-1.5">
                                    {element.compoundsInfo.map((compound, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                            <span className={`font-medium ${compound.nature === 'acidic' ? 'text-red-300' :
                                                compound.nature === 'basic' ? 'text-blue-300' :
                                                    'text-gray-300'
                                                }`}>
                                                {compound.formula}
                                            </span>
                                            <span className="text-gray-400">→</span>
                                            <span className="text-white">{compound.color}</span>
                                            {compound.nature && (
                                                <span className={`text-xs ${compound.nature === 'acidic' ? 'text-red-400' :
                                                    compound.nature === 'basic' ? 'text-blue-400' :
                                                        'text-gray-400'
                                                    }`}>
                                                    ({compound.nature})
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {element.block === 'f' && (
                    <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <h3 className="text-purple-300 font-semibold text-sm mb-2 flex items-center gap-2">
                            📚 NCERT Exam Focus
                        </h3>

                        {/* Ion Configurations */}
                        {element.ionConfigs && (
                            <div className="mb-3">
                                <div className="text-xs text-purple-200/70 mb-1">Ion Configurations:</div>
                                <div className="flex flex-wrap gap-2">
                                    {element.ionConfigs.M2plus && (
                                        <span className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-200">
                                            M²⁺: {element.ionConfigs.M2plus}
                                        </span>
                                    )}
                                    {element.ionConfigs.M3plus && (
                                        <span className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-200">
                                            M³⁺: {element.ionConfigs.M3plus}
                                        </span>
                                    )}
                                    {element.ionConfigs.M4plus && (
                                        <span className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-200">
                                            M⁴⁺: {element.ionConfigs.M4plus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Ionic Radii */}
                        {element.ionicRadii && (
                            <div className="mb-3">
                                <div className="text-xs text-purple-200/70 mb-1">Ionic Radii:</div>
                                <div className="flex flex-wrap gap-2">
                                    {element.ionicRadii.M3plus && (
                                        <span className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-200">
                                            M³⁺: {element.ionicRadii.M3plus} pm
                                        </span>
                                    )}
                                    {element.ionicRadii.M4plus && (
                                        <span className="bg-purple-500/20 px-2 py-1 rounded text-xs text-purple-200">
                                            M⁴⁺: {element.ionicRadii.M4plus} pm
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Oxidation States */}
                        {element.oxidationStates && (
                            <div className="mb-3">
                                <div className="text-xs text-purple-200/70 mb-1">Oxidation States:</div>
                                <div className="flex flex-wrap gap-1 items-center">
                                    {element.oxidationStates.map(os => (
                                        <span
                                            key={os}
                                            className={`px-2 py-0.5 rounded text-xs ${os === element.stableOxidationState
                                                ? 'bg-green-500/30 text-green-200 font-bold'
                                                : 'bg-purple-500/20 text-purple-200'
                                                }`}
                                        >
                                            +{os}{os === element.stableOxidationState && ' ✓'}
                                        </span>
                                    ))}
                                    <span className="text-xs text-gray-400 ml-1">(stable: +{element.stableOxidationState})</span>
                                </div>
                            </div>
                        )}

                        {/* f-Subshell Info */}
                        {element.fSubshellInfo && (
                            <div className="mb-3">
                                <div className="text-xs text-purple-200/70 mb-1">f-Subshell:</div>
                                <div className="text-sm text-purple-100">{element.fSubshellInfo}</div>
                            </div>
                        )}

                        {/* Redox Nature */}
                        {element.redoxNature && (
                            <div className="mb-1">
                                <div className="text-xs text-purple-200/70 mb-1">Redox Behavior:</div>
                                <div className={`inline-flex items-center gap-2 px-2 py-1 rounded text-sm font-medium ${element.redoxNature === 'oxidizing'
                                    ? 'bg-red-500/20 text-red-200'
                                    : element.redoxNature === 'reducing'
                                        ? 'bg-blue-500/20 text-blue-200'
                                        : 'bg-gray-500/20 text-gray-200'
                                    }`}>
                                    {element.redoxNature === 'oxidizing' && '⬇️ Oxidizing Agent'}
                                    {element.redoxNature === 'reducing' && '⬆️ Reducing Agent'}
                                    {element.redoxNature === 'both' && '↕️ Both'}
                                </div>
                                {element.redoxExplanation && (
                                    <div className="text-xs text-purple-200/60 mt-1">{element.redoxExplanation}</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* D-Block Specific Section - Ion Colors, Oxides, Halides */}
                {element.block === 'd' && (element.ionColors || element.oxides || element.halides) && (
                    <div className="mt-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                        <h3 className="text-cyan-300 font-semibold text-sm mb-2 flex items-center gap-2">
                            🧪 Transition Metal Chemistry
                        </h3>

                        {/* Ion Colors */}
                        {element.ionColors && element.ionColors.length > 0 && (
                            <div className="mb-3">
                                <div className="text-xs text-cyan-200/70 mb-1">Aquated Ion Colors:</div>
                                <div className="flex flex-wrap gap-2">
                                    {element.ionColors.map((ic, idx) => (
                                        <span
                                            key={idx}
                                            className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded text-xs"
                                        >
                                            <span
                                                className="w-3 h-3 rounded-full border border-white/30"
                                                style={{
                                                    backgroundColor: ic.hexColor === 'transparent' ? 'rgba(255,255,255,0.1)' : ic.hexColor,
                                                    boxShadow: ic.hexColor !== 'transparent' ? `0 0 4px ${ic.hexColor}` : 'none'
                                                }}
                                            />
                                            <span className="text-cyan-200">{ic.ion}</span>
                                            <span className="text-gray-400">({ic.config})</span>
                                            <span className="text-gray-300">→ {ic.color}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Oxides Formed */}
                        {element.oxides && element.oxides.length > 0 && (
                            <div className="mb-3">
                                <div className="text-xs text-cyan-200/70 mb-1">Oxides Formed:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {element.oxides.map((ox, idx) => (
                                        <span key={idx} className="bg-orange-500/20 text-orange-200 px-2 py-0.5 rounded text-xs">
                                            {ox}
                                        </span>
                                    ))}
                                </div>
                                {element.oxideNature && (
                                    <div className="mt-1.5 flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${element.oxideNature === 'acidic' ? 'bg-red-500/20 text-red-200' :
                                            element.oxideNature === 'basic' ? 'bg-blue-500/20 text-blue-200' :
                                                element.oxideNature === 'amphoteric' ? 'bg-purple-500/20 text-purple-200' :
                                                    'bg-gray-500/20 text-gray-200'
                                            }`}>
                                            {element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1)} Oxide
                                        </span>
                                    </div>
                                )}
                                {element.oxideNatureDetails && (
                                    <div className="text-xs text-cyan-200/60 mt-1">{element.oxideNatureDetails}</div>
                                )}
                            </div>
                        )}

                        {/* Halides Formed */}
                        {element.halides && element.halides.length > 0 && (
                            <div className="mb-1">
                                <div className="text-xs text-cyan-200/70 mb-1">Halides Formed:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {element.halides.map((hal, idx) => (
                                        <span key={idx} className="bg-green-500/20 text-green-200 px-2 py-0.5 rounded text-xs">
                                            {hal}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">X = F, Cl, Br, I</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Compare button */}
                <button
                    onClick={() => toggleCompare(element)}
                    className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${compareElements.some(e => e.atomicNumber === element.atomicNumber)
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    {compareElements.some(e => e.atomicNumber === element.atomicNumber)
                        ? '✓ Comparing'
                        : 'Add to Compare'}
                </button>
            </motion.div>
        );
    };

    // Comparison panel
    const ComparisonPanel = () => {
        if (compareElements.length < 2) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700 mt-4"
            >
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 size={20} />
                        Comparing {compareElements.length} Elements
                    </h3>
                    <button
                        onClick={() => setCompareElements([])}
                        className="text-gray-400 hover:text-white text-sm"
                    >
                        Clear All
                    </button>
                </div>

                {/* Comparison table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left text-gray-400 py-2 px-2">Property</th>
                                {compareElements.map(el => (
                                    <th key={el.atomicNumber} className="text-center text-white py-2 px-2">
                                        {el.symbol}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PROPERTIES.slice(0, 6).map(prop => (
                                <tr key={prop} className="border-b border-gray-700/50">
                                    <td className="text-gray-400 py-2 px-2">{PROPERTY_INFO[prop].name}</td>
                                    {compareElements.map(el => {
                                        const val = getPropertyValue(el, prop);
                                        return (
                                            <td key={el.atomicNumber} className="text-center text-white py-2 px-2">
                                                {val !== undefined ? val : '-'}
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

    // Category legend
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

    // Property heatmap legend
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white pt-28">
            {/* Header */}
            <div className="container mx-auto px-4 py-6">
                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Interactive Periodic Table
                    </h1>
                    <p className="text-gray-400 mt-2">
                        Explore trends, compare properties, and discover exceptions. <span className="text-blue-400 font-medium">Trained on NCERT data and a must for JEE, NEET & CBSE exams.</span>
                    </p>
                </div>

                {/* Mode selector */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
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

                        {/* Property dropdown */}
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
                    <div className="text-center mb-4">
                        <span className="text-lg font-semibold text-blue-400">
                            {PROPERTY_INFO[selectedProperty]?.name}
                        </span>
                        <span className="text-gray-500 ml-2">
                            ({PROPERTY_INFO[selectedProperty]?.unit})
                        </span>
                    </div>
                )}

                {/* Main grid layout */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Periodic table grid */}
                    <div className="flex-1 overflow-x-auto pb-4">
                        {/* Block selector buttons */}
                        <div className="flex flex-wrap gap-2 mb-3 justify-center">
                            <button
                                onClick={() => setSelectedBlock('s')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/40 rounded-lg text-red-300 text-sm transition-colors"
                            >
                                <BookOpen size={14} />
                                <span>s-Block Tables</span>
                            </button>
                            <button
                                onClick={() => setSelectedBlock('p')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/40 border border-green-500/40 rounded-lg text-green-300 text-sm transition-colors"
                            >
                                <BookOpen size={14} />
                                <span>p-Block Tables</span>
                            </button>
                            <button
                                onClick={() => setSelectedBlock('d')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/40 rounded-lg text-blue-300 text-sm transition-colors"
                            >
                                <BookOpen size={14} />
                                <span>d-Block Tables</span>
                            </button>
                            <button
                                onClick={() => setSelectedBlock('f')}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/40 rounded-lg text-purple-300 text-sm transition-colors"
                            >
                                <BookOpen size={14} />
                                <span>f-Block Tables</span>
                            </button>
                        </div>
                        <div
                            className="grid gap-0.5 sm:gap-1 min-w-[700px]"
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
                            <div
                                className="text-[10px] text-gray-500 flex items-center justify-center"
                                style={{ gridColumn: 3, gridRow: 6 }}
                            >
                                57-71
                            </div>
                            <div
                                className="text-[10px] text-gray-500 flex items-center justify-center"
                                style={{ gridColumn: 3, gridRow: 7 }}
                            >
                                89-103
                            </div>

                            {/* Render all elements */}
                            {ELEMENTS.map(element => (
                                <ElementCell key={element.atomicNumber} element={element} />
                            ))}

                            {/* Lanthanide label */}
                            <div
                                className="text-xs text-pink-400 flex items-center"
                                style={{ gridColumn: 1, gridRow: 8 }}
                            >
                                Lanthanides
                            </div>

                            {/* Actinide label */}
                            <div
                                className="text-xs text-purple-400 flex items-center"
                                style={{ gridColumn: 1, gridRow: 9 }}
                            >
                                Actinides
                            </div>
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

                    {/* Detail panel */}
                    <div className="lg:w-80">
                        <AnimatePresence mode="wait">
                            {selectedElement && (
                                <ElementDetailPanel key={`selected-${selectedElement.atomicNumber}`} />
                            )}
                        </AnimatePresence>

                        {/* Instructions when no element selected */}
                        {!hoveredElement && !selectedElement && (
                            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                <div className="flex items-center gap-2 text-gray-400 mb-3">
                                    <Info size={20} />
                                    <span className="font-medium">How to Use</span>
                                </div>
                                <ul className="text-sm text-gray-500 space-y-2">
                                    <li>• <strong>Hover</strong> over elements to see details</li>
                                    <li>• <strong>Click</strong> to pin an element</li>
                                    <li>• <strong>Double-click</strong> to compare (up to 4)</li>
                                    <li>• Use <strong>Trends</strong> to see property heatmaps</li>
                                    <li>• <strong>Exceptions</strong> mode shows chemistry exceptions</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Comparison panel */}
                <ComparisonPanel />

                {/* Memory Practice Quiz Section */}
                <div className="mt-8">
                    <PeriodicTableQuiz />
                </div>

                {/* Exception list when in exceptions mode */}
                {viewMode === 'exceptions' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-6 bg-gray-800/50 rounded-xl p-5 border border-gray-700"
                    >
                        <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center gap-2">
                            <Sparkles size={20} />
                            Chemistry Exceptions to Remember
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {exceptionElements.map(el => (
                                <button
                                    key={el.atomicNumber}
                                    onClick={() => setSelectedElement(el)}
                                    className="bg-gray-700/50 hover:bg-gray-700 rounded-lg p-3 text-left transition-colors"
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl font-bold text-white">{el.symbol}</span>
                                        <span className="text-sm text-gray-400">{el.name}</span>
                                    </div>
                                    <div className="text-xs text-yellow-400">{el.exceptionType}</div>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{el.exceptionExplanation}</p>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Block Info Modal */}
                <AnimatePresence>
                    {selectedBlock && <BlockInfoModal />}
                </AnimatePresence>
            </div>
        </div>
    );
}
