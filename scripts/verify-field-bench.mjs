/*
 * verify-field-bench.mjs — the E5 physics gate.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-field-bench.mjs
 *
 * WHY THIS EXISTS. PHYSICS_SIMULATION_PROGRAM.md §9: "no academic claim ships
 * unverified". A field sim is unusually good at looking right while being
 * wrong — field lines are pretty whatever ODE drew them, a flux readout is
 * convincing whatever produced it, and a circle is a circle even if the speed
 * is quietly drifting. Every headline claim the E5 engine makes to a student is
 * therefore re-derived here from hand-computed numbers, stated in the comments,
 * and checked in a plain node run with no React and no DOM.
 *
 * The checks that matter most, and what would otherwise hide:
 *   • flux independent of radius AND of where the charge sits inside — the
 *     whole Gauss lab. A quadrature bug shows up here and nowhere else.
 *   • field ⟂ equipotential, MEASURED off the drawn contour, not asserted.
 *   • qv×B does zero work, integrated with motion-lab's RK4 over a full orbit.
 *     If E5 ever grew its own integrator, this is the check that would catch it.
 *   • no photoemission below threshold at ANY intensity.
 *   • g rises inside the Earth, peaks at the surface, falls as 1/r² outside.
 *   • every archetype builds purely, and its content fills 60–75% of the board
 *     at a desktop AND a phone width — measured with the same functions the
 *     component frames with, so this cannot verify a picture nobody sees.
 *
 * Requires Node ≥ 22.6 for the `registerHooks` TS shim. Exits non-zero on any
 * failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      for (const ext of ['', '.ts', '.tsx', '/index.ts']) {
        if (ext === '' && existsSync(base) && !base.endsWith('.ts')) continue;
        if (existsSync(base + ext) && (base + ext).endsWith('.ts')) {
          return { url: pathToFileURL(base + ext).href, shortCircuit: true };
        }
      }
    }
    return next(spec, ctx);
  },
});

const ROOT = new URL('../packages/book-renderer/blocks/field-bench/', import.meta.url).href;

const { K_E, EPS0, PLANCK, ELEMENTARY_CHARGE, G_NEWTON, EARTH_MASS, EARTH_RADIUS } =
  await import(`${ROOT}lib/constants.ts`);
const { sampleE, sampleG, sampleBz, sampleField, potentialAt, fieldVector } =
  await import(`${ROOT}lib/field.ts`);
const { computeFlux, fluxIntegral, enclosedSources } = await import(`${ROOT}lib/flux.ts`);
const { buildEquipotentials, suggestLevels } = await import(`${ROOT}lib/equipotential.ts`);
const { buildFieldLines, traceFieldLine, DEFAULT_SEEDS } = await import(`${ROOT}lib/lines.ts`);
const { traceCharge, cyclotronRadius, cyclotronPeriod, selectorSpeed, speedDrift, speedOf } =
  await import(`${ROOT}lib/trace.ts`);
const { photoelectric, ivCurve, stoppingPotential, currentAt, STOPPING_SLOPE } =
  await import(`${ROOT}lib/photoelectric.ts`);
const { gAtRadius, surfaceG, orbitSpeed, escapeSpeed, orbitShape } = await import(`${ROOT}lib/gravity.ts`);
const { contentBounds, frameBounds, contentFill } = await import(`${ROOT}lib/view.ts`);
const { previewExtras } = await import(`${ROOT}lib/preview.ts`);
const { FIELD_ARCHETYPES, FIELD_ARCHETYPE_ORDER } = await import(`${ROOT}archetypes.ts`);

// ── harness ─────────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;
const rows = [];
let group = '';

const G = (name) => { group = name; rows.push({ group: name, header: true }); };

function check(name, ok, detail = '') {
  if (ok) pass++; else fail++;
  rows.push({ group, name, ok, detail });
}

/** Relative closeness, falling back to absolute when the target is zero. */
const near = (got, want, tol) => {
  if (!Number.isFinite(got) || !Number.isFinite(want)) return false;
  const scale = Math.abs(want);
  return scale > 0 ? Math.abs(got - want) / scale <= tol : Math.abs(got) <= tol;
};

const fmt = (v, dp = 6) => (Number.isFinite(v) ? v.toPrecision(dp) : String(v));

// ═══════════════════════════════════════════════════════════════════════════
G('Coulomb — E = kq/r², radial, inverse SQUARE');
// ═══════════════════════════════════════════════════════════════════════════
// q = 5 nC at the origin. By hand, with k = 1/(4πε₀) = 8.987551792261171×10⁹
// N·m²/C² (derived from ε₀ = 8.8541878128×10⁻¹² F/m — see lib/constants.ts):
//   kq       = 8.987551792261171e9 × 5e-9 = 44.937758961305855
//   E(0.2 m) = 44.937758961305855 / 0.04 = 1123.4439740326463 V/m
//   E(0.4 m) = 44.937758961305855 / 0.16 =  280.8609935081616 V/m
//   E(0.15 m)= 44.937758961305855 / 0.0225 = 1997.2337316135938 V/m
//   V(0.2 m) = 44.937758961305855 / 0.2  =  224.6887948065293 V
// and 1123.4439740326463 / 280.8609935081616 = 4 exactly, which is the whole
// content of "inverse square" and the thing a linear-falloff bug would break.
{
  const q = { id: 'q', kind: 'point-charge', pos: { x: 0, y: 0 }, strength: 5e-9 };
  const scene = { kind: 'electric', sources: [q] };

  const at1 = { x: 0.2, y: 0 };
  const at2 = { x: 0.4, y: 0 };
  const E1 = sampleE([q], at1);
  const E2 = sampleE([q], at2);
  const m1 = Math.hypot(E1.field.x, E1.field.y);
  const m2 = Math.hypot(E2.field.x, E2.field.y);

  check('E at 0.2 m = 1123.4439740 V/m (hand-computed)', near(m1, 1123.4439740326463, 1e-12),
    `got ${fmt(m1)}`);
  check('E at 0.4 m = 280.8609935 V/m (hand-computed)', near(m2, 280.8609935081616, 1e-12),
    `got ${fmt(m2)}`);
  check('E at 2r is EXACTLY a quarter of E at r', near(m1 / m2, 4, 1e-12),
    `ratio ${fmt(m1 / m2, 17)}`);

  // Radial: at a point off-axis the field is parallel to the position vector.
  const off = { x: 0.12, y: 0.09 };              // |r| = 0.15 m exactly
  const Eo = sampleE([q], off).field;
  const cross = Eo.x * off.y - Eo.y * off.x;      // zero ⇒ parallel
  check('direction is radial (E × r = 0)', Math.abs(cross) < 1e-15, `cross ${fmt(cross)}`);
  check('points AWAY from a positive charge', Eo.x > 0 && Eo.y > 0, `E = (${fmt(Eo.x)}, ${fmt(Eo.y)})`);

  check('E at 0.15 m = 1997.2337316 V/m (hand-computed)',
    near(Math.hypot(Eo.x, Eo.y), 1997.2337316135938, 1e-12), `got ${fmt(Math.hypot(Eo.x, Eo.y))}`);

  // V = kq/r, the potential at the same point.
  check('V at 0.2 m = 224.6887948 V (hand-computed)', near(E1.potential, 224.6887948065293, 1e-12),
    `got ${fmt(E1.potential)}`);

  // A negative charge pulls the field inward — the sign is not cosmetic.
  const neg = sampleE([{ ...q, strength: -5e-9 }], at1).field;
  check('a negative charge reverses the field exactly', near(neg.x, -m1, 1e-15) && Math.abs(neg.y) < 1e-18,
    `E = (${fmt(neg.x)}, ${fmt(neg.y)})`);

  check('sampleField reports a finite potential for an electric scene',
    Number.isFinite(sampleField(scene, at1).potential), '');
}

// ═══════════════════════════════════════════════════════════════════════════
G('Superposition — two equal charges, exactly zero at the midpoint');
// ═══════════════════════════════════════════════════════════════════════════
// Two +5 nC at (±0.15, 0). At the origin each contributes 1997.2337 V/m
// pointing outward along ∓x. The sum is not "small", it is ZERO, and the sim
// tells a student so — which is only honest if the code is a plain sum.
{
  const sources = [
    { id: 'a', kind: 'point-charge', pos: { x: -0.15, y: 0 }, strength: 5e-9 },
    { id: 'b', kind: 'point-charge', pos: { x: 0.15, y: 0 }, strength: 5e-9 },
  ];
  const mid = sampleE(sources, { x: 0, y: 0 }).field;
  const mag = Math.hypot(mid.x, mid.y);
  check('field at the midpoint is exactly zero', mag === 0 || mag < 1e-30, `|E| = ${fmt(mag)}`);

  // Off the axis of symmetry it is emphatically NOT zero — a "return 0
  // everywhere" bug would pass the test above and fail this one.
  const above = sampleE(sources, { x: 0, y: 0.1 }).field;
  check('and non-zero just off the midpoint', Math.hypot(above.x, above.y) > 1, `|E| = ${fmt(Math.hypot(above.x, above.y))}`);
  check('...pointing straight up, by symmetry', Math.abs(above.x) < 1e-13 && above.y > 0,
    `E = (${fmt(above.x)}, ${fmt(above.y)})`);

  // Potential adds as a plain scalar: 2 × k(5e-9)/0.15 = 599.1701 V
  const V = sampleE(sources, { x: 0, y: 0 }).potential;
  check('potentials add even where the fields cancel (V = 599.1701 V)',
    near(V, 2 * (K_E * 5e-9) / 0.15, 1e-14), `got ${fmt(V)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
G("Gauss — flux depends on the enclosed charge and NOTHING else");
// ═══════════════════════════════════════════════════════════════════════════
// A long wire carrying λ = 2 nC/m, seen end-on. By hand:
//   Φ = λ/ε₀ = 2×10⁻⁹ / 8.8541878128×10⁻¹² = 225.88181347 N·m²/C per metre
// Three radii × three off-centre positions = nine completely different
// integrals over nine completely different fields, all of which must agree.
{
  const LAMBDA = 2e-9;
  const expected = LAMBDA / EPS0;
  check('λ/ε₀ = 225.88181347 N·m²/C per metre (hand-computed)', near(expected, 225.88181347460383, 1e-12),
    `got ${fmt(expected, 12)}`);

  const radii = [0.12, 0.20, 0.34];
  const offsets = [{ x: 0, y: 0 }, { x: 0.05, y: 0.03 }, { x: -0.06, y: 0.05 }];
  const values = [];

  for (const r of radii) {
    for (const off of offsets) {
      const scene = {
        kind: 'electric',
        sources: [{ id: 'w', kind: 'line-charge', pos: off, strength: LAMBDA }],
      };
      const surface = { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: r };
      const res = computeFlux(scene, surface, { samples: 2048 });
      values.push({ r, off, res });

      check(`Φ at r = ${r} m, charge at (${off.x}, ${off.y})`, near(res.flux, expected, 1e-9),
        `got ${fmt(res.flux, 12)}, want ${fmt(expected, 12)}`);
      check(`  ...and the measured integral matches q/ε₀`, near(res.flux, res.predictedFlux, 1e-9),
        `measured ${fmt(res.flux, 12)} vs predicted ${fmt(res.predictedFlux, 12)}`);
    }
  }

  const spread = Math.max(...values.map((v) => v.res.flux)) - Math.min(...values.map((v) => v.res.flux));
  check('all nine agree with each other to 1e-9', spread / expected <= 1e-9,
    `spread ${fmt(spread / expected)} relative`);

  // Outside the surface: every line that enters leaves again.
  const outside = {
    kind: 'electric',
    sources: [{ id: 'w', kind: 'line-charge', pos: { x: 0.6, y: 0 }, strength: LAMBDA }],
  };
  const out = computeFlux(outside, { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.2 }, { samples: 2048 });
  check('flux is ZERO when the charge is outside', Math.abs(out.flux) < 1e-8, `got ${fmt(out.flux)}`);
  check('...and the enclosed charge is reported as zero', out.enclosed === 0, `got ${out.enclosed}`);

  // The shape is not in the answer either: a rectangle with a completely
  // different field on every wall gives the same number as the circle.
  const scene = { kind: 'electric', sources: [{ id: 'w', kind: 'line-charge', pos: { x: 0.03, y: -0.02 }, strength: LAMBDA }] };
  const rect = computeFlux(scene, { id: 'R', shape: 'rectangle', centre: { x: 0, y: 0 }, size: { w: 0.5, h: 0.32 } }, { samples: 4096 });
  check('a rectangle gives the same flux as a circle', near(rect.flux, expected, 1e-9),
    `got ${fmt(rect.flux, 12)}`);

  // A uniform field contributes nothing net through any closed curve.
  const uni = { kind: 'electric', sources: [{ id: 'E', kind: 'uniform-E', pos: { x: 0, y: 0 }, strength: 900, angleDeg: 27 }] };
  const uniFlux = fluxIntegral(uni, { id: 'S', shape: 'circle', centre: { x: 0.1, y: -0.05 }, radius: 0.22 }, 2048);
  check('a uniform field has zero net flux through a closed curve', Math.abs(uniFlux) < 1e-9,
    `got ${fmt(uniFlux)}`);

  // A charge sitting ON the boundary is genuinely ill-defined — say so.
  const onEdge = { kind: 'electric', sources: [{ id: 'w', kind: 'line-charge', pos: { x: 0.2, y: 0 }, strength: LAMBDA }] };
  const edge = computeFlux(onEdge, { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.2 }, { samples: 1024 });
  check('a charge on the boundary is listed in onBoundary, not counted',
    edge.onBoundary.length === 1 && edge.enclosed === 0, `onBoundary = [${edge.onBoundary}]`);
}

// ═══════════════════════════════════════════════════════════════════════════
G('The conductor cavity — zero inside the metal, computed not drawn');
// ═══════════════════════════════════════════════════════════════════════════
// +3 nC/m on the wire, −3 nC/m induced on the inner wall (r = 0.12 m),
// +3 nC/m on the outer wall (r = 0.22 m). Anywhere in the metal the wire and
// the inner wall cancel exactly and the outer shell contributes nothing inside
// itself, so E = 0 identically — from superposition, with no special case.
{
  const scene = FIELD_ARCHETYPES['conductor-cavity'].build({ lambda: 3, inner: 0.12, outer: 0.22, probe: 0.17 });

  for (const r of [0.13, 0.17, 0.21]) {
    const E = sampleE(scene.sources, { x: r, y: 0 }).field;
    check(`E = 0 inside the metal at r = ${r} m`, Math.hypot(E.x, E.y) < 1e-18,
      `|E| = ${fmt(Math.hypot(E.x, E.y))}`);
  }

  const inMetal = computeFlux(scene, { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.17 }, { samples: 1024 });
  check('flux through a surface in the metal is zero', Math.abs(inMetal.flux) < 1e-12, `got ${fmt(inMetal.flux)}`);
  check('...because the enclosed charge is +q − q = 0', inMetal.enclosed === 0, `got ${inMetal.enclosed}`);

  // In the cavity only the wire is enclosed: Φ = 3e-9/ε₀ = 338.8149…
  const inCavity = computeFlux(scene, { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.08 }, { samples: 1024 });
  check('inside the cavity the flux is back to q/ε₀', near(inCavity.flux, 3e-9 / EPS0, 1e-9),
    `got ${fmt(inCavity.flux)}, want ${fmt(3e-9 / EPS0)}`);

  // Outside everything: +q − q + q = +q again.
  const outside = computeFlux(scene, { id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.30 }, { samples: 1024 });
  check('outside the whole tube the flux is q/ε₀ again', near(outside.flux, 3e-9 / EPS0, 1e-9),
    `got ${fmt(outside.flux)}`);
  check('a shell that surrounds the surface is not counted as enclosed',
    enclosedSources({ id: 'S', shape: 'circle', centre: { x: 0, y: 0 }, radius: 0.05 }, scene.sources).inside.length === 1,
    'the two walls must both read as outside a small central surface');
}

// ═══════════════════════════════════════════════════════════════════════════
G('Field lines meet equipotentials at 90° — measured off the drawn contour');
// ═══════════════════════════════════════════════════════════════════════════
// The dipole archetype, contoured on a fine grid, then for every contour
// vertex more than 4 cm from either charge: the central-difference tangent of
// the DRAWN polyline is dotted with E at that vertex. cos θ must be zero.
{
  const scene = FIELD_ARCHETYPES.dipole.build({ charge: 5, separation: 0.30 });
  const frame = frameBounds(scene);
  const opts = { bounds: frame, nx: 220, ny: 220 };
  const levels = suggestLevels(scene, opts, 7);
  const contours = buildEquipotentials(scene, levels, opts);

  check('the dipole produces contours to measure', contours.length >= 3,
    `${contours.length} levels with loops`);

  let worst = 0;
  let samples = 0;
  const charges = scene.sources.map((s) => s.pos);

  for (const c of contours) {
    for (const loop of c.loops) {
      for (let i = 1; i < loop.length - 1; i += 3) {
        const p = loop[i];
        if (charges.some((q) => Math.hypot(p.x - q.x, p.y - q.y) < 0.04)) continue;
        const a = loop[i - 1];
        const b = loop[i + 1];
        const t = { x: b.x - a.x, y: b.y - a.y };
        const tm = Math.hypot(t.x, t.y);
        const E = fieldVector(scene, p);
        const em = Math.hypot(E.x, E.y);
        if (tm === 0 || em === 0) continue;
        const cos = Math.abs((t.x * E.x + t.y * E.y) / (tm * em));
        worst = Math.max(worst, cos);
        samples++;
      }
    }
  }

  check('enough contour points were sampled', samples > 150, `${samples} points`);
  check('|cos(field, contour tangent)| ≈ 0 everywhere', worst < 2e-2,
    `worst ${fmt(worst)} over ${samples} points (= ${fmt((Math.acos(Math.min(1, worst)) * 180) / Math.PI, 5)}° from perpendicular)`);

  // ⚠ REGRESSION GUARD, and the reason it exists. The contour stitcher must
  // join marching-squares segments UNDIRECTED. A directed a→b walk produced
  // physically perfect but visually shattered contours — a single charge's
  // circular equipotentials came out as 73 fragments of five vertices each,
  // rendering as a broken dotted ring. Every physics check above still passed
  // on the fragments. Counting the pieces is the only thing that sees it.
  {
    const one = FIELD_ARCHETYPES['single-charge'].build({ charge: 5, probeX: 0.30, probeY: 0.18 });
    const oneFrame = frameBounds(one);
    const oneOpts = { bounds: oneFrame, nx: 96, ny: 96 };
    const oneLevels = suggestLevels(one, oneOpts, 7);
    const oneContours = buildEquipotentials(one, oneLevels, oneOpts);
    const loops = oneContours.flatMap((c) => c.loops);
    const shortest = Math.min(...loops.map((l) => l.length));
    check('a point charge gives ONE unbroken ring per level, not fragments',
      loops.length <= oneContours.length * 1.5,
      `${loops.length} loops for ${oneContours.length} levels`);
    check('...and every ring is a long polyline, not a stub', shortest >= 40,
      `shortest loop has ${shortest} vertices`);
  }

  // V = 0 is a real, findable contour on a dipole — the perpendicular bisector.
  check('the V = 0 contour exists on a dipole', levels.some((v) => v === 0), `levels ${levels.length}`);
  const onAxis = potentialAt(scene, { x: 0, y: 0.19 });
  check('...and V really is zero on it', Math.abs(onAxis) < 1e-9, `V = ${fmt(onAxis)}`);

  // A line leaving the positive charge STRAIGHT AT the negative one must land
  // on it. Traced directly rather than through the seeded fan, because the fan
  // seeds at 2π(i+½)/n and never puts a line exactly on the axis — and "some
  // of the lines happened to land" is a much weaker statement than "the line
  // that must land, does".
  const axis = traceFieldLine(scene, { x: -0.15 + 0.006, y: 0 }, 1,
    { step: 0.004, maxSteps: 900, bounds: frame, sinkRadius: 0.006 }, 'qp');
  check('a line fired along the axis lands on the negative charge', axis.end === 'sink',
    `ended '${axis.end}' after ${axis.points.length} steps`);
  const tip = axis.points[axis.points.length - 1];
  check('...at the negative charge itself', Math.hypot(tip.x - 0.15, tip.y) < 1e-9,
    `ended at (${fmt(tip.x)}, ${fmt(tip.y)})`);

  // And across the whole fan every line reaches a definite fate: onto the sink
  // or out of the frame. A line stalling on 'max-steps' would mean the tracer
  // had wandered into a null point that a dipole does not have.
  const lines = buildFieldLines(scene, {
    ...DEFAULT_SEEDS, step: 0.004, maxSteps: 900, maxLines: 40,
    bounds: frame, sinkRadius: 0.006,
  });
  const landed = lines.filter((l) => l.end === 'sink').length;
  check('every dipole field line ends definitely (sink or escaped)',
    lines.length > 0 && lines.every((l) => l.end === 'sink' || l.end === 'escaped'),
    `${landed} sank, ${lines.filter((l) => l.end === 'escaped').length} escaped, ` +
    `${lines.filter((l) => l.end === 'max-steps').length} stalled`);
  check('...and at least some of them land on the negative charge', landed >= 2,
    `${landed}/${lines.length} lines ended on a sink`);
}

// ═══════════════════════════════════════════════════════════════════════════
G('Magnetism — qv×B does ZERO work (motion-lab RK4, one full orbit)');
// ═══════════════════════════════════════════════════════════════════════════
// A 1 µC, 1 mg bead at 0.4 m/s in B = 2 T out of the page. By hand:
//   r = mv/(qB) = (1e-6 × 0.4)/(1e-6 × 2) = 0.2 m
//   T = 2πm/(qB) = 2π × 1e-6/(1e-6 × 2) = π = 3.14159265358979 s
// Integrated with motion-lab's `integrate` at T/2000 for exactly 2000 steps.
{
  const B = 2;
  const q = 1e-6;
  const m = 1e-6;
  const v = 0.4;
  const scene = { kind: 'magnetic', sources: [{ id: 'B', kind: 'uniform-B', pos: { x: 0, y: 0 }, strength: B }] };
  const r = cyclotronRadius(m, v, q, B);
  const T = cyclotronPeriod(m, q, B);

  check('r = mv/(qB) = 0.2 m (hand-computed)', near(r, 0.2, 1e-15), `got ${fmt(r)}`);
  check('T = 2πm/(qB) = π s (hand-computed)', near(T, Math.PI, 1e-15), `got ${fmt(T, 17)}`);

  const tc = { id: 'bead', pos: { x: -r, y: 0 }, vel: { x: 0, y: v }, charge: q, mass: m };
  const tr = traceCharge(scene, tc, { dt: T / 2000, maxSteps: 2000 });

  check('the orbit integrated for a full period', tr.points.length === 2001,
    `${tr.points.length} states`);

  const drift = speedDrift(tr);
  check('|v| is constant to 1e-9 over the whole orbit', drift < 1e-9,
    `worst relative drift ${fmt(drift)}`);

  const first = tr.points[0];
  const last = tr.points[tr.points.length - 1];
  check('work done over the orbit is zero (ΔKE)',
    Math.abs(0.5 * m * (speedOf(last) ** 2 - speedOf(first) ** 2)) < 1e-9 * (0.5 * m * v * v),
    `ΔKE = ${fmt(0.5 * m * (speedOf(last) ** 2 - speedOf(first) ** 2))} J`);

  const closed = Math.hypot(last.pos.x - first.pos.x, last.pos.y - first.pos.y);
  check('after one period it is back where it started', closed < r * 1e-6,
    `off by ${fmt(closed)} m (radius ${r} m)`);

  // The drawn circle really has radius mv/(qB).
  const xs = tr.points.map((p) => p.pos.x);
  const ys = tr.points.map((p) => p.pos.y);
  const rx = (Math.max(...xs) - Math.min(...xs)) / 2;
  const ry = (Math.max(...ys) - Math.min(...ys)) / 2;
  check('the integrated path has radius mv/(qB) on both axes',
    near(rx, r, 1e-4) && near(ry, r, 1e-4), `rx ${fmt(rx)}, ry ${fmt(ry)}, want ${r}`);

  // Period is independent of speed: three speeds, three radii, one period.
  for (const speed of [0.2, 0.4, 0.8]) {
    const tcS = { id: 's', pos: { x: -cyclotronRadius(m, speed, q, B), y: 0 }, vel: { x: 0, y: speed }, charge: q, mass: m };
    const trS = traceCharge(scene, tcS, { dt: T / 2000, maxSteps: 2000 });
    const back = trS.points[trS.points.length - 1];
    const off = Math.hypot(back.pos.x - tcS.pos.x, back.pos.y - tcS.pos.y);
    check(`period is the SAME at v = ${speed} m/s (independent of speed)`,
      off < cyclotronRadius(m, speed, q, B) * 1e-6,
      `returned within ${fmt(off)} m after exactly T = π s`);
    check(`  ...but the radius scales with v (r = ${fmt(cyclotronRadius(m, speed, q, B), 3)} m)`,
      near(cyclotronRadius(m, speed, q, B), (m * speed) / (q * B), 1e-15), '');
    check(`  ...and |v| stays constant at v = ${speed}`, speedDrift(trS) < 1e-9,
      `drift ${fmt(speedDrift(trS))}`);
  }

  // The frozen contract: no scalar potential for a magnetic scene, ever.
  const sample = sampleField(scene, { x: 0.1, y: 0.1 });
  check('a magnetic sample reports potential === null (not 0)', sample.potential === null,
    `got ${String(sample.potential)}`);
  check('...and |B| is reported as the magnitude', near(sample.magnitude, B, 1e-15), `got ${fmt(sample.magnitude)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
G('Velocity selector — exactly v = E/B gets through');
// ═══════════════════════════════════════════════════════════════════════════
// E = 0.8 V/m up, B = 2 T out of the page ⇒ v = E/B = 0.4 m/s.
// qE = 1e-6 × 0.8 = 8e-7 N up; qvB = 1e-6 × 0.4 × 2 = 8e-7 N down. Balanced —
// and balanced for ANY charge and ANY mass, because both forces carry q.
{
  const E = 0.8;
  const B = 2;
  const scene = FIELD_ARCHETYPES['velocity-selector'].build({ B, E, speed: 0.4, charge: 1 });
  const vSel = selectorSpeed(E, B);
  check('v = E/B = 0.4 m/s (hand-computed)', near(vSel, 0.4, 1e-15), `got ${fmt(vSel, 17)}`);

  const run = (speed, charge, mass) => traceCharge(
    scene,
    { id: 'p', pos: { x: -0.3, y: 0 }, vel: { x: speed, y: 0 }, charge, mass },
    { dt: 1 / 4000, maxSteps: 6000 },
  );

  const straight = run(vSel, 1e-6, 1e-6);
  const maxY = Math.max(...straight.points.map((p) => Math.abs(p.pos.y)));
  check('at v = E/B it goes dead straight', maxY < 1e-9, `max |y| = ${fmt(maxY)} m`);
  check('...and its speed never changes', speedDrift(straight) < 1e-12, `drift ${fmt(speedDrift(straight))}`);

  const slow = run(vSel * 0.75, 1e-6, 1e-6);
  const fast = run(vSel * 1.25, 1e-6, 1e-6);
  const yOf = (tr) => tr.points[tr.points.length - 1].pos.y;
  check('slower than E/B and the electric force wins (deflects UP)', yOf(slow) > 1e-3, `y = ${fmt(yOf(slow))} m`);
  check('faster than E/B and the magnetic force wins (deflects DOWN)', yOf(fast) < -1e-3, `y = ${fmt(yOf(fast))} m`);

  // The charge and the mass cancel out of the balance — the whole reason a
  // selector selects speed and nothing else.
  for (const [charge, mass] of [[2e-6, 1e-6], [5e-7, 4e-6], [-1e-6, 1e-6]]) {
    const tr = run(vSel, charge, mass);
    const my = Math.max(...tr.points.map((p) => Math.abs(p.pos.y)));
    check(`still straight at q = ${charge} C, m = ${mass} kg`, my < 1e-9, `max |y| = ${fmt(my)} m`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
G('Photoelectric — intensity and frequency do different things');
// ═══════════════════════════════════════════════════════════════════════════
// Sodium, φ = 2.75 eV. By hand:
//   f₀ = φ/h = 2.75 × 1.602176634e-19 / 6.62607015e-34 = 6.64947042×10¹⁴ Hz
//   at f = 8×10¹⁴ Hz: hf = 3.30853416 eV, KE_max = 0.55853416 eV,
//                     V₀ = 0.55853416 V
// and the slope dV₀/df = h/e = 4.135667×10⁻¹⁵ V·s for EVERY metal.
{
  const phi = 2.75;
  const f0 = (phi * ELEMENTARY_CHARGE) / PLANCK;
  check('threshold f₀ = 6.64947042×10¹⁴ Hz (hand-computed)',
    near(photoelectric({ workFunctionEV: phi, frequencyHz: 1e15, intensityWm2: 1 }).thresholdHz, f0, 1e-14),
    `got ${fmt(f0)}`);

  // Below threshold, at any brightness at all.
  for (const I of [0.1, 1, 10, 100, 1000, 1e6]) {
    const r = photoelectric({ workFunctionEV: phi, frequencyHz: 5e14, intensityWm2: I });
    const anyCurrent = [-2, -0.5, 0, 0.5, 5, 50].some((v) => currentAt(r, v) !== 0);
    check(`no emission below f₀ at ${I} W/m²`,
      !r.emits && r.saturationCurrentA === 0 && r.stoppingVoltage === 0 && !anyCurrent,
      `emits=${r.emits}, I_sat=${fmt(r.saturationCurrentA)}, V₀=${fmt(r.stoppingVoltage)}`);
  }

  // Above threshold: V₀ is linear in f with slope h/e, exactly.
  const f1 = 8e14;
  const f2 = 12e14;
  const V1 = stoppingPotential(f1, phi);
  const V2 = stoppingPotential(f2, phi);
  const slope = (V2 - V1) / (f2 - f1);
  check('V₀ at 8×10¹⁴ Hz = 0.55853416 V (hand-computed)', near(V1, 0.5585341575390872, 1e-12), `got ${fmt(V1, 12)}`);
  check('dV₀/df = h/e = 4.135667×10⁻¹⁵ V·s', near(slope, PLANCK / ELEMENTARY_CHARGE, 1e-12),
    `got ${fmt(slope)}, want ${fmt(PLANCK / ELEMENTARY_CHARGE)}`);
  check('...and the exported STOPPING_SLOPE agrees', near(STOPPING_SLOPE, slope, 1e-12), `${fmt(STOPPING_SLOPE)}`);

  // The slope does not depend on the metal — only the intercept does.
  // Copper's own threshold is 1.1244×10¹⁵ Hz, so the two sample frequencies
  // have to clear IT — measuring a "slope" through a clamped zero would be
  // measuring our own Math.max, not Planck's constant.
  const c1 = 1.3e15;
  const c2 = 1.7e15;
  const otherSlope = (stoppingPotential(c2, 4.65) - stoppingPotential(c1, 4.65)) / (c2 - c1);
  check('the slope is the same for a different metal (copper)', near(otherSlope, slope, 1e-12),
    `got ${fmt(otherSlope)}`);
  check('...and copper emits nothing at sodium\'s working frequency',
    stoppingPotential(f1, 4.65) === 0, `got ${fmt(stoppingPotential(f1, 4.65))}`);

  // Brightness moves the current and NOT the stopping potential.
  const dim = photoelectric({ workFunctionEV: phi, frequencyHz: f1, intensityWm2: 1 });
  const bright = photoelectric({ workFunctionEV: phi, frequencyHz: f1, intensityWm2: 3 });
  check('trebling the brightness trebles the current exactly',
    near(bright.saturationCurrentA, 3 * dim.saturationCurrentA, 1e-12),
    `${fmt(dim.saturationCurrentA)} → ${fmt(bright.saturationCurrentA)}`);
  check('...and leaves the stopping potential untouched',
    bright.stoppingVoltage === dim.stoppingVoltage,
    `${fmt(dim.stoppingVoltage)} vs ${fmt(bright.stoppingVoltage)}`);
  check('raising the frequency DOES move the stopping potential',
    stoppingPotential(f2, phi) > stoppingPotential(f1, phi) + 1, '');

  // The I–V curve reaches zero at exactly −V₀ and stays there.
  const curve = ivCurve({ workFunctionEV: phi, frequencyHz: f1, intensityWm2: 1 }, -2, 1, 400);
  const beyond = curve.filter((p) => p.v <= -V1 - 1e-6);
  check('the I–V curve is exactly zero beyond −V₀', beyond.length > 0 && beyond.every((p) => p.i === 0),
    `${beyond.length} points past the stopping potential`);
}

// ═══════════════════════════════════════════════════════════════════════════
G('Gravitation — g rises inside the Earth and peaks at the surface');
// ═══════════════════════════════════════════════════════════════════════════
// M = 5.972×10²⁴ kg, R = 6.371×10⁶ m. By hand:
//   g(R) = GM/R² = 6.674e-11 × 5.972e24 / (6.371e6)² = 9.8195 m/s²
// Inside, g = GMr/R³ so g/r is a constant; outside, g r² is a constant.
{
  const gSurf = surfaceG();
  check('g at the surface = 9.8195 m/s² (hand-computed)', near(gSurf, 9.81956, 1e-5), `got ${fmt(gSurf)}`);

  // Inside: strictly proportional to r.
  const inside = [0.2, 0.5, 0.8].map((f) => ({ f, g: gAtRadius(f * EARTH_RADIUS) }));
  const ratios = inside.map((p) => p.g / (p.f * EARTH_RADIUS));
  check('inside, g is proportional to r (g/r constant)',
    ratios.every((x) => near(x, ratios[0], 1e-14)),
    ratios.map((x) => fmt(x)).join(', '));
  check('...so g at half the radius is half the surface value',
    near(gAtRadius(0.5 * EARTH_RADIUS), gSurf / 2, 1e-12),
    `got ${fmt(gAtRadius(0.5 * EARTH_RADIUS))}, want ${fmt(gSurf / 2)}`);
  check('g at the centre is exactly zero', gAtRadius(0) === 0, `got ${fmt(gAtRadius(0))}`);

  // The peak is AT the surface — not before it and not after it.
  check('g peaks exactly at the surface',
    gAtRadius(EARTH_RADIUS) > gAtRadius(EARTH_RADIUS * 0.999)
    && gAtRadius(EARTH_RADIUS) > gAtRadius(EARTH_RADIUS * 1.001),
    `${fmt(gAtRadius(EARTH_RADIUS * 0.999))} < ${fmt(gSurf)} > ${fmt(gAtRadius(EARTH_RADIUS * 1.001))}`);
  check('...and digging DOWN weakens gravity', gAtRadius(EARTH_RADIUS * 0.9) < gSurf,
    `${fmt(gAtRadius(EARTH_RADIUS * 0.9))} vs ${fmt(gSurf)}`);

  // Outside: inverse square.
  const outside = [1.5, 2.0, 3.0].map((f) => gAtRadius(f * EARTH_RADIUS) * (f * EARTH_RADIUS) ** 2);
  check('outside, g falls as 1/r² (g·r² constant)',
    outside.every((x) => near(x, outside[0], 1e-12)), outside.map((x) => fmt(x)).join(', '));
  check('...matching GM exactly', near(outside[0], G_NEWTON * EARTH_MASS, 1e-12), `got ${fmt(outside[0])}`);

  // The same result through the scene sampler, not just the closed form.
  const scene = FIELD_ARCHETYPES['g-inside-earth'].build({ probeR: 0.5, massEarths: 1, radiusEarths: 1 });
  const gIn = sampleG(scene.sources, { x: 0.5 * EARTH_RADIUS, y: 0 });
  check('the scene sampler agrees with g(r) inside the planet',
    near(Math.hypot(gIn.field.x, gIn.field.y), gSurf / 2, 1e-12),
    `got ${fmt(Math.hypot(gIn.field.x, gIn.field.y))}`);
  check('...and gravity points INWARD', gIn.field.x < 0, `gx = ${fmt(gIn.field.x)}`);

  // Orbits — escape is exactly √2 × circular, and the classifier agrees.
  const r = EARTH_RADIUS + 629e3;
  check('escape speed is √2 × circular speed', near(escapeSpeed(r), Math.SQRT2 * orbitSpeed(r), 1e-14),
    `${fmt(orbitSpeed(r))} → ${fmt(escapeSpeed(r))}`);
  check('a sideways launch at circular speed is classified a circle',
    orbitShape(r, orbitSpeed(r)) === 'circle', orbitShape(r, orbitSpeed(r)));
  check('80% of circular speed is an ellipse', orbitShape(r, orbitSpeed(r) * 0.8) === 'ellipse', '');
  check('above escape speed it is a hyperbola', orbitShape(r, escapeSpeed(r) * 1.05) === 'hyperbola', '');
}

// ═══════════════════════════════════════════════════════════════════════════
G('Trajectories — released from rest vs given a sideways push');
// ═══════════════════════════════════════════════════════════════════════════
// The headline pair. Same source, same charge, one changed initial condition.
{
  const rest = FIELD_ARCHETYPES['charge-released-from-rest'].build({ source: -8, startX: 0.25 });
  const trRest = traceCharge(rest, rest.testCharges[0], { dt: 1 / 2000, maxSteps: 2000, captureRadius: 0.01 });
  const offAxis = Math.max(...trRest.points.map((p) => Math.abs(p.pos.y)));
  check('released from rest on a straight line, it stays on that line', offAxis < 1e-12,
    `max |y| = ${fmt(offAxis)} m`);
  check('...and it speeds up (the electric force DOES work)',
    speedOf(trRest.points[trRest.points.length - 1]) > speedOf(trRest.points[0]),
    `${fmt(speedOf(trRest.points[0]))} → ${fmt(speedOf(trRest.points[trRest.points.length - 1]))} m/s`);

  const side = FIELD_ARCHETYPES['charge-with-sideways-velocity'].build({ source: -8, startX: 0.25, vy: 0.35 });
  const trSide = traceCharge(side, side.testCharges[0], { dt: 1 / 2000, maxSteps: 2000, captureRadius: 0.005 });
  const swept = Math.max(...trSide.points.map((p) => Math.abs(p.pos.y)));
  check('with a sideways push it leaves the line entirely', swept > 0.05,
    `max |y| = ${fmt(swept)} m — it cuts across the radial field lines`);

  // It cuts ACROSS the field: the angle between velocity and E is far from 0.
  const mid = trSide.points[Math.floor(trSide.points.length / 2)];
  const Emid = sampleE(side.sources, mid.pos).field;
  const cosA = (mid.vel.x * Emid.x + mid.vel.y * Emid.y)
    / (Math.hypot(mid.vel.x, mid.vel.y) * Math.hypot(Emid.x, Emid.y));
  check('mid-flight the velocity is nowhere near along the field line', Math.abs(cosA) < 0.9,
    `cos(v, E) = ${fmt(cosA)}`);
}

// ═══════════════════════════════════════════════════════════════════════════
G('Every archetype builds purely, and fills the board');
// ═══════════════════════════════════════════════════════════════════════════
// The same framing functions the component uses, at the two boards the layout
// actually produces. Desktop: the 7fr canvas column of a 1440 px window.
// Phone: a 375 px stage whose content box after the shell padding is 325.
{
  const BOARDS = [
    { name: 'desktop 560×370', w: 560, h: 370 },
    { name: 'phone   325×260', w: 325, h: 260 },
  ];
  // The brief's band: 60–75% linear fill on the binding axis. The camera math
  // (FIT_PAD 0.08 + FRAME_MARGIN 0.06) targets 0.84/1.12 = 75% exactly; the
  // ceiling is set a hair above that so a scene whose content is not square
  // cannot fail on rounding, and the floor is the real requirement.
  const MIN_FILL = 0.60;
  const MAX_FILL = 0.76;

  check('all sixteen archetypes are registered', FIELD_ARCHETYPE_ORDER.length === 16,
    `${FIELD_ARCHETYPE_ORDER.length} in the order list`);

  for (const id of FIELD_ARCHETYPE_ORDER) {
    const a = FIELD_ARCHETYPES[id];
    if (!a) { check(`${id} exists`, false, 'missing from FIELD_ARCHETYPES'); continue; }

    const defaults = Object.fromEntries((a.params ?? []).map((p) => [p.key, p.default]));
    let scene;
    try { scene = a.build(defaults); }
    catch (e) { check(`${id} builds without throwing`, false, String(e).slice(0, 80)); continue; }

    check(`${id} builds and declares kind = ${a.kind}`, !!scene && scene.kind === a.kind,
      `declared ${a.kind}, built ${scene?.kind}`);
    check(`${id} names a misconception`, !!a.targets, a.targets ?? 'none');
    check(`${id} has a guided script of 3+ beats`, (a.defaultSteps ?? []).length >= 3,
      `${(a.defaultSteps ?? []).length} steps`);
    check(`${id} exposes 2+ params`, (a.params ?? []).length >= 2, `${(a.params ?? []).length} params`);

    if (a.mode === 'photoelectric') continue;   // no canvas to fill

    const extras = previewExtras(scene, a.mode);
    const content = contentBounds(scene, extras);
    const frame = frameBounds(scene, extras);

    for (const b of BOARDS) {
      const f = contentFill(content, frame, b.w, b.h);
      const binding = Math.max(f.fx, f.fy);
      check(`${id} @ ${b.name} is not cropped`, f.fx <= MAX_FILL + 1e-9 && f.fy <= MAX_FILL + 1e-9,
        `${(f.fx * 100).toFixed(1)}% × ${(f.fy * 100).toFixed(1)}% — anything over 100% is cut off`);
      check(`${id} @ ${b.name} fills 60–75% of the board`, binding >= MIN_FILL,
        `binding axis fills ${(binding * 100).toFixed(1)}% (band ${MIN_FILL * 100}–75%)`);
    }
  }
}

// ── report ──────────────────────────────────────────────────────────────────

const W = 78;
console.log('');
console.log('  E5 field-bench — every academic claim, re-derived');
console.log(`  ${'═'.repeat(W)}`);

for (const r of rows) {
  if (r.header) {
    console.log('');
    console.log(`  ${r.group}`);
    console.log(`  ${'─'.repeat(W)}`);
    continue;
  }
  const mark = r.ok ? 'PASS' : 'FAIL';
  const name = r.name.length > 58 ? `${r.name.slice(0, 55)}...` : r.name;
  console.log(`  ${mark}  ${name.padEnd(58)} ${r.ok ? '' : r.detail}`);
  if (!r.ok && r.detail) console.log(`        ↳ ${r.detail}`);
  else if (r.ok && r.detail && process.env.VERBOSE) console.log(`        ↳ ${r.detail}`);
}

console.log('');
console.log(`  ${'═'.repeat(W)}`);
console.log(`  ${pass}/${pass + fail} checks passed${fail ? ` — ${fail} FAILED` : ''}`);
console.log('');
process.exit(fail ? 1 : 0);
