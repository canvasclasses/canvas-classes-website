'use client';

// ScenarioStage.tsx — the per-module layout shell.
// Left: the SVG canvas where the real object is drawn with force arrows ON it
//       (the arrows ARE the abstraction — sitting directly on the thing the
//       student recognises). Right: the teaching sidebar (controls, live
//       readout, explanation, Expert Tip).

import React, { forwardRef } from 'react';
import { C, VIEW, canvasStyle } from '../lib/theme';

export function PhaseLayout({
  scenarioTitle,
  scenarioTag,
  canvas,
  sidebar,
}: {
  scenarioTitle: string;
  scenarioTag: string;
  canvas: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[7fr_5fr] gap-6">
      {/* ── Scenario + diagram canvas ── */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold leading-snug text-white">{scenarioTitle}</h3>
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(129,140,248,0.12)', color: C.indigoLight, border: '1px solid rgba(129,140,248,0.25)' }}
          >
            {scenarioTag}
          </span>
        </div>
        {canvas}
        <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted }}>
          Real-world scenario · drag the arrow tips to explore
        </p>
      </div>

      {/* ── Sidebar ── */}
      <div className="flex flex-col gap-5 py-1">{sidebar}</div>
    </div>
  );
}

/** The SVG canvas wrapper. Forwards a ref so DraggableHead can map coordinates. */
export const Canvas = forwardRef<SVGSVGElement, { children: React.ReactNode; minHeight?: number }>(
  function Canvas({ children, minHeight = 420 }, ref) {
    return (
      <div className="relative overflow-hidden flex items-center justify-center" style={{ ...canvasStyle, minHeight }}>
        <svg
          ref={ref}
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
          style={{ minHeight, touchAction: 'none' }}
        >
          {children}
        </svg>
      </div>
    );
  }
);

/** Sidebar section heading. */
export function SideHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-black uppercase tracking-tighter" style={{ color: C.text }}>
      {children}
    </h2>
  );
}
