'use client';

/*
 * motion-lab/thermo/PvWorkbench.tsx — the thermodynamics flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 7: "PV-Diagram Workbench (drag a
 * process on the PV plane; work = shaded area computed live; cycle → net work)
 * — work is PATH-DEPENDENT; internal energy is not."
 *
 * ── HOW THE LESSON IS MADE UNFAKEABLE ───────────────────────────────────────
 * The claim is a contrast, so the bench draws the contrast rather than stating
 * it. `path-dependence` runs TWO routes between an IDENTICAL pair of states,
 * shades both, and prints one ledger per route beside a single shared ΔU. The
 * two W values differ by hundreds of joules; the two ΔU values are equal to the
 * last digit, and they are equal because `deltaU()` in `lib/pv.ts` takes only
 * the endpoints as arguments — the path is not available to it, structurally.
 *
 * The work numbers, meanwhile, come from `workAlongPath()` over the exact point
 * array the shading fills. Drag the process and the region and the number move
 * as one thing, because they are one thing.
 *
 * ── THE PRIMARY GESTURE ─────────────────────────────────────────────────────
 * Drag the endpoint of the process along the plane. That sets V₂ (and, on the
 * isochoric leg of a cycle, P). The student chooses how far the gas expands —
 * which is the only free choice the physics actually offers here, and pretending
 * otherwise with six sliders would be worse.
 *
 * ── ONE HONEST LIMIT, STATED ON SCREEN ──────────────────────────────────────
 * The trapezoid integral over 1200 samples reproduces nRT ln(V₂/V₁) to about
 * one part in 10⁶ — far below the three digits shown. The bench prints the
 * closed form beside the measured area rather than instead of it, so the
 * student sees agreement rather than being told about it.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { ThermoArchetype } from './types';
import * as PV from './lib/pv';
import { ux as plotUx, type Plot } from '../waves/lib/plot';
import { px, py } from '../waves/lib/plot';
import { resolveParams, num, bool, str, controlDefs, bagKey, leadingInt } from '../waves/lib/resolve';
import { svgPoint, GRAB_CSS_PX } from '../waves/svgparts';
import PvCanvas, { type PvSeries } from './PvCanvas';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, LedgerBar, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, BORDER, accentTint,
  clamp, f1, f2, f3, fInt, type LegendRow, type ReadoutRow,
} from '../waves/ui';

const MAX_STAGE = 3;

type Mode = 'isothermal' | 'compare' | 'paths' | 'cycle';

const modeOf = (id: string): Mode =>
  id === 'adiabatic-vs-isothermal' ? 'compare'
  : id === 'path-dependence' ? 'paths'
  : id === 'closed-cycle-area' ? 'cycle'
  : 'isothermal';

export default function PvWorkbench({ block, arch }: { block: MotionBenchBlock; arch: ThermoArchetype }) {
  const mode = modeOf(arch.id);
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [reverse, setReverse] = useState(() => bool(authored, 'reverse', false));
  const [showExact, setShowExact] = useState(() => bool(authored, 'show_exact', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); setReverse(bool(authored, 'reverse', false)); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [touched, setTouched] = useState(false);

  // ── the gas ───────────────────────────────────────────────────────────────
  const gas: PV.GasModel = { n: c.n, f: c.f };
  const start: PV.GasState = { V: c.v1, T: c.T, P: PV.pressureFromVT(c.v1, c.T, c.n) };

  // ── the processes ─────────────────────────────────────────────────────────
  const isoLeg = useMemo(() => PV.buildLeg('isothermal', start, gas, c.v2, 1200),
    [start.V, start.P, start.T, gas.n, gas.f, c.v2]); // eslint-disable-line react-hooks/exhaustive-deps
  const adiaLeg = useMemo(() => PV.buildLeg('adiabatic', start, gas, c.v2, 1200),
    [start.V, start.P, start.T, gas.n, gas.f, c.v2]); // eslint-disable-line react-hooks/exhaustive-deps

  // Two routes between the SAME endpoints, for the path-dependence rung. Route
  // A expands at constant pressure then cools at constant volume; route B cools
  // first then expands. Both land on (V₂, P₂) exactly, which is what makes the
  // ΔU comparison meaningful rather than approximate.
  const routes = useMemo(() => {
    const endP = PV.pressureAlong('isothermal', start, gas, c.v2);
    const end: PV.GasState = { V: c.v2, P: endP, T: (endP * c.v2) / (gas.n * PV.R_GAS) };
    const a1 = PV.buildLeg('isobaric', start, gas, c.v2, 600);
    const a2 = PV.buildLeg('isochoric', a1.to, gas, end.P, 2);
    const b1 = PV.buildLeg('isochoric', start, gas, end.P, 2);
    const b2 = PV.buildLeg('isobaric', b1.to, gas, c.v2, 600);
    return { A: [a1, a2], B: [b1, b2], end };
  }, [start.V, start.P, start.T, gas.n, gas.f, c.v2]); // eslint-disable-line react-hooks/exhaustive-deps

  const cycle = useMemo(() => {
    const legs = PV.carnotCycle(gas, c.v1, c.v2, c.Thot, c.T, 700);
    return reverse ? PV.reverseCycle(legs) : legs;
  }, [gas.n, gas.f, c.v1, c.v2, c.Thot, c.T, reverse]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── ledgers ───────────────────────────────────────────────────────────────
  const isoLedger = PV.legLedger(isoLeg, gas);
  const adiaLedger = PV.legLedger(adiaLeg, gas);
  const ledgerA = { W: routes.A.reduce((s, l) => s + PV.workAlongPath(l.points), 0), dU: PV.deltaU(gas, start, routes.end) };
  const ledgerB = { W: routes.B.reduce((s, l) => s + PV.workAlongPath(l.points), 0), dU: PV.deltaU(gas, start, routes.end) };
  const cyc = PV.cycleLedger(cycle, gas);

  // ── the visible reveal ladder ─────────────────────────────────────────────
  // Stage decides how many legs of a cycle exist yet, so the loop is ASSEMBLED
  // rather than presented. Nothing is shaded until it has been drawn.
  const legsShown = mode === 'cycle' ? Math.min(stage + 1, cycle.length) : 0;

  const series: PvSeries[] = [];
  if (mode === 'isothermal') {
    series.push({ points: isoLeg.points, color: ACCENT, shade: stage >= 2, endpoints: true });
  } else if (mode === 'compare') {
    series.push({ points: isoLeg.points, color: ACCENT, shade: stage >= 3, endpoints: true });
    if (stage >= 1) series.push({ points: adiaLeg.points, color: ACCENT_2, dashed: true, shade: stage >= 3, endpoints: true });
  } else if (mode === 'paths') {
    if (stage >= 1) routes.A.forEach((l) => series.push({ points: l.points, color: ACCENT, shade: stage >= 3, endpoints: true }));
    if (stage >= 2) routes.B.forEach((l) => series.push({ points: l.points, color: ACCENT_2, shade: stage >= 3, endpoints: true }));
    // The isotherm through the two endpoints, faint, so the student can see
    // that both routes really do start and finish at the same two states.
    series.push({ points: isoLeg.points, color: 'rgba(255,255,255,0.35)', dashed: true, width: 1.4 });
  } else {
    cycle.slice(0, legsShown).forEach((l) => series.push({
      points: l.points, color: l.to.V > l.from.V ? ACCENT : ACCENT_2,
      dashed: l.kind === 'adiabatic', endpoints: true,
    }));
  }

  const loop = mode === 'cycle' && legsShown >= cycle.length && stage >= MAX_STAGE
    ? { points: PV.closedPolygon(cycle), color: ACCENT }
    : null;

  // ── drag the endpoint ─────────────────────────────────────────────────────
  const plotRef = useRef<Plot | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const handle = mode === 'cycle' ? null : { V: c.v2, P: isoLeg.to.P };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const plot = plotRef.current;
    if (!plot || !handle || stage < 1) return;
    const p = svgPoint(e, plot.w, plot.h);
    if (!p) return;
    const hx = px(plot, handle.V);
    const hy = py(plot, handle.P);
    if (Math.hypot(p.x - hx, p.y - hy) * p.fit > GRAB_CSS_PX) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbed(true);
    setTouched(true);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const plot = plotRef.current;
    if (!grabbed || !plot) return;
    const p = svgPoint(e, plot.w, plot.h);
    if (!p) return;
    setC((prev) => ({ ...prev, v2: clamp(plotUx(plot, p.x), prev.v1 * 1.05, prev.v1 * 6) }));
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    setGrabbed(false);
  };

  // ── the misconception gate ────────────────────────────────────────────────
  const ready = misconceptionReady(arch.targets, {
    stage, touched, expanded: c.v2 > c.v1 * 1.2, reverse, legsShown, legs: cycle.length,
  });

  // ── legend, readouts ──────────────────────────────────────────────────────
  const legend: LegendRow[] = [];
  if (mode === 'isothermal') {
    legend.push({ color: ACCENT, label: 'Isotherm — PV constant', strong: true });
    if (stage >= 2) legend.push({ color: accentTint(ACCENT, 0.5), label: `Shaded = work done by the gas`, value: `${fInt(isoLedger.W)} J` });
  } else if (mode === 'compare') {
    legend.push({ color: ACCENT, label: 'Isothermal — in a water bath', value: `${fInt(isoLedger.W)} J`, strong: true });
    legend.push({ color: ACCENT_2, dashed: true, label: 'Adiabatic — insulated', value: `${fInt(adiaLedger.W)} J`, strong: true });
  } else if (mode === 'paths') {
    legend.push({ color: ACCENT, label: 'Route A — expand, then cool', value: `${fInt(ledgerA.W)} J`, strong: true });
    legend.push({ color: ACCENT_2, label: 'Route B — cool, then expand', value: `${fInt(ledgerB.W)} J`, strong: true });
    legend.push({ color: 'rgba(255,255,255,0.35)', dashed: true, label: 'The isotherm through both endpoints' });
  } else {
    legend.push({ color: ACCENT, label: 'Expansion — work comes out' });
    legend.push({ color: ACCENT_2, label: 'Compression — work goes in' });
    if (loop) legend.push({ color: accentTint(ACCENT, 0.5), label: 'Enclosed area = net work', value: `${fInt(Math.abs(cyc.netWork))} J`, strong: true });
  }
  legend.push({ color: 'rgba(255,255,255,0.3)', label: `Axes: V 0 → ${f3(Math.max(c.v2, c.v1) * 1.15)} m³, P 0 → ${fInt(start.P * 1.1 / 1000)} kPa` });

  const readout: ReadoutRow[] =
    mode === 'cycle'
      ? [
          { label: 'Net work per cycle', value: `${fInt(cyc.netWork)} J`, color: ACCENT, strong: true },
          { label: 'Enclosed area', value: `${fInt(cyc.enclosedArea)} J`, color: ACCENT_2 },
          { label: 'Σ ΔU round the loop', value: `${f3(cyc.netDeltaU)} J` },
          { label: 'Heat absorbed', value: `${fInt(cyc.heatAbsorbed)} J` },
          { label: 'Heat rejected', value: `${fInt(cyc.heatRejected)} J` },
          { label: 'Efficiency W/Q_in', value: Number.isFinite(cyc.efficiency) ? `${f1(cyc.efficiency * 100)} %` : '—' },
        ]
      : mode === 'paths'
        ? [
            { label: 'Route A work', value: `${fInt(ledgerA.W)} J`, color: ACCENT, strong: true },
            { label: 'Route B work', value: `${fInt(ledgerB.W)} J`, color: ACCENT_2, strong: true },
            { label: 'Difference in W', value: `${fInt(Math.abs(ledgerA.W - ledgerB.W))} J` },
            { label: 'ΔU — route A', value: `${f3(ledgerA.dU)} J` },
            { label: 'ΔU — route B', value: `${f3(ledgerB.dU)} J` },
            { label: 'Difference in ΔU', value: `${f3(Math.abs(ledgerA.dU - ledgerB.dU))} J` },
          ]
        : mode === 'compare'
          ? [
              { label: 'Isothermal work', value: `${fInt(isoLedger.W)} J`, color: ACCENT, strong: true },
              { label: 'Adiabatic work', value: `${fInt(adiaLedger.W)} J`, color: ACCENT_2, strong: true },
              { label: 'Final T — isothermal', value: `${f1(isoLeg.to.T)} K` },
              { label: 'Final T — adiabatic', value: `${f1(adiaLeg.to.T)} K` },
              { label: 'γ = 1 + 2/f', value: `${f3(PV.gammaOf(gas))}` },
              { label: 'ΔU — adiabatic', value: `${fInt(adiaLedger.dU)} J` },
            ]
          : [
              { label: 'Work = shaded area', value: `${fInt(isoLedger.W)} J`, color: ACCENT, strong: true },
              ...(showExact ? [{ label: 'nRT ln(V₂/V₁)', value: `${fInt(isoLedger.Wexact)} J`, color: ACCENT_2 }] : []),
              { label: 'Disagreement', value: `${f3(Math.abs(isoLedger.W - isoLedger.Wexact))} J` },
              { label: 'ΔU (isothermal)', value: `${f3(isoLedger.dU)} J` },
              { label: 'Heat in, Q = ΔU + W', value: `${fInt(isoLedger.Q)} J` },
              { label: 'P₁ΔV (the wrong rectangle)', value: `${fInt(start.P * (c.v2 - c.v1))} J` },
            ];

  return (
    <LabFrame
      title={block.title ?? arch.title}
      subtitle={`${arch.id.replace(/-/g, ' ')} · pv workbench`}
      badge={<span className="tabular-nums">{mode === 'cycle' ? `W_net = ${fInt(cyc.netWork)} J` : `W = ${fInt(isoLedger.W)} J`}</span>}
      guided={guided ? {
        steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
        onAdvance: () => setStep((s) => s + 1),
      } : null}
      predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
      canvasAspect={1.5}
      maxCanvasHeight={430}
      frozen={grabbed}
      renderCanvas={(w, h) => (
        <PvCanvas
          w={w} h={h} series={series} loop={loop}
          handle={handle && stage >= 1 ? handle : null}
          handleHint={!touched && stage >= 1}
          svgRef={svgRef}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
          onPlot={(plot) => { plotRef.current = plot; }}
        />
      )}
      legend={legend}
      belowCanvas={
        mode === 'cycle' ? (
          <div className="flex flex-wrap items-center gap-3">
            <Toggle on={reverse} label="run the cycle backwards" accent={ACCENT_2} onClick={() => setReverse((v) => !v)} />
            <span className="text-[11px]" style={{ color: TEXT.muted }}>
              {legsShown} of {cycle.length} strokes drawn{legsShown < cycle.length ? ' — keep going to close the loop' : ' · loop closed'}
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11px]" style={{ color: TEXT.muted }}>
              {touched ? 'Drag the endpoint anywhere along the plane.' : '👆 Drag the endpoint of the process — the shaded region and the work follow it.'}
            </span>
            {mode === 'isothermal' && (
              <Toggle on={showExact} label="quote the closed form beside it" onClick={() => setShowExact((v) => !v)} />
            )}
          </div>
        )
      }
      controls={
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Set up the gas</SectionLabel>
          {defs.map((d) => {
            if (d.kind === 'number') {
              return (
                <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                  min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.001} unit={d.unit ?? ''}
                  accent={d.key === 'v2' || d.key === 'T_hot' ? ACCENT_2 : ACCENT}
                  format={(v) => ((d.step ?? 1) < 0.01 ? v.toFixed(3) : v.toFixed(1))}
                  onChange={(v) => setC((prev) => ({ ...prev, ...assign(d.key, v) }))} />
              );
            }
            if (d.kind === 'select') {
              return (
                <div key={d.key} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>{d.label}</span>
                  <select
                    value={c.freedomLabel}
                    onChange={(e) => setC((prev) => ({ ...prev, freedomLabel: e.target.value, f: leadingInt(e.target.value, 5) }))}
                    className="rounded-lg border px-2 py-2 text-[13px] outline-none"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: BORDER.card, color: TEXT.primary, minHeight: 44 }}>
                    {(d.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              );
            }
            return null;
          })}
        </div>
      }
      panels={
        <>
          <Readout rows={readout} footnote={
            mode === 'cycle'
              ? 'Σ ΔU is summed leg by leg, never assumed. A loop that did not close would show it there instead of quoting a plausible efficiency.'
              : 'The shaded area and the printed work are ONE trapezoid sum over the same 1200 points. They cannot disagree.'
          } />

          {stage >= 3 && mode !== 'cycle' && (
            <LedgerBar
              segments={mode === 'paths'
                ? [
                    { label: 'W route A', value: Math.abs(ledgerA.W), color: ACCENT },
                    { label: 'W route B', value: Math.abs(ledgerB.W), color: ACCENT_2 },
                  ]
                : [
                    { label: 'W (out)', value: Math.abs(isoLedger.W), color: ACCENT },
                    { label: 'ΔU', value: Math.abs(isoLedger.dU), color: ACCENT_2 },
                  ]}
              total={mode === 'paths' ? Math.abs(ledgerA.W) + Math.abs(ledgerB.W) : Math.abs(isoLedger.Q)}
              unit="J"
              note={mode === 'paths'
                ? `Two routes, two different W. And ΔU is ${f3(ledgerA.dU)} J on BOTH — because deltaU() is handed the two endpoints and nothing else.`
                : 'First law: whatever the gas does not keep as internal energy, it did as work — and the heat in is the sum.'}
            />
          )}

          {mode === 'cycle' && stage >= MAX_STAGE && (
            <Card tone="accent">
              <SectionLabel accent={ACCENT}>Net work vs enclosed area</SectionLabel>
              <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                Σ∮P dV over the four legs is <b style={{ color: ACCENT }}>{fInt(cyc.netWork)} J</b>; the shoelace area of the
                closed polygon is <b style={{ color: ACCENT_2 }}>{fInt(cyc.enclosedArea)} J</b>. They agree to{' '}
                {f3(Math.abs(Math.abs(cyc.netWork) - cyc.enclosedArea))} J — not because they were made to, but because for a
                closed polygon the trapezoid sum IS the shoelace formula.
              </p>
              <p className="mt-1.5 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                {cyc.clockwise
                  ? 'Clockwise: heat in, work out. This is an engine.'
                  : 'Anticlockwise: work in, heat pumped from cold to hot. This is a refrigerator.'}
              </p>
            </Card>
          )}

          {mode === 'compare' && stage >= 2 && (
            <Card>
              <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                The insulated gas came out at <b style={{ color: ACCENT_2 }}>{f1(adiaLeg.to.T)} K</b> against{' '}
                <b style={{ color: ACCENT }}>{f1(isoLeg.to.T)} K</b> for the one in the bath — a drop of{' '}
                {f1(c.T - adiaLeg.to.T)} K with nothing having been cooled. Q = 0, so ΔU = −W, and the{' '}
                {fInt(Math.abs(adiaLedger.W))} J of work came straight out of the gas&rsquo;s own store.
              </p>
            </Card>
          )}

          {block.numeric && (
            <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
              tolerance={block.numeric.tolerance} unit={block.numeric.unit}
              reveal={block.numeric.worked_reveal} />
          )}
        </>
      }
      misconception={ready ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
      tip={arch.tip}
      caption={block.caption}
    />
  );
}

// ── controls ─────────────────────────────────────────────────────────────────

interface Controls { n: number; f: number; freedomLabel: string; v1: number; v2: number; T: number; Thot: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => {
  const label = str(b, 'freedom', '5 — diatomic (air)');
  return {
    n: num(b, 'moles', 1),
    f: leadingInt(label, 5),
    freedomLabel: label,
    v1: num(b, 'v1', 0.02),
    v2: num(b, 'v2', 0.05),
    T: num(b, 'T', 300),
    Thot: num(b, 'T_hot', 500),
  };
};

const numberOf = (c: Controls, key: string): number => {
  switch (key) {
    case 'moles': return c.n;
    case 'v1': return c.v1;
    case 'v2': return c.v2;
    case 'T': return c.T;
    case 'T_hot': return c.Thot;
    default: return 0;
  }
};

const assign = (key: string, v: number): Partial<Controls> => {
  switch (key) {
    case 'moles': return { n: v };
    case 'v1': return { v1: v };
    case 'v2': return { v2: v };
    case 'T': return { T: v };
    case 'T_hot': return { Thot: v };
    default: return {};
  }
};

// ── evidence gates ───────────────────────────────────────────────────────────

function misconceptionReady(code: string, x: {
  stage: number; touched: boolean; expanded: boolean; reverse: boolean; legsShown: number; legs: number;
}): boolean {
  switch (code) {
    // The rectangle has to have been compared with the real area.
    case 'work_is_p_times_delta_v_always':
      return x.stage >= 2 && x.expanded;
    // Both curves have to be on screen with their temperatures read.
    case 'adiabatic_means_constant_temperature':
      return x.stage >= 2;
    // Both routes drawn and both shaded.
    case 'internal_energy_is_path_dependent':
      return x.stage >= 3;
    // The loop has to be closed before "it returns, so no work" can be broken.
    case 'cycle_does_no_work_because_it_returns':
      return x.legsShown >= x.legs && x.stage >= x.legs - 1;
    default:
      return x.stage >= MAX_STAGE;
  }
}
