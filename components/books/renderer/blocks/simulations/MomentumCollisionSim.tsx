'use client';

// MomentumCollisionSim.tsx
// Class 9 Physics — Force and Laws of Motion (Chapter 2)
// Demonstrates Conservation of Momentum in elastic and perfectly inelastic collisions.
// Source: NCERT Class 9 Science, Chapter 9 (Laws of Motion) — "The total momentum of
// an isolated system of objects is conserved." (p. 118, NCERT 2023 edition)
// Elastic collision formulas: standard classical mechanics (NCERT Class 11 Chapter 6).
// Design follows SIMULATION_DESIGN_WORKFLOW.md exactly.

import { useState, useEffect, useRef, useCallback } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────

type CollisionType = 'elastic' | 'inelastic';
type Phase = 'setup' | 'animating' | 'done';

// ── Physics helpers ─────────────────────────────────────────────────────────────
// Source: NCERT Class 11 Physics, Chapter 6 — Work, Energy and Power
// Elastic: v1' = ((m1-m2)*v1 + 2*m2*v2)/(m1+m2)
//          v2' = ((m2-m1)*v2 + 2*m1*v1)/(m1+m2)
// Inelastic (perfectly): v_f = (m1*v1 + m2*v2)/(m1+m2)

function calcElastic(m1: number, v1: number, m2: number, v2: number) {
  const denom = m1 + m2;
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / denom;
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / denom;
  return { v1f, v2f };
}

function calcInelastic(m1: number, v1: number, m2: number, v2: number) {
  const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
  return { vf };
}

function ke(m: number, v: number) {
  return 0.5 * m * v * v;
}

// ── Track layout constants ─────────────────────────────────────────────────────

const SVG_W = 500;
const SVG_H = 130;
const TRACK_Y = 90;    // y of rail
const CART_H = 30;
const CART_Y = TRACK_Y - CART_H; // top of cart = 60

// Cart width from mass: 30 + m*4 px
function cartW(mass: number) { return 30 + mass * 4; }

// Initial positions: A starts left, B starts right
// Positions are left-edge x of cart
const INITIAL_AX = 30;
const INITIAL_BX = 380;

// ── Arrowhead helper ───────────────────────────────────────────────────────────

function arrowTip(x1: number, y: number, x2: number, size = 7) {
  // Horizontal only; pointing right if x2>x1, left if x2<x1
  const dir = x2 > x1 ? 1 : -1;
  const tipX = x2;
  const ax = tipX - dir * size;
  return `M${ax},${y - 4} L${tipX},${y} L${ax},${y + 4}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function MomentumCollisionSim() {
  const [m1, setM1] = useState(3);
  const [m2, setM2] = useState(3);
  const [v1, setV1] = useState(6);
  const [v2, setV2] = useState(0);
  const [collisionType, setCollisionType] = useState<CollisionType>('elastic');
  const [phase, setPhase] = useState<Phase>('setup');
  const [cartAx, setCartAx] = useState(INITIAL_AX);
  const [cartBx, setCartBx] = useState(INITIAL_BX);
  const [v1After, setV1After] = useState<number | null>(null);
  const [v2After, setV2After] = useState<number | null>(null);
  const [vInelastic, setVInelastic] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);

  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // ── Computed momentum/KE values ────────────────────────────────────────────

  const pA_before = m1 * v1;
  const pB_before = m2 * v2;
  const p_total_before = pA_before + pB_before;

  let pA_after = 0;
  let pB_after = 0;
  let p_total_after = 0;
  let ke_before = ke(m1, v1) + ke(m2, Math.abs(v2));
  let ke_after = 0;

  if (phase === 'done') {
    if (collisionType === 'elastic' && v1After !== null && v2After !== null) {
      pA_after = m1 * v1After;
      pB_after = m2 * v2After;
      p_total_after = pA_after + pB_after;
      ke_after = ke(m1, Math.abs(v1After)) + ke(m2, Math.abs(v2After));
    } else if (collisionType === 'inelastic' && vInelastic !== null) {
      pA_after = (m1 + m2) * vInelastic;
      pB_after = 0;
      p_total_after = pA_after;
      ke_after = ke(m1 + m2, Math.abs(vInelastic));
    }
  } else {
    // Before collision — show pre-collision values for the "after" row too (dashes rendered separately)
    p_total_after = p_total_before; // conservation
  }

  const ke_diff = ke_before - ke_after;
  const ke_lost = phase === 'done' ? ke_diff : 0;

  // ── Animation ──────────────────────────────────────────────────────────────

  const runAnimation = useCallback(() => {
    // Phase 1: carts approach (A moves right, B moves left if v2 < 0)
    // We simulate in two stages: approach → flash → separate
    // Stage durations:
    const APPROACH_MS = 900;
    const FLASH_MS = 120;
    const SEPARATE_MS = 700;

    // Pre-compute collision x position (where carts meet — right edge of A = left edge of B)
    // We find where: INITIAL_AX + w1 + progress*v1*scale = INITIAL_BX + progress*v2*scale
    // Approximation: collision at midpoint between initial inner edges
    const w1 = cartW(m1);
    const w2 = cartW(m2);
    // Inner edge of A: INITIAL_AX + w1; inner edge of B: INITIAL_BX
    // When they meet: INITIAL_AX + w1 + d_A = INITIAL_BX - d_B
    // Speed ratio: d_A/d_B = v1/|v2| if v2≠0, else d_B=0
    let collisionAx: number;
    let collisionBx: number;

    if (v2 === 0) {
      // B is stationary — A travels all the way to B
      collisionBx = INITIAL_BX;
      collisionAx = INITIAL_BX - w1;
    } else {
      // Both move toward each other
      const gap = INITIAL_BX - (INITIAL_AX + w1); // px gap
      const totalSpeed = v1 + Math.abs(v2);
      const aShare = v1 / totalSpeed;
      collisionAx = INITIAL_AX + gap * aShare;
      collisionBx = INITIAL_BX - gap * (Math.abs(v2) / totalSpeed);
    }

    // Post-collision velocities
    let postV1 = 0;
    let postV2 = 0;
    let postVf = 0;

    if (collisionType === 'elastic') {
      const result = calcElastic(m1, v1, m2, v2);
      postV1 = result.v1f;
      postV2 = result.v2f;
      setV1After(postV1);
      setV2After(postV2);
    } else {
      const result = calcInelastic(m1, v1, m2, v2);
      postVf = result.vf;
      setVInelastic(postVf);
    }

    // Separate destination x positions (scale: 60px per unit of post-velocity)
    const SCALE = 35; // px per m/s
    let finalAx: number;
    let finalBx: number;

    if (collisionType === 'inelastic') {
      // They stick — one combined cart
      finalAx = collisionAx + postVf * SCALE;
      finalBx = finalAx; // same rect drawn at finalAx
    } else {
      finalAx = collisionAx + postV1 * SCALE;
      finalBx = collisionBx + postV2 * SCALE;
    }

    // Clamp to SVG bounds
    finalAx = Math.max(0, Math.min(SVG_W - w1 - 4, finalAx));
    finalBx = Math.max(0, Math.min(SVG_W - w2 - 4, finalBx));

    startTimeRef.current = performance.now();

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;

      if (elapsed < APPROACH_MS) {
        // Stage 1: approach
        const t = elapsed / APPROACH_MS;
        const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        setCartAx(INITIAL_AX + (collisionAx - INITIAL_AX) * eased);
        setCartBx(INITIAL_BX + (collisionBx - INITIAL_BX) * eased);
        animRef.current = requestAnimationFrame(tick);
      } else if (elapsed < APPROACH_MS + FLASH_MS) {
        // Stage 2: flash
        setCartAx(collisionAx);
        setCartBx(collisionBx);
        setShowFlash(true);
        animRef.current = requestAnimationFrame(tick);
      } else if (elapsed < APPROACH_MS + FLASH_MS + SEPARATE_MS) {
        // Stage 3: separate
        setShowFlash(false);
        const t = (elapsed - APPROACH_MS - FLASH_MS) / SEPARATE_MS;
        const eased = 1 - Math.pow(1 - t, 3);
        setCartAx(collisionAx + (finalAx - collisionAx) * eased);
        setCartBx(collisionBx + (finalBx - collisionBx) * eased);
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Done
        setShowFlash(false);
        setCartAx(finalAx);
        setCartBx(finalBx);
        setPhase('done');
      }
    }

    animRef.current = requestAnimationFrame(tick);
  }, [m1, m2, v1, v2, collisionType]);

  const handlePlay = () => {
    if (phase !== 'setup') return;
    setPhase('animating');
    runAnimation();
  };

  const handleReset = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setPhase('setup');
    setCartAx(INITIAL_AX);
    setCartBx(INITIAL_BX);
    setV1After(null);
    setV2After(null);
    setVInelastic(null);
    setShowFlash(false);
  }, []);

  // Reset animation on param changes
  useEffect(() => {
    if (phase !== 'setup') handleReset();
  }, [m1, m2, v1, v2, collisionType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  // ── Render helpers ─────────────────────────────────────────────────────────

  const w1 = cartW(m1);
  const w2 = cartW(m2);
  // Collision flash x = right edge of A = left edge of B at collision
  const flashX = cartAx + w1;

  // ── Momentum bar chart values ──────────────────────────────────────────────
  const maxP = Math.max(Math.abs(p_total_before), 0.1);
  const beforeBarPct = Math.min(100, (Math.abs(p_total_before) / Math.max(Math.abs(p_total_before), Math.abs(p_total_after), 0.1)) * 100);
  const afterBarPct = phase === 'done'
    ? Math.min(100, (Math.abs(p_total_after) / Math.max(Math.abs(p_total_before), Math.abs(p_total_after), 0.1)) * 100)
    : 0;

  // ── KE bar chart ───────────────────────────────────────────────────────────
  const maxKE = Math.max(ke_before, 0.1);
  const keBeforePct = 100;
  const keAfterPct = phase === 'done' ? Math.min(100, (ke_after / maxKE) * 100) : 0;

  const fmt = (n: number) => (Math.round(n * 10) / 10).toFixed(1);

  // Inelastic combined cart — when done, draw as one wide rect starting at cartAx
  const combinedW = w1 + w2 + 4;

  return (
    <div style={{
      background: '#0d1117',
      color: '#e2e8f0',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      borderRadius: 16,
      padding: 24,
      maxWidth: 900,
      margin: '0 auto',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 18 }}>
        <h1 style={{
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: '#fff',
          margin: 0,
        }}>
          Conservation of <span style={{ color: '#f59e0b' }}>Momentum</span>
        </h1>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#475569',
          marginTop: 4,
          marginBottom: 0,
        }}>
          Collision Explorer · Class 9 Physics
        </p>
      </div>

      {/* ── Controls panel — two-column grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 14,
      }}>
        {/* Cart A */}
        <div style={{
          borderRadius: 12,
          padding: '14px 16px',
          background: 'rgba(96,165,250,0.07)',
          border: '1px solid rgba(96,165,250,0.25)',
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#60a5fa',
            margin: '0 0 10px',
          }}>Cart A (Blue)</p>

          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
            Mass: <strong style={{ color: '#e2e8f0' }}>{m1} kg</strong>
          </label>
          <input type="range" min={1} max={10} value={m1}
            onChange={e => setM1(Number(e.target.value))}
            disabled={phase !== 'setup'}
            style={{ width: '100%', accentColor: '#60a5fa', marginBottom: 10 }}
          />

          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
            Velocity: <strong style={{ color: '#e2e8f0' }}>{v1} m/s →</strong>
          </label>
          <input type="range" min={1} max={15} value={v1}
            onChange={e => setV1(Number(e.target.value))}
            disabled={phase !== 'setup'}
            style={{ width: '100%', accentColor: '#60a5fa' }}
          />
        </div>

        {/* Cart B */}
        <div style={{
          borderRadius: 12,
          padding: '14px 16px',
          background: 'rgba(245,158,11,0.07)',
          border: '1px solid rgba(245,158,11,0.25)',
        }}>
          <p style={{
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: '#f59e0b',
            margin: '0 0 10px',
          }}>Cart B (Amber)</p>

          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
            Mass: <strong style={{ color: '#e2e8f0' }}>{m2} kg</strong>
          </label>
          <input type="range" min={1} max={10} value={m2}
            onChange={e => setM2(Number(e.target.value))}
            disabled={phase !== 'setup'}
            style={{ width: '100%', accentColor: '#f59e0b', marginBottom: 10 }}
          />

          <label style={{ fontSize: 12, color: '#94a3b8', display: 'block', marginBottom: 4 }}>
            Velocity: <strong style={{ color: '#e2e8f0' }}>{v2} m/s</strong>
          </label>
          <input type="range" min={-8} max={0} value={v2}
            onChange={e => setV2(Number(e.target.value))}
            disabled={phase !== 'setup'}
            style={{ width: '100%', accentColor: '#f59e0b', marginBottom: 6 }}
          />
          <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>
            0 = stationary · negative = approaching
          </p>
        </div>
      </div>

      {/* ── Collision type selector ── */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 14,
      }}>
        <button
          onClick={() => { setCollisionType('elastic'); handleReset(); }}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            border: collisionType === 'elastic'
              ? '1px solid rgba(245,158,11,0.6)'
              : '1px solid rgba(255,255,255,0.08)',
            background: collisionType === 'elastic'
              ? 'rgba(245,158,11,0.18)'
              : 'rgba(255,255,255,0.04)',
            color: collisionType === 'elastic' ? '#fbbf24' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          Elastic
        </button>
        <button
          onClick={() => { setCollisionType('inelastic'); handleReset(); }}
          style={{
            flex: 1,
            padding: '8px 0',
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            border: collisionType === 'inelastic'
              ? '1px solid rgba(239,68,68,0.6)'
              : '1px solid rgba(255,255,255,0.08)',
            background: collisionType === 'inelastic'
              ? 'rgba(239,68,68,0.18)'
              : 'rgba(255,255,255,0.04)',
            color: collisionType === 'inelastic' ? '#f87171' : '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          Perfectly Inelastic
        </button>
      </div>

      {/* ── Track SVG ── */}
      <div style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        background: '#0d1117',
        marginBottom: 14,
        position: 'relative',
      }}>
        <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ display: 'block' }}>

          {/* Track rail */}
          <line x1={10} y1={TRACK_Y} x2={SVG_W - 10} y2={TRACK_Y}
            stroke="rgba(255,255,255,0.15)" strokeWidth={2.5} />

          {/* Tick marks every 50px */}
          {Array.from({ length: 9 }, (_, i) => (i + 1) * 50).map(x => (
            <line key={x} x1={x} y1={TRACK_Y - 4} x2={x} y2={TRACK_Y + 4}
              stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
          ))}

          {/* Collision flash */}
          {showFlash && (
            <circle
              cx={flashX} cy={TRACK_Y - 10}
              r={22}
              fill="rgba(255,255,255,0.65)"
              style={{ filter: 'blur(3px)' }}
            />
          )}

          {/* ── Inelastic done: one combined cart ── */}
          {collisionType === 'inelastic' && phase === 'done' ? (
            <g>
              <rect
                x={cartAx} y={CART_Y}
                width={combinedW} height={CART_H}
                rx={5}
                fill="rgba(139,92,246,0.4)"
                stroke="#8b5cf6"
                strokeWidth={1.5}
              />
              <text x={cartAx + combinedW / 2} y={CART_Y + 18}
                fill="#c4b5fd" fontSize={11} fontWeight={700} textAnchor="middle">
                A+B · {m1 + m2} kg
              </text>
              {/* Velocity arrow for combined */}
              {vInelastic !== null && Math.abs(vInelastic) > 0.05 && (
                <>
                  <line
                    x1={vInelastic > 0 ? cartAx + combinedW : cartAx}
                    y1={CART_Y + CART_H / 2}
                    x2={vInelastic > 0 ? cartAx + combinedW + 20 : cartAx - 20}
                    y2={CART_Y + CART_H / 2}
                    stroke="#8b5cf6" strokeWidth={2}
                  />
                  <path
                    d={arrowTip(
                      vInelastic > 0 ? cartAx + combinedW : cartAx - 20,
                      CART_Y + CART_H / 2,
                      vInelastic > 0 ? cartAx + combinedW + 20 : cartAx - 20,
                    )}
                    stroke="#8b5cf6" strokeWidth={2} fill="none"
                  />
                </>
              )}
            </g>
          ) : (
            <>
              {/* ── Cart A ── */}
              <g>
                <rect
                  x={cartAx} y={CART_Y}
                  width={w1} height={CART_H}
                  rx={5}
                  fill="rgba(96,165,250,0.35)"
                  stroke="#60a5fa"
                  strokeWidth={1.5}
                />
                <text x={cartAx + w1 / 2} y={CART_Y + 18}
                  fill="#93c5fd" fontSize={11} fontWeight={700} textAnchor="middle">
                  A · {m1}kg
                </text>
                {/* Velocity arrow → */}
                {phase === 'setup' && (
                  <>
                    <line x1={cartAx + w1} y1={CART_Y + CART_H / 2}
                      x2={cartAx + w1 + 18} y2={CART_Y + CART_H / 2}
                      stroke="#60a5fa" strokeWidth={2} />
                    <path
                      d={arrowTip(cartAx + w1, CART_Y + CART_H / 2, cartAx + w1 + 18)}
                      stroke="#60a5fa" strokeWidth={2} fill="none" />
                  </>
                )}
                {/* Post-collision arrow for elastic */}
                {phase === 'done' && collisionType === 'elastic' && v1After !== null && Math.abs(v1After) > 0.05 && (
                  <>
                    <line
                      x1={v1After > 0 ? cartAx + w1 : cartAx}
                      y1={CART_Y + CART_H / 2}
                      x2={v1After > 0 ? cartAx + w1 + 18 : cartAx - 18}
                      y2={CART_Y + CART_H / 2}
                      stroke="#60a5fa" strokeWidth={2}
                    />
                    <path
                      d={arrowTip(
                        v1After > 0 ? cartAx + w1 : cartAx - 18,
                        CART_Y + CART_H / 2,
                        v1After > 0 ? cartAx + w1 + 18 : cartAx - 18,
                      )}
                      stroke="#60a5fa" strokeWidth={2} fill="none"
                    />
                  </>
                )}
              </g>

              {/* ── Cart B ── */}
              <g>
                <rect
                  x={cartBx} y={CART_Y}
                  width={w2} height={CART_H}
                  rx={5}
                  fill="rgba(245,158,11,0.35)"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                />
                <text x={cartBx + w2 / 2} y={CART_Y + 18}
                  fill="#fcd34d" fontSize={11} fontWeight={700} textAnchor="middle">
                  B · {m2}kg
                </text>
                {/* Velocity arrow ← when v2 < 0 */}
                {phase === 'setup' && v2 < 0 && (
                  <>
                    <line x1={cartBx} y1={CART_Y + CART_H / 2}
                      x2={cartBx - 18} y2={CART_Y + CART_H / 2}
                      stroke="#f59e0b" strokeWidth={2} />
                    <path
                      d={arrowTip(cartBx, CART_Y + CART_H / 2, cartBx - 18)}
                      stroke="#f59e0b" strokeWidth={2} fill="none" />
                  </>
                )}
                {/* Post-collision arrow for elastic */}
                {phase === 'done' && collisionType === 'elastic' && v2After !== null && Math.abs(v2After) > 0.05 && (
                  <>
                    <line
                      x1={v2After > 0 ? cartBx + w2 : cartBx}
                      y1={CART_Y + CART_H / 2}
                      x2={v2After > 0 ? cartBx + w2 + 18 : cartBx - 18}
                      y2={CART_Y + CART_H / 2}
                      stroke="#f59e0b" strokeWidth={2}
                    />
                    <path
                      d={arrowTip(
                        v2After > 0 ? cartBx + w2 : cartBx - 18,
                        CART_Y + CART_H / 2,
                        v2After > 0 ? cartBx + w2 + 18 : cartBx - 18,
                      )}
                      stroke="#f59e0b" strokeWidth={2} fill="none"
                    />
                  </>
                )}
              </g>
            </>
          )}

          {/* Labels: p=mv */}
          <text x={10} y={SVG_H - 6} fill="#334155" fontSize={10} fontWeight={700}>
            p = mv
          </text>
        </svg>
      </div>

      {/* ── Momentum table ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: '#0B0F15',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 12,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#94a3b8',
          margin: '0 0 10px',
        }}>Momentum (p = mv) · kg·m/s</p>

        {/* Before row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 48 }}>Before:</span>
          <span style={{ fontSize: 12, color: '#93c5fd' }}>
            p<sub>A</sub> = {m1}×{v1} = <strong>{pA_before}</strong>
          </span>
          <span style={{ fontSize: 12, color: '#fcd34d' }}>
            p<sub>B</sub> = {m2}×{v2} = <strong>{pB_before}</strong>
          </span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>
            Total = {fmt(p_total_before)}
          </span>
        </div>

        {/* After row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 12, color: '#94a3b8', minWidth: 48 }}>After:</span>
          {phase === 'done' ? (
            collisionType === 'elastic' && v1After !== null && v2After !== null ? (
              <>
                <span style={{ fontSize: 12, color: '#93c5fd' }}>
                  p<sub>A</sub>′ = {m1}×{fmt(v1After)} = <strong>{fmt(m1 * v1After)}</strong>
                </span>
                <span style={{ fontSize: 12, color: '#fcd34d' }}>
                  p<sub>B</sub>′ = {m2}×{fmt(v2After)} = <strong>{fmt(m2 * v2After)}</strong>
                </span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>
                  Total = {fmt(p_total_after)}
                </span>
              </>
            ) : vInelastic !== null ? (
              <>
                <span style={{ fontSize: 12, color: '#c4b5fd' }}>
                  p<sub>A+B</sub> = {m1 + m2}×{fmt(vInelastic)} = <strong>{fmt((m1 + m2) * vInelastic)}</strong>
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>—</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#34d399' }}>
                  Total = {fmt(p_total_after)}
                </span>
              </>
            ) : null
          ) : (
            <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>
              Play the collision to see results
            </span>
          )}
        </div>

        {/* Momentum bar chart */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          {/* Before bar */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 4px', fontWeight: 700 }}>BEFORE</p>
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${beforeBarPct}%`,
                background: '#34d399',
                borderRadius: 5,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ fontSize: 10, color: '#34d399', margin: '3px 0 0', fontWeight: 700 }}>{fmt(p_total_before)} kg·m/s</p>
          </div>
          {/* After bar */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 4px', fontWeight: 700 }}>AFTER</p>
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${afterBarPct}%`,
                background: '#34d399',
                borderRadius: 5,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{ fontSize: 10, color: '#34d399', margin: '3px 0 0', fontWeight: 700 }}>
              {phase === 'done' ? `${fmt(p_total_after)} kg·m/s` : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Kinetic Energy table ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: '#0B0F15',
        border: '1px solid rgba(255,255,255,0.07)',
        marginBottom: 14,
      }}>
        <p style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#94a3b8',
          margin: '0 0 8px',
        }}>Kinetic Energy (KE = ½mv²) · Joules</p>

        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 4px', fontWeight: 700 }}>BEFORE</p>
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${keBeforePct}%`,
                background: '#fbbf24',
                borderRadius: 5,
              }} />
            </div>
            <p style={{ fontSize: 10, color: '#fbbf24', margin: '3px 0 0', fontWeight: 700 }}>{fmt(ke_before)} J</p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: '#64748b', margin: '0 0 4px', fontWeight: 700 }}>AFTER</p>
            <div style={{ height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${keAfterPct}%`,
                background: phase === 'done' && collisionType === 'inelastic' ? '#f87171' : '#fbbf24',
                borderRadius: 5,
                transition: 'width 0.5s ease',
              }} />
            </div>
            <p style={{
              fontSize: 10,
              color: phase === 'done' && collisionType === 'inelastic' ? '#f87171' : '#fbbf24',
              margin: '3px 0 0',
              fontWeight: 700,
            }}>
              {phase === 'done' ? `${fmt(ke_after)} J` : '—'}
            </p>
          </div>
        </div>

        {/* Energy lost (inelastic only) */}
        {phase === 'done' && collisionType === 'inelastic' && ke_lost > 0.01 && (
          <p style={{ fontSize: 12, color: '#f87171', marginTop: 8, marginBottom: 0 }}>
            Energy lost to heat/sound: <strong>{fmt(ke_lost)} J</strong>
          </p>
        )}
        {phase === 'done' && collisionType === 'elastic' && (
          <p style={{ fontSize: 12, color: '#34d399', marginTop: 8, marginBottom: 0 }}>
            KE conserved — elastic collision loses no energy.
          </p>
        )}
      </div>

      {/* ── Buttons ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
        <button
          onClick={handlePlay}
          disabled={phase !== 'setup'}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 800,
            cursor: phase !== 'setup' ? 'not-allowed' : 'pointer',
            border: '1px solid rgba(245,158,11,0.5)',
            background: phase !== 'setup' ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.2)',
            color: phase !== 'setup' ? '#475569' : '#fbbf24',
            opacity: phase !== 'setup' ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          ▶ Play Collision
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8',
            transition: 'all 0.2s',
          }}
        >
          ↺ Reset
        </button>
      </div>

      {/* ── Key insight callout ── */}
      <div style={{
        borderRadius: 12,
        padding: '14px 16px',
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.25)',
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#f59e0b', margin: '0 0 6px' }}>
          Key Insight
        </p>
        <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, lineHeight: 1.6 }}>
          Total momentum is <strong>always conserved</strong> in any collision.
          Total kinetic energy is only conserved in <strong>elastic</strong> collisions.
        </p>
      </div>
    </div>
  );
}
