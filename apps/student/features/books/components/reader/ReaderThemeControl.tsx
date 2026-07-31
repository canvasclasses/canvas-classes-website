'use client';

import { useState, useRef, useEffect } from 'react';
import { SunMoon, Check } from 'lucide-react';
import { useBookTheme, BOOK_THEMES, BOOK_THEME_ORDER, BOOK_INKS, BOOK_INK_ORDER } from '@/features/books/hooks/useBookTheme';

/**
 * Reading-brightness control for the book reader header. Opens a small popover
 * with two independent choices — the background shade (Midnight / Charcoal /
 * Slate) and the text color (Bright / Warm & soft, founder request 2026-07-24
 * for students on very bright screens). Both persist per-device and apply to
 * every reading surface via CSS variables.
 */
export default function ReaderThemeControl() {
  const { theme, setTheme, ink, setInk } = useBookTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Reading brightness"
        aria-label="Reading brightness"
        className={`p-1.5 rounded-lg transition-colors ${
          open ? 'text-amber-400 bg-amber-500/10' : 'text-white/45 hover:text-white/60 hover:bg-white/5'
        }`}
      >
        <SunMoon size={15} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/10 p-1.5 shadow-2xl"
          style={{ background: 'var(--book-surface)' }}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/45">
            Reading brightness
          </div>
          {BOOK_THEME_ORDER.map((key) => {
            const t = BOOK_THEMES[key];
            const active = theme === key;
            return (
              <button
                key={key}
                onClick={() => { setTheme(key); }}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                  active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-md border border-white/15 shrink-0"
                  style={{ background: t.bg, boxShadow: `inset 0 0 0 4px ${t.surface}` }}
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-white/85">{t.label}</span>
                  <span className="block text-[11px] text-white/45 truncate">{t.hint}</span>
                </span>
                {active && <Check size={15} className="text-amber-400 shrink-0" />}
              </button>
            );
          })}

          <div className="mt-1 pt-1.5 border-t border-white/10 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/45">
            Text color
          </div>
          {BOOK_INK_ORDER.map((key) => {
            const i = BOOK_INKS[key];
            const active = ink === key;
            return (
              <button
                key={key}
                onClick={() => { setInk(key); }}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors ${
                  active ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className="w-7 h-7 rounded-md border border-white/15 shrink-0 flex items-center justify-center text-[13px] font-bold"
                  style={{ background: 'var(--book-surface)', color: i.value }}
                >
                  Aa
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-white/85">{i.label}</span>
                  <span className="block text-[11px] text-white/45 truncate">{i.hint}</span>
                </span>
                {active && <Check size={15} className="text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
