'use client';

// PhishingDetectiveSim.tsx
// Class 9 ICT — Chapter 7 (Safety and Security in the Cyber World).
// A deck of realistic 2026 messages — email, SMS, UPI, OTP, job offer. The
// student judges each Safe vs Scam, then the red flags are revealed. Builds
// real-world digital-safety judgement beyond the textbook's static examples.
// No external facts to source — scenarios are illustrative.

import { useState } from 'react';

interface Msg {
  kind: string;
  from: string;
  body: string;
  scam: boolean;
  flags: string[]; // why
}

const DECK: Msg[] = [
  {
    kind: 'Email', from: 'support@amaz0n-rewards.com',
    body: 'Congratulations! You are our lucky winner of a ₹50,000 voucher. Click here within 24 hours to claim before it expires.',
    scam: true,
    flags: ['Misspelt domain: "amaz0n" with a zero, not amazon', 'A prize you never entered for', 'Urgency: "within 24 hours"', 'Pressure to click a link'],
  },
  {
    kind: 'SMS', from: 'VK-SBIINB',
    body: 'Your account will be BLOCKED today. Update your KYC now: http://sbi-kyc-verify.in/login',
    scam: true,
    flags: ['Banks never ask for KYC via a text link', 'Threat: account will be "BLOCKED"', 'Suspicious lookalike URL, not the real bank site', 'Creates panic to make you click fast'],
  },
  {
    kind: 'UPI request', from: 'Collect request: ₹4,999 from "PrizeTeam"',
    body: '"You WON a contest! Accept this request and enter your UPI PIN to RECEIVE your prize money."',
    scam: true,
    flags: ['You NEVER enter a UPI PIN to RECEIVE money — only to PAY', 'A "collect request" pulls money FROM you', 'Unknown sender promising a prize'],
  },
  {
    kind: 'Email', from: 'no-reply@school.edu.in',
    body: 'Dear student, your half-yearly timetable is attached as a PDF. Please check with your class teacher for any clash. — Exam Cell',
    scam: false,
    flags: ['Sender is your own school domain', 'No request for money, passwords or personal data', 'No urgency or threats', 'Expected, normal school communication'],
  },
  {
    kind: 'WhatsApp', from: '+91 7X XXXXX 0921 (unknown)',
    body: 'Hi! I am hiring for a part-time job. Earn ₹5,000/day from home. Just pay ₹500 registration to start. Share your bank details.',
    scam: true,
    flags: ['Asks YOU to pay to get a job — real jobs don\'t', 'Unrealistic earnings', 'Asks for bank details', 'Unknown number'],
  },
  {
    kind: 'OTP SMS', from: 'AD-OTPMSG',
    body: 'Someone is calling you saying: "Read me the 6-digit OTP we just sent to confirm your identity."',
    scam: true,
    flags: ['NEVER share an OTP with anyone, ever — not even "bank staff"', 'A caller asking for an OTP is always a scam', 'OTPs are for YOU to type, not to read aloud'],
  },
];

const ACCENT = '#818cf8';

export default function PhishingDetectiveSim() {
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [lastRight, setLastRight] = useState(false);
  const m = DECK[i];

  const answer = (guessScam: boolean) => {
    if (answered) return;
    const right = guessScam === m.scam;
    setLastRight(right);
    if (right) setCorrectCount(c => c + 1);
    setAnswered(true);
  };
  const next = () => { setAnswered(false); setI(v => (v + 1) % DECK.length); };

  return (
    <div className="p-4 md:p-6" style={{ background: '#0d1117', color: '#e2e8f0', borderRadius: 16, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="mb-3 flex justify-between items-start flex-wrap gap-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Phishing <span style={{ color: ACCENT }}>Detective</span></h1>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-0.5" style={{ color: '#475569' }}>Spot the Scam · Class 9 ICT</p>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest pt-1" style={{ color: '#64748b' }}>
          Caught {correctCount} · Card {i + 1}/{DECK.length}
        </div>
      </div>

      {/* message card */}
      <div className="rounded-2xl p-4 mb-4" style={{ background: '#0B0F15', border: '1px solid rgba(255,255,255,0.09)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(129,140,248,0.12)', color: '#818cf8' }}>{m.kind}</span>
          <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>From: {m.from}</span>
        </div>
        <p className="text-base leading-relaxed" style={{ color: '#e2e8f0' }}>{m.body}</p>
      </div>

      {!answered ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold" style={{ color: '#94a3b8' }}>Your call:</span>
          <button onClick={() => answer(false)} className="px-5 py-2 rounded-lg text-sm font-black" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.4)', color: '#34d399' }}>✓ Safe</button>
          <button onClick={() => answer(true)} className="px-5 py-2 rounded-lg text-sm font-black" style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.4)', color: '#f87171' }}>⚠ Scam</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-base font-black" style={{ color: lastRight ? '#34d399' : '#f87171' }}>
            {lastRight ? '✓ Correct — ' : '✕ Careful — '}
            this is <span style={{ color: m.scam ? '#f87171' : '#34d399' }}>{m.scam ? 'a SCAM' : 'SAFE'}</span>.
          </p>
          <div className="rounded-xl p-3" style={{ background: m.scam ? 'rgba(248,113,113,0.06)' : 'rgba(52,211,153,0.06)', border: `1px solid ${m.scam ? 'rgba(248,113,113,0.25)' : 'rgba(52,211,153,0.25)'}` }}>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: m.scam ? '#f87171' : '#34d399' }}>{m.scam ? 'Red flags' : 'Why it\'s fine'}</p>
            <ul className="flex flex-col gap-1.5">
              {m.flags.map((f, k) => (
                <li key={k} className="text-sm leading-snug flex gap-2" style={{ color: '#cbd5e1' }}>
                  <span style={{ color: m.scam ? '#f87171' : '#34d399' }}>{m.scam ? '•' : '✓'}</span>{f}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={next} className="self-start px-5 py-2 rounded-lg text-sm font-bold" style={{ background: 'linear-gradient(135deg,#6366f1,#818cf8)', color: '#fff' }}>Next card →</button>
        </div>
      )}

      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <h5 className="text-[9px] font-black uppercase tracking-widest mb-1.5" style={{ color: '#6366f1' }}>Detective&rsquo;s Rule</h5>
        <p className="text-white text-base font-bold leading-tight italic">&ldquo;Urgency + a link + a request for money, an OTP, or a password = almost always a scam. Slow down and check the sender.&rdquo;</p>
      </div>
    </div>
  );
}
