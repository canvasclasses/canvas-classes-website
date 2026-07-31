'use client';

// Renders a `mechanics_bench` block: an optional predict-first gate, then the
// E1 bench (FBD Studio / Pulley Lab, chosen by `mode`), with title/caption.
//
// The bench is loaded ssr:false — it is pointer-event driven and client-only,
// the same discipline VectorBoardRenderer, MathGraphRenderer and the simulation
// registry follow. See mechanics-bench/archetypes.ts for the construction
// library and PHYSICS_SIMULATION_PROGRAM.md §5.1–5.2 for the pedagogy.

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { MechanicsBenchBlock } from '@canvas/data/types/books';
import { SIM_SURFACE, TEXT, ACCENT, BORDER, OK, BAD, accentTint } from './simulations/_shared';
import InlineMarkdown from './InlineMarkdown';

const MechanicsBench = dynamic(() => import('./mechanics-bench/MechanicsBench'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse rounded-2xl border"
      style={{ height: 440, background: SIM_SURFACE, borderColor: BORDER.card }}
    />
  ),
});

export default function MechanicsBenchRenderer({ block }: { block: MechanicsBenchBlock }) {
  const predict = block.predict;
  const [picked, setPicked] = useState<number | null>(null);
  const gated = !!predict && picked === null;

  return (
    <figure className="my-6">
      {block.title && (
        <figcaption className="mb-2 text-sm font-semibold" style={{ color: `var(--book-fg, ${TEXT.primary})` }}>
          {block.title}
        </figcaption>
      )}

      {gated ? (
        <div className="rounded-xl border p-4" style={{ background: 'var(--book-surface, #181A21)', borderColor: BORDER.card }}>
          <div className="mb-3 flex items-start gap-2">
            <span
              className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: accentTint(ACCENT, 0.13), color: ACCENT }}
            >
              Predict first
            </span>
            <p className="text-sm" style={{ color: TEXT.primary }}>
              <InlineMarkdown>{predict!.prompt}</InlineMarkdown>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {predict!.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setPicked(i)}
                className="rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                style={{ background: SIM_SURFACE, borderColor: BORDER.card, color: '#cbd5e1' }}
              >
                <InlineMarkdown>{opt}</InlineMarkdown>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: TEXT.ghost }}>
            Commit a guess — then the bench unlocks and you can test it.
          </p>
        </div>
      ) : (
        <>
          <MechanicsBench block={block} />
          {predict && picked !== null && (
            <div
              className="mt-3 rounded-lg border px-3 py-2 text-sm"
              style={{ background: 'var(--book-surface, #181A21)', borderColor: BORDER.card, color: '#cbd5e1' }}
            >
              <span style={{ color: TEXT.secondary }}>You predicted: </span>
              <span style={{ color: TEXT.primary }}>
                <InlineMarkdown>{predict.options[picked]}</InlineMarkdown>
              </span>
              {typeof predict.answer_index === 'number' && (
                <span
                  className="ml-2 rounded px-1.5 py-0.5 text-[11px] font-semibold"
                  style={
                    picked === predict.answer_index
                      ? { background: accentTint(OK, 0.13), color: OK }      // sim-lint-ok: pass/fail pair
                      : { background: accentTint(BAD, 0.13), color: BAD }    // sim-lint-ok: pass/fail pair
                  }
                >
                  {picked === predict.answer_index ? 'Matches' : 'Not quite'}
                </span>
              )}
              {predict.reveal && (
                <p className="mt-1" style={{ color: TEXT.secondary }}>
                  <InlineMarkdown>{predict.reveal}</InlineMarkdown>
                </p>
              )}
            </div>
          )}
        </>
      )}

      {block.caption && (
        <figcaption className="mt-2 text-center text-xs" style={{ color: `var(--book-fg-muted, ${TEXT.secondary})` }}>
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
