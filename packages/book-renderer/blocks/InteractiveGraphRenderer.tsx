'use client';

// Renders an interactive_graph block with JSXGraph. Two modes:
//   • block.graph_id → a hand-built named graph from the registry
//   • block.spec     → a config-driven board (sliders + functions)
//
// JSXGraph is dynamically imported INSIDE useEffect so it never loads during
// SSR (it touches window). The board uses JSXGraph's default light theme — a
// white graph card reads cleanly as an inset on the dark book page and needs
// zero colour config.
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useId, useRef } from 'react';
import type { InteractiveGraphBlock, InteractiveGraphSpec } from '@canvas/data/types/books';
import { GRAPH_REGISTRY } from './interactiveGraphRegistry';

const DEFAULT_BOUNDS = { xmin: -5, xmax: 5, ymin: -5, ymax: 5 };

// Build sliders + function graphs from the spec via JessieCode, so slider names
// used inside a function expression (e.g. 'a*x^2') resolve to the live values.
function buildFromSpec(board: any, spec: InteractiveGraphSpec) {
  const b = spec.bounds ?? DEFAULT_BOUNDS;
  const fix = (n: number) => Number(n).toFixed(3);
  let prog = '';
  spec.sliders.forEach((s, i) => {
    const y = fix(b.ymax - (b.ymax - b.ymin) * 0.07 * (i + 1));
    const x1 = fix(b.xmin + (b.xmax - b.xmin) * 0.06);
    const x2 = fix(b.xmin + (b.xmax - b.xmin) * 0.34);
    prog += `${s.name} = slider([${x1},${y}],[${x2},${y}],[${s.min},${s.value},${s.max}]);\n`;
  });
  spec.functions.forEach((f) => {
    if (f.expr && f.expr.trim()) prog += `functiongraph(${f.expr}, ${b.xmin}, ${b.xmax});\n`;
  });
  if (prog.trim()) board.jc.parse(prog);
}

export default function InteractiveGraphRenderer({ block }: { block: InteractiveGraphBlock }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const boardId = `jxg-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    let board: any;
    let JXG: any;
    let cancelled = false;

    (async () => {
      try {
        const mod: any = await import('jsxgraph');
        JXG = mod.default ?? mod;
        if (cancelled || !ref.current) return;

        const bounds = block.spec?.bounds ?? DEFAULT_BOUNDS;
        board = JXG.JSXGraph.initBoard(boardId, {
          boundingbox: [bounds.xmin, bounds.ymax, bounds.xmax, bounds.ymin],
          axis: true,
          grid: block.spec?.showGrid !== false,
          showCopyright: false,
          showNavigation: true,
          // Equal unit scale on both axes — the board is square (below), so a
          // symmetric range like [-5,5]×[-5,5] looks symmetric and a circle
          // renders round (not stretched into the old wide-short box).
          keepAspectRatio: true,
          pan: { enabled: true, needTwoFingers: true },
        });

        if (block.graph_id && GRAPH_REGISTRY[block.graph_id]) {
          GRAPH_REGISTRY[block.graph_id](JXG, board);
        } else if (block.spec) {
          buildFromSpec(board, block.spec);
        }
      } catch (err) {
        console.error('[interactive_graph] failed to render', err);
      }
    })();

    return () => {
      cancelled = true;
      try {
        if (board && JXG?.JSXGraph?.freeBoard) JXG.JSXGraph.freeBoard(board);
      } catch {
        /* ignore cleanup errors */
      }
    };
  }, [block, boardId]);

  return (
    <figure className="my-6">
      <div className="mx-auto w-full max-w-[560px]">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white p-2">
          {/* Square board → x and y share the same scale and visible range. */}
          <div id={boardId} ref={ref} className="w-full" style={{ aspectRatio: '1 / 1' }} />
        </div>
      </div>
      {(block.title || block.caption) && (
        <figcaption className="mt-2 text-center text-sm">
          {block.title && <span className="font-semibold text-white/80">{block.title}</span>}
          {block.caption && <span className="mt-0.5 block text-xs text-white/50">{block.caption}</span>}
        </figcaption>
      )}
    </figure>
  );
}
