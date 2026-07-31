'use client';

/*
 * nuclear/CurveView.tsx — the flagship. Fission and fusion on ONE axis.
 * ─────────────────────────────────────────────────────────────────────────────
 * The claim this view has to earn: a student who works through it can look at
 * ANY nuclear reaction and answer "does this release energy?" without being told
 * — by finding both sides on the binding-energy-per-nucleon curve and seeing
 * which way the nucleons moved.
 *
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * Textbooks print the curve, and separately print "fission releases 200 MeV" and
 * "fusion releases 17.6 MeV". The step they skip is that those two numbers are
 * MEASUREMENTS OFF THAT CURVE:
 *
 *      energy released = (BE/A after − BE/A before) × nucleons that moved
 *
 * and it is exact. For the standard uranium channel it gives 0.7342 × 236 =
 * 173.28 MeV, which is the Q value from the mass table to the last digit. For
 * D–T it gives 3.5179 × 5 = 17.589 MeV, likewise. So the arrow drawn on the
 * curve is not an illustration of the energy — the arrow IS the energy, and the
 * bench proves it by printing both numbers side by side and letting the student
 * check they agree.
 *
 * ── The student is the author (design law #1) ────────────────────────────────
 * The third tab is not a slider on our scene. The student picks a parent and
 * drags where it splits, or picks two nuclides and fuses them, and the bench
 * answers "up the curve or down?" for a reaction nobody authored. Splits that go
 * DOWN the curve are reachable and are the most instructive outcome available —
 * fusing two iron nuclei costs energy, which is why a star dies at iron.
 *
 * ⚠ WHAT IS EXACT AND WHAT IS INTERPOLATED. Every energy quoted on the first two
 * tabs comes from tabulated AME2020 mass excesses. The author tab reads BE/A at
 * mass numbers that may not be tabulated, so it reads the DRAWN curve by linear
 * interpolation — and therefore reports a DIRECTION and never a Q value. The
 * caveat is on screen, not buried here.
 *
 * Guided, never auto-playing: no arrow, no product marker and no energy exists
 * until the student advances the script or presses a control.
 */

import * as React from 'react';
import {
  binding, bindingCurve, curvePeak, readCurveAt, TEXTBOOK_PEAK_ID,
  type CurvePoint,
} from './lib/binding';
import {
  COAL_JOULES_PER_KG, FISSION_ACCOUNT, FISSION_TOTAL_MEV, FISSION_RECOVERABLE_MEV,
  conservation, curveMove, equation, joulesPerKilogram, qValue, reactionById,
} from './lib/reactions';
import { CURVE_NUCLIDES, NUCLIDES, nuclide, pretty } from './lib/nuclides';
import { axis, curveArrow, curveLimits, ticks, type PlotBox } from './lib/view';
import {
  Arrow, Axes, AttackCard, Canvas, Chip, Marker, TickStrip, boxFor, ACCENT_B, GRID_STROKE,
} from './parts';
import type { NuclearArchetype } from '../archetypes.nuclear';
import type { ResolvedNuclear } from './lib/scene';
import { ActionButton, Card, Choice, Legend, Readout, Slider, Toggle, type ReadoutRow } from '../ui';
import { si, fixed } from '../lib/format';
import { ACCENT, TEXT, SIM_CANVAS_BG, accentTint } from '../../simulations/_shared';
import { stageHeight } from '../useStageWidth';

type Tab = 'inspect' | 'reaction' | 'author';

const HEAVY = NUCLIDES.filter((n) => n.A >= 200 && n.onCurve).map((n) => n.id);
const LIGHT = NUCLIDES.filter((n) => n.A <= 40 && n.A >= 2 && n.onCurve).map((n) => n.id);

export default function CurveView({ resolved, arch, stageW, stacked }: {
  resolved: ResolvedNuclear;
  arch: NuclearArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const curve = React.useMemo(() => bindingCurve(), []);
  const peak = React.useMemo(() => curvePeak(curve), [curve]);
  const textbookPeak = curve.find((p) => p.id === TEXTBOOK_PEAK_ID) ?? peak;

  const authoredReactionId = typeof resolved.params.reaction === 'string'
    ? String(resolved.params.reaction) : undefined;
  const isReactionArchetype = !!authoredReactionId;

  const [tab, setTab] = React.useState<Tab>(isReactionArchetype ? 'reaction' : 'inspect');
  const [picked, setPicked] = React.useState<string>(
    typeof resolved.params.pick === 'string' ? String(resolved.params.pick) : 'Fe-56',
  );
  const [markPeak, setMarkPeak] = React.useState(resolved.params.markPeak !== false);
  const [showAll, setShowAll] = React.useState(resolved.params.showAll === true);

  // Reaction reveal is a LADDER, not a switch: reactants, then products, then the
  // climb, then the energy. Nothing after the student's current rung is drawn.
  const [reveal, setReveal] = React.useState(0);
  const [showSecond, setShowSecond] = React.useState(resolved.params.showFission !== false);

  // Author tab.
  const [parent, setParent] = React.useState('U-235');
  const [splitAt, setSplitAt] = React.useState(0.4);
  const [fuseA, setFuseA] = React.useState('H-2');
  const [fuseB, setFuseB] = React.useState('H-3');
  const [authorMode, setAuthorMode] = React.useState<'split' | 'fuse'>('split');

  const reaction = reactionById(authoredReactionId ?? '') ?? null;
  const secondary = reaction && showSecond
    ? reactionById(reaction.kind === 'fusion' ? 'fission-u235' : 'fusion-dt')
    : null;

  const shown: CurvePoint[] = React.useMemo(() => {
    if (!showAll) return curve;
    return NUCLIDES.filter((n) => n.A >= 2).map((n) => {
      const b = binding(n);
      return { id: n.id, label: n.id, A: n.A, Z: n.Z, perNucleon: b.perNucleon, bindingMev: b.bindingMev };
    }).sort((a, b) => a.A - b.A);
  }, [curve, showAll]);

  const lim = React.useMemo(() => curveLimits(shown), [shown]);
  // `stacked` is the MEASURED breakpoint (0 counts as narrow — see useStageWidth).
  // A narrow stage gets a slightly taller box so the plateau does not compress to
  // a line; the drawable fraction is held by `plotPadding`, not by this.
  const w = Math.max(240, stageW || 320);
  const h = stageHeight(w, stacked ? 0.72 : 0.62, 380, 250);
  const box = React.useMemo(() => boxFor(w - 16, h), [w, h]);

  const move = reaction ? curveMove(reaction) : null;
  const q = reaction ? qValue(reaction) : null;
  const nucleonsMoved = move ? move.from.reduce((s, f) => s + f.A, 0) : 0;

  // ── Author-tab arithmetic (interpolated, and it says so) ──────────────────
  const parentNuc = nuclide(parent);
  const fragA = Math.max(2, Math.round(parentNuc.A * splitAt));
  const fragB = parentNuc.A - fragA;
  const readA = readCurveAt(fragA, curve);
  const readB = readCurveAt(fragB, curve);
  const parentBpn = binding(parentNuc).perNucleon;
  const splitAfter = readA && readB
    ? (readA.perNucleon * fragA + readB.perNucleon * fragB) / parentNuc.A
    : parentBpn;
  const splitGain = splitAfter - parentBpn;

  const fa = nuclide(fuseA);
  const fb = nuclide(fuseB);
  const fusedA = fa.A + fb.A;
  const fusedRead = readCurveAt(fusedA, curve);
  const fuseBefore = (binding(fa).perNucleon * fa.A + binding(fb).perNucleon * fb.A) / fusedA;
  const fuseGain = (fusedRead?.perNucleon ?? fuseBefore) - fuseBefore;

  // ── Evidence gate for the misconception card ──────────────────────────────
  // On a reaction archetype the belief is only contradicted once the climb has
  // been measured; on the inspect archetype, once a second nuclide has been
  // compared; on the author tab, once the student has moved the split.
  const [everMoved, setEverMoved] = React.useState(false);
  const [compared, setCompared] = React.useState(false);
  const evidence = tab === 'reaction' ? reveal >= 3
    : tab === 'author' ? everMoved
    : compared;

  const pickedBinding = binding(picked);

  const readout: ReadoutRow[] = tab === 'reaction' && reaction && move && q
    ? [
      { label: 'reaction', value: equation(reaction) },
      { label: 'nucleon number', value: `${conservation(reaction).nucleonsIn} in, ${conservation(reaction).nucleonsOut} out`, color: ACCENT },
      { label: 'BE/A before', value: `${fixed(move.beforePerNucleon, 4)} MeV`, color: ACCENT },
      { label: 'BE/A after', value: reveal >= 2 ? `${fixed(move.afterPerNucleon, 4)} MeV` : '—', color: ACCENT_B },
      { label: 'the climb', value: reveal >= 3 ? `${fixed(move.gainPerNucleon, 4)} MeV per nucleon` : '—', color: ACCENT_B, strong: reveal >= 3 },
      { label: 'climb × nucleons', value: reveal >= 3 ? `${fixed(move.gainPerNucleon * nucleonsMoved, 2)} MeV` : '—', color: ACCENT_B },
      { label: 'Q from the mass table', value: reveal >= 4 ? `${fixed(q.mev, 2)} MeV` : '—', color: ACCENT, strong: reveal >= 4 },
      { label: 'the same energy in joules', value: reveal >= 4 ? si(q.joules, 'J') : '—' },
      { label: 'mass converted', value: reveal >= 4 ? `${fixed(q.massDefectU, 5)} u` : '—' },
    ]
    : tab === 'author'
      ? authorMode === 'split'
        ? [
          { label: 'parent', value: `${pretty(parentNuc)} — A = ${parentNuc.A}`, color: ACCENT },
          { label: 'fragments', value: `A = ${fragA} and A = ${fragB}` },
          { label: 'BE/A before', value: `${fixed(parentBpn, 3)} MeV`, color: ACCENT },
          { label: 'BE/A after (read off the curve)', value: `${fixed(splitAfter, 3)} MeV`, color: ACCENT_B },
          { label: 'direction', value: splitGain > 0 ? 'UP the curve — energy out' : 'DOWN the curve — energy in', color: splitGain > 0 ? ACCENT_B : ACCENT, strong: true },
        ]
        : [
          { label: 'fusing', value: `${pretty(fa)} + ${pretty(fb)}`, color: ACCENT },
          { label: 'product mass number', value: `A = ${fusedA}` },
          { label: 'BE/A before', value: `${fixed(fuseBefore, 3)} MeV`, color: ACCENT },
          { label: 'BE/A after (read off the curve)', value: `${fixed(fusedRead?.perNucleon ?? 0, 3)} MeV`, color: ACCENT_B },
          { label: 'direction', value: fuseGain > 0 ? 'UP the curve — energy out' : 'DOWN the curve — energy in', color: fuseGain > 0 ? ACCENT_B : ACCENT, strong: true },
        ]
      : [
        { label: 'nuclide', value: `${pretty(pickedBinding.nuclide)} — ${pickedBinding.Z} protons, ${pickedBinding.N} neutrons`, color: ACCENT },
        { label: 'mass of the parts', value: `${fixed(pickedBinding.partsU, 5)} u` },
        { label: 'actual atomic mass', value: `${fixed(pickedBinding.actualU, 5)} u` },
        { label: 'mass defect', value: `${fixed(pickedBinding.massDefectU, 5)} u`, color: ACCENT_B },
        { label: 'total binding energy', value: `${fixed(pickedBinding.bindingMev, 2)} MeV`, color: ACCENT },
        { label: 'binding energy PER NUCLEON', value: `${fixed(pickedBinding.perNucleon, 4)} MeV`, color: ACCENT_B, strong: true },
        { label: 'distance below the peak', value: `${fixed(peak.perNucleon - pickedBinding.perNucleon, 4)} MeV per nucleon` },
      ];

  return (
    <div className="flex flex-col gap-3">
      {/* ══ the canvas ══════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden rounded-2xl p-2"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}
      >
        <Canvas box={box} label="Binding energy per nucleon plotted against mass number, for 38 nuclides.">
          <CurvePlot
            box={box}
            points={shown}
            lim={lim}
            picked={tab === 'inspect' ? picked : null}
            peakY={markPeak ? peak.perNucleon : null}
            reaction={tab === 'reaction' && reveal >= 1 ? reaction : null}
            reveal={reveal}
            secondary={tab === 'reaction' && reveal >= 4 ? secondary : null}
            author={tab === 'author'
              ? authorMode === 'split'
                ? { before: [{ A: parentNuc.A, e: parentBpn }], after: [{ A: fragA, e: readA?.perNucleon ?? 0 }, { A: fragB, e: readB?.perNucleon ?? 0 }] }
                : { before: [{ A: fa.A, e: binding(fa).perNucleon }, { A: fb.A, e: binding(fb).perNucleon }], after: [{ A: fusedA, e: fusedRead?.perNucleon ?? 0 }] }
              : null}
          />
        </Canvas>
        <TickStrip box={box} ticks={ticks(lim.aMin, lim.aMax, 5)} unit="mass number A" />
      </div>

      <Legend rows={[
        { color: ACCENT, label: 'binding energy per nucleon, 0 to', value: `${fixed(lim.eMax, 0)} MeV` },
        ...(markPeak ? [{ color: ACCENT_B, dashed: true, label: `the peak — ${peak.id} at`, value: `${fixed(peak.perNucleon, 3)} MeV` }] : []),
        ...(tab === 'reaction' && reveal >= 1 ? [{ color: ACCENT, dot: true, label: 'before the reaction' }] : []),
        ...(tab === 'reaction' && reveal >= 2 ? [{ color: ACCENT_B, dot: true, label: 'after the reaction' }] : []),
        ...(tab === 'inspect' ? [{ color: ACCENT_B, dot: true, label: `you are inspecting ${picked}` }] : []),
      ]} />

      {/* ══ controls ════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap items-center gap-2">
        {(['inspect', 'reaction', 'author'] as Tab[])
          .filter((t) => t !== 'reaction' || isReactionArchetype)
          .map((t) => (
            <ActionButton
              key={t}
              accent={tab === t ? ACCENT_B : ACCENT}
              onClick={() => setTab(t)}
            >
              {t === 'inspect' ? 'Inspect a nuclide' : t === 'reaction' ? 'The reaction' : 'Do it yourself'}
            </ActionButton>
          ))}
        <Toggle on={markPeak} label="Mark the peak" onClick={() => setMarkPeak((v) => !v)} accent={ACCENT_B} />
        <Toggle on={showAll} label="Every tabulated nuclide" onClick={() => setShowAll((v) => !v)} />
      </div>

      {tab === 'inspect' && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-1.5">
            {curve.map((p) => (
              <Chip
                key={p.id}
                label={p.id}
                colour={p.id === picked ? ACCENT_B : ACCENT}
                dim={p.id !== picked}
                onClick={() => { setPicked(p.id); setCompared(picked !== p.id); }}
                title={`${p.id}: ${p.perNucleon.toFixed(3)} MeV per nucleon`}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'reaction' && reaction && move && q && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <ActionButton
              accent={ACCENT_B}
              disabled={reveal >= 4}
              onClick={() => setReveal((r) => Math.min(4, r + 1))}
            >
              {reveal === 0 ? 'Put the reactants on the curve'
                : reveal === 1 ? 'Now the products'
                  : reveal === 2 ? 'Measure the climb'
                    : reveal === 3 ? 'Read the energy off it' : 'All four steps shown'}
            </ActionButton>
            {reveal > 0 && (
              <ActionButton onClick={() => setReveal(0)}>Start the ladder again</ActionButton>
            )}
            {reveal >= 4 && (
              <Toggle
                on={showSecond}
                label={reaction.kind === 'fusion' ? 'Put the fission arrow on too' : 'Put the fusion arrow on too'}
                onClick={() => setShowSecond((v) => !v)}
                accent={ACCENT_B}
              />
            )}
          </div>

          {reveal >= 3 && (
            <Card tone="second">
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT_B }}>
                The arrow IS the energy
              </div>
              <p className="mt-1 text-sm leading-snug" style={{ color: TEXT.primary }}>
                The nucleons climbed <b className="tabular-nums">{fixed(move.gainPerNucleon, 4)}</b> MeV each, and{' '}
                <b className="tabular-nums">{nucleonsMoved}</b> of them made the climb. That product is{' '}
                <b className="tabular-nums" style={{ color: ACCENT_B }}>{fixed(move.gainPerNucleon * nucleonsMoved, 2)} MeV</b>
                {' '}— and the mass table, which knows nothing about this graph, gives{' '}
                <b className="tabular-nums" style={{ color: ACCENT }}>{fixed(q.mev, 2)} MeV</b>. Same number. You have
                just measured a nuclear energy release with a ruler.
              </p>
            </Card>
          )}

          {reveal >= 4 && reaction.kind === 'fission' && resolved.params.showAccount !== false && (
            <Card>
              <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
                So where does &ldquo;about 200 MeV&rdquo; come from?
              </div>
              <div className="mt-1.5 flex flex-col">
                {FISSION_ACCOUNT.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-3 py-[2px]">
                    <span className="text-[12px]" style={{ color: row.escapes ? TEXT.muted : TEXT.secondary }}>
                      {row.label}
                    </span>
                    <span className="text-[12px] font-semibold tabular-nums" style={{ color: row.escapes ? TEXT.muted : ACCENT_B }}>
                      ~{row.mev} MeV
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[12px] leading-snug" style={{ color: TEXT.secondary }}>
                Total about <b className="tabular-nums">{FISSION_TOTAL_MEV}</b> MeV, of which about{' '}
                <b className="tabular-nums">{FISSION_RECOVERABLE_MEV}</b> can be turned into heat. The{' '}
                <b className="tabular-nums">{fixed(q.mev, 0)}</b> MeV you just measured is the PROMPT part —
                the mass difference of this one channel. Published breakdowns differ by a couple of MeV per
                row, which is why nothing here is quoted past the nearest MeV.
              </p>
            </Card>
          )}

          {reveal >= 4 && reaction.kind === 'fission' && resolved.params.compareCoal !== false && (
            <Readout
              tone="accent"
              rows={[
                { label: 'per kilogram of U-235', value: si(joulesPerKilogram(FISSION_TOTAL_MEV, 235), 'J'), color: ACCENT_B, strong: true },
                { label: 'per kilogram of coal', value: si(COAL_JOULES_PER_KG, 'J') },
                { label: 'ratio', value: `${fixed(joulesPerKilogram(FISSION_TOTAL_MEV, 235) / COAL_JOULES_PER_KG / 1e6, 2)} million times` },
              ]}
              footnote="Coal is quoted at 30 MJ/kg — good bituminous coal runs 24 to 33 MJ/kg depending on grade, so the ratio is a round number, not a measurement."
            />
          )}
        </div>
      )}

      {tab === 'author' && (
        <div className="flex flex-col gap-2.5">
          <Choice
            options={['split', 'fuse']}
            value={authorMode}
            onChange={(v) => { setAuthorMode(v as 'split' | 'fuse'); setEverMoved(true); }}
            accent={ACCENT_B}
          />
          {authorMode === 'split' ? (
            <>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Parent to split</span>
                <Choice options={HEAVY} value={parent} onChange={(v) => { setParent(v); setEverMoved(true); }} />
              </div>
              <Slider
                label="Where it splits"
                value={splitAt}
                min={0.1}
                max={0.5}
                step={0.01}
                accent={ACCENT_B}
                onChange={(v) => { setSplitAt(v); setEverMoved(true); }}
                format={() => `${fragA} / ${fragB}`}
              />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>First nucleus</span>
                <Choice options={LIGHT} value={fuseA} onChange={(v) => { setFuseA(v); setEverMoved(true); }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-semibold" style={{ color: ACCENT_B }}>Second nucleus</span>
                <Choice options={LIGHT} value={fuseB} onChange={(v) => { setFuseB(v); setEverMoved(true); }} accent={ACCENT_B} />
              </div>
            </div>
          )}
          <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
            This tab reads the DRAWN curve by straight-line interpolation between tabulated points, so it
            answers <i>up or down</i> and deliberately does not quote a Q value — an exact energy needs the
            real fragment masses, which is what &ldquo;The reaction&rdquo; tab uses. Try fusing two iron
            nuclei and watch the verdict flip: that is why a star stops at iron.
          </p>
        </div>
      )}

      <Readout rows={readout} />

      {evidence && <AttackCard code={arch.targets} />}

      {markPeak && (
        <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
          Honest footnote: <b>{textbookPeak.id}</b> at {fixed(textbookPeak.perNucleon, 3)} MeV per nucleon is
          the peak every textbook marks, and <b>{peak.id}</b> at {fixed(peak.perNucleon, 3)} is very slightly
          higher — by 0.05%. Nothing in the fission or fusion argument depends on which of them wins, and
          calling iron the absolute maximum would be a small untruth told for tidiness.
        </p>
      )}
    </div>
  );
}

// ── The plot ─────────────────────────────────────────────────────────────────

interface AuthorOverlay {
  before: { A: number; e: number }[];
  after: { A: number; e: number }[];
}

/**
 * ZERO `<text>` elements. Every number is in the tick strip, the legend or the
 * readout beside it — see `parts.tsx` for why.
 */
function CurvePlot({ box, points, lim, picked, peakY, reaction, reveal, secondary, author }: {
  box: PlotBox;
  points: CurvePoint[];
  lim: { aMin: number; aMax: number; eMin: number; eMax: number };
  picked: string | null;
  peakY: number | null;
  reaction: ReturnType<typeof reactionById> | null;
  reveal: number;
  secondary: ReturnType<typeof reactionById> | null;
  author: AuthorOverlay | null;
}) {
  const { x, y, w, h } = box.rect;
  const px = axis(lim.aMin, lim.aMax, x, x + w);
  const py = axis(lim.eMin, lim.eMax, y + h, y);
  const canvasMin = Math.min(box.width, box.height);
  const dot = Math.max(2, Math.min(4.2, canvasMin * 0.009));

  const path = points
    .map((p, i) => `${i ? 'L' : 'M'}${px(p.A).toFixed(1)},${py(p.perNucleon).toFixed(1)}`)
    .join(' ');

  const gridY = ticks(lim.eMin, lim.eMax, 5).map(py);
  const gridX = ticks(lim.aMin, lim.aMax, 5).map(px);

  const arrowFor = (r: NonNullable<ReturnType<typeof reactionById>>, dim: boolean) => {
    const m = curveMove(r);
    const aBefore = m.from.reduce((s, f) => s + f.A, 0) / Math.max(m.from.length, 1);
    const aAfter = m.to.reduce((s, f) => s + f.A, 0) / Math.max(m.to.length, 1);
    const arr = curveArrow(
      px(aBefore), py(m.beforePerNucleon), px(aAfter), py(m.afterPerNucleon), canvasMin,
    );
    return (
      <g key={r.id} opacity={dim ? 0.5 : 1}>
        <Arrow {...arr} colour={ACCENT_B} width={dim ? 1.8 : 2.6} />
      </g>
    );
  };

  return (
    <g>
      <Axes box={box} gridY={gridY} gridX={gridX} />

      {peakY != null && (
        <line
          x1={x} y1={py(peakY)} x2={x + w} y2={py(peakY)}
          stroke={ACCENT_B} strokeWidth={1.5} strokeDasharray="5 4"
        />
      )}

      <path d={path} fill="none" stroke={ACCENT} strokeWidth={2.2} strokeLinejoin="round" />

      {points.map((p) => (
        <circle
          key={p.id}
          cx={px(p.A)}
          cy={py(p.perNucleon)}
          r={p.id === picked ? dot * 1.9 : dot}
          fill={p.id === picked ? ACCENT_B : ACCENT}
          opacity={picked && p.id !== picked ? 0.55 : 1}
        />
      ))}

      {/* Reactant / product markers, revealed one rung at a time. */}
      {reaction && (() => {
        const m = curveMove(reaction);
        return (
          <g>
            {m.from.filter((f) => f.A > 1).map((f) => (
              <Marker key={`b${f.id}`} cx={px(f.A)} cy={py(f.perNucleon)} r={dot * 1.7} colour={ACCENT} />
            ))}
            {reveal >= 2 && m.to.filter((f) => f.A > 1).map((f) => (
              <Marker key={`a${f.id}`} cx={px(f.A)} cy={py(f.perNucleon)} r={dot * 1.7} colour={ACCENT_B} />
            ))}
          </g>
        );
      })()}

      {reaction && reveal >= 3 && arrowFor(reaction, false)}
      {secondary && arrowFor(secondary, true)}

      {/* The author overlay: the student's own before/after, plus its arrow. */}
      {author && (() => {
        const beforeA = author.before.reduce((s, p) => s + p.A, 0) / author.before.length;
        const beforeE = author.before.reduce((s, p) => s + p.e * p.A, 0)
          / author.before.reduce((s, p) => s + p.A, 0);
        const afterA = author.after.reduce((s, p) => s + p.A, 0) / author.after.length;
        const afterE = author.after.reduce((s, p) => s + p.e * p.A, 0)
          / author.after.reduce((s, p) => s + p.A, 0);
        const arr = curveArrow(px(beforeA), py(beforeE), px(afterA), py(afterE), canvasMin);
        return (
          <g>
            {author.before.map((p, i) => (
              <Marker key={`ab${i}`} cx={px(p.A)} cy={py(p.e)} r={dot * 1.7} colour={ACCENT} />
            ))}
            {author.after.map((p, i) => (
              <Marker key={`aa${i}`} cx={px(p.A)} cy={py(p.e)} r={dot * 1.7} colour={ACCENT_B} />
            ))}
            <line
              x1={px(beforeA)} y1={py(beforeE)} x2={px(beforeA)} y2={y + h}
              stroke={GRID_STROKE} strokeWidth={1}
            />
            <Arrow {...arr} colour={ACCENT_B} width={2.6} />
          </g>
        );
      })()}
    </g>
  );
}
