'use client';

/*
 * motion-lab/circular/TensionPlot.tsx — agent force vs angle, live.
 * ─────────────────────────────────────────────────────────────────────────────
 * The plot IS the vertical-circle lesson: one curve, maximum at the bottom,
 * minimum at the top, and a zero line the student can drive the curve down onto
 * with the speed slider. When the curve dips below that line the string has gone
 * slack — which is how v_min = √(gr) gets FOUND rather than told.
 *
 * ZERO text elements inside the SVG (§4E). Both axes are described in HTML
 * around it, which also means the labels stay legible at any canvas width.
 */

import * as React from 'react';
import type { CircularSpec } from '../types';
import { agentForceCurve, readout } from '../lib/circular';
import { TEXT, BORDER, SIM_BG, accentTint, fmt } from '../../simulations/_shared';
import { MOTION, FORCE } from './parts';

const W = 600;
const H = 210;
const PAD_L = 12;
const PAD_R = 12;
const PAD_T = 14;
const PAD_B = 14;

export default function TensionPlot({
  spec, theta, g, height = 210,
}: { spec: CircularSpec; theta: number; g: number; height?: number }) {
  const curve = React.useMemo(
    () => agentForceCurve(spec, g, 240),
    // The books-editor recreates the block object on every keystroke, so this is
    // keyed on the SPEC VALUES, never on object identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [spec.radius, spec.mass, spec.omega, spec.plane, spec.agent, spec.bankDeg, spec.mu_s, spec.alphaTangential, g]
  );

  const reachable = curve.filter((p) => p.reachable);
  const forces = reachable.map((p) => p.force);
  const hi = Math.max(1, ...forces);
  const lo = Math.min(0, ...forces);
  const span = Math.max(hi - lo, 1e-6);

  const px = (t: number) => PAD_L + (t / (2 * Math.PI)) * (W - PAD_L - PAD_R);
  const py = (f: number) => H - PAD_B - ((f - lo) / span) * (H - PAD_T - PAD_B);

  const path = reachable
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.theta).toFixed(1)},${py(p.force).toFixed(1)}`)
    .join(' ');

  const zeroY = py(0);
  const now = readout(spec, theta, g);
  const lostAt = curve.find((p) => !p.reachable);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: FORCE }}>
          {spec.agent === 'rod' ? 'Rod force' : spec.agent === 'track-inside' ? 'Track normal force' : 'String tension'} (N)
        </span>
        <span className="text-[11px]" style={{ color: TEXT.muted }}>
          now <b className="tabular-nums" style={{ color: FORCE }}>{fmt(now.agentForce, 2)} N</b>
          {' · '}peak <b className="tabular-nums" style={{ color: TEXT.secondary }}>{fmt(hi, 2)} N</b>
        </span>
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${BORDER.card}` }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={height}
          style={{ display: 'block' }}>
          {/* The slack region: everything below zero is a force a string cannot
              supply. Shading it means the student sees the forbidden zone
              BEFORE the curve ever enters it. */}
          {lo < 0 && (
            <rect x={0} y={zeroY} width={W} height={H - PAD_B - zeroY}
              fill={accentTint(FORCE, 0.09)} />
          )}
          <line x1={0} y1={zeroY} x2={W} y2={zeroY}
            stroke={accentTint(FORCE, 0.55)} strokeWidth={1.5} strokeDasharray="6 5" />

          {/* Quarter-turn guides: top, side, bottom, side, top. */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={px(f * 2 * Math.PI)} y1={PAD_T} x2={px(f * 2 * Math.PI)} y2={H - PAD_B}
              stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          ))}

          <path d={path} fill="none" stroke={FORCE} strokeWidth={2.5} strokeLinejoin="round" />

          {/* Where the ball can no longer reach — the curve simply stops rather
              than inventing values for a place the body never got to. */}
          {lostAt && (
            <line x1={px(lostAt.theta)} y1={PAD_T} x2={px(lostAt.theta)} y2={H - PAD_B}
              stroke={accentTint(FORCE, 0.5)} strokeWidth={1.5} strokeDasharray="3 5" />
          )}

          {/* The live marker. */}
          <line x1={px(theta % (2 * Math.PI))} y1={PAD_T} x2={px(theta % (2 * Math.PI))} y2={H - PAD_B}
            stroke={accentTint(MOTION, 0.55)} strokeWidth={1.5} />
          <circle cx={px(theta % (2 * Math.PI))} cy={py(now.agentForce)} r={5}
            fill={MOTION} stroke={SIM_BG} strokeWidth={2} />
        </svg>
      </div>

      {/* X axis, in HTML — no text inside the SVG. */}
      <div className="flex justify-between text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: TEXT.muted }}>
        <span>Top</span><span>Quarter</span><span>Bottom</span><span>Three-quarter</span><span>Top</span>
      </div>
    </div>
  );
}
