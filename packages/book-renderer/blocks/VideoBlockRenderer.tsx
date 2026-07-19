'use client';

import { useState } from 'react';
import { Play, ChevronDown, ChevronUp } from 'lucide-react';
import { VideoBlock } from '@canvas/data/types/books';
import YouTubePlayer from './_YouTubePlayer';

// YouTube requires the `origin` parameter in the embed URL to identify
// the embedding site, and rejects the embed ("This content is blocked")
// if it doesn't match the page's real origin. The env-var default only
// matches the student app's own domain — the admin editor runs on a
// different origin (localhost:3001 in dev, admin.canvasclasses.in in
// prod) and must pass its real origin via `originOverride` instead of
// relying on this fallback.
// Source: https://developers.google.com/youtube/player_parameters#origin
const DEFAULT_EMBED_ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.canvasclasses.in';

/**
 * YouTube blocks store just the 11-char video ID.
 * If someone managed to save a full URL (e.g. pasted before switching provider),
 * extract the ID here so the embed never gets a malformed src.
 */
function extractYouTubeId(src: string): string {
  if (!src) return '';
  // Already a bare 11-char ID — common case, fast path
  if (/^[a-zA-Z0-9_-]{11}$/.test(src)) return src;
  const m =
    src.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
    src.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
    src.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : src;
}

function formatDuration(sec: number): string {
  if (!sec) return '';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoBlockRenderer({
  block,
  compact = false,
  originOverride,
}: {
  block: VideoBlock;
  compact?: boolean;
  originOverride?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const embedOrigin = originOverride ?? DEFAULT_EMBED_ORIGIN;

  return (
    <div className={compact ? '' : 'my-4'}>

      {/* Collapsed trigger */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
          border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500
          flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Play size={12} fill="black" className="text-black ml-0.5" />
        </div>
        <span className="flex-1 text-left text-[15px] font-medium text-white/65
          group-hover:text-white/85 transition-colors">
          {block.caption ?? 'Watch Video Explanation'}
        </span>
        {block.duration_sec > 0 && (
          <span className="text-[12px] text-white/30 tabular-nums shrink-0">
            {formatDuration(block.duration_sec)}
          </span>
        )}
        {expanded
          ? <ChevronUp size={15} className="text-white/25 shrink-0" />
          : <ChevronDown size={15} className="text-white/25 shrink-0" />}
      </button>

      {/* Expanded video */}
      {expanded && (
        <div className="mt-2 relative w-full overflow-hidden rounded-xl border border-white/10 bg-black aspect-video">
          {block.provider === 'r2_direct' && (
            <video
              src={block.src}
              poster={block.poster}
              controls
              autoPlay
              preload="metadata"
              className="w-full h-full object-contain"
              playsInline
            />
          )}
          {block.provider === 'cloudflare_stream' && (
            <iframe
              src={`https://customer-stream.cloudflarestream.com/${block.src}/iframe?autoplay=true`}
              className="w-full h-full"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          )}
          {block.provider === 'youtube_nocookie' && (
            // Distraction-free custom player: hides YouTube's chrome + end-screen
            // grid and intercepts clicks so students can't slip out to youtube.com
            // mid-study. See _YouTubePlayer.tsx for the postMessage-based control.
            <YouTubePlayer
              videoId={extractYouTubeId(block.src)}
              title={block.caption}
              origin={embedOrigin}
            />
          )}
        </div>
      )}
    </div>
  );
}
