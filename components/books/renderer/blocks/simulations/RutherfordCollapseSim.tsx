'use client';

// Rutherford Orbital Stability Simulator
// Rutherford's model: electron orbits nucleus indefinitely (circular path)
// Maxwell's prediction: orbiting electron radiates → loses energy → spirals into nucleus
// Reality: classical physics predicts collapse in ~10⁻⁸ s

import { useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from './_shared';

type Phase = 'stable' | 'collapsing' | 'collapsed';

export default function RutherfordCollapseSim() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // All mutable sim state lives in a single ref so the animation loop reads fresh values
  const simRef = useRef({
    phase:    'stable' as Phase,
    angle:    0,
    radius:   0,        // set to MAX_R on first frame
    omega:    0.022,    // rad/frame (stable orbit angular velocity)
    trailX:   [] as number[],
    trailY:   [] as number[],
    flashLife: 0,
    maxR:      0,       // cached in loop
  });

  const [maxwell, setMaxwell] = useState(false);
  const [phase,   setPhase]   = useState<Phase>('stable');
  const maxwellRef = useRef(false);

  // Sync Maxwell toggle into the sim
  useEffect(() => {
    maxwellRef.current = maxwell;
    const s = simRef.current;

    if (maxwell && s.phase === 'stable') {
      // Reset to outer orbit and start collapse
      s.angle    = 0;
      s.radius   = s.maxR || 110;
      s.omega    = 0.022;
      s.trailX   = [];
      s.trailY   = [];
      s.flashLife = 0;
      s.phase    = 'collapsing';
      setPhase('collapsing');
    } else if (!maxwell) {
      if (timerRef.current) clearTimeout(timerRef.current);
      s.angle    = 0;
      s.radius   = s.maxR || 110;
      s.omega    = 0.022;
      s.trailX   = [];
      s.trailY   = [];
      s.flashLife = 0;
      s.phase    = 'stable';
      setPhase('stable');
    }
  }, [maxwell]);

  // ── Canvas size / DPR ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      const W = canvas.parentElement?.offsetWidth ?? 640;
      const H = 360;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
    }
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => {
      ro.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // ── Main animation loop — auto-pauses when offscreen or tab hidden ─────
  // The old loop used per-frame constants (0.022 rad/frame, 1.2% radius
  // shrink/frame, 0.013 flash decay/frame) calibrated for 60 fps. We derive
  // `frameDelta` = delta * 60 so one "frame-unit" still corresponds to 1/60
  // of a second regardless of the actual refresh rate, and then multiply
  // every per-frame constant by it.
  useAnimationFrame(
    (delta) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const frameDelta = delta * 60;

      const W  = canvas.width  / dpr;
      const H  = canvas.height / dpr;
      const CX = W / 2;
      const CY = H / 2;

      const MAX_R = Math.min(W, H) * 0.38;
      simRef.current.maxR = MAX_R;

      const s = simRef.current;

      // Initialise radius on first frame
      if (s.radius === 0) s.radius = MAX_R;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ── Background ─────────────────────────────────────────────────
      ctx.fillStyle = '#0a0f1a';
      ctx.fillRect(0, 0, W, H);

      // ── Force-balance explainer (top-left) ────────────────────────
      // Electrostatic attraction between the proton and the electron is
      // exactly the centripetal force that keeps the electron in orbit.
      if (s.phase !== 'collapsed') {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'rgba(52,211,153,0.90)';
        ctx.font = 'bold 12px system-ui, sans-serif';
        ctx.fillText('Electrostatic Force', 18, 24);
        ctx.fillStyle = 'rgba(148,163,184,0.75)';
        ctx.font = '11px system-ui, sans-serif';
        ctx.fillText('acts as Centripetal Force', 18, 40);
        ctx.fillStyle = 'rgba(229,181,103,0.95)';
        ctx.font = 'italic bold 13px Georgia, "Times New Roman", serif';
        ctx.fillText('ke² / r²  =  mv² / r', 18, 62);
      }

      // ── Collapse physics ──────────────────────────────────────────
      if (s.phase === 'collapsing') {
        // Tuned for ~4 s total collapse at 60 fps:
        //   frames = log(7/MAX_R) / log(1 − decayRate) ≈ 246 → ~4.1 s
        // `frameDelta` keeps the total duration constant at any refresh rate.
        const decayRate = 0.012;
        s.radius *= (1 - decayRate * frameDelta);
        // Angular velocity increases as r shrinks: ω ∝ r^(-3/2). We keep
        // `s.omega` in rad/frame units so the `s.angle += s.omega * frameDelta`
        // line below converts it to real wall-clock rotation.
        s.omega = 0.022 * Math.pow(MAX_R / Math.max(s.radius, 2), 1.5);

        if (s.radius < 7) {
          s.phase    = 'collapsed';
          s.flashLife = 1;
          s.trailX   = [];
          s.trailY   = [];
          setPhase('collapsed');

          timerRef.current = setTimeout(() => {
            s.angle    = 0;
            s.radius   = MAX_R;
            s.omega    = 0.022;
            s.trailX   = [];
            s.trailY   = [];
            s.flashLife = 0;
            if (maxwellRef.current) {
              // Auto-restart collapse while Maxwell is still ON
              s.phase = 'collapsing';
              setPhase('collapsing');
            } else {
              s.phase = 'stable';
              setPhase('stable');
            }
          }, 2800);
        }
      }

      // ── Stable orbit guide ring ───────────────────────────────────
      // Glow halo + dashed ring so the atom boundary is clearly visible
      // against the dark background.
      if (s.phase === 'stable') {
        ctx.save();
        // Outer soft halo
        ctx.shadowColor = 'rgba(129,140,252,0.85)';
        ctx.shadowBlur  = 14;
        ctx.setLineDash([6, 8]);
        ctx.strokeStyle = 'rgba(165,180,252,0.70)';
        ctx.lineWidth   = 1.6;
        ctx.beginPath();
        ctx.arc(CX, CY, s.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.setLineDash([]);
      }

      // ── Nucleus ───────────────────────────────────────────────────
      // Outer glow
      const ng = ctx.createRadialGradient(CX, CY, 0, CX, CY, 36);
      ng.addColorStop(0,   'rgba(251,191,36,0.55)');
      ng.addColorStop(0.5, 'rgba(251,191,36,0.12)');
      ng.addColorStop(1,   'transparent');
      ctx.fillStyle = ng;
      ctx.beginPath();
      ctx.arc(CX, CY, 36, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.fillStyle = '#e5b567';
      ctx.beginPath();
      ctx.arc(CX, CY, 10, 0, Math.PI * 2);
      ctx.fill();
      // Label
      ctx.fillStyle = 'rgba(245,158,11,0.55)';
      ctx.font = 'bold 10px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('nucleus', CX, CY + 24);

      // ── Collapse flash ────────────────────────────────────────────
      if (s.phase === 'collapsed') {
        if (s.flashLife > 0) {
          s.flashLife -= 0.013 * frameDelta;
          const fl = s.flashLife;
          const fg = ctx.createRadialGradient(CX, CY, 0, CX, CY, fl * 70 + 12);
          fg.addColorStop(0,   `rgba(255,255,255,${fl * 0.95})`);
          fg.addColorStop(0.25,`rgba(251,191,36,${fl * 0.7})`);
          fg.addColorStop(0.6, `rgba(239,68,68,${fl * 0.3})`);
          fg.addColorStop(1,   'transparent');
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(CX, CY, fl * 70 + 12, 0, Math.PI * 2);
          ctx.fill();
        }

        const fadeIn = Math.min(1, (1 - s.flashLife) * 2.5);
        if (fadeIn > 0.1) {
          ctx.fillStyle = `rgba(248,113,113,${fadeIn * 0.85})`;
          ctx.font = 'bold 16px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Atom collapsed', CX, CY - 54);
          ctx.fillStyle = `rgba(148,163,184,${fadeIn * 0.7})`;
          ctx.font = '12px system-ui';
          ctx.fillText('in ~10⁻⁸ seconds', CX, CY - 36);
          ctx.fillStyle = `rgba(100,116,139,${fadeIn * 0.5})`;
          ctx.font = '11px system-ui';
          ctx.fillText('Resetting…', CX, CY - 20);
        }

        return;
      }

      // ── Update electron position ──────────────────────────────────
      s.angle += s.omega * frameDelta;
      const ex = CX + s.radius * Math.cos(s.angle);
      const ey = CY + s.radius * Math.sin(s.angle);

      s.trailX.push(ex);
      s.trailY.push(ey);
      const maxTrail = s.phase === 'stable' ? 42 : 90;
      if (s.trailX.length > maxTrail) { s.trailX.shift(); s.trailY.shift(); }

      // ── Trail ─────────────────────────────────────────────────────
      if (s.trailX.length > 2) {
        ctx.beginPath();
        ctx.moveTo(s.trailX[0], s.trailY[0]);
        for (let i = 1; i < s.trailX.length; i++) ctx.lineTo(s.trailX[i], s.trailY[i]);
        ctx.strokeStyle = s.phase === 'stable'
          ? 'rgba(99,102,241,0.30)'
          : 'rgba(99,102,241,0.55)';
        ctx.lineWidth = s.phase === 'stable' ? 1 : 1.5;
        ctx.lineCap   = 'round';
        ctx.stroke();
      }

      // ── Electron ──────────────────────────────────────────────────
      const eg = ctx.createRadialGradient(ex, ey, 0, ex, ey, 11);
      eg.addColorStop(0,   '#e0e7ff');
      eg.addColorStop(0.4, '#6366f1');
      eg.addColorStop(1,   'transparent');
      ctx.fillStyle = eg;
      ctx.beginPath();
      ctx.arc(ex, ey, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c7d2fe';
      ctx.beginPath();
      ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fill();
      // e⁻ label
      ctx.fillStyle = 'rgba(165,180,252,0.65)';
      ctx.font = 'bold 9px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('e⁻', ex, ey - 14);

      // ── Centripetal force arrow (electron → nucleus) ──────────────
      // Always points radially inward — this IS the electrostatic pull
      // that serves as the centripetal force for the orbit.
      {
        const dxn = CX - ex;
        const dyn = CY - ey;
        const dn  = Math.hypot(dxn, dyn);
        if (dn > 26) {
          const ux = dxn / dn;
          const uy = dyn / dn;
          const startX = ex + ux * 12;             // clear the electron glow
          const startY = ey + uy * 12;
          const shaftLen = Math.min(30, dn - 24);   // don't overrun the nucleus
          const endX = startX + ux * shaftLen;
          const endY = startY + uy * shaftLen;

          // Shaft
          ctx.strokeStyle = 'rgba(52,211,153,0.95)';
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();

          // Arrowhead
          const ang  = Math.atan2(uy, ux);
          const head = 7;
          ctx.fillStyle = 'rgba(52,211,153,0.95)';
          ctx.beginPath();
          ctx.moveTo(endX, endY);
          ctx.lineTo(endX - head * Math.cos(ang - 0.5), endY - head * Math.sin(ang - 0.5));
          ctx.lineTo(endX - head * Math.cos(ang + 0.5), endY - head * Math.sin(ang + 0.5));
          ctx.closePath();
          ctx.fill();

          // "F" label offset perpendicular to the arrow
          const px = -uy, py = ux;
          const lx = (startX + endX) / 2 + px * 11;
          const ly = (startY + endY) / 2 + py * 11;
          ctx.fillStyle = 'rgba(52,211,153,0.95)';
          ctx.font = 'italic bold 12px Georgia, "Times New Roman", serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('F', lx, ly);
          ctx.textBaseline = 'alphabetic';
        }
      }

      // ── Radiation squiggles (collapsing only) ─────────────────────
      if (s.phase === 'collapsing') {
        const shrinkFactor = 1 - s.radius / MAX_R; // 0 (start) → 1 (near collapse)
        const numRings = Math.floor(shrinkFactor * 4) + 1;
        for (let i = 0; i < numRings; i++) {
          const rBase = ex + Math.cos(s.angle + i * 2.1) * (13 + i * 6);
          const rY    = ey + Math.sin(s.angle + i * 2.1) * (13 + i * 6);
          ctx.beginPath();
          ctx.arc(rBase, rY, 3 + i * 1.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(248,113,113,${0.5 - i * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // ── Status label ──────────────────────────────────────────────
      ctx.textAlign = 'center';
      if (s.phase === 'stable') {
        ctx.fillStyle = 'rgba(165,180,252,0.90)';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText("Rutherford's model: stable circular orbit", CX, H - 18);
      } else {
        // Show radius bar (shrinking)
        const pct  = s.radius / MAX_R;
        const barW = 160;
        const barX = CX - barW / 2;
        const barY = H - 38;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(barX, barY, barW, 5, 3);
        ctx.fill();
        ctx.fillStyle = `rgba(248,113,113,${0.55 + (1 - pct) * 0.45})`;
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(barX, barY, barW * pct, 5, 3);
        ctx.fill();
        ctx.fillStyle = 'rgba(248,113,113,0.85)';
        ctx.font = 'bold 14px system-ui, sans-serif';
        ctx.fillText('Energy radiating away — orbit decaying', CX, H - 16);
      }
    },
    { target: canvasRef }
  );

  return (
    <div style={{ background: '#0d1117', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      <canvas ref={canvasRef} className="block w-full" />

      <div className="px-5 pb-4 pt-2 flex items-center gap-4 flex-wrap">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14px', color: 'rgba(226,232,240,0.80)', lineHeight: 1.55, fontWeight: 500 }}>
            {phase === 'stable'     && "Electron orbits the nucleus indefinitely — Rutherford assumed orbits are stable."}
            {phase === 'collapsing' && "Maxwell's theory: the orbiting electron radiates energy and spirals inward."}
            {phase === 'collapsed'  && "Classical physics predicts complete atomic collapse in ~10⁻⁸ s."}
          </div>
        </div>
        <button
          onClick={() => setMaxwell(m => !m)}
          disabled={phase === 'collapsed'}
          style={{
            background:  maxwell ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.04)',
            border:      `1px solid ${maxwell ? 'rgba(248,113,113,0.35)' : 'rgba(255,255,255,0.12)'}`,
            color:       maxwell ? '#f87171' : 'rgba(255,255,255,0.55)',
            padding: '8px 20px', borderRadius: '8px', fontSize: '13px',
            cursor: phase === 'collapsed' ? 'not-allowed' : 'pointer',
            fontWeight: 600, minWidth: 190, opacity: phase === 'collapsed' ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          {maxwell ? '⚡ Maxwell ON — collapse' : 'Apply Maxwell\'s Theory'}
        </button>
      </div>
    </div>
  );
}
