'use client';

/*
 * rotation/RollingBench.tsx — the part of the tyre that is standing still.
 * ─────────────────────────────────────────────────────────────────────────────
 * One arrow does the whole job: the velocity of the material point touching the
 * road. For pure rolling it has ZERO length, sitting underneath an arrow at the
 * top of the same wheel that is twice as long as the car's own velocity.
 *
 * No textbook figure can show this, because both facts are about the same wheel
 * at the same instant and a still picture cannot distinguish "the contact point
 * is at rest" from "the contact point moves with the wheel". A student can stare
 * at v_contact = v − ωr for a year without believing it.
 *
 * ── THE SLIP CONTROL IS THE PROOF, NOT A TOY ─────────────────────────────────
 * Rolling is a CONDITION, not a property of wheels: ω = −v/r. Slide the slip
 * control away from zero and the bottom arrow grows — a locked wheel skidding
 * (slip +1) or wheelspin (slip −1). Being able to break it is what makes the
 * zero mean something.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, RollingSpec } from '../energy/kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, OK, BAD } from '../energy/kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill,
} from '../energy/kit/ui';
import { Board, BenchFrame, useStageBox } from '../energy/kit/stage';
import type { LegendRow } from '../energy/kit/ui';
import { rimVelocity, rollingOmega, slipVelocity, slipRatio, cycloidPoint, isPureRolling } from './lib/rolling';

/** The rim points that get an arrow. Twelve is enough to read as a fan and few
 *  enough that no two arrows collide at any wheel size. */
const RIM = Array.from({ length: 12 }, (_, i) => i * 30);

export default function RollingBench({ arch, spec }: { arch: Phase2Archetype; spec: RollingSpec }) {
  const [v, setV] = React.useState(spec.v);
  const [radius, setRadius] = React.useState(spec.radius);
  const [slip, setSlip] = React.useState(spec.slip);
  const [cycloid, setCycloid] = React.useState(spec.showCycloid);
  const [drawn, setDrawn] = React.useState(0);       // how many rim arrows revealed
  const [rolling, setRolling] = React.useState(false);
  const [dist, setDist] = React.useState(0);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);

  // ω = −v/r for pure rolling; slip shifts it. slip = +1 is a locked wheel
  // (ω = 0); slip = −1 is wheelspin at twice the rolling rate.
  const omega = rollingOmega(v, radius) * (1 - slip);
  const contact = slipVelocity(v, omega, radius);
  const pure = isPureRolling(v, omega, radius, 1e-9);
  const ratio = slipRatio(v, omega, radius);

  useAnimationFrame((dt) => setDist((d) => d + v * dt * 0.35), { enabled: rolling });
  React.useEffect(() => { setDist(0); }, [v, radius, slip]);

  const box = useStageBox();
  const PAD = 40;
  const roadY = box.h * 0.72;
  // Pixels per metre, chosen so the wheel fills a comfortable share of the board
  // whatever radius the student picks — the fit rule applied to a single circle.
  const scale = Math.max(1, Math.min((box.h - PAD * 2) * 0.42 / Math.max(radius, 0.05), (box.w - PAD * 2) * 0.16 / Math.max(radius, 0.05)));
  const rPx = radius * scale;
  // The wheel wraps rather than running off the board. `originX` is where the
  // centre sat at the start of the CURRENT lap, so the cycloid, the spoke and
  // the marked rim point can all be drawn from one consistent origin — an
  // earlier version wrapped the centre but not the curve, and the trace slid out
  // from under the wheel it was supposed to belong to.
  const wrapPx = Math.max(1, box.w * 0.5);
  const travelled = (dist * scale) % wrapPx;
  const originX = box.w * 0.24;
  const cx = originX + travelled;
  const cy = roadY - rPx;
  /** Metres rolled since the start of this lap — the cycloid's parameter. */
  const lapD = travelled / scale;

  const predictStep = 1;
  const drawStep = 2;
  const advance = () => setStep((val) => Math.min(val + 1, steps.length));
  const canDraw = step >= drawStep && choice !== null;

  // Arrows are screen-px normalised against 2v — the largest speed on a purely
  // rolling wheel — so the top arrow is always full length and the bottom one is
  // honestly zero. A capped affine map would make a 2× ratio look like 1.3×,
  // which is the Phase-1 pulley defect this deliberately avoids.
  const ref = Math.max(2 * Math.abs(v), 1e-6);
  const arrowPx = Math.min(box.w, box.h) * 0.2;

  const bottom = rimVelocity(v, omega, radius, 270);
  const top = rimVelocity(v, omega, radius, 90);

  const legend: LegendRow[] = [
    { id: 'centre', color: SECONDARY, name: 'The centre (the car)', value: `${sig(Math.abs(v))} m/s` },
    { id: 'top', color: ACCOUNT.ke.color, name: 'Top of the tyre',
      detail: pure ? 'carried forward AND swung forward' : undefined,
      value: `${sig(Math.hypot(top.x, top.y))} m/s` },
    { id: 'bottom', color: pure ? OK : BAD, name: 'The contact point',
      detail: pure ? 'the two effects cancel exactly' : 'it is sliding on the road',
      value: `${sig(Math.abs(contact))} m/s` },
    ...(cycloid ? [{ id: 'cyc', color: GHOST, name: 'Path of a marked point', dashed: true,
      detail: 'a cycloid — a corner at every touch' }] : []),
  ];

  return (
    <SimShell>
      <SimHeader title="Rolling vs" accentWord="Sliding"
        subtitle="At the contact point of pure rolling, the velocity is zero"
        badge={pure ? 'rolling' : ratio > 0 ? 'skidding' : 'wheelspin'} />
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
            <Card tone={pure ? 'ok' : 'bad'}>
              <div className="mb-1.5"><Pill tone={pure ? 'ok' : 'bad'}>
                {pure ? 'rolling without slipping' : ratio > 0 ? 'the wheel is locked and skidding' : 'the wheel is spinning out'}
              </Pill></div>
              <Readout label="Contact-point velocity" tone={pure ? OK : BAD}
                value={pure ? 'exactly 0' : `${sig(Math.abs(contact))} m/s`} />
              <Readout label="Top-of-tyre velocity" value={`${sig(Math.hypot(top.x, top.y))} m/s`}
                tone={ACCOUNT.ke.color} />
              <Readout label="Top speed, as a multiple of v"
                value={`${sig(Math.hypot(top.x, top.y) / Math.max(Math.abs(v), 1e-9))}×`} />
              <Readout label="ω" value={`${sig(omega)} rad/s`} tone={SECONDARY} />
              <Readout label="ω for pure rolling" value={`${sig(rollingOmega(v, radius))} rad/s`} tone={GHOST} />
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                {pure
                  ? 'Which is why a rolling tyre leaves no skid mark, and why the contact patch is the only sharp part of a photograph of a moving wheel.'
                  : 'The rubber at the bottom is now sliding over the road — that is the squeal, and that is what leaves a mark.'}
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your wheel</div>
              <SimSlider label="Road speed" value={v} min={0.5} max={10} step={0.1} unit="m/s"
                onChange={setV} accent={SECONDARY} />
              <SimSlider label="Wheel radius" value={radius} min={0.1} max={1} step={0.05} unit="m"
                onChange={setRadius} accent={PRIMARY} />
              <SimSlider label="Slip" value={slip} min={-1} max={1} step={0.05}
                onChange={setSlip} accent={ACCOUNT.heat.color}
                format={(x) => (Math.abs(x) < 0.001 ? 'rolling' : x.toFixed(2))} />
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                Rolling is a CONDITION — ω = −v/r — not a property of wheels. Being able
                to break it is what makes the zero mean something.
              </p>
            </Card>

            <MisconceptionCard code={arch.targets} when={canDraw && drawn >= RIM.length} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton disabled={!canDraw} active={drawn > 0}
              onClick={() => setDrawn((d) => (d >= RIM.length ? 0 : Math.min(RIM.length, d + 3)))}>
              {drawn === 0 ? 'Draw the rim arrows' : drawn >= RIM.length ? 'Clear the arrows' : 'Draw three more'}
            </ActionButton>
            <ActionButton onClick={() => setRolling((r) => !r)} active={rolling}>
              {rolling ? 'Stop the wheel' : 'Let it roll'}
            </ActionButton>
            <ActionButton onClick={() => setCycloid((c) => !c)} active={cycloid} disabled={!canDraw}>
              {cycloid ? 'Hide' : 'Trace'} a point on the rim
            </ActionButton>
            {!canDraw && (
              <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
                Commit to the prediction before any arrow is drawn.
              </span>
            )}
          </div>
        }
      >
        {box.ready && (
          <Board w={box.w} h={box.h}>
            {/* the road */}
            <line x1={0} x2={box.w} y1={roadY} y2={roadY}
              stroke={accentTint(TEXT.primary, 0.3)} strokeWidth={2} />
            {/* the cycloid a marked rim point traces, over one whole lap */}
            {cycloid && canDraw && (
              <polyline fill="none" stroke={GHOST} strokeWidth={1.6} strokeDasharray="4 4"
                points={Array.from({ length: 180 }, (_, i) => {
                  const p = cycloidPoint(radius, (i / 179) * (wrapPx / scale), 270);
                  return `${originX + p.x * scale},${roadY - p.y * scale}`;
                }).join(' ')} />
            )}
            {/* the wheel */}
            <circle cx={cx} cy={cy} r={rPx} fill={accentTint(PRIMARY, 0.12)}
              stroke={PRIMARY} strokeWidth={3} />
            {/* One spoke, running out to the marked rim point, so the spoke and
                the trace are the same object seen two ways. The wheel turns
                CLOCKWISE by d/r as it rolls right, which is the sign that makes
                the contact point come out at rest. */}
            {(() => {
              const mark = cycloidPoint(radius, lapD, 270);
              return (
                <>
                  <line x1={cx} y1={cy}
                    x2={originX + mark.x * scale} y2={roadY - mark.y * scale}
                    stroke={accentTint(PRIMARY, 0.7)} strokeWidth={2.5} />
                  {cycloid && canDraw && (
                    <circle cx={originX + mark.x * scale} cy={roadY - mark.y * scale}
                      r={4.5} fill={GHOST} />
                  )}
                </>
              );
            })()}
            {/* the centre's own velocity */}
            <line x1={cx} y1={cy} x2={cx + (Math.abs(v) / ref) * arrowPx} y2={cy}
              stroke={SECONDARY} strokeWidth={3.5} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={4} fill={SECONDARY} />
            {/* the rim fan, revealed three at a time */}
            {RIM.slice(0, drawn).map((phi) => {
              const a = (phi * Math.PI) / 180;
              const px = cx + rPx * Math.cos(a);
              const py = cy - rPx * Math.sin(a);
              const rv = rimVelocity(v, omega, radius, phi);
              const sp = Math.hypot(rv.x, rv.y);
              const len = (sp / ref) * arrowPx;
              const isContact = phi === 270;
              const col = isContact ? (pure ? OK : BAD) : ACCOUNT.ke.color;
              return (
                <g key={phi}>
                  <circle cx={px} cy={py} r={isContact ? 5 : 3} fill={col} />
                  {len > 1 && (
                    <line x1={px} y1={py} x2={px + (rv.x / sp) * len} y2={py - (rv.y / sp) * len}
                      stroke={col} strokeWidth={isContact ? 3.5 : 2.4} strokeLinecap="round" />
                  )}
                  {/* the contact point gets a ring even at zero length, so
                      "there IS an arrow here and it has no length" is legible */}
                  {isContact && len <= 1 && (
                    <circle cx={px} cy={py} r={9} fill="none" stroke={OK} strokeWidth={2} />
                  )}
                </g>
              );
            })}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Whenever a rolling problem confuses you, put a dot at the contact point and ask
        how fast it is going. If the answer is zero, you may use v = ωr everywhere else
        in the question. If it is not, you may not use it anywhere.
      </ExpertTip>
    </SimShell>
  );
}
