'use client';

/*
 * motion-lab/graphs/GraphStudio.tsx — Motion Graph Studio, the Unit-1 flagship.
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 Unit 1. What makes this more than the
 * Class-9 `TripleGraphScrubberSim` — which already stacks three graphs and
 * drives them from one time slider — is that here the student DRAGS one of them
 * and the other two rebuild. That generation step is the whole difference
 * between watching a relationship and producing one.
 *
 * The five design laws, in order:
 *
 * 1. THE STUDENT IS THE AUTHOR. They choose which graph is live and then edit
 *    it: tangent handles on x–t, node handles on v–t, bars on a–t, or a freehand
 *    sweep across the velocity panel. `sketch-your-own` opens on a flat line and
 *    twelve handles — nothing is chosen for them at all.
 * 2. IT GRADES REASONING. Every archetype names its misconception and carries
 *    the sentence that breaks it, and the card fires only once the sim has SHOWN
 *    the contradicting evidence — see `evidenceReady` at the bottom of this file,
 *    which is a per-code gate, not a timer.
 * 3. IT SHOWS THE INVISIBLE MIDDLE STEP. Slope ↔ area duality, live: one cursor
 *    through three panels, the signed area filling as it moves, the position
 *    curve that IS that area.
 * 4. IT COMPOSES. Every number comes from the frozen `lib/integrate.ts` RK4 via
 *    `graphs/lib/kinematics.ts`, the same integrator the projectile module uses.
 * 5. IT IS GUIDED, NEVER AUTO-PLAYING. `playing` starts false; the reveal ladder
 *    is authored data (`arch.reveals`), one beat at a time.
 *
 * ── THE THREE IMPLEMENTATION RULES ──────────────────────────────────────────
 * • NEVER memoise on block identity — the admin editor recreates the block on
 *   every keystroke, and an identity-keyed memo would wipe a student's sketch
 *   mid-drag. Everything here keys on `studioKey(setup)`, a CONTENT hash.
 * • NEVER gate a drag on the animation clock. Editing works while playing,
 *   paused, finished, or before anything has been touched.
 * • POINTER EVENTS WITH CAPTURE, and grab radii in CSS pixels.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import { useAnimationFrame } from '../../simulations/_shared';
import type { GraphsArchetype, DriverAxis, RevealToken, RevealLadder } from './types';
import {
  buildSamples, sampleAt, rangesOf, signedArea, pathLength, sliceModel,
  chordSlope, averageSpeed, tangentSlope, uniformAccel, speedTrend, segCount,
  segAccel, turningTimes, duration as modelDuration, tStart, tEnd,
  type VtModel, type Sample,
} from './lib/kinematics';
import { layoutStack, panelAt, type PanelKey } from './lib/plot';
import { handlesFor, hitTest, applyDrag, applySketch, markerPoints, markerTimeAt, GRAB_PX, type Handle } from './lib/handles';
import { resolveStudio, studioKey } from './lib/resolve';
import { evidenceReady } from './lib/evidence';
import TripleCanvas from './TripleCanvas';
import {
  GraphsFrame, PanelPicker, JourneyLedger, AlgebraCheck, InstantStrip,
  Card, Pill, Toggle, ActionButton, NumericPanel, SectionLabel,
  ACCENT, ACCENT_2, TEXT, accentTint, clamp, f1, f2,
  type LegendRow,
} from './panels';

/** Everything visible, for the non-guided case and once the ladder is done. */
const ALL_TOKENS: RevealToken[] = ['x', 'v', 'a', 'area', 'tangent', 'chord', 'edit'];

/**
 * The ladder used when an archetype does not author one: the panels in stacking
 * order, then editing. Deliberately dull — an archetype whose lesson needs a
 * different order should say so in its data rather than rely on this.
 */
function defaultLadder(steps: number): RevealLadder {
  const base: RevealLadder = [['x', 'tangent'], ['v', 'area'], ['a'], ['edit', 'chord']];
  if (steps <= 0) return [];
  if (steps >= base.length) {
    const out = base.slice();
    while (out.length < steps) out.push([]);
    return out;
  }
  // Fewer beats than rungs: fold the tail into the last beat rather than
  // leaving 'edit' unreachable, which would ship a read-only flagship.
  const out = base.slice(0, steps - 1);
  out.push(base.slice(steps - 1).flat());
  return out;
}

type DragState =
  | { kind: 'handle'; handle: Handle }
  | { kind: 'marker'; which: 'a' | 'b' }
  | { kind: 'paint'; last: { x: number; y: number } }
  | { kind: 'scrub' };

export default function GraphStudio({ block, arch }: { block: MotionBenchBlock; arch: GraphsArchetype }) {
  // Content key, never block identity. See the file header.
  const setupKey = JSON.stringify([
    block.archetype, block.params, block.steps, block.guided, block.height, block.predict, block.numeric,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setup = useMemo(() => resolveStudio(block, arch), [setupKey]);
  const seed = studioKey(setup);

  // ── live state ────────────────────────────────────────────────────────────
  const [model, setModel] = useState<VtModel>(setup.model);
  const [driver, setDriver] = useState<DriverAxis>(setup.driver);
  const [cursorT, setCursorT] = useState(tStart(setup.model));
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);
  const [step, setStep] = useState(setup.guided ? 0 : 999);
  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [touched, setTouched] = useState(false);
  const [edited, setEdited] = useState(false);
  const [visitedTrend, setVisitedTrend] = useState(false);
  const [visitedTurn, setVisitedTurn] = useState(false);
  const [visitedFlat, setVisitedFlat] = useState<{ atRest: boolean; uniform: boolean }>({ atRest: false, uniform: false });
  const [movedMarkers, setMovedMarkers] = useState(false);

  const t0 = tStart(setup.model);
  const t1 = tEnd(setup.model);
  const [markA, setMarkA] = useState(t0 + (t1 - t0) * setup.markA);
  const [markB, setMarkB] = useState(t0 + (t1 - t0) * setup.markB);

  // Re-seed on AUTHORED change only.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setModel(setup.model);
    setDriver(setup.driver);
    setCursorT(tStart(setup.model));
    setPlaying(false);
    setStep(setup.guided ? 0 : 999);
    setPredictChoice(null);
    setEdited(false);
    setTouched(false);
    setVisitedTrend(false);
    setVisitedTurn(false);
    setVisitedFlat({ atRest: false, uniform: false });
    setMovedMarkers(false);
    setMarkA(tStart(setup.model) + (tEnd(setup.model) - tStart(setup.model)) * setup.markA);
    setMarkB(tStart(setup.model) + (tEnd(setup.model) - tStart(setup.model)) * setup.markB);
  }, [seed]);

  // ── the reveal ladder ─────────────────────────────────────────────────────
  const ladder = arch.reveals ?? defaultLadder(setup.steps.length);
  const guidedDone = !setup.guided || step >= setup.steps.length;
  const visible = useMemo(() => {
    const on = new Set<RevealToken>();
    if (!setup.guided || step >= setup.steps.length) {
      for (const tk of ALL_TOKENS) on.add(tk);
      return on;
    }
    for (let i = 0; i <= Math.min(step, ladder.length - 1); i++) {
      for (const tk of ladder[i] ?? []) on.add(tk);
    }
    return on;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, setup.guided, setup.steps.length, seed]);

  const reveal = { x: visible.has('x'), v: visible.has('v'), a: visible.has('a') };
  const showArea = setup.area && visible.has('area') && reveal.v;
  const showTangent = setup.tangent && visible.has('tangent') && reveal.x;
  const showChord = setup.chord && visible.has('chord') && reveal.x;
  const editable = visible.has('edit');

  // ── the ONE dataset ───────────────────────────────────────────────────────
  const samples: Sample[] = useMemo(() => buildSamples(model), [model]);
  const ranges = useMemo(() => rangesOf(samples, model), [samples, model]);
  const dur = modelDuration(model);

  // ── layout ────────────────────────────────────────────────────────────────
  const svgRef = useRef<SVGSVGElement | null>(null);
  const stackRef = useRef<{ w: number; h: number }>({ w: 560, h: 420 });
  const focus: PanelKey | null = editable ? driver : null;

  const buildStack = (w: number, h: number) => {
    stackRef.current = { w, h };
    return layoutStack(w, h, tStart(model), tEnd(model), ranges, { focus });
  };
  // A stack for the pointer handlers, built from the last measured box. Pointer
  // maths must never re-derive geometry independently of the drawing — that is
  // how a handle ends up drawn in one place and grabbable in another.
  const stackForPointer = layoutStack(
    stackRef.current.w, stackRef.current.h, tStart(model), tEnd(model), ranges, { focus }
  );

  // ── clock ─────────────────────────────────────────────────────────────────
  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame(
    (dt) => setCursorT((t) => Math.min(tEnd(model), t + dt * rate)),
    { enabled: playing, target: wrapRef }
  );
  useEffect(() => {
    if (playing && cursorT >= tEnd(model) - 1e-6) setPlaying(false);
  }, [playing, cursorT, model]);

  // ── evidence tracking, for the misconception gate ─────────────────────────
  const now = sampleAt(samples, cursorT);
  const trend = speedTrend(now.v, now.a);
  // Turning points come from the MODEL, not from `trend === 'turning'`: that
  // verdict needs |v| ≤ 1e-9 and a cursor moving in finite steps never lands
  // there, which would leave the card unreachable. 0.15 s is close enough that
  // the readouts on screen genuinely show v ≈ 0.
  const turns = useMemo(() => turningTimes(model), [model]);
  useEffect(() => {
    if (trend === 'slowing-down' && Math.abs(now.a) > 1e-6) setVisitedTrend(true);
    if (turns.some((tt) => Math.abs(cursorT - tt) < 0.15)) setVisitedTurn(true);
    if (Math.abs(now.v) < 0.35) setVisitedFlat((p) => (p.atRest ? p : { ...p, atRest: true }));
    if (Math.abs(now.a) < 1e-6 && Math.abs(now.v) > 0.35) {
      setVisitedFlat((p) => (p.uniform ? p : { ...p, uniform: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorT, trend, now.a, now.v, turns]);

  // ── pointer plumbing ──────────────────────────────────────────────────────

  /**
   * Client coords → viewBox coords, plus the viewBox-to-CSS-pixel factor.
   *
   * `fit` is returned because the grab radius has to be expressed in CSS pixels:
   * the viewBox tracks the measured box so `fit` is ~1 in practice, but the
   * general form is also correct during the one frame between a resize and the
   * ResizeObserver callback — which is exactly when a fast drag lands.
   */
  const toBox = (e: React.PointerEvent<SVGSVGElement>): { x: number; y: number; fit: number } | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const s = stackForPointer;
    const fit = Math.min(rect.width / s.w, rect.height / s.h);
    if (!(fit > 0)) return null;
    return {
      x: (e.clientX - rect.left - (rect.width - s.w * fit) / 2) / fit,
      y: (e.clientY - rect.top - (rect.height - s.h * fit) / 2) / fit,
      fit,
    };
  };

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const at = toBox(e);
    if (!at) return;
    const s = stackForPointer;
    const grab = GRAB_PX / Math.max(at.fit, 1e-3);

    // 1. the chord's two markers
    if (showChord) {
      const mk = markerPoints(s, model, markA, markB);
      if (mk) {
        const dA = Math.hypot(at.x - mk.a.cx, at.y - mk.a.cy);
        const dB = Math.hypot(at.x - mk.b.cx, at.y - mk.b.cy);
        if (Math.min(dA, dB) <= grab) {
          e.currentTarget.setPointerCapture(e.pointerId);
          setDrag({ kind: 'marker', which: dA <= dB ? 'a' : 'b' });
          setTouched(true);
          setMovedMarkers(true);
          return;
        }
      }
    }

    // 2. an edit handle
    if (editable) {
      // Built here rather than at render time so hit-testing can never use a
      // stack from a previous measurement while the drawing uses the current one.
      const hit = hitTest(handlesFor(s, model, setup.sketch ? 'v' : driver), at.x, at.y, grab);
      if (hit) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ kind: 'handle', handle: hit });
        setTouched(true);
        return;
      }
      // 3. the freehand sweep — anywhere inside the velocity panel
      if (setup.sketch) {
        const p = panelAt(s, at.y);
        if (p?.key === 'v') {
          e.currentTarget.setPointerCapture(e.pointerId);
          setModel((m) => applySketch(m, s, null, { x: at.x, y: at.y }));
          setDrag({ kind: 'paint', last: { x: at.x, y: at.y } });
          setTouched(true);
          setEdited(true);
          return;
        }
      }
    }

    // 4. otherwise scrub the shared cursor. Deliberate: the cursor IS the reading
    //    instrument on a graph, and dragging it is how a student inspects an
    //    instant. There is also an explicit slider below, so this is a shortcut
    //    rather than the only route.
    e.currentTarget.setPointerCapture(e.pointerId);
    setPlaying(false);
    setCursorT(markerTimeAt(s, at.x));
    setDrag({ kind: 'scrub' });
  };

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const at = toBox(e);
    if (!at) return;
    const s = stackForPointer;

    if (drag.kind === 'scrub') { setCursorT(markerTimeAt(s, at.x)); return; }

    if (drag.kind === 'marker') {
      const t = markerTimeAt(s, at.x);
      if (drag.which === 'a') setMarkA(t); else setMarkB(t);
      return;
    }

    if (drag.kind === 'handle') {
      setModel((m) => applyDrag(m, drag.handle, s, at.x, at.y));
      setEdited(true);
      return;
    }

    setModel((m) => applySketch(m, s, drag.last, { x: at.x, y: at.y }));
    setDrag({ kind: 'paint', last: { x: at.x, y: at.y } });
    setEdited(true);
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    setDrag(null);
  };

  // ── derived quantities ────────────────────────────────────────────────────
  const soFar = sliceModel(model, tStart(model), cursorT);
  const distSoFar = pathLength(soFar);
  const dispSoFar = signedArea(soFar);
  const totalDist = pathLength(model);
  const totalDisp = signedArea(model);
  const elapsed = Math.max(1e-9, cursorT - tStart(model));

  // The three constant-acceleration equations describe ONE phase, so the card
  // quotes the first phase's own duration rather than the whole run. Feeding it
  // the total time with the first segment's a would print a confident wrong
  // number under a warning saying the equations do not apply — which is how a
  // student learns to ignore warnings.
  const singlePhase = segCount(model) === 1;
  const phaseEnd = model.ts[1] ?? tEnd(model);
  const closed = uniformAccel(model.vs[0], segAccel(model, 0), phaseEnd - tStart(model));
  const endSample = sampleAt(samples, phaseEnd);

  const chordV = chordSlope(model, markA, markB);
  const midT = (markA + markB) / 2;
  const tangentMid = tangentSlope(model, midT);
  const tangentNow = tangentSlope(model, cursorT);

  // ── legend: what the COLOURS mean. Values live in the readout. ────────────
  const legend: LegendRow[] = [];
  legend.push({ color: ACCENT, label: 'the motion — all three panels', strong: true });
  if (showArea) legend.push({ color: ACCENT_2, label: 'below the axis: going backwards, and this area subtracts' });
  if (showTangent) legend.push({ color: 'rgba(255,255,255,0.8)', label: 'tangent — the velocity at the cursor' });
  if (showChord) legend.push({ color: ACCENT_2, label: 'chord — the average velocity between the two markers' });
  if (editable) legend.push({ color: accentTint(ACCENT, 0.9), label: `handles — you are drawing the ${driver === 'x' ? 'x–t tangents' : driver === 'v' ? 'v–t graph' : 'a–t bars'}` });

  const trendLabel =
    trend === 'speeding-up'
      ? `Speeding up. v = ${f2(now.v)} m/s and a = ${f2(now.a)} m/s² point the SAME way.`
      : trend === 'slowing-down'
        ? `Slowing down — even though a = ${f2(now.a)} m/s². v = ${f2(now.v)} m/s and a point OPPOSITE ways.`
        : trend === 'turning'
          ? `Momentarily at rest, and still accelerating at ${f2(now.a)} m/s². This is the turning point.`
          : 'Steady — the speed is not changing at this instant.';
  const trendTone: 'up' | 'down' | 'flat' =
    trend === 'speeding-up' ? 'up' : trend === 'slowing-down' || trend === 'turning' ? 'down' : 'flat';

  const card = evidenceReady(arch.targets, {
    finished: cursorT >= tEnd(model) - 1e-6,
    edited,
    reveal,
    visitedTrend,
    visitedTurn,
    visitedFlat,
    movedMarkers,
    diverges: Math.abs(totalDist - Math.abs(totalDisp)) > 0.01 * Math.max(totalDist, 1),
    fracSeen: (cursorT - tStart(model)) / Math.max(1e-9, dur),
  })
    ? { belief: arch.attacks.belief, attack: arch.attacks.attack }
    : null;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div ref={wrapRef}>
      <GraphsFrame
        title={setup.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · motion graph studio`}
        badge={<span className="tabular-nums">{`t = ${f2(cursorT)} s`}</span>}
        panelCount={3}
        maxH={block.height}
        frozen={!!drag}
        guided={setup.guided ? { steps: setup.steps, index: Math.min(step, setup.steps.length - 1), done: guidedDone, onAdvance: () => setStep((s) => s + 1) } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        legend={legend}
        renderCanvas={(w, h) => {
          const stack = buildStack(w, h);
          const hs = editable ? handlesFor(stack, model, setup.sketch ? 'v' : driver) : [];
          return (
            <TripleCanvas
              stack={stack}
              samples={samples}
              model={model}
              cursorT={cursorT}
              driver={editable ? (setup.sketch ? 'v' : driver) : null}
              handles={hs}
              grabbed={drag?.kind === 'handle' ? drag.handle : null}
              reveal={reveal}
              showArea={showArea}
              showTangent={showTangent}
              chord={showChord ? { tA: markA, tB: markB } : null}
              errorWindow={null}
              sketch={setup.sketch}
              svgRef={svgRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              showGrabHint={editable && !touched}
            />
          );
        }}
        belowCanvas={
          <div className="flex flex-col gap-3">
            {/* Transport. Stepping the motion by hand is how a student inspects
                a turning point, so the scrubber is not a decoration. */}
            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                onClick={() => {
                  if (playing) { setPlaying(false); return; }
                  if (cursorT >= tEnd(model) - 1e-6) setCursorT(tStart(model));
                  setPlaying(true);
                }}
              >
                {playing ? '❚❚ Pause' : cursorT >= tEnd(model) - 1e-6 ? '↺ Replay' : '▶ Play it through'}
              </ActionButton>
              <div className="flex flex-1 items-center gap-2" style={{ minWidth: 190 }}>
                <input
                  type="range" min={tStart(model)} max={tEnd(model)} step={dur / 400}
                  value={clamp(cursorT, tStart(model), tEnd(model))}
                  onChange={(e) => { setPlaying(false); setCursorT(parseFloat(e.target.value)); }}
                  aria-label="Move the time cursor"
                  className="flex-1"
                  // 44 px + touchAction none: a bare range input is ~16 px tall,
                  // under half a fingertip, and on a phone dragging it scrolls
                  // the page instead of scrubbing.
                  style={{ accentColor: ACCENT, cursor: 'pointer', minHeight: 44, touchAction: 'none' }}
                />
                <span className="tabular-nums text-[12px] font-semibold"
                  style={{ color: TEXT.ghost, minWidth: 76, textAlign: 'right' }}>
                  {f2(cursorT)} / {f2(tEnd(model))} s
                </span>
              </div>
              <Toggle on={rate === 0.3} label="slow motion" onClick={() => setRate((r) => (r === 1 ? 0.3 : 1))} />
            </div>

            {/* The three panel names as HTML, never as SVG text (§4E). */}
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {([['x', 'position — metres'], ['v', 'velocity — m/s'], ['a', 'acceleration — m/s²']] as [PanelKey, string][])
                .map(([k, label]) => (
                  <span key={k} className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: reveal[k] ? (driver === k && editable ? ACCENT : TEXT.ghost) : TEXT.muted }}>
                    {reveal[k] ? '' : '· '}{label}{driver === k && editable ? ' · live' : ''}
                  </span>
                ))}
              <span className="text-[10px]" style={{ color: TEXT.muted }}>
                one cursor, one clock — the three panels are one dataset
              </span>
            </div>
          </div>
        }
        controls={
          <div className="flex flex-col gap-3">
            {editable && !setup.sketch && (
              <PanelPicker driver={driver} onChange={(d) => { setDriver(d); setTouched(false); }} />
            )}
            {editable && setup.sketch && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>Sketch the velocity graph</SectionLabel>
                <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                  Sweep your finger across the middle panel — the handles follow it. Go below the zero line and the
                  body starts heading back the way it came.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ActionButton onClick={() => { setModel(setup.model); setEdited(false); }}>Clear the sketch</ActionButton>
                </div>
              </Card>
            )}
            {!editable && (
              <Card>
                <div className="flex items-center gap-2">
                  <Pill tone="info">Read it first</Pill>
                </div>
                <p className="mt-1.5 text-sm" style={{ color: TEXT.secondary }}>
                  The panels are being built up one at a time. Work through the steps above and the handles unlock at
                  the end — nothing here is hidden, it is just not drawn yet.
                </p>
              </Card>
            )}

            {/* Reset. A student who has dragged their way into nonsense needs a
                way back that is not "reload the page". */}
            {edited && !setup.sketch && (
              <div>
                <ActionButton accent={ACCENT_2} onClick={() => { setModel(setup.model); setEdited(false); }}>
                  ↺ Back to the original motion
                </ActionButton>
              </div>
            )}
          </div>
        }
        panels={
          <div className="flex flex-col gap-3">
            {/* Values are blanked for panels that have not been revealed yet —
                design law #5 says no number appears before the student has been
                shown where it comes from. */}
            <InstantStrip t={cursorT} x={now.x} v={now.v} a={now.a} show={reveal}
              trendLabel={trendLabel} trendTone={trendTone}
              trendReady={reveal.v && reveal.a} />

            {setup.ledger && (
              <JourneyLedger
                distance={distSoFar}
                displacement={dispSoFar}
                avgSpeed={distSoFar / elapsed}
                avgVelocity={dispSoFar / elapsed}
                note={
                  Math.abs(distSoFar - Math.abs(dispSoFar)) > 0.01 * Math.max(distSoFar, 1)
                    ? 'These have separated, which means the motion has reversed. Total path length keeps growing; the displacement can fall.'
                    : 'Equal so far — nothing has turned back yet. The moment it does, these two part company.'
                }
              />
            )}

            {setup.equations && (
              <AlgebraCheck
                u={model.vs[0]}
                closed={closed}
                fromGraph={{ v: endSample.v, s: endSample.x - model.x0 }}
                valid={singlePhase}
              />
            )}

            {showChord && (
              <Card>
                <SectionLabel accent={ACCENT_2}>Chord against tangent</SectionLabel>
                <div className="mt-1.5 flex flex-col gap-1">
                  <Row label={`average velocity, ${f1(markA)} s → ${f1(markB)} s`} value={`${f2(chordV)} m/s`} colour={ACCENT_2} />
                  <Row label={`velocity at the midpoint, ${f1(midT)} s`} value={`${f2(tangentMid)} m/s`} colour="rgba(255,255,255,0.85)" />
                  <Row label={`velocity at the cursor, ${f1(cursorT)} s`} value={`${f2(tangentNow)} m/s`} colour={ACCENT} />
                  <Row label={`average SPEED over the same stretch`} value={`${f2(averageSpeed(model, markA, markB))} m/s`} colour={ACCENT} />
                </div>
                <p className="mt-2 text-[11px] leading-snug" style={{ color: TEXT.muted }}>
                  {Math.abs(chordV - tangentMid) < 1e-6
                    ? 'These two agree exactly, which happens only while the acceleration is constant — then the chord slope equals the velocity at the midpoint.'
                    : 'The chord and the midpoint tangent disagree here, because the acceleration is not constant across this stretch. Drag the markers closer and watch the gap close.'}
                </p>
              </Card>
            )}

            {block.numeric && (
              <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
                tolerance={block.numeric.tolerance} unit={block.numeric.unit}
                reveal={block.numeric.worked_reveal} />
            )}
          </div>
        }
        misconception={card}
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}

function Row({ label, value, colour }: { label: string; value: string; colour: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT.ghost }}>{label}</span>
      <span className="tabular-nums text-[13px] font-semibold" style={{ color: colour }}>{value}</span>
    </div>
  );
}
