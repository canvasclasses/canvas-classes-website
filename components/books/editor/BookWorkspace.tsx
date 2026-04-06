'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Eye, EyeOff, Save, BookOpen } from 'lucide-react';
import { Book, BookPage, ContentBlock, BlockType } from '@/types/books';
import BookSidebar from './BookSidebar';
import BlockEditor from './BlockEditor';
import PageRenderer from '../renderer/PageRenderer';

// ─── helpers ──────────────────────────────────────────────────────────────────

function defaultBlock(type: BlockType, order: number): ContentBlock {
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
  // Books + navigation
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBookSlug, setSelectedBookSlug] = useState<string | null>(null);
  const [pages, setPages] = useState<PageSummary[]>([]);
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // Editor state
  const [currentPage, setCurrentPage] = useState<BookPage | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');

  // UI state
  const [previewMode, setPreviewMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectedBook = books.find((b) => b.slug === selectedBookSlug) ?? null;

  // ── Load books on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/v2/books')
      .then((r) => r.json())
      .then((d) => { if (d.success) setBooks(d.data); });
  }, []);

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

  // ── Sidebar callbacks ─────────────────────────────────────────────────────
  function onBookCreated(book: Book) {
    setBooks((prev) => [book, ...prev]);
    setSelectedBookSlug(book.slug);
    setSelectedPageSlug(null);
  }

  function onBookUpdated(book: Book) {
    setBooks((prev) => prev.map((b) => (b.slug === book.slug ? book : b)));
  }

  function onPageCreated(page: PageSummary) {
    setPages((prev) => [...prev, page]);
    setSelectedPageSlug(page.slug);
  }

  function onPageDeleted(slug: string) {
    setPages((prev) => prev.filter((p) => p.slug !== slug));
    if (selectedPageSlug === slug) setSelectedPageSlug(null);
  }

  function onPageTogglePublish(slug: string, published: boolean) {
    setPages((prev) => prev.map((p) => (p.slug === slug ? { ...p, published } : p)));
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#050505] text-white overflow-hidden">

      {/* ── Topbar ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-4 h-12
        border-b border-white/8 bg-[#0B0F15]">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-orange-500" />
          <span className="text-sm font-semibold text-white/80">Digital Books</span>
          {selectedBook && (
            <>
              <span className="text-white/20 text-sm">/</span>
              <span className="text-sm text-white/50 truncate max-w-48">{selectedBook.title}</span>
            </>
          )}
          {currentPage && (
            <>
              <span className="text-white/20 text-sm">/</span>
              <input
                value={pageTitle}
                onChange={(e) => { setPageTitle(e.target.value); setIsDirty(true); }}
                className="text-sm text-white bg-transparent border-none outline-none
                  hover:bg-white/5 focus:bg-white/5 px-1.5 py-0.5 rounded-md max-w-52"
                placeholder="Page title"
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {saveError && (
            <span className="text-xs text-red-400">{saveError}</span>
          )}
          {isDirty && !isSaving && (
            <span className="text-xs text-white/30">Unsaved</span>
          )}

          {currentPage && (
            <button
              onClick={() => setPreviewMode((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                bg-white/5 border border-white/10 hover:bg-white/10 text-xs transition-colors"
            >
              {previewMode ? <EyeOff size={13} /> : <Eye size={13} />}
              {previewMode ? 'Edit' : 'Preview'}
            </button>
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
          onSelectBook={(slug) => { setSelectedBookSlug(slug); setSelectedPageSlug(null); }}
          onSelectPage={setSelectedPageSlug}
          onBookCreated={onBookCreated}
          onBookUpdated={onBookUpdated}
          onPageCreated={onPageCreated}
          onPageDeleted={onPageDeleted}
          onPageTogglePublish={onPageTogglePublish}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {!selectedBook && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/30">
              <BookOpen size={40} />
              <p className="text-sm">Select or create a book to get started</p>
            </div>
          )}

          {selectedBook && !selectedPageSlug && (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-white/30">
              <p className="text-sm">Select a page from the sidebar to start editing</p>
            </div>
          )}

          {selectedBook && selectedPageSlug && loadingPage && (
            <div className="flex items-center justify-center h-full text-white/30 text-sm">
              Loading page…
            </div>
          )}

          {selectedBook && currentPage && !loadingPage && (
            previewMode ? (
              <div className="bg-[#050505]">
                <PageRenderer
                  page={{ title: pageTitle, subtitle: pageSubtitle || undefined, blocks, reading_time_min: currentPage.reading_time_min }}
                />
              </div>
            ) : (
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
            )
          )}
        </main>
      </div>
    </div>
  );
}
