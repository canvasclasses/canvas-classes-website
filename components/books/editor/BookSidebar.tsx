'use client';

import { useState, memo } from 'react';
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
  onChapterTogglePublish: (bookSlug: string, chapterNumber: number, isPublished: boolean) => void;
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
const ALL_GRADES = [6, 7, 8, 9, 10, 11, 12];

function BookSidebarInner({
  books, pages, selectedBookSlug, selectedPageSlug,
  onSelectBook, onSelectPage, onBookCreated, onBookUpdated,
  onPageCreated, onPageDeleted, onPageTogglePublish, onChapterTogglePublish,
}: Props) {
  const [showNewBook, setShowNewBook] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState<Set<string>>(new Set());
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

  // Grade filter — null means "All classes"
  const [gradeFilter, setGradeFilter] = useState<number | null>(null);

  // Count books per grade for badge display
  const gradeCount = ALL_GRADES.reduce<Record<number, number>>((acc, g) => {
    acc[g] = books.filter((b) => b.grade === g).length;
    return acc;
  }, {});

  // Only the grades that have at least one book are shown as pills
  const activeGrades = ALL_GRADES.filter((g) => gradeCount[g] > 0);

  // Books visible in the list after applying the grade filter
  const visibleBooks = gradeFilter === null
    ? books
    : books.filter((b) => b.grade === gradeFilter);

  // New chapter form per book
  const [addingChapter, setAddingChapter] = useState<string | null>(null);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [savingChapter, setSavingChapter] = useState(false);

  // New page form per chapter key "bookSlug:chapterNum"
  const [addingPage, setAddingPage] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [savingPage, setSavingPage] = useState(false);

  // Track which chapter publish request is currently in-flight by "bookSlug:num"
  const [publishingChapter, setPublishingChapter] = useState<string | null>(null);
  // Track which book publish request is currently in-flight
  const [publishingBook, setPublishingBook] = useState<string | null>(null);

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
          chapters: [
            ...book.chapters,
            // New chapters start as drafts — admin publishes explicitly.
            { number: nextNum, title: newChapterTitle, slug, page_ids: [], is_published: false },
          ],
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

  async function toggleChapterPublish(bookSlug: string, chapter: BookChapter) {
    const chKey = `${bookSlug}:${chapter.number}`;
    if (publishingChapter === chKey) return;

    const willPublish = !chapter.is_published;
    if (!willPublish) {
      if (!confirm(`Unpublish "${chapter.title}"? Students will no longer see its pages.`)) return;
    }

    setPublishingChapter(chKey);
    try {
      const res = await fetch(
        `/api/v2/books/${bookSlug}/chapters/${chapter.number}/publish`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publish: willPublish }),
        }
      );
      const d = await res.json();
      if (d.success) {
        onChapterTogglePublish(bookSlug, chapter.number, d.data.is_published);
      } else {
        alert(d.error || 'Failed to toggle chapter publish state');
      }
    } catch {
      alert('Network error while toggling chapter publish state');
    } finally {
      setPublishingChapter(null);
    }
  }

  async function toggleBookPublish(book: Book) {
    if (publishingBook === book.slug) return;
    const willPublish = !book.is_published;
    if (!willPublish) {
      if (!confirm(`Unpublish "${book.title}"? The entire book will disappear for students.`)) return;
    }
    setPublishingBook(book.slug);
    try {
      const res = await fetch(`/api/v2/books/${book.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: willPublish }),
      });
      const d = await res.json();
      if (d.success) {
        onBookUpdated(d.data);
      } else {
        alert(d.error || 'Failed to toggle book publish state');
      }
    } catch {
      alert('Network error while toggling book publish state');
    } finally {
      setPublishingBook(null);
    }
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

      {/* ── Grade filter pills ────────────────────────────────────────── */}
      {activeGrades.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/8 overflow-x-auto shrink-0">
          {/* "All" pill */}
          <button
            onClick={() => setGradeFilter(null)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              gradeFilter === null
                ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40'
                : 'text-white/35 hover:text-white/60 border border-transparent hover:border-white/15'
            }`}
          >
            All
            <span className={`ml-1 tabular-nums ${gradeFilter === null ? 'text-orange-300/70' : 'text-white/20'}`}>
              {books.length}
            </span>
          </button>

          {activeGrades.map((g) => (
            <button
              key={g}
              onClick={() => setGradeFilter(gradeFilter === g ? null : g)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                gradeFilter === g
                  ? 'bg-orange-500/25 text-orange-300 border border-orange-500/40'
                  : 'text-white/35 hover:text-white/60 border border-transparent hover:border-white/15'
              }`}
            >
              Cl {g}
              <span className={`ml-1 tabular-nums ${gradeFilter === g ? 'text-orange-300/70' : 'text-white/20'}`}>
                {gradeCount[g]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Book list */}
      <div className="flex-1 overflow-y-auto">
        {visibleBooks.length === 0 && (
          <p className="px-3 py-4 text-xs text-white/25 text-center">
            {gradeFilter ? `No Class ${gradeFilter} books yet` : 'No books yet'}
          </p>
        )}

        {visibleBooks.map((book) => {
          const isBookExpanded = expandedBooks.has(book.slug) || selectedBookSlug === book.slug;
          const isSelected = selectedBookSlug === book.slug;
          const bookPages = pages; // pages already filtered by selectedBookSlug in workspace

          return (
            <div key={book.slug}>
              {/* Book row */}
              <div className={`group flex items-center gap-2 px-3 py-2 transition-colors
                ${isSelected ? 'bg-orange-500/10' : 'hover:bg-white/[0.03]'}`}>
                <button
                  onClick={() => toggleBook(book.slug)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <BookOpen size={13} className={isSelected ? 'text-orange-400' : 'text-white/40'} />
                  <span className={`flex-1 text-xs truncate ${isSelected ? 'text-white font-medium' : 'text-white/70'}`}>
                    {book.title}
                  </span>
                </button>

                {/* Book publish toggle */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookPublish(book); }}
                  disabled={publishingBook === book.slug}
                  title={
                    publishingBook === book.slug
                      ? 'Working…'
                      : book.is_published
                        ? 'Book is LIVE — click to unpublish'
                        : 'Book is DRAFT — click to publish'
                  }
                  className={`shrink-0 p-0.5 rounded transition-opacity disabled:opacity-40 ${
                    book.is_published
                      ? 'opacity-100'
                      : 'opacity-40 group-hover:opacity-100'
                  }`}
                >
                  {book.is_published
                    ? <Globe size={12} className="text-emerald-400" />
                    : <GlobeLock size={12} className="text-white/40 hover:text-orange-400" />}
                </button>

                <button onClick={() => toggleBook(book.slug)} className="shrink-0">
                  {isBookExpanded
                    ? <ChevronDown size={12} className="text-white/30" />
                    : <ChevronRight size={12} className="text-white/30" />}
                </button>
              </div>

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

                      const isChapterPublished = Boolean(chapter.is_published);
                      const isPublishingThis = publishingChapter === chKey;

                      return (
                        <div key={chapter.number}>
                          {/* Chapter row */}
                          <div
                            className="group w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/[0.03] transition-colors"
                          >
                            <button
                              onClick={() => toggleChapter(chKey)}
                              className="flex items-center gap-2 flex-1 min-w-0 text-left"
                            >
                              {isChExpanded
                                ? <ChevronDown size={11} className="text-white/25 shrink-0" />
                                : <ChevronRight size={11} className="text-white/25 shrink-0" />}
                              <span className={`flex-1 text-xs truncate ${
                                isChapterPublished ? 'text-emerald-300/85' : 'text-white/50'
                              }`}>
                                {chapter.title}
                              </span>
                              <span className="text-[10px] text-white/25">{chPages.length}</span>
                            </button>

                            {/* Chapter publish toggle */}
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleChapterPublish(book.slug, chapter); }}
                              disabled={isPublishingThis}
                              title={
                                isPublishingThis
                                  ? 'Working…'
                                  : isChapterPublished
                                    ? 'Chapter is LIVE — click to unpublish'
                                    : 'Chapter is DRAFT — click to publish'
                              }
                              className={`shrink-0 p-0.5 rounded transition-opacity disabled:opacity-40 ${
                                isChapterPublished
                                  ? 'opacity-100'
                                  : 'opacity-40 group-hover:opacity-100'
                              }`}
                            >
                              {isChapterPublished
                                ? <Globe size={12} className="text-emerald-400" />
                                : <GlobeLock size={12} className="text-white/40 hover:text-orange-400" />}
                            </button>
                          </div>

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

// Memo prevents re-rendering the sidebar when only editor state (blocks,
// save status) changes — the sidebar only needs to re-render when books,
// pages, or selection changes.
const BookSidebar = memo(BookSidebarInner);
export default BookSidebar;
