'use client';

import { useEffect, useState } from 'react';

/*
 * useResolvedFont
 * ----------------
 * Reads the document's *actual* font-family stack (e.g. "Inter, system-ui,
 * sans-serif") into a string that canvas `ctx.font` accepts. Three of the
 * simulators currently copy-paste this exact 8-line snippet — this hook is
 * the single source of truth.
 *
 * Why canvas needs this:
 *
 *   Canvas 2D's `ctx.font` does NOT inherit from CSS. If you leave the
 *   default, you get "10px sans-serif" which renders as Times on macOS/Safari
 *   in some locales and looks completely out of place next to the Inter-based
 *   rest of the UI. We resolve the actual computed font-family once, keep it
 *   in state, and pass it back to the caller who concats it into a
 *   `"<weight> <size>px <family>"` string.
 *
 * Runs once on mount — we assume the font stack doesn't change for the
 * lifetime of a page, which is true in this app (no theme switching).
 */
export function useResolvedFont(): string {
  const [font, setFont] = useState<string>('system-ui, -apple-system, sans-serif');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const resolved = getComputedStyle(document.body).fontFamily;
      if (resolved && resolved.length > 0) setFont(resolved);
    } catch {
      /* leave default */
    }
  }, []);

  return font;
}
