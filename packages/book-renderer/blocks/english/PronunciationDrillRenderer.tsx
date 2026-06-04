'use client';

import { useState } from 'react';
import { PronunciationDrillBlock, PronunciationWord } from '@canvas/data/types/books';

function Word({ word }: { word: PronunciationWord }) {
  const [playing, setPlaying] = useState(false);
  const [showMistake, setShowMistake] = useState(false);

  function play() {
    if (playing) return;
    setPlaying(true);
    if (word.audio_url) {
      const audio = new Audio(word.audio_url);
      audio.onended = () => setPlaying(false);
      audio.play().catch(() => setPlaying(false));
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u1 = new SpeechSynthesisUtterance(word.word);
      u1.rate = 0.7;
      const u2 = new SpeechSynthesisUtterance(word.word);
      u2.rate = 0.85;
      u2.onend = () => setPlaying(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u1);
      window.speechSynthesis.speak(u2);
    } else {
      setPlaying(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'rgba(34,211,238,0.04)',
        border: '1.5px solid rgba(34,211,238,0.18)',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="text-[20px] font-bold mb-0.5" style={{ color: '#67e8f9' }}>
            {word.word}
          </div>
          {word.syllables && (
            <div className="text-[13px] font-mono" style={{ color: 'rgba(165,243,252,0.85)' }}>
              {word.syllables}
            </div>
          )}
          {word.ipa && (
            <div className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              /{word.ipa}/
            </div>
          )}
        </div>
        <button
          onClick={play}
          disabled={playing}
          className="rounded-full flex items-center justify-center transition-transform hover:scale-105"
          style={{
            width: 40,
            height: 40,
            background: playing ? 'rgba(34,211,238,0.3)' : 'rgba(34,211,238,0.15)',
            color: '#67e8f9',
            border: '1.5px solid rgba(34,211,238,0.4)',
            fontSize: 14,
            cursor: playing ? 'wait' : 'pointer',
          }}
          aria-label={`Play ${word.word}`}
        >
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      {word.context_sentence && (
        <div className="text-[13px] italic mt-3 leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
          “{word.context_sentence}”
        </div>
      )}
      {word.common_mistake && (
        <>
          {!showMistake ? (
            <button
              onClick={() => setShowMistake(true)}
              className="text-[11px] font-semibold mt-3"
              style={{ color: 'rgba(103,232,249,0.65)' }}
            >
              Common mistake →
            </button>
          ) : (
            <div
              className="text-[12px] mt-2 pt-2 leading-snug"
              style={{
                color: 'rgba(255,255,255,0.6)',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              ⚠ {word.common_mistake}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PronunciationDrillRenderer({ block }: { block: PronunciationDrillBlock }) {
  return (
    <div className="my-8 rounded-2xl border border-cyan-500/15 bg-cyan-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-cyan-300 font-bold">🔊</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300/70">
          Say It Right
        </span>
      </div>
      {block.intro && (
        <p className="text-[13px] mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {block.intro}
        </p>
      )}
      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {block.words.map((w) => (
          <Word key={w.id} word={w} />
        ))}
      </div>
    </div>
  );
}
