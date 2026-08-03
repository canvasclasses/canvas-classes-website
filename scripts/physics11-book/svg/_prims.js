'use strict';
/**
 * Shared SVG primitives for the Class 11 Physics Live Book figures.
 *
 * WHY THIS EXISTS: `figures_ch2.js` and `figures_ch3.js` each carry their own
 * copy of this library. Ch.3's header says outright that "Ch.4 is the third use
 * and the right moment to extract a shared module" — so here it is.
 *
 * Ch.2 and Ch.3 are deliberately NOT re-pointed at this file. Their figures are
 * already drawn, founder-reviewed and live on R2; switching them to a shared
 * module would mean re-rendering and re-uploading 21 verified figures for no
 * behavioural gain. New chapters use this; old ones stay frozen.
 *
 * DESIGN RULES (all load-bearing — see BOOK_PAGE_WORKFLOW §17.3.1 and the
 * Ch.2/Ch.3 changelog entries in LIVE_BOOKS_STATE.md):
 *   • TRANSPARENT background. The reader has three dark themes driven by CSS
 *     variables; a baked-in dark fill reads as a patch on two of them.
 *   • White text at the FOUR sanctioned tiers only — /85 emph, /82 body,
 *     /60 secondary, /45 meta. /90 and /25–/40 are banned.
 *   • Two accents (orange, amber); emerald ONLY for a genuinely distinct third
 *     series — on Ch.4 that is friction, which is a third kind of force
 *     alongside applied forces and normal/tension.
 *   • No boxes. Structure comes from hairlines and whitespace.
 *   • A ~720-unit viewBox so font-size 13–16 lands at a real 13–16 px.
 *   • `width="100%"` with NO `height` attribute. Ch.2 used `height="auto"`,
 *     which is invalid SVG — browsers tolerate it but every offline rasteriser
 *     turns it into a zero-height image. Omit height; the viewBox supplies the
 *     ratio.
 *   • SVG HAS NO LaTeX. `v_x` in a text node renders a literal underscore —
 *     use `sub()`, which emits a real <tspan>.
 */

const C = {
  emph: 'rgba(255,255,255,0.85)',
  body: 'rgba(255,255,255,0.82)',
  sec: 'rgba(255,255,255,0.60)',
  meta: 'rgba(255,255,255,0.45)',
  hair: 'rgba(255,255,255,0.14)',
  fill: 'rgba(255,255,255,0.07)',   // faint body-fill for blocks/crates
  orange: '#f97316',
  amber: '#fbbf24',
  emerald: '#34d399',
};
const FONT = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

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

/** Arrow with the marker matched to the stroke colour, chosen automatically. */
const varrow = (x1, y1, x2, y2, stroke = C.sec, w = 1.6) => {
  const mk = stroke === C.orange ? 'ar-o' : stroke === C.amber ? 'ar-a' : stroke === C.emerald ? 'ar-e' : 'ar-w';
  return arrow(x1, y1, x2, y2, stroke, w, mk);
};

const path = (d, stroke = C.orange, w = 2, extra = '') =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

const dash = (x1, y1, x2, y2, stroke = C.hair, w = 1.2) =>
  line(x1, y1, x2, y2, stroke, w, 'stroke-dasharray="4 4"');

const dashPath = (d, stroke = C.hair, w = 1.2) =>
  path(d, stroke, w, 'stroke-dasharray="4 4"');

const dot = (x, y, fill = C.orange, rad = 4.5) => `<circle cx="${r(x)}" cy="${r(y)}" r="${rad}" fill="${fill}"/>`;
const circle = (x, y, rad, stroke = C.hair, w = 1.4) => `<circle cx="${r(x)}" cy="${r(y)}" r="${r(rad)}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;

/** A block / crate / mass: faint fill so it reads as an object, hairline edge.
 *  NOTE the fill is rgba, never a dark hex — the publish lint rejects a dark
 *  `<rect fill="#0…">` because that would paint a background. */
const box = (cx, cy, w, h, { stroke = C.sec, sw = 1.5, rot = 0, rx = 3 } = {}) => {
  const g = rot ? `<g transform="rotate(${r(rot)} ${r(cx)} ${r(cy)})">` : '';
  const gEnd = rot ? '</g>' : '';
  return g + `<rect x="${r(cx - w / 2)}" y="${r(cy - h / 2)}" width="${r(w)}" height="${r(h)}" rx="${rx}" `
    + `fill="${C.fill}" stroke="${stroke}" stroke-width="${sw}"/>` + gEnd;
};

const txt = (x, y, s, { size = 14, fill = C.body, anchor = 'start', weight = 400 } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" font-weight="${weight}">${s}</text>`;

const caps = (x, y, s, { fill = C.meta, anchor = 'start' } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" font-size="11" fill="${fill}" text-anchor="${anchor}" letter-spacing="1.1">${esc(String(s).toUpperCase())}</text>`;

/** A subscripted symbol, e.g. sub('v','x') → v with a proper subscript x.
 *  SVG has no LaTeX: writing "v_x" in a text node renders the underscore. */
const sub = (base, s) => `${esc(base)}<tspan font-size="11" dy="4">${esc(s)}</tspan><tspan dy="-4"> </tspan>`;

/** Hatching ticks along a line, for ground / wall / ceiling. `side` is the
 *  unit vector the ticks lean toward. */
const hatch = (x1, y1, x2, y2, side, n = 9, len = 11, stroke = C.hair) => {
  let s = line(x1, y1, x2, y2, C.sec, 2);
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const px = x1 + (x2 - x1) * t, py = y1 + (y2 - y1) * t;
    s += line(px, py, px + side[0] * len, py + side[1] * len, stroke, 1.2);
  }
  return s;
};

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

/** Unit vector helpers, used constantly by incline / banking figures. */
const unit = (dx, dy) => { const m = Math.hypot(dx, dy); return [dx / m, dy / m]; };
const add = (p, u, k) => [p[0] + u[0] * k, p[1] + u[1] * k];

module.exports = {
  C, FONT, esc, r, svg, line, arrow, varrow, path, dash, dashPath, dot, circle,
  box, txt, caps, sub, hatch, angleArc, rightAngle, curve, unit, add,
};
