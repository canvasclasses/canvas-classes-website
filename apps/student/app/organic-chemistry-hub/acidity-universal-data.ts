// ══════════════════════════════════════════════════════════════════════════════
// UNIVERSAL ACIDITY LAB DATA
// ══════════════════════════════════════════════════════════════════════════════
// Comprehensive pKa data for phenol, benzoic acid, and aniline derivatives
// Source: Dissociation Constants of Organic Bases in Aqueous Solution (Perrin)
// All values at 25°C unless otherwise noted
// ══════════════════════════════════════════════════════════════════════════════

export type AcidFamily = 'phenol' | 'benzoic' | 'aniline' | 'aliphatic';
export type Position = 'ortho' | 'meta' | 'para';
export type DataSource = 'EXPERIMENTAL' | 'CALCULATED' | 'ESTIMATED';

export interface PkaDataPoint {
  acidFamily: AcidFamily;
  substituent: string;
  substituentSymbol: string; // Display symbol (e.g., 'NO₂', 'CH₃')
  position: Position | null; // null for unsubstituted
  pKa: number;
  dataSource: DataSource;
  reference: string;
  notes?: string;
  temperature?: number; // °C, default 25
}

// ── PHENOL DERIVATIVES (C₆H₅OH) ───────────────────────────────────────────────
// pKa of phenolic OH group
// Base compound: Phenol (C₆H₅OH) pKa = 9.99

export const PHENOL_PKA_DATA: PkaDataPoint[] = [
  // Unsubstituted
  { acidFamily: 'phenol', substituent: 'H', substituentSymbol: 'H', position: null, pKa: 9.99, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Nitro substituents (strong EWG)
  { acidFamily: 'phenol', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'ortho', pKa: 7.23, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'meta', pKa: 8.36, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'para', pKa: 7.16, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Chloro substituents
  { acidFamily: 'phenol', substituent: 'Cl', substituentSymbol: 'Cl', position: 'ortho', pKa: 8.56, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'Cl', substituentSymbol: 'Cl', position: 'meta', pKa: 9.12, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'Cl', substituentSymbol: 'Cl', position: 'para', pKa: 9.41, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Bromo substituents
  { acidFamily: 'phenol', substituent: 'Br', substituentSymbol: 'Br', position: 'ortho', pKa: 8.45, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'Br', substituentSymbol: 'Br', position: 'meta', pKa: 9.03, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'Br', substituentSymbol: 'Br', position: 'para', pKa: 9.37, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Iodo substituents
  { acidFamily: 'phenol', substituent: 'I', substituentSymbol: 'I', position: 'ortho', pKa: 8.51, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'I', substituentSymbol: 'I', position: 'meta', pKa: 9.03, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'I', substituentSymbol: 'I', position: 'para', pKa: 9.33, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Fluoro substituents
  { acidFamily: 'phenol', substituent: 'F', substituentSymbol: 'F', position: 'ortho', pKa: 8.73, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'F', substituentSymbol: 'F', position: 'meta', pKa: 9.29, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'F', substituentSymbol: 'F', position: 'para', pKa: 9.89, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Methyl substituents (EDG)
  { acidFamily: 'phenol', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'ortho', pKa: 10.29, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'o-Cresol' },
  { acidFamily: 'phenol', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'meta', pKa: 10.09, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'm-Cresol' },
  { acidFamily: 'phenol', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'para', pKa: 10.26, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'p-Cresol' },
  
  // Methoxy substituents (EDG)
  { acidFamily: 'phenol', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'ortho', pKa: 9.98, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'meta', pKa: 9.65, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'para', pKa: 10.21, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Amino substituents (strong EDG)
  { acidFamily: 'phenol', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'ortho', pKa: 4.78, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 20, notes: '2-Aminophenol' },
  { acidFamily: 'phenol', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'meta', pKa: 9.82, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 20 },
  { acidFamily: 'phenol', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'para', pKa: 5.48, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 20, notes: '4-Aminophenol' },
  
  // Hydroxyl substituents (creates dihydroxybenzenes)
  { acidFamily: 'phenol', substituent: 'OH', substituentSymbol: 'OH', position: 'ortho', pKa: 9.34, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Catechol (1,2-dihydroxybenzene)' },
  { acidFamily: 'phenol', substituent: 'OH', substituentSymbol: 'OH', position: 'meta', pKa: 9.32, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Resorcinol (1,3-dihydroxybenzene)' },
  { acidFamily: 'phenol', substituent: 'OH', substituentSymbol: 'OH', position: 'para', pKa: 9.85, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Hydroquinone (1,4-dihydroxybenzene) - first pKa' },
  
  // Cyano substituents
  { acidFamily: 'phenol', substituent: 'CN', substituentSymbol: 'CN', position: 'meta', pKa: 8.61, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'phenol', substituent: 'CN', substituentSymbol: 'CN', position: 'para', pKa: 7.97, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // tert-Butyl substituents
  { acidFamily: 'phenol', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'ortho', pKa: 10.62, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '2-tert-Butylphenol' },
  { acidFamily: 'phenol', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'meta', pKa: 10.12, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '3-tert-Butylphenol' },
  { acidFamily: 'phenol', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'para', pKa: 10.23, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '4-tert-Butylphenol' },
  
  // Phenyl substituents
  { acidFamily: 'phenol', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'ortho', pKa: 10.01, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '2-Hydroxybiphenyl' },
  { acidFamily: 'phenol', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'meta', pKa: 9.64, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '3-Hydroxybiphenyl' },
  { acidFamily: 'phenol', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'para', pKa: 9.55, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: '4-Hydroxybiphenyl' },
];

// ── BENZOIC ACID DERIVATIVES (C₆H₅COOH) ───────────────────────────────────────
// pKa of carboxylic acid group
// Base compound: Benzoic acid (C₆H₅COOH) pKa = 4.204

export const BENZOIC_ACID_PKA_DATA: PkaDataPoint[] = [
  // Unsubstituted
  { acidFamily: 'benzoic', substituent: 'H', substituentSymbol: 'H', position: null, pKa: 4.204, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Nitro substituents
  { acidFamily: 'benzoic', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'ortho', pKa: 2.17, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'meta', pKa: 3.46, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'para', pKa: 3.43, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Chloro substituents
  { acidFamily: 'benzoic', substituent: 'Cl', substituentSymbol: 'Cl', position: 'ortho', pKa: 2.90, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'Cl', substituentSymbol: 'Cl', position: 'meta', pKa: 3.84, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'Cl', substituentSymbol: 'Cl', position: 'para', pKa: 4.00, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Bromo substituents
  { acidFamily: 'benzoic', substituent: 'Br', substituentSymbol: 'Br', position: 'ortho', pKa: 2.85, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'Br', substituentSymbol: 'Br', position: 'meta', pKa: 3.81, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'Br', substituentSymbol: 'Br', position: 'para', pKa: 3.96, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Iodo substituents
  { acidFamily: 'benzoic', substituent: 'I', substituentSymbol: 'I', position: 'ortho', pKa: 2.86, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'I', substituentSymbol: 'I', position: 'meta', pKa: 3.87, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'I', substituentSymbol: 'I', position: 'para', pKa: 4.00, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Fluoro substituents
  { acidFamily: 'benzoic', substituent: 'F', substituentSymbol: 'F', position: 'ortho', pKa: 3.27, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'F', substituentSymbol: 'F', position: 'meta', pKa: 3.86, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'F', substituentSymbol: 'F', position: 'para', pKa: 4.15, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Methyl substituents
  { acidFamily: 'benzoic', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'ortho', pKa: 3.91, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'o-Toluic acid' },
  { acidFamily: 'benzoic', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'meta', pKa: 4.25, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'm-Toluic acid' },
  { acidFamily: 'benzoic', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'para', pKa: 4.37, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'p-Toluic acid' },
  
  // Methoxy substituents
  { acidFamily: 'benzoic', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'ortho', pKa: 4.08, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'meta', pKa: 4.10, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'para', pKa: 4.50, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Anisic acid' },
  
  // Hydroxyl substituents
  { acidFamily: 'benzoic', substituent: 'OH', substituentSymbol: 'OH', position: 'ortho', pKa: 2.98, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 20, notes: 'Salicylic acid' },
  { acidFamily: 'benzoic', substituent: 'OH', substituentSymbol: 'OH', position: 'meta', pKa: 4.08, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'OH', substituentSymbol: 'OH', position: 'para', pKa: 4.57, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Amino substituents
  { acidFamily: 'benzoic', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'ortho', pKa: 4.85, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Anthranilic acid' },
  { acidFamily: 'benzoic', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'meta', pKa: 4.79, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'NH2', substituentSymbol: 'NH₂', position: 'para', pKa: 4.87, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Cyano substituents
  { acidFamily: 'benzoic', substituent: 'CN', substituentSymbol: 'CN', position: 'ortho', pKa: 3.14, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'CN', substituentSymbol: 'CN', position: 'meta', pKa: 3.64, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'CN', substituentSymbol: 'CN', position: 'para', pKa: 3.55, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Trifluoromethyl substituents
  { acidFamily: 'benzoic', substituent: 'CF3', substituentSymbol: 'CF₃', position: 'ortho', pKa: 3.49, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'CF3', substituentSymbol: 'CF₃', position: 'meta', pKa: 3.77, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'CF3', substituentSymbol: 'CF₃', position: 'para', pKa: 3.66, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // tert-Butyl substituents
  { acidFamily: 'benzoic', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'ortho', pKa: 3.54, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'meta', pKa: 4.20, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'C(CH3)3', substituentSymbol: 'C(CH₃)₃', position: 'para', pKa: 4.38, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Phenyl substituents
  { acidFamily: 'benzoic', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'ortho', pKa: 3.46, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'meta', pKa: 3.95, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'benzoic', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: 'para', pKa: 4.57, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
];

// ── ANILINE DERIVATIVES (C₆H₅NH₂) ────────────────────────────────────────────
// pKa of conjugate acid (C₆H₅NH₃⁺)
// Base compound: Aniline (C₆H₅NH₂) pKa = 4.87 (of NH₃⁺)

export const ANILINE_PKA_DATA: PkaDataPoint[] = [
  // Unsubstituted
  { acidFamily: 'aniline', substituent: 'H', substituentSymbol: 'H', position: null, pKa: 4.87, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'pKa of C₆H₅NH₃⁺' },
  
  // Nitro substituents (strong EWG - dramatically lowers basicity)
  { acidFamily: 'aniline', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'ortho', pKa: -0.25, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Very weak base' },
  { acidFamily: 'aniline', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'meta', pKa: 2.46, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'NO2', substituentSymbol: 'NO₂', position: 'para', pKa: 1.02, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Chloro substituents
  { acidFamily: 'aniline', substituent: 'Cl', substituentSymbol: 'Cl', position: 'ortho', pKa: 2.66, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'Cl', substituentSymbol: 'Cl', position: 'meta', pKa: 3.52, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'Cl', substituentSymbol: 'Cl', position: 'para', pKa: 3.98, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Bromo substituents
  { acidFamily: 'aniline', substituent: 'Br', substituentSymbol: 'Br', position: 'ortho', pKa: 2.53, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'Br', substituentSymbol: 'Br', position: 'meta', pKa: 3.53, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'Br', substituentSymbol: 'Br', position: 'para', pKa: 3.89, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Iodo substituents
  { acidFamily: 'aniline', substituent: 'I', substituentSymbol: 'I', position: 'ortho', pKa: 2.54, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'I', substituentSymbol: 'I', position: 'meta', pKa: 3.58, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'I', substituentSymbol: 'I', position: 'para', pKa: 3.81, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Fluoro substituents
  { acidFamily: 'aniline', substituent: 'F', substituentSymbol: 'F', position: 'ortho', pKa: 3.20, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'F', substituentSymbol: 'F', position: 'meta', pKa: 3.59, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'F', substituentSymbol: 'F', position: 'para', pKa: 4.65, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Methyl substituents (EDG - increases basicity)
  { acidFamily: 'aniline', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'ortho', pKa: 4.45, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'o-Toluidine' },
  { acidFamily: 'aniline', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'meta', pKa: 4.71, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'm-Toluidine' },
  { acidFamily: 'aniline', substituent: 'CH3', substituentSymbol: 'CH₃', position: 'para', pKa: 5.08, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'p-Toluidine' },
  
  // Methoxy substituents (EDG)
  { acidFamily: 'aniline', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'ortho', pKa: 4.52, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'o-Anisidine' },
  { acidFamily: 'aniline', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'meta', pKa: 4.20, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'm-Anisidine' },
  { acidFamily: 'aniline', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: 'para', pKa: 5.36, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'p-Anisidine' },
  
  // Cyano substituents
  { acidFamily: 'aniline', substituent: 'CN', substituentSymbol: 'CN', position: 'meta', pKa: 2.76, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'CN', substituentSymbol: 'CN', position: 'para', pKa: 1.74, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  
  // Ethyl substituents
  { acidFamily: 'aniline', substituent: 'C2H5', substituentSymbol: 'C₂H₅', position: 'ortho', pKa: 4.35, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'C2H5', substituentSymbol: 'C₂H₅', position: 'meta', pKa: 4.71, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
  { acidFamily: 'aniline', substituent: 'C2H5', substituentSymbol: 'C₂H₅', position: 'para', pKa: 5.08, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25 },
];

// ── ALIPHATIC CARBOXYLIC ACIDS (Y–CH₂–COOH) ───────────────────────────────────
// pKa of carboxylic acid group
// Base compound: Acetic acid (CH₃COOH) pKa = 4.74
// Note: position is always null for aliphatic acids (no ortho/meta/para)

export const ALIPHATIC_ACID_PKA_DATA: PkaDataPoint[] = [
  // Unsubstituted
  { acidFamily: 'aliphatic', substituent: 'H', substituentSymbol: 'H', position: null, pKa: 4.74, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Acetic acid (CH₃COOH)' },
  
  // Strong EWG substituents
  { acidFamily: 'aliphatic', substituent: 'CN', substituentSymbol: 'CN', position: null, pKa: 2.47, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Cyanoacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'F', substituentSymbol: 'F', position: null, pKa: 2.59, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Fluoroacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'Cl', substituentSymbol: 'Cl', position: null, pKa: 2.85, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Chloroacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'Br', substituentSymbol: 'Br', position: null, pKa: 2.90, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Bromoacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'CF3', substituentSymbol: 'CF₃', position: null, pKa: 3.06, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Trifluoroacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'I', substituentSymbol: 'I', position: null, pKa: 3.18, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Iodoacetic acid' },
  
  // Moderate EWG/EDG substituents
  { acidFamily: 'aliphatic', substituent: 'OCH3', substituentSymbol: 'OCH₃', position: null, pKa: 3.57, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Methoxyacetic acid' },
  { acidFamily: 'aliphatic', substituent: 'OH', substituentSymbol: 'OH', position: null, pKa: 3.83, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Glycolic acid (Hydroxyacetic acid)' },
  { acidFamily: 'aliphatic', substituent: 'C6H5', substituentSymbol: 'C₆H₅', position: null, pKa: 4.31, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Phenylacetic acid' },
  
  // Alkyl substituents (EDG)
  { acidFamily: 'aliphatic', substituent: 'C2H5', substituentSymbol: 'C₂H₅', position: null, pKa: 4.82, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Propionic acid (CH₃CH₂COOH)' },
  { acidFamily: 'aliphatic', substituent: 'CH3', substituentSymbol: 'CH₃', position: null, pKa: 4.87, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Propionic acid (CH₃CH₂COOH)' },
  
  // Nitro substituent
  { acidFamily: 'aliphatic', substituent: 'NO2', substituentSymbol: 'NO₂', position: null, pKa: 1.68, dataSource: 'EXPERIMENTAL', reference: 'Perrin', temperature: 25, notes: 'Nitroacetic acid' },
];

// ── UTILITY FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Get pKa value for a specific acid family + substituent + position combination
 */
export function getPka(
  acidFamily: AcidFamily,
  substituent: string,
  position: Position | null
): PkaDataPoint | null {
  const dataset = 
    acidFamily === 'phenol' ? PHENOL_PKA_DATA :
    acidFamily === 'benzoic' ? BENZOIC_ACID_PKA_DATA :
    acidFamily === 'aniline' ? ANILINE_PKA_DATA :
    ALIPHATIC_ACID_PKA_DATA;
  
  return dataset.find(
    d => d.substituent === substituent && d.position === position
  ) || null;
}

/**
 * Get all available substituents for a given acid family
 */
export function getAvailableSubstituents(acidFamily: AcidFamily): string[] {
  const dataset = 
    acidFamily === 'phenol' ? PHENOL_PKA_DATA :
    acidFamily === 'benzoic' ? BENZOIC_ACID_PKA_DATA :
    acidFamily === 'aniline' ? ANILINE_PKA_DATA :
    ALIPHATIC_ACID_PKA_DATA;
  
  const unique = new Set(dataset.map(d => d.substituent));
  return Array.from(unique).sort();
}

/**
 * Get compound name for display
 */
export function getCompoundName(
  acidFamily: AcidFamily,
  substituent: string,
  position: Position | null
): string {
  if (substituent === 'H' || position === null) {
    if (acidFamily === 'phenol') return 'Phenol';
    if (acidFamily === 'benzoic') return 'Benzoic acid';
    if (acidFamily === 'aniline') return 'Aniline';
  }
  
  const posPrefix = position ? `${position[0]}-` : '';
  
  // Special names
  if (acidFamily === 'phenol' && substituent === 'CH3') {
    return `${posPrefix}Cresol`;
  }
  if (acidFamily === 'benzoic' && substituent === 'CH3') {
    return `${posPrefix}Toluic acid`;
  }
  if (acidFamily === 'benzoic' && substituent === 'OH' && position === 'ortho') {
    return 'Salicylic acid';
  }
  if (acidFamily === 'aniline' && substituent === 'CH3') {
    return `${posPrefix}Toluidine`;
  }
  
  // Generic names
  const data = getPka(acidFamily, substituent, position);
  if (data?.notes) return data.notes;
  
  const baseName = 
    acidFamily === 'phenol' ? 'phenol' :
    acidFamily === 'benzoic' ? 'benzoic acid' :
    acidFamily === 'aniline' ? 'aniline' :
    'acetic acid';
  
  return `${posPrefix}${data?.substituentSymbol || substituent}-${baseName}`;
}

// ── EXPORT ALL DATA ───────────────────────────────────────────────────────────

export const ALL_PKA_DATA = [
  ...PHENOL_PKA_DATA,
  ...BENZOIC_ACID_PKA_DATA,
  ...ANILINE_PKA_DATA,
  ...ALIPHATIC_ACID_PKA_DATA,
];

// Statistics
export const DATA_STATS = {
  totalCompounds: ALL_PKA_DATA.length,
  phenolDerivatives: PHENOL_PKA_DATA.length,
  benzoicAcidDerivatives: BENZOIC_ACID_PKA_DATA.length,
  anilineDerivatives: ANILINE_PKA_DATA.length,
  aliphaticAcidDerivatives: ALIPHATIC_ACID_PKA_DATA.length,
  experimentalValues: ALL_PKA_DATA.filter(d => d.dataSource === 'EXPERIMENTAL').length,
};
