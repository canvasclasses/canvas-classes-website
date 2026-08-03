'use client';

/*
 * /sim-review — TEMPORARY QA harness for the physics engines.
 * ─────────────────────────────────────────────────────────────────────────────
 * Enumerates EVERY archetype in every library and renders it through the real
 * BlockRenderer path, so what is tested is exactly what a reader gets.
 *
 * DELETE THIS ROUTE before release. It is a live public page on the student app,
 * unlinked and absent from the sitemap, but reachable by URL.
 *
 * Each entry carries the block's required discriminators (mode / scenario /
 * kind) read from the archetype itself, because getting those wrong renders a
 * placeholder and would silently "pass" a sim that never ran.
 */

import { useState } from 'react';
import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
import { FBD_ARCHETYPES } from '@canvas/book-renderer/mechanics-bench/fbd';
import { PULLEY_ARCHETYPES } from '@canvas/book-renderer/mechanics-bench/pulley';
import { ENERGY_ARCHETYPES } from '@canvas/book-renderer/mechanics-bench/energy';
import { ROTATION_ARCHETYPES } from '@canvas/book-renderer/mechanics-bench/rotation';
import { PROJECTILE_ARCHETYPES } from '@canvas/book-renderer/motion-lab/projectile';
import { CIRCULAR_ARCHETYPES } from '@canvas/book-renderer/motion-lab/circular';
import { GRAPHS_ARCHETYPES } from '@canvas/book-renderer/motion-lab/graphs';
import { WAVES_ARCHETYPES } from '@canvas/book-renderer/motion-lab/waves';
import { THERMO_ARCHETYPES } from '@canvas/book-renderer/motion-lab/thermo';
import { CIRCUIT_ARCHETYPES } from '@canvas/book-renderer/circuit-bench';
import { AC_ARCHETYPES } from '@canvas/book-renderer/circuit-bench/ac';
import { SEMICONDUCTOR_ARCHETYPES } from '@canvas/book-renderer/circuit-bench/semiconductor';
import { OPTICS_ARCHETYPES } from '@canvas/book-renderer/optics-bench';
import { FIELD_ARCHETYPES } from '@canvas/book-renderer/field-bench';
import { NUCLEAR_ARCHETYPES } from '@canvas/book-renderer/field-bench/nuclear';
import type { ContentBlock } from '@canvas/data/types/books';

type Any = Record<string, unknown>;
const list = (m: unknown): Any[] =>
  Array.isArray(m) ? (m as Any[]) : Object.values((m ?? {}) as Record<string, Any>);

interface Entry { key: string; id: string; group: string; title: string; block: ContentBlock }

const entries: Entry[] = [];
let n = 0;
const add = (group: string, m: unknown, mk: (a: Any) => Any) => {
  for (const a of list(m)) {
    const id = String(a.id ?? `?${n}`);
    entries.push({
      key: `${group}:${id}:${n++}`,
      id,
      group,
      title: String(a.title ?? id),
      block: { id: `blk-${n}`, order: 0, ...mk(a) } as unknown as ContentBlock,
    });
  }
};

// ── mechanics_bench ──────────────────────────────────────────────────────────
add('FBD Studio', FBD_ARCHETYPES, (a) => ({
  type: 'mechanics_bench', mode: 'fbd', archetype: a.id, title: a.title,
  show: { grid: true, axes: true, readout: true, equations: true, values: true },
  fbd: { body: (a.defaultBody as string) ?? 'm1', prompt: 'Draw the free-body diagram for this body.',
         require_agent: true, allow_cut: true, then_solve: true },
}));
add('Pulley Lab', PULLEY_ARCHETYPES, (a) => ({
  type: 'mechanics_bench', mode: 'pulley', archetype: a.id, title: a.title,
  show: { readout: true, equations: true, values: true },
  pulley: { prompt: 'Predict, then run.', show_constraint_ledger: true, allow_extend: true },
}));
add('Energy', ENERGY_ARCHETYPES, (a) => ({
  type: 'mechanics_bench', mode: 'energy', archetype: a.id, title: a.title,
}));
add('Rotation', ROTATION_ARCHETYPES, (a) => ({
  type: 'mechanics_bench', mode: 'rotation', archetype: a.id, title: a.title,
}));

// ── motion_lab. Graphs/Waves/Thermo all use scenario 'graphs' and are told
//    apart by archetype id — mirror that here or they render a placeholder. ──
add('Projectile', PROJECTILE_ARCHETYPES, (a) => ({
  type: 'motion_lab', scenario: a.scenario ?? 'projectile', archetype: a.id, title: a.title,
  show: { grid: true, trail: true, vectors: true, readout: true }, allow_release: true,
}));
add('Circular Arena', CIRCULAR_ARCHETYPES, (a) => ({
  type: 'motion_lab', scenario: a.scenario ?? 'circular', archetype: a.id, title: a.title,
  show: { grid: true, trail: true, vectors: true, readout: true }, allow_release: true,
}));
add('Motion Graphs', GRAPHS_ARCHETYPES, (a) => ({
  type: 'motion_lab', scenario: 'graphs', archetype: a.id, title: a.title,
}));
add('Waves', WAVES_ARCHETYPES, (a) => ({
  type: 'motion_lab', scenario: 'graphs', archetype: a.id, title: a.title,
}));
add('Thermo', THERMO_ARCHETYPES, (a) => ({
  type: 'motion_lab', scenario: 'graphs', archetype: a.id, title: a.title,
}));

// ── circuit_bench (AC + semiconductor route on the archetype id) ─────────────
const circuitBlock = (a: Any) => ({
  type: 'circuit_bench', archetype: a.id, title: a.title,
  show: { redraw: true, potentialHeatmap: true, currentWidth: true, values: true, equations: true },
});
add('Circuit Bench', CIRCUIT_ARCHETYPES, circuitBlock);
add('AC Bench', AC_ARCHETYPES, circuitBlock);
add('Semiconductor', SEMICONDUCTOR_ARCHETYPES, circuitBlock);

// ── optics_bench ─────────────────────────────────────────────────────────────
add('Optics Bench', OPTICS_ARCHETYPES, (a) => ({
  type: 'optics_bench', mode: a.mode ?? 'bench', archetype: a.id, title: a.title,
  show: { constructionRays: true, realFan: true, image: true, labels: true, magnification: true },
}));

// ── field_bench (FIELD_ARCHETYPES already merges EMI; nuclear routes by id) ──
add('Field Bench', FIELD_ARCHETYPES, (a) => ({
  type: 'field_bench', kind: a.kind ?? 'electric', mode: a.mode ?? 'sculptor',
  archetype: a.id, title: a.title,
  show: { fieldLines: true, equipotentials: true, vectors: true, flux: true },
  allow_drag_surface: true,
}));
add('Nuclear Bench', NUCLEAR_ARCHETYPES, (a) => ({
  type: 'field_bench', kind: a.kind ?? 'electric', mode: a.mode ?? 'sculptor',
  archetype: a.id, title: a.title,
}));

const GROUPS = [...new Set(entries.map((e) => e.group))];

export default function SimReviewPage() {
  const [activeKey, setActiveKey] = useState(entries[0]?.key ?? '');
  const [width, setWidth] = useState<'full' | 'phone'>('full');
  const active = entries.find((e) => e.key === activeKey) ?? entries[0];

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e2e8f0' }}>
      <div style={{ display: 'flex', gap: 16, padding: 16, alignItems: 'flex-start' }}>
        <aside data-testid="sim-picker" style={{
          width: 250, flexShrink: 0, position: 'sticky', top: 16,
          maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
          background: '#0B0F15', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, padding: 12,
        }}>
          <div data-testid="total" style={{ fontSize: 12, color: '#8b99ad', marginBottom: 8 }}>
            {entries.length} archetypes
          </div>
          <button data-testid="toggle-width"
            onClick={() => setWidth((w) => (w === 'full' ? 'phone' : 'full'))}
            style={{ width: '100%', marginBottom: 12, padding: '6px 8px', borderRadius: 8,
              background: '#151E32', border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0', fontSize: 12 }}>
            width: {width === 'full' ? 'desktop' : '375px'}
          </button>
          {GROUPS.map((g) => {
            const items = entries.filter((e) => e.group === g);
            return (
              <div key={g} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#c4b5fd', marginBottom: 3 }}>
                  {g} ({items.length})
                </div>
                {items.map((e) => (
                  <button key={e.key} data-testid={`pick-${e.key}`} data-arch={e.id}
                    onClick={() => setActiveKey(e.key)}
                    style={{ display: 'block', width: '100%', textAlign: 'left',
                      padding: '4px 6px', marginBottom: 1, borderRadius: 5, fontSize: 11,
                      background: e.key === activeKey ? '#c4b5fd22' : 'transparent',
                      border: e.key === activeKey ? '1px solid #c4b5fd55' : '1px solid transparent',
                      color: e.key === activeKey ? '#e2e8f0' : '#8b99ad' }}>
                    {e.id}
                  </button>
                ))}
              </div>
            );
          })}
        </aside>

        <main style={{ flex: 1, minWidth: 0 }}>
          <h1 data-testid="active-title" style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
            {active?.group} · {active?.id}
          </h1>
          <div data-testid="sim-stage" style={{
            width: width === 'phone' ? 375 : '100%', maxWidth: '100%',
            border: '1px dashed rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden',
          }}>
            {active && <BlockRenderer key={active.key} block={active.block} />}
          </div>
        </main>
      </div>
    </div>
  );
}
