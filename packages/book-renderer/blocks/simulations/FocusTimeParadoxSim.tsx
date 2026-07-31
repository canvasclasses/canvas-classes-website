'use client';

import { useState } from 'react';

/**
 * "The Time Paradox" — the motivational spine of the chapter. Students feel
 * time-poor even with search engines and answers in seconds. The reveal: the
 * day didn't get shorter — deep-focus capacity did. Sitting for 3 hours is not
 * 3 hours of work; whoever can focus deeply does more in the same time (and
 * frees hours for sport, creativity, life) while scoring higher.
 *
 * Visualisation: ONE segmented "sitting-time" bar that splits into real focus
 * (solid) vs leaked-to-switching (hatched). Training GROWS the solid segment,
 * so the number and the fill always agree.
 *
 * Visual identity: a real, VISIBLE ambient glow panel (two soft radial blooms —
 * steel-blue + a low warm undertone) instead of a near-invisible 6% gradient,
 * glass-panel depth, pill-chip legend, glossy segmented bar. Still calm and
 * un-game-y (no confetti/sound/points) — the polish is in materials and depth,
 * not motion or noise. Chrome stays on --book-accent (LIFE_SKILLS_WORKFLOW §5.3.5).
 *
 * Evidence-safe (§7): the "leak" fraction is the student's OWN honest
 * self-report, never a fabricated precise statistic.
 *
 * Zero-prop sim registered as `focus-time-paradox` in SimulationBlockRenderer.
 */

const ACCENT = 'var(--book-accent, #9fb2d4)';
const ACCENT_STRONG = 'var(--book-accent-strong, #8fa6c9)';
const ACCENT_BG = 'var(--book-accent-bg, rgba(159,178,212,0.12))';
const ACCENT_BORDER = 'var(--book-accent-border, rgba(159,178,212,0.4))';
const CORAL = '#d98a85';
const GREEN = '#7bb89a';

const BREAKS = [
  { id: 'rarely', label: 'Rarely — I can stay on task', frac: 0.7 },
  { id: 'often', label: 'Often — I check my phone a lot', frac: 0.45 },
  { id: 'constantly', label: 'Constantly — I drift every few minutes', frac: 0.3 },
];

const TRAINED = 0.85; // deep-focus fraction once you've trained

function hm(hours: number): string {
  const total = Math.round(hours * 60);
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

export default function FocusTimeParadoxSim() {
  const [hours, setHours] = useState(3);
  const [breakId, setBreakId] = useState<string | null>(null);
  const [trained, setTrained] = useState(false);

  const chosen = BREAKS.find((b) => b.id === breakId) ?? null;

  const fracNow = chosen ? (trained ? TRAINED : chosen.frac) : 0;
  const deepNow = hours * fracNow;
  const leakNow = hours - deepNow;

  // For the "win back time" flip (uses the ORIGINAL self-reported focus).
  const originalDeep = chosen ? hours * chosen.frac : 0;
  const neededIfTrained = originalDeep / TRAINED;
  const wonBack = hours - neededIfTrained;

  const solidColor = trained ? GREEN : CORAL;
  const solidColorLight = trained ? '#a9d6bf' : '#eab5b0';

  return (
    <div className="ftp-root rounded-2xl" style={{ padding: '28px 24px 30px' }}>
      <div className="ftp-glow-a" />
      <div className="ftp-glow-b" />

      <div className="ftp-content">
        <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: ACCENT }}>
          Where does the time go?
        </div>

        {/* Step 1 — hours */}
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 8 }}>
          How long do you <strong style={{ color: '#fff' }}>sit down to study</strong> on a normal day?
        </p>
        <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={hours}
            onChange={(e) => {
              setHours(Number(e.target.value));
              setTrained(false);
            }}
            aria-label="Hours you sit to study"
            className="w-full"
            style={{ maxWidth: 320, accentColor: '#9fb2d4' }}
          />
          <span
            className="ftp-hours-badge"
            style={{ fontVariantNumeric: 'tabular-nums', fontSize: 17, fontWeight: 700, minWidth: 78, textAlign: 'center' }}
          >
            {hm(hours)}
          </span>
        </div>

        {/* Step 2 — self-reported break rate */}
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 10 }}>
          And honestly — how often does your focus <strong style={{ color: '#fff' }}>break</strong> while you sit there?
        </p>
        <div className="flex flex-col gap-2">
          {BREAKS.map((b) => {
            const on = breakId === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setBreakId(b.id);
                  setTrained(false);
                }}
                className={`ftp-choice text-left rounded-xl transition-all ${on ? 'ftp-choice-on' : ''}`}
                style={{ padding: '11px 15px', fontSize: 14.5 }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        {/* Reveal */}
        {chosen && (
          <div className="ftp-reveal" style={{ marginTop: 28 }}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: 14 }}>
              <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.62)' }}>
                Your <strong style={{ color: '#fff' }}>{hm(hours)}</strong> of sitting, split honestly
              </span>
              {trained && (
                <span className="ftp-trained-badge">
                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none" aria-hidden>
                    <path d="M4 10.5L8 14.5L16 6" stroke={GREEN} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  trained focus
                </span>
              )}
            </div>

            {/* legend chips */}
            <div className="flex flex-wrap items-center gap-2.5" style={{ marginBottom: 12 }}>
              <span className="ftp-chip" style={{ background: `${solidColor}1f`, border: `1px solid ${solidColor}55` }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: solidColor, display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.8)' }}>Real deep focus</span>
                <b style={{ color: solidColor, fontVariantNumeric: 'tabular-nums' }}>{hm(deepNow)}</b>
              </span>
              <span className="ftp-chip" style={{ background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: 'rgba(255,255,255,0.22)', display: 'inline-block' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Leaked to switching</span>
                <b style={{ color: 'rgba(255,255,255,0.55)', fontVariantNumeric: 'tabular-nums' }}>{hm(leakNow)}</b>
              </span>
            </div>

            {/* segmented bar */}
            <div className="ftp-bar-track">
              <div
                className="ftp-bar-fill"
                style={{
                  width: `${Math.max(3, fracNow * 100)}%`,
                  background: `linear-gradient(90deg, ${solidColor}, ${solidColorLight})`,
                  boxShadow: `0 0 18px 0 ${solidColor}55`,
                }}
              >
                <span className="ftp-bar-shine" />
              </div>
              <div className="ftp-bar-leak" style={{ flex: 1 }} />
            </div>

            {!trained ? (
              <>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.74)', marginTop: 18 }}>
                  You sat for <strong style={{ color: '#fff' }}>{hm(hours)}</strong>, but only about{' '}
                  <strong style={{ color: CORAL }}>{hm(deepNow)}</strong> was real, deep focus — the rest leaked away to
                  switching. The day didn’t get shorter. <em style={{ color: ACCENT_STRONG }}>Your focus did.</em>
                </p>
                <button type="button" onClick={() => setTrained(true)} className="ftp-cta" style={{ marginTop: 16 }}>
                  Now train that focus <span aria-hidden>→</span>
                </button>
              </>
            ) : (
              <div className="ftp-result" style={{ marginTop: 18 }}>
                <p style={{ fontSize: 15, lineHeight: 1.62, color: 'rgba(255,255,255,0.88)', margin: 0 }}>
                  Same <strong style={{ color: '#fff' }}>{hm(hours)}</strong> — but now{' '}
                  <strong style={{ color: GREEN }}>{hm(deepNow)}</strong> of it is real work, not {hm(originalDeep)}. Nearly{' '}
                  <strong style={{ color: GREEN }}>{Math.round(deepNow / Math.max(originalDeep, 0.01))}×</strong> more done.
                </p>
                <p style={{ fontSize: 15, lineHeight: 1.62, color: 'rgba(255,255,255,0.74)', margin: '10px 0 0' }}>
                  Or flip it: your old <strong style={{ color: '#fff' }}>{hm(originalDeep)}</strong> of work would now take
                  just <strong style={{ color: GREEN }}>{hm(neededIfTrained)}</strong> of sitting — that’s{' '}
                  <strong style={{ color: GREEN }}>{hm(wonBack)}</strong> won back for football, guitar, actually living.
                  And focus that sharp usually means <strong style={{ color: '#fff' }}>higher</strong> marks, not lower.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .ftp-root {
          position: relative;
          overflow: hidden;
          background: linear-gradient(165deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.015) 60%),
            #12151b;
          border: 1px solid ${ACCENT_BORDER};
          box-shadow: 0 24px 60px -28px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }
        .ftp-content {
          position: relative;
          z-index: 1;
        }
        .ftp-glow-a {
          position: absolute;
          top: -120px;
          right: -100px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(159, 178, 212, 0.32), rgba(159, 178, 212, 0) 70%);
          pointer-events: none;
        }
        .ftp-glow-b {
          position: absolute;
          bottom: -140px;
          left: -80px;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201, 168, 106, 0.14), rgba(201, 168, 106, 0) 70%);
          pointer-events: none;
        }
        .ftp-hours-badge {
          color: ${ACCENT_STRONG};
          background: ${ACCENT_BG};
          border: 1px solid ${ACCENT_BORDER};
          border-radius: 10px;
          padding: 6px 12px;
        }
        .ftp-choice {
          border: 1.5px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
          color: rgba(255, 255, 255, 0.58);
        }
        .ftp-choice:hover {
          border-color: rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.04);
        }
        .ftp-choice-on {
          border-color: ${ACCENT_BORDER} !important;
          background: linear-gradient(135deg, ${ACCENT_BG}, rgba(159, 178, 212, 0.05)) !important;
          color: #dbe3f2 !important;
          box-shadow: 0 0 0 1px rgba(159, 178, 212, 0.15), 0 6px 18px -8px rgba(159, 178, 212, 0.35);
        }
        .ftp-reveal {
          animation: ftpFadeUp 0.5s ease both;
        }
        .ftp-trained-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: ui-monospace, monospace;
          font-size: 11.5px;
          color: ${GREEN};
          background: rgba(123, 184, 154, 0.12);
          border: 1px solid rgba(123, 184, 154, 0.36);
          border-radius: 999px;
          padding: 4px 10px 4px 8px;
        }
        .ftp-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 12.5px;
          border-radius: 999px;
          padding: 6px 12px;
        }
        .ftp-bar-track {
          display: flex;
          height: 34px;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.09);
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.35);
        }
        .ftp-bar-fill {
          position: relative;
          transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease, box-shadow 0.4s ease;
        }
        .ftp-bar-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 45%);
          pointer-events: none;
        }
        .ftp-bar-leak {
          background-color: rgba(255, 255, 255, 0.03);
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.05) 5px,
            rgba(255, 255, 255, 0.015) 5px,
            rgba(255, 255, 255, 0.015) 10px
          );
          transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ftp-cta {
          font-size: 14.5px;
          font-weight: 600;
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid ${ACCENT_BORDER};
          background: linear-gradient(135deg, ${ACCENT_BG}, rgba(159, 178, 212, 0.06));
          color: ${ACCENT_STRONG};
          box-shadow: 0 10px 24px -14px rgba(159, 178, 212, 0.5);
          transition: transform 0.15s ease, box-shadow 0.2s ease, background 0.2s ease;
        }
        .ftp-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 28px -14px rgba(159, 178, 212, 0.65);
        }
        .ftp-cta:active {
          transform: translateY(0);
        }
        .ftp-result {
          border-radius: 14px;
          padding: 18px 20px;
          background: linear-gradient(150deg, rgba(123, 184, 154, 0.14), rgba(123, 184, 154, 0.05) 70%);
          border: 1px solid rgba(123, 184, 154, 0.32);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
        }
        @keyframes ftpFadeUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ftp-root :global(*) {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
