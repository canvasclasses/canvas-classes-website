'use client';

import { useState, useContext } from 'react';
import { VocabularyLabBlock, VocabCard } from '@canvas/data/types/books';
import { wordIdFor } from '@canvas/data/books/vocabulary';
import { VaultContext } from '../../vault-context';
import InlineMarkdown from '../InlineMarkdown';
import InlineQuizRenderer from '../InlineQuizRenderer';

const MODE_LABEL: Record<VocabularyLabBlock['mode'], string> = {
  flashcards: 'Word Lab',
  binomials: 'Word Pairs',
  affixes: 'Prefix & Suffix Workshop',
  idioms: 'Idiom Cards',
};

// Hindi track ('गंगा') — swapped labels when block.lang === 'hindi'.
const MODE_LABEL_HI: Record<VocabularyLabBlock['mode'], string> = {
  flashcards: 'शब्द-संपदा',
  binomials: 'शब्द-युग्म',
  affixes: 'उपसर्ग-प्रत्यय कार्यशाला',
  idioms: 'मुहावरे',
};

function Card({ card, lang }: { card: VocabCard; lang: 'english' | 'hindi' }) {
  const [flipped, setFlipped] = useState(false);
  const { onSaveWord, isWordSaved } = useContext(VaultContext);
  const saved = isWordSaved?.(wordIdFor(card.word)) ?? false;
  const isHindi = lang === 'hindi';

  function speak() {
    if (card.audio_url) {
      new Audio(card.audio_url).play().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(card.word);
      u.rate = 0.85;
      if (isHindi) u.lang = 'hi-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="text-left rounded-2xl p-4 transition-all hover:scale-[1.01]"
      style={{
        background: flipped ? 'rgba(14,165,233,0.06)' : 'rgba(255,255,255,0.03)',
        border: `1.5px solid ${flipped ? 'rgba(14,165,233,0.35)' : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        minHeight: 140,
      }}
    >
      {!flipped ? (
        <div>
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[20px] font-bold" style={{ color: '#7dd3fc' }}>
              {card.word}
            </span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {card.pos}
            </span>
          </div>
          {card.pronunciation && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-mono" style={{ color: 'rgba(125,211,252,0.65)' }}>
                {card.pronunciation}
              </span>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  speak();
                }}
                role="button"
                tabIndex={0}
                className="inline-flex items-center justify-center rounded-full text-[10px] cursor-pointer"
                style={{
                  width: 18,
                  height: 18,
                  background: 'rgba(14,165,233,0.15)',
                  color: '#7dd3fc',
                }}
              >
                ▶
              </span>
            </div>
          )}
          <p className="text-[13px] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {isHindi ? 'पलटने के लिए टैप करें →' : 'Tap to flip →'}
          </p>
        </div>
      ) : (
        <div>
          <span className="text-[15px] font-semibold block mb-2" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {card.meaning}
          </span>
          {isHindi
            ? card.english && (
                <div className="text-[14px] mb-2" style={{ color: 'rgba(125,211,252,0.85)' }}>
                  English: <span className="font-medium">{card.english}</span>
                </div>
              )
            : card.hindi && (
                <div className="text-[14px] mb-2" style={{ color: 'rgba(125,211,252,0.85)' }}>
                  हिंदी: <span className="font-medium">{card.hindi}</span>
                </div>
              )}
          <div
            className="text-[13px] italic mt-2 pt-2"
            style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            “{card.example}”
          </div>
          {card.memory_hook && (
            <div
              className="text-[12px] mt-2 pt-2"
              style={{
                color: 'rgba(255,255,255,0.4)',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              💡 {card.memory_hook}
            </div>
          )}
          {onSaveWord && (
            <span
              role="button"
              tabIndex={0}
              aria-disabled={saved}
              onClick={(e) => {
                e.stopPropagation();
                if (saved) return;
                onSaveWord({
                  wordId: wordIdFor(card.word),
                  word: card.word,
                  meaning: card.meaning,
                  pos: card.pos,
                  hindi: card.hindi,
                  example: card.example,
                  pronunciation: card.pronunciation,
                  source: 'vocabulary_lab',
                });
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition-colors"
              style={{
                background: saved ? 'rgba(16,185,129,0.12)' : 'rgba(14,165,233,0.14)',
                border: `1px solid ${saved ? 'rgba(16,185,129,0.4)' : 'rgba(14,165,233,0.4)'}`,
                color: saved ? '#34d399' : '#7dd3fc',
                cursor: saved ? 'default' : 'pointer',
              }}
            >
              {saved
                ? (isHindi ? '✓ शब्दकोश में जुड़ा' : '✓ In your Word Vault')
                : (isHindi ? '+ शब्दकोश में जोड़ें' : '+ Save to Word Vault')}
            </span>
          )}
        </div>
      )}
    </button>
  );
}

export default function VocabularyLabRenderer({ block }: { block: VocabularyLabBlock }) {
  const lang = block.lang ?? 'english';
  const modeLabel = lang === 'hindi' ? MODE_LABEL_HI[block.mode] : MODE_LABEL[block.mode];
  return (
    <div className="my-8 rounded-2xl border border-sky-500/15 bg-sky-500/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sky-400 font-bold">⚙</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-sky-400/70">
          {modeLabel}
        </span>
      </div>

      {block.intro && (
        <div className="mb-4">
          <InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/65">
            {block.intro}
          </InlineMarkdown>
        </div>
      )}

      <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        {block.cards.map((c) => (
          <Card key={c.id} card={c} lang={lang} />
        ))}
      </div>

      {block.self_check && block.self_check.length > 0 && (
        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-sky-400/50 mb-2">
            {lang === 'hindi' ? 'क्या आपने पहचाना?' : 'Did you get them?'}
          </div>
          <InlineQuizRenderer
            block={{
              id: `${block.id}_check`,
              type: 'inline_quiz',
              order: 0,
              questions: block.self_check,
              pass_threshold: 0.6,
            }}
          />
        </div>
      )}
    </div>
  );
}
