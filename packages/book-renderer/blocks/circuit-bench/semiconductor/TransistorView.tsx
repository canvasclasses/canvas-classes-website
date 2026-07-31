'use client';

/*
 * semiconductor/TransistorView.tsx — β, and where it stops applying.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * I_C = βI_B is printed as a law and then used until it breaks. What is never shown
 * is the CEILING: once V_CE has fallen to about 0.2 V there is no field left to
 * sweep carriers across the base, so the collector cannot take βI_B whatever
 * arrives at the base. The measurable signature is that the EFFECTIVE β — I_C
 * divided by I_B, computed rather than assumed — falls below the rated value and
 * keeps falling.
 *
 * So this view plots the transfer curve, marks the operating point, and prints the
 * effective β beside the rated one. Push into saturation and they separate. That
 * separation is the whole difference between a switch and an amplifier, on one
 * curve: the flat ends are where a switch lives, the slope between them is where an
 * amplifier lives.
 *
 * ── Two independent routes to the base current ──────────────────────────────
 * The base loop is an ordinary linear circuit — V_BB, R_B and a 0.7 V junction — so
 * it goes through the FROZEN E3 nodal solver. The closed form (V_BB − V_BE)/R_B is
 * computed separately. Both are displayed; they agree, and the verifier asserts it.
 * A three-terminal element cannot be represented in the frozen contract at all
 * (reported), so the collector side is closed form — and cross-checking the half
 * that CAN go through the solver is how a sign error in the other half gets caught.
 *
 * ZERO `<text>` on the canvas. Guided, never auto-playing.
 */

import * as React from 'react';
import {
  activeWindow, gainOf, solveTransistor, transferCurve, type TransistorSpec,
} from './lib/transistor';
import { solveCircuit } from '../lib/solve';
import { axis, polyline, ticks } from './lib/view';
import { si, fixed } from './lib/format';
import {
  A1, A2, ActionButton, AttackCard, Axes, Canvas, Card, Legend, ModelNote, PredictGate,
  Pill, Readout, Stage, TickStrip, Toggle, boxFor, type ReadoutRow,
} from './parts';
import type { SemiconductorArchetype, SemiconductorScene } from '../archetypes.semiconductor';
import { SimSlider, TEXT } from '../../simulations/_shared';
import { stageHeightFor } from './stage';

export default function TransistorView({ scene, arch, stageW, stacked }: {
  scene: SemiconductorScene;
  arch: SemiconductorArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const t0 = scene.transistor;
  const amplifier = arch.id === 'transistor-amplifier';

  const [beta, setBeta] = React.useState(t0?.beta ?? 100);
  const [vbb, setVbb] = React.useState(t0?.vbb ?? (amplifier ? 1.4 : 0));
  const [rb, setRb] = React.useState(t0?.rb ?? 100000);
  const [vcc, setVcc] = React.useState(t0?.vcc ?? 12);
  const [rc, setRc] = React.useState(t0?.rc ?? 2200);
  const [swing, setSwing] = React.useState(0.2);
  const [showSwing, setShowSwing] = React.useState(amplifier);
  const [rung, setRung] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);
  const [everMoved, setEverMoved] = React.useState(false);

  const t: TransistorSpec = { beta, vbeOn: 0.7, vceSat: 0.2, vbb, rb, vcc, rc, label: 'Q1' };
  const state = React.useMemo(() => solveTransistor(t), [beta, vbb, rb, vcc, rc]);
  const gain = React.useMemo(() => gainOf(t, state), [t, state]);
  const curve = React.useMemo(() => transferCurve(t, Math.max(6, vbb * 1.4)), [beta, rb, vcc, rc, vbb]);
  const win = activeWindow(t);

  /** The frozen nodal solver's answer for the SAME base loop. Two routes, one
   *  number — see the file header. */
  const mnaIb = React.useMemo(() => {
    const sol = solveCircuit(scene.circuit);
    return sol.singular ? Number.NaN : (sol.currents.RB ?? 0);
  }, [scene.circuit]);

  const hi = solveTransistor({ ...t, vbb: vbb + swing });
  const lo = solveTransistor({ ...t, vbb: Math.max(0, vbb - swing) });
  const measuredGain = swing > 0 ? (hi.vce - lo.vce) / (2 * swing) : 0;

  const w = Math.max(240, stageW || 320);
  const h = stageHeightFor(w, stacked ? 0.66 : 0.54, 340, 220);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  const evidence = everMoved && rung >= 2;

  const rows: ReadoutRow[] = [
    { label: 'rated β', value: fixed(beta, 0), color: A1 },
    { label: 'V_BE needed', value: '0.70 V' },
    { label: 'base current I_B', value: si(state.ib, 'A'), color: A1 },
    ...(rung >= 1
      ? [
        { label: 'the nodal solver agrees', value: si(mnaIb, 'A') },
        { label: 'collector current I_C', value: si(state.ic, 'A'), color: A2, strong: true },
        { label: 'emitter current I_E = I_B + I_C', value: si(state.ie, 'A') },
        { label: 'V_CE', value: `${fixed(state.vce, 3)} V`, color: A2, strong: true },
        { label: 'region', value: state.region, color: A2, strong: true },
        { label: 'EFFECTIVE β, measured as I_C/I_B', value: fixed(state.betaEffective, 1), color: state.region === 'saturation' ? A2 : A1, strong: true },
        { label: 'α = I_C/I_E', value: fixed(state.alpha, 5) },
        { label: 'base current to just saturate', value: si(state.ibSaturation, 'A') },
        { label: 'overdrive', value: `${fixed(state.overdrive, 2)}×`, color: A2 },
        { label: 'power in the transistor', value: si(state.power, 'W') },
      ]
      : []),
    ...(rung >= 2 && amplifier
      ? [
        { label: 'gain −βR_C/R_B', value: fixed(gain.dcGain, 3), color: A2, strong: true },
        { label: 'gain you just measured', value: fixed(measuredGain, 3), color: A2 },
        { label: 'transconductance g_m = I_C/V_T', value: si(gain.gm, 'S') },
        { label: 'intrinsic gain −g_m·R_C', value: fixed(gain.intrinsicGain, 1) },
        { label: 'active window on V_BB', value: `${fixed(win.from, 2)} to ${fixed(win.to, 2)} V` },
      ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-3">
      {rung === 0 && predictChoice === null && (
        <PredictGate
          prompt={amplifier
            ? '**Before you touch anything:** nudge the base voltage UP by a few millivolts. Does the collector voltage go up or down?'
            : '**Before you touch anything:** V_BB is 0, so nothing flows. The base-emitter junction is a diode. What has to happen before ANY base current flows?'}
          options={amplifier
            ? ['Up — more input gives more output',
              'Down — more collector current means a bigger drop across R_C',
              'It does not move — the bias sets it',
              'Up, then down, depending on β']
            : ['Any voltage at all will do — it is a transistor, not a diode',
              'V_BB must exceed about 0.7 V',
              'V_BB must exceed V_CC',
              'It depends on β']}
          answerIndex={1}
          reveal={amplifier
            ? 'Down. More base current means more collector current means a bigger drop across R_C, so less is left for the collector. A common-emitter stage always inverts, and the minus sign in the gain is that geometry, not a convention.'
            : 'About 0.7 V. Below that the base-emitter junction is simply off, so no base current flows, and with no base current there is no collector current either — that is cutoff.'}
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      <Stage>
        <Canvas box={box} label="Collector voltage against base supply voltage, with the operating point marked.">
          <TransferPlot
            box={box}
            curve={curve}
            vcc={vcc}
            vceSat={0.2}
            vbb={vbb}
            vce={state.vce}
            win={win}
            swing={showSwing && rung >= 2 ? swing : 0}
            visible={rung >= 1}
          />
        </Canvas>
        <TickStrip
          box={box}
          ticks={ticks(0, Math.max(6, vbb * 1.4), 6)}
          format={(v) => fixed(v, 1)}
          unit="base supply V_BB, V"
        />
      </Stage>

      <Legend rows={[
        { color: A2, label: 'collector voltage V_CE' },
        { color: TEXT.muted, dashed: true, label: 'the two rails', value: `${fixed(vcc, 1)} V and 0.20 V` },
        ...(rung >= 1 ? [{ color: A1, dashed: true, label: 'the active window — the useful slope' }] : []),
        ...(showSwing && rung >= 2 ? [{ color: A2, dot: true, label: 'your input swing, and what it does to the output' }] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton
          accent={A2}
          disabled={rung >= 3 || (rung === 0 && predictChoice === null)}
          onClick={() => setRung((r) => Math.min(3, r + 1))}
        >
          {rung === 0 ? 'Plot the transfer curve'
            : rung === 1 ? (amplifier ? 'Measure the gain' : 'Drive it into saturation')
              : rung === 2 ? 'Compare the two β values' : 'All three shown'}
        </ActionButton>
        {rung > 0 && (
          <ActionButton onClick={() => { setRung(0); setPredictChoice(null); setEverMoved(false); }}>Start again</ActionButton>
        )}
        {amplifier && rung >= 2 && (
          <Toggle on={showSwing} label="Show the input swing" onClick={() => setShowSwing((v) => !v)} accent={A2} />
        )}
        <Pill tone={state.region === 'active' ? 'ok' : state.region === 'saturation' ? 'info' : 'bad'}>
          {state.region}
        </Pill>
      </div>

      {rung >= 1 && (
        <Card tone={state.region === 'saturation' ? 'second' : 'accent'}>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            What the transistor is doing
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>{state.explanation}</p>
        </Card>
      )}

      {rung >= 2 && !amplifier && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            β is a ratio, not an amount of gain
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            β = {fixed(beta, 0)} means {fixed(beta, 0)} carriers cross the base for every one that
            recombines in it — <b>{fixed((beta / (beta + 1)) * 100, 2)}%</b> get through. That is a fact about
            how thin and how lightly doped the base is, which is why β varies three to one between parts on
            the same reel and drifts with temperature. Right now the EFFECTIVE β is{' '}
            <b className="tabular-nums" style={{ color: A2 }}>{fixed(state.betaEffective, 1)}</b>
            {state.region === 'saturation'
              ? ' — well below the rating, because the collector has run out of voltage to work with.'
              : ' — equal to the rating, because there is still field left to sweep with.'}
          </p>
        </Card>
      )}

      {rung >= 2 && amplifier && (
        <Card tone="second">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: A2 }}>
            Two gains, two questions
          </div>
          <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
            You measured <b className="tabular-nums" style={{ color: A2 }}>{fixed(measuredGain, 2)}</b> by
            nudging V_BB, and −βR_C/R_B predicts{' '}
            <b className="tabular-nums">{fixed(gain.dcGain, 2)}</b>. Both answer &ldquo;what does THIS
            CIRCUIT do&rdquo;, and R_B divides the input down before the transistor sees it. What the
            TRANSISTOR does is −g_m·R_C ={' '}
            <b className="tabular-nums">{fixed(gain.intrinsicGain, 0)}</b> — about{' '}
            {fixed(Math.abs(gain.intrinsicGain / (gain.dcGain || 1)), 0)} times larger, and that is the number
            a real amplifier is designed around once the base is driven from a low-impedance source.
          </p>
        </Card>
      )}

      {gain.clipped && rung >= 2 && (
        <Card tone="bad">
          <p className="text-sm leading-snug" style={{ color: TEXT.primary }}>{gain.note}</p>
        </Card>
      )}

      <Readout rows={rows} />

      <div className="flex flex-col gap-2.5">
        <SimSlider
          label="Base supply V_BB"
          value={vbb}
          min={0}
          max={12}
          step={0.02}
          accent={A2}
          onChange={(v) => { setVbb(v); setEverMoved(true); }}
          format={(v) => v.toFixed(2)}
          unit="V"
        />
        <SimSlider label="β" value={beta} min={20} max={300} step={5} onChange={(v) => { setBeta(v); setEverMoved(true); }} format={(v) => v.toFixed(0)} />
        <SimSlider label="R_B" value={rb / 1000} min={1} max={1000} step={1} onChange={(v) => { setRb(v * 1000); setEverMoved(true); }} format={(v) => v.toFixed(0)} unit="kΩ" />
        <SimSlider label="V_CC" value={vcc} min={3} max={24} step={0.5} onChange={(v) => { setVcc(v); setEverMoved(true); }} format={(v) => v.toFixed(1)} unit="V" />
        <SimSlider label="R_C" value={rc / 1000} min={0.1} max={22} step={0.1} onChange={(v) => { setRc(v * 1000); setEverMoved(true); }} format={(v) => v.toFixed(1)} unit="kΩ" />
        {amplifier && rung >= 2 && (
          <SimSlider
            label="Input swing"
            value={swing}
            min={0.01}
            max={2}
            step={0.01}
            accent={A2}
            onChange={(v) => { setSwing(v); setEverMoved(true); }}
            format={(v) => v.toFixed(2)}
            unit="V"
          />
        )}
      </div>

      {evidence && <AttackCard code={arch.targets} />}

      <ModelNote>
        The base loop — V_BB, R_B and the 0.7 V base-emitter junction — is an ordinary linear circuit and goes
        through the same nodal solver as every other circuit in this engine; that is where the second I_B
        figure comes from, and it agrees with (V_BB − 0.7)/R_B to the last digit. The collector side is closed
        form, because a three-terminal element cannot be expressed in this engine&apos;s two-terminal
        component contract at all — and faking a current source with a battery behind a huge resistor would
        wreck the matrix conditioning the solver exists to protect.
      </ModelNote>
    </div>
  );
}

// ── the transfer curve ───────────────────────────────────────────────────────

function TransferPlot({ box, curve, vcc, vceSat, vbb, vce, win, swing, visible }: {
  box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } };
  curve: { vbb: number; vce: number; ic: number; region: string }[];
  vcc: number;
  vceSat: number;
  vbb: number;
  vce: number;
  win: { from: number; to: number };
  swing: number;
  visible: boolean;
}) {
  const { x, y, w, h } = box.rect;
  const xMax = curve.length ? curve[curve.length - 1].vbb : 6;
  const px = axis(0, xMax, x, x + w);
  const py = axis(0, vcc * 1.1, y + h, y);

  const gridX = ticks(0, xMax, 6).map(px);
  const gridY = ticks(0, vcc, 5).map(py);

  return (
    <g>
      <Axes box={box} gridX={gridX} gridY={gridY} />

      {/* The two rails the output can never cross. */}
      <line x1={x} y1={py(vcc)} x2={x + w} y2={py(vcc)} stroke={TEXT.muted} strokeWidth={1.3} strokeDasharray="5 4" />
      <line x1={x} y1={py(vceSat)} x2={x + w} y2={py(vceSat)} stroke={TEXT.muted} strokeWidth={1.3} strokeDasharray="5 4" />

      {/* The active window — the only part of the curve an amplifier can use. */}
      {visible && (
        <rect
          x={px(win.from)} y={y} width={Math.max(1, px(Math.min(win.to, xMax)) - px(win.from))} height={h}
          fill={`${A1}12`} stroke={A1} strokeWidth={1} strokeDasharray="4 4"
        />
      )}

      {visible && (
        <path d={polyline(curve, (p) => px(p.vbb), (p) => py(p.vce))} fill="none" stroke={A2} strokeWidth={2.8} />
      )}

      {/* The input swing, and the output swing it produces — the gain, drawn. */}
      {visible && swing > 0 && (() => {
        const lo = Math.max(0, vbb - swing);
        const hiV = Math.min(xMax, vbb + swing);
        const pick = (v: number) => curve.reduce((b, q) => (Math.abs(q.vbb - v) < Math.abs(b.vbb - v) ? q : b), curve[0]);
        const a = pick(lo);
        const b = pick(hiV);
        return (
          <g>
            <line x1={px(lo)} y1={py(a.vce)} x2={px(hiV)} y2={py(b.vce)} stroke={A2} strokeWidth={1.6} strokeDasharray="3 3" />
            <line x1={px(lo)} y1={y + h} x2={px(lo)} y2={py(a.vce)} stroke={`${A2}66`} strokeWidth={1} />
            <line x1={px(hiV)} y1={y + h} x2={px(hiV)} y2={py(b.vce)} stroke={`${A2}66`} strokeWidth={1} />
            <circle cx={px(lo)} cy={py(a.vce)} r={4} fill={A2} />
            <circle cx={px(hiV)} cy={py(b.vce)} r={4} fill={A2} />
          </g>
        );
      })()}

      {visible && (
        <g>
          <line x1={px(vbb)} y1={y} x2={px(vbb)} y2={y + h} stroke={A2} strokeWidth={1.3} />
          <circle cx={px(vbb)} cy={py(vce)} r={5.5} fill={A2} />
        </g>
      )}
    </g>
  );
}
