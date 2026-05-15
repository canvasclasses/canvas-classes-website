// Streamed fallback while the SSR page fetches book + page + nav from MongoDB.
// Replaces the blank white flash the browser would otherwise show between
// navigation start and the RSC payload arriving.
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Top nav skeleton */}
      <header className="sticky top-0 z-40 bg-[#0B0F15]/95 backdrop-blur border-b border-white/8">
        <div className="max-w-[1060px] mx-auto px-4 h-12 flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
          <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
          <div className="flex-1 h-3 rounded bg-white/8 animate-pulse max-w-[240px]" />
          <div className="w-10 h-3 rounded bg-white/8 animate-pulse" />
          <div className="w-6 h-6 rounded-lg bg-white/8 animate-pulse" />
        </div>
        <div className="h-[2px] bg-white/8" />
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 min-h-0">
        <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-white/5 bg-[#0B0F15]/50 p-4 gap-2">
          <div className="h-2 w-20 rounded bg-orange-500/20 animate-pulse mb-1" />
          <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse mb-4" />
          <div className="h-[3px] w-full rounded bg-white/8 animate-pulse mb-4" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2 px-2.5 py-2">
              <div className="w-3 h-3 rounded-full bg-white/8 animate-pulse mt-0.5" />
              <div className="h-3 flex-1 rounded bg-white/8 animate-pulse" />
            </div>
          ))}
        </aside>

        <main className="flex-1 min-w-0">
          <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-8 space-y-6">
            <div className="h-8 w-3/4 rounded bg-white/10 animate-pulse" />
            <div className="h-4 w-1/2 rounded bg-white/8 animate-pulse" />
            <div className="h-48 w-full rounded-xl bg-white/5 animate-pulse mt-8" />
            <div className="space-y-3 mt-6">
              <div className="h-4 w-full rounded bg-white/8 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-white/8 animate-pulse" />
              <div className="h-4 w-4/5 rounded bg-white/8 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
