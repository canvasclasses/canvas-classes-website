'use client';

// Standalone math grapher — the SAME engine that powers the Live Books
// interactive_graph block, usable on its own: build a graph (form or prebuilt),
// interact with it live, and export an image (SVG/PNG/R2) for questions/figures.
// Reuses InteractiveGraphEditor (the form) + InteractiveGraphRenderer (the live
// JSXGraph board) so there's one source of truth.

import { useMemo, useRef, useState } from 'react';
import type { InteractiveGraphBlock } from '@canvas/data/types/books';
import InteractiveGraphEditor from '@/features/admin/books-editor/blocks/InteractiveGraphEditor';
import InteractiveGraphRenderer from '@canvas/book-renderer/blocks/InteractiveGraphRenderer';
import { Download, UploadCloud, Copy, Check, ClipboardCopy } from 'lucide-react';

const INITIAL: InteractiveGraphBlock = {
  id: 'standalone',
  type: 'interactive_graph',
  order: 0,
  title: '',
  spec: {
    bounds: { xmin: -5, xmax: 5, ymin: -5, ymax: 5 },
    functions: [{ expr: 'a*x^2 + b*x + c' }],
    sliders: [
      { name: 'a', min: -3, max: 3, value: 1 },
      { name: 'b', min: -3, max: 3, value: 0 },
      { name: 'c', min: -3, max: 3, value: 0 },
    ],
    showGrid: true,
  },
};

export default function GraphEditorClient() {
  const [block, setBlock] = useState<InteractiveGraphBlock>(INITIAL);
  const boardWrap = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [r2Url, setR2Url] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Remount the live board whenever the definition changes so JSXGraph rebuilds.
  const renderKey = useMemo(
    () => JSON.stringify(block.spec) + '|' + (block.graph_id ?? ''),
    [block.spec, block.graph_id],
  );

  function getSvgString(): string | null {
    const svg = boardWrap.current?.querySelector('svg');
    if (!svg) {
      setStatus('Graph not ready yet — try again in a moment.');
      return null;
    }
    const clone = svg.cloneNode(true) as SVGSVGElement;
    if (!clone.getAttribute('xmlns')) clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    return clone.outerHTML;
  }

  function svgToPng(svgStr: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const w = (img.width || 600) * scale;
        const h = (img.height || 380) * scale;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('no ctx'));
          return;
        }
        ctx.fillStyle = '#ffffff'; // graphs read on white
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          b ? resolve(b) : reject(new Error('toBlob failed'));
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('svg load failed'));
      };
      img.src = url;
    });
  }

  function download(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setStatus(null);
    try {
      await fn();
    } catch (e) {
      console.error(e);
      setStatus('Export failed — check the console.');
    } finally {
      setBusy(false);
    }
  }

  const downloadSvg = () =>
    run(async () => {
      const svg = getSvgString();
      if (!svg) return;
      download(new Blob([svg], { type: 'image/svg+xml' }), 'graph.svg');
      setStatus('Downloaded SVG.');
    });

  const downloadPng = () =>
    run(async () => {
      const svg = getSvgString();
      if (!svg) return;
      download(await svgToPng(svg), 'graph.png');
      setStatus('Downloaded PNG.');
    });

  const copyPng = () =>
    run(async () => {
      const svg = getSvgString();
      if (!svg) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': await svgToPng(svg) })]);
      setStatus('Copied to clipboard.');
    });

  const pushToR2 = () =>
    run(async () => {
      const svg = getSvgString();
      if (!svg) return;
      setR2Url(null);
      const file = new File([await svgToPng(svg)], `graph-${Date.now()}.png`, { type: 'image/png' });
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/v2/books/assets/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      setR2Url(data.url);
      setStatus('Uploaded to R2.');
    });

  async function copyUrl() {
    if (!r2Url) return;
    try {
      await navigator.clipboard.writeText(r2Url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setStatus('Clipboard blocked.');
    }
  }

  return (
    <main className="flex h-screen flex-col bg-[#050505] text-white">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Graph Editor
          </div>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight">Math grapher</h1>
        </div>
        <p className="hidden max-w-md text-right text-xs text-white/40 sm:block">
          Plot functions with draggable sliders, or pick a prebuilt graph. Drag the
          board to explore, then export a clean image. Same engine as Live Books.
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Left: the definition form (reused from the books editor). */}
        <aside className="w-[300px] shrink-0 overflow-y-auto border-r border-white/10 bg-[#0B0F15] p-4">
          <InteractiveGraphEditor block={block} onChange={(p) => setBlock((b) => ({ ...b, ...p }))} />
        </aside>

        {/* Center: the live interactive board. */}
        <div className="min-w-0 flex-1 overflow-y-auto p-6" ref={boardWrap}>
          <InteractiveGraphRenderer key={renderKey} block={block} />
        </div>

        {/* Right: export. */}
        <aside className="flex w-[240px] shrink-0 flex-col gap-3 overflow-y-auto border-l border-white/10 bg-[#0B0F15] p-4">
          <h2 className="text-sm font-semibold text-white">Export image</h2>
          <p className="text-xs text-white/50">
            Captures the board as you see it (slider positions included).
          </p>
          <button
            onClick={downloadSvg}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-black transition disabled:opacity-40"
          >
            <Download className="h-4 w-4" /> Download SVG
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={downloadPng} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40">
              <Download className="h-4 w-4" /> PNG
            </button>
            <button onClick={copyPng} disabled={busy} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40">
              <ClipboardCopy className="h-4 w-4" /> Copy
            </button>
          </div>
          <button onClick={pushToR2} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40">
            <UploadCloud className="h-4 w-4" /> Push PNG to R2
          </button>
          {status && (
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-amber-300">{status}</div>
          )}
          {r2Url && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
              <input readOnly value={r2Url} className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-emerald-300 outline-none" />
              <button onClick={copyUrl} className="shrink-0 text-emerald-300/70 hover:text-emerald-200" aria-label="Copy URL">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
