'use client';

import { useState, useRef, useEffect, useMemo, useContext } from 'react';
import { NarratedPassageBlock, NarratedSentence, WordGloss } from '@canvas/data/types/books';
import { wordIdFor } from '@canvas/data/books/vocabulary';
import { VaultContext } from '../../vault-context';
import InlineMarkdown from '../InlineMarkdown';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Tokenises a sentence into spans, marking which spans are glossed words.
 * A "word" in `glosses[].word` may be a single word or a short phrase. We match
 * it as a substring (case-insensitive) and respect `occurrence` for repeats.
 */
function tokenise(text: string, glosses: WordGloss[] = []) {
  if (glosses.length === 0) return [{ text, gloss: null as WordGloss | null }];

  // Track how many times each gloss target has already been consumed.
  const consumed = new Map<string, number>();

  type Slice = { start: number; end: number; gloss: WordGloss };
  const slices: Slice[] = [];

  for (const gloss of glosses) {
    const targetOccurrence = gloss.occurrence ?? 1;
    const key = gloss.word.toLowerCase();
    let alreadySeen = consumed.get(key) ?? 0;
    let from = 0;
    while (alreadySeen < targetOccurrence) {
      const idx = text.toLowerCase().indexOf(key, from);
      if (idx === -1) break;
      alreadySeen += 1;
      if (alreadySeen === targetOccurrence) {
        slices.push({ start: idx, end: idx + gloss.word.length, gloss });
        consumed.set(key, alreadySeen);
        break;
      }
      from = idx + gloss.word.length;
    }
  }

  // Sort by start, drop overlaps (first match wins).
  slices.sort((a, b) => a.start - b.start);
  const filtered: Slice[] = [];
  let lastEnd = -1;
  for (const s of slices) {
    if (s.start >= lastEnd) {
      filtered.push(s);
      lastEnd = s.end;
    }
  }

  // Stitch into spans.
  const spans: { text: string; gloss: WordGloss | null }[] = [];
  let cursor = 0;
  for (const s of filtered) {
    if (s.start > cursor) spans.push({ text: text.slice(cursor, s.start), gloss: null });
    spans.push({ text: text.slice(s.start, s.end), gloss: s.gloss });
    cursor = s.end;
  }
  if (cursor < text.length) spans.push({ text: text.slice(cursor), gloss: null });

  return spans;
}

// ── Sentence component ───────────────────────────────────────────────────────

function Sentence({
  sentence,
  active,
  onPlay,
  audioFallback,
}: {
  sentence: NarratedSentence;
  active: boolean;
  onPlay: () => void;
  audioFallback: 'tts' | 'silent' | 'hide';
}) {
  const [openGloss, setOpenGloss] = useState<WordGloss | null>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const { onSaveWord, isWordSaved } = useContext(VaultContext);

  // Close gloss popover on click-outside.
  useEffect(() => {
    if (!openGloss) return;
    function onDoc(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpenGloss(null);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openGloss]);

  const tokens = useMemo(() => tokenise(sentence.text, sentence.glosses), [sentence]);

  const hasRealAudio = !!sentence.audio_url;
  const showPlay =
    hasRealAudio || audioFallback === 'tts' || audioFallback === 'silent';

  return (
    <span
      ref={wrapperRef}
      className="inline relative"
      style={{
        background: active ? 'rgba(251,191,36,0.06)' : 'transparent',
        borderRadius: 4,
        padding: active ? '1px 2px' : 0,
        transition: 'background 150ms ease',
      }}
    >
      {tokens.map((tok, i) =>
        tok.gloss ? (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenGloss(tok.gloss);
            }}
            className="inline cursor-pointer"
            style={{
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              textDecorationColor: 'rgba(251,191,36,0.45)',
              textUnderlineOffset: 3,
              color: 'inherit',
              background: 'transparent',
              border: 'none',
              padding: 0,
              font: 'inherit',
            }}
          >
            {tok.text}
          </button>
        ) : (
          <span key={i}>{tok.text}</span>
        )
      )}
      {showPlay && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay();
          }}
          aria-label="Play this sentence"
          className="inline-flex items-center justify-center align-middle ml-1 rounded-full hover:scale-110 transition-transform"
          style={{
            width: 16,
            height: 16,
            background: active ? 'rgba(251,191,36,0.25)' : 'rgba(255,255,255,0.06)',
            color: active ? '#fbbf24' : 'rgba(255,255,255,0.45)',
            fontSize: 9,
            lineHeight: 1,
            border: 'none',
            cursor: 'pointer',
            verticalAlign: 'baseline',
          }}
        >
          ▶
        </button>
      )}{' '}
      {openGloss && (
        <span
          className="absolute z-20 left-0 top-full mt-2 block"
          style={{
            background: '#0B0F15',
            border: '1px solid rgba(251,191,36,0.25)',
            borderRadius: 12,
            padding: '12px 14px',
            minWidth: 240,
            maxWidth: 320,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}
        >
          <span className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-[15px]" style={{ color: '#fbbf24' }}>
              {openGloss.word}
            </span>
            {openGloss.pos && (
              <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {openGloss.pos}
              </span>
            )}
          </span>
          <span className="block text-[13px] leading-snug mb-1.5" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {openGloss.meaning}
          </span>
          {openGloss.hindi && (
            <span className="block text-[13px] mb-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
              हिंदी: <span className="font-medium">{openGloss.hindi}</span>
            </span>
          )}
          {openGloss.example && (
            <span
              className="block text-[12px] italic leading-snug"
              style={{ color: 'rgba(255,255,255,0.45)', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8, marginTop: 6 }}
            >
              “{openGloss.example}”
            </span>
          )}
          {onSaveWord && (() => {
            const saved = isWordSaved?.(wordIdFor(openGloss.word)) ?? false;
            return (
              <button
                type="button"
                disabled={saved}
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveWord({
                    wordId: wordIdFor(openGloss.word),
                    word: openGloss.word,
                    meaning: openGloss.meaning,
                    pos: openGloss.pos,
                    hindi: openGloss.hindi,
                    example: openGloss.example,
                    source: 'gloss',
                  });
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
                style={{
                  background: saved ? 'rgba(16,185,129,0.12)' : 'rgba(251,191,36,0.14)',
                  border: `1px solid ${saved ? 'rgba(16,185,129,0.4)' : 'rgba(251,191,36,0.4)'}`,
                  color: saved ? '#34d399' : '#fbbf24',
                  cursor: saved ? 'default' : 'pointer',
                }}
              >
                {saved ? '✓ In your Word Vault' : '+ Save to Word Vault'}
              </button>
            );
          })()}
        </span>
      )}
    </span>
  );
}

// ── Block component ──────────────────────────────────────────────────────────

export default function NarratedPassageRenderer({
  block,
  audioFallback = 'hide',
}: {
  block: NarratedPassageBlock;
  audioFallback?: 'tts' | 'silent' | 'hide';
}) {
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [showHinglish, setShowHinglish] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Any paragraph has Hinglish commentary? Show the toggle.
  const hasHinglish = block.paragraphs.some((p) => !!p.hinglish_commentary);

  function playSentence(s: NarratedSentence) {
    setActiveSentenceId(s.id);
    if (s.audio_url) {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = s.audio_url;
      audioRef.current.onended = () => setActiveSentenceId(null);
      audioRef.current.play().catch(() => setActiveSentenceId(null));
    } else if (audioFallback === 'tts' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(s.text);
      u.rate = 0.9;
      u.onend = () => setActiveSentenceId(null);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } else {
      // 'silent' — just flash the highlight briefly.
      setTimeout(() => setActiveSentenceId(null), 500);
    }
  }

  return (
    <div className="my-8 rounded-2xl border border-amber-500/15 bg-amber-500/[0.02] px-5 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-bold">¶</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70">
            {block.source_label || 'Read'}
          </span>
        </div>
        {hasHinglish && (
          <button
            onClick={() => setShowHinglish((s) => !s)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
            style={{
              background: showHinglish ? 'rgba(251,191,36,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${showHinglish ? 'rgba(251,191,36,0.35)' : 'rgba(255,255,255,0.08)'}`,
              color: showHinglish ? '#fbbf24' : 'rgba(255,255,255,0.45)',
            }}
          >
            {showHinglish ? 'हिंदी ✓' : 'Hindi'}
          </button>
        )}
      </div>

      {block.paragraphs.map((p) => (
        <div key={p.id} className="mb-5 last:mb-0">
          <p
            className="text-[16px] leading-[1.75] font-serif"
            style={{ color: 'rgba(255,255,255,0.88)' }}
          >
            {p.sentences.map((s, i) => (
              <span key={s.id}>
                <Sentence
                  sentence={s}
                  active={activeSentenceId === s.id}
                  onPlay={() => playSentence(s)}
                  audioFallback={audioFallback}
                />
                {i < p.sentences.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          {showHinglish && p.hinglish_commentary && (
            <div
              className="mt-3 pl-3 text-[14px] leading-relaxed"
              style={{
                color: 'rgba(255,255,255,0.55)',
                borderLeft: '2px solid rgba(251,191,36,0.35)',
              }}
            >
              <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed">
                {p.hinglish_commentary}
              </InlineMarkdown>
            </div>
          )}
        </div>
      ))}

      <div className="mt-4 pt-3 border-t border-white/5 text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Tap any <span className="underline decoration-dotted" style={{ textDecorationColor: 'rgba(251,191,36,0.5)' }}>underlined word</span> for its meaning. Tap ▶ to hear a sentence.
      </div>
    </div>
  );
}
