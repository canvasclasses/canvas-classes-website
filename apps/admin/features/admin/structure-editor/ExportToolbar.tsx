'use client';

// Export sidebar for the Structure Editor.
//   • Theme: "Light/print" = black lines; "Dark page" = white lines on a
//     transparent background (so a structure drops cleanly onto the dark
//     book/Crucible pages). Indigo (the export engine) can only draw black, so
//     dark mode is produced by recolouring the exported SVG black→white in code.
//   • Download SVG (vector, sharp) / Download PNG (rasterised from the SVG at 2x).
//   • Copy PNG to clipboard.
//   • Push PNG to R2 (existing /api/v2/books/assets/upload route → hosted URL).
// Exports the current selection if one exists, else the whole canvas.

import { useState } from 'react';
import type { Ketcher } from 'ketcher-core';
import { Download, UploadCloud, Copy, Check, ClipboardCopy, Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

export default function ExportToolbar({
  ketcher,
  serializeStruct,
}: {
  ketcher: Ketcher | null;
  serializeStruct: ((struct: unknown) => string) | null;
}) {
  const [theme, setTheme] = useState<Theme>('light');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [r2Url, setR2Url] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ready = !!ketcher;

  // Make the exported SVG transparent-backgrounded, and (in dark mode) recolour
  // every black stroke/fill to white. Indigo renders structures in black on a
  // (sometimes white) background; we strip the background rect always, and flip
  // black→white for dark pages.
  // Recolour the exported SVG by INJECTING a <style> block rather than string-
  // matching colours: Indigo's exact output (hex vs rgb vs named, attribute vs
  // inline style) varies, so regex replacement was unreliable. CSS with
  // !important overrides whatever Indigo emitted, in any SVG-rendering context
  // (download, <img>, canvas rasterise).
  //   - both themes: drop the opaque background rect → transparent.
  //   - dark: force every bond/label to white.
  function processSvg(svg: string): string {
    const darkRules =
      theme === 'dark'
        ? `path,line,polyline{stroke:#fff !important;}` +
          `path[fill]:not([fill="none"]),polygon{fill:#fff !important;}` +
          `text,tspan{fill:#fff !important;stroke:none !important;}`
        : '';
    const css = `<style>rect{fill:transparent !important;}${darkRules}</style>`;
    // Insert right after the opening <svg ...> tag ([^>] matches newlines too).
    return svg.replace(/(<svg\b[^>]*>)/i, `$1${css}`);
  }

  // Build the export SVG string for the current selection (or whole canvas).
  async function buildSvg(): Promise<{ svg: string; scope: string } | null> {
    if (!ketcher) return null;

    const editor = (ketcher as unknown as {
      editor?: { structSelected?: () => { atoms?: { size?: number } } };
    }).editor;
    const selected = editor?.structSelected?.();
    const hasSelection = !!selected && (selected.atoms?.size ?? 0) > 0;

    let molfile: string;
    let scope: string;
    if (hasSelection && serializeStruct) {
      molfile = serializeStruct(selected);
      scope = 'selection';
    } else {
      molfile = await ketcher.getMolfile();
      scope = 'whole canvas';
    }
    if (!molfile || !molfile.trim()) {
      setStatus('Canvas is empty — draw a structure first.');
      return null;
    }

    // render-coloring:false → monochrome black out of Indigo (we recolour after).
    const blob = await ketcher.generateImage(molfile, {
      outputFormat: 'svg',
      'render-coloring': false,
    } as unknown as Parameters<typeof ketcher.generateImage>[1]);
    const svg = processSvg(await blob.text());
    return { svg, scope };
  }

  // Rasterise an SVG string to a transparent PNG blob at 2x for crisp output.
  function svgToPng(svg: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const w = (img.width || 600) * scale;
        const h = (img.height || 400) * scale;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('no canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h); // transparent background preserved
        canvas.toBlob((b) => {
          URL.revokeObjectURL(url);
          b ? resolve(b) : reject(new Error('toBlob failed'));
        }, 'image/png');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('could not rasterise SVG'));
      };
      img.src = url;
    });
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

  async function downloadSvg() {
    setBusy(true);
    setStatus(null);
    try {
      const built = await buildSvg();
      if (!built) return;
      triggerDownload(new Blob([built.svg], { type: 'image/svg+xml' }), 'structure.svg');
      setStatus(`Downloaded the ${built.scope} as SVG (${theme === 'dark' ? 'white' : 'black'}).`);
    } catch (e) {
      console.error(e);
      setStatus('Could not generate the SVG.');
    } finally {
      setBusy(false);
    }
  }

  async function downloadPng() {
    setBusy(true);
    setStatus(null);
    try {
      const built = await buildSvg();
      if (!built) return;
      const png = await svgToPng(built.svg);
      triggerDownload(png, 'structure.png');
      setStatus(`Downloaded the ${built.scope} as PNG (${theme === 'dark' ? 'white' : 'black'}).`);
    } catch (e) {
      console.error(e);
      setStatus('Could not generate the PNG.');
    } finally {
      setBusy(false);
    }
  }

  async function copyPng() {
    setBusy(true);
    setStatus(null);
    try {
      const built = await buildSvg();
      if (!built) return;
      const png = await svgToPng(built.svg);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
      setStatus(`Copied the ${built.scope} to the clipboard.`);
    } catch (e) {
      console.error(e);
      setStatus('Clipboard image copy is not supported by this browser.');
    } finally {
      setBusy(false);
    }
  }

  async function pushToR2() {
    setBusy(true);
    setStatus(null);
    setR2Url(null);
    try {
      const built = await buildSvg();
      if (!built) return;
      const png = await svgToPng(built.svg);
      const file = new File([png], `structure-${Date.now()}.png`, { type: 'image/png' });
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/v2/books/assets/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      setR2Url(data.url);
      setStatus(`Uploaded the ${built.scope} to R2.`);
    } catch (e) {
      console.error(e);
      setStatus(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  async function copyUrl() {
    if (!r2Url) return;
    try {
      await navigator.clipboard.writeText(r2Url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setStatus('Clipboard blocked by the browser.');
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <div>
        <h2 className="text-sm font-semibold text-white">Export image</h2>
        <p className="mt-1 text-xs text-white/50">
          Select one structure to export just it; with nothing selected the whole
          canvas is exported. SVG stays crisp at any size.
        </p>
      </div>

      {/* Theme toggle — where the structure will be placed. */}
      <div>
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wider text-white/40">
          For
        </div>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-[#0B0F15] p-1">
          <button
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              theme === 'dark' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Moon className="h-3.5 w-3.5" /> Dark page (white)
          </button>
          <button
            onClick={() => setTheme('light')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition ${
              theme === 'light' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Sun className="h-3.5 w-3.5" /> Light/print (black)
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
        <GhostButton onClick={downloadPng} disabled={!ready || busy}>
          <Download className="h-4 w-4" /> PNG
        </GhostButton>
        <GhostButton onClick={copyPng} disabled={!ready || busy}>
          <ClipboardCopy className="h-4 w-4" /> Copy
        </GhostButton>
      </div>

      <GhostButton onClick={pushToR2} disabled={!ready || busy} className="w-full">
        <UploadCloud className="h-4 w-4" /> Push PNG to R2
      </GhostButton>

      {status && (
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-amber-300">
          {status}
        </div>
      )}

      {r2Url && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2 py-1.5">
          <input
            readOnly
            value={r2Url}
            className="min-w-0 flex-1 bg-transparent font-mono text-[11px] text-emerald-300 outline-none"
          />
          <button
            onClick={copyUrl}
            className="shrink-0 text-emerald-300/70 hover:text-emerald-200"
            aria-label="Copy R2 URL"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}

      <p className="mt-1 text-[11px] leading-relaxed text-white/30">
        Tip: use the rectangle/lasso select tool to pick one structure before
        exporting. &ldquo;Dark page&rdquo; gives white lines on a transparent
        background; &ldquo;Light/print&rdquo; gives black lines. Each export tells
        you what it captured.
      </p>
    </div>
  );
}

function GhostButton({
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
