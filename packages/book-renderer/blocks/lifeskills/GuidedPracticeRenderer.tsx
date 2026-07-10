'use client';

import { useEffect, useState } from 'react';
import { GuidedPracticeBlock, BreathPattern } from '@canvas/data/types/books';
import InlineMarkdown from '../InlineMarkdown';
import { readPractice, writePractice } from './practiceStorage';

/**
 * "Practice Player" — the shared visual shell for every guided_practice: a dark
 * card with a living, softly-blurred aurora of colour behind everything, and a
 * centre stage that adapts to what's running — a phase-coloured pulsing orb for
 * breathing cycles, a circular progress ring for a timed step. Design reference:
 * founder-supplied `Practice Player.dc.html` (2026-07-05) — followed closely:
 * one fixed colour per phase/step (teal → sky → violet → fuchsia, cycling),
 * background blobs that dim/brighten to match whichever colour is active, colour
 * transitions always a fixed ~1.4s crossfade while SIZE transitions track the
 * phase's own duration. Chrome (badge, Begin button, idle bullets, Done state)
 * stays on the shared --book-accent steel-blue so this still reads as part of
 * the Life Skills family; the aurora + orb/ring is this block's signature.
 */

const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';

// One colour per phase/step, cycling. Teal → sky → violet → fuchsia.
const PHASE_COLORS = ['#2dd4bf', '#38bdf8', '#a78bfa', '#f0abfc'];

type Blob = { rgb: string; size: number; dx: string; dy: string; sc: string; dur: string; top?: string; left?: string; right?: string; bottom?: string };
const BLOBS: Blob[] = [
  { rgb: '45,212,191', top: '-10%', left: '-8%', size: 340, dx: '16px', dy: '-10px', sc: '1.15', dur: '19s' },
  { rgb: '56,189,248', bottom: '-12%', right: '-8%', size: 360, dx: '-14px', dy: '12px', sc: '1.1', dur: '23s' },
  { rgb: '167,139,250', top: '22%', left: '36%', size: 320, dx: '-10px', dy: '14px', sc: '1.2', dur: '27s' },
  { rgb: '240,171,252', top: '6%', right: '4%', size: 300, dx: '12px', dy: '-8px', sc: '1.08', dur: '21s' },
];

const KIND_LABEL: Record<GuidedPracticeBlock['practice_kind'], string> = {
  breathing: 'Breathing Practice',
  focus_timer: 'Focus Practice',
  meditation: 'Meditation',
  observation: 'Observation Drill',
  custom: 'Practice',
};

type BreathPhase = { label: string; seconds: number; scale: number };

function buildCyclePhases(p: BreathPattern): BreathPhase[] {
  const phases: BreathPhase[] = [{ label: 'Breathe in', seconds: p.inhale_sec, scale: 1 }];
  if (p.hold_sec) phases.push({ label: 'Hold', seconds: p.hold_sec, scale: 1 });
  phases.push({ label: 'Breathe out', seconds: p.exhale_sec, scale: 0.5 });
  if (p.hold_out_sec) phases.push({ label: 'Hold', seconds: p.hold_out_sec, scale: 0.5 });
  return phases;
}

function formatDuration(totalSec: number): string {
  if (totalSec < 60) return `${totalSec} sec`;
  const min = Math.round(totalSec / 60);
  return `~${min} min`;
}

interface PracticeState {
  completions: number;
}

export default function GuidedPracticeRenderer({ block }: { block: GuidedPracticeBlock }) {
  const [mode, setMode] = useState<'idle' | 'running' | 'done'>('idle');
  const [completions, setCompletions] = useState(0);

  // Breathing pacer position
  const cyclePhases = block.breath_pattern ? buildCyclePhases(block.breath_pattern) : [];
  const [cycle, setCycle] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);

  // Step runner position
  const [stepIdx, setStepIdx] = useState(0);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setCompletions(readPractice<PracticeState>(block.id)?.completions ?? 0);
  }, [block.id]);

  function finish() {
    const next = completions + 1;
    setCompletions(next);
    writePractice<PracticeState>(block.id, { completions: next });
    setMode('done');
  }

  function begin() {
    setCycle(0);
    setPhaseIdx(0);
    setStepIdx(0);
    setRemaining(block.breath_pattern ? null : (block.steps[0]?.duration_sec ?? null));
    setMode('running');
  }

  // ── Breathing pacer: advance one phase at a time ────────────────────────────
  useEffect(() => {
    if (mode !== 'running' || !block.breath_pattern) return;
    const phase = cyclePhases[phaseIdx];
    const t = setTimeout(() => {
      if (phaseIdx + 1 < cyclePhases.length) {
        setPhaseIdx(phaseIdx + 1);
      } else if (cycle + 1 < block.breath_pattern!.cycles) {
        setCycle(cycle + 1);
        setPhaseIdx(0);
      } else {
        finish();
      }
    }, phase.seconds * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, phaseIdx, cycle]);

  // ── Step runner: tick down timed steps, auto-advance ────────────────────────
  useEffect(() => {
    if (mode !== 'running' || block.breath_pattern || remaining === null) return;
    if (remaining <= 0) {
      advanceStep();
      return;
    }
    const t = setTimeout(() => setRemaining(remaining - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, remaining]);

  function advanceStep() {
    if (stepIdx + 1 < block.steps.length) {
      setStepIdx(stepIdx + 1);
      setRemaining(block.steps[stepIdx + 1].duration_sec ?? null);
    } else {
      finish();
    }
  }

  const totalSec = block.breath_pattern
    ? cyclePhases.reduce((s, p) => s + p.seconds, 0) * block.breath_pattern.cycles
    : block.steps.reduce((s, st) => s + (st.duration_sec ?? 0), 0);

  const currentStep = block.steps[stepIdx];
  const currentPhase = cyclePhases[phaseIdx];

  // Which aurora colour is "live" right now — drives both the background blob
  // highlight and the orb/ring colour. Idle/done = no single colour, calm ambient.
  const activeColorIdx = mode !== 'running' ? null
    : block.breath_pattern ? (phaseIdx % PHASE_COLORS.length)
    : (stepIdx % PHASE_COLORS.length);

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden" style={{
      background: 'var(--book-surface, #181A21)', border: '1px solid rgba(255,255,255,0.07)', isolation: 'isolate',
    }}>
      <style>{`
        @keyframes gp-blob-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(var(--dx,10px),var(--dy,-8px)) scale(var(--sc,1.12))}100%{transform:translate(0,0) scale(1)}}
        @media (prefers-reduced-motion: no-preference){ .gp-blob{animation:gp-blob-drift var(--dur,18s) ease-in-out infinite} }
        @keyframes gp-pulse{0%{transform:scale(.82);opacity:.5}70%{opacity:0}100%{transform:scale(1.3);opacity:0}}
        @keyframes gp-phase-in{0%{opacity:0;transform:translateY(5px)}100%{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Ambient aurora — always present; whichever colour is "live" brightens, the rest dim */}
      <div className="absolute inset-0 pointer-events-none" style={{ filter: 'blur(40px)' }}>
        {BLOBS.map((b, i) => (
          <div key={i} className="gp-blob absolute rounded-full" style={{
            width: b.size, height: b.size, top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            background: `radial-gradient(circle, rgba(${b.rgb},0.6) 0%, rgba(${b.rgb},0) 70%)`,
            opacity: activeColorIdx === null ? 0.32 : (i === activeColorIdx ? 0.85 : 0.22),
            transition: 'opacity 1.6s ease',
            // @ts-expect-error -- CSS custom properties for the shared drift keyframe
            '--dx': b.dx, '--dy': b.dy, '--sc': b.sc, '--dur': b.dur,
          }} />
        ))}
      </div>
      {/* Vignette — keeps the centre bright, edges receding into the card */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(120% 90% at 50% 50%, transparent 42%, rgba(4,6,12,0.5) 100%)',
      }} />

      <div className="relative px-5 py-5 sm:px-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
            style={{ background: ACCENT_BG, color: ACCENT }}
          >
            {KIND_LABEL[block.practice_kind]}
          </span>
          {totalSec > 0 && (
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
              {formatDuration(totalSec)}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-white/90 mb-1">{block.title}</h3>
        {block.intro && mode === 'idle' && (
          <div className="mb-4">
            <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/55">
              {block.intro}
            </InlineMarkdown>
          </div>
        )}

        {/* Idle — setup steps (breathing) or step preview, then Begin */}
        {mode === 'idle' && (
          <div>
            {block.breath_pattern && block.steps.length > 0 && (
              <ul className="mb-4 flex flex-col gap-1.5">
                {block.steps.map(s => (
                  <li key={s.id} className="text-sm text-white/55 flex gap-2">
                    <span style={{ color: ACCENT_STRONG }}>•</span>
                    <InlineMarkdown paragraphClassName="leading-relaxed">{s.instruction}</InlineMarkdown>
                  </li>
                ))}
              </ul>
            )}
            {block.audio_url && (
              <audio controls preload="none" src={block.audio_url} className="w-full mb-4 h-10" />
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={begin}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-150"
                style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}
              >
                Begin
              </button>
              {completions > 0 && (
                <span className="text-xs text-white/30">
                  You&rsquo;ve done this {completions} {completions === 1 ? 'time' : 'times'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Running — breathing pacer: a phase-coloured pulsing orb. One fixed colour
            per phase (teal=in, sky=hold, violet=out, cycling), crossfading over a
            steady 1.4s regardless of phase length; SIZE tracks the phase's own
            duration, so the breath itself paces the motion. */}
        {mode === 'running' && block.breath_pattern && currentPhase && (
          <div className="flex flex-col items-center py-8 select-none">
            {(() => {
              const activeColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
              const orbScale = currentPhase.scale;
              const orbDurMs = currentPhase.seconds * 1000;
              const sizeTransition = `transform ${orbDurMs}ms cubic-bezier(.37,0,.32,1)`;
              const colorTransition = 'border-color 1.4s ease, background 1.4s ease, color 1.4s ease';
              return (
                <div className="relative flex items-center justify-center" style={{ width: 300, height: 300 }}>
                  {/* pulsing sonar rings — continuous ambient cadence, coloured to the live phase */}
                  {[0, 1.8, 3.6].map((delay, i) => (
                    <div key={i} className="absolute rounded-full pointer-events-none" style={{
                      width: 300, height: 300,
                      border: `1.5px solid ${activeColor}`,
                      animation: `gp-pulse 5.4s ease-out infinite ${delay}s`,
                      transition: 'border-color 1.4s ease',
                    }} />
                  ))}
                  {/* outer glow disc — solid colour, blurred, scales with the breath */}
                  <div className="absolute rounded-full" style={{
                    width: 230, height: 230, background: activeColor, filter: 'blur(42px)', opacity: 0.4,
                    transform: `scale(${orbScale})`,
                    transition: `${sizeTransition}, background 1.4s ease`,
                  }} />
                  {/* inner glass sphere */}
                  <div className="absolute rounded-full flex items-center justify-center" style={{
                    width: 216, height: 216,
                    background: 'rgba(11,17,32,0.5)',
                    border: `1.5px solid ${activeColor}`,
                    backdropFilter: 'blur(2px)',
                    boxShadow: 'inset 0 1px 24px rgba(255,255,255,0.04)',
                    transform: `scale(${orbScale})`,
                    transition: `${sizeTransition}, ${colorTransition}`,
                  }}>
                    <div className="absolute inset-0 rounded-full" style={{
                      background: `radial-gradient(circle at 50% 34%, ${activeColor}, transparent 62%)`,
                      opacity: 0.42, transition: 'background 1.4s ease',
                    }} />
                    <span key={`${cycle}-${phaseIdx}`} className="relative text-lg font-semibold tracking-wide"
                      style={{ color: activeColor, animation: 'gp-phase-in 0.6s ease-out', transition: 'color 1.4s ease' }}>
                      {currentPhase.label}
                    </span>
                  </div>
                </div>
              );
            })()}
            {/* round progress — elegant dots; the active one carries the live phase colour */}
            <div className="mt-6 flex items-center gap-2">
              {Array.from({ length: block.breath_pattern.cycles }).map((_, i) => {
                const activeColor = PHASE_COLORS[phaseIdx % PHASE_COLORS.length];
                const cur = i === cycle, dn = i < cycle;
                return (
                  <span key={i} className="rounded-full" style={{
                    width: cur ? 20 : 7, height: 7,
                    background: cur ? activeColor : dn ? `${activeColor}99` : 'rgba(255,255,255,0.12)',
                    transition: 'width 0.5s ease, background 0.5s ease',
                  }} />
                );
              })}
            </div>
            <span className="mt-3 text-[10px] text-white/25 uppercase tracking-widest tabular-nums">
              Round {cycle + 1} of {block.breath_pattern.cycles}
            </span>
          </div>
        )}

        {/* Running — step sequence: a circular progress ring for timed steps
            (the same design language as the breathing orb, adapted for a
            straight countdown rather than a cycle), a plain Next button otherwise. */}
        {mode === 'running' && !block.breath_pattern && currentStep && (
          <div className="py-2">
            <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest">
              Step {stepIdx + 1} of {block.steps.length}
            </span>
            <div className="mt-2 mb-4">
              <InlineMarkdown paragraphClassName="text-[15px] leading-relaxed text-white/90 font-medium">
                {currentStep.instruction}
              </InlineMarkdown>
            </div>
            {remaining !== null ? (
              (() => {
                const activeColor = PHASE_COLORS[stepIdx % PHASE_COLORS.length];
                const stepDuration = currentStep.duration_sec || 1;
                const progress = 1 - remaining / stepDuration;
                const R = 100;
                const ringC = 2 * Math.PI * R;
                const ringOffset = ringC * (1 - progress);
                const orbitAngle = progress * 360;
                return (
                  <div className="flex flex-col items-center py-4 select-none">
                    <div className="relative" style={{ width: 220, height: 220 }}>
                      <svg width={220} height={220} viewBox="0 0 220 220" className="absolute inset-0">
                        <circle cx={110} cy={110} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
                        <circle cx={110} cy={110} r={R} fill="none" stroke={activeColor} strokeWidth={2.5} strokeLinecap="round"
                          strokeDasharray={ringC} transform="rotate(-90 110 110)"
                          style={{ strokeDashoffset: ringOffset, transition: 'stroke-dashoffset 1s linear, stroke 1.4s ease' }} />
                      </svg>
                      <div className="absolute inset-0" style={{ transform: `rotate(${orbitAngle}deg)`, transition: 'transform 1s linear' }}>
                        <div className="absolute rounded-full" style={{
                          top: 2, left: '50%', width: 10, height: 10, marginLeft: -5,
                          background: activeColor, boxShadow: `0 0 12px 2px ${activeColor}`, transition: 'background 1.4s ease',
                        }} />
                      </div>
                      <div className="absolute rounded-full" style={{ inset: 32, background: activeColor, filter: 'blur(30px)', opacity: 0.3, transition: 'background 1.4s ease' }} />
                      <div className="absolute flex items-center justify-center rounded-full" style={{
                        inset: 16, background: 'rgba(11,17,32,0.5)', border: `1.5px solid ${activeColor}`,
                        backdropFilter: 'blur(2px)', transition: 'border-color 1.4s ease',
                      }}>
                        <span className="text-3xl font-bold tabular-nums" style={{ color: activeColor, transition: 'color 1.4s ease' }}>
                          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              <button
                onClick={advanceStep}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: ACCENT_BG, color: ACCENT, border: `1.5px solid ${ACCENT_STRONG}` }}
              >
                {stepIdx + 1 < block.steps.length ? 'Next' : 'Finish'}
              </button>
            )}
          </div>
        )}

        {/* Done */}
        {mode === 'done' && (
          <div className="py-2">
            <p className="text-sm font-semibold mb-2" style={{ color: ACCENT }}>
              Practice complete.
            </p>
            {block.completion_note && (
              <div className="mb-3">
                <InlineMarkdown paragraphClassName="text-sm leading-relaxed text-white/65">
                  {block.completion_note}
                </InlineMarkdown>
              </div>
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={begin}
                className="text-xs font-semibold px-4 py-2 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Practice again
              </button>
              <span className="text-xs text-white/30">
                Done {completions} {completions === 1 ? 'time' : 'times'} on this device
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
