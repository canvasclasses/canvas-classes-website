'use client';

// Faculty-facing authoring form for the `field_bench` block — the E5 sibling of
// MechanicsBenchEditor / MotionLabEditor, and the same governance deliverable
// (PHYSICS_SIMULATION_PROGRAM.md §3): a physics teacher builds a complete
// field-sculpting, Gauss, trajectory or photoelectric exercise here, with no
// code and no deploy. Output is JSON on the block, saved through the
// book-writer gateway. The live preview is the editor's split-pane, rendering
// the very same FieldBenchRenderer the student sees.
//
// ── WHY THERE IS NO FORM PER ARCHETYPE ──────────────────────────────────────
// The parameter inputs are GENERATED from `archetype.params` metadata
// (`kind: number | boolean | select` plus min/max/step/options/unit), so a new
// archetype ships its own knobs and they appear here automatically without this
// file changing. Hardcoding a form per archetype would undo the whole
// engine-once/exercises-as-data architecture.
//
// Structure: pick an ARCHETYPE (which supplies the scene + step script), tune
// its PARAMS, optionally override the SOURCES / GAUSS SURFACES and what the
// bench SHOWS, then bolt on the gradable layers — predict / numeric.
//
// NOTE ON NULLS: removing a layer or clearing a field sets it to `undefined` or
// deletes the key — never `null`. Block fields are Mixed-stored but
// Zod-validated with `.optional()`, which REJECTS null; writing null here is
// what makes a page fail to save with an opaque "Invalid input" error.

import { useMemo } from 'react';
import type { FieldBenchBlock } from '@canvas/data/types/books';
import { FIELD_ARCHETYPES } from '@canvas/book-renderer/field-bench';

const input =
  'w-full min-h-[44px] px-2.5 py-2 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'inline-flex min-h-[44px] items-center px-3 py-2 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';
const chk = 'flex min-h-[44px] items-center gap-1.5 text-[11px] text-white/60';

type FieldKind = FieldBenchBlock['kind'];
type FieldMode = FieldBenchBlock['mode'];
type FieldSource = NonNullable<FieldBenchBlock['sources']>[number];
type SourceKind = FieldSource['kind'];
type GaussSurface = NonNullable<FieldBenchBlock['surfaces']>[number];

const KINDS: { value: FieldKind; label: string }[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'magnetic', label: 'Magnetic' },
  { value: 'gravitational', label: 'Gravitational' },
];

const MODES: { value: FieldMode; label: string; hint: string }[] = [
  { value: 'sculptor', label: 'Field sculptor — drag sources, watch the field', hint: 'Field lines and equipotentials are always perpendicular; moving a charge shows it holding everywhere.' },
  { value: 'gauss', label: 'Gauss surface — drag it, watch the flux', hint: 'Flux depends only on the enclosed charge. Dragging the surface and seeing it NOT change is the lesson.' },
  { value: 'trajectory', label: 'Trajectory — release a test charge', hint: 'A charge does not follow the field line. The path comes from the same RK4 integrator as a projectile.' },
  { value: 'photoelectric', label: 'Photoelectric — stopping potential', hint: 'Intensity changes the current, frequency changes the stopping potential.' },
];

const KIND_LABEL: Record<FieldKind, string> = {
  electric: 'Electric',
  magnetic: 'Magnetic',
  gravitational: 'Gravitational',
};

// Exhaustive over FieldMode on purpose: adding a mode to the union without a
// label here is a compile error, not a silently blank picker row.
const MODE_LABEL: Record<FieldMode, string> = {
  sculptor: 'Field sculptor',
  gauss: 'Gauss surface',
  trajectory: 'Trajectory',
  photoelectric: 'Photoelectric',
  emi: 'Electromagnetic induction',
};

const SOURCE_KINDS: SourceKind[] = [
  'point-charge', 'dipole', 'line-charge', 'sheet-charge', 'ring-charge',
  'point-mass', 'current-wire', 'current-loop', 'solenoid', 'bar-magnet',
  'uniform-E', 'uniform-B',
];

// What `strength` means for each source. Driven by the frozen source-kind enum,
// NOT by archetype — a source that says "C" when it holds amperes is a physics
// error the student will carry into the exam.
const STRENGTH_UNIT: Record<SourceKind, string> = {
  'point-charge': 'C',
  dipole: 'C·m',
  'line-charge': 'C/m',
  'sheet-charge': 'C/m²',
  'ring-charge': 'C',
  'point-mass': 'kg',
  'current-wire': 'A',
  'current-loop': 'A',
  solenoid: 'A',
  'bar-magnet': 'A·m²',
  'uniform-E': 'V/m',
  'uniform-B': 'T',
};

// Which geometry numbers each source kind actually has.
type GeomField = 'angle' | 'radius' | 'length';
const SOURCE_GEOMETRY: Record<SourceKind, GeomField[]> = {
  'point-charge': [],
  dipole: ['angle', 'length'],
  'line-charge': ['angle', 'length'],
  'sheet-charge': ['angle', 'length'],
  'ring-charge': ['radius', 'angle'],
  'point-mass': [],
  'current-wire': ['angle', 'length'],
  'current-loop': ['radius', 'angle'],
  solenoid: ['radius', 'length', 'angle'],
  'bar-magnet': ['length', 'angle'],
  'uniform-E': ['angle'],
  'uniform-B': ['angle'],
};

const GEOM_LABEL: Record<GeomField, string> = {
  angle: 'angle (°)',
  radius: 'radius (m)',
  length: 'length (m)',
};

const SHOW_KEYS = ['fieldLines', 'equipotentials', 'vectors', 'flux', 'magnitudeHeatmap'] as const;

const SHOW_HINT: Record<(typeof SHOW_KEYS)[number], string> = {
  fieldLines: 'streamlines from each source',
  equipotentials: 'the contours — always perpendicular to the field lines',
  vectors: 'the sampled vector grid',
  flux: 'the flux readout for each closed surface',
  magnitudeHeatmap: 'shade the plane by |field|',
};

interface Props {
  block: FieldBenchBlock;
  onChange: (p: Partial<FieldBenchBlock>) => void;
}

export default function FieldBenchEditor({ block, onChange }: Props) {
  const catalog = useMemo(() => toCatalog<ArchetypeCard>(FIELD_ARCHETYPES), []);
  const current = catalog.find((a) => a.id === block.archetype);
  const show = block.show ?? {};
  const params = block.params ?? {};
  const sources = block.sources ?? [];
  const surfaces = block.surfaces ?? [];

  // `kind` is a block discriminator but the archetype contract does not declare
  // it — the scene carries it. Prefer a field if the engine ships one, else ask
  // the archetype to build its scene. build() is pure, so this is cheap — but it
  // is other-agent code, so a throw must degrade to "unknown kind", never break
  // the editor.
  const kindById = useMemo(() => {
    const map = new Map<string, FieldKind>();
    for (const a of catalog) {
      if (a.kind) {
        map.set(a.id, a.kind);
        continue;
      }
      try {
        const k = a.build?.()?.kind;
        if (k) map.set(a.id, k);
      } catch {
        /* leave unmapped — the group falls back to mode only */
      }
    }
    return map;
  }, [catalog]);

  const groups = catalog.reduce<Record<string, ArchetypeCard[]>>((acc, a) => {
    const k = kindById.get(a.id);
    const g = [k ? KIND_LABEL[k] : null, a.mode ? MODE_LABEL[a.mode] : null].filter(Boolean).join(' · ') || 'Other';
    (acc[g] ??= []).push(a);
    return acc;
  }, {});

  const pickArchetype = (id: string) => {
    if (!id) {
      // Clear by omitting the key, never by writing null.
      onChange({ archetype: undefined, params: undefined });
      return;
    }
    const arch = catalog.find((a) => a.id === id);
    const k = kindById.get(id);
    onChange({
      archetype: id,
      // Params, sources and surfaces all belong to the archetype that declared
      // them — carrying them across would feed one construction another's scene.
      params: undefined,
      sources: undefined,
      surfaces: undefined,
      // `kind` and `mode` are required discriminators; only overwrite them with
      // a real value, never with undefined.
      ...(k ? { kind: k } : {}),
      ...(arch?.mode ? { mode: arch.mode } : {}),
    });
  };

  const setParam = (key: string, value: number | string | boolean | undefined) => {
    const next = { ...params };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange({ params: Object.keys(next).length ? next : undefined });
  };

  const setSource = (i: number, patch: Partial<FieldSource>) =>
    onChange({ sources: sources.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  const setGeom = (i: number, field: GeomField, raw: string) => {
    const s = { ...sources[i] };
    if (raw === '') delete s[field];
    else s[field] = parseFloat(raw);
    onChange({ sources: sources.map((x, k) => (k === i ? s : x)) });
  };

  const setSurface = (i: number, patch: Partial<GaussSurface>) =>
    onChange({ surfaces: surfaces.map((s, k) => (k === i ? { ...s, ...patch } : s)) });

  const setSurfaceNum = (i: number, field: 'radius' | 'w' | 'h', raw: string) => {
    const s = { ...surfaces[i] };
    if (raw === '') delete s[field];
    else s[field] = parseFloat(raw);
    onChange({ surfaces: surfaces.map((x, k) => (k === i ? s : x)) });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Construction ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Construction</span>
        <select value={block.archetype || ''} onChange={(e) => pickArchetype(e.target.value)} className={input}>
          <option value="">— pick a construction —</option>
          {Object.entries(groups).map(([group, list]) => (
            <optgroup key={group} label={group}>
              {list.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {current && <p className="text-[11px] leading-snug text-white/45">{current.summary}</p>}
        {current?.targets && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            Attacks the misconception <code>{current.targets}</code>.
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Field</span>
            <select
              className={input}
              value={block.kind}
              onChange={(e) => onChange({ kind: e.target.value as FieldKind })}
            >
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>
                  {k.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <span className={lbl}>Mode</span>
            <select
              className={input}
              value={block.mode}
              onChange={(e) => onChange({ mode: e.target.value as FieldMode })}
            >
              {MODES.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-[11px] leading-snug text-white/40">{MODES.find((m) => m.value === block.mode)?.hint}</p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="Drag the surface — the flux does not move"
            />
          </div>
          <div>
            <span className={lbl}>Height (px — blank = default)</span>
            <input
              type="number"
              className={input}
              value={block.height ?? ''}
              onChange={(e) =>
                onChange({ height: e.target.value === '' ? undefined : parseInt(e.target.value, 10) || undefined })
              }
              placeholder="480"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {SHOW_KEYS.map((k) => (
            <label key={k} className={chk} title={SHOW_HINT[k]}>
              <input
                type="checkbox"
                checked={show[k] ?? true}
                onChange={(e) => onChange({ show: { ...show, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
          <label className={chk}>
            <input
              type="checkbox"
              checked={!!block.allow_drag_surface}
              onChange={(e) => onChange({ allow_drag_surface: e.target.checked || undefined })}
            />
            let the student drag the Gauss surface
          </label>
          {current && (
            <label className="flex min-h-[44px] items-center gap-1.5 text-[11px] font-semibold text-amber-300/80">
              <input
                type="checkbox"
                checked={!!block.guided}
                onChange={(e) => onChange({ guided: e.target.checked || undefined })}
              />
              Guided{current.defaultSteps?.length ? ` (${current.defaultSteps.length} steps)` : ''}
            </label>
          )}
        </div>
        {block.mode === 'gauss' && !block.allow_drag_surface && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            Dragging the surface and watching the flux <i>not</i> change <b>is</b> the Gauss lesson. Leave dragging
            off only if a later exercise on the same page asks the student to predict it first.
          </p>
        )}
        {block.kind === 'magnetic' && show.equipotentials !== false && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            There is no scalar magnetic potential — equipotentials are meaningless for a magnetic field. Turn that
            switch off for this block.
          </p>
        )}
      </div>

      {/* ── Parameters (generated from the archetype's own metadata) ── */}
      {current && (current.params?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Scene parameters</span>
            {block.params && (
              <button className={ghostBtn} onClick={() => onChange({ params: undefined })}>
                use defaults
              </button>
            )}
          </div>
          <ParamFields spec={current.params ?? []} values={params} onSet={setParam} />
        </div>
      )}

      {/* ── Sources ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Sources</span>
          <div className="flex gap-1.5">
            <button
              className={ghostBtn}
              onClick={() =>
                onChange({
                  sources: [
                    ...sources,
                    { id: `s${sources.length + 1}`, kind: 'point-charge', x: 0, y: 0, strength: 1e-9 },
                  ],
                })
              }
            >
              + source
            </button>
            {sources.length > 0 && (
              <button className={ghostBtn} onClick={() => onChange({ sources: undefined })}>
                use defaults
              </button>
            )}
          </div>
        </div>
        {sources.length === 0 && (
          <p className="text-[11px] text-white/35">
            Using this construction&rsquo;s own sources. Add one to override them entirely.
          </p>
        )}
        {sources.map((s, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="grid grid-cols-[1.7fr_1fr_1fr_auto] items-end gap-1.5">
              <div>
                <span className={lbl}>Kind</span>
                <select
                  className={input}
                  value={s.kind}
                  onChange={(e) => setSource(i, { kind: e.target.value as SourceKind })}
                >
                  {SOURCE_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className={lbl}>x (m)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={s.x}
                  onChange={(e) => setSource(i, { x: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>y (m)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={s.y}
                  onChange={(e) => setSource(i, { y: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <button
                className="min-h-[44px] px-2 pb-1.5 text-[11px] text-red-400/70 hover:text-red-400"
                onClick={() => {
                  const next = sources.filter((_, k) => k !== i);
                  onChange({ sources: next.length ? next : undefined });
                }}
              >
                remove
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              <div>
                <span className={lbl}>strength ({STRENGTH_UNIT[s.kind] ?? '—'})</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={s.strength}
                  onChange={(e) => setSource(i, { strength: parseFloat(e.target.value) || 0 })}
                />
              </div>
              {/* ?? [] — this renders stored author data; an unrecognised kind
                  must not blank the editor with a crash. */}
              {(SOURCE_GEOMETRY[s.kind] ?? []).map((f) => (
                <div key={f}>
                  <span className={lbl}>{GEOM_LABEL[f]}</span>
                  <input
                    type="number"
                    step="any"
                    className={input}
                    value={s[f] ?? ''}
                    onChange={(e) => setGeom(i, f, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <span className={lbl}>Label</span>
                <input
                  className={input}
                  value={s.label ?? ''}
                  onChange={(e) => setSource(i, { label: e.target.value || undefined })}
                />
              </div>
            </div>
            <label className={chk}>
              <input
                type="checkbox"
                checked={!!s.fixed}
                onChange={(e) => setSource(i, { fixed: e.target.checked || undefined })}
              />
              fixed — the student cannot drag this one
            </label>
          </div>
        ))}
        {sources.some((s) => s.strength < 0) && block.kind === 'gravitational' && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            A negative mass is not physics. Gravitational sources should have positive strength.
          </p>
        )}
      </div>

      {/* ── Gauss surfaces ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Closed surfaces</span>
          <div className="flex gap-1.5">
            <button
              className={ghostBtn}
              onClick={() =>
                onChange({
                  surfaces: [
                    ...surfaces,
                    { id: `g${surfaces.length + 1}`, shape: 'circle', x: 0, y: 0, radius: 1 },
                  ],
                })
              }
            >
              + surface
            </button>
            {surfaces.length > 0 && (
              <button className={ghostBtn} onClick={() => onChange({ surfaces: undefined })}>
                use defaults
              </button>
            )}
          </div>
        </div>
        {surfaces.length === 0 && (
          <p className="text-[11px] text-white/35">
            Using this construction&rsquo;s own surfaces. Add one to override them entirely.
          </p>
        )}
        {surfaces.map((sf, i) => (
          <div
            key={i}
            className="grid grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto] items-end gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2"
          >
            <div>
              <span className={lbl}>Shape</span>
              <select
                className={input}
                value={sf.shape}
                onChange={(e) => setSurface(i, { shape: e.target.value as GaussSurface['shape'] })}
              >
                <option value="circle">circle</option>
                <option value="rectangle">rectangle</option>
              </select>
            </div>
            <div>
              <span className={lbl}>x (m)</span>
              <input
                type="number"
                step="any"
                className={input}
                value={sf.x}
                onChange={(e) => setSurface(i, { x: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <span className={lbl}>y (m)</span>
              <input
                type="number"
                step="any"
                className={input}
                value={sf.y}
                onChange={(e) => setSurface(i, { y: parseFloat(e.target.value) || 0 })}
              />
            </div>
            {sf.shape === 'circle' ? (
              <>
                <div>
                  <span className={lbl}>radius (m)</span>
                  <input
                    type="number"
                    step="any"
                    className={input}
                    value={sf.radius ?? ''}
                    onChange={(e) => setSurfaceNum(i, 'radius', e.target.value)}
                  />
                </div>
                <div>
                  <span className={lbl}>Label</span>
                  <input
                    className={input}
                    value={sf.label ?? ''}
                    onChange={(e) => setSurface(i, { label: e.target.value || undefined })}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className={lbl}>w (m)</span>
                  <input
                    type="number"
                    step="any"
                    className={input}
                    value={sf.w ?? ''}
                    onChange={(e) => setSurfaceNum(i, 'w', e.target.value)}
                  />
                </div>
                <div>
                  <span className={lbl}>h (m)</span>
                  <input
                    type="number"
                    step="any"
                    className={input}
                    value={sf.h ?? ''}
                    onChange={(e) => setSurfaceNum(i, 'h', e.target.value)}
                  />
                </div>
              </>
            )}
            <button
              className="min-h-[44px] px-2 pb-1.5 text-[11px] text-red-400/70 hover:text-red-400"
              onClick={() => {
                const next = surfaces.filter((_, k) => k !== i);
                onChange({ surfaces: next.length ? next : undefined });
              }}
            >
              remove
            </button>
          </div>
        ))}
        {surfaces.length > 0 && (
          <p className="text-[11px] leading-snug text-white/45">
            A circle here is a sphere per unit length in this 2-D reduction — the bench says so rather than
            fudging it. Two surfaces of different shapes around the same charge is the strongest version of
            this exercise.
          </p>
        )}
      </div>

      {/* ── Guided step script ── */}
      {block.guided && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Step script</span>
            {block.steps ? (
              <button className={ghostBtn} onClick={() => onChange({ steps: undefined })}>
                use defaults
              </button>
            ) : (
              <span className="text-[11px] text-white/35">using the built-in script</span>
            )}
          </div>
          <p className="text-[11px] leading-snug text-white/45">
            One entry per click. <b>Say</b> is what the student reads <i>before</i> the element appears — teach
            here, don&rsquo;t narrate. <b>Button</b> is the action label.
          </p>
          {(block.steps ?? []).map((st, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
              <span className={lbl}>Step {i + 1} — say</span>
              <textarea
                className={input}
                rows={2}
                value={st.say}
                onChange={(e) =>
                  onChange({ steps: (block.steps ?? []).map((x, k) => (k === i ? { ...x, say: e.target.value } : x)) })
                }
              />
              <span className={lbl}>Button label</span>
              <input
                className={input}
                value={st.cta}
                onChange={(e) =>
                  onChange({ steps: (block.steps ?? []).map((x, k) => (k === i ? { ...x, cta: e.target.value } : x)) })
                }
              />
            </div>
          ))}
          <button
            className={ghostBtn}
            onClick={() => onChange({ steps: [...(block.steps ?? []), { say: '', cta: 'Next' }] })}
          >
            + step
          </button>
        </div>
      )}

      {/* ── Exercise layers ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Exercise layers</span>

        <LayerBox
          name="Predict first (gates the bench)"
          on={!!block.predict}
          add={() => onChange({ predict: { prompt: '', options: ['', ''] } })}
          remove={() => onChange({ predict: undefined })}
        >
          {block.predict && (
            <>
              <input
                className={input}
                placeholder="Move the charge off-centre inside the surface. What happens to the flux?"
                value={block.predict.prompt}
                onChange={(e) => onChange({ predict: { ...block.predict!, prompt: e.target.value } })}
              />
              {block.predict.options.map((o, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className={input}
                    placeholder={`Option ${i + 1}`}
                    value={o}
                    onChange={(e) =>
                      onChange({
                        predict: {
                          ...block.predict!,
                          options: block.predict!.options.map((x, k) => (k === i ? e.target.value : x)),
                        },
                      })
                    }
                  />
                  <label className="flex min-h-[44px] shrink-0 items-center gap-1 text-[10px] text-white/50">
                    <input
                      type="radio"
                      checked={block.predict!.answer_index === i}
                      onChange={() => onChange({ predict: { ...block.predict!, answer_index: i } })}
                    />
                    correct
                  </label>
                </div>
              ))}
              <button
                className={ghostBtn}
                onClick={() => onChange({ predict: { ...block.predict!, options: [...block.predict!.options, ''] } })}
              >
                + option
              </button>
              <input
                className={input}
                placeholder="Reveal (shown after the guess)"
                value={block.predict.reveal ?? ''}
                onChange={(e) => onChange({ predict: { ...block.predict!, reveal: e.target.value || undefined } })}
              />
              <p className="text-[11px] leading-snug text-amber-300/60">
                Make one wrong option the actual misconception — &ldquo;the flux goes up on the near side&rdquo;
                — not an obviously silly answer. A trap only teaches if it is tempting.
              </p>
            </>
          )}
        </LayerBox>

        <LayerBox
          name="Numeric — type the answer"
          on={!!block.numeric}
          add={() => onChange({ numeric: { prompt: '', answer: 0, worked_reveal: '' } })}
          remove={() => onChange({ numeric: undefined })}
        >
          {block.numeric && (
            <>
              <input
                className={input}
                placeholder="What is the flux through the surface?"
                value={block.numeric.prompt}
                onChange={(e) => onChange({ numeric: { ...block.numeric!, prompt: e.target.value } })}
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className={lbl}>Answer</span>
                  <input
                    type="number"
                    className={input}
                    value={block.numeric.answer}
                    onChange={(e) =>
                      onChange({ numeric: { ...block.numeric!, answer: parseFloat(e.target.value) || 0 } })
                    }
                  />
                </div>
                <div>
                  <span className={lbl}>Tolerance</span>
                  <input
                    type="number"
                    className={input}
                    placeholder="0.05"
                    value={block.numeric.tolerance ?? ''}
                    onChange={(e) =>
                      onChange({
                        numeric: {
                          ...block.numeric!,
                          tolerance: e.target.value === '' ? undefined : parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <span className={lbl}>Unit</span>
                  <input
                    className={input}
                    placeholder="N·m²/C"
                    value={block.numeric.unit ?? ''}
                    onChange={(e) => onChange({ numeric: { ...block.numeric!, unit: e.target.value || undefined } })}
                  />
                </div>
              </div>
              <textarea
                className={input}
                rows={2}
                placeholder="Worked reveal — the full substitution, shown after they answer"
                value={block.numeric.worked_reveal}
                onChange={(e) => onChange({ numeric: { ...block.numeric!, worked_reveal: e.target.value } })}
              />
            </>
          )}
        </LayerBox>
      </div>

      <div>
        <span className={lbl}>Caption</span>
        <input
          className={input}
          value={block.caption ?? ''}
          onChange={(e) => onChange({ caption: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}

// ── Archetype catalogue shape ────────────────────────────────────────────────
// A structural mirror of `blocks/field-bench/types.ts` → `FieldArchetype`,
// declared locally so this editor depends on the engine's DATA, not on which of
// its types the engine chooses to re-export through the package subpath. Only
// the fields the form actually consumes are listed. `kind` is optional because
// the contract puts it on the built scene, not on the archetype.

type ParamSpec = {
  key: string;
  label: string;
  kind: 'number' | 'boolean' | 'select';
  default: number | boolean | string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  unit?: string;
};

type ArchetypeCard = {
  id: string;
  title: string;
  summary: string;
  mode?: FieldMode;
  kind?: FieldKind;
  params?: ParamSpec[];
  defaultSteps?: { say: string; cta: string }[];
  targets?: string;
  build?: (p?: Record<string, number | string | boolean>) => { kind?: FieldKind } | undefined;
};

/** The engine may publish its catalogue as an array or as an id-keyed map.
 *  Accept either — this editor only ever iterates it. */
function toCatalog<T>(src: unknown): T[] {
  if (Array.isArray(src)) return src as T[];
  if (src && typeof src === 'object') return Object.values(src as Record<string, T>);
  return [];
}

// ── Generated parameter inputs ───────────────────────────────────────────────
// One input per knob the archetype declares. Nothing here knows what any
// individual archetype is about — that is the point.

function ParamFields({
  spec,
  values,
  onSet,
}: {
  spec: ParamSpec[];
  values: Record<string, number | string | boolean>;
  onSet: (key: string, value: number | string | boolean | undefined) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {spec.map((p) => {
        const value = values[p.key] ?? p.default;
        const overridden = Object.prototype.hasOwnProperty.call(values, p.key);
        return (
          <div key={p.key} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="flex items-baseline justify-between">
              <span className={lbl}>
                {p.label}
                {p.unit ? ` (${p.unit})` : ''}
              </span>
              {overridden && (
                <button
                  className="min-h-[44px] px-2 text-[10px] text-white/45 hover:text-white/70"
                  onClick={() => onSet(p.key, undefined)}
                >
                  reset
                </button>
              )}
            </div>

            {p.kind === 'boolean' && (
              <label className={chk}>
                <input type="checkbox" checked={value === true} onChange={(e) => onSet(p.key, e.target.checked)} />
                {value === true ? 'on' : 'off'}
              </label>
            )}

            {p.kind === 'select' && (
              <select className={input} value={String(value)} onChange={(e) => onSet(p.key, e.target.value)}>
                {(p.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            )}

            {p.kind === 'number' && (
              <>
                <input
                  type="number"
                  className={input}
                  min={p.min}
                  max={p.max}
                  step={p.step ?? 'any'}
                  value={typeof value === 'number' ? value : Number(value) || 0}
                  onChange={(e) => onSet(p.key, e.target.value === '' ? undefined : parseFloat(e.target.value))}
                />
                {(p.min !== undefined || p.max !== undefined) && (
                  <p className="mt-0.5 text-[10px] text-white/45">
                    {p.min ?? '−∞'} … {p.max ?? '∞'}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LayerBox({
  name,
  on,
  add,
  remove,
  children,
}: {
  name: string;
  on: boolean;
  add: () => void;
  remove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-white/10 p-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-white/60">{name}</span>
        <button className={ghostBtn} onClick={on ? remove : add}>
          {on ? 'remove' : 'add'}
        </button>
      </div>
      {on && <div className="mt-2 flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
