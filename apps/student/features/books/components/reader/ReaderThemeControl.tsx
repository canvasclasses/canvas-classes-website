'use client';

import { useState, useRef, useEffect } from 'react';
import { SunMoon, Check } from 'lucide-react';
import { useBookTheme, BOOK_THEMES, BOOK_THEME_ORDER } from '@/features/books/hooks/useBookTheme';

/**
 * Reading-brightness control for the book reader header. Opens a small popover
 * with the three dark variants (Midnight / Charcoal / Slate). The choice
 * persists per-device and applies to every reading surface via CSS variables.
 */
export default function ReaderThemeControl() {
  const { theme, setTheme } = useBookTheme();
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
          open ? 'text-amber-400 bg-amber-500/10' : 'text-white/25 hover:text-white/50 hover:bg-white/5'
        }`}
      >
        <SunMoon size={15} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/10 p-1.5 shadow-2xl"
          style={{ background: 'var(--book-surface)' }}
        >
          <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/30">
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
                  <span className="block text-[13px] font-semibold text-white/90">{t.label}</span>
                  <span className="block text-[11px] text-white/40 truncate">{t.hint}</span>
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
