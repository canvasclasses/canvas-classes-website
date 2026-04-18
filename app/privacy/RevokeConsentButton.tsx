'use client';

import { useState } from 'react';
import { clearConsent } from '@/lib/analytics/consent';
import { createClient } from '@/app/utils/supabase/client';

export function RevokeConsentButton() {
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle');

  async function onClick() {
    setState('working');
    clearConsent();
    try {
      const supabase = createClient();
      if (supabase) {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          await supabase.auth.updateUser({
            data: {
              consent: 'denied',
              consent_decided_at: new Date().toISOString(),
            },
          });
        }
      }
    } catch {
      // non-fatal — cookie is already cleared
    }
    setState('done');
  }

  return (
    <button
      onClick={onClick}
      disabled={state === 'working'}
      className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 disabled:opacity-50"
    >
      {state === 'idle' && 'Revoke consent'}
      {state === 'working' && 'Revoking...'}
      {state === 'done' && 'Consent revoked. Reload to see banner.'}
    </button>
  );
}
