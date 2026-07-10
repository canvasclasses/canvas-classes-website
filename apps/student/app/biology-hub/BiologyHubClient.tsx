'use client';

import { useMemo, useState } from 'react';
import { X, Layers, Maximize2 } from 'lucide-react';
import BlockRenderer from '@canvas/book-renderer/BlockRenderer';
import { ExtraSimulatorsProvider } from '@canvas/book-renderer/simulators-context';
import { EXTRA_SIMULATORS } from '@/features/books/lib/extraSimulators';
import {
  BIOLOGY_SIMULATIONS,
  type BiologySimulation,
  type BioGrade,
} from '@canvas/data/simulations/biologySimulations';
import type { SimulationBlock } from '@canvas/data/types/books';

const GRADES: BioGrade[] = [9, 10, 11, 12];

export default function BiologyHubClient() {
  const [grade, setGrade] = useState<BioGrade | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const sims = useMemo(
    () => (grade ? BIOLOGY_SIMULATIONS.filter((s) => s.grades.includes(grade)) : BIOLOGY_SIMULATIONS),
    [grade]
  );
  const open = openId ? BIOLOGY_SIMULATIONS.find((s) => s.id === openId) ?? null : null;
  const liveCount = BIOLOGY_SIMULATIONS.filter((s) => s.status === 'live').length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0B0F15]">
        <div className="max-w-6xl mx-auto px-5 py-8">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400/80">
            Canvas Classes · Interactive Biology
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold">Biology Simulations Hub</h1>
          <p className="mt-2 text-sm text-white/55 max-w-2xl">
            Interactive 3D models and simulations you can rotate, peel apart, slice open and tap to
            explore. {liveCount} live now, more on the way — usable in any Class 9–12 lesson.
          </p>

          {/* Grade filter */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <FilterChip active={grade === null} onClick={() => setGrade(null)}>All grades</FilterChip>
            {GRADES.map((g) => (
              <FilterChip key={g} active={grade === g} onClick={() => setGrade(g)}>
                Class {g}
              </FilterChip>
            ))}
          </div>
        </div>
      </header>

      {/* Card grid */}
      <main className="max-w-6xl mx-auto px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sims.map((s) => (
            <SimCard key={s.id} sim={s} onOpen={() => setOpenId(s.id)} />
          ))}
        </div>
        {sims.length === 0 && (
          <p className="text-center text-sm text-white/40 py-16">
            No simulations tagged for this grade yet.
          </p>
        )}
      </main>

      {/* Player modal */}
      {open && open.status === 'live' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          style={{ background: 'rgba(5,5,5,0.85)' }}
          onClick={() => setOpenId(null)}
        >
          <div
            className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl"
            style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 sticky top-0 bg-[#0d1117] z-10">
              <h2 className="text-sm font-bold text-white/90">{open.title}</h2>
              <button
                onClick={() => setOpenId(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-white/60" />
              </button>
            </div>
            <div className="p-3">
              <ExtraSimulatorsProvider value={EXTRA_SIMULATORS}>
                <BlockRenderer
                  block={{ id: open.id, type: 'simulation', simulation_id: open.id } as SimulationBlock}
                />
              </ExtraSimulatorsProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
      style={{
        background: active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.04)',
        color: active ? '#34d399' : 'rgba(255,255,255,0.5)',
        border: `1px solid ${active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {children}
    </button>
  );
}

function SimCard({ sim, onOpen }: { sim: BiologySimulation; onOpen: () => void }) {
  const live = sim.status === 'live';
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 transition-all"
      style={{
        background: '#0B0F15',
        border: '1px solid rgba(255,255,255,0.06)',
        opacity: live ? 1 : 0.6,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(16,185,129,0.12)' }}
        >
          <Layers size={18} className="text-emerald-400" />
        </div>
        {live ? (
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}>
            Live
          </span>
        ) : (
          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
            Coming soon
          </span>
        )}
      </div>

      <div>
        <h3 className="text-[15px] font-bold text-white/90">{sim.title}</h3>
        <p className="text-[11px] text-emerald-400/70 mt-0.5">{sim.topic}</p>
      </div>
      <p className="text-[12.5px] leading-relaxed text-white/55 flex-1">{sim.description}</p>

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex flex-wrap gap-1">
          {sim.grades.map((g) => (
            <span key={g} className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.45)' }}>
              C{g}
            </span>
          ))}
        </div>
        {live && (
          <button
            onClick={onOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={{ background: 'linear-gradient(135deg, #f97316, #f59e0b)', color: '#000' }}
          >
            <Maximize2 size={13} /> Open
          </button>
        )}
      </div>
    </div>
  );
}
