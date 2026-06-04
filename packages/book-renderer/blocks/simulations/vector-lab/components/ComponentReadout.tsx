'use client';

// ComponentReadout.tsx — the live polar ⇄ Cartesian table. As the student drags
// a head, magnitude / angle / x / y update together, making the two
// representations of the SAME vector visibly equivalent (PhET's key idea).

import React from 'react';
import type { Vec2 } from '../lib/vectorMath';
import { magnitude, angle360, round } from '../lib/vectorMath';
import { C } from '../lib/theme';

export interface ReadoutRow {
  label: string;
  color: string;
  v: Vec2;
  /** Optional unit shown after magnitude (N, m/s, …). */
  unit?: string;
}

export function ComponentReadout({
  rows,
  mode,
  onModeChange,
}: {
  rows: ReadoutRow[];
  mode?: 'polar' | 'cartesian';
  onModeChange?: (m: 'polar' | 'cartesian') => void;
}) {
  const showToggle = Boolean(onModeChange);
  const m = mode ?? 'cartesian';
  const polarHot = m === 'polar';

  return (
    <div className="flex flex-col gap-2">
      {showToggle ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => onModeChange?.('polar')}
            className="text-[11px] font-black uppercase tracking-widest pb-0.5"
            style={{
              color: polarHot ? C.indigoLight : C.muted,
              borderBottom: `2px solid ${polarHot ? C.indigo : 'transparent'}`,
              background: 'none',
            }}
          >
            Magnitude · Angle
          </button>
          <button
            onClick={() => onModeChange?.('cartesian')}
            className="text-[11px] font-black uppercase tracking-widest pb-0.5"
            style={{
              color: !polarHot ? C.indigoLight : C.muted,
              borderBottom: `2px solid ${!polarHot ? C.indigo : 'transparent'}`,
              background: 'none',
            }}
          >
            x · y components
          </button>
        </div>
      ) : null}

      <table className="w-full text-sm tabular-nums" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.ghost }}>
            <th className="text-left py-1.5 pr-2" />
            {polarHot || !showToggle ? <th className="text-right py-1.5 px-2">| v |</th> : null}
            {polarHot || !showToggle ? <th className="text-right py-1.5 px-2">θ</th> : null}
            {!polarHot || !showToggle ? <th className="text-right py-1.5 px-2">x</th> : null}
            {!polarHot || !showToggle ? <th className="text-right py-1.5 px-2">y</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderTop: `1px solid ${C.divider}` }}>
              <td className="py-1.5 pr-2 text-left font-black italic" style={{ color: r.color }}>
                {r.label}
              </td>
              {polarHot || !showToggle ? (
                <td className="text-right py-1.5 px-2" style={{ color: C.text }}>
                  {round(magnitude(r.v), 1)}
                  {r.unit ? <span style={{ color: C.muted }}> {r.unit}</span> : null}
                </td>
              ) : null}
              {polarHot || !showToggle ? (
                <td className="text-right py-1.5 px-2" style={{ color: C.text2 }}>
                  {round(angle360(r.v), 0)}°
                </td>
              ) : null}
              {!polarHot || !showToggle ? (
                <td className="text-right py-1.5 px-2" style={{ color: C.text }}>
                  {round(r.v.x, 1)}
                </td>
              ) : null}
              {!polarHot || !showToggle ? (
                <td className="text-right py-1.5 px-2" style={{ color: C.text }}>
                  {round(r.v.y, 1)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
