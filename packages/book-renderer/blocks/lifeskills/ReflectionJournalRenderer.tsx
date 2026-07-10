'use client';

import { useEffect, useRef, useState } from 'react';
import { ReflectionJournalBlock } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';
import { readPractice, writePractice } from './practiceStorage';

// Shared calm Live Books accent (globals.css --book-accent). This file was
// missed in the earlier accent-token migration (found during a full-module
// preview walkthrough, 2026-07-08) — was hardcoded violet, inconsistent with
// every other Life Skills block.
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_DIM = 'var(--book-accent-bg, rgba(159,178,212,0.12))';

interface JournalState {
  text: string;
  updated_at: string; // ISO
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export default function ReflectionJournalRenderer({ block }: { block: ReflectionJournalBlock }) {
  const [text, setText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const stored = readPractice<JournalState>(block.id);
    if (stored?.text) setText(stored.text);
    setLoaded(true);
  }, [block.id]);

  function onChange(value: string) {
    setText(value);
    setSaved(false);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      writePractice<JournalState>(block.id, { text: value, updated_at: new Date().toISOString() });
      setSaved(true);
    }, 600);
  }

  useEffect(() => () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
  }, []);

  const words = countWords(text);

  return (
    <div className="my-8" style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: '1.25rem' }}>
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={{ background: ACCENT_DIM, color: ACCENT }}
        >
          Your Journal
        </span>
        <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
          Private — stays on this device
        </span>
      </div>

      <div className="mb-3">
        <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/90 font-medium">
          {block.prompt}
        </InlineMarkdown>
      </div>

      <textarea
        value={text}
        onChange={e => onChange(e.target.value)}
        disabled={!loaded}
        placeholder={block.placeholder || 'Write whatever comes to mind — no one else will read this.'}
        rows={5}
        className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed resize-y outline-none transition-colors duration-150"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          color: 'rgba(255,255,255,0.85)',
        }}
        onFocus={e => (e.currentTarget.style.border = `1px solid ${ACCENT}`)}
        onBlur={e => (e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)')}
      />

      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[11px] text-white/25">
          {words} {words === 1 ? 'word' : 'words'}
          {block.min_words && words < block.min_words && words > 0 && (
            <span> · try for {block.min_words}+</span>
          )}
        </span>
        {saved && text.trim() && (
          <span className="text-[11px]" style={{ color: ACCENT }}>
            Saved on this device
          </span>
        )}
      </div>
    </div>
  );
}
