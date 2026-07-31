'use client';

/*
 * circuit-bench/ui/CircuitCanvas.tsx — the board.
 * ─────────────────────────────────────────────────────────────────────────────
 * Draws ONE frame of a circuit: conductors, symbols, node dots, the potential
 * heatmap and the current overlay. It knows nothing about the redraw sequence —
 * the caller hands it a circuit and a set of (possibly mid-tween) positions.
 *
 * ⚠ EXACTLY ONE <text>. It is the status line, pinned top-left and structurally
 * unable to collide with anything because the content is fitted inside a padded
 * box. Every name, value, potential and current lives in the colour-keyed legend
 * BELOW the board. There is no code path here that emits a second label.
 *
 * ⚠ CURRENT IS A WIDTH, NOT A COLOUR. Colour is already spoken for by the
 * potential heatmap, and a branch carrying nothing must VISIBLY STOP rather than
 * merely go a different shade — so a zero-current branch simply has no overlay
 * stroke at all. Width goes as √|I| so a small current stays visible beside a
 * large one (see `currentWidth`).
 *
 * Pointer events throughout — never mouse events, and never gated on an
 * animation clock: a drag has to work while the redraw tween is running.
 */

import * as React from 'react';
import type { Circuit, CircuitSolution, Vec2 } from '../types';
import {
  boardToScreen, circuitBounds, currentWidth, fitView,
  placeComponents, potentialColor, screenToBoard, stableFit,
  type Positions, type View,
} from '../lib/layout';
import { isOpen } from '../lib/netlist';
import { peakCurrent, potentialRange } from '../lib/solve';
import { TEXT } from '../../simulations/_shared/tokens';
import { Glyph } from './glyphs';

export interface CircuitCanvasProps {
  circuit: Circuit;
  positions: Positions;
  solution: CircuitSolution | null;
  probes: [string, string];
  accent: string;
  accent2: string;
  showHeatmap: boolean;
  showCurrent: boolean;
  /** The ONE text on the board. */
  hint: string;
  highlightComponents?: string[];
  highlightNodes?: string[];
  selectedId?: string | null;
  /** Elements that have just been removed, fading out during a tween. */
  ghost?: { circuit: Circuit; positions: Positions; opacity: number } | null;
  /** Redraw frames ignore authored element positions — the canonical layout is
   *  the whole point of them. */
  ignoreAuthored?: boolean;
  height?: number;
  width: number;
  /** Hysteresis on the camera, so a drag cannot zoom out under the finger. */
  stable?: boolean;
  onPickComponent?: (id: string) => void;
  onPickNode?: (id: string) => void;
  onDragNode?: (id: string, at: Vec2) => void;
  onPickEmpty?: (at: Vec2) => void;
}

/** ≥44 px of grabbable area around every node and along every element. */
const TOUCH = 44;

export default function CircuitCanvas(props: CircuitCanvasProps) {
  const {
    circuit, positions, solution, probes, accent, accent2, showHeatmap, showCurrent,
    hint, highlightComponents, highlightNodes, selectedId, ghost, ignoreAuthored,
    width, height, stable, onPickComponent, onPickNode, onDragNode, onPickEmpty,
  } = props;

  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const prevView = React.useRef<View | null>(null);

  const w = Math.max(240, Math.round(width || 0) || 640);
  const h = Math.max(220, Math.round(height ?? Math.min(460, Math.max(260, w * 0.62))));

  // ── Camera ────────────────────────────────────────────────────────────────
  // padFrac is deliberately small: `circuitBounds` already pads by enough board
  // units to hold a symbol and a node dot, so padding again here is what leaves
  // a diagram swimming in a third of its own canvas.
  const view: View = React.useMemo(() => {
    const b = circuitBounds(circuit, positions, { ignoreAuthored })
      ?? { minX: -200, minY: -150, maxX: 200, maxY: 150 };
    const opts = { padFrac: 0.06, maxScale: 3, minScale: 0.02 };
    const next = stable
      ? stableFit(b, w, h, prevView.current, opts)
      : fitView(b, w, h, opts);
    prevView.current = next;
    return next;
    // `positions` is a fresh object every tween frame — that is intended.
  }, [circuit, positions, w, h, ignoreAuthored, stable]);

  const S = React.useCallback((p: Vec2) => boardToScreen(p, view), [view]);
  const places = React.useMemo(
    () => placeComponents(circuit, positions, { ignoreAuthored }),
    [circuit, positions, ignoreAuthored],
  );
  const ghostPlaces = React.useMemo(
    () => (ghost ? placeComponents(ghost.circuit, ghost.positions, { ignoreAuthored }) : {}),
    [ghost, ignoreAuthored],
  );

  const peak = solution && !solution.singular ? peakCurrent(solution) : 0;
  const range = solution && !solution.singular ? potentialRange(solution) : { lo: 0, hi: 0 };

  const hotComp = new Set(highlightComponents ?? []);
  const hotNode = new Set(highlightNodes ?? []);

  // ── Dragging a node ───────────────────────────────────────────────────────
  // Pointer capture, and NOT conditional on any animation state — the whole
  // point of the board is that moving a node changes the drawing and nothing
  // else, so it has to stay grabbable at all times.
  const dragging = React.useRef<string | null>(null);
  const moved = React.useRef(false);
  const downAt = React.useRef<{ x: number; y: number } | null>(null);
  const toBoard = React.useCallback((e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return screenToBoard(
      { x: ((e.clientX - rect.left) / rect.width) * w, y: ((e.clientY - rect.top) / rect.height) * h },
      view,
    );
  }, [view, w, h]);

  const startDrag = (id: string) => (e: React.PointerEvent) => {
    e.stopPropagation();
    dragging.current = id;
    moved.current = false;
    downAt.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
  };
  const moveDrag = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const d = downAt.current;
    // A finger never holds perfectly still. Below this it was a TAP, and a tap
    // must still be able to mean "pick this node" — otherwise wiring by tapping
    // two nodes silently stops working on a touch screen.
    if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 4) moved.current = true;
    if (!moved.current || !onDragNode) return;
    const at = toBoard(e);
    if (at) onDragNode(dragging.current, at);
  };
  const endDrag = (id: string) => (e: React.PointerEvent) => {
    const wasDragging = dragging.current === id;
    const wasTap = !moved.current;
    dragging.current = null;
    (e.currentTarget as Element).releasePointerCapture?.(e.pointerId);
    if (wasDragging && wasTap) onPickNode?.(id);
  };

  const conductorColor = (id: string) =>
    hotComp.has(id) ? accent2 : selectedId === id ? accent2 : accent;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${w} ${h}`}
      width="100%"
      height={h}
      style={{ display: 'block', touchAction: 'none' }}
      onPointerMove={moveDrag}
      onPointerDown={(e) => {
        if (!onPickEmpty) return;
        const at = toBoard(e);
        if (at) onPickEmpty(at);
      }}
    >
      {/* ── ghosts: what this step just removed, on its way out ─────────── */}
      {ghost && Object.entries(ghostPlaces).map(([id, p]) => {
        if (places[id]) return null;
        const c = ghost.circuit.components.find((x) => x.id === id);
        if (!c) return null;
        return (
          <g key={`ghost-${id}`} opacity={ghost.opacity * 0.5}>
            <polyline points={pts(p.leadA, S)} stroke={accent} strokeWidth={2} fill="none" />
            <polyline points={pts(p.leadB, S)} stroke={accent} strokeWidth={2} fill="none" />
            <Glyph kind={c.kind} from={S(p.bodyFrom)} to={S(p.bodyTo)}
              color={accent} width={2} open={c.open} dim />
          </g>
        );
      })}

      {/* ── conductors + symbols ────────────────────────────────────────── */}
      {circuit.components.map((c) => {
        const p = places[c.id];
        if (!p) return null;
        const dead = isOpen(c);
        const col = conductorColor(c.id);
        const i = solution && !solution.singular ? (solution.currents[c.id] ?? 0) : 0;
        const flow = showCurrent && peak > 0 ? currentWidth(i, peak) : 0;
        // Dash speed tracks current, but CLAMPED: an unclamped ratio turns a
        // near-zero branch into a dur of several hours, which some engines round
        // to zero and then spin at full speed — the opposite of the truth.
        const speed = peak > 0
          ? Math.min(6, Math.max(0.5, (peak / Math.max(Math.abs(i), 1e-9)) * 0.27))
          : 0;

        return (
          <g key={c.id}>
            {/* the conductor itself */}
            <polyline points={pts(p.leadA, S)} stroke={col} strokeWidth={2.1}
              fill="none" strokeLinecap="round" opacity={dead ? 0.35 : 0.8} />
            <polyline points={pts(p.leadB, S)} stroke={col} strokeWidth={2.1}
              fill="none" strokeLinecap="round" opacity={dead ? 0.35 : 0.8} />

            {/* the current overlay — absent entirely when nothing flows */}
            {flow > 0 && (
              <>
                {[p.leadA, p.leadB].map((lead, k) => (
                  <polyline key={k} points={pts(lead, S)} stroke={accent2} strokeWidth={flow}
                    fill="none" strokeLinecap="round" opacity={0.55}
                    strokeDasharray="7 11"
                    // Direction of travel. `i < 0` means the current runs b → a,
                    // so the dashes crawl the other way.
                    >
                    <animate attributeName="stroke-dashoffset"
                      values={i >= 0 ? '18;0' : '0;18'} dur={`${speed.toFixed(2)}s`}
                      repeatCount="indefinite" />
                  </polyline>
                ))}
              </>
            )}

            <Glyph kind={c.kind} from={S(p.bodyFrom)} to={S(p.bodyTo)}
              color={col} width={hotComp.has(c.id) ? 3 : 2.2} open={c.open} dim={dead} />

            {/* hit target — a fat transparent stroke, ≥44 px wide */}
            {onPickComponent && (
              <polyline points={pts(p.path, S)} stroke="transparent" strokeWidth={TOUCH}
                fill="none" style={{ cursor: 'pointer' }} pointerEvents="stroke"
                onPointerDown={(e) => { e.stopPropagation(); onPickComponent(c.id); }} />
            )}
          </g>
        );
      })}

      {/* ── node dots: the heatmap ──────────────────────────────────────── */}
      {circuit.nodes.map((n) => {
        const p = positions[n.id];
        if (!p) return null;
        const s = S(p);
        const v = solution && !solution.singular ? solution.potentials[n.id] : undefined;
        const isProbe = probes.includes(n.id);
        const fill = showHeatmap && v != null
          ? potentialColor(v, range.lo, range.hi)
          : hotNode.has(n.id) ? accent2 : accent;
        const rad = isProbe ? 8 : hotNode.has(n.id) ? 7.5 : 5.5;
        return (
          <g key={n.id}>
            {isProbe && (
              <circle cx={s.x} cy={s.y} r={rad + 5} fill="none"
                stroke={accent2} strokeWidth={1.6} opacity={0.75} />
            )}
            {n.ground && (
              <g stroke={fill} strokeWidth={1.8} strokeLinecap="round" opacity={0.9}>
                <line x1={s.x - 9} y1={s.y + 13} x2={s.x + 9} y2={s.y + 13} />
                <line x1={s.x - 5.5} y1={s.y + 17} x2={s.x + 5.5} y2={s.y + 17} />
                <line x1={s.x - 2} y1={s.y + 21} x2={s.x + 2} y2={s.y + 21} />
                <line x1={s.x} y1={s.y} x2={s.x} y2={s.y + 13} />
              </g>
            )}
            <circle cx={s.x} cy={s.y} r={rad} fill={fill}
              stroke={hotNode.has(n.id) ? '#ffffff' : 'transparent'} strokeWidth={1.5} />
            {(onPickNode || onDragNode) && (
              <circle cx={s.x} cy={s.y} r={TOUCH / 2} fill="transparent"
                style={{ cursor: onDragNode ? 'grab' : 'pointer' }}
                onPointerDown={startDrag(n.id)}
                onPointerUp={endDrag(n.id)} />
            )}
          </g>
        );
      })}

      {/* ── the ONE text on the board ───────────────────────────────────── */}
      <text x={14} y={24} fontSize={13} fontWeight={600}
        fill={TEXT.secondary} style={{ pointerEvents: 'none' }}>
        {hint}
      </text>
    </svg>
  );
}

const pts = (list: Vec2[], S: (p: Vec2) => { x: number; y: number }) =>
  list.map((p) => { const s = S(p); return `${Math.round(s.x * 10) / 10},${Math.round(s.y * 10) / 10}`; }).join(' ');
