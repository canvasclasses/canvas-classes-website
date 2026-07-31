'use client';

/*
 * field-bench/emi/GeneratorBench.tsx — the loop that makes AC.
 * ─────────────────────────────────────────────────────────────────────────────
 * The bridge from EMI to the AC bench, and the reason design law #4 is real
 * rather than rhetorical: the sine wave the next chapter treats as given IS this
 * loop, still turning. `generatorState` and the AC bench's `instantaneous` are
 * the same sinusoid, and the verifier checks that this loop's frequency and the
 * AC bench's resonance formula agree on the same L and C.
 *
 * ── THE STUDENT TURNS THE HANDLE ────────────────────────────────────────────
 * The rotor is dragged round with a finger — the angle is where their finger is,
 * so nothing spins on its own (design law #5). Because the angle is theirs, they
 * can park the loop face-on and read zero EMF at maximum flux, which is the whole
 * counter-intuitive pairing.
 *
 * ── THE FORESHORTENING IS THE ARGUMENT ──────────────────────────────────────
 * The loop is drawn with its width squeezed by |cos θ|, so edge-on it collapses
 * to a line. That is not a stylisation: the flux threads the PROJECTED area, and
 * seeing the projection shrink to nothing is the same statement as Φ = BA cos θ.
 *
 * ZERO `<text>` on the canvas.
 */

import * as React from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
} from '../../simulations/_shared';
import { isNarrow, stageHeight, useStageWidth } from '../useStageWidth';
import { si, signed } from '../lib/format';
import { generatorState } from './lib/loop';
import { emiSetup } from './lib/setup';
import { EMI_ARCHETYPES } from '../archetypes.emi';
import { issueFor } from '../lib/misconceptions';
import {
  A_CAUSE, A_EFFECT, DualPlot, EmiCard, FieldGlyphs, GuidedPanel, Legend,
  ModelNote, NumericPanel, PlotKey, PredictGate, Readout, Slider,
  type LegendRow, type ReadoutRow,
} from './ui';

type Bag = Record<string, number | string | boolean>;

export default function GeneratorBench({ block, archetypeId }:
  { block: FieldBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = EMI_ARCHETYPES[archetypeId] ?? EMI_ARCHETYPES['ac-generator-loop'];

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return emiSetup('generator', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
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

  const gen = setup.generator;
  const period = (2 * Math.PI) / Math.max(gen.omega, 1e-9);

  /** The turn angle in radians, driven by the finger. Unbounded, so a student can
   *  wind through several turns and the trace keeps up. */
  const [theta, setTheta] = React.useState(0);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [visitedEdge, setVisitedEdge] = React.useState(false);

  // t is derived from the angle, so the loop's position and the trace's cursor
  // can never disagree — the state is ONE number.
  const t = theta / Math.max(gen.omega, 1e-9);
  const state = generatorState(gen, t);

  React.useEffect(() => {
    const c = Math.abs(Math.cos(theta));
    if (c < 0.15) setVisitedEdge(true);
  }, [theta]);

  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageW);
  const boardW = Math.max(200, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = stageHeight(boardW, 0.58, block.height ?? 340, 220);

  // ── The rotor handle ──────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef<{ last: number } | null>(null);
  const cx = boardW * 0.5;
  const cy = boardH * 0.5;
  const R = Math.min(boardW, boardH) * 0.30;

  const angleAt = (clientX: number, clientY: number): number => {
    const el = svgRef.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    const py = ((clientY - r.top) / Math.max(r.height, 1)) * boardH;
    // Screen y grows downward, so negate to get a physics angle.
    return Math.atan2(-(py - cy), px - cx);
  };

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { last: angleAt(e.clientX, e.clientY) };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const a = angleAt(e.clientX, e.clientY);
    // Unwrap across the ±π seam, or the trace would jump a whole turn every time
    // the handle passed the left of the circle.
    let delta = a - d.last;
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    d.last = a;
    setTheta((th) => th + delta);
  };
  const onUp = () => { dragRef.current = null; };

  const revealed = guided ? stage : script.length;
  const showFlux = revealed >= 1 || !guided;
  const showEmf = revealed >= 2 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = issueFor(cardCode);
  const evidenceMet = visitedEdge;

  // ── Traces: two whole turns, centred on where the student is ──────────────
  const span = 2 * period;
  const t0 = t - span / 2;
  const trace = React.useMemo(() => {
    const flux: { x: number; y: number }[] = [];
    const emf: { x: number; y: number }[] = [];
    for (let k = 0; k <= 220; k++) {
      const tt = t0 + (span * k) / 220;
      const s = generatorState(gen, tt);
      flux.push({ x: tt, y: s.flux });
      emf.push({ x: tt, y: s.emf });
    }
    return { flux, emf };
  }, [gen, t0, span]);

  const fluxPeak = gen.B * gen.area;
  // ONE y scale for both curves, normalised: the whole claim is that the EMF is
  // the SLOPE of the flux, and two independent scales would let a flat flux sit
  // beside a huge EMF and read as a contradiction. So the EMF is plotted as a
  // fraction of its own peak and the flux as a fraction of its own, on one axis.
  const norm = (pts: { x: number; y: number }[], peak: number) =>
    pts.map((p) => ({ x: p.x, y: p.y / Math.max(peak, 1e-18) }));

  const loopHalfW = R * Math.abs(Math.cos(theta));
  const rows: ReadoutRow[] = [
    { label: 'Turn angle', value: `${(((theta * 180) / Math.PI) % 360).toFixed(0)}°`, color: TEXT.secondary },
  ];
  if (showFlux) {
    rows.push({ label: 'Flux Φ', value: signed(state.flux, 'Wb'), color: A_CAUSE, strong: true });
    rows.push({ label: 'Peak flux BA', value: si(fluxPeak, 'Wb'), color: A_CAUSE });
  }
  if (showEmf) {
    rows.push({ label: 'EMF', value: signed(state.emf, 'V'), color: A_EFFECT, strong: true });
    rows.push({ label: 'Peak EMF NBAω', value: si(state.peakEmf, 'V'), color: A_EFFECT });
    rows.push({ label: 'Current', value: signed(state.current, 'A'), color: A_EFFECT });
    rows.push({ label: 'Rotation rate', value: si(gen.omega / (2 * Math.PI), 'Hz'), color: TEXT.secondary });
  }

  const legend: LegendRow[] = [
    { color: A_EFFECT, label: 'field, out of the page' },
    { color: A_CAUSE, label: 'the loop, seen edge-on (turn it)' },
  ];

  return (
    <SimShell>
      <SimHeader title="AC" accentWord="Generator" subtitle={archetype.title}
        badge={Math.abs(Math.cos(theta)) < 0.15 ? 'edge-on' : Math.abs(Math.cos(theta)) > 0.95 ? 'face-on' : 'turning'}
        accent={A_CAUSE} />

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

          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A_CAUSE, 0.2)}`,
              height: boardH, touchAction: 'none',
            }}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${boardW} ${boardH}`}
              onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} role="img"
              aria-label="A loop rotating in a uniform magnetic field. Values are listed beside the diagram."
              style={{ display: 'block', touchAction: 'none' }}>

              <FieldGlyphs x0={10} x1={boardW - 10} y0={10} y1={boardH - 10}
                strength={gen.B} maxStrength={1.5} />

              {/* The axle. */}
              <line x1={cx} y1={cy - R * 1.35} x2={cx} y2={cy + R * 1.35}
                stroke={TEXT.secondary} strokeWidth={2} strokeDasharray="5 5" />

              {/* The loop, foreshortened by |cos θ| — edge-on it is a line. */}
              <rect x={cx - loopHalfW} y={cy - R * 0.62}
                width={Math.max(1.5, loopHalfW * 2)} height={R * 1.24}
                fill={accentTint(A_CAUSE, 0.1)} stroke={A_CAUSE} strokeWidth={3} rx={2} />

              {/* The handle: a knob on the rim the student grabs and winds. */}
              <g onPointerDown={onDown} style={{ cursor: 'grab' }}>
                <circle cx={cx + R * 1.15 * Math.cos(theta)} cy={cy - R * 1.15 * Math.sin(theta)}
                  r={26} fill="transparent" />
                <circle cx={cx + R * 1.15 * Math.cos(theta)} cy={cy - R * 1.15 * Math.sin(theta)}
                  r={9} fill={A_CAUSE} stroke="#050614" strokeWidth={2} />
              </g>
              <circle cx={cx} cy={cy} r={R * 1.15} fill="none"
                stroke={accentTint(A_CAUSE, 0.25)} strokeWidth={1.4} strokeDasharray="3 5" />
            </svg>
          </div>

          <Legend rows={legend} />

          {showFlux && (
            <div className="rounded-2xl px-3 py-3"
              style={{
                background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
                border: `1px solid ${accentTint(A_CAUSE, 0.2)}`,
              }}>
              <DualPlot
                series={showEmf
                  ? [
                    { points: norm(trace.flux, fluxPeak), colour: A_CAUSE },
                    { points: norm(trace.emf, state.peakEmf), colour: A_EFFECT },
                  ]
                  : [{ points: norm(trace.flux, fluxPeak), colour: A_CAUSE }]}
                xMin={t0} xMax={t0 + span} yMin={-1.15} yMax={1.15}
                marker={t} height={124} />
              <PlotKey items={showEmf
                ? [
                  { colour: A_CAUSE, text: 'flux, as a fraction of its own peak' },
                  { colour: A_EFFECT, text: 'EMF, as a fraction of its own peak' },
                ]
                : [{ colour: A_CAUSE, text: 'flux, as a fraction of its own peak' }]} />
            </div>
          )}

          <ModelNote>
            {'Grab the knob and wind the loop round. Both curves are drawn as fractions of their own '
              + 'peaks on one axis, so the EMF can be read as the SLOPE of the flux rather than compared '
              + 'to it in volts.'}
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

          <Readout rows={rows}
            tone={Math.abs(Math.cos(theta)) > 0.95 ? 'second' : 'plain'}
            footnote={Math.abs(Math.cos(theta)) > 0.95
              ? 'Face-on: the flux is at its peak and momentarily flat, so the EMF is zero. The most flux, and no EMF at all.'
              : Math.abs(Math.cos(theta)) < 0.15
                ? 'Edge-on: no flux through the loop at all, and the EMF is at its largest — because the flux is changing fastest here.'
                : undefined} />

          {showEmf && (
            <div>
              <SectionLabel accent={A_CAUSE}>Where the sine comes from</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Φ = B A cos θ and θ grows steadily, so the flux is a cosine. Faraday differentiates it, `
                  + `and the derivative of a cosine is a sine — which is why every socket in the country `
                  + `carries a sine wave. Its peak is N B A ω = ${si(state.peakEmf, 'V')}, so spinning `
                  + `faster raises the voltage AND the frequency together.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <EmiCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_CAUSE}>Your generator</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_CAUSE} format={(z) => String(Number(z.toPrecision(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
          </div>

          {numeric && showEmf && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_CAUSE}>
        {'The alternating voltage the next chapter starts from is this loop, still turning. '
          + 'Nothing new was added — only Faraday, applied to a rotation.'}
      </ExpertTip>
    </SimShell>
  );
}
