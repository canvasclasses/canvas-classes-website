'use client';

/*
 * field-bench/emi/InductanceBench.tsx — self and mutual inductance.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two rungs: an inductor opposing the CHANGE in current, and a second coil that
 * responds to dI₁/dt and to nothing else.
 *
 * ── THE SCRUB IS THE INTERACTION ────────────────────────────────────────────
 * The student drags a time handle along the current trace. Nothing plays; the
 * time cursor is where their finger is (design law #5). That matters more here
 * than anywhere else in the unit, because the lesson is a comparison between
 * three MOMENTS of the same run — rising, holding, falling — and a student who
 * cannot stop on the flat middle cannot make it.
 *
 * ── WHY A TRAPEZOID AND NOT A SINE ──────────────────────────────────────────
 * A sine has no interval where dI/dt is zero, so "the biggest current gives no
 * EMF at all" could only be glimpsed at one instant. The trapezoid's hold segment
 * lasts as long as the student wants to stare at it. See `lib/inductance.ts`.
 *
 * ── TWO PLOTS, ONE TIME AXIS, ZERO TEXT ─────────────────────────────────────
 * Current above, EMF below, sharing the cursor. Two plots rather than one because
 * amps and volts are unrelated scales and a shared y axis would flatten one of
 * them into the axis line. Every label is in the `PlotKey` and the readout rows.
 */

import * as React from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
} from '../../simulations/_shared';
import { isNarrow, useStageWidth } from '../useStageWidth';
import { si, signed } from '../lib/format';
import {
  mutualEmf, mutualInductance, rampDuration, rampEmfSummary, rampSample,
  selfInductance,
} from './lib/inductance';
import { emiSetup } from './lib/setup';
import { EMI_ARCHETYPES } from '../archetypes.emi';
import { issueFor } from '../lib/misconceptions';
import {
  A_CAUSE, A_EFFECT, DualPlot, EmiCard, EnergyBars, GuidedPanel, ModelNote,
  NumericPanel, PlotKey, PredictGate, Readout, Slider, type ReadoutRow,
} from './ui';

type Bag = Record<string, number | string | boolean>;

export default function InductanceBench({ block, archetypeId }:
  { block: FieldBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = EMI_ARCHETYPES[archetypeId] ?? EMI_ARCHETYPES['self-inductance-ramp'];
  const isMutual = archetypeId === 'mutual-inductance-pair';

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return emiSetup('inductance', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, paramsKey, overrides]);

  const script = React.useMemo(() => {
    const a = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return a?.length ? a : (archetype.defaultSteps ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, stepsKey]);
  const predict = React.useMemo(
    () => JSON.parse(predictKey) as FieldBenchBlock['predict'], [predictKey],
  );

  const L1 = selfInductance(setup.coil);
  const M = mutualInductance(setup.coil, setup.secondaryTurns, setup.coupling);
  const L2 = selfInductance({ ...setup.coil, turns: setup.secondaryTurns });
  const total = rampDuration(setup.ramp);

  const [t, setT] = React.useState(total * 0.5);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [sawHold, setSawHold] = React.useState(false);

  // Keep the cursor inside the programme when its length changes under the
  // sliders — a cursor stranded past the end would read a flat zero and look
  // like the sim had broken.
  const clampedT = Math.min(t, total);
  React.useEffect(() => { if (t > total) setT(total * 0.5); }, [t, total]);

  const sample = rampSample(setup.ramp, L1, clampedT);
  const plateau = rampEmfSummary(setup.ramp, L1);
  const secondary = mutualEmf(M, sample.dIdt);

  React.useEffect(() => { if (sample.phase === 'steady') setSawHold(true); }, [sample.phase]);

  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageW);

  const revealed = guided ? stage : script.length;
  const showEmf = revealed >= 1 || !guided;
  const showAll = revealed >= 2 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = issueFor(cardCode);
  const evidenceMet = sawHold;

  // ── Traces ────────────────────────────────────────────────────────────────
  const N = 240;
  const trace = React.useMemo(() => {
    const cur: { x: number; y: number }[] = [];
    const emf: { x: number; y: number }[] = [];
    const sec: { x: number; y: number }[] = [];
    for (let k = 0; k <= N; k++) {
      const tt = (k / N) * total;
      const s = rampSample(setup.ramp, L1, tt);
      cur.push({ x: tt, y: s.current });
      emf.push({ x: tt, y: s.emf });
      sec.push({ x: tt, y: mutualEmf(M, s.dIdt) });
    }
    return { cur, emf, sec };
  }, [setup.ramp, L1, M, total]);

  const iMax = setup.ramp.peak * 1.15;
  const eMax = Math.max(Math.abs(plateau.rising), Math.abs(plateau.falling),
    Math.abs(mutualEmf(M, setup.ramp.peak / setup.ramp.rampUp))) * 1.2 || 1;

  const rows: ReadoutRow[] = [
    { label: 'Coil inductance L', value: si(L1, 'H'), color: A_CAUSE },
    { label: 'Current now', value: si(sample.current, 'A'), color: A_CAUSE, strong: true },
    { label: 'Rate dI/dt', value: `${signed(sample.dIdt, 'A/s')}`, color: A_CAUSE },
    { label: 'What it is doing', value: PHASE_WORD[sample.phase], color: TEXT.secondary },
  ];
  if (showEmf) {
    rows.push({
      label: isMutual ? 'Primary back-EMF' : 'Back-EMF',
      value: signed(sample.emf, 'V'), color: A_EFFECT, strong: true,
    });
  }
  if (isMutual && showEmf) {
    rows.push({ label: 'Mutual inductance M', value: si(M, 'H'), color: A_CAUSE });
    rows.push({ label: 'Secondary EMF', value: signed(secondary, 'V'), color: A_EFFECT, strong: true });
  }
  if (showAll) {
    rows.push({ label: 'Energy stored', value: si(sample.energy, 'J'), color: TEXT.primary });
    rows.push({ label: 'EMF while rising', value: signed(plateau.rising, 'V'), color: A_EFFECT });
    rows.push({ label: 'EMF while HOLDING', value: '0 V', color: A_EFFECT });
    rows.push({ label: 'EMF while falling', value: signed(plateau.falling, 'V'), color: A_EFFECT });
  }
  if (isMutual && showAll) {
    rows.push({ label: 'Secondary inductance L₂', value: si(L2, 'H'), color: TEXT.secondary });
    rows.push({
      label: 'M against √(L₁L₂)',
      value: `${(M / Math.max(Math.sqrt(L1 * L2), 1e-18)).toFixed(2)} × `,
      color: A_CAUSE,
    });
  }

  return (
    <SimShell>
      <SimHeader title={isMutual ? 'Mutual' : 'Self'} accentWord="Inductance"
        subtitle={archetype.title} badge={PHASE_WORD[sample.phase]} accent={A_CAUSE} />

      <div ref={wrapRef} style={{
        display: 'grid',
        gridTemplateColumns: narrow ? '1fr' : 'minmax(0,3fr) minmax(0,2fr)',
        gap: narrow ? 18 : 22,
      }}>
        <div className="flex flex-col gap-3">
          {narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s) => Math.min(script.length - 1, s + 1))} />
          )}

          <div className="rounded-2xl px-3 py-3"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A_CAUSE, 0.2)}`,
            }}>
            <DualPlot
              series={[{ points: trace.cur, colour: A_CAUSE }]}
              xMin={0} xMax={total} yMin={-iMax * 0.12} yMax={iMax}
              marker={clampedT} height={116} />
            <PlotKey items={[{ colour: A_CAUSE, text: 'the current you are driving, amps' }]} />

            {showEmf && (
              <div className="mt-3">
                <DualPlot
                  series={isMutual
                    ? [
                      { points: trace.emf, colour: A_EFFECT, dashed: true },
                      { points: trace.sec, colour: A_EFFECT },
                    ]
                    : [{ points: trace.emf, colour: A_EFFECT }]}
                  xMin={0} xMax={total} yMin={-eMax} yMax={eMax}
                  marker={clampedT} height={116} />
                <PlotKey items={isMutual
                  ? [
                    { colour: A_EFFECT, text: 'primary back-EMF, volts', dashed: true },
                    { colour: A_EFFECT, text: 'secondary EMF, volts' },
                  ]
                  : [{ colour: A_EFFECT, text: 'back-EMF, volts' }]} />
              </div>
            )}
          </div>

          <Slider label="Move the time cursor" value={clampedT} min={0} max={total}
            step={total / 300} unit="s" accent={A_CAUSE}
            format={(z) => `${(z * 1000).toFixed(1)} m`}
            onChange={setT} />

          {showAll && (
            <div>
              <SectionLabel accent={A_CAUSE}>Energy in the coil</SectionLabel>
              <div className="mt-1.5">
                <EnergyBars a={sample.energy} b={0}
                  total={0.5 * L1 * setup.ramp.peak * setup.ramp.peak}
                  colourA={A_CAUSE} colourB="transparent" />
              </div>
              <ModelNote>
                {'Stored, not spent. An ideal coil hands every joule back as the current falls — which is '
                  + 'the same fact as a pure inductor dissipating nothing on AC.'}
              </ModelNote>
            </div>
          )}

          <ModelNote>
            {'The corners of the ramp are sharp, so dI/dt jumps there. A real coil rounds them off '
              + 'itself; nothing here has been smoothed to hide it.'}
          </ModelNote>
        </div>

        <div className="flex flex-col gap-4">
          {!narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s) => Math.min(script.length - 1, s + 1))} />
          )}
          {needsPredict && (
            <p className="text-xs" style={{ color: TEXT.ghost }}>Commit a prediction below first.</p>
          )}
          {predict && stage >= 1 && (
            <PredictGate prompt={predict.prompt} options={predict.options}
              answerIndex={predict.answer_index} reveal={predict.reveal}
              choice={choice} onChoose={setChoice} />
          )}

          <Readout rows={rows} tone={sample.phase === 'steady' ? 'second' : 'plain'}
            footnote={sample.phase === 'steady'
              ? 'The largest current in the whole run, and no EMF at all. An inductor cannot feel a current — only a current changing.'
              : undefined} />

          {showAll && isMutual && (
            <div>
              <SectionLabel accent={A_CAUSE}>Why M = √(L₁L₂)</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`L goes as the turns SQUARED and M as the PRODUCT of the two turn counts, so at perfect `
                  + `coupling M is exactly the geometric mean of the two self-inductances. `
                  + `Here that is ${si(M, 'H')} against √(${si(L1, 'H')} × ${si(L2, 'H')}). `
                  + (setup.coupling < 0.999
                    ? `Coupling is ${setup.coupling.toFixed(2)}, so M is that fraction of the ideal value.`
                    : 'Drop the coupling below 1 and M falls in proportion.')}
              </p>
            </div>
          )}

          {card && evidenceMet && <EmiCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_CAUSE}>Your coil and your ramp</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_CAUSE} format={(z) => String(Number(z.toPrecision(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
          </div>

          {numeric && showAll && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_CAUSE}>
        {isMutual
          ? 'A transformer only works on AC because mutual inductance answers to dI/dt, and a steady current has none.'
          : 'Open a switch on a big coil and dI/dt is enormous for an instant. That is the spark, and it is the same equation.'}
      </ExpertTip>
    </SimShell>
  );
}

const PHASE_WORD: Record<string, string> = {
  rising: 'current rising',
  steady: 'current held steady',
  falling: 'current falling',
  off: 'no current',
};
