'use client';

/*
 * rotation/MoiRacer.tsx — FLAGSHIP. Race them down the ramp and try to rig it.
 * ─────────────────────────────────────────────────────────────────────────────
 * The point of this sim is that the student is allowed to CHEAT and cannot.
 * Every mass and every radius is a live slider; the finishing order does not
 * move. That is a much stronger demonstration than "mass cancels", because the
 * student spends two minutes personally failing to make it not cancel.
 *
 * ── THE SECOND HALF, ON THE SAME SCREEN ──────────────────────────────────────
 * The race explains WHO wins. The stacked energy bar explains WHY: every body
 * starts with the same mgh, and the k-factor decides how much of it is bought as
 * speed and how much as spin. The bar is the SAME `Stack` component the Energy
 * Ledger uses, so "kinetic energy has parts" is one visual across two chapters
 * rather than two lookalikes that could drift.
 *
 * ⚠ NOTHING MOVES UNTIL RELEASED, and release is gated on the prediction. The
 * whole exercise is worthless if the student sees the answer before committing.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, MoiSpec } from '../energy/kit/phase2';
import { PRIMARY, TEXT, SHAPE_COLOR, ACCOUNT, accentTint, sig } from '../energy/kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Stack, Pill,
} from '../energy/kit/ui';
import { Board, BenchFrame, useStageBox } from '../energy/kit/stage';
import type { LegendRow } from '../energy/kit/ui';
import {
  race, slidingAccel, SHAPE_K, SHAPE_LABEL,
  translationalShare, rotationalShare, minMuForRolling, finishSpeedByEnergy,
} from './lib/inertia';
import type { RollShape } from './lib/inertia';

const DEG = Math.PI / 180;

export default function MoiRacer({ arch, spec }: { arch: Phase2Archetype; spec: MoiSpec }) {
  const [theta, setTheta] = React.useState(spec.thetaDeg);
  const [distance, setDistance] = React.useState(spec.distance);
  const [masses, setMasses] = React.useState<Partial<Record<RollShape, number>>>(spec.masses);
  const [radii, setRadii] = React.useState<Partial<Record<RollShape, number>>>(spec.radii);
  const [withSlider, setWithSlider] = React.useState(spec.withSlider);
  const [selected, setSelected] = React.useState<string | null>(null);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [t, setT] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [everRan, setEverRan] = React.useState(false);

  const entries = React.useMemo(
    () => spec.shapes.map((s) => ({ shape: s, mass: masses[s] ?? 1, radius: radii[s] ?? 0.12 })),
    [spec.shapes, masses, radii],
  );
  const rows = React.useMemo(
    () => race(entries, { distance, thetaDeg: theta, g: spec.g }),
    [entries, distance, theta, spec.g],
  );
  const sliderA = slidingAccel(theta, spec.g, 0);
  const sliderT = Math.sqrt((2 * distance) / Math.max(sliderA, 1e-9));
  const slowest = Math.max(...rows.map((r) => r.time), withSlider ? sliderT : 0);

  React.useEffect(() => { setT(0); setRunning(false); }, [theta, distance, masses, radii]);
  const done = t >= slowest - 1e-9;
  useAnimationFrame((dt) => setT((p) => Math.min(p + dt, slowest)), { enabled: running && !done });
  React.useEffect(() => { if (done) setRunning(false); }, [done]);

  const box = useStageBox();
  const predictStep = 1;
  const releaseStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const canRelease = step >= releaseStep && choice !== null;
  const release = () => {
    if (!canRelease) return;
    setT(0); setRunning(true); setEverRan(true);
    if (step < steps.length) advance();
  };

  // ── the ramp, in screen px (the viewBox IS the pixel box) ─────────────────
  const PAD = 30;
  const laneCount = spec.shapes.length + (withSlider ? 1 : 0);
  const rampLen = Math.max(1, Math.min(box.w - PAD * 2, (box.h - PAD * 2) / Math.max(0.35, Math.tan(theta * DEG))));
  const runPx = Math.min(box.w - PAD * 2, rampLen * Math.cos(theta * DEG) * 1.6);
  const topY = PAD;
  const botY = Math.min(box.h - PAD, topY + runPx * Math.tan(theta * DEG));
  const laneGap = laneCount > 1 ? Math.min(26, (box.h - PAD * 2) / (laneCount + 1)) : 0;

  /** Position along the slope at time `time`, 0…1 of the course. */
  const progress = (a: number, time: number) => Math.min(1, (0.5 * a * time * time) / Math.max(distance, 1e-9));

  const finish = React.useMemo(() => {
    const ordered = [...rows].sort((a, b) => a.time - b.time);
    return ordered;
  }, [rows]);

  const legend: LegendRow[] = [
    ...rows.map((r) => ({
      id: r.shape,
      color: SHAPE_COLOR[r.shape],
      name: SHAPE_LABEL[r.shape],
      detail: `k = ${sig(SHAPE_K[r.shape])} · ${sig(r.mass)} kg · r = ${sig(r.radius)} m`,
      value: everRan && done ? `${sig(r.time)} s` : `a = ${sig(r.accel)} m/s²`,
    })),
    ...(withSlider
      ? [{ id: 'slider', color: SHAPE_COLOR.slider, name: 'Frictionless slider',
        detail: 'nothing to spin up', dashed: true,
        value: everRan && done ? `${sig(sliderT)} s` : `a = ${sig(sliderA)} m/s²` }]
      : []),
  ];

  const sel = (selected && rows.find((r) => r.shape === selected)) || rows[0];
  const height = distance * Math.sin(theta * DEG);
  const mgh = sel ? sel.mass * spec.g * height : 0;

  return (
    <SimShell>
      <SimHeader title="Moment-of-inertia" accentWord="Racer"
        subtitle="Mass distribution, not mass, decides who wins"
        badge={`${theta}° ramp`} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="16 / 9" narrowAspect="4 / 3"
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
            <Legend title="The field" rows={legend} selectedId={selected} onSelect={setSelected} />

            {everRan && done && (
              <Card tone="ok">
                <div className="mb-1.5 flex flex-wrap gap-1.5">
                  {finish.map((r, i) => (
                    <Pill key={r.shape} tone={i === 0 ? 'ok' : 'ghost'}>
                      {i + 1}. {SHAPE_LABEL[r.shape]}
                    </Pill>
                  ))}
                </div>
                <p className="text-[12px] leading-relaxed" style={{ color: TEXT.secondary }}>
                  Change every mass and every radius and run it again. The order is set by
                  k alone, and k is a number about shape.
                </p>
              </Card>
            )}

            {sel && (
              <Card>
                <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
                  {SHAPE_LABEL[sel.shape]} — where the drop went
                </div>
                <Stack
                  values={{
                    ke: mgh * translationalShare(sel.shape),
                    rot: mgh * rotationalShare(sel.shape),
                  }}
                  scaleTotal={Math.max(mgh, 1e-9)}
                  height={150}
                  label={`mgh = ${sig(mgh)} J`}
                />
                <p className="mt-2 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                  {`${(rotationalShare(sel.shape) * 100).toFixed(0)}% of the drop is spent on spinning `}
                  {`and only ${(translationalShare(sel.shape) * 100).toFixed(0)}% on going anywhere. `}
                  The shares are k/(1+k) and 1/(1+k) — the same k that set the acceleration.
                </p>
                <Readout label="Finish speed (kinematics)" value={`${sig(sel.finishSpeed)} m/s`} tone={ACCOUNT.ke.color} />
                <Readout label="Finish speed (energy)" tone={ACCOUNT.pe.color}
                  value={`${sig(finishSpeedByEnergy(sel.shape, height, spec.g))} m/s`} />
                <Readout label="Friction it needs to roll" value={`μ ≥ ${sig(minMuForRolling(sel.shape, theta))}`} />
              </Card>
            )}

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
                Load the dice
              </div>
              <SimSlider label="Ramp angle" value={theta} min={5} max={45} step={1} unit="°"
                onChange={setTheta} accent={PRIMARY} />
              <SimSlider label="Course" value={distance} min={0.5} max={6} step={0.1} unit="m"
                onChange={setDistance} accent={PRIMARY} />
              {spec.shapes.map((s) => (
                <React.Fragment key={s}>
                  <SimSlider label={`${SHAPE_LABEL[s]} mass`} value={masses[s] ?? 1}
                    min={0.1} max={10} step={0.1} unit="kg"
                    onChange={(v) => setMasses((m) => ({ ...m, [s]: v }))}
                    accent={SHAPE_COLOR[s]} />
                  <SimSlider label={`${SHAPE_LABEL[s]} radius`} value={radii[s] ?? 0.12}
                    min={0.03} max={0.3} step={0.01} unit="m"
                    onChange={(v) => setRadii((m) => ({ ...m, [s]: v }))}
                    accent={SHAPE_COLOR[s]} />
                </React.Fragment>
              ))}
              <ActionButton full active={withSlider} onClick={() => setWithSlider((v) => !v)}>
                {withSlider ? 'Remove' : 'Add'} a frictionless slider to the race
              </ActionButton>
            </Card>

            <MisconceptionCard code={arch.targets} when={everRan && done} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={release} disabled={!canRelease} active={running}>
              {running ? 'Racing…' : everRan ? 'Race again' : 'Release them'}
            </ActionButton>
            <ActionButton onClick={() => { setT(0); setRunning(false); }} disabled={!everRan}>
              Back to the start line
            </ActionButton>
            {!canRelease && (
              <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
                {choice === null && step >= predictStep
                  ? 'Commit to a finishing order first.'
                  : 'Work through the guided steps to unlock the release.'}
              </span>
            )}
          </div>
        }
      >
        {box.ready && (
          <Board w={box.w} h={box.h}>
            {/* the ramp */}
            <line x1={PAD} y1={topY} x2={PAD + runPx} y2={botY}
              stroke={accentTint(PRIMARY, 0.8)} strokeWidth={3.5} strokeLinecap="round" />
            <line x1={PAD} y1={botY} x2={PAD + runPx} y2={botY}
              stroke={accentTint(TEXT.primary, 0.22)} strokeWidth={1.5} />
            {/* the finish line */}
            <line x1={PAD + runPx} y1={topY} x2={PAD + runPx} y2={botY}
              stroke={accentTint(TEXT.primary, 0.35)} strokeWidth={1.5} strokeDasharray="4 5" />
            {/* the racers, one lane each, perpendicular to the slope */}
            {rows.map((r, i) => {
              const f = everRan ? progress(r.accel, t) : 0;
              const off = (i - (laneCount - 1) / 2) * laneGap;
              const nx = Math.sin(theta * DEG);
              const ny = -Math.cos(theta * DEG);
              const cx = PAD + f * runPx + off * nx;
              const cy = topY + f * (botY - topY) + off * ny;
              const rad = 9 + (r.radius / 0.3) * 5;
              const spin = everRan ? -(f * distance) / Math.max(r.radius, 1e-6) : 0;
              const on = selected === r.shape;
              return (
                <g key={r.shape} transform={`translate(${cx} ${cy - rad})`}>
                  <circle r={rad} fill={accentTint(SHAPE_COLOR[r.shape], r.shape === 'hoop' || r.shape === 'hollow-sphere' ? 0.12 : 0.4)}
                    stroke={SHAPE_COLOR[r.shape]} strokeWidth={r.shape === 'hoop' ? 4 : 2.4} />
                  {on && <circle r={rad + 5} fill="none" stroke={SHAPE_COLOR[r.shape]} strokeWidth={1} opacity={0.6} />}
                  {/* a spoke, so the spin is visible — this is the whole difference
                      between rolling and sliding, and it must be seen */}
                  <line x1={0} y1={0} x2={rad * Math.cos(spin)} y2={rad * Math.sin(spin)}
                    stroke={SHAPE_COLOR[r.shape]} strokeWidth={2} />
                </g>
              );
            })}
            {/* the slider — no spoke, because nothing turns */}
            {withSlider && (() => {
              const f = everRan ? progress(sliderA, t) : 0;
              const off = ((laneCount - 1) / 2) * laneGap;
              const cx = PAD + f * runPx + off * Math.sin(theta * DEG);
              const cy = topY + f * (botY - topY) - off * Math.cos(theta * DEG);
              return (
                <rect x={cx - 9} y={cy - 20} width={18} height={13} rx={2}
                  fill={accentTint(SHAPE_COLOR.slider, 0.3)} stroke={SHAPE_COLOR.slider} strokeWidth={2}
                  transform={`rotate(${-theta} ${cx} ${cy - 13})`} />
              );
            })()}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        a = g sin θ / (1 + k). Learn the four k values — 2/5, 1/2, 2/3, 1 — and every
        rolling problem in the chapter becomes a one-line substitution.
      </ExpertTip>
    </SimShell>
  );
}
