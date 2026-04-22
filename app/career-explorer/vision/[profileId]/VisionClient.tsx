'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Briefcase, Download, Globe2, GraduationCap, Heart, Printer, Save, Sparkles, Users } from 'lucide-react';

export interface VisionSeed {
  name: string;
  work: string;
  interests: string;
  location: string;
  matters: string;
  role: string;
  learning: string;
  steps: string;
  topCareerIds: string[];
}

interface VisionState {
  name: string;
  work: string;
  interests: string;
  location: string;
  matters: string;
  role: string;
  learning: string;
  steps: string;
}

const EMPTY: VisionState = {
  name: '', work: '', interests: '', location: '', matters: '', role: '', learning: '', steps: '',
};

// We store vision edits in localStorage keyed by profile id. Keeping the
// vision builder client-side avoids a schema migration for Phase 1 and lets
// anonymous users play with it freely. If a user later wants to save it to
// their profile, we can serialise this blob and POST it.
const storageKey = (id: string) => `canvas:career-vision:${id}`;

export default function VisionClient({ profileId, seed }: { profileId: string; seed: VisionSeed }) {
  const [state, setState] = useState<VisionState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Hydrate: localStorage > seed.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(profileId));
      if (raw) {
        const parsed = JSON.parse(raw) as VisionState;
        setState({ ...EMPTY, ...seed, ...parsed });
      } else {
        setState({ ...EMPTY, ...seed });
      }
    } catch {
      setState({ ...EMPTY, ...seed });
    }
    setHydrated(true);
  }, [profileId, seed]);

  const update = (k: keyof VisionState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setState((s) => ({ ...s, [k]: e.target.value }));
    setSaved('idle');
  };

  const save = () => {
    setSaved('saving');
    try {
      localStorage.setItem(storageKey(profileId), JSON.stringify(state));
      setSaved('saved');
      setTimeout(() => setSaved('idle'), 2000);
    } catch {
      setSaved('idle');
    }
  };

  const reset = () => {
    if (!confirm('Reset every section to the suggestions we pre-filled? Your edits will be lost.')) return;
    try { localStorage.removeItem(storageKey(profileId)); } catch {}
    setState({ ...EMPTY, ...seed });
  };

  const print = () => window.print();

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-white/40">Preparing your vision…</div>
      </section>
    );
  }

  return (
    <>
      {/* Print-only styles keep the page clean on paper. */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          main, section, div, h1, h2, h3, p, span, label { color: black !important; background: white !important; border-color: #ccc !important; }
          textarea, input { border: 1px solid #ddd !important; background: white !important; color: black !important; }
          .print-page { padding: 0 !important; max-width: 100% !important; }
        }
      `}</style>

      <section className="print-page mx-auto max-w-3xl px-6 py-12">
        <div className="no-print flex flex-wrap items-center justify-between gap-4">
          <Link href={`/career-explorer/results/${profileId}`} className="inline-flex items-center gap-1 text-xs text-white/50 hover:text-white/80">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to your results
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:bg-white/10">
              Reset to suggestions
            </button>
            <button onClick={save} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10">
              <Save className="h-3.5 w-3.5" /> {saved === 'saved' ? 'Saved' : saved === 'saving' ? 'Saving…' : 'Save'}
            </button>
            <button onClick={print} className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1.5 text-xs font-semibold text-black hover:brightness-110">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-orange-300">
          <Sparkles className="h-3.5 w-3.5" /> My Vision of the Future
        </div>
        <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
          A one-page plan for the life <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">I actually want</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-white/70 no-print">
          We&apos;ve pre-filled this from your quiz — edit any line to sound like you. Save it to your browser, print it, pin it on your wall.
        </p>

        <div className="mt-10">
          <label className="text-xs uppercase tracking-widest text-white/40">My name</label>
          <input
            value={state.name}
            onChange={update('name')}
            placeholder="Your name"
            className="mt-1 w-full rounded-lg border border-white/10 bg-[#0B0F15] px-4 py-3 text-2xl font-semibold text-white placeholder-white/20 focus:border-orange-400/60 focus:outline-none"
          />
        </div>

        <VisionField
          icon={<Briefcase className="h-4 w-4" />}
          label="The work I want to do"
          value={state.work}
          onChange={update('work')}
          rows={3}
          hint="What kind of role — not just the job title, the texture of the day."
        />

        <VisionField
          icon={<Heart className="h-4 w-4" />}
          label="What I care about outside work"
          value={state.interests}
          onChange={update('interests')}
          rows={2}
          hint="Hobbies, people, communities — the things that keep you whole."
        />

        <VisionField
          icon={<Globe2 className="h-4 w-4" />}
          label="Where I want to live"
          value={state.location}
          onChange={update('location')}
          rows={2}
          hint="City, country, distance from family — be honest about what feels right."
        />

        <VisionField
          icon={<Sparkles className="h-4 w-4" />}
          label="What matters to me (non-negotiable)"
          value={state.matters}
          onChange={update('matters')}
          rows={2}
          hint="The 2–3 things you will protect even when compromise looks tempting."
        />

        <VisionField
          icon={<Users className="h-4 w-4" />}
          label="People I look up to"
          value={state.role}
          onChange={update('role')}
          rows={2}
          hint="Not heroes you can never reach — people whose careers you could actually study."
        />

        <VisionField
          icon={<GraduationCap className="h-4 w-4" />}
          label="What I need to learn"
          value={state.learning}
          onChange={update('learning')}
          rows={4}
          hint="Stream, exams, degrees, specific skills — the concrete curriculum."
        />

        <VisionField
          icon={<Download className="h-4 w-4" />}
          label="What I&apos;ll do to get there"
          value={state.steps}
          onChange={update('steps')}
          rows={5}
          hint="Small, real actions — this year, this quarter, this month, this week."
        />

        <div className="no-print mt-12 rounded-xl border border-white/10 bg-[#0B0F15] p-6">
          <div className="text-sm text-white/60">One more thing</div>
          <div className="mt-1 text-lg">
            Show this page to a parent, teacher, or mentor. Ask them one question: &quot;Does this sound like me?&quot; The best career plans survive being read out loud to someone who knows you.
          </div>
        </div>
      </section>
    </>
  );
}

function VisionField({
  icon,
  label,
  value,
  onChange,
  rows,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows: number;
  hint: string;
}) {
  return (
    <div className="mt-8">
      <label className="inline-flex items-center gap-2 text-sm font-semibold text-white/80">
        <span className="text-orange-300">{icon}</span>
        {label}
      </label>
      <div className="mt-1 text-xs text-white/40 no-print">{hint}</div>
      <textarea
        value={value}
        onChange={onChange}
        rows={rows}
        className="mt-2 w-full rounded-lg border border-white/10 bg-[#0B0F15] px-4 py-3 text-white placeholder-white/20 focus:border-orange-400/60 focus:outline-none"
      />
    </div>
  );
}
