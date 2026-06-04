'use client';

import { createContext } from 'react';
import type { VaultWord } from '@canvas/data/books/vocabulary';

// Lets the consuming app wire the Word Vault into the reader. The English
// passage/vocabulary renderers read this to offer a "Save to Vault" action on
// glossed words and vocab cards. Empty default → no save action is shown
// (correct for the admin preview pane and any non-English book).
export interface VaultContextValue {
  onSaveWord?: (word: VaultWord) => void;
  isWordSaved?: (wordId: string) => boolean;
}

export const VaultContext = createContext<VaultContextValue>({});

export function VaultProvider({
  value,
  children,
}: {
  value: VaultContextValue;
  children: React.ReactNode;
}) {
  return <VaultContext.Provider value={value}>{children}</VaultContext.Provider>;
}
