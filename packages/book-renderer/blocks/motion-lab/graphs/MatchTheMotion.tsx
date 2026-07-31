'use client';

/*
 * motion-lab/graphs/MatchTheMotion.tsx — reproduce the target, get graded.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── WHAT THE CLASS-9 SIM ALREADY DOES, AND WHY THIS IS NOT IT ───────────────
 * `simulations/MatchTheMotionSim.tsx` (377 lines) is a real-time driving game: a
 * target x–t curve is shown, the student holds a velocity slider for ten seconds
 * while a puck runs, and a match PERCENTAGE is printed at the end. Three fixed
 * levels. It is a good Class-9 exercise and it teaches hand-eye reading of a
 * curve.
 *
 * It is not this, in three ways that matter for Class 11:
 *
 * 1. THE STUDENT NEVER DRAWS A GRAPH. They hold a slider and a graph is drawn
 *    FOR them, in real time, once. Here they compose the graph itself, at their
 *    own pace, and can revise any phase without redoing the run — which is the
 *    difference between a reflex task and a reasoning task.
 * 2. A PERCENTAGE IS NOT A DIAGNOSIS. 87% tells a student nothing they can act
 *    on. `lib/grade.ts` instead names the fault — a constant offset, a sign flip,
 *    the right phases mistimed, one bad phase — and shades the stretch that
 *    failed. That is design law #2; a score is not.
 * 3. ONLY ONE GRAPH IS GRADED, AND ALL THREE MATCH. The reward for matching the
 *    v–t target is that the x–t and a–t panels match as well, without having been
 *    touched. That is the whole point of the module, and it needs the triple view
 *    the Class-9 sim does not have.
 *
 * So both exist for a reason and neither replaces the other. The Class-9 one
 * stays where it is.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import { useAnimationFrame } from '../../simulations/_shared';
import type { GraphsArchetype } from './types';
import {
  buildSamples, sampleAt, rangesOf, signedArea, pathLength, sliceModel,
  tStart, tEnd, duration as modelDuration, speedTrend,
  type VtModel, type Sample,
} from './lib/kinematics';
import { layoutStack, panelAt } from './lib/plot';
import { handlesFor, hitTest, applyDrag, applySketch, markerTimeAt, GRAB_PX, type Handle } from './lib/handles';
import { resolveStudio, studioKey, blankAttempt } from './lib/resolve';
import { gradeMatch, type MatchReport } from './lib/grade';
import TripleCanvas from './TripleCanvas';
import {
  GraphsFrame, MatchReportCard, JourneyLedger, InstantStrip,
  Card, ActionButton, Toggle, SectionLabel,
  ACCENT, ACCENT_2, TEXT, clamp, f2,
  type LegendRow,
} from './panels';

type DragState =
  | { kind: 'handle'; handle: Handle }
  | { kind: 'paint'; last: { x: number; y: number } }
  | { kind: 'scrub' };

export default function MatchTheMotion({ block, arch }: { block: MotionBenchBlock; arch: GraphsArchetype }) {
  const setupKey = JSON.stringify([
    block.archetype, block.params, block.steps, block.guided, block.height, block.predict, block.numeric,
  ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setup = useMemo(() => resolveStudio(block, arch), [setupKey]);
  const seed = studioKey(setup);

  const target = setup.model;
  const graded = setup.gradedOn;

  const [attempt, setAttempt] = useState<VtModel>(() => blankAttempt(target, setup.nodes));
  const [cursorT, setCursorT] = useState(tStart(target));
  const [playing, setPlaying] = useState(false);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [touched, setTouched] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [checked, setChecked] = useState(false);
  const [report, setReport] = useState<MatchReport | null>(null);
  const [step, setStep] = useState(setup.guided ? 0 : 999);
  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [showTarget, setShowTarget] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setAttempt(blankAttempt(setup.model, setup.nodes));
    setCursorT(tStart(setup.model));
    setPlaying(false);
    setAttempts(0);
    setChecked(false);
    setReport(null);
    setStep(setup.guided ? 0 : 999);
    setPredictChoice(null);
    setTouched(false);
    setShowTarget(true);
  }, [seed]);

  const guidedDone = !setup.guided || step >= setup.steps.length;
  /**
   * The reveal ladder here is simpler than the studio's: the target and the
   * student's own line are on screen from the first beat, because the task is to
   * compare them. What the ladder gates is EDITING — the student reads the
   * target's shape before touching a handle, which is the habit the exercise is
   * really training.
   */
  const editable = !setup.guided || step >= 1;
  const showOthers = !setup.guided || step >= 3;
  // The GRADED panel is always on, whichever it is: the task is to match a target
  // and a target you cannot see is not a task. `graded_on` is authorable, so
  // deriving this rather than hardcoding 'v' is what stops an author from
  // shipping an invisible target by changing one select.
  const reveal = { x: showOthers || graded === 'x', v: true, a: showOthers };

  // ── the two datasets ──────────────────────────────────────────────────────
  const attemptSamples: Sample[] = useMemo(() => buildSamples(attempt), [attempt]);
  const targetSamples: Sample[] = useMemo(() => buildSamples(target), [target]);
  const dur = modelDuration(target);

  // The window must hold BOTH curves, or the target could be drawn off-panel and
  // the student would be asked to match something they cannot see.
  const ranges = useMemo(
    () => rangesOf([...attemptSamples, ...targetSamples], attempt),
    [attemptSamples, targetSamples, attempt]
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<{ w: number; h: number }>({ w: 560, h: 420 });
  const stackForPointer = layoutStack(
    stackRef.current.w, stackRef.current.h, tStart(target), tEnd(target), ranges, { focus: editable ? 'v' : null }
  );

  useAnimationFrame(
    (dt) => setCursorT((t) => Math.min(tEnd(target), t + dt)),
    { enabled: playing, target: wrapRef }
  );
  useEffect(() => {
    if (playing && cursorT >= tEnd(target) - 1e-6) setPlaying(false);
  }, [playing, cursorT, target]);

  // ── pointer plumbing ──────────────────────────────────────────────────────
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

    if (editable) {
      const hit = hitTest(handlesFor(s, attempt, 'v'), at.x, at.y, grab);
      if (hit) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDrag({ kind: 'handle', handle: hit });
        setTouched(true);
        setChecked(false);
        return;
      }
      const p = panelAt(s, at.y);
      if (p?.key === 'v') {
        // A sweep across the velocity panel paints several handles at once, which
        // is how a student lays a whole phase down in one gesture.
        e.currentTarget.setPointerCapture(e.pointerId);
        setAttempt((m) => applySketch(m, s, null, { x: at.x, y: at.y }));
        setDrag({ kind: 'paint', last: { x: at.x, y: at.y } });
        setTouched(true);
        setChecked(false);
        return;
      }
    }

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
    if (drag.kind === 'handle') { setAttempt((m) => applyDrag(m, drag.handle, s, at.x, at.y)); return; }
    setAttempt((m) => applySketch(m, s, drag.last, { x: at.x, y: at.y }));
    setDrag({ kind: 'paint', last: { x: at.x, y: at.y } });
  };

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already released */ }
    setDrag(null);
  };

  // ── grading ───────────────────────────────────────────────────────────────
  const check = () => {
    const r = gradeMatch(target, attempt, setup.tolerance, graded);
    setReport(r);
    setChecked(true);
    setAttempts((a) => a + 1);
  };

  const now = sampleAt(attemptSamples, cursorT);
  const trend = speedTrend(now.v, now.a);
  const soFar = sliceModel(attempt, tStart(attempt), cursorT);
  const elapsed = Math.max(1e-9, cursorT - tStart(attempt));

  const legend: LegendRow[] = [
    { color: ACCENT, label: 'your graph', strong: true },
    { color: 'rgba(255,255,255,0.55)', dashed: true, label: 'the target you have to match' },
    { color: 'rgba(110,231,183,0.6)', label: 'the band you have to stay inside' },   // sim-lint-ok — OK is the pass/fail pair
  ];
  if (setup.area) legend.push({ color: ACCENT_2, label: 'below the axis: going backwards, and this area subtracts' });

  const trendLabel =
    trend === 'speeding-up'
      ? `Speeding up — v = ${f2(now.v)} m/s and a = ${f2(now.a)} m/s² point the same way.`
      : trend === 'slowing-down'
        ? `Slowing down, with a = ${f2(now.a)} m/s². v and a point opposite ways.`
        : trend === 'turning'
          ? `Momentarily at rest, still accelerating at ${f2(now.a)} m/s².`
          : 'Steady — the speed is not changing here.';

  return (
    <div ref={wrapRef}>
      <GraphsFrame
        title={setup.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · match the motion`}
        badge={<span className="tabular-nums">{`t = ${f2(cursorT)} s`}</span>}
        panelCount={3}
        maxH={block.height}
        frozen={!!drag}
        guided={setup.guided ? { steps: setup.steps, index: Math.min(step, setup.steps.length - 1), done: guidedDone, onAdvance: () => setStep((s) => s + 1) } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        legend={legend}
        renderCanvas={(w, h) => {
          stackRef.current = { w, h };
          const stack = layoutStack(w, h, tStart(target), tEnd(target), ranges, { focus: editable ? 'v' : null });
          return (
            <TripleCanvas
              stack={stack}
              samples={attemptSamples}
              model={attempt}
              ghost={showTarget ? { samples: targetSamples, model: target } : null}
              ghostOn={graded === 'x' ? 'x' : 'v'}
              tolerance={showTarget ? setup.tolerance : null}
              cursorT={cursorT}
              driver={editable ? 'v' : null}
              handles={editable ? handlesFor(stack, attempt, 'v') : []}
              grabbed={drag?.kind === 'handle' ? drag.handle : null}
              reveal={reveal}
              showArea={setup.area}
              showTangent={false}
              chord={null}
              errorWindow={checked && report && !report.pass ? report.window : null}
              sketch
              svgRef={svgRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              showGrabHint={editable && !touched}
            />
          );
        }}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton
              onClick={() => {
                if (playing) { setPlaying(false); return; }
                if (cursorT >= tEnd(target) - 1e-6) setCursorT(tStart(target));
                setPlaying(true);
              }}
            >
              {playing ? '❚❚ Pause' : cursorT >= tEnd(target) - 1e-6 ? '↺ Replay' : '▶ Play your motion'}
            </ActionButton>
            <div className="flex flex-1 items-center gap-2" style={{ minWidth: 190 }}>
              <input
                type="range" min={tStart(target)} max={tEnd(target)} step={dur / 400}
                value={clamp(cursorT, tStart(target), tEnd(target))}
                onChange={(e) => { setPlaying(false); setCursorT(parseFloat(e.target.value)); }}
                aria-label="Move the time cursor"
                className="flex-1"
                style={{ accentColor: ACCENT, cursor: 'pointer', minHeight: 44, touchAction: 'none' }}
              />
              <span className="tabular-nums text-[12px] font-semibold"
                style={{ color: TEXT.ghost, minWidth: 76, textAlign: 'right' }}>
                {f2(cursorT)} / {f2(tEnd(target))} s
              </span>
            </div>
            <Toggle on={showTarget} label="show the target" onClick={() => setShowTarget((v) => !v)} accent={ACCENT_2} />
          </div>
        }
        controls={
          <div className="flex flex-col gap-3">
            <Card tone="accent">
              <SectionLabel accent={ACCENT}>How to draw it</SectionLabel>
              <p className="mt-1.5 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                Drag a handle, or sweep across the velocity panel to lay down a whole phase at once. Only the middle
                panel is yours to draw; the other two are what your drawing implies.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <ActionButton accent={ACCENT_2}
                  onClick={() => { setAttempt(blankAttempt(target, setup.nodes)); setChecked(false); }}>
                  ↺ Clear my graph
                </ActionButton>
              </div>
            </Card>
            {!editable && (
              <Card>
                <p className="text-sm" style={{ color: TEXT.secondary }}>
                  Read the target first. Name each phase out loud — flat, rising, falling, above the axis, below it —
                  before you touch a handle. The handles unlock on the next step.
                </p>
              </Card>
            )}
          </div>
        }
        panels={
          <div className="flex flex-col gap-3">
            <MatchReportCard report={report} axis={graded} attempts={attempts} onCheck={check} checked={checked} />
            <InstantStrip t={cursorT} x={now.x} v={now.v} a={now.a} show={reveal}
              trendLabel={trendLabel} trendTone={trend === 'speeding-up' ? 'up' : trend === 'steady' ? 'flat' : 'down'}
              trendReady={reveal.a} />
            {setup.ledger && showOthers && (
              <JourneyLedger
                distance={pathLength(soFar)}
                displacement={signedArea(soFar)}
                avgSpeed={pathLength(soFar) / elapsed}
                avgVelocity={signedArea(soFar) / elapsed}
                note="Your own graph, measured two ways. If they have separated, your motion reverses somewhere."
              />
            )}
          </div>
        }
        misconception={
          checked && report && (report.pass || attempts >= 2)
            ? { belief: arch.attacks.belief, attack: arch.attacks.attack }
            : null
        }
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}
