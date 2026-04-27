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
                equation: 'Fe³⁺ + SCN⁻ → [Fe(SCN)]²⁺',
                conditions: 'Dilute HNO₃ medium',
                note: 'Blood red complex — confirmatory test for Fe³⁺ in salt analysis'
            },
            {
                equation: 'Fe³⁺ + K₄[Fe(CN)₆] → Fe₄[Fe(CN)₆]₃↓',
                conditions: 'Prussian blue test',
                note: 'Dark blue precipitate — confirmatory test for Fe³⁺; K₄[Fe(CN)₆] = potassium hexacyanoferrate(II)'
            },
            {
                equation: 'Fe²⁺ + K₃[Fe(CN)₆] → KFe[Fe(CN)₆]↓',
                conditions: 'Turnbull\'s blue test',
                note: 'Dark blue precipitate — confirmatory test for Fe²⁺; K₃[Fe(CN)₆] = potassium hexacyanoferrate(III)'
            },
            {
                equation: 'Fe²⁺ + 2OH⁻ → Fe(OH)₂↓',
                conditions: 'White/dirty green ppt, turns rust brown in air',
                note: 'Fe(OH)₂ oxidises in air → Fe(OH)₃ (rust brown) — indicates Fe²⁺ → Fe³⁺'
            }
        ],
        compoundsInfo: [
            { formula: 'K₄[Fe(CN)₆]', color: 'Yellow (soln)', hexColor: '#F0E68C', nature: 'neutral' },
            { formula: 'K₃[Fe(CN)₆]', color: 'Orange-red (soln)', hexColor: '#FF6347', nature: 'neutral' },
            { formula: 'Fe₄[Fe(CN)₆]₃', color: 'Prussian Blue (ppt)', hexColor: '#003153', nature: 'neutral' },
            { formula: 'FeSO₄·7H₂O', color: 'Green (crystals)', hexColor: '#27AE60', nature: 'neutral' }
        ],
        trendPosition: 'Common oxidation states +2 and +3 — Fe³⁺ more stable (d⁵); Prussian blue/Turnbull\'s blue salt analysis tests',
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
                'Co³⁺ is very strong oxidising agent in aqueous solution — yet Co(III) complexes are the most stable and substitution-inert in coordination chemistry',
                'Co(II) is the stable oxidation state in simple salts; Co(III) is stabilised by strong-field ligands like NH₃, en, CN⁻ which cause spin pairing',
                'Werner\'s coordination theory was developed primarily from cobalt(III) complexes: CoCl₃·6NH₃ = [Co(NH₃)₆]Cl₃, CoCl₃·5NH₃ = [Co(NH₃)₅Cl]Cl₂, CoCl₃·4NH₃ = [Co(NH₃)₄Cl₂]Cl',
                'CoCl₂ is used as a humidity indicator — anhydrous CoCl₂ is blue (4-coordinate, tetrahedral [CoCl₄]²⁻); hydrated CoCl₂·6H₂O is pink (6-coordinate, octahedral [Co(H₂O)₆]²⁺)',
                '[Co(en)₃]³⁺ (tris(ethylenediamine)cobalt(III)) is the classic NCERT example of optical isomerism — exists as non-superimposable mirror images (Δ and Λ forms)',
                '[CoCl₂(en)₂]⁺ shows both geometric isomerism (cis and trans) and optical isomerism (cis form is chiral)'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Co²⁺ + 2OH⁻ → Co(OH)₂↓',
                conditions: 'Blue precipitate in salt analysis',
                note: 'Blue Co(OH)₂ precipitate; turns brown Co(OH)₃ on standing in air (Co²⁺ → Co³⁺ oxidation)'
            },
            {
                equation: 'CoCl₂ + 6NH₃ → [Co(NH₃)₆]Cl₂ → oxidise → [Co(NH₃)₆]Cl₃',
                conditions: 'Werner\'s complex',
                note: '[Co(NH₃)₆]³⁺ is orange-yellow, octahedral, inner orbital (d²sp³), diamagnetic'
            },
            {
                equation: 'Co²⁺ + 4SCN⁻ + Hg²⁺ → Hg[Co(SCN)₄]↓',
                conditions: 'Blue precipitate (cobalt thiocyanate test)',
                note: 'Confirmatory test for Co²⁺ — blue thiocyanate precipitate soluble in amyl alcohol'
            }
        ],
        compoundsInfo: [
            { formula: 'CoCl₂·6H₂O', color: 'Pink', hexColor: '#FFB6C1', nature: 'neutral' },
            { formula: 'CoCl₂ (anhydrous)', color: 'Blue', hexColor: '#3498DB', nature: 'neutral' },
            { formula: '[Co(NH₃)₆]Cl₃', color: 'Orange-yellow', hexColor: '#FFA500', nature: 'neutral' },
            { formula: 'Co(OH)₂', color: 'Blue (ppt)', hexColor: '#4169E1', nature: 'basic' }
        ],
        trendPosition: 'Central element in NCERT coordination chemistry — Co²⁺ pink/blue (humidity indicator), [Co(en)₃]³⁺ optical isomers',
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
                'Nickel can exhibit oxidation state of zero when bonded to π-acceptor ligands: Ni(CO)₄ is tetrahedral (sp³, Ni(0))',
                '[Ni(CN)₄]²⁻ is square planar (dsp², Ni(II)) because CN⁻ is a strong-field ligand that forces pairing of 3d electrons — the classic NCERT example of how ligand field strength determines geometry',
                '[NiCl₄]²⁻ is tetrahedral (sp³, Ni(II)) because Cl⁻ is a weak-field ligand — no d-electron pairing, retains 4s–4p–4p–4p hybridisation',
                'Used as heterogeneous catalyst for hydrogenation of vegetable oils (Sabatier–Senderens, uses H₂ over Ni at 200°C)',
                'Ni²⁺ is green in aqueous solution ([Ni(H₂O)₆]²⁺)'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Ni + 4CO → Ni(CO)₄',
                conditions: '50–60°C (Mond process)',
                note: 'Volatile tetracarbonylnickel(0) — decomposes at 180°C to give pure Ni; tetrahedral, sp³, Ni(0)'
            },
            {
                equation: 'Ni²⁺ + 4CN⁻ → [Ni(CN)₄]²⁻',
                conditions: 'Excess KCN',
                note: 'Square planar (dsp²) — strong-field CN⁻ forces spin pairing; NCERT geometry example'
            },
            {
                equation: 'Ni²⁺ + 2DMG → [Ni(DMG)₂]↓',
                conditions: 'Dimethylglyoxime (DMG) test, NH₃ medium',
                note: 'Bright red square planar precipitate — confirmatory test for Ni²⁺'
            }
        ],
        trendPosition: 'NCERT geometry example — [Ni(CN)₄]²⁻ square planar (dsp²) vs [NiCl₄]²⁻ tetrahedral (sp³)',
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
    {
        atomicNumber: 40,
        symbol: 'Zr',
        name: 'Zirconium',
        atomicMass: 91.224,
        category: 'Transition Metal',
        block: 'd',
        group: 4,
        period: 5,
        electronConfig: '[Kr]4d²5s²',
        atomicRadius: 206,
        ionizationEnergy: 640,
        electronegativity: 1.33,
        density: 6.51,
        meltingPoint: 2128,
        boilingPoint: 4682,
        oxidationStates: [4, 3, 2],
        oxidationStateCompounds: [
            { state: 4, compounds: ['ZrO₂', 'ZrCl₄'] }
        ],
        isException: true,
        exceptionType: 'Lanthanide Contraction Effect',
        exceptionExplanation: 'Zr (period 5, Z=40) and Hf (period 6, Z=72) have almost identical atomic radii (~206 pm vs 208 pm) and chemical properties due to lanthanide contraction — making them the hardest pair of elements to separate in nature',
        anomalousBehavior: {
            facts: [
                'Zirconium and hafnium are a unique pair in the periodic table: despite being in the same group but different periods (5 and 6), they have almost identical atomic radii (Zr = 206 pm, Hf = 208 pm) and nearly the same chemical behaviour',
                'This is a direct consequence of lanthanide contraction — the 14 f electrons added across the lanthanide series poorly shield nuclear charge, so Hf is pulled inward to match Zr in size',
                'Zr and Hf always occur together in nature and are extremely difficult to separate — the only practical method is fractional distillation of ZrCl₄ and HfCl₄',
                'ZrO₂ (zirconia) is a refractory material with a very high melting point (~2988 K) used in high-temperature furnace linings and as a white pigment',
                'Zr is highly resistant to corrosion and is used as cladding for nuclear reactor fuel rods (Hf, by contrast, absorbs neutrons strongly and must be removed from reactor-grade Zr)'
            ],
            jeeRelevance: 'high'
        },
        trendPosition: 'Lanthanide contraction — Zr and Hf have same atomic radius (~206 pm); inseparable in nature',
        hasRichData: true,
        row: 5,
        col: 4
    },
    { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: 92.906, category: 'Transition Metal', block: 'd', group: 5, period: 5, electronConfig: '[Kr]4d⁴5s¹', atomicRadius: 198, ionizationEnergy: 652, electronegativity: 1.60, density: 8.57, meltingPoint: 2750, boilingPoint: 5017, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Nb has 4d⁴5s¹ instead of 4d³5s² for extra stability', row: 5, col: 5 },
    {
        atomicNumber: 42,
        symbol: 'Mo',
        name: 'Molybdenum',
        atomicMass: 95.95,
        category: 'Transition Metal',
        block: 'd',
        group: 6,
        period: 5,
        electronConfig: '[Kr]4d⁵5s¹',
        atomicRadius: 190,
        ionizationEnergy: 684,
        electronegativity: 2.16,
        density: 10.28,
        meltingPoint: 2896,
        boilingPoint: 4912,
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Mo has 4d⁵5s¹ (like Cr) for half-filled d-orbital stability — expected 4d⁴5s²',
        oxidationStates: [6, 4, 2, 3],
        oxidationStateCompounds: [
            { state: 6, compounds: ['MoO₃', 'MoS₂', 'MoO₄²⁻', '(NH₄)₂MoO₄'] },
            { state: 4, compounds: ['MoO₂', 'MoS₂'] }
        ],
        compoundsInfo: [
            { formula: '(NH₄)₃[P(Mo₃O₁₀)₄]', color: 'Canary Yellow (ppt)', hexColor: '#FFEF00', nature: 'neutral' },
            { formula: '(NH₄)₃[As(Mo₃O₁₀)₄]', color: 'Canary Yellow (ppt)', hexColor: '#FFEF00', nature: 'neutral' },
            { formula: 'MoS₂', color: 'Black (solid)', hexColor: '#1A1A1A', nature: 'neutral' }
        ],
        anomalousBehavior: {
            facts: [
                'MoS₂ (molybdenite) is used as a solid lubricant — it has a layered structure similar to graphite where layers slide easily over each other, ideal for high-temperature and high-vacuum lubrication where oil-based lubricants fail',
                'Molybdenum is an essential trace element in biology: the Mo–Fe protein (nitrogenase enzyme) in nitrogen-fixing bacteria (e.g. Rhizobium) catalyses N₂ → NH₃ at room temperature — the biological equivalent of the Haber process',
                'Ammonium phosphomolybdate (NH₄)₃[P(Mo₃O₁₀)₄] — canary yellow precipitate formed when H₃PO₄ or phosphate ions react with ammonium molybdate in HNO₃ — NCERT test for phosphate radicals in salt analysis',
                'Maximum oxidation state +6 in MoO₃ and MoO₄²⁻ (matches group number 6), similar to CrO₃ and CrO₄²⁻'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'PO₄³⁻ + 12MoO₄²⁻ + 24H⁺ + 3NH₄⁺ → (NH₄)₃[P(Mo₃O₁₀)₄]↓ + 12H₂O',
                conditions: 'Excess ammonium molybdate in HNO₃',
                note: 'Canary yellow precipitate — confirmatory test for phosphate radical in salt analysis'
            }
        ],
        trendPosition: 'MoS₂ lubricant (layered like graphite); canary yellow phosphomolybdate test; biological N₂ fixation',
        hasRichData: true,
        row: 5,
        col: 6
    },
    { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: 98, category: 'Transition Metal', block: 'd', group: 7, period: 5, electronConfig: '[Kr]4d⁵5s²', atomicRadius: 183, ionizationEnergy: 702, electronegativity: 1.90, density: 11.50, meltingPoint: 2430, boilingPoint: 4538, row: 5, col: 7 },
    { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: 101.07, category: 'Transition Metal', block: 'd', group: 8, period: 5, electronConfig: '[Kr]4d⁷5s¹', atomicRadius: 178, ionizationEnergy: 710, electronegativity: 2.20, density: 12.37, meltingPoint: 2607, boilingPoint: 4423, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Expected [Kr]4d⁶5s². Actual [Kr]4d⁷5s¹ due to very small 4d-5s energy gap and e⁻-e⁻ repulsion in 5s.', row: 5, col: 8 },
    {
        atomicNumber: 45,
        symbol: 'Rh',
        name: 'Rhodium',
        atomicMass: 102.91,
        category: 'Transition Metal',
        block: 'd',
        group: 9,
        period: 5,
        electronConfig: '[Kr]4d⁸5s¹',
        atomicRadius: 173,
        ionizationEnergy: 720,
        electronegativity: 2.28,
        density: 12.41,
        meltingPoint: 2237,
        boilingPoint: 3968,
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Expected [Kr]4d⁷5s². Actual [Kr]4d⁸5s¹ — 4d orbital drops below 5s in energy across the 4d series, favouring d-electron population',
        oxidationStates: [3, 1, 0],
        oxidationStateCompounds: [
            { state: 3, compounds: ['RhCl₃', 'Rh₂O₃'] },
            { state: 1, compounds: ['[RhCl(PPh₃)₃]'] }
        ],
        anomalousBehavior: {
            facts: [
                'Wilkinson\'s catalyst — [RhCl(PPh₃)₃] (chlorotris(triphenylphosphine)rhodium(I)) — is specifically named in NCERT as a homogeneous catalyst for hydrogenation of alkenes at room temperature and atmospheric pressure of H₂',
                'Unlike heterogeneous Ni/Pt/Pd catalysts, Wilkinson\'s catalyst works in solution and shows high selectivity — hydrogenates only one double bond at a time in polyunsaturated substrates',
                'Rh is one of the platinum group metals (PGMs) — Pt, Pd, Rh, Ru, Os, Ir — which are collectively critical in catalytic converters in automobiles to reduce CO, NOₓ, and hydrocarbons',
                'Oxidation state +1 is unusually stable for a 4d metal due to strong π-back bonding with PPh₃ ligands'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'RCH=CH₂ + H₂ → [RhCl(PPh₃)₃] → RCH₂CH₃',
                conditions: 'Room temperature, 1 atm H₂, Wilkinson\'s catalyst',
                note: 'Homogeneous hydrogenation — Rh(I) oxidatively adds H₂, then alkene inserts, then reductive elimination gives alkane'
            }
        ],
        trendPosition: 'Wilkinson\'s catalyst [RhCl(PPh₃)₃] — NCERT-named homogeneous hydrogenation catalyst',
        hasRichData: true,
        row: 5,
        col: 9
    },
    { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: 106.42, category: 'Transition Metal', block: 'd', group: 10, period: 5, electronConfig: '[Kr]4d¹⁰', atomicRadius: 169, ionizationEnergy: 804, electronegativity: 2.20, density: 12.02, meltingPoint: 1828, boilingPoint: 3236, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Pd has 4d¹⁰5s⁰ - unique case with no s electrons for complete d-orbital stability', anomalousBehavior: { facts: ['PdCl₂ is important catalyst used in Wacker process for oxidation of ethyne to ethanal', 'Unique electronic configuration with no 5s electrons'], jeeRelevance: 'high' }, row: 5, col: 10 },
    {
        atomicNumber: 47,
        symbol: 'Ag',
        name: 'Silver',
        atomicMass: 107.87,
        category: 'Transition Metal',
        block: 'd',
        group: 11,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s¹',
        atomicRadius: 165,
        ionicRadius: 115,
        ionizationEnergy: 731,
        electronegativity: 1.93,
        density: 10.49,
        meltingPoint: 1235,
        boilingPoint: 2435,
        standardReductionPotential: 0.80,
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Ag has 4d¹⁰5s¹ (like Cu) for fully-filled d-orbital stability — expected 4d⁹5s²',
        oxidationStates: [1, 2],
        oxidationStateCompounds: [
            { state: 1, compounds: ['AgCl', 'AgBr', 'AgI', 'AgNO₃', 'Ag₂O'] },
            { state: 2, compounds: ['AgF₂'] }
        ],
        compoundsInfo: [
            { formula: 'AgCl', color: 'White (ppt)', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'AgBr', color: 'Pale Yellow (ppt)', hexColor: '#FFFACD', nature: 'neutral' },
            { formula: 'AgI', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'neutral' },
            { formula: 'Ag₂S', color: 'Black (ppt)', hexColor: '#1A1A1A', nature: 'neutral' },
            { formula: '[Ag(NH₃)₂]⁺', color: 'Colourless (soln)', hexColor: 'transparent', nature: 'neutral' }
        ],
        anomalousBehavior: {
            facts: [
                'Silver is considered a transition element because it exhibits incompletely filled d-orbitals in its +2 oxidation state (Ag²⁺ = 4d⁹)',
                'Solubility of AgX halides: AgF is soluble; AgCl is white ppt (Ksp = 1.8×10⁻¹⁰); AgBr is pale yellow ppt (light-sensitive, photographic films); AgI is yellow ppt — most insoluble (Ksp = 8.5×10⁻¹⁷). Solubility decreases F > Cl > Br > I',
                '[Ag(NH₃)₂]⁺ (diamminesilver(I), linear, sp): Tollens\' reagent — AgNO₃ + excess NH₃; used for silver mirror test for aldehydes (RCHO reduces Ag⁺ → Ag mirror)',
                '[Ag(CN)₂]⁻ (dicyanoargentate(I), linear, sp): used in MacArthur–Forrest cyanide process for extracting silver and gold from low-grade ores — 4Ag + 8CN⁻ + O₂ + 2H₂O → 4[Ag(CN)₂]⁻ + 4OH⁻',
                '[Ag(S₂O₃)₂]³⁻: formed when AgBr dissolves in sodium thiosulfate (hypo) — the basis of photographic fixing: AgBr (unexposed) + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaBr',
                'AgCl dissolves in excess NH₃ → [Ag(NH₃)₂]⁺; AgBr dissolves only in concentrated NH₃; AgI is insoluble in NH₃ — key distinction in salt analysis Group I'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'AgCl↓ + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻',
                conditions: 'Excess aqueous NH₃',
                note: 'White AgCl dissolves in NH₃ to form Tollens\' complex (linear, sp hybridised)'
            },
            {
                equation: '4Ag + 8CN⁻ + O₂ + 2H₂O → 4[Ag(CN)₂]⁻ + 4OH⁻',
                conditions: 'Cyanide process for Ag/Au extraction',
                note: '[Ag(CN)₂]⁻ is linear; Ag recovered by Zn displacement: 2[Ag(CN)₂]⁻ + Zn → [Zn(CN)₄]²⁻ + 2Ag'
            },
            {
                equation: 'AgBr + 2Na₂S₂O₃ → Na₃[Ag(S₂O₃)₂] + NaBr',
                conditions: 'Photographic fixing (hypo solution)',
                note: 'Removes unexposed AgBr from developed film — [Ag(S₂O₃)₂]³⁻ is soluble'
            }
        ],
        trendPosition: 'AgCl/AgBr/AgI solubility trend; Tollens\' [Ag(NH₃)₂]⁺; [Ag(CN)₂]⁻ cyanide extraction',
        hasRichData: true,
        row: 5,
        col: 11
    },
    { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: 112.41, category: 'Transition Metal', block: 'd', group: 12, period: 5, electronConfig: '[Kr]4d¹⁰5s²', atomicRadius: 161, ionizationEnergy: 868, electronegativity: 1.69, density: 8.65, meltingPoint: 594, boilingPoint: 1040, standardReductionPotential: -0.40, compoundsInfo: [{ formula: 'CdS', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'neutral' }], row: 5, col: 12 },

    // Period 5 - p-block
    {
        atomicNumber: 49,
        symbol: 'In',
        name: 'Indium',
        atomicMass: 114.82,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 13,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p¹',
        atomicRadius: 167,
        ionicRadius: 80,
        ionizationEnergy: 558,
        electronegativity: 1.78,
        density: 7.31,
        meltingPoint: 430,
        boilingPoint: 2345,
        oxides: ['In₂O₃'],
        oxideNature: 'amphoteric',
        oxidationStates: [1, 3],
        oxidationStateCompounds: [
            { state: 1, compounds: ['InCl'] },
            { state: 3, compounds: ['In₂O₃', 'InCl₃'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'In shows +1 state (alongside +3) due to inert pair effect — the 5s² electrons resist ionization',
        anomalousBehavior: {
            facts: [
                'Indium exhibits the inert pair effect: the 5s² pair resists ionization, stabilizing the +1 oxidation state',
                'In group 13, moving down from Al → Ga → In → Tl, the lower oxidation state (+1) becomes increasingly stable due to the inert pair effect',
                'In³⁺ is the common ion in most compounds; In⁺ exists in InCl and In₂O'
            ],
            jeeRelevance: 'medium'
        },
        keyReactions: [
            {
                equation: '4In + 3O₂ → 2In₂O₃',
                conditions: 'Heat',
                note: 'Forms amphoteric oxide'
            }
        ],
        trendPosition: 'Inert pair effect — +1 state alongside +3; amphoteric In₂O₃',
        row: 5,
        col: 13
    },
    {
        atomicNumber: 50,
        symbol: 'Sn',
        name: 'Tin',
        atomicMass: 118.71,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 14,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p²',
        atomicRadius: 140,
        ionicRadius: 118,
        ionizationEnergy: 709,
        electronegativity: 1.96,
        density: 7.28,
        meltingPoint: 505,
        boilingPoint: 2875,
        oxides: ['SnO', 'SnO₂'],
        oxideNature: 'amphoteric',
        oxidationStates: [2, 4],
        oxidationStateCompounds: [
            { state: 2, compounds: ['SnO', 'SnCl₂', 'SnSO₄'] },
            { state: 4, compounds: ['SnO₂', 'SnCl₄'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'Sn shows stable +2 state (inert pair effect) alongside +4; Sn²⁺ is a good reducing agent',
        anomalousBehavior: {
            facts: [
                'Tin exhibits inert pair effect: the 5s² electrons resist participation in bonding, stabilizing +2 state',
                'SnCl₂ is a common reducing agent in qualitative analysis — reduces Hg²⁺ to Hg₂²⁺ and then to Hg (white → grey precipitate)',
                'Tin shows allotropy: white tin (β-Sn, metallic, stable above 13.2°C) converts to grey tin (α-Sn, brittle, non-metallic) below 13.2°C — called "tin disease" or "tin pest"',
                'Bronze is an alloy of copper and tin (Cu + Sn); solder is an alloy of tin and lead (Sn + Pb)'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Sn + 2HCl → SnCl₂ + H₂',
                conditions: 'Dilute HCl',
                note: 'Tin dissolves in dilute acid forming Sn²⁺'
            },
            {
                equation: 'SnCl₂ + 2HgCl₂ → SnCl₄ + Hg₂Cl₂↓',
                conditions: 'Analytical test',
                note: 'White precipitate of Hg₂Cl₂; excess SnCl₂ gives grey Hg'
            }
        ],
        trendPosition: 'Inert pair effect — +2 (reducing) and +4 states; amphoteric SnO and SnO₂',
        row: 5,
        col: 14
    },
    {
        atomicNumber: 51,
        symbol: 'Sb',
        name: 'Antimony',
        atomicMass: 121.76,
        category: 'Metalloid',
        block: 'p',
        group: 15,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p³',
        atomicRadius: 140,
        ionicRadius: 76,
        ionizationEnergy: 834,
        electronegativity: 2.05,
        density: 6.70,
        meltingPoint: 904,
        boilingPoint: 1908,
        oxides: ['Sb₂O₃', 'Sb₂O₅'],
        oxideNature: 'amphoteric',
        oxidationStates: [-3, 3, 5],
        oxidationStateCompounds: [
            { state: -3, compounds: ['SbH₃'] },
            { state: 3, compounds: ['Sb₂O₃', 'SbCl₃', 'Sb₂S₃'] },
            { state: 5, compounds: ['Sb₂O₅', 'SbCl₅'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'Sb shows +3 as increasingly stable state (inert pair effect) vs +5; Sb₂O₃ is amphoteric while Sb₂O₅ is acidic',
        anomalousBehavior: {
            facts: [
                'Antimony shows inert pair effect — +3 state is more stable than +5 going down group 15',
                'Sb₂O₃ is amphoteric (dissolves in both acid and alkali), whereas Sb₂O₅ is predominantly acidic',
                'SbH₃ (stibine) is less stable than NH₃, PH₃, and AsH₃ — hydride stability decreases down the group',
                'Antimony is a metalloid used in flame-retardants and semiconducting materials'
            ],
            jeeRelevance: 'medium'
        },
        keyReactions: [
            {
                equation: '2Sb + 3Cl₂ → 2SbCl₃',
                conditions: 'Limited Cl₂',
                note: 'Excess Cl₂ gives SbCl₅'
            }
        ],
        trendPosition: 'Metalloid in Group 15, Period 5 — inert pair effect, +3 more stable than +5',
        row: 5,
        col: 15
    },
    {
        atomicNumber: 52,
        symbol: 'Te',
        name: 'Tellurium',
        atomicMass: 127.60,
        category: 'Metalloid',
        block: 'p',
        group: 16,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p⁴',
        atomicRadius: 137,
        ionicRadius: 221,
        ionizationEnergy: 869,
        electronegativity: 2.1,
        density: 6.24,
        meltingPoint: 723,
        boilingPoint: 1261,
        oxides: ['TeO₂', 'TeO₃'],
        oxideNature: 'amphoteric',
        oxidationStates: [-2, 4, 6],
        oxidationStateCompounds: [
            { state: -2, compounds: ['H₂Te', 'Na₂Te'] },
            { state: 4, compounds: ['TeO₂', 'TeCl₄'] },
            { state: 6, compounds: ['TeO₃', 'H₂TeO₄'] }
        ],
        isException: true,
        exceptionType: 'Atomic Mass Anomaly',
        exceptionExplanation: 'Te (Z=52, mass=127.60) has higher atomic mass than I (Z=53, mass=126.90) — a classic exception to Mendeleev\'s mass-based ordering',
        anomalousBehavior: {
            facts: [
                'Te–I pair is one of the classic anomalies of Mendeleev\'s periodic table: Te has higher atomic mass (127.60) than I (126.90), yet Te has lower atomic number (52) — Mendeleev placed them by properties, not mass',
                'Modern periodic law arranges by atomic number (Moseley), resolving this anomaly',
                'TeO₂ is amphoteric (dissolves in both acid and base), unlike SO₂ and SeO₂ which are purely acidic',
                'H₂Te is the most acidic hydride in group 16 (acidity: H₂O < H₂S < H₂Se < H₂Te)'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Te + O₂ → TeO₂',
                conditions: 'Combustion',
                note: 'Forms amphoteric TeO₂'
            }
        ],
        trendPosition: 'Metalloid in Group 16 — atomic mass > I (Mendeleev anomaly); amphoteric TeO₂',
        row: 5,
        col: 16
    },
    {
        atomicNumber: 53,
        symbol: 'I',
        name: 'Iodine',
        atomicMass: 126.90,
        category: 'Reactive Nonmetal',
        block: 'p',
        group: 17,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p⁵',
        atomicRadius: 133,
        ionicRadius: 220,
        ionizationEnergy: 1008,
        electronegativity: 2.66,
        electronAffinity: -295,
        density: 4.93,
        meltingPoint: 387,
        boilingPoint: 457,
        standardReductionPotential: 0.54,
        gasColor: { formula: 'I₂', color: 'violet', hexColor: '#7F00FF' },
        oxideNature: 'acidic',
        oxidationStates: [-1, 1, 3, 5, 7],
        oxidationStateCompounds: [
            { state: -1, compounds: ['HI', 'NaI', 'KI'] },
            { state: 1, compounds: ['HIO', 'ICl'] },
            { state: 5, compounds: ['HIO₃', 'IO₃⁻'] },
            { state: 7, compounds: ['HIO₄', 'IO₄⁻'] }
        ],
        isException: true,
        exceptionType: 'Physical State + Atomic Mass Anomaly',
        exceptionExplanation: 'I₂ is the only halogen that is solid at room temperature; also has lower atomic mass than Te despite higher atomic number',
        anomalousBehavior: {
            facts: [
                'Iodine is the only halogen that is solid at room temperature (sublimes directly to violet vapour) — van der Waals forces are large enough due to high electron count',
                'I₂ dissolves in non-polar solvents (CCl₄, CHCl₃) giving violet solution; in polar solvents (H₂O, alcohol) gives brown/yellow — due to charge transfer complex formation',
                'Iodine gives characteristic blue-black colour with starch solution — used as confirmatory test for I₂ (and for starch)',
                'I₂ + KI → KI₃ (potassium triiodide) — increases solubility of I₂ in water',
                'I has the lowest electron affinity among halogens (F > Cl > Br > I) — I⁻ is the weakest oxidizer; HI is the strongest reducing acid among hydrohalic acids',
                'Atomic mass of I (126.90) < Te (127.60) — classic Mendeleev periodic table anomaly (Te–I pair)'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'I₂ + 2Na₂S₂O₃ → 2NaI + Na₂S₄O₆',
                conditions: 'Iodometric titration',
                note: 'Hypo (sodium thiosulfate) reduces I₂ — end-point detected by starch'
            },
            {
                equation: 'I₂ + H₂O ⇌ HI + HOI',
                conditions: 'Disproportionation (less than Cl₂, Br₂)',
                note: 'Iodine dissolves less in water than other halogens'
            },
            {
                equation: 'Cl₂ + 2I⁻ → 2Cl⁻ + I₂',
                conditions: 'Displacement (oxidising power: F > Cl > Br > I)',
                note: 'Cl₂ and Br₂ can displace I⁻; I₂ cannot displace Cl⁻ or Br⁻'
            }
        ],
        trendPosition: 'Only solid halogen — violet vapour, starch test, atomic mass < Te (anomaly)',
        row: 5,
        col: 17
    },
    {
        atomicNumber: 54,
        symbol: 'Xe',
        name: 'Xenon',
        atomicMass: 131.29,
        category: 'Noble Gas',
        block: 'p',
        group: 18,
        period: 5,
        electronConfig: '[Kr]4d¹⁰5s²5p⁶',
        atomicRadius: 216,
        ionizationEnergy: 1170,
        density: 0.005887,
        meltingPoint: 161,
        boilingPoint: 165,
        isException: true,
        exceptionType: 'Noble Gas Compound Formation',
        exceptionExplanation: 'Xe forms stable compounds XeF₂, XeF₄, XeF₆ — proving noble gases are not completely inert (NCERT Chapter 7)',
        anomalousBehavior: {
            facts: [
                'Xenon forms the largest number of noble gas compounds among all noble gases — XeF₂, XeF₄, XeF₆, XeO₃, XeOF₂, XeOF₄',
                'XeF₂: sp³d hybridization, linear shape, 3 lone pairs on Xe — formed by mixing Xe and F₂ in 2:1 ratio at 400°C or UV light',
                'XeF₄: sp³d² hybridization, square planar shape, 2 lone pairs on Xe — formed by 1:5 ratio of Xe:F₂',
                'XeF₆: sp³d³ hybridization, distorted octahedral, 1 lone pair on Xe — formed by 1:20 ratio of Xe:F₂',
                'First noble gas compound ever prepared was XeF₂ by Bartlett and colleagues (1962), after Bartlett synthesized O₂⁺PtF₆⁻',
                'XeF₂ is a mild and selective fluorinating agent used in organic synthesis'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Xe + F₂ → XeF₂',
                conditions: '400°C, sealed nickel vessel, Xe:F₂ = 2:1',
                note: 'Linear molecule, sp³d, 3 lone pairs'
            },
            {
                equation: 'Xe + 2F₂ → XeF₄',
                conditions: '400°C, Xe:F₂ = 1:5',
                note: 'Square planar, sp³d², 2 lone pairs'
            },
            {
                equation: 'Xe + 3F₂ → XeF₆',
                conditions: '300°C, 50 atm, Xe:F₂ = 1:20',
                note: 'Distorted octahedral, sp³d³, 1 lone pair'
            },
            {
                equation: '2XeF₂ + 2H₂O → 2Xe + 4HF + O₂',
                conditions: 'Hydrolysis',
                note: 'XeF₂ hydrolyzes slowly; XeF₆ hydrolysis is vigorous'
            }
        ],
        trendPosition: 'Noble gas that forms compounds (XeF₂/XeF₄/XeF₆) — most chemistry-active noble gas',
        row: 5,
        col: 18
    },

    // Period 6 - d-block (5d series)
    {
        atomicNumber: 72,
        symbol: 'Hf',
        name: 'Hafnium',
        atomicMass: 178.49,
        category: 'Transition Metal',
        block: 'd',
        group: 4,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d²6s²',
        atomicRadius: 208,
        ionizationEnergy: 659,
        electronegativity: 1.30,
        density: 13.31,
        meltingPoint: 2506,
        boilingPoint: 4876,
        oxidationStates: [4, 3, 2],
        oxidationStateCompounds: [
            { state: 4, compounds: ['HfO₂', 'HfCl₄'] }
        ],
        isException: true,
        exceptionType: 'Lanthanide Contraction Effect',
        exceptionExplanation: 'Hf (period 6, Z=72) has almost the same atomic radius (208 pm) as Zr (period 5, Z=40, 206 pm) — caused by lanthanide contraction. Despite being one period below, Hf is not larger than Zr.',
        anomalousBehavior: {
            facts: [
                'Lanthanide contraction: the 14 lanthanide elements (Ce to Lu, Z=58–71) interpose between La and Hf. Each added proton pulls electrons inward, but the poorly shielding f electrons do not compensate — so Hf ends up almost the same size as Zr (208 pm vs 206 pm)',
                'This is the primary example of lanthanide contraction cited in NCERT: Hf and Zr have nearly identical radii, densities, and chemical properties despite being in the same group but different periods',
                'Consequence: Hf and Zr always co-occur in ores and are extremely difficult to separate — the only economical separation is liquid–liquid extraction or fractional distillation of their volatile chlorides',
                'HfO₂ (hafnia) has a very high melting point and dielectric constant — used in modern CMOS transistor gate oxides to replace SiO₂',
                'Unlike Zr, Hf strongly absorbs thermal neutrons — Zr used in nuclear reactor fuel rod cladding (Hf must be removed), while Hf is used in control rods'
            ],
            jeeRelevance: 'high'
        },
        trendPosition: 'Lanthanide contraction — Hf radius (208 pm) ≈ Zr radius (206 pm); same group, different periods, nearly identical chemistry',
        hasRichData: true,
        row: 6,
        col: 4
    },
    { atomicNumber: 73, symbol: 'Ta', name: 'Tantalum', atomicMass: 180.95, category: 'Transition Metal', block: 'd', group: 5, period: 6, electronConfig: '[Xe]4f¹⁴5d³6s²', atomicRadius: 200, ionizationEnergy: 761, electronegativity: 1.50, density: 16.65, meltingPoint: 3290, boilingPoint: 5731, oxidationStates: [5, 3, 4], trendPosition: 'Max oxidation state +5 (group 5) — highly corrosion-resistant metal used in capacitors', row: 6, col: 5 },
    { atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: 183.84, category: 'Transition Metal', block: 'd', group: 6, period: 6, electronConfig: '[Xe]4f¹⁴5d⁴6s²', atomicRadius: 193, ionizationEnergy: 770, electronegativity: 2.36, density: 19.25, meltingPoint: 3695, boilingPoint: 5828, isException: true, exceptionType: 'Physical Property', exceptionExplanation: 'W has the highest melting point (3695 K) and boiling point (5828 K) of all elements — used in light bulb filaments', oxidationStates: [6, 4, 2], trendPosition: 'Highest melting point element — used in filaments; max ox state +6', row: 6, col: 6 },
    {
        atomicNumber: 75,
        symbol: 'Re',
        name: 'Rhenium',
        atomicMass: 186.21,
        category: 'Transition Metal',
        block: 'd',
        group: 7,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d⁵6s²',
        atomicRadius: 188,
        ionizationEnergy: 760,
        electronegativity: 1.90,
        density: 21.02,
        meltingPoint: 3459,
        boilingPoint: 5869,
        oxidationStates: [7, 4, 6, 2],
        oxidationStateCompounds: [
            { state: 7, compounds: ['Re₂O₇', 'HReO₄'] },
            { state: 4, compounds: ['ReO₂', 'ReCl₄'] }
        ],
        anomalousBehavior: {
            facts: [
                'Rhenium has one of the highest boiling points of all elements (5869 K)',
                'Re₂O₇ is acidic — dissolves in water to form perrhenic acid (HReO₄), analogous to Mn₂O₇ forming HMnO₄',
                'Maximum oxidation state of +7 matches group number — oxoanion is ReO₄⁻ (perrhenate)'
            ],
            jeeRelevance: 'low'
        },
        trendPosition: 'Max oxidation state +7 (group 7) — one of densest and highest boiling elements',
        row: 6,
        col: 7
    },
    {
        atomicNumber: 76,
        symbol: 'Os',
        name: 'Osmium',
        atomicMass: 190.23,
        category: 'Transition Metal',
        block: 'd',
        group: 8,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d⁶6s²',
        atomicRadius: 185,
        ionizationEnergy: 840,
        electronegativity: 2.20,
        density: 22.59,
        meltingPoint: 3306,
        boilingPoint: 5285,
        oxidationStates: [8, 4, 3, 2],
        oxidationStateCompounds: [
            { state: 8, compounds: ['OsO₄'] },
            { state: 4, compounds: ['OsO₂', 'OsCl₄'] }
        ],
        isException: true,
        exceptionType: 'Physical Property',
        exceptionExplanation: 'Osmium has the highest density of all elements (22.59 g/cm³) — denser than even Ir, Pt, Au, Pb',
        anomalousBehavior: {
            facts: [
                'Osmium is the densest naturally occurring element (22.59 g/cm³) — exceeds iridium (22.56) and all other elements',
                'OsO₄ (osmium tetroxide) is a volatile, highly toxic yellow solid — Os reaches its maximum +8 oxidation state, the highest possible for any transition metal',
                '+8 oxidation state is unique to Os and Ru in group 8 — all other transition metals max out at lower states',
                'OsO₄ is used as a staining agent in electron microscopy'
            ],
            jeeRelevance: 'medium'
        },
        trendPosition: 'Densest element (22.59 g/cm³) — max ox state +8 in OsO₄, highest of any element',
        row: 6,
        col: 8
    },
    {
        atomicNumber: 77,
        symbol: 'Ir',
        name: 'Iridium',
        atomicMass: 192.22,
        category: 'Transition Metal',
        block: 'd',
        group: 9,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d⁷6s²',
        atomicRadius: 180,
        ionizationEnergy: 880,
        electronegativity: 2.20,
        density: 22.56,
        meltingPoint: 2739,
        boilingPoint: 4701,
        oxidationStates: [3, 4, 1],
        oxidationStateCompounds: [
            { state: 3, compounds: ['IrCl₃', 'Ir₂O₃'] },
            { state: 4, compounds: ['IrO₂', 'IrF₄'] }
        ],
        anomalousBehavior: {
            facts: [
                'Iridium is the second densest element (22.56 g/cm³) after osmium',
                'Iridium is the most corrosion-resistant metal — resists attack by almost all acids including aqua regia',
                'The Ir/Os alloy is used in the tip of fountain pens and in early international standard metre bars',
                'High abundance of Ir in the K–Pg boundary clay layer is evidence for the asteroid impact theory for dinosaur extinction'
            ],
            jeeRelevance: 'low'
        },
        trendPosition: 'Second densest element — most corrosion-resistant metal; +3 most common state',
        row: 6,
        col: 9
    },
    {
        atomicNumber: 78,
        symbol: 'Pt',
        name: 'Platinum',
        atomicMass: 195.08,
        category: 'Transition Metal',
        block: 'd',
        group: 10,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d⁹6s¹',
        atomicRadius: 177,
        ionizationEnergy: 870,
        electronegativity: 2.28,
        density: 21.45,
        meltingPoint: 2041,
        boilingPoint: 4098,
        standardReductionPotential: 1.18,
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Pt has 5d⁹6s¹ instead of expected 5d⁸6s² — the 5d orbital drops well below 6s in energy across the 5d series',
        oxidationStates: [2, 4, 0],
        oxidationStateCompounds: [
            { state: 2, compounds: ['[PtCl₄]²⁻', 'PtCl₂', '[PtCl₂(NH₃)₂]'] },
            { state: 4, compounds: ['[PtCl₆]²⁻', 'PtCl₄', 'H₂[PtCl₆]'] }
        ],
        compoundsInfo: [
            { formula: 'cis-[PtCl₂(NH₃)₂]', color: 'Yellow (solid)', hexColor: '#FFD700', nature: 'neutral' },
            { formula: 'trans-[PtCl₂(NH₃)₂]', color: 'Pale yellow', hexColor: '#FFFACD', nature: 'neutral' },
            { formula: 'H₂[PtCl₆]', color: 'Orange-red', hexColor: '#FF6347', nature: 'acidic' }
        ],
        anomalousBehavior: {
            facts: [
                'Werner\'s coordination compounds: [PtCl₄]²⁻ (tetrachloroplatinate(II), square planar, dsp²) and [Pt(NH₃)₄]²⁺ (tetraammineplatinum(II), square planar) are NCERT examples for ionisation isomerism: [Pt(NH₃)₄][PtCl₄] (Magnus\'s green salt)',
                'cis-[PtCl₂(NH₃)₂] (cisplatin) and trans-[PtCl₂(NH₃)₂] are the textbook NCERT example of geometric isomerism in square planar complexes',
                'Cisplatin (cis-[PtCl₂(NH₃)₂]) is explicitly named in NCERT as an anticancer drug — it cross-links DNA strands in cancer cells; trans-isomer has no anticancer activity',
                '[PtCl₆]²⁻ (hexachloroplatinate(IV), octahedral) and [Pt(NH₃)₄Cl₂]²⁺ (tetraammineplatinum(IV)) are coordination sphere isomers',
                'Pt dissolves in aqua regia (conc. HCl + conc. HNO₃, 3:1) to form H₂[PtCl₆] (chloroplatinic acid) — one of the few metals attacked by aqua regia',
                'Pt (and Pd, Rh) are the active metals in catalytic converters — convert CO → CO₂, NOₓ → N₂, and unburnt hydrocarbons → CO₂ + H₂O'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Pt + 4HCl + HNO₃ → H₂[PtCl₄] + NO + 2H₂O',
                conditions: 'Aqua regia (3HCl : 1HNO₃)',
                note: 'Pt dissolves in aqua regia — HNO₃ oxidises Pt, HCl provides Cl⁻ for complex formation'
            },
            {
                equation: 'cis-[PtCl₂(NH₃)₂] → anticancer drug (cisplatin)',
                conditions: 'Binds to N-7 of guanine in DNA',
                note: 'Cross-links adjacent guanines on same DNA strand → prevents replication; trans-isomer is inactive'
            },
            {
                equation: '[PtCl₄]²⁻ + 2NH₃ → [PtCl₂(NH₃)₂] (cis first, by trans effect)',
                conditions: 'Sequential substitution',
                note: 'Trans effect of Cl⁻ > NH₃ directs incoming NH₃ to cis position relative to Cl⁻'
            }
        ],
        trendPosition: 'Cisplatin ([PtCl₂(NH₃)₂]) — NCERT geometric isomers and anticancer drug; Magnus\'s green salt ionisation isomers',
        hasRichData: true,
        row: 6,
        col: 10
    },
    {
        atomicNumber: 79,
        symbol: 'Au',
        name: 'Gold',
        atomicMass: 196.97,
        category: 'Transition Metal',
        block: 'd',
        group: 11,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s¹',
        atomicRadius: 174,
        ionizationEnergy: 890,
        electronegativity: 2.54,
        density: 19.30,
        meltingPoint: 1337,
        boilingPoint: 3129,
        standardReductionPotential: 1.69,
        isException: true,
        exceptionType: 'Electron Configuration',
        exceptionExplanation: 'Au has 5d¹⁰6s¹ (like Cu, Ag) for fully-filled d-orbital stability — expected 5d⁹6s²',
        oxidationStates: [1, 3],
        oxidationStateCompounds: [
            { state: 1, compounds: ['[Au(CN)₂]⁻', 'AuCl'] },
            { state: 3, compounds: ['[AuCl₄]⁻', 'AuCl₃', 'HAuCl₄'] }
        ],
        compoundsInfo: [
            { formula: 'HAuCl₄·3H₂O', color: 'Yellow (crystals)', hexColor: '#FFD700', nature: 'acidic' },
            { formula: '[AuCl₄]⁻', color: 'Yellow (soln)', hexColor: '#FFD700', nature: 'neutral' }
        ],
        anomalousBehavior: {
            facts: [
                'Gold does not react with individual acids — it dissolves only in aqua regia (3HCl : 1HNO₃): Au + HNO₃ + 4HCl → H[AuCl₄] + NO + 2H₂O. The NO₃⁻ oxidises Au to Au³⁺ while Cl⁻ stabilises it as [AuCl₄]⁻',
                'MacArthur–Forrest cyanide process for gold extraction: 4Au + 8CN⁻ + O₂ + 2H₂O → 4[Au(CN)₂]⁻ + 4OH⁻; gold recovered by zinc displacement: 2[Au(CN)₂]⁻ + Zn → [Zn(CN)₄]²⁻ + 2Au',
                '[Au(CN)₂]⁻ (dicyanoaurate(I)) is linear (sp hybridisation, Au(I)) — identical geometry to [Ag(CN)₂]⁻ and [Cu(CN)₂]⁻; cyanide stabilises +1 state through strong σ-donation and π-back bonding',
                'Gold shows relativistic contraction of the 6s orbital (relativistic effects) — makes Au–Au bonding (aurophilic interaction) unusually strong and contributes to gold\'s distinctive yellow colour',
                'Au(I) is the stable oxidation state in complexes with soft ligands (CN⁻, S₂O₃²⁻); Au(III) is stable with hard halide ligands (Cl⁻) in [AuCl₄]⁻'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Au + HNO₃ + 4HCl → H[AuCl₄] + NO↑ + 2H₂O',
                conditions: 'Aqua regia (conc. 3HCl : 1HNO₃)',
                note: 'Only acid mixture that dissolves gold — HNO₃ oxidises, HCl provides Cl⁻ to form stable [AuCl₄]⁻'
            },
            {
                equation: '4Au + 8NaCN + O₂ + 2H₂O → 4Na[Au(CN)₂] + 4NaOH',
                conditions: 'Cyanide leaching of gold ore',
                note: '[Au(CN)₂]⁻ linear complex; Au recovered by Zn: 2[Au(CN)₂]⁻ + Zn → [Zn(CN)₄]²⁻ + 2Au'
            }
        ],
        trendPosition: 'Noble metal — aqua regia only solvent; [Au(CN)₂]⁻ cyanide extraction; [AuCl₄]⁻ in Au(III)',
        hasRichData: true,
        row: 6,
        col: 11
    },
    {
        atomicNumber: 80,
        symbol: 'Hg',
        name: 'Mercury',
        atomicMass: 200.59,
        category: 'Transition Metal',
        block: 'd',
        group: 12,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²',
        atomicRadius: 171,
        ionizationEnergy: 1007,
        electronegativity: 2.00,
        density: 13.55,
        meltingPoint: 234,
        boilingPoint: 630,
        standardReductionPotential: 0.85,
        isException: true,
        exceptionType: 'Physical Property',
        exceptionExplanation: 'Hg is liquid at room temperature — only liquid metal; relativistic contraction of 6s² makes the orbital spherically dense and poor at metallic bonding, so the melting point collapses to 234 K',
        oxidationStates: [1, 2],
        oxidationStateCompounds: [
            { state: 1, compounds: ['Hg₂Cl₂', 'Hg₂(NO₃)₂', 'Hg₂SO₄'] },
            { state: 2, compounds: ['HgCl₂', 'HgO', 'HgS', 'K₂[HgI₄]'] }
        ],
        compoundsInfo: [
            { formula: 'Hg₂Cl₂', color: 'White (ppt)', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'HgI₂', color: 'Red (ppt)', hexColor: '#FF0000', nature: 'neutral' },
            { formula: 'K₂[HgI₄]', color: 'Colourless (soln)', hexColor: 'transparent', nature: 'neutral' },
            { formula: 'HgS', color: 'Black (ppt)', hexColor: '#1A1A1A', nature: 'neutral' }
        ],
        anomalousBehavior: {
            facts: [
                'Mercury exists in two oxidation states: Hg⁺ (mercurous, always as Hg₂²⁺ dimer) and Hg²⁺ (mercuric). Hg₂Cl₂ = calomel (mercurous chloride, white ppt); HgCl₂ = corrosive sublimate (mercuric chloride, soluble, highly toxic)',
                'Calomel (Hg₂Cl₂) test with SnCl₂: Hg²⁺ + SnCl₂ → Hg₂Cl₂↓ (white silky ppt) + SnCl₄; excess SnCl₂ reduces further to Hg₂Cl₂ → 2Hg (grey metallic mercury). Both steps are confirmatory for Hg²⁺ in salt analysis',
                'Nessler\'s reagent: K₂[HgI₄] in KOH (alkaline potassium tetraiodomercurate(II)); reacts with NH₄⁺/NH₃ to give orange-brown precipitate HgO·Hg(NH₂)I — test for ammonium ion',
                'Hg²⁺ + 2KI → HgI₂↓ (red ppt); excess KI → K₂[HgI₄] (colourless soluble complex) — used to prepare Nessler\'s reagent',
                'Hg₂²⁺ disproportionates in presence of NH₃: Hg₂Cl₂ + 2NH₃ → Hg + HgNH₂Cl↓ (white) + NH₄Cl — black Hg metal appears alongside white precipitate',
                'Hg is not a transition metal by strict IUPAC definition — both Hg and Hg²⁺ have completely filled d¹⁰ configuration'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Hg²⁺ + SnCl₂ (few drops) → Hg₂Cl₂↓ (white) + SnCl₄',
                conditions: 'Salt analysis confirmatory test for Hg²⁺',
                note: 'Excess SnCl₂: Hg₂Cl₂ + SnCl₂ → 2Hg↓ (grey metallic) + SnCl₄'
            },
            {
                equation: 'Hg²⁺ + 2KI → HgI₂↓ (red) ; HgI₂ + 2KI → K₂[HgI₄] (colourless)',
                conditions: 'Excess KI dissolves red precipitate',
                note: 'K₂[HgI₄] + KOH = Nessler\'s reagent — tests for NH₃/NH₄⁺'
            },
            {
                equation: 'Hg₂Cl₂ + 2NH₃ → Hg↓ + HgNH₂Cl↓ + NH₄Cl',
                conditions: 'Aqueous NH₃ (distinguishes Hg₂²⁺ from Hg²⁺)',
                note: 'Black Hg metal + white precipitate mixture — calomel turns grey-black with NH₃'
            }
        ],
        trendPosition: 'Hg₂Cl₂ (calomel) vs HgCl₂ (corrosive sublimate); SnCl₂ test; Nessler\'s reagent K₂[HgI₄]',
        hasRichData: true,
        row: 6,
        col: 12
    },

    // Period 6 - p-block
    {
        atomicNumber: 81,
        symbol: 'Tl',
        name: 'Thallium',
        atomicMass: 204.38,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 13,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p¹',
        atomicRadius: 170,
        ionicRadius: 150,
        ionizationEnergy: 589,
        electronegativity: 1.62,
        density: 11.85,
        meltingPoint: 577,
        boilingPoint: 1746,
        oxides: ['Tl₂O', 'Tl₂O₃'],
        oxideNature: 'basic',
        oxidationStates: [1, 3],
        oxidationStateCompounds: [
            { state: 1, compounds: ['TlCl', 'Tl₂O', 'TlOH'] },
            { state: 3, compounds: ['TlCl₃', 'Tl₂O₃'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'Tl shows +1 as the dominant stable state — strongest inert pair effect in group 13 (Tl⁺ > In⁺ > Ga⁺)',
        anomalousBehavior: {
            facts: [
                'Thallium shows the strongest inert pair effect in group 13: +1 state is more stable than +3 (reverse of Al, Ga)',
                'Tl⁺ ion has a similar ionic radius to K⁺ and Rb⁺ — it mimics alkali metal behavior, precipitates as TlCl (sparingly soluble like AgCl)',
                'Tl₂O is a basic oxide (unlike Al₂O₃ which is amphoteric) — increasing metallic character down group 13',
                'Tl³⁺/Tl⁺ has E° = +1.25 V, making Tl³⁺ a moderately strong oxidizing agent'
            ],
            jeeRelevance: 'medium'
        },
        keyReactions: [
            {
                equation: 'Tl³⁺ + 2e⁻ → Tl⁺',
                conditions: 'E° = +1.25 V',
                note: 'Tl³⁺ is a moderately strong oxidizer; Tl⁺ is the stable final product'
            }
        ],
        trendPosition: 'Strongest inert pair effect in group 13 — +1 dominant state; Tl⁺ mimics K⁺/Rb⁺',
        row: 6,
        col: 13
    },
    {
        atomicNumber: 82,
        symbol: 'Pb',
        name: 'Lead',
        atomicMass: 207.2,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 14,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p²',
        atomicRadius: 175,
        ionicRadius: 119,
        ionizationEnergy: 716,
        electronegativity: 2.33,
        density: 11.35,
        meltingPoint: 601,
        boilingPoint: 2022,
        standardReductionPotential: -0.13,
        compoundsInfo: [
            { formula: 'PbSO₄', color: 'White (ppt)', hexColor: '#FFFFFF', nature: 'neutral' },
            { formula: 'PbS', color: 'Black (ppt)', hexColor: '#1A1A1A', nature: 'neutral' },
            { formula: 'PbI₂', color: 'Yellow (ppt)', hexColor: '#FFFF00', nature: 'neutral' },
            { formula: 'PbCrO₄', color: 'Yellow (ppt)', hexColor: '#FFD700', nature: 'neutral' }
        ],
        oxides: ['PbO', 'PbO₂', 'Pb₃O₄'],
        oxideNature: 'amphoteric',
        oxidationStates: [2, 4],
        oxidationStateCompounds: [
            { state: 2, compounds: ['PbO', 'PbSO₄', 'PbCl₂', 'PbS'] },
            { state: 4, compounds: ['PbO₂', 'PbCl₄'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'Pb shows +2 as the dominant stable state; PbO₂ (+4) is a strong oxidizing agent that reverts to +2',
        anomalousBehavior: {
            facts: [
                'Lead storage battery (lead accumulator): anode = Pb, cathode = PbO₂, electrolyte = dil. H₂SO₄ (38%); EMF ≈ 2V per cell, 12V for 6-cell battery used in cars',
                'PbO₂ is a strong oxidizing agent — reduction from +4 → +2 (Pb²⁺); used as cathode in lead-acid battery',
                'Inert pair effect: Pb²⁺ is more stable than Pb⁴⁺; PbO₂ can oxidize Mn²⁺ → MnO₄⁻ (used in analytical chemistry)',
                'Red lead (Pb₃O₄ = minium) is a mixed oxide containing Pb²⁺ and Pb⁴⁺ — used as anti-rust paint',
                'PbSO₄ and PbS are both insoluble precipitates — key in qualitative analysis (Group II)',
                'Pb(CH₃COO)₂ (lead acetate) is used as a test for H₂S gas — gives black PbS precipitate'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: 'Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O',
                conditions: 'Discharge in lead storage battery',
                note: 'Both electrodes become PbSO₄ on discharge; process reverses on charging'
            },
            {
                equation: 'PbO₂ + 4HCl → PbCl₂ + Cl₂ + 2H₂O',
                conditions: 'Concentrated HCl',
                note: 'PbO₂ oxidizes Cl⁻ to Cl₂'
            }
        ],
        trendPosition: 'Inert pair effect — +2 dominant; PbO₂ is strong oxidizer; lead storage battery',
        row: 6,
        col: 14
    },
    {
        atomicNumber: 83,
        symbol: 'Bi',
        name: 'Bismuth',
        atomicMass: 208.98,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 15,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p³',
        atomicRadius: 160,
        ionicRadius: 103,
        ionizationEnergy: 703,
        electronegativity: 2.02,
        density: 9.79,
        meltingPoint: 545,
        boilingPoint: 1837,
        oxides: ['Bi₂O₃', 'Bi₂O₅'],
        oxideNature: 'basic',
        oxidationStates: [3, 5],
        oxidationStateCompounds: [
            { state: 3, compounds: ['Bi₂O₃', 'BiCl₃', 'Bi₂S₃'] },
            { state: 5, compounds: ['Bi₂O₅', 'NaBiO₃'] }
        ],
        isException: true,
        exceptionType: 'Inert Pair Effect',
        exceptionExplanation: 'Bi shows strongest inert pair effect in group 15 — +3 dominates; +5 (NaBiO₃) is an extremely strong oxidizing agent',
        anomalousBehavior: {
            facts: [
                'Bismuth has the strongest inert pair effect in group 15: +3 is overwhelmingly stable; +5 state in NaBiO₃ is a very powerful oxidizing agent',
                'Bi₂O₃ is a basic oxide (unlike N₂O₃ and P₂O₃ which are acidic) — metallic character increases down group 15',
                'Bismuth is the heaviest stable (non-radioactive) element — all elements above Bi (Z > 83) are radioactive',
                'NaBiO₃ (sodium bismuthate) oxidizes Mn²⁺ → MnO₄⁻ (purple) even in cold dilute HNO₃ — used as confirmatory test for manganese',
                'BiCl₃ hydrolyzes readily to give BiOCl (bismuth oxychloride — white precipitate), used in cosmetics'
            ],
            jeeRelevance: 'high'
        },
        keyReactions: [
            {
                equation: '2Mn²⁺ + 5NaBiO₃ + 14H⁺ → 2MnO₄⁻ + 5Bi³⁺ + 5Na⁺ + 7H₂O',
                conditions: 'Cold dil. HNO₃',
                note: 'Confirmatory test for Mn²⁺ — pink/purple MnO₄⁻ formed'
            },
            {
                equation: 'BiCl₃ + H₂O → BiOCl↓ + 2HCl',
                conditions: 'Hydrolysis',
                note: 'White precipitate of bismuth oxychloride'
            }
        ],
        trendPosition: 'Heaviest stable element — strongest inert pair effect in group 15; Bi₂O₃ basic; NaBiO₃ strong oxidizer',
        row: 6,
        col: 15
    },
    {
        atomicNumber: 84,
        symbol: 'Po',
        name: 'Polonium',
        atomicMass: 209,
        category: 'Post-Transition Metal',
        block: 'p',
        group: 16,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁴',
        atomicRadius: 167,
        ionizationEnergy: 812,
        electronegativity: 2.0,
        density: 9.20,
        meltingPoint: 527,
        boilingPoint: 1235,
        oxidationStates: [-2, 2, 4, 6],
        oxidationStateCompounds: [
            { state: -2, compounds: ['H₂Po'] },
            { state: 4, compounds: ['PoO₂', 'PoCl₄'] }
        ],
        isException: true,
        exceptionType: 'Radioactivity',
        exceptionExplanation: 'Po is the only group 16 element that is radioactive with no stable isotopes; discovered by Marie Curie in 1898',
        anomalousBehavior: {
            facts: [
                'Polonium was discovered by Marie Curie in 1898 — named after her homeland Poland',
                'Po is radioactive with no stable isotopes; ²¹⁰Po has a half-life of only 138.4 days',
                'Po is the only element that crystallizes in a simple cubic structure under normal conditions',
                'Po shows more metallic character than Te or Se — PoO₂ is amphoteric tending toward basic',
                'H₂Po is the most unstable and reducing hydride in group 16 — thermal stability of hydrides decreases down the group'
            ],
            jeeRelevance: 'medium'
        },
        trendPosition: 'Radioactive group 16 element — only simple cubic crystal; discovered by Marie Curie',
        row: 6,
        col: 16
    },
    {
        atomicNumber: 85,
        symbol: 'At',
        name: 'Astatine',
        atomicMass: 210,
        category: 'Metalloid',
        block: 'p',
        group: 17,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁵',
        atomicRadius: 150,
        ionizationEnergy: 930,
        electronegativity: 2.20,
        density: 7.0,
        oxidationStates: [-1, 1, 3, 5, 7],
        oxidationStateCompounds: [
            { state: -1, compounds: ['HAt', 'NaAt'] },
            { state: 5, compounds: ['AtO₃⁻'] }
        ],
        isException: true,
        exceptionType: 'Radioactivity + Metallic Character',
        exceptionExplanation: 'At is the rarest naturally occurring element (radioactive) and is expected to show metallic character — least reactive halogen, unlike the others',
        anomalousBehavior: {
            facts: [
                'Astatine is the rarest naturally occurring element — only ~30 g exists in Earth\'s crust at any time',
                'At is radioactive with no stable isotopes; longest-lived isotope ²¹⁰At has a half-life of only 8.1 hours',
                'Oxidising power of halogens decreases down the group: F > Cl > Br > I > At — At is the weakest oxidizing halogen',
                'Astatine is expected to be a dark-colored solid (like I₂) and to show some metallic properties, making it a metalloid',
                'Electron affinity and electronegativity are lowest among halogens for At — it is least reactive',
                'Bond dissociation energy of At–At is expected to be lowest among halogens, following the trend F–F < Cl–Cl > Br–Br > I–I > At–At'
            ],
            jeeRelevance: 'medium'
        },
        trendPosition: 'Rarest element — radioactive halogen; weakest oxidizing power in group 17; metalloid character',
        row: 6,
        col: 17
    },
    {
        atomicNumber: 86,
        symbol: 'Rn',
        name: 'Radon',
        atomicMass: 222,
        category: 'Noble Gas',
        block: 'p',
        group: 18,
        period: 6,
        electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁶',
        atomicRadius: 220,
        ionizationEnergy: 1037,
        density: 0.00973,
        meltingPoint: 202,
        boilingPoint: 211,
        isException: true,
        exceptionType: 'Radioactivity',
        exceptionExplanation: 'Rn is a radioactive noble gas — the heaviest and densest noble gas; lowest ionization energy among noble gases, making compound formation more feasible',
        anomalousBehavior: {
            facts: [
                'Radon is a radioactive noble gas — all isotopes are radioactive; most stable is ²²²Rn with half-life of 3.8 days',
                'Rn has the lowest ionization energy among all noble gases (1037 kJ/mol) — theoretically most likely to form compounds after Xe, though no Rn compounds have been isolated at room temperature',
                'Ionization energy of noble gases decreases down the group: He > Ne > Ar > Kr > Xe > Rn',
                'Radon is a natural decay product of uranium and radium — it is a significant source of background radiation in homes',
                'Rn is the densest noble gas and among the densest gases at standard conditions'
            ],
            jeeRelevance: 'medium'
        },
        trendPosition: 'Heaviest natural noble gas — radioactive; lowest IE among noble gases; densest noble gas',
        row: 6,
        col: 18
    },

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

    // Period 7 - d block (6d series / transactinides) — structure only, no card detail
    { atomicNumber: 104, symbol: 'Rf', name: 'Rutherfordium', atomicMass: 267, category: 'Transition Metal', block: 'd', group: 4, period: 7, electronConfig: '[Rn]5f¹⁴6d²7s²', row: 7, col: 4 },
    { atomicNumber: 105, symbol: 'Db', name: 'Dubnium', atomicMass: 268, category: 'Transition Metal', block: 'd', group: 5, period: 7, electronConfig: '[Rn]5f¹⁴6d³7s²', row: 7, col: 5 },
    { atomicNumber: 106, symbol: 'Sg', name: 'Seaborgium', atomicMass: 269, category: 'Transition Metal', block: 'd', group: 6, period: 7, electronConfig: '[Rn]5f¹⁴6d⁴7s²', row: 7, col: 6 },
    { atomicNumber: 107, symbol: 'Bh', name: 'Bohrium', atomicMass: 270, category: 'Transition Metal', block: 'd', group: 7, period: 7, electronConfig: '[Rn]5f¹⁴6d⁵7s²', row: 7, col: 7 },
    { atomicNumber: 108, symbol: 'Hs', name: 'Hassium', atomicMass: 277, category: 'Transition Metal', block: 'd', group: 8, period: 7, electronConfig: '[Rn]5f¹⁴6d⁶7s²', row: 7, col: 8 },
    { atomicNumber: 109, symbol: 'Mt', name: 'Meitnerium', atomicMass: 278, category: 'Transition Metal', block: 'd', group: 9, period: 7, electronConfig: '[Rn]5f¹⁴6d⁷7s²', row: 7, col: 9 },
    { atomicNumber: 110, symbol: 'Ds', name: 'Darmstadtium', atomicMass: 281, category: 'Transition Metal', block: 'd', group: 10, period: 7, electronConfig: '[Rn]5f¹⁴6d⁸7s²', row: 7, col: 10 },
    { atomicNumber: 111, symbol: 'Rg', name: 'Roentgenium', atomicMass: 282, category: 'Transition Metal', block: 'd', group: 11, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s¹', row: 7, col: 11 },
    { atomicNumber: 112, symbol: 'Cn', name: 'Copernicium', atomicMass: 285, category: 'Transition Metal', block: 'd', group: 12, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²', row: 7, col: 12 },

    // Period 7 - p block (structure only)
    { atomicNumber: 113, symbol: 'Nh', name: 'Nihonium', atomicMass: 286, category: 'Post-Transition Metal', block: 'p', group: 13, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p¹', row: 7, col: 13 },
    { atomicNumber: 114, symbol: 'Fl', name: 'Flerovium', atomicMass: 289, category: 'Post-Transition Metal', block: 'p', group: 14, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p²', row: 7, col: 14 },
    { atomicNumber: 115, symbol: 'Mc', name: 'Moscovium', atomicMass: 290, category: 'Post-Transition Metal', block: 'p', group: 15, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p³', row: 7, col: 15 },
    { atomicNumber: 116, symbol: 'Lv', name: 'Livermorium', atomicMass: 293, category: 'Post-Transition Metal', block: 'p', group: 16, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p⁴', row: 7, col: 16 },
    { atomicNumber: 117, symbol: 'Ts', name: 'Tennessine', atomicMass: 294, category: 'Metalloid', block: 'p', group: 17, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p⁵', row: 7, col: 17 },
    { atomicNumber: 118, symbol: 'Og', name: 'Oganesson', atomicMass: 294, category: 'Noble Gas', block: 'p', group: 18, period: 7, electronConfig: '[Rn]5f¹⁴6d¹⁰7s²7p⁶', row: 7, col: 18 },
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
