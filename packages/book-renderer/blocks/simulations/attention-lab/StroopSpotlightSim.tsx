'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { LAB, LabFrame, LabButton } from './_labkit';

/**
 * "Stroop — the beam vs the word" — the selective-attention & inhibition
 * instrument (J.R. Stroop, 1935). A colour word is printed in a mismatched ink;
 * the student must name the INK, not read the word. Automatic reading fights the
 * answer, and the reaction-time cost is measured on the student's own hand.
 *
 * The reveal quantifies the student's own "Stroop cost" (incongruent − congruent
 * reaction time) and names the mechanism: that lag is your attention being
 * hijacked by an automatic process — exactly what a notification does to study.
 *
 * A measured on-screen reaction game (this CAN be measured on screen, unlike the
 * physical Crossover) — a deliberately different treatment in the same Attention
 * Lab visual system. Registered as `stroop-spotlight`.
 */

type Color = { id: string; name: string; hex: string };
const COLORS: Color[] = [
  { id: 'red', name: 'RED', hex: '#e05a4d' },
  { id: 'blue', name: 'BLUE', hex: '#5b8fd6' },
  { id: 'green', name: 'GREEN', hex: '#4fae7b' },
  { id: 'gold', name: 'YELLOW', hex: '#d9a441' },
  { id: 'purple', name: 'PURPLE', hex: '#9a7bd0' },
];

type Trial = { wordId: string; inkId: string; congruent: boolean };
type Result = { congruent: boolean; rtMs: number; errors: number };

function buildTrials(): Trial[] {
  const trials: Trial[] = [];
  // 4 congruent + 10 incongruent, shuffled
  for (let i = 0; i < 14; i++) {
    const congruent = i < 4;
    const wordId = COLORS[Math.floor(Math.random() * COLORS.length)].id;
    let inkId = wordId;
    if (!congruent) {
      const others = COLORS.filter((c) => c.id !== wordId);
      inkId = others[Math.floor(Math.random() * others.length)].id;
    }
    trials.push({ wordId, inkId, congruent });
  }
  for (let i = trials.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [trials[i], trials[j]] = [trials[j], trials[i]];
  }
  return trials;
}

type Mode = 'intro' | 'running' | 'done';

export default function StroopSpotlightSim() {
  const [mode, setMode] = useState<Mode>('intro');
  const [trials, setTrials] = useState<Trial[]>([]);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [shake, setShake] = useState(false);
  const [enterKey, setEnterKey] = useState(0);
  const trialStart = useRef(0);
  const trialErrors = useRef(0);

  const byId = useMemo(() => Object.fromEntries(COLORS.map((c) => [c.id, c])), []);

  const start = useCallback(() => {
    const t = buildTrials();
    setTrials(t);
    setResults([]);
    setIdx(0);
    trialErrors.current = 0;
    trialStart.current = performance.now();
    setEnterKey((k) => k + 1);
    setMode('running');
  }, []);

  const answer = useCallback(
    (colorId: string) => {
      const trial = trials[idx];
      if (!trial) return;
      if (colorId !== trial.inkId) {
        trialErrors.current += 1;
        setShake(true);
        setTimeout(() => setShake(false), 320);
        return;
      }
      const rt = performance.now() - trialStart.current;
      const res: Result = { congruent: trial.congruent, rtMs: rt, errors: trialErrors.current };
      const next = [...results, res];
      setResults(next);
      trialErrors.current = 0;
      if (idx + 1 >= trials.length) {
        setMode('done');
      } else {
        setIdx(idx + 1);
        trialStart.current = performance.now();
        setEnterKey((k) => k + 1);
      }
    },
    [trials, idx, results],
  );

  const stats = useMemo(() => {
    const cong = results.filter((r) => r.congruent);
    const incong = results.filter((r) => !r.congruent);
    const avg = (a: Result[]) => (a.length ? a.reduce((s, r) => s + r.rtMs, 0) / a.length : 0);
    const c = avg(cong);
    const i = avg(incong);
    const totalErr = results.reduce((s, r) => s + r.errors, 0);
    return { c, i, cost: Math.max(0, i - c), totalErr };
  }, [results]);

  const trial = trials[idx];
  const word = trial ? byId[trial.wordId] : null;
  const ink = trial ? byId[trial.inkId] : null;

  return (
    <LabFrame eyebrow="Selective attention · Stroop" tone={mode === 'done' ? 'green' : 'accent'}>
      {mode === 'intro' && (
        <div>
          <p style={{ fontSize: 16, color: LAB.ink, marginBottom: 10, lineHeight: 1.5 }}>
            One rule, and it’s harder than it sounds: tap the <strong style={{ color: '#fff' }}>colour of the ink</strong>
            — <em>not</em> the word it spells.
          </p>
          <div style={{ textAlign: 'center', margin: '18px 0 22px' }}>
            <span style={{ fontFamily: '"Arial Black", system-ui, sans-serif', fontWeight: 800, fontSize: 46, color: COLORS[2].hex, letterSpacing: '0.02em' }}>
              RED
            </span>
            <div style={{ fontSize: 13, color: LAB.inkMute, marginTop: 8, fontFamily: LAB.mono }}>
              …the answer here is <b style={{ color: COLORS[2].hex }}>green</b>. Feel the tug?
            </div>
          </div>
          <LabButton onClick={start}>Start — 14 rounds →</LabButton>
        </div>
      )}

      {mode === 'running' && trial && word && ink && (
        <div>
          {/* progress dots */}
          <div className="flex items-center justify-center gap-1.5" style={{ marginBottom: 20 }}>
            {trials.map((_, i) => (
              <span
                key={i}
                style={{
                  width: i === idx ? 16 : 7,
                  height: 7,
                  borderRadius: 999,
                  background: i < idx ? LAB.accent : i === idx ? LAB.accentStrong : 'rgba(255,255,255,0.12)',
                  transition: 'all .2s ease',
                }}
              />
            ))}
          </div>

          {/* the word */}
          <div className={`stroop-word ${shake ? 'stroop-shake' : ''}`} key={enterKey} style={{ textAlign: 'center', padding: '18px 0 26px' }}>
            <span
              style={{
                fontFamily: '"Arial Black", system-ui, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(52px, 15vw, 92px)',
                color: ink.hex,
                letterSpacing: '0.02em',
                textShadow: `0 0 40px ${ink.hex}44`,
              }}
            >
              {word.name}
            </span>
          </div>

          {/* swatches */}
          <div className="flex items-center justify-center gap-2.5" style={{ flexWrap: 'wrap' }}>
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => answer(c.id)}
                aria-label={c.name}
                className="stroop-swatch"
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 12.5, color: LAB.inkMute, marginTop: 14, fontFamily: LAB.mono }}>
            tap the colour it’s <b>printed in</b>
          </p>

          <style jsx>{`
            .stroop-word {
              animation: stroopIn 0.18s ease;
            }
            .stroop-shake {
              animation: stroopShake 0.32s ease;
            }
            .stroop-swatch {
              width: 52px;
              height: 52px;
              border-radius: 14px;
              border: 2px solid rgba(255, 255, 255, 0.18);
              cursor: pointer;
              transition: transform 0.12s ease, box-shadow 0.2s ease, border-color 0.2s ease;
              box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.6);
            }
            .stroop-swatch:hover {
              transform: translateY(-2px) scale(1.05);
              border-color: rgba(255, 255, 255, 0.5);
            }
            .stroop-swatch:active {
              transform: translateY(0) scale(0.97);
            }
            @keyframes stroopIn {
              from {
                opacity: 0;
                transform: translateY(6px) scale(0.98);
              }
              to {
                opacity: 1;
                transform: none;
              }
            }
            @keyframes stroopShake {
              10%,
              90% {
                transform: translateX(-2px);
              }
              30%,
              70% {
                transform: translateX(5px);
              }
              50% {
                transform: translateX(-7px);
              }
            }
            @media (prefers-reduced-motion: reduce) {
              .stroop-word,
              .stroop-shake {
                animation: none;
              }
            }
          `}</style>
        </div>
      )}

      {mode === 'done' && (
        <div>
          <div className="text-center" style={{ margin: '2px 0 20px' }}>
            <div style={{ fontFamily: LAB.mono, fontSize: 12, letterSpacing: '0.12em', color: LAB.inkMute, textTransform: 'uppercase' }}>
              the word cost you
            </div>
            <div style={{ fontFamily: LAB.serif, fontWeight: 600, fontSize: 'clamp(46px,12vw,74px)', lineHeight: 1, color: stats.cost > 120 ? LAB.coral : LAB.green, marginTop: 4 }}>
              +{Math.round(stats.cost)}
              <span style={{ fontSize: 22, color: LAB.inkMute }}> ms</span>
            </div>
            <div style={{ fontFamily: LAB.mono, fontSize: 12, color: LAB.inkMute, marginTop: 4 }}>
              every time the word fought the ink
            </div>
          </div>

          {/* comparison bars */}
          <div style={{ maxWidth: 460, margin: '0 auto 20px' }}>
            <RtBar label="Ink & word agreed" ms={stats.c} maxMs={Math.max(stats.i, stats.c, 1)} color={LAB.green} />
            <RtBar label="Word fought the ink" ms={stats.i} maxMs={Math.max(stats.i, stats.c, 1)} color={LAB.coral} />
          </div>

          <p style={{ fontSize: 15, color: LAB.inkMid, lineHeight: 1.62, margin: 0 }}>
            That extra lag is real: your brain <strong style={{ color: '#fff' }}>can’t not read</strong>, so it has to
            fight its own automatic habit before it can answer. That fight <em>is</em> selective attention — the same
            muscle you use to stay on a page while a notification screams for your eyes. You just measured it in
            milliseconds.
          </p>
          <div style={{ marginTop: 18 }}>
            <LabButton onClick={start}>Run it again →</LabButton>
          </div>
        </div>
      )}
    </LabFrame>
  );
}

function RtBar({ label, ms, maxMs, color }: { label: string; ms: number; maxMs: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="flex justify-between items-baseline" style={{ marginBottom: 5 }}>
        <span style={{ fontSize: 13, color: LAB.inkMid }}>{label}</span>
        <span style={{ fontSize: 13, color, fontFamily: LAB.mono, fontWeight: 600 }}>{Math.round(ms)} ms</span>
      </div>
      <div style={{ height: 14, borderRadius: 999, background: 'rgba(255,255,255,0.05)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div
          style={{
            height: '100%',
            width: `${Math.max(4, (ms / maxMs) * 100)}%`,
            borderRadius: 999,
            background: `linear-gradient(90deg, ${color}, ${color}bb)`,
            boxShadow: `0 0 16px 0 ${color}55`,
            transition: 'width .7s cubic-bezier(.4,0,.2,1)',
          }}
        />
      </div>
    </div>
  );
}
