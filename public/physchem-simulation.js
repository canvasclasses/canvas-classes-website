/* ════════════════════════════════════════════════════
   PHYSICAL CHEMISTRY HUB — Simulation Logic
   All Chart.js charts + Canvas animations + Quiz logic
════════════════════════════════════════════════════ */

const RC = 0.08206; // L·atm·mol⁻¹·K⁻¹
function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
function setUI(prefix, k, val, dp = 2) {
  const valEl  = document.getElementById(`${prefix}-val-${k}`);
  const slEl   = document.getElementById(`${prefix}-sl-${k}`);
  if (valEl) valEl.textContent = val.toFixed(dp);
  if (slEl)  slEl.value = val;
}

/* ════ STATE ════ */
const ig = { P: 2.45, V: 10.0, n: 1.0, T: 298, solveFor: 'P' };
const bl = { P: 2.45,  V: 10.0, T: 298 };
const cl = { V: 12.2, T: 298,  P: 2.0 };
const df = { P: 5.0, T: 300, M: 32, A: 20, mode: 'effusion', escaped: 0 };

const blK = () => RC * bl.T;
const clK = () => RC / cl.P;

/* ════ CHART REFS ════ */
let chartPV, chartZ;
let chartBoyleFamily, chartBoyleInv, chartBoylePvp;
let chartCharlesVtc, chartCharlesVt, chartCharlesLog;
let dfBaseRate = 0;

const CHART_DEFAULTS = {
  color: '#d6e0f5',
  gridColor: 'rgba(255,255,255,0.06)',
  tickColor: '#9ca3af',
  font: { family: 'Inter', size: 13 }
};

function axisDefaults(label) {
  return {
    ticks: { color: CHART_DEFAULTS.tickColor, font: CHART_DEFAULTS.font },
    grid: { color: CHART_DEFAULTS.gridColor, lineWidth: 1 },
    border: { display: true, color: '#4b5563', width: 1.5 },
    title: { display: !!label, text: label, color: '#d1d5db', font: { family: 'Inter', size: 13, weight: '600' } }
  };
}

/* ════════════════════════════════════════════════════
   INIT ALL CHARTS
════════════════════════════════════════════════════ */
function initCharts() {
  /* ── TAB 1: P vs V ── */
  const ctxPV = document.getElementById('chart-pv');
  if (ctxPV) {
    chartPV = new Chart(ctxPV, {
      type: 'line',
      data: { datasets: [
        { label: 'Isotherm', data: [], borderColor: '#2dd4bf', borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false },
        { label: 'Current State', data: [], backgroundColor: '#fbbf24', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('V (L)'), type: 'linear', min: 0, max: 22 }, y: { ...axisDefaults('P (atm)'), min: 0, max: 12 } },
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `P=${ctx.parsed.y.toFixed(2)}, V=${ctx.parsed.x.toFixed(1)}` } } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 1: Z vs P ── */
  const ctxZ = document.getElementById('chart-z');
  if (ctxZ) {
    chartZ = new Chart(ctxZ, {
      type: 'line',
      data: { datasets: [
        { label: 'Ideal (Z=1)', data: [{x:0,y:1},{x:10,y:1}], borderColor: '#374151', borderWidth: 1.5, pointRadius: 0, borderDash: [5,5] },
        { label: 'Real Gas', data: [], borderColor: '#8b5cf6', borderWidth: 2, pointRadius: 0, tension: 0.4, fill: false },
        { label: 'Current', data: [], backgroundColor: '#fbbf24', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('P (atm)'), type: 'linear', min: 0, max: 10 }, y: { ...axisDefaults('Z'), min: 0.4, max: 1.4 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 2: BOYLE FAMILY ── */
  const ctxBF = document.getElementById('chart-boyle-family');
  if (ctxBF) {
    chartBoyleFamily = new Chart(ctxBF, {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('V (L)'), type: 'linear', min: 0, max: 22 }, y: { ...axisDefaults('P (atm)'), min: 0, max: 12 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 2: P vs 1/V ── */
  const ctxBI = document.getElementById('chart-boyle-inv');
  if (ctxBI) {
    chartBoyleInv = new Chart(ctxBI, {
      type: 'line',
      data: { datasets: [
        { label: 'P vs 1/V', data: [], borderColor: '#2dd4bf', borderWidth: 2, pointRadius: 0 },
        { label: 'Current', data: [], backgroundColor: '#fbbf24', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('1/V'), type: 'linear', min: 0, max: 1.1 }, y: { ...axisDefaults('P (atm)'), min: 0 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 2: PV vs P ── */
  const ctxBPVP = document.getElementById('chart-boyle-pvp');
  if (ctxBPVP) {
    chartBoylePvp = new Chart(ctxBPVP, {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('P (atm)'), type: 'linear', min: 0, max: 11 }, y: { ...axisDefaults('PV (L·atm)'), min: 0, max: 70 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 2: Static Reference — P vs 1/V (multiple isotherms) ── */
  const ctxStatInv = document.getElementById('static-boyle-inv');
  if (ctxStatInv) {
    const d1 = [], d2 = [], d3 = [];
    for (let iv = 0.02; iv <= 1; iv += 0.02) { d1.push({x:iv,y:5*iv}); d2.push({x:iv,y:15*iv}); d3.push({x:iv,y:30*iv}); }
    new Chart(ctxStatInv, {
      type: 'line',
      data: { datasets: [
        { label: 'T₃', data: d3, borderColor: '#fbbf24', borderWidth: 2, pointRadius: 0, tension: 0 },
        { label: 'T₂', data: d2, borderColor: '#8b5cf6', borderWidth: 2, pointRadius: 0, tension: 0 },
        { label: 'T₁', data: d1, borderColor: '#3ecfcf', borderWidth: 2, pointRadius: 0, tension: 0 }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('1/V'), type: 'linear', min: 0, max: 1 }, y: { ...axisDefaults('P'), min: 0, max: 10 } },
        plugins: { legend: { labels: { color: '#9eb1d1', font: { size: 11 } } } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 2: Static Reference — P vs V (multiple isotherms) ── */
  const ctxStatPV = document.getElementById('static-boyle-pv');
  if (ctxStatPV) {
    const dPv1 = [], dPv2 = [], dPv3 = [];
    for (let v = 0.5; v <= 10; v += 0.25) { dPv1.push({x:v,y:5/v}); dPv2.push({x:v,y:15/v}); dPv3.push({x:v,y:30/v}); }
    new Chart(ctxStatPV, {
      type: 'line',
      data: { datasets: [
        { label: 'T₃', data: dPv3, borderColor: '#fbbf24', borderWidth: 2, pointRadius: 0, tension: 0.4 },
        { label: 'T₂', data: dPv2, borderColor: '#8b5cf6', borderWidth: 2, pointRadius: 0, tension: 0.4 },
        { label: 'T₁', data: dPv1, borderColor: '#3ecfcf', borderWidth: 2, pointRadius: 0, tension: 0.4 }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('V'), type: 'linear', min: 0, max: 10 }, y: { ...axisDefaults('P'), min: 0, max: 10 } },
        plugins: { legend: { labels: { color: '#9eb1d1', font: { size: 11 } } } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 3: V vs T (Celsius) ── */
  const ctxCVTC = document.getElementById('chart-charles-vtc');
  if (ctxCVTC) {
    chartCharlesVtc = new Chart(ctxCVTC, {
      type: 'line',
      data: { datasets: [] },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('T (°C)'), type: 'linear', min: -300, max: 650 }, y: { ...axisDefaults('V (L)'), min: 0, max: 60 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 3: V vs T (Kelvin) ── */
  const ctxCVT = document.getElementById('chart-charles-vt');
  if (ctxCVT) {
    chartCharlesVt = new Chart(ctxCVT, {
      type: 'line',
      data: { datasets: [
        { label: 'V/T = k', data: [], borderColor: '#8b5cf6', borderWidth: 2, pointRadius: 0 },
        { label: 'Current', data: [], backgroundColor: '#fbbf24', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('T (K)'), type: 'linear', min: 0, max: 1050 }, y: { ...axisDefaults('V (L)'), min: 0 } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  /* ── TAB 3: log V vs log T ── */
  const ctxCLog = document.getElementById('chart-charles-log');
  if (ctxCLog) {
    chartCharlesLog = new Chart(ctxCLog, {
      type: 'line',
      data: { datasets: [
        { label: 'log V vs log T', data: [], borderColor: '#3b82f6', borderWidth: 2, pointRadius: 0 },
        { label: 'Current', data: [], backgroundColor: '#fbbf24', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' }
      ]},
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { x: { ...axisDefaults('log T'), type: 'linear', min: 1.5, max: 3.5 }, y: { ...axisDefaults('log V') } },
        plugins: { legend: { display: false } },
        animation: { duration: 0 }
      }
    });
  }

  // Initial chart data fill
  updateCharts();
  updateBoyleCharts();
  updateCharlesCharts();
}

/* ════════════════════════════════════════════════════
   CHART UPDATE FUNCTIONS
════════════════════════════════════════════════════ */
function updateCharts() {
  if (!chartPV) return;
  const pvData = [];
  const k = ig.n * RC * ig.T;
  for (let v = 0.5; v <= 22; v += 0.5) pvData.push({ x: v, y: k / v });
  chartPV.data.datasets[0].data = pvData;
  chartPV.data.datasets[1].data = [{ x: ig.V, y: ig.P }];
  chartPV.update();

  if (!chartZ) return;
  const zData = [];
  for (let p = 0; p <= 10; p += 0.5) zData.push({ x: p, y: 1 - 0.05 * p + 0.01 * p * p });
  chartZ.data.datasets[1].data = zData;
  chartZ.data.datasets[2].data = [{ x: ig.P, y: 1 }];
  chartZ.update();
}

function updateBoyleCharts() {
  if (!chartBoyleFamily) return;
  const temps = [200, 298, 400, 600, 800];
  const datasets = [];
  temps.forEach(T => {
    const isCurrent = Math.abs(T - bl.T) < 5;
    const data = [];
    const k = RC * T;
    for (let v = 0.5; v <= 22; v += 0.5) data.push({ x: v, y: k / v });
    datasets.push({ label: `${T}K`, data, borderColor: isCurrent ? '#fbbf24' : '#374151', borderWidth: isCurrent ? 3 : 1.5, pointRadius: 0, tension: 0.4 });
  });
  datasets.push({ label: 'Current', data: [{ x: bl.V, y: bl.P }], backgroundColor: '#2dd4bf', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' });
  chartBoyleFamily.data.datasets = datasets;
  chartBoyleFamily.update();

  const kC = blK();
  chartBoyleInv.data.datasets[0].data = [{ x: 0, y: 0 }, { x: 1.0, y: kC }];
  chartBoyleInv.data.datasets[1].data = [{ x: 1 / bl.V, y: bl.P }];
  chartBoyleInv.update();

  const pvpDs = [];
  temps.forEach(T => {
    const isCurrent = Math.abs(T - bl.T) < 5;
    const k = RC * T;
    pvpDs.push({ label: `${T}K`, data: [{ x: 0, y: k }, { x: 10, y: k }], borderColor: isCurrent ? '#fbbf24' : '#374151', borderWidth: isCurrent ? 2.5 : 1, pointRadius: 0 });
  });
  pvpDs.push({ label: 'Current', data: [{ x: bl.P, y: bl.P * bl.V }], backgroundColor: '#2dd4bf', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' });
  chartBoylePvp.data.datasets = pvpDs;
  chartBoylePvp.update();
}

function updateCharlesCharts() {
  if (!chartCharlesVtc) return;
  const pressures = [0.5, 1.0, 2.0, 4.0];
  const colors = ['#3ecfcf', '#fbbf24', '#8b5cf6', '#f43f5e'];
  const datasets = [];
  pressures.forEach((P, i) => {
    const isCurrent = Math.abs(P - cl.P) < 0.1;
    const k = RC / P;
    const dataDash = [], dataSolid = [];
    for (let tc = -273.15; tc <= 0; tc += 25) dataDash.push({ x: tc, y: k * (tc + 273.15) });
    for (let tc = 0; tc <= 600; tc += 25) dataSolid.push({ x: tc, y: k * (tc + 273.15) });
    datasets.push({ label: `${P}atm`, data: dataDash, borderColor: isCurrent ? colors[i] : '#374151', borderWidth: isCurrent ? 3 : 1.5, borderDash: [5, 5], pointRadius: 0 });
    datasets.push({ label: `${P}atm`, data: dataSolid, borderColor: isCurrent ? colors[i] : '#374151', borderWidth: isCurrent ? 3 : 1.5, pointRadius: 0 });
  });
  datasets.push({ label: 'Current', data: [{ x: cl.T - 273.15, y: cl.V }], backgroundColor: '#2dd4bf', borderColor: '#fff', borderWidth: 2, pointRadius: 6, type: 'scatter' });
  chartCharlesVtc.data.datasets = datasets;
  chartCharlesVtc.update();

  const kC = clK();
  chartCharlesVt.data.datasets[0].data = [{ x: 0, y: 0 }, { x: 1000, y: kC * 1000 }];
  chartCharlesVt.data.datasets[1].data = [{ x: cl.T, y: cl.V }];
  chartCharlesVt.update();

  const logK = Math.log10(kC);
  const logLine = [];
  for (let logT = 1.5; logT <= 3.5; logT += 0.1) logLine.push({ x: logT, y: logT + logK });
  chartCharlesLog.data.datasets[0].data = logLine;
  chartCharlesLog.data.datasets[1].data = [{ x: Math.log10(cl.T), y: Math.log10(cl.V) }];
  chartCharlesLog.update();
}

/* ════════════════════════════════════════════════════
   GAS CHAMBER CANVAS (TAB 1)
════════════════════════════════════════════════════ */
const GC = { canvas: null, ctx: null, CX: 250, CW: 110, RH: 16, TOP: 20, BOT: 230, FULL: 210, mols: [], animId: null };

function gcInit() {
  GC.canvas = document.getElementById('gasCanvas');
  if (!GC.canvas) return;
  GC.ctx = GC.canvas.getContext('2d');
  gcInitMols();
  gcAnimate();
}

function gcPistonY() { return GC.BOT - clamp((ig.V - 1) / 19, 0.05, 0.95) * GC.FULL; }
function gcSpeed()   { return Math.max(0.5, 0.8 + (ig.T / 300) * 1.5 / Math.max(0.4, Math.sqrt(ig.P))); }
function gcTFrac()   { return clamp((ig.T - 100) / 900, 0, 1); }

function gcMolColor(f) {
  if (f < 0.33) return { r: 59, g: 130, b: 246 };
  if (f < 0.66) return { r: 45, g: 212, b: 191 };
  return { r: 244, g: 63, b: 94 };
}

function gcMakeMol(py) {
  const gasH = GC.BOT - py, spd = gcSpeed(), a = Math.random() * Math.PI * 2;
  return {
    x: GC.CX + (Math.random() * 2 - 1) * (GC.CW - 12) * 0.85,
    y: py + 10 + Math.random() * (gasH - 20),
    z: Math.random() * 2 - 1,
    r: 5 + Math.random() * 3,
    vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
    tf: gcTFrac() + (Math.random() - 0.5) * 0.1
  };
}

function gcInitMols() {
  const py = gcPistonY(), cnt = Math.max(6, Math.min(80, Math.round(ig.n * 14)));
  GC.mols = [];
  for (let i = 0; i < cnt; i++) GC.mols.push(gcMakeMol(py));
}

function gcDrawEllipse(cx, cy, rx, ry, fill, stroke, sw) {
  const c = GC.ctx; c.save(); c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = sw || 1.5; c.stroke(); }
  c.restore();
}

function gcAnimate() {
  const c = GC.ctx, W = GC.canvas.width, H = GC.canvas.height;
  const py = gcPistonY(), gL = GC.CX - GC.CW + 4, gR = GC.CX + GC.CW - 4, spd = gcSpeed(), tf = gcTFrac();
  const tgt = Math.max(6, Math.min(80, Math.round(ig.n * 14)));
  while (GC.mols.length < tgt) GC.mols.push(gcMakeMol(py));
  while (GC.mols.length > tgt) GC.mols.pop();

  GC.mols.forEach(m => {
    m.tf += (tf - m.tf) * 0.03;
    const cs = Math.hypot(m.vx, m.vy);
    if (cs > 0.01) { m.vx = m.vx / cs * spd; m.vy = m.vy / cs * spd; }
    m.x += m.vx; m.y += m.vy;
    if (m.x - m.r < gL) { m.x = gL + m.r; m.vx = Math.abs(m.vx); }
    if (m.x + m.r > gR) { m.x = gR - m.r; m.vx = -Math.abs(m.vx); }
    if (m.y - m.r < py) { m.y = py + m.r; m.vy = Math.abs(m.vy); }
    if (m.y + m.r > GC.BOT) { m.y = GC.BOT - m.r; m.vy = -Math.abs(m.vy); }
  });
  GC.mols.sort((a, b) => a.z - b.z);

  c.clearRect(0, 0, W, H);
  c.fillStyle = 'rgba(17,24,39,0.6)'; c.fillRect(GC.CX - GC.CW, GC.TOP, GC.CW * 2, GC.BOT - GC.TOP);

  const gasH = GC.BOT - py, col = gcMolColor(tf);
  c.save(); c.beginPath(); c.rect(GC.CX - GC.CW, py, GC.CW * 2, gasH); c.clip();
  const gfg = c.createLinearGradient(GC.CX, py, GC.CX, GC.BOT);
  gfg.addColorStop(0, `rgba(${col.r},${col.g},${col.b},0.05)`);
  gfg.addColorStop(1, `rgba(${col.r},${col.g},${col.b},0.15)`);
  c.fillStyle = gfg; c.fillRect(GC.CX - GC.CW, py, GC.CW * 2, gasH); c.restore();

  c.strokeStyle = '#374151'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(GC.CX - GC.CW, GC.TOP); c.lineTo(GC.CX - GC.CW, GC.BOT); c.stroke();
  c.beginPath(); c.moveTo(GC.CX + GC.CW, GC.TOP); c.lineTo(GC.CX + GC.CW, GC.BOT); c.stroke();
  gcDrawEllipse(GC.CX, GC.BOT, GC.CW, GC.RH / 2, '#1f2937', '#374151', 2);

  GC.mols.forEach(m => {
    const mc = gcMolColor(m.tf);
    c.beginPath(); c.arc(m.x, m.y, m.r, 0, Math.PI * 2); c.fillStyle = `rgb(${mc.r},${mc.g},${mc.b})`; c.fill();
    c.beginPath(); c.arc(m.x - m.r * 0.3, m.y - m.r * 0.3, m.r * 0.3, 0, Math.PI * 2); c.fillStyle = 'rgba(255,255,255,0.4)'; c.fill();
  });

  gcDrawEllipse(GC.CX, py, GC.CW, GC.RH / 2, '#4b5563', '#9ca3af', 2);
  c.fillStyle = '#6b7280'; c.fillRect(GC.CX - 5, Math.max(5, py - 100), 10, py - Math.max(5, py - 100));
  gcDrawEllipse(GC.CX, GC.TOP, GC.CW, GC.RH / 2, null, '#374151', 2);

  GC.animId = requestAnimationFrame(gcAnimate);
  window._gcAnimId = GC.animId;
}

/* ════════════════════════════════════════════════════
   DIFFUSION CANVAS (TAB 4)
════════════════════════════════════════════════════ */
const DC = { canvas: null, ctx: null, W: 500, H: 260, mols1: [], mols2: [], animId: null };

function dcInit() {
  DC.canvas = document.getElementById('diffCanvas');
  if (!DC.canvas) return;
  DC.ctx = DC.canvas.getContext('2d');
  dfBaseRate = (5.0 * 20) / Math.sqrt(300 * 32);
  dfInitMols();
  dfUpdateUI();
  dcAnimate();
}

function dcMakeMol(isGas1, forceX) {
  const mass = isGas1 ? df.M : 32;
  const speed = 1.5 * Math.sqrt(df.T / 300) * Math.sqrt(32 / mass);
  const a = Math.random() * Math.PI * 2;
  const r = Math.max(2, 3 + Math.pow(mass, 1 / 3) * 1.2);
  let xPos;
  if (forceX !== undefined) { xPos = forceX; }
  else { xPos = isGas1 ? r + Math.random() * (DC.W / 2 - 10 - 2 * r) : DC.W / 2 + 10 + Math.random() * (DC.W / 2 - 10 - 2 * r); }
  return { x: xPos, y: r + Math.random() * (DC.H - 2 * r), vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, r, isGas1, trail: [] };
}

function dfInitMols() {
  df.escaped = 0;
  const escaped = document.getElementById('df-escaped');
  if (escaped) escaped.textContent = '0';
  const count1 = Math.floor(df.P * 20);
  DC.mols1 = [];
  for (let i = 0; i < count1; i++) DC.mols1.push(dcMakeMol(true));
  DC.mols2 = [];
  if (df.mode === 'diffusion') {
    for (let i = 0; i < 100; i++) DC.mols2.push(dcMakeMol(false));
  }
}

function dfUpdateUI() {
  setUI('d', 'P', df.P, 1); setUI('d', 'T', df.T, 0); setUI('d', 'M', df.M, 0); setUI('d', 'A', df.A, 0);
  const rate = (df.P * df.A) / Math.sqrt(df.T * df.M);
  if (dfBaseRate === 0) dfBaseRate = rate;
  const rel = document.getElementById('d-live-rate');
  if (rel) rel.textContent = (rate / dfBaseRate).toFixed(2) + 'x';
}

function dcAnimate() {
  if (!DC.canvas) return;
  const c = DC.ctx, W = DC.W, H = DC.H, wallX = W / 2;
  const holeTop = H / 2 - df.A, holeBot = H / 2 + df.A;

  c.fillStyle = '#080c14'; c.fillRect(0, 0, W, H);
  c.fillStyle = 'rgba(244,63,94,0.03)'; c.fillRect(0, 0, wallX, H);
  if (df.mode === 'diffusion') { c.fillStyle = 'rgba(59,130,246,0.03)'; c.fillRect(wallX, 0, wallX, H); }

  function processMols(molsArr, isGas1) {
    const targetMass = isGas1 ? df.M : 32;
    const targetSpeed = 1.5 * Math.sqrt(df.T / 300) * Math.sqrt(32 / targetMass);
    for (let i = molsArr.length - 1; i >= 0; i--) {
      const m = molsArr[i];
      m.trail.push({ x: m.x, y: m.y });
      if (m.trail.length > 5) m.trail.shift();
      const cs = Math.hypot(m.vx, m.vy);
      if (cs > 0.01) { m.vx = (m.vx / cs) * targetSpeed; m.vy = (m.vy / cs) * targetSpeed; }
      m.x += m.vx; m.y += m.vy;
      if (m.x - m.r < 0) { m.x = m.r; m.vx *= -1; }
      if (m.y - m.r < 0) { m.y = m.r; m.vy *= -1; }
      if (m.y + m.r > H) { m.y = H - m.r; m.vy *= -1; }

      if (df.mode === 'effusion' && isGas1) {
        if (m.x > W) {
          df.escaped++;
          const el = document.getElementById('df-escaped');
          if (el) el.textContent = df.escaped;
          Object.assign(m, dcMakeMol(true, m.r + 2)); m.trail = []; continue;
        }
      } else {
        if (m.x + m.r > W) { m.x = W - m.r; m.vx *= -1; }
      }

      // Barrier collision
      if (m.x + m.r > wallX - 2 && m.x - m.vx <= wallX) {
        if (!(m.y > holeTop && m.y < holeBot)) { m.x = wallX - 2 - m.r; m.vx *= -1; }
      } else if (m.x - m.r < wallX + 2 && m.x - m.vx >= wallX) {
        if (!(m.y > holeTop && m.y < holeBot)) { m.x = wallX + 2 + m.r; m.vx *= -1; }
      }

      // Draw trail
      if (m.trail.length > 1) {
        c.beginPath(); c.moveTo(m.trail[0].x, m.trail[0].y);
        for (let j = 1; j < m.trail.length; j++) c.lineTo(m.trail[j].x, m.trail[j].y);
        c.lineTo(m.x, m.y);
        c.strokeStyle = isGas1 ? 'rgba(244,63,94,0.35)' : 'rgba(59,130,246,0.35)';
        c.lineWidth = m.r * 0.8; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
      }

      // Draw molecule
      const col = isGas1 ? { r: 244, g: 63, b: 94 } : { r: 59, g: 130, b: 246 };
      const grad = c.createRadialGradient(m.x - m.r * 0.3, m.y - m.r * 0.3, 0, m.x, m.y, m.r);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, `rgb(${col.r},${col.g},${col.b})`);
      grad.addColorStop(1, `rgba(${Math.floor(col.r*0.3)},${Math.floor(col.g*0.3)},${Math.floor(col.b*0.3)},0.9)`);
      c.beginPath(); c.arc(m.x, m.y, m.r, 0, Math.PI * 2); c.fillStyle = grad; c.fill();
    }
  }

  processMols(DC.mols1, true);
  if (df.mode === 'diffusion') processMols(DC.mols2, false);

  // Barrier
  c.fillStyle = '#374151';
  c.fillRect(wallX - 2, 0, 4, holeTop);
  c.fillRect(wallX - 2, holeBot, 4, H - holeBot);
  c.strokeStyle = 'rgba(255,255,255,0.2)'; c.lineWidth = 1; c.setLineDash([3, 3]);
  c.beginPath(); c.moveTo(wallX, holeTop); c.lineTo(wallX + 20, holeTop); c.stroke();
  c.beginPath(); c.moveTo(wallX, holeBot); c.lineTo(wallX + 20, holeBot); c.stroke();
  c.setLineDash([]);

  DC.animId = requestAnimationFrame(dcAnimate);
  window._dcAnimId = DC.animId;
}

/* ════════════════════════════════════════════════════
   EVENT LISTENERS
════════════════════════════════════════════════════ */
function initEventListeners() {
  // TAB 1: Ideal Gas
  document.querySelectorAll('input[name="solve_ig"]').forEach(radio => {
    radio.addEventListener('change', e => {
      ig.solveFor = e.target.value;
      ['P','V','n','T'].forEach(k => {
        const sl = document.getElementById(`i-sl-${k}`);
        if (sl) sl.disabled = (k === ig.solveFor);
      });
      igCompute();
    });
  });
  ['P','V','n','T'].forEach(k => {
    const sl = document.getElementById(`i-sl-${k}`);
    if (sl) sl.addEventListener('input', e => { if (ig.solveFor === k) return; ig[k] = parseFloat(e.target.value); igCompute(); });
  });

  // TAB 2: Boyle's
  const bslP = document.getElementById('b-sl-P');
  if (bslP) bslP.addEventListener('input', e => { bl.P = parseFloat(e.target.value); bl.V = clamp(blK() / bl.P, 1, 20); blUpdateUI(); });
  const bslV = document.getElementById('b-sl-V');
  if (bslV) bslV.addEventListener('input', e => { bl.V = parseFloat(e.target.value); bl.P = clamp(blK() / bl.V, 0.2, 10); blUpdateUI(); });
  const bslT = document.getElementById('b-sl-T');
  if (bslT) bslT.addEventListener('input', e => { bl.T = parseFloat(e.target.value); bl.V = clamp(blK() / bl.P, 1, 20); blUpdateUI(); });

  document.querySelectorAll('#boyle-temp-legend [data-t]').forEach(btn => {
    btn.addEventListener('click', e => {
      const t = parseFloat(e.target.dataset.t);
      if (isNaN(t)) return;
      bl.T = t; bl.V = clamp(blK() / bl.P, 1, 20); blUpdateUI();
    });
  });

  // TAB 3: Charles'
  const cslV = document.getElementById('c-sl-V');
  if (cslV) cslV.addEventListener('input', e => { cl.V = parseFloat(e.target.value); cl.T = clamp(cl.V / clK(), 50, 1000); clUpdateUI(); });
  const cslT = document.getElementById('c-sl-T');
  if (cslT) cslT.addEventListener('input', e => { cl.T = parseFloat(e.target.value); cl.V = clamp(clK() * cl.T, 1, 50); clUpdateUI(); });
  const cslP = document.getElementById('c-sl-P');
  if (cslP) cslP.addEventListener('input', e => { cl.P = parseFloat(e.target.value); cl.V = clamp(clK() * cl.T, 1, 50); clUpdateUI(); });

  document.querySelectorAll('#charles-p-legend [data-p]').forEach(btn => {
    btn.addEventListener('click', e => {
      const p = parseFloat(e.target.dataset.p);
      if (isNaN(p)) return;
      cl.P = p; cl.V = clamp(clK() * cl.T, 1, 50); clUpdateUI();
    });
  });

  // TAB 4: Diffusion
  document.querySelectorAll('input[name="df_mode"]').forEach(radio => {
    radio.addEventListener('change', e => {
      df.mode = e.target.value;
      const title = document.getElementById('df-canvas-title');
      const chip = document.getElementById('df-stat-chip');
      if (title) title.textContent = df.mode === 'effusion' ? 'Effusion Chamber (Vacuum)' : 'Diffusion Chamber (Mixing)';
      if (chip) chip.style.display = df.mode === 'effusion' ? 'flex' : 'none';
      dfInitMols(); dfUpdateUI();
    });
  });

  ['P','T','M','A'].forEach(k => {
    const sl = document.getElementById(`d-sl-${k}`);
    if (sl) sl.addEventListener('input', e => {
      df[k] = parseFloat(e.target.value);
      if (k === 'P' || k === 'M') dfInitMols();
      dfUpdateUI();
    });
  });

  const dfReset = document.getElementById('df-reset-btn');
  if (dfReset) dfReset.addEventListener('click', () => dfInitMols());
}

/* ════════════════════════════════════════════════════
   UI UPDATE FUNCTIONS
════════════════════════════════════════════════════ */
function igCompute() {
  if (ig.solveFor === 'P') ig.P = (ig.n * RC * ig.T) / ig.V;
  if (ig.solveFor === 'V') ig.V = (ig.n * RC * ig.T) / ig.P;
  if (ig.solveFor === 'n') ig.n = (ig.P * ig.V) / (RC * ig.T);
  if (ig.solveFor === 'T') ig.T = (ig.P * ig.V) / (ig.n * RC);
  ig.P = clamp(ig.P, 0.1, 10); ig.V = clamp(ig.V, 1, 20);
  ig.n = clamp(ig.n, 0.1, 5); ig.T = clamp(ig.T, 100, 1000);
  igUpdateUI();
}

function igUpdateUI() {
  setUI('i', 'P', ig.P); setUI('i', 'V', ig.V, 1); setUI('i', 'n', ig.n); setUI('i', 'T', ig.T, 0);
  const mol = document.getElementById('chip-mol'); if (mol) mol.textContent = Math.round(ig.n * 14);
  const spd = Math.max(0.5, 0.8 + (ig.T / 300) * 1.5 / Math.max(0.4, Math.sqrt(ig.P)));
  const spdEl = document.getElementById('chip-spd'); if (spdEl) spdEl.textContent = spd.toFixed(1) + '×';
  const tc = document.getElementById('chip-tc'); if (tc) tc.textContent = (ig.T - 273.15).toFixed(1) + '°C';

  const lP = document.getElementById('live-P'); if (lP) lP.textContent = ig.P.toFixed(2);
  const lV = document.getElementById('live-V'); if (lV) lV.textContent = ig.V.toFixed(1);
  const ln = document.getElementById('live-n'); if (ln) ln.textContent = ig.n.toFixed(2);
  const lT = document.getElementById('live-T'); if (lT) lT.textContent = ig.T.toFixed(0);

  const lhs = ig.P * ig.V, rhs = ig.n * RC * ig.T, ok = Math.abs(lhs - rhs) < 0.2;
  const st = document.getElementById('i-status');
  if (st) { st.textContent = ok ? '✔ Equation Balanced' : '⚠ Hit Physical Limits'; st.style.color = ok ? 'var(--pc-green)' : 'var(--pc-amber)'; }
  updateCharts();
}

function blUpdateUI() {
  setUI('b', 'P', bl.P); setUI('b', 'V', bl.V, 1); setUI('b', 'T', bl.T, 0);
  const bP = document.getElementById('b-live-P'); if (bP) bP.textContent = bl.P.toFixed(2);
  const bV = document.getElementById('b-live-V'); if (bV) bV.textContent = bl.V.toFixed(1);
  const bK = document.getElementById('b-live-k'); if (bK) bK.textContent = blK().toFixed(2);
  document.querySelectorAll('#boyle-temp-legend [data-t]').forEach(btn => {
    btn.dataset.active = Math.abs(parseFloat(btn.dataset.t) - bl.T) < 5 ? 'true' : '';
  });
  updateBoyleCharts();
}

function clUpdateUI() {
  setUI('c', 'V', cl.V, 1); setUI('c', 'T', cl.T, 0); setUI('c', 'P', cl.P, 2);
  const cV = document.getElementById('c-live-V'); if (cV) cV.textContent = cl.V.toFixed(1);
  const cT = document.getElementById('c-live-T'); if (cT) cT.textContent = cl.T.toFixed(0);
  const cK = document.getElementById('c-live-k'); if (cK) cK.textContent = clK().toFixed(3);
  document.querySelectorAll('#charles-p-legend [data-p]').forEach(btn => {
    btn.dataset.active = Math.abs(parseFloat(btn.dataset.p) - cl.P) < 0.1 ? 'true' : '';
  });
  updateCharlesCharts();
}

/* ════════════════════════════════════════════════════
   SWIPE ENGINE
════════════════════════════════════════════════════ */
let activeDragCard = null, dragStartX = 0, dragCurrentX = 0;

function initSwipeCard(cardId, swipeOutCallback) {
  const card = document.getElementById(cardId);
  if (!card) return;
  card.addEventListener('pointerdown', e => {
    if (e.target.closest('button')) return;
    activeDragCard = card; activeDragCard.swipeCallback = swipeOutCallback;
    dragStartX = e.clientX; card.style.transition = 'none'; card.style.cursor = 'grabbing';
  });
}

document.addEventListener('pointermove', e => {
  if (!activeDragCard) return;
  dragCurrentX = e.clientX - dragStartX;
  activeDragCard.style.transform = `translateX(${dragCurrentX}px) rotate(${dragCurrentX * 0.05}deg)`;
});

document.addEventListener('pointerup', () => {
  if (!activeDragCard) return;
  const card = activeDragCard; activeDragCard = null;
  card.style.transition = 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.4s';
  card.style.cursor = 'grab';
  if (dragCurrentX > 100) { card.swipeCallback(1); }
  else if (dragCurrentX < -100) { card.swipeCallback(-1); }
  else { card.style.transform = 'translateX(0px) rotate(0deg)'; }
  dragCurrentX = 0;
});

/* ════════════════════════════════════════════════════
   BOYLE'S QUIZ
════════════════════════════════════════════════════ */
const BOYLE_QUESTIONS = [
  { q: "At constant temperature, a gas occupies 200 ml at 0.720 bar. Subjected to 0.900 bar, what is the resulting volume?", opts: ["160 ml","320 ml","80 ml","400 ml"], ans: 0, sol: `<span class="eqn">p₁V₁ = p₂V₂</span><br>0.720 × 200 = 0.900 × V₂<br>V₂ = <strong>160 ml</strong>` },
  { q: "2.5 L of gas at 1 bar is compressed to 500 ml at constant T. What is the percentage increase in pressure?", opts: ["100%","400%","500%","80%"], ans: 1, sol: `p₂ = p₁V₁/V₂ = 1×2500/500 = 5 bar<br>% increase = (5-1)/1 × 100 = <strong>400%</strong>` },
  { q: "When inflating a cycle tube, both volume AND pressure increase. Why does this not violate Boyle's Law?", opts: ["It is an exception","Air is not ideal","Mass (n) of air is not constant","External force is applied"], ans: 2, sol: `Boyle's Law requires <strong>fixed amount (n)</strong> of gas. Inflating a tube adds more air molecules — n increases, so the law doesn't apply.` },
  { q: "The Boyle's constant (SI unit) for 200 ml of gas at 1.2 atm is about:", opts: ["240 atm-ml","0.24 atm-L","24.3 J","0.24 J"], ans: 2, sol: `k = PV = 1.2 × 0.2 L = 0.24 L·atm<br>1 L·atm = 101.3 J<br>k = 0.24 × 101.3 ≈ <strong>24.3 J</strong>` },
  { q: "[Real Life] As a scuba diver ascends, water pressure decreases. If they hold their breath, what happens to the lung volume?", opts: ["Decreases","Stays the same","Increases dangerously","Dissolves into blood"], ans: 2, sol: `By Boyle's Law, ↓ pressure → ↑ volume. Holding breath traps the gas, leading to dangerous lung overexpansion (pulmonary barotrauma).` },
  { q: "[Real Life] When you pull back a sealed syringe plunger, what happens to internal pressure?", opts: ["Drops — creates partial vacuum","Increases — pushes plunger out","Remains constant","Fluctuates randomly"], ans: 0, sol: `Increasing volume lowers molecular collision frequency → lower pressure → suction. Direct application of Boyle's Law.` },
  { q: "Deep-sea fish brought to surface quickly often die because their swim bladders pop out. This demonstrates:", opts: ["Charles' Law","Boyle's Law","Avogadro's Law","Dalton's Law"], ans: 1, sol: `<strong>Boyle's Law!</strong> Massive drop in hydrostatic pressure → rapid expansion of the fixed gas inside the swim bladder.` }
];

let bqIdx = 0, bqAnswered = false, bqScore = 0;

window.bqSwipeOut = function(direction) {
  const card = document.getElementById('bq-active-card');
  if (!card) return;
  card.style.transition = 'transform 0.4s ease-in, opacity 0.4s';
  card.style.transform = `translateX(${direction * window.innerWidth}px) rotate(${direction * 30}deg)`;
  card.style.opacity = 0;
  setTimeout(() => {
    bqNextInternal();
    card.style.transition = 'none';
    card.style.transform = `translateX(${-direction * 40}px) scale(0.95)`;
    setTimeout(() => { card.style.transition = 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.4s'; card.style.transform = 'translateX(0px) rotate(0deg) scale(1)'; card.style.opacity = 1; card.scrollTop = 0; }, 50);
  }, 350);
};

function bqLoad() {
  const q = BOYLE_QUESTIONS[bqIdx];
  const qn = document.getElementById('bq-q-num'); if (qn) qn.textContent = `Question ${bqIdx + 1} of ${BOYLE_QUESTIONS.length}`;
  const qt = document.getElementById('bq-text'); if (qt) qt.textContent = q.q;
  const oc = document.getElementById('bq-opts'); if (!oc) return;
  oc.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="quiz-opt-lbl">${String.fromCharCode(65+i)}</span> <span>${opt}</span>`;
    btn.onclick = () => bqCheck(i);
    oc.appendChild(btn);
  });
  const sb = document.getElementById('bq-sol-box'); if (sb) sb.style.display = 'none';
  const sk = document.getElementById('bq-skip-btn'); if (sk) sk.style.display = 'inline-block';
  const nb = document.getElementById('bq-next-btn'); if (nb) nb.style.display = 'none';
  bqAnswered = false;
}

function bqCheck(selIdx) {
  if (bqAnswered) return;
  bqAnswered = true;
  const q = BOYLE_QUESTIONS[bqIdx];
  document.getElementById('bq-opts').querySelectorAll('.quiz-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    else if (i === selIdx) btn.classList.add('wrong');
  });
  if (selIdx === q.ans) { bqScore++; const sc = document.getElementById('bq-score'); if (sc) sc.textContent = bqScore; }
  const st = document.getElementById('bq-sol-text'); if (st) st.innerHTML = q.sol;
  const sb = document.getElementById('bq-sol-box'); if (sb) sb.style.display = 'block';
  const sk = document.getElementById('bq-skip-btn'); if (sk) sk.style.display = 'none';
  const nb = document.getElementById('bq-next-btn');
  if (nb) { nb.style.display = 'inline-block'; nb.textContent = bqIdx < BOYLE_QUESTIONS.length - 1 ? 'Next Question →' : 'Restart Quiz ↺'; }
  const card = document.getElementById('bq-active-card');
  setTimeout(() => card.scrollTo({ top: card.scrollHeight, behavior: 'smooth' }), 100);
}

function bqNextInternal() {
  if (bqIdx < BOYLE_QUESTIONS.length - 1) bqIdx++;
  else { bqIdx = 0; bqScore = 0; const sc = document.getElementById('bq-score'); if (sc) sc.textContent = 0; }
  bqLoad();
}

/* ════════════════════════════════════════════════════
   CHARLES' QUIZ
════════════════════════════════════════════════════ */
const CHARLES_QUESTIONS = [
  { q: "600 ml of air at 27°C is heated to 47°C at constant P. What is the increase in volume?", opts: ["50 ml","60 ml","80 ml","40 ml"], ans: 3, sol: `T₁=300K, T₂=320K<br>V₂ = 600×320/300 = 640 ml<br>Increase = <strong>40 ml</strong>` },
  { q: "3.75 L at 35°C. To what temperature must it be cooled (at same P) to become 3.0 L?", opts: ["-26.6°C","0°C","3.98°C","28°C"], ans: 0, sol: `T₂ = V₂T₁/V₁ = 3.0×308.15/3.75 = 246.5K = <strong>-26.6°C</strong>` },
  { q: "A balloon holds 500 ml at 27°C and bursts at 3× its volume. What is the burst temperature?", opts: ["300 K","900 K","625°C","225°C"], ans: 1, sol: `V₂=1500ml, T₁=300K<br>T₂ = 1500×300/500 = <strong>900 K</strong>` },
  { q: "Equal moles of different gases heated from 20°C to 40°C at constant P. Their volume:", opts: ["becomes double","increases by molecular mass ratio","increases by the same extent","decreases by the same extent"], ans: 2, sol: `<strong>Increases by the same extent.</strong> Charles' Law is independent of molecular identity.` },
  { q: "[Real Life] A dented ping-pong ball regains its shape in hot water because:", opts: ["Water pressure pushes it out","Plastic melts and reforms","Trapped air expands as it heats","Water reacts with plastic"], ans: 2, sol: `<strong>Charles' Law!</strong> Hot water heats the trapped air → volume expands → dent pops out.` },
  { q: "[Real Life] Yeast CO₂ bubbles in bread dough expand in the oven because:", opts: ["Higher pressure shrinks them","They expand, making bread fluffy","They dissolve into dough","They sublimate"], ans: 1, sol: `<strong>Charles' Law!</strong> Oven heat increases gas temperature → volume increases at constant pressure → fluffy bread.` }
];

let cqIdx = 0, cqAnswered = false, cqScore = 0;

window.cqSwipeOut = function(direction) {
  const card = document.getElementById('cq-active-card');
  if (!card) return;
  card.style.transition = 'transform 0.4s ease-in, opacity 0.4s';
  card.style.transform = `translateX(${direction * window.innerWidth}px) rotate(${direction * 30}deg)`;
  card.style.opacity = 0;
  setTimeout(() => {
    cqNextInternal();
    card.style.transition = 'none';
    card.style.transform = `translateX(${-direction * 40}px) scale(0.95)`;
    setTimeout(() => { card.style.transition = 'transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.4s'; card.style.transform = 'translateX(0px) rotate(0deg) scale(1)'; card.style.opacity = 1; card.scrollTop = 0; }, 50);
  }, 350);
};

function cqLoad() {
  const q = CHARLES_QUESTIONS[cqIdx];
  const qn = document.getElementById('cq-q-num'); if (qn) qn.textContent = `Question ${cqIdx + 1} of ${CHARLES_QUESTIONS.length}`;
  const qt = document.getElementById('cq-text'); if (qt) qt.textContent = q.q;
  const oc = document.getElementById('cq-opts'); if (!oc) return;
  oc.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt';
    btn.innerHTML = `<span class="quiz-opt-lbl">${String.fromCharCode(65+i)}</span> <span>${opt}</span>`;
    btn.onclick = () => cqCheck(i);
    oc.appendChild(btn);
  });
  const sb = document.getElementById('cq-sol-box'); if (sb) sb.style.display = 'none';
  const sk = document.getElementById('cq-skip-btn'); if (sk) sk.style.display = 'inline-block';
  const nb = document.getElementById('cq-next-btn'); if (nb) nb.style.display = 'none';
  cqAnswered = false;
}

function cqCheck(selIdx) {
  if (cqAnswered) return;
  cqAnswered = true;
  const q = CHARLES_QUESTIONS[cqIdx];
  document.getElementById('cq-opts').querySelectorAll('.quiz-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.ans) btn.classList.add('correct');
    else if (i === selIdx) btn.classList.add('wrong');
  });
  if (selIdx === q.ans) { cqScore++; const sc = document.getElementById('cq-score'); if (sc) sc.textContent = cqScore; }
  const st = document.getElementById('cq-sol-text'); if (st) st.innerHTML = q.sol;
  const sb = document.getElementById('cq-sol-box'); if (sb) sb.style.display = 'block';
  const sk = document.getElementById('cq-skip-btn'); if (sk) sk.style.display = 'none';
  const nb = document.getElementById('cq-next-btn');
  if (nb) { nb.style.display = 'inline-block'; nb.textContent = cqIdx < CHARLES_QUESTIONS.length - 1 ? 'Next Question →' : 'Restart Quiz ↺'; }
  const card = document.getElementById('cq-active-card');
  setTimeout(() => card.scrollTo({ top: card.scrollHeight, behavior: 'smooth' }), 100);
}

function cqNextInternal() {
  if (cqIdx < CHARLES_QUESTIONS.length - 1) cqIdx++;
  else { cqIdx = 0; cqScore = 0; const sc = document.getElementById('cq-score'); if (sc) sc.textContent = 0; }
  cqLoad();
}

/* ════════════════════════════════════════════════════
   BOOTSTRAP
════════════════════════════════════════════════════ */
function initPhysChemHub() {
  // Destroy existing charts to handle re-navigation
  [chartPV, chartZ, chartBoyleFamily, chartBoyleInv, chartBoylePvp, chartCharlesVtc, chartCharlesVt, chartCharlesLog].forEach(c => { try { if (c) c.destroy(); } catch(e) {} });
  chartPV = null; chartZ = null; chartBoyleFamily = null; chartBoyleInv = null; chartBoylePvp = null;
  chartCharlesVtc = null; chartCharlesVt = null; chartCharlesLog = null;
  // Cancel existing animations — check both local refs and window refs
  if (GC.animId) { cancelAnimationFrame(GC.animId); GC.animId = null; }
  if (DC.animId) { cancelAnimationFrame(DC.animId); DC.animId = null; }
  if (window._gcAnimId) { cancelAnimationFrame(window._gcAnimId); window._gcAnimId = null; }
  if (window._dcAnimId) { cancelAnimationFrame(window._dcAnimId); window._dcAnimId = null; }

  initCharts();
  igCompute();
  blUpdateUI();
  clUpdateUI();
  gcInit();
  dcInit();
  bqLoad(); initSwipeCard('bq-active-card', window.bqSwipeOut);
  cqLoad(); initSwipeCard('cq-active-card', window.cqSwipeOut);
  initEventListeners();
}

// Style quiz elements (CSS classes from module won't work inline)
document.addEventListener('DOMContentLoaded', () => {
  // Inject quiz CSS that can't be scoped via modules due to innerHTML dynamic creation
  const style = document.createElement('style');
  style.textContent = `
    .quiz-opt { 
      display: flex; 
      align-items: center; 
      gap: 14px; 
      padding: 16px 20px; 
      border: 1.5px solid rgba(255,255,255,0.08); 
      border-radius: 12px; 
      background: linear-gradient(135deg, rgba(31,41,55,0.6) 0%, rgba(17,24,39,0.8) 100%);
      backdrop-filter: blur(10px);
      color: #d1d5db; 
      font-family: 'Inter', sans-serif; 
      font-size: 15px; 
      cursor: pointer; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      text-align: left; 
      width: 100%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    }
    .quiz-opt::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(45,212,191,0.03) 0%, rgba(139,92,246,0.03) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .quiz-opt:hover:not(:disabled) { 
      border-color: rgba(45,212,191,0.4); 
      color: #f3f4f6; 
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(45,212,191,0.15), 0 0 0 1px rgba(45,212,191,0.1);
    }
    .quiz-opt:hover:not(:disabled)::before {
      opacity: 1;
    }
    .quiz-opt-lbl { 
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      border: 2px solid #374151; 
      border-radius: 8px; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-size: 13px; 
      font-weight: 700; 
      flex-shrink: 0; 
      color: #9ca3af;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    }
    .quiz-opt:hover:not(:disabled) .quiz-opt-lbl {
      border-color: #2dd4bf;
      color: #2dd4bf;
      box-shadow: 0 0 12px rgba(45,212,191,0.3), inset 0 2px 4px rgba(0,0,0,0.3);
    }
    .quiz-opt.correct { 
      background: linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.1) 100%);
      border-color: #10b981; 
      color: #6ee7b7;
      box-shadow: 0 4px 16px rgba(16,185,129,0.25);
    }
    .quiz-opt.correct .quiz-opt-lbl { 
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #000; 
      border-color: #10b981;
      box-shadow: 0 0 16px rgba(16,185,129,0.5), inset 0 1px 2px rgba(255,255,255,0.2);
    }
    .quiz-opt.wrong { 
      background: linear-gradient(135deg, rgba(244,63,94,0.12) 0%, rgba(220,38,38,0.08) 100%);
      border-color: rgba(244,63,94,0.5); 
      color: #fca5a5; 
      opacity: 0.75;
      box-shadow: 0 4px 16px rgba(244,63,94,0.2);
    }
    .quiz-opt.wrong .quiz-opt-lbl { 
      background: linear-gradient(135deg, #f43f5e 0%, #dc2626 100%);
      color: #fff; 
      border-color: #f43f5e;
      box-shadow: 0 0 12px rgba(244,63,94,0.4), inset 0 1px 2px rgba(255,255,255,0.15);
    }
    .eqn { 
      font-family: 'Georgia', serif; 
      font-style: italic; 
      font-size: 16px; 
      display: inline-block; 
      padding: 0 3px; 
    }
  `;
  document.head.appendChild(style);
});

window.initPhysChemHub = initPhysChemHub;
