'use client';

/**
 * Concentration & Dilution Workbench  (v2 — pedagogy-first rewrite)
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.10.3), plus standard JEE/NEET treatment of normality, w/v %,
 * ppm, and the dilution equation M₁V₁ = M₂V₂.
 *
 * ── Why this is NOT just a calculator anymore ────────────────────────────
 * v1 of this sim updated every concentration unit live as you moved a slider,
 * which taught nothing — you just watched 7 numbers flicker.
 *
 * v2 is structured around three pedagogical moves:
 *
 *   1. FOCUS + WORKING  — you pick ONE unit at a time and the panel shows
 *      its FULL step-by-step derivation with current numbers plugged in,
 *      not just the answer. Other 6 units appear as small comparison values
 *      below so you can see the difference visually.
 *
 *   2. CROSS-UNIT INSIGHTS  — when two units numerically agree (e.g. M ≈ m
 *      for dilute aqueous solutions, N = n·M always), or when they diverge
 *      (e.g. molality > molarity when the solute has appreciable mass), the
 *      sim writes ONE sentence explaining the relationship in plain English.
 *
 *   3. PREDICT-FIRST DILUTION  — in dilute mode, before you touch a slider
 *      the sim asks you to predict whether the focused unit will go ↑ / → / ↓.
 *      After you commit, the slider unlocks. On change, the sim reveals the
 *      new value with a ✓ or ✗ tick and a one-line reason.
 *
 * Modelling assumptions (NCERT level — flagged in UI when approximations break):
 *   • Volume of solution ≈ volume of solvent (warned above ~3 M).
 *   • Density of water = 1.00 g/mL at room temperature.
 */

import { useEffect, useMemo, useState } from 'react';

// ── Constants ────────────────────────────────────────────────────────────
const DENSITY_WATER = 1.0;    // g / mL
const M_WATER = 18.015;       // g / mol

// ── Two-colour palette (project decision 2026-07-23) ───────────────────────
// The entire sim runs on exactly TWO accent colours plus white/gray — the
// same soft, light-tier shades the derivation box already used, so nothing on
// screen is bright enough to pull focus off the reading. All UI chrome
// (headings, active states, selected pills, sliders, accents, borders) draws
// from these; per-unit and per-solute accent colours were removed.
//   VIO  — primary accent (headings, active/selected, the focused unit, results)
//   CYAN — secondary accent, reserved for the WATER / solvent axis
// Two deliberate exceptions that are DATA, not chrome:
//   • the beaker fill shows the solute's real solution colour (KMnO₄ purple,
//     CuSO₄ blue …) — that is information, not decoration.
//   • the predict-first ✓/✗ tick keeps a soft emerald/red — a learner must be
//     able to read "right vs wrong" at a glance.
const VIO = '#c4b5fd';   // violet-300
const CYAN = '#7dd3fc';  // sky-300
// Gray text tiers (unchanged): #e2e8f0 primary · #94a3b8 secondary · #64748b ghost

// ── Solute catalogue ─────────────────────────────────────────────────────
interface Solute {
  id: string;
  formula: string;
  formulaDisplay: React.ReactNode;
  name: string;
  molarMass: number;
  nFactor: number;
  color: string;
  phase: 'solid' | 'liquid';
  note?: string;
}

function f(parts: (string | number | { sub: string | number } | { sup: string })[]) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string' || typeof p === 'number') return <span key={i}>{p}</span>;
        if ('sub' in p) return <sub key={i}>{p.sub}</sub>;
        if ('sup' in p) return <sup key={i}>{p.sup}</sup>;
        return null;
      })}
    </>
  );
}

const SOLUTES: Solute[] = [
  { id: 'nacl',    formula: 'NaCl',     formulaDisplay: f(['NaCl']),
    name: 'Sodium chloride',  molarMass: 58.44, nFactor: 1, color: '#cbd5e1', phase: 'solid',
    note: 'Salt — dissociates into Na⁺ + Cl⁻ but the formula unit count is what feeds moles.' },
  { id: 'naoh',    formula: 'NaOH',     formulaDisplay: f(['NaOH']),
    name: 'Sodium hydroxide', molarMass: 40.00, nFactor: 1, color: '#e2e8f0', phase: 'solid',
    note: 'Strong base — n=1, so normality equals molarity.' },
  { id: 'h2so4',   formula: 'H₂SO₄',    formulaDisplay: f(['H', {sub: 2}, 'SO', {sub: 4}]),
    name: 'Sulphuric acid',   molarMass: 98.08, nFactor: 2, color: '#fef3c7', phase: 'liquid',
    note: 'Diprotic — n=2, so normality is 2× the molarity.' },
  { id: 'hcl',     formula: 'HCl',      formulaDisplay: f(['HCl']),
    name: 'Hydrochloric acid', molarMass: 36.46, nFactor: 1, color: '#bbf7d0', phase: 'liquid',
    note: 'Monoprotic — normality equals molarity.' },
  { id: 'kmno4',   formula: 'KMnO₄',    formulaDisplay: f(['KMnO', {sub: 4}]),
    name: 'Potassium permanganate', molarMass: 158.03, nFactor: 5, color: '#c084fc', phase: 'solid',
    note: 'Strong oxidant. n=5 in acidic medium (Mn⁷⁺ → Mn²⁺). Deep purple.' },
  { id: 'cuso4',   formula: 'CuSO₄·5H₂O', formulaDisplay: f(['CuSO', {sub: 4}, '·5H', {sub: 2}, 'O']),
    name: 'Copper sulphate pentahydrate', molarMass: 249.69, nFactor: 2, color: '#67e8f9', phase: 'solid',
    note: 'Hydrated salt — molar mass includes 5 H₂O. Blue solution.' },
  { id: 'na2co3',  formula: 'Na₂CO₃',   formulaDisplay: f(['Na', {sub: 2}, 'CO', {sub: 3}]),
    name: 'Sodium carbonate', molarMass: 105.99, nFactor: 2, color: '#e2e8f0', phase: 'solid',
    note: 'Washing soda — n=2 (each Na⁺ contributes +1).' },
  { id: 'glucose', formula: 'C₆H₁₂O₆',  formulaDisplay: f(['C', {sub: 6}, 'H', {sub: 12}, 'O', {sub: 6}]),
    name: 'Glucose',         molarMass: 180.16, nFactor: 1, color: '#fef9c3', phase: 'solid',
    note: 'Non-electrolyte — does not ionise. Normality treated as molarity.' },
];

// ── Formatting ───────────────────────────────────────────────────────────
// Scientific notation NEVER renders as "1.36e+5" — that's programming syntax
// students don't read. Always show "1.36 × 10⁵" with Unicode superscript
// digits (the form used in NCERT / standard chemistry references).
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

function prettyExp(eNotation: string): string {
  const match = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!match) return eNotation;
  const mantissa = match[1];
  const expNum = parseInt(match[2], 10);
  if (expNum === 0) return mantissa;
  const supDigits = String(Math.abs(expNum)).split('').map(d => SUP_DIGITS[parseInt(d, 10)]).join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${supDigits}`;
}

function fmt(v: number, digits = 3): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs < 0.001 || abs > 1e5) return prettyExp(v.toExponential(2));
  if (abs >= 100) return v.toFixed(1);
  if (abs >= 10)  return v.toFixed(2);
  return v.toFixed(digits);
}

// ── Derivation type ──────────────────────────────────────────────────────
// `calc` is JSX (not a string) so step arithmetic that involves division
// can render as a vertical Frac instead of the ambiguous ÷ symbol.
interface Step { what: string; calc: React.ReactNode; result: string }
interface Derivation {
  formula: React.ReactNode;   // JSX — uses <Frac> so num/den read clearly from a distance
  meaning: string;            // 1-line plain-English description
  steps: Step[];
  finalValue: string;
  finalUnit: string;
  insight?: string;           // cross-unit annotation
}

// ── Inline fraction component ────────────────────────────────────────────
// Renders num/den stacked vertically with a horizontal divider line.
// Used in formula headers so the divide operation is unambiguous when read
// from far away (the ÷ symbol can look like a + from a distance).
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      verticalAlign: 'middle',
      lineHeight: 1.15,
      margin: '0 4px',
    }}>
      <span style={{ padding: '0 6px 2px 6px' }}>{num}</span>
      <span style={{
        padding: '2px 6px 0 6px',
        borderTop: '1.5px solid currentColor',
        width: '100%',
        textAlign: 'center',
      }}>{den}</span>
    </span>
  );
}

// ── Per-unit derivation generators ───────────────────────────────────────
// Each takes the canonical solution state + solute, returns a Derivation.
// These are the heart of the pedagogy — the same formulas a student would
// write on paper, evaluated with the current values.

interface State {
  totalSoluteG: number;
  totalSolventML: number;   // = volume of solution (under V_soln ≈ V_solvent)
  moles: number;
  equivalents: number;
  massSolvent_g: number;
  massSolvent_kg: number;
  massSolution_g: number;
  V_solution_L: number;
  molesSolvent: number;
}

function buildState(soluteG: number, solventML: number, solute: Solute): State {
  const massSolvent_g = solventML * DENSITY_WATER;
  return {
    totalSoluteG: soluteG,
    totalSolventML: solventML,
    moles: soluteG / solute.molarMass,
    equivalents: (soluteG / solute.molarMass) * solute.nFactor,
    massSolvent_g,
    massSolvent_kg: massSolvent_g / 1000,
    massSolution_g: soluteG + massSolvent_g,
    V_solution_L: solventML / 1000,
    molesSolvent: massSolvent_g / M_WATER,
  };
}

function deriveMassPercent(s: State, sol: Solute): Derivation {
  const value = s.massSolution_g > 0 ? (s.totalSoluteG / s.massSolution_g) * 100 : 0;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        % w/w =
        <Frac num="mass of solute" den="mass of solution" />
        × 100
      </span>
    ),
    meaning: 'What fraction of the total mass is the solute?',
    steps: [
      { what: 'mass of solvent',  calc: `${fmt(s.totalSolventML, 1)} mL × 1.00 g/mL`,            result: `${fmt(s.massSolvent_g, 1)} g` },
      { what: 'mass of solution', calc: `${fmt(s.totalSoluteG)} + ${fmt(s.massSolvent_g, 1)}`,   result: `${fmt(s.massSolution_g, 2)} g` },
      { what: 'mass percent',
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${fmt(s.massSolution_g, 2)} g`} /> × 100</>,
        result: `${fmt(value)} %` },
    ],
    finalValue: fmt(value), finalUnit: '%',
    insight: value > 15
      ? `${fmt(value)}% is a fairly concentrated solution — at this strength, V_solution ≈ V_solvent starts to break down.`
      : `${fmt(value)}% means about ${Math.round(value)} g of ${sol.formula} per 100 g of solution.`,
  };
}

function deriveWv(s: State, sol: Solute): Derivation {
  const value = s.V_solution_L > 0 ? s.totalSoluteG / s.V_solution_L : 0;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        w/v =
        <Frac num="mass of solute" den="volume of solution" />
      </span>
    ),
    meaning: 'Grams of solute per litre of solution.',
    steps: [
      { what: 'volume of solution',
        calc: <><Frac num={`${fmt(s.totalSolventML, 1)} mL`} den="1000" /></>,
        result: `${fmt(s.V_solution_L, 3)} L` },
      { what: 'mass / volume',
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${fmt(s.V_solution_L, 3)} L`} /></>,
        result: `${fmt(value, 1)} g/L` },
    ],
    finalValue: fmt(value, 1), finalUnit: 'g/L',
    insight: `${fmt(value, 1)} g/L = ${fmt(value / 10, 2)} g per 100 mL — the form used in many clinical and hospital labels (e.g. 0.9% saline = 9 g/L).`,
  };
}

function deriveMolarity(s: State, sol: Solute): Derivation {
  const value = s.V_solution_L > 0 ? s.moles / s.V_solution_L : 0;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        M =
        <Frac num="moles of solute" den="volume of solution (L)" />
      </span>
    ),
    meaning: 'Moles of solute per litre of solution. Volumetric — depends on T.',
    steps: [
      { what: `moles of ${sol.formula}`,
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${sol.molarMass} g/mol`} /></>,
        result: `${fmt(s.moles)} mol` },
      { what: 'volume of solution',
        calc: <><Frac num={`${fmt(s.totalSolventML, 1)} mL`} den="1000" /></>,
        result: `${fmt(s.V_solution_L, 3)} L` },
      { what: 'molarity',
        calc: <><Frac num={`${fmt(s.moles)} mol`} den={`${fmt(s.V_solution_L, 3)} L`} /></>,
        result: `${fmt(value)} mol/L` },
    ],
    finalValue: fmt(value), finalUnit: 'mol/L',
    insight: `Volumetric unit — heat the flask and the volume expands, so M drops. That's why molality (m) is preferred for colligative properties.`,
  };
}

function deriveMolality(s: State, sol: Solute): Derivation {
  const value = s.massSolvent_kg > 0 ? s.moles / s.massSolvent_kg : 0;
  // Cross-insight: molality vs molarity
  const molarity = s.V_solution_L > 0 ? s.moles / s.V_solution_L : 0;
  const ratioDiff = Math.abs(value - molarity) / Math.max(value, molarity, 1e-9);
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        m =
        <Frac num="moles of solute" den="mass of solvent (kg)" />
      </span>
    ),
    meaning: 'Moles of solute per kg of solvent. Mass-based — T-independent.',
    steps: [
      { what: `moles of ${sol.formula}`,
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${sol.molarMass} g/mol`} /></>,
        result: `${fmt(s.moles)} mol` },
      { what: 'mass of solvent',
        calc: `${fmt(s.totalSolventML, 1)} mL × 1.00 g/mL`,
        result: `${fmt(s.massSolvent_g, 1)} g = ${fmt(s.massSolvent_kg, 3)} kg` },
      { what: 'molality',
        calc: <><Frac num={`${fmt(s.moles)} mol`} den={`${fmt(s.massSolvent_kg, 3)} kg`} /></>,
        result: `${fmt(value)} mol/kg` },
    ],
    finalValue: fmt(value), finalUnit: 'mol/kg',
    insight: ratioDiff < 0.01
      ? `Numerically equal to molarity (M = ${fmt(molarity)}) here because the solute mass is small and water's density is 1 g/mL, so V_solution (L) ≈ mass_solvent (kg).`
      : `Molality (${fmt(value)}) ≠ molarity (${fmt(molarity)}) because the solute itself has mass — so mass_solvent < mass_solution while V_solution ≈ V_solvent.`,
  };
}

function deriveNormality(s: State, sol: Solute): Derivation {
  const molarity = s.V_solution_L > 0 ? s.moles / s.V_solution_L : 0;
  const value = molarity * sol.nFactor;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        N =
        <Frac num="equivalents" den="volume of solution (L)" />
        = n-factor × M
      </span>
    ),
    meaning: 'Reaction-units (equivalents) per litre of solution.',
    steps: [
      { what: `moles of ${sol.formula}`,
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${sol.molarMass} g/mol`} /></>,
        result: `${fmt(s.moles)} mol` },
      { what: 'equivalents',
        calc: `${fmt(s.moles)} mol × ${sol.nFactor} (n-factor)`,
        result: `${fmt(s.equivalents)} eq` },
      { what: 'normality',
        calc: <><Frac num={`${fmt(s.equivalents)} eq`} den={`${fmt(s.V_solution_L, 3)} L`} /></>,
        result: `${fmt(value)} eq/L` },
    ],
    finalValue: fmt(value), finalUnit: 'eq/L',
    insight: sol.nFactor === 1
      ? `n-factor = 1 for ${sol.formula}, so N = M exactly. Always true for monoprotic acids, monobasic bases, and 1:1 salts.`
      : `n-factor = ${sol.nFactor}, so N = ${sol.nFactor} × M. Each formula unit carries ${sol.nFactor} reaction-units.`,
  };
}

function deriveMoleFraction(s: State, sol: Solute): Derivation {
  const xSolute = (s.moles + s.molesSolvent) > 0 ? s.moles / (s.moles + s.molesSolvent) : 0;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        χ<sub>solute</sub> =
        <Frac num="moles of solute" den="moles of solute + moles of solvent" />
      </span>
    ),
    meaning: 'Fraction of all particles in solution that are solute.',
    steps: [
      { what: `moles of ${sol.formula}`,
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${sol.molarMass} g/mol`} /></>,
        result: `${fmt(s.moles)} mol` },
      { what: 'moles of water (solvent)',
        calc: <><Frac num={`${fmt(s.massSolvent_g, 1)} g`} den="18.015 g/mol" /></>,
        result: `${fmt(s.molesSolvent, 3)} mol` },
      { what: 'χ solute',
        calc: <><Frac num={fmt(s.moles)} den={`${fmt(s.moles)} + ${fmt(s.molesSolvent, 3)}`} /></>,
        result: `${fmt(xSolute, 4)}` },
      { what: 'χ solvent',
        calc: `1 − ${fmt(xSolute, 4)}`,
        result: `${fmt(1 - xSolute, 4)}` },
    ],
    finalValue: fmt(xSolute, 4), finalUnit: '(dimensionless)',
    insight: xSolute < 0.05
      ? `Solvent dominates by ~${Math.round(s.molesSolvent / Math.max(s.moles, 1e-9))}× because water (M=18) has many more particles per gram than ${sol.formula} (M=${sol.molarMass}).`
      : `χ_solute and χ_solvent always sum to 1 — that's the conservation rule.`,
  };
}

function derivePpm(s: State, sol: Solute): Derivation {
  const wPct = s.massSolution_g > 0 ? (s.totalSoluteG / s.massSolution_g) * 100 : 0;
  const value = wPct * 1e4;
  return {
    formula: (
      <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap' }}>
        ppm =
        <Frac num="mass of solute" den="mass of solution" />
        × 10⁶
      </span>
    ),
    meaning: 'Parts of solute per million parts of solution — for very dilute solutions.',
    steps: [
      { what: 'mass of solution',
        calc: `${fmt(s.totalSoluteG)} + ${fmt(s.massSolvent_g, 1)}`,
        result: `${fmt(s.massSolution_g, 2)} g` },
      { what: 'ppm',
        calc: <><Frac num={`${fmt(s.totalSoluteG)} g`} den={`${fmt(s.massSolution_g, 2)} g`} /> × 10⁶</>,
        result: `${fmt(value, 1)} ppm` },
    ],
    finalValue: fmt(value, 1), finalUnit: 'ppm',
    insight: `1 ppm ≈ 1 mg of solute per 1 kg of solution. Water-quality and drug-trace concentrations live here. Note: ppm = mass% × 10⁴.`,
  };
}

type UnitKey = 'mass_pct' | 'wv' | 'molarity' | 'molality' | 'normality' | 'mole_fraction' | 'ppm';

interface UnitDef {
  key: UnitKey;
  shortName: string;          // for pill button
  fullName: string;
  symbol: string;
  derive: (s: State, sol: Solute) => Derivation;
}

const UNITS: UnitDef[] = [
  { key: 'mass_pct',     shortName: '% w/w',   fullName: 'Mass percent',          symbol: '%',     derive: deriveMassPercent  },
  { key: 'wv',           shortName: 'w/v',     fullName: 'Mass / volume',         symbol: 'g/L',   derive: deriveWv           },
  { key: 'molarity',     shortName: 'M',       fullName: 'Molarity',              symbol: 'mol/L', derive: deriveMolarity     },
  { key: 'molality',     shortName: 'm',       fullName: 'Molality',              symbol: 'mol/kg',derive: deriveMolality     },
  { key: 'normality',    shortName: 'N',       fullName: 'Normality',             symbol: 'eq/L',  derive: deriveNormality    },
  { key: 'mole_fraction',shortName: 'χ',       fullName: 'Mole fraction (solute)',symbol: '',      derive: deriveMoleFraction },
  { key: 'ppm',          shortName: 'ppm',     fullName: 'Parts per million',     symbol: 'ppm',   derive: derivePpm          },
];

// ── SVG Beaker (same as v1) ──────────────────────────────────────────────
function Beaker({ volumeML, maxML, tintColor, intensity, capacityMarks }:
                { volumeML: number; maxML: number; tintColor: string;
                  intensity: number; capacityMarks: number[] }) {
  const W = 220, H = 280;
  const bX = 30, bW = 160, bTop = 30, bBot = 250;
  const bH = bBot - bTop;
  const fillRatio = Math.min(1, Math.max(0, volumeML / maxML));
  const fillH = (bH - 8) * fillRatio;
  const fillTop = bBot - fillH;

  const hex = tintColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const fillColor = `rgba(${r},${g},${b},${0.18 + intensity * 0.72})`;
  const surfaceLine = `rgba(${r},${g},${b},${Math.min(0.9, 0.45 + intensity * 0.5)})`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ maxWidth: 220, display: 'block' }}>
      <defs>
        <linearGradient id="cl-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="rgba(226,240,255,0.50)" />
          <stop offset="22%"  stopColor="rgba(180,210,240,0.08)" />
          <stop offset="55%"  stopColor="rgba(150,190,225,0.04)" />
          <stop offset="80%"  stopColor="rgba(120,170,210,0.10)" />
          <stop offset="100%" stopColor="rgba(80,130,180,0.30)" />
        </linearGradient>
      </defs>
      {volumeML > 0.001 && (
        <g>
          <path d={`M ${bX + 2} ${fillTop} L ${bX + 2} ${bBot - 8}
                    Q ${bX + 2} ${bBot - 2} ${bX + 8} ${bBot - 2}
                    L ${bX + bW - 8} ${bBot - 2}
                    Q ${bX + bW - 2} ${bBot - 2} ${bX + bW - 2} ${bBot - 8}
                    L ${bX + bW - 2} ${fillTop} Z`}
            fill={fillColor} />
          <path d={`M ${bX + 2} ${fillTop + 1}
                    Q ${bX + bW / 2} ${fillTop - 3} ${bX + bW - 2} ${fillTop + 1}`}
            fill="none" stroke={surfaceLine} strokeWidth={1.2} />
        </g>
      )}
      <path d={`M ${bX} ${bTop} L ${bX} ${bBot - 8}
                Q ${bX} ${bBot} ${bX + 8} ${bBot}
                L ${bX + bW - 8} ${bBot}
                Q ${bX + bW} ${bBot} ${bX + bW} ${bBot - 8}
                L ${bX + bW} ${bTop}`}
        fill="url(#cl-glass)" opacity={0.5}
        stroke="rgba(186,214,236,0.55)" strokeWidth={1.4} strokeLinejoin="round" />
      <path d={`M ${bX + bW} ${bTop + 2} L ${bX + bW + 12} ${bTop - 2} L ${bX + bW + 12} ${bTop + 4}`}
        fill="none" stroke="rgba(186,214,236,0.55)" strokeWidth={1.4} strokeLinejoin="round" />
      <line x1={bX + 3} y1={bTop + 6} x2={bX + 3} y2={bBot - 14}
        stroke="rgba(255,255,255,0.30)" strokeWidth={1.4} strokeLinecap="round" />
      <line x1={bX + 7} y1={bTop + 12} x2={bX + 7} y2={bBot - 22}
        stroke="rgba(255,255,255,0.10)" strokeWidth={0.6} strokeLinecap="round" />
      <line x1={bX + bW - 3} y1={bTop + 6} x2={bX + bW - 3} y2={bBot - 14}
        stroke="rgba(0,0,0,0.30)" strokeWidth={1.1} strokeLinecap="round" />
      {capacityMarks.map((cap) => {
        const y = bBot - 4 - (bH - 12) * (cap / maxML);
        if (y < bTop || y > bBot) return null;
        return (
          <g key={cap}>
            <line x1={bX + 1} y1={y} x2={bX + 7} y2={y}
              stroke="rgba(186,214,236,0.50)" strokeWidth={0.7} />
            <text x={bX - 4} y={y + 3} fontSize={8.5}
              fill="#64748b" fontFamily="system-ui" textAnchor="end">
              {cap}
            </text>
          </g>
        );
      })}
      <ellipse cx={bX + bW / 2} cy={bBot + 4} rx={bW / 2 + 10} ry={3}
        fill="rgba(0,0,0,0.35)" />
    </svg>
  );
}

// ── Number slider ────────────────────────────────────────────────────────
function NumSlider({ label, value, min, max, step, color, onChange, unit, disabled }:
                   { label: string; value: number; min: number; max: number; step: number;
                     color: string; onChange: (v: number) => void; unit: string; disabled?: boolean }) {
  return (
    <div className="flex items-center gap-3" style={{ opacity: disabled ? 0.4 : 1 }}>
      <div style={{ minWidth: 88, fontSize: 12, fontWeight: 700, color }}>{label}</div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        disabled={disabled}
        className="flex-1" style={{ accentColor: color, cursor: disabled ? 'not-allowed' : 'pointer' }} />
      <div style={{ minWidth: 70, textAlign: 'right', fontSize: 13, fontWeight: 800,
        fontVariantNumeric: 'tabular-nums', color }}>
        {fmt(value, 1)} <span style={{ color: '#64748b', fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  );
}

// ── Focused derivation panel ─────────────────────────────────────────────
// This is the ONE bordered box on the right-hand side. Predict-first (dilute
// mode) and Before→After render as headerSlot/footerSlot INSIDE it, divided
// by hairlines rather than their own nested borders — card-in-card is an
// anti-pattern (SIMULATION_DESIGN_WORKFLOW.md §8).
function DerivationPanel({ derivation, accent, headerSlot, footerSlot }:
                         { derivation: Derivation; accent: string;
                           headerSlot?: React.ReactNode; footerSlot?: React.ReactNode }) {
  return (
    <div className="rounded-xl p-4 flex flex-col gap-3"
      style={{ background: 'rgba(255,255,255,0.025)',
               border: '1px solid rgba(255,255,255,0.07)' }}>
      {headerSlot}
      {headerSlot && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />}

      {/* Formula header */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: accent }}>The Formula</div>
        <div className="text-[14px] font-bold leading-snug" style={{ color: '#e2e8f0' }}>
          {derivation.formula}
        </div>
        <div className="text-[12px] mt-1" style={{ color: '#94a3b8' }}>
          {derivation.meaning}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Step-by-step derivation — body sans-serif font so the steps
          read as natural prose with arithmetic, not as code.
          items-center keeps the step number + result aligned with the
          vertical centre of any inline <Frac> in the calc column. */}
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2"
          style={{ color: '#94a3b8' }}>Step-by-step with your numbers</div>
        <div className="flex flex-col gap-2.5">
          {derivation.steps.map((step, i) => (
            <div key={i} className="grid grid-cols-[auto_1fr_auto] gap-3 items-center text-[13px]">
              <span style={{ color: accent, fontWeight: 700, minWidth: 18 }}>{i + 1}.</span>
              <span style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                <span style={{ color: '#94a3b8' }}>{step.what}</span> = {step.calc}
              </span>
              <span style={{ color: '#e2e8f0', fontWeight: 700 }}>= {step.result}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      {/* Final value — emphasised */}
      <div className="flex items-baseline justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
          Final Value
        </div>
        <div>
          <span style={{ fontSize: 30, fontWeight: 800, color: accent,
            fontVariantNumeric: 'tabular-nums' }}>
            {derivation.finalValue}
          </span>
          <span style={{ fontSize: 13, color: '#94a3b8', marginLeft: 6 }}>
            {derivation.finalUnit}
          </span>
        </div>
      </div>

      {/* Cross-unit insight */}
      {derivation.insight && (
        <div className="rounded-lg px-3 py-2.5 text-[12px] leading-snug"
          style={{ background: 'rgba(196,181,253,0.06)',
                   border: '1px solid rgba(196,181,253,0.18)', color: '#cbd5e1' }}>
          <span className="font-semibold mr-1" style={{ color: VIO }}>WHY:</span>
          {derivation.insight}
        </div>
      )}

      {footerSlot && <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />}
      {footerSlot}
    </div>
  );
}

// ── Predict-first widget for Dilute mode ─────────────────────────────────
type Prediction = 'up' | 'same' | 'down' | null;

function PredictWidget({ unitName, prediction, onPredict, beforeValue, afterValue, locked }:
                       { unitName: string; prediction: Prediction; onPredict: (p: Prediction) => void;
                         beforeValue: string; afterValue: string; locked: boolean }) {
  // Determine actual direction from before/after for feedback
  const beforeNum = parseFloat(beforeValue.replace(/[^0-9.eE+-]/g, ''));
  const afterNum = parseFloat(afterValue.replace(/[^0-9.eE+-]/g, ''));
  let actual: Prediction = null;
  if (!isNaN(beforeNum) && !isNaN(afterNum)) {
    const rel = Math.abs(afterNum - beforeNum) / Math.max(Math.abs(beforeNum), 1e-9);
    if (rel < 0.005) actual = 'same';
    else if (afterNum > beforeNum) actual = 'up';
    else actual = 'down';
  }
  const correct = prediction && actual && prediction === actual;
  const wrong   = prediction && actual && prediction !== actual && locked;

  // The three prediction buttons are deliberately NEUTRAL (violet-when-picked,
  // gray otherwise) — pre-tinting ↑ green / ↓ red would bias the guess before
  // the student commits. The right/wrong verdict AFTER committing is where the
  // emerald/red lives.
  const arrows: { key: Prediction; label: string; symbol: string; color: string }[] = [
    { key: 'up',   label: 'Increases', symbol: '↑',  color: VIO },
    { key: 'same', label: 'No change', symbol: '→', color: VIO },
    { key: 'down', label: 'Decreases', symbol: '↓',  color: VIO },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: VIO }}>
          Predict first
        </div>
        <div className="text-[10px]" style={{ color: '#64748b' }}>
          What will <b style={{ color: VIO }}>{unitName}</b> do?
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {arrows.map(a => {
          const selected = prediction === a.key;
          const isActual = locked && actual === a.key;
          return (
            <button key={a.key} onClick={() => !locked && onPredict(a.key)}
              disabled={locked}
              className="rounded-md px-2 py-1.5 text-center transition-all"
              style={{
                background: selected ? `${a.color}22` :
                            isActual && !selected ? 'rgba(255,255,255,0.04)' :
                            'rgba(255,255,255,0.02)',
                border: `1.5px solid ${selected ? `${a.color}80` :
                          isActual && !selected ? 'rgba(255,255,255,0.12)' :
                          'rgba(255,255,255,0.07)'}`,
                color: selected ? a.color : '#64748b',
                cursor: locked ? 'not-allowed' : 'pointer',
              }}>
              <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{a.symbol}</div>
              <div style={{ fontSize: 10, marginTop: 1 }}>{a.label}</div>
            </button>
          );
        })}
      </div>

      {prediction && !locked && (
        <div className="text-[10px] italic text-center" style={{ color: '#94a3b8' }}>
          Now move a slider below to test your prediction →
        </div>
      )}

      {locked && prediction && actual && (
        <div className="rounded px-2 py-1.5 text-[12px] leading-snug"
          style={{
            background: correct ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
            border: correct ? '1px solid rgba(52,211,153,0.35)' : '1px solid rgba(248,113,113,0.35)',
            color: correct ? '#6ee7b7' : '#fca5a5',
          }}>
          <span className="font-semibold mr-1">{correct ? '✓' : '✗'}</span>
          {correct
            ? `Correct — ${unitName} ${actual === 'up' ? 'went up' : actual === 'down' ? 'went down' : 'stayed the same'} (${beforeValue} → ${afterValue}).`
            : `Not quite — ${unitName} ${actual === 'up' ? 'increased' : actual === 'down' ? 'decreased' : 'stayed about the same'} (${beforeValue} → ${afterValue}).`}
        </div>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────
export default function ConcentrationLabSim() {
  type Mode = 'build' | 'dilute';
  const [mode, setMode] = useState<Mode>('build');
  const [soluteId, setSoluteId] = useState<string>('kmno4');
  const [focusUnit, setFocusUnit] = useState<UnitKey>('molarity');

  // Build-mode state — these are the "starting solution" values used by both modes
  const [soluteMass, setSoluteMass] = useState<number>(15.8);
  const [solventVol, setSolventVol] = useState<number>(100);

  // Dilute-mode operations — applied on top of the built solution
  const [addedWater, setAddedWater]   = useState<number>(0);
  const [addedSolute, setAddedSolute] = useState<number>(0);
  const [evaporated, setEvaporated]   = useState<number>(0);

  // Predict-first state for Dilute mode
  const [prediction, setPrediction] = useState<Prediction>(null);
  // "Locked" once any modification slider has been touched (and a prediction exists)
  const hasModification = addedWater > 0 || addedSolute > 0 || evaporated > 0;
  const predictionLocked = !!prediction && hasModification;

  const solute = useMemo(() => SOLUTES.find(s => s.id === soluteId) ?? SOLUTES[0], [soluteId]);

  // Built (before) state — always reflects the build-mode sliders
  const builtState = buildState(soluteMass, solventVol, solute);

  // Current state — includes dilute-mode modifications
  const currentSolventML = Math.max(0, solventVol + addedWater - evaporated);
  const currentSoluteG   = mode === 'dilute' ? soluteMass + addedSolute : soluteMass;
  const currentState     = buildState(
    currentSoluteG,
    mode === 'dilute' ? currentSolventML : solventVol,
    solute,
  );

  // Derivation for focused unit at the CURRENT state
  const focusedDef = UNITS.find(u => u.key === focusUnit) ?? UNITS[2];
  const currentDeriv = focusedDef.derive(currentState, solute);
  const builtDeriv   = focusedDef.derive(builtState, solute);

  // Compute molarity for the beaker intensity
  const currentMolarity = currentState.V_solution_L > 0 ? currentState.moles / currentState.V_solution_L : 0;
  const intensity = Math.min(1, currentMolarity / 2);

  // Reset prediction when student changes focus unit or solute or mode
  useEffect(() => { setPrediction(null); }, [focusUnit, soluteId, mode]);

  function resetDilution() {
    setAddedWater(0); setAddedSolute(0); setEvaporated(0);
    setPrediction(null);
  }

  function selectSolute(id: string) {
    setSoluteId(id);
    resetDilution();
    const s = SOLUTES.find(x => x.id === id);
    if (s) setSoluteMass(parseFloat((0.1 * s.molarMass).toFixed(2)));
  }

  // Every unit uses the SAME accent (violet) when focused — the two-colour
  // rule means the pill picker distinguishes "focused vs not" by fill/border
  // weight, not by seven different hues.
  const accent = VIO;

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16,
               minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Concentration & <span style={{ color: VIO }}>Dilution Lab</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}>
            See the working · NCERT Class 11 Ch. 1
          </p>
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-widest pt-1"
          style={{ color: '#94a3b8' }}>
          {solute.name}
        </div>
      </div>

      {/* ── Mode tabs ───────────────────────────────────────────────────── */}
      <div className="flex mb-5 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {([
          ['build',  'Build a Solution',     'Pick a unit, see its full derivation step-by-step'],
          ['dilute', 'Dilute / Concentrate', 'Predict what changes BEFORE you slide'],
        ] as const).map(([key, label, sub]) => {
          const active = mode === key;
          return (
            <button key={key} onClick={() => setMode(key)}
              className="px-4 py-3 text-left transition-all"
              style={{
                background: 'none', outline: 'none',
                borderBottom: `2px solid ${active ? VIO : 'rgba(255,255,255,0.06)'}`,
                opacity: active ? 1 : 0.55,
                marginBottom: -1,
              }}>
              <div className="text-sm font-bold" style={{ color: active ? VIO : '#94a3b8' }}>
                {label}
              </div>
              <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>
            </button>
          );
        })}
      </div>

      {/* ── Solute pills ───────────────────────────────────────────────── */}
      {/* Selection state uses the one accent (violet), same as every other
          picker in the sim. The solute's REAL chemical colour is reserved for
          the beaker fill only — that's data (what the solution looks like),
          not UI chrome, so it's the one place a non-palette colour is allowed. */}
      <div className="flex flex-wrap gap-2 mb-5">
        {SOLUTES.map(s => {
          const active = s.id === soluteId;
          return (
            <button key={s.id} onClick={() => selectSolute(s.id)}
              className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: active ? 'rgba(196,181,253,0.14)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? 'rgba(196,181,253,0.45)' : 'rgba(255,255,255,0.08)'}`,
                color: active ? VIO : '#94a3b8',
                fontFamily: 'system-ui',
              }}>
              {s.formula}
            </button>
          );
        })}
      </div>

      {/* ── Main grid: left controls + right derivation ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">

        {/* LEFT — beaker + controls */}
        <div className="flex flex-col gap-3 rounded-2xl p-4"
          style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                   border: '1px solid rgba(196,181,253,0.18)' }}>

          {/* Beaker centered at top */}
          <div className="flex justify-center">
            <Beaker volumeML={currentState.totalSolventML}
              maxML={mode === 'dilute' ? 600 : 300}
              tintColor={solute.color}
              intensity={intensity}
              capacityMarks={mode === 'dilute' ? [100, 200, 300, 400, 500] : [50, 100, 150, 200, 250]} />
          </div>

          {/* Current state — plain row, no nested box (the outer bench panel
              is already one box; a bordered card inside it would be
              card-in-card, an anti-pattern per §8). */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
            <div className="flex justify-between items-baseline mb-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
                Current Solution
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: solute.color, lineHeight: 1 }}>
                {solute.formulaDisplay}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-1 tabular-nums text-[13px] text-center">
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b' }}>Solute</div>
                <div style={{ color: '#cbd5e1' }}>{fmt(currentSoluteG)} g</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b' }}>Solvent</div>
                <div style={{ color: '#cbd5e1' }}>{fmt(currentState.totalSolventML, 0)} mL</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748b' }}>Moles</div>
                <div style={{ color: '#cbd5e1' }}>{fmt(currentState.moles)} mol</div>
              </div>
            </div>
          </div>

          {/* Build-mode sliders */}
          {mode === 'build' && (
            <div className="flex flex-col gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
              <div className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: '#94a3b8' }}>Make Your Solution</div>
              <NumSlider label="Mass of solute" color={VIO} unit="g"
                value={soluteMass} min={0} max={50} step={0.1} onChange={setSoluteMass} />
              <NumSlider label="Volume of water" color={CYAN} unit="mL"
                value={solventVol} min={10} max={300} step={5} onChange={setSolventVol} />
              <div className="text-[10px] italic" style={{ color: '#64748b' }}>
                Tip: move a slider and watch the step-by-step calc on the right update.
              </div>
            </div>
          )}

          {/* Dilute-mode controls — sliders are visually enabled but a banner reminds
              the student to predict first if they haven't yet */}
          {mode === 'dilute' && (
            <div className="flex flex-col gap-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
              <div className="flex justify-between items-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: '#94a3b8' }}>
                  Modify the Solution
                </div>
                <button onClick={resetDilution}
                  className="text-[10px] font-semibold px-2 py-1 rounded"
                  style={{ background: 'rgba(196,181,253,0.10)',
                           border: '1px solid rgba(196,181,253,0.30)',
                           color: VIO, cursor: 'pointer' }}>
                  ↺ Reset
                </button>
              </div>
              {!prediction && (
                <div className="text-[11px] italic" style={{ color: VIO }}>
                  👉 Make a prediction on the right first, THEN slide.
                </div>
              )}
              <NumSlider label="+ Add water" color={CYAN} unit="mL"
                value={addedWater} min={0} max={500} step={5} onChange={setAddedWater}
                disabled={!prediction} />
              <NumSlider label="+ Add solute" color={VIO} unit="g"
                value={addedSolute} min={0} max={20} step={0.1} onChange={setAddedSolute}
                disabled={!prediction} />
              <NumSlider label="− Evaporate" color={CYAN} unit="mL"
                value={evaporated} min={0}
                max={Math.max(0, solventVol + addedWater - 5)}
                step={5} onChange={setEvaporated}
                disabled={!prediction} />
              <div className="text-[10px] italic" style={{ color: '#64748b' }}>
                Starting from the solution you built in the previous tab.
              </div>
            </div>
          )}

          {solute.note && (
            <div className="text-[11px] italic"
              style={{ color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
              <span style={{ color: solute.color, fontWeight: 700 }}>{solute.formula}:</span> {solute.note}
            </div>
          )}
        </div>

        {/* RIGHT — focused-unit picker + derivation + predict (in dilute) + compare strip */}
        <div className="flex flex-col gap-4">

          {/* Unit picker pills */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>
              Focus on this unit
            </div>
            <div className="flex flex-wrap gap-1.5">
              {UNITS.map(u => {
                const active = u.key === focusUnit;
                return (
                  <button key={u.key} onClick={() => setFocusUnit(u.key)}
                    className="px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-all"
                    style={{
                      background: active ? 'rgba(196,181,253,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${active ? 'rgba(196,181,253,0.40)' : 'rgba(255,255,255,0.08)'}`,
                      color: active ? VIO : '#94a3b8',
                      minWidth: 56,
                    }}>
                    <span style={{ fontStyle: 'italic' }}>{u.shortName}</span>
                    <span className="text-[10px] block mt-0.5" style={{ opacity: 0.7 }}>{u.fullName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Derivation panel for the focused unit — Predict-first (dilute mode)
              and Before→After render INSIDE this one box via header/footer
              slots, so the right column stays a single bordered box instead
              of three stacked ones. */}
          <DerivationPanel
            derivation={currentDeriv}
            accent={accent}
            headerSlot={mode === 'dilute' ? (
              <PredictWidget
                unitName={focusedDef.shortName}
                prediction={prediction}
                onPredict={setPrediction}
                beforeValue={`${builtDeriv.finalValue} ${builtDeriv.finalUnit}`}
                afterValue={`${currentDeriv.finalValue} ${currentDeriv.finalUnit}`}
                locked={predictionLocked}
              />
            ) : undefined}
            footerSlot={mode === 'dilute' && hasModification ? (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: VIO }}>Before → After</div>
                <div className="grid grid-cols-2 gap-3 tabular-nums text-[13px]">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                      BUILT
                    </div>
                    <div style={{ color: '#cbd5e1' }}>
                      {builtDeriv.finalValue} {builtDeriv.finalUnit}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                      NOW
                    </div>
                    <div style={{ color: accent, fontWeight: 800 }}>
                      {currentDeriv.finalValue} {currentDeriv.finalUnit}
                    </div>
                  </div>
                </div>
                {addedSolute === 0 && (
                  <div className="text-[11px] italic mt-2" style={{ color: '#94a3b8' }}>
                    Moles of solute were conserved (you only added/removed water) — so
                    {' '}{focusedDef.shortName} {focusUnit === 'molality' || focusUnit === 'mole_fraction' ? 'changed because solvent mass changed' : focusUnit === 'normality' ? 'tracks molarity (= n × M)' : 'changed because volume of solution changed'}.
                  </div>
                )}
                {addedSolute > 0 && (
                  <div className="text-[11px] italic mt-2" style={{ color: VIO }}>
                    You added more solute, so total moles changed.
                  </div>
                )}
              </div>
            ) : undefined}
          />

        </div>
      </div>

      {/* ── Expert tip ─────────────────────────────────────────────────── */}
      <div className="mt-5 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5"
          style={{ color: VIO }}>Expert Tip</div>
        <p className="text-sm font-medium leading-snug italic" style={{ color: '#e2e8f0' }}>
          &ldquo;Don't memorise concentration units — derive them. Every unit is just &lsquo;something of solute&rsquo;
          divided by &lsquo;something of solvent or solution&rsquo;. Knowing which goes in the numerator and which
          in the denominator is 90% of the battle.&rdquo;
        </p>
      </div>
    </div>
  );
}
