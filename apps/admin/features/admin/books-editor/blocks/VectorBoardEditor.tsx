'use client';

// Faculty-facing authoring form for the `vector_board` block — the physics
// sibling of MathGraphEditor, and the same governance deliverable
// (PHYSICS_CH0_MATHS_FOR_PHYSICS_PLAN.md §2): a physics teacher builds a full
// interactive vector exercise here, with no code and no deploy. Output is JSON
// on the block, saved through the book-writer gateway. The live preview is the
// editor's split-pane, which renders the very same VectorBoardRenderer the
// student sees.
//
// Structure: pick an ARCHETYPE (the construction), seed its VECTORS, then bolt
// on any of the four gradable exercise layers — predict / target / identify /
// numeric. Each layer is independent; a block may carry none or several.
//
// NOTE ON NULLS: removing a layer sets it to `undefined`, never `null`. Block
// fields are Mixed-stored but Zod-validated with `.optional()`, which rejects
// null — writing null here is what makes a page fail to save with an opaque
// "Invalid input" error.

import type { VectorBoardBlock, VectorSpec, VectorAccent } from '@canvas/data/types/books';
import { ARCHETYPE_CATALOG } from '@canvas/book-renderer/vector-board';

const ACCENTS: VectorAccent[] = ['indigo', 'amber', 'emerald', 'pink', 'red', 'violet', 'ghost'];

const input =
  'w-full px-2 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const lbl = 'text-[11px] text-white/40';
const sectionTitle = 'text-[11px] font-semibold uppercase tracking-wide text-white/50';
const ghostBtn =
  'px-2 py-1 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10';

interface Props {
  block: VectorBoardBlock;
  onChange: (p: Partial<VectorBoardBlock>) => void;
}

const BLANK_VECTOR: VectorSpec = { label: 'C', mag: 4, angle: 45, color: 'emerald', draggable: true };

export default function VectorBoardEditor({ block, onChange }: Props) {
  const current = ARCHETYPE_CATALOG.find((a) => a.id === block.archetype);
  const vectors = block.vectors ?? [];
  const show = block.show ?? {};

  const setVector = (i: number, patch: Partial<VectorSpec>) => {
    const next = vectors.map((v, k) => (k === i ? { ...v, ...patch } : v));
    onChange({ vectors: next });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Construction ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Construction</span>
        <select
          value={block.archetype || ''}
          onChange={(e) => onChange({ archetype: e.target.value })}
          className={input}
        >
          <option value="">— pick a construction —</option>
          {ARCHETYPE_CATALOG.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
        {current && <p className="text-[11px] leading-snug text-white/45">{current.hint}</p>}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={lbl}>Title</span>
            <input
              className={input}
              value={block.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value || undefined })}
              placeholder="Adding two forces"
            />
          </div>
          <div>
            <span className={lbl}>Units (shown on every readout)</span>
            <input
              className={input}
              value={block.units ?? ''}
              onChange={(e) => onChange({ units: e.target.value || undefined })}
              placeholder="N"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {(['grid', 'axes', 'components', 'angleArc', 'readout', 'formula'] as const).map((k) => (
            <label key={k} className="flex items-center gap-1.5 text-[11px] text-white/60">
              <input
                type="checkbox"
                checked={show[k] ?? true}
                onChange={(e) => onChange({ show: { ...show, [k]: e.target.checked } })}
              />
              {k}
            </label>
          ))}
          {current?.stepped && (
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300/80">
              <input
                type="checkbox"
                checked={!!block.guided}
                onChange={(e) => onChange({ guided: e.target.checked || undefined })}
              />
              Guided ({current.stepCount} steps)
            </label>
          )}
        </div>
      </div>

      {/* ── Guided step script ── */}
      {current?.stepped && block.guided && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={sectionTitle}>Step script</span>
            {block.steps ? (
              <button className={ghostBtn} onClick={() => onChange({ steps: undefined })}>use defaults</button>
            ) : (
              <span className="text-[11px] text-white/35">using the built-in script</span>
            )}
          </div>
          <p className="text-[11px] leading-snug text-white/45">
            One entry per click. <b>Say</b> is what the student reads <i>before</i> the element is drawn — teach
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

      {/* ── Vectors ── */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className={sectionTitle}>Vectors</span>
          <div className="flex gap-1.5">
            <button className={ghostBtn} onClick={() => onChange({ vectors: [...vectors, { ...BLANK_VECTOR }] })}>
              + vector
            </button>
            {vectors.length > 0 && (
              <button className={ghostBtn} onClick={() => onChange({ vectors: undefined })}>
                use defaults
              </button>
            )}
          </div>
        </div>
        {vectors.length === 0 && (
          <p className="text-[11px] text-white/35">
            Using this construction&rsquo;s built-in vectors. Add one to override them.
          </p>
        )}
        {vectors.map((v, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-1.5">
              <div>
                <span className={lbl}>Label</span>
                <input className={input} value={v.label} onChange={(e) => setVector(i, { label: e.target.value })} />
              </div>
              <div>
                <span className={lbl}>Magnitude</span>
                <input
                  type="number"
                  className={input}
                  value={v.mag}
                  onChange={(e) => setVector(i, { mag: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>Angle°</span>
                <input
                  type="number"
                  className={input}
                  value={v.angle}
                  onChange={(e) => setVector(i, { angle: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <span className={lbl}>Colour</span>
                <select
                  className={input}
                  value={v.color ?? 'indigo'}
                  onChange={(e) => setVector(i, { color: e.target.value as VectorAccent })}
                >
                  {ACCENTS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-1.5 flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                <input
                  type="checkbox"
                  checked={!!v.draggable}
                  onChange={(e) => setVector(i, { draggable: e.target.checked || undefined })}
                />
                student can drag
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-white/60">
                <input
                  type="checkbox"
                  checked={v.tail === 'chain'}
                  onChange={(e) => setVector(i, { tail: e.target.checked ? 'chain' : undefined })}
                />
                tip-to-tail (start at previous arrow&rsquo;s head)
              </label>
              <button
                className="ml-auto text-[11px] text-red-400/70 hover:text-red-400"
                onClick={() => onChange({ vectors: vectors.filter((_, k) => k !== i) })}
              >
                remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Exercise layers ── */}
      <div className="flex flex-col gap-2">
        <span className={sectionTitle}>Exercise layers</span>

        {/* predict */}
        <LayerBox
          name="Predict first (gates the board)"
          on={!!block.predict}
          add={() => onChange({ predict: { prompt: '', options: ['', ''] } })}
          remove={() => onChange({ predict: undefined })}
        >
          {block.predict && (
            <>
              <input
                className={input}
                placeholder="What will the resultant look like?"
                value={block.predict.prompt}
                onChange={(e) => onChange({ predict: { ...block.predict!, prompt: e.target.value } })}
              />
              {block.predict.options.map((o, i) => (
                <input
                  key={i}
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
            </>
          )}
        </LayerBox>

        {/* target */}
        <LayerBox
          name="Target — drag until it matches (auto-checked)"
          on={!!block.target}
          add={() => onChange({ target: { prompt: '', success: 'That is it.' } })}
          remove={() => onChange({ target: undefined })}
        >
          {block.target && (
            <>
              <input
                className={input}
                placeholder="Drag B so that A + B points due east at 10 N."
                value={block.target.prompt}
                onChange={(e) => onChange({ target: { ...block.target!, prompt: e.target.value } })}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className={lbl}>Goal |R| (blank = don&rsquo;t check)</span>
                  <input
                    type="number"
                    className={input}
                    value={block.target.resultant_mag ?? ''}
                    onChange={(e) =>
                      onChange({
                        target: {
                          ...block.target!,
                          resultant_mag: e.target.value === '' ? undefined : parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <span className={lbl}>Goal direction° (blank = don&rsquo;t check)</span>
                  <input
                    type="number"
                    className={input}
                    value={block.target.resultant_angle ?? ''}
                    onChange={(e) =>
                      onChange({
                        target: {
                          ...block.target!,
                          resultant_angle: e.target.value === '' ? undefined : parseFloat(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <input
                className={input}
                placeholder="Success message"
                value={block.target.success}
                onChange={(e) => onChange({ target: { ...block.target!, success: e.target.value } })}
              />
              <p className="text-[11px] text-white/35">
                At least one vector must be draggable, or the student cannot reach the goal.
              </p>
            </>
          )}
        </LayerBox>

        {/* numeric */}
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
                placeholder="Read the diagram. What is |A + B|?"
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
                    onChange={(e) => onChange({ numeric: { ...block.numeric!, answer: parseFloat(e.target.value) || 0 } })}
                  />
                </div>
                <div>
                  <span className={lbl}>Tolerance</span>
                  <input
                    type="number"
                    className={input}
                    value={block.numeric.tolerance ?? ''}
                    placeholder="0.1"
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

        {/* identify */}
        <LayerBox
          name="Identify — which diagram is right?"
          on={!!block.identify}
          add={() =>
            onChange({
              identify: {
                prompt: '',
                options: [
                  { vectors: [{ label: 'A', mag: 5, angle: 0 }] },
                  { vectors: [{ label: 'A', mag: 5, angle: 180 }] },
                ],
                correct_index: 0,
                explanation: '',
              },
            })
          }
          remove={() => onChange({ identify: undefined })}
        >
          {block.identify && (
            <>
              <input
                className={input}
                placeholder="Which diagram correctly shows P − Q?"
                value={block.identify.prompt}
                onChange={(e) => onChange({ identify: { ...block.identify!, prompt: e.target.value } })}
              />
              <p className="text-[11px] leading-snug text-amber-300/60">
                Diagrams are labelled A, B, C… automatically. Make the wrong ones real traps — a reversed
                subtraction, a resultant drawn tail-to-tail — not obviously silly.
              </p>
              {block.identify.options.map((opt, oi) => (
                <div key={oi} className="rounded-lg border border-white/10 bg-white/[0.02] p-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white/60">
                      {String.fromCharCode(65 + oi)}
                      {block.identify!.correct_index === oi && (
                        <span className="ml-2 text-emerald-400/80">correct</span>
                      )}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        className={ghostBtn}
                        onClick={() => onChange({ identify: { ...block.identify!, correct_index: oi } })}
                      >
                        mark correct
                      </button>
                      <button
                        className={ghostBtn}
                        onClick={() =>
                          onChange({
                            identify: {
                              ...block.identify!,
                              options: [
                                ...block.identify!.options.slice(0, oi + 1),
                                { vectors: opt.vectors.map((v) => ({ ...v })) },
                                ...block.identify!.options.slice(oi + 1),
                              ],
                            },
                          })
                        }
                      >
                        duplicate
                      </button>
                    </div>
                  </div>
                  {opt.vectors.map((v, vi) => (
                    <div key={vi} className="mb-1 grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-1.5">
                      <input
                        className={input}
                        value={v.label}
                        placeholder="label"
                        onChange={(e) => patchIdentifyVector(block, onChange, oi, vi, { label: e.target.value })}
                      />
                      <input
                        type="number"
                        className={input}
                        value={v.mag}
                        onChange={(e) =>
                          patchIdentifyVector(block, onChange, oi, vi, { mag: parseFloat(e.target.value) || 0 })
                        }
                      />
                      <input
                        type="number"
                        className={input}
                        value={v.angle}
                        onChange={(e) =>
                          patchIdentifyVector(block, onChange, oi, vi, { angle: parseFloat(e.target.value) || 0 })
                        }
                      />
                      <label className="flex items-center gap-1 text-[10px] text-white/50">
                        <input
                          type="checkbox"
                          checked={v.tail === 'chain'}
                          onChange={(e) =>
                            patchIdentifyVector(block, onChange, oi, vi, {
                              tail: e.target.checked ? 'chain' : undefined,
                            })
                          }
                        />
                        chain
                      </label>
                    </div>
                  ))}
                  <button
                    className={ghostBtn}
                    onClick={() =>
                      onChange({
                        identify: {
                          ...block.identify!,
                          options: block.identify!.options.map((o, k) =>
                            k === oi ? { ...o, vectors: [...o.vectors, { label: 'B', mag: 4, angle: 90 }] } : o
                          ),
                        },
                      })
                    }
                  >
                    + arrow
                  </button>
                </div>
              ))}
              <textarea
                className={input}
                rows={2}
                placeholder="Explanation — name what EVERY diagram actually shows, not just the right one"
                value={block.identify.explanation}
                onChange={(e) => onChange({ identify: { ...block.identify!, explanation: e.target.value } })}
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

function patchIdentifyVector(
  block: VectorBoardBlock,
  onChange: Props['onChange'],
  oi: number,
  vi: number,
  patch: Partial<VectorSpec>
) {
  if (!block.identify) return;
  onChange({
    identify: {
      ...block.identify,
      options: block.identify.options.map((o, k) =>
        k === oi ? { ...o, vectors: o.vectors.map((v, j) => (j === vi ? { ...v, ...patch } : v)) } : o
      ),
    },
  });
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
        <button
          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          onClick={on ? remove : add}
        >
          {on ? 'remove' : 'add'}
        </button>
      </div>
      {on && <div className="mt-2 flex flex-col gap-1.5">{children}</div>}
    </div>
  );
}
