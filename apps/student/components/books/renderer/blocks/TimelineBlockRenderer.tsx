import { TimelineBlock } from '@/types/books';

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
          {block.events.map((event, idx) => (
            <div key={event.id} className="relative">
              {/* Dot */}
              <div className="absolute -left-[1.625rem] top-1 w-3 h-3 rounded-full
                bg-gradient-to-br from-orange-500 to-amber-400 shrink-0" />
              <div className="flex items-start gap-2">
                {event.icon && (
                  <span className="text-base shrink-0 mt-0.5">{event.icon}</span>
                )}
                <div>
                  <p className="text-sm font-semibold text-white/90">{event.label}</p>
                  {event.detail && (
                    <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{event.detail}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal
  return (
    <div className="my-4 overflow-x-auto">
      {block.title && (
        <p className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
          {block.title}
        </p>
      )}
      <div className="flex items-start gap-0 min-w-max">
        {block.events.map((event, idx) => (
          <div key={event.id} className="flex items-start">
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 shrink-0 mt-1" />
              {/* Connector line */}
              {idx < block.events.length - 1 && (
                <div className="w-px h-full bg-white/20 hidden" />
              )}
            </div>
            <div className="relative flex flex-col items-start">
              {/* Horizontal connector */}
              {idx < block.events.length - 1 && (
                <div className="absolute top-2 left-1.5 w-16 h-px bg-white/20" />
              )}
              <div className="ml-2 mr-20 max-w-[120px]">
                {event.icon && <span className="text-sm">{event.icon} </span>}
                <p className="text-xs font-semibold text-white/90">{event.label}</p>
                {event.detail && (
                  <p className="text-xs text-white/50 mt-0.5">{event.detail}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
