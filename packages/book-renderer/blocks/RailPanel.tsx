'use client';

import { Play, SlidersHorizontal } from 'lucide-react';
import { ContentBlock } from '@canvas/data/types/books';
import BlockRenderer from '../BlockRenderer';

/**
 * The desktop right-rail utility lane (§15.5). Hosts, top to bottom:
 *   • On This Page — a MAP of the page: subtopic headings with the landmark
 *     sections nested under them (worked examples, Think It Through prompts,
 *     Real-World Application cards, AND every video / audio note), all in
 *     reading order, as click-to-scroll links. Media scrolls to its INLINE
 *     player rather than playing in the rail, so the nav mirrors the true
 *     structure of the page.
 *   • Exam Insight — the exam_tip / remember callouts (self-collapsing).
 */
interface NavItem {
  id: string;
  label: string;
  kind: 'heading' | 'example' | 'think' | 'connect' | 'video' | 'audio' | 'sim';
}

// Colour dots for the section sub-item kinds — match the book colour system
// (Learn=amber, Think=violet, Connect=teal). Headings have no marker; media
// kinds use an icon instead of a dot (see below).
const KIND_DOT: Record<string, string> = {
  example: '#dba846',
  think: '#a99bcf',
  connect: '#7fd4c9',
};
// Interactive markers mirror their inline blocks: video = warm orange→amber
// gradient (with a breathing pulse, matching the inline Video Lecture card);
// audio = sky→cyan gradient (matching the inline audio player); simulation =
// violet→indigo with a sliders glyph, matching the sim canvases' own indigo
// accent. An icon (not a dot) marks anything the student can interact with.
const VIDEO_GRADIENT = 'linear-gradient(135deg,#f97316,#f59e0b)';
const AUDIO_GRADIENT = 'linear-gradient(135deg,#0ea5e9,#22d3ee)';
const SIM_GRADIENT = 'linear-gradient(135deg,#8b5cf6,#6366f1)';

function scrollToBlock(id: string) {
  document.getElementById(`block-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function RailPanel({
  navItems = [],
  examBlocks,
  onQuizPass,
}: {
  navItems?: NavItem[];
  examBlocks: ContentBlock[];
  onQuizPass?: (blockId: string, score: number) => void;
}) {
  const hasExam = examBlocks.length > 0;
  const hasNav = navItems.length > 0;

  return (
    <div className="flex flex-col gap-7">
      {hasNav && (
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/35">
            On This Page
          </h3>
          <nav className="flex flex-col border-l border-white/8">
            {navItems.map((item) => {
              const isHeading = item.kind === 'heading';
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToBlock(item.id)}
                  className={`group text-left leading-snug -ml-px border-l border-transparent transition-colors
                    ${isHeading
                      ? 'text-[14px] py-2 pl-3 text-white/70 hover:text-white hover:border-white/40'
                      : 'text-[13px] py-1.5 pl-6 flex items-start gap-2 text-white/45 hover:text-white/85'}`}
                >
                  {item.kind === 'video' ? (
                    /* Same gradient play-circle + breathing pulse as the inline
                       Video Lecture card, shrunk for the nav. */
                    <span className="relative shrink-0 flex items-center justify-center mt-[1px]" style={{ width: 18, height: 18 }}>
                      <span className="nav-vid-pulse absolute inset-0 rounded-full" style={{ background: 'rgba(249,115,22,0.4)' }} aria-hidden />
                      <span className="relative rounded-full flex items-center justify-center" style={{ width: 18, height: 18, background: VIDEO_GRADIENT }}>
                        <Play size={9} fill="black" className="text-black" style={{ marginLeft: 1 }} />
                      </span>
                    </span>
                  ) : item.kind === 'audio' ? (
                    /* Mirrors the inline audio player's sky→cyan gradient play
                       button (no pulse — the inline audio uses a waveform, not a
                       pulse ring, so the nav marker stays calm). */
                    <span className="shrink-0 flex items-center justify-center rounded-full mt-[1px]" style={{ width: 18, height: 18, background: AUDIO_GRADIENT }}>
                      <Play size={9} fill="black" className="text-black" style={{ marginLeft: 1 }} />
                    </span>
                  ) : item.kind === 'sim' ? (
                    /* Simulations are a headline feature of these pages — they get
                       a rounded-square sliders glyph so they read as "something you
                       drive", distinct from the round play buttons of video/audio. */
                    <span className="shrink-0 flex items-center justify-center mt-[1px]" style={{ width: 18, height: 18, borderRadius: 5, background: SIM_GRADIENT }}>
                      <SlidersHorizontal size={10} className="text-black" strokeWidth={2.75} />
                    </span>
                  ) : !isHeading ? (
                    <span className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0" style={{ background: KIND_DOT[item.kind] }} />
                  ) : null}
                  <span className={isHeading ? '' : 'min-w-0'}>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <style>{`
            .nav-vid-pulse { animation: navVidPulse 2.6s ease-out infinite; }
            @keyframes navVidPulse { 0% { transform: scale(1); opacity: 0.5; } 70%,100% { transform: scale(1.7); opacity: 0; } }
            @media (prefers-reduced-motion: reduce) { .nav-vid-pulse { animation: none; opacity: 0; } }
          `}</style>
        </div>
      )}

      {hasExam && (
        <div className="flex flex-col gap-6">
          {examBlocks.map((b) => (
            <div key={b.id}>
              <BlockRenderer block={b} onQuizPass={onQuizPass} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
