'use client';

/*
 * motion-lab/waves/ShmBench.tsx — the oscillations flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 8: "SHM Bench (spring/pendulum + the
 * circle-of-reference projection side by side) — SHM is the shadow of uniform
 * circular motion."
 *
 * ── WHAT MAKES THIS MORE THAN A MOVING DIAGRAM ──────────────────────────────
 *
 * 1. THE STUDENT IS THE AUTHOR. The primary gesture is DRAGGING THE BLOCK out
 *    to set the amplitude, or DRAGGING THE BOB to set the release angle. The
 *    sliders exist, but the physical thing is the handle — and a drag works
 *    whether the oscillator is playing, paused, finished or never started.
 *
 * 2. IT GRADES REASONING. Each archetype opens with a predict gate that has one
 *    reply per option, and its named misconception is contradicted only once
 *    the evidence for the contradiction is on screen.
 *
 * 3. IT SHOWS THE INVISIBLE MIDDLE STEP. The reference circle is not an
 *    illustration bolted on beside the spring — the point on the circle and the
 *    block are driven by the SAME `circleProjection()` call, so the dashed
 *    projection line is a fact rather than a drawing. `verify-motion-phase2.mjs`
 *    asserts the two agree to 1e-12 across a whole period.
 *    For the pendulum the invisible step is different and just as important:
 *    the pale ghost bob is running the small-angle formula while the solid one
 *    runs the real θ̈ = −(g/l)sin θ. Past ~15° they visibly drift apart, and the
 *    "approximation" stops being a word and becomes a gap you can watch open.
 *
 * 4. IT COMPOSES. Every path is integrated by the frozen `step`/`integrate`
 *    from `../lib/integrate.ts` — the same RK4 the projectile and circular
 *    modules use. There is no second integrator in Phase 2.
 *
 * 5. IT IS GUIDED, NEVER AUTO-PLAYING. `playing` starts FALSE, always, and the
 *    play control is disabled until the guided ladder has finished explaining
 *    what is about to move. The Circular Arena broke this at the top of the
 *    file that quoted it; this bench does not.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { WavesArchetype } from './types';
import * as S from './lib/shm';
import { makePlot, polyline, px, py, type Plot } from './lib/plot';
import { resolveParams, num, bool, controlDefs, bagKey, declares } from './lib/resolve';
import { springScene, pendulumScene, aspectOf } from './lib/scenes';
import { fitView, worldToScreen, boundsOf, padBounds, type View } from '../../mechanics-bench/lib/svg';
import { useAnimationFrame } from '../../simulations/_shared';
import { Arrow, Handle, Spring, Hatch, PlotFrame, svgPoint, GRAB_CSS_PX } from './svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, LedgerBar, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, BORDER, accentTint,
  clamp, f1, f2, f3, type LegendRow, type ReadoutRow,
} from './ui';

/** Reveal ladder. Every archetype on this bench declares four guided beats, so
 *  stage 3 is always reachable — no permanently-dark layer (a Phase-1 defect
 *  where three layers of the flagship gated at `revealed >= 4` on a 3-step
 *  archetype and could never appear). */
const MAX_STAGE = 3;

export default function ShmBench({ block, arch }: { block: MotionBenchBlock; arch: WavesArchetype }) {
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  // Which rig this archetype describes is read off its OWN declared params —
  // an archetype that offers a pendulum length and a release angle IS a
  // pendulum. No separate mode field to fall out of sync with the sliders.
  const isPendulum = declares(arch.params, 'length') && declares(arch.params, 'theta0');

  // ── live controls, seeded from the authored bag by CONTENT, never identity ─
  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);

  const [flags, setFlags] = useState(() => readFlags(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setFlags(readFlags(authored)); }, [seed]);

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); setPlaying(false); setT(0); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);      // NEVER true on mount
  const [slow, setSlow] = useState(false);
  const [everRan, setEverRan] = useState(false);
  const [grabbed, setGrabbed] = useState(false);
  const [touched, setTouched] = useState(false);

  // ── the physics ───────────────────────────────────────────────────────────
  const omega = isPendulum
    ? Math.sqrt(c.g / Math.max(c.length, 1e-6))
    : (declares(arch.params, 'period') ? (2 * Math.PI) / Math.max(c.period, 1e-6) : S.springOmega(c.mass, c.k));

  const periodSmall = isPendulum ? S.pendulumPeriodSmall(c.length, c.g) : (2 * Math.PI) / Math.max(omega, 1e-9);
  const theta0 = (c.theta0 * Math.PI) / 180;
  const periodExact = isPendulum ? S.pendulumPeriodExact(c.length, c.g, theta0) : periodSmall;
  const periodShown = isPendulum ? periodExact : periodSmall;

  /** One period of the REAL pendulum, sampled once per geometry change. */
  const track = useMemo(
    () => (isPendulum ? S.pendulumTrack(c.length, c.g, theta0, periodExact * 1.05, 260) : []),
    [isPendulum, c.length, c.g, theta0, periodExact]
  );

  const thetaNow = isPendulum ? sampleTheta(track, t) : 0;
  const thetaGhost = isPendulum ? theta0 * Math.cos((2 * Math.PI * t) / Math.max(periodSmall, 1e-9)) : 0;

  // The spring oscillator AND its reference point come from the same call —
  // that identity is the whole claim of `circle-of-reference`.
  const ref = S.circleProjection(c.amplitude, omega, t);
  const shm = S.shmState(c.amplitude, omega, t);
  const twin = S.shmState(c.amplitude / 2, omega, t);
  const energy = S.shmEnergy(c.mass, c.k, shm.x, shm.v);
  const totalE = S.shmTotalEnergy(c.k, c.amplitude);

  // ── clock ─────────────────────────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => setT((prev) => prev + dt * (slow ? 0.25 : 1)), { enabled: playing, target: wrapRef });

  // ── the scene, in world metres ────────────────────────────────────────────
  const scene = isPendulum
    ? pendulumScene(c.length)
    : springScene(c.amplitude, flags.showCircle && stage >= 2);
  const aspect = aspectOf(scene);

  const viewRef = useRef<View | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // ── drag: the primary gesture ─────────────────────────────────────────────
  // Never gated on `playing`. Dragging pauses the clock and resets it to the
  // release instant, because "I moved it, so this is the new start" is what a
  // student means by grabbing the block.
  const applyDrag = (world: { x: number; y: number }) => {
    if (isPendulum) {
      const a = Math.atan2(world.x, -world.y);          // 0 = straight down
      const deg = clamp(Math.abs((a * 180) / Math.PI), 1, 170);
      setC((prev) => ({ ...prev, theta0: Math.round(deg) }));
    } else {
      setC((prev) => ({ ...prev, amplitude: clamp(Math.abs(world.x), 0.02, 0.6) }));
    }
    setPlaying(false);
    setT(0);
    setTouched(true);
  };

  const handleWorld = isPendulum
    ? { x: c.length * Math.sin(theta0), y: -c.length * Math.cos(theta0) }
    : { x: c.amplitude, y: 0 };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const v = viewRef.current;
    if (!v || stage < 1) return;
    const p = svgPoint(e, v.w, v.h);
    if (!p) return;
    const h = worldToScreen(handleWorld, v);
    if (Math.hypot(p.x - h.x, p.y - h.y) * p.fit > GRAB_CSS_PX) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbed(true);
    setTouched(true);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const v = viewRef.current;
    if (!grabbed || !v) return;
    const p = svgPoint(e, v.w, v.h);
    if (!p) return;
    applyDrag(screenToWorldLocal(p, v));
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    setGrabbed(false);
  };

  // ── the misconception card, fired only after the evidence ─────────────────
  const evidence = misconceptionReady(arch.targets, {
    stage, everRan, t, periodShown, theta0Deg: c.theta0, atCentre: Math.abs(shm.x) < c.amplitude * 0.08,
    atEnd: Math.abs(shm.x) > c.amplitude * 0.92, showCircle: flags.showCircle,
  });

  // ── legend + readouts ─────────────────────────────────────────────────────
  const legend: LegendRow[] = [];
  if (isPendulum) {
    legend.push({ color: ACCENT, label: 'Real pendulum', value: `${f1((thetaNow * 180) / Math.PI)}°`, strong: true });
    if (flags.ghost && stage >= 2) {
      legend.push({ color: ACCENT_2, dashed: true, label: 'Small-angle formula', value: `${f1((thetaGhost * 180) / Math.PI)}°` });
    }
  } else {
    legend.push({ color: ACCENT, label: 'Displacement x', value: `${f3(shm.x)} m`, strong: true });
    if (flags.twin && stage >= 2) legend.push({ color: ACCENT_2, label: 'Half-amplitude twin', value: `${f3(twin.x)} m` });
    if (flags.showCircle && stage >= 2) {
      legend.push({ color: ACCENT_2, dashed: true, label: 'Reference point → its shadow', value: `${f1((ref.angle * 180) / Math.PI % 360)}°` });
    }
    if (flags.arrows && stage >= 3) {
      // Velocity white, acceleration secondary-dashed — the same convention the
      // projectile module uses, so a student reads the two arrows the same way
      // in both sims. Two accents on the canvas, never three.
      legend.push({ color: 'rgba(255,255,255,0.85)', label: 'Velocity', value: `${f2(shm.v)} m/s` });
      legend.push({ color: ACCENT_2, dashed: true, label: 'Acceleration', value: `${f1(shm.a)} m/s²` });
    }
  }

  const readout: ReadoutRow[] = isPendulum
    ? [
        { label: 'Measured period', value: `${f3(periodExact)} s`, color: ACCENT, strong: true },
        { label: '2π√(l/g)', value: `${f3(periodSmall)} s`, color: ACCENT_2 },
        { label: 'Difference', value: `${f2(100 * (periodExact / periodSmall - 1))} %`, color: c.theta0 > 20 ? ACCENT_2 : TEXT.primary },
        { label: 'Release angle', value: `${f1(c.theta0)}°` },
        { label: 'Angle now', value: `${f1((thetaNow * 180) / Math.PI)}°` },
      ]
    : [
        { label: 'Period T', value: `${f3(periodSmall)} s`, color: ACCENT, strong: true },
        { label: 'Angular frequency ω', value: `${f2(omega)} rad/s` },
        { label: 'Amplitude A', value: `${f3(c.amplitude)} m`, color: ACCENT_2 },
        { label: 'x now', value: `${f3(shm.x)} m` },
        { label: 'v now', value: `${f2(shm.v)} m/s` },
        { label: 'a now', value: `${f1(shm.a)} m/s²` },
        { label: 'v max = Aω', value: `${f2(c.amplitude * omega)} m/s` },
      ];

  const footnote = isPendulum
    ? 'The measured period is the exact elliptic result, and the animation integrates θ̈ = −(g/l) sin θ — the same physics, so the clock and the picture cannot disagree.'
    : 'Exact values, from the algebra. The drawing follows them; they are not read off the drawing.';

  // ── the x-t trace, drawn under the canvas ─────────────────────────────────
  const traceOn = flags.graph && stage >= 3;

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · shm bench`}
        badge={<span className="tabular-nums">{`t = ${f2(t)} s`}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={aspect}
        frozen={grabbed}
        maxCanvasHeight={isPendulum ? 460 : 420}
        renderCanvas={(w, h) => {
          const view = fitView(padBounds(boundsOf([
            { x: scene.minX, y: scene.minY }, { x: scene.maxX, y: scene.maxY },
          ])!, 0), w, h, { padFrac: 0.09, minScale: 2, maxScale: 4000 });
          viewRef.current = view;
          return isPendulum
            ? <PendulumCanvas
                view={view} L={c.length} theta={thetaNow} theta0={theta0} ghost={thetaGhost}
                showGhost={flags.ghost && stage >= 2} showArc={stage >= 1}
                hint={!touched && stage >= 1} onDown={onDown} onMove={onMove} onUp={onUp} svgRef={svgRef}
              />
            : <SpringCanvas
                view={view} A={c.amplitude} x={shm.x} v={shm.v} a={shm.a}
                twinX={twin.x} showTwin={flags.twin && stage >= 2}
                circle={flags.showCircle && stage >= 2 ? { cy: scene.circleY!, A: c.amplitude, angle: ref.angle } : null}
                arrows={flags.arrows && stage >= 3} showMarks={stage >= 1}
                hint={!touched && stage >= 1} onDown={onDown} onMove={onMove} onUp={onUp} svgRef={svgRef}
              />;
        }}
        legend={legend}
        belowCanvas={
          <>
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                onClick={() => { setPlaying((p) => !p); setEverRan(true); }}
                disabled={stage < MAX_STAGE}
              >
                {playing ? '❚❚ Pause' : t > 0 ? '▶ Continue' : '▶ Release it'}
              </ActionButton>
              <ActionButton accent={ACCENT_2} onClick={() => { setPlaying(false); setT(0); }} disabled={stage < MAX_STAGE}>
                ↺ Back to the start
              </ActionButton>
              <div className="flex flex-1 items-center gap-2" style={{ minWidth: 190 }}>
                {/* Scrubbing by hand is how a student inspects the instant where
                    v dies and a peaks — it is not a decoration. minHeight 44 +
                    touchAction none, or a phone drag scrolls the page instead. */}
                <input type="range" min={0} max={periodShown} step={periodShown / 400}
                  value={Math.min(t % Math.max(periodShown, 1e-6), periodShown)}
                  onChange={(e) => { setPlaying(false); setT(parseFloat(e.target.value)); setEverRan(true); }}
                  disabled={stage < MAX_STAGE} aria-label="Step through one cycle" className="flex-1"
                  style={{ accentColor: ACCENT, minHeight: 44, touchAction: 'none',
                    cursor: stage < MAX_STAGE ? 'not-allowed' : 'pointer' }} />
                <span className="tabular-nums text-[12px] font-semibold"
                  style={{ color: TEXT.ghost, minWidth: 84, textAlign: 'right' }}>
                  {f2(t % Math.max(periodShown, 1e-6))} / {f2(periodShown)} s
                </span>
              </div>
              <Toggle on={slow} label="slow motion" onClick={() => setSlow((s) => !s)} />
            </div>

            {traceOn && (
              <TimeTrace
                isPendulum={isPendulum} track={track} theta0={theta0} periodSmall={periodSmall}
                A={c.amplitude} omega={omega} tNow={t} span={Math.max(periodShown * 2, 1e-6)}
                ghost={flags.ghost}
              />
            )}
          </>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set it up</SectionLabel>
            <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
              {touched
                ? isPendulum ? 'Drag the bob to any angle, or use the sliders.' : 'Drag the block to set the amplitude, or use the sliders.'
                : isPendulum ? '👆 Drag the bob itself — that is how you choose the release angle.' : '👆 Drag the block sideways — that is how you choose the amplitude.'}
            </p>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 0.01} unit={d.unit ?? ''}
                accent={d.key === 'g' || d.key === 'mass' ? ACCENT_2 : ACCENT}
                format={(v) => (d.step ?? 1) < 0.05 ? v.toFixed(2) : v.toFixed(1)}
                onChange={(v) => { setC((prev) => ({ ...prev, [d.key]: v })); setPlaying(false); setT(0); }} />
            ) : null)}
            <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
              {defs.filter((d) => d.kind === 'boolean').map((d) => (
                <Toggle key={d.key} label={d.label} on={flagOf(flags, d.key)}
                  onClick={() => setFlags((prev) => ({ ...prev, ...toggleFlag(d.key, prev) }))} />
              ))}
              <Toggle label="x-t graph" on={flags.graph} onClick={() => setFlags((p) => ({ ...p, graph: !p.graph }))} accent={ACCENT_2} />
            </div>
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote={footnote} />
            {flags.energy && stage >= 2 && !isPendulum && (
              <LedgerBar
                segments={[
                  { label: 'Kinetic ½mv²', value: energy.kinetic, color: ACCENT },
                  { label: 'Elastic ½kx²', value: energy.potential, color: ACCENT_2 },
                ]}
                total={energy.total}
                unit="J"
                note={`Measured from the current x and v — not from A. ½kA² = ${f3(totalE)} J, and the bar’s top edge has not moved since you let go.`}
              />
            )}
            {stage >= 2 && isPendulum && c.theta0 > 15 && (
              <Card tone={c.theta0 > 30 ? 'bad' : 'plain'}>
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  At {f1(c.theta0)}° the small-angle formula is out by{' '}
                  <b style={{ color: ACCENT_2 }}>{f2(100 * (periodExact / periodSmall - 1))}%</b>.
                  {' '}sin θ has fallen to {f3(Math.sin(theta0))} while θ itself is {f3(theta0)} — that gap IS the error.
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
        misconception={evidence ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}

// ── control plumbing ─────────────────────────────────────────────────────────

interface Controls {
  mass: number; k: number; amplitude: number; length: number; theta0: number; g: number; period: number;
}
interface Flags { twin: boolean; showCircle: boolean; arrows: boolean; ghost: boolean; energy: boolean; graph: boolean }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  mass: num(b, 'mass', 0.5),
  k: num(b, 'k', 20),
  amplitude: num(b, 'amplitude', 0.2),
  length: num(b, 'length', 1),
  theta0: num(b, 'theta0', 10),
  g: num(b, 'g', 9.8),
  period: num(b, 'period', 2),
});

const readFlags = (b: ReturnType<typeof resolveParams>): Flags => ({
  twin: bool(b, 'compare_amplitude', false),
  showCircle: bool(b, 'show_phasor', false),
  arrows: bool(b, 'show_arrows', false),
  ghost: bool(b, 'ghost_small_angle', false),
  energy: bool(b, 'energy_bar', false),
  graph: true,
});

const numberOf = (c: Controls, key: string): number => (c as unknown as Record<string, number>)[key] ?? 0;
const flagOf = (f: Flags, key: string): boolean => {
  switch (key) {
    case 'compare_amplitude': return f.twin;
    case 'show_phasor': return f.showCircle;
    case 'show_arrows': return f.arrows;
    case 'ghost_small_angle': return f.ghost;
    case 'energy_bar': return f.energy;
    default: return false;
  }
};
const toggleFlag = (key: string, f: Flags): Partial<Flags> => {
  switch (key) {
    case 'compare_amplitude': return { twin: !f.twin };
    case 'show_phasor': return { showCircle: !f.showCircle };
    case 'show_arrows': return { arrows: !f.arrows };
    case 'ghost_small_angle': return { ghost: !f.ghost };
    case 'energy_bar': return { energy: !f.energy };
    default: return {};
  }
};

// ── screen → world ───────────────────────────────────────────────────────────

/** Screen → world. `fitView`'s View has no inverse helper, so this is the two
 *  lines of `worldToScreen` run backwards; keeping it local avoids touching the
 *  frozen mechanics-bench module. */
const screenToWorldLocal = (p: { x: number; y: number }, v: View) => ({
  x: v.cx + (p.x - v.w / 2) / v.scale,
  y: v.cy - (p.y - v.h / 2) / v.scale,
});

const sampleTheta = (track: { t: number; theta: number }[], t: number): number => {
  if (!track.length) return 0;
  const span = track[track.length - 1].t;
  if (span <= 0) return track[0].theta;
  const tt = t % span;
  const i = Math.min(track.length - 2, Math.max(0, Math.floor((tt / span) * (track.length - 1))));
  const a = track[i];
  const b = track[i + 1];
  const f = b.t > a.t ? (tt - a.t) / (b.t - a.t) : 0;
  return a.theta + (b.theta - a.theta) * clamp(f, 0, 1);
};

// ── canvases (zero <text> elements — §4E) ────────────────────────────────────

interface CanvasCommon {
  view: View;
  hint: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onDown: (e: React.PointerEvent<SVGSVGElement>) => void;
  onMove: (e: React.PointerEvent<SVGSVGElement>) => void;
  onUp: (e: React.PointerEvent<SVGSVGElement>) => void;
}

function Frame({ view, svgRef, onDown, onMove, onUp, children }:
  Omit<CanvasCommon, 'hint'> & { children: React.ReactNode }) {
  return (
    <svg ref={svgRef} viewBox={`0 0 ${view.w} ${view.h}`} width="100%" height="100%"
      style={{ display: 'block', touchAction: 'none' }}
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      {children}
    </svg>
  );
}

function SpringCanvas(p: CanvasCommon & {
  A: number; x: number; v: number; a: number; twinX: number; showTwin: boolean;
  circle: { cy: number; A: number; angle: number } | null;
  arrows: boolean; showMarks: boolean;
}) {
  const v = p.view;
  const W = (wx: number, wy: number) => worldToScreen({ x: wx, y: wy }, v);
  const wall = W(-(p.A * 1.85 + 0.06), 0);
  const blockS = W(p.x, 0);
  const half = Math.max(9, p.A * 0.22 * v.scale);
  const vScale = (half * 2.4) / Math.max(Math.abs(p.A * (p.v === 0 ? 1 : 1)) * 6, 1e-6);

  return (
    <Frame view={v} svgRef={p.svgRef} onDown={p.onDown} onMove={p.onMove} onUp={p.onUp}>
      {/* the track */}
      <line x1={W(-(p.A * 1.85 + 0.06), 0).x} y1={W(0, 0).y + half + 3}
        x2={W(p.A * 1.35, 0).x} y2={W(0, 0).y + half + 3}
        stroke="rgba(255,255,255,0.28)" strokeWidth={2} />
      <Hatch x={wall.x} y={W(0, -(p.A * 0.5)).y} len={W(0, p.A * 0.5).y - W(0, -(p.A * 0.5)).y}
        angleDeg={-90} color="rgba(255,255,255,0.4)" />

      {/* equilibrium mark — the line every displacement is measured from */}
      {p.showMarks && (
        <line x1={W(0, 0).x} y1={W(0, p.A * 0.42).y} x2={W(0, 0).x} y2={W(0, -(p.A * 0.42)).y}
          stroke={ACCENT_2} strokeWidth={1.5} strokeDasharray="4 4" opacity={0.7} />
      )}

      {/* the reference circle and its projection — same call as the block */}
      {p.circle && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={W(0, p.circle.cy).x} cy={W(0, p.circle.cy).y} r={p.circle.A * v.scale}
            fill="none" stroke={ACCENT_2} strokeWidth={1.5} opacity={0.55} strokeDasharray="3 4" />
          <line x1={W(-p.circle.A, p.circle.cy).x} y1={W(0, p.circle.cy).y}
            x2={W(p.circle.A, p.circle.cy).x} y2={W(0, p.circle.cy).y}
            stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
          {(() => {
            const rp = W(p.circle.A * Math.cos(p.circle.angle), p.circle.cy + p.circle.A * Math.sin(p.circle.angle));
            const shadow = W(p.circle.A * Math.cos(p.circle.angle), p.circle.cy);
            return (
              <>
                <line x1={W(0, p.circle.cy).x} y1={W(0, p.circle.cy).y} x2={rp.x} y2={rp.y}
                  stroke={ACCENT_2} strokeWidth={1.5} opacity={0.8} />
                <line x1={rp.x} y1={rp.y} x2={shadow.x} y2={shadow.y}
                  stroke={ACCENT_2} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.9} />
                {/* the shadow, dropped all the way onto the block */}
                <line x1={shadow.x} y1={shadow.y} x2={blockS.x} y2={blockS.y - half}
                  stroke={ACCENT_2} strokeWidth={1} strokeDasharray="2 5" opacity={0.55} />
                <circle cx={rp.x} cy={rp.y} r={6} fill={ACCENT_2} stroke="rgba(255,255,255,0.85)" strokeWidth={1.5} />
                <circle cx={shadow.x} cy={shadow.y} r={4} fill={ACCENT_2} opacity={0.9} />
              </>
            );
          })()}
        </g>
      )}

      {/* the half-amplitude twin, drawn behind */}
      {p.showTwin && (
        <g opacity={0.55} style={{ pointerEvents: 'none' }}>
          <Spring x1={wall.x} y1={W(0, -(p.A * 0.22)).y} x2={W(p.twinX, 0).x - half * 0.7}
            y2={W(0, -(p.A * 0.22)).y} color={ACCENT_2} coils={9} amp={5} width={1.5} />
          <rect x={W(p.twinX, 0).x - half * 0.7} y={W(0, -(p.A * 0.22)).y - half * 0.7}
            width={half * 1.4} height={half * 1.4} rx={3}
            fill={accentTint(ACCENT_2, 0.3)} stroke={ACCENT_2} strokeWidth={1.5} />
        </g>
      )}

      {/* the spring and the block */}
      <Spring x1={wall.x} y1={blockS.y} x2={blockS.x - half} y2={blockS.y} color={ACCENT} coils={12} amp={Math.max(5, half * 0.5)} />
      <rect x={blockS.x - half} y={blockS.y - half} width={half * 2} height={half * 2} rx={4}
        fill={accentTint(ACCENT, 0.35)} stroke={ACCENT} strokeWidth={2} />

      {/* v and a, at one shared px-per-unit each so lengths stay comparable */}
      {p.arrows && (
        <>
          <Arrow x1={blockS.x} y1={blockS.y - half - 6} x2={blockS.x + p.v * vScale * 0.5} y2={blockS.y - half - 6}
            color="rgba(255,255,255,0.85)" width={3} />
          <Arrow x1={blockS.x} y1={blockS.y + half + 6} x2={blockS.x + p.a * vScale * 0.06} y2={blockS.y + half + 6}
            color={ACCENT_2} width={2.5} dashed />
        </>
      )}

      <Handle x={blockS.x} y={blockS.y} color={accentTint(ACCENT, 0.9)} r={Math.max(7, half * 0.45)} hint={p.hint} />
    </Frame>
  );
}

function PendulumCanvas(p: CanvasCommon & {
  L: number; theta: number; theta0: number; ghost: number; showGhost: boolean; showArc: boolean;
}) {
  const v = p.view;
  const W = (wx: number, wy: number) => worldToScreen({ x: wx, y: wy }, v);
  const pivot = W(0, 0);
  const bob = W(p.L * Math.sin(p.theta), -p.L * Math.cos(p.theta));
  const gbob = W(p.L * Math.sin(p.ghost), -p.L * Math.cos(p.ghost));
  const r = Math.max(8, 0.06 * p.L * v.scale);
  const arcR = 0.32 * p.L * v.scale;

  return (
    <Frame view={v} svgRef={p.svgRef} onDown={p.onDown} onMove={p.onMove} onUp={p.onUp}>
      <Hatch x={W(-p.L * 0.35, 0).x} y={pivot.y} len={0.7 * p.L * v.scale} angleDeg={0} color="rgba(255,255,255,0.4)" />

      {/* the vertical, and the release-angle arc it is measured from */}
      {p.showArc && (
        <>
          <line x1={pivot.x} y1={pivot.y} x2={pivot.x} y2={W(0, -p.L * 1.05).y}
            stroke="rgba(255,255,255,0.22)" strokeWidth={1} strokeDasharray="4 5" />
          <path
            d={`M${pivot.x},${pivot.y + arcR} A${arcR},${arcR} 0 0 ${p.theta0 > 0 ? 0 : 1} ${
              pivot.x + arcR * Math.sin(p.theta0)},${pivot.y + arcR * Math.cos(p.theta0)}`}
            fill="none" stroke={ACCENT_2} strokeWidth={1.5} opacity={0.8} />
          <line x1={pivot.x} y1={pivot.y}
            x2={pivot.x + p.L * v.scale * Math.sin(p.theta0)} y2={pivot.y + p.L * v.scale * Math.cos(p.theta0)}
            stroke={ACCENT_2} strokeWidth={1} strokeDasharray="3 6" opacity={0.5} />
        </>
      )}

      {/* the small-angle ghost — running the formula, not the physics */}
      {p.showGhost && (
        <g opacity={0.6} style={{ pointerEvents: 'none' }}>
          <line x1={pivot.x} y1={pivot.y} x2={gbob.x} y2={gbob.y} stroke={ACCENT_2} strokeWidth={1.5} strokeDasharray="5 4" />
          <circle cx={gbob.x} cy={gbob.y} r={r * 0.85} fill="none" stroke={ACCENT_2} strokeWidth={2} />
        </g>
      )}

      {/* the real one */}
      <line x1={pivot.x} y1={pivot.y} x2={bob.x} y2={bob.y} stroke={ACCENT} strokeWidth={2.5} />
      <circle cx={pivot.x} cy={pivot.y} r={4} fill="rgba(255,255,255,0.55)" />
      <circle cx={bob.x} cy={bob.y} r={r} fill={accentTint(ACCENT, 0.45)} stroke={ACCENT} strokeWidth={2.5} />
      <Handle x={bob.x} y={bob.y} color={accentTint(ACCENT, 0.9)} r={Math.max(7, r * 0.55)} hint={p.hint} />
    </Frame>
  );
}

// ── the x-t trace ────────────────────────────────────────────────────────────

/**
 * Displacement against time, with the small-angle ghost overlaid for a
 * pendulum. This is where the 7% shows up as a widening phase gap rather than
 * as a number in a box — two curves that start together and are visibly apart
 * by the second swing.
 */
function TimeTrace({ isPendulum, track, theta0, periodSmall, A, omega, tNow, span, ghost }: {
  isPendulum: boolean;
  track: { t: number; theta: number }[];
  theta0: number; periodSmall: number; A: number; omega: number;
  tNow: number; span: number; ghost: boolean;
}) {
  const W = 320;
  const H = 96;
  const real: { x: number; y: number }[] = [];
  const model: { x: number; y: number }[] = [];
  const N = 200;
  for (let i = 0; i <= N; i++) {
    const t = (span * i) / N;
    if (isPendulum) {
      real.push({ x: t, y: (sampleTheta(track, t) * 180) / Math.PI });
      model.push({ x: t, y: (theta0 * Math.cos((2 * Math.PI * t) / Math.max(periodSmall, 1e-9)) * 180) / Math.PI });
    } else {
      real.push({ x: t, y: A * Math.cos(omega * t) });
    }
  }
  const amp = isPendulum ? (theta0 * 180) / Math.PI : A;
  const plot: Plot = makePlot(W, H, { xMin: 0, xMax: span, yMin: -amp, yMax: amp },
    { l: 8, r: 8, t: 8, b: 8 }, 0.12);
  const cur = tNow % span;

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          {isPendulum ? 'Angle against time' : 'Displacement against time'}
        </span>
        <span className="text-[11px]" style={{ color: TEXT.muted }}>
          vertical span ±{isPendulum ? `${f1(amp)}°` : `${f2(amp)} m`} · horizontal 0 → {f2(span)} s
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
        style={{ width: '100%', height: H, display: 'block', borderRadius: 10, border: `1px solid ${BORDER.card}` }}>
        <PlotFrame plot={plot} xTicks={5} yTicks={3} />
        {isPendulum && ghost && (
          <path d={polyline(plot, model)} fill="none" stroke={ACCENT_2} strokeWidth={2} strokeDasharray="5 4" opacity={0.8} />
        )}
        <path d={polyline(plot, real)} fill="none" stroke={ACCENT} strokeWidth={2.2} />
        <line x1={px(plot, cur)} y1={py(plot, plot.yMax)} x2={px(plot, cur)} y2={py(plot, plot.yMin)}
          stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
      </svg>
    </div>
  );
}

// ── when the misconception card may appear ───────────────────────────────────

/**
 * Never as a preamble. Each code names the moment the sim has just produced the
 * evidence that contradicts the belief, and returns false until then — the
 * Phase-1 audit found two projectile cards on screen before the student had
 * fired a single shot, which is the exact failure this guards.
 */
function misconceptionReady(code: string, x: {
  stage: number; everRan: boolean; t: number; periodShown: number; theta0Deg: number;
  atCentre: boolean; atEnd: boolean; showCircle: boolean;
}): boolean {
  switch (code) {
    // Both blocks have to have been released and got somewhere together.
    case 'shm_period_depends_on_amplitude':
      return x.everRan && x.t > x.periodShown * 0.5;
    // The projection has to be on screen and turning.
    case 'shm_and_circular_motion_unrelated':
      return x.showCircle && x.stage >= 2 && x.everRan;
    // Only once they have stood at one of the two revealing instants.
    case 'shm_v_and_a_peak_together':
      return x.stage >= 3 && x.everRan && (x.atCentre || x.atEnd);
    case 'pendulum_period_depends_on_mass':
      return x.everRan && x.t > x.periodShown * 0.5;
    // The drift is the evidence, and it needs a wide swing to exist.
    case 'pendulum_always_simple_harmonic':
      return x.theta0Deg >= 20 && x.everRan;
    // The bar has to have traded at least once.
    case 'shm_energy_lost_at_centre':
      return x.everRan && x.t > x.periodShown * 0.25;
    default:
      return x.stage >= MAX_STAGE && x.everRan;
  }
}
