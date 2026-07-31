'use client';

/*
 * circuit-bench/ui/Readouts.tsx — the colour-keyed legend.
 * ─────────────────────────────────────────────────────────────────────────────
 * Everything the board is not allowed to write on itself lives here: node names
 * and potentials, element names, values, currents, p.d.s and power. The link
 * between the two is COLOUR and HIGHLIGHT, not a label crammed beside a symbol —
 * tap a row and the element lights up on the board, and vice versa.
 *
 * The node list doubles as the heatmap key, which is the point: two rows with
 * the same swatch are at the same potential, and that fact is what the symmetry
 * shortcut and the balanced bridge both turn on.
 */

import * as React from 'react';
import type { Circuit, CircuitSolution } from '../types';
import { emfOf, isOpen, labelOf, resistanceOf } from '../lib/netlist';
import { potentialColor } from '../lib/layout';
import { potentialRange } from '../lib/solve';
import { fmtAmp, fmtOhm, fmtVolt, fmtWatt } from '../lib/format';
import { BORDER, TEXT, TYPE, accentTint } from '../../simulations/_shared/tokens';
import { SectionLabel } from '../../simulations/_shared/components';
import { GlyphChip } from './glyphs';

export interface ReadoutsProps {
  circuit: Circuit;
  solution: CircuitSolution | null;
  probes: [string, string];
  accent: string;
  accent2: string;
  showValues: boolean;
  /** Level 1 of the reveal ladder — potentials, but not yet currents. */
  showPotentials: boolean;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  onHoverNode?: (id: string | null) => void;
}

export default function Readouts({
  circuit, solution, probes, accent, accent2, showValues, showPotentials,
  selectedId, onSelect, onHoverNode,
}: ReadoutsProps) {
  const ok = solution && !solution.singular;
  const range = ok ? potentialRange(solution) : { lo: 0, hi: 0 };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionLabel accent={accent}>Elements</SectionLabel>
        <div className="mt-1.5 flex flex-col gap-1">
          {circuit.components.map((c) => {
            const on = selectedId === c.id;
            const r = resistanceOf(c);
            const i = ok ? (solution.currents[c.id] ?? 0) : 0;
            const v = ok ? (solution.voltages[c.id] ?? 0) : 0;
            const dead = isOpen(c);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelect?.(on ? null : c.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors"
                style={{
                  background: on ? accentTint(accent2, 0.14) : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${on ? accentTint(accent2, 0.4) : BORDER.card}`,
                  minHeight: 44,
                }}
              >
                <span className="shrink-0" style={{ opacity: dead ? 0.45 : 1 }}>
                  <GlyphChip kind={c.kind} color={on ? accent2 : accent} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold" style={{ color: TEXT.primary }}>
                    {labelOf(c)}
                    <span className="ml-1.5 font-normal" style={{ color: TEXT.ghost }}>
                      {c.kind === 'battery'
                        ? `${fmtVolt(emfOf(c))}${(c.internal ?? 0) > 0 ? `, r = ${fmtOhm(c.internal ?? 0)}` : ''}`
                        : dead ? 'open' : fmtOhm(r)}
                    </span>
                  </span>
                  {showValues && ok && (
                    <span className="block text-[11px] tabular-nums" style={{ color: TEXT.secondary }}>
                      {fmtAmp(Math.abs(i))}
                      <span style={{ color: TEXT.ghost }}> · </span>
                      {fmtVolt(Math.abs(c.kind === 'battery' ? -v : v))}
                      {(c.kind === 'bulb' || Math.abs(solution.power[c.id] ?? 0) > 1e-6) && (
                        <>
                          <span style={{ color: TEXT.ghost }}> · </span>
                          {fmtWatt(Math.abs(solution.power[c.id] ?? 0))}
                        </>
                      )}
                    </span>
                  )}
                </span>
                {showValues && ok && Math.abs(i) < 1e-9 && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
                    style={{ background: accentTint(accent, 0.12), color: accent }}>
                    no current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {ok && showPotentials && (
        <div>
          <SectionLabel accent={accent}>Node potentials</SectionLabel>
          <p className={`${TYPE.metadata} mt-1`} style={{ color: TEXT.ghost }}>
            Two nodes the same colour are at the same potential.
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {circuit.nodes.map((n) => (
              <span
                key={n.id}
                onPointerEnter={() => onHoverNode?.(n.id)}
                onPointerLeave={() => onHoverNode?.(null)}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${probes.includes(n.id) ? accentTint(accent2, 0.45) : BORDER.card}`,
                }}
              >
                <span style={{
                  width: 11, height: 11, borderRadius: 999,
                  background: potentialColor(solution.potentials[n.id] ?? 0, range.lo, range.hi),
                  display: 'inline-block',
                }} />
                <span className="text-[11px] font-semibold" style={{ color: TEXT.primary }}>
                  {n.label ?? n.id}
                </span>
                <span className="text-[11px] tabular-nums" style={{ color: TEXT.secondary }}>
                  {fmtVolt(solution.potentials[n.id] ?? 0)}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {solution?.singular && (
        <p className={TYPE.body} style={{ color: TEXT.primary }}>
          {solution.warnings[solution.warnings.length - 1]
            ?? 'This circuit has no unique solution.'}
        </p>
      )}
    </div>
  );
}
