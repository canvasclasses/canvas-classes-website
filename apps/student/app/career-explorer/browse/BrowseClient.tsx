'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Layers, Leaf, Sparkles, TrendingUp } from 'lucide-react';
import type { BrowseCareer } from './types';

type Tab = 'family' | 'subject' | 'sector';

// Order the evergreen sectors in a way that reads as a natural story:
// the things every civilisation has always needed, in rough dependency order.
const SECTOR_ORDER = [
  'Food & Agriculture',
  'Shelter & Construction',
  'Health Care',
  'Education',
  'Transportation',
  'Energy & Environment',
  'Safety & Security',
  'Governance & Public Service',
  'Finance & Commerce',
  'Clothing & Textiles',
  'Computers & Digital',
  'Entertainment & Media',
];

const SECTOR_BLURB: Record<string, string> = {
  'Food & Agriculture': 'Humans will always need to eat. Farming, food tech, agri-supply chains.',
  'Shelter & Construction': 'Every generation builds. Architecture, civil, urban planning.',
  'Health Care': 'Bodies and minds never stop needing care. Clinical, research, allied health.',
  'Education': 'Knowledge must be passed on. Teaching, training, ed-tech.',
  'Transportation': 'Moving people and goods — roads, rails, ports, air, EVs.',
  'Energy & Environment': 'Power the world without breaking it. Utilities, climate, renewables.',
  'Safety & Security': 'Protect people, data, and systems. Law, defence, cyber.',
  'Governance & Public Service': 'The rules that make societies work.',
  'Finance & Commerce': 'Money flowing safely between people and firms.',
  'Clothing & Textiles': 'Design, fabric, fashion, retail.',
  'Computers & Digital': 'The tools most other industries now run on.',
  'Entertainment & Media': 'Stories, sound, games, news.',
};

export default function BrowseClient({ careers }: { careers: BrowseCareer[] }) {
  const [tab, setTab] = useState<Tab>('family');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.family.toLowerCase().includes(q) ||
        c.one_liner.toLowerCase().includes(q) ||
        c.school_subjects.some((s) => s.toLowerCase().includes(q)),
    );
  }, [careers, query]);

  const byFamily = useMemo(() => groupBy(filtered, (c) => c.family), [filtered]);
  const bySubject = useMemo(() => {
    const map = new Map<string, BrowseCareer[]>();
    for (const c of filtered) {
      for (const s of c.school_subjects) {
        if (!map.has(s)) map.set(s, []);
        map.get(s)!.push(c);
      }
    }
    return new Map([...map.entries()].sort((a, b) => b[1].length - a[1].length));
  }, [filtered]);
  const bySector = useMemo(() => {
    const map = groupBy(filtered, (c) => c.evergreen_sector ?? 'Other');
    // apply fixed order
    const ordered = new Map<string, BrowseCareer[]>();
    for (const k of SECTOR_ORDER) if (map.has(k)) ordered.set(k, map.get(k)!);
    for (const [k, v] of map) if (!ordered.has(k)) ordered.set(k, v);
    return ordered;
  }, [filtered]);

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-sm">
          <TabButton active={tab === 'family'} onClick={() => setTab('family')} icon={<Layers className="h-4 w-4" />}>
            By family
          </TabButton>
          <TabButton active={tab === 'subject'} onClick={() => setTab('subject')} icon={<BookOpen className="h-4 w-4" />}>
            By subject
          </TabButton>
          <TabButton active={tab === 'sector'} onClick={() => setTab('sector')} icon={<Leaf className="h-4 w-4" />}>
            By human need
          </TabButton>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, subject or keyword…"
          className="w-full rounded-xl border border-white/10 bg-[#0B0F15] px-4 py-2 text-sm text-white placeholder-white/30 focus:border-orange-400/60 focus:outline-none sm:w-80"
        />
      </div>

      <div className="mt-6 text-sm text-white/50">
        Showing <span className="text-white/80">{filtered.length}</span> of {careers.length} careers
      </div>

      {tab === 'family' && <GroupedList groups={byFamily} emptyLabel="No careers match your search." />}
      {tab === 'subject' && (
        <GroupedList
          groups={bySubject}
          emptyLabel="No careers match. Try the family tab."
          renderHeader={(k, n) => (
            <>
              <span>{k}</span>
              <span className="text-white/40">{n} careers</span>
            </>
          )}
        />
      )}
      {tab === 'sector' && (
        <GroupedList
          groups={bySector}
          emptyLabel="No careers match."
          renderHeader={(k, n) => (
            <>
              <span className="inline-flex items-center gap-2"><Leaf className="h-4 w-4 text-emerald-300" /> {k}</span>
              <span className="text-white/40">{n} careers</span>
            </>
          )}
          renderGroupIntro={(k) => SECTOR_BLURB[k]}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 transition ${
        active ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/90'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function GroupedList({
  groups,
  emptyLabel,
  renderHeader,
  renderGroupIntro,
}: {
  groups: Map<string, BrowseCareer[]>;
  emptyLabel: string;
  renderHeader?: (key: string, count: number) => React.ReactNode;
  renderGroupIntro?: (key: string) => string | undefined;
}) {
  if (groups.size === 0) {
    return <div className="mt-10 text-white/50">{emptyLabel}</div>;
  }
  return (
    <div className="mt-6 space-y-10">
      {[...groups.entries()].map(([key, items]) => (
        <div key={key}>
          <h2 className="flex items-center justify-between text-lg font-semibold text-white/90">
            {renderHeader ? renderHeader(key, items.length) : <span>{key}</span>}
          </h2>
          {renderGroupIntro && renderGroupIntro(key) && (
            <p className="mt-1 text-sm text-white/50">{renderGroupIntro(key)}</p>
          )}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {items.map((c) => (
              <CareerCard key={c._id} career={c} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CareerCard({ career }: { career: BrowseCareer }) {
  return (
    <Link
      href={`/career-explorer/careers/${career._id}`}
      className="group block rounded-xl border border-white/10 bg-[#0B0F15] p-4 transition hover:border-orange-400/40 hover:bg-[#131824]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-white group-hover:text-orange-200">{career.name}</div>
          <div className="mt-0.5 text-xs text-white/50">{career.family}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {career.hidden_gem && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-emerald-300">
              <Sparkles className="h-3 w-3" /> Hidden
            </span>
          )}
          {(career.demand_trajectory === 'growing' || career.demand_trajectory === 'exploding') && (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-orange-300">
              <TrendingUp className="h-3 w-3" /> {career.demand_trajectory}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-white/70">{career.one_liner}</p>
    </Link>
  );
}

function groupBy<T>(items: T[], key: (t: T) => string): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const k = key(it);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(it);
  }
  return new Map([...map.entries()].sort((a, b) => a[0].localeCompare(b[0])));
}
