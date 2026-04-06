'use client';

import { useState } from 'react';
import {
  Plus, ChevronDown, ChevronRight, FileText, Eye, EyeOff,
  Trash2, BookOpen, ChevronUp, Globe, GlobeLock,
} from 'lucide-react';
import { Book, BookChapter } from '@/types/books';

interface PageSummary {
  _id: string;
  slug: string;
  title: string;
  chapter_number: number;
  page_number: number;
  published: boolean;
  reading_time_min?: number;
}

interface Props {
  books: Book[];
  pages: PageSummary[];
  selectedBookSlug: string | null;
  selectedPageSlug: string | null;
  onSelectBook: (slug: string) => void;
  onSelectPage: (slug: string) => void;
  onBookCreated: (book: Book) => void;
  onBookUpdated: (book: Book) => void;
  onPageCreated: (page: PageSummary) => void;
  onPageDeleted: (slug: string) => void;
  onPageTogglePublish: (slug: string, published: boolean) => void;
}

type Subject = 'chemistry' | 'biology' | 'physics' | 'mathematics';
type Board = 'ncert' | 'cbse' | 'icse' | 'custom';

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

// ── New Book Form ──────────────────────────────────────────────────────────────
function NewBookForm({ onCreated, onCancel }: { onCreated: (b: Book) => void; onCancel: () => void }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [subject, setSubject] = useState<Subject>('chemistry');
  const [grade, setGrade] = useState(11);
  const [board, setBoard] = useState<Board>('ncert');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/v2/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug: slug || toSlug(title), subject, grade, board }),
      });
      const d = await res.json();
      if (d.success) { onCreated(d.data); }
      else setError(d.error || 'Failed');
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="p-3 border-b border-white/8 bg-[#0B0F15] flex flex-col gap-2">
      <p className="text-xs font-semibold text-white/60">New Book</p>
      <input
        autoFocus
        value={title}
        onChange={(e) => { setTitle(e.target.value); if (!slugEdited) setSlug(toSlug(e.target.value)); }}
        placeholder="Title"
        className="w-full px-2 py-1.5 bg-[#151E32] border border-white/10 rounded-lg
          text-xs text-white placeholder-white/25 focus:outline-none focus:border-orange-500/50"
        required
      />
      <input
        value={slug}
        onChange={(e) => { setSlugEdited(true); setSlug(e.target.value.replace(/[^a-z0-9-]/g, '')); }}
        placeholder="url-slug"
        className="w-full px-2 py-1.5 bg-[#151E32] border border-white/10 rounded-lg
          text-xs text-white/70 placeholder-white/25 focus:outline-none focus:border-orange-500/50"
      />
      <div className="grid grid-cols-2 gap-2">
        <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)}
          className="px-2 py-1.5 bg-[#151E32] border border-white/10 rounded-lg text-xs text-white focus:outline-none">
          {['chemistry','biology','physics','mathematics'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={grade} onChange={(e) => setGrade(parseInt(e.target.value))}
          className="px-2 py-1.5 bg-[#151E32] border border-white/10 rounded-lg text-xs text-white focus:outline-none">
          {[6,7,8,9,10,11,12].map((g) => <option key={g} value={g}>Gr {g}</option>)}
        </select>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel}
          className="flex-1 py-1.5 rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80">
          Cancel
        </button>
        <button type="submit" disabled={saving || !title}
          className="flex-1 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500
            text-black text-xs font-bold disabled:opacity-50">
          {saving ? '…' : 'Create'}
        </button>
      </div>
    </form>
  );
}

// ── Main Sidebar ───────────────────────────────────────────────────────────────
export default function BookSidebar({
  books, pages, selectedBookSlug, selectedPageSlug,
  onSelectBook, onSelectPage, onBookCreated, onBookUpdated,
  onPageCreated, onPageDeleted, onPageTogglePublish,
}: Props) {
  const [showNewBook, setShowNewBook] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // New chapter form per book
  const [addingChapter, setAddingChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [savingChapter, setSavingChapter] = useState(false);

  // New page form per chapter key "bookSlug:chapterNum"
  const [addingPage, setAddingPage] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [savingPage, setSavingPage] = useState(false);

  const selectedBook = books.find((b) => b.slug === selectedBookSlug) ?? null;

  function toggleBook(slug: string) {
    if (selectedBookSlug !== slug) {
      onSelectBook(slug);
      setExpandedBooks((prev) => new Set([...prev, slug]));
    } else {
      setExpandedBooks((prev) => {
        const next = new Set(prev);
        next.has(slug) ? next.delete(slug) : next.add(slug);
        return next;
      });
    }
  }

  function toggleChapter(key: string) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function addChapter(bookSlug: string) {
    if (!newChapterTitle.trim()) return;
    const book = books.find((b) => b.slug === bookSlug);
    if (!book) return;
    setSavingChapter(true);
    const nextNum = book.chapters.length > 0
      ? Math.max(...book.chapters.map((c) => c.number)) + 1 : 1;
    const slug = toSlug(newChapterTitle);
    try {
      const res = await fetch(`/api/v2/books/${bookSlug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapters: [...book.chapters, { number: nextNum, title: newChapterTitle, slug, page_ids: [] }],
        }),
      });
      const d = await res.json();
      if (d.success) {
        onBookUpdated(d.data);
        setExpandedChapters((prev) => new Set([...prev, `${bookSlug}:${nextNum}`]));
      }
    } catch { /* silent */ }
    finally { setSavingChapter(false); setAddingChapter(null); setNewChapterTitle(''); }
  }

  async function addPage(bookSlug: string, chapterNum: number) {
    if (!newPageTitle.trim()) return;
    setSavingPage(true);
    const chapterPages = pages.filter((p) => p.chapter_number === chapterNum);
    const pageNum = chapterPages.length + 1;
    const slug = toSlug(newPageTitle) || `page-${pageNum}`;

    const templateBlocks = [
      {
        id: crypto.randomUUID(),
        type: 'callout',
        order: 0,
        variant: 'fun_fact',
        title: 'The Hook',
        markdown: 'Why does this matter in real life? Start with a relatable example or surprising fact.',
      },
      {
        id: crypto.randomUUID(),
        type: 'text',
        order: 1,
        markdown: 'Explain the core concept here in simple, jargon-free language.',
      },
      {
        id: crypto.randomUUID(),
        type: 'image',
        order: 2,
        src: '',
        alt: '',
        width: 'full',
      },
      {
        id: crypto.randomUUID(),
        type: 'callout',
        order: 3,
        variant: 'exam_tip',
        title: 'Real-World / Exam Insight',
        markdown: 'How does this appear in JEE/NEET? Any industrial or practical application worth noting?',
      },
    ];

    try {
      const res = await fetch(`/api/v2/books/${bookSlug}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPageTitle,
          slug,
          chapter_number: chapterNum,
          page_number: pageNum,
          blocks: templateBlocks,
        }),
      });
      const d = await res.json();
      if (d.success) onPageCreated(d.data);
    } catch { /* silent */ }
    finally { setSavingPage(false); setAddingPage(null); setNewPageTitle(''); }
  }

  async function deletePage(bookSlug: string, pageSlug: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/v2/books/${bookSlug}/pages/${pageSlug}`, { method: 'DELETE' });
    const d = await res.json();
    if (d.success) onPageDeleted(pageSlug);
  }

  async function togglePublish(bookSlug: string, pageSlug: string, currentlyPublished: boolean) {
    const res = await fetch(`/api/v2/books/${bookSlug}/pages/${pageSlug}/publish`, { method: 'POST' });
    const d = await res.json();
    if (d.success) onPageTogglePublish(pageSlug, d.data.published);
  }

  return (
    <aside className="w-72 shrink-0 flex flex-col border-r border-white/8 bg-[#0B0F15] overflow-hidden">

      {/* Top bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/8">
        <span className="text-xs font-semibold text-white/50 uppercase tracking-wide">Books</span>
        <button
          onClick={() => setShowNewBook((v) => !v)}
          className="flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
          title="New book"
        >
          <Plus size={13} />
          New
        </button>
      </div>

      {/* New book form */}
      {showNewBook && (
        <NewBookForm
          onCreated={(b) => { onBookCreated(b); setShowNewBook(false); setExpandedBooks((prev) => new Set([...prev, b.slug])); }}
          onCancel={() => setShowNewBook(false)}
        />
      )}

      {/* Book list */}
      <div className="flex-1 overflow-y-auto">
        {books.length === 0 && (
          <p className="px-3 py-4 text-xs text-white/25 text-center">No books yet</p>
        )}

        {books.map((book) => {
          const isBookExpanded = expandedBooks.has(book.slug) || selectedBookSlug === book.slug;
          const isSelected = selectedBookSlug === book.slug;
          const bookPages = pages; // pages already filtered by selectedBookSlug in workspace

          return (
            <div key={book.slug}>
              {/* Book row */}
              <button
                onClick={() => toggleBook(book.slug)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors
                  ${isSelected ? 'bg-orange-500/10' : 'hover:bg-white/[0.03]'}`}
              >
                <BookOpen size={13} className={isSelected ? 'text-orange-400' : 'text-white/40'} />
                <span className={`flex-1 text-xs truncate ${isSelected ? 'text-white font-medium' : 'text-white/70'}`}>
                  {book.title}
                </span>
                {isBookExpanded
                  ? <ChevronDown size={12} className="text-white/30 shrink-0" />
                  : <ChevronRight size={12} className="text-white/30 shrink-0" />
                }
              </button>

              {/* Chapters (only show for selected book) */}
              {isSelected && isBookExpanded && (
                <div className="pl-2">
                  {book.chapters
                    .slice()
                    .sort((a, b) => a.number - b.number)
                    .map((chapter) => {
                      const chKey = `${book.slug}:${chapter.number}`;
                      const isChExpanded = expandedChapters.has(chKey);
                      const chPages = bookPages
                        .filter((p) => p.chapter_number === chapter.number)
                        .sort((a, b) => a.page_number - b.page_number);

                      return (
                        <div key={chapter.number}>
                          {/* Chapter row */}
                          <button
                            onClick={() => toggleChapter(chKey)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-white/[0.03] transition-colors"
                          >
                            {isChExpanded
                              ? <ChevronDown size={11} className="text-white/25 shrink-0" />
                              : <ChevronRight size={11} className="text-white/25 shrink-0" />}
                            <span className="flex-1 text-xs text-white/50 truncate">{chapter.title}</span>
                            <span className="text-[10px] text-white/25">{chPages.length}</span>
                          </button>

                          {/* Pages */}
                          {isChExpanded && (
                            <div className="pl-4">
                              {chPages.map((page) => (
                                <div
                                  key={page.slug}
                                  className={`group flex items-center gap-1.5 px-2 py-1 rounded-lg mx-1 mb-0.5
                                    transition-colors cursor-pointer
                                    ${selectedPageSlug === page.slug
                                      ? 'bg-orange-500/15 text-orange-300'
                                      : 'hover:bg-white/5 text-white/55'}`}
                                  onClick={() => onSelectPage(page.slug)}
                                >
                                  <FileText size={11} className="shrink-0" />
                                  <span className="flex-1 text-xs truncate">{page.title}</span>

                                  {/* Publish toggle */}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); togglePublish(book.slug, page.slug, page.published); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                    title={page.published ? 'Unpublish' : 'Publish'}
                                  >
                                    {page.published
                                      ? <Eye size={11} className="text-emerald-400" />
                                      : <EyeOff size={11} className="text-white/30" />}
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={(e) => { e.stopPropagation(); deletePage(book.slug, page.slug, page.title); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              ))}

                              {/* Add page */}
                              {addingPage === chKey ? (
                                <div className="mx-1 mb-1 flex gap-1">
                                  <input
                                    autoFocus
                                    value={newPageTitle}
                                    onChange={(e) => setNewPageTitle(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') addPage(book.slug, chapter.number);
                                      if (e.key === 'Escape') { setAddingPage(null); setNewPageTitle(''); }
                                    }}
                                    placeholder="Page title…"
                                    className="flex-1 px-2 py-1 bg-[#151E32] border border-orange-500/30 rounded-lg
                                      text-xs text-white placeholder-white/25 focus:outline-none"
                                  />
                                  <button
                                    onClick={() => addPage(book.slug, chapter.number)}
                                    disabled={savingPage || !newPageTitle.trim()}
                                    className="px-2 py-1 rounded-lg bg-orange-500 text-black text-xs font-bold disabled:opacity-50"
                                  >
                                    {savingPage ? '…' : '↵'}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setAddingPage(chKey); setNewPageTitle(''); }}
                                  className="flex items-center gap-1 px-3 py-1 text-[11px] text-white/25
                                    hover:text-orange-400/70 transition-colors"
                                >
                                  <Plus size={11} /> Add page
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* Add chapter */}
                  {addingChapter === book.slug ? (
                    <div className="px-3 py-2 flex gap-1">
                      <input
                        autoFocus
                        value={newChapterTitle}
                        onChange={(e) => setNewChapterTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addChapter(book.slug);
                          if (e.key === 'Escape') { setAddingChapter(null); setNewChapterTitle(''); }
                        }}
                        placeholder="Chapter title…"
                        className="flex-1 px-2 py-1 bg-[#151E32] border border-orange-500/30 rounded-lg
                          text-xs text-white placeholder-white/25 focus:outline-none"
                      />
                      <button
                        onClick={() => addChapter(book.slug)}
                        disabled={savingChapter || !newChapterTitle.trim()}
                        className="px-2 py-1 rounded-lg bg-orange-500 text-black text-xs font-bold disabled:opacity-50"
                      >
                        {savingChapter ? '…' : '↵'}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setAddingChapter(book.slug); setNewChapterTitle(''); }}
                      className="flex items-center gap-1 px-5 py-1.5 text-[11px] text-white/25
                        hover:text-orange-400/70 transition-colors"
                    >
                      <Plus size={11} /> Add chapter
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
