'use client';

/*
 * rotation/TorqueBench.tsx — force × PERPENDICULAR distance.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two things are draggable and both matter: the masses along the beam, and the
 * PIVOT itself. A bench where only the masses move can teach "3 × 0.4 = 2 × 0.6"
 * and nothing else; moving the pivot is what makes a student discover that the
 * balance point is a weighted mean, and it is the gesture that connects a
 * see-saw to a centre of mass.
 *
 * ── THE ANGLED PULL IS NOT AN EXTRA ──────────────────────────────────────────
 * With only hanging masses, the perpendicular distance IS the distance along the
 * beam, so the word "perpendicular" can be dropped without ever being punished.
 * The angled pull is the only configuration where the missing word costs
 * anything — swing it to 30° and the torque halves while the force and the
 * distance are untouched. The dashed line from the pivot to the force's line of
 * action is the distance in the formula, drawn.
 *
 * ⚠ THE LEDGER PRINTS SIGNED TERMS, NOT A "BALANCED" LIGHT. A light tells a
 * student nothing; +11.76 and −11.76 adding to zero is the physics itself, and
 * it is what they will have to write in an exam.
 *
 * ZERO <text> ELEMENTS ON THE CANVAS.
 */

import * as React from 'react';
import { SimShell, SimHeader, StepBar, SimSlider, ExpertTip, TYPE } from '../../simulations/_shared';
import type { Phase2Archetype, TorqueSpec } from '../energy/kit/phase2';
import { PRIMARY, SECONDARY, TEXT, ACCOUNT, GHOST, accentTint, sig } from '../energy/kit/theme';
import {
  Card, Legend, PredictGate, MisconceptionCard, GuidePanel, ActionButton, Readout, Pill,
  TermLedger, usePointerDrag,
} from '../energy/kit/ui';
import { Board, BenchFrame, useStageBox } from '../energy/kit/stage';
import type { LegendRow } from '../energy/kit/ui';
import { torqueTerms, netTorque, isBalanced, balancePivotX, beamWeightLoad, forceOf } from './lib/torque';
import type { Load } from './lib/torque';

const DEG = Math.PI / 180;

export default function TorqueBench({ arch, spec }: { arch: Phase2Archetype; spec: TorqueSpec }) {
  const [loads, setLoads] = React.useState<Load[]>(spec.loads);
  const [pivotX, setPivotX] = React.useState(spec.pivotX);
  const [beamMass, setBeamMass] = React.useState(spec.beamMass);
  const [grab, setGrab] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string | null>(null);

  const steps = arch.defaultSteps;
  const [step, setStep] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [moved, setMoved] = React.useState(false);

  const L = spec.beamLength;
  const all = React.useMemo(
    () => (beamMass > 0 ? [...loads, beamWeightLoad(beamMass, L)] : loads),
    [loads, beamMass, L],
  );
  const terms = React.useMemo(() => torqueTerms(all, pivotX, spec.g), [all, pivotX, spec.g]);
  const net = netTorque(all, pivotX, spec.g);
  const balanced = isBalanced(all, pivotX, spec.g, 0.05);
  const idealPivot = balancePivotX(all, spec.g);

  // Tilt is a READOUT of the imbalance, not a physical simulation: this is a
  // statics bench, and animating a real rotation would invite the question
  // "what is its moment of inertia?", which is a different rung.
  const tiltDeg = Math.max(-14, Math.min(14, -net * 0.25));

  const box = useStageBox();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const PAD = 44;
  const gw = Math.max(1, box.w - PAD * 2);
  const midY = box.h * 0.44;
  const X = React.useCallback((x: number) => PAD + (x / L) * gw, [PAD, L, gw]);
  const beamPt = React.useCallback((x: number) => {
    const dx = (x - pivotX) / L * gw;
    const a = tiltDeg * DEG;
    return { x: X(pivotX) + dx * Math.cos(a), y: midY + dx * Math.sin(a) };
  }, [pivotX, L, gw, tiltDeg, X, midY]);

  const fromScreen = React.useCallback((px: number) => {
    const raw = ((px - PAD) / gw) * L;
    return Math.min(L, Math.max(0, raw));
  }, [PAD, gw, L]);

  const dragLoad = usePointerDrag({
    svgRef,
    onMove: (pt) => {
      if (!grab) return;
      setMoved(true);
      if (grab === '@pivot') { setPivotX(fromScreen(pt.x)); return; }
      setLoads((prev) => prev.map((l) => (l.id === grab ? { ...l, x: fromScreen(pt.x) } : l)));
    },
    onEnd: () => setGrab(null),
  });

  const predictStep = 1;
  const advance = () => setStep((v) => Math.min(v + 1, steps.length));

  const legend: LegendRow[] = [
    ...all.map((l) => {
      const f = forceOf(l, spec.g);
      const term = terms.find((t) => t.id === l.id);
      return {
        id: l.id,
        color: l.id === 'beam' ? GHOST : typeof l.mass === 'number' ? SECONDARY : ACCOUNT.heat.color,
        name: l.label ?? l.id,
        detail: typeof l.mass === 'number'
          ? `${sig(l.mass)} kg · ${sig(Math.abs(l.x - pivotX))} m from the pivot`
          : `${sig(f.mag)} N at ${sig(f.angleDeg)}° · ⟂ distance ${sig(term?.perpDistance ?? 0)} m`,
        value: term ? `${term.torque >= 0 ? '+' : '−'}${sig(Math.abs(term.torque))} N m` : undefined,
      };
    }),
    { id: 'pivot', color: PRIMARY, name: 'Pivot', detail: `${sig(pivotX)} m from the left end` },
  ];

  const angled = loads.find((l) => typeof l.forceN === 'number');

  return (
    <SimShell>
      <SimHeader title="Torque &" accentWord="Balance"
        subtitle="Force × perpendicular distance · signed terms that add to zero"
        badge={balanced ? 'balanced' : 'tipping'} />
      <StepBar steps={steps.map((_, i) => ({ id: String(i), label: `Step ${i + 1}` }))}
        currentId={String(Math.min(step, steps.length - 1))} onGo={(id) => setStep(Number(id))} />

      <BenchFrame box={box} aspect="16 / 8" narrowAspect="4 / 3" minHeight={220}
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
            <TermLedger
              title="Torques about the pivot"
              unit=" N m"
              sumLabel="Net torque"
              tol={0.05}
              terms={terms.map((t) => ({
                id: t.id,
                label: all.find((l) => l.id === t.id)?.label ?? t.id,
                detail: t.hanging
                  ? `${sig(t.force)} N × ${sig(Math.abs(t.lever))} m`
                  : `${sig(t.force)} N × ${sig(Math.abs(t.lever))} m × sin ${sig(t.angleDeg)}°`,
                value: t.torque,
                color: t.id === 'beam' ? GHOST : t.hanging ? SECONDARY : ACCOUNT.heat.color,
              }))}
              note={balanced
                ? 'Zero. Not because the masses match — because the products do.'
                : `Off by ${sig(Math.abs(net))} N m. Positive turns it anticlockwise.`}
            />

            <Legend title="On the beam" rows={legend} selectedId={selected} onSelect={setSelected} />

            {angled && (
              <Card>
                <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
                  The word that gets dropped
                </div>
                <Readout label="Force" value={`${sig(angled.forceN ?? 0)} N`} tone={ACCOUNT.heat.color} />
                <Readout label="Distance along the beam"
                  value={`${sig(Math.abs((angled.x ?? 0) - pivotX))} m`} />
                <Readout label="PERPENDICULAR distance" tone={ACCOUNT.heat.color}
                  value={`${sig(terms.find((t) => t.id === angled.id)?.perpDistance ?? 0)} m`} />
                <Readout label="Torque"
                  value={`${sig(Math.abs(terms.find((t) => t.id === angled.id)?.torque ?? 0))} N m`} />
                <SimSlider label="Pull direction" value={angled.angleDeg ?? 90} min={0} max={180} step={1}
                  unit="°" accent={ACCOUNT.heat.color}
                  onChange={(v) => { setMoved(true); setLoads((prev) => prev.map((l) => (l.id === angled.id ? { ...l, angleDeg: v } : l))); }} />
                <SimSlider label="Pull size" value={angled.forceN ?? 20} min={1} max={80} step={1}
                  unit="N" accent={ACCOUNT.heat.color}
                  onChange={(v) => { setMoved(true); setLoads((prev) => prev.map((l) => (l.id === angled.id ? { ...l, forceN: v } : l))); }} />
                <p className="mt-1 text-[11.5px] leading-snug" style={{ color: TEXT.ghost }}>
                  Swing it to 0° — straight along the beam. Full force, full distance,
                  zero turning effect.
                </p>
              </Card>
            )}

            <Card>
              <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>The setup</div>
              <SimSlider label="Pivot" value={pivotX} min={0} max={L} step={0.01} unit="m"
                onChange={(v) => { setMoved(true); setPivotX(v); }} accent={PRIMARY} />
              {loads.filter((l) => typeof l.mass === 'number').map((l) => (
                <React.Fragment key={l.id}>
                  <SimSlider label={`${l.label ?? l.id} mass`} value={l.mass ?? 1}
                    min={0.2} max={20} step={0.1} unit="kg" accent={SECONDARY}
                    onChange={(v) => { setMoved(true); setLoads((prev) => prev.map((q) => (q.id === l.id ? { ...q, mass: v } : q))); }} />
                </React.Fragment>
              ))}
              <SimSlider label="Beam's own mass" value={beamMass} min={0} max={10} step={0.1} unit="kg"
                onChange={(v) => { setMoved(true); setBeamMass(v); }} accent={GHOST} />
              {idealPivot !== null && (
                <ActionButton full onClick={() => { setMoved(true); setPivotX(Math.min(L, Math.max(0, idealPivot))); }}>
                  Move the pivot to the balance point ({sig(idealPivot)} m)
                </ActionButton>
              )}
            </Card>

            <MisconceptionCard code={arch.targets} when={moved && choice !== null} />
          </>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <Pill tone={balanced ? 'ok' : 'bad'}>
              {balanced ? 'Στ = 0' : `Στ = ${net >= 0 ? '+' : '−'}${sig(Math.abs(net))} N m`}
            </Pill>
            <span className="text-[11.5px]" style={{ color: TEXT.ghost }}>
              Drag the weights along the beam, or drag the pivot itself.
            </span>
          </div>
        }
      >
        {box.ready && (
          <Board ref={svgRef} w={box.w} h={box.h}>
            {/* the stand */}
            <polygon
              points={`${X(pivotX)},${midY} ${X(pivotX) - 16},${midY + 42} ${X(pivotX) + 16},${midY + 42}`}
              fill={accentTint(PRIMARY, 0.25)} stroke={PRIMARY} strokeWidth={2} />
            {/* the beam */}
            <line x1={beamPt(0).x} y1={beamPt(0).y} x2={beamPt(L).x} y2={beamPt(L).y}
              stroke={accentTint(TEXT.primary, 0.75)} strokeWidth={7} strokeLinecap="round" />
            {/* the loads */}
            {all.map((l) => {
              const p = beamPt(l.x);
              const f = forceOf(l, spec.g);
              const term = terms.find((tt) => tt.id === l.id);
              const hanging = typeof l.mass === 'number';
              const col = l.id === 'beam' ? GHOST : hanging ? SECONDARY : ACCOUNT.heat.color;
              // Arrow length is linear in the force, normalised against the
              // biggest one on the beam — a 2× force draws exactly 2× longer.
              const ref = Math.max(...all.map((q) => forceOf(q, spec.g).mag), 1e-6);
              const px = (f.mag / ref) * Math.min(box.w, box.h) * 0.2;
              const a = f.angleDeg * DEG;
              const on = selected === l.id;
              return (
                <g key={l.id}>
                  {/*
                    THE PERPENDICULAR DISTANCE, DRAWN — the whole lesson, as a
                    line you can measure against the beam.

                    Dropped properly: with the force's line of action through p
                    in direction û = (cos a, −sin a) (screen y is flipped), the
                    foot of the perpendicular from the pivot O is
                        foot = p + ((O − p)·û) û
                    and |O − foot| is the r⊥ in τ = F·r⊥. An earlier version
                    scaled the lever by sin a twice and drew a line that was only
                    right at 90°, which is precisely the angle where the lesson
                    does not apply.
                  */}
                  {!hanging && term && term.perpDistance > 1e-6 && (() => {
                    const ux = Math.cos(a);
                    const uy = -Math.sin(a);
                    const ox = X(pivotX);
                    const oy = midY;
                    const tt = (ox - p.x) * ux + (oy - p.y) * uy;
                    return (
                      <>
                        <line x1={p.x - ux * 400} y1={p.y - uy * 400}
                          x2={p.x + ux * 400} y2={p.y + uy * 400}
                          stroke={accentTint(ACCOUNT.heat.color, 0.28)} strokeWidth={1} />
                        <line x1={ox} y1={oy} x2={p.x + ux * tt} y2={p.y + uy * tt}
                          stroke={ACCOUNT.heat.color} strokeWidth={2}
                          strokeDasharray="5 4" opacity={0.9} />
                      </>
                    );
                  })()}
                  <line x1={p.x} y1={p.y} x2={p.x + Math.cos(a) * px} y2={p.y - Math.sin(a) * px}
                    stroke={col} strokeWidth={3} strokeLinecap="round" />
                  {hanging && (
                    <rect x={p.x - 9} y={p.y + Math.max(0, -Math.sin(a)) * px - 9} width={18} height={18} rx={3}
                      fill={accentTint(col, 0.4)} stroke={col} strokeWidth={2} />
                  )}
                  {on && <circle cx={p.x} cy={p.y} r={16} fill="none" stroke={col} strokeWidth={1.5} opacity={0.7} />}
                  {l.id !== 'beam' && (
                    <circle cx={p.x} cy={p.y} r={24} fill="transparent"
                      style={{ cursor: 'ew-resize', touchAction: 'none' }}
                      onPointerDown={(e) => { setGrab(l.id); setSelected(l.id); dragLoad(e); }} />
                  )}
                  <circle cx={p.x} cy={p.y} r={grab === l.id ? 8 : 5.5}
                    fill={accentTint(col, 0.75)} stroke={col} strokeWidth={2} pointerEvents="none" />
                </g>
              );
            })}
            {/* the pivot handle */}
            <g>
              <circle cx={X(pivotX)} cy={midY} r={26} fill="transparent"
                style={{ cursor: 'ew-resize', touchAction: 'none' }}
                onPointerDown={(e) => { setGrab('@pivot'); dragLoad(e); }} />
              <circle cx={X(pivotX)} cy={midY} r={grab === '@pivot' ? 11 : 8}
                fill={accentTint(PRIMARY, 0.7)} stroke={PRIMARY} strokeWidth={2.5} pointerEvents="none" />
            </g>
          </Board>
        )}
      </BenchFrame>

      <ExpertTip>
        Pick the pivot before you write anything — and pick it through the force you do
        not know, so that force has zero lever arm and drops out of the equation
        entirely. That single choice is most of what makes rotational statics easy.
      </ExpertTip>
    </SimShell>
  );
}
