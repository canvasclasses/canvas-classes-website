'use client';

// Structure Editor panel — a ChemDraw-style drawing surface for authoring.
//
// Layout: a large white Ketcher canvas (a white drawing surface is the correct,
// expected convention for a structure editor — we do not dark-theme it) beside a
// dark export sidebar. Ketcher itself is loaded client-only via `dynamic` with
// ssr:false (App Router forbids ssr:false dynamic in a Server Component, so it
// lives here inside a 'use client' module), keeping its multi-MB bundle + WASM
// worker out of SSR and out of every other admin route.

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Ketcher } from 'ketcher-core';
import ExportToolbar from './ExportToolbar';
import NameToStructure from './NameToStructure';
import FunctionalGroups from './FunctionalGroups';
import ReferenceImageControl, {
  type RefImageState,
  DEFAULT_REF_IMAGE,
} from './ReferenceImageControl';

const KetcherCanvas = dynamic(() => import('./KetcherCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-white text-sm text-gray-500">
      Loading structure editor…
    </div>
  ),
});

export default function StructureEditorClient() {
  const [ketcher, setKetcher] = useState<Ketcher | null>(null);
  const [serializeStruct, setSerializeStruct] = useState<
    ((struct: unknown) => string) | null
  >(null);
  const [molfileToStruct, setMolfileToStruct] = useState<
    ((mol: string) => unknown) | null
  >(null);
  const [refImage, setRefImage] = useState<RefImageState>(DEFAULT_REF_IMAGE);
  // Drag start: pointer position + image offset at the moment the drag began.
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  return (
    <main className="flex h-screen flex-col bg-[#050505] text-white">
      <header className="flex items-center justify-between border-b border-white/5 px-6 py-3">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-orange-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
            Structure Editor
          </div>
          <h1 className="mt-0.5 text-lg font-semibold tracking-tight">
            Draw organic structures
          </h1>
        </div>
        <p className="hidden max-w-md text-right text-xs text-white/40 sm:block">
          Open / closed chains, rings, functional groups, stereochemistry. Redraw
          blurred source figures into sharp lines, then export a clean SVG / PNG.
        </p>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Drawing surface — white canvas is intentional. `relative` gives
            Ketcher's absolutely-positioned root a sized containing block. */}
        <div className="relative min-w-0 flex-1 bg-white">
          <KetcherCanvas
            onInit={(k, api) => {
              setKetcher(k);
              // Store the functions themselves (not call them) — the updater form
              // keeps React from treating a function as a state initializer.
              setSerializeStruct(() => api.serializeStruct);
              setMolfileToStruct(() => api.molfileToStruct);
            }}
          />
          {/* Trace-over reference: faint image on TOP of the canvas. When "Move"
              is off it's click-through (pointer-events:none) so drawing works
              underneath; when on, it's draggable to reposition. Size + offset are
              driven by the sidebar control. Hidden before exporting. */}
          {refImage.url && refImage.visible && (
            <img
              src={refImage.url}
              alt="Tracing reference"
              draggable={false}
              onPointerDown={(e) => {
                if (!refImage.adjusting) return;
                e.currentTarget.setPointerCapture(e.pointerId);
                dragRef.current = { sx: e.clientX, sy: e.clientY, ox: refImage.x, oy: refImage.y };
              }}
              onPointerMove={(e) => {
                if (!dragRef.current) return;
                const d = dragRef.current;
                setRefImage((s) => ({
                  ...s,
                  x: d.ox + (e.clientX - d.sx),
                  y: d.oy + (e.clientY - d.sy),
                }));
              }}
              onPointerUp={() => {
                dragRef.current = null;
              }}
              style={{
                opacity: refImage.opacity,
                width: `${refImage.scale * 100}%`,
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${refImage.x}px), calc(-50% + ${refImage.y}px))`,
                pointerEvents: refImage.adjusting ? 'auto' : 'none',
                cursor: refImage.adjusting ? 'move' : 'default',
                touchAction: 'none',
              }}
              className="absolute select-none"
            />
          )}
        </div>

        {/* Sidebar — dark admin chrome: inputs (name, reference) on top, export below. */}
        <aside className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#0B0F15]">
          <NameToStructure ketcher={ketcher} />
          <FunctionalGroups ketcher={ketcher} molfileToStruct={molfileToStruct} />
          <ReferenceImageControl state={refImage} onChange={setRefImage} />
          <ExportToolbar ketcher={ketcher} serializeStruct={serializeStruct} />
        </aside>
      </div>
    </main>
  );
}
