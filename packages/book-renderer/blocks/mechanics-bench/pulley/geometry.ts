'use client';

/*
 * pulley/geometry.ts — world → screen, and the rope-segment walk.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM. Everything the canvas draws and everything the ledger
 * measures comes from here, so a length shown in the ledger is the same number
 * the SVG drew — they cannot drift apart into two versions of the truth.
 *
 * The segment walk is deliberately NOT a lookup of known pulley cases: it walks
 * `StringLink.path` in consecutive pairs, exactly as the constraint deriver
 * does. A node may repeat in a path (a block and tackle reeves the same sheave
 * several times) and that is handled by construction, not by a special case.
 *
 * CONVENTION: world coordinates are physics coordinates — x right, y UP. This
 * file is the only place in Pulley Lab that flips y.
 */

import type { Body, Scene, Vec2 } from '../types';
import { bodyById } from '../lib/scene';
import { segmentEndpoints } from '../lib/constraints';

// The canvas is a fixed viewBox with `width:100%; height:auto`. It is NEVER
// height:100% inside a flex row — a sidebar toggling would resize it and the
// whole diagram would jump. (PHYSICS_SIMULATION_PROGRAM.md §9.)
export const CANVAS_W = 660;
export const CANVAS_H = 470;

export interface View {
  /** pixels per metre */
  s: number;
  /** screen x of world x = 0 */
  ox: number;
  /** screen y of world y = 0 */
  oy: number;
}

export interface DrawSegment {
  id: string;
  stringId: string;
  /** index within its string's path */
  index: number;
  fromNode: string;
  toNode: string;
  from: Vec2;
  to: Vec2;
  /** metres, centre-to-centre */
  length: number;
  /** How many earlier segments share this same unordered node pair. Drives the
   *  parallel-lane offset so a block and tackle's falls are visibly separate
   *  rather than n coincident lines. */
  lane: number;
}

// ── Body lookup helpers ──────────────────────────────────────────────────────

export function findBody(scene: Scene, id: string): Body | undefined {
  return bodyById(scene, id) ?? scene.bodies.find((b) => b.id === id);
}

export function nodePos(scene: Scene, id: string): Vec2 {
  return findBody(scene, id)?.pos ?? { x: 0, y: 0 };
}

export function nodeRadius(scene: Scene, id: string): number {
  const b = findBody(scene, id);
  if (!b) return 0;
  if (b.shape === 'pulley') return b.radius ?? 0.16;
  return 0;
}

/** Bodies the solver reports an acceleration for — everything draggable. */
export function movableBodies(scene: Scene): Body[] {
  return scene.bodies.filter((b) => !b.fixed && typeof b.dofDeg === 'number');
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';

/**
 * The acceleration symbol for a body: 'm₁' → 'a₁', an unnumbered movable
 * sheave → 'aₚ'. Kept here (not in the archetypes) so a new archetype cannot
 * accidentally invent a third naming scheme.
 */
export function accelSymbol(b: Body, index: number): string {
  const digits = (b.label ?? '').replace(/[^₀-₉]/g, '');
  if (digits) return `a${digits}`;
  if (b.shape === 'pulley') return 'aₚ';
  return `a${SUB[Math.min(index + 1, 9)]}`;
}

/** How the student is told a positive acceleration points, from `dofDeg`. */
export function dofWord(dofDeg: number | undefined): string {
  if (typeof dofDeg !== 'number') return '';
  const d = ((dofDeg % 360) + 360) % 360;
  if (d > 247.5 && d < 292.5) return 'downward';
  if (d > 67.5 && d < 112.5) return 'upward';
  if (d <= 22.5 || d >= 337.5) return 'to the right';
  if (d > 157.5 && d < 202.5) return 'to the left';
  if (d > 22.5 && d < 67.5) return 'up the slope';
  if (d > 202.5 && d < 247.5) return 'down the slope';
  return 'along its axis';
}

// ── View fitting ─────────────────────────────────────────────────────────────

/**
 * Fit every body (plus its extent) into the fixed viewBox with padding. Pure —
 * it takes the scene, not a DOM measurement — so the diagram is identical on
 * the server-rendered skeleton and after hydration.
 */
export function fitView(scene: Scene, pad = 58): View {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const b of scene.bodies) {
    const hw = b.shape === 'pulley' ? (b.radius ?? 0.16) : (b.size?.w ?? 0.3) / 2;
    const hh = b.shape === 'pulley' ? (b.radius ?? 0.16) : (b.size?.h ?? 0.3) / 2;
    minX = Math.min(minX, b.pos.x - hw); maxX = Math.max(maxX, b.pos.x + hw);
    minY = Math.min(minY, b.pos.y - hh); maxY = Math.max(maxY, b.pos.y + hh);
  }
  if (!Number.isFinite(minX)) return { s: 100, ox: CANVAS_W / 2, oy: CANVAS_H / 2 };

  // Head-room below every body so a dragged block never leaves the frame.
  minY -= 0.55; maxY += 0.15; minX -= 0.2; maxX += 0.2;

  const w = Math.max(0.5, maxX - minX);
  const h = Math.max(0.5, maxY - minY);
  const s = Math.min((CANVAS_W - 2 * pad) / w, (CANVAS_H - 2 * pad) / h);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  return { s, ox: CANVAS_W / 2 - cx * s, oy: CANVAS_H / 2 + cy * s };
}

export function toScreen(p: Vec2, v: View): Vec2 {
  return { x: v.ox + p.x * v.s, y: v.oy - p.y * v.s };
}

// ── The rope-segment walk ────────────────────────────────────────────────────

const pairKey = (a: string, b: string) => (a < b ? `${a}|${b}` : `${b}|${a}`);

/**
 * Every drawn rope segment, in path order across every string. Segment i of a
 * path runs between node i and node i+1 — that is the whole rule, and it is the
 * same rule the constraint deriver applies to get the length-invariance terms.
 *
 * Endpoints come from `segmentEndpoints`, which snaps them to the pulleys'
 * TANGENT points. That matters twice over: the drawn rope is then the same rope
 * the equations were derived from (no "why doesn't the picture match the
 * algebra?"), and the measured length changes below are the real ones.
 */
export function segmentsOf(scene: Scene): DrawSegment[] {
  const out: DrawSegment[] = [];
  const seen = new Map<string, number>();
  for (const s of scene.strings ?? []) {
    const ends = segmentEndpoints(scene, s);
    for (let i = 0; i + 1 < s.path.length; i++) {
      const a = s.path[i];
      const b = s.path[i + 1];
      const key = pairKey(a, b);
      const lane = seen.get(key) ?? 0;
      seen.set(key, lane + 1);
      const from = ends[i]?.from ?? nodePos(scene, a);
      const to = ends[i]?.to ?? nodePos(scene, b);
      out.push({
        id: `${s.id}:${i}`,
        stringId: s.id,
        index: i,
        fromNode: a,
        toNode: b,
        from,
        to,
        length: Math.hypot(to.x - from.x, to.y - from.y),
        lane,
      });
    }
  }
  return out;
}

export function totalRopeLength(segments: DrawSegment[], stringId?: string): number {
  return segments
    .filter((s) => !stringId || s.stringId === stringId)
    .reduce((acc, s) => acc + s.length, 0);
}

/**
 * A copy of the scene with each body displaced along its own `dofDeg` axis by
 * `deltas[id]` metres. This is what makes the ledger live: the student drags,
 * every body moves the amount the constraint says it must, and the segment
 * lengths are re-measured from the moved positions. Nothing is asserted — the
 * total staying constant is a measurement, not a claim.
 */
export function displaceScene(scene: Scene, deltas: Record<string, number>): Scene {
  const any = Object.values(deltas).some((d) => d !== 0);
  if (!any) return scene;
  return {
    ...scene,
    bodies: scene.bodies.map((b) => {
      const d = deltas[b.id];
      if (!d || typeof b.dofDeg !== 'number') return b;
      const r = (b.dofDeg * Math.PI) / 180;
      return { ...b, pos: { x: b.pos.x + d * Math.cos(r), y: b.pos.y + d * Math.sin(r) } };
    }),
  };
}

// ── SVG path helpers (local — the canvas is pulley-specific) ─────────────────

/**
 * A segment in screen space. The endpoints are already tangent-accurate, so the
 * only adjustment is a perpendicular LANE offset, which keeps a block and
 * tackle's repeated falls countable instead of stacked into one thick line.
 */
export function screenSegment(
  seg: DrawSegment, v: View, laneOffsetPx = 0,
): { x1: number; y1: number; x2: number; y2: number } {
  const a = toScreen(seg.from, v);
  const b = toScreen(seg.to, v);
  const dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const px = (-dy / len) * laneOffsetPx, py = (dx / len) * laneOffsetPx;
  return { x1: a.x + px, y1: a.y + py, x2: b.x + px, y2: b.y + py };
}

/** A simple arrow as an SVG path — shaft plus a two-stroke head. */
export function arrow(x1: number, y1: number, x2: number, y2: number, head = 8): string {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h1x = x2 - head * Math.cos(ang - 0.42), h1y = y2 - head * Math.sin(ang - 0.42);
  const h2x = x2 - head * Math.cos(ang + 0.42), h2y = y2 - head * Math.sin(ang + 0.42);
  return `M ${x1} ${y1} L ${x2} ${y2} M ${h1x} ${h1y} L ${x2} ${y2} L ${h2x} ${h2y}`;
}
