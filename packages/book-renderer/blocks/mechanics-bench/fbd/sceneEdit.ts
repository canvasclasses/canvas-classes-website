/*
 * fbd/sceneEdit.ts — the Compose stage's pure scene algebra.
 * ─────────────────────────────────────────────────────────────────────────────
 * Design law #1 says the student is the AUTHOR, not the audience: they add the
 * bodies, tilt the wedge, set the masses and the μ. That means the scene is
 * mutable at runtime, and every mutation has to keep the scene graph internally
 * consistent — a tilted wedge is worthless if the block sitting on it keeps its
 * old contact normal.
 *
 * Everything here is PURE (Scene in → new Scene out, no mutation, no React, no
 * DOM), for the same reason `lib/*` is: the geometry can then be checked by a
 * plain node script. Nothing in this file computes physics — forces and
 * accelerations come from `lib/scene` and `lib/dynamics`. This file only
 * arranges the furniture.
 *
 * CONVENTIONS
 *  • World coords are PHYSICS coords: x right, y UP, metres, degrees CCW from +x.
 *  • A wedge is a right triangle. `pos` is its CENTROID, `size.w` the base,
 *    `size.h` the rise, `angleDeg` the incline angle θ (so h = w·tanθ). The right
 *    angle is at the base-LEFT vertex and the hypotenuse descends to the RIGHT,
 *    so a block on it slides toward +x and its down-slope direction is −θ.
 *  • Ground is the world line y = 0. It is not a body.
 */

import type {
  Body, Contact, Scene, StringLink, AppliedForce, Vec2, ReferenceFrame,
} from '../types';
import { WORLD } from '../types';
import type { MechanicsSceneSpec } from '@canvas/data/types/books';

export const DEG = Math.PI / 180;
export const G_DEFAULT = 9.8;

const round3 = (n: number) => Math.round(n * 1000) / 1000;

// ── Block-config → engine Scene ──────────────────────────────────────────────

/** Flatten an authored `MechanicsSceneSpec` into the engine's `Scene`. */
export function sceneFromSpec(spec: MechanicsSceneSpec): Scene {
  const frame: ReferenceFrame =
    spec.frame === 'accelerating'
      ? { kind: 'accelerating', a: spec.frame_accel ?? { x: 0, y: 0 } }
      : spec.frame === 'rotating'
        ? { kind: 'rotating', omega: spec.frame_omega ?? 0, centre: { x: 0, y: 0 } }
        : { kind: 'inertial' };

  return {
    bodies: spec.bodies.map((b): Body => ({
      id: b.id,
      shape: b.shape,
      mass: b.mass,
      pos: { x: b.x, y: b.y },
      size: b.w !== undefined || b.h !== undefined
        ? { w: b.w ?? 0.6, h: b.h ?? 0.4 } : undefined,
      radius: b.radius,
      angleDeg: b.angle,
      inertia: b.inertia,
      fixed: b.fixed,
      dofDeg: b.dof,
      label: b.label,
    })),
    contacts: (spec.contacts ?? []).map((c): Contact => ({
      id: c.id, bodyA: c.a, bodyB: c.b, normalDeg: c.normal,
      mu_s: c.mu_s, mu_k: c.mu_k, slidingSign: c.sliding,
    })),
    strings: (spec.strings ?? []).map((s): StringLink => ({
      id: s.id, path: s.path, taut: s.taut ?? true,
      massless: s.massless ?? true, label: s.label,
    })),
    applied: (spec.applied ?? []).map((a): AppliedForce => ({
      id: a.id, body: a.body, from: a.from, mag: a.mag, angleDeg: a.angle, label: a.label,
    })),
    g: spec.g ?? G_DEFAULT,
    frame,
  };
}

// ── Lookups ──────────────────────────────────────────────────────────────────

export const findBody = (scene: Scene, id: string): Body | undefined =>
  scene.bodies.find((b) => b.id === id);

/** Every distinct agent a student could legitimately name, for the agent picker.
 *  Ordered: the Earth first (weight is the force everyone forgets to attribute),
 *  then the world fixtures actually present, then the other bodies. */
export function agentsIn(scene: Scene, exceptBodyId: string): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [{ id: WORLD.earth, label: 'the Earth' }];
  const used = new Set<string>();
  for (const c of scene.contacts) { used.add(c.bodyA); used.add(c.bodyB); }
  for (const a of scene.applied ?? []) used.add(a.from);
  const worldLabels: Record<string, string> = {
    [WORLD.ground]: 'the ground',
    [WORLD.wall]: 'the wall',
    [WORLD.ceiling]: 'the ceiling',
    [WORLD.hand]: 'your hand',
  };
  for (const [id, label] of Object.entries(worldLabels)) if (used.has(id)) out.push({ id, label });
  for (const b of scene.bodies) {
    if (b.id === exceptBodyId) continue;
    out.push({ id: b.id, label: b.label ?? b.id });
  }
  for (const s of scene.strings) if (s.taut) out.push({ id: s.id, label: s.label ?? `string ${s.id}` });
  return out;
}

// ── Geometry ─────────────────────────────────────────────────────────────────

export interface WedgeVerts { base: Vec2; toe: Vec2; apex: Vec2 }

/** base = the right-angle (base-left) vertex, toe = base-right, apex = the top. */
export function wedgeVertices(b: Body): WedgeVerts {
  const w = b.size?.w ?? 2.4;
  const h = b.size?.h ?? w * Math.tan((b.angleDeg ?? 30) * DEG);
  const cx = b.pos.x - w / 3;
  const cy = b.pos.y - h / 3;
  return { base: { x: cx, y: cy }, toe: { x: cx + w, y: cy }, apex: { x: cx, y: cy + h } };
}

/** A body's outline as a world-space polygon. Spheres/pulleys return []. */
export function bodyOutline(b: Body): Vec2[] {
  if (b.shape === 'sphere' || b.shape === 'pulley') return [];
  if (b.shape === 'wedge') { const v = wedgeVertices(b); return [v.base, v.toe, v.apex]; }
  return localOutline(b).map((p) => localToWorld(b, p));
}

/** The same outline in BODY-LOCAL metres (centre of mass at the origin, and for
 *  a block, unrotated). The isolation panel draws in this space. */
export function localOutline(b: Body): Vec2[] {
  if (b.shape === 'sphere' || b.shape === 'pulley') return [];
  if (b.shape === 'wedge') {
    const w = b.size?.w ?? 2.4;
    const h = b.size?.h ?? w * Math.tan((b.angleDeg ?? 30) * DEG);
    return [{ x: -w / 3, y: -h / 3 }, { x: (2 * w) / 3, y: -h / 3 }, { x: -w / 3, y: (2 * h) / 3 }];
  }
  const w = b.size?.w ?? 0.6;
  const h = b.size?.h ?? 0.4;
  return [{ x: -w / 2, y: -h / 2 }, { x: w / 2, y: -h / 2 }, { x: w / 2, y: h / 2 }, { x: -w / 2, y: h / 2 }];
}

/** Body-local → world, applying the body's own rotation. A wedge's `angleDeg` is
 *  its incline angle, NOT an orientation, so a wedge is never rotated here. */
export function localToWorld(b: Body, p: Vec2): Vec2 {
  const rot = b.shape === 'wedge' ? 0 : (b.angleDeg ?? 0) * DEG;
  const c = Math.cos(rot), s = Math.sin(rot);
  return { x: b.pos.x + p.x * c - p.y * s, y: b.pos.y + p.x * s + p.y * c };
}

export function bodyRadius(b: Body): number {
  if (b.radius) return b.radius;
  const w = b.size?.w ?? 0.6, h = b.size?.h ?? 0.4;
  return Math.hypot(w, h) / 2;
}

/**
 * The nine places a force may be anchored on a body: the centre of mass, plus
 * the eight compass points on its bounding outline. Snapping to a small named
 * set (rather than a free perimeter parameter) is deliberate — "weight acts at
 * the centre of mass, the normal acts at the contact face" is itself a thing
 * worth being made to choose.
 */
export function anchorCandidates(b: Body): { key: string; local: Vec2 }[] {
  const out = [{ key: 'centre', local: { x: 0, y: 0 } }];
  if (b.shape === 'sphere' || b.shape === 'pulley') {
    const r = b.radius ?? 0.25;
    for (let k = 0; k < 8; k++) {
      const a = k * 45 * DEG;
      out.push({ key: `r${k}`, local: { x: round3(r * Math.cos(a)), y: round3(r * Math.sin(a)) } });
    }
    return out;
  }
  const poly = localOutline(b);
  poly.forEach((p, i) => {
    const q = poly[(i + 1) % poly.length];
    out.push({ key: `v${i}`, local: p });
    out.push({ key: `e${i}`, local: { x: round3((p.x + q.x) / 2), y: round3((p.y + q.y) / 2) } });
  });
  return out;
}

/** World bounding box over every body outline + the ground line. */
export function sceneBounds(scene: Scene): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = 0, maxX = 1, minY = 0, maxY = 1;
  let seen = false;
  const eat = (p: Vec2) => {
    if (!seen) { minX = maxX = p.x; minY = maxY = p.y; seen = true; return; }
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y);
  };
  for (const b of scene.bodies) {
    const poly = bodyOutline(b);
    if (poly.length) poly.forEach(eat);
    else { const r = bodyRadius(b); eat({ x: b.pos.x - r, y: b.pos.y - r }); eat({ x: b.pos.x + r, y: b.pos.y + r }); }
  }
  if (scene.contacts.some((c) => c.bodyB === WORLD.ground)) { eat({ x: minX, y: 0 }); }
  return { minX, maxX, minY, maxY };
}

// ── Mutations (each returns a NEW Scene) ─────────────────────────────────────

const nextId = (scene: Scene, prefix: string): string => {
  const taken = new Set([
    ...scene.bodies.map((b) => b.id),
    ...scene.contacts.map((c) => c.id),
    ...scene.strings.map((s) => s.id),
    ...(scene.applied ?? []).map((a) => a.id),
  ]);
  for (let i = 1; i < 999; i++) if (!taken.has(`${prefix}${i}`)) return `${prefix}${i}`;
  return `${prefix}${Date.now()}`;
};

/** Right edge of everything currently in the scene — where a new body lands. */
const freeX = (scene: Scene): number => {
  const b = sceneBounds(scene);
  return scene.bodies.length ? b.maxX + 0.55 : 1.0;
};

export function addBody(scene: Scene, shape: 'block' | 'sphere', mass = 2): Scene {
  const id = nextId(scene, shape === 'block' ? 'm' : 's');
  const r = 0.25;
  const body: Body = shape === 'block'
    ? { id, shape, mass, pos: { x: freeX(scene) + 0.3, y: 0.2 }, size: { w: 0.6, h: 0.4 }, dofDeg: 0, label: id }
    : { id, shape, mass, pos: { x: freeX(scene) + r, y: r }, radius: r, dofDeg: 0, label: id };
  const contact: Contact = {
    id: nextId(scene, 'c'), bodyA: id, bodyB: WORLD.ground,
    normalDeg: 90, mu_s: 0.4, mu_k: 0.3, slidingSign: 0,
  };
  return { ...scene, bodies: [...scene.bodies, body], contacts: [...scene.contacts, contact] };
}

/** A fixed wedge sitting on the ground, with nothing on it yet. */
export function addWedge(scene: Scene, thetaDeg = 30, base = 2.2): Scene {
  const id = nextId(scene, 'w');
  const h = base * Math.tan(thetaDeg * DEG);
  const x0 = freeX(scene) + 0.2;
  const body: Body = {
    id, shape: 'wedge', mass: 5, fixed: true, angleDeg: thetaDeg,
    pos: { x: x0 + base / 3, y: h / 3 }, size: { w: base, h }, dofDeg: 180, label: id,
  };
  const contact: Contact = {
    id: nextId(scene, 'c'), bodyA: id, bodyB: WORLD.ground, normalDeg: 90, mu_s: 0.5, mu_k: 0.4, slidingSign: 0,
  };
  return { ...scene, bodies: [...scene.bodies, body], contacts: [...scene.contacts, contact] };
}

/** Place `bodyId` on `wedgeId`'s hypotenuse, at fraction `u` down from the apex. */
export function placeOnWedge(scene: Scene, bodyId: string, wedgeId: string, u = 0.45): Scene {
  const body = findBody(scene, bodyId), wedge = findBody(scene, wedgeId);
  if (!body || !wedge) return scene;
  const theta = wedge.angleDeg ?? 30;
  const next = seatOnWedge(body, wedge, u);
  const contacts = scene.contacts
    // The body leaves whatever it was resting on before.
    .filter((c) => !(c.bodyA === bodyId && (c.bodyB === WORLD.ground || findBody(scene, c.bodyB)?.shape === 'wedge')))
    .concat([{
      id: nextId(scene, 'c'), bodyA: bodyId, bodyB: wedgeId,
      normalDeg: 90 - theta, mu_s: 0, mu_k: 0, slidingSign: 1,
    }]);
  return { ...scene, bodies: scene.bodies.map((b) => (b.id === bodyId ? next : b)), contacts };
}

/** Where a body sits when seated at fraction `u` along a wedge's hypotenuse. */
function seatOnWedge(body: Body, wedge: Body, u: number): Body {
  const v = wedgeVertices(wedge);
  const theta = wedge.angleDeg ?? 30;
  const p = { x: v.apex.x + u * (v.toe.x - v.apex.x), y: v.apex.y + u * (v.toe.y - v.apex.y) };
  const lift = body.shape === 'sphere' ? (body.radius ?? 0.25) : (body.size?.h ?? 0.4) / 2;
  const n = { x: Math.sin(theta * DEG), y: Math.cos(theta * DEG) };
  return {
    ...body,
    pos: { x: round3(p.x + n.x * lift), y: round3(p.y + n.y * lift) },
    angleDeg: body.shape === 'sphere' ? body.angleDeg : -theta,
    dofDeg: (360 - theta) % 360,
  };
}

/** How far down the hypotenuse a seated body currently is (0 = apex, 1 = toe). */
function seatParam(body: Body, wedge: Body): number {
  const v = wedgeVertices(wedge);
  const dx = v.toe.x - v.apex.x, dy = v.toe.y - v.apex.y;
  const len2 = dx * dx + dy * dy || 1;
  const u = ((body.pos.x - v.apex.x) * dx + (body.pos.y - v.apex.y) * dy) / len2;
  return Math.min(0.85, Math.max(0.1, u));
}

/**
 * THE live incline drag. Retilt a wedge and bring everything resting on it with
 * it: each seated body keeps its position ALONG the slope, re-orients, gets a
 * new down-slope DOF, and its contact normal is rebuilt as 90° − θ. Skipping any
 * one of those leaves a scene that looks right and grades wrong.
 */
export function setWedgeAngle(scene: Scene, wedgeId: string, thetaDeg: number): Scene {
  const wedge = findBody(scene, wedgeId);
  if (!wedge || wedge.shape !== 'wedge') return scene;
  const theta = Math.max(0, Math.min(70, thetaDeg));
  const base = wedge.size?.w ?? 2.2;
  const oldVerts = wedgeVertices(wedge);

  const seats = new Map<string, number>();
  for (const c of scene.contacts) {
    if (c.bodyB !== wedgeId) continue;
    const b = findBody(scene, c.bodyA);
    if (b) seats.set(c.bodyA, seatParam(b, wedge));
  }

  const h = base * Math.tan(theta * DEG);
  const nextWedge: Body = {
    ...wedge, angleDeg: theta, size: { w: base, h },
    // Keep the base-left corner pinned so the wedge grows upward, not sideways.
    pos: { x: round3(oldVerts.base.x + base / 3), y: round3(oldVerts.base.y + h / 3) },
  };

  const bodies = scene.bodies.map((b) => {
    if (b.id === wedgeId) return nextWedge;
    const u = seats.get(b.id);
    return u === undefined ? b : seatOnWedge(b, nextWedge, u);
  });
  const contacts = scene.contacts.map((c) =>
    c.bodyB === wedgeId
      ? { ...c, normalDeg: round3(90 - theta), ...resetSliding(c) }
      : c);
  return { ...scene, bodies, contacts };
}

/**
 * Hand a contact's sliding state back to the solver.
 *
 * `slidingSign` asserts a FACT about the current motion — ±1 means "this really
 * is sliding, so friction is kinetic and its direction is known". That fact is
 * a consequence of the geometry, so the moment the student drags the incline or
 * changes μ it is stale: a contact marked "sliding down" at 35° stays marked
 * that way at 10°, where friction actually holds the block, and the engine then
 * reports a block accelerating UP a 10° slope. (Found in browser QA 2026-07-29.)
 *
 * Resetting to 0 does not guess the answer — it says "undetermined", which is
 * precisely what `solveScene`'s assumption-then-test loop exists to resolve: it
 * assumes static, checks the demanded friction against μₛN, and flips the
 * contact to kinetic with the implied sense only when the assumption breaks.
 * A frictionless contact keeps its sign, since there is nothing to determine.
 */
function resetSliding(c: Contact): Partial<Contact> {
  const rough = (c.mu_s ?? 0) > 0 || (c.mu_k ?? 0) > 0;
  return rough ? { slidingSign: 0 } : {};
}

export function setMass(scene: Scene, bodyId: string, mass: number): Scene {
  return { ...scene, bodies: scene.bodies.map((b) => (b.id === bodyId ? { ...b, mass: Math.max(0.1, mass) } : b)) };
}

/** μ lives on the CONTACT, not the body — one block can have two different
 *  surfaces under it (the stacked-blocks archetype), and students need to see
 *  that friction is a property of a pair, never of an object. */
export function setFriction(scene: Scene, contactId: string, mu_s: number): Scene {
  const s = Math.max(0, Math.min(1.2, mu_s));
  return {
    ...scene,
    contacts: scene.contacts.map((c) =>
      c.id === contactId
        // Changing μ changes whether the surface can hold — the old sliding
        // verdict is stale for exactly the same reason as in setWedgeAngle.
        ? { ...c, mu_s: round3(s), mu_k: round3(s * 0.75), slidingSign: s > 0 ? 0 : c.slidingSign }
        : c),
  };
}

export function contactsOn(scene: Scene, bodyId: string): Contact[] {
  return scene.contacts.filter((c) => c.bodyA === bodyId || c.bodyB === bodyId);
}

export function removeBody(scene: Scene, bodyId: string): Scene {
  return {
    ...scene,
    bodies: scene.bodies.filter((b) => b.id !== bodyId),
    contacts: scene.contacts.filter((c) => c.bodyA !== bodyId && c.bodyB !== bodyId),
    strings: scene.strings.filter((s) => !s.path.includes(bodyId)),
    applied: (scene.applied ?? []).filter((a) => a.body !== bodyId),
  };
}

/** Hang a body from the ceiling by a string. */
export function attachToCeiling(scene: Scene, bodyId: string): Scene {
  const body = findBody(scene, bodyId);
  if (!body) return scene;
  const link: StringLink = { id: nextId(scene, 's'), path: [WORLD.ceiling, bodyId], taut: true, massless: true };
  return {
    ...scene,
    bodies: scene.bodies.map((b) => (b.id === bodyId ? { ...b, dofDeg: 270 } : b)),
    contacts: scene.contacts.filter((c) => c.bodyA !== bodyId),
    strings: [...scene.strings, link],
  };
}

export function addApplied(scene: Scene, bodyId: string, mag = 20, angleDeg = 0): Scene {
  const f: AppliedForce = {
    id: nextId(scene, 'F'), body: bodyId, from: WORLD.hand, mag, angleDeg, label: 'push',
  };
  return { ...scene, applied: [...(scene.applied ?? []), f] };
}

export function setApplied(scene: Scene, id: string, patch: Partial<AppliedForce>): Scene {
  return { ...scene, applied: (scene.applied ?? []).map((a) => (a.id === id ? { ...a, ...patch } : a)) };
}

export function removeApplied(scene: Scene, id: string): Scene {
  return { ...scene, applied: (scene.applied ?? []).filter((a) => a.id !== id) };
}

export function setFrame(scene: Scene, frame: ReferenceFrame): Scene {
  return { ...scene, frame };
}

/** Human name for a body or world agent — used by the legend and agent picker. */
export function agentLabel(scene: Scene, id: string): string {
  switch (id) {
    case WORLD.earth: return 'the Earth';
    case WORLD.ground: return 'the ground';
    case WORLD.wall: return 'the wall';
    case WORLD.ceiling: return 'the ceiling';
    case WORLD.hand: return 'your hand';
    default: break;
  }
  const b = findBody(scene, id);
  if (b) return b.label ?? b.id;
  const s = scene.strings.find((x) => x.id === id);
  if (s) return s.label ?? `string ${s.id}`;
  return id;
}
