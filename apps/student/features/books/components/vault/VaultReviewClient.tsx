'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, Library, Volume2, Check } from 'lucide-react';
import { useVaultProgress } from '@/features/books/hooks/useVaultProgress';
import { getMasteryLevel, type QualityRating } from '@/lib/spacedRepetition';
import type { VaultWord } from '@canvas/data/books/vocabulary';

interface Props {
  bookSlug: string;
  bookTitle: string;
  basePath: string;
}

// Maps the four review buttons to the engine's quality scale
// (qualityToRating: <3 Again, 3 Hard, 4 Good, 5 Easy).
const RATINGS: { label: string; quality: QualityRating; color: string }[] = [
  { label: 'Again', quality: 1, color: '#f87171' },
  { label: 'Hard', quality: 3, color: '#fbbf24' },
  { label: 'Good', quality: 4, color: '#34d399' },
  { label: 'Easy', quality: 5, color: '#7dd3fc' },
];

function speak(word: string, audioUrl?: string) {
  if (audioUrl) {
    new Audio(audioUrl).play().catch(() => {});
  } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(word);
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }
}

export default function VaultReviewClient({ bookSlug, bookTitle, basePath }: Props) {
  const vault = useVaultProgress(bookSlug);
  const [deck, setDeck] = useState<VaultWord[]>([]);
  const [deckLoaded, setDeckLoaded] = useState(false);

  // Review session is a frozen snapshot of the due queue taken when the user
  // hits "Start" — so rescheduling a card mid-session doesn't reshuffle it.
  const [session, setSession] = useState<VaultWord[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/v2/books/${bookSlug}/vocabulary`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (cancelled) return;
        setDeck((body?.data?.words ?? []) as VaultWord[]);
        setDeckLoaded(true);
      })
      .catch(() => { if (!cancelled) setDeckLoaded(true); });
    return () => { cancelled = true; };
  }, [bookSlug]);

  const savedWords = useMemo(
    () => deck.filter((w) => vault.cards[w.wordId]),
    [deck, vault.cards]
  );
  const dueWords = useMemo(() => vault.dueWords(deck), [deck, vault]);
  const masteredCount = useMemo(
    () => savedWords.filter((w) => {
      const c = vault.cards[w.wordId];
      return c && getMasteryLevel(c) === 'mastered';
    }).length,
    [savedWords, vault.cards]
  );

  const startReview = useCallback(() => {
    setSession(dueWords);
    setIdx(0);
    setRevealed(false);
  }, [dueWords]);

  const rate = useCallback((quality: QualityRating) => {
    if (!session) return;
    const word = session[idx];
    vault.reviewWord(word.wordId, quality);
    if (idx + 1 >= session.length) {
      setSession(null); // session complete
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  }, [session, idx, vault]);

  const loading = !deckLoaded || !vault.isLoaded;

  // ── Review session view ────────────────────────────────────────────────
  if (session && session.length > 0) {
    const word = session[idx];
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-lg flex items-center justify-between mb-8">
          <button onClick={() => setSession(null)} className="text-white/40 hover:text-white/70 flex items-center gap-1 text-sm">
            <ChevronLeft size={16} /> End session
          </button>
          <span className="text-xs text-white/40 tabular-nums">{idx + 1} / {session.length}</span>
        </div>

        <div className="w-full max-w-lg flex-1 flex flex-col items-center justify-center">
          <button
            onClick={() => speak(word.word, undefined)}
            className="mb-3 inline-flex items-center gap-2 text-[34px] font-bold text-sky-300"
          >
            {word.word} <Volume2 size={20} className="text-sky-500/60" />
          </button>
          {word.pronunciation && (
            <p className="text-sm font-mono text-sky-400/60 mb-2">{word.pronunciation}</p>
          )}
          {word.pos && <p className="text-[11px] uppercase tracking-wider text-white/35 mb-8">{word.pos}</p>}

          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm text-white/70"
            >
              Show meaning
            </button>
          ) : (
            <div className="w-full text-center">
              <p className="text-lg font-semibold text-white/90 mb-2">{word.meaning}</p>
              {word.hindi && <p className="text-base text-sky-300/85 mb-3">हिंदी: {word.hindi}</p>}
              {word.example && (
                <p className="text-sm italic text-white/50 border-t border-white/8 pt-3 mt-3">“{word.example}”</p>
              )}
            </div>
          )}
        </div>

        {revealed && (
          <div className="w-full max-w-lg grid grid-cols-4 gap-2 mt-8">
            {RATINGS.map((r) => (
              <button
                key={r.label}
                onClick={() => rate(r.quality)}
                className="py-3 rounded-xl text-sm font-semibold border transition-colors"
                style={{ color: r.color, borderColor: `${r.color}55`, background: `${r.color}14` }}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Hub view (stats + browse + start) ──────────────────────────────────
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-30 bg-[#0B0F15]/95 backdrop-blur border-b border-white/8">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center gap-3">
          <Link href={basePath} className="text-white/40 hover:text-white/70"><ChevronLeft size={18} /></Link>
          <Library size={15} className="text-sky-400" />
          <span className="text-sm text-white/70 font-medium">Word Vault</span>
          <span className="text-xs text-white/30 truncate">· {bookTitle}</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-white/40 py-20">Loading your vault…</p>
        ) : savedWords.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-5">
              <Library size={28} className="text-sky-400" />
            </div>
            <h2 className="text-xl font-bold mb-2">Your Word Vault is empty</h2>
            <p className="text-sm text-white/50 max-w-sm mx-auto mb-6">
              While you read, tap any <span className="underline decoration-dotted decoration-amber-400/60">underlined word</span> in a
              passage — or a vocabulary card — and choose <span className="text-sky-300 font-medium">“Save to Word Vault.”</span> Saved
              words come back here for spaced-repetition review so they stick.
            </p>
            <Link href={basePath} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm">
              Start reading
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl bg-white/[0.03] border border-white/8 p-4 text-center">
                <div className="text-2xl font-bold text-white">{savedWords.length}</div>
                <div className="text-[11px] text-white/40 uppercase tracking-wide">Saved</div>
              </div>
              <div className="rounded-2xl bg-sky-500/[0.06] border border-sky-500/20 p-4 text-center">
                <div className="text-2xl font-bold text-sky-300">{dueWords.length}</div>
                <div className="text-[11px] text-sky-400/60 uppercase tracking-wide">Due today</div>
              </div>
              <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4 text-center">
                <div className="text-2xl font-bold text-emerald-300">{masteredCount}</div>
                <div className="text-[11px] text-emerald-400/60 uppercase tracking-wide">Mastered</div>
              </div>
            </div>

            {/* Start review */}
            {dueWords.length > 0 ? (
              <button
                onClick={startReview}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 text-black font-bold mb-8"
              >
                Review {dueWords.length} word{dueWords.length === 1 ? '' : 's'}
              </button>
            ) : (
              <div className="w-full py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300
                font-semibold text-center mb-8 flex items-center justify-center gap-2">
                <Check size={16} /> All caught up — nothing due right now
              </div>
            )}

            {/* Browse all saved words */}
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/35 mb-3">All saved words</h3>
            <div className="space-y-2">
              {savedWords.map((w) => {
                const card = vault.cards[w.wordId];
                const level = card ? getMasteryLevel(card) : 'new';
                const isDue = dueWords.some((d) => d.wordId === w.wordId);
                return (
                  <div key={w.wordId} className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/6 px-4 py-3">
                    <button onClick={() => speak(w.word, undefined)} className="text-sky-300 font-semibold shrink-0">
                      {w.word}
                    </button>
                    <span className="text-sm text-white/50 truncate flex-1">{w.meaning}</span>
                    <span
                      className="text-[10px] uppercase tracking-wide shrink-0 px-2 py-0.5 rounded-full"
                      style={
                        isDue
                          ? { color: '#7dd3fc', background: 'rgba(14,165,233,0.12)' }
                          : level === 'mastered'
                            ? { color: '#34d399', background: 'rgba(16,185,129,0.12)' }
                            : { color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)' }
                      }
                    >
                      {isDue ? 'due' : level}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
