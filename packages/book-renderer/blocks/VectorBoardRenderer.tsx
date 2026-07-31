'use client';

// Renders a `vector_board` block: an optional predict-first gate, then the
// SVG vector board (a named archetype construction plus any of the gradable
// exercise layers), with title/caption.
//
// The board is loaded ssr:false — it is pointer-event driven and client-only,
// the same discipline the simulation registry and MathGraphRenderer follow.
// See vector-board/archetypes.ts for the engine and
// PHYSICS_CH0_MATHS_FOR_PHYSICS_PLAN.md §2 for the pedagogy this serves.

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { VectorBoardBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

const VectorBoard = dynamic(() => import('./vector-board/VectorBoard'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse rounded-2xl border"
      style={{ height: 400, background: '#0B0F15', borderColor: '#ffffff14' }}
    />
  ),
});

export default function VectorBoardRenderer({ block }: { block: VectorBoardBlock }) {
  const predict = block.predict;
  const [picked, setPicked] = useState<number | null>(null);
  const gated = !!predict && picked === null;

  return (
    <figure className="my-6">
      {block.title && (
        <figcaption className="mb-2 text-sm font-semibold" style={{ color: 'var(--book-fg, #e2e8f0)' }}>
          {block.title}
        </figcaption>
      )}

      {gated ? (
        <div className="rounded-xl border p-4" style={{ background: 'var(--book-surface, #181A21)', borderColor: '#ffffff14' }}>
          <div className="mb-3 flex items-start gap-2">
            <span
              className="mt-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: '#c4b5fd22', color: '#c4b5fd' }}
            >
              Predict first
            </span>
            <p className="text-sm" style={{ color: '#e2e8f0' }}>
              <InlineMarkdown>{predict!.prompt}</InlineMarkdown>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {predict!.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setPicked(i)}
                className="rounded-lg border px-3 py-2 text-left text-sm transition-colors"
                style={{ background: '#0B0F15', borderColor: '#ffffff14', color: '#cbd5e1' }}
              >
                <InlineMarkdown>{opt}</InlineMarkdown>
              </button>
            ))}
          </div>
          <p className="mt-3 text-[11px]" style={{ color: '#64748b' }}>
            Commit a guess — then the board unlocks and you can test it.
          </p>
        </div>
      ) : (
        <>
          <VectorBoard block={block} />
          {predict && picked !== null && (
            <div
              className="mt-3 rounded-lg border px-3 py-2 text-sm"
              style={{ background: 'var(--book-surface, #181A21)', borderColor: '#ffffff14', color: '#cbd5e1' }}
            >
              <span style={{ color: '#94a3b8' }}>You predicted: </span>
              <span style={{ color: '#e2e8f0' }}>
                <InlineMarkdown>{predict.options[picked]}</InlineMarkdown>
              </span>
              {typeof predict.answer_index === 'number' && (
                <span
                  className="ml-2 rounded px-1.5 py-0.5 text-[11px] font-semibold"
                  style={
                    picked === predict.answer_index
                      ? { background: '#6ee7b722', color: '#6ee7b7' }
                      : { background: '#fca5a522', color: '#fca5a5' }
                  }
                >
                  {picked === predict.answer_index ? 'Matches' : 'Not quite'}
                </span>
              )}
              {predict.reveal && (
                <p className="mt-1" style={{ color: '#94a3b8' }}>
                  <InlineMarkdown>{predict.reveal}</InlineMarkdown>
                </p>
              )}
            </div>
          )}
        </>
      )}

      {block.caption && (
        <figcaption className="mt-2 text-center text-xs" style={{ color: 'var(--book-fg-muted, #94a3b8)' }}>
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
