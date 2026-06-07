'use client';

import { createContext } from 'react';

// Minimal book identity injected by the consuming app so in-package blocks that
// need to call book-scoped APIs (e.g. chapter_practice → /api/v2/books/practice)
// know which book they're in. Empty default → blocks that need it run in a
// read-only "preview" mode (admin editor), persisting nothing.
export interface BookContextValue {
  bookSlug?: string;
  // Optional "leave this activity" handler injected by the practice hub. When
  // present, the chapter_practice / apply_express completion screens show a
  // "Back to chapter hub" button alongside "Practice again". Absent in the admin
  // preview, where there is nowhere to go back to.
  onExit?: () => void;
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
