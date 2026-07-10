'use client';

import { useState } from 'react';
import { ContentBlock } from '@canvas/data/types/books';
import BlockRenderer from '../BlockRenderer';
import AudioNoteBlockRenderer from './AudioNoteBlockRenderer';
import VideoBlockRenderer from './VideoBlockRenderer';

/**
 * The desktop right-rail utility lane (§15.5). Hosts two groups pulled out of
 * the reading column:
 *   • Exam Insight  — the exam_tip / remember callouts.
 *   • Watch & Listen — every audio_note + video on the page, as a playlist, so a
 *     student who doesn't want to read can consume the page from here.
 * When both groups exist they share the rail as tabs; with only one, that group
 * renders directly (Exam Insight keeps its exact prior look — no extra chrome).
 */
export default function RailPanel({
  examBlocks,
  mediaBlocks,
  onQuizPass,
  videoOriginOverride,
}: {
  examBlocks: ContentBlock[];
  mediaBlocks: ContentBlock[];
  onQuizPass?: (blockId: string, score: number) => void;
  videoOriginOverride?: string;
}) {
  const hasExam = examBlocks.length > 0;
  const hasMedia = mediaBlocks.length > 0;
  const showTabs = hasExam && hasMedia;
  // Watch & Listen is the primary (left) tab and the default.
  const [tab, setTab] = useState<'exam' | 'media'>(hasMedia ? 'media' : 'exam');

  const ExamContent = (
    <div className="flex flex-col gap-6">
      {examBlocks.map((b) => (
        <div key={b.id}>
          <BlockRenderer block={b} onQuizPass={onQuizPass} />
        </div>
      ))}
    </div>
  );

  // Compact variants so audio + video cards share a consistent height in the rail.
  const MediaContent = (
    <div className="flex flex-col gap-3">
      {mediaBlocks.map((b) => (
        <div key={b.id}>
          {b.type === 'audio_note' ? (
            <AudioNoteBlockRenderer block={b} compact />
          ) : b.type === 'video' ? (
            <VideoBlockRenderer block={b} compact originOverride={videoOriginOverride} />
          ) : (
            <BlockRenderer block={b} />
          )}
        </div>
      ))}
    </div>
  );

  // Only one group → render it directly (no tabs).
  if (!showTabs) {
    if (hasExam) return ExamContent;
    return (
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/35">
          Watch &amp; Listen
        </h3>
        {MediaContent}
      </div>
    );
  }

  // Both groups → tabbed.
  return (
    <div>
      <div className="flex gap-1 mb-4 border-b border-white/8">
        <RailTab
          label="Watch &amp; Listen"
          count={mediaBlocks.length}
          active={tab === 'media'}
          onClick={() => setTab('media')}
        />
        <RailTab label="Exam Insight" active={tab === 'exam'} onClick={() => setTab('exam')} />
      </div>
      {tab === 'exam' ? ExamContent : MediaContent}
    </div>
  );
}

function RailTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2.5 pb-2 -mb-px text-[11px] font-black uppercase tracking-wider transition-colors flex items-center gap-1.5"
      style={{
        color: active ? '#fbbf24' : 'rgba(255,255,255,0.35)',
        borderBottom: `2px solid ${active ? '#fbbf24' : 'transparent'}`,
      }}
    >
      <span dangerouslySetInnerHTML={{ __html: label }} />
      {count != null && (
        <span
          className="inline-flex items-center justify-center text-[9px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px]"
          style={{
            background: active ? 'rgba(251,191,36,0.18)' : 'rgba(255,255,255,0.08)',
            color: active ? '#fbbf24' : 'rgba(255,255,255,0.4)',
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
