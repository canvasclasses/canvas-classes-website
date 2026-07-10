import { Fragment } from 'react';
import {
  Ship, TrendingDown, TrendingUp, Hammer, Triangle, Circle, Square,
  Mountain, Waves, Droplet, Landmark, type LucideIcon,
} from 'lucide-react';
import { TimelineBlock } from '@canvas/data/types/books';
import InlineMarkdown from './InlineMarkdown';

// Maps the block's `icon` string (kebab-case) to a real Lucide icon component.
// Previously this field was rendered as raw text ("ship", "trending-down", ...)
// instead of an actual glyph — fixed 2026-07-08 on founder report (screenshot).
// 'arch' has no direct Lucide equivalent — mapped to Landmark as the closest fit.
const ICON_MAP: Record<string, LucideIcon> = {
  ship: Ship,
  'trending-down': TrendingDown,
  'trending-up': TrendingUp,
  hammer: Hammer,
  triangle: Triangle,
  circle: Circle,
  square: Square,
  mountain: Mountain,
  waves: Waves,
  droplet: Droplet,
  arch: Landmark,
};

function TimelineIcon({ name, className }: { name?: string; className?: string }) {
  if (!name) return null;
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon className={className} strokeWidth={2} />;
}

export default function TimelineBlockRenderer({ block }: { block: TimelineBlock }) {
  const isVertical = block.orientation === 'vertical';

  if (isVertical) {
    return (
      <div className="my-4">
        {block.title && (
          <p className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
            {block.title}
          </p>
        )}
        <div className="relative pl-6 border-l border-white/20 flex flex-col gap-5">
          {(block.events ?? []).map((event, idx) => (
            <div key={event.id} className="relative">
              {/* Dot */}
              <div className="absolute -left-[1.625rem] top-1 w-3 h-3 rounded-full
                bg-gradient-to-br from-orange-500 to-amber-400 shrink-0" />
              <div className="flex items-start gap-2">
                {event.icon && (
                  <TimelineIcon name={event.icon} className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white/90"><InlineMarkdown>{event.label}</InlineMarkdown></p>
                  {event.detail && (
                    <p className="text-xs text-white/55 mt-0.5 leading-relaxed"><InlineMarkdown>{event.detail}</InlineMarkdown></p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal — a row of steps (dot + content, fixed width) separated by
  // flex-growing connector lines, so the line always spans the actual gap
  // between two dots. Previously the connector was a fixed 64px stub anchored
  // to each dot — it never reached the next dot on real content, so a
  // 3+ step journey rendered as disconnected clusters instead of one flowing
  // timeline (founder report, screenshot 2026-07-08).
  const events = block.events ?? [];
  return (
    <div className="my-4 overflow-x-auto">
      {block.title && (
        <p className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
          {block.title}
        </p>
      )}
      <div className="flex items-start">
        {events.map((event, idx) => (
          <Fragment key={event.id}>
            <div className="flex flex-col items-center shrink-0 text-center">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 shrink-0" />
              <div className="mt-2 max-w-[140px]">
                {event.icon && (
                  <TimelineIcon name={event.icon} className="w-3.5 h-3.5 mb-1 mx-auto text-amber-400" />
                )}
                <p className="text-xs font-semibold text-white/90"><InlineMarkdown>{event.label}</InlineMarkdown></p>
                {event.detail && (
                  <p className="text-xs text-white/50 mt-0.5"><InlineMarkdown>{event.detail}</InlineMarkdown></p>
                )}
              </div>
            </div>
            {idx < events.length - 1 && (
              <div className="flex-1 h-px bg-white/20 mt-1.5 mx-2 min-w-[24px]" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
