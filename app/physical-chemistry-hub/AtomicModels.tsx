'use client';

import { useEffect, useRef, useState } from 'react';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import BohrModel from './BohrModel';

export default function AtomicModels() {
  const [activeTab, setActiveTab] = useState<'classical' | 'bohr'>('classical');
  const canvasThomsonRef = useRef<HTMLCanvasElement>(null);
  const canvasRutherfordRef = useRef<HTMLCanvasElement>(null);
  const [gunY, setGunY] = useState(0);
  const [autoFire, setAutoFire] = useState(true);
  const [slowMotion, setSlowMotion] = useState(false);
  const [stats, setStats] = useState({ straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 });
  const [statsStarted, setStatsStarted] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showImpactParam, setShowImpactParam] = useState(false);
  const engineRef = useRef<{
    thCtx: CanvasRenderingContext2D | null;
    ruCtx: CanvasRenderingContext2D | null;
    w: number;
    h: number;
    cx: number;
    cy: number;
    particles: Array<{x: number; y: number; vx: number; vy: number; trail: Array<{x: number; y: number}>; type: string; active: boolean}>;
    flashes: Array<{x: number; y: number; life: number}>;
    gunY: number;
    autoFire: boolean;
    slowMotion: boolean;
    lastFire: number;
    animationId: number | null;
  } | null>(null);
  const statsRef = useRef({ straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 });
  const statsStartedRef = useRef(false);

  useEffect(() => {
    // Only run simulation when on classical tab
    if (activeTab !== 'classical') return;

    const ENGINE = {
      thCtx: null as CanvasRenderingContext2D | null,
      ruCtx: null as CanvasRenderingContext2D | null,
      w: 0,
      h: 0,
      cx: 0,
      cy: 0,
      particles: [] as Array<{x: number; y: number; vx: number; vy: number; trail: Array<{x: number; y: number}>; type: string; active: boolean}>,
      flashes: [] as Array<{x: number; y: number; life: number}>,
      gunY: 0,
      autoFire: true,
      slowMotion: false,
      lastFire: 0,
      animationId: null as number | null,
    };

    engineRef.current = ENGINE;

    function initSim() {
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
        if (ctx) ctx.scale(2, 2);
      });

      ENGINE.thCtx = cTh.getContext('2d');
      ENGINE.ruCtx = cRu.getContext('2d');

      requestAnimationFrame(animLoop);
    }

    function spawnParticle(yOffset: number) {
      const v = ENGINE.slowMotion ? 4 : 8;
      const p1 = {
        x: 10,
        y: ENGINE.cy + yOffset,
        vx: v,
        vy: 0,
        trail: [] as { x: number; y: number }[],
        type: 'thomson',
        active: true,
        initialY: ENGINE.cy + yOffset,
      };
      const p2 = {
        x: 10,
        y: ENGINE.cy + yOffset,
        vx: v,
        vy: 0,
        trail: [] as { x: number; y: number }[],
        type: 'rutherford',
        active: true,
        initialY: ENGINE.cy + yOffset,
      };
      ENGINE.particles.push(p1, p2);
    }

    function spawnFlash(ctx: CanvasRenderingContext2D, x: number, y: number) {
      ENGINE.flashes.push({ ctx, x, y, life: 1.0 });
    }

    function animLoop(timestamp: number) {
      const tCtx = ENGINE.thCtx;
      const rCtx = ENGINE.ruCtx;
      if (!tCtx || !rCtx) return;

      const w = ENGINE.w;
      const h = ENGINE.h;
      const cx = ENGINE.cx;
      const cy = ENGINE.cy;

      tCtx.clearRect(0, 0, w, h);
      rCtx.clearRect(0, 0, w, h);

      [tCtx, rCtx].forEach((c) => {
        c.beginPath();
        c.rect(5, 5, w - 10, h - 10);
        c.strokeStyle = 'rgba(16, 185, 129, 0.15)';
        c.lineWidth = 10;
        c.stroke();
        c.strokeStyle = 'rgba(16, 185, 129, 0.4)';
        c.lineWidth = 2;
        c.stroke();
      });

      const atomR = 120;

      // Thomson model - uniform positive charge sphere
      const tg = tCtx.createRadialGradient(cx, cy, 0, cx, cy, atomR);
      tg.addColorStop(0, 'rgba(224, 108, 117, 0.25)');
      tg.addColorStop(0.7, 'rgba(224, 108, 117, 0.2)');
      tg.addColorStop(1, 'rgba(224, 108, 117, 0.15)');
      tCtx.fillStyle = tg;
      tCtx.beginPath();
      tCtx.arc(cx, cy, atomR, 0, Math.PI * 2);
      tCtx.fill();
      // Clear atom boundary
      tCtx.strokeStyle = 'rgba(224, 108, 117, 0.6)';
      tCtx.lineWidth = 2;
      tCtx.setLineDash([]);
      tCtx.stroke();

      tCtx.fillStyle = '#3b82f6';
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const r = ((i % 3) + 1) * 30;
        tCtx.beginPath();
        tCtx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4, 0, Math.PI * 2);
        tCtx.fill();
      }

      // Rutherford model - atom boundary (mostly empty space)
      rCtx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
      rCtx.lineWidth = 2;
      rCtx.setLineDash([]);
      rCtx.beginPath();
      rCtx.arc(cx, cy, atomR, 0, Math.PI * 2);
      rCtx.stroke();

      const rg = rCtx.createRadialGradient(cx, cy, 0, cx, cy, 10);
      rg.addColorStop(0, '#fff');
      rg.addColorStop(0.2, '#e5b567');
      rg.addColorStop(1, 'transparent');
      rCtx.fillStyle = rg;
      rCtx.beginPath();
      rCtx.arc(cx, cy, 15, 0, Math.PI * 2);
      rCtx.fill();

      if (ENGINE.autoFire && timestamp - ENGINE.lastFire > 50) {
        // Spawn 70% of particles far outside atom (large impact param, always straight)
        // Spawn 30% within atom radius (may be deflected by nucleus)
        let yOff: number;
        if (Math.random() < 0.70) {
          // Outside atom - guaranteed straight through
          yOff = (Math.random() < 0.5 ? 1 : -1) * (atomR + Math.random() * 30);
        } else {
          // Inside atom boundary - may interact with nucleus
          yOff = (Math.random() - 0.5) * atomR * 2;
        }
        spawnParticle(yOff);
        ENGINE.lastFire = timestamp;
      }

      for (let i = ENGINE.particles.length - 1; i >= 0; i--) {
        const p = ENGINE.particles[i];
        if (!p.active) continue;

        const ctx = p.type === 'thomson' ? tCtx : rCtx;

        if (p.type === 'rutherford') {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const distSq = dx * dx + dy * dy;
          const dist = Math.sqrt(distSq);
          
          // Force only acts within ~38px of nucleus (realistic Coulomb repulsion)
          // Strength=3000 gives ~97% straight, ~2% small deflection, ~0.3% backscatter
          if (distSq > 10 && distSq < 1500) {
            const F = 3000 / (distSq * dist);
            p.vx += F * (dx / dist);
            p.vy += F * (dy / dist);
          }
        } else {
          if (Math.hypot(p.x - cx, p.y - cy) < atomR) {
            p.vy += (Math.random() - 0.5) * 0.05;
          }
        }

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x > w - 5 || p.x < 5 || p.y > h - 5 || p.y < 5) {
          p.active = false;
          spawnFlash(ctx, p.x, p.y);

          // Track statistics for Rutherford particles using exit side
          // RIGHT = straight through (no significant deflection)
          // TOP/BOTTOM = small-to-medium deflection (glancing scatter)
          // LEFT = large deflection / backscatter (direct hit)
          if (p.type === 'rutherford') {
            const s = statsRef.current;
            s.total++;
            if (p.x >= w - 5) {
              s.straight++;
            } else if (p.x <= 5) {
              s.largeDeflection++;
            } else {
              s.smallDeflection++;
            }
            if (!statsStartedRef.current) {
              statsStartedRef.current = true;
              setStatsStarted(true);
            }
            setStats({ ...s });
          }

          ENGINE.particles.splice(i, 1);
          continue;
        }

        if (p.trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let j = 1; j < p.trail.length; j++) ctx.lineTo(p.trail[j].x, p.trail[j].y);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = ENGINE.flashes.length - 1; i >= 0; i--) {
        const f = ENGINE.flashes[i];
        f.life -= 0.05;
        if (f.life <= 0) {
          ENGINE.flashes.splice(i, 1);
          continue;
        }

        f.ctx.fillStyle = `rgba(16, 185, 129, ${f.life})`;
        f.ctx.beginPath();
        f.ctx.arc(f.x, f.y, 6 + (1 - f.life) * 10, 0, Math.PI * 2);
        f.ctx.fill();
        f.ctx.fillStyle = `rgba(255, 255, 255, ${f.life})`;
        f.ctx.beginPath();
        f.ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
        f.ctx.fill();
      }

      ENGINE.animationId = requestAnimationFrame(animLoop);
    }

    setTimeout(() => {
      initSim();
    }, 100);

    return () => {
      // Cancel animation frame when switching tabs
      if (ENGINE.animationId !== null) {
        cancelAnimationFrame(ENGINE.animationId);
      }
      ENGINE.particles = [];
      ENGINE.flashes = [];
    };
  }, [activeTab]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.gunY = gunY;
      engineRef.current.autoFire = autoFire;
      engineRef.current.slowMotion = slowMotion;
    }
  }, [gunY, autoFire, slowMotion]);

  const handleFire = () => {
    // Turn off auto-beam when manually firing
    setAutoFire(false);
    
    if (engineRef.current) {
      const v = engineRef.current.slowMotion ? 4 : 8;
      const ENGINE = engineRef.current;
      const p1 = {
        x: 10,
        y: ENGINE.cy + gunY,
        vx: v,
        vy: 0,
        trail: [] as { x: number; y: number }[],
        type: 'thomson',
        active: true,
        initialY: ENGINE.cy + gunY,
      };
      const p2 = {
        x: 10,
        y: ENGINE.cy + gunY,
        vx: v,
        vy: 0,
        trail: [] as { x: number; y: number }[],
        type: 'rutherford',
        active: true,
        initialY: ENGINE.cy + gunY,
        maxDeflection: 0,
      };
      ENGINE.particles.push(p1, p2);
    }
  };

  const getGunDisplay = () => {
    if (gunY === 0) return 'Aim: Dead Center';
    if (gunY > 0) return `Aim: +${gunY}px (Below center)`;
    return `Aim: ${gunY}px (Above center)`;
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-black/30 p-1 rounded-xl border border-white/8 w-fit">
        <button
          onClick={() => setActiveTab('classical')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'classical'
              ? 'bg-white/10 text-teal-300 border border-white/10 shadow-md'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Thomson &amp; Rutherford
        </button>
        <button
          onClick={() => setActiveTab('bohr')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'bohr'
              ? 'bg-white/10 text-purple-300 border border-white/10 shadow-md'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          Bohr Model &amp; Spectra
        </button>
      </div>

      {/* Bohr Tab */}
      {activeTab === 'bohr' && <BohrModel />}

      {/* Classical Tab */}
      {activeTab === 'classical' && <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
        <div>
          <div className="text-xs font-semibold text-white/40 tracking-[0.2em] uppercase mb-1">
            Atomic Structure Simulator · Phase 1
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Classical <span className="text-teal-400 italic font-serif">Models</span>
          </h1>
        </div>
        <div className="text-xs font-semibold text-teal-400 bg-teal-400/10 px-4 py-1.5 rounded-full border border-teal-400/20">
          ALPHA SCATTERING ENGINE
        </div>
      </div>

      {/* Simulator Chambers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Thomson Chamber */}
        <div className="bg-[#111827] border border-[#374151] rounded-2xl p-3 shadow-2xl relative">
          <GlowingEffect spread={60} glow={true} disabled={false} proximity={100} inactiveZone={0.3} borderWidth={2} />
          <div className="relative w-full h-[350px] bg-[#04060a] rounded-lg overflow-hidden border border-white/5 shadow-inner">
            <div className="absolute top-4 left-4 font-mono text-sm font-bold text-white/70 z-10 pointer-events-none">
              Thomson&apos;s <span className="text-teal-400">&quot;Plum Pudding&quot;</span>
            </div>
            <canvas ref={canvasThomsonRef} className="w-full h-full block" />
          </div>
        </div>

        {/* Rutherford Chamber */}
        <div className="bg-[#111827] border border-[#374151] rounded-2xl p-3 shadow-2xl relative">
          <GlowingEffect spread={60} glow={true} disabled={false} proximity={100} inactiveZone={0.3} borderWidth={2} />
          <div className="relative w-full h-[350px] bg-[#04060a] rounded-lg overflow-hidden border border-white/5 shadow-inner">
            <div className="absolute top-4 left-4 font-mono text-sm font-bold text-white/70 z-10 pointer-events-none">
              Rutherford&apos;s <span className="text-teal-400">Nuclear Model</span>
            </div>
            <canvas ref={canvasRutherfordRef} className="w-full h-full block" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#0a0d14]/60 border border-white/10 rounded-2xl p-6 mb-6">
        <div className="flex flex-col gap-6">
          {/* Particle Gun Slider */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Particle Gun Aim (Y-Axis)</span>
              <span className="text-sm font-bold text-[#e5b567] font-sans">{getGunDisplay()}</span>
            </div>
            <input
              type="range"
              min="-150"
              max="150"
              step="1"
              value={gunY}
              onChange={(e) => setGunY(parseInt(e.target.value))}
              className="w-full h-6 bg-transparent cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                appearance: 'none',
              }}
            />
            <div className="text-xs text-white/40">
              Adjust slider to aim the α-particle stream. Watch how only hits within ±30px cause deflections.
            </div>
          </div>

          {/* Control Buttons - Single Row */}
          <div className="flex gap-2">
            <button
              onClick={handleFire}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/90 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all backdrop-blur-sm active:scale-[0.98]"
            >
              Fire Single
            </button>
            <button
              onClick={() => setAutoFire(!autoFire)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all backdrop-blur-sm active:scale-[0.98] ${
                autoFire
                  ? 'bg-white/90 text-gray-900 border border-white/20 hover:bg-white'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/90'
              }`}
            >
              Auto-Beam {autoFire ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setSlowMotion(!slowMotion)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all backdrop-blur-sm active:scale-[0.98] ${
                slowMotion
                  ? 'bg-white/90 text-gray-900 border border-white/20 hover:bg-white'
                  : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/90'
              }`}
            >
              Slow Motion {slowMotion ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => {
                const zero = { straight: 0, smallDeflection: 0, largeDeflection: 0, total: 0 };
                statsRef.current = zero;
                setStats({ ...zero });
              }}
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/90 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all backdrop-blur-sm active:scale-[0.98]"
            >
              Reset Stats
            </button>
          </div>
        </div>
      </div>

      {/* Live Statistics Counter */}
      {statsStarted && (
        <div className="bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-amber-500/10 border border-teal-400/30 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-teal-400 rounded" />
            <h3 className="text-lg font-bold text-teal-400">Live Scattering Statistics</h3>
            <span className="text-xs font-mono bg-teal-400/20 px-2 py-1 rounded text-teal-300">
              {stats.total} particles fired
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-mono font-extrabold text-green-400">
                {stats.total > 0 ? ((stats.straight / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-white/60 mt-1 font-semibold">Straight Through</div>
              <div className="text-xs text-white/40 mt-1">{stats.straight} particles</div>
              <div className="text-xs font-mono text-green-400/60 mt-2 font-semibold">Exited right wall</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-mono font-extrabold text-yellow-400">
                {stats.total > 0 ? ((stats.smallDeflection / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-white/60 mt-1 font-semibold">Small Deflection</div>
              <div className="text-xs text-white/40 mt-1">{stats.smallDeflection} particles</div>
              <div className="text-xs font-mono text-yellow-400/60 mt-2 font-semibold">Exited top / bottom</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-mono font-extrabold text-red-400">
                {stats.total > 0 ? ((stats.largeDeflection / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="text-sm text-white/60 mt-1 font-semibold">Backscattered</div>
              <div className="text-xs text-white/40 mt-1">{stats.largeDeflection} particles</div>
              <div className="text-xs font-mono text-red-400/60 mt-2 font-semibold">Exited left wall</div>
            </div>
            <div className="bg-gradient-to-br from-teal-500/20 to-purple-500/20 rounded-xl p-4 border border-teal-400/30">
              <div className="text-3xl font-mono font-extrabold text-teal-300">{stats.total}</div>
              <div className="text-sm text-white/80 mt-1 font-semibold">Total Fired</div>
              <div className="text-xs text-white/50 mt-1">Real-time data</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/50 text-center">
            <strong className="text-white/70">Note:</strong> θ represents the scattering angle. Most particles pass straight through (&lt;10°), matching Rutherford's experimental observations.
          </div>
        </div>
      )}

      {/* Experimental Setup Image */}
      <div className="mb-8 -mx-4 md:mx-0">
        <img
          src="https://pub-2ff04ffcdd1247b6b8d19c44c1dfe553.r2.dev/shared/physical%20chemistry%20hub/Screenshot%202026-03-15%20at%206.29.48%E2%80%AFPM_result.webp"
          alt="Rutherford Experimental Setup"
          className="w-full h-auto object-cover block rounded-none md:rounded-2xl"
        />
      </div>

      {/* Theory Section */}
      <div className="max-w-4xl mx-auto flex flex-col gap-8 mt-12">
        <div className="flex items-center gap-2 text-xl font-semibold text-teal-400">
          <div className="w-1 h-5 bg-teal-400 rounded" />
          The Geiger-Marsden Experiment (1909)
        </div>

        <p className="text-lg text-[#9eb1d1] leading-relaxed">
          Under Ernest Rutherford&apos;s direction, Hans Geiger and Ernest Marsden fired a beam of massive,
          high-speed alpha particles (He²⁺) at a piece of gold foil just 86 nanometers thick. If Thomson&apos;s
          &quot;Plum Pudding&quot; model was correct, the diffuse positive charge of the gold atoms should have been far
          too weak to affect the massive alpha particles, allowing them to pass straight through like
          cannonballs through tissue paper.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
          <div className="flex flex-col gap-2">
            <div className="font-mono text-4xl font-extrabold text-teal-400 leading-none">&gt;99%</div>
            <div className="text-sm font-semibold text-[#9eb1d1] uppercase tracking-wide">
              Passed Straight Through
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-mono text-4xl font-extrabold text-teal-400 leading-none">~0.5%</div>
            <div className="text-sm font-semibold text-[#9eb1d1] uppercase tracking-wide">
              Deflected Slightly
            </div>
          </div>
          <div className="flex flex-col gap-2 border-l-2 border-[#e5b567] pl-4">
            <div className="font-mono text-4xl font-extrabold text-[#e5b567] leading-none">1 in 20,000</div>
            <div className="text-sm font-semibold text-[#d6e0f5] uppercase tracking-wide">
              Bounced Backwards (&gt;90°)
            </div>
          </div>
        </div>

        <p className="text-lg text-[#9eb1d1] leading-relaxed">
          The discovery of those rare backscatters destroyed the Plum Pudding model overnight. The only
          mathematical explanation was that <strong className="text-[#d6e0f5] font-semibold">99.9% of the atom&apos;s mass and all of its positive charge</strong> was concentrated in an unimaginably tiny, infinitely dense core: the nucleus.
        </p>

        <div className="relative bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-yellow-400/15 border-l-[6px] border-amber-400 p-8 rounded-r-2xl my-4 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
          <div className="absolute top-4 right-4 text-6xl text-amber-400/20 font-serif">&ldquo;</div>
          <div className="font-serif text-2xl font-normal italic text-amber-50 leading-relaxed mb-4 relative z-10">
            &quot;It was quite the most incredible event that has ever happened to me in my life. It was almost as
            incredible as if you fired a 15-inch shell at a piece of tissue paper and it came back and hit
            you.&quot;
          </div>
          <div className="text-base font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
            <span className="text-amber-400">—</span> Ernest Rutherford
          </div>
        </div>

        {/* Model Comparison Table */}
        <div className="my-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-blue-400 rounded" />
            <h3 className="text-xl font-bold text-blue-400">Model Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-[#080c14]">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="py-4 px-4 text-sm font-bold text-white/70 uppercase tracking-wide">Feature</th>
                  <th className="py-4 px-4 text-sm font-bold text-rose-300 uppercase tracking-wide">Thomson Model</th>
                  <th className="py-4 px-4 text-sm font-bold text-teal-300 uppercase tracking-wide">Rutherford Model</th>
                </tr>
              </thead>
              <tbody className="text-base">
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Positive Charge</td>
                  <td className="py-4 px-4 text-white/60">Diffuse (spread throughout)</td>
                  <td className="py-4 px-4 text-white/60">Concentrated in nucleus</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Atom Size</td>
                  <td className="py-4 px-4 text-white/60">~10⁻¹⁰ m</td>
                  <td className="py-4 px-4 text-white/60">~10⁻¹⁰ m</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Nucleus Size</td>
                  <td className="py-4 px-4 text-white/60">N/A (no nucleus)</td>
                  <td className="py-4 px-4 text-white/60">~10⁻¹⁵ m (100,000× smaller)</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Mass Distribution</td>
                  <td className="py-4 px-4 text-white/60">Uniform throughout atom</td>
                  <td className="py-4 px-4 text-white/60">99.9% in nucleus</td>
                </tr>
                <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Prediction for α-particles</td>
                  <td className="py-4 px-4 text-rose-400 font-semibold">No deflection expected</td>
                  <td className="py-4 px-4 text-teal-400 font-semibold">Rare backscattering (✓ Observed)</td>
                </tr>
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-semibold text-white/80">Experimental Verdict</td>
                  <td className="py-4 px-4 text-red-400 font-bold">❌ Disproved</td>
                  <td className="py-4 px-4 text-green-400 font-bold">✓ Confirmed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-8 border-t border-white/5">
          <div className="flex items-center gap-2 text-xl font-semibold text-purple-400 mb-6">
            <div className="w-1 h-5 bg-purple-400 rounded" />
            Critical Design Choices
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="text-xl font-bold bg-gradient-to-r from-rose-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
                Why was Gold used? Why not another metal?
              </div>
              <div className="text-lg text-[#9eb1d1] leading-relaxed pl-4 border-l-2 border-white/10">
                Gold is the most malleable metal on Earth. It can be hammered into incredibly thin sheets—just
                about 1000 atoms thick. If Rutherford used a thicker metal foil, the alpha particles would
                suffer multiple subsequent collisions as they passed through, completely ruining the
                mathematical analysis of the scattering angles.
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <div className="text-xl font-bold bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300 bg-clip-text text-transparent">
                Why Alpha particles? Why not Beta or Gamma?
              </div>
              <div className="text-lg text-[#9eb1d1] leading-relaxed pl-4 border-l-2 border-white/10">
                <strong className="text-[#d6e0f5] font-semibold">Alpha particles</strong> are relatively heavy
                (roughly 8,000 times heavier than an electron) and carry a dense +2 charge. Because they carry
                so much momentum (moving at 2 × 10⁷ m/s), Rutherford knew that incredibly powerful forces would
                be needed to deflect them.
                <br />
                <br />
                If he used <strong className="text-[#d6e0f5] font-semibold">Beta particles</strong> (electrons),
                they would be so light that they would scatter wildly off the gold atom&apos;s own electrons, muddying
                the data completely. If he used <strong className="text-[#d6e0f5] font-semibold">Gamma rays</strong>{' '}
                (high-energy photons), they would not experience Coulombic electrostatic repulsion because they
                have zero mass and zero charge.
              </div>
            </div>
          </div>
        </div>

        <p className="text-lg text-[#9eb1d1] leading-relaxed pb-10 mt-10 border-t border-white/5 pt-8">
          <strong className="text-xl font-bold bg-gradient-to-r from-red-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">The Fatal Flaw:</strong> While Rutherford discovered
          the nucleus, his model created a terrifying paradox. According to Maxwell&apos;s laws of classical
          electromagnetism, negatively charged electrons orbiting a positive nucleus should constantly radiate
          energy, lose speed, and spiral inward—collapsing the entire atom in 10⁻⁸ seconds. To solve this,
          physics required a completely new set of rules: Quantum Mechanics.
        </p>

        {/* Mathematical Insight (Advanced) */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-400/30 rounded-2xl p-6 my-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-indigo-400 rounded" />
            <h3 className="text-xl font-bold text-indigo-400">Rutherford&apos;s Scattering Formula</h3>
            <span className="ml-auto text-xs bg-indigo-400/20 px-3 py-1 rounded-full text-indigo-300 font-mono">
              JEE Advanced
            </span>
          </div>
          <p className="text-base text-white/70 leading-relaxed mb-4">
            Rutherford derived a mathematical relationship showing how the number of scattered particles varies with scattering angle:
          </p>
          <div className="bg-black/30 rounded-xl p-6 border border-indigo-400/20 mb-4">
            <div className="text-center mb-4">
              <div className="text-2xl font-mono text-indigo-300 mb-2">
                N(θ) ∝ 1/sin⁴(θ/2)
              </div>
              <div className="text-sm text-white/50">
                where N(θ) = number of particles scattered at angle θ
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-indigo-500/10 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-indigo-300 mb-1">θ = 10°</div>
                <div className="text-sm text-white/60">sin⁴(5°) ≈ 0.000046</div>
                <div className="text-xs text-white/40 mt-1">Many particles</div>
              </div>
              <div className="bg-indigo-500/10 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-indigo-300 mb-1">θ = 90°</div>
                <div className="text-sm text-white/60">sin⁴(45°) ≈ 0.25</div>
                <div className="text-xs text-white/40 mt-1">Few particles</div>
              </div>
              <div className="bg-indigo-500/10 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-indigo-300 mb-1">θ = 180°</div>
                <div className="text-sm text-white/60">sin⁴(90°) = 1</div>
                <div className="text-xs text-white/40 mt-1">Extremely rare</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/60 leading-relaxed">
            <strong className="text-indigo-300">Key Insight:</strong> As the scattering angle increases, the probability drops <em>dramatically</em> (fourth power!). This explains why backscattering (θ &gt; 90°) is so incredibly rare — the sin⁴ function makes large-angle deflections exponentially less likely.
          </div>
        </div>
      </div>

      </> }

      <style jsx>{`
        @keyframes shine {
          to {
            left: 200%;
          }
        }

        input[type='range'] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          width: 100%;
        }

        input[type='range']::-webkit-slider-runnable-track {
          background: #374151;
          height: 6px;
          border-radius: 4px;
        }

        input[type='range']::-moz-range-track {
          background: #374151;
          height: 6px;
          border-radius: 4px;
        }

        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -7px;
          background: #e5b567;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(229, 181, 103, 0.4);
          transition: transform 0.1s;
        }

        input[type='range']::-moz-range-thumb {
          border: none;
          background: #e5b567;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          box-shadow: 0 0 15px rgba(229, 181, 103, 0.4);
          transition: transform 0.1s;
        }

        input[type='range']::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.1);
        }

        input[type='range']::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }

        input[type='range']::-moz-range-thumb:active {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
