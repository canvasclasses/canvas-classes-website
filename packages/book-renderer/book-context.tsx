'use client';

import { createContext } from 'react';

// Minimal book identity injected by the consuming app so in-package blocks that
// need to call book-scoped APIs (e.g. chapter_practice → /api/v2/books/practice)
// know which book they're in. Empty default → blocks that need it run in a
// read-only "preview" mode (admin editor), persisting nothing.
export interface BookContextValue {
  bookSlug?: string;
}

export const BookContext = createContext<BookContextValue>({});

export function BookProvider({
  value,
  children,
}: {
  value: BookContextValue;
  children: React.ReactNode;
}) {
  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}
