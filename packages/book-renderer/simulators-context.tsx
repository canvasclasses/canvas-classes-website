'use client';

import { createContext } from 'react';

// Allows the consuming app to register extra simulators that can't ship in
// this package (e.g. app-route-local simulators that depend on app-only UI).
// The reader merges this map with the in-package registry so any simulator
// id resolves regardless of which side it lives on.
//
// Empty default — admin's preview pane uses this as-is, which means an
// app-only simulator renders as "Simulator not found" in the editor preview.
// That is intentional: those simulators only run in the student site.
export type ExtraSimulators = Readonly<Record<string, React.ComponentType>>;

export const ExtraSimulatorsContext = createContext<ExtraSimulators>({});

export function ExtraSimulatorsProvider({
  value,
  children,
}: {
  value: ExtraSimulators;
  children: React.ReactNode;
}) {
  return (
    <ExtraSimulatorsContext.Provider value={value}>
      {children}
    </ExtraSimulatorsContext.Provider>
  );
}
