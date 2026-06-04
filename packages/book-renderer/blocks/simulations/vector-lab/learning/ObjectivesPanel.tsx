'use client';

// ObjectivesPanel.tsx — the "what you'll learn here" header each module opens
// with. Tiny, scannable, and shows a ✓ once the module's checkpoint is cleared.

import { C } from '../lib/theme';
import { useMastery } from './mastery';

export function ObjectivesPanel({ moduleId, objectives }: { moduleId: string; objectives: string[] }) {
  const { isComplete } = useMastery();
  const done = isComplete(moduleId);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: done ? C.emeraldLight : C.muted }}>
          {done ? '✓ Mastered' : 'In this module'}
        </p>
      </div>
      <ul className="flex flex-col gap-1">
        {objectives.map((o, i) => (
          <li key={i} className="flex items-start gap-2 text-sm leading-snug" style={{ color: C.text2 }}>
            <span style={{ color: done ? C.emeraldLight : C.indigo }} className="mt-0.5">
              {done ? '✓' : '→'}
            </span>
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
