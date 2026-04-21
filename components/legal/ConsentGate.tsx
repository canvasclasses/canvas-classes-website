'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/app/utils/supabase/client';
import {
  PRIVACY_VERSION,
  TERMS_VERSION,
} from '@/lib/legal/versions';
import { ConsentRefreshModal } from './ConsentRefreshModal';

const PUBLIC_PATHS = [
  '/privacy',
  '/terms',
  '/login',
  '/api/auth/google-direct/callback',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

export function ConsentGate() {
  const pathname = usePathname() ?? '';
  const [needsConsent, setNeedsConsent] = useState(false);

  useEffect(() => {
    if (isPublicPath(pathname)) {
      setNeedsConsent(false);
      return;
    }

    let cancelled = false;

    (async () => {
      const supabase = createClient();
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        setNeedsConsent(false);
        return;
      }

      const meta = user.user_metadata ?? {};
      const stale =
        meta.privacy_version !== PRIVACY_VERSION ||
        meta.terms_version !== TERMS_VERSION;

      setNeedsConsent(stale);
    })();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!needsConsent) return null;
  return <ConsentRefreshModal onAccepted={() => setNeedsConsent(false)} />;
}
