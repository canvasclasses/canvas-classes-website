"use client";

import { useState } from 'react';

export default function TestConfigModal({ maxQ, onStart, onClose }: { maxQ: number; onStart: (count: number) => void; onClose: () => void }) {
  const presets = [10, 20, 30, 50].filter(n => n <= maxQ);
  if (maxQ > 50) presets.push(maxQ);
  const [count, setCount] = useState(Math.min(20, maxQ));
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#12141f', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '28px 24px', maxWidth: 380, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 4 }}>Configure Test</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Choose the number of questions for your timed test</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Questions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {presets.map(n => (
            <button key={n} onClick={() => setCount(n)} style={{ padding: '10px 18px', borderRadius: 10, border: `1.5px solid ${count === n ? '#7c3aed' : 'rgba(255,255,255,0.12)'}`, background: count === n ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.04)', color: count === n ? '#a78bfa' : 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
              {n}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          Time: <strong style={{ color: '#fff' }}>{Math.ceil(count * 1.5)} min</strong> ({count} Qs × 1.5 min each)
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
          <button onClick={() => onStart(count)} style={{ flex: 2, padding: '13px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#7c3aed,#5b21b6)', color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}>Start Test →</button>
        </div>
      </div>
    </div>
  );
}
