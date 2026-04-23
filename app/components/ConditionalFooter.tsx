'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  const hideFooter =
    pathname?.startsWith('/physical-chemistry-hub') ||
    pathname?.startsWith('/class-9') ||
    pathname?.startsWith('/class-10') ||
    pathname?.startsWith('/class-11') ||
    pathname?.startsWith('/class-12');

  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
