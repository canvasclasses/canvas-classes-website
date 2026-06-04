'use client';

// PasswordForgeSim.tsx
// Class 9 ICT — Chapter 6 (Getting Connected) / Chapter 7 (Cyber Safety).
// Type a password and watch a live strength + estimated crack-time meter, with
// feedback on what makes it stronger, and a passphrase-vs-password comparison.
// Builds real security literacy. Estimates are rough/illustrative (marked).

import { useState, useMemo } from 'react';

const ACCENT = '#818cf8';
const COMMON = new Set(['password', '12345678', '123456', 'qwerty', 'iloveyou', 'admin', '111111', 'abc123']);

// NEEDS_REVIEW: crack-time is a simplified teaching estimate, assuming a fast
// offline attacker at ~1e10 guesses/sec against a brute-force charset search.
function analyse(pw: string) {
  const checks = {
    length: pw.length >= 8,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^a-zA-Z0-9]/.test(pw),
  };
  let charset = 0;
  if (checks.lower) charset += 26;
  if (checks.upper) charset += 26;
  if (checks.digit) charset += 10;
  if (checks.symbol) charset += 32;
  const common = COMMON.has(pw.toLowerCase());
  const allSame = pw.length > 0 && /^(.)\1*$/.test(pw);
  const entropy = pw.length > 0 && charset > 0 ? pw.length * Math.log2(charset) : 0;
  const effEntropy = common || allSame ? Math.min(entropy, 8) : entropy;
  const guesses = Math.pow(2, effEntropy) / 2;
  const seconds = guesses / 1e10;
  // score 0..4
  let score = 0;
  if (effEntropy >= 28) score = 1;
  if (effEntropy >= 40) score = 2;
  if (effEntropy >= 60) score = 3;
  if (effEntropy >= 80) score = 4;
  if (pw.length === 0) score = 0;
  return { checks, charset, entropy: effEntropy, seconds, score, common, allSame };
}

function prettyTime(s: number): string {
  if (s < 1) return 'less than a second';
  const units: [number, string][] = [[60, 'second'], [60, 'minute'], [24, 'hour'], [365, 'day'], [100, 'year'], [Infinity, 'century']];
  let v = s, label = 'second';
  for (const [div, name] of units) {
    label = name;
    if (v < div) break;
    v = v / div;
  }
  if (label === 'century' && v > 1000) return 'millions of years';
  return `about ${v < 10 ? v.toFixed(1) : Math.round(v)} ${label}${v >= 2 ? 's' : ''}`;
}

const LABELS = ['—', 'Very weak', 'Weak', 'Strong', 'Very strong'];
const COLORS = ['#475569', '#f87171', '#fbbf24', '#34d399', '#10b981'];
const SAMPLES = ['123456', 'rahul2010', 'P@ssw0rd', 'Tiger#Jump7', 'correct horse battery staple'];

export default function PasswordForgeSim() {
  const [pw, setPw] = useState('');
  const a = useMemo(() => analyse(pw), [pw]);

  const CheckRow = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className="text-sm flex gap-2" style={{ color: ok ? '#34d399' : '#64748b' }}>
      <span>{ok ? '✓' : '○'}</span>{label}
    </li>
  );

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3">
        <h1 className="text-3xl font-black tracking-tight text-white">Password <span style={{ color: ACCENT }}>Forge</span></h1>
        <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Build a Strong Password · Class 9 ICT</p>
      </div>

      <input value={pw} onChange={e => setPw(e.target.value)} placeholder="Type a password to test…"
        className="w-full px-4 py-3 rounded-xl text-lg font-bold tabular-nums mb-3"
        style={{ background: '#0B0F15', border: '1px solid rgba(129,140,248,0.4)', color: '#e2e8f0', outline: 'none' }} />

      {/* strength bar */}
      <div className="flex gap-1.5 mb-2">
        {[1, 2, 3, 4].map(n => (
          <div key={n} className="flex-1 h-2 rounded-full transition-all" style={{ background: a.score >= n ? COLORS[a.score] : 'rgba(255,255,255,0.06)' }} />
        ))}
      </div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <span className="text-sm font-black" style={{ color: COLORS[a.score] }}>{LABELS[a.score]}</span>
        {pw.length > 0 && (
          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>
            A fast attacker would need <span style={{ color: COLORS[a.score] }}>{prettyTime(a.seconds)}</span> to guess it
          </span>
        )}
      </div>

      {(a.common || a.allSame) && pw.length > 0 && (
        <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.3)' }}>
          <p className="text-sm font-bold" style={{ color: '#f87171' }}>⚠ {a.common ? 'This is one of the most common passwords — cracked instantly.' : 'Repeating one character is trivial to guess.'}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Strength checklist</p>
          <ul className="flex flex-col gap-1.5">
            <CheckRow ok={a.checks.length} label="At least 8 characters (longer is better)" />
            <CheckRow ok={a.checks.lower} label="Lowercase letters (a–z)" />
            <CheckRow ok={a.checks.upper} label="Uppercase letters (A–Z)" />
            <CheckRow ok={a.checks.digit} label="Numbers (0–9)" />
            <CheckRow ok={a.checks.symbol} label="Symbols (@ # ! ?)" />
          </ul>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#64748b' }}>Try one of these</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map(s => (
              <button key={s} onClick={() => setPw(s)} className="px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(129,140,248,0.25)', color: '#a5b4fc' }}>{s}</button>
            ))}
          </div>
          <p className="text-sm leading-snug mt-3" style={{ color: '#94a3b8' }}>
            Notice the last one: a <span style={{ color: '#fbbf24' }}>passphrase</span> of ordinary words is long, easy to remember, and far harder to crack than a short messy password.
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Security Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Length beats cleverness. Four random words you can picture in your head outlast a short password full of $ymb0ls.&rdquo;</p>
      </div>
    </div>
  );
}
