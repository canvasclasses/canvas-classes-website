'use client';

/*
 * motion-lab/thermo/FluidBench.tsx — the fluids flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 6: "Fluid Bench (pipe with draggable
 * cross-sections, Bernoulli ledger) — pressure drops where speed rises, the
 * counter-intuitive one."
 *
 * ── HOW A COUNTER-INTUITIVE RESULT IS MADE UNAVOIDABLE ──────────────────────
 * Telling a student "pressure falls where the pipe narrows" loses to their
 * intuition every time, because their intuition has a mechanism ("it is being
 * squeezed") and the sentence does not. So the bench builds the mechanism
 * instead, in two steps the student already believes:
 *
 *   1. Nothing can pile up in a rigid full pipe, so A₁v₁ = A₂v₂. Narrow means
 *      faster. Everyone accepts this.
 *   2. P + ½ρv² + ρgh is the same at every station. The ledger draws those
 *      three as a stacked bar whose TOTAL does not move while the pieces trade.
 *      Drag the throat thinner: the ½ρv² block grows and the P block shrinks by
 *      exactly the same amount, in front of them.
 *
 * The conclusion is then something they watched happen rather than something
 * they were told, and the ledger's refusal to move is the argument.
 *
 * ── EVERY NUMBER IS DERIVED, SO NOTHING CAN DISAGREE ────────────────────────
 * `solvePipe()` takes the geometry, ONE inlet speed and ONE inlet pressure, and
 * derives every downstream speed from continuity and every downstream pressure
 * from Bernoulli. There is no station whose three numbers are stored
 * independently, so dragging cannot produce an inconsistent pipe. The verifier
 * checks A₁v₁ = A₂v₂ and the Bernoulli constant at every station to 1e-9.
 *
 * ── AND IT REFUSES TO DRAW THE IMPOSSIBLE ───────────────────────────────────
 * Squeeze the throat far enough and the required ½ρv² exceeds the available
 * head, so the absolute pressure would have to go negative. That is cavitation,
 * it is real, and `solvePipe` returns null rather than drawing it. The bench
 * says so. A sim that quietly plots a negative pressure has taught something
 * false at the exact moment the student was paying most attention.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { ThermoArchetype } from './types';
import * as F from './lib/fluids';
import { resolveParams, num, bool, controlDefs, bagKey } from '../waves/lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { Arrow, Handle, svgPoint, GRAB_CSS_PX } from '../waves/svgparts';
import {
  LabFrame, Card, Toggle, Readout, LedgerBar, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, accentTint,
  clamp, f1, f2, f3, fInt, type LegendRow, type ReadoutRow,
} from '../waves/ui';

const MAX_STAGE = 3;
/** Pipe length in metres — only a drawing scale; the physics is in the areas. */
const PIPE_L = 3;

export default function FluidBench({ block, arch }: { block: MotionBenchBlock; arch: ThermoArchetype }) {
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [showLedger, setShowLedger] = useState(() => bool(authored, 'show_ledger', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [grab, setGrab] = useState<0 | 1 | 2 | null>(null);
  const [touched, setTouched] = useState(false);
  const [flow, setFlow] = useState(0);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount

  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => setFlow((p) => (p + dt) % 100), { enabled: playing, target: wrapRef });

  // ── the pipe ──────────────────────────────────────────────────────────────
  // The throat only exists once the guided script has introduced it — before
  // that the pipe is uniform and every gauge reads the same, which is the "no
  // effect yet" baseline the whole exercise is measured against.
  const throatR = stage >= 1 ? c.r2 : c.r1;
  const geometry = [
    { x: 0, radius: c.r1, height: 0 },
    { x: PIPE_L * 0.42, radius: throatR, height: c.h2 },
    { x: PIPE_L, radius: c.r3, height: 0 },
  ];
  const stations = F.solvePipe(geometry, c.v1, c.p1 * 1000, c.rho);
  const cavitating = stations === null;

  const inletTerms = F.bernoulliTerms(c.p1 * 1000, c.rho, c.v1, 0);
  const Q = F.flowRate(F.areaOfRadius(c.r1), c.v1);

  const ready = touched && stage >= 2 && !cavitating;

  // ── drag the cross-sections ───────────────────────────────────────────────
  const geomRef = useRef<{ w: number; h: number; ox: number; scaleX: number; scaleR: number; midY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const radiusOf = (i: 0 | 1 | 2): number => (i === 0 ? c.r1 : i === 1 ? throatR : c.r3);
  const handleAt = (i: 0 | 1 | 2): { x: number; y: number } => {
    const g = geomRef.current;
    if (!g) return { x: 0, y: 0 };
    return { x: g.ox + geometry[i].x * g.scaleX, y: g.midY - geometry[i].height * 12 - radiusOf(i) * g.scaleR };
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = geomRef.current;
    if (!g || stage < 1) return;
    const p = svgPoint(e, g.w, g.h);
    if (!p) return;
    for (const i of [0, 1, 2] as const) {
      const h = handleAt(i);
      if (Math.hypot(p.x - h.x, p.y - h.y) * p.fit <= GRAB_CSS_PX) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setGrab(i);
        setTouched(true);
        return;
      }
    }
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const g = geomRef.current;
    if (grab === null || !g) return;
    const p = svgPoint(e, g.w, g.h);
    if (!p) return;
    const r = clamp((g.midY - geometry[grab].height * 12 - p.y) / g.scaleR, 0.01, 0.12);
    setC((prev) => (grab === 0 ? { ...prev, r1: r } : grab === 1 ? { ...prev, r2: r } : { ...prev, r3: r }));
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (grab === null) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    setGrab(null);
  };

  // ── legend + readout ──────────────────────────────────────────────────────
  const s0 = stations?.[0];
  const s1 = stations?.[1];
  const s2 = stations?.[2];

  const legend: LegendRow[] = [
    { color: ACCENT, label: 'Flow speed', value: s1 ? `${f2(s0!.speed)} → ${f2(s1.speed)} → ${f2(s2!.speed)} m/s` : '—', strong: true },
    { color: ACCENT_2, label: 'Gauge pressure', value: s1 ? `${fInt(s0!.pressure / 1000)} → ${fInt(s1.pressure / 1000)} → ${fInt(s2!.pressure / 1000)} kPa` : '—', strong: true },
    { color: 'rgba(255,255,255,0.45)', label: 'Gauge height ∝ pressure at that station' },
  ];

  const readout: ReadoutRow[] = s1
    ? [
        { label: 'Flow rate Q = Av', value: `${f3(Q)} m³/s`, color: ACCENT, strong: true },
        { label: 'Same Q at the throat', value: `${f3(F.flowRate(s1.area, s1.speed))} m³/s`, color: ACCENT_2 },
        { label: 'Area ratio A₁/A₂', value: `${f2(s0!.area / s1.area)} ×` },
        { label: 'Speed ratio v₂/v₁', value: `${f2(s1.speed / s0!.speed)} ×` },
        { label: 'Pressure change at the throat', value: `${fInt((s1.pressure - s0!.pressure) / 1000)} kPa`, color: ACCENT_2 },
        { label: 'Bernoulli constant, inlet', value: `${fInt(s0!.terms.total / 1000)} kPa` },
        { label: 'Bernoulli constant, throat', value: `${fInt(s1.terms.total / 1000)} kPa` },
      ]
    : [{ label: 'The pipe cannot carry this flow', value: 'cavitation', color: ACCENT_2, strong: true }];

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · fluid bench`}
        badge={<span className="tabular-nums">{s1 ? `Δ P = ${fInt((s1.pressure - (s0?.pressure ?? 0)) / 1000)} kPa` : 'cavitating'}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={2.0}
        maxCanvasHeight={380}
        frozen={grab !== null}
        renderCanvas={(w, h) => {
          const ox = w * 0.06;
          const scaleX = (w * 0.88) / PIPE_L;
          const scaleR = Math.min(h * 0.3 / 0.12, 900);
          const midY = h * 0.62;
          geomRef.current = { w, h, ox, scaleX, scaleR, midY };

          const wall = (sign: 1 | -1): string =>
            geometry.map((g, i) => {
              const x = ox + g.x * scaleX;
              const y = midY - g.height * 12 - sign * radiusOf(i as 0 | 1 | 2) * scaleR;
              return `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
            }).join('');

          const body = `${wall(1)}${geometry.slice().reverse().map((g, k) => {
            const i = (geometry.length - 1 - k) as 0 | 1 | 2;
            const x = ox + g.x * scaleX;
            const y = midY - g.height * 12 + radiusOf(i) * scaleR;
            return `L${x.toFixed(1)},${y.toFixed(1)}`;
          }).join('')}Z`;

          const maxP = Math.max(1, ...(stations ?? []).map((s) => s.pressure));

          return (
            <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
              style={{ display: 'block', touchAction: 'none' }}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              {/* the fluid */}
              <path d={body} fill={accentTint(ACCENT, cavitating ? 0.06 : 0.16)} stroke={ACCENT} strokeWidth={2} />

              {/* streamline dots — spacing is the speed, so the throat visibly
                  fires them through faster than the wide sections */}
              {playing && stations && [0.18, 0.42, 0.66, 0.9].map((lane) =>
                Array.from({ length: 14 }, (_, k) => {
                  const phase = (flow * 0.5 + k / 14) % 1;
                  const xs = phase * PIPE_L;
                  const i = xs < PIPE_L * 0.42 ? 0 : 1;
                  const t = i === 0 ? xs / (PIPE_L * 0.42) : (xs - PIPE_L * 0.42) / (PIPE_L * 0.58);
                  const r = radiusOf(i as 0 | 1) + (radiusOf((i + 1) as 1 | 2) - radiusOf(i as 0 | 1)) * t;
                  const hh = (geometry[i].height + (geometry[i + 1].height - geometry[i].height) * t) * 12;
                  return (
                    <circle key={`${lane}-${k}`} cx={ox + xs * scaleX}
                      cy={midY - hh + (lane - 0.54) * 2 * r * scaleR} r={2.2}
                      fill="rgba(255,255,255,0.55)" />
                  );
                })
              )}

              {/* the gauges: a column whose height IS the static pressure */}
              {stations && stage >= 2 && stations.map((s, i) => {
                const x = ox + s.x * scaleX;
                const top = midY - s.height * 12 - radiusOf(i as 0 | 1 | 2) * scaleR;
                const col = Math.max(4, (s.pressure / maxP) * h * 0.34);
                return (
                  <g key={`g${i}`} style={{ pointerEvents: 'none' }}>
                    <rect x={x - 7} y={top - col - 8} width={14} height={col} rx={3}
                      fill={accentTint(ACCENT_2, 0.45)} stroke={ACCENT_2} strokeWidth={1.5} />
                    <line x1={x} y1={top} x2={x} y2={top - 8} stroke={ACCENT_2} strokeWidth={2} />
                  </g>
                );
              })}

              {/* speed arrows, one shared px-per-unit so they are comparable */}
              {stations && stage >= 1 && stations.map((s, i) => (
                <Arrow key={`v${i}`} x1={ox + s.x * scaleX - 18} y1={midY - s.height * 12}
                  x2={ox + s.x * scaleX - 18 + s.speed * (w * 0.035)} y2={midY - s.height * 12}
                  color={ACCENT} width={3} />
              ))}

              {/* the three cross-section handles */}
              {([0, 1, 2] as const).map((i) => (
                <Handle key={`h${i}`} {...handleAt(i)} color={accentTint(ACCENT, 0.9)} r={8}
                  hint={!touched && stage >= 1 && i === 1} />
              ))}
            </svg>
          );
        }}
        legend={legend}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <Toggle on={playing} label="run the flow" onClick={() => setPlaying((p) => !p)} />
            <Toggle on={showLedger} label="show the Bernoulli ledger" accent={ACCENT_2} onClick={() => setShowLedger((v) => !v)} />
            <span className="text-[11px]" style={{ color: TEXT.muted }}>
              {touched ? 'Drag any of the three cross-sections.' : '👆 Drag the middle cross-section down to narrow the pipe.'}
            </span>
          </div>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Shape the pipe</SectionLabel>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.005} unit={d.unit ?? ''}
                accent={d.key === 'r2' || d.key === 'h2' ? ACCENT_2 : ACCENT}
                format={(v) => ((d.step ?? 1) < 0.01 ? v.toFixed(3) : v.toFixed(1))}
                onChange={(v) => setC((prev) => ({ ...prev, ...assign(d.key, v) }))} />
            ) : null)}
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote="Every downstream number is DERIVED — continuity fixes the speeds, Bernoulli fixes the pressures. There is no station whose numbers can disagree with each other." />

            {showLedger && s1 && stage >= 2 && (
              <>
                <LedgerBar
                  segments={[
                    { label: 'P', value: s0!.terms.pressure / 1000, color: ACCENT_2 },
                    { label: '½ρv²', value: s0!.terms.dynamic / 1000, color: ACCENT },
                    { label: 'ρgh', value: s0!.terms.gravity / 1000, color: 'rgba(255,255,255,0.75)' },
                  ]}
                  total={s0!.terms.total / 1000}
                  unit="kPa"
                  note="At the WIDE inlet. All three terms are pressures, which is why they can share one bar."
                />
                <LedgerBar
                  segments={[
                    { label: 'P', value: s1.terms.pressure / 1000, color: ACCENT_2 },
                    { label: '½ρv²', value: s1.terms.dynamic / 1000, color: ACCENT },
                    { label: 'ρgh', value: s1.terms.gravity / 1000, color: 'rgba(255,255,255,0.75)' },
                  ]}
                  total={s1.terms.total / 1000}
                  unit="kPa"
                  note={`At the THROAT. The ½ρv² block grew by ${fInt((s1.terms.dynamic - s0!.terms.dynamic) / 1000)} kPa and the P block shrank by ${fInt((s0!.terms.pressure - s1.terms.pressure) / 1000)} kPa. Same total, to the pascal.`}
                />
              </>
            )}

            {cavitating && (
              <Card tone="bad">
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  This throat is too tight for this flow: the ½ρv² needed there is larger than the whole pressure head
                  available, so the static pressure would have to go negative. Real water does not do that — it boils at
                  room temperature and the flow breaks up. That is cavitation, and it is why pump inlets are wide.
                  Nothing is drawn past this point, because there is nothing true to draw.
                </p>
              </Card>
            )}

            {s1 && stage >= 3 && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>Why the drop is so big</SectionLabel>
                <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  The radius fell by a factor of {f2(c.r1 / Math.max(throatR, 1e-6))}, so the AREA fell by{' '}
                  {f2((c.r1 / Math.max(throatR, 1e-6)) ** 2)} and the speed rose by the same factor. But ½ρv² goes as the
                  SQUARE of that — {f2((c.r1 / Math.max(throatR, 1e-6)) ** 4)}× — which is why a modest-looking
                  constriction produces a pressure drop nobody expects.
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
    </div>
  );
}

interface Controls { r1: number; r2: number; r3: number; v1: number; p1: number; h2: number; rho: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  r1: num(b, 'r1', 0.06),
  r2: num(b, 'r2', 0.03),
  r3: num(b, 'r3', 0.06),
  v1: num(b, 'v1', 1.2),
  p1: num(b, 'p1', 150),
  h2: num(b, 'h2', 0),
  rho: num(b, 'rho', 1000),
});

const numberOf = (c: Controls, key: string): number =>
  (c as unknown as Record<string, number>)[key] ?? 0;

const assign = (key: string, v: number): Partial<Controls> => {
  switch (key) {
    case 'r1': return { r1: v };
    case 'r2': return { r2: v };
    case 'r3': return { r3: v };
    case 'v1': return { v1: v };
    case 'p1': return { p1: v };
    case 'h2': return { h2: v };
    case 'rho': return { rho: v };
    default: return {};
  }
};
