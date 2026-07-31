'use client';

/*
 * motion-lab/thermo/HeatEngineBench.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 7: "Heat Engine Bench (assemble Carnot
 * / Otto / fridge from strokes) — why efficiency can't reach 1."
 *
 * ── THE CYCLE IS ASSEMBLED, NOT PRESENTED ───────────────────────────────────
 * The guided ladder adds ONE stroke per click, and nothing is shaded or totalled
 * until the loop closes. A Carnot diagram printed complete on arrival tells a
 * student what the answer looks like; watching the fourth stroke arrive and the
 * loop snap shut tells them WHY there has to be a fourth stroke — you cannot get
 * home without compressing, and compressing a hot gas costs more than
 * compressing a cold one, so the heat you dump is not waste, it is the price of
 * returning.
 *
 * ── "WHY CAN'T IT REACH 1" IS ANSWERED BY MEASUREMENT ───────────────────────
 * The bench prints the assembled cycle's own W_net/Q_in beside the Carnot
 * ceiling for the SAME two extreme temperatures. Move any slider and both
 * numbers move; the gap never goes negative. That is not a claim in a paragraph
 * — it is a number the student can spend a minute trying to break, and the
 * attempt is the lesson.
 *
 * ── THE FRIDGE IS THE SAME CYCLE ────────────────────────────────────────────
 * `reverseCycle()` reverses the leg list. No second construction, no separate
 * physics: the identical four strokes traced the other way, with every sign in
 * the ledger flipping. "A fridge is an engine run backwards" is therefore
 * literally true in the code, not a figure of speech in the copy.
 */

import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { ThermoArchetype } from './types';
import * as PV from './lib/pv';
import { resolveParams, num, bool, str, controlDefs, bagKey, leadingInt } from '../waves/lib/resolve';
import PvCanvas, { type PvSeries } from './PvCanvas';
import {
  LabFrame, Card, Toggle, Readout, LedgerBar, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, BORDER,
  clamp, f1, f2, f3, fInt, type LegendRow, type ReadoutRow,
} from '../waves/ui';

const MAX_STAGE = 3;

type Kind = 'carnot' | 'otto' | 'fridge';
const kindOf = (id: string): Kind =>
  id === 'otto-engine' ? 'otto' : id === 'fridge-and-heat-pump' ? 'fridge' : 'carnot';

export default function HeatEngineBench({ block, arch }: { block: MotionBenchBlock; arch: ThermoArchetype }) {
  const kind = kindOf(arch.id);
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [compareCarnot, setCompareCarnot] = useState(() => bool(authored, 'compare_carnot', true));
  const [showFlows, setShowFlows] = useState(() => bool(authored, 'show_reservoirs', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);

  // ── the cycle ─────────────────────────────────────────────────────────────
  const gas: PV.GasModel = { n: c.n, f: c.f };
  const gamma = PV.gammaOf(gas);

  const legs = useMemo(() => {
    if (kind === 'otto') return PV.ottoCycle(gas, c.v1, c.ratio, c.T, c.Tpeak, 700);
    const forward = PV.carnotCycle(gas, c.v1, c.v2, c.Thot, c.Tcold, 700);
    return kind === 'fridge' ? PV.reverseCycle(forward) : forward;
  }, [kind, gas.n, gas.f, c.v1, c.v2, c.ratio, c.T, c.Tpeak, c.Thot, c.Tcold]); // eslint-disable-line react-hooks/exhaustive-deps

  const ledger = PV.cycleLedger(legs, gas);

  // The extreme temperatures the cycle actually visits — that is what Carnot's
  // ceiling is quoted between, and for an Otto cycle they are NOT the two
  // reservoir temperatures a student first reaches for.
  const temps = legs.flatMap((l) => [l.from.T, l.to.T]);
  const Thi = Math.max(...temps);
  const Tlo = Math.min(...temps);
  const carnotCeiling = PV.carnotEfficiency(Tlo, Thi);
  const ottoIdeal = PV.ottoEfficiency(c.ratio, gamma);
  const cop = ledger.netWork < 0 ? ledger.heatAbsorbed / Math.abs(ledger.netWork) : NaN;
  const copCarnot = PV.carnotCOP(c.Tcold, c.Thot);

  const legsShown = Math.min(stage + 1, legs.length);
  const closed = legsShown >= legs.length;

  const series: PvSeries[] = legs.slice(0, legsShown).map((l) => ({
    points: l.points,
    color: l.to.V > l.from.V ? ACCENT : ACCENT_2,
    dashed: l.kind === 'adiabatic',
    endpoints: true,
  }));
  const loop = closed ? { points: PV.closedPolygon(legs), color: ACCENT } : null;

  const ready = closed && stage >= MAX_STAGE;

  // ── legend + readouts ─────────────────────────────────────────────────────
  const legend: LegendRow[] = [
    { color: ACCENT, label: 'Expansion strokes — work out' },
    { color: ACCENT_2, label: 'Compression strokes — work in' },
    { color: 'rgba(255,255,255,0.5)', dashed: true, label: 'Dashed = adiabatic (insulated, Q = 0)' },
  ];
  if (loop) {
    legend.push({
      color: ACCENT,
      label: kind === 'fridge' ? 'Enclosed area = work you PAY per cycle' : 'Enclosed area = net work out',
      value: `${fInt(Math.abs(ledger.netWork))} J`, strong: true,
    });
  }

  const readout: ReadoutRow[] = kind === 'fridge'
    ? [
        { label: 'Heat pulled from the cold box', value: `${fInt(ledger.heatAbsorbed)} J`, color: ACCENT, strong: true },
        { label: 'Work you pay', value: `${fInt(Math.abs(ledger.netWork))} J`, color: ACCENT_2 },
        { label: 'Heat dumped into the room', value: `${fInt(ledger.heatRejected)} J` },
        { label: 'Coefficient of performance', value: Number.isFinite(cop) ? f2(cop) : '—', color: ACCENT, strong: true },
        { label: 'Carnot COP, T_c/(T_h−T_c)', value: f2(copCarnot), color: ACCENT_2 },
        { label: 'Σ ΔU round the loop', value: `${f3(ledger.netDeltaU)} J` },
      ]
    : [
        { label: 'Net work per cycle', value: `${fInt(ledger.netWork)} J`, color: ACCENT, strong: true },
        { label: 'Heat taken in, Q_h', value: `${fInt(ledger.heatAbsorbed)} J` },
        { label: 'Heat dumped, Q_c', value: `${fInt(ledger.heatRejected)} J` },
        { label: 'This cycle’s efficiency', value: Number.isFinite(ledger.efficiency) ? `${f1(ledger.efficiency * 100)} %` : '—', color: ACCENT, strong: true },
        { label: `Carnot ceiling between ${f0(Tlo)} K and ${f0(Thi)} K`, value: `${f1(carnotCeiling * 100)} %`, color: ACCENT_2 },
        ...(kind === 'otto' ? [{ label: '1 − r^(1−γ)', value: `${f1(ottoIdeal * 100)} %` }] : []),
        { label: 'Σ ΔU round the loop', value: `${f3(ledger.netDeltaU)} J` },
      ];

  return (
    <LabFrame
      title={block.title ?? arch.title}
      subtitle={`${arch.id.replace(/-/g, ' ')} · heat engine bench`}
      badge={
        <span className="tabular-nums">
          {kind === 'fridge'
            ? `COP = ${Number.isFinite(cop) ? f2(cop) : '—'}`
            : `η = ${Number.isFinite(ledger.efficiency) ? f1(ledger.efficiency * 100) : '—'} %`}
        </span>
      }
      guided={guided ? {
        steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
        onAdvance: () => setStep((s) => s + 1),
      } : null}
      predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
      canvasAspect={1.5}
      maxCanvasHeight={430}
      renderCanvas={(w, h) => <PvCanvas w={w} h={h} series={series} loop={loop} />}
      legend={legend}
      belowCanvas={
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px]" style={{ color: TEXT.muted }}>
            {legsShown} of {legs.length} strokes assembled{closed ? ' · loop closed' : ' — the loop is not closed yet, so nothing is totalled'}
          </span>
          {defs.some((d) => d.key === 'compare_carnot') && (
            <Toggle on={compareCarnot} label="compare with Carnot" accent={ACCENT_2} onClick={() => setCompareCarnot((v) => !v)} />
          )}
          {defs.some((d) => d.key === 'show_reservoirs') && (
            <Toggle on={showFlows} label="show the heat flows" onClick={() => setShowFlows((v) => !v)} />
          )}
        </div>
      }
      controls={
        <div className="flex flex-col gap-2.5">
          <SectionLabel>Build the engine</SectionLabel>
          {defs.map((d) => {
            if (d.kind === 'number') {
              return (
                <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                  min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.001} unit={d.unit ?? ''}
                  accent={d.key === 'T_cold' || d.key === 'v2' ? ACCENT_2 : ACCENT}
                  format={(v) => ((d.step ?? 1) < 0.01 ? v.toFixed(3) : v.toFixed(1))}
                  onChange={(v) => setC((prev) => ({ ...prev, ...assign(d.key, v, prev) }))} />
              );
            }
            if (d.kind === 'select') {
              return (
                <div key={d.key} className="flex flex-col gap-1">
                  <span className="text-[11px] font-semibold" style={{ color: ACCENT }}>{d.label}</span>
                  <select value={c.freedomLabel}
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
          <Readout rows={readout} footnote="Every number here is summed from the assembled legs. Σ ΔU is the proof the loop really closed." />

          {showFlows && closed && (
            <LedgerBar
              segments={kind === 'fridge'
                ? [
                    { label: 'Q from the box', value: ledger.heatAbsorbed, color: ACCENT },
                    { label: 'W you pay', value: Math.abs(ledger.netWork), color: ACCENT_2 },
                  ]
                : [
                    { label: 'W out (useful)', value: Math.abs(ledger.netWork), color: ACCENT },
                    { label: 'Q_c dumped (unavoidable)', value: ledger.heatRejected, color: ACCENT_2 },
                  ]}
              total={kind === 'fridge' ? ledger.heatRejected : ledger.heatAbsorbed}
              unit="J"
              note={kind === 'fridge'
                ? 'Everything you take out of the box PLUS everything you pay ends up in the room. Q_hot = Q_cold + W — which is why an open fridge door heats a sealed kitchen.'
                : 'The bar is every joule of heat you paid for. Only the first segment leaves as work; the second is the heat you are FORCED to dump to get the gas home.'}
            />
          )}

          {compareCarnot && closed && kind !== 'fridge' && (
            <Card tone="accent">
              <SectionLabel accent={ACCENT}>Can you beat the ceiling?</SectionLabel>
              <div className="mt-2 flex flex-col gap-1">
                <Row label="This cycle" value={`${f1(ledger.efficiency * 100)} %`} color={ACCENT} />
                <Row label={`Carnot, between ${f0(Tlo)} K and ${f0(Thi)} K`} value={`${f1(carnotCeiling * 100)} %`} color={ACCENT_2} />
                <Row label="Gap you have left" value={`${f1((carnotCeiling - ledger.efficiency) * 100)} points`} color={TEXT.primary} />
              </div>
              <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                Move any slider you like — the gap never goes negative. {kind === 'otto'
                  ? 'The Otto cycle loses because it exchanges heat across a RANGE of temperatures on its two constant-volume legs, not at the two extremes.'
                  : 'A Carnot cycle sits exactly on the ceiling, because every one of its heat exchanges happens at constant temperature with no wasted difference.'}
              </p>
            </Card>
          )}

          {kind === 'fridge' && closed && (
            <Card>
              <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                COP is above 1, and that is not a violation of anything — you are not creating energy, you are relocating it.
                Note what happens as you widen the temperature gap: at {f0(c.Thot - c.Tcold)} K apart the Carnot COP is{' '}
                <b style={{ color: ACCENT_2 }}>{f2(copCarnot)}</b>, and it collapses as the gap grows. That is exactly why heat
                pumps struggle in a hard winter.
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

const f0 = (n: number): string => (Number.isFinite(n) ? Math.round(n).toString() : '—');

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[12px]" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="tabular-nums text-[14px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

interface Controls {
  n: number; f: number; freedomLabel: string;
  v1: number; v2: number; ratio: number; T: number; Tpeak: number; Thot: number; Tcold: number;
}

const readControls = (b: ReturnType<typeof resolveParams>): Controls => {
  const label = str(b, 'freedom', '5 — diatomic (air)');
  return {
    n: num(b, 'moles', 1),
    f: leadingInt(label, 5),
    freedomLabel: label,
    v1: num(b, 'v1', 0.02),
    v2: num(b, 'v2', 0.05),
    ratio: num(b, 'ratio', 8),
    T: num(b, 'T', 300),
    Tpeak: num(b, 'T_peak', 1600),
    Thot: num(b, 'T_hot', 500),
    Tcold: num(b, 'T_cold', 300),
  };
};

const numberOf = (c: Controls, key: string): number => {
  switch (key) {
    case 'moles': return c.n;
    case 'v1': return c.v1;
    case 'v2': return c.v2;
    case 'ratio': return c.ratio;
    case 'T': return c.T;
    case 'T_peak': return c.Tpeak;
    case 'T_hot': return c.Thot;
    case 'T_cold': return c.Tcold;
    default: return 0;
  }
};

/**
 * Assignment with the ONE ordering constraint the physics imposes: the cold
 * reservoir cannot be hotter than the hot one. Silently allowing it would make
 * `carnotEfficiency` negative and the bench would print a confident absurdity —
 * the exact failure the Phase-1 verifier caught in the mechanics solver.
 */
const assign = (key: string, v: number, prev: Controls): Partial<Controls> => {
  switch (key) {
    case 'moles': return { n: v };
    case 'v1': return { v1: v };
    case 'v2': return { v2: Math.max(v, prev.v1 * 1.05) };
    case 'ratio': return { ratio: v };
    case 'T': return { T: v };
    case 'T_peak': return { Tpeak: Math.max(v, prev.T * 1.2) };
    case 'T_hot': return { Thot: Math.max(v, prev.Tcold + 10) };
    case 'T_cold': return { Tcold: clamp(v, 10, prev.Thot - 10) };
    default: return {};
  }
};
