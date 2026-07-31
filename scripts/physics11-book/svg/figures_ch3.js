'use strict';
/**
 * Hand-authored SVG figures for Class 11 Physics Ch.3 "Motion in Two Dimensions".
 *
 * FOUNDER DECISION (2026-07-29, restated 2026-07-30): technical figures are
 * DRAWN, not AI-generated — and **drawn taking the design reference from the
 * source books themselves**. AI generation is reserved for atmospheric art
 * (the page-opening hero banners), which lives in the `image` blocks'
 * `generation_prompt` instead. A hand-drawn figure carries NO generation_prompt.
 *
 * SOURCE REFERENCE for each figure — the actual book figure it is modelled on,
 * read as a RENDERED PAGE IMAGE (not from the text layer) before drawing:
 *   ch3-two-coins ............. the classic independence-of-motions demo
 *   ch3-tangent-and-acceleration ... NCERT Fig 3.14 (v resolved at a point on a
 *                                   curve) + Fig 3.15 (Δv as Δt shrinks)
 *   ch3-projectile-components ...... NCERT Fig 3.17 — the key visual is that the
 *                                   HORIZONTAL arrows are all the same length
 *                                   while the vertical ones shrink to zero and
 *                                   grow back downward
 *   ch3-trajectory-parabola ........ NCERT Fig 3.16 + 3.17, with R, H and the
 *                                   launch tangent marked
 *   ch3-height-optimum-angle ....... no book figure — original. See the note on
 *                                   that figure for why it ended up as curves
 *                                   PLUS a table rather than curves alone.
 *   ch3-angular-language ........... "Mechanics Vol. 1" Fig 10.1 (angular
 *                                   position θ from a reference direction)
 *   ch3-centripetal-derivation ..... NCERT Fig 3.18(a1) + (a2) — the circle
 *                                   panel and the separate velocity triangle
 *   ch3-ncert-exercise-figures ..... NCERT Fig 3.19 (three skaters P→Q, one
 *                                   straight and two serpentine) and Fig 3.20
 *                                   (cyclist O→P, quarter arc P→Q, Q→O).
 *                                   Reading the rendered NCERT page is what
 *                                   CONFIRMED arc PQ is a QUARTER circle — the
 *                                   assumption Exercise 3.9's answer rests on.
 *
 * DESIGN RULES, all load-bearing (identical to Ch.2 — see figures_ch2.js):
 *  • TRANSPARENT background. The reader offers three dark themes via CSS
 *    variables; a baked-in dark fill reads as a patch on two of the three.
 *  • White text at the four mandated tiers only (BOOK_PAGE_WORKFLOW §17.3.1):
 *    /85 emphasis · /82 body · /60 secondary · /45 meta. No /90, no /25–/40.
 *  • Two accents: orange #f97316 primary, amber #fbbf24 secondary. Emerald
 *    #34d399 only where a third series is genuinely distinct.
 *  • No boxes. Structure from whitespace and hairline rules.
 *  • Text NEVER overlaps a stroke or another label.
 *  • viewBox 720 units wide so font-size 13–16 lands at a real 13–16 px.
 *  • SUBSCRIPTS use <tspan>, never an underscore. "v_x" in a text node renders
 *    as a literal underscore — SVG has no LaTeX. Caught on the first render.
 *
 * SIZING: `width="100%"` with NO height attribute, plus preserveAspectRatio.
 * Ch.2 used `height="auto"`, which browsers tolerate but which is not valid SVG
 * and which makes every offline rasteriser emit a zero-height image. Omitting
 * height lets the viewBox supply the aspect ratio in both places.
 *
 * PRIMITIVES ARE DUPLICATED from figures_ch2.js on purpose. Ch.2's figures are
 * built, browser-verified and published; re-pointing that file at a shared
 * module would mean re-rendering and re-uploading 13 live figures for no gain.
 * **Ch.4 is the third use and the right moment to extract a shared module.**
 */

const C = {
  emph: 'rgba(255,255,255,0.85)',
  body: 'rgba(255,255,255,0.82)',
  sec: 'rgba(255,255,255,0.60)',
  meta: 'rgba(255,255,255,0.45)',
  hair: 'rgba(255,255,255,0.14)',
  orange: '#f97316',
  amber: '#fbbf24',
  emerald: '#34d399',
};
const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// ── primitives ───────────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const r = (n) => Math.round(n * 100) / 100;

const arrowMarker = (id, fill) =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`
  + `<path d="M 0 0 L 10 5 L 0 10 z" fill="${fill}"/></marker>`;

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(title)}" font-family="${FONT}">`
  + `<title>${esc(title)}</title>`
  + `<defs>`
  + arrowMarker('ar-o', C.orange) + arrowMarker('ar-a', C.amber)
  + arrowMarker('ar-w', C.sec) + arrowMarker('ar-e', C.emerald)
  + `</defs>${body}</svg>`;

const line = (x1, y1, x2, y2, stroke = C.sec, w = 1.4, extra = '') =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;

const arrow = (x1, y1, x2, y2, stroke = C.sec, w = 1.4, mk = 'ar-w') =>
  line(x1, y1, x2, y2, stroke, w, `marker-end="url(#${mk})"`);

const path = (d, stroke = C.orange, w = 2, extra = '') =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

const dash = (x1, y1, x2, y2, stroke = C.hair, w = 1.2) =>
  line(x1, y1, x2, y2, stroke, w, 'stroke-dasharray="4 4"');

const dot = (x, y, fill = C.orange, rad = 4.5) => `<circle cx="${r(x)}" cy="${r(y)}" r="${rad}" fill="${fill}"/>`;
const circle = (x, y, rad, stroke = C.hair, w = 1.4) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rad)}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;

const txt = (x, y, s, { size = 14, fill = C.body, anchor = 'start', weight = 400 } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${s}</text>`;

const caps = (x, y, s, { fill = C.meta, anchor = 'start' } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="11" fill="${fill}" text-anchor="${anchor}" letter-spacing="1.1">${esc(String(s).toUpperCase())}</text>`;

/** A subscripted symbol, e.g. sub('v','x') → v with a proper subscript x.
 *  SVG has no LaTeX: writing "v_x" in a text node renders the underscore. */
const sub = (base, s) => `${esc(base)}<tspan font-size="11" dy="4">${esc(s)}</tspan><tspan dy="-4"> </tspan>`;

/** A small arc marking an angle between two rays from (cx,cy). Angles in degrees,
 *  anticlockwise from the +x axis, in SCREEN coords (y grows downward). */
const angleArc = (cx, cy, rad, a0, a1, stroke = C.meta, w = 1.2) => {
  const p0 = [cx + rad * Math.cos(-a0 * Math.PI / 180), cy + rad * Math.sin(-a0 * Math.PI / 180)];
  const p1 = [cx + rad * Math.cos(-a1 * Math.PI / 180), cy + rad * Math.sin(-a1 * Math.PI / 180)];
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const sweep = a1 > a0 ? 0 : 1;
  return path(`M ${r(p0[0])} ${r(p0[1])} A ${rad} ${rad} 0 ${large} ${sweep} ${r(p1[0])} ${r(p1[1])}`, stroke, w);
};

/** A square right-angle mark at (x,y), legs along unit vectors u and v. */
const rightAngle = (x, y, u, v, size = 11, stroke = C.meta) => {
  const a = [x + u[0] * size, y + u[1] * size];
  const b = [x + u[0] * size + v[0] * size, y + u[1] * size + v[1] * size];
  const c = [x + v[0] * size, y + v[1] * size];
  return path(`M ${r(a[0])} ${r(a[1])} L ${r(b[0])} ${r(b[1])} L ${r(c[0])} ${r(c[1])}`, stroke, 1.1);
};

/** Sample an analytic curve into a polyline path string. */
const curve = (fn, t0, t1, n = 64) => {
  let d = '';
  for (let i = 0; i <= n; i++) {
    const [x, y] = fn(t0 + (t1 - t0) * (i / n));
    d += (i === 0 ? 'M ' : ' L ') + r(x) + ' ' + r(y);
  }
  return d;
};

/** Real projectile ranges for ch3-height-optimum-angle — COMPUTED, not sketched,
 *  because the figure exists to prove that 45° loses. u = 20 m/s, g = 10 m/s².
 *  From a 20 m tower a 0.1° scan puts the optimum at 35.3° / 56.6 m; on level
 *  ground it is 45° / 40.0 m. That REVERSAL is the whole content of the figure. */
const TRAJ = (() => {
  const g = 10, u = 20, h = 20;
  const fromHeight = (deg) => {
    const th = deg * Math.PI / 180;
    const ux = u * Math.cos(th), uy = u * Math.sin(th);
    const tf = (uy + Math.sqrt(uy * uy + 2 * g * h)) / g;
    return { deg, ux, uy, tf, range: ux * tf, apex: (uy * uy) / (2 * g) };
  };
  const onLevel = (deg) => (u * u * Math.sin(2 * deg * Math.PI / 180)) / g;
  return { g, u, h, shots: [fromHeight(25), fromHeight(35), fromHeight(45)], onLevel };
})();

// ═════════════════════════════════════════════════════════════════════════════
// FIGURES
// ═════════════════════════════════════════════════════════════════════════════
const F = {};

// ── p1 · the two coins ───────────────────────────────────────────────────────
F['ch3-two-coins'] = () => {
  const W = 720, H = 430;
  const edgeX = 152, topY = 112, floorY = 340, fall = floorY - topY, reach = 400;
  let s = '';
  s += caps(56, 50, 'the desk experiment', { fill: C.sec });
  s += txt(56, 78, esc('One coin flicked sideways, one simply dropped, released at the same instant.'), { size: 14, fill: C.body });

  // desk top + edge. "desk" sits BELOW the line, left of the drop, clear of the prose.
  s += line(44, topY, edgeX, topY, C.sec, 2);
  s += line(edgeX, topY, edgeX, topY + 22, C.hair, 1.6);
  s += txt(50, topY + 22, 'desk', { size: 12, fill: C.meta });
  s += line(44, floorY, 690, floorY, C.sec, 1.6);
  s += txt(50, floorY + 22, 'floor', { size: 12, fill: C.meta });

  const yAt = (t) => topY + fall * t * t;      // free fall — identical for both coins
  const xFlick = (t) => edgeX + reach * t;     // uniform sideways
  s += line(edgeX, topY, edgeX, floorY, C.emerald, 2.4);
  s += path(curve((t) => [xFlick(t), yAt(t)], 0, 1), C.orange, 2.6);

  // THE COIN ITSELF, sitting on the desk at the release point (t = 0) — a rim
  // ring plus a filled disc, larger than the path-instant dots below, so it
  // reads as an object rather than a graph vertex. Both curves start exactly
  // here: one coin is flicked off sideways, the other simply let go, at the
  // same instant. (Founder note, 2026-07-30: the earlier version had no visible
  // coin at all — the lines appeared to begin from nowhere.)
  s += circle(edgeX, topY, 9, C.hair, 1.4);
  s += dot(edgeX, topY, C.emph, 6.5);

  // four instants, joined by a dashed equal-height line each
  for (const t of [0.36, 0.6, 0.82, 1]) {
    const y = yAt(t), xf = xFlick(t);
    s += dash(edgeX, y, xf, y, C.hair, 1.2);
    s += dot(edgeX, y, C.emerald, 5);
    s += dot(xf, y, C.orange, 5);
  }
  // series labels, both placed in verified-empty regions
  s += txt(edgeX - 14, topY + 132, 'dropped', { size: 13, fill: C.emerald, anchor: 'end', weight: 600 });
  s += txt(300, 318, 'flicked sideways', { size: 13, fill: C.orange, weight: 600 });
  // the payoff, right-aligned above the floor so it cannot run off the edge
  s += txt(690, floorY - 30, 'they land together', { size: 14, fill: C.emph, anchor: 'end', weight: 600 });
  s += txt(690, floorY - 12, 'one click, not two', { size: 12, fill: C.meta, anchor: 'end' });
  s += txt(56, H - 36, esc('Each dashed line joins the two coins at one instant — always at the same height.'), { size: 13, fill: C.sec });
  s += txt(56, H - 14, 'The sideways motion did not delay the fall by one instant.', { size: 13, fill: C.meta });
  return svg(W, H, s, 'Two coins leaving a desk edge together, one flicked sideways along a parabola and one dropping straight down, with dashed lines showing they are at equal heights at four instants and land together.');
};

// ── p2 · velocity is tangent, acceleration is free ───────────────────────────
F['ch3-tangent-and-acceleration'] = () => {
  const W = 720, H = 440;
  const x0 = 90, x1 = 640, yMid = 292, amp = 108;
  const X = (u) => x0 + (x1 - x0) * u;
  const Y = (u) => yMid - amp * Math.sin(Math.PI * u);
  // exact analytic slope, so the tangents are right rather than eyeballed
  const slope = (u) => (-amp * Math.PI * Math.cos(Math.PI * u)) / (x1 - x0);
  let s = '';
  s += caps(56, 50, 'velocity is locked to the path — acceleration is not', { fill: C.sec });
  s += txt(56, 78, 'The angle between them decides what happens next.', { size: 14, fill: C.body });
  s += path(curve((u) => [X(u), Y(u)], 0, 1), C.sec, 2.2);

  // aDeg is the acceleration's screen angle; each was checked to give the stated
  // sign of v·a (acute +0.79, zero, obtuse −0.79 for these three).
  //
  // LABEL ORDER, deliberate: the plain-English word is what the reader should
  // take away first, so it is the bright, bold, upper line. The dot-product
  // test is the smaller, dimmer line underneath — a reference for someone who
  // has already met "v · a" (this image now sits AFTER the step-solver that
  // teaches it, not before), never the headline. An earlier version put the
  // notation on top, which read as an unexplained "v times a" out of context.
  const marks = [
    { u: 0.18, aDeg: -18, headline: 'speeding up', test: 'v · a > 0' },
    { u: 0.5, aDeg: -90, headline: 'turning, speed steady', test: 'v · a = 0' },
    { u: 0.82, aDeg: -162, headline: 'slowing down', test: 'v · a < 0' },
  ];
  for (const m of marks) {
    const px = X(m.u), py = Y(m.u), sl = slope(m.u), len = Math.hypot(1, sl);
    s += arrow(px, py, px + (1 / len) * 78, py + (sl / len) * 78, C.amber, 2.4, 'ar-a');
    const ar = m.aDeg * Math.PI / 180;
    s += arrow(px, py, px + Math.cos(ar) * 64, py - Math.sin(ar) * 64, C.emerald, 2.2, 'ar-e');
    s += dot(px, py, C.emph, 4.5);
  }
  // labels centred under their own mark, in a band well below every stroke.
  // esc() is REQUIRED here — these contain < and > which would break the SVG.
  for (const m of marks) {
    const cxm = X(m.u);
    s += txt(cxm, 380, esc(m.headline), { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });
    s += txt(cxm, 400, esc(m.test), { size: 12, fill: C.meta, anchor: 'middle' });
  }
  s += line(468, 62, 498, 62, C.amber, 2.4, 'marker-end="url(#ar-a)"');
  s += txt(506, 66, esc('velocity — always tangent'), { size: 12, fill: C.amber });
  s += line(468, 84, 498, 84, C.emerald, 2.2, 'marker-end="url(#ar-e)"');
  s += txt(506, 88, esc('acceleration — any direction'), { size: 12, fill: C.emerald });
  s += txt(56, H - 14, esc('"v · a" is the dot product — its sign alone tells you which of the three this is.'), { size: 13, fill: C.sec });
  return svg(W, H, s, 'A curved path with velocity drawn tangent at three points and acceleration drawn at an acute, a perpendicular and an obtuse angle to it, labelled speeding up, turning and slowing down.');
};

// ── p4 · the components of a projectile's velocity ───────────────────────────
F['ch3-projectile-components'] = () => {
  const W = 720, H = 468;
  const ox = 92, oy = 322, R = 512, Hgt = 176;
  const X = (q) => ox + R * q;
  const Y = (q) => oy - Hgt * 4 * q * (1 - q);
  let s = '';
  s += caps(56, 50, 'one component never changes, the other reverses', { fill: C.sec });
  s += arrow(ox, oy, ox + R + 30, oy, C.sec, 1.3);
  s += arrow(ox, oy, ox, oy - Hgt - 52, C.sec, 1.3);
  s += txt(ox + R + 34, oy + 5, 'x', { size: 12, fill: C.meta });
  s += txt(ox - 6, oy - Hgt - 58, 'y', { size: 12, fill: C.meta, anchor: 'end' });
  s += path(curve((q) => [X(q), Y(q)], 0, 1), C.sec, 2.2);

  const HL = 46;      // horizontal component — IDENTICAL every time, the whole point
  const VMAX = 66;
  const qs = [0.1, 0.3, 0.5, 0.7, 0.9];
  for (const q of qs) {
    const px = X(q), py = Y(q), vy = 1 - 2 * q;
    s += arrow(px, py, px + HL, py, C.amber, 2.4, 'ar-a');
    if (Math.abs(vy) > 0.01) s += arrow(px, py, px, py - VMAX * vy, C.orange, 2.4, 'ar-o');
    s += dot(px, py, C.emph, 4);
  }
  s += txt(X(0.5), Y(0.5) - 26, sub('v', 'y') + '= 0 here', { size: 13, fill: C.emph, anchor: 'middle', weight: 600 });
  const sy = 396;
  s += line(ox, sy, ox + R, sy, C.hair, 1.4);
  for (const q of qs) s += line(X(q), sy - 6, X(q), sy + 6, C.amber, 1.8);
  s += txt(ox, sy + 26, esc('equal times → equal horizontal steps'), { size: 12, fill: C.meta });
  s += line(430, 68, 460, 68, C.amber, 2.4, 'marker-end="url(#ar-a)"');
  s += txt(468, 72, sub('v', 'x') + esc('— same length every time'), { size: 12, fill: C.amber });
  s += line(430, 90, 460, 90, C.orange, 2.4, 'marker-end="url(#ar-o)"');
  s += txt(468, 94, sub('v', 'y') + esc('— shrinks, then grows down'), { size: 12, fill: C.orange });
  s += txt(56, H - 14, 'The path curves because one component changes and the other does not.', { size: 13, fill: C.sec });
  return svg(W, H, s, 'A projectile parabola with velocity resolved at five instants: the horizontal arrows are all the same length while the vertical arrows shrink to zero at the top and grow downward after it.');
};

// ── p6 · the trajectory, with R and H marked ─────────────────────────────────
F['ch3-trajectory-parabola'] = () => {
  const W = 720, H = 436;
  const ox = 108, oy = 320, R = 452, Hgt = 168;
  const X = (q) => ox + R * q;
  const Y = (q) => oy - Hgt * 4 * q * (1 - q);
  let s = '';
  s += caps(56, 50, 'the shape, once time is eliminated', { fill: C.sec });
  s += arrow(ox, oy, ox + R + 92, oy, C.sec, 1.3);
  s += arrow(ox, oy, ox, oy - Hgt - 56, C.sec, 1.3);
  s += txt(ox + R + 96, oy + 5, 'x', { size: 12, fill: C.meta });
  s += txt(ox - 6, oy - Hgt - 62, 'y', { size: 12, fill: C.meta, anchor: 'end' });
  s += path(curve((q) => [X(q), Y(q)], 0, 1), C.orange, 2.8);

  const m0 = (Y(0.02) - Y(0)) / (X(0.02) - X(0));
  s += line(ox, oy, ox + 116, oy + m0 * 116, C.amber, 1.8, 'stroke-dasharray="6 4"');
  s += angleArc(ox, oy, 46, 0, Math.atan2(-m0 * 116, 116) * 180 / Math.PI, C.meta, 1.2);
  s += txt(ox + 56, oy - 14, esc('θ'), { size: 14, fill: C.amber, weight: 600 });
  s += txt(ox - 8, oy + 20, 'O', { size: 14, fill: C.emph, anchor: 'end', weight: 600 });

  const ax = X(0.5), ay = Y(0.5);
  s += dash(ax, ay, ax, oy, C.hair);
  s += dash(ax, ay, ox, ay, C.hair);
  s += dot(ax, ay, C.emph, 4.5);
  s += txt(ox + 10, ay - 8, 'H', { size: 14, fill: C.emph, weight: 600 });
  s += txt(ax, oy + 22, 'x = R/2', { size: 12, fill: C.meta, anchor: 'middle' });
  s += dot(X(1), oy, C.emph, 5);
  s += txt(X(1), oy + 22, 'x = R', { size: 13, fill: C.emph, anchor: 'middle', weight: 600 });

  s += txt(ox + R + 40, oy - 74, 'y = 0 at', { size: 12, fill: C.meta });
  s += txt(ox + R + 40, oy - 54, 'x = 0 and x = R', { size: 13, fill: C.body, weight: 600 });
  s += txt(56, H - 38, esc('y = x tan θ (1 − x/R) — quadratic in x, so the path is a parabola.'), { size: 14, fill: C.body });
  s += txt(56, H - 14, 'The vertex sits exactly halfway between the two roots.', { size: 13, fill: C.sec });
  return svg(W, H, s, 'A projectile parabola from the origin to x equals R, with the maximum height H marked at x equals R over two and the launch tangent drawn at angle theta.');
};

// ── p7 · from a height, 45° stops winning ────────────────────────────────────
/* DESIGN NOTE, worth keeping. The first version of this figure marked all three
 * landing points on the ground and labelled each with its range. It was
 * unreadable: the three ranges are 54.7 / 56.6 / 54.6 m, so at any honest scale
 * the three landing points sit within ~16 px of one another and the leader lines
 * pile up. A range-vs-angle plot has the same problem — the curve is flat near
 * its maximum, which is exactly WHY 45° is only slightly worse.
 * So the numbers moved into a small table, where a 2 m difference is perfectly
 * legible, and the table carries the level-ground column beside it. The point of
 * the figure is that the WINNER SWITCHES between those two columns, and a table
 * shows that unambiguously without inflating a 3% difference into a visual lie. */
F['ch3-height-optimum-angle'] = () => {
  const W = 720, H = 452;
  const S = 6.0;                       // px per metre, identical on both axes
  const ox = 76, topY = 196;           // tower top
  const groundY = topY + TRAJ.h * S;
  let s = '';
  s += caps(56, 46, 'launched from a height, 45° is no longer the best angle', { fill: C.sec });
  s += txt(56, 74, esc(`u = ${TRAJ.u} m/s, g = ${TRAJ.g} m/s², from a ${TRAJ.h} m tower.`), { size: 13, fill: C.body });

  s += line(ox, topY, ox, groundY, C.hair, 2.4);
  s += line(ox - 26, topY, ox, topY, C.sec, 2);
  s += line(46, groundY, 430, groundY, C.sec, 1.6);
  s += txt(ox - 8, topY - 10, esc(`${TRAJ.h} m`), { size: 12, fill: C.meta, anchor: 'end' });

  const cols = [C.emerald, C.orange, C.amber];
  TRAJ.shots.forEach((sh, i) => {
    const P = (t) => [ox + sh.ux * t * S, topY - (sh.uy * t - 0.5 * TRAJ.g * t * t) * S];
    const best = sh.deg === 35;
    s += path(curve(P, 0, sh.tf), cols[i], best ? 3 : 1.9, best ? '' : 'stroke-dasharray="7 5"');
    s += dot(P(sh.tf)[0], groundY, cols[i], best ? 6 : 4.5);
  });
  // ONE label only. Labelling all three on the curves piled them on top of each
  // other — near the launch the three trajectories are only a few px apart. The
  // table below carries the angles, colour-matched to the curves.
  s += txt(300, 145, esc('35° goes furthest'), { size: 13, fill: C.orange, weight: 600 });

  // the numbers, as a table — see the design note above
  const tx = 452, c1 = 580, c2 = 690;
  s += caps(tx, 150, 'angle', { fill: C.meta });
  s += caps(c1, 150, 'tower', { fill: C.meta, anchor: 'end' });
  s += caps(c2, 150, 'level', { fill: C.meta, anchor: 'end' });
  s += line(tx, 160, c2, 160, C.hair, 1);
  TRAJ.shots.forEach((sh, i) => {
    const y = 186 + i * 26;
    const lvl = TRAJ.onLevel(sh.deg);
    const towerWins = sh.deg === 35, levelWins = sh.deg === 45;
    s += txt(tx, y, esc(`${sh.deg}°`), { size: 13, fill: cols[i], weight: 600 });
    s += txt(c1, y, esc(`${sh.range.toFixed(1)} m`), { size: 13, anchor: 'end', fill: towerWins ? C.orange : C.sec, weight: towerWins ? 700 : 400 });
    s += txt(c2, y, esc(`${lvl.toFixed(1)} m`), { size: 13, anchor: 'end', fill: levelWins ? C.amber : C.sec, weight: levelWins ? 700 : 400 });
  });
  s += txt(tx, 288, esc('The winner switches columns.'), { size: 13, fill: C.emph, weight: 600 });
  s += txt(tx, 310, esc('On level ground 45° wins.'), { size: 12, fill: C.meta });
  s += txt(tx, 328, esc('From a height, 35° does.'), { size: 12, fill: C.meta });

  s += txt(56, H - 36, esc('Falling below the launch level buys extra flight time whatever the angle —'), { size: 13, fill: C.sec });
  s += txt(56, H - 14, esc('and a flatter throw has more horizontal speed to spend on it.'), { size: 13, fill: C.meta });
  return svg(W, H, s, 'Three trajectories launched at the same speed from a twenty metre tower at 25, 35 and 45 degrees, beside a table of their ranges showing 35 degrees furthest from the tower while 45 degrees would win on level ground.');
};

// ── p10 · the angular language ───────────────────────────────────────────────
F['ch3-angular-language'] = () => {
  const W = 720, H = 432;
  const cx = 236, cy = 254, R = 122, TH = 56;
  const rad = (d) => d * Math.PI / 180;
  const px = cx + R * Math.cos(rad(TH)), py = cy - R * Math.sin(rad(TH));
  let s = '';
  s += caps(56, 48, 'describing a circle in angle, not in metres', { fill: C.sec });
  s += circle(cx, cy, R, C.hair, 1.5);
  // reference direction — label BELOW the dashed line so it cannot reach the panel
  s += line(cx, cy, cx + R + 34, cy, C.hair, 1.3, 'stroke-dasharray="5 4"');
  s += txt(cx + R - 6, cy + 22, 'reference', { size: 12, fill: C.meta });
  // the arc s, highlighted, with its label set radially outward at the arc midpoint
  s += path(`M ${r(cx + R)} ${r(cy)} A ${R} ${R} 0 0 0 ${r(px)} ${r(py)}`, C.orange, 3.2);
  s += txt(cx + 150 * Math.cos(rad(28)), cy - 150 * Math.sin(rad(28)), 'arc s', { size: 13, fill: C.orange, weight: 600 });
  // radius, with the label offset perpendicular so it clears both the line and θ
  s += line(cx, cy, px, py, C.sec, 1.6);
  s += txt(cx + 63 * Math.cos(rad(TH)) - 14, cy - 63 * Math.sin(rad(TH)) - 10, 'r', { size: 13, fill: C.sec });
  s += angleArc(cx, cy, 44, 0, TH, C.meta, 1.2);
  s += txt(cx + 54, cy - 18, esc('θ'), { size: 15, fill: C.emph, weight: 600 });
  s += dot(cx, cy, C.emph, 4) + txt(cx - 10, cy + 18, 'O', { size: 13, fill: C.emph, anchor: 'end', weight: 600 });
  s += dot(px, py, C.emph, 5) + txt(px + 14, py + 4, 'P', { size: 13, fill: C.emph, weight: 600 });
  // tangential velocity at P, anticlockwise, with a right-angle mark on the radius
  const tx0 = -Math.sin(rad(TH)), ty0 = -Math.cos(rad(TH));
  s += arrow(px, py, px + tx0 * 84, py + ty0 * 84, C.amber, 2.6, 'ar-a');
  s += txt(px + tx0 * 84 - 4, py + ty0 * 84 - 12, 'v', { size: 15, fill: C.amber, anchor: 'middle', weight: 600 });
  s += rightAngle(px, py, [tx0, ty0], [Math.cos(rad(TH)), -Math.sin(rad(TH))], 10, C.meta);

  const bx = 452;
  s += caps(bx, 140, 'the three relations', { fill: C.sec });
  s += txt(bx, 174, esc('ω = dθ/dt = 2π/T = 2πf'), { size: 15, fill: C.body });
  s += txt(bx, 206, esc('s = r θ'), { size: 15, fill: C.body });
  s += txt(bx, 234, esc('v = r ω'), { size: 15, fill: C.body });
  s += txt(bx, 270, esc('The last two hold in radians only —'), { size: 12, fill: C.meta });
  s += txt(bx, 288, 'that is what radians are for.', { size: 12, fill: C.meta });
  s += txt(bx, 322, esc('ω is shared by every point of a'), { size: 12, fill: C.sec });
  s += txt(bx, 340, 'rotating body. v grows with r.', { size: 12, fill: C.sec });
  s += txt(56, H - 14, 'One number describes the whole record; the linear speed does not.', { size: 13, fill: C.sec });
  return svg(W, H, s, 'A circle with centre O, a radius to a point P at angle theta from a reference direction, the arc s highlighted, and the tangential velocity v drawn perpendicular to the radius at P.');
};

// ── p11 · the centripetal derivation ─────────────────────────────────────────
F['ch3-centripetal-derivation'] = () => {
  const W = 720, H = 448;
  const rad = (d) => d * Math.PI / 180;
  const Cx = 156, Cy = 258, R = 122, HALF = 46;
  const px = Cx + R * Math.cos(rad(-HALF)), py = Cy - R * Math.sin(rad(-HALF));
  const qx = Cx + R * Math.cos(rad(HALF)), qy = Cy - R * Math.sin(rad(HALF));
  let s = '';
  s += caps(56, 48, 'why the acceleration points at the centre', { fill: C.sec });
  s += caps(96, 96, '(a) on the circle', { fill: C.meta });
  s += caps(452, 96, '(b) the velocity triangle', { fill: C.meta });

  // the arc IS the subject, so it gets a visible tier rather than the hairline
  s += path(`M ${r(px)} ${r(py)} A ${R} ${R} 0 0 1 ${r(qx)} ${r(qy)}`, C.sec, 2);
  s += line(Cx, Cy, px, py, C.sec, 1.5) + line(Cx, Cy, qx, qy, C.sec, 1.5);
  s += angleArc(Cx, Cy, 36, -HALF, HALF, C.meta, 1.2);
  s += txt(Cx + 44, Cy + 5, esc('Δθ'), { size: 13, fill: C.meta });
  s += dot(Cx, Cy, C.emph, 4) + txt(Cx - 12, Cy + 5, 'C', { size: 13, fill: C.emph, anchor: 'end', weight: 600 });
  // r / r′ labels offset perpendicular to their own radius, clear of the angle arc
  s += txt(Cx + R * 0.55 - 4, Cy + R * 0.55 + 16, 'r', { size: 13, fill: C.sec });
  s += txt(Cx + R * 0.55 - 4, Cy - R * 0.55 - 8, esc('r′'), { size: 13, fill: C.sec });
  s += arrow(px, py, qx, qy, C.emerald, 2, 'ar-e');
  s += txt(px + 12, (py + qy) / 2 + 4, esc('Δr'), { size: 13, fill: C.emerald, weight: 600 });

  const tanAt = (d) => [-Math.sin(rad(d)), -Math.cos(rad(d))];
  const [ax1, ay1] = tanAt(-HALF), [ax2, ay2] = tanAt(HALF);
  s += arrow(px, py, px + ax1 * 74, py + ay1 * 74, C.amber, 2.4, 'ar-a');
  s += arrow(qx, qy, qx + ax2 * 74, qy + ay2 * 74, C.amber, 2.4, 'ar-a');
  s += dot(px, py, C.emph, 4.5) + dot(qx, qy, C.emph, 4.5);
  s += txt(px + 14, py + 18, 'P', { size: 13, fill: C.emph, weight: 600 });
  s += txt(qx + 14, qy - 10, esc('P′'), { size: 13, fill: C.emph, weight: 600 });
  s += txt(px + ax1 * 74 + 8, py + ay1 * 74 + 14, 'v', { size: 14, fill: C.amber, weight: 600 });
  s += txt(qx + ax2 * 74 - 14, qy + ay2 * 74 - 8, esc('v′'), { size: 14, fill: C.amber, weight: 600 });

  // panel (b), raised so it sits opposite panel (a) rather than under its heading
  const Gx = 512, Gy = 288, L = 108;
  const Hx = Gx + ax1 * L, Hy = Gy + ay1 * L;
  const Ix = Gx + ax2 * L, Iy = Gy + ay2 * L;
  s += arrow(Gx, Gy, Hx, Hy, C.amber, 2.4, 'ar-a');
  s += arrow(Gx, Gy, Ix, Iy, C.amber, 2.4, 'ar-a');
  s += arrow(Hx, Hy, Ix, Iy, C.orange, 3, 'ar-o');
  s += angleArc(Gx, Gy, 34, 90 - HALF, 90 + HALF, C.meta, 1.2);
  s += txt(Gx + 6, Gy - 44, esc('Δθ'), { size: 13, fill: C.meta });
  s += dot(Gx, Gy, C.emph, 4);
  s += txt(Hx + 10, Hy + 6, 'v', { size: 14, fill: C.amber, weight: 600 });
  s += txt(Ix - 12, Iy + 6, esc('v′'), { size: 14, fill: C.amber, anchor: 'end', weight: 600 });
  s += txt((Hx + Ix) / 2, Math.min(Hy, Iy) - 16, esc('Δv'), { size: 15, fill: C.orange, anchor: 'middle', weight: 700 });
  s += txt((Hx + Ix) / 2, Math.min(Hy, Iy) - 34, 'points inward', { size: 12, fill: C.meta, anchor: 'middle' });

  s += line(56, 384, 664, 384, C.hair, 1);
  s += txt(56, 410, esc('|Δv| / v = |Δr| / R'), { size: 15, fill: C.body, weight: 600 });
  s += txt(250, 410, esc('→   a = v² / R, towards the centre'), { size: 15, fill: C.emph, weight: 600 });
  s += txt(56, H - 8, esc('The two triangles are similar — both isosceles with the same apex angle Δθ.'), { size: 12, fill: C.meta });
  return svg(W, H, s, 'Two panels: a circular arc with centre C showing position vectors and tangential velocities at P and P prime, and beside it the velocity triangle in which delta-v points towards the centre.');
};

// ── p16 · the two NCERT exercise figures ─────────────────────────────────────
F['ch3-ncert-exercise-figures'] = () => {
  const W = 720, H = 486;
  let s = '';
  s += caps(56, 44, 'the two figures the exercises refer to', { fill: C.sec });

  // Fig 3.19 — three skaters. NCERT draws one straight path and two SERPENTINE
  // ones, so these are genuinely wavy rather than simple bulges.
  const ax = 178, ay = 246, aR = 112;
  s += caps(88, 78, 'fig. 3.19 — exercise 3.8', { fill: C.meta });
  s += circle(ax, ay, aR, C.hair, 1.5);
  const Px = ax, Py = ay + aR, Qx = ax, Qy = ay - aR;
  s += arrow(Px, Py, Qx, Qy + 4, C.orange, 2.6, 'ar-o');
  s += path(`M ${Px} ${Py} C ${ax - 66} ${ay + 74} ${ax - 30} ${ay + 26} ${ax - 58} ${ay - 8}`
    + ` S ${ax - 74} ${ay - 52} ${ax - 26} ${ay - 66} S ${ax - 4} ${ay - 92} ${Qx} ${Qy}`, C.amber, 2.2);
  s += path(`M ${Px} ${Py} C ${ax + 70} ${ay + 76} ${ax + 34} ${ay + 30} ${ax + 62} ${ay - 6}`
    + ` S ${ax + 80} ${ay - 50} ${ax + 30} ${ay - 64} S ${ax + 6} ${ay - 92} ${Qx} ${Qy}`, C.emerald, 2.2);
  s += dot(Px, Py, C.emph, 5) + dot(Qx, Qy, C.emph, 5);
  s += txt(Px, Py + 24, 'P', { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });
  s += txt(Qx, Qy - 14, 'Q', { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });
  // path labels, each outside the circle on its own side
  s += txt(ax - aR - 14, ay + 4, 'A', { size: 14, fill: C.amber, anchor: 'end', weight: 700 });
  s += txt(ax + 12, ay + 52, 'B', { size: 14, fill: C.orange, weight: 700 });
  s += txt(ax + aR + 14, ay + 4, 'C', { size: 14, fill: C.emerald, weight: 700 });

  // Fig 3.20 — the cyclist: O → P, quarter arc P → Q, then Q → O
  const bx = 512, by = 244, bR = 104;
  s += caps(430, 78, 'fig. 3.20 — exercise 3.9', { fill: C.meta });
  s += circle(bx, by, bR, C.hair, 1.5);
  const px2 = bx + bR, py2 = by, qx2 = bx, qy2 = by - bR;
  s += arrow(bx, by, px2 - 6, py2, C.orange, 2.4, 'ar-o');
  s += path(`M ${r(px2)} ${r(py2)} A ${bR} ${bR} 0 0 0 ${r(qx2 + 3)} ${r(qy2 + 1)}`, C.amber, 2.8, 'marker-end="url(#ar-a)"');
  s += arrow(qx2, qy2, bx, by - 6, C.emerald, 2.4, 'ar-e');
  s += dot(bx, by, C.emph, 4.5) + dot(px2, py2, C.emph, 4.5) + dot(qx2, qy2, C.emph, 4.5);
  s += txt(bx - 10, by + 20, 'O', { size: 14, fill: C.emph, anchor: 'end', weight: 600 });
  s += txt(px2 + 12, py2 + 5, 'P', { size: 14, fill: C.emph, weight: 600 });
  s += txt(qx2 - 6, qy2 - 14, 'Q', { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });

  // notes as full-width rows, so neither can be clipped by the right edge
  s += line(56, 404, 664, 404, C.hair, 1);
  s += txt(56, 430, esc('Fig 3.19 — the displacement is the diameter, 400 m, for all three skaters.'), { size: 13, fill: C.body });
  s += txt(56, 450, esc('Only B travels in a straight line, so only B’s path length equals it.'), { size: 12, fill: C.meta });
  s += txt(56, 474, esc('Fig 3.20 — arc P→Q is a quarter circle; start and finish are both O, so the displacement is zero.'), { size: 12, fill: C.sec });
  return svg(W, H, s, 'Two NCERT exercise figures: a circular rink with one straight and two serpentine paths from P to the diametrically opposite Q, and a circular park showing a cyclist going out along a radius, round a quarter arc, and back along another radius.');
};

module.exports = { FIGURES: F, PALETTE: C, TRAJ };
