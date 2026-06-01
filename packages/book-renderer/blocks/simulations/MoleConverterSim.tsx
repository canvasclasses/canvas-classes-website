'use client';

/**
 * Mole-Mass-Particles-Volume Converter
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.8 Atomic and Molecular Masses, §1.9 Mole Concept and
 * Molar Mass).
 *
 * Pedagogical goal: collapse the four-way conversion (mass ↔ moles ↔
 * particles ↔ volume at STP) into a single interactive surface. Pick a
 * substance, type a value into any field, and the other three update live
 * through the canonical relationships:
 *
 *   moles      = mass / molar_mass
 *   particles  = moles × N_A         where N_A = 6.022 × 10²³ mol⁻¹
 *   volume_STP = moles × 22.4 L      (only valid for an ideal gas at STP;
 *                                     hidden for solids and liquids)
 *
 * "Why this matters" footer drives home Avogadro's-number scale — 1 mol of
 * water = 18 g (about a tablespoon) but contains 6.022 × 10²³ molecules.
 */

import { useState, useMemo } from 'react';

// ── Avogadro's constant (NIST 2018 value, rounded for chem-class use) ──
const N_A = 6.022e23;
// Molar volume of an ideal gas at STP (0 °C, 1 atm) per NCERT convention
const MOLAR_VOLUME_STP = 22.4; // L mol⁻¹

// ── Substance catalogue ────────────────────────────────────────────────────

type Phase = 'gas' | 'liquid' | 'solid';

interface Substance {
  id: string;
  formula: string;
  formulaDisplay: React.ReactNode;
  name: string;
  molarMass: number;      // g mol⁻¹
  phase: Phase;
  particleUnit: 'molecules' | 'formula units' | 'atoms';
}

// Helper for rich formulas with subscripts
function f(parts: (string | number | { sub: string | number })[]) {
  return (
    <>
      {parts.map((p, i) => {
        if (typeof p === 'string' || typeof p === 'number') return <span key={i}>{p}</span>;
        if ('sub' in p) return <sub key={i}>{p.sub}</sub>;
        return null;
      })}
    </>
  );
}

const SUBSTANCES: Substance[] = [
  // Gases at STP — show all four fields including volume
  { id: 'h2',   formula: 'H₂',  formulaDisplay: f(['H', {sub: 2}]),
    name: 'Hydrogen',        molarMass: 2.016,  phase: 'gas',    particleUnit: 'molecules' },
  { id: 'o2',   formula: 'O₂',  formulaDisplay: f(['O', {sub: 2}]),
    name: 'Oxygen',          molarMass: 32.00,  phase: 'gas',    particleUnit: 'molecules' },
  { id: 'n2',   formula: 'N₂',  formulaDisplay: f(['N', {sub: 2}]),
    name: 'Nitrogen',        molarMass: 28.014, phase: 'gas',    particleUnit: 'molecules' },
  { id: 'co2',  formula: 'CO₂', formulaDisplay: f(['CO', {sub: 2}]),
    name: 'Carbon dioxide',  molarMass: 44.01,  phase: 'gas',    particleUnit: 'molecules' },
  { id: 'ch4',  formula: 'CH₄', formulaDisplay: f(['CH', {sub: 4}]),
    name: 'Methane',         molarMass: 16.04,  phase: 'gas',    particleUnit: 'molecules' },
  { id: 'nh3',  formula: 'NH₃', formulaDisplay: f(['NH', {sub: 3}]),
    name: 'Ammonia',         molarMass: 17.03,  phase: 'gas',    particleUnit: 'molecules' },

  // Liquids
  { id: 'h2o',     formula: 'H₂O',     formulaDisplay: f(['H', {sub: 2}, 'O']),
    name: 'Water',           molarMass: 18.015, phase: 'liquid', particleUnit: 'molecules' },
  { id: 'h2so4',   formula: 'H₂SO₄',   formulaDisplay: f(['H', {sub: 2}, 'SO', {sub: 4}]),
    name: 'Sulphuric acid',  molarMass: 98.08,  phase: 'liquid', particleUnit: 'molecules' },
  { id: 'c2h5oh',  formula: 'C₂H₅OH',  formulaDisplay: f(['C', {sub: 2}, 'H', {sub: 5}, 'OH']),
    name: 'Ethanol',         molarMass: 46.07,  phase: 'liquid', particleUnit: 'molecules' },

  // Solids — ionic compounds (formula units) and atomic elements (atoms)
  { id: 'nacl',   formula: 'NaCl',     formulaDisplay: f(['NaCl']),
    name: 'Sodium chloride', molarMass: 58.44,  phase: 'solid',  particleUnit: 'formula units' },
  { id: 'glucose', formula: 'C₆H₁₂O₆', formulaDisplay: f(['C', {sub: 6}, 'H', {sub: 12}, 'O', {sub: 6}]),
    name: 'Glucose',         molarMass: 180.16, phase: 'solid',  particleUnit: 'molecules' },
  { id: 'caco3',  formula: 'CaCO₃',    formulaDisplay: f(['CaCO', {sub: 3}]),
    name: 'Calcium carbonate', molarMass: 100.09, phase: 'solid', particleUnit: 'formula units' },
  { id: 'c',      formula: 'C',        formulaDisplay: f(['C']),
    name: 'Carbon (graphite)', molarMass: 12.011, phase: 'solid', particleUnit: 'atoms' },
  { id: 'fe',     formula: 'Fe',       formulaDisplay: f(['Fe']),
    name: 'Iron',            molarMass: 55.845, phase: 'solid',  particleUnit: 'atoms' },
  { id: 'au',     formula: 'Au',       formulaDisplay: f(['Au']),
    name: 'Gold',            molarMass: 196.967, phase: 'solid', particleUnit: 'atoms' },
];

// ── Number formatting ─────────────────────────────────────────────────────
// Mass / moles / volume get plain decimal; particles always use scientific
// notation because the values span ~25 orders of magnitude.
//
// IMPORTANT: we never expose JavaScript's native "e+23" notation to students.
// It looks like programming-speak and isn't what they see in NCERT or any
// chemistry textbook. We always show "6.022 × 10²³" with Unicode superscript
// digits, which is the universal scientific-notation form.

const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

// Converts a string like "6.022e+23" → "6.022 × 10²³" with proper superscript.
// Returns the input unchanged if it isn't in e-notation.
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

function fmtDecimal(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1000 || abs < 0.001) return prettyExp(v.toExponential(3));
  if (abs >= 100) return v.toFixed(2);
  if (abs >= 10)  return v.toFixed(3);
  if (abs >= 1)   return v.toFixed(4);
  return v.toFixed(5);
}

function fmtParticles(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '—';
  if (v === 0) return '0';
  return prettyExp(v.toExponential(3));
}

// Used as the editable draft when the user focuses an input. parseFloat()
// can't read Unicode superscript digits, so the draft always starts in the
// canonical "1.234e+5" form (or plain decimal for small numbers), which
// parseFloat() handles natively.
function rawNumber(v: number): string {
  if (!isFinite(v) || isNaN(v)) return '';
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e6 || abs < 1e-4) return v.toExponential(3);
  return String(v);
}

// Phase-based accent palette (kept inside Section 3 of the workflow's palette)
const PHASE = {
  gas:    { color: '#60a5fa', label: 'Gas',    icon: '☁',  bg: 'rgba(96,165,250,0.10)', border: 'rgba(96,165,250,0.30)' },
  liquid: { color: '#22d3ee', label: 'Liquid', icon: '💧', bg: 'rgba(34,211,238,0.10)', border: 'rgba(34,211,238,0.30)' },
  solid:  { color: '#fbbf24', label: 'Solid',  icon: '■',  bg: 'rgba(251,191,36,0.10)', border: 'rgba(251,191,36,0.30)' },
} as const;

// ── Quantity field ─────────────────────────────────────────────────────────
// A controlled input with a draft buffer: while focused, the field shows
// exactly what the user typed; when blurred (or another field is focused),
// it reverts to the formatted derived value. This avoids the standard
// "cursor jumps because value re-formatted on every keystroke" footgun.

interface FieldProps {
  label: string;
  unit: string;
  value: number;
  formatted: string;
  accent: string;
  formula?: React.ReactNode;     // small subtitle showing the conversion math
  disabled?: boolean;
  disabledReason?: string;
  active: boolean;
  draft: string;
  onChange: (raw: string) => void;
  onFocus: () => void;
  onBlur: () => void;
}

function QuantityField({ label, unit, formatted, accent, formula, disabled, disabledReason,
                        active, draft, onChange, onFocus, onBlur }: FieldProps) {
  return (
    <div className="rounded-xl p-4 transition-all"
      style={{
        background: disabled ? 'rgba(255,255,255,0.02)' : active ? `${accent}10` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${disabled ? 'rgba(255,255,255,0.04)' : active ? `${accent}55` : 'rgba(255,255,255,0.07)'}`,
        opacity: disabled ? 0.5 : 1,
      }}>
      <div className="flex justify-between items-baseline mb-2">
        <div className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: accent }}>
          {label}
        </div>
        <div className="text-[10px] font-bold" style={{ color: '#64748b' }}>{unit}</div>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={active ? draft : formatted}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: 24,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: disabled ? '#475569' : '#e2e8f0',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'text',
        }} />
      {disabled && disabledReason && (
        <div className="text-[10px] italic mt-1" style={{ color: '#64748b' }}>
          {disabledReason}
        </div>
      )}
      {!disabled && formula && (
        <div className="text-[11px] mt-1" style={{ color: '#64748b', fontStyle: 'italic' }}>
          {formula}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

type FieldKey = 'mass' | 'moles' | 'particles' | 'volume';

export default function MoleConverterSim() {
  const [substanceId, setSubstanceId] = useState<string>('h2o');
  const [moles, setMoles] = useState<number>(1);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [draft, setDraft] = useState<string>('');

  const substance = useMemo(() => SUBSTANCES.find(s => s.id === substanceId) ?? SUBSTANCES[0], [substanceId]);
  const M = substance.molarMass;
  const isGas = substance.phase === 'gas';
  const phaseMeta = PHASE[substance.phase];

  // Derived quantities (always recomputed from canonical moles state)
  const mass      = moles * M;
  const particles = moles * N_A;
  const volume    = moles * MOLAR_VOLUME_STP;

  function handleChange(field: FieldKey, raw: string) {
    setActiveField(field);
    setDraft(raw);
    const n = parseFloat(raw);
    if (isFinite(n) && !isNaN(n) && n >= 0) {
      let nextMoles = moles;
      if (field === 'mass')      nextMoles = n / M;
      if (field === 'moles')     nextMoles = n;
      if (field === 'particles') nextMoles = n / N_A;
      if (field === 'volume')    nextMoles = n / MOLAR_VOLUME_STP;
      setMoles(nextMoles);
    }
  }

  function clearActive() { setActiveField(null); setDraft(''); }

  function applyPreset(m: number) { setMoles(m); clearActive(); }

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16,
               minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Mole <span style={{ color: '#7c3aed' }}>Converter</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}>
            Mass ↔ Moles ↔ Particles ↔ Volume · NCERT Class 11 Ch. 1
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest pt-1">
          <span className="px-2 py-1 rounded-full"
            style={{ background: phaseMeta.bg, border: `1px solid ${phaseMeta.border}`, color: phaseMeta.color }}>
            {phaseMeta.icon} {phaseMeta.label}
          </span>
        </div>
      </div>

      {/* ── Substance pills ────────────────────────────────────────────── */}
      <div className="mb-4">
        <div className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: '#475569' }}>
          Substance
        </div>
        <div className="flex flex-wrap gap-2">
          {SUBSTANCES.map(s => {
            const active = s.id === substanceId;
            const meta = PHASE[s.phase];
            return (
              <button key={s.id}
                onClick={() => { setSubstanceId(s.id); clearActive(); }}
                className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all flex items-center gap-1.5"
                style={{
                  background: active ? `${meta.color}18` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? `${meta.color}50` : 'rgba(255,255,255,0.08)'}`,
                  color: active ? meta.color : '#94a3b8',
                  fontFamily: 'system-ui',
                }}>
                <span style={{ fontSize: 9, opacity: 0.7 }}>{meta.icon}</span>
                {s.formula}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main grid: substance card + 4 conversion fields ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-5">

        {/* Left — selected-substance card */}
        <div className="rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center gap-4"
          style={{
            background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            minHeight: 320,
          }}>
          <div className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: '#475569' }}>Selected</div>
          <div style={{
            fontSize: 56, fontWeight: 800,
            color: phaseMeta.color, lineHeight: 1,
            letterSpacing: '-0.01em',
            fontFamily: 'system-ui, sans-serif',
          }}>
            {substance.formulaDisplay}
          </div>
          <div className="text-sm" style={{ color: '#cbd5e1' }}>{substance.name}</div>
          <div className="grid grid-cols-2 gap-2 w-full mt-2">
            <div className="rounded-lg p-2 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: '#64748b' }}>Molar Mass</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#e2e8f0', fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>
                {M.toFixed(M < 10 ? 3 : M < 100 ? 2 : 2)}
              </div>
              <div className="text-[9px]" style={{ color: '#64748b' }}>g mol⁻¹</div>
            </div>
            <div className="rounded-lg p-2 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="text-[9px] font-black uppercase tracking-widest"
                style={{ color: '#64748b' }}>Particle</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', marginTop: 6 }}>
                {substance.particleUnit}
              </div>
            </div>
          </div>

          {/* Quick preset moles */}
          <div className="w-full mt-3">
            <div className="text-[9px] font-black uppercase tracking-widest mb-1.5 text-center"
              style={{ color: '#475569' }}>Quick presets (moles)</div>
            <div className="flex gap-1.5 justify-center flex-wrap">
              {[0.1, 0.5, 1, 2, 5, 10].map(m => (
                <button key={m} onClick={() => applyPreset(m)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all"
                  style={{
                    background: Math.abs(moles - m) < 1e-9 ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${Math.abs(moles - m) < 1e-9 ? 'rgba(167,139,250,0.45)' : 'rgba(255,255,255,0.08)'}`,
                    color: Math.abs(moles - m) < 1e-9 ? '#c4b5fd' : '#64748b',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right — four conversion fields (2x2 grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuantityField
            label="Mass"  unit="g"  accent="#fbbf24"
            value={mass} formatted={fmtDecimal(mass)}
            formula={<>mass = moles × {M.toFixed(2)}</>}
            active={activeField === 'mass'} draft={draft}
            onChange={(v) => handleChange('mass', v)}
            onFocus={() => { setActiveField('mass'); setDraft(rawNumber(mass)); }}
            onBlur={clearActive} />

          <QuantityField
            label="Moles" unit="mol" accent="#a78bfa"
            value={moles} formatted={fmtDecimal(moles)}
            formula={<>= canonical state</>}
            active={activeField === 'moles'} draft={draft}
            onChange={(v) => handleChange('moles', v)}
            onFocus={() => { setActiveField('moles'); setDraft(rawNumber(moles)); }}
            onBlur={clearActive} />

          <QuantityField
            label={`Particles (${substance.particleUnit})`} unit="count" accent="#34d399"
            value={particles} formatted={fmtParticles(particles)}
            formula={<>= moles × 6.022 × 10²³</>}
            active={activeField === 'particles'} draft={draft}
            onChange={(v) => handleChange('particles', v)}
            onFocus={() => { setActiveField('particles'); setDraft(rawNumber(particles)); }}
            onBlur={clearActive} />

          <QuantityField
            label="Volume at STP" unit="L" accent="#60a5fa"
            value={volume} formatted={fmtDecimal(volume)}
            formula={<>= moles × 22.4 L (gas only)</>}
            disabled={!isGas}
            disabledReason="Only valid for gases at STP — this substance is a liquid/solid."
            active={activeField === 'volume'} draft={draft}
            onChange={(v) => handleChange('volume', v)}
            onFocus={() => { setActiveField('volume'); setDraft(rawNumber(volume)); }}
            onBlur={clearActive} />
        </div>
      </div>

      {/* ── Scale visualisation strip ──────────────────────────────────── */}
      <div className="mt-5 rounded-xl p-4"
        style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.18)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-2"
          style={{ color: '#a78bfa' }}>The Conversion Chain</div>
        <div className="flex items-center justify-between gap-2 flex-wrap text-[13px] tabular-nums"
          style={{ color: '#cbd5e1' }}>
          <span><b style={{ color: '#fbbf24' }}>{fmtDecimal(mass)} g</b></span>
          <span style={{ color: '#475569', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            {/* "× 1/M" instead of "÷ M" — the ÷ glyph reads as + from a distance */}
            ×
            <span style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
              verticalAlign: 'middle', lineHeight: 1.15,
            }}>
              <span style={{ padding: '0 4px 1px 4px' }}>1</span>
              <span style={{
                padding: '1px 4px 0 4px',
                borderTop: '1.5px solid currentColor',
                width: '100%', textAlign: 'center',
              }}>{M.toFixed(2)}</span>
            </span>
            →
          </span>
          <span><b style={{ color: '#c4b5fd' }}>{fmtDecimal(moles)} mol</b></span>
          <span style={{ color: '#475569' }}>× N<sub>A</sub> →</span>
          <span><b style={{ color: '#6ee7b7' }}>{fmtParticles(particles)}</b> {substance.particleUnit}</span>
          {isGas && (
            <>
              <span style={{ color: '#475569' }}>• × 22.4 →</span>
              <span><b style={{ color: '#93c5fd' }}>{fmtDecimal(volume)} L</b></span>
            </>
          )}
        </div>
      </div>

      {/* ── Expert tip ─────────────────────────────────────────────────── */}
      <div className="mt-4 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5"
          style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Moles is the canonical quantity — everything else (mass, particles, gas volume) is just a different unit
          for measuring how many particles you have. Set <i>moles</i> right and every other conversion is one
          multiplication away.&rdquo;
        </p>
      </div>
    </div>
  );
}
