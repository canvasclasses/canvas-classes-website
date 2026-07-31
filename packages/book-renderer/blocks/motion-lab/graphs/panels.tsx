'use client';

/*
 * motion-lab/graphs/panels.tsx — the graphs frame and the cards only graphs need.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── WHAT IS REUSED, AND WHY ─────────────────────────────────────────────────
 * Every generic piece of chrome comes from `../waves/ui` — Card, Pill, Toggle,
 * ActionButton, Segmented, Legend, Readout, GuidedPanel, the per-option
 * PredictGate, MisconceptionCard, NumericPanel, `useMeasured`, `isNarrow`. That
 * file is the Phase-2 frame and it already encodes, once, every layout and
 * affordance fix the Phase-1 QA report asked for: an unmeasured width counts as
 * NARROW, the guided panel and the predict gate move ABOVE the canvas when
 * stacked, the canvas box freezes while a handle is held, one response per
 * predict option. Re-implementing any of that here would mean re-earning those
 * fixes and eventually losing one.
 *
 * ── WHAT IS NOT REUSED: THE CANVAS SIZING ───────────────────────────────────
 * `LabFrame` sizes its canvas from a content ASPECT RATIO, which is right for
 * every spatial canvas in the engine and exactly wrong here. Three stacked
 * graphs need MORE height as the container narrows, not less; an aspect-driven
 * sizer would hand a 340 px phone container a 240 px canvas and three 60 px
 * panels, which is the failure mode this whole module has to avoid. So
 * `GraphsFrame` below is `LabFrame`'s layout with one substitution — the height
 * comes from `stackHeight(measuredWidth)` — and everything else is the same
 * component set.
 */

import * as React from 'react';
import { useRef } from 'react';
import InlineMarkdown from '../../InlineMarkdown';
import {
  SimShell, SimHeader, ExpertTip, SIM_CANVAS_BG,
} from '../../simulations/_shared';
import {
  Card, Pill, Toggle, ActionButton, Segmented, Legend, Readout, LedgerBar,
  GuidedPanel, PredictGate, MisconceptionCard, NumericPanel, Unknown,
  useMeasured, isNarrow, clamp, f1, f2,
  ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, accentTint, SimSlider, SectionLabel,
  type LegendRow, type ReadoutRow,
} from '../waves/ui';
import type { PredictSpec } from '../waves/types';
import { stackHeight } from './lib/plot';
import type { MatchReport, MatchAxis } from './lib/grade';
import { faultCopy } from './lib/grade';
import type { UniformAccel } from './lib/kinematics';
import type { DriverAxis } from './types';

// Re-exported so a bench imports its whole UI surface from one place.
export {
  Card, Pill, Toggle, ActionButton, Segmented, Legend, Readout, LedgerBar,
  GuidedPanel, PredictGate, MisconceptionCard, NumericPanel, Unknown,
  useMeasured, isNarrow, clamp, f1, f2,
  ACCENT, ACCENT_2, TEXT, OK, BAD, BORDER, TYPE, accentTint, SimSlider, SectionLabel,
};
export type { LegendRow, ReadoutRow };

// ── The frame ────────────────────────────────────────────────────────────────

export interface GraphsFrameProps {
  title: string;
  subtitle: string;
  badge?: React.ReactNode;
  guided: { steps: { say: string; cta: string }[]; index: number; done: boolean; onAdvance: () => void } | null;
  predict: { spec: PredictSpec; choice: number | null; onChoose: (i: number) => void } | null;
  /** How many panels the stack shows — 3 for the studio, fewer for a deck view. */
  panelCount: number;
  /** Author's `block.height`, honoured as a CEILING and never as a fixed value. */
  maxH?: number;
  /** True while a handle is held: freezes the box so it cannot move under a finger. */
  frozen?: boolean;
  renderCanvas: (w: number, h: number) => React.ReactNode;
  legend: LegendRow[];
  belowCanvas?: React.ReactNode;
  controls: React.ReactNode;
  panels?: React.ReactNode;
  misconception?: { belief: string; attack: string } | null;
  tip: string;
  caption?: string;
}

export function GraphsFrame(p: GraphsFrameProps) {
  const [wrapRef, wrapW] = useMeasured<HTMLDivElement>();
  const [canvasRef, canvasW] = useMeasured<HTMLDivElement>();
  const narrow = isNarrow(wrapW);
  const boxW = canvasW > 0 ? canvasW : 560;

  // Freeze the box while a handle is held. Without it, a drag that changes the
  // axis range re-heights the canvas and pulls the handle out from under the
  // finger — the same class of bug the Phase-1 sweep found in the FBD incline
  // drag, and the reason `useBoxHeight` in waves/ui takes a `frozen` flag.
  const frozenH = useRef<number | null>(null);
  const wantH = stackHeight(boxW, p.panelCount, p.maxH);
  if (!p.frozen) frozenH.current = wantH;
  const H = frozenH.current ?? wantH;

  const intro = (
    <>
      {p.guided && (
        <GuidedPanel steps={p.guided.steps} index={p.guided.index} done={p.guided.done} onAdvance={p.guided.onAdvance} />
      )}
      {p.predict && (
        <PredictGate spec={p.predict.spec} choice={p.predict.choice} onChoose={p.predict.onChoose} />
      )}
    </>
  );

  return (
    <SimShell>
      <SimHeader title={p.title} subtitle={p.subtitle} badge={p.badge} />

      {/*
        The Tailwind pair is the pre-measurement/SSR fallback only. Once wrapW is
        known the inline gridTemplateColumns wins, and it is driven by the
        CONTAINER — so the admin editor's ~380 px preview pane stacks correctly
        even though the viewport behind it is a laptop.
      */}
      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? {
              gridTemplateColumns: narrow ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)',
              alignItems: narrow ? 'stretch' : 'start',
            }
          : undefined}
      >
        <div className="flex flex-col gap-3">
          {narrow && intro}
          <div ref={canvasRef} className="relative overflow-hidden rounded-2xl"
            style={{ height: H, background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}>
            {p.renderCanvas(boxW, H)}
          </div>
          <Legend rows={p.legend} />
          {p.belowCanvas}
        </div>

        <div className="flex flex-col gap-3">
          {!narrow && intro}
          {p.controls}
          {p.panels}
          {p.misconception && (
            <MisconceptionCard belief={p.misconception.belief} attack={p.misconception.attack} />
          )}
          <ExpertTip>{p.tip}</ExpertTip>
        </div>
      </div>

      {p.caption && (
        <p className={`mt-4 ${TYPE.body}`} style={{ color: TEXT.muted }}>{p.caption}</p>
      )}
    </SimShell>
  );
}

// ── Which graph is live ──────────────────────────────────────────────────────

const DRIVER_LABEL: Record<DriverAxis, string> = {
  x: 'position x–t',
  v: 'velocity v–t',
  a: 'acceleration a–t',
};

const DRIVER_HOW: Record<DriverAxis, string> = {
  x: 'Tilt a tangent handle on the top panel. Its steepness IS the velocity, so the middle panel follows your hand.',
  v: 'Drag a handle on the middle panel. The top panel re-accumulates the area and the bottom panel re-reads the slope.',
  a: 'Drag a bar on the bottom panel. The velocity ramp above it re-tilts, and the position above that re-curves.',
};

/**
 * Exactly one panel is editable at a time, and the picker says which.
 *
 * Not a stylistic choice. Three simultaneously editable panels would let a
 * student put x, v and a into a state that is not a motion — and the single
 * claim this simulation makes is that they cannot be inconsistent, because there
 * is one dataset. Naming the live panel makes that visible instead of implicit.
 */
export function PanelPicker({ driver, onChange, allowed }:
  { driver: DriverAxis; onChange: (d: DriverAxis) => void; allowed?: DriverAxis[] }) {
  const keys = allowed ?? (['x', 'v', 'a'] as DriverAxis[]);
  return (
    <div className="flex flex-col gap-2">
      <SectionLabel accent={ACCENT}>Which graph are you drawing?</SectionLabel>
      <Segmented
        value={driver}
        onChange={onChange}
        options={keys.map((k) => ({ key: k, label: DRIVER_LABEL[k] }))}
      />
      <p className="text-[12px] leading-snug" style={{ color: TEXT.secondary }}>{DRIVER_HOW[driver]}</p>
    </div>
  );
}

// ── Distance vs displacement ─────────────────────────────────────────────────

/**
 * The running ledger: what the odometer reads against what a straight line from
 * start to finish measures.
 *
 * Two numbers side by side and a bar that shows them diverging, because the
 * whole misconception is that they are one number. The bar is not decoration:
 * when the motion reverses, the distance bar keeps growing while the
 * displacement bar shrinks, at the same instant, in front of the student.
 */
export function JourneyLedger({ distance, displacement, avgSpeed, avgVelocity, note }: {
  distance: number;
  displacement: number;
  avgSpeed: number;
  avgVelocity: number;
  note?: string;
}) {
  const scale = Math.max(Math.abs(distance), Math.abs(displacement), 1e-9);
  const rows: { label: string; value: string; frac: number; colour: string }[] = [
    {
      label: 'distance travelled',
      value: `${f1(distance)} m`,
      frac: Math.abs(distance) / scale,
      colour: ACCENT,
    },
    {
      label: 'displacement',
      value: `${f1(displacement)} m`,
      frac: Math.abs(displacement) / scale,
      colour: displacement < 0 ? ACCENT_2 : ACCENT,
    },
  ];
  return (
    <Card>
      <div className={`${TYPE.sectionLabel} mb-2`} style={{ color: TEXT.secondary }}>
        How far, two ways
      </div>
      {rows.map((r) => (
        <div key={r.label} className="mb-2">
          <div className="mb-1 flex items-baseline justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: TEXT.ghost }}>
              {r.label}
            </span>
            <span className="tabular-nums text-[14px] font-bold" style={{ color: r.colour }}>{r.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              width: `${clamp(r.frac * 100, 0, 100)}%`, height: '100%',
              background: accentTint(r.colour, 0.75), transition: 'width 90ms linear',
            }} />
          </div>
        </div>
      ))}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 pt-2" style={{ borderTop: `1px solid ${BORDER.hairline}` }}>
        <span className="text-[11px]" style={{ color: TEXT.secondary }}>
          average speed <b className="tabular-nums" style={{ color: ACCENT }}>{f2(avgSpeed)} m/s</b>
        </span>
        <span className="text-[11px]" style={{ color: TEXT.secondary }}>
          average velocity <b className="tabular-nums" style={{ color: avgVelocity < 0 ? ACCENT_2 : ACCENT }}>{f2(avgVelocity)} m/s</b>
        </span>
      </div>
      {note && <p className="mt-1.5 text-[11px] leading-snug" style={{ color: TEXT.muted }}>{note}</p>}
    </Card>
  );
}

// ── The algebra, checked against the graphs ──────────────────────────────────

/**
 * The three constant-acceleration equations, with the number the graph gives
 * beside the number the algebra gives.
 *
 * Two columns on purpose. `lib/integrate.ts`'s own header sets the rule — the
 * integrator draws the path, the algebra states the answer — and a student who
 * can see the two agree to four decimals has been shown that the formula is not
 * a separate authority to be trusted, it is a shortcut for what the shading
 * already told them.
 */
export function AlgebraCheck({ u, closed, fromGraph, valid }: {
  u: number;
  closed: UniformAccel;
  fromGraph: { v: number; s: number };
  /** False when the motion has more than one phase, where these do not apply. */
  valid: boolean;
}) {
  const rows: { eq: string; algebra: string; graph: string }[] = [
    { eq: 'v = u + at', algebra: `${f2(closed.v)} m/s`, graph: `${f2(fromGraph.v)} m/s` },
    { eq: 's = ut + ½at²', algebra: `${f2(closed.s)} m`, graph: `${f2(fromGraph.s)} m` },
    { eq: 'v² = u² + 2as', algebra: `${f2(closed.vSquared)}`, graph: `${f2(fromGraph.v * fromGraph.v)}` },
  ];
  return (
    <Card tone={valid ? 'plain' : 'bad'}>
      <div className={`${TYPE.sectionLabel} mb-1.5`} style={{ color: TEXT.secondary }}>
        The three equations
      </div>
      {!valid && (
        <p className="mb-2 text-[12px] leading-snug" style={{ color: BAD }}>
          This motion has more than one phase, so no single u and a describe the whole of it and none of these
          three equations may be applied across the corner. <b>The numbers below are for the FIRST phase only</b> —
          which is exactly the habit the corner demands: split the motion there and work one phase at a time,
          carrying the end velocity of one in as the start velocity of the next.
        </p>
      )}
      <div className="flex items-baseline justify-between gap-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: TEXT.ghost }}>equation</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>algebra</span>
        <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT_2 }}>from the graph</span>
      </div>
      {rows.map((r) => (
        <div key={r.eq} className="flex items-baseline justify-between gap-3 py-[3px]">
          <span className="text-[12px] font-semibold" style={{ color: TEXT.primary }}>{r.eq}</span>
          <span className="tabular-nums text-[12px] font-semibold" style={{ color: ACCENT }}>{r.algebra}</span>
          <span className="tabular-nums text-[12px] font-semibold" style={{ color: ACCENT_2 }}>{r.graph}</span>
        </div>
      ))}
      <p className="mt-2 pt-1.5 text-[11px] leading-snug"
        style={{ color: TEXT.muted, borderTop: `1px solid ${BORDER.hairline}` }}>
        u = {f2(u)} m/s, a = {f2(closed.a)} m/s², t = {f2(closed.t)} s. The middle column is the formula; the right
        column is read off the shaded area and the line’s end. They are the same numbers because the formula is
        that area, written out.
      </p>
    </Card>
  );
}

// ── The Match verdict ────────────────────────────────────────────────────────

/**
 * The graded verdict, with a NAMED fault rather than a percentage.
 *
 * `faultCopy` lives beside the grader in `lib/grade.ts` so the diagnosis and its
 * sentence cannot drift apart — Phase 1's FBD grader emitted one code under a
 * heading written for another, which is what that separation buys you.
 */
export function MatchReportCard({ report, axis, attempts, onCheck, checked }: {
  report: MatchReport | null;
  axis: MatchAxis;
  attempts: number;
  onCheck: () => void;
  checked: boolean;
}) {
  const copy = report && checked ? faultCopy(report, axis) : null;
  return (
    <Card tone={!checked || !report ? 'plain' : report.pass ? 'ok' : 'bad'}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Pill tone={checked && report ? (report.pass ? 'ok' : 'bad') : 'info'}>
          {checked && report ? (report.pass ? 'Matched' : 'Not yet') : 'Your task'}
        </Pill>
        <span className="text-[11px]" style={{ color: TEXT.ghost }}>attempt {attempts}</span>
        <div className="flex-1" />
        <ActionButton onClick={onCheck}>Check the match</ActionButton>
      </div>
      {!checked && (
        <p className="text-sm" style={{ color: TEXT.primary }}>
          Drag your handles onto the pale dashed target. The green ribbon is the band you have to stay inside —
          at every instant, not just at the corners.
        </p>
      )}
      {checked && report && (
        <>
          <div className="mb-2 h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              width: `${clamp(report.score * 100, 0, 100)}%`, height: '100%',
              background: accentTint(report.pass ? OK : ACCENT, 0.8),   // sim-lint-ok — OK is the pass/fail pair
              transition: 'width 120ms linear',
            }} />
          </div>
          <p className="text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>{copy?.heading}</p>
          <div className="mt-1 text-sm leading-snug" style={{ color: TEXT.secondary }}>
            <InlineMarkdown>{copy?.body ?? ''}</InlineMarkdown>
          </div>
        </>
      )}
    </Card>
  );
}

// ── A small "at this instant" strip ──────────────────────────────────────────

/**
 * The three live values at the cursor, plus the one sentence that says whether
 * the body is getting faster or slower.
 *
 * That sentence is the payload of the whole module. It is computed from
 * `speedTrend(v, a)` — the sign comparison, not the sign of a — so it is right in
 * all four quadrants, including the one where a > 0 and the speedometer is
 * falling.
 */
export function InstantStrip({ t, x, v, a, show, trendLabel, trendTone, trendReady }: {
  t: number; x: number; v: number; a: number;
  /** Blank a value whose panel has not been revealed yet — design law #5 says no
   *  number appears before the student has been shown where it comes from. */
  show: { x: boolean; v: boolean; a: boolean };
  trendLabel: string;
  trendTone: 'up' | 'down' | 'flat';
  /** The verdict needs both v and a on screen to be honest. */
  trendReady: boolean;
}) {
  const rows: ReadoutRow[] = [
    { label: 'time', value: `${f2(t)} s` },
    { label: 'position x', value: show.x ? `${f2(x)} m` : '—', color: ACCENT, strong: show.x },
    { label: 'velocity v', value: show.v ? `${f2(v)} m/s` : '—', color: v < 0 ? ACCENT_2 : ACCENT, strong: show.v },
    { label: 'acceleration a', value: show.a ? `${f2(a)} m/s²` : '—', color: ACCENT },
  ];
  return (
    <div className="flex flex-col gap-2">
      <Readout rows={rows} title="At the cursor" />
      {trendReady && (
        <Card tone={trendTone === 'flat' ? 'plain' : 'accent'}>
          <div className={TYPE.sectionLabel} style={{ color: ACCENT_2 }}>Speeding up or slowing down?</div>
          <p className="mt-1 text-sm font-semibold leading-snug" style={{ color: TEXT.primary }}>{trendLabel}</p>
        </Card>
      )}
    </div>
  );
}
