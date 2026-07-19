'use client';

import { ContentBlock } from '@canvas/data/types/books';
import BlockRenderer from '../BlockRenderer';
import AudioNoteBlockRenderer from './AudioNoteBlockRenderer';
import VideoBlockRenderer from './VideoBlockRenderer';

/**
 * The desktop right-rail utility lane (§15.5). Hosts two groups pulled out of
 * the reading column:
 *   • Watch & Listen — every audio_note + video on the page, as a playlist, so a
 *     student who doesn't want to read can consume the page from here.
 *   • Exam Insight  — the exam_tip / remember callouts. Each exam_tip is now
 *     self-collapsing (its own header + expand toggle — see CalloutBlockRenderer),
 *     so it no longer needs a tab to hide it; it just sits stacked below Watch &
 *     Listen, kept visually separate from media rather than sharing a tab strip.
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

  return (
    <div className="flex flex-col gap-7">
      {hasMedia && (
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest mb-3 text-white/35 flex items-center gap-2">
            Watch &amp; Listen
            <span className="inline-flex items-center justify-center text-[9px] font-bold rounded-full px-1.5 min-w-[16px] h-[16px] bg-white/8 text-white/40">
              {mediaBlocks.length}
            </span>
          </h3>
          {/* Compact variants so audio + video cards share a consistent height in the rail. */}
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
