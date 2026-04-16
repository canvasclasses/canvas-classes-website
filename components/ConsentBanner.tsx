'use client';

import { useEffect, useState } from 'react';
import { setConsent } from '@/lib/analytics/consent';

const COOKIE_NAME = 'cookie_consent';

function hasCookieSet(): boolean {
  if (typeof document === 'undefined') return true;
  return document.cookie
    .split('; ')
    .some((c) => c.startsWith(`${COOKIE_NAME}=`));
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasCookieSet());
  }, []);

  if (!visible) return null;

  const choose = (value: 'granted' | 'denied') => {
    setConsent(value);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-xl rounded-xl border border-white/10 bg-[#151E32] p-4 text-sm text-white/90 shadow-2xl md:left-auto md:right-4"
    >
      <p className="mb-3">
        We use cookies and privacy-preserving analytics to improve Crucible.
        See our{' '}
        <a href="/privacy" className="underline text-orange-400">
          privacy policy
        </a>
        .
      </p>
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => choose('denied')}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 hover:bg-white/10"
        >
          Decline
        </button>
        <button
          onClick={() => choose('granted')}
          className="rounded-md bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 font-bold text-black"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
