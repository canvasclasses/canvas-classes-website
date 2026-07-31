'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LAB, LabFrame, LabButton, useRaf } from './_labkit';

/**
 * "The Crossover" — the mind-body coordination instrument, as a playable
 * keyboard/touch rhythm game. Each hand's INDEX + MIDDLE fingertips are keys
 * (left F/D, right J/K — where those fingers rest on a keyboard). Each beat two
 * keys light in an ANTI-PHASE diagonal (left-index F + right-middle K, then
 * left-middle D + right-index J); the student presses both. The metronome ramps;
 * past a critical tempo the anti-phase pattern collapses into in-phase and the
 * hits fall apart — the Haken–Kelso–Bunz transition (Haken, Kelso & Bunz 1985).
 * The game AUTO-DETECTS the collapse (accuracy falls off a cliff) and captures
 * the student's own critical tempo.
 *
 * v3 (founder feedback): concrete input (labeled keys, tap or type) + live
 * hit/miss feedback + auto-detected collapse — no vague "tap your fingers", no
 * relying on the student to self-notice. Warm-up + 3-2-1 countdown before the
 * ramp. Registered as `the-crossover`.
 */

const START_BPM = 84;
const MAX_BPM = 300;
const RAMP_MS = 46000;
const LEARN_BPM = 64;
const COUNTDOWN_MS = 3200;
const HOLD_MS = 3000;
const WINDOW = 6; // rolling beats for collapse detection
const COLLAPSE_MISSES = 4; // misses within the window that count as "collapsed"
const BEST_KEY = 'canvas_lab_crossover_best';

type Mode = 'learn' | 'countdown' | 'running' | 'done';
type Finger = 'index' | 'middle';

// key ↔ hand/finger map
const KEYS = {
  F: { side: 'left', finger: 'index' },
  D: { side: 'left', finger: 'middle' },
  J: { side: 'right', finger: 'index' },
  K: { side: 'right', finger: 'middle' },
} as const;
type KeyId = keyof typeof KEYS;
const PATTERN_A: KeyId[] = ['F', 'K']; // left-index + right-middle
const PATTERN_B: KeyId[] = ['D', 'J']; // left-middle + right-index

function readBest(): number | null {
  try { const v = localStorage.getItem(BEST_KEY); return v ? Number(v) : null; } catch { return null; }
}
function writeBest(bpm: number) {
  try { const p = readBest(); if (p === null || bpm > p) localStorage.setItem(BEST_KEY, String(Math.round(bpm))); } catch { /* ignore */ }
}

// ── SVG hand with two fingertip keys ─────────────────────────────────────────
// Fingers as tapered paths merged into a palm (one gradient → reads as a hand,
// not floating capsules). The index + middle fingertips carry glowing key pads.
function fingerPath(cx: number, yTip: number, yBase: number, wTip: number, wBase: number) {
  const l = wBase / 2;
  const lt = wTip / 2;
  return `M ${cx - l} ${yBase} L ${cx - lt} ${yTip + lt} A ${lt} ${lt} 0 0 1 ${cx + lt} ${yTip + lt} L ${cx + l} ${yBase} Z`;
}

// right-hand geometry (thumb on left); left hand is mirrored
const GEO = {
  index: { cx: 80, yTip: 66, wTip: 22, wBase: 30 },
  middle: { cx: 112, yTip: 48, wTip: 23, wBase: 31 },
  ring: { cx: 143, yTip: 68, wTip: 21, wBase: 28 },
  pinky: { cx: 169, yTip: 92, wTip: 18, wBase: 24 },
  yBase: 158,
};

function Hand({
  side,
  lit,
  down,
  onPress,
}: {
  side: 'left' | 'right';
  lit: Finger | null;
  down: Set<KeyId>;
  onPress: (k: KeyId) => void;
}) {
  const mir = side === 'left';
  const mx = (x: number) => (mir ? 236 - x : x);
  const keyFor = (finger: Finger): KeyId =>
    side === 'left' ? (finger === 'index' ? 'F' : 'D') : finger === 'index' ? 'J' : 'K';

  const skin = `skin-${side}`;
  const live = `live-${side}`;

  return (
    <svg viewBox="0 0 236 266" width="100%" style={{ maxWidth: 210, display: 'block' }}>
      <defs>
        <linearGradient id={skin} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2f3644" />
          <stop offset="1" stopColor="#191d25" />
        </linearGradient>
        <radialGradient id={live} cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#d3ddf0" />
          <stop offset="1" stopColor="#7286aa" />
        </radialGradient>
      </defs>

      {/* hand silhouette (not mirrored via text so it stays clean) */}
      <g transform={mir ? 'translate(236,0) scale(-1,1)' : undefined}>
        {/* palm */}
        <path
          d="M 52 168 Q 50 150 70 150 L 166 150 Q 186 150 184 168 L 178 228 Q 174 244 156 244 L 80 244 Q 62 244 58 228 Z"
          fill={`url(#${skin})`}
          stroke="rgba(255,255,255,0.06)"
        />
        {/* thumb */}
        <g transform="rotate(-40 62 188)">
          <path d={fingerPath(62, 150, 214, 22, 30)} fill={`url(#${skin})`} stroke="rgba(255,255,255,0.06)" />
        </g>
        {/* fingers */}
        <path d={fingerPath(GEO.pinky.cx, GEO.pinky.yTip, GEO.yBase, GEO.pinky.wTip, GEO.pinky.wBase)} fill={`url(#${skin})`} stroke="rgba(255,255,255,0.05)" opacity="0.6" />
        <path d={fingerPath(GEO.ring.cx, GEO.ring.yTip, GEO.yBase, GEO.ring.wTip, GEO.ring.wBase)} fill={`url(#${skin})`} stroke="rgba(255,255,255,0.05)" opacity="0.6" />
        <path d={fingerPath(GEO.middle.cx, GEO.middle.yTip, GEO.yBase, GEO.middle.wTip, GEO.middle.wBase)} fill={`url(#${skin})`} stroke="rgba(255,255,255,0.07)" />
        <path d={fingerPath(GEO.index.cx, GEO.index.yTip, GEO.yBase, GEO.index.wTip, GEO.index.wBase)} fill={`url(#${skin})`} stroke="rgba(255,255,255,0.07)" />
      </g>

      {/* fingertip key pads (index + middle) — non-mirrored so labels read right */}
      {(['index', 'middle'] as Finger[]).map((finger) => {
        const g = GEO[finger];
        const cx = mx(g.cx);
        const cy = g.yTip + 4;
        const id = keyFor(finger);
        const isLit = lit === finger;
        const isDown = down.has(id);
        return (
          <g
            key={id}
            onPointerDown={(e) => {
              e.preventDefault();
              onPress(id);
            }}
            style={{ cursor: 'pointer', touchAction: 'none' }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={19}
              fill={isLit ? `url(#${live})` : 'rgba(255,255,255,0.06)'}
              stroke={isLit ? 'rgba(211,221,240,0.95)' : 'rgba(255,255,255,0.18)'}
              strokeWidth={isLit ? 2 : 1.5}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transform: isDown ? 'scale(0.86)' : 'scale(1)',
                filter: isLit ? 'drop-shadow(0 0 12px rgba(159,178,212,0.9))' : 'none',
                transition: 'transform .08s ease, filter .12s ease, fill .1s ease',
              }}
            />
            <text
              x={cx}
              y={cy + 5}
              textAnchor="middle"
              fontFamily={LAB.mono}
              fontSize="15"
              fontWeight="700"
              fill={isLit ? '#0f1218' : 'rgba(255,255,255,0.5)'}
              style={{ pointerEvents: 'none' }}
            >
              {id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function TheCrossoverSim() {
  const [mode, setMode] = useState<Mode>('learn');
  const [muted, setMuted] = useState(false);
  const [bpmView, setBpmView] = useState(START_BPM);
  const [count, setCount] = useState(3);
  const [lit, setLit] = useState<{ left: Finger; right: Finger }>({ left: 'index', right: 'middle' });
  const [down, setDown] = useState<Set<KeyId>>(new Set());
  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);
  const [streak, setStreak] = useState(0);
  const [captured, setCaptured] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);

  const audioRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(muted); mutedRef.current = muted;
  const modeRef = useRef(mode); modeRef.current = mode;
  const finishedRef = useRef(false);
  const beatPressed = useRef<Set<KeyId>>(new Set());
  const expected = useRef<KeyId[]>([]);
  const rolling = useRef<boolean[]>([]);
  const downRef = useRef<Set<KeyId>>(new Set());
  const tapTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const sim = useRef({ elapsed: 0, bpm: LEARN_BPM, beatAcc: 0, beat: 0 });

  useEffect(() => setBest(readBest()), []);

  const tick = useCallback(() => {
    if (mutedRef.current) return;
    const ac = audioRef.current; if (!ac) return;
    const osc = ac.createOscillator(); const g = ac.createGain();
    osc.frequency.value = 1500;
    g.gain.setValueAtTime(0.0001, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.1, ac.currentTime + 0.002);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.05);
    osc.connect(g); g.connect(ac.destination); osc.start(); osc.stop(ac.currentTime + 0.06);
  }, []);

  const registerPress = useCallback((k: KeyId) => {
    if (modeRef.current === 'done') return;
    beatPressed.current.add(k);
    downRef.current.add(k);
    setDown(new Set(downRef.current));
    // momentary release for taps (keyup handles keyboard); safe double-clear
    clearTimeout(tapTimers.current[k]);
    tapTimers.current[k] = setTimeout(() => {
      downRef.current.delete(k);
      setDown(new Set(downRef.current));
    }, 140);
  }, []);

  // keyboard input while active
  useEffect(() => {
    if (mode === 'done') return;
    const kd = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k in KEYS) { e.preventDefault(); registerPress(k as KeyId); }
    };
    const ku = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k in KEYS) { downRef.current.delete(k as KeyId); setDown(new Set(downRef.current)); }
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); };
  }, [mode, registerPress]);

  useRaf((dt) => {
    const s = sim.current;
    const m = modeRef.current;

    if (m === 'countdown') {
      s.elapsed += dt;
      const rem = Math.max(0, COUNTDOWN_MS - s.elapsed);
      const c = Math.ceil(rem / 1000);
      if (c !== count) setCount(c);
      s.bpm = LEARN_BPM;
      if (rem <= 0) { s.elapsed = 0; s.beatAcc = 0; s.beat = 0; rolling.current = []; setStreak(0); modeRef.current = 'running'; setMode('running'); }
    } else if (m === 'running') {
      s.elapsed += dt;
      s.bpm = START_BPM + (MAX_BPM - START_BPM) * Math.min(s.elapsed / RAMP_MS, 1);
    } else {
      s.bpm = LEARN_BPM;
    }

    const beatMs = 60000 / s.bpm;
    s.beatAcc += dt;
    if (s.beatAcc >= beatMs) {
      s.beatAcc -= beatMs;

      // evaluate the beat that just ended
      const exp = expected.current;
      if (exp.length) {
        const bp = beatPressed.current;
        const hit = exp.every((k) => bp.has(k)) && bp.size === exp.length;
        if (m === 'running') {
          setFeedback(hit ? 'hit' : 'miss');
          setStreak((st) => (hit ? st + 1 : 0));
          rolling.current.push(hit);
          if (rolling.current.length > WINDOW) rolling.current.shift();
          const misses = rolling.current.filter((x) => !x).length;
          if (rolling.current.length >= WINDOW && misses >= COLLAPSE_MISSES && !finishedRef.current) {
            finishedRef.current = true;
            const bpm = Math.round(START_BPM + (MAX_BPM - START_BPM) * Math.min((s.elapsed) / RAMP_MS, 1));
            setCaptured(bpm); writeBest(bpm); setBest(readBest());
            modeRef.current = 'done'; setMode('done');
            return;
          }
        } else {
          setFeedback(hit ? 'hit' : null);
        }
      }

      // start the new beat
      s.beat++;
      const a = s.beat % 2 === 0;
      expected.current = a ? PATTERN_A : PATTERN_B;
      setLit({ left: a ? 'index' : 'middle', right: a ? 'middle' : 'index' });
      beatPressed.current = new Set();
      if (m !== 'done') tick();
    }

    if (m === 'running' && Math.abs(Math.round(s.bpm) - bpmView) >= 1) setBpmView(Math.round(s.bpm));

    if (m === 'running' && s.elapsed >= RAMP_MS + HOLD_MS && !finishedRef.current) {
      finishedRef.current = true; setCaptured(null); modeRef.current = 'done'; setMode('done');
    }
  }, mode !== 'done');

  const startTest = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC && !audioRef.current) audioRef.current = new AC();
      audioRef.current?.resume();
    } catch { /* audio optional */ }
    sim.current.elapsed = 0; finishedRef.current = false; setCaptured(null); setCount(3);
    modeRef.current = 'countdown'; setMode('countdown');
  }, []);

  const restart = useCallback(() => {
    sim.current = { elapsed: 0, bpm: LEARN_BPM, beatAcc: 0, beat: 0 };
    finishedRef.current = false; rolling.current = []; setCaptured(null); setStreak(0); setFeedback(null);
    modeRef.current = 'learn'; setMode('learn');
  }, []);

  const showHands = mode !== 'done';
  const fbColor = feedback === 'hit' ? LAB.green : feedback === 'miss' ? LAB.coral : 'transparent';

  return (
    <LabFrame eyebrow="Mind–body coordination · The Crossover" tone={mode === 'done' ? 'green' : 'accent'}>
      {mode !== 'done' && (
        <div className="flex items-baseline justify-between" style={{ marginBottom: 4 }}>
          <span style={{ fontSize: 14.5, color: LAB.ink, fontWeight: 600 }}>
            {mode === 'countdown' ? 'Get ready…' : 'Press the two lit keys together — every beat'}
          </span>
          {mode === 'running' && (
            <span style={{ fontFamily: LAB.mono, fontSize: 15, color: streak > 3 ? LAB.green : LAB.inkMute }}>
              {bpmView} bpm · streak {streak}
            </span>
          )}
        </div>
      )}
      {mode === 'learn' && (
        <p style={{ fontSize: 13.5, color: LAB.inkMute, margin: '0 0 4px', lineHeight: 1.5 }}>
          Type on your keyboard (<b style={{ color: LAB.accentStrong }}>F D</b> left hand, <b style={{ color: LAB.accentStrong }}>J K</b> right)
          or tap the pads. Two light up → press both. Then the other two. Keep alternating.
        </p>
      )}

      {showHands && (
        <div style={{ position: 'relative', borderRadius: 16, transition: 'box-shadow .15s ease', boxShadow: feedback && mode === 'running' ? `inset 0 0 0 2px ${fbColor}55` : 'none' }}>
          <div className="flex items-start justify-center" style={{ gap: 'clamp(12px, 5vw, 60px)', padding: '16px 0 4px' }}>
            <div style={{ textAlign: 'center' }}>
              <Hand side="left" lit={mode === 'countdown' ? null : lit.left} down={down} onPress={registerPress} />
              <div style={{ fontFamily: LAB.mono, fontSize: 11, color: LAB.inkMute, letterSpacing: '0.1em', marginTop: 2 }}>LEFT · F D</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Hand side="right" lit={mode === 'countdown' ? null : lit.right} down={down} onPress={registerPress} />
              <div style={{ fontFamily: LAB.mono, fontSize: 11, color: LAB.inkMute, letterSpacing: '0.1em', marginTop: 2 }}>RIGHT · J K</div>
            </div>
          </div>

          {mode === 'countdown' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(18,21,27,0.6)', borderRadius: 16 }}>
              <span key={count} className="cd-num" style={{ fontFamily: LAB.serif, fontSize: 88, fontWeight: 600, color: LAB.accentStrong }}>
                {count > 0 ? count : 'Go'}
              </span>
            </div>
          )}
        </div>
      )}

      {mode === 'learn' && (
        <div className="flex items-center gap-3" style={{ marginTop: 12, flexWrap: 'wrap' }}>
          <LabButton onClick={startTest}>I’ve got it — start the test →</LabButton>
          <button type="button" onClick={() => setMuted((x) => !x)} style={{ fontSize: 12.5, fontFamily: LAB.mono, color: LAB.inkMute, background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, padding: '7px 13px', cursor: 'pointer' }}>
            {muted ? '🔇 tick off' : '🔊 tick on'}
          </button>
          {best !== null && <span style={{ fontSize: 12.5, color: LAB.inkMute, fontFamily: LAB.mono }}>best · {best} bpm</span>}
        </div>
      )}

      {mode === 'running' && (
        <p style={{ textAlign: 'center', fontSize: 12.5, color: LAB.inkMute, marginTop: 10, fontFamily: LAB.mono }}>
          it speeds up — the game will catch the moment you break
        </p>
      )}

      {mode === 'done' && (
        <div>
          {captured !== null ? (
            <>
              <div className="text-center" style={{ margin: '4px 0 18px' }}>
                <div style={{ fontFamily: LAB.mono, fontSize: 12, letterSpacing: '0.12em', color: LAB.inkMute, textTransform: 'uppercase' }}>your hands held the crossing pattern to</div>
                <div style={{ fontFamily: LAB.serif, fontWeight: 600, fontSize: 'clamp(46px,12vw,74px)', lineHeight: 1, color: LAB.green, marginTop: 4 }}>{captured}</div>
                <div style={{ fontFamily: LAB.mono, fontSize: 12, color: LAB.inkMute, marginTop: 4 }}>beats per minute</div>
              </div>
              <p style={{ fontSize: 15, color: LAB.inkMid, lineHeight: 1.62, margin: '0 0 10px' }}>
                Past that speed your hands stopped obeying — the presses fell apart because the crossing pattern{' '}
                <strong style={{ color: '#fff' }}>collapses into the easy in-sync one on its own</strong>. That’s not weak
                willpower; it’s the <strong style={{ color: LAB.accentStrong }}>Haken–Kelso–Bunz limit</strong>, wired into
                every human brain.
              </p>
              <p style={{ fontSize: 15, color: LAB.inkMid, lineHeight: 1.62, margin: 0 }}>
                The hopeful part — practise a couple of minutes a day and that number <strong style={{ color: LAB.green }}>climbs</strong>.
                Coordination is a real, trainable skill, and the focused attention underneath it trains right alongside.
              </p>
            </>
          ) : (
            <p style={{ fontSize: 16, color: LAB.ink, lineHeight: 1.6, marginBottom: 4 }}>
              You held the crossing pattern all the way to the top — genuinely rare. Your brain kept both hands independent
              even under real speed.
            </p>
          )}
          <div className="flex items-center gap-3" style={{ marginTop: 18, flexWrap: 'wrap' }}>
            <LabButton onClick={restart}>Run it again →</LabButton>
            {best !== null && <span style={{ fontSize: 12.5, color: LAB.inkMute, fontFamily: LAB.mono }}>best · {best} bpm</span>}
          </div>
        </div>
      )}

      <style jsx>{`
        .cd-num { animation: cdPop 0.9s ease; }
        @keyframes cdPop { 0% { opacity: 0; transform: scale(1.5); } 30% { opacity: 1; transform: scale(1); } 100% { opacity: 0.75; } }
        @media (prefers-reduced-motion: reduce) { .cd-num { animation: none; } }
      `}</style>
    </LabFrame>
  );
}
