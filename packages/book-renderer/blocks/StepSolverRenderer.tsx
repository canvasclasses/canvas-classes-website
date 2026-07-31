'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { StepSolverBlock, StepSolverCheck, StepSolverStep } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

/**
 * STEP SOLVER — an interactive, step-by-step problem walkthrough.
 *
 * The student clicks through EVERY step. A load-bearing step gates on a small
 * generative interaction (pick the operation / MCQ / fill a blank) BEFORE the
 * resulting line is revealed, so the student *produces* each move instead of
 * reading it. Solved lines settle into a clean solution trail above the active
 * step. Ends with a faded "Now you try" (solo problem, tap-to-reveal solution).
 *
 * Research spine (see StepSolverBlock in types/books.ts): step-based tutoring
 * (VanLehn 2011, d≈0.76 ≈ human tutoring vs 0.3 answer-only), the segmentation
 * principle (Mayer — learner-paced advance), the generation effect, self-
 * explanation ("why?"), and worked-example→faded→solo. Calm reading-surface
 * palette, no timer, non-punitive feedback — deliberately low-arousal for
 * math-anxious learners (kill the clock, make mistakes cheap).
 *
 * Content-driven: every step lives in the DB block. CSS-only animation.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const OK = '#34d399';
const OK_BG = 'rgba(16,185,129,0.12)';
const OK_BORDER = 'rgba(16,185,129,0.4)';
const BAD = '#f87171';
const BAD_BG = 'rgba(248,113,113,0.10)';
const BAD_BORDER = 'rgba(248,113,113,0.34)';

// Forgiving answer match for fill_blank (strip case / spaces / surrounding $).
function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\$/g, '').replace(/\s+/g, '').replace(/[,]/g, '');
}

/**
 * How much ORDINARY PROSE a string carries, once LaTeX spans and markdown
 * emphasis marks are removed. Used to decide whether a line should be set as a
 * display equation or as a sentence.
 */
function proseLength(s: string): number {
  return s.replace(/\$[^$]*\$/g, '').replace(/[*_`]/g, '').trim().length;
}

/**
 * The big, centred equation line for a step.
 *
 * `MathLine` was written for `step.math` — a KaTeX equation, where display size
 * and centring are exactly right. It was then reused for two fields that hold
 * PROSE (`block.problem` and `now_you_try.problem`), and at 19/22px a full
 * sentence renders far larger than every other question on the page: an
 * inline-quiz stem is 15px, and so is this block's own "Your move" prompt.
 *
 * That went unnoticed while the only step_solver on the platform was the Class 9
 * Maths pilot, whose problem is literally `$ 2x + 3 = 11 $` — pure LaTeX, which
 * genuinely IS an equation. Class 11 Physics feeds the same slot sentences of up
 * to ~200 characters of prose.
 *
 * So the size is chosen from the CONTENT rather than the call site: a line that
 * is essentially an equation keeps the display treatment, and a line that is
 * really a sentence is set as readable prose. `step.math` always forces the
 * equation treatment, since that field is an equation by definition.
 */
const PROSE_THRESHOLD = 40;
const isProseLine = (s: string) => proseLength(s) > PROSE_THRESHOLD;

function MathLine({ children, muted, force }:
  { children: string; muted?: boolean; force?: 'equation' | 'auto' }) {
  const isProse = force !== 'equation' && proseLength(children) > PROSE_THRESHOLD;
  return (
    <div
      className={isProse
        ? 'text-[16px] sm:text-[17px] leading-relaxed'
        : 'text-center text-[19px] sm:text-[22px] leading-snug'}
      style={{ color: muted ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.9)' }}
    >
      <InlineMarkdown paragraphClassName="my-0">{children}</InlineMarkdown>
    </div>
  );
}

/** A revealed step in the solution trail: its line + the teacher one-liner + optional "why?". */
function SolvedStep({ step, index, active }: { step: StepSolverStep; index: number; active: boolean }) {
  const [whyOpen, setWhyOpen] = useState(false);
  return (
    <div
      className={`relative rounded-xl px-4 py-3 transition-all duration-300 ${active ? 'motion-safe:animate-[ss-in_0.4s_ease-out]' : ''}`}
      style={{
        background: active ? ACCENT_BG : 'rgba(255,255,255,0.03)',
        border: `1px solid ${active ? ACCENT_BORDER : 'rgba(255,255,255,0.07)'}`,
        opacity: active ? 1 : 0.82,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="grid place-items-center w-5 h-5 rounded-full text-[11px] font-bold tabular-nums"
          style={{ background: active ? ACCENT_STRONG : 'rgba(255,255,255,0.1)', color: active ? '#0d1117' : 'rgba(255,255,255,0.6)' }}
        >
          {index}
        </span>
        {step.say && (
          <span className="text-[13px] leading-snug text-white/60">
            <InlineMarkdown>{step.say}</InlineMarkdown>
          </span>
        )}
      </div>
      <MathLine muted={!active} force="equation">{step.math}</MathLine>
      {step.why && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setWhyOpen((v) => !v)}
            className="text-[12px] font-medium underline underline-offset-2"
            style={{ color: ACCENT }}
          >
            {whyOpen ? '− Hide why' : '· Why did we do this?'}
          </button>
          {whyOpen && (
            <div className="mt-2 rounded-lg px-3 py-2 text-left motion-safe:animate-[ss-in_0.3s_ease-out]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <InlineMarkdown paragraphClassName="text-[13px] leading-relaxed text-white/70 my-0">{step.why}</InlineMarkdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** The active step's generative check — answer it, then the resulting line reveals. */
function CheckCard({ check, stepNumber, onSolved }: { check: StepSolverCheck; stepNumber: number; onSolved: () => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [blank, setBlank] = useState('');
  const [verdict, setVerdict] = useState<'none' | 'right' | 'wrong'>('none');
  const solved = verdict === 'right';

  const answerMcq = (i: number) => {
    if (solved) return;
    setPicked(i);
    const correct = i === check.answer_index;
    setVerdict(correct ? 'right' : 'wrong');
    if (correct) setTimeout(onSolved, 550); // let the ✓ land, then reveal the line
  };
  const answerBlank = () => {
    if (solved || !blank.trim()) return;
    const correct = check.blank_answer != null && norm(blank) === norm(check.blank_answer);
    setVerdict(correct ? 'right' : 'wrong');
    if (correct) setTimeout(onSolved, 550);
  };

  return (
    <div
      className="rounded-xl px-4 py-4 motion-safe:animate-[ss-in_0.4s_ease-out]"
      style={{ background: ACCENT_BG, border: `1.5px solid ${ACCENT_BORDER}` }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full tabular-nums"
          style={{ background: ACCENT_STRONG, color: '#0d1117' }}>
          Step {stepNumber}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/45">Your move</span>
      </div>
      <div className="text-[15px] font-semibold text-white/85 leading-snug mb-3">
        <InlineMarkdown>{check.prompt}</InlineMarkdown>
      </div>

      {(check.kind === 'pick_op' || check.kind === 'mcq') && (
        <div className="flex flex-col gap-2">
          {(check.options ?? []).map((opt, i) => {
            const isPicked = picked === i;
            const isRight = solved && i === check.answer_index;
            const isWrong = isPicked && verdict === 'wrong';
            const color = isRight ? OK : isWrong ? BAD : isPicked ? ACCENT : 'rgba(255,255,255,0.72)';
            const bg = isRight ? OK_BG : isWrong ? BAD_BG : 'rgba(255,255,255,0.04)';
            const border = isRight ? OK_BORDER : isWrong ? BAD_BORDER : 'rgba(255,255,255,0.12)';
            return (
              <button
                key={i}
                disabled={solved}
                onClick={() => answerMcq(i)}
                className="text-left text-[15px] px-4 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-2"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: solved ? 'default' : 'pointer' }}
              >
                <span className="shrink-0 w-4 text-center">{isRight ? '✓' : isWrong ? '✕' : ''}</span>
                <span className="flex-1"><InlineMarkdown>{opt}</InlineMarkdown></span>
              </button>
            );
          })}
        </div>
      )}

      {check.kind === 'fill_blank' && (
        <div className="flex items-center gap-2">
          <input
            value={blank}
            disabled={solved}
            onChange={(e) => { setBlank(e.target.value); if (verdict !== 'none') setVerdict('none'); }}
            onKeyDown={(e) => { if (e.key === 'Enter') answerBlank(); }}
            placeholder="type your answer"
            className="flex-1 px-3 py-2 rounded-lg text-[15px] outline-none tabular-nums"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${verdict === 'right' ? OK_BORDER : verdict === 'wrong' ? BAD_BORDER : 'rgba(255,255,255,0.14)'}`,
              color: verdict === 'right' ? OK : 'rgba(255,255,255,0.9)',
            }}
          />
          <button
            onClick={answerBlank}
            disabled={solved || !blank.trim()}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-150"
            style={{ background: ACCENT_BG, color: ACCENT, border: `1px solid ${ACCENT_STRONG}`, opacity: (solved || !blank.trim()) ? 0.5 : 1 }}
          >
            Check
          </button>
        </div>
      )}

      {verdict !== 'none' && (
        <div className="mt-3 rounded-lg px-3 py-2 text-[13px] leading-relaxed motion-safe:animate-[ss-in_0.3s_ease-out]"
          style={{
            background: verdict === 'right' ? OK_BG : BAD_BG,
            border: `1px solid ${verdict === 'right' ? OK_BORDER : BAD_BORDER}`,
            color: verdict === 'right' ? '#a7f3d0' : '#fecaca',
          }}>
          <InlineMarkdown paragraphClassName="my-0">
            {verdict === 'right'
              ? (check.feedback_right ?? 'Exactly right. 👍')
              : (check.feedback_wrong ?? 'Not quite — take another look and try again.')}
          </InlineMarkdown>
        </div>
      )}
    </div>
  );
}

function NowYouTry({ nyt }: { nyt: NonNullable<StepSolverBlock['now_you_try']> }) {
  const [showAns, setShowAns] = useState(false);
  const [showSol, setShowSol] = useState(false);
  return (
    <div className="mt-4 rounded-xl px-4 py-4" style={{ background: 'rgba(255,255,255,0.03)', border: `1px dashed ${ACCENT_BORDER}` }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>Now you try — on your own</div>
      <MathLine>{nyt.problem}</MathLine>
      <div className="mt-3 flex items-center justify-center gap-3">
        {!showAns && (
          <button onClick={() => setShowAns(true)} className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ background: ACCENT_BG, color: ACCENT, border: `1px solid ${ACCENT_STRONG}` }}>
            Reveal the answer
          </button>
        )}
        {showAns && nyt.solution && !showSol && (
          <button onClick={() => setShowSol(true)} className="text-xs text-white/50 hover:text-white/70 underline underline-offset-2">
            Show the working
          </button>
        )}
      </div>
      {showAns && (
        <div className="mt-3 rounded-lg px-3 py-2.5 motion-safe:animate-[ss-in_0.3s_ease-out]" style={{ background: OK_BG, border: `1px solid ${OK_BORDER}` }}>
          <div className="text-center text-[17px]" style={{ color: '#a7f3d0' }}>
            <InlineMarkdown paragraphClassName="my-0">{nyt.answer}</InlineMarkdown>
          </div>
        </div>
      )}
      {showSol && nyt.solution && (
        <div className="mt-2 rounded-lg px-3 py-2 motion-safe:animate-[ss-in_0.3s_ease-out]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <InlineMarkdown paragraphClassName="text-[13px] leading-relaxed text-white/72 my-0">{nyt.solution}</InlineMarkdown>
        </div>
      )}
    </div>
  );
}

export default function StepSolverRenderer({ block }: { block: StepSolverBlock }) {
  const steps = block.steps;
  const total = steps.length;
  // `solved` = number of steps whose line is revealed. The active step is steps[solved].
  const [solved, setSolved] = useState(0);
  const activeRef = useRef<HTMLDivElement>(null);
  const done = solved >= total;
  const active = !done ? steps[solved] : null;

  const revealActive = useCallback(() => setSolved((s) => Math.min(total, s + 1)), [total]);

  // A step with no check just needs a click to advance (pure segmentation).
  const advancePlain = useCallback(() => { if (!done && active && !active.check) revealActive(); }, [done, active, revealActive]);

  const progress = useMemo(() => (done ? total : solved), [done, solved, total]);

  return (
    <div className="my-8 rounded-2xl px-5 py-5 sm:px-6" style={{ background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`@keyframes ss-in{0%{opacity:0;transform:translateY(9px)}100%{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: ACCENT_BG, color: ACCENT }}>
          Solve it — step by step
        </span>
        <span className="text-[10px] text-white/45 font-medium uppercase tracking-widest tabular-nums ml-auto">{progress} / {total}</span>
      </div>
      {block.title && (
        <h3 className="text-xl font-bold text-white/85 mb-1"><InlineMarkdown>{block.title}</InlineMarkdown></h3>
      )}
      {block.intro && solved === 0 && (
        <div className="mb-2"><InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/60">{block.intro}</InlineMarkdown></div>
      )}

      {/* Progress track */}
      <div className="flex gap-1.5 mb-4">
        {steps.map((_, i) => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i < solved ? ACCENT_STRONG : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {/* The starting problem — always visible, the anchor line */}
      <div className="rounded-xl px-4 py-3 mb-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className={`text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1 ${isProseLine(block.problem) ? '' : 'text-center'}`}>The problem</div>
        <MathLine>{block.problem}</MathLine>
      </div>

      {/* Solution trail — solved lines stack down the page */}
      <div className="flex flex-col gap-2">
        {steps.slice(0, solved).map((s, i) => (
          <SolvedStep key={s.id} step={s} index={i + 1} active={i === solved - 1 && !done} />
        ))}
      </div>

      {/* Active step — a check to answer, or a Next to advance */}
      {active && (
        <div ref={activeRef} className="mt-2">
          {active.check ? (
            // key on the step id: each step gets a FRESH CheckCard, so verdict/picked
            // state never leaks from the previous step into this one.
            <CheckCard key={active.id} check={active.check} stepNumber={solved + 1} onSolved={revealActive} />
          ) : (
            <button
              onClick={advancePlain}
              className="w-full text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-150 motion-safe:animate-pulse"
              style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}
            >
              {solved === 0 ? 'Start solving →' : 'Next step →'}
            </button>
          )}
        </div>
      )}

      {/* Done — celebrate + faded solo */}
      {done && (
        <div className="mt-3">
          <div className="rounded-xl px-4 py-3 flex items-center gap-2 motion-safe:animate-[ss-in_0.4s_ease-out]" style={{ background: OK_BG, border: `1px solid ${OK_BORDER}` }}>
            <span className="text-lg">🎉</span>
            <span className="text-[15px] font-semibold" style={{ color: '#a7f3d0' }}>Solved — you did every step yourself.</span>
            <button onClick={() => setSolved(0)} className="ml-auto text-xs text-white/50 hover:text-white/70 underline underline-offset-2">↺ Again</button>
          </div>
          {block.now_you_try && <NowYouTry nyt={block.now_you_try} />}
        </div>
      )}
    </div>
  );
}
