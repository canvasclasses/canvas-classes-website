'use client';

/**
 * Equivalent Concept & n-Factor Explorer
 *
 * Academic source: NCERT Class 11 Chemistry, Chapter 1 — Some Basic Concepts
 * of Chemistry (§1.10 Stoichiometry, plus standard equivalent-concept treatment
 * carried forward in JEE/NEET preparation).
 *
 * Pedagogical goal: build student intuition for the n-factor by category.
 * Pick a compound type → pick a compound → see the derivation, the n-factor,
 * the equivalent weight, AND a visual count of "reaction units" (H⁺ ions for
 * acids, OH⁻ ions for bases, total positive charge for salts, electrons
 * transferred for redox species).
 *
 * Includes the canonical phosphorus-acid trap that JEE asks every other year:
 *   H₃PO₂ → n=1   (only 1 ionisable H; two P-H bonds are non-ionisable)
 *   H₃PO₃ → n=2   (only 2 ionisable H; one P-H bond is non-ionisable)
 *   H₃PO₄ → n=3   (all 3 H ionisable)
 */

import { useState } from 'react';

// ── Types & data ───────────────────────────────────────────────────────────

type Category = 'acid' | 'base' | 'salt' | 'redox';

interface Compound {
  id: string;
  formula: string;                 // Pretty-printed formula (used as label)
  formulaDisplay: React.ReactNode; // Rich element with subscripts/superscripts
  name: string;
  molarMass: number;               // g mol⁻¹
  category: Category;
  nFactor: number;
  unitLabel: string;               // 'H⁺', 'OH⁻', 'charge', 'e⁻'
  derivation: string;              // Brief one-line reason
  longNote?: string;               // Optional gotcha / context
}

// Helper for rich formula rendering — keeps subscripts inline with the text
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

const COMPOUNDS: Compound[] = [
  // ── Acids (n = number of ionisable H⁺) ──
  { id: 'hcl', formula: 'HCl', formulaDisplay: f(['HCl']),
    name: 'Hydrochloric acid', molarMass: 36.5, category: 'acid',
    nFactor: 1, unitLabel: 'H⁺',
    derivation: 'Monoprotic — releases 1 H⁺ per molecule.' },
  { id: 'h2so4', formula: 'H₂SO₄', formulaDisplay: f(['H', {sub: 2}, 'SO', {sub: 4}]),
    name: 'Sulphuric acid', molarMass: 98, category: 'acid',
    nFactor: 2, unitLabel: 'H⁺',
    derivation: 'Diprotic — releases 2 H⁺ per molecule.' },
  { id: 'h3po4', formula: 'H₃PO₄', formulaDisplay: f(['H', {sub: 3}, 'PO', {sub: 4}]),
    name: 'Orthophosphoric acid', molarMass: 98, category: 'acid',
    nFactor: 3, unitLabel: 'H⁺',
    derivation: 'Triprotic — all 3 H atoms are ionisable (bonded through O).',
    longNote: 'All three H atoms are O–H bonds, so all three ionise. Compare with H₃PO₃ (n=2) and H₃PO₂ (n=1) where some H atoms are bonded directly to P and are non-ionisable.' },
  { id: 'h3po3', formula: 'H₃PO₃', formulaDisplay: f(['H', {sub: 3}, 'PO', {sub: 3}]),
    name: 'Phosphorous acid', molarMass: 82, category: 'acid',
    nFactor: 2, unitLabel: 'H⁺',
    derivation: 'Only 2 O–H bonds; the third H is P–H (non-ionisable).',
    longNote: 'JEE trap. Structurally H₃PO₃ has the form HP(O)(OH)₂ — so only 2 of the 3 H atoms are ionisable.' },
  { id: 'h3po2', formula: 'H₃PO₂', formulaDisplay: f(['H', {sub: 3}, 'PO', {sub: 2}]),
    name: 'Hypophosphorous acid', molarMass: 66, category: 'acid',
    nFactor: 1, unitLabel: 'H⁺',
    derivation: 'Only 1 O–H bond; the other 2 H are P–H (non-ionisable).',
    longNote: 'JEE trap. Structurally H₃PO₂ has the form H₂P(O)(OH) — only 1 of 3 H atoms is ionisable.' },
  { id: 'hno3', formula: 'HNO₃', formulaDisplay: f(['HNO', {sub: 3}]),
    name: 'Nitric acid', molarMass: 63, category: 'acid',
    nFactor: 1, unitLabel: 'H⁺',
    derivation: 'Monoprotic — releases 1 H⁺ per molecule.' },
  { id: 'ch3cooh', formula: 'CH₃COOH', formulaDisplay: f(['CH', {sub: 3}, 'COOH']),
    name: 'Acetic acid', molarMass: 60, category: 'acid',
    nFactor: 1, unitLabel: 'H⁺',
    derivation: 'Only the –COOH proton is ionisable (the 3 methyl H are C–H, non-ionisable).' },

  // ── Bases (n = number of replaceable OH⁻) ──
  { id: 'naoh', formula: 'NaOH', formulaDisplay: f(['NaOH']),
    name: 'Sodium hydroxide', molarMass: 40, category: 'base',
    nFactor: 1, unitLabel: 'OH⁻',
    derivation: 'Monobasic — 1 OH⁻ per formula unit.' },
  { id: 'koh', formula: 'KOH', formulaDisplay: f(['KOH']),
    name: 'Potassium hydroxide', molarMass: 56, category: 'base',
    nFactor: 1, unitLabel: 'OH⁻',
    derivation: 'Monobasic — 1 OH⁻ per formula unit.' },
  { id: 'caoh2', formula: 'Ca(OH)₂', formulaDisplay: f(['Ca(OH)', {sub: 2}]),
    name: 'Calcium hydroxide (slaked lime)', molarMass: 74, category: 'base',
    nFactor: 2, unitLabel: 'OH⁻',
    derivation: 'Dibasic — 2 OH⁻ per formula unit.' },
  { id: 'baoh2', formula: 'Ba(OH)₂', formulaDisplay: f(['Ba(OH)', {sub: 2}]),
    name: 'Barium hydroxide', molarMass: 171, category: 'base',
    nFactor: 2, unitLabel: 'OH⁻',
    derivation: 'Dibasic — 2 OH⁻ per formula unit.' },
  { id: 'aloh3', formula: 'Al(OH)₃', formulaDisplay: f(['Al(OH)', {sub: 3}]),
    name: 'Aluminium hydroxide', molarMass: 78, category: 'base',
    nFactor: 3, unitLabel: 'OH⁻',
    derivation: 'Tribasic — 3 OH⁻ per formula unit.' },

  // ── Salts (n = total positive charge per formula unit) ──
  { id: 'nacl', formula: 'NaCl', formulaDisplay: f(['NaCl']),
    name: 'Sodium chloride', molarMass: 58.5, category: 'salt',
    nFactor: 1, unitLabel: 'charge',
    derivation: 'Na⁺ × 1 = +1 total positive charge.' },
  { id: 'na2co3', formula: 'Na₂CO₃', formulaDisplay: f(['Na', {sub: 2}, 'CO', {sub: 3}]),
    name: 'Sodium carbonate', molarMass: 106, category: 'salt',
    nFactor: 2, unitLabel: 'charge',
    derivation: 'Na⁺ × 2 = +2 total positive charge.' },
  { id: 'caco3', formula: 'CaCO₃', formulaDisplay: f(['CaCO', {sub: 3}]),
    name: 'Calcium carbonate', molarMass: 100, category: 'salt',
    nFactor: 2, unitLabel: 'charge',
    derivation: 'Ca²⁺ × 1 = +2 total positive charge.' },
  { id: 'al2so43', formula: 'Al₂(SO₄)₃', formulaDisplay: f(['Al', {sub: 2}, '(SO', {sub: 4}, ')', {sub: 3}]),
    name: 'Aluminium sulphate', molarMass: 342, category: 'salt',
    nFactor: 6, unitLabel: 'charge',
    derivation: 'Al³⁺ × 2 = +6 total positive charge.' },
  { id: 'k2so4', formula: 'K₂SO₄', formulaDisplay: f(['K', {sub: 2}, 'SO', {sub: 4}]),
    name: 'Potassium sulphate', molarMass: 174, category: 'salt',
    nFactor: 2, unitLabel: 'charge',
    derivation: 'K⁺ × 2 = +2 total positive charge.' },
  { id: 'alcl3', formula: 'AlCl₃', formulaDisplay: f(['AlCl', {sub: 3}]),
    name: 'Aluminium chloride', molarMass: 133.5, category: 'salt',
    nFactor: 3, unitLabel: 'charge',
    derivation: 'Al³⁺ × 1 = +3 total positive charge.' },

  // ── Redox species (n = electrons transferred per formula unit) ──
  { id: 'kmno4_acid', formula: 'KMnO₄ (acidic)', formulaDisplay: f(['KMnO', {sub: 4}, ' (acidic)']),
    name: 'Potassium permanganate (acidic medium)', molarMass: 158, category: 'redox',
    nFactor: 5, unitLabel: 'e⁻',
    derivation: 'Mn⁷⁺ → Mn²⁺  ⇒  5 electrons gained per Mn.',
    longNote: 'In acidic medium MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O. The 5-electron change makes this the strongest of KMnO₄\'s three n-factors.' },
  { id: 'kmno4_neut', formula: 'KMnO₄ (neutral)', formulaDisplay: f(['KMnO', {sub: 4}, ' (neutral)']),
    name: 'Potassium permanganate (neutral/basic medium)', molarMass: 158, category: 'redox',
    nFactor: 3, unitLabel: 'e⁻',
    derivation: 'Mn⁷⁺ → Mn⁴⁺  ⇒  3 electrons gained per Mn.',
    longNote: 'In neutral or weakly basic medium MnO₄⁻ + 2H₂O + 3e⁻ → MnO₂ + 4OH⁻.' },
  { id: 'k2cr2o7', formula: 'K₂Cr₂O₇', formulaDisplay: f(['K', {sub: 2}, 'Cr', {sub: 2}, 'O', {sub: 7}]),
    name: 'Potassium dichromate (acidic medium)', molarMass: 294, category: 'redox',
    nFactor: 6, unitLabel: 'e⁻',
    derivation: '2 × (Cr⁶⁺ → Cr³⁺)  ⇒  6 electrons gained per formula unit.' },
  { id: 'feso4', formula: 'FeSO₄', formulaDisplay: f(['FeSO', {sub: 4}]),
    name: 'Iron(II) sulphate', molarMass: 152, category: 'redox',
    nFactor: 1, unitLabel: 'e⁻',
    derivation: 'Fe²⁺ → Fe³⁺  ⇒  1 electron lost per Fe.' },
  { id: 'h2o2_ox', formula: 'H₂O₂ (oxidant)', formulaDisplay: f(['H', {sub: 2}, 'O', {sub: 2}, ' (oxidant)']),
    name: 'Hydrogen peroxide as oxidising agent', molarMass: 34, category: 'redox',
    nFactor: 2, unitLabel: 'e⁻',
    derivation: 'O₂²⁻ → 2 O²⁻  ⇒  2 electrons gained per H₂O₂.' },
  { id: 'na2s2o3', formula: 'Na₂S₂O₃', formulaDisplay: f(['Na', {sub: 2}, 'S', {sub: 2}, 'O', {sub: 3}]),
    name: 'Sodium thiosulphate (iodometric titration)', molarMass: 158, category: 'redox',
    nFactor: 1, unitLabel: 'e⁻',
    derivation: '2 S₂O₃²⁻ → S₄O₆²⁻ + 2 e⁻  ⇒  1 electron lost per Na₂S₂O₃.' },
];

// ── Category metadata ──────────────────────────────────────────────────────

const CATEGORIES: Record<Category, { label: string; rule: string; accent: string; unitGlyph: string; unitColor: string }> = {
  acid:  { label: 'Acid',        rule: 'n = number of ionisable H⁺ per molecule',
           accent: '#f87171', unitGlyph: 'H⁺',    unitColor: '#fca5a5' },
  base:  { label: 'Base',        rule: 'n = number of replaceable OH⁻ per formula unit',
           accent: '#60a5fa', unitGlyph: 'OH⁻',   unitColor: '#93c5fd' },
  salt:  { label: 'Salt',        rule: 'n = total positive charge carried by the cation(s)',
           accent: '#fbbf24', unitGlyph: '+',     unitColor: '#fcd34d' },
  redox: { label: 'Redox',       rule: 'n = electrons gained or lost per formula unit',
           accent: '#34d399', unitGlyph: 'e⁻',    unitColor: '#6ee7b7' },
};

// ── Reaction-unit visualisation ────────────────────────────────────────────
// Draws `nFactor` glyph "tokens" arranged in a row to make the count
// visually obvious. Tokens are tinted by category.
function ReactionUnits({ n, glyph, color }: { n: number; glyph: string; color: string }) {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i}
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 44, height: 44,
            background: `${color}22`,
            border: `1.5px solid ${color}66`,
            color,
            fontSize: 14,
            fontWeight: 800,
            boxShadow: `inset 0 0 12px ${color}22`,
          }}>
          {glyph}
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────

export default function EquivalentConceptSim() {
  const [category, setCategory] = useState<Category>('acid');
  const [selectedId, setSelectedId] = useState<string>('h2so4');

  const compoundsInCat = COMPOUNDS.filter(c => c.category === category);
  const selected = COMPOUNDS.find(c => c.id === selectedId) ?? compoundsInCat[0];

  function handleCategory(cat: Category) {
    setCategory(cat);
    // Pick a representative compound when switching category
    const first = COMPOUNDS.find(c => c.category === cat);
    if (first) setSelectedId(first.id);
  }

  const catMeta = CATEGORIES[category];
  const equivalentWeight = selected.molarMass / selected.nFactor;

  return (
    <div className="p-4 md:p-6 not-prose"
      style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16,
               minHeight: '60vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Equivalent Concept <span style={{ color: '#7c3aed' }}>Explorer</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5"
            style={{ color: '#475569' }}>
            n-Factor by compound type · NCERT Class 11 Ch. 1
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1"
          style={{ color: '#64748b' }}>
          {selected.name}
        </div>
      </div>

      {/* ── Category tabs (underline style per workflow §4g) ────────────── */}
      <div className="flex mb-5 flex-wrap"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {(['acid', 'base', 'salt', 'redox'] as const).map(key => {
          const meta = CATEGORIES[key];
          const active = category === key;
          return (
            <button key={key}
              onClick={() => handleCategory(key)}
              className="px-4 py-3 text-center transition-all"
              style={{
                background: 'none', outline: 'none',
                borderBottom: `2px solid ${active ? meta.accent : 'rgba(255,255,255,0.06)'}`,
                opacity: active ? 1 : 0.55,
                marginBottom: -1,
              }}>
              <div className="text-sm font-black" style={{ color: active ? meta.accent : '#94a3b8' }}>
                {meta.label}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: '#475569' }}>
                n = {key === 'acid' ? 'H⁺ count' : key === 'base' ? 'OH⁻ count' : key === 'salt' ? 'total ⊕ charge' : 'e⁻ transferred'}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Compound pills ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 mb-5">
        {compoundsInCat.map(c => {
          const active = c.id === selectedId;
          return (
            <button key={c.id} onClick={() => setSelectedId(c.id)}
              className="px-3 py-1.5 rounded-full text-[13px] font-bold transition-all"
              style={{
                background: active ? `${catMeta.accent}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? `${catMeta.accent}50` : 'rgba(255,255,255,0.08)'}`,
                color: active ? catMeta.accent : '#94a3b8',
                fontFamily: 'system-ui',
              }}>
              {c.formula}
            </button>
          );
        })}
      </div>

      {/* ── Main grid: visualisation + derivation ───────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-5">

        {/* Left — formula visualisation */}
        <div className="rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center gap-5"
          style={{
            background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            minHeight: 320,
          }}>
          {/* Big formula */}
          <div className="text-center">
            <div className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: '#475569' }}>Compound</div>
            <div style={{
              fontSize: 48, fontWeight: 800,
              color: catMeta.accent, lineHeight: 1,
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '-0.01em',
            }}>
              {selected.formulaDisplay}
            </div>
            <div className="mt-2 text-sm" style={{ color: '#94a3b8' }}>
              M = {selected.molarMass} g mol⁻¹
            </div>
          </div>

          {/* Divider */}
          <div className="w-2/3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

          {/* Reaction units */}
          <div className="text-center w-full">
            <div className="text-[10px] font-black uppercase tracking-widest mb-3"
              style={{ color: catMeta.accent, opacity: 0.85 }}>
              {selected.nFactor} reaction unit{selected.nFactor !== 1 ? 's' : ''} ({catMeta.unitGlyph})
            </div>
            <ReactionUnits n={selected.nFactor} glyph={catMeta.unitGlyph} color={catMeta.accent} />
          </div>
        </div>

        {/* Right — derivation panel */}
        <div className="flex flex-col gap-4">

          {/* The rule for this category */}
          <div className="rounded-xl p-4"
            style={{
              background: `${catMeta.accent}0d`,
              border: `1px solid ${catMeta.accent}30`,
            }}>
            <div className="text-[10px] font-black uppercase tracking-widest mb-1.5"
              style={{ color: catMeta.accent }}>The Rule</div>
            <div className="text-sm leading-snug text-white font-medium">
              {catMeta.rule}
            </div>
          </div>

          {/* Step-by-step derivation */}
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest mb-2"
              style={{ color: '#94a3b8' }}>Derivation</div>
            <div className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
              {selected.derivation}
            </div>
            {selected.longNote && (
              <div className="mt-2 text-[12px] leading-snug italic px-3 py-2 rounded-lg"
                style={{ background: 'rgba(251,191,36,0.06)', color: '#fcd34d',
                         border: '1px solid rgba(251,191,36,0.18)' }}>
                ⚠ {selected.longNote}
              </div>
            )}
          </div>

          {/* n-factor + equivalent weight pills */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3 text-center"
              style={{
                background: `${catMeta.accent}10`,
                border: `1px solid ${catMeta.accent}30`,
              }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: catMeta.accent }}>n-factor</div>
              <div style={{ fontSize: 28, fontWeight: 800,
                color: catMeta.accent, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {selected.nFactor}
              </div>
            </div>
            <div className="rounded-lg p-3 text-center"
              style={{
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.30)',
              }}>
              <div className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: '#a78bfa' }}>Equiv. wt.</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#c4b5fd',
                fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                {equivalentWeight.toFixed(2)}
              </div>
              <div className="text-[9px] mt-1" style={{ color: '#64748b' }}>g/equivalent</div>
            </div>
          </div>

          {/* Live formula — uses vertical fraction notation so numerator
              and denominator read clearly from a distance (no ÷ symbol) */}
          <div className="rounded-lg px-3 py-2.5 text-center"
            style={{
              background: 'rgba(167,139,250,0.06)',
              border: '1px solid rgba(167,139,250,0.18)',
            }}>
            <div className="text-[11px] font-bold mb-1" style={{ color: '#94a3b8' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                Equivalent weight =
                <span style={{
                  display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                  verticalAlign: 'middle', lineHeight: 1.15, margin: '0 4px',
                }}>
                  <span style={{ padding: '0 6px 2px 6px' }}>molar mass</span>
                  <span style={{ padding: '2px 6px 0 6px', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>n-factor</span>
                </span>
              </span>
            </div>
            <div style={{ fontSize: 13, color: '#c4b5fd', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{
                  display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                  verticalAlign: 'middle', lineHeight: 1.15, margin: '0 4px',
                }}>
                  <span style={{ padding: '0 6px 2px 6px' }}>{selected.molarMass}</span>
                  <span style={{ padding: '2px 6px 0 6px', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{selected.nFactor}</span>
                </span>
                = {equivalentWeight.toFixed(2)} g/equivalent
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expert tip footer (per workflow §4j) ─────────────────────────── */}
      <div className="mt-5 pt-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="text-[10px] font-black uppercase tracking-widest mb-1.5"
          style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;The n-factor is the bridge between mole-mole and equivalent-equivalent stoichiometry —
          once you pick the right category and apply its rule, equivalent calculations become one-line arithmetic.&rdquo;
        </p>
      </div>
    </div>
  );
}
