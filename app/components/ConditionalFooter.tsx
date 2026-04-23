'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export function ConditionalFooter() {
  const pathname = usePathname();
  
  // Hide footer on physical-chemistry-hub pages and inside the BITSAT plan day pages
  const hideFooter =
    pathname?.startsWith('/physical-chemistry-hub') ||
    pathname?.startsWith('/bitsat-chemistry-revision/plan');
  
  if (hideFooter) {
    return null;
  }
  
  return <Footer />;
}
