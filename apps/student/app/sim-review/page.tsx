'use client';

/*
 * /sim-review — TEMPORARY QA harness for the E1/E2 physics engines.
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders every mechanics_bench / motion_lab archetype through the real
 * BlockRenderer path (same code the reader runs), with a picker so each one can
 * be inspected, driven and measured in a browser.
 *
 * DELETE THIS ROUTE once the QA pass is signed off. It is not linked from
 * anywhere and is excluded from the sitemap by virtue of not being in it.
 *
 * A previous incarnation of this harness existed for the Class-9 sim review and
 * was removed after use — same intent, same lifecycle.
 */

import { useState } from 'react';
import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
import { MECHANICS_ARCHETYPE_CATALOG } from '@canvas/book-renderer/mechanics-bench';
import { MOTION_ARCHETYPE_CATALOG } from '@canvas/book-renderer/motion-lab';
import { CIRCUIT_ARCHETYPES } from '@canvas/book-renderer/circuit-bench';
import { OPTICS_ARCHETYPES } from '@canvas/book-renderer/optics-bench';
import { FIELD_ARCHETYPES } from '@canvas/book-renderer/field-bench';
import type { ContentBlock } from '@canvas/data/types/books';

type Entry = {
  key: string;
  engine: 'mechanics' | 'motion';
  id: string;
  title: string;
  summary: string;
  group: string;
  block: ContentBlock;
};

const mechEntries: Entry[] = MECHANICS_ARCHETYPE_CATALOG.map((a) => ({
  key: `m:${a.id}`,
  engine: 'mechanics' as const,
  id: a.id,
  title: a.title,
  summary: a.summary,
  group: a.mode === 'pulley' ? 'Pulley Lab' : 'FBD Studio',
  block: {
    id: `blk-${a.id}`,
    order: 0,
    type: 'mechanics_bench',
    mode: a.mode,
    archetype: a.id,
    title: a.title,
    show: { grid: true, axes: true, readout: true, equations: true, values: true },
    ...(a.mode === 'fbd'
      ? {
          fbd: {
            body: a.defaultBody ?? 'm1',
            prompt: `Draw the free-body diagram for this body.`,
            require_agent: true,
            allow_cut: true,
            then_solve: true,
          },
        }
      : {
          pulley: {
            prompt: 'Predict, then run.',
            show_constraint_ledger: true,
            allow_extend: true,
          },
        }),
  } as ContentBlock,
}));

const motionEntries: Entry[] = MOTION_ARCHETYPE_CATALOG.map((a) => ({
  key: `k:${a.id}`,
  engine: 'motion' as const,
  id: a.id,
  title: a.title,
  summary: a.summary,
  group:
    a.scenario === 'circular' || a.scenario === 'vertical-circle' || a.scenario === 'banked-road'
      ? 'Circular Arena'
      : 'Projectile Playground',
  block: {
    id: `blk-${a.id}`,
    order: 0,
    type: 'motion_lab',
    scenario: a.scenario,
    archetype: a.id,
    title: a.title,
    show: { grid: true, trail: true, vectors: true, readout: true },
    allow_release: true,
  } as ContentBlock,
}));

/** The three E3–E5 libraries export id-keyed maps rather than a prebuilt
 *  catalogue, so normalise defensively — a library may also ship an array. */
const toList = (src: unknown): { id: string; title?: string; summary?: string;
                                 mode?: string; kind?: string }[] =>
  Array.isArray(src) ? src : Object.values((src ?? {}) as Record<string, never>);

const circuitEntries: Entry[] = toList(CIRCUIT_ARCHETYPES).map((a) => ({
  key: `c:${a.id}`,
  engine: 'mechanics' as const,
  id: a.id,
  title: a.title ?? a.id,
  summary: a.summary ?? '',
  group: 'Circuit Bench',
  block: {
    id: `blk-${a.id}`, order: 0, type: 'circuit_bench', archetype: a.id, title: a.title ?? a.id,
    show: { redraw: true, potentialHeatmap: true, currentWidth: true, values: true, equations: true },
  } as ContentBlock,
}));

const opticsEntries: Entry[] = toList(OPTICS_ARCHETYPES).map((a) => ({
  key: `o:${a.id}`,
  engine: 'mechanics' as const,
  id: a.id,
  title: a.title ?? a.id,
  summary: a.summary ?? '',
  group: 'Optics Bench',
  block: {
    id: `blk-${a.id}`, order: 0, type: 'optics_bench',
    mode: (a.mode as 'bench' | 'assembler' | 'wave') ?? 'bench',
    archetype: a.id, title: a.title ?? a.id,
    show: { constructionRays: true, realFan: true, image: true, labels: true, magnification: true },
  } as ContentBlock,
}));

const fieldEntries: Entry[] = toList(FIELD_ARCHETYPES).map((a) => ({
  key: `f:${a.id}`,
  engine: 'mechanics' as const,
  id: a.id,
  title: a.title ?? a.id,
  summary: a.summary ?? '',
  group: 'Field Bench',
  block: {
    id: `blk-${a.id}`, order: 0, type: 'field_bench',
    kind: (a.kind as 'electric' | 'magnetic' | 'gravitational') ?? 'electric',
    mode: (a.mode as 'sculptor' | 'gauss' | 'trajectory' | 'photoelectric') ?? 'sculptor',
    archetype: a.id, title: a.title ?? a.id,
    show: { fieldLines: true, equipotentials: true, vectors: true, flux: true },
    allow_drag_surface: true,
  } as ContentBlock,
}));

const ALL: Entry[] = [
  ...mechEntries, ...motionEntries, ...circuitEntries, ...opticsEntries, ...fieldEntries,
];
const GROUPS = [
  'FBD Studio', 'Pulley Lab', 'Projectile Playground', 'Circular Arena',
  'Circuit Bench', 'Optics Bench', 'Field Bench',
];

export default function SimReviewPage() {
  const [activeKey, setActiveKey] = useState<string>(ALL[0]?.key ?? '');
  const [width, setWidth] = useState<'full' | 'phone'>('full');
  const active = ALL.find((e) => e.key === activeKey) ?? ALL[0];

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'flex-start' }}>
        {/* Picker */}
        <aside
          data-testid="sim-picker"
          style={{
            width: 260, flexShrink: 0, position: 'sticky', top: 16,
            maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
            background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12, padding: 12,
          }}
        >
          <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 8 }}>
            {ALL.length} archetypes
          </div>
          <button
            data-testid="toggle-width"
            onClick={() => setWidth((w) => (w === 'full' ? 'phone' : 'full'))}
            style={{
              width: '100%', marginBottom: 12, padding: '6px 8px', borderRadius: 8,
              background: '#151E32', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: 12,
            }}
          >
            width: {width === 'full' ? 'desktop' : '375px (phone)'}
          </button>
          {GROUPS.map((g) => {
            const items = ALL.filter((e) => e.group === g);
            if (!items.length) return null;
            return (
              <div key={g} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', marginBottom: 4 }}>
                  {g} ({items.length})
                </div>
                {items.map((e) => (
                  <button
                    key={e.key}
                    data-testid={`pick-${e.id}`}
                    onClick={() => setActiveKey(e.key)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '5px 7px', marginBottom: 2, borderRadius: 6, fontSize: 12,
                      background: e.key === activeKey ? '#c4b5fd22' : 'transparent',
                      border: e.key === activeKey ? '1px solid #c4b5fd55' : '1px solid transparent',
                      color: e.key === activeKey ? '#e2e8f0' : '#94a3b8',
                    }}
                  >
                    {e.id}
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        {/* Stage */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: 8 }}>
            <h1 data-testid="active-title" style={{ fontSize: 18, fontWeight: 800 }}>
              {active?.title} <span style={{ color: '#64748b', fontWeight: 400 }}>({active?.id})</span>
            </h1>
            <p style={{ fontSize: 13, color: '#94a3b8' }}>{active?.summary}</p>
          </div>
          <div
            data-testid="sim-stage"
            style={{
              width: width === 'phone' ? 375 : '100%',
              maxWidth: '100%',
              border: '1px dashed rgba(255,255,255,0.12)',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {active && <BlockRenderer key={active.key} block={active.block} />}
          </div>
        </main>
      </div>
    </div>
  );
}
