'use client';

/*
 * circuit-bench/ac/PhasorBench.tsx — THE AC FLAGSHIP.
 * ─────────────────────────────────────────────────────────────────────────────
 * The claim this component has to earn: a phasor diagram and a waveform are the
 * SAME INFORMATION. Not analogous, not "two ways of looking at it" — the same
 * numbers, drawn twice.
 *
 * ── THE ONE PIECE OF GEOMETRY THAT MAKES THE CLAIM ──────────────────────────
 * The phasor circle and the wave share ONE horizontal axis and ONE vertical
 * scale, side by side, with the circle's centre level with the wave's zero line.
 * A phasor of length V₀ standing at angle ωt has vertical height V₀ sin(ωt),
 * which IS v(t) — so a HORIZONTAL dashed line from the arrow's tip lands exactly
 * on the point being plotted. The line is the proof, and it is drawn.
 *
 * `verify-emi-ac.mjs` holds `phasorSet(...).source.y` equal to
 * `instantaneous(...).v` to 1e-12 across 400 instants, in four circuits, at four
 * frequencies. If that identity ever broke, this drawing would be a lie, and the
 * check exists because nothing on screen would look wrong.
 *
 * ── VOLTAGE AND CURRENT ARE DRAWN TO THEIR OWN SCALES, AND IT SAYS SO ───────
 * 100 V beside 0.78 A cannot share a length scale — the current would be
 * invisible. So each is normalised to its own peak, both reach the same radius,
 * and the LEGEND says so out loud. That is the universal convention for a
 * mixed-unit phasor diagram, and hiding it would let a student read a length
 * comparison that is not there.
 *
 * ── NOTHING TURNS UNTIL THE STUDENT TURNS IT ────────────────────────────────
 * The primary gesture is dragging the phasor round (design laws #1 and #5). A
 * ▶ Run toggle exists and starts OFF; when on, ωt advances from a real `dt` at a
 * deliberately slowed rate so 50 Hz is watchable. The drag never consults the
 * animation clock — it reads pointer positions and their timestamps only.
 *
 * ZERO `<text>` on the canvas.
 */

import * as React from 'react';
import type { CircuitBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
  useAnimationFrame,
} from '../../simulations/_shared';
import { isStacked, useStageWidth } from '../useStageWidth';
import { fmtAmp, fmtOhm, fmtVolt, fmtWatt, sig } from '../lib/format';
import { issueFor } from '../lib/misconceptions';
import { AC_ARCHETYPES } from '../archetypes.ac';
import {
  acState, averagePowerNumeric, instantaneous, phasorSet, phasorVoltageSum,
  qualityFactor, resonanceFrequency, rmsNumeric,
} from './lib/phasor';
import { acSetup, presentIn } from './lib/setup';
import {
  A_I, A_V, AcCard, ActionButton, Arrow, Choice, GuidedPanel, Legend, ModelNote,
  NumericPanel, PlotKey, PredictGate, Readout, Slider, Toggle,
  type LegendRow, type ReadoutRow,
} from './ui';

/** Cycles per second of real time when ▶ Run is on. Slow enough to follow, and
 *  stated rather than tuned by feel: at 0.35 a 50 Hz cycle takes 2.9 s. */
const RUN_CYCLES_PER_S = 0.35;

type Bag = Record<string, number | string | boolean>;

export default function PhasorBench({ block, archetypeId }:
  { block: CircuitBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = AC_ARCHETYPES[archetypeId] ?? AC_ARCHETYPES['ac-resistor-only'];

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return acSetup('phasor', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, paramsKey, overrides]);

  const script = React.useMemo(() => {
    const a = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return a?.length ? a : (archetype.defaultSteps ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, stepsKey]);
  const predict = React.useMemo(
    () => JSON.parse(predictKey) as CircuitBenchBlock['predict'], [predictKey],
  );

  const c = setup.circuit;
  const s = acState(c);
  const has = presentIn(setup.elements);
  const period = c.f > 0 ? 1 / c.f : 1;

  /** The phase of the SOURCE phasor, in radians. Unwrapped, so winding through
   *  several turns keeps the traces coherent. */
  const [wt, setWt] = React.useState(0.9);
  const [running, setRunning] = React.useState(false);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [showPower, setShowPower] = React.useState(false);
  const [showElements, setShowElements] = React.useState(false);
  const [turned, setTurned] = React.useState(false);
  const [sawWholeCycle, setSawWholeCycle] = React.useState(false);

  const t = c.f > 0 ? wt / (2 * Math.PI * c.f) : 0;
  const inst = instantaneous(s, c.V0, t);
  const ps = phasorSet(s, c.V0, t);

  React.useEffect(() => { if (Math.abs(wt) > 2 * Math.PI) setSawWholeCycle(true); }, [wt]);

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isStacked(stageW);
  const boardW = Math.max(220, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = Math.max(230, Math.min(block.height ?? 400, Math.round(boardW * 0.52)));

  // Left half: the phasor circle. Right half: the wave. ONE vertical scale, and
  // the circle's centre level with the wave's zero — that is what makes a
  // horizontal projection line meaningful.
  const R = Math.min(boardH * 0.38, boardW * 0.20);
  const cx = 14 + R;
  const cy = boardH / 2;
  const waveX0 = cx + R + 26;
  const waveX1 = boardW - 12;

  const vScale = R / Math.max(c.V0, 1e-12);
  const iScale = R / Math.max(s.I0, 1e-12);

  // ── Drag the phasor ───────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef<{ last: number } | null>(null);

  const angleAt = (clientX: number, clientY: number): number => {
    const el = svgRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    const py = ((clientY - r.top) / Math.max(r.height, 1)) * boardH;
    return Math.atan2(-(py - cy), px - cx);   // screen y is down; negate for physics
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { last: angleAt(e.clientX, e.clientY) };
    setRunning(false);
    setTurned(true);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const a = angleAt(e.clientX, e.clientY);
    // Unwrap across the ±π seam, or the trace jumps a whole turn each time the
    // handle passes the left of the circle.
    let delta = a - d.last;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    d.last = a;
    setWt((w) => w + delta);
  };
  const onUp = () => { dragRef.current = null; };

  useAnimationFrame((dt) => {
    if (!running) return;
    setWt((w) => w + 2 * Math.PI * RUN_CYCLES_PER_S * dt);
    setTurned(true);
  }, { target: wrapRef, enabled: running });

  // ── What is revealed when ─────────────────────────────────────────────────
  const revealed = guided ? stage : script.length;
  const showWave = revealed >= 1 || !guided;
  const showCurrent = revealed >= 1 || !guided;
  const powerVisible = showPower || revealed >= 2 || !guided;
  const showNumbers = revealed >= 2 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = cardCode ? issueFor(cardCode) : null;
  const evidenceMet =
    cardCode === 'phasor_is_a_different_quantity' ? turned
      : cardCode === 'reactive_element_dissipates_power' ? (powerVisible && sawWholeCycle)
        : cardCode === 'rms_is_the_cycle_average' ? showNumbers
          : cardCode === 'impedances_add_arithmetically' ? showElements
            : showNumbers;

  // ── Traces: two whole cycles centred on the cursor ────────────────────────
  const span = 2 * period;
  const t0 = t - span / 2;
  const trace = React.useMemo(() => {
    const v: { x: number; y: number }[] = [];
    const i: { x: number; y: number }[] = [];
    const p: { x: number; y: number }[] = [];
    const N = 260;
    for (let k = 0; k <= N; k++) {
      const tt = t0 + (span * k) / N;
      const q = instantaneous(s, c.V0, tt);
      v.push({ x: tt, y: q.v });
      i.push({ x: tt, y: q.i });
      p.push({ x: tt, y: q.p });
    }
    return { v, i, p };
  }, [s, c.V0, t0, span]);

  const pPeak = Math.max(1e-12, c.V0 * s.I0);
  const wx = (tt: number) => waveX0 + ((tt - t0) / Math.max(span, 1e-12)) * (waveX1 - waveX0);
  const wyV = (val: number) => cy - val * vScale;
  const wyI = (val: number) => cy - val * iScale;
  const wyP = (val: number) => cy - (val / pPeak) * R;
  const pathOf = (pts: { x: number; y: number }[], f: (y: number) => number) =>
    pts.map((q, k) => `${k ? 'L' : 'M'}${wx(q.x).toFixed(1)},${f(q.y).toFixed(1)}`).join(' ');

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: ReadoutRow[] = [];
  if (showNumbers) {
    if (has.L) rows.push({ label: 'X_L = 2πfL', value: fmtOhm(s.XL), colour: A_V });
    if (has.C) rows.push({ label: 'X_C = 1/(2πfC)', value: s.blockedByCapacitor ? 'infinite' : fmtOhm(s.XC), colour: A_V });
    if (has.L && has.C) rows.push({ label: 'X_L − X_C', value: fmtOhm(s.X), colour: A_V });
    rows.push({ label: 'Impedance Z', value: s.blockedByCapacitor ? 'infinite' : fmtOhm(s.Z), colour: A_V, strong: true });
    rows.push({ label: 'Phase (voltage ahead)', value: `${sig(s.phaseDeg, 4)}°`, colour: A_I, strong: true });
    rows.push({ label: 'Power factor cos φ', value: sig(s.powerFactor, 4), colour: A_I });
    rows.push({ label: 'V rms', value: fmtVolt(s.Vrms), colour: A_V });
    rows.push({ label: 'I rms', value: fmtAmp(s.Irms), colour: A_I });
  }
  if (powerVisible && showNumbers) {
    rows.push({ label: 'Average power', value: fmtWatt(s.avgPower), colour: TEXT.primary, strong: true });
    rows.push({ label: 'Volts × amps (apparent)', value: `${sig(s.apparentPower, 4)} V·A`, colour: TEXT.secondary });
    rows.push({
      label: 'Average of v·i, integrated',
      value: fmtWatt(averagePowerNumeric(s, c.V0)),
      colour: TEXT.primary,
    });
  }
  if (showElements && showNumbers) {
    if (has.R) rows.push({ label: 'V across R (peak)', value: fmtVolt(s.VR), colour: A_V });
    if (has.L) rows.push({ label: 'V across L (peak)', value: fmtVolt(s.VL), colour: A_V });
    if (has.C) rows.push({ label: 'V across C (peak)', value: fmtVolt(s.VC), colour: A_V });
    rows.push({ label: 'Added up as numbers', value: fmtVolt(s.VR + s.VL + s.VC), colour: TEXT.secondary });
    rows.push({ label: 'Added as PHASORS', value: fmtVolt(phasorVoltageSum(s)), colour: A_V, strong: true });
    rows.push({ label: 'The supply', value: fmtVolt(c.V0), colour: A_V });
  }
  if (archetypeId === 'rms-not-average' && showNumbers) {
    rows.push({ label: 'Peak voltage', value: fmtVolt(c.V0), colour: A_V });
    rows.push({ label: 'Cycle average', value: '0 V', colour: TEXT.secondary });
    rows.push({ label: 'Root of the mean square', value: fmtVolt(rmsNumeric(c.V0, s.omega)), colour: A_V, strong: true });
  }
  if (has.L && has.C && showNumbers) {
    rows.push({ label: 'Resonant frequency', value: `${sig(resonanceFrequency(c.L, c.C), 4)} Hz`, colour: A_V });
    if (c.R > 0) rows.push({ label: 'Q factor', value: sig(qualityFactor(c.R, c.L, c.C), 3), colour: A_V });
  }

  const legend: LegendRow[] = [
    { colour: A_V, label: 'voltage — phasor and wave' },
    { colour: A_I, label: 'current — phasor and wave' },
    { colour: TEXT.ghost, label: 'the projection: the arrow\'s height IS the value on the wave', dashed: true },
  ];
  if (powerVisible) legend.push({ colour: TEXT.primary, label: 'instantaneous power v × i' });
  if (showElements) legend.push({ colour: A_V, dashed: true, label: 'V_R, V_L and V_C, head to tail' });

  const lagLead = s.phaseDeg > 1 ? 'current lags' : s.phaseDeg < -1 ? 'current leads' : 'in phase';

  return (
    <SimShell>
      <SimHeader title="AC" accentWord="Bench" subtitle={archetype.title}
        badge={`${sig(c.f, 3)} Hz · ${lagLead}`} accent={A_V} />

      <div ref={wrapRef} style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : 'minmax(0,3fr) minmax(0,2fr)',
        gap: narrow ? 18 : 22,
      }}>
        <div className="flex flex-col gap-3">
          {narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s2) => Math.min(script.length - 1, s2 + 1))} />
          )}

          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A_V, 0.2)}`,
              height: boardH, touchAction: 'none',
            }}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${boardW} ${boardH}`}
              onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} role="img"
              aria-label="A rotating phasor diagram beside the waveform it produces. Values are listed beside the diagram."
              style={{ display: 'block', touchAction: 'none' }}>

              {/* The shared zero line — one axis for the circle and the wave. */}
              <line x1={12} y1={cy} x2={waveX1} y2={cy} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
              <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} />

              {/* The element voltage phasors, head to tail from the origin. */}
              {showElements && (
                <g>
                  <Arrow colour={A_V} width={2} dashed
                    x1={cx} y1={cy}
                    x2={cx + ps.vR.x * vScale} y2={cy - ps.vR.y * vScale} />
                  <Arrow colour={A_V} width={2} dashed
                    x1={cx + ps.vR.x * vScale} y1={cy - ps.vR.y * vScale}
                    x2={cx + (ps.vR.x + ps.vL.x) * vScale} y2={cy - (ps.vR.y + ps.vL.y) * vScale} />
                  <Arrow colour={A_V} width={2} dashed
                    x1={cx + (ps.vR.x + ps.vL.x) * vScale} y1={cy - (ps.vR.y + ps.vL.y) * vScale}
                    x2={cx + (ps.vR.x + ps.vL.x + ps.vC.x) * vScale}
                    y2={cy - (ps.vR.y + ps.vL.y + ps.vC.y) * vScale} />
                </g>
              )}

              {/* The current phasor, drawn to its OWN scale (see the header). */}
              {showCurrent && s.I0 > 0 && (
                <Arrow colour={A_I} width={3}
                  x1={cx} y1={cy}
                  x2={cx + ps.current.x * iScale} y2={cy - ps.current.y * iScale} />
              )}

              {/* THE PROJECTION LINES — the argument of the whole component. A
                  horizontal line from the arrow tip to the point on the wave. */}
              {showWave && (
                <g strokeDasharray="4 4">
                  <line x1={cx + ps.source.x * vScale} y1={wyV(inst.v)} x2={wx(t)} y2={wyV(inst.v)}
                    stroke={accentTint(A_V, 0.55)} strokeWidth={1.3} />
                  {showCurrent && s.I0 > 0 && (
                    <line x1={cx + ps.current.x * iScale} y1={wyI(inst.i)} x2={wx(t)} y2={wyI(inst.i)}
                      stroke={accentTint(A_I, 0.55)} strokeWidth={1.3} />
                  )}
                </g>
              )}

              {/* The waves. */}
              {showWave && (
                <>
                  {powerVisible && (
                    <path d={pathOf(trace.p, wyP)} fill="none" stroke={TEXT.primary} strokeWidth={1.6} opacity={0.85} />
                  )}
                  <path d={pathOf(trace.v, wyV)} fill="none" stroke={A_V} strokeWidth={2.4} />
                  {showCurrent && s.I0 > 0 && (
                    <path d={pathOf(trace.i, wyI)} fill="none" stroke={A_I} strokeWidth={2.4} />
                  )}
                  <line x1={wx(t)} y1={cy - R} x2={wx(t)} y2={cy + R}
                    stroke="rgba(255,255,255,0.26)" strokeWidth={1.2} />
                  <circle cx={wx(t)} cy={wyV(inst.v)} r={4.4} fill={A_V} />
                  {showCurrent && s.I0 > 0 && <circle cx={wx(t)} cy={wyI(inst.i)} r={4.4} fill={A_I} />}
                </>
              )}

              {/* The source phasor and its grab handle, drawn last so it is on top. */}
              <g onPointerDown={onDown} style={{ cursor: 'grab' }}>
                <circle cx={cx + ps.source.x * vScale} cy={cy - ps.source.y * vScale} r={26} fill="transparent" />
                <Arrow colour={A_V} width={3.4}
                  x1={cx} y1={cy} x2={cx + ps.source.x * vScale} y2={cy - ps.source.y * vScale} />
                <circle cx={cx + ps.source.x * vScale} cy={cy - ps.source.y * vScale} r={7}
                  fill={A_V} stroke="#050614" strokeWidth={2} />
              </g>
            </svg>
          </div>

          <Legend rows={legend} />
          <PlotKey items={[
            { colour: A_V, text: 'voltage, to its own peak' },
            { colour: A_I, text: 'current, to its own peak' },
            ...(powerVisible ? [{ colour: TEXT.primary, text: 'power v × i' }] : []),
          ]} />

          <div className="flex flex-wrap items-center gap-3">
            <ActionButton accent={A_V} onClick={() => setRunning((r) => !r)}>
              {running ? '❙❙ Pause' : '▶ Run slowly'}
            </ActionButton>
            <ActionButton accent={A_V} onClick={() => { setRunning(false); setWt(0.9); }}>Reset</ActionButton>
            <Toggle on={powerVisible} label="Power trace" accent={A_I}
              onClick={() => setShowPower((p) => !p)} />
            {(has.L || has.C) && (
              <Toggle on={showElements} label="Element voltages" accent={A_V}
                onClick={() => setShowElements((p) => !p)} />
            )}
          </div>
          <ModelNote>
            {'Grab the arrow and wind it round — the dot on the wave follows exactly, because the arrow\'s '
              + 'height IS the value being plotted. Voltage and current are each drawn to their own peak so '
              + 'both fit on one picture; their LENGTHS are not comparable, their ANGLE is.'}
          </ModelNote>
        </div>

        <div className="flex flex-col gap-4">
          {!narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s2) => Math.min(script.length - 1, s2 + 1))} />
          )}
          {needsPredict && (
            <p className="text-xs" style={{ color: TEXT.ghost }}>Commit a prediction below first.</p>
          )}
          {predict && stage >= 1 && (
            <PredictGate prompt={predict.prompt} options={predict.options}
              answerIndex={predict.answer_index} reveal={predict.reveal}
              choice={choice} onChoose={setChoice} />
          )}

          {rows.length > 0 && (
            <Readout rows={rows} tone={Math.abs(s.phaseDeg) > 80 ? 'current' : 'plain'}
              footnote={powerVisible
                ? 'The last row integrates v·i over a whole cycle. It agrees with V_rms I_rms cos φ above because they are the same quantity — one measured, one predicted.'
                : undefined} />
          )}

          {showNumbers && Math.abs(s.powerFactor) < 1e-12 && (
            <div>
              <SectionLabel accent={A_I}>Nothing is dissipated</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`There is no resistance in this loop, so cos φ is exactly zero and the average power is `
                  + `exactly zero — with ${fmtAmp(s.Irms)} flowing. Turn on the power trace and watch p = v·i `
                  + `spend as long negative as positive. The element borrows energy and gives every joule back.`}
              </p>
            </div>
          )}

          {showElements && showNumbers && has.L && has.C && (
            <div>
              <SectionLabel accent={A_V}>Why the numbers do not add up</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Added as plain numbers the three element voltages come to ${fmtVolt(s.VR + s.VL + s.VC)}, `
                  + `against a supply of ${fmtVolt(c.V0)}. Added as phasors they come to `
                  + `${fmtVolt(phasorVoltageSum(s))} — because V_L and V_C point in exactly opposite `
                  + `directions and cancel in the sum while both readings stay real.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <AcCard issue={card} />}

          {/* A SECOND card, for the one AC code no single rung claims as its
              headline. `element_voltages_add_arithmetically` is demonstrated
              here the moment the element-voltage layer is on and the arithmetic
              sum visibly misses the supply — which is evidence the student has
              just been shown, not a preamble. Without this the code would have
              copy and no render site, which is exactly the declared-but-dead
              defect the exhaustive record guards against. */}
          {showElements && showNumbers && Math.abs(s.VR + s.VL + s.VC - c.V0) > c.V0 * 0.01
            && <AcCard issue={issueFor('element_voltages_add_arithmetically')} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_V}>Your circuit</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_V} format={(z) => String(Number(z.toPrecision(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
            {(archetype.params ?? []).map((p) => p.kind === 'select' ? (
              <div key={p.key} className="mt-1">
                <SectionLabel accent={A_V}>{p.label}</SectionLabel>
                <div className="mt-1.5">
                  <Choice options={p.options ?? []} accent={A_V}
                    value={typeof overrides[p.key] === 'string' ? (overrides[p.key] as string) : String(p.default)}
                    onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
                </div>
              </div>
            ) : null)}
          </div>

          {numeric && showNumbers && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_V}>
        {'The phasor is not a picture of the wave. It is the wave, standing up. Its height at every '
          + 'instant is the number on the trace, and the fixed angle between two of them is the phase.'}
      </ExpertTip>
    </SimShell>
  );
}
