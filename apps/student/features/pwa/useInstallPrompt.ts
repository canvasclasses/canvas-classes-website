'use client';

import { useCallback, useEffect, useState } from 'react';
import { track } from '@canvas/core/analytics/mixpanel';

// `beforeinstallprompt` isn't in the standard TS DOM lib.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface InstallPromptState {
  canPromptNatively: boolean;
  isIOS: boolean;
  isInstalled: boolean;
  isMobile: boolean;
  /** Offer install UI at all? mobile, not installed, and either native-capable or iOS. */
  shouldOffer: boolean;
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
}

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  // iPadOS 13+ reports as Mac; disambiguate via touch points.
  const iPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(ua);
  return (iOSDevice || iPadOS) && isSafari;
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const displayMode = window.matchMedia?.('(display-mode: standalone)').matches;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone;
  return Boolean(displayMode || iosStandalone);
}

export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsIOS(detectIOS());
    setIsInstalled(detectStandalone());
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // stop Chrome's mini-infobar; we drive our own UI
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferred(null);
      track('pwa_install_completed');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return 'unavailable' as const;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    track(outcome === 'accepted' ? 'pwa_install_accepted' : 'pwa_install_dismissed', {
      source: 'native_prompt',
    });
    setDeferred(null);
    return outcome;
  }, [deferred]);

  const canPromptNatively = deferred !== null;
  const shouldOffer = isMobile && !isInstalled && (canPromptNatively || isIOS);

  return { canPromptNatively, isIOS, isInstalled, isMobile, shouldOffer, promptInstall };
}
