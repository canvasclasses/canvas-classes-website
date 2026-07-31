'use client';

/*
 * motion-lab/projectile/ProjectilePlayground.tsx — E2 flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §5.3. What makes this more than a moving
 * diagram, in the order the five design laws demand:
 *
 * 1. THE STUDENT IS THE AUTHOR. They drag the launch arrow to set both speed
 *    and angle before anything flies. Sliders exist, but the primary gesture is
 *    grabbing the vector.
 * 2. IT GRADES REASONING. Every archetype names the misconception it attacks
 *    and the sim contradicts that specific belief at the moment it has just
 *    shown the evidence — never as a preamble, never as a bare "wrong".
 * 3. IT SHOWS THE INVISIBLE MIDDLE STEP. The split screen: two independent 1-D
 *    movies playing in lockstep beside the trajectory. Textbooks cannot do it.
 *    It is the default view here, not a hidden tab.
 * 4. IT COMPOSES. Everything is driven off `integrate` + `toFrame` from lib/,
 *    the same functions circular motion hands its released ball to.
 * 5. IT IS GUIDED, NEVER AUTO-PLAYING. Nothing is on screen before it has been
 *    explained; one click reveals one thing.
 *
 * ── Three implementation rules learned the hard way ──────────────────────────
 * • NEVER memoise on block identity. The admin books-editor autosaves on a
 *   debounce and recreates the block object on every keystroke; an
 *   identity-keyed memo would re-seed the sliders continuously and reset a
 *   student's shot mid-drag.
 * • NEVER gate a drag on the animation clock. Aiming works whether the flight
 *   is playing, paused, finished or has never been fired.
 * • Pointer events only, with pointer capture. Mouse events do not work on a
 *   phone, which is where most of these students are.
 * • RESPONSIVENESS IS MEASURED, NOT DECLARED. Every breakpoint here comes from
 *   a ResizeObserver on the actual container, never a CSS viewport query. This
 *   component also renders inside the admin books-editor's split-pane preview,
 *   where the viewport is a laptop and the container is 380 px — a `lg:` class
 *   would keep a two-column layout there and squeeze the canvas to a stamp.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { FrameSpec, MotionState, MotionMisconception } from '../types';
import { deg2rad, round } from '../../mechanics-bench/lib/linalg';
import { sampleAt } from '../lib/integrate';
import { toFrame } from '../lib/frames';
import * as P from '../lib/projectile';
import { projectileArchetype } from '../archetypes.projectile';
import {
  resolveSetup, buildScene, buildFan, controlsKey, makeView, boundsOfPoints, surfaceY,
  type Controls, type Scene,
} from './model';
import Field, { GraphStrip, stripPad, stripSize, uiScale, PLAIN_PAD, type Pt, type FieldPaths, type FieldMarks } from './Field';
import {
  Card, Pill, Toggle, ActionButton, Legend, Readout, GuidedPanel, MisconceptionCard,
  PredictGate, NumericPanel, RangeCurve, type LegendRow, type ReadoutRow,
} from './panels';
import {
  SimShell, SimHeader, SectionLabel, SimSlider, ExpertTip, useAnimationFrame,
  ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, SIM_CANVAS_BG, accentTint,
} from '../../simulations/_shared';

/** Width assumed for the very first render, before the container is measured. */
const FALLBACK_W = 780;

/** Below this MEASURED container width the sidebar goes under the canvas. */
const STACK_AT = 640;

/** Reveal ladder — see the guided-script comment in archetypes.projectile.ts. */
const MAX_STAGE = 3;

const f1 = (n: number) => (Number.isFinite(n) ? n.toFixed(1) : '—');
const f2 = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : '—');
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Measured width of an element, in CSS pixels. 0 until the first observation.
 *
 * Width only, on purpose: this component SETS the canvas height, so observing
 * height as well would feed the element's own output back into its input and
 * oscillate. Width is a pure input here — nothing this component does can
 * change it.
 */
function useMeasuredWidth(ref: React.RefObject<HTMLElement | null>): number {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const read = () => {
      const next = Math.round(el.getBoundingClientRect().width);
      setW((prev) => (prev !== next ? next : prev));
    };
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

export default function ProjectilePlayground({ block }: { block: MotionBenchBlock }) {
  const arch = projectileArchetype(block.archetype);

  // Resolve the authored config. Keyed on the CONTENT of the block, not its
  // identity — see the file header.
  const setupKey = JSON.stringify([
    block.archetype, block.scenario, block.params, block.projectile,
    block.strips, block.show, block.frames, block.steps, block.guided,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setup = useMemo(() => resolveSetup(block, arch), [setupKey]);
  const { flags, strips, scenario } = setup;

  // ── live controls ─────────────────────────────────────────────────────────
  const [c, setC] = useState<Controls>(setup.controls);
  const seedKey = controlsKey(setup.controls);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(setup.controls); }, [seedKey]);

  const set = <K extends keyof Controls>(k: K, v: Controls[K]) => {
    setC((prev) => ({ ...prev, [k]: v }));
    setPlaying(false);
    setTSim(0);
  };

  // ── view / interaction state ──────────────────────────────────────────────
  const canFrames = setup.frames.includes('translating') || scenario === 'relative';
  const [frameKind, setFrameKind] = useState<'ground' | 'translating'>('ground');
  const [axisRotated, setAxisRotated] = useState(false);
  const [fanOn, setFanOn] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(flags.envelope);
  const [showComponents, setShowComponents] = useState(flags.components);
  const [showVectors, setShowVectors] = useState(flags.vectors);
  const [step, setStep] = useState(setup.guided ? 0 : MAX_STAGE);
  const [everFired, setEverFired] = useState(!setup.guided);
  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [visitedApex, setVisitedApex] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [grabbed, setGrabbed] = useState(false);
  const [touchedAim, setTouchedAim] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setStep(setup.guided ? 0 : MAX_STAGE);
    setEverFired(!setup.guided);
    setShowEnvelope(flags.envelope);
    setFanOn(false);
    setFrameKind('ground');
    setAxisRotated(false);
  }, [setupKey]);

  const stage = setup.guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  // ── the clock — ONE clock for every view on screen ────────────────────────
  const [tSim, setTSim] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Two measurements, two jobs: the wrapper decides one column or two, the
  // canvas box decides the viewBox. Measuring only the wrapper and inferring
  // the canvas at 7/12 of it would go wrong the moment the gap or the ratio
  // changed — and silently, which is the worst kind of wrong.
  const wrapW = useMeasuredWidth(wrapRef);
  const canvasW = useMeasuredWidth(canvasRef);
  const stacked = wrapW > 0 && wrapW < STACK_AT;

  // ── physics ───────────────────────────────────────────────────────────────
  // Keyed on primitives only. `flags` and `scenario` come from the memoised
  // setup, so this does not re-run when the editor recreates the block.
  const scene: Scene = useMemo(
    () => buildScene(c, scenario, flags),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [c.speed, c.angle, c.height, c.g, c.mass, c.dragOn, c.dragK, c.dragQuadratic,
     c.incline, c.monkeyX, c.monkeyY, scenario, flags]
  );
  const duration = Math.max(scene.duration, 1e-3);

  useAnimationFrame(
    (dt) => setTSim((t) => Math.min(duration, t + dt * rate)),
    { enabled: playing, target: wrapRef }
  );
  useEffect(() => { if (playing && tSim >= duration - 1e-6) setPlaying(false); }, [playing, tSim, duration]);

  const fan = useMemo(
    () => (fanOn ? buildFan(c, scenario) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fanOn, c.speed, c.height, c.g, c.dragOn, c.dragK, c.incline, scenario]
  );

  // ── display transform: reference frame, then axis rotation ────────────────
  const beta = axisRotated ? c.incline : 0;
  const frameSpec: FrameSpec | null =
    frameKind === 'translating' ? { kind: 'translating', vel: { x: c.frameVx, y: 0 } } : null;

  const project = useMemo(() => {
    const r = deg2rad(-beta);
    const cos = Math.cos(r), sin = Math.sin(r);
    const lx = 0, ly = c.height;
    return (s: MotionState): { pos: Pt; vel: Pt } => {
      const st = frameSpec ? toFrame(s, frameSpec, s.t) : s;
      if (!beta) return { pos: st.pos, vel: st.vel };
      const dx = st.pos.x - lx, dy = st.pos.y - ly;
      return {
        pos: { x: lx + dx * cos - dy * sin, y: ly + dx * sin + dy * cos },
        vel: { x: st.vel.x * cos - st.vel.y * sin, y: st.vel.x * sin + st.vel.y * cos },
      };
    };
  }, [beta, c.height, frameSpec?.kind, (frameSpec as { vel?: Pt } | null)?.vel?.x]);

  /** Turn a drag in display space back into a world-frame launch velocity. */
  const unprojectVel = (v: Pt): Pt => {
    const r = deg2rad(beta);
    const cos = Math.cos(r), sin = Math.sin(r);
    const w = { x: v.x * cos - v.y * sin, y: v.x * sin + v.y * cos };
    return frameSpec ? { x: w.x + c.frameVx, y: w.y } : w;
  };

  const toPts = (pts: MotionState[], everyNth = 1): Pt[] => {
    const out: Pt[] = [];
    for (let i = 0; i < pts.length; i += everyNth) out.push(project(pts[i]).pos);
    if (pts.length) out.push(project(pts[pts.length - 1]).pos);
    return out;
  };

  // ── sampled instant ───────────────────────────────────────────────────────
  const now = sampleAt(scene.live, tSim);
  const nowD = project(now);
  const accelWorld: Pt = { x: 0, y: -c.g };
  const accelD = (() => {
    const r = deg2rad(-beta);
    return { x: accelWorld.x * Math.cos(r) - accelWorld.y * Math.sin(r), y: accelWorld.x * Math.sin(r) + accelWorld.y * Math.cos(r) };
  })();

  const showPath = stage >= MAX_STAGE;
  const stripsOn = flags.strips && stage >= 2 && strips.some((s) => s.mode === 'line');

  // Equal-time stamps: 8 evenly spaced instants across the whole flight.
  const equalTime: Pt[] = useMemo(() => {
    if (stage < 2) return [];
    const out: Pt[] = [];
    for (let k = 0; k <= 8; k++) out.push(project(sampleAt(scene.live, (duration * k) / 8)).pos);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, duration, project, stage]);

  // ── paths in display space ────────────────────────────────────────────────
  const livePts = useMemo(() => toPts(scene.live.points, 2), [scene, project]); // eslint-disable-line react-hooks/exhaustive-deps
  const trailPts = useMemo(() => {
    if (!showPath) return [];
    const cut = scene.live.points.filter((s) => s.t <= tSim);
    const out = toPts(cut, 2);
    out.push(nowD.pos);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, tSim, project, showPath]);

  const idealPts = scene.ideal && showPath ? toPts(scene.ideal.points, 4) : null;
  const partnerPts = scene.partner && showPath ? toPts(scene.partner.points, 4) : null;
  const heavyPts = scene.heavy && showPath ? toPts(scene.heavy.points, 4) : null;
  const droppedPts = scene.dropped && showPath ? toPts(scene.dropped.points, 4) : null;
  const monkeyPts = scene.monkey && showPath ? toPts(scene.monkey.points, 4) : null;
  const fanPts = fan.map((tr) => toPts(tr.points, 2));
  const envPts = showEnvelope ? P.safetyEnvelope(c.speed, c.g, 80).filter((p) => p.x >= -2) : null;

  // ── viewport ──────────────────────────────────────────────────────────────
  const extras: Pt[] = [{ x: 0, y: c.height }, { x: 0, y: 0 }];
  if (flags.hasTarget) extras.push({ x: c.targetX, y: c.targetY });
  if (scenario === 'monkey-hunter') extras.push({ x: c.monkeyX, y: c.monkeyY }, { x: c.monkeyX * 1.12, y: 0 });
  if (scenario === 'projectile-incline' && !axisRotated) {
    extras.push({ x: 0, y: surfaceY(c, 0) }, { x: Math.max(10, scene.landing.pos.x * 1.1), y: surfaceY(c, Math.max(10, scene.landing.pos.x * 1.1)) });
  }

  const bounds = boundsOfPoints([
    livePts, idealPts ?? [], partnerPts ?? [], heavyPts ?? [], droppedPts ?? [],
    monkeyPts ?? [], envPts ?? [], extras, ...fanPts,
  ]);

  /*
   * ── SIZING THE CANVAS ──────────────────────────────────────────────────────
   * The old code drew into a hardcoded 780×430 viewBox scaled to fit whatever
   * box it landed in. Two measured failures came out of that:
   *
   *   1. LETTERBOXING. `preserveAspectRatio` meets the box, so in a 200 px-wide
   *      pane the 780×430 viewBox rendered at 200×110 inside a 430 px-tall
   *      parent — 74% of the canvas was empty and the drawing was a stamp.
   *      Fixed by making the viewBox the measured CSS pixel box: one viewBox
   *      unit is now one device-independent pixel, so nothing is ever letter-
   *      boxed and font sizes on the canvas mean what they say.
   *   2. UNDERFILL. Scale must be equal on both axes (a stretched y makes a 30°
   *      launch look like 60° and contradicts the readout beside it), so a
   *      trajectory 5× wider than it is tall could only ever fill a fifth of a
   *      1.8:1 box. Measured across the 14 archetypes: 73% × 49% linear, 35%
   *      of the area, and as low as 16% for `range-vs-angle`. The fix is not to
   *      cheat the scale — it is to give the box the SHAPE OF THE FLIGHT, by
   *      choosing the height from the content aspect ratio.
   */
  const boxW = canvasW > 0 ? canvasW : FALLBACK_W;
  const strip = stripSize(boxW);
  const pad = stripsOn ? stripPad(strip) : PLAIN_PAD;
  const availW = Math.max(60, boxW - pad.l - pad.r);
  const aspect = Math.max(0.2, (bounds.xMax - bounds.xMin) / Math.max(1e-6, bounds.yMax - bounds.yMin));

  // An author's `height` is honoured as the ceiling; our own default ceiling
  // follows the width so a wide reader gets a big diagram and a phone does not
  // get a tall empty one.
  const maxH = block.height ?? Math.round(clamp(boxW * 0.68, 300, 560));
  const minH = Math.min(maxH, 200);
  const wantH = clamp(Math.round((availW / aspect + pad.t + pad.b) / 8) * 8, minH, maxH);

  /**
   * FREEZE THE CAMERA — AND THE BOX — WHILE AIMING. The bounds are derived from
   * the flight, so re-fitting them mid-drag zooms the whole scene out as the
   * student pulls the arrow longer, moving the handle AWAY from the finger that
   * is dragging it. (Same class of bug as the vector-board "circle flickers
   * while dragging" report: a live re-fit driven by the thing being dragged.)
   *
   * The 10% dead band is the second half of the same idea: without it, nudging
   * the angle slider re-heights the canvas by a pixel or two per step and every
   * panel below it twitches. Height only moves when the shape of the flight has
   * genuinely changed.
   */
  const boxRef = useRef<{ w: number; h: number } | null>(null);
  if (!grabbed) {
    const prev = boxRef.current;
    if (!prev || prev.w !== boxW || Math.abs(wantH - prev.h) > 0.1 * prev.h) {
      boxRef.current = { w: boxW, h: wantH };
    }
  }
  const H = boxRef.current?.h ?? wantH;

  const fitted = makeView(boxW, H, bounds, pad);
  const frozenView = useRef(fitted);
  if (!grabbed) frozenView.current = fitted;
  const view = grabbed ? frozenView.current : fitted;
  const ui = uiScale(view.w, view.h);

  // One px-per-unit for every velocity arrow drawn, so their lengths stay
  // comparable. SCREEN pixels, not world units: `speed` spans 2→60 m/s across
  // the slider, so a world-unit arrow would be invisible at one end and cross
  // the whole canvas at the other. Normalising by the launch speed makes the
  // launch arrow a fixed size at every setting and every other arrow honestly
  // proportional to it (workflow §7: correct RELATIVE magnitudes).
  const arrowPx = clamp(0.16 * Math.min(view.w, view.h), 30, 74);
  const vecPxPerUnit = arrowPx / Math.max(c.speed, 1);
  const accelPxPerUnit = (arrowPx * 0.74) / Math.max(c.g, 1);

  // ── surface line ──────────────────────────────────────────────────────────
  const surface: [Pt, Pt] = axisRotated
    ? [{ x: bounds.xMin, y: c.height }, { x: bounds.xMax, y: c.height }]
    : scenario === 'projectile-incline'
      ? [{ x: bounds.xMin, y: surfaceY(c, bounds.xMin) }, { x: bounds.xMax, y: surfaceY(c, bounds.xMax) }]
      : [{ x: bounds.xMin, y: 0 }, { x: bounds.xMax, y: 0 }];

  // ── aim handle ────────────────────────────────────────────────────────────
  const launchD = project({ t: 0, pos: { x: 0, y: c.height }, vel: { x: 0, y: 0 } }).pos;
  const vel0D = project(P.launchState(c.speed, c.angle, c.height)).vel;
  const kWorldPerPx = vecPxPerUnit / view.scale;
  const aimTip: Pt | null = stage >= 1
    ? { x: launchD.x + vel0D.x * kWorldPerPx, y: launchD.y + vel0D.y * kWorldPerPx }
    : null;

  const svgRef = useRef<SVGSVGElement | null>(null);

  /**
   * Client coordinates → world coordinates, plus the viewBox-to-CSS-pixel
   * factor. `fit` is returned because the grab radius has to be expressed in
   * CSS pixels: on a phone the SVG renders at roughly 45% of its viewBox, so a
   * flat 30-viewBox-unit target would shrink to a 14 px tap area — unusable
   * with a finger, and invisible to any type check.
   */
  const toWorld = (e: React.PointerEvent<SVGSVGElement>): { w: Pt; fit: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    // The SVG uses the default preserveAspectRatio (xMidYMid meet), so undo the
    // letterboxing before undoing the viewBox. The viewBox now tracks the
    // measured box so `fit` is ~1 in practice — but the general form is kept
    // because it is also correct during the one frame between a resize and the
    // ResizeObserver callback, which is exactly when a fast drag lands.
    const fit = Math.min(rect.width / view.w, rect.height / view.h);
    if (!(fit > 0)) return null;
    const px = (e.clientX - rect.left - (rect.width - view.w * fit) / 2) / fit;
    const py = (e.clientY - rect.top - (rect.height - view.h * fit) / 2) / fit;
    return { w: { x: (px - view.ox) / view.scale, y: (view.oy - py) / view.scale }, fit };
  };

  const applyAim = (w: Pt) => {
    const dv = { x: (w.x - launchD.x) / kWorldPerPx, y: (w.y - launchD.y) / kWorldPerPx };
    const world = unprojectVel(dv);
    const speed = Math.min(60, Math.max(2, Math.hypot(world.x, world.y)));
    const angle = Math.min(90, Math.max(-30, (Math.atan2(world.y, world.x) * 180) / Math.PI));
    setC((prev) => ({ ...prev, speed: round(speed, 1), angle: round(angle, 0) }));
    setPlaying(false);
    setTSim(0);
  };

  /** 40 CSS px — an Apple-HIG-sized finger target whatever the render scale. */
  const GRAB_CSS_PX = 40;

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!aimTip) return;
    const hit = toWorld(e);
    if (!hit) return;
    const dViewBox = Math.hypot((hit.w.x - aimTip.x) * view.scale, (hit.w.y - aimTip.y) * view.scale);
    if (dViewBox * hit.fit > GRAB_CSS_PX) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setGrabbed(true);
    setTouchedAim(true);
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    const hit = toWorld(e);
    if (hit) applyAim(hit.w);
  };
  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grabbed) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    setGrabbed(false);
  };

  // ── outcomes ──────────────────────────────────────────────────────────────
  const targetTol = Math.max(0.9, 0.025 * Math.max(c.targetX, 1));
  const targetMiss = useMemo(() => {
    if (!flags.hasTarget) return null;
    let best = Infinity;
    for (const s of scene.live.points) best = Math.min(best, Math.hypot(s.pos.x - c.targetX, s.pos.y - c.targetY));
    return best;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, c.targetX, c.targetY, flags.hasTarget]);
  const targetHit = targetMiss === null ? null : targetMiss <= targetTol;

  const monkeyGap = useMemo(() => {
    if (scenario !== 'monkey-hunter' || !scene.monkey) return null;
    // Where does the dart cross the monkey's horizontal position?
    const pts = scene.live.points;
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].pos.x >= c.monkeyX) {
        const t = pts[i].t;
        const mk = sampleAt(scene.monkey, t);
        return { gap: pts[i].pos.y - mk.pos.y, t, reached: true };
      }
    }
    return { gap: NaN, t: scene.duration, reached: false };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, c.monkeyX, scenario]);
  const monkeyHit = monkeyGap?.reached ? Math.abs(monkeyGap.gap) <= 0.9 : false;

  // ── guided advance ────────────────────────────────────────────────────────
  const guidedDone = !setup.guided || step >= setup.steps.length;
  const advance = () => {
    setStep((s) => s + 1);
    if (step + 1 >= MAX_STAGE) setEverFired(true);
  };

  const fire = () => {
    setTSim(0);
    setPlaying(true);
    setEverFired(true);
    setAttempts((a) => a + 1);
  };
  const jumpToApex = () => {
    setPlaying(false);
    setTSim(Math.min(duration, scene.exact.apexT));
    setVisitedApex(true);
    setEverFired(true);
  };

  // ── field payload ─────────────────────────────────────────────────────────
  const fieldPaths: FieldPaths = {
    live: livePts,
    trail: trailPts,
    ideal: idealPts,
    partner: partnerPts,
    heavy: heavyPts,
    dropped: droppedPts,
    monkeyPath: monkeyPts,
    fan: fanPts,
    envelope: envPts,
    surface,
  };

  const at = (tr: Scene['dropped'], t: number): Pt | null =>
    tr ? project(sampleAt(tr, t)).pos : null;

  const fieldMarks: FieldMarks = {
    launch: launchD,
    ball: nowD.pos,
    vel: nowD.vel,
    accel: accelD,
    droppedBall: showPath ? at(scene.dropped, tSim) : null,
    heavyBall: showPath ? at(scene.heavy, tSim) : null,
    partnerBall: showPath ? at(scene.partner, tSim) : null,
    monkey: scenario === 'monkey-hunter' ? at(scene.monkey, showPath ? tSim : 0) : null,
    // The "if gravity did not exist" line. Held back to stage 2 so the student
    // has already taken a shot and been wrong before it appears.
    aim: scenario === 'monkey-hunter' && stage >= 2
      ? [{ x: 0, y: c.height }, { x: c.monkeyX * 1.25, y: c.height + c.monkeyX * 1.25 * Math.tan(deg2rad(c.angle)) }]
      : null,
    target: flags.hasTarget ? { x: c.targetX, y: c.targetY } : null,
    cart: frameKind === 'translating' || (canFrames && scenario === 'relative')
      ? { x: frameKind === 'translating' ? 0 : c.frameVx * tSim, y: c.height }
      : null,
    // Held back in target mode until the first shot — eight dots along the
    // flight would trace out the answer before the student has committed.
    equalTime: showPath && (!flags.hasTarget || everFired) ? equalTime : [],
  };

  // ── legend + readout ──────────────────────────────────────────────────────
  const unit = 'm';
  const legend: LegendRow[] = [];
  legend.push({ color: ACCENT, label: axisRotated ? 'Along the slope' : 'Horizontal', value: `${f1(nowD.pos.x)} ${unit}`, strong: true });
  legend.push({ color: ACCENT_2, label: axisRotated ? 'Perpendicular' : 'Vertical', value: `${f1(nowD.pos.y)} ${unit}`, strong: true });
  if (showVectors) legend.push({ color: 'rgba(255,255,255,0.85)', label: 'Velocity', value: `${f1(Math.hypot(nowD.vel.x, nowD.vel.y))} m/s` });
  if (scene.ideal) legend.push({ color: 'rgba(255,255,255,0.5)', dashed: true, label: 'Same shot in vacuum' });
  if (scene.partner) legend.push({ color: ACCENT, dashed: true, label: `Complement ${f1(P.complementaryAngle(c.angle))}°` });
  if (scene.heavy) legend.push({ color: ACCENT_2, label: `${f1(c.mass * 10)} kg ball` });
  if (scene.dropped) legend.push({ color: ACCENT_2, label: 'Simply dropped' });
  if (scene.monkey) legend.push({ color: ACCENT_2, dashed: true, label: 'The monkey, falling' });
  if (showEnvelope) legend.push({ color: 'rgba(255,255,255,0.55)', dashed: true, label: 'Parabola of safety' });

  // In rotated axes the launch components and the "highest point" are the
  // PERPENDICULAR quantities, not the vertical ones — printing world values
  // beside a rotated picture is exactly the kind of quiet contradiction the
  // readout exists to avoid. Perp. max = u_y′²/(2 g cosβ), from the derivation
  // in lib/projectile.ts rangeOnIncline.
  const cosB = Math.cos(deg2rad(c.incline));
  const uPerp = c.speed * Math.sin(deg2rad(c.angle - c.incline));
  const readout: ReadoutRow[] = [
    { label: axisRotated ? 'Range along slope' : 'Range', value: `${f2(scene.exact.range)} m`, color: ACCENT, strong: true },
    { label: 'Time of flight', value: `${f2(scene.exact.flightTime)} s` },
    axisRotated
      ? { label: 'Max lift off slope', value: `${f2((uPerp * uPerp) / (2 * c.g * Math.max(cosB, 1e-6)))} m`, color: ACCENT_2 }
      : { label: 'Highest point', value: `${f2(scene.exact.apexY)} m`, color: ACCENT_2 },
    { label: axisRotated ? 'u along slope' : 'u sideways', value: `${f2(vel0D.x)} m/s`, color: ACCENT },
    { label: axisRotated ? 'u off slope' : 'u upward', value: `${f2(vel0D.y)} m/s`, color: ACCENT_2 },
    { label: axisRotated ? 'now — v along' : 'now — v sideways', value: `${f2(nowD.vel.x)} m/s`, color: ACCENT },
    { label: axisRotated ? 'now — v off slope' : 'now — v upward', value: `${f2(nowD.vel.y)} m/s`, color: ACCENT_2 },
  ];
  if (axisRotated) {
    readout.push({ label: 'g along slope', value: `${f2(-c.g * Math.sin(deg2rad(c.incline)))} m/s²` });
    readout.push({ label: 'g off slope', value: `${f2(-c.g * cosB)} m/s²` });
  }

  const footnote = scene.exact.closedForm
    ? 'Exact values, from the algebra — not read off the drawing.'
    : 'Measured from the integrated path. With air resistance there is no closed formula to quote.';

  // ── the misconception this archetype is built to attack ───────────────────
  const card = misconception(arch?.targets, {
    tSim, apexT: scene.exact.apexT, visitedApex, finished: tSim >= duration - 1e-6 && everFired,
    fanOn, height: c.height, dragOn: c.dragOn, frame: frameKind, optimum: scene.exact.optimum,
    ux: scene.exact.ux, mass: c.mass, massCompare: !!scene.heavy, monkeyHit, everFired,
  });

  // ── render ────────────────────────────────────────────────────────────────
  const lineStrips = strips.filter((s) => s.mode === 'line');
  const graphStrips = strips.filter((s) => s.mode === 'graph');

  /*
   * The guided script and the predict gate, hoisted so they can be rendered in
   * either column.
   *
   * WHY: while the guided ladder is running, ▶ Fire is disabled (stage <
   * MAX_STAGE) and the ONLY thing that enables it is the CTA in the guided
   * panel. In two columns that panel sits beside the canvas and the relationship
   * is obvious. Stacked on a phone it would sit BELOW the canvas, the legend,
   * the strip labels and the transport row — so the first thing a student meets
   * is a dead Fire button, with the button that revives it off-screen. That is a
   * dead end, and dead ends get read as "the sim is broken".
   *
   * Same argument for the predict gate: "commit before you look" only works if
   * the question is above the thing you are not supposed to look at yet.
   */
  const intro = (
    <>
      {setup.guided && setup.steps.length > 0 && (
        <GuidedPanel steps={setup.steps} index={Math.min(step, setup.steps.length - 1)}
          done={guidedDone} onAdvance={advance} busy={false} />
      )}
      {block.predict && (
        <PredictGate
          prompt={block.predict.prompt}
          options={block.predict.options}
          answerIndex={block.predict.answer_index}
          reveal={block.predict.reveal}
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}
    </>
  );

  return (
    <SimShell>
      <SimHeader
        title={setup.title}
        subtitle={arch ? `${arch.id.replace(/-/g, ' ')} · motion lab` : 'motion lab'}
        badge={<span className="tabular-nums">{`t = ${f2(tSim)} s`}</span>}
      />

      {/*
        The Tailwind `lg:` pair is the pre-measurement fallback only — it keeps
        server-rendered HTML sensible for the one frame before the
        ResizeObserver reports. Once `wrapW` is known the inline
        gridTemplateColumns wins, and it is driven by the CONTAINER, so the
        admin editor's narrow preview pane stacks correctly even though the
        viewport behind it is a laptop. `minmax(0,…)` rather than a bare `7fr`
        because an auto minimum lets a wide SVG refuse to shrink and push the
        sidebar off the page.
      */}
      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? { gridTemplateColumns: stacked ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)',
              alignItems: stacked ? 'stretch' : 'start' }
          : undefined}
      >
        {/* ══ canvas column ══════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {stacked && intro}
          <div ref={canvasRef} className="relative overflow-hidden rounded-2xl"
            style={{ height: H, background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}>
            <Field
              view={view}
              strip={strip}
              ui={ui}
              paths={fieldPaths}
              marks={fieldMarks}
              flags={{
                grid: flags.grid,
                trail: flags.trail && showPath,
                vectors: showVectors && stage >= 1,
                components: showComponents && stage >= 1,
                strips: stripsOn,
                envelope: showEnvelope,
                showFullPath: showPath && (!flags.hasTarget || everFired),
                targetHit,
              }}
              vecPxPerUnit={vecPxPerUnit}
              accelPxPerUnit={accelPxPerUnit}
              clockLabel={`${f2(tSim)} s`}
              svgRef={svgRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              aimTip={aimTip}
              showGrabHint={!touchedAim && stage >= 1}
            />
          </div>

          {/* Colour-keyed legend — the canvas is not allowed to print any of this. */}
          <Legend rows={legend} />

          {/* Strip labels live here as HTML, never as SVG text (§4E). */}
          {stripsOn && (
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {lineStrips.map((s) => {
                const isY = s.axis === 'y' || s.axis === 'vy' || s.axis === 'ay';
                const col = isY ? ACCENT_2 : ACCENT;
                const val = isY ? nowD.pos.y : nowD.pos.x;
                return (
                  <div key={s.axis} className="flex items-baseline gap-2">
                    <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: col }}>
                      {isY ? '↕' : '↔'} {s.label}
                    </span>
                    <span className="text-[12px] font-semibold tabular-nums" style={{ color: TEXT.primary }}>
                      {f1(val)} {s.unit ?? 'm'}
                    </span>
                  </div>
                );
              })}
              <span className="text-[10px]" style={{ color: TEXT.muted }}>
                the eight faint dots on each track are equally spaced IN TIME
              </span>
            </div>
          )}

          {/* Transport. A scrubber is not a decoration here — stepping the flight
              by hand is how a student inspects the apex. */}
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={playing ? () => setPlaying(false) : fire} disabled={stage < MAX_STAGE}>
              {playing ? '❚❚ Pause' : tSim >= duration - 1e-6 ? '↺ Fire again' : '▶ Fire'}
            </ActionButton>
            <ActionButton onClick={jumpToApex} accent={ACCENT_2} disabled={stage < MAX_STAGE}>Jump to the top</ActionButton>
            <div className="flex flex-1 items-center gap-2" style={{ minWidth: 190 }}>
              <input
                type="range" min={0} max={duration} step={duration / 400} value={Math.min(tSim, duration)}
                onChange={(e) => { setPlaying(false); setTSim(parseFloat(e.target.value)); setEverFired(true); }}
                disabled={stage < MAX_STAGE}
                aria-label="Scrub through the flight"
                className="flex-1"
                // minHeight 44 + touchAction none: a bare range input is ~16px
                // tall, under half a finger, and dragging it on a phone scrolls
                // the page instead of scrubbing.
                style={{
                  accentColor: ACCENT,
                  cursor: stage < MAX_STAGE ? 'not-allowed' : 'pointer',
                  minHeight: 44,
                  touchAction: 'none',
                }}
              />
              <span className="tabular-nums text-[12px] font-semibold" style={{ color: TEXT.ghost, minWidth: 76, textAlign: 'right' }}>
                {f2(tSim)} / {f2(duration)} s
              </span>
            </div>
            <Toggle on={rate === 0.25} label="slow motion" onClick={() => setRate((r) => (r === 1 ? 0.25 : 1))} />
          </div>

          {/* graph-mode strips */}
          {graphStrips.length > 0 && stage >= 2 && (
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))' }}>
              {graphStrips.map((s) => {
                const isY = s.axis === 'y' || s.axis === 'vy' || s.axis === 'ay';
                const col = isY ? ACCENT_2 : ACCENT;
                const series = seriesFor(scene, s.axis, c.g, project);
                const cur = series.reduce((b, p) => (Math.abs(p.t - tSim) < Math.abs(b.t - tSim) ? p : b), series[0]);
                return (
                  <div key={s.axis + s.label}>
                    <div className="mb-1 flex items-baseline justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: col }}>{s.label}</span>
                      <span className="text-[12px] font-semibold tabular-nums" style={{ color: TEXT.primary }}>
                        {cur ? f1(cur.v) : '—'} {s.unit ?? ''}
                      </span>
                    </div>
                    <GraphStrip series={series} tNow={tSim} accent={col} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══ sidebar ════════════════════════════════════════════════════ */}
        <div className="flex flex-col gap-3">
          {!stacked && intro}

          {/* ── set the scene ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Set the launch</SectionLabel>
            <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
              {touchedAim
                ? 'Drag the handle on the arrow tip, or use the sliders.'
                : '👆 Drag the handle at the tip of the launch arrow — that sets speed and angle at once.'}
            </p>
            <SimSlider label="Speed" value={c.speed} min={2} max={60} step={0.5} unit="m/s"
              onChange={(v) => set('speed', v)} format={(v) => v.toFixed(1)} />
            <SimSlider label="Angle" value={c.angle} min={scenario === 'projectile-incline' ? -20 : 0} max={90} step={1} unit="°"
              onChange={(v) => set('angle', v)} accent={ACCENT_2} />
            {scenario !== 'projectile-incline' && (
              <SimSlider label="Height" value={c.height} min={0} max={40} step={0.1} unit="m"
                onChange={(v) => set('height', v)} accent={ACCENT_2} format={(v) => v.toFixed(1)} />
            )}
            {scenario === 'projectile-incline' && (
              <SimSlider label="Slope" value={c.incline} min={-35} max={35} step={1} unit="°"
                onChange={(v) => set('incline', v)} />
            )}
            {c.dragOn && (
              <>
                {/* k in F = k|v|v, kg/m. Range set around ½ρC_dA for a real
                    ball (≈1×10⁻³) — see pDragK in archetypes.projectile.ts. */}
                <SimSlider label="Air drag" value={c.dragK} min={0} max={0.02} step={0.0005} unit="kg/m"
                  onChange={(v) => set('dragK', v)} format={(v) => v.toFixed(4)} />
                <SimSlider label="Mass" value={c.mass} min={0.05} max={20} step={0.05} unit="kg"
                  onChange={(v) => set('mass', v)} accent={ACCENT_2} format={(v) => v.toFixed(2)} />
              </>
            )}
            {canFrames && (
              <SimSlider label="Cart speed" value={c.frameVx} min={-30} max={30} step={0.5} unit="m/s"
                onChange={(v) => set('frameVx', v)} format={(v) => v.toFixed(1)} />
            )}
          </div>

          {/* ── what to show ──────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            <Toggle on={showComponents} label="components" onClick={() => setShowComponents((v) => !v)} />
            <Toggle on={showVectors} label="v and a arrows" onClick={() => setShowVectors((v) => !v)} accent={ACCENT_2} />
            <Toggle on={c.dragOn} label="air resistance" onClick={() => set('dragOn', !c.dragOn)} />
            {flags.sweep && <Toggle on={fanOn} label="sweep every angle" onClick={() => setFanOn((v) => !v)} />}
            {(flags.envelope || flags.sweep) && (
              <Toggle on={showEnvelope} label="parabola of safety" onClick={() => setShowEnvelope((v) => !v)} accent={ACCENT_2} />
            )}
            {scenario === 'projectile-incline' && flags.axisRotate && (
              <Toggle on={axisRotated} label="rotate the axes" onClick={() => setAxisRotated((v) => !v)} accent={ACCENT_2} />
            )}
          </div>

          {/* ── frame toggle ──────────────────────────────────────────── */}
          {canFrames && (
            <Card tone={frameKind === 'ground' ? 'plain' : 'accent'}>
              <SectionLabel accent={ACCENT}>Who is watching?</SectionLabel>
              <div className="mt-2 flex gap-2">
                {(['ground', 'translating'] as const).map((k) => (
                  <button key={k} type="button" onClick={() => setFrameKind(k)}
                    className="flex-1 rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-all"
                    style={{
                      background: frameKind === k ? accentTint(ACCENT, 0.18) : 'rgba(255,255,255,0.02)',
                      borderColor: frameKind === k ? accentTint(ACCENT, 0.45) : BORDER.card,
                      color: frameKind === k ? ACCENT : TEXT.ghost, cursor: 'pointer',
                    }}>
                    {k === 'ground' ? 'On the platform' : 'Riding the trolley'}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                {frameKind === 'ground'
                  ? 'From the platform the ball keeps the trolley’s forward speed, so it curves away in a parabola and lands ahead of where it was released.'
                  : 'Riding along, the ball drops straight down past you. Same recording, same vertical track — only the observer changed.'}
              </p>
            </Card>
          )}

          {/* ── readout ───────────────────────────────────────────────── */}
          {flags.readout && <Readout rows={readout} footnote={footnote} />}

          {/* ── range-vs-angle ────────────────────────────────────────── */}
          {flags.rangeCurve && (
            <RangeCurve points={P.rangeCurve(c.speed, c.height, c.g, 90)} angle={c.angle}
              optimum={scene.exact.optimum} unitLabel="m" />
          )}

          {/* ── target challenge ──────────────────────────────────────── */}
          {flags.hasTarget && (
            <Card tone={targetHit ? 'ok' : everFired ? 'bad' : 'plain'}>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill tone={targetHit ? 'ok' : 'info'}>{targetHit ? 'Hit' : 'Your task'}</Pill>
                <span className="text-[11px]" style={{ color: TEXT.ghost }}>attempt {attempts}</span>
              </div>
              <p className="text-sm" style={{ color: TEXT.primary }}>
                Land the ball in the ring, {f1(c.targetX)} m away{c.targetY > 0 ? ` and ${f1(c.targetY)} m up` : ''}.
              </p>
              {everFired && targetMiss !== null && (
                <p className="mt-1.5 text-[13px]" style={{ color: targetHit ? OK : BAD }}>
                  {targetHit
                    ? `Closest approach ${f2(targetMiss)} m. Now find the OTHER angle that also works.`
                    : `Closest approach ${f2(targetMiss)} m — ${scene.exact.range < c.targetX ? 'you fell short' : 'you overshot'}. Change one thing at a time.`}
                </p>
              )}
            </Card>
          )}

          {/* ── monkey and hunter verdict ─────────────────────────────── */}
          {scenario === 'monkey-hunter' && (
            <Card tone={monkeyHit ? 'ok' : everFired ? 'bad' : 'plain'}>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill tone={monkeyHit ? 'ok' : 'info'}>{monkeyHit ? 'Hit' : 'Take aim'}</Pill>
                <span className="text-[11px]" style={{ color: TEXT.ghost }}>
                  aim straight at it = {f1((Math.atan2(c.monkeyY - c.height, c.monkeyX) * 180) / Math.PI)}°
                </span>
              </div>
              {everFired && monkeyGap && (
                <p className="text-[13px]" style={{ color: monkeyHit ? OK : BAD }}>
                  {!monkeyGap.reached
                    ? 'The dart hit the ground before it got there — more speed.'
                    : monkeyHit
                      ? 'Straight through. Both fell by exactly ½gt² from the aim line, at the same instant.'
                      : `Passed ${f2(Math.abs(monkeyGap.gap))} m ${monkeyGap.gap > 0 ? 'above' : 'below'} the monkey.`}
                </p>
              )}
            </Card>
          )}

          {card && <MisconceptionCard heading={card.heading} body={card.body} />}

          {block.numeric && (
            <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
              tolerance={block.numeric.tolerance} unit={block.numeric.unit}
              reveal={block.numeric.worked_reveal} />
          )}

          <ExpertTip>{expertTip(arch?.id)}</ExpertTip>
        </div>
      </div>

      {block.caption && (
        <p className={`mt-4 ${TYPE.body}`} style={{ color: TEXT.muted }}>{block.caption}</p>
      )}
    </SimShell>
  );
}

// ── graph-strip series ───────────────────────────────────────────────────────

function seriesFor(
  scene: Scene, axis: string, g: number, project: (s: MotionState) => { pos: Pt; vel: Pt }
): { t: number; v: number }[] {
  const out: { t: number; v: number }[] = [];
  const pts = scene.live.points;
  const every = Math.max(1, Math.floor(pts.length / 160));
  for (let i = 0; i < pts.length; i += every) {
    const d = project(pts[i]);
    const v =
      axis === 'x' ? d.pos.x
      : axis === 'y' ? d.pos.y
      : axis === 'vx' ? d.vel.x
      : axis === 'vy' ? d.vel.y
      : axis === 'speed' ? Math.hypot(d.vel.x, d.vel.y)
      : axis === 'ax' ? 0
      : -g;
    out.push({ t: pts[i].t, v });
  }
  return out;
}

// ── misconception copy ───────────────────────────────────────────────────────

interface MCtx {
  tSim: number; apexT: number; visitedApex: boolean; finished: boolean; fanOn: boolean;
  height: number; dragOn: boolean; frame: string; optimum: number; ux: number;
  mass: number; massCompare: boolean; monkeyHit: boolean; everFired: boolean;
}

/**
 * The card only appears once the sim has SHOWN the contradicting evidence.
 * Naming the wrong idea out loud is deliberate — design law #2 says the
 * feedback must attack a specific misconception rather than say "wrong".
 */
function misconception(code: MotionMisconception | undefined, x: MCtx): { heading: string; body: string } | null {
  if (!code) return null;
  const nearApex = x.everFired && Math.abs(x.tSim - x.apexT) < 0.12 && x.apexT > 0.05;

  switch (code) {
    case 'velocity_zero_at_apex':
      if (!nearApex && !x.visitedApex) return null;
      return {
        heading: 'At the top the ball is not at rest.',
        body: `Only the **upward** part of the velocity is zero there. The sideways part is still **${x.ux.toFixed(2)} m/s** — exactly what it was at launch, because nothing has pushed sideways. A ball that really stopped at the top would drop straight down from there.`,
      };
    case 'accel_zero_at_apex':
      if (!nearApex && !x.visitedApex) return null;
      return {
        heading: 'Gravity does not switch off at the top.',
        body: 'The dashed acceleration arrow is the same length and the same direction at the top as at every other instant. Velocity is momentarily zero in one direction; acceleration is not zero anywhere. That is precisely why the ball does not hang there.',
      };
    case 'coupled_components':
      if (!x.finished) return null;
      return {
        heading: 'Rising does not slow the sideways motion.',
        body: 'Watch the two tracks: the horizontal dot ticks along at a perfectly steady rate for the whole flight while the vertical one slows, stops and speeds back up. The eight faint stamps on each track are at equal times — evenly spread on one, bunched at the top on the other. Same motion, two independent stories.',
      };
    case 'range_always_max_at_45':
      if (!x.fanOn && x.height <= 0 && !x.dragOn) return null;
      return {
        heading: '45° is only the answer from ground level, in vacuum.',
        body: `With this launch height and this air, the furthest angle is **${x.optimum.toFixed(1)}°**. Extra height buys hang time for free, so it pays to spend more of the speed going forwards — which is why a shot-putter releases near 42°, not 45°.`,
      };
    case 'heavier_falls_faster':
      if (!x.massCompare || !x.finished) return null;
      return x.dragOn
        ? {
            heading: 'In air the heavy one does win — and only because of the air.',
            body: 'Drag gives an acceleration of k·v divided by m. The same air force barely troubles the heavy ball and badly slows the light one. Take the air away and the two curves land on top of each other again.',
          }
        : {
            heading: 'There is only one curve on screen, with two balls on it.',
            body: 'The 1 kg and the 10 kg ball are exactly on top of each other for the whole flight. Mass cancels out of a = g, so it cannot appear in the answer.',
          };
    case 'frame_confusion':
      if (x.frame === 'ground') return null;
      return {
        heading: 'Both observers are right.',
        body: 'Nothing about the ball changed when you pressed that button — only who is watching. Notice that the vertical track is identical in both views: a horizontal boost cannot alter a fall.',
      };
    default:
      return null;
  }
}

// ── closing note ─────────────────────────────────────────────────────────────

function expertTip(id?: string): string {
  switch (id) {
    case 'independence-of-components':
      return 'In every projectile question, write two columns before anything else: one for horizontal (no acceleration) and one for vertical (a = −g). Time is the only thing they share.';
    case 'apex-anatomy':
    case 'apex-gravity':
      return '“At the highest point” means v_y = 0. It never means v = 0, and it never means a = 0. Those three statements are marked differently.';
    case 'range-vs-angle':
    case 'same-range-pair':
      return 'Two angles give the same range on level ground: θ and 90° − θ. If a question gives you a range and asks for the angle, expect two answers unless it says otherwise.';
    case 'launch-from-height':
    case 'with-drag':
      return 'The moment there is a launch height or air, 45° stops being the answer. Real throwers release near 42° — worth remembering as a sanity check, not as a formula.';
    case 'incline-launch':
      return 'On a slope, rotate the axes first. Along the slope a = −g sin β, into the slope a = −g cos β, and landing is simply “perpendicular displacement back to zero”.';
    case 'monkey-hunter':
      return 'Aim along the line to the target, then forget gravity — it pulls both objects down by the same ½gt². This is the same reason you can catch a ball thrown to you inside a moving train.';
    case 'safety-envelope':
      return 'The reachable region at speed u tops out at u²/2g and reaches u²/g along the ground. Those two numbers bound every projectile question you will ever be set at that speed.';
    case 'cart-frame':
      return 'Change of frame only ever adds or removes a constant velocity. It cannot change an acceleration — which is why g is the same for both observers here.';
    default:
      return 'Split every projectile into two 1-D problems that share only a clock. Almost every mark in this chapter comes from doing that cleanly.';
  }
}
