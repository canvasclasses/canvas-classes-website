'use client';

import { useEffect, useRef, useCallback } from 'react';

interface HalfCell {
  name: string; symbol: string; ion: string; e0: number;
  electrodeColor: string; solutionColor: string;
  saltFormula: string; n: number;
  oxidationHalf: string; reductionHalf: string;
  ionColor: string;
}

interface Props {
  anode: HalfCell;
  cathode: HalfCell;
  isGalv: boolean;
  isElec: boolean;
  paused: boolean;
  eActual: number;
  anodeIdx?: number;
  cathodeIdx?: number;
}

/* ── helpers ── */
function hex2rgb(hex: string) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

/* ── point along a cubic bezier ── */
function bezier(p0: number[], p1: number[], p2: number[], p3: number[], t: number): [number, number] {
  const mt = 1 - t;
  return [
    mt * mt * mt * p0[0] + 3 * mt * mt * t * p1[0] + 3 * mt * t * t * p2[0] + t * t * t * p3[0],
    mt * mt * mt * p0[1] + 3 * mt * mt * t * p1[1] + 3 * mt * t * t * p2[1] + t * t * t * p3[1],
  ];
}

export function ElectrochemistryScene({
  anode, cathode, isGalv, isElec, paused, eActual,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef  = useRef<number>(0);
  const timeRef   = useRef(0);
  /* erosion/deposit accumulators */
  const erosionRef = useRef(0);
  const depositRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const t = timeRef.current;
    const active = isGalv || isElec;

    /* ─── layout constants ─── */
    const PAD   = W * 0.07;
    const BW    = W * 0.22;   // beaker width
    const BH    = H * 0.44;   // beaker height
    const BT    = H * 0.46;   // beaker top y
    const BB    = BT + BH;    // beaker bottom y
    const AX    = PAD + BW / 2;          // anode beaker centre x
    const CX    = W - PAD - BW / 2;      // cathode beaker centre x
    const MID_X = W / 2;

    /* electrode geometry */
    const EW_ANODE   = BW * 0.22;
    const EW_CATHODE = BW * 0.22 * (1 + depositRef.current * 0.45);
    const EH_ANODE   = BH * 0.75 * (1 - erosionRef.current * 0.30);
    const EH_CATHODE = BH * 0.75;
    const E_TOP      = BT + BH * 0.06;   // electrode top (inside beaker)
    const WIRE_Y     = BT - H * 0.22;    // y where wire runs across top
    const VOLT_Y     = WIRE_Y - H * 0.07; // voltmeter centre y

    /* ===== BACKGROUND ===== */
    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, W, H);

    /* subtle gradient */
    const bg = ctx.createRadialGradient(MID_X, H * 0.4, 0, MID_X, H * 0.4, W * 0.7);
    bg.addColorStop(0, 'rgba(30,50,90,0.35)');
    bg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    /* ===== LAB BENCH ===== */
    const bench = ctx.createLinearGradient(0, BB, 0, BB + H * 0.12);
    bench.addColorStop(0, '#1e2d45');
    bench.addColorStop(1, '#111827');
    ctx.fillStyle = bench;
    ctx.fillRect(0, BB, W, H - BB);

    /* bench edge highlight */
    ctx.strokeStyle = 'rgba(100,160,255,0.15)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, BB); ctx.lineTo(W, BB); ctx.stroke();

    /* ===== DRAW BEAKER helper ===== */
    const drawBeaker = (cx: number, cell: HalfCell, isAnode: boolean) => {
      const bx = cx - BW / 2;
      const sc = hex2rgb(cell.solutionColor);
      const liquidFrac = 0.72;
      const liquidTop  = BT + BH * (1 - liquidFrac);
      const liquidH    = BH * liquidFrac;

      /* glass back wall (slightly lighter) */
      ctx.fillStyle = 'rgba(180,210,255,0.04)';
      roundRect(ctx, bx, BT, BW, BH, 0, 0, 8, 8);
      ctx.fill();

      /* solution fill */
      const solGrad = ctx.createLinearGradient(bx, liquidTop, bx + BW, liquidTop + liquidH);
      const alpha = 0.52;
      solGrad.addColorStop(0, `rgba(${sc.r},${sc.g},${sc.b},${alpha})`);
      solGrad.addColorStop(1, `rgba(${sc.r},${sc.g},${sc.b},${alpha * 0.7})`);
      ctx.fillStyle = solGrad;
      roundRect(ctx, bx + 3, liquidTop, BW - 6, liquidH - 3, 0, 0, 6, 6);
      ctx.fill();

      /* liquid surface shimmer */
      const shimmer = ctx.createLinearGradient(bx, liquidTop, bx + BW, liquidTop);
      shimmer.addColorStop(0,   'rgba(255,255,255,0.0)');
      shimmer.addColorStop(0.3, 'rgba(255,255,255,0.18)');
      shimmer.addColorStop(0.7, 'rgba(255,255,255,0.08)');
      shimmer.addColorStop(1,   'rgba(255,255,255,0.0)');
      ctx.fillStyle = shimmer;
      ctx.fillRect(bx + 3, liquidTop, BW - 6, 4);

      /* glass walls */
      ctx.lineWidth   = 2.5;
      ctx.strokeStyle = 'rgba(180,220,255,0.38)';
      roundRect(ctx, bx, BT, BW, BH, 0, 0, 8, 8);
      ctx.stroke();

      /* left wall inner highlight */
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 5, BT + 10);
      ctx.lineTo(bx + 5, BB - 5);
      ctx.stroke();

      /* solution label inside beaker */
      const labelText = `1 M ${cell.saltFormula}(aq)`;
      ctx.font = `bold ${Math.round(W * 0.016)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      const lw = ctx.measureText(labelText).width;
      ctx.fillStyle = 'rgba(0,0,0,0.65)';
      roundRect(ctx, cx - lw / 2 - 10, BB - 28, lw + 20, 22, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fillText(labelText, cx, BB - 11);
    };

    /* ===== DRAW ELECTRODE ===== */
    const drawElectrode = (cx: number, cell: HalfCell, isAnode: boolean) => {
      const ew = isAnode ? EW_ANODE : EW_CATHODE;
      const eh = isAnode ? EH_ANODE : EH_CATHODE;
      const ex = cx - ew / 2;
      const ey = E_TOP;
      const ec = hex2rgb(cell.electrodeColor);

      /* electrode body gradient (mimics flat plate) */
      const eg = ctx.createLinearGradient(ex, 0, ex + ew, 0);
      eg.addColorStop(0,   `rgba(${Math.min(255,ec.r+55)},${Math.min(255,ec.g+55)},${Math.min(255,ec.b+55)},1)`);
      eg.addColorStop(0.35,`rgba(${ec.r},${ec.g},${ec.b},1)`);
      eg.addColorStop(0.65,`rgba(${ec.r},${ec.g},${ec.b},1)`);
      eg.addColorStop(1,   `rgba(${Math.max(0,ec.r-40)},${Math.max(0,ec.g-40)},${Math.max(0,ec.b-40)},1)`);

      ctx.fillStyle = eg;
      ctx.shadowColor = cell.electrodeColor;
      ctx.shadowBlur  = 8;
      roundRect(ctx, ex, ey, ew, eh, 3, 3, 3, 3);
      ctx.fill();
      ctx.shadowBlur = 0;

      /* highlight streak */
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      roundRect(ctx, ex + 3, ey + 4, 3, eh - 8, 2, 2, 2, 2);
      ctx.fill();

      /* deposit layer on cathode */
      if (!isAnode && depositRef.current > 0.05) {
        const dh = (eh * 0.9) * depositRef.current * 0.5;
        const dc = hex2rgb(cell.electrodeColor);
        ctx.fillStyle = `rgba(${dc.r},${dc.g},${dc.b},0.55)`;
        roundRect(ctx, ex - 3, ey + eh - dh, ew + 6, dh, 2, 2, 2, 2);
        ctx.fill();
        /* nodule dots */
        if (depositRef.current > 0.15) {
          ctx.fillStyle = `rgba(${dc.r},${dc.g},${dc.b},0.9)`;
          for (let i = 0; i < 5; i++) {
            const nx = ex - 4 + Math.sin(i * 2.3) * 5;
            const ny = ey + eh - dh * 0.6 + (i / 5) * dh * 0.5;
            ctx.beginPath();
            ctx.arc(nx, ny, 3 + i % 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      /* electrode symbol label */
      ctx.font = `bold ${Math.round(W * 0.022)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur  = 4;
      ctx.fillText(cell.symbol, cx, ey + eh / 2 + 6);
      ctx.shadowBlur = 0;

      /* +/- polarity badge on side of beaker (not behind wire) */
      /* In electrolytic: Zn becomes cathode (−), Cu becomes anode (+) */
      const actualIsAnode = isElec ? !isAnode : isAnode;
      const pLabel = isGalv
        ? (isAnode ? '(−) ANODE' : '(+) CATHODE')
        : (actualIsAnode ? '(+) ANODE' : '(−) CATHODE');
      const pColor = isGalv
        ? (isAnode ? '#f87171' : '#60a5fa')
        : (actualIsAnode ? '#60a5fa' : '#f87171');
      ctx.font = `bold ${Math.round(W * 0.015)}px Inter, system-ui, sans-serif`;
      const pw = ctx.measureText(pLabel).width;
      const badgeX = isAnode ? cx - BW * 0.55 : cx + BW * 0.55;
      const badgeY = BT + BH * 0.25;
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      roundRect(ctx, badgeX - pw / 2 - 8, badgeY - 11, pw + 16, 22, 5);
      ctx.fill();
      ctx.fillStyle = pColor;
      ctx.textAlign = 'center';
      ctx.fillText(pLabel, badgeX, badgeY + 4);

      /* half-reaction below beaker */
      const rxn = isAnode ? anode.oxidationHalf : cathode.reductionHalf;
      ctx.font = `${Math.round(W * 0.016)}px Georgia, serif`;
      ctx.fillStyle = isAnode ? 'rgba(251,146,60,0.9)' : 'rgba(96,165,250,0.9)';
      const rw = ctx.measureText(rxn).width;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      roundRect(ctx, cx - rw / 2 - 8, BB + 8, rw + 16, 20, 4);
      ctx.fill();
      ctx.fillStyle = isAnode ? '#fb923c' : '#93c5fd';
      ctx.fillText(rxn, cx, BB + 22);

      /* wire terminal connector on top of electrode */
      ctx.fillStyle = isGalv
        ? (isAnode ? '#ef4444' : '#3b82f6')
        : (isAnode ? '#3b82f6' : '#ef4444');
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, ey - 1, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };

    /* ===== SALT BRIDGE (inverted U-tube) ===== */
    const drawSaltBridge = () => {
      const tubeW  = BW * 0.18;
      const bx_a   = AX + BW * 0.35;   // left arm x (moved away from electrode)
      const bx_c   = CX - BW * 0.35;   // right arm x (moved away from electrode)
      const bridgeTop    = BT - H * 0.04;  // top curve (above beakers)
      const bridgeBottom = BT + BH * 0.50;  // bottom ends (inside beakers)

      /* Draw inverted U-tube path (∩ shape) */
      const drawUPath = () => {
        ctx.beginPath();
        // Left arm down into beaker
        ctx.moveTo(bx_a, bridgeTop + tubeW);
        ctx.lineTo(bx_a, bridgeBottom);
        // Move to right arm bottom
        ctx.moveTo(bx_c, bridgeBottom);
        // Right arm up
        ctx.lineTo(bx_c, bridgeTop + tubeW);
        // Top curve connecting both arms
        ctx.moveTo(bx_a, bridgeTop + tubeW);
        ctx.quadraticCurveTo(bx_a, bridgeTop, (bx_a + bx_c) / 2, bridgeTop);
        ctx.quadraticCurveTo(bx_c, bridgeTop, bx_c, bridgeTop + tubeW);
      };

      /* Outer glass tube */
      ctx.save();
      drawUPath();
      ctx.strokeStyle = 'rgba(140,190,255,0.6)';
      ctx.lineWidth   = tubeW;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      /* Inner solution fill */
      ctx.save();
      drawUPath();
      ctx.strokeStyle = 'rgba(120,180,255,0.5)';
      ctx.lineWidth   = tubeW * 0.65;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      /* Glass highlight on left arm */
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.moveTo(bx_a - tubeW * 0.25, bridgeTop + tubeW);
      ctx.lineTo(bx_a - tubeW * 0.25, bridgeBottom - tubeW);
      ctx.stroke();

      /* label */
      ctx.font = `bold ${Math.round(W * 0.014)}px Inter, system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      const slabel = `salt bridge, KCl(aq)`;
      const slw = ctx.measureText(slabel).width;
      roundRect(ctx, MID_X - slw / 2 - 8, bridgeTop - 8, slw + 16, 20, 4);
      ctx.fill();
      ctx.fillStyle = '#93c5fd';
      ctx.fillText(slabel, MID_X, bridgeTop + 6);

      /* ion labels on bridge if active */
      if (active) {
        const la = 0.55 + 0.35 * Math.sin(t * 0.08);
        ctx.font = `bold ${Math.round(W * 0.014)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = `rgba(251,191,36,${la})`;
        ctx.textAlign = 'center';
        ctx.fillText('K⁺ →', bx_a + (bx_c - bx_a) * 0.35, bridgeTop + tubeW * 1.8);
        ctx.fillStyle = `rgba(110,231,183,${la})`;
        ctx.fillText('← Cl⁻', bx_a + (bx_c - bx_a) * 0.65, bridgeTop + tubeW * 1.8);
      }
    };

    /* ===== WIRE ===== */
    /* In electrolytic mode, electron flow reverses: Cu→Zn */
    const electronSourceX = isElec ? CX : AX;  // Cu in electrolytic, Zn in galvanic
    const electronSinkX   = isElec ? AX : CX;  // Zn in electrolytic, Cu in galvanic
    
    const drawWire = () => {
      const anodeTermX   = AX;
      const anodeTermY   = E_TOP - 1;
      const cathodeTermX = CX;
      const cathodeTermY = E_TOP - 1;
      const voltLeft     = MID_X - W * 0.07;
      const voltRight    = MID_X + W * 0.07;

      const wirePath = () => {
        ctx.beginPath();
        ctx.moveTo(anodeTermX, anodeTermY);
        ctx.lineTo(anodeTermX, WIRE_Y);
        ctx.lineTo(voltLeft,   WIRE_Y);
        ctx.moveTo(voltRight,  WIRE_Y);
        ctx.lineTo(cathodeTermX, WIRE_Y);
        ctx.lineTo(cathodeTermX, cathodeTermY);
      };

      /* wire shadow */
      ctx.save();
      ctx.shadowColor = isGalv ? 'rgba(239,68,68,0.4)' : 'rgba(245,158,11,0.4)';
      ctx.shadowBlur  = 10;
      wirePath();
      ctx.strokeStyle = isGalv ? '#b91c1c' : '#b45309';
      ctx.lineWidth   = 5;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();
      ctx.restore();

      /* wire highlight */
      wirePath();
      ctx.strokeStyle = isGalv ? '#ef4444' : '#f59e0b';
      ctx.lineWidth   = 3;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
      ctx.stroke();

      /* arrow showing electron direction */
      if (active) {
        const leftX = (electronSourceX + voltLeft) / 2;
        const rightX = (voltRight + electronSinkX) / 2;
        
        if (isElec) {
          // Electrolytic: Cu→Zn (right to left)
          drawArrow(ctx, rightX + 20, WIRE_Y, rightX - 20, WIRE_Y, '#93c5fd', 2.5);
          drawArrow(ctx, leftX + 20, WIRE_Y, leftX - 20, WIRE_Y, '#93c5fd', 2.5);
        } else {
          // Galvanic: Zn→Cu (left to right)
          drawArrow(ctx, leftX - 20, WIRE_Y, leftX + 20, WIRE_Y, '#93c5fd', 2.5);
          drawArrow(ctx, rightX - 20, WIRE_Y, rightX + 20, WIRE_Y, '#93c5fd', 2.5);
        }

        /* e⁻ labels */
        ctx.font = `bold ${Math.round(W * 0.014)}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = '#93c5fd';
        ctx.textAlign = 'center';
        ctx.fillText('e⁻', leftX, WIRE_Y - 10);
        ctx.fillText('e⁻', rightX, WIRE_Y - 10);
      }
    };

    /* ===== VOLTMETER ===== */
    const drawVoltmeter = () => {
      const VW = W * 0.14;
      const VH = H * 0.11;
      const VX = MID_X - VW / 2;
      const VY = VOLT_Y - VH / 2;

      /* body */
      ctx.fillStyle = '#1e2d3d';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1.5;
      roundRect(ctx, VX, VY, VW, VH, 8);
      ctx.fill();
      ctx.stroke();

      /* screen */
      const sx = VX + VW * 0.1, sy = VY + VH * 0.12;
      const sw = VW * 0.8,      sh = VH * 0.55;
      ctx.fillStyle = '#001a00';
      roundRect(ctx, sx, sy, sw, sh, 4);
      ctx.fill();

      /* glow behind number */
      if (active) {
        ctx.shadowColor = '#00ff44';
        ctx.shadowBlur  = 12;
      }
      ctx.font = `bold ${Math.round(W * 0.026)}px "JetBrains Mono", monospace`;
      ctx.fillStyle  = active ? '#00ff55' : '#1a4d1a';
      ctx.textAlign  = 'center';
      ctx.fillText(Math.abs(eActual).toFixed(2), MID_X, sy + sh * 0.72);
      ctx.shadowBlur = 0;

      /* dial knob */
      ctx.fillStyle   = '#0f172a';
      ctx.strokeStyle = '#374151';
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(MID_X, VY + VH * 0.86, VH * 0.1, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();

      /* voltmeter label */
      ctx.font = `${Math.round(W * 0.013)}px Inter, system-ui, sans-serif`;
      ctx.fillStyle = '#6b7280';
      ctx.textAlign = 'center';
      ctx.fillText('voltmeter', MID_X, VY + VH + 16);

      /* wire connection dots */
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(VX + VW * 0.2, VY + VH, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath(); ctx.arc(VX + VW * 0.8, VY + VH, 4, 0, Math.PI * 2); ctx.fill();
    };

    /* ===== ELECTRON PARTICLES ===== */
    const drawElectrons = () => {
      if (!active) return;
      const count = 8;
      const voltLeft  = MID_X - W * 0.07;
      const voltRight = MID_X + W * 0.07;

      for (let i = 0; i < count; i++) {
        const phase = (i / count + t * 0.012) % 1;
        let px: number, py: number;

        // Electron flow direction depends on cell type
        const startX = electronSourceX;
        const endX   = electronSinkX;
        
        const vertLen   = (E_TOP - WIRE_Y) / H;
        const horizLeft = Math.abs(voltLeft - startX) / W;
        const horizRight= Math.abs(endX - voltRight) / W;
        const total     = vertLen + horizLeft + horizRight + vertLen;
        const p         = phase * total;

        if (p < vertLen) {
          // Up from source electrode
          px = startX;
          py = E_TOP - (p / vertLen) * (E_TOP - WIRE_Y);
        } else if (p < vertLen + horizLeft) {
          // Horizontal to voltmeter
          const prog = (p - vertLen) / horizLeft;
          px = startX + prog * (voltLeft - startX);
          py = WIRE_Y;
        } else if (p < vertLen + horizLeft + horizRight) {
          // Horizontal from voltmeter
          const prog = (p - vertLen - horizLeft) / horizRight;
          px = voltRight + prog * (endX - voltRight);
          py = WIRE_Y;
        } else {
          // Down to sink electrode
          const rem = p - vertLen - horizLeft - horizRight;
          px = endX;
          py = WIRE_Y + (rem / vertLen) * (E_TOP - WIRE_Y);
        }

        const pulse = 0.65 + 0.35 * Math.sin(t * 0.2 + i * 0.9);
        ctx.shadowColor = '#60a5fa';
        ctx.shadowBlur  = 10 * pulse;
        ctx.fillStyle   = `rgba(147,197,253,${pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        /* e⁻ label on every other particle */
        if (i % 2 === 0) {
          ctx.font = `bold ${Math.round(W * 0.011)}px Inter`;
          ctx.fillStyle = 'rgba(147,197,253,0.85)';
          ctx.textAlign = 'center';
          ctx.fillText('e⁻', px, py - 7);
        }
      }
    };

    /* ===== SALT BRIDGE IONS ===== */
    const drawBridgeIons = () => {
      if (!active) return;
      const tubeW  = BW * 0.18;
      const bx_a   = AX + BW * 0.35;
      const bx_c   = CX - BW * 0.35;
      const bridgeTop    = BT - H * 0.04;
      const bridgeBottom = BT + BH * 0.50;
      const ionCount = 6;

      /* K⁺ left→right through inverted U-tube (up left arm → across top → down right arm) */
      for (let i = 0; i < ionCount; i++) {
        const phase = (i / ionCount + t * 0.008 * (isGalv ? 1 : -1) + 1) % 1;
        let px: number, py: number;
        
        if (phase < 0.35) {
          // Up left arm from beaker
          px = bx_a;
          py = lerp(bridgeBottom, bridgeTop + tubeW, phase / 0.35);
        } else if (phase < 0.65) {
          // Along top curve (left to right)
          const arc = (phase - 0.35) / 0.30;
          px = lerp(bx_a, bx_c, arc);
          py = bridgeTop + tubeW * (1 - Math.sin(arc * Math.PI) * 0.5);
        } else {
          // Down right arm into beaker
          px = bx_c;
          py = lerp(bridgeTop + tubeW, bridgeBottom, (phase - 0.65) / 0.35);
        }

        const pulse = 0.7 + 0.3 * Math.sin(t * 0.25 + i * 1.1);
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur  = 8;
        ctx.fillStyle   = `rgba(251,191,36,${pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
        ctx.fillStyle = 'rgba(251,191,36,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('K⁺', px, py - 6);
      }

      /* Cl⁻ right→left through inverted U-tube (up right arm → across top → down left arm) */
      for (let i = 0; i < ionCount; i++) {
        const phase = (i / ionCount - t * 0.008 * (isGalv ? 1 : -1) + 2) % 1;
        let px: number, py: number;
        
        if (phase < 0.35) {
          // Up right arm from beaker
          px = bx_c;
          py = lerp(bridgeBottom, bridgeTop + tubeW, phase / 0.35);
        } else if (phase < 0.65) {
          // Along top curve (right to left)
          const arc = (phase - 0.35) / 0.30;
          px = lerp(bx_c, bx_a, arc);
          py = bridgeTop + tubeW * (1 - Math.sin(arc * Math.PI) * 0.5);
        } else {
          // Down left arm into beaker
          px = bx_a;
          py = lerp(bridgeTop + tubeW, bridgeBottom, (phase - 0.65) / 0.35);
        }

        const pulse = 0.7 + 0.3 * Math.sin(t * 0.25 + i * 1.1 + 1.5);
        ctx.shadowColor = '#6ee7b7';
        ctx.shadowBlur  = 8;
        ctx.fillStyle   = `rgba(110,231,183,${pulse})`;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
        ctx.fillStyle = 'rgba(110,231,183,0.9)';
        ctx.textAlign = 'center';
        ctx.fillText('Cl⁻', px, py - 6);
      }
    };

    /* ===== SOLUTION IONS (anode releasing, cathode consuming) ===== */
    const drawSolutionIons = () => {
      if (!active) return;
      const anodeColor  = hex2rgb(anode.ionColor);
      const cathodeColor= hex2rgb(cathode.ionColor);
      const aSC = hex2rgb(anode.solutionColor);
      const cSC = hex2rgb(cathode.solutionColor);

      /* static background ions (dissolved) */
      const drawBackgroundIons = (cx: number, col: { r: number; g: number; b: number }, ionLabel: string) => {
        const count = 8;
        for (let i = 0; i < count; i++) {
          const px = cx - BW * 0.32 + (i % 4) * BW * 0.21;
          const py = BT + BH * 0.20 + Math.floor(i / 4) * BH * 0.28;
          const wobble = 2 * Math.sin(t * 0.04 + i * 1.7);
          ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},0.6)`;
          ctx.beginPath();
          ctx.arc(px + wobble, py + wobble * 0.7, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = `${Math.round(W * 0.0095)}px Inter, sans-serif`;
          ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},0.8)`;
          ctx.textAlign = 'center';
          ctx.fillText(ionLabel, px + wobble, py + wobble * 0.7 - 7);
        }
      };

      drawBackgroundIons(AX,  anodeColor,   anode.ion);
      drawBackgroundIons(CX, cathodeColor,  cathode.ion);

      /* Animated ions based on cell type */
      if (isGalv) {
        /* Galvanic: Zn²⁺ rises from Zn anode, Cu²⁺ consumed at Cu cathode */
        for (let i = 0; i < 4; i++) {
          const phase = (i / 4 + t * 0.006) % 1;
          const px = AX + (i % 2 === 0 ? -1 : 1) * EW_ANODE * 0.9;
          const py = lerp(E_TOP + EH_ANODE * 0.6, BT + BH * 0.08, phase);
          const alpha = Math.sin(phase * Math.PI) * 0.9;
          ctx.fillStyle = `rgba(${anodeColor.r},${anodeColor.g},${anodeColor.b},${alpha})`;
          ctx.shadowColor = anode.ionColor;
          ctx.shadowBlur  = 8;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
          ctx.fillStyle = `rgba(${anodeColor.r},${anodeColor.g},${anodeColor.b},${alpha * 0.9})`;
          ctx.textAlign = 'center';
          ctx.fillText(anode.ion, px, py - 7);
        }

        for (let i = 0; i < 4; i++) {
          const phase = (i / 4 + t * 0.006) % 1;
          const px = lerp(CX - BW * 0.25, CX - EW_CATHODE * 0.6, phase);
          const py = BT + BH * 0.30 + (i % 2) * BH * 0.15;
          const alpha = Math.sin(phase * Math.PI) * 0.85;
          ctx.fillStyle = `rgba(${cathodeColor.r},${cathodeColor.g},${cathodeColor.b},${alpha})`;
          ctx.shadowColor = cathode.ionColor;
          ctx.shadowBlur  = 8;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
          ctx.fillStyle = `rgba(${cathodeColor.r},${cathodeColor.g},${cathodeColor.b},${alpha * 0.9})`;
          ctx.textAlign = 'center';
          ctx.fillText(cathode.ion, px, py - 7);
        }
      } else if (isElec) {
        /* Electrolytic: Cu²⁺ rises from Cu anode, Zn²⁺ consumed at Zn cathode */
        for (let i = 0; i < 4; i++) {
          const phase = (i / 4 + t * 0.006) % 1;
          const px = CX + (i % 2 === 0 ? -1 : 1) * EW_CATHODE * 0.9;
          const py = lerp(E_TOP + EH_CATHODE * 0.6, BT + BH * 0.08, phase);
          const alpha = Math.sin(phase * Math.PI) * 0.9;
          ctx.fillStyle = `rgba(${cathodeColor.r},${cathodeColor.g},${cathodeColor.b},${alpha})`;
          ctx.shadowColor = cathode.ionColor;
          ctx.shadowBlur  = 8;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
          ctx.fillStyle = `rgba(${cathodeColor.r},${cathodeColor.g},${cathodeColor.b},${alpha * 0.9})`;
          ctx.textAlign = 'center';
          ctx.fillText(cathode.ion, px, py - 7);
        }

        for (let i = 0; i < 4; i++) {
          const phase = (i / 4 + t * 0.006) % 1;
          const px = lerp(AX - BW * 0.25, AX - EW_ANODE * 0.6, phase);
          const py = BT + BH * 0.30 + (i % 2) * BH * 0.15;
          const alpha = Math.sin(phase * Math.PI) * 0.85;
          ctx.fillStyle = `rgba(${anodeColor.r},${anodeColor.g},${anodeColor.b},${alpha})`;
          ctx.shadowColor = anode.ionColor;
          ctx.shadowBlur  = 8;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.font = `bold ${Math.round(W * 0.010)}px Inter`;
          ctx.fillStyle = `rgba(${anodeColor.r},${anodeColor.g},${anodeColor.b},${alpha * 0.9})`;
          ctx.textAlign = 'center';
          ctx.fillText(anode.ion, px, py - 7);
        }
      }
    };

    /* ===== ELECTRODE NAMES ABOVE BEAKERS ===== */
    const drawNameLabels = () => {
      const sz = Math.round(W * 0.018);
      ctx.font = `bold ${sz}px Inter, system-ui, sans-serif`;

      ctx.textAlign = 'center';
      ctx.fillStyle = '#d4d4d8';
      ctx.fillText(`${anode.name} half-cell`, AX, BT - 48);
      ctx.fillStyle = '#d4d4d8';
      ctx.fillText(`${cathode.name} half-cell`, CX, BT - 48);
    };

    /* ===== ASSEMBLE SCENE ===== */
    drawBeaker(AX, anode, true);
    drawBeaker(CX, cathode, false);
    drawSaltBridge();
    drawElectrode(AX, anode, true);
    drawElectrode(CX, cathode, false);
    drawWire();
    drawVoltmeter();
    drawBridgeIons();
    drawSolutionIons();
    drawElectrons();
    drawNameLabels();

    /* cell type badge */
    const badgeText = isGalv
      ? '⚡ Galvanic Cell — Spontaneous'
      : isElec
        ? '🔋 Electrolytic Cell'
        : '⏸ Equilibrium';
    const badgeCol = isGalv ? '#4ade80' : isElec ? '#fb923c' : '#94a3b8';
    ctx.font = `bold ${Math.round(W * 0.014)}px Inter, sans-serif`;
    ctx.textAlign = 'left';
    const bw2 = ctx.measureText(badgeText).width;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    roundRect(ctx, 14, 14, bw2 + 20, 26, 6);
    ctx.fill();
    ctx.fillStyle = badgeCol;
    ctx.fillText(badgeText, 24, 32);

  }, [anode, cathode, isGalv, isElec, eActual]);

  /* animation loop */
  useEffect(() => {
    let running = true;
    const tick = () => {
      if (!running) return;
      if (!paused) {
        timeRef.current++;
        /* accumulate erosion/deposit */
        if (isGalv || isElec) {
          erosionRef.current = Math.min(1, erosionRef.current + 0.0008);
          depositRef.current = Math.min(1, depositRef.current + 0.0008);
        }
      }
      draw();
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(frameRef.current); };
  }, [paused, isGalv, isElec, draw]);

  /* reset erosion on half-cell change */
  useEffect(() => {
    erosionRef.current = 0;
    depositRef.current = 0;
    timeRef.current    = 0;
  }, [anode, cathode]);

  /* DPI-aware resize */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const dpr  = window.devicePixelRatio || 1;
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      draw();
    });
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', borderRadius: '12px', background: '#0b1120' }}
    />
  );
}

/* ── utilities ── */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  tlr = 6, trr = 6, brr = 6, blr = 6,
) {
  ctx.beginPath();
  ctx.moveTo(x + tlr, y);
  ctx.lineTo(x + w - trr, y);
  ctx.arcTo(x + w, y, x + w, y + trr, trr);
  ctx.lineTo(x + w, y + h - brr);
  ctx.arcTo(x + w, y + h, x + w - brr, y + h, brr);
  ctx.lineTo(x + blr, y + h);
  ctx.arcTo(x, y + h, x, y + h - blr, blr);
  ctx.lineTo(x, y + tlr);
  ctx.arcTo(x, y, x + tlr, y, tlr);
  ctx.closePath();
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, lw: number,
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle   = color;
  ctx.lineWidth   = lw;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * Math.cos(angle - 0.45), y2 - 9 * Math.sin(angle - 0.45));
  ctx.lineTo(x2 - 9 * Math.cos(angle + 0.45), y2 - 9 * Math.sin(angle + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
