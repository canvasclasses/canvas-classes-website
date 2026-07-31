'use client';

/*
 * field-bench/emi/EddyBrake.tsx — the plate that will not fall.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two rungs: a solid plate braking hard, and the same plate slotted braking
 * about a quarter as hard.
 *
 * ── THE ONE THING THAT HAD TO BE DRAWN, NOT SAID ────────────────────────────
 * Why slots help. Every textbook asserts "slots break up the eddy currents" and
 * then shows a picture of a slotted plate, which explains nothing. So the eddy
 * LOOPS are drawn, one per strip, at the size the metal actually allows — and
 * when the student adds slots they watch the loops get smaller and MORE numerous
 * while the total braking falls. That is the argument: a smaller loop cuts a
 * smaller EMF, its power goes as the EMF squared, and there are only 1/size as
 * many of them, so the total goes as the size.
 *
 * ── THE MODEL IS LUMPED AND SAYS SO ─────────────────────────────────────────
 * `lib/eddy.ts` states its two geometric assumptions in its header, and the panel
 * repeats the important half out loud: the SCALING is exact physics, the absolute
 * newton is order-of-magnitude. A live eddy brake is worth having; pretending to
 * finite-element precision is not.
 *
 * ZERO `<text>` on the canvas.
 */

import * as React from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import {
  BORDER, ExpertTip, SectionLabel, SimHeader, SimShell, TEXT, TYPE, accentTint,
  useAnimationFrame,
} from '../../simulations/_shared';
import { isNarrow, stageHeight, useStageWidth } from '../useStageWidth';
import { worldToScreen } from '../../mechanics-bench/lib/svg';
import { si } from '../lib/format';
import {
  dragCoefficient, eddyLoopResistance, eddyState, plateCoastVelocity,
  plateTerminalVelocity,
} from './lib/eddy';
import { emiSetup } from './lib/setup';
import { emiFitView, emiFrameBounds } from './lib/view';
import { EMI_ARCHETYPES } from '../archetypes.emi';
import { issueFor } from '../lib/misconceptions';
import {
  A_CAUSE, A_EFFECT, ActionButton, Arrow, Choice, EmiCard, FieldGlyphs,
  GuidedPanel, Legend, LoopCurrentArrows, ModelNote, NumericPanel, PredictGate,
  Readout, Slider, type LegendRow, type ReadoutRow,
} from './ui';

const STALE_S = 0.09;

type Bag = Record<string, number | string | boolean>;

export default function EddyBrake({ block, archetypeId }:
  { block: FieldBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = EMI_ARCHETYPES[archetypeId] ?? EMI_ARCHETYPES['eddy-brake-solid'];

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return emiSetup('eddy', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
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

  const plate = setup.plate;
  const B = setup.band.B;

  const [x, setX] = React.useState(setup.travel.min + plate.width * 0.2);
  const [v, setV] = React.useState(0);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  /** Non-null while a coast is running: the launch speed and elapsed seconds. */
  const [coast, setCoast] = React.useState<{ v0: number; t: number } | null>(null);
  const [slotsCompared, setSlotsCompared] = React.useState<Set<number>>(() => new Set());

  React.useEffect(() => {
    setSlotsCompared((s) => (s.has(plate.slots) ? s : new Set([...s, plate.slots])));
  }, [plate.slots]);

  const speed = coast ? plateCoastVelocity(plate, B, coast.v0, coast.t) : v;
  const inField = x + plate.width / 2 > setup.band.x0 && x - plate.width / 2 < setup.band.x1;
  const state = eddyState(plate, B, inField ? speed : 0);
  const b = dragCoefficient(plate, B);
  const bSolid = dragCoefficient({ ...plate, slots: 1 }, B);
  const vTerm = plateTerminalVelocity(plate, B, setup.gravity);

  // ── Stage ─────────────────────────────────────────────────────────────────
  const [wrapRef, stageW] = useStageWidth<HTMLDivElement>();
  const narrow = isNarrow(stageW);
  const boardW = Math.max(200, narrow ? stageW - 8 : Math.round((stageW - 24) * 0.60));
  const boardH = stageHeight(boardW, 0.62, block.height ?? 400, 240);
  const view = React.useMemo(() => emiFitView(setup, boardW, boardH), [setup, boardW, boardH]);
  const frame = React.useMemo(() => emiFrameBounds(setup), [setup]);
  const sx = (wx: number) => worldToScreen({ x: wx, y: 0 }, view).x;
  const sy = (wy: number) => worldToScreen({ x: 0, y: wy }, view).y;

  // ── Drag ──────────────────────────────────────────────────────────────────
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const dragRef = React.useRef<{ grab: number } | null>(null);
  const lastT = React.useRef(0);
  const lastMove = React.useRef(0);
  const xRef = React.useRef(x);
  xRef.current = x;

  const worldXAt = (clientX: number) => {
    const el = svgRef.current;
    if (!el) return xRef.current;
    const r = el.getBoundingClientRect();
    const px = ((clientX - r.left) / Math.max(r.width, 1)) * boardW;
    return view.cx + (px - boardW / 2) / view.scale;
  };
  const clampX = (wx: number) => Math.min(setup.travel.max, Math.max(setup.travel.min, wx));

  const onDown = (e: React.PointerEvent) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { grab: worldXAt(e.clientX) - xRef.current };
    lastT.current = e.timeStamp;
    lastMove.current = e.timeStamp;
    setCoast(null);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const next = clampX(worldXAt(e.clientX) - dragRef.current.grab);
    const dt = Math.min(0.05, Math.max(0.008, (e.timeStamp - lastT.current) / 1000));
    lastT.current = e.timeStamp;
    lastMove.current = e.timeStamp;
    setV((next - xRef.current) / dt);
    setX(next);
  };
  const onUp = () => { dragRef.current = null; setV(0); };

  useAnimationFrame(() => {
    if (dragRef.current && performance.now() - lastMove.current > STALE_S * 1000) setV(0);
  }, { target: wrapRef, enabled: true });

  // The coast: an exact exponential, integrated for POSITION only. The velocity
  // is always the closed form, never a stepped one.
  useAnimationFrame((dt) => {
    if (!coast) return;
    const t = coast.t + dt;
    const s = plateCoastVelocity(plate, B, coast.v0, t);
    const next = xRef.current + s * dt;
    if (next >= setup.travel.max || s < coast.v0 * 0.01) {
      setX(Math.min(setup.travel.max, next));
      setCoast(null);
      setV(0);
      return;
    }
    setX(next);
    setCoast({ v0: coast.v0, t });
  }, { target: wrapRef, enabled: !!coast });

  const revealed = guided ? stage : script.length;
  const showCurrent = revealed >= 1 || !guided;
  const showLoops = revealed >= 2 || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = issueFor(cardCode);
  const evidenceMet = cardCode === 'eddy_currents_are_about_being_metal'
    ? slotsCompared.size >= 2 : showLoops;

  // ── Geometry ──────────────────────────────────────────────────────────────
  const plateL = sx(x - plate.width / 2);
  const plateR = sx(x + plate.width / 2);
  const plateT = sy(plate.height / 2);
  const plateB = sy(-plate.height / 2);
  const bandL = sx(setup.band.x0);
  const bandR = sx(setup.band.x1);
  const stripH = (plateB - plateT) / state.loopCount;

  // One eddy loop per strip, at the size the metal allows, sitting over the part
  // of the plate that is inside the field.
  const overlapL = Math.max(plateL, bandL);
  const overlapR = Math.min(plateR, bandR);
  const loopW = Math.min(stripH * 0.86, Math.max(0, overlapR - overlapL) * 0.9);
  const loopCx = (overlapL + overlapR) / 2;

  const refI = Math.max(eddyState(plate, B, Math.max(setup.speed, 0.05)).loopCurrent, 1e-12);
  const forcePx = Math.min(0.20 * boardW,
    (state.force / Math.max(eddyState(plate, B, Math.max(setup.speed, 0.05)).force, 1e-12)) * 0.10 * boardW);

  const rows: ReadoutRow[] = [
    { label: 'Plate speed', value: si(speed, 'm/s'), color: TEXT.secondary },
    { label: 'Strips the slots leave', value: String(state.loopCount), color: A_CAUSE },
    { label: 'Eddy loop size', value: si(state.loopSize, 'm'), color: A_CAUSE },
  ];
  if (showCurrent) {
    rows.push({ label: 'EMF round one loop', value: si(state.loopEmf, 'V'), color: A_EFFECT });
    rows.push({ label: 'Current in one loop', value: si(state.loopCurrent, 'A'), color: A_EFFECT, strong: true });
    rows.push({ label: 'Loop resistance', value: si(eddyLoopResistance(plate), 'Ω'), color: TEXT.secondary });
  }
  if (showLoops) {
    rows.push({ label: 'Total heating', value: si(state.power, 'W'), color: A_EFFECT });
    rows.push({ label: 'Retarding force', value: si(state.force, 'N'), color: A_EFFECT, strong: true });
    rows.push({ label: 'Drag coefficient', value: si(b, 'N·s/m'), color: TEXT.primary });
    rows.push({
      label: 'Against a solid plate',
      value: `${(b / Math.max(bSolid, 1e-18) * 100).toFixed(0)}%`,
      color: A_CAUSE,
    });
    rows.push({ label: 'Terminal speed if dropped', value: si(vTerm, 'm/s'), color: A_CAUSE });
  }

  const legend: LegendRow[] = [
    { color: A_EFFECT, label: 'field region, out of the page' },
    { color: A_CAUSE, label: 'the plate (drag it)' },
  ];
  if (showLoops) {
    legend.push({ color: A_EFFECT, label: 'eddy loops, one per strip' });
    legend.push({ color: A_EFFECT, dashed: true, label: 'retarding force' });
  }

  return (
    <SimShell>
      <SimHeader title="Eddy" accentWord="Brake" subtitle={archetype.title}
        badge={`${state.loopCount} strip${state.loopCount === 1 ? '' : 's'}`} accent={A_CAUSE} />

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
              aria-label="A metal plate entering a magnetic field region. Values are listed beside the diagram."
              style={{ display: 'block', touchAction: 'none' }}>

              <FieldGlyphs x0={bandL} x1={bandR}
                y0={sy(frame.maxY) + 6} y1={sy(frame.minY) - 6}
                strength={B} maxStrength={1.5} />

              {showLoops && forcePx > 3 && state.force > 0 && (
                <g strokeDasharray="6 4">
                  <Arrow colour={A_EFFECT} width={3}
                    x1={(plateL + plateR) / 2} y1={plateT - 16}
                    x2={(plateL + plateR) / 2 - Math.sign(speed || 1) * forcePx} y2={plateT - 16} />
                </g>
              )}

              {/* The plate, and its slots. */}
              <g onPointerDown={onDown} style={{ cursor: 'grab' }}>
                <rect x={plateL - 18} y={plateT - 18} width={(plateR - plateL) + 36} height={(plateB - plateT) + 36}
                  fill="transparent" />
                <rect x={plateL} y={plateT} width={Math.max(2, plateR - plateL)} height={plateB - plateT}
                  fill={accentTint(A_CAUSE, 0.13)} stroke={A_CAUSE} strokeWidth={2.4} rx={2} />
                {Array.from({ length: Math.max(0, state.loopCount - 1) }, (_, i) => (
                  <line key={i}
                    x1={plateL} y1={plateT + stripH * (i + 1)}
                    x2={plateR} y2={plateT + stripH * (i + 1)}
                    stroke="#050614" strokeWidth={Math.max(2, stripH * 0.14)} />
                ))}
              </g>

              {/* One eddy loop per strip, drawn where the metal actually is
                  inside the field. Circulation alternates nothing — every strip
                  circulates the same way, because every strip sees the same
                  rising flux. */}
              {showLoops && loopW > 6 && Array.from({ length: state.loopCount }, (_, i) => {
                const cy = plateT + stripH * (i + 0.5);
                const h = Math.min(stripH * 0.72, loopW);
                return (
                  <g key={i}>
                    <rect x={loopCx - loopW / 2} y={cy - h / 2} width={loopW} height={h} rx={h * 0.25}
                      fill="none" stroke={accentTint(A_EFFECT, 0.5)} strokeWidth={1.6} />
                    {h > 16 && (
                      <LoopCurrentArrows x={loopCx - loopW / 2} y={cy - h / 2} w={loopW} h={h}
                        ccw colour={A_EFFECT}
                        strength={Math.min(1, state.loopCurrent / refI)} />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <Legend rows={legend} />

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton accent={A_CAUSE}
              onClick={() => {
                setX(setup.travel.min + plate.width * 0.2);
                setCoast({ v0: Math.max(setup.speed, 0.05), t: 0 });
              }}>
              Send it in
            </ActionButton>
            <ActionButton accent={A_CAUSE}
              onClick={() => { setCoast(null); setV(0); setX(setup.travel.min + plate.width * 0.2); }}>
              Reset
            </ActionButton>
            <div style={{ minWidth: 150 }}>
              <Choice options={['1', '2', '4', '8']}
                value={String(plate.slots)}
                accent={A_CAUSE}
                onChange={(s) => setOverrides((o) => ({ ...o, slots: Number(s) }))} />
            </div>
          </div>
          <ModelNote>
            {'The number above chooses how many strips the slots cut the plate into. '
              + 'One strip is a solid plate.'}
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

          <Readout rows={rows} tone={showLoops ? 'second' : 'plain'}
            footnote={showLoops
              ? 'A lumped model: the SCALING with slots, field, speed and thickness is exact physics, and the absolute newton is order-of-magnitude. A real slotted brake needs a numerical field solve.'
              : undefined} />

          {showLoops && (
            <div>
              <SectionLabel accent={A_CAUSE}>Follow it through</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Each loop is ${si(state.loopSize, 'm')} across, so it cuts an EMF of `
                  + `${si(state.loopEmf, 'V')} — smaller loop, smaller EMF. Its heating goes as the EMF `
                  + `SQUARED, and there are only ${state.loopCount} of them. Multiply it out and the total `
                  + `braking goes as the loop SIZE, which is why ${state.loopCount} strips brake about `
                  + `${(b / Math.max(bSolid, 1e-18) * 100).toFixed(0)}% as hard as the solid plate.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <EmiCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_CAUSE}>Your bench</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' && p.key !== 'slots' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_CAUSE} format={(z) => String(Number(z.toPrecision(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
            {(archetype.params ?? []).map((p) => p.kind === 'select' ? (
              <div key={p.key} className="mt-1">
                <SectionLabel accent={A_CAUSE}>{p.label}</SectionLabel>
                <div className="mt-1.5">
                  <Choice options={p.options ?? []} accent={A_CAUSE}
                    value={typeof overrides[p.key] === 'string' ? (overrides[p.key] as string) : String(p.default)}
                    onChange={(s) => setOverrides((o) => ({ ...o, [p.key]: s }))} />
                </div>
              </div>
            ) : null)}
          </div>

          {numeric && showLoops && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_CAUSE}>
        {'A transformer core is a stack of thin laminations for exactly this reason. The laminations '
          + 'are slots, and the eddy currents they forbid would be pure waste heat.'}
      </ExpertTip>
    </SimShell>
  );
}
