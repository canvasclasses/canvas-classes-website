'use client';

import { useState, useContext, useCallback, useMemo } from 'react';
import {
  ApplyExpressBlock, ApplyChallenge,
  FillBlankChallenge, PredictWordChallenge, WordBuilderChallenge,
  SentenceComposeChallenge, UnscrambleChallenge,
} from '@canvas/data/types/books';
import { BookContext } from '../../book-context';
import InlineMarkdown from '../InlineMarkdown';

// ── Answer normalisation (deterministic, forgiving) ──────────────────────────
function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[“”"'’]/g, '')
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ');
}
const accepts = (accepted: string[], value: string) => accepted.some((a) => norm(a) === norm(value));

// ── XP / scoring ─────────────────────────────────────────────────────────────
const xpFor = (difficulty: number, streak: number) => difficulty * 10 + Math.min(streak, 5) * 5;

// ════════════════════════════════════════════════════════════════════════════
// Per-kind challenge views. Each reports a boolean result via onResult once.
// ════════════════════════════════════════════════════════════════════════════

function FillBlankView({ ch, done, onResult }: { ch: FillBlankChallenge; done: boolean; onResult: (ok: boolean) => void }) {
  const parts = useMemo(() => ch.prompt.split(/_{4,}/g), [ch.prompt]);
  const blankCount = Math.max(1, parts.length - 1);
  const [vals, setVals] = useState<string[]>(Array(blankCount).fill(''));
  const allFilled = vals.every((v) => v.trim().length > 0);
  const correct = vals.every((v, i) => accepts(ch.answers[i] ?? [], v));

  return (
    <div>
      <p className="text-[15px] leading-[1.9] text-white/90">
        {parts.map((part, i) => (
          <span key={i}>
            <InlineMarkdown>{part}</InlineMarkdown>
            {i < parts.length - 1 && (
              <input
                value={vals[i]}
                disabled={done}
                onChange={(e) => setVals((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
                className="inline-block mx-1 px-2 py-0.5 rounded-md text-center text-[15px] min-w-[90px]"
                style={{
                  background: done ? (accepts(ch.answers[i] ?? [], vals[i]) ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)') : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${done ? (accepts(ch.answers[i] ?? [], vals[i]) ? 'rgba(16,185,129,0.5)' : 'rgba(248,113,113,0.5)') : 'rgba(167,139,250,0.4)'}`,
                  color: '#fff',
                }}
              />
            )}
          </span>
        ))}
      </p>
      {ch.hint && !done && <p className="mt-2 text-[12px] text-white/35">💡 {ch.hint}</p>}
      {done && !correct && (
        <p className="mt-3 text-[13px] text-emerald-300/90">Answer: {ch.answers.map((a) => a[0]).join(', ')}</p>
      )}
      {!done && (
        <CheckButton disabled={!allFilled} onClick={() => onResult(correct)} />
      )}
    </div>
  );
}

function PredictWordView({ ch, done, onResult }: { ch: PredictWordChallenge; done: boolean; onResult: (ok: boolean) => void }) {
  const [val, setVal] = useState('');
  const correct = accepts(ch.answers, val);
  return (
    <div>
      <p className="text-[15px] leading-relaxed text-white/90">
        <span className="text-violet-300/70 text-[11px] uppercase tracking-wider block mb-1">Predict the next word</span>
        “<InlineMarkdown>{ch.lead}</InlineMarkdown>{' '}
        <input
          value={val}
          disabled={done}
          onChange={(e) => setVal(e.target.value)}
          placeholder="?"
          className="inline-block px-2 py-0.5 rounded-md text-center text-[15px] min-w-[110px]"
          style={{
            background: done ? (correct ? 'rgba(16,185,129,0.12)' : 'rgba(248,113,113,0.12)') : 'rgba(255,255,255,0.06)',
            border: `1px solid ${done ? (correct ? 'rgba(16,185,129,0.5)' : 'rgba(248,113,113,0.5)') : 'rgba(167,139,250,0.4)'}`,
            color: '#fff',
          }}
        />”
      </p>
      {done && ch.full_line && <p className="mt-3 text-[13px] italic text-white/55">“{ch.full_line}”</p>}
      {done && !correct && <p className="mt-1 text-[13px] text-emerald-300/90">Accepted: {ch.answers.join(' / ')}</p>}
      {!done && <CheckButton disabled={!val.trim()} onClick={() => onResult(correct)} />}
    </div>
  );
}

function WordBuilderView({ ch, done, onResult }: { ch: WordBuilderChallenge; done: boolean; onResult: (ok: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const isSuffix = ch.position === 'suffix';
  const correct = picked === ch.correct;
  return (
    <div>
      <p className="text-[13px] text-white/55 mb-1">Pick the {isSuffix ? 'suffix' : 'prefix'} that builds the right word{ch.meaning_hint ? ` — “${ch.meaning_hint}”` : ''}:</p>
      <div className="flex items-center gap-2 mb-4 text-[20px] font-semibold flex-wrap">
        {!isSuffix && <span className="text-violet-300">{picked ?? '___'}</span>}
        <span className="text-white/90">{ch.base}</span>
        {isSuffix && <span className="text-violet-300">{picked ?? '___'}</span>}
        {done && <span className="text-white/40 text-[15px]">→ <span className="text-emerald-300 font-bold">{ch.target}</span></span>}
      </div>
      <div className="flex gap-2 flex-wrap">
        {ch.affixes.map((af) => {
          const isThis = picked === af;
          let style: React.CSSProperties = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' };
          if (done && af === ch.correct) style = { background: 'rgba(16,185,129,0.14)', border: '1px solid rgba(16,185,129,0.5)', color: '#34d399' };
          else if (done && isThis) style = { background: 'rgba(248,113,113,0.14)', border: '1px solid rgba(248,113,113,0.5)', color: '#f87171' };
          else if (isThis) style = { background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.55)', color: '#c4b5fd' };
          return (
            <button key={af} disabled={done} onClick={() => setPicked(af)}
              className="px-3.5 py-2 rounded-lg text-[15px] font-mono font-semibold transition-colors"
              style={{ ...style, cursor: done ? 'default' : 'pointer' }}>
              {af}-
            </button>
          );
        })}
      </div>
      {!done && <CheckButton disabled={!picked} onClick={() => onResult(correct)} />}
    </div>
  );
}

function UnscrambleView({ ch, done, onResult }: { ch: UnscrambleChallenge; done: boolean; onResult: (ok: boolean) => void }) {
  const [placed, setPlaced] = useState<number[]>([]);
  const placedSet = new Set(placed);
  const built = placed.map((i) => ch.tokens[i]).join(' ');
  const correct = norm(built) === norm(ch.answer);

  return (
    <div>
      <p className="text-[13px] text-white/55 mb-3">Tap the words in order to rebuild the line:</p>
      <div className="min-h-[44px] rounded-xl border border-violet-500/25 bg-violet-500/[0.04] px-3 py-2 mb-3 flex flex-wrap gap-1.5 items-center"
        style={done ? { borderColor: correct ? 'rgba(16,185,129,0.5)' : 'rgba(248,113,113,0.5)' } : undefined}>
        {placed.length === 0 && <span className="text-white/25 text-[13px]">…</span>}
        {placed.map((ti, pos) => (
          <button key={pos} disabled={done} onClick={() => setPlaced((p) => p.filter((_, k) => k !== pos))}
            className="px-2.5 py-1 rounded-md text-[14px] bg-white/8 border border-white/12 text-white/85"
            style={{ cursor: done ? 'default' : 'pointer' }}>
            {ch.tokens[ti]}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {ch.tokens.map((tok, i) => (
          <button key={i} disabled={done || placedSet.has(i)} onClick={() => setPlaced((p) => [...p, i])}
            className="px-2.5 py-1 rounded-md text-[14px] transition-opacity"
            style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.8)', opacity: placedSet.has(i) ? 0.25 : 1,
              cursor: done || placedSet.has(i) ? 'default' : 'pointer',
            }}>
            {tok}
          </button>
        ))}
      </div>
      {done && !correct && <p className="mt-3 text-[13px] text-emerald-300/90">“{ch.answer}”</p>}
      {!done && <CheckButton disabled={placed.length < ch.tokens.length} onClick={() => onResult(correct)} />}
    </div>
  );
}

function SentenceComposeView({ ch, done, onResult }: { ch: SentenceComposeChallenge; done: boolean; onResult: (ok: boolean) => void }) {
  const [text, setText] = useState('');
  const minWords = ch.min_words ?? 6;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Deterministic gate: uses the target word/phrase, long enough, ends like a sentence.
  const usesWord = norm(text).includes(norm(ch.word));
  const longEnough = wordCount >= minWords;
  const endsWell = /[.!?]\s*$/.test(text.trim());
  const passes = usesWord && longEnough && endsWell;
  const [checked, setChecked] = useState<boolean[]>(Array(ch.rubric.length).fill(false));

  return (
    <div>
      <p className="text-[14px] text-white/80 mb-1">{ch.instruction}</p>
      <p className="text-[12px] text-violet-300/70 mb-2">Use: <span className="font-semibold">{ch.word}</span></p>
      <textarea
        value={text}
        disabled={done}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Write your own sentence…"
        className="w-full rounded-xl px-3 py-2 text-[15px] resize-none"
        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${done ? (passes ? 'rgba(16,185,129,0.5)' : 'rgba(251,191,36,0.5)') : 'rgba(167,139,250,0.4)'}`, color: '#fff' }}
      />
      {!done && (
        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/35">
          <span className={usesWord ? 'text-emerald-400' : ''}>{usesWord ? '✓' : '○'} uses the word</span>
          <span className={longEnough ? 'text-emerald-400' : ''}>{longEnough ? '✓' : '○'} {wordCount}/{minWords} words</span>
          <span className={endsWell ? 'text-emerald-400' : ''}>{endsWell ? '✓' : '○'} full sentence</span>
        </div>
      )}
      {done && (
        <div className="mt-3">
          <p className="text-[12px] uppercase tracking-wide text-white/35 mb-1">A model sentence</p>
          <p className="text-[14px] italic text-white/70 mb-3">“{ch.model_answer}”</p>
          <p className="text-[12px] uppercase tracking-wide text-white/35 mb-1.5">Check your own:</p>
          <div className="space-y-1.5">
            {ch.rubric.map((r, i) => (
              <button key={i} onClick={() => setChecked((c) => c.map((x, j) => (j === i ? !x : x)))}
                className="flex items-center gap-2 text-left text-[13px] text-white/70">
                <span className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                  style={{ background: checked[i] ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${checked[i] ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.15)'}`, color: '#34d399' }}>
                  {checked[i] ? '✓' : ''}
                </span>
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
      {!done && <CheckButton disabled={!text.trim()} label="Submit" onClick={() => onResult(passes)} />}
    </div>
  );
}

function CheckButton({ disabled, onClick, label = 'Check' }: { disabled: boolean; onClick: () => void; label?: string }) {
  return (
    <button disabled={disabled} onClick={onClick}
      className="mt-4 px-5 py-2 rounded-xl text-sm font-bold transition-opacity"
      style={{
        background: disabled ? 'rgba(255,255,255,0.06)' : 'linear-gradient(to right, #8b5cf6, #d946ef)',
        color: disabled ? 'rgba(255,255,255,0.3)' : '#000',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}>
      {label}
    </button>
  );
}

function renderChallenge(ch: ApplyChallenge, done: boolean, onResult: (ok: boolean) => void) {
  switch (ch.kind) {
    case 'fill_blank':       return <FillBlankView ch={ch} done={done} onResult={onResult} />;
    case 'predict_word':     return <PredictWordView ch={ch} done={done} onResult={onResult} />;
    case 'word_builder':     return <WordBuilderView ch={ch} done={done} onResult={onResult} />;
    case 'sentence_compose': return <SentenceComposeView ch={ch} done={done} onResult={onResult} />;
    case 'unscramble':       return <UnscrambleView ch={ch} done={done} onResult={onResult} />;
  }
}

const KIND_LABEL: Record<ApplyChallenge['kind'], string> = {
  fill_blank: 'Fill the blank',
  predict_word: 'Predict the word',
  word_builder: 'Build the word',
  sentence_compose: 'Compose your own',
  unscramble: 'Unscramble',
};

// ════════════════════════════════════════════════════════════════════════════
export default function ApplyExpressRenderer({
  block,
  onComplete,
}: {
  block: ApplyExpressBlock;
  onComplete?: (score: number) => void;
}) {
  const { bookSlug } = useContext(BookContext);
  const challenges = block.challenges;

  const [phase, setPhase] = useState<'intro' | 'play' | 'done'>('intro');
  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastOk, setLastOk] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [gain, setGain] = useState(0);

  const current = challenges[idx];

  const handleResult = useCallback((ok: boolean) => {
    if (answered) return;
    const newStreak = ok ? streak + 1 : 0;
    const earned = ok ? xpFor(current.difficulty, streak) : 0;
    setAnswered(true);
    setLastOk(ok);
    setStreak(newStreak);
    setGain(earned);
    if (ok) { setXp((x) => x + earned); setCorrectCount((c) => c + 1); }

    if (bookSlug) {
      fetch('/api/v2/books/practice', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_slug: bookSlug, chapter_number: block.chapter_number,
          question_id: current.id, concept_tag: current.concept_tag,
          difficulty: current.difficulty, correct: ok, time_ms: 0,
        }),
      }).catch(() => {});
    }
  }, [answered, streak, current, bookSlug, block.chapter_number]);

  const next = useCallback(() => {
    if (idx + 1 >= challenges.length) {
      setPhase('done');
      const score = Math.round((correctCount / challenges.length) * 100);
      if (score >= 50) onComplete?.(score);
      return;
    }
    setIdx((i) => i + 1);
    setAnswered(false);
  }, [idx, challenges.length, correctCount, onComplete]);

  // ── Intro ───────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="my-8 rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.04] px-5 py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-fuchsia-400 font-bold">🎮</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400/80">
            {block.title || 'Apply & Express'}
          </span>
        </div>
        {block.intro && (
          <div className="mb-4"><InlineMarkdown paragraphClassName="text-[14px] leading-relaxed text-white/70">{block.intro}</InlineMarkdown></div>
        )}
        <p className="text-[13px] text-white/45 mb-5">
          {challenges.length} challenges · fill blanks, predict words, build words, write your own · earn XP and keep your streak
        </p>
        <button onClick={() => setPhase('play')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-black font-bold text-sm">
          Start challenges →
        </button>
      </div>
    );
  }

  // ── Done ────────────────────────────────────────────────────────────────
  if (phase === 'done') {
    const score = Math.round((correctCount / challenges.length) * 100);
    const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
    return (
      <div className="my-8 rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-violet-500/[0.05] to-fuchsia-500/[0.04] px-5 py-8 text-center">
        <div className="text-[40px] mb-1 tracking-widest">{'★'.repeat(stars)}<span className="text-white/15">{'★'.repeat(3 - stars)}</span></div>
        <h3 className="text-xl font-bold mb-1">{score >= 80 ? 'Brilliant!' : score >= 50 ? 'Well played!' : 'Good start!'}</h3>
        <p className="text-white/50 text-sm mb-1">{correctCount} of {challenges.length} nailed</p>
        <p className="text-fuchsia-300 font-bold text-lg mb-5">{xp} XP earned</p>
        <button onClick={() => { setPhase('intro'); setIdx(0); setAnswered(false); setXp(0); setStreak(0); setCorrectCount(0); }}
          className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70">
          Play again
        </button>
      </div>
    );
  }

  // ── Play ────────────────────────────────────────────────────────────────
  return (
    <div className="my-8 rounded-2xl border border-fuchsia-500/25 bg-gradient-to-br from-violet-500/[0.04] to-fuchsia-500/[0.03] px-5 py-5">
      {/* HUD */}
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-fuchsia-400/70">{KIND_LABEL[current.kind]}</span>
        <div className="flex items-center gap-3 text-[12px]">
          {streak >= 2 && <span className="text-amber-400 font-semibold">🔥 {streak}</span>}
          <span className="text-fuchsia-300 font-bold tabular-nums">{xp} XP</span>
          <span className="text-white/35 tabular-nums">{idx + 1}/{challenges.length}</span>
        </div>
      </div>
      <div className="h-1 rounded-full bg-white/8 mb-5 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
          style={{ width: `${(idx / challenges.length) * 100}%` }} />
      </div>

      {renderChallenge(current, answered, handleResult)}

      {answered && (
        <div className="mt-4 pt-4 border-t border-white/8">
          <p className="text-sm font-semibold mb-1" style={{ color: lastOk ? '#34d399' : '#f87171' }}>
            {lastOk ? `Nice! +${gain} XP${streak >= 2 ? ` · 🔥 ${streak} streak` : ''}` : 'Not quite — but you’ll remember it now.'}
          </p>
          {current.explanation && <p className="text-[13px] text-white/55 leading-relaxed mb-3">{current.explanation}</p>}
          <button onClick={next}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-black font-bold text-sm">
            {idx + 1 >= challenges.length ? 'See results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  );
}
