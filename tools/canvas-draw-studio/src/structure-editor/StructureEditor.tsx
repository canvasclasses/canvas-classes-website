// Structure Editor panel — a ChemDraw-style drawing surface.
//
// Layout: a large white Ketcher canvas (white is the correct, expected
// convention for a structure editor) beside a dark export sidebar. In the website
// Ketcher was loaded via next/dynamic(ssr:false); here Vite has no SSR so it's a
// plain import.

import { useRef, useState } from 'react';
import type { Ketcher } from 'ketcher-core';
import KetcherCanvas from './KetcherCanvas';
import ExportToolbar from './ExportToolbar';
import NameToStructure from './NameToStructure';
import FunctionalGroups from './FunctionalGroups';
import ReferenceImageControl, {
  type RefImageState,
  DEFAULT_REF_IMAGE,
} from './ReferenceImageControl';

export default function StructureEditor() {
  const [ketcher, setKetcher] = useState<Ketcher | null>(null);
  const [serializeStruct, setSerializeStruct] = useState<
    ((struct: unknown) => string) | null
  >(null);
  const [molfileToStruct, setMolfileToStruct] = useState<
    ((mol: string) => unknown) | null
  >(null);
  const [refImage, setRefImage] = useState<RefImageState>(DEFAULT_REF_IMAGE);
  const dragRef = useRef<{ sx: number; sy: number; ox: number; oy: number } | null>(null);

  return (
    <div className="flex h-full min-h-0">
      {/* Drawing surface — white canvas is intentional. `relative` gives
          Ketcher's absolutely-positioned root a sized containing block. */}
      <div className="relative min-w-0 flex-1 bg-white">
        <KetcherCanvas
          onInit={(k, api) => {
            setKetcher(k);
            setSerializeStruct(() => api.serializeStruct);
            setMolfileToStruct(() => api.molfileToStruct);
          }}
        />
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

      {/* Sidebar — dark chrome: inputs (name, groups, reference) on top, export below. */}
      <aside className="flex w-[280px] shrink-0 flex-col overflow-y-auto border-l border-white/10 bg-[#0B0F15]">
        <NameToStructure ketcher={ketcher} />
        <FunctionalGroups ketcher={ketcher} molfileToStruct={molfileToStruct} />
        <ReferenceImageControl state={refImage} onChange={setRefImage} />
        <ExportToolbar ketcher={ketcher} serializeStruct={serializeStruct} />
      </aside>
    </div>
  );
}
