'use strict';
/**
 * Hand-authored SVG figures for Class 11 Physics · Chapter 4 "Laws of Motion".
 *
 * DRAWN, NOT GENERATED (founder decision, 2026-07-29). In a mechanics chapter
 * the correctness of the figure IS the teaching — an image generator gets the
 * angles, the arrow directions and the axis labels wrong, and a free body
 * diagram with a wrong arrow teaches the wrong physics.
 *
 * COLOUR ROLES, fixed here so no figure drifts:
 *   orange  = the APPLIED / driving force, and the object of interest
 *   amber   = the CONTACT force that supports or turns (normal force, tension)
 *   emerald = FRICTION — a genuinely distinct third kind of force in this
 *             chapter, which is what justifies a third accent at all
 *   white/sec = weight (mg), always the same in every panel, never the story
 *
 * Every figure is 720 units wide. Run the publisher with `--dry` to render into
 * ./out without uploading, then LOOK at the rasters — Ch.3 found nine defects
 * that way that neither Zod nor the lint gate could see.
 *
 * Run (render only):   node scripts/physics11-book/svg/publish_ch4_figures.js --dry
 */
const P = require('./_prims');
const {
  C, esc, r, svg, line, arrow, varrow, path, dash, dashPath, dot, circle,
  box, txt, caps, sub, hatch, angleArc, rightAngle, unit, add,
} = P;

const F = {};
const W = 720, H = 405;
const divider = (x, y0 = 44, y1 = 386) => line(x, y0, x, y1, C.hair, 1.2);

// ═══════════════════════════════════════════════════════════════════════════
// p1 · ch4-action-reaction-pairs
// Left: two forces on ONE body (not a Third Law pair). Right: the real pair.
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-action-reaction-pairs'] = () => {
  let s = '';
  s += divider(360);

  // ── LEFT: two forces, one body ──
  s += caps(180, 54, 'Two forces on ONE body', { anchor: 'middle', fill: C.sec });
  s += box(180, 205, 88, 34);
  s += txt(180, 210, 'book', { size: 12, fill: C.meta, anchor: 'middle' });
  s += varrow(180, 188, 180, 120, C.amber);
  s += txt(192, 152, 'N', { size: 15, fill: C.amber });
  s += varrow(180, 222, 180, 290, C.sec);
  s += txt(192, 262, 'mg', { size: 15, fill: C.sec });
  s += txt(180, 336, 'Equal and opposite — but both act', { size: 13, fill: C.body, anchor: 'middle' });
  s += txt(180, 356, 'on the book. Never a Third Law pair.', { size: 13, fill: C.meta, anchor: 'middle' });

  // ── RIGHT: one force on each of two bodies ──
  s += caps(540, 54, 'One force on EACH of two bodies', { anchor: 'middle', fill: C.sec });
  s += box(540, 160, 88, 32);
  s += txt(540, 165, 'book', { size: 12, fill: C.meta, anchor: 'middle' });
  s += box(540, 290, 180, 26);
  s += txt(540, 295, 'table', { size: 12, fill: C.meta, anchor: 'middle' });
  // force ON the book, pointing up
  s += varrow(506, 250, 506, 182, C.amber);
  s += txt(498, 222, 'on book', { size: 12, fill: C.amber, anchor: 'end' });
  // force ON the table, pointing down
  s += varrow(574, 198, 574, 266, C.orange);
  s += txt(582, 238, 'on table', { size: 12, fill: C.orange });
  s += txt(540, 336, 'Equal and opposite, acting on two', { size: 13, fill: C.body, anchor: 'middle' });
  s += txt(540, 356, 'different bodies. This is the real pair.', { size: 13, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'Two forces on one body are not a Third Law pair; the real pair acts one force on each of two different bodies');
};

// ═══════════════════════════════════════════════════════════════════════════
// p3 · ch4-fbd-three-scenarios
// Three isolated bodies: floor, string, incline.
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-fbd-three-scenarios'] = () => {
  let s = '';
  s += divider(240) + divider(480);

  // ── A · on a floor ──
  s += caps(120, 54, 'On a floor', { anchor: 'middle', fill: C.sec });
  s += box(120, 210, 74, 32);
  s += varrow(120, 194, 120, 132, C.amber);
  s += txt(131, 166, 'N', { size: 15, fill: C.amber });
  s += varrow(120, 226, 120, 288, C.sec);
  s += txt(131, 262, 'mg', { size: 15, fill: C.sec });
  s += txt(120, 340, 'N = mg', { size: 14, fill: C.body, anchor: 'middle' });
  s += txt(120, 362, 'only because it is in equilibrium', { size: 12, fill: C.meta, anchor: 'middle' });

  // ── B · on a string ──
  s += caps(360, 54, 'On a string', { anchor: 'middle', fill: C.sec });
  s += hatch(326, 104, 394, 104, [-0.5, -0.87], 5, 9);
  s += line(360, 104, 360, 194, C.hair, 1.4);
  s += box(360, 210, 74, 32);
  s += varrow(360, 194, 360, 136, C.amber);
  s += txt(371, 168, 'T', { size: 15, fill: C.amber });
  s += varrow(360, 226, 360, 288, C.sec);
  s += txt(371, 262, 'mg', { size: 15, fill: C.sec });
  s += txt(360, 340, 'T = mg', { size: 14, fill: C.body, anchor: 'middle' });
  s += txt(360, 362, 'a string can only pull', { size: 12, fill: C.meta, anchor: 'middle' });

  // ── C · on a smooth incline ──
  s += caps(600, 54, 'On a smooth incline', { anchor: 'middle', fill: C.sec });
  const A = [512, 300], B = [696, 300], T = [696, 194];        // wedge, rises to the right
  s += path(`M ${A[0]} ${A[1]} L ${B[0]} ${B[1]} L ${T[0]} ${T[1]} Z`, C.hair, 1.4);
  const th = Math.atan2(A[1] - T[1], T[0] - A[0]) * 180 / Math.PI;  // slope angle above horizontal
  // Outward normal: perpendicular to the face, pointing away from the wedge
  // body (up and to the LEFT, since the wedge material lies below-right).
  const nx = -Math.sin(th * Math.PI / 180), ny = -Math.cos(th * Math.PI / 180);
  const contact = [A[0] + (T[0] - A[0]) * 0.56, A[1] + (T[1] - A[1]) * 0.56];
  const bc = [contact[0] + nx * 17, contact[1] + ny * 17];
  s += box(bc[0], bc[1], 58, 30, { rot: -th });
  s += varrow(bc[0], bc[1], bc[0] + nx * 66, bc[1] + ny * 66, C.amber);
  s += txt(bc[0] + nx * 66 - 8, bc[1] + ny * 66 - 8, 'N', { size: 15, fill: C.amber, anchor: 'end' });
  s += varrow(bc[0], bc[1], bc[0], bc[1] + 74, C.sec);
  s += txt(bc[0] + 11, bc[1] + 62, 'mg', { size: 15, fill: C.sec });
  s += angleArc(A[0], A[1], 46, 0, th);
  s += txt(A[0] + 54, A[1] - 12, 'θ', { size: 14, fill: C.meta });
  s += txt(600, 340, 'N = mg cos θ', { size: 14, fill: C.body, anchor: 'middle' });
  s += txt(600, 362, 'always less than the full weight', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'Three free body diagrams: a block on a floor, a mass on a string, and a block on a smooth incline');
};

// ═══════════════════════════════════════════════════════════════════════════
// p5 · ch4-atwood-machine
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-atwood-machine'] = () => {
  let s = '';
  const px = 360, py = 118, R = 38;
  const lx = px - R, rx = px + R;

  s += hatch(316, 52, 404, 52, [-0.5, -0.87], 6, 9);
  s += line(px, 52, px, py - R, C.hair, 1.4);
  s += circle(px, py, R, C.sec, 2);
  s += dot(px, py, C.meta, 5);
  s += caps(px + 60, 96, 'Fixed pulley', { fill: C.meta });

  // string: down-left, over the top, down-right
  s += line(lx, py, lx, 222, C.sec, 1.6);
  s += path(`M ${lx} ${py} A ${R} ${R} 0 0 1 ${rx} ${py}`, C.sec, 1.6);
  s += line(rx, py, rx, 266, C.sec, 1.6);

  // masses — lighter drawn higher (rising), heavier lower (descending)
  s += box(lx, 246, 66, 48);
  s += txt(lx, 251, '8 kg', { size: 13, fill: C.body, anchor: 'middle' });
  s += box(rx, 290, 66, 48);
  s += txt(rx, 295, '12 kg', { size: 13, fill: C.body, anchor: 'middle' });

  // equal-length acceleration arrows, opposite senses
  s += varrow(272, 264, 272, 218, C.orange);
  s += txt(262, 244, 'a', { size: 15, fill: C.orange, anchor: 'end' });
  s += varrow(448, 268, 448, 314, C.orange);
  s += txt(458, 296, 'a', { size: 15, fill: C.orange });

  // tension labels
  s += txt(lx - 12, 178, 'T', { size: 15, fill: C.amber, anchor: 'end' });
  s += txt(rx + 12, 178, 'T', { size: 15, fill: C.amber });

  s += txt(360, 352, 'Same T throughout the string. Same |a| on both sides.', { size: 13, fill: C.body, anchor: 'middle' });
  s += txt(360, 374, 'The fixed length of the string is what forces it.', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'An Atwood machine: two masses over a fixed pulley, with equal tension throughout and equal magnitudes of acceleration in opposite directions');
};

// ═══════════════════════════════════════════════════════════════════════════
// p6 · ch4-movable-pulley
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-movable-pulley'] = () => {
  let s = '';
  // The segment leaving the movable pulley runs STRAIGHT UP into the fixed
  // pulley, so the two must be tangent to the same vertical line:
  //   movable.right_tangent === fixed.left_tangent.
  // Getting this wrong leaves the string visibly broken in mid-air.
  const Rm = 30, Rf = 30;
  const Pm = [216, 240];                             // movable pulley
  const mL = Pm[0] - Rm, mR = Pm[0] + Rm;            // 186 · 246
  const Pf = [mR + Rf, 116];                         // fixed pulley, tangent at mR
  const fL = Pf[0] - Rf, fR = Pf[0] + Rf;            // 246 · 306

  s += hatch(150, 56, 400, 56, [-0.5, -0.87], 12, 9);

  // segment 1: anchor straight down to the movable pulley's left tangent
  s += line(mL, 56, mL, Pm[1], C.sec, 1.6);
  // under the movable pulley
  s += path(`M ${mL} ${Pm[1]} A ${Rm} ${Rm} 0 0 0 ${mR} ${Pm[1]}`, C.sec, 1.6);
  // segment 2: up to the fixed pulley's left tangent
  s += line(mR, Pm[1], mR, Pf[1], C.sec, 1.6);
  // over the fixed pulley
  s += path(`M ${fL} ${Pf[1]} A ${Rf} ${Rf} 0 0 1 ${fR} ${Pf[1]}`, C.sec, 1.6);
  // segment 3: down to the single-string mass
  s += line(fR, Pf[1], fR, 258, C.sec, 1.6);

  s += circle(Pm[0], Pm[1], Rm, C.sec, 2) + dot(Pm[0], Pm[1], C.meta, 5);
  s += circle(Pf[0], Pf[1], Rf, C.sec, 2) + dot(Pf[0], Pf[1], C.meta, 5);

  // load on the movable pulley
  s += line(Pm[0], Pm[1] + Rm, Pm[0], 294, C.hair, 1.4);
  s += box(Pm[0], 318, 70, 46);
  s += txt(Pm[0], 323, '4 kg', { size: 13, fill: C.body, anchor: 'middle' });
  // mass on the single-string side
  s += box(fR, 280, 58, 44);
  s += txt(fR, 285, '1 kg', { size: 13, fill: C.body, anchor: 'middle' });

  // tension labels — one per segment
  s += txt(mL - 12, 150, 'T', { size: 15, fill: C.amber, anchor: 'end' });
  s += txt(mR + 12, 200, 'T', { size: 15, fill: C.amber });
  s += txt(fR + 12, 200, 'T', { size: 15, fill: C.amber });

  s += caps(mL - 20, Pm[1] + 4, 'Movable', { anchor: 'end', fill: C.meta });
  s += caps(fR + 16, 96, 'Fixed', { fill: C.meta });

  // the trade, stated on the right
  s += caps(470, 150, 'The trade', { fill: C.sec });
  s += txt(470, 182, 'Two segments hold the load,', { size: 13, fill: C.body });
  s += txt(470, 204, 'so 2T lifts it — but it rises', { size: 13, fill: C.body });
  s += txt(470, 226, 'only half as far.', { size: 13, fill: C.body });
  s += txt(470, 264, sub('a', 'single') + ' = 2 × ' + sub('a', 'movable'), { size: 14, fill: C.amber });

  return svg(W, H, s, 'A movable pulley supported by two string segments, with a single-string side over a fixed pulley, showing the factor-of-two trade between force and distance');
};

// ═══════════════════════════════════════════════════════════════════════════
// p7 · ch4-friction-force-graph
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-friction-force-graph'] = () => {
  let s = '';
  const ox = 110, oy = 320;                 // origin
  const sx = 50, sy = 34;                   // px per unit
  const X = (f) => ox + f * sx, Y = (f) => oy - f * sy;
  const fL = 5, fk = 4, Fbreak = 5;

  // axes
  s += arrow(ox, oy, 654, oy, C.sec, 1.6, 'ar-w');
  s += arrow(ox, oy, ox, 96, C.sec, 1.6, 'ar-w');
  s += txt(654, 344, 'applied force  F', { size: 13, fill: C.sec, anchor: 'end' });
  s += txt(ox, 84, 'friction  f', { size: 13, fill: C.sec, anchor: 'middle' });

  // guides
  s += dash(ox, Y(fL), X(Fbreak), Y(fL));
  s += dash(ox, Y(fk), X(Fbreak) + 260, Y(fk));
  s += dash(X(Fbreak), oy, X(Fbreak), Y(fL));
  s += txt(ox - 10, Y(fL) + 4, sub('μ', 's') + 'N', { size: 13, fill: C.meta, anchor: 'end' });
  s += txt(ox - 10, Y(fk) + 5, sub('μ', 'k') + 'N', { size: 13, fill: C.meta, anchor: 'end' });

  // the curve
  s += path(`M ${ox} ${oy} L ${X(Fbreak)} ${Y(fL)}`, C.orange, 2.6);
  s += path(`M ${X(Fbreak)} ${Y(fL)} L ${X(Fbreak)} ${Y(fk)}`, C.orange, 2.6, 'stroke-dasharray="3 3"');
  s += path(`M ${X(Fbreak)} ${Y(fk)} L ${X(Fbreak) + 260} ${Y(fk)}`, C.orange, 2.6);
  s += dot(X(Fbreak), Y(fL), C.orange, 5.5);

  // region labels
  s += caps(230, 122, 'Static — self-adjusting', { anchor: 'middle', fill: C.sec });
  s += caps(500, 122, 'Kinetic — fixed', { anchor: 'middle', fill: C.sec });
  s += txt(300, 258, 'f = F', { size: 14, fill: C.body });
  s += txt(300, 278, 'friction just matches you', { size: 12, fill: C.meta });
  s += txt(470, 164, 'f stays at ' + sub('μ', 'k') + 'N however hard you push', { size: 12, fill: C.meta });
  s += txt(X(Fbreak), 344, 'it breaks free here', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'Friction force plotted against applied force: a rising line while static friction self-adjusts, a drop at the breaking point, then a constant kinetic value');
};

// ═══════════════════════════════════════════════════════════════════════════
// p8 · ch4-pull-vs-push
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-pull-vs-push'] = () => {
  let s = '';
  s += divider(360);

  const crate = (cx, cy) => {
    let g = box(cx, cy, 72, 56);
    // ground indicated by short hatch either side, leaving room for mg below
    g += hatch(cx - 100, cy + 28, cx - 36, cy + 28, [-0.5, 0.87], 4, 9);
    g += hatch(cx + 36, cy + 28, cx + 100, cy + 28, [-0.5, 0.87], 4, 9);
    return g;
  };

  // ── PULLING · N reduced ──
  const ax = 180, ay = 250;
  s += caps(ax, 54, 'Pulling — N is reduced', { anchor: 'middle', fill: C.sec });
  s += crate(ax, ay);
  s += varrow(ax, ay - 28, ax, ay - 80, C.amber);             // SHORT N
  s += txt(ax - 12, ay - 62, 'N', { size: 15, fill: C.amber, anchor: 'end' });
  s += varrow(ax + 36, ay - 10, ax + 112, ay - 54, C.orange); // rope, up at 30°
  s += txt(ax + 120, ay - 58, 'F', { size: 15, fill: C.orange });
  s += varrow(ax - 36, ay + 12, ax - 92, ay + 12, C.emerald); // SHORT friction
  s += txt(ax - 100, ay + 16, 'f', { size: 15, fill: C.emerald, anchor: 'end' });
  s += varrow(ax, ay + 28, ax, ay + 86, C.sec);
  s += txt(ax + 11, ay + 68, 'mg', { size: 14, fill: C.sec });
  s += txt(ax, 372, '44.8 N needed', { size: 13, fill: C.body, anchor: 'middle' });

  // ── PUSHING · N increased ──
  const bx = 540, by = 250;
  s += caps(bx, 54, 'Pushing — N is increased', { anchor: 'middle', fill: C.sec });
  s += crate(bx, by);
  s += varrow(bx, by - 28, bx, by - 106, C.amber);            // LONG N
  s += txt(bx - 12, by - 88, 'N', { size: 15, fill: C.amber, anchor: 'end' });
  s += varrow(bx - 112, by - 62, bx - 36, by - 18, C.orange); // hand, down at 30° into the crate
  s += txt(bx - 120, by - 66, 'F', { size: 15, fill: C.orange, anchor: 'end' });
  // Friction opposes the INTENDED MOTION, which is to the right in BOTH panels
  // (the push drives the crate right just as the pull does). So it points left
  // in both — only its LENGTH differs, and that is the whole point of the
  // figure. Drawing it rightward here would be a straightforward physics error.
  s += varrow(bx - 36, by + 12, bx - 112, by + 12, C.emerald);// LONG friction
  s += txt(bx - 120, by + 16, 'f', { size: 15, fill: C.emerald, anchor: 'end' });
  s += varrow(bx, by + 28, bx, by + 86, C.sec);
  s += txt(bx + 11, by + 68, 'mg', { size: 14, fill: C.sec });
  s += txt(bx, 372, '81.2 N needed', { size: 13, fill: C.body, anchor: 'middle' });

  return svg(W, H, s, 'The same crate pulled at an angle above the horizontal and pushed at the same angle below it, showing a shorter normal force and friction when pulling and longer ones when pushing');
};

// ═══════════════════════════════════════════════════════════════════════════
// p9 · ch4-block-on-wall
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-block-on-wall'] = () => {
  let s = '';
  const wx = 250;
  s += caps(360, 54, 'On a vertical wall, everything rotates by 90°', { anchor: 'middle', fill: C.sec });
  s += hatch(wx, 96, wx, 344, [-1, 0], 10, 12);

  const bx = wx, bw = 92, bh = 100, bcy = 210;
  s += box(bx + bw / 2, bcy, bw, bh);
  s += txt(bx + bw / 2, bcy + 4, 'block', { size: 12, fill: C.meta, anchor: 'middle' });

  // contact point: N out of the wall, f up along it — two arrows from one point.
  // N runs PAST the block's right edge so its label sits in clear space rather
  // than on the block's border.
  // Kept clear of the block's lower border — at y = 252 the amber N ran almost
  // along the box edge and read as part of it.
  const cy = 235;
  s += dot(wx, cy, C.meta, 4);
  s += varrow(wx, cy, wx + 106, cy, C.amber);
  s += txt(wx + 114, cy + 5, 'N', { size: 15, fill: C.amber });
  s += varrow(wx + 4, cy, wx + 4, 150, C.emerald);
  s += txt(wx + 14, 144, 'f', { size: 15, fill: C.emerald });

  // applied push, and weight — F sits well above N so the two heads never meet
  s += varrow(470, 184, 348, 184, C.orange);
  s += txt(478, 189, 'F', { size: 15, fill: C.orange });
  s += varrow(bx + bw / 2, bcy + bh / 2, bx + bw / 2, 330, C.sec);
  s += txt(bx + bw / 2 + 11, 312, 'mg', { size: 14, fill: C.sec });

  s += txt(470, 268, 'N is set by your push,', { size: 13, fill: C.body });
  s += txt(470, 290, 'not by the weight.', { size: 13, fill: C.body });
  s += txt(470, 322, 'Friction acts VERTICALLY —', { size: 13, fill: C.emerald });
  s += txt(470, 344, 'the only thing holding it up.', { size: 13, fill: C.meta });

  return svg(W, H, s, 'A block held against a vertical wall: the normal force is horizontal and set by the applied push, while friction acts vertically up the wall face against the weight');
};

// ═══════════════════════════════════════════════════════════════════════════
// p10 · ch4-lift-two-frames
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-lift-two-frames'] = () => {
  let s = '';
  s += divider(360);

  // The body is wide enough that BOTH the weight and the pseudo force start
  // inside its footprint — otherwise the pseudo-force arrow appears to sprout
  // from the floor rather than act on the person.
  const person = (cx, cy) => {
    let g = box(cx, cy, 74, 66);
    // broken floor line, so the downward arrows have clear space below
    g += line(cx - 74, cy + 33, cx - 40, cy + 33, C.hair, 1.4);
    g += line(cx + 40, cy + 33, cx + 74, cy + 33, C.hair, 1.4);
    return g;
  };

  // ── ground frame ──
  s += caps(180, 54, 'From the ground', { anchor: 'middle', fill: C.sec });
  s += person(180, 220);
  s += varrow(180, 187, 180, 122, C.amber);
  s += txt(191, 152, 'N', { size: 15, fill: C.amber });
  s += varrow(180, 253, 180, 318, C.sec);
  s += txt(191, 292, 'mg', { size: 15, fill: C.sec });
  s += varrow(278, 244, 278, 186, C.orange);
  s += txt(288, 216, 'a', { size: 15, fill: C.orange });
  s += txt(180, 352, 'The person accelerates,', { size: 13, fill: C.body, anchor: 'middle' });
  s += txt(180, 372, 'so N must exceed mg.', { size: 13, fill: C.meta, anchor: 'middle' });

  // ── lift frame ──
  s += caps(540, 54, 'From inside the lift', { anchor: 'middle', fill: C.sec });
  s += person(540, 220);
  s += varrow(540, 187, 540, 122, C.amber);
  s += txt(551, 152, 'N', { size: 15, fill: C.amber });
  s += varrow(540, 253, 540, 318, C.sec);
  s += txt(551, 292, 'mg', { size: 15, fill: C.sec });
  s += varrow(512, 253, 512, 311, C.orange);
  s += txt(502, 288, 'ma', { size: 14, fill: C.orange, anchor: 'end' });
  s += caps(622, 216, 'At rest', { fill: C.meta });
  s += txt(540, 352, 'At rest — but carrying a', { size: 13, fill: C.body, anchor: 'middle' });
  s += txt(540, 372, 'downward pseudo force ma.', { size: 13, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'The same person in a lift seen from the ground, where they accelerate and the normal force exceeds the weight, and from inside the lift, where they are at rest and carry a downward pseudo force');
};

// ═══════════════════════════════════════════════════════════════════════════
// p11 · ch4-pendulum-in-vehicle
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-pendulum-in-vehicle'] = () => {
  let s = '';
  s += divider(360);
  const TH = 26.57, L = 132;
  const dx = -Math.sin(TH * Math.PI / 180), dy = Math.cos(TH * Math.PI / 180); // down-left

  const rig = (px, py) => {
    const b = [px + dx * L, py + dy * L];
    let g = hatch(px - 68, py, px + 68, py, [-0.5, -0.87], 7, 9);
    g += line(px, py, b[0], b[1], C.sec, 1.6);
    g += dash(px, py, px, py + 148);
    // θ must sit INSIDE the wedge between the dashed vertical and the string.
    // At depth d below the pivot the string is at x = px − d·tan θ, so a label
    // at px−26 / d=52 landed exactly ON the string; and at d=62 it collided
    // with the T label instead. Anchored just left of the vertical, well below
    // the arrow tip, it clears both.
    g += angleArc(px, py, 60, -90, -(90 + TH));
    g += txt(px - 10, py + 76, 'θ', { size: 14, fill: C.meta, anchor: 'end' });
    g += dot(b[0], b[1], C.orange, 12);
    return { g, b };
  };

  // ── ground frame ──
  s += caps(180, 54, 'From the ground', { anchor: 'middle', fill: C.sec });
  const A = rig(196, 96); s += A.g;
  s += varrow(A.b[0], A.b[1], A.b[0] - dx * 70, A.b[1] - dy * 70, C.amber);
  s += txt(A.b[0] - dx * 70 - 20, A.b[1] - dy * 70 - 6, 'T', { size: 15, fill: C.amber, anchor: 'end' });
  s += varrow(A.b[0], A.b[1], A.b[0], A.b[1] + 68, C.sec);
  s += txt(A.b[0] + 11, A.b[1] + 50, 'mg', { size: 14, fill: C.sec });
  s += varrow(140, 330, 232, 330, C.orange);
  s += txt(240, 335, 'a', { size: 15, fill: C.orange });
  s += txt(180, 372, 'T tilts to accelerate the bob', { size: 12, fill: C.meta, anchor: 'middle' });

  // ── vehicle frame ──
  s += caps(540, 54, 'From inside the vehicle', { anchor: 'middle', fill: C.sec });
  const B = rig(556, 96); s += B.g;
  s += varrow(B.b[0], B.b[1], B.b[0] - dx * 70, B.b[1] - dy * 70, C.amber);
  s += txt(B.b[0] - dx * 70 - 20, B.b[1] - dy * 70 - 6, 'T', { size: 15, fill: C.amber, anchor: 'end' });
  s += varrow(B.b[0], B.b[1], B.b[0], B.b[1] + 68, C.sec);
  s += txt(B.b[0] + 11, B.b[1] + 50, 'mg', { size: 14, fill: C.sec });
  s += varrow(B.b[0], B.b[1], B.b[0] - 74, B.b[1], C.orange);
  s += txt(B.b[0] - 82, B.b[1] - 8, 'ma', { size: 14, fill: C.orange, anchor: 'end' });
  s += dashPath(`M ${r(B.b[0])} ${r(B.b[1])} L ${r(B.b[0] + dx * 62)} ${r(B.b[1] + dy * 62)}`, C.amber, 1.4);
  s += caps(B.b[0] - 30, B.b[1] + 96, 'Effective gravity', { anchor: 'middle', fill: C.amber });
  s += txt(540, 372, 'the bob hangs along it, at rest', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'A bob hanging in an accelerating vehicle, seen from the ground where the tension tilts to accelerate it, and from inside where a pseudo force tilts the effective gravity it hangs along');
};

// ═══════════════════════════════════════════════════════════════════════════
// p12 · ch4-conical-and-vertical-circle
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-conical-and-vertical-circle'] = () => {
  let s = '';
  s += divider(360);

  // ── conical pendulum ──
  s += caps(180, 54, 'Conical pendulum', { anchor: 'middle', fill: C.sec });
  const px = 168, py = 92, LL = 140, TH = 30;
  const bx = px + LL * Math.sin(TH * Math.PI / 180), by = py + LL * Math.cos(TH * Math.PI / 180);
  s += hatch(px - 60, py, px + 60, py, [-0.5, -0.87], 6, 9);
  s += `<ellipse cx="${r(px)}" cy="${r(by)}" rx="${r(bx - px)}" ry="18" fill="none" stroke="${C.hair}" stroke-width="1.3" stroke-dasharray="4 4"/>`;
  s += dash(px, py, px, by + 24);
  s += line(px, py, bx, by, C.sec, 1.6);
  s += angleArc(px, py, 38, -90, -(90 - TH));
  s += txt(px + 26, py + 50, 'θ', { size: 14, fill: C.meta });
  s += dot(bx, by, C.orange, 11);
  const u = unit(px - bx, py - by);
  s += varrow(bx, by, bx + u[0] * 66, by + u[1] * 66, C.amber);
  s += txt(bx + u[0] * 66 + 8, by + u[1] * 66 - 2, 'T', { size: 15, fill: C.amber });
  s += dashPath(`M ${r(bx)} ${r(by)} L ${r(bx)} ${r(by - 54)}`, C.amber, 1.3);
  s += txt(bx + 9, by - 58, 'T cos θ', { size: 12, fill: C.amber });
  s += dashPath(`M ${r(bx)} ${r(by)} L ${r(px + 6)} ${r(by)}`, C.amber, 1.3);
  s += txt(bx - 12, by + 34, 'T sin θ', { size: 12, fill: C.amber, anchor: 'end' });
  s += varrow(bx, by, bx, by + 66, C.sec);
  s += txt(bx + 11, by + 50, 'mg', { size: 14, fill: C.sec });
  s += txt(180, 344, 'Vertical part holds it up,', { size: 12, fill: C.meta, anchor: 'middle' });
  s += txt(180, 364, 'horizontal part turns it.', { size: 12, fill: C.meta, anchor: 'middle' });

  // ── vertical circle ──
  s += caps(540, 54, 'Vertical circle', { anchor: 'middle', fill: C.sec });
  const cx = 540, cy = 204, R = 86;
  s += circle(cx, cy, R, C.hair, 1.6);
  s += dot(cx, cy, C.meta, 3.5);
  // top: both forces point down, toward the centre
  s += dot(cx, cy - R, C.orange, 9);
  s += varrow(cx - 13, cy - R, cx - 13, cy - R + 44, C.amber);
  s += txt(cx - 24, cy - R + 40, 'T', { size: 14, fill: C.amber, anchor: 'end' });
  s += varrow(cx + 13, cy - R, cx + 13, cy - R + 52, C.sec);
  s += txt(cx + 22, cy - R + 46, 'mg', { size: 14, fill: C.sec });
  s += txt(cx + R - 4, cy - R + 8, 'both inward', { size: 12, fill: C.meta });
  // bottom: tension up, weight down
  s += dot(cx, cy + R, C.orange, 9);
  s += varrow(cx - 13, cy + R, cx - 13, cy + R - 56, C.amber);
  s += txt(cx - 24, cy + R - 30, 'T', { size: 14, fill: C.amber, anchor: 'end' });
  s += varrow(cx + 13, cy + R, cx + 13, cy + R + 48, C.sec);
  s += txt(cx + 22, cy + R + 34, 'mg', { size: 14, fill: C.sec });
  // Both annotations sit to the RIGHT of the circle. On the left they ran back
  // across the panel divider at x = 360.
  s += txt(cx + R - 4, cy + R + 8, 'T opposes mg', { size: 12, fill: C.meta });
  s += txt(540, 380, 'T is zero at the top, 6mg at the bottom', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'A conical pendulum with its tension resolved into a vertical part balancing weight and a horizontal part turning the bob, beside a vertical circle where both forces point inward at the top');
};

// ═══════════════════════════════════════════════════════════════════════════
// p13 · ch4-banked-road
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-banked-road'] = () => {
  let s = '';
  s += caps(360, 52, 'Tilt the road, and N does the turning', { anchor: 'middle', fill: C.sec });

  const A = [110, 322], Bp = [418, 168];             // banked surface, tan θ = 0.5
  const th = Math.atan2(A[1] - Bp[1], Bp[0] - A[0]) * 180 / Math.PI;
  s += dash(A[0], A[1], Bp[0] + 10, A[1]);
  s += line(A[0], A[1], Bp[0], Bp[1], C.sec, 2.2);
  s += angleArc(A[0], A[1], 54, 0, th);
  s += txt(A[0] + 64, A[1] - 10, 'θ', { size: 14, fill: C.meta });

  const nx = -Math.sin(th * Math.PI / 180), ny = -Math.cos(th * Math.PI / 180); // outward normal, up-left
  const contact = [A[0] + (Bp[0] - A[0]) * 0.58, A[1] + (Bp[1] - A[1]) * 0.58];
  const cc = [contact[0] + nx * 18, contact[1] + ny * 18];
  s += box(cc[0], cc[1], 70, 32, { rot: -th });

  // normal force and its two components
  const tip = [cc[0] + nx * 96, cc[1] + ny * 96];
  s += varrow(cc[0], cc[1], tip[0], tip[1], C.amber, 1.8);
  s += txt(tip[0] - 10, tip[1] - 6, 'N', { size: 15, fill: C.amber, anchor: 'end' });
  s += dashPath(`M ${r(cc[0])} ${r(cc[1])} L ${r(cc[0])} ${r(tip[1])} L ${r(tip[0])} ${r(tip[1])}`, C.amber, 1.3);
  s += txt(cc[0] + 9, cc[1] - 54, 'N cos θ', { size: 12, fill: C.amber });
  s += txt(tip[0] + 32, tip[1] - 9, 'N sin θ', { size: 12, fill: C.amber, anchor: 'middle' });

  s += varrow(cc[0], cc[1], cc[0], cc[1] + 92, C.sec);
  s += txt(cc[0] + 11, cc[1] + 76, 'mg', { size: 14, fill: C.sec });

  s += arrow(150, 366, 74, 366, C.amber, 1.4, 'ar-a');
  s += txt(158, 371, 'toward the centre of the curve', { size: 12, fill: C.meta });

  // friction behaviour, stated on the right
  s += caps(474, 122, 'And with friction', { fill: C.sec });
  s += txt(474, 154, 'Below the design speed:', { size: 13, fill: C.body });
  s += txt(474, 176, 'friction acts UP the slope', { size: 13, fill: C.emerald });
  s += txt(474, 210, 'Above it:', { size: 13, fill: C.body });
  s += txt(474, 232, 'friction acts DOWN the slope', { size: 13, fill: C.emerald });
  s += txt(474, 266, 'At the design speed:', { size: 13, fill: C.body });
  s += txt(474, 288, 'friction is exactly zero', { size: 13, fill: C.meta });
  s += txt(474, 326, 'v = √( rg tan θ )', { size: 15, fill: C.amber });

  return svg(W, H, s, 'A car on a banked road in cross-section, with the normal force resolved into a vertical component balancing weight and a horizontal component pointing toward the centre of the curve');
};

// ═══════════════════════════════════════════════════════════════════════════
// p15 · ch4-ncert-exercise-figures — the position-time graph for Exercise 4.14
// ═══════════════════════════════════════════════════════════════════════════
F['ch4-ncert-exercise-figures'] = () => {
  let s = '';
  const oy = 300, zx = 230;                 // t = 0 at x = zx
  const sx = 60, sy = 50;                   // px per second / per metre
  const X = (t) => zx + t * sx, Y = (x) => oy - x * sy;

  s += caps(380, 58, 'NCERT Exercise 4.14 · position–time graph', { anchor: 'middle', fill: C.sec });

  s += arrow(120, oy, 648, oy, C.sec, 1.6, 'ar-w');
  s += arrow(zx, 322, zx, 108, C.sec, 1.6, 'ar-w');
  s += txt(656, oy + 6, 't (s)', { size: 13, fill: C.sec });
  s += txt(zx, 96, 'x (m)', { size: 13, fill: C.sec, anchor: 'middle' });
  s += txt(120, 122, 'm = 4 kg', { size: 12, fill: C.sec });

  s += dash(zx, Y(3), X(4), Y(3));
  s += dash(X(4), oy, X(4), Y(3));
  s += txt(zx - 9, oy + 20, '0', { size: 12, fill: C.meta, anchor: 'end' });
  s += txt(X(4), oy + 20, '4', { size: 12, fill: C.meta, anchor: 'middle' });
  s += txt(zx - 9, Y(3) + 5, '3', { size: 12, fill: C.meta, anchor: 'end' });

  s += path(`M 120 ${oy} L ${X(0)} ${oy} L ${X(4)} ${Y(3)} L 620 ${Y(3)}`, C.orange, 2.6);
  s += dot(X(0), oy, C.amber, 6);
  s += dot(X(4), Y(3), C.amber, 6);

  s += txt(150, oy - 14, 'v = 0', { size: 12, fill: C.meta });
  s += txt(372, 252, 'v = 0.75 m/s', { size: 12, fill: C.meta });
  s += txt(556, Y(3) + 26, 'v = 0', { size: 12, fill: C.meta });
  s += txt(238, oy + 40, 'impulse  +3 kg·m/s', { size: 12, fill: C.amber });
  s += txt(478, Y(3) - 22, 'impulse  −3 kg·m/s', { size: 12, fill: C.amber });

  s += txt(380, 380, 'Three straight segments, so zero force within each — the kinks carry the impulses.', { size: 12, fill: C.meta, anchor: 'middle' });

  return svg(W, H, s, 'The position-time graph for NCERT exercise 4.14: flat at zero, a straight rise to three metres at four seconds, then flat again');
};

module.exports = { FIGURES: F };
