'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import {
  initMixpanel,
  identify,
  track,
  reset,
} from '@/lib/analytics/mixpanel';

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    initMixpanel();

    const supabase = createClient();
    if (!supabase) return;

    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        identify(data.user.id, {
          email_domain: data.user.email?.split('@')[1],
          signup_date: data.user.created_at,
        });
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        initMixpanel();
        identify(session.user.id, {
          email_domain: session.user.email?.split('@')[1],
        });
        const daysSinceSignup = session.user.created_at
          ? Math.floor(
              (Date.now() - new Date(session.user.created_at).getTime()) /
                86_400_000
            )
          : 0;
        track('user_logged_in', {
          method: session.user.app_metadata?.provider ?? 'email',
          days_since_signup: daysSinceSignup,
        });
      } else if (event === 'SIGNED_OUT') {
        track('user_logged_out');
        reset();
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
