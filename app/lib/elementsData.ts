// Periodic Table Element Data - NCERT Scope (s, p, d, f blocks)
// Properties from NCERT textbook (Class 11 & 12 Chemistry)

export interface Element {
    atomicNumber: number;
    symbol: string;
    name: string;
    atomicMass: number;
    category: string;
    block: 's' | 'p' | 'd' | 'f';
    group: number;
    period: number;
    electronConfig: string;
    // Physical Properties (placeholder values - update from NCERT)
    atomicRadius?: number; // pm
    ionicRadius?: number; // pm (for common ion)
    ionizationEnergy?: number; // kJ/mol (1st IE)
    electronegativity?: number; // Pauling scale
    electronAffinity?: number; // kJ/mol
    density?: number; // g/cm³
    meltingPoint?: number; // K
    boilingPoint?: number; // K
    standardReductionPotential?: number; // V
    // Flame test and gas colors
    flameColor?: {
        color: string;      // e.g., "Yellow/orange"
        hexColor: string;   // CSS color for display
    };
    gasColor?: {
        formula: string;    // e.g., "Cl₂"
        color: string;      // e.g., "greenish yellow"
        hexColor: string;   // CSS color for display
    };
    // Compounds info for elements that form important colored compounds
    compoundsInfo?: {
        formula: string;
        color: string;
        hexColor?: string;
        nature?: string;    // acidic/basic/neutral
    }[];
    // D-block specific properties (NCERT focus)
    ionColors?: {
        ion: string;      // e.g., "Ti³⁺"
        config: string;   // e.g., "3d¹"
        color: string;    // e.g., "purple"
        hexColor?: string; // CSS color for display
    }[];
    oxides?: string[];   // Oxides formed, e.g., ["Sc₂O₃"]
    halides?: string[];  // Halides formed, e.g., ["TiX₄", "TiX₃"]
    oxideNature?: 'acidic' | 'basic' | 'amphoteric' | 'neutral';  // Nature of common oxide
    oxideNatureDetails?: string;  // Details about oxide nature
    // F-block specific properties (NCERT focus)
    ionConfigs?: {
        M2plus?: string;  // Configuration of M²⁺
        M3plus?: string;  // Configuration of M³⁺ (common for f-block)
        M4plus?: string;  // Configuration of M⁴⁺
    };
    ionicRadii?: {
        M3plus?: number;  // Ionic radius of M³⁺ in pm
        M4plus?: number;  // Ionic radius of M⁴⁺ in pm
    };
    oxidationStates?: number[];  // Common oxidation states
    stableOxidationState?: number;  // Most stable oxidation state
    oxidationStateCompounds?: {  // Compounds for each oxidation state
        state: number;
        compounds: string[];
    }[];
    fSubshellInfo?: string;  // Half-filled, full-filled info
    redoxNature?: 'oxidizing' | 'reducing' | 'both' | 'neither';  // Redox behavior
    redoxExplanation?: string;  // Why it's oxidizing/reducing
    // Anomalous behavior (JEE-critical)
    anomalousBehavior?: {
        facts: string[];
        jeeRelevance: 'high' | 'medium' | 'low';
    };
    // Key reactions with equations
    keyReactions?: {
        equation: string;
        conditions?: string;
        note?: string;
    }[];
    // Trend position in group
    trendPosition?: string;
    // Exception data
    isException?: boolean;
    exceptionType?: string;
    exceptionExplanation?: string;
    // Rich data indicator (for yellow pulsating dot)
    hasRichData?: boolean;  // True if element has comprehensive NCERT information
    // Grid position
    row: number;
    col: number;
}

export type CategoryType =
    | 'Alkali Metal'
    | 'Alkaline Earth Metal'
    | 'Transition Metal'
    | 'Post-Transition Metal'
    | 'Metalloid'
    | 'Reactive Nonmetal'
    | 'Noble Gas'
    | 'Lanthanide'
    | 'Actinide';

export const CATEGORY_COLORS: Record<CategoryType, string> = {
    'Alkali Metal': '#ff6b6b',
    'Alkaline Earth Metal': '#ffa94d',
    'Transition Metal': '#ffd43b',
    'Post-Transition Metal': '#69db7c',
    'Metalloid': '#38d9a9',
    'Reactive Nonmetal': '#4dabf7',
    'Noble Gas': '#9775fa',
    'Lanthanide': '#f783ac',
    'Actinide': '#e599f7',
};

export const ELEMENTS: Element[] = [
    // Period 1 - NCERT values
    { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', atomicMass: 1.008, category: 'Reactive Nonmetal', block: 's', group: 1, period: 1, electronConfig: '1s¹', atomicRadius: 53, ionizationEnergy: 1312, electronegativity: 2.20, electronAffinity: -73, density: 0.00009, meltingPoint: 14, boilingPoint: 20, gasColor: { formula: 'H₂', color: 'colorless', hexColor: 'transparent' }, row: 1, col: 1 },
    { atomicNumber: 2, symbol: 'He', name: 'Helium', atomicMass: 4.00, category: 'Noble Gas', block: 's', group: 18, period: 1, electronConfig: '1s²', atomicRadius: 120, ionizationEnergy: 2372, electronAffinity: 48, density: 0.00018, meltingPoint: 4.2, boilingPoint: 4.2, row: 1, col: 18 }, // ΔegH = +48 (positive, endothermic)

    // Period 2 - NCERT values
    { 
        atomicNumber: 3, 
        symbol: 'Li', 
        name: 'Lithium', 
        atomicMass: 6.94, 
        category: 'Alkali Metal', 
        block: 's', 
        group: 1, 
        period: 2, 
        electronConfig: '[He]2s¹', 
        atomicRadius: 152, 
        ionicRadius: 76, 
        ionizationEnergy: 520, 
        electronegativity: 0.98, 
        electronAffinity: -60, 
        density: 0.53, 
        meltingPoint: 454, 
        boilingPoint: 1615, 
        standardReductionPotential: -3.04, 
        flameColor: { color: 'Red', hexColor: '#FF0066' },
        // JEE-Critical: Anomalous Behavior
        anomalousBehavior: {
            facts: [
                'Forms Li₂O (normal oxide) unlike other alkali metals which form peroxides/superoxides',
                'Diagonal relationship with Mg: similar size, polarizing power, and chemical behavior',
                'Does not form solid bicarbonate (LiHCO₃) - only Li₂CO₃ exists',
                'Stored in oil as it floats on water and reacts violently',
                'Highest hydration enthalpy in Group 1 due to smallest size',
                'Forms covalent compounds (e.g., LiCl has covalent character) unlike other alkali metals'
            ],
            jeeRelevance: 'high'
        },
        // Oxidation States
        oxidationStates: [1],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Li₂O', 'LiOH', 'LiCl', 'Li₂CO₃', 'LiNO₃', 'Li₃N'] }
        ],
        // Key Reactions
        keyReactions: [
            { 
                equation: '4Li + O₂ → 2Li₂O', 
                conditions: 'Room temperature',
                note: 'Forms normal oxide, not peroxide (unlike Na) or superoxide (unlike K, Rb, Cs)'
            },
            { 
                equation: '6Li + N₂ → 2Li₃N', 
                conditions: 'Room temperature',
                note: 'Only alkali metal that reacts with N₂ at room temperature'
            },
            { 
                equation: '2Li + 2H₂O → 2LiOH + H₂↑', 
                conditions: 'Vigorous reaction',
                note: 'Floats on water due to low density (0.53 g/cm³)'
            },
            { 
                equation: 'Li₂CO₃ → Li₂O + CO₂', 
                conditions: 'Heat',
                note: 'Least stable carbonate in Group 1 (decomposes on heating)'
            }
        ],
        // Trend Position
        trendPosition: 'Smallest alkali metal — highest IE (520 kJ/mol), highest EN (0.98), highest MP (454 K), and most negative E° (-3.04 V) in Group 1',
        row: 2, 
        col: 1 
    },
    {
        atomicNumber: 4,
        symbol: 'Be',
        name: 'Beryllium',
        atomicMass: 9.01,
        category: 'Alkaline Earth Metal',
        block: 's',
        group: 2,
        period: 2,
        electronConfig: '[He]2s²',
        atomicRadius: 112,
        ionicRadius: 31,
        ionizationEnergy: 899,
        electronegativity: 1.57,
        density: 1.84,
        meltingPoint: 1560,
        boilingPoint: 2745,
        standardReductionPotential: -1.97,
        oxides: ['BeO'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'BeO is amphoteric - dissolves in both acids and alkalis',
        // JEE-Critical: Anomalous Behavior
        anomalousBehavior: {
            facts: [
                'Does not give flame test (high ionization energy prevents electron excitation)',
                'Amphoteric oxide (BeO) - dissolves in both acids and bases, unlike other Group 2 oxides',
                'Forms covalent compounds due to high charge density (e.g., BeCl₂ is covalent)',
                'Does not react with water even at high temperature (protective oxide layer)',
                'Diagonal relationship with Al: similar size, polarizing power, amphoteric nature',
                'Does not form peroxide or superoxide - only BeO'
            ],
            jeeRelevance: 'high'
        },
        // Oxidation States
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['BeO', 'BeCl₂', 'BeSO₄', 'Be(OH)₂', 'BeF₂'] }
        ],
        // Key Reactions
        keyReactions: [
            {
                equation: 'BeO + 2HCl → BeCl₂ + H₂O',
                conditions: 'Acidic medium',
                note: 'Amphoteric oxide - dissolves in acids'
            },
            {
                equation: 'BeO + 2NaOH → Na₂BeO₂ + H₂O',
                conditions: 'Basic medium',
                note: 'Amphoteric oxide - dissolves in bases (forms beryllate)'
            },
            {
                equation: 'Be + 2HCl → BeCl₂ + H₂↑',
                conditions: 'Dilute acid',
                note: 'Reacts with acids but not with water'
            }
        ],
        // Trend Position
        trendPosition: 'Smallest alkaline earth metal — highest IE (899 kJ/mol), highest EN (1.57), highest MP (1560 K) in Group 2',
        row: 2,
        col: 2
    },
    {
        atomicNumber: 5,
        symbol: 'B',
        name: 'Boron',
        atomicMass: 10.81,
        category: 'Metalloid',
        block: 'p',
        group: 13,
        period: 2,
        electronConfig: '[He]2s²2p¹',
        atomicRadius: 85,
        ionicRadius: 27,
        ionizationEnergy: 801,
        electronegativity: 2.0,
        density: 2.35,
        meltingPoint: 2453,
        boilingPoint: 3923,
        oxides: ['B₂O₃'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'B₂O₃ is acidic oxide',
        anomalousBehavior: {
            facts: [
                'Only non-metal in Group 13 (rest are metals)',
                'Forms electron-deficient compounds (e.g., BF₃, BCl₃) - accepts electron pairs',
                'Does not form B³⁺ ion due to very high ionization energy',
                'Diagonal relationship with Si: similar EN, forms covalent compounds',
                'Forms unique boranes (B₂H₆, B₄H₁₀) with 3-center-2-electron bonds'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [3],
        oxidationStateCompounds: [
            { state: 3, compounds: ['B₂O₃', 'BF₃', 'BCl₃', 'H₃BO₃', 'Na₂B₄O₇'] }
        ],
        keyReactions: [
            {
                equation: '4B + 3O₂ → 2B₂O₃',
                conditions: 'Heat',
                note: 'Forms acidic oxide'
            },
            {
                equation: 'B₂O₃ + 3H₂O → 2H₃BO₃',
                conditions: 'Boric acid formation',
                note: 'Weak monobasic Lewis acid'
            }
        ],
        trendPosition: 'First p-block element — smallest size, highest IE in Group 13, only non-metal',
        row: 2,
        col: 13
    },
    {
        atomicNumber: 6,
        symbol: 'C',
        name: 'Carbon',
        atomicMass: 12.01,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 14,
        period: 2,
        electronConfig: '[He]2s²2p²',
        atomicRadius: 77,
        ionizationEnergy: 1086,
        electronegativity: 2.5,
        density: 3.51,
        meltingPoint: 4373,
        compoundsInfo: [
            { formula: 'CO', color: 'colourless', nature: 'neutral' },
            { formula: 'CO₂', color: 'colourless', nature: 'acidic' }
        ],
        oxides: ['CO', 'CO₂'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'CO₂ is acidic oxide, CO is neutral',
        anomalousBehavior: {
            facts: [
                'Catenation - forms long chains due to strong C-C bonds (most among all elements)',
                'Allotropes: diamond (hardest), graphite (soft, conductor), fullerenes',
                'Forms maximum covalent bonds (4) due to tetravalency',
                'Does not form C⁴⁺ or C⁴⁻ ions (very high IE and EA)',
                'Unique ability to form pπ-pπ multiple bonds (C=C, C≡C)'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-4, -2, 0, 2, 4],
        oxidationStateCompounds: [
            { state: -4, compounds: ['CH₄', 'Al₄C₃'] },
            { state: 2, compounds: ['CO'] },
            { state: 4, compounds: ['CO₂', 'CCl₄'] }
        ],
        keyReactions: [
            {
                equation: 'C + O₂ → CO₂',
                conditions: 'Excess oxygen',
                note: 'Complete combustion'
            },
            {
                equation: '2C + O₂ → 2CO',
                conditions: 'Limited oxygen',
                note: 'Incomplete combustion'
            }
        ],
        trendPosition: 'Unique catenation, forms basis of organic chemistry, multiple allotropes',
        row: 2,
        col: 14
    },
    {
        atomicNumber: 7,
        symbol: 'N',
        name: 'Nitrogen',
        atomicMass: 14.01,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 15,
        period: 2,
        electronConfig: '[He]2s²2p³',
        atomicRadius: 70,
        ionicRadius: 171,
        ionizationEnergy: 1402,
        electronegativity: 3.0,
        density: 0.879,
        meltingPoint: 63,
        boilingPoint: 77,
        gasColor: { formula: 'N₂', color: 'colorless', hexColor: 'transparent' },
        compoundsInfo: [
            { formula: 'N₂O, NO', color: 'colourless gas', nature: 'neutral' },
            { formula: 'N₂O₃', color: 'blue solid', nature: 'acidic' },
            { formula: 'NO₂', color: 'brown gas', nature: 'acidic' },
            { formula: 'N₂O₄, N₂O₅', color: 'colourless solid', nature: 'acidic' }
        ],
        oxides: ['N₂O', 'NO', 'N₂O₃', 'NO₂', 'N₂O₄', 'N₂O₅'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'Higher oxides are acidic, N₂O and NO are neutral',
        isException: true,
        exceptionType: 'Electron Affinity',
        exceptionExplanation: 'N has ~0 EA due to electron-electron repulsion in compact 2p orbitals',
        anomalousBehavior: {
            facts: [
                'Does not form pentahalides (NCl₅) due to absence of d-orbitals',
                'N₂ is extremely inert due to strong N≡N triple bond (946 kJ/mol)',
                'Maximum covalency of 4 (no d-orbitals), unlike P which shows covalency of 6',
                'Forms pπ-pπ multiple bonds (N=N, N≡N) unlike heavier elements',
                'Exists as diatomic N₂ gas, while P exists as P₄ solid'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-3, -2, -1, 1, 2, 3, 4, 5],
        oxidationStateCompounds: [
            { state: -3, compounds: ['NH₃', 'N³⁻'] },
            { state: 1, compounds: ['N₂O'] },
            { state: 2, compounds: ['NO'] },
            { state: 3, compounds: ['N₂O₃', 'HNO₂'] },
            { state: 4, compounds: ['NO₂', 'N₂O₄'] },
            { state: 5, compounds: ['N₂O₅', 'HNO₃'] }
        ],
        keyReactions: [
            {
                equation: 'N₂ + 3H₂ ⇌ 2NH₃',
                conditions: 'Haber process: 450°C, 200 atm, Fe catalyst',
                note: 'Industrial ammonia synthesis'
            },
            {
                equation: '4NH₃ + 5O₂ → 4NO + 6H₂O',
                conditions: 'Ostwald process: Pt catalyst',
                note: 'Ammonia oxidation to NO'
            }
        ],
        trendPosition: 'Smallest pnictogen — highest IE, forms strong π bonds, no d-orbitals',
        row: 2,
        col: 15
    },
    {
        atomicNumber: 8,
        symbol: 'O',
        name: 'Oxygen',
        atomicMass: 16.00,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 16,
        period: 2,
        electronConfig: '[He]2s²2p⁴',
        atomicRadius: 66,
        ionicRadius: 140,
        ionizationEnergy: 1314,
        electronegativity: 3.50,
        electronAffinity: 141,
        density: 1.32,
        meltingPoint: 55,
        boilingPoint: 90,
        gasColor: { formula: 'O₂', color: 'colorless', hexColor: 'transparent' },
        compoundsInfo: [
            { formula: 'O₃', color: 'very pale blue', nature: 'neutral' },
            { formula: 'OF₂', color: 'colourless', nature: 'neutral' }
        ],
        isException: true,
        exceptionType: 'Ionization Energy',
        exceptionExplanation: 'IE of O < N due to electron pairing in 2p⁴ causing repulsion',
        anomalousBehavior: {
            facts: [
                'Does not form OF₆ (no d-orbitals), while S forms SF₆',
                'Maximum covalency of 4, unlike S which shows covalency of 6',
                'Forms strong pπ-pπ bonds (O=O), unlike heavier chalcogens',
                'Exists as diatomic O₂ gas, while S exists as S₈ solid',
                'Most electronegative after F (3.5), shows -2 oxidation state in most compounds'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-2, -1, 0, 1, 2],
        oxidationStateCompounds: [
            { state: -2, compounds: ['H₂O', 'Na₂O', 'MgO'] },
            { state: -1, compounds: ['H₂O₂', 'Na₂O₂'] },
            { state: 1, compounds: ['OF₂'] },
            { state: 2, compounds: ['O₂F₂'] }
        ],
        keyReactions: [
            {
                equation: '3O₂ ⇌ 2O₃',
                conditions: 'UV light or electric discharge',
                note: 'Ozone formation'
            },
            {
                equation: '2H₂O₂ → 2H₂O + O₂',
                conditions: 'MnO₂ catalyst',
                note: 'Decomposition of hydrogen peroxide'
            }
        ],
        trendPosition: 'Smallest chalcogen — highest EN (3.5), forms strong π bonds, no d-orbitals',
        row: 2,
        col: 16
    },
    {
        atomicNumber: 9,
        symbol: 'F',
        name: 'Fluorine',
        atomicMass: 19.00,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 17,
        period: 2,
        electronConfig: '[He]2s²2p⁵',
        atomicRadius: 64,
        ionicRadius: 133,
        ionizationEnergy: 1680,
        electronegativity: 4.0,
        electronAffinity: -328,
        density: 1.5,
        meltingPoint: 54.4,
        boilingPoint: 84.9,
        standardReductionPotential: 2.87,
        gasColor: { formula: 'F₂', color: 'very pale yellow/brown', hexColor: '#FFFACD' },
        isException: true,
        exceptionType: 'Electron Affinity',
        exceptionExplanation: 'F has lower EA than Cl due to small size causing e⁻-e⁻ repulsion',
        anomalousBehavior: {
            facts: [
                'Most electronegative element (4.0) - only shows -1 oxidation state',
                'Does not form polyhalides (no d-orbitals), while Cl forms Cl₃⁻, ICl₂⁻',
                'Strongest oxidizing agent (E° = +2.87 V)',
                'Forms only one oxoacid (HOF), while Cl forms multiple (HClO, HClO₂, HClO₃, HClO₄)',
                'F-F bond is weak (158 kJ/mol) due to lone pair repulsion in small F₂ molecule'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-1],
        oxidationStateCompounds: [
            { state: -1, compounds: ['HF', 'NaF', 'CaF₂', 'SF₆', 'OF₂'] }
        ],
        keyReactions: [
            {
                equation: 'F₂ + H₂ → 2HF',
                conditions: 'Explosive even in dark',
                note: 'Most reactive halogen'
            },
            {
                equation: 'F₂ + 2X⁻ → 2F⁻ + X₂',
                conditions: 'X = Cl, Br, I',
                note: 'Strongest oxidizing halogen'
            }
        ],
        trendPosition: 'Smallest halogen — highest EN (4.0), strongest oxidizer, only -1 oxidation state',
        row: 2,
        col: 17
    },
    { atomicNumber: 10, symbol: 'Ne', name: 'Neon', atomicMass: 20.18, category: 'Noble Gas', block: 'p', group: 18, period: 2, electronConfig: '[He]2s²2p⁶', atomicRadius: 160, ionizationEnergy: 2080, electronAffinity: 116, density: 0.0009, meltingPoint: 24.6, boilingPoint: 27.1, row: 2, col: 18 }, // ΔegH = +116 (positive, endothermic)

    // Period 3 - NCERT values with oxide nature for trend
    {
        atomicNumber: 11,
        symbol: 'Na',
        name: 'Sodium',
        atomicMass: 22.99,
        category: 'Alkali Metal',
        block: 's',
        group: 1,
        period: 3,
        electronConfig: '[Ne]3s¹',
        atomicRadius: 186,
        ionicRadius: 102,
        ionizationEnergy: 496,
        electronegativity: 0.93,
        electronAffinity: -53,
        density: 0.97,
        meltingPoint: 371,
        boilingPoint: 1156,
        standardReductionPotential: -2.714,
        flameColor: { color: 'Yellow/orange', hexColor: '#FFD700' },
        oxides: ['Na₂O', 'Na₂O₂'],
        oxideNature: 'basic',
        oxideNatureDetails: 'Na₂O is strongly basic, reacts vigorously with water → NaOH',
        // Oxidation States
        oxidationStates: [1],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Na₂O', 'Na₂O₂', 'NaOH', 'NaCl', 'Na₂CO₃', 'NaHCO₃', 'NaNO₃'] }
        ],
        // Key Reactions
        keyReactions: [
            {
                equation: '2Na + O₂ → Na₂O₂',
                conditions: 'Excess oxygen',
                note: 'Forms peroxide (unlike Li which forms normal oxide)'
            },
            {
                equation: '2Na + 2H₂O → 2NaOH + H₂↑',
                conditions: 'Vigorous reaction',
                note: 'Reacts vigorously with cold water'
            },
            {
                equation: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑',
                conditions: 'Room temperature',
                note: 'Stable carbonate (does not decompose on heating unlike Li₂CO₃)'
            },
            {
                equation: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂',
                conditions: 'Heat',
                note: 'Bicarbonate decomposes on heating'
            }
        ],
        // Trend Position
        trendPosition: 'Second alkali metal — persistent yellow flame color (D-line emission at 589 nm), most abundant alkali metal in nature',
        row: 3,
        col: 1
    },
    {
        atomicNumber: 12,
        symbol: 'Mg',
        name: 'Magnesium',
        atomicMass: 24.31,
        category: 'Alkaline Earth Metal',
        block: 's',
        group: 2,
        period: 3,
        electronConfig: '[Ne]3s²',
        atomicRadius: 160,
        ionicRadius: 72,
        ionizationEnergy: 737,
        electronegativity: 1.31,
        density: 1.74,
        meltingPoint: 924,
        boilingPoint: 1363,
        standardReductionPotential: -2.36,
        flameColor: { color: 'Brilliant white', hexColor: '#FFFFFF' },
        oxides: ['MgO'],
        oxideNature: 'basic',
        oxideNatureDetails: 'MgO is basic oxide → Mg(OH)₂ with water',
        compoundsInfo: [
            { formula: 'Mg(NH₄)PO₄', color: 'White', hexColor: '#FFFFFF', nature: 'basic' },
            { formula: 'MgSO₄', color: 'White (Epsom salt)', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'MgCl₂', color: 'White', hexColor: '#FFFFFF', nature: 'neutral' }
        ],
        // Anomalous Behavior
        anomalousBehavior: {
            facts: [
                'Diagonal relationship with Li: similar size, polarizing power, covalent character in compounds',
                'Does not react with cold water (protective oxide layer), reacts with hot water slowly',
                'Forms Mg₃N₂ with nitrogen (only at very high temperature)',
                'MgCO₃ decomposes on heating (unlike heavier Group 2 carbonates which are more stable)',
                'Mg(OH)₂ is less soluble than other Group 2 hydroxides'
            ],
            jeeRelevance: 'medium'
        },
        // Oxidation States
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['MgO', 'MgCl₂', 'MgSO₄', 'Mg(OH)₂', 'MgCO₃', 'Mg₃N₂', 'Mg(NH₄)PO₄'] }
        ],
        // Key Reactions
        keyReactions: [
            {
                equation: '3Mg + N₂ → Mg₃N₂',
                conditions: 'High temperature',
                note: 'Only Group 2 metal that reacts with nitrogen (similar to Li)'
            },
            {
                equation: 'Mg + 2H₂O → Mg(OH)₂ + H₂↑',
                conditions: 'Hot water',
                note: 'Slow reaction with hot water (does not react with cold water)'
            },
            {
                equation: 'Mg²⁺ + NH₄⁺ + PO₄³⁻ → Mg(NH₄)PO₄↓',
                conditions: 'Aqueous solution',
                note: 'White precipitate - confirmatory test for Mg²⁺'
            },
            {
                equation: 'MgCO₃ → MgO + CO₂',
                conditions: 'Heat',
                note: 'Carbonate decomposes on heating'
            }
        ],
        // Trend Position
        trendPosition: 'Second alkaline earth metal — brilliant white flame, forms protective oxide layer preventing water reaction',
        row: 3,
        col: 2
    },
    {
        atomicNumber: 13,
        symbol: 'Al',
        name: 'Aluminium',
        atomicMass: 26.98,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 13,
        period: 3,
        electronConfig: '[Ne]3s²3p¹',
        atomicRadius: 143,
        ionicRadius: 53.5,
        ionizationEnergy: 577,
        electronegativity: 1.5,
        density: 2.70,
        meltingPoint: 933,
        boilingPoint: 2740,
        standardReductionPotential: -1.66,
        oxides: ['Al₂O₃'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'Al₂O₃ is amphoteric - dissolves in both acids and alkalis',
        anomalousBehavior: {
            facts: [
                'Amphoteric oxide (Al₂O₃) - dissolves in both acids and bases',
                'Diagonal relationship with Be: similar size, polarizing power, amphoteric nature',
                'Forms protective oxide layer (passive layer) preventing further reaction',
                'Does not react with concentrated HNO₃ due to passivation',
                'Forms alums: K₂SO₄·Al₂(SO₄)₃·24H₂O'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [3],
        oxidationStateCompounds: [
            { state: 3, compounds: ['Al₂O₃', 'AlCl₃', 'Al₂(SO₄)₃', 'Al(OH)₃'] }
        ],
        keyReactions: [
            {
                equation: 'Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O',
                conditions: 'Acidic medium',
                note: 'Amphoteric oxide - dissolves in acids'
            },
            {
                equation: 'Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O',
                conditions: 'Basic medium',
                note: 'Amphoteric oxide - dissolves in bases (forms aluminate)'
            },
            {
                equation: '2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑',
                conditions: 'Alkali reaction',
                note: 'Al reacts with NaOH liberating H₂'
            }
        ],
        trendPosition: 'First metal in Group 13 — amphoteric oxide, diagonal relationship with Be',
        row: 3,
        col: 13
    },
    {
        atomicNumber: 14,
        symbol: 'Si',
        name: 'Silicon',
        atomicMass: 28.09,
        category: 'Metalloid',
        block: 'p',
        group: 14,
        period: 3,
        electronConfig: '[Ne]3s²3p²',
        atomicRadius: 118,
        ionicRadius: 40,
        ionizationEnergy: 786,
        electronegativity: 1.8,
        density: 2.34,
        meltingPoint: 1693,
        boilingPoint: 3550,
        oxides: ['SiO₂'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'SiO₂ is weakly acidic oxide',
        anomalousBehavior: {
            facts: [
                'Does not form pπ-pπ multiple bonds (Si=Si) due to larger size',
                'Forms SiO₄⁴⁻ (silicate) with tetrahedral structure',
                'Diagonal relationship with B: similar EN, forms covalent compounds',
                'Exists as giant covalent network (SiO₂), not discrete molecules like CO₂',
                'Shows catenation but less than C due to weaker Si-Si bonds'
            ],
            jeeRelevance: 'medium'
        },
        oxidationStates: [-4, 4],
        oxidationStateCompounds: [
            { state: -4, compounds: ['Mg₂Si', 'SiH₄'] },
            { state: 4, compounds: ['SiO₂', 'SiCl₄', 'Na₂SiO₃'] }
        ],
        keyReactions: [
            {
                equation: 'Si + O₂ → SiO₂',
                conditions: 'Heat',
                note: 'Forms acidic oxide (silica)'
            },
            {
                equation: 'SiO₂ + 2NaOH → Na₂SiO₃ + H₂O',
                conditions: 'Fused NaOH',
                note: 'Silica dissolves in strong base'
            }
        ],
        trendPosition: 'Metalloid in Group 14 — forms giant covalent SiO₂, semiconductor',
        row: 3,
        col: 14
    },
    {
        atomicNumber: 15,
        symbol: 'P',
        name: 'Phosphorus',
        atomicMass: 30.97,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 15,
        period: 3,
        electronConfig: '[Ne]3s²3p³',
        atomicRadius: 110,
        ionicRadius: 212,
        ionizationEnergy: 1012,
        electronegativity: 2.1,
        density: 1.823,
        meltingPoint: 317,
        boilingPoint: 554,
        oxides: ['P₂O₃', 'P₂O₅'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'P₂O₅ is acidic oxide → H₃PO₄ with water',
        compoundsInfo: [
            { formula: '(NH₄)₃[P(Mo₃O₁₀)₄]', color: 'Canary Yellow', hexColor: '#FFFF00', nature: 'acidic' }
        ],
        anomalousBehavior: {
            facts: [
                'Forms pentahalides (PCl₅) using d-orbitals, unlike N',
                'Maximum covalency of 6 (has d-orbitals), unlike N which shows max 4',
                'Exists as P₄ solid (white/red/black allotropes), not diatomic like N₂',
                'Does not form pπ-pπ multiple bonds (P=P) due to larger size',
                'White P is highly reactive, red P is less reactive'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-3, 3, 5],
        oxidationStateCompounds: [
            { state: -3, compounds: ['PH₃', 'Ca₃P₂'] },
            { state: 3, compounds: ['P₂O₃', 'PCl₃', 'H₃PO₃'] },
            { state: 5, compounds: ['P₂O₅', 'PCl₅', 'H₃PO₄'] }
        ],
        keyReactions: [
            {
                equation: 'P₄ + 5O₂ → P₄O₁₀ (or 2P₂O₅)',
                conditions: 'Excess oxygen',
                note: 'Forms phosphorus pentoxide'
            },
            {
                equation: 'P₂O₅ + 3H₂O → 2H₃PO₄',
                conditions: 'Orthophosphoric acid formation',
                note: 'Strongly acidic oxide'
            },
            {
                equation: 'PCl₅ ⇌ PCl₃ + Cl₂',
                conditions: 'Heat',
                note: 'Thermal dissociation of PCl₅'
            }
        ],
        trendPosition: 'Has d-orbitals — forms PCl₅, exists as P₄, multiple allotropes',
        row: 3,
        col: 15
    },
    {
        atomicNumber: 16,
        symbol: 'S',
        name: 'Sulfur',
        atomicMass: 32.06,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 16,
        period: 3,
        electronConfig: '[Ne]3s²3p⁴',
        atomicRadius: 104,
        ionicRadius: 184,
        ionizationEnergy: 1000,
        electronegativity: 2.44,
        electronAffinity: 200,
        density: 2.06,
        meltingPoint: 393,
        boilingPoint: 718,
        oxides: ['SO₂', 'SO₃'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'SO₂ and SO₃ are strongly acidic oxides → H₂SO₃, H₂SO₄',
        compoundsInfo: [
            { formula: 'H₂SO₄', color: 'Colorless (conc)', hexColor: 'transparent', nature: 'acidic' }
        ],
        anomalousBehavior: {
            facts: [
                'Forms SF₆ using d-orbitals, unlike O which cannot form OF₆',
                'Maximum covalency of 6 (has d-orbitals), unlike O which shows max 4',
                'Exists as S₈ solid (crown structure), not diatomic like O₂',
                'Shows catenation - forms polysulfides (Sₙ²⁻)',
                'Multiple allotropes: rhombic S, monoclinic S, plastic S'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-2, 0, 4, 6],
        oxidationStateCompounds: [
            { state: -2, compounds: ['H₂S', 'Na₂S', 'FeS'] },
            { state: 4, compounds: ['SO₂', 'H₂SO₃', 'SOCl₂'] },
            { state: 6, compounds: ['SO₃', 'H₂SO₄', 'SF₆'] }
        ],
        keyReactions: [
            {
                equation: 'S + O₂ → SO₂',
                conditions: 'Combustion',
                note: 'Forms sulfur dioxide'
            },
            {
                equation: '2SO₂ + O₂ ⇌ 2SO₃',
                conditions: 'Contact process: V₂O₅ catalyst',
                note: 'Oxidation to SO₃ for H₂SO₄ production'
            },
            {
                equation: 'SO₃ + H₂O → H₂SO₄',
                conditions: 'Oleum formation',
                note: 'Strongly acidic oxide'
            }
        ],
        trendPosition: 'Has d-orbitals — forms SF₆, exists as S₈, shows catenation',
        row: 3,
        col: 16
    },
    {
        atomicNumber: 17,
        symbol: 'Cl',
        name: 'Chlorine',
        atomicMass: 35.45,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 17,
        period: 3,
        electronConfig: '[Ne]3s²3p⁵',
        atomicRadius: 99,
        ionicRadius: 184,
        ionizationEnergy: 1256,
        electronegativity: 3.2,
        electronAffinity: -349,
        density: 1.66,
        meltingPoint: 172.0,
        boilingPoint: 239.0,
        standardReductionPotential: 1.36,
        gasColor: { formula: 'Cl₂', color: 'greenish yellow', hexColor: '#9ACD32' },
        compoundsInfo: [
            { formula: 'ClO₂', color: 'intense yellow', hexColor: '#FFD700', nature: 'acidic' },
            { formula: 'Cl₂O', color: 'brown/yellow', hexColor: '#DAA520', nature: 'acidic' },
            { formula: 'NH₄Cl', color: 'White', hexColor: '#FFFFFF', nature: 'acidic' }
        ],
        oxides: ['Cl₂O₇'],
        oxideNature: 'acidic',
        oxideNatureDetails: 'Cl₂O₇ is strongly acidic → HClO₄ (perchloric acid)',
        anomalousBehavior: {
            facts: [
                'Forms multiple oxoacids (HClO, HClO₂, HClO₃, HClO₄) using d-orbitals',
                'Shows variable oxidation states (+1, +3, +5, +7) unlike F',
                'Forms polyhalides (Cl₃⁻, ICl₂⁻) using d-orbitals',
                'Higher EA than F (-349 vs -328 kJ/mol) due to less e⁻-e⁻ repulsion',
                'Strong oxidizing agent but weaker than F'
            ],
            jeeRelevance: 'high'
        },
        oxidationStates: [-1, 1, 3, 5, 7],
        oxidationStateCompounds: [
            { state: -1, compounds: ['HCl', 'NaCl', 'CaCl₂'] },
            { state: 1, compounds: ['HClO', 'Cl₂O'] },
            { state: 3, compounds: ['HClO₂', 'Cl₂O₃'] },
            { state: 5, compounds: ['HClO₃', 'Cl₂O₅'] },
            { state: 7, compounds: ['HClO₄', 'Cl₂O₇'] }
        ],
        keyReactions: [
            {
                equation: 'Cl₂ + H₂O ⇌ HCl + HOCl',
                conditions: 'Disproportionation in water',
                note: 'Forms hydrochloric and hypochlorous acids'
            },
            {
                equation: '3Cl₂ + 6NaOH → 5NaCl + NaClO₃ + 3H₂O',
                conditions: 'Hot concentrated NaOH',
                note: 'Disproportionation to chlorate'
            },
            {
                equation: 'Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂',
                conditions: 'Displacement reaction',
                note: 'Cl₂ oxidizes Br⁻ and I⁻'
            }
        ],
        trendPosition: 'Has d-orbitals — forms multiple oxoacids, variable oxidation states, higher EA than F',
        row: 3,
        col: 17
    },
    { atomicNumber: 18, symbol: 'Ar', name: 'Argon', atomicMass: 39.95, category: 'Noble Gas', block: 'p', group: 18, period: 3, electronConfig: '[Ne]3s²3p⁶', atomicRadius: 190, ionizationEnergy: 1520, electronAffinity: 96, density: 0.00178, meltingPoint: 83.8, boilingPoint: 87.2, row: 3, col: 18 },

    // Period 4 - s and p block - NCERT values
    {
        atomicNumber: 19,
        symbol: 'K',
        name: 'Potassium',
        atomicMass: 39.10,
        category: 'Alkali Metal',
        block: 's',
        group: 1,
        period: 4,
        electronConfig: '[Ar]4s¹',
        atomicRadius: 227,
        ionicRadius: 138,
        ionizationEnergy: 419,
        electronegativity: 0.82,
        electronAffinity: -48,
        density: 0.86,
        meltingPoint: 336,
        boilingPoint: 1032,
        standardReductionPotential: -2.925,
        flameColor: { color: 'Lilac/violet', hexColor: '#C8A2C8' },
        oxides: ['K₂O', 'KO₂'],
        oxideNature: 'basic',
        oxideNatureDetails: 'K₂O is strongly basic',
        compoundsInfo: [
            { formula: 'K₂CrO₄', color: 'Yellow (soln)', hexColor: '#FFFF00', nature: 'neutral' },
            { formula: 'KMnO₄', color: 'Dark Purple', hexColor: '#800080', nature: 'neutral' },
            { formula: 'K₂Cr₂O₇', color: 'Orange', hexColor: '#FFA500', nature: 'neutral' }
        ],
        oxidationStates: [1],
        oxidationStateCompounds: [
            { state: 1, compounds: ['K₂O', 'KO₂', 'KOH', 'KCl', 'K₂CO₃', 'KHCO₃', 'KNO₃', 'KMnO₄'] }
        ],
        keyReactions: [
            {
                equation: 'K + O₂ → KO₂',
                conditions: 'Excess oxygen',
                note: 'Forms superoxide (unlike Li which forms normal oxide, Na which forms peroxide)'
            },
            {
                equation: '2K + 2H₂O → 2KOH + H₂↑',
                conditions: 'Violent reaction',
                note: 'Reacts explosively with water, catches fire'
            },
            {
                equation: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O',
                conditions: 'Concentrated HCl',
                note: 'KMnO₄ as strong oxidizing agent'
            }
        ],
        trendPosition: 'Third alkali metal — lilac flame color, forms superoxide KO₂, most reactive alkali metal in Group 1',
        row: 4,
        col: 1
    },
    {
        atomicNumber: 20,
        symbol: 'Ca',
        name: 'Calcium',
        atomicMass: 40.08,
        category: 'Alkaline Earth Metal',
        block: 's',
        group: 2,
        period: 4,
        electronConfig: '[Ar]4s²',
        atomicRadius: 197,
        ionicRadius: 100,
        ionizationEnergy: 590,
        electronegativity: 1.00,
        density: 1.55,
        meltingPoint: 1124,
        boilingPoint: 1767,
        standardReductionPotential: -2.84,
        flameColor: { color: 'Brick red', hexColor: '#CB4154' },
        oxides: ['CaO'],
        oxideNature: 'basic',
        oxideNatureDetails: 'CaO (quicklime) is basic oxide',
        compoundsInfo: [
            { formula: 'CaC₂O₄', color: 'White', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'CaSO₄·2H₂O', color: 'White (Gypsum)', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'CaCO₃', color: 'White (Limestone)', hexColor: '#FFFFFF', nature: 'basic' }
        ],
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['CaO', 'Ca(OH)₂', 'CaCl₂', 'CaCO₃', 'CaSO₄', 'CaC₂O₄'] }
        ],
        keyReactions: [
            {
                equation: 'CaO + H₂O → Ca(OH)₂',
                conditions: 'Slaking of lime',
                note: 'Quicklime (CaO) reacts with water to form slaked lime Ca(OH)₂'
            },
            {
                equation: 'CaCO₃ → CaO + CO₂',
                conditions: 'Heat (>900°C)',
                note: 'Thermal decomposition of limestone to produce quicklime'
            },
            {
                equation: 'Ca²⁺ + C₂O₄²⁻ → CaC₂O₄↓',
                conditions: 'Aqueous solution',
                note: 'White precipitate - confirmatory test for Ca²⁺'
            },
            {
                equation: 'Ca + 2H₂O → Ca(OH)₂ + H₂↑',
                conditions: 'Cold water',
                note: 'Reacts with cold water (unlike Mg which needs hot water)'
            }
        ],
        trendPosition: 'Third alkaline earth metal — brick red flame, forms quicklime (CaO) used in construction',
        row: 4,
        col: 2
    },
    {
        atomicNumber: 31,
        symbol: 'Ga',
        name: 'Gallium',
        atomicMass: 69.72,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 13,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²4p¹',
        atomicRadius: 135,
        ionicRadius: 62,
        ionizationEnergy: 579,
        electronegativity: 1.6,
        density: 5.90,
        meltingPoint: 303,
        boilingPoint: 2676,
        standardReductionPotential: -0.56,
        isException: true,
        exceptionType: 'Melting Point',
        exceptionExplanation: 'Ga has unusually low MP (303K) due to unusual crystal structure',
        oxides: ['Ga₂O₃'],
        oxideNature: 'amphoteric',
        oxidationStates: [3],
        oxidationStateCompounds: [
            { state: 3, compounds: ['Ga₂O₃', 'GaCl₃'] }
        ],
        keyReactions: [
            {
                equation: '4Ga + 3O₂ → 2Ga₂O₃',
                conditions: 'Heat',
                note: 'Forms amphoteric oxide'
            }
        ],
        trendPosition: 'Low melting point (303K) — melts in hand, amphoteric oxide',
        row: 4,
        col: 13
    },
    {
        atomicNumber: 32,
        symbol: 'Ge',
        name: 'Germanium',
        atomicMass: 72.60,
        category: 'Metalloid',
        block: 'p',
        group: 14,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²4p²',
        atomicRadius: 122,
        ionicRadius: 53,
        ionizationEnergy: 761,
        electronegativity: 1.8,
        density: 5.32,
        meltingPoint: 1218,
        boilingPoint: 3123,
        oxides: ['GeO₂'],
        oxideNature: 'amphoteric',
        oxidationStates: [2, 4],
        oxidationStateCompounds: [
            { state: 2, compounds: ['GeO'] },
            { state: 4, compounds: ['GeO₂', 'GeCl₄'] }
        ],
        keyReactions: [
            {
                equation: 'Ge + O₂ → GeO₂',
                conditions: 'Heat',
                note: 'Forms amphoteric oxide'
            }
        ],
        trendPosition: 'Metalloid in Group 14 — semiconductor, amphoteric GeO₂',
        row: 4,
        col: 14
    },
    {
        atomicNumber: 33,
        symbol: 'As',
        name: 'Arsenic',
        atomicMass: 74.92,
        category: 'Metalloid',
        block: 'p',
        group: 15,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²4p³',
        atomicRadius: 121,
        ionicRadius: 222,
        ionizationEnergy: 947,
        electronegativity: 2.0,
        density: 5.778,
        meltingPoint: 1089,
        boilingPoint: 888,
        compoundsInfo: [
            { formula: 'As₂S₃', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'acidic' },
            { formula: '(NH₄)₃[As(Mo₃O₁₀)₄]', color: 'Canary Yellow', hexColor: '#FFEF00', nature: 'acidic' }
        ],
        oxides: ['As₂O₃', 'As₂O₅'],
        oxideNature: 'acidic',
        oxidationStates: [-3, 3, 5],
        oxidationStateCompounds: [
            { state: -3, compounds: ['AsH₃'] },
            { state: 3, compounds: ['As₂O₃', 'AsCl₃', 'As₂S₃'] },
            { state: 5, compounds: ['As₂O₅', 'H₃AsO₄'] }
        ],
        keyReactions: [
            {
                equation: '2As + 3H₂S → As₂S₃↓',
                conditions: 'Yellow precipitate',
                note: 'Confirmatory test for As³⁺'
            }
        ],
        trendPosition: 'Metalloid in Group 15 — forms yellow As₂S₃ precipitate',
        row: 4,
        col: 15
    },
    {
        atomicNumber: 34,
        symbol: 'Se',
        name: 'Selenium',
        atomicMass: 78.96,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 16,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²4p⁴',
        atomicRadius: 117,
        ionicRadius: 198,
        ionizationEnergy: 941,
        electronegativity: 2.48,
        electronAffinity: 195,
        density: 4.19,
        meltingPoint: 490,
        boilingPoint: 958,
        oxides: ['SeO₂'],
        oxideNature: 'acidic',
        oxidationStates: [-2, 4, 6],
        oxidationStateCompounds: [
            { state: -2, compounds: ['H₂Se'] },
            { state: 4, compounds: ['SeO₂', 'H₂SeO₃'] },
            { state: 6, compounds: ['SeO₃', 'H₂SeO₄'] }
        ],
        keyReactions: [
            {
                equation: 'Se + O₂ → SeO₂',
                conditions: 'Combustion',
                note: 'Forms acidic oxide'
            }
        ],
        trendPosition: 'Similar to S but less reactive — forms acidic oxides',
        row: 4,
        col: 16
    },
    {
        atomicNumber: 35,
        symbol: 'Br',
        name: 'Bromine',
        atomicMass: 79.90,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 17,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²4p⁵',
        atomicRadius: 114,
        ionicRadius: 196,
        ionizationEnergy: 1142,
        electronegativity: 3.0,
        electronAffinity: -325,
        density: 3.19,
        meltingPoint: 265.8,
        boilingPoint: 332.5,
        standardReductionPotential: 1.09,
        gasColor: { formula: 'Br₂', color: 'red/brown', hexColor: '#A52A2A' },
        oxideNature: 'acidic',
        oxidationStates: [-1, 1, 3, 5, 7],
        oxidationStateCompounds: [
            { state: -1, compounds: ['HBr', 'NaBr'] },
            { state: 1, compounds: ['HBrO', 'Br₂O'] },
            { state: 5, compounds: ['HBrO₃', 'BrO₃⁻'] }
        ],
        keyReactions: [
            {
                equation: 'Br₂ + H₂O ⇌ HBr + HOBr',
                conditions: 'Disproportionation',
                note: 'Forms hydrobromic and hypobromous acids'
            },
            {
                equation: 'Br₂ + 2I⁻ → 2Br⁻ + I₂',
                conditions: 'Displacement reaction',
                note: 'Br₂ oxidizes I⁻'
            }
        ],
        trendPosition: 'Only liquid non-metal at room temperature — red-brown color, moderate oxidizer',
        row: 4,
        col: 17
    },
    { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', atomicMass: 83.80, category: 'Noble Gas', block: 'p', group: 18, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p⁶', atomicRadius: 200, ionizationEnergy: 1351, electronAffinity: 96, density: 0.0037, meltingPoint: 115.9, boilingPoint: 119.7, row: 4, col: 18 },

    // Period 4 - d-block (3d series) - NCERT values with ion colors, oxides, halides
    {
        atomicNumber: 21,
        symbol: 'Sc',
        name: 'Scandium',
        atomicMass: 44.956,
        category: 'Transition Metal',
        block: 'd',
        group: 3,
        period: 4,
        electronConfig: '[Ar]3d¹4s²',
        atomicRadius: 164,
        ionicRadius: 73,
        ionizationEnergy: 631,
        electronegativity: 1.36,
        density: 3.43,
        meltingPoint: 1814,
        boilingPoint: 3109,
        ionColors: [{ ion: 'Sc³⁺', config: '3d⁰', color: 'colourless', hexColor: 'transparent' }],
        oxides: ['Sc₂O₃'],
        halides: [],
        oxideNature: 'basic',
        oxideNatureDetails: 'Sc₂O₃ is basic oxide',
        oxidationStates: [3],
        oxidationStateCompounds: [
            { state: 3, compounds: ['Sc₂O₃', 'ScCl₃', 'Sc(OH)₃'] }
        ],
        anomalousBehavior: {
            facts: [
                'Considered a transition element despite incompletely filled 3d orbital (3d¹4s²) in ground state',
                'Unlike other transition metals, does not exhibit variable oxidation states — stable only in +3 state',
                'E°(M³⁺/M²⁺) value is unusually low because Sc³⁺ is highly stable due to possessing noble gas configuration',
                'Sc³⁺ ion (3d⁰) is colourless in aqueous solution'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: '2Sc + 3O₂ → Sc₂O₃',
                conditions: 'Heat',
                note: 'Forms basic oxide — highest oxide is Sc₂O₃'
            }
        ],
        trendPosition: 'First 3d transition metal — only +3 oxidation state, colorless Sc³⁺ (3d⁰)',
        hasRichData: true,
        row: 4,
        col: 3
    },
    {
        atomicNumber: 22,
        symbol: 'Ti',
        name: 'Titanium',
        atomicMass: 47.867,
        category: 'Transition Metal',
        block: 'd',
        group: 4,
        period: 4,
        electronConfig: '[Ar]3d²4s²',
        atomicRadius: 147,
        ionicRadius: 67,
        ionizationEnergy: 656,
        electronegativity: 1.54,
        density: 4.5,
        meltingPoint: 1941,
        boilingPoint: 3560,
        standardReductionPotential: -1.63,
        ionColors: [
            { ion: 'Ti⁴⁺', config: '3d⁰', color: 'colourless', hexColor: 'transparent' },
            { ion: 'Ti³⁺', config: '3d¹', color: 'purple', hexColor: '#9B59B6' }
        ],
        compoundsInfo: [
            { formula: 'TiO₂', color: 'White', hexColor: '#FFFFFF', nature: 'amphoteric' }
        ],
        oxides: ['TiO', 'Ti₂O₃', 'TiO₂'],
        halides: ['TiX₂', 'TiX₃', 'TiX₄'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'TiO₂ is amphoteric; Ti⁴⁺ as TiO²⁺ (titanyl)',
        oxidationStates: [2, 3, 4],
        oxidationStateCompounds: [
            { state: 2, compounds: ['TiO', 'TiCl₂'] },
            { state: 3, compounds: ['Ti₂O₃', 'TiCl₃'] },
            { state: 4, compounds: ['TiO₂', 'TiCl₄', 'TiO²⁺'] }
        ],
        anomalousBehavior: {
            facts: [
                'Hard metal with high density of 4.5 g cm⁻³',
                'Ti(IV) is more stable than Ti(III) or Ti(II) — high oxidation states stabilized in oxocations like TiO²⁺',
                'Passive to dilute non-oxidising acids at room temperature',
                'Forms non-stoichiometric interstitial compounds with hydrogen and carbon, such as TiC and TiH₁.₇',
                'TiO₂ is used extensively in pigment industry'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Ti + O₂ → TiO₂',
                conditions: 'Heat',
                note: 'Forms white TiO₂ (titanium dioxide) — used in pigment industry'
            },
            {
                equation: 'TiCl₄ + 2H₂O → TiO₂ + 4HCl',
                conditions: 'Hydrolysis',
                note: 'TiCl₄ fumes in moist air'
            }
        ],
        trendPosition: 'Multiple oxidation states (+2, +3, +4) — Ti⁴⁺ most stable (colorless), Ti³⁺ purple',
        hasRichData: true,
        row: 4,
        col: 4
    },
    {
        atomicNumber: 23,
        symbol: 'V',
        name: 'Vanadium',
        atomicMass: 50.942,
        category: 'Transition Metal',
        block: 'd',
        group: 5,
        period: 4,
        electronConfig: '[Ar]3d³4s²',
        atomicRadius: 135,
        ionicRadius: 64,
        ionizationEnergy: 650,
        electronegativity: 1.63,
        density: 6.07,
        meltingPoint: 2183,
        boilingPoint: 3680,
        standardReductionPotential: -1.18,
        ionColors: [
            { ion: 'V⁴⁺', config: '3d¹', color: 'blue', hexColor: '#3498DB' },
            { ion: 'V³⁺', config: '3d²', color: 'green', hexColor: '#27AE60' },
            { ion: 'V²⁺', config: '3d³', color: 'violet', hexColor: '#8E44AD' }
        ],
        compoundsInfo: [
            { formula: 'V₂O₅', color: 'Orange/Yellow', hexColor: '#FFA500', nature: 'amphoteric' },
            { formula: 'VO₂⁺', color: 'Yellow', hexColor: '#FFFF00', nature: 'acidic' },
            { formula: 'VOX₃', color: 'Orange', hexColor: '#FF8C00', nature: 'neutral' }
        ],
        oxides: ['VO', 'V₂O₃', 'V₂O₄', 'V₂O₅'],
        halides: ['VX₂', 'VX₃', 'VX₄', 'VF₅'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'V₂O₃ basic → V₂O₄ less basic (dissolves in acid to give VO²⁺) → V₂O₅ amphoteric but mainly acidic (gives VO₄³⁻ and VO₂⁺ salts)',
        oxidationStates: [2, 3, 4, 5],
        oxidationStateCompounds: [
            { state: 2, compounds: ['VO', 'VCl₂'] },
            { state: 3, compounds: ['V₂O₃', 'VCl₃'] },
            { state: 4, compounds: ['VO₂', 'VCl₄', 'VO²⁺'] },
            { state: 5, compounds: ['V₂O₅', 'VF₅', 'VOX₃'] }
        ],
        anomalousBehavior: {
            facts: [
                'Exhibits variable states up to +5 — high oxidation states stabilized as oxocations like VO²⁺ (V IV) and VO₂⁺ (V V)',
                'Forms only one pentahalide VF₅, which readily hydrolyzes to give oxohalide VOX₃',
                'Vanadium oxides show gradual transition: V₂O₃ is basic, V₂O₄ is less basic, V₂O₅ is amphoteric but mainly acidic',
                'V²⁺ is a strong reducing agent that will liberate hydrogen from dilute acid',
                'Metal itself is passive to dilute non-oxidising acids at room temperature',
                'V₂O₅ is crucial catalyst for oxidation of SO₂ in Contact Process for making sulphuric acid'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: '2V + 5O₂ → 2V₂O₅',
                conditions: 'Heat',
                note: 'Forms orange V₂O₅ (vanadium pentoxide)'
            },
            {
                equation: 'V₂O₅ + 2SO₂ → V₂O₄ + 2SO₃',
                conditions: 'Contact process catalyst',
                note: 'V₂O₅ used as catalyst in H₂SO₄ manufacture'
            }
        ],
        trendPosition: 'Multiple colored oxidation states — V²⁺ violet, V³⁺ green, V⁴⁺ blue, V⁵⁺ yellow',
        hasRichData: true,
        row: 4,
        col: 5
    },
    {
        atomicNumber: 24,
        symbol: 'Cr',
        name: 'Chromium',
        atomicMass: 51.996,
        category: 'Transition Metal',
        block: 'd',
        group: 6,
        period: 4,
        electronConfig: '[Ar]3d⁵4s¹',
        atomicRadius: 129,
        ionicRadius: 62,
        ionizationEnergy: 653,
        electronegativity: 1.66,
        density: 7.19,
        meltingPoint: 2180,
        boilingPoint: 2944,
        standardReductionPotential: -0.90,
        ionColors: [
            { ion: 'Cr³⁺', config: '3d³', color: 'violet', hexColor: '#8E44AD' },
            { ion: 'Cr²⁺', config: '3d⁴', color: 'blue', hexColor: '#3498DB' }
        ],
        compoundsInfo: [
            { formula: 'K₂CrO₄', color: 'Yellow', hexColor: '#FFFF00', nature: 'neutral' },
            { formula: 'K₂Cr₂O₇', color: 'Orange', hexColor: '#FFA500', nature: 'neutral' }
        ],
        oxides: ['CrO', 'Cr₂O₃', 'CrO₂', 'CrO₃'],
        halides: ['CrX₂', 'CrX₃', 'CrX₄', 'CrF₅', 'CrF₆'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'CrO basic, Cr₂O₃ amphoteric, CrO₃ acidic (gives H₂CrO₄, H₂Cr₂O₇)',
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Cr has 3d⁵ 4s¹ (rather than 3d⁴ 4s²) because small energy gap allows electron to enter 3d orbital to achieve stable half-filled state',
        oxidationStates: [2, 3, 6],
        oxidationStateCompounds: [
            { state: 2, compounds: ['CrO', 'CrCl₂'] },
            { state: 3, compounds: ['Cr₂O₃', 'CrCl₃', 'Cr(OH)₃'] },
            { state: 6, compounds: ['CrO₃', 'K₂CrO₄', 'K₂Cr₂O₇', 'CrF₆'] }
        ],
        anomalousBehavior: {
            facts: [
                'Electronic configuration is 3d⁵ 4s¹ (rather than 3d⁴ 4s²) to achieve stable half-filled d⁵ state',
                'Has unusually low second ionization enthalpy due to disruption of stable d⁵ state',
                'Cr²⁺ (d⁴) is very strong reducing agent because changing to Cr³⁺ (d³) gives highly stable half-filled t₂g level',
                'Conversely, Cr(VI) is strong oxidizing agent (e.g., in dichromates)',
                'Forms highest stable fluoride CrF₆',
                'Oxides show varied characters: CrO is basic, Cr₂O₃ is amphoteric, CrO₃ is highly acidic with low melting point',
                'Potassium dichromate (K₂Cr₂O₇) is orange-coloured strong oxidant'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'K₂Cr₂O₇ + 14HCl → 2KCl + 2CrCl₃ + 3Cl₂ + 7H₂O',
                conditions: 'Concentrated HCl',
                note: 'Dichromate as oxidizing agent'
            },
            {
                equation: '2CrO₄²⁻ + 2H⁺ ⇌ Cr₂O₇²⁻ + H₂O',
                conditions: 'pH dependent',
                note: 'Yellow chromate ⇌ Orange dichromate'
            }
        ],
        trendPosition: 'Half-filled d⁵ stability — Cr³⁺ most stable, Cr⁶⁺ strong oxidizing agent (dichromate)',
        hasRichData: true,
        row: 4,
        col: 6
    },
    {
        atomicNumber: 25,
        symbol: 'Mn',
        name: 'Manganese',
        atomicMass: 54.938,
        category: 'Transition Metal',
        block: 'd',
        group: 7,
        period: 4,
        electronConfig: '[Ar]3d⁵4s²',
        atomicRadius: 137,
        ionicRadius: 65,
        ionizationEnergy: 717,
        electronegativity: 1.55,
        density: 7.21,
        meltingPoint: 1519,
        boilingPoint: 2334,
        standardReductionPotential: -1.18,
        ionColors: [
            { ion: 'Mn³⁺', config: '3d⁴', color: 'violet', hexColor: '#8E44AD' },
            { ion: 'Mn²⁺', config: '3d⁵', color: 'pink', hexColor: '#FFB6C1' }
        ],
        compoundsInfo: [
            { formula: 'KMnO₄', color: 'Dark Purple', hexColor: '#800080', nature: 'neutral' },
            { formula: 'K₂MnO₄', color: 'Green', hexColor: '#27AE60', nature: 'neutral' },
            { formula: 'Mn₂O₇', color: 'Green oil', hexColor: '#2ECC71', nature: 'acidic' }
        ],
        oxides: ['MnO', 'Mn₂O₃', 'MnO₂', 'Mn₃O₄', 'Mn₂O₇'],
        halides: ['MnX₂', 'MnF₃', 'MnF₄'],
        oxideNature: 'basic',
        oxideNatureDetails: 'MnO basic → Mn₂O₃ basic → MnO₂ neutral → Mn₂O₇ acidic (gives HMnO₄). Higher O.S. = more acidic',
        oxidationStates: [2, 3, 4, 6, 7],
        oxidationStateCompounds: [
            { state: 2, compounds: ['MnO', 'MnCl₂', 'MnSO₄'] },
            { state: 3, compounds: ['Mn₂O₃', 'MnF₃'] },
            { state: 4, compounds: ['MnO₂'] },
            { state: 6, compounds: ['K₂MnO₄'] },
            { state: 7, compounds: ['KMnO₄', 'Mn₂O₇'] }
        ],
        anomalousBehavior: {
            facts: [
                'Manganese has anomalously low melting point despite having d⁵ configuration',
                'Exhibits largest number of oxidation states in 3d series (from +2 to +7)',
                'E°(M²⁺/M) value is more negative than expected due to extra stability of half-filled d⁵ subshell in Mn²⁺ ion',
                'Mn³⁺ (d⁴) is exceptionally strong oxidising agent because it readily accepts electron to become highly stable Mn²⁺ (d⁵)',
                'Mn₂O₇ is highest oxide and exists as covalent green oil with predominant acidic character',
                'Potassium permanganate (KMnO₄) is dark purple, diamagnetic, and highly potent oxidizing agent',
                'Manganate (K₂MnO₄) is green and paramagnetic'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: '2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂ + 8H₂O',
                conditions: 'Concentrated HCl',
                note: 'Permanganate as strong oxidizing agent'
            },
            {
                equation: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O',
                conditions: 'Acidic medium',
                note: 'Purple MnO₄⁻ → Pink Mn²⁺'
            }
        ],
        trendPosition: 'Maximum oxidation states (+2 to +7) — Mn²⁺ most stable (d⁵), Mn⁷⁺ strong oxidizer',
        hasRichData: true,
        row: 4,
        col: 7
    },
    {
        atomicNumber: 26,
        symbol: 'Fe',
        name: 'Iron',
        atomicMass: 55.845,
        category: 'Transition Metal',
        block: 'd',
        group: 8,
        period: 4,
        electronConfig: '[Ar]3d⁶4s²',
        atomicRadius: 126,
        ionicRadius: 77,
        ionizationEnergy: 762,
        electronegativity: 1.83,
        density: 7.8,
        meltingPoint: 1811,
        boilingPoint: 3134,
        standardReductionPotential: -0.44,
        ionColors: [
            { ion: 'Fe³⁺', config: '3d⁵', color: 'yellow', hexColor: '#F1C40F' },
            { ion: 'Fe²⁺', config: '3d⁶', color: 'green', hexColor: '#27AE60' }
        ],
        compoundsInfo: [
            { formula: 'FeSO₄·7H₂O', color: 'Green (soln)', hexColor: '#27AE60', nature: 'neutral' },
            { formula: 'Fe₂(SO₄)₃', color: 'Yellow (soln)', hexColor: '#F1C40F', nature: 'neutral' }
        ],
        oxides: ['FeO', 'Fe₂O₃', 'Fe₃O₄'],
        halides: ['FeX₂', 'FeF₃', 'FeCl₃', 'FeBr₃'],
        oxideNature: 'basic',
        oxideNatureDetails: 'FeO and Fe₂O₃ are basic oxides; Fe₃O₄ is mixed oxide',
        oxidationStates: [2, 3, 6],
        oxidationStateCompounds: [
            { state: 2, compounds: ['FeO', 'FeCl₂', 'FeSO₄', 'Fe₃H'] },
            { state: 3, compounds: ['Fe₂O₃', 'FeCl₃', 'Fe₂(SO₄)₃'] },
            { state: 6, compounds: ['FeO₄²⁻'] }
        ],
        anomalousBehavior: {
            facts: [
                'Fe³⁺ (d⁵) is extra stable compared to Fe²⁺ (d⁶), making Fe²⁺ relatively easy to oxidize',
                'Forms interstitial compounds like Fe₃H',
                'Highest stable oxide is Fe₂O₃; ferrates (VI) (FeO₄²⁻) can form in alkaline media but readily decompose into Fe₂O₃ and O₂',
                'Finely divided iron is used as catalyst in Haber\'s Process for manufacturing ammonia',
                'Fe³⁺ is yellow and Fe²⁺ is green in aqueous solution'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Fe²⁺ + MnO₄⁻ + H⁺ → Fe³⁺ + Mn²⁺',
                conditions: 'Acidic medium',
                note: 'Fe²⁺ acts as reducing agent'
            },
            {
                equation: 'Fe³⁺ + 3SCN⁻ → Fe(SCN)₃',
                conditions: 'Blood red complex',
                note: 'Confirmatory test for Fe³⁺'
            }
        ],
        trendPosition: 'Common oxidation states +2 and +3 — Fe³⁺ more stable (d⁵ half-filled)',
        hasRichData: true,
        row: 4,
        col: 8
    },
    {
        atomicNumber: 27,
        symbol: 'Co',
        name: 'Cobalt',
        atomicMass: 58.933,
        category: 'Transition Metal',
        block: 'd',
        group: 9,
        period: 4,
        electronConfig: '[Ar]3d⁷4s²',
        atomicRadius: 125,
        ionicRadius: 74,
        ionizationEnergy: 758,
        electronegativity: 1.88,
        density: 8.7,
        meltingPoint: 1768,
        boilingPoint: 3200,
        standardReductionPotential: -0.28,
        ionColors: [
            { ion: 'Co³⁺', config: '3d⁶', color: 'blue', hexColor: '#3498DB' },
            { ion: 'Co²⁺', config: '3d⁷', color: 'pink', hexColor: '#FFB6C1' }
        ],
        oxides: ['CoO', 'Co₃O₄'],
        halides: ['CoX₂', 'CoF₃'],
        oxideNature: 'basic',
        oxideNatureDetails: 'CoO is basic oxide; Co₃O₄ is mixed oxide',
        oxidationStates: [2, 3],
        oxidationStateCompounds: [
            { state: 2, compounds: ['CoO', 'CoCl₂', 'CoSO₄'] },
            { state: 3, compounds: ['Co₂O₃', 'CoF₃'] }
        ],
        anomalousBehavior: {
            facts: [
                'Co³⁺ is very strong oxidising agent in aqueous solution',
                'While Cobalt(II) is stable in aqueous solution, it is easily oxidized in presence of complexing reagents',
                'Highest stable fluoride is CoF₃, which is stabilized by high lattice energy',
                'Co³⁺ is blue and Co²⁺ is pink in aqueous solution'
            ],
            jeeRelevance: 'medium'
        },
        keyReactions: [
            {
                equation: 'Co²⁺ + 2OH⁻ → Co(OH)₂',
                conditions: 'Blue precipitate',
                note: 'Co(OH)₂ turns brown in air (oxidation to Co³⁺)'
            }
        ],
        trendPosition: 'Co²⁺ pink, Co³⁺ blue — Co³⁺ strong oxidizing agent in aqueous solution',
        hasRichData: true,
        row: 4,
        col: 9
    },
    {
        atomicNumber: 28,
        symbol: 'Ni',
        name: 'Nickel',
        atomicMass: 58.693,
        category: 'Transition Metal',
        block: 'd',
        group: 10,
        period: 4,
        electronConfig: '[Ar]3d⁸4s²',
        atomicRadius: 125,
        ionicRadius: 70,
        ionizationEnergy: 736,
        electronegativity: 1.91,
        density: 8.9,
        meltingPoint: 1728,
        boilingPoint: 3186,
        standardReductionPotential: -0.25,
        ionColors: [{ ion: 'Ni²⁺', config: '3d⁸', color: 'green', hexColor: '#27AE60' }],
        oxides: ['NiO'],
        halides: ['NiX₂'],
        oxideNature: 'basic',
        oxideNatureDetails: 'NiO is basic oxide',
        oxidationStates: [0, 2],
        oxidationStateCompounds: [
            { state: 0, compounds: ['Ni(CO)₄'] },
            { state: 2, compounds: ['NiO', 'NiCl₂', 'NiSO₄'] }
        ],
        anomalousBehavior: {
            facts: [
                'E°(M²⁺/M) value is more negative than general trend suggests; attributed to nickel having highest negative enthalpy of hydration',
                'Nickel can exhibit oxidation state of zero when bonded to ligands with π-acceptor character, such as in Ni(CO)₄',
                'Used as catalyst for hydrogenation of fats and polymerization of alkynes',
                'Ni²⁺ is green in aqueous solution'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Ni + 4CO → Ni(CO)₄',
                conditions: '50-60°C',
                note: 'Mond process for Ni purification - volatile Ni(CO)₄'
            },
            {
                equation: 'Ni²⁺ + 2DMG → Ni(DMG)₂↓',
                conditions: 'Dimethylglyoxime test',
                note: 'Bright red precipitate - confirmatory test for Ni²⁺'
            }
        ],
        trendPosition: 'Predominantly +2 oxidation state — green Ni²⁺, forms Ni(CO)₄',
        hasRichData: true,
        row: 4,
        col: 10
    },
    {
        atomicNumber: 29,
        symbol: 'Cu',
        name: 'Copper',
        atomicMass: 63.546,
        category: 'Transition Metal',
        block: 'd',
        group: 11,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s¹',
        atomicRadius: 128,
        ionicRadius: 73,
        ionizationEnergy: 745,
        electronegativity: 1.90,
        density: 8.9,
        meltingPoint: 1358,
        boilingPoint: 2835,
        standardReductionPotential: 0.34,
        flameColor: { color: 'Blue/Green', hexColor: '#00CED1' },
        ionColors: [
            { ion: 'Cu²⁺', config: '3d⁹', color: 'blue', hexColor: '#3498DB' },
            { ion: 'Cu⁺', config: '3d¹⁰', color: 'colourless', hexColor: 'transparent' }
        ],
        compoundsInfo: [
            { formula: 'CuSO₄·5H₂O', color: 'Blue', hexColor: '#3498DB', nature: 'neutral' }
        ],
        oxides: ['Cu₂O', 'CuO'],
        halides: ['CuCl', 'CuBr', 'CuI', 'CuF₂', 'CuCl₂'],
        oxideNature: 'basic',
        oxideNatureDetails: 'Cu₂O and CuO are basic oxides',
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Cu has anomalous 3d¹⁰ 4s¹ configuration instead of 3d⁹ 4s² for fully-filled d-orbital stability',
        oxidationStates: [1, 2],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Cu₂O', 'CuCl', 'CuI'] },
            { state: 2, compounds: ['CuO', 'CuSO₄', 'CuCl₂'] }
        ],
        anomalousBehavior: {
            facts: [
                'Has anomalous 3d¹⁰ 4s¹ configuration for fully-filled d-orbital stability',
                'Copper is only 3d metal with positive E°(M²⁺/M) value (+0.34 V) — cannot liberate H₂ from non-oxidizing acids',
                'High energy required to transform Cu(s) to Cu²⁺(aq) (atomization + ionization) is not balanced by hydration enthalpy',
                'Only reacts with oxidizing acids like nitric acid and hot conc. sulphuric acid',
                'Cu⁺ ion is unstable in aqueous solution and undergoes disproportionation into Cu²⁺ and Cu(s)',
                '+2 state is much more stable due to highly negative hydration enthalpy of Cu²⁺(aq)',
                'Cu²⁺ is blue in aqueous solution'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Cu²⁺ + 4NH₃ → [Cu(NH₃)₄]²⁺',
                conditions: 'Deep blue complex',
                note: 'Tetraamminecopper(II) complex'
            },
            {
                equation: '2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂',
                conditions: 'Iodometric titration',
                note: 'White CuI precipitate + brown I₂'
            }
        ],
        trendPosition: 'Full d¹⁰ stability — Cu²⁺ more stable than Cu⁺, blue CuSO₄·5H₂O',
        hasRichData: true,
        row: 4,
        col: 11
    },
    {
        atomicNumber: 30,
        symbol: 'Zn',
        name: 'Zinc',
        atomicMass: 65.38,
        category: 'Transition Metal',
        block: 'd',
        group: 12,
        period: 4,
        electronConfig: '[Ar]3d¹⁰4s²',
        atomicRadius: 137,
        ionicRadius: 75,
        ionizationEnergy: 906,
        electronegativity: 1.65,
        density: 7.1,
        meltingPoint: 693,
        boilingPoint: 1180,
        standardReductionPotential: -0.76,
        ionColors: [{ ion: 'Zn²⁺', config: '3d¹⁰', color: 'colourless', hexColor: 'transparent' }],
        oxides: ['ZnO'],
        halides: ['ZnX₂'],
        oxideNature: 'amphoteric',
        oxideNatureDetails: 'ZnO is amphoteric - dissolves in both acids and alkalis',
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['ZnO', 'ZnCl₂', 'ZnSO₄'] }
        ],
        anomalousBehavior: {
            facts: [
                'Zinc is not regarded as transition element because it has completely filled d¹⁰ configuration in both ground state and common +2 oxidation state',
                'Has lowest enthalpy of atomization in 3d series (126 kJ mol⁻¹) because no d-orbital electrons are involved in metallic bonding',
                'Exhibits only +2 oxidation state',
                'Zn²⁺ (3d¹⁰) is colourless in aqueous solution'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'ZnO + 2HCl → ZnCl₂ + H₂O',
                conditions: 'Acidic medium',
                note: 'ZnO dissolves in acids'
            },
            {
                equation: 'ZnO + 2NaOH → Na₂ZnO₂ + H₂O',
                conditions: 'Basic medium',
                note: 'ZnO dissolves in alkalis (amphoteric)'
            }
        ],
        trendPosition: 'Only +2 oxidation state — colorless Zn²⁺ (d¹⁰), amphoteric ZnO',
        hasRichData: true,
        row: 4,
        col: 12
    },

    // Period 5 - s and p block - NCERT values
    {
        atomicNumber: 37,
        symbol: 'Rb',
        name: 'Rubidium',
        atomicMass: 85.47,
        category: 'Alkali Metal',
        block: 's',
        group: 1,
        period: 5,
        electronConfig: '[Kr]5s¹',
        atomicRadius: 248,
        ionicRadius: 152,
        ionizationEnergy: 403,
        electronegativity: 0.82,
        electronAffinity: -47,
        density: 1.53,
        meltingPoint: 312,
        boilingPoint: 961,
        standardReductionPotential: -2.930,
        flameColor: { color: 'Pink/red', hexColor: '#FF69B4' },
        oxides: ['Rb₂O', 'RbO₂'],
        oxideNature: 'basic',
        oxidationStates: [1],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Rb₂O', 'RbO₂', 'RbOH', 'RbCl', 'Rb₂CO₃'] }
        ],
        keyReactions: [
            {
                equation: 'Rb + O₂ → RbO₂',
                conditions: 'Excess oxygen',
                note: 'Forms superoxide like K and Cs'
            },
            {
                equation: '2Rb + 2H₂O → 2RbOH + H₂↑',
                conditions: 'Explosive reaction',
                note: 'Extremely reactive with water'
            }
        ],
        trendPosition: 'Fourth alkali metal — pink/red flame, very reactive, forms superoxide',
        row: 5,
        col: 1
    },
    {
        atomicNumber: 38,
        symbol: 'Sr',
        name: 'Strontium',
        atomicMass: 87.62,
        category: 'Alkaline Earth Metal',
        block: 's',
        group: 2,
        period: 5,
        electronConfig: '[Kr]5s²',
        atomicRadius: 215,
        ionicRadius: 118,
        ionizationEnergy: 549,
        electronegativity: 0.95,
        density: 2.63,
        meltingPoint: 1050,
        boilingPoint: 1655,
        standardReductionPotential: -2.89,
        flameColor: { color: 'Crimson red', hexColor: '#DC143C' },
        oxides: ['SrO'],
        oxideNature: 'basic',
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['SrO', 'Sr(OH)₂', 'SrCl₂', 'SrCO₃', 'SrSO₄'] }
        ],
        keyReactions: [
            {
                equation: 'Sr + 2H₂O → Sr(OH)₂ + H₂↑',
                conditions: 'Cold water',
                note: 'Reacts vigorously with cold water'
            },
            {
                equation: 'SrCO₃ → SrO + CO₂',
                conditions: 'Heat',
                note: 'Carbonate decomposes at high temperature'
            }
        ],
        trendPosition: 'Fourth alkaline earth metal — crimson red flame, similar reactivity to Ca',
        row: 5,
        col: 2
    },
    {
        atomicNumber: 55,
        symbol: 'Cs',
        name: 'Cesium',
        atomicMass: 132.91,
        category: 'Alkali Metal',
        block: 's',
        group: 1,
        period: 6,
        electronConfig: '[Xe]6s¹',
        atomicRadius: 265,
        ionicRadius: 167,
        ionizationEnergy: 376,
        electronegativity: 0.79,
        electronAffinity: -46,
        density: 1.90,
        meltingPoint: 302,
        boilingPoint: 944,
        standardReductionPotential: -2.923,
        flameColor: { color: 'Blue/violet', hexColor: '#8A2BE2' },
        oxides: ['Cs₂O', 'CsO₂'],
        oxideNature: 'basic',
        oxidationStates: [1],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Cs₂O', 'CsO₂', 'CsOH', 'CsCl', 'Cs₂CO₃'] }
        ],
        keyReactions: [
            {
                equation: 'Cs + O₂ → CsO₂',
                conditions: 'Excess oxygen',
                note: 'Forms superoxide, most reactive alkali metal'
            },
            {
                equation: '2Cs + 2H₂O → 2CsOH + H₂↑',
                conditions: 'Explosive reaction',
                note: 'Most reactive alkali metal with water - explodes on contact'
            }
        ],
        trendPosition: 'Largest alkali metal — lowest IE (376 kJ/mol), most reactive, blue/violet flame',
        row: 6,
        col: 1
    },
    {
        atomicNumber: 56,
        symbol: 'Ba',
        name: 'Barium',
        atomicMass: 137.33,
        category: 'Alkaline Earth Metal',
        block: 's',
        group: 2,
        period: 6,
        electronConfig: '[Xe]6s²',
        atomicRadius: 222,
        ionicRadius: 135,
        ionizationEnergy: 503,
        electronegativity: 0.89,
        density: 3.51,
        meltingPoint: 1000,
        boilingPoint: 2170,
        standardReductionPotential: -2.91,
        flameColor: { color: 'Yellow-green', hexColor: '#9ACD32' },
        oxides: ['BaO'],
        oxideNature: 'basic',
        compoundsInfo: [
            { formula: 'BaSO₄', color: 'White', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'BaCrO₄', color: 'Yellow', hexColor: '#FFFF00', nature: 'neutral' },
            { formula: 'BaCO₃', color: 'White', hexColor: '#FFFFFF', nature: 'basic' }
        ],
        oxidationStates: [2],
        oxidationStateCompounds: [
            { state: 2, compounds: ['BaO', 'Ba(OH)₂', 'BaCl₂', 'BaCO₃', 'BaSO₄', 'BaCrO₄'] }
        ],
        keyReactions: [
            {
                equation: 'Ba + 2H₂O → Ba(OH)₂ + H₂↑',
                conditions: 'Cold water',
                note: 'Reacts vigorously with cold water'
            },
            {
                equation: 'Ba²⁺ + SO₄²⁻ → BaSO₄↓',
                conditions: 'Aqueous solution',
                note: 'White precipitate - confirmatory test for Ba²⁺ or SO₄²⁻'
            },
            {
                equation: 'Ba²⁺ + CrO₄²⁻ → BaCrO₄↓',
                conditions: 'Aqueous solution',
                note: 'Yellow precipitate - test for Ba²⁺'
            }
        ],
        trendPosition: 'Largest alkaline earth metal — yellow-green flame, very reactive, BaSO₄ used in medical imaging',
        row: 6,
        col: 2
    },

    // Period 5 - d-block (4d series)
    { atomicNumber: 39, symbol: 'Y', name: 'Yttrium', atomicMass: 88.906, category: 'Transition Metal', block: 'd', group: 3, period: 5, electronConfig: '[Kr]4d¹5s²', atomicRadius: 212, ionizationEnergy: 600, electronegativity: 1.22, density: 4.47, meltingPoint: 1799, boilingPoint: 3609, row: 5, col: 3 },
    { atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: 91.224, category: 'Transition Metal', block: 'd', group: 4, period: 5, electronConfig: '[Kr]4d²5s²', atomicRadius: 206, ionizationEnergy: 640, electronegativity: 1.33, density: 6.51, meltingPoint: 2128, boilingPoint: 4682, row: 5, col: 4 },
    { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: 92.906, category: 'Transition Metal', block: 'd', group: 5, period: 5, electronConfig: '[Kr]4d⁴5s¹', atomicRadius: 198, ionizationEnergy: 652, electronegativity: 1.60, density: 8.57, meltingPoint: 2750, boilingPoint: 5017, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Nb has 4d⁴5s¹ instead of 4d³5s² for extra stability', row: 5, col: 5 },
    { atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: 95.95, category: 'Transition Metal', block: 'd', group: 6, period: 5, electronConfig: '[Kr]4d⁵5s¹', atomicRadius: 190, ionizationEnergy: 684, electronegativity: 2.16, density: 10.28, meltingPoint: 2896, boilingPoint: 4912, compoundsInfo: [{ formula: '(NH₄)₃[As(Mo₃O₁₀)₄]', color: 'Canary Yellow', hexColor: '#FFEF00', nature: 'neutral' }, { formula: '(NH₄)₃[P(Mo₃O₁₀)₄]', color: 'Canary Yellow', hexColor: '#FFEF00', nature: 'neutral' }], isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Mo has 4d⁵5s¹ (like Cr) for half-filled d-orbital stability', row: 5, col: 6 },
    { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: 98, category: 'Transition Metal', block: 'd', group: 7, period: 5, electronConfig: '[Kr]4d⁵5s²', atomicRadius: 183, ionizationEnergy: 702, electronegativity: 1.90, density: 11.50, meltingPoint: 2430, boilingPoint: 4538, row: 5, col: 7 },
    { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: 101.07, category: 'Transition Metal', block: 'd', group: 8, period: 5, electronConfig: '[Kr]4d⁷5s¹', atomicRadius: 178, ionizationEnergy: 710, electronegativity: 2.20, density: 12.37, meltingPoint: 2607, boilingPoint: 4423, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Expected [Kr]4d⁶5s². Actual [Kr]4d⁷5s¹ due to very small 4d-5s energy gap and e⁻-e⁻ repulsion in 5s.', row: 5, col: 8 },
    { atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: 102.91, category: 'Transition Metal', block: 'd', group: 9, period: 5, electronConfig: '[Kr]4d⁸5s¹', atomicRadius: 173, ionizationEnergy: 720, electronegativity: 2.28, density: 12.41, meltingPoint: 2237, boilingPoint: 3968, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Expected [Kr]4d⁷5s². Actual [Kr]4d⁸5s¹ as 4d orbital drops below 5s in energy, favoring d-electron population.', row: 5, col: 9 },
    { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: 106.42, category: 'Transition Metal', block: 'd', group: 10, period: 5, electronConfig: '[Kr]4d¹⁰', atomicRadius: 169, ionizationEnergy: 804, electronegativity: 2.20, density: 12.02, meltingPoint: 1828, boilingPoint: 3236, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Pd has 4d¹⁰5s⁰ - unique case with no s electrons for complete d-orbital stability', anomalousBehavior: { facts: ['PdCl₂ is important catalyst used in Wacker process for oxidation of ethyne to ethanal', 'Unique electronic configuration with no 5s electrons'], jeeRelevance: 'high' }, row: 5, col: 10 },
    { atomicNumber: 47, symbol: 'Ag', name: 'Silver', atomicMass: 107.87, category: 'Transition Metal', block: 'd', group: 11, period: 5, electronConfig: '[Kr]4d¹⁰5s¹', atomicRadius: 165, ionizationEnergy: 731, electronegativity: 1.93, density: 10.49, meltingPoint: 1235, boilingPoint: 2435, standardReductionPotential: 0.80, compoundsInfo: [{ formula: 'AgI', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'neutral' }, { formula: 'Ag₂S', color: 'Black', hexColor: '#1A1A1A', nature: 'neutral' }, { formula: 'AgCl', color: 'White', hexColor: '#FFFFFF', nature: 'neutral' }, { formula: 'AgBr', color: 'Pale Yellow', hexColor: '#FFFACD', nature: 'neutral' }], isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Ag has 4d¹⁰5s¹ (like Cu) for fully-filled d-orbital stability', anomalousBehavior: { facts: ['Silver is considered a transition element because, while it has 4d¹⁰ ground state, it exhibits incompletely filled d-orbitals in its +2 oxidation state', 'Silver bromide (AgBr) is crucial for its light-sensitive properties in photographic industry'], jeeRelevance: 'high' }, row: 5, col: 11 },
    { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: 112.41, category: 'Transition Metal', block: 'd', group: 12, period: 5, electronConfig: '[Kr]4d¹⁰5s²', atomicRadius: 161, ionizationEnergy: 868, electronegativity: 1.69, density: 8.65, meltingPoint: 594, boilingPoint: 1040, standardReductionPotential: -0.40, compoundsInfo: [{ formula: 'CdS', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'neutral' }], row: 5, col: 12 },

    // Period 6 - d-block (5d series) - key elements
    { atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: 178.49, category: 'Transition Metal', block: 'd', group: 4, period: 6, electronConfig: '[Xe]4f¹⁴5d²6s²', atomicRadius: 208, ionizationEnergy: 659, electronegativity: 1.30, density: 13.31, meltingPoint: 2506, boilingPoint: 4876, row: 6, col: 4 },
    { atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: 183.84, category: 'Transition Metal', block: 'd', group: 6, period: 6, electronConfig: '[Xe]4f¹⁴5d⁴6s²', atomicRadius: 193, ionizationEnergy: 770, electronegativity: 2.36, density: 19.25, meltingPoint: 3695, boilingPoint: 5828, row: 6, col: 6 },
    { atomicNumber: 78, symbol: 'Pt', name: 'Platinum', atomicMass: 195.08, category: 'Transition Metal', block: 'd', group: 10, period: 6, electronConfig: '[Xe]4f¹⁴5d⁹6s¹', atomicRadius: 177, ionizationEnergy: 870, electronegativity: 2.28, density: 21.45, meltingPoint: 2041, boilingPoint: 4098, standardReductionPotential: 1.18, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Pt has 5d⁹6s¹ instead of 5d⁸6s² for better orbital stability', row: 6, col: 10 },
    { atomicNumber: 79, symbol: 'Au', name: 'Gold', atomicMass: 196.97, category: 'Transition Metal', block: 'd', group: 11, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s¹', atomicRadius: 174, ionizationEnergy: 890, electronegativity: 2.54, density: 19.30, meltingPoint: 1337, boilingPoint: 3129, standardReductionPotential: 1.69, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Au has 5d¹⁰6s¹ (like Cu, Ag) for fully-filled d-orbital stability', row: 6, col: 11 },
    { atomicNumber: 80, symbol: 'Hg', name: 'Mercury', atomicMass: 200.59, category: 'Transition Metal', block: 'd', group: 12, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²', atomicRadius: 171, ionizationEnergy: 1007, electronegativity: 2.00, density: 13.55, meltingPoint: 234, boilingPoint: 630, standardReductionPotential: 0.85, isException: true, exceptionType: 'Physical Property', exceptionExplanation: 'Hg is liquid at room temperature - only liquid metal due to relativistic effects', row: 6, col: 12 },

    // Lanthanides (f-block) - Row 8 - NCERT values with exam-focused data
    { atomicNumber: 57, symbol: 'La', name: 'Lanthanum', atomicMass: 138.91, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]5d¹6s²', atomicRadius: 187, ionConfigs: { M2plus: '5d¹', M3plus: '4f⁰' }, ionicRadii: { M3plus: 106 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Empty 4f (4f⁰ in La³⁺)', row: 8, col: 3 },
    { atomicNumber: 58, symbol: 'Ce', name: 'Cerium', atomicMass: 140.12, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹5d¹6s²', atomicRadius: 183, ionConfigs: { M2plus: '4f²', M3plus: '4f¹', M4plus: '4f⁰' }, ionicRadii: { M3plus: 103, M4plus: 92 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Ce⁴⁺ has 4f⁰ (noble gas config)', redoxNature: 'oxidizing', redoxExplanation: 'Ce⁴⁺ is strong oxidant (E°=+1.74V), reverts to stable +3 state', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Ce shows +4 due to noble gas configuration (4f⁰)', anomalousBehavior: { facts: ['Cerium can exhibit +4 oxidation state because losing four electrons leaves it with highly stable f⁰ noble gas configuration', 'Despite stability of configuration, Ce⁴⁺ is strong oxidant (E° = +1.74 V) that reverts back to common +3 state', 'Because its reaction rate with water is slow, it serves as excellent analytical reagent'], jeeRelevance: 'high' }, hasRichData: true, row: 8, col: 4 },
    { atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: 140.91, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f³6s²', atomicRadius: 182, ionConfigs: { M3plus: '4f²', M4plus: '4f¹' }, ionicRadii: { M3plus: 101 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides (PrO₂)', row: 8, col: 5 },
    { atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: 144.24, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁴6s²', atomicRadius: 181, ionConfigs: { M3plus: '4f³', M4plus: '4f²' }, ionicRadii: { M3plus: 99 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides (NdO₂)', row: 8, col: 6 },
    { atomicNumber: 61, symbol: 'Pm', name: 'Promethium', atomicMass: 145, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁵6s²', atomicRadius: 181, ionConfigs: { M3plus: '4f⁴' }, ionicRadii: { M3plus: 98 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Radioactive, no stable isotopes', row: 8, col: 7 },
    { atomicNumber: 62, symbol: 'Sm', name: 'Samarium', atomicMass: 150.36, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁶6s²', atomicRadius: 180, ionConfigs: { M2plus: '4f⁶', M3plus: '4f⁵' }, ionicRadii: { M3plus: 96 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Sm²⁺ (4f⁶) like Eu exhibits +2 state', redoxNature: 'reducing', redoxExplanation: 'Sm²⁺ reduces to Sm³⁺, behavior like Europium', row: 8, col: 8 },
    { atomicNumber: 63, symbol: 'Eu', name: 'Europium', atomicMass: 151.96, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁷ 6s²', atomicRadius: 199, ionConfigs: { M2plus: '4f⁷', M3plus: '4f⁶' }, ionicRadii: { M3plus: 95 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Half-filled 4f⁷ in Eu²⁺', redoxNature: 'reducing', redoxExplanation: 'Eu²⁺ is strong reducing agent → changes to +3. 4f⁷ half-filled stability', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Eu shows +2 due to half-filled 4f⁷ configuration stability', anomalousBehavior: { facts: ['Both elements show abnormalities in density and other properties', 'Europium frequently exhibits +2 oxidation state due to stability of its half-filled f⁷ configuration', 'Ytterbium also forms +2 ions due to its completely filled f¹⁴ configuration', 'Because +3 state is standard for lanthanoids, both Eu²⁺ and Yb²⁺ act as strong reducing agents in order to revert to +3 state'], jeeRelevance: 'high' }, hasRichData: true, row: 8, col: 9 },
    { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: 157.25, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁷5d¹6s²', atomicRadius: 180, ionConfigs: { M3plus: '4f⁷' }, ionicRadii: { M3plus: 94 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Half-filled 4f⁷ in Gd³⁺', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Gd has 4f⁷5d¹6s² (not 4f⁸6s²) for half-filled f-orbital stability', row: 8, col: 10 },
    { atomicNumber: 65, symbol: 'Tb', name: 'Terbium', atomicMass: 158.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁹6s²', atomicRadius: 178, ionConfigs: { M3plus: '4f⁸', M4plus: '4f⁷' }, ionicRadii: { M3plus: 92, M4plus: 76 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Tb⁴⁺ has half-filled 4f⁷', redoxNature: 'oxidizing', redoxExplanation: 'Tb⁴⁺ is oxidant due to half-filled 4f⁷ stability in Tb⁴⁺', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Tb shows +4 to achieve half-filled 4f⁷ configuration', row: 8, col: 11 },
    { atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: 162.50, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹⁰6s²', atomicRadius: 177, ionConfigs: { M3plus: '4f⁹', M4plus: '4f⁸' }, ionicRadii: { M3plus: 91, M4plus: 78 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides', row: 8, col: 12 },
    { atomicNumber: 67, symbol: 'Ho', name: 'Holmium', atomicMass: 164.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹¹6s²', atomicRadius: 176, ionConfigs: { M3plus: '4f¹⁰' }, ionicRadii: { M3plus: 89 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 13 },
    { atomicNumber: 68, symbol: 'Er', name: 'Erbium', atomicMass: 167.26, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹²6s²', atomicRadius: 175, ionConfigs: { M3plus: '4f¹¹' }, ionicRadii: { M3plus: 88 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 14 },
    { atomicNumber: 69, symbol: 'Tm', name: 'Thulium', atomicMass: 168.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹³6s²', atomicRadius: 174, ionConfigs: { M3plus: '4f¹²' }, ionicRadii: { M3plus: 87 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 15 },
    { atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: 173.05, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹⁴ 6s²', atomicRadius: 173, ionConfigs: { M2plus: '4f¹⁴', M3plus: '4f¹³' }, ionicRadii: { M3plus: 86 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Full-filled 4f¹⁴ in Yb²⁺', redoxNature: 'reducing', redoxExplanation: 'Yb²⁺ is reducing agent due to fully-filled 4f¹⁴ stability', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Yb shows +2 due to fully-filled 4f¹⁴ stability', anomalousBehavior: { facts: ['Ytterbium also forms +2 ions due to its completely filled f¹⁴ configuration', 'Both Eu²⁺ and Yb²⁺ act as strong reducing agents to revert to +3 state'], jeeRelevance: 'high' }, hasRichData: true, row: 8, col: 16 },
    { atomicNumber: 71, symbol: 'Lu', name: 'Lutetium', atomicMass: 174.97, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹⁴5d¹6s²', ionConfigs: { M3plus: '4f¹⁴' }, ionicRadii: { M3plus: 85 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Lu³⁺ has fully-filled 4f¹⁴', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Lu has d-electron due to 4f being fully filled', row: 8, col: 17 },
    // Actinides (f-block) - Row 9 - NCERT values with exam-focused data
    { atomicNumber: 89, symbol: 'Ac', name: 'Actinium', atomicMass: 227, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]6d¹7s²', ionConfigs: { M3plus: '5f⁰' }, ionicRadii: { M3plus: 111 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Empty 5f (5f⁰ in Ac³⁺)', row: 9, col: 3 },
    { atomicNumber: 90, symbol: 'Th', name: 'Thorium', atomicMass: 232.04, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]6d²7s²', ionConfigs: { M3plus: '5f¹', M4plus: '5f⁰' }, ionicRadii: { M3plus: 99, M4plus: 94 }, oxidationStates: [3, 4], stableOxidationState: 4, fSubshellInfo: 'Th⁴⁺ has 5f⁰ (Rn core)', row: 9, col: 4 },
    { atomicNumber: 91, symbol: 'Pa', name: 'Protactinium', atomicMass: 231.04, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f²6d¹7s²', ionConfigs: { M3plus: '5f²', M4plus: '5f¹' }, ionicRadii: { M3plus: 96 }, oxidationStates: [3, 4, 5], stableOxidationState: 5, row: 9, col: 5 },
    { atomicNumber: 92, symbol: 'U', name: 'Uranium', atomicMass: 238.03, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f³6d¹7s²', ionConfigs: { M3plus: '5f³', M4plus: '5f²' }, ionicRadii: { M3plus: 103, M4plus: 93 }, oxidationStates: [3, 4, 5, 6], stableOxidationState: 6, fSubshellInfo: 'Multiple oxidation states (+3 to +6)', row: 9, col: 6 },
    { atomicNumber: 93, symbol: 'Np', name: 'Neptunium', atomicMass: 237, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f⁴6d¹7s²', ionConfigs: { M3plus: '5f⁴', M4plus: '5f³' }, ionicRadii: { M3plus: 101, M4plus: 92 }, oxidationStates: [3, 4, 5, 6, 7], stableOxidationState: 5, fSubshellInfo: 'Wide range of oxidation states', row: 9, col: 7 },
    { atomicNumber: 94, symbol: 'Pu', name: 'Plutonium', atomicMass: 244, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f⁶7s²', ionConfigs: { M3plus: '5f⁵', M4plus: '5f⁴' }, ionicRadii: { M3plus: 100, M4plus: 90 }, oxidationStates: [3, 4, 5, 6, 7], stableOxidationState: 4, fSubshellInfo: 'Wide range of oxidation states', row: 9, col: 8 },
    { atomicNumber: 95, symbol: 'Am', name: 'Americium', atomicMass: 243, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f⁷7s²', ionConfigs: { M3plus: '5f⁶', M4plus: '5f⁵' }, ionicRadii: { M3plus: 99, M4plus: 89 }, oxidationStates: [3, 4, 5, 6], stableOxidationState: 3, fSubshellInfo: 'Am³⁺ common, analogous to Eu', row: 9, col: 9 },
    { atomicNumber: 96, symbol: 'Cm', name: 'Curium', atomicMass: 247, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f⁷6d¹7s²', ionConfigs: { M3plus: '5f⁷' }, ionicRadii: { M3plus: 99, M4plus: 88 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Half-filled 5f⁷ in Cm³⁺ (like Gd³⁺)', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Cm has 5f⁷6d¹7s² for half-filled f-orbital stability (like Gd)', row: 9, col: 10 },
    { atomicNumber: 97, symbol: 'Bk', name: 'Berkelium', atomicMass: 247, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f⁹7s²', ionConfigs: { M3plus: '5f⁸', M4plus: '5f⁷' }, ionicRadii: { M3plus: 98, M4plus: 87 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Bk⁴⁺ achieves half-filled 5f⁷', row: 9, col: 11 },
    { atomicNumber: 98, symbol: 'Cf', name: 'Californium', atomicMass: 251, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹⁰7s²', ionConfigs: { M3plus: '5f⁹', M4plus: '5f⁸' }, ionicRadii: { M3plus: 98, M4plus: 86 }, oxidationStates: [3], stableOxidationState: 3, row: 9, col: 12 },
    { atomicNumber: 99, symbol: 'Es', name: 'Einsteinium', atomicMass: 252, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹¹7s²', ionConfigs: { M3plus: '5f¹⁰', M4plus: '5f⁹' }, oxidationStates: [3], stableOxidationState: 3, row: 9, col: 13 },
    { atomicNumber: 100, symbol: 'Fm', name: 'Fermium', atomicMass: 257, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹²7s²', ionConfigs: { M3plus: '5f¹¹', M4plus: '5f¹⁰' }, oxidationStates: [3], stableOxidationState: 3, row: 9, col: 14 },
    { atomicNumber: 101, symbol: 'Md', name: 'Mendelevium', atomicMass: 258, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹³7s²', ionConfigs: { M3plus: '5f¹²', M4plus: '5f¹¹' }, oxidationStates: [3], stableOxidationState: 3, row: 9, col: 15 },
    { atomicNumber: 102, symbol: 'No', name: 'Nobelium', atomicMass: 259, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹⁴7s²', ionConfigs: { M3plus: '5f¹³', M4plus: '5f¹²' }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Fully-filled 5f¹⁴ in No (like Yb)', row: 9, col: 16 },
    { atomicNumber: 103, symbol: 'Lr', name: 'Lawrencium', atomicMass: 266, category: 'Actinide', block: 'f', group: 3, period: 7, electronConfig: '[Rn]5f¹⁴6d¹7s²', ionConfigs: { M3plus: '5f¹⁴' }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Lr³⁺ has fully-filled 5f¹⁴ (like Lu³⁺)', row: 9, col: 17 },
    // Period 7 - s block
    { atomicNumber: 87, symbol: 'Fr', name: 'Francium', atomicMass: 223, category: 'Alkali Metal', block: 's', group: 1, period: 7, electronConfig: '[Rn]7s¹', atomicRadius: 348, ionizationEnergy: 380, electronegativity: 0.70, density: 1.87, meltingPoint: 300, boilingPoint: 950, row: 7, col: 1 },
    { atomicNumber: 88, symbol: 'Ra', name: 'Radium', atomicMass: 226, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 7, electronConfig: '[Rn]7s²', atomicRadius: 283, ionizationEnergy: 509, electronegativity: 0.90, density: 5.50, meltingPoint: 973, boilingPoint: 2010, row: 7, col: 2 },
];

// Helper functions for property-based coloring
export function getPropertyValue(element: Element, property: string): number | undefined {
    switch (property) {
        case 'atomicRadius': return element.atomicRadius;
        case 'ionicRadius': return element.ionicRadius;
        case 'ionizationEnergy': return element.ionizationEnergy;
        case 'electronegativity': return element.electronegativity;
        case 'electronAffinity': return element.electronAffinity;
        case 'density': return element.density;
        case 'meltingPoint': return element.meltingPoint;
        case 'boilingPoint': return element.boilingPoint;
        case 'standardReductionPotential': return element.standardReductionPotential;
        default: return undefined;
    }
}

export function getPropertyRange(property: string): { min: number; max: number } {
    const values = ELEMENTS
        .map(e => getPropertyValue(e, property))
        .filter((v): v is number => v !== undefined);
    return { min: Math.min(...values), max: Math.max(...values) };
}

export function getColorForValue(value: number, min: number, max: number): string {
    const normalized = (value - min) / (max - min);
    // Gradient from blue (low) to yellow (mid) to red (high)
    if (normalized < 0.5) {
        const t = normalized * 2;
        return `hsl(${210 - t * 150}, 80%, ${50 + t * 10}%)`;
    } else {
        const t = (normalized - 0.5) * 2;
        return `hsl(${60 - t * 60}, 80%, ${60 - t * 10}%)`;
    }
}

export const PROPERTY_INFO: Record<string, { name: string; unit: string; trendDescription: string }> = {
    atomicRadius: { name: 'Atomic Radius', unit: 'pm', trendDescription: '← decreases across period, ↓ increases down group' },
    ionicRadius: { name: 'Ionic Radius', unit: 'pm', trendDescription: 'Varies with charge - cations smaller, anions larger' },
    ionizationEnergy: { name: 'Ionization Energy', unit: 'kJ/mol', trendDescription: '→ increases across period, ↑ decreases down group' },
    electronegativity: { name: 'Electronegativity', unit: 'Pauling', trendDescription: '→ increases across period, ↑ decreases down group' },
    electronAffinity: { name: 'Electron Affinity', unit: 'kJ/mol', trendDescription: 'Generally → increases across, ↑ decreases down (exceptions exist)' },
    density: { name: 'Density', unit: 'g/cm³', trendDescription: 'Complex - peaks at transition metals (Os, Ir highest)' },
    meltingPoint: { name: 'Melting Point', unit: 'K', trendDescription: 'Complex - peaks at Group 6 (W highest), varies by bonding' },
    boilingPoint: { name: 'Boiling Point', unit: 'K', trendDescription: 'Similar to melting point trends' },
    standardReductionPotential: { name: 'Standard Reduction Potential', unit: 'V', trendDescription: 'Higher = stronger oxidizing agent (F₂ highest)' },
};

export const EXCEPTION_TYPES = [
    'Electron Configuration',
    'Ionization Energy',
    'Electron Affinity',
    'Inert Pair Effect',
    'Physical Property',
    'Melting Point',
    'Oxidation State',
];
