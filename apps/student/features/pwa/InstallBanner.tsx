'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import { track } from '@canvas/core/analytics/mixpanel';
import { useInstallPrompt } from './useInstallPrompt';
import { IOSInstallSheet } from './IOSInstallSheet';

const DISMISS_KEY = 'cc_pwa_install_dismissed';
const DISMISS_DAYS = 30;
const SHOW_DELAY_MS = 10_000;

function dismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    return Number.isFinite(ts) && Date.now() - ts < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

export function InstallBanner() {
  const { shouldOffer, isIOS, canPromptNatively, promptInstall } = useInstallPrompt();
  const [visible, setVisible] = useState(false);
  const [iosOpen, setIosOpen] = useState(false);

  useEffect(() => {
    if (!shouldOffer || dismissedRecently()) return;
    const t = setTimeout(() => {
      setVisible(true);
      track('pwa_install_prompt_shown', { surface: 'banner', platform: isIOS ? 'ios' : 'android' });
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, [shouldOffer, isIOS]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* private mode — fine, banner just reappears next session */
    }
    track('pwa_install_dismissed', { surface: 'banner' });
  };

  const onInstall = async () => {
    if (canPromptNatively) {
      const outcome = await promptInstall();
      if (outcome !== 'unavailable') setVisible(false);
    } else if (isIOS) {
      setIosOpen(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-4 left-1/2 z-[55] w-[94%] max-w-md -translate-x-1/2 md:hidden"
          >
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0B0F15]/95 p-3 pl-4 shadow-2xl shadow-black/50 backdrop-blur-xl">
              <Download size={20} className="shrink-0 text-orange-400" />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-white">Install Canvas Classes</div>
                <div className="truncate text-xs text-zinc-400">Add to your home screen for quick access.</div>
              </div>
              <button
                onClick={onInstall}
                className="shrink-0 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 text-xs font-bold text-black"
              >
                Install
              </button>
              <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-zinc-500 hover:text-white">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <IOSInstallSheet open={iosOpen} onClose={() => setIosOpen(false)} />
    </>
  );
}
