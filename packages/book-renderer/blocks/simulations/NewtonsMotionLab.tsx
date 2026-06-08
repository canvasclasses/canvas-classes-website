'use client';

// NewtonsMotionLab.tsx
// Class 9 Physics — Chapter 6 "How Forces Affect Motion"
//
// A real-time motion lab. The student sets a net force and a mass, presses Play,
// and WATCHES the object accelerate — the cart moves on a scrolling track while a
// live velocity–time graph draws itself. This targets the deepest, most common
// misconception that a static textbook figure cannot fix: that a force gives an
// object SPEED. It gives ACCELERATION. A steady push → steadily rising velocity.
// Cut the force with friction off → it coasts forever (Newton's first law). Cut it
// with friction on → it slows and stops. Double the mass → half the acceleration.
//
// Pure client physics (requestAnimationFrame), no external deps.

import { useEffect, useRef, useState, useCallback } from 'react';

// ── tuning ──────────────────────────────────────────────────────────────────
const PX_PER_M = 5;          // track scroll scale
const TICK_PX = 46;          // ground tick spacing
const VMAX = 240;            // hard clamp on |v| so a runaway never breaks layout
const F_APPLIED = '#fb923c'; // orange — the student's force
const F_FRICTION = '#60a5fa';
const F_NET = '#fbbf24';
const GOOD = '#34d399';

interface Snap { v: number; x: number; t: number }

// kinetic + static friction force (sign convention: + = right)
function friction(v: number, applied: number, fmax: number): number {
  if (fmax <= 0) return 0;
  const eps = 0.02;
  if (Math.abs(v) > eps) return -Math.sign(v) * fmax;        // kinetic, opposes motion
  if (Math.abs(applied) <= fmax) return -applied;             // static, holds it still
  return -Math.sign(applied) * fmax;                          // about to break free
}

// ── small arrow ─────────────────────────────────────────────────────────────
function Arrow({ x, y, dir, len, color, label, above = true }: {
  x: number; y: number; dir: 1 | -1; len: number; color: string; label?: string; above?: boolean;
}) {
  if (len < 3) return null;
  const tx = x + dir * len;
  const head = 9;
  const bx = tx - dir * head;
  return (
    <g>
      <line x1={x} y1={y} x2={bx} y2={y} stroke={color} strokeWidth={3.5} strokeLinecap="round" />
      <polygon points={`${tx},${y} ${bx},${y - 5} ${bx},${y + 5}`} fill={color} />
      {label && (
        <text x={x + dir * (len / 2)} y={above ? y - 8 : y + 15} fill={color}
          fontSize={11} fontWeight={700} textAnchor="middle">{label}</text>
      )}
    </g>
  );
}

export default function NewtonsMotionLab() {
  // controls
  const [applied, setApplied] = useState(12);   // N, signed (+right)
  const [mass, setMass] = useState(4);          // kg
  const [fmax, setFmax] = useState(0);          // N, max friction (0 = frictionless)
  const [running, setRunning] = useState(false);

  // physics (refs so the rAF loop never reads stale state)
  const vRef = useRef(0);
  const xRef = useRef(0);
  const tRef = useRef(0);
  const histRef = useRef<Snap[]>([{ v: 0, x: 0, t: 0 }]);
  const lastPush = useRef(0);

  // display mirror (updated each frame).
  const [snap, setSnap] = useState<Snap>({ v: 0, x: 0, t: 0 });

  // Drive every DISPLAYED value off `snap.v` (React state, re-renders on change),
  // not vRef.current — otherwise a slider change while paused keeps showing
  // stale numbers from the last running session.
  const net = applied + friction(snap.v, applied, fmax);
  const accel = net / mass;

  const reset = useCallback(() => {
    setRunning(false);
    vRef.current = 0; xRef.current = 0; tRef.current = 0; lastPush.current = 0;
    histRef.current = [{ v: 0, x: 0, t: 0 }];
    setSnap({ v: 0, x: 0, t: 0 });
  }, []);

  // animation loop. setInterval (not requestAnimationFrame) so the physics keeps
  // advancing even if the tab is briefly backgrounded — and `dt` is real elapsed
  // time (clamped), so the motion is time-correct regardless of tick cadence.
  useEffect(() => {
    if (!running) return;
    let last = performance.now();
    const id = setInterval(() => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (dt <= 0) return;
      const v0 = vRef.current;
      const f = friction(v0, applied, fmax);
      const a = (applied + f) / mass;
      let v = v0 + a * dt;
      // friction must not push the object backwards past rest in one step
      if (fmax > 0 && v0 !== 0 && Math.sign(v) !== Math.sign(v0) && Math.abs(applied) <= fmax) v = 0;
      v = Math.max(-VMAX, Math.min(VMAX, v));
      vRef.current = v;
      xRef.current += v * dt;
      tRef.current += dt;
      if (tRef.current - lastPush.current >= 0.06) {
        lastPush.current = tRef.current;
        histRef.current = [...histRef.current, { v, x: xRef.current, t: tRef.current }].slice(-260);
      }
      setSnap({ v, x: xRef.current, t: tRef.current });
    }, 16);
    return () => clearInterval(id);
  }, [running, applied, mass, fmax]);

  // presets — each sets the controls (and sometimes an initial velocity) and runs
  const preset = useCallback((cfg: { applied: number; mass: number; fmax: number; v0?: number }) => {
    setApplied(cfg.applied); setMass(cfg.mass); setFmax(cfg.fmax);
    vRef.current = cfg.v0 ?? 0; xRef.current = 0; tRef.current = 0; lastPush.current = 0;
    histRef.current = [{ v: cfg.v0 ?? 0, x: 0, t: 0 }];
    setSnap({ v: cfg.v0 ?? 0, x: 0, t: 0 });
    setRunning(true);
  }, []);

  // ── insight line (changes with the live state) ─────────────────────────────
  const v = snap.v;
  const insight = (() => {
    const moving = Math.abs(v) > 0.05;
    const netNow = applied + friction(v, applied, fmax);
    if (Math.abs(netNow) < 0.05 && !moving) return { txt: 'Balanced forces, at rest — net force is zero, so nothing changes.', c: '#94a3b8' };
    if (Math.abs(netNow) < 0.05 && moving) return { txt: 'No net force, yet it keeps moving at a STEADY speed — Newton’s first law. Motion does not need a force.', c: GOOD };
    if (Math.sign(netNow) === Math.sign(v) && moving) return { txt: 'Net force points along the motion → the object SPEEDS UP. A force builds velocity, it is not velocity.', c: F_APPLIED };
    if (moving && Math.sign(netNow) !== Math.sign(v)) return { txt: 'Net force opposes the motion → the object SLOWS DOWN (then may reverse).', c: F_FRICTION };
    return { txt: 'A net force acts on a still object → it begins to accelerate from rest.', c: F_APPLIED };
  })();

  // ── geometry ───────────────────────────────────────────────────────────────
  const W = 480, H = 290, CX = W / 2, GROUND = 212, CART = 44;
  const cartY = GROUND - CART;
  const offset = ((xRef.current * PX_PER_M) % TICK_PX + TICK_PX) % TICK_PX;
  const fricNow = friction(v, applied, fmax);

  // velocity–time graph window
  const GW = 480, GH = 120, gpadL = 34, gpadB = 20;
  const hist = histRef.current;
  const tNow = snap.t;
  const tWin = Math.max(6, tNow);
  const t0 = Math.max(0, tNow - 8);
  const vAbsMax = Math.max(8, ...hist.map(h => Math.abs(h.v)));
  const gx = (t: number) => gpadL + ((t - t0) / (tWin - t0 || 1)) * (GW - gpadL - 8);
  const gy = (vv: number) => (GH - gpadB) / 2 - (vv / vAbsMax) * ((GH - gpadB) / 2 - 6);
  const line = hist.filter(h => h.t >= t0).map(h => `${gx(h.t).toFixed(1)},${gy(h.v).toFixed(1)}`).join(' ');

  // ── styles ─────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#0b0f15', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)',
    padding: 22, fontFamily: 'system-ui, sans-serif', color: '#e2e8f0', maxWidth: 980, margin: '0 auto',
  };
  const pill = (active: boolean): React.CSSProperties => ({
    padding: '5px 11px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.12)',
    background: active ? 'rgba(251,146,60,0.15)' : 'rgba(255,255,255,0.04)',
    color: active ? '#fdba74' : '#cbd5e1',
  });
  const readout = (label: string, val: string, color = '#e2e8f0') => (
    <div style={{ flex: '1 1 70px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{val}</div>
    </div>
  );

  return (
    <div style={card}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>Newton’s Motion Lab</h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          Set a force, press Play, and watch what a force actually does over time — it changes <i>velocity</i>, not position alone.
        </p>
      </div>

      {/* LIVE MATH STRIP — Newton's second law in action. Updates with every
          parameter change so the student sees the relationship, not just the result. */}
      <div style={{
        background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.18)',
        borderRadius: 10, padding: '10px 14px', marginBottom: 14,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        fontSize: 14, color: '#e2e8f0', display: 'flex', flexWrap: 'wrap', gap: 8,
        alignItems: 'baseline', lineHeight: 1.7,
      }}>
        <span style={{ color: '#94a3b8', fontFamily: 'system-ui, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>NEWTON&apos;S 2<sup>nd</sup> LAW</span>
        <span style={{ color: F_NET }}>a</span>
        <span style={{ color: '#64748b' }}>=</span>
        <span style={{ color: F_NET }}>F<sub>net</sub></span>
        <span style={{ color: '#64748b' }}>÷</span>
        <span>m</span>
        <span style={{ color: '#64748b' }}>=</span>
        <span>(<span style={{ color: F_APPLIED }}>{applied}</span>
          {fmax > 0 && (
            <>
              {' '}<span style={{ color: '#64748b' }}>{fricNow >= 0 ? '+' : '−'}</span>{' '}
              <span style={{ color: F_FRICTION }}>{Math.abs(Math.round(fricNow))}</span>
            </>
          )}) N
        </span>
        <span style={{ color: '#64748b' }}>÷</span>
        <span>{mass} kg</span>
        <span style={{ color: '#64748b' }}>=</span>
        <span style={{ color: F_NET }}>{Math.round(net)} N</span>
        <span style={{ color: '#64748b' }}>÷</span>
        <span>{mass} kg</span>
        <span style={{ color: '#64748b' }}>=</span>
        <b style={{ color: F_NET }}>{accel.toFixed(2)} m/s²</b>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'flex-start' }}>
        {/* LEFT: track + graph */}
        <div style={{ flex: '1 1 460px', minWidth: 0 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', background: '#060d1f', borderRadius: 12, border: '1px solid rgba(99,102,241,0.15)', display: 'block' }}>
            {/* scrolling ground ticks (the cart stays centred; the world moves) */}
            {Array.from({ length: Math.ceil(W / TICK_PX) + 2 }).map((_, i) => {
              const x = i * TICK_PX - offset;
              return <line key={i} x1={x} y1={GROUND} x2={x} y2={GROUND + 10} stroke="rgba(255,255,255,0.13)" strokeWidth={2} />;
            })}
            <line x1={0} y1={GROUND} x2={W} y2={GROUND} stroke="rgba(255,255,255,0.25)" strokeWidth={2} />

            {/* speed lines behind the cart when moving fast */}
            {Math.abs(v) > 4 && [0, 1, 2].map(i => (
              <line key={i} x1={CX - Math.sign(v) * (CART / 2 + 6 + i * 10)} y1={cartY + 10 + i * 9}
                x2={CX - Math.sign(v) * (CART / 2 + 22 + i * 10)} y2={cartY + 10 + i * 9}
                stroke="rgba(96,165,250,0.4)" strokeWidth={2} strokeLinecap="round" />
            ))}

            {/* cart */}
            <rect x={CX - CART / 2} y={cartY} width={CART} height={CART} rx={7}
              fill="rgba(251,191,36,0.10)" stroke={Math.abs(net) < 0.05 ? GOOD : '#fbbf24'} strokeWidth={2} />
            <text x={CX} y={cartY + CART / 2 + 4} fill="#e2e8f0" fontSize={11} fontWeight={700} textAnchor="middle">{mass} kg</text>

            {/* Force arrows — fixed rows so they NEVER overlap each other:
                  push at the cart's TOP edge, friction at its BOTTOM edge, net force
                  below the ground line. Each anchors at the cart's edge and extends
                  outward in its colour; no on-canvas text (named in the legend). */}
            {/* Every force that is non-zero draws an arrow — clamped to a visible
                minimum (16 px) so small forces still appear, and to a maximum so
                large forces never overflow the canvas. */}
            {Math.abs(applied) > 0.01 && (
              <Arrow x={CX + (applied >= 0 ? 1 : -1) * (CART / 2)} y={cartY + 10}
                dir={applied >= 0 ? 1 : -1}
                len={Math.max(16, Math.min(Math.abs(applied) * 2.4, 120))} color={F_APPLIED} />
            )}
            {/* Friction: visible whenever it acts — kinetic (opposes motion) or
                static (holds a still object against the applied force). */}
            {fmax > 0 && Math.abs(fricNow) > 0.01 && (
              <Arrow x={CX + (fricNow >= 0 ? 1 : -1) * (CART / 2)} y={cartY + CART - 10}
                dir={fricNow >= 0 ? 1 : -1}
                len={Math.max(16, Math.min(Math.abs(fricNow) * 2.4, 120))} color={F_FRICTION} />
            )}
            {Math.abs(net) > 0.01 && (
              <Arrow x={CX} y={GROUND + 34} dir={net >= 0 ? 1 : -1}
                len={Math.max(16, Math.min(Math.abs(net) * 2.4, 140))} color={F_NET} />
            )}
          </svg>

          {/* colour-key legend — replaces on-canvas labels (no overlap, ever) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 8, fontSize: 12, color: '#cbd5e1' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 16, borderTop: `3px solid ${F_APPLIED}` }} /> Push (F) <b style={{ color: F_APPLIED }}>{applied} N</b>
            </span>
            {fmax > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 16, borderTop: `3px solid ${F_FRICTION}` }} /> Friction <b style={{ color: F_FRICTION }}>{Math.round(fricNow)} N</b>
              </span>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 16, borderTop: `3px solid ${F_NET}` }} /> Net force <b style={{ color: F_NET }}>{Math.round(net)} N</b>
            </span>
          </div>

          {/* velocity–time graph */}
          <div style={{ marginTop: 8, fontSize: 11, color: '#64748b', fontWeight: 700 }}>VELOCITY vs TIME</div>
          <svg viewBox={`0 0 ${GW} ${GH}`} style={{ width: '100%', background: '#060d1f', borderRadius: 10, border: '1px solid rgba(99,102,241,0.12)', display: 'block', marginTop: 3 }}>
            <line x1={gpadL} y1={(GH - gpadB) / 2} x2={GW - 8} y2={(GH - gpadB) / 2} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            <line x1={gpadL} y1={6} x2={gpadL} y2={GH - gpadB} stroke="rgba(255,255,255,0.18)" strokeWidth={1} />
            <text x={4} y={14} fill="#64748b" fontSize={9}>+v</text>
            <text x={4} y={(GH - gpadB) / 2 + 3} fill="#64748b" fontSize={9}>0</text>
            <text x={GW - 30} y={GH - 6} fill="#64748b" fontSize={9}>time →</text>
            {line && <polyline points={line} fill="none" stroke={F_NET} strokeWidth={2.5} strokeLinejoin="round" />}
          </svg>
        </div>

        {/* RIGHT: controls + readouts */}
        <div style={{ flex: '1 1 280px', minWidth: 0 }}>
          {/* live readouts */}
          <div style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 6px', marginBottom: 12 }}>
            {readout('Net force', `${Math.round(net)} N`, Math.abs(net) < 0.05 ? GOOD : F_NET)}
            {readout('Acceleration', `${accel.toFixed(1)} m/s²`)}
            {readout('Velocity', `${v.toFixed(1)} m/s`, F_FRICTION)}
            {readout('Time', `${snap.t.toFixed(1)} s`)}
          </div>

          {/* applied force */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
            <span>Your push {applied > 0 ? '(→ right)' : applied < 0 ? '(← left)' : ''}</span>
            <span style={{ color: F_APPLIED, fontWeight: 700 }}>{applied} N</span>
          </div>
          <input type="range" min={-40} max={40} step={1} value={applied}
            onChange={e => setApplied(Number(e.target.value))} style={{ width: '100%', accentColor: F_APPLIED, height: 16 }} />

          {/* mass */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
            <span>Mass</span><span style={{ color: '#e2e8f0', fontWeight: 700 }}>{mass} kg</span>
          </div>
          <input type="range" min={1} max={10} step={1} value={mass}
            onChange={e => setMass(Number(e.target.value))} style={{ width: '100%', accentColor: '#a78bfa', height: 16 }} />

          {/* friction */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
            <span>Friction (max)</span>
            <span style={{ color: F_FRICTION, fontWeight: 700 }}>{fmax === 0 ? 'OFF (frictionless)' : `${fmax} N`}</span>
          </div>
          <input type="range" min={0} max={30} step={1} value={fmax}
            onChange={e => setFmax(Number(e.target.value))} style={{ width: '100%', accentColor: F_FRICTION, height: 16 }} />

          {/* transport */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={() => setRunning(r => !r)} style={{
              flex: 2, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800,
              background: running ? 'rgba(255,255,255,0.10)' : 'linear-gradient(90deg,#fb923c,#f59e0b)',
              color: running ? '#e2e8f0' : '#0b0f15',
            }}>{running ? '❚❚ Pause' : '▶ Play'}</button>
            <button onClick={reset} style={{
              flex: 1, padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 700,
              border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', color: '#cbd5e1',
            }}>↺ Reset</button>
          </div>

          {/* presets */}
          <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, margin: '14px 0 6px' }}>Try these</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            <button style={pill(false)} onClick={() => preset({ applied: 12, mass: 4, fmax: 0 })}>Steady push</button>
            <button style={pill(false)} onClick={() => preset({ applied: 0, mass: 4, fmax: 0, v0: 14 })}>Let go (coast)</button>
            <button style={pill(false)} onClick={() => preset({ applied: 0, mass: 4, fmax: 12, v0: 14 })}>Friction stop</button>
            <button style={pill(false)} onClick={() => preset({ applied: 12, mass: 10, fmax: 0 })}>Heavy load</button>
          </div>
        </div>
      </div>

      {/* insight */}
      <div style={{
        marginTop: 14, fontSize: 13, lineHeight: 1.5, borderRadius: 10, padding: '10px 14px',
        background: 'rgba(255,255,255,0.03)', border: `1px solid ${insight.c}33`, color: insight.c,
      }}>
        💡 {insight.txt}
      </div>
    </div>
  );
}
