// Ksp (Solubility Product) Data from NCERT
// All values are at 25°C

export type SaltType = 'AB' | 'AB2' | 'A2B' | 'AB3' | 'A3B' | 'A2B3';

export interface Salt {
    name: string;
    formula: string;
    ksp: number;
    kspExponent: number;
    kspCoefficient: number;
    cation: string;
    anion: string;
    type: SaltType;
    category: string;
}

// Helper to create salt entry
function createSalt(
    name: string,
    formula: string,
    coefficient: number,
    exponent: number,
    cation: string,
    anion: string,
    type: SaltType,
    category: string
): Salt {
    return {
        name,
        formula,
        ksp: coefficient * Math.pow(10, exponent),
        kspExponent: exponent,
        kspCoefficient: coefficient,
        cation,
        anion,
        type,
        category,
    };
}

export const kspData: Salt[] = [
    // Silver Salts
    createSalt('Silver Bromide', 'AgBr', 5.0, -13, 'Ag⁺', 'Br⁻', 'AB', 'Bromide'),
    createSalt('Silver Carbonate', 'Ag₂CO₃', 8.1, -12, 'Ag⁺', 'CO₃²⁻', 'A2B', 'Carbonate'),
    createSalt('Silver Chromate', 'Ag₂CrO₄', 1.1, -12, 'Ag⁺', 'CrO₄²⁻', 'A2B', 'Chromate'),
    createSalt('Silver Chloride', 'AgCl', 1.8, -10, 'Ag⁺', 'Cl⁻', 'AB', 'Chloride'),
    createSalt('Silver Iodide', 'AgI', 8.3, -17, 'Ag⁺', 'I⁻', 'AB', 'Iodide'),
    createSalt('Silver Sulphate', 'Ag₂SO₄', 1.4, -5, 'Ag⁺', 'SO₄²⁻', 'A2B', 'Sulphate'),

    // Aluminium
    createSalt('Aluminium Hydroxide', 'Al(OH)₃', 1.3, -33, 'Al³⁺', 'OH⁻', 'AB3', 'Hydroxide'),

    // Barium Salts
    createSalt('Barium Chromate', 'BaCrO₄', 1.2, -10, 'Ba²⁺', 'CrO₄²⁻', 'AB', 'Chromate'),
    createSalt('Barium Fluoride', 'BaF₂', 1.0, -6, 'Ba²⁺', 'F⁻', 'AB2', 'Fluoride'),
    createSalt('Barium Sulphate', 'BaSO₄', 1.1, -10, 'Ba²⁺', 'SO₄²⁻', 'AB', 'Sulphate'),

    // Calcium Salts
    createSalt('Calcium Carbonate', 'CaCO₃', 2.8, -9, 'Ca²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Calcium Fluoride', 'CaF₂', 5.3, -9, 'Ca²⁺', 'F⁻', 'AB2', 'Fluoride'),
    createSalt('Calcium Hydroxide', 'Ca(OH)₂', 5.5, -6, 'Ca²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Calcium Oxalate', 'CaC₂O₄', 4.0, -9, 'Ca²⁺', 'C₂O₄²⁻', 'AB', 'Oxalate'),
    createSalt('Calcium Sulphate', 'CaSO₄', 9.1, -6, 'Ca²⁺', 'SO₄²⁻', 'AB', 'Sulphate'),

    // Cadmium Salts
    createSalt('Cadmium Hydroxide', 'Cd(OH)₂', 2.5, -14, 'Cd²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Cadmium Sulphide', 'CdS', 8.0, -27, 'Cd²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Chromium
    createSalt('Chromic Hydroxide', 'Cr(OH)₃', 6.3, -31, 'Cr³⁺', 'OH⁻', 'AB3', 'Hydroxide'),

    // Copper Salts
    createSalt('Cuprous Bromide', 'CuBr', 5.3, -9, 'Cu⁺', 'Br⁻', 'AB', 'Bromide'),
    createSalt('Cupric Carbonate', 'CuCO₃', 1.4, -10, 'Cu²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Cuprous Chloride', 'CuCl', 1.7, -6, 'Cu⁺', 'Cl⁻', 'AB', 'Chloride'),
    createSalt('Cupric Hydroxide', 'Cu(OH)₂', 2.2, -20, 'Cu²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Cuprous Iodide', 'CuI', 1.1, -12, 'Cu⁺', 'I⁻', 'AB', 'Iodide'),
    createSalt('Cupric Sulphide', 'CuS', 6.3, -36, 'Cu²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Iron Salts
    createSalt('Ferrous Carbonate', 'FeCO₃', 3.2, -11, 'Fe²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Ferrous Hydroxide', 'Fe(OH)₂', 8.0, -16, 'Fe²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Ferric Hydroxide', 'Fe(OH)₃', 1.0, -38, 'Fe³⁺', 'OH⁻', 'AB3', 'Hydroxide'),
    createSalt('Ferrous Sulphide', 'FeS', 6.3, -18, 'Fe²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Mercury Salts
    createSalt('Mercurous Bromide', 'Hg₂Br₂', 5.6, -23, 'Hg₂²⁺', 'Br⁻', 'AB2', 'Bromide'),
    createSalt('Mercurous Chloride', 'Hg₂Cl₂', 1.3, -18, 'Hg₂²⁺', 'Cl⁻', 'AB2', 'Chloride'),
    createSalt('Mercurous Iodide', 'Hg₂I₂', 4.5, -29, 'Hg₂²⁺', 'I⁻', 'AB2', 'Iodide'),
    createSalt('Mercurous Sulphate', 'Hg₂SO₄', 7.4, -7, 'Hg₂²⁺', 'SO₄²⁻', 'AB', 'Sulphate'),
    createSalt('Mercuric Sulphide', 'HgS', 4.0, -53, 'Hg²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Magnesium Salts
    createSalt('Magnesium Carbonate', 'MgCO₃', 3.5, -8, 'Mg²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Magnesium Fluoride', 'MgF₂', 6.5, -9, 'Mg²⁺', 'F⁻', 'AB2', 'Fluoride'),
    createSalt('Magnesium Hydroxide', 'Mg(OH)₂', 1.8, -11, 'Mg²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Magnesium Oxalate', 'MgC₂O₄', 7.0, -7, 'Mg²⁺', 'C₂O₄²⁻', 'AB', 'Oxalate'),

    // Manganese Salts
    createSalt('Manganese Carbonate', 'MnCO₃', 1.8, -11, 'Mn²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Manganese Sulphide', 'MnS', 2.5, -13, 'Mn²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Nickel Salts
    createSalt('Nickel Hydroxide', 'Ni(OH)₂', 2.0, -15, 'Ni²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Nickel Sulphide', 'NiS', 4.7, -5, 'Ni²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Lead Salts
    createSalt('Lead Bromide', 'PbBr₂', 4.0, -5, 'Pb²⁺', 'Br⁻', 'AB2', 'Bromide'),
    createSalt('Lead Carbonate', 'PbCO₃', 7.4, -14, 'Pb²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Lead Chloride', 'PbCl₂', 1.6, -5, 'Pb²⁺', 'Cl⁻', 'AB2', 'Chloride'),
    createSalt('Lead Fluoride', 'PbF₂', 7.7, -8, 'Pb²⁺', 'F⁻', 'AB2', 'Fluoride'),
    createSalt('Lead Hydroxide', 'Pb(OH)₂', 1.2, -15, 'Pb²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Lead Iodide', 'PbI₂', 7.1, -9, 'Pb²⁺', 'I⁻', 'AB2', 'Iodide'),
    createSalt('Lead Sulphate', 'PbSO₄', 1.6, -8, 'Pb²⁺', 'SO₄²⁻', 'AB', 'Sulphate'),
    createSalt('Lead Sulphide', 'PbS', 8.0, -28, 'Pb²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Tin Salts
    createSalt('Stannous Hydroxide', 'Sn(OH)₂', 1.4, -28, 'Sn²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Stannous Sulphide', 'SnS', 1.0, -25, 'Sn²⁺', 'S²⁻', 'AB', 'Sulphide'),

    // Strontium Salts
    createSalt('Strontium Carbonate', 'SrCO₃', 1.1, -10, 'Sr²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Strontium Fluoride', 'SrF₂', 2.5, -9, 'Sr²⁺', 'F⁻', 'AB2', 'Fluoride'),
    createSalt('Strontium Sulphate', 'SrSO₄', 3.2, -7, 'Sr²⁺', 'SO₄²⁻', 'AB', 'Sulphate'),

    // Thallium Salts
    createSalt('Thallous Bromide', 'TlBr', 3.4, -6, 'Tl⁺', 'Br⁻', 'AB', 'Bromide'),
    createSalt('Thallous Chloride', 'TlCl', 1.7, -4, 'Tl⁺', 'Cl⁻', 'AB', 'Chloride'),
    createSalt('Thallous Iodide', 'TlI', 6.5, -8, 'Tl⁺', 'I⁻', 'AB', 'Iodide'),

    // Zinc Salts
    createSalt('Zinc Carbonate', 'ZnCO₃', 1.4, -11, 'Zn²⁺', 'CO₃²⁻', 'AB', 'Carbonate'),
    createSalt('Zinc Hydroxide', 'Zn(OH)₂', 1.0, -15, 'Zn²⁺', 'OH⁻', 'AB2', 'Hydroxide'),
    createSalt('Zinc Sulphide', 'ZnS', 1.6, -24, 'Zn²⁺', 'S²⁻', 'AB', 'Sulphide'),
];

// Get unique categories for filtering
export const categories = [...new Set(kspData.map(s => s.category))].sort();

// Salt type formulas for solubility calculation
export const solubilityFormulas: Record<SaltType, { expression: string; formula: string; calculate: (ksp: number) => number }> = {
    'AB': {
        expression: 'Ksp = s × s = s²',
        formula: 's = √Ksp',
        calculate: (ksp) => Math.sqrt(ksp),
    },
    'AB2': {
        expression: 'Ksp = s × (2s)² = 4s³',
        formula: 's = ∛(Ksp/4)',
        calculate: (ksp) => Math.cbrt(ksp / 4),
    },
    'A2B': {
        expression: 'Ksp = (2s)² × s = 4s³',
        formula: 's = ∛(Ksp/4)',
        calculate: (ksp) => Math.cbrt(ksp / 4),
    },
    'AB3': {
        expression: 'Ksp = s × (3s)³ = 27s⁴',
        formula: 's = ⁴√(Ksp/27)',
        calculate: (ksp) => Math.pow(ksp / 27, 0.25),
    },
    'A3B': {
        expression: 'Ksp = (3s)³ × s = 27s⁴',
        formula: 's = ⁴√(Ksp/27)',
        calculate: (ksp) => Math.pow(ksp / 27, 0.25),
    },
    'A2B3': {
        expression: 'Ksp = (2s)² × (3s)³ = 108s⁵',
        formula: 's = ⁵√(Ksp/108)',
        calculate: (ksp) => Math.pow(ksp / 108, 0.2),
    },
};

// Helper to format Ksp for display (returns parts for custom rendering)
export function formatKspParts(salt: Salt): { coefficient: number; exponent: number } {
    return { coefficient: salt.kspCoefficient, exponent: salt.kspExponent };
}

// Legacy format for simple string display
export function formatKsp(salt: Salt): string {
    const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const exp = salt.kspExponent;
    const absExp = Math.abs(exp);
    const digits = absExp.toString().split('').map(d => superscriptDigits[parseInt(d)]).join('');
    return `${salt.kspCoefficient} × 10${exp < 0 ? '⁻' : ''}${digits}`;
}

// Calculate molar solubility
export function calculateSolubility(salt: Salt): number {
    return solubilityFormulas[salt.type].calculate(salt.ksp);
}

// Format solubility for display (returns parts for custom rendering)
export function formatSolubilityParts(s: number): { coefficient: number; exponent: number } {
    if (s === 0) return { coefficient: 0, exponent: 0 };
    const exp = Math.floor(Math.log10(Math.abs(s)));
    const coef = s / Math.pow(10, exp);
    return { coefficient: parseFloat(coef.toFixed(2)), exponent: exp };
}

// Legacy format for simple string display
export function formatSolubility(s: number): string {
    const { coefficient, exponent } = formatSolubilityParts(s);
    const superscriptDigits = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    const absExp = Math.abs(exponent);
    const digits = absExp.toString().split('').map(d => superscriptDigits[parseInt(d)]).join('');
    return `${coefficient} × 10${exponent < 0 ? '⁻' : ''}${digits}`;
}

// Get dissociation equation
export function getDissociationEquation(salt: Salt): string {
    const { formula, cation, anion, type } = salt;

    switch (type) {
        case 'AB':
            return `${formula} ⇌ ${cation} + ${anion}`;
        case 'AB2':
            return `${formula} ⇌ ${cation} + 2${anion}`;
        case 'A2B':
            return `${formula} ⇌ 2${cation} + ${anion}`;
        case 'AB3':
            return `${formula} ⇌ ${cation} + 3${anion}`;
        case 'A3B':
            return `${formula} ⇌ 3${cation} + ${anion}`;
        case 'A2B3':
            return `${formula} ⇌ 2${cation} + 3${anion}`;
        default:
            return `${formula} ⇌ ions`;
    }
}
