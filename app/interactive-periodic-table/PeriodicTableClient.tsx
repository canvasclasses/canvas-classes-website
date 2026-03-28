'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
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
    Layers,
    ChevronLeft,
    ChevronRight,
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
import OxidesReferenceSection from './OxidesReferenceSection';
import PeriodicTableMCQQuiz from './PeriodicTableMCQQuiz';

type ViewMode = 'category' | 'property' | 'exceptions';

const PROPERTIES = Object.keys(PROPERTY_INFO);

const BLOCK_INFO = {
    s: {
        name: 's-Block Elements',
        description: 'Groups 1 & 2: Alkali and Alkaline Earth Metals',
        sections: [
            {
                title: 'General Configuration',
                points: [
                    'Valence electrons in s-orbital: ns¹ (Group 1) or ns² (Group 2)',
                    'Form the bridge between noble gases and p-block elements',
                    'Largest atomic radii in their respective periods'
                ]
            },
            {
                title: 'Key Properties & Trends',
                points: [
                    'Highly reactive metals — reactivity increases down the group',
                    'Low ionization energies and electronegativities (lowest in periods)',
                    'Strong reducing agents (readily lose valence electrons)',
                    'Soft metals with low melting points (except Be, Mg)',
                    'Good conductors of heat and electricity',
                    'Form predominantly ionic compounds with high lattice energies'
                ]
            },
            {
                title: 'Chemical Behavior',
                points: [
                    'Show fixed oxidation states: +1 (Group 1) or +2 (Group 2)',
                    'Form basic oxides and hydroxides (except BeO, which is amphoteric)',
                    'React vigorously with water (Li reacts slowly, Na/K violently)',
                    'Characteristic flame colors: Li (crimson), Na (yellow), K (violet), Ca (brick red), Sr (crimson), Ba (apple green)'
                ]
            },
            {
                title: 'Anomalous Behavior of First Elements',
                points: [
                    'Li and Be show diagonal relationships with Mg and Al respectively',
                    'Smaller size and higher charge density lead to covalent character',
                    'Be forms covalent compounds (e.g., BeCl₂) unlike other Group 2 elements'
                ]
            }
        ],
        color: '#3b82f6'
    },
    p: {
        name: 'p-Block Elements',
        description: 'Groups 13–18: From Boron to Noble Gases',
        sections: [
            {
                title: 'What Makes p-Block Special?',
                points: [
                    'Valence config: ns² followed by np¹ to np⁶ — six groups of diverse chemistry!',
                    'The only block with all three types: metals (Al, Ga), metalloids (Si, Ge, As), and non-metals (C, N, O, halogens)',
                    'Home to the most electronegative element Fluorine (F) and the inert Noble Gases',
                    'Key exam tip: p-block questions dominate JEE Inorganic — focus on trends, not rote memorization!'
                ]
            },
            {
                title: 'Why First Members Behave Differently (B, C, N, O, F)',
                points: [
                    'Small size + high electronegativity + NO vacant d-orbitals = unique behavior',
                    'Maximum covalency is 4 (not 6!): BF₆³⁻ does not exist, but SF₆ and PF₆⁻ do (they have 3d orbitals)',
                    'pπ-pπ bonding: First members form strong multiple bonds (C≡C, N≡N, O=O). Heavier elements cannot due to larger size — they form dπ-pπ or single bonds instead',
                    'Remember: BF₃ is electron-deficient (acts as Lewis acid), but AlF₆³⁻ is stable!'
                ]
            },
            {
                title: 'Must-Know Trends for JEE/NEET',
                points: [
                    'Inert Pair Effect: As you go down Groups 13-15, the lower oxidation state becomes MORE stable. Tl⁺ is more stable than Tl³⁺, Pb²⁺ more than Pb⁴⁺ — blame poor shielding by d and f electrons!',
                    'Group 15 Hydrides (NH₃ to BiH₃): Bond strength decreases down the group → thermal stability drops, basicity drops, but reducing power INCREASES (BiH₃ is the strongest reducing agent)',
                    'Electron Gain Enthalpy Anomaly: O and F have LESS negative EGE than S and Cl! Why? Compact 2p orbitals have high inter-electronic repulsion — adding an electron is harder than in larger 3p orbitals',
                    'F₂ is the strongest oxidizer despite lower EGE: Very weak F-F bond (high repulsion in small atoms) + very high hydration energy of F⁻ ion make fluorine unbeatable!'
                ]
            },
            {
                title: 'Group 13 & 14: Boron to Lead',
                points: [
                    'Boron is a metalloid, rest are metals. Al shows amphoteric nature — reacts with both acids and bases!',
                    'Borax bead test: Borax forms colored beads with metal oxides — classic qualitative analysis trick',
                    'Carbon catenation: Forms longest chains (C-C bond is very strong). Silicon cannot catenate well (Si-Si is weaker)',
                    'Pb²⁺ more stable than Pb⁴⁺ due to inert pair effect — but PbO₂ is still a strong oxidizing agent!',
                    'CO vs CO₂: CO is neutral oxide, CO₂ is acidic. NO and NO₂ are also tricky — remember their nature!'
                ]
            },
            {
                title: 'Group 15: Nitrogen Family Essentials',
                points: [
                    'N₂ is inert due to strong triple bond (N≡N: 941 kJ/mol). Needs Haber process (Fe catalyst, 400°C, 200 atm) to make ammonia!',
                    'HNO₃ (Nitric acid): Strong oxidizer. Passivates Fe and Al (forms protective oxide layer) — can be stored in Al containers!',
                    'PH₃ (Phosphine): Prepared from white P + NaOH. Smells like rotten fish, highly poisonous, used in Holme\'s signal',
                    'PCl₃ hydrolyzes to H₃PO₃ + 3HCl, PCl₅ gives POCl₃ + 2HCl (partial) or H₃PO₄ + 5HCl (complete)',
                    'Allotropes of phosphorus: White (toxic, P₄ tetrahedron), Red (stable, used in safety matches), Black (graphite-like)'
                ]
            },
            {
                title: 'Group 16: Oxygen to Polonium',
                points: [
                    'Ozone (O₃): Bent shape, diamagnetic, powerful oxidizer. Decomposes to O₂ — used for water purification',
                    'Sulphuric acid (H₂SO₄): King of chemicals. Contact process: 2SO₂ + O₂ → 2SO₃ (V₂O₅ catalyst, 450°C)',
                    'Oleum (H₂S₂O₇) is intermediate — SO₃ dissolved in H₂SO₄. Dilute carefully: always acid to water!',
                    'Sodium thiosulphate (Na₂S₂O₃): Fixes photography, removes chlorine, gives white precipitate with Ag⁺ that dissolves in excess',
                    'H₂S is toxic with rotten egg smell — great reducing agent, precipitates metal sulphides in qualitative analysis'
                ]
            },
            {
                title: 'Group 17: Halogens — The Salt Makers',
                points: [
                    'Trend: Atomic radius ↑, ionization energy ↓, electronegativity ↓, oxidizing power ↓ as you go down',
                    'Cl₂ water: Acts as oxidizing AND bleaching agent. Bleaches via oxidation (permanent), not reduction',
                    'Iodine test: I₂ + starch → blue-black complex. I⁻ does NOT give this test!',
                    'Interhalogen compounds: XX\' type (ClF, BrF), XX\'₃ type (ClF₃, BrF₃), XX\'₅ type (BrF₅, IF₅), XX\'₇ type (IF₇)',
                    'Pseudohalogens: (CN)₂, (OCN)₂, (SCN)₂ — resemble halogens in properties and reactions'
                ]
            },
            {
                title: 'Noble Gases: Not So Inert Anymore!',
                points: [
                    'Xe can form compounds! Its first ionization energy (1170 kJ/mol) is almost equal to O₂ (1175 kJ/mol)',
                    'Neil Bartlett\'s breakthrough: Made Xe⁺[PtF₆]⁻ by analogy with O₂⁺[PtF₆]⁻ — proved noble gases can react!',
                    'XeF₂ (linear), XeF₄ (square planar), XeF₆ (distorted octahedral) — prepared by direct combination at high temp/pressure',
                    'Uses: He for balloons (non-flammable, though H₂ gives better lift), Ne in discharge tubes, Ar in welding shield, Kr in high-end bulbs, Rn in cancer therapy'
                ]
            }
        ],
        color: '#10b981'
    },
    d: {
        name: 'd-Block Elements',
        description: 'Transition Metals (3d, 4d, 5d series)',
        sections: [
            {
                title: 'General Configuration',
                points: [
                    'Configuration: (n–1)d¹⁻¹⁰ns¹⁻² — form bridge between s- and p-blocks',
                    'Zn, Cd, Hg excluded: Possess completely filled d¹⁰ configurations in ground and common oxidation states',
                    'Characteristic metallic properties: high density, hardness, melting/boiling points'
                ]
            },
            {
                title: 'Important Properties & Trends',
                points: [
                    'Enthalpies of Atomization: Very high, peaking near middle of series (d⁵ configurations like Cr, Mo, W) due to maximum unpaired electrons → strong metallic bonding. Mn is anomalous (lower MP)',
                    'Atomic Radii & Lanthanoid Contraction: Radii decrease initially, remain constant mid-series, rise slightly at end. Crucially, 5d series radii ≈ 4d series (e.g., Zr = 160 pm, Hf = 159 pm) due to poor shielding by 14 intervening 4f electrons',
                    'Colored Compounds: Form colored ions/complexes due to d-d electronic transitions (except d⁰ like Sc³⁺, Ti⁴⁺ and d¹⁰ like Zn²⁺, Cu⁺)',
                    'Paramagnetic: Possess unpaired d-electrons (except d⁰ and d¹⁰ configurations)',
                    'Metallic Structures: With the exception of Zn, Cd, Hg and Mn, they have one or more typical metallic structures at normal temperature',
                    'Hardness & Melting/Boiling Points: Transition metals (except Zn, Cd & Hg) are very hard and have high m.p. & b.p.',
                    'Density: Density ↑ up to Cu and then ↓ for Zn'
                ]
            },
            {
                title: 'Oxidation States',
                points: [
                    'Variable Oxidation States: Differ by units of one (V²⁺, V³⁺, V⁴⁺, V⁵⁺). Highest state = +7 (Mn in Mn₂O₇)',
                    'Stabilization: Higher states stabilized by F and O (can form multiple bonds). Lower states (like zero) stabilized by π-acceptor ligands (CO in Ni(CO)₄)',
                    'Oxygen vs Fluorine: O superior at stabilizing highest states (Mn forms Mn₂O₇ but only MnF₄) due to multiple bonding capability',
                    'Cr(+6) in dichromate: In the form of dichromate in acidic medium is a strong oxidizing agent, but MoO₃ and WO₃ are not (higher O.S. become more stable down the group)'
                ]
            },
            {
                title: 'Standard Electrode Potentials (E°)',
                points: [
                    'General trend: Decreasing tendency to form M²⁺ across 3d series',
                    'Copper Anomaly: Only 3d metal with positive E° (+0.34V) → cannot liberate H₂ from acids. High energy for Cu(s) → Cu²⁺(aq) atomization + ionization not balanced by hydration enthalpy. Cu²⁺ is more stable than Cu⁺ because the high energy for Cu(s) → Cu²⁺ atomization + ionization is not balanced by hydration enthalpy',
                    'Catalytic Activity: Fe, Ni, Pt, V₂O₅ are excellent catalysts due to variable oxidation states and ability to form reaction intermediates. Transition metals show catalytic activity because: (1) can have multiple oxidation states, (2) can form complexes',
                    'Fe³⁺ catalyzes the reaction between I⁻ and S₂O₈²⁻ ions: 2Fe³⁺ + 2I⁻ → 2Fe²⁺ + I₂ (oxidizing agent), then 2Fe²⁺ + S₂O₈²⁻ → 2Fe³⁺ + 2SO₄²⁻. Net reaction: 2I⁻ + S₂O₈²⁻ → I₂ + 2SO₄²⁻'
                ]
            },
            {
                title: 'Interstitial Compounds',
                points: [
                    'Interstitial compounds: Higher m.p. than pure metals, very hard, conducting, chemically inert'
                ]
            },
            {
                title: 'Oxides',
                points: [
                    'Mn₂O₇ is covalent green oil',
                    'V₂O₅ is amphoteric though mainly acidic. V₂O₃ is basic. V₂O₄ is mildly basic',
                    'CrO is basic. Cr₂O₃ is amphoteric. CrO₃ is acidic',
                    'MnO is more basic. Mn₂O₃ is basic. MnO₂ is neutral. MnO₃ is acidic. Mn₂O₇ is more acidic'
                ]
            }
        ],
        color: '#f59e0b'
    },
    f: {
        name: 'f-Block Elements',
        description: 'Inner Transition Metals: Lanthanoids (4f) and Actinoids (5f)',
        sections: [
            {
                title: 'General Configuration',
                points: [
                    'Electrons filling deep within atomic core: (n–2)f¹⁻¹⁴(n–1)d⁰⁻¹ns²',
                    'Lanthanoids (Z = 58–71): 4f series, Ce to Lu',
                    'Actinoids (Z = 90–103): 5f series, Th to Lr — all radioactive'
                ]
            },
            {
                title: 'Lanthanoids (4f series)',
                points: [
                    'Oxidation States: +3 most stable and common. Anomalous +2 and +4 states occur only when leading to extra-stable f⁰, f⁷, or f¹⁴ configurations',
                    'Example: Ce⁴⁺ (f⁰) is excellent analytical oxidizing agent, slowly reverting to +3. Eu²⁺ (f⁷) and Yb²⁺ (f¹⁴) are strong reducing agents',
                    'Lanthanoid Contraction: Gradual decrease in ionic radii across series due to imperfect shielding by 4f electrons',
                    'Colored Ions: Form colored M³⁺ ions (except La³⁺ with f⁰ and Lu³⁺ with f¹⁴ — both colorless)',
                    'Paramagnetic: Due to unpaired 4f electrons'
                ]
            },
            {
                title: 'Actinoids (5f series)',
                points: [
                    'Chemistry & Reactivity: Much more complex than lanthanoids — exhibit wider range of oxidation states because 5f, 6d, and 7s energy levels are comparable',
                    'Bonding Participation: 5f orbitals not as deeply buried as 4f → 5f electrons participate in bonding to far greater extent than 4f electrons',
                    'Actinoid Contraction: Similar to lanthanoid contraction but greater from element to element due to poorer shielding by 5f electrons vs 4f',
                    'All Radioactive: Used in nuclear reactors, weapons, and research',
                    'Higher Oxidation States: Show +4, +5, +6, +7 states more commonly than lanthanoids (e.g., U⁶⁺, Np⁷⁺)'
                ]
            },
            {
                title: 'Applications',
                points: [
                    'Lanthanoids: Powerful permanent magnets (Nd, Sm), phosphors in LEDs/displays, catalysts, glass additives',
                    'Actinoids: Nuclear fuel (U, Pu), medical isotopes, smoke detectors (Am), research'
                ]
            }
        ],
        color: '#8b5cf6'
    }
};

export default function PeriodicTableClient() {
    const [viewMode, setViewMode] = useState<ViewMode>('category');
    const [selectedProperty, setSelectedProperty] = useState('electronegativity');
    const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
    const [selectedElement, setSelectedElement] = useState<Element | null>(null);
    const [compareElements, setCompareElements] = useState<Element[]>([]);
    const [showPropertyDropdown, setShowPropertyDropdown] = useState(false);
    const [showBlockInfo, setShowBlockInfo] = useState<'s' | 'p' | 'd' | 'f' | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Keyboard shortcuts for block info modal
    useEffect(() => {
        if (!showBlockInfo) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowBlockInfo(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showBlockInfo]);

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
                {/* Rich data indicator - yellow pulsating dot */}
                {(element.hasRichData || element.isException) && viewMode !== 'exceptions' && (
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

    // Block Information Modal - Enhanced with swipeable carousel
    const BlockInfoModal = ({ block }: { block: 's' | 'p' | 'd' | 'f' }) => {
        const info = BLOCK_INFO[block];
        const [slideIndex, setSlideIndex] = useState(0);

        // Keyboard navigation for slides
        useEffect(() => {
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextSlide();
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }, [slideIndex]);

        // Custom touch handling for mobile swipe (without interfering with pinch-to-zoom)
        const carouselRef = useRef<HTMLDivElement>(null);
        const touchStartX = useRef(0);
        const touchStartY = useRef(0);
        const touchStartTime = useRef(0);
        const isPinching = useRef(false);

        const handleTouchStart = (e: React.TouchEvent) => {
            if (e.touches.length === 2) {
                // Two fingers = pinch gesture, don't interfere
                isPinching.current = true;
                return;
            }
            if (e.touches.length === 1) {
                isPinching.current = false;
                touchStartX.current = e.touches[0].clientX;
                touchStartY.current = e.touches[0].clientY;
                touchStartTime.current = Date.now();
            }
        };

        const handleTouchMove = (e: React.TouchEvent) => {
            if (isPinching.current || e.touches.length !== 1) {
                return; // Allow default pinch-to-zoom behavior
            }
            // Prevent default only for horizontal swipes
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = Math.abs(touchX - touchStartX.current);
            const deltaY = Math.abs(touchY - touchStartY.current);
            
            // Only prevent if it's clearly a horizontal swipe
            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        };

        const handleTouchEnd = (e: React.TouchEvent) => {
            if (isPinching.current) {
                isPinching.current = false;
                return;
            }
            if (e.changedTouches.length !== 1) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartX.current;
            const deltaY = touchEndY - touchStartY.current;
            const deltaTime = Date.now() - touchStartTime.current;
            
            const swipeThreshold = 50;
            const swipeTimeLimit = 300; // ms

            // Only trigger if it's a quick horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && 
                Math.abs(deltaX) > swipeThreshold && 
                deltaTime < swipeTimeLimit) {
                if (deltaX > 0 && slideIndex > 0) {
                    setSlideIndex(slideIndex - 1);
                } else if (deltaX < 0 && slideIndex < totalSlides - 1) {
                    setSlideIndex(slideIndex + 1);
                }
            }
        };
        
        // Define slides for d-block with hand-drawn images
        const dBlockSlides = [
            {
                type: 'content' as const,
                sections: info.sections
            },
            {
                type: 'image' as const,
                title: 'Dichromate Ion - Oxidizing Agent',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/K2Cr2O7.svg',
                caption: 'Cr₂O₇²⁻ in acidic medium acts as a strong oxidizing agent'
            },
            {
                type: 'image' as const,
                title: 'Permanganate Ion - KMnO₄',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/KMnO4.svg',
                caption: 'KMnO₄ oxidation reactions and color changes'
            }
        ];

        // Define slides for p-block with hand-drawn images
        const pBlockSlides = [
            {
                type: 'content' as const,
                sections: info.sections
            },
            {
                type: 'image' as const,
                title: 'Group 13 & 14 Compounds',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/1%20(1).svg',
                caption: 'Boron and aluminium compounds structures'
            },
            {
                type: 'image' as const,
                title: 'Group 15 Compounds',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/2%20(1).svg',
                caption: 'Nitrogen and phosphorus compounds'
            },
            {
                type: 'image' as const,
                title: 'Group 16 Compounds',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/3%20(1).svg',
                caption: 'Sulphur and oxygen compounds'
            },
            {
                type: 'image' as const,
                title: 'Group 17 & 18 Compounds',
                imageUrl: 'https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/svg/4%20(1).svg',
                caption: 'Halogens and noble gas compounds'
            }
        ];

        // Use slides for d-block and p-block, otherwise just content
        const slides = block === 'd' ? dBlockSlides : block === 'p' ? pBlockSlides : [{ type: 'content' as const, sections: info.sections }];
        const totalSlides = slides.length;

        const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
            const swipeThreshold = 50;
            if (info.offset.x > swipeThreshold && slideIndex > 0) {
                setSlideIndex(slideIndex - 1);
            } else if (info.offset.x < -swipeThreshold && slideIndex < totalSlides - 1) {
                setSlideIndex(slideIndex + 1);
            }
        };

        const goToSlide = (index: number) => {
            setSlideIndex(index);
        };

        const nextSlide = () => {
            if (slideIndex < totalSlides - 1) setSlideIndex(slideIndex + 1);
        };

        const prevSlide = () => {
            if (slideIndex > 0) setSlideIndex(slideIndex - 1);
        };

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto"
                onClick={() => {
                    setShowBlockInfo(null);
                    setSlideIndex(0);
                }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 rounded-2xl max-w-5xl w-full border-2 shadow-2xl my-6 max-h-[90vh] overflow-hidden relative"
                    style={{ borderColor: info.color }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header - Fixed with Navigation */}
                    <div className="flex items-start justify-between p-6 md:p-10 pb-6 border-b-2" style={{ borderColor: `${info.color}40` }}>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-3 rounded-xl" style={{ backgroundColor: `${info.color}20`, border: `2px solid ${info.color}40` }}>
                                    <Layers size={28} style={{ color: info.color }} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold" style={{ color: info.color }}>
                                    {info.name}
                                </h2>
                            </div>
                            <p className="text-gray-300 text-lg md:text-xl font-medium">{info.description}</p>
                        </div>
                        
                        {/* Navigation Controls in Header */}
                        <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                            {totalSlides > 1 && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={prevSlide}
                                        disabled={slideIndex === 0}
                                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        style={{ color: info.color }}
                                        title="Previous (←)"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span className="text-sm font-medium text-gray-400 px-2">
                                        {slideIndex + 1}/{totalSlides}
                                    </span>
                                    <button
                                        onClick={nextSlide}
                                        disabled={slideIndex === totalSlides - 1}
                                        className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        style={{ color: info.color }}
                                        title="Next (→)"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => {
                                    setShowBlockInfo(null);
                                    setSlideIndex(0);
                                }}
                                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors ml-2"
                                title="Close (ESC)"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Carousel Container with Touch Handling */}
                    <div 
                        className="relative overflow-hidden touch-pan-y"
                        ref={carouselRef}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <motion.div
                            className="flex"
                            animate={{ x: `-${slideIndex * 100}%` }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        >
                            {slides.map((slide, idx) => (
                                <div key={idx} className="w-full flex-shrink-0 p-6 md:p-10 pt-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                                    {slide.type === 'content' ? (
                                        <div className="space-y-8">
                                            {slide.sections.map((section, sIdx) => (
                                                <div key={sIdx} className="space-y-4">
                                                    <h3 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: info.color }}>
                                                        <span className="w-2 h-8 rounded-full" style={{ backgroundColor: info.color }} />
                                                        {section.title}
                                                    </h3>
                                                    <ul className="space-y-4 ml-5">
                                                        {section.points.map((point, pIdx) => (
                                                            <li key={pIdx} className="flex items-start gap-4 text-gray-200 text-base md:text-lg leading-relaxed">
                                                                <span className="mt-1.5 shrink-0 font-bold text-xl" style={{ color: info.color }}>•</span>
                                                                <span className="flex-1">{renderBlockContent(point)}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center min-h-0">
                                            <div className="relative w-full flex items-start justify-center">
                                                <img 
                                                    src={slide.imageUrl} 
                                                    alt={slide.title}
                                                    className="max-w-full h-auto object-contain"
                                                    style={{ maxHeight: 'calc(90vh - 180px)' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    </div>


                    {/* Footer */}
                    {totalSlides === 1 && (
                        <div className="px-6 md:px-10 pb-6 pt-6 border-t border-gray-700 text-center">
                            <p className="text-gray-400 text-sm md:text-base">
                                Based on NCERT Chemistry • JEE/NEET Relevant Content
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        );
    };

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

            {/* Block Information Modal */}
            <AnimatePresence>
                {showBlockInfo && <BlockInfoModal block={showBlockInfo} />}
            </AnimatePresence>

            {/* Hero Header */}
            <section className="relative pt-20 pb-6 md:pt-24 md:pb-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-gray-900 to-gray-950" />
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-40 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

                <div className="relative container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 mb-4 backdrop-blur-sm">
                        <Sparkles size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-blue-400">NCERT Data Visualizations</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Interactive Periodic Table
                        </span>
                    </h1>
                    <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto mb-6 leading-relaxed">
                        <span className="text-white font-semibold">Every periodic trend. One page.</span><br />
                        Stop hunting through NCERT. All the data, exceptions, and trends from s, p, d, and f blocks — organized, visual, and searchable.
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

                {/* Block Information Buttons */}
                <div className="flex flex-wrap justify-center gap-3 mb-4">
                    <button
                        onClick={() => setShowBlockInfo('s')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                    >
                        <Layers size={16} />
                        s-Block Info
                    </button>
                    <button
                        onClick={() => setShowBlockInfo('p')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                    >
                        <Layers size={16} />
                        p-Block Info
                    </button>
                    <button
                        onClick={() => setShowBlockInfo('d')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30"
                    >
                        <Layers size={16} />
                        d-Block Info
                    </button>
                    <button
                        onClick={() => setShowBlockInfo('f')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                    >
                        <Layers size={16} />
                        f-Block Info
                    </button>
                </div>

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

                            {/* Lanthanide/Actinide labels - now clickable */}
                            <button
                                onClick={() => setShowBlockInfo('f')}
                                className="text-xs text-pink-400 flex items-center hover:text-pink-300 transition-colors cursor-pointer"
                                style={{ gridColumn: 1, gridRow: 8 }}
                            >
                                Lanthanides*
                            </button>
                            <button
                                onClick={() => setShowBlockInfo('f')}
                                className="text-xs text-purple-400 flex items-center hover:text-purple-300 transition-colors cursor-pointer"
                                style={{ gridColumn: 1, gridRow: 9 }}
                            >
                                Actinides*
                            </button>
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

                {/* Nature of Oxides/Hydroxides Reference */}
                <OxidesReferenceSection />

                {/* Knowledge Check MCQ Quiz */}
                <div className="mt-12 mb-8">
                    <PeriodicTableMCQQuiz />
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
                <div className="bg-cyan-950/20 rounded-lg p-3 border border-cyan-500/20">
                    <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-1.5">
                        <span className="text-lg">🧪</span> Transition Metal Chemistry
                    </h3>

                    <div className="space-y-4">
                        {/* 1. Aquated Ion Colors */}
                        {element.ionColors && element.ionColors.length > 0 && (
                            <div>
                                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Aquated Ion Colors:</h4>
                                <div className="space-y-2 pl-1">
                                    {element.ionColors.map((ion, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div
                                                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                                                style={{ backgroundColor: ion.hexColor === 'transparent' ? '#1f2937' : ion.hexColor }}
                                            />
                                            <div className="flex items-baseline gap-1.5 text-gray-200">
                                                <span className="font-semibold text-base">{formatFormula(ion.ion)}</span>
                                                {ion.config && <span className="text-gray-500 font-mono text-xs">({ion.config})</span>}
                                                <span className="text-gray-500 text-sm">→</span>
                                                <span className={`text-sm ${ion.hexColor !== 'transparent' ? 'text-white' : 'text-gray-400'}`}>
                                                    {ion.color}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 2. Oxides Formed - Compact inline layout */}
                        {(element.oxides || element.oxideNature) && (
                            <div>
                                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Oxides Formed:</h4>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {element.oxides && element.oxides.map(oxide => (
                                        <span key={oxide} className="bg-orange-900/30 text-orange-200 border border-orange-700/30 px-2 py-1 rounded text-sm font-mono">
                                            {formatFormula(oxide)}
                                        </span>
                                    ))}
                                    {element.oxideNature && (
                                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getNatureColor(element.oxideNature)}`}>
                                            {element.oxideNature.charAt(0).toUpperCase() + element.oxideNature.slice(1)}
                                        </span>
                                    )}
                                </div>
                                {element.oxideNatureDetails && (
                                    <p className="text-cyan-100/70 text-sm leading-relaxed">
                                        {formatFormula(element.oxideNatureDetails)}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* 3. Halides Formed (New Section) */}
                        {element.halides && element.halides.length > 0 && (
                            <div>
                                <h4 className="text-cyan-200/70 font-medium mb-2 text-sm">Halides Formed:</h4>
                                <div className="flex flex-wrap gap-2 mb-1">
                                    {element.halides.map(halide => (
                                        <span key={halide} className="bg-green-900/30 text-green-200 border border-green-700/30 px-2 py-1 rounded text-sm font-mono">
                                            {formatFormula(halide)}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-xs italic">X = F, Cl, Br, I (unless specified)</p>
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

            {/* Flame/Gas Colors - Compact inline */}
            {(element.flameColor || element.gasColor) && (
                <div className="mb-6 md:mb-8">
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/30">
                        <Sparkles className="text-yellow-400" size={18} />
                        <h3 className="text-lg md:text-xl font-bold text-yellow-400">Physical Appearance</h3>
                    </div>
                    <div className="space-y-3 pl-1">
                        {element.flameColor && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-base min-w-[110px]">Flame Color:</span>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full border border-white/20 shadow-[0_0_10px_currentColor]"
                                        style={{ color: element.flameColor.hexColor, backgroundColor: element.flameColor.hexColor }}
                                    />
                                    <span className="text-white text-base md:text-lg">{element.flameColor.color}</span>
                                </div>
                            </div>
                        )}
                        {element.gasColor && (
                            <div className="flex items-center gap-3">
                                <span className="text-gray-400 text-base min-w-[110px]">Gas Color:</span>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-7 h-7 rounded-full border border-white/20"
                                        style={{ backgroundColor: element.gasColor.hexColor }}
                                    />
                                    <span className="text-white text-base md:text-lg">{element.gasColor.color} ({formatFormula(element.gasColor.formula)})</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Common Compounds (General) */}
            {element.compoundsInfo && element.compoundsInfo.length > 0 && (
                <div className="bg-emerald-900/10 rounded-lg p-4 border border-emerald-500/20">
                    <h3 className="text-base font-semibold text-emerald-400 mb-3">Important Compounds</h3>
                    <div className="space-y-2">
                        {element.compoundsInfo.map((comp, i) => (
                            <div key={i} className="flex items-center gap-3 py-1">
                                {comp.hexColor && (
                                    <div
                                        className="w-4 h-4 rounded-full border border-gray-600 shrink-0"
                                        style={{ backgroundColor: comp.hexColor }}
                                    />
                                )}
                                <span className="text-gray-300 font-mono text-sm">{formatFormula(comp.formula)}</span>
                                {comp.nature && (
                                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded ${comp.nature.includes('acidic') ? 'bg-red-900/40 text-red-300' :
                                        comp.nature.includes('basic') ? 'bg-blue-900/40 text-blue-300' :
                                            'bg-gray-700 text-gray-300'
                                        }`}>
                                        {comp.nature}
                                    </span>
                                )}
                                <span className="text-gray-400 text-sm">{comp.color}</span>
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
    // Split by digits but preserve context to avoid subscripting standalone numbers
    const parts = formula.split(/(\d+)/);
    return parts.map((part, index) => {
        // Only subscript if it's a digit AND preceded by a letter (chemical formula pattern)
        if (/^\d+$/.test(part) && index > 0 && /[A-Za-z]$/.test(parts[index - 1])) {
            return <sub key={index} className="text-[0.7em] align-baseline">{part}</sub>;
        }
        return <span key={index}>{part}</span>;
    });
};

// Helper to render block info content with HTML tags (sup, sub) for larger, readable superscripts/subscripts
const renderBlockContent = (content: string) => {
    // Replace HTML tags with React elements for proper styling
    const parts: React.ReactNode[] = [];
    let remaining = content;
    let key = 0;
    
    while (remaining.length > 0) {
        // Find next HTML tag
        const supMatch = remaining.match(/<sup>(.*?)<\/sup>/);
        const subMatch = remaining.match(/<sub>(.*?)<\/sub>/);
        
        // Find which tag comes first
        let firstMatch: RegExpMatchArray | null = null;
        let matchType: 'sup' | 'sub' | null = null;
        let matchIndex = Infinity;
        
        if (supMatch && supMatch.index !== undefined && supMatch.index < matchIndex) {
            firstMatch = supMatch;
            matchType = 'sup';
            matchIndex = supMatch.index;
        }
        if (subMatch && subMatch.index !== undefined && subMatch.index < matchIndex) {
            firstMatch = subMatch;
            matchType = 'sub';
            matchIndex = subMatch.index;
        }
        
        if (firstMatch && matchType) {
            // Add text before the tag
            if (matchIndex > 0) {
                parts.push(<span key={key++}>{remaining.substring(0, matchIndex)}</span>);
            }
            
            // Add the styled tag content - larger font size for readability
            const innerContent = firstMatch[1];
            if (matchType === 'sup') {
                parts.push(
                    <sup key={key++} className="text-[0.85em] font-semibold align-super">{innerContent}</sup>
                );
            } else {
                parts.push(
                    <sub key={key++} className="text-[0.85em] font-semibold align-sub">{innerContent}</sub>
                );
            }
            
            // Continue with remaining text
            remaining = remaining.substring(matchIndex + firstMatch[0].length);
        } else {
            // No more tags, add remaining text
            parts.push(<span key={key++}>{remaining}</span>);
            break;
        }
    }
    
    return parts.length > 0 ? parts : content;
};

// ZONE 4: Collapsible Data Grid Component (Clean Design)
const DataGridSection = ({ element }: { element: Element }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-700/50">
            {/* Compact Header - Always Visible */}
            <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-gray-400 text-sm mb-1.5">Ionization Energy</div>
                    <div className="text-gray-200 font-semibold text-base md:text-lg">
                        {element.ionizationEnergy ? `${element.ionizationEnergy} kJ/mol` : '-'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-gray-400 text-sm mb-1.5">Electronegativity</div>
                    <div className="text-gray-200 font-semibold text-base md:text-lg">
                        {element.electronegativity ?? '-'}
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-gray-400 text-sm mb-1.5">Atomic Radius</div>
                    <div className="text-gray-200 font-semibold text-base md:text-lg">
                        {element.atomicRadius ? `${element.atomicRadius} pm` : '-'}
                    </div>
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-2 hover:bg-gray-800/30 transition-colors flex items-center justify-center gap-2 text-gray-400 text-sm rounded"
            >
                {isExpanded ? (
                    <>
                        <ChevronDown size={14} className="rotate-180 transition-transform" />
                        Hide Additional Data
                    </>
                ) : (
                    <>
                        <ChevronDown size={14} className="transition-transform" />
                        Show More Data
                    </>
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pt-4"
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <DetailItem label="Electron Config" value={element.electronConfig} />
                        <DetailItem label="Ionic Radius" value={element.ionicRadius ? `${element.ionicRadius} pm` : '-'} />
                        <DetailItem label="Electron Affinity" value={element.electronAffinity !== undefined ? `${element.electronAffinity} kJ/mol` : '-'} />
                        <DetailItem label="Density" value={element.density ? `${element.density} g/cm³` : '-'} />
                        <DetailItem label="Melting Point" value={element.meltingPoint ? `${element.meltingPoint} K` : '-'} />
                        <DetailItem label="Boiling Point" value={element.boilingPoint ? `${element.boilingPoint} K` : '-'} />
                        <DetailItem label="Standard Potential" value={element.standardReductionPotential ? `${element.standardReductionPotential} V` : '-'} />
                    </div>
                </motion.div>
            )}
        </div>
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
                    {/* Header Colored Strip - Compact on Mobile */}
                    <div
                        className="p-3 md:p-6 relative"
                        style={{ backgroundColor: bgColor }}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <div className={`text-3xl md:text-5xl font-bold mb-0.5 md:mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {element.symbol}
                                </div>
                                <div className={`text-base md:text-xl font-medium ${isDark ? 'text-white/90' : 'text-gray-900/90'}`}>
                                    {element.name}
                                </div>
                                <div className={`text-xs md:text-sm font-medium opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {element.category}
                                </div>
                            </div>
                            <div className={`text-right ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                <div className="text-xl md:text-3xl font-bold opacity-50 leading-none">{element.atomicNumber}</div>
                                <div className="text-xs md:text-base font-medium opacity-80 mt-0.5 md:mt-1">{element.atomicMass} u</div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body - Reduced padding on mobile */}
                    <div className="p-3 md:p-6 bg-gray-900 text-white">
                        {/* Trend Position Summary - Right after header */}
                        {element.trendPosition && (
                            <div className="mb-5 pb-4 border-b border-gray-700/50">
                                <p className="text-base md:text-lg text-gray-300 leading-relaxed italic">
                                    {element.trendPosition}
                                </p>
                            </div>
                        )}

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

                        {/* ZONE 1: Anomalous Behavior (Clean Design) */}
                        {element.anomalousBehavior && (
                            <div className="mb-6 md:mb-8">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-500/30">
                                    <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                                    <h3 className="text-lg md:text-xl font-bold text-amber-400 flex-1">Anomalous Behavior</h3>
                                    <span className="text-xs md:text-sm px-2 py-0.5 bg-amber-500/20 rounded text-amber-300 font-medium">
                                        JEE {element.anomalousBehavior.jeeRelevance.toUpperCase()}
                                    </span>
                                </div>
                                <ul className="space-y-2.5 md:space-y-3 text-base md:text-lg text-gray-300 leading-relaxed">
                                    {element.anomalousBehavior.facts.map((fact, i) => (
                                        <li key={i} className="flex items-start gap-2.5 pl-1">
                                            <span className="text-amber-400 mt-0.5 shrink-0 font-bold">•</span>
                                            <span>{formatFormula(fact)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Oxidation States (Clean Design) */}
                        {element.oxidationStateCompounds && element.oxidationStateCompounds.length > 0 && (
                            <div className="mb-6 md:mb-8">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-500/30">
                                    <Zap size={18} className="text-blue-400 shrink-0" />
                                    <h3 className="text-lg md:text-xl font-bold text-blue-400">Oxidation States</h3>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {element.oxidationStateCompounds.map((oxState, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className="text-blue-300 font-bold text-xl md:text-2xl min-w-[50px]">
                                                {oxState.state > 0 ? `+${oxState.state}` : oxState.state}
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {oxState.compounds.map((compound, j) => (
                                                    <span key={j} className="bg-blue-500/10 text-blue-200 px-3 md:px-4 py-1.5 rounded text-sm md:text-base font-mono">
                                                        {formatFormula(compound)}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ZONE 2: Key Reactions (Clean Design) */}
                        {element.keyReactions && element.keyReactions.length > 0 && (
                            <div className="mb-6 md:mb-8">
                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/30">
                                    <Atom size={18} className="text-emerald-400 shrink-0" />
                                    <h3 className="text-lg md:text-xl font-bold text-emerald-400">Key Reactions</h3>
                                </div>
                                <div className="space-y-4 md:space-y-5">
                                    {element.keyReactions.map((reaction, i) => (
                                        <div key={i} className="pl-1">
                                            <div className="font-mono text-emerald-200 text-base md:text-lg mb-2 font-semibold">
                                                {formatFormula(reaction.equation)}
                                            </div>
                                            {reaction.conditions && (
                                                <div className="text-sm md:text-base text-gray-400 mb-1.5">
                                                    <span className="font-medium text-gray-300">Conditions:</span> {reaction.conditions}
                                                </div>
                                            )}
                                            {reaction.note && (
                                                <div className="text-sm md:text-base text-gray-300 leading-relaxed">
                                                    {formatFormula(reaction.note)}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ZONE 3: Special Chemistry Sections (Important Compounds, Ion Colors, etc.) */}
                        <SpecialChemistry element={element} />

                        {/* Old Exception Alert (Clean Design - backward compatibility) */}
                        {element.isException && !element.anomalousBehavior && (
                            <div className="mb-6 md:mb-8">
                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-yellow-500/30">
                                    <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
                                    <h3 className="text-lg md:text-xl font-bold text-yellow-400">Exception: {element.exceptionType}</h3>
                                </div>
                                <p className="text-base md:text-lg text-gray-300 leading-relaxed pl-1">{element.exceptionExplanation}</p>
                            </div>
                        )}

                        {/* ZONE 4: Data Grid (Collapsible, Secondary) */}
                        <DataGridSection element={element} />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

