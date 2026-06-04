'use client';

// mastery.tsx — the lightweight progress spine of the learning solution.
// Tracks which modules a student has completed and their best challenge score,
// persisted to localStorage so progress survives reloads. Deliberately NOT
// wired into the app's server-side user-progress system: this component is
// shared (book block + standalone hub) and must stay app-agnostic.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'vectorlab.mastery.v1';

export interface MasteryState {
  /** Modules the student has opened — drives the course-progress bar. */
  visited: Record<string, boolean>;
  /** Modules whose predict-then-reveal checkpoint was answered — drives ✓. */
  completed: Record<string, boolean>;
  challengeBest: number;
}

interface MasteryApi extends MasteryState {
  visit: (id: string) => void;
  complete: (id: string) => void;
  isComplete: (id: string) => boolean;
  isVisited: (id: string) => boolean;
  recordChallenge: (score: number) => void;
  visitedCount: number;
  completedCount: number;
}

const empty: MasteryState = { visited: {}, completed: {}, challengeBest: 0 };

function load(): MasteryState {
  if (typeof window === 'undefined') return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as Partial<MasteryState>;
    return { visited: parsed.visited ?? {}, completed: parsed.completed ?? {}, challengeBest: parsed.challengeBest ?? 0 };
  } catch {
    return empty;
  }
}

const Ctx = createContext<MasteryApi | null>(null);

export function MasteryProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<MasteryState>(empty);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    setState(load());
  }, []);

  // Persist on change.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage full / blocked — progress is best-effort */
    }
  }, [state]);

  const visit = useCallback((id: string) => {
    setState((s) => (s.visited[id] ? s : { ...s, visited: { ...s.visited, [id]: true } }));
  }, []);

  const complete = useCallback((id: string) => {
    setState((s) => (s.completed[id] ? s : { ...s, completed: { ...s.completed, [id]: true } }));
  }, []);

  const recordChallenge = useCallback((score: number) => {
    setState((s) => (score > s.challengeBest ? { ...s, challengeBest: score } : s));
  }, []);

  const api = useMemo<MasteryApi>(
    () => ({
      ...state,
      visit,
      complete,
      isComplete: (id: string) => Boolean(state.completed[id]),
      isVisited: (id: string) => Boolean(state.visited[id]),
      recordChallenge,
      visitedCount: Object.values(state.visited).filter(Boolean).length,
      completedCount: Object.values(state.completed).filter(Boolean).length,
    }),
    [state, visit, complete, recordChallenge]
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useMastery(): MasteryApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useMastery must be used within MasteryProvider');
  return ctx;
}
