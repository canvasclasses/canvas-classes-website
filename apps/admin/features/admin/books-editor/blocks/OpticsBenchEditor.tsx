'use client';

// Faculty-facing authoring form for the `optics_bench` block — the E4 sibling
// of MechanicsBenchEditor / MotionLabEditor, and the same governance
// deliverable (PHYSICS_SIMULATION_PROGRAM.md §3): a physics teacher builds a
// complete ray-tracing, instrument-assembly or wave-optics exercise here, with
// no code and no deploy. Output is JSON on the block, saved through the
// book-writer gateway. The live preview is the editor's split-pane, rendering
// the very same OpticsBenchRenderer the student sees.
//
// ── WHY THERE IS NO FORM PER ARCHETYPE ──────────────────────────────────────
// The parameter inputs are GENERATED from `archetype.params` metadata
// (`kind: number | boolean | select` plus min/max/step/options/unit), so a new
// archetype ships its own knobs and they appear here automatically without this
// file changing. Hardcoding a form per archetype would undo the whole
// engine-once/exercises-as-data architecture.
//
// Structure: pick an ARCHETYPE (which supplies the bench + step script), tune
// its PARAMS, optionally override the ELEMENTS / SOURCE and what the trace
// SHOWS, then bolt on the gradable layers — predict / numeric.
//
// SIGN CONVENTION: the Cartesian convention NCERT uses — light travels +x,
// distances measured from the pole, +y up, positive focal length = converging
// lens / concave mirror. Every number typed here is in that convention.
//
// NOTE ON NULLS: removing a layer or clearing a field sets it to `undefined` or
// deletes the key — never `null`. Block fields are Mixed-stored but
// Zod-validated with `.optional()`, which REJECTS null; writing null here is
// what makes a page fail to save with an opaque "Invalid input" error.

import { useMemo } from 'react';
import type { OpticsBenchBlock } from '@canvas/data/types/books';
import { OPTICS_ARCHETYPES } from '@canvas/book-renderer/optics-bench';

const input =
  'w-full min-h-[44px] px-2.5 py-2 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'inline-flex min-h-[44px] items-center px-3 py-2 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';
const chk = 'flex min-h-[44px] items-center gap-1.5 text-[11px] text-white/60';

type OpticsMode = OpticsBenchBlock['mode'];
type OpticsElement = NonNullable<OpticsBenchBlock['elements']>[number];
type ElementKind = OpticsElement['kind'];
type OpticsSource = NonNullable<OpticsBenchBlock['source']>;

const MODES: { value: OpticsMode; label: string; hint: string }[] = [
  { value: 'bench', label: 'Ray bench — trace light through the elements', hint: 'The real fan is traced surface by surface, so aberration and a missed ray fall out of the trace.' },
  { value: 'assembler', label: 'Instrument Assembler — build the instrument', hint: 'Lens + aperture + sensor = a camera. Three primitives, six instruments — recognition is by structure.' },
  { value: 'wave', label: 'Wave optics — interference & diffraction', hint: 'Wavelength drives fringe spacing; the bench stops being a ray diagram.' },
];

const MODE_GROUP: Record<OpticsMode, string> = {
  bench: 'Ray bench',
  assembler: 'Instrument Assembler',
  wave: 'Wave optics',
};

const ELEMENT_KINDS: ElementKind[] = [
  'thin-lens', 'thick-lens', 'mirror-spherical', 'mirror-plane',
  'aperture', 'screen', 'prism', 'slab', 'eye', 'grating',
];

// Which optical numbers each element kind actually has. Driven by the frozen
// element-kind enum, NOT by archetype — so a new archetype never touches it,
// and a prism never shows a meaningless "focal length" box.
type OpticalField = 'focal' | 'aperture' | 'radius' | 'n' | 'apex' | 'tilt';
const ELEMENT_FIELDS: Record<ElementKind, OpticalField[]> = {
  'thin-lens': ['focal', 'aperture'],
  'thick-lens': ['focal', 'aperture', 'radius', 'n'],
  'mirror-spherical': ['focal', 'aperture', 'radius', 'tilt'],
  'mirror-plane': ['aperture', 'tilt'],
  aperture: ['aperture'],
  screen: ['aperture'],
  prism: ['apex', 'n', 'tilt'],
  slab: ['n', 'aperture', 'tilt'],
  eye: ['focal', 'aperture'],
  grating: ['aperture'],
};

const OPTICAL_LABEL: Record<OpticalField, string> = {
  focal: 'f (cm)',
  aperture: 'half-height (cm)',
  radius: 'R (cm)',
  n: 'n',
  apex: 'apex (°)',
  tilt: 'tilt (°)',
};

const SOURCE_KINDS: NonNullable<OpticsSource['kind']>[] = ['point', 'extended', 'parallel-beam'];

const SHOW_KEYS = ['constructionRays', 'realFan', 'image', 'labels', 'magnification'] as const;

const SHOW_HINT: Record<(typeof SHOW_KEYS)[number], string> = {
  constructionRays: 'the classic three, dashed where the ray is a virtual back-extension',
  realFan: 'the honest fan — this is what makes spherical aberration visible',
  image: 'the located image',
  labels: 'element and image labels',
  magnification: 'the magnification readout (transverse, and angular where it is the meaningful one)',
};

interface Props {
  block: OpticsBenchBlock;
  onChange: (p: Partial<OpticsBenchBlock>) => void;
}

export default function OpticsBenchEditor({ block, onChange }: Props) {
  const catalog = useMemo(() => toCatalog<ArchetypeCard>(OPTICS_ARCHETYPES), []);
  const current = catalog.find((a) => a.id === block.archetype);
  const show = block.show ?? {};
  const params = block.params ?? {};
  const elements = block.elements ?? [];

  const groups = catalog.reduce<Record<string, ArchetypeCard[]>>((acc, a) => {
    const g = (a.mode && MODE_GROUP[a.mode]) || 'Other';
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
    onChange({
      archetype: id,
      // Params, elements and source all belong to the archetype that declared
      // them — carrying them across would feed one construction another's bench.
      params: undefined,
      elements: undefined,
      source: undefined,
      // `mode` is a required discriminator; only overwrite it with a real value.
      ...(arch?.mode ? { mode: arch.mode } : {}),
    });
  };

  const setParam = (key: string, value: number | string | boolean | undefined) => {
    const next = { ...params };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onChange({ params: Object.keys(next).length ? next : undefined });
  };

  const setElement = (i: number, patch: Partial<OpticsElement>) =>
    onChange({ elements: elements.map((el, k) => (k === i ? { ...el, ...patch } : el)) });

  const setOptical = (i: number, field: OpticalField, raw: string) => {
    const el = { ...elements[i] };
    if (raw === '') delete el[field];
    else el[field] = parseFloat(raw);
    onChange({ elements: elements.map((x, k) => (k === i ? el : x)) });
  };

  const setSource = (patch: Partial<OpticsSource>) =>
    onChange({ source: { ...(block.source ?? { x: -30, y: 2 }), ...patch } });

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

        <div>
          <span className={lbl}>Mode</span>
          <select className={input} value={block.mode} onChange={(e) => onChange({ mode: e.target.value as OpticsMode })}>
            {MODES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] leading-snug text-white/40">
            {MODES.find((m) => m.value === block.mode)?.hint}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="Cover half the lens — what happens to the image?"
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
              placeholder="440"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Surrounding medium n (blank = air, 1.0)</span>
            <input
              type="number"
              step="any"
              className={input}
              value={block.nMedium ?? ''}
              placeholder="1.33 for water"
              onChange={(e) =>
                onChange({ nMedium: e.target.value === '' ? undefined : parseFloat(e.target.value) })
              }
            />
          </div>
        </div>
        {block.nMedium !== undefined && block.nMedium !== 1 && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            The medium is not air, so every focal length in this bench changes. That is the lesson of
            &ldquo;focal length is fixed in water&rdquo; — make sure the exercise asks about it.
          </p>
        )}

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
        {show.realFan === false && (
          <p className="text-[11px] leading-snug text-amber-300/60">
            With the real fan off, only the construction rays are drawn — and &ldquo;the three rays are the only
            light&rdquo; is exactly the misconception this engine exists to break.
          </p>
        )}
      </div>

      {/* ── Parameters (generated from the archetype's own metadata) ── */}
      {current && (current.params?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Bench parameters</span>
            {block.params && (
              <button className={ghostBtn} onClick={() => onChange({ params: undefined })}>
                use defaults
              </button>
            )}
          </div>
          <ParamFields spec={current.params ?? []} values={params} onSet={setParam} />
        </div>
      )}

      {/* ── Elements ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Bench elements</span>
          <div className="flex gap-1.5">
            <button
              className={ghostBtn}
              onClick={() =>
                onChange({
                  elements: [
                    ...elements,
                    { id: `el${elements.length + 1}`, kind: 'thin-lens', x: 0, focal: 15, aperture: 4 },
                  ],
                })
              }
            >
              + element
            </button>
            {elements.length > 0 && (
              <button className={ghostBtn} onClick={() => onChange({ elements: undefined })}>
                use defaults
              </button>
            )}
          </div>
        </div>
        {elements.length === 0 && (
          <p className="text-[11px] text-white/35">
            Using this construction&rsquo;s own bench. Add an element to override it entirely.
          </p>
        )}
        {elements.map((el, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_auto] items-end gap-1.5">
              <div>
                <span className={lbl}>Kind</span>
                <select
                  className={input}
                  value={el.kind}
                  onChange={(e) => setElement(i, { kind: e.target.value as ElementKind })}
                >
                  {ELEMENT_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className={lbl}>x (cm)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={el.x}
                  onChange={(e) => setElement(i, { x: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>y (cm)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={el.y ?? ''}
                  placeholder="0"
                  onChange={(e) =>
                    setElement(i, { y: e.target.value === '' ? undefined : parseFloat(e.target.value) })
                  }
                />
              </div>
              <button
                className="min-h-[44px] px-2 pb-1.5 text-[11px] text-red-400/70 hover:text-red-400"
                onClick={() => {
                  const next = elements.filter((_, k) => k !== i);
                  onChange({ elements: next.length ? next : undefined });
                }}
              >
                remove
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {/* ?? [] — this renders stored author data; an unrecognised kind
                  must not blank the editor with a crash. */}
              {(ELEMENT_FIELDS[el.kind] ?? []).map((f) => (
                <div key={f}>
                  <span className={lbl}>{OPTICAL_LABEL[f]}</span>
                  <input
                    type="number"
                    step="any"
                    className={input}
                    value={el[f] ?? ''}
                    onChange={(e) => setOptical(i, f, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <span className={lbl}>Label</span>
                <input
                  className={input}
                  value={el.label ?? ''}
                  onChange={(e) => setElement(i, { label: e.target.value || undefined })}
                />
              </div>
            </div>
          </div>
        ))}
        {elements.length > 0 && (
          <p className="text-[11px] leading-snug text-white/45">
            Half-height is physical: a ray that arrives beyond it <b>misses</b> the element rather than being
            bent. That is what makes &ldquo;cover half the lens&rdquo; answerable by watching.
          </p>
        )}
      </div>

      {/* ── Source ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Light source</span>
          <button
            className={ghostBtn}
            onClick={() =>
              block.source
                ? onChange({ source: undefined })
                : onChange({ source: { x: -30, y: 2, rays: 3, kind: 'point' } })
            }
          >
            {block.source ? 'use default' : 'override'}
          </button>
        </div>
        {!block.source && (
          <p className="text-[11px] text-white/35">Using this construction&rsquo;s own source.</p>
        )}
        {block.source && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className={lbl}>Object x (cm)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={block.source.x}
                  onChange={(e) => setSource({ x: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>Object height y (cm)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={block.source.y}
                  onChange={(e) => setSource({ y: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>Kind</span>
                <select
                  className={input}
                  value={block.source.kind ?? 'point'}
                  onChange={(e) => setSource({ kind: e.target.value as OpticsSource['kind'] })}
                >
                  {SOURCE_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className={lbl}>Rays to trace</span>
                <input
                  type="number"
                  min={1}
                  className={input}
                  value={block.source.rays ?? ''}
                  placeholder="3"
                  onChange={(e) =>
                    setSource({ rays: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })
                  }
                />
              </div>
              <div>
                <span className={lbl}>Wavelength (nm)</span>
                <input
                  type="number"
                  className={input}
                  value={block.source.wavelength ?? ''}
                  placeholder="589"
                  onChange={(e) =>
                    setSource({ wavelength: e.target.value === '' ? undefined : parseFloat(e.target.value) })
                  }
                />
              </div>
              <div>
                <span className={lbl}>Beam angle (°)</span>
                <input
                  type="number"
                  step="any"
                  className={input}
                  value={block.source.beamAngle ?? ''}
                  placeholder="0"
                  onChange={(e) =>
                    setSource({ beamAngle: e.target.value === '' ? undefined : parseFloat(e.target.value) })
                  }
                />
              </div>
            </div>
          </>
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
                placeholder="Half the lens is covered. What happens to the image?"
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
                Make one wrong option the actual misconception — &ldquo;you get half the image&rdquo; — not an
                obviously silly answer. A trap only teaches if it is tempting.
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
                placeholder="Where does the image form?"
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
                    placeholder="cm"
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
              <p className="text-[11px] leading-snug text-white/45">
                State the sign convention in the reveal. A dropped sign is the single most common error here.
              </p>
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
// A structural mirror of `blocks/optics-bench/types.ts` → `OpticsArchetype`,
// declared locally so this editor depends on the engine's DATA, not on which of
// its types the engine chooses to re-export through the package subpath. Only
// the fields the form actually consumes are listed.

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
  mode?: OpticsMode;
  params?: ParamSpec[];
  defaultSteps?: { say: string; cta: string }[];
  targets?: string;
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
