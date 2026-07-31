'use client';

/**
 * IonicCompoundNamerSim — pick a cation and an anion, get the compound
 *
 * Naming/formula rules encoded here, with sources:
 *
 * 1. Criss-cross method for writing ionic formulae (swap the two ions'
 *    charge magnitudes to get subscripts, then reduce to lowest terms) —
 *    NCERT Class 9 Science, Chapter 3 "Atoms and Molecules" (valency table
 *    + worked formula-writing examples for both simple and polyatomic ions).
 * 2. Salt names are simply "cation name + anion name" — NCERT Class 11
 *    Chemistry, Chapter 1 "Some Basic Concepts of Chemistry" nomenclature
 *    conventions.
 * 3. Stock (additive) notation — a Roman numeral in parentheses after a
 *    variable-valency metal's name (iron(II) vs iron(III), copper(I) vs
 *    copper(II)) — IUPAC 2005 Recommendations, "Nomenclature of Inorganic
 *    Chemistry" (Red Book), compositional nomenclature.
 * 4. Oxoanion/oxoacid suffix ladder — hypo-...-ite (least O) < -ite <
 *    -ate < per-...-ate (most O); the matching acid takes -ic (from -ate)
 *    or -ous (from -ite); binary/simple anions take hydro-...-ic acid —
 *    standard convention in inorganic chemistry texts used for JEE/NEET
 *    prep (e.g. J.D. Lee, Concise Inorganic Chemistry, oxoacid chapter).
 * 5. Two irregular H+ pairings are hard-coded rather than run through the
 *    generic acid-naming rule, because the real product isn't an acid at
 *    all: H+ + OH- and H+ + O2- both give water, and H+ + N3- gives
 *    ammonia (NH3) — well-known exceptions worth surfacing, not a bug in
 *    the rule.
 *
 * The predict-first gate for this sim lives on the book page's own
 * `prediction` field (the platform's standard mechanism), not in this file.
 */

import { useState } from 'react';
import {
  SimShell, SimHeader, SectionLabel, ExpertTip,
  ACCENT, ACCENT_2, TEXT, BORDER, accentTint,
} from './_shared';

interface Ion {
  id: string;
  formula: string;      // element/group symbol with any internal subscript already baked in as unicode, e.g. "SO₄"
  charge: number;       // signed integer, e.g. 3 or -2
  chargeLabel: string;  // formula + unicode charge superscript, e.g. "Fe³⁺"
  name: string;         // e.g. "Iron(III)" (cation) or "chloride" (anion, lowercase)
  polyatomic: boolean;  // true if the ion is more than one atom -> gets parentheses when its count > 1
  note?: string;        // short aside shown under the button (e.g. "variable valency")
}

interface Anion extends Ion {
  acidName: string;               // full name of the acid formed with H+, e.g. "Sulfuric acid"
  suffixFamily: 'ide' | 'ide-exception' | 'ate' | 'ite' | 'hypo-ite' | 'per-ate';
}

const CATIONS: Ion[] = [
  { id: 'h', formula: 'H', charge: 1, chargeLabel: 'H⁺', name: 'Hydrogen', polyatomic: false },
  { id: 'li', formula: 'Li', charge: 1, chargeLabel: 'Li⁺', name: 'Lithium', polyatomic: false },
  { id: 'na', formula: 'Na', charge: 1, chargeLabel: 'Na⁺', name: 'Sodium', polyatomic: false },
  { id: 'k', formula: 'K', charge: 1, chargeLabel: 'K⁺', name: 'Potassium', polyatomic: false },
  { id: 'nh4', formula: 'NH₄', charge: 1, chargeLabel: 'NH₄⁺', name: 'Ammonium', polyatomic: true, note: 'a group that behaves as one ion' },
  { id: 'ag', formula: 'Ag', charge: 1, chargeLabel: 'Ag⁺', name: 'Silver', polyatomic: false },
  { id: 'mg', formula: 'Mg', charge: 2, chargeLabel: 'Mg²⁺', name: 'Magnesium', polyatomic: false },
  { id: 'ca', formula: 'Ca', charge: 2, chargeLabel: 'Ca²⁺', name: 'Calcium', polyatomic: false },
  { id: 'ba', formula: 'Ba', charge: 2, chargeLabel: 'Ba²⁺', name: 'Barium', polyatomic: false },
  { id: 'zn', formula: 'Zn', charge: 2, chargeLabel: 'Zn²⁺', name: 'Zinc', polyatomic: false },
  { id: 'al', formula: 'Al', charge: 3, chargeLabel: 'Al³⁺', name: 'Aluminium', polyatomic: false },
  { id: 'cu1', formula: 'Cu', charge: 1, chargeLabel: 'Cu⁺', name: 'Copper(I)', polyatomic: false, note: 'variable valency' },
  { id: 'cu2', formula: 'Cu', charge: 2, chargeLabel: 'Cu²⁺', name: 'Copper(II)', polyatomic: false, note: 'variable valency' },
  { id: 'fe2', formula: 'Fe', charge: 2, chargeLabel: 'Fe²⁺', name: 'Iron(II)', polyatomic: false, note: 'variable valency' },
  { id: 'fe3', formula: 'Fe', charge: 3, chargeLabel: 'Fe³⁺', name: 'Iron(III)', polyatomic: false, note: 'variable valency' },
];

const ANIONS: Anion[] = [
  { id: 'cl', formula: 'Cl', charge: -1, chargeLabel: 'Cl⁻', name: 'chloride', polyatomic: false, suffixFamily: 'ide', acidName: 'Hydrochloric acid' },
  { id: 'br', formula: 'Br', charge: -1, chargeLabel: 'Br⁻', name: 'bromide', polyatomic: false, suffixFamily: 'ide', acidName: 'Hydrobromic acid' },
  { id: 'i', formula: 'I', charge: -1, chargeLabel: 'I⁻', name: 'iodide', polyatomic: false, suffixFamily: 'ide', acidName: 'Hydroiodic acid' },
  { id: 'o', formula: 'O', charge: -2, chargeLabel: 'O²⁻', name: 'oxide', polyatomic: false, suffixFamily: 'ide', acidName: 'Water (H⁺ + O²⁻ isn’t named as an acid)' },
  { id: 's', formula: 'S', charge: -2, chargeLabel: 'S²⁻', name: 'sulfide', polyatomic: false, suffixFamily: 'ide', acidName: 'Hydrosulfuric acid' },
  { id: 'n', formula: 'N', charge: -3, chargeLabel: 'N³⁻', name: 'nitride', polyatomic: false, suffixFamily: 'ide', acidName: 'Ammonia (H⁺ + N³⁻ isn’t named as an acid)' },
  { id: 'oh', formula: 'OH', charge: -1, chargeLabel: 'OH⁻', name: 'hydroxide', polyatomic: true, suffixFamily: 'ide-exception', acidName: 'Water (H⁺ + OH⁻ isn’t named as an acid)' },
  { id: 'cn', formula: 'CN', charge: -1, chargeLabel: 'CN⁻', name: 'cyanide', polyatomic: true, suffixFamily: 'ide-exception', acidName: 'Hydrocyanic acid' },
  { id: 'so4', formula: 'SO₄', charge: -2, chargeLabel: 'SO₄²⁻', name: 'sulfate', polyatomic: true, suffixFamily: 'ate', acidName: 'Sulfuric acid' },
  { id: 'so3', formula: 'SO₃', charge: -2, chargeLabel: 'SO₃²⁻', name: 'sulfite', polyatomic: true, suffixFamily: 'ite', acidName: 'Sulfurous acid' },
  { id: 'no3', formula: 'NO₃', charge: -1, chargeLabel: 'NO₃⁻', name: 'nitrate', polyatomic: true, suffixFamily: 'ate', acidName: 'Nitric acid' },
  { id: 'co3', formula: 'CO₃', charge: -2, chargeLabel: 'CO₃²⁻', name: 'carbonate', polyatomic: true, suffixFamily: 'ate', acidName: 'Carbonic acid' },
  { id: 'po4', formula: 'PO₄', charge: -3, chargeLabel: 'PO₄³⁻', name: 'phosphate', polyatomic: true, suffixFamily: 'ate', acidName: 'Phosphoric acid' },
  { id: 'clo', formula: 'ClO', charge: -1, chargeLabel: 'ClO⁻', name: 'hypochlorite', polyatomic: true, suffixFamily: 'hypo-ite', acidName: 'Hypochlorous acid' },
  { id: 'clo3', formula: 'ClO₃', charge: -1, chargeLabel: 'ClO₃⁻', name: 'chlorate', polyatomic: true, suffixFamily: 'ate', acidName: 'Chloric acid' },
  { id: 'clo4', formula: 'ClO₄', charge: -1, chargeLabel: 'ClO₄⁻', name: 'perchlorate', polyatomic: true, suffixFamily: 'per-ate', acidName: 'Perchloric acid' },
];

const SUB_DIGITS = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
function sub(n: number): string {
  if (n <= 1) return '';
  return String(n).split('').map((d) => SUB_DIGITS[Number(d)]).join('');
}
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const RULE_NOTES: Record<Anion['suffixFamily'], string> = {
  'ide': 'A simple (one-element) anion always ends in -ide.',
  'ide-exception': 'This is a group of atoms, but it still ends in -ide — one of a short list of exceptions worth memorizing (hydroxide, cyanide).',
  'ate': 'Ends in -ate: this oxoanion has the higher of the two common oxygen counts for this element.',
  'ite': 'Ends in -ite: this oxoanion has the lower of the two common oxygen counts for this element — one fewer O than the -ate form.',
  'hypo-ite': 'hypo- + -ite: this is the least-oxygen member of chlorine’s four-ion family.',
  'per-ate': 'per- + -ate: this is the most-oxygen member of chlorine’s four-ion family.',
};

interface CompoundResult {
  cationStr: string;
  anionStr: string;
  name: string;
  isAcid: boolean;
  isSpecial: boolean;
  specialNote?: string;
  ruleNote: string;
  valencyNote?: string;
}

function buildCompound(cation: Ion, anion: Anion): CompoundResult {
  if (cation.id === 'h' && (anion.id === 'oh' || anion.id === 'o')) {
    return {
      cationStr: anion.id === 'oh' ? 'H' : 'H₂',
      anionStr: anion.id === 'oh' ? 'OH' : 'O',
      name: 'Water',
      isAcid: false,
      isSpecial: true,
      specialNote: 'H⁺ neutralizing O²⁻ or OH⁻ doesn’t make an acid — it makes water. Both routes land on H₂O.',
      ruleNote: RULE_NOTES[anion.suffixFamily],
    };
  }
  if (cation.id === 'h' && anion.id === 'n') {
    return {
      cationStr: 'H₃',
      anionStr: 'N',
      name: 'Ammonia',
      isAcid: false,
      isSpecial: true,
      specialNote: 'H⁺ combining with N³⁻ gives NH₃ — a base, not an acid. Nitride is the one anion here whose "acid" isn’t an acid at all.',
      ruleNote: RULE_NOTES[anion.suffixFamily],
    };
  }

  const g = gcd(Math.abs(cation.charge), Math.abs(anion.charge));
  const cationCount = Math.abs(anion.charge) / g;
  const anionCount = Math.abs(cation.charge) / g;
  const cationStr = cation.polyatomic && cationCount > 1
    ? `(${cation.formula})${sub(cationCount)}`
    : `${cation.formula}${sub(cationCount)}`;
  const anionStr = anion.polyatomic && anionCount > 1
    ? `(${anion.formula})${sub(anionCount)}`
    : `${anion.formula}${sub(anionCount)}`;

  if (cation.id === 'h') {
    return {
      cationStr, anionStr,
      name: anion.acidName,
      isAcid: true,
      isSpecial: false,
      ruleNote: anion.suffixFamily === 'ate' || anion.suffixFamily === 'per-ate'
        ? 'An -ate (or per-...-ate) oxoanion’s acid ends in -ic acid.'
        : anion.suffixFamily === 'ite' || anion.suffixFamily === 'hypo-ite'
        ? 'An -ite (or hypo-...-ite) oxoanion’s acid ends in -ous acid.'
        : 'A simple anion’s acid takes the hydro-...-ic acid pattern.',
    };
  }

  return {
    cationStr, anionStr,
    name: `${cation.name} ${anion.name}`,
    isAcid: false,
    isSpecial: false,
    ruleNote: RULE_NOTES[anion.suffixFamily],
    valencyNote: cation.note === 'variable valency'
      ? `${cation.formula} can lose a different number of electrons depending on the compound, so the Roman numeral — (${cation.charge === 3 ? 'III' : cation.charge === 2 ? 'II' : 'I'}) — tells you which charge is in play here.`
      : undefined,
  };
}

function IonButton({ ion, active, accent, onClick }: { ion: Ion; active: boolean; accent: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={ion.note}
      className="text-left px-3 py-1.5 rounded-lg transition-all flex flex-col items-start gap-0.5 min-w-[92px]"
      style={{
        background: active ? accentTint(accent, 0.15) : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? accentTint(accent, 0.45) : BORDER.card}`,
      }}
    >
      <span className="text-sm font-bold tabular-nums" style={{ color: active ? accent : TEXT.primary }}>
        {ion.chargeLabel}
      </span>
      <span className="text-[10px] leading-tight" style={{ color: TEXT.secondary }}>{ion.name}</span>
    </button>
  );
}

export default function IonicCompoundNamerSim() {
  const [cationId, setCationId] = useState<string | null>(null);
  const [anionId, setAnionId] = useState<string | null>(null);

  const cation = CATIONS.find((c) => c.id === cationId) ?? null;
  const anion = ANIONS.find((a) => a.id === anionId) ?? null;
  const result = cation && anion ? buildCompound(cation, anion) : null;

  return (
    <SimShell>
      <SimHeader
        title="Ionic Compound"
        accentWord="Namer"
        subtitle="Pick one cation and one anion to build the compound"
      />

      <div>
        <SectionLabel accent={ACCENT} className="mb-2">Cations — positive ions</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {CATIONS.map((c) => (
            <IonButton key={c.id} ion={c} accent={ACCENT} active={c.id === cationId} onClick={() => setCationId(c.id)} />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <SectionLabel accent={ACCENT_2} className="mb-2">Anions — negative ions</SectionLabel>
        <div className="flex flex-wrap gap-1.5">
          {ANIONS.map((a) => (
            <IonButton key={a.id} ion={a} accent={ACCENT_2} active={a.id === anionId} onClick={() => setAnionId(a.id)} />
          ))}
        </div>
      </div>

      <div
        className="mt-5 rounded-xl p-4 md:p-5 transition-all"
        style={{ background: '#0B0F15', border: `1px solid ${BORDER.card}`, minHeight: 132 }}
      >
        {!result ? (
          <p className="text-sm" style={{ color: TEXT.muted }}>
            Pick one cation on the left and one anion on the right to see the compound they form.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="text-2xl md:text-3xl font-black tabular-nums">
              <span style={{ color: ACCENT }}>{result.cationStr}</span>
              <span style={{ color: ACCENT_2 }}>{result.anionStr}</span>
            </div>
            <div className="text-lg font-bold">
              {result.isSpecial || result.isAcid ? (
                <span style={{ color: TEXT.primary }}>{result.name}</span>
              ) : (
                <>
                  <span style={{ color: ACCENT }}>{cation!.name}</span>{' '}
                  <span style={{ color: ACCENT_2 }}>{anion!.name}</span>
                </>
              )}
            </div>
            {result.isSpecial && (
              <p className="text-sm leading-snug" style={{ color: TEXT.secondary }}>{result.specialNote}</p>
            )}
            <p className="text-xs leading-snug mt-1" style={{ color: TEXT.ghost }}>{result.ruleNote}</p>
            {result.valencyNote && (
              <p className="text-xs leading-snug" style={{ color: TEXT.ghost }}>{result.valencyNote}</p>
            )}
          </div>
        )}
      </div>

      <ExpertTip accent={ACCENT}>
        The fastest way to remember the oxoanion ladder: more oxygen pushes the name toward -ate and per-; less oxygen
        pushes it toward -ite and hypo-. Chlorine’s four ions (hypochlorite, chlorite, chlorate, perchlorate) are
        the textbook example — this tool only lists three of the four so you can quiz yourself on where chlorite fits.
      </ExpertTip>
    </SimShell>
  );
}
