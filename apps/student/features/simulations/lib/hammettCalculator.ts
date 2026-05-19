// ══════════════════════════════════════════════════════════════════════════════
// HAMMETT EQUATION CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
// Calculates pKa values using Hammett linear free energy relationships
// For combinations not available in experimental data
// ══════════════════════════════════════════════════════════════════════════════

import type { AcidFamily, Position } from '@/app/organic-chemistry-hub/acidity-universal-data';

// ── HAMMETT SUBSTITUENT CONSTANTS (σ) ─────────────────────────────────────────
// Source: C. Hansch, A. Leo, R. W. Taft, Chem. Rev. 1991, 91, 165-195

export interface HammettSigma {
  substituent: string;
  ortho: number;
  meta: number;
  para: number;
}

export const HAMMETT_SIGMA_VALUES: HammettSigma[] = [
  { substituent: 'H', ortho: 0, meta: 0, para: 0 },
  { substituent: 'NO2', ortho: 0.92, meta: 0.71, para: 0.78 },
  { substituent: 'CN', ortho: 0.56, meta: 0.56, para: 0.66 },
  { substituent: 'COOH', ortho: 0.43, meta: 0.37, para: 0.45 },
  { substituent: 'CHO', ortho: 0.56, meta: 0.35, para: 0.42 },
  { substituent: 'CF3', ortho: 0.40, meta: 0.43, para: 0.54 },
  { substituent: 'Cl', ortho: 0.23, meta: 0.37, para: 0.23 },
  { substituent: 'Br', ortho: 0.22, meta: 0.39, para: 0.23 },
  { substituent: 'I', ortho: 0.22, meta: 0.35, para: 0.18 },
  { substituent: 'F', ortho: 0.18, meta: 0.34, para: 0.06 },
  { substituent: 'OH', ortho: -0.13, meta: 0.12, para: -0.37 },
  { substituent: 'OCH3', ortho: 0.12, meta: 0.12, para: -0.27 },
  { substituent: 'NH2', ortho: -0.16, meta: -0.16, para: -0.66 },
  { substituent: 'N(CH3)2', ortho: 0.10, meta: -0.10, para: -0.83 },
  { substituent: 'CH3', ortho: -0.13, meta: -0.07, para: -0.17 },
  { substituent: 'C2H5', ortho: -0.13, meta: -0.07, para: -0.15 },
  { substituent: 'C(CH3)3', ortho: -0.14, meta: -0.10, para: -0.20 },
  { substituent: 'C6H5', ortho: 0.06, meta: 0.06, para: -0.01 },
  { substituent: 'SO3H', ortho: 0.55, meta: 0.52, para: 0.50 },
];

// ── REACTION CONSTANTS (ρ) ────────────────────────────────────────────────────
// Different for each acid family

export const RHO_VALUES: Record<AcidFamily, number> = {
  phenol: 2.23,      // Phenol ionization
  benzoic: 1.00,     // Benzoic acid ionization (reference = 1.0)
  aniline: 2.90,     // Aniline protonation (conjugate acid)
  aliphatic: 1.00,   // Aliphatic carboxylic acid ionization (similar to benzoic)
};

// ── BASE pKa VALUES ───────────────────────────────────────────────────────────

export const BASE_PKA: Record<AcidFamily, number> = {
  phenol: 9.99,
  benzoic: 4.204,
  aniline: 4.87,
  aliphatic: 4.74,  // Acetic acid (CH₃COOH)
};

// ── HAMMETT EQUATION CALCULATOR ───────────────────────────────────────────────

export interface HammettCalculationResult {
  pKa: number;
  confidence: 'high' | 'medium' | 'low';
  method: 'experimental' | 'hammett';
  details: {
    basePka: number;
    sigma: number;
    rho: number;
    delta: number;
  };
}

/**
 * Calculate pKa using Hammett equation: pKa = pKa₀ - ρ × σ
 * 
 * For acids (phenol, benzoic acid): Lower pKa = more acidic
 * - EWG (positive σ) → pKa decreases (more acidic)
 * - EDG (negative σ) → pKa increases (less acidic)
 * 
 * For bases (aniline): pKa of conjugate acid
 * - EWG → pKa decreases (weaker base)
 * - EDG → pKa increases (stronger base)
 */
export function calculatePkaHammett(
  acidFamily: AcidFamily,
  substituent: string,
  position: Position | null
): HammettCalculationResult | null {
  // Get base pKa
  const basePka = BASE_PKA[acidFamily];
  
  // Unsubstituted case
  if (substituent === 'H' || position === null) {
    return {
      pKa: basePka,
      confidence: 'high',
      method: 'experimental',
      details: {
        basePka,
        sigma: 0,
        rho: 0,
        delta: 0,
      },
    };
  }
  
  // Find sigma value
  const sigmaData = HAMMETT_SIGMA_VALUES.find(s => s.substituent === substituent);
  if (!sigmaData) {
    return null; // Substituent not in database
  }
  
  const sigma = sigmaData[position];
  const rho = RHO_VALUES[acidFamily];
  
  // Hammett equation: pKa = pKa₀ - ρ × σ
  const delta = rho * sigma;
  const calculatedPka = basePka - delta;
  
  // Determine confidence based on position and substituent type
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  // Meta and para positions generally follow Hammett well
  if (position === 'meta' || position === 'para') {
    confidence = 'high';
  }
  
  // Ortho positions can have steric/field effects not captured by Hammett
  if (position === 'ortho') {
    confidence = 'medium';
    
    // Large substituents at ortho are less reliable
    if (['C(CH3)3', 'C6H5'].includes(substituent)) {
      confidence = 'low';
    }
  }
  
  // Strong resonance donors/acceptors at para are very reliable
  if (position === 'para' && ['NO2', 'CN', 'NH2', 'N(CH3)2', 'OH', 'OCH3'].includes(substituent)) {
    confidence = 'high';
  }
  
  return {
    pKa: Number(calculatedPka.toFixed(2)),
    confidence,
    method: 'hammett',
    details: {
      basePka,
      sigma,
      rho,
      delta: Number(delta.toFixed(2)),
    },
  };
}

/**
 * Validate Hammett calculation against experimental data
 * Returns deviation in pKa units
 */
export function validateHammettCalculation(
  acidFamily: AcidFamily,
  substituent: string,
  position: Position | null,
  experimentalPka: number
): number {
  const calculated = calculatePkaHammett(acidFamily, substituent, position);
  if (!calculated) return Infinity;
  
  return Math.abs(calculated.pKa - experimentalPka);
}

/**
 * Get accuracy assessment for Hammett calculation
 */
export function getHammettAccuracy(deviation: number): {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
} {
  if (deviation < 0.2) {
    return {
      level: 'excellent',
      description: 'Hammett prediction within ±0.2 pKa units',
    };
  } else if (deviation < 0.5) {
    return {
      level: 'good',
      description: 'Hammett prediction within ±0.5 pKa units',
    };
  } else if (deviation < 1.0) {
    return {
      level: 'fair',
      description: 'Hammett prediction within ±1.0 pKa units',
    };
  } else {
    return {
      level: 'poor',
      description: 'Hammett prediction deviates >1.0 pKa units',
    };
  }
}

/**
 * Calculate pKa for disubstituted compounds using additive Hammett
 * pKa = pKa₀ - ρ × (σ₁ + σ₂)
 */
export function calculateDisubstitutedPka(
  acidFamily: AcidFamily,
  substituent1: string,
  position1: Position,
  substituent2: string,
  position2: Position
): HammettCalculationResult | null {
  // Prevent same position
  if (position1 === position2) {
    return null;
  }
  
  const basePka = BASE_PKA[acidFamily];
  const rho = RHO_VALUES[acidFamily];
  
  // Get sigma values
  const sigma1Data = HAMMETT_SIGMA_VALUES.find(s => s.substituent === substituent1);
  const sigma2Data = HAMMETT_SIGMA_VALUES.find(s => s.substituent === substituent2);
  
  if (!sigma1Data || !sigma2Data) {
    return null;
  }
  
  const sigma1 = sigma1Data[position1];
  const sigma2 = sigma2Data[position2];
  
  // Additive Hammett: pKa = pKa₀ - ρ × (σ₁ + σ₂)
  const totalSigma = sigma1 + sigma2;
  const delta = rho * totalSigma;
  const calculatedPka = basePka - delta;
  
  // Confidence is lower for disubstituted compounds
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  
  // If both ortho, confidence is low (steric effects)
  if (position1 === 'ortho' && position2 === 'ortho') {
    confidence = 'low';
  }
  
  // If one ortho, one para/meta, medium confidence
  if ((position1 === 'ortho' || position2 === 'ortho') && 
      (position1 !== 'ortho' || position2 !== 'ortho')) {
    confidence = 'medium';
  }
  
  // If both meta/para, higher confidence
  if (position1 !== 'ortho' && position2 !== 'ortho') {
    confidence = 'high';
  }
  
  return {
    pKa: Number(calculatedPka.toFixed(2)),
    confidence,
    method: 'hammett',
    details: {
      basePka,
      sigma: totalSigma,
      rho,
      delta: Number(delta.toFixed(2)),
    },
  };
}

/**
 * Get explanation text for Hammett calculation
 */
export function getHammettExplanation(result: HammettCalculationResult, acidFamily: AcidFamily): string {
  const { basePka, sigma, rho, delta } = result.details;
  
  const familyName = 
    acidFamily === 'phenol' ? 'phenol' :
    acidFamily === 'benzoic' ? 'benzoic acid' :
    acidFamily === 'aniline' ? 'aniline (conjugate acid)' :
    'aliphatic carboxylic acid';
  
  const sigmaType = sigma > 0.1 ? 'EWG (electron-withdrawing)' : 
                    sigma < -0.1 ? 'EDG (electron-donating)' : 
                    'neutral';
  
  const effect = delta > 0 ? 'increases acidity' : delta < 0 ? 'decreases acidity' : 'no effect';
  
  return `Hammett calculation for ${familyName}:\n` +
         `Base pKa = ${basePka.toFixed(2)}\n` +
         `Substituent σ = ${sigma >= 0 ? '+' : ''}${sigma.toFixed(2)} (${sigmaType})\n` +
         `Reaction constant ρ = ${rho.toFixed(2)}\n` +
         `ΔpKa = -ρ × σ = ${delta >= 0 ? '+' : ''}${delta.toFixed(2)} (${effect})\n` +
         `Calculated pKa = ${result.pKa.toFixed(2)}`;
}
