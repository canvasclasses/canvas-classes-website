'use client';

// Mechanical Advantage Simulator — Chapter 11: Simple Machines
// Demonstrates MA for lever, pulley, inclined plane, and wheel & axle.
// MA = Load Force / Effort Force — simple machines let you lift heavy loads with less effort.

import { useState } from 'react';

type MachineType = 'lever' | 'pulley' | 'inclined_plane' | 'wheel_axle';

// ── Per-machine state ─────────────────────────────────────────────────────────
// Lever: effortArm 50–200, loadArm 20–100
// Pulley: numRopes 1–6 (compound)
// Inclined plane: length 2–10 m, height 1–5 m
// Wheel & axle: wheelR 40–200 mm, axleR 10–40 mm

export default function MechanicalAdvantageSim() {
  const [machine, setMachine]   = useState<MachineType>('lever');
  const [loadForce, setLoad]    = useState(200);

  // Lever params
  const [effortArm, setEA]  = useState(120);
  const [loadArm, setLA]    = useState(60);

  // Pulley params
  const [numRopes, setRopes] = useState(3);

  // Inclined plane
  const [rampLen, setRampLen]     = useState(5);   // metres
  const [rampHeight, setRampH]    = useState(2);   // metres

  // Wheel & axle
  const [wheelR, setWheelR] = useState(100); // mm
  const [axleR, setAxleR]   = useState(20);  // mm

  // Compute MA
  const MA: number = (() => {
    if (machine === 'lever')          return effortArm / loadArm;
    if (machine === 'pulley')         return numRopes;
    if (machine === 'inclined_plane') return rampLen / Math.max(rampHeight, 0.1);
    // wheel_axle
    return wheelR / Math.max(axleR, 1);
  })();

  const effortForce = loadForce / Math.max(MA, 0.01);

  // ── Shared SVG dimensions ────────────────────────────────────────────────────
  const SVG_W = 480, SVG_H = 300;

  // ── Lever SVG ────────────────────────────────────────────────────────────────
  function renderLever() {
    const beamY = SVG_H / 2 + 10;
    const beamX1 = 50, beamX2 = SVG_W - 50;
    const beamLen = beamX2 - beamX1;
    const totalArm = effortArm + loadArm;
    const pivotX = beamX1 + (effortArm / totalArm) * beamLen;
    const effortX = beamX1;
    const loadX   = beamX2;

    const eArrowH = Math.min(70, effortForce * 0.15);
    const lArrowH = Math.min(70, loadForce * 0.15);

    return (
      <>
        {/* Fulcrum triangle */}
        <polygon
          points={`${pivotX - 12},${beamY + 30} ${pivotX + 12},${beamY + 30} ${pivotX},${beamY}`}
          fill="#334155" stroke="#64748b" strokeWidth={1.5}
        />
        {/* Ground line */}
        <line x1={beamX1} y1={beamY + 30} x2={beamX2} y2={beamY + 30}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />

        {/* Beam */}
        <rect x={beamX1} y={beamY - 5} width={beamLen} height={10}
          rx={5} fill="#1e293b" stroke="#334155" strokeWidth={1.5} />

        {/* Effort arm dimension */}
        <line x1={effortX} y1={beamY - 20} x2={pivotX} y2={beamY - 20}
          stroke="#34d399" strokeWidth={1} strokeDasharray="4,3" />
        <text x={(effortX + pivotX) / 2} y={beamY - 26}
          textAnchor="middle" fill="#34d399" fontSize={10} fontWeight={600}>
          {effortArm} (effort arm)
        </text>

        {/* Load arm dimension */}
        <line x1={pivotX} y1={beamY - 20} x2={loadX} y2={beamY - 20}
          stroke="#fb923c" strokeWidth={1} strokeDasharray="4,3" />
        <text x={(pivotX + loadX) / 2} y={beamY - 26}
          textAnchor="middle" fill="#fb923c" fontSize={10} fontWeight={600}>
          {loadArm} (load arm)
        </text>

        {/* Effort arrow (down, indigo) */}
        <line x1={effortX} y1={beamY - 5}
          x2={effortX} y2={beamY - 5 - eArrowH}
          stroke="#6366f1" strokeWidth={2.5} markerEnd="url(#ma-down-ind)" />
        <text x={effortX - 5} y={beamY - 10 - eArrowH}
          textAnchor="middle" fill="#818cf8" fontSize={10} fontWeight={600}>
          E={effortForce.toFixed(1)}N
        </text>

        {/* Load arrow (down, amber) */}
        <line x1={loadX} y1={beamY - 5}
          x2={loadX} y2={beamY - 5 - lArrowH}
          stroke="#fbbf24" strokeWidth={2.5} markerEnd="url(#ma-down-amb)" />
        <text x={loadX + 5} y={beamY - 10 - lArrowH}
          textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
          L={loadForce}N
        </text>

        {/* MA label */}
        <text x={pivotX} y={beamY + 55}
          textAnchor="middle" fill="#818cf8" fontSize={12} fontWeight={700}>
          MA = {effortArm}/{loadArm} = {MA.toFixed(2)}
        </text>
      </>
    );
  }

  // ── Pulley SVG ───────────────────────────────────────────────────────────────
  function renderPulley() {
    const n = numRopes;
    // Fixed pulley at top, movable pulley at bottom
    const fixY = 60;
    const movY = 180;
    const cx   = SVG_W / 2;
    const R    = 28;

    // Draw n rope segments between pulleys
    const ropeSpacing = Math.min(20, (R * 2) / Math.max(n - 1, 1));
    const ropeXs: number[] = Array.from({ length: n }, (_, i) => {
      if (n === 1) return cx;
      return cx - ((n - 1) / 2) * ropeSpacing + i * ropeSpacing;
    });

    // Effort arrow rope (pull from rightmost rope)
    const effortRopeX = ropeXs[n - 1] + 18;

    return (
      <>
        {/* Ceiling */}
        <line x1={40} y1={30} x2={SVG_W - 40} y2={30}
          stroke="rgba(255,255,255,0.15)" strokeWidth={4} />
        {/* Fixed pulley mount */}
        <line x1={cx} y1={30} x2={cx} y2={fixY - R}
          stroke="#64748b" strokeWidth={2} />

        {/* Fixed pulley */}
        <circle cx={cx} cy={fixY} r={R} fill="#1e293b" stroke="#334155" strokeWidth={2} />
        <circle cx={cx} cy={fixY} r={R * 0.4} fill="#0b0f15" stroke="#64748b" strokeWidth={1.5} />

        {/* Movable pulley */}
        <circle cx={cx} cy={movY} r={R} fill="#1e293b" stroke="#6366f1" strokeWidth={2} />
        <circle cx={cx} cy={movY} r={R * 0.4} fill="#0b0f15" stroke="#6366f1" strokeWidth={1.5} />

        {/* Rope segments */}
        {ropeXs.map((rx, i) => (
          <line key={i} x1={rx} y1={fixY} x2={rx} y2={movY}
            stroke="#94a3b8" strokeWidth={1.5} />
        ))}

        {/* Effort rope going up (last rope) */}
        <line x1={effortRopeX} y1={movY} x2={effortRopeX} y2={fixY}
          stroke="#818cf8" strokeWidth={2} strokeDasharray="6,3" />
        {/* Effort arrow (upward pull) */}
        <line x1={effortRopeX} y1={fixY - 5}
          x2={effortRopeX} y2={fixY - 40}
          stroke="#818cf8" strokeWidth={2.5} markerEnd="url(#ma-up-ind)" />
        <text x={effortRopeX + 8} y={fixY - 22}
          fill="#818cf8" fontSize={10} fontWeight={600}>
          E={effortForce.toFixed(1)}N
        </text>

        {/* Load hanging from movable pulley */}
        <line x1={cx} y1={movY + R} x2={cx} y2={movY + R + 30}
          stroke="#fbbf24" strokeWidth={2} />
        <rect x={cx - 18} y={movY + R + 30} width={36} height={24}
          rx={4} fill="#1e293b" stroke="#fbbf24" strokeWidth={1.5} />
        <text x={cx} y={movY + R + 46}
          textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
          {loadForce} N
        </text>

        {/* Rope count label */}
        <text x={cx} y={SVG_H - 12}
          textAnchor="middle" fill="#818cf8" fontSize={11} fontWeight={700}>
          MA = {n} rope segments = {MA.toFixed(1)}
        </text>
      </>
    );
  }

  // ── Inclined Plane SVG ───────────────────────────────────────────────────────
  function renderInclinedPlane() {
    const sinTheta = rampHeight / rampLen;
    const theta    = Math.asin(Math.min(sinTheta, 0.999));
    const thetaDeg = (theta * 180 / Math.PI).toFixed(1);

    const baseX = 60, baseY = SVG_H - 60;
    const rampPixels = 280;
    const rampDx = rampPixels * Math.cos(theta);
    const rampDy = rampPixels * Math.sin(theta);
    const topX = baseX + rampDx;
    const topY = baseY - rampDy;

    // Block midpoint on ramp
    const bMidFrac = 0.55;
    const bCx = baseX + rampDx * bMidFrac;
    const bCy = baseY - rampDy * bMidFrac;

    const effortLen = Math.min(60, effortForce * 0.15);
    const loadLen   = Math.min(60, loadForce * 0.15);

    return (
      <>
        {/* Ground */}
        <line x1={baseX} y1={baseY} x2={topX + 20} y2={baseY}
          stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} />

        {/* Ramp fill */}
        <polygon
          points={`${baseX},${baseY} ${topX},${topY} ${topX},${baseY}`}
          fill="rgba(100,116,139,0.15)" stroke="#475569" strokeWidth={1.5}
        />

        {/* Block on ramp */}
        <rect
          x={bCx - 16} y={bCy - 12} width={32} height={24}
          rx={4} fill="#1e293b" stroke="#6366f1" strokeWidth={1.5}
          transform={`rotate(${-thetaDeg}, ${bCx}, ${bCy})`}
        />

        {/* Effort arrow (along ramp upward) */}
        <line
          x1={bCx} y1={bCy}
          x2={bCx + effortLen * Math.cos(theta)}
          y2={bCy - effortLen * Math.sin(theta)}
          stroke="#818cf8" strokeWidth={2.5} markerEnd="url(#ma-arr-ind)"
        />
        <text
          x={bCx + (effortLen + 8) * Math.cos(theta)}
          y={bCy - (effortLen + 8) * Math.sin(theta)}
          fill="#818cf8" fontSize={10} fontWeight={600}>
          E={effortForce.toFixed(1)}N
        </text>

        {/* Load arrow (straight down) */}
        <line x1={bCx} y1={bCy}
          x2={bCx} y2={bCy + loadLen}
          stroke="#fbbf24" strokeWidth={2.5} markerEnd="url(#ma-arr-amb)"
        />
        <text x={bCx + 6} y={bCy + loadLen - 4}
          fill="#fbbf24" fontSize={10} fontWeight={600}>
          L={loadForce}N
        </text>

        {/* Angle arc */}
        <path
          d={`M ${baseX + 40} ${baseY} A 40 40 0 0 0 ${baseX + 40 * Math.cos(theta)} ${baseY - 40 * Math.sin(theta)}`}
          fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth={1.5}
        />
        <text x={baseX + 48} y={baseY - 12} fill="#fbbf24" fontSize={10}>{thetaDeg}°</text>

        {/* Height dimension */}
        <line x1={topX + 8} y1={topY} x2={topX + 8} y2={baseY}
          stroke="#34d399" strokeWidth={1} strokeDasharray="3,3" />
        <text x={topX + 16} y={(topY + baseY) / 2}
          fill="#34d399" fontSize={10}>{rampHeight}m</text>

        {/* Length label */}
        <text
          x={(baseX + topX) / 2} y={(baseY + topY) / 2 - 10}
          textAnchor="middle" fill="#94a3b8" fontSize={10}
          transform={`rotate(${-thetaDeg}, ${(baseX + topX) / 2}, ${(baseY + topY) / 2 - 10})`}>
          L={rampLen}m
        </text>

        {/* MA */}
        <text x={SVG_W / 2} y={SVG_H - 12}
          textAnchor="middle" fill="#818cf8" fontSize={11} fontWeight={700}>
          MA = {rampLen}/{rampHeight} = {MA.toFixed(2)}
        </text>
      </>
    );
  }

  // ── Wheel & Axle SVG ─────────────────────────────────────────────────────────
  function renderWheelAxle() {
    const cx = SVG_W / 2, cy = SVG_H / 2 - 10;
    const wheelPx = Math.min(90, wheelR * 0.5);
    const axlePx  = Math.min(35, axleR * 0.5);
    const effortLen = Math.min(70, effortForce * 0.15);
    const loadLen   = Math.min(70, loadForce * 0.15);

    return (
      <>
        {/* Axle shaft (horizontal) */}
        <line x1={cx - wheelPx - 20} y1={cy} x2={cx + wheelPx + 20} y2={cy}
          stroke="#475569" strokeWidth={4} />

        {/* Wheel (large circle) */}
        <circle cx={cx} cy={cy} r={wheelPx}
          fill="rgba(30,41,59,0.6)" stroke="#6366f1" strokeWidth={2.5} />
        {/* Spokes */}
        {[0, 60, 120, 180, 240, 300].map(deg => {
          const r = deg * Math.PI / 180;
          return (
            <line key={deg}
              x1={cx} y1={cy}
              x2={cx + wheelPx * Math.cos(r)} y2={cy + wheelPx * Math.sin(r)}
              stroke="rgba(99,102,241,0.3)" strokeWidth={1} />
          );
        })}

        {/* Axle (small circle) */}
        <circle cx={cx} cy={cy} r={axlePx}
          fill="#0b0f15" stroke="#fb923c" strokeWidth={2} />

        {/* Wheel radius label */}
        <line x1={cx} y1={cy} x2={cx + wheelPx} y2={cy}
          stroke="#6366f1" strokeWidth={1} strokeDasharray="4,3" />
        <text x={cx + wheelPx / 2} y={cy - 6}
          textAnchor="middle" fill="#818cf8" fontSize={9}>{wheelR}mm</text>

        {/* Axle radius label */}
        <line x1={cx} y1={cy} x2={cx} y2={cy - axlePx}
          stroke="#fb923c" strokeWidth={1} strokeDasharray="4,3" />
        <text x={cx + 6} y={cy - axlePx / 2}
          fill="#fb923c" fontSize={9}>{axleR}mm</text>

        {/* Effort arrow (tangent to wheel rim, downward on right) */}
        <line x1={cx + wheelPx} y1={cy}
          x2={cx + wheelPx} y2={cy + effortLen}
          stroke="#818cf8" strokeWidth={2.5} markerEnd="url(#ma-arr-ind2)"
        />
        <text x={cx + wheelPx + 6} y={cy + effortLen / 2}
          fill="#818cf8" fontSize={10} fontWeight={600}>
          E={effortForce.toFixed(1)}N
        </text>

        {/* Load arrow (tangent to axle, upward on left — load lifted) */}
        <line x1={cx - axlePx} y1={cy}
          x2={cx - axlePx} y2={cy + loadLen}
          stroke="#fbbf24" strokeWidth={2.5} markerEnd="url(#ma-arr-amb2)"
        />
        <text x={cx - axlePx - 30} y={cy + loadLen / 2}
          textAnchor="middle" fill="#fbbf24" fontSize={10} fontWeight={600}>
          L={loadForce}N
        </text>

        {/* MA */}
        <text x={SVG_W / 2} y={SVG_H - 16}
          textAnchor="middle" fill="#818cf8" fontSize={11} fontWeight={700}>
          MA = {wheelR}/{axleR} = {MA.toFixed(2)}
        </text>
      </>
    );
  }

  const MACHINES: { key: MachineType; label: string; emoji: string; formula: string }[] = [
    { key: 'lever',          label: 'Lever',          emoji: '⚖️', formula: 'MA = Effort Arm / Load Arm' },
    { key: 'pulley',         label: 'Pulley',         emoji: '🔧', formula: 'MA = Number of rope segments' },
    { key: 'inclined_plane', label: 'Ramp',           emoji: '📐', formula: 'MA = Length / Height' },
    { key: 'wheel_axle',     label: 'Wheel & Axle',   emoji: '🎡', formula: 'MA = Wheel R / Axle R' },
  ];

  const curMachine = MACHINES.find(m => m.key === machine)!;

  return (
    <div style={{
      background: '#0b0f15', borderRadius: 16,
      border: '1px solid rgba(255,255,255,0.07)',
      padding: 24, maxWidth: 940, margin: '0 auto',
      fontFamily: 'system-ui, sans-serif', color: '#e2e8f0',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#fff' }}>
          Mechanical Advantage Explorer
        </h3>
        <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0' }}>
          MA = Load Force / Effort Force — simple machines amplify force — Ch 11
        </p>
      </div>

      {/* Machine selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {MACHINES.map(m => (
          <button key={m.key} onClick={() => setMachine(m.key)} style={{
            padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            border: machine === m.key ? '1px solid #6366f1' : '1px solid rgba(255,255,255,0.1)',
            background: machine === m.key ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
            color: machine === m.key ? '#818cf8' : '#94a3b8',
            fontSize: 12, fontWeight: 600,
          }}>
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>

        {/* LEFT — SVG */}
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{
            background: 'linear-gradient(160deg, #060d1f 0%, #0a0e1a 100%)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 14, overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ width: '100%', display: 'block' }}>
              <defs>
                <marker id="ma-down-ind" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#6366f1" />
                </marker>
                <marker id="ma-down-amb" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#fbbf24" />
                </marker>
                <marker id="ma-up-ind" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,7 L3.5,0 L7,7 Z" fill="#818cf8" />
                </marker>
                <marker id="ma-arr-ind" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L7,3.5 L0,7 Z" fill="#818cf8" />
                </marker>
                <marker id="ma-arr-amb" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#fbbf24" />
                </marker>
                <marker id="ma-arr-ind2" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#818cf8" />
                </marker>
                <marker id="ma-arr-amb2" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                  <path d="M0,0 L3.5,7 L7,0 Z" fill="#fbbf24" />
                </marker>
              </defs>

              {machine === 'lever'          && renderLever()}
              {machine === 'pulley'         && renderPulley()}
              {machine === 'inclined_plane' && renderInclinedPlane()}
              {machine === 'wheel_axle'     && renderWheelAxle()}
            </svg>
          </div>

          {/* Formula chip */}
          <div style={{
            marginTop: 10,
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 8, padding: '8px 12px',
            fontSize: 12, color: '#818cf8', fontWeight: 600,
            textAlign: 'center',
          }}>
            {curMachine.formula}
          </div>
        </div>

        {/* RIGHT — controls */}
        <div style={{ flex: '1 1 220px' }}>

          {/* Load force */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Load Force (N)</span>
              <span style={{ fontSize: 14, color: '#fbbf24', fontWeight: 700 }}>{loadForce}</span>
            </div>
            <input type="range" min={50} max={500} value={loadForce}
              onChange={e => setLoad(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#fbbf24' }} />
          </div>

          {/* Machine-specific sliders */}
          {machine === 'lever' && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Effort Arm</span>
                  <span style={{ fontSize: 14, color: '#34d399', fontWeight: 700 }}>{effortArm}</span>
                </div>
                <input type="range" min={50} max={200} value={effortArm}
                  onChange={e => setEA(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#34d399' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Load Arm</span>
                  <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 700 }}>{loadArm}</span>
                </div>
                <input type="range" min={20} max={100} value={loadArm}
                  onChange={e => setLA(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#fb923c' }} />
              </div>
            </>
          )}

          {machine === 'pulley' && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Rope Segments</span>
                <span style={{ fontSize: 14, color: '#818cf8', fontWeight: 700 }}>{numRopes}</span>
              </div>
              <input type="range" min={1} max={6} value={numRopes}
                onChange={e => setRopes(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#818cf8' }} />
            </div>
          )}

          {machine === 'inclined_plane' && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Ramp Length (m)</span>
                  <span style={{ fontSize: 14, color: '#818cf8', fontWeight: 700 }}>{rampLen}</span>
                </div>
                <input type="range" min={2} max={10} value={rampLen}
                  onChange={e => setRampLen(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#818cf8' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Ramp Height (m)</span>
                  <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 700 }}>{rampHeight}</span>
                </div>
                <input type="range" min={1} max={Math.min(rampLen - 1, 5)} value={rampHeight}
                  onChange={e => setRampH(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#fb923c' }} />
              </div>
            </>
          )}

          {machine === 'wheel_axle' && (
            <>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Wheel Radius (mm)</span>
                  <span style={{ fontSize: 14, color: '#818cf8', fontWeight: 700 }}>{wheelR}</span>
                </div>
                <input type="range" min={40} max={200} value={wheelR}
                  onChange={e => setWheelR(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#818cf8' }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Axle Radius (mm)</span>
                  <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 700 }}>{axleR}</span>
                </div>
                <input type="range" min={10} max={Math.min(wheelR - 5, 40)} value={axleR}
                  onChange={e => setAxleR(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#fb923c' }} />
              </div>
            </>
          )}

          {/* Results card */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: '14px 12px', marginBottom: 14,
          }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.07em',
              textTransform: 'uppercase', color: '#64748b', margin: '0 0 10px',
            }}>Live Results</p>
            {[
              { label: 'Mechanical Advantage', val: MA.toFixed(2),               color: '#818cf8' },
              { label: 'Load Force',            val: loadForce + ' N',            color: '#fbbf24' },
              { label: 'Effort Force Needed',   val: effortForce.toFixed(1) + ' N', color: '#34d399' },
              { label: 'Force Saved',           val: Math.max(0, loadForce - effortForce).toFixed(1) + ' N', color: '#fb923c' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 7, alignItems: 'center',
              }}>
                <span style={{ fontSize: 11, color: '#94a3b8' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{row.val}</span>
              </div>
            ))}
          </div>

          {/* Insight */}
          <div style={{
            background: 'rgba(52,211,153,0.06)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 10, padding: '10px 12px',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.6 }}>
              <strong style={{ color: '#34d399' }}>MA = {MA.toFixed(2)}</strong>{' '}
              {MA >= 1
                ? `You apply ${effortForce.toFixed(1)} N to lift ${loadForce} N. The machine multiplies your force!`
                : `MA < 1: effort is greater than load, but you gain speed or range of motion.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
