'use client';

/*
 * field-bench/emi/MotionalEmf.tsx — the rod on rails.
 * ─────────────────────────────────────────────────────────────────────────────
 * Three rungs on one bench: ε = Bℓv, the energy identity, and terminal velocity.
 *
 * ── WHAT THE STUDENT DOES ───────────────────────────────────────────────────
 * Drags the rod along the rails. The velocity in ε = Bℓv is the velocity of
 * their finger, measured from real elapsed time between pointer events — no
 * animation clock decides anything (design law #5). Press-and-hold gives a
 * steady speed for the power-balance rung, whose argument needs one.
 *
 * ── THE TWO POWER ROWS ARE THE POINT ────────────────────────────────────────
 * `rodState` computes the mechanical power from a FORCE and a SPEED and the
 * electrical power from a CURRENT and a RESISTANCE. Neither is derived from the
 * other, and the verifier holds them equal to 1e-9 across a 320-point sweep. So
 * the two numbers on screen agreeing is a result, not a tautology — which is the
 * only way "EMI is not free energy" lands as an argument rather than a slogan.
 *
 * ── TERMINAL VELOCITY WITHOUT CHANGING THE DRAWING ──────────────────────────
 * The classic terminal-velocity setup stands the rails on end and lets gravity
 * pull. Drawn on a horizontal bench that is confusing, so the rod is pulled
 * instead by a CONSTANT force of mg over a pulley — physically identical
 * (F_applied constant, v → FR/(B²ℓ²)), the same closed form, and it keeps one
 * canvas for all three rungs instead of two that could drift apart.
 *
 * ZERO `<text>` on the canvas. Every label is in the legend or a readout row.
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
import { fallVelocity, rodState, terminalVelocity, coastTimeConstant } from './lib/motional';
import { emiSetup } from './lib/setup';
import { emiFitView, emiFrameBounds } from './lib/view';
import { EMI_ARCHETYPES } from '../archetypes.emi';
import { issueFor } from '../lib/misconceptions';
import {
  A_CAUSE, A_EFFECT, ActionButton, Arrow, EmiCard, FieldGlyphs, GuidedPanel,
  Legend, ModelNote, NumericPanel, PredictGate, Readout, Slider,
  type LegendRow, type ReadoutRow,
} from './ui';

const STALE_S = 0.09;

type Bag = Record<string, number | string | boolean>;

export default function MotionalEmf({ block, archetypeId }:
  { block: FieldBenchBlock; archetypeId: string }) {
  const paramsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const predictKey = JSON.stringify(block.predict ?? null);
  const guided = block.guided !== false;
  const numeric = block.numeric;

  const archetype = EMI_ARCHETYPES[archetypeId] ?? EMI_ARCHETYPES['motional-emf-rod'];
  const isTerminal = archetypeId === 'rod-terminal-velocity';

  const [overrides, setOverrides] = React.useState<Bag>({});
  const setup = React.useMemo(() => {
    const d = Object.fromEntries((archetype.params ?? []).map((p) => [p.key, p.default]));
    return emiSetup('motional', { ...d, ...(JSON.parse(paramsKey) as Bag), ...overrides });
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

  const travelMin = setup.band.x0;
  const travelMax = setup.band.x1;

  const [x, setX] = React.useState(travelMin + (travelMax - travelMin) * 0.25);
  const [v, setV] = React.useState(0);
  const [stage, setStage] = React.useState(0);
  const [choice, setChoice] = React.useState<number | null>(null);
  const [held, setHeld] = React.useState<-1 | 0 | 1>(0);
  /** Seconds since release, for the terminal-velocity rung. `null` = not released. */
  const [fallT, setFallT] = React.useState<number | null>(null);
  const [sawBothPowers, setSawBothPowers] = React.useState(false);

  const rod = setup.rod;
  const vT = terminalVelocity(rod, setup.gravity);
  const tau = coastTimeConstant(rod);

  // In the terminal rung the SPEED is the closed-form solution, not the finger.
  const speed = isTerminal && fallT !== null ? fallVelocity(rod, fallT, setup.gravity) : v;
  const state = React.useMemo(() => rodState(rod, speed), [rod, speed]);

  React.useEffect(() => {
    if (state.mechanicalPower > 0) setSawBothPowers(true);
  }, [state.mechanicalPower]);

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
  const clampX = (wx: number) => Math.min(travelMax, Math.max(travelMin, wx));

  const onDown = (e: React.PointerEvent) => {
    if (isTerminal) return;             // that rung is released, not dragged
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = { grab: worldXAt(e.clientX) - xRef.current };
    lastT.current = e.timeStamp;
    lastMove.current = e.timeStamp;
    setHeld(0);
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

  useAnimationFrame((dt) => {
    if (!held) return;
    const next = clampX(xRef.current + held * setup.speed * dt);
    setV(next === xRef.current ? 0 : held * setup.speed);
    setX(next);
  }, { target: wrapRef, enabled: held !== 0 });

  // The terminal-velocity run: the rod's POSITION is integrated from the exact
  // v(t), and the run stops itself at the end of the rails rather than pinning
  // the rod against the edge with a live current still reported.
  useAnimationFrame((dt) => {
    if (fallT === null) return;
    const t = fallT + dt;
    const next = xRef.current + fallVelocity(rod, t, setup.gravity) * dt;
    if (next >= travelMax) { setX(travelMax); setFallT(null); setV(0); return; }
    setX(next);
    setFallT(t);
  }, { target: wrapRef, enabled: fallT !== null });

  const revealed = guided ? stage : script.length;
  const showEmf = revealed >= 1 || !guided;
  const showForce = revealed >= 2 || !guided;
  const showPower = revealed >= (isTerminal ? 2 : 2) || !guided;
  const needsPredict = !!predict && choice === null && stage >= 1;
  const atEnd = stage >= script.length - 1;

  const cardCode = archetype.targets;
  const card = issueFor(cardCode);
  const evidenceMet = cardCode === 'induced_effects_are_free_energy' ? sawBothPowers : showPower;

  // ── Geometry ──────────────────────────────────────────────────────────────
  const railTop = sy(rod.length / 2);
  const railBot = sy(-rod.length / 2);
  const leftEnd = sx(travelMin - (travelMax - travelMin) * 0.06);
  const rightEnd = sx(travelMax + (travelMax - travelMin) * 0.06);
  const rodX = sx(x);
  const refForce = Math.max(rodState(rod, Math.max(setup.speed, 0.05)).magneticForce, 1e-12);
  const forcePx = Math.min(0.20 * boardW, (state.magneticForce / refForce) * 0.10 * boardW);
  const pullPx = isTerminal
    ? Math.min(0.20 * boardW, ((rod.mass ?? 0.05) * setup.gravity / refForce) * 0.10 * boardW)
    : forcePx;

  const rows: ReadoutRow[] = [
    { label: 'Rod speed', value: si(speed, 'm/s'), color: TEXT.secondary },
  ];
  if (showEmf) {
    rows.push({ label: 'EMF (Bℓv)', value: si(state.emf, 'V'), color: A_EFFECT, strong: true });
    rows.push({ label: 'Current', value: si(state.current, 'A'), color: A_EFFECT });
  }
  if (showForce) {
    rows.push({ label: 'Magnetic force on the rod', value: si(state.magneticForce, 'N'), color: A_EFFECT });
    if (isTerminal) {
      rows.push({ label: 'Steady pull (mg)', value: si((rod.mass ?? 0) * setup.gravity, 'N'), color: A_CAUSE });
    }
  }
  if (showPower) {
    rows.push({ label: 'Power you supply', value: si(state.mechanicalPower, 'W'), color: TEXT.primary, strong: true });
    rows.push({ label: 'Power the resistor dissipates', value: si(state.electricalPower, 'W'), color: TEXT.primary, strong: true });
  }
  if (isTerminal && showForce) {
    rows.push({ label: 'Terminal speed', value: si(vT, 'm/s'), color: A_CAUSE });
    rows.push({ label: 'Time constant', value: si(tau, 's'), color: TEXT.secondary });
  }

  const legend: LegendRow[] = [
    { color: A_EFFECT, label: 'field, out of the page' },
    { color: A_CAUSE, label: isTerminal ? 'the rod (release it)' : 'the rod (drag it)' },
    { color: TEXT.secondary, label: 'rails and resistor' },
  ];
  if (showForce) legend.push({ color: A_EFFECT, dashed: true, label: 'magnetic force, opposing the motion' });
  if (isTerminal && showForce) legend.push({ color: A_CAUSE, dashed: true, label: 'the steady pull, mg' });

  return (
    <SimShell>
      <SimHeader title="Motional" accentWord="EMF" subtitle={archetype.title}
        badge={isTerminal ? (fallT !== null ? 'running' : 'ready') : si(speed, 'm/s')}
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
              aria-label="A conducting rod sliding along two rails through a magnetic field. Values are listed beside the diagram."
              style={{ display: 'block', touchAction: 'none' }}>

              <FieldGlyphs x0={sx(frame.minX) + 6} x1={sx(frame.maxX) - 6}
                y0={sy(frame.maxY) + 6} y1={sy(frame.minY) - 6}
                strength={rod.B} maxStrength={2} />

              {/* Rails, and the resistor closing them at the left. */}
              <line x1={leftEnd} y1={railTop} x2={rightEnd} y2={railTop}
                stroke={TEXT.secondary} strokeWidth={3} strokeLinecap="round" />
              <line x1={leftEnd} y1={railBot} x2={rightEnd} y2={railBot}
                stroke={TEXT.secondary} strokeWidth={3} strokeLinecap="round" />
              <ResistorGlyph x={leftEnd} yTop={railTop} yBot={railBot} colour={TEXT.secondary} />

              {/* The current, as arrows around the closed circuit. Direction from
                  the sign of the computed current: positive means the rod drives
                  charge upward through itself. */}
              {showEmf && Math.abs(state.current) > 1e-9 && (
                <CircuitArrows xL={leftEnd} xR={rodX} yTop={railTop} yBot={railBot}
                  up={state.current > 0} colour={A_EFFECT}
                  width={1.6 + 3 * Math.min(1, state.current / Math.max(rodState(rod, Math.max(setup.speed, 0.05)).current, 1e-12))} />
              )}

              {/* Force arrows: magnetic (always opposing), and the steady pull. */}
              {showForce && forcePx > 3 && (
                <g strokeDasharray="6 4">
                  <Arrow colour={A_EFFECT} width={3}
                    x1={rodX} y1={(railTop + railBot) / 2}
                    x2={rodX - Math.sign(speed || 1) * forcePx} y2={(railTop + railBot) / 2} />
                </g>
              )}
              {isTerminal && showForce && pullPx > 3 && (
                <g strokeDasharray="6 4">
                  <Arrow colour={A_CAUSE} width={3}
                    x1={rodX} y1={railTop - 18} x2={rodX + pullPx} y2={railTop - 18} />
                </g>
              )}

              {/* The rod, with a generous grab halo. */}
              <g onPointerDown={onDown} style={{ cursor: isTerminal ? 'default' : 'grab' }}>
                <rect x={rodX - 22} y={railTop - 14} width={44} height={(railBot - railTop) + 28} fill="transparent" />
                <line x1={rodX} y1={railTop} x2={rodX} y2={railBot}
                  stroke={A_CAUSE} strokeWidth={6} strokeLinecap="round" />
              </g>
            </svg>
          </div>

          <Legend rows={legend} />

          <div className="flex flex-wrap items-center gap-2">
            {isTerminal ? (
              <>
                <ActionButton accent={A_CAUSE} onClick={() => setFallT(fallT === null ? 0 : null)}>
                  {fallT === null ? 'Release the rod' : 'Stop'}
                </ActionButton>
                <ActionButton accent={A_CAUSE}
                  onClick={() => { setFallT(null); setV(0); setX(travelMin + (travelMax - travelMin) * 0.25); }}>
                  Reset
                </ActionButton>
              </>
            ) : (
              <>
                <HoldButton label="◀ Steady pull left" onHold={() => setHeld(-1)} onRelease={() => { setHeld(0); setV(0); }} />
                <HoldButton label="Steady pull right ▶" onHold={() => setHeld(1)} onRelease={() => { setHeld(0); setV(0); }} />
                <ActionButton accent={A_CAUSE}
                  onClick={() => { setV(0); setX(travelMin + (travelMax - travelMin) * 0.25); }}>
                  Reset
                </ActionButton>
              </>
            )}
          </div>
          <ModelNote>
            {isTerminal
              ? 'The rails are ideal and there is no friction, so every ohm in the circuit is the resistor and every newton opposing the rod is magnetic.'
              : 'Drag the rod, or hold a button for a steady speed. The rails and the rod are ideal conductors; all the resistance is in the resistor.'}
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

          <Readout rows={rows} tone={showPower ? 'second' : 'plain'}
            footnote={showPower
              ? 'The last two rows come from different quantities — a force times a speed, and a current squared times a resistance. Push harder and both rise together, by exactly the same amount.'
              : undefined} />

          {isTerminal && showForce && (
            <div>
              <SectionLabel accent={A_CAUSE}>The balance</SectionLabel>
              <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
                {`Set the magnetic force I ℓ B equal to the pull mg and the speed drops straight out: `
                  + `v = mgR / (B²ℓ²) = ${si(vT, 'm/s')}. No calculus — just a free-body diagram that balances.`}
              </p>
            </div>
          )}

          {card && evidenceMet && <EmiCard issue={card} />}

          <div className="flex flex-col gap-1 pt-1" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
            <SectionLabel accent={A_CAUSE}>Your bench</SectionLabel>
            {(archetype.params ?? []).map((p) => p.kind === 'number' ? (
              <Slider key={p.key} label={p.label}
                value={typeof overrides[p.key] === 'number' ? (overrides[p.key] as number) : (p.default as number)}
                min={p.min ?? 0} max={p.max ?? 1} step={p.step ?? 0.01} unit={p.unit ?? ''}
                accent={A_CAUSE} format={(z) => String(Number(z.toFixed(3)))}
                onChange={(z) => setOverrides((o) => ({ ...o, [p.key]: z }))} />
            ) : null)}
          </div>

          {numeric && showPower && (
            <NumericPanel prompt={numeric.prompt} answer={numeric.answer}
              tolerance={numeric.tolerance} unit={numeric.unit} reveal={numeric.worked_reveal} />
          )}
        </div>
      </div>

      <ExpertTip accent={A_CAUSE}>
        {'Every joule the resistor turns into heat came off your hand. The magnetic force is the '
          + 'middleman, and it takes no cut at all.'}
      </ExpertTip>
    </SimShell>
  );
}

// ── Small canvas pieces ──────────────────────────────────────────────────────

/** The zig-zag resistor symbol, drawn vertically between the rails. */
function ResistorGlyph({ x, yTop, yBot, colour }:
  { x: number; yTop: number; yBot: number; colour: string }) {
  const h = yBot - yTop;
  const n = 6;
  const amp = Math.min(11, h * 0.13);
  let d = `M ${x} ${yTop}`;
  for (let i = 0; i < n; i++) {
    const y = yTop + (h * (i + 0.5)) / n;
    d += ` L ${x + (i % 2 === 0 ? amp : -amp)} ${y}`;
  }
  d += ` L ${x} ${yBot}`;
  return <path d={d} fill="none" stroke={colour} strokeWidth={2.6} strokeLinecap="round" />;
}

/** Four arrows round the closed circuit, showing which way the current goes. */
function CircuitArrows({ xL, xR, yTop, yBot, up, colour, width }:
  { xL: number; xR: number; yTop: number; yBot: number; up: boolean; colour: string; width: number }) {
  const mid = (yTop + yBot) / 2;
  const mx = (xL + xR) / 2;
  const arm = Math.min(26, Math.abs(xR - xL) * 0.18 + 8);
  const varm = Math.min(20, (yBot - yTop) * 0.2 + 6);
  // `up` means the current flows UPWARD through the rod on screen.
  const rodDir = up ? -1 : 1;
  return (
    <g>
      <Arrow colour={colour} width={width} x1={xR} y1={mid - rodDir * varm} x2={xR} y2={mid + rodDir * varm} />
      <Arrow colour={colour} width={width}
        x1={mx + (up ? arm : -arm)} y1={up ? yTop : yBot} x2={mx - (up ? arm : -arm)} y2={up ? yTop : yBot} />
      <Arrow colour={colour} width={width} x1={xL} y1={mid + rodDir * varm} x2={xL} y2={mid - rodDir * varm} />
      <Arrow colour={colour} width={width}
        x1={mx - (up ? arm : -arm)} y1={up ? yBot : yTop} x2={mx + (up ? arm : -arm)} y2={up ? yBot : yTop} />
    </g>
  );
}

function HoldButton({ label, onHold, onRelease }:
  { label: string; onHold: () => void; onRelease: () => void }) {
  return (
    <button type="button"
      onPointerDown={(e) => { (e.currentTarget as Element).setPointerCapture?.(e.pointerId); onHold(); }}
      onPointerUp={onRelease} onPointerCancel={onRelease} onPointerLeave={onRelease}
      className="rounded-lg px-3 text-[12px] font-semibold uppercase tracking-wider transition-all"
      style={{
        background: accentTint(A_CAUSE, 0.14), border: `1px solid ${accentTint(A_CAUSE, 0.4)}`,
        color: A_CAUSE, minHeight: 44, touchAction: 'none',
      }}>
      {label}
    </button>
  );
}
