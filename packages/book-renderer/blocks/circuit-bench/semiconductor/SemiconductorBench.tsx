'use client';

/*
 * semiconductor/SemiconductorBench.tsx — the Semiconductor Bench switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Nine authored archetypes, six faces. This file owns the routing decision and the
 * guided script; the physics lives in `semiconductor/lib/**` (pure, node-verified,
 * and where it can it delegates the solving to the frozen E3 nodal engine) and the
 * drawing lives in the six views.
 *
 *   doping      → DopingView       doping trades carriers, it does not add them
 *   junction    → JunctionView     the self-built barrier, and the bands under bias
 *   iv          → DiodeView        there is no knee in the equation
 *   rectifier   → RectifierView    input and output on the same time axis
 *   zener       → ZenerView        a diode useful precisely because it broke
 *   transistor  → TransistorView   β, and where it stops applying
 *
 * ── HOW THIS IS REACHED FROM A PAGE — ONE LINE, NO BLOCK-TYPE CHANGE ────────
 * `CircuitBenchBlock` has no `mode` field — it is archetype-driven — so this bench
 * needs nothing at all from `packages/data`: no `BlockType` entry, no Zod enum, no
 * admin-editor Record. What it needs is one line at the top of the frozen
 * `circuit-bench/CircuitBench.tsx`, exactly mirroring the AC bench's:
 *
 *     if (isSemiconductorArchetype(block.archetype)) return <SemiconductorBench block={block} />;
 *
 * `isSemiconductorArchetype` is exported below for that purpose, so the router never
 * has to know the nine ids. That edit is REPORTED rather than made, because another
 * agent is concurrently editing the same file and a silent third edit is how a merge
 * conflict becomes a lost archetype.
 *
 * `SEMICONDUCTOR_ARCHETYPES` is already assignable to
 * `Record<string, CircuitArchetype>` (asserted at the bottom of
 * `archetypes.semiconductor.ts`), so merging it into `CIRCUIT_ARCHETYPES` — which is
 * what puts the nine exercises in the admin picker — is also a one-line diff with no
 * cast and no adaptation.
 *
 * ── Guided, never auto-playing (design law #5) ───────────────────────────────
 * There is no animation loop anywhere under `semiconductor/`. Every reveal is a
 * press; the rectifier's cursor is dragged, not played.
 */

import * as React from 'react';
import type { CircuitBenchBlock } from '@canvas/data/types/books';
import {
  getSemiconductorArchetype, SEMICONDUCTOR_ARCHETYPES,
  type SemiconductorArchetype, type SemiconductorScene,
} from '../archetypes.semiconductor';
import DopingView from './DopingView';
import JunctionView from './JunctionView';
import DiodeView from './DiodeView';
import RectifierView from './RectifierView';
import ZenerView from './ZenerView';
import TransistorView from './TransistorView';
import { Card, GuidedPanel } from './parts';
import { isStacked, useStageWidth } from '../useStageWidth';
import {
  SimShell, SimHeader, TEXT, BORDER, TYPE, SIM_SURFACE,
} from '../../simulations/_shared';

type Bag = Record<string, number | string | boolean>;

/** True when a `circuit_bench` block's archetype belongs to the semiconductor
 *  library — the one predicate the engine's router needs, so it does not have to
 *  know the nine ids. Mirrors `isAcArchetype`. */
export const isSemiconductorArchetype = (archetype?: string): boolean =>
  !!archetype && !!SEMICONDUCTOR_ARCHETYPES[archetype];

export default function SemiconductorBench({ block }: { block: CircuitBenchBlock }) {
  const archetypeId = block.archetype ?? 'intrinsic-to-doped';
  const arch: SemiconductorArchetype | undefined = getSemiconductorArchetype(archetypeId);

  // Everything derived from `block` is keyed on stable PRIMITIVES. The admin editor
  // autosaves on every keystroke and hands us a brand-new block object each time; a
  // memo keyed on `block` would rebuild the scene and reset the student's progress
  // on every character typed.
  const authoredParamsKey = JSON.stringify(block.params ?? {});
  const stepsKey = JSON.stringify(block.steps ?? null);
  const guidedFlag = block.guided !== false;

  const [overrides, setOverrides] = React.useState<Bag>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { setOverrides({}); setStep(0); }, [archetypeId, authoredParamsKey]);

  const params: Bag = React.useMemo(() => {
    const defaults: Bag = {};
    for (const p of arch?.params ?? []) defaults[p.key] = p.default;
    return { ...defaults, ...(JSON.parse(authoredParamsKey) as Bag), ...overrides };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arch, authoredParamsKey, overrides]);

  const paramsKey = JSON.stringify(params);
  const scene: SemiconductorScene | null = React.useMemo(() => {
    if (!arch) return null;
    try {
      return arch.buildScene(params);
    } catch {
      // A hand-edited block with a bad param should degrade to a named card, never
      // to a blank page — blocks are Mixed-stored and hand-editable.
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arch, paramsKey]);

  const steps = React.useMemo(() => {
    const authored = JSON.parse(stepsKey) as { say: string; cta: string }[] | null;
    return authored?.length ? authored : (arch?.defaultSteps ?? []);
  }, [stepsKey, arch]);

  const [step, setStep] = React.useState(0);

  const [wrapRef, wrapW] = useStageWidth<HTMLDivElement>();
  const stacked = isStacked(wrapW);
  // The canvas column is 7/12 of the stage in two columns and all of it when
  // stacked. MEASURED, never a CSS breakpoint — and 0 counts as stacked.
  const stageW = stacked ? Math.max(0, wrapW - 8) : Math.max(0, Math.round((wrapW - 20) * (7 / 12)));

  if (!arch || !scene) {
    return (
      <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
        <p className={TYPE.badge} style={{ color: TEXT.ghost }}>Semiconductor bench</p>
        <p className={TYPE.body} style={{ color: TEXT.secondary }}>
          {arch
            ? `The archetype "${archetypeId}" could not be built with these parameters. Check them in the editor.`
            : `Unknown archetype "${archetypeId}". Pick one of: ${Object.keys(SEMICONDUCTOR_ARCHETYPES).join(', ')}.`}
        </p>
      </div>
    );
  }

  const guided = guidedFlag && steps.length > 0;
  const done = !guided || step >= steps.length;

  const rebuild = (patch: Bag) => setOverrides((o) => ({ ...o, ...patch }));

  const intro = (
    <div className="flex flex-col gap-3">
      {guided && !done ? (
        <GuidedPanel steps={steps} index={step} done={false} onAdvance={() => setStep(step + 1)} />
      ) : (
        <Card tone="accent">
          <div className="text-sm leading-relaxed" style={{ color: TEXT.primary }}>{arch.summary}</div>
        </Card>
      )}
    </div>
  );

  const view = scene.view === 'doping'
    ? <DopingView scene={scene} arch={arch} stageW={stageW} stacked={stacked} />
    : scene.view === 'junction'
      ? <JunctionView scene={scene} arch={arch} stageW={stageW} stacked={stacked} />
      : scene.view === 'iv'
        ? <DiodeView scene={scene} arch={arch} stageW={stageW} stacked={stacked} />
        : scene.view === 'rectifier'
          ? <RectifierView scene={scene} arch={arch} stageW={stageW} stacked={stacked} rebuild={rebuild} />
          : scene.view === 'zener'
            ? <ZenerView scene={scene} arch={arch} stageW={stageW} stacked={stacked} />
            : <TransistorView scene={scene} arch={arch} stageW={stageW} stacked={stacked} />;

  return (
    <SimShell>
      <SimHeader
        title={block.title ?? arch.title}
        subtitle={`${scene.view} · semiconductor bench`}
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
          {/* Stacked, the guided panel goes ABOVE the canvas. Below it, a phone
              student meets a row of disabled controls with the thing that enables
              them off-screen — which reads as "the sim is broken". */}
          {stacked && intro}
          {view}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {!stacked && intro}
          {block.caption && (
            <p className="text-[12px] leading-snug" style={{ color: TEXT.muted }}>{block.caption}</p>
          )}
        </div>
      </div>
    </SimShell>
  );
}
