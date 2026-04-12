'use client';

// Atom Builder & Comparator
// Students add/remove protons, neutrons, and electrons to two atoms and
// instantly see Z, A, ion charge, and the nuclear relationship (isotopes,
// isobars, isotones, isoelectronic).

import { useState, useCallback } from 'react';

// ── Element data (H → Ca) ──────────────────────────────────────────────────
const ELEMENTS: Record<number, { symbol: string; name: string; color: string }> = {
  1:  { symbol: 'H',  name: 'Hydrogen',    color: '#60a5fa' },
  2:  { symbol: 'He', name: 'Helium',      color: '#a78bfa' },
  3:  { symbol: 'Li', name: 'Lithium',     color: '#fb923c' },
  4:  { symbol: 'Be', name: 'Beryllium',   color: '#4ade80' },
  5:  { symbol: 'B',  name: 'Boron',       color: '#f472b6' },
  6:  { symbol: 'C',  name: 'Carbon',      color: '#94a3b8' },
  7:  { symbol: 'N',  name: 'Nitrogen',    color: '#38bdf8' },
  8:  { symbol: 'O',  name: 'Oxygen',      color: '#f87171' },
  9:  { symbol: 'F',  name: 'Fluorine',    color: '#facc15' },
  10: { symbol: 'Ne', name: 'Neon',        color: '#e879f9' },
  11: { symbol: 'Na', name: 'Sodium',      color: '#fb923c' },
  12: { symbol: 'Mg', name: 'Magnesium',   color: '#34d399' },
  13: { symbol: 'Al', name: 'Aluminium',   color: '#a3a3a3' },
  14: { symbol: 'Si', name: 'Silicon',     color: '#fbbf24' },
  15: { symbol: 'P',  name: 'Phosphorus',  color: '#f97316' },
  16: { symbol: 'S',  name: 'Sulfur',      color: '#facc15' },
  17: { symbol: 'Cl', name: 'Chlorine',    color: '#4ade80' },
  18: { symbol: 'Ar', name: 'Argon',       color: '#818cf8' },
  19: { symbol: 'K',  name: 'Potassium',   color: '#fb7185' },
  20: { symbol: 'Ca', name: 'Calcium',     color: '#67e8f9' },
};

function getElement(z: number) {
  return ELEMENTS[z] ?? { symbol: '?', name: 'Unknown element', color: '#64748b' };
}

// ── Derived charge string ──────────────────────────────────────────────────
function chargeStr(protons: number, electrons: number): string {
  const d = protons - electrons;
  if (d === 0) return 'neutral';
  if (d === 1) return '1+';
  if (d === -1) return '1−';
  if (d > 0) return `${d}+`;
  return `${Math.abs(d)}−`;
}

function chargeSuperscript(protons: number, electrons: number): string {
  const d = protons - electrons;
  if (d === 0) return '';
  if (d === 1) return '+';
  if (d === -1) return '−';
  if (d > 0) return `${d}+`;
  return `${Math.abs(d)}−`;
}

// ── Nuclear relationship ───────────────────────────────────────────────────
interface Relation {
  label: string;
  description: string;
  color: string;
  bg: string;
}

function getRelation(
  Za: number, Aa: number, ea: number,
  Zb: number, Ab: number, eb: number,
): Relation {
  const Na = Aa - Za, Nb = Ab - Zb;

  if (Za === Zb && Aa === Ab && ea === eb)
    return { label: 'Identical', description: 'Same Z, same A, same electrons — they are the same species.', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' };

  if (Za === Zb && Aa === Ab)
    return { label: 'Same element, different ion', description: `Same Z = ${Za} and A = ${Aa}, but different electron counts → same nucleus, different charge.`, color: '#818cf8', bg: 'rgba(129,140,248,0.08)' };

  if (Za === Zb && Aa !== Ab)
    return {
      label: 'Isotopes',
      description: `Same atomic number Z = ${Za} (${getElement(Za).name}) but different mass numbers (A = ${Aa} vs ${Ab}). They have the same chemical properties but different nuclear masses — the difference is ${Math.abs(Aa - Ab)} neutron${Math.abs(Aa - Ab) > 1 ? 's' : ''}.`,
      color: '#34d399', bg: 'rgba(52,211,153,0.08)',
    };

  if (Za !== Zb && Aa === Ab)
    return {
      label: 'Isobars',
      description: `Same mass number A = ${Aa} but different atomic numbers (Z = ${Za} vs ${Zb}). These are different elements (${getElement(Za).name} and ${getElement(Zb).name}) with the same total nucleon count.`,
      color: '#f97316', bg: 'rgba(249,115,22,0.08)',
    };

  if (Za !== Zb && Aa !== Ab && Na === Nb)
    return {
      label: 'Isotones',
      description: `Different Z and A, but the same neutron count (N = ${Na}). ${getElement(Za).name} and ${getElement(Zb).name} each have ${Na} neutron${Na !== 1 ? 's' : ''} in their nucleus.`,
      color: '#38bdf8', bg: 'rgba(56,189,248,0.08)',
    };

  if (ea === eb && (Za !== Zb || Aa !== Ab))
    return {
      label: 'Isoelectronic',
      description: `Different nuclei, but both have ${ea} electrons → same electron configuration and similar chemical behaviour.`,
      color: '#e879f9', bg: 'rgba(232,121,249,0.08)',
    };

  return { label: 'No special relationship', description: 'These two atoms share no common Z, A, N, or electron count.', color: '#64748b', bg: 'rgba(100,116,139,0.06)' };
}

// ── Presets ────────────────────────────────────────────────────────────────
interface Preset { label: string; a: AtomState; b: AtomState }
type AtomState = { p: number; n: number; e: number };

const PRESETS: Preset[] = [
  { label: 'Protium / Deuterium',   a: { p:1, n:0, e:1 }, b: { p:1, n:1, e:1 } },
  { label: 'Deuterium / Tritium',   a: { p:1, n:1, e:1 }, b: { p:1, n:2, e:1 } },
  { label: '¹²C / ¹³C',            a: { p:6, n:6, e:6 }, b: { p:6, n:7, e:6 } },
  { label: '¹²C / ¹⁴N (Isobars)',   a: { p:6, n:6, e:6 }, b: { p:7, n:7, e:7 } },
  { label: '³⁵Cl / ³⁷Cl',          a: { p:17, n:18, e:17 }, b: { p:17, n:20, e:17 } },
  { label: 'Na⁺ / Ne (Isoelectronic)', a: { p:11, n:12, e:10 }, b: { p:10, n:10, e:10 } },
];

// ── Nucleus dot display ────────────────────────────────────────────────────
function NucleusDots({ protons, neutrons }: { protons: number; neutrons: number }) {
  const total = protons + neutrons;
  if (total === 0) {
    return (
      <div className="w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center"
        style={{ borderColor: 'rgba(255,255,255,0.12)' }}>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>empty</span>
      </div>
    );
  }

  // Build alternating p/n array
  const dots: ('p' | 'n')[] = [];
  let p = protons, n = neutrons;
  while (p > 0 || n > 0) {
    if (p > 0) { dots.push('p'); p--; }
    if (n > 0) { dots.push('n'); n--; }
  }

  const SHOW_MAX = 24; // cap for individual dots; beyond this, show compact summary
  if (total > SHOW_MAX) {
    return (
      <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center gap-0.5"
        style={{ background: 'radial-gradient(circle at 40% 40%, rgba(251,146,60,0.25), rgba(148,163,184,0.15))', border: '2px solid rgba(251,146,60,0.30)' }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#fb923c' }}>{protons}p</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{neutrons}n</span>
      </div>
    );
  }

  const cols = total <= 4 ? total : total <= 9 ? 3 : total <= 16 ? 4 : 5;
  const dotSize = total <= 9 ? 13 : total <= 16 ? 11 : 9;
  const gap = 2;

  return (
    <div className="flex flex-wrap gap-[2px] justify-center items-center rounded-full overflow-hidden"
      style={{ width: 80, height: 80, padding: 8, background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,255,255,0.08)' }}>
      {dots.map((type, i) => (
        <div
          key={i}
          style={{
            width: dotSize, height: dotSize,
            borderRadius: '50%',
            background: type === 'p' ? '#f97316' : '#64748b',
            boxShadow: type === 'p' ? '0 0 4px rgba(249,115,22,0.6)' : 'none',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Single atom panel ──────────────────────────────────────────────────────
interface AtomPanelProps {
  label: string;
  atom: AtomState;
  onChange: (next: AtomState) => void;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function AtomPanel({ label, atom, onChange }: AtomPanelProps) {
  const { p, n, e } = atom;
  const Z = p;
  const A = p + n;
  const el = getElement(Z);
  const sup = chargeSuperscript(p, e);
  const chargeLabel = chargeStr(p, e);

  const adjust = useCallback((field: keyof AtomState, delta: number) => {
    const limits: Record<keyof AtomState, [number, number]> = { p: [1, 20], n: [0, 25], e: [0, 22] };
    onChange({ ...atom, [field]: clamp(atom[field] + delta, limits[field][0], limits[field][1]) });
  }, [atom, onChange]);

  const CounterRow = ({
    field, color, icon, name,
  }: { field: keyof AtomState; color: string; icon: string; name: string }) => (
    <div className="flex items-center gap-2">
      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', width: 70 }}>{name}</span>
      <div className="flex items-center gap-1.5 ml-auto">
        <button
          onClick={() => adjust(field, -1)}
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-base transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
        >−</button>
        <span style={{ width: 28, textAlign: 'center', fontSize: 15, fontWeight: 700, fontFamily: 'monospace', color }}>{atom[field]}</span>
        <button
          onClick={() => adjust(field, +1)}
          className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-base transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.55)', cursor: 'pointer' }}
        >+</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl" style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Atom label */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>{label}</div>

      {/* Nucleus + symbol display */}
      <div className="flex flex-col items-center gap-3">
        <NucleusDots protons={p} neutrons={n} />

        {/* AZX notation */}
        <div className="flex items-start gap-1">
          {/* Mass number top, atomic number bottom */}
          <div className="flex flex-col items-end" style={{ lineHeight: 1 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>{A}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{Z}</span>
          </div>
          {/* Symbol */}
          <span style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, color: el.color, fontFamily: 'system-ui, sans-serif' }}>{el.symbol}</span>
          {/* Charge superscript */}
          {sup && (
            <span style={{ fontSize: 16, fontWeight: 700, color: sup.includes('−') ? '#f87171' : '#4ade80', lineHeight: 1, marginTop: 2 }}>{sup}</span>
          )}
        </div>

        {/* Element name */}
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.50)', fontWeight: 500 }}>{el.name}</div>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Z', val: Z,    sub: 'Atomic №', color: '#f97316' },
          { label: 'A', val: A,    sub: 'Mass №',   color: '#fbbf24' },
          { label: 'N', val: n,    sub: 'Neutrons',  color: '#94a3b8' },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-2 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace', color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charge indicator */}
      <div className="rounded-lg px-3 py-1.5 text-center text-xs font-semibold"
        style={{
          background: p === e ? 'rgba(74,222,128,0.07)' : p > e ? 'rgba(248,113,113,0.07)' : 'rgba(96,165,250,0.07)',
          border: `1px solid ${p === e ? 'rgba(74,222,128,0.20)' : p > e ? 'rgba(248,113,113,0.20)' : 'rgba(96,165,250,0.20)'}`,
          color: p === e ? '#4ade80' : p > e ? '#f87171' : '#60a5fa',
        }}>
        {p === e ? 'Neutral atom' : `Ion: ${chargeLabel}`}
      </div>

      {/* Counters */}
      <div className="flex flex-col gap-2.5 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <CounterRow field="p" color="#f97316" icon="●" name="Protons" />
        <CounterRow field="n" color="#94a3b8" icon="●" name="Neutrons" />
        <CounterRow field="e" color="#60a5fa" icon="●" name="Electrons" />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function AtomBuilderSim() {
  const [atomA, setAtomA] = useState<AtomState>({ p: 1, n: 0, e: 1 });
  const [atomB, setAtomB] = useState<AtomState>({ p: 1, n: 1, e: 1 });
  const [activePreset, setActivePreset] = useState(0);

  const Za = atomA.p, Aa = atomA.p + atomA.n;
  const Zb = atomB.p, Ab = atomB.p + atomB.n;
  const relation = getRelation(Za, Aa, atomA.e, Zb, Ab, atomB.e);

  function applyPreset(idx: number) {
    setActivePreset(idx);
    setAtomA({ ...PRESETS[idx].a });
    setAtomB({ ...PRESETS[idx].b });
  }

  return (
    <div style={{ background: '#050a14', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 4 }}>
            Interactive Simulator
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>Atom Builder &amp; Comparator</div>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>Proton</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#64748b' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>Neutron</span>
          </div>
        </div>
      </div>

      {/* Atom panels */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-3">
        <AtomPanel label="Atom A" atom={atomA} onChange={setAtomA} />
        <AtomPanel label="Atom B" atom={atomB} onChange={setAtomB} />
      </div>

      {/* Relationship banner */}
      <div className="mx-5 mb-4 rounded-xl p-4"
        style={{ background: relation.bg, border: `1px solid ${relation.color}30` }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: relation.color }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: relation.color }}>{relation.label}</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(226,232,240,0.70)', lineHeight: 1.55, margin: 0 }}>
          {relation.description}
        </p>
      </div>

      {/* Presets */}
      <div className="px-5 pb-5">
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>
          Quick Examples
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((pr, i) => (
            <button
              key={i}
              onClick={() => applyPreset(i)}
              style={{
                padding: '5px 12px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: activePreset === i ? 'rgba(251,191,36,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activePreset === i ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.09)'}`,
                color: activePreset === i ? '#fbbf24' : 'rgba(255,255,255,0.50)',
              }}
            >
              {pr.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
