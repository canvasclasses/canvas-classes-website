'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, ShieldCheck } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { sanitizeRedirect } from '@canvas/core/redirect-validation';

function LoginContent() {
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/';
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string).trim();
    const password = formData.get('password') as string;

    try {
      const supabase = createClient();
      if (!supabase) {
        setError('Authentication service not configured.');
        setIsLoading(false);
        return;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(
          authError.message.includes('Invalid login credentials')
            ? 'Invalid email or password.'
            : authError.message,
        );
        setIsLoading(false);
        return;
      }

      // Only redirect to relative paths inside this app. sanitizeRedirect
      // parses via `new URL(...)` so it normalizes backslashes the same way
      // browsers do — blocks `/\evil.com` which would otherwise navigate
      // off-origin after the browser rewrites it to `//evil.com`.
      window.location.href = sanitizeRedirect(nextPath, '/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            Operator Console
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-white/50 mt-1">
            Admin access — pre-provisioned accounts only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            placeholder="Email"
            className="w-full bg-transparent border-b border-white/15 py-3 px-1 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-400 transition-colors text-sm"
          />
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full bg-transparent border-b border-white/15 py-3 px-1 text-white placeholder:text-white/40 focus:outline-none focus:border-orange-400 transition-colors text-sm"
          />

          {error && (
            <div className="p-3 rounded-lg text-sm text-red-300 bg-red-500/5 border border-red-500/20">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mx-auto" />
            ) : (
              'Continue'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-white/30">
          Not an operator? You are on the wrong site.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505]" />}>
      <LoginContent />
    </Suspense>
  );
}
