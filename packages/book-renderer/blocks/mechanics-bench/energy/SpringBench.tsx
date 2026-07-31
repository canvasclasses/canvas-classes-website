'use client';

/*
 * energy/SpringBench.tsx — work is the AREA under F–x.
 * ─────────────────────────────────────────────────────────────────────────────
 * The whole sim is one picture with two shapes on it: the shaded area (the
 * truth) and a ghost rectangle of height F(x) (the F·d answer). For a linear
 * spring the rectangle is exactly twice the area, every time, at every k and
 * every x — so the error is not "a bit off", it is a factor the student can see.
 *
 * The stiffening band (β ≠ 0) is the second half, and it is what stops a student
 * swapping one formula for another: with a curved F–x graph, ½kx² is wrong too,
 * and only "take the area" survives. Simpson's rule integrates cubics EXACTLY,
 * so the drawn strips and the closed form agree to floating point and the sim
 * never has to hedge about its own numbers.
 *
 * ⚠ THE STRIPS ARE THE ARGUMENT. Each strip is a tiny F·d where the force really
 * IS constant — which is why "work is force times distance" was never wrong, only
 * applied at the wrong scale. The strip count is a slider so a student can watch
 * the sum converge, which is the same gesture as taking a limit.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE, useAnimationFrame } from '../../simulations/_shared';
import type { Phase2Archetype, SpringSpec } from './kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig, J, OK, BAD } from './kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Stack, usePointerDrag,
} from './kit/ui';
import { Board, BenchFrame, useStageBox } from './kit/stage';
import type { LegendRow } from './kit/ui';
import { forceAt, workExact, workBySimpson, naiveWork, areaStrips, compressionFor, springPE } from './lib/spring';

export default function SpringBench({ arch, spec }: { arch: Phase2Archetype; spec: SpringSpec }) {
  const [k, setK] = React.useState(spec.k);
  const [beta, setBeta] = React.useState(spec.beta);
  const [x, setX] = React.useState(spec.xMax * 0.66);
  const [strips, setStrips] = React.useState(8);
  const [mass, setMass] = React.useState(spec.mass);
  const [v0, setV0] = React.useState(spec.v0);
  const [dragging, setDragging] = React.useState(false);
  const [showGhost, setShowGhost] = React.useState(false);
  const [launched, setLaunched] = React.useState(false);
  const [t, setT] = React.useState(0);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);

  const law = React.useMemo(() => ({ k, beta }), [k, beta]);
  const xMax = spec.xMax;

  const trueW = workExact(law, 0, x);
  const naiveW = naiveWork(law, 0, x);
  const hookeW = 0.5 * k * x * x;
  const simpsonW = workBySimpson(law, 0, x, Math.max(2, strips));
  const stripList = React.useMemo(() => areaStrips(law, 0, x, Math.max(1, strips)), [law, x, strips]);
  const stripSum = stripList.reduce((a, s) => a + s.f * (s.b - s.a), 0);

  // The launch: a block of `mass` at `v0` runs into the spring and stops when
  // the stored PE equals its KE. Solved, not integrated.
  const stopX = React.useMemo(() => Math.min(xMax, compressionFor(law, mass, v0, xMax * 3)), [law, mass, v0, xMax]);
  const launchDur = 0.9;
  React.useEffect(() => { setT(0); setLaunched(false); }, [k, beta, mass, v0]);
  useAnimationFrame((dt) => setT((p) => Math.min(p + dt, launchDur)), { enabled: launched && t < launchDur });
  const launchX = launched ? stopX * Math.sin((Math.min(t, launchDur) / launchDur) * (Math.PI / 2)) : 0;
  const launchV = Math.sqrt(Math.max(0, v0 * v0 - (2 * springPE(law, launchX)) / mass));

  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);

  // ── graph geometry (screen px; the board's viewBox IS the pixel box) ──────
  const PAD = { l: 34, r: 16, t: 16, b: 30 };
  const gw = Math.max(1, box.w - PAD.l - PAD.r);
  const gh = Math.max(1, box.h - PAD.t - PAD.b);
  const fMax = Math.max(forceAt(law, xMax), 1e-6);
  const GX = React.useCallback((xx: number) => PAD.l + (xx / xMax) * gw, [PAD.l, xMax, gw]);
  const GY = React.useCallback((f: number) => PAD.t + gh - (f / fMax) * gh, [PAD.t, gh, fMax]);

  const dragHandle = usePointerDrag({
    svgRef,
    onMove: (pt) => setX(Math.min(xMax, Math.max(0, ((pt.x - PAD.l) / gw) * xMax))),
    onEnd: () => setDragging(false),
  });

  const curve = React.useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const xx = (i / 60) * xMax;
      pts.push(`${GX(xx)},${GY(forceAt(law, xx))}`);
    }
    return pts.join(' ');
  }, [law, xMax, GX, GY]);

  const predictStep = 1;
  const ghostStep = 2;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));
  React.useEffect(() => { if (step >= ghostStep) setShowGhost(true); }, [step]);

  const stretched = x > xMax * 0.05;
  const legend: LegendRow[] = [
    { id: 'curve', color: SECONDARY, name: 'F–x curve', detail: beta > 0 ? 'bent — it stiffens' : 'straight — Hooke' },
    { id: 'area', color: PRIMARY, name: 'Shaded area = the work', value: J(trueW) },
    ...(showGhost
      ? [{ id: 'ghost', color: GHOST, name: 'F(x) × x rectangle', detail: 'the F·d answer', dashed: true, value: J(naiveW) }]
      : []),
    ...(launched
      ? [{ id: 'block', color: ACCOUNT.ke.color, name: 'The block', value: `${sig(launchV)} m/s` }]
      : []),
  ];

  return (
    <SimShell>
      <SimHeader title="Spring" accentWord="Bench"
        subtitle="A force that will not hold still cannot be multiplied"
        badge={beta > 0 ? 'stiffening band' : 'ideal spring'} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="16 / 10" narrowAspect="4 / 3"
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
            <Card>
              <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
                Three answers, one right
              </div>
              <Readout label="Shaded area (the work)" value={J(trueW)} tone={PRIMARY} />
              <Readout label={`Sum of ${strips} strips`} value={J(stripSum)} tone={PRIMARY} />
              <Readout label="Simpson's rule" value={J(simpsonW)} tone={PRIMARY} />
              <Readout label="F(x) × x" value={J(naiveW)} tone={BAD} />
              <Readout label="½kx² shortcut" tone={Math.abs(hookeW - trueW) < 1e-9 ? OK : BAD}
                value={J(hookeW)} />
              <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                {beta > 0
                  ? `The band stiffens, so the graph bends and ½kx² misses ${sig(trueW - hookeW)} J. The area does not care.`
                  : 'On a straight graph, ½kx² IS the area of the triangle — and F·x is exactly twice it, at every k and every x.'}
              </p>
            </Card>

            <Legend title="On the board" rows={legend} />

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
                Cut it into strips
              </div>
              <SimSlider label="Strips" value={strips} min={1} max={40} step={1}
                onChange={setStrips} accent={PRIMARY} />
              <p className="mt-1 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                Each strip is a tiny force × distance where the force really is constant.
                &ldquo;Work is force times distance&rdquo; was never wrong — it was being used at
                the wrong scale.
              </p>
            </Card>

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>Your setup</div>
              <SimSlider label="Stiffness k" value={k} min={20} max={800} step={10} unit="N/m"
                onChange={setK} accent={SECONDARY} />
              <SimSlider label="Stiffening β" value={beta} min={0} max={20000} step={250} unit="N/m³"
                onChange={setBeta} accent={ACCOUNT.heat.color} />
              <SimSlider label="Block mass" value={mass} min={0.1} max={5} step={0.1} unit="kg"
                onChange={setMass} accent={ACCOUNT.ke.color} />
              <SimSlider label="Block speed" value={v0} min={0.5} max={8} step={0.5} unit="m/s"
                onChange={setV0} accent={ACCOUNT.ke.color} />
            </Card>

            {launched && (
              <Card>
                <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
                  Where the block&rsquo;s energy went
                </div>
                <Stack
                  values={{ ke: 0.5 * mass * launchV * launchV, pe: springPE(law, launchX) }}
                  scaleTotal={0.5 * mass * v0 * v0}
                  height={140}
                />
                <p className="mt-1.5 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                  It stops where the shaded area equals its kinetic energy — {sig(stopX * 100)} cm in.
                </p>
              </Card>
            )}

            <MisconceptionCard code={arch.targets} when={showGhost && stretched} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={() => setShowGhost((v) => !v)} active={showGhost}
              disabled={step < ghostStep}>
              {showGhost ? 'Hide' : 'Show'} the F·x rectangle
            </ActionButton>
            <ActionButton onClick={() => { setT(0); setLaunched(true); }} active={launched}
              disabled={step < ghostStep}>
              Launch a block into it
            </ActionButton>
            <ActionButton onClick={() => { setLaunched(false); setT(0); }} disabled={!launched}>
              Take the block away
            </ActionButton>
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* axes — drawn, never labelled on canvas */}
            <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={PAD.t + gh}
              stroke={accentTint(TEXT.primary, 0.3)} strokeWidth={1.5} />
            <line x1={PAD.l} y1={PAD.t + gh} x2={PAD.l + gw} y2={PAD.t + gh}
              stroke={accentTint(TEXT.primary, 0.3)} strokeWidth={1.5} />

            {/* the ghost rectangle: F(x) held constant across the whole stretch */}
            {showGhost && stretched && (
              <rect x={GX(0)} y={GY(forceAt(law, x))} width={GX(x) - GX(0)}
                height={GY(0) - GY(forceAt(law, x))}
                fill="none" stroke={GHOST} strokeWidth={2} strokeDasharray="6 5" />
            )}

            {/* the strips */}
            {stripList.map((s) => (
              <rect key={s.a} x={GX(s.a)} y={GY(s.f)} width={Math.max(0.5, GX(s.b) - GX(s.a))}
                height={Math.max(0, GY(0) - GY(s.f))}
                fill={accentTint(PRIMARY, 0.28)} stroke={accentTint(PRIMARY, 0.5)} strokeWidth={0.75} />
            ))}

            {/* the curve */}
            <polyline points={curve} fill="none" stroke={SECONDARY} strokeWidth={3} strokeLinecap="round" />

            {/* the spring itself, above the graph — the physical thing */}
            <SpringGlyph x0={GX(0)} x1={GX(x)} y={PAD.t * 0.7} colour={PRIMARY} />

            {/* the launched block, riding in */}
            {launched && (
              <rect x={GX(launchX) + 4} y={PAD.t * 0.7 - 9} width={18} height={18} rx={3}
                fill={accentTint(ACCOUNT.ke.color, 0.4)} stroke={ACCOUNT.ke.color} strokeWidth={2} />
            )}

            {/* the stretch handle */}
            <g>
              <circle cx={GX(x)} cy={GY(forceAt(law, x))} r={26} fill="transparent"
                style={{ cursor: 'ew-resize', touchAction: 'none' }}
                onPointerDown={(e) => { setDragging(true); dragHandle(e); }} />
              <line x1={GX(x)} y1={GY(0)} x2={GX(x)} y2={GY(forceAt(law, x))}
                stroke={accentTint(PRIMARY, 0.6)} strokeWidth={1.5} strokeDasharray="4 4"
                pointerEvents="none" />
              <circle cx={GX(x)} cy={GY(forceAt(law, x))} r={dragging ? 13 : 9}
                fill={accentTint(PRIMARY, dragging ? 0.55 : 0.3)} stroke={PRIMARY}
                strokeWidth={2.5} pointerEvents="none" />
            </g>
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Whenever a force changes as the thing moves — a spring, gravity far from a
        planet, a magnet — stop multiplying and start finding the area. That habit is
        worth more than any of the three formulas above it.
      </ExpertTip>
    </SimShell>
  );
}

/** A zig-zag spring between two x positions. Pure geometry, no text. */
function SpringGlyph({ x0, x1, y, colour }: { x0: number; x1: number; y: number; colour: string }) {
  const coils = 12;
  const span = Math.max(6, x1 - x0);
  const pts: string[] = [`${x0},${y}`];
  for (let i = 0; i < coils; i++) {
    const f = (i + 0.5) / coils;
    pts.push(`${x0 + f * span},${y + (i % 2 ? 7 : -7)}`);
  }
  pts.push(`${x0 + span},${y}`);
  return (
    <>
      <line x1={x0 - 8} y1={y - 12} x2={x0 - 8} y2={y + 12} stroke={accentTint(colour, 0.6)} strokeWidth={3} />
      <polyline points={pts.join(' ')} fill="none" stroke={colour} strokeWidth={2} strokeLinejoin="round" />
    </>
  );
}
