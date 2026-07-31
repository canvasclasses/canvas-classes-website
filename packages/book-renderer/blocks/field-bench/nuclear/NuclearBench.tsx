'use client';

/*
 * nuclear/NuclearBench.tsx — the Nuclear Bench switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Six authored archetypes, four faces. This file owns the routing decision, the
 * guided script, the predict gate and the numeric check; the physics is in
 * `nuclear/lib/**` (pure, node-verified) and the drawing is in the four views.
 *
 *   curve   → CurveView   the binding-energy-per-nucleon curve, with fission and
 *                         fusion arrows on the SAME axis. The flagship.
 *   defect  → DefectView  weigh the parts, weigh the whole, find mass missing.
 *   decay   → DecayView   the decay law emerging from 400 independent coin flips.
 *   modes   → ModesView   α, β⁻, β⁺, γ on a neutron-against-proton chart.
 *
 * ── HOW THIS IS REACHED FROM A PAGE (and why it is not, yet) ─────────────────
 * `FieldBenchBlock['mode']` does not contain `'nuclear'`, so no book block routes
 * here today. There are two ways to wire it and the CHEAPER one needs no change to
 * `packages/data` at all:
 *
 *   (a) ARCHETYPE GUARD — one line at the top of `field-bench/FieldBench.tsx`,
 *       before the mode switch, exactly mirroring what `CircuitBench` already does
 *       for the AC library:
 *
 *         if (isNuclearArchetype(block.archetype)) return <NuclearBench block={block} />;
 *
 *       `isNuclearArchetype` is exported below for that purpose. No `BlockType`
 *       change, no Zod migration, no admin-editor Record to keep in step. The one
 *       cost is that the editor's mode dropdown will not say "nuclear", so the
 *       authored `mode` is simply ignored for these six archetype ids.
 *
 *   (b) A REAL MODE — add `| 'nuclear'` in five places (`field-bench/types.ts`,
 *       `packages/data/types/books.ts`, the Zod enum in `packages/data/books/schemas.ts`,
 *       the mode-label Record in `apps/admin/.../FieldBenchEditor.tsx`, and a
 *       `case 'nuclear':` here). Tidier in the editor, five files instead of one.
 *
 * Either is reported rather than made: another agent is concurrently touching every
 * one of those files for the EMI bench, and a silent third edit is how a merge
 * conflict becomes a lost mode.
 *
 * `block` is typed structurally (`NuclearBlockLike`) rather than as
 * `FieldBenchBlock`, so a real block is already assignable today and stays
 * assignable under either option with nothing here to change.
 *
 * ── Guided, never auto-playing (design law #5) ───────────────────────────────
 * There is no animation loop anywhere under `nuclear/`. Every reveal is a press.
 */

import * as React from 'react';
import {
  getNuclearArchetype, NUCLEAR_ARCHETYPES, type NuclearArchetype,
} from '../archetypes.nuclear';
import { resolveNuclear, nuclearKey, type NuclearBlockLike } from './lib/scene';
import CurveView from './CurveView';
import DefectView from './DefectView';
import DecayView from './DecayView';
import ModesView from './ModesView';
import { Card, GuidedPanel, NumericPanel, PredictGate } from '../ui';
import { useStageWidth, isNarrow } from '../useStageWidth';
import {
  SimShell, SimHeader, TEXT, BORDER, TYPE, SIM_SURFACE,
} from '../../simulations/_shared';

/** True when a `field_bench` block's archetype belongs to the nuclear library — the
 *  one predicate a router needs, so it does not have to know the six ids. Mirrors
 *  `isAcArchetype` in the circuit engine. */
export const isNuclearArchetype = (archetype?: string): boolean =>
  !!archetype && !!NUCLEAR_ARCHETYPES[archetype];

export default function NuclearBench({ block }: { block: NuclearBlockLike }) {
  const arch: NuclearArchetype | undefined =
    getNuclearArchetype(block.archetype) ?? NUCLEAR_ARCHETYPES['binding-energy-curve'];

  const key = nuclearKey(block);
  // Memoised on the CONTENT key, never on the block object — the admin editor
  // autosaves on every keystroke and hands us a new object each time.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const resolved = React.useMemo(() => resolveNuclear(block, arch), [key]);

  const [step, setStep] = React.useState(0);
  const [predictChoice, setPredictChoice] = React.useState<number | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setStep(0); setPredictChoice(null); }, [key]);

  const [wrapRef, wrapW] = useStageWidth<HTMLDivElement>();
  const stacked = isNarrow(wrapW);
  // The canvas column is 7/12 of the stage when there are two columns, and the
  // whole of it when stacked. Measured, never a CSS breakpoint.
  const stageW = stacked ? Math.max(0, wrapW - 8) : Math.max(0, Math.round((wrapW - 20) * (7 / 12)));

  if (!arch) {
    return (
      <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
        <p className={TYPE.badge} style={{ color: TEXT.ghost }}>Nuclear bench</p>
        <p className={TYPE.body} style={{ color: TEXT.secondary }}>
          {`Unknown archetype "${String(block.archetype)}". Pick one of: ${Object.keys(NUCLEAR_ARCHETYPES).join(', ')}.`}
        </p>
      </div>
    );
  }

  const guided = resolved.guided && resolved.steps.length > 0;
  const done = !guided || step >= resolved.steps.length;

  const intro = (
    <div className="flex flex-col gap-3">
      {guided && !done ? (
        <GuidedPanel
          steps={resolved.steps}
          index={step}
          done={false}
          onAdvance={() => setStep(step + 1)}
        />
      ) : (
        <Card tone="accent">
          <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>{resolved.summary}</div>
        </Card>
      )}

      {block.predict && (
        <PredictGate
          prompt={block.predict.prompt}
          options={block.predict.options}
          answerIndex={block.predict.answer_index}
          reveal={block.predict.reveal}
          choice={predictChoice}
          onChoose={setPredictChoice}
        />
      )}

      {block.numeric && (
        <NumericPanel
          prompt={block.numeric.prompt}
          answer={block.numeric.answer}
          tolerance={block.numeric.tolerance}
          unit={block.numeric.unit}
          reveal={block.numeric.reveal ?? 'That is the value the mass table gives.'}
        />
      )}
    </div>
  );

  const view = resolved.view === 'defect'
    ? <DefectView resolved={resolved} arch={arch} stageW={stageW} stacked={stacked} />
    : resolved.view === 'decay'
      ? <DecayView resolved={resolved} arch={arch} stageW={stageW} stacked={stacked} />
      : resolved.view === 'modes'
        ? <ModesView resolved={resolved} arch={arch} stageW={stageW} stacked={stacked} />
        : <CurveView resolved={resolved} arch={arch} stageW={stageW} stacked={stacked} />;

  return (
    <SimShell>
      <SimHeader
        title={resolved.title}
        subtitle={`${resolved.view} · nuclear bench`}
        badge={<span className="tabular-nums">{arch.id}</span>}
      />

      <div
        ref={wrapRef}
        className="grid grid-cols-1 gap-5 lg:grid-cols-[7fr_5fr] lg:items-start"
        style={wrapW > 0
          ? {
            gridTemplateColumns: stacked ? 'minmax(0,1fr)' : 'minmax(0,7fr) minmax(0,5fr)',
            alignItems: stacked ? 'stretch' : 'start',
          }
          : undefined}
      >
        <div className="flex min-w-0 flex-col gap-3">
          {/* Stacked, the guided panel moves ABOVE the canvas. Below it, a phone
              student meets a set of disabled controls with the thing that enables
              them off-screen — which reads as "the sim is broken". */}
          {stacked && intro}
          {view}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {!stacked && intro}
        </div>
      </div>
    </SimShell>
  );
}
