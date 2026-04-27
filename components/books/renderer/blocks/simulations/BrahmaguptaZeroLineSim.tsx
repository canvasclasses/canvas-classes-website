'use client';

// BrahmaguptaZeroLineSim.tsx
// Class 9 Mathematics — Chapter 1 — Page 2 (Bhārat's Coordinate Heritage)
// A horizontal number line with a draggable point. A toggle compares
//   (a) the pre-Brahmagupta line — only zero & positives exist
//   (b) the post-Brahmagupta line — full real line, both directions
// The point is constrained to the visible region; arithmetic ("a + b") is shown live.

import { useState, useCallback, useRef } from 'react';

const X_MIN = -10;
const X_MAX = 10;
const UNIT = 32;
const PAD_X = 30;
const PAD_Y = 30;
const SVG_W = (X_MAX - X_MIN) * UNIT + PAD_X * 2;
const SVG_H = 200;
const AXIS_Y = SVG_H / 2;

function toSvg(x: number) {
  return PAD_X + (x - X_MIN) * UNIT;
}

function fromSvg(px: number) {
  const x = (px - PAD_X) / UNIT + X_MIN;
  return Math.round(x);
}

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function fmt(n: number): string {
  if (n < 0) return '−' + Math.abs(n);
  return String(n);
}

type Era = 'before' | 'after';

export default function BrahmaguptaZeroLineSim() {
  const [era, setEra] = useState<Era>('before');
  const [a, setA] = useState<number>(3);
  const [b, setB] = useState<number>(-2);
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const minVisible = era === 'before' ? 0 : X_MIN;
  const maxVisible = X_MAX;

  // Constrain values to visible range when era flips
  const aClamped = clamp(a, minVisible, maxVisible);
  const bClamped = clamp(b, minVisible, maxVisible);

  const setA2 = useCallback((v: number) => setA(clamp(v, minVisible, maxVisible)), [minVisible, maxVisible]);
  const setB2 = useCallback((v: number) => setB(clamp(v, minVisible, maxVisible)), [minVisible, maxVisible]);

  const sum = aClamped + bClamped;
  const sumVisible = sum >= minVisible && sum <= maxVisible;

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const py = ((e.clientY - rect.top) / rect.height) * SVG_H;
    // Hit-test a vs b — pick the one closer to click
    const ax = toSvg(aClamped);
    const bx = toSvg(bClamped);
    const dA = Math.hypot(px - ax, py - (AXIS_Y - 18));
    const dB = Math.hypot(px - bx, py - (AXIS_Y + 18));
    const which = dA < dB ? 'a' : 'b';
    setDragging(which);
    const x = fromSvg(px);
    if (which === 'a') setA2(x); else setB2(x);
  }, [aClamped, bClamped, setA2, setB2]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SVG_W;
    const x = fromSvg(px);
    if (dragging === 'a') setA2(x); else setB2(x);
  }, [dragging, setA2, setB2]);

  const onPointerUp = useCallback(() => setDragging(null), []);

  return (
    <div style={{
      background: '#0d1117', color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16, padding: 24, maxWidth: 900, margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', margin: 0 }}>
          Brahmagupta&rsquo;s <span style={{ color: '#f59e0b' }}>Number Line</span>
        </h1>
        <p style={{
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#475569', marginTop: 4, marginBottom: 0,
        }}>
          Before vs After 628 CE · Class 9 Mathematics
        </p>
      </div>

      {/* Era toggle */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        {([
          ['before', 'Before 628 CE — only ≥ 0 exists'],
          ['after',  'After 628 CE — full real line'],
        ] as [Era, string][]).map(([e, label]) => {
          const active = era === e;
          return (
            <button
              key={e} onClick={() => setEra(e)}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                border: active ? '1px solid rgba(245,158,11,0.6)' : '1px solid rgba(255,255,255,0.08)',
                background: active ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                color: active ? '#fbbf24' : '#94a3b8',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10, lineHeight: 1.5 }}>
        Drag the orange point <b style={{ color: '#fbbf24' }}>a</b> (above the line) and the green point <b style={{ color: '#34d399' }}>b</b> (below). The sum <b>a + b</b> appears as a small marker — and may or may not be a number you&rsquo;re allowed to write down.
      </p>

      {/* SVG */}
      <div style={{
        borderRadius: 12, overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)', background: '#0B0F15',
        marginBottom: 14,
      }}>
        <svg
          ref={svgRef} width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          style={{ display: 'block', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* "Forbidden zone" overlay — pre-Brahmagupta only */}
          {era === 'before' && (
            <rect x={PAD_X} y={0} width={toSvg(0) - PAD_X} height={SVG_H}
              fill="rgba(0,0,0,0.6)" />
          )}

          {/* Axis line */}
          <line x1={PAD_X} y1={AXIS_Y} x2={SVG_W - PAD_X} y2={AXIS_Y}
            stroke="#fbbf24" strokeWidth={1.8} />

          {/* Arrow on positive side */}
          <path d={`M${SVG_W - PAD_X},${AXIS_Y} l-7,-4 l0,8 z`} fill="#fbbf24" />
          {era === 'after' && (
            <path d={`M${PAD_X},${AXIS_Y} l7,-4 l0,8 z`} fill="#fbbf24" />
          )}

          {/* Tick marks & labels */}
          {Array.from({ length: X_MAX - X_MIN + 1 }, (_, i) => {
            const x = X_MIN + i;
            const px = toSvg(x);
            const visible = era === 'after' || x >= 0;
            return (
              <g key={`t${x}`}>
                <line x1={px} y1={AXIS_Y - 5} x2={px} y2={AXIS_Y + 5}
                  stroke={visible ? '#fbbf24' : 'rgba(255,255,255,0.15)'} strokeWidth={1.2} />
                <text x={px} y={AXIS_Y + 18}
                  fill={visible ? '#94a3b8' : 'rgba(255,255,255,0.2)'}
                  fontSize={10} fontWeight={600} textAnchor="middle">
                  {fmt(x)}
                </text>
              </g>
            );
          })}

          {/* "Forbidden" label — pre-Brahmagupta only */}
          {era === 'before' && (
            <text x={(PAD_X + toSvg(0)) / 2} y={36} fill="rgba(248,113,113,0.7)"
              fontSize={11} fontWeight={700} textAnchor="middle" letterSpacing="0.08em">
              NOT YET A NUMBER
            </text>
          )}

          {/* Origin marker */}
          <circle cx={toSvg(0)} cy={AXIS_Y} r={4} fill="#f59e0b" stroke="#0B0F15" strokeWidth={1.5} />
          <text x={toSvg(0)} y={AXIS_Y - 12} fill="#fbbf24" fontSize={9} fontWeight={700} textAnchor="middle">0</text>

          {/* Point a (orange, above) */}
          <g>
            <line x1={toSvg(aClamped)} y1={AXIS_Y - 18} x2={toSvg(aClamped)} y2={AXIS_Y}
              stroke="#fbbf24" strokeWidth={1.2} />
            <circle cx={toSvg(aClamped)} cy={AXIS_Y - 18} r={9}
              fill="#f59e0b" stroke="#0B0F15" strokeWidth={2} />
            <text x={toSvg(aClamped)} y={AXIS_Y - 32} fill="#fbbf24"
              fontSize={11} fontWeight={700} textAnchor="middle">
              a = {fmt(aClamped)}
            </text>
          </g>

          {/* Point b (green, below) */}
          <g>
            <line x1={toSvg(bClamped)} y1={AXIS_Y} x2={toSvg(bClamped)} y2={AXIS_Y + 18}
              stroke="#34d399" strokeWidth={1.2} />
            <circle cx={toSvg(bClamped)} cy={AXIS_Y + 18} r={9}
              fill="#34d399" stroke="#0B0F15" strokeWidth={2} />
            <text x={toSvg(bClamped)} y={AXIS_Y + 44} fill="#34d399"
              fontSize={11} fontWeight={700} textAnchor="middle">
              b = {fmt(bClamped)}
            </text>
          </g>

          {/* Sum marker */}
          {sumVisible && (
            <g>
              <line x1={toSvg(sum)} y1={AXIS_Y + 56} x2={toSvg(sum)} y2={AXIS_Y + 76}
                stroke="rgba(99,102,241,0.6)" strokeWidth={1.2} strokeDasharray="3 2" />
              <rect x={toSvg(sum) - 18} y={AXIS_Y + 78} width={36} height={18}
                fill="rgba(99,102,241,0.18)" stroke="rgba(99,102,241,0.6)"
                strokeWidth={1} rx={4} />
              <text x={toSvg(sum)} y={AXIS_Y + 91} fill="#c7d2fe"
                fontSize={11} fontWeight={700} textAnchor="middle">
                {fmt(sum)}
              </text>
            </g>
          )}
          {!sumVisible && (
            <text x={SVG_W / 2} y={SVG_H - 14} fill="#f87171"
              fontSize={11} fontWeight={700} textAnchor="middle">
              a + b = {fmt(sum)} — outside the era&rsquo;s allowed range
            </text>
          )}
        </svg>
      </div>

      {/* Live arithmetic readout */}
      <div style={{
        borderRadius: 10, padding: '12px 14px',
        background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)',
      }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fbbf24', margin: 0, marginBottom: 6 }}>
          Live Arithmetic
        </p>
        <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, lineHeight: 1.5 }}>
          <b style={{ color: '#fbbf24' }}>a</b> + <b style={{ color: '#34d399' }}>b</b> = {fmt(aClamped)} + {fmt(bClamped)} = <b style={{ color: '#c7d2fe' }}>{fmt(sum)}</b>
        </p>
        {era === 'before' && sum < 0 && (
          <p style={{ fontSize: 12, color: '#f87171', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
            In the pre-Brahmagupta world this answer simply did not exist as a written number — Greek mathematicians would say the operation was &ldquo;impossible&rdquo;.
          </p>
        )}
        {era === 'after' && sum < 0 && (
          <p style={{ fontSize: 12, color: '#34d399', marginTop: 6, marginBottom: 0, lineHeight: 1.5 }}>
            Brahmagupta&rsquo;s rules — written down in 628 CE — make this a perfectly ordinary negative number.
          </p>
        )}
      </div>
    </div>
  );
}
