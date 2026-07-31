'use client';

/*
 * circuit-bench/ac/SweepBench.tsx — reactance, resonance and the frequency gate.
 * ─────────────────────────────────────────────────────────────────────────────
 * Three rungs on one plot: X_L against X_C, the resonance they create, and the
 * capacitor that becomes a wire at high frequency.
 *
 * ── THE X AXIS IS LOGARITHMIC, AND THAT IS NOT A STYLE CHOICE ───────────────
 * X_C = 1/(2πfC) is a hyperbola. On a linear frequency axis it plunges into the
 * left-hand edge, the crossing with X_L is crammed into the first few pixels, and
 * the resonance the exercise is about is invisible. On a log axis the two curves
 * cross in the middle of the picture at a readable angle, which is the entire
 * reason the plot exists.
 *
 * ── THE CURSOR IS THE INTERACTION ───────────────────────────────────────────
 * The student drags a vertical line along the plot and every readout follows.
 * Nothing sweeps on its own (design law #5), and dragging rather than tapping
 * matters here because the lesson is what happens as you PASS through f₀ — the
 * phase flipping sign, the impedance bottoming out — and that is a gesture, not
 * a value.
 *
 * ── FOUR CURVES, TWO ACCENTS ────────────────────────────────────────────────
 * X_L and X_C and |Z| are all opposition, so all three are the VOLTAGE accent
 * (solid, dashed, and heavy). I_rms is the CURRENT accent. White and grey are not
 * accents, so the axes and the f₀ marker cost nothing against the two-colour rule.
 *
 * ZERO `<text>` on the canvas.
 */

import * as React from 'react';
import type { CircuitBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
} from '../../simulations/_shared';
import { isStacked, useStageWidth } from '../useStageWidth';
import { fmtAmp, fmtOhm, fmtVolt, fmtWatt, sig } from '../lib/format';
import { issueFor } from '../lib/misconceptions';
import { AC_ARCHETYPES } from '../archetypes.ac';
import {
  acState, bandwidth, frequencySweep, phasorVoltageSum, qualityFactor,
  resonanceFrequency,
} from './lib/phasor';
import { acSetup, presentIn } from './lib/setup';
import {
  A_I, A_V, AcCard, ActionButton, Choice, GuidedPanel, Legend, ModelNote,
  NumericPanel, PlotKey, PredictGate, Readout, Slider,
  type LegendRow, type ReadoutRow,
} from './ui';

type Bag = Record<string, number | string | boolean>;

export default function SweepBench({ block, archetypeId }:
  { block: CircuitBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = AC_ARCHETYPES[archetypeId] ?? AC_ARCHETYPES['reactance-vs-frequency'];
  const isGate = archetypeId === 'capacitor-frequency-gate';

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return acSetup('sweep', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
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

  const base = setup.circuit;
  const has = presentIn(setup.elements);
  const fMin = setup.sweep.fMin;
  const fMax = setup.sweep.fMax;
  const f0 = resonanceFrequency(base.L, base.C);

  const [f, setF] = React.useState(() => {
    const mid = Math.sqrt(fMin * fMax);
    return Number.isFinite(f0) && f0 > fMin && f0 < fMax ? f0 * 0.4 : mid;
  });
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [crossedF0, setCrossedF0] = React.useState(false);
  const sideRef = React.useRef<number | null>(null);

  const clampF = (x: number) => Math.min(fMax, Math.max(fMin, x));
  const s = acState({ ...base, f: clampF(f) });

  React.useEffect(() => {
    if (!Number.isFinite(f0)) return;
    const side = Math.sign(f - f0);
    if (sideRef.current !== null && side !== 0 && side !== sideRef.current) setCrossedF0(true);
    if (side !== 0) sideRef.current = side;
  }, [f, f0]);

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isStacked(stageW);
  const boardW = Math.max(220, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = Math.max(240, Math.min(block.height ?? 380, Math.round(boardW * 0.58)));
  const PAD = 14;

  const sweep = React.useMemo(
    () => frequencySweep(base, fMin, fMax, 200),
    [base, fMin, fMax],
  );

  const revealed = guided ? stage : script.length;
  const showXL = revealed >= 1 || !guided;
  const showXC = revealed >= 2 || !guided;
  const showZ = revealed >= 2 || !guided || isGate;
  const showMarker = revealed >= 3 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = cardCode ? issueFor(cardCode) : null;
  const evidenceMet =
    cardCode === 'resonance_is_maximum_impedance' ? crossedF0
      : cardCode === 'reactance_is_a_resistance' ? showXC
        : showZ;

  // Scales. Ohms on a log axis too: X_C spans three decades across the sweep.
  const lx = (freq: number) =>
    PAD + ((Math.log10(freq) - Math.log10(fMin)) / (Math.log10(fMax) - Math.log10(fMin))) * (boardW - 2 * PAD);
  const ohmMax = Math.max(
    ...sweep.map((p) => Math.max(
      showXL ? p.XL : 0,
      showXC && Number.isFinite(p.XC) ? p.XC : 0,
      showZ ? p.Z : 0,
    )),
    base.R * 1.4, 1,
  );
  const ly = (ohm: number) => boardH - PAD - (Math.min(ohm, ohmMax) / ohmMax) * (boardH - 2 * PAD);
  const iMax = Math.max(...sweep.map((p) => p.Irms), 1e-12) * 1.1;
  const lyI = (a: number) => boardH - PAD - (a / iMax) * (boardH - 2 * PAD);

  const pathOhm = (key: 'XL' | 'XC' | 'Z') => sweep
    .filter((p) => Number.isFinite(p[key]))
    .map((p, k) => `${k ? 'L' : 'M'}${lx(p.f).toFixed(1)},${ly(p[key]).toFixed(1)}`).join(' ');
  const pathI = sweep.map((p, k) => `${k ? 'L' : 'M'}${lx(p.f).toFixed(1)},${lyI(p.Irms).toFixed(1)}`).join(' ');

  // ── Cursor drag ───────────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef(false);
  const freqAt = (clientX: number): number => {
    const el = svgRef.current;
    if (!el) return f;
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    const frac = (px - PAD) / Math.max(boardW - 2 * PAD, 1);
    const lo = Math.log10(fMin);
    const hi = Math.log10(fMax);
    return clampF(10 ** (lo + frac * (hi - lo)));
  };
  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = true;
    setF(freqAt(e.clientX));
  };
  const onMove = (e: React.PointerEvent) => { if (dragRef.current) setF(freqAt(e.clientX)); };
  const onUp = () => { dragRef.current = false; };

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: ReadoutRow[] = [
    { label: 'Frequency', value: `${sig(s.f, 4)} Hz`, colour: TEXT.primary, strong: true },
  ];
  if (showXL && has.L) rows.push({ label: 'X_L = 2πfL', value: fmtOhm(s.XL), colour: A_V });
  if (showXC && has.C) {
    rows.push({ label: 'X_C = 1/(2πfC)', value: s.blockedByCapacitor ? 'infinite' : fmtOhm(s.XC), colour: A_V });
  }
  if (showZ) {
    rows.push({ label: 'Impedance Z', value: s.blockedByCapacitor ? 'infinite' : fmtOhm(s.Z), colour: A_V, strong: true });
    rows.push({ label: 'Current I rms', value: fmtAmp(s.Irms), colour: A_I, strong: true });
    rows.push({ label: 'Phase', value: `${sig(s.phaseDeg, 4)}°`, colour: A_I });
    rows.push({ label: 'Power factor', value: sig(s.powerFactor, 4), colour: A_I });
    rows.push({ label: 'Average power', value: fmtWatt(s.avgPower), colour: TEXT.primary });
  }
  if (isGate && showZ) {
    rows.push({ label: 'V across the capacitor', value: fmtVolt(s.VC), colour: A_V });
    rows.push({ label: 'V across the resistor', value: fmtVolt(s.VR), colour: A_V });
    rows.push({
      label: 'Share taken by the capacitor',
      value: `${((s.VC / Math.max(base.V0, 1e-12)) * 100).toFixed(1)}%`,
      colour: A_V, strong: true,
    });
  }
  if (showMarker && Number.isFinite(f0)) {
    rows.push({ label: 'Resonant frequency f₀', value: `${sig(f0, 4)} Hz`, colour: A_V });
    if (base.R > 0) {
      rows.push({ label: 'Q factor', value: sig(qualityFactor(base.R, base.L, base.C), 3), colour: A_V });
      rows.push({ label: 'Bandwidth', value: `${sig(bandwidth(base.R, base.L), 3)} Hz`, colour: TEXT.secondary });
    }
    rows.push({ label: 'V across L (peak)', value: fmtVolt(s.VL), colour: A_V });
    rows.push({ label: 'V across C (peak)', value: fmtVolt(s.VC), colour: A_V });
    rows.push({ label: 'Their phasor sum with V_R', value: fmtVolt(phasorVoltageSum(s)), colour: A_V });
  }

  const legend: LegendRow[] = [];
  if (showXL && has.L) legend.push({ colour: A_V, label: 'X_L — rises with frequency' });
  if (showXC && has.C) legend.push({ colour: A_V, dashed: true, label: 'X_C — falls with frequency' });
  if (showZ) {
    legend.push({ colour: TEXT.primary, label: 'impedance |Z|' });
    legend.push({ colour: A_I, label: 'current I rms' });
  }
  if (showMarker && Number.isFinite(f0)) legend.push({ colour: A_I, dashed: true, label: 'resonance f₀' });
  legend.push({ colour: TEXT.ghost, label: 'your frequency cursor — drag it', dashed: true });

  const regime = !Number.isFinite(f0) ? '' : s.f < f0 * 0.98 ? 'capacitive'
    : s.f > f0 * 1.02 ? 'inductive' : 'at resonance';

  return (
    <SimShell>
      <SimHeader title="Reactance" accentWord="Sweep" subtitle={archetype.title}
        badge={`${sig(s.f, 3)} Hz${regime ? ` · ${regime}` : ''}`} accent={A_V} />

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
              aria-label="Reactance, impedance and current plotted against frequency on a logarithmic axis. Values are listed beside the plot."
              style={{ display: 'block', touchAction: 'none', cursor: 'ew-resize' }}>

              <line x1={PAD} y1={boardH - PAD} x2={boardW - PAD} y2={boardH - PAD}
                stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
              <line x1={PAD} y1={PAD} x2={PAD} y2={boardH - PAD}
                stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
              {/* Decade gridlines — the reason a log axis reads as a log axis. */}
              {decades(fMin, fMax).map((d) => (
                <line key={d} x1={lx(d)} y1={PAD} x2={lx(d)} y2={boardH - PAD}
                  stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              ))}

              {base.R > 0 && showZ && (
                <line x1={PAD} y1={ly(base.R)} x2={boardW - PAD} y2={ly(base.R)}
                  stroke="rgba(255,255,255,0.16)" strokeWidth={1} strokeDasharray="3 5" />
              )}

              {showMarker && Number.isFinite(f0) && f0 > fMin && f0 < fMax && (
                <line x1={lx(f0)} y1={PAD} x2={lx(f0)} y2={boardH - PAD}
                  stroke={A_I} strokeWidth={1.6} strokeDasharray="5 4" />
              )}

              {showZ && <path d={pathI} fill="none" stroke={A_I} strokeWidth={2.2} />}
              {showZ && <path d={pathOhm('Z')} fill="none" stroke={TEXT.primary} strokeWidth={2.6} />}
              {showXL && has.L && <path d={pathOhm('XL')} fill="none" stroke={A_V} strokeWidth={2.2} />}
              {showXC && has.C && (
                <path d={pathOhm('XC')} fill="none" stroke={A_V} strokeWidth={2.2} strokeDasharray="6 4" />
              )}

              {/* The cursor, and dots where it meets each curve. */}
              <line x1={lx(s.f)} y1={PAD} x2={lx(s.f)} y2={boardH - PAD}
                stroke="rgba(255,255,255,0.30)" strokeWidth={1.4} strokeDasharray="4 4" />
              {showXL && has.L && <circle cx={lx(s.f)} cy={ly(s.XL)} r={4.2} fill={A_V} />}
              {showXC && has.C && Number.isFinite(s.XC) && <circle cx={lx(s.f)} cy={ly(s.XC)} r={4.2} fill={A_V} />}
              {showZ && Number.isFinite(s.Z) && <circle cx={lx(s.f)} cy={ly(s.Z)} r={4.6} fill={TEXT.primary} />}
              {showZ && <circle cx={lx(s.f)} cy={lyI(s.Irms)} r={4.6} fill={A_I} />}
            </svg>
          </div>

          <Legend rows={legend} />
          <PlotKey items={[
            { colour: TEXT.ghost, text: `frequency axis is logarithmic, ${sig(fMin, 3)} Hz to ${sig(fMax, 3)} Hz` },
            { colour: TEXT.ghost, text: `ohms axis to ${fmtOhm(ohmMax)}` },
          ]} />

          <Slider label="Frequency" value={s.f} min={fMin} max={fMax}
            step={Math.max((fMax - fMin) / 600, 0.01)} unit="Hz" accent={A_V}
            format={(z) => sig(z, 4)} onChange={(z) => setF(clampF(z))} />

          {Number.isFinite(f0) && (
            <div className="flex flex-wrap items-center gap-2">
              <ActionButton accent={A_V} onClick={() => setF(clampF(f0))}>Jump to resonance</ActionButton>
              <ActionButton accent={A_V} onClick={() => setF(clampF(fMin))}>Bottom of the sweep</ActionButton>
              <ActionButton accent={A_V} onClick={() => setF(clampF(fMax))}>Top of the sweep</ActionButton>
            </div>
          )}
          <ModelNote>
            {'Drag anywhere on the plot to move the frequency cursor. Both axes are drawn to the ranges '
              + 'named above; nothing on the plot is labelled so nothing can be overrun by a curve.'}
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
            tone={Number.isFinite(f0) && Math.abs(s.f - f0) / f0 < 0.02 ? 'voltage' : 'plain'}
            footnote={Number.isFinite(f0) && Math.abs(s.f - f0) / f0 < 0.02
              ? 'At resonance X_L and X_C have cancelled exactly, so the impedance is nothing but R and the phase is zero — the circuit behaves as if the coil and the capacitor were not in it.'
              : undefined} />

          {showMarker && Number.isFinite(f0) && (
            <div>
              <SectionLabel accent={A_V}>Where f₀ comes from</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Set 2πfL equal to 1/(2πfC) and solve: f₀ = 1/(2π√(LC)) = ${sig(f0, 4)} Hz. `
                  + 'Below it the capacitor dominates and the current leads; above it the coil does, and '
                  + 'the current lags. At it, neither — and the impedance is a MINIMUM, not a maximum.'}
              </p>
            </div>
          )}

          {isGate && showZ && (
            <div>
              <SectionLabel accent={A_V}>The capacitor as a wire</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`At ${sig(s.f, 3)} Hz the capacitor's reactance is ${fmtOhm(s.XC)} and it is taking `
                  + `${((s.VC / Math.max(base.V0, 1e-12)) * 100).toFixed(1)}% of the supply. Push the frequency `
                  + 'to the top of the sweep and watch that share collapse while the CURRENT is at its '
                  + 'largest — an element with no impedance drops no voltage, however much it carries.'}
              </p>
            </div>
          )}

          {card && evidenceMet && <AcCard issue={card} />}

          {/* The same secondary card as PhasorBench, for the same reason — here
              the evidence is the resonance panel having shown V_L, V_C and their
              phasor sum side by side. */}
          {showMarker && has.L && has.C && Math.abs(s.VR + s.VL + s.VC - base.V0) > base.V0 * 0.01
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

          {numeric && showZ && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_V}>
        {'Two elements measured in ohms, going opposite ways with frequency. Everywhere they are unequal '
          + 'one of them is in charge; at the one frequency where they match, neither is.'}
      </ExpertTip>
    </SimShell>
  );
}

/** Powers of ten inside the sweep, for the gridlines. */
function decades(lo: number, hi: number): number[] {
  const out: number[] = [];
  for (let e = Math.ceil(Math.log10(lo)); 10 ** e <= hi; e++) out.push(10 ** e);
  return out;
}
