'use client';

// Rutherford Gold Foil Scattering Experiment Simulator
// Physics: θ = 2·arctan(k/b) — Rutherford scattering formula
// k = Coulomb strength constant; b = impact parameter

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

interface Alpha {
  x: number; y: number;
  vx: number; vy: number;
  nucleusY: number;
  phase: 'approach' | 'scatter';
  trailX: number[]; trailY: number[];
  alive: boolean;
}

interface Glow {
  angle: number;
  intensity: number;
  color: string;
}

function rrect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
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

export default function GoldFoilSim() {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const alphasRef   = useRef<Alpha[]>([]);
  const glowsRef    = useRef<Glow[]>([]);
  const lastFireRef = useRef<number>(0);
  const autoRef     = useRef<boolean>(true);
  const fireNextRef = useRef<boolean>(false);  // single-fire trigger
  const countsRef   = useRef({ total: 0, straight: 0, deflected: 0, backscattered: 0 });

  const [autoFire, setAutoFire] = useState(true);
  const [counts,   setCounts]   = useState({ total: 0, straight: 0, deflected: 0, backscattered: 0 });

  useEffect(() => { autoRef.current = autoFire; }, [autoFire]);

  // ── Canvas size / DPR — kept in its own effect so the animation loop
  // doesn't restart on every resize ───────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const W = canvas.parentElement?.offsetWidth ?? 700;
      const H = 420;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    }
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, []);

  // ── Main animation loop — auto-pauses when offscreen or tab hidden ─────
  useAnimationFrame(
    (_delta, elapsed) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const W  = canvas.width  / dpr;
      const H  = canvas.height / dpr;
      const CY = H / 2;

      // Seconds-based firing timer — the old loop used performance.now
      // and a 190 ms threshold; we use the elapsed value from the shared
      // hook (in seconds) with a 0.19 s threshold to preserve the cadence.
      const ts = elapsed;

      // Local spawn helper — closes over the current frame's W/H so it
      // doesn't need to re-derive them on every call.
      const spawnAlpha = () => {
        const SCREEN_R = Math.min(H * 0.42, W * 0.30);
        const FOIL_X   = Math.min(W * 0.54, W - SCREEN_R - 24);
        const SRC_X    = Math.max(22, FOIL_X - SCREEN_R - 60);
        const BLOCK_W  = 22;
        const SLIT_H   = 14;

        // Statistical distribution of impact parameters matching experimental data:
        // ~97% straight through (huge b → <2° deflection, visually indistinguishable from straight),
        // ~2% deflected (close pass, 22–47° tilt), ~1% backscattered (near-direct hit).
        // k = 8 below, so:
        //   b ∈ [400, 700]  → θ = 2·arctan(8/b) ≈ 1.3°–2.3°   (straight)
        //   b ∈ [18, 40]    → θ ≈ 22°–47°                     (deflected)
        //   b ∈ [0, 3]      → θ > 150°                        (backscattered)
        // Math.random() is intentional here — scattering is inherently
        // stochastic, and this effect only runs in the animation loop so
        // there's no hydration-mismatch concern.
        const r = Math.random();
        let nucleusY: number;
        if      (r < 0.97) nucleusY = CY + (Math.random() < 0.5 ? 1 : -1) * (400 + Math.random() * 300);
        else if (r < 0.99) nucleusY = CY + (Math.random() < 0.5 ? 1 : -1) * (18 + Math.random() * 22);
        else               nucleusY = CY + (Math.random() < 0.5 ? 1 : -1) * Math.random() * 3;

        alphasRef.current.push({
          x: SRC_X + BLOCK_W / 2 + 2,
          y: CY + (Math.random() - 0.5) * SLIT_H,
          vx: 5.5, vy: 0,
          nucleusY,
          phase: 'approach',
          trailX: [], trailY: [],
          alive: true,
        });
      };

      const SCREEN_R = Math.min(H * 0.42, W * 0.30);
      const FOIL_X   = Math.min(W * 0.54, W - SCREEN_R - 24);
      const SRC_X    = Math.max(22, FOIL_X - SCREEN_R - 60);
      const SLIT_H   = 14;
      const BLOCK_W  = 22;
      const BLOCK_H  = 92;
      const k        = 8;   // Coulomb strength — tuned so b≥60px gives θ<17° (straight through)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, W, H);

      // ── ZnS Screen ──────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(FOIL_X, CY, SCREEN_R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(20,184,166,0.07)';
      ctx.lineWidth = 16;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(20,184,166,0.40)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // ── Persistent glow marks ───────────────────────────────────
      glowsRef.current = glowsRef.current.filter(g => g.intensity > 0.012);
      for (const g of glowsRef.current) {
        g.intensity -= 0.0015;
        const gx = FOIL_X + SCREEN_R * Math.cos(g.angle);
        const gy = CY     + SCREEN_R * Math.sin(g.angle);
        const gr = ctx.createRadialGradient(gx, gy, 0, gx, gy, 15);
        const a0 = g.color.replace('1)', g.intensity + ')');
        const a1 = g.color.replace('1)', (g.intensity * 0.4) + ')');
        gr.addColorStop(0,   a0);
        gr.addColorStop(0.5, a1);
        gr.addColorStop(1,   'transparent');
        ctx.fillStyle = gr;
        ctx.beginPath();
        ctx.arc(gx, gy, 15, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Gold foil ────────────────────────────────────────────────
      const foilTop = CY - SCREEN_R * 0.70;
      const foilBot = CY + SCREEN_R * 0.70;
      const fGrad = ctx.createLinearGradient(FOIL_X - 2, 0, FOIL_X + 2, 0);
      fGrad.addColorStop(0,   'rgba(245,158,11,0.15)');
      fGrad.addColorStop(0.5, 'rgba(245,158,11,0.90)');
      fGrad.addColorStop(1,   'rgba(245,158,11,0.15)');
      ctx.fillStyle = fGrad;
      ctx.fillRect(FOIL_X - 2, foilTop, 4, foilBot - foilTop);

      // ── Lead collimator ──────────────────────────────────────────
      const bx = SRC_X - BLOCK_W / 2;
      ctx.fillStyle = '#2d3a5a';
      rrect(ctx, bx, CY - BLOCK_H / 2,             BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1, 3); ctx.fill();
      ctx.fillStyle = '#2d3a5a';
      rrect(ctx, bx, CY + SLIT_H / 2 + 1,          BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(71,85,105,0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, CY - BLOCK_H / 2, BLOCK_W, BLOCK_H);

      // Slit glow
      const sgx = SRC_X + BLOCK_W / 2;
      const sg  = ctx.createLinearGradient(sgx, CY, sgx + 35, CY);
      sg.addColorStop(0, 'rgba(251,191,36,0.18)'); sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(sgx, CY - SLIT_H / 2, 35, SLIT_H);

      // ── Radioactive source ───────────────────────────────────────
      const srcCX = bx - 7;
      const sGrad = ctx.createRadialGradient(srcCX, CY, 0, srcCX, CY, 14);
      sGrad.addColorStop(0,   '#fef3c7');
      sGrad.addColorStop(0.3, '#f59e0b');
      sGrad.addColorStop(0.7, 'rgba(245,158,11,0.25)');
      sGrad.addColorStop(1,   'transparent');
      ctx.fillStyle = sGrad;
      ctx.beginPath(); ctx.arc(srcCX, CY, 14, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(srcCX, CY, 5, 0, Math.PI * 2);  ctx.fill();

      // ── Labels ────────────────────────────────────────────────────
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(148,163,184,0.75)';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText('Radioactive', srcCX, CY + BLOCK_H / 2 + 18);
      ctx.fillText('Source',      srcCX, CY + BLOCK_H / 2 + 34);

      ctx.fillStyle = 'rgba(20,184,166,0.75)';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText('ZnS Screen', FOIL_X, CY - SCREEN_R - 14);

      // Gold Foil label sits BELOW the foil so alpha particles along the beam
      // path don't obscure it. Center-aligned on the foil vertical.
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(245,158,11,0.80)';
      ctx.font = 'bold 14px system-ui';
      ctx.fillText('Gold Foil', FOIL_X, foilBot + 18);
      ctx.fillStyle = 'rgba(245,158,11,0.50)';
      ctx.font = '11px system-ui';
      ctx.fillText('(~100 nm)', FOIL_X, foilBot + 32);

      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(74,222,128,0.55)';
      ctx.font = '11px system-ui';
      ctx.fillText('forward →', FOIL_X + SCREEN_R - 5, CY - 10);
      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(248,113,113,0.55)';
      ctx.fillText('← back', FOIL_X - SCREEN_R + 5, CY - 10);

      // ── Spawn ──────────────────────────────────────────────────────
      // Old loop used `performance.now()` with a 190 ms threshold; we keep
      // the same cadence using the shared hook's seconds-based elapsed.
      const shouldFire = fireNextRef.current || (autoRef.current && ts - lastFireRef.current > 0.19);
      if (shouldFire) {
        fireNextRef.current = false;
        lastFireRef.current = ts;
        spawnAlpha();
      }

      // ── Update & draw particles ───────────────────────────────────
      alphasRef.current = alphasRef.current.filter(p => p.alive);

      for (const p of alphasRef.current) {
        if (p.phase === 'approach') {
          p.x += p.vx;
          if (p.x >= FOIL_X) {
            const b     = p.y - p.nucleusY;
            const speed = Math.hypot(p.vx, p.vy);
            const theta = Math.abs(b) < 0.4
              ? Math.PI * 0.96
              : 2 * Math.atan(k / Math.abs(b));
            p.vx = speed * Math.cos(theta);
            p.vy = (b >= 0 ? 1 : -1) * speed * Math.sin(theta);
            p.x  = FOIL_X;
            p.phase = 'scatter';
            p.trailX = [FOIL_X]; p.trailY = [p.y];
          }
        } else {
          p.x += p.vx; p.y += p.vy;
          const dx = p.x - FOIL_X, dy = p.y - CY;
          const dist = Math.hypot(dx, dy);

          if (dist >= SCREEN_R - 2) {
            const angle = Math.atan2(dy, dx);
            const deg   = angle * 180 / Math.PI;
            let color: string;
            let cat: 'straight' | 'deflected' | 'backscattered';
            if      (Math.abs(deg) < 20)   { color = 'rgba(74,222,128,1)';  cat = 'straight'; }
            else if (Math.abs(deg) > 130)  { color = 'rgba(248,113,113,1)'; cat = 'backscattered'; }
            else                           { color = 'rgba(251,191,36,1)';  cat = 'deflected'; }

            glowsRef.current.push({ angle, intensity: 1, color });
            countsRef.current[cat]++;
            countsRef.current.total++;
            setCounts({ ...countsRef.current });
            p.alive = false; continue;
          }
          if (p.x < -20 || p.x > W + 20 || p.y < -20 || p.y > H + 20) { p.alive = false; continue; }
        }

        p.trailX.push(p.x); p.trailY.push(p.y);
        const maxTrail = p.phase === 'scatter' ? 18 : 10;
        if (p.trailX.length > maxTrail) { p.trailX.shift(); p.trailY.shift(); }

        if (p.trailX.length > 1) {
          ctx.beginPath();
          ctx.moveTo(p.trailX[0], p.trailY[0]);
          for (let i = 1; i < p.trailX.length; i++) ctx.lineTo(p.trailX[i], p.trailY[i]);
          ctx.strokeStyle = 'rgba(251,191,36,0.28)';
          ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.stroke();
        }

        const ag = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 6);
        ag.addColorStop(0,   '#fef9c3');
        ag.addColorStop(0.4, '#fbbf24');
        ag.addColorStop(1,   'transparent');
        ctx.fillStyle = ag;
        ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill();
      }
    },
    { target: canvasRef }
  );

  const T = counts.total;

  return (
    <div style={{ background: '#0d1117', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <canvas ref={canvasRef} className="block w-full" />

      <div className="px-5 pb-5 pt-1">
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <button
            onClick={() => setAutoFire(a => !a)}
            style={{
              background: autoFire ? 'rgba(251,191,36,0.10)' : 'rgba(255,255,255,0.04)',
              border:     `1px solid ${autoFire ? 'rgba(251,191,36,0.30)' : 'rgba(255,255,255,0.10)'}`,
              color:      autoFire ? '#fbbf24' : 'rgba(255,255,255,0.45)',
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px',
              cursor: 'pointer', fontWeight: 600,
            }}
          >
            {autoFire ? '⏸ Pause' : '▶ Fire Beam'}
          </button>
          <button
            onClick={() => { fireNextRef.current = true; }}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.50)',
              padding: '7px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Fire Single
          </button>
          <button
            onClick={() => {
              glowsRef.current  = [];
              countsRef.current = { total: 0, straight: 0, deflected: 0, backscattered: 0 };
              setCounts({ total: 0, straight: 0, deflected: 0, backscattered: 0 });
            }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.28)',
              padding: '7px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Reset
          </button>
          {T > 0 && (
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.28)', marginLeft: 4 }}>
              {T} α-particles fired
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {([
            { label: 'Straight Through', key: 'straight'      as const, color: '#4ade80', bg: 'rgba(74,222,128,0.06)',  bdr: 'rgba(74,222,128,0.18)'  },
            { label: 'Deflected',        key: 'deflected'     as const, color: '#fbbf24', bg: 'rgba(251,191,36,0.06)', bdr: 'rgba(251,191,36,0.18)'  },
            { label: 'Backscattered',    key: 'backscattered' as const, color: '#f87171', bg: 'rgba(248,113,113,0.06)',bdr: 'rgba(248,113,113,0.18)' },
          ] as const).map(({ label, key, color, bg, bdr }) => (
            <div key={key} style={{ background: bg, border: `1px solid ${bdr}`, borderRadius: '10px', padding: '10px 12px' }}>
              <div style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'monospace', color, lineHeight: 1.1 }}>
                {T > 0 ? `${((counts[key] / T) * 100).toFixed(1)}%` : '—'}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.42)', marginTop: 3 }}>{label}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.22)', marginTop: 2 }}>{counts[key]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
