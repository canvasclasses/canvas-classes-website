/*
 * optics-bench/lib/trace.ts — THE RAY TRACER. Surface by surface, no shortcuts.
 * ─────────────────────────────────────────────────────────────────────────────
 * A ray starts at a point with a direction. It finds the nearest surface ahead
 * of it, does whatever that surface does, and repeats. That is the whole
 * algorithm, and it is the reason the following are NOT special-cased anywhere:
 *
 *   • a ray that misses the lens             → it hit the holder instead
 *   • total internal reflection              → Snell's law had no solution
 *   • spherical aberration                   → spheres do not focus perfectly
 *   • the image of a compound instrument     → the second lens simply receives
 *                                              rays that already passed the first
 *
 * The thin-lens formula is still available (`formula.ts`) and is used for the
 * READOUT panel. Where the two disagree, the sim says so rather than quietly
 * drawing the formula's answer. That disagreement is the lesson.
 *
 * SIGN CONVENTION IN FORCE: NCERT Cartesian. Light travels +x; distances are
 * measured from each element's pole; +y is up. Nothing in this file re-derives
 * a sign — the conversions live in `convention.ts`.
 *
 * Pure. No React, no DOM.
 */

import type {
  Bench, LightSource, OpticalElement, RaySegment, TracedRay, TraceResult, ImageResult, Vec2,
} from '../types';
import {
  add, dirFromDeg, dot, mul, perp, sub, unit,
} from './vec';
import { refract, reflect } from './vec';
import {
  buildSurfaces, entryX, intersect, type Hit, type Surface,
} from './surfaces';
import { cartesianFocal, isPowered, N_AIR, NEAR_POINT_CM } from './convention';
import { criticalAngleDeg, indexAt } from './formula';
import {
  angularMagnification, apparentAngle, fitBundle, imageFromFits,
  type BundleFit, type BundleLine,
} from './image';

// ── Tuning constants, all of them named ──────────────────────────────────────

/** cm. How far past the last surface an escaping ray is drawn. */
const FAR_CM = 260;
/** Hard stop on the march. A fibre bouncing down a 60 cm guide is the greedy
 *  case; 400 leaves room for it without letting a numerical trap spin. */
const MAX_STEPS = 400;
/** cm. Minimum forward travel before a surface can be hit again — stops a ray
 *  re-hitting the surface it just left. */
const T_MIN = 1e-7;
/** Two hits closer together than this are a tie. */
const TIE = 1e-6;
/** cm. Height of the invisible probe ray used to define magnification for an
 *  on-axis object, which otherwise has no height to magnify. */
const PROBE_H = 0.25;

export type RayRole = 'fan' | 'construction' | 'chief' | 'probe';

export interface RayMeta {
  bundleId: string;
  sourceId: string;
  role: RayRole;
  wavelength: number;
  /** Height of the object point this ray started from. */
  originY: number;
}

export interface TraceEvent {
  rayId: string;
  elementId: string;
  surfaceId: string;
  kind: 'refract' | 'tir' | 'reflect' | 'lens' | 'blocked' | 'absorbed';
  point: Vec2;
  wavelength: number;
  incidenceDeg?: number;
  refractionDeg?: number;
  criticalDeg?: number | null;
}

/** Superset of the frozen `TraceResult` — anything typed to the contract still
 *  accepts one of these. The extras are what the UI needs and the verifier
 *  asserts on; the contract stays exactly as frozen. */
export interface OpticsTrace extends TraceResult {
  events: TraceEvent[];
  meta: Record<string, RayMeta>;
  /** Element ids in the order light actually met them — which is NOT x-order
   *  once a mirror is on the bench. */
  order: string[];
  /** Per-element image, keyed for quick lookup. */
  imageOf: Record<string, ImageResult>;
  /** Angular magnification of the whole bench, when it is meaningful. */
  angular: number | null;
  /** The transverse magnification of each imaging stage, in light order. The
   *  product of these IS the total magnification — the single fact that makes
   *  a microscope make sense. */
  stages: { elementId: string; magnification: number | null; imageX: number | null }[];
  surfaces: Surface[];
}

export interface TraceOptions {
  /** Add the three classic construction rays (parallel / through-centre /
   *  through-focus) for the first powered element. */
  constructionRays?: boolean;
  /** Trace the honest fan as well. Off, and only the construction rays are
   *  drawn — which is the `rays_are_only_three` misconception, in a setting. */
  realFan?: boolean;
  /** Let the refractive index depend on wavelength (Cauchy). Off for everything
   *  except dispersion, where it is the entire point. */
  dispersion?: boolean;
  /** Override the fan width. */
  rayCount?: number;
  /** cm. Near point, for angular magnification. */
  nearPoint?: number;
}

// ── Bundles ──────────────────────────────────────────────────────────────────

interface Bundle {
  id: string;
  sourceId: string;
  origin: Vec2;
  role: 'tip' | 'base' | 'probe';
  wavelength: number;
  /** Ray launch directions. */
  dirs: { d: Vec2; role: RayRole; from?: Vec2 }[];
}

/** The element the light meets first — what a fan should be aimed at. */
function firstTarget(bench: Bench, fromX: number): OpticalElement | null {
  const downstream = bench.elements
    .filter((e) => e.x > fromX + 1e-6)
    .sort((a, b) => a.x - b.x);
  return downstream.find((e) => isPowered(e.kind)) ?? downstream[0] ?? null;
}

function fanDirs(origin: Vec2, target: OpticalElement | null, count: number): Vec2[] {
  const out: Vec2[] = [];
  const n = Math.max(1, count);
  if (!target) {
    // Nothing to aim at — a symmetric fan so the source still reads as a source.
    for (let i = 0; i < n; i++) {
      const a = -14 + (28 * i) / Math.max(1, n - 1);
      out.push(dirFromDeg(a));
    }
    return out;
  }
  const a = target.aperture ?? 3;
  const yc = target.y ?? 0;
  // Aim across 96% of the clear aperture: a ray launched exactly at the rim
  // lands on the boundary and its fate depends on float noise, which reads as
  // a flickering ray rather than as physics.
  // Aim at the ENTRY face, not the centre: a 60 cm fibre aimed at its middle
  // is a beam launched through the side wall, which is a different experiment.
  const ex = entryX(target);
  for (let i = 0; i < n; i++) {
    const frac = n === 1 ? 0 : -1 + (2 * i) / (n - 1);
    const y = yc + frac * a * 0.96;
    out.push(unit(sub({ x: ex, y }, origin)));
  }
  return out;
}

/** The three rays every textbook draws — launched, then traced like any other. */
function constructionDirs(origin: Vec2, el: OpticalElement): { d: Vec2; role: RayRole }[] {
  const f = cartesianFocal(el);
  const yc = el.y ?? 0;
  const out: { d: Vec2; role: RayRole }[] = [];

  // 1. Parallel to the axis.
  out.push({ d: { x: 1, y: 0 }, role: 'construction' });
  // 2. Straight through the pole / optical centre.
  out.push({ d: unit(sub({ x: el.x, y: yc }, origin)), role: 'chief' });
  // 3. Through the focus (lens) or the centre of curvature (mirror).
  if (f !== null && Number.isFinite(f)) {
    const aim = el.kind === 'mirror-spherical'
      ? { x: el.x + 2 * f, y: yc }   // through C, straight back on itself
      : { x: el.x - f, y: yc };      // through F₁, emerges parallel
    let d = unit(sub(aim, origin));
    // The aim point may be BEHIND the object (object inside the focal length).
    // The ray still exists — it is the same line, travelled forwards.
    if (d.x < 0) d = mul(d, -1);
    out.push({ d, role: 'construction' });
  }
  return out;
}

function bundlesFor(bench: Bench, src: LightSource, opts: TraceOptions): Bundle[] {
  const count = opts.rayCount ?? src.rayCount ?? 9;
  const wl = src.wavelength ?? 550;
  const target = firstTarget(bench, src.x);
  const out: Bundle[] = [];

  const make = (origin: Vec2, role: 'tip' | 'base' | 'probe'): Bundle => {
    const dirs: { d: Vec2; role: RayRole; from?: Vec2 }[] = [];
    if (src.kind === 'parallel-beam') {
      // A beam from infinity: same direction, spread across the aperture.
      const d = dirFromDeg(src.beamAngleDeg ?? 0);
      const across = perp(d);
      const a = target?.aperture ?? 3;
      const yc = target?.y ?? 0;
      const ex = target ? entryX(target) : src.x + 10;
      const n = Math.max(1, count);
      for (let i = 0; i < n; i++) {
        const frac = n === 1 ? 0 : -1 + (2 * i) / (n - 1);
        // Anchor on the element's entry face so the beam always ARRIVES on the
        // glass whatever its angle, then back the launch point off upstream.
        const onGlass = add({ x: ex, y: yc + origin.y }, mul(across, frac * a * 0.94));
        const start = sub(onGlass, mul(d, Math.max(14, ex - src.x)));
        dirs.push({ d, role: role === 'probe' ? 'probe' : 'fan', from: start });
      }
    } else {
      if (opts.constructionRays && target && isPowered(target.kind) && role !== 'probe') {
        for (const c of constructionDirs(origin, target)) dirs.push(c);
      }
      if (opts.realFan !== false || role === 'probe') {
        for (const d of fanDirs(origin, target, count)) {
          dirs.push({ d, role: role === 'probe' ? 'probe' : 'fan' });
        }
      }
    }
    return { id: `${src.id}:${role}`, sourceId: src.id, origin, role, wavelength: wl, dirs };
  };

  const h = src.y ?? 0;
  if (src.kind === 'parallel-beam') {
    // A plane wave has NO transverse extent — it is defined by a direction, not
    // by a height. Splitting it into "tip" and "base" bundles offset by the
    // source's y would launch the tip bundle off-axis, where a small pupil
    // vignettes it completely; the image fit then sees an empty bundle and
    // reports "at infinity" for an eye that is focusing perfectly. One bundle,
    // and the magnification that means anything here is the angular one.
    out.push(make({ x: src.x, y: 0 }, 'base'));
    return out;
  }
  if (Math.abs(h) > 1e-9) {
    out.push(make({ x: src.x, y: h }, 'tip'));
    out.push(make({ x: src.x, y: 0 }, 'base'));
  } else {
    out.push(make({ x: src.x, y: 0 }, 'base'));
    // An on-axis point has no height, so it has no magnification either. The
    // probe supplies one — traced through exactly the same surfaces, just not
    // drawn, so the number on screen is still a traced number.
    out.push(make({ x: src.x, y: PROBE_H }, 'probe'));
  }
  return out;
}

// ── The march ────────────────────────────────────────────────────────────────

interface MarchResult {
  segments: RaySegment[];
  terminated?: TracedRay['terminated'];
  events: TraceEvent[];
  /** Every element this ray interacted with, in order. */
  order: string[];
  /** The last point at which the ray changed direction, and the direction it
   *  left with — the emergent ray, which is what the image is fitted to. */
  emergent: { p: Vec2; d: Vec2 } | null;
}

function nOf(s: Surface, side: 'in' | 'out', wl: number, dispersion: boolean): number {
  const base = side === 'in' ? (s.nInside ?? 1.5) : (s.nOutside ?? N_AIR);
  if (!dispersion || side === 'out') return base;
  return indexAt(wl, base);
}

function march(
  rayId: string, start: Vec2, d0: Vec2, surfaces: Surface[],
  wl: number, dispersion: boolean,
): MarchResult {
  const segments: RaySegment[] = [];
  const events: TraceEvent[] = [];
  const order: string[] = [];
  let p = start;
  let d = unit(d0);
  let lastElement: string | undefined;
  let emergent: { p: Vec2; d: Vec2 } | null = null;
  let ignore: string | null = null;
  let terminated: TracedRay['terminated'] | undefined;

  for (let step = 0; step < MAX_STEPS; step++) {
    // Nearest surface ahead.
    let best: Hit | null = null;
    for (const s of surfaces) {
      if (s.id === ignore) continue;
      const h = intersect(s, p, d, T_MIN);
      if (!h) continue;
      if (!best) { best = h; continue; }
      if (h.t < best.t - TIE) { best = h; continue; }
      if (Math.abs(h.t - best.t) <= TIE) {
        // TIE-BREAK. An aperture that passes light is not an event, so it must
        // never win a tie against a surface that would actually do something —
        // otherwise the axial ray of a mirror consumes its step on the holder
        // and then cannot re-find the mirror it is standing on.
        if (best.surface.action === 'aperture' && h.surface.action !== 'aperture') best = h;
      }
    }

    if (!best) {
      segments.push({
        from: p, to: add(p, mul(d, FAR_CM)), real: true, wavelength: wl, fromElementId: lastElement,
      });
      terminated = 'escaped';
      emergent = { p, d };
      break;
    }

    segments.push({ from: p, to: best.point, real: true, wavelength: wl, fromElementId: lastElement });
    const s = best.surface;

    if (!best.inExtent) {
      // The holder. The ray is real and it really stops here.
      events.push({ rayId, elementId: s.elementId, surfaceId: s.id, kind: 'blocked', point: best.point, wavelength: wl });
      terminated = 'missed-element';
      break;
    }

    if (s.action === 'aperture') {
      p = best.point;
      ignore = s.id;
      continue;
    }

    if (s.action === 'absorb') {
      events.push({ rayId, elementId: s.elementId, surfaceId: s.id, kind: 'absorbed', point: best.point, wavelength: wl });
      terminated = 'absorbed';
      break;
    }

    if (order[order.length - 1] !== s.elementId) order.push(s.elementId);

    if (s.action === 'ideal-lens') {
      d = idealLensOut(d, best.point, s.centre, s.f ?? 10);
      events.push({ rayId, elementId: s.elementId, surfaceId: s.id, kind: 'lens', point: best.point, wavelength: wl });
    } else {
      // Orient the surface normal against the incoming ray. `outward` points
      // away from the glass, so a ray ENTERING has d · outward < 0.
      const entering = dot(d, best.outward) < 0;
      const n = entering ? best.outward : mul(best.outward, -1);
      if (s.action === 'reflect') {
        d = reflect(d, n);
        events.push({ rayId, elementId: s.elementId, surfaceId: s.id, kind: 'reflect', point: best.point, wavelength: wl });
      } else {
        const nOut = nOf(s, 'out', wl, dispersion);
        const nIn = nOf(s, 'in', wl, dispersion);
        const n1 = entering ? nOut : nIn;
        const n2 = entering ? nIn : nOut;
        const r = refract(d, n, n1, n2);
        d = r.dir;
        events.push({
          rayId, elementId: s.elementId, surfaceId: s.id,
          kind: r.tir ? 'tir' : 'refract', point: best.point, wavelength: wl,
          incidenceDeg: r.incidenceDeg, refractionDeg: r.refractionDeg,
          criticalDeg: criticalAngleDeg(n1, n2),
        });
      }
    }

    p = best.point;
    lastElement = s.elementId;
    ignore = s.id;
    emergent = { p, d };
  }

  if (!terminated && segments.length >= MAX_STEPS) {
    // Trapped: bouncing inside glass with nowhere to go. For a fibre that is
    // the physically right answer to "what if I bend it too far".
    terminated = 'total-internal-reflection';
  }
  return { segments, terminated, events, order, emergent };
}

/**
 * IDEAL THIN LENS — exact, not paraxial.
 *
 * IN FORCE: Cartesian, f > 0 converging. Let σ = sign(dₓ) (the direction of
 * travel), h the height of the hit above the lens centre and s = d_y/d_x the
 * ray's slope. The Gaussian mapping is
 *
 *      s' = s − σ · h / f
 *
 * Two checks that fix the signs. A ray parallel to the axis (s = 0) at height
 * h > 0 through f > 0 leaves with s' = −h/f, so it descends and crosses the
 * axis exactly f downstream: correct. A ray through the centre (h = 0) leaves
 * with s' = s: undeviated, correct. The σ makes it work for light travelling
 * back through the same lens after a mirror, which is not a corner case on a
 * bench with a mirror at the end of it.
 *
 * This is exact for every incidence angle — it is the Gaussian mapping itself,
 * not a small-angle expansion — so a `thin-lens` element has NO aberration by
 * construction. That is deliberate: it is the clean reference. `thick-lens`
 * traces real spheres and does have aberration, and an archetype can put the
 * two side by side.
 */
export function idealLensOut(d: Vec2, hit: Vec2, centre: Vec2, f: number): Vec2 {
  if (Math.abs(d.x) < 1e-9 || !Number.isFinite(f) || f === 0) return d;
  const sigma = d.x > 0 ? 1 : -1;
  const h = hit.y - centre.y;
  const s = d.y / d.x;
  const s2 = s - (sigma * h) / f;
  return unit({ x: sigma, y: sigma * s2 });
}

// ── The public entry point ───────────────────────────────────────────────────

export function traceBench(bench: Bench, opts: TraceOptions = {}): OpticsTrace {
  const surfaces = buildSurfaces(bench);
  const dispersion = !!opts.dispersion;
  const rays: TracedRay[] = [];
  const meta: Record<string, RayMeta> = {};
  const events: TraceEvent[] = [];
  const warnings: string[] = [];
  const order: string[] = [];

  /** bundleId → emergent lines, and per-element post-interaction lines. */
  const emergentOf: Record<string, BundleLine[]> = {};
  const afterElement: Record<string, Record<string, BundleLine[]>> = {};
  const bundleIndex: Record<string, Bundle> = {};

  let blocked = 0;
  let launched = 0;

  for (const src of bench.sources) {
    for (const bundle of bundlesFor(bench, src, opts)) {
      bundleIndex[bundle.id] = bundle;
      emergentOf[bundle.id] = [];
      afterElement[bundle.id] = {};

      bundle.dirs.forEach((launch, k) => {
        const rayId = `${bundle.id}#${k}`;
        const start = launch.from ?? bundle.origin;
        const r = march(rayId, start, launch.d, surfaces, bundle.wavelength, dispersion);
        launched++;
        if (r.terminated === 'missed-element') blocked++;

        for (const id of r.order) if (!order.includes(id)) order.push(id);
        events.push(...r.events);

        // Lines for the image fit: the segment that LEFT each element, and the
        // final emergent ray. Both come straight out of the trace — no formula
        // is consulted anywhere in here.
        for (const seg of r.segments) {
          if (!seg.fromElementId) continue;
          const d = unit(sub(seg.to, seg.from));
          (afterElement[bundle.id][seg.fromElementId] ??= []).push({ p: seg.from, d });
        }
        if (r.emergent && r.terminated !== 'missed-element') {
          emergentOf[bundle.id].push({ p: r.emergent.p, d: r.emergent.d });
        }

        if (launch.role !== 'probe') {
          rays.push({ id: rayId, segments: r.segments, terminated: r.terminated });
          meta[rayId] = {
            bundleId: bundle.id, sourceId: src.id, role: launch.role,
            wavelength: bundle.wavelength, originY: bundle.origin.y,
          };
        }
      });
    }
  }

  // ── Images, from the traced bundles ────────────────────────────────────────
  const primary = bench.sources[0];
  const beam = primary?.kind === 'parallel-beam';
  const axialObject = beam || !primary || Math.abs(primary.y ?? 0) <= 1e-9;
  const tipId = primary
    ? `${primary.id}:${beam ? 'base' : axialObject ? 'probe' : 'tip'}`
    : null;
  const baseId = primary ? `${primary.id}:base` : null;
  // A parallel beam has no object height, so it has no transverse magnification
  // either — only an angular one. Zero here makes `imageFromFits` return null
  // for m rather than a made-up ratio.
  const objectY = beam ? 0 : axialObject ? PROBE_H : (primary!.y ?? 0);

  const images: { elementId: string; image: ImageResult }[] = [];
  const imageOf: Record<string, ImageResult> = {};
  const stages: OpticsTrace['stages'] = [];

  // "At infinity" has to be judged against the size of the bench. A telescope in
  // normal adjustment emits a bundle parallel to about a part in 10⁵, and that
  // residual fits a crossing point ~19 m behind a 40 cm instrument. Thirty bench
  // lengths is comfortably past anything a student is meant to read as a place.
  const xs = [
    ...bench.elements.map((e) => e.x),
    ...bench.sources.map((s) => s.x),
  ];
  const span = xs.length ? Math.max(...xs) - Math.min(...xs) : 50;
  const fitOpts = { axialObject, farLimit: Math.max(400, 30 * span) };

  if (tipId && baseId) {
    for (const elId of order) {
      const tip = fitBundle(afterElement[tipId]?.[elId] ?? []);
      const base = fitBundle(afterElement[baseId]?.[elId] ?? []);
      const img = imageFromFits(tip, base, objectY, fitOpts);
      if (img) {
        images.push({ elementId: elId, image: img });
        imageOf[elId] = img;
        stages.push({ elementId: elId, magnification: img.magnification, imageX: img.x });
      }
    }
  }

  let finalImage: ImageResult | null = null;
  let angular: number | null = null;
  if (tipId && baseId) {
    const tip = fitBundle(emergentOf[tipId] ?? []);
    const base = fitBundle(emergentOf[baseId] ?? []);
    finalImage = imageFromFits(tip, base, objectY, fitOpts);
    const objAngle = primary?.kind === 'parallel-beam'
      ? apparentAngle(dirFromDeg(primary.beamAngleDeg ?? 0))
      : null;
    angular = angularMagnification(
      tip, objectY, objAngle, opts.nearPoint ?? NEAR_POINT_CM,
    );
    if (finalImage) finalImage = { ...finalImage, angular: angular ?? undefined };
  }

  // ── Construction lines for a virtual image ────────────────────────────────
  // A virtual image is where the emergent rays APPEAR to come from. No light
  // goes there, so these segments are marked real:false and the renderer dashes
  // them. Students who think a virtual image "isn't real" have understood the
  // physics and misread the word; the dashing is what shows them the difference
  // they are actually pointing at.
  if (finalImage && finalImage.x !== null && !finalImage.real) {
    const target: Vec2 = { x: finalImage.x, y: finalImage.y ?? 0 };
    for (const ray of rays) {
      const m = meta[ray.id];
      if (!m || m.role === 'probe') continue;
      if (ray.terminated === 'missed-element') continue;
      const last = ray.segments[ray.segments.length - 1];
      if (!last) continue;
      const anchor = last.from;
      // Only the bundle that formed this image gets the construction line —
      // the base bundle's virtual image is a different point on the axis.
      const isTip = m.bundleId === tipId;
      const isBase = m.bundleId === baseId;
      if (!isTip && !isBase) continue;
      const to: Vec2 = isTip ? target : { x: target.x, y: 0 };
      ray.segments.push({ from: anchor, to, real: false, wavelength: m.wavelength, fromElementId: last.fromElementId });
    }
  }

  // ── Warnings the student should actually see ──────────────────────────────
  if (blocked > 0) {
    warnings.push(
      `${blocked} of ${launched} rays were stopped by a mount or a stop. The image gets dimmer, not smaller — every remaining ray still carries the whole picture.`,
    );
  }
  const tir = events.filter((e) => e.kind === 'tir');
  if (tir.length) {
    const e = tir[0];
    warnings.push(
      `Total internal reflection: the ray met the boundary at ${e.incidenceDeg?.toFixed(1)}°, past the critical angle of ${e.criticalDeg?.toFixed(1)}°. No light gets out — all of it turns around.`,
    );
  }
  if (finalImage && finalImage.x === null) {
    warnings.push('The emergent rays are parallel, so the image is at infinity — which is exactly where a telescope and a relaxed eye put it.');
  }
  if (finalImage?.aberrated) {
    warnings.push('The rays do not all cross at one point. That is spherical aberration — the thin-lens formula in the panel is a paraxial answer, and this wide cone is not paraxial.');
  }

  return {
    rays, images, finalImage, warnings,
    events, meta, order, imageOf, angular, stages, surfaces,
  };
}
