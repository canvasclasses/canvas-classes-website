'use client';

// Authoring form for the interactive_graph block. Two modes:
//   • Form  — set axes, add functions (expressions in x + slider names), and
//             add draggable sliders. Stored in block.spec.
//   • Prebuilt — pick a hand-built named graph (block.graph_id), which the
//             renderer's registry draws. graph_id takes precedence over spec.

import { InteractiveGraphBlock, InteractiveGraphSpec } from '@canvas/data/types/books';

const PREBUILT: { id: string; label: string }[] = [
  { id: 'tangent-explorer', label: 'Tangent explorer (drag a point on y=x²)' },
  { id: 'area-under-curve', label: 'Area under a curve (drag the interval)' },
  { id: 'reflection-x-axis', label: 'Reflection across the x-axis' },
];

const DEFAULT_SPEC: InteractiveGraphSpec = {
  bounds: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
  functions: [{ expr: 'a*x^2 + b*x + c' }],
  sliders: [
    { name: 'a', min: -3, max: 3, value: 1 },
    { name: 'b', min: -3, max: 3, value: 0 },
    { name: 'c', min: -3, max: 3, value: 0 },
  ],
  showGrid: true,
};

const input =
  'w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';

interface Props {
  block: InteractiveGraphBlock;
  onChange: (p: Partial<InteractiveGraphBlock>) => void;
}

export default function InteractiveGraphEditor({ block, onChange }: Props) {
  const mode: 'form' | 'prebuilt' = block.graph_id ? 'prebuilt' : 'form';
  const spec = block.spec ?? DEFAULT_SPEC;
  const setSpec = (next: InteractiveGraphSpec) => onChange({ spec: next });

  return (
    <div className="flex flex-col gap-3">
      {/* Title / caption */}
      <div className="flex flex-col gap-1">
        <span className={lbl}>Title (optional)</span>
        <input
          className={input}
          value={block.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value || undefined })}
          placeholder="e.g. Explore the parabola"
        />
      </div>

      {/* Mode toggle */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-1">
        <button
          onClick={() => onChange({ graph_id: undefined })}
          className={`flex-1 rounded-md px-2 py-1 text-xs ${mode === 'form' ? 'bg-white/10 text-white' : 'text-white/50'}`}
        >
          Build with form
        </button>
        <button
          onClick={() => onChange({ graph_id: PREBUILT[0].id })}
          className={`flex-1 rounded-md px-2 py-1 text-xs ${mode === 'prebuilt' ? 'bg-white/10 text-white' : 'text-white/50'}`}
        >
          Prebuilt graph
        </button>
      </div>

      {mode === 'prebuilt' ? (
        <div className="flex flex-col gap-1">
          <span className={lbl}>Prebuilt graph</span>
          <select
            className={`${input} cursor-pointer`}
            value={block.graph_id}
            onChange={(e) => onChange({ graph_id: e.target.value })}
          >
            {PREBUILT.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0B0F15]">
                {p.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-white/30">
            Need a different interactive graph? Ask the team to add it to the menu.
          </p>
        </div>
      ) : (
        <>
          {/* Bounds */}
          <div>
            <span className={lbl}>Axis range</span>
            <div className="mt-1 grid grid-cols-4 gap-1.5">
              {(['xmin', 'xmax', 'ymin', 'ymax'] as const).map((k) => (
                <label key={k} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-white/30">{k}</span>
                  <input
                    type="number"
                    className={input}
                    value={spec.bounds[k]}
                    onChange={(e) =>
                      setSpec({ ...spec, bounds: { ...spec.bounds, [k]: Number(e.target.value) } })
                    }
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Functions */}
          <div className="flex flex-col gap-1">
            <span className={lbl}>Functions of x (use slider names, e.g. a*x^2 + b*x + c)</span>
            {spec.functions.map((f, i) => (
              <div key={i} className="flex gap-1.5">
                <input
                  className={`${input} font-mono`}
                  value={f.expr}
                  onChange={(e) => {
                    const fns = [...spec.functions];
                    fns[i] = { ...fns[i], expr: e.target.value };
                    setSpec({ ...spec, functions: fns });
                  }}
                  placeholder="sin(x)"
                />
                <button
                  onClick={() => setSpec({ ...spec, functions: spec.functions.filter((_, j) => j !== i) })}
                  className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => setSpec({ ...spec, functions: [...spec.functions, { expr: '' }] })}
              className="self-start text-xs text-orange-300/80 hover:text-orange-200"
            >
              + Add function
            </button>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-1">
            <span className={lbl}>Sliders (draggable parameters)</span>
            {spec.sliders.map((s, i) => (
              <div key={i} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-1.5">
                <input
                  className={input}
                  value={s.name}
                  onChange={(e) => {
                    const sl = [...spec.sliders];
                    sl[i] = { ...sl[i], name: e.target.value };
                    setSpec({ ...spec, sliders: sl });
                  }}
                  placeholder="a"
                />
                {(['min', 'value', 'max'] as const).map((k) => (
                  <input
                    key={k}
                    type="number"
                    className={input}
                    value={s[k]}
                    title={k}
                    onChange={(e) => {
                      const sl = [...spec.sliders];
                      sl[i] = { ...sl[i], [k]: Number(e.target.value) };
                      setSpec({ ...spec, sliders: sl });
                    }}
                  />
                ))}
                <button
                  onClick={() => setSpec({ ...spec, sliders: spec.sliders.filter((_, j) => j !== i) })}
                  className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setSpec({ ...spec, sliders: [...spec.sliders, { name: '', min: -3, max: 3, value: 1 }] })
              }
              className="self-start text-xs text-orange-300/80 hover:text-orange-200"
            >
              + Add slider
            </button>
            <p className="text-[11px] text-white/30">
              Slider columns: name · min · start · max. Reference the name in a function above.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs text-white/60">
            <input
              type="checkbox"
              checked={spec.showGrid !== false}
              onChange={(e) => setSpec({ ...spec, showGrid: e.target.checked })}
            />
            Show grid
          </label>
        </>
      )}
    </div>
  );
}
