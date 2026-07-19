'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, RotateCcw } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Distraction-free YouTube player.
//
// WHY THIS EXISTS: study clips are third-party YouTube videos embedded (legally)
// via the iframe. The default embed lets a student click the title / logo and
// escape to youtube.com, and shows a "related videos" grid when the clip ends —
// both are rabbit-holes mid-study. We can't remove YouTube's chrome with URL
// params (modestbranding is deprecated), so instead we:
//   • hide YouTube's own controls (controls=0) — no logo, no control bar
//   • drive playback ourselves via the postMessage API (NOT the JS IFrame API —
//     that script is blocked by the app CSP; postMessage needs no extra script)
//   • lay a transparent click-catcher over the video so a click toggles OUR
//     play/pause instead of reaching YouTube's title bar / video chrome
//   • on ENDED, cover the frame with our own Replay panel so the related-videos
//     end screen is never seen
//
// Trade-off (accepted): hiding native chrome is in tension with YouTube's embed
// terms, and a determined student with devtools can still get the URL. This
// solves *casual* distraction, which is the goal.
//
// Applies ONLY to the youtube_nocookie provider; cloudflare_stream / r2_direct
// are self-hosted and already distraction-free.
// ─────────────────────────────────────────────────────────────────────────────

const YT_ORIGIN = 'https://www.youtube-nocookie.com';

// YouTube player states (onStateChange / infoDelivery.playerState)
const ENDED = 0;
const PLAYING = 1;
const PAUSED = 2;

function fmt(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function YouTubePlayer({
  videoId,
  title,
  origin,
}: {
  videoId: string;
  title?: string;
  origin: string;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      enablejsapi: '1',
      controls: '0',        // hide YouTube's control bar (removes the logo too)
      modestbranding: '1',
      rel: '0',
      iv_load_policy: '3',  // no annotations
      disablekb: '1',       // no YouTube keyboard shortcuts
      playsinline: '1',
      fs: '0',              // we provide our own fullscreen
      autoplay: '1',        // expansion is a user gesture, so this is allowed
      origin,
    });
    return `${YT_ORIGIN}/embed/${videoId}?${params.toString()}`;
  }, [videoId, origin]);

  // Send a command to the player over postMessage.
  const command = useCallback((func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      YT_ORIGIN,
    );
  }, []);

  // Start receiving state/time updates. YouTube pushes `infoDelivery` messages
  // (currentTime, duration, playerState) ~4×/sec once we register as listening.
  const startListening = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: videoId, channel: 'widget' }),
      YT_ORIGIN,
    );
  }, [videoId]);

  // Incoming messages from the YouTube frame.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.origin !== YT_ORIGIN) return;
      let data: { event?: string; info?: Record<string, unknown> };
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      if (!data || typeof data !== 'object') return;

      if (data.event === 'onReady' || data.event === 'initialDelivery') {
        startListening();
      }

      const info = data.info;
      if (info) {
        if (typeof info.currentTime === 'number' && !scrubbing) setCurrent(info.currentTime);
        if (typeof info.duration === 'number' && info.duration > 0) setDuration(info.duration);
        if (typeof info.muted === 'boolean') setMuted(info.muted);
        const state = typeof info.playerState === 'number' ? info.playerState : undefined;
        if (state === PLAYING) { setPlaying(true); setEnded(false); }
        else if (state === PAUSED) setPlaying(false);
        else if (state === ENDED) { setPlaying(false); setEnded(true); }
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [startListening, scrubbing]);

  // Kick off the listening handshake once the frame has loaded (retry a couple
  // times — the frame's message channel isn't always ready on the first load).
  const handleFrameLoad = useCallback(() => {
    startListening();
    const t1 = setTimeout(startListening, 300);
    const t2 = setTimeout(startListening, 1000);
    // best-effort cleanup if the component unmounts fast
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [startListening]);

  const togglePlay = useCallback(() => {
    if (ended) { command('seekTo', [0, true]); command('playVideo'); setEnded(false); return; }
    if (playing) command('pauseVideo');
    else command('playVideo');
  }, [ended, playing, command]);

  const toggleMute = useCallback(() => {
    if (muted) { command('unMute'); setMuted(false); }
    else { command('mute'); setMuted(true); }
  }, [muted, command]);

  const goFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    else el.requestFullscreen?.();
  }, []);

  const onSeek = useCallback((value: number) => {
    setCurrent(value);
    command('seekTo', [value, true]);
  }, [command]);

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black group/yt">
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={handleFrameLoad}
        className="absolute inset-0 w-full h-full pointer-events-none"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title ?? 'Video explanation'}
      />

      {/* Click-catcher — a click toggles OUR play/pause and never reaches the
          YouTube chrome (title bar / logo). Hidden while the end panel is up. */}
      {!ended && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
          className="absolute inset-0 z-10 w-full h-full cursor-pointer bg-transparent
            flex items-center justify-center"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Big center play icon when paused */}
          {!playing && (
            <span className="w-16 h-16 rounded-full bg-black/55 border border-white/20
              flex items-center justify-center backdrop-blur-sm">
              <Play size={28} fill="white" className="text-white ml-1" />
            </span>
          )}
        </button>
      )}

      {/* End panel — covers the related-videos grid entirely. */}
      {ended && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3
          bg-black/85 backdrop-blur-sm">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full
              bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm
              hover:scale-105 transition-transform"
          >
            <RotateCcw size={16} /> Replay
          </button>
          {title && <p className="text-white/50 text-xs px-6 text-center max-w-md">{title}</p>}
        </div>
      )}

      {/* Custom control bar */}
      {!ended && (
        <div
          className="absolute bottom-0 left-0 right-0 z-30 px-3 pb-2.5 pt-6
            bg-gradient-to-t from-black/80 via-black/40 to-transparent
            opacity-0 group-hover/yt:opacity-100 focus-within:opacity-100 transition-opacity
            data-[playing=false]:opacity-100"
          data-playing={playing}
        >
          {/* Progress bar */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={current}
            onChange={(e) => onSeek(parseFloat(e.target.value))}
            onPointerDown={() => setScrubbing(true)}
            onPointerUp={() => setScrubbing(false)}
            aria-label="Seek"
            className="w-full h-1 appearance-none rounded-full cursor-pointer accent-orange-500"
            style={{ background: `linear-gradient(to right, #fb923c ${pct}%, rgba(255,255,255,0.25) ${pct}%)` }}
          />
          <div className="flex items-center gap-3 mt-1.5">
            <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}
              className="text-white/90 hover:text-white transition-colors">
              {playing ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}
            </button>
            <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
              className="text-white/90 hover:text-white transition-colors">
              {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <span className="text-[11px] font-medium tabular-nums text-white/70">
              {fmt(current)} / {fmt(duration)}
            </span>
            <button type="button" onClick={goFullscreen} aria-label="Fullscreen"
              className="ml-auto text-white/90 hover:text-white transition-colors">
              <Maximize size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
