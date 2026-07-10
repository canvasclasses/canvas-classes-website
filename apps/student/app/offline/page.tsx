import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

// Pure Server Component — no 'use client'. When served from the SW cache with no
// network, the app's JS won't load, so the "Try again" control must work without
// JS: a plain <a> that navigates home (succeeds once the network is back).
export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050505] px-6 text-center">
      <div className="text-5xl" aria-hidden>📡</div>
      <h1 className="text-2xl font-bold text-white">You&apos;re offline</h1>
      <p className="max-w-sm text-sm text-zinc-400">
        Reconnect to the internet to keep studying. Your progress is safe.
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2.5 text-sm font-bold text-black transition-transform hover:scale-[1.03]"
      >
        Try again
      </a>
    </main>
  );
}
