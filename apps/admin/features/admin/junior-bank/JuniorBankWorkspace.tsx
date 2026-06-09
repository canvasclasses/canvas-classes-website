'use client';

// Junior Question Bank — admin authoring surface (grades 6–10).
// Two panes: a filterable question list (left) and an editor form (right).
// Formats: MCQ + assertion_reason, with optional diagram upload. Talks to
// /api/v2/junior-questions (GET/POST/PATCH/DELETE) + the books asset uploader.
//
// NOTE: the route page (app/junior-bank/page.tsx) wraps this in the shared
// <AdminPanel> server auth gate. That shell is intentionally gate-only — the
// header / loading / empty-state chrome below stays per-dashboard because the
// admin panels' chromes are genuinely divergent. See the decision memo:
//   _agents/decisions/2026-06-08-adminpanel-consolidation-memo.md  (Option B)

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import MathRenderer from '@canvas/ui/MathRenderer';
import type {
  JuniorQuestionFormat,
  JuniorConceptTag,
  JuniorQuestionStatus,
} from '@canvas/data/models/JuniorQuestion';

const CONCEPT_TAGS: JuniorConceptTag[] = ['recall', 'concept', 'application', 'reasoning', 'numerical'];
const STATUSES: JuniorQuestionStatus[] = ['published', 'draft', 'flagged'];

// Class 9 Science chemistry chapters (the pilot scope). Editable defaults; the
// bank itself is grade/subject-agnostic.
const CLASS9_SCIENCE_CHAPTERS = [
  { number: 5, slug: 'mixtures-and-separation', title: 'Exploring Mixtures and their Separation' },
  { number: 8, slug: 'structure-of-the-atom', title: 'Journey Inside the Atom' },
  { number: 9, slug: 'atoms-and-molecules', title: 'Atomic Foundations of Matter' },
];

const AR_OPTIONS = [
  'Both Assertion and Reason are true and Reason is the correct explanation of Assertion.',
  'Both Assertion and Reason are true but Reason is NOT the correct explanation of Assertion.',
  'Assertion is true but Reason is false.',
  'Assertion is false but Reason is true.',
];

interface Option { id: string; text: string; is_correct: boolean }
interface QForm {
  _id?: string;
  display_id?: string;
  grade: number;
  subject: string;
  book_slug: string;
  chapter_number: number;
  chapter_slug: string;
  topic: string;
  format: JuniorQuestionFormat;
  question_text: { markdown: string; latex_validated: boolean };
  assertion: string;
  reason: string;
  options: Option[];
  explanation: { markdown: string };
  image_src: string;
  image_prompt: string;
  concept_tag: JuniorConceptTag;
  difficulty: 1 | 2 | 3;
  source: string;
  status: JuniorQuestionStatus;
}

function blankMcqOptions(): Option[] {
  return ['a', 'b', 'c', 'd'].map((id, i) => ({ id, text: '', is_correct: i === 0 }));
}
function arOptions(correct = 0): Option[] {
  return ['a', 'b', 'c', 'd'].map((id, i) => ({ id, text: AR_OPTIONS[i], is_correct: i === correct }));
}

function newForm(seed: Partial<QForm> = {}): QForm {
  return {
    grade: 9,
    subject: 'science',
    book_slug: 'class9-science',
    chapter_number: 5,
    chapter_slug: 'mixtures-and-separation',
    topic: '',
    format: 'mcq',
    question_text: { markdown: '', latex_validated: false },
    assertion: '',
    reason: '',
    options: blankMcqOptions(),
    explanation: { markdown: '' },
    image_src: '',
    image_prompt: '',
    concept_tag: 'concept',
    difficulty: 1,
    source: 'IIT_Foundation_Cl8',
    status: 'published',
    ...seed,
  };
}

function defaultPrefix(f: QForm): string {
  const subj = f.subject.slice(0, 3).toUpperCase();
  return `C${f.grade}${subj}-CH${f.chapter_number}`;
}

interface ListItem {
  _id: string; display_id: string; question_text: { markdown: string };
  format: JuniorQuestionFormat; concept_tag: string; difficulty: number; status: string;
  chapter_number: number;
}

export default function JuniorBankWorkspace() {
  const [grade, setGrade] = useState(9);
  const [subject, setSubject] = useState('science');
  const [chapter, setChapter] = useState(5);
  const [statusFilter, setStatusFilter] = useState('');

  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<QForm | null>(null);
  const [prefix, setPrefix] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const sp = new URLSearchParams({ grade: String(grade), subject, chapter_number: String(chapter), limit: '200' });
      if (statusFilter) sp.set('status', statusFilter);
      const res = await fetch(`/api/v2/junior-questions?${sp}`);
      const data = await res.json();
      setList(data.success ? data.data : []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, [grade, subject, chapter, statusFilter]);

  useEffect(() => { loadList(); }, [loadList]);

  function startNew() {
    const ch = CLASS9_SCIENCE_CHAPTERS.find((c) => c.number === chapter);
    const f = newForm({ grade, subject, chapter_number: chapter, chapter_slug: ch?.slug ?? '' });
    setForm(f);
    setPrefix(defaultPrefix(f));
    setMsg(null);
  }

  async function openQuestion(id: string) {
    setMsg(null);
    const res = await fetch(`/api/v2/junior-questions/${id}`);
    const data = await res.json();
    if (!data.success) { setMsg({ kind: 'err', text: 'Could not load question' }); return; }
    const q = data.data;
    setForm(newForm({
      ...q,
      assertion: q.assertion ?? '',
      reason: q.reason ?? '',
      explanation: q.explanation ?? { markdown: '' },
      image_src: q.image_src ?? '',
      image_prompt: q.image_prompt ?? '',
      topic: q.topic ?? '',
    }));
    setPrefix(defaultPrefix(q));
  }

  function patch(p: Partial<QForm>) { setForm((f) => (f ? { ...f, ...p } : f)); }

  function setOption(i: number, text: string) {
    patch({ options: form!.options.map((o, idx) => (idx === i ? { ...o, text } : o)) });
  }
  function setCorrect(i: number) {
    patch({ options: form!.options.map((o, idx) => ({ ...o, is_correct: idx === i })) });
  }

  function switchFormat(fmt: JuniorQuestionFormat) {
    if (!form) return;
    if (fmt === 'assertion_reason') {
      patch({ format: fmt, options: arOptions(0) });
    } else {
      patch({ format: fmt, options: blankMcqOptions() });
    }
  }

  async function uploadDiagram(file: File) {
    if (!form) return;
    setUploading(true); setMsg(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('book_id', form.book_slug);
      fd.append('chapter_number', String(form.chapter_number));
      fd.append('block_id', form.display_id ?? 'junior-q');
      const res = await fetch('/api/v2/books/assets/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Upload failed');
      patch({ image_src: data.url });
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Upload failed' });
    } finally {
      setUploading(false);
    }
  }

  function validate(f: QForm): string | null {
    if (f.question_text.markdown.trim().length < 3) return 'Question text is required.';
    if (f.format === 'assertion_reason' && (!f.assertion.trim() || !f.reason.trim()))
      return 'Assertion–Reason needs both an assertion and a reason.';
    if (f.options.filter((o) => o.is_correct).length !== 1) return 'Mark exactly one correct option.';
    if (f.options.some((o) => !o.text.trim())) return 'Every option needs text.';
    return null;
  }

  async function save() {
    if (!form) return;
    const err = validate(form);
    if (err) { setMsg({ kind: 'err', text: err }); return; }
    setSaving(true); setMsg(null);

    const payload: Record<string, unknown> = {
      grade: form.grade, subject: form.subject, book_slug: form.book_slug,
      chapter_number: form.chapter_number, chapter_slug: form.chapter_slug,
      topic: form.topic || undefined,
      format: form.format,
      question_text: { markdown: form.question_text.markdown, latex_validated: form.question_text.latex_validated },
      options: form.options,
      explanation: form.explanation,
      concept_tag: form.concept_tag, difficulty: form.difficulty,
      source: form.source, status: form.status,
      image_src: form.image_src || undefined,
      image_prompt: form.image_prompt || undefined,
    };
    if (form.format === 'assertion_reason') { payload.assertion = form.assertion; payload.reason = form.reason; }

    try {
      let res: Response;
      if (form._id) {
        res = await fetch(`/api/v2/junior-questions/${form._id}`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/v2/junior-questions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prefix, question: payload }),
        });
      }
      const data = await res.json();
      if (!data.success) { setMsg({ kind: 'err', text: data.error || 'Save failed' }); return; }
      setMsg({ kind: 'ok', text: form._id ? 'Saved.' : `Created ${data.data.display_id}.` });
      if (!form._id) setForm(newForm({ ...form }));   // keep context for fast entry
      else setForm((f) => (f ? { ...f, ...data.data } : f));
      loadList();
    } catch {
      setMsg({ kind: 'err', text: 'Save failed' });
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!form?._id) return;
    if (!confirm(`Delete ${form.display_id}?`)) return;
    const res = await fetch(`/api/v2/junior-questions/${form._id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) { setForm(null); loadList(); setMsg({ kind: 'ok', text: 'Deleted.' }); }
    else setMsg({ kind: 'err', text: 'Delete failed' });
  }

  const correctIdx = useMemo(() => form?.options.findIndex((o) => o.is_correct) ?? -1, [form]);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-6 flex items-baseline justify-between">
          <div>
            <Link href="/" className="text-xs text-white/40 hover:text-white/70">← Admin home</Link>
            <h1 className="mt-1 text-2xl font-semibold">Junior Question Bank</h1>
            <p className="mt-1 text-sm text-white/50">Grades 6–10 · MCQ + Assertion-Reason · diagram-capable</p>
          </div>
          <button onClick={startNew} className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-sm font-bold text-black hover:opacity-90">
            + New question
          </button>
        </header>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-white/10 bg-[#0B0F15] p-4">
          <Field label="Grade">
            <select value={grade} onChange={(e) => setGrade(Number(e.target.value))} className={selCls}>
              {[6, 7, 8, 9, 10].map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Subject">
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className={`${selCls} w-32`} />
          </Field>
          <Field label="Chapter">
            <select value={chapter} onChange={(e) => setChapter(Number(e.target.value))} className={selCls}>
              {CLASS9_SCIENCE_CHAPTERS.map((c) => <option key={c.number} value={c.number}>Ch {c.number} — {c.title}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selCls}>
              <option value="">All</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <span className="ml-auto text-xs text-white/40">{loading ? 'Loading…' : `${list.length} question${list.length !== 1 ? 's' : ''}`}</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* List */}
          <div className="space-y-2">
            {list.map((q) => (
              <button key={q._id} onClick={() => openQuestion(q._id)}
                className={`block w-full rounded-lg border p-3 text-left transition ${form?._id === q._id ? 'border-orange-400/60 bg-orange-500/10' : 'border-white/10 bg-[#0B0F15] hover:border-white/25'}`}>
                <div className="flex items-center justify-between text-[11px] text-white/40">
                  <span className="font-mono">{q.display_id}</span>
                  <span className="uppercase">{q.format === 'assertion_reason' ? 'A/R' : 'MCQ'} · L{q.difficulty} · {q.concept_tag}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-sm text-white/80">{q.question_text.markdown}</div>
                {q.status !== 'published' && <span className="mt-1 inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-white/50">{q.status}</span>}
              </button>
            ))}
            {!loading && list.length === 0 && <p className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-white/40">No questions yet. Click “New question”.</p>}
          </div>

          {/* Editor */}
          <div>
            {!form ? (
              <div className="rounded-xl border border-dashed border-white/10 p-12 text-center text-white/40">
                Select a question to edit, or create a new one.
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border border-white/10 bg-[#0B0F15] p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/40">{form.display_id ?? '(new)'}</span>
                  <div className="flex gap-2">
                    {(['mcq', 'assertion_reason'] as JuniorQuestionFormat[]).map((fmt) => (
                      <button key={fmt} onClick={() => switchFormat(fmt)}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold ${form.format === fmt ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/40' : 'bg-white/5 text-white/50 border border-white/10'}`}>
                        {fmt === 'mcq' ? 'MCQ' : 'Assertion-Reason'}
                      </button>
                    ))}
                  </div>
                </div>

                {!form._id && (
                  <Field label="display_id prefix">
                    <input value={prefix} onChange={(e) => setPrefix(e.target.value.toUpperCase())} className={`${selCls} w-48 font-mono`} />
                  </Field>
                )}

                {form.format === 'assertion_reason' ? (
                  <>
                    <Labeled label="Assertion (A)"><textarea value={form.assertion} onChange={(e) => patch({ assertion: e.target.value })} className={taCls} rows={2} /></Labeled>
                    <Labeled label="Reason (R)"><textarea value={form.reason} onChange={(e) => patch({ reason: e.target.value })} className={taCls} rows={2} /></Labeled>
                    <Labeled label="Question stem (optional intro)"><textarea value={form.question_text.markdown} onChange={(e) => patch({ question_text: { ...form.question_text, markdown: e.target.value } })} className={taCls} rows={2} placeholder="e.g. Read the Assertion and Reason and choose the correct option." /></Labeled>
                  </>
                ) : (
                  <Labeled label="Question (markdown + LaTeX)"><textarea value={form.question_text.markdown} onChange={(e) => patch({ question_text: { ...form.question_text, markdown: e.target.value } })} className={taCls} rows={3} /></Labeled>
                )}

                {/* Diagram */}
                <div className="rounded-lg border border-white/10 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/60">Diagram (optional)</span>
                    <label className="cursor-pointer rounded-lg bg-white/5 px-3 py-1 text-xs text-white/70 hover:bg-white/10">
                      {uploading ? 'Uploading…' : 'Upload image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDiagram(f); }} />
                    </label>
                  </div>
                  {form.image_src && <img src={form.image_src} alt="diagram" className="mt-2 max-h-48 rounded-lg" />}
                  <input value={form.image_prompt} onChange={(e) => patch({ image_prompt: e.target.value })} placeholder="Or describe a diagram to generate later (image_prompt)…" className={`${selCls} mt-2 w-full`} />
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-white/60">Options — pick the correct one</span>
                  {form.options.map((o, i) => (
                    <div key={o.id} className="flex items-center gap-2">
                      <input type="radio" name="correct" checked={o.is_correct} onChange={() => setCorrect(i)} className="accent-emerald-500" />
                      <span className="w-5 text-xs font-bold text-white/40">{o.id.toUpperCase()}.</span>
                      <input value={o.text} onChange={(e) => setOption(i, e.target.value)} disabled={form.format === 'assertion_reason'}
                        className={`flex-1 ${selCls} ${o.is_correct ? 'border-emerald-500/40' : ''} ${form.format === 'assertion_reason' ? 'opacity-60' : ''}`} />
                    </div>
                  ))}
                </div>

                <Labeled label="Explanation"><textarea value={form.explanation.markdown} onChange={(e) => patch({ explanation: { markdown: e.target.value } })} className={taCls} rows={3} /></Labeled>

                {/* Meta */}
                <div className="flex flex-wrap gap-3">
                  <Field label="Concept tag">
                    <select value={form.concept_tag} onChange={(e) => patch({ concept_tag: e.target.value as JuniorConceptTag })} className={selCls}>
                      {CONCEPT_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Difficulty">
                    <select value={form.difficulty} onChange={(e) => patch({ difficulty: Number(e.target.value) as 1 | 2 | 3 })} className={selCls}>
                      {[1, 2, 3].map((d) => <option key={d} value={d}>L{d}</option>)}
                    </select>
                  </Field>
                  <Field label="Topic">
                    <input value={form.topic} onChange={(e) => patch({ topic: e.target.value })} className={`${selCls} w-44`} placeholder="e.g. chromatography" />
                  </Field>
                  <Field label="Status">
                    <select value={form.status} onChange={(e) => patch({ status: e.target.value as JuniorQuestionStatus })} className={selCls}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Source">
                    <input value={form.source} onChange={(e) => patch({ source: e.target.value })} className={`${selCls} w-44`} />
                  </Field>
                </div>

                {/* Preview */}
                <details className="rounded-lg border border-white/10 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-white/60">Preview</summary>
                  <div className="mt-3 space-y-2 text-sm">
                    {form.format === 'assertion_reason' && (
                      <div className="space-y-1 text-white/80">
                        <p><b>Assertion:</b> <MathRenderer markdown={form.assertion} /></p>
                        <p><b>Reason:</b> <MathRenderer markdown={form.reason} /></p>
                      </div>
                    )}
                    {form.question_text.markdown && <div className="text-white/90"><MathRenderer markdown={form.question_text.markdown} /></div>}
                    {form.image_src && <img src={form.image_src} alt="" className="max-h-40 rounded" />}
                    {form.options.map((o, i) => (
                      <div key={o.id} className={i === correctIdx ? 'text-emerald-300' : 'text-white/70'}>
                        {o.id.toUpperCase()}. <MathRenderer markdown={o.text} /> {i === correctIdx && '✓'}
                      </div>
                    ))}
                  </div>
                </details>

                {msg && <p className={`text-sm ${msg.kind === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>{msg.text}</p>}

                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                  <button onClick={save} disabled={saving} className="rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-bold text-black hover:opacity-90 disabled:opacity-50">
                    {saving ? 'Saving…' : form._id ? 'Save changes' : 'Create question'}
                  </button>
                  {form._id && <button onClick={remove} className="rounded-xl border border-red-500/30 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">Delete</button>}
                  <button onClick={() => setForm(null)} className="ml-auto text-sm text-white/40 hover:text-white/70">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

const selCls = 'rounded-lg border border-white/10 bg-[#151E32] px-3 py-1.5 text-sm text-white/90 focus:border-orange-400/50 focus:outline-none';
const taCls = 'w-full rounded-lg border border-white/10 bg-[#151E32] px-3 py-2 text-sm text-white/90 focus:border-orange-400/50 focus:outline-none font-mono';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-1"><span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>{children}</label>;
}
function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-semibold text-white/60">{label}</span>{children}</label>;
}
