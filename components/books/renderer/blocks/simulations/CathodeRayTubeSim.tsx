'use client';

// Source: NCERT Class 11 Chemistry, Chapter 2 — Structure of Atom, Sections 2.1.1–2.1.2
// Key facts modelled:
//   • Discharge requires low pressure (~0.001 mmHg) AND high voltage (several kV)
//   • Cathode rays = electrons; e/m constant regardless of gas or electrode material
//   • In E-field: cathode rays deflect toward positive plate (upward in this layout)
//   • In B-field: cathode rays deflect opposite direction; Thomson balanced E & B to find e/m
//   • Canal rays = positive ions moving toward cathode through holes; e/m varies with gas

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  alpha: number;
  type: 'electron' | 'ion';
}

// Module-level helper — draws a rounded rect path (no fill/stroke, caller handles that)
function rrPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export default function CathodeRayTubeSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const ions      = useRef<Particle[]>([]);
  const lastSpawn = useRef(0);

  const [voltage,  setVoltage]  = useState(0);
  const [vacSlider, setVacSlider] = useState(0);  // 0 = atmospheric, 100 = high vacuum
  const [eField,   setEField]   = useState(false);
  const [bField,   setBField]   = useState(false);

  // Sync controls to a ref so the animation loop can read them without stale closures
  const ctrl = useRef({ voltage: 0, vacSlider: 0, eField: false, bField: false,
                        isDischarging: false, glow: 0 });
  useEffect(() => {
    // Need ≥ 70 on vacuum slider AND voltage above pressure-dependent threshold
    const vacOk = vacSlider >= 70;
    const threshold = vacSlider >= 95 ? 1500
                    : vacSlider >= 85 ? 3000
                    : vacSlider >= 75 ? 5000
                    : 8000;
    const isDischarging = vacOk && voltage >= threshold;
    const glow = isDischarging
      ? Math.min(1, (voltage - threshold) / Math.max(1, 10000 - threshold))
      : 0;
    ctrl.current = { voltage, vacSlider, eField, bField, isDischarging, glow };
  }, [voltage, vacSlider, eField, bField]);

  // ── Canvas sizing (split from the animation loop so ResizeObserver stays tidy) ──
  const dprRef = useRef(1);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const resize = () => {
      const W = (canvas.parentElement?.offsetWidth ?? 800);
      const H = 340;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  // ── Animation loop via shared hook ───────────────────────────────────────
  // Pauses automatically when tab hidden or canvas off-screen. `frameDelta`
  // (= delta * 60) scales every per-frame-tuned constant so visuals stay
  // identical across refresh rates. `elapsed` (seconds) drives the spawn
  // cooldown, replacing the old `performance.now()` timestamp in ms.
  useAnimationFrame(
    (delta, elapsed) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = dprRef.current;
      const frameDelta = delta * 60;
      const { voltage: V, vacSlider, eField, bField, isDischarging, glow } = ctrl.current;
      const W = canvas.width  / dpr;
      const H = canvas.height / dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // ── Layout constants ──────────────────────────────────────────────────
      const TX   = 50;           // tube left x
      const TW   = W - 100;      // tube width
      const TY   = 90;           // tube top y
      const TH   = 175;          // tube height
      const TCY  = TY + TH / 2;  // tube vertical centre
      const CATX = TX + 55;      // cathode x
      const ANOX = TX + TW - 55; // anode x
      // Electric field plates span middle 50% of tube
      const PX1  = TX + TW * 0.28;
      const PX2  = TX + TW * 0.72;
      const PTOP = TY + 18;      // top plate y
      const PBOT = TY + TH - 18; // bottom plate y

      // ── Clear ─────────────────────────────────────────────────────────────
      ctx.fillStyle = '#050614';
      ctx.fillRect(0, 0, W, H);

      // ── High-voltage wire (dashed arc above tube) ─────────────────────────
      const wireY = TY - 32;
      ctx.strokeStyle = V > 0 ? 'rgba(251,191,36,0.55)' : 'rgba(71,85,105,0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      ctx.moveTo(CATX, TY);
      ctx.lineTo(CATX, wireY);
      ctx.lineTo(ANOX, wireY);
      ctx.lineTo(ANOX, TY);
      ctx.stroke();
      ctx.setLineDash([]);

      // ── Battery symbol ────────────────────────────────────────────────────
      const batX = (CATX + ANOX) / 2;
      const batY = wireY;
      ctx.strokeStyle = V > 0 ? 'rgba(251,191,36,0.75)' : 'rgba(71,85,105,0.5)';
      ctx.lineWidth = 2;
      // short line (−)
      ctx.beginPath(); ctx.moveTo(batX - 14, batY - 6); ctx.lineTo(batX - 14, batY + 6); ctx.stroke();
      // long line (+)
      ctx.beginPath(); ctx.moveTo(batX + 14, batY - 12); ctx.lineTo(batX + 14, batY + 12); ctx.stroke();
      // connecting lines
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(batX - 14, batY); ctx.lineTo(batX - 26, batY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(batX + 14, batY); ctx.lineTo(batX + 26, batY); ctx.stroke();

      // Voltage label above battery
      ctx.font = 'bold 12px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = V > 0 ? '#fbbf24' : '#475569';
      ctx.fillText(`${V.toLocaleString()} V`, batX, wireY - 14);

      // − / + polarity labels on the wire legs
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#818cf8';
      ctx.fillText('−', CATX, wireY - 6);
      ctx.fillStyle = '#f87171';
      ctx.fillText('+', ANOX, wireY - 6);

      // ── Glass tube ────────────────────────────────────────────────────────
      const tubeGrad = ctx.createLinearGradient(TX, TY, TX, TY + TH);
      tubeGrad.addColorStop(0,   'rgba(120,190,255,0.07)');
      tubeGrad.addColorStop(0.5, 'rgba(80,140,255,0.03)');
      tubeGrad.addColorStop(1,   'rgba(120,190,255,0.07)');
      ctx.fillStyle = tubeGrad;
      rrPath(ctx, TX, TY, TW, TH, 22);
      ctx.fill();
      ctx.strokeStyle = 'rgba(100,170,255,0.22)';
      ctx.lineWidth = 1.5;
      rrPath(ctx, TX, TY, TW, TH, 22);
      ctx.stroke();

      // ── Inner discharge glow ──────────────────────────────────────────────
      if (glow > 0) {
        const glowGrad = ctx.createRadialGradient(
          (CATX + ANOX) / 2, TCY, 0,
          (CATX + ANOX) / 2, TCY, TW * 0.5
        );
        glowGrad.addColorStop(0,   `rgba(160,120,255,${0.22 * glow})`);
        glowGrad.addColorStop(0.5, `rgba(100,150,255,${0.12 * glow})`);
        glowGrad.addColorStop(1,   'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        rrPath(ctx, CATX + 5, TY + 5, ANOX - CATX - 10, TH - 10, 15);
        ctx.fill();
      }

      // ── E-field plates ────────────────────────────────────────────────────
      if (eField) {
        // Top plate = positive (red)
        ctx.fillStyle = 'rgba(239,68,68,0.75)';
        ctx.fillRect(PX1, PTOP, PX2 - PX1, 7);
        // Bottom plate = negative (indigo)
        ctx.fillStyle = 'rgba(129,140,248,0.75)';
        ctx.fillRect(PX1, PBOT - 7, PX2 - PX1, 7);

        // Downward field lines
        ctx.setLineDash([4, 7]);
        ctx.lineWidth = 1;
        const nLines = 6;
        for (let i = 0; i < nLines; i++) {
          const lx = PX1 + (PX2 - PX1) * (i + 0.5) / nLines;
          ctx.strokeStyle = 'rgba(239,68,68,0.22)';
          ctx.beginPath(); ctx.moveTo(lx, PTOP + 7); ctx.lineTo(lx, PBOT - 7); ctx.stroke();
        }
        ctx.setLineDash([]);

        // Plate charge labels — above top plate and below bottom plate
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f87171';
        ctx.fillText('+ + + + +', (PX1 + PX2) / 2, PTOP - 5);
        ctx.fillStyle = '#a5b4fc';
        ctx.fillText('− − − − −', (PX1 + PX2) / 2, PBOT + 18);

        // E-field label — right of plates, vertically centred
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.fillText('E ↓', PX2 + 10, TCY + 5);
      }

      // ── B-field indicators (⊗ = into screen) ─────────────────────────────
      if (bField) {
        ctx.font = '15px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(52,211,153,0.65)';
        const bRows = [TCY - 42, TCY, TCY + 42];
        const bCols = [
          PX1 + (PX2 - PX1) * 0.2,
          PX1 + (PX2 - PX1) * 0.5,
          PX1 + (PX2 - PX1) * 0.8,
        ];
        for (const by of bRows)
          for (const bx of bCols)
            ctx.fillText('⊗', bx, by + 6);

        // B-field label — right of plates (below E label if both on)
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillStyle = '#34d399';
        const bLabelY = eField ? TCY + 24 : TCY + 5;
        ctx.fillText('B ⊗', PX2 + 10, bLabelY);
      }

      // ── Cathode electrode ─────────────────────────────────────────────────
      // Body
      const cathGlow = glow > 0 ? `rgba(160,120,255,${0.7 * glow})` : '#334155';
      ctx.fillStyle = '#334155';
      ctx.fillRect(CATX - 9, TY + 22, 18, TH - 44);
      // Holes (3 slots)
      ctx.fillStyle = '#050614';
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(CATX - 9, TY + 48 + i * 26, 18, 9);
      }
      // Cathode glow
      if (glow > 0) {
        ctx.shadowColor = 'rgba(160,120,255,0.9)';
        ctx.shadowBlur  = 18 * glow;
        ctx.fillStyle   = cathGlow;
        ctx.fillRect(CATX - 9, TY + 22, 18, TH - 44);
        ctx.shadowBlur  = 0;
        // Re-draw holes over glow
        ctx.fillStyle = '#050614';
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(CATX - 9, TY + 48 + i * 26, 18, 9);
        }
      }

      // ── Anode electrode ───────────────────────────────────────────────────
      ctx.fillStyle = '#334155';
      ctx.fillRect(ANOX - 9, TY + 22, 18, TH - 44);
      if (glow > 0) {
        ctx.shadowColor = 'rgba(100,200,255,0.8)';
        ctx.shadowBlur  = 12 * glow;
        ctx.fillStyle   = `rgba(100,200,255,${0.45 * glow})`;
        ctx.fillRect(ANOX - 9, TY + 22, 18, TH - 44);
        ctx.shadowBlur  = 0;
      }

      // ── Electrode text labels (below tube) ────────────────────────────────
      const labelY1 = TY + TH + 16;
      const labelY2 = TY + TH + 29;
      ctx.shadowBlur = 0;

      ctx.textAlign = 'center';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('CATHODE', CATX, labelY1);
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#818cf8';
      ctx.fillText('(−)', CATX, labelY2);

      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('ANODE', ANOX, labelY1);
      ctx.font = '11px system-ui, sans-serif';
      ctx.fillStyle = '#f87171';
      ctx.fillText('(+)', ANOX, labelY2);

      // Pressure label — inside tube, bottom-right corner (avoids ANODE label overlap)
      ctx.textAlign = 'right';
      const pLabel = vacSlider <= 0  ? '760 mmHg'
                   : vacSlider >= 100 ? '0.001 mmHg'
                   : `~${(760 * Math.pow(0.001 / 760, vacSlider / 100)).toExponential(1)} mmHg`;
      ctx.font = 'bold 9px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(51,65,85,0.9)';
      ctx.fillText('PRESSURE', TX + TW - 12, TY + TH - 24);
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(71,85,105,0.85)';
      ctx.fillText(pLabel, TX + TW - 12, TY + TH - 12);

      // ── Status message (top-left of canvas) ──────────────────────────────
      ctx.textAlign = 'left';
      if (isDischarging) {
        ctx.font = 'bold 15px system-ui, sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.fillText('⚡ Discharge active', TX, 26);
        ctx.font = '13px system-ui, sans-serif';
        ctx.fillStyle = '#6ee7b7';
        ctx.fillText(`Glow: ${Math.round(glow * 100)}%  |  Voltage: ${V.toLocaleString()} V`, TX, 44);
      } else {
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillStyle = '#f59e0b';
        if (vacSlider < 70) {
          ctx.fillText('↑ Reduce pressure (pump out the air) to enable discharge', TX, 26);
        } else {
          const thr = vacSlider >= 95 ? 1500 : vacSlider >= 85 ? 3000 : vacSlider >= 75 ? 5000 : 8000;
          ctx.fillText(`↑ Increase voltage to ≥ ${thr.toLocaleString()} V to start discharge`, TX, 26);
        }
      }

      // ── Particle system ───────────────────────────────────────────────────
      // Cathode rays (electrons) spawn just above centre; canal rays (ions) just below.
      // Fields are only applied inside the plate region (PX1–PX2) so particles travel
      // straight before entering and only curve within the field section.
      const eCenterY = TCY - 18;   // electron beam lane — above centre
      const iCenterY = TCY + 18;   // ion beam lane — below centre

      // Spawn cooldown — was `ts - lastSpawn > 45` (ms), now in seconds.
      if (isDischarging && elapsed - lastSpawn.current > 0.045) {
        lastSpawn.current = elapsed;
        const n = Math.max(1, Math.round(glow * 3));
        for (let i = 0; i < n; i++) {
          if (particles.current.length < 55) {
            particles.current.push({
              x: CATX + 14,
              y: eCenterY + (Math.random() - 0.5) * 10,
              vx: 5.5 + Math.random() * 2.0,
              vy: (Math.random() - 0.5) * 0.3,
              alpha: 1, type: 'electron',
            });
          }
        }
        if (ions.current.length < 22 && Math.random() < 0.65) {
          ions.current.push({
            x: ANOX - 14,
            y: iCenterY + (Math.random() - 0.5) * 10,
            vx: -(3.5 + Math.random() * 1.5),
            vy: (Math.random() - 0.5) * 0.25,
            alpha: 1, type: 'ion',
          });
        }
      }

      // Update & draw electrons (cathode rays)
      // E-field: +plate on top → electrons go UP (vy decreases) — only inside plate region
      // B-field (into screen): Lorentz on rightward e⁻ → goes DOWN (angle rotates +) — plate region only
      particles.current = particles.current.filter(p => {
        const inPlate = p.x >= PX1 && p.x <= PX2;
        if (eField && inPlate) p.vy -= 0.016 * frameDelta;
        if (bField && inPlate) {
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const ang = Math.atan2(p.vy, p.vx) + 0.005 * frameDelta;
          p.vx = spd * Math.cos(ang);
          p.vy = spd * Math.sin(ang);
        }
        p.x += p.vx * frameDelta; p.y += p.vy * frameDelta;
        p.alpha -= 0.002 * frameDelta;   // very slow fade — particle stays bright across full tube
        // Fade out in last 25 px before reaching anode
        const distToAnode = ANOX - p.x;
        const drawAlpha = p.alpha * Math.min(1, distToAnode / 25);
        const alive = p.x < ANOX + 3 && p.y > TY + 10 && p.y < TY + TH - 10 && p.alpha > 0;
        if (alive && drawAlpha > 0.02) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(160,185,255,${drawAlpha})`;
          ctx.shadowColor = 'rgba(120,160,255,0.8)';
          ctx.shadowBlur  = 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        return alive;
      });

      // Update & draw ions (canal rays — positive, moving cathode-ward)
      // E-field: ions go DOWN (toward −plate at bottom) — plate region only
      // B-field (into screen): Lorentz on leftward + charge → UP (angle rotates −) — plate region only
      ions.current = ions.current.filter(p => {
        const inPlate = p.x >= PX1 && p.x <= PX2;
        if (eField && inPlate) p.vy += 0.011 * frameDelta;
        if (bField && inPlate) {
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          const ang = Math.atan2(p.vy, p.vx) - 0.004 * frameDelta;
          p.vx = spd * Math.cos(ang);
          p.vy = spd * Math.sin(ang);
        }
        p.x += p.vx * frameDelta; p.y += p.vy * frameDelta;
        p.alpha -= 0.002 * frameDelta;
        const distToCath = p.x - CATX;
        const drawAlpha = p.alpha * 0.85 * Math.min(1, distToCath / 25);
        const alive = p.x > CATX - 3 && p.y > TY + 10 && p.y < TY + TH - 10 && p.alpha > 0;
        if (alive && drawAlpha > 0.02) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(251,146,60,${drawAlpha})`;
          ctx.shadowColor = 'rgba(251,146,60,0.65)';
          ctx.shadowBlur  = 7;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        return alive;
      });

      // ── Beam direction labels (shown when discharging) ────────────────────
      if (isDischarging && glow > 0.15) {
        const labelAlpha = Math.min(1, glow * 2.5);
        const midX = (CATX + ANOX) / 2;
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px system-ui, sans-serif';
        // Cathode ray label sits above the electron lane (eCenterY - 18)
        ctx.fillStyle = `rgba(160,185,255,${labelAlpha})`;
        ctx.fillText('← Cathode rays  (e⁻,  e/m constant)', midX, eCenterY - 20);
        // Canal ray label sits below the ion lane (iCenterY + 18)
        ctx.fillStyle = `rgba(251,146,60,${labelAlpha * 0.85})`;
        ctx.fillText('Canal rays  (positive ions,  e/m varies) →', midX, iCenterY + 22);
      }
    },
    { target: canvasRef }
  );

  function handleReset() {
    setVoltage(0); setVacSlider(0); setEField(false); setBField(false);
    particles.current = []; ions.current = [];
  }

  // Derived UI helpers
  const vacOk = vacSlider >= 70;
  const threshold = vacSlider >= 95 ? 1500 : vacSlider >= 85 ? 3000 : vacSlider >= 75 ? 5000 : 8000;
  const isDischarging = vacOk && voltage >= threshold;
  const pressureDisplay = vacSlider <= 0  ? '760 mmHg (atmospheric)'
                        : vacSlider >= 100 ? '0.001 mmHg (high vacuum)'
                        : `${(760 * Math.pow(0.001 / 760, vacSlider / 100)).toExponential(2)} mmHg`;

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0' }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Cathode Ray <span style={{ color: '#6366f1' }}>Tube</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>
            Interactive Discharge Simulator · J.J. Thomson, 1897
          </p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          NCERT Ch. 2 · Structure of Atom
        </div>
      </div>

      {/* ── Canvas ─────────────────────────────────────────────────────────── */}
      <div className="w-full overflow-hidden rounded-2xl"
        style={{ background: '#050614', border: '1px solid rgba(99,102,241,0.18)' }}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%' }} />
      </div>

      {/* ── Sliders ────────────────────────────────────────────────────────── */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Voltage */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#fbbf24' }}>
              Voltage
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: '#fbbf24' }}>
              {voltage.toLocaleString()} V
            </span>
          </div>
          <input type="range" min={0} max={10000} step={100}
            value={voltage}
            onChange={e => setVoltage(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#fbbf24' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: '#475569' }}>0 V</span>
            {vacOk && (
              <span className="text-[10px]" style={{ color: voltage >= threshold ? '#34d399' : '#f59e0b' }}>
                {voltage >= threshold ? '✓ discharge threshold met' : `Need ≥ ${threshold.toLocaleString()} V`}
              </span>
            )}
            <span className="text-[10px]" style={{ color: '#475569' }}>10,000 V</span>
          </div>
        </div>

        {/* Pressure / Vacuum */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#60a5fa' }}>
              Vacuum (pump out air)
            </span>
            <span className="text-sm font-bold tabular-nums" style={{ color: '#60a5fa' }}>
              {pressureDisplay}
            </span>
          </div>
          <input type="range" min={0} max={100} step={1}
            value={vacSlider}
            onChange={e => setVacSlider(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: '#60a5fa' }}
          />
          <div className="flex justify-between mt-1">
            <span className="text-[10px]" style={{ color: '#475569' }}>760 mmHg (air)</span>
            <span className="text-[10px]" style={{ color: vacOk ? '#34d399' : '#f59e0b' }}>
              {vacOk ? '✓ low enough for discharge' : 'too dense — pump further'}
            </span>
            <span className="text-[10px]" style={{ color: '#475569' }}>0.001 mmHg</span>
          </div>
        </div>
      </div>

      {/* ── Field toggles + reset ───────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap items-center gap-3">

        {/* E-field */}
        <button
          onClick={() => setEField(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            background: eField ? 'rgba(239,68,68,0.14)' : 'rgba(255,255,255,0.04)',
            border:     `1px solid ${eField ? 'rgba(239,68,68,0.45)' : 'rgba(255,255,255,0.09)'}`,
            color:      eField ? '#f87171' : '#64748b',
          }}
        >
          <span style={{ fontSize: 16 }}>{eField ? '⚡' : '◌'}</span>
          Electric Field (E)
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded"
            style={{ background: eField ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                     color: eField ? '#f87171' : '#475569' }}>
            {eField ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* B-field */}
        <button
          onClick={() => setBField(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            background: bField ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
            border:     `1px solid ${bField ? 'rgba(16,185,129,0.38)' : 'rgba(255,255,255,0.09)'}`,
            color:      bField ? '#34d399' : '#64748b',
          }}
        >
          <span style={{ fontSize: 16 }}>{bField ? '🧲' : '◌'}</span>
          Magnetic Field (B)
          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded"
            style={{ background: bField ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)',
                     color: bField ? '#34d399' : '#475569' }}>
            {bField ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Status badge */}
        <div className="flex-1 flex justify-end">
          <div className="px-3 py-2 rounded-lg text-xs font-bold"
            style={{
              background: isDischarging ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.03)',
              border:     `1px solid ${isDischarging ? 'rgba(16,185,129,0.28)' : 'rgba(255,255,255,0.07)'}`,
              color:      isDischarging ? '#34d399' : '#475569',
            }}>
            {isDischarging ? '⚡ Discharge active' : 'No discharge'}
          </div>
        </div>

        {/* Reset */}
        <button onClick={handleReset}
          className="px-4 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.28)', color: '#a5b4fc' }}>
          ↺ Reset
        </button>
      </div>

      {/* ── Contextual notes ────────────────────────────────────────────────── */}
      {eField && bField && isDischarging && (
        <div className="mt-3 px-4 py-2.5 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.18)', color: '#fbbf24' }}>
          <strong>Thomson's key insight:</strong> With both fields on, they oppose each other.
          Thomson tuned E and B until the beam travelled <em>straight</em> — at that balance point,
          electric force = magnetic force, so <strong>eE = evB</strong>, giving <strong>v = E/B</strong>.
          Measuring the deflection then yielded <strong>e/m = 1.758 × 10¹¹ C kg⁻¹</strong>,
          the same for <em>every</em> gas and cathode material.
        </div>
      )}

      {!eField && !bField && isDischarging && (
        <div className="mt-3 px-4 py-2.5 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(129,140,248,0.18)', color: '#c4b5fd' }}>
          <strong>Observe:</strong> Blue dots = electrons (cathode rays) — travel cathode → anode
          in a <em>straight line</em>. Orange dots = positive ions (canal rays) — travel the
          opposite direction through the holes in the cathode.
          Try switching on the Electric Field or Magnetic Field to see the beam deflect.
        </div>
      )}

      {eField && !bField && isDischarging && (
        <div className="mt-3 px-4 py-2.5 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', color: '#fca5a5' }}>
          <strong>E-field ON:</strong> Electrons carry negative charge and are attracted toward the
          positive plate (top). The beam curves <strong>upward</strong>.
          This was the first proof that cathode rays are negatively charged particles.
        </div>
      )}

      {!eField && bField && isDischarging && (
        <div className="mt-3 px-4 py-2.5 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.18)', color: '#6ee7b7' }}>
          <strong>B-field ON (into screen):</strong> The Lorentz force on rightward-moving electrons
          is directed <strong>downward</strong> — opposite to the E-field deflection.
          This opposing deflection is what Thomson used to balance the two forces.
        </div>
      )}

    </div>
  );
}
