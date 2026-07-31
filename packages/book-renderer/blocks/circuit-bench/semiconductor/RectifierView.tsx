'use client';

/*
 * semiconductor/RectifierView.tsx — input and output on the same time axis.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── What makes this a simulation and not a drawing (design law #3) ───────────
 * The output trace is not a shape this file knows. It is the frozen E3 nodal solver
 * run at 240 phases of the input sinusoid, with every diode's state re-decided from
 * scratch at each phase (`lib/solveDiode.ts`). The missing negative half is a
 * CONSEQUENCE of no consistent conducting state existing there — not a
 * `Math.max(0, …)` wearing a lab coat. Reverse the diode and the other half goes,
 * because the solve says so.
 *
 * The averages come out of a trapezoid integration of that solved waveform, and the
 * verifier checks them against V_p/π and 2V_p/π. Doing it the long way is what makes
 * the numbers evidence instead of decoration.
 *
 * ── Which diodes conduct is a topology question ─────────────────────────────
 * On the bridge, the conducting pair is highlighted live from the solve — and it is
 * the DIAGONALLY opposite pair, not the two drawn on the same side. That is the
 * `series_parallel_by_appearance` misconception met in the one place students meet
 * it hardest.
 *
 * ZERO `<text>` on the canvas. Guided, never auto-playing: the sweep advances only
 * on a press, and the cursor is dragged, never animated.
 */

import * as React from 'react';
import {
  idealFullWave, idealHalfWave, rectificationEfficiency, smoothing, sweepRectifier,
  type RectifierResult,
} from './lib/rectifier';
import { axis, polyline, ticks } from './lib/view';
import { si, fixed } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Chip, Choice, Legend, ModelNote,
  PredictGate, Readout, Stage, TickStrip, Toggle, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

export default function RectifierView({ scene, arch, stageW, stacked, rebuild }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
  /** Rebuild the whole scene with a changed param — the only way to switch
   *  topology, because a bridge is a different circuit and not a different value. */
  rebuild: (patch: Record<string, number | string | boolean>) => void;
}) {
  const spec = scene.rectifier;
  const [peak, setPeak] = React.useState(spec?.peak ?? 12);
  const [load, setLoad] = React.useState(spec?.loadOhms ?? 1000);
  const [rung, setRung] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);
  const [cursor, setCursor] = React.useState(0.25);
  const [showSmoothing, setShowSmoothing] = React.useState(false);
  const [farads, setFarads] = React.useState(100e-6);

  const topology = spec?.topology ?? 'half-wave';
  const isFullWave = topology !== 'half-wave';

  const result: RectifierResult | null = React.useMemo(() => {
    if (!spec) return null;
    const circuit = {
      ...scene.circuit,
      components: scene.circuit.components.map((c) => (c.id === 'RL' ? { ...c, value: load } : c)),
    };
    return sweepRectifier({
      circuit,
      diodes: scene.diodes,
      sourceIds: spec.sourceIds,
      peak,
      frequency: spec.frequency,
      outputNodes: spec.outputNodes,
      loadOhms: load,
      topology,
    }, 240);
  }, [scene.circuit, scene.diodes, spec, peak, load, topology]);

  const w = Math.max(240, stageW || 320);
  const h = stageHeightFor(w, stacked ? 0.66 : 0.54, 340, 220);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  if (!spec || !result) {
    return (
      <Card tone="bad">
        <p className="text-sm" style={{ color: TEXT.primary }}>
          This archetype has no rectifier specification, so there is nothing to sweep.
        </p>
      </Card>
    );
  }

  const ideal = isFullWave ? idealFullWave(peak) : idealHalfWave(peak);
  const at = result.points[Math.round(cursor * (result.points.length - 1))];
  const smooth = smoothing(result.outputPeak, load, farads, result.rippleFrequency);

  const evidence = rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'circuit', value: topology === 'half-wave' ? 'half wave, one diode' : topology === 'bridge' ? 'bridge, four diodes' : 'centre tap, two diodes', color: A1 },
    { label: 'input peak', value: `${fixed(peak, 1)} V` },
    { label: 'diode drops in series', value: `${result.seriesDrops}`, color: A2 },
    { label: 'output peak', value: `${fixed(result.outputPeak, 3)} V`, color: A2, strong: true },
    ...(rung >= 1
      ? [
        { label: 'mean output', value: `${fixed(result.vAvg, 3)} V`, color: A2, strong: true },
        { label: 'the ideal formula gives', value: `${fixed(ideal.vAvg, 3)} V` },
        { label: 'r.m.s. output', value: `${fixed(result.vRms, 3)} V` },
        { label: 'ripple factor', value: fixed(result.rippleFactor, 3), color: A2 },
        { label: 'ideal ripple factor', value: fixed(ideal.rippleFactor, 3) },
        { label: 'conducting for', value: `${fixed(result.conductionFraction * 100, 1)}% of the cycle` },
        { label: 'ripple frequency', value: `${result.rippleFrequency} Hz`, color: A2 },
        { label: 'rectification efficiency', value: `${fixed(rectificationEfficiency(ideal) * 100, 1)}%` },
      ]
      : []),
    ...(rung >= 2
      ? [
        { label: `at phase ${fixed((at.phase * 180) / Math.PI, 0)}°`, value: `input ${fixed(at.vIn, 2)} V` },
        { label: 'output there', value: `${fixed(at.vOut, 3)} V`, color: A2 },
        { label: 'load current there', value: si(at.iOut, 'A'), color: A2 },
        { label: 'conducting there', value: at.conducting.length ? at.conducting.join(' + ') : 'nothing at all' },
      ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {rung === 0 && predictChoice === null && (
        <PredictGate
          prompt={
            isFullWave
              ? '**Before the sweep:** the half-wave circuit gave a mean output of V_p/π. What will this one give?'
              : `**Before the sweep:** a ${fixed(peak, 0)} V peak sinusoid, one silicon diode, a ${si(load, 'Ω')} load. On the NEGATIVE half cycle, what is the output?`
          }
          options={isFullWave
            ? ['The same — one diode conducts at a time either way',
              'Twice as much — the second half is no longer discarded',
              'Half as much — the current is shared between two diodes',
              'Zero — the two halves cancel']
            : ['Inverted — it comes out positive',
              'Reduced but still there',
              'Nothing at all — a flat line at zero',
              'The same as the input']}
          answerIndex={isFullWave ? 1 : 2}
          reveal={isFullWave
            ? 'Twice — 2V_p/π. Nothing about the diodes changed; the improvement is entirely that the negative half is used instead of thrown away.'
            : 'Nothing at all. The diode is not reducing the current on that half, it is preventing it — and the solver finds no consistent conducting state for the whole half cycle.'}
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      <Stage>
        <Canvas box={box} label="Input and rectified output over one full cycle of the supply.">
          <WaveformPair
            box={box}
            points={result.points}
            peak={peak}
            cursor={rung >= 2 ? cursor : null}
            showOutput={rung >= 1}
            showCurrent={rung >= 2}
            loadOhms={load}
          />
        </Canvas>
        <TickStrip
          box={box}
          ticks={ticks(0, 360, 6)}
          format={(v) => `${fixed(v, 0)}°`}
          unit="one cycle"
        />
      </Stage>

      <Legend rows={[
        { color: A1, dashed: true, label: 'input', value: `${fixed(peak, 1)} V peak` },
        ...(rung >= 1 ? [{ color: A2, label: 'output across the load', value: `${fixed(result.outputPeak, 2)} V peak` }] : []),
        ...(rung >= 2 ? [{ color: TEXT.secondary, dashed: true, label: 'load current, same shape' }] : []),
        ...(rung >= 1 ? [{ color: TEXT.muted, dashed: true, label: 'mean output', value: `${fixed(result.vAvg, 2)} V` }] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={A2}
          disabled={rung >= 3 || (rung === 0 && predictChoice === null)}
          onClick={() => setRung((r) => Math.min(3, r + 1))}
        >
          {rung === 0 ? 'Sweep one cycle'
            : rung === 1 ? 'Compare the two currents'
              : rung === 2 ? 'Read the averages' : 'All three shown'}
        </ActionButton>
        {rung > 0 && <ActionButton onClick={() => { setRung(0); setPredictChoice(null); }}>Start again</ActionButton>}
        {isFullWave && (
          <Choice
            options={['centre-tap', 'bridge']}
            value={topology}
            onChange={(v) => { rebuild({ topology: v }); setRung(Math.max(rung, 1)); }}
            accent={A2}
          />
        )}
        {rung >= 2 && (
          <Toggle on={showSmoothing} label="Add a smoothing capacitor" onClick={() => setShowSmoothing((v) => !v)} accent={A2} />
        )}
      </div>

      {rung >= 2 && (
        <>
          <SimSlider
            label="Cursor"
            value={cursor}
            min={0}
            max={1}
            step={0.004}
            accent={A2}
            onChange={setCursor}
            format={() => `${fixed((at.phase * 180) / Math.PI, 0)}°`}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {scene.diodes.map((d) => {
              const on = at.conducting.includes(d.id);
              return (
                <Chip
                  key={d.id}
                  label={d.label ?? d.id}
                  value={on ? 'conducting' : 'off'}
                  colour={on ? A2 : A1}
                  dim={!on}
                />
              );
            })}
          </div>
        </>
      )}

      {rung >= 2 && topology === 'bridge' && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            The conducting pair is diagonal
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            Drag the cursor through the cycle and watch which two light up: <b>D1 with D4</b>, then{' '}
            <b>D2 with D3</b>. Not the two drawn on the same side of the diamond. Which diodes conduct is
            decided by which NODES they share — a fact about the circuit — and never by where they sit on
            the page.
          </p>
        </Card>
      )}

      {rung >= 2 && (
        <Card tone="accent">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
            At every instant on a conducting half, the diode current and the load current are the same
            number — they are in series, and charge cannot pile up inside a diode. What the diode removes is
            not current, it is the half cycle. On the blocked part both are exactly zero, not reduced.
          </p>
        </Card>
      )}

      {rung >= 3 && (
        <Card tone="second">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
            The mean measured off the solved waveform is{' '}
            <b className="tabular-nums" style={{ color: A2 }}>{fixed(result.vAvg, 3)} V</b>; the ideal formula{' '}
            {isFullWave ? '2V_p/π' : 'V_p/π'} gives <b className="tabular-nums">{fixed(ideal.vAvg, 3)} V</b>.
            The gap is the {result.seriesDrops} diode drop{result.seriesDrops === 1 ? '' : 's'} the formula
            ignores — {fixed(peak - result.outputPeak, 2)} V of it — which matters a great deal at 5 V and
            almost not at all at 230 V.
          </p>
        </Card>
      )}

      {showSmoothing && rung >= 2 && (
        <>
          <SimSlider
            label="Capacitor"
            value={farads * 1e6}
            min={1}
            max={4700}
            step={1}
            onChange={(v) => setFarads(v * 1e-6)}
            format={(v) => fixed(v, 0)}
            unit="µF"
          />
          <Readout
            tone="second"
            rows={[
              { label: 'd.c. output with the capacitor', value: `${fixed(smooth.vDc, 3)} V`, color: A2, strong: true },
              { label: 'peak-to-peak ripple', value: `${fixed(smooth.ripplePkPk, 4)} V`, color: A2 },
              { label: 'ripple factor', value: fixed(smooth.rippleFactor, 5) },
              { label: 'RC', value: si(smooth.rc, 's') },
              { label: 'time between peaks', value: si(smooth.dischargeTime, 's') },
            ]}
            footnote={smooth.note}
          />
        </>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <SimSlider
          label="Input peak"
          value={peak}
          min={2}
          max={30}
          step={0.5}
          accent={A2}
          onChange={setPeak}
          format={(v) => v.toFixed(1)}
          unit="V"
        />
        <SimSlider
          label="Load"
          value={load}
          min={100}
          max={10000}
          step={100}
          onChange={setLoad}
          format={(v) => si(v, '')}
          unit="Ω"
        />
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      {topology === 'bridge' && (
        <ModelNote>
          The bridge carries a 10 MΩ reference resistor, labelled in the netlist. A transformer secondary has
          no defined d.c. level of its own, so in the dead band where all four diodes are off the winding is
          genuinely floating and no potential across a diode is defined. That is a real bench problem, not a
          modelling artefact — and 10 MΩ draws about a microamp against a milliamp load, so it changes no
          number shown here.
        </ModelNote>
      )}

      <ModelNote>
        Every point on the output trace is a separate solve of the whole circuit with the diode states
        re-decided from scratch — 240 of them per cycle. That is valid here because nothing in this circuit
        stores energy; the smoothing capacitor above is therefore CALCULATED rather than swept, and the
        waveform never contains it.
      </ModelNote>
    </div>
  );
}

// ── the waveform pair ────────────────────────────────────────────────────────

function WaveformPair({ box, points, peak, cursor, showOutput, showCurrent, loadOhms }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  points: { phase: number; vIn: number; vOut: number; iOut: number }[];
  peak: number;
  cursor: number | null;
  showOutput: boolean;
  showCurrent: boolean;
  loadOhms: number;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(0, 2 * Math.PI, x, x + w);
  const py = axis(-peak * 1.1, peak * 1.1, y + h, y);
  const zeroY = py(0);

  const gridX = ticks(0, 360, 6).map((deg) => px((deg * Math.PI) / 180));
  const gridY = ticks(-peak, peak, 4).map(py);
  const mean = points.reduce((s, p) => s + Math.abs(p.vOut), 0) / points.length;

  // The current trace is scaled to the same box as the voltage so the two shapes
  // can be compared. It is a SHAPE comparison, which is why the legend says
  // "same shape" and the readout carries the actual amps.
  const iPeak = Math.max(...points.map((p) => Math.abs(p.iOut)), 1e-12);

  return (
    <g>
      <Axes box={box} gridX={gridX} gridY={gridY} zeroY={zeroY} />

      <path
        d={polyline(points, (p) => px(p.phase), (p) => py(p.vIn))}
        fill="none" stroke={A1} strokeWidth={1.8} strokeDasharray="6 4"
      />

      {showOutput && (
        <>
          <path
            d={polyline(points, (p) => px(p.phase), (p) => py(p.vOut))}
            fill="none" stroke={A2} strokeWidth={2.8}
          />
          <line x1={x} y1={py(mean)} x2={x + w} y2={py(mean)} stroke={TEXT.muted} strokeWidth={1.4} strokeDasharray="4 4" />
        </>
      )}

      {showCurrent && (
        <path
          d={polyline(points, (p) => px(p.phase), (p) => py((p.iOut / iPeak) * peak * 0.55))}
          fill="none" stroke={TEXT.secondary} strokeWidth={1.4} strokeDasharray="2 3"
        />
      )}

      {cursor != null && (() => {
        const p = points[Math.round(cursor * (points.length - 1))];
        return (
          <g>
            <line x1={px(p.phase)} y1={y} x2={px(p.phase)} y2={y + h} stroke={A2} strokeWidth={1.4} />
            <circle cx={px(p.phase)} cy={py(p.vOut)} r={4.5} fill={A2} />
            <circle cx={px(p.phase)} cy={py(p.vIn)} r={3.5} fill={A1} />
          </g>
        );
      })()}
      {void loadOhms}
    </g>
  );
}
