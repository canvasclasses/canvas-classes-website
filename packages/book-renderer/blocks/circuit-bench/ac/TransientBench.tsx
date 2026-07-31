'use client';

/*
 * circuit-bench/ac/TransientBench.tsx — LR growth, LC oscillation, LCR damping.
 * ─────────────────────────────────────────────────────────────────────────────
 * Three rungs about what a circuit does in the first few time constants, which
 * is the half of circuit theory the DC solver cannot see.
 *
 * ── THE TRACES ARE CLOSED FORM, NOT STEPPED ─────────────────────────────────
 * Every curve comes from `lib/transient.ts`, which solves the differential
 * equation exactly. That matters because the headline number is "63.2% at
 * exactly t = τ", and a stepped integrator would land at 63.19% or 63.21%
 * depending on how many points the plot happened to use. A number that wobbles
 * when you change something that should not affect it teaches a student to
 * distrust the sim, correctly.
 *
 * ── THE CURSOR IS DRAGGED ───────────────────────────────────────────────────
 * Nothing plays by itself (design law #5). The time cursor is where the finger
 * is, so the student can park it exactly on t = τ, or on the instant the
 * capacitor is empty, and read the pair of numbers that make the point. A ▶ Run
 * toggle exists and starts OFF.
 *
 * ── WHAT EACH RUNG PUTS ON THE SAME AXES ────────────────────────────────────
 *   LR   the current, and BOTH voltages — because V_L + V_R = ε at every instant
 *        and watching them trade places is the lesson.
 *   LC   the charge and the current, plus the two energy bars. The bars matter
 *        more than the curves: "the capacitor is empty and the current is at its
 *        maximum" is a statement about where the energy is.
 *   LCR  the same, with the total energy falling — and the three regimes.
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
import { fmtAmp, fmtOhm, fmtVolt, sig } from '../lib/format';
import { issueFor } from '../lib/misconceptions';
import { AC_ARCHETYPES } from '../archetypes.ac';
import {
  criticalResistance, dampingOf, finalCurrentLR, lcSample, lcrSample, lrGrowth,
  omegaLC, periodLC, timeConstantLR,
} from './lib/transient';
import { acSetup } from './lib/setup';
import {
  A_I, A_V, AcCard, ActionButton, EnergyBars, GuidedPanel, Legend, ModelNote,
  NumericPanel, PlotKey, PredictGate, Readout, Slider, Toggle,
  type LegendRow, type ReadoutRow,
} from './ui';

/** Real seconds per simulated second when ▶ Run is on: the LC rungs happen in
 *  tens of milliseconds, so they are slowed to be watchable and the factor is
 *  stated rather than tuned by feel. */
const SLOWDOWN = 6;

type Bag = Record<string, number | string | boolean>;

export default function TransientBench({ block, archetypeId }:
  { block: CircuitBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = AC_ARCHETYPES[archetypeId] ?? AC_ARCHETYPES['lr-current-growth'];

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return acSetup('transient', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
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

  const kind = setup.transient;
  const isLR = kind === 'lr-growth' || kind === 'lr-decay';
  const isLCR = kind === 'lcr';
  const tMax = setup.tMax;

  const [t, setT] = React.useState(tMax * 0.45);
  const [running, setRunning] = React.useState(false);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [showEnergy, setShowEnergy] = React.useState(false);
  const [sawEmptyCapacitor, setSawEmptyCapacitor] = React.useState(false);

  const clamped = Math.min(Math.max(t, 0), tMax);
  React.useEffect(() => { if (t > tMax) setT(tMax * 0.45); }, [t, tMax]);

  // ⚠ THE OFFSCREEN GATE NEEDS A REAL ELEMENT. `useAnimationFrame` treats a
  // supplied `target` as "gate the loop on this element being in the viewport",
  // and with `target.current === null` it can never observe anything, so
  // `inViewport` stays false and the loop NEVER STARTS. A first draft passed a
  // fresh `React.useRef(null)` here and ▶ Run silently did nothing — no error,
  // no warning, a dead button. `wrapRef` is the measured wrapper and is attached
  // by the time any effect runs, which is why it has to be declared above this.
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();

  useAnimationFrame((dt) => {
    if (!running) return;
    setT((z) => {
      const next = z + dt / SLOWDOWN;
      if (next >= tMax) { setRunning(false); return tMax; }
      return next;
    });
  }, { target: wrapRef, enabled: running });

  // ── The physics ───────────────────────────────────────────────────────────
  const lr = setup.lr;
  const lc = setup.lc;
  const lcr = setup.lcr;
  const tau = timeConstantLR(lr);
  const iFinal = finalCurrentLR(lr);
  const w0 = omegaLC(lc);
  const T = periodLC(lc);
  const rCrit = criticalResistance(lc);
  const regime = dampingOf(lcr);

  const lrNow = lrGrowth(lr, clamped);
  const oscNow = isLCR ? lcrSample(lcr, clamped) : lcSample(lc, clamped);
  const u0 = (lc.q0 * lc.q0) / (2 * lc.C);

  React.useEffect(() => {
    if (!isLR && Math.abs(oscNow.charge) < lc.q0 * 0.05) setSawEmptyCapacitor(true);
  }, [isLR, oscNow.charge, lc.q0]);

  // ── Stage ─────────────────────────────────────────────────────────────────
  const narrow = isStacked(stageW);
  const boardW = Math.max(220, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = Math.max(230, Math.min(block.height ?? 360, Math.round(boardW * 0.54)));
  const PAD = 14;

  const trace = React.useMemo(() => {
    const N = 260;
    const a: { x: number; y: number }[] = [];
    const b: { x: number; y: number }[] = [];
    const c: { x: number; y: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const tt = (tMax * k) / N;
      if (isLR) {
        const q = lrGrowth(lr, tt);
        a.push({ x: tt, y: q.current });
        b.push({ x: tt, y: q.vR });
        c.push({ x: tt, y: q.vL });
      } else {
        const q = isLCR ? lcrSample(lcr, tt) : lcSample(lc, tt);
        a.push({ x: tt, y: q.charge });
        b.push({ x: tt, y: q.current });
        c.push({ x: tt, y: q.energyTotal });
      }
    }
    return { a, b, c };
  }, [isLR, isLCR, lr, lc, lcr, tMax]);

  const revealed = guided ? stage : script.length;
  const showSecond = revealed >= 1 || !guided;
  const showMarker = revealed >= 2 || !guided;
  const energyVisible = showEnergy || revealed >= 2 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = cardCode ? issueFor(cardCode) : null;
  const evidenceMet =
    cardCode === 'lc_current_stops_when_capacitor_empties' ? sawEmptyCapacitor
      : cardCode === 'battery_constant_current' ? showSecond
        : showMarker;

  // Scales. Each family normalised to its own peak, and the LEGEND says so —
  // amps and volts and coulombs cannot share an axis honestly.
  const aPeak = Math.max(...trace.a.map((p) => Math.abs(p.y)), 1e-18);
  const bPeak = Math.max(...trace.b.map((p) => Math.abs(p.y)), 1e-18);
  const cPeak = Math.max(...trace.c.map((p) => Math.abs(p.y)), 1e-18);
  const px = (tt: number) => PAD + (tt / Math.max(tMax, 1e-12)) * (boardW - 2 * PAD);
  const bipolar = !isLR;
  const py = (val: number, peak: number) => bipolar
    ? boardH / 2 - (val / peak) * (boardH / 2 - PAD)
    : boardH - PAD - (val / peak) * (boardH - 2 * PAD);
  const pathOf = (pts: { x: number; y: number }[], peak: number) =>
    pts.map((p, k) => `${k ? 'L' : 'M'}${px(p.x).toFixed(1)},${py(p.y, peak).toFixed(1)}`).join(' ');

  // ── Cursor drag ───────────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef(false);
  const timeAt = (clientX: number) => {
    const el = svgRef.current;
    if (!el) return clamped;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    return Math.min(tMax, Math.max(0, ((p - PAD) / Math.max(boardW - 2 * PAD, 1)) * tMax));
  };
  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = true;
    setRunning(false);
    setT(timeAt(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => { if (dragRef.current) setT(timeAt(e.clientX)); };
  const onUp = () => { dragRef.current = false; };

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: ReadoutRow[] = [{ label: 'Time', value: `${sig(clamped * 1000, 4)} ms`, colour: TEXT.primary }];
  if (isLR) {
    rows.push({ label: 'Time constant τ = L/R', value: `${sig(tau * 1000, 4)} ms`, colour: A_V });
    rows.push({ label: 'Current', value: fmtAmp(lrNow.current), colour: A_I, strong: true });
    rows.push({ label: 'Fraction of final', value: `${(lrNow.fraction * 100).toFixed(1)}%`, colour: A_I, strong: true });
    if (showSecond) {
      rows.push({ label: 'V across R', value: fmtVolt(lrNow.vR), colour: A_V });
      rows.push({ label: 'V across L', value: fmtVolt(lrNow.vL), colour: A_V });
      rows.push({ label: 'Their sum', value: fmtVolt(lrNow.vR + lrNow.vL), colour: A_V });
    }
    if (showMarker) {
      rows.push({ label: 'Final current ε/R', value: fmtAmp(iFinal), colour: TEXT.primary });
      rows.push({ label: 'Energy stored now', value: `${sig(lrNow.energy, 3)} J`, colour: TEXT.secondary });
      rows.push({ label: 'Slope dI/dt', value: `${sig(lrNow.dIdt, 3)} A/s`, colour: TEXT.secondary });
    }
  } else {
    rows.push({ label: 'ω₀ = 1/√(LC)', value: `${sig(w0, 5)} rad/s`, colour: A_V });
    rows.push({ label: 'Period', value: `${sig(T * 1000, 4)} ms`, colour: A_V });
    rows.push({ label: 'Capacitor voltage', value: fmtVolt(oscNow.voltage), colour: A_V, strong: true });
    rows.push({ label: 'Current', value: fmtAmp(oscNow.current), colour: A_I, strong: true });
    if (energyVisible) {
      rows.push({ label: 'Energy in the capacitor', value: `${sig(oscNow.energyC * 1000, 4)} mJ`, colour: A_V });
      rows.push({ label: 'Energy in the coil', value: `${sig(oscNow.energyL * 1000, 4)} mJ`, colour: A_I });
      rows.push({
        label: 'Their sum', value: `${sig(oscNow.energyTotal * 1000, 4)} mJ`,
        colour: TEXT.primary, strong: true,
      });
      if (isLCR) {
        rows.push({ label: 'Turned into heat so far', value: `${sig((oscNow as { energyLost?: number }).energyLost ?? 0, 5)} J`, colour: TEXT.secondary });
      }
    }
    if (isLCR && showMarker) {
      rows.push({ label: 'Damping', value: REGIME_WORD[regime], colour: A_V, strong: true });
      rows.push({ label: 'Critical resistance 2√(L/C)', value: fmtOhm(rCrit), colour: A_V });
      rows.push({ label: 'This resistance', value: fmtOhm(lcr.R), colour: A_V });
      if (regime === 'under') {
        rows.push({ label: 'Damped frequency ω_d', value: `${sig(lcrSample(lcr, 1e-6).omegaD, 5)} rad/s`, colour: TEXT.secondary });
      }
    }
  }

  const legend: LegendRow[] = isLR
    ? [
      { colour: A_I, label: 'the current, to its own final value' },
      ...(showSecond ? [
        { colour: A_V, label: 'V across the resistor' },
        { colour: A_V, dashed: true, label: 'V across the coil' },
      ] : []),
      ...(showMarker ? [{ colour: TEXT.primary, dashed: true, label: 'one time constant' }] : []),
    ]
    : [
      { colour: A_V, label: 'charge on the capacitor' },
      ...(showSecond ? [{ colour: A_I, label: 'the current' }] : []),
      ...(energyVisible ? [{ colour: TEXT.primary, dashed: true, label: 'total energy' }] : []),
    ];

  return (
    <SimShell>
      <SimHeader title={isLR ? 'LR' : isLCR ? 'LCR' : 'LC'} accentWord="Transient"
        subtitle={archetype.title}
        badge={isLR ? `τ = ${sig(tau * 1000, 3)} ms` : isLCR ? REGIME_WORD[regime] : `${sig(1 / T, 3)} Hz`}
        accent={A_V} />

      <div ref={wrapRef} style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : 'minmax(0,3fr) minmax(0,2fr)',
        gap: narrow ? 18 : 22,
      }}>
        <div className="flex flex-col gap-3">
          {narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((z) => Math.min(script.length - 1, z + 1))} />
          )}

          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A_V, 0.2)}`,
              height: boardH, touchAction: 'none',
            }}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${boardW} ${boardH}`}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              role="img"
              aria-label="Circuit quantities plotted against time. Values are listed beside the plot."
              style={{ display: 'block', touchAction: 'none', cursor: 'ew-resize' }}>

              <line x1={PAD} y1={bipolar ? boardH / 2 : boardH - PAD} x2={boardW - PAD}
                y2={bipolar ? boardH / 2 : boardH - PAD}
                stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={boardH - PAD}
                stroke="rgba(255,255,255,0.18)" strokeWidth={1} />

              {/* τ markers for LR, period markers for the oscillators. */}
              {showMarker && isLR && [1, 2, 3, 4, 5].map((k) => k * tau <= tMax ? (
                <line key={k} x1={px(k * tau)} y1={PAD} x2={px(k * tau)} y2={boardH - PAD}
                  stroke={k === 1 ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.09)'}
                  strokeWidth={k === 1 ? 1.6 : 1} strokeDasharray="5 4" />
              ) : null)}
              {showMarker && !isLR && [1, 2, 3, 4].map((k) => k * T <= tMax ? (
                <line key={k} x1={px(k * T)} y1={PAD} x2={px(k * T)} y2={boardH - PAD}
                  stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="5 4" />
              ) : null)}

              {energyVisible && !isLR && (
                <path d={pathOf(trace.c, cPeak)} fill="none" stroke={TEXT.primary}
                  strokeWidth={1.8} strokeDasharray="6 4" />
              )}
              {showSecond && isLR && (
                <>
                  <path d={pathOf(trace.b, Math.max(bPeak, cPeak))} fill="none" stroke={A_V} strokeWidth={2.2} />
                  <path d={pathOf(trace.c, Math.max(bPeak, cPeak))} fill="none" stroke={A_V}
                    strokeWidth={2.2} strokeDasharray="6 4" />
                </>
              )}
              {showSecond && !isLR && (
                <path d={pathOf(trace.b, bPeak)} fill="none" stroke={A_I} strokeWidth={2.2} />
              )}
              <path d={pathOf(trace.a, aPeak)} fill="none" stroke={isLR ? A_I : A_V} strokeWidth={2.6} />

              <line x1={px(clamped)} y1={PAD} x2={px(clamped)} y2={boardH - PAD}
                stroke="rgba(255,255,255,0.30)" strokeWidth={1.4} strokeDasharray="4 4" />
              <circle cx={px(clamped)} cy={py(isLR ? lrNow.current : oscNow.charge, aPeak)} r={4.6}
                fill={isLR ? A_I : A_V} />
              {showSecond && (
                <circle cx={px(clamped)}
                  cy={isLR ? py(lrNow.vR, Math.max(bPeak, cPeak)) : py(oscNow.current, bPeak)}
                  r={4.2} fill={isLR ? A_V : A_I} />
              )}
            </svg>
          </div>

          <Legend rows={legend} />
          <PlotKey items={[
            { colour: TEXT.ghost, text: `time axis 0 to ${sig(tMax * 1000, 3)} ms` },
            { colour: TEXT.ghost, text: 'each family drawn to its own peak — the SHAPES compare, not the heights' },
          ]} />

          <Slider label="Time cursor" value={clamped} min={0} max={tMax} step={tMax / 400}
            unit="ms" accent={A_V} format={(z) => sig(z * 1000, 4)} onChange={setT} />

          <div className="flex flex-wrap items-center gap-3">
            <ActionButton accent={A_V} onClick={() => { setRunning((r) => !r); }}>
              {running ? '❙❙ Pause' : '▶ Run slowly'}
            </ActionButton>
            <ActionButton accent={A_V} onClick={() => { setRunning(false); setT(0); }}>Back to t = 0</ActionButton>
            {isLR && (
              <ActionButton accent={A_V} onClick={() => { setRunning(false); setT(Math.min(tau, tMax)); }}>
                Jump to t = τ
              </ActionButton>
            )}
            {!isLR && (
              <ActionButton accent={A_V} onClick={() => { setRunning(false); setT(Math.min(T / 4, tMax)); }}>
                Jump to the empty capacitor
              </ActionButton>
            )}
            {!isLR && <Toggle on={energyVisible} label="Energy" accent={A_I} onClick={() => setShowEnergy((p) => !p)} />}
          </div>

          {energyVisible && !isLR && (
            <div>
              <SectionLabel accent={A_V}>Where the energy is</SectionLabel>
              <div className="mt-1.5">
                <EnergyBars a={oscNow.energyC} b={oscNow.energyL} total={u0}
                  colourA={A_V} colourB={A_I} />
              </div>
              <ModelNote>
                {isLCR
                  ? 'Two bars trading places, and the pair getting shorter — the resistor takes a bite on every pass.'
                  : 'Two bars trading places, and their total never moving. When one is empty the other is full.'}
              </ModelNote>
            </div>
          )}

          <ModelNote>
            {'Drag anywhere on the plot to move the time cursor. Every curve is the exact solution of the '
              + `differential equation, not a stepped approximation — which is why ${isLR ? '63.2% lands at exactly t = τ' : 'the total energy holds to the last digit'}.`}
          </ModelNote>
        </div>

        <div className="flex flex-col gap-4">
          {!narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((z) => Math.min(script.length - 1, z + 1))} />
          )}
          {needsPredict && (
            <p className="text-xs" style={{ color: TEXT.ghost }}>Commit a prediction below first.</p>
          )}
          {predict && stage >= 1 && (
            <PredictGate prompt={predict.prompt} options={predict.options}
              answerIndex={predict.answer_index} reveal={predict.reveal}
              choice={choice} onChoose={setChoice} />
          )}

          <Readout rows={rows}
            tone={isLR
              ? (Math.abs(clamped - tau) < tMax * 0.01 ? 'voltage' : 'plain')
              : (Math.abs(oscNow.charge) < lc.q0 * 0.05 ? 'current' : 'plain')}
            footnote={isLR
              ? (clamped < tMax * 0.01
                ? 'At the very first instant there is no current at all, so no p.d. across the resistor — and the WHOLE supply is across a coil with no resistance.'
                : 'V across R plus V across L is the supply voltage at every instant. They trade places; they never fail to add up.')
              : (Math.abs(oscNow.charge) < lc.q0 * 0.05
                ? 'The capacitor is empty and the current is at its maximum. Nothing has stopped — the energy is all in the coil now.'
                : undefined)} />

          {!isLR && isLCR && showMarker && (
            <div>
              <SectionLabel accent={A_V}>The three regimes</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`For this L and C the critical resistance is 2√(L/C) = ${fmtOhm(rCrit)}. `
                  + `Below it the circuit rings down; at it the charge slides to zero in the shortest `
                  + `possible time with no overshoot; above it — and this is the surprise — it settles `
                  + `more SLOWLY, not faster. There is a best amount of damping, and more is not better.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <AcCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_V}>Your circuit</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_V} format={(z) => String(Number(z.toPrecision(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
          </div>

          {numeric && showMarker && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_V}>
        {isLR
          ? 'A coil does not decide the final current — the resistor does. All the coil decides is how long it takes to get there.'
          : 'An LC circuit is a mass on a spring. Fastest as it passes the middle, and the total never moves unless something takes a bite.'}
      </ExpertTip>
    </SimShell>
  );
}

const REGIME_WORD: Record<string, string> = {
  under: 'under-damped',
  critical: 'critically damped',
  over: 'over-damped',
};
