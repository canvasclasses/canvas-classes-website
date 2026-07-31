'use client';

/**
 * Combustion Stoichiometry Balancer — v1 (2026-07-24)
 *
 * Academic source: NCERT Class 11, Chapter 1 — Some Basic Concepts of Chemistry
 * (Stoichiometry). Same general hydrocarbon combustion equation already taught
 * elsewhere on this page and used by EudiometerLabSim:
 *
 *   CxHy + (x + y/4) O2 -> x CO2 + (y/2) H2O
 *
 * Pedagogical goal: let a student build ANY hydrocarbon by picking its carbon
 * and hydrogen count, and instantly see the equation balance itself and the
 * relative-volume bar chart redraw — the same idea the Eudiometer Lab applies
 * in reverse (there you're GIVEN volumes and deduce x, y; here you pick x, y
 * and see the volumes). The hydrogen slider is capped at 2x+2 (the saturated-
 * alkane ceiling) and only takes even steps, because a valid hydrocarbon can
 * never have an odd hydrogen count (carbon's valence is 4, hydrogen's is 1).
 *
 * DELIBERATE DESIGN EXCEPTION (founder request, 2026-07-24): every other sim
 * in this file/library uses the SIMULATION_DESIGN_WORKFLOW's pale, low-opacity
 * substance tints (see EudiometerLabSim). This widget instead uses solid,
 * fully-saturated bar colours — the founder asked to "keep it bright" after
 * reviewing a reference mockup. This is the sanctioned exception in workflow
 * §3 for "a real-world identity colour shown INSIDE the visualization... data,
 * not chrome" — four distinct chemical species in a stacked bar chart
 * genuinely need four distinct, legible colours. All UI TEXT (title, labels,
 * axis) still uses the standard off-white token, never pure white.
 *
 * NEEDS_REVIEW: none — combustion stoichiometry is the same standard general
 * equation used elsewhere on this page; the 2x+2 saturated-alkane hydrogen
 * ceiling is standard organic chemistry (CnH2n+2).
 */

import { useMemo, useState } from 'react';

// ── Palette ──────────────────────────────────────────────────────────────
const C_TEXT = '#e2e8f0';
const C_DIM = '#94a3b8';
const C_MUTED = '#475569';
const C_GHOST = '#64748b';
const HAIR = '1px solid rgba(255,255,255,0.08)';

// Bright, fully-saturated — the deliberate exception described above.
const C_FUEL = '#818cf8';   // indigo mid — the hydrocarbon
const C_O2 = '#34d399';    // emerald mid — oxygen
const C_CO2 = '#fbbf24';   // amber mid — carbon dioxide
const C_H2O = '#f472b6';   // pink mid — water vapour

function Sub({ n }: { n: number }) { return <sub>{n}</sub>; }

// Formula CxHy with proper subscripts (x, y never shown as "1")
function Formula({ x, y }: { x: number; y: number }) {
  return <>C<Sub n={x} />H<Sub n={y} /></>;
}

// x + y/4 and y/2, cleared to whole-number coefficients. y is always even
// (enforced by the slider step), so y/2 is always whole; only x + y/4 can be
// a half-integer, which happens exactly when y ≡ 2 (mod 4) — multiply every
// coefficient by 2 in that case.
function balance(x: number, y: number) {
  if (y % 4 === 0) {
    return { fuel: 1, o2: x + y / 4, co2: x, h2o: y / 2 };
  }
  return { fuel: 2, o2: 2 * x + y / 2, co2: 2 * x, h2o: y };
}

export default function CombustionStoichiometryBalancerSim() {
  const [carbons, setCarbons] = useState(4);
  const [hydrogens, setHydrogens] = useState(8);

  const maxH = carbons * 2 + 2;
  const h = Math.min(hydrogens, maxH);

  const { fuel, o2, co2, h2o } = useMemo(() => balance(carbons, h), [carbons, h]);
  const reactantMoles = fuel + o2;
  const productMoles = co2 + h2o;
  const axisMax = Math.max(reactantMoles, productMoles);

  // Integer tick marks, roughly every 1 unit up to a sensible cap so a large
  // molecule (e.g. C8H18) doesn't draw 30+ ticks — thin them out past 12.
  const tickStep = axisMax <= 12 ? 1 : axisMax <= 24 ? 2 : 5;
  const ticks = useMemo(() => {
    const out: number[] = [];
    for (let t = 0; t <= axisMax; t += tickStep) out.push(t);
    if (out[out.length - 1] !== axisMax) out.push(axisMax);
    return out;
  }, [axisMax, tickStep]);

  const pct = (v: number) => (v / axisMax) * 100;

  const coefLabel = (c: number) => (c === 1 ? '' : `${c} `);

  return (
    <div className="not-prose p-4 md:p-6" style={{ background: '#0d1117', color: C_TEXT, borderRadius: 16 }}>
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-2xl font-black tracking-tight" style={{ color: C_TEXT }}>Combustion Stoichiometry Balancer</h2>
        <p className="text-sm mt-1" style={{ color: C_DIM }}>
          Pick a hydrocarbon by its carbon and hydrogen count — watch the equation balance itself and the volumes redraw.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
        <LegendItem color={C_FUEL} label={<Formula x={carbons} y={h} />} />
        <LegendItem color={C_O2} label="Oxygen (O₂)" />
        <LegendItem color={C_CO2} label="Carbon Dioxide (CO₂)" />
        <LegendItem color={C_H2O} label="Water Vapor (H₂O)" />
      </div>

      {/* Bar chart */}
      <div className="mb-2">
        <BarRow label="Products" segments={[
          { volume: co2, color: C_CO2 },
          { volume: h2o, color: C_H2O },
        ]} axisMax={axisMax} />
        <BarRow label="Reactants" segments={[
          { volume: fuel, color: C_FUEL },
          { volume: o2, color: C_O2 },
        ]} axisMax={axisMax} />
      </div>

      {/* Axis ticks */}
      <div className="relative h-6 ml-[92px]">
        {ticks.map((t) => (
          <span key={t} className="absolute text-xs tabular-nums" style={{ left: `${pct(t)}%`, color: C_MUTED, transform: 'translateX(-50%)' }}>
            {t}
          </span>
        ))}
      </div>
      <p className="text-xs text-right mt-1" style={{ color: C_GHOST }}>
        Stoichiometric Moles (Relative Volume) →
      </p>

      {/* Footer — just the balanced equation, centred and a little larger
          (founder feedback 2026-07-24: the reactant/product mole totals were
          dropped — the bar chart already shows those numbers on the bars
          themselves, so repeating them here was redundant). */}
      <div className="mt-6 pt-5 text-center" style={{ borderTop: HAIR }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: C_GHOST }}>Balanced Eq.</p>
        <p className="text-lg font-bold tabular-nums" style={{ color: C_TEXT }}>
          {coefLabel(fuel)}<Formula x={carbons} y={h} />
          <span className="mx-1.5">+</span>
          {coefLabel(o2)}O<Sub n={2} />
          <span className="mx-1.5">⟶</span>
          {coefLabel(co2)}CO<Sub n={2} />
          <span className="mx-1.5">+</span>
          {coefLabel(h2o)}H<Sub n={2} />O
        </p>
      </div>

      {/* Sliders */}
      <div className="mt-6 pt-5 flex flex-col sm:flex-row gap-6" style={{ borderTop: HAIR }}>
        <AtomSlider label="Carbon Atoms" value={carbons} min={1} max={8} step={1} color={C_FUEL}
          onChange={setCarbons} />
        <AtomSlider label="Hydrogen Atoms" value={h} min={2} max={maxH} step={2} color={C_FUEL}
          onChange={setHydrogens} />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ background: color }} />
      <span className="text-sm font-semibold" style={{ color: C_DIM }}>{label}</span>
    </div>
  );
}

function BarRow({ label, segments, axisMax }: {
  label: string; segments: { volume: number; color: string }[]; axisMax: number;
}) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="w-[76px] shrink-0 text-sm font-semibold text-right" style={{ color: C_DIM }}>{label}</span>
      <div className="flex-1 h-11 rounded-md overflow-hidden flex" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {segments.filter(s => s.volume > 0).map((s, i) => (
          <div key={i} className="h-full flex items-center justify-center text-sm font-bold"
            style={{ width: `${(s.volume / axisMax) * 100}%`, background: s.color, color: '#0d1117' }}>
            {s.volume}
          </div>
        ))}
      </div>
    </div>
  );
}

function AtomSlider({ label, value, min, max, step, color, onChange }: {
  label: string; value: number; min: number; max: number; step: number; color: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex-1 flex items-center gap-3">
      <span className="text-sm font-semibold shrink-0" style={{ color: C_DIM }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1" style={{ accentColor: color }} />
      <span className="w-11 shrink-0 text-center text-sm font-bold tabular-nums rounded-lg py-1.5"
        style={{ background: 'rgba(255,255,255,0.06)', color: C_TEXT }}>
        {value}
      </span>
    </div>
  );
}
