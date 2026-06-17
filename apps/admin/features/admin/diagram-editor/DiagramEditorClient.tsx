'use client';

// Diagram Editor panel — a physics/math diagram maker built on Excalidraw.
// Excalidraw is loaded client-only via dynamic(ssr:false) (it touches window),
// keeping it out of SSR and other admin routes. The custom shape libraries
// (pulleys, circuits, optics, graphs) will be layered on top in later phases.

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DiagramExportToolbar from './DiagramExportToolbar';
import type { ExcalidrawApi } from './ExcalidrawCanvas';

const ExcalidrawCanvas = dynamic(() => import('./ExcalidrawCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#121316] text-sm text-white/40">
      Loading diagram editor…
    </div>
  ),
});

export default function DiagramEditorClient() {
  const [api, setApi] = useState<ExcalidrawApi | null>(null);

  return (
    <main className="flex h-screen flex-col bg-[#050505] text-white">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Diagram Editor
          </div>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight">Physics &amp; math diagrams</h1>
        </div>
        <p className="hidden max-w-md text-right text-xs text-white/40 sm:block">
          Open the Library panel (book icon) for the physics/math shapes; use the
          canvas toolbar for lines, arrows &amp; text. Switch precise ↔ hand-drawn
          per shape, then export a clean SVG / PNG.
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Center: Excalidraw — manages its own dark canvas, toolbar + library panel. */}
        <div className="relative min-w-0 flex-1">
          <ExcalidrawCanvas onReady={setApi} />
        </div>

        {/* Right: export. */}
        <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#0B0F15]">
          <DiagramExportToolbar api={api} />
        </aside>
      </div>
    </main>
  );
}
