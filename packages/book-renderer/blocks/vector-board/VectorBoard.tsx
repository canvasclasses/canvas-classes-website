'use client';

// VectorBoard.tsx — the vector-board engine.
// ─────────────────────────────────────────────────────────────────────────────
// Renders one authored `vector_board` block: a named archetype construction plus
// any combination of the gradable exercise layers (target / identify / numeric;
// `predict` is handled one level up because it gates the whole board).
//
// Everything geometric is imported from the Vector Lab simulator rather than
// re-derived — `vectorMath` (pure algebra, incl. the NCERT parallelogram law),
// `DraggableHead` (the PhET-validated grab-the-tip interaction) and the SVG
// primitives. Vector Lab itself is not modified.
//
// ── Three rules this file exists to enforce (all learned from a founder review)
// 1. GUIDED, NOT ANIMATED. A construction is revealed one click at a time, each
//    stage explained BEFORE it is drawn. An auto-play animation that completes
//    in a second teaches nothing.
// 2. NOTHING MAY RESIZE THE CANVAS. The canvas has a FIXED pixel height and the
//    grid is items-start, so sidebar content appearing (a success message, an
//    extra readout row) can never reflow the board. Sidebar-driven reflow was
//    the real cause of the "circle size flickers while dragging" report.
// 3. SUCCESS LATCHES. Once a target is hit it stays hit. Re-evaluating on every
//    pointer move made the success panel strobe on and off at the tolerance
//    boundary — and un-solving a student's work is bad pedagogy anyway.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { VectorBoardBlock, VectorSpec } from '@canvas/data/types/books';
import {
  add,
  fromPolar,
  magnitude,
  angle360,
  type Vec2,
} from '../simulations/vector-lab/lib/vectorMath';
import { toScreen, type Frame } from '../simulations/vector-lab/lib/viewport';
import { computeFrame, maxMagForTail } from './frame';
import { C, VIEW, canvasStyle } from '../simulations/vector-lab/lib/theme';
import { Grid, Axes, VectorArrow, AngleArc, Dot } from '../simulations/vector-lab/components/svg';
import { DraggableHead } from '../simulations/vector-lab/components/DraggableHead';
import InlineMarkdown from '../InlineMarkdown';
import {
  ARCHETYPES,
  ACCENT,
  accentOf,
  seedVectors,
  tailOf,
  ALL_STEPS,
  type ArchetypeDef,
  type ArchetypeResult,
  type DrawnArrow,
  type ShowFlags,
} from './archetypes';
import type { VectorTarget } from '@canvas/data/types/books';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULT_SHOW: ShowFlags = {
  grid: true,
  axes: true,
  components: false,
  angleArc: false,
  readout: true,
  formula: true,
  compass: false,
};


// Origin + scale now come from `./frame`, which fits and centres the archetype's
// real content bounding box. Author `params.origin_x/origin_y/scale` and an
// archetype's `defaultFrame` still override it. See frame.ts for why the old
// anchor/quadrant/reach model was replaced.

/** How long a single revealed stage takes to draw itself in. */
const STEP_MS = 550;
/**
 * Draw-in frame interval. 30fps, not 60 — each frame re-renders the whole board
 * including the KaTeX formula rows, and at 60fps that starved the timer badly
 * enough that the stage took ~2x its nominal duration to finish (measured in
 * the editor preview, which renders the page twice). 30fps is visually
 * indistinguishable for a 550ms draw-in and halves the work.
 */
const FRAME_MS = 33;

const numParam = (p: VectorBoardBlock['params'], k: string, d: number): number =>
  p && typeof p[k] === 'number' ? (p[k] as number) : d;

/**
 * Draw an author's raw vector list literally (used by the identify diagrams).
 *
 * Any arrow whose TIP lands on an earlier arrow's tip gets a mid-shaft label —
 * in a tip-to-tail diagram the resultant ends exactly where B ends, so two
 * tip-labels would print on top of each other. (Found in a browser pass; no
 * type or schema check can catch a label collision.)
 */
function literalArrows(specs: VectorSpec[]): DrawnArrow[] {
  const vecs = seedVectors(specs);
  const tips: Vec2[] = [];
  return specs.map((s, i) => {
    const tail = tailOf(vecs, specs, i);
    const tip = add(tail, vecs[i]);
    const clash = tips.some((t) => Math.hypot(t.x - tip.x, t.y - tip.y) < 0.6);
    tips.push(tip);
    return {
      from: tail,
      to: tip,
      color: accentOf(s.color),
      label: s.label,
      labelAt: clash ? ('mid' as const) : undefined,
      width: 3.5,
    };
  });
}

/** Fit a set of arrows into a viewBox — used for the small static identify diagrams. */
function autoFit(arrows: DrawnArrow[], w: number, h: number, pad = 26): Frame {
  const pts: Vec2[] = arrows.flatMap((a) => [a.from, a.to]);
  pts.push({ x: 0, y: 0 });
  const xs = pts.map((p) => p.x);
  const ys = pts.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = Math.max(0.001, maxX - minX);
  const spanY = Math.max(0.001, maxY - minY);
  const scale = Math.min((w - 2 * pad) / spanX, (h - 2 * pad) / spanY);
  return { scale, originX: pad + (0 - minX) * scale, originY: h - pad - (0 - minY) * scale };
}

// ── Shared SVG scene ──────────────────────────────────────────────────────────

/** Axis lines labelled East/West/North/South instead of x/y — real-world direction problems. */
function CompassAxes({ frame }: { frame: Frame }) {
  return (
    <g>
      <line x1={0} y1={frame.originY} x2={VIEW.w} y2={frame.originY} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <line x1={frame.originX} y1={0} x2={frame.originX} y2={VIEW.h} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
      <text x={VIEW.w - 6} y={frame.originY - 8} fill={C.ghost} fontSize={11} fontWeight={700} textAnchor="end">EAST</text>
      <text x={6} y={frame.originY - 8} fill={C.ghost} fontSize={11} fontWeight={700}>WEST</text>
      <text x={frame.originX + 8} y={15} fill={C.ghost} fontSize={11} fontWeight={700}>NORTH</text>
      <text x={frame.originX + 8} y={VIEW.h - 8} fill={C.ghost} fontSize={11} fontWeight={700}>SOUTH</text>
    </g>
  );
}

function Scene({ result, frame, show }: { result: ArchetypeResult; frame: Frame; show: ShowFlags }) {
  return (
    <>
      {show.grid && <Grid frame={frame} />}
      {show.compass ? <CompassAxes frame={frame} /> : show.axes && <Axes frame={frame} />}
      {(result.guides || []).map((g, i) => {
        const a = toScreen(g.from, frame);
        const b = toScreen(g.to, frame);
        return (
          <line key={`g${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
            stroke={g.color || C.ghost} strokeWidth={1.5} strokeDasharray="5 5" opacity={g.opacity ?? 0.6} />
        );
      })}
      {(result.arcs || []).map((arc, i) => (
        <AngleArc key={`a${i}`} vertex={arc.vertex} fromDeg={arc.fromDeg} toDeg={arc.toDeg}
          frame={frame} label={arc.label} color={arc.color} radiusPx={arc.radiusPx} />
      ))}
      {result.arrows.map((ar, i) => {
        // 'mid' labels are drawn here rather than by VectorArrow, which always
        // places a label past the TIP. A resultant's tip coincides with another
        // arrow's tip, so tip-labelling stacks them illegibly.
        if (ar.labelAt !== 'mid' || !ar.label) {
          return (
            <VectorArrow key={`v${i}`} from={ar.from} to={ar.to} frame={frame} color={ar.color}
              label={ar.label} width={ar.width} dashed={ar.dashed} opacity={ar.opacity} />
          );
        }
        const p = toScreen(ar.from, frame);
        const qq = toScreen(ar.to, frame);
        const dx = qq.x - p.x;
        const dy = qq.y - p.y;
        const len = Math.hypot(dx, dy) || 1;
        // Push the label clear of the shaft, on the side away from the origin.
        const off = 15;
        const lx = (p.x + qq.x) / 2 + (-dy / len) * off;
        const ly = (p.y + qq.y) / 2 + (dx / len) * off;
        return (
          <g key={`v${i}`}>
            <VectorArrow from={ar.from} to={ar.to} frame={frame} color={ar.color}
              width={ar.width} dashed={ar.dashed} opacity={ar.opacity} />
            <text x={lx} y={ly} fill={ar.color} fontSize={15} fontWeight={800} fontStyle="italic"
              textAnchor="middle" dominantBaseline="middle" opacity={ar.opacity ?? 1}
              style={{ pointerEvents: 'none' }}>
              {ar.label}
            </text>
          </g>
        );
      })}
      <Dot at={{ x: 0, y: 0 }} frame={frame} color={C.amber} r={3.5} />
    </>
  );
}

// ── Sidebar pieces ────────────────────────────────────────────────────────────

function ReadoutPanel({ rows }: { rows: NonNullable<ArchetypeResult['readouts']> }) {
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.cardBorder }}>
      {rows.map((r, i) => (
        <div key={i} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{r.label}</span>
          <span className="tabular-nums" style={{ color: r.color || C.text, fontSize: r.strong ? 16 : 13, fontWeight: r.strong ? 900 : 700 }}>
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * The live law, one line per row — never one long wrapped string.
 * Memoised on the joined content: KaTeX re-parsing on every animation frame was
 * the single most expensive thing on the board.
 */
const FormulaPanel = React.memo(function FormulaPanel({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-xl border px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.cardBorder }}>
      {lines.map((l, i) => (
        <div key={i} className="overflow-x-auto py-[3px] text-[13px]" style={{ color: i === 0 ? C.text : C.text2 }}>
          <InlineMarkdown>{l}</InlineMarkdown>
        </div>
      ))}
    </div>
  );
}, (a, b) => a.lines.join('\u0001') === b.lines.join('\u0001'));

function Pill({ tone, children }: { tone: 'ok' | 'no' | 'info'; children: React.ReactNode }) {
  const map = {
    ok: { bg: 'rgba(52,211,153,0.13)', fg: C.emeraldLight, bd: 'rgba(52,211,153,0.4)' },
    no: { bg: 'rgba(248,113,113,0.12)', fg: C.red, bd: 'rgba(248,113,113,0.4)' },
    info: { bg: 'rgba(129,140,248,0.12)', fg: C.indigoLight, bd: 'rgba(129,140,248,0.35)' },
  }[tone];
  return (
    <span className="rounded-md px-2 py-0.5 text-[11px] font-bold"
      style={{ background: map.bg, color: map.fg, border: `1px solid ${map.bd}` }}>
      {children}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function VectorBoard({ block }: { block: VectorBoardBlock }) {
  const def = ARCHETYPES[block.archetype];

  // Keyed on CONTENT, not on object identity. The books-editor recreates block
  // objects on every keystroke (it autosaves on a debounce), so a reference-keyed
  // memo/effect re-seeded the vectors continuously — which both reset a student's
  // drag mid-gesture and starved the draw-in timer badly enough that a 550ms
  // stage took ~2s to finish. Measured, not guessed.
  const specsKey = JSON.stringify(block.vectors?.length ? block.vectors : def?.defaultVectors ?? []);
  const specs: VectorSpec[] = useMemo(
    () => (block.vectors?.length ? block.vectors : def?.defaultVectors ?? []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [specsKey]
  );

  const steps = block.steps ?? def?.defaultSteps;
  const guided = !!block.guided && !!steps?.length;
  const stepCount = steps?.length ?? 0;

  const show: ShowFlags = { ...DEFAULT_SHOW, ...(def?.defaultShow || {}), ...(block.show || {}) };
  const units = block.units ?? '';
  const params = block.params ?? {};
  const height = block.height ?? 420;

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [vecs, setVecs] = useState<Vec2[]>(() => seedVectors(specs));
  const [step, setStep] = useState(guided ? 0 : ALL_STEPS);
  const [t, setT] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [touched, setTouched] = useState(false);

  // Exercise state.
  const [guess, setGuess] = useState<number | null>(null);
  const [entry, setEntry] = useState('');
  const [checked, setChecked] = useState(false);
  // Latched: once the target is hit it stays hit (see rule 3 at the top).
  const [everMatched, setEverMatched] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setVecs(seedVectors(specs)); }, [specsKey]);

  // ── Derived state. Computed BEFORE any early return so the latch effect below
  // stays an unconditional hook. (`identify` blocks run no construction.)
  const activeDef = block.identify ? undefined : def;
  const tgt = block.target;

  // Frame — see computeFrame() below. Author `params.origin_x/origin_y/scale`
  // always win outright (manual override); an archetype's own defaultFrame is
  // the next-highest priority; otherwise the frame is DERIVED from the
  // real content bounding box (see frame.ts — it fits and centres that box)
  // so every board fills the canvas instead of the old flat 20px/unit default.
  const frame: Frame = useMemo(
    () => computeFrame(activeDef, specs, params, tgt),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeDef, specsKey, params, tgt?.resultant_mag]
  );

  const result: ArchetypeResult | null = activeDef
    ? activeDef.build({ vecs, specs, params, units, show, step, t })
    : null;

  let nowMatched = false;
  let goalArrow: Vec2 | null = null;
  let magNow: number | null = null;
  let angNow: number | null = null;
  if (tgt && result?.resultant) {
    const r = result.resultant;
    magNow = magnitude(r);
    angNow = angle360(r);
    const magOk = tgt.resultant_mag === undefined || Math.abs(magNow - tgt.resultant_mag) <= (tgt.tolerance ?? 0.5);
    // Shortest angular distance, so 359° and 1° read as 2° apart — not 358°.
    const angDiff = tgt.resultant_angle === undefined ? 0
      : Math.abs(((((angNow - tgt.resultant_angle + 180) % 360) + 360) % 360) - 180);
    const angOk = tgt.resultant_angle === undefined || angDiff <= (tgt.angle_tolerance ?? 5);
    nowMatched = magOk && angOk;
    if ((tgt.show_goal ?? true) && tgt.resultant_mag !== undefined && tgt.resultant_angle !== undefined) {
      goalArrow = fromPolar(tgt.resultant_mag, tgt.resultant_angle);
    }
  }

  // Latch success from the RENDERED match, not from inside the drag handler.
  // Doing it in onChange used the previous frame's vectors, so landing exactly
  // on the goal in one motion never latched — and the panel then un-solved
  // itself as soon as the student moved again.
  useEffect(() => {
    if (nowMatched) setEverMatched(true);
  }, [nowMatched]);

  const matched = everMatched || nowMatched;

  // Reveal animation for the stage just unlocked.
  useEffect(() => {
    if (!animating) return;
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / STEP_MS);
      setT(p);
      if (p >= 1) setAnimating(false);
    }, FRAME_MS);
    return () => clearInterval(id);
  }, [animating]);

  // ── identify mode ───────────────────────────────────────────────────────────
  // Before the archetype lookup: each candidate carries its own literal vectors,
  // so an identify block never runs a construction.
  if (block.identify) {
    const idf = block.identify;
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const W = 210;
    const H = 180;
    const sharedFrame = autoFit(idf.options.flatMap((o) => literalArrows(o.vectors)), W, H);
    return (
      <div className="rounded-2xl border p-4" style={{ background: C.root, borderColor: C.cardBorder }}>
        <div className="mb-3 flex items-start gap-2">
          <Pill tone="info">Which diagram?</Pill>
          <p className="text-sm" style={{ color: C.text }}><InlineMarkdown>{idf.prompt}</InlineMarkdown></p>
        </div>
        {/* ONE frame for every option: a "which diagram is right?" question is
            a comparison, so the candidates must be drawn at the same scale.
            Fitting each independently silently rescaled them. */}
        <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
          {idf.options.map((opt, i) => {
            const arrows = literalArrows(opt.vectors);
            const f = sharedFrame;
            const isRight = i === idf.correct_index;
            const picked = guess === i;
            const border = guess === null ? C.cardBorder
              : isRight ? 'rgba(52,211,153,0.55)'
              : picked ? 'rgba(248,113,113,0.55)' : C.cardBorder;
            return (
              <button key={i} onClick={() => guess === null && setGuess(i)} disabled={guess !== null}
                className="flex flex-col items-stretch gap-1.5 rounded-xl border p-2 text-left transition-all"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: border, cursor: guess === null ? 'pointer' : 'default' }}>
                <div className="flex items-center justify-between" style={{ minHeight: 20 }}>
                  <span className="text-xs font-semibold" style={{ color: C.text2 }}>{letters[i]}</span>
                  {guess !== null && isRight && <Pill tone="ok">correct</Pill>}
                  {guess !== null && picked && !isRight && <Pill tone="no">your pick</Pill>}
                </div>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', background: 'rgba(0,0,0,0.25)', borderRadius: 10 }}>
                  {/* Local crosshairs — the shared <Axes> is sized to the full board viewBox. */}
                  <line x1={0} y1={f.originY} x2={W} y2={f.originY} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
                  <line x1={f.originX} y1={0} x2={f.originX} y2={H} stroke="rgba(255,255,255,0.16)" strokeWidth={1} />
                  {arrows.map((ar, k) => (
                    <VectorArrow key={k} from={ar.from} to={ar.to} frame={f} color={ar.color} label={ar.label} width={3} />
                  ))}
                  <Dot at={{ x: 0, y: 0 }} frame={f} color={C.amber} r={3} />
                </svg>
                {opt.caption && <span className="text-[11px]" style={{ color: C.muted }}>{opt.caption}</span>}
              </button>
            );
          })}
        </div>
        {guess !== null && (
          <div className="mt-3 rounded-xl border px-3 py-2 text-sm"
            style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.cardBorder, color: C.text2 }}>
            <InlineMarkdown>{idf.explanation}</InlineMarkdown>
          </div>
        )}
      </div>
    );
  }

  if (!def) {
    return (
      <div className="rounded-xl py-8 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.cardBorder}` }}>
        <p className="text-sm" style={{ color: C.muted }}>
          Vector archetype <code style={{ color: C.amber }}>{block.archetype}</code> not found.
        </p>
      </div>
    );
  }

  // ── interactive archetype board ─────────────────────────────────────────────
  const numeric = block.numeric;
  const entryVal = parseFloat(entry);
  const numericOk = numeric && checked && Number.isFinite(entryVal)
    ? Math.abs(entryVal - numeric.answer) <= (numeric.tolerance ?? 0.1) : false;

  const built = !guided || step >= stepCount;
  const canDrag = built && !animating;
  const anyDraggable = specs.some((s) => s.draggable);

  // A click during the draw-in SKIPS to the end rather than being swallowed.
  // A disabled button silently eats impatient taps and reads as "broken".
  const advance = () => {
    if (animating) { setT(1); setAnimating(false); return; }
    setStep((s) => s + 1);
    setT(0);
    setAnimating(true);
  };
  const reset = () => {
    setVecs(seedVectors(specs));
    setStep(guided ? 0 : ALL_STEPS);
    setT(1);
    setAnimating(false);
    setTouched(false);
  };

  return (
    <div className="rounded-2xl border p-3 md:p-4" style={{ background: C.root, borderColor: C.cardBorder }}>
      {/* items-start: sidebar growth must never stretch (and so resize) the canvas. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[7fr_5fr] lg:items-start">
        {/* ── Canvas column ── */}
        <div className="flex flex-col gap-2">
          <div className="relative overflow-hidden" style={{ ...canvasStyle, height }}>
            <svg ref={svgRef} width="100%" height="100%" viewBox={`0 0 ${VIEW.w} ${VIEW.h}`} style={{ touchAction: 'none', display: 'block' }}>
              <Scene result={result!} frame={frame} show={show} />

              {/* Goal marker for a `target` exercise. */}
              {goalArrow && (
                <VectorArrow from={{ x: 0, y: 0 }} to={goalArrow} frame={frame}
                  color={matched ? C.emeraldLight : C.ghost} label="goal" width={2.5} dashed opacity={0.85} />
              )}
              {tgt && !goalArrow && (tgt.show_goal ?? true) && tgt.resultant_mag !== undefined && (
                <circle cx={toScreen({ x: 0, y: 0 }, frame).x} cy={toScreen({ x: 0, y: 0 }, frame).y}
                  r={tgt.resultant_mag * frame.scale} fill="none"
                  stroke={matched ? C.emeraldLight : C.ghost} strokeWidth={1.5} strokeDasharray="6 6" opacity={0.7} />
              )}

              {/* Drag handles. Rendered whenever the construction is complete —
                  NOT gated on an animation flag, which previously left every
                  guided board completely dead to the pointer. */}
              {canDrag && specs.map((s, i) => s.draggable ? (
                <g key={i}>
                  {/* "Grab me" halo, until the student actually drags something. */}
                  {!touched && (
                    <circle cx={toScreen(add(tailOf(vecs, specs, i), vecs[i]), frame).x}
                      cy={toScreen(add(tailOf(vecs, specs, i), vecs[i]), frame).y}
                      r={16} fill="none" stroke={accentOf(s.color)} strokeWidth={2} opacity={0.55}>
                      <animate attributeName="r" values="13;20;13" dur="1.6s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.6s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <DraggableHead
                    value={add(tailOf(vecs, specs, i), vecs[i])}
                    tail={tailOf(vecs, specs, i)}
                    frame={frame}
                    svgRef={svgRef}
                    color={accentOf(s.color)}
                    angleSnap={numParam(params, 'angle_snap', 0)}
                    gridSnap={params.grid_snap === true}
                    /* Derived FROM the frame, not a fixed constant: the frame now
                       fits the content tightly, so the cap has to be whatever
                       still keeps the tip on canvas from THIS vector's tail. An
                       explicit author `max_mag` still wins. */
                    maxMag={numParam(params, 'max_mag', maxMagForTail(frame, tailOf(vecs, specs, i)))}
                    onChange={(world) => {
                      if (!touched) setTouched(true);
                      const tail = tailOf(vecs, specs, i);
                      const next = [...vecs];
                      let v: Vec2 = { x: world.x - tail.x, y: world.y - tail.y };
                      // lock_magnitude: the tip rides a circle, so dragging only
                      // ROTATES the vector. Needed whenever the surrounding text
                      // says "drag it round" or fixes the magnitude in a question
                      // — otherwise the student silently changes |B| too and the
                      // question no longer has the answer it claims.
                      if (params.lock_magnitude === true) {
                        const seed = seedVectors(specs)[i];
                        v = fromPolar(magnitude(seed), (Math.atan2(v.y, v.x) * 180) / Math.PI);
                      }
                      next[i] = v;
                      setVecs(next);
                    }}
                  />
                </g>
              ) : null)}
            </svg>
          </div>

          {/* Canvas footer. Fixed min-height so swapping hint text can't reflow. */}
          <div className="flex flex-wrap items-center justify-between gap-2" style={{ minHeight: 34 }}>
            <p className="text-[11px] leading-snug" style={{ color: C.muted, maxWidth: '58%' }}>
              {canDrag && anyDraggable
                ? (touched ? 'Drag any glowing tip to change the vectors.' : '👆 Drag a glowing tip to change the vectors.')
                : guided && !built ? `Step ${step + 1} of ${stepCount}` : ''}
            </p>
            <button onClick={reset}
              className="rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.cardBorder}`, color: C.text2 }}>
              {guided ? 'Start over' : 'Reset'}
            </button>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-3">
          {/* Guided teaching panel — the statement comes BEFORE the drawing. */}
          {guided && steps && (
            <div className="rounded-xl border px-3 py-3"
              style={{ background: built ? 'rgba(52,211,153,0.06)' : 'rgba(129,140,248,0.07)',
                borderColor: built ? 'rgba(52,211,153,0.28)' : 'rgba(129,140,248,0.28)' }}>
              <div className="mb-2 flex items-center gap-1.5">
                {steps.map((_, i) => (
                  <span key={i} className="h-1.5 flex-1 rounded-full"
                    style={{ background: i < step ? C.emeraldLight : i === step ? C.indigoMid : 'rgba(255,255,255,0.09)' }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed" style={{ color: C.text }}>
                <InlineMarkdown>
                  {built ? 'That is the whole construction. Now drag the tips and watch every number follow.' : steps[step].say}
                </InlineMarkdown>
              </p>
              {!built && (
                <button onClick={advance}
                  className="mt-3 w-full rounded-lg px-3 py-2 text-[12px] font-black uppercase tracking-wider transition-all"
                  style={{
                    background: 'linear-gradient(135deg,#6366f1,#818cf8)',
                    border: '1px solid rgba(129,140,248,0.5)',
                    color: '#fff',
                    cursor: 'pointer',
                  }}>
                  {animating ? 'Skip →' : `${steps[step].cta} →`}
                </button>
              )}
            </div>
          )}

          {show.readout && result!.readouts?.length ? <ReadoutPanel rows={result!.readouts!} /> : null}
          {show.formula && result!.formula?.length ? <FormulaPanel lines={result!.formula!} /> : null}

          {/* target — drag-to-match, with live closeness feedback */}
          {tgt && (
            <div className="rounded-xl border px-3 py-2.5"
              style={{ background: matched ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.02)',
                borderColor: matched ? 'rgba(52,211,153,0.4)' : C.cardBorder }}>
              <div className="mb-1.5 flex items-center gap-2">
                <Pill tone={matched ? 'ok' : 'info'}>{matched ? 'Solved' : 'Your task'}</Pill>
              </div>
              <p className="text-sm" style={{ color: C.text }}><InlineMarkdown>{tgt.prompt}</InlineMarkdown></p>

              {/* Live "how close am I" strip — without this a student has no idea
                  whether dragging is helping. */}
              {!matched && magNow !== null && (
                <div className="mt-2 flex flex-col gap-1">
                  {tgt.resultant_mag !== undefined && (
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span style={{ color: C.muted }}>now <b style={{ color: C.text }}>{magNow.toFixed(1)}</b> {units}</span>
                      <span style={{ color: C.amber }}>
                        {magNow < tgt.resultant_mag ? 'make it longer ↑' : 'make it shorter ↓'}
                      </span>
                      <span style={{ color: C.muted }}>goal <b style={{ color: C.emeraldLight }}>{tgt.resultant_mag}</b> {units}</span>
                    </div>
                  )}
                  {tgt.resultant_angle !== undefined && angNow !== null && (
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span style={{ color: C.muted }}>now <b style={{ color: C.text }}>{angNow.toFixed(0)}°</b></span>
                      <span style={{ color: C.muted }}>goal <b style={{ color: C.emeraldLight }}>{tgt.resultant_angle}°</b></span>
                    </div>
                  )}
                </div>
              )}

              {matched && (
                <p className="mt-2 text-sm" style={{ color: C.emeraldLight }}>
                  <InlineMarkdown>{tgt.success}</InlineMarkdown>
                </p>
              )}
            </div>
          )}

          {/* numeric — type the answer */}
          {numeric && (
            <div className="rounded-xl border px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.cardBorder }}>
              <p className="mb-2 text-sm" style={{ color: C.text }}><InlineMarkdown>{numeric.prompt}</InlineMarkdown></p>
              <div className="flex items-center gap-2">
                <input type="number" inputMode="decimal" value={entry}
                  onChange={(e) => { setEntry(e.target.value); setChecked(false); }}
                  placeholder="answer"
                  className="w-24 rounded-lg border px-2.5 py-1.5 text-sm tabular-nums outline-none"
                  style={{ background: C.card, borderColor: C.cardBorder, color: C.text }} />
                {numeric.unit && <span className="text-xs font-bold" style={{ color: C.muted }}>{numeric.unit}</span>}
                <button onClick={() => setChecked(true)} disabled={entry === ''}
                  className="rounded-lg px-3 py-1.5 text-[11px] font-black uppercase tracking-wider"
                  style={{
                    background: entry === '' ? 'rgba(255,255,255,0.04)' : 'rgba(99,102,241,0.18)',
                    border: `1px solid ${entry === '' ? C.cardBorder : 'rgba(129,140,248,0.4)'}`,
                    color: entry === '' ? C.muted : C.indigoLight,
                    cursor: entry === '' ? 'default' : 'pointer',
                  }}>
                  Check
                </button>
                {checked && <Pill tone={numericOk ? 'ok' : 'no'}>{numericOk ? 'Correct' : 'Not yet'}</Pill>}
              </div>
              {checked && (
                <p className="mt-2 text-sm" style={{ color: C.text2 }}><InlineMarkdown>{numeric.worked_reveal}</InlineMarkdown></p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
