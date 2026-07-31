'use client';

/*
 * energy/CollisionStudio.tsx — FLAGSHIP. 1-D and 2-D, restitution, and the
 * centre-of-mass frame toggle.
 * ─────────────────────────────────────────────────────────────────────────────
 * TWO LEDGER ROWS, SIDE BY SIDE, ALWAYS ON: momentum and kinetic energy, before
 * and after. Every single thing this sim teaches is which of those two rows
 * moved. Momentum never does. KE does, unless e = 1.
 *
 * ── THE CoM FRAME IS THE POINT, NOT A GARNISH ────────────────────────────────
 * Switching frames does not re-solve anything — `collide1D` is called once, in
 * the ground frame, and the CoM view is that same answer with `v_com`
 * subtracted. That is deliberate: if the two views came from two calculations,
 * "it is the same event seen from a different seat" would be a claim rather than
 * a fact about the code. In the CoM frame an elastic collision reverses both
 * velocities EXACTLY, which the verifier asserts to 1e-13.
 *
 * ⚠ NOTHING AUTO-PLAYS AND NOTHING IS REVEALED EARLY. `after` is not drawn, and
 * the two ledger rows show only their "before" column, until the student has
 * committed a prediction and pressed the button.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, CollisionSpec } from './kit/phase2';
import { PRIMARY, TEXT, BODY_A, BODY_B, GHOST, accentTint, sig, ACCOUNT } from './kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill,
  BeforeAfter, usePointerDrag,
} from './kit/ui';
import { Board, BenchFrame, useStageBox, useFittedView, fitBounds, worldToScreen, screenToWorld, HIT } from './kit/stage';
import type { LegendRow } from './kit/ui';
import {
  collide1D, collide2D, comVelocity, comVelocity2D, keLoss, reducedMass,
  impactNormalDeg, ke1D, ke2D, separationAngleDeg,
} from './lib/collide';
import type { Vec2 } from './lib/collide';

/** Seconds of approach drawn before contact, and of separation after. */
const LEG = 1.0;

export default function CollisionStudio({ arch, spec }: { arch: Phase2Archetype; spec: CollisionSpec }) {
  const [m1, setM1] = React.useState(spec.m1);
  const [m2, setM2] = React.useState(spec.m2);
  const [u1, setU1] = React.useState(spec.u1);
  const [u2, setU2] = React.useState(spec.u2);
  const [e, setE] = React.useState(spec.e);
  const [b, setB] = React.useState(spec.b ?? 0);
  const [comFrame, setComFrame] = React.useState(spec.comFrame);
  const [aiming, setAiming] = React.useState(false);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [t, setT] = React.useState(-LEG);
  const [running, setRunning] = React.useState(false);
  const [everRan, setEverRan] = React.useState(false);

  const twoD = spec.dim === 2;
  const normalDeg = React.useMemo(
    () => (twoD ? impactNormalDeg(b, spec.r1, spec.r2, 0) : 0),
    [twoD, b, spec.r1, spec.r2],
  );

  // ── one solve, in the GROUND frame. Everything else is a view of it. ──────
  const before: { a: Vec2; b: Vec2 } = React.useMemo(
    () => ({ a: { x: u1, y: 0 }, b: { x: u2, y: spec.u2y ?? 0 } }),
    [u1, u2, spec.u2y],
  );
  const after = React.useMemo(() => {
    if (twoD) {
      const r = collide2D(m1, before.a, m2, before.b, e, normalDeg);
      return { a: r.v1, b: r.v2 };
    }
    const r = collide1D(m1, u1, m2, u2, e);
    return { a: { x: r.v1, y: 0 }, b: { x: r.v2, y: 0 } };
  }, [twoD, m1, m2, before, e, normalDeg, u1, u2]);

  const vCom = React.useMemo(
    () => (twoD ? comVelocity2D(m1, before.a, m2, before.b) : { x: comVelocity(m1, u1, m2, u2), y: 0 }),
    [twoD, m1, m2, before, u1, u2],
  );
  const shift = React.useCallback(
    (v: Vec2): Vec2 => (comFrame ? { x: v.x - vCom.x, y: v.y - vCom.y } : v),
    [comFrame, vCom],
  );

  // ── the drawn motion ──────────────────────────────────────────────────────
  // t < 0 is approach, t > 0 is separation. Contact is exactly t = 0, and the
  // geometry is arranged so both bodies reach the contact configuration there.
  const contact = React.useMemo(() => {
    if (!twoD) return { a: { x: -spec.r1, y: 0 }, b: { x: spec.r2, y: 0 } };
    const a = (normalDeg * Math.PI) / 180;
    const d = spec.r1 + spec.r2;
    return { a: { x: 0, y: 0 }, b: { x: d * Math.cos(a), y: d * Math.sin(a) } };
  }, [twoD, normalDeg, spec.r1, spec.r2]);

  const posAt = React.useCallback((which: 'a' | 'b', time: number): Vec2 => {
    const home = contact[which];
    const v = shift(time <= 0 ? before[which] : after[which]);
    return { x: home.x + v.x * time, y: home.y + v.y * time };
  }, [contact, before, after, shift]);

  React.useEffect(() => { setT(-LEG); setRunning(false); }, [m1, m2, u1, u2, e, b, comFrame]);
  const done = t >= LEG - 1e-9;
  useAnimationFrame((dt) => setT((p) => Math.min(p + dt * 0.7, LEG)), { enabled: running && !done });
  React.useEffect(() => { if (done) setRunning(false); }, [done]);

  const showAfter = everRan && t > 0;

  // ── camera ────────────────────────────────────────────────────────────────
  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const bounds = React.useMemo(() => {
    const pts: Vec2[] = [];
    for (const w of ['a', 'b'] as const) {
      for (const time of [-LEG, 0, LEG]) {
        const p = posAt(w, time);
        pts.push({ x: p.x, y: p.y });
      }
    }
    pts.push({ x: 0, y: -0.9 }, { x: 0, y: 0.9 });
    return fitBounds(pts, 0.1);
  }, [posAt]);
  const view = useFittedView(bounds, box.w, box.h, aiming);
  const P = React.useCallback((p: Vec2) => worldToScreen(p, view), [view]);

  const aimDrag = usePointerDrag({
    svgRef,
    onMove: (pt) => {
      const w = screenToWorld(pt, view);
      setB(Math.min(spec.r1 + spec.r2, Math.max(0, w.y)));
    },
    onEnd: () => setAiming(false),
  });

  const predictStep = 1;
  const runStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const canRun = step >= runStep && choice !== null;
  const fire = () => {
    if (!canRun) return;
    setT(-LEG); setRunning(true); setEverRan(true);
    if (step < steps.length) advance();
  };

  // ── ledgers ───────────────────────────────────────────────────────────────
  const pBefore = twoD
    ? Math.hypot(m1 * before.a.x + m2 * before.b.x, m1 * before.a.y + m2 * before.b.y)
    : m1 * u1 + m2 * u2;
  const pAfter = twoD
    ? Math.hypot(m1 * after.a.x + m2 * after.b.x, m1 * after.a.y + m2 * after.b.y)
    : m1 * after.a.x + m2 * after.b.x;
  const keBefore = twoD
    ? ke2D(m1, before.a) + ke2D(m2, before.b)
    : ke1D(m1, u1) + ke1D(m2, u2);
  const keAfter = twoD
    ? ke2D(m1, after.a) + ke2D(m2, after.b)
    : ke1D(m1, after.a.x) + ke1D(m2, after.b.x);
  const lost = keLoss(m1, twoD ? before.a.x : u1, m2, twoD ? before.b.x : u2, e);
  const sepAngle = separationAngleDeg(after.a, after.b);

  const speeds = (v: Vec2) => `${sig(Math.hypot(v.x, v.y))} m/s`;
  const legend: LegendRow[] = [
    { id: 'a', color: BODY_A, name: `Body 1 · ${sig(m1)} kg`,
      detail: comFrame ? 'in the CoM frame' : undefined,
      value: speeds(shift(t <= 0 ? before.a : after.a)) },
    { id: 'b', color: BODY_B, name: `Body 2 · ${sig(m2)} kg`,
      detail: comFrame ? 'in the CoM frame' : undefined,
      value: speeds(shift(t <= 0 ? before.b : after.b)) },
    { id: 'com', color: GHOST, name: 'Centre of mass', dashed: true,
      detail: comFrame ? 'you are riding it — it is at rest' : 'sails straight through, unaffected',
      value: comFrame ? '0 m/s' : `${sig(Math.hypot(vCom.x, vCom.y))} m/s` },
    ...(twoD && showAfter && sepAngle !== null
      ? [{ id: 'ang', color: ACCOUNT.heat.color, name: 'Angle between them', value: `${sig(sepAngle)}°` }]
      : []),
  ];

  return (
    <SimShell>
      <SimHeader title="Collision" accentWord="Studio"
        subtitle={twoD ? 'Two dimensions · impulse along the line of centres' : 'One dimension · momentum always, energy only at e = 1'}
        badge={`e = ${e.toFixed(2)}`} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="16 / 9" narrowAspect="1 / 1"
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
            <BeforeAfter
              title="The two books"
              rows={[
                { id: 'p', label: 'Momentum', before: pBefore,
                  after: showAfter ? pAfter : pBefore, unit: 'kg m/s',
                  note: showAfter ? undefined : '(after appears once you run it)' },
                { id: 'ke', label: 'Kinetic energy', before: keBefore,
                  after: showAfter ? keAfter : keBefore, unit: 'J' },
              ]}
            />

            <Card>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Pill tone={e >= 0.999 ? 'ok' : e <= 0.001 ? 'bad' : 'info'}>
                  {e >= 0.999 ? 'perfectly elastic' : e <= 0.001 ? 'perfectly inelastic' : 'partly elastic'}
                </Pill>
                {showAfter && <Pill tone="ghost">{`${sig(lost)} J left as heat`}</Pill>}
              </div>
              <Readout label="½·μ_reduced·(1−e²)·v_rel²" value={`${sig(lost)} J`} tone={ACCOUNT.heat.color} />
              <Readout label="Reduced mass μ" value={`${sig(reducedMass(m1, m2))} kg`} />
              <Readout label="CoM velocity" value={`${sig(Math.hypot(vCom.x, vCom.y))} m/s`} tone={GHOST} />
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                The energy loss is not a fitted number. It is the whole centre-of-mass
                kinetic energy, times (1 − e²).
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Which seat?</div>
              <ActionButton full active={comFrame} onClick={() => setComFrame((v) => !v)}>
                {comFrame ? 'Riding the centre of mass' : 'Watching from the ground'}
              </ActionButton>
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                {comFrame
                  ? 'In this seat the total momentum reads zero, so the two arrows are always equal and opposite. An elastic collision can then only reverse both — every elastic collision is this same bounce.'
                  : 'Switch seats and the same event becomes symmetric. Nothing about the physics changes; only the numbers do.'}
              </p>
            </Card>

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your setup</div>
              <SimSlider label="Mass 1" value={m1} min={0.2} max={10} step={0.1} unit="kg"
                onChange={setM1} accent={BODY_A} />
              <SimSlider label="Mass 2" value={m2} min={0.2} max={10} step={0.1} unit="kg"
                onChange={setM2} accent={BODY_B} />
              <SimSlider label="Speed 1" value={u1} min={twoD ? 1 : -8} max={twoD ? 10 : 8} step={0.5}
                unit="m/s" onChange={setU1} accent={BODY_A} />
              {!twoD && (
                <SimSlider label="Speed 2" value={u2} min={-8} max={8} step={0.5} unit="m/s"
                  onChange={setU2} accent={BODY_B} />
              )}
              {twoD && (
                <SimSlider label="Impact offset" value={b} min={0} max={spec.r1 + spec.r2} step={0.01}
                  unit="m" onChange={setB} accent={PRIMARY} />
              )}
              <SimSlider label="Restitution e" value={e} min={0} max={1} step={0.05}
                onChange={setE} accent={ACCOUNT.heat.color} />
            </Card>

            <MisconceptionCard code={arch.targets} when={everRan && done} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={fire} disabled={!canRun} active={running}>
              {running ? 'Running…' : everRan ? 'Run it again' : 'Run the collision'}
            </ActionButton>
            <ActionButton onClick={() => { setT(-LEG); setRunning(false); }} disabled={!everRan}>
              Reset to before
            </ActionButton>
            {!canRun && (
              <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
                {choice === null && step >= predictStep
                  ? 'Commit to the prediction first.'
                  : 'Work through the guided steps to unlock it.'}
              </span>
            )}
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the line of centres — the direction the impulse acts along */}
            {twoD && (
              <line
                x1={P(contact.a).x} y1={P(contact.a).y}
                x2={P(contact.b).x} y2={P(contact.b).y}
                stroke={accentTint(TEXT.primary, 0.35)} strokeWidth={1.5} strokeDasharray="5 5" />
            )}
            {/* The centre of mass, which sails straight through unaffected — the
                fact that makes the CoM frame worth switching into at all. */}
            {!comFrame && (() => {
              const pa = posAt('a', t);
              const pb = posAt('b', t);
              const c = P({
                x: (m1 * pa.x + m2 * pb.x) / (m1 + m2),
                y: (m1 * pa.y + m2 * pb.y) / (m1 + m2),
              });
              return <circle cx={c.x} cy={c.y} r={4} fill="none" stroke={GHOST}
                strokeWidth={1.5} strokeDasharray="3 3" />;
            })()}
            {/* aim line for the 2-D impact parameter */}
            {twoD && (
              <>
                <line x1={0} x2={box.w} y1={P({ x: 0, y: b }).y} y2={P({ x: 0, y: b }).y}
                  stroke={accentTint(PRIMARY, 0.3)} strokeWidth={1} strokeDasharray="3 6" />
                <circle cx={P({ x: contact.a.x - 0.9, y: b }).x} cy={P({ x: 0, y: b }).y}
                  r={HIT.head.hit} fill="transparent"
                  style={{ cursor: 'ns-resize', touchAction: 'none' }}
                  onPointerDown={(ev) => { setAiming(true); aimDrag(ev); }} />
                <circle cx={P({ x: contact.a.x - 0.9, y: b }).x} cy={P({ x: 0, y: b }).y}
                  r={aiming ? HIT.head.r : HIT.head.r * 0.66}
                  fill={accentTint(PRIMARY, aiming ? 0.55 : 0.24)} stroke={PRIMARY}
                  strokeWidth={2} pointerEvents="none" />
              </>
            )}
            {/* the two bodies, with their velocity arrows */}
            {(['a', 'b'] as const).map((w) => {
              const pos = posAt(w, t);
              const q = P(pos);
              const v = shift(t <= 0 ? before[w] : after[w]);
              const col = w === 'a' ? BODY_A : BODY_B;
              const rad = (w === 'a' ? spec.r1 : spec.r2) * view.scale;
              const speed = Math.hypot(v.x, v.y);
              // Arrows are screen-px normalised against the FASTEST body, so a
              // 2× speed really does draw 2× longer at every slider setting —
              // the affine-with-a-cap mapping that made a Phase-1 sim's arrows
              // saturate is exactly what this avoids.
              const ref = Math.max(Math.hypot(before.a.x, before.a.y), Math.hypot(before.b.x, before.b.y), 1e-6);
              const px = (speed / ref) * Math.min(box.w, box.h) * 0.19;
              return (
                <g key={w}>
                  <circle cx={q.x} cy={q.y} r={Math.max(7, rad)}
                    fill={accentTint(col, 0.35)} stroke={col} strokeWidth={2.2} />
                  {speed > 1e-6 && (
                    <line x1={q.x} y1={q.y}
                      x2={q.x + (v.x / speed) * px} y2={q.y - (v.y / speed) * px}
                      stroke={col} strokeWidth={3} strokeLinecap="round" />
                  )}
                </g>
              );
            })}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Reach for momentum first, always — it survives every collision. Only then ask
        whether energy is allowed to survive too. Two equations get you elastic; one
        equation plus &ldquo;they stick&rdquo; gets you the other extreme.
      </ExpertTip>
    </SimShell>
  );
}
