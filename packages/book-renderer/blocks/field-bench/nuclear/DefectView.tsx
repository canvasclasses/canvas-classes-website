'use client';

/*
 * nuclear/DefectView.tsx — weigh the parts, weigh the whole, find mass missing.
 * ─────────────────────────────────────────────────────────────────────────────
 * ── The invisible middle step (design law #3) ────────────────────────────────
 * A textbook writes "Δm = 0.03038 u" and moves on. What it cannot do is show
 * WHY that number is easy to miss: 0.03038 out of 4.033 is 0.75%, so drawn at
 * true scale the two mass bars are indistinguishable. This view draws them at
 * true scale FIRST — the student sees two bars that look identical — and then
 * magnifies the difference by an explicit, printed factor. The lesson is not
 * "mass is missing"; it is "mass is missing by an amount you would never notice
 * on a balance, and that amount is 28 MeV."
 *
 * ── Guided, never auto-playing ──────────────────────────────────────────────
 * Nothing is on screen at rung 0 but the shopping list. Each press adds exactly
 * one row, in the order the sum is done by hand: parts, whole, difference,
 * energy, per nucleon. The energy is never on screen before the difference it
 * came from.
 *
 * The canvas renders ZERO `<text>` elements; every number is in the balance rows
 * beside it (SIMULATION_DESIGN_WORKFLOW §4E).
 */

import * as React from 'react';
import { binding } from './lib/binding';
import { CURVE_NUCLIDES, nuclide, pretty } from './lib/nuclides';
import { MEV_PER_U } from './lib/constants';
import { boxFor, AttackCard, BalanceRow, Canvas, Chip, ACCENT_B } from './parts';
import type { NuclearArchetype } from '../archetypes.nuclear';
import type { ResolvedNuclear } from './lib/scene';
import { ActionButton, Card, Legend, Readout, Toggle } from '../ui';
import { si, fixed } from '../lib/format';
import { ACCENT, TEXT, SIM_CANVAS_BG, accentTint } from '../../simulations/_shared';
import { stageHeight } from '../useStageWidth';

const IDS = CURVE_NUCLIDES.map((n) => n.id);

export default function DefectView({ resolved, arch, stageW, stacked }: {
  resolved: ResolvedNuclear;
  arch: NuclearArchetype;
  stageW: number;
  stacked: boolean;
}) {
  const [pick, setPick] = React.useState<string>(
    typeof resolved.params.pick === 'string' ? String(resolved.params.pick) : 'He-4',
  );
  const [rung, setRung] = React.useState(0);
  const [showJoules, setShowJoules] = React.useState(resolved.params.showJoules !== false);
  const [magnified, setMagnified] = React.useState(false);

  const b = React.useMemo(() => binding(pick), [pick]);
  const nuc = nuclide(pick);
  const h1 = nuclide('H-1');
  const nn = nuclide('n');
  const mH = 1 + h1.excess / MEV_PER_U;
  const mN = 1 + nn.excess / MEV_PER_U;

  /** The magnification the bars need for the gap to be visible at all. Printed,
   *  never implied: a silently exaggerated bar chart is a lie about scale. */
  const magnification = Math.max(1, Math.round(0.14 / (b.massDefectU / b.partsU)));

  const w = Math.max(240, stageW || 320);
  const hh = stageHeight(w, stacked ? 0.5 : 0.42, 260, 170);
  const box = React.useMemo(() => boxFor(w - 16, hh), [w, hh]);

  const gap = b.massDefectU / b.partsU;
  const shownGap = magnified ? Math.min(0.5, gap * magnification) : gap;

  return (
    <div className="flex flex-col gap-3">
      <div
        className="overflow-hidden rounded-2xl p-2"
        style={{ background: SIM_CANVAS_BG, border: `1px solid ${accentTint(ACCENT, 0.18)}` }}
      >
        <Canvas box={box} label={`Two mass bars: ${pick} and the separated nucleons it is made of.`}>
          <MassBars box={box} gap={shownGap} showWhole={rung >= 2} />
        </Canvas>
      </div>

      <Legend rows={[
        { color: ACCENT, label: `the separated parts — ${b.Z} hydrogen atoms + ${b.N} neutrons`, value: `${fixed(b.partsU, 5)} u` },
        ...(rung >= 2 ? [{ color: ACCENT_B, label: `the finished ${pretty(nuc)} atom`, value: `${fixed(b.actualU, 5)} u` }] : []),
      ]} />

      <div className="flex flex-wrap items-center gap-2">
        <ActionButton accent={ACCENT_B} disabled={rung >= 4} onClick={() => setRung((r) => Math.min(4, r + 1))}>
          {rung === 0 ? 'Weigh the parts'
            : rung === 1 ? 'Now weigh the finished nucleus'
              : rung === 2 ? 'Take the difference'
                : rung === 3 ? 'Convert it with E = Δmc²' : 'All five rows shown'}
        </ActionButton>
        {rung > 0 && <ActionButton onClick={() => { setRung(0); setMagnified(false); }}>Start again</ActionButton>}
        {rung >= 2 && (
          <Toggle
            on={magnified}
            label={`Magnify the gap ${magnification}×`}
            onClick={() => setMagnified((v) => !v)}
            accent={ACCENT_B}
          />
        )}
        {showJoules !== undefined && rung >= 4 && (
          <Toggle on={showJoules} label="Also in joules" onClick={() => setShowJoules((v) => !v)} />
        )}
      </div>

      {rung >= 2 && !magnified && (
        <p className="text-[11px] leading-snug" style={{ color: TEXT.muted }}>
          The two bars look the same length because they nearly are: the gap is{' '}
          <b className="tabular-nums">{fixed(gap * 100, 3)}%</b> of the total. That is exactly why nobody
          found it by weighing things — magnify it {magnification}× to see what you are looking for.
        </p>
      )}

      <Card>
        <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ACCENT }}>
          The arithmetic, one row at a time
        </div>
        <div className="mt-1.5">
          <BalanceRow
            label={<>{b.Z} × hydrogen atom, {fixed(mH, 6)} u</>}
            value={`${fixed(b.Z * mH, 5)} u`}
            tone="accent"
          />
          <BalanceRow
            label={<>{b.N} × neutron, {fixed(mN, 6)} u</>}
            value={`${fixed(b.N * mN, 5)} u`}
            tone="accent"
          />
          <BalanceRow label="the parts, added up" value={`${fixed(b.partsU, 5)} u`} tone="total" rule />
          <BalanceRow
            label={rung >= 2 ? <>the actual {pretty(nuc)} atom</> : 'the actual atom — not weighed yet'}
            value={rung >= 2 ? `${fixed(b.actualU, 5)} u` : '—'}
            tone="second"
          />
          <BalanceRow
            label="mass that is simply not there"
            value={rung >= 3 ? `${fixed(b.massDefectU, 5)} u` : '—'}
            tone="total"
            rule
          />
        </div>
        {rung >= 1 && (
          <p className="mt-2 text-[11px] leading-snug" style={{ color: TEXT.muted }}>
            Hydrogen <i>atoms</i>, not bare protons — that puts exactly {b.Z} electrons on each side of the
            sum, so they cancel and never have to be tracked. Using the proton mass here instead is the
            classic slip, and for uranium it is a 47 MeV error.
          </p>
        )}
      </Card>

      {rung >= 4 && (
        <Readout
          tone="second"
          rows={[
            { label: 'mass defect Δm', value: `${fixed(b.massDefectU, 5)} u`, color: ACCENT },
            { label: 'exchange rate c²', value: `${fixed(MEV_PER_U, 4)} MeV per u` },
            { label: 'binding energy Δmc²', value: `${fixed(b.bindingMev, 3)} MeV`, color: ACCENT_B, strong: true },
            ...(showJoules ? [{ label: 'the same energy, in joules', value: si(b.bindingJoules, 'J') }] : []),
            { label: 'nucleons', value: `${b.A}` },
            {
              label: 'binding energy per nucleon',
              value: `${fixed(b.perNucleon, 4)} MeV`,
              color: ACCENT_B,
              strong: true,
            },
          ]}
          footnote="Δm is not a bookkeeping trick and the energy is not 'equivalent to' the mass. The mass and the energy are the same thing measured in two units, and 931.494 MeV per u is the conversion."
        />
      )}

      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Try another nuclide</span>
        <div className="flex flex-wrap gap-1.5">
          {IDS.map((id) => (
            <Chip
              key={id}
              label={id}
              colour={id === pick ? ACCENT_B : ACCENT}
              dim={id !== pick}
              onClick={() => { setPick(id); setRung(Math.max(rung, 2)); setMagnified(false); }}
            />
          ))}
        </div>
      </div>

      {rung >= 4 && <AttackCard code={arch.targets} />}
    </div>
  );
}

/**
 * Two horizontal bars. ZERO `<text>` — the lengths are the message and the
 * numbers are in the legend and the balance rows.
 */
function MassBars({ box, gap, showWhole }: { box: { width: number; height: number; rect: { x: number; y: number; w: number; h: number } }; gap: number; showWhole: boolean }) {
  const { x, y, w, h } = box.rect;
  const barH = Math.max(14, Math.min(38, h * 0.26));
  const y1 = y + h * 0.22 - barH / 2;
  const y2 = y + h * 0.68 - barH / 2;
  const wholeW = w * (1 - gap);

  return (
    <g>
      {/* the parts */}
      <rect x={x} y={y1} width={w} height={barH} rx={4} fill={accentTint(ACCENT, 0.5)} stroke={ACCENT} strokeWidth={1.4} />
      {/* the finished nucleus */}
      {showWhole && (
        <>
          <rect x={x} y={y2} width={wholeW} height={barH} rx={4} fill={accentTint(ACCENT_B, 0.5)} stroke={ACCENT_B} strokeWidth={1.4} />
          {/* the gap, hatched, between the two ends */}
          <rect
            x={x + wholeW} y={y2} width={Math.max(1, w - wholeW)} height={barH} rx={2}
            fill={accentTint(ACCENT_B, 0.16)} stroke={ACCENT_B} strokeWidth={1.2} strokeDasharray="3 2"
          />
          <line
            x1={x + wholeW} y1={y1 + barH} x2={x + wholeW} y2={y2}
            stroke={ACCENT_B} strokeWidth={1} strokeDasharray="4 3"
          />
          <line x1={x + w} y1={y1 + barH} x2={x + w} y2={y2} stroke={ACCENT_B} strokeWidth={1} strokeDasharray="4 3" />
        </>
      )}
    </g>
  );
}
