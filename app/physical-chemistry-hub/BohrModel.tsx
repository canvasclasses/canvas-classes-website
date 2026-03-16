'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ORBITS = [0, 42, 80, 118, 156, 194, 232];

function getPhotonColor(wl: number): string {
  if (Math.abs(wl - 656) < 3) return '#e06c75';
  if (Math.abs(wl - 486) < 3) return '#56b6c2';
  if (Math.abs(wl - 434) < 3) return '#61afef';
  if (Math.abs(wl - 410) < 3) return '#c678dd';
  if (wl < 400) return 'rgba(198, 120, 221, 0.6)';
  if (wl > 700) return 'rgba(224, 108, 117, 0.6)';
  return `hsl(${(700 - wl) * 270 / 300}, 70%, 65%)`;
}

function calculateWavelength(nLow: number, nHigh: number): number {
  const rh = 0.01097;
  const invLambda = rh * ((1 / (nLow * nLow)) - (1 / (nHigh * nHigh)));
  return Math.round(1 / invLambda);
}

function getSeriesInfo(nLow: number): { text: string; color: string } {
  if (nLow === 1) return { text: 'Lyman Series (Ultraviolet) — Invisible to human eye', color: '#c4b5fd' };
  if (nLow === 2) return { text: 'Balmer Series (Visible Light) — Appears on Spectrometer', color: '#5eead4' };
  if (nLow === 3) return { text: 'Paschen Series (Infrared) — Invisible to human eye', color: '#e06c75' };
  if (nLow === 4) return { text: 'Brackett Series (Infrared) — Invisible to human eye', color: '#e06c75' };
  return { text: 'Pfund/Humphreys Series (Far Infrared) — Invisible', color: '#e06c75' };
}

function mapWavelengthToX(wl: number, width: number): number {
  const padding = width * 0.1;
  const usable = width - padding * 2;
  return padding + ((wl - 400) / 300) * usable;
}

export default function BohrModel() {
  const canvasAtomRef = useRef<HTMLCanvasElement>(null);
  const canvasSpecRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const [mode, setMode] = useState<'emission' | 'absorption'>('emission');
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ main: string; sub: string; color: string } | null>(null);
  const [mathDisplay, setMathDisplay] = useState<{ n1: number; n2: number; wl: number | null; color: string; isAbsorption: boolean }>({
    n1: 1, n2: 2, wl: null, color: '#5eead4', isAbsorption: false,
  });

  // All mutable sim state lives in a ref — no React re-renders during animation
  const simRef = useRef({
    mode: 'emission' as 'emission' | 'absorption',
    elecN: 6,
    targetN: 6,
    hoveredN: -1,
    isAnimating: false,
    angle: 0,
    photons: [] as any[],
    burntLines: [] as { nm: number; color: string }[],
    atomW: 0, atomH: 0, atomCx: 0, atomCy: 0,
    specW: 0, specH: 0,
  });

  const setFeedbackCb = useCallback((f: { main: string; sub: string; color: string } | null) => setFeedback(f), []);
  const setMathCb = useCallback((m: typeof mathDisplay) => setMathDisplay(m), []);

  // ── DRAW ATOM ──────────────────────────────────────────────────────────────
  function drawAtom(ctx: CanvasRenderingContext2D) {
    const s = simRef.current;
    const { atomW: w, atomH: h, atomCx: cx, atomCy: cy } = s;

    const bgGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, w);
    bgGrad.addColorStop(0, '#1e293b');
    bgGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Energy axis
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(40, cy - 220, 1, 220);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('E (eV)', 24, cy - 228);
    ctx.fillText('0', 46, cy - 216);
    ctx.fillText('-13.6', 44, cy + 4);

    // Nucleus
    const pulse = Math.abs(Math.sin(Date.now() / 800)) * 2;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 12 + pulse);
    rg.addColorStop(0, '#fff');
    rg.addColorStop(0.4, '#fcd34d');
    rg.addColorStop(1, 'transparent');
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, cy, 16 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // Orbits
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.setLineDash([4, 6]);
    for (let n = 1; n <= 6; n++) {
      ctx.beginPath();
      ctx.arc(cx, cy, ORBITS[n], 0, Math.PI * 2);
      ctx.stroke();
      if (n === 1 || n === 2 || n === 6) {
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(`n=${n}`, cx + ORBITS[n] + 6, cy - 4);
      }
    }
    ctx.setLineDash([]);

    // Hover overlay
    if (s.hoveredN !== -1 && !s.isAnimating) {
      const n = s.hoveredN;
      const curN = Math.round(s.elecN);
      const isValid =
        (s.mode === 'emission' && n < curN) ||
        (s.mode === 'absorption' && n > curN);

      if (isValid) {
        const predWl = calculateWavelength(Math.min(n, curN), Math.max(n, curN));
        const predColor = getPhotonColor(predWl);

        ctx.beginPath();
        ctx.arc(cx, cy, ORBITS[n], 0, Math.PI * 2);
        ctx.strokeStyle = predColor;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = predColor;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Arrow
        const rStart = ORBITS[curN];
        const rEnd = ORBITS[n];
        const dir = rEnd > rStart ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - rStart);
        ctx.lineTo(cx, cy - rEnd);
        ctx.strokeStyle = predColor;
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(cx - 5, cy - rEnd - dir * 8);
        ctx.lineTo(cx, cy - rEnd);
        ctx.lineTo(cx + 5, cy - rEnd - dir * 8);
        ctx.stroke();

        // Tooltip
        const actionTxt = s.mode === 'emission' ? 'Emit' : 'Absorb';
        const txt = `${actionTxt} ${predWl} nm`;
        ctx.font = '600 13px "JetBrains Mono", monospace';
        const tx = cx + 10;
        const ty = cy - rStart - (rEnd - rStart) / 2 + 4;
        const metrics = ctx.measureText(txt);
        ctx.fillStyle = 'rgba(15,23,42,0.95)';
        ctx.beginPath();
        (ctx as any).roundRect(tx - 6, ty - 14, metrics.width + 12, 22, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = predColor;
        ctx.fillText(txt, tx, ty + 2);
      }
    }

    // Electron
    s.angle += 0.02 / Math.max(1, s.elecN);
    if (s.isAnimating) {
      if (Math.abs(s.elecN - s.targetN) < 0.05) {
        s.elecN = s.targetN;
        s.isAnimating = false;
      } else {
        s.elecN += (s.targetN - s.elecN) * 0.12;
      }
    }

    const fl = Math.floor(s.elecN);
    const cl = Math.ceil(s.elecN);
    const frac = s.elecN % 1;
    const currentRadius = ORBITS[fl] + frac * ((ORBITS[cl] ?? ORBITS[fl]) - ORBITS[fl]);
    const ex = cx + Math.cos(s.angle) * currentRadius;
    const ey = cy + Math.sin(s.angle) * currentRadius;

    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 14;
    ctx.shadowColor = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Photons
    for (let i = s.photons.length - 1; i >= 0; i--) {
      const p = s.photons[i];
      p.x += p.vx;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      for (let j = 0; j < 20; j++) {
        ctx.lineTo(
          p.x - j * 3 * Math.sign(p.vx),
          p.y + Math.sin((p.x - j * 3 * Math.sign(p.vx)) * 0.2) * 6,
        );
      }
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();

      if (p.type === 'emission' && p.x > w) {
        s.photons.splice(i, 1);
        recordLine(p.wl, p.color);
      } else if (p.type === 'absorption' && p.x >= cx - ORBITS[Math.round(s.elecN)]) {
        s.photons.splice(i, 1);
        s.targetN = p.targetN;
        s.isAnimating = true;
        recordLine(p.wl, 'rgba(0,0,0,0.8)');
      }
    }
  }

  // ── DRAW SPECTROMETER ──────────────────────────────────────────────────────
  function drawSpec(ctx: CanvasRenderingContext2D) {
    const s = simRef.current;
    const { specW: w, specH: h } = s;

    ctx.clearRect(0, 0, w, h);

    if (s.mode === 'emission') {
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      const base = ctx.createLinearGradient(0, 0, w, 0);
      base.addColorStop(0, 'rgba(198,120,221,0.35)');
      base.addColorStop(0.3, 'rgba(97,175,239,0.35)');
      base.addColorStop(0.5, 'rgba(86,182,194,0.35)');
      base.addColorStop(1, 'rgba(224,108,117,0.35)');
      ctx.fillStyle = base;
      ctx.fillRect(0, h - 40, w, 40);
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, '#c678dd');
      grad.addColorStop(0.3, '#61afef');
      grad.addColorStop(0.5, '#56b6c2');
      grad.addColorStop(0.7, '#e5c07b');
      grad.addColorStop(1, '#e06c75');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // UV/IR labels
    ctx.fillStyle = 'rgba(255,255,255,0.14)';
    ctx.font = '600 10px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('◀ ULTRAVIOLET (Invisible)', 10, 22);
    ctx.textAlign = 'right';
    ctx.fillText('INFRARED (Invisible) ▶', w - 10, 22);

    // Wavelength ticks
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    for (let wl = 400; wl <= 700; wl += 50) {
      const x = mapWavelengthToX(wl, w);
      ctx.fillRect(x, h - 8, 1, 8);
      ctx.fillText(String(wl), x, h - 12);
    }

    // Burnt lines
    s.burntLines.forEach((line) => {
      let x = mapWavelengthToX(line.nm, w);
      const isOffScale = line.nm < 400 || line.nm > 700;
      if (line.nm < 400) x = 4;
      if (line.nm > 700) x = w - 4;

      if (s.mode === 'emission') {
        ctx.fillStyle = line.color;
        ctx.fillRect(x - 2, 0, 4, h);
        if (!isOffScale) {
          const glow = ctx.createLinearGradient(x - 8, 0, x + 8, 0);
          glow.addColorStop(0, 'transparent');
          glow.addColorStop(0.5, line.color.replace('rgb', 'rgba').replace(')', ', 0.3)'));
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(x - 8, 0, 16, h);
        } else {
          ctx.font = '10px Inter, sans-serif';
          ctx.textAlign = line.nm < 400 ? 'left' : 'right';
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          ctx.fillText(line.nm < 400 ? '◀ Hit' : 'Hit ▶', line.nm < 400 ? x + 6 : x - 6, h - 48);
        }
      } else {
        ctx.fillStyle = 'rgba(15,23,42,0.9)';
        ctx.fillRect(x - 2, 0, 4, h);
      }
    });

    ctx.textAlign = 'left';
  }

  function recordLine(nm: number, color: string) {
    const s = simRef.current;
    const exists = s.burntLines.some((l) => Math.abs(l.nm - nm) < 1);
    if (!exists) s.burntLines.push({ nm, color });
  }

  // ── ANIMATION LOOP ─────────────────────────────────────────────────────────
  useEffect(() => {
    const cA = canvasAtomRef.current;
    const cS = canvasSpecRef.current;
    if (!cA || !cS) return;

    function resize() {
      const s = simRef.current;
      const rectA = cA!.parentElement!.getBoundingClientRect();
      s.atomW = Math.max(rectA.width, 300);
      s.atomH = Math.max(rectA.height, 480);
      s.atomCx = s.atomW / 2 + 20;
      s.atomCy = s.atomH / 2;
      cA!.width = s.atomW * 2;
      cA!.height = s.atomH * 2;
      const ctxA = cA!.getContext('2d')!;
      ctxA.scale(2, 2);

      const rectS = cS!.parentElement!.getBoundingClientRect();
      s.specW = Math.max(rectS.width, 300);
      s.specH = Math.max(rectS.height, 280);
      cS!.width = s.specW * 2;
      cS!.height = s.specH * 2;
      const ctxS = cS!.getContext('2d')!;
      ctxS.scale(2, 2);
    }

    setTimeout(() => {
      resize();

      function loop() {
        const ctxA = cA!.getContext('2d');
        const ctxS = cS!.getContext('2d');
        if (ctxA) drawAtom(ctxA);
        if (ctxS) drawSpec(ctxS);
        animRef.current = requestAnimationFrame(loop);
      }
      animRef.current = requestAnimationFrame(loop);
    }, 100);

    return () => cancelAnimationFrame(animRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync mode changes into simRef
  useEffect(() => {
    const s = simRef.current;
    s.mode = mode;
    s.burntLines = [];
    s.photons = [];
    s.isAnimating = false;
    if (mode === 'emission') {
      s.elecN = 6;
      s.targetN = 6;
    } else {
      s.elecN = 2;
      s.targetN = 2;
    }
    setFeedback(null);
    setMathDisplay({ n1: 1, n2: 2, wl: null, color: '#5eead4', isAbsorption: mode === 'absorption' });
  }, [mode]);

  // ── MOUSE INTERACTIONS ─────────────────────────────────────────────────────
  function handleAtomMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const s = simRef.current;
    if (s.isAnimating) { s.hoveredN = -1; return; }
    const rect = canvasAtomRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dist = Math.hypot(x - s.atomCx, y - s.atomCy);
    s.hoveredN = -1;
    for (let n = 1; n <= 6; n++) {
      if (Math.abs(dist - ORBITS[n]) < 22) {
        const curN = Math.round(s.elecN);
        const validEmission = s.mode === 'emission' && n < curN;
        const validAbsorption = s.mode === 'absorption' && n > curN;
        if (validEmission || validAbsorption) s.hoveredN = n;
        break;
      }
    }
  }

  function handleAtomClick() {
    const s = simRef.current;
    if (s.isAnimating || s.hoveredN === -1) return;
    const n = s.hoveredN;
    s.hoveredN = -1;

    if (s.mode === 'emission') {
      const nInitial = Math.round(s.elecN);
      s.targetN = n;
      s.isAnimating = true;
      const wl = calculateWavelength(n, nInitial);
      const color = getPhotonColor(wl);
      const info = getSeriesInfo(n);
      setMathCb({ n1: n, n2: nInitial, wl, color, isAbsorption: false });
      setFeedbackCb({ main: `Photon emitted at ${wl} nm`, sub: info.text, color });
      setTimeout(() => {
        s.photons.push({ type: 'emission', x: s.atomCx + ORBITS[nInitial], y: s.atomCy, vx: 7, color, wl });
      }, 300);
    } else {
      const nInitial = Math.round(s.elecN);
      const wl = calculateWavelength(nInitial, n);
      const color = getPhotonColor(wl);
      const info = getSeriesInfo(nInitial);
      setMathCb({ n1: nInitial, n2: n, wl, color, isAbsorption: true });
      setFeedbackCb({ main: `Photon of ${wl} nm absorbed`, sub: info.text, color });
      s.photons.push({ type: 'absorption', x: -10, y: s.atomCy, vx: 7, color, wl, targetN: n });
    }
  }

  const modeInstruction = mode === 'emission'
    ? (<>The electron is energized at <strong className="text-white">n = 6</strong>. Hover over inner orbits to preview, and <strong className="text-white">click to execute the drop</strong>.</>)
    : (<>The electron rests at <strong className="text-white">n = 2</strong>. <strong className="text-purple-300">Hover and click any outer orbit</strong> to fire the photon needed to jump.</>);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
        <div>
          <div className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase mb-1">
            Atomic Structure Simulator · Phase 2
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Bohr Model &amp; <span className="text-teal-400 italic font-serif">Spectra</span>
          </h1>
        </div>
        <div className="text-xs font-semibold text-purple-400 bg-purple-400/10 px-4 py-1.5 rounded-full border border-purple-400/20">
          QUANTUM JUMP ENGINE
        </div>
      </div>

      {/* Mode switcher + instruction */}
      <div className="flex items-center gap-6 flex-wrap bg-white/[0.03] border border-white/8 rounded-2xl px-6 py-4 mb-6">
        <div className="flex bg-black/30 p-1 rounded-xl border border-white/5 gap-1">
          <button
            onClick={() => setMode('emission')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'emission'
                ? 'bg-white/10 text-teal-300 border border-white/10 shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Emission Mode
          </button>
          <button
            onClick={() => setMode('absorption')}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'absorption'
                ? 'bg-white/10 text-purple-300 border border-white/10 shadow-md'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            Absorption Mode
          </button>
        </div>
        <p className="flex-1 min-w-[260px] text-base text-white/60 leading-relaxed">{modeInstruction}</p>
      </div>

      {/* Simulation Chambers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Atom Canvas */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/40 pl-1">
            Hydrogen Atom (Bohr Orbits)
          </div>
          <div className="relative w-full h-[480px] bg-[#0f172a] rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/40">
            <canvas
              ref={canvasAtomRef}
              className="w-full h-full block cursor-crosshair"
              onMouseMove={handleAtomMouseMove}
              onMouseLeave={() => { simRef.current.hoveredN = -1; }}
              onClick={handleAtomClick}
            />
          </div>
        </div>

        {/* Spectrometer + Feedback */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-widest text-white/40 pl-1">
            {mode === 'emission' ? 'Emission' : 'Absorption'} Spectrometer (400–700 nm)
          </div>
          <div className="relative w-full h-[280px] bg-[#0f172a] rounded-2xl overflow-hidden border border-white/8 shadow-2xl shadow-black/40">
            <canvas ref={canvasSpecRef} className="w-full h-full block" />
          </div>

          {/* Live Feedback */}
          <div className="min-h-[60px] bg-black/20 border border-white/8 rounded-xl px-4 py-3 font-mono text-sm flex flex-col justify-center">
            {feedback ? (
              <>
                <div className="text-[15px]" style={{ color: feedback.color }}>
                  {feedback.main}
                </div>
                <div className="text-[13px] text-white/40 mt-1" style={{ color: feedback.color + '99' }}>
                  {feedback.sub}
                </div>
              </>
            ) : (
              <>
                <div className="text-[15px] text-white/50">Awaiting quantum jump sequence...</div>
                <div className="text-[13px] text-white/30 mt-1">Click an orbit on the left to begin.</div>
              </>
            )}
          </div>

          {/* Rydberg Math HUD */}
          <div className="bg-black/20 border border-white/8 rounded-xl px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4 text-center">
              Rydberg Calculation
            </div>
            <div className="flex items-center justify-center gap-3 font-serif text-2xl text-white/90">
              {/* 1/λ */}
              <span className="flex flex-col items-center text-white/50 text-lg">
                <span className="border-b border-white/30 pb-0.5 px-2">1</span>
                <span className="pt-0.5 px-2">λ</span>
              </span>
              <span className="text-white/40 font-sans font-light text-xl">=</span>
              {/* RH */}
              <span className="italic text-amber-300 font-medium">R<sub className="text-[0.6em] not-italic">H</sub></span>
              {/* Bracket */}
              <span className="text-white/20 font-sans text-4xl font-light">[</span>
              {/* 1/n1² */}
              <span className="flex flex-col items-center text-lg">
                <span className="border-b border-white/30 pb-0.5 px-2">1</span>
                <span className="pt-0.5 px-2">{mathDisplay.n1}²</span>
              </span>
              <span className="text-white/40 font-sans font-light text-xl">−</span>
              {/* 1/n2² */}
              <span className="flex flex-col items-center text-lg">
                <span className="border-b border-white/30 pb-0.5 px-2">1</span>
                <span className="pt-0.5 px-2">{mathDisplay.n2}²</span>
              </span>
              <span className="text-white/20 font-sans text-4xl font-light">]</span>
            </div>
            <div
              className="text-center mt-4 font-mono text-lg px-6 py-2.5 rounded-lg bg-white/5 border border-white/10"
              style={{ color: mathDisplay.wl ? mathDisplay.color : 'rgba(255,255,255,0.3)' }}
            >
              {mathDisplay.wl
                ? `${mathDisplay.isAbsorption ? 'Absorbed ' : ''}λ = ${mathDisplay.wl} nm`
                : 'λ = — nm'}
            </div>
          </div>
        </div>
      </div>

      {/* ── SPECTROSCOPY EXPERIMENT DIAGRAM ─────────────────────────────── */}
      <div className="mt-12 mb-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-teal-400 rounded" />
          <h2 className="text-xl font-semibold text-white/90 tracking-tight">How a Line Spectrum is Produced</h2>
        </div>
        <p className="text-[17px] text-white/50 leading-relaxed mb-6 max-w-3xl">
          When hydrogen gas is energised by an electric discharge, its electrons jump to higher orbits and then
          fall back down, emitting photons of very specific wavelengths. A prism separates these wavelengths into
          distinct coloured lines — not a continuous rainbow — proving that atoms can only emit quantized energy.
        </p>

        {/* Image: Line spectrum experimental setup */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/8">
          <img
            src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/1_result.webp"
            alt="Spectroscopy experiment showing gas discharge tube, slit, prism, and resulting line spectrum"
            className="w-full h-auto"
          />
          <div className="bg-[#0d1424] px-5 py-3 text-center text-sm text-white/40 italic border-t border-white/5">
            The line spectrum of atomic hydrogen
          </div>
        </div>
      </div>

      {/* ── FULL HYDROGEN SPECTRUM (UV + Vis + IR) ────────────────────────── */}
      <div className="mt-12 mb-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-5 bg-purple-400 rounded" />
          <h2 className="text-xl font-semibold text-white/90 tracking-tight">The Complete Hydrogen Spectrum</h2>
        </div>

        {/* 2x2 Grid: Left column (text boxes) + Right column (images) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT COLUMN - Text Boxes */}
          <div className="flex flex-col gap-6">
            {/* Text Box 1: Key insight callout */}
            <div className="bg-amber-400/8 border border-amber-400/25 rounded-xl px-5 py-4 flex gap-4 items-start">
              <span className="text-2xl mt-0.5 shrink-0">💡</span>
              <p className="text-[17px] text-white/65 leading-relaxed">
                Textbooks usually show only the four coloured lines of the Balmer series because those are the ones
                visible to the human eye. But hydrogen emits <strong className="text-white/85">hundreds of spectral
                lines</strong> across ultraviolet and infrared regions — they are just invisible to us. The diagram
                shows all series on a single scale from 0 to 2000 nm.
              </p>
            </div>

            {/* Text Box 2: Continuous vs Line Spectrum Explanation */}
            <div className="bg-gradient-to-br from-indigo-500/8 to-cyan-500/8 border border-indigo-400/25 rounded-xl px-5 py-5">
              <h3 className="text-lg font-semibold text-white/90 mb-3 flex items-center gap-2">
                <span className="text-xl">🌈</span>
                Continuous vs Line Spectrum
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-white/85 text-[17px] mb-1">Continuous Spectrum</div>
                  <p className="text-[17px] text-white/60 leading-relaxed">
                    White light produces a smooth rainbow with all wavelengths blending seamlessly — no gaps or dark lines.
                  </p>
                </div>
                <div>
                  <div className="font-semibold text-white/85 text-[17px] mb-1">Line Spectrum</div>
                  <p className="text-[17px] text-white/60 leading-relaxed">
                    Elements like mercury and strontium emit only specific wavelengths, creating distinct colored lines separated by darkness — a unique fingerprint for each element.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Images */}
          <div className="flex flex-col gap-6">
            {/* Image 1: Three series of hydrogen spectrum */}
            <div 
              className="rounded-2xl overflow-hidden border border-white/8 cursor-pointer hover:border-white/20 transition-all group"
              onClick={() => setExpandedImage('https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/2_result.webp')}
            >
              <div className="relative">
                <img
                  src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/2_result.webp"
                  alt="Complete hydrogen spectrum showing Lyman, Balmer, and Paschen series across UV, visible, and IR regions"
                  className="w-full h-auto bg-[#050810]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="text-white/0 group-hover:text-white/90 text-sm font-medium transition-all">Click to expand</span>
                </div>
              </div>
              <div className="bg-[#050810] px-4 py-2 text-center text-xs text-white/40 italic border-t border-white/5">
                Three series of spectral lines of atomic hydrogen
              </div>
            </div>

            {/* Image 2: Element comparison (Hg & Sr) */}
            <div 
              className="rounded-2xl overflow-hidden border border-white/8 cursor-pointer hover:border-white/20 transition-all group"
              onClick={() => setExpandedImage('https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/3_result.webp')}
            >
              <div className="relative">
                <img
                  src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/3_result.webp"
                  alt="Comparison of emission spectra for mercury and strontium showing characteristic colored lines"
                  className="w-full h-auto bg-[#050810]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                  <span className="text-white/0 group-hover:text-white/90 text-sm font-medium transition-all">Click to expand</span>
                </div>
              </div>
              <div className="bg-[#050810] px-4 py-2 text-center text-xs text-white/40 italic border-t border-white/5">
                Emission spectra of mercury and strontium
              </div>
            </div>
          </div>
        </div>

        {/* Series reference table */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Lyman', nFinal: 1, region: 'Ultraviolet', range: '91 – 122 nm', color: '#c4b5fd', dot: 'bg-violet-400', lines: ['122 nm (n=2→1)', '103 nm (n=3→1)', '97 nm (n=4→1)'], note: 'Completely invisible. Detected only by UV instruments.' },
            { name: 'Balmer', nFinal: 2, region: 'Visible', range: '365 – 656 nm', color: '#5eead4', dot: 'bg-teal-400', lines: ['656 nm — Red', '486 nm — Cyan', '434 nm — Blue', '410 nm — Violet'], note: 'The only series visible to the naked eye.' },
            { name: 'Paschen', nFinal: 3, region: 'Near Infrared', range: '820 – 1875 nm', color: '#fb923c', dot: 'bg-orange-400', lines: ['1875 nm (n=4→3)', '1282 nm (n=5→3)', '1094 nm (n=6→3)'], note: 'Infrared — felt as heat, not seen.' },
            { name: 'Brackett', nFinal: 4, region: 'Mid Infrared', range: '1460 – 4050 nm', color: '#f87171', dot: 'bg-red-400', lines: ['4050 nm (n=5→4)', '2625 nm (n=6→4)'], note: 'Far beyond visible. Used in infrared astronomy.' },
            { name: 'Pfund', nFinal: 5, region: 'Far Infrared', range: '2280 nm+', color: '#94a3b8', dot: 'bg-slate-400', lines: ['7460 nm (n=6→5)', '4650 nm (n=7→5)'], note: 'Detected only with specialised far-IR detectors.' },
          ].map((s) => (
            <div key={s.name} className="bg-white/[0.03] border border-white/8 rounded-xl p-5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white/85 text-base">{s.name} Series</span>
                <span className="text-sm font-mono px-2.5 py-1 rounded-full border" style={{ color: s.color, borderColor: s.color + '40', background: s.color + '15' }}>
                  n→{s.nFinal}
                </span>
              </div>
              <div className="text-sm text-white/40 font-mono">{s.region} · {s.range}</div>
              <ul className="text-sm text-white/50 flex flex-col gap-1 mt-1">
                {s.lines.map(l => <li key={l} className="font-mono">· {l}</li>)}
              </ul>
              <div className="text-sm text-white/35 italic mt-1 pt-2 border-t border-white/5">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TYPES OF SPECTRA ────────────────────────────────────────────────── */}
      <div className="mt-12 mb-2">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-1 h-5 bg-amber-400 rounded" />
          <h2 className="text-xl font-semibold text-white/90 tracking-tight">Types of Spectra</h2>
        </div>

        <p className="text-[17px] text-white/60 leading-relaxed mb-6 max-w-3xl">
          Emission and absorption spectra occur in two important types:
        </p>

        {/* Emission Spectrum - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 items-center mb-8">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl font-bold text-teal-400 shrink-0">1.</span>
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">
                  Emission Spectrum
                </h3>
                <p className="text-[17px] text-white/60 leading-relaxed">
                  An <strong className="text-white/85">emission spectrum</strong>, such as the hydrogen atom line spectrum,
                  occurs when atoms in an excited state <em className="text-teal-300">emit</em> photons as they return to a
                  lower energy state. Some elements produce an intense spectral line (or several closely spaced ones) that is
                  evidence of their presence.
                </p>
                <p className="text-[17px] text-white/60 leading-relaxed mt-3">
                  <strong className="text-white/80">Flame tests</strong>, performed by placing a granule of an ionic compound
                  or a drop of its solution in a flame, rely on these intense emissions. The colors of sodium-vapor and
                  mercury-vapor streetlamps are due to intense emission lines in these elements' spectra. Similarly, the
                  brilliant colors of fireworks are produced by specific emission lines from various metal salts.
                </p>
              </div>
            </div>
          </div>
          {/* Emission SVG */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[280px]" aria-label="Emission diagram">
              {/* Nucleus */}
              <circle cx="100" cy="100" r="8" fill="#ef4444" />
              <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">+</text>
              
              {/* Orbits */}
              <circle cx="100" cy="100" r="35" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Orbit labels */}
              <text x="140" y="105" fill="#64748b" fontSize="11" fontFamily="monospace">n=1</text>
              <text x="175" y="105" fill="#64748b" fontSize="11" fontFamily="monospace">n=3</text>
              
              {/* Electron at higher orbit */}
              <circle cx="100" cy="30" r="5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5">
                <animate attributeName="cy" values="30;30;30;65;65" dur="3s" repeatCount="indefinite" />
                <animate attributeName="cx" values="100;100;100;135;135" dur="3s" repeatCount="indefinite" />
              </circle>
              
              {/* Photon emission */}
              <g opacity="0">
                <animate attributeName="opacity" values="0;0;0;1;1" dur="3s" repeatCount="indefinite" />
                <circle cx="135" cy="65" r="3" fill="#10b981">
                  <animate attributeName="cx" values="135;185" dur="1.5s" begin="1.5s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="65;35" dur="1.5s" begin="1.5s" repeatCount="indefinite" />
                </circle>
                <path d="M 135 65 L 145 60 L 140 65 L 145 70 Z" fill="#10b981">
                  <animateTransform attributeName="transform" type="translate" values="0,0;50,-30" dur="1.5s" begin="1.5s" repeatCount="indefinite" />
                </path>
              </g>
              
              {/* Arrow showing jump */}
              <path d="M 100 35 Q 115 50 135 60" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" opacity="0">
                <animate attributeName="opacity" values="0;0;0;0.8;0.8" dur="3s" repeatCount="indefinite" />
              </path>
              
              {/* Label */}
              <text x="100" y="190" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="600">Emission (n=3→n=1)</text>
            </svg>
          </div>
        </div>

        {/* Absorption Spectrum - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,280px] gap-6 items-center mb-8">
          <div>
            <div className="flex items-start gap-3 mb-3">
              <span className="text-2xl font-bold text-purple-400 shrink-0">2.</span>
              <div>
                <h3 className="text-lg font-semibold text-white/90 mb-2">
                  Absorption Spectrum
                </h3>
                <p className="text-[17px] text-white/60 leading-relaxed">
                  An <strong className="text-white/85">absorption spectrum</strong> is produced when atoms{' '}
                  <em className="text-purple-300">absorb</em> photons of certain wavelengths and become excited. When white
                  light passes through sodium vapor, for example, the absorption spectrum shows dark lines at the same
                  wavelengths as the yellow-orange lines in sodium's emission spectrum.
                </p>
                <p className="text-[17px] text-white/60 leading-relaxed mt-3">
                  The emission and absorption spectra of an element are <strong className="text-white/80">exact complements</strong> of
                  each other — the bright lines in the emission spectrum appear as dark lines at the same wavelengths in the
                  absorption spectrum.
                </p>
              </div>
            </div>
          </div>
          {/* Absorption SVG */}
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full max-w-[280px]" aria-label="Absorption diagram">
              {/* Nucleus */}
              <circle cx="100" cy="100" r="8" fill="#ef4444" />
              <text x="100" y="105" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">+</text>
              
              {/* Orbits */}
              <circle cx="100" cy="100" r="35" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
              
              {/* Orbit labels */}
              <text x="140" y="105" fill="#64748b" fontSize="11" fontFamily="monospace">n=1</text>
              <text x="175" y="105" fill="#64748b" fontSize="11" fontFamily="monospace">n=3</text>
              
              {/* Electron at lower orbit */}
              <circle cx="135" cy="100" r="5" fill="#3b82f6" stroke="#60a5fa" strokeWidth="1.5">
                <animate attributeName="cy" values="100;100;100;30;30" dur="3s" repeatCount="indefinite" />
                <animate attributeName="cx" values="135;135;135;100;100" dur="3s" repeatCount="indefinite" />
              </circle>
              
              {/* Incoming photon */}
              <g opacity="1">
                <animate attributeName="opacity" values="1;1;0;0;0" dur="3s" repeatCount="indefinite" />
                <circle cx="15" cy="145" r="3" fill="#c084fc">
                  <animate attributeName="cx" values="15;135" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="cy" values="145;100" dur="1.5s" repeatCount="indefinite" />
                </circle>
                <path d="M 15 145 L 25 140 L 20 145 L 25 150 Z" fill="#c084fc">
                  <animateTransform attributeName="transform" type="translate" values="0,0;120,-45" dur="1.5s" repeatCount="indefinite" />
                </path>
              </g>
              
              {/* Arrow showing jump */}
              <path d="M 135 95 Q 115 65 105 35" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" opacity="0">
                <animate attributeName="opacity" values="0;0;0;0.8;0.8" dur="3s" repeatCount="indefinite" />
              </path>
              
              {/* Label */}
              <text x="100" y="190" textAnchor="middle" fill="#c084fc" fontSize="12" fontWeight="600">Absorption (n=1→n=3)</text>
            </svg>
          </div>
        </div>

        {/* Grid: Astronomical callout (left) + Sodium image (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Astronomical application callout */}
          <div className="bg-gradient-to-br from-blue-500/8 to-purple-500/8 border border-blue-400/25 rounded-xl px-5 py-5 flex gap-4 items-start h-full">
            <span className="text-2xl mt-0.5 shrink-0">🔭</span>
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3">Astronomical Spectroscopy</h3>
              <p className="text-[17px] text-white/65 leading-relaxed">
                Because elements and compounds have unique line spectra, astronomers use such spectra to determine the
                composition of the Sun, planets, stars, comets, and other celestial bodies. By analyzing the specific
                wavelengths of light absorbed or emitted, we can identify which elements are present millions of
                light-years away.
              </p>
            </div>
          </div>

          {/* Image: Sodium emission vs absorption */}
          <div className="rounded-2xl overflow-hidden border border-white/8">
            <img
              src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/4_result.webp"
              alt="Comparison of sodium emission spectrum (bright yellow lines) and absorption spectrum (dark lines at same wavelengths)"
              className="w-full h-auto bg-[#050810]"
            />
            <div className="bg-[#050810] px-4 py-2.5 text-center text-sm text-white/40 italic border-t border-white/5">
              Emission and absorption spectra of sodium atoms
            </div>
          </div>
        </div>
      </div>

      {/* ── THEORY ──────────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto flex flex-col gap-8 mt-16 pb-10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-teal-400 rounded" />
          <h2 className="text-xl font-semibold text-white/90 tracking-tight">The Quantum Leap (1913)</h2>
        </div>

        <p className="text-[17px] text-white/55 leading-relaxed">
          Rutherford's model was fundamentally broken because classical physics dictated that orbiting electrons
          should continuously radiate energy and spiral into the nucleus. To save the atom, Niels Bohr proposed a
          radical new rule: <strong className="text-white/85 font-medium">Energy is quantized.</strong>
        </p>

        <p className="text-[17px] text-white/55 leading-relaxed">
          Bohr stated that electrons can only exist in specific, fixed{' '}
          <strong className="text-white/85 font-medium">Stationary Orbits</strong> (n = 1, 2, 3...). While in
          these orbits, they defy classical physics and do not radiate any energy at all.
        </p>

        <div className="border-l-[3px] border-teal-400 pl-8 py-2 my-2">
          <p className="font-serif text-2xl font-light italic text-white/90 leading-relaxed">
            &ldquo;An electron can jump from a higher energy orbit to a lower one, but it cannot exist in the
            empty space between them. The difference in energy is fired out as a single, perfectly tuned packet
            of light.&rdquo;
          </p>
        </div>

        <p className="text-[17px] text-white/55 leading-relaxed">
          <strong className="text-white/85 font-medium">Why only specific lines?</strong> Because the energy
          levels are quantized, only very precise energy differences are allowed. Each spectral line corresponds
          to one specific electron jump. This is why the hydrogen spectrum is a{' '}
          <em className="text-white/70">line spectrum</em> and not a continuous rainbow — the atom can only emit
          the exact energies that correspond to its allowed orbit transitions.
        </p>

        {/* Balmer series badges */}
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1 h-4 bg-teal-400 rounded" />
          <h3 className="text-base font-semibold text-white/80">Balmer Series — The Visible Lines</h3>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { nm: 656, bg: '#e06c75', color: '#000', label: 'Hα — Hydrogen Alpha', desc: 'Smallest jump (n=3→2). Lowest energy in the visible series. Deep red.' },
            { nm: 486, bg: '#56b6c2', color: '#000', label: 'Hβ — Hydrogen Beta',  desc: 'Jump n=4→2. Medium energy. Bright cyan-blue.' },
            { nm: 434, bg: '#61afef', color: '#000', label: 'Hγ — Hydrogen Gamma', desc: 'Jump n=5→2. High energy. Violet-blue.' },
            { nm: 410, bg: '#c678dd', color: '#fff', label: 'Hδ — Hydrogen Delta', desc: 'Largest visible jump (n=6→2). Near the UV edge. Deep violet.' },
          ].map((b) => (
            <div key={b.nm} className="flex items-center gap-4 text-[17px] text-white/55">
              <span
                className="shrink-0 px-3 py-1.5 rounded-md font-mono text-sm font-semibold"
                style={{ background: b.bg, color: b.color }}
              >
                {b.nm} nm
              </span>
              <span>
                <strong className="text-white/80 font-medium">{b.label}:</strong> {b.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Limitations */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 bg-rose-400 rounded" />
            <h2 className="text-xl font-semibold text-white/90 tracking-tight">Limitations of the Bohr Model</h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { title: 'Only works for Hydrogen', body: 'The model fails for multi-electron atoms. Electron–electron repulsion makes the simple circular orbit assumption invalid.' },
              { title: 'Cannot explain spectral line intensities', body: 'Bohr could predict wavelengths but not why some lines are brighter than others.' },
              { title: 'Violates the Uncertainty Principle', body: "Heisenberg's principle (1927) showed that an electron cannot have a precise orbit. The concept of a defined circular path is fundamentally wrong." },
              { title: 'No explanation for chemical bonding', body: 'The model cannot explain why atoms share electrons to form molecules — the foundation of all chemistry.' },
            ].map((item) => (
              <div key={item.title} className="pl-4 border-l-2 border-white/10">
                <div className="font-semibold text-white/80 mb-1">{item.title}</div>
                <div className="text-[17px] text-white/50 leading-relaxed">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FAQ SECTION ─────────────────────────────────────────────────────────── */}
      <div className="mt-16 mb-2 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 bg-emerald-400 rounded" />
          <h2 className="text-xl font-semibold text-white/90 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              q: 'What is the Bohr model of the atom?',
              a: 'The Bohr model, proposed by Niels Bohr in 1913, describes the atom as having electrons orbiting the nucleus in specific, quantized energy levels (n = 1, 2, 3...). Electrons can jump between these levels by absorbing or emitting photons of precise energies, explaining the line spectra observed in hydrogen.'
            },
            {
              q: 'Why does hydrogen emit only specific wavelengths of light?',
              a: 'Hydrogen emits only specific wavelengths because its electrons can only exist in discrete energy levels. When an electron drops from a higher level to a lower one, it releases energy as a photon with a wavelength determined by the exact energy difference between those two levels. This quantization produces the characteristic line spectrum instead of a continuous rainbow.'
            },
            {
              q: 'What is the difference between emission and absorption spectra?',
              a: 'An emission spectrum shows bright colored lines on a dark background, produced when excited atoms emit photons as electrons drop to lower energy levels. An absorption spectrum shows dark lines on a continuous bright background, created when atoms absorb specific wavelengths from white light. The two spectra are exact complements — the bright lines in emission appear as dark lines at the same wavelengths in absorption.'
            },
            {
              q: 'What is the Balmer series?',
              a: 'The Balmer series consists of spectral lines in the visible region (365–656 nm) produced when electrons in hydrogen fall from higher orbits (n ≥ 3) down to the n = 2 level. It includes four prominent visible lines: Hα (656 nm, red), Hβ (486 nm, cyan), Hγ (434 nm, blue), and Hδ (410 nm, violet).'
            },
            {
              q: 'Why are most hydrogen spectral lines invisible to the human eye?',
              a: 'Most hydrogen spectral lines fall outside the visible range (380–700 nm). The Lyman series is in the ultraviolet region (91–122 nm), while the Paschen, Brackett, and Pfund series are in the infrared region (820 nm and beyond). Only the Balmer series falls within the visible spectrum, which is why textbooks typically show only those four colored lines.'
            },
            {
              q: 'What are the limitations of the Bohr model?',
              a: 'The Bohr model only works accurately for hydrogen and fails for multi-electron atoms. It cannot explain spectral line intensities, violates Heisenberg\'s Uncertainty Principle by assuming electrons have definite orbits, and provides no explanation for chemical bonding. Modern quantum mechanics replaced it with the more accurate orbital model.'
            },
            {
              q: 'How do astronomers use spectroscopy to study distant stars?',
              a: 'Astronomers analyze the light from stars and galaxies to identify absorption or emission lines characteristic of specific elements. By comparing these spectral fingerprints to known laboratory spectra, they can determine which elements are present in celestial bodies millions of light-years away, along with their temperatures, velocities, and compositions.'
            },
            {
              q: 'What is the Rydberg formula?',
              a: 'The Rydberg formula calculates the wavelength of light emitted or absorbed during electron transitions in hydrogen: 1/λ = R_H × (1/n₁² - 1/n₂²), where R_H is the Rydberg constant (0.01097 nm⁻¹), n₁ is the lower energy level, and n₂ is the higher energy level. This formula accurately predicts all hydrogen spectral lines.'
            }
          ].map((faq, i) => (
            <details key={i} className="bg-white/[0.02] border border-white/8 rounded-xl p-5 group">
              <summary className="font-semibold text-white/85 cursor-pointer list-none flex items-start gap-3 text-[17px]">
                <span className="text-emerald-400 shrink-0 group-open:rotate-90 transition-transform">▶</span>
                <span>{faq.q}</span>
              </summary>
              <p className="text-[17px] text-white/60 leading-relaxed mt-4 ml-6">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Image Expansion Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={expandedImage}
              alt="Expanded spectrum diagram"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
