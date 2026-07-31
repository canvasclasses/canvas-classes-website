'use client';

/*
 * pulley/MisconceptionCard.tsx — the one place a named belief reaches a student.
 * ─────────────────────────────────────────────────────────────────────────────
 * `archetypes.pulley.ts` gives every rung a `targets: MisconceptionCode`; this
 * component is the thing that makes that value cost something. Copy lives in
 * `misconceptions.ts` (pure, so the verifier can read it); the gate lives here.
 *
 * ── THE GATE IS THE POINT OF THIS COMPONENT ──────────────────────────────────
 * `evidence` is REQUIRED and the component returns null without it. Design law
 * #5: nothing is on screen before it has been earned, and a diagnosis shown
 * before the student has committed is not a diagnosis — it is the answer, and it
 * removes the only thing that makes being wrong useful. This has been violated
 * in this codebase before, which is why the check is inside the component rather
 * than left to each of the four call sites to remember.
 *
 * `evidence` must mean BOTH of: the student has committed a prediction on this
 * rung, AND the simulation has produced the numbers that settle it. Passing a
 * bare `true` is the one thing that breaks this file's contract, and
 * `scripts/verify-pulley-wiring.mjs` reads every call site's `evidence={…}`
 * expression and fails on one that names no committed prediction.
 */

import * as React from 'react';
import type { MisconceptionCode } from '../types';
import { TEXT, TYPE, accentTint } from '../../simulations/_shared';
import { pulleyMisconception } from './misconceptions';

export interface MisconceptionCardProps {
  /** The rung's `targets`. A code from another family renders nothing. */
  code: MisconceptionCode | undefined;
  /**
   * The design-law-#5 gate. True only once the student has committed a
   * prediction on this rung AND the sim has run. Never pass a literal.
   */
  evidence: boolean;
  accent: string;
  /** One line naming what just happened, so the card arrives as a consequence
   *  of the student's own action rather than as a pop-up lecture. */
  lead?: string;
}

export default function MisconceptionCard({
  code, evidence, accent, lead,
}: MisconceptionCardProps) {
  const copy = pulleyMisconception(code);
  if (!evidence || !copy) return null;
  return (
    <div className="rounded-xl p-4"
      style={{
        background: accentTint(accent, 0.07),
        border: `1px solid ${accentTint(accent, 0.28)}`,
      }}>
      <div className={TYPE.sectionLabel} style={{ color: accent }}>
        The belief this rung is aimed at
      </div>
      {lead && (
        <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>{lead}</p>
      )}
      <p className={`${TYPE.conceptHeading} mt-1.5`}>{copy.heading}</p>
      <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>{copy.body}</p>
    </div>
  );
}
