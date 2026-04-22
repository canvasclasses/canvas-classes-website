'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Star, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

interface CareerLite {
  _id: string;
  name?: string;
  family?: string;
  one_liner?: string;
}

interface MatchRow {
  _id: string;
  career_id: string;
  career: CareerLite | null;
  score: number;
  bucket: 'strong_fit' | 'hidden_gem' | 'stretch' | 'excluded';
  breakdown: Record<string, number>;
  admin_override?: { bucket: string; note?: string; by: string; at: string } | null;
}

interface Payload {
  profile: Record<string, unknown>;
  lists: {
    strong_fits: MatchRow[];
    hidden_gems: MatchRow[];
    stretch: MatchRow[];
  };
  all: MatchRow[];
}

export default function ResultsClient({ profileId }: { profileId: string }) {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/v2/career-explorer/profiles/${profileId}/matches`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [profileId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="h-5 w-5 animate-spin text-orange-400" />
      </main>
    );
  }
  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white/60">
        Couldn\'t load your results.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-widest text-orange-300">
          <Sparkles className="h-3.5 w-3.5" /> Your results
        </div>
        <h1 className="mt-5 text-3xl font-semibold sm:text-5xl">
          Three lists, not a ranked leaderboard.
        </h1>
        <p className="mt-3 max-w-2xl text-white/70">
          You are the decision-maker. These are starting points — read, think, share with someone who knows you, then decide.
        </p>

        <List
          title="Your Strong Fits"
          subtitle="Mainstream careers where you score well across aptitude, interests, values, and constraints."
          tone="orange"
          icon={<Star className="h-4 w-4" />}
          rows={data.lists.strong_fits}
          empty="No clear strong fits yet — the stretch list below might be worth a look."
        />
        <List
          title="Hidden Gems for You"
          subtitle="Emerging or under-discovered careers that match your profile unusually well. Less competition, more runway."
          tone="emerald"
          icon={<Sparkles className="h-4 w-4" />}
          rows={data.lists.hidden_gems}
          empty="No hidden gems surfaced this time — likely your interests align more with mainstream tracks."
        />
        <List
          title="Stretch Options"
          subtitle="Careers that don\'t perfectly fit you today, but match your deepest interests. Labelled honestly — here\'s what it would take."
          tone="indigo"
          icon={<TrendingUp className="h-4 w-4" />}
          rows={data.lists.stretch}
          empty="No stretch suggestions at this time."
        />

        <div className="mt-14 rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-300">Next step</div>
            <div className="mt-1 text-lg font-semibold">Turn your results into a one-page vision</div>
            <div className="mt-1 text-sm text-white/70">
              We&apos;ll pre-fill a plan — the work, the place, the people, the learning. You edit it, save it, print it.
            </div>
          </div>
          <Link
            href={`/career-explorer/vision/${profileId}`}
            className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-2.5 text-sm font-bold text-black shadow-lg shadow-orange-500/20 transition hover:brightness-110 sm:mt-0"
          >
            Create my Vision <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#0B0F15] p-6">
          <div className="text-sm text-white/60">Want to go deeper?</div>
          <div className="mt-1 text-lg">Share this with a parent, teacher, or mentor. The best career decisions happen with someone who knows you in the room.</div>
        </div>
      </section>
    </main>
  );
}

function List({ title, subtitle, tone, icon, rows, empty }: {
  title: string;
  subtitle: string;
  tone: 'orange' | 'emerald' | 'indigo';
  icon: React.ReactNode;
  rows: MatchRow[];
  empty: string;
}) {
  const accent =
    tone === 'orange' ? 'text-orange-300 border-orange-500/30' :
    tone === 'emerald' ? 'text-emerald-300 border-emerald-500/30' : 'text-indigo-300 border-indigo-500/30';
  return (
    <div className="mt-12">
      <div className={`inline-flex items-center gap-2 rounded-full border ${accent} bg-white/5 px-3 py-1 text-xs uppercase tracking-widest`}>
        {icon} {title}
      </div>
      <p className="mt-2 max-w-2xl text-sm text-white/60">{subtitle}</p>
      {rows.length === 0 ? (
        <div className="mt-4 rounded-lg border border-white/10 bg-[#0B0F15] px-4 py-6 text-sm text-white/50">{empty}</div>
      ) : (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {rows.map((m) => (
            <Link
              key={m._id}
              href={`/career-explorer/careers/${m.career_id}`}
              className="group rounded-xl border border-white/10 bg-[#0B0F15] p-5 transition hover:border-white/25 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{m.career?.name ?? m.career_id}</div>
                  <div className="mt-0.5 text-xs text-white/50">{m.career?.family}</div>
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">{m.score}%</div>
              </div>
              <div className="mt-2 text-sm text-white/65 line-clamp-2">{m.career?.one_liner}</div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs text-orange-300 group-hover:text-orange-200">
                Explore this career <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
