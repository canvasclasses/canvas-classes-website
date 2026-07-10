'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Gauge, ChevronLeft, ChevronRight, ChevronDown, RefreshCw, ImageIcon,
  HelpCircle, ShieldCheck, AlertTriangle, CheckCircle2, ExternalLink, Circle,
} from 'lucide-react';
import type { PageReadinessSummary, ReadinessStage } from '@canvas/data/books/readiness';

// ── Types mirroring GET /api/v2/books/readiness ──────────────────────────────
interface APIPage {
  id: string;
  slug: string;
  title: string;
  page_number: number;
  page_type: string;
  reviewed: boolean;
  readiness: PageReadinessSummary | null;
}
interface APIChapter { number: number; title: string; is_published: boolean; pages: APIPage[]; }
interface APIBook {
  slug: string; title: string; subject: string; grade: number;
  is_published: boolean; chapters: APIChapter[];
}

type Focus = 'all' | 'images' | 'quiz' | 'review' | 'invalid';

const STAGE_ORDER: ReadinessStage[] = ['not_started', 'in_progress', 'content_complete', 'reviewed', 'published'];
const STAGE_COLOR: Record<ReadinessStage, { bar: string; dot: string; text: string; label: string }> = {
  not_started:      { bar: 'bg-white/15',    dot: 'bg-white/30',     text: 'text-white/45',    label: 'Not started' },
  in_progress:      { bar: 'bg-amber-400',   dot: 'bg-amber-400',    text: 'text-amber-300',   label: 'In progress' },
  content_complete: { bar: 'bg-sky-400',     dot: 'bg-sky-400',      text: 'text-sky-300',     label: 'Content complete' },
  reviewed:         { bar: 'bg-violet-400',  dot: 'bg-violet-400',   text: 'text-violet-300',  label: 'Reviewed' },
  published:        { bar: 'bg-emerald-400', dot: 'bg-emerald-400',  text: 'text-emerald-300', label: 'Published' },
};

const SUBJECT_LABEL: Record<string, string> = {
  chemistry: 'Chemistry', physics: 'Physics', mathematics: 'Mathematics', biology: 'Biology',
  science: 'Science', social_science: 'Social Science', english: 'English', ict: 'ICT',
  hindi: 'Hindi', life_skills: 'Life Skills',
};

// ── Per-page derived signals ─────────────────────────────────────────────────
function derive(p: APIPage) {
  const r = p.readiness;
  const isOpener = p.page_type === 'chapter_opener';
  const stage: ReadinessStage = r?.stage ?? 'not_started';
  const pendingImages = r?.pendingImages ?? 0;
  const pendingAudio = r?.pendingAudio ?? 0;
  const hasContent = r?.hasContent ?? false;
  const published = r?.published ?? false;
  const missingQuiz = r ? !r.hasQuiz && !isOpener : false;
  const invalid = r ? !r.structureValid || !r.latexValid : false;
  const notReviewed = !p.reviewed && !published && hasContent;
  return { r, stage, pendingImages, pendingAudio, missingQuiz, invalid, notReviewed, published, isOpener };
}

export default function ReadinessDashboard() {
  const [books, setBooks] = useState<APIBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [recomputing, setRecomputing] = useState(false);

  const [grade, setGrade] = useState<number | 'all'>('all');
  const [subject, setSubject] = useState<string>('all');
  const [focus, setFocus] = useState<Focus>('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v2/books/readiness', { cache: 'no-store' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load');
      setBooks(json.data as APIBook[]);
      setGeneratedAt(json.generated_at);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load readiness report');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const recompute = useCallback(async () => {
    setRecomputing(true);
    try {
      await fetch('/api/v2/books/readiness/recompute', { method: 'POST' });
      await load();
    } finally {
      setRecomputing(false);
    }
  }, [load]);

  const toggleReview = useCallback(async (bookSlug: string, page: APIPage) => {
    const next = !page.reviewed;
    // optimistic
    setBooks((prev) => prev.map((b) => b.slug !== bookSlug ? b : {
      ...b, chapters: b.chapters.map((c) => ({
        ...c, pages: c.pages.map((p) => p.slug !== page.slug ? p : { ...p, reviewed: next }),
      })),
    }));
    try {
      const res = await fetch(`/api/v2/books/${bookSlug}/pages/${page.slug}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewed: next }),
      });
      const json = await res.json();
      if (json.success && json.data?.readiness) {
        setBooks((prev) => prev.map((b) => b.slug !== bookSlug ? b : {
          ...b, chapters: b.chapters.map((c) => ({
            ...c, pages: c.pages.map((p) => p.slug !== page.slug ? p
              : { ...p, reviewed: json.data.reviewed, readiness: json.data.readiness }),
          })),
        }));
      }
    } catch { /* leave optimistic value; a refresh reconciles */ }
  }, []);

  // ── Filter option lists ──
  const grades = useMemo(() => [...new Set(books.map((b) => b.grade))].sort((a, b) => a - b), [books]);
  const subjects = useMemo(() => [...new Set(books.map((b) => b.subject))].sort(), [books]);

  // ── Books passing grade/subject/query filters (focus applied per-page later) ──
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (grade !== 'all' && b.grade !== grade) return false;
      if (subject !== 'all' && b.subject !== subject) return false;
      if (q) {
        const hit = b.title.toLowerCase().includes(q)
          || b.chapters.some((c) => c.title.toLowerCase().includes(q)
            || c.pages.some((p) => p.title.toLowerCase().includes(q)));
        if (!hit) return false;
      }
      return true;
    });
  }, [books, grade, subject, query]);

  // ── Portfolio totals over scoped books (stable regardless of focus) ──
  const totals = useMemo(() => {
    let pages = 0, published = 0, pendingImages = 0, missingQuiz = 0, notReviewed = 0, invalid = 0, chapters = 0;
    for (const b of scoped) {
      for (const c of b.chapters) {
        chapters++;
        for (const p of c.pages) {
          pages++;
          const d = derive(p);
          if (d.published) published++;
          pendingImages += d.pendingImages;
          if (d.missingQuiz) missingQuiz++;
          if (d.notReviewed) notReviewed++;
          if (d.invalid) invalid++;
        }
      }
    }
    return { books: scoped.length, chapters, pages, published, pendingImages, missingQuiz, notReviewed, invalid };
  }, [scoped]);

  const focusMatch = useCallback((p: APIPage) => {
    if (focus === 'all') return true;
    const d = derive(p);
    if (focus === 'images') return d.pendingImages > 0;
    if (focus === 'quiz') return d.missingQuiz;
    if (focus === 'review') return d.notReviewed;
    if (focus === 'invalid') return d.invalid;
    return true;
  }, [focus]);

  const toggleExpand = (key: string) =>
    setExpanded((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });

  const setFocusFilter = (f: Focus) => setFocus((cur) => (cur === f ? 'all' : f));

  // Group scoped books by grade for the class dividers.
  const byGrade = useMemo(() => {
    const m = new Map<number, APIBook[]>();
    for (const b of scoped) { const a = m.get(b.grade) || []; a.push(b); m.set(b.grade, a); }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [scoped]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1240px] px-5 py-6">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/8 pb-5">
          <div className="flex items-center gap-3">
            <Link href="/books" title="Back to editor"
              className="inline-flex items-center rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-orange-300">
              <ChevronLeft size={16} />
            </Link>
            <Gauge size={20} className="text-orange-500" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">Book Readiness</h1>
              <p className="text-xs text-white/40">
                Publish-readiness of every chapter · {generatedAt
                  ? `updated ${new Date(generatedAt).toLocaleString()}` : 'loading…'}
              </p>
            </div>
          </div>
          <button onClick={recompute} disabled={recomputing || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5
              text-xs font-medium text-white/70 hover:bg-white/10 disabled:opacity-40">
            <RefreshCw size={13} className={recomputing ? 'animate-spin' : ''} />
            {recomputing ? 'Recomputing…' : 'Recompute'}
          </button>
        </header>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* ── Portfolio stat strip (cards double as filters) ── */}
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Books" value={totals.books} sub={`${totals.chapters} chapters`} />
          <Stat label="Pages" value={totals.pages}
            sub={`${totals.pages ? Math.round((totals.published / totals.pages) * 100) : 0}% published`} />
          <Stat label="Published" value={totals.published} tone="good" sub="live to students" />
          <Stat label="Images pending" value={totals.pendingImages} tone={totals.pendingImages ? 'warn' : 'good'}
            active={focus === 'images'} onClick={() => setFocusFilter('images')} icon={<ImageIcon size={13} />} />
          <Stat label="Missing quiz" value={totals.missingQuiz} tone={totals.missingQuiz ? 'warn' : 'good'}
            active={focus === 'quiz'} onClick={() => setFocusFilter('quiz')} icon={<HelpCircle size={13} />} />
          <Stat label="Not reviewed" value={totals.notReviewed} tone={totals.notReviewed ? 'warn' : 'good'}
            active={focus === 'review'} onClick={() => setFocusFilter('review')} icon={<ShieldCheck size={13} />} />
        </div>
        {totals.invalid > 0 && (
          <button onClick={() => setFocusFilter('invalid')}
            className={`mt-2.5 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium
              ${focus === 'invalid' ? 'border-red-500/50 bg-red-500/15 text-red-200'
                : 'border-red-500/25 bg-red-500/8 text-red-300 hover:bg-red-500/12'}`}>
            <AlertTriangle size={13} /> {totals.invalid} page{totals.invalid > 1 ? 's' : ''} with invalid blocks / LaTeX
          </button>
        )}

        {/* ── Filter bar ── */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <FilterPills label="Class" value={grade} onChange={setGrade}
            options={[['all', 'All'], ...grades.map((g) => [g, `Class ${g}`] as [number, string])]} />
          <span className="mx-1 h-4 w-px bg-white/10" />
          <FilterPills label="Subject" value={subject} onChange={setSubject}
            options={[['all', 'All'], ...subjects.map((s) => [s, SUBJECT_LABEL[s] || s] as [string, string])]} />
          <span className="mx-1 h-4 w-px bg-white/10" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search book / chapter / page…"
            className="w-52 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white
              placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none" />
          {focus !== 'all' && (
            <button onClick={() => setFocus('all')}
              className="inline-flex items-center gap-1 rounded-lg bg-orange-500/15 px-2.5 py-1.5 text-xs text-orange-300 hover:bg-orange-500/25">
              Clear focus ✕
            </button>
          )}
          {/* Stage legend */}
          <div className="ml-auto hidden items-center gap-3 lg:flex">
            {STAGE_ORDER.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 text-[11px] text-white/40">
                <span className={`h-2 w-2 rounded-full ${STAGE_COLOR[s].dot}`} /> {STAGE_COLOR[s].label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="mt-16 text-center text-sm text-white/40">Loading readiness report…</div>
        ) : byGrade.length === 0 ? (
          <div className="mt-16 text-center text-sm text-white/40">No books match these filters.</div>
        ) : (
          <div className="mt-6 space-y-8">
            {byGrade.map(([g, gbooks]) => (
              <section key={g}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-sm font-bold text-white/80">Class {g}</h2>
                  <span className="text-xs text-white/30">{gbooks.length} book{gbooks.length > 1 ? 's' : ''}</span>
                  <span className="h-px flex-1 bg-white/8" />
                </div>
                <div className="space-y-3">
                  {gbooks.map((book) => (
                    <BookCard key={book.slug} book={book} focus={focus} focusMatch={focusMatch}
                      expanded={expanded} toggleExpand={toggleExpand} toggleReview={toggleReview} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ label, value, sub, tone, icon, active, onClick }: {
  label: string; value: number; sub?: string; tone?: 'good' | 'warn';
  icon?: React.ReactNode; active?: boolean; onClick?: () => void;
}) {
  const valueColor = tone === 'good' ? 'text-emerald-400' : tone === 'warn' ? 'text-amber-400' : 'text-white';
  const clickable = !!onClick;
  return (
    <button disabled={!clickable} onClick={onClick}
      className={`flex flex-col gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors
        ${active ? 'border-orange-500/50 bg-orange-500/10'
          : 'border-white/8 bg-[#0B0F15]'} ${clickable ? 'hover:border-white/20 cursor-pointer' : 'cursor-default'}`}>
      <span className="flex items-center gap-1.5 text-[11px] text-white/45">{icon}{label}</span>
      <span className={`font-mono text-2xl font-bold tabular-nums leading-none ${valueColor}`}>{value}</span>
      {sub && <span className="text-[11px] text-white/35">{sub}</span>}
    </button>
  );
}

// ── Filter pills ──────────────────────────────────────────────────────────────
function FilterPills<T extends string | number>({ label, value, onChange, options }: {
  label: string; value: T; onChange: (v: T) => void; options: [T, string][];
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-white/30">{label}</span>
      <div className="flex flex-wrap gap-1">
        {options.map(([val, lbl]) => (
          <button key={String(val)} onClick={() => onChange(val)}
            className={`rounded-md px-2 py-1 text-xs transition-colors
              ${value === val ? 'bg-white/15 text-white' : 'bg-white/5 text-white/45 hover:bg-white/10 hover:text-white/70'}`}>
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Book card (chapters inside) ────────────────────────────────────────────────
function BookCard({ book, focus, focusMatch, expanded, toggleExpand, toggleReview }: {
  book: APIBook; focus: Focus; focusMatch: (p: APIPage) => boolean;
  expanded: Set<string>; toggleExpand: (k: string) => void;
  toggleReview: (bookSlug: string, p: APIPage) => void;
}) {
  // Chapters, with focus applied to their pages.
  const chapters = book.chapters
    .map((c) => ({ ...c, shown: focus === 'all' ? c.pages : c.pages.filter(focusMatch) }))
    .filter((c) => focus === 'all' || c.shown.length > 0);
  if (chapters.length === 0) return null;

  const allPages = book.chapters.flatMap((c) => c.pages);
  const pub = allPages.filter((p) => derive(p).published).length;

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-[#0B0F15]">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-white">{book.title}</h3>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/40">
              {SUBJECT_LABEL[book.subject] || book.subject}
            </span>
            {book.is_published
              ? <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">Published</span>
              : <span className="shrink-0 rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-white/40">Draft</span>}
          </div>
          <p className="mt-0.5 text-[11px] text-white/35">
            {allPages.length} pages · {pub} published · {book.chapters.length} chapters
          </p>
        </div>
        <StageBar pages={allPages} />
      </div>

      <div className="divide-y divide-white/5">
        {chapters.map((c) => {
          const key = `${book.slug}:${c.number}`;
          const isOpen = expanded.has(key) || focus !== 'all';
          const shown = c.shown;
          const agg = aggregate(c.pages);
          return (
            <div key={c.number}>
              <button onClick={() => toggleExpand(key)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.02]">
                <span className="text-white/30">
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <span className="w-8 shrink-0 font-mono text-xs text-white/40">Ch{c.number}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-white/85">{c.title}</span>
                {/* dimension chips */}
                <div className="flex shrink-0 items-center gap-1.5">
                  {agg.pendingImages > 0 && <Chip tone="warn" icon={<ImageIcon size={11} />}>{agg.pendingImages}</Chip>}
                  {agg.missingQuiz > 0 && <Chip tone="warn" icon={<HelpCircle size={11} />}>{agg.missingQuiz}</Chip>}
                  {agg.invalid > 0 && <Chip tone="bad" icon={<AlertTriangle size={11} />}>{agg.invalid}</Chip>}
                  {agg.notReviewed > 0 && <Chip tone="mut" icon={<ShieldCheck size={11} />}>{agg.notReviewed}</Chip>}
                  {agg.blockersClear && agg.pages > 0 &&
                    <Chip tone="good" icon={<CheckCircle2 size={11} />}>ready</Chip>}
                  <span className="ml-1 w-24"><StageBar pages={c.pages} thin /></span>
                  <span className="w-10 text-right font-mono text-[11px] text-white/30">{agg.pages}p</span>
                </div>
              </button>

              {isOpen && (
                <div className="bg-black/20 pb-1">
                  {shown.length === 0 ? (
                    <p className="px-12 py-2 text-xs text-white/30">No pages yet.</p>
                  ) : shown.map((p) => (
                    <PageRow key={p.slug} book={book} page={p} toggleReview={toggleReview} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page row ──────────────────────────────────────────────────────────────────
function PageRow({ book, page, toggleReview }: {
  book: APIBook; page: APIPage; toggleReview: (bookSlug: string, p: APIPage) => void;
}) {
  const d = derive(page);
  const sc = STAGE_COLOR[d.stage];
  const chips = [...(d.r?.blockers ?? []), ...(d.r?.warnings ?? [])];
  return (
    <div className="flex items-center gap-3 px-4 py-2 pl-12 hover:bg-white/[0.02]">
      <span className={`h-2 w-2 shrink-0 rounded-full ${sc.dot}`} title={sc.label} />
      <span className="w-8 shrink-0 font-mono text-[11px] text-white/25">p{page.page_number}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-white/70">
        {page.title}
        {d.isOpener && <span className="ml-1.5 text-[10px] text-white/25">(opener)</span>}
      </span>
      <div className="hidden min-w-0 shrink items-center gap-1.5 md:flex">
        {chips.slice(0, 3).map((c, i) => (
          <span key={i} className="truncate rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">{c}</span>
        ))}
        {chips.length > 3 && <span className="text-[10px] text-white/25">+{chips.length - 3}</span>}
      </div>
      <span className={`hidden shrink-0 text-[11px] sm:inline ${sc.text}`}>{sc.label}</span>
      {!d.published && (
        <button onClick={() => toggleReview(book.slug, page)}
          title={page.reviewed ? 'Clear review sign-off' : 'Mark as reviewed'}
          className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-[11px] transition-colors
            ${page.reviewed ? 'bg-violet-500/20 text-violet-300 hover:bg-violet-500/30'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}`}>
          {page.reviewed ? <CheckCircle2 size={12} /> : <Circle size={12} />}
          {page.reviewed ? 'Reviewed' : 'Review'}
        </button>
      )}
      <Link href={`/books?book=${book.slug}&page=${page.slug}`}
        title="Open in editor"
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/50 hover:bg-orange-500/20 hover:text-orange-300">
        <ExternalLink size={12} /> Open
      </Link>
    </div>
  );
}

// ── Stage distribution bar ─────────────────────────────────────────────────────
function StageBar({ pages, thin }: { pages: APIPage[]; thin?: boolean }) {
  const counts = STAGE_ORDER.map((s) => pages.filter((p) => derive(p).stage === s).length);
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className={`flex ${thin ? 'h-1.5' : 'h-2'} w-full overflow-hidden rounded-full bg-white/5`}
      title={STAGE_ORDER.map((s, i) => `${STAGE_COLOR[s].label}: ${counts[i]}`).join(' · ')}>
      {STAGE_ORDER.map((s, i) => counts[i] > 0 && (
        <span key={s} className={STAGE_COLOR[s].bar} style={{ width: `${(counts[i] / total) * 100}%` }} />
      ))}
    </div>
  );
}

// ── Chip ────────────────────────────────────────────────────────────────────
function Chip({ tone, icon, children }: { tone: 'warn' | 'bad' | 'good' | 'mut'; icon: React.ReactNode; children: React.ReactNode }) {
  const cls = {
    warn: 'bg-amber-500/15 text-amber-300', bad: 'bg-red-500/15 text-red-300',
    good: 'bg-emerald-500/15 text-emerald-300', mut: 'bg-violet-500/12 text-violet-300/80',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${cls}`}>
      {icon}{children}
    </span>
  );
}

// ── Chapter-level aggregate ───────────────────────────────────────────────────
function aggregate(pages: APIPage[]) {
  let pendingImages = 0, missingQuiz = 0, invalid = 0, notReviewed = 0;
  for (const p of pages) {
    const d = derive(p);
    pendingImages += d.pendingImages;
    if (d.missingQuiz) missingQuiz++;
    if (d.invalid) invalid++;
    if (d.notReviewed) notReviewed++;
  }
  const blockersClear = pendingImages === 0 && missingQuiz === 0 && invalid === 0;
  return { pages: pages.length, pendingImages, missingQuiz, invalid, notReviewed, blockersClear };
}
