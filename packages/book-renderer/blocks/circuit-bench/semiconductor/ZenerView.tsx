'use client';

/*
 * semiconductor/ZenerView.tsx — a diode that is useful because it broke.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * "The Zener holds the voltage constant" is what a textbook says. What it cannot
 * show is the MECHANISM, which is a current bookkeeping: the series resistor sets a
 * total current from the surplus voltage, the load takes what it needs, and the
 * Zener swallows the difference. Change the load and the Zener current moves by
 * exactly the amount the load current moved — in the opposite direction.
 *
 * So this view plots the transfer characteristic (V_out against V_in) AND the three
 * currents side by side, every one of them from the frozen nodal solver at each
 * supply voltage. The flat part of the transfer curve is where the Zener is in
 * breakdown; the sloping part is where it is simply off and the circuit is a plain
 * divider. Both regions are reachable, and the drop-out point is where the lesson is.
 *
 * ZERO `<text>` on the canvas. Guided, never auto-playing.
 */

import * as React from 'react';
import { solveDiodeCircuit, withSourceEmf } from './lib/solveDiode';
import { explainState, type DiodeState } from './lib/diode';
import { axis, polyline, ticks } from './lib/view';
import { si, fixed } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Legend, ModelNote, PredictGate,
  Readout, Stage, TickStrip, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

interface SweepPoint {
  vIn: number;
  vOut: number;
  iTotal: number;
  iZener: number;
  iLoad: number;
  state: DiodeState;
}

export default function ZenerView({ scene, arch, stageW, stacked }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const dz = scene.diodes[0];
  const spec = scene.zener;
  const [supply, setSupply] = React.useState(12);
  const [series, setSeries] = React.useState(spec?.seriesOhms ?? 470);
  const [load, setLoad] = React.useState(spec?.loadOhms ?? 1000);
  const [rung, setRung] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);
  const [everMoved, setEverMoved] = React.useState(false);

  const base = React.useMemo(() => ({
    ...scene.circuit,
    components: scene.circuit.components.map((c) => (
      c.id === 'RS' ? { ...c, value: series }
        : c.id === 'RL' ? { ...c, value: load } : c
    )),
  }), [scene.circuit, series, load]);

  /** One solve per supply voltage, from the frozen engine — the flat part of the
   *  curve is a RESULT, not a drawn horizontal line. */
  const sweep: SweepPoint[] = React.useMemo(() => {
    const out: SweepPoint[] = [];
    for (let k = 0; k <= 120; k++) {
      const vIn = (24 * k) / 120;
      const sol = solveDiodeCircuit(withSourceEmf(base, 'VS', vIn), [dz]);
      const vOut = sol.solution.potentials.out ?? 0;
      out.push({
        vIn,
        vOut,
        iTotal: sol.solution.currents.RS ?? 0,
        // Current a→b on the Zener is gnd→out; in breakdown it flows the other
        // way, so the Zener current a student would measure is the negative of it.
        iZener: -(sol.currents[dz.id] ?? 0),
        iLoad: sol.solution.currents.RL ?? 0,
        state: (sol.states[dz.id] ?? 'off') as DiodeState,
      });
    }
    return out;
  }, [base, dz]);

  const now = React.useMemo(() => {
    const sol = solveDiodeCircuit(withSourceEmf(base, 'VS', supply), [dz]);
    return {
      vOut: sol.solution.potentials.out ?? 0,
      iTotal: sol.solution.currents.RS ?? 0,
      iZener: -(sol.currents[dz.id] ?? 0),
      iLoad: sol.solution.currents.RL ?? 0,
      state: (sol.states[dz.id] ?? 'off') as DiodeState,
      warnings: sol.warnings,
    };
  }, [base, dz, supply]);

  /** The supply below which regulation fails — computed from the sweep, not from a
   *  formula that would hide the interaction with the load. */
  const dropOut = React.useMemo(() => {
    const first = sweep.find((p) => p.state === 'breakdown');
    return first ? first.vIn : null;
  }, [sweep]);

  const w = Math.max(240, stageW || 320);
  const h = stageHeightFor(w, stacked ? 0.62 : 0.5, 330, 210);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  const evidence = everMoved && rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'Zener rating', value: `${fixed(dz.breakdown, 2)} V, slope ${si(dz.zenerResistance, 'Ω')}`, color: A1 },
    { label: 'unregulated supply', value: `${fixed(supply, 1)} V` },
    { label: 'series resistor R_S', value: si(series, 'Ω') },
    { label: 'load', value: si(load, 'Ω') },
    { label: 'output', value: `${fixed(now.vOut, 4)} V`, color: A2, strong: true },
    { label: 'the Zener is', value: now.state === 'breakdown' ? 'in breakdown — regulating' : now.state === 'forward' ? 'forward biased — check the polarity' : 'off — NOT regulating', color: now.state === 'breakdown' ? A2 : A1 },
    ...(rung >= 1
      ? [
        { label: 'total current through R_S', value: si(now.iTotal, 'A'), color: A1 },
        { label: 'load current', value: si(now.iLoad, 'A'), color: A1 },
        { label: 'Zener current — the surplus', value: si(now.iZener, 'A'), color: A2, strong: true },
        { label: 'they add up', value: `${si(now.iLoad, 'A')} + ${si(now.iZener, 'A')} = ${si(now.iLoad + now.iZener, 'A')}` },
        { label: 'dropped across R_S', value: `${fixed(supply - now.vOut, 3)} V` },
        { label: 'power in the Zener', value: si(now.vOut * Math.max(now.iZener, 0), 'W'), color: A2 },
      ]
      : []),
    ...(dropOut != null && rung >= 2
      ? [{ label: 'regulation starts at', value: `${fixed(dropOut, 2)} V of supply`, color: A2, strong: true }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {rung === 0 && predictChoice === null && (
        <PredictGate
          prompt={`A ${fixed(dz.breakdown, 1)} V Zener across the load, reverse biased, fed through ${si(series, 'Ω')}. **Raise the supply from 12 V to 20 V. What does the output do?**`}
          options={[
            'Rises proportionally, like a resistor divider',
            'Stays at about 6.2 V — the extra volts go across R_S',
            'Rises a little, to about 8 V',
            'Falls, because the Zener conducts harder',
          ]}
          answerIndex={1}
          reveal={
            'It does not move. Every extra volt is dropped across R_S, and the extra current that produces '
            + 'goes through the Zener, not the load. That is the whole mechanism: the Zener is a shunt that '
            + 'swallows the surplus.'
          }
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      <Stage>
        <Canvas box={box} label="Regulated output against unregulated supply voltage, with the three currents.">
          <TransferPlot
            box={box}
            sweep={sweep}
            zener={dz.breakdown}
            supply={supply}
            showCurrents={rung >= 1}
          />
        </Canvas>
        <TickStrip box={box} ticks={ticks(0, 24, 6)} format={(v) => fixed(v, 0)} unit="unregulated supply, V" />
      </Stage>

      <Legend rows={[
        { color: A2, label: 'output voltage' },
        { color: TEXT.muted, dashed: true, label: 'the Zener rating', value: `${fixed(dz.breakdown, 2)} V` },
        ...(rung >= 1 ? [
          { color: A1, dashed: true, label: 'load current — flat once regulating' },
          { color: A1, label: 'Zener current — takes up the surplus' },
        ] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={A2}
          disabled={rung >= 3 || (rung === 0 && predictChoice === null)}
          onClick={() => setRung((r) => Math.min(3, r + 1))}
        >
          {rung === 0 ? 'Sweep the supply'
            : rung === 1 ? 'Split the current three ways'
              : rung === 2 ? 'Find where regulation fails' : 'All three shown'}
        </ActionButton>
        {rung > 0 && (
          <ActionButton onClick={() => { setRung(0); setPredictChoice(null); setEverMoved(false); }}>Start again</ActionButton>
        )}
      </div>

      {rung >= 1 && (
        <Card tone="accent">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            The mechanism is a current bookkeeping
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            R_S sets a total current from the surplus voltage. The load takes what it needs. The Zener
            swallows the difference — and it is the difference, exactly:{' '}
            <b className="tabular-nums">{si(now.iLoad, 'A')}</b> +{' '}
            <b className="tabular-nums" style={{ color: A2 }}>{si(now.iZener, 'A')}</b> ={' '}
            <b className="tabular-nums">{si(now.iTotal, 'A')}</b>. Change the load and watch the Zener
            current move by the same amount the other way.
          </p>
        </Card>
      )}

      {rung >= 2 && dropOut != null && (
        <Card tone="second">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>
            Below <b className="tabular-nums">{fixed(dropOut, 2)} V</b> of supply the output stops being
            {' '}{fixed(dz.breakdown, 1)} V and starts following the supply. The Zener has fallen out of
            breakdown, so it is simply off and the circuit is a plain resistor divider. A regulator needs
            HEADROOM — and notice the drop-out point moves when you change the load, because a heavier load
            takes more of the current R_S can supply.
          </p>
        </Card>
      )}

      {now.state !== 'breakdown' && rung >= 1 && (
        <Card tone="bad">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>{explainState(dz, now.state)}</p>
        </Card>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <SimSlider
          label="Supply"
          value={supply}
          min={2}
          max={24}
          step={0.2}
          accent={A2}
          onChange={(v) => { setSupply(v); setEverMoved(true); }}
          format={(v) => v.toFixed(1)}
          unit="V"
        />
        <SimSlider
          label="Series R_S"
          value={series}
          min={100}
          max={4700}
          step={10}
          onChange={(v) => { setSeries(v); setEverMoved(true); }}
          format={(v) => si(v, '')}
          unit="Ω"
        />
        <SimSlider
          label="Load"
          value={load}
          min={200}
          max={20000}
          step={100}
          onChange={(v) => { setLoad(v); setEverMoved(true); }}
          format={(v) => si(v, '')}
          unit="Ω"
        />
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <ModelNote>
        The output sits a little above the {fixed(dz.breakdown, 2)} V rating rather than exactly on it, and
        that is not an error — a real Zener has a few ohms of slope resistance, so its voltage rises slightly
        with current. Take R_S out and the current is limited by nothing at all: an ordinary diode dies in
        reverse breakdown from POWER, not from voltage, and so would this one.
      </ModelNote>
    </div>
  );
}

// ── the transfer plot ────────────────────────────────────────────────────────

function TransferPlot({ box, sweep, zener, supply, showCurrents }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  sweep: SweepPoint[];
  zener: number;
  supply: number;
  showCurrents: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(0, 24, x, x + w);
  const vMax = Math.max(...sweep.map((p) => p.vOut), zener) * 1.35;
  const py = axis(0, vMax, y + h, y);

  const iMax = Math.max(...sweep.map((p) => Math.max(p.iZener, p.iLoad)), 1e-9);
  const pyI = axis(0, iMax * 1.15, y + h, y);

  const gridX = ticks(0, 24, 6).map(px);
  const gridY = ticks(0, vMax, 5).map(py);

  return (
    <g>
      <Axes box={box} gridX={gridX} gridY={gridY} />

      <line x1={x} y1={py(zener)} x2={x + w} y2={py(zener)} stroke={TEXT.muted} strokeWidth={1.4} strokeDasharray="5 4" />

      {showCurrents && (
        <>
          <path
            d={polyline(sweep, (p) => px(p.vIn), (p) => pyI(p.iLoad))}
            fill="none" stroke={A1} strokeWidth={1.6} strokeDasharray="6 4"
          />
          <path
            d={polyline(sweep, (p) => px(p.vIn), (p) => pyI(Math.max(p.iZener, 0)))}
            fill="none" stroke={A1} strokeWidth={1.8}
          />
        </>
      )}

      <path d={polyline(sweep, (p) => px(p.vIn), (p) => py(p.vOut))} fill="none" stroke={A2} strokeWidth={2.8} />

      {(() => {
        const p = sweep.reduce((best, q) => (Math.abs(q.vIn - supply) < Math.abs(best.vIn - supply) ? q : best), sweep[0]);
        return (
          <g>
            <line x1={px(p.vIn)} y1={y} x2={px(p.vIn)} y2={y + h} stroke={A2} strokeWidth={1.3} />
            <circle cx={px(p.vIn)} cy={py(p.vOut)} r={5} fill={A2} />
          </g>
        );
      })()}
    </g>
  );
}
