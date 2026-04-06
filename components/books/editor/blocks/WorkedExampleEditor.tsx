'use client';

import { WorkedExampleBlock } from '@/types/books';
import { UploadFn } from '../BookWorkspace';

interface Props {
  block: WorkedExampleBlock;
  onChange: (patch: Partial<WorkedExampleBlock>) => void;
  onUpload: UploadFn;
}

export default function WorkedExampleEditor({ block, onChange, onUpload }: Props) {
  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await onUpload(file, block.id);
    onChange({ video_src: url });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-white/40 mb-1 block">Label</label>
          <input
            value={block.label}
            onChange={e => onChange({ label: e.target.value })}
            placeholder="e.g. Solved Example 3.1"
            className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
              placeholder-white/25 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div>
          <label className="text-xs text-white/40 mb-1 block">Variant</label>
          <select
            value={block.variant}
            onChange={e => onChange({ variant: e.target.value as WorkedExampleBlock['variant'] })}
            className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
              focus:outline-none focus:border-amber-500/50"
          >
            <option value="solved_example">Solved Example</option>
            <option value="ncert_intext">NCERT Intext</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Reveal mode</label>
        <select
          value={block.reveal_mode}
          onChange={e => onChange({ reveal_mode: e.target.value as WorkedExampleBlock['reveal_mode'] })}
          className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
            focus:outline-none focus:border-amber-500/50"
        >
          <option value="always_visible">Always visible</option>
          <option value="tap_to_reveal">Tap to reveal solution</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Problem</label>
        <textarea
          value={block.problem}
          onChange={e => onChange({ problem: e.target.value })}
          placeholder="Problem statement (markdown + LaTeX)"
          rows={3}
          className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
            placeholder-white/25 focus:outline-none focus:border-amber-500/50 resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Solution</label>
        <textarea
          value={block.solution}
          onChange={e => onChange({ solution: e.target.value })}
          placeholder="Step-by-step solution (markdown + LaTeX)"
          rows={4}
          className="w-full bg-[#050505] border border-white/8 rounded-lg px-3 py-2 text-sm text-white
            placeholder-white/25 focus:outline-none focus:border-amber-500/50 resize-none"
        />
      </div>

      <div>
        <label className="text-xs text-white/40 mb-1 block">Walkthrough video (optional)</label>
        {block.video_src ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 truncate flex-1">{block.video_src.split('/').pop()}</span>
            <button onClick={() => onChange({ video_src: undefined })} className="text-xs text-red-400/60 hover:text-red-400">
              Remove
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center gap-2 border border-dashed border-white/15
            rounded-lg py-3 cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors">
            <span className="text-xs text-white/30">Upload video</span>
            <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
          </label>
        )}
      </div>
    </div>
  );
}
