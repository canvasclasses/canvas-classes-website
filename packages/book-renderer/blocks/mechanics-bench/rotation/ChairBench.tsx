'use client';

/*
 * rotation/ChairBench.tsx — FLAGSHIP. L holds. KE does not. So where from?
 * ─────────────────────────────────────────────────────────────────────────────
 * The demonstration everybody has seen and almost nobody can finish. Pull the
 * weights in, the spin doubles — fine. Now: KE = ½Iω² went UP by a factor of two,
 * and energy is never created. Where did the joules come from?
 *
 * ── WHY THE TWO ROWS SIT SIDE BY SIDE ────────────────────────────────────────
 * `BeforeAfter` prints L and KE with a Δ column. One Δ is zero and the other is
 * not, and they are one line apart. That single juxtaposition is the entire
 * lesson: a conservation law is a statement about ONE quantity, and the habit of
 * generalising it to a second is the most expensive one in this chapter.
 *
 * The work row is the answer, and it is a MEASURED quantity here rather than an
 * assertion: `workToChangeInertia` returns L²/2I₁ − L²/2I₀, which is exactly the
 * KE change, and the sim prints both so the student can check they match.
 *
 * The reverse gesture matters as much as the forward one. Letting the arms back
 * out returns every joule — the work goes negative by the same amount — and a
 * source that also takes returns is recognisably a source.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, ChairSpec } from '../energy/kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, J, OK, BAD } from '../energy/kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill,
  BeforeAfter, usePointerDrag,
} from '../energy/kit/ui';
import { Board, BenchFrame, useStageBox } from '../energy/kit/stage';
import type { LegendRow } from '../energy/kit/ui';
import {
  chairInertia, spinAfter, rotationalKE, angularMomentum,
  armLengthForInertia, workToChangeInertia,
} from './lib/angmom';

export default function ChairBench({ arch, spec }: { arch: Phase2Archetype; spec: ChairSpec }) {
  const [core, setCore] = React.useState(spec.coreInertia);
  const [weight, setWeight] = React.useState(spec.weightMass);
  const [armOut, setArmOut] = React.useState(spec.armLength);
  const [omega0, setOmega0] = React.useState(spec.omega0);
  const [arm, setArm] = React.useState(spec.armLength);      // the LIVE arm length
  const [grab, setGrab] = React.useState<boolean>(false);
  const [spinning, setSpinning] = React.useState(false);
  const [angle, setAngle] = React.useState(0);
  const [touched, setTouched] = React.useState(false);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);

  const base = React.useMemo(
    () => ({ coreInertia: core, weightMass: weight, armLength: armOut, count: 2 }),
    [core, weight, armOut],
  );
  const I0 = chairInertia(base);
  const I = chairInertia({ ...base, armLength: arm });
  const omega = spinAfter(I0, omega0, I);
  const ke0 = rotationalKE(I0, omega0);
  const ke = rotationalKE(I, omega);
  const L0 = angularMomentum(I0, omega0);
  const L = angularMomentum(I, omega);
  const work = workToChangeInertia(I0, omega0, I);
  const halfArm = armLengthForInertia(base, I0 / 2);

  React.useEffect(() => { setArm(armOut); }, [armOut]);
  useAnimationFrame((dt) => setAngle((a) => a + omega * dt * 0.35), { enabled: spinning });

  const predictStep = 1;
  const pullStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  const canPull = step >= pullStep && choice !== null;

  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const cx = box.w / 2;
  const cy = box.h / 2;
  const maxArm = 1.05;
  const scale = Math.min(box.w, box.h) * 0.40 / maxArm;

  const dragArm = usePointerDrag({
    svgRef,
    onMove: (pt) => {
      if (!canPull) return;
      setTouched(true);
      const d = Math.hypot(pt.x - cx, pt.y - cy) / Math.max(scale, 1e-6);
      setArm(Math.min(armOut, Math.max(0.05, d)));
    },
    onEnd: () => setGrab(false),
  });

  const pulled = arm < armOut - 1e-6;
  const legend: LegendRow[] = [
    { id: 'chair', color: PRIMARY, name: 'Person + chair',
      detail: `I = ${sig(core)} kg m², unchanged by the arms` },
    { id: 'weights', color: SECONDARY, name: 'Two weights',
      detail: `${sig(weight)} kg each at ${sig(arm)} m`,
      value: `${sig(2 * weight * arm * arm)} kg m²` },
    { id: 'spin', color: ACCOUNT.ke.color, name: 'Spin rate',
      value: `${sig((omega * 60) / (2 * Math.PI))} rpm` },
  ];

  // Two weights, diametrically opposite. Screen positions from the live arm.
  const wPos = (k: number) => ({
    x: cx + Math.cos(angle + k * Math.PI) * arm * scale,
    y: cy + Math.sin(angle + k * Math.PI) * arm * scale,
  });

  return (
    <SimShell>
      <SimHeader title="Angular-momentum" accentWord="Chair"
        subtitle="L is conserved. Kinetic energy is not — and it goes up."
        badge={`I = ${sig(I)} kg m²`} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="1 / 1" narrowAspect="1 / 1" maxHeight={420}
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
                { id: 'L', label: 'Angular momentum L', before: L0, after: L, unit: 'kg m²/s',
                  note: 'Iω' },
                { id: 'ke', label: 'Kinetic energy', before: ke0, after: ke, unit: 'J', note: '½Iω²' },
                { id: 'w', label: 'Spin rate ω', before: omega0, after: omega, unit: 'rad/s' },
                { id: 'I', label: 'Moment of inertia I', before: I0, after: I, unit: 'kg m²' },
              ]}
            />

            <Card tone={pulled ? 'accent' : 'plain'}>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <Pill tone="ok">L held</Pill>
                {pulled && <Pill tone={work > 0 ? 'bad' : 'info'}>
                  {work > 0 ? `you supplied ${sig(work)} J` : `you got back ${sig(-work)} J`}
                </Pill>}
              </div>
              <Readout label="Work you did" value={J(work)}
                tone={work > 0 ? ACCOUNT.heat.color : OK} />
              <Readout label="Rise in kinetic energy" value={J(ke - ke0)} tone={ACCOUNT.ke.color} />
              <Readout label="They differ by" tone={Math.abs(work - (ke - ke0)) < 1e-9 ? OK : BAD}
                value={Math.abs(work - (ke - ke0)) < 1e-9 ? 'nothing at all' : J(work - (ke - ke0))} />
              <Readout label="KE ratio" value={`${sig(ke / Math.max(ke0, 1e-9))}×`} />
              <Readout label="I ratio" value={`${sig(I0 / Math.max(I, 1e-9))}×`} />
              <p className="mt-1.5 text-[11.5px] leading-relaxed" style={{ color: TEXT.ghost }}>
                With L pinned, KE = L²/2I — so the two ratios above are the SAME number,
                at every arm position. Halving I can only ever double the energy.
              </p>
            </Card>

            <Legend title="On the chair" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your setup</div>
              <SimSlider label="Person + chair I" value={core} min={0.5} max={8} step={0.1}
                unit="kg m²" onChange={setCore} accent={PRIMARY} />
              <SimSlider label="Mass per hand" value={weight} min={0.5} max={10} step={0.5}
                unit="kg" onChange={setWeight} accent={SECONDARY} />
              <SimSlider label="Arms out" value={armOut} min={0.3} max={1} step={0.01}
                unit="m" onChange={setArmOut} accent={SECONDARY} />
              <SimSlider label="Starting spin" value={omega0} min={0.5} max={12} step={0.5}
                unit="rad/s" onChange={setOmega0} accent={ACCOUNT.ke.color} />
              <SimSlider label="Arms now" value={arm} min={0.05} max={armOut} step={0.01}
                unit="m" onChange={(v) => { setTouched(true); setArm(v); }}
                accent={ACCOUNT.heat.color} disabled={!canPull} />
            </Card>

            <MisconceptionCard code={arch.targets} when={canPull && touched && pulled} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={() => setSpinning((s) => !s)} active={spinning}>
              {spinning ? 'Freeze the chair' : 'Start it spinning'}
            </ActionButton>
            <ActionButton disabled={!canPull || halfArm === null}
              onClick={() => { if (halfArm !== null) { setTouched(true); setArm(Math.min(armOut, halfArm)); } }}>
              Pull in until I halves
            </ActionButton>
            <ActionButton disabled={!canPull || !pulled} onClick={() => { setTouched(true); setArm(armOut); }}>
              Let the arms back out
            </ActionButton>
            {!canPull && (
              <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
                Commit to what the ENERGY does before you pull anything in.
              </span>
            )}
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the circle the weights travel on, at arms-out */}
            <circle cx={cx} cy={cy} r={armOut * scale} fill="none"
              stroke={GHOST} strokeWidth={1} strokeDasharray="4 6" />
            {/* the chair */}
            <circle cx={cx} cy={cy} r={Math.max(10, Math.min(box.w, box.h) * 0.07)}
              fill={accentTint(PRIMARY, 0.28)} stroke={PRIMARY} strokeWidth={2.5} />
            {/* the arms and the weights */}
            {[0, 1].map((k) => {
              const p = wPos(k);
              const rad = Math.max(9, 7 + weight * 1.6);
              return (
                <g key={k}>
                  <line x1={cx} y1={cy} x2={p.x} y2={p.y}
                    stroke={accentTint(SECONDARY, 0.7)} strokeWidth={3} strokeLinecap="round" />
                  {/* the inward pull that does the work — only while pulled in */}
                  {pulled && (
                    <line x1={p.x} y1={p.y}
                      x2={p.x + (cx - p.x) * 0.28} y2={p.y + (cy - p.y) * 0.28}
                      stroke={ACCOUNT.heat.color} strokeWidth={3} strokeLinecap="round" />
                  )}
                  <circle cx={p.x} cy={p.y} r={rad + 14} fill="transparent"
                    style={{ cursor: canPull ? 'grab' : 'not-allowed', touchAction: 'none' }}
                    onPointerDown={(e) => { if (!canPull) return; setGrab(true); dragArm(e); }} />
                  <circle cx={p.x} cy={p.y} r={rad}
                    fill={accentTint(SECONDARY, grab ? 0.6 : 0.4)} stroke={SECONDARY} strokeWidth={2.4}
                    pointerEvents="none" />
                </g>
              );
            })}
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Two questions, never one. &ldquo;Is there an external torque?&rdquo; decides whether L is
        conserved. &ldquo;Is anything doing work?&rdquo; decides whether KE is. They have different
        answers here, and that is the whole exercise.
      </ExpertTip>
    </SimShell>
  );
}
