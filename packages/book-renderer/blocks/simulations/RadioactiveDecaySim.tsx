'use client';

// Radioactive Decay Chain Builder
//
// The student starts from a parent nuclide and APPLIES decays one at a time.
// Every daughter is COMPUTED from the decay rules (not read from a lookup of
// pre-written equations), so the tool holds real evolving state: apply α, then
// β⁻, then β⁻, and you land back on the same element four mass units lighter —
// the U-238 → Th-234 → Pa-234 → U-234 opening of the real uranium series,
// discovered by the student rather than shown to them.
//
// Rewritten 2026-07-26 after founder feedback that the first version (four
// tabs, four hardcoded equations) "isn't a simulation — how is it better than
// four static images?" It wasn't. Nothing was computed and no state evolved.
// This version: computed transitions, an accumulating chain, undo/reset, and
// a decays-applied counter.
//
// ACADEMIC NOTE: this models the CONSERVATION BOOKKEEPING (how Z and A shift
// per decay mode), which is exactly what NCERT Class 11 Ch.2 asks for. It does
// not claim every nuclide the student can reach actually decays by the mode
// they picked — real nuclides have preferred modes. The footnote in the UI
// says so rather than letting the tool imply otherwise.

import { useState } from 'react';
import { SimShell, SimHeader, SectionLabel, ACCENT, ACCENT_2, ACCENTS, TEXT, BORDER, accentTint } from './_shared';

// Z → symbol, 1–103. Beta-minus raises Z, so the range must extend above the
// heavy-element starting points, not just below them.
const SYMBOLS = [
  '', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
  'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
  'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
  'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
  'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
  'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
  'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
  'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm', 'Md', 'No', 'Lr',
];
const MAX_Z = SYMBOLS.length - 1;
const symbolFor = (z: number) => SYMBOLS[z] ?? '?';

interface Nuc { Z: number; A: number }

interface Mode {
  key: string; label: string; symbol: string; delta: string;
  dZ: number; dA: number;
  // The particle written on the product side ('right') or added to the
  // reactant side ('left' — electron capture absorbs an electron).
  particle: { symbol: string; Z: number; A: number };
  side: 'left' | 'right';
  mechanism: string;
}

const MODES: Mode[] = [
  {
    key: 'alpha', label: 'Alpha (α)', symbol: 'α', delta: 'Z −2, A −4', dZ: -2, dA: -4,
    particle: { symbol: 'He', Z: 2, A: 4 }, side: 'right',
    mechanism: 'A helium nucleus — 2 protons and 2 neutrons — is ejected, so the atom loses 2 from Z and 4 from A.',
  },
  {
    key: 'beta-minus', label: 'Beta⁻ (β⁻)', symbol: 'β⁻', delta: 'Z +1, A same', dZ: 1, dA: 0,
    particle: { symbol: 'e', Z: -1, A: 0 }, side: 'right',
    mechanism: 'A neutron turns into a proton and emits an electron. The nucleon count is unchanged, so A stays put while Z climbs by one.',
  },
  {
    key: 'positron', label: 'Positron (β⁺)', symbol: 'β⁺', delta: 'Z −1, A same', dZ: -1, dA: 0,
    particle: { symbol: 'e', Z: 1, A: 0 }, side: 'right',
    mechanism: 'A proton turns into a neutron and emits a positron. Again a nucleon is swapped, not lost, so only Z moves — down by one.',
  },
  {
    key: 'ec', label: 'Electron capture', symbol: 'EC', delta: 'Z −1, A same', dZ: -1, dA: 0,
    particle: { symbol: 'e', Z: -1, A: 0 }, side: 'left',
    mechanism: 'The nucleus swallows one of its own orbital electrons, turning a proton into a neutron — same net result as positron emission, reached from the opposite direction.',
  },
];

const STARTERS: { label: string; nuc: Nuc }[] = [
  { label: 'Uranium-238', nuc: { Z: 92, A: 238 } },
  { label: 'Iodine-131', nuc: { Z: 53, A: 131 } },
  { label: 'Potassium-40', nuc: { Z: 19, A: 40 } },
  { label: 'Radium-226', nuc: { Z: 88, A: 226 } },
];

interface Step { nuc: Nuc; via: Mode | null }

function NuclideGlyph({ n, color, size = 'text-6xl', subSize = 'text-base' }:
  { n: { Z: number; A: number; symbol: string }; color: string; size?: string; subSize?: string }) {
  return (
    <span className="inline-flex items-stretch gap-1.5" style={{ verticalAlign: 'middle' }}>
      <span className="flex flex-col justify-between items-end" style={{ paddingTop: 5, paddingBottom: 9 }}>
        <span className={`${subSize} font-bold tabular-nums`} style={{ color: TEXT.secondary, lineHeight: 1 }}>{n.A}</span>
        <span className={`${subSize} font-bold tabular-nums`} style={{ color: TEXT.secondary, lineHeight: 1 }}>{n.Z}</span>
      </span>
      <span className={`${size} font-black`} style={{ lineHeight: 1, color }}>{n.symbol}</span>
    </span>
  );
}

export default function RadioactiveDecaySim() {
  const [starterIdx, setStarterIdx] = useState(0);
  const [chain, setChain] = useState<Step[]>([{ nuc: STARTERS[0].nuc, via: null }]);

  const current = chain[chain.length - 1];
  const previous = chain.length > 1 ? chain[chain.length - 2] : null;

  const apply = (mode: Mode) => {
    const next: Nuc = { Z: current.nuc.Z + mode.dZ, A: current.nuc.A + mode.dA };
    if (next.Z < 1 || next.Z > MAX_Z || next.A < 1) return;   // off the table — button is disabled anyway
    setChain((c) => [...c, { nuc: next, via: mode }]);
  };
  const undo = () => setChain((c) => (c.length > 1 ? c.slice(0, -1) : c));
  const reset = (idx = starterIdx) => { setStarterIdx(idx); setChain([{ nuc: STARTERS[idx].nuc, via: null }]); };

  const canApply = (m: Mode) => {
    const z = current.nuc.Z + m.dZ, a = current.nuc.A + m.dA;
    return z >= 1 && z <= MAX_Z && a >= 1;
  };

  const decaysApplied = chain.length - 1;
  const start = chain[0].nuc;
  const netZ = current.nuc.Z - start.Z;
  const netA = current.nuc.A - start.A;
  const fmt = (d: number) => (d === 0 ? '0' : d > 0 ? `+${d}` : `${d}`);

  return (
    <SimShell style={{ minHeight: 'auto' }}>
      <SimHeader
        title="Decay Chain"
        accentWord="Builder"
        subtitle="Apply a decay to the nucleus — then apply another, and another"
        badge={`${decaysApplied} decay${decaysApplied === 1 ? '' : 's'} applied`}
      />

      {/* Decay action buttons */}
      <div className="flex flex-wrap gap-2 mb-1">
        {MODES.map((m) => {
          const enabled = canApply(m);
          return (
            <button key={m.key} onClick={() => apply(m)} disabled={!enabled}
              className="px-4 py-2 rounded-xl text-left transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${BORDER.card}`,
                cursor: enabled ? 'pointer' : 'not-allowed',
                opacity: enabled ? 1 : 0.3,
              }}>
              <div className="text-sm font-bold" style={{ color: ACCENT }}>{m.label}</div>
              <div className="text-xs tabular-nums" style={{ color: TEXT.secondary }}>{m.delta}</div>
            </button>
          );
        })}
      </div>
      <p className="text-xs mb-6" style={{ color: TEXT.ghost }}>
        Each click transforms the current nucleus and adds a step to the chain.
      </p>

      {/* The live equation for the most recent step */}
      <div className="flex flex-col items-center gap-5 py-6">
        {previous && current.via ? (
          <div key={chain.length} className="flex items-center gap-4 flex-wrap justify-center"
            style={{ animation: 'decay-step-in 0.35s ease' }}>
            <NuclideGlyph n={{ ...previous.nuc, symbol: symbolFor(previous.nuc.Z) }} color={ACCENT} />
            {current.via.side === 'left' && (
              <>
                <span className="text-4xl font-light" style={{ color: TEXT.secondary }}>+</span>
                <NuclideGlyph n={{ ...current.via.particle }} color={ACCENTS.amber} size="text-3xl" subSize="text-sm" />
              </>
            )}
            <span className="text-4xl font-light" style={{ color: TEXT.secondary }}>→</span>
            <NuclideGlyph n={{ ...current.nuc, symbol: symbolFor(current.nuc.Z) }} color={ACCENT_2} />
            {current.via.side === 'right' && (
              <>
                <span className="text-4xl font-light" style={{ color: TEXT.secondary }}>+</span>
                <NuclideGlyph n={{ ...current.via.particle }} color={ACCENTS.amber} size="text-3xl" subSize="text-sm" />
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <NuclideGlyph n={{ ...current.nuc, symbol: symbolFor(current.nuc.Z) }} color={ACCENT} />
            <p className="text-sm" style={{ color: TEXT.secondary }}>Pick a decay above to transform this nucleus.</p>
          </div>
        )}

        {current.via && (
          <p className="text-sm text-center max-w-lg" style={{ color: TEXT.secondary }}>{current.via.mechanism}</p>
        )}
      </div>

      {/* The accumulating chain — horizontal, wrapping. Each transition is an
          arrow with its decay SYMBOL (α, β⁻, β⁺, EC) sitting right on top of
          it — not a bare word floating in low-contrast gray — so the mode is
          legible at a glance instead of read as text. One accent colour
          (violet, current nuclide only) plus a properly readable secondary
          gray for everything else — no more near-invisible ghost tier. */}
      {decaysApplied > 0 && (
        <div className="mb-6">
          <SectionLabel accent={ACCENT} className="mb-3">The chain so far</SectionLabel>
          <div className="flex items-center flex-wrap gap-x-1 gap-y-3">
            {chain.map((s, i) => {
              const isLast = i === chain.length - 1;
              return (
                <span key={i} className="flex items-center">
                  {i > 0 && (
                    <span className="flex flex-col items-center" style={{ margin: '0 10px' }}>
                      <span className="text-sm font-bold" style={{ color: ACCENT_2, lineHeight: 1.4 }}>
                        {s.via!.symbol}
                      </span>
                      <span style={{ fontSize: 20, lineHeight: 1, color: TEXT.secondary }}>→</span>
                    </span>
                  )}
                  <span className="text-xl font-black tabular-nums"
                    style={{ color: isLast ? ACCENT : TEXT.primary }}>
                    {symbolFor(s.nuc.Z)}-{s.nuc.A}
                  </span>
                </span>
              );
            })}
          </div>
          <div className="flex items-center gap-8 text-base tabular-nums mt-5 pt-4" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <span>
              <span style={{ color: TEXT.secondary }}>Net Z: </span>
              <span style={{ color: TEXT.primary, fontWeight: 700 }}>{start.Z} → {current.nuc.Z}</span>
              <span style={{ color: TEXT.secondary }}> ({fmt(netZ)})</span>
            </span>
            <span>
              <span style={{ color: TEXT.secondary }}>Net A: </span>
              <span style={{ color: TEXT.primary, fontWeight: 700 }}>{start.A} → {current.nuc.A}</span>
              <span style={{ color: TEXT.secondary }}> ({fmt(netA)})</span>
            </span>
          </div>
        </div>
      )}

      {/* Starting nuclide + undo/reset */}
      <div className="flex flex-wrap items-center gap-2 pt-4" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
        <span className="text-xs mr-1" style={{ color: TEXT.secondary }}>Start from</span>
        {STARTERS.map((s, i) => {
          const active = i === starterIdx;
          return (
            <button key={s.label} onClick={() => reset(i)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: active ? accentTint(ACCENT, 0.15) : 'rgba(255,255,255,0.04)',
                border: `1px solid ${active ? accentTint(ACCENT, 0.4) : BORDER.card}`,
                color: active ? ACCENT : TEXT.secondary,
                cursor: 'pointer',
              }}>
              {s.label}
            </button>
          );
        })}
        <span className="flex-1" />
        <button onClick={undo} disabled={decaysApplied === 0}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`,
            color: TEXT.secondary, cursor: decaysApplied ? 'pointer' : 'not-allowed',
            opacity: decaysApplied ? 1 : 0.35,
          }}>
          ↩ Undo
        </button>
        <button onClick={() => reset()}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER.card}`, color: TEXT.secondary, cursor: 'pointer' }}>
          ↺ Reset
        </button>
      </div>

      <p className="text-xs mt-4" style={{ color: TEXT.ghost }}>
        This tool follows the conservation bookkeeping — how Z and A shift for each decay mode. A real nuclide has its own
        preferred decay mode, so not every path you can build here is one nature actually takes.
      </p>

      <style>{`@keyframes decay-step-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </SimShell>
  );
}
