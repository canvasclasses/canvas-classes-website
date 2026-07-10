'use client';

import { useRef, useState } from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import { YouSolveItBlock, YouSolveItSolution } from '@canvas/data/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props {
  block: YouSolveItBlock;
  onChange: (p: Partial<YouSolveItBlock>) => void;
  onUpload?: UploadFn;
}

const INPUT =
  'w-full px-3 py-1.5 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white ' +
  'placeholder-white/25 focus:outline-none focus:border-orange-500/40';
const AREA =
  'w-full px-3 py-2 bg-[#0B0F15] border border-white/10 rounded-lg text-sm text-white ' +
  'placeholder-white/25 resize-y focus:outline-none focus:border-orange-500/40';

function newId() {
  try { return crypto.randomUUID(); } catch { return `sol-${Date.now()}-${Math.round(Math.random() * 1e6)}`; }
}

export default function YouSolveItEditor({ block, onChange, onUpload }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const solutions = block.solutions ?? [];

  async function handleFile(file: File) {
    if (!onUpload) return;
    if (!file.type.startsWith('image/')) { setUploadError('Please select an image file.'); return; }
    setUploading(true);
    setUploadError('');
    try {
      const url = await onUpload(file, block.id);
      onChange({ image_src: url });
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function updateSolution(i: number, patch: Partial<YouSolveItSolution>) {
    const next = solutions.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange({ solutions: next });
  }
  function addSolution() {
    if (solutions.length >= 4) return;
    onChange({ solutions: [...solutions, { id: newId(), label: '', upside: '', tradeoff: '' }] });
  }
  function removeSolution(i: number) {
    if (solutions.length <= 2) return; // schema minimum
    onChange({ solutions: solutions.filter((_, idx) => idx !== i) });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="text-[11px] text-amber-400/80 bg-amber-500/5 border border-amber-500/20 rounded-lg px-3 py-2">
        ◎ <b>You Solve It</b> — a real, unsolved problem. Lay out the actual debated solutions, each with
        a real upside <i>and</i> a real catch. Keep it grounded in verifiable facts and fill the source line.
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Title</label>
        <input value={block.title ?? ''} onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. The Sorrow of Bihar — Can the Kosi's Floods Be Stopped?" className={INPUT} />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">The Problem (markdown)</label>
        <textarea value={block.problem ?? ''} onChange={(e) => onChange({ problem: e.target.value })}
          rows={4} placeholder="Real, named, current issue with a human stake…" className={`${AREA} font-mono`} />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Why It&rsquo;s Stubborn (markdown)</label>
        <textarea value={block.why_hard ?? ''} onChange={(e) => onChange({ why_hard: e.target.value })}
          rows={4} placeholder="The twist that keeps it unsolved…" className={`${AREA} font-mono`} />
      </div>

      {/* Infographic */}
      <div className="pt-1 border-t border-white/6">
        <label className="text-xs text-white/40 mb-1 block">Infographic (optional)</label>
        <div className="flex gap-2">
          <input value={block.image_src ?? ''} onChange={(e) => onChange({ image_src: e.target.value || undefined })}
            placeholder="Paste R2 URL, or upload →" className={`${INPUT} flex-1`} />
          {onUpload && (
            <>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5
                  hover:bg-white/10 text-[11px] text-white/60 transition-colors disabled:opacity-50">
                <Upload size={11} />{uploading ? 'Uploading…' : 'Upload'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </>
          )}
        </div>
        {uploadError && <p className="text-[11px] text-red-400 mt-1">{uploadError}</p>}
        <input value={block.image_caption ?? ''} onChange={(e) => onChange({ image_caption: e.target.value || undefined })}
          placeholder="Image caption (optional)" className={`${INPUT} mt-2`} />
        <textarea value={block.image_prompt ?? ''} onChange={(e) => onChange({ image_prompt: e.target.value || undefined })}
          rows={2} placeholder="AI image generation prompt — shown as a placeholder until an image is uploaded…"
          className={`${AREA} font-mono mt-2`} />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Source note (always shown to the reader)</label>
        <textarea value={block.source_note ?? ''} onChange={(e) => onChange({ source_note: e.target.value })}
          rows={2} placeholder="Cite the real report(s)/case this is grounded in…" className={AREA} />
      </div>

      {/* Solutions */}
      <div className="pt-1 border-t border-white/6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-white/40 block">Solutions on the table ({solutions.length}/4)</label>
          <button type="button" onClick={addSolution} disabled={solutions.length >= 4}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/5
              hover:bg-white/10 text-[11px] text-white/60 transition-colors disabled:opacity-40">
            <Plus size={11} /> Add solution
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {solutions.map((s, i) => (
            <div key={s.id ?? i} className="rounded-lg border border-white/10 p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wide text-amber-400/70">Solution {i + 1}</span>
                <button type="button" onClick={() => removeSolution(i)} disabled={solutions.length <= 2}
                  className="text-white/30 hover:text-red-400 transition-colors disabled:opacity-30" title="Remove (min 2)">
                  <Trash2 size={13} />
                </button>
              </div>
              <input value={s.label ?? ''} onChange={(e) => updateSolution(i, { label: e.target.value })}
                placeholder="The proposal, e.g. Build a giant high dam in Nepal" className={INPUT} />
              <textarea value={s.upside ?? ''} onChange={(e) => updateSolution(i, { upside: e.target.value })}
                rows={2} placeholder="Upside — its real benefit (markdown)" className={`${AREA} font-mono`} />
              <textarea value={s.tradeoff ?? ''} onChange={(e) => updateSolution(i, { tradeoff: e.target.value })}
                rows={2} placeholder="The catch — its real cost/tradeoff (markdown)" className={`${AREA} font-mono`} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Decision prompt</label>
        <textarea value={block.prompt ?? ''} onChange={(e) => onChange({ prompt: e.target.value })}
          rows={2} placeholder="Ask the student to commit + name their own pick's weakness…" className={AREA} />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Where the debate actually stands (markdown — NOT a verdict)</label>
        <textarea value={block.reality_check ?? ''} onChange={(e) => onChange({ reality_check: e.target.value })}
          rows={4} placeholder="Ground it in reality; explicitly not 'the one right answer'…" className={`${AREA} font-mono`} />
      </div>
    </div>
  );
}
