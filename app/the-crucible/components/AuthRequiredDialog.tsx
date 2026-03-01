"use client";

import { LogIn, X } from 'lucide-react';
import Link from 'next/link';

export default function AuthRequiredDialog({ onClose }: { onClose: () => void }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#12141f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px 20px 0 0', padding: '20px 20px 36px', maxWidth: 480, width: '100%', boxShadow: '0 -20px 60px rgba(0,0,0,0.7)', animation: 'authDialogUp 0.3s cubic-bezier(.32,.72,0,1)' }}>
        
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.15)', margin: '0 auto 18px' }} />

        {/* Close button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
          <X style={{ width: 18, height: 18 }} />
        </button>

        {/* Icon */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(91,33,182,0.2))', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogIn style={{ width: 28, height: 28, color: '#a78bfa' }} />
          </div>
        </div>

        {/* Title and description */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Login Required</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, maxWidth: 360, margin: '0 auto' }}>
            The Crucible test feature is only available to logged-in users. Sign in to track your progress and access all features.
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            Cancel
          </button>
          <Link href="/login?next=/the-crucible" style={{ flex: 2, padding: '14px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(124,58,237,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', transition: 'all 0.2s' }}>
            <LogIn style={{ width: 18, height: 18 }} />
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
