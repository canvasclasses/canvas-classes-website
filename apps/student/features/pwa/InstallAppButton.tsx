'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { track } from '@canvas/core/analytics/mixpanel';
import { useInstallPrompt } from './useInstallPrompt';
import { IOSInstallSheet } from './IOSInstallSheet';

export function InstallAppButton({ onAction }: { onAction?: () => void }) {
  const { shouldOffer, isIOS, canPromptNatively, promptInstall } = useInstallPrompt();
  const [iosOpen, setIosOpen] = useState(false);

  if (!shouldOffer) return null;

  const handle = async () => {
    track('pwa_install_prompt_shown', { surface: 'menu', platform: isIOS ? 'ios' : 'android' });
    if (canPromptNatively) {
      await promptInstall();
    } else if (isIOS) {
      setIosOpen(true);
    }
    onAction?.();
  };

  return (
    <>
      <button
        onClick={handle}
        className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <Download size={16} className="text-orange-400" />
        Install app
      </button>
      <IOSInstallSheet open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  );
}
