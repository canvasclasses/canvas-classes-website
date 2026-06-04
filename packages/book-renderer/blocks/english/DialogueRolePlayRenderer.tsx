'use client';

import { useState } from 'react';
import { DialogueRolePlayBlock, DialogueLine } from '@canvas/data/types/books';

const SPEAKER_COLORS: Record<string, { fg: string; bg: string; border: string }> = {
  warm_amber:  { fg: '#fbbf24', bg: 'rgba(251,191,36,0.08)',  border: 'rgba(251,191,36,0.3)' },
  deep_clay:   { fg: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.3)' },
  emerald:     { fg: '#34d399', bg: 'rgba(52,211,153,0.08)',  border: 'rgba(52,211,153,0.3)' },
  rust:        { fg: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.3)' },
  sky:         { fg: '#7dd3fc', bg: 'rgba(125,211,252,0.08)', border: 'rgba(125,211,252,0.3)' },
  violet:      { fg: '#c4b5fd', bg: 'rgba(196,181,253,0.08)', border: 'rgba(196,181,253,0.3)' },
};

function pickColor(name?: string) {
  if (!name) return SPEAKER_COLORS.sky;
  return SPEAKER_COLORS[name] || SPEAKER_COLORS.sky;
}

function LineRow({ line, characterName, color, isYou, onPlay }: {
  line: DialogueLine;
  characterName: string;
  color: { fg: string; bg: string; border: string };
  isYou: boolean;
  onPlay: () => void;
}) {
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: color.bg,
        border: `1px solid ${color.border}`,
        opacity: isYou ? 1 : 0.85,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: color.fg }}>
          {characterName}
        </span>
        {isYou && (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}
          >
            you
          </span>
        )}
        {!isYou && (line.audio_url || typeof window !== 'undefined') && (
          <button
            onClick={onPlay}
            className="text-[10px] inline-flex items-center justify-center rounded-full"
            style={{ width: 18, height: 18, background: color.bg, color: color.fg }}
          >
            ▶
          </button>
        )}
      </div>
      {line.stage_direction && (
        <div className="text-[12px] italic mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {line.stage_direction}
        </div>
      )}
      <div className="text-[14px] leading-relaxed font-serif" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {line.text}
      </div>
    </div>
  );
}

export default function DialogueRolePlayRenderer({ block }: { block: DialogueRolePlayBlock }) {
  const [yourCharacter, setYourCharacter] = useState<string>(block.characters[0]?.id || '');

  function play(line: DialogueLine) {
    if (line.audio_url) {
      new Audio(line.audio_url).play().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(line.text);
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    }
  }

  if (block.mode === 'debate' && block.debate_frames) {
    const forChar = block.characters.find((c) => c.id === 'for') || block.characters[0];
    const againstChar = block.characters.find((c) => c.id === 'against') || block.characters[1];
    // Fixed semantic accents for the two sides — green for the first column,
    // rose for the second — kept consistent across every debate-frames block.
    const FOR_ACCENT = '#34d399';
    const AGAINST_ACCENT = '#fb7185';

    const Column = ({ label, accent, frames }: { label: string; accent: string; frames: string[] }) => (
      <div>
        <div className="flex items-center gap-2.5 mb-7">
          <span
            aria-hidden
            style={{ width: 8, height: 8, borderRadius: '50%', background: accent, flexShrink: 0 }}
          />
          <span
            className="text-[13px] font-bold uppercase"
            style={{ color: accent, letterSpacing: '0.18em' }}
          >
            {label}
          </span>
        </div>
        <div className="flex flex-col gap-5">
          {frames.map((f, i) => (
            <div key={i} className="flex gap-4 items-baseline">
              <span
                className="tabular-nums shrink-0 text-[12px]"
                style={{ color: 'rgba(255,255,255,0.28)', minWidth: 20 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.84)' }}>
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="my-10">
        <div className="flex items-center gap-2 mb-4">
          <span style={{ color: '#c4b5fd' }} aria-hidden>⚖</span>
          <span
            className="text-[11px] font-bold uppercase"
            style={{ color: 'rgba(196,181,253,0.8)', letterSpacing: '0.18em' }}
          >
            Debate Frames
          </span>
        </div>
        {block.scene_description && (
          <div
            className="text-[14px] leading-relaxed mb-9 italic"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {block.scene_description}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10">
          <div className="md:pr-12">
            <Column label={forChar?.name || 'For'} accent={FOR_ACCENT} frames={block.debate_frames.for} />
          </div>
          <div className="md:pl-12 md:border-l" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Column label={againstChar?.name || 'Against'} accent={AGAINST_ACCENT} frames={block.debate_frames.against} />
          </div>
        </div>
      </div>
    );
  }

  // Dialogue mode
  return (
    <div className="my-8 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.02] px-5 py-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-cyan-300 font-bold">⌖</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300/70">
          Role Play
        </span>
      </div>
      {block.scene_description && (
        <div
          className="text-[14px] leading-relaxed mb-4 italic"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {block.scene_description}
        </div>
      )}
      <div className="flex items-center gap-2 mb-4 text-[12px]">
        <span style={{ color: 'rgba(255,255,255,0.45)' }}>You play:</span>
        {block.characters.map((c) => {
          const color = pickColor(c.color);
          const active = yourCharacter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setYourCharacter(c.id)}
              className="px-3 py-1 rounded-full text-[12px] font-semibold transition-all"
              style={{
                background: active ? color.bg : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${active ? color.border : 'rgba(255,255,255,0.08)'}`,
                color: active ? color.fg : 'rgba(255,255,255,0.5)',
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>
      <div className="space-y-3">
        {block.lines.map((line) => {
          const speaker = block.characters.find((c) => c.id === line.character_id);
          return (
            <LineRow
              key={line.id}
              line={line}
              characterName={speaker?.name || '?'}
              color={pickColor(speaker?.color)}
              isYou={line.character_id === yourCharacter}
              onPlay={() => play(line)}
            />
          );
        })}
      </div>
    </div>
  );
}
