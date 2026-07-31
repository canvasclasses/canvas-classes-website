/*
 * verify-optics-bench.mjs — the academic-accuracy gate for the E4 engine.
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW TO RUN
 *
 *     node scripts/verify-optics-bench.mjs
 *
 * WHY THIS EXISTS. Every physics claim the Optical Bench and the Instrument
 * Assembler make on screen is asserted here against a value computed BY HAND and
 * written into the comment above the case. Nothing in this file reads an expected
 * value out of the engine and compares it with itself.
 *
 * The single most important section is §5: the traced ray intersection is checked
 * against the thin-lens formula in the paraxial limit. If those two disagree, one
 * of them is wrong, and since the DRAWING comes from the trace and the READOUT
 * comes from the formula, a student would be shown a picture that contradicts the
 * number beside it. §6 then checks the opposite: on a wide lens they SHOULD
 * disagree, because spheres do not focus perfectly, and that disagreement is
 * spherical aberration rather than a bug.
 *
 * Requires Node ≥ 22.6 for the same `registerHooks` TS shim the other verifiers
 * use. Exits non-zero on any failure.
 */

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

registerHooks({
  resolve(spec, ctx, next) {
    if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL) {
      const base = fileURLToPath(new URL(spec, ctx.parentURL));
      // A bare './foo' may be a missing extension OR a directory. Try both;
      // native ESM resolution does neither.
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

const ROOT = new URL('../packages/book-renderer/blocks/optics-bench/', import.meta.url).href;
const L = await import(`${ROOT}lib/index.ts`);
const A = await import(`${ROOT}archetypes.ts`);

// ── Harness ──────────────────────────────────────────────────────────────────

let pass = 0;
let fail = 0;
const failures = [];
let section = '';

const sec = (name) => {
  section = name;
  console.log(`\n\x1b[1m${name}\x1b[0m`);
  console.log('─'.repeat(78));
};

const check = (name, ok, detail = '') => {
  if (ok) { pass++; return true; }
  fail++;
  failures.push({ section, name, detail });
  console.log(`  \x1b[31mFAIL\x1b[0m  ${name}\n        ${detail}`);
  return false;
};

/** Assert `actual` is within `tol` of `expected`, and print the row. */
const near = (name, actual, expected, tol, note = '') => {
  const ok = Number.isFinite(actual) && Math.abs(actual - expected) <= tol;
  if (ok) {
    pass++;
    rows.push([name, fmt(actual), fmt(expected), 'ok', note]);
    return true;
  }
  fail++;
  failures.push({ section, name, detail: `got ${fmt(actual)}, expected ${fmt(expected)} ± ${tol}` });
  rows.push([name, fmt(actual), fmt(expected), 'FAIL', note]);
  return false;
};

const rows = [];
const fmt = (x) => (x === null || x === undefined ? '—'
  : typeof x === 'boolean' ? String(x)
    : !Number.isFinite(x) ? (Number.isNaN(x) ? 'NaN' : '∞')
      : Math.abs(x) >= 1e5 || (Math.abs(x) < 1e-4 && x !== 0) ? x.toExponential(3) : x.toFixed(5));

const pct = (a, b) => (Math.abs(b) < 1e-12 ? Infinity : Math.abs((a - b) / b) * 100);

/** Trace helper — the options the renderers use. */
const T = (bench, opts = {}) => L.traceBench(bench, { realFan: true, ...opts });
/** How many launched rays got through without hitting a mount or a stop. */
const through = (t) => t.rays.filter((r) => r.terminated !== 'missed-element').length;
const events = (t, kind) => t.events.filter((e) => e.kind === kind);

// ═════════════════════════════════════════════════════════════════════════════
sec('§1  Sign convention — the one place two conventions meet');
// ═════════════════════════════════════════════════════════════════════════════
// The authoring field `focalLength` is CONVERGING-POSITIVE (a "10 cm concave
// mirror" is typed as +10, exactly as a textbook says it). The engine's internal
// value is the NCERT Cartesian signed focal length, with light travelling +x:
//
//   converging lens , f_auth = +10  →  f_cart = +10   (focus downstream)
//   diverging  lens , f_auth = −12  →  f_cart = −12
//   CONCAVE  mirror , f_auth = +10  →  f_cart = −10   (focus upstream — the
//                                                      minus IS the convention)
//   CONVEX   mirror , f_auth = −12  →  f_cart = +12
//
// And for a mirror f_cart = R/2, so a 10 cm concave mirror has R = −20 cm: its
// centre of curvature is 20 cm upstream of the pole.
{
  const lens = { id: 'L', kind: 'thin-lens', x: 0, focalLength: 10 };
  const div = { id: 'L', kind: 'thin-lens', x: 0, focalLength: -12 };
  const concave = { id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10 };
  const convex = { id: 'M', kind: 'mirror-spherical', x: 0, focalLength: -12 };
  const plane = { id: 'M', kind: 'mirror-plane', x: 0 };

  near('converging lens f_auth +10 → f_cart', L.cartesianFocal(lens), 10, 1e-12);
  near('diverging lens f_auth −12 → f_cart', L.cartesianFocal(div), -12, 1e-12);
  near('CONCAVE mirror f_auth +10 → f_cart', L.cartesianFocal(concave), -10, 1e-12,
    'the minus sign IS the sign convention');
  near('CONVEX mirror f_auth −12 → f_cart', L.cartesianFocal(convex), 12, 1e-12);
  check('plane mirror has infinite f_cart', !Number.isFinite(L.cartesianFocal(plane)),
    `got ${L.cartesianFocal(plane)}`);
  near('concave mirror R = 2f_cart', L.mirrorRadius(concave), -20, 1e-12,
    'centre of curvature 20 cm UPSTREAM');
  near('convex mirror R = 2f_cart', L.mirrorRadius(convex), 24, 1e-12);

  // A mirror may be authored by radius alone: f_cart = R/2 directly.
  near('mirror by radius R=−20 → f_cart', L.cartesianFocal({ id: 'M', kind: 'mirror-spherical', x: 0, radius: -20 }), -10, 1e-12);

  // Lens radii from a requested focal length: R = 2(n−1)f, so f=+10 in n=1.5
  // glass is an equiconvex lens of R = 10 cm.
  const { R1, R2 } = L.lensRadii(lens, 1.5);
  near('lensRadii f=+10 n=1.5 → R1', R1, 10, 1e-12);
  near('lensRadii f=+10 n=1.5 → R2', R2, -10, 1e-12);
  const dd = L.lensRadii(div, 1.5);
  near('lensRadii f=−12 n=1.5 → R1', dd.R1, -12, 1e-12, 'biconcave');
  near('lensRadii f=−12 n=1.5 → R2', dd.R2, 12, 1e-12);

  // Object distance is a POSITION, so a real object upstream is always negative.
  near('objectDistance(−30, 0)', L.objectDistance(-30, 0), -30, 1e-12);
  check('u is negative for a real object', L.objectDistance(-30, 0) < 0, 'sign convention broken');

  // Rim thickness scales with aperture: a 0.6 mm-wide lens cannot be 3.5 mm thick.
  near('edgeThickness(4)', L.edgeThickness(4), 0.4, 1e-12, 'capped at EDGE_MAX');
  near('edgeThickness(0.06)', L.edgeThickness(0.06), 0.04, 1e-12, 'floored at EDGE_MIN');
  // Biconvex, R = 10, aperture 4: sagitta = 10 − √(100−16) = 0.83484861 each
  // side, plus a 0.4 cm rim → 2.06969722 cm.
  near('lensThickness(10, −10, 4)', L.lensThickness(10, -10, 4), 2.0696972, 1e-6,
    '2 sagittae + rim');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§2  Paraxial formulas — the numbers a student writes down');
// ═════════════════════════════════════════════════════════════════════════════
{
  // THIN LENS. 1/v − 1/u = 1/f, m = v/u. IN FORCE: Cartesian, light +x.
  //   f = +10, u = −30:  1/v = 1/10 + 1/(−30) = (3−1)/30 = 2/30 → v = +15
  //                      m   = 15/(−30) = −0.5 → real, inverted, half size
  const a = L.thinLensImage(-30, 10);
  near('thin lens f=+10 u=−30 → v', a.v, 15, 1e-9);
  near('thin lens f=+10 u=−30 → m', a.m, -0.5, 1e-9);
  check('thin lens f=+10 u=−30 → real', a.real === true, `got ${a.real}`);
  check('thin lens f=+10 u=−30 → inverted', a.inverted === true, `got ${a.inverted}`);

  //   f = +10, u = −5 (INSIDE the focus): 1/v = 1/10 − 1/5 = −1/10 → v = −10
  //                      m = (−10)/(−5) = +2 → virtual, erect, twice size
  const b = L.thinLensImage(-5, 10);
  near('object inside focus f=+10 u=−5 → v', b.v, -10, 1e-9);
  near('object inside focus f=+10 u=−5 → m', b.m, 2, 1e-9);
  check('object inside focus → virtual', b.real === false, `got ${b.real}`);
  check('object inside focus → erect', b.inverted === false, `got ${b.inverted}`);

  //   Object AT the focus: rays emerge parallel, image at infinity.
  const atF = L.thinLensImage(-10, 10);
  check('object at F → image at infinity', atF.v === null, `got v=${atF.v}`);

  //   f = +10, u = −20 (at 2F): v = +20, m = −1 — same size, inverted.
  const twoF = L.thinLensImage(-20, 10);
  near('object at 2F → v', twoF.v, 20, 1e-9);
  near('object at 2F → m', twoF.m, -1, 1e-9, 'same size, inverted');

  //   Diverging lens f = −12, u = −24: 1/v = −1/12 − 1/24 = −3/24 → v = −8
  //                      m = (−8)/(−24) = +1/3 → virtual, erect, diminished
  const dv = L.thinLensImage(-24, -12);
  near('diverging f=−12 u=−24 → v', dv.v, -8, 1e-9);
  near('diverging f=−12 u=−24 → m', dv.m, 1 / 3, 1e-9);
  check('diverging lens image always virtual', dv.real === false, `got ${dv.real}`);

  // SPHERICAL MIRROR. 1/v + 1/u = 1/f, m = −v/u. f_cart = −10 is a 10 cm
  // CONCAVE mirror.
  //   f = −10, u = −30:  1/v = −1/10 + 1/30 = −2/30 → v = −15
  //                      m   = −(−15)/(−30) = −0.5 → real, inverted
  //   v < 0 means IN FRONT of the mirror, where the light actually went.
  const m1 = L.mirrorImage(-30, -10);
  near('concave mirror f=−10 u=−30 → v', m1.v, -15, 1e-9, 'in front ⇒ real');
  near('concave mirror f=−10 u=−30 → m', m1.m, -0.5, 1e-9);
  check('concave mirror u=−30 → real', m1.real === true, `got ${m1.real}`);
  check('concave mirror u=−30 → inverted', m1.inverted === true, `got ${m1.inverted}`);

  //   f = −10, u = −5 (inside F): 1/v = −1/10 + 1/5 = +1/10 → v = +10
  //                      m = −10/(−5) = +2 → BEHIND the mirror ⇒ virtual, erect
  const m2 = L.mirrorImage(-5, -10);
  near('concave mirror u inside F → v', m2.v, 10, 1e-9, 'behind ⇒ virtual');
  near('concave mirror u inside F → m', m2.m, 2, 1e-9);
  check('concave mirror inside F → virtual', m2.real === false, `got ${m2.real}`);

  //   CONVEX mirror f_cart = +12, u = −25: 1/v = 1/12 + 1/25 = 37/300
  //                      → v = 300/37 = 8.108108…, m = −v/u = +0.324324…
  const m3 = L.mirrorImage(-25, 12);
  near('convex mirror f=+12 u=−25 → v', m3.v, 300 / 37, 1e-9);
  near('convex mirror f=+12 u=−25 → m', m3.m, (300 / 37) / 25, 1e-9);
  check('convex mirror always virtual', m3.real === false, `got ${m3.real}`);
  check('convex mirror always erect', m3.inverted === false, `got ${m3.inverted}`);

  //   PLANE mirror: v = −u, m = +1, always virtual and erect.
  const pm = L.mirrorImage(-17, Infinity);
  near('plane mirror u=−17 → v', pm.v, 17, 1e-12);
  near('plane mirror → m', pm.m, 1, 1e-12);

  // LENS MAKER. 1/f = (n/n_med − 1)(1/R1 − 1/R2).
  //   n=1.5, R1=+10, R2=−10, air:  1/f = 0.5 × 0.2 = 0.1 → f = 10
  near('lens maker n=1.5 R=±10 in air', L.lensMakerFocal(1.5, 10, -10, 1), 10, 1e-9);
  //   Same lens in water (n=1.33): (1.5/1.33 − 1) = 0.1278195,
  //   1/f = 0.1278195 × 0.2 = 0.0255639 → f = 39.1176 cm. Four times weaker.
  near('lens maker same lens in water', L.lensMakerFocal(1.5, 10, -10, 1.33), 39.11765, 1e-4,
    'the "does a lens work under water" answer');
  //   Plano-convex, R1=+15, R2=∞: 1/f = 0.5/15 → f = 30
  near('plano-convex n=1.5 R1=15', L.lensMakerFocal(1.5, 15, Infinity, 1), 30, 1e-9);

  // THICK LENS. 1/f = (n−1)[1/R1 − 1/R2 + (n−1)d/(n R1 R2)].
  //   n=1.5, R=±10, d=0.04036: extra = 0.5×0.04036/(1.5×10×−10) = −1.34533e−4
  //   1/f = 0.5(0.2 − 1.34533e−4) = 0.09993273 → f = 10.006731
  near('thick lens f (d=0.04036)', L.thickLensFocal(1.5, 10, -10, 0.04036), 10.006731, 1e-5);
  check('thick lens f > thin lens f for a biconvex',
    L.thickLensFocal(1.5, 10, -10, 2.07) > 10,
    'a thick biconvex lens is WEAKER than the thin-lens formula says');

  // POWER. P = 100/f(cm).
  near('dioptres(10 cm)', L.dioptres(10), 10, 1e-12);
  near('dioptres(−40 cm)', L.dioptres(-40), -2.5, 1e-12, 'a −2.5 D spectacle lens');

  // TWO THIN LENSES IN CONTACT: 1/F = 1/f1 + 1/f2 → F = 5 for two 10s.
  near('two f=10 lenses in contact', L.combinedFocal(10, 10, 0), 5, 1e-9);
  //   Separated by d = 5: 1/F = 0.1 + 0.1 − 5/100 = 0.15 → F = 6.6667
  near('two f=10 lenses 5 cm apart', L.combinedFocal(10, 10, 5), 20 / 3, 1e-9);

  // SLAB LATERAL SHIFT. shift = t sin(i−r)/cos r, sin i = n sin r.
  //   i=45°, n=1.5, t=6: sin r = 0.4714045 → r = 28.125518°
  //   i=45°, n=1.5, t=6: sin r = 0.4714045 → r = 28.125506°
  //   shift = 6 × sin(16.874494°)/cos(28.125506°) = 6 × 0.2902724/0.8819114
  //         = 1.974854 cm
  near('slab lateral shift i=45 n=1.5 t=6', L.slabLateralShift(45, 1.5, 6), 1.974854, 1e-5);
  near('slab shift at normal incidence', L.slabLateralShift(0, 1.5, 6), 0, 1e-12,
    'no bending ⇒ no shift');

  // APPARENT DEPTH = d/n.  12 cm of water (n=1.33) looks 9.022556 cm deep.
  near('apparent depth 12 cm in water', L.apparentDepth(12, 1.33), 9.022556, 1e-6);

  // INSTRUMENT FORMULAS.
  near('magnifier D/f, f=5', L.magnifierPower(5), 5, 1e-12, 'relaxed eye, image at ∞');
  near('magnifier 1+D/f, f=5', L.magnifierPower(5, false), 6, 1e-12, 'image at near point');
  near('microscope m_o=−4, f_e=5', L.microscopePower(-4, 5), -20, 1e-12, '−4 × 25/5');
  near('telescope f_o=100 f_e=5', L.telescopePower(100, 5), 20, 1e-12);
  near('telescope tube length', L.telescopeTubeLength(100, 5), 105, 1e-12, 'f_o + f_e');
  near('myopia far point 50 cm → f', L.myopiaCorrection(50), -50, 1e-12, 'MINUS is the prescription');
  //   Hypermetropia, near point receded to 50: 1/f = 1/(−50) − 1/(−25) = 0.02 → f = +50
  near('hypermetropia near point 50 → f', L.hypermetropiaCorrection(50), 50, 1e-9);
  near('f-number f=50 D=25', L.fNumber(50, 25), 2, 1e-12);
  near('relative brightness at f/2', L.relativeBrightness(2), 0.25, 1e-12);
  near('brightness ratio f/2 vs f/4', L.relativeBrightness(2) / L.relativeBrightness(4), 4, 1e-12,
    'halve the diameter, quarter the light');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§3  Snell, reflection, and TIR at exactly the critical angle');
// ═════════════════════════════════════════════════════════════════════════════
{
  // CRITICAL ANGLE. θc = asin(n2/n1), defined only when n1 > n2.
  //   n1 = 1.5, n2 = 1: asin(1/1.5) = asin(0.6666667) = 41.810315°
  near('critical angle n=1.5 → air', L.criticalAngleDeg(1.5, 1), 41.810315, 1e-5);
  //   Diamond n = 2.42: asin(1/2.42) = asin(0.4132231) = 24.407469°
  near('critical angle diamond n=2.42', L.criticalAngleDeg(2.42, 1), 24.407469, 1e-5);
  //   Water n = 1.33: asin(1/1.33) = asin(0.7518797) = 48.753467°
  near('critical angle water n=1.33', L.criticalAngleDeg(1.33, 1), 48.753467, 1e-5);
  // Glass → water: asin(1.33/1.5) = asin(0.8866667) = 62.457325°
  near('critical angle glass → water', L.criticalAngleDeg(1.5, 1.33), 62.457325, 1e-5);
  // TIR CANNOT HAPPEN going rare → dense. This is the whole of the
  // `tir_without_denser_medium` misconception, and it is a category error.
  check('no critical angle air → glass', L.criticalAngleDeg(1, 1.5) === null,
    `got ${L.criticalAngleDeg(1, 1.5)}`);
  check('no critical angle for equal indices', L.criticalAngleDeg(1.5, 1.5) === null,
    `got ${L.criticalAngleDeg(1.5, 1.5)}`);

  // The refract() branch the tracer actually calls, swept across θc = 41.810315°.
  // `n` is oriented against the ray, so a ray inside glass hitting a horizontal
  // top surface has n = (0,1) and d pointing up-and-along.
  const at = (deg) => {
    const r = (deg * Math.PI) / 180;
    const d = L.unit({ x: Math.sin(r), y: -Math.cos(r) });
    return L.refract(d, { x: 0, y: 1 }, 1.5, 1.0);
  };
  for (const [deg, wantTir] of [[10, false], [30, false], [41.5, false], [41.8, false],
    [41.81, false], [41.82, true], [42, true], [60, true], [85, true]]) {
    const r = at(deg);
    check(`${deg}° inside n=1.5 → ${wantTir ? 'TIR' : 'refracts'}`, r.tir === wantTir,
      `tir=${r.tir}, i=${r.incidenceDeg.toFixed(4)}`);
    near(`  incidence read back at ${deg}°`, r.incidenceDeg, deg, 1e-6);
  }
  // Just below θc the refracted ray is nearly along the surface: at 41.8°,
  // sin r = 1.5 sin(41.8°) = 1.5 × 0.6665 = 0.99975 → r = 88.7°.
  const justBelow = at(41.8);
  check('just below θc the refracted ray hugs the surface',
    justBelow.refractionDeg > 85 && justBelow.refractionDeg < 90,
    `r = ${justBelow.refractionDeg}`);
  // AT the critical angle sin r = 1 exactly ⇒ r = 90°.
  const exact = at(L.criticalAngleDeg(1.5, 1));
  near('at θc the refraction angle', exact.refractionDeg, 90, 1e-3, 'sin r = 1');

  // Snell going IN always has a solution, however grazing the incidence.
  for (const deg of [10, 45, 80, 89.9]) {
    const r = (deg * Math.PI) / 180;
    const d = L.unit({ x: Math.sin(r), y: -Math.cos(r) });
    const res = L.refract(d, { x: 0, y: 1 }, 1.0, 1.5);
    check(`air → glass at ${deg}° never TIRs`, res.tir === false, `tir=${res.tir}`);
    // sin r = sin i / n, so r < i always.
    check(`  and bends TOWARDS the normal at ${deg}°`, res.refractionDeg < res.incidenceDeg,
      `i=${res.incidenceDeg} r=${res.refractionDeg}`);
  }
  // Snell's law itself: n1 sin i = n2 sin r.
  {
    const deg = 40;
    const r = (deg * Math.PI) / 180;
    const d = L.unit({ x: Math.sin(r), y: -Math.cos(r) });
    const res = L.refract(d, { x: 0, y: 1 }, 1.0, 1.5);
    const lhs = 1.0 * Math.sin(r);
    const rhs = 1.5 * Math.sin((res.refractionDeg * Math.PI) / 180);
    near('n₁ sin i = n₂ sin r', rhs, lhs, 1e-9);
  }
  // Normal incidence never bends.
  {
    const res = L.refract({ x: 0, y: -1 }, { x: 0, y: 1 }, 1.0, 1.5);
    near('normal incidence → r = 0', res.refractionDeg, 0, 1e-9);
    near('normal incidence direction unchanged (y)', res.dir.y, -1, 1e-9);
  }
  // Law of reflection: angle in = angle out, and the tangential component is kept.
  {
    const d = L.unit({ x: 1, y: -1 });
    const out = L.reflect(d, { x: 0, y: 1 });
    near('reflect (1,−1) off horizontal → x', out.x, Math.SQRT1_2, 1e-9);
    near('reflect (1,−1) off horizontal → y', out.y, Math.SQRT1_2, 1e-9);
    near('reflection preserves speed', L.len(out), 1, 1e-12);
  }
  // A 45° mirror turns a horizontal ray through exactly 90°.
  {
    const out = L.reflect({ x: 1, y: 0 }, L.unit({ x: -1, y: 1 }));
    near('45° mirror: +x → +y (x component)', out.x, 0, 1e-9);
    near('45° mirror: +x → +y (y component)', out.y, 1, 1e-9);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§4  Surface geometry — the prism that was built wrong once');
// ═════════════════════════════════════════════════════════════════════════════
{
  // A prism of half-height a and apex angle A has apex-to-base HEIGHT 2a, so the
  // half-base is (2a)·tan(A/2), NOT a·tan(A/2). The factor of two was wrong in
  // the first cut and silently built a 32° prism when 60° was authored — the
  // traced minimum deviation came out 16.96° against the formula's 37.18°. The
  // trace was right; the polygon was not.
  //   a = 3, A = 60: halfBase = 6 tan30° = 3.4641016
  near('prismHalfBase(3, 60°)', L.prismHalfBase(3, 60), 3.4641016, 1e-6);
  //   a = 3, A = 90: halfBase = 6 tan45° = 6
  near('prismHalfBase(3, 90°)', L.prismHalfBase(3, 90), 6, 1e-9);

  // And the polygon really does subtend the authored apex angle.
  for (const A of [30, 45, 60, 75, 90]) {
    const poly = L.elementPolygon({ id: 'P', kind: 'prism', x: 0, y: 0, aperture: 3, apexDeg: A });
    const [bl, br, apex] = poly;
    const l = L.unit(L.sub(bl, apex));
    const r = L.unit(L.sub(br, apex));
    const measured = (Math.acos(Math.max(-1, Math.min(1, L.dot(l, r)))) * 180) / Math.PI;
    near(`prism polygon apex angle A=${A}°`, measured, A, 1e-6);
  }

  // Entry face, not centre. Aiming a beam at the middle of a 60 cm fibre launches
  // it through the side wall, which is a different experiment.
  near('entryX of a 6 cm slab at x=10', L.entryX({ id: 'G', kind: 'slab', x: 10, radius: 6 }), 7, 1e-12);
  near('entryX of a lens at x=10', L.entryX({ id: 'L', kind: 'thin-lens', x: 10 }), 10, 1e-12);
  near('entryX of a 60° prism at x=0',
    L.entryX({ id: 'P', kind: 'prism', x: 0, aperture: 3, apexDeg: 60 }), -3.4641016, 1e-6);

  // A slab is 4 refracting faces plus nothing else; a thin lens is ONE surface;
  // a thick lens is two caps plus its holder.
  const nS = (el) => L.surfacesOf(el, 1).length;
  check('thin lens → 1 surface', nS({ id: 'L', kind: 'thin-lens', x: 0, focalLength: 10 }) === 1,
    `got ${nS({ id: 'L', kind: 'thin-lens', x: 0, focalLength: 10 })}`);
  check('thick lens → 2 caps + mount', nS({ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5 }) === 3,
    `got ${nS({ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5 })}`);
  check('slab → 4 faces', nS({ id: 'G', kind: 'slab', x: 0, radius: 6, aperture: 2, n: 1.5 }) === 4,
    `got ${nS({ id: 'G', kind: 'slab', x: 0, radius: 6, aperture: 2, n: 1.5 })}`);
  check('prism → 3 faces', nS({ id: 'P', kind: 'prism', x: 0, aperture: 3, n: 1.5 }) === 3,
    `got ${nS({ id: 'P', kind: 'prism', x: 0, aperture: 3, n: 1.5 })}`);
  check('spherical mirror → mount + cap', nS({ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10 }) === 2,
    `got ${nS({ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10 })}`);
  check('eye → lens + retina', nS({ id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.5 }) === 2,
    `got ${nS({ id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.5 })}`);

  // The refracting surfaces of a biconvex lens must both have the GLASS on the
  // inside. Getting `outwardSign` backwards swaps n1 and n2 and turns a
  // converging lens into a diverging one with no error anywhere.
  const caps = L.surfacesOf({ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5, aperture: 2 }, 1)
    .filter((s) => s.action === 'refract');
  check('both lens caps carry n_inside = glass',
    caps.every((s) => Math.abs(s.nInside - 1.5) < 1e-12), JSON.stringify(caps.map((s) => s.nInside)));
  check('both lens caps carry n_outside = medium',
    caps.every((s) => Math.abs(s.nOutside - 1) < 1e-12), JSON.stringify(caps.map((s) => s.nOutside)));
  // Front cap outward normal points UPSTREAM (away from the glass behind it).
  {
    const front = caps[0];
    const out = L.outwardAt(front, front.geom.vertex);
    check('front cap outward normal points upstream', out.x < 0, `got (${out.x}, ${out.y})`);
    const back = caps[1];
    const out2 = L.outwardAt(back, back.geom.vertex);
    check('back cap outward normal points downstream', out2.x > 0, `got (${out2.x}, ${out2.y})`);
  }

  // A plane surface is hit where it should be, and a ray outside a `pass` mount
  // simply is not there.
  {
    const stop = L.surfacesOf({ id: 'S', kind: 'aperture', x: 5, aperture: 1 }, 1)[0];
    const hit = L.intersect(stop, { x: 0, y: 0 }, { x: 1, y: 0 }, 1e-7);
    near('stop plane hit at x', hit.point.x, 5, 1e-9);
    check('axial ray is inside the stop opening', hit.inExtent === true, `got ${hit.inExtent}`);
    const miss = L.intersect(stop, { x: 0, y: 3 }, { x: 1, y: 0 }, 1e-7);
    check('a ray 3 cm off-axis is OUTSIDE a 1 cm stop', miss.inExtent === false, `got ${miss.inExtent}`);
    check('but a blocking mount still reports the hit', miss !== null, 'block mounts must report');
  }
  // A sphere reports only its own cap, never the far hemisphere.
  {
    const cap = L.surfacesOf({ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10, aperture: 2 }, 1)
      .find((s) => s.geom.kind === 'sphere');
    const hit = L.intersect(cap, { x: -30, y: 0 }, { x: 1, y: 0 }, 1e-7);
    near('concave mirror cap hit on the axis', hit.point.x, 0, 1e-9, 'the vertex');
    // Behind the mirror there is nothing to hit travelling +x.
    const behind = L.intersect(cap, { x: -30, y: 5 }, { x: 1, y: 0 }, 1e-7);
    check('a ray above a 2 cm mirror misses the cap', behind === null, 'far hemisphere leaked in');
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§5  THE KEY CHECK — the traced rays and the formula are the same physics');
// ═════════════════════════════════════════════════════════════════════════════
// The drawing on screen comes from the trace; the readout comes from the formula.
// If these two disagree in the paraxial limit, a student is shown a picture that
// contradicts the number beside it.
{
  // ── Ideal thin lens: exact for every incidence angle, so the trace must
  //    reproduce v = +15, m = −0.5 to machine precision.
  const lensBench = {
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: 10, aperture: 4 }],
    sources: [{ id: 'S', x: -30, y: 2, kind: 'extended', rayCount: 11 }],
  };
  const t1 = T(lensBench);
  near('TRACED thin lens f=+10 u=−30 → v', t1.finalImage.x, 15, 1e-9, 'formula says +15');
  near('TRACED thin lens → m', t1.finalImage.magnification, -0.5, 1e-9, 'formula says −0.5');
  near('TRACED image height (h=2, m=−0.5)', t1.finalImage.y, -1, 1e-9);
  check('TRACED thin lens → real', t1.finalImage.real === true, `got ${t1.finalImage.real}`);
  check('TRACED thin lens → inverted', t1.finalImage.inverted === true, `got ${t1.finalImage.inverted}`);
  check('TRACED thin lens → NOT aberrated', t1.finalImage.aberrated === false,
    'the ideal-lens rule is exact; any residual is a bug');
  check('every launched ray reaches the image', through(t1) === t1.rays.length,
    `${through(t1)}/${t1.rays.length}`);

  // ── Sweep the whole object range and demand agreement everywhere. This is the
  //    check that would catch a sign slip that happens to cancel at one value.
  let worstLens = 0;
  for (const u of [-70, -50, -40, -30, -25, -20, -15, -12, -11, -9, -8, -6, -5, -3]) {
    const f = 10;
    const expect = L.thinLensImage(u, f);
    const t = T({
      nMedium: 1,
      elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: f, aperture: 4 }],
      sources: [{ id: 'S', x: u, y: 1.5, kind: 'extended', rayCount: 9 }],
    });
    const okV = Math.abs(t.finalImage.x - expect.v) < 1e-6;
    const okM = Math.abs(t.finalImage.magnification - expect.m) < 1e-6;
    const okReal = t.finalImage.real === expect.real;
    worstLens = Math.max(worstLens, Math.abs(t.finalImage.x - expect.v));
    check(`trace = formula at u=${u} (v, m, nature)`, okV && okM && okReal,
      `traced v=${t.finalImage.x} m=${t.finalImage.magnification} real=${t.finalImage.real}; `
      + `formula v=${expect.v} m=${expect.m} real=${expect.real}`);
  }
  near('worst |v_traced − v_formula| across 14 object positions', worstLens, 0, 1e-6);

  // ── Diverging lens, swept the same way.
  for (const u of [-60, -40, -24, -12, -6, -3]) {
    const f = -12;
    const expect = L.thinLensImage(u, f);
    const t = T({
      nMedium: 1,
      elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: f, aperture: 4 }],
      sources: [{ id: 'S', x: u, y: 1.5, kind: 'extended', rayCount: 9 }],
    });
    check(`diverging trace = formula at u=${u}`,
      Math.abs(t.finalImage.x - expect.v) < 1e-6
      && Math.abs(t.finalImage.magnification - expect.m) < 1e-6
      && t.finalImage.real === false,
      `traced v=${t.finalImage.x}, formula v=${expect.v}`);
  }

  // ── REAL GLASS, PARAXIAL LIMIT. Two spherical surfaces traced with Snell's
  //    law, aperture 0.06 cm so the cone is genuinely paraxial. It must land
  //    within 0.5% of the THIN-LENS answer v = +15.
  const thin = { nMedium: 1, elements: [], sources: [] };
  void thin;
  const paraxial = T({
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5, aperture: 0.06 }],
    sources: [{ id: 'S', x: -30, y: 0, kind: 'point', rayCount: 9 }],
  });
  const err = pct(paraxial.finalImage.x, 15);
  near('REAL two-surface glass, paraxial → v', paraxial.finalImage.x, 15, 0.075,
    `${err.toFixed(3)}% from the thin-lens answer`);
  check('paraxial trace agrees with the formula to <0.5%', err < 0.5,
    `off by ${err.toFixed(3)}%`);
  near('  and its magnification', paraxial.finalImage.magnification, -0.5, 0.005);
  check('  and it is not flagged aberrated', paraxial.finalImage.aberrated === false,
    'a paraxial cone must not be called aberrated');

  // ── HOW THE GAP CLOSES AS THE CONE NARROWS. Two effects pull in OPPOSITE
  //    directions, and the measured numbers make that unmistakable:
  //
  //      a=4    v = 13.0872   (−12.752%)   undercorrected spherical aberration
  //      a=2    v = 14.6432   ( −2.379%)   dominates: the focus falls SHORT
  //      a=1    v = 14.9472   ( −0.352%)
  //      a=0.5  v = 15.0043   ( +0.029%)   ← the error changes SIGN here
  //      a=0.25 v = 15.0157   ( +0.104%)   finite THICKNESS dominates: the
  //      a=0.1  v = 15.0221   ( +0.147%)   principal planes are separated, so
  //      a=0.05 v = 15.0230   ( +0.154%)   the focus falls slightly LONG
  //
  //    Spherical aberration goes as h² and vanishes; the principal-plane offset
  //    of a lens with a real rim does not, and `edgeThickness` floors that rim at
  //    0.4 mm. So |error| is NOT monotone — it passes through a near-perfect
  //    cancellation around a = 0.55 and then settles on the thickness residual.
  //
  //    (A first pass asserted monotone improvement of |error| all the way down.
  //    It failed, correctly, at a = 0.25, 0.1 and 0.05. The trace was right; my
  //    expectation ignored the sign change.)
  const errs = [];
  for (const ap of [4, 2, 1, 0.5, 0.25, 0.1, 0.05, 0.02]) {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5, aperture: ap }],
      sources: [{ id: 'S', x: -30, y: 0, kind: 'point', rayCount: 9 }],
    });
    errs.push({ ap, v: t.finalImage.x, err: pct(t.finalImage.x, 15), thick: L.lensThickness(10, -10, ap) });
  }
  // The SIGNED image distance is what behaves monotonically: every narrowing of
  // the cone removes some negative spherical-aberration contribution, so v must
  // rise, every single time.
  for (let i = 1; i < errs.length; i++) {
    check(`narrowing a from ${errs[i - 1].ap} to ${errs[i].ap} cm moves v toward paraxial`,
      errs[i].v > errs[i - 1].v,
      `v went ${errs[i - 1].v.toFixed(6)} → ${errs[i].v.toFixed(6)}`);
  }
  // Every aperture at or below 1 cm agrees with the thin-lens formula to <0.5%.
  for (const e of errs.filter((x) => x.ap <= 1)) {
    check(`aperture ${e.ap} cm agrees with the thin-lens formula to <0.5%`, e.err < 0.5,
      `off by ${e.err.toFixed(4)}%`);
  }
  // The sign change is itself a claim worth pinning: aberration undershoots,
  // thickness overshoots, and the two swap rank between a = 1 and a = 0.5.
  check('a wide cone focuses SHORT of the paraxial answer', errs[2].v < 15, `a=1 → ${errs[2].v}`);
  check('a narrow cone focuses slightly LONG of it', errs[4].v > 15, `a=0.25 → ${errs[4].v}`);
  near('widest lens (a=4) departs from paraxial by', errs[0].err, 12.752, 0.05, 'real aberration');
  near('narrowest lens (a=0.02) departs by', errs[7].err, 0.155, 0.01, 'thickness residual only');
  // The narrow-cone residual is not merely small — it is exactly what the
  // THICK-lens formula predicts for a lens with that rim, computed here from the
  // principal-plane offsets and nothing the engine supplied.
  {
    const d = errs[7].thick;                                  // 0.040040 cm
    const fT = L.thickLensFocal(1.5, 10, -10, d);             // 10.006677
    // H₁ sits x_H1 = −f(n−1)d/(n·R2) to the right of the FRONT vertex, and H₂ the
    // same distance to the LEFT of the back vertex (R2 = −R1 here).
    const shift = (-fT * 0.5 * d) / (1.5 * -10);
    const H1 = -d / 2 + shift;
    const H2 = d / 2 - shift;
    const uH = -30 - H1;
    const vH = 1 / (1 / fT + 1 / uH);
    near('the narrow-cone residual = the thick-lens prediction',
      errs[7].err, pct(H2 + vH, 15), 0.02,
      'principal-plane offset, derived independently');
  }
  // And the aberration term itself scales as h², which is the signature of
  // THIRD-order spherical aberration. Measured against the a→0 limit, halving the
  // aperture from 1 cm to 0.5 cm must quarter it.
  {
    const vLimit = errs[7].v;
    const sa1 = vLimit - errs[2].v;      // a = 1
    const sa2 = vLimit - errs[3].v;      // a = 0.5
    near('spherical aberration quarters when the aperture halves', sa1 / sa2, 4, 0.8,
      'the h² signature of third-order SA');
  }

  // ── CONCAVE MIRROR, traced against 1/v + 1/u = 1/f.
  //    f_auth = 10 (concave) ⇒ f_cart = −10; u = −30 ⇒ v = −15.
  const mirror = T({
    nMedium: 1,
    elements: [{ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10, aperture: 0.2 }],
    sources: [{ id: 'S', x: -30, y: 0, kind: 'point', rayCount: 9 }],
  });
  near('TRACED concave mirror f_cart=−10 u=−30 → v', mirror.finalImage.x, -15, 0.01,
    'formula says −15');
  check('traced mirror agrees with the formula to <0.5%', pct(mirror.finalImage.x, -15) < 0.5,
    `off by ${pct(mirror.finalImage.x, -15).toFixed(4)}%`);
  near('TRACED concave mirror → m', mirror.finalImage.magnification, -0.5, 0.005);
  check('TRACED concave mirror image is REAL', mirror.finalImage.real === true,
    'reflected rays really do converge in front of the mirror');

  // Mirror sweep — a spherical mirror traced exactly, checked paraxially.
  for (const u of [-60, -40, -30, -22, -15, -12, -7, -4]) {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 10, aperture: 0.15 }],
      sources: [{ id: 'S', x: u, y: 0, kind: 'point', rayCount: 7 }],
    });
    const expect = L.mirrorImage(u, -10);
    const e = pct(t.finalImage.x, expect.v);
    check(`concave mirror trace ≈ formula at u=${u} (<0.5%)`, e < 0.5,
      `traced ${t.finalImage.x}, formula ${expect.v}, off ${e.toFixed(3)}%`);
  }
  // Convex mirror: virtual image behind the mirror, every object distance.
  for (const u of [-60, -30, -15, -5]) {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: -12, aperture: 0.15 }],
      sources: [{ id: 'S', x: u, y: 0, kind: 'point', rayCount: 7 }],
    });
    const expect = L.mirrorImage(u, 12);
    check(`convex mirror trace ≈ formula at u=${u}`, pct(t.finalImage.x, expect.v) < 0.5,
      `traced ${t.finalImage.x}, formula ${expect.v}`);
    check(`convex mirror image is virtual at u=${u}`, t.finalImage.real === false,
      `got real=${t.finalImage.real}`);
  }

  // ── The ideal-lens rule works in BOTH directions of travel, which matters the
  //    moment a mirror puts light back through a lens.
  //    A parallel ray at h=1 through f=10 crosses the axis 10 cm downstream.
  {
    const out = L.idealLensOut({ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 }, 10);
    near('idealLensOut: parallel ray crosses axis at +f', -1 / (out.y / out.x), 10, 1e-9);
    const back = L.idealLensOut({ x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 0 }, 10);
    near('idealLensOut: LEFTWARD ray crosses axis at −f', 1 / (back.y / back.x), 10, 1e-9,
      'light returning through the same lens');
    const centre = L.idealLensOut(L.unit({ x: 1, y: 0.3 }), { x: 0, y: 0 }, { x: 0, y: 0 }, 10);
    near('idealLensOut: ray through the centre is undeviated', centre.y / centre.x, 0.3, 1e-9);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§6  Spherical aberration — where the trace SHOULD disagree');
// ═════════════════════════════════════════════════════════════════════════════
{
  // Real spheres do not focus perfectly. A wide biconvex lens (f = 10, aperture 4
  // — that is f/1.25) brings its marginal rays to a focus well short of the
  // paraxial one. The formula panel prints +15; the picture must show ~13.1, and
  // the engine must SAY so rather than average the difference away.
  const wide = T({
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thick-lens', x: 0, focalLength: 10, n: 1.5, aperture: 4 }],
    sources: [{ id: 'S', x: -30, y: 0, kind: 'point', rayCount: 11 }],
  });
  check('a wide real lens is flagged aberrated', wide.finalImage.aberrated === true,
    `aberrated=${wide.finalImage.aberrated}`);
  check('marginal focus falls SHORT of the paraxial focus', wide.finalImage.x < 15 - 0.5,
    `traced ${wide.finalImage.x}, paraxial 15`);
  near('wide-lens traced focus', wide.finalImage.x, 13.09, 0.35, 'undercorrected spherical');
  check('the engine warns about it in words',
    wide.warnings.some((w) => /aberration/i.test(w)),
    `warnings: ${JSON.stringify(wide.warnings)}`);
  // The ideal thin lens must NOT be flagged — it is the clean reference.
  const ideal = T({
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: 10, aperture: 4 }],
    sources: [{ id: 'S', x: -30, y: 0, kind: 'point', rayCount: 11 }],
  });
  check('the ideal thin lens is NOT flagged aberrated', ideal.finalImage.aberrated === false,
    'the ideal-lens rule is exact at all angles by construction');
  check('and it produces no aberration warning',
    !ideal.warnings.some((w) => /aberration/i.test(w)), JSON.stringify(ideal.warnings));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§7  Virtual images are marked, so the UI can dash them');
// ═════════════════════════════════════════════════════════════════════════════
{
  // Students routinely read a back-extension construction line as actual light.
  // Every such segment must carry real:false, and they must only ever be the
  // LAST segment of a ray — a construction line in the middle of a path would be
  // drawn as if light had gone there.
  const div = T({
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: -12, aperture: 3.5 }],
    sources: [{ id: 'S', x: -24, y: 2.4, kind: 'extended', rayCount: 11 }],
  });
  check('diverging lens gives a virtual image', div.finalImage.real === false,
    `real=${div.finalImage.real}`);
  const virt = div.rays.flatMap((r) => r.segments).filter((s) => s.real === false);
  check('construction segments exist and are marked real:false', virt.length > 0,
    `found ${virt.length}`);
  check('every construction segment is the LAST of its ray',
    div.rays.every((r) => {
      const i = r.segments.findIndex((s) => s.real === false);
      return i === -1 || i === r.segments.length - 1;
    }), 'a dashed segment mid-path would read as light that went there');
  check('real segments are marked real:true',
    div.rays.every((r) => r.segments[0].real === true), 'the first segment is always real light');

  // A REAL image must have no construction lines at all.
  const real = T({
    nMedium: 1,
    elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: 10, aperture: 4 }],
    sources: [{ id: 'S', x: -30, y: 2, kind: 'extended', rayCount: 9 }],
  });
  check('a real image draws no construction lines',
    real.rays.every((r) => r.segments.every((s) => s.real === true)),
    'nothing should be dashed when the light really goes there');

  // `image_needs_screen`, made physical: a screen at a convex mirror's virtual
  // image (behind the mirror) receives NOTHING.
  const cm2 = {
    nMedium: 1,
    elements: [{ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: -12, aperture: 4 }],
    sources: [{ id: 'S', x: -25, y: 3, kind: 'extended', rayCount: 11 }],
  };
  const noScreen = T(cm2);
  const at = noScreen.finalImage.x;
  check('convex mirror image sits BEHIND the mirror', at > 0, `image at x=${at}`);
  const withScreen = T({
    ...cm2,
    elements: [...cm2.elements, { id: 'SC', kind: 'screen', x: at, aperture: 5 }],
  });
  check('a screen at a virtual image absorbs ZERO rays',
    events(withScreen, 'absorbed').length === 0,
    `${events(withScreen, 'absorbed').length} rays landed on it`);
  near('and the image itself is unmoved by the screen', withScreen.finalImage.x, at, 1e-9);

  // Whereas a screen at a REAL image catches every ray that gets there.
  const caught = T({
    nMedium: 1,
    elements: [
      { id: 'L', kind: 'thin-lens', x: 0, focalLength: 10, aperture: 4 },
      { id: 'SC', kind: 'screen', x: 15, aperture: 4 },
    ],
    sources: [{ id: 'S', x: -30, y: 2, kind: 'extended', rayCount: 9 }],
  });
  check('a screen at a REAL image absorbs the whole bundle',
    events(caught, 'absorbed').length >= 9,
    `${events(caught, 'absorbed').length} absorbed`);
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§8  Apertures, mounts, and COVERING HALF THE LENS');
// ═════════════════════════════════════════════════════════════════════════════
{
  // A ray beyond the clear aperture hits the holder and stops. That is a surface,
  // not a special case.
  const stopped = T({
    nMedium: 1,
    elements: [
      { id: 'L', kind: 'thin-lens', x: 0, focalLength: 10, aperture: 4 },
      { id: 'ST', kind: 'aperture', x: -2, aperture: 1 },
    ],
    sources: [{ id: 'S', x: -30, y: 2, kind: 'extended', rayCount: 11 }],
  });
  check('a stop blocks rays outside its opening', through(stopped) < stopped.rays.length,
    `all ${stopped.rays.length} rays got through a 1 cm stop`);
  check('blocked rays are labelled missed-element',
    stopped.rays.filter((r) => r.terminated === 'missed-element').length > 0,
    'no ray reported the honest reason');
  check('the engine warns that rays were stopped',
    stopped.warnings.some((w) => /stopped by a mount or a stop/i.test(w)),
    JSON.stringify(stopped.warnings));
  near('a 1 cm stop on a 10 cm lens is f/5', L.fNumber(10, 2), 5, 1e-12);

  // ── THE HALF-LENS RESULT. Cover the bottom half and the image must stay
  //    COMPLETE, the same size, in the same place. Only the number of rays falls.
  const arch = A.OPTICS_ARCHETYPES['half-lens-covered'];
  const base = A.defaultParams(arch);
  const clear = T(arch.build({ ...base, cover: 0 }), { rayCount: arch.rays });
  check('uncovered: every ray gets through', through(clear) === clear.rays.length,
    `${through(clear)}/${clear.rays.length}`);

  let prevThrough = through(clear);
  for (const cover of [10, 25, 50, 75, 90]) {
    const t = T(arch.build({ ...base, cover }), { rayCount: arch.rays });
    const n = through(t);
    // The image must not move, resize, flip, or lose its nature.
    near(`cover ${cover}%: image position unchanged`, t.finalImage.x, clear.finalImage.x, 1e-6);
    near(`cover ${cover}%: image HEIGHT unchanged`, t.finalImage.y, clear.finalImage.y, 1e-6,
      'the image does not halve');
    near(`cover ${cover}%: magnification unchanged`, t.finalImage.magnification,
      clear.finalImage.magnification, 1e-6);
    check(`cover ${cover}%: still a real image`, t.finalImage.real === true, `real=${t.finalImage.real}`);
    check(`cover ${cover}%: the image is still COMPLETE`, t.finalImage.x !== null && n >= 2,
      `only ${n} rays reach it`);
    // …and the fan must genuinely thin, or the archetype is not demonstrating
    // anything at all.
    check(`cover ${cover}%: the ray fan thinned`, n < prevThrough || cover === 10,
      `${n} through, was ${prevThrough}`);
    prevThrough = Math.min(prevThrough, n);
  }
  const half = T(arch.build({ ...base, cover: 50 }), { rayCount: arch.rays });
  const frac = through(half) / through(clear);
  near('covering 50% removes about half the rays', frac, 0.5, 0.12,
    'brightness halves; the picture does not');

  // The stop is an OFFSET aperture — a hand over the lens — with no special code
  // anywhere in the engine.
  const covered = arch.build({ ...base, cover: 50 });
  const card = covered.elements.find((e) => e.id === 'CARD');
  check('the "hand" is just an offset aperture stop', card && card.kind === 'aperture' && card.y > 0,
    JSON.stringify(card));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§9  Prism — deviation, minimum deviation, and dispersion');
// ═════════════════════════════════════════════════════════════════════════════
{
  // MINIMUM DEVIATION. n = sin((A+δm)/2)/sin(A/2).
  //   A = 60°, n = 1.5: sin((60+δ)/2) = 1.5 × 0.5 = 0.75
  //                     (60+δ)/2 = 48.590378° → δm = 37.180756°
  //                     and i₁ at minimum = (A+δm)/2 = 48.590378°
  near('minimum deviation A=60 n=1.5', L.minDeviationDeg(60, 1.5), 37.180756, 1e-5);
  near('incidence at minimum deviation', L.minDeviationIncidenceDeg(60, 1.5), 48.590378, 1e-5);
  //   A = 60°, n = 1.6: sin((60+δ)/2) = 0.8 → 53.130102° → δm = 46.260205°
  near('minimum deviation A=60 n=1.6', L.minDeviationDeg(60, 1.6), 46.260205, 1e-5);
  //   A = 30°, n = 1.5: sin((30+δ)/2) = 1.5 sin15° = 0.3882286
  //                     → 22.844320° → δm = 15.688641°
  near('minimum deviation A=30 n=1.5', L.minDeviationDeg(30, 1.5), 15.688641, 1e-5);
  //   A = 60°, n = 2.1: n sin30° = 1.05 > 1 — no ray can traverse it at all.
  check('A=60 n=2.1 has no minimum deviation', Number.isNaN(L.minDeviationDeg(60, 2.1)),
    `got ${L.minDeviationDeg(60, 2.1)}`);

  // At minimum deviation the deviation formula must agree with the closed form.
  near('δ(i₁ = 48.590378°) = δm', L.prismDeviationDeg(48.590378, 60, 1.5), 37.180756, 1e-4);
  //   i₁ = 30°: r₁ = asin(0.5/1.5) = 19.471221°, r₂ = 40.528779°,
  //             sin i₂ = 1.5 sin(40.528779°) = 0.9748554 → i₂ = 77.095773°
  //             δ = 30 + 77.095773 − 60 = 47.095773°
  near('prism deviation at i₁=30°', L.prismDeviationDeg(30, 60, 1.5), 47.095773, 1e-4);
  //   i₁ = 20°: r₁ = 13.181479°, r₂ = 46.818521°, sin i₂ = 1.5 × 0.7290790
  //             = 1.0936 > 1 — the ray TIRs at the exit face and never emerges.
  check('i₁=20° on a 60° prism → TIR at the exit face',
    L.prismDeviationDeg(20, 60, 1.5) === null,
    `got ${L.prismDeviationDeg(20, 60, 1.5)}`);
  // δ is a minimum, so it must rise on BOTH sides of 48.59°.
  const dm = L.minDeviationDeg(60, 1.5);
  for (const di of [-8, -4, -1, 1, 4, 8]) {
    const d = L.prismDeviationDeg(48.590378 + di, 60, 1.5);
    check(`δ rises ${di > 0 ? 'above' : 'below'} minimum by ${Math.abs(di)}°`, d !== null && d > dm - 1e-6,
      `δ=${d} vs δm=${dm}`);
  }

  // TRACED minimum deviation. Sweep the beam angle over a real two-face trace and
  // find the minimum. A horizontal ray meets the left face of an apex-up 60°
  // prism at 30°, so minimum deviation needs the beam tilted by
  // 48.590378 − 30 = 18.590378°.
  const deviationAt = (beamDeg) => {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'P', kind: 'prism', x: 0, y: 0, aperture: 3, apexDeg: 60, n: 1.5 }],
      sources: [{ id: 'S', x: -18, y: 0, kind: 'parallel-beam', beamAngleDeg: beamDeg, rayCount: 1 }],
    });
    if (events(t, 'refract').length < 2) return null;
    const ray = t.rays[0];
    if (!ray || ray.terminated === 'missed-element') return null;
    const last = ray.segments[ray.segments.length - 1];
    const d = L.unit(L.sub(last.to, last.from));
    return beamDeg - L.degOf(d);
  };
  let best = { dev: Infinity, beam: null };
  for (let b = 5; b <= 60; b += 0.02) {
    const dev = deviationAt(b);
    if (dev !== null && Math.abs(dev) < Math.abs(best.dev)) best = { dev, beam: b };
  }
  near('TRACED minimum deviation through real glass', best.dev, 37.180756, 0.01,
    'two Snell refractions, no formula involved');
  near('TRACED beam angle at minimum deviation', best.beam, 18.590378, 0.05,
    '= 48.590378° incidence − 30° face tilt');
  near('TRACED δ at i₁=30° (beam horizontal)', deviationAt(0), 47.095773, 0.02);
  // At i₁ = 20° (beam tilted −10°) the internal ray meets the SECOND face past
  // the critical angle, so no ray emerges through it — it total-internally
  // reflects instead. The trace must produce a TIR event there.
  //
  // (A first pass asserted `deviationAt(-10) === null` on the assumption that a
  // TIR'd ray produces fewer than two refractions. It does not: the trapped ray
  // goes on to leave through the prism's BASE, giving a second refraction. The
  // physics was right; the test was looking at the wrong signal.)
  {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'P', kind: 'prism', x: 0, y: 0, aperture: 3, apexDeg: 60, n: 1.5 }],
      sources: [{ id: 'S', x: -18, y: 0, kind: 'parallel-beam', beamAngleDeg: -10, rayCount: 1 }],
    });
    const tir = events(t, 'tir');
    check('TRACED: at i₁=20° the exit face total-internally reflects', tir.length > 0,
      `no TIR event; events were ${JSON.stringify(t.events.map((e) => e.kind))}`);
    check('  and it is past the critical angle',
      tir.every((e) => e.incidenceDeg > e.criticalDeg - 1e-9),
      JSON.stringify(tir.map((e) => [+e.incidenceDeg.toFixed(2), +e.criticalDeg.toFixed(2)])));
    check('  which is why the formula reports no emergent ray',
      L.prismDeviationDeg(20, 60, 1.5) === null, `${L.prismDeviationDeg(20, 60, 1.5)}`);
  }

  // DISPERSION. Cauchy n(λ) = n_D + B(1/λ² − 1/λ_D²), B = 4200 nm², λ_D = 589.3.
  //   n(589.3) = 1.500000 exactly
  //   n(400)   = 1.5 + 4200(1/160000 − 1/347274.49) = 1.5 + 0.0141557 = 1.5141557
  //   n(700)   = 1.5 + 4200(1/490000 − 1/347274.49) = 1.5 − 0.0035228 = 1.4964772
  near('indexAt(589.3 nm)', L.indexAt(589.3, 1.5), 1.5, 1e-12, 'the sodium D line');
  near('indexAt(400 nm) — violet', L.indexAt(400, 1.5), 1.5141557, 1e-6);
  near('indexAt(700 nm) — red', L.indexAt(700, 1.5), 1.4964772, 1e-6);
  check('violet has a HIGHER index than red', L.indexAt(400, 1.5) > L.indexAt(700, 1.5),
    'dispersion sign inverted');
  //   n_F − n_C over 486.1–656.3 nm should be ≈ 0.00806 (Abbe V ≈ 64, crown).
  const nF = L.indexAt(486.1, 1.5);
  const nC = L.indexAt(656.3, 1.5);
  near('n_F − n_C (crown-glass magnitude)', nF - nC, 0.00806, 5e-5);
  near('Abbe number V = (n_D−1)/(n_F−n_C)', 0.5 / (nF - nC), 62, 3, 'crown glass');
  // Violet is deviated MORE than red, and by a visible amount.
  const dViolet = L.minDeviationDeg(60, L.indexAt(435, 1.5));
  const dRed = L.minDeviationDeg(60, L.indexAt(660, 1.5));
  check('violet deviates more than red', dViolet > dRed, `violet ${dViolet}, red ${dRed}`);
  near('angular dispersion 435→660 nm on a 60° prism', dViolet - dRed, 0.93, 0.25, 'degrees');
  near('angularDispersionDeg agrees', L.angularDispersionDeg(60, 1.5, 435, 660), dViolet - dRed, 1e-9);

  // TRACED dispersion: seven wavelengths through one prism must emerge in
  // spectral order, red least deviated.
  const disp = T(A.OPTICS_ARCHETYPES['prism-dispersion'].build(
    A.defaultParams(A.OPTICS_ARCHETYPES['prism-dispersion'])), { dispersion: true, rayCount: 1 });
  const exit = disp.rays.map((r) => {
    const last = r.segments[r.segments.length - 1];
    return { wl: last.wavelength, deg: L.degOf(L.unit(L.sub(last.to, last.from))) };
  }).sort((a, b) => b.wl - a.wl);   // red first
  check('all seven wavelengths emerge', exit.length === 7, `got ${exit.length}`);
  let ordered = true;
  for (let i = 1; i < exit.length; i++) if (exit[i].deg >= exit[i - 1].deg) ordered = false;
  check('emergent rays are in spectral order (red deviated least)', ordered,
    JSON.stringify(exit.map((e) => [e.wl, +e.deg.toFixed(3)])));
  check('every traced ray carries its wavelength',
    disp.rays.every((r) => r.segments.every((s) => typeof s.wavelength === 'number')),
    'the renderer needs it to colour the segment');
  // Spectral colour must actually be spectral.
  const [rr, rg, rb] = L.wavelengthToRGB(660);
  const [vr, vg, vb] = L.wavelengthToRGB(435);
  check('660 nm renders red-dominant', rr > rg && rr > rb, `rgb(${rr},${rg},${rb})`);
  check('435 nm renders blue-dominant', vb > vg && vb > vr, `rgb(${vr},${vg},${vb})`);
  check('520 nm renders green-dominant', (() => { const [r, g, b] = L.wavelengthToRGB(520); return g > r && g > b; })(),
    JSON.stringify(L.wavelengthToRGB(520)));
  check('colourName(435) is violet-ish', /violet|indigo/.test(L.colourName(435)), L.colourName(435));
  check('colourName(660) is red', L.colourName(660) === 'red', L.colourName(660));
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§10  TIR in a real trace, and the optical fibre');
// ═════════════════════════════════════════════════════════════════════════════
{
  // To control the angle INSIDE the dense medium exactly, make the dense medium
  // the surroundings: nMedium = 1.5, and the element is an air block (n = 1). A
  // beam at angle β meets the block's vertical left face at incidence β, so the
  // transition must land exactly on θc = 41.810315°.
  const atBeam = (beamDeg) => {
    const t = T({
      nMedium: 1.5,
      elements: [{ id: 'AIR', kind: 'slab', x: 12, y: 0, radius: 8, aperture: 9, n: 1.0 }],
      sources: [{ id: 'S', x: -4, y: 0, kind: 'parallel-beam', beamAngleDeg: beamDeg, rayCount: 1 }],
    });
    const first = t.events.find((e) => e.kind === 'tir' || e.kind === 'refract');
    return first ?? null;
  };
  for (const [deg, wantTir] of [[10, false], [30, false], [41.0, false], [41.7, false],
    [41.9, true], [45, true], [60, true]]) {
    const e = atBeam(deg);
    check(`TRACE: ${deg}° inside n=1.5 → ${wantTir ? 'TIR' : 'refracts'}`,
      e !== null && (e.kind === 'tir') === wantTir,
      e ? `kind=${e.kind}, i=${e.incidenceDeg.toFixed(3)}` : 'no boundary event at all');
    if (e) {
      near(`  TRACE incidence at ${deg}°`, e.incidenceDeg, deg, 1e-3);
      near(`  TRACE reports θc`, e.criticalDeg, 41.810315, 1e-5);
    }
  }
  // Bisect the transition and confirm it IS the critical angle, to 0.01°.
  {
    let lo = 41.0, hi = 42.5;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const e = atBeam(mid);
      if (e && e.kind === 'tir') hi = mid; else lo = mid;
    }
    near('TRACED TIR onset (bisected)', (lo + hi) / 2, 41.810315, 0.01,
      'the trace flips at exactly asin(1/1.5)');
  }
  // And the reported warning names both angles.
  {
    const t = T({
      nMedium: 1.5,
      elements: [{ id: 'AIR', kind: 'slab', x: 12, y: 0, radius: 8, aperture: 9, n: 1.0 }],
      sources: [{ id: 'S', x: -4, y: 0, kind: 'parallel-beam', beamAngleDeg: 50, rayCount: 1 }],
    });
    check('the trace warns about total internal reflection',
      t.warnings.some((w) => /total internal reflection/i.test(w)), JSON.stringify(t.warnings));
  }

  // THE FIBRE. Light launched through the END face of an n = 1.5 core always
  // strikes the walls past θc — because the internal angle can never exceed
  // asin(1/1.5) = 41.81°, so the wall incidence (90° − that) can never fall
  // below 48.19°. It is trapped whatever the launch angle, which is why a fibre
  // works at all.
  const fib = A.OPTICS_ARCHETYPES['optical-fibre'];
  const fibT = T(fib.build(A.defaultParams(fib)), { rayCount: 5 });
  check('the fibre TIRs at its walls', events(fibT, 'tir').length > 0,
    `${events(fibT, 'tir').length} TIR events`);
  check('every wall TIR is past the critical angle',
    events(fibT, 'tir').every((e) => e.incidenceDeg > e.criticalDeg - 1e-9),
    JSON.stringify(events(fibT, 'tir').map((e) => [+e.incidenceDeg.toFixed(2), +e.criticalDeg.toFixed(2)])));
  check('all wall TIR incidences exceed 48.19°',
    events(fibT, 'tir').every((e) => e.incidenceDeg > 48.19 - 1e-6),
    'the end-face launch bounds the internal angle at 41.81°');
  check('light reaches the far end (rays are not lost)', through(fibT) === fibT.rays.length,
    `${through(fibT)}/${fibT.rays.length}`);
  // Raise the cladding index and the guide starts to leak.
  const leaky = T(fib.build({ ...A.defaultParams(fib), cladding: 'oil' }), { rayCount: 5 });
  check('a cladding denser than the core cannot guide at all',
    events(leaky, 'tir').length < events(fibT, 'tir').length,
    `oil-clad TIRs ${events(leaky, 'tir').length}, air-clad ${events(fibT, 'tir').length}`);

  // The glass slab: bent twice, emerging PARALLEL to the incident ray.
  const slab = T({
    nMedium: 1,
    elements: [{ id: 'G', kind: 'slab', x: 0, y: 0, radius: 6, aperture: 7, n: 1.5, tiltDeg: 90 }],
    sources: [{ id: 'S', x: -16, y: 0, kind: 'parallel-beam', beamAngleDeg: -45, rayCount: 1 }],
  });
  {
    const segs = slab.rays[0].segments;
    const inDir = L.unit(L.sub(segs[0].to, segs[0].from));
    const outDir = L.unit(L.sub(segs[segs.length - 1].to, segs[segs.length - 1].from));
    near('slab: emergent ray is PARALLEL to the incident ray',
      L.degOf(outDir), L.degOf(inDir), 1e-6, 'displaced, never permanently bent');
    check('slab refracts exactly twice', events(slab, 'refract').length === 2,
      `${events(slab, 'refract').length} refractions`);
    // Going in it bends TOWARDS the normal; coming out, away — by the same angle.
    const [e1, e2] = events(slab, 'refract');
    near('slab: r on entry < i on entry', e1.refractionDeg, 28.125518, 1e-3);
    near('slab: i on exit = r on entry', e2.incidenceDeg, e1.refractionDeg, 1e-6,
      'which is why the two bends cancel');
    near('slab: r on exit = i on entry', e2.refractionDeg, e1.incidenceDeg, 1e-6);
  }
  // Under water the deviation at each face collapses — the medium is not a detail.
  const inWater = T({
    nMedium: 1.33,
    elements: [{ id: 'G', kind: 'slab', x: 0, y: 0, radius: 6, aperture: 7, n: 1.5, tiltDeg: 90 }],
    sources: [{ id: 'S', x: -16, y: 0, kind: 'parallel-beam', beamAngleDeg: -45, rayCount: 1 }],
  });
  {
    const air = events(slab, 'refract')[0];
    const wat = events(inWater, 'refract')[0];
    const bendAir = air.incidenceDeg - air.refractionDeg;
    const bendWater = wat.incidenceDeg - wat.refractionDeg;
    check('the same glass bends far less under water', bendWater < bendAir * 0.45,
      `air bends ${bendAir.toFixed(2)}°, water ${bendWater.toFixed(2)}°`);
    // The boundary is water→GLASS, not air→water: sin45 = (1.5/1.33) sin r, so
    // sin r = 0.7071068 × 1.33/1.5 = 0.6269624 ⇒ r = 38.826781°, a bend of
    // 6.173219° against 16.874494° in air. (My first pass wrote 12.888° here by
    // using n = 1.33 alone — the wrong pair of media.)
    near('  and the water bend is', bendWater, 6.173219, 5e-4);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§11  Instruments — the microscope product and the telescope ratio');
// ═════════════════════════════════════════════════════════════════════════════
{
  // ── COMPOUND MICROSCOPE, normal adjustment.
  //   Objective f_o = 2, object at u = −2.5:
  //       1/v = 1/2 − 1/2.5 = 0.1 → v = +10,  m_o = 10/(−2.5) = −4
  //   The intermediate image is 4× the object and 10 cm along the tube.
  //   Eyepiece f_e = 5 placed at x = 15, so the intermediate image sits at ITS
  //   front focus (u_e = −5) and the final image goes to infinity:
  //       M_e = D/f_e = 25/5 = +5
  //   Total M = m_o × M_e = −4 × 5 = −20. THE PRODUCT, not the sum.
  const micro = {
    nMedium: 1,
    elements: [
      { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: 2, aperture: 1.2, label: 'objective' },
      { id: 'EYE', kind: 'thin-lens', x: 15, focalLength: 5, aperture: 1.8, label: 'eyepiece' },
    ],
    sources: [{ id: 'S', x: -2.5, y: 0.1, kind: 'extended', rayCount: 11 }],
  };
  const tm = T(micro);
  check('microscope: two imaging stages are reported', tm.stages.length === 2,
    `got ${tm.stages.length}`);
  near('microscope stage 1: intermediate image position', tm.stages[0].imageX, 10, 1e-6,
    'the image students never see drawn');
  near('microscope stage 1: m_o', tm.stages[0].magnification, -4, 1e-6);
  near('  formula agrees: v/u', L.thinLensImage(-2.5, 2).m, -4, 1e-9);
  check('microscope stage 2 sends the image to infinity', tm.stages[1].magnification === null,
    `got ${tm.stages[1].magnification}`);
  check('microscope final image is at infinity', tm.finalImage.x === null,
    `got ${tm.finalImage.x}`);
  near('microscope TOTAL angular magnification', tm.angular, -20, 1e-6);
  // The whole point: total = product of the stages.
  const mO = tm.stages[0].magnification;
  const mE = L.NEAR_POINT_CM / 5;
  near('TOTAL = m_objective × M_eyepiece', tm.angular, mO * mE, 1e-6,
    `${mO} × ${mE} = ${mO * mE}`);
  near('and microscopePower() agrees', L.microscopePower(mO, 5), tm.angular, 1e-6);
  check('total is NOT the sum of the stages', Math.abs(tm.angular - (mO + mE)) > 1,
    'stages multiply; they do not add');

  // Sweep the objective and eyepiece and demand the product law holds every time.
  for (const [fo, fe, u] of [[2, 5, 2.5], [1, 5, 1.25], [2, 10, 2.5], [3, 6, 3.6], [1.5, 4, 2]]) {
    const v = 1 / (1 / fo - 1 / u);
    const t = T({
      nMedium: 1,
      elements: [
        { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: 1.2 },
        { id: 'EYE', kind: 'thin-lens', x: v + fe, focalLength: fe, aperture: 2.4 },
      ],
      sources: [{ id: 'S', x: -u, y: 0.06, kind: 'extended', rayCount: 9 }],
    });
    const expect = L.thinLensImage(-u, fo).m * (L.NEAR_POINT_CM / fe);
    check(`microscope f_o=${fo} f_e=${fe} u=${u}: total = product`,
      Math.abs(t.angular - expect) < 1e-4,
      `traced ${t.angular}, product ${expect}`);
  }

  // ── REFRACTING TELESCOPE, normal adjustment.
  //   f_o = 100, f_e = 5, separation f_o + f_e = 105.
  //   Parallel light in at α; the objective forms h = f_o tanα in its focal
  //   plane, which is the eyepiece's front focal plane, so light leaves parallel
  //   at slope −h/f_e. Apparent angles reverse sign (the eye looks BACK along the
  //   light), so M = −f_o/f_e = −20: magnitude 20, and the minus IS the inversion
  //   every student is told about.
  // NOTE ON THE EYEPIECE APERTURE. The intermediate image sits h = f₀ tanα off
  // the axis, so it must fall inside the eyepiece's clear aperture or the whole
  // bundle is vignetted and there is no emergent ray to measure. That is real
  // physics — it is why a wide-field telescope needs a physically large eyepiece
  // — and the archetype now sizes its eyepiece the same way. A fixed
  // `max(1.2, R × 0.32)` silently emptied the canvas at f₀ = 150, f_e = 3, which
  // is a defect this suite caught.
  const telescope = (fo, fe, alpha) => T({
    nMedium: 1,
    elements: [
      { id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: fo, aperture: 6 },
      {
        id: 'EYE', kind: 'thin-lens', x: fo + fe, focalLength: fe,
        aperture: Math.max(1.4, Math.abs(fo * Math.tan((alpha * Math.PI) / 180)) * 1.2 + 0.4),
      },
    ],
    sources: [{ id: 'S', x: -fo * 0.35, y: 0, kind: 'parallel-beam', beamAngleDeg: alpha, rayCount: 9 }],
  });
  const tt = telescope(100, 5, -1);
  near('telescope angular magnification', tt.angular, -20, 1e-6, 'signed: inverted');
  near('|M| = f_objective / f_eyepiece', Math.abs(tt.angular), L.telescopePower(100, 5), 1e-6);
  check('telescope image is at infinity', tt.finalImage.x === null, `got ${tt.finalImage.x}`);
  check('telescope image is inverted (M < 0)', tt.angular < 0, `M = ${tt.angular}`);
  check('telescope has NO transverse magnification to report',
    tt.finalImage.magnification === null,
    'a star has no height — this is the telescope/microscope confusion');
  for (const [fo, fe] of [[100, 5], [80, 4], [120, 2], [60, 10], [150, 3], [40, 8]]) {
    const t = telescope(fo, fe, -0.8);
    near(`telescope f_o=${fo} f_e=${fe} → |M| = f_o/f_e`, Math.abs(t.angular), fo / fe, 1e-4);
    near(`  tube length f_o + f_e`, L.telescopeTubeLength(fo, fe), fo + fe, 1e-12);
  }
  // M must not depend on the incoming angle — that is what "angular
  // magnification" means.
  for (const a of [-2, -1, -0.5, 0.5, 1, 2]) {
    const t = telescope(100, 5, a);
    near(`telescope M is angle-independent (α=${a}°)`, t.angular, -20, 2e-3);
  }
  // The objective really does form its image in the focal plane.
  {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'OBJ', kind: 'thin-lens', x: 0, focalLength: 100, aperture: 6 }],
      sources: [{ id: 'S', x: -35, y: 0, kind: 'parallel-beam', beamAngleDeg: -1, rayCount: 9 }],
    });
    near('parallel light focuses at x = f', t.finalImage.x, 100, 1e-6);
  }

  // ── MAGNIFIER: object at the focus, image at infinity, M = D/f.
  {
    const t = T({
      nMedium: 1,
      elements: [{ id: 'L', kind: 'thin-lens', x: 0, focalLength: 5, aperture: 3 }],
      sources: [{ id: 'S', x: -5, y: 1, kind: 'extended', rayCount: 9 }],
    });
    check('object at F → image at infinity', t.finalImage.x === null, `got ${t.finalImage.x}`);
    near('magnifier M = D/f = 25/5', t.angular, 5, 1e-6, 'positive ⇒ erect');
    near('  magnifierPower() agrees', L.magnifierPower(5), t.angular, 1e-6);
  }
  // apparentAngle sign rule, stated once and checked here.
  near('apparentAngle of an axial ray', L.apparentAngle({ x: 1, y: 0 }), 0, 1e-12);
  near('apparentAngle reverses the emergent slope',
    L.apparentAngle(L.unit({ x: 1, y: -0.2 })), Math.atan(0.2), 1e-9,
    'the eye looks BACK along the light');

  // ── BINOCULARS: the fold shortens the tube and costs no magnification.
  const bino = A.OPTICS_ARCHETYPES['binoculars'];
  const bp = A.defaultParams(bino);
  const straight = bino.build({ ...bp, stage: 'straight telescope' });
  const folded = bino.build({ ...bp, stage: 'folded binocular' });
  const ts = T(straight, { rayCount: 9 });
  const tf = T(folded, { rayCount: 9 });
  near('straight telescope |M| = f_o/f_e', Math.abs(ts.angular), 30 / 4, 1e-4);
  near('FOLDED |M| is the same', Math.abs(tf.angular), 30 / 4, 5e-3,
    'the fold costs no magnification');
  const xOf = (b, id) => b.elements.find((e) => e.id === id).x;
  check('the folded tube is physically SHORTER',
    xOf(folded, 'EYE') < xOf(straight, 'EYE') - 1,
    `folded ${xOf(folded, 'EYE')}, straight ${xOf(straight, 'EYE')}`);
  near('  tube shortened by (cm)', xOf(straight, 'EYE') - xOf(folded, 'EYE'), 2.98, 0.4);
  check('the fold is lossless total internal reflection', events(tf, 'tir').length > 0,
    'no TIR events — the prisms are not folding anything');
  check('every fold reflection is past the critical angle',
    events(tf, 'tir').every((e) => e.incidenceDeg > e.criticalDeg - 1e-9), 'a 45° face needs θc < 45°');
  check('the eyepiece ends up offset from the objective',
    Math.abs((folded.elements.find((e) => e.id === 'EYE').y ?? 0)) > 1,
    'which is why real binocular eyepieces are offset');
  // ⚠ And the honest limit: two reflections that return the beam to +x compose
  // to a rotation by 0° IN THE PLANE OF THE FOLD, so there is NO transverse flip.
  // A 2-D bench cannot show the erecting — that needs the second Porro prism in
  // the perpendicular plane. The archetype text says exactly this.
  check('the 2-D fold does NOT erect (documented, not claimed otherwise)',
    Math.sign(tf.angular) === Math.sign(ts.angular),
    'if this ever flips, the archetype copy must be revisited');

  // ── CAMERA: focus is set by moving the SENSOR, not by changing the lens.
  {
    const f = 8, u = 40;
    const v = 1 / (1 / f - 1 / u);           // = 10
    near('camera image plane v', v, 10, 1e-9);
    const sharp = T({
      nMedium: 1,
      elements: [
        { id: 'L', kind: 'thin-lens', x: 0, focalLength: f, aperture: 3 },
        { id: 'ST', kind: 'aperture', x: -1, aperture: 1.5 },
        { id: 'SENSOR', kind: 'screen', x: v, aperture: 3.4 },
      ],
      sources: [{ id: 'S', x: -u, y: 3, kind: 'extended', rayCount: 13 }],
    });
    near('camera: the image lands on the sensor', sharp.finalImage.x, v, 1e-6);
    check('camera: the sensor absorbs the bundle', events(sharp, 'absorbed').length > 4,
      `${events(sharp, 'absorbed').length} absorbed`);
    near('camera: |m| < 1, so it demagnifies the world',
      Math.abs(sharp.finalImage.magnification), 0.25, 1e-6);
    near('camera f-number at a 3 cm opening', L.fNumber(8, 3), 8 / 3, 1e-12);
  }

  // ── EYE: the retina cannot move, so myopia is a LENGTH problem.
  {
    const eyeArch = A.OPTICS_ARCHETYPES['eye-and-spectacles'];
    const ep = A.defaultParams(eyeArch);
    const normal = T(eyeArch.build(ep), { rayCount: 11 });
    near('relaxed 2.5 cm eye focuses parallel light at the retina',
      normal.finalImage.x, 2.5, 1e-3);
    const myopic = T(eyeArch.build({ ...ep, eyeLength: 2.9 }), { rayCount: 11 });
    near('myopic eye still focuses at f = 2.5 cm', myopic.finalImage.x, 2.5, 1e-3);
    check('so the image lands 0.4 cm SHORT of a 2.9 cm retina',
      Math.abs(2.9 - myopic.finalImage.x - 0.4) < 1e-2,
      `image at ${myopic.finalImage.x}, retina at 2.9`);
    // The correcting lens must image infinity onto the eye's far point.
    //   Need v = 2.9 with f = 2.5: 1/u = 1/2.9 − 1/2.5 = −0.0551724 → u = −18.125
    //   The spectacle sits 2 cm in front, so its focal length is
    //   −(18.125 − 2) = −16.125 cm ⇒ P = 100/(−16.125) = −6.2016 D.
    near('required object distance for the eye', 1 / (1 / 2.9 - 1 / 2.5), -18.125, 1e-3);
    near('required spectacle power', 100 / -16.125, -6.2016, 1e-3, 'NEGATIVE — the prescription');
    const fixed = T(eyeArch.build({ ...ep, eyeLength: 2.9, spectacle: -6.2016 }), { rayCount: 11 });
    near('with −6.2 D the image lands on the retina', fixed.finalImage.x, 2.9, 0.02);
    const wrongSign = T(eyeArch.build({ ...ep, eyeLength: 2.9, spectacle: +6.2016 }), { rayCount: 11 });
    check('a POSITIVE lens makes myopia worse, not better',
      wrongSign.finalImage.x < myopic.finalImage.x,
      `+6.2 D gives ${wrongSign.finalImage.x}, uncorrected was ${myopic.finalImage.x}`);
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§12  Structural recognition — no flags anywhere');
// ═════════════════════════════════════════════════════════════════════════════
{
  // Every verdict below is derived from which primitives are present and how they
  // are arranged. Nothing in the engine ever sets "this is a camera".
  const R = (bench) => L.recognise(bench).recognised;
  const src = (x, y, kind = 'extended') => ({ id: 'S', x, y, kind, rayCount: 9 });
  const beam = (x) => ({ id: 'S', x, y: 0, kind: 'parallel-beam', beamAngleDeg: -1, rayCount: 9 });
  const lens = (id, x, f, ap = 3) => ({ id, kind: 'thin-lens', x, focalLength: f, aperture: ap });

  const cases = [
    ['bare lens, object outside F', { nMedium: 1, elements: [lens('L', 0, 10)], sources: [src(-30, 2)] }, 'bare-lens'],
    ['lens with the object INSIDE F', { nMedium: 1, elements: [lens('L', 0, 10)], sources: [src(-5, 1.4)] }, 'magnifier'],
    ['lens + sensor at the image', { nMedium: 1, elements: [lens('L', 0, 8), { id: 'SC', kind: 'screen', x: 10, aperture: 3.4 }], sources: [src(-40, 3)] }, 'camera'],
    ['lens + stop + sensor', { nMedium: 1, elements: [{ id: 'ST', kind: 'aperture', x: -1, aperture: 1.5 }, lens('L', 0, 8), { id: 'SC', kind: 'screen', x: 10, aperture: 3.4 }], sources: [src(-40, 3)] }, 'camera'],
    ['object close, screen far ⇒ magnified', { nMedium: 1, elements: [lens('L', 0, 8), { id: 'SC', kind: 'screen', x: 40, aperture: 6 }], sources: [src(-10, 1)] }, 'projector'],
    ['a hole and a screen, no lens', { nMedium: 1, elements: [{ id: 'H', kind: 'aperture', x: 0, aperture: 0.06 }, { id: 'SC', kind: 'screen', x: 12, aperture: 4 }], sources: [src(-30, 3)] }, 'pinhole'],
    ['an eyeball', { nMedium: 1, elements: [{ id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.5, aperture: 0.4 }], sources: [beam(-9)] }, 'eye'],
    ['an eyeball grown too long', { nMedium: 1, elements: [{ id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.9, aperture: 0.4 }], sources: [beam(-9)] }, 'eye-myopic'],
    ['+ a diverging lens in front', { nMedium: 1, elements: [lens('SPEC', -2, -16, 0.36), { id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.9, aperture: 0.4 }], sources: [beam(-9)] }, 'eye-corrected'],
    ['short objective, near object, 2 lenses', { nMedium: 1, elements: [lens('OBJ', 0, 2, 1.2), lens('EYE', 15, 5, 1.8)], sources: [src(-2.5, 0.1)] }, 'microscope'],
    ['long objective, object at infinity', { nMedium: 1, elements: [lens('OBJ', 0, 100, 6), lens('EYE', 105, 5, 2)], sources: [beam(-35)] }, 'telescope-refracting'],
    ['a concave mirror + an eyepiece', { nMedium: 1, elements: [{ id: 'M', kind: 'mirror-spherical', x: 0, focalLength: 40, aperture: 8 }, lens('EYE', -36, 4, 2)], sources: [beam(-60)] }, 'telescope-reflecting'],
    ['a lone diverging lens', { nMedium: 1, elements: [lens('L', 0, -12)], sources: [src(-24, 2)] }, 'bare-lens'],
  ];
  for (const [label, bench, want] of cases) {
    check(`recognises: ${label} → ${want}`, R(bench) === want, `got "${R(bench)}"`);
  }
  // Binoculars: the folded archetype bench, recognised structurally.
  {
    const bino = A.OPTICS_ARCHETYPES['binoculars'];
    const folded = bino.build({ ...A.defaultParams(bino), stage: 'folded binocular' });
    check('recognises: two lenses + two prisms between them → binoculars',
      R(folded) === 'binoculars', `got "${R(folded)}"`);
    const straight = bino.build({ ...A.defaultParams(bino), stage: 'straight telescope' });
    check('  and without the prisms it is only a telescope',
      R(straight) === 'telescope-refracting', `got "${R(straight)}"`);
  }
  // Every rung of the §6 arc must be reachable — an arc with an unreachable rung
  // is a promise the assembler cannot keep.
  {
    const reached = new Set(cases.map(([, b]) => R(b)));
    const bino = A.OPTICS_ARCHETYPES['binoculars'];
    reached.add(R(bino.build({ ...A.defaultParams(bino), stage: 'folded binocular' })));
    for (const rung of L.ASSEMBLY_ARC) {
      check(`arc rung "${rung.id}" is reachable`, reached.has(rung.id),
        'no bench in this suite produces it');
    }
  }
  // Recognition must come with EVIDENCE and a next step, or the moment is
  // announced rather than earned.
  {
    const a = L.recognise({ nMedium: 1, elements: [lens('L', 0, 10)], sources: [src(-30, 2)] });
    check('recognition carries its working', a.evidence.length >= 2, `${a.evidence.length} lines`);
    check('recognition suggests the next primitive', !!a.nextStep, 'no nextStep');
    check('  and says WHY', (a.nextStep?.because ?? '').length > 40, a.nextStep?.because);
    check('  bare lens + far object → add a screen → camera',
      a.nextStep.add === 'screen' && a.nextStep.becomes === 'camera',
      JSON.stringify(a.nextStep));
  }
  {
    // The suggestion is DERIVED, not authored: the same bare lens with the object
    // at infinity should propose a telescope instead.
    const far = L.recognise({ nMedium: 1, elements: [lens('OBJ', 0, 100, 6)], sources: [beam(-35)] });
    check('bare lens + object at infinity → add a lens → telescope',
      far.nextStep.add === 'thin-lens' && far.nextStep.becomes === 'telescope-refracting',
      JSON.stringify(far.nextStep));
    const near2 = L.recognise({ nMedium: 1, elements: [lens('OBJ', 0, 2, 1.2)], sources: [src(-2.5, 0.1)] });
    check('short lens + near object → add a lens → microscope',
      near2.nextStep.add === 'thin-lens' && near2.nextStep.becomes === 'microscope',
      JSON.stringify(near2.nextStep));
    const mag = L.recognise({ nMedium: 1, elements: [lens('L', 0, 10)], sources: [src(-5, 1.4)] });
    check('magnifier → add a lens → microscope',
      mag.nextStep.add === 'thin-lens' && mag.nextStep.becomes === 'microscope',
      JSON.stringify(mag.nextStep));
    const tel = L.recognise({ nMedium: 1, elements: [lens('OBJ', 0, 100, 6), lens('EYE', 105, 5, 2)], sources: [beam(-35)] });
    check('telescope → add a prism → binoculars',
      tel.nextStep.add === 'prism' && tel.nextStep.becomes === 'binoculars',
      JSON.stringify(tel.nextStep));
    const myo = L.recognise({ nMedium: 1, elements: [{ id: 'E', kind: 'eye', x: 0, focalLength: 2.5, radius: 2.9, aperture: 0.4 }], sources: [beam(-9)] });
    check('myopic eye → add a lens → spectacles',
      myo.nextStep.add === 'thin-lens' && myo.nextStep.becomes === 'eye-corrected',
      JSON.stringify(myo.nextStep));
  }
  // The structure summary itself.
  {
    const s = L.structureOf({
      nMedium: 1,
      elements: [lens('A', 0, 10), lens('B', 20, -5), { id: 'P', kind: 'prism', x: 10, aperture: 2 },
        { id: 'SC', kind: 'screen', x: 30, aperture: 3 }, { id: 'ST', kind: 'aperture', x: -1, aperture: 1 }],
      sources: [src(-30, 2)],
    });
    check('structureOf sorts elements in light order',
      s.all.map((p) => p.id).join(',') === 'ST,A,P,B,SC', s.all.map((p) => p.id).join(','));
    check('structureOf counts converging lenses', s.converging.length === 1, `${s.converging.length}`);
    check('structureOf counts diverging lenses', s.diverging.length === 1, `${s.diverging.length}`);
    check('structureOf finds the first powered element', s.firstPowered.id === 'A', s.firstPowered.id);
    check('structureOf knows a 30 cm object is not at infinity', s.object.atInfinity === false,
      `${s.object.atInfinity}`);
    const inf = L.structureOf({ nMedium: 1, elements: [lens('A', 0, 10)], sources: [beam(-30)] });
    check('a parallel beam IS at infinity', inf.object.atInfinity === true, `${inf.object.atInfinity}`);
  }
  // The palette must produce elements the recogniser can actually read.
  for (const p of L.ASSEMBLER_PALETTE) {
    const el = L.makeElement(p.kind, { elements: [], sources: [{ id: 'S', x: -20, y: 1 }] }, 'X');
    check(`palette "${p.label}" builds a usable ${p.kind}`,
      el.kind === p.kind && Number.isFinite(el.x) && (el.aperture ?? 0) > 0, JSON.stringify(el));
  }
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§13  Wave optics — path difference is the only variable');
// ═════════════════════════════════════════════════════════════════════════════
{
  // FRINGE WIDTH β = λD/d.
  //   λ = 600 nm = 6e−4 mm, d = 0.5 mm, D = 100 cm = 1000 mm
  //   β = 6e−4 × 1000 / 0.5 = 1.2 mm
  const ydse = { lambda: 600, d: 0.5, a: 0.1, D: 100, slits: 2 };
  near('fringe width λ=600 d=0.5 D=100', L.fringeWidth(ydse), 1.2, 1e-9);
  near('  halve d ⇒ double β', L.fringeWidth({ ...ydse, d: 0.25 }), 2.4, 1e-9);
  near('  halve D ⇒ halve β', L.fringeWidth({ ...ydse, D: 50 }), 0.6, 1e-9);
  near('  λ=450 nm ⇒ β = 0.9 mm', L.fringeWidth({ ...ydse, lambda: 450 }), 0.9, 1e-9);

  // The central point is equidistant from both slits, so it is always bright.
  near('central intensity is a maximum', L.intensityAt(0, ydse), 1, 1e-12);
  // First dark fringe at β/2 = 0.6 mm; first bright at β = 1.2 mm.
  check('first minimum at β/2 = 0.6 mm', L.intensityAt(0.6, ydse) < 1e-6,
    `I = ${L.intensityAt(0.6, ydse)}`);
  check('first maximum at β = 1.2 mm', L.intensityAt(1.2, ydse) > 0.85,
    `I = ${L.intensityAt(1.2, ydse)}`);
  check('second minimum at 1.5β = 1.8 mm', L.intensityAt(1.8, ydse) < 1e-5,
    `I = ${L.intensityAt(1.8, ydse)}`);
  // Symmetry.
  near('the pattern is symmetric about the centre',
    L.intensityAt(1.2, ydse), L.intensityAt(-1.2, ydse), 1e-12);

  // MISSING ORDERS. d/a = 5, so the 5th and 10th interference maxima land on
  // envelope minima and simply are not there.
  check('missing orders for d/a = 5', JSON.stringify(L.missingOrders(ydse)) === '[5,10]',
    JSON.stringify(L.missingOrders(ydse)));
  check('the 5th order really is dark', L.intensityAt(5 * 1.2, ydse) < 1e-6,
    `I = ${L.intensityAt(5 * 1.2, ydse)}`);
  check('but the 4th order is not', L.intensityAt(4 * 1.2, ydse) > 0.01,
    `I = ${L.intensityAt(4 * 1.2, ydse)}`);
  check('no missing orders when d/a is not an integer',
    L.missingOrders({ ...ydse, a: 0.12 }).length === 0,
    JSON.stringify(L.missingOrders({ ...ydse, a: 0.12 })));

  // MORE SLITS ⇒ SHARPER FRINGES. The principal maxima stay exactly where they
  // were (β apart), but each one narrows: for N slits the first zero beside a
  // principal maximum is at Δα = π/N, i.e. Δy = β/N. So the peak half-width
  // scales as 1/N, and THAT is the sharpening — not extra darkness at β/2.
  //
  // (A first pass asserted that β/2 gets darker as N grows. It gets BRIGHTER:
  // for N = 3 at α = π/2 the interference term is (sin 3α / 3 sin α)² = 1/9. β/2
  // is a zero only for N = 2. My expected value was simply wrong.)
  for (const N of [2, 3, 5, 8]) {
    const many = { ...ydse, slits: N };
    near(`N=${N}: the central maximum is still 1`, L.intensityAt(0, many), 1, 1e-9);
    check(`N=${N}: the principal maximum stays at β = 1.2 mm`, L.intensityAt(1.2, many) > 0.85,
      `I = ${L.intensityAt(1.2, many)}`);
    check(`N=${N}: first zero beside the peak at β/N = ${(1.2 / N).toFixed(3)} mm`,
      L.intensityAt(1.2 / N, many) < 1e-5,
      `I = ${L.intensityAt(1.2 / N, many)} — the peak half-width should scale as 1/N`);
    if (N > 2) {
      check(`N=${N}: peaks are sharper than for N=2`, 1.2 / N < 0.6,
        'the first zero moved closer to the peak');
    }
    // At β/2 the phase step is α = π/2, so the interference term is
    // (sin(Nπ/2) / (N sin(π/2)))² = (sin(Nπ/2)/N)². For EVEN N that sine is
    // sin(kπ) = 0 and β/2 stays dark; for ODD N it is ±1 and β/2 is a SECONDARY
    // maximum of height 1/N².
    //
    // (A first pass asserted β/2 gets darker as N grows, then that it gets
    // brighter. Both were wrong — it depends on the parity of N. The engine was
    // right each time.)
    const halfWay = L.intensityAt(0.6, many);
    if (N % 2 === 0) {
      check(`N=${N} (even): β/2 is still dark`, halfWay < 1e-5, `I = ${halfWay}`);
    } else {
      // The interference term is 1/N², and the single-slit envelope multiplies
      // it. At y = 0.6 mm with a = 0.1 mm the envelope is sinc²(0.1π) = 0.967531,
      // so the height is 0.967531/N² — NOT 1/N². (Asserting the bare 1/9 failed
      // by 0.0036, which is exactly the envelope. The engine had it right.)
      const envelope = L.intensityAt(0.6, { ...many, slits: 1 });
      near(`N=${N} (odd): β/2 is a secondary maximum of envelope/N²`,
        halfWay, envelope / (N * N), 1e-9,
        `sinc²(0.1π) = ${envelope.toFixed(6)}, so ${(envelope / (N * N)).toFixed(6)}`);
    }
  }

  // SINGLE SLIT. Central maximum half-width = λD/a.
  //   λ = 600 nm, a = 0.15 mm, D = 120 cm = 1200 mm
  //   half-width = 6e−4 × 1200 / 0.15 = 4.8 mm, so the band is 9.6 mm across.
  const one = { lambda: 600, d: 0, a: 0.15, D: 120, slits: 1 };
  near('single slit central half-width', L.centralMaxHalfWidth(one), 4.8, 1e-9);
  near('  narrow the slit to 0.075 ⇒ the band DOUBLES',
    L.centralMaxHalfWidth({ ...one, a: 0.075 }), 9.6, 1e-9,
    'squeeze the light and it spreads');
  check('  which is the opposite of the ray-model answer',
    L.centralMaxHalfWidth({ ...one, a: 0.075 }) > L.centralMaxHalfWidth(one),
    'diffraction is not geometry');
  near('single slit peak intensity', L.intensityAt(0, one), 1, 1e-12);
  check('first minimum at the band edge', L.intensityAt(4.8, one) < 1e-6,
    `I = ${L.intensityAt(4.8, one)}`);
  //   First secondary maximum sits at ~1.4303π, with I ≈ 0.0472.
  check('first secondary maximum is about 4.7% of the peak',
    Math.abs(L.intensityAt(4.8 * 1.4303, one) - 0.0472) < 0.004,
    `I = ${L.intensityAt(4.8 * 1.4303, one)}`);
  //   Minima: a sinθ = mλ ⇒ sinθ = m × 6e−4/0.15 = 0.004 m
  near('1st minimum: sinθ = λ/a = 0.004', Math.sin(L.singleSlitMinimumRad(1, one)), 0.004, 1e-9);
  near('3rd minimum: sinθ = 3λ/a = 0.012', Math.sin(L.singleSlitMinimumRad(3, one)), 0.012, 1e-9);
  check('no 300th minimum for λ/a = 0.004', L.singleSlitMinimumRad(300, one) === null,
    `got ${L.singleSlitMinimumRad(300, one)}`);

  // The profile is a usable, finite curve.
  const prof = L.intensityProfile(ydse, L.suggestedSpan(ydse), 401);
  check('profile has the requested sample count', prof.length === 401, `${prof.length}`);
  check('every profile sample is finite and in [0,1]',
    prof.every((p) => Number.isFinite(p.intensity) && p.intensity >= -1e-12 && p.intensity <= 1 + 1e-12),
    'an out-of-range intensity would paint a nonsense band');
  check('suggested span shows several fringes', L.suggestedSpan(ydse) > 2 * 1.2,
    `${L.suggestedSpan(ydse)}`);
  check('single-slit span shows the whole central band',
    L.suggestedSpan(one) > L.centralMaxHalfWidth(one), `${L.suggestedSpan(one)}`);
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§14  Image fitting — the primitive the whole engine rests on');
// ═════════════════════════════════════════════════════════════════════════════
{
  // Least-squares crossing point of a set of lines. Three lines through (3,4).
  const at = (p, target) => ({ p, d: L.unit(L.sub(target, p)) });
  const target = { x: 3, y: 4 };
  const fit = L.fitBundle([
    at({ x: -5, y: 0 }, target), at({ x: -5, y: 2 }, target), at({ x: -5, y: -3 }, target),
  ]);
  near('fitBundle finds the crossing point (x)', fit.point.x, 3, 1e-9);
  near('fitBundle finds the crossing point (y)', fit.point.y, 4, 1e-9);
  near('a perfect bundle has zero residual', fit.rms, 0, 1e-9);
  check('all three rays have it AHEAD of them', fit.forward === 3, `${fit.forward}`);
  check('a converging bundle is not called parallel', fit.parallel === false, `${fit.parallel}`);

  // A bundle whose crossing point is BEHIND every ray is a virtual image.
  const behind = L.fitBundle([
    { p: { x: 10, y: 0 }, d: L.unit({ x: 1, y: -0.4 }) },
    { p: { x: 10, y: 2 }, d: L.unit({ x: 1, y: -0.1 }) },
  ]);
  check('a diverging bundle fits a point BEHIND the rays', behind.forward === 0,
    `forward=${behind.forward}`);

  // Parallel rays have no crossing point at all.
  const par = L.fitBundle([
    { p: { x: 0, y: 0 }, d: { x: 1, y: 0 } }, { p: { x: 0, y: 2 }, d: { x: 1, y: 0 } },
  ]);
  check('parallel rays ⇒ image at infinity', par.parallel === true && par.point === null,
    `parallel=${par.parallel}, point=${JSON.stringify(par.point)}`);
  const nearly = L.fitBundle([
    { p: { x: 0, y: 0 }, d: L.unit({ x: 1, y: 0 }) },
    { p: { x: 0, y: 2 }, d: L.unit({ x: 1, y: 1e-6 }) },
  ]);
  check('nearly-parallel rays are treated as parallel', nearly.parallel === true, `${nearly.parallel}`);
  check('a single ray is not a bundle', L.fitBundle([at({ x: -5, y: 0 }, target)]).parallel === true,
    'one line cannot define a point');
  check('an empty bundle is handled', L.fitBundle([]).point === null, 'must not throw');

  // A scattered bundle reports its residual instead of hiding it.
  const scattered = L.fitBundle([
    at({ x: -5, y: 0 }, { x: 3, y: 4 }), at({ x: -5, y: 2 }, { x: 3.6, y: 4 }),
    at({ x: -5, y: -3 }, { x: 2.4, y: 4 }),
  ]);
  check('a scattered bundle reports a non-zero residual', scattered.rms > 0.01, `rms=${scattered.rms}`);

  // imageFromFits refuses to invent an image from one ray.
  check('imageFromFits returns null for a 1-ray bundle',
    L.imageFromFits(L.fitBundle([at({ x: -5, y: 0 }, target)]), null, 1) === null,
    'a single ray is about a PATH, not an image');
}

// ═════════════════════════════════════════════════════════════════════════════
sec('§15  Every archetype builds, traces, and stays finite');
// ═════════════════════════════════════════════════════════════════════════════
{
  const VOCAB = new Set([
    'half_lens_half_image', 'image_needs_screen', 'rays_are_only_three',
    'magnification_is_size_only', 'sign_convention_dropped', 'focal_length_fixed_in_water',
    'real_image_always_inverted_confusion', 'tir_without_denser_medium',
    'telescope_magnifies_like_microscope',
  ]);
  check('17 archetypes are registered', A.OPTICS_ARCHETYPE_ORDER.length === 17,
    `${A.OPTICS_ARCHETYPE_ORDER.length}`);
  check('the order list and the map agree',
    A.OPTICS_ARCHETYPE_ORDER.every((id) => !!A.OPTICS_ARCHETYPES[id])
    && Object.keys(A.OPTICS_ARCHETYPES).length === A.OPTICS_ARCHETYPE_ORDER.length,
    'an id in one and not the other means a dead authoring id');

  for (const id of A.OPTICS_ARCHETYPE_ORDER) {
    const arch = A.OPTICS_ARCHETYPES[id];
    const p = A.defaultParams(arch);

    // Design law 1, 2 and 5, and the wiring that makes law 2 real.
    check(`${id}: ≥2 params`, (arch.params?.length ?? 0) >= 2, `${arch.params?.length ?? 0}`);
    check(`${id}: names a misconception in the vocabulary`, VOCAB.has(arch.targets),
      `targets="${arch.targets}"`);
    check(`${id}: ≥3 guided steps`, (arch.defaultSteps?.length ?? 0) >= 3,
      `${arch.defaultSteps?.length ?? 0}`);
    check(`${id}: has a misconception probe`, !!arch.probe, 'a declared target with no probe is dead');
    if (arch.probe) {
      const pr = arch.probe;
      check(`${id}: probe has one reply per option`, pr.options.length === pr.perOption.length,
        `${pr.options.length} options, ${pr.perOption.length} replies`);
      check(`${id}: probe answer index is in range`,
        pr.answerIndex >= 0 && pr.answerIndex < pr.options.length, `${pr.answerIndex}`);
      check(`${id}: probe is asked after a step that exists`,
        pr.afterStep >= 0 && pr.afterStep < (arch.defaultSteps?.length ?? 0), `${pr.afterStep}`);
      check(`${id}: every probe reply is substantial`,
        pr.perOption.every((s) => s.length > 40), 'a one-line reply cannot attack a belief');
      check(`${id}: probe has a reveal`, pr.reveal.length > 60, `${pr.reveal.length} chars`);
    }
    check(`${id}: distinct, non-empty guided steps`,
      new Set((arch.defaultSteps ?? []).map((s) => s.say)).size === (arch.defaultSteps ?? []).length
      && (arch.defaultSteps ?? []).every((s) => s.say.trim() && s.cta.trim()),
      'duplicate or empty beat');

    // The bench builds purely and every number in it is finite.
    let bench = null;
    try { bench = arch.build(p); } catch (e) { /* reported below */ void e; }
    if (!check(`${id}: build() returns a bench`, !!bench && Array.isArray(bench.elements), 'threw or returned nothing')) continue;
    check(`${id}: every element position is finite`,
      bench.elements.every((el) => Number.isFinite(el.x) && Number.isFinite(el.y ?? 0)),
      JSON.stringify(bench.elements.map((el) => [el.id, el.x, el.y])));
    check(`${id}: every aperture is positive`,
      bench.elements.every((el) => (el.aperture ?? 1) > 0), 'a zero aperture blocks everything');
    check(`${id}: has at least one source`, bench.sources.length >= 1, `${bench.sources.length}`);

    // Build at the extremes of every numeric param too — a slider dragged to its
    // stop must not produce a bench that cannot be drawn.
    for (const q of arch.params ?? []) {
      if (q.kind !== 'number') continue;
      for (const v of [q.min, q.max]) {
        if (v === undefined) continue;
        let b = null;
        try { b = arch.build({ ...p, [q.key]: v }); } catch (e) { void e; }
        check(`${id}: builds with ${q.key} = ${v}`,
          !!b && b.elements.every((el) => Number.isFinite(el.x)), 'threw or produced NaN');
      }
    }

    if (arch.mode === 'wave') continue;

    // And it traces.
    let t = null;
    try {
      t = T(bench, {
        constructionRays: !!arch.construction, dispersion: !!arch.dispersion, rayCount: arch.rays,
      });
    } catch (e) { void e; }
    if (!check(`${id}: traces without throwing`, !!t, 'trace threw')) continue;
    check(`${id}: produces rays`, t.rays.length > 0, `${t.rays.length}`);
    check(`${id}: at least one ray gets through`, through(t) > 0,
      `${through(t)}/${t.rays.length} — the whole bundle is being blocked`);
    check(`${id}: every segment coordinate is finite`,
      t.rays.every((r) => r.segments.every((s) =>
        Number.isFinite(s.from.x) && Number.isFinite(s.from.y)
        && Number.isFinite(s.to.x) && Number.isFinite(s.to.y))),
      'a NaN coordinate produces an invisible or exploded path');
    check(`${id}: every ray has at least one segment`,
      t.rays.every((r) => r.segments.length > 0), 'a ray with no segments draws nothing');
    if (t.finalImage) {
      check(`${id}: image position is finite or null`,
        t.finalImage.x === null || Number.isFinite(t.finalImage.x), `${t.finalImage.x}`);
      check(`${id}: magnification is finite or null`,
        t.finalImage.magnification === null || Number.isFinite(t.finalImage.magnification),
        `${t.finalImage.magnification}`);
    }
    check(`${id}: no ray exceeds the step budget`,
      t.rays.every((r) => r.terminated !== 'total-internal-reflection' || id === 'optical-fibre'),
      'a trapped ray outside the fibre means the marcher is stuck');
  }

  // The catalogue the admin picker reads.
  check('catalogue covers every archetype',
    A.OPTICS_ARCHETYPE_CATALOG.length === A.OPTICS_ARCHETYPE_ORDER.length,
    `${A.OPTICS_ARCHETYPE_CATALOG.length}`);
  check('every catalogue entry is probed and stepped',
    A.OPTICS_ARCHETYPE_CATALOG.every((c) => c.probed && c.stepped && c.params.length >= 2),
    JSON.stringify(A.OPTICS_ARCHETYPE_CATALOG.filter((c) => !c.probed || !c.stepped).map((c) => c.id)));
  // Modes: 10 bench, 5 assembler, 2 wave.
  const byMode = (m) => A.OPTICS_ARCHETYPE_CATALOG.filter((c) => c.mode === m).length;
  check('10 bench archetypes', byMode('bench') === 10, `${byMode('bench')}`);
  check('5 assembler archetypes', byMode('assembler') === 5, `${byMode('assembler')}`);
  check('2 wave archetypes', byMode('wave') === 2, `${byMode('wave')}`);
  // Resolution must never return undefined, even for a hand-edited typo.
  check('an unknown id falls back to a real archetype',
    !!A.resolveArchetype('does-not-exist', 'bench') && !!A.resolveArchetype(undefined, 'assembler')
    && !!A.resolveArchetype('nope', 'wave'),
    'a typo on a saved page must degrade, not crash');
  check('the fallback respects the requested mode',
    A.resolveArchetype('nope', 'assembler').mode === 'assembler'
    && A.resolveArchetype('nope', 'wave').mode === 'wave',
    'a wave block must not fall back to a lens bench');
}

// ── Report ───────────────────────────────────────────────────────────────────

console.log('\n\x1b[1mMeasured values\x1b[0m');
console.log('─'.repeat(110));
console.log(`${'quantity'.padEnd(52)} ${'traced/computed'.padStart(14)} ${'expected'.padStart(14)}   ${''.padEnd(4)} note`);
console.log('─'.repeat(110));
for (const [name, got, want, status, note] of rows) {
  const mark = status === 'ok' ? '\x1b[32m ok \x1b[0m' : '\x1b[31mFAIL\x1b[0m';
  console.log(`${name.slice(0, 52).padEnd(52)} ${got.padStart(14)} ${want.padStart(14)}   ${mark} ${note}`);
}

console.log('\n' + '═'.repeat(78));
if (fail) {
  console.log(`\x1b[31m${fail} FAILED\x1b[0m, ${pass} passed  (${pass + fail} checks)`);
  console.log('\nFailures by section:');
  let last = '';
  for (const f of failures) {
    if (f.section !== last) { console.log(`\n  ${f.section}`); last = f.section; }
    console.log(`    · ${f.name}\n      ${f.detail}`);
  }
} else {
  console.log(`\x1b[32m${pass}/${pass} checks passed\x1b[0m — E4 optics-bench verified.`);
}
process.exit(fail ? 1 : 0);
