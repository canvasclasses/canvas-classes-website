/*
 * mechanics-bench/lib/cut.ts — the system boundary.
 * ─────────────────────────────────────────────────────────────────────────────
 * Pure. No React, no DOM, no dependencies.
 *
 * THE KILLER FEATURE (PHYSICS_SIMULATION_PROGRAM.md §5.1). The student drags a
 * dotted boundary around any subset of bodies. Forces crossing the boundary
 * survive on the composite free-body diagram; forces wholly inside it cancel in
 * third-law pairs and VANISH.
 *
 * The rule is one line of physics: a force is INTERNAL when the thing applying
 * it is also inside the boundary. Its partner is the equal-and-opposite force
 * the second body applies back on the first — same source (same contact, same
 * string), agents swapped. Returning the two together is the point: the UI
 * greys out a PAIR, so the student sees them cancel rather than disappear one
 * at a time.
 *
 * This is the single idea that turns two-body problems from memorised cases
 * into a method, and no textbook can show it because it is an animation.
 */

import type { CutResult, TrueForce, Scene } from '../types';
import { allTrueForces, normalizeScene } from './scene';

/**
 * Cut the scene along a boundary enclosing `insideIds`.
 *
 * Weight is never internal — its agent is the Earth, which is always outside
 * any boundary a student can draw. That is exactly why mg survives on every
 * composite FBD no matter how you cut.
 */
export function cutSystem(scene: Scene, insideIds: string[]): CutResult {
  const s = normalizeScene(scene);
  const inside = insideIds.filter((id) => s.bodies.some((b) => b.id === id));
  const insideSet = new Set(inside);

  const all = allTrueForces(s);
  const external: TrueForce[] = [];
  const internal: { a: TrueForce; b: TrueForce }[] = [];
  const consumed = new Set<string>();

  const partnerOf = (f: TrueForce): TrueForce | undefined =>
    (all[f.fromBody] ?? []).find((p) =>
      !consumed.has(p.id)
      && p.id !== f.id
      && p.kind === f.kind
      && p.sourceId === f.sourceId
      && p.fromBody === f.onBody);

  for (const id of inside) {
    for (const f of all[id] ?? []) {
      if (consumed.has(f.id)) continue;

      if (!insideSet.has(f.fromBody)) {
        // The agent is outside the boundary — the force crosses it and stays.
        external.push(f);
        consumed.add(f.id);
        continue;
      }

      const partner = partnerOf(f);
      if (partner) {
        consumed.add(f.id);
        consumed.add(partner.id);
        internal.push({ a: f, b: partner });
      } else {
        // The agent is inside but no reaction was derived — that is a scene
        // authoring bug, not a physical possibility. Keep it visible rather
        // than silently dropping a force.
        external.push(f);
        consumed.add(f.id);
      }
    }
  }

  const totalMass = inside.reduce(
    (sum, id) => sum + (s.bodies.find((b) => b.id === id)?.mass ?? 0), 0,
  );

  return { inside, external, internal, totalMass };
}
