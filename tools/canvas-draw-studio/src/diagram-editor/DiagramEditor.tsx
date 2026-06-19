// Diagram Editor panel — a physics/math diagram maker built on Excalidraw.
// In the website Excalidraw was loaded via next/dynamic(ssr:false); here Vite has
// no SSR so it's a plain import.

import { useState } from 'react';
import ExcalidrawCanvas, { type ExcalidrawApi } from './ExcalidrawCanvas';
import DiagramExportToolbar from './DiagramExportToolbar';

export default function DiagramEditor() {
  const [api, setApi] = useState<ExcalidrawApi | null>(null);

  return (
    <div className="flex h-full min-h-0">
      {/* Center: Excalidraw — manages its own dark canvas, toolbar + library panel. */}
      <div className="relative min-w-0 flex-1">
        <ExcalidrawCanvas onReady={setApi} />
      </div>

      {/* Right: export. */}
      <aside className="flex w-[260px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#0B0F15]">
        <DiagramExportToolbar api={api} />
      </aside>
    </div>
  );
}
