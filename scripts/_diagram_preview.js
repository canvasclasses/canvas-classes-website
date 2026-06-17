// Throwaway preview renderer for diagram-editor shapes. Mimics Excalidraw's
// geometry (line points relative to x,y; rect/ellipse by bbox) → SVG → PNG via
// sharp, so the agent can VISUALLY check proportions before shipping a shape.
// Not used by the app. Run: node scripts/_diagram_preview.js
const fs = require('fs');
const sharp = require('sharp');

// ── helpers (mirror diagramShapes.ts) ──
const line = (x, y, points, extra = {}) => ({ type: 'line', x, y, points, ...extra });
const arrow = (x, y, points, extra = {}) => ({ type: 'arrow', x, y, points, ...extra });
const ellipse = (x, y, width, height) => ({ type: 'ellipse', x, y, width, height });
const rect = (x, y, width, height) => ({ type: 'rectangle', x, y, width, height });
const hatchedH = (x, y, width, dirY = 1, n = 7) => {
  const els = [line(x, y, [[0, 0], [width, 0]])];
  const step = width / (n - 1);
  for (let i = 0; i < n; i++) els.push(line(x + i * step, y, [[0, 0], [-9, 9 * dirY]]));
  return els;
};

// ── candidate shapes (FIXED versions to verify) ──
const setupPulleySpring = [
  ...hatchedH(40, 0, 80, -1, 7),
  line(80, 0, [[0, 0], [0, 46]]),
  ellipse(50, 46, 60, 60),
  ellipse(76, 72, 8, 8),
  line(110, 76, [[0, 0], [0, 46]]),
  ellipse(104, 122, 14, 14),
  line(50, 76, [[0, 0], [0, 40]]),
  line(50, 116, [[0, 0], [0, 8], [-14, 16], [14, 26], [-14, 36], [14, 46], [-14, 56], [14, 66], [0, 74], [0, 80]]),
  rect(28, 196, 44, 34),
  ...hatchedH(6, 230, 88, 1, 7),
];

const setupInclineString = [
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

// other 6 setups (current coords from diagramShapes.ts) — verify too
const setupTwoBlocks = [
  ...hatchedH(0, 0, 232, 1, 12), rect(52, -52, 60, 52), rect(112, -86, 74, 86),
  arrow(-26, -26, [[0, 0], [76, 0]]),
];
const setupThreeBlocks = [
  ...hatchedH(0, 0, 252, 1, 13), rect(48, -50, 54, 50), rect(102, -50, 54, 50),
  rect(156, -50, 54, 50), arrow(-26, -25, [[0, 0], [72, 0]]),
];
const setupAtwood = [
  ...hatchedH(40, 0, 80, -1, 7), line(80, 0, [[0, 0], [0, 40]]), ellipse(50, 40, 60, 60),
  ellipse(76, 66, 8, 8), line(50, 70, [[0, 0], [0, 92]]), line(110, 70, [[0, 0], [0, 92]]),
  rect(34, 162, 32, 32), rect(94, 162, 32, 32),
];
const setupPulleyForce = [
  ...hatchedH(40, 0, 80, -1, 7), line(80, 0, [[0, 0], [0, 40]]), ellipse(50, 40, 60, 60),
  ellipse(76, 66, 8, 8), line(50, 70, [[0, 0], [0, 92]]), rect(34, 162, 32, 32),
  line(110, 70, [[0, 0], [0, 80]]), arrow(110, 150, [[0, 0], [0, 46]]),
];
const setupTablePulley = [
  rect(0, 60, 182, 8), rect(34, 28, 44, 32), line(78, 44, [[0, 0], [136, 0]]),
  ellipse(206, 30, 28, 28), ellipse(216, 40, 8, 8),
  line(220, 58, [[0, 0], [-12, 24]]), ...hatchedH(196, 82, 24, 1, 4), // rod -> fixed mount
  line(234, 44, [[0, 0], [0, 70]]), rect(218, 114, 32, 32), arrow(244, 30, [[0, 0], [30, 0]]),
];
const setupInclinePulley = [
  line(0, 120, [[0, 0], [180, 0], [180, -110], [0, 0]]), ...hatchedH(-6, 120, 192, 1, 10),
  line(63, 81, [[0, 0], [42.7, -26.1], [25, -55.1], [-17.7, -29], [0, 0]]),
  line(106, 55, [[0, 0], [88, -43]]), ellipse(190, -10, 28, 28), ellipse(200, 0, 8, 8),
  line(204, 18, [[0, 0], [0, 60]]), rect(188, 78, 32, 32),
];

const SHAPES = [
  { name: 'two blocks + push', els: setupTwoBlocks },
  { name: 'three-block train', els: setupThreeBlocks },
  { name: 'Atwood', els: setupAtwood },
  { name: 'pulley + mass + pull', els: setupPulleyForce },
  { name: 'pulley+spring+block (FIXED)', els: setupPulleySpring },
  { name: 'table + edge pulley', els: setupTablePulley },
  { name: 'inclined string + pulley (FIXED)', els: setupInclineString },
  { name: 'block on incline + pulley', els: setupInclinePulley },
];

// ── render one shape's elements to absolute SVG primitives ──
function elemSvg(el, ox, oy) {
  const dash = el.strokeStyle === 'dashed' ? ' stroke-dasharray="6 5"' : '';
  const base = `fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;
  if (el.type === 'rectangle')
    return `<rect x="${ox + el.x}" y="${oy + el.y}" width="${el.width}" height="${el.height}" ${base}/>`;
  if (el.type === 'ellipse')
    return `<ellipse cx="${ox + el.x + el.width / 2}" cy="${oy + el.y + el.height / 2}" rx="${el.width / 2}" ry="${el.height / 2}" ${base}/>`;
  if (el.type === 'line' || el.type === 'arrow') {
    const pts = el.points.map((p) => `${ox + el.x + p[0]},${oy + el.y + p[1]}`).join(' ');
    let s = `<polyline points="${pts}" ${base}${dash}/>`;
    if (el.type === 'arrow') {
      const n = el.points.length;
      const a = el.points[n - 2], b = el.points[n - 1];
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const tipX = ox + el.x + b[0], tipY = oy + el.y + b[1];
      const h = 9;
      const l = [tipX - h * Math.cos(ang - 0.5), tipY - h * Math.sin(ang - 0.5)];
      const r = [tipX - h * Math.cos(ang + 0.5), tipY - h * Math.sin(ang + 0.5)];
      s += `<polyline points="${l[0]},${l[1]} ${tipX},${tipY} ${r[0]},${r[1]}" ${base}/>`;
    }
    return s;
  }
  return '';
}

function bbox(els) {
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  const add = (x, y) => { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); };
  for (const el of els) {
    if (el.type === 'rectangle' || el.type === 'ellipse') { add(el.x, el.y); add(el.x + el.width, el.y + el.height); }
    else if (el.points) for (const p of el.points) add(el.x + p[0], el.y + p[1]);
  }
  return { minX, minY, maxX, maxY };
}

// grid layout
const CELL_W = 380, CELL_H = 360, COLS = 2, PAD = 30;
const rows = Math.ceil(SHAPES.length / COLS);
let body = '';
SHAPES.forEach((shape, i) => {
  const col = i % COLS, row = Math.floor(i / COLS);
  const bb = bbox(shape.els);
  const w = bb.maxX - bb.minX, h = bb.maxY - bb.minY;
  const cellX = col * CELL_W, cellY = row * CELL_H;
  // center shape in cell with padding
  const ox = cellX + PAD - bb.minX + Math.max(0, (CELL_W - 2 * PAD - w) / 2);
  const oy = cellY + PAD - bb.minY + Math.max(0, (CELL_H - 2 * PAD - h) / 2);
  body += `<rect x="${cellX}" y="${cellY}" width="${CELL_W}" height="${CELL_H}" fill="none" stroke="#333"/>`;
  body += `<text x="${cellX + 10}" y="${cellY + 20}" fill="#888" font-size="13" font-family="sans-serif">${shape.name}</text>`;
  for (const el of shape.els) body += elemSvg(el, ox, oy);
});
const W = COLS * CELL_W, H = rows * CELL_H;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#0d0d0d"/>${body}</svg>`;

sharp(Buffer.from(svg)).png().toFile('/tmp/diagram_preview.png').then(() => {
  console.log('wrote /tmp/diagram_preview.png', W + 'x' + H);
}).catch((e) => { console.error(e); process.exit(1); });
