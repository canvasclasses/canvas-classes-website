'use client';

/*
 * rotation/RotationBench.tsx — the Phase-2 ROTATION entry point.
 * ─────────────────────────────────────────────────────────────────────────────
 * A named door for the rotation family, so a page (or a future `'rotation'`
 * block mode) does not have to know that both families share one switchboard.
 * The routing itself lives in `energy/EnergyBench.tsx`, which dispatches on the
 * spec's OWN `bench` tag rather than on anything an author sets — see its header.
 *
 * This file exists rather than re-exporting because the rotation catalogue is a
 * separate authoring surface: the admin picker for Unit 4 should list nine rungs,
 * not twenty-four.
 */

import * as React from 'react';
import Phase2Bench from '../energy/EnergyBench';
import { ROTATION_ARCHETYPES, ROTATION_ARCHETYPE_ORDER } from '../archetypes.rotation';

/** The rotation rungs, in ladder order — what an admin picker should show. */
export const ROTATION_CATALOG = ROTATION_ARCHETYPE_ORDER.map((id) => {
  const a = ROTATION_ARCHETYPES[id];
  return {
    id: a.id,
    title: a.title,
    summary: a.summary,
    targets: a.targets,
    params: a.params,
    steps: a.defaultSteps.length,
  };
});

export default function RotationBench({ archetype, params }: {
  archetype: string;
  params?: Record<string, number | string | boolean>;
}) {
  return <Phase2Bench archetype={archetype} params={params} />;
}
