// Physics/math shape definitions for the Diagram Editor.
//
// Each shape is an array of Excalidraw element "skeletons" (simple specs that
// convertToExcalidrawElements expands into full elements). Authored around a
// local origin in px. ExcalidrawCanvas groups each shape and (a) preloads it
// into the library panel and (b) inserts it on one click from the side palette.
// Pure data + small geometry helpers — no Excalidraw import (loosely typed; cast
// at the convert call site).

type El = Record<string, unknown>;
export type ShapeCategory = 'Graphs & Math' | 'Mechanics' | 'Circuits' | 'Optics';
export interface DiagramShape {
  id: string;
  name: string;
  category: ShapeCategory;
  skeleton: El[];
}

// ── geometry helpers ───────────────────────────────────────────────────────
const line = (x: number, y: number, points: number[][], extra: El = {}): El => ({ type: 'line', x, y, points, ...extra });
const arrow = (x: number, y: number, points: number[][], extra: El = {}): El => ({ type: 'arrow', x, y, points, ...extra });
const ellipse = (x: number, y: number, width: number, height: number, extra: El = {}): El => ({ type: 'ellipse', x, y, width, height, ...extra });
const rect = (x: number, y: number, width: number, height: number, extra: El = {}): El => ({ type: 'rectangle', x, y, width, height, ...extra });
const text = (x: number, y: number, t: string, fontSize = 16): El => ({ type: 'text', x, y, text: t, fontSize });
const thin = { strokeWidth: 1 } as El;

// diagonal hatch ticks along a horizontal base; dirY +1 below, -1 above.
const hatchedH = (x: number, y: number, width: number, dirY = 1, n = 8): El[] => {
  const els: El[] = [line(x, y, [[0, 0], [width, 0]])];
  const step = width / (n - 1);
  for (let i = 0; i < n; i++) els.push(line(x + i * step, y, [[0, 0], [-9, 9 * dirY]]));
  return els;
};
// vertical hatched wall; dirX +1 hatches to the right, -1 to the left.
const hatchedV = (x: number, y: number, height: number, dirX = -1, n = 8): El[] => {
  const els: El[] = [line(x, y, [[0, 0], [0, height]])];
  const step = height / (n - 1);
  for (let i = 0; i < n; i++) els.push(line(x, y + i * step, [[0, 0], [9 * dirX, 9]]));
  return els;
};

// ── GRAPHS & MATH ────────────────────────────────────────────────────────────
const xyAxes: El[] = [arrow(0, 0, [[0, 0], [150, 0]]), arrow(0, 0, [[0, 0], [0, -120]]), text(-22, -126, 'y'), text(150, 6, 'x'), text(-20, 6, 'O')];
const xyFull: El[] = [
  arrow(0, 0, [[0, 0], [90, 0]]), arrow(0, 0, [[0, 0], [-90, 0]]),
  arrow(0, 0, [[0, 0], [0, -90]]), arrow(0, 0, [[0, 0], [0, 90]]),
  text(94, 6, 'x'), text(6, -104, 'y'),
];
const xyGrid: El[] = (() => {
  const els: El[] = [];
  for (let i = 1; i <= 5; i++) { els.push(line(i * 26, -132, [[0, 0], [0, 132]], thin)); els.push(line(0, -i * 26, [[0, 0], [132, 0]], thin)); }
  els.push(arrow(0, 0, [[0, 0], [140, 0]]), arrow(0, 0, [[0, 0], [0, -140]]), text(140, 6, 'x'), text(-20, -146, 'y'));
  return els;
})();
const numberLine: El[] = (() => {
  const els: El[] = [line(0, 0, [[0, 0], [180, 0]], { startArrowhead: 'arrow', endArrowhead: 'arrow' })];
  for (let i = 0; i <= 6; i++) els.push(line(15 + i * 25, -5, [[0, 0], [0, 10]]));
  return els;
})();
const pvAxes: El[] = [arrow(0, 0, [[0, 0], [150, 0]]), arrow(0, 0, [[0, 0], [0, -120]]), text(-20, -124, 'P'), text(150, 6, 'V')];
const vtAxes: El[] = [arrow(0, 0, [[0, 0], [150, 0]]), arrow(0, 0, [[0, 0], [0, -120]]), text(-20, -124, 'V'), text(150, 6, 'T')];
const ptAxes: El[] = [arrow(0, 0, [[0, 0], [150, 0]]), arrow(0, 0, [[0, 0], [0, -120]]), text(-20, -124, 'P'), text(150, 6, 'T')];
const pvCycle: El[] = [line(0, 0, [[0, 0], [90, -12], [104, -78], [14, -64], [0, 0]])];
const isotherm: El[] = [line(0, 0, [[0, -86], [16, -48], [38, -27], [66, -15], [104, -8], [140, -5]])];
const adiabat: El[] = [line(0, 0, [[0, -110], [10, -52], [26, -26], [52, -12], [92, -5], [140, -3]])];
const straightLine: El[] = [line(0, 0, [[0, 0], [140, -100]])];
const parabola: El[] = [line(0, 0, [[-70, -100], [-40, -34], [-18, -8], [0, 0], [18, -8], [40, -34], [70, -100]])];

// ── MECHANICS ────────────────────────────────────────────────────────────────
const pulleyFixed: El[] = [ellipse(0, 0, 60, 60), ellipse(26, 26, 8, 8), line(30, 0, [[0, 0], [0, -22]])];
const pulleyMovable: El[] = [ellipse(0, 0, 56, 56), ellipse(24, 24, 8, 8), line(28, 56, [[0, 0], [0, 18]]), line(20, 74, [[0, 0], [16, 0]])];
const block: El[] = [rect(0, 0, 72, 50), text(30, 16, 'm')];
const blocksStacked: El[] = [rect(0, 26, 80, 40), rect(14, 0, 52, 26)];
const wedge: El[] = [line(0, 0, [[0, 0], [130, 0], [0, -75], [0, 0]]), ...hatchedH(-6, 0, 142, 1, 9)];
const springH: El[] = [line(0, 0, [[0, 0], [12, 0], [18, -13], [30, 13], [42, -13], [54, 13], [66, -13], [78, 13], [84, 0], [96, 0]])];
const springV: El[] = [line(0, 0, [[0, 0], [0, 12], [-13, 18], [13, 30], [-13, 42], [13, 54], [-13, 66], [13, 78], [0, 84], [0, 96]])];
const forceArrow: El[] = [arrow(0, 0, [[0, 0], [90, 0]], { label: { text: 'F' } })];
const velocityArrow: El[] = [arrow(0, 0, [[0, 0], [90, 0]], { label: { text: 'v' } })];
const groundSupport: El[] = hatchedH(0, 0, 120, 1, 9);
const wall: El[] = hatchedV(0, 0, 110, -1, 9);
const hangingMass: El[] = [line(30, 0, [[0, 0], [0, 28]]), rect(8, 28, 44, 32), text(26, 38, 'm')];
const lever: El[] = [line(0, 0, [[0, 0], [130, 0]]), line(65, 0, [[0, 0], [-12, 20], [12, 20], [0, 0]])];
const inclinePlaneAngle: El[] = [line(0, 0, [[0, 0], [140, 0], [140, -78], [0, 0]]), ...hatchedH(-6, 0, 152, 1, 9), text(24, -10, 'θ')];

// ── CIRCUITS ───────────────────────────────────────────────────────────────
const resistorBox: El[] = [rect(22, 0, 56, 20), line(0, 10, [[0, 0], [22, 0]]), line(78, 10, [[0, 0], [22, 0]])];
const resistorZig: El[] = [line(0, 10, [[0, 0], [18, 0], [24, -10], [34, 10], [44, -10], [54, 10], [64, -10], [74, 10], [80, 0], [98, 0]])];
const capacitor: El[] = [line(34, -14, [[0, 0], [0, 28]]), line(46, -14, [[0, 0], [0, 28]]), line(0, 0, [[0, 0], [34, 0]]), line(46, 0, [[0, 0], [34, 0]])];
const cell: El[] = [line(34, -16, [[0, 0], [0, 32]]), line(44, -9, [[0, 0], [0, 18]]), line(0, 0, [[0, 0], [34, 0]]), line(44, 0, [[0, 0], [36, 0]])];
const battery: El[] = [line(26, -16, [[0, 0], [0, 32]]), line(36, -9, [[0, 0], [0, 18]]), line(48, -16, [[0, 0], [0, 32]]), line(58, -9, [[0, 0], [0, 18]]), line(0, 0, [[0, 0], [26, 0]]), line(58, 0, [[0, 0], [26, 0]])];
const bulb: El[] = [ellipse(22, -16, 32, 32), line(26, -12, [[0, 0], [24, 24]]), line(50, -12, [[0, 0], [-24, 24]]), line(0, 0, [[0, 0], [22, 0]]), line(54, 0, [[0, 0], [22, 0]])];
const switchOpen: El[] = [line(0, 12, [[0, 0], [22, 0]]), ellipse(20, 9, 6, 6), line(24, 12, [[0, 0], [28, -16]]), ellipse(50, 9, 6, 6), line(56, 12, [[0, 0], [22, 0]])];
const ammeter: El[] = [ellipse(20, -16, 34, 34), text(30, -10, 'A'), line(0, 1, [[0, 0], [20, 0]]), line(54, 1, [[0, 0], [20, 0]])];
const voltmeter: El[] = [ellipse(20, -16, 34, 34), text(30, -10, 'V'), line(0, 1, [[0, 0], [20, 0]]), line(54, 1, [[0, 0], [20, 0]])];
const galvanometer: El[] = [ellipse(20, -16, 34, 34), text(30, -10, 'G'), line(0, 1, [[0, 0], [20, 0]]), line(54, 1, [[0, 0], [20, 0]])];
const inductor: El[] = [line(0, 0, [[0, 0], [12, 0], [18, -12], [24, 0], [30, -12], [36, 0], [42, -12], [48, 0], [54, -12], [60, 0], [72, 0]])];
const junction: El[] = [line(0, 20, [[0, 0], [40, 0]]), line(20, 0, [[0, 0], [0, 40]]), ellipse(16, 16, 8, 8, { backgroundColor: '#000', fillStyle: 'solid' })];
const groundSym: El[] = [line(15, -16, [[0, 0], [0, 16]]), line(0, 0, [[0, 0], [30, 0]]), line(6, 6, [[0, 0], [18, 0]]), line(11, 12, [[0, 0], [8, 0]])];
const rheostat: El[] = [...resistorBox, arrow(28, -18, [[0, 0], [44, 14]])];

// ── OPTICS ───────────────────────────────────────────────────────────────────
const convexLens: El[] = [line(0, 0, [[0, 0], [0, 92]]), line(0, 0, [[-9, 9], [0, 0], [9, 9]]), line(0, 92, [[-9, -9], [0, 0], [9, -9]])];
const concaveLens: El[] = [line(0, 0, [[0, 0], [0, 92]]), line(0, 0, [[-9, -9], [0, 0], [9, -9]]), line(0, 92, [[-9, 9], [0, 0], [9, 9]])];
const planeMirror: El[] = [line(18, 0, [[0, 0], [0, 84]]), ...Array.from({ length: 7 }, (_, i) => line(18, i * 12, [[0, 0], [9, 9]]))];
const concaveMirror: El[] = [line(0, 0, [[0, 0], [8, 21], [12, 42], [8, 63], [0, 84]]), ...Array.from({ length: 5 }, (_, i) => line(0, 6 + i * 18, [[0, 0], [-9, 6]]))];
const convexMirror: El[] = [line(0, 0, [[0, 0], [-8, 21], [-12, 42], [-8, 63], [0, 84]]), ...Array.from({ length: 5 }, (_, i) => line(0, 6 + i * 18, [[0, 0], [9, 6]]))];
const principalAxis: El[] = [line(0, 0, [[0, 0], [180, 0]], { strokeStyle: 'dashed' })];
const objectArrow: El[] = [arrow(0, 50, [[0, 0], [0, -50]])];
const rayArrow: El[] = [arrow(0, 0, [[0, 0], [120, 0]])];
const prism: El[] = [line(0, 0, [[0, 0], [64, 0], [32, -56], [0, 0]])];
const eye: El[] = [line(0, 12, [[0, 0], [14, -12], [30, 0], [14, 12], [0, 0]]), ellipse(11, 4, 8, 8)];

// ── MECHANICS SETUPS (label-free full assemblies) ────────────────────────────
// Reusable scenes with NO text/values — annotate per question after dropping in.
// y grows downward (Excalidraw native): ceilings/tops at small y, hangs below.

// Two blocks side-by-side on ground, taller one on the right, horizontal push.
const setupTwoBlocks: El[] = [
  ...hatchedH(0, 0, 232, 1, 12),
  rect(52, -52, 60, 52),
  rect(112, -86, 74, 86),
  arrow(-26, -26, [[0, 0], [76, 0]]),
];

// Three equal blocks in a row (a "train") on ground with a horizontal push.
const setupThreeBlocks: El[] = [
  ...hatchedH(0, 0, 252, 1, 13),
  rect(48, -50, 54, 50),
  rect(102, -50, 54, 50),
  rect(156, -50, 54, 50),
  arrow(-26, -25, [[0, 0], [72, 0]]),
];

// Atwood machine: fixed pulley on a ceiling, a mass on each string.
const setupAtwood: El[] = [
  ...hatchedH(40, 0, 80, -1, 7),
  line(80, 0, [[0, 0], [0, 40]]),
  ellipse(50, 40, 60, 60),
  ellipse(76, 66, 8, 8),
  line(50, 70, [[0, 0], [0, 92]]),
  line(110, 70, [[0, 0], [0, 92]]),
  rect(34, 162, 32, 32),
  rect(94, 162, 32, 32),
];

// Fixed pulley: a mass on one string, a downward pull (arrow) on the other.
const setupPulleyForce: El[] = [
  ...hatchedH(40, 0, 80, -1, 7),
  line(80, 0, [[0, 0], [0, 40]]),
  ellipse(50, 40, 60, 60),
  ellipse(76, 66, 8, 8),
  line(50, 70, [[0, 0], [0, 92]]),
  rect(34, 162, 32, 32),
  line(110, 70, [[0, 0], [0, 80]]),
  arrow(110, 150, [[0, 0], [0, 46]]),
];

// Fixed pulley: a ring on one side; a spring to a block on the ground on the other.
const setupPulleySpring: El[] = [
  ...hatchedH(40, 0, 80, -1, 7),
  line(80, 0, [[0, 0], [0, 46]]),
  ellipse(50, 46, 60, 60),
  ellipse(76, 72, 8, 8),
  line(110, 76, [[0, 0], [0, 46]]),
  ellipse(104, 122, 14, 14),
  line(50, 76, [[0, 0], [0, 40]]),
  line(50, 116, [
    [0, 0], [0, 8], [-14, 16], [14, 26], [-14, 36], [14, 46],
    [-14, 56], [14, 66], [0, 74], [0, 80],
  ]),
  rect(28, 196, 44, 34),
  ...hatchedH(6, 230, 88, 1, 7),
];

// Block on a table, string over a pulley at the edge, hanging mass.
const setupTablePulley: El[] = [
  rect(0, 60, 182, 8),
  rect(34, 28, 44, 32),
  line(78, 44, [[0, 0], [136, 0]]),
  ellipse(206, 30, 28, 28),
  ellipse(216, 40, 8, 8),
  line(220, 58, [[0, 0], [-12, 24]]),
  ...hatchedH(196, 82, 24, 1, 4),
  line(234, 44, [[0, 0], [0, 70]]),
  rect(218, 114, 32, 32),
  arrow(244, 30, [[0, 0], [30, 0]]),
];

// Block on ground, inclined string over a wall-mounted pulley, hanging mass.
const setupInclineString: El[] = [
  ...hatchedH(0, 120, 120, 1, 7),
  rect(20, 88, 44, 32),
  line(64, 104, [[0, 0], [150, 0]], { strokeStyle: 'dashed' }),
  line(64, 104, [[0, 0], [142, -72]]),
  ellipse(204, 4, 32, 32),
  ellipse(216, 16, 8, 8),
  line(206, 12, [[0, 0], [-22, -14]]),
  ...hatchedH(170, -2, 30, -1, 5),
  line(220, 36, [[0, 0], [0, 72]]),
  rect(204, 108, 32, 32),
  arrow(250, 108, [[0, 0], [0, 36]]),
  line(64, 104, [[24, 0], [23, -7], [20, -13]]),
];

// Block resting on an incline, string up to a pulley at the apex, hanging mass.
const setupInclinePulley: El[] = [
  line(0, 120, [[0, 0], [180, 0], [180, -110], [0, 0]]),
  ...hatchedH(-6, 120, 192, 1, 10),
  line(63, 81, [[0, 0], [42.7, -26.1], [25, -55.1], [-17.7, -29], [0, 0]]),
  line(106, 55, [[0, 0], [88, -43]]),
  ellipse(190, -10, 28, 28),
  ellipse(200, 0, 8, 8),
  line(204, 18, [[0, 0], [0, 60]]),
  rect(188, 78, 32, 32),
];

// ── registry ─────────────────────────────────────────────────────────────────
export const DIAGRAM_SHAPES: DiagramShape[] = [
  // Graphs & Math
  { id: 'gr-xy', name: 'X–Y axes', category: 'Graphs & Math', skeleton: xyAxes },
  { id: 'gr-xy-full', name: 'X–Y (4 quadrant)', category: 'Graphs & Math', skeleton: xyFull },
  { id: 'gr-xy-grid', name: 'X–Y with grid', category: 'Graphs & Math', skeleton: xyGrid },
  { id: 'gr-numberline', name: 'Number line', category: 'Graphs & Math', skeleton: numberLine },
  { id: 'gr-straight', name: 'Straight-line graph', category: 'Graphs & Math', skeleton: straightLine },
  { id: 'gr-parabola', name: 'Parabola', category: 'Graphs & Math', skeleton: parabola },
  { id: 'gr-pv', name: 'P–V axes', category: 'Graphs & Math', skeleton: pvAxes },
  { id: 'gr-vt', name: 'V–T axes', category: 'Graphs & Math', skeleton: vtAxes },
  { id: 'gr-pt', name: 'P–T axes', category: 'Graphs & Math', skeleton: ptAxes },
  { id: 'gr-pv-cycle', name: 'P–V cycle', category: 'Graphs & Math', skeleton: pvCycle },
  { id: 'gr-isotherm', name: 'Isotherm', category: 'Graphs & Math', skeleton: isotherm },
  { id: 'gr-adiabat', name: 'Adiabat', category: 'Graphs & Math', skeleton: adiabat },

  // Mechanics
  { id: 'm-pulley', name: 'Pulley (fixed)', category: 'Mechanics', skeleton: pulleyFixed },
  { id: 'm-pulley-mov', name: 'Pulley (movable)', category: 'Mechanics', skeleton: pulleyMovable },
  { id: 'm-block', name: 'Block (mass)', category: 'Mechanics', skeleton: block },
  { id: 'm-blocks', name: 'Stacked blocks', category: 'Mechanics', skeleton: blocksStacked },
  { id: 'm-wedge', name: 'Wedge / incline', category: 'Mechanics', skeleton: wedge },
  { id: 'm-incline-angle', name: 'Incline (θ)', category: 'Mechanics', skeleton: inclinePlaneAngle },
  { id: 'm-spring-h', name: 'Spring (horizontal)', category: 'Mechanics', skeleton: springH },
  { id: 'm-spring-v', name: 'Spring (vertical)', category: 'Mechanics', skeleton: springV },
  { id: 'm-force', name: 'Force vector (F)', category: 'Mechanics', skeleton: forceArrow },
  { id: 'm-velocity', name: 'Velocity vector (v)', category: 'Mechanics', skeleton: velocityArrow },
  { id: 'm-ground', name: 'Ground / support', category: 'Mechanics', skeleton: groundSupport },
  { id: 'm-wall', name: 'Wall', category: 'Mechanics', skeleton: wall },
  { id: 'm-hanging', name: 'Hanging mass', category: 'Mechanics', skeleton: hangingMass },
  { id: 'm-lever', name: 'Lever / pivot', category: 'Mechanics', skeleton: lever },

  // Circuits
  { id: 'c-resistor', name: 'Resistor (box)', category: 'Circuits', skeleton: resistorBox },
  { id: 'c-resistor-z', name: 'Resistor (zigzag)', category: 'Circuits', skeleton: resistorZig },
  { id: 'c-capacitor', name: 'Capacitor', category: 'Circuits', skeleton: capacitor },
  { id: 'c-cell', name: 'Cell', category: 'Circuits', skeleton: cell },
  { id: 'c-battery', name: 'Battery', category: 'Circuits', skeleton: battery },
  { id: 'c-bulb', name: 'Bulb / lamp', category: 'Circuits', skeleton: bulb },
  { id: 'c-switch', name: 'Switch (open)', category: 'Circuits', skeleton: switchOpen },
  { id: 'c-ammeter', name: 'Ammeter (A)', category: 'Circuits', skeleton: ammeter },
  { id: 'c-voltmeter', name: 'Voltmeter (V)', category: 'Circuits', skeleton: voltmeter },
  { id: 'c-galvanometer', name: 'Galvanometer (G)', category: 'Circuits', skeleton: galvanometer },
  { id: 'c-inductor', name: 'Inductor', category: 'Circuits', skeleton: inductor },
  { id: 'c-junction', name: 'Junction', category: 'Circuits', skeleton: junction },
  { id: 'c-ground', name: 'Ground symbol', category: 'Circuits', skeleton: groundSym },
  { id: 'c-rheostat', name: 'Rheostat', category: 'Circuits', skeleton: rheostat },

  // Optics
  { id: 'o-convex-lens', name: 'Convex lens', category: 'Optics', skeleton: convexLens },
  { id: 'o-concave-lens', name: 'Concave lens', category: 'Optics', skeleton: concaveLens },
  { id: 'o-plane-mirror', name: 'Plane mirror', category: 'Optics', skeleton: planeMirror },
  { id: 'o-concave-mirror', name: 'Concave mirror', category: 'Optics', skeleton: concaveMirror },
  { id: 'o-convex-mirror', name: 'Convex mirror', category: 'Optics', skeleton: convexMirror },
  { id: 'o-axis', name: 'Principal axis', category: 'Optics', skeleton: principalAxis },
  { id: 'o-object', name: 'Object arrow', category: 'Optics', skeleton: objectArrow },
  { id: 'o-ray', name: 'Ray', category: 'Optics', skeleton: rayArrow },
  { id: 'o-prism', name: 'Prism', category: 'Optics', skeleton: prism },
  { id: 'o-eye', name: 'Eye', category: 'Optics', skeleton: eye },

  // Mechanics setups (full label-free scenes)
  { id: 's-two-blocks', name: 'Setup: two blocks + push', category: 'Mechanics', skeleton: setupTwoBlocks },
  { id: 's-three-blocks', name: 'Setup: three-block train', category: 'Mechanics', skeleton: setupThreeBlocks },
  { id: 's-atwood', name: 'Setup: Atwood (2 masses)', category: 'Mechanics', skeleton: setupAtwood },
  { id: 's-pulley-force', name: 'Setup: pulley + mass + pull', category: 'Mechanics', skeleton: setupPulleyForce },
  { id: 's-pulley-spring', name: 'Setup: pulley + spring + block', category: 'Mechanics', skeleton: setupPulleySpring },
  { id: 's-table-pulley', name: 'Setup: table + edge pulley + mass', category: 'Mechanics', skeleton: setupTablePulley },
  { id: 's-incline-string', name: 'Setup: inclined string + pulley', category: 'Mechanics', skeleton: setupInclineString },
  { id: 's-incline-pulley', name: 'Setup: block on incline + pulley', category: 'Mechanics', skeleton: setupInclinePulley },
];

export const SHAPE_CATEGORIES: ShapeCategory[] = ['Graphs & Math', 'Mechanics', 'Circuits', 'Optics'];
