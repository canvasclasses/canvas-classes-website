/*
 * energy/lib/track.ts — the track the STUDENT draws, as pure geometry.
 * ─────────────────────────────────────────────────────────────────────────────
 * PURE. No React, no DOM, no dependencies — so `scripts/verify-mechanics-phase2.mjs`
 * executes it with a plain node run (PHYSICS_SIMULATION_PROGRAM.md §9: "no
 * academic claim ships unverified").
 *
 * A track is an ordered list of control points with STRICTLY INCREASING x, so
 * every segment is a straight ramp of one constant slope. That is not a
 * simplification for drawing convenience — it is what makes the energy ledger
 * ANALYTIC rather than integrated, and an analytic ledger is the only kind that
 * can be shown to conserve energy to 1e-9 in front of a student who has just
 * been told it does.
 *
 * CONVENTION (shared with the rest of E1): x right, y UP, metres, SI.
 */

export interface TrackPoint { x: number; y: number }

/** One straight ramp between two control points. */
export interface Segment {
  index: number;
  from: TrackPoint;
  to: TrackPoint;
  /** Horizontal run (always > 0 — x is strictly increasing). */
  dx: number;
  /** Rise. Negative going downhill. */
  dy: number;
  /** Length along the ramp. */
  len: number;
  /** cos of the slope angle = dx / len. Always in (0, 1]. */
  cos: number;
  /** sin of the slope angle = dy / len. Signed: negative downhill. */
  sin: number;
  /** Slope in degrees, signed. Negative downhill. */
  slopeDeg: number;
  /** Arc length at `from`, measured from the start of the track. */
  s0: number;
}

/** Minimum horizontal gap between two control points, metres. Below this a
 *  segment is a vertical wall, which no sliding body can be on. */
export const MIN_DX = 0.12;

/**
 * Sort by x and push points apart until every gap is at least MIN_DX.
 *
 * The student drags control points freely, so two of them WILL cross. Rejecting
 * the drag would make the handle stick; silently allowing dx ≤ 0 would divide by
 * zero inside the ledger and paint NaN. Shifting the later point is the only
 * option that keeps the gesture alive and the physics finite.
 */
export function normaliseTrack(points: TrackPoint[]): TrackPoint[] {
  const out = [...points]
    .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y))
    .sort((a, b) => a.x - b.x)
    .map((p) => ({ x: p.x, y: p.y }));
  for (let i = 1; i < out.length; i++) {
    if (out[i].x - out[i - 1].x < MIN_DX) out[i].x = out[i - 1].x + MIN_DX;
  }
  return out;
}

/** The straight ramps of a track. Empty for fewer than two points. */
export function segmentsOf(points: TrackPoint[]): Segment[] {
  const pts = normaliseTrack(points);
  const segs: Segment[] = [];
  let s0 = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const from = pts[i];
    const to = pts[i + 1];
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    segs.push({
      index: i, from, to, dx, dy, len,
      cos: dx / len, sin: dy / len,
      slopeDeg: (Math.atan2(dy, dx) * 180) / Math.PI,
      s0,
    });
    s0 += len;
  }
  return segs;
}

/** Total length along the track, metres. */
export function trackLength(points: TrackPoint[]): number {
  const segs = segmentsOf(points);
  return segs.length ? segs[segs.length - 1].s0 + segs[segs.length - 1].len : 0;
}

/** Total horizontal run, metres. Equals the length only on a flat track. */
export function trackRun(points: TrackPoint[]): number {
  const pts = normaliseTrack(points);
  return pts.length >= 2 ? pts[pts.length - 1].x - pts[0].x : 0;
}

export interface TrackPose { x: number; y: number; segment: Segment; u: number }

/**
 * Position at arc length `s` from the start, plus the segment it is on and how
 * far along that segment (`u`, metres). Clamped at both ends.
 */
export function poseAtS(points: TrackPoint[], s: number): TrackPose | null {
  const segs = segmentsOf(points);
  if (!segs.length) return null;
  const total = segs[segs.length - 1].s0 + segs[segs.length - 1].len;
  const sc = Math.min(Math.max(s, 0), total);
  let seg = segs[segs.length - 1];
  for (const g of segs) {
    if (sc <= g.s0 + g.len + 1e-12) { seg = g; break; }
  }
  const u = Math.min(Math.max(sc - seg.s0, 0), seg.len);
  return {
    x: seg.from.x + seg.cos * u,
    y: seg.from.y + seg.sin * u,
    segment: seg,
    u,
  };
}

/** Height of the track at a horizontal position. Clamped outside the span. */
export function heightAtX(points: TrackPoint[], x: number): number {
  const pts = normaliseTrack(points);
  if (!pts.length) return 0;
  if (x <= pts[0].x) return pts[0].y;
  if (x >= pts[pts.length - 1].x) return pts[pts.length - 1].y;
  for (let i = 0; i < pts.length - 1; i++) {
    if (x <= pts[i + 1].x) {
      const f = (x - pts[i].x) / (pts[i + 1].x - pts[i].x);
      return pts[i].y + f * (pts[i + 1].y - pts[i].y);
    }
  }
  return pts[pts.length - 1].y;
}

/** Lowest and highest points on the track. */
export function trackExtent(points: TrackPoint[]): { minX: number; maxX: number; minY: number; maxY: number } {
  const pts = normaliseTrack(points);
  if (!pts.length) return { minX: 0, maxX: 1, minY: 0, maxY: 1 };
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}
