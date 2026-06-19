// Trace-over reference image controls. The actual <img> overlay is rendered by
// StructureEditor over the canvas; this is just the control panel: load/paste,
// opacity, SIZE, a move/resize toggle (drag to reposition without drawing),
// show/hide, clear.

import { useRef } from 'react';
import { ImagePlus, Eye, EyeOff, X, ClipboardPaste, Move } from 'lucide-react';

export interface RefImageState {
  url: string | null;
  opacity: number;
  visible: boolean;
  scale: number; // 0.1–1.5, fraction of canvas width
  x: number; // px offset from centre
  y: number;
  adjusting: boolean; // when true, the overlay is draggable and drawing is paused
}

export const DEFAULT_REF_IMAGE: RefImageState = {
  url: null,
  opacity: 0.4,
  visible: true,
  scale: 0.6,
  x: 0,
  y: 0,
  adjusting: false,
};

export default function ReferenceImageControl({
  state,
  onChange,
}: {
  state: RefImageState;
  onChange: (next: RefImageState) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  function setUrl(url: string | null) {
    if (state.url && state.url.startsWith('blob:')) URL.revokeObjectURL(state.url);
    onChange({ ...DEFAULT_REF_IMAGE, url, visible: !!url });
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setUrl(URL.createObjectURL(file));
    e.target.value = '';
  }

  async function pasteFromClipboard() {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const type = item.types.find((t) => t.startsWith('image/'));
        if (type) {
          const blob = await item.getType(type);
          setUrl(URL.createObjectURL(blob));
          return;
        }
      }
    } catch {
      /* clipboard read unsupported/denied — file picker still works */
    }
  }

  return (
    <div className="border-b border-white/10 p-4">
      <h2 className="text-sm font-semibold text-white">Trace a reference</h2>
      <p className="mt-1 text-xs text-white/50">
        Load a blurry figure as a faint overlay and trace a clean structure over it.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
        >
          <ImagePlus className="h-4 w-4" /> Load image
        </button>
        <button
          onClick={pasteFromClipboard}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10"
        >
          <ClipboardPaste className="h-4 w-4" /> Paste
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />

      {state.url && (
        <div className="mt-3 space-y-2">
          <Slider
            label="Size"
            min={10}
            max={150}
            value={Math.round(state.scale * 100)}
            onChange={(v) => onChange({ ...state, scale: v / 100 })}
          />
          <Slider
            label="Opacity"
            min={10}
            max={90}
            value={Math.round(state.opacity * 100)}
            onChange={(v) => onChange({ ...state, opacity: v / 100 })}
          />
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => onChange({ ...state, adjusting: !state.adjusting })}
              className={`inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs transition ${
                state.adjusting
                  ? 'border-orange-500/40 bg-orange-500/15 text-orange-200'
                  : 'border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
              }`}
            >
              <Move className="h-3.5 w-3.5" /> Move
            </button>
            <button
              onClick={() => onChange({ ...state, visible: !state.visible })}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
            >
              {state.visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {state.visible ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => setUrl(null)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white/60 transition hover:bg-white/10 hover:text-white/90"
            >
              <X className="h-3.5 w-3.5" /> Clear
            </button>
          </div>
          {state.adjusting && (
            <p className="text-[11px] leading-relaxed text-orange-300/80">
              Drag the image to move it. Drawing is paused while Move is on — turn
              it off to draw again.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs text-white/60">
      <span className="w-12 shrink-0">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 accent-orange-500"
      />
    </label>
  );
}
