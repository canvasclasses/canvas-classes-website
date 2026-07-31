'use client';

/*
 * motion-lab/thermo/BuoyancyLab.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 6: "Float / Sink Lab — buoyancy depends
 * on displaced volume, not object mass" and "Viscosity & Terminal Velocity —
 * terminal velocity is the moment the FBD balances".
 *
 * ── ONE BENCH, BECAUSE IT IS ONE ARGUMENT ───────────────────────────────────
 * Both rungs are a free-body diagram in a fluid, and both resolve the same way:
 * find the state where the arrows sum to zero. Floating is that balance reached
 * by adjusting HOW MUCH IS UNDER WATER; terminal velocity is that balance
 * reached by adjusting HOW FAST IT IS GOING. Drawing them with the same arrows,
 * on the same bench, is what makes the second one feel inevitable rather than
 * like a new formula — which is precisely the FBD Studio idea (§5.1) carried
 * into fluids, and this file says so on screen.
 *
 * ── WHAT MAKES IT MORE THAN A DIAGRAM ───────────────────────────────────────
 * The object is DRAGGED into the tank. On the way down the upthrust arrow grows
 * in step with how much has gone under — not with anything about the object —
 * so the student can watch buoyancy be about displaced volume before being told
 * it is. Let go and it settles at ρ_obj/ρ_fluid submerged, computed by
 * `floatOrSink()` from those two densities alone.
 *
 * On the terminal-velocity rung the three arrows are drawn live from the same
 * `fallToTerminal()` integration that draws the v-t curve, so the instant the
 * arrows close is exactly the instant the curve flattens. There is no separate
 * "now it is terminal" flag anywhere.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { ThermoArchetype } from './types';
import * as F from './lib/fluids';
import { makePlot, polyline, px, py, type Plot } from '../waves/lib/plot';
import { resolveParams, num, bool, controlDefs, bagKey } from '../waves/lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { Arrow, Handle, PlotFrame, svgPoint, GRAB_CSS_PX } from '../waves/svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, LedgerBar, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, accentTint,
  clamp, f1, f2, f3, fInt, type LegendRow, type ReadoutRow,
} from '../waves/ui';

const MAX_STAGE = 3;

export default function BuoyancyLab({ block, arch }: { block: MotionBenchBlock; arch: ThermoArchetype }) {
  const isTerminal = arch.id === 'terminal-velocity';
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [showForces, setShowForces] = useState(() => bool(authored, 'show_forces', true));
  const [showGraph, setShowGraph] = useState(() => bool(authored, 'show_graph', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); setT(0); setPlaying(false); setHeld(null); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount
  const [everRan, setEverRan] = useState(false);
  /** How far the student has pushed the object under, 0…1. null = released. */
  const [held, setHeld] = useState<number | null>(null);
  const [grabbed, setGrabbed] = useState(false);
  const [touched, setTouched] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);

  // ── the physics ───────────────────────────────────────────────────────────
  const volume = isTerminal ? (4 / 3) * Math.PI * c.radius ** 3 : c.volume;
  const result = F.floatOrSink(c.mass, volume, c.rho);
  const density = F.densityOf(c.mass, volume);

  const vTerm = F.terminalVelocityStokes(c.mass, volume, c.radius, c.eta, c.rho);
  const tau = F.terminalTimeConstant(c.mass, c.radius, c.eta);
  const fall = useMemo(
    () => (isTerminal ? F.fallToTerminal(c.mass, volume, c.radius, c.eta, c.rho, Math.max(tau * 6, 0.5)) : []),
    [isTerminal, c.mass, volume, c.radius, c.eta, c.rho, tau]
  );
  const tMax = fall.length ? fall[fall.length - 1].t : 1;
  const nowFall = sampleFall(fall, t);

  useAnimationFrame((dt) => setT((p) => Math.min(tMax, p + dt)), { enabled: playing && isTerminal, target: wrapRef });
  useEffect(() => { if (playing && t >= tMax - 1e-6) setPlaying(false); }, [playing, t, tMax]);

  // The live submerged fraction: what the student is holding, or where it settles.
  const submerged = isTerminal ? 1 : (held ?? result.submergedFraction);
  const liveBuoyancy = F.buoyantForce(c.rho, volume * submerged);
  const weight = c.mass * F.G0;

  // Terminal-velocity forces at this instant, from the SAME integration the
  // graph plots — the arrows and the curve cannot disagree.
  const dragNow = isTerminal ? 6 * Math.PI * c.eta * c.radius * nowFall.speed : 0;
  const upthrust = isTerminal ? F.buoyantForce(c.rho, volume) : liveBuoyancy;
  const netNow = weight - upthrust - dragNow;

  const ready = misconceptionReady(arch.targets, {
    stage, everRan, touched, closed: isTerminal && nowFall.speed > vTerm * 0.9,
  });

  // ── legend + readout ──────────────────────────────────────────────────────
  const legend: LegendRow[] = isTerminal
    ? [
        { color: 'rgba(255,255,255,0.85)', label: 'Weight, mg', value: `${f3(weight)} N`, strong: true },
        { color: ACCENT_2, label: 'Upthrust, ρ_f V g', value: `${f3(upthrust)} N` },
        { color: ACCENT, label: 'Viscous drag, 6πηrv', value: `${f3(dragNow)} N`, strong: true },
        { color: 'rgba(255,255,255,0.45)', label: 'Net (down)', value: `${f3(netNow)} N` },
      ]
    : [
        { color: 'rgba(255,255,255,0.85)', label: 'Weight, mg', value: `${f2(weight)} N`, strong: true },
        { color: ACCENT_2, label: 'Upthrust, ρ_f V_displaced g', value: `${f2(liveBuoyancy)} N`, strong: true },
        { color: ACCENT, label: 'Submerged', value: `${f1(submerged * 100)} %` },
      ];

  const readout: ReadoutRow[] = isTerminal
    ? [
        { label: 'Terminal velocity', value: `${f3(vTerm)} m/s`, color: ACCENT, strong: true },
        { label: 'Speed now', value: `${f3(nowFall.speed)} m/s`, color: ACCENT_2 },
        { label: 'Net force now', value: `${f3(netNow)} N` },
        { label: 'Time constant τ = m/6πηr', value: `${f3(tau)} s` },
        { label: 'Closed form v_t(1 − e^(−t/τ))', value: `${f3(F.terminalApproach(vTerm, tau, t))} m/s` },
        { label: 'Reynolds number ρvd/η', value: `${f1((c.rho * nowFall.speed * 2 * c.radius) / Math.max(c.eta, 1e-9))}` },
      ]
    : [
        { label: 'Object density', value: `${fInt(density)} kg/m³`, color: ACCENT, strong: true },
        { label: 'Fluid density', value: `${fInt(c.rho)} kg/m³`, color: ACCENT_2 },
        { label: 'Density ratio', value: `${f3(density / c.rho)}` },
        { label: 'It settles with', value: `${f1(result.submergedFraction * 100)} % under`, strong: true },
        { label: 'Weight', value: `${f2(weight)} N` },
        { label: 'Apparent weight fully under', value: `${f2(result.apparentWeight)} N` },
      ];

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · buoyancy lab`}
        badge={<span className="tabular-nums">{isTerminal ? `v = ${f3(nowFall.speed)} m/s` : result.floats ? 'floats' : 'sinks'}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={isTerminal ? 1.2 : 1.35}
        maxCanvasHeight={430}
        frozen={grabbed}
        renderCanvas={(w, h) => (
          <TankCanvas
            w={w} h={h} isTerminal={isTerminal}
            submerged={submerged} floats={result.floats} sinkDepth={isTerminal ? nowFall.depth : 0}
            weight={weight} upthrust={upthrust} drag={dragNow}
            showForces={showForces && stage >= 1}
            hint={!touched && stage >= 1 && !isTerminal}
            onGrab={(v) => { setHeld(v); setTouched(true); setEverRan(true); }}
            onGrabState={setGrabbed}
            grabbed={grabbed}
          />
        )}
        legend={legend}
        belowCanvas={
          <>
            <div className="flex flex-wrap items-center gap-3">
              {isTerminal ? (
                <>
                  <ActionButton onClick={() => { setPlaying((p) => !p); setEverRan(true); }} disabled={stage < MAX_STAGE}>
                    {playing ? '❚❚ Pause' : t > 0 ? '▶ Continue' : '▶ Release it'}
                  </ActionButton>
                  <ActionButton accent={ACCENT_2} onClick={() => { setPlaying(false); setT(0); }} disabled={stage < MAX_STAGE}>
                    ↺ Back to the surface
                  </ActionButton>
                  <div className="flex flex-1 items-center gap-2" style={{ minWidth: 180 }}>
                    <input type="range" min={0} max={tMax} step={tMax / 400} value={Math.min(t, tMax)}
                      onChange={(e) => { setPlaying(false); setT(parseFloat(e.target.value)); setEverRan(true); }}
                      disabled={stage < MAX_STAGE} aria-label="Step through the fall" className="flex-1"
                      style={{ accentColor: ACCENT, minHeight: 44, touchAction: 'none' }} />
                    <span className="tabular-nums text-[12px] font-semibold" style={{ color: TEXT.ghost, minWidth: 74, textAlign: 'right' }}>
                      {f2(t)} / {f2(tMax)} s
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <ActionButton accent={ACCENT_2} onClick={() => { setHeld(null); setEverRan(true); }} disabled={held === null}>
                    Let go
                  </ActionButton>
                  <span className="text-[11px]" style={{ color: TEXT.muted }}>
                    {touched ? 'Push it under and watch the upthrust grow, then let go.' : '👆 Drag the object down into the fluid.'}
                  </span>
                </>
              )}
              <Toggle on={showForces} label="draw the free-body diagram" onClick={() => setShowForces((v) => !v)} />
              {isTerminal && (
                <Toggle on={showGraph} label="plot speed against time" accent={ACCENT_2} onClick={() => setShowGraph((v) => !v)} />
              )}
            </div>

            {isTerminal && showGraph && stage >= 2 && (
              <SpeedGraph fall={fall} vTerm={vTerm} tNow={t} />
            )}
          </>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set it up</SectionLabel>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.001} unit={d.unit ?? ''}
                accent={d.key === 'rho' || d.key === 'eta' ? ACCENT_2 : ACCENT}
                format={(v) => ((d.step ?? 1) < 0.01 ? v.toFixed(4) : v.toFixed(2))}
                onChange={(v) => { setC((prev) => ({ ...prev, ...assign(d.key, v) })); setT(0); setPlaying(false); }} />
            ) : null)}
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote={isTerminal
              ? 'Arrows and curve come from ONE integration by the frozen E2 RK4. There is no separate “now it is terminal” flag — the curve flattens exactly when the arrows close.'
              : 'The settled fraction is computed from the two densities alone. The object’s mass is not an argument to buoyantForce() — check the signature.'} />

            {stage >= 2 && showForces && (
              <LedgerBar
                segments={isTerminal
                  ? [
                      { label: 'Upthrust', value: upthrust, color: ACCENT_2 },
                      { label: 'Drag', value: dragNow, color: ACCENT },
                      { label: 'Net still unbalanced', value: Math.max(netNow, 0), color: 'rgba(255,255,255,0.75)' },
                    ]
                  : [
                      { label: 'Upthrust so far', value: liveBuoyancy, color: ACCENT_2 },
                      { label: 'Still unsupported', value: Math.max(weight - liveBuoyancy, 0), color: 'rgba(255,255,255,0.75)' },
                    ]}
                total={weight}
                unit="N"
                note={isTerminal
                  ? `The bar is the WEIGHT. Terminal velocity is the instant the first two segments fill it — right now ${f1((1 - Math.max(netNow, 0) / weight) * 100)}% of the way there.`
                  : `The bar is the WEIGHT. It floats at the depth where the upthrust segment fills it exactly — ${f1(result.submergedFraction * 100)}% under.`}
              />
            )}

            {!isTerminal && stage >= 3 && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>Change the mass without changing the volume</SectionLabel>
                <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  At {f2(c.mass)} kg in {f3(volume)} m³ the density is {fInt(density)} kg/m³, so it sits{' '}
                  <b style={{ color: ACCENT }}>{f1(result.submergedFraction * 100)}%</b> under. Doubling the mass doubles the
                  density and doubles the submerged fraction — until the ratio passes 1, and then no amount of hull is left
                  to push more water aside. That threshold is the whole of “floats or sinks”.
                </p>
              </Card>
            )}

            {isTerminal && stage >= 3 && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>The same move as the FBD Studio</SectionLabel>
                <p className="mt-2 text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  Set ΣF = 0 and solve for the unknown. Here the unknown happens to be a speed rather than a tension, so
                  mg = ρ_f V g + 6πηr·v rearranges to v_t = {f3(vTerm)} m/s. Nothing about the method changed —
                  which is why a parachutist, a raindrop and this ball bearing are one question.
                </p>
                {(c.rho * nowFall.speed * 2 * c.radius) / Math.max(c.eta, 1e-9) > 1 && (
                  <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.muted }}>
                    Reynolds number is {f1((c.rho * nowFall.speed * 2 * c.radius) / Math.max(c.eta, 1e-9))} — Stokes’ law
                    strictly wants it well below 1. Above that the real drag turns quadratic and v_t is an over-estimate.
                    Naming the regime is part of the physics, not a footnote.
                  </p>
                )}
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

// ── the tank (zero <text>) ───────────────────────────────────────────────────

function TankCanvas({
  w, h, isTerminal, submerged, floats, sinkDepth, weight, upthrust, drag, showForces, hint,
  onGrab, onGrabState, grabbed,
}: {
  w: number; h: number; isTerminal: boolean;
  submerged: number; floats: boolean; sinkDepth: number;
  weight: number; upthrust: number; drag: number;
  showForces: boolean; hint: boolean;
  onGrab: (fraction: number) => void;
  onGrabState: (v: boolean) => void;
  grabbed: boolean;
}) {
  const surfaceY = h * 0.26;
  const bottomY = h * 0.94;
  const size = Math.min(w, h) * 0.13;
  const depthPx = isTerminal
    ? clamp(surfaceY + sinkDepth * (h * 0.06), surfaceY, bottomY - size)
    : surfaceY - size / 2 + submerged * size;
  const cx = w * 0.34;
  const cy = depthPx;

  // One px-per-newton for all three arrows, so their lengths are comparable —
  // an affine map with an offset would make a 2× force look like 1.3×, which
  // the Phase-1 audit called out as worse than drawing no arrow at all.
  const pxPerN = (h * 0.22) / Math.max(weight, 1e-9);

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (isTerminal) return;
    const p = svgPoint(e, w, h);
    if (!p) return;
    if (Math.hypot(p.x - cx, p.y - cy) * p.fit > GRAB_CSS_PX + size / 2) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    onGrabState(true);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed || isTerminal) return;
    const p = svgPoint(e, w, h);
    if (!p) return;
    onGrab(clamp((p.y - surfaceY + size / 2) / size, 0, 1));
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    onGrabState(false);
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
      style={{ display: 'block', touchAction: 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {/* the tank and the fluid */}
      <rect x={w * 0.08} y={surfaceY} width={w * 0.84} height={bottomY - surfaceY}
        fill={accentTint(ACCENT_2, 0.16)} stroke={ACCENT_2} strokeWidth={1.5} />
      <line x1={w * 0.08} y1={surfaceY} x2={w * 0.92} y2={surfaceY} stroke={ACCENT_2} strokeWidth={2.5} />
      <line x1={w * 0.08} y1={surfaceY} x2={w * 0.08} y2={bottomY} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      <line x1={w * 0.92} y1={surfaceY} x2={w * 0.92} y2={bottomY} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
      <line x1={w * 0.08} y1={bottomY} x2={w * 0.92} y2={bottomY} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />

      {/* the object */}
      {isTerminal ? (
        <circle cx={cx} cy={cy} r={size * 0.42} fill={accentTint(ACCENT, 0.5)} stroke={ACCENT} strokeWidth={2.5} />
      ) : (
        <rect x={cx - size / 2} y={cy - size / 2} width={size} height={size} rx={4}
          fill={accentTint(ACCENT, floats ? 0.45 : 0.28)} stroke={ACCENT} strokeWidth={2.5} />
      )}

      {/* the displaced-volume shading — the ONLY thing upthrust depends on */}
      {!isTerminal && submerged > 0 && (
        <rect x={cx - size / 2} y={Math.max(cy - size / 2, surfaceY)}
          width={size} height={Math.max(0, Math.min(cy + size / 2, bottomY) - Math.max(cy - size / 2, surfaceY))}
          fill={accentTint(ACCENT_2, 0.4)} stroke="none" />
      )}

      {/* the free-body diagram, one shared px-per-newton */}
      {showForces && (
        <g style={{ pointerEvents: 'none' }}>
          <Arrow x1={cx} y1={cy} x2={cx} y2={cy + weight * pxPerN} color="rgba(255,255,255,0.85)" width={3} />
          <Arrow x1={cx} y1={cy} x2={cx} y2={cy - upthrust * pxPerN} color={ACCENT_2} width={3} />
          {isTerminal && (
            <Arrow x1={cx + 14} y1={cy} x2={cx + 14} y2={cy - drag * pxPerN} color={ACCENT} width={3} />
          )}
        </g>
      )}

      {!isTerminal && (
        <Handle x={cx} y={cy} color={accentTint(ACCENT, 0.9)} r={Math.max(7, size * 0.2)} hint={hint} />
      )}
    </svg>
  );
}

// ── speed against time ───────────────────────────────────────────────────────

function SpeedGraph({ fall, vTerm, tNow }: { fall: F.FallState[]; vTerm: number; tNow: number }) {
  const W = 320;
  const H = 92;
  if (fall.length < 2) return null;
  const tMax = fall[fall.length - 1].t;
  const plot: Plot = makePlot(W, H, { xMin: 0, xMax: tMax, yMin: 0, yMax: vTerm * 1.15 },
    { l: 10, r: 10, t: 8, b: 10 }, 0.02);
  const pts = fall.filter((_, i) => i % 6 === 0).map((s) => ({ x: s.t, y: s.speed }));

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          Speed against time
        </span>
        <span className="text-[11px]" style={{ color: TEXT.muted }}>
          flattening onto v_t = {f3(vTerm)} m/s · 0 → {f2(tMax)} s
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        style={{ width: '100%', height: H, display: 'block', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
        <PlotFrame plot={plot} xTicks={5} yTicks={3} zeroLine={false} />
        <line x1={px(plot, 0)} y1={py(plot, vTerm)} x2={px(plot, tMax)} y2={py(plot, vTerm)}
          stroke={ACCENT_2} strokeWidth={1.5} strokeDasharray="6 4" />
        <path d={polyline(plot, pts)} fill="none" stroke={ACCENT} strokeWidth={2.4} />
        <line x1={px(plot, Math.min(tNow, tMax))} y1={py(plot, plot.yMax)} x2={px(plot, Math.min(tNow, tMax))} y2={py(plot, plot.yMin)}
          stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}

// ── plumbing ─────────────────────────────────────────────────────────────────

interface Controls { mass: number; volume: number; rho: number; eta: number; radius: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  mass: num(b, 'object_mass', 0.6),
  volume: num(b, 'object_volume', 0.001),
  rho: num(b, 'rho', 1000),
  eta: num(b, 'eta', 1),
  radius: num(b, 'radius', 0.005),
});

const numberOf = (c: Controls, key: string): number => {
  switch (key) {
    case 'object_mass': return c.mass;
    case 'object_volume': return c.volume;
    case 'rho': return c.rho;
    case 'eta': return c.eta;
    case 'radius': return c.radius;
    default: return 0;
  }
};

const assign = (key: string, v: number): Partial<Controls> => {
  switch (key) {
    case 'object_mass': return { mass: v };
    case 'object_volume': return { volume: v };
    case 'rho': return { rho: v };
    case 'eta': return { eta: v };
    case 'radius': return { radius: v };
    default: return {};
  }
};

const sampleFall = (fall: F.FallState[], t: number): F.FallState => {
  if (!fall.length) return { t: 0, depth: 0, speed: 0, net: 0 };
  const last = fall[fall.length - 1];
  if (t >= last.t) return last;
  const dt = fall.length > 1 ? fall[1].t - fall[0].t : 1;
  const i = clamp(Math.floor(t / Math.max(dt, 1e-9)), 0, fall.length - 2);
  const a = fall[i];
  const b = fall[i + 1];
  const f = b.t > a.t ? (t - a.t) / (b.t - a.t) : 0;
  return {
    t,
    depth: a.depth + (b.depth - a.depth) * f,
    speed: a.speed + (b.speed - a.speed) * f,
    net: a.net + (b.net - a.net) * f,
  };
};

function misconceptionReady(code: string, x: {
  stage: number; everRan: boolean; touched: boolean; closed: boolean;
}): boolean {
  switch (code) {
    // They have to have pushed it under and watched the upthrust grow.
    case 'buoyancy_depends_on_object_mass':
      return x.touched && x.stage >= 2;
    // The arrows have to have visibly closed.
    case 'terminal_velocity_means_no_forces':
      return x.closed && x.stage >= 2;
    default:
      return x.stage >= MAX_STAGE && x.everRan;
  }
}
