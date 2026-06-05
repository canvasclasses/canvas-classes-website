'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Live Books reading theme — a brightness ladder of three dark variants.
 *
 * Light/sepia are deliberately NOT offered: the whole platform is dark-native
 * (every generated image has a dark background + light content, all body text
 * is white), so a light page would break the images and the text. These three
 * only vary *how dark* the page + surface are — text and images are untouched,
 * which keeps the switch trivially safe.
 *
 * The chosen theme is written to <html> as `--book-bg` / `--book-surface`, so
 * every reading surface that uses `bg-[var(--book-bg)]` honours it. Defaults
 * live in globals.css `:root` (Charcoal) so SSR never flashes.
 */
export type BookTheme = 'midnight' | 'charcoal' | 'slate';

export const BOOK_THEMES: Record<BookTheme, { label: string; hint: string; bg: string; surface: string }> = {
  midnight: { label: 'Midnight', hint: 'Darkest — for dark rooms', bg: '#0B0C0F', surface: '#141620' },
  charcoal: { label: 'Charcoal', hint: 'Balanced — recommended',   bg: '#121316', surface: '#181A21' },
  slate:    { label: 'Slate',    hint: 'Softest — least harsh',     bg: '#1A1C22', surface: '#22242E' },
};

export const BOOK_THEME_ORDER: BookTheme[] = ['midnight', 'charcoal', 'slate'];

const STORAGE_KEY = 'canvas_book_theme';
const EVENT = 'canvas-book-theme';
const DEFAULT: BookTheme = 'charcoal';

function readStored(): BookTheme {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'midnight' || v === 'charcoal' || v === 'slate' ? v : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

function applyToRoot(theme: BookTheme) {
  if (typeof document === 'undefined') return;
  const t = BOOK_THEMES[theme];
  const root = document.documentElement;
  root.style.setProperty('--book-bg', t.bg);
  root.style.setProperty('--book-surface', t.surface);
}

/**
 * Mount in any client reading surface to apply the saved theme. Pass
 * `withControl` semantics by simply using the returned `theme`/`setTheme`
 * (the popover control does). Multiple instances stay in sync via a window
 * event + the storage event (other tabs).
 */
export function useBookTheme() {
  const [theme, setThemeState] = useState<BookTheme>(DEFAULT);

  useEffect(() => {
    const initial = readStored();
    setThemeState(initial);
    applyToRoot(initial);

    const onEvent = (e: Event) => {
      const next = (e as CustomEvent<BookTheme>).detail;
      if (next) { setThemeState(next); applyToRoot(next); }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) { const t = readStored(); setThemeState(t); applyToRoot(t); }
    };
    window.addEventListener(EVENT, onEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setTheme = useCallback((t: BookTheme) => {
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* private mode */ }
    applyToRoot(t);
    setThemeState(t);
    window.dispatchEvent(new CustomEvent<BookTheme>(EVENT, { detail: t }));
  }, []);

  return { theme, setTheme };
}
