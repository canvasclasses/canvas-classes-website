'use client';

// VectorLabSim.tsx — Vector Lab, the flagship Mechanics learning solution.
// ─────────────────────────────────────────────────────────────────────────────
// A scenario-driven course that takes a student from "what is a vector" through
// graphical & analytical operations, then into REAL engine-driven dynamics
// (river crossing, live cable tensions, F = ma) and a read-the-diagram mastery
// challenge. Each module targets a documented physics-education-research
// misconception; facts trace to NCERT Class 11.
//
// Two tiers of rendering:
//   • Foundations / Advanced / Mastery → exact SVG geometry (drag handles).
//   • In Motion → a planck (Box2D) physics engine on a real-time canvas. Those
//     three modules are code-split via next/dynamic so planck only loads when a
//     student actually opens a dynamic module.
//
// Self-contained (no @/ imports) → the SAME component powers the embeddable
// 'vector-lab' book block and the standalone /mechanics-hub route.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { C } from './lib/theme';
import { NavButtons } from './components/primitives';
import { MasteryProvider, useMastery } from './learning/mastery';

// Foundations + Advanced + Mastery — static SVG geometry, light to load.
import WhyDirectionPhase from './phases/01_WhyDirection';
import AnatomyPhase from './phases/02_Anatomy';
import GraphicalAdditionPhase from './phases/03_GraphicalAddition';
import ResolutionPhase from './phases/04_Resolution';
import AnalyticalAdditionPhase from './phases/05_AnalyticalAddition';
import SubtractionPhase from './phases/06_Subtraction';
import EquilibriumPhase from './phases/07_Equilibrium';
import DotCrossPhase from './phases/08_DotCross';
import ChallengePhase from './phases/09_Challenge';

// In Motion — engine-driven; lazily loaded so planck is its own chunk.
const loading = () => <div className="min-h-[440px] flex items-center justify-center text-white/30">Loading physics engine…</div>;
const RiverCrossingPhase = dynamic(() => import('./phases/D1_RiverCrossing'), { ssr: false, loading });
const LiveEquilibriumPhase = dynamic(() => import('./phases/D2_LiveEquilibrium'), { ssr: false, loading });
const NetForceMotionPhase = dynamic(() => import('./phases/D3_NetForceMotion'), { ssr: false, loading });

interface PhaseDef {
  id: string;
  label: string;
  section: string;
  Component: React.ComponentType;
}

const PHASES: PhaseDef[] = [
  { id: 'why', label: 'Why Direction', section: 'Foundations', Component: WhyDirectionPhase },
  { id: 'anatomy', label: 'Anatomy', section: 'Foundations', Component: AnatomyPhase },
  { id: 'add-graphical', label: 'Adding (Graphical)', section: 'Foundations', Component: GraphicalAdditionPhase },
  { id: 'resolve', label: 'Resolving', section: 'Foundations', Component: ResolutionPhase },
  { id: 'add-analytical', label: 'Adding (Components)', section: 'Foundations', Component: AnalyticalAdditionPhase },
  { id: 'subtract', label: 'Subtracting', section: 'Foundations', Component: SubtractionPhase },
  { id: 'equilibrium', label: 'Equilibrium (Geometry)', section: 'Foundations', Component: EquilibriumPhase },
  { id: 'd-river', label: 'River Crossing', section: 'In Motion', Component: RiverCrossingPhase },
  { id: 'd-equilibrium', label: 'Live Tensions', section: 'In Motion', Component: LiveEquilibriumPhase },
  { id: 'd-netforce', label: 'Net Force → Motion', section: 'In Motion', Component: NetForceMotionPhase },
  { id: 'dot-cross', label: 'Dot & Cross', section: 'Advanced', Component: DotCrossPhase },
  { id: 'challenge', label: 'Challenge', section: 'Mastery', Component: ChallengePhase },
];

const SECTIONS = ['Foundations', 'In Motion', 'Advanced', 'Mastery'];

function Shell() {
  const [index, setIndex] = useState(0);
  const mastery = useMastery();
  const phase = PHASES[index];
  const Active = phase.Component;
  const go = (i: number) => setIndex(Math.max(0, Math.min(PHASES.length - 1, i)));

  // Opening a module counts toward course progress.
  useEffect(() => {
    mastery.visit(phase.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.id]);

  const pct = Math.round((mastery.visitedCount / PHASES.length) * 100);

  return (
    <div className="p-4 md:p-6" style={{ background: C.root, color: C.text, minHeight: '80vh' }}>
      {/* Header */}
      <div className="mb-4 flex justify-between items-start flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Vector <span style={{ color: C.violet }}>Lab</span>
          </h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: C.muted }}>
            The forces around you, drawn as arrows — and set in motion
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 pt-1 min-w-[160px]">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: C.ghost }}>
            <span>Course progress</span>
            <span style={{ color: C.emeraldLight }}>{mastery.visitedCount}/{PHASES.length}</span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(to right, ${C.indigo}, ${C.emeraldLight})`, transition: 'width 0.4s ease' }} />
          </div>
          {mastery.challengeBest > 0 ? (
            <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.amber }}>
              Challenge streak best · {mastery.challengeBest}
            </div>
          ) : null}
        </div>
      </div>

      {/* Sectioned lesson navigator */}
      <div className="flex flex-col gap-2.5 mb-6">
        {SECTIONS.map((section) => (
          <div key={section} className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-widest w-[88px] shrink-0" style={{ color: C.muted }}>
              {section}
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {PHASES.map((p, i) =>
                p.section === section ? (
                  <button
                    key={p.id}
                    onClick={() => go(i)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all"
                    style={{
                      background: i === index ? 'rgba(129,140,248,0.18)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${i === index ? 'rgba(129,140,248,0.5)' : 'rgba(255,255,255,0.07)'}`,
                      color: i === index ? C.indigoLight : mastery.isVisited(p.id) ? C.text2 : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                      style={{
                        background: mastery.isComplete(p.id) ? '#059669' : i === index ? C.indigo : 'rgba(255,255,255,0.08)',
                        color: 'white',
                      }}
                    >
                      {mastery.isComplete(p.id) ? '✓' : mastery.isVisited(p.id) ? '•' : ''}
                    </span>
                    {p.label}
                  </button>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active module */}
      <div key={phase.id} style={{ animation: 'vl-fade 0.3s ease' }}>
        <Active />
      </div>

      {/* Module navigation */}
      <div className="mt-6">
        <NavButtons
          onBack={index > 0 ? () => go(index - 1) : undefined}
          onNext={index < PHASES.length - 1 ? () => go(index + 1) : undefined}
          backLabel={index > 0 ? PHASES[index - 1].label : undefined}
          nextLabel={index < PHASES.length - 1 ? PHASES[index + 1].label : undefined}
        />
      </div>

      <style>{`@keyframes vl-fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

export default function VectorLabSim() {
  return (
    <MasteryProvider>
      <Shell />
    </MasteryProvider>
  );
}
