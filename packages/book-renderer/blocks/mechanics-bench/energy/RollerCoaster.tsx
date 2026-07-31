'use client';

/*
 * energy/RollerCoaster.tsx — draw the track, then find where it fails.
 * ─────────────────────────────────────────────────────────────────────────────
 * The student sets the release height and the loop radius by DRAGGING them, and
 * the sim answers one question: does this design work, and if not, where exactly
 * does it stop working?
 *
 * ── THE HANDOFF (design law #4) ──────────────────────────────────────────────
 * When the normal force reaches zero the car is no longer on a track — it is a
 * projectile. So the tail of the ride is integrated by `motion-lab/lib/integrate`,
 * the SAME RK4 the Projectile Playground draws with. The car does not stop and
 * flash an error; it leaves the rails, on a parabola, in front of you. That is
 * the Circular Arena's cut-the-string moment, reached from the energy side.
 *
 * ⚠ THE CLOCK DRAWS; THE ALGEBRA STATES. Every NUMBER a student reads —
 * v²_top, the required g·r, N at the top and bottom, the minimum release
 * height — comes from `lib/coaster.analyseLoop`, in closed form. The sampled
 * ride exists only to move a dot. An integrator's rounding must never be what a
 * student reads as "the answer" (the rule motion-lab's integrator states in its
 * own header).
 *
 * ZERO <text> ELEMENTS ON EITHER CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, CoasterSpec2 } from './kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, OK, BAD } from './kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill, usePointerDrag,
} from './kit/ui';
import { Board, BenchFrame, useStageBox, useFittedView, fitBounds, worldToScreen, screenToWorld, HIT } from './kit/stage';
import type { LegendRow } from './kit/ui';
import { analyseLoop, normalAtAngle, minReleaseHeight } from './lib/coaster';
import { integrate, gravityAccel } from '../../motion-lab/lib/integrate';

interface RideSample { x: number; y: number; v: number; n: number | null; t: number }

/**
 * The ride, sampled once per design. Geometry only — every readout comes from
 * `analyseLoop`.
 */
function buildRide(spec: CoasterSpec2): { samples: RideSample[]; detached: RideSample[]; duration: number } {
  const g = spec.g;
  const r = Math.max(spec.loopR, 0.05);
  const rampRun = Math.max(1.2, spec.releaseH * 0.9);
  const loopX = rampRun + spec.runIn;

  const pts: { x: number; y: number; flat: number; phi: number | null }[] = [];
  const N1 = 40;
  for (let i = 0; i <= N1; i++) {
    const f = i / N1;
    pts.push({ x: f * rampRun, y: spec.releaseH * (1 - f), flat: 0, phi: null });
  }
  const N2 = Math.max(4, Math.round(spec.runIn * 8));
  for (let i = 1; i <= N2; i++) {
    const f = i / N2;
    pts.push({ x: rampRun + f * spec.runIn, y: 0, flat: f * spec.runIn, phi: null });
  }
  const N3 = 96;
  for (let i = 1; i <= N3; i++) {
    const phi = (i / N3) * 2 * Math.PI;
    pts.push({
      x: loopX + r * Math.sin(phi),
      y: r * (1 - Math.cos(phi)),
      flat: spec.runIn,
      phi,
    });
  }
  const N4 = 24;
  for (let i = 1; i <= N4; i++) {
    pts.push({ x: loopX + (i / N4) * 2.2, y: 0, flat: spec.runIn + (i / N4) * 2.2, phi: null });
  }

  const samples: RideSample[] = [];
  let t = 0;
  let prev: { x: number; y: number } | null = null;
  let prevV = 0;
  for (const p of pts) {
    const vSq = 2 * g * (spec.releaseH - spec.mu * Math.min(p.flat, spec.runIn) - p.y);
    if (vSq <= 0) break;
    const v = Math.sqrt(vSq);
    if (prev) {
      const ds = Math.hypot(p.x - prev.x, p.y - prev.y);
      t += ds / Math.max((v + prevV) / 2, 1e-3);
    }
    const n = p.phi === null ? null : normalAtAngle(spec, p.phi);
    samples.push({ x: p.x, y: p.y, v, n, t });
    if (n !== null && n < 0) break;      // the rails let go here
    prev = p;
    prevV = v;
  }

  // The tail: once N < 0 the car is a projectile. Same integrator as E2.
  let detached: RideSample[] = [];
  const last = samples[samples.length - 1];
  if (last && last.n !== null && last.n < 0) {
    const phi = Math.acos(Math.min(1, Math.max(-1, 1 - last.y / r)));
    // Tangent to the loop at φ, travelling anticlockwise-in-screen (up the
    // inside of the near wall then over the top).
    const tan = { x: Math.cos(phi), y: Math.sin(phi) };
    const tr = integrate(
      { t: 0, pos: { x: last.x, y: last.y }, vel: { x: tan.x * last.v, y: tan.y * last.v } },
      gravityAccel(g),
      { dt: 1 / 240, maxSteps: 4000, stop: (st) => st.pos.y <= 0 },
    );
    detached = tr.points.filter((_, i) => i % 4 === 0).map((st) => ({
      x: st.pos.x, y: st.pos.y,
      v: Math.hypot(st.vel.x, st.vel.y), n: null, t: last.t + st.t,
    }));
  }

  const all = [...samples, ...detached];
  return { samples, detached, duration: all.length ? all[all.length - 1].t : 0 };
}

export default function RollerCoaster({ arch, spec }: { arch: Phase2Archetype; spec: CoasterSpec2 }) {
  const [releaseH, setReleaseH] = React.useState(spec.releaseH);
  const [loopR, setLoopR] = React.useState(spec.loopR);
  const [mu, setMu] = React.useState(spec.mu);
  const [mass, setMass] = React.useState(spec.mass);
  const [grab, setGrab] = React.useState<'height' | 'radius' | null>(null);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [t, setT] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [everRan, setEverRan] = React.useState(false);
  const [showN, setShowN] = React.useState(false);

  const design = React.useMemo<CoasterSpec2>(
    () => ({ ...spec, releaseH, loopR, mu, mass }),
    [spec, releaseH, loopR, mu, mass],
  );
  const verdict = React.useMemo(() => analyseLoop(design), [design]);
  const ride = React.useMemo(() => buildRide(design), [design]);

  React.useEffect(() => { setT(0); setRunning(false); }, [design]);
  const finished = t >= ride.duration - 1e-9;
  useAnimationFrame((dt) => setT((p) => Math.min(p + dt * 0.8, ride.duration)),
    { enabled: running && !finished });
  React.useEffect(() => { if (finished) setRunning(false); }, [finished]);

  const all = React.useMemo(() => [...ride.samples, ...ride.detached], [ride]);
  const car = React.useMemo(() => {
    if (!all.length) return null;
    if (!everRan) return all[0];
    let i = 0;
    while (i < all.length - 1 && all[i + 1].t <= t) i++;
    return all[i];
  }, [all, t, everRan]);

  // ── camera ────────────────────────────────────────────────────────────────
  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const rampRun = Math.max(1.2, releaseH * 0.9);
  const loopX = rampRun + spec.runIn;
  const bounds = React.useMemo(() => fitBounds([
    { x: 0, y: 0 }, { x: 0, y: releaseH },
    { x: loopX + loopR + 2.4, y: 0 }, { x: loopX, y: 2 * loopR },
    ...ride.detached.map((d) => ({ x: d.x, y: d.y })),
  ], 0.1), [releaseH, loopX, loopR, ride.detached]);
  const view = useFittedView(bounds, box.w, box.h, grab !== null);
  const P = React.useCallback((x: number, y: number) => worldToScreen({ x, y }, view), [view]);

  const dragHeight = usePointerDrag({
    svgRef,
    onMove: (pt) => setReleaseH(Math.min(16, Math.max(0.5, screenToWorld(pt, view).y))),
    onEnd: () => setGrab(null),
  });
  const dragRadius = usePointerDrag({
    svgRef,
    onMove: (pt) => setLoopR(Math.min(5, Math.max(0.5, screenToWorld(pt, view).y / 2))),
    onEnd: () => setGrab(null),
  });

  const predictStep = 1;
  const runStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const canRun = step >= runStep && choice !== null;
  const send = () => {
    if (!canRun) return;
    setT(0); setRunning(true); setEverRan(true);
    if (step < steps.length) advance();
  };

  // ── the track path ────────────────────────────────────────────────────────
  const railPath = React.useMemo(() => {
    const p: string[] = [];
    const a = P(0, releaseH); p.push(`M ${a.x} ${a.y}`);
    const b = P(rampRun, 0); p.push(`L ${b.x} ${b.y}`);
    const c = P(loopX, 0); p.push(`L ${c.x} ${c.y}`);
    for (let i = 1; i <= 96; i++) {
      const phi = (i / 96) * 2 * Math.PI;
      const q = P(loopX + loopR * Math.sin(phi), loopR * (1 - Math.cos(phi)));
      p.push(`L ${q.x} ${q.y}`);
    }
    const d = P(loopX + 2.4, 0); p.push(`L ${d.x} ${d.y}`);
    return p.join(' ');
  }, [P, releaseH, rampRun, loopX, loopR]);

  const failPoint = ride.samples[ride.samples.length - 1];
  const carPos = car ? P(car.x, car.y) : null;

  const legend: LegendRow[] = [
    { id: 'rail', color: PRIMARY, name: 'Your track', detail: `drop ${sig(releaseH)} m · loop r = ${sig(loopR)} m` },
    { id: 'car', color: SECONDARY, name: 'The car', value: car ? `${sig(car.v)} m/s` : '—' },
    ...(ride.detached.length
      ? [{ id: 'fall', color: BAD, name: 'Off the rails', detail: 'a projectile from here on', dashed: true }]
      : []),
    { id: 'need', color: ACCOUNT.heat.color, name: 'Minimum release height', value: `${sig(verdict.minReleaseH)} m` },
  ];

  return (
    <SimShell>
      <SimHeader title="Roller-coaster" accentWord="Designer"
        subtitle="Loop-top needs v² ≥ g r — the Circular Arena's result, from energy"
        badge={verdict.clears ? 'design clears' : 'design fails'} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="16 / 10" narrowAspect="1 / 1"
        hoist={
          <>
            {step < steps.length && (
              <GuidePanel say={steps[step].say} cta={steps[step].cta} onAdvance={advance} />
            )}
            {step >= predictStep && arch.predict && (
              <PredictGate predict={arch.predict} choice={choice} onChoose={setChoice} />
            )}
          </>
        }
        panels={
          <>
            <Card tone={verdict.clears ? 'ok' : 'bad'}>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill tone={verdict.clears ? 'ok' : 'bad'}>
                  {verdict.clears ? 'It gets round' : verdict.failure === 'stops-before-loop'
                    ? 'It never reaches the loop' : 'It leaves the rails'}
                </Pill>
              </div>
              <Readout label="v² at the loop top" value={`${sig(verdict.vTopSq)} m²/s²`} tone={SECONDARY} />
              <Readout label="…and it needs g·r" value={`${sig(verdict.vTopMinSq)} m²/s²`} tone={ACCOUNT.heat.color} />
              <Readout label="Headroom" tone={verdict.headroom >= 0 ? OK : BAD}
                value={`${verdict.headroom >= 0 ? '+' : '−'}${sig(Math.abs(verdict.headroom))} m²/s²`} />
              <Readout label="N at the top" value={`${sig(Math.max(0, verdict.nTop))} N`}
                tone={verdict.nTop >= 0 ? TEXT.primary : BAD} />
              <Readout label="N at the bottom" value={`${sig(verdict.nBottom)} N`} />
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                At exactly critical speed the bottom of the loop carries 6mg — six times
                the car&rsquo;s weight. That number is what the steel is sized for.
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your design</div>
              <SimSlider label="Release height" value={releaseH} min={0.5} max={16} step={0.1}
                unit="m" onChange={setReleaseH} accent={PRIMARY} />
              <SimSlider label="Loop radius" value={loopR} min={0.5} max={5} step={0.1}
                unit="m" onChange={setLoopR} accent={SECONDARY} />
              <SimSlider label="Run-in μ" value={mu} min={0} max={0.4} step={0.01}
                onChange={setMu} accent={ACCOUNT.heat.color} />
              <SimSlider label="Car mass" value={mass} min={50} max={2000} step={10}
                unit="kg" onChange={setMass} accent={PRIMARY} />
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                Sweep the mass across its whole range. The verdict does not move — but
                the two normal-force readouts scale straight with it.
              </p>
            </Card>

            <Card>
              <ActionButton full onClick={() => setShowN((v) => !v)} active={showN}>
                {showN ? 'Hide' : 'Show'} the normal force round the loop
              </ActionButton>
              {showN && (
                <div className="mt-2">
                  <NormalPlot spec={design} />
                  <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                    Left edge is the bottom of the loop, right edge the top. The shaded
                    band below the line is where the rails would have to PULL — which they
                    cannot. The design fails at the first point the curve enters it.
                  </p>
                </div>
              )}
            </Card>

            <MisconceptionCard code={arch.targets} when={everRan && finished} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={send} disabled={!canRun} active={running}>
              {running ? 'Rolling…' : everRan ? 'Send it again' : 'Send the car'}
            </ActionButton>
            <ActionButton onClick={() => { setT(0); setRunning(false); }} disabled={!everRan}>
              Back to the top
            </ActionButton>
            <ActionButton onClick={() => setReleaseH(Number(minReleaseHeight(loopR, mu, spec.runIn).toFixed(2)))}>
              Snap to the minimum height
            </ActionButton>
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the ground */}
            <line x1={0} x2={box.w} y1={P(0, 0).y} y2={P(0, 0).y}
              stroke={accentTint(TEXT.primary, 0.22)} strokeWidth={1.5} />
            {/* the rails */}
            <path d={railPath} fill="none" stroke={accentTint(PRIMARY, 0.85)}
              strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round" />
            {/* where it comes off, marked before the car gets there */}
            {failPoint && failPoint.n !== null && failPoint.n < 0 && (
              <circle cx={P(failPoint.x, failPoint.y).x} cy={P(failPoint.x, failPoint.y).y}
                r={9} fill="none" stroke={BAD} strokeWidth={2.5} strokeDasharray="4 3" />
            )}
            {/* the projectile tail */}
            {ride.detached.length > 1 && (
              <polyline
                points={ride.detached.map((d) => { const q = P(d.x, d.y); return `${q.x},${q.y}`; }).join(' ')}
                fill="none" stroke={BAD} strokeWidth={2} strokeDasharray="6 5" />
            )}
            {/* release-height handle */}
            <g>
              <circle cx={P(0, releaseH).x} cy={P(0, releaseH).y} r={HIT.head.hit} fill="transparent"
                style={{ cursor: 'ns-resize', touchAction: 'none' }}
                onPointerDown={(e) => { setGrab('height'); dragHeight(e); }} />
              <circle cx={P(0, releaseH).x} cy={P(0, releaseH).y}
                r={grab === 'height' ? HIT.head.r : HIT.head.r * 0.66}
                fill={accentTint(PRIMARY, grab === 'height' ? 0.55 : 0.24)}
                stroke={PRIMARY} strokeWidth={2} pointerEvents="none" />
            </g>
            {/* loop-radius handle, at the top of the loop */}
            <g>
              <circle cx={P(loopX, 2 * loopR).x} cy={P(loopX, 2 * loopR).y} r={HIT.head.hit}
                fill="transparent" style={{ cursor: 'ns-resize', touchAction: 'none' }}
                onPointerDown={(e) => { setGrab('radius'); dragRadius(e); }} />
              <circle cx={P(loopX, 2 * loopR).x} cy={P(loopX, 2 * loopR).y}
                r={grab === 'radius' ? HIT.head.r : HIT.head.r * 0.66}
                fill={accentTint(SECONDARY, grab === 'radius' ? 0.55 : 0.24)}
                stroke={SECONDARY} strokeWidth={2} pointerEvents="none" />
            </g>
            {/* the car */}
            {carPos && (
              <circle cx={carPos.x} cy={carPos.y} r={8.5}
                fill={accentTint(SECONDARY, 0.9)} stroke={SECONDARY} strokeWidth={2} />
            )}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Two conditions, not one. Energy tells you what speed the car ARRIVES with;
        the circle tells you what speed it NEEDS. A design works only where those two
        overlap — and they overlap first at h = 2.5 r.
      </ExpertTip>
    </SimShell>
  );
}

/**
 * N against angle round the loop. A second, small canvas — and it carries zero
 * <text> too. The legend sentence underneath says what the axes are.
 */
function NormalPlot({ spec }: { spec: CoasterSpec2 }) {
  const W = 240;
  const H = 96;
  const pts: { phi: number; n: number }[] = [];
  for (let i = 0; i <= 90; i++) pts.push({ phi: (i / 90) * Math.PI, n: normalAtAngle(spec, (i / 90) * Math.PI) });
  const maxN = Math.max(...pts.map((p) => p.n), 1);
  const minN = Math.min(...pts.map((p) => p.n), 0);
  const span = Math.max(maxN - minN, 1e-6);
  const X = (i: number) => (i / (pts.length - 1)) * W;
  const Y = (n: number) => H - ((n - minN) / span) * H;
  const zeroY = Y(0);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
      <rect x={0} y={zeroY} width={W} height={Math.max(0, H - zeroY)} fill={accentTint(BAD, 0.14)} />
      <line x1={0} x2={W} y1={zeroY} y2={zeroY} stroke={accentTint(TEXT.primary, 0.4)}
        strokeWidth={1} strokeDasharray="4 4" />
      <polyline fill="none" stroke={SECONDARY} strokeWidth={2}
        points={pts.map((p, i) => `${X(i)},${Y(p.n)}`).join(' ')} />
      <circle cx={X(pts.length - 1)} cy={Y(pts[pts.length - 1].n)} r={3.5}
        fill={pts[pts.length - 1].n >= 0 ? OK : BAD} />
      <line x1={X(pts.length - 1)} x2={X(pts.length - 1)} y1={0} y2={H}
        stroke={GHOST} strokeWidth={1} strokeDasharray="2 4" />
    </svg>
  );
}
