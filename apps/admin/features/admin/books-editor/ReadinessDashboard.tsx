'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Gauge, ChevronLeft, ChevronRight, ChevronDown, RefreshCw, ImageIcon,
  HelpCircle, ShieldCheck, AlertTriangle, CheckCircle2, ExternalLink, Circle, Rocket,
} from 'lucide-react';
import type { PageReadinessSummary, ReadinessStage } from '@canvas/data/books/readiness';

// ── Types mirroring GET /api/v2/books/readiness ──────────────────────────────
interface APIPage {
  id: string; slug: string; title: string; page_number: number;
  page_type: string; reviewed: boolean; readiness: PageReadinessSummary | null;
}
interface APIChapter { number: number; title: string; is_published: boolean; pages: APIPage[]; }
interface APIBook {
  slug: string; title: string; subject: string; grade: number;
  is_published: boolean; chapters: APIChapter[];
}

type Focus = 'all' | 'images' | 'quiz' | 'review' | 'warn';

const STAGE_ORDER: ReadinessStage[] = ['not_started', 'in_progress', 'content_complete', 'reviewed', 'published'];
// Muted, low-luminance palette — calm on a dark surface, no neon halation.
// (Same comfort principle as the Live Books reading-surface / --book-accent decisions.)
const STAGE: Record<ReadinessStage, { bar: string; dot: string; text: string; rail: string; label: string }> = {
  not_started:      { bar: 'bg-[#3d434f]', dot: 'bg-[#585e6b]', text: 'text-[#8b919d]', rail: 'bg-[#3d434f]', label: 'Not started' },
  in_progress:      { bar: 'bg-[#a67c3c]', dot: 'bg-[#b98d47]', text: 'text-[#c7a468]', rail: 'bg-[#a67c3c]', label: 'In progress' },
  content_complete: { bar: 'bg-[#47768f]', dot: 'bg-[#5788a1]', text: 'text-[#93b3c7]', rail: 'bg-[#47768f]', label: 'Content complete' },
  reviewed:         { bar: 'bg-[#6a5f98]', dot: 'bg-[#7b6faa]', text: 'text-[#a99ecb]', rail: 'bg-[#6a5f98]', label: 'Reviewed' },
  published:        { bar: 'bg-[#3d8067]', dot: 'bg-[#478d73]', text: 'text-[#78b096]', rail: 'bg-[#3d8067]', label: 'Published' },
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
  const hasContent = r?.hasContent ?? false;
  const published = r?.published ?? false;
  const missingQuiz = r ? !r.hasQuiz && !isOpener : false;
  const schemaWarn = r ? !r.structureValid || !r.latexValid : false;
  const notReviewed = !p.reviewed && !published && hasContent;
  // "Ready to ship" = finished content, no hard blockers, just not pushed live yet.
  const readyToShip = !published && hasContent && pendingImages === 0 && !missingQuiz;
  return { r, stage, pendingImages, missingQuiz, schemaWarn, notReviewed, published, hasContent, readyToShip, isOpener };
}

function stageCounts(pages: APIPage[]) {
  const c = { not_started: 0, in_progress: 0, content_complete: 0, reviewed: 0, published: 0 } as Record<ReadinessStage, number>;
  for (const p of pages) c[derive(p).stage]++;
  return c;
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
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/v2/books/readiness', { cache: 'no-store' });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to load');
      setBooks(json.data as APIBook[]);
      setGeneratedAt(json.generated_at);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load readiness report');
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const recompute = useCallback(async () => {
    setRecomputing(true);
    try { await fetch('/api/v2/books/readiness/recompute', { method: 'POST' }); await load(); }
    finally { setRecomputing(false); }
  }, [load]);

  const toggleReview = useCallback(async (bookSlug: string, page: APIPage) => {
    const next = !page.reviewed;
    setBooks((prev) => prev.map((b) => b.slug !== bookSlug ? b : {
      ...b, chapters: b.chapters.map((c) => ({ ...c, pages: c.pages.map((p) => p.slug !== page.slug ? p : { ...p, reviewed: next }) })),
    }));
    try {
      const res = await fetch(`/api/v2/books/${bookSlug}/pages/${page.slug}/review`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reviewed: next }),
      });
      const json = await res.json();
      if (json.success && json.data?.readiness) {
        setBooks((prev) => prev.map((b) => b.slug !== bookSlug ? b : {
          ...b, chapters: b.chapters.map((c) => ({ ...c, pages: c.pages.map((p) => p.slug !== page.slug ? p : { ...p, reviewed: json.data.reviewed, readiness: json.data.readiness }) })),
        }));
      }
    } catch { /* keep optimistic */ }
  }, []);

  const grades = useMemo(() => [...new Set(books.map((b) => b.grade))].sort((a, b) => a - b), [books]);
  const subjects = useMemo(() => [...new Set(books.map((b) => b.subject))].sort(), [books]);

  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (grade !== 'all' && b.grade !== grade) return false;
      if (subject !== 'all' && b.subject !== subject) return false;
      if (q) {
        const hit = b.title.toLowerCase().includes(q)
          || b.chapters.some((c) => c.title.toLowerCase().includes(q) || c.pages.some((p) => p.title.toLowerCase().includes(q)));
        if (!hit) return false;
      }
      return true;
    });
  }, [books, grade, subject, query]);

  const totals = useMemo(() => {
    const all = scoped.flatMap((b) => b.chapters.flatMap((c) => c.pages));
    let published = 0, pendingImages = 0, imagePages = 0, missingQuiz = 0, notReviewed = 0, warnPages = 0, readyToShip = 0, chapters = 0;
    for (const b of scoped) chapters += b.chapters.length;
    for (const p of all) {
      const d = derive(p);
      if (d.published) published++;
      pendingImages += d.pendingImages;
      if (d.pendingImages > 0) imagePages++;
      if (d.missingQuiz) missingQuiz++;
      if (d.notReviewed) notReviewed++;
      if (d.schemaWarn) warnPages++;
      if (d.readyToShip) readyToShip++;
    }
    return {
      books: scoped.length, chapters, pages: all.length, published,
      pendingImages, imagePages, missingQuiz, notReviewed, warnPages, readyToShip,
      counts: stageCounts(all),
    };
  }, [scoped]);

  const focusMatch = useCallback((p: APIPage) => {
    if (focus === 'all') return true;
    const d = derive(p);
    if (focus === 'images') return d.pendingImages > 0;
    if (focus === 'quiz') return d.missingQuiz;
    if (focus === 'review') return d.notReviewed;
    if (focus === 'warn') return d.schemaWarn;
    return true;
  }, [focus]);

  const toggleExpand = (key: string) =>
    setExpanded((prev) => { const n = new Set(prev); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  const setFocusFilter = (f: Focus) => setFocus((cur) => (cur === f ? 'all' : f));

  const byGrade = useMemo(() => {
    const m = new Map<number, APIBook[]>();
    for (const b of scoped) { const a = m.get(b.grade) || []; a.push(b); m.set(b.grade, a); }
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }, [scoped]);

  const pubPct = totals.pages ? Math.round((totals.published / totals.pages) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0d0f13] text-white">
      <div className="mx-auto max-w-[1180px] px-5 py-6">
        {/* ── Header ── */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/books" title="Back to editor"
              className="inline-flex items-center rounded-lg p-1.5 text-white/40 hover:bg-white/5 hover:text-orange-300">
              <ChevronLeft size={16} />
            </Link>
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/15 text-orange-400"><Gauge size={18} /></span>
            <div>
              <h1 className="text-[19px] font-bold leading-tight tracking-tight">Book Readiness</h1>
              <p className="text-xs text-white/40">
                Every chapter, every page · {generatedAt ? `updated ${new Date(generatedAt).toLocaleString()}` : 'loading…'}
              </p>
            </div>
          </div>
          <button onClick={recompute} disabled={recomputing || loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2
              text-xs font-medium text-white/70 hover:bg-white/10 disabled:opacity-40">
            <RefreshCw size={13} className={recomputing ? 'animate-spin' : ''} />
            {recomputing ? 'Recomputing…' : 'Recompute'}
          </button>
        </header>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</div>
        )}

        {/* ── Hero: the publishing pipeline ── */}
        <section className="mt-5 grid gap-4 rounded-2xl border border-white/8 bg-gradient-to-b from-[#161a22] to-[#11141a] p-5 lg:grid-cols-[minmax(220px,300px)_1fr]">
          <div className="flex flex-col justify-center gap-3 lg:border-r lg:border-white/8 lg:pr-5">
            <div>
              <div className="flex items-end gap-2">
                <span className="text-[52px] font-bold leading-none text-[#6bb191]">{totals.published}</span>
                <span className="pb-1.5 text-sm text-white/45">/ {totals.pages} live</span>
              </div>
              <p className="mt-1 text-xs text-white/40">{pubPct}% of pages published across {totals.books} book{totals.books !== 1 ? 's' : ''} · {totals.chapters} chapters</p>
            </div>
            {totals.readyToShip > 0 && (
              <div className="inline-flex items-center gap-2 self-start rounded-lg border border-[#3d8067]/30 bg-[#3d8067]/12 px-3 py-2 text-xs text-[#78b096]">
                <Rocket size={14} />
                <span><b className="font-bold">{totals.readyToShip}</b> page{totals.readyToShip !== 1 ? 's' : ''} finished, ready to publish</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-wider text-white/35">Pipeline</span>
            <StageBar counts={totals.counts} height="h-3.5" />
            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {STAGE_ORDER.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                  <span className={`h-2 w-2 rounded-full ${STAGE[s].dot}`} />
                  {STAGE[s].label}
                  <b className="ml-0.5 font-mono font-semibold tabular-nums text-white/70">{totals.counts[s]}</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Attention meters (double as filters) ── */}
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Attention icon={<ImageIcon size={14} />} label="Images pending" value={totals.pendingImages}
            sub={`on ${totals.imagePages} page${totals.imagePages !== 1 ? 's' : ''}`} share={totals.imagePages / (totals.pages || 1)}
            tone="amber" active={focus === 'images'} onClick={() => setFocusFilter('images')} />
          <Attention icon={<HelpCircle size={14} />} label="Missing quiz" value={totals.missingQuiz}
            sub="pages with no check" share={totals.missingQuiz / (totals.pages || 1)}
            tone="amber" active={focus === 'quiz'} onClick={() => setFocusFilter('quiz')} />
          <Attention icon={<ShieldCheck size={14} />} label="Awaiting review" value={totals.notReviewed}
            sub="not yet signed off" share={totals.notReviewed / (totals.pages || 1)}
            tone="violet" active={focus === 'review'} onClick={() => setFocusFilter('review')} />
          <Attention icon={<AlertTriangle size={14} />} label="Schema / LaTeX warnings" value={totals.warnPages}
            sub="lint — fix at leisure" share={totals.warnPages / (totals.pages || 1)}
            tone="slate" active={focus === 'warn'} onClick={() => setFocusFilter('warn')} />
        </div>

        {/* ── Filters ── */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Pills label="Class" value={grade} onChange={setGrade}
            options={[['all', 'All'], ...grades.map((g) => [g, `Class ${g}`] as [number, string])]} />
          <span className="mx-1 h-4 w-px bg-white/10" />
          <Pills label="Subject" value={subject} onChange={setSubject}
            options={[['all', 'All'], ...subjects.map((s) => [s, SUBJECT_LABEL[s] || s] as [string, string])]} />
          <span className="mx-1 h-4 w-px bg-white/10" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search book / chapter / page…"
            className="w-56 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white placeholder:text-white/30 focus:border-orange-500/50 focus:outline-none" />
          {focus !== 'all' && (
            <button onClick={() => setFocus('all')}
              className="inline-flex items-center gap-1 rounded-lg bg-orange-500/15 px-2.5 py-1.5 text-xs text-orange-300 hover:bg-orange-500/25">
              Showing only flagged pages · clear ✕
            </button>
          )}
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div className="mt-20 text-center text-sm text-white/40">Loading readiness report…</div>
        ) : byGrade.length === 0 ? (
          <div className="mt-20 text-center text-sm text-white/40">No books match these filters.</div>
        ) : (
          <div className="mt-6 space-y-9">
            {byGrade.map(([g, gbooks]) => (
              <section key={g}>
                <div className="mb-3 flex items-center gap-3">
                  <h2 className="text-sm font-bold text-white/80">Class {g}</h2>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/40">{gbooks.length} book{gbooks.length > 1 ? 's' : ''}</span>
                  <span className="h-px flex-1 bg-white/8" />
                </div>
                <div className="space-y-4">
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

// ── Attention meter ──────────────────────────────────────────────────────────
function Attention({ icon, label, value, sub, share, tone, active, onClick }: {
  icon: React.ReactNode; label: string; value: number; sub: string; share: number;
  tone: 'amber' | 'violet' | 'slate'; active: boolean; onClick: () => void;
}) {
  const zero = value === 0;
  const fill = zero ? 'bg-[#3d8067]' : tone === 'amber' ? 'bg-[#a67c3c]' : tone === 'violet' ? 'bg-[#6a5f98]' : 'bg-[#585e6b]';
  const num = zero ? 'text-[#78b096]' : tone === 'amber' ? 'text-[#c7a468]' : tone === 'violet' ? 'text-[#a99ecb]' : 'text-white/70';
  return (
    <button onClick={onClick}
      className={`group flex flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-colors
        ${active ? 'border-orange-500/50 bg-orange-500/[0.07]' : 'border-white/8 bg-[#12151c] hover:border-white/20'}`}>
      <span className="flex items-center gap-1.5 text-[11px] text-white/45">{icon}{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={`text-[26px] font-bold leading-none ${num}`}>{zero ? '✓' : value}</span>
        <span className="text-[11px] text-white/35">{zero ? 'all clear' : sub}</span>
      </div>
      <span className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-white/6">
        <span className={`block h-full rounded-full ${fill}`} style={{ width: `${Math.max(zero ? 100 : 3, Math.min(100, share * 100))}%` }} />
      </span>
    </button>
  );
}

// ── Filter pills ─────────────────────────────────────────────────────────────
function Pills<T extends string | number>({ label, value, onChange, options }: {
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

// ── Book card ────────────────────────────────────────────────────────────────
function BookCard({ book, focus, focusMatch, expanded, toggleExpand, toggleReview }: {
  book: APIBook; focus: Focus; focusMatch: (p: APIPage) => boolean;
  expanded: Set<string>; toggleExpand: (k: string) => void; toggleReview: (bookSlug: string, p: APIPage) => void;
}) {
  const chapters = book.chapters
    .map((c) => ({ ...c, shown: focus === 'all' ? c.pages : c.pages.filter(focusMatch) }))
    .filter((c) => focus === 'all' || c.shown.length > 0);
  if (chapters.length === 0) return null;

  const allPages = book.chapters.flatMap((c) => c.pages);
  const pub = allPages.filter((p) => derive(p).published).length;
  const bookAgg = aggregate(allPages);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/8 bg-[#12151c]">
      {/* header */}
      <div className="flex flex-col gap-3 border-b border-white/8 bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold text-white">{book.title}</h3>
            <span className="rounded-md border border-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-white/45">
              {SUBJECT_LABEL[book.subject] || book.subject}
            </span>
            {book.is_published
              ? <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] text-emerald-300">Published</span>
              : <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">Draft</span>}
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-white/40">
            <span><b className="font-mono tabular-nums text-white/60">{pub}</b>/{allPages.length} published · {book.chapters.length} chapters</span>
            {bookAgg.pendingImages > 0 && <NeedInline icon={<ImageIcon size={11} />}>{bookAgg.pendingImages} images</NeedInline>}
            {bookAgg.missingQuiz > 0 && <NeedInline icon={<HelpCircle size={11} />}>{bookAgg.missingQuiz} need quiz</NeedInline>}
            {bookAgg.notReviewed > 0 && <NeedInline icon={<ShieldCheck size={11} />} tone="violet">{bookAgg.notReviewed} to review</NeedInline>}
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-56">
          <StageBar counts={stageCounts(allPages)} height="h-2" />
        </div>
      </div>

      {/* chapters */}
      <div>
        {chapters.map((c) => {
          const key = `${book.slug}:${c.number}`;
          const isOpen = expanded.has(key) || focus !== 'all';
          const agg = aggregate(c.pages);
          const counts = stageCounts(c.pages);
          const dominant = ([...STAGE_ORDER].reverse().find((s) => counts[s] > 0)) ?? 'not_started';
          const empty = c.pages.length === 0;
          return (
            <div key={c.number} className="border-t border-white/5 first:border-t-0">
              <button onClick={() => !empty && toggleExpand(key)} disabled={empty}
                className={`flex w-full items-center gap-3 py-3 pl-0 pr-4 text-left ${empty ? 'cursor-default' : 'hover:bg-white/[0.02]'}`}>
                <span className={`h-9 w-1 shrink-0 rounded-r ${empty ? 'bg-white/8' : STAGE[dominant].rail}`} />
                <span className="w-4 shrink-0 text-white/25">
                  {empty ? null : isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
                <span className="w-9 shrink-0 font-mono text-[11px] text-white/35">Ch{c.number}</span>
                <span className={`min-w-0 flex-1 truncate text-sm ${empty ? 'text-white/30' : 'text-white/85'}`}>{c.title}</span>

                {empty ? (
                  <span className="shrink-0 text-[11px] text-white/25">not started</span>
                ) : (
                  <div className="flex shrink-0 items-center gap-2.5">
                    <div className="hidden items-center gap-1.5 sm:flex">
                      {agg.pendingImages > 0 && <Badge tone="amber" icon={<ImageIcon size={11} />}>{agg.pendingImages}</Badge>}
                      {agg.missingQuiz > 0 && <Badge tone="amber" icon={<HelpCircle size={11} />}>{agg.missingQuiz}</Badge>}
                      {agg.warn > 0 && <Badge tone="slate" icon={<AlertTriangle size={11} />}>{agg.warn}</Badge>}
                      {agg.notReviewed > 0 && <Badge tone="violet" icon={<ShieldCheck size={11} />}>{agg.notReviewed}</Badge>}
                      {agg.blockersClear && <Badge tone="good" icon={<CheckCircle2 size={11} />}>ready</Badge>}
                    </div>
                    <span className="hidden w-20 sm:block"><StageBar counts={counts} height="h-1.5" /></span>
                    <span className="w-9 text-right font-mono text-[11px] tabular-nums text-white/30">{c.pages.length}p</span>
                  </div>
                )}
              </button>

              {isOpen && !empty && (
                <div className="border-t border-white/[0.04] bg-black/25 py-1 pl-6">
                  {c.shown.length === 0
                    ? <p className="px-6 py-2 text-xs text-white/30">No pages match the filter.</p>
                    : c.shown.map((p) => <PageRow key={p.slug} book={book} page={p} toggleReview={toggleReview} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}

// ── Page row ─────────────────────────────────────────────────────────────────
function PageRow({ book, page, toggleReview }: { book: APIBook; page: APIPage; toggleReview: (bookSlug: string, p: APIPage) => void }) {
  const d = derive(page);
  const sc = STAGE[d.stage];
  const chips = [...(d.r?.blockers ?? []), ...(d.r?.warnings ?? [])];
  return (
    <div className="flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/[0.03]">
      <span className={`h-2 w-2 shrink-0 rounded-full ${sc.dot}`} title={sc.label} />
      <span className="w-8 shrink-0 font-mono text-[11px] tabular-nums text-white/25">p{page.page_number}</span>
      <span className="min-w-0 flex-1 truncate text-sm text-white/70">
        {page.title}{d.isOpener && <span className="ml-1.5 text-[10px] text-white/25">(opener)</span>}
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
            ${page.reviewed ? 'bg-[#6a5f98]/22 text-[#a99ecb] hover:bg-[#6a5f98]/32'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'}`}>
          {page.reviewed ? <CheckCircle2 size={12} /> : <Circle size={12} />}{page.reviewed ? 'Reviewed' : 'Review'}
        </button>
      )}
      <Link href={`/books?book=${book.slug}&page=${page.slug}`} title="Open in editor"
        className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[11px] text-white/50 hover:bg-orange-500/20 hover:text-orange-300">
        <ExternalLink size={12} /> Open
      </Link>
    </div>
  );
}

// ── Stage distribution bar (2px gaps, rounded, part-to-whole) ────────────────
function StageBar({ counts, height }: { counts: Record<ReadinessStage, number>; height: string }) {
  const total = STAGE_ORDER.reduce((a, s) => a + counts[s], 0) || 1;
  return (
    <div className={`flex ${height} w-full gap-[2px] overflow-hidden rounded-full bg-white/[0.04]`}
      title={STAGE_ORDER.map((s) => `${STAGE[s].label}: ${counts[s]}`).join(' · ')}>
      {STAGE_ORDER.map((s) => counts[s] > 0 && (
        <span key={s} className={`${STAGE[s].bar} first:rounded-l-full last:rounded-r-full`} style={{ width: `${(counts[s] / total) * 100}%` }} />
      ))}
    </div>
  );
}

// ── Small pieces ─────────────────────────────────────────────────────────────
function Badge({ tone, icon, children }: { tone: 'amber' | 'slate' | 'good' | 'violet'; icon: React.ReactNode; children: React.ReactNode }) {
  const cls = {
    amber: 'bg-[#a67c3c]/18 text-[#c7a468]', slate: 'bg-[#585e6b]/22 text-[#9aa0ac]',
    good: 'bg-[#3d8067]/18 text-[#78b096]', violet: 'bg-[#6a5f98]/18 text-[#a99ecb]',
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium tabular-nums ${cls}`}>{icon}{children}</span>;
}

function NeedInline({ icon, tone, children }: { icon: React.ReactNode; tone?: 'violet'; children: React.ReactNode }) {
  return <span className={`inline-flex items-center gap-1 ${tone === 'violet' ? 'text-[#a99ecb]/80' : 'text-[#c7a468]/85'}`}>{icon}{children}</span>;
}

// ── Chapter-level aggregate ──────────────────────────────────────────────────
function aggregate(pages: APIPage[]) {
  let pendingImages = 0, missingQuiz = 0, warn = 0, notReviewed = 0;
  for (const p of pages) {
    const d = derive(p);
    pendingImages += d.pendingImages;
    if (d.missingQuiz) missingQuiz++;
    if (d.schemaWarn) warn++;
    if (d.notReviewed) notReviewed++;
  }
  const blockersClear = pages.length > 0 && pendingImages === 0 && missingQuiz === 0;
  return { pages: pages.length, pendingImages, missingQuiz, warn, notReviewed, blockersClear };
}
