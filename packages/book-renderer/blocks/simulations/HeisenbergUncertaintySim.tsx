'use client';

// ──────────────────────────────────────────────────────────────────────────
// Heisenberg Uncertainty  ·  simulation_id: 'heisenberg-uncertainty'
// Class 11 Chemistry · Chapter 2 (Structure of Atom) · NCERT §2.5.2
//
// The companion that sits next to the de Broglie sim on the dual-nature page.
// It kills the single most common misconception about the uncertainty
// principle: students think it is just "measurement error from clumsy
// instruments." It is NOT — it is a fundamental, unbeatable trade-off built
// into nature. Pin DOWN where the electron is (narrow Δx) and its momentum /
// velocity MUST fan out (large Δv); let the position blur (wide Δx) and the
// velocity sharpens. You can never push the product Δx·Δp below the floor
// h/4π, no matter how you drag.
//
//   ┌── THE TRAPPED PARTICLE (hero) ──────────────────────────────────────┐
//   │ a fuzzy probability cloud inside a draggable "position box" of width │
//   │ Δx. Narrow the box → the cloud sharpens to a spike BUT a fan of      │
//   │ velocity arrows (the momentum spread Δv) flares wide. Widen the box  │
//   │ → cloud blurs, velocity fan collapses to a sharp single arrow.       │
//   └─────────────────────────────────────────────────────────────────────┘
//   ┌── THE LEDGER ─────────────┐  ┌── THE FLOOR ────────────────────────┐
//   │ Δx, Δp, Δv worked out from │  │ the product Δx·Δp shown pinned at    │
//   │ Δp = h/(4π·Δx) live        │  │ exactly h/4π — a constant of nature  │
//   └────────────────────────────┘  └──────────────────────────────────────┘
//
// Scale toggle (mirrors the de Broglie sim): trap an ELECTRON or a CRICKET
// BALL. The same Δx gives a catastrophic Δv for the electron (~10⁵ m/s) and
// an utterly negligible Δv for the ball (~10⁻²⁴ m/s) — THAT is why the
// principle only bites at the quantum scale and we never notice it for
// everyday objects.
//
// ACADEMIC SOURCES (anti-hallucination gate, SIMULATION_DESIGN_WORKFLOW §7) —
// every number below is standard NCERT Class 11 Chapter 2 §2.5.2 data, NOT
// generated from training knowledge:
//   • Heisenberg:  Δx · Δp ≥ h / (4π)
//   • h = 6.626 × 10⁻³⁴ J·s   ⇒   h/4π ≈ 5.27 × 10⁻³⁵ J·s
//   • At the minimum-uncertainty limit:  Δp = h / (4π·Δx)
//   • and  Δv = Δp / m = h / (4π·m·Δx)
//   • Electron mass m = 9.11 × 10⁻³¹ kg.
//     Worked check: Δx = 1 × 10⁻¹⁰ m (atom-sized)
//       ⇒ Δp ≈ 5.27 × 10⁻²⁵ kg·m/s
//       ⇒ Δv ≈ 5.8 × 10⁵ m/s  (~580 km/s — enormous). This is exactly why a
//       fixed Bohr "orbit" with a definite radius AND a definite speed is
//       impossible: it violates this principle.
//   • Cricket ball mass m = 0.16 kg. Same Δx = 1 × 10⁻¹⁰ m
//       ⇒ Δv ≈ 3.3 × 10⁻²⁴ m/s — utterly unmeasurable. The trade-off still
//       exists for the ball; it is just absurdly tiny.
//   • Δp and Δv are computed LIVE from the formulas above; the worked numbers
//     are used only to sanity-check.
//   • Punchline: it is NOT a bad instrument. Position and momentum are a
//     package deal — sharpen one and the other MUST blur. The product floor
//     is h/4π, a constant of nature.
// ──────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react';

// ── chrome palette (workflow §3) ────────────────────────────────────────────
const C = {
  bg: '#0d1117',
  card: '#0B0F15',
  surface: '#151E32',
  text: '#e2e8f0',
  text2: '#94a3b8',
  muted: '#475569',
  ghost: '#64748b',
  indigo: '#6366f1',
  indigoMid: '#818cf8',
  indigoLight: '#c4b5fd',
  amber: '#fbbf24',
  amberLight: '#fcd34d',
  emerald: '#10b981',
  emeraldLight: '#34d399',
  red: '#f87171',
  redDark: '#dc2626',
  line: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
};

// ── physics constants (NCERT §2.5.2) ────────────────────────────────────────
const H = 6.626e-34;              // Planck constant, J·s
const H_OVER_4PI = H / (4 * Math.PI); // ≈ 5.27×10⁻³⁵ J·s — the uncertainty floor
const M_ELECTRON = 9.11e-31;      // kg
const M_BALL = 0.16;              // kg — a cricket ball

// at the minimum-uncertainty limit (the floor): Δx·Δp = h/4π exactly
const dpFromDx = (dx: number) => H_OVER_4PI / dx;          // Δp = h/(4π·Δx)
const dvFromDx = (dx: number, m: number) => H_OVER_4PI / (m * dx); // Δv = Δp/m

// ── object metadata ─────────────────────────────────────────────────────────
type ObjKey = 'electron' | 'ball';
const OBJECTS: Record<ObjKey, { key: ObjKey; name: string; mass: number; massLabel: string; blurb: string }> = {
  electron: {
    key: 'electron',
    name: 'Electron',
    mass: M_ELECTRON,
    massLabel: '9.11 × 10⁻³¹ kg',
    blurb: 'A featherweight quantum particle — the velocity spread is catastrophic.',
  },
  ball: {
    key: 'ball',
    name: 'Cricket ball',
    mass: M_BALL,
    massLabel: '0.16 kg',
    blurb: 'An everyday object — the same squeeze leaves the speed utterly untouched.',
  },
};

// ── Δx range (metres). Spans atom-scale (10⁻¹¹) to a fat 10⁻⁸ m box ──────────
const DX_MIN = 1e-11;   // 0.1 Å — tighter than an atom
const DX_MAX = 1e-8;    // 100 Å — a roomy box
const LDX_MIN = Math.log10(DX_MIN);
const LDX_MAX = Math.log10(DX_MAX);
// slider runs 0..1000 on a log scale so dragging feels smooth across decades
const sliderToDx = (s: number) => Math.pow(10, LDX_MIN + (s / 1000) * (LDX_MAX - LDX_MIN));
const dxToSlider = (dx: number) => ((Math.log10(dx) - LDX_MIN) / (LDX_MAX - LDX_MIN)) * 1000;

// ── scientific notation → "5.27 × 10⁻³⁵" (workflow §2, never "5.27e-35") ─────
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
function prettyExp(eNotation: string): string {
  const m = eNotation.match(/^(-?[\d.]+)e([+-]?\d+)$/);
  if (!m) return eNotation;
  const mantissa = m[1];
  const expNum = parseInt(m[2], 10);
  if (expNum === 0) return mantissa;
  const sup = String(Math.abs(expNum)).split('').map((d) => SUP_DIGITS[parseInt(d, 10)]).join('');
  const sign = expNum < 0 ? '⁻' : '';
  return `${mantissa} × 10${sign}${sup}`;
}

// ── stacked fraction (workflow §2 — never the ÷ glyph) ──────────────────────
function Frac({ num, den }: { num: React.ReactNode; den: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', lineHeight: 1.1, margin: '0 3px' }}>
      <span style={{ padding: '0 5px 1px' }}>{num}</span>
      <span style={{ padding: '1px 5px 0', borderTop: '1.5px solid currentColor', width: '100%', textAlign: 'center' }}>{den}</span>
    </span>
  );
}

// ── guided narrative beats ──────────────────────────────────────────────────
type StepDef = { key: string; label: string; title: string; body: string };
const STEPS: StepDef[] = [
  {
    key: 'notError',
    label: 'Not a Measurement Error',
    title: 'This is not a clumsy-instrument problem',
    body:
      "Almost everyone first hears the uncertainty principle and thinks: \"with a better microscope we'd just measure both the electron's position and its speed exactly.\" That is wrong. The blur is not in your instrument — it is in nature. An electron simply does not HAVE a sharp position and a sharp speed at the same instant. The cloud here is the real thing, not a fuzzy photo of a sharp dot.",
  },
  {
    key: 'squeeze',
    label: 'Squeeze the Box',
    title: 'Pin the position and the speed fans out',
    body:
      'Drag the position box narrower (smaller Δx) — you are forcing the electron into a tinier space, so you know WHERE it is more precisely. Watch the velocity arrows: they fan out wider and wider. Knowing the position better has cost you all knowledge of how fast it is moving. Widen the box and the trade reverses. The product Δx·Δp never drops below the floor h/4π — it is pinned there.',
  },
  {
    key: 'ball',
    label: "Why a Ball Doesn't Care",
    title: 'A cricket ball is too heavy to notice',
    body:
      'Switch the trapped object to a cricket ball and squeeze it into the SAME tiny box. The velocity spread is still there — the trade-off is a law for everything — but because the ball is ~10³⁰ times heavier than an electron, its Δv comes out around 10⁻²⁴ m/s: a speed you could never measure in the lifetime of the universe. That is why we never bump into the uncertainty principle in everyday life. It only bites at the quantum scale.',
  },
];

export default function HeisenbergUncertaintySim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const [stepIdx, setStepIdx] = useState(1);          // open on "Squeeze the Box"
  const [obj, setObj] = useState<ObjKey>('electron');
  const [sliderVal, setSliderVal] = useState(() => dxToSlider(1e-10)); // start atom-sized
  const dragRef = useRef(false);

  const dx = sliderToDx(sliderVal);
  const mass = OBJECTS[obj].mass;
  const dp = dpFromDx(dx);
  const dv = dvFromDx(dx, mass);
  const product = dx * dp;                              // always == h/4π at the floor

  // "tightness" 0..1 — how pinned the position is (1 = narrowest box). Drives
  // both the cloud sharpness and the velocity-fan width in the canvas.
  const tightness = (Math.log10(DX_MAX) - Math.log10(dx)) / (Math.log10(DX_MAX) - Math.log10(DX_MIN));

  // mutable draw state — never triggers a React re-render inside the rAF loop
  const sim = useRef({
    tightness: tightness,
    obj: 'electron' as ObjKey,
    t: 0,
    W: 0, Hh: 0,
    boxFrac: 0.2,    // box width as a fraction of canvas width (visual only)
  });
  useEffect(() => { sim.current.tightness = tightness; }, [tightness]);
  useEffect(() => { sim.current.obj = obj; }, [obj]);

  const goStep = useCallback((idx: number) => {
    setStepIdx(idx);
    const k = STEPS[idx].key;
    if (k === 'ball') setObj('ball');
    if (k === 'squeeze') { setObj('electron'); setSliderVal(dxToSlider(1e-10)); }
    if (k === 'notError') { setObj('electron'); setSliderVal(dxToSlider(2e-9)); }
  }, []);

  // ── DRAW: the trapped particle ────────────────────────────────────────────
  function draw(ctx: CanvasRenderingContext2D) {
    const s = sim.current;
    const w = s.W, h = s.Hh;
    s.t += 0.016;
    ctx.clearRect(0, 0, w, h);

    // background
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#11182a');
    bg.addColorStop(1, C.card);
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const axisY = h * 0.46;            // the "track" the particle lives on
    const pad = 40;

    // ── position axis (where it is) ──────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.16)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, axisY); ctx.lineTo(w - pad, axisY); ctx.stroke();
    ctx.fillStyle = C.ghost; ctx.font = '600 9px Geist, system-ui, sans-serif'; ctx.textAlign = 'right';
    ctx.fillText('position →', w - pad, axisY + 22);

    // box width on screen: narrowest tightness → ~6% of width; widest → ~62%
    const boxFrac = 0.62 - s.tightness * 0.56;
    const boxW = boxFrac * (w - pad * 2);
    const boxX0 = cx - boxW / 2, boxX1 = cx + boxW / 2;
    const boxTop = axisY - 70, boxBot = axisY + 70, boxH = boxBot - boxTop;

    // ── the position box (Δx) ────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(99,102,241,0.07)';
    ctx.fillRect(boxX0, boxTop, boxW, boxH);
    ctx.strokeStyle = 'rgba(129,140,248,0.7)'; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(boxX0, boxTop, boxW, boxH);
    ctx.setLineDash([]);

    // Δx measure bar under the box
    const mY = boxBot + 14;
    ctx.strokeStyle = C.indigoMid; ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(boxX0, mY); ctx.lineTo(boxX1, mY);
    ctx.moveTo(boxX0, mY - 4); ctx.lineTo(boxX0, mY + 4);
    ctx.moveTo(boxX1, mY - 4); ctx.lineTo(boxX1, mY + 4);
    ctx.stroke();
    ctx.fillStyle = C.indigoLight; ctx.font = '700 11px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Δx  (how pinned the position is)', cx, mY + 16);

    // ── the probability cloud (sharper as the box narrows) ───────────────────
    // a gaussian-ish spread of soft dots; its visible width follows the box.
    const cloudSigma = Math.max(3, boxW * 0.28);
    const dotCount = 90;
    for (let i = 0; i < dotCount; i++) {
      // deterministic pseudo-random offsets that twinkle gently over time
      const seed = i * 12.9898;
      const r1 = (Math.sin(seed) * 43758.5453) % 1;
      const r2 = (Math.sin(seed * 1.7) * 24634.6345) % 1;
      const g = (Math.sin(seed * 0.3 + s.t * 0.6) + Math.cos(seed * 0.7 - s.t * 0.4)) * 0.5; // -1..1-ish
      const dxPx = g * cloudSigma;
      const px = cx + dxPx;
      const py = axisY + ((r2 < 0 ? -r2 : r2) - 0.5) * 36 + Math.sin(s.t * 1.3 + i) * 2;
      const edge = Math.min(1, Math.abs(dxPx) / (cloudSigma + 0.001));
      const alpha = (0.5 - edge * 0.42) * (0.6 + 0.4 * Math.abs(r1));
      ctx.fillStyle = `rgba(196,181,253,${Math.max(0.04, alpha)})`;
      ctx.beginPath();
      ctx.arc(px, py, 2.1 + (1 - edge) * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // bright core
    ctx.fillStyle = '#fff'; ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(196,181,253,0.9)';
    ctx.beginPath(); ctx.arc(cx, axisY, 3.4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    // ── the velocity fan (Δv): widens as the box narrows ─────────────────────
    // arrows fan out from the particle; the half-angle grows with tightness.
    const fanY = boxTop - 46;
    const maxHalfAngle = 0.07 + s.tightness * 0.95;   // radians, up to ~62°
    const arrowLen = 40 + s.tightness * 14;
    const nArrows = 9;
    ctx.lineWidth = 2;
    for (let i = 0; i < nArrows; i++) {
      const f = (i / (nArrows - 1)) * 2 - 1;  // -1..1
      const ang = f * maxHalfAngle - Math.PI / 2;                  // around "up"
      const ex = cx + Math.cos(ang) * arrowLen;
      const ey = fanY + Math.sin(ang) * arrowLen;
      const fade = 0.35 + 0.55 * (1 - Math.abs(f));
      // warmer (amber→red) the wider the spread, to signal "danger / blur"
      const col = s.tightness > 0.6
        ? `rgba(248,113,113,${fade})`
        : `rgba(251,191,36,${fade})`;
      ctx.strokeStyle = col;
      ctx.beginPath(); ctx.moveTo(cx, fanY); ctx.lineTo(ex, ey); ctx.stroke();
      // arrowhead
      const ah = 5;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(ang - 0.4) * ah, ey - Math.sin(ang - 0.4) * ah);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - Math.cos(ang + 0.4) * ah, ey - Math.sin(ang + 0.4) * ah);
      ctx.stroke();
    }
    // fan label
    ctx.fillStyle = s.tightness > 0.6 ? C.red : C.amberLight;
    ctx.font = '700 11px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Δv  (spread of possible velocities)', cx, fanY - arrowLen - 6 < 14 ? 14 : fanY - arrowLen - 8);

    // particle glyph caption
    ctx.fillStyle = C.text2; ctx.font = '600 10px Geist, system-ui, sans-serif'; ctx.textAlign = 'center';
    const label = s.obj === 'electron' ? 'trapped electron' : 'trapped cricket ball';
    ctx.fillText(label, cx, boxBot + 44);

    // verdict ribbon — narrow box = sharp position, blurred speed (and reverse)
    ctx.font = '700 10px Geist, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(129,140,248,0.85)';
    ctx.fillText(s.tightness > 0.5 ? '◀ position: SHARP' : '◀ position: blurred', pad, h - 14);
    ctx.textAlign = 'right';
    ctx.fillStyle = s.tightness > 0.5 ? 'rgba(248,113,113,0.9)' : 'rgba(251,191,36,0.85)';
    ctx.fillText(s.tightness > 0.5 ? 'velocity: BLURRED ▶' : 'velocity: sharp ▶', w - pad, h - 14);
  }

  // ── animation loop + sizing ───────────────────────────────────────────────
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;

    function size(canvas: HTMLCanvasElement, minH: number): [number, number] {
      const r = canvas.parentElement!.getBoundingClientRect();
      const W = Math.max(r.width, 240), Hh = Math.max(r.height, minH);
      canvas.width = W * 2; canvas.height = Hh * 2;
      const ctx = canvas.getContext('2d')!; ctx.setTransform(2, 0, 0, 2, 0, 0);
      return [W, Hh];
    }
    function resize() {
      const s = sim.current;
      [s.W, s.Hh] = size(cv!, 320);
    }

    const t = setTimeout(() => {
      resize();
      const loop = () => {
        const c = cv!.getContext('2d');
        if (c) draw(c);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }, 60);

    window.addEventListener('resize', resize);
    return () => { clearTimeout(t); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const step = STEPS[stepIdx];
  const o = OBJECTS[obj];

  // electron-vs-ball contrast Δv at the CURRENT Δx (for the payoff line)
  const dvElectron = dvFromDx(dx, M_ELECTRON);
  const dvBall = dvFromDx(dx, M_BALL);

  // ── small UI helper ────────────────────────────────────────────────────────
  const PaneLabel = ({ children, accent }: { children: React.ReactNode; accent: string }) => (
    <div className="flex items-center gap-2 mb-2">
      <span className="w-1 h-3.5 rounded" style={{ background: accent }} />
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.text2 }}>{children}</span>
    </div>
  );

  return (
    <div className="w-full rounded-2xl p-4 md:p-6" style={{ background: C.bg, color: C.text }}>
      {/* header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Heisenberg <span style={{ color: C.indigo }}>Uncertainty</span>
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: C.muted }}>
            Pin the position — the speed must blur. It is a law, not a bad instrument.
          </p>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest pt-1 px-3 py-1.5 rounded-full"
          style={{ color: C.amber, background: 'rgba(251,191,36,0.1)', border: `1px solid rgba(251,191,36,0.2)` }}>
          Δx · Δp ≥ h / 4π
        </div>
      </div>

      {/* guided beat strip */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {STEPS.map((st, i) => {
          const active = i === stepIdx;
          return (
            <button key={st.key} onClick={() => goStep(i)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${active ? 'rgba(129,140,248,0.45)' : C.border}`,
                color: active ? C.indigoLight : 'rgba(255,255,255,0.4)',
              }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: active ? C.indigo : 'rgba(255,255,255,0.06)', color: '#fff' }}>{i + 1}</span>
              {st.label}
            </button>
          );
        })}
      </div>

      {/* narration */}
      <div className="mb-5 rounded-xl px-4 py-3" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="text-sm font-bold text-white mb-1">{step.title}</div>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>{step.body}</p>
      </div>

      {/* ── THE TRAPPED PARTICLE (hero) ── */}
      <div className="mb-4">
        <PaneLabel accent={C.indigo}>The Trapped Particle · narrow the box, watch the velocity fan out</PaneLabel>
        <div className="relative w-full" style={{ height: 320 }}>
          <canvas ref={canvasRef} className="w-full h-full block rounded-xl"
            style={{ border: `1px solid ${C.border}` }} />
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="rounded-2xl p-4 mb-5" style={{ background: C.card, border: `1px solid ${C.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* object toggle */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: C.muted }}>
              Trapped object
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#05060c', border: `1px solid ${C.line}` }}>
              {(Object.values(OBJECTS)).map((ob) => (
                <button key={ob.key} onClick={() => setObj(ob.key)}
                  className="flex-1 px-3 py-2 rounded-md text-xs font-bold transition-all"
                  style={{ background: obj === ob.key ? 'rgba(99,102,241,0.18)' : 'transparent', color: obj === ob.key ? C.indigoLight : 'rgba(255,255,255,0.45)', border: obj === ob.key ? `1px solid rgba(129,140,248,0.4)` : '1px solid transparent' }}>
                  {ob.name}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-snug mt-1.5" style={{ color: C.muted }}>
              mass <span className="tabular-nums" style={{ color: C.text2 }}>{o.massLabel}</span> — {o.blurb}
            </p>
          </div>

          {/* Δx slider (the squeeze) */}
          <div className="md:col-span-2">
            <div className="text-[11px] font-bold uppercase tracking-widest mb-2 flex justify-between" style={{ color: C.muted }}>
              <span>Squeeze the position box — Δx</span>
              <span style={{ color: C.indigoLight }} className="tabular-nums">
                Δx = {prettyExp(dx.toExponential(2))} m
              </span>
            </div>
            <input type="range" min={0} max={1000} step={1} value={sliderVal}
              onChange={(e) => setSliderVal(parseInt(e.target.value, 10))}
              onMouseDown={() => { dragRef.current = true; }}
              onMouseUp={() => { dragRef.current = false; }}
              className="w-full" style={{ accentColor: C.indigo }} />
            <div className="flex justify-between text-[10px] mt-1" style={{ color: C.ghost }}>
              <span>← narrow (pin the position, blur the speed)</span>
              <span>widen (let position blur, sharpen the speed) →</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── LEDGER + FLOOR ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* the worked ledger */}
        <div>
          <PaneLabel accent={C.amber}>The Ledger · worked live from Δp = h / (4π·Δx)</PaneLabel>
          <div className="rounded-xl p-4 h-[230px] flex flex-col justify-center gap-2.5 text-sm"
            style={{ background: C.card, border: `1px solid ${C.border}`, color: C.text2 }}>
            {/* Δp line */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums">
              <span style={{ color: C.text, fontWeight: 700 }}>Δp</span>
              <span style={{ color: C.muted }}>=</span>
              <Frac num={<span style={{ color: C.amber }}>h</span>} den={<span>4π · Δx</span>} />
              <span style={{ color: C.muted }}>=</span>
              <strong style={{ color: C.amberLight }}>{prettyExp(dp.toExponential(2))}</strong>
              <span style={{ color: C.muted }}>kg·m/s</span>
            </div>
            {/* Δv line */}
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 tabular-nums">
              <span style={{ color: C.text, fontWeight: 700 }}>Δv</span>
              <span style={{ color: C.muted }}>=</span>
              <Frac num={<span>Δp</span>} den={<span style={{ fontStyle: 'italic' }}>m</span>} />
              <span style={{ color: C.muted }}>=</span>
              <Frac num={<span style={{ color: C.amber }}>h</span>} den={<span>4π · <span style={{ fontStyle: 'italic' }}>m</span> · Δx</span>} />
              <span style={{ color: C.muted }}>=</span>
              <strong style={{ color: obj === 'electron' ? C.red : C.emeraldLight }}>{prettyExp(dv.toExponential(2))}</strong>
              <span style={{ color: C.muted }}>m/s</span>
            </div>
            {/* plain-English verdict */}
            <div className="pt-2 mt-1 text-[13px] leading-relaxed" style={{ borderTop: `1px solid ${C.line}`, color: C.text2 }}>
              {obj === 'electron' ? (
                <>That velocity spread is <strong style={{ color: C.red }}>~{(dv / 1000).toLocaleString(undefined, { maximumFractionDigits: 0 })} km/s</strong> — bigger than any speed an electron in an atom actually has. You simply cannot say how fast it is moving.</>
              ) : (
                <>That velocity spread is <strong style={{ color: C.emeraldLight }}>~{prettyExp(dv.toExponential(1))} m/s</strong> — far too small to ever measure. The ball&apos;s speed is, for all purposes, perfectly certain.</>
              )}
            </div>
          </div>
        </div>

        {/* the floor */}
        <div>
          <PaneLabel accent={C.emerald}>The Floor · the product can never drop below h / 4π</PaneLabel>
          <div className="rounded-xl p-4 h-[230px] flex flex-col justify-center"
            style={{ background: C.card, border: `1px solid ${C.border}` }}>
            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-base tabular-nums mb-3" style={{ color: C.text2 }}>
              <span style={{ color: C.text, fontWeight: 700 }}>Δx · Δp</span>
              <span style={{ color: C.muted }}>=</span>
              <strong style={{ color: C.emeraldLight }}>{prettyExp(product.toExponential(2))}</strong>
              <span style={{ color: C.muted }}>J·s</span>
            </div>
            {/* floor bar — product sits exactly on the line, never below */}
            <div className="relative w-full h-12 rounded-lg overflow-hidden mb-2"
              style={{ background: '#05060c', border: `1px solid ${C.line}` }}>
              {/* forbidden zone (below the floor) */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[10px] font-bold uppercase tracking-widest"
                style={{ width: '22%', background: 'rgba(248,113,113,0.10)', color: 'rgba(248,113,113,0.7)' }}>
                forbidden
              </div>
              {/* the floor line */}
              <div className="absolute inset-y-0" style={{ left: '22%', width: 2, background: C.amber, boxShadow: `0 0 10px ${C.amber}` }} />
              {/* the live product marker — pinned at the floor */}
              <div className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5"
                style={{ left: '22%', transform: 'translate(4px, -50%)' }}>
                <span className="w-3 h-3 rounded-full" style={{ background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
                <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: C.emeraldLight }}>Δx·Δp sits here — on the floor</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] tabular-nums" style={{ color: C.ghost }}>
              <span>the floor: h / 4π = <strong style={{ color: C.amberLight }}>{prettyExp(H_OVER_4PI.toExponential(2))}</strong> J·s</span>
            </div>
            <p className="text-[12px] leading-relaxed mt-2" style={{ color: C.muted }}>
              Drag the box anywhere — the product stays welded to this line. Δx and Δp trade off perfectly: one shrinks exactly as fast as the other grows.
            </p>
          </div>
        </div>
      </div>

      {/* ── PAYOFF: package deal, not a bad instrument ── */}
      <div className="mt-5 rounded-xl px-4 py-3 flex gap-3 items-start"
        style={{ background: 'rgba(99,102,241,0.06)', border: `1px solid rgba(99,102,241,0.22)` }}>
        <span className="text-lg">💡</span>
        <p className="text-sm leading-relaxed" style={{ color: C.text2 }}>
          It is <strong style={{ color: C.text }}>not a bad instrument</strong>. Position and momentum are a <strong style={{ color: C.text }}>package deal</strong> — sharpen one and the other MUST blur, with the product floored at{' '}
          <strong style={{ color: C.amberLight }} className="tabular-nums">h/4π ≈ {prettyExp(H_OVER_4PI.toExponential(2))} J·s</strong>, a constant of nature. Squeeze the SAME box and the electron&apos;s speed blurs by{' '}
          <strong style={{ color: C.red }} className="tabular-nums">{prettyExp(dvElectron.toExponential(1))} m/s</strong> while the cricket ball&apos;s blurs by only{' '}
          <strong style={{ color: C.emeraldLight }} className="tabular-nums">{prettyExp(dvBall.toExponential(1))} m/s</strong>. The law is the same for both — it just bites only at the quantum scale. And that is exactly why Bohr&apos;s neat electron orbit, with a definite radius AND a definite speed, cannot survive.
        </p>
      </div>
    </div>
  );
}
