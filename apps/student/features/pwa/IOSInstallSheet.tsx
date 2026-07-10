'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Plus } from 'lucide-react';

export function IOSInstallSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[60] bg-[#050505]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[61] rounded-t-3xl border-t border-white/10 bg-[#0B0F15] p-6 pb-8"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-bold text-white">Install Canvas Classes</h2>
              <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-zinc-300">
              <li className="flex items-center gap-3">
                <Share size={18} className="shrink-0 text-orange-400" />
                <span>
                  Tap the <strong className="text-white">Share</strong> button in Safari&apos;s toolbar.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Plus size={18} className="shrink-0 text-orange-400" />
                <span>
                  Choose <strong className="text-white">Add to Home Screen</strong>.
                </span>
              </li>
            </ol>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
