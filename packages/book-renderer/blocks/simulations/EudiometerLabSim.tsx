'use client';

/**
 * Eudiometer Virtual Lab — v3 (minimalist redesign, 2026-07-21)
 *
 * Academic source: NCERT Class 11, Chapter 1 — Some Basic Concepts of Chemistry
 * (Stoichiometry / Volume–Volume Analysis / Eudiometry).
 *
 * Pedagogical goal: reproduce the classical procedure that deduces an unknown
 * hydrocarbon's molecular formula from gas-volume measurements alone. The
 * student charges the tube, sparks it, passes KOH to absorb CO₂, then reads
 * the two contractions:
 *
 *   CxHy + (x + y/4) O₂ → x CO₂ + (y/2) H₂O(l)
 *   x = (V₁ − V₂) / V_gas          [V₁ − V₂ is the CO₂ absorbed by KOH]
 *   y = 4·((V₀ − V₁) / V_gas − 1)  [V₀ − V₁ is the gas burnt + water condensed]
 *
 * APPARATUS ACCURACY (fixed in v3 — the v2 drawing was wrong):
 *  • A eudiometer is a graduated tube CLOSED AT THE TOP, standing inverted in a
 *    trough of mercury. The gas therefore collects at the CLOSED TOP END and the
 *    mercury rises from below as the gas contracts. v2 drew the gas stacked up
 *    from the bottom with water sitting on top of it, which is upside-down.
 *  • Graduations run 0 at the closed end downward, so the mercury meniscus reads
 *    the gas volume directly — that is how the instrument is actually read.
 *  • Two platinum electrodes are sealed through the glass near the closed end;
 *    the spark jumps the gap between them. They were missing in v2, and they are
 *    the feature that makes the tube a eudiometer rather than a measuring
 *    cylinder.
 *  • KOH is a LIQUID introduced into the tube. v2 showed only rising bubbles, so
 *    nothing indicated that a reagent had entered. v3 draws the KOH column
 *    rising with its own meniscus and a label naming the confining liquid.
 *  • Meniscus curvature is drawn honestly: mercury bulges UP (convex — it does
 *    not wet glass), aqueous KOH dips DOWN (concave).
 *
 * COLOUR: both liquids render neutral slate, because mercury really is silvery
 * and KOH solution really is colourless — tinting them would be decoration, not
 * information. The three gases carry the only hues, at the PALE end of the §3
 * palette and low opacity, so a full-height tube never becomes a wall of
 * saturated colour.
 *
 * DESIGN: follows SIMULATION_DESIGN_WORKFLOW.md — root #0d1117, palette §3 only,
 * no monospace anywhere (§2: numbers use tabular-nums on the inherited sans),
 * and structure carried by hairline dividers rather than nested cards (§8).
 * Layout is two columns (controls | tube) with the lab notebook full-width
 * underneath — v2's third column overflowed its container.
 *
 * NEEDS_REVIEW: none — combustion stoichiometry is the standard general equation
 * above; all six gases are common NCERT/JEE examples.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

// ── Palette (workflow §3 only) ──────────────────────────────────────────────
const C_TEXT = '#e2e8f0';
const C_DIM = '#94a3b8';
const C_MUTED = '#475569';
const C_GHOST = '#64748b';
const C_ACCENT = '#818cf8';   // indigo — interactive chrome
const C_ACCENT_HI = '#c4b5fd';
const C_WARN = '#f87171';
const HAIR = '1px solid rgba(255,255,255,0.05)';

// Substance tints — deliberately the PALE end of the workflow §3 palette. Solid
// mid-tones (bright amber / violet) were fatiguing over a full-height tube, so
// every fill here is a light shade used at low opacity, with the saturated value
// reserved for thin lines and short labels.
const C_GAS = '#6ee7b7';      // pale emerald — the hydrocarbon
const C_O2 = '#c4b5fd';       // light indigo — oxygen
const C_CO2 = '#fcd34d';      // palest amber — CO₂
// Both liquids render neutral slate: mercury IS silvery and KOH solution IS
// colourless, so tinting them would be less accurate, not more. They are told
// apart by the label under the trough, not by hue.
const C_LIQ = '#94a3b8';

// ── Gas catalogue ───────────────────────────────────────────────────────────
// x = carbons, y = hydrogens. CxHy + (x + y/4) O₂ → x CO₂ + (y/2) H₂O
const GASES = {
  methane:  { id: 'methane',  name: 'Methane',   formula: 'CH₄',  x: 1, y: 4,  desc: 'Natural gas — the simplest alkane.' },
  ethylene: { id: 'ethylene', name: 'Ethylene',  formula: 'C₂H₄', x: 2, y: 4,  desc: 'An alkene that ripens fruit.' },
  ethane:   { id: 'ethane',   name: 'Ethane',    formula: 'C₂H₆', x: 2, y: 6,  desc: 'Saturated two-carbon alkane.' },
  propane:  { id: 'propane',  name: 'Propane',   formula: 'C₃H₈', x: 3, y: 8,  desc: 'LPG — common cooking fuel.' },
  mystA:    { id: 'mystA',    name: 'Mystery A', formula: 'CₓHᵧ', x: 2, y: 2,  desc: 'Hidden until you deduce it.', mystery: 'C₂H₂ (acetylene)' },
  mystB:    { id: 'mystB',    name: 'Mystery B', formula: 'CₓHᵧ', x: 4, y: 10, desc: 'Hidden until you deduce it.', mystery: 'C₄H₁₀ (butane)' },
} as const;
type GasKey = keyof typeof GASES;
type Gas = typeof GASES[GasKey] & { mystery?: string };

const STEPS = ['Setup', 'Ignite', 'Absorb', 'Deduce'] as const;

// Animations only — everything else is inline style (workflow §6: CSS only).
// The ignition glow is drawn INSIDE the Eudiometer SVG at the electrode gap
// (see eud-spark-glow below) rather than as a page-level overlay — a
// fixed-percentage overlay on the outer div drifted away from the electrodes
// whenever the surrounding layout changed, since it had no idea where the tube
// actually sat.
const STYLES = `
.eud-root { position: relative; }
.eud-spark-glow { opacity: 0; }
.eud-spark-glow.on { animation: eudFlash 900ms ease-out; }
@keyframes eudFlash { 0%{opacity:0;} 12%{opacity:1;} 100%{opacity:0;} }
.eud-bub { animation: eudBub 2.2s ease-in infinite; }
@keyframes eudBub { 0%{ transform:translateY(0); opacity:0; } 15%{opacity:.75;} 100%{ transform:translateY(-58px); opacity:0; } }
.eud-rise { animation: eudRise 700ms ease-out; }
@keyframes eudRise { from { transform: translateY(26px); opacity: 0.2; } to { transform: translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .eud-spark-glow.on, .eud-bub, .eud-rise { animation: none; }
}
`;

const fmt1 = (v: number) => v.toFixed(1);

// Subscript-aware formula pieces
function Sub({ n }: { n: number }) { return n === 1 ? null : <sub>{n}</sub>; }

export default function EudiometerLabSim() {
  const [step, setStep] = useState(0);
  const [gasKey, setGasKey] = useState<GasKey>('methane');
  const [vGas, setVGas] = useState(10);
  const [vO2, setVO2] = useState(50);
  const [firing, setFiring] = useState(false);

  const gas = GASES[gasKey] as Gas;
  const { x, y } = gas;

  const o2Needed = vGas * (x + y / 4);
  const enoughO2 = vO2 >= o2Needed;
  const excessO2 = Math.max(0, vO2 - o2Needed);

  const vInitial = vGas + vO2;
  const vAfterIgnition = enoughO2 ? vO2 - vGas * (y / 4) : null;   // CO₂ + leftover O₂
  const vAfterKOH = enoughO2 ? vO2 - vGas * (x + y / 4) : null;    // leftover O₂ only

  // Changing the charge invalidates the run
  useEffect(() => { if (step > 0) setStep(0); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [gasKey, vGas, vO2]);

  // Gas column contents at each step (top-of-tube downward)
  type Layer = { id: string; label: React.ReactNode; volume: number; color: string };
  const layers: Layer[] = useMemo(() => {
    if (step === 0) return [
      { id: 'gas', label: <>{gas.formula}</>, volume: vGas, color: C_GAS },
      { id: 'o2', label: <>O<sub>2</sub></>, volume: vO2, color: C_O2 },
    ];
    if (step === 1) return [
      { id: 'co2', label: <>CO<sub>2</sub></>, volume: vGas * x, color: C_CO2 },
      { id: 'o2', label: <>O<sub>2</sub></>, volume: vO2 - vGas * (x + y / 4), color: C_O2 },
    ].filter(l => l.volume > 0.05);
    return [
      { id: 'o2', label: <>O<sub>2</sub></>, volume: vO2 - vGas * (x + y / 4), color: C_O2 },
    ].filter(l => l.volume > 0.05);
  }, [step, gas, vGas, vO2, x, y]);

  const totalGas = layers.reduce((s, l) => s + l.volume, 0);

  const goNext = useCallback(() => {
    if (step === 0) {
      if (!enoughO2) return;
      setFiring(true);
      setTimeout(() => setStep(1), 320);
      setTimeout(() => setFiring(false), 1000);
    } else if (step < 3) setStep(step + 1);
  }, [step, enoughO2]);
  const goBack = useCallback(() => { if (step > 0) setStep(step - 1); }, [step]);
  const reset = useCallback(() => setStep(0), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); goNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goBack(); }
      if (e.key === 'r' || e.key === 'R') reset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goBack, reset]);

  return (
    <div className="eud-root not-prose p-4 md:p-6" style={{ background: '#0d1117', color: C_TEXT, borderRadius: 16 }}>
      <style>{STYLES}</style>

      {/* Header — plain text, no badges, no card */}
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-tight text-white">Eudiometer Lab</h2>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: C_MUTED }}>
          Deduce a hydrocarbon from gas volumes alone
        </p>
      </div>

      {/* Stepper — underline tabs (workflow §4g), not boxed pills */}
      <div className="flex gap-5 flex-wrap mb-6 pb-1">
        {STEPS.map((name, i) => {
          const cur = step === i, done = step > i;
          return (
            <button key={name} type="button" onClick={() => { if (i <= step) setStep(i); }}
              className="text-xs font-semibold uppercase tracking-widest transition-colors pb-1"
              style={{
                color: cur ? C_ACCENT : done ? C_GAS : C_MUTED,
                borderBottom: `2px solid ${cur ? C_ACCENT : 'transparent'}`,
                background: 'none', outline: 'none',
                cursor: i <= step ? 'pointer' : 'default',
              }}>
              {done ? '✓ ' : `${i + 1}. `}{name}
            </button>
          );
        })}
      </div>

      {/* Two columns: controls | tube. Notebook moved below (v2's 3rd column overflowed). */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* ── Controls ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: C_GHOST }}>
            Hydrocarbon
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
            {(Object.keys(GASES) as GasKey[]).map((k) => {
              const g = GASES[k] as Gas;
              const on = k === gasKey;
              return (
                <button key={k} type="button" onClick={() => setGasKey(k)}
                  className="text-sm font-bold transition-colors pb-0.5"
                  style={{
                    color: on ? C_TEXT : C_MUTED,
                    borderBottom: `1px solid ${on ? 'rgba(129,140,248,0.6)' : 'transparent'}`,
                    background: 'none', outline: 'none',
                  }}>
                  {g.name}
                  <span className="ml-1.5 font-semibold" style={{ color: on ? C_GAS : C_MUTED }}>{g.formula}</span>
                </button>
              );
            })}
          </div>
          <p className="text-sm mb-6" style={{ color: C_DIM }}>{gas.desc}</p>

          <div style={{ borderTop: HAIR }} className="pt-5 flex flex-col gap-5">
            <Dial label={<>Volume of {gas.formula}</>} value={vGas} min={5} max={30} step={1}
              color={C_GAS} onChange={setVGas} disabled={step > 0} />
            <Dial label={<>Volume of O<sub>2</sub></>} value={vO2} min={10} max={100} step={1}
              color={C_ACCENT} onChange={setVO2} disabled={step > 0} />
          </div>

          {/* Charge verdict — one line, no box */}
          <p className="text-sm mt-5" style={{ color: enoughO2 ? C_DIM : C_WARN }}>
            {enoughO2 ? (
              <>Needs <b className="text-white tabular-nums">{fmt1(o2Needed)} mL</b> of O<sub>2</sub> to burn fully —
                {' '}<b className="text-white tabular-nums">{fmt1(excessO2)} mL</b> will be left over in excess.</>
            ) : (
              <>Not enough O<sub>2</sub>. This charge needs <b className="tabular-nums">{fmt1(o2Needed)} mL</b> for complete
                combustion — add more before sparking.</>
            )}
          </p>

          {/* Readings — inline, hairline separated */}
          <div className="mt-6 pt-5" style={{ borderTop: HAIR }}>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: C_GHOST }}>Readings</p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <Reading label="Initial" sub="V₀" value={vInitial} active={step === 0} />
              <Reading label="After ignition" sub="V₁" value={step >= 1 ? vAfterIgnition : null} active={step === 1}
                delta={step >= 1 && vAfterIgnition != null ? vAfterIgnition - vInitial : null} />
              <Reading label="After KOH" sub="V₂" value={step >= 2 ? vAfterKOH : null} active={step >= 2}
                delta={step >= 2 && vAfterKOH != null && vAfterIgnition != null ? vAfterKOH - vAfterIgnition : null} />
            </div>
          </div>
        </div>

        {/* ── Tube ── */}
        <div className="flex flex-col items-center">
          <Eudiometer layers={layers} totalGas={totalGas} step={step} firing={firing} />
          <p className="text-[11px] mt-3 text-center" style={{ color: C_GHOST }}>
            {step === 0 && 'Gas collects at the sealed top; mercury seals it from below.'}
            {step === 1 && 'Water condensed to a liquid — its volume vanishes from the reading.'}
            {step === 2 && 'KOH solution has entered the tube and is absorbing the CO₂.'}
            {step === 3 && 'Only unreacted oxygen is left above the liquid.'}
          </p>
        </div>
      </div>

      {/* ── Lab notebook — full width, below (was an overflowing 3rd column) ── */}
      <div className="mt-8 pt-6" style={{ borderTop: HAIR }}>
        <Notebook step={step} gas={gas} x={x} y={y} vGas={vGas}
          vInitial={vInitial} vAfterIgnition={vAfterIgnition} vAfterKOH={vAfterKOH} />
      </div>

      {/* ── Actions ── */}
      <div className="mt-7 pt-5 flex items-center justify-between flex-wrap gap-3" style={{ borderTop: HAIR }}>
        <span className="text-[11px]" style={{ color: C_MUTED }}>← → step · R reset</span>
        <div className="flex items-center gap-5">
          {step > 0 && (
            <button type="button" onClick={goBack} className="text-xs font-bold pb-0.5"
              style={{ color: C_DIM, borderBottom: '1px solid rgba(255,255,255,0.15)', background: 'none' }}>
              ← Back
            </button>
          )}
          {step === 0 && (
            <button type="button" onClick={goNext} disabled={!enoughO2}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                background: enoughO2 ? 'rgba(252,211,77,0.10)' : 'none',
                border: `1px solid ${enoughO2 ? 'rgba(252,211,77,0.38)' : 'rgba(255,255,255,0.08)'}`,
                color: enoughO2 ? C_CO2 : C_MUTED,
                cursor: enoughO2 ? 'pointer' : 'not-allowed',
              }}>
              Spark ignition
            </button>
          )}
          {step === 1 && <PrimaryBtn onClick={goNext}>Introduce KOH solution</PrimaryBtn>}
          {step === 2 && <PrimaryBtn onClick={goNext}>Deduce the formula →</PrimaryBtn>}
          {step === 3 && <PrimaryBtn onClick={reset}>↺ Run another experiment</PrimaryBtn>}
        </div>
      </div>

      {/* Expert Tip (workflow §4j) */}
      <div className="mt-7 pt-4" style={{ borderTop: HAIR }}>
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Expert Tip</div>
        <p className="text-sm font-bold leading-snug italic text-white">
          &ldquo;Water is a <span style={{ color: C_ACCENT_HI }}>liquid</span> at room temperature, so its volume simply disappears
          from the reading — that first contraction is what hands you the hydrogens. The second contraction, the part KOH swallows,
          is pure <span style={{ color: C_CO2 }}>CO₂</span> — and that hands you the carbons.&rdquo;
        </p>
      </div>
    </div>
  );
}

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
      style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(129,140,248,0.4)', color: C_ACCENT_HI }}>
      {children}
    </button>
  );
}

// ── A labelled slider ───────────────────────────────────────────────────────
function Dial({ label, value, min, max, step, color, onChange, disabled }: {
  label: React.ReactNode; value: number; min: number; max: number; step: number;
  color: string; onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <div style={{ opacity: disabled ? 0.45 : 1 }}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: C_DIM }}>{label}</span>
        <span className="text-xl font-bold tabular-nums text-white">
          {value}<span className="text-sm font-semibold ml-1" style={{ color: C_MUTED }}>mL</span>
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full" style={{ accentColor: color }} />
    </div>
  );
}

// ── One volume reading ──────────────────────────────────────────────────────
function Reading({ label, sub, value, active, delta }: {
  label: string; sub: string; value: number | null; active: boolean; delta?: number | null;
}) {
  return (
    <div style={{ opacity: value == null ? 0.4 : 1 }}>
      <div className="text-[10px] font-semibold uppercase tracking-widest mb-0.5" style={{ color: active ? C_ACCENT : C_GHOST }}>
        {sub} · {label}
      </div>
      <div className="text-xl font-bold tabular-nums text-white">
        {value == null ? '—' : <>{fmt1(value)}<span className="text-sm font-semibold ml-1" style={{ color: C_MUTED }}>mL</span></>}
      </div>
      {delta != null && (
        <div className="text-[11px] font-bold tabular-nums mt-0.5" style={{ color: C_CO2 }}>
          {delta > 0 ? '+' : '−'}{fmt1(Math.abs(delta))} mL
        </div>
      )}
    </div>
  );
}

// ── Lab notebook ────────────────────────────────────────────────────────────
function Notebook({ step, gas, x, y, vGas, vInitial, vAfterIgnition, vAfterKOH }: {
  step: number; gas: Gas; x: number; y: number; vGas: number;
  vInitial: number; vAfterIgnition: number | null; vAfterKOH: number | null;
}) {
  const dedX = vAfterIgnition != null && vAfterKOH != null ? (vAfterIgnition - vAfterKOH) / vGas : null;
  const dedY = vAfterIgnition != null ? 4 * ((vInitial - vAfterIgnition) / vGas - 1) : null;
  const o2Coef = x + y / 4;
  const waterCoef = y / 2;
  const coef = (c: number) => (c === 1 ? '' : Number.isInteger(c) ? `${c} ` : `${c.toFixed(1)} `);

  return (
    <div>
      {/* Indigo, not C_GHOST — matches the "Expert Tip" heading below the sim.
          A section title needs to visibly outrank the body copy under it; the
          same muted grey used for both left them indistinguishable. */}
      <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: '#818cf8' }}>Lab notebook</p>

      {/* Balanced equation — inherited sans, NOT monospace. One colour for the
          whole equation (2026-07-21): a colour per substance fought the "+" and
          "→" for attention and made the equation read as scattered fragments
          rather than one reaction. The tube above is where colour-coding by
          substance earns its keep (it's mapped to physical bands you watch
          change); here, in written form, uniform white reads as a single
          statement and the operators stay clearly visible. */}
      <div className="text-xl font-bold mb-2 text-white">
        {gas.formula}
        <span className="mx-2">+</span>
        {coef(o2Coef)}O<sub>2</sub>
        <span className="mx-2">→</span>
        {coef(x)}CO<sub>2</sub>
        <span className="mx-2">+</span>
        {coef(waterCoef)}H<sub>2</sub>O
        <span className="text-sm font-semibold ml-1.5" style={{ color: C_MUTED }}>(liquid)</span>
      </div>
      <p className="text-sm mb-6" style={{ color: C_DIM }}>
        By Avogadro&apos;s law, equal volumes hold equal moles — so these coefficients are volume ratios too.
      </p>

      {/* Bookkeeping — plain rows, hairline separated, no card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
        <Row label={<>V<sub>0</sub> − V<sub>1</sub> &nbsp;gas burnt + water condensed</>}
          value={step >= 1 && vAfterIgnition != null ? `${fmt1(vInitial - vAfterIgnition)} mL` : '—'} on={step >= 1} />
        <Row label={<>V<sub>1</sub> − V<sub>2</sub> &nbsp;CO<sub>2</sub> absorbed by KOH</>}
          value={step >= 2 && vAfterIgnition != null && vAfterKOH != null ? `${fmt1(vAfterIgnition - vAfterKOH)} mL` : '—'} on={step >= 2} />
      </div>

      {step >= 3 && dedX != null && dedY != null && (
        <div className="mt-6 pt-5" style={{ borderTop: HAIR }}>
          <div className="flex flex-wrap gap-x-10 gap-y-4 mb-5">
            <Derived label={<>x = (V<sub>1</sub> − V<sub>2</sub>) / V<sub>gas</sub></>} raw={dedX} />
            <Derived label={<>y = 4 × ((V<sub>0</sub> − V<sub>1</sub>) / V<sub>gas</sub> − 1)</>} raw={dedY} />
          </div>
          <div className="text-2xl font-bold text-white">
            Deduced formula: <span style={{ color: C_GAS }}>C<Sub n={Math.round(dedX)} />H<Sub n={Math.round(dedY)} /></span>
          </div>
          <p className="text-sm mt-1.5" style={{ color: C_DIM }}>
            {gas.mystery ? <>↳ {gas.name} unmasked — it was {gas.mystery}.</> : <>↳ matches {gas.name} ({gas.formula}).</>}
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, on }: { label: React.ReactNode; value: string; on: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5" style={{ borderBottom: HAIR, opacity: on ? 1 : 0.4 }}>
      <span className="text-sm" style={{ color: C_DIM }}>{label}</span>
      <span className="text-sm font-bold tabular-nums shrink-0" style={{ color: on ? C_TEXT : C_MUTED }}>{value}</span>
    </div>
  );
}

function Derived({ label, raw }: { label: React.ReactNode; raw: number }) {
  return (
    <div>
      {/* Was text-[11px]/C_GHOST — the dimmest token in the palette at the
          smallest readable size. This is the formula the student needs to
          actually read to follow the derivation, not a caption to skim past. */}
      <div className="text-sm mb-1" style={{ color: C_DIM }}>{label}</div>
      <div className="text-xl font-bold tabular-nums" style={{ color: C_DIM }}>
        {raw.toFixed(2)} <span style={{ color: '#818cf8' }}>→</span>{' '}
        <span className="text-white">{Math.round(raw)}</span>
      </div>
    </div>
  );
}

// ── The apparatus ───────────────────────────────────────────────────────────
// Inverted graduated tube, sealed at the top, standing in a mercury trough.
// Gas sits against the sealed top; liquid rises from below as gas contracts.
function Eudiometer({ layers, totalGas, step, firing }: {
  layers: { id: string; label: React.ReactNode; volume: number; color: string }[];
  totalGas: number; step: number; firing: boolean;
}) {
  // Canvas is deliberately wide: the meniscus callout sits clear to the RIGHT and
  // the graduations to the LEFT, so neither can run off the edge (v3.0 clipped
  // the reading against x=0) or collide with each other.
  const W = 340, H = 560;
  const tubeW = 78;
  const tubeX = 132;                            // 132 → 210
  const tubeTop = 66, tubeBottom = 452;         // graduated span, 0 mL → 100 mL
  const span = tubeBottom - tubeTop;
  const mlToY = (ml: number) => tubeTop + (ml / 100) * span;   // 0 at the SEALED TOP
  const cx = tubeX + tubeW / 2;

  // Gas layers stack downward from the sealed top.
  let cur = 0;
  const bands = layers.map((l) => {
    const yTop = mlToY(cur), yBot = mlToY(cur + l.volume);
    cur += l.volume;
    return { ...l, yTop, yBot, mid: (yTop + yBot) / 2, h: yBot - yTop };
  });

  const liquidTop = mlToY(totalGas);            // meniscus = the reading
  const koh = step >= 2;                         // KOH has been introduced
  const troughTop = 462, troughBot = 522;
  const troughLiquidY = troughTop + 14;
  // Mercury is silvery and KOH solution is colourless — both render as neutral
  // slate. Mercury's meniscus bulges UP (convex, it does not wet glass); an
  // aqueous KOH meniscus dips DOWN (concave). That curve is the honest tell.
  const meniscusBulge = koh ? 5 : -5;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 330 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="eud-spark-grad">
          <stop offset="0%" stopColor={C_CO2} stopOpacity="0.9" />
          <stop offset="100%" stopColor={C_CO2} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Trough ── */}
      <path d={`M 40 ${troughTop} L 40 ${troughBot - 14} Q 40 ${troughBot} 54 ${troughBot}
                L ${W - 54} ${troughBot} Q ${W - 40} ${troughBot} ${W - 40} ${troughBot - 14}
                L ${W - 40} ${troughTop}`}
        fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.75" strokeLinejoin="round" />
      <path d={`M 42 ${troughLiquidY} L 42 ${troughBot - 14} Q 42 ${troughBot - 2} 54 ${troughBot - 2}
                L ${W - 54} ${troughBot - 2} Q ${W - 42} ${troughBot - 2} ${W - 42} ${troughBot - 14}
                L ${W - 42} ${troughLiquidY} Z`}
        fill={C_LIQ} opacity="0.16" />
      <line x1="42" y1={troughLiquidY} x2={W - 42} y2={troughLiquidY} stroke={C_LIQ} strokeWidth="1.5" opacity="0.55" />

      {/* ── Liquid inside the tube (rises as the gas contracts) ── */}
      <g className={koh ? 'eud-rise' : undefined}>
        <rect x={tubeX + 2} y={liquidTop} width={tubeW - 4}
          height={Math.max(0, troughLiquidY - liquidTop)} fill={C_LIQ} opacity="0.16" />
        <path d={`M ${tubeX + 2} ${liquidTop} Q ${cx} ${liquidTop - meniscusBulge} ${tubeX + tubeW - 2} ${liquidTop}`}
          fill="none" stroke={C_LIQ} strokeWidth="2" opacity="0.85" />
      </g>

      {/* Bubbles rising while KOH absorbs the CO₂ */}
      {step === 2 && [0, 1, 2, 3].map((i) => (
        <circle key={i} className="eud-bub" cx={tubeX + 18 + i * 15} cy={liquidTop + 46}
          r={3 + (i % 2)} fill={C_LIQ} opacity="0.5" style={{ animationDelay: `${i * 0.5}s` }} />
      ))}

      {/* ── Gas bands, stacked down from the sealed top ── */}
      {bands.map((b) => (
        <rect key={b.id} x={tubeX + 2} y={b.yTop} width={tubeW - 4}
          height={Math.max(0, b.h)} fill={b.color} opacity="0.18" />
      ))}
      {/* Hairline between adjacent bands */}
      {bands.slice(1).map((b) => (
        <line key={b.id + '-sep'} x1={tubeX + 2} y1={b.yTop} x2={tubeX + tubeW - 2} y2={b.yTop}
          stroke={b.color} strokeWidth="1" opacity="0.45" />
      ))}
      {/* Band labels sit INSIDE the glass (graduations are outside on the left, so
          there is nothing to collide with). Only shown when there is more than one
          band — with a single band the label would just repeat the meniscus reading. */}
      {bands.length > 1 && bands.filter(b => b.h > 22).map((b) => (
        <text key={b.id + '-lab'} x={cx} y={b.mid} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 13, fontWeight: 600, fill: b.color, fontVariantNumeric: 'tabular-nums' }}>
          {b.volume % 1 === 0 ? b.volume : b.volume.toFixed(1)} mL
        </text>
      ))}

      {/* ── Glass ── sealed rounded top, open bottom running into the trough */}
      <path d={`M ${tubeX} ${troughBot - 8} L ${tubeX} ${tubeTop + 12} Q ${tubeX} ${tubeTop} ${tubeX + 12} ${tubeTop}
                L ${tubeX + tubeW - 12} ${tubeTop} Q ${tubeX + tubeW} ${tubeTop} ${tubeX + tubeW} ${tubeTop + 12}
                L ${tubeX + tubeW} ${troughBot - 8}`}
        fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth="2.25" strokeLinejoin="round" />
      {/* Specular highlight down the left wall — reads as glass, not a bar chart */}
      <line x1={tubeX + 9} y1={tubeTop + 20} x2={tubeX + 9} y2={troughBot - 24}
        stroke="rgba(255,255,255,0.13)" strokeWidth="2.5" strokeLinecap="round" />

      {/* ── Platinum electrodes sealed through the closed end ── */}
      {[-1, 1].map((s) => {
        const xOuter = cx + s * 17, xTip = cx + s * 9;
        return (
          <g key={s}>
            <line x1={xOuter} y1={tubeTop - 20} x2={xOuter} y2={tubeTop + 4}
              stroke="#94a3b8" strokeWidth="2.25" strokeLinecap="round" />
            <line x1={xOuter} y1={tubeTop + 4} x2={xTip} y2={tubeTop + 30}
              stroke="#94a3b8" strokeWidth="2.25" strokeLinecap="round" />
            <circle cx={xOuter} cy={tubeTop - 23} r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1.5" />
          </g>
        );
      })}
      {/* Spark + glow — anchored to the SAME xTip/y coordinates as the electrode
          tips above, so it can never drift from the gap regardless of how the
          surrounding page layout shifts (a page-level overlay positioned by
          percentage did exactly that). Rendered every time (opacity animates
          via CSS) so it never pops in/out of the DOM. */}
      <circle className={`eud-spark-glow${firing ? ' on' : ''}`}
        cx={cx} cy={tubeTop + 30} r="26" fill="url(#eud-spark-grad)" />
      <line className={`eud-spark-glow${firing ? ' on' : ''}`}
        x1={cx - 9} y1={tubeTop + 30} x2={cx + 9} y2={tubeTop + 30}
        stroke={C_CO2} strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
      <text x={cx} y={tubeTop - 34} textAnchor="middle"
        style={{ fontSize: 12, fontWeight: 500, fill: C_GHOST }}>
        Sealed end · Pt electrodes
      </text>

      {/* ── Graduations (left) — 0 at the sealed end, increasing downward ── */}
      {Array.from({ length: 21 }, (_, i) => i * 5).map((ml) => {
        const yy = mlToY(ml);
        const major = ml % 20 === 0;
        return (
          <g key={ml}>
            <line x1={tubeX - (major ? 11 : 6)} y1={yy} x2={tubeX} y2={yy}
              stroke="rgba(255,255,255,0.26)" strokeWidth={major ? 1.5 : 1} />
            {major && (
              <text x={tubeX - 16} y={yy} textAnchor="end" dominantBaseline="middle"
                style={{ fontSize: 12, fontWeight: 400, fill: C_MUTED, fontVariantNumeric: 'tabular-nums' }}>
                {ml}
              </text>
            )}
          </g>
        );
      })}
      <text x={tubeX - 16} y={tubeBottom + 20} textAnchor="end"
        style={{ fontSize: 11, fontWeight: 400, fill: C_MUTED }}>mL</text>

      {/* ── The reading (right) — leader from the meniscus, clear of everything ── */}
      <line x1={tubeX + tubeW} y1={liquidTop} x2={tubeX + tubeW + 20} y2={liquidTop}
        stroke={C_LIQ} strokeWidth="1" opacity="0.5" />
      <text x={tubeX + tubeW + 26} y={liquidTop - 6}
        style={{ fontSize: 16, fontWeight: 700, fill: C_TEXT, fontVariantNumeric: 'tabular-nums' }}>
        {totalGas.toFixed(1)} mL
      </text>
      <text x={tubeX + tubeW + 26} y={liquidTop + 11}
        style={{ fontSize: 11, fontWeight: 500, fill: C_GHOST }}>
        gas remaining
      </text>

      {/* Which liquid is confining the gas */}
      <text x={W / 2} y={troughBot + 22} textAnchor="middle"
        style={{ fontSize: 13, fontWeight: 500, fill: koh ? C_TEXT : C_GHOST }}>
        {koh ? 'KOH solution' : 'Mercury'}
      </text>
    </svg>
  );
}
