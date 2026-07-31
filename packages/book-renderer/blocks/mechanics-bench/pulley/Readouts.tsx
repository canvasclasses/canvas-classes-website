'use client';

/*
 * pulley/Readouts.tsx — every number the solver produced, in words where words
 * are clearer than numbers.
 * ─────────────────────────────────────────────────────────────────────────────
 * Two things this file refuses to do:
 *
 *  • Hide a slack rope. `SolveResult.slackStrings` is a real physical event —
 *    the rope went limp, the tension solved negative, and a rope cannot push.
 *    It gets a full sentence, not a red border. Same for a contact that broke:
 *    the surfaces separated, which is the block leaving the table.
 *  • Print a number the solver did not stand behind. When `singular` is true
 *    the panel says the system is under-determined and shows nothing else. An
 *    under-constrained scene that quietly displays "a = 0.00" is worse than no
 *    sim at all.
 */

import * as React from 'react';
import type { Scene, SolveResult } from '../types';
import { BORDER, TEXT, TYPE } from '../../simulations/_shared';
import { fmt } from '../../simulations/_shared';
import { accelSymbol, dofWord, movableBodies } from './geometry';

function Row({ label, value, unit, colour }:
  { label: React.ReactNode; value: string; unit?: string; colour: string }) {
  return (
    <div className="flex items-baseline gap-3 py-1.5"
      style={{ borderBottom: `1px solid ${BORDER.hairline}` }}>
      <span className="flex-1 text-sm" style={{ color: TEXT.secondary }}>{label}</span>
      <span className="tabular-nums text-sm font-semibold" style={{ color: colour }}>
        {value}
        {unit && <span style={{ color: TEXT.ghost, fontWeight: 500 }}> {unit}</span>}
      </span>
    </div>
  );
}

export interface ReadoutsProps {
  scene: Scene;
  solve: SolveResult | null;
  accent: string;
  accent2: string;
  /**
   * Withhold the whole Tensions block — rows AND the massive-sheave prose under
   * them. Default true.
   *
   * `PulleyLab` sets this false on the rung that exists to break "the tension is
   * the same across any pulley", until the student has said which they expect.
   * The prose below already EXPLAINS the split in so many words, so rendering it
   * first and asking afterwards would be asking a question whose answer is
   * three lines further up the same panel. Accelerations stay visible: they are
   * not the answer to that question, and hiding them would cost the student the
   * context they need to reason about it.
   */
  showTensions?: boolean;
}

export default function Readouts({
  scene, solve, accent, accent2, showTensions = true,
}: ReadoutsProps) {
  if (!solve) {
    return (
      <p className={TYPE.body} style={{ color: TEXT.ghost }}>
        Nothing has been solved yet. Work through the constraint first — the
        numbers mean very little until you know where the equation came from.
      </p>
    );
  }

  if (solve.singular) {
    return (
      <div>
        <div className={TYPE.sectionLabel} style={{ color: TEXT.ghost }}>
          Under-determined
        </div>
        <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.secondary }}>
          This scene does not pin down a unique answer — there are more unknowns
          than equations, so no acceleration is being shown. Usually a body is
          missing its axis of motion, or a rope constraint repeats one already
          counted.
        </p>
        {solve.warnings.map((w, i) => (
          <p key={i} className={`${TYPE.body} mt-1`} style={{ color: TEXT.ghost }}>{w}</p>
        ))}
      </div>
    );
  }

  const movable = movableBodies(scene);
  const strings = scene.strings ?? [];
  const slack = new Set(solve.slackStrings);
  const broken = new Set(solve.brokenContacts);
  const normals = Object.entries(solve.normals ?? {}).filter(([, v]) => Number.isFinite(v));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
          Accelerations
        </div>
        <div className="mt-1">
          {movable.map((b, i) => {
            const a = solve.accelerations[b.id];
            const sym = accelSymbol(b, i);
            const word = dofWord(b.dofDeg);
            const mag = Math.abs(a ?? 0);
            return (
              <Row key={b.id}
                colour={accent2}
                label={
                  <>
                    <span style={{ fontStyle: 'italic', color: TEXT.primary }}>{sym}</span>
                    <span style={{ color: TEXT.ghost }}> — {b.label ?? b.id}</span>
                    {mag > 1e-4 && (
                      <span style={{ color: TEXT.ghost }}>
                        , {(a ?? 0) >= 0 ? word : `not ${word}`}
                      </span>
                    )}
                  </>
                }
                value={mag < 1e-4 ? '0' : fmt(mag, 2)}
                unit="m s⁻²" />
            );
          })}
        </div>
        {movable.every((b) => Math.abs(solve.accelerations[b.id] ?? 0) < 1e-4) && (
          <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.ghost }}>
            Everything is in equilibrium. The rope is doing work holding the
            system still — which is exactly what a fixed pulley is for.
          </p>
        )}
      </div>

      {showTensions && (
      <div>
        <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
          Tensions
        </div>
        <div className="mt-1">
          {strings.flatMap((s) => {
            // A rope crossing a MASSIVE sheave is solved as several runs, one
            // tension each (`s1#0`, `s1#1`, …) — that split is the whole point
            // of the massive-pulley rung, so show every run rather than run 0
            // posing as "the" tension. A massless rope has exactly one run and
            // still reports under its bare id.
            const runs = Object.keys(solve.tensions)
              .filter((k) => k === s.id || k.startsWith(`${s.id}#`))
              .filter((k, _i, all) => !(k === s.id && all.some((o) => o.startsWith(`${s.id}#`))))
              .sort();
            const keys = runs.length ? runs : [s.id];
            return keys.map((key, i) => {
              const T = solve.tensions[key];
              const isSlack = slack.has(s.id);
              return (
                <Row key={key}
                  colour={isSlack ? TEXT.muted : accent}
                  label={
                    <>
                      <span style={{ fontStyle: 'italic', color: TEXT.primary }}>T</span>
                      {keys.length > 1 && (
                        <span style={{ color: TEXT.primary, fontSize: '0.85em' }}>{i + 1}</span>
                      )}
                      <span style={{ color: TEXT.ghost }}> — {s.label ?? s.id}</span>
                    </>
                  }
                  value={isSlack ? 'slack' : T == null ? '—' : fmt(Math.abs(T), 2)}
                  unit={isSlack || T == null ? undefined : 'N'} />
              );
            });
          })}
        </div>

        {/* A sheave carrying inertia splits the tension, and since 2026-07-29
            the engine genuinely solves that rotational row — so this explains
            the two numbers above rather than apologising for one. */}
        {scene.bodies.some((b) => b.shape === 'pulley' && (b.inertia ?? 0) > 0) && (
          <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.ghost }}>
            This sheave has mass, so the two tensions are genuinely different —
            and that difference is exactly what supplies the torque spinning it
            up: (T₁ − T₂)·r = Iα. Every earlier rung had one tension throughout
            the rope, which was never a law — only shorthand for &ldquo;the
            pulley is massless&rdquo;.
          </p>
        )}

        {strings.length > 1 && !solve.singular && (() => {
          const vals = strings.map((s) => solve.tensions[s.id]).filter((v): v is number => v != null);
          const spread = vals.length > 1 ? Math.max(...vals) - Math.min(...vals) : 0;
          if (spread <= 1e-3) return null;
          return (
            <p className={`${TYPE.body} mt-1.5`} style={{ color: TEXT.secondary }}>
              The two sides are pulling with different tensions. That difference
              is the net torque spinning the sheave up — it can only happen once
              the pulley has mass of its own.
            </p>
          );
        })()}
      </div>
      )}

      {normals.length > 0 && (
        <div>
          <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
            Contact forces
          </div>
          <div className="mt-1">
            {normals.map(([id, N]) => (
              <Row key={id} colour={TEXT.primary}
                label={<span style={{ color: TEXT.ghost }}>Normal on the surface ({id})</span>}
                value={fmt(Math.abs(N), 2)} unit="N" />
            ))}
            {Object.entries(solve.frictions ?? {}).map(([id, f]) => (
              <Row key={`f:${id}`} colour={TEXT.primary}
                label={<span style={{ color: TEXT.ghost }}>Friction ({id})</span>}
                value={fmt(Math.abs(f), 2)} unit="N" />
            ))}
          </div>
        </div>
      )}

      {/* ── Physical events, spelled out ─────────────────────────────────── */}
      {slack.size > 0 && (
        <div>
          <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
            The rope went slack
          </div>
          <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.secondary }}>
            {solve.slackStrings.map((id) =>
              strings.find((s) => s.id === id)?.label ?? id).join(', ')}
            {solve.slackStrings.length === 1 ? ' solved' : ' solved'} to a negative
            tension, and a rope cannot push. So it is not pulling at all — it has
            gone limp, and whatever it was holding is now in free fall until the
            rope pulls tight again. This is not an error in the model; it is the
            model telling you the answer changed shape.
          </p>
        </div>
      )}

      {broken.size > 0 && (
        <div>
          <div className={TYPE.sectionLabel} style={{ color: TEXT.secondary }}>
            A surface let go
          </div>
          <p className={`${TYPE.body} mt-1`} style={{ color: TEXT.secondary }}>
            The normal force came out negative at {[...broken].join(', ')} —
            surfaces can push but never pull, so the two have separated and the
            body has left the surface.
          </p>
        </div>
      )}

      {solve.warnings.length > 0 && (
        <div>
          {solve.warnings.map((w, i) => (
            <p key={i} className={TYPE.body} style={{ color: TEXT.ghost }}>{w}</p>
          ))}
        </div>
      )}
    </div>
  );
}
