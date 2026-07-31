'use client';

// Faculty-facing authoring form for the `math_graph` block. This is the
// governance deliverable (MATH_LIVEBOOK_PLAN.md §2A): a math teacher builds an
// interactive graph entirely here — no code, no deploy. Output is JSON on the
// block, saved through the book-writer gateway. The live preview is the editor's
// split-pane on the right (BookWorkspace → PageRenderer), which renders the very
// same MathGraphRenderer the student sees.
//
// Two modes: pick a pedagogical ARCHETYPE (richer, tuned by params) or BUILD a
// declarative board (functions + sliders + points + regions + a linked table).

import { useState } from 'react';
import type {
  MathGraphBlock, MathGraphSpec, MathAccent,
} from '@canvas/data/types/books';
import { ARCHETYPE_CATALOG } from '@canvas/book-renderer/math-graph';

const ACCENTS: MathAccent[] = ['violet', 'sky', 'amber', 'emerald', 'pink', 'orange'];

const DEFAULT_SPEC: MathGraphSpec = {
  bounds: { xmin: -6, xmax: 6, ymin: -6, ymax: 6 },
  functions: [{ expr: 'a*x^2 + b*x + c', color: 'violet' }],
  sliders: [
    { name: 'a', min: -3, max: 3, value: 1 },
    { name: 'b', min: -5, max: 5, value: 0 },
    { name: 'c', min: -5, max: 5, value: -2 },
  ],
  showGrid: true,
  keepSquare: true,
  table: { expr: 'a*x^2 + b*x + c', from: -3, to: 3, step: 1, label: 'y' },
};

const input =
  'w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';

interface Props {
  block: MathGraphBlock;
  onChange: (p: Partial<MathGraphBlock>) => void;
}

export default function MathGraphEditor({ block, onChange }: Props) {
  // The visible tab is LOCAL UI state, seeded from the block once on mount —
  // deliberately NOT re-derived from block.archetype on every render. Clicking
  // a tab only changes which form is SHOWN; it must never call onChange by
  // itself. The underlying block only changes when you actually edit a field
  // or pick a template — see setSpec / the template <select> below. (Bug fixed
  // 2026-07-24: the old version called onChange on tab click alone, and since
  // the editor autosaves on a short debounce, one misclick permanently wiped
  // an archetype block's data. If you're restoring a corrupted graph from a
  // version snapshot, do it via book-writer.restorePageVersion, not by hand.)
  const [tab, setTab] = useState<'archetype' | 'build'>(block.archetype ? 'archetype' : 'build');
  const spec = block.spec ?? DEFAULT_SPEC;
  // Editing any spec field is the ACTUAL commit point for "this block is now
  // in build mode" — clearing archetype here (not on tab click) is what makes
  // switching tabs non-destructive to look at.
  const setSpec = (next: MathGraphSpec) => onChange({ spec: next, archetype: undefined, archetype_params: undefined });
  const bounds = spec.bounds ?? DEFAULT_SPEC.bounds!;
  const selectedArchetype = block.archetype ?? ARCHETYPE_CATALOG[0].key;
  const activeArch = ARCHETYPE_CATALOG.find((a) => a.key === selectedArchetype);

  return (
    <div className="flex flex-col gap-3">
      {/* Title / caption */}
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className={lbl}>Title (optional)</span>
          <input className={input} value={block.title ?? ''} placeholder="e.g. Explore the parabola"
            onChange={(e) => onChange({ title: e.target.value || undefined })} />
        </label>
        <label className="flex flex-col gap-1">
          <span className={lbl}>Caption (optional)</span>
          <input className={input} value={block.caption ?? ''} placeholder="shown under the graph"
            onChange={(e) => onChange({ caption: e.target.value || undefined })} />
        </label>
      </div>

      {/* Mode toggle — view-only. Does NOT touch the saved block by itself. */}
      <div className="flex gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-1">
        <button
          onClick={() => setTab('build')}
          className={`flex-1 rounded-md px-2 py-1 text-xs ${tab === 'build' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
          Build a graph
        </button>
        <button
          onClick={() => setTab('archetype')}
          className={`flex-1 rounded-md px-2 py-1 text-xs ${tab === 'archetype' ? 'bg-white/10 text-white' : 'text-white/50'}`}>
          Use a template
        </button>
      </div>
      {tab !== (block.archetype ? 'archetype' : 'build') && (
        <p className="text-[11px] text-amber-300/70">
          Just browsing — nothing is saved until you {tab === 'archetype' ? 'pick a template below' : 'edit a field below'}.
        </p>
      )}

      {tab === 'archetype' ? (
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-1">
            <span className={lbl}>Template (a ready-made interactive)</span>
            <select className={`${input} cursor-pointer`} value={selectedArchetype}
              onChange={(e) => onChange({ archetype: e.target.value, archetype_params: undefined, spec: undefined })}>
              {ARCHETYPE_CATALOG.map((a) => (
                <option key={a.key} value={a.key} className="bg-[#0B0F15]">{a.label}</option>
              ))}
            </select>
          </label>
          {activeArch && <p className="text-[11px] text-white/35">{activeArch.blurb}</p>}
          {/* Archetype params. Setting one ALSO applies the currently-shown
              template (archetype: selectedArchetype) — so tweaking a param
              first, before touching the select above, still commits correctly
              rather than silently doing nothing. */}
          {activeArch?.params?.map((p) => {
            const cur = block.archetype_params?.[p.name] ?? p.default;
            const set = (v: string | number) =>
              onChange({ archetype: selectedArchetype, archetype_params: { ...(block.archetype_params ?? {}), [p.name]: v } });
            return (
              <label key={p.name} className="flex flex-col gap-1">
                <span className={lbl}>{p.name}{p.hint ? ` — ${p.hint}` : ''}</span>
                {p.type === 'select' ? (
                  <select className={`${input} cursor-pointer`} value={String(cur)}
                    onChange={(e) => set(e.target.value)}>
                    {p.options?.map((o) => <option key={o} value={o} className="bg-[#0B0F15]">{o}</option>)}
                  </select>
                ) : (
                  <input type="number" className={input} value={Number(cur)}
                    onChange={(e) => set(Number(e.target.value))} />
                )}
              </label>
            );
          })}
        </div>
      ) : (
        <>
          {/* Axis range */}
          <div>
            <span className={sectionTitle}>Axis range</span>
            <div className="mt-1 grid grid-cols-4 gap-1.5">
              {(['xmin', 'xmax', 'ymin', 'ymax'] as const).map((k) => (
                <label key={k} className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-white/30">{k}</span>
                  <input type="number" className={input} value={bounds[k]}
                    onChange={(e) => setSpec({ ...spec, bounds: { ...bounds, [k]: Number(e.target.value) } })} />
                </label>
              ))}
            </div>
          </div>

          {/* Functions */}
          <div className="flex flex-col gap-1">
            <span className={sectionTitle}>Functions of x</span>
            <span className="text-[10px] text-white/30">Use slider names, e.g. a*x^2 + b*x + c · sin(x) · exp(x)</span>
            {(spec.functions ?? []).map((f, i) => (
              <div key={i} className="flex flex-col gap-1 rounded-lg border border-white/5 p-1.5">
                <div className="flex gap-1.5">
                  <input className={`${input} flex-1`} value={f.expr} placeholder="a*x^2 + b*x + c"
                    onChange={(e) => {
                      const fns = [...(spec.functions ?? [])];
                      fns[i] = { ...fns[i], expr: e.target.value };
                      setSpec({ ...spec, functions: fns });
                    }} />
                  <select className={`${input} w-24 cursor-pointer`} value={f.color ?? 'violet'}
                    onChange={(e) => {
                      const fns = [...(spec.functions ?? [])];
                      fns[i] = { ...fns[i], color: e.target.value as MathAccent };
                      setSpec({ ...spec, functions: fns });
                    }}>
                    {ACCENTS.map((c) => <option key={c} value={c} className="bg-[#0B0F15]">{c}</option>)}
                  </select>
                  <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                    onClick={() => setSpec({ ...spec, functions: (spec.functions ?? []).filter((_, j) => j !== i) })}>✕</button>
                </div>
                <input className={input} value={f.label ?? ''} placeholder="label for the legend (e.g. x²  ·  y = x + 2)"
                  onChange={(e) => {
                    const fns = [...(spec.functions ?? [])];
                    fns[i] = { ...fns[i], label: e.target.value || undefined };
                    setSpec({ ...spec, functions: fns });
                  }} />
              </div>
            ))}
            <p className="text-[10px] text-white/25">
              Each labelled curve appears in a colour-matched legend in the graph’s corner — labels never sit on the lines.
            </p>
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => setSpec({ ...spec, functions: [...(spec.functions ?? []), { expr: '', color: 'sky' }] })}>
              + Add function
            </button>
          </div>

          {/* Sliders */}
          <div className="flex flex-col gap-1">
            <span className={sectionTitle}>Sliders (draggable parameters)</span>
            {(spec.sliders ?? []).map((s, i) => (
              <div key={i} className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-1.5">
                <input className={input} value={s.name} placeholder="a"
                  onChange={(e) => {
                    const sl = [...(spec.sliders ?? [])]; sl[i] = { ...sl[i], name: e.target.value };
                    setSpec({ ...spec, sliders: sl });
                  }} />
                {(['min', 'value', 'max'] as const).map((k) => (
                  <input key={k} type="number" className={input} value={s[k]} title={k === 'value' ? 'start' : k}
                    onChange={(e) => {
                      const sl = [...(spec.sliders ?? [])]; sl[i] = { ...sl[i], [k]: Number(e.target.value) };
                      setSpec({ ...spec, sliders: sl });
                    }} />
                ))}
                <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                  onClick={() => setSpec({ ...spec, sliders: (spec.sliders ?? []).filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <span className="text-[10px] text-white/30">columns: name · min · start · max</span>
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => setSpec({ ...spec, sliders: [...(spec.sliders ?? []), { name: '', min: -3, max: 3, value: 1 }] })}>
              + Add slider
            </button>
          </div>

          {/* Draggable points */}
          <div className="flex flex-col gap-1">
            <span className={sectionTitle}>Points (optional)</span>
            {(spec.points ?? []).map((p, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1.2fr_auto_auto] items-center gap-1.5">
                <input type="number" className={input} value={p.x} title="x"
                  onChange={(e) => { const pts = [...(spec.points ?? [])]; pts[i] = { ...pts[i], x: Number(e.target.value) }; setSpec({ ...spec, points: pts }); }} />
                <input type="number" className={input} value={p.y} title="y"
                  onChange={(e) => { const pts = [...(spec.points ?? [])]; pts[i] = { ...pts[i], y: Number(e.target.value) }; setSpec({ ...spec, points: pts }); }} />
                <input className={input} value={p.label ?? ''} placeholder="label"
                  onChange={(e) => { const pts = [...(spec.points ?? [])]; pts[i] = { ...pts[i], label: e.target.value || undefined }; setSpec({ ...spec, points: pts }); }} />
                <label className="flex items-center gap-1 text-[11px] text-white/50">
                  <input type="checkbox" checked={!!p.draggable}
                    onChange={(e) => { const pts = [...(spec.points ?? [])]; pts[i] = { ...pts[i], draggable: e.target.checked }; setSpec({ ...spec, points: pts }); }} />
                  drag
                </label>
                <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                  onClick={() => setSpec({ ...spec, points: (spec.points ?? []).filter((_, j) => j !== i) })}>✕</button>
              </div>
            ))}
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => setSpec({ ...spec, points: [...(spec.points ?? []), { x: 1, y: 1, draggable: true }] })}>
              + Add point
            </button>
          </div>

          {/* Segments — straight connectors between two coordinates (triangle
              sides, room outlines, distance legs). Points alone can't draw these. */}
          <div className="flex flex-col gap-1">
            <span className={sectionTitle}>Segments (optional)</span>
            <span className="text-[10px] text-white/30">Connects two literal coordinates — for triangle sides, room outlines, distance legs</span>
            {(spec.segments ?? []).map((s, i) => (
              <div key={i} className="flex flex-col gap-1 rounded-lg border border-white/5 p-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-white/30">from</span>
                  <input type="number" className={input} value={s.from.x} title="from x"
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], from: { ...sg[i].from, x: Number(e.target.value) } }; setSpec({ ...spec, segments: sg }); }} />
                  <input type="number" className={input} value={s.from.y} title="from y"
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], from: { ...sg[i].from, y: Number(e.target.value) } }; setSpec({ ...spec, segments: sg }); }} />
                  <span className="text-[10px] text-white/30">to</span>
                  <input type="number" className={input} value={s.to.x} title="to x"
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], to: { ...sg[i].to, x: Number(e.target.value) } }; setSpec({ ...spec, segments: sg }); }} />
                  <input type="number" className={input} value={s.to.y} title="to y"
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], to: { ...sg[i].to, y: Number(e.target.value) } }; setSpec({ ...spec, segments: sg }); }} />
                  <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                    onClick={() => setSpec({ ...spec, segments: (spec.segments ?? []).filter((_, j) => j !== i) })}>✕</button>
                </div>
                <div className="flex gap-1.5">
                  <input className={`${input} flex-1`} value={s.label ?? ''} placeholder="label for the legend (optional)"
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], label: e.target.value || undefined }; setSpec({ ...spec, segments: sg }); }} />
                  <select className={`${input} w-24 cursor-pointer`} value={s.color ?? 'violet'}
                    onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], color: e.target.value as MathAccent }; setSpec({ ...spec, segments: sg }); }}>
                    {ACCENTS.map((c) => <option key={c} value={c} className="bg-[#0B0F15]">{c}</option>)}
                  </select>
                  <label className="flex items-center gap-1 text-[11px] text-white/50">
                    <input type="checkbox" checked={!!s.dashed}
                      onChange={(e) => { const sg = [...(spec.segments ?? [])]; sg[i] = { ...sg[i], dashed: e.target.checked }; setSpec({ ...spec, segments: sg }); }} />
                    dashed
                  </label>
                </div>
              </div>
            ))}
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => setSpec({ ...spec, segments: [...(spec.segments ?? []), { from: { x: 0, y: 0 }, to: { x: 1, y: 1 } }] })}>
              + Add segment
            </button>
          </div>

          {/* Linked table */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" checked={!!spec.table}
                onChange={(e) => setSpec({ ...spec, table: e.target.checked ? (spec.table ?? { expr: spec.functions?.[0]?.expr ?? 'x', from: -3, to: 3, step: 1, label: 'y' }) : undefined })} />
              <span className={sectionTitle}>Linked table + live equation</span>
            </label>
            {spec.table && (
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-1.5">
                <input className={input} value={spec.table.expr} placeholder="expression"
                  onChange={(e) => setSpec({ ...spec, table: { ...spec.table!, expr: e.target.value } })} />
                {(['from', 'to', 'step'] as const).map((k) => (
                  <input key={k} type="number" className={input} value={spec.table![k]} title={k}
                    onChange={(e) => setSpec({ ...spec, table: { ...spec.table!, [k]: Number(e.target.value) } })} />
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" checked={spec.showGrid !== false}
                onChange={(e) => setSpec({ ...spec, showGrid: e.target.checked })} /> Grid
            </label>
            <label className="flex items-center gap-2 text-xs text-white/60">
              <input type="checkbox" checked={spec.keepSquare !== false}
                onChange={(e) => setSpec({ ...spec, keepSquare: e.target.checked })} /> Square axes
            </label>
          </div>
        </>
      )}

      {/* Compare mode — the "Keep this curve" family builder */}
      <label className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0B0F15] p-2 text-xs text-white/60">
        <input type="checkbox" checked={!!block.compare}
          onChange={(e) => onChange({ compare: e.target.checked || undefined })} />
        <span className={sectionTitle}>Compare mode</span>
        <span className="text-[10px] text-white/30">— lets students freeze curves to build a family</span>
      </label>

      {/* Match-the-graph challenge */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-2">
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input type="checkbox" checked={!!block.challenge}
            onChange={(e) => onChange({ challenge: e.target.checked ? (block.challenge ?? { targets: {} }) : undefined })} />
          <span className={sectionTitle}>Match-the-graph challenge</span>
        </label>
        {block.challenge && (
          <div className="mt-1 flex flex-col gap-1.5">
            <input className={input} value={block.challenge.prompt ?? ''} placeholder="Prompt (e.g. Match the dashed goal curve)"
              onChange={(e) => onChange({ challenge: { ...block.challenge!, prompt: e.target.value || undefined } })} />
            <input className={input} value={block.challenge.success ?? ''} placeholder="Shown when matched"
              onChange={(e) => onChange({ challenge: { ...block.challenge!, success: e.target.value || undefined } })} />
            <label className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/30">tolerance (how close counts as a match)</span>
              <input type="number" step="0.05" className={input} value={block.challenge.tolerance ?? 0.3}
                onChange={(e) => onChange({ challenge: { ...block.challenge!, tolerance: Number(e.target.value) } })} />
            </label>
            <span className="text-[10px] text-white/30">Goal slider values — name must match a slider above (e.g. a, b, h, k)</span>
            {Object.entries(block.challenge.targets ?? {}).map(([name, val], i) => (
              <div key={i} className="grid grid-cols-[1.2fr_1fr_auto] gap-1.5">
                <input className={input} value={name} placeholder="slider name"
                  onChange={(e) => {
                    const next: Record<string, number> = {};
                    Object.entries(block.challenge!.targets).forEach(([k2, v2], j) => {
                      next[j === i ? e.target.value : k2] = v2 as number;
                    });
                    onChange({ challenge: { ...block.challenge!, targets: next } });
                  }} />
                <input type="number" step="0.1" className={input} value={val}
                  onChange={(e) => onChange({ challenge: { ...block.challenge!, targets: { ...block.challenge!.targets, [name]: Number(e.target.value) } } })} />
                <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                  onClick={() => {
                    const next = { ...block.challenge!.targets };
                    delete next[name];
                    onChange({ challenge: { ...block.challenge!, targets: next } });
                  }}>✕</button>
              </div>
            ))}
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => onChange({ challenge: { ...block.challenge!, targets: { ...block.challenge!.targets, '': 0 } } })}>
              + Add goal value
            </button>
          </div>
        )}
      </div>

      {/* Predict-first gate (shared across modes) */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-2">
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input type="checkbox" checked={!!block.predict}
            onChange={(e) => onChange({ predict: e.target.checked ? (block.predict ?? { prompt: '', options: ['', ''] }) : undefined })} />
          <span className={sectionTitle}>Predict-first gate</span>
        </label>
        {block.predict && (
          <div className="mt-1 flex flex-col gap-1.5">
            <input className={input} value={block.predict.prompt} placeholder="Before you drag — what will happen?"
              onChange={(e) => onChange({ predict: { ...block.predict!, prompt: e.target.value } })} />
            {block.predict.options.map((o, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <input className={`${input} flex-1`} value={o} placeholder={`Option ${i + 1}`}
                  onChange={(e) => { const opts = [...block.predict!.options]; opts[i] = e.target.value; onChange({ predict: { ...block.predict!, options: opts } }); }} />
                <label className="flex items-center gap-1 text-[10px] text-white/40" title="correct (optional)">
                  <input type="radio" name={`ans-${block.id}`} checked={block.predict!.answer_index === i}
                    onChange={() => onChange({ predict: { ...block.predict!, answer_index: i } })} /> ✓
                </label>
                <button className="shrink-0 rounded-lg border border-white/10 px-2 text-white/40 hover:text-red-400"
                  onClick={() => { const opts = block.predict!.options.filter((_, j) => j !== i); onChange({ predict: { ...block.predict!, options: opts.length >= 2 ? opts : block.predict!.options } }); }}>✕</button>
              </div>
            ))}
            <button className="self-start text-xs text-orange-300/80 hover:text-orange-200"
              onClick={() => onChange({ predict: { ...block.predict!, options: [...block.predict!.options, ''] } })}>+ Add option</button>
            <input className={input} value={block.predict.reveal ?? ''} placeholder="Reveal after guessing (optional)"
              onChange={(e) => onChange({ predict: { ...block.predict!, reveal: e.target.value || undefined } })} />
          </div>
        )}
      </div>

      {/* "Which curve?" identify quiz — spec mode only, functions must be lettered */}
      <div className="flex flex-col gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-2">
        <label className="flex items-center gap-2 text-xs text-white/60">
          <input type="checkbox" checked={!!block.identify}
            onChange={(e) => onChange({ identify: e.target.checked ? (block.identify ?? { prompt: '', correct_index: 0, explanation: '' }) : undefined })} />
          <span className={sectionTitle}>“Which curve?” identify quiz</span>
          <span className="text-[10px] text-white/30">— spec mode only</span>
        </label>
        {block.identify && (
          <div className="mt-1 flex flex-col gap-1.5">
            <span className="text-[10px] text-amber-300/70">
              Label each curve above (Functions section) with a LETTER only — A, B, C… — never the equation, or the answer gives itself away.
            </span>
            <input className={input} value={block.identify.prompt} placeholder="Which curve is y = x² − 2?"
              onChange={(e) => onChange({ identify: { ...block.identify!, prompt: e.target.value } })} />
            <label className="flex flex-col gap-0.5">
              <span className="text-[10px] text-white/30">correct curve</span>
              <select className={input} value={block.identify.correct_index}
                onChange={(e) => onChange({ identify: { ...block.identify!, correct_index: Number(e.target.value) } })}>
                {(block.spec?.functions ?? []).map((f, i) => (
                  <option key={i} value={i}>{f.label || `Option ${i + 1}`} — {f.expr}</option>
                ))}
              </select>
            </label>
            <textarea className={`${input} min-h-[60px]`} value={block.identify.explanation}
              placeholder="Explanation shown after any pick — name every curve's real equation"
              onChange={(e) => onChange({ identify: { ...block.identify!, explanation: e.target.value } })} />
          </div>
        )}
      </div>
    </div>
  );
}
