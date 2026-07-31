'use client';

/*
 * semiconductor/DiodeView.tsx — there is no knee in the equation.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Every textbook prints the diode characteristic with a sharp corner at 0.7 V and
 * lets the student believe the corner is a property of the diode. It is not. The
 * equation I = I_S(e^(V/V_T) − 1) is smooth everywhere and has no corner anywhere.
 * The corner is what an exponential looks like on a LINEAR axis.
 *
 * So this view has one toggle that does the teaching: switch the current axis to
 * logarithmic and the corner vanishes into a straight line, rising one decade per
 * 59.5 mV. The same data, the same diode, and the knee has gone — which is the
 * only way to show that the knee was never in the device.
 *
 * The second half is the LOAD LINE. A diode and a resistor in series have to agree
 * on one current, so the operating point is where the two curves cross. That
 * graphical solve is the general method for any nonlinear element, and the crossing
 * point is checked against the frozen nodal solver's answer for the same circuit —
 * two independent routes to one number.
 *
 * ZERO `<text>` on the canvas. Guided, never auto-playing.
 */

import * as React from 'react';
import {
  diode, ivCurve, saturationCurrent, shockleyCurrent, voltageAtCurrent, voltsPerDecade,
} from './lib/diode';
import { solveDiodeCircuit } from './lib/solveDiode';
import { axis, polyline, symlog, ticks } from './lib/view';
import { si, fixed } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Choice, Legend, ModelNote,
  PredictGate, Readout, Stage, TickStrip, Toggle, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { withSourceEmf } from './lib/solveDiode';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

export default function DiodeView({ scene, arch, stageW, stacked }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const d0 = scene.diodes[0] ?? diode('D1', 'in', 'out');
  const [materialName, setMaterialName] = React.useState<string>(d0.material.name);
  const [logAxis, setLogAxis] = React.useState(false);
  const [supply, setSupply] = React.useState(5);
  const [load, setLoad] = React.useState(1000);
  const [rung, setRung] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);
  const [everLog, setEverLog] = React.useState(false);

  const d = React.useMemo(
    () => diode(d0.id, d0.anode, d0.cathode, { material: materialName, label: d0.label }),
    [materialName, d0.id, d0.anode, d0.cathode, d0.label],
  );

  const vMin = -1.2;
  const vMax = 0.9;
  const curve = React.useMemo(() => ivCurve(d, vMin, vMax, 320), [d]);
  const iMax = Math.max(...curve.map((p) => p.i));

  // The operating point, from the FROZEN nodal solver — not from reading the graph.
  const solved = React.useMemo(() => {
    const c = withSourceEmf(scene.circuit, 'VS', supply);
    const withLoad = {
      ...c,
      components: c.components.map((x) => (x.id === 'RL' ? { ...x, value: load } : x)),
    };
    return solveDiodeCircuit(withLoad, [d]);
  }, [scene.circuit, supply, load, d]);

  const opV = solved.drops[d.id] ?? 0;
  const opI = solved.currents[d.id] ?? 0;

  const w = Math.max(240, stageW || 320);
  const h = stageHeightFor(w, stacked ? 0.72 : 0.6, 380, 240);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  const evidence = everLog && rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'diode', value: `${d.material.label}, knee ${fixed(d.knee, 2)} V`, color: A1 },
    { label: 'reverse saturation current I_S', value: si(saturationCurrent(d), 'A') },
    { label: 'V at 1 mA', value: `${fixed(voltageAtCurrent(d, 1e-3), 3)} V`, color: A1 },
    { label: 'V at 10 mA', value: `${fixed(voltageAtCurrent(d, 1e-2), 3)} V` },
    { label: 'volts per decade of current', value: si(voltsPerDecade(d), 'V'), color: A2, strong: true },
    { label: 'current at −0.5 V', value: si(shockleyCurrent(d, -0.5), 'A') },
    ...(rung >= 3
      ? [
        { label: 'load line', value: `${fixed(supply, 1)} V through ${si(load, 'Ω')}` },
        { label: 'operating point — diode', value: `${fixed(opV, 3)} V`, color: A2, strong: true },
        { label: 'operating point — current', value: si(opI, 'A'), color: A2, strong: true },
        { label: 'the diode is', value: solved.states[d.id] ?? 'off' },
        {
          label: '"resistance" here, V/I',
          value: Math.abs(opI) > 1e-12 ? si(opV / opI, 'Ω') : 'undefined',
        },
      ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {rung === 0 && predictChoice === null && (
        <PredictGate
          prompt="**Before it is plotted:** what shape is the forward part of a diode's I–V graph? Most sketches have a flat stretch and then a sharp corner at 0.7 V."
          options={[
            'Flat, then a sharp corner, then a straight steep line',
            'A smooth exponential with no corner anywhere in it',
            'A straight line through the origin, like a resistor',
            'Flat at zero until 0.7 V, then vertical',
          ]}
          answerIndex={1}
          reveal={
            'A smooth exponential. The corner you have drawn is real on a linear axis, but it is a property '
            + 'of the AXIS, not of the diode — and the toggle below proves it.'
          }
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      <Stage>
        <Canvas
          box={box}
          label={`Diode current against bias voltage for ${d.material.label}, on a ${logAxis ? 'logarithmic' : 'linear'} current axis.`}
        >
          <IVPlot
            box={box}
            curve={curve}
            iMax={iMax}
            logAxis={logAxis}
            vMin={vMin}
            vMax={vMax}
            knee={d.knee}
            loadLine={rung >= 3 ? { supply, load } : null}
            op={rung >= 3 ? { v: opV, i: opI } : null}
            visible={rung >= 1}
          />
        </Canvas>
        <TickStrip box={box} ticks={ticks(vMin, vMax, 6)} format={(v) => fixed(v, 1)} unit="bias, V" />
      </Stage>

      <Legend rows={[
        { color: A1, label: logAxis ? 'current (logarithmic axis)' : 'current (linear axis)', value: logAxis ? '' : si(iMax, 'A') },
        ...(rung >= 3 ? [
          { color: A2, dashed: true, label: 'load line — what the resistor allows' },
          { color: A2, dot: true, label: 'operating point', value: si(opI, 'A') },
        ] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={A2}
          disabled={rung >= 3 || (rung === 0 && predictChoice === null)}
          onClick={() => setRung((r) => Math.min(3, r + 1))}
        >
          {rung === 0 ? 'Plot the real curve'
            : rung === 1 ? 'Look at the reverse side'
              : rung === 2 ? 'Put it in a circuit' : 'All three shown'}
        </ActionButton>
        {rung > 0 && (
          <ActionButton onClick={() => { setRung(0); setLogAxis(false); setPredictChoice(null); setEverLog(false); }}>
            Start again
          </ActionButton>
        )}
        <Toggle
          on={logAxis}
          label="Logarithmic current axis"
          onClick={() => { setLogAxis((v) => !v); setEverLog(true); }}
          accent={A2}
          disabled={rung < 1}
        />
      </div>

      {rung >= 1 && logAxis && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            The corner has gone
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            A straight line, from picoamps to amps. The current multiplies by ten for every{' '}
            <b className="tabular-nums">{si(voltsPerDecade(d), 'V')}</b> — that is 2.303·V_T, and it is the
            same for every silicon diode ever made because it depends only on temperature. The knee was
            never in the diode. It was in your linear axis.
          </p>
        </Card>
      )}

      {rung >= 1 && !logAxis && (
        <Card tone="accent">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
            There is the corner, at about <b>{fixed(d.knee, 2)} V</b>. Now look hard at the &ldquo;flat&rdquo;
            part below it: it is not flat, it is a very small exponential — at 0.4 V the current is{' '}
            <b className="tabular-nums">{si(shockleyCurrent(d, 0.4), 'A')}</b>, which is not zero, it is just
            invisible next to {si(iMax, 'A')}. Switch the axis and watch the corner disappear.
          </p>
        </Card>
      )}

      {rung >= 3 && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            Two routes to one number
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            Graphically, the answer is where the diode curve crosses the load line. Algebraically, the
            nodal solver puts the operating current at{' '}
            <b className="tabular-nums" style={{ color: A2 }}>{si(opI, 'A')}</b> with{' '}
            <b className="tabular-nums">{fixed(opV, 3)} V</b> across the diode. Same point. And notice what
            &ldquo;resistance&rdquo; does here: <b>{Math.abs(opI) > 1e-12 ? si(opV / opI, 'Ω') : '—'}</b> at
            this current, and something completely different at any other — which is what non-ohmic means.
          </p>
        </Card>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold" style={{ color: A1 }}>Diode material</span>
          <Choice options={['Si', 'Ge']} value={materialName} onChange={setMaterialName} />
        </div>
        {rung >= 3 && (
          <>
            <SimSlider
              label="Supply"
              value={supply}
              min={-10}
              max={12}
              step={0.5}
              accent={A2}
              onChange={setSupply}
              format={(v) => v.toFixed(1)}
              unit="V"
            />
            <SimSlider
              label="Series resistor"
              value={load}
              min={100}
              max={10000}
              step={100}
              onChange={setLoad}
              format={(v) => si(v, '')}
              unit="Ω"
            />
          </>
        )}
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <ModelNote>
        I_S is not looked up — it is calibrated so the curve passes through 1 mA at this material&apos;s cut-in
        voltage, with an ideality factor of 1. That gives {si(saturationCurrent(d), 'A')}, which is the right
        order of magnitude, and it reproduces the real qualitative fact that germanium leaks far more in
        reverse than silicon does. The exact ratio between the two is not a claim; the direction is.
      </ModelNote>
    </div>
  );
}

// ── the plot ─────────────────────────────────────────────────────────────────

function IVPlot({ box, curve, iMax, logAxis, vMin, vMax, knee, loadLine, op, visible }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  curve: { v: number; i: number }[];
  iMax: number;
  logAxis: boolean;
  vMin: number;
  vMax: number;
  knee: number;
  loadLine: { supply: number; load: number } | null;
  op: { v: number; i: number } | null;
  visible: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(vMin, vMax, x, x + w);

  /**
   * Two current mappings, and the toggle between them is the whole lesson.
   *
   * Linear: zero sits near the bottom, so the reverse branch has a sliver and the
   * forward branch has the rest — which is what makes the knee look like a corner.
   * Symmetric log: linear within ±1 pA of zero, logarithmic outside, so fifteen
   * decades AND the sign change fit on one axis. A plain log axis cannot show a
   * negative current at all, which is why it is symmetric.
   */
  const slog = symlog(1e-12, 15);
  const py = logAxis
    ? (i: number) => y + h - ((slog(i) + 1) / 2) * h
    : axis(-iMax * 0.06, iMax * 1.06, y + h, y);

  const zeroY = py(0);
  const gridX = ticks(vMin, vMax, 6).map(px);
  const gridY = logAxis
    ? [-1e-3, -1e-9, 0, 1e-9, 1e-6, 1e-3].map(py)
    : ticks(0, iMax, 4).map(py);

  const path = polyline(curve, (p) => px(p.v), (p) => py(p.i));

  // Load line: I = (V_supply − V)/R, a straight line from (V_supply, 0) to
  // (0, V_supply/R). Drawn in device coordinates so its intersection with the
  // curve IS the operating point rather than being placed there.
  const ll = loadLine
    ? [
      { v: loadLine.supply, i: 0 },
      { v: vMin, i: (loadLine.supply - vMin) / loadLine.load },
    ]
    : null;

  return (
    <g>
      <Axes box={box} gridX={gridX} gridY={gridY} zeroY={zeroY} />

      {/* The knee voltage, marked — so "0.7 V" has a place on the picture. */}
      <line x1={px(knee)} y1={y} x2={px(knee)} y2={y + h} stroke={`${A2}66`} strokeWidth={1.2} strokeDasharray="4 4" />

      {visible && <path d={path} fill="none" stroke={A1} strokeWidth={2.6} />}

      {ll && (
        <line
          x1={px(ll[0].v)} y1={py(ll[0].i)} x2={px(ll[1].v)} y2={py(ll[1].i)}
          stroke={A2} strokeWidth={1.8} strokeDasharray="6 4"
        />
      )}

      {op && (
        <circle
          cx={px(op.v)} cy={py(op.i)}
          r={Math.max(3.5, Math.min(6, Math.min(box.width, box.height) * 0.016))}
          fill={A2}
        />
      )}
    </g>
  );
}
