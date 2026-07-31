'use client';

/*
 * circuit-bench/ac/MachineBench.tsx — the transformer and the grid.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two rungs, one component, because they are one argument: a transformer trades
 * volts for amps at constant product, and the grid exists BECAUSE of that trade.
 *
 * ── THE TWO POWER ROWS, AGAIN, AND ON PURPOSE ───────────────────────────────
 * A student who has learnt "step-up" concludes that a transformer creates power.
 * The only cure is putting the primary and secondary powers side by side and
 * letting them be equal. So `transformerState` always reports both, and the
 * causality is enforced in the model: the turns fix V_s, the LOAD fixes I_s, and
 * only then is I_p whatever is needed to supply it. A model that computed I_p
 * from the ratio first would give identical numbers and teach the wrong story —
 * and would break the moment the load changed.
 *
 * ── THE GRID IS ONE INVERSE SQUARE ──────────────────────────────────────────
 * loss = I²R and I = P/V, so loss = P²R/V². Ten times the voltage is a hundredth
 * of the loss. The bar chart makes the two-decade drop visible at three
 * voltages at once, and the "thicken the cables instead" comparison is what turns
 * it from a fact into a decision — copper is linear and expensive, voltage is
 * quadratic and cheap.
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
  lineLoss, lossScaling, transformerState, transmissionState, turnsRatio,
} from './lib/transformer';
import { acSetup } from './lib/setup';
import {
  A_I, A_V, AcCard, ActionButton, GuidedPanel, Legend, ModelNote, NumericPanel,
  PlotKey, PredictGate, Readout, Slider, type LegendRow, type ReadoutRow,
} from './ui';

type Bag = Record<string, number | string | boolean>;

export default function MachineBench({ block, archetypeId }:
  { block: CircuitBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = AC_ARCHETYPES[archetypeId] ?? AC_ARCHETYPES['transformer-turns-ratio'];
  const isGrid = archetypeId === 'transmission-at-high-voltage';

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return acSetup(isGrid ? 'transmission' : 'transformer',
      { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, isGrid, paramsKey, overrides]);

  const script = React.useMemo(() => {
    const a = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return a?.length ? a : (archetype.defaultSteps ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, stepsKey]);
  const predict = React.useMemo(
    () => JSON.parse(predictKey) as CircuitBenchBlock['predict'], [predictKey],
  );

  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [sawBothPowers, setSawBothPowers] = React.useState(false);

  const tf = transformerState(setup.transformer);
  const tx = transmissionState(setup.transmission.demand, setup.transmission.voltage, setup.transmission.resistance);

  const revealed = guided ? stage : script.length;
  const showSecond = revealed >= 1 || !guided;
  const showPowers = revealed >= 2 || !guided;
  const showAll = revealed >= 3 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  React.useEffect(() => { if (showPowers) setSawBothPowers(true); }, [showPowers]);

  const cardCode = archetype.targets;
  const card = cardCode ? issueFor(cardCode) : null;
  const evidenceMet = cardCode === 'transformer_creates_power' ? sawBothPowers : showPowers;

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isStacked(stageW);
  const boardW = Math.max(220, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = Math.max(210, Math.min(block.height ?? 320, Math.round(boardW * 0.50)));

  // ── Readouts ──────────────────────────────────────────────────────────────
  const rows: ReadoutRow[] = [];
  if (!isGrid) {
    rows.push({ label: 'Turns ratio N_s / N_p', value: `${sig(turnsRatio(setup.transformer), 4)} : 1`, colour: A_V });
    rows.push({ label: 'Primary voltage', value: fmtVolt(setup.transformer.Vp), colour: A_V });
    if (showSecond) {
      rows.push({ label: 'Secondary voltage', value: fmtVolt(tf.Vs), colour: A_V, strong: true });
      rows.push({ label: 'Secondary current (set by the load)', value: fmtAmp(tf.Is), colour: A_I, strong: true });
      rows.push({ label: 'Primary current', value: fmtAmp(tf.Ip), colour: A_I, strong: true });
      rows.push({ label: 'I_s / I_p', value: sig(tf.Is / Math.max(tf.Ip, 1e-18), 4), colour: A_I });
      rows.push({ label: 'N_p / N_s', value: sig(setup.transformer.Np / setup.transformer.Ns, 4), colour: A_I });
    }
    if (showPowers) {
      rows.push({ label: 'Power in (primary)', value: fmtWatt(tf.Pp), colour: TEXT.primary, strong: true });
      rows.push({ label: 'Power out (secondary)', value: fmtWatt(tf.Ps), colour: TEXT.primary, strong: true });
      rows.push({ label: 'Lost as heat', value: fmtWatt(tf.lost), colour: TEXT.secondary });
      rows.push({ label: 'Efficiency', value: `${(tf.efficiency * 100).toFixed(1)}%`, colour: TEXT.secondary });
      rows.push({ label: 'It is a', value: tf.kind.replace('-', ' '), colour: A_V });
    }
  } else {
    rows.push({ label: 'The town needs', value: fmtWatt(tx.demand), colour: TEXT.primary });
    rows.push({ label: 'Transmission voltage', value: fmtVolt(tx.voltage), colour: A_V, strong: true });
    rows.push({ label: 'Line current I = P/V', value: fmtAmp(tx.current), colour: A_I, strong: true });
    if (showSecond) {
      rows.push({ label: 'Cable resistance', value: fmtOhm(setup.transmission.resistance), colour: TEXT.secondary });
      rows.push({ label: 'Wasted in the cables, I²R', value: fmtWatt(tx.loss), colour: A_I, strong: true });
      rows.push({ label: 'Voltage lost along the cable', value: fmtVolt(tx.lineDrop), colour: A_V });
    }
    if (showPowers) {
      rows.push({ label: 'The station must send', value: fmtWatt(tx.sent), colour: TEXT.primary, strong: true });
      rows.push({ label: 'Efficiency', value: `${(tx.efficiency * 100).toFixed(2)}%`, colour: TEXT.primary, strong: true });
    }
    if (showAll) {
      rows.push({ label: 'At ten times this voltage', value: fmtWatt(lineLoss(tx.demand, tx.voltage * 10, setup.transmission.resistance)), colour: A_V });
      rows.push({ label: 'That is a factor of', value: `${sig(lossScaling(10), 3)} ×`, colour: A_V });
      rows.push({ label: 'Halving the cable resistance instead', value: fmtWatt(lineLoss(tx.demand, tx.voltage, setup.transmission.resistance / 2)), colour: TEXT.secondary });
    }
  }

  const legend: LegendRow[] = isGrid
    ? [
      { colour: A_V, label: 'the station and the transmission voltage' },
      { colour: A_I, label: 'the line current, and what it wastes' },
      { colour: TEXT.secondary, label: 'the cables' },
    ]
    : [
      { colour: A_V, label: 'primary side' },
      { colour: A_I, label: 'secondary side' },
      { colour: TEXT.secondary, label: 'the iron core — no wire crosses it' },
    ];

  return (
    <SimShell>
      <SimHeader title={isGrid ? 'The' : 'Transformer'} accentWord={isGrid ? 'Grid' : 'Bench'}
        subtitle={archetype.title}
        badge={isGrid ? `${(tx.efficiency * 100).toFixed(1)}% efficient` : tf.kind.replace('-', ' ')}
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
              height: boardH,
            }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${boardW} ${boardH}`} role="img"
              aria-label={isGrid
                ? 'A power station, transmission cables and a town. Values are listed beside the diagram.'
                : 'A transformer: two windings on one core, with no wire between them. Values are listed beside the diagram.'}
              style={{ display: 'block' }}>
              {isGrid
                ? <GridArt w={boardW} h={boardH}
                  lossFraction={tx.loss / Math.max(tx.sent, 1e-12)}
                  currentWidth={1.8 + 5 * Math.min(1, tx.current / 120)} />
                : <TransformerArt w={boardW} h={boardH}
                  primaryTurns={setup.transformer.Np} secondaryTurns={setup.transformer.Ns}
                  showSecondary={showSecond}
                  primaryWidth={1.8 + 4 * Math.min(1, tf.Ip / 12)}
                  secondaryWidth={1.8 + 4 * Math.min(1, tf.Is / 12)} />}
            </svg>
          </div>

          <Legend rows={legend} />

          {isGrid && showAll && (
            <div>
              <SectionLabel accent={A_V}>The same power, three voltages</SectionLabel>
              <div className="mt-2 flex flex-col gap-1.5">
                {[1, 10, 100].map((k) => {
                  const loss = lineLoss(tx.demand, tx.voltage * k, setup.transmission.resistance);
                  const worst = lineLoss(tx.demand, tx.voltage, setup.transmission.resistance);
                  return (
                    <div key={k} className="flex items-center gap-2">
                      <span className="tabular-nums text-[11px]" style={{ color: A_V, minWidth: 78 }}>
                        {fmtVolt(tx.voltage * k)}
                      </span>
                      <span className="h-2.5 flex-1 overflow-hidden rounded-full"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <span style={{
                          display: 'block', height: '100%',
                          width: `${Math.max(0.4, (loss / Math.max(worst, 1e-12)) * 100)}%`,
                          background: A_I,
                        }} />
                      </span>
                      <span className="tabular-nums text-[11px]" style={{ color: A_I, minWidth: 76, textAlign: 'right' }}>
                        {fmtWatt(loss)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <PlotKey items={[{ colour: A_I, text: 'wasted heating the cables — bar length is the loss' }]} />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {isGrid ? (
              <>
                {[1000, 11000, 132000, 400000].map((V) => (
                  <ActionButton key={V} accent={A_V}
                    onClick={() => setOverrides((o) => ({ ...o, line_V: V }))}>
                    {fmtVolt(V)}
                  </ActionButton>
                ))}
              </>
            ) : (
              <>
                <ActionButton accent={A_V}
                  onClick={() => setOverrides((o) => ({ ...o, Np: 500, Ns: 5000 }))}>
                  Step up 10 ×
                </ActionButton>
                <ActionButton accent={A_V}
                  onClick={() => setOverrides((o) => ({ ...o, Np: 5000, Ns: 500 }))}>
                  Step down 10 ×
                </ActionButton>
                <ActionButton accent={A_V}
                  onClick={() => setOverrides((o) => ({ ...o, Np: 1000, Ns: 1000 }))}>
                  Equal turns
                </ActionButton>
              </>
            )}
            <ActionButton accent={A_V} onClick={() => setOverrides({})}>Reset</ActionButton>
          </div>
          <ModelNote>
            {isGrid
              ? 'The town always gets what it asked for; what changes is how much the station has to send. Voltages and currents are RMS, as they are on a real grid.'
              : 'Both windings link the same flux, so every turn sees the same rate of change. Voltages and currents are RMS, as a transformer is rated in.'}
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

          <Readout rows={rows} tone={showPowers ? 'voltage' : 'plain'}
            footnote={showPowers
              ? (isGrid
                ? 'The loss is I²R, and the current is P/V — so the loss falls as the SQUARE of the transmission voltage. That one relation is why the grid looks the way it does.'
                : 'Power in and power out. An ideal transformer keeps them equal and a real one makes the second slightly smaller — never bigger, in any transformer ever built.')
              : undefined} />

          {!isGrid && showPowers && (
            <div>
              <SectionLabel accent={A_V}>What is actually being traded</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`The turns ratio is ${sig(tf.ratio, 3)}, so the voltage is multiplied by `
                  + `${sig(tf.ratio, 3)} and the current available is divided by the same `
                  + `${sig(tf.ratio, 3)}. Volts × amps comes to `
                  + `${fmtWatt(setup.transformer.Vp * tf.Ip)} going in and ${fmtWatt(tf.Vs * tf.Is)} `
                  + `coming out. Change the load and BOTH currents move together; neither voltage moves at all.`}
              </p>
            </div>
          )}

          {isGrid && showAll && (
            <div>
              <SectionLabel accent={A_V}>Why voltage and not copper</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Halving the cable resistance halves the loss — linear, and copper is priced by the tonne. `
                  + `Doubling the transmission voltage quarters it, and a transformer is cheap. Doubling it `
                  + `again quarters it once more. That is why the choice was voltage, and why every street `
                  + `has a transformer on it to bring it back down.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <AcCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_V}>Your machine</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_V} format={(z) => String(Number(z.toPrecision(4)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
          </div>

          {numeric && showPowers && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_V}>
        {isGrid
          ? 'Loss = I²R, and I = P/V. Everything about the national grid follows from those two lines.'
          : 'A transformer is not a power source. It is an exchange rate — and the product it keeps constant is watts.'}
      </ExpertTip>
    </SimShell>
  );
}

// ── Canvas art ───────────────────────────────────────────────────────────────

/**
 * Two windings on a core, with a visible GAP between them — the whole point is
 * that nothing conducts across it. Turn count is suggested by the number of
 * loops drawn (capped, so 5000 turns does not become a solid block) and the
 * stroke width tracks the current in each winding.
 */
function TransformerArt({ w, h, primaryTurns, secondaryTurns, showSecondary, primaryWidth, secondaryWidth }:
  { w: number; h: number; primaryTurns: number; secondaryTurns: number;
    showSecondary: boolean; primaryWidth: number; secondaryWidth: number }) {
  const coreX = w * 0.5;
  const coreTop = h * 0.16;
  const coreBot = h * 0.84;
  const nP = Math.max(3, Math.min(11, Math.round(Math.log10(Math.max(primaryTurns, 10)) * 4)));
  const nS = Math.max(3, Math.min(11, Math.round(Math.log10(Math.max(secondaryTurns, 10)) * 4)));
  const r = Math.min(16, (coreBot - coreTop) / (2 * Math.max(nP, nS)));

  const coil = (side: -1 | 1, n: number, colour: string, width: number) => {
    const x = coreX + side * 26;
    const span = coreBot - coreTop - 2 * r;
    return (
      <g>
        {Array.from({ length: n }, (_, i) => {
          const y = coreTop + r + (span * i) / Math.max(n - 1, 1);
          return (
            <path key={i}
              d={`M ${x} ${y - r} A ${r * 1.5} ${r} 0 0 ${side < 0 ? 0 : 1} ${x} ${y + r}`}
              fill="none" stroke={colour} strokeWidth={width} strokeLinecap="round" />
          );
        })}
        <line x1={x} y1={coreTop} x2={x + side * 60} y2={coreTop}
          stroke={colour} strokeWidth={width} strokeLinecap="round" />
        <line x1={x} y1={coreBot} x2={x + side * 60} y2={coreBot}
          stroke={colour} strokeWidth={width} strokeLinecap="round" />
        <line x1={x + side * 60} y1={coreTop} x2={x + side * 60} y2={coreBot}
          stroke={colour} strokeWidth={width} strokeLinecap="round" />
      </g>
    );
  };

  return (
    <g>
      {/* The laminated core — drawn as separate strips, which is the eddy-current
          lesson from the EMI bench showing up as a real engineering choice. */}
      {[-6, -2, 2, 6].map((dx) => (
        <line key={dx} x1={coreX + dx} y1={coreTop - 12} x2={coreX + dx} y2={coreBot + 12}
          stroke={TEXT.secondary} strokeWidth={1.6} opacity={0.75} />
      ))}
      {coil(-1, nP, A_V, primaryWidth)}
      {showSecondary && coil(1, nS, A_I, secondaryWidth)}
    </g>
  );
}

/** A station, two cables and a town. The cable stroke width is the current, and
 *  the wasted fraction is drawn as a filled portion of the cable. */
function GridArt({ w, h, lossFraction, currentWidth }:
  { w: number; h: number; lossFraction: number; currentWidth: number }) {
  const yTop = h * 0.30;
  const yBot = h * 0.70;
  const xA = w * 0.14;
  const xB = w * 0.86;
  const lossX = xA + (xB - xA) * Math.max(0.02, Math.min(1, lossFraction));
  return (
    <g>
      {/* The station: a coil-ish box. */}
      <rect x={xA - 30} y={yTop - 16} width={30} height={(yBot - yTop) + 32} rx={5}
        fill={accentTint(A_V, 0.14)} stroke={A_V} strokeWidth={2.2} />
      {/* The town: a load box. */}
      <rect x={xB} y={yTop - 16} width={30} height={(yBot - yTop) + 32} rx={5}
        fill={accentTint(A_I, 0.14)} stroke={A_I} strokeWidth={2.2} />
      {/* The two cables. */}
      <line x1={xA} y1={yTop} x2={xB} y2={yTop} stroke={TEXT.secondary} strokeWidth={currentWidth} strokeLinecap="round" />
      <line x1={xA} y1={yBot} x2={xB} y2={yBot} stroke={TEXT.secondary} strokeWidth={currentWidth} strokeLinecap="round" />
      {/* The wasted fraction, painted onto the cables. */}
      <line x1={xA} y1={yTop} x2={lossX} y2={yTop} stroke={A_I} strokeWidth={currentWidth} strokeLinecap="round" />
      <line x1={xA} y1={yBot} x2={lossX} y2={yBot} stroke={A_I} strokeWidth={currentWidth} strokeLinecap="round" />
      {/* Pylons, purely so the picture reads as a transmission line. */}
      {[0.3, 0.5, 0.7].map((f) => {
        const x = xA + (xB - xA) * f;
        return (
          <g key={f} opacity={0.5}>
            <line x1={x} y1={yTop - 10} x2={x} y2={yBot + 26} stroke={TEXT.secondary} strokeWidth={1.4} />
            <line x1={x - 12} y1={yTop - 6} x2={x + 12} y2={yTop - 6} stroke={TEXT.secondary} strokeWidth={1.4} />
          </g>
        );
      })}
    </g>
  );
}
