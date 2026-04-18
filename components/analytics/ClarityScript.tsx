'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { hasConsent } from '@/lib/analytics/consent';

export function ClarityScript() {
  const id = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasConsent());
    const interval = setInterval(() => {
      const c = hasConsent();
      setConsented((prev) => (prev === c ? prev : c));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (!id || !consented) return null;

  return (
    <Script id="clarity-script" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${id}");
      `}
    </Script>
  );
}
