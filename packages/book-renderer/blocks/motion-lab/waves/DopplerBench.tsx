'use client';

/*
 * motion-lab/waves/DopplerBench.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PHYSICS_SIMULATION_PROGRAM.md §4 unit 8: "Doppler Bench (drag source and
 * observer independently) — source-moving ≠ observer-moving (different
 * formulas, same effect)."
 *
 * ── WHY THE ASYMMETRY NEEDS A SIMULATION AT ALL ─────────────────────────────
 * Told as words it sounds like pedantry: both cases raise the pitch, so who
 * cares which one is moving? Drawn, it stops being pedantry, because the two
 * cases do visibly different things to the picture:
 *
 *   • A MOVING SOURCE emits each crest from a point further forward, so the
 *     circles physically bunch ahead of it. The WAVELENGTH in the air has
 *     changed. That is why v_s sits in the denominator and why the answer runs
 *     away to infinity as v_s → v (which is a sonic boom, and the formula says
 *     so before anyone mentions one).
 *   • A MOVING OBSERVER changes nothing about the circles. They stay evenly
 *     spaced; the observer merely crosses more per second. That is why v_o sits
 *     in the numerator and why the effect is perfectly linear and tame.
 *
 * So the wavefront circles are not decoration here — they ARE the difference
 * between the two formulas, and the bench draws them from `wavefronts()`, which
 * places each circle at the position the source occupied when it emitted it.
 * Nothing about the bunching is drawn by hand.
 *
 * ── THE PRIMARY GESTURE ─────────────────────────────────────────────────────
 * One drag handle on the tip of each velocity arrow: the student sets the
 * source's motion and the observer's motion INDEPENDENTLY, which is the whole
 * point of the exercise. Sliders mirror the handles for fine work.
 *
 * ── AN HONEST SCALING NOTE, STATED ON SCREEN ────────────────────────────────
 * A real 400 Hz note in 340 m/s air has a 0.85 m wavelength; a road wide enough
 * to show a source overtaking its own sound would then hold thousands of
 * circles. The drawing therefore uses a slower VISUAL emission rate while
 * keeping the real speed ratio v_s/v exactly — so the bunching factor on screen
 * is the true one and every NUMBER comes from the real frequencies.
 */

import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { MotionBenchBlock } from '@canvas/data/types/books';
import type { WavesArchetype } from './types';
import * as W from './lib/wave';
import { resolveParams, num, bool, controlDefs, bagKey } from './lib/resolve';
import { useAnimationFrame } from '../../simulations/_shared';
import { Arrow, Handle, svgPoint, GRAB_CSS_PX } from './svgparts';
import {
  LabFrame, Card, Toggle, ActionButton, Readout, NumericPanel,
  SimSlider, SectionLabel, ACCENT, ACCENT_2, TEXT, BORDER, accentTint,
  clamp, f1, f2, type LegendRow, type ReadoutRow,
} from './ui';

const MAX_STAGE = 3;

/** Circles per second, for DRAWING only. The ratio v_s/v is preserved exactly,
 *  so the on-screen bunching is the true bunching. */
const VISUAL_F = 1.1;
/** Metres of road either side of the middle. */
const ROAD = 160;

export default function DopplerBench({ block, arch }: { block: MotionBenchBlock; arch: WavesArchetype }) {
  const defs = controlDefs(arch.params);
  const authored = useMemo(() => resolveParams(arch.params, block.params), [arch.params, block.params]);
  const seed = bagKey(authored);

  const [c, setC] = useState(() => readControls(authored));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setC(readControls(authored)); }, [seed]);
  const [showFronts, setShowFronts] = useState(() => bool(authored, 'show_wavefronts', true));

  const guided = block.guided !== false && (block.steps ?? arch.defaultSteps ?? []).length > 0;
  const steps = block.steps ?? arch.defaultSteps ?? [];
  const [step, setStep] = useState(guided ? 0 : MAX_STAGE + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setStep(guided ? 0 : MAX_STAGE + 1); setPlaying(false); setT(0); }, [seed, guided]);
  const stage = guided ? Math.min(step, MAX_STAGE) : MAX_STAGE;

  const [predictChoice, setPredictChoice] = useState<number | null>(null);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);   // NEVER true on mount
  const [everRan, setEverRan] = useState(false);
  const [grab, setGrab] = useState<'source' | 'observer' | null>(null);
  const [touched, setTouched] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  useAnimationFrame((dt) => setT((prev) => (prev + dt) % 8), { enabled: playing, target: wrapRef });

  // ── the physics ───────────────────────────────────────────────────────────
  // Sign convention lives in lib/wave.ts: both speeds are measured ALONG THE
  // LINE TOWARDS the other party, positive when closing.
  const spec = { f0: c.f0, v: c.v, vs: c.vs, vo: c.vo };
  const observed = W.dopplerObserved(spec);
  const sourceOnly = W.dopplerSourceMoving(c.f0, c.v, Math.abs(c.vs) > 1e-9 ? c.vs : c.vo);
  const observerOnly = W.dopplerObserverMoving(c.f0, c.v, Math.abs(c.vs) > 1e-9 ? c.vs : c.vo);
  const compareSpeed = Math.abs(c.vs) > 1e-9 ? c.vs : c.vo;
  const lambdaAhead = W.dopplerWavelengthAhead(c.f0, c.v, c.vs);
  const lambdaBehind = W.dopplerWavelengthBehind(c.f0, c.v, c.vs);
  const mach = W.machNumber(c.vs, c.v);

  // ── drawing geometry (world metres along the road) ────────────────────────
  const visualVs = (c.vs / c.v) * VISUAL_SPEED;
  const fronts = useMemo(
    () => (showFronts && stage >= 1
      ? W.wavefronts({ f0: VISUAL_F, v: VISUAL_SPEED, sourceVx: visualVs, sourceX0: -ROAD * 0.55 }, t, 11)
      : []),
    [showFronts, stage, visualVs, t]
  );
  const sourceX = -ROAD * 0.55 + visualVs * t;
  const observerX = ROAD * 0.55 - (c.vo / c.v) * VISUAL_SPEED * t;

  // ── drag: one handle per party, set independently ─────────────────────────
  const viewRef = useRef<{ w: number; h: number; scale: number; midY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const sx = (x: number): number => {
    const v = viewRef.current;
    return v ? v.w / 2 + x * v.scale : 0;
  };

  const tipOf = (which: 'source' | 'observer'): { x: number; y: number } => {
    const v = viewRef.current;
    if (!v) return { x: 0, y: 0 };
    const speed = which === 'source' ? c.vs : -c.vo;
    const base = which === 'source' ? sourceX : observerX;
    const y = which === 'source' ? v.midY - v.h * 0.19 : v.midY + v.h * 0.19;
    return { x: sx(base) + (speed / 120) * v.w * 0.28, y };
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const v = viewRef.current;
    if (!v || stage < 1) return;
    const p = svgPoint(e, v.w, v.h);
    if (!p) return;
    for (const which of ['source', 'observer'] as const) {
      const tip = tipOf(which);
      if (Math.hypot(p.x - tip.x, p.y - tip.y) * p.fit <= GRAB_CSS_PX) {
        e.currentTarget.setPointerCapture(e.pointerId);
        setGrab(which);
        setTouched(true);
        return;
      }
    }
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const v = viewRef.current;
    if (!grab || !v) return;
    const p = svgPoint(e, v.w, v.h);
    if (!p) return;
    const base = grab === 'source' ? sourceX : observerX;
    const speed = ((p.x - sx(base)) / (v.w * 0.28)) * 120;
    // Capped just below the sound speed: at v_s = v the formula divides by zero
    // and the sim would be asserting a shock wave it does not model. Naming the
    // limit beats drawing nonsense past it.
    if (grab === 'source') setC((prev) => ({ ...prev, vs: clamp(Math.round(speed), -120, Math.min(120, c.v - 5)) }));
    else setC((prev) => ({ ...prev, vo: clamp(Math.round(-speed), -120, 120) }));
    setT(0);
  };
  const onUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!grab) return;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch { /* already gone */ }
    setGrab(null);
  };

  // ── misconception gate: both cases must have been tried ───────────────────
  const [triedSource, setTriedSource] = useState(false);
  const [triedObserver, setTriedObserver] = useState(false);
  useEffect(() => { if (Math.abs(c.vs) > 2) setTriedSource(true); }, [c.vs]);
  useEffect(() => { if (Math.abs(c.vo) > 2) setTriedObserver(true); }, [c.vo]);
  const ready = triedSource && triedObserver && everRan;

  // ── legend + readout ──────────────────────────────────────────────────────
  const legend: LegendRow[] = [
    { color: ACCENT, label: 'Source', value: `${f1(c.vs)} m/s towards the observer`, strong: true },
    { color: ACCENT_2, label: 'Observer', value: `${f1(c.vo)} m/s towards the source`, strong: true },
    { color: 'rgba(255,255,255,0.45)', label: 'Crests already emitted, each growing at the speed of sound' },
  ];

  const readout: ReadoutRow[] = [
    { label: 'Heard frequency f′', value: `${f1(observed)} Hz`, color: ACCENT, strong: true },
    { label: 'Emitted f₀', value: `${f1(c.f0)} Hz` },
    { label: 'Shift', value: `${observed > c.f0 ? '+' : ''}${f1(observed - c.f0)} Hz`, color: ACCENT_2 },
    { label: 'λ ahead of the source', value: `${f2(lambdaAhead)} m`, color: ACCENT },
    { label: 'λ behind the source', value: `${f2(lambdaBehind)} m`, color: ACCENT_2 },
    { label: 'Mach number v_s/v', value: `${f2(mach)}` },
  ];

  return (
    <div ref={wrapRef}>
      <LabFrame
        title={block.title ?? arch.title}
        subtitle={`${arch.id.replace(/-/g, ' ')} · doppler bench`}
        badge={<span className="tabular-nums">{`f′ = ${f1(observed)} Hz`}</span>}
        guided={guided ? {
          steps, index: Math.min(step, steps.length - 1), done: step >= steps.length,
          onAdvance: () => setStep((s) => s + 1),
        } : null}
        predict={arch.predict ? { spec: arch.predict, choice: predictChoice, onChoose: setPredictChoice } : null}
        canvasAspect={1.9}
        maxCanvasHeight={380}
        frozen={!!grab}
        renderCanvas={(w, h) => {
          const scale = (w * 0.9) / (ROAD * 2);
          viewRef.current = { w, h, scale, midY: h / 2 };
          return (
            <svg ref={svgRef} viewBox={`0 0 ${w} ${h}`} width="100%" height="100%"
              style={{ display: 'block', touchAction: 'none' }}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              {/* the road */}
              <line x1={w * 0.04} y1={h / 2} x2={w * 0.96} y2={h / 2}
                stroke="rgba(255,255,255,0.22)" strokeWidth={2} />

              {/* the crests — each centred where the source WAS when it emitted */}
              {fronts.map((fr, i) => (
                <circle key={i} cx={w / 2 + fr.cx * scale} cy={h / 2} r={Math.max(1, fr.radius * scale)}
                  fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={1.4}
                  opacity={clamp(1 - fr.age / 7, 0.12, 0.85)} />
              ))}

              {/* the source */}
              <g style={{ pointerEvents: 'none' }}>
                <rect x={w / 2 + sourceX * scale - 13} y={h / 2 - 11} width={26} height={22} rx={4}
                  fill={accentTint(ACCENT, 0.4)} stroke={ACCENT} strokeWidth={2} />
                <Arrow x1={w / 2 + sourceX * scale} y1={h / 2 - h * 0.19}
                  x2={tipOf('source').x} y2={h / 2 - h * 0.19} color={ACCENT} width={3} />
                <line x1={w / 2 + sourceX * scale} y1={h / 2 - 11}
                  x2={w / 2 + sourceX * scale} y2={h / 2 - h * 0.19}
                  stroke={ACCENT} strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
              </g>
              <Handle {...tipOf('source')} color={accentTint(ACCENT, 0.9)} r={8} hint={!touched && stage >= 1} />

              {/* the observer */}
              <g style={{ pointerEvents: 'none' }}>
                <circle cx={w / 2 + observerX * scale} cy={h / 2} r={11}
                  fill={accentTint(ACCENT_2, 0.4)} stroke={ACCENT_2} strokeWidth={2} />
                <Arrow x1={w / 2 + observerX * scale} y1={h / 2 + h * 0.19}
                  x2={tipOf('observer').x} y2={h / 2 + h * 0.19} color={ACCENT_2} width={3} />
                <line x1={w / 2 + observerX * scale} y1={h / 2 + 11}
                  x2={w / 2 + observerX * scale} y2={h / 2 + h * 0.19}
                  stroke={ACCENT_2} strokeWidth={1} strokeDasharray="3 4" opacity={0.5} />
              </g>
              <Handle {...tipOf('observer')} color={accentTint(ACCENT_2, 0.9)} r={8} hint={!touched && stage >= 1} />
            </svg>
          );
        }}
        legend={legend}
        belowCanvas={
          <div className="flex flex-wrap items-center gap-3">
            <ActionButton onClick={() => { setPlaying((p) => !p); setEverRan(true); }} disabled={stage < MAX_STAGE}>
              {playing ? '❚❚ Pause' : '▶ Emit'}
            </ActionButton>
            <ActionButton accent={ACCENT_2} onClick={() => { setPlaying(false); setT(0); }} disabled={stage < MAX_STAGE}>
              ↺ Reset
            </ActionButton>
            <Toggle on={showFronts} label="draw the emitted crests" onClick={() => setShowFronts((v) => !v)} />
            <span className="text-[10px] leading-snug" style={{ color: TEXT.muted, maxWidth: 320 }}>
              the crests are drawn at a slowed emission rate so they are countable — the bunching ratio v_s/v is the real one
            </span>
          </div>
        }
        controls={
          <div className="flex flex-col gap-2.5">
            <SectionLabel>Move them independently</SectionLabel>
            <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
              {touched
                ? 'Drag either arrow tip, or use the sliders.'
                : '👆 Drag the tip of each arrow — the source and the observer are set separately, on purpose.'}
            </p>
            {defs.map((d) => d.kind === 'number' ? (
              <SimSlider key={d.key} label={d.label} value={numberOf(c, d.key)}
                min={d.min ?? 0} max={d.max ?? 1} step={d.step ?? 1} unit={d.unit ?? ''}
                accent={d.key === 'vo' ? ACCENT_2 : ACCENT}
                format={(v) => v.toFixed(0)}
                onChange={(v) => { setC((prev) => ({ ...prev, [d.key]: v })); setT(0); }} />
            ) : null)}
          </div>
        }
        panels={
          <>
            <Readout rows={readout} footnote="f′ = f₀(v + v_o)/(v − v_s), with both speeds measured towards the other party." />

            {/* The comparison IS the exercise — the two cases, at the same
                closing speed, printed side by side so the gap is a number. */}
            {stage >= 2 && Math.abs(compareSpeed) > 1e-9 && (
              <Card tone="accent">
                <SectionLabel accent={ACCENT}>Same closing speed, two answers</SectionLabel>
                <div className="mt-2 flex flex-col gap-1.5">
                  <Row label={`Only the SOURCE moves at ${f1(compareSpeed)} m/s`} value={`${f1(sourceOnly)} Hz`} color={ACCENT} />
                  <Row label={`Only the OBSERVER moves at ${f1(compareSpeed)} m/s`} value={`${f1(observerOnly)} Hz`} color={ACCENT_2} />
                  <Row label="Difference" value={`${f2(Math.abs(sourceOnly - observerOnly))} Hz`} color={TEXT.primary} />
                </div>
                <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                  The source case is bigger because it shortens the wavelength itself — a division. The observer case
                  only counts crests faster — an addition. Division beats addition, and the gap widens as the speed rises.
                </p>
              </Card>
            )}

            {mach > 0.8 && (
              <Card tone="bad">
                <p className="text-[13px] leading-snug" style={{ color: TEXT.secondary }}>
                  At Mach {f2(mach)} the denominator (v − v_s) is nearly zero and f′ is running away. At Mach 1 exactly,
                  the source keeps up with its own crests, they pile onto one another, and there is no “heard frequency”
                  any more — that pile-up is a sonic boom, and this bench does not model it.
                </p>
              </Card>
            )}

            {block.numeric && (
              <NumericPanel prompt={block.numeric.prompt} answer={block.numeric.answer}
                tolerance={block.numeric.tolerance} unit={block.numeric.unit}
                reveal={block.numeric.worked_reveal} />
            )}
          </>
        }
        misconception={ready ? { belief: arch.attacks.belief, attack: arch.attacks.attack } : null}
        tip={arch.tip}
        caption={block.caption}
      />
    </div>
  );
}

/** Visual propagation speed in "road metres per second", chosen so a crest
 *  crosses the road in a few seconds. The ratio v_s/v is what carries the
 *  physics, and it is preserved exactly. */
const VISUAL_SPEED = 46;

function Row({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[12px]" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="tabular-nums text-[14px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

interface Controls { f0: number; v: number; vs: number; vo: number }

const readControls = (b: ReturnType<typeof resolveParams>): Controls => ({
  f0: num(b, 'f0', 400),
  v: num(b, 'sound_speed', 340),
  vs: num(b, 'vs', 30),
  vo: num(b, 'vo', 0),
});

const numberOf = (c: Controls, key: string): number => {
  if (key === 'sound_speed') return c.v;
  return (c as unknown as Record<string, number>)[key] ?? 0;
};
