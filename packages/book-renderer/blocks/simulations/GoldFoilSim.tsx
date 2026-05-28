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

      // ── ZnS Detector Screen ─────────────────────────────────────
      // Real ZnS screens fluoresce yellow-green when struck by α particles.
      // Draw an outer dark "backing", a glowing fluorescent band, and a
      // sharp inner ring so the screen reads as a physical detector arc.
      ctx.beginPath();
      ctx.arc(FOIL_X, CY, SCREEN_R + 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(15,23,42,0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();
      // Outer fluorescent ring (thick faint glow)
      ctx.beginPath();
      ctx.arc(FOIL_X, CY, SCREEN_R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(190,242,100,0.08)';
      ctx.lineWidth = 22;
      ctx.stroke();
      // Mid fluorescent ring
      ctx.strokeStyle = 'rgba(132,204,22,0.20)';
      ctx.lineWidth = 8;
      ctx.stroke();
      // Inner sharp edge — the actual screen
      ctx.strokeStyle = 'rgba(190,242,100,0.55)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Tick marks every 30° around the screen so it reads as a graduated
      // detector arc rather than a plain circle.
      for (let deg = 0; deg < 360; deg += 30) {
        const a = (deg * Math.PI) / 180;
        const x1 = FOIL_X + (SCREEN_R - 4) * Math.cos(a);
        const y1 = CY     + (SCREEN_R - 4) * Math.sin(a);
        const x2 = FOIL_X + (SCREEN_R + 4) * Math.cos(a);
        const y2 = CY     + (SCREEN_R + 4) * Math.sin(a);
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(190,242,100,0.32)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

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

      // ── Gold Foil ────────────────────────────────────────────────
      // Real ~100 nm gold foil is microscopically thin, but visually we need
      // it to read as a flat metallic sheet hanging in a frame. We draw:
      //   1. A dark frame/holder rectangle (vertical bracket on each side)
      //   2. The gold sheet itself with a metallic gradient (light edges,
      //      bright middle reflection) — wider than the old 4-px line
      //   3. Faint horizontal "hammered gold" texture lines
      //   4. A sharp specular highlight down the centre
      const foilTop = CY - SCREEN_R * 0.70;
      const foilBot = CY + SCREEN_R * 0.70;
      const FOIL_W = 10;
      // Frame/holder — black metal bracket gripping the foil at top + bottom
      ctx.fillStyle = '#1f2937';
      rrect(ctx, FOIL_X - FOIL_W / 2 - 3, foilTop - 8, FOIL_W + 6, 8, 2); ctx.fill();
      rrect(ctx, FOIL_X - FOIL_W / 2 - 3, foilBot,     FOIL_W + 6, 8, 2); ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.45)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(FOIL_X - FOIL_W / 2 - 3, foilTop - 8, FOIL_W + 6, 8);
      ctx.strokeRect(FOIL_X - FOIL_W / 2 - 3, foilBot,     FOIL_W + 6, 8);
      // Gold sheet — metallic linear gradient across the width
      const fGrad = ctx.createLinearGradient(FOIL_X - FOIL_W / 2, 0, FOIL_X + FOIL_W / 2, 0);
      fGrad.addColorStop(0,    'rgba(146,64,14,0.95)');
      fGrad.addColorStop(0.20, 'rgba(217,119,6,0.95)');
      fGrad.addColorStop(0.50, 'rgba(254,243,199,0.95)');
      fGrad.addColorStop(0.80, 'rgba(217,119,6,0.95)');
      fGrad.addColorStop(1,    'rgba(146,64,14,0.95)');
      ctx.fillStyle = fGrad;
      ctx.fillRect(FOIL_X - FOIL_W / 2, foilTop, FOIL_W, foilBot - foilTop);
      // Hammered-gold horizontal lines
      ctx.strokeStyle = 'rgba(120,53,15,0.35)';
      ctx.lineWidth = 0.5;
      for (let yy = foilTop + 6; yy < foilBot; yy += 9) {
        ctx.beginPath();
        ctx.moveTo(FOIL_X - FOIL_W / 2 + 1, yy);
        ctx.lineTo(FOIL_X + FOIL_W / 2 - 1, yy);
        ctx.stroke();
      }
      // Sharp central specular highlight
      ctx.fillStyle = 'rgba(255,251,235,0.55)';
      ctx.fillRect(FOIL_X - 0.5, foilTop + 2, 1, foilBot - foilTop - 4);

      // ── Lead collimator ──────────────────────────────────────────
      // Two lead-grey blocks stacked vertically with a horizontal slit
      // between them. Adding a metallic gradient (highlight top, shadow
      // bottom) reads as a dense lead brick instead of a flat rectangle.
      const bx = SRC_X - BLOCK_W / 2;
      const lGradTop = ctx.createLinearGradient(bx, CY - BLOCK_H / 2, bx, CY - SLIT_H / 2);
      lGradTop.addColorStop(0,   '#475569');
      lGradTop.addColorStop(0.5, '#334155');
      lGradTop.addColorStop(1,   '#1e293b');
      ctx.fillStyle = lGradTop;
      rrect(ctx, bx, CY - BLOCK_H / 2, BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1, 3); ctx.fill();
      const lGradBot = ctx.createLinearGradient(bx, CY + SLIT_H / 2, bx, CY + BLOCK_H / 2);
      lGradBot.addColorStop(0,   '#1e293b');
      lGradBot.addColorStop(0.5, '#334155');
      lGradBot.addColorStop(1,   '#475569');
      ctx.fillStyle = lGradBot;
      rrect(ctx, bx, CY + SLIT_H / 2 + 1, BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, CY - BLOCK_H / 2,        BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1);
      ctx.strokeRect(bx, CY + SLIT_H / 2 + 1,     BLOCK_W, (BLOCK_H - SLIT_H) / 2 - 1);
      // "Pb" labels on each block
      ctx.fillStyle = 'rgba(255,255,255,0.40)';
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Pb', bx + BLOCK_W / 2, CY - BLOCK_H / 2 + 15);
      ctx.fillText('Pb', bx + BLOCK_W / 2, CY + BLOCK_H / 2 - 9);

      // Slit glow — the α beam streaming through the slit
      const sgx = SRC_X + BLOCK_W / 2;
      const sg  = ctx.createLinearGradient(sgx, CY, sgx + 35, CY);
      sg.addColorStop(0, 'rgba(251,191,36,0.25)'); sg.addColorStop(1, 'transparent');
      ctx.fillStyle = sg;
      ctx.fillRect(sgx, CY - SLIT_H / 2, 35, SLIT_H);

      // ── Radioactive source (encased in a lead container) ─────────
      const srcCX = bx - 16;
      // Lead container housing
      const housingW = 24, housingH = 32;
      const houseGrad = ctx.createLinearGradient(srcCX - housingW / 2, 0, srcCX + housingW / 2, 0);
      houseGrad.addColorStop(0,   '#1e293b');
      houseGrad.addColorStop(0.5, '#475569');
      houseGrad.addColorStop(1,   '#1e293b');
      ctx.fillStyle = houseGrad;
      rrect(ctx, srcCX - housingW / 2, CY - housingH / 2, housingW, housingH, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(148,163,184,0.55)';
      ctx.lineWidth = 1;
      ctx.strokeRect(srcCX - housingW / 2, CY - housingH / 2, housingW, housingH);
      // Opening (port) facing the collimator
      ctx.fillStyle = '#0b1220';
      rrect(ctx, srcCX + housingW / 2 - 4, CY - 4, 6, 8, 1); ctx.fill();
      // Glowing radium pellet inside the container
      const sGrad = ctx.createRadialGradient(srcCX, CY, 0, srcCX, CY, 9);
      sGrad.addColorStop(0,   '#fef9c3');
      sGrad.addColorStop(0.4, '#f59e0b');
      sGrad.addColorStop(0.85, 'rgba(245,158,11,0.35)');
      sGrad.addColorStop(1,   'transparent');
      ctx.fillStyle = sGrad;
      ctx.beginPath(); ctx.arc(srcCX, CY, 9, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.beginPath(); ctx.arc(srcCX, CY, 3, 0, Math.PI * 2);  ctx.fill();
      // "Ra" label on the container
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.font = 'bold 8px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('Ra', srcCX, CY - housingH / 2 - 3);

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
