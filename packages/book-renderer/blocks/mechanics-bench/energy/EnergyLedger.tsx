'use client';

/*
 * energy/EnergyLedger.tsx — FLAGSHIP. The track the student draws, and the
 * three accounts the energy is shared between.
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ONE THING THIS SIM IS FOR: the top of the stacked bar does not move.
 *
 * Everything else — the draggable track, the friction slider, the comparison
 * run — exists to give a student as many chances as possible to make that
 * ceiling move, and to fail. "Friction loses energy" survives because heat is
 * invisible; the whole design here is to make it a bar with a number on it.
 *
 * ── HOW THE FIVE DESIGN LAWS LAND HERE ───────────────────────────────────────
 *  1 AUTHOR      the track is a set of control points the student DRAGS. Not a
 *                shape we chose with a slope slider — they can add a hump, dig a
 *                valley, make a cliff. The physics re-solves per drag.
 *  2 GRADE       a predict gate with per-option feedback, then the archetype's
 *                declared misconception card, gated on the evidence.
 *  3 MIDDLE STEP the heat account. It is the invisible one, and the bar makes it
 *                the same size of thing as the two students already accept.
 *  4 COMPOSE     the same `Stack` renders the rotational split in the MoI Racer,
 *                so "kinetic energy has parts" is one visual across two chapters.
 *  5 GUIDED      nothing moves without a click; `running` starts false and the
 *                animation hook is gated on it.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS. Every name, number and unit is in the
 * legend or the stack rows beside it.
 */

import * as React from 'react';
import {
  SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame,
} from '../../simulations/_shared';
import type { Phase2Archetype, LedgerSpec } from './kit/phase2';
import {
  PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, J, OK, BAD,
} from './kit/theme';
import {
  Card, Legend, Stack, PredictGate, MisconceptionCard, GuidePanel, ActionButton,
  Readout, usePointerDrag,
} from './kit/ui';
import { Board, BenchFrame, useStageBox, useFittedView, fitBounds, worldToScreen, screenToWorld, HIT } from './kit/stage';
import type { LegendRow } from './kit/ui';
import { normaliseTrack, segmentsOf, trackLength, trackRun, MIN_DX } from './lib/track';
import type { TrackPoint } from './lib/track';
import { runTrack, stateAtS, timeToS, lowestY, frictionHeat } from './lib/ledger';

const BLOCK_PX = 15;

export default function EnergyLedger({ arch, spec }: { arch: Phase2Archetype; spec: LedgerSpec }) {
  // ── authored state ────────────────────────────────────────────────────────
  const [points, setPoints] = React.useState<TrackPoint[]>(() => normaliseTrack(spec.track));
  const [mass, setMass] = React.useState(spec.mass);
  const [mu, setMu] = React.useState(spec.mu);
  const [v0, setV0] = React.useState(spec.v0);
  const [dragging, setDragging] = React.useState<number | null>(null);

  // ── guided + predict state ────────────────────────────────────────────────
  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [t, setT] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [everRan, setEverRan] = React.useState(false);

  // A re-authored track invalidates a finished run — but never the prediction,
  // which the student has already committed to and must not be able to redo.
  const trackKey = React.useMemo(
    () => points.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`).join('|'),
    [points],
  );
  React.useEffect(() => { setT(0); setRunning(false); }, [trackKey, mass, mu, v0]);

  const opts = React.useMemo(
    () => ({ mass, g: spec.g, mu, v0, yRef: lowestY(points) }),
    [mass, spec.g, mu, v0, points],
  );

  // ── the physics ───────────────────────────────────────────────────────────
  const run = React.useMemo(() => runTrack(points, opts, 160), [points, opts]);

  /**
   * time → arc length, precomputed once per authored track.
   *
   * `timeToS` walks the ramps analytically; calling it 40 times a frame through
   * a bisection would be correct and wasteful, and — more to the point — the
   * animation clock and the ledger must read the SAME motion, so building one
   * table both of them index is how they are stopped from ever disagreeing.
   */
  const timeline = React.useMemo(
    () => run.samples.map((sm) => timeToS(points, opts, sm.s)),
    [run.samples, points, opts],
  );

  const sAt = React.useCallback((time: number): number => {
    if (!timeline.length) return 0;
    if (time >= timeline[timeline.length - 1]) return run.endS;
    let lo = 0;
    let hi = timeline.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (timeline[mid] <= time) lo = mid; else hi = mid;
    }
    const span = timeline[hi] - timeline[lo];
    const f = span > 1e-9 ? (time - timeline[lo]) / span : 0;
    return run.samples[lo].s + f * (run.samples[hi].s - run.samples[lo].s);
  }, [timeline, run.samples, run.endS]);

  const finished = t >= run.duration - 1e-9;
  const s = running || everRan ? sAt(t) : 0;
  const now = React.useMemo(() => stateAtS(points, opts, s), [points, opts, s]);

  useAnimationFrame((dt) => {
    setT((prev) => Math.min(prev + dt, run.duration));
  }, { enabled: running && !finished });

  React.useEffect(() => { if (finished) setRunning(false); }, [finished]);

  // ── the comparison run, when the archetype supplies one ───────────────────
  const cmpPoints = React.useMemo(
    () => (spec.compareTrack ? normaliseTrack(spec.compareTrack) : null),
    [spec.compareTrack],
  );
  const cmpRun = React.useMemo(
    () => (cmpPoints ? runTrack(cmpPoints, { ...opts, yRef: opts.yRef }, 80) : null),
    [cmpPoints, opts],
  );
  const cmpTimeline = React.useMemo(
    () => (cmpPoints && cmpRun ? cmpRun.samples.map((sm) => timeToS(cmpPoints, opts, sm.s)) : null),
    [cmpPoints, cmpRun, opts],
  );
  const cmpNow = React.useMemo(() => {
    if (!cmpPoints || !cmpRun || !cmpTimeline) return null;
    const last = cmpTimeline[cmpTimeline.length - 1];
    if (t >= last) return stateAtS(cmpPoints, opts, cmpRun.endS);
    let lo = 0;
    let hi = cmpTimeline.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cmpTimeline[mid] <= t) lo = mid; else hi = mid;
    }
    return stateAtS(cmpPoints, opts, cmpRun.samples[lo].s);
  }, [cmpPoints, cmpRun, cmpTimeline, opts, t]);

  // ── camera ────────────────────────────────────────────────────────────────
  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const bounds = React.useMemo(() => {
    const pts = [...points, ...(cmpPoints ?? [])];
    return fitBounds(pts, 0.12);
  }, [points, cmpPoints]);
  // Frozen while a control point is under the finger: re-fitting mid-gesture is
  // how a handle runs away from the hand that is holding it.
  const view = useFittedView(bounds, box.w, box.h, dragging !== null);
  const toScreen = React.useCallback((p: TrackPoint) => worldToScreen(p, view), [view]);

  // ── dragging a control point ──────────────────────────────────────────────
  const onDragMove = React.useCallback((pt: { x: number; y: number }) => {
    setPoints((prev) => {
      if (dragging === null) return prev;
      const world = screenToWorld(pt, view);
      const next = prev.map((p, i) => (i === dragging ? { x: world.x, y: world.y } : p));
      // The ends stay put horizontally: the whole comparison rests on both
      // tracks sharing a start and a finish, and letting the student drag one
      // end sideways would quietly change the question being asked.
      if (dragging === 0 || dragging === prev.length - 1) next[dragging].x = prev[dragging].x;
      const lo = dragging > 0 ? next[dragging - 1].x + MIN_DX : -Infinity;
      const hi = dragging < next.length - 1 ? next[dragging + 1].x - MIN_DX : Infinity;
      next[dragging].x = Math.min(Math.max(next[dragging].x, lo), hi);
      return next;
    });
  }, [dragging, view]);

  const startDrag = usePointerDrag({
    svgRef,
    onMove: onDragMove,
    onEnd: () => setDragging(null),
  });

  // ── the guided ladder ─────────────────────────────────────────────────────
  const predictStep = 1;
  const releaseStep = 2;
  const canPredict = step >= predictStep;
  const canRelease = step >= releaseStep && choice !== null;

  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const release = () => {
    if (!canRelease) return;
    setT(0);
    setRunning(true);
    setEverRan(true);
    if (step < steps.length) advance();
  };

  // ── drawing ───────────────────────────────────────────────────────────────
  const segs = segmentsOf(points);
  const trackPath = points.map((p) => { const q = toScreen(p); return `${q.x},${q.y}`; }).join(' ');
  const cmpPath = cmpPoints
    ? cmpPoints.map((p) => { const q = toScreen(p); return `${q.x},${q.y}`; }).join(' ')
    : null;

  // The stretch already travelled, repainted in the heat colour. Where the heat
  // went is a PLACE, not just a number, and the track is that place.
  const warmed = React.useMemo(() => {
    if (!everRan || mu <= 0) return null;
    const out: string[] = [];
    let acc = 0;
    for (const seg of segs) {
      if (acc >= s) break;
      const u = Math.min(s - acc, seg.len);
      const a = toScreen(seg.from);
      const b = toScreen({ x: seg.from.x + seg.cos * u, y: seg.from.y + seg.sin * u });
      out.push(`${a.x},${a.y} ${b.x},${b.y}`);
      acc += seg.len;
    }
    return out;
  }, [everRan, mu, segs, s, toScreen]);

  const blockPos = toScreen({ x: now?.x ?? 0, y: now?.y ?? 0 });
  const cmpPos = cmpNow ? toScreen({ x: cmpNow.x, y: cmpNow.y }) : null;

  const legend: LegendRow[] = [
    { id: 'track', color: PRIMARY, name: 'Your track', detail: `${sig(trackLength(points))} m long, ${sig(trackRun(points))} m across` },
    ...(mu > 0 && everRan
      ? [{ id: 'warm', color: ACCOUNT.heat.color, name: 'Warmed by friction', detail: 'the stretch already crossed' }]
      : []),
    { id: 'block', color: SECONDARY, name: 'The block', value: now ? `${sig(now.v)} m/s` : '—' },
    ...(cmpPoints
      ? [{ id: 'cmp', color: GHOST, name: 'The other track', detail: 'same start, same finish', dashed: true,
        value: cmpNow ? `${sig(cmpNow.v)} m/s` : '—' }]
      : []),
  ];

  // Evidence gate for the misconception card: it may only appear once the
  // student has watched a run that could actually have changed their mind.
  const sawEvidence = everRan && finished;

  return (
    <SimShell>
      <SimHeader
        title={arch.title.split(' ').slice(0, -1).join(' ') || arch.title}
        accentWord={arch.title.split(' ').slice(-1)[0]}
        subtitle="Energy ledger · the total never moves"
        badge={`μ = ${mu.toFixed(2)}`}
      />
      <StepBar
        steps={steps.map((st, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))}
        onGo={(id) => setStep(Number(id))}
      />

      <BenchFrame
        box={box}
        aspect="16 / 9"
        narrowAspect="4 / 3"
        hoist={
          <>
            {step < steps.length && (
              <GuidePanel say={steps[step].say} cta={steps[step].cta} onAdvance={advance} />
            )}
            {canPredict && arch.predict && (
              <PredictGate predict={arch.predict} choice={choice} onChoose={setChoice} />
            )}
          </>
        }
        panels={
          <>
            <Card>
              <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
                The three accounts
              </div>
              <Stack
                values={{ ke: now?.ke ?? 0, pe: now?.pe ?? 0, heat: now?.heat ?? 0 }}
                scaleTotal={run.total}
              />
              <p className="mt-2 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                The dashed line is where the total sits. If energy were ever lost, the
                stack would fall below it.
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
                Your setup
              </div>
              <SimSlider label="Mass" value={mass} min={0.5} max={20} step={0.5}
                unit="kg" onChange={setMass} accent={PRIMARY} />
              <SimSlider label="Friction μ" value={mu} min={0} max={0.8} step={0.01}
                onChange={setMu} accent={ACCOUNT.heat.color} />
              <SimSlider label="Push-off" value={v0} min={0} max={8} step={0.5}
                unit="m/s" onChange={setV0} accent={SECONDARY} />
            </Card>

            <Card>
              <Readout label="Heat generated" value={J(now?.heat ?? 0)} tone={ACCOUNT.heat.color} />
              <Readout label="μmgΔx predicts" tone={ACCOUNT.heat.color}
                value={J(frictionHeat(opts, Math.max(0, (now?.x ?? 0) - points[0].x)))} />
              <Readout label="Speed now" value={`${sig(now?.v ?? 0)} m/s`} tone={SECONDARY} />
              <Readout label="Ledger drift" tone={run.drift < 1e-9 ? OK : BAD}
                value={run.drift < 1e-9 ? 'below 1 nJ' : J(run.drift)} />
              {run.stopped && everRan && finished && (
                <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                  {run.stalledOnSlope
                    ? 'It came to rest on a slope steeper than the friction angle — in the real world it would start sliding back from here.'
                    : `It stopped after ${sig(run.endS)} m, with every joule of the kinetic energy now in the track.`}
                </p>
              )}
            </Card>

            <MisconceptionCard code={arch.targets} when={sawEvidence} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={release} disabled={!canRelease} active={running}>
              {running ? 'Running…' : everRan ? 'Release again' : 'Release the block'}
            </ActionButton>
            <ActionButton onClick={() => { setT(0); setRunning(false); }} disabled={!everRan}>
              Back to the top
            </ActionButton>
            {!canRelease && (
              <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
                {choice === null && canPredict
                  ? 'Commit to the prediction first.'
                  : 'Work through the guided steps to unlock the release.'}
              </span>
            )}
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the comparison track, behind */}
            {cmpPath && (
              <polyline points={cmpPath} fill="none" stroke={GHOST} strokeWidth={2}
                strokeDasharray="7 6" strokeLinejoin="round" />
            )}
            {/* the student's track */}
            <polyline points={trackPath} fill="none" stroke={accentTint(PRIMARY, 0.85)}
              strokeWidth={3.5} strokeLinejoin="round" strokeLinecap="round" />
            {/* the warmed stretch, painted over it */}
            {warmed?.map((seg) => (
              <polyline key={seg} points={seg} fill="none" stroke={ACCOUNT.heat.color}
                strokeWidth={5} strokeLinecap="round" opacity={0.55} />
            ))}
            {/* the height reference — PE is measured from here */}
            {bounds && (
              <line
                x1={0} x2={box.w}
                y1={worldToScreen({ x: 0, y: opts.yRef }, view).y}
                y2={worldToScreen({ x: 0, y: opts.yRef }, view).y}
                stroke={accentTint(ACCOUNT.pe.color, 0.35)} strokeWidth={1} strokeDasharray="3 6" />
            )}
            {/* the comparison block */}
            {cmpPos && everRan && (
              <circle cx={cmpPos.x} cy={cmpPos.y} r={BLOCK_PX * 0.55}
                fill="none" stroke={GHOST} strokeWidth={2} />
            )}
            {/* the block */}
            <circle cx={blockPos.x} cy={blockPos.y} r={BLOCK_PX * 0.62}
              fill={accentTint(SECONDARY, 0.9)} stroke={SECONDARY} strokeWidth={2} />
            {/* control-point handles — always draggable, never gated on the clock */}
            {spec.editable && points.map((p, i) => {
              const q = toScreen(p);
              const held = dragging === i;
              return (
                <g key={`h${i}`}>
                  <circle cx={q.x} cy={q.y} r={HIT.head.hit} fill="transparent"
                    style={{ cursor: 'grab', touchAction: 'none' }}
                    onPointerDown={(e) => { setDragging(i); startDrag(e); }} />
                  <circle cx={q.x} cy={q.y} r={held ? HIT.head.r : HIT.head.r * 0.62}
                    fill={accentTint(PRIMARY, held ? 0.55 : 0.24)}
                    stroke={PRIMARY} strokeWidth={held ? 2.5 : 1.5} pointerEvents="none" />
                </g>
              );
            })}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Every energy question in this chapter is this bar. Write down what is in each
        account at the start and at the end, set the two totals equal, and the unknown
        falls out — without ever solving for an acceleration.
      </ExpertTip>
    </SimShell>
  );
}
