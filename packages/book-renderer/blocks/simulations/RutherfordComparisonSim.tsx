'use client';

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

/**
 * Standalone Thomson vs Rutherford side-by-side alpha-scattering simulator.
 * Extracted from AtomicModels.tsx — contains only the two simulation chambers,
 * controls, and live scattering statistics. No tabs, no theory sections.
 */
export default function RutherfordComparisonSim() {
  const canvasThomsonRef = useRef<HTMLCanvasElement>(null);
  const canvasRutherfordRef = useRef<HTMLCanvasElement>(null);
  const [gunY, setGunY] = useState(0);
  const [autoFire, setAutoFire] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [stats, setStats] = useState({ straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 });
  const [statsStarted, setStatsStarted] = useState(false);

  type Particle = { x: number; y: number; vx: number; vy: number; trail: Array<{ x: number; y: number }>; type: string; active: boolean; initialY?: number; maxDeflection?: number };
  type Flash = { x: number; y: number; life: number; ctx: CanvasRenderingContext2D };

  const engineRef = useRef<{
    thCtx: CanvasRenderingContext2D | null;
    ruCtx: CanvasRenderingContext2D | null;
    w: number; h: number; cx: number; cy: number;
    particles: Particle[];
    flashes: Flash[];
    gunY: number; autoFire: boolean; slowMotion: boolean; lastFire: number;
  } | null>(null);

  const statsRef = useRef({ straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 });
  const statsStartedRef = useRef(false);

  // ── Canvas init (runs once on mount) ─────────────────────────────────────
  useEffect(() => {
    const ENGINE = {
      thCtx: null as CanvasRenderingContext2D | null,
      ruCtx: null as CanvasRenderingContext2D | null,
      w: 0, h: 0, cx: 0, cy: 0,
      particles: [] as Particle[],
      flashes: [] as Flash[],
      gunY: 0, autoFire: true, slowMotion: false, lastFire: 0,
    };
    engineRef.current = ENGINE;

    const initSim = () => {
      const cTh = canvasThomsonRef.current;
      const cRu = canvasRutherfordRef.current;
      if (!cTh || !cRu) return;
      const rect = cTh.parentElement?.getBoundingClientRect();
      if (!rect) return;
      ENGINE.w = Math.max(rect.width, 300);
      ENGINE.h = Math.max(rect.height, 200);
      ENGINE.cx = ENGINE.w / 2;
      ENGINE.cy = ENGINE.h / 2;
      [cTh, cRu].forEach((c) => {
        c.width = ENGINE.w * 2;
        c.height = ENGINE.h * 2;
        const ctx = c.getContext('2d');
        if (ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.scale(2, 2); }
      });
      ENGINE.thCtx = cTh.getContext('2d');
      ENGINE.ruCtx = cRu.getContext('2d');
    };

    const timer = setTimeout(initSim, 100);

    return () => {
      clearTimeout(timer);
      ENGINE.particles = [];
      ENGINE.flashes = [];
    };
  }, []);

  // ── Animation loop via shared hook ───────────────────────────────────────
  // Pauses automatically when tab hidden or canvas off-screen. Uses real delta
  // (in seconds) scaled by 60 so the legacy per-frame-tuned constants stay
  // visually identical across refresh rates. `elapsed` drives the fire cooldown
  // (previously a `performance.now()` timestamp in ms).
  useAnimationFrame(
    (delta, elapsed) => {
      const ENGINE = engineRef.current;
      if (!ENGINE) return;
      const tCtx = ENGINE.thCtx;
      const rCtx = ENGINE.ruCtx;
      if (!tCtx || !rCtx) return;

      const frameDelta = delta * 60;
      const w = ENGINE.w; const h = ENGINE.h;
      const cx = ENGINE.cx; const cy = ENGINE.cy;

      tCtx.clearRect(0, 0, w, h);
      rCtx.clearRect(0, 0, w, h);

      [tCtx, rCtx].forEach((c) => {
        c.beginPath(); c.rect(5, 5, w - 10, h - 10);
        c.strokeStyle = 'rgba(16, 185, 129, 0.15)'; c.lineWidth = 10; c.stroke();
        c.strokeStyle = 'rgba(16, 185, 129, 0.4)'; c.lineWidth = 2; c.stroke();
      });

      const atomR = 120;

      // Thomson model: diffuse positive sphere
      const tg = tCtx.createRadialGradient(cx, cy, 0, cx, cy, atomR);
      tg.addColorStop(0, 'rgba(224, 108, 117, 0.25)');
      tg.addColorStop(0.7, 'rgba(224, 108, 117, 0.2)');
      tg.addColorStop(1, 'rgba(224, 108, 117, 0.15)');
      tCtx.fillStyle = tg;
      tCtx.beginPath(); tCtx.arc(cx, cy, atomR, 0, Math.PI * 2); tCtx.fill();
      tCtx.strokeStyle = 'rgba(224, 108, 117, 0.6)'; tCtx.lineWidth = 2; tCtx.setLineDash([]); tCtx.stroke();
      tCtx.fillStyle = '#3b82f6';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = ((i % 3) + 1) * 30;
        tCtx.beginPath(); tCtx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2); tCtx.fill();
      }

      // Rutherford model: tiny dense nucleus in mostly-empty space
      rCtx.strokeStyle = 'rgba(100, 200, 255, 0.3)'; rCtx.lineWidth = 2; rCtx.setLineDash([]);
      rCtx.beginPath(); rCtx.arc(cx, cy, atomR, 0, Math.PI * 2); rCtx.stroke();
      const rg = rCtx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      rg.addColorStop(0, '#fff'); rg.addColorStop(0.2, '#e5b567'); rg.addColorStop(1, 'transparent');
      rCtx.fillStyle = rg;
      rCtx.beginPath(); rCtx.arc(cx, cy, 15, 0, Math.PI * 2); rCtx.fill();

      // Fire cooldown — was `timestamp - lastFire > 50` ms, now in seconds.
      if (ENGINE.autoFire && elapsed - ENGINE.lastFire > 0.05) {
        let yOff: number;
        if (Math.random() < 0.70) {
          yOff = (Math.random() < 0.5 ? 1 : -1) * (atomR + Math.random() * 30);
        } else {
          yOff = (Math.random() - 0.5) * atomR * 2;
        }
        const v = ENGINE.slowMotion ? 4 : 8;
        ENGINE.particles.push(
          { x: 10, y: ENGINE.cy + yOff, vx: v, vy: 0, trail: [], type: 'thomson', active: true, initialY: ENGINE.cy + yOff },
          { x: 10, y: ENGINE.cy + yOff, vx: v, vy: 0, trail: [], type: 'rutherford', active: true, initialY: ENGINE.cy + yOff, maxDeflection: 0 }
        );
        ENGINE.lastFire = elapsed;
      }

      for (let i = ENGINE.particles.length - 1; i >= 0; i--) {
        const p = ENGINE.particles[i];
        if (!p.active) continue;
        const ctx = p.type === 'thomson' ? tCtx : rCtx;

        if (p.type === 'rutherford') {
          const dx = p.x - cx; const dy = p.y - cy;
          const distSq = dx * dx + dy * dy; const dist = Math.sqrt(distSq);
          if (distSq > 10 && distSq < 1500) {
            const F = 3000 / (distSq * dist);
            p.vx += F * (dx / dist) * frameDelta;
            p.vy += F * (dy / dist) * frameDelta;
          }
        } else {
          if (Math.hypot(p.x - cx, p.y - cy) < atomR) {
            p.vy += (Math.random() - 0.5) * 0.05 * frameDelta;
          }
        }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();
        p.x += p.vx * frameDelta;
        p.y += p.vy * frameDelta;

        if (p.x > w - 5 || p.x < 5 || p.y > h - 5 || p.y < 5) {
          p.active = false;
          ENGINE.flashes.push({ ctx, x: p.x, y: p.y, life: 1.0 });
          if (p.type === 'rutherford') {
            const s = statsRef.current;
            s.total++;
            if (p.x >= w - 5) s.straight++;
            else if (p.x <= 5) s.largeDeflection++;
            else s.smallDeflection++;
            if (!statsStartedRef.current) { statsStartedRef.current = true; setStatsStarted(true); }
            setStats({ ...s });
          }
          ENGINE.particles.splice(i, 1); continue;
        }

        if (p.trail.length > 1) {
          ctx.beginPath(); ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j].x, p.trail[j].y);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.stroke();
        }
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
      }

      for (let i = ENGINE.flashes.length - 1; i >= 0; i--) {
        const f = ENGINE.flashes[i];
        f.life -= 0.05 * frameDelta;
        if (f.life <= 0) { ENGINE.flashes.splice(i, 1); continue; }
        f.ctx.fillStyle = `rgba(16, 185, 129, ${f.life})`;
        f.ctx.beginPath(); f.ctx.arc(f.x, f.y, 6 + (1 - f.life) * 10, 0, Math.PI * 2); f.ctx.fill();
        f.ctx.fillStyle = `rgba(255, 255, 255, ${f.life})`;
        f.ctx.beginPath(); f.ctx.arc(f.x, f.y, 2, 0, Math.PI * 2); f.ctx.fill();
      }
    },
    { target: canvasRutherfordRef }
  );

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gunY = gunY;
      engineRef.current.autoFire = autoFire;
      engineRef.current.slowMotion = slowMotion;
    }
  }, [gunY, autoFire, slowMotion]);

  const handleFire = () => {
    setAutoFire(false);
    if (engineRef.current) {
      const v = engineRef.current.slowMotion ? 4 : 8;
      const E = engineRef.current;
      E.particles.push(
        { x: 10, y: E.cy + gunY, vx: v, vy: 0, trail: [], type: 'thomson', active: true, initialY: E.cy + gunY },
        { x: 10, y: E.cy + gunY, vx: v, vy: 0, trail: [], type: 'rutherford', active: true, initialY: E.cy + gunY, maxDeflection: 0 }
      );
    }
  };

  const getGunDisplay = () => {
    if (gunY === 0) return 'Aim: Dead Center';
    if (gunY > 0) return `Aim: +${gunY}px (Below center)`;
    return `Aim: ${gunY}px (Above center)`;
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: '#0d1117', border: '1px solid rgba(99,102,241,0.15)' }}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Alpha Scattering Simulator
            </div>
            <div className="text-base font-bold" style={{ color: '#e2e8f0' }}>
              Thomson&apos;s Model vs Rutherford&apos;s Model
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full" style={{ color: '#2dd4bf', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.2)' }}>
            LIVE
          </div>
        </div>

        {/* Simulation Chambers — single-box layout, labels float inside the canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Thomson */}
          <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 320, background: '#04060a' }}>
            <canvas ref={canvasThomsonRef} className="w-full h-full block" />
            <div
              className="absolute top-3 left-4 text-xs font-bold pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Thomson&apos;s <span style={{ color: '#2dd4bf' }}>&quot;Plum Pudding&quot;</span>
            </div>
          </div>

          {/* Rutherford */}
          <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 320, background: '#04060a' }}>
            <canvas ref={canvasRutherfordRef} className="w-full h-full block" />
            <div
              className="absolute top-3 left-4 text-xs font-bold pointer-events-none"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Rutherford&apos;s <span style={{ color: '#2dd4bf' }}>Nuclear Model</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-col gap-4">
            {/* Aim slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Particle Gun Aim (Y-Axis)</span>
                <span className="text-xs font-bold font-mono" style={{ color: '#e5b567' }}>{getGunDisplay()}</span>
              </div>
              <input
                type="range" min="-150" max="150" step="1" value={gunY}
                onChange={(e) => setGunY(parseInt(e.target.value))}
                className="w-full cursor-pointer"
                style={{ WebkitAppearance: 'none', appearance: 'none', background: 'transparent', height: '20px' }}
              />
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Adjust to aim the α-particle stream. Only hits within ±30 px of the nucleus cause deflections.
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Fire Single', onClick: handleFire, active: false },
                { label: `Auto-Beam ${autoFire ? 'ON' : 'OFF'}`, onClick: () => setAutoFire(!autoFire), active: autoFire },
                { label: `Slow Motion ${slowMotion ? 'ON' : 'OFF'}`, onClick: () => setSlowMotion(!slowMotion), active: slowMotion },
                { label: 'Reset Stats', onClick: () => { const z = { straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 }; statsRef.current = z; setStats({ ...z }); }, active: false },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.onClick}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  style={btn.active
                    ? { background: 'rgba(255,255,255,0.9)', color: '#111', border: '1px solid rgba(255,255,255,0.2)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Statistics */}
        {statsStarted && (
          <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, rgba(45,212,191,0.08), rgba(168,85,247,0.08))', border: '1px solid rgba(45,212,191,0.2)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded" style={{ background: '#2dd4bf' }} />
              <span className="text-sm font-bold" style={{ color: '#2dd4bf' }}>Live Scattering Statistics</span>
              <span className="text-xs font-mono ml-auto px-2 py-0.5 rounded" style={{ color: '#99f6e4', background: 'rgba(45,212,191,0.15)' }}>
                {stats.total} particles
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { pct: stats.total > 0 ? ((stats.straight / stats.total) * 100).toFixed(1) : '0', label: 'Straight Through', count: stats.straight, color: '#4ade80' },
                { pct: stats.total > 0 ? ((stats.smallDeflection / stats.total) * 100).toFixed(1) : '0', label: 'Small Deflection', count: stats.smallDeflection, color: '#facc15' },
                { pct: stats.total > 0 ? ((stats.largeDeflection / stats.total) * 100).toFixed(1) : '0', label: 'Backscattered', count: stats.largeDeflection, color: '#f87171' },
                { pct: String(stats.total), label: 'Total Fired', count: null, color: '#2dd4bf' },
              ].map((s) => (
                <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-2xl font-extrabold font-mono leading-none" style={{ color: s.color }}>{s.pct}{s.count !== null ? '%' : ''}</div>
                  <div className="text-xs mt-1 font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>{s.label}</div>
                  {s.count !== null && <div className="text-xs mt-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.count}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        input[type='range'] { -webkit-appearance: none; appearance: none; background: transparent; cursor: pointer; width: 100%; }
        input[type='range']::-webkit-slider-runnable-track { background: #374151; height: 6px; border-radius: 4px; }
        input[type='range']::-moz-range-track { background: #374151; height: 6px; border-radius: 4px; }
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; margin-top: -7px; background: #e5b567; height: 20px; width: 20px; border-radius: 50%; box-shadow: 0 0 15px rgba(229,181,103,0.4); transition: transform 0.1s; }
        input[type='range']::-moz-range-thumb { border: none; background: #e5b567; height: 20px; width: 20px; border-radius: 50%; }
        input[type='range']::-webkit-slider-thumb:hover { transform: scale(1.1); }
      `}</style>
    </div>
  );
}
