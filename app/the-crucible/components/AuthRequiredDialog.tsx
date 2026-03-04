"use client";

import { LogIn, X } from 'lucide-react';
import Link from 'next/link';

export default function AuthRequiredDialog({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={onClose} className="fixed inset-0 z-[90] bg-black/[0.82] backdrop-blur-[14px] flex items-end justify-center">
      <div onClick={e => e.stopPropagation()} className="bg-[#12141f] border border-white/12 rounded-t-[20px] p-5 pb-9 max-w-[480px] w-full shadow-[0_-20px_60px_rgba(0,0,0,0.7)] animate-[authDialogUp_0.3s_cubic-bezier(0.32,0.72,0,1)]">
        
        {/* Handle */}
        <div className="w-9 h-1 rounded-full bg-white/15 mx-auto mb-[18px]" />

        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/[0.07] border-none text-white/60 cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-white/10">
          <X className="w-[18px] h-[18px]" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-purple-600/20 to-purple-900/20 border border-purple-600/30 flex items-center justify-center">
            <LogIn className="w-7 h-7 text-purple-400" />
          </div>
        </div>

        {/* Title and description */}
        <div className="text-center mb-6">
          <div className="text-xl font-extrabold text-white mb-2">Login Required</div>
          <div className="text-[13px] text-white/55 leading-relaxed max-w-[360px] mx-auto">
            The Crucible test feature is only available to logged-in users. Sign in to track your progress and access all features.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 p-3.5 rounded-[14px] border border-white/10 bg-transparent text-white/45 text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-white/5 hover:text-white/60">
            Cancel
          </button>
          <Link href="/login?next=/the-crucible" className="flex-[2] p-3.5 rounded-[14px] border-none bg-gradient-to-br from-purple-600 to-purple-800 text-white text-sm font-extrabold cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.45)] flex items-center justify-center gap-2 no-underline transition-all duration-200 hover:shadow-[0_6px_24px_rgba(124,58,237,0.55)]">
            <LogIn className="w-[18px] h-[18px]" />
            Login to Continue
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes authDialogUp { 
          from { transform: translateY(100%); } 
          to { transform: translateY(0); } 
        }
      `}</style>
    </div>
  );
}
