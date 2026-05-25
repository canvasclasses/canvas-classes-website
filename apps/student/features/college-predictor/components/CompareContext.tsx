'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Shared store for "pin to compare" across the predictor result cards and
// the floating tray + compare modal. Lives at the predictor root so any card
// can read/write without prop drilling.
//
// MAX_PINNED is 4 — beyond that the side-by-side layout becomes unreadable
// on tablet widths. The tray shows the current count; pin buttons disable
// past the cap.

export const MAX_PINNED = 4;

export interface PinnedItem {
  id: string;              // unique key — usually `${college_id}::${branch_short_name}`
  payload: unknown;        // caller supplies the data; the modal renders it
}

interface ContextValue {
  pinned: PinnedItem[];
  isPinned: (id: string) => boolean;
  toggle: (item: PinnedItem) => void;
  clear: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
}

const Ctx = createContext<ContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [pinned, setPinned] = useState<PinnedItem[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const isPinned = useCallback(
    (id: string) => pinned.some((p) => p.id === id),
    [pinned],
  );

  const toggle = useCallback(
    (item: PinnedItem) => {
      setPinned((prev) => {
        if (prev.some((p) => p.id === item.id)) {
          return prev.filter((p) => p.id !== item.id);
        }
        if (prev.length >= MAX_PINNED) return prev;
        return [...prev, item];
      });
    },
    [],
  );

  const clear = useCallback(() => setPinned([]), []);

  const value = useMemo<ContextValue>(
    () => ({ pinned, isPinned, toggle, clear, openModal, setOpenModal }),
    [pinned, isPinned, toggle, clear, openModal],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompare must be used inside <CompareProvider>');
  return ctx;
}
