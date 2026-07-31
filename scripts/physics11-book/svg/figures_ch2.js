'use strict';
/**
 * Hand-authored SVG figures for Class 11 Physics Ch.2 "Motion in One Dimension".
 *
 * FOUNDER DECISION (2026-07-29): technical figures are DRAWN, not AI-generated.
 * Image generators get angles, proportions and axis labels wrong, and in a
 * kinematics chapter the correctness of the figure *is* the teaching. AI
 * generation is reserved for atmospheric art (hero banners, real-world cards) —
 * so the p0 hero is deliberately NOT in this file.
 *
 * DESIGN RULES, all load-bearing:
 *  • TRANSPARENT background. The reader offers three dark themes (Midnight
 *    #0B0C0F, Charcoal #121316, Slate #1A1C22) via CSS variables. A figure with
 *    a baked-in dark fill reads as a patch on two of the three, so nothing here
 *    paints a backdrop.
 *  • White text at the four mandated tiers only (BOOK_PAGE_WORKFLOW §17.3.1):
 *    /85 emphasis · /82 body · /60 secondary · /45 meta. No /90, no /25–/40.
 *  • Two accents: orange #f97316 primary, amber #fbbf24 secondary. Emerald
 *    #34d399 appears only where a third data series is genuinely distinct.
 *  • No boxes. Structure from whitespace and hairline rules.
 *  • Text NEVER overlaps a stroke or another label. Labels are offset clear of
 *    every line, and multi-panel figures reserve a fixed caption band.
 *  • viewBox is 720 units wide so a font-size of 13–16 lands at a real 13–16px
 *    at typical reading width — small enough to be unobtrusive, large enough to
 *    stay sharp. SVG text is real text, so it is resolution-independent.
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
const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="100%" height="auto" role="img" aria-label="${esc(title)}" font-family="${FONT}">`
  + `<title>${esc(title)}</title>`
  + `<defs>`
  + arrowMarker('ar-o', C.orange) + arrowMarker('ar-a', C.amber)
  + arrowMarker('ar-w', C.sec) + arrowMarker('ar-e', C.emerald)
  + `</defs>${body}</svg>`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const arrowMarker = (id, fill) =>
  `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">`
  + `<path d="M 0 0 L 10 5 L 0 10 z" fill="${fill}"/></marker>`;

const line = (x1, y1, x2, y2, stroke = C.sec, w = 1.4, extra = '') =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${stroke}" stroke-width="${w}" ${extra}/>`;

const arrow = (x1, y1, x2, y2, stroke = C.sec, w = 1.4, mk = 'ar-w') =>
  line(x1, y1, x2, y2, stroke, w, `marker-end="url(#${mk})"`);

const path = (d, stroke = C.orange, w = 2, extra = '') =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

const dash = (x1, y1, x2, y2, stroke = C.hair, w = 1.2) =>
  line(x1, y1, x2, y2, stroke, w, 'stroke-dasharray="4 4"');

const dot = (x, y, fill = C.orange, rad = 4.5) => `<circle cx="${r(x)}" cy="${r(y)}" r="${rad}" fill="${fill}"/>`;
const ring = (x, y, stroke = C.amber, rad = 5) => `<circle cx="${r(x)}" cy="${r(y)}" r="${rad}" fill="none" stroke="${stroke}" stroke-width="1.8"/>`;

/** anchor: 'start' | 'middle' | 'end'; baseline via dy so labels sit clear of strokes. */
const txt = (x, y, s, { size = 14, fill = C.body, anchor = 'start', weight = 400, style = '' } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}"${style ? ` font-style="${style}"` : ''}>${esc(s)}</text>`;

const caps = (x, y, s, { fill = C.meta, anchor = 'start' } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="11" fill="${fill}" text-anchor="${anchor}" letter-spacing="1.1">${esc(String(s).toUpperCase())}</text>`;

const r = (n) => Math.round(n * 100) / 100;

/** A pair of axes with arrowheads and offset labels. Returns the drawing plus a
 *  point-mapper so every curve in the panel shares one coordinate system. */
function axes(ox, oy, w, h, xLabel, yLabel, { xr = 1, yr = 1, pad = 8 } = {}) {
  const g = arrow(ox, oy, ox + w + pad, oy, C.sec, 1.3)
    + arrow(ox, oy, ox, oy - h - pad, C.sec, 1.3)
    + txt(ox + w + pad + 4, oy + 4, xLabel, { size: 12, fill: C.meta })
    + txt(ox - 6, oy - h - pad - 4, yLabel, { size: 12, fill: C.meta, anchor: 'end' });
  const P = (x, y) => [ox + (x / xr) * w, oy - (y / yr) * h];
  return { g, P };
}

// ═════════════════════════════════════════════════════════════════════════════
// FIGURES
// ═════════════════════════════════════════════════════════════════════════════
const F = {};

// ── p1 · frame line ──────────────────────────────────────────────────────────
F['ch2-frame-line'] = () => {
  const W = 720, H = 405, y = 232, x0 = 70, x1 = 650, mid = (x0 + x1) / 2;
  const step = (x1 - x0) / 10;
  let s = '';
  s += line(x0, y, x1, y, C.sec, 1.6);
  for (let i = 0; i <= 10; i++) {
    const x = x0 + i * step, v = i - 5;
    s += line(x, y - 6, x, y + 6, C.hair, 1.2);
    if (v !== 0) s += txt(x, y + 26, String(v > 0 ? '+' + v : v), { size: 12, fill: C.meta, anchor: 'middle' });
  }
  // origin, kept clear of the tick labels
  s += `<circle cx="${mid}" cy="${y}" r="6" fill="none" stroke="${C.emph}" stroke-width="1.8"/>`;
  s += txt(mid, y + 46, 'O', { size: 15, fill: C.emph, anchor: 'middle', weight: 600 });
  s += txt(mid, y + 66, 'origin — you choose it', { size: 12, fill: C.meta, anchor: 'middle' });
  // positive direction arrow, well above the line
  s += arrow(mid + 30, y - 62, x1, y - 62, C.orange, 2, 'ar-o');
  s += txt(x1, y - 74, 'positive direction', { size: 13, fill: C.orange, anchor: 'end', weight: 600 });
  s += txt(mid + 30, y - 74, 'you choose this too', { size: 12, fill: C.meta });
  // two objects, labels above the line, values below-left of their dot
  const px = x0 + 9 * step, nx = x0 + 2 * step;
  s += dot(px, y, C.amber, 7) + txt(px, y - 18, 'x = +4 m', { size: 14, fill: C.amber, anchor: 'middle', weight: 600 });
  s += dot(nx, y, C.emerald, 7) + txt(nx, y - 18, 'x = −3 m', { size: 14, fill: C.emerald, anchor: 'middle', weight: 600 });
  s += caps(x0, 60, 'a frame in one dimension', { fill: C.sec });
  s += txt(x0, 88, 'An origin, and an arrow saying which way counts as positive.', { size: 14, fill: C.body });
  s += txt(x0, 110, 'Once both are declared, the sign of a number is its direction.', { size: 14, fill: C.sec });
  return svg(W, H, s, 'A number line with an origin, a positive-direction arrow, and two objects at +4 m and −3 m.');
};

// ── p1 · semicircular walk ───────────────────────────────────────────────────
F['ch2-semicircle-walk'] = () => {
  const W = 720, H = 405;
  // cy/R lowered and shrunk from (300, 155): the arc top sat at y=145 and the
  // "distance along the track" label above it landed on the intro prose at
  // y=112. Browser overlap audit caught it.
  const cx = 330, cy = 322, R = 136;
  let s = '';
  // arc from left end to right end, bulging upward
  s += path(`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`, C.orange, 3);
  // the straight diameter, dashed, with an arrowhead — the displacement
  s += line(cx - R, cy, cx + R, cy, C.amber, 2.2, 'stroke-dasharray="7 5" marker-end="url(#ar-a)"');
  // endpoints
  s += dot(cx - R, cy, C.emph, 5.5) + dot(cx + R, cy, C.emph, 5.5);
  s += txt(cx - R, cy + 26, 'start', { size: 13, fill: C.sec, anchor: 'middle' });
  s += txt(cx + R, cy + 26, 'finish', { size: 13, fill: C.sec, anchor: 'middle' });
  // radius marker to the centre, label offset so it misses the dashed line
  s += dash(cx, cy, cx, cy - R);
  s += txt(cx + 8, cy - R / 2, 'R = 40.0 m', { size: 13, fill: C.meta });
  // the two answers, in the clear space either side of the arc
  s += txt(cx, cy - R - 22, 'distance along the track = πR = 126 m', { size: 15, fill: C.orange, anchor: 'middle', weight: 600 });
  s += txt(cx, cy + 62, 'displacement = 2R = 80.0 m', { size: 15, fill: C.amber, anchor: 'middle', weight: 600 });
  s += caps(60, 62, 'same journey, two honest answers', { fill: C.sec });
  s += txt(60, 90, 'Ask how tired he is, and the answer is 126 m.', { size: 14, fill: C.body });
  s += txt(60, 112, 'Ask how far he got, and the answer is 80 m.', { size: 14, fill: C.body });
  return svg(W, H, s, 'A semicircular walking track of radius 40 m, with the curved path marked 126 m and the straight diameter marked 80 m.');
};

// ── p3 · chord to tangent ────────────────────────────────────────────────────
F['ch2-chord-to-tangent'] = () => {
  const W = 720, H = 405;
  const { g, P } = axes(90, 330, 520, 250, 't', 'x', { xr: 6, yr: 12 });
  let s = g;
  // x = 0.08 t^3 mapped into the panel
  const f = (t) => 0.08 * t * t * t;
  let d = '';
  for (let t = 0; t <= 6.02; t += 0.1) { const [X, Y] = P(t, f(t)); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
  s += path(d, C.orange, 2.6);
  const t0 = 4, [X0, Y0] = P(t0, f(t0));
  // three shrinking chords, faint
  for (const t2 of [6, 5.2, 4.6]) {
    const [X2, Y2] = P(t2, f(t2));
    s += line(X0, Y0, X2, Y2, C.hair, 1.6);
    s += dot(X2, Y2, C.hair, 3.2);
  }
  // the tangent: slope 0.24 t^2 = 3.84 at t = 4
  const m = 0.24 * t0 * t0;
  const tA = 2.2, tB = 5.9;
  const [XA, YA] = P(tA, f(t0) + m * (tA - t0));
  const [XB, YB] = P(tB, f(t0) + m * (tB - t0));
  s += line(XA, YA, XB, YB, C.amber, 2.6);
  s += dot(X0, Y0, C.emph, 5.5);
  // labels placed in clear space, none touching a stroke
  s += txt(XB + 6, YB + 4, 'tangent', { size: 13, fill: C.amber, weight: 600 });
  s += txt(X0 + 14, Y0 + 26, 't = 4.0 s', { size: 13, fill: C.emph });
  s += txt(P(6, f(6))[0] - 8, P(6, f(6))[1] - 12, 'x = 0.08 t³', { size: 13, fill: C.orange, anchor: 'end' });
  s += txt(150, 130, 'chords (faint)', { size: 12, fill: C.meta });
  s += caps(90, 62, 'shrink the interval and the chord becomes the tangent', { fill: C.sec });
  s += txt(90, 90, 'slope of the tangent at t = 4.0 s  =  3.84 m/s', { size: 15, fill: C.amber, weight: 600 });
  return svg(W, H, s, 'A curved position-time graph with three shrinking chords from one point converging onto the tangent at that point.');
};

// ── p4 · two children ────────────────────────────────────────────────────────
F['ch2-two-children'] = () => {
  const W = 720, H = 405;
  const { g, P } = axes(95, 330, 500, 240, 't', 'x', { xr: 10, yr: 10 });
  let s = g;
  // A: from origin, gentle, ends at P = 6 at t = 10
  const [ax1, ay1] = P(0, 0), [ax2, ay2] = P(10, 6);
  s += line(ax1, ay1, ax2, ay2, C.orange, 2.6);
  // B: starts at t = 3, steeper, ends at Q = 9 at t = 10
  const [bx1, by1] = P(3, 0), [bx2, by2] = P(10, 9);
  s += line(bx1, by1, bx2, by2, C.amber, 2.6);
  // crossing: A: x = 0.6t ; B: x = (9/7)(t-3) → 0.6t = 1.2857t-3.857 → t ≈ 5.63, x ≈ 3.38
  const tc = 3.857 / 0.6857, xc = 0.6 * tc;
  const [cxp, cyp] = P(tc, xc);
  s += ring(cxp, cyp, C.emph, 7);
  // home levels, dashed to the axis, labels on the axis side
  s += dash(P(0, 6)[0], P(0, 6)[1], ax2, ay2);
  s += dash(P(0, 9)[0], P(0, 9)[1], bx2, by2);
  s += txt(88, P(0, 6)[1] + 5, 'P', { size: 15, fill: C.orange, anchor: 'end', weight: 600 });
  s += txt(88, P(0, 9)[1] + 5, 'Q', { size: 15, fill: C.amber, anchor: 'end', weight: 600 });
  // series labels at the line ends, offset outward
  s += txt(ax2 + 8, ay2 + 5, 'A', { size: 16, fill: C.orange, weight: 700 });
  s += txt(bx2 + 8, by2 + 5, 'B', { size: 16, fill: C.amber, weight: 700 });
  // start-time markers below the axis
  s += txt(bx1, 352, 'B starts', { size: 12, fill: C.meta, anchor: 'middle' });
  s += txt(ax1, 352, 'A starts', { size: 12, fill: C.meta, anchor: 'middle' });
  // crossing label, placed away from both lines
  // Below the crossing: to the right of it both lines run ABOVE this y, so the
  // label is clear. Above the crossing it sat directly on both. Stroke audit.
  s += txt(cxp + 14, cyp + 28, 'B overtakes A', { size: 13, fill: C.emph });
  s += caps(95, 62, 'two children walking home from school', { fill: C.sec });
  s += txt(95, 90, 'A lives closer · A starts earlier · B walks faster · they arrive together', { size: 14, fill: C.body });
  return svg(W, H, s, 'Two straight position-time lines: A gentle from the origin to a lower level P, and B steeper starting later and ending at a higher level Q, crossing once.');
};

// ── p4 · road vs graph ───────────────────────────────────────────────────────
F['ch2-road-vs-graph'] = () => {
  const W = 720, H = 405;
  let s = line(360, 100, 360, 360, C.hair, 1);
  // LEFT: the actual road — perfectly straight and horizontal
  s += caps(40, 96, 'the road', { fill: C.sec });
  const ry = 250;
  s += line(45, ry, 330, ry, C.sec, 2);
  for (const [x, o] of [[80, 0.22], [150, 0.4], [225, 0.6]]) s += dot(x, ry, `rgba(249,115,22,${o})`, 5);
  s += dot(288, ry, C.orange, 7);
  s += arrow(95, ry - 26, 250, ry - 26, C.orange, 1.6, 'ar-o');
  s += txt(172, ry - 36, 'out', { size: 12, fill: C.orange, anchor: 'middle' });
  s += arrow(250, ry + 30, 95, ry + 30, C.amber, 1.6, 'ar-a');
  s += txt(172, ry + 46, 'and back', { size: 12, fill: C.amber, anchor: 'middle' });
  s += txt(187, 330, 'flat, straight, never rises', { size: 13, fill: C.meta, anchor: 'middle' });
  // RIGHT: the x–t graph of that same journey — rises, flattens, falls
  s += caps(400, 96, 'its x–t graph', { fill: C.sec });
  const { g, P } = axes(410, 330, 250, 180, 't', 'x', { xr: 10, yr: 10 });
  s += g;
  const pts = [[0, 0], [4, 7], [6, 7], [10, 0]];
  let d = '';
  for (const [t, x] of pts) { const [X, Y] = P(t, x); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
  s += path(d, C.orange, 2.6);
  s += txt(P(5, 7)[0], P(5, 7)[1] - 12, 'paused', { size: 12, fill: C.meta, anchor: 'middle' });
  s += txt(535, 348, 'rises, flattens, falls', { size: 13, fill: C.meta, anchor: 'middle' });
  s += caps(40, 62, 'the same journey, drawn twice', { fill: C.sec });
  s += txt(360, 386, 'The graph goes up and down. The road never does.', { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });
  return svg(W, H, s, 'Left: a straight horizontal road with a marker moving out and back. Right: the corresponding position-time graph, which rises, flattens and falls.');
};

// ── p4 · impossible graphs ───────────────────────────────────────────────────
F['ch2-impossible-graphs'] = () => {
  const W = 720, H = 405;
  let s = line(360, 100, 360, 340, C.hair, 1);
  // LEFT: vertical jump
  const a = axes(70, 300, 230, 165, 't', 'x', { xr: 10, yr: 10 });
  s += a.g;
  let d1 = '';
  for (const [t, x] of [[0, 1], [4, 4]]) { const [X, Y] = a.P(t, x); d1 += (d1 ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
  s += path(d1, C.orange, 2.6);
  const [jx, jy1] = a.P(4, 4), [, jy2] = a.P(4, 8);
  s += line(jx, jy1, jx, jy2, C.orange, 2.6);
  let d2 = '';
  for (const [t, x] of [[4, 8], [9, 9.5]]) { const [X, Y] = a.P(t, x); d2 += (d2 ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
  s += path(d2, C.orange, 2.6);
  s += ring(jx, (jy1 + jy2) / 2, C.amber, 12);
  s += txt(jx + 20, (jy1 + jy2) / 2 + 5, 'vertical', { size: 13, fill: C.amber, weight: 600 });
  s += txt(70, 330, 'Position changes while no time passes.', { size: 13, fill: C.body });
  s += txt(70, 352, 'That needs infinite velocity.', { size: 13, fill: C.sec });
  // RIGHT: double-valued
  const b = axes(415, 300, 230, 165, 't', 'x', { xr: 10, yr: 10 });
  s += b.g;
  const [c1x, c1y] = b.P(3, 2), [c2x, c2y] = b.P(8, 5), [c3x, c3y] = b.P(3, 8);
  s += path(`M ${r(c1x)} ${r(c1y)} C ${r(c2x)} ${r(c2y)}, ${r(c2x + 40)} ${r(c3y + 10)}, ${r(c3x)} ${r(c3y)}`, C.orange, 2.6);
  const vx = b.P(5.5, 0)[0];
  s += line(vx, b.P(0, 0)[1], vx, b.P(0, 10)[1], C.hair, 1.2, 'stroke-dasharray="4 4"');
  s += ring(vx, b.P(0, 3.35)[1], C.amber, 6) + ring(vx, b.P(0, 7.3)[1], C.amber, 6);
  // Left of the dashed line: the bezier bulges RIGHT, so its rightmost extent is
  // where these labels used to sit. Stroke audit caught it.
  s += txt(vx - 16, b.P(0, 5.9)[1], 'two places,', { size: 12, fill: C.amber, anchor: 'end' });
  s += txt(vx - 16, b.P(0, 5.9)[1] + 15, 'one instant', { size: 12, fill: C.amber, anchor: 'end' });
  s += txt(415, 330, 'A vertical line cuts the curve twice.', { size: 13, fill: C.body });
  s += txt(415, 352, 'The particle would be in two places at once.', { size: 13, fill: C.sec });
  s += caps(70, 62, 'neither of these can describe a real object', { fill: C.sec });
  return svg(W, H, s, 'Two impossible position-time graphs: one containing a vertical segment, and one that loops back so a vertical line cuts it twice.');
};

// ── p5 · x–t curvature ───────────────────────────────────────────────────────
F['ch2-xt-curvature'] = () => {
  const W = 720, H = 405;
  const panels = [
    { x: 55, lab: 'positive a', sub: 'bends upward', d: (P) => curve(P, (t) => 0.09 * t * t + 0.5), col: C.orange },
    { x: 275, lab: 'negative a', sub: 'bends downward', d: (P) => curve(P, (t) => 9.5 - 0.09 * (10 - t) * (10 - t)), col: C.amber },
    { x: 495, lab: 'zero a', sub: 'stays straight', d: (P) => curve(P, (t) => 0.85 * t + 0.5), col: C.emerald },
  ];
  function curve(P, f) {
    let d = '';
    for (let t = 0; t <= 10.02; t += 0.25) { const [X, Y] = P(t, f(t)); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
    return d;
  }
  let s = caps(55, 62, 'what the bend of an x–t graph tells you', { fill: C.sec });
  for (let i = 0; i < 3; i++) {
    const p = panels[i];
    const A = axes(p.x + 22, 300, 155, 155, 't', 'x', { xr: 10, yr: 10 });
    s += A.g + path(p.d(A.P), p.col, 2.6);
    s += txt(p.x + 100, 336, p.lab, { size: 14, fill: p.col, anchor: 'middle', weight: 600 });
    s += txt(p.x + 100, 356, p.sub, { size: 12, fill: C.meta, anchor: 'middle' });
    if (i < 2) s += line(p.x + 205, 110, p.x + 205, 320, C.hair, 1);
  }
  s += txt(360, 388, 'Curvature carries the sign of the acceleration; slope carries the velocity.', { size: 13, fill: C.sec, anchor: 'middle' });
  return svg(W, H, s, 'Three position-time graphs side by side: one curving upward, one curving downward, and one straight.');
};

// ── p6 · sign quadrant ───────────────────────────────────────────────────────
F['ch2-sign-quadrant'] = () => {
  const W = 720, H = 540;
  const gx = 250, gy = 150, cw = 215, ch = 155;
  let s = caps(60, 62, 'four combinations of sign, two possible outcomes', { fill: C.sec });
  s += txt(60, 92, 'Same signs, speeding up. Opposite signs, slowing down.', { size: 15, fill: C.emph, weight: 600 });
  // hairline grid only — no boxes
  s += line(gx, gy, gx + 2 * cw, gy, C.hair, 1);
  s += line(gx, gy + ch, gx + 2 * cw, gy + ch, C.hair, 1);
  s += line(gx, gy + 2 * ch, gx + 2 * cw, gy + 2 * ch, C.hair, 1);
  s += line(gx, gy, gx, gy + 2 * ch, C.hair, 1);
  s += line(gx + cw, gy, gx + cw, gy + 2 * ch, C.hair, 1);
  s += line(gx + 2 * cw, gy, gx + 2 * cw, gy + 2 * ch, C.hair, 1);
  // column and row headers, clear of the grid
  s += txt(gx + cw / 2, gy - 16, 'a positive', { size: 14, fill: C.sec, anchor: 'middle', weight: 600 });
  s += txt(gx + cw * 1.5, gy - 16, 'a negative', { size: 14, fill: C.sec, anchor: 'middle', weight: 600 });
  s += txt(gx - 18, gy + ch / 2, 'v positive', { size: 14, fill: C.sec, anchor: 'end', weight: 600 });
  s += txt(gx - 18, gy + ch * 1.5, 'v negative', { size: 14, fill: C.sec, anchor: 'end', weight: 600 });
  // cells: v arrow above, a arrow below, verdict at the bottom — nothing overlaps
  const cells = [
    { c: 0, r: 0, v: +1, a: +1, verdict: 'speeding up' },
    { c: 1, r: 0, v: +1, a: -1, verdict: 'slowing down' },
    { c: 0, r: 1, v: -1, a: +1, verdict: 'slowing down' },
    { c: 1, r: 1, v: -1, a: -1, verdict: 'speeding up' },
  ];
  for (const k of cells) {
    const cx = gx + k.c * cw + cw / 2, cy = gy + k.r * ch;
    const half = 52;
    // velocity arrow
    s += arrow(cx - k.v * half, cy + 46, cx + k.v * half, cy + 46, C.orange, 2.4, 'ar-o');
    s += txt(cx - half - 10, cy + 51, 'v', { size: 13, fill: C.orange, anchor: 'end', weight: 700 });
    // acceleration arrow, well below the velocity arrow
    s += arrow(cx - k.a * half, cy + 88, cx + k.a * half, cy + 88, C.amber, 2.4, 'ar-a');
    s += txt(cx - half - 10, cy + 93, 'a', { size: 13, fill: C.amber, anchor: 'end', weight: 700 });
    const match = k.v === k.a;
    s += txt(cx, cy + 128, k.verdict, { size: 14, fill: match ? C.emph : C.body, anchor: 'middle', weight: match ? 700 : 500 });
  }
  s += txt(60, gy + 2 * ch + 52, 'Notice: both "speeding up" cells contain one positive a and one negative a.', { size: 14, fill: C.body });
  s += txt(60, gy + 2 * ch + 76, 'So the sign of a, on its own, tells you nothing at all.', { size: 14, fill: C.sec });
  return svg(W, H, s, 'A two-by-two grid of velocity and acceleration signs, each cell showing arrows for v and a and whether the particle speeds up or slows down.');
};

// ── p7 · slope / area map ────────────────────────────────────────────────────
F['ch2-slope-area-map'] = () => {
  const W = 720, H = 540;
  const cx = 360, top = 130, gap = 128;
  const mini = (yc, kind, col) => {
    const A = axes(cx - 62, yc + 46, 124, 76, '', '', { xr: 10, yr: 10 });
    let d = '';
    if (kind === 'x') for (let t = 0; t <= 10.02; t += 0.5) { const [X, Y] = A.P(t, 0.08 * t * t + 1); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
    if (kind === 'v') { const [x1, y1] = A.P(0, 1), [x2, y2] = A.P(10, 9); d = `M ${r(x1)} ${r(y1)} L ${r(x2)} ${r(y2)}`; }
    if (kind === 'a') { const [x1, y1] = A.P(0, 5), [x2, y2] = A.P(10, 5); d = `M ${r(x1)} ${r(y1)} L ${r(x2)} ${r(y2)}`; }
    return A.g + path(d, col, 2.4);
  };
  let s = caps(60, 62, 'the whole chapter on one diagram', { fill: C.sec });
  s += mini(top, 'x', C.orange) + txt(cx, top + 74, 'x–t', { size: 15, fill: C.orange, anchor: 'middle', weight: 700 });
  s += mini(top + gap, 'v', C.amber) + txt(cx, top + gap + 74, 'v–t', { size: 15, fill: C.amber, anchor: 'middle', weight: 700 });
  s += mini(top + 2 * gap, 'a', C.emerald) + txt(cx, top + 2 * gap + 74, 'a–t', { size: 15, fill: C.emerald, anchor: 'middle', weight: 700 });
  // slope arrows down the LEFT, well clear of the panels
  const lx = 200;
  s += arrow(lx, top + 34, lx, top + gap - 14, C.sec, 1.8);
  s += arrow(lx, top + gap + 34, lx, top + 2 * gap - 14, C.sec, 1.8);
  s += txt(lx - 14, top + gap / 2 + 16, 'slope', { size: 14, fill: C.emph, anchor: 'end', weight: 600 });
  s += txt(lx - 14, top + gap / 2 + 36, 'differentiate', { size: 12, fill: C.meta, anchor: 'end' });
  s += txt(lx - 14, top + gap * 1.5 + 16, 'slope', { size: 14, fill: C.emph, anchor: 'end', weight: 600 });
  // area arrows up the RIGHT
  const rx = 520;
  s += arrow(rx, top + 2 * gap - 14, rx, top + gap + 34, C.sec, 1.8);
  s += arrow(rx, top + gap - 14, rx, top + 34, C.sec, 1.8);
  s += txt(rx + 14, top + gap * 1.5 + 16, 'area', { size: 14, fill: C.emph, weight: 600 });
  s += txt(rx + 14, top + gap * 1.5 + 36, 'integrate', { size: 12, fill: C.meta });
  s += txt(rx + 14, top + gap / 2 + 16, 'area', { size: 14, fill: C.emph, weight: 600 });
  s += txt(cx, H - 46, 'Slope takes you down the chain. Area takes you back up it.', { size: 15, fill: C.emph, anchor: 'middle', weight: 600 });
  s += txt(cx, H - 22, 'Area under x–t means nothing — the only gap in the pattern.', { size: 13, fill: C.meta, anchor: 'middle' });
  return svg(W, H, s, 'Three stacked graphs, x-t, v-t and a-t, with downward arrows labelled slope on the left and upward arrows labelled area on the right.');
};

// ── p7 · signed area ─────────────────────────────────────────────────────────
F['ch2-signed-area'] = () => {
  const W = 720, H = 405;
  const ox = 95, oy = 230, w = 500, hh = 105;
  let s = arrow(ox, oy, ox + w + 10, oy, C.sec, 1.3) + arrow(ox, oy + hh + 20, ox, oy - hh - 20, C.sec, 1.3);
  s += txt(ox + w + 16, oy + 4, 't (s)', { size: 12, fill: C.meta });
  s += txt(ox - 6, oy - hh - 26, 'v (m/s)', { size: 12, fill: C.meta, anchor: 'end' });
  const X = (t) => ox + (t / 40) * w, Y = (v) => oy - (v / 5) * hh;
  // triangle up 0→20 peaking at 10, triangle down 20→40 troughing at 30
  s += `<path d="M ${r(X(0))} ${r(Y(0))} L ${r(X(10))} ${r(Y(5))} L ${r(X(20))} ${r(Y(0))} Z" fill="${C.orange}" fill-opacity="0.16"/>`;
  s += `<path d="M ${r(X(20))} ${r(Y(0))} L ${r(X(30))} ${r(Y(-5))} L ${r(X(40))} ${r(Y(0))} Z" fill="${C.amber}" fill-opacity="0.16"/>`;
  s += path(`M ${r(X(0))} ${r(Y(0))} L ${r(X(10))} ${r(Y(5))} L ${r(X(20))} ${r(Y(0))} L ${r(X(30))} ${r(Y(-5))} L ${r(X(40))} ${r(Y(0))}`, C.orange, 2.6);
  // signs sit inside the shaded regions, clear of every stroke
  s += txt(X(10), Y(2.1), '+', { size: 30, fill: C.orange, anchor: 'middle', weight: 700 });
  s += txt(X(30), Y(-2.4), '−', { size: 30, fill: C.amber, anchor: 'middle', weight: 700 });
  s += txt(X(10), Y(5) - 16, 'area = +50 m', { size: 13, fill: C.orange, anchor: 'middle', weight: 600 });
  // Twice-moved. First at (X(30), Y(-5)+30) it hit the summary line at y=372;
  // then at (X(34), oy+34) it sat ON the descending curve — caught only by the
  // stroke-sampling pass, not by text-vs-text. Now parked past t = 40, where the
  // curve has returned to the axis and nothing else is drawn.
  s += txt(X(40) + 14, oy + 40, 'area = −50 m', { size: 13, fill: C.amber, weight: 600 });
  // tick labels below the axis so they never sit on the curve
  for (const t of [10, 20, 30, 40]) { s += line(X(t), oy - 4, X(t), oy + 4, C.hair, 1.2); s += txt(X(t), oy + 20, String(t), { size: 11, fill: C.meta, anchor: 'middle' }); }
  s += caps(95, 62, 'signed area gives displacement, total area gives distance', { fill: C.sec });
  s += txt(95, 372, 'distance = 50 + 50 = 100 m', { size: 15, fill: C.emph, weight: 600 });
  s += txt(400, 372, 'displacement = 50 − 50 = 0', { size: 15, fill: C.emph, weight: 600 });
  return svg(W, H, s, 'A velocity-time graph with equal triangular areas above and below the time axis, marked plus and minus.');
};

// ── p8 · four motions, three ways ────────────────────────────────────────────
F['ch2-four-motions'] = () => {
  const W = 720, H = 540;
  const colX = [230, 385, 540], rowY = [130, 226, 322, 418];
  const pw = 118, ph = 62;
  const names = ['uniform', 'uniformly accelerated', 'uniformly retarded', 'thrown ball'];
  // [x-t, v-t, a-t] shape generators per row
  const shapes = [
    [(P) => lin(P, 1, 8), (P) => lin(P, 5, 5), (P) => lin(P, 0, 0)],
    [(P) => quad(P, 0.09, 0.5), (P) => lin(P, 0.5, 9), (P) => lin(P, 5, 5)],
    [(P) => negquad(P), (P) => lin(P, 9, 0.5), (P) => lin(P, -5, -5)],
    [(P) => arch(P), (P) => lin(P, 8, -8), (P) => lin(P, -5, -5)],
  ];
  function lin(P, v0, v1) { const [x1, y1] = P(0, v0), [x2, y2] = P(10, v1); return `M ${r(x1)} ${r(y1)} L ${r(x2)} ${r(y2)}`; }
  function quad(P, k, c) { let d = ''; for (let t = 0; t <= 10.02; t += 0.5) { const [X, Y] = P(t, k * t * t + c); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); } return d; }
  function negquad(P) { let d = ''; for (let t = 0; t <= 10.02; t += 0.5) { const [X, Y] = P(t, 9 - 0.09 * (10 - t) * (10 - t)); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); } return d; }
  function arch(P) { let d = ''; for (let t = 0; t <= 10.02; t += 0.5) { const [X, Y] = P(t, 9 - 0.36 * (t - 5) * (t - 5)); d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); } return d; }
  let s = caps(45, 62, 'the four standard motions, each drawn three ways', { fill: C.sec });
  // column headings
  const heads = ['x–t', 'v–t', 'a–t'];
  const cols = [C.orange, C.amber, C.emerald];
  for (let c = 0; c < 3; c++) s += txt(colX[c] + pw / 2, 104, heads[c], { size: 14, fill: cols[c], anchor: 'middle', weight: 700 });
  for (let ro = 0; ro < 4; ro++) {
    // row label on the left, vertically centred, clear of the panels
    s += txt(colX[0] - 22, rowY[ro] + 4, names[ro], { size: 13, fill: C.body, anchor: 'end', weight: 600 });
    for (let c = 0; c < 3; c++) {
      const ox = colX[c], oy = rowY[ro] + ph / 2;
      // a signed panel: the zero line sits mid-height so negatives can show
      s += line(ox, oy, ox + pw, oy, C.hair, 1);
      s += line(ox, oy - ph / 2 - 6, ox, oy + ph / 2 + 6, C.hair, 1);
      const P = (t, v) => [ox + (t / 10) * pw, oy - (v / 10) * (ph / 2) * 2 * 0.5];
      s += path(shapes[ro][c](P), cols[c], 2.2);
    }
    if (ro < 3) s += line(colX[0] - 8, rowY[ro] + ph / 2 + 26, colX[2] + pw + 8, rowY[ro] + ph / 2 + 26, C.hair, 1);
  }
  s += txt(45, H - 26, 'Rows 3 and 4 share an a–t graph. What separates them is what happens when v reaches zero.', { size: 13, fill: C.sec });
  return svg(W, H, s, 'A four-by-three grid of small graphs showing the position-time, velocity-time and acceleration-time graphs for uniform, uniformly accelerated, uniformly retarded, and thrown-ball motion.');
};

// ── p11 · free fall, three cases ─────────────────────────────────────────────
F['ch2-free-fall-three-cases'] = () => {
  const W = 720, H = 405;
  const xs = [140, 360, 580];
  const labs = ['dropped', 'thrown down', 'thrown up'];
  const subs = ['u = 0', 'u points with g', 'u points against g'];
  let s = caps(60, 62, 'three launches, one acceleration', { fill: C.sec });
  const gy0 = 320;
  for (let i = 0; i < 3; i++) {
    const x = xs[i];
    // ground
    s += line(x - 62, gy0, x + 62, gy0, C.hair, 1.6);
    // ball near the top
    s += dot(x, 130, C.emph, 8);
    // the u arrow — absent for case 0, down for case 1, up for case 2
    if (i === 1) { s += arrow(x, 146, x, 196, C.orange, 2.4, 'ar-o'); s += txt(x + 12, 178, 'u', { size: 14, fill: C.orange, weight: 700 }); }
    if (i === 2) { s += arrow(x, 114, x, 64, C.orange, 2.4, 'ar-o'); s += txt(x + 12, 90, 'u', { size: 14, fill: C.orange, weight: 700 }); }
    if (i === 0) s += txt(x + 14, 134, 'u = 0', { size: 13, fill: C.meta });
    // the g arrow, always identical, offset to the LEFT so it never touches u
    s += arrow(x - 44, 200, x - 44, 262, C.amber, 2.6, 'ar-a');
    s += txt(x - 56, 234, 'g', { size: 15, fill: C.amber, anchor: 'end', weight: 700 });
    // dashed fall path on the right of the ball
    s += dash(x, 146, x, gy0 - 6);
    s += txt(x, gy0 + 26, labs[i], { size: 14, fill: C.body, anchor: 'middle', weight: 600 });
    s += txt(x, gy0 + 46, subs[i], { size: 12, fill: C.meta, anchor: 'middle' });
    if (i < 2) s += line((xs[i] + xs[i + 1]) / 2, 100, (xs[i] + xs[i + 1]) / 2, 300, C.hair, 1);
  }
  s += txt(360, 386, 'The g arrow is identical in all three — including for the ball on its way up.', { size: 14, fill: C.emph, anchor: 'middle', weight: 600 });
  return svg(W, H, s, 'Three vertical scenarios side by side: a ball dropped from rest, a ball thrown downward, and a ball thrown upward, each with an identical downward g arrow.');
};

// ── p16 · the NCERT exercise graphs ──────────────────────────────────────────
F['ch2-ncert-exercise-figures'] = () => {
  const W = 720, H = 540;
  let s = caps(45, 58, 'graphs for the exercises below', { fill: C.sec });
  // ── 2.12: four graphs that cannot represent 1-D motion
  s += txt(45, 92, 'Exercise 2.12 — which of these cannot represent one-dimensional motion?', { size: 13, fill: C.body });
  const q = [
    { x: 60, ylab: 'x', kind: 'loop' },
    { x: 225, ylab: 'v', kind: 'circle' },
    { x: 390, ylab: 'speed', kind: 'negspeed' },
    { x: 555, ylab: 'path', kind: 'decreasing' },
  ];
  for (let i = 0; i < 4; i++) {
    const p = q[i], ox = p.x, oy = 190, pw = 105, ph = 60;
    s += line(ox, oy, ox + pw, oy, C.hair, 1) + line(ox, oy - ph, ox, oy + ph * 0.55, C.hair, 1);
    s += txt(ox - 6, oy - ph - 4, p.ylab, { size: 11, fill: C.meta, anchor: 'end' });
    s += txt(ox + pw + 4, oy + 4, 't', { size: 11, fill: C.meta });
    if (p.kind === 'loop') s += path(`M ${ox + 10} ${oy - 8} C ${ox + 70} ${oy - 70}, ${ox + 30} ${oy - 60}, ${ox + 78} ${oy - 20}`, C.orange, 2.2);
    if (p.kind === 'circle') s += `<circle cx="${ox + 52}" cy="${oy - 30}" r="24" fill="none" stroke="${C.orange}" stroke-width="2.2"/>`;
    if (p.kind === 'negspeed') s += path(`M ${ox + 8} ${oy - 34} Q ${ox + 34} ${oy + 26}, ${ox + 58} ${oy - 20} T ${ox + 96} ${oy - 30}`, C.orange, 2.2);
    if (p.kind === 'decreasing') s += path(`M ${ox + 8} ${oy - 46} L ${ox + 36} ${oy - 16} L ${ox + 62} ${oy - 44} L ${ox + 92} ${oy - 12}`, C.orange, 2.2);
    s += txt(ox + pw / 2, oy + 46, '(' + 'abcd'[i] + ')', { size: 12, fill: C.sec, anchor: 'middle' });
  }
  s += line(45, 260, 675, 260, C.hair, 1);
  // ── 2.16: SHM x–t plot with the three instants marked
  s += txt(45, 292, 'Exercise 2.16 — x–t plot of simple harmonic motion', { size: 13, fill: C.body });
  // The SHM sub-panel, rewritten. Three defects the audit found in the first
  // version: u = 0 sat at the axis origin so the t = -1.2 s marker mapped to a
  // NEGATIVE x and was off canvas; the marker labels used two overlapping
  // ternaries that put above-axis labels below the axis, on the trough; and the
  // t-axis label ran across the panel divider at x = 390.
  //
  // Fixes: u = 0 moved inboard with room to its left · amplitude reduced so a
  // label band fits below the trough · the three instants labelled ON THE TIME
  // AXIS with ticks (which is how NCERT prints it) rather than beside the curve,
  // where the negative-time half is too crowded for any label to sit cleanly.
  const sx = 168, sy = 366, sw = 172, sh = 34, su = 60;
  s += arrow(sx - 120, sy, sx + sw + 12, sy, C.sec, 1.3) + arrow(sx, sy + sh + 30, sx, sy - sh - 16, C.sec, 1.3);
  let d = '';
  for (let u = -1.85; u <= 2.7; u += 0.05) { const X = sx + u * su, Y = sy - Math.sin(Math.PI * u) * sh; d += (d ? ' L ' : 'M ') + r(X) + ' ' + r(Y); }
  s += path(d, C.orange, 2.4);
  for (const [u, lab] of [[-1.2, '−1.2'], [0.3, '0.3'], [1.2, '1.2']]) {
    const X = sx + u * su, Y = sy - Math.sin(Math.PI * u) * sh;
    s += ring(X, Y, C.amber, 5);
    s += line(X, sy - 5, X, sy + 5, C.amber, 1.4);
    // Labels sit in a reserved band BELOW the trough (sy + sh = 400), so no label
    // can ever meet the curve however the amplitude is tuned.
    s += txt(X, sy + sh + 22, lab, { size: 11, fill: C.amber, anchor: 'middle' });
  }
  s += txt(sx + sw + 16, sy - 10, 't (s)', { size: 11, fill: C.meta });
  s += txt(sx + 6, sy - sh - 10, 'x', { size: 11, fill: C.meta });
  // ── 2.17 and 2.18: three equal intervals on each
  s += line(390, 270, 390, 500, C.hair, 1);
  s += txt(415, 292, 'Exercises 2.17 and 2.18 — three equal intervals', { size: 13, fill: C.body });
  const bx = 430, by = 400, bw = 210, bh = 78;
  s += arrow(bx, by, bx + bw + 12, by, C.sec, 1.3) + arrow(bx, by + 10, bx, by - bh - 18, C.sec, 1.3);
  let d2 = '';
  for (let i = 0; i <= 60; i++) {
    const t = i / 60, X = bx + t * bw;
    const v = 0.22 + 0.62 * Math.sin(Math.PI * t * 0.92) + 0.14 * Math.sin(Math.PI * t * 3);
    d2 += (d2 ? ' L ' : 'M ') + r(X) + ' ' + r(by - v * bh);
  }
  s += path(d2, C.amber, 2.4);
  for (const f of [0.2, 0.5, 0.8]) {
    const X = bx + f * bw;
    s += line(X, by, X, by - bh - 4, C.hair, 1.2, 'stroke-dasharray="3 3"');
  }
  s += txt(bx + 0.1 * bw, by + 20, '1', { size: 12, fill: C.sec, anchor: 'middle' });
  s += txt(bx + 0.35 * bw, by + 20, '2', { size: 12, fill: C.sec, anchor: 'middle' });
  s += txt(bx + 0.65 * bw, by + 20, '3', { size: 12, fill: C.sec, anchor: 'middle' });
  s += txt(bx + bw + 16, by + 4, 't', { size: 11, fill: C.meta });
  s += txt(bx + 6, by - bh - 6, 'x  or  speed', { size: 11, fill: C.meta });
  s += txt(45, H - 18, 'Exercise 2.2’s graph is the one on page 4. Exercises 2.3, 2.4, 2.8, 2.13 and 2.15 ask you to draw the graph yourself.', { size: 12, fill: C.meta });
  return svg(W, H, s, 'Graphs for the NCERT exercises: four impossible motion graphs, a simple-harmonic position-time plot, and a curve divided into three equal time intervals.');
};

module.exports = { FIGURES: F, PALETTE: C };
