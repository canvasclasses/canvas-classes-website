'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Save, BookOpen, PanelLeft, Columns2, Eye } from 'lucide-react';
import { Book, BookPage, ContentBlock, BlockType } from '@/types/books';
import BookSidebar from './BookSidebar';
import BlockEditor from './BlockEditor';
import PageRenderer from '../renderer/PageRenderer';

// ─── helpers ──────────────────────────────────────────────────────────────────

export function defaultBlock(type: BlockType, order: number): ContentBlock {
  const id = crypto.randomUUID();
  const base = { id, order };
  switch (type) {
    case 'text':             return { ...base, type, markdown: '' };
    case 'heading':          return { ...base, type, text: '', level: 1 };
    case 'image':            return { ...base, type, src: '', alt: '', width: 'full' };
    case 'interactive_image':return { ...base, type, src: '', alt: '', hotspots: [] };
    case 'video':            return { ...base, type, src: '', provider: 'r2_direct', duration_sec: 0 };
    case 'audio_note':       return { ...base, type, src: '', label: 'Teacher note', duration_sec: 0 };
    case 'molecule_2d':      return { ...base, type, smiles: '', name: '' };
    case 'molecule_3d':      return { ...base, type, smiles: '', name: '' };
    case 'latex_block':      return { ...base, type, latex: '' };
    case 'practice_link':    return { ...base, type, question_ids: [], label: 'Test yourself', style: 'link_to_crucible' };
    case 'callout':          return { ...base, type, variant: 'note', markdown: '' };
    case 'table':            return { ...base, type, headers: ['Column 1', 'Column 2'], rows: [['', '']] };
    case 'timeline':         return { ...base, type, orientation: 'vertical', events: [{ id: crypto.randomUUID(), label: 'Step 1' }] };
    case 'comparison_card':  return { ...base, type, columns: [{ heading: 'Option A', points: [''] }, { heading: 'Option B', points: [''] }] };
    case 'animation':        return { ...base, type, src: '', loop: true, autoplay: true };
    case 'inline_quiz':      return { ...base, type, questions: [{ id: crypto.randomUUID(), question: '', options: ['', '', '', ''], correct_index: 0, explanation: '' }], pass_threshold: 0.7 };
    case 'worked_example':   return { ...base, type, label: 'Solved Example', variant: 'solved_example', problem: '', solution: '', reveal_mode: 'always_visible' };
    case 'simulation':       return { ...base, type, simulation_id: 'fractional-distillation' };
    case 'section':          return { ...base, type, layout: '50-50', columns: [[], []] };
    case 'reasoning_prompt':  return { ...base, type, reasoning_type: 'logical', prompt: '', reveal: '', difficulty_level: 2 };
    case 'classify_exercise': return { ...base, type, question: 'Which of these are…?', rows: [{ substance: '', is_solution: true, explanation: '' }] };
  }
}

function reindexOrders(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.map((b, i) => ({ ...b, order: i }));
}

export type UploadFn = (file: File, blockId: string) => Promise<string>;

interface PageSummary {
  _id: string;
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  published: boolean;
  reading_time_min?: number;
}

// ─── component ────────────────────────────────────────────────────────────────

export default function BookWorkspace() {
  // Navigation helpers — selection is persisted via URL search params so a
  // refresh lands the admin back on the same book + page.
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Books + navigation. Seed state lazily from URL so the first render already
  // reflects ?book=...&page=... on reload.
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookSlug, setSelectedBookSlug] = useState<string | null>(
    () => searchParams.get('book')
  );
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(
    () => searchParams.get('page')
  );

  // Editor state
  const [currentPage, setCurrentPage] = useState<BookPage | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');

  // UI state
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  // Resizable split — editor width as a percentage of the main content area
  const [splitPos, setSplitPos] = useState(45);
  const isDragging = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!isDragging.current || !mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setSplitPos(Math.min(Math.max(pct, 20), 80));
    };

    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedBook = books.find((b) => b.slug === selectedBookSlug) ?? null;

  // ── Load books on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/v2/books')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBooks(d.data); });
  }, []);

  // ── Keep URL in sync with selection ───────────────────────────────────────
  // Source of truth is React state; the URL is a mirror so refreshes restore
  // the same view. Initial seeding happens lazily in useState above.
  useEffect(() => {
    const desired = new URLSearchParams();
    if (selectedBookSlug) desired.set('book', selectedBookSlug);
    if (selectedBookSlug && selectedPageSlug) desired.set('page', selectedPageSlug);
    const desiredQs = desired.toString();
    const currentQs = searchParams.toString();
    if (desiredQs === currentQs) return;
    const nextUrl = desiredQs ? `${pathname}?${desiredQs}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [selectedBookSlug, selectedPageSlug, pathname, router, searchParams]);

  // ── Load pages when book changes ──────────────────────────────────────────
  useEffect(() => {
    if (!selectedBookSlug) { setPages([]); return; }
    fetch(`/api/v2/books/${selectedBookSlug}/pages`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPages(d.data); });
  }, [selectedBookSlug]);

  // ── Load page when selection changes ─────────────────────────────────────
  useEffect(() => {
    if (!selectedBookSlug || !selectedPageSlug) {
      setCurrentPage(null);
      setBlocks([]);
      setPageTitle('');
      setPageSubtitle('');
      setIsDirty(false);
      return;
    }
    setLoadingPage(true);
    fetch(`/api/v2/books/${selectedBookSlug}/pages/${selectedPageSlug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const pg: BookPage = d.data;
          setCurrentPage(pg);
          setBlocks(pg.blocks.slice().sort((a, b) => a.order - b.order));
          setPageTitle(pg.title);
          setPageSubtitle(pg.subtitle ?? '');
          setIsDirty(false);
        }
      })
      .finally(() => setLoadingPage(false));
  }, [selectedBookSlug, selectedPageSlug]);

  // ── Auto-save (30s after last change) ────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => { save(); }, 30_000);
    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty, blocks, pageTitle, pageSubtitle]);

  // ── Save ─────────────────────────────────────────────────────────────────
  const save = useCallback(async () => {
    if (!selectedBookSlug || !selectedPageSlug || isSaving) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`/api/v2/books/${selectedBookSlug}/pages/${selectedPageSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: pageTitle, subtitle: pageSubtitle || undefined, blocks }),
      });
      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        // Update page list reading time
        setPages((prev) =>
          prev.map((p) =>
            p.slug === selectedPageSlug
              ? { ...p, title: pageTitle, reading_time_min: data.data.reading_time_min }
              : p
          )
        );
      } else {
        setSaveError(data.error || 'Save failed');
      }
    } catch {
      setSaveError('Network error');
    } finally {
      setIsSaving(false);
    }
  }, [selectedBookSlug, selectedPageSlug, isSaving, pageTitle, pageSubtitle, blocks]);

  // ── Keyboard shortcut Cmd+S ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) save();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDirty, save]);

  // ── Block operations ──────────────────────────────────────────────────────
  function addBlock(type: BlockType, afterId?: string) {
    setBlocks((prev) => {
      const newBlock = defaultBlock(type, 0);
      let next: ContentBlock[];
      if (!afterId) {
        next = [...prev, newBlock];
      } else {
        const idx = prev.findIndex((b) => b.id === afterId);
        next = [...prev.slice(0, idx + 1), newBlock, ...prev.slice(idx + 1)];
      }
      return reindexOrders(next);
    });
    setIsDirty(true);
  }

  function updateBlock(id: string, patch: Partial<ContentBlock>) {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? ({ ...b, ...patch } as ContentBlock) : b))
    );
    setIsDirty(true);
  }

  function deleteBlock(id: string) {
    setBlocks((prev) => reindexOrders(prev.filter((b) => b.id !== id)));
    setIsDirty(true);
  }

  function reorderBlocks(reordered: ContentBlock[]) {
    setBlocks(reindexOrders(reordered));
    setIsDirty(true);
  }

  // ── Upload helper (passed down to block editors) ──────────────────────────
  const upload: UploadFn = async (file, blockId) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('book_id', selectedBook?._id ?? '');
    fd.append('chapter_number', String(
      pages.find((p) => p.slug === selectedPageSlug)?.chapter_number ?? 1
    ));
    fd.append('block_id', blockId);
    const res = await fetch('/api/v2/books/assets/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url as string;
  };

  // ── Sidebar callbacks (stable refs so memo'd sidebar doesn't re-render) ──
  const onSelectBookForSidebar = useCallback((slug: string) => {
    setSelectedBookSlug(slug);
    setSelectedPageSlug(null);
  }, []);

  const onBookCreated = useCallback((book: Book) => {
    setBooks((prev) => [book, ...prev]);
    setSelectedBookSlug(book.slug);
    setSelectedPageSlug(null);
  }, []);

  const onBookUpdated = useCallback((book: Book) => {
    setBooks((prev) => prev.map((b) => (b.slug === book.slug ? book : b)));
  }, []);

  const onPageCreated = useCallback((page: PageSummary) => {
    setPages((prev) => [...prev, page]);
    setSelectedPageSlug(page.slug);
  }, []);

  const onPageDeleted = useCallback((slug: string) => {
    setPages((prev) => prev.filter((p) => p.slug !== slug));
    setSelectedPageSlug((cur) => (cur === slug ? null : cur));
  }, []);

  const onPageTogglePublish = useCallback((slug: string, published: boolean) => {
    setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, published } : p)));
  }, []);

  // When an admin publishes/unpublishes a chapter the API also cascades
  // published=true onto every page in that chapter (on publish only), so we
  // update both the chapter flag in the book and the in-memory page list.
  const onChapterTogglePublish = useCallback((bookSlug: string, chapterNumber: number, isPublished: boolean) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.slug !== bookSlug
          ? b
          : {
              ...b,
              chapters: b.chapters.map((c) =>
                c.number === chapterNumber ? { ...c, is_published: isPublished } : c
              ),
            }
      )
    );
    if (isPublished) {
      setPages((prev) =>
        prev.map((p) => (p.chapter_number === chapterNumber ? { ...p, published: true } : p))
      );
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#050505] text-white overflow-hidden">

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-4 h-12
        border-b border-white/8 bg-[#0B0F15] gap-4 overflow-hidden">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          <BookOpen size={16} className="text-orange-500 shrink-0" />
          <span className="text-sm font-semibold text-white/80 shrink-0">Live Books</span>
          {selectedBook && (
            <>
              <span className="text-white/20 text-sm shrink-0">/</span>
              <span className="text-sm text-white/50 truncate max-w-32">{selectedBook.title}</span>
            </>
          )}
          {currentPage && (
            <>
              <span className="text-white/20 text-sm shrink-0">/</span>
              <input
                value={pageTitle}
                onChange={(e) => { setPageTitle(e.target.value); setIsDirty(true); }}
                className="text-sm text-white bg-transparent border-none outline-none
                  hover:bg-white/5 focus:bg-white/5 px-1.5 py-0.5 rounded-md w-36 min-w-0"
                placeholder="Page title"
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {saveError && (
            <span className="text-xs text-red-400">{saveError}</span>
          )}
          {isDirty && !isSaving && (
            <span className="text-xs text-white/30">Unsaved</span>
          )}

          {currentPage && (
            <div className="flex items-center rounded-lg border border-white/10 overflow-hidden">
              {([
                { mode: 'edit',    icon: <PanelLeft size={13} />,  label: 'Edit'    },
                { mode: 'split',   icon: <Columns2  size={13} />,  label: 'Split'   },
                { mode: 'preview', icon: <Eye       size={13} />,  label: 'Preview' },
              ] as const).map(({ mode, icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs transition-colors
                    ${viewMode === mode
                      ? 'bg-orange-500/20 text-orange-300'
                      : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/8'}`}
                >
                  {icon}{label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={save}
            disabled={!isDirty || isSaving || !currentPage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold
              bg-gradient-to-r from-orange-500 to-amber-500 text-black
              hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            <Save size={13} />
            {isSaving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <BookSidebar
          books={books}
          pages={pages}
          selectedBookSlug={selectedBookSlug}
          selectedPageSlug={selectedPageSlug}
          onSelectBook={onSelectBookForSidebar}
          onSelectPage={setSelectedPageSlug}
          onBookCreated={onBookCreated}
          onBookUpdated={onBookUpdated}
          onPageCreated={onPageCreated}
          onPageDeleted={onPageDeleted}
          onPageTogglePublish={onPageTogglePublish}
          onChapterTogglePublish={onChapterTogglePublish}
        />

        {/* Main content */}
        <main ref={mainRef} className="flex-1 flex overflow-hidden">

          {/* Empty states */}
          {!selectedBook && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-white/30">
              <BookOpen size={40} />
              <p className="text-sm">Select or create a book to get started</p>
            </div>
          )}

          {selectedBook && !selectedPageSlug && (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-white/30">
              <p className="text-sm">Select a page from the sidebar to start editing</p>
            </div>
          )}

          {selectedBook && selectedPageSlug && loadingPage && (
            <div className="flex-1 flex items-center justify-center text-white/30 text-sm">
              Loading page…
            </div>
          )}

          {selectedBook && currentPage && !loadingPage && (
            <>
              {/* Editor pane — hidden in preview-only mode */}
              {viewMode !== 'preview' && (
                <div
                  className="overflow-y-auto shrink-0"
                  style={viewMode === 'split' ? { width: `${splitPos}%` } : { flex: 1 }}
                >
                  <BlockEditor
                    blocks={blocks}
                    pageSubtitle={pageSubtitle}
                    onSubtitleChange={(v) => { setPageSubtitle(v); setIsDirty(true); }}
                    onAddBlock={addBlock}
                    onUpdateBlock={updateBlock}
                    onDeleteBlock={deleteBlock}
                    onReorder={reorderBlocks}
                    onUpload={upload}
                  />
                </div>
              )}

              {/* Draggable divider — only in split mode */}
              {viewMode === 'split' && (
                <div
                  onMouseDown={onDividerMouseDown}
                  className="w-1 shrink-0 cursor-col-resize bg-white/8 hover:bg-orange-500/50
                    transition-colors duration-150 relative group"
                  title="Drag to resize"
                >
                  {/* grip dots */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity">
                    {[0,1,2,3,4].map((i) => (
                      <div key={i} className="w-[3px] h-[3px] rounded-full bg-orange-400/80" />
                    ))}
                  </div>
                </div>
              )}

              {/* Preview pane — hidden in edit-only mode */}
              {viewMode !== 'edit' && (
                <div
                  className="overflow-y-auto bg-[#050505]"
                  style={viewMode === 'split' ? { flex: 1 } : { flex: 1 }}
                >
                  {viewMode === 'split' && (
                    <div className="sticky top-0 z-10 px-4 py-1.5 bg-[#0B0F15] border-b border-white/8
                      flex items-center gap-1.5">
                      <Eye size={11} className="text-orange-400" />
                      <span className="text-[11px] text-white/40 font-medium uppercase tracking-wide">Live Preview</span>
                    </div>
                  )}
                  <PageRenderer
                    page={{ title: pageTitle, subtitle: pageSubtitle || undefined, blocks, reading_time_min: currentPage.reading_time_min }}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
