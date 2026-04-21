'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Clock, ShieldCheck, Sparkles } from 'lucide-react';

const DIMENSIONS = [
  { title: 'Your situation', hint: 'Finances, stream, geography, time horizon — the real constraints.' },
  { title: 'What pulls you', hint: 'The kinds of problems you actually want to wake up and solve.' },
  { title: 'How you think', hint: 'Your cognitive style. Not how smart — how.' },
  { title: 'How you work', hint: 'Indoors, solo, predictable, public-facing, all the texture.' },
  { title: 'What matters', hint: 'Money, impact, balance, autonomy — in your honest order.' },
  { title: 'The road ahead', hint: 'How you feel about risk, tech, and unconventional paths.' },
];

export default function LandingClient() {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setStarting(true);
    setError(null);
    try {
      const res = await fetch('/api/v2/career-explorer/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok || !data.profile?._id) throw new Error('start failed');
      router.push(`/career-explorer/questionnaire/${data.profile._id}`);
    } catch {
      setError('Something went wrong starting the session. Please try again.');
      setStarting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-orange-300">
          <Sparkles className="h-3.5 w-3.5" />
          Career Explorer · Phase 1 Beta
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-6xl">
          Find careers that actually <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">fit you</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-white/70">
          Most career tools in India ask one question — "what are you good at?" — and hand you a list.
          This one takes your finances, your stream, where you want to live, what you actually value, and
          what careers are about to get disrupted into account. No clinical framing. You decide.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={start}
            disabled={starting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 font-bold text-black shadow-lg shadow-orange-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            <Compass className="h-5 w-5" />
            {starting ? 'Starting…' : 'Start the Explorer'}
          </button>
          <a
            href="#what-you-get"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-white/80 transition hover:bg-white/10"
          >
            What you'll get
          </a>
        </div>
        {error && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">{error}</div>}

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
          <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" /> ~15–18 minutes</span>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Free. Honest. No gimmicks.</span>
        </div>
      </section>

      <section id="what-you-get" className="mx-auto max-w-4xl px-6 pb-24">
        <h2 className="text-2xl font-semibold">What we ask you about</h2>
        <p className="mt-2 max-w-2xl text-white/70">
          Six lenses, roughly 50 quick questions. No right answers, no scoring you against anyone.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {DIMENSIONS.map((d, i) => (
            <div key={d.title} className="rounded-xl border border-white/10 bg-[#0B0F15] p-5">
              <div className="text-xs uppercase tracking-widest text-orange-300">Part {i + 1}</div>
              <div className="mt-1 text-lg font-semibold">{d.title}</div>
              <div className="mt-1 text-sm text-white/60">{d.hint}</div>
            </div>
          ))}
        </div>

        <h2 className="mt-16 text-2xl font-semibold">What you'll get back</h2>
        <div className="mt-6 space-y-4">
          <Card title="Your Strong Fits" tone="orange" body="Up to 5 mainstream careers where you score well across aptitude, interest, values, and constraints. The honest, safe options." />
          <Card title="Hidden Gems for You" tone="emerald" body="Up to 3 emerging or under-discovered careers where your profile matches unusually well. Climate analytics. AI training. Cybersecurity. Urban planning. Things your cousin probably hasn't heard of." />
          <Card title="Stretch Options" tone="indigo" body="2–3 careers that don't fit you perfectly today, but match your deepest interests. Labelled honestly — here's what it would take." />
        </div>
      </section>
    </main>
  );
}

function Card({ title, body, tone }: { title: string; body: string; tone: 'orange' | 'emerald' | 'indigo' }) {
  const border =
    tone === 'orange' ? 'border-orange-500/30' :
    tone === 'emerald' ? 'border-emerald-500/30' : 'border-indigo-500/30';
  const dot =
    tone === 'orange' ? 'bg-orange-400' :
    tone === 'emerald' ? 'bg-emerald-400' : 'bg-indigo-400';
  return (
    <div className={`rounded-xl border ${border} bg-[#0B0F15] p-5`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <div className="text-lg font-semibold">{title}</div>
      </div>
      <div className="mt-1 text-sm text-white/70">{body}</div>
    </div>
  );
}
