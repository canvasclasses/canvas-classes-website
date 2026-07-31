'use client';

/*
 * energy/OrbitSandbox.tsx — FLAGSHIP. An orbit is a projectile that keeps missing.
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠ THERE IS NO INTEGRATOR IN THIS FILE, AND THAT IS THE LESSON.
 * `lib/orbit.orbitPath` hands the state to `motion-lab/lib/integrate` — the SAME
 * RK4 that draws every parabola in the Projectile Playground — with one thing
 * changed: gravity points at the planet's centre instead of straight down. If
 * this sim needed its own integrator, "an orbit is just a projectile" would be a
 * slogan rather than a fact about the code. Design law #4, enacted.
 *
 * ⚠ THE CLOCK DRAWS; THE ALGEBRA STATES. Every number the student reads —
 * circular speed, escape speed, eccentricity, apoapsis, periapsis, period —
 * comes from `classifyOrbit` in closed form (vis-viva). The integration only
 * draws the curve. That is motion-lab's own rule, inherited.
 *
 * The speed control is deliberately a MULTIPLE of the circular speed, never a
 * raw m/s. 7 546 m/s is a number nobody can reason about; "1.00× circular" is
 * the whole ladder written on one slider.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, OrbitSpec } from './kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, OK, BAD } from './kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill, usePointerDrag,
} from './kit/ui';
import { Board, BenchFrame, useStageBox, useFreeView, fitBounds, worldToScreen, screenToWorld, HIT } from './kit/stage';
import type { LegendRow } from './kit/ui';
import { classifyOrbit, orbitPath, circularSpeed, escapeSpeed, specificEnergy, radiusRange } from './lib/orbit';

export default function OrbitSandbox({ arch, spec }: { arch: Phase2Archetype; spec: OrbitSpec }) {
  const [altKm, setAltKm] = React.useState((spec.r0 - spec.R) / 1000);
  const [vFactor, setVFactor] = React.useState(spec.vFactor);
  const [aiming, setAiming] = React.useState(false);
  const [showAccel, setShowAccel] = React.useState(false);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [t, setT] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [everFired, setEverFired] = React.useState(false);

  const r0 = spec.R + altKm * 1000;
  const vc = circularSpeed(spec.GM, r0);
  const ve = escapeSpeed(spec.GM, r0);
  const v0 = vc * vFactor;

  const verdict = React.useMemo(() => classifyOrbit(spec.GM, spec.R, r0, v0), [spec.GM, spec.R, r0, v0]);
  const path = React.useMemo(
    () => orbitPath({ GM: spec.GM, R: spec.R, r0, v0 }),
    [spec.GM, spec.R, r0, v0],
  );
  const span = React.useMemo(() => radiusRange(path), [path]);

  const duration = path.points.length ? path.points[path.points.length - 1].t : 1;
  React.useEffect(() => { setT(0); setRunning(false); }, [altKm, vFactor]);
  const done = t >= duration - 1e-9;
  useAnimationFrame((dt) => setT((p) => Math.min(p + dt * duration * 0.28, duration)),
    { enabled: running && !done });
  React.useEffect(() => { if (done) setRunning(false); }, [done]);

  const shown = React.useMemo(() => {
    if (!everFired) return 0;
    let i = 0;
    while (i < path.points.length - 1 && path.points[i + 1].t <= t) i++;
    return i;
  }, [everFired, path.points, t]);
  const ship = path.points[Math.min(shown, path.points.length - 1)];

  // ── camera ────────────────────────────────────────────────────────────────
  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const bounds = React.useMemo(() => {
    const far = Math.max(span.max, r0 * 1.15, spec.R * 1.6);
    return fitBounds([
      { x: -far, y: -far }, { x: far, y: far },
    ], 0.02);
  }, [span.max, r0, spec.R]);
  // useFreeView, NOT the shared useFittedView: the shared one quantises the
  // scale onto a 1% ladder, and at planetary scale (2.3e-5 px/m) that rounds to
  // ZERO — every point would land on the centre of the board. See kit/stage.
  const view = useFreeView(bounds, box.w, box.h, aiming, { padFrac: 0.06, maxScale: 1e-3, minScale: 1e-12 });
  const P = React.useCallback((p: { x: number; y: number }) => worldToScreen(p, view), [view]);

  // The launch handle: drag it sideways to set the speed, exactly as a cannon's
  // charge would. The gesture is the primary control, the slider is the fallback.
  const aimDrag = usePointerDrag({
    svgRef,
    onMove: (pt) => {
      const w = screenToWorld(pt, view);
      const dx = Math.max(0, w.x);
      setVFactor(Math.min(1.8, Math.max(0.2, dx / (r0 * 0.55))));
    },
    onEnd: () => setAiming(false),
  });

  const predictStep = 1;
  const fireStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const canFire = step >= fireStep && choice !== null;
  const fire = () => {
    if (!canFire) return;
    setT(0); setRunning(true); setEverFired(true);
    if (step < steps.length) advance();
  };

  const eps = specificEnergy(spec.GM, r0, v0);
  const kindPill = verdict.kind === 'escape' ? 'escape' : verdict.kind === 'crash' ? 'crash'
    : verdict.kind === 'circle' ? 'circle' : 'ellipse';

  const legend: LegendRow[] = [
    { id: 'planet', color: SECONDARY, name: 'The planet', detail: `radius ${sig(spec.R / 1000)} km` },
    { id: 'path', color: PRIMARY, name: 'The path', detail: kindPill },
    { id: 'circ', color: GHOST, name: 'A circular orbit here', dashed: true,
      value: `${sig(vc / 1000)} km/s` },
    { id: 'esc', color: ACCOUNT.heat.color, name: 'Escape speed here', value: `${sig(ve / 1000)} km/s` },
    ...(everFired && ship
      ? [{ id: 'ship', color: ACCOUNT.ke.color, name: 'The cannonball',
        value: `${sig(Math.hypot(ship.vel.x, ship.vel.y) / 1000)} km/s` }]
      : []),
  ];

  const traced = path.points.slice(0, Math.max(2, shown + 1));

  return (
    <SimShell>
      <SimHeader title="Orbit" accentWord="Sandbox"
        subtitle="Newton's cannon · the same integrator that draws every parabola"
        badge={`${vFactor.toFixed(2)}× circular`} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="1 / 1" narrowAspect="1 / 1" maxHeight={520}
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
            <Card tone={verdict.kind === 'crash' ? 'bad' : verdict.kind === 'escape' ? 'accent' : 'ok'}>
              <div className="mb-1.5"><Pill tone={verdict.kind === 'crash' ? 'bad' : 'ok'}>
                {verdict.kind === 'crash' ? 'it hits the ground'
                  : verdict.kind === 'circle' ? 'a circle'
                    : verdict.kind === 'ellipse' ? 'an ellipse' : 'it escapes'}
              </Pill></div>
              <Readout label="Launch speed" value={`${sig(v0 / 1000)} km/s`} tone={ACCOUNT.ke.color} />
              <Readout label="Circular speed here" value={`${sig(vc / 1000)} km/s`} tone={GHOST} />
              <Readout label="Escape speed here" value={`${sig(ve / 1000)} km/s`} tone={ACCOUNT.heat.color} />
              <Readout label="Eccentricity" value={sig(verdict.eccentricity)} />
              {Number.isFinite(verdict.apoapsis) && (
                <>
                  <Readout label="Far side" value={`${sig((verdict.apoapsis - spec.R) / 1000)} km up`} />
                  <Readout label="Near side"
                    value={`${sig((verdict.periapsis - spec.R) / 1000)} km up`}
                    tone={verdict.periapsis <= spec.R ? BAD : undefined} />
                  <Readout label="One lap takes" value={`${sig(verdict.period / 60)} min`} />
                </>
              )}
            </Card>

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
                The energy account
              </div>
              <Readout label="½v² − GM/r" value={`${sig(eps / 1e6)} MJ/kg`}
                tone={eps < 0 ? OK : BAD} />
              <p className="mt-1 text-[11.5px] leading-relaxed" style={{ color: TEXT.ghost }}>
                {eps < 0
                  ? 'Negative: the ball is BOUND. However far it climbs, gravity has enough left to bring it back.'
                  : 'Zero or positive: the ball is unbound. It keeps slowing forever and never quite stops — that, and only that, is what escape speed means.'}
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your shot</div>
              <SimSlider label="Speed" value={vFactor} min={0.2} max={1.8} step={0.01}
                onChange={setVFactor} accent={ACCOUNT.ke.color}
                format={(v) => `${v.toFixed(2)}×`} />
              <SimSlider label="Altitude" value={altKm} min={100} max={4000} step={50} unit="km"
                onChange={setAltKm} accent={PRIMARY} />
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                The speed is a multiple of the circular speed at that altitude, because
                that is the only scale any of this is legible in. 1.00× is a circle,
                1.41× is escape, and every shot in between is an ellipse.
              </p>
            </Card>

            <MisconceptionCard code={arch.targets} when={everFired && done} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={fire} disabled={!canFire} active={running}>
              {running ? 'In flight…' : everFired ? 'Fire again' : 'Fire the cannon'}
            </ActionButton>
            <ActionButton onClick={() => setShowAccel((v) => !v)} active={showAccel} disabled={!everFired}>
              {showAccel ? 'Hide' : 'Show'} the acceleration arrow
            </ActionButton>
            <ActionButton onClick={() => setVFactor(1)}>Snap to a circle</ActionButton>
            <ActionButton onClick={() => setVFactor(Number(Math.SQRT2.toFixed(2)))}>Snap to escape</ActionButton>
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the circular orbit at this altitude, for comparison */}
            <circle cx={P({ x: 0, y: 0 }).x} cy={P({ x: 0, y: 0 }).y} r={r0 * view.scale}
              fill="none" stroke={GHOST} strokeWidth={1.2} strokeDasharray="5 7" />
            {/* the planet */}
            <circle cx={P({ x: 0, y: 0 }).x} cy={P({ x: 0, y: 0 }).y} r={spec.R * view.scale}
              fill={accentTint(SECONDARY, 0.28)} stroke={SECONDARY} strokeWidth={2} />
            {/* the flight */}
            {everFired && traced.length > 1 && (
              <polyline
                points={traced.map((s) => { const q = P(s.pos); return `${q.x},${q.y}`; }).join(' ')}
                fill="none"
                stroke={verdict.kind === 'crash' ? BAD : PRIMARY}
                strokeWidth={2.4} strokeLinecap="round" />
            )}
            {/* the launch handle: drag it out to charge the cannon */}
            <g>
              <line
                x1={P({ x: 0, y: r0 }).x} y1={P({ x: 0, y: r0 }).y}
                x2={P({ x: r0 * 0.55 * vFactor, y: r0 }).x} y2={P({ x: 0, y: r0 }).y}
                stroke={ACCOUNT.ke.color} strokeWidth={3} strokeLinecap="round" />
              <circle cx={P({ x: r0 * 0.55 * vFactor, y: r0 }).x} cy={P({ x: 0, y: r0 }).y}
                r={HIT.head.hit} fill="transparent"
                style={{ cursor: 'ew-resize', touchAction: 'none' }}
                onPointerDown={(e) => { setAiming(true); aimDrag(e); }} />
              <circle cx={P({ x: r0 * 0.55 * vFactor, y: r0 }).x} cy={P({ x: 0, y: r0 }).y}
                r={aiming ? HIT.head.r : HIT.head.r * 0.66}
                fill={accentTint(ACCOUNT.ke.color, aiming ? 0.55 : 0.3)}
                stroke={ACCOUNT.ke.color} strokeWidth={2} pointerEvents="none" />
            </g>
            {/* the ball, and the acceleration that never switches off */}
            {everFired && ship && (
              <>
                {showAccel && (
                  <line
                    x1={P(ship.pos).x} y1={P(ship.pos).y}
                    x2={P(ship.pos).x + (P({ x: 0, y: 0 }).x - P(ship.pos).x) * 0.22}
                    y2={P(ship.pos).y + (P({ x: 0, y: 0 }).y - P(ship.pos).y) * 0.22}
                    stroke={ACCOUNT.pe.color} strokeWidth={3} strokeLinecap="round" />
                )}
                <circle cx={P(ship.pos).x} cy={P(ship.pos).y} r={5.5}
                  fill={accentTint(ACCOUNT.ke.color, 0.9)} stroke={ACCOUNT.ke.color} strokeWidth={2} />
              </>
            )}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Two numbers do all of gravitation: √(GM/r) for going round, and √2 times it for
        getting away. Everything between them is an ellipse, and everything below is a
        very long, very flat cannon shot.
      </ExpertTip>
    </SimShell>
  );
}
