'use client';

/*
 * field-bench/emi/FluxMachine.tsx — THE FLAGSHIP.
 * ─────────────────────────────────────────────────────────────────────────────
 * The claim this component has to earn: a student who has used it cannot go on
 * believing that a big flux means a big EMF. Everything is arranged around that
 * one demolition.
 *
 * ── THE DRAG IS THE WHOLE INTERFACE ─────────────────────────────────────────
 * The loop is the handle. The student takes hold of it and pulls it through the
 * field with a finger, and the velocity that Faraday's law uses is the velocity
 * of that finger, measured from real elapsed time between pointer events. There
 * is no play button and no animation deciding when things happen (design law
 * #5). Two press-and-hold buttons give a steady speed for the archetypes whose
 * lesson needs one — and they only move while held.
 *
 * ── LENZ'S LAW AS SOMETHING YOU FEEL ────────────────────────────────────────
 * The loop LAGS the pointer, by an amount computed from the retarding force the
 * engine has just calculated. Not decoration and not a fixed easing: where the
 * force is real the loop drags behind the finger, and the instant the loop is
 * fully inside the band — where the force is exactly zero — it goes slippery and
 * snaps to the finger. That transition, felt rather than read, is the moment the
 * exercise exists for.
 *
 * The lag is a first-order follow, `follow = 1/(1 + gain·|F|/F_ref)`, applied to
 * the previous frame's force. It is a RENDERING of a computed force, not a
 * mass-spring solve, and it is normalised by a reference force from the same
 * setup so that turning B up makes the drag heavier without the gain needing to
 * be retuned. Said out loud here because a physical-feeling behaviour that is
 * not itself a solved equation should never be mistaken for one.
 *
 * ── THE CANVAS CARRIES NO TEXT ──────────────────────────────────────────────
 * Zero `<text>` elements. The field is the ⊙ glyph grid; the loop is a violet
 * rectangle; the induced current is amber arrows ON the loop; the retarding
 * force is one amber arrow. Everything else is in the legend and the readout
 * rows beneath, which cannot be overrun by a moving loop.
 *
 * ── RESPONSIVE ──────────────────────────────────────────────────────────────
 * One ResizeObserver on the wrapper (`useStageWidth`), and the columns stack
 * below a MEASURED 640 px — never a CSS breakpoint, because this also renders in
 * the admin editor's ~380 px split pane on a laptop viewport. An UNMEASURED
 * width (0) counts as narrow; see the hook's header for why that is deliberate.
 */

import * as React from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
  useAnimationFrame,
} from '../../simulations/_shared';
import { isNarrow, stageHeight, useStageWidth } from '../useStageWidth';
import { worldToScreen } from '../../mechanics-bench/lib/svg';
import { si, signed } from '../lib/format';
import {
  machineState, lenzSentence, projectedArea, tiltedFlux,
  type EmiState, type FieldBand, type LoopSpec,
} from './lib/loop';
import { emiSetup, type EmiSetup } from './lib/setup';
import { emiFitView, emiFrameBounds } from './lib/view';
import { EMI_ARCHETYPES } from '../archetypes.emi';
import { issueFor } from '../lib/misconceptions';
import {
  A_CAUSE, A_EFFECT, ActionButton, Arrow, EmiCard, FieldGlyphs, GuidedPanel,
  Legend, LoopCurrentArrows, NumericPanel, PredictGate, Readout, Slider,
  ModelNote, type LegendRow, type ReadoutRow,
} from './ui';

/** How heavily the retarding force is allowed to hold the loop back. Tuned so
 *  the nominal force gives a clearly felt but never frustrating lag. */
const LAG_GAIN = 1.35;
/** Velocity is zeroed if the pointer has not moved for this long — a held-still
 *  finger means a stationary loop, which must read zero EMF. */
const STALE_S = 0.09;

type Bag = Record<string, number | string | boolean>;

export default function FluxMachine({ block, archetypeId }:
  { block: FieldBenchBlock; archetypeId: string }) {
  // Derived state is keyed on stable PRIMITIVES. The admin editor autosaves on
  // every keystroke and hands down a brand-new block object each time; a memo
  // keyed on `block` would rebuild the scene and throw away the student's drag
  // and their prediction on every character typed.
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;
  const authoredHeight = block.height;

  const archetype = EMI_ARCHETYPES[archetypeId] ?? EMI_ARCHETYPES['flux-machine'];

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup: EmiSetup = React.useMemo(() => {
    const defaults = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return emiSetup('flux', { ...defaults, ...(JSON.parse(paramsKey) as Bag), ...overrides });
    // `archetype` is a module constant keyed by id — stable by construction.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, paramsKey, overrides]);

  const script = React.useMemo(() => {
    const authored = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return authored?.length ? authored : (archetype.defaultSteps ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [archetypeId, stepsKey]);
  const predict = React.useMemo(
    () => JSON.parse(predictKey) as FieldBenchBlock['predict'],
    [predictKey],
  );

  /**
   * ⚠ THE TILT RUNG IS A DIFFERENT MODEL, AND IT HAS TO BE.
   *
   * `machineState` is the SLIDING model and deliberately has no tilt — a tilted
   * sliding loop changes its x-footprint to w·cos θ AND changes which sides are
   * in the band, which is a different geometry rather than a factor
   * (see `lib/loop.ts`). `loop-tilt-flux` is the other exact model: a STATIONARY
   * loop entirely inside a uniform field, where Φ = B A cos θ.
   *
   * So on that rung the loop is parked at the band's centre, the drag and the
   * slide buttons are off, and the flux comes from `tiltedFlux`. A first draft
   * showed `machineState`'s untilted flux beside a tilt slider — the number sat
   * there refusing to move while the picture foreshortened, which is the exact
   * "the drawing and the readout disagree" defect the setup pattern exists to
   * prevent, arriving through the one door it does not cover.
   */
  const tiltRung = archetypeId === 'loop-tilt-flux';

  // ── Student state ─────────────────────────────────────────────────────────
  const [xc, setXc] = React.useState(tiltRung ? 0 : setup.loopStartX);
  const [v, setV] = React.useState(0);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [held, setHeld] = React.useState<-1 | 0 | 1>(0);
  // Tilt is NOT its own state. `emiSetup` already reads the `tilt` param out of
  // the same bag the sliders write to, so a second copy here could disagree with
  // the number the physics used — the drift this whole setup pattern exists to
  // make impossible.
  const tilt = setup.tiltDeg;

  // Reset the loop when the archetype or its geometry changes, but NOT when the
  // student nudges a slider that does not move the bench.
  const startKey = `${archetypeId}|${setup.band.x0}|${setup.band.x1}|${setup.loop.w}`;
  const lastStartKey = React.useRef(startKey);
  if (lastStartKey.current !== startKey) {
    lastStartKey.current = startKey;
    setXc(tiltRung ? 0 : setup.loopStartX);
    setV(0);
  }

  // ── Evidence flags — a card may only fire after its demonstration ──────────
  const [sawInsideMoving, setSawInsideMoving] = React.useState(false);
  const [sawBothDirections, setSawBothDirections] = React.useState(false);
  const dirsSeen = React.useRef({ pos: false, neg: false });

  const state: EmiState = React.useMemo(
    () => machineState(setup.band, setup.loop, xc, v),
    [setup.band, setup.loop, xc, v],
  );

  React.useEffect(() => {
    if (state.placement === 'fully-inside' && Math.abs(v) > 0.02) setSawInsideMoving(true);
    if (state.current > 1e-9) dirsSeen.current.pos = true;
    if (state.current < -1e-9) dirsSeen.current.neg = true;
    if (dirsSeen.current.pos && dirsSeen.current.neg) setSawBothDirections(true);
  }, [state.placement, state.current, v]);

  // The force the lag is computed from — read in the pointer handler, so it must
  // be a ref rather than state (a handler closes over the render it was created
  // in, and the force changes every frame).
  const forceRef = React.useRef(0);
  forceRef.current = state.forceX;
  /**
   * The force and the current this bench produces at its own nominal speed, used
   * to normalise the lag gain, the arrow lengths and the stroke widths.
   *
   * Normalising against the SETUP rather than a hardcoded newton value is what
   * makes the drag feel heavier when the student turns B up instead of the gain
   * needing a retune per archetype — and it is why the arrows neither explode
   * nor vanish across a slider's full range.
   */
  const ref = React.useMemo(() => {
    const probe = machineState(setup.band, setup.loop, setup.band.x0, Math.max(setup.speed, 0.05));
    return {
      force: Math.max(Math.abs(probe.forceX), 1e-12),
      current: Math.max(Math.abs(probe.current), 1e-12),
    };
  }, [setup.band, setup.loop, setup.speed]);
  const refForce = ref.force;

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageW);
  const boardW = Math.max(200, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = stageHeight(boardW, 0.62, authoredHeight ?? 420, 240);
  const view = React.useMemo(() => emiFitView(setup, boardW, boardH), [setup, boardW, boardH]);
  const frame = React.useMemo(() => emiFrameBounds(setup), [setup]);

  const sx = (x: number) => worldToScreen({ x, y: 0 }, view).x;
  const sy = (y: number) => worldToScreen({ x: 0, y }, view).y;

  // ── The drag ──────────────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef<{ grab: number } | null>(null);
  const lastMove = React.useRef(0);
  const lastT = React.useRef(0);
  const xcRef = React.useRef(xc);
  xcRef.current = xc;

  const worldXAt = (clientX: number): number => {
    const el = svgRef.current;
    if (!el) return xcRef.current;
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    return view.cx + (px - boardW / 2) / view.scale;
  };

  const clampX = (x: number) => Math.min(setup.travel.max, Math.max(setup.travel.min, x));

  const onDown = (e: React.PointerEvent) => {
    // Pointer events, with capture — not mouse events. A touch drag that leaves
    // the element must keep being delivered here or the loop sticks mid-bench.
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { grab: worldXAt(e.clientX) - xcRef.current };
    lastT.current = e.timeStamp;
    lastMove.current = e.timeStamp;
    setHeld(0);
  };

  const onMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const target = clampX(worldXAt(e.clientX) - d.grab);
    const prev = xcRef.current;
    // The retarding force holds the loop back. See the header — this is a
    // rendering of the computed force, not a second physical model.
    const follow = 1 / (1 + LAG_GAIN * (Math.abs(forceRef.current) / refForce));
    const next = prev + (target - prev) * follow;
    const dt = Math.min(0.05, Math.max(0.008, (e.timeStamp - lastT.current) / 1000));
    lastT.current = e.timeStamp;
    lastMove.current = e.timeStamp;
    setXc(next);
    setV((next - prev) / dt);
  };

  const onUp = () => {
    dragRef.current = null;
    setV(0);
  };

  // A finger held STILL means a stationary loop, which must read zero EMF. Only
  // the staleness test uses the clock; the drag itself never does.
  useAnimationFrame(() => {
    if (dragRef.current && performance.now() - lastMove.current > STALE_S * 1000) setV(0);
  }, { target: wrapRef, enabled: true });

  // ── Press-and-hold steady slide ───────────────────────────────────────────
  useAnimationFrame((dt) => {
    if (!held) return;
    const next = clampX(xcRef.current + held * setup.speed * dt);
    setXc(next);
    setV(next === xcRef.current ? 0 : held * setup.speed);
  }, { target: wrapRef, enabled: held !== 0 });

  // ── What is revealed when ─────────────────────────────────────────────────
  const revealed = guided ? stage : script.length;
  const showFlux = revealed >= 1 || !guided;
  const showRate = revealed >= 2 || !guided;
  const showEffect = revealed >= 3 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 2;
  const atEnd = stage >= script.length - 1;

  // ── The misconception card, evidence-gated ────────────────────────────────
  const cardCode = archetype.targets;
  const card = issueFor(cardCode);
  const evidenceMet =
    cardCode === 'emf_from_flux_not_its_rate' ? sawInsideMoving
      : cardCode === 'induced_current_has_a_fixed_direction' ? sawBothDirections
        : cardCode === 'flux_ignores_orientation' ? Math.abs(tilt) >= 45
          : showEffect;

  // ── Screen geometry ───────────────────────────────────────────────────────
  const bandL = sx(setup.band.x0);
  const bandR = sx(setup.band.x1);
  const loopL = sx(xc - setup.loop.w / 2);
  const loopR = sx(xc + setup.loop.w / 2);
  const loopT = sy(setup.loop.h / 2);
  const loopB = sy(-setup.loop.h / 2);
  // The tilt archetype squeezes the loop's drawn width by cos θ — the projected
  // area IS what the field threads, so showing it foreshortened is the whole
  // visual argument rather than a flourish.
  const cosT = Math.cos((tilt * Math.PI) / 180);
  const midX = (loopL + loopR) / 2;
  const halfW = ((loopR - loopL) / 2) * Math.abs(cosT);
  const drawL = midX - halfW;
  const drawR = midX + halfW;

  const currentStrength = Math.min(1, Math.abs(state.current) / ref.current);
  const forcePx = Math.min(0.22 * boardW, (Math.abs(state.forceX) / refForce) * 0.11 * boardW);

  const rows: ReadoutRow[] = [];

  // The tilt rung: the exact stationary model, not the sliding one. Only flux
  // rows, because nothing is changing and an EMF row would be a zero the student
  // has to interpret rather than a fact they asked for.
  if (tiltRung && showFlux) {
    rows.push({ label: 'Face-on flux B A', value: si(setup.band.B * state.linkedArea * setup.loop.turns, 'Wb'), color: A_CAUSE });
    rows.push({ label: 'Tilt θ', value: `${tilt.toFixed(0)}°`, color: TEXT.secondary });
    rows.push({ label: 'cos θ', value: (tilt === 90 || tilt === 270 ? 0 : cosT).toFixed(4), color: TEXT.secondary });
    rows.push({
      label: 'Area the field threads',
      value: si(projectedArea(state.linkedArea, tilt), 'm²'), color: A_CAUSE,
    });
    rows.push({
      label: 'Flux Φ = B A cos θ',
      value: si(tiltedFlux(setup.band.B, state.linkedArea, setup.loop.turns, tilt), 'Wb'),
      color: A_CAUSE, strong: true,
    });
    rows.push({ label: 'EMF', value: '0 V — nothing is changing', color: A_EFFECT });
  } else if (showFlux) {
    rows.push({ label: 'Flux Φ', value: si(state.flux, 'Wb'), color: A_CAUSE });
    if (setup.loop.turns > 1) rows.push({ label: 'Linkage NΦ', value: si(state.linkage, 'Wb'), color: A_CAUSE });
  }
  if (showRate && !tiltRung) {
    rows.push({ label: 'Rate dΦ/dt', value: `${signed(state.dFluxDt, 'Wb/s')}`, color: A_CAUSE });
    rows.push({ label: 'Speed', value: si(v, 'm/s'), color: TEXT.secondary });
  }
  if (showEffect && !tiltRung) {
    rows.push({ label: 'EMF', value: signed(state.emf, 'V'), color: A_EFFECT, strong: true });
    rows.push({
      label: 'Current',
      value: state.sense === 'none' ? '0 A'
        : `${si(Math.abs(state.current), 'A')} ${state.sense === 'ccw' ? 'anticlockwise' : 'clockwise'}`,
      color: A_EFFECT,
    });
    rows.push({ label: 'Retarding force', value: si(Math.abs(state.forceX), 'N'), color: A_EFFECT });
    rows.push({ label: 'Power you supply', value: si(state.mechanicalPower, 'W'), color: TEXT.primary });
    rows.push({ label: 'Power dissipated', value: si(state.electricalPower, 'W'), color: TEXT.primary });
  }

  const legend: LegendRow[] = [
    { color: A_EFFECT, label: 'field region, out of the page' },
    { color: A_CAUSE, label: 'the loop (drag it)' },
  ];
  if (showEffect && !tiltRung && state.sense !== 'none') {
    legend.push({ color: A_EFFECT, label: `induced current, ${state.sense === 'ccw' ? 'anticlockwise' : 'clockwise'}` });
    legend.push({ color: A_EFFECT, dashed: true, label: 'force on the loop' });
  }

  const placementWord =
    state.placement === 'outside' ? 'outside the field'
      : state.placement === 'entering' ? 'part-way in'
        : state.placement === 'fully-inside' ? 'completely inside'
          : state.placement === 'exiting' ? 'part-way out'
            : 'wider than the field region';

  return (
    <SimShell>
      <SimHeader
        title="Flux"
        accentWord="Machine"
        subtitle={archetype.title}
        badge={placementWord}
        accent={A_CAUSE}
      />

      <div ref={wrapRef}
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : 'minmax(0,3fr) minmax(0,2fr)',
          gap: narrow ? 18 : 22,
        }}>

        {/* ── Canvas column ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {/* Stacked, the guided panel goes ABOVE the canvas: the CTA that
              enables anything must never be off-screen below a dead control. */}
          {narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s) => Math.min(script.length - 1, s + 1))} />
          )}

          <div className="relative overflow-hidden rounded-2xl"
            style={{
              background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)',
              border: `1px solid ${accentTint(A_CAUSE, 0.2)}`,
              height: boardH,
              touchAction: 'none',
            }}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${boardW} ${boardH}`}
              onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              role="img"
              aria-label={`A conducting loop ${placementWord}. Values are listed beside the diagram.`}
              style={{ display: 'block', touchAction: 'none' }}>

              <FieldGlyphs
                x0={bandL} x1={bandR}
                y0={sy(frame.maxY) + 6} y1={sy(frame.minY) - 6}
                strength={setup.band.B} maxStrength={3} />

              {/* The retarding force, drawn from the loop's centre. Dashed so it
                  cannot be mistaken for the current arrows. */}
              {showEffect && !tiltRung && forcePx > 3 && (
                <g strokeDasharray="6 4">
                  <Arrow colour={A_EFFECT} width={3.2}
                    x1={midX} y1={(loopT + loopB) / 2}
                    x2={midX + Math.sign(state.forceX) * forcePx} y2={(loopT + loopB) / 2} />
                </g>
              )}

              {/* The induced current, ON the loop.
                  ⚠ THE Y-FLIP. `state.sense === 'ccw'` is counter-clockwise in
                  PHYSICS (y up). Screen y grows downward, so that same
                  circulation appears CLOCKWISE, and `ccw` here is a screen-space
                  flag. Hence the negation. Getting this backwards would draw
                  anti-Lenz with perfectly correct numbers beside it. */}
              {showEffect && !tiltRung && state.sense !== 'none' && (
                <LoopCurrentArrows
                  x={drawL} y={loopT} w={drawR - drawL} h={loopB - loopT}
                  ccw={state.sense !== 'ccw'}
                  colour={A_EFFECT}
                  strength={currentStrength} />
              )}

              {/* The loop itself — and the grab target. A 22 px transparent
                  halo makes it grabbable with a finger without enlarging the
                  drawn rectangle. */}
              <g onPointerDown={tiltRung ? undefined : onDown} style={{ cursor: tiltRung ? 'default' : 'grab' }}>
                <rect x={drawL - 22} y={loopT - 22} width={(drawR - drawL) + 44} height={(loopB - loopT) + 44}
                  fill="transparent" />
                <rect x={drawL} y={loopT} width={Math.max(1, drawR - drawL)} height={loopB - loopT}
                  fill={accentTint(A_CAUSE, 0.07)} stroke={A_CAUSE} strokeWidth={3} rx={2} />
              </g>
            </svg>
          </div>

          <Legend rows={legend} />

          {/* Transport — press and hold. Nothing moves on its own. */}
          <div className="flex flex-wrap items-center gap-2">
            {!tiltRung && (
              <>
                <HoldButton label="◀ Slide left" onHold={() => setHeld(-1)} onRelease={() => { setHeld(0); setV(0); }} />
                <HoldButton label="Slide right ▶" onHold={() => setHeld(1)} onRelease={() => { setHeld(0); setV(0); }} />
              </>
            )}
            <ActionButton accent={A_CAUSE}
              onClick={() => { setHeld(0); setV(0); setXc(tiltRung ? 0 : setup.loopStartX); }}>
              Reset
            </ActionButton>
          </div>
          <ModelNote>
            {tiltRung
              ? 'The loop is not going anywhere on this rung — it sits inside a uniform field and the only '
                + 'control that does anything is the tilt. Nothing is changing, so there is no EMF.'
              : 'Drag the loop with a finger, or hold a slide button for a steady speed. '
                + 'Let go and the loop stops — and so does everything else, which is the point.'}
          </ModelNote>
        </div>

        {/* ── Panel column ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {!narrow && guided && script.length > 0 && (
            <GuidedPanel steps={script} index={stage} done={atEnd && !needsPredict}
              onAdvance={() => !needsPredict && setStage((s) => Math.min(script.length - 1, s + 1))} />
          )}
          {needsPredict && (
            <p className="text-xs" style={{ color: TEXT.ghost }}>
              Commit a prediction below before the numbers appear.
            </p>
          )}

          {predict && stage >= 2 && (
            <PredictGate
              prompt={predict.prompt} options={predict.options}
              answerIndex={predict.answer_index} reveal={predict.reveal}
              choice={choice} onChoose={setChoice} />
          )}

          {rows.length > 0 && (
            <Readout rows={rows}
              tone={state.placement === 'fully-inside' && Math.abs(v) > 0.02 ? 'second' : 'plain'}
              footnote={showEffect && !tiltRung
                ? 'The last two rows are computed by different routes — a force times a speed, and a current squared times a resistance. They agree because energy is conserved, not because one was copied from the other.'
                : undefined} />
          )}

          {showEffect && !tiltRung && (
            <div>
              <SectionLabel accent={A_CAUSE}>What is happening</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {lenzSentence(state)}
              </p>
            </div>
          )}

          {card && evidenceMet && <EmiCard issue={card} />}

          {/* The knobs. Design law #1: the student sets the scene. */}
          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_CAUSE}>Your bench</SectionLabel>
            {(archetype.params ?? []).map((p) => {
              if (p.kind !== 'number') return null;
              const cur = typeof overrides[p.key] === 'number'
                ? (overrides[p.key] as number)
                : (p.default as number);
              return (
                <Slider key={p.key} label={p.label} value={cur}
                  min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01}
                  unit={p.unit ?? ''} accent={A_CAUSE}
                  format={(x) => String(Number(x.toFixed(3)))}
                  onChange={(x) => setOverrides((o) => ({ ...o, [p.key]: x }))} />
              );
            })}
          </div>

          {numeric && showEffect && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_CAUSE}>
        {'Look for the rate, never the amount. A loop resting in the strongest field on the page '
          + 'reads nothing at all; a loop creeping through a weak one reads plenty.'}
      </ExpertTip>
    </SimShell>
  );
}

// ── Press-and-hold ───────────────────────────────────────────────────────────

/**
 * A button that acts only while it is held.
 *
 * Pointer events with capture, and a release on cancel and on leave: a touch
 * that slides off a hold button without firing `pointerup` would otherwise leave
 * the loop travelling by itself, which is precisely the auto-play design law #5
 * forbids.
 */
function HoldButton({ label, onHold, onRelease }:
  { label: string; onHold: () => void; onRelease: () => void }) {
  return (
    <button type="button"
      onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); onHold(); }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
      className="rounded-lg px-3 text-[12px] font-semibold uppercase tracking-wider transition-all"
      style={{
        background: accentTint(A_CAUSE, 0.14),
        border: `1px solid ${accentTint(A_CAUSE, 0.4)}`,
        color: A_CAUSE, minHeight: 44, touchAction: 'none',
      }}>
      {label}
    </button>
  );
}

/** Re-exported for the other EMI views, which draw the same band on the same
 *  camera and must not each invent their own conversion. */
export type { FieldBand, LoopSpec };
