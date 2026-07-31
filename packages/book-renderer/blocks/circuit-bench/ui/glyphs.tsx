'use client';

/*
 * circuit-bench/ui/glyphs.tsx — the circuit symbols, and nothing else.
 * ─────────────────────────────────────────────────────────────────────────────
 * Every symbol is drawn between two SCREEN-space points along its own axis, so
 * a resistor looks the same whether it is a rung of a ladder or the middle of an
 * elbow-routed lead.
 *
 * ⚠ NO <text> ANYWHERE IN HERE. The canvas is allowed exactly one text element
 * (the status line), so the meters are told apart by their MARKS rather than by
 * a letter: ammeter = a bar across the flow, voltmeter = a bar along it,
 * galvanometer = a needle. Names, values and readings all live in the
 * colour-keyed legend below the board. That is not a discipline someone has to
 * remember — there is no code path here that can emit a label.
 */

import * as React from 'react';
import type { ComponentKind } from '../types';

export interface GlyphProps {
  kind: ComponentKind;
  /** Both in SCREEN pixels; the symbol is drawn from `from` to `to`. */
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
  width: number;
  /** Only meaningful for a switch. */
  open?: boolean;
  dim?: boolean;
}

const r2 = (v: number) => Math.round(v * 100) / 100;

export function Glyph({ kind, from, to, color, width, open, dim }: GlyphProps) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;               // perpendicular, screen space
  const py = ux;
  const at = (d: number, off = 0) => ({
    x: r2(from.x + ux * d + px * off),
    y: r2(from.y + uy * d + py * off),
  });
  const common = {
    stroke: color,
    strokeWidth: Math.max(1.8, width),
    fill: 'none' as const,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    opacity: dim ? 0.45 : 1,
  };

  switch (kind) {
    case 'resistor': {
      // Six-peak zigzag — the IEC box is tidier but the zigzag is what Indian
      // school books draw, and recognition beats tidiness here.
      const amp = Math.min(9, len * 0.22);
      const n = 6;
      const pts = [at(0)];
      for (let i = 0; i < n; i++) {
        pts.push(at((len * (i + 0.5)) / n, i % 2 === 0 ? -amp : amp));
      }
      pts.push(at(len));
      return <polyline {...common} points={pts.map((p) => `${p.x},${p.y}`).join(' ')} />;
    }

    case 'bulb': {
      const c = at(len / 2);
      const r = Math.min(len / 2, 13);
      const d = r * 0.72;
      return (
        <g {...common}>
          <circle cx={c.x} cy={c.y} r={r} />
          <line x1={c.x - d} y1={c.y - d} x2={c.x + d} y2={c.y + d} />
          <line x1={c.x - d} y1={c.y + d} x2={c.x + d} y2={c.y - d} />
        </g>
      );
    }

    case 'battery': {
      // `from` is the − terminal (netlist.ts), so the SHORT thick plate is at
      // the from end and the LONG thin plate at the to end. Get this backwards
      // and every polarity question in the chapter reads wrong.
      const g = 5;
      const mid = len / 2;
      const shortP = [at(mid - g, -7), at(mid - g, 7)];
      const longP = [at(mid + g, -14), at(mid + g, 14)];
      return (
        <g {...common}>
          <line x1={at(0).x} y1={at(0).y} x2={at(mid - g).x} y2={at(mid - g).y} />
          <line x1={shortP[0].x} y1={shortP[0].y} x2={shortP[1].x} y2={shortP[1].y}
            strokeWidth={Math.max(3.5, width * 1.6)} />
          <line x1={longP[0].x} y1={longP[0].y} x2={longP[1].x} y2={longP[1].y} />
          <line x1={at(mid + g).x} y1={at(mid + g).y} x2={at(len).x} y2={at(len).y} />
        </g>
      );
    }

    case 'switch': {
      const hingeA = at(len * 0.3);
      const hingeB = at(len * 0.7);
      const lever = open ? at(len * 0.72, -14) : hingeB;
      return (
        <g {...common}>
          <line x1={at(0).x} y1={at(0).y} x2={hingeA.x} y2={hingeA.y} />
          <line x1={hingeA.x} y1={hingeA.y} x2={lever.x} y2={lever.y} />
          <line x1={hingeB.x} y1={hingeB.y} x2={at(len).x} y2={at(len).y} />
          <circle cx={hingeA.x} cy={hingeA.y} r={2.6} fill={color} stroke="none" />
          <circle cx={hingeB.x} cy={hingeB.y} r={2.6} fill={color} stroke="none" />
        </g>
      );
    }

    case 'ammeter':
    case 'voltmeter':
    case 'galvanometer': {
      const c = at(len / 2);
      const r = Math.min(len / 2, 13);
      return (
        <g {...common}>
          <line x1={at(0).x} y1={at(0).y} x2={at(len / 2 - r).x} y2={at(len / 2 - r).y} />
          <circle cx={c.x} cy={c.y} r={r} />
          <line x1={at(len / 2 + r).x} y1={at(len / 2 + r).y} x2={at(len).x} y2={at(len).y} />
          {kind === 'ammeter' && (
            // a bar ACROSS the flow — it sits in the current's way
            <line x1={c.x + px * r * 0.6} y1={c.y + py * r * 0.6}
              x2={c.x - px * r * 0.6} y2={c.y - py * r * 0.6} />
          )}
          {kind === 'voltmeter' && (
            // a bar ALONG the flow — it bridges across, it does not block
            <line x1={c.x + ux * r * 0.6} y1={c.y + uy * r * 0.6}
              x2={c.x - ux * r * 0.6} y2={c.y - uy * r * 0.6} />
          )}
          {kind === 'galvanometer' && (
            // a needle off centre — it deflects either way from zero
            <line x1={c.x} y1={c.y + r * 0.55}
              x2={c.x + r * 0.55} y2={c.y - r * 0.5} />
          )}
        </g>
      );
    }

    case 'capacitor': {
      const g = 5;
      const mid = len / 2;
      return (
        <g {...common}>
          <line x1={at(0).x} y1={at(0).y} x2={at(mid - g).x} y2={at(mid - g).y} />
          <line x1={at(mid - g, -12).x} y1={at(mid - g, -12).y}
            x2={at(mid - g, 12).x} y2={at(mid - g, 12).y} />
          <line x1={at(mid + g, -12).x} y1={at(mid + g, -12).y}
            x2={at(mid + g, 12).x} y2={at(mid + g, 12).y} />
          <line x1={at(mid + g).x} y1={at(mid + g).y} x2={at(len).x} y2={at(len).y} />
        </g>
      );
    }

    case 'inductor': {
      const n = 4;
      const seg = len / (n + 2);
      let d = `M ${at(0).x} ${at(0).y} L ${at(seg).x} ${at(seg).y}`;
      for (let i = 0; i < n; i++) {
        const s = at(seg + i * seg);
        const e = at(seg + (i + 1) * seg);
        d += ` A ${r2(seg / 2)} ${r2(seg / 2)} 0 0 1 ${e.x} ${e.y}`;
        void s;
      }
      d += ` L ${at(len).x} ${at(len).y}`;
      return <path {...common} d={d} />;
    }

    case 'wire':
    default:
      return (
        <line {...common}
          x1={at(0).x} y1={at(0).y} x2={at(len).x} y2={at(len).y} />
      );
  }
}

/** The palette icon for a kind — the same symbol, drawn horizontally. */
export function GlyphChip({ kind, color, size = 34 }:
{ kind: ComponentKind; color: string; size?: number }) {
  return (
    <svg width={size} height={20} viewBox={`0 0 ${size} 20`} aria-hidden focusable="false">
      <Glyph kind={kind} from={{ x: 2, y: 10 }} to={{ x: size - 2, y: 10 }}
        color={color} width={2} />
    </svg>
  );
}
