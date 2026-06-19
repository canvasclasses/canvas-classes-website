// Export sidebar for the diagram editor (local build — no cloud upload).
//   • Dark page (light lines) vs Light/print (dark lines) — handled natively by
//     Excalidraw's exportWithDarkMode, transparent background either way.
//   • Download SVG / PNG, Copy PNG.
//   • Exports the current selection if any, else the whole canvas.

import { useState } from 'react';
import { exportToSvg, exportToBlob } from '@excalidraw/excalidraw';
import { Download, ClipboardCopy, Moon, Sun } from 'lucide-react';
import type { ExcalidrawApi } from './ExcalidrawCanvas';

type Theme = 'light' | 'dark';

export default function DiagramExportToolbar({ api }: { api: ExcalidrawApi | null }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const ready = !!api;

  // Collect the elements to export: the selection if there is one, else all.
  function collect() {
    if (!api) return null;
    const all = api.getSceneElements();
    if (!all.length) {
      setStatus('Canvas is empty — draw a diagram first.');
      return null;
    }
    const appState = api.getAppState();
    const selectedIds = (appState.selectedElementIds || {}) as Record<string, boolean>;
    const selected = all.filter((e) => selectedIds[(e as { id: string }).id]);
    const elements = selected.length ? selected : all;
    const scope = selected.length ? 'selection' : 'whole canvas';
    const exportState = {
      ...appState,
      exportBackground: false, // transparent
      exportWithDarkMode: theme === 'dark', // dark page → light lines
      exportScale: 2,
    };
    return { elements: [...elements], appState: exportState, files: api.getFiles(), scope };
  }

  async function svgString(): Promise<{ svg: string; scope: string } | null> {
    const c = collect();
    if (!c) return null;
    const svg = await exportToSvg({
      elements: c.elements as never,
      appState: c.appState as never,
      files: c.files as never,
      exportPadding: 8,
    });
    return { svg: svg.outerHTML, scope: c.scope };
  }

  async function pngBlob(): Promise<{ blob: Blob; scope: string } | null> {
    const c = collect();
    if (!c) return null;
    const blob = await exportToBlob({
      elements: c.elements as never,
      appState: c.appState as never,
      files: c.files as never,
      mimeType: 'image/png',
      exportPadding: 8,
    });
    return { blob, scope: c.scope };
  }

  function triggerDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
      const r = await svgString();
      if (!r) return;
      triggerDownload(new Blob([r.svg], { type: 'image/svg+xml' }), 'diagram.svg');
      setStatus(`Downloaded the ${r.scope} as SVG.`);
    });

  const downloadPng = () =>
    run(async () => {
      const r = await pngBlob();
      if (!r) return;
      triggerDownload(r.blob, 'diagram.png');
      setStatus(`Downloaded the ${r.scope} as PNG.`);
    });

  const copyPng = () =>
    run(async () => {
      const r = await pngBlob();
      if (!r) return;
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': r.blob })]);
      setStatus(`Copied the ${r.scope} to the clipboard.`);
    });

  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <h2 className="text-sm font-semibold text-white">Export image</h2>
        <p className="mt-1 text-xs text-white/50">
          Select shapes to export just them; with nothing selected the whole canvas
          is exported. SVG stays crisp at any size.
        </p>
      </div>

      <div>
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/40">For</div>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-1">
          <button
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              theme === 'dark' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Moon className="h-3.5 w-3.5" /> Dark page
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              theme === 'light' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Sun className="h-3.5 w-3.5" /> Light/print
          </button>
        </div>
      </div>

      <button
        onClick={downloadSvg}
        disabled={!ready || busy}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2.5 text-sm font-bold text-black transition disabled:opacity-40"
      >
        <Download className="h-4 w-4" /> Download SVG
      </button>

      <div className="grid grid-cols-2 gap-2">
        <Ghost onClick={downloadPng} disabled={!ready || busy}>
          <Download className="h-4 w-4" /> PNG
        </Ghost>
        <Ghost onClick={copyPng} disabled={!ready || busy}>
          <ClipboardCopy className="h-4 w-4" /> Copy
        </Ghost>
      </div>

      {status && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-amber-300">
          {status}
        </div>
      )}

      <p className="mt-1 text-[11px] leading-relaxed text-white/30">
        Open the Library panel (book icon) on the canvas for the physics/math
        shapes. Files save to your Downloads folder.
      </p>
    </div>
  );
}

function Ghost({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
