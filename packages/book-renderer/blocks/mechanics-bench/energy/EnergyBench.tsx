'use client';

/*
 * energy/EnergyBench.tsx — the Phase-2 ENERGY switchboard.
 * ─────────────────────────────────────────────────────────────────────────────
 * Sibling of `MechanicsBench.tsx`, and deliberately the same shape: this file
 * owns nothing but the routing decision. Which bench renders comes from the
 * archetype's OWN spec (`buildScene(...).bench`), never from a field an author
 * could set inconsistently with the archetype they picked — so an exercise
 * cannot be authored into a state where the scene and the tool disagree.
 *
 * ⚠ THIS IS NOT YET REACHABLE FROM A BOOK PAGE.
 * `MechanicsBenchBlock.mode` is the frozen union `'fbd' | 'pulley' | 'solve'`
 * and `MechanicsBench.tsx` routes all three elsewhere. Phase 2 owns neither
 * file. Wiring these to a page needs one new mode value (`'energy'`) plus one
 * case in that switchboard — see the build report. Until then this component is
 * the entry point, and it takes an archetype id directly.
 */

import * as React from 'react';
import { SIM_SURFACE, TEXT, BORDER, TYPE } from '../../simulations/_shared';
import { ENERGY_ARCHETYPES } from '../archetypes.energy';
import { ROTATION_ARCHETYPES } from '../archetypes.rotation';
import type { Phase2Archetype } from './kit/phase2';
import EnergyLedger from './EnergyLedger';
import RollerCoaster from './RollerCoaster';
import CollisionStudio from './CollisionStudio';
import SpringBench from './SpringBench';
import OrbitSandbox from './OrbitSandbox';
import MoiRacer from '../rotation/MoiRacer';
import TorqueBench from '../rotation/TorqueBench';
import RollingBench from '../rotation/RollingBench';
import ChairBench from '../rotation/ChairBench';

export interface Phase2BenchProps {
  /** An id from ENERGY_ARCHETYPES or ROTATION_ARCHETYPES. */
  archetype: string;
  params?: Record<string, number | string | boolean>;
}

/**
 * Renders any Phase-2 rung, from either family.
 *
 * The two libraries are looked up in order and the ids are asserted unique
 * across both by `scripts/verify-mechanics-phase2.mjs` — an id is a stable
 * authoring handle stored on saved book pages, so a collision would silently
 * re-point an already-authored exercise at a different scene.
 */
export default function Phase2Bench({ archetype, params }: Phase2BenchProps) {
  const arch: Phase2Archetype | undefined =
    ENERGY_ARCHETYPES[archetype] ?? ROTATION_ARCHETYPES[archetype];

  if (!arch) return <Unknown what={archetype} />;

  // Built once per (archetype, params) pair. NOT memoised on object identity:
  // the admin editor recreates the params object on every autosave keystroke,
  // and a memo keyed on identity would rebuild the scene — and reset every
  // slider the student had moved — on each of them. That defect shipped once.
  const key = React.useMemo(() => JSON.stringify(params ?? {}), [params]);
  const spec = React.useMemo(() => arch.buildScene(params), [arch, key]); // eslint-disable-line react-hooks/exhaustive-deps

  switch (spec.bench) {
    case 'ledger': return <EnergyLedger arch={arch} spec={spec} />;
    case 'coaster': return <RollerCoaster arch={arch} spec={spec} />;
    case 'collision': return <CollisionStudio arch={arch} spec={spec} />;
    case 'spring': return <SpringBench arch={arch} spec={spec} />;
    case 'orbit': return <OrbitSandbox arch={arch} spec={spec} />;
    case 'moi': return <MoiRacer arch={arch} spec={spec} />;
    case 'torque': return <TorqueBench arch={arch} spec={spec} />;
    case 'rolling': return <RollingBench arch={arch} spec={spec} />;
    case 'chair': return <ChairBench arch={arch} spec={spec} />;
    default: return <Unknown what={archetype} />;
  }
}

function Unknown({ what }: { what: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: SIM_SURFACE, borderColor: BORDER.card }}>
      <p className={TYPE.badge} style={{ color: TEXT.ghost }}>Energy / rotation bench</p>
      <p className={TYPE.body} style={{ color: TEXT.secondary }}>
        No archetype named <code>{what}</code>. Pick one from the catalogue in the editor.
      </p>
    </div>
  );
}
