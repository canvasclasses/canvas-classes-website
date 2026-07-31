/*
 * circuit-bench/lib/layout.ts — where things get DRAWN, and only that.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM.
 *
 * ⚠ NOTHING IN THE ENGINE READS POSITION. The solver and the redraw work purely
 * from shared nodes; this file exists so the canvas can animate the SAME graph
 * from the exam-style tangle the author drew into the canonical form the redraw
 * produced. If a layout number ever leaks into a physics decision, the engine
 * has re-acquired the exact bug it was built to cure.
 *
 * ⚠ Y IS DOWN here, unlike the mechanics engine. A netlist has no physical "up",
 * so board coordinates are SVG-native and there is NO y-flip anywhere in E3 —
 * which is one fewer sign convention to get wrong. `fitView` is reused from the
 * mechanics engine because centring and scaling are flip-agnostic; the
 * projection below is the local, unflipped counterpart of `worldToScreen`.
 */

import type { Circuit, CircuitComponent, Vec2 } from '../types';
import {
  boundsOf, fitView, padBounds, stableFit, unionBounds,
  type Bounds, type View,
} from '../../mechanics-bench/lib/svg';
import { ACCENT, ACCENT_2 } from '../../simulations/_shared/tokens';
import { interpolateRGB, rgbString, type RGB } from '../../simulations/_shared/spectrum';
import { activeComponents, otherEnd, pairKey } from './netlist';

export type { Bounds, View };
export { boundsOf, padBounds, unionBounds, fitView, stableFit };

/** Board units. One "cell" is the spacing between two neighbouring nodes. */
export const CELL = 100;
/** Perpendicular gap between two elements drawn between the same pair of nodes. */
export const LANE = 42;

// ── Projection (no flip — see the header) ────────────────────────────────────

export function boardToScreen(p: Vec2, view: View): { x: number; y: number } {
  return {
    x: view.w / 2 + (p.x - view.cx) * view.scale,
    y: view.h / 2 + (p.y - view.cy) * view.scale,
  };
}

export function screenToBoard(p: { x: number; y: number }, view: View): Vec2 {
  return {
    x: view.cx + (p.x - view.w / 2) / view.scale,
    y: view.cy + (p.y - view.h / 2) / view.scale,
  };
}

// ── Positions ────────────────────────────────────────────────────────────────

export type Positions = Record<string, Vec2>;

/** Authored node positions, with a deterministic ring for anything unplaced. */
export function nodePositions(circuit: Circuit): Positions {
  const out: Positions = {};
  const missing: string[] = [];
  for (const n of circuit.nodes) {
    if (n.pos) out[n.id] = { ...n.pos };
    else missing.push(n.id);
  }
  missing.forEach((id, i) => {
    const t = (i / Math.max(1, missing.length)) * Math.PI * 2;
    out[id] = { x: Math.cos(t) * 2 * CELL, y: Math.sin(t) * 2 * CELL };
  });
  return out;
}

/**
 * The CANONICAL layout: x is electrical distance from the first probe, y spreads
 * the branches that sit at the same distance.
 *
 * This is what makes the redraw legible. In the authored tangle two parallel
 * resistors can be metres apart on the page; here they are forced to the same
 * two x-positions, because that is what sharing both ends MEANS. The animation
 * between the two layouts is the lesson.
 */
export function canonicalPositions(circuit: Circuit, probes: [string, string]): Positions {
  const dA = bfsDepth(circuit, probes[0]);
  const dB = bfsDepth(circuit, probes[1]);
  const ids = circuit.nodes.map((n) => n.id);

  const rank: Record<string, number> = {};
  for (const id of ids) {
    const a = dA[id];
    const b = dB[id];
    if (a == null && b == null) rank[id] = 0.5;
    else if (a == null) rank[id] = 1;
    else if (b == null) rank[id] = 0;
    else rank[id] = a + b === 0 ? 0 : a / (a + b);
  }
  rank[probes[0]] = 0;
  rank[probes[1]] = 1;

  // Column = rounded rank, so branches of equal electrical depth line up.
  const columns = new Map<string, string[]>();
  for (const id of ids) {
    const key = rank[id].toFixed(3);
    const list = columns.get(key) ?? [];
    list.push(id);
    columns.set(key, list);
  }

  const keys = [...columns.keys()].sort((x, y) => Number(x) - Number(y));
  const span = Math.max(1, keys.length - 1);
  const out: Positions = {};
  keys.forEach((key, ci) => {
    const list = columns.get(key)!.slice().sort();
    list.forEach((id, i) => {
      out[id] = {
        x: (ci / span) * span * 1.6 * CELL,
        y: (i - (list.length - 1) / 2) * 1.35 * CELL,
      };
    });
  });
  return out;
}

function bfsDepth(circuit: Circuit, start: string): Record<string, number> {
  const depth: Record<string, number> = { [start]: 0 };
  const queue = [start];
  const comps = activeComponents(circuit);
  while (queue.length) {
    const cur = queue.shift()!;
    for (const c of comps) {
      if (c.a !== cur && c.b !== cur) continue;
      const nxt = otherEnd(c, cur);
      if (depth[nxt] != null) continue;
      depth[nxt] = depth[cur] + 1;
      queue.push(nxt);
    }
  }
  return depth;
}

// ── Element placement ────────────────────────────────────────────────────────

/** Length of the drawn symbol (zigzag, cell plates, meter circle). */
export const BODY = 56;

export interface Placement {
  id: string;
  /** Node anchors, already lane-offset for auto-placed elements. */
  from: Vec2;
  to: Vec2;
  /** The symbol sits between these two, oriented along the a → b traversal. */
  bodyFrom: Vec2;
  bodyTo: Vec2;
  mid: Vec2;
  /** Unit vector along the symbol (NOT along the straight node-to-node line
   *  when the element is elbow-routed). */
  ux: number;
  uy: number;
  /** The conductor, as a polyline from `from` to `to` through the body. */
  path: Vec2[];
  /** The two LEADS — the conductor either side of the symbol. Drawn separately
   *  so a straight line does not show through the middle of a zigzag. */
  leadA: Vec2[];
  leadB: Vec2[];
  lane: number;
  selfLoop: boolean;
}

/** Split a route at its body so the leads can be stroked around the symbol. */
function withLeads(p: Omit<Placement, 'leadA' | 'leadB'>): Placement {
  const i = p.path.findIndex((q) => q === p.bodyFrom);
  const cut = i >= 0 ? i : Math.max(1, Math.floor(p.path.length / 2) - 1);
  return { ...p, leadA: p.path.slice(0, cut + 1), leadB: p.path.slice(cut + 1) };
}

const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;

/**
 * Where each element is drawn, given the node positions.
 *
 * TWO placement modes, and the choice is the author's:
 *
 *  • no `pos` — the element sits on the straight line between its two nodes.
 *    Elements sharing a node pair are fanned into LANES, because two resistors
 *    drawn on top of each other are invisible, and a parallel pair has to LOOK
 *    like two rungs between the same two rails.
 *
 *  • authored `pos` — the element is routed with orthogonal elbows through that
 *    point, the way circuits are actually drawn. This is what lets a cell run
 *    along the bottom of a Wheatstone bridge instead of straight through the
 *    galvanometer, and what makes a ladder's shunt resistors vertical rungs.
 *    The body axis is inferred: sharing an x with either node ⇒ vertical,
 *    sharing a y ⇒ horizontal, otherwise the dominant axis of the span.
 *
 * Lanes are counted only among the elements WITHOUT an authored pos — an
 * authored element has already been put somewhere deliberate, and nudging it
 * sideways to make room would move it off the rail the author aligned it to.
 */
export function placeComponents(
  circuit: Circuit, pos: Positions, opts: { ignoreAuthored?: boolean } = {},
): Record<string, Placement> {
  const groups = new Map<string, CircuitComponent[]>();
  for (const c of circuit.components) {
    const k = pairKey(c);
    const list = groups.get(k) ?? [];
    list.push(c);
    groups.set(k, list);
  }

  const out: Record<string, Placement> = {};
  for (const [, list] of groups) {
    const auto = list.filter((c) => opts.ignoreAuthored || !c.pos);
    list.forEach((c) => {
      const a = pos[c.a] ?? { x: 0, y: 0 };
      const b = pos[c.b] ?? { x: 0, y: 0 };

      if (c.a === c.b) {
        const top = { x: a.x, y: a.y - 0.7 * CELL };
        const bodyFrom = { x: top.x - BODY / 2, y: top.y };
        const bodyTo = { x: top.x + BODY / 2, y: top.y };
        out[c.id] = withLeads({
          id: c.id, from: a, to: a, bodyFrom, bodyTo,
          mid: top, ux: 1, uy: 0, lane: 0, selfLoop: true,
          path: [a, { x: a.x - 0.35 * CELL, y: a.y - 0.35 * CELL }, bodyFrom, bodyTo,
            { x: a.x + 0.35 * CELL, y: a.y - 0.35 * CELL }, a],
        });
        return;
      }

      if (c.pos && !opts.ignoreAuthored) {
        out[c.id] = elbowRoute(c.id, a, b, c.pos);
        return;
      }

      const lane = auto.indexOf(c) - (auto.length - 1) / 2;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy * lane * LANE;
      const py = ux * lane * LANE;
      const from = { x: a.x + px, y: a.y + py };
      const to = { x: b.x + px, y: b.y + py };
      const mid = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
      const h = Math.min(BODY, len * 0.7) / 2;
      const bodyFrom = { x: mid.x - ux * h, y: mid.y - uy * h };
      const bodyTo = { x: mid.x + ux * h, y: mid.y + uy * h };
      out[c.id] = withLeads({
        id: c.id, from, to, bodyFrom, bodyTo, mid, ux, uy, lane, selfLoop: false,
        path: [from, bodyFrom, bodyTo, to],
      });
    });
  }
  return out;
}

/** a → elbow → BODY → elbow → b, all right angles. */
function elbowRoute(id: string, a: Vec2, b: Vec2, at: Vec2): Placement {
  const vertical = near(at.x, a.x) || near(at.x, b.x)
    ? true
    : near(at.y, a.y) || near(at.y, b.y)
      ? false
      : Math.abs(b.y - a.y) > Math.abs(b.x - a.x);

  const h = BODY / 2;
  if (vertical) {
    const lo = Math.min(a.y, b.y);
    const hi = Math.max(a.y, b.y);
    const cy = Math.max(lo + h, Math.min(hi - h, at.y));
    const dir = b.y >= a.y ? 1 : -1;
    const e1 = { x: at.x, y: a.y };
    const e2 = { x: at.x, y: b.y };
    const bodyFrom = { x: at.x, y: cy - dir * h };
    const bodyTo = { x: at.x, y: cy + dir * h };
    return withLeads({
      id, from: a, to: b, bodyFrom, bodyTo, mid: { x: at.x, y: cy },
      ux: 0, uy: dir, lane: 0, selfLoop: false,
      path: [a, e1, bodyFrom, bodyTo, e2, b],
    });
  }
  const lo = Math.min(a.x, b.x);
  const hi = Math.max(a.x, b.x);
  const cx = Math.max(lo + h, Math.min(hi - h, at.x));
  const dir = b.x >= a.x ? 1 : -1;
  const e1 = { x: a.x, y: at.y };
  const e2 = { x: b.x, y: at.y };
  const bodyFrom = { x: cx - dir * h, y: at.y };
  const bodyTo = { x: cx + dir * h, y: at.y };
  return withLeads({
    id, from: a, to: b, bodyFrom, bodyTo, mid: { x: cx, y: at.y },
    ux: dir, uy: 0, lane: 0, selfLoop: false,
    path: [a, e1, bodyFrom, bodyTo, e2, b],
  });
}

/** Everything the board has to hold: node dots, symbols and every elbow. */
export function circuitBounds(
  circuit: Circuit, pos: Positions, opts: { ignoreAuthored?: boolean } = {},
): Bounds | null {
  const pts: Vec2[] = Object.values(pos);
  for (const p of Object.values(placeComponents(circuit, pos, opts))) {
    pts.push(...p.path);
  }
  const b = boundsOf(pts);
  return b ? padBounds(b, 0.45 * CELL) : null;
}

// ── Colour + width encodings ─────────────────────────────────────────────────

const LOW: RGB = hexToRgb(ACCENT_2);     // sky — the low-potential end
const HIGH: RGB = hexToRgb(ACCENT);      // violet — the high-potential end
const MID: RGB = [226, 232, 240];        // TEXT.primary, the neutral middle

function hexToRgb(hex: string): RGB {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/**
 * Node colour from potential — the heatmap.
 *
 * TWO ACCENTS, no more (workflow §3): sky at the bottom of the range, violet at
 * the top, through a neutral middle. Two nodes the same colour are at the same
 * potential, which is exactly the fact the symmetry shortcut turns on.
 */
export function potentialColor(v: number, lo: number, hi: number, alpha = 1): string {
  if (!Number.isFinite(v)) return rgbString(MID, alpha);
  const span = hi - lo;
  const t = span <= 1e-12 ? 0.5 : (v - lo) / span;
  return rgbString(interpolateRGB([[0, LOW], [0.5, MID], [1, HIGH]], clamp01(t)), alpha);
}

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/**
 * Stroke width from current — and the reason it is a SQUARE ROOT.
 *
 * Linear width makes a 0.1 A branch beside a 2 A branch a hairline nobody can
 * see; a log scale makes zero impossible to express. √|I| keeps a small current
 * visible while a zero current still lands exactly on the floor — which is the
 * point: a zero-current branch has to VISIBLY stop, not merely get thin.
 */
export function currentWidth(i: number, peak: number, maxPx = 9): number {
  const a = Math.abs(i);
  if (a < 1e-12 || peak <= 0) return 0;
  return 1.4 + (maxPx - 1.4) * Math.sqrt(Math.min(1, a / peak));
}

/** Dash-offset animation phase for a flowing current, in board units. */
export function flowPhase(i: number, t: number, peak: number): number {
  if (peak <= 0) return 0;
  return -t * 60 * (i / peak);
}
