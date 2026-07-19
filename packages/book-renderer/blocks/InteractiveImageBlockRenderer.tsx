'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { InteractiveImageBlock, Hotspot } from '@canvas/data/types/books';
import ReactMarkdown from 'react-markdown';

const iconShape: Record<NonNullable<Hotspot['icon']>, string> = {
  circle: '●',
  pin: '📍',
  plus: '+',
};

// Block-level width preset — same options/meaning as ImageBlock['width'] so
// an interactive_image can be narrowed the same way a plain image can.
// Only caps the max horizontal footprint; a portrait image narrower than
// this cap is unaffected (its own max-height cap below governs it instead).
const OUTER_WIDTH_CLASS: Record<NonNullable<InteractiveImageBlock['width']>, string> = {
  full:           'max-w-full',
  five_sixth:     'max-w-[83.333%]',
  three_quarter:  'max-w-[75%]',
  two_third:      'max-w-[66.667%]',
  half:           'max-w-[50%]',
  two_fifth:      'max-w-[40%]',
  third:          'max-w-[33.333%]',
  quarter:        'max-w-[25%]',
};

// Caps a tall/portrait diagram's rendered height so it can never blow up the
// page (the bug: an unconstrained portrait image rendered at full container
// width could be 1000px+ tall, pushing the tap-to-reveal panel off-screen).
// Landscape diagrams (the common case) rarely hit this cap at normal reading
// widths, so their layout is unaffected.
const MAX_IMAGE_HEIGHT = 'min(68vh, 640px)';

// Label Sprint (quiz mode) is only worth offering when there are enough
// distinct labels to make recall a real test.
const MIN_HOTSPOTS_FOR_QUIZ = 3;

function shuffle<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export default function InteractiveImageBlockRenderer({
  block,
  autoQuiz = false,
  onQuizComplete,
}: {
  block: InteractiveImageBlock;
  // When true (e.g. launched from the Bio Deck), open straight into a Label
  // Sprint round instead of explore mode.
  autoQuiz?: boolean;
  // Fired once each time a Label Sprint round finishes, with the round's accuracy
  // (0–100). The Bio Deck uses this to update the spaced-repetition schedule.
  onQuizComplete?: (accuracy: number) => void;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const completeFiredRef = useRef(false);

  // --- Label Sprint (quiz mode) state ---
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [round, setRound] = useState(0);        // bump to reshuffle + reset a round
  const [armedId, setArmedId] = useState<string | null>(null);
  const [placed, setPlaced] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [combo, setCombo] = useState(0);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const total = block.hotspots.length;
  const quizDone = mode === 'quiz' && total > 0 && placed.length === total;
  const canQuiz = !!block.src && total >= MIN_HOTSPOTS_FOR_QUIZ;

  const activeHotspot = block.hotspots.find((h) => h.id === activeId);

  // Reveal the tapped hotspot's detail panel even when the image (or the
  // panel itself, on a small screen) sits below the fold.
  useEffect(() => {
    if (activeHotspot) {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeHotspot]);

  // Quiz timer — runs only while a round is in progress.
  useEffect(() => {
    if (mode !== 'quiz' || quizDone || startAt === null) return;
    const t = setInterval(() => setElapsed((Date.now() - startAt) / 1000), 100);
    return () => clearInterval(t);
  }, [mode, quizDone, startAt]);

  const trayOrder = useMemo(() => shuffle(block.hotspots), [block.hotspots, round]);

  function startQuiz() {
    setPlaced([]); setAttempts(0); setCorrect(0); setCombo(0);
    setArmedId(null); setWrongId(null); setElapsed(0);
    setStartAt(Date.now()); setRound((r) => r + 1); setActiveId(null);
    setMode('quiz');
  }
  function exitQuiz() { setMode('explore'); setArmedId(null); setWrongId(null); }

  function tapTarget(hid: string) {
    if (placed.includes(hid) || quizDone) return;
    if (!armedId) return;
    setAttempts((a) => a + 1);
    if (armedId === hid) {
      setPlaced((p) => [...p, hid]);
      setCorrect((c) => c + 1);
      setCombo((c) => c + 1);
      setArmedId(null);
    } else {
      setCombo(0);
      setWrongId(hid);
      setTimeout(() => setWrongId((w) => (w === hid ? null : w)), 450);
    }
  }

  const accuracy = attempts ? Math.round((correct / attempts) * 100) : 100;

  // Deck launch: open straight into a round on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (autoQuiz && block.src) startQuiz(); }, []);

  // Report each completed round's accuracy back to the deck exactly once.
  useEffect(() => {
    if (quizDone && !completeFiredRef.current) {
      completeFiredRef.current = true;
      onQuizComplete?.(accuracy);
    }
    if (!quizDone) completeFiredRef.current = false;
  }, [quizDone, accuracy, onQuizComplete]);

  // PLACEHOLDER STATE (no src yet) — mirror ImageBlockRenderer §102: never pass
  // an empty string to <Image>/<img> (Next warns it re-downloads the whole page,
  // and it's a broken request). Show the generation-prompt card, and list the
  // authored hotspots below so the content is visible in the editor preview
  // before the diagram is uploaded.
  if (!block.src) {
    return (
      <figure className="my-6">
        <div className="w-full rounded-xl border border-dashed border-white/15 bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/8 flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-white/25 select-none">
              🖼 Interactive Image Pending
            </span>
            <span className="ml-auto text-[10px] text-white/20 italic">{block.alt}</span>
          </div>
          {block.generation_prompt && (
            <div className="px-4 py-4">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-orange-400/50 mb-2 select-none">
                AI Generation Prompt
              </p>
              <p className="text-[13px] leading-[1.65] text-white/50 font-mono">
                {block.generation_prompt}
              </p>
            </div>
          )}
          {block.hotspots.length > 0 && (
            <div className="px-4 py-3 border-t border-white/8">
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-white/25 mb-2 select-none">
                {block.hotspots.length} hotspot{block.hotspots.length === 1 ? '' : 's'}
              </p>
              <ul className="space-y-2">
                {block.hotspots.map((h) => (
                  <li key={h.id} className="text-[13px] leading-snug">
                    <p className="text-orange-400/70 font-semibold mb-0.5">{h.label}</p>
                    <div className="text-white/55 prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{h.detail}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-white/40 italic">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // SVGs bypass the Next.js optimizer (not allowed by default for security).
  const isSvg = /\.svg(\?|#|$)/i.test(block.src);
  const outerWidthClass = OUTER_WIDTH_CLASS[block.width ?? 'full'];

  // Anchor the popover to whichever side of the dot has room, using the
  // hotspot's own authored position as a cheap proxy for "which edge is
  // this near" — a dot in the right third flips the popover to open
  // leftward instead of overflowing past the image's right edge, etc.
  const anchorH: 'left' | 'right' | 'center' = !activeHotspot
    ? 'center'
    : activeHotspot.x < 0.35 ? 'left' : activeHotspot.x > 0.65 ? 'right' : 'center';
  const anchorV: 'above' | 'below' = activeHotspot && activeHotspot.y > 0.6 ? 'above' : 'below';

  const imageEl = isSvg ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={block.src}
      alt={block.alt}
      className="block object-contain"
      style={{ maxHeight: MAX_IMAGE_HEIGHT, maxWidth: '100%', width: 'auto', height: 'auto' }}
      draggable={false}
    />
  ) : (
    <Image
      src={block.src}
      alt={block.alt}
      width={0}
      height={0}
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 960px"
      style={{ maxHeight: MAX_IMAGE_HEIGHT, maxWidth: '100%', width: 'auto', height: 'auto' }}
      className="object-contain block"
      draggable={false}
    />
  );

  return (
    <figure className="my-4">
      {/* Mode toggle — only when there are enough labels for a real quiz. */}
      {canQuiz && (
        <div className={`flex justify-center ${outerWidthClass} mx-auto mb-2`}>
          <div className="w-full flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-white/30 select-none">
              {mode === 'quiz' ? 'Label Sprint' : 'Tap a dot to explore'}
            </span>
            {mode === 'explore' ? (
              <button
                onClick={startQuiz}
                className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/40
                  text-orange-300 hover:bg-orange-500/25 transition-colors"
              >
                🎯 Test yourself
              </button>
            ) : (
              <button
                onClick={exitQuiz}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                  text-white/60 hover:bg-white/10 transition-colors"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz HUD */}
      {mode === 'quiz' && (
        <div className={`flex justify-center ${outerWidthClass} mx-auto mb-2`}>
          <div className="w-full grid grid-cols-3 gap-2">
            {[
              { k: 'Time', v: `${elapsed.toFixed(1)}s` },
              { k: 'Combo', v: `${combo}×`, hot: combo >= 2 },
              { k: 'Placed', v: `${placed.length}/${total}` },
            ].map((s) => (
              <div key={s.k} className="rounded-lg bg-[#0B0F15] border border-white/10 px-2 py-1.5 text-center">
                <div className="text-[9px] tracking-[0.08em] uppercase text-white/30">{s.k}</div>
                <div className={`text-[15px] font-bold tabular-nums ${s.hot ? 'text-amber-400' : 'text-white/90'}`}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Centers the diagram and — critically — shrink-wraps to its actual
          rendered box (capped by MAX_IMAGE_HEIGHT for tall/portrait sources)
          so the hotspot dots below, positioned by percentage against this
          same box, land exactly where they were authored regardless of the
          image's natural aspect ratio. */}
      <div className={`flex justify-center ${outerWidthClass} mx-auto`}>
        <div ref={containerRef} className="relative select-none max-w-full">
          {/* Rounded-corner clipping lives on this inner wrapper only, so the
              hotspot dots and the popover below (siblings, not children, of
              this div) are free to sit slightly outside the image's own box
              near an edge without being clipped off. */}
          <div className="overflow-hidden rounded-xl border border-white/10">
            {imageEl}
          </div>

          {/* EXPLORE MODE — reveal hotspots */}
          {mode === 'explore' && block.hotspots.map((hotspot, idx) => (
            <button
              key={hotspot.id}
              className={`absolute flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
                border-2 transition-all duration-150 cursor-pointer z-10
                ${activeId === hotspot.id
                  ? 'bg-orange-500 border-orange-300 scale-110 text-black'
                  : 'bg-[#0B0F15]/80 border-orange-500 text-orange-400 hover:scale-110'
                }`}
              style={{
                left: `calc(${hotspot.x * 100}% - 14px)`,
                top: `calc(${hotspot.y * 100}% - 14px)`,
              }}
              onClick={() => setActiveId(activeId === hotspot.id ? null : hotspot.id)}
              aria-label={hotspot.label}
            >
              {hotspot.icon ? iconShape[hotspot.icon] : idx + 1}
            </button>
          ))}

          {/* EXPLORE MODE — popover next to the tapped dot */}
          {mode === 'explore' && activeHotspot && (
            <div
              ref={detailRef}
              className="absolute z-20 w-[min(85vw,280px)] p-3 rounded-xl border border-orange-500/40
                bg-[#151E32] shadow-xl shadow-black/40 scroll-mt-20"
              style={{
                left: anchorH !== 'right' ? `${activeHotspot.x * 100}%` : undefined,
                right: anchorH === 'right' ? `${(1 - activeHotspot.x) * 100}%` : undefined,
                top: anchorV === 'below' ? `calc(${activeHotspot.y * 100}% + 18px)` : undefined,
                bottom: anchorV === 'above' ? `calc(${(1 - activeHotspot.y) * 100}% + 18px)` : undefined,
                transform: anchorH === 'center' ? 'translateX(-50%)' : anchorH === 'left' ? 'translateX(-6px)' : 'translateX(6px)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-orange-400 mb-1">{activeHotspot.label}</p>
                <button
                  onClick={() => setActiveId(null)}
                  className="text-white/40 hover:text-white/80 text-xs shrink-0"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none max-h-[200px] overflow-y-auto">
                <ReactMarkdown>{activeHotspot.detail}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* QUIZ MODE — blank targets the student places labels onto */}
          {mode === 'quiz' && block.hotspots.map((hotspot, idx) => {
            const isPlaced = placed.includes(hotspot.id);
            const isWrong = wrongId === hotspot.id;
            return (
              <button
                key={hotspot.id}
                disabled={isPlaced}
                className={`absolute flex items-center justify-center text-[11px] font-bold border-2 z-10
                  transition-all duration-150 whitespace-nowrap
                  ${isPlaced
                    ? 'bg-emerald-600 border-emerald-400 text-white px-2 h-6 rounded-full cursor-default'
                    : isWrong
                      ? 'bg-[#0B0F15]/85 border-red-500 text-red-400 w-6 h-6 rounded-md'
                      : `bg-[#0B0F15]/85 w-6 h-6 rounded-md ${armedId ? 'border-orange-400/70 text-orange-300 hover:scale-110 cursor-pointer' : 'border-white/40 text-white/60'}`
                  }`}
                style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%`, transform: 'translate(-50%,-50%)' }}
                onClick={() => tapTarget(hotspot.id)}
                aria-label={isPlaced ? hotspot.label : `Spot ${idx + 1}`}
              >
                {isPlaced ? hotspot.label : idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* QUIZ MODE — label tray + result, below the image */}
      {mode === 'quiz' && (
        <div className={`${outerWidthClass} mx-auto mt-3`}>
          {!quizDone ? (
            <>
              <p className="text-center text-[13px] text-white/45 italic mb-2">
                {armedId
                  ? `Tap where the ${block.hotspots.find((h) => h.id === armedId)?.label.toLowerCase()} goes.`
                  : 'Tap a label, then tap its spot on the diagram.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {trayOrder
                  .filter((h) => !placed.includes(h.id))
                  .map((h) => (
                    <button
                      key={h.id}
                      onClick={() => setArmedId(h.id)}
                      className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-all
                        ${armedId === h.id
                          ? 'bg-orange-500 border-orange-400 text-black -translate-y-0.5'
                          : 'bg-white/5 border-white/15 text-white/85 hover:bg-white/10'
                        }`}
                    >
                      {h.label}
                    </button>
                  ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.06] p-4 text-center">
              <p className="text-[15px] font-bold text-emerald-300">
                {accuracy >= 80 ? 'Nailed it' : 'Round complete'}
              </p>
              <p className="text-[13px] text-white/60 mt-0.5">
                {accuracy}% accuracy · {elapsed.toFixed(1)}s · {total} labels
              </p>
              <div className="flex gap-2 justify-center mt-3">
                <button
                  onClick={startQuiz}
                  className="text-[13px] font-bold px-4 py-1.5 rounded-full bg-orange-500 text-black hover:brightness-110"
                >
                  Play again
                </button>
                <button
                  onClick={exitQuiz}
                  className="text-[13px] font-semibold px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
                >
                  Back to explore
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {block.caption && mode === 'explore' && (
        <figcaption className="mt-2 text-center text-sm text-white/50 italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
