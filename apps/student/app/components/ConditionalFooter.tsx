'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  const hideFooter =
    pathname?.startsWith('/physical-chemistry-hub') ||
    // BITSAT 2026 plan hide-rule removed 2026-06 — route archived under
    // app/_bitsat-2026-archive. Restore when reviving for BITSAT 2027.
    pathname?.startsWith('/crucible/preview') ||
    pathname?.startsWith('/class-9') ||
    pathname?.startsWith('/class-10') ||
    pathname?.startsWith('/class-11') ||
    pathname?.startsWith('/class-12');

  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
