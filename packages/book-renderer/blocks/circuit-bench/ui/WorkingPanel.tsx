'use client';

/*
 * circuit-bench/ui/WorkingPanel.tsx — the working, printed as it happens.
 * ─────────────────────────────────────────────────────────────────────────────
 * The redraw is only worth anything if the student can read WHY each merge was
 * legal. So every step that has happened so far is listed in plain English, with
 * the algebra beside it, and the step just taken is the one highlighted — the
 * panel and the board are showing the same moment.
 *
 * The FOLD LADDER underneath is the reverse operation: it shows the tree of
 * groups, so "R2‖R3 = 2 Ω" can be unfolded back into the two resistors it stands
 * for. That is how you actually solve these on paper — collapse, then check by
 * unfolding — and it is derived from the step list rather than stored twice.
 */

import * as React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import type { RedrawResult, RedrawStep } from '../types';
import type { FoldNode } from '../lib/redraw';
import { fmtOhm } from '../lib/format';
import { BORDER, TEXT, TYPE, accentTint } from '../../simulations/_shared/tokens';
import { SectionLabel } from '../../simulations/_shared/components';

function Tex({ src }: { src: string }) {
  const html = React.useMemo(() => {
    try { return katex.renderToString(src, { throwOnError: false, displayMode: false }); }
    catch { return ''; }
  }, [src]);
  if (!html) return <span style={{ color: TEXT.ghost }}>{src}</span>;
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const KIND_LABEL: Record<RedrawStep['kind'], string> = {
  'merge-series': 'Series',
  'merge-parallel': 'Parallel',
  'collapse-wire': 'Same point',
  'drop-zero-current': 'Carries nothing',
  done: 'Answer',
};

export interface WorkingPanelProps {
  result: RedrawResult;
  /** How many steps have been revealed. 0 = none yet (just the untangle). */
  shown: number;
  accent: string;
  accent2: string;
  tree: FoldNode[];
  /** Nodal-analysis answer, shown when the reduction refuses — because
   *  Kirchhoff can still do it, and saying so is the point of the refusal. */
  nodalR?: number;
  onPickStep?: (index: number) => void;
}

export default function WorkingPanel({
  result, shown, accent, accent2, tree, nodalR, onPickStep,
}: WorkingPanelProps) {
  const steps = result.steps.slice(0, Math.max(0, shown));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <SectionLabel accent={accent}>The working</SectionLabel>
        {steps.length === 0 ? (
          <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
            Nothing has been combined yet. The circuit has only been redrawn — every
            node is where its electrical distance from the probes puts it, and not one
            connection has changed.
          </p>
        ) : (
          <ol className="mt-2 flex flex-col gap-2">
            {steps.map((s, i) => {
              const latest = i === steps.length - 1;
              return (
                <li key={`${s.kind}-${i}`}>
                  <button
                    type="button"
                    onClick={() => onPickStep?.(i + 1)}
                    className="w-full rounded-xl p-3 text-left transition-colors"
                    style={{
                      background: latest ? accentTint(accent2, 0.1) : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${latest ? accentTint(accent2, 0.35) : BORDER.card}`,
                      minHeight: 44,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ background: accentTint(latest ? accent2 : accent, 0.85), color: '#0d1117' }}>
                        {i + 1}
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{ color: latest ? accent2 : TEXT.ghost }}>
                        {KIND_LABEL[s.kind]}
                      </span>
                    </span>
                    <span className={`${TYPE.body} mt-1.5 block`} style={{ color: TEXT.primary }}>
                      {s.explanation}
                    </span>
                    {s.latex && (
                      <span className="mt-1.5 block text-sm" style={{ color: TEXT.secondary }}>
                        <Tex src={s.latex} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {shown >= result.steps.length && !result.fullyReduced && result.stalledReason && (
        <div className="rounded-xl p-3"
          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER.card}` }}>
          <SectionLabel accent={accent2}>It stops here — on purpose</SectionLabel>
          <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.primary }}>
            {result.stalledReason}
          </p>
          {nodalR != null && Number.isFinite(nodalR) && (
            <p className={`${TYPE.body} mt-2`} style={{ color: TEXT.secondary }}>
              Kirchhoff&apos;s laws have no such difficulty — they never needed the network to be
              series-parallel. Solving the junction and loop equations directly gives{' '}
              <span style={{ color: accent2, fontWeight: 700 }}>{fmtOhm(nodalR)}</span>.
            </p>
          )}
        </div>
      )}

      {tree.length > 0 && (
        <div>
          <SectionLabel accent={accent}>Fold / unfold</SectionLabel>
          <p className={`${TYPE.metadata} mt-1`} style={{ color: TEXT.ghost }}>
            Tap a group to unfold it back into what it stands for.
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {tree.map((n) => <Fold key={n.id} node={n} depth={0} accent={accent} accent2={accent2} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function Fold({ node, depth, accent, accent2 }:
{ node: FoldNode; depth: number; accent: string; accent2: string }) {
  const [open, setOpen] = React.useState(depth === 0);
  const hasKids = !!node.children?.length;
  return (
    <div style={{ marginLeft: depth * 14 }}>
      <button
        type="button"
        onClick={() => hasKids && setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${BORDER.card}`,
          cursor: hasKids ? 'pointer' : 'default',
          minHeight: 40,
        }}
      >
        <span className="text-[11px] font-semibold" style={{ color: hasKids ? accent2 : TEXT.ghost, width: 12 }}>
          {hasKids ? (open ? '−' : '+') : '·'}
        </span>
        <span className="flex-1 text-xs font-semibold" style={{ color: TEXT.primary }}>
          {node.label}
        </span>
        {node.op && (
          <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEXT.ghost }}>
            {node.op}
          </span>
        )}
        <span className="text-xs tabular-nums font-bold" style={{ color: accent }}>
          {fmtOhm(node.value)}
        </span>
      </button>
      {open && hasKids && node.children!.map((k) => (
        <Fold key={k.id} node={k} depth={depth + 1} accent={accent} accent2={accent2} />
      ))}
    </div>
  );
}
