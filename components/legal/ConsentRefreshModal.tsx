'use client';

import { useState, useTransition } from 'react';
import { acceptConsent } from './acceptConsent';

export function ConsentRefreshModal() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAgree = () => {
    setError(null);
    startTransition(async () => {
      const result = await acceptConsent();
      if (!result.ok) {
        setError(result.error);
      }
      // On success, the page revalidates and the gate re-renders without the modal.
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0B0F15] p-6 shadow-2xl">
        <h2
          id="consent-modal-title"
          className="text-lg font-semibold text-white mb-2"
        >
          Updated Privacy Policy and Terms
        </h2>
        <p className="text-sm text-white/75 leading-relaxed mb-4">
          We&rsquo;ve updated how we describe the data we collect and how the
          Platform is used. Please review the updated documents and confirm to
          continue using Crucible.
        </p>
        <div className="flex flex-col gap-1 text-sm mb-5">
          <a
            href="/privacy"
            target="_blank"
            rel="noopener"
            className="text-orange-400 underline"
          >
            Read Privacy Policy
          </a>
          <a
            href="/terms"
            target="_blank"
            rel="noopener"
            className="text-orange-400 underline"
          >
            Read Terms &amp; Conditions
          </a>
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-3" role="alert">
            {error}
          </p>
        )}

        <button
          onClick={handleAgree}
          disabled={isPending}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 font-bold text-black disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'I Agree'}
        </button>
      </div>
    </div>
  );
}
