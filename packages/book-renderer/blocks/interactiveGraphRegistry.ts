// Hand-built named interactive graphs for the `interactive_graph` block.
// Each entry receives the live JXG namespace + an initialised board and draws a
// richer construction than the config form can express (tangents, integrals,
// geometry). Reference one by setting block.graph_id to its key.
//
// Kept loosely typed (JSXGraph ships a single big `JXG` namespace); these run
// client-side only, inside the renderer's useEffect.
/* eslint-disable @typescript-eslint/no-explicit-any */

export type GraphBuilder = (JXG: any, board: any) => void;

export const GRAPH_REGISTRY: Record<string, GraphBuilder> = {
  // Drag the point along the parabola; the tangent line follows.
  'tangent-explorer': (_JXG, board) => {
    const c = board.create('functiongraph', [(x: number) => x * x, -5, 5], {
      strokeColor: '#2563eb',
      strokeWidth: 2,
    });
    const p = board.create('glider', [1, 1, c], {
      name: 'P',
      size: 4,
      fillColor: '#dc2626',
      strokeColor: '#dc2626',
    });
    board.create('tangent', [p], { strokeColor: '#0f766e', strokeWidth: 2 });
  },

  // Drag the interval ends to change the shaded area under the curve.
  'area-under-curve': (_JXG, board) => {
    const c = board.create('functiongraph', [(x: number) => 0.3 * x * x + 1, -5, 5], {
      strokeColor: '#2563eb',
      strokeWidth: 2,
    });
    board.create('integral', [[-2, 2], c], {
      fillColor: '#f59e0b',
      fillOpacity: 0.35,
    });
  },

  // A draggable point and its reflection across the x-axis (coordinate geometry).
  'reflection-x-axis': (board0, board) => {
    void board0;
    const a = board.create('point', [2, 3], { name: 'A', fillColor: '#dc2626', strokeColor: '#dc2626' });
    const refl = board.create('reflection', [a, board.defaultAxes.x], { name: "A'", fillColor: '#2563eb', strokeColor: '#2563eb' });
    board.create('segment', [a, refl], { strokeColor: '#94a3b8', dash: 2 });
  },
};
