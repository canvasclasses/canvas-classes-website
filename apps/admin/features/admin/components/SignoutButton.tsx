'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

export function SignoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignout = async () => {
    setPending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST', redirect: 'manual' });
      // `redirect: 'manual'` makes the fetch return type 'opaqueredirect' for
      // any 3xx response — treat that as success since the server intended to
      // bounce us to /login. Anything else non-2xx is a real failure that
      // means the session was NOT invalidated.
      if (!res.ok && res.type !== 'opaqueredirect') {
        throw new Error(`Sign-out failed (${res.status})`);
      }
      window.location.href = '/login';
    } catch (e) {
      setPending(false);
      setError(e instanceof Error ? e.message : 'Sign-out failed. Try again.');
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSignout}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="h-3.5 w-3.5" />
        )}
        Sign out
      </button>
      {error && (
        <span role="alert" className="text-[11px] text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}
