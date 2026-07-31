'use client';

/**
 * SolubilityCurveSim — Reading a Solubility Curve (Activity 5.2)
 *
 * Academic source: NCERT Class 9 Science, Chapter "Exploring Mixtures and their
 * Separation" — Activity 5.2 teaches students to read solubility (g solute per
 * 100 g water) off a temperature graph for two contrasting solids, then uses
 * that skill to introduce crystallisation (cooling a saturated solution drops
 * out the excess solute as it cools).
 *
 * "Compound A" and "Compound B" are the chapter's own named hypothetical
 * solids ("Imagine two unknown solids...") — not real substances, so no
 * external citation applies. The B-curve data points are fixed by the
 * chapter's own published text (the very next callout on this page): a
 * saturated solution made with 287 g of B per 100 g water at 60°C, cooled to
 * 40°C, holds only 241 g dissolved — 46 g crystallises out. This sim's table
 * for B is built to pass through those two exact points so the numbers the
 * student sees on the graph match the numbers already quoted in the chapter.
 * The A curve keeps the chapter's own description: "rises only a little as
 * temperature goes up... barely changes."
 *
 * The predict-first gate for this sim (guess A vs. B before the graph is
 * shown) is authored on the block's `prediction` field, not inside this
 * component — that's the platform's standard mechanism, already used by this
 * same chapter's other sims (chromatography, fractional distillation).
 */

import { useState, useRef } from 'react';
import {
  SimShell, SimHeader, SectionLabel, SimSlider, ExpertTip,
  ACCENT, ACCENT_2, TEXT, OK, BORDER, TYPE, accentTint,
} from './_shared';

// ── Data: grams of solute per 100 g water at each temperature (°C) ─────────
// Straight-line segments between these anchor points — the chapter's own text
// calls them "a line that rises only a little" (A) and "a line that climbs
// steeply" (B), so a polyline matches the source description exactly.
const CURVE_A: [number, number][] = [[0, 30], [20, 32], [40, 34], [60, 36], [80, 38], [100, 40]];
const CURVE_B: [number, number][] = [[0, 95], [20, 150], [40, 241], [60, 287], [80, 335], [100, 378]];

function interp(table: [number, number][], t: number): number {
  const clamped = Math.max(table[0][0], Math.min(table[table.length - 1][0], t));
  for (let i = 0; i < table.length - 1; i++) {
    const [t0, v0] = table[i];
    const [t1, v1] = table[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const frac = (clamped - t0) / (t1 - t0);
      return v0 + frac * (v1 - v0);
    }
  }
  return table[table.length - 1][1];
}

// ── SVG plot geometry ───────────────────────────────────────────────────────
const VB_W = 640, VB_H = 380;
const PX0 = 66, PX1 = 604;   // x pixel range  ↔ 0–100 °C
const PY0 = 306, PY1 = 32;   // y pixel range  ↔ 0–400 g   (PY0 = bottom)
const V_MAX = 400;

const xForTemp = (t: number) => PX0 + (t / 100) * (PX1 - PX0);
const yForVal = (v: number) => PY0 + (Math.min(v, V_MAX) / V_MAX) * (PY1 - PY0);

const polylinePts = (table: [number, number][]) =>
  table.map(([t, v]) => `${xForTemp(t).toFixed(1)},${yForVal(v).toFixed(1)}`).join(' ');

const TEMP_TICKS = [0, 20, 40, 60, 80, 100];
const VAL_TICKS = [0, 100, 200, 300, 400];

export default function SolubilityCurveSim() {
  const [temp, setTemp] = useState(50);
  const [cooling, setCooling] = useState(false);
  const rafRef = useRef<number | null>(null);

  const aVal = interp(CURVE_A, temp);
  const bVal = interp(CURVE_B, temp);

  function runCoolingDemo() {
    if (cooling) return;
    setCooling(true);
    setTemp(60);
    const start = performance.now();
    const DUR = 1100;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / DUR);
      setTemp(60 - p * 20); // 60 → 40
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCooling(false);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  const crystallised = interp(CURVE_B, 60) - interp(CURVE_B, 40); // = 46 g, matches the chapter callout

  return (
    <SimShell>
      <SimHeader
        title="Solubility Curve"
        accentWord="Reader"
        subtitle="Activity 5.2 — Compound A vs. Compound B"
      />

      <div className="flex flex-col gap-5">
        {/* ── Chart ── */}
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ background: BORDER.hairline, border: `1px solid ${BORDER.card}` }}
        >
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" style={{ display: 'block' }}>
            {/* gridlines */}
            {VAL_TICKS.map((v) => (
              <line key={`gy-${v}`} x1={PX0} x2={PX1} y1={yForVal(v)} y2={yForVal(v)} stroke={BORDER.divider} strokeWidth={1} />
            ))}
            {TEMP_TICKS.map((t) => (
              <line key={`gx-${t}`} x1={xForTemp(t)} x2={xForTemp(t)} y1={PY1} y2={PY0} stroke={BORDER.divider} strokeWidth={1} />
            ))}
            {/* axes */}
            <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke={TEXT.muted} strokeWidth={1.5} />
            <line x1={PX0} x2={PX0} y1={PY1} y2={PY0} stroke={TEXT.muted} strokeWidth={1.5} />
            {/* axis labels */}
            {TEMP_TICKS.map((t) => (
              <text key={`tx-${t}`} x={xForTemp(t)} y={PY0 + 20} textAnchor="middle" fontSize={11} fill={TEXT.ghost} className="tabular-nums">
                {t}
              </text>
            ))}
            {VAL_TICKS.map((v) => (
              <text key={`ty-${v}`} x={PX0 - 10} y={yForVal(v) + 4} textAnchor="end" fontSize={11} fill={TEXT.ghost} className="tabular-nums">
                {v}
              </text>
            ))}
            <text x={(PX0 + PX1) / 2} y={VB_H - 6} textAnchor="middle" fontSize={11} fill={TEXT.muted}>
              Temperature (°C)
            </text>
            <text x={16} y={(PY0 + PY1) / 2} textAnchor="middle" fontSize={11} fill={TEXT.muted} transform={`rotate(-90 16 ${(PY0 + PY1) / 2})`}>
              Solubility (g / 100 g water)
            </text>

            {/* curves */}
            <polyline points={polylinePts(CURVE_A)} fill="none" stroke={ACCENT} strokeWidth={3} strokeLinejoin="round" />
            <polyline points={polylinePts(CURVE_B)} fill="none" stroke={ACCENT_2} strokeWidth={3} strokeLinejoin="round" />
            <text x={xForTemp(100) + 6} y={yForVal(interp(CURVE_A, 100))} fontSize={12} fontWeight={700} fill={ACCENT}>A</text>
            <text x={xForTemp(100) + 6} y={yForVal(interp(CURVE_B, 100))} fontSize={12} fontWeight={700} fill={ACCENT_2}>B</text>

            {/* current-temperature guide */}
            <line x1={xForTemp(temp)} x2={xForTemp(temp)} y1={PY1} y2={PY0} stroke={TEXT.ghost} strokeWidth={1} strokeDasharray="4 4" />
            <circle cx={xForTemp(temp)} cy={yForVal(aVal)} r={5} fill={ACCENT} />
            <circle cx={xForTemp(temp)} cy={yForVal(bVal)} r={5} fill={ACCENT_2} />
          </svg>
        </div>

        {/* ── Slider + readout ── */}
        <SimSlider
          label="Temperature"
          value={temp}
          min={0}
          max={100}
          step={1}
          unit="°C"
          onChange={(v) => setTemp(v)}
          disabled={cooling}
          format={(v) => v.toFixed(0)}
        />
        <div className="flex gap-6 flex-wrap">
          <div>
            <SectionLabel accent={ACCENT}>Compound A holds</SectionLabel>
            <div className="tabular-nums text-lg font-black" style={{ color: ACCENT }}>{aVal.toFixed(0)} g <span className={TYPE.metadata} style={{ color: TEXT.ghost }}>/ 100 g water</span></div>
          </div>
          <div>
            <SectionLabel accent={ACCENT_2}>Compound B holds</SectionLabel>
            <div className="tabular-nums text-lg font-black" style={{ color: ACCENT_2 }}>{bVal.toFixed(0)} g <span className={TYPE.metadata} style={{ color: TEXT.ghost }}>/ 100 g water</span></div>
          </div>
        </div>

        {/* ── Bonus: reproduce the cooling scenario from the chapter's callout ── */}
        <div className="pt-1">
          <button
            onClick={runCoolingDemo}
            disabled={cooling}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
            style={{
              background: accentTint(ACCENT_2, 0.1),
              border: `1px solid ${accentTint(ACCENT_2, 0.3)}`,
              color: ACCENT_2,
              opacity: cooling ? 0.6 : 1,
              cursor: cooling ? 'default' : 'pointer',
            }}
          >
            ↓ Cool a saturated B solution: 60°C → 40°C
          </button>
          {temp <= 40.5 && !cooling && (
            <p className={`${TYPE.body} mt-2`} style={{ color: TEXT.secondary }}>
              At 60°C, 100 g of water held <span className="tabular-nums font-semibold" style={{ color: ACCENT_2 }}>287 g</span> of dissolved B.
              Cooled to 40°C, it can only hold <span className="tabular-nums font-semibold" style={{ color: ACCENT_2 }}>241 g</span> —
              the missing <span className="tabular-nums font-semibold" style={{ color: OK }}>{crystallised.toFixed(0)} g</span> crystallises out.
            </p>
          )}
        </div>

        <ExpertTip accent={ACCENT}>
          Any point ON a curve is a saturated solution at that temperature. Cool a saturated solution and you move
          straight down, off the curve — the solute that can no longer fit back into solution crystallises out.
          That&apos;s the whole idea behind crystallisation, next page.
        </ExpertTip>
      </div>
    </SimShell>
  );
}
