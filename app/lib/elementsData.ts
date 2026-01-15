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
    fSubshellInfo?: string;  // Half-filled, full-filled info
    redoxNature?: 'oxidizing' | 'reducing' | 'both' | 'neither';  // Redox behavior
    redoxExplanation?: string;  // Why it's oxidizing/reducing
    // Exception data
    isException?: boolean;
    exceptionType?: string;
    exceptionExplanation?: string;
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
    { atomicNumber: 1, symbol: 'H', name: 'Hydrogen', atomicMass: 1.008, category: 'Reactive Nonmetal', block: 's', group: 1, period: 1, electronConfig: '1s¹', atomicRadius: 53, ionizationEnergy: 1312, electronegativity: 2.20, electronAffinity: 73, density: 0.00009, meltingPoint: 14, boilingPoint: 20, gasColor: { formula: 'H₂', color: 'colorless', hexColor: 'transparent' }, row: 1, col: 1 },
    { atomicNumber: 2, symbol: 'He', name: 'Helium', atomicMass: 4.00, category: 'Noble Gas', block: 's', group: 18, period: 1, electronConfig: '1s²', atomicRadius: 120, ionizationEnergy: 2372, electronAffinity: 48, density: 0.00018, meltingPoint: 4.2, boilingPoint: 4.2, row: 1, col: 18 },

    // Period 2 - NCERT values
    { atomicNumber: 3, symbol: 'Li', name: 'Lithium', atomicMass: 6.94, category: 'Alkali Metal', block: 's', group: 1, period: 2, electronConfig: '[He]2s¹', atomicRadius: 152, ionicRadius: 76, ionizationEnergy: 520, electronegativity: 0.98, density: 0.53, meltingPoint: 454, boilingPoint: 1615, standardReductionPotential: -3.04, flameColor: { color: 'Red', hexColor: '#FF0066' }, row: 2, col: 1 },
    { atomicNumber: 4, symbol: 'Be', name: 'Beryllium', atomicMass: 9.01, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 2, electronConfig: '[He]2s²', atomicRadius: 112, ionicRadius: 31, ionizationEnergy: 899, electronegativity: 1.57, density: 1.84, meltingPoint: 1560, boilingPoint: 2745, standardReductionPotential: -1.97, oxides: ['BeO'], oxideNature: 'amphoteric', oxideNatureDetails: 'BeO is amphoteric - dissolves in both acids and alkalis', row: 2, col: 2 },
    { atomicNumber: 5, symbol: 'B', name: 'Boron', atomicMass: 10.81, category: 'Metalloid', block: 'p', group: 13, period: 2, electronConfig: '[He]2s²2p¹', atomicRadius: 85, ionicRadius: 27, ionizationEnergy: 801, electronegativity: 2.0, density: 2.35, meltingPoint: 2453, boilingPoint: 3923, row: 2, col: 13 },
    { atomicNumber: 6, symbol: 'C', name: 'Carbon', atomicMass: 12.01, category: 'Reactive Nonmetal', block: 'p', group: 14, period: 2, electronConfig: '[He]2s²2p²', atomicRadius: 77, ionizationEnergy: 1086, electronegativity: 2.5, density: 3.51, meltingPoint: 4373, compoundsInfo: [{ formula: 'CO', color: 'colourless', nature: 'neutral' }, { formula: 'CO₂', color: 'colourless', nature: 'acidic' }], row: 2, col: 14 },
    { atomicNumber: 7, symbol: 'N', name: 'Nitrogen', atomicMass: 14.01, category: 'Reactive Nonmetal', block: 'p', group: 15, period: 2, electronConfig: '[He]2s²2p³', atomicRadius: 70, ionicRadius: 171, ionizationEnergy: 1402, electronegativity: 3.0, density: 0.879, meltingPoint: 63, boilingPoint: 77, gasColor: { formula: 'N₂', color: 'colorless', hexColor: 'transparent' }, compoundsInfo: [{ formula: 'N₂O, NO', color: 'colourless gas', nature: 'neutral' }, { formula: 'N₂O₃', color: 'blue solid', nature: 'acidic' }, { formula: 'NO₂', color: 'brown gas', nature: 'acidic' }, { formula: 'N₂O₄, N₂O₅', color: 'colourless solid', nature: 'acidic' }], isException: true, exceptionType: 'Electron Affinity', exceptionExplanation: 'N has ~0 EA due to electron-electron repulsion in compact 2p orbitals', row: 2, col: 15 },
    { atomicNumber: 8, symbol: 'O', name: 'Oxygen', atomicMass: 16.00, category: 'Reactive Nonmetal', block: 'p', group: 16, period: 2, electronConfig: '[He]2s²2p⁴', atomicRadius: 66, ionicRadius: 140, ionizationEnergy: 1314, electronegativity: 3.50, electronAffinity: 141, density: 1.32, meltingPoint: 55, boilingPoint: 90, gasColor: { formula: 'O₂', color: 'colorless', hexColor: 'transparent' }, compoundsInfo: [{ formula: 'O₃', color: 'very pale blue', nature: 'neutral' }, { formula: 'OF₂', color: 'colourless', nature: 'neutral' }], isException: true, exceptionType: 'Ionization Energy', exceptionExplanation: 'IE of O < N due to electron pairing in 2p⁴ causing repulsion', row: 2, col: 16 },
    { atomicNumber: 9, symbol: 'F', name: 'Fluorine', atomicMass: 19.00, category: 'Reactive Nonmetal', block: 'p', group: 17, period: 2, electronConfig: '[He]2s²2p⁵', atomicRadius: 64, ionicRadius: 133, ionizationEnergy: 1680, electronegativity: 4.0, electronAffinity: 333, density: 1.5, meltingPoint: 54.4, boilingPoint: 84.9, standardReductionPotential: 2.87, gasColor: { formula: 'F₂', color: 'very pale yellow/brown', hexColor: '#FFFACD' }, isException: true, exceptionType: 'Electron Affinity', exceptionExplanation: 'F has lower EA than Cl due to small size causing e⁻-e⁻ repulsion', row: 2, col: 17 },
    { atomicNumber: 10, symbol: 'Ne', name: 'Neon', atomicMass: 20.18, category: 'Noble Gas', block: 'p', group: 18, period: 2, electronConfig: '[He]2s²2p⁶', atomicRadius: 160, ionizationEnergy: 2080, electronAffinity: 116, density: 0.0009, meltingPoint: 24.6, boilingPoint: 27.1, row: 2, col: 18 },

    // Period 3 - NCERT values with oxide nature for trend
    { atomicNumber: 11, symbol: 'Na', name: 'Sodium', atomicMass: 22.99, category: 'Alkali Metal', block: 's', group: 1, period: 3, electronConfig: '[Ne]3s¹', atomicRadius: 186, ionicRadius: 102, ionizationEnergy: 496, electronegativity: 0.93, density: 0.97, meltingPoint: 371, boilingPoint: 1156, standardReductionPotential: -2.714, flameColor: { color: 'Yellow/orange', hexColor: '#FFD700' }, oxides: ['Na₂O'], oxideNature: 'basic', oxideNatureDetails: 'Na₂O is strongly basic, reacts vigorously with water → NaOH', row: 3, col: 1 },
    { atomicNumber: 12, symbol: 'Mg', name: 'Magnesium', atomicMass: 24.31, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 3, electronConfig: '[Ne]3s²', atomicRadius: 160, ionicRadius: 72, ionizationEnergy: 737, electronegativity: 1.31, density: 1.74, meltingPoint: 924, boilingPoint: 1363, standardReductionPotential: -2.36, flameColor: { color: 'Brilliant white', hexColor: '#FFFFFF' }, oxides: ['MgO'], oxideNature: 'basic', oxideNatureDetails: 'MgO is basic oxide → Mg(OH)₂ with water', row: 3, col: 2 },
    { atomicNumber: 13, symbol: 'Al', name: 'Aluminium', atomicMass: 26.98, category: 'Post-Transition Metal', block: 'p', group: 13, period: 3, electronConfig: '[Ne]3s²3p¹', atomicRadius: 143, ionicRadius: 53.5, ionizationEnergy: 577, electronegativity: 1.5, density: 2.70, meltingPoint: 933, boilingPoint: 2740, standardReductionPotential: -1.66, oxides: ['Al₂O₃'], oxideNature: 'amphoteric', oxideNatureDetails: 'Al₂O₃ is amphoteric - dissolves in both acids and alkalis', row: 3, col: 13 },
    { atomicNumber: 14, symbol: 'Si', name: 'Silicon', atomicMass: 28.09, category: 'Metalloid', block: 'p', group: 14, period: 3, electronConfig: '[Ne]3s²3p²', atomicRadius: 118, ionicRadius: 40, ionizationEnergy: 786, electronegativity: 1.8, density: 2.34, meltingPoint: 1693, boilingPoint: 3550, oxides: ['SiO₂'], oxideNature: 'acidic', oxideNatureDetails: 'SiO₂ is weakly acidic oxide', row: 3, col: 14 },
    { atomicNumber: 15, symbol: 'P', name: 'Phosphorus', atomicMass: 30.97, category: 'Reactive Nonmetal', block: 'p', group: 15, period: 3, electronConfig: '[Ne]3s²3p³', atomicRadius: 110, ionicRadius: 212, ionizationEnergy: 1012, electronegativity: 2.1, density: 1.823, meltingPoint: 317, boilingPoint: 554, oxides: ['P₂O₃', 'P₂O₅'], oxideNature: 'acidic', oxideNatureDetails: 'P₂O₅ is acidic oxide → H₃PO₄ with water', row: 3, col: 15 },
    { atomicNumber: 16, symbol: 'S', name: 'Sulfur', atomicMass: 32.06, category: 'Reactive Nonmetal', block: 'p', group: 16, period: 3, electronConfig: '[Ne]3s²3p⁴', atomicRadius: 104, ionicRadius: 184, ionizationEnergy: 1000, electronegativity: 2.44, electronAffinity: 200, density: 2.06, meltingPoint: 393, boilingPoint: 718, oxides: ['SO₂', 'SO₃'], oxideNature: 'acidic', oxideNatureDetails: 'SO₂ and SO₃ are strongly acidic oxides → H₂SO₃, H₂SO₄', row: 3, col: 16 },
    { atomicNumber: 17, symbol: 'Cl', name: 'Chlorine', atomicMass: 35.45, category: 'Reactive Nonmetal', block: 'p', group: 17, period: 3, electronConfig: '[Ne]3s²3p⁵', atomicRadius: 99, ionicRadius: 184, ionizationEnergy: 1256, electronegativity: 3.2, electronAffinity: 349, density: 1.66, meltingPoint: 172.0, boilingPoint: 239.0, standardReductionPotential: 1.36, gasColor: { formula: 'Cl₂', color: 'greenish yellow', hexColor: '#9ACD32' }, compoundsInfo: [{ formula: 'ClO₂', color: 'intense yellow', nature: 'acidic' }, { formula: 'Cl₂O', color: 'brown/yellow', nature: 'acidic' }], oxides: ['Cl₂O₇'], oxideNature: 'acidic', oxideNatureDetails: 'Cl₂O₇ is strongly acidic → HClO₄ (perchloric acid)', row: 3, col: 17 },
    { atomicNumber: 18, symbol: 'Ar', name: 'Argon', atomicMass: 39.95, category: 'Noble Gas', block: 'p', group: 18, period: 3, electronConfig: '[Ne]3s²3p⁶', atomicRadius: 190, ionizationEnergy: 1520, electronAffinity: 96, density: 0.00178, meltingPoint: 83.8, boilingPoint: 87.2, row: 3, col: 18 },

    // Period 4 - s and p block - NCERT values
    { atomicNumber: 19, symbol: 'K', name: 'Potassium', atomicMass: 39.10, category: 'Alkali Metal', block: 's', group: 1, period: 4, electronConfig: '[Ar]4s¹', atomicRadius: 227, ionicRadius: 138, ionizationEnergy: 419, electronegativity: 0.82, density: 0.86, meltingPoint: 336, boilingPoint: 1032, standardReductionPotential: -2.925, flameColor: { color: 'Lilac/violet', hexColor: '#C8A2C8' }, oxides: ['K₂O'], oxideNature: 'basic', oxideNatureDetails: 'K₂O is strongly basic', row: 4, col: 1 },
    { atomicNumber: 20, symbol: 'Ca', name: 'Calcium', atomicMass: 40.08, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 4, electronConfig: '[Ar]4s²', atomicRadius: 197, ionicRadius: 100, ionizationEnergy: 590, electronegativity: 1.00, density: 1.55, meltingPoint: 1124, boilingPoint: 1767, standardReductionPotential: -2.84, flameColor: { color: 'Brick red', hexColor: '#CB4154' }, oxides: ['CaO'], oxideNature: 'basic', oxideNatureDetails: 'CaO (quicklite) is basic oxide', row: 4, col: 2 },
    { atomicNumber: 31, symbol: 'Ga', name: 'Gallium', atomicMass: 69.72, category: 'Post-Transition Metal', block: 'p', group: 13, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p¹', atomicRadius: 135, ionicRadius: 62, ionizationEnergy: 579, electronegativity: 1.6, density: 5.90, meltingPoint: 303, boilingPoint: 2676, standardReductionPotential: -0.56, isException: true, exceptionType: 'Melting Point', exceptionExplanation: 'Ga has unusually low MP (303K) due to unusual crystal structure', row: 4, col: 13 },
    { atomicNumber: 32, symbol: 'Ge', name: 'Germanium', atomicMass: 72.60, category: 'Metalloid', block: 'p', group: 14, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p²', atomicRadius: 122, ionicRadius: 53, ionizationEnergy: 761, electronegativity: 1.8, density: 5.32, meltingPoint: 1218, boilingPoint: 3123, row: 4, col: 14 },
    { atomicNumber: 33, symbol: 'As', name: 'Arsenic', atomicMass: 74.92, category: 'Metalloid', block: 'p', group: 15, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p³', atomicRadius: 121, ionicRadius: 222, ionizationEnergy: 947, electronegativity: 2.0, density: 5.778, meltingPoint: 1089, boilingPoint: 888, row: 4, col: 15 },
    { atomicNumber: 34, symbol: 'Se', name: 'Selenium', atomicMass: 78.96, category: 'Reactive Nonmetal', block: 'p', group: 16, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p⁴', atomicRadius: 117, ionicRadius: 198, ionizationEnergy: 941, electronegativity: 2.48, electronAffinity: 195, density: 4.19, meltingPoint: 490, boilingPoint: 958, row: 4, col: 16 },
    { atomicNumber: 35, symbol: 'Br', name: 'Bromine', atomicMass: 79.90, category: 'Reactive Nonmetal', block: 'p', group: 17, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p⁵', atomicRadius: 114, ionicRadius: 196, ionizationEnergy: 1142, electronegativity: 3.0, electronAffinity: 325, density: 3.19, meltingPoint: 265.8, boilingPoint: 332.5, standardReductionPotential: 1.09, gasColor: { formula: 'Br₂', color: 'red/brown', hexColor: '#A52A2A' }, row: 4, col: 17 },
    { atomicNumber: 36, symbol: 'Kr', name: 'Krypton', atomicMass: 83.80, category: 'Noble Gas', block: 'p', group: 18, period: 4, electronConfig: '[Ar]3d¹⁰4s²4p⁶', atomicRadius: 200, ionizationEnergy: 1351, electronAffinity: 96, density: 0.0037, meltingPoint: 115.9, boilingPoint: 119.7, row: 4, col: 18 },

    // Period 4 - d-block (3d series) - NCERT values with ion colors, oxides, halides
    { atomicNumber: 21, symbol: 'Sc', name: 'Scandium', atomicMass: 44.956, category: 'Transition Metal', block: 'd', group: 3, period: 4, electronConfig: '[Ar]3d¹4s²', atomicRadius: 164, ionicRadius: 73, ionizationEnergy: 631, electronegativity: 1.36, density: 3.43, meltingPoint: 1814, boilingPoint: 3109, ionColors: [{ ion: 'Sc³⁺', config: '3d⁰', color: 'colourless', hexColor: 'transparent' }], oxides: ['Sc₂O₃'], halides: [], oxideNature: 'basic', oxideNatureDetails: 'Sc₂O₃ is basic oxide', row: 4, col: 3 },
    { atomicNumber: 22, symbol: 'Ti', name: 'Titanium', atomicMass: 47.867, category: 'Transition Metal', block: 'd', group: 4, period: 4, electronConfig: '[Ar]3d²4s²', atomicRadius: 147, ionicRadius: 67, ionizationEnergy: 656, electronegativity: 1.54, density: 4.1, meltingPoint: 1941, boilingPoint: 3560, standardReductionPotential: -1.63, ionColors: [{ ion: 'Ti⁴⁺', config: '3d⁰', color: 'colourless', hexColor: 'transparent' }, { ion: 'Ti³⁺', config: '3d¹', color: 'purple', hexColor: '#9B59B6' }], oxides: ['TiO', 'Ti₂O₃', 'TiO₂'], halides: ['TiX₂', 'TiX₃', 'TiX₄'], oxideNature: 'amphoteric', oxideNatureDetails: 'TiO₂ is amphoteric; Ti⁴⁺ as TiO²⁺ (titanyl)', row: 4, col: 4 },
    { atomicNumber: 23, symbol: 'V', name: 'Vanadium', atomicMass: 50.942, category: 'Transition Metal', block: 'd', group: 5, period: 4, electronConfig: '[Ar]3d³4s²', atomicRadius: 135, ionicRadius: 64, ionizationEnergy: 650, electronegativity: 1.63, density: 6.07, meltingPoint: 2183, boilingPoint: 3680, standardReductionPotential: -1.18, ionColors: [{ ion: 'V⁴⁺', config: '3d¹', color: 'blue', hexColor: '#3498DB' }, { ion: 'V³⁺', config: '3d²', color: 'green', hexColor: '#27AE60' }, { ion: 'V²⁺', config: '3d³', color: 'violet', hexColor: '#8E44AD' }], oxides: ['VO', 'V₂O₃', 'V₂O₄', 'V₂O₅'], halides: ['VX₂', 'VX₃', 'VX₄', 'VF₅'], oxideNature: 'amphoteric', oxideNatureDetails: 'V₂O₃ basic → V₂O₄ less basic → V₂O₅ amphoteric. V⁵⁺ as VO₂⁺, V⁴⁺ as VO²⁺', row: 4, col: 5 },
    { atomicNumber: 24, symbol: 'Cr', name: 'Chromium', atomicMass: 51.996, category: 'Transition Metal', block: 'd', group: 6, period: 4, electronConfig: '[Ar]3d⁵4s¹', atomicRadius: 129, ionicRadius: 62, ionizationEnergy: 653, electronegativity: 1.66, density: 7.19, meltingPoint: 2180, boilingPoint: 2944, standardReductionPotential: -0.90, ionColors: [{ ion: 'Cr³⁺', config: '3d³', color: 'violet', hexColor: '#8E44AD' }, { ion: 'Cr²⁺', config: '3d⁴', color: 'blue', hexColor: '#3498DB' }], oxides: ['CrO', 'Cr₂O₃', 'CrO₂', 'CrO₃'], halides: ['CrX₂', 'CrX₃', 'CrX₄', 'CrF₅', 'CrF₆'], oxideNature: 'amphoteric', oxideNatureDetails: 'CrO basic, Cr₂O₃ amphoteric, CrO₃ acidic (gives H₂CrO₄, H₂Cr₂O₇)', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Cr has 3d⁵4s¹ instead of 3d⁴4s² for half-filled d-orbital stability', row: 4, col: 6 },
    { atomicNumber: 25, symbol: 'Mn', name: 'Manganese', atomicMass: 54.938, category: 'Transition Metal', block: 'd', group: 7, period: 4, electronConfig: '[Ar]3d⁵4s²', atomicRadius: 137, ionicRadius: 65, ionizationEnergy: 717, electronegativity: 1.55, density: 7.21, meltingPoint: 1519, boilingPoint: 2334, standardReductionPotential: -1.18, ionColors: [{ ion: 'Mn³⁺', config: '3d⁴', color: 'violet', hexColor: '#8E44AD' }, { ion: 'Mn²⁺', config: '3d⁵', color: 'pink', hexColor: '#FFB6C1' }], oxides: ['MnO', 'Mn₂O₃', 'MnO₂', 'Mn₃O₄', 'Mn₂O₇'], halides: ['MnX₂', 'MnF₃', 'MnF₄'], oxideNature: 'basic', oxideNatureDetails: 'MnO basic → Mn₂O₃ basic → MnO₂ neutral → Mn₂O₇ acidic (gives HMnO₄). Higher O.S. = more acidic', row: 4, col: 7 },
    { atomicNumber: 26, symbol: 'Fe', name: 'Iron', atomicMass: 55.845, category: 'Transition Metal', block: 'd', group: 8, period: 4, electronConfig: '[Ar]3d⁶4s²', atomicRadius: 126, ionicRadius: 77, ionizationEnergy: 762, electronegativity: 1.83, density: 7.8, meltingPoint: 1811, boilingPoint: 3134, standardReductionPotential: -0.44, ionColors: [{ ion: 'Fe³⁺', config: '3d⁵', color: 'yellow', hexColor: '#F1C40F' }, { ion: 'Fe²⁺', config: '3d⁶', color: 'green', hexColor: '#27AE60' }], oxides: ['FeO', 'Fe₂O₃', 'Fe₃O₄'], halides: ['FeX₂', 'FeX₃'], oxideNature: 'basic', oxideNatureDetails: 'FeO and Fe₂O₃ are basic oxides; Fe₃O₄ is mixed oxide', row: 4, col: 8 },
    { atomicNumber: 27, symbol: 'Co', name: 'Cobalt', atomicMass: 58.933, category: 'Transition Metal', block: 'd', group: 9, period: 4, electronConfig: '[Ar]3d⁷4s²', atomicRadius: 125, ionicRadius: 74, ionizationEnergy: 758, electronegativity: 1.88, density: 8.7, meltingPoint: 1768, boilingPoint: 3200, standardReductionPotential: -0.28, ionColors: [{ ion: 'Co³⁺', config: '3d⁶', color: 'blue', hexColor: '#3498DB' }, { ion: 'Co²⁺', config: '3d⁷', color: 'pink', hexColor: '#FFB6C1' }], oxides: ['CoO', 'Co₃O₄'], halides: ['CoX₂', 'CoF₃'], oxideNature: 'basic', oxideNatureDetails: 'CoO is basic oxide; Co₃O₄ is mixed oxide', row: 4, col: 9 },
    { atomicNumber: 28, symbol: 'Ni', name: 'Nickel', atomicMass: 58.693, category: 'Transition Metal', block: 'd', group: 10, period: 4, electronConfig: '[Ar]3d⁸4s²', atomicRadius: 125, ionicRadius: 70, ionizationEnergy: 736, electronegativity: 1.91, density: 8.9, meltingPoint: 1728, boilingPoint: 3186, standardReductionPotential: -0.25, ionColors: [{ ion: 'Ni²⁺', config: '3d⁸', color: 'green', hexColor: '#27AE60' }], oxides: ['NiO'], halides: ['NiX₂'], oxideNature: 'basic', oxideNatureDetails: 'NiO is basic oxide', row: 4, col: 10 },
    { atomicNumber: 29, symbol: 'Cu', name: 'Copper', atomicMass: 63.546, category: 'Transition Metal', block: 'd', group: 11, period: 4, electronConfig: '[Ar]3d¹⁰4s¹', atomicRadius: 128, ionicRadius: 73, ionizationEnergy: 745, electronegativity: 1.90, density: 8.9, meltingPoint: 1358, boilingPoint: 2835, standardReductionPotential: 0.34, flameColor: { color: 'Blue/Green', hexColor: '#00CED1' }, ionColors: [{ ion: 'Cu²⁺', config: '3d⁹', color: 'blue', hexColor: '#3498DB' }, { ion: 'Cu⁺', config: '3d¹⁰', color: 'colourless', hexColor: 'transparent' }], oxides: ['Cu₂O', 'CuO'], halides: ['CuX', 'CuX₂'], oxideNature: 'basic', oxideNatureDetails: 'Cu₂O and CuO are basic oxides', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Cu has 3d¹⁰4s¹ instead of 3d⁹4s² for fully-filled d-orbital stability', row: 4, col: 11 },
    { atomicNumber: 30, symbol: 'Zn', name: 'Zinc', atomicMass: 65.38, category: 'Transition Metal', block: 'd', group: 12, period: 4, electronConfig: '[Ar]3d¹⁰4s²', atomicRadius: 137, ionicRadius: 75, ionizationEnergy: 906, electronegativity: 1.65, density: 7.1, meltingPoint: 693, boilingPoint: 1180, standardReductionPotential: -0.76, ionColors: [{ ion: 'Zn²⁺', config: '3d¹⁰', color: 'colourless', hexColor: 'transparent' }], oxides: ['ZnO'], halides: ['ZnX₂'], oxideNature: 'amphoteric', oxideNatureDetails: 'ZnO is amphoteric - dissolves in both acids and alkalis', row: 4, col: 12 },

    // Period 5 - s and p block - NCERT values
    { atomicNumber: 37, symbol: 'Rb', name: 'Rubidium', atomicMass: 85.47, category: 'Alkali Metal', block: 's', group: 1, period: 5, electronConfig: '[Kr]5s¹', atomicRadius: 248, ionicRadius: 152, ionizationEnergy: 403, electronegativity: 0.82, density: 1.53, meltingPoint: 312, boilingPoint: 961, standardReductionPotential: -2.930, flameColor: { color: 'Pink/red', hexColor: '#FF69B4' }, oxides: ['Rb₂O'], oxideNature: 'basic', row: 5, col: 1 },
    { atomicNumber: 38, symbol: 'Sr', name: 'Strontium', atomicMass: 87.62, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 5, electronConfig: '[Kr]5s²', atomicRadius: 215, ionicRadius: 118, ionizationEnergy: 549, electronegativity: 0.95, density: 2.63, meltingPoint: 1062, boilingPoint: 1655, standardReductionPotential: -2.89, flameColor: { color: 'Red', hexColor: '#FF0000' }, oxides: ['SrO'], oxideNature: 'basic', row: 5, col: 2 },
    { atomicNumber: 49, symbol: 'In', name: 'Indium', atomicMass: 114.82, category: 'Post-Transition Metal', block: 'p', group: 13, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p¹', atomicRadius: 167, ionicRadius: 80, ionizationEnergy: 558, electronegativity: 1.7, density: 7.31, meltingPoint: 430, boilingPoint: 2353, standardReductionPotential: -0.34, row: 5, col: 13 },
    { atomicNumber: 50, symbol: 'Sn', name: 'Tin', atomicMass: 118.71, category: 'Post-Transition Metal', block: 'p', group: 14, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p²', atomicRadius: 140, ionicRadius: 118, ionizationEnergy: 708, electronegativity: 1.8, density: 7.26, meltingPoint: 505, boilingPoint: 2896, oxides: ['SnO', 'SnO₂'], oxideNature: 'amphoteric', oxideNatureDetails: 'SnO and SnO₂ are amphoteric oxides', row: 5, col: 14 },
    { atomicNumber: 51, symbol: 'Sb', name: 'Antimony', atomicMass: 121.75, category: 'Metalloid', block: 'p', group: 15, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p³', atomicRadius: 141, ionicRadius: 76, ionizationEnergy: 834, electronegativity: 1.9, density: 6.697, meltingPoint: 904, boilingPoint: 1860, row: 5, col: 15 },
    { atomicNumber: 52, symbol: 'Te', name: 'Tellurium', atomicMass: 127.60, category: 'Metalloid', block: 'p', group: 16, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p⁴', atomicRadius: 137, ionicRadius: 221, ionizationEnergy: 869, electronegativity: 2.01, electronAffinity: 190, density: 6.25, meltingPoint: 725, boilingPoint: 1260, row: 5, col: 16 },
    { atomicNumber: 53, symbol: 'I', name: 'Iodine', atomicMass: 126.90, category: 'Reactive Nonmetal', block: 'p', group: 17, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p⁵', atomicRadius: 133, ionicRadius: 220, ionizationEnergy: 1008, electronegativity: 2.7, electronAffinity: 296, density: 4.94, meltingPoint: 386.6, boilingPoint: 458.2, standardReductionPotential: 0.54, gasColor: { formula: 'I₂', color: 'dark purple', hexColor: '#4B0082' }, row: 5, col: 17 },
    { atomicNumber: 54, symbol: 'Xe', name: 'Xenon', atomicMass: 131.30, category: 'Noble Gas', block: 'p', group: 18, period: 5, electronConfig: '[Kr]4d¹⁰5s²5p⁶', atomicRadius: 220, ionizationEnergy: 1170, electronAffinity: 77, density: 0.0059, meltingPoint: 161.3, boilingPoint: 165.0, row: 5, col: 18 },

    // Period 6 - s and p block - NCERT values
    { atomicNumber: 55, symbol: 'Cs', name: 'Caesium', atomicMass: 132.91, category: 'Alkali Metal', block: 's', group: 1, period: 6, electronConfig: '[Xe]6s¹', atomicRadius: 265, ionicRadius: 167, ionizationEnergy: 376, electronegativity: 0.79, density: 1.90, meltingPoint: 302, boilingPoint: 944, standardReductionPotential: -2.927, flameColor: { color: 'Light blue', hexColor: '#87CEEB' }, oxides: ['Cs₂O'], oxideNature: 'basic', row: 6, col: 1 },
    { atomicNumber: 56, symbol: 'Ba', name: 'Barium', atomicMass: 137.33, category: 'Alkaline Earth Metal', block: 's', group: 2, period: 6, electronConfig: '[Xe]6s²', atomicRadius: 222, ionicRadius: 135, ionizationEnergy: 503, electronegativity: 0.89, density: 3.59, meltingPoint: 1002, boilingPoint: 2078, standardReductionPotential: -2.92, flameColor: { color: 'Green/yellow', hexColor: '#ADFF2F' }, oxides: ['BaO'], oxideNature: 'basic', row: 6, col: 2 },
    { atomicNumber: 81, symbol: 'Tl', name: 'Thallium', atomicMass: 204.38, category: 'Post-Transition Metal', block: 'p', group: 13, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p¹', atomicRadius: 170, ionicRadius: 150, ionizationEnergy: 589, electronegativity: 1.8, density: 11.85, meltingPoint: 576, boilingPoint: 1730, standardReductionPotential: -0.34, isException: true, exceptionType: 'Inert Pair Effect', exceptionExplanation: 'Tl shows +1 state more stable than +3 due to inert pair effect of 6s² electrons', row: 6, col: 13 },
    { atomicNumber: 82, symbol: 'Pb', name: 'Lead', atomicMass: 207.2, category: 'Post-Transition Metal', block: 'p', group: 14, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p²', atomicRadius: 146, ionicRadius: 119, ionizationEnergy: 715, electronegativity: 1.9, density: 11.34, meltingPoint: 600, boilingPoint: 2024, flameColor: { color: 'Grey/white', hexColor: '#D3D3D3' }, oxides: ['PbO', 'PbO₂', 'Pb₃O₄'], oxideNature: 'amphoteric', oxideNatureDetails: 'PbO is amphoteric oxide', isException: true, exceptionType: 'Inert Pair Effect', exceptionExplanation: 'Pb shows +2 state more stable than +4 due to inert pair effect', row: 6, col: 14 },
    { atomicNumber: 83, symbol: 'Bi', name: 'Bismuth', atomicMass: 208.98, category: 'Post-Transition Metal', block: 'p', group: 15, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p³', atomicRadius: 148, ionicRadius: 103, ionizationEnergy: 703, electronegativity: 1.9, density: 9.808, meltingPoint: 544, boilingPoint: 1837, isException: true, exceptionType: 'Inert Pair Effect', exceptionExplanation: 'Bi shows +3 state more stable than +5 due to inert pair effect', row: 6, col: 15 },
    { atomicNumber: 84, symbol: 'Po', name: 'Polonium', atomicMass: 210.00, category: 'Metalloid', block: 'p', group: 16, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁴', atomicRadius: 146, ionicRadius: 230, ionizationEnergy: 813, electronegativity: 1.76, electronAffinity: 174, density: 9.20, meltingPoint: 520, boilingPoint: 1235, row: 6, col: 16 },
    { atomicNumber: 85, symbol: 'At', name: 'Astatine', atomicMass: 210, category: 'Reactive Nonmetal', block: 'p', group: 17, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁵', atomicRadius: 127, ionizationEnergy: 920, electronegativity: 2.2, density: 7.00, meltingPoint: 575, boilingPoint: 610, row: 6, col: 17 },
    { atomicNumber: 86, symbol: 'Rn', name: 'Radon', atomicMass: 222.00, category: 'Noble Gas', block: 'p', group: 18, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²6p⁶', atomicRadius: 220, ionizationEnergy: 1037, electronAffinity: 68, density: 0.0097, meltingPoint: 211, boilingPoint: 211, row: 6, col: 18 },

    // Period 5 - d-block (4d series)
    { atomicNumber: 39, symbol: 'Y', name: 'Yttrium', atomicMass: 88.906, category: 'Transition Metal', block: 'd', group: 3, period: 5, electronConfig: '[Kr]4d¹5s²', atomicRadius: 212, ionizationEnergy: 600, electronegativity: 1.22, density: 4.47, meltingPoint: 1799, boilingPoint: 3609, row: 5, col: 3 },
    { atomicNumber: 40, symbol: 'Zr', name: 'Zirconium', atomicMass: 91.224, category: 'Transition Metal', block: 'd', group: 4, period: 5, electronConfig: '[Kr]4d²5s²', atomicRadius: 206, ionizationEnergy: 640, electronegativity: 1.33, density: 6.51, meltingPoint: 2128, boilingPoint: 4682, row: 5, col: 4 },
    { atomicNumber: 41, symbol: 'Nb', name: 'Niobium', atomicMass: 92.906, category: 'Transition Metal', block: 'd', group: 5, period: 5, electronConfig: '[Kr]4d⁴5s¹', atomicRadius: 198, ionizationEnergy: 652, electronegativity: 1.60, density: 8.57, meltingPoint: 2750, boilingPoint: 5017, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Nb has 4d⁴5s¹ instead of 4d³5s² for extra stability', row: 5, col: 5 },
    { atomicNumber: 42, symbol: 'Mo', name: 'Molybdenum', atomicMass: 95.95, category: 'Transition Metal', block: 'd', group: 6, period: 5, electronConfig: '[Kr]4d⁵5s¹', atomicRadius: 190, ionizationEnergy: 684, electronegativity: 2.16, density: 10.28, meltingPoint: 2896, boilingPoint: 4912, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Mo has 4d⁵5s¹ (like Cr) for half-filled d-orbital stability', row: 5, col: 6 },
    { atomicNumber: 43, symbol: 'Tc', name: 'Technetium', atomicMass: 98, category: 'Transition Metal', block: 'd', group: 7, period: 5, electronConfig: '[Kr]4d⁵5s²', atomicRadius: 183, ionizationEnergy: 702, electronegativity: 1.90, density: 11.50, meltingPoint: 2430, boilingPoint: 4538, row: 5, col: 7 },
    { atomicNumber: 44, symbol: 'Ru', name: 'Ruthenium', atomicMass: 101.07, category: 'Transition Metal', block: 'd', group: 8, period: 5, electronConfig: '[Kr]4d⁷5s¹', atomicRadius: 178, ionizationEnergy: 710, electronegativity: 2.20, density: 12.37, meltingPoint: 2607, boilingPoint: 4423, row: 5, col: 8 },
    { atomicNumber: 45, symbol: 'Rh', name: 'Rhodium', atomicMass: 102.91, category: 'Transition Metal', block: 'd', group: 9, period: 5, electronConfig: '[Kr]4d⁸5s¹', atomicRadius: 173, ionizationEnergy: 720, electronegativity: 2.28, density: 12.41, meltingPoint: 2237, boilingPoint: 3968, row: 5, col: 9 },
    { atomicNumber: 46, symbol: 'Pd', name: 'Palladium', atomicMass: 106.42, category: 'Transition Metal', block: 'd', group: 10, period: 5, electronConfig: '[Kr]4d¹⁰', atomicRadius: 169, ionizationEnergy: 804, electronegativity: 2.20, density: 12.02, meltingPoint: 1828, boilingPoint: 3236, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Pd has 4d¹⁰5s⁰ - unique case with no s electrons for complete d-orbital stability', row: 5, col: 10 },
    { atomicNumber: 47, symbol: 'Ag', name: 'Silver', atomicMass: 107.87, category: 'Transition Metal', block: 'd', group: 11, period: 5, electronConfig: '[Kr]4d¹⁰5s¹', atomicRadius: 165, ionizationEnergy: 731, electronegativity: 1.93, density: 10.49, meltingPoint: 1235, boilingPoint: 2435, standardReductionPotential: 0.80, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Ag has 4d¹⁰5s¹ (like Cu) for fully-filled d-orbital stability', row: 5, col: 11 },
    { atomicNumber: 48, symbol: 'Cd', name: 'Cadmium', atomicMass: 112.41, category: 'Transition Metal', block: 'd', group: 12, period: 5, electronConfig: '[Kr]4d¹⁰5s²', atomicRadius: 161, ionizationEnergy: 868, electronegativity: 1.69, density: 8.65, meltingPoint: 594, boilingPoint: 1040, standardReductionPotential: -0.40, row: 5, col: 12 },

    // Period 6 - d-block (5d series) - key elements
    { atomicNumber: 72, symbol: 'Hf', name: 'Hafnium', atomicMass: 178.49, category: 'Transition Metal', block: 'd', group: 4, period: 6, electronConfig: '[Xe]4f¹⁴5d²6s²', atomicRadius: 208, ionizationEnergy: 659, electronegativity: 1.30, density: 13.31, meltingPoint: 2506, boilingPoint: 4876, row: 6, col: 4 },
    { atomicNumber: 74, symbol: 'W', name: 'Tungsten', atomicMass: 183.84, category: 'Transition Metal', block: 'd', group: 6, period: 6, electronConfig: '[Xe]4f¹⁴5d⁴6s²', atomicRadius: 193, ionizationEnergy: 770, electronegativity: 2.36, density: 19.25, meltingPoint: 3695, boilingPoint: 5828, row: 6, col: 6 },
    { atomicNumber: 78, symbol: 'Pt', name: 'Platinum', atomicMass: 195.08, category: 'Transition Metal', block: 'd', group: 10, period: 6, electronConfig: '[Xe]4f¹⁴5d⁹6s¹', atomicRadius: 177, ionizationEnergy: 870, electronegativity: 2.28, density: 21.45, meltingPoint: 2041, boilingPoint: 4098, standardReductionPotential: 1.18, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Pt has 5d⁹6s¹ instead of 5d⁸6s² for better orbital stability', row: 6, col: 10 },
    { atomicNumber: 79, symbol: 'Au', name: 'Gold', atomicMass: 196.97, category: 'Transition Metal', block: 'd', group: 11, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s¹', atomicRadius: 174, ionizationEnergy: 890, electronegativity: 2.54, density: 19.30, meltingPoint: 1337, boilingPoint: 3129, standardReductionPotential: 1.69, isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Au has 5d¹⁰6s¹ (like Cu, Ag) for fully-filled d-orbital stability', row: 6, col: 11 },
    { atomicNumber: 80, symbol: 'Hg', name: 'Mercury', atomicMass: 200.59, category: 'Transition Metal', block: 'd', group: 12, period: 6, electronConfig: '[Xe]4f¹⁴5d¹⁰6s²', atomicRadius: 171, ionizationEnergy: 1007, electronegativity: 2.00, density: 13.55, meltingPoint: 234, boilingPoint: 630, standardReductionPotential: 0.85, isException: true, exceptionType: 'Physical Property', exceptionExplanation: 'Hg is liquid at room temperature - only liquid metal due to relativistic effects', row: 6, col: 12 },

    // Lanthanides (f-block) - Row 8 - NCERT values with exam-focused data
    { atomicNumber: 57, symbol: 'La', name: 'Lanthanum', atomicMass: 138.91, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]5d¹6s²', atomicRadius: 187, ionConfigs: { M2plus: '5d¹', M3plus: '4f⁰' }, ionicRadii: { M3plus: 106 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Empty 4f (4f⁰ in La³⁺)', row: 8, col: 3 },
    { atomicNumber: 58, symbol: 'Ce', name: 'Cerium', atomicMass: 140.12, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹5d¹6s²', atomicRadius: 183, ionConfigs: { M2plus: '4f²', M3plus: '4f¹', M4plus: '4f⁰' }, ionicRadii: { M3plus: 103, M4plus: 92 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Ce⁴⁺ has 4f⁰ (noble gas config)', redoxNature: 'oxidizing', redoxExplanation: 'Ce⁴⁺ is strong oxidant (E°=+1.74V), reverts to stable +3 state', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Ce shows +4 due to noble gas configuration (4f⁰)', row: 8, col: 4 },
    { atomicNumber: 59, symbol: 'Pr', name: 'Praseodymium', atomicMass: 140.91, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f³6s²', atomicRadius: 182, ionConfigs: { M3plus: '4f²', M4plus: '4f¹' }, ionicRadii: { M3plus: 101 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides (PrO₂)', row: 8, col: 5 },
    { atomicNumber: 60, symbol: 'Nd', name: 'Neodymium', atomicMass: 144.24, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁴6s²', atomicRadius: 181, ionConfigs: { M3plus: '4f³', M4plus: '4f²' }, ionicRadii: { M3plus: 99 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides (NdO₂)', row: 8, col: 6 },
    { atomicNumber: 61, symbol: 'Pm', name: 'Promethium', atomicMass: 145, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁵6s²', atomicRadius: 181, ionConfigs: { M3plus: '4f⁴' }, ionicRadii: { M3plus: 98 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Radioactive, no stable isotopes', row: 8, col: 7 },
    { atomicNumber: 62, symbol: 'Sm', name: 'Samarium', atomicMass: 150.36, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁶6s²', atomicRadius: 180, ionConfigs: { M2plus: '4f⁶', M3plus: '4f⁵' }, ionicRadii: { M3plus: 96 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Sm²⁺ (4f⁶) like Eu exhibits +2 state', redoxNature: 'reducing', redoxExplanation: 'Sm²⁺ reduces to Sm³⁺, behavior like Europium', row: 8, col: 8 },
    { atomicNumber: 63, symbol: 'Eu', name: 'Europium', atomicMass: 151.96, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁷6s²', atomicRadius: 199, ionConfigs: { M2plus: '4f⁷', M3plus: '4f⁶' }, ionicRadii: { M3plus: 95 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Half-filled 4f⁷ in Eu²⁺', redoxNature: 'reducing', redoxExplanation: 'Eu²⁺ is strong reducing agent → changes to +3. 4f⁷ half-filled stability', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Eu shows +2 due to half-filled 4f⁷ stability (like Ba)', row: 8, col: 9 },
    { atomicNumber: 64, symbol: 'Gd', name: 'Gadolinium', atomicMass: 157.25, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁷5d¹6s²', atomicRadius: 180, ionConfigs: { M3plus: '4f⁷' }, ionicRadii: { M3plus: 94 }, oxidationStates: [3], stableOxidationState: 3, fSubshellInfo: 'Half-filled 4f⁷ in Gd³⁺', isException: true, exceptionType: 'Electron Configuration', exceptionExplanation: 'Gd has 4f⁷5d¹6s² (not 4f⁸6s²) for half-filled f-orbital stability', row: 8, col: 10 },
    { atomicNumber: 65, symbol: 'Tb', name: 'Terbium', atomicMass: 158.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f⁹6s²', atomicRadius: 178, ionConfigs: { M3plus: '4f⁸', M4plus: '4f⁷' }, ionicRadii: { M3plus: 92, M4plus: 76 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: 'Tb⁴⁺ has half-filled 4f⁷', redoxNature: 'oxidizing', redoxExplanation: 'Tb⁴⁺ is oxidant due to half-filled 4f⁷ stability in Tb⁴⁺', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Tb shows +4 to achieve half-filled 4f⁷ configuration', row: 8, col: 11 },
    { atomicNumber: 66, symbol: 'Dy', name: 'Dysprosium', atomicMass: 162.50, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹⁰6s²', atomicRadius: 177, ionConfigs: { M3plus: '4f⁹', M4plus: '4f⁸' }, ionicRadii: { M3plus: 91, M4plus: 78 }, oxidationStates: [3, 4], stableOxidationState: 3, fSubshellInfo: '+4 state only in oxides', row: 8, col: 12 },
    { atomicNumber: 67, symbol: 'Ho', name: 'Holmium', atomicMass: 164.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹¹6s²', atomicRadius: 176, ionConfigs: { M3plus: '4f¹⁰' }, ionicRadii: { M3plus: 89 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 13 },
    { atomicNumber: 68, symbol: 'Er', name: 'Erbium', atomicMass: 167.26, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹²6s²', atomicRadius: 175, ionConfigs: { M3plus: '4f¹¹' }, ionicRadii: { M3plus: 88 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 14 },
    { atomicNumber: 69, symbol: 'Tm', name: 'Thulium', atomicMass: 168.93, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹³6s²', atomicRadius: 174, ionConfigs: { M3plus: '4f¹²' }, ionicRadii: { M3plus: 87 }, oxidationStates: [3], stableOxidationState: 3, row: 8, col: 15 },
    { atomicNumber: 70, symbol: 'Yb', name: 'Ytterbium', atomicMass: 173.05, category: 'Lanthanide', block: 'f', group: 3, period: 6, electronConfig: '[Xe]4f¹⁴6s²', atomicRadius: 173, ionConfigs: { M2plus: '4f¹⁴', M3plus: '4f¹³' }, ionicRadii: { M3plus: 86 }, oxidationStates: [2, 3], stableOxidationState: 3, fSubshellInfo: 'Full-filled 4f¹⁴ in Yb²⁺', redoxNature: 'reducing', redoxExplanation: 'Yb²⁺ is reducing agent due to fully-filled 4f¹⁴ stability', isException: true, exceptionType: 'Oxidation State', exceptionExplanation: 'Yb shows +2 due to fully-filled 4f¹⁴ stability', row: 8, col: 16 },
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
