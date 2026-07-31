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

// ── Text ink (independent axis, founder request 2026-07-24) ────────────────
// A second, separate brightness control on top of the background theme above
// — some students on very bright screens want dimmer/softer TEXT regardless
// of which background shade they picked. This writes `--book-ink`, the single
// value every `text-white`/`text-white/NN` in the reader resolves through
// (see globals.css's `.book-page-content { --color-white: var(--book-ink) }`
// remap) — so one value here re-tints every reading surface at once, exactly
// like the background theme does for `--book-bg`/`--book-surface`.
export type BookInk = 'bright' | 'warm';

export const BOOK_INKS: Record<BookInk, { label: string; hint: string; value: string }> = {
  bright: { label: 'Bright',       hint: 'Neutral grey — current default', value: '#dbdbdb' },
  warm:   { label: 'Warm & soft',  hint: 'Easier on bright screens',       value: '#d6d0c2' },
};

export const BOOK_INK_ORDER: BookInk[] = ['bright', 'warm'];

const INK_STORAGE_KEY = 'canvas_book_ink';
const INK_EVENT = 'canvas-book-ink';
const INK_DEFAULT: BookInk = 'bright';

function readStoredInk(): BookInk {
  if (typeof window === 'undefined') return INK_DEFAULT;
  try {
    const v = localStorage.getItem(INK_STORAGE_KEY);
    return v === 'bright' || v === 'warm' ? v : INK_DEFAULT;
  } catch {
    return INK_DEFAULT;
  }
}

function applyInkToRoot(ink: BookInk) {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--book-ink', BOOK_INKS[ink].value);
}

/**
 * Mount in any client reading surface to apply the saved theme + text ink.
 * Pass `withControl` semantics by simply using the returned `theme`/`setTheme`
 * and `ink`/`setInk` (the popover control does). Multiple instances stay in
 * sync via a window event + the storage event (other tabs) — one pair of
 * events per axis, so the background and text choices broadcast/persist
 * independently of each other.
 */
export function useBookTheme() {
  const [theme, setThemeState] = useState<BookTheme>(DEFAULT);
  const [ink, setInkState] = useState<BookInk>(INK_DEFAULT);

  useEffect(() => {
    const initialTheme = readStored();
    setThemeState(initialTheme);
    applyToRoot(initialTheme);
    const initialInk = readStoredInk();
    setInkState(initialInk);
    applyInkToRoot(initialInk);

    const onThemeEvent = (e: Event) => {
      const next = (e as CustomEvent<BookTheme>).detail;
      if (next) { setThemeState(next); applyToRoot(next); }
    };
    const onInkEvent = (e: Event) => {
      const next = (e as CustomEvent<BookInk>).detail;
      if (next) { setInkState(next); applyInkToRoot(next); }
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) { const t = readStored(); setThemeState(t); applyToRoot(t); }
      if (e.key === INK_STORAGE_KEY) { const i = readStoredInk(); setInkState(i); applyInkToRoot(i); }
    };
    window.addEventListener(EVENT, onThemeEvent);
    window.addEventListener(INK_EVENT, onInkEvent);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(EVENT, onThemeEvent);
      window.removeEventListener(INK_EVENT, onInkEvent);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const setTheme = useCallback((t: BookTheme) => {
    try { localStorage.setItem(STORAGE_KEY, t); } catch { /* private mode */ }
    applyToRoot(t);
    setThemeState(t);
    window.dispatchEvent(new CustomEvent<BookTheme>(EVENT, { detail: t }));
  }, []);

  const setInk = useCallback((i: BookInk) => {
    try { localStorage.setItem(INK_STORAGE_KEY, i); } catch { /* private mode */ }
    applyInkToRoot(i);
    setInkState(i);
    window.dispatchEvent(new CustomEvent<BookInk>(INK_EVENT, { detail: i }));
  }, []);

  return { theme, setTheme, ink, setInk };
}
