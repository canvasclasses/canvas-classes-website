'use client';

// HowTheWebWorksSim.tsx
// Class 9 ICT — Chapter 6 (Getting Connected: Internet).
// Demystifies "what happens when you type a URL" as an animated journey:
// browser → DNS lookup → server → response → render. An HTTPS toggle shows why
// the padlock matters (data travels locked vs readable). No facts to source.

import { useState } from 'react';

const ACCENT = '#818cf8';

interface Stage { from: number; to: number; label: (https: boolean) => string; narr: (https: boolean) => string; }
// node x-positions: 0 = You/Browser, 1 = DNS, 2 = Server
const NODE_X = [110, 400, 690];
const NODE_Y = 110;

const STAGES: Stage[] = [
  { from: 0, to: 0, label: () => '⌨️ canvasclasses.in', narr: () => 'You type a web address (URL) and press Enter. The browser needs to find the computer that holds this site.' },
  { from: 0, to: 1, label: () => '“Where is canvasclasses.in?”', narr: () => 'First stop: the DNS — the internet\'s phone book. The browser asks it to translate the name into a numeric address (an IP address).' },
  { from: 1, to: 0, label: () => '“It\'s at 203.0.113.7”', narr: () => 'The DNS replies with the server\'s IP address. Now the browser knows exactly which computer to talk to.' },
  { from: 0, to: 2, label: (h) => (h ? '🔒 encrypted request' : '🔓 readable request'), narr: (h) => h ? 'The browser sends its request to the server. Because the address starts with https, the data is locked (encrypted) — eavesdroppers can\'t read it.' : 'The browser sends its request over plain http — anyone in between could read it. This is why https matters.' },
  { from: 2, to: 0, label: (h) => (h ? '🔒 the web page' : '🔓 the web page'), narr: () => 'The server sends back the page — the text, images and code that make up the website.' },
  { from: 0, to: 0, label: () => '🖼️ page rendered!', narr: () => 'Finally, the browser draws (renders) the page on your screen. All of this usually happens in well under a second.' },
];

export default function HowTheWebWorksSim() {
  const [step, setStep] = useState(0);
  const [https, setHttps] = useState(true);
  const s = STAGES[step];
  const px = NODE_X[s.from], qx = NODE_X[s.to];
  const packetX = s.from === s.to ? px : (px + qx) / 2;
  const moving = s.from !== s.to;

  const NODES = [
    { x: NODE_X[0], icon: '🧑‍💻', name: 'You + Browser' },
    { x: NODE_X[1], icon: '📖', name: 'DNS (phone book)' },
    { x: NODE_X[2], icon: '🖥️', name: 'Web Server' },
  ];

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">How the <span style={{ color: ACCENT }}>Web Works</span></h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>What happens when you type a URL · Class 9 ICT</p>
        </div>
        <button onClick={() => setHttps(v => !v)} className="text-xs font-bold px-3 py-1.5 rounded-lg"
          style={{ background: https ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)', border: `1px solid ${https ? 'rgba(52,211,153,0.4)' : 'rgba(248,113,113,0.4)'}`, color: https ? '#34d399' : '#f87171' }}>
          {https ? '🔒 https (secure)' : '🔓 http (not secure)'}
        </button>
      </div>

      <div className="rounded-3xl mb-4" style={{ background: 'radial-gradient(circle at center,#1e204a 0%,#050614 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <svg width="100%" height="240" viewBox="0 0 800 240">
          {/* connecting line */}
          <line x1={NODE_X[0]} y1={NODE_Y} x2={NODE_X[2]} y2={NODE_Y} stroke="rgba(129,140,248,0.18)" strokeWidth={2} strokeDasharray="6 6" />
          {/* nodes */}
          {NODES.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={NODE_Y} r={38} fill="rgba(99,102,241,0.10)" stroke="rgba(129,140,248,0.4)" strokeWidth={2} />
              <text x={n.x} y={NODE_Y + 12} textAnchor="middle" fontSize={34}>{n.icon}</text>
              <text x={n.x} y={NODE_Y + 70} textAnchor="middle" fontSize={13} fontWeight={800} fill="#94a3b8">{n.name}</text>
            </g>
          ))}
          {/* packet */}
          <g style={{ transition: 'transform 0.4s ease' }} transform={`translate(${packetX}, ${moving ? NODE_Y - 58 : NODE_Y - 70})`}>
            <rect x={-95} y={-18} width={190} height={34} rx={9} fill="rgba(13,17,23,0.92)" stroke={https ? '#34d399' : '#f87171'} strokeWidth={1.5} />
            <text x={0} y={4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#e2e8f0">{s.label(https)}</text>
          </g>
        </svg>
      </div>

      {/* narration + controls */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {STAGES.map((_, i) => (
          <div key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 28 : 14, background: i <= step ? ACCENT : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <p className="text-white text-base leading-snug mb-4 min-h-[48px]"><span className="font-black" style={{ color: ACCENT }}>Step {step + 1}.</span> {s.narr(https)}</p>

      <div className="flex items-center gap-2">
        <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
          className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: step === 0 ? '#475569' : '#94a3b8' }}>← Back</button>
        {step < STAGES.length - 1 ? (
          <button onClick={() => setStep(s => s + 1)} className="px-5 py-2 rounded-lg text-sm font-bold" style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff' }}>Next step →</button>
        ) : (
          <button onClick={() => setStep(0)} className="px-5 py-2 rounded-lg text-sm font-bold" style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(129,140,248,0.3)', color: '#a5b4fc' }}>↺ Replay</button>
        )}
      </div>

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Web Insight</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;A web address is a name; the internet runs on numbers. DNS does the translation — and the padlock (https) keeps your request unreadable on the way.&rdquo;</p>
      </div>
    </div>
  );
}
